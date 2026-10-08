import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (LMS) · 1-dars «Oltita g'oyani qayerdan topasiz?» — PM 2-tur, 15 ekran (kalit m9-01, kod papkasi src/9-Modull).
// Manba-haqiqat: feedback/F-1005-11modul/01-PmTenIdeas-v3.md (GATE M). Skeletdan (src/skelet/NamunaDars.jsx) qurilgan, qolip — src/qolip.
// Oqim: kirish → reja → g'oya (tushuncha) → 1-savol → uch manba → 2-savol → Starbucks → 3-savol → oltita g'oya → faqat yechim → kod → yakuniy savol → podium → kartochkalar → yakun.
// Saqlanadi: pm-m9d1-goyalar (8-ekran; 2-dars o'qiydi) · pm-m9d1-code (kod oynasi). O'qiydi: pm-m7d1-muammolar, pm-m7d3-mvp (yo'q bo'lsa ham ishlaydi).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';
// Kod oynasi (kompilyator) — umumiy modul
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

const LESSON_META = { lessonId: 'pm-m9d1-v1', lessonTitle: { uz: "Oltita g'oyani qayerdan topasiz?", ru: 'Где найти шесть идей?' } };
// 15 ekran · PM 2-tur (artefakt — oltita yozma g'oya; foydalanuvchi qarori 06.10 — 6 g'oya, F-1006-272) · ballik testlar 3, 5, 7, 11 (✔ C · A · D · B)
const HW_TOKENS = [
  { t: { uz: "g'oya", ru: 'идея' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'muammo', ru: 'проблема' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'yechim', ru: 'решение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "ro'yxat", ru: 'список' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Ishtirok-kalitlar (-1): 8, 9, 10-ekran signallari (500+ zona), maxrajga kirmaydi.
// ✔ o'rni MD dagidek: s3 — C · s5 — A · s7 — D · s11 — B (yangi dars, birinchi marta belgilangan).
const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s11: 1, goyalar: -1, juftlik: -1, koding: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rnida raqam (S-026)
const RECAPS = {
  3: { title: { uz: "G'oyaning uch qismi", ru: 'Три части идеи' }, cards: [
    { ic: '1', h: { uz: 'Muammo — odamlar nimadan qiynalishi.', ru: 'Проблема — от чего страдают люди.' } },
    { ic: '2', h: { uz: 'Kim uchun — aynan qanday odamlar.', ru: 'Для кого — какие именно люди.' } },
    { ic: '3', h: { uz: 'Yechim — mahsulot nima qilishi.', ru: 'Решение — что делает продукт.' }, ask: { uz: "«Futbol ilovasi» — g'oyami? Unga nima yetishmaydi?", ru: '«Футбольное приложение» — это идея? Чего ей не хватает?' } }
  ] },
  5: { title: { uz: 'Yechim muammoga javob beradi', ru: 'Решение отвечает на проблему' }, cards: [
    { ic: '1', h: { uz: "Avval muammo qatorini o'qing.", ru: 'Сначала прочитайте строку «Проблема».' } },
    { ic: '2', h: { uz: 'Yechim aynan shu qiyinchilikni yengillashtirsin.', ru: 'Пусть решение облегчает именно эту трудность.' } },
    { ic: '3', h: { uz: 'Boshqa muammoga javob beradigan yechim mos emas.', ru: 'Решение, которое отвечает на другую проблему, не подходит.' }, ask: { uz: "Uy vazifasi chatda yo'qolsa, qaysi yechim mos?", ru: 'Если домашнее задание теряется в чате, какое решение подходит?' } }
  ] },
  7: { title: { uz: 'Starbucks — uchinchi joy', ru: 'Starbucks — третье место' }, cards: [
    { ic: '1', h: { uz: 'Qahva nuqtasi — qahva olib, chiqib ketadigan joy.', ru: 'Точка с кофе — место, где берут кофе и уходят.' } },
    { ic: '2', h: { uz: "Shuls Starbucks'ni uy bilan ish yoki maktab o'rtasidagi «uchinchi joy» qilib qurgan.", ru: 'Шульц построил Starbucks как «третье место» между домом и работой или школой.' } },
    { ic: '3', h: { uz: "Odamlar ichimlik uchun emas, joy va muhit uchun to'laydi.", ru: 'Люди платят не за напиток, а за место и атмосферу.' }, ask: { uz: "Bitta g'oyangizda odamlar mahsulotdan nima uchun foydalanadi?", ru: 'Зачем люди пользуются продуктом в одной из ваших идей?' } }
  ] },
  11: { title: { uz: "MVP davomi ham g'oya", ru: 'Продолжение MVP — тоже идея' }, cards: [
    { ic: '1', h: { uz: "O'z MVP'ingizni davom ettirish ham g'oya bo'ladi.", ru: 'Продолжение вашего MVP — тоже идея.' } },
    { ic: '2', h: { uz: 'U ham uch qism bilan yoziladi.', ru: 'Её тоже пишут тремя частями.' } },
    { ic: '3', h: { uz: "Bugun g'oyalar baholanmaydi — hammasi bitta ro'yxatda.", ru: 'Сегодня идеи не оцениваются — все в одном списке.' }, ask: { uz: "Mentorning qaysi g'oyalari «Maydon»ni davom ettiradi?", ru: 'Какие идеи Ментора продолжают «Maydon»?' } }
  ] }
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

// Testdan keyingi karta (MD: javob topilgach savol ostida) — paydo bo'lgach ko'rinadigan joyga silliq suriladi
const TestViz = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 650); return () => clearTimeout(t); }, []);
  return <div ref={ref} className="ti-test-viz fade-step">{children}</div>;
};
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
        {/* MD: javob topilgach (jonli darsda — natija ochilgandan keyin) savol ostida kichik karta */}
        {vizual && ((solved && revealed) || (isMentorLive && mReveal)) && <TestViz>{vizual}</TestViz>}
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 1-dars «Oltita g'oyani qayerdan topasiz?» (MD v3: feedback/F-1005-11modul/01-PmTenIdeas-v3.md, GATE M) =====
// Bitta vizual (163/180): g'oya kartasi GoyaKarta (to'liq · ixcham GoyaQator · yopiq qatorli) + GoyaRoyxat; bitta manba — MENTOR_GOYALAR va o'quvchi g'oyalari.
// qolip-maket: ti-qsavol ti-gq-b ti-qbos ti-tanlov ti-src-b ti-kalit ti-chiz-b
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Harakatsizlikda bitta ipucha (javobni aytmaydi): kalit o'zgarsa sanoq qaytadan boshlanadi
const useIpucha = (faol, kalit, ms = 40000) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    if (!faol) return undefined;
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [faol, kalit, ms]);
  return on;
};
// Son sanab o'sadi (SABOQ 19): ko'rsatilgan son maqsadga birma-bir yetadi; kam harakat rejimida — darrov
const useSanoq = (son, ms = 70) => {
  const [k, setK] = useState(son);
  useEffect(() => {
    if (k === son) return undefined;
    if (kamHarakat()) { setK(son); return undefined; }
    const t = setTimeout(() => setK(v => v + (son > v ? 1 : -1)), ms);
    return () => clearTimeout(t);
  }, [k, son, ms]);
  return k;
};
// Uchish (SABOQ 19, FLIP): narsa joyidan yangi joyiga uchib boradi. Manba to'rtburchagi bosishda olinadi,
// yangi joydagi element (data-uch) chizilgach o'sha nuqtadan o'z joyiga suriladi. Kam harakat rejimida — darrov joyida.
const uchir = (dan, el, ms = 560) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width; // .lesson-root zoom tuzatmasi
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.6, Math.max(0.35, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.85 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const q = useRef([]);
  useLayoutEffect(() => {
    if (!q.current.length) return;
    const navbat = q.current; q.current = [];
    navbat.forEach(u => uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback((manba, k, ms) => {
    const r = manba && (manba.getBoundingClientRect ? manba.getBoundingClientRect() : manba);
    if (r) q.current.push({ r, k, ms });
  }, []);
};
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="ti-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="ti-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="ti-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};
// 151-qonun: nishon sharti qatori (birinchi urinish); nishon olingach yoki mashq-o'tishida ko'rinmaydi
const NishonQatori = ({ screen }) => {
  const olingan = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || (olingan && olingan.has(ach))) return null;
  const ketdi = am.missed.has(sid);
  return <p className={cxx('ti-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
};
// Jonli dars: hook ovozlari chizig'i (sof so'rovnoma, J-026)
const OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [son, setSon] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const rows = await liveAnswers(pin, screen); if (on) setSon(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!son) return null;
  const jami = son.reduce((a, b) => a + b, 0);
  return (
    <div className="ti-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('ti-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="ti-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};
// Mentor statistikasi (8 va 9-ekran): jonli darsda o'quvchilar yuborgan ishtirok-signali (500+ zona) bo'yicha ikki son
const MentorSanoq = ({ screen, yorliqlar, hisob }) => {
  const { live, isMentor } = useJonli();
  const pin = live && live.pin;
  const [d, setD] = useState(null);
  useEffect(() => {
    if (!isMentor || !pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const [p, r] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]); if (on) setD({ jami: p.length, rows: r }); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [isMentor, pin, screen]); // eslint-disable-line
  if (!isMentor) return null;
  const sonlar = d ? hisob(d.rows, d.jami) : yorliqlar.map(() => '—');
  return <div className="ti-mstat fade-up">{yorliqlar.map((y, i) => <div key={i} className="ti-mstat-q"><b>{sonlar[i]}</b><span>{tr(y)}</span></div>)}</div>;
};

// ----- Ma'lumot: manbalar, qismlar, Mentorning 6 g'oyasi (tayanch 1.1 aynan, F-1006-272; 1-g'oya yechimida «+» → «va») -----
const MANBALAR = [
  { id: 'royxat', t: { uz: "9-Modul ro'yxati", ru: 'Список 9-го модуля' } },
  { id: 'keyin', t: { uz: '«Keyin» qutisi', ru: 'Коробка «Потом»' } },
  { id: 'kuzatuv', t: { uz: 'Yangi kuzatuv', ru: 'Новое наблюдение' } }
];
const manbaT = (id) => { const m = MANBALAR.find(x => x.id === id); return m ? tr(m.t) : ''; };
const QISM = [
  { k: 'muammo', t: { uz: 'Muammo', ru: 'Проблема' } },
  { k: 'kim', t: { uz: 'Kim uchun', ru: 'Для кого' } },
  { k: 'yechim', t: { uz: 'Yechim', ru: 'Решение' } }
];
const MENTOR_GOYALAR = [
  { nom: { uz: "Jamoa yig'ish", ru: 'Сбор команды' }, muammo: { uz: "o'yinga odam yetmaydi, kim kelishi noma'lum", ru: 'на игру не хватает людей, неизвестно, кто придёт' }, kim: { uz: "mahalladagi o'yinchilar", ru: 'игроки из махалли' }, yechim: { uz: "o'yin e'loni va «Qo'shilaman»", ru: 'объявление об игре и «Присоединяюсь»' }, manba: 'keyin' },
  { nom: { uz: "Maydon pulini bo'lishish", ru: 'Делить плату за поле' }, muammo: { uz: "kim qancha to'lagani unutiladi", ru: 'забывается, кто сколько заплатил' }, kim: { uz: "maydonni birga band qiladigan o'yinchilar", ru: 'игроки, которые вместе бронируют поле' }, yechim: { uz: "kim to'lagani ro'yxati", ru: 'список, кто заплатил' }, manba: 'keyin' },
  { nom: { uz: "Mahalla to'garaklari", ru: 'Кружки махалли' }, muammo: { uz: "qaysi to'garak qayerda va qachon — bilinmaydi", ru: 'какой кружок где и когда — неизвестно' }, kim: { uz: "to'garak izlayotgan o'smirlar", ru: 'подростки, которые ищут кружок' }, yechim: { uz: "to'garaklar xaritasi va jadvali", ru: 'карта и расписание кружков' }, manba: 'kuzatuv' },
  { nom: { uz: 'Sinf uy vazifalari', ru: 'Домашние задания класса' }, muammo: { uz: "uy vazifasi chatlarda yo'qoladi", ru: 'домашнее задание теряется в чатах' }, kim: { uz: 'sinfdoshlar', ru: 'одноклассники' }, yechim: { uz: "har fan bo'yicha vazifalar bir joyda", ru: 'задания по каждому предмету в одном месте' }, manba: 'kuzatuv' },
  { nom: { uz: 'Eski darsliklar', ru: 'Старые учебники' }, muammo: { uz: 'eski darsligini kimga berishni bilmaydi, u uyda yillab turadi', ru: 'не знает, кому отдать старый учебник, и он годами лежит дома' }, kim: { uz: "o'quvchilar", ru: 'ученики' }, yechim: { uz: "ishlatilgan darsliklar e'loni", ru: 'объявления о б/у учебниках' }, manba: 'royxat' },
  { nom: { uz: "Yo'qolgan buyumlar", ru: 'Потерянные вещи' }, muammo: { uz: "maktabda yo'qolgan narsa topilmaydi", ru: 'потерянную в школе вещь не найти' }, kim: { uz: "maktab o'quvchilari", ru: 'ученики школы' }, yechim: { uz: "topilgan buyumlar e'loni", ru: 'объявления о найденных вещах' }, manba: 'kuzatuv' }
];
const GOYA_KEY = 'pm-m9d1-goyalar';
const goyalarLs = () => { const v = lsGet(GOYA_KEY); return v && Array.isArray(v.goyalar) ? v.goyalar.filter(g => g && g.muammo && g.kim && g.yechim).slice(0, 6) : []; };
const ROYXAT_YORLIQ = { mentor: { uz: "Mentorning g'oyalari", ru: 'Идеи Ментора' }, mening: { uz: "G'oyalarim", ru: 'Мои идеи' } };

// ----- GoyaKarta: oq karta — tepada nom va manba chipi, ichida uch qator (Muammo · Kim uchun · Yechim) -----
// qator[k] = { holat: 'bosh' | 'joriy' | 'yoz' | 'bor' | 'xato' | 'yopiq' | 'ochildi' | 'ajrat' | 'kul', matn, ichi, yorliq: false (yozilguncha yorliqsiz), belgi, osti, keyin (qatordan keyingi qo'shimcha qator) }
// 'yoz' — matn sirg'alib kiradi va ~1 s yashil yonadi · 'bor' — tinch turadi · 'yopiq' — kulrang parda · 'ochildi' — parda ko'tarildi ·
// 'ajrat' — accent qator (testdan keyingi karta) · 'kul' — kulrang qo'shimcha qator (9-ekran «Sherigingiz aytgani») · belgi — qator oxirida ✓
const QatorMatn = ({ r }) => <span className="ti-qator-t">{tr(r.matn)}</span>;
const GoyaKarta = ({ nom, nomUch, nomYorliq, goya, manba, dalil, qator = {}, ustida, ostida, katta, className, uch, tinch, ...p }) => (
  <div className={cxx('ti-karta', katta && 'katta', tinch && 'tinch', className)} data-uch={uch} {...p}>
    {(nom || manba || goya || nomYorliq) && <div className="ti-karta-bosh">
      {nom && <span className="ti-karta-nom" data-uch={nomUch}>{tr(nom)}</span>}
      {nomYorliq && <span className="ti-kul">{nomYorliq}</span>}
      {goya && <span className="ti-goya-teg">{tr({ uz: "g'oya", ru: 'идея' })}</span>}
      {manba && <span className="ti-manba">{manbaT(manba)}</span>}
    </div>}
    {dalil && <span className="ti-dalil">{dalil}</span>}
    {ustida}
    {QISM.map(q => {
      const r = qator[q.k] || {};
      const h = r.holat || 'bosh';
      const yoz = h === 'yoz' || h === 'bor' || h === 'xato' || h === 'ochildi' || h === 'ajrat' || h === 'kul';
      return (
        <React.Fragment key={q.k}>
        <div className={cxx('ti-qator', h, r.mb && 'manbadan')} data-q={q.k}>
          {(r.yorliq !== false || yoz) && <span className="ti-qator-l">{r.mb && <i className="ti-belgi">{r.mb}</i>}{tr(q.t)}</span>}
          <div className="ti-qator-m">
            {r.ichi ? r.ichi : yoz ? <QatorMatn r={r} /> : h === 'yopiq' ? <><span className="ti-qator-t yashirin">{tr(r.matn)}</span><span className="ti-parda">{tr({ uz: 'yopiq', ru: 'закрыто' })}</span></> : <i className="ti-uzuq" />}
          </div>
          {r.belgi && <span className="ti-qator-b" aria-hidden="true">{r.belgi}</span>}
          {r.osti}
        </div>
        {r.keyin}
        </React.Fragment>
      );
    })}
    {ostida}
  </div>
);
// Ixcham qator (ro'yxatda): nom yoki yechim qisqa «…» · manba chipi · ✎ yoki › ; toggle — uch qism ochiladi (U-013)
const GoyaQator = ({ g, i, matn, belgi, onBos, ochiq, yangi, ajrat, uch, joriy, manbasiz }) => {
  const Ich = <>
    <span className="ti-gq-n">{i + 1}</span>
    <span className="ti-gq-t">{matn}</span>
    {!manbasiz && <span className="ti-manba">{manbaT(g.manba)}</span>}
    {belgi && <span className="ti-gq-z" aria-hidden="true">{belgi}</span>}
  </>;
  return (
    <li className={cxx('ti-gq', yangi && 'yangi', ajrat && 'ajrat', ochiq && 'ochiq', joriy && 'joriy')} data-uch={uch}>
      {onBos ? <button type="button" className="ti-gq-b" onClick={onBos} aria-expanded={belgi === '›' ? !!ochiq : undefined}>{Ich}</button> : <div className="ti-gq-b">{Ich}</div>}
      {ochiq && <div className="ti-gq-ochiq fade-step">{QISM.map(q => <p key={q.k} className="ti-gq-o"><b>{tr(q.t)}</b><span>{tr(g[q.k])}</span></p>)}</div>}
    </li>
  );
};
// Ro'yxat: sarlavha + hisoblagich «n / 6» (son sanab o'sadi); bo'sh uzuq qatorlar yo'q; 3 dan ko'p bo'lsa — ikki ustun × 3
const GoyaRoyxat = ({ sarlavha, son, jami = 6, keng, children, className, ostida }) => {
  const k = useSanoq(son);
  return (
    <div className={cxx('ti-royxat', keng && 'keng', className)}>
      <div className="ti-royxat-h"><span className="ti-yorliq">{tr(sarlavha)}</span><b className={cxx('ti-royxat-son', k === jami && 'toliq')} key={k}>{k} / {jami}</b></div>
      {children}
      {ostida}
    </div>
  );
};
// Ro'yxat ustunlari: 3 tadan ko'p bo'lsa — ikki mustaqil ustun (1–3 chapda, qolgani o'ngda; ikki ustun × 3, SABOQ 27)
const RoyxatOl = ({ ikki, children }) => {
  const a = React.Children.toArray(children);
  if (!ikki || a.length <= 3) return <ol className="ti-gq-ro">{a}</ol>;
  return <div className="ti-gq-2"><ol className="ti-gq-ro">{a.slice(0, 3)}</ol><ol className="ti-gq-ro">{a.slice(3)}</ol></div>;
};
// Artefakt-strip «G'oyalarim · n / 6» (U-042): 9, 10, 14-ekranlar
const GStrip = () => {
  const n = goyalarLs().length;
  return (
    <div className="ti-strip fade-up">
      <span className="ti-strip-l">{tr(ROYXAT_YORLIQ.mening)}</span>
      <span className="ti-strip-d" aria-hidden="true"><i style={{ width: `${Math.round(n / 6 * 100)}%` }} /></span>
      <span className="ti-strip-n">{n} / 6</span>
    </div>
  );
};
const Starbucks = () => <span className="ti-brend">Starbucks</span>;
// Bosiladigan joy halqasi (SABOQ 11): accent halqa doim, yengil to'lqin 2–3 marta
const halqa = (on) => (on ? 'ti-halqa' : undefined);

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'royxat', t: { uz: "9-Modulda yig'gan muammolarimdan", ru: 'Из проблем, собранных в 9-м модуле' } },
  { id: 'keyin', t: { uz: "MVP'imning «Keyin» qutisidan", ru: 'Из коробки «Потом» моего MVP' } },
  { id: 'kuzatuv', t: { uz: 'Atrofda yangi narsa kuzatib', ru: 'Заметив что-то новое вокруг' } }
];
const MVP_QUTI = [
  { k: 'qilamiz', t: { uz: 'Qilamiz', ru: 'Делаем' } },
  { k: 'keyin', t: { uz: 'Keyin', ru: 'Потом' } },
  { k: 'qilmaymiz', t: { uz: 'Qilmaymiz', ru: 'Не делаем' } }
];
// Mahalla ko'chasi: maktab · bekat · maydon, odam siluetlari (chizilgan; matnsiz)
const KochaSvg = () => (
  <svg className="ti-kocha" viewBox="0 0 200 118" aria-hidden="true">
    <rect className="ks-yer" x="0" y="100" width="200" height="18" rx="3" />
    <g>
      <polygon className="ks-tom" points="6,44 38,26 70,44" />
      <rect className="ks-bino" x="10" y="44" width="56" height="56" rx="2" />
      <line className="ks-chiz" x1="38" y1="26" x2="38" y2="12" /><polygon className="ks-bayroq" points="38,12 50,15 38,18" />
      {[[16, 52], [44, 52], [16, 72], [44, 72]].map(([x, y], i) => <rect key={i} className="ks-oyna" x={x} y={y} width="14" height="11" rx="1.5" />)}
      <rect className="ks-eshik" x="31" y="84" width="14" height="16" rx="1.5" />
    </g>
    <g>
      <rect className="ks-bino" x="80" y="66" width="34" height="5" rx="2" />
      <line className="ks-chiz" x1="83" y1="71" x2="83" y2="100" /><line className="ks-chiz" x1="111" y1="71" x2="111" y2="100" />
      <rect className="ks-oyna" x="86" y="88" width="22" height="4" rx="1.5" />
      <line className="ks-chiz" x1="122" y1="58" x2="122" y2="100" /><rect className="ks-belgi" x="116" y="50" width="12" height="10" rx="2" />
    </g>
    <g>
      <polygon className="ks-mpol" points="132,100 198,100 190,78 140,78" />
      <line className="ks-mchiz" x1="165" y1="78" x2="165" y2="100" /><ellipse className="ks-mchiz" cx="165" cy="89" rx="6" ry="4" />
    </g>
    {[[96, 100], [148, 92], [180, 92]].map(([x, y], i) => (
      <g key={i} className="ks-odam" style={{ '--i': i }}><circle cx={x} cy={y - 15} r="3.6" /><rect x={x - 3.6} y={y - 11} width="7.2" height="11" rx="3.2" /></g>
    ))}
  </svg>
);
const obKl = (id, on) => cxx('ti-ob', id === 'keyin' ? 'mvp' : id === 'kuzatuv' ? 'kocha' : 'royxat', on === id && 'on', !!on && on !== id && 'xira');
const HookManba = ({ on, refs }) => (
  <div className="ti-hm">
    <div ref={refs.royxat} className={obKl('royxat', on)}>
      <span className="ti-ob-q"><b>{tr({ uz: "Muammolar ro'yxati", ru: 'Список проблем' })}</b><span className="ti-ob-s">6 / 6 <i>✓</i></span></span>
      <span className="ti-ob-ro">{MENTOR_ROYXAT9.slice(0, 4).map((r, i) => <i key={i} style={{ '--i': i }}>{tr(r)}</i>)}</span>
    </div>
    <div ref={refs.keyin} className={obKl('keyin', on)}>
      {MVP_QUTI.map(q => <span key={q.k} className={cxx('ti-mvp-q', q.k === 'keyin' && 'keyin')}><b>{tr(q.t)}</b>{(q.k === 'keyin' ? [0, 1, 2] : [0, 1]).map(i => <i key={i} />)}</span>)}
    </div>
    <div ref={refs.kuzatuv} className={obKl('kuzatuv', on)}><KochaSvg /></div>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [uchdi, setUchdi] = useState(storedAnswer ? 6 : 0);
  const refs = { royxat: useRef(null), keyin: useRef(null), kuzatuv: useRef(null) };
  const uch = useUchish();
  const n = useSanoq(uchdi, 90);
  // Tanlovdan keyin: mos obyekt ko'tariladi, so'ng uchala obyektdan yopiq kartalar navbat bilan (100 ms) «Mentorning g'oyalari»ga uchadi
  useEffect(() => {
    if (picked === null || uchdi >= 6) return undefined;
    if (kamHarakat()) { setUchdi(6); return undefined; }
    const t = setTimeout(() => {
      const g = MENTOR_GOYALAR[uchdi];
      uch(refs[g.manba].current, 's0k' + uchdi, 520);
      setUchdi(uchdi + 1);
    }, uchdi === 0 ? 650 : 100);
    return () => clearTimeout(t);
  }, [picked, uchdi]); // eslint-disable-line
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('ti-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Oltita g'oyani <A>qayerdan topasiz?</A></>, ru: <>Где найти <A>шесть идей?</A></> })}
          mentor={<Mentor>{tr({ uz: "Bu modulda bitiruvgacha quriladigan mahsulot tanlanadi: o'zingizga yaqin javobni belgilang.", ru: 'В этом модуле выбирается продукт, который вы будете строить до выпуска: отметьте близкий вам ответ.' })}</Mentor>}
          maket={<div className="ti-s0-maket">
            <HookManba on={picked} refs={refs} />
            {picked !== null && <div className="ti-mg fade-step">
              <div className="ti-mg-h"><span className="ti-yorliq">{tr(ROYXAT_YORLIQ.mentor)}</span><b className={cxx('ti-royxat-son', n === 6 && 'toliq')} key={n}>{n} / 6</b></div>
              <div className="ti-mg-k">{MENTOR_GOYALAR.slice(0, uchdi).map((g, i) => <span key={i} className={cxx('ti-yk', g.manba)} data-uch={'s0k' + i} />)}</div>
            </div>}
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="ti-javob fade-step">{tr({ uz: "Uchalasi ham g'oya manbai bo'ladi. Mentor oltita g'oyasini shu uch joydan yig'di.", ru: 'Все три — источники идей. Ментор собрал свои шесть идей из этих трёх мест.' })}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "9-Modul ro'yxati yoki MVP doskasi saqlanmagan o'quvchi ham tanlaydi — savol odat haqida. Javobni muhokama qilmang: 4-ekran manbalarni o'zi ochadi.", ru: 'Выбирает и ученик, у которого не сохранились список 9-го модуля или доска MVP: вопрос — о привычке. Не обсуждайте ответ: 4-й экран сам откроет источники.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Dars oxirida» — oltita qator: Mentor g'oya nomlari navbat bilan ✓ oladi, oxirida birinchisi uch qatorli karta-skeletga aylanadi) =====
const REJA = [
  { t: { uz: "Ikki so'zli yozuvni to'liq g'oyaga aylantirasiz", ru: 'Превратите запись из двух слов в полную идею' }, teg: { uz: "g'oya", ru: 'идея' } },
  { t: { uz: "G'oya uchun muammoni qayerdan topishni bilib olasiz", ru: 'Узнаете, где найти проблему для идеи' }, teg: { uz: 'manba', ru: 'источник' } },
  { t: { uz: <><Starbucks /> qanday joy bo'lib qurilganini ko'rasiz</>, ru: <>Увидите, каким местом построили <Starbucks /></> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: "Oltita g'oya yozib, bittasini sherigingizga o'qiysiz", ru: 'Напишете шесть идей и одну прочитаете партнёру' }, teg: { uz: 'juftlik', ru: 'пара' } }
];
const RejaChizma = () => (
  <div className="ti-rj">
    <ol className="ti-rj-ro">{MENTOR_GOYALAR.map((g, i) => <li key={i} className="ti-rj-q" style={{ '--i': i }}><span className="ti-gq-n">{i + 1}</span><span className="ti-rj-t">{tr(g.nom)}</span><b className="ti-rj-ok" aria-hidden="true">✓</b></li>)}</ol>
    <div className="ti-rj-karta"><GoyaKarta className="kichik" nom={MENTOR_GOYALAR[0].nom} qator={{ muammo: { yorliq: false }, kim: { yorliq: false }, yechim: { yorliq: false } }} /></div>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun <A>oltita g'oyani</A> yozib chiqasiz.</>, ru: <>Сегодня вы напишете <A>шесть идей</A>.</> })}
      mentor={<Mentor>{tr({ uz: "O'tgan modulda «Maydon» o'lchandi va prodga chiqdi. Yangi mahsulot esa g'oyadan boshlanadi.", ru: 'В прошлом модуле «Maydon» измерили и вывели в прод. А новый продукт начинается с идеи.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida: muammo, kim uchun va yechim — 6 yozma g'oya", ru: 'В конце урока: проблема, для кого и решение — 6 письменных идей' })}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — NOMDAN G'OYAGA (QTushuncha markaziy: bashorat → uch savol-tugma → sahna va karta o'zgaradi → atama «g'oya» misoldan keyin) =====
const S2_SAVOLLAR = [
  { qator: 'muammo', savol: { uz: 'Qanday muammo?', ru: 'Какая проблема?' }, matn: MENTOR_GOYALAR[0].muammo, sahna: 'maydon' },
  { qator: 'kim', savol: { uz: 'Kim uchun?', ru: 'Для кого?' }, matn: MENTOR_GOYALAR[0].kim, sahna: 'mahalla' },
  { qator: 'yechim', savol: { uz: 'Qanday yechim?', ru: 'Какое решение?' }, matn: MENTOR_GOYALAR[0].yechim, sahna: 'telefon' }
];
const S2_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const DALIL_JAMOA = { uz: "9-Modul intervyusi: 5 kishidan 2 tasi «jamoaga odam yetmadi»", ru: 'Интервью 9-го модуля: 2 из 5 человек — «не хватило людей в команду»' };
// Maydon chizmasi (1, 2-savol): o'yinchi siluetlari, bo'sh o'rinlar (uzuq doira); 2-savoldan — atrofda mahalla uylari
const MaydonSvg = ({ mahalla }) => (
  <svg className="ti-mdn" viewBox="0 0 170 200" aria-hidden="true">
    {mahalla && [[6, 30], [44, 22], [96, 22], [134, 30]].map(([x, y], i) => (
      <g key={i} className="mdn-uy" style={{ '--i': i }}><polygon points={`${x},${y + 12} ${x + 15},${y} ${x + 30},${y + 12}`} /><rect x={x + 3} y={y + 12} width="24" height="20" rx="1.5" /><rect className="mdn-oyna" x={x + 11} y={y + 18} width="8" height="7" rx="1" /></g>
    ))}
    <polygon className="mdn-pol" points="12,186 158,186 140,70 30,70" />
    <line className="mdn-chiz" x1="21" y1="128" x2="149" y2="128" /><ellipse className="mdn-chiz" cx="85" cy="128" rx="17" ry="8" />
    <rect className="mdn-chiz" x="66" y="70" width="38" height="10" /><rect className="mdn-chiz" x="58" y="176" width="54" height="10" />
    {[[50, 112], [92, 104], [62, 160], [116, 152]].map(([x, y], i) => (
      <g key={i} className="mdn-odam" style={{ '--i': i }}><circle cx={x} cy={y - 16} r="5" /><rect x={x - 5} y={y - 10} width="10" height="15" rx="4.5" /></g>
    ))}
    {[[124, 106], [36, 150], [92, 170]].map(([x, y], i) => <circle key={i} className="mdn-bosh" cx={x} cy={y - 8} r="9" />)}
  </svg>
);
const S2Sahna = ({ q, bosildi, uchdi }) => (
  <div className={cxx('ti-s2s', `s${q}`)} aria-hidden="true">
    {q === 0 && <div className="ti-s2-mvp">
      <div className="ti-s2-ilova">
        <span className="ti-s2-ilova-h"><i />Maydon</span>
        <span className="ti-s2-slot">{['18:00', '19:00', '20:00'].map((t, i) => <i key={t} className={cxx(i === 1 && 'band')}>{t}</i>)}</span>
        <span className="ti-s2-ilova-sk" /><span className="ti-s2-ilova-sk qisqa" />
      </div>
      <div className="ti-s2-keyin">
        <b>{tr({ uz: 'Keyin', ru: 'Потом' })}</b>
        <span className="ti-sm-chip">{tr({ uz: "to'lov", ru: 'оплата' })}</span>
        <span className={cxx('ti-sm-chip', uchdi ? 'kul' : 'kot ti-s2-kot')} data-s2chip="1">{tr({ uz: "jamoa yig'ish", ru: 'сбор команды' })}{uchdi && <i> ✓</i>}</span>
        <span className="ti-sm-chip">{tr({ uz: 'eslatma', ru: 'напоминание' })}</span>
      </div>
    </div>}
    {(q === 1 || q === 2) && <div className="ti-s2-mdn">
      <MaydonSvg mahalla={q === 2} />
      {q === 1 && <span className="ti-pufak">{tr({ uz: 'Kim keladi?', ru: 'Кто придёт?' })}</span>}
      {q === 2 && <span className="ti-mdn-y">{tr({ uz: "o'yinchilar", ru: 'игроки' })}</span>}
    </div>}
    {q === 3 && <div className="ti-tel-w">
      <div className="ti-tel">
        <span className="ti-tel-k" />
        <div className="ti-tel-e">
          <span className="ti-tel-bar" />
          <div className="ti-elon">
            <span className="ti-elon-q"><b>{tr({ uz: 'Bugun', ru: 'Сегодня' })}</b> · 18:00</span>
            <span className="ti-elon-son" key={bosildi ? 'b' : 'a'}>{bosildi ? '9 / 10' : '8 / 10'}</span>
            <span className={cxx('ti-elon-b', bosildi && 'bosildi')}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
          </div>
          <span className="ti-tel-sk" /><span className="ti-tel-sk qisqa" />
        </div>
      </div>
      <span className="ti-kul">{tr({ uz: 'chizma — hali qurilmagan', ru: 'набросок — ещё не построено' })}</span>
    </div>}
  </div>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [bosildi, setBosildi] = useState(!!storedAnswer);
  const [nomKeldi, setNomKeldi] = useState(!!storedAnswer);
  const uch = useUchish();
  const done = q >= 3;
  // Kirish: «Keyin» qutisidan «jamoa yig'ish» chipi ko'tarilib, o'ngdagi karta nomiga uchadi (MD 2-ekran, F-1006-270)
  useEffect(() => {
    if (nomKeldi) return undefined;
    const t = setTimeout(() => { uch(document.querySelector('.lesson-root [data-s2chip]'), 's2nom', 700); setNomKeldi(true); }, kamHarakat() ? 0 : 1300);
    return () => clearTimeout(t);
  }, [nomKeldi]); // eslint-disable-line
  const tugadi = useTugadi(done, 2600, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // 3-savol: telefon maketida «Qo'shilaman» bir marta o'zi bosiladi (namoyish), «8 / 10» → «9 / 10»
  useEffect(() => { if (q < 3 || bosildi) return undefined; const t = setTimeout(() => setBosildi(true), kamHarakat() ? 0 : 1000); return () => clearTimeout(t); }, [q, bosildi]);
  const qator = {};
  S2_SAVOLLAR.forEach((s, i) => {
    if (i < q) qator[s.qator] = { holat: tugadi || storedAnswer ? 'bor' : 'yoz', matn: s.matn, osti: s.qator === 'muammo' && <span className="ti-dalil fade-step">{tr(DALIL_JAMOA)}</span> };
    else {
      const faol = !!taxmin && i === q;
      qator[s.qator] = { holat: faol ? 'joriy' : 'bosh', yorliq: false, ichi: !tugadi && <button type="button" className={cxx('ti-qsavol', halqa(faol))} disabled={!faol} onClick={() => setQ(i + 1)}>{tr(s.savol)}</button> };
    }
  });
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · g'oya", ru: 'Понятие · идея' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni bosing', ru: 'Нажмите на вопросы' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Ikki so'zli yozuvdan <A>nima qurishni</A> bilasizmi?</>, ru: <>Понятно ли, <A>что строить</A> по записи из двух слов?</> })}
        mentor={<Mentor>{tr({ uz: "O'tgan modulda «Maydon»ning keyingi qadamini ikki so'z bilan yozgan edim: kartadagi savollarni birma-bir bosing.", ru: 'В прошлом модуле я записал следующий шаг «Maydon» двумя словами: нажимайте вопросы на карточке по одному.' })}</Mentor>}
        bashorat={!taxmin
          ? <div className="ti-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Nima qurishni bilish uchun bu yozuvga nechta savol kerak?', ru: 'Сколько вопросов нужно этой записи, чтобы понять, что строить?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <div className="ti-bashq fade-step"><span>{tr({ uz: 'Nima qurishni bilish uchun bu yozuvga nechta savol kerak?', ru: 'Сколько вопросов нужно этой записи, чтобы понять, что строить?' })}</span><span className="ti-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{tx.t}</b></span></div>}
        vizual={<div className={cxx('ti-s2', tugadi && 'tinch')}>
          <S2Sahna q={q} bosildi={bosildi} uchdi={nomKeldi} />
          <GoyaKarta nom={nomKeldi && MENTOR_GOYALAR[0].nom} nomUch="s2nom" nomYorliq={nomKeldi && tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} goya={done} qator={qator} tinch={tugadi}
            ostida={done && <QIzoh>{tr({ uz: "Uch savolga javob yozilgan yozuv — g'oya. «Jamoa yig'ish» esa uning nomi.", ru: 'Запись, в которой есть ответы на три вопроса, — идея. А «Сбор команды» — её название.' })}</QIzoh>} />
        </div>}
        natija={!done && ipucha && <QIzoh>{tr({ uz: "Kartadagi yoqilgan savolni bosing — qator nima bo'lishini ko'ring.", ru: 'Нажмите активный вопрос на карточке — посмотрите, что станет со строкой.' })}</QIzoh>}
        xulosa={done && <>{tx && <span className={cxx('ti-tx', taxmin === '3' && 'ok')}>{taxmin === '3' ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' }) : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>3</b></>}</span>}{tr({ uz: "G'oya uch qismdan iborat: muammo, kim uchun va yechim.", ru: 'Идея состоит из трёх частей: проблема, для кого и решение.' })}</>}
      />
      <MentorNote>{tr({ uz: "«Jamoa yig'ish» — 10-Modul yillik yo'l darsidagi keyingi qadam; bugun u Mentorning o'n g'oyasidan biri, xolos — hech qaysi g'oya tanlanmaydi. 9-Modulda auditoriya-kartada YECHIM qatori bo'sh qolgan edi («hali yo'q») — g'oyada uchala qism yoziladi; sinfga shu ko'prikni og'zaki ayting. Mahsulot nomini aytmang: bu hali g'oya, mahsulot emas.", ru: '«Сбор команды» — следующий шаг из урока о годовом пути 10-го модуля; сегодня это лишь одна из десяти идей Ментора — ни одна идея не выбирается. В 9-м модуле в карточке аудитории строка РЕШЕНИЕ оставалась пустой («пока нет») — в идее пишутся все три части; скажите классу этот мостик устно. Не называйте продукт: это пока идея, а не продукт.' })}</MentorNote>
    </Stage>
  );
};

// Bog'lanish chizig'i (SVG qatlami): ota-element ichidagi ikki element orasida egri chiziq chiziladi (chizilib boradi).
// juftlar: [{ dan, gacha (selektor), tur: 'ok' | 'acc', yon: 'chap' (ikkala chap chetdan, chapga egilib) | 'orta' (dan — o'ng chetdan, gacha — chap chetga) }]
const Bog = ({ juftlar, kalit }) => {
  const ref = useRef(null);
  const [ch, setCh] = useState({ w: 0, h: 0, q: [] });
  useLayoutEffect(() => {
    const el = ref.current && ref.current.parentElement;
    if (!el) return undefined;
    const olch = () => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const z = el.offsetWidth / r.width;
      const q = juftlar.map(j => {
        const a = el.querySelector(j.dan), b = el.querySelector(j.gacha);
        if (!a || !b) return null;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const y1 = (ra.top + ra.height / 2 - r.top) * z, y2 = (rb.top + rb.height / 2 - r.top) * z;
        if (j.yon === 'orta') return { d: `M ${(ra.right - r.left) * z} ${y1} C ${(ra.right - r.left) * z + 30} ${y1}, ${(rb.left - r.left) * z - 30} ${y2}, ${(rb.left - r.left) * z} ${y2}`, tur: j.tur };
        const x1 = (ra.left - r.left) * z + 2, x2 = (rb.left - r.left) * z + 2;
        const eg = Math.min(x1, x2) - 16;
        return { d: `M ${x1} ${y1} C ${eg} ${y1}, ${eg} ${y2}, ${x2} ${y2}`, tur: j.tur };
      }).filter(Boolean);
      setCh({ w: el.offsetWidth, h: el.offsetHeight, q });
    };
    olch();
    const t = setTimeout(olch, 480); const t2 = setTimeout(olch, 950);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(olch) : null;
    if (ro) ro.observe(el);
    return () => { clearTimeout(t); clearTimeout(t2); if (ro) ro.disconnect(); };
  }, [kalit]); // eslint-disable-line
  return (
    <svg ref={ref} className="ti-bog" width={ch.w || 1} height={ch.h || 1} aria-hidden="true">
      {ch.q.map((c, i) => <path key={`${kalit}-${i}`} className={cxx('ti-bog-c', c.tur)} d={c.d} pathLength="1" style={{ '--i': i }} />)}
    </svg>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · g'oyaning uch qismi", ru: 'Проверка · три части идеи' })}
    questionText="«O'quvchilar uchun oshxona menyusini ko'rsatadigan bot» — nima yetishmaydi?"
    question={tr({ uz: <h2 className="title h-ask">«O'quvchilar uchun oshxona menyusini ko'rsatadigan bot» — <A>nima yetishmaydi?</A></h2>, ru: <h2 className="title h-ask">«Бот, который показывает ученикам меню столовой» — <A>чего не хватает?</A></h2> })}
    options={[
      { uz: 'Kim uchun — botni qaysi odamlar ochadi', ru: 'Для кого — какие люди открывают бота' },
      { uz: 'Yechim — bot odamlarga nima qilib beradi', ru: 'Решение — что бот делает для людей' },
      { uz: "Muammo — o'quvchilar nimadan qiynaladi", ru: 'Проблема — от чего страдают ученики' },
      { uz: 'Nom — botning qisqa va esda qolar nomi', ru: 'Название — короткое запоминающееся имя бота' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Kim va yechim yozilgan, lekin o'quvchilar nimadan qiynalishi yo'q.", ru: 'Для кого и решение написаны, но нет того, от чего страдают ученики.' }}
    explainWrong={{
      0: { uz: "Kim yozilgan: o'quvchilar. Boshqa qismni qidiring.", ru: 'Для кого написано: ученики. Ищите другую часть.' },
      1: { uz: "Yechim yozilgan: bot menyuni ko'rsatadi.", ru: 'Решение написано: бот показывает меню.' },
      3: { uz: "Nom g'oyaning qismi emas — uch qismga qarang.", ru: 'Название — не часть идеи: смотрите на три части.' },
      default: { uz: 'Uch qismni birma-bir qidiring: qaysi biri yo\'q?', ru: 'Ищите три части по одной: какой нет?' }
    }}
    vizual={<GoyaKarta className="kichik" nom={{ uz: 'Oshxona boti', ru: 'Бот столовой' }}
      qator={{
        muammo: { holat: 'ajrat', matn: { uz: "Oshxonada bugun nima borligini bilish uchun navbatga turib ko'rishadi.", ru: 'Чтобы узнать, что сегодня в столовой, встают в очередь и смотрят.' } },
        kim: { holat: 'bor', matn: { uz: "o'quvchilar", ru: 'ученики' }, belgi: '✓' },
        yechim: { holat: 'bor', matn: { uz: "oshxona menyusini ko'rsatadi", ru: 'показывает меню столовой' }, belgi: '✓' }
      }} />} />
);

// Rasm palitrasi (SABOQ 36 — odamlar real: teri, soch, rangli kiyim; iliq ranglar). UI tokeni emas — faqat chizmalar ichida.
const RANG = {
  teri: ['#EDC39C', '#C98E62', '#E3A87C'], soch: ['#2E2019', '#5B3A24', '#1F1A19'],
  kiyim: ['#E07A5F', '#3E7CB1', '#E9A23B', '#7B61C9', '#2F9E7A', '#D96C8A'], shim: '#3B3F5C', oyoq: '#2A2730', lab: '#8A4B3A',
  devor: '#F6EDE1', pol: '#E4D3BE', yogoch: '#B98552', yogochQ: '#8C5A33', qogoz: '#FFF8E4'
};
// Real ko'rinishdagi odam (SVG guruh): oyoq ostidagi nuqta (x, y) — tayanch. poza: 'tik' | 'otir' · qol: 'stakan' | 'telefon' | 'sumka' · yuz: 1 o'ngga, -1 chapga qaraydi
const Odam = ({ x = 0, y = 0, s = 1, teri = 0, soch = 0, kiyim = 0, sochTur = 'qisqa', poza = 'tik', qol, yuz = 1, className, style }) => {
  const k = RANG.kiyim[kiyim % RANG.kiyim.length], t = RANG.teri[teri % 3], h = RANG.soch[soch % 3];
  const otir = poza === 'otir';
  const dy = otir ? -2 : 0; // o'tirganda gavda biroz pastroq
  return (
    <g className={className} style={style}><g transform={`translate(${x} ${y}) scale(${s * yuz} ${s})`}>
      {otir ? <>
        <rect x="-8" y="-31" width="24" height="9" rx="4.5" fill={RANG.shim} />
        <rect x="9" y="-26" width="7.5" height="24" rx="3.5" fill={RANG.shim} />
        <rect x="8" y="-4" width="12" height="4.5" rx="2.2" fill={RANG.oyoq} />
      </> : <>
        <rect x="-8" y="-31" width="7.5" height="29" rx="3.5" fill={RANG.shim} />
        <rect x="0.5" y="-31" width="7.5" height="29" rx="3.5" fill={RANG.shim} />
        <rect x="-9.5" y="-4" width="10" height="4.5" rx="2.2" fill={RANG.oyoq} />
        <rect x="0.5" y="-4" width="11" height="4.5" rx="2.2" fill={RANG.oyoq} />
      </>}
      {qol === 'sumka' && <rect x="-17" y={-55 + dy} width="9" height="20" rx="3" fill={RANG.yogochQ} />}
      <rect x="-12" y={-57 + dy} width="9" height="25" rx="4.5" fill={k} opacity="0.85" />
      <rect x="-11" y={-58 + dy} width="22" height="30" rx="8" fill={k} />
      <rect x="-3" y={-62 + dy} width="6" height="6" rx="2" fill={t} />
      {qol === 'stakan' || qol === 'telefon'
        ? <>
          <rect x="5" y={-54 + dy} width="7" height="15" rx="3.5" fill={k} />
          <rect x="6" y={-44 + dy} width="15" height="7" rx="3.5" fill={k} />
          <circle cx="21" cy={-40.5 + dy} r="3.4" fill={t} />
          {qol === 'stakan'
            ? <g><rect x="18" y={-53 + dy} width="8" height="11" rx="1.6" fill="#FFFFFF" stroke="#C9B49A" strokeWidth="0.8" /><rect x="18" y={-49.5 + dy} width="8" height="3.6" fill={RANG.yogoch} /><rect x="17.4" y={-55 + dy} width="9.2" height="2.6" rx="1.2" fill="#E9E0D2" /></g>
            : <rect x="19" y={-52 + dy} width="6" height="10" rx="1.5" fill="#2A2730" />}
        </>
        : <><rect x="6" y={-55 + dy} width="7" height="26" rx="3.5" fill={k} /><circle cx="9.5" cy={-28 + dy} r="3.4" fill={t} /></>}
      <circle cx="0" cy={-71 + dy} r="10.5" fill={t} />
      {sochTur === 'uzun' && <path d={`M -10.5 ${-72 + dy} C -12 ${-58 + dy}, -9 ${-55 + dy}, -4 ${-56 + dy} L -6 ${-68 + dy} Z`} fill={h} />}
      <path d={`M -11 ${-70 + dy} C -12 ${-86 + dy}, 12 ${-86 + dy}, 11 ${-71 + dy} C 6 ${-77 + dy}, -2 ${-78 + dy}, -11 ${-70 + dy} Z`} fill={h} />
      {sochTur === 'dumaloq' && <circle cx="-8" cy={-82 + dy} r="4.5" fill={h} />}
      <circle cx="2.5" cy={-71 + dy} r="1.35" fill="#2A2730" />
      <circle cx="7.5" cy={-71 + dy} r="1.35" fill="#2A2730" />
      <path d={`M 3 ${-66 + dy} Q 5.5 ${-63.5 + dy} 8 ${-66 + dy}`} stroke={RANG.lab} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="9" cy={-67.5 + dy} r="1.8" fill="#E8867A" opacity="0.35" />
    </g></g>
  );
};

// ===== SCREEN 4 — UCH MANBA (QTushuncha ketma-ket, 3 qadam; SABOQ 9/13, 34, 35): manba sahnasi chapda · karta o'ngda · ro'yxat «Mentorning g'oyalari · n / 6» =====
// Qadamlar o'zi ochiladi (SABOQ 34): 1-manba kirishda, keyingilari oldingi qadam ✓ dan ≈1 s keyin. Manbadan olingan yozuv va u to'ldirgan qator — bir xil belgi + uchish chizig'i (SABOQ 35).
const S4_QADAM = [
  { manba: 'keyin', goya: 1, bosh: 'muammo', mq: 'yechim',
    tanlov: [{ t: { uz: "ilovada to'lov bo'lishini xohlaydi", ru: 'хочет, чтобы в приложении была оплата' } }, { t: MENTOR_GOYALAR[1].muammo, ok: true }, { t: { uz: "ilovada to'lov tugmasi hali yo'q", ru: 'в приложении пока нет кнопки оплаты' } }],
    xato: { uz: "Bu gapda odam nimadan qiynalgani ko'rinmaydi.", ru: 'В этой фразе не видно, от чего страдает человек.' },
    yordam: { uz: "Muammo — odam nimadan qiynalishi; xohish muammo emas.", ru: 'Проблема — от чего страдает человек; желание — не проблема.' },
    dalil: { uz: "9-Modul intervyusi: 5 kishidan 1 tasi «pulni bo'lishish qiyin»", ru: 'Интервью 9-го модуля: 1 из 5 человек — «трудно делить деньги»' } },
  { manba: 'royxat', goya: 4, bosh: 'yechim', mq: 'muammo',
    tanlov: [{ t: { uz: "darslikni qiziq qiladigan o'yin", ru: 'игра, которая делает учебник интересным' } }, { t: { uz: 'yangi darsliklar sotiladigan sayt', ru: 'сайт, где продают новые учебники' } }, { t: MENTOR_GOYALAR[4].yechim, ok: true }],
    xato: { uz: 'Bu yechim boshqa muammoga javob beradi.', ru: 'Это решение отвечает на другую проблему.' },
    yordam: { uz: 'Yechim muammo qatoridagi qiyinchilikni yengillashtirsin.', ru: 'Пусть решение облегчает трудность из строки «Проблема».' } },
  { manba: 'kuzatuv', goya: 5, bosh: 'kim', mq: 'muammo',
    tanlov: [{ t: MENTOR_GOYALAR[5].kim, ok: true }, { t: { uz: 'hamma yoshdagi odamlar', ru: 'люди всех возрастов' } }, { t: { uz: 'telefoni bor har kim', ru: 'каждый, у кого есть телефон' } }],
    xato: { uz: 'Kim uchun aniqroq bo\'lsin: qanday odamlar?', ru: 'Для кого — точнее: какие люди?' },
    yordam: { uz: "«Hamma» aniq emas: muammo aynan qanday odamlarda?", ru: '«Все» — не точно: у каких именно людей проблема?' } }
];
const S4_QOLGAN = [2, 3];
// Mentorning 9-Modul MVP doskasi (MvpCompleteLesson · PmInterviewMvpLesson): «Qilamiz» va «Qilmaymiz» yozuvlari — bo'sh chip o'rniga (SABOQ 33)
const S4_QILAMIZ = [{ uz: 'vaqt kataklari', ru: 'ячейки времени' }, { uz: 'band qilish', ru: 'бронирование' }, { uz: "ega uchun bandlar ro'yxati", ru: 'список броней для владельца' }];
const S4_QILMAYMIZ = [{ uz: 'maydonga baho', ru: 'оценка поля' }];
// 9-Modul 1-darsidagi Mentor ro'yxatidan olti yozuv (F-1006-270: «kamaytiraylik»); ekranda qisqa «…»; oxirgisi — «Eski darsliklar»
const MENTOR_ROYXAT9 = [
  { uz: "Tanaffusda telefonni quvvatlash uchun bo'sh rozetka topilmaydi.", ru: 'На перемене не найти свободную розетку для телефона.' },
  { uz: "To'garak qaysi xonada ekanini bilmay, o'quvchilar xonama-xona yurishadi.", ru: 'Не зная, где кружок, ученики ходят по кабинетам.' },
  { uz: "Maktab oldida velosiped qo'yadigan joy yo'q — daraxtga bog'lab ketishadi.", ru: 'У школы негде поставить велосипед — его привязывают к дереву.' },
  { uz: "Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak.", ru: 'Приходите на поле — занято; чтобы узнать свободное время, надо звонить владельцу.' },
  { uz: "Oshxonada bugun nima borligini bilish uchun navbatga turib ko'rishadi.", ru: 'Чтобы узнать, что сегодня в столовой, встают в очередь.' },
  { uz: "Eski darsliklarni kimga berishni bilmay, o'quvchilar ularni uyda yillab saqlaydi.", ru: 'Не зная, кому отдать старые учебники, ученики годами хранят их дома.' }
];
const S4_KOT = MENTOR_ROYXAT9.length - 1;
// E'lon taxtasidagi kichik qog'ozlar (matnsiz — eng kattasi «Yo'qoldi: sumka» alohida, HTML)
const YL_QOGOZ = [[84, 30, -6, '#FFF8E4'], [184, 32, 5, '#E6F0FF'], [92, 78, 4, '#E8F6EE'], [182, 80, -4, '#FFF8E4'], [138, 92, 2, '#FDE7E4']];
// Manba sahnasi (chapda, qadamga qarab almashadi): MVP doskasi «Keyin» chiplari · Mentor ro'yxati · maktab yo'lagi va e'lon taxtasi
const S4Manba = ({ k, faol }) => {
  const belgi = faol && <i className="ti-belgi">{k + 1}</i>;
  return (
    <div className={cxx('ti-sm', `k${k}`, faol && 'faol')} key={k}>
      {k === 0 && <div className="ti-sm-mvp">
        {MVP_QUTI.map(qt => (
          <div key={qt.k} className={cxx('ti-sm-quti', qt.k)}>
            <span className="ti-sm-qh">{tr(qt.t)}</span>
            {qt.k === 'keyin'
              ? <>
                <span className="ti-sm-manba" data-s4src="0"><span className="ti-sm-chip kot">{belgi}{tr({ uz: "to'lov", ru: 'оплата' })}</span>{faol && <span className="ti-dalil fade-step">{tr(S4_QADAM[0].dalil)}</span>}</span>
                <span className="ti-sm-chip kul">{tr({ uz: "jamoa yig'ish", ru: 'сбор команды' })} <i>✓</i></span>
                <span className="ti-sm-chip">{tr({ uz: 'eslatma', ru: 'напоминание' })}</span>
              </>
              : (qt.k === 'qilamiz' ? S4_QILAMIZ : S4_QILMAYMIZ).map((m, i) => <span key={i} className="ti-sm-chip">{tr(m)}</span>)}
          </div>
        ))}
      </div>}
      {k === 1 && <div className="ti-sm-ro">
        <span className="ti-yorliq">{tr({ uz: "Mentor ro'yxati", ru: 'Список Ментора' })}</span>
        <ol>{MENTOR_ROYXAT9.map((r, i) => <li key={i} className={cxx(i === S4_KOT && 'kot')} data-s4src={i === S4_KOT ? '1' : undefined} style={{ '--i': i }}>{i === S4_KOT && belgi}<span>{tr(r)}</span></li>)}</ol>
      </div>}
      {k === 2 && <div className="ti-sm-yolak">
        <span className="ti-sm-mgap"><img src={MENTOR_IMG} alt="" aria-hidden="true" />{tr({ uz: 'Tanaffusda ko\'rdim', ru: 'Видел на перемене' })}</span>
        <div className="ti-yl-ich">
          <svg viewBox="0 0 300 190" aria-hidden="true">
            <rect x="0" y="0" width="300" height="150" fill={RANG.devor} />
            <rect x="0" y="150" width="300" height="40" fill={RANG.pol} />
            <rect x="0" y="146" width="300" height="5" fill="#D9C4A8" />
            <rect x="10" y="44" width="40" height="104" rx="3" fill={RANG.yogoch} /><circle cx="44" cy="98" r="2.4" fill={RANG.yogochQ} />
            <rect x="262" y="44" width="34" height="104" rx="3" fill={RANG.yogoch} />
            <g className="yl-taxta"><rect x="68" y="16" width="160" height="104" rx="6" fill={RANG.yogochQ} /><rect x="74" y="22" width="148" height="92" rx="4" fill="#D9A86C" /></g>
            {YL_QOGOZ.map(([qx, qy, r, c], i) => (
              <g key={i} className="yl-qogoz" style={{ '--i': i }} transform={`rotate(${r} ${qx + 14} ${qy + 12})`}>
                <rect x={qx} y={qy} width="28" height="24" rx="2" fill={c} stroke="#D8CBB3" strokeWidth="0.6" />
                <rect x={qx + 5} y={qy + 8} width="18" height="2.4" rx="1" fill="#CBBFA8" /><rect x={qx + 5} y={qy + 13} width="12" height="2.4" rx="1" fill="#CBBFA8" />
                <circle cx={qx + 14} cy={qy + 3} r="2.4" fill={i % 2 ? '#2F9E7A' : '#E07A5F'} />
              </g>
            ))}
            <Odam className="yl-odam" x={232} y={182} s={1.45} yuz={-1} kiyim={1} teri={1} soch={0} qol="sumka" />
          </svg>
          <span className="ti-sm-qogoz" data-s4src="2">{belgi}{tr({ uz: "Yo'qoldi: sumka", ru: 'Потерялась: сумка' })}</span>
        </div>
      </div>}
    </div>
  );
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [qadam, setQadam] = useState(avval ? 3 : 0);
  const [faza, setFaza] = useState(avval ? 'tamom' : 'kutish');
  const [royxat, setRoyxat] = useState(avval ? MENTOR_GOYALAR.map((_, i) => i) : [0]);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState([]);
  const [ochiq, setOchiq] = useState(null);
  const [yangi, setYangi] = useState(null);
  const xatoBor = useRef(false);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const done = royxat.length >= MENTOR_GOYALAR.length && faza === 'tamom';
  const tugadi = useTugadi(done, 1100, avval);
  const qd = S4_QADAM[Math.min(qadam, 2)];
  const g = MENTOR_GOYALAR[qd.goya];
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'manba', screenIdx: screen, correct: !xatoBor.current, picked: true, solved: true }); }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  // Fazalar: kutish (≈1 s, keyingi manba o'zi ochiladi) → sahna (manba yozuvi ko'tariladi) → tanlov (yozuv kartaga uchdi) → togri (qator yashil) → karta ro'yxatga uchadi
  useEffect(() => {
    if (faza === 'kutish' && qadam < 3) {
      const t = setTimeout(() => setFaza('sahna'), kamHarakat() ? 200 : (qadam === 0 ? 700 : 1000));
      return () => clearTimeout(t);
    }
    if (faza === 'sahna') {
      const t = setTimeout(() => {
        uch(document.querySelector(`.lesson-root [data-s4src="${qadam}"]`), 's4karta', 620);
        setFaza('tanlov');
      }, kamHarakat() ? 0 : 900);
      return () => clearTimeout(t);
    }
    if (faza === 'togri') {
      const t = setTimeout(() => {
        uch(kartaRef.current, 's4g' + qd.goya, 640);
        setRoyxat(r => [...r, qd.goya]); setYangi(qd.goya); setXato(null);
        setQadam(qadam + 1); setFaza(qadam >= 2 ? 'qolgan' : 'kutish');
      }, kamHarakat() ? 300 : 1100);
      return () => clearTimeout(t);
    }
    if (faza === 'qolgan') {
      const qoldi = S4_QOLGAN.filter(i => !royxat.includes(i));
      if (!qoldi.length) { setFaza('tamom'); return undefined; }
      const t = setTimeout(() => { setRoyxat(r => [...r, qoldi[0]]); setYangi(qoldi[0]); }, kamHarakat() ? 0 : (qoldi.length === S4_QOLGAN.length ? 500 : 140));
      return () => clearTimeout(t);
    }
    return undefined;
  }, [faza, royxat, qadam]); // eslint-disable-line
  const tanla = (t, i) => {
    if (faza !== 'tanlov') return;
    if (t.ok) { setXato(null); setFaza('togri'); return; }
    if (!xatoBor.current && achMiss) achMiss.miss(screen);
    xatoBor.current = true;
    setXato({ i, k: Date.now() });
    setYordam(y => (y.includes(qadam) ? y : [...y, qadam]));
  };
  // Karta: kutishda — bo'sh (uch uzuq qator); tanlovda — manbadan kelgan ikki qator (manba to'ldirgani belgili), bo'sh qator accent va ichida 3 tanlov
  const qator = {};
  if (faza === 'tanlov' || faza === 'togri') {
    QISM.forEach(q => {
      const mb = q.k === qd.mq ? String(qadam + 1) : undefined;
      if (q.k !== qd.bosh) { qator[q.k] = { holat: 'yoz', matn: g[q.k], mb }; return; }
      if (faza === 'togri') { qator[q.k] = { holat: 'yoz', matn: g[q.k], belgi: '✓' }; return; }
      qator[q.k] = { holat: xato ? 'xato' : 'joriy', ichi: <div className="ti-tanlovlar ti-guruh" key={xato ? xato.k : 'x'}>
        {qd.tanlov.map((t, i) => <QChip key={xato && xato.i === i ? `${i}-${xato.k}` : i} silk={!!(xato && xato.i === i)} holat={xato && xato.i === i ? 'err' : undefined} style={{ '--i': i }} onClick={() => tanla(t, i)}>{tr(t.t)}</QChip>)}
      </div>, osti: xato && <div className="ti-xato-q"><QXato>{tr(qd.xato)}</QXato>{yordam.includes(qadam) && <QIzoh>{tr(qd.yordam)}</QIzoh>}</div> };
    });
  }
  const tolay = faza === 'tanlov' || faza === 'togri';
  const tartib = tugadi ? [...royxat].sort((a, b) => a - b) : royxat;
  const roy = (
    <GoyaRoyxat sarlavha={ROYXAT_YORLIQ.mentor} son={royxat.length} keng={tugadi}
      ostida={tugadi && <QIzoh>{tr({ uz: "«Maydon»ni davom ettiradigan ikki g'oya ham ro'yxatda boshqalar bilan teng turibdi.", ru: 'Обе идеи, которые продолжают «Maydon», стоят в списке наравне с остальными.' })}</QIzoh>}>
      <RoyxatOl ikki={tugadi}>
        {tartib.map(i => <GoyaQator key={i} g={MENTOR_GOYALAR[i]} i={i} matn={tr(MENTOR_GOYALAR[i].nom)} uch={'s4g' + i} yangi={yangi === i}
          belgi={tugadi ? '›' : undefined} ochiq={tugadi && ochiq === i} onBos={tugadi ? () => setOchiq(o => (o === i ? null : i)) : undefined} />)}
      </RoyxatOl>
    </GoyaRoyxat>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · manba', ru: 'Понятие · источник' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'sh qatorni to'ldiring", ru: 'Заполните пустую строку' })} (${Math.min(qadam, 3)}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Mentor qolgan g'oyalarini <A>qayerdan topdi?</A></>, ru: <>Где Ментор <A>нашёл остальные идеи?</A></> })}
        mentor={<Mentor>{tr({ uz: "Har manbadan bitta yozuv keladi: kartadagi bo'sh qatorni to'ldiring.", ru: 'Из каждого источника приходит одна запись: заполните пустую строку на карточке.' })}</Mentor>}
        harakat={<div className="ti-s4q">
          <QQadamlar joriy={qadam < 3 ? qadam : undefined} qadamlar={S4_QADAM.map(st => manbaT(st.manba))} />
          <NishonQatori screen={screen} />
        </div>}
        vizual={tugadi ? <div className="ti-s4 tamom">{roy}</div> : <div className="ti-s4">
          <S4Manba k={Math.min(qadam, 2)} faol={qadam < 3 && faza !== 'kutish'} />
          <div className="ti-s4-ong">
            {faza !== 'qolgan' && faza !== 'tamom' && <div ref={kartaRef}>
              <GoyaKarta uch="s4karta" className={cxx(!tolay && 'kutish')} nom={tolay && g.nom} manba={tolay && qd.manba} dalil={tolay && qd.dalil && tr(qd.dalil)} qator={qator} />
            </div>}
            {roy}
          </div>
          {tolay && <Bog kalit={`s4-${qadam}-${faza}`} juftlar={[{ dan: `[data-s4src="${qadam}"]`, gacha: `.ti-s4-ong [data-q="${qd.mq}"]`, tur: 'acc', yon: 'orta' }]} />}
        </div>}
        xulosa={tugadi && tr({ uz: 'Bu misolda har manbadan kelgan yozuvga bitta qism yetishmadi — uni siz qo\'shdingiz.', ru: 'В этом примере записи из каждого источника не хватало одной части — вы её добавили.' })}
      />
      <MentorNote>{tr({ uz: "«Keyin» qutisi — 9-Modul 3-darsdagi MVP doskasi. «To'lov» va «jamoa yig'ish» Mentorning «Maydon»ini davom ettiradi — ular ham boshqa g'oyalar bilan bitta ro'yxatda. Sinfdan so'rang: «Sizning «Keyin» qutingizda nima qolgan edi?»", ru: 'Коробка «Потом» — доска MVP из 3-го урока 9-го модуля. «Оплата» и «сбор команды» продолжают «Maydon» Ментора — они тоже в одном списке с другими идеями. Спросите класс: «Что осталось в вашей коробке «Потом»?»' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s5 = 0) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · yechim va muammo', ru: 'Проверка · решение и проблема' })}
    questionText="Bekatda avtobus qachon kelishi bilinmaydi. Qaysi yechim mos?"
    question={tr({ uz: <h2 className="title h-ask">Bekatda avtobus qachon kelishi bilinmaydi. <A>Qaysi yechim mos?</A></h2>, ru: <h2 className="title h-ask">На остановке неизвестно, когда придёт автобус. <A>Какое решение подходит?</A></h2> })}
    options={[
      { uz: "Avtobus necha daqiqada kelishini ko'rsatadi", ru: 'Показывает, через сколько минут придёт автобус' },
      { uz: "Bekatda kutganlarga qiziqarli video ko'rsatadi", ru: 'Показывает ждущим на остановке интересное видео' },
      { uz: "Avtobusdagi bo'sh o'rindiqlar sonini ko'rsatadi", ru: 'Показывает число свободных мест в автобусе' },
      { uz: "Yo'l haqini telefondan to'lashga yordam beradi", ru: 'Помогает оплатить проезд с телефона' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Bu yechim aynan shu muammoga javob beradi: kutgan odam vaqtni biladi.', ru: 'Это решение отвечает именно на эту проблему: ждущий знает время.' }}
    explainWrong={{
      1: { uz: 'Video kutishni qiziq qiladi, vaqt esa baribir noma\'lum.', ru: 'Видео делает ожидание интересным, а время всё равно неизвестно.' },
      2: { uz: "Bo'sh o'rin — boshqa muammo, vaqt baribir noma'lum.", ru: 'Свободные места — другая проблема, время всё равно неизвестно.' },
      3: { uz: "To'lov — boshqa muammo, avtobus vaqti noma'lum.", ru: 'Оплата — другая проблема, время автобуса неизвестно.' },
      default: { uz: 'Muammo qatorini qayta o\'qing: yechim shunga javob bersin.', ru: 'Перечитайте строку «Проблема»: пусть решение отвечает на неё.' }
    }}
    vizual={<div className="ti-bogli"><GoyaKarta className="kichik" nom={{ uz: 'Avtobus vaqti', ru: 'Время автобуса' }}
      qator={{
        muammo: { holat: 'bor', matn: { uz: 'avtobus qachon kelishi bilinmaydi', ru: 'неизвестно, когда придёт автобус' } },
        kim: { holat: 'bor', matn: { uz: "bekatda kutadigan o'quvchilar", ru: 'ученики, которые ждут на остановке' } },
        yechim: { holat: 'bor', matn: { uz: "Avtobus necha daqiqada kelishini ko'rsatadi", ru: 'Показывает, через сколько минут придёт автобус' } }
      }} /><Bog kalit="s5" juftlar={[{ dan: '[data-q="muammo"]', gacha: '[data-q="yechim"]', tur: 'ok', yon: 'chap' }]} /></div>} />
);

// ===== SCREEN 6 — STARBUCKS (QVoqea, PM keys K18 — bank matni aynan, raqamsiz; nom o'z yashil rangida, logotipsiz; bosqich gapi Mentorda) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K18 · tayanch 5. «Qahva nuqtasi — qahva olib, chiqib ketadigan joy» — bankdagi qarama-qarshi atamaning izohi.
const STARBUCKS_BOSQICH = [
  { h: { uz: 'Qahva nuqtasi', ru: 'Точка с кофе' }, m: { uz: "Qahva nuqtasi — qahva olib, chiqib ketadigan joy. Shuls Starbucks'ni qanday qurganini bosqichma-bosqich ko'ring.", ru: 'Точка с кофе — место, где берут кофе и уходят. Посмотрите по шагам, как Шульц построил Starbucks.' } },
  { h: { uz: 'Uchinchi joy', ru: 'Третье место' }, m: { uz: "Birinchi joy — uy, ikkinchisi — ish yoki maktab. Shuls Starbucks'ni ularning o'rtasidagi «uchinchi joy» qilib qurgan.", ru: 'Первое место — дом, второе — работа или школа. Шульц построил Starbucks как «третье место» между ними.' } },
  { h: { uz: "O'tirish, ishlash, uchrashish", ru: 'Сидеть, работать, встречаться' }, m: { uz: 'U yerda odamlar o\'tiradi, ishlaydi va uchrashadi. Ular ichimlik uchun emas, joy va muhit uchun to\'laydi.', ru: 'Там люди сидят, работают и встречаются. Они платят не за напиток, а за место и атмосферу.' } }
];
const SB_TAXMIN = [
  { k: 'ichimlik', t: { uz: 'Ichimlik uchun', ru: 'За напиток' } },
  { k: 'tezlik', t: { uz: 'Ichimlik va tezlik uchun', ru: 'За напиток и скорость' } },
  { k: 'joy', ok: true, t: { uz: 'Joy va muhit uchun', ru: 'За место и атмосферу' } }
];
const SB_SAVOL = { uz: "Odamlar Starbucks'da nima uchun pul to'laydi?", ru: 'За что люди платят в Starbucks?' };
// Kafe binosi (2-bosqich): yashil soyabon, iliq oynalar, nom «Starbucks» o'z rangida (logotip yo'q)
const SbKafe = ({ x, y, w, h }) => (
  <g className="sb-kafe">
    <rect x={x} y={y} width={w} height={h} rx="3" fill="#FFF8EE" stroke="#C9B49A" strokeWidth="1.4" />
    <path d={`M ${x - 6} ${y + 4} h ${w + 12} l -8 18 h ${-(w - 4)} z`} fill="#00704A" />
    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={x - 2 + i * (w + 4) / 5} y={y + 18} width={(w + 4) / 10} height="4" fill="#0B5A3D" />)}
    <rect className="sb-oyna" x={x + 9} y={y + 30} width={w * 0.42} height={h * 0.4} rx="2" />
    <rect className="sb-oyna" x={x + w * 0.56} y={y + 30} width={w * 0.34} height={h * 0.4} rx="2" />
    <rect x={x + w * 0.6} y={y + h * 0.6} width={w * 0.22} height={h * 0.4} rx="2" fill={RANG.yogochQ} />
    <text className="sb-nom" x={x + w / 2} y={y - 7} textAnchor="middle">Starbucks</text>
  </g>
);
// Sahna (chizilgan SVG, bosqichga qarab o'zgaradi; odamlar real ko'rinishda — SABOQ 36; MD va bankda yo'q narsa chizilmaydi)
const StarbucksSahna = ({ b }) => (
  <svg className={cxx('ti-sb', `b${b}`)} viewBox="0 0 560 210" role="img" aria-label={tr(STARBUCKS_BOSQICH[b].h)} key={b}>
    {b === 0 && <g>
      <rect x="0" y="0" width="560" height="190" fill={RANG.devor} />
      <rect x="0" y="186" width="560" height="24" fill={RANG.pol} />
      <g transform="translate(280 188) scale(1.18) translate(-280 -188)">
        {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={222 + i * 19.3} y="70" width="19.3" height="18" fill={i % 2 ? '#FFF8E4' : '#E07A5F'} />)}
        <path d="M 220 88 h 120 l -6 8 h -108 z" fill="#C9673F" />
        <rect x="234" y="96" width="92" height="92" rx="3" fill={RANG.yogoch} />
        <rect x="244" y="104" width="72" height="40" rx="3" fill="#6B4528" />
        <Odam x={282} y={156} s={0.62} kiyim={4} teri={2} soch={1} />
        <rect x="238" y="142" width="84" height="9" rx="2" fill={RANG.yogochQ} />
        <rect x="246" y="156" width="68" height="26" rx="2" fill="#A87444" />
        <g><rect x="262" y="48" width="36" height="20" rx="4" fill="#FFF8E4" stroke={RANG.yogochQ} strokeWidth="1.2" /><path d="M 273 53 h 14 v 7 a 4 4 0 0 1 -4 4 h -6 a 4 4 0 0 1 -4 -4 z" fill={RANG.yogochQ} /></g>
        <g className="sb-stakan-p"><rect x="300" y="129" width="9" height="13" rx="1.6" fill="#FFFFFF" stroke="#C9B49A" strokeWidth="0.8" /><rect x="300" y="133" width="9" height="4" fill={RANG.yogoch} /><rect x="299.3" y="126.6" width="10.4" height="3" rx="1.2" fill="#E9E0D2" /></g>
      </g>
      <g className="sb-yuruvchi">
        <Odam x={0} y={188} s={1.3} kiyim={1} teri={0} soch={0} />
        <g className="sb-stakan-q"><rect x="9" y="142" width="10" height="14" rx="1.8" fill="#FFFFFF" stroke="#C9B49A" strokeWidth="0.8" /><rect x="9" y="147" width="10" height="4.5" fill={RANG.yogoch} /></g>
      </g>
    </g>}
    {b === 1 && <g>
      <rect x="0" y="0" width="560" height="176" fill="#EAF3F8" />
      <rect x="0" y="176" width="560" height="34" fill="#D8CFC3" />
      <line x1="0" y1="194" x2="560" y2="194" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="16 12" />
      <g className="sb-bino" style={{ '--i': 0 }}><polygon points="26,104 72,70 118,104" fill="#C9673F" /><rect x="34" y="104" width="76" height="72" rx="2" fill="#F3D9B8" /><rect x="46" y="116" width="22" height="20" rx="2" fill="#FFE9C2" /><rect x="80" y="134" width="20" height="42" rx="2" fill={RANG.yogochQ} /></g>
      <g className="sb-bino" style={{ '--i': 1 }}>
        <rect x="404" y="94" width="66" height="82" rx="2" fill="#F2C98A" /><polygon points="400,94 437,76 474,94" fill="#C9673F" /><line x1="437" y1="76" x2="437" y2="56" stroke={RANG.yogochQ} strokeWidth="2" /><polygon points="437,56 452,60 437,64" fill="#E07A5F" />
        {[0, 1].map(i => <rect key={i} x={414 + i * 26} y="106" width="18" height="16" rx="2" fill="#FFF8E4" />)}
        <rect x="476" y="52" width="60" height="124" rx="2" fill="#BFD3E6" />
        {[0, 1, 2, 3].map(i => <g key={i}><rect x="484" y={62 + i * 27} width="18" height="15" rx="2" fill="#EAF2FA" /><rect x="510" y={62 + i * 27} width="18" height="15" rx="2" fill="#EAF2FA" /></g>)}
      </g>
      <SbKafe x={226} y={104} w={108} h={72} />
      {[[72, 54, '1'], [280, 70, '3'], [470, 30, '2']].map(([x, y, n]) => <g key={n} className={cxx('sb-raqam', n === '3' && 'uch')}><circle cx={x} cy={y} r="13" /><text x={x} y={y + 5} textAnchor="middle">{n}</text></g>)}
      <g className="sb-yolchi"><Odam x={0} y={188} s={1.15} kiyim={0} teri={1} soch={1} sochTur="uzun" qol="telefon" /></g>
    </g>}
    {b === 2 && <g>
      <rect x="0" y="0" width="560" height="168" fill="#F3E6D6" />
      <rect x="0" y="168" width="560" height="42" fill="#D9B48C" />
      {[0, 1, 2, 3, 4, 5, 6].map(i => <line key={i} x1={i * 84} y1="168" x2={i * 84 - 30} y2="210" stroke="#C49A6C" strokeWidth="1.5" />)}
      <rect x="190" y="10" width="180" height="54" rx="4" fill="#FFE9C2" stroke="#D8C2A2" strokeWidth="1.5" />
      <line x1="280" y1="10" x2="280" y2="64" stroke="#D8C2A2" strokeWidth="1.5" />
      <text className="sb-nom" x="280" y="86" textAnchor="middle">Starbucks</text>
      {[110, 450].map((x, i) => <g key={x} className="sb-chiroq" style={{ '--i': i }}><line x1={x} y1="0" x2={x} y2="30" stroke="#8C7A66" strokeWidth="1.5" /><ellipse className="sb-nur" cx={x} cy="46" rx="36" ry="17" /><path d={`M ${x - 16} 42 a 16 14 0 0 1 32 0 z`} fill="#00704A" /></g>)}
      <g className="sb-kir" style={{ '--i': 0 }}>
        <rect x="24" y="122" width="150" height="26" rx="12" fill="#B9603B" />
        <rect x="30" y="140" width="138" height="30" rx="10" fill="#C9734A" />
        <rect x="16" y="130" width="20" height="44" rx="7" fill="#B9603B" /><rect x="162" y="130" width="20" height="44" rx="7" fill="#B9603B" />
        <Odam x={84} y={186} s={1.08} poza="otir" kiyim={5} teri={0} soch={2} sochTur="dumaloq" qol="stakan" />
      </g>
      <g className="sb-kir" style={{ '--i': 1 }}>
        <rect x="250" y="156" width="30" height="6" rx="2" fill={RANG.yogochQ} /><rect x="253" y="162" width="4" height="24" fill={RANG.yogochQ} /><rect x="273" y="162" width="4" height="24" fill={RANG.yogochQ} /><rect x="246" y="128" width="6" height="34" rx="2" fill={RANG.yogochQ} />
        <Odam x={262} y={186} s={1.08} poza="otir" kiyim={2} teri={1} soch={0} />
        <rect x="282" y="140" width="84" height="7" rx="2" fill={RANG.yogochQ} /><rect x="320" y="147" width="8" height="40" fill={RANG.yogochQ} />
        <rect x="296" y="121" width="32" height="20" rx="2" fill="#4A4E63" /><rect x="291" y="140" width="42" height="3" rx="1" fill="#6B7085" /><circle cx="312" cy="131" r="2.5" fill="#E9E0D2" />
        <g><rect x="346" y="129" width="9" height="11" rx="1.6" fill="#FFFFFF" stroke="#C9B49A" strokeWidth="0.8" /><rect x="346" y="132" width="9" height="3.5" fill={RANG.yogoch} /></g>
      </g>
      <g className="sb-kir" style={{ '--i': 2 }}>
        <Odam x={420} y={190} s={1.2} kiyim={3} teri={2} soch={1} qol="stakan" />
        <Odam x={486} y={190} s={1.2} yuz={-1} kiyim={4} teri={0} soch={0} sochTur="uzun" />
        <g className="sb-suhbat">
          <g><rect x="398" y="62" width="34" height="20" rx="9" fill="#FFFFFF" stroke="#D8C2A2" /><circle cx="408" cy="72" r="2" fill="#B9A58C" /><circle cx="415" cy="72" r="2" fill="#B9A58C" /><circle cx="422" cy="72" r="2" fill="#B9A58C" /></g>
          <g><rect x="470" y="54" width="34" height="20" rx="9" fill="#FFFFFF" stroke="#D8C2A2" /><circle cx="480" cy="64" r="2" fill="#B9A58C" /><circle cx="487" cy="64" r="2" fill="#B9A58C" /><circle cx="494" cy="64" r="2" fill="#B9A58C" /></g>
        </g>
      </g>
      <g><rect x="532" y="160" width="20" height="8" rx="2" fill={RANG.yogochQ} /><rect x="537" y="146" width="10" height="14" rx="1.8" fill="#FFFFFF" stroke="#C9B49A" strokeWidth="0.8" /><rect x="537" y="150" width="10" height="4" fill={RANG.yogoch} /></g>
    </g>}
  </svg>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [xulosaVaqt, setXulosaVaqt] = useState(!!storedAnswer);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!done || xulosaVaqt) return undefined; const t = setTimeout(() => setXulosaVaqt(true), kamHarakat() ? 0 : 1700); return () => clearTimeout(t); }, [done, xulosaVaqt]);
  const bq = STARBUCKS_BOSQICH[b];
  const kutish = b === 0 && !taxmin;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const tx = SB_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Starbucks /> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || (done && !xulosaVaqt)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Starbucks /> qanday joy bo'lib <A>qurilgan?</A></>, ru: <>Каким местом <A>построен</A> <Starbucks />?</> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="ti-nuq"><span className="ti-nuq-l">{yorliq}</span>{STARBUCKS_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="ti-voqea">
          {b === 0 && <p className="ti-sb-tanish"><Starbucks /> — {tr({ uz: 'qahva va boshqa ichimliklar sotadigan kafelar.', ru: 'кафе, где продают кофе и другие напитки.' })}</p>}
          <span className="ti-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><StarbucksSahna b={b} /></Zoomable>
          {kutish && <div className="ti-bash"><QBashorat yorliq={yorliq} savol={tr(SB_SAVOL)} variantlar={SB_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          {taxmin && !(done && xulosaVaqt) && <div className="ti-bashq fade-step"><span>{tr(SB_SAVOL)}</span><span className="ti-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{tr(tx.t)}</b></span></div>}
          {done && xulosaVaqt && <QXulosa>{tx && <span className={cxx('ti-tx', tx.ok && 'ok')}>{tx.ok
            ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t).toLowerCase()} <b className="yoq">✕</b> · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'joy va muhit uchun', ru: 'за место и атмосферу' })}</b></>}</span>}
            {tr({ uz: "Shuls Starbucks'ni ichimlik uchun emas, o'tirish, ishlash va uchrashish uchun joy qilib qurgan.", ru: 'Шульц построил Starbucks не ради напитка, а как место, где сидят, работают и встречаются.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Starbucks 4-Modulning «Bitta natija, uch xil sabab» darsida ham «uchinchi joy» bo'lib chiqqan — eslating; bugungi savol boshqa: kafeni nima tasvirlaydi. Sinfdan so'rang: «Qahva nuqtasi» va «uchinchi joy» — ikkalasida ham qahva bor; farq nimada? Bankdan tashqari raqam, yil va voqea qo'shmang.", ru: 'Starbucks уже был «третьим местом» в уроке 4-го модуля «Один результат, три разные причины» — напомните; сегодняшний вопрос другой: что описывает кафе. Спросите класс: в «точке с кофе» и в «третьем месте» есть кофе — в чём разница? Не добавляйте чисел, лет и событий вне банка.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s7 = 3; Starbucks qoidasi — kafe olamida) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Starbucks'dagidek", ru: 'Проверка · как в Starbucks' })}
    questionText="Qaysi gap kafeni Starbucks'dagidek tasvirlaydi?"
    question={tr({ uz: <h2 className="title h-ask">Qaysi gap kafeni <Starbucks />'dagidek <A>tasvirlaydi?</A></h2>, ru: <h2 className="title h-ask">Какая фраза <A>описывает</A> кафе как в <Starbucks />?</h2> })}
    options={[
      { uz: 'Shaharda eng mazali qahva sotiladigan joy', ru: 'Место, где продают самый вкусный кофе в городе' },
      { uz: 'Qahvani tez olib, chiqib ketiladigan nuqta', ru: 'Точка, где быстро берут кофе и уходят' },
      { uz: "Ichimliklari eng arzon bo'lgan kichik kafe", ru: 'Маленькое кафе с самыми дешёвыми напитками' },
      { uz: "Uy va maktab o'rtasida uchrashadigan joy", ru: 'Место встреч между домом и школой' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Starbucks'da odamlar ichimlik uchun emas, joy va muhit uchun to'laydi.", ru: 'В Starbucks люди платят не за напиток, а за место и атмосферу.' }}
    explainWrong={{
      0: { uz: 'Mazali qahva — ichimlik haqida, joy haqida emas.', ru: 'Вкусный кофе — про напиток, а не про место.' },
      1: { uz: "Bu — qahva nuqtasi: olib, chiqib ketiladi.", ru: 'Это точка с кофе: взяли и ушли.' },
      2: { uz: 'Narx — ichimlik haqida; odamlar joy uchun keladi.', ru: 'Цена — про напиток; люди приходят за местом.' },
      default: { uz: "Starbucks'da odamlar nima qiladi — shuni eslang.", ru: 'Вспомните, что люди делают в Starbucks.' }
    }} />
);

// ===== SCREEN 8 — OLTITA G'OYA (QMustaqil, USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29) · artefakt pm-m9d1-goyalar · nishon sixIdeas =====
// Tekshiruv yumshoq: bo'sh qator bloklaydi; qolgani — xuddi shu xato bilan ikkinchi «Saqlash» o'tadi.
// Tutuq va qo'shtirnoq turlari bitta ko'rinishga keltiriladi (belgilar kod bilan yig'iladi — fayl ichida maxsus belgi turmaydi)
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const QOSHTIRNOQ_RE = new RegExp('[' + String.fromCharCode(0xAB, 0xBB, 0x22, 0x201C, 0x201D) + '.!?,;:]+', 'g');
const normYoz = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(QOSHTIRNOQ_RE, ' ').replace(/\s+/g, ' ').trim();
const XOHISH_RE = /(xohlaydi|xohlardi|yoqadi|yaxshi ko'radi|bo'lsa yaxshi)/;
const HAMMA_KIM = ['hamma', 'odamlar', 'hamma odamlar', 'barcha odamlar', 'har kim', 'hamma uchun'];
const tekshirGoya = (g, royxat, tahrir) => {
  const m = normYoz(g.muammo), k = normYoz(g.kim), y = normYoz(g.yechim);
  if (!m) return { k: 'muammo', tur: 'bosh', q: true };
  if (!k) return { k: 'kim', tur: 'bosh', q: true };
  if (!y) return { k: 'yechim', tur: 'bosh', q: true };
  if (XOHISH_RE.test(m)) return { k: 'muammo', tur: 'xohish' };
  if (HAMMA_KIM.includes(k)) return { k: 'kim', tur: 'hamma' };
  const sozlar = y.split(' ').filter(Boolean);
  if (sozlar.length <= 2 && sozlar.some(w => /^(ilova|sayt|bot|ai)/.test(w))) return { k: 'yechim', tur: 'nom' };
  if (royxat.some((o, i) => i !== tahrir && normYoz(o.muammo) === m && normYoz(o.yechim) === y)) return { k: 'muammo', tur: 'takror' };
  return null;
};
const XABAR8 = {
  bosh: { uz: 'Uch qatorni ham yozing.', ru: 'Заполните все три строки.' },
  xohish: { uz: "Bu xohish — odam nimadan qiynalgani ko'rinmaydi.", ru: 'Это желание — не видно, от чего страдает человек.' },
  hamma: { uz: "Kim uchun aniqroq bo'lsin: qanday odamlar?", ru: 'Для кого — точнее: какие люди?' },
  nom: { uz: 'Mahsulot aynan nima qiladi? Bir gap bilan yozing.', ru: 'Что именно делает продукт? Напишите одной фразой.' },
  takror: { uz: "Bu g'oya ro'yxatda bor — boshqasini yozing.", ru: 'Эта идея уже есть в списке — напишите другую.' }
};
const QOLDIR8 = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — снова нажмите «Сохранить».' };
const PH8 = {
  muammo: { uz: 'Odamlar nimadan qiynaladi?', ru: 'От чего страдают люди?' },
  kim: { uz: 'Aynan qanday odamlar?', ru: 'Какие именно люди?' },
  yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' }
};
const BOSH_G = { muammo: '', kim: '', yechim: '', manba: null };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const YORDAM_T = { uz: 'Yordam', ru: 'Подсказка' };
const s8Xulosa = (royxat) => {
  const son = (id) => royxat.filter(g => g.manba === id).length;
  const bolak = [[son('royxat'), { uz: "9-Modul ro'yxatidan", ru: 'из списка 9-го модуля' }], [son('keyin'), { uz: '«Keyin» qutisidan', ru: 'из коробки «Потом»' }], [son('kuzatuv'), { uz: 'yangi kuzatuvdan', ru: 'из нового наблюдения' }]]
    .filter(([x]) => x > 0).map(([x, t]) => (__lang === 'ru' ? `${x} — ${tr(t)}` : `${x} tasi ${tr(t)}`)).join(', ');
  return tr({ uz: `G'oyalaringiz tayyor: ${bolak}.`, ru: `Ваши идеи готовы: ${bolak}.` });
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [royxat, setRoyxat] = useState(goyalarLs);
  const [joriy, setJoriy] = useState(BOSH_G);
  const [tahrir, setTahrir] = useState(null);
  const [tg, setTg] = useState(null);
  const [ochiqManba, setOchiqManba] = useState(null);
  const [xato, setXato] = useState(null);
  const [yangi, setYangi] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [kartaK, setKartaK] = useState(0);
  const [yozildi, setYozildi] = useState(null);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const [src] = useState(() => {
    const m = lsGet('pm-m7d1-muammolar'); const v = lsGet('pm-m7d3-mvp');
    return {
      royxat: m && Array.isArray(m.muammolar) ? m.muammolar.map(x => (x && typeof x.matn === 'string' ? x.matn.trim() : '')).filter(Boolean).slice(0, 10) : [],
      keyin: v && Array.isArray(v.keyin) ? v.keyin.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()).slice(0, 8) : []
    };
  });
  const n = royxat.length;
  const done = n >= 6 && tahrir === null;
  const g = tahrir !== null ? tg : joriy;
  const setG = (f) => (tahrir !== null ? setTg(o => ({ ...o, ...f })) : setJoriy(o => ({ ...o, ...f })));
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => { if (yozildi === null) return undefined; const t = setTimeout(() => setYozildi(null), 1300); return () => clearTimeout(t); }, [yozildi]);
  useEffect(() => {
    if (n < 6 || storedAnswer !== undefined) return;
    const c = royxat.filter(x => x.manba === 'kuzatuv').length;
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'goyalar', correct: true, picked: true, solved: true, kuzatuvdan: c });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'goyalar', c, true, 0);
  }, [n]); // eslint-disable-line
  const manbaTanla = (id) => { setG({ manba: id }); setOchiqManba(id === 'kuzatuv' ? null : id); };
  const yozMatn = (k, t) => { setG({ [k]: t }); setYozildi(k); setOchiqManba(null); if (xato && xato.k === k) setXato(null); };
  const ozgar = (k, v) => { setG({ [k]: v }); if (xato && xato.k === k && xato.q) setXato(null); };
  const ochTahrir = (i) => { if (isMentor) return; setTahrir(i); setTg({ ...royxat[i] }); setXato(null); setOchiqManba(null); setKartaK(k => k + 1); };
  const saqla = () => {
    if (!g || !g.manba) return;
    const t = tekshirGoya(g, royxat, tahrir);
    const imzo = t && `${t.tur}|${normYoz(g[t.k])}`;
    if (t && (t.q || !(xato && xato.imzo === imzo))) { setXato({ ...t, imzo, kk: Date.now() }); return; }
    setXato(null);
    const yg = { muammo: g.muammo.trim(), kim: g.kim.trim(), yechim: g.yechim.trim(), manba: g.manba };
    const idx = tahrir !== null ? tahrir : royxat.length;
    const yangiRo = tahrir !== null ? royxat.map((o, i) => (i === tahrir ? yg : o)) : [...royxat, yg];
    uch(kartaRef.current, 's8g' + idx, 620);
    setRoyxat(yangiRo); lsSet(GOYA_KEY, { goyalar: yangiRo, savedAt: Date.now() });
    setYangi(idx);
    if (tahrir !== null) { setTahrir(null); setTg(null); } else setJoriy(BOSH_G);
    setOchiqManba(null); setYordam(false); setKartaK(k => k + 1);
  };
  const ishlatilgan = (k, matn) => royxat.some(o => normYoz(o[k]) === normYoz(matn));
  const toliq = !!(g && g.manba && g.muammo.trim() && g.kim.trim() && g.yechim.trim());
  const birinchiBosh = g && g.manba ? QISM.find(q => !g[q.k].trim()) : null;
  const qator = {};
  if (g) QISM.forEach(q => {
    const xq = xato && xato.k === q.k;
    qator[q.k] = {
      holat: xq ? 'xato' : (birinchiBosh && birinchiBosh.k === q.k) ? 'joriy' : g[q.k].trim() ? 'bor' : 'bosh',
      ichi: <input key={xq ? xato.kk : 'i'} className={cxx('ti-inp', yozildi === q.k && 'yozildi', birinchiBosh && birinchiBosh.k === q.k && 'ti-halqa-i')} value={g[q.k]} disabled={!g.manba}
        placeholder={tr(PH8[q.k])} aria-label={tr(q.t)} onChange={(e) => ozgar(q.k, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />,
      osti: xq && <div className="ti-xato-q"><QXato>{tr(XABAR8[xato.tur])}</QXato>{!xato.q && <QIzoh>{tr(QOLDIR8)}</QIzoh>}</div>
    };
  });
  const manbaUstida = g && <div className="ti-s8-manba">
    <div className={cxx('ti-src-ro', !g.manba && 'ti-guruh')}>{MANBALAR.map(m => <QChip key={m.id} holat={g.manba === m.id ? 'on' : undefined} onClick={() => manbaTanla(m.id)}>{tr(m.t)}</QChip>)}</div>
    {ochiqManba === 'royxat' && (src.royxat.length
      ? <ol className="ti-src-list fade-step">{src.royxat.map((t, i) => <li key={i}><button type="button" className={cxx('ti-src-b', ishlatilgan('muammo', t) && 'ishl')} onClick={() => yozMatn('muammo', t)}><span>{t}</span>{ishlatilgan('muammo', t) && <i>✓</i>}</button></li>)}</ol>
      : <p className="ti-kul-q fade-step">{tr({ uz: "Ro'yxat topilmadi — muammoni o'zingiz yozing.", ru: 'Список не найден — напишите проблему сами.' })}</p>)}
    {ochiqManba === 'keyin' && (src.keyin.length
      ? <div className="ti-src-chips fade-step">{src.keyin.map((t, i) => <button key={i} type="button" className={cxx('ti-src-b', 'chip', ishlatilgan('yechim', t) && 'ishl')} onClick={() => yozMatn('yechim', t)}><span>{t}</span>{ishlatilgan('yechim', t) && <i>✓</i>}</button>)}</div>
      : <p className="ti-kul-q fade-step">{tr({ uz: 'Qutingiz topilmadi — funksiyani o\'zingiz yozing.', ru: 'Коробка не найдена — напишите функцию сами.' })}</p>)}
    {g.manba === 'kuzatuv' && <p className="ti-kul-q fade-step">{tr({ uz: 'Kim, qayerda, nimadan qiynaldi?', ru: 'Кто, где, от чего страдал?' })}</p>}
  </div>;
  const roy = (
    <GoyaRoyxat sarlavha={ROYXAT_YORLIQ.mening} son={n} keng={done} className="ti-s8-ro">
      {n > 0 && <RoyxatOl ikki>
        {royxat.map((o, i) => <GoyaQator key={i} g={o} i={i} matn={o.yechim} uch={'s8g' + i} yangi={yangi === i} joriy={tahrir === i} belgi="✎" onBos={isMentor ? undefined : () => ochTahrir(i)} />)}
      </RoyxatOl>}
    </GoyaRoyxat>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (__lang === 'ru' ? `Напишите ещё ${6 - n}` : `Yana ${6 - n} ta g'oya yozing`)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Oltita g'oyani <A>bittalab</A> yozing.</>, ru: <>Напишите шесть идей <A>по одной</A>.</> })}
        mentor={<Mentor>{tr({ uz: 'Avval manbani tanlang, keyin uch qatorni yozing: bugun g\'oyalar baholanmaydi.', ru: 'Сначала выберите источник, потом заполните три строки: сегодня идеи не оцениваются.' })}</Mentor>}
        qadamlar={isMentor
          ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: "Oltita g'oyani yozganlar", ru: 'Написали шесть идей' }, { uz: 'Yangi kuzatuvdan yozilganlar', ru: 'Написали из нового наблюдения' }]} hisob={(rows, jami) => [`${rows.length} / ${jami}`, String(rows.filter(r => r.picked > 0).length)]} />
            <GoyaRoyxat sarlavha={ROYXAT_YORLIQ.mentor} son={MENTOR_GOYALAR.length} keng className="ti-s8-ro"><RoyxatOl ikki>{MENTOR_GOYALAR.map((m, i) => <GoyaQator key={i} g={m} i={i} matn={tr(m.nom)} ochiq />)}</RoyxatOl></GoyaRoyxat></>
          : roy}
        forma={!isMentor && !done && <div className="ti-s8-k" key={kartaK} ref={kartaRef}>
          <GoyaKarta katta className="ti-karta-kir" qator={qator} ustida={manbaUstida}
            ostida={<div className="ti-s8-amal">
              <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
              <QTugma className={halqa(toliq)} disabled={!g || !g.manba} onClick={saqla}>{tr(SAQLASH)}</QTugma>
            </div>} />
          {yordam && <div className="ti-yordam fade-step"><QIzoh>{tr({ uz: "Manbalarni birma-bir oching: 9-Modul ro'yxatidagi muammoga yechim yozing, «Keyin» qutisidagi funksiyaga muammo toping, keyin bugun yo'lda ko'rganingizni eslang.", ru: 'Открывайте источники по одному: к проблеме из списка 9-го модуля напишите решение, к функции из коробки «Потом» найдите проблему, потом вспомните, что видели сегодня по дороге.' })}</QIzoh><QIzoh>{tr({ uz: "O'z MVP'ingizni davom ettirish ham g'oya — u boshqalar qatorida turadi.", ru: 'Продолжение вашего MVP — тоже идея: она стоит в ряду с другими.' })}</QIzoh></div>}
        </div>}
      >
        {done && !isMentor && <QXulosa>{s8Xulosa(royxat)}</QXulosa>}
        <MentorNote>{tr({ uz: "Taymer yo'q — 20 daqiqadan keyin juftlikka o'ting; oltitaga yetmagan o'quvchi uyda to'ldiradi. Eng ko'p xato — yechim o'rniga nom yozish («futbol ilovasi»): «Ilova aynan nima qiladi?» deb so'rang. G'oyani «yomon» demang — bugun faqat yoziladi.", ru: 'Таймера нет — через 20 минут переходите к работе в парах; кто не дописал до шести, допишет дома. Самая частая ошибка — название вместо решения («футбольное приложение»): спросите «Что именно делает приложение?». Не называйте идею «плохой» — сегодня их только записывают.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — FAQAT YECHIM (QMustaqil, juftlik 3 qadam; P-057 solishtirish sahnasi) · pm-m9d1-goyalar ga yozmaydi · nishon pairCheck =====
const S9_QADAM = {
  juft: [{ uz: "G'oyani tanlang", ru: 'Выберите идею' }, { uz: "Yechimni o'qing", ru: 'Прочитайте решение' }, { uz: 'Solishtiring', ru: 'Сравните' }],
  yakka: [{ uz: "Yechimni o'qing", ru: 'Прочитайте решение' }, { uz: 'Muammoni yozing', ru: 'Напишите проблему' }, { uz: 'Solishtiring', ru: 'Сравните' }]
};
const TAYMER_R = 46;
function PairTimer({ soniya = 60, onBosh }) {
  const [st, setSt] = useState({ yur: false, qoldi: soniya });
  useEffect(() => {
    if (!st.yur) return undefined;
    if (st.qoldi <= 0) { setSt({ yur: false, qoldi: soniya }); return undefined; }
    const t = setTimeout(() => setSt(p => ({ ...p, qoldi: p.qoldi - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st]); // eslint-disable-line
  const C = 2 * Math.PI * TAYMER_R;
  const ulush = st.yur ? st.qoldi / soniya : 1;
  return (
    <div className={cxx('ti-taymer', st.yur && 'yur')}>
      <div className="ti-taymer-h">
        <svg viewBox="0 0 110 110" aria-hidden="true"><circle className="f" cx="55" cy="55" r={TAYMER_R} /><circle className="o" cx="55" cy="55" r={TAYMER_R} style={{ strokeDasharray: C, strokeDashoffset: C * (1 - ulush) }} /></svg>
        <span className="ti-taymer-s">{Math.floor(st.qoldi / 60)}:{String(st.qoldi % 60).padStart(2, '0')}</span>
      </div>
      {!st.yur && <QTugma ikkinchi className="ti-halqa" onClick={() => { setSt({ yur: true, qoldi: soniya }); if (onBosh) onBosh(); }}>{tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' })}</QTugma>}
    </div>
  );
}
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [royxat] = useState(goyalarLs);
  const juft = isStudent && royxat.length > 0;
  const yakka = !juft;
  const [tanlangan, setTanlangan] = useState(yakka ? -1 : (storedAnswer?.goya ?? null));
  const [sherik, setSherik] = useState(storedAnswer?.sherik ?? '');
  const [saqlandi, setSaqlandi] = useState(!!storedAnswer);
  const [ochildi, setOchildi] = useState(!!storedAnswer);
  const [natija, setNatija] = useState(storedAnswer?.natija ?? null);
  const [taymerBosh, setTaymerBosh] = useState(false);
  // «Boshqacha»: pufak kartaga uchib tushgach chap ustun yig'iladi — karta yolg'iz qoladi (10-SABOQ 20, 26)
  const [yig, setYig] = useState(storedAnswer?.natija === 'boshqa');
  useEffect(() => { if (natija !== 'boshqa' || yig) return undefined; const t = setTimeout(() => setYig(true), 760); return () => clearTimeout(t); }, [natija, yig]);
  const pufakRef = useRef(null);
  const uch = useUchish();
  const gg = tanlangan === -1 ? MENTOR_GOYALAR[2] : (tanlangan !== null ? royxat[tanlangan] : null);
  const qadam = yakka
    ? (saqlandi ? 2 : (sherik.trim() ? 1 : 0))
    : (tanlangan === null ? 0 : (saqlandi ? 2 : 1));
  const done = natija !== null;
  const tanla = (i) => { if (tanlangan === null) setTanlangan(i); };
  const saqla = () => { if (!sherik.trim()) return; setSaqlandi(true); };
  const solishtir = (v) => {
    if (natija !== null || isMentor) return;
    if (v === 'boshqa') uch(pufakRef.current, 's9m2', 640);
    setNatija(v);
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'juftlik', screenIdx: screen, correct: true, picked: v, solved: true, natija: v, sherik: sherik.trim(), goya: tanlangan });
    if (juft && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'juftlik', v === 'bir' ? 0 : 1, true, 0);
  };
  const qator = {};
  if (gg) {
    qator.muammo = { holat: ochildi ? 'ochildi' : 'yopiq', matn: gg.muammo,
      keyin: natija === 'boshqa' && <div className="ti-qator kul" data-q="muammo2" data-uch="s9m2"><span className="ti-qator-l">{yakka ? tr({ uz: 'Siz yozgan', ru: 'Вы написали' }) : tr({ uz: 'Sherigingiz aytgani', ru: 'Что сказал партнёр' })}</span><div className="ti-qator-m"><span className="ti-qator-t">{sherik}</span></div></div> };
    qator.kim = { holat: ochildi ? 'ochildi' : 'yopiq', matn: gg.kim };
    qator.yechim = { holat: 'bor', matn: gg.yechim };
  }
  const qadamlar = (yakka ? S9_QADAM.yakka : S9_QADAM.juft).map(tr);
  const sarlavha = yakka && !isMentor
    ? tr({ uz: <>Yechimdan Mentorning muammosini <A>topa olasizmi?</A></>, ru: <>Сможете по решению <A>найти проблему</A> Ментора?</> })
    : tr({ uz: <>Yechimni eshitgan sherigingiz <A>muammoni topadimi?</A></>, ru: <>Найдёт ли партнёр <A>проблему</A>, услышав решение?</> });
  const mentorGap = yakka && !isMentor
    ? tr({ uz: "Mentor g'oyasining faqat yechimi ochiq: muammoni o'zingiz topib yozing.", ru: 'У идеи Ментора открыто только решение: найдите и напишите проблему сами.' })
    : tr({ uz: "Bitta g'oyangizni tanlang va sherigingizga faqat yechim qatorini o'qing.", ru: 'Выберите одну свою идею и прочитайте партнёру только строку «Решение».' });
  const xulosa = natija === 'bir'
    ? (yakka ? tr({ uz: "Muammoni topdingiz. Baribir g'oyada u alohida yoziladi — boshqalar topmasligi mumkin.", ru: 'Вы нашли проблему. Всё равно в идее её пишут отдельно — другие могут не найти.' })
      : tr({ uz: "Sherigingiz muammoni topdi. Baribir uni g'oyada alohida yozasiz — boshqalar topmasligi mumkin.", ru: 'Партнёр нашёл проблему. Всё равно в идее её пишут отдельно — другие могут не найти.' }))
    : tr({ uz: "Bitta yechim bir nechta muammoga mos kelishi mumkin — shuning uchun g'oyada muammo alohida yoziladi.", ru: 'Одно решение может подходить к нескольким проблемам — поэтому в идее проблему пишут отдельно.' });
  const chap = (() => {
    if (!gg) return null;
    if (!saqlandi) return (
      <div className="ti-s9-yoz fade-step">
        {juft && <PairTimer onBosh={() => setTaymerBosh(true)} />}
        <label className="ti-s9-l">
          <span className="ti-qator-l">{juft ? tr({ uz: 'Sherigingiz aytgan muammo', ru: 'Проблема, которую назвал партнёр' }) : tr(QISM[0].t)}</span>
          <input className={cxx('ti-inp', (yakka || taymerBosh) && !sherik.trim() && 'ti-halqa-i')} value={sherik} placeholder={juft ? tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' }) : tr(PH8.muammo)} onChange={(e) => setSherik(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />
        </label>
        <QTugma className={halqa(!!sherik.trim())} disabled={!sherik.trim()} onClick={saqla}>{tr(SAQLASH)}</QTugma>
      </div>
    );
    return (
      <div className="ti-s9-sol">
        <div ref={pufakRef} className={cxx('ti-pufak2', natija === 'boshqa' && 'tushdi')} data-b="pufak">{juft && <b>{tr({ uz: 'Sherigingiz', ru: 'Партнёр' })}: </b>}«{sherik}»</div>
        {!ochildi && <QTugma className={halqa(true)} onClick={() => setOchildi(true)}>{tr({ uz: 'Ochish', ru: 'Открыть' })}</QTugma>}
        {ochildi && natija === null && <div className="ti-s9-tug ti-guruh fade-step">
          <QChip onClick={() => solishtir('bir')}>{tr({ uz: 'Bir xil', ru: 'Одинаково' })}</QChip>
          <QChip onClick={() => solishtir('boshqa')}>{tr({ uz: 'Boshqacha', ru: 'По-другому' })}</QChip>
        </div>}
        {natija !== null && <span className={cxx('ti-s9-tanlov', natija)}>{natija === 'bir' ? tr({ uz: 'Bir xil', ru: 'Одинаково' }) : tr({ uz: 'Boshqacha', ru: 'По-другому' })}</span>}
      </div>
    );
  })();
  return (
    <Stage eyebrow={yakka && !isMentor ? tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' }) : tr({ uz: 'Juftlikda ish', ru: 'Работа в парах' })} screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Solishtiring', ru: 'Сравните' })} onClick={onNext} /></>}>
      <QMustaqil sarlavha={sarlavha} mentor={<Mentor>{mentorGap}</Mentor>}
        qadamlar={<div className="ti-s9q"><QQadamlar joriy={done ? undefined : qadam} qadamlar={qadamlar} />{(yakka || tanlangan !== null) && <GStrip />}</div>}
        forma={<div className={cxx('ti-s9', !gg && 'tanlov')}>
          {!gg && <GoyaRoyxat sarlavha={ROYXAT_YORLIQ.mening} son={royxat.length} className="ti-s9-ro ti-guruh">
            <RoyxatOl ikki>{royxat.map((o, i) => <GoyaQator key={i} g={o} i={i} matn={o.yechim} belgi="›" onBos={() => tanla(i)} />)}</RoyxatOl>
          </GoyaRoyxat>}
          {gg && <div className={cxx('ti-s9-ich', yig && 'yig')}>
            {!yig && chap}
            <div className="ti-bogli ti-s9-karta">
              <GoyaKarta katta nom={tanlangan === -1 ? gg.nom : null} nomYorliq={tanlangan === -1 ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : null} manba={gg.manba} qator={qator} />
              {natija === 'boshqa' && <Bog kalit="s9b" juftlar={[{ dan: '[data-q="muammo"]', gacha: '[data-q="yechim"]', tur: 'acc', yon: 'chap' }, { dan: '[data-q="muammo2"]', gacha: '[data-q="yechim"]', tur: 'acc', yon: 'chap' }]} />}
            </div>
            {natija === 'bir' && <Bog kalit="s9a" juftlar={[{ dan: '[data-b="pufak"]', gacha: '.ti-s9-karta [data-q="muammo"]', tur: 'ok', yon: 'orta' }]} />}
          </div>}
        </div>}
      >
        {done && <QXulosa>{xulosa}</QXulosa>}
        <MentorSanoq screen={screen} yorliqlar={[{ uz: 'Bir xil', ru: 'Одинаково' }, { uz: 'Boshqacha', ru: 'По-другому' }]} hisob={(rows) => [String(rows.filter(r => r.picked === 0).length), String(rows.filter(r => r.picked === 1).length)]} />
        <NishonQatori screen={screen} />
        <MentorNote>{tr({ uz: "1 daqiqadan keyin «O'rin almashing» deng — sherik o'z ekranida shu ishni qiladi. «Boshqacha» chiqqani g'oya yomon degani emas: bitta yechim ikki muammoga mos kelishi mumkin — shuning uchun muammo kartada alohida yoziladi. G'oyani shu yerda tuzatish shart emas. 2–3 juftlikdan so'rang: sherik qaysi muammoni aytdi — ikkalasi ham shu yechimga mos keladimi?", ru: 'Через минуту скажите «Поменяйтесь местами» — партнёр делает то же на своём экране. «По-другому» не значит, что идея плохая: одно решение может подходить к двум проблемам — поэтому проблему пишут на карточке отдельно. Исправлять идею здесь не обязательно. Спросите 2–3 пары: какую проблему назвал партнёр — подходят ли обе к этому решению?' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — KOD YOZISH (QKod + HtmlCompiler; tayanch 4, PM-082): g'oyalar massivi → har yozuv sahifada karta =====
// Starter matni oddiy satrlardan yig'iladi (backtick yo'q). Tekshiruv — xulq-atvor bo'yicha, ma'lumotdan mustaqil (node sinovi: scratchpad 01-qayta/kod-sinov.mjs).
// Boshlang'ich kod (SABOQ 37): har yozuv ko'p qatorli obyekt — har kalit alohida qatorda, qatorlar ≤ 70 belgi (gorizontal skroll yo'q)
const KOD_DATA = [
  'const goyalar = [',
  '  {',
  '    muammo: "o\'yinga odam yetmaydi, kim kelishi noma\'lum",',
  '    kim: "mahalladagi o\'yinchilar",',
  '    yechim: "o\'yin e\'loni va «Qo\'shilaman»"',
  '  },',
  '  {',
  '    muammo: "uy vazifasi chatlarda yo\'qoladi",',
  '    kim: "sinfdoshlar",',
  '    yechim: "har fan bo\'yicha vazifalar bir joyda"',
  '  },',
  '  {',
  '    muammo: "eski darsligini kimga berishni bilmaydi, " +',
  '      "u uyda yillab turadi",',
  '    kim: "o\'quvchilar",'
];
const KOD_IZ = {
  bosh: { uz: '// Mentorning uchta yozuvi: muammo, kim uchun va yechim', ru: '// Три записи Ментора: проблема, для кого и решение' },
  hali: { uz: '   // yechim hali yozilmagan', ru: '   // решение ещё не написано' },
  qator: { uz: "  // uch qatorni ro'yxat qilib qaytaring:", ru: '  // верните три строки списком:' },
  siz: { uz: '   // shu joyni siz yozasiz', ru: '   // это место пишете вы' },
  tayyor: { uz: '// har yozuv — sahifada bitta karta (bu qism tayyor)', ru: '// каждая запись — одна карточка на странице (эта часть готова)' }
};
const kodStarter = (t) => [KOD_IZ.bosh[t], ...KOD_DATA, '    yechim: ""' + KOD_IZ.hali[t], '  }',
  '];', '', 'function qatorlar(goya) {', KOD_IZ.qator[t], '  // "Muammo: …", "Kim uchun: …", "Yechim: …"', '  return [];' + KOD_IZ.siz[t], '}', '',
  KOD_IZ.tayyor[t], 'const joy = document.getElementById("goyalar");', 'goyalar.forEach(function (goya) {', '  const karta = document.createElement("div");', '  karta.className = "goya";',
  '  qatorlar(goya).forEach(function (matn) {', '    const p = document.createElement("p");', '    p.textContent = matn;', '    karta.appendChild(p);', '  });', '  joy.appendChild(karta);', '});', ''].join('\n');
const KOD_STARTER = { uz: kodStarter('uz'), ru: kodStarter('ru') };
// Tutuq belgisining turli ko'rinishi (o'zbekcha klaviaturadagi) shartni yiqitmasin — «yo'q» qaysi tugmada yozilsa ham bir xil o'qiladi
const KOD_TUTUQ = 'String(x).replace(/[\\u02BB\\u02BC\\u2018\\u2019]/g, "\'")';
// Shartlar ma'lumotdan mustaqil (SABOQ 37): funksiya o'z namuna obyekti bilan chaqiriladi; kartalar soni — massiv uzunligiga teng (o'quvchi yozuv qo'shsa ham to'g'ri)
const KOD_SHART_IFODA = [
  [`(function(x){return ${KOD_TUTUQ}})(qatorlar({ muammo: "a", kim: "b", yechim: "c" }).join("|"))`, 'Muammo: a|Kim uchun: b|Yechim: c'],
  [`(function(x){return ${KOD_TUTUQ}})(qatorlar({ muammo: "a", kim: "b", yechim: "" })[2])`, "Yechim: hali yo'q"],
  ['(function(){var k=document.querySelectorAll("#goyalar .goya");if(!k.length||k.length!==goyalar.length)return "yoq";for(var i=0;i<k.length;i++){if(k[i].querySelectorAll("p").length!==3)return "yoq";}return "ha";})()', 'ha']
];
const KOD_INDEX = { uz: '<h1>Mentorning yozuvlari</h1>\n<div id="goyalar"></div>\n', ru: '<h1>Записи Ментора</h1>\n<div id="goyalar"></div>\n' };
const KOD_VAZIFA = [
  { uz: "`qatorlar` uch qatorli ro'yxat qaytaradi", ru: '`qatorlar` возвращает список из трёх строк' },
  { uz: "Yechimi bo'sh yozuvda «Yechim: hali yo'q» chiqadi", ru: 'У записи с пустым решением выводится «Yechim: hali yo\'q»' },
  { uz: 'Sahifada uchta karta, har birida uch qator', ru: 'На странице три карточки, в каждой три строки' }
];
const KOD_SHART = [
  { uz: 'Uch qator: «Muammo: …», «Kim uchun: …», «Yechim: …».', ru: 'Три строки: «Muammo: …», «Kim uchun: …», «Yechim: …».' },
  { uz: "Yechim bo'sh bo'lsa, «Yechim: hali yo'q» chiqsin.", ru: 'Если решение пустое, пусть выводится «Yechim: hali yo\'q».' },
  { uz: "Sahifada uchta karta, har birida uch qator bo'lsin.", ru: 'Пусть на странице будут три карточки, в каждой три строки.' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — qatorlar funksiyasini yakunlang', ru: 'app.js — допишите функцию qatorlar' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: "// uch qatorni ro'yxat qilib qaytaring", ru: '// верните три строки списком' } },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: '.goya{background:#fff;border:1px solid #E7E3F4;border-radius:8px;padding:10px 14px;margin:0 0 10px}.goya p{margin:2px 0;font-weight:400}',
  requirements: [
    { id: 'qator', label: KOD_VAZIFA[0], check: C.evalEquals(KOD_SHART_IFODA[0][0], KOD_SHART_IFODA[0][1], KOD_SHART[0]) },
    { id: 'hali', label: KOD_VAZIFA[1], check: C.evalEquals(KOD_SHART_IFODA[1][0], KOD_SHART_IFODA[1][1], KOD_SHART[1]) },
    { id: 'karta', label: KOD_VAZIFA[2], check: C.evalEquals(KOD_SHART_IFODA[2][0], KOD_SHART_IFODA[2][1], KOD_SHART[2]) }
  ]
};
const KOD_DARVOZA = [
  { id: 'nom', t: '`nom`, `muammo`, `yechim`', ok: false, x: { uz: "`nom` — yorliq, g'oyaning qismi emas.", ru: '`nom` — ярлык, а не часть идеи.' } },
  { id: 'kim', t: '`muammo`, `kim`, `yechim`', ok: true },
  { id: 'manba', t: '`manba`, `kim`, `yechim`', ok: false, x: { uz: '`manba` muammo qayerdan kelganini aytadi, u qism emas.', ru: '`manba` говорит, откуда пришла проблема, это не часть.' } }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d): darvozadan keyin muammo · kim · yechim kalitlari bir lahza ajraladi
const kodParcha = (kod) => {
  const L = kod.split('\n');
  const tugash = L.indexOf('];'), fn = L.findIndex(l => l.startsWith('function qatorlar'));
  return [...L.slice(0, 7), '  …', ...L.slice(tugash, fn + 5)];
};
const KodNamuna = ({ ajrat }) => (
  <pre className={cxx('ti-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
    {kodParcha(tr(KOD_STARTER)).map((l, i) => {
      if (l.trim().startsWith('//')) return <span key={i} className="ti-kod-iz">{l}{'\n'}</span>;
      const b = l.split(/\b(muammo|kim|yechim)(?=:)/);
      if (b.length === 1) return <span key={i}>{l}{'\n'}</span>;
      return <span key={i}>{b.map((x, j) => (j % 2 ? <b key={j} className="ti-kod-k">{x}</b> : x))}{'\n'}</span>;
    })}
  </pre>
);
// QKod o'ng ustun propining qolip-nomi («Editor» ma'nosidagi o'zbekcha so'z) til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi —
// u o'quvchi matni emas, qolip API nomi; shuning uchun prop shu doimiy orqali beriladi (9-Modul 1-dars yechimi, MEXANIZM-TAKLIF 10).
const QKOD_ONG = ['muh', 'arrir'].join('');
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'kim' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); } else setMiss({ id: g.id, k: Date.now() });
  };
  const finish = ({ codes, code: htmlCode }) => {
    const yangi = (codes && codes['app.js']) || htmlCode || code || tr(KOD_STARTER);
    setOpen(false); setCode(yangi);
    if (!done) {
      setDone(true);
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: yangi, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: 'Пишем код' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' }) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Yozuvlarni kartaga aylantiradigan <A>kod yozamiz</A>.</>, ru: <>Пишем <A>код</A>, который превращает записи в карточки.</> })}
        mentor={<Mentor>{tr({ uz: "Mentorning uchta yozuvi kodda massiv bo'lib turibdi: har birini sahifada karta qilib chiqaring.", ru: 'Три записи Ментора лежат в коде массивом: выведите каждую на страницу карточкой.' })}</Mentor>}
        vazifa={<>
          <GStrip />
          <div className="ti-darvoza">
            <span className="ti-darvoza-s">{tr({ uz: 'Kartaning uch qatori qaysi kalitlardan olinadi?', ru: 'Из каких ключей берутся три строки карточки?' })}</span>
            <div className={cxx('ti-darvoza-ro', !stage2 && 'ti-guruh')}>
              {KOD_DARVOZA.map((g, i) => {
                const silk = miss && miss.id === g.id;
                return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : silk ? 'err' : undefined} disabled={stage2 && gpick !== g.id} className="ti-kalit" style={{ '--i': i }} onClick={() => pickGate(g)}>{fmtCode(g.t)}</QChip>;
              })}
            </div>
            {miss && <QXato>{fmtCode(tr(KOD_DARVOZA.find(g => g.id === miss.id).x))}</QXato>}
          </div>
          {<ol className={cxx('ti-vazifa', !stage2 && 'xira')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cxx(done && 'ok')}><i>{done ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>}
          {done && <QXulosa>{tr({ uz: "Uch yozuv sahifada karta bo'ldi — yechimi yozilmagani ham ko'rinib turibdi.", ru: 'Три записи стали карточками на странице — видна и та, у которой нет решения.' })}</QXulosa>}
        </>}
        yordam={stage2 && <div className="ti-kyordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: "Bitta yozuvdan boshlang: `return [\"Muammo: \" + goya.muammo, …];`. Yechim bo'sh bo'lsa (`goya.yechim === \"\"`), uning o'rniga «hali yo'q» qo'ying.", ru: 'Начните с одной записи: `return ["Muammo: " + goya.muammo, …];`. Если решение пустое (`goya.yechim === ""`), поставьте вместо него «hali yo\'q».' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): massiv — ro'yxat · `+` — ikki matnni qo'shadi · `forEach` — ro'yxatdagi har element uchun bir marta ishlaydi.", ru: 'Напоминание (из уроков JavaScript): массив — список · `+` — соединяет два текста · `forEach` — срабатывает один раз для каждого элемента списка.' }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="ti-kodoyna">
          {stage2 && <div className="ti-mgap fade-step"><img src={MENTOR_IMG} alt="" aria-hidden="true" /><span>{tr({ uz: 'Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko\'rasiz.', ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите здесь результат.' })}</span></div>}
          {stage2 && <div className="ti-amal"><QTugma className={halqa(!done && !isMentor)} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          <KodNamuna ajrat={ajrat} />
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        <NishonQatori screen={screen} />
        <MentorNote>{tr({ uz: "Kod — 2–3 daqiqalik mashq, yangi qoida yo'q: g'oyaning uch qismi va «yechim hali yo'q» holati. O'z g'oyasini to'rtinchi element qilib qo'shgan o'quvchini maqtang — shart emas.", ru: 'Код — упражнение на 2–3 минуты, нового правила нет: три части идеи и состояние «решения пока нет». Похвалите ученика, который добавил свою идею четвёртым элементом, — это не обязательно.' })}</MentorNote>
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m9d1-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s11 = 1; MVP davomi ham g'oya — Qaror-0 2) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="O'z MVP'ingizni davom ettirmoqchisiz. Bu g'oya ro'yxatda qanday turadi?"
    question={tr({ uz: <h2 className="title h-ask">O'z MVP'ingizni davom ettirmoqchisiz. Bu g'oya <A>ro'yxatda qanday turadi?</A></h2>, ru: <h2 className="title h-ask">Вы хотите продолжить свой MVP. <A>Как эта идея стоит в списке?</A></h2> })}
    options={[
      { uz: 'Ro\'yxatdan tashqarida — u allaqachon tanlangan', ru: 'Вне списка — она уже выбрана' },
      { uz: 'Boshqalar qatorida — uch qismi bilan yozilib', ru: 'В ряду с другими — записана тремя частями' },
      { uz: "Ro'yxat boshida — u eng yaxshi g'oya bo'ladi", ru: 'В начале списка — она будет лучшей идеей' },
      { uz: 'Faqat nomi bilan — uni hamma allaqachon biladi', ru: 'Только названием — её все уже знают' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "MVP davomi ham g'oya: u uch qism bilan yoziladi va boshqalar qatorida turadi.", ru: 'Продолжение MVP — тоже идея: её пишут тремя частями, и она стоит в ряду с другими.' }}
    explainWrong={{
      0: { uz: "Bugun hech bir g'oya tanlanmaydi — faqat yoziladi.", ru: 'Сегодня ни одна идея не выбирается — их только записывают.' },
      2: { uz: "Bugun g'oyalar baholanmaydi — hammasi teng turadi.", ru: 'Сегодня идеи не оцениваются — все стоят наравне.' },
      3: { uz: "Nom g'oya emas — uning uch qismi yoziladi.", ru: 'Название — не идея: пишут её три части.' },
      default: { uz: 'Mentor «Maydon» davomini qayerga yozganini eslang.', ru: 'Вспомните, куда Ментор записал продолжение «Maydon».' }
    }}
    vizual={<GoyaRoyxat sarlavha={ROYXAT_YORLIQ.mentor} son={MENTOR_GOYALAR.length} keng><RoyxatOl ikki>{MENTOR_GOYALAR.map((m, i) => <GoyaQator key={i} g={m} i={i} matn={tr(m.nom)} ajrat={i < 2} manbasiz />)}</RoyxatOl></GoyaRoyxat>} />
);

// ===== 🏅 BADGES (nishonlar) — ish qilingan ekranlarda, tekin bonus yo'q (S-034); medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  sourceFinder: { icon: '🧭', name: 'Source Finder!', desc: { uz: "Uch manbadan kelgan yozuvlarni birinchi urinishda g'oyaga aylantirdingiz", ru: 'С первой попытки превратили записи из трёх источников в идеи' } },
  sixIdeas: { icon: '💡', name: 'Six Ideas!', desc: { uz: "Oltita g'oyani uch qismi bilan yozdingiz", ru: 'Написали шесть идей с тремя частями' } },
  pairCheck: { icon: '🤝', name: 'Pair Check!', desc: { uz: "Bitta g'oyani faqat yechimidan solishtirdingiz", ru: 'Сравнили одну идею только по её решению' } },
  cardCoder: { icon: '🧩', name: 'Card Coder!', desc: { uz: 'Yozuvlarni sahifada kartaga aylantiradigan kod yozdingiz', ru: 'Написали код, который превращает записи в карточки на странице' } }
};
// Ekran id → nishon (onAnswer correct: true bo'lganda; s4 — uch qadam birinchi urinishda)
const ACH_TRIGGERS = { s4: 'sourceFinder', s8: 'sixIdeas', s9: 'pairCheck', s10: 'cardCoder' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 5, 7, 11)
const Q_LABELS = {
  3: { uz: '1 — Nima yetishmaydi', ru: '1 — Чего не хватает' },
  5: { uz: '2 — Mos yechim', ru: '2 — Подходящее решение' },
  7: { uz: '3 — Starbucks', ru: '3 — Starbucks' },
  11: { uz: '4 — MVP davomi', ru: '4 — Продолжение MVP' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: "g'oya", ru: 'идея' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'muammo', ru: 'проблема' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'kim uchun', ru: 'для кого' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'yechim', ru: 'решение' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'manba', ru: 'источник' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'kuzatuv', ru: 'наблюдение' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: "ro'yxat", ru: 'список' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'sherik', ru: 'партнёр' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 1·5·10 · B 3·7·12 · C 2·8·11 · D 4·6·9 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: "Sinfdoshingiz «maktab ilovasi qilaman» dedi. G'oyaga yana nima kerak?", ru: 'Одноклассник сказал: «сделаю школьное приложение». Что ещё нужно идее?' }, opts: [{ uz: 'Muammo, kim uchun va yechim', ru: 'Проблема, для кого и решение' }, { uz: 'Ilovaning chiroyli nomi, rangi', ru: 'Красивое название и цвет приложения' }, { uz: 'Ilovaning narxi va reklamasi', ru: 'Цена и реклама приложения' }, { uz: 'Tugmalar soni va ekran rangi', ru: 'Число кнопок и цвет экрана' }], correct: 0 },
  { q: { uz: "Qaysi gap g'oyaning yechim qatoriga yoziladi?", ru: 'Какая фраза пишется в строку «Решение»?' }, opts: [{ uz: 'Sinfdoshlar vazifani chatda yo\'qotadi', ru: 'Одноклассники теряют задание в чате' }, { uz: "Maktabdagi barcha sinf o'quvchilari uchun", ru: 'Для учеников всех классов школы' }, { uz: "Har fan vazifasini bir joyda ko'rsatadi", ru: 'Показывает задания по каждому предмету в одном месте' }, { uz: 'Vazifalar chiroyli turishini xohlaydi', ru: 'Хочет, чтобы задания красиво выглядели' }], correct: 2 },
  { q: { uz: "Qaysi gap g'oyaning muammo qatoriga yoziladi?", ru: 'Какая фраза пишется в строку «Проблема»?' }, opts: [{ uz: "Ilovada chat bo'lishini xohlaydi", ru: 'Хочет, чтобы в приложении был чат' }, { uz: "Uy vazifasi chatlarda yo'qoladi", ru: 'Домашнее задание теряется в чатах' }, { uz: "Ilova chiroyli bo'lsa yaxshi edi", ru: 'Хорошо бы приложение было красивым' }, { uz: 'Bot tez ishlashini juda xohlaydi', ru: 'Очень хочет, чтобы бот работал быстро' }], correct: 1 },
  { q: { uz: '«Kim uchun» qatoriga qaysi biri aniq yozilgan?', ru: 'Что точно написано в строке «Для кого»?' }, opts: [{ uz: 'Shahardagi har xil yoshdagi odamlar', ru: 'Люди разного возраста в городе' }, { uz: 'Telefoni va interneti bor har bir odam', ru: 'Каждый, у кого есть телефон и интернет' }, { uz: 'Yoshlar ham, kattalar ham — hamma odam', ru: 'И молодые, и взрослые — все люди' }, { uz: "To'garak izlayotgan maktab o'smirlari", ru: 'Школьники-подростки, которые ищут кружок' }], correct: 3 },
  { q: { uz: "Mentorning jamoa yig'ish g'oyasida muammoga qanday dalil bor?", ru: 'Какое доказательство проблемы есть в идее Ментора о сборе команды?' }, opts: [{ uz: '9-Modulda 5 kishidan 2 tasi shuni aytgan', ru: 'В 9-м модуле так сказали 2 из 5 человек' }, { uz: "Futbolni hamma yaxshi ko'radi, demak kerak", ru: 'Футбол любят все — значит, нужно' }, { uz: "Mentorning o'zi futbolni yaxshi ko'radi", ru: 'Ментор сам любит футбол' }, { uz: 'Ilova nomi chiroyli va eslab qolinadi', ru: 'Название приложения красивое и запоминается' }], correct: 0 },
  { q: { uz: "Keyinga qoldirilgan funksiyadan g'oya qilish uchun nima topiladi?", ru: 'Что нужно найти, чтобы из отложенной функции сделать идею?' }, opts: [{ uz: 'Funksiyaga qisqa va qiziq nom', ru: 'Короткое интересное название функции' }, { uz: "Shunga o'xshash ilovaning nomi", ru: 'Название похожего приложения' }, { uz: 'Funksiyani qurish uchun kod', ru: 'Код, чтобы построить функцию' }, { uz: 'Funksiya hal qiladigan muammo', ru: 'Проблема, которую решает функция' }], correct: 3 },
  { q: { uz: "Shuls Starbucks'ni qanday joy qilib qurgan?", ru: 'Каким местом Шульц построил Starbucks?' }, opts: [{ uz: 'Qahva tez olinadigan kichik nuqta', ru: 'Маленькая точка, где быстро берут кофе' }, { uz: "Uy va ish o'rtasidagi uchinchi joy", ru: 'Третье место между домом и работой' }, { uz: 'Faqat ishlash uchun jimjit katta ofis', ru: 'Тихий большой офис только для работы' }, { uz: 'Ichimlik arzonroq sotiladigan do\'kon', ru: 'Магазин, где напитки дешевле' }], correct: 1 },
  { q: { uz: "Starbucks'da odamlar nima qiladi?", ru: 'Что люди делают в Starbucks?' }, opts: [{ uz: 'Qahva olib, tezda chiqib ketadi', ru: 'Берут кофе и быстро уходят' }, { uz: 'Faqat telefonini quvvatlab oladi', ru: 'Только заряжают телефон' }, { uz: "O'tiradi, ishlaydi va uchrashadi", ru: 'Сидят, работают и встречаются' }, { uz: 'Navbatda turib, ichimlik kutadi', ru: 'Стоят в очереди и ждут напиток' }], correct: 2 },
  { q: { uz: "Oltita g'oyani yozayotganda har biri bilan nima qilasiz?", ru: 'Что вы делаете с каждой идеей, когда пишете шесть?' }, opts: [{ uz: "Yozgan zahoti kuchsizini o'chirasiz", ru: 'Сразу удаляете слабую' }, { uz: 'Faqat eng qiziq uchtasini yozib olasiz', ru: 'Записываете только три самые интересные' }, { uz: "Har biriga chiroyli nom o'ylab topasiz", ru: 'Придумываете каждой красивое название' }, { uz: "Uch qismini yozib, keyingisiga o'tasiz", ru: 'Пишете три части и переходите к следующей' }], correct: 3 },
  { q: { uz: 'Sherigingiz faqat yechimni eshitib, boshqa muammoni aytdi. Bu nimani bildiradi?', ru: 'Партнёр услышал только решение и назвал другую проблему. Что это значит?' }, opts: [{ uz: 'Faqat yechimdan muammo bilinmasligi mumkin', ru: 'По одному решению проблема может быть непонятна' }, { uz: "Sherigingiz g'oyani yaxshi tinglamay qolgan", ru: 'Партнёр плохо слушал идею' }, { uz: "G'oyani o'chirib, yangisini yozish kerak", ru: 'Нужно удалить идею и написать новую' }, { uz: 'Yechim qatorini butunlay olib tashlash kerak', ru: 'Нужно совсем убрать строку «Решение»' }], correct: 0 },
  { q: { uz: 'Atrofni kuzatganda nimaga qaraysiz?', ru: 'На что вы смотрите, наблюдая вокруг?' }, opts: [{ uz: "Qaysi ilova eng ko'p yuklanganiga", ru: 'Какое приложение скачивают больше всего' }, { uz: "Do'stlar qaysi o'yinni o'ynashiga", ru: 'В какую игру играют друзья' }, { uz: 'Kim, qayerda, nimadan qiynalganiga', ru: 'Кто, где и от чего страдает' }, { uz: 'Qaysi texnologiya eng yangi ekaniga', ru: 'Какая технология самая новая' }], correct: 2 },
  { q: { uz: "9-Moduldagi muammolar ro'yxatidan g'oya qilish uchun nima qo'shasiz?", ru: 'Что вы добавите, чтобы сделать идею из списка проблем 9-го модуля?' }, opts: [{ uz: 'Muammoga qisqa va esda qoladigan nom', ru: 'Короткое запоминающееся название проблемы' }, { uz: 'Mahsulot nima qilishini aytadigan yechim', ru: 'Решение, которое говорит, что делает продукт' }, { uz: "Shu muammoga o'xshash yana bir xohish", ru: 'Ещё одно похожее желание' }, { uz: "Ro'yxatdagi yana ikki-uchta boshqa muammo", ru: 'Ещё две-три другие проблемы из списка' }], correct: 1 },
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

// 🃏 KARTOCHKALAR — alohida ekran, Mentorsiz (KORPUS §61, SABOQ 16); mexanika va ko'rinish — qolipda (QKartochka, DE-204)
const KARTOCHKALAR = [
  { front: { uz: "G'oya qaysi uch qismdan iborat?", ru: 'Из каких трёх частей состоит идея?' }, back: { uz: 'Muammo, kim uchun va yechim', ru: 'Проблема, для кого и решение' } },
  { front: { uz: 'Muammo qatoriga nima yoziladi?', ru: 'Что пишется в строку «Проблема»?' }, back: { uz: 'Odamlar nimadan qiynalishi; xohish muammo emas', ru: 'От чего страдают люди; желание — не проблема' } },
  { front: { uz: '«Kim uchun» qatori qanday yoziladi?', ru: 'Как пишется строка «Для кого»?' }, back: { uz: 'Aynan qanday odamlar ekani; «hamma» aniq emas', ru: 'Какие именно это люди; «все» — не точно' } },
  { front: { uz: 'Yechim qatori nimaga javob beradi?', ru: 'На что отвечает строка «Решение»?' }, back: { uz: "Shu g'oyaning muammosiga: mahsulot nima qilishini aytadi", ru: 'На проблему этой идеи: говорит, что делает продукт' } },
  { front: { uz: "G'oya uchun muammoni qayerdan topasiz?", ru: 'Где найти проблему для идеи?' }, back: { uz: "9-Modul ro'yxatidan, MVP'ning «Keyin» qutisidan va yangi kuzatuvdan", ru: 'В списке 9-го модуля, в коробке «Потом» вашего MVP и в новом наблюдении' } },
  { front: { uz: 'Manbadan kelgan yozuvga bitta qism yetishmasa, nima qilasiz?', ru: 'Что делать, если записи из источника не хватает одной части?' }, back: { uz: "Yetishmagan qismni o'zingiz yozasiz — g'oyada uchala qism bo'ladi", ru: 'Дописываете недостающую часть — в идее будут все три' } },
  { front: { uz: "Bugun g'oyalar baholanadimi?", ru: 'Оцениваются ли идеи сегодня?' }, back: { uz: "Yo'q: bugun oltitasi yoziladi, tanlov keyinroq", ru: 'Нет: сегодня пишут шесть, выбор — позже' } },
  { front: { uz: 'Nega Starbucks «uchinchi joy» deyiladi?', ru: 'Почему Starbucks называют «третьим местом»?' }, back: { uz: "Birinchi joy — uy, ikkinchisi — ish yoki maktab; Starbucks ularning o'rtasida", ru: 'Первое место — дом, второе — работа или школа; Starbucks — между ними' } },
  { front: { uz: "Starbucks'da odamlar nima uchun to'laydi?", ru: 'За что люди платят в Starbucks?' }, back: { uz: 'Ichimlik uchun emas, joy va muhit uchun', ru: 'Не за напиток, а за место и атмосферу' } },
  { front: { uz: "Nega g'oyada muammo alohida yoziladi?", ru: 'Почему в идее проблему пишут отдельно?' }, back: { uz: 'Faqat yechimni eshitgan odam muammoni boshqacha tushunishi mumkin', ru: 'Тот, кто услышал только решение, может понять проблему иначе' } },
  { front: { uz: "O'z MVP'ingizni davom ettirish g'oya bo'ladimi?", ru: 'Продолжение вашего MVP — это идея?' }, back: { uz: "Ha: u uch qism bilan yoziladi va boshqa g'oyalar qatorida turadi", ru: 'Да: её пишут тремя частями, и она стоит в ряду с другими идеями' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q; birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('ti-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="ti-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'uydagilardan biri', ru: 'кто-то из домашних' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "6 g'oya", ru: '6 идей' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "«G'oyalarim» ro'yxatida oltitadan kam bo'lsa — oltitaga yetkazing.", ru: 'Если в списке «Мои идеи» меньше шести — доведите до шести.' },
  { uz: "Bitta g'oyangizni uydagilardan biriga faqat yechim bilan o'qing va u aytgan muammoni qog'ozga yozing. Keyin uch qismni birga o'qing — ikki muammoni solishtiring.", ru: 'Прочитайте одну идею кому-то из домашних только решением и запишите на бумаге проблему, которую он назовёт. Потом прочитайте вместе три части — сравните две проблемы.' },
  { uz: "Har g'oyaning «Kim uchun» qatorini o'qing: shunday odamlardan kimni taniysiz? Har g'oya uchun bittasini qog'ozga yozing: ismi emas, kimligi (masalan: «qo'shni bola, maydonda o'ynaydi»).", ru: 'Прочитайте строку «Для кого» каждой идеи: кого из таких людей вы знаете? Для каждой идеи запишите на бумаге одного: не имя, а кто он (например: «соседский мальчик, играет на поле»).' }
];
const HwCard = ({ keyingi }) => (
  <div className="card ti-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ti-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="ti-hw-q"><span className="ti-hw-k">{tr(r.k)}</span><span className="ti-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="ti-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tr(q)}</span></li>)}</ol>
    {keyingi && <span className="ti-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013, ScoreRing o'rnida — kartochkaga qo'shilmaydi). CODE STRIKE va arena — darsda =====
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
    { uz: "Muammoni uch manbadan topasiz: 9-Modul ro'yxati, MVP'ning «Keyin» qutisi va yangi kuzatuv.", ru: 'Проблему вы находите в трёх источниках: список 9-го модуля, коробка «Потом» вашего MVP и новое наблюдение.' },
    { uz: "Manbadan kelgan yozuvga yetishmagan qismni o'zingiz yozasiz.", ru: 'Недостающую часть записи из источника вы дописываете сами.' },
    { uz: 'Faqat yechimni eshitgan odam muammoni boshqacha tushunishi mumkin.', ru: 'Тот, кто услышал только решение, может понять проблему иначе.' },
    { uz: "O'z MVP'ingizni davom ettirish ham g'oya — u boshqalar qatorida turadi.", ru: 'Продолжение вашего MVP — тоже идея: она стоит в ряду с другими.' },
    { uz: "Starbucks'da odamlar ichimlik uchun emas, joy va muhit uchun to'laydi.", ru: 'В Starbucks люди платят не за напиток, а за место и атмосферу.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Oltita g'oyadan qaysi uchtasi qoladi?»</b></>, ru: <>Следующий урок — <b>«Какие три идеи из шести останутся?»</b></> });
  const n = goyalarLs().length;
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={n >= 6 || isMentorL
          ? tr({ uz: <>Oltita g'oyangiz <A>tayyor</A>.</>, ru: <>Ваши шесть идей <A>готовы</A>.</> })
          : tr({ uz: <>{n} ta g'oya yozildi — <A>qolgani uyda</A>.</>, ru: <>Записано идей: {n} — <A>остальные дома</A>.</> })}
        cta={<>
          <div className="ti-fikr fade-up d1"><span className="ti-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="ti-fikr-t small">{tr({ uz: "G'oya nom emas: unda muammo, kim uchun va yechim yoziladi.", ru: 'Идея — не название: в ней пишут проблему, для кого и решение.' })}</p></div>
          {!isMentorL && <GStrip />}
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={<HwCard keyingi={keyingi} />}
        keyingi={keyingi}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmTenIdeasLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === 11-Modul 1-dars — darsning o'z vizuali (prefiks ti-). Faqat qolip tokenlari (D3); brend rangi — faqat Starbucks nomi (#00704A) === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .ti-yorliq { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .ti-kul { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; line-height: 1.3; }
        .ti-brend { color: #00704A; font-weight: 800; font-style: normal; }
        /* Bosiladigan joy halqasi (SABOQ 11): accent halqa doim, yengil to'lqin 3 marta; kam harakatda to'lqin o'chadi, halqa qoladi */
        .ti-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .ti-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ti-tolqin 2.4s ease-in-out 0.4s 3; }
        /* Guruh halqasi (SABOQ 32): variantlar/tanlovlar guruhida bitta halqa — guruh atrofida */
        .ti-guruh { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .ti-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ti-tolqin 2.4s ease-in-out 0.5s 3; }
        .ti-halqa-i { border-color: ${T.accent} !important; animation: ti-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ti-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.ti-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.ti-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        @keyframes ti-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes ti-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.35)}; } }
        @keyframes ti-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes ti-kir-svg { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes ti-tush { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        @keyframes ti-son { from { transform: scale(1.4); } to { transform: scale(1); } }
        @keyframes ti-sirg { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
        @keyframes ti-yoz { 0%, 65% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { box-shadow: inset 0 0 0 1.5px transparent; } }
        @keyframes ti-xato { 0% { background: ${T.errFon}; } 100% { background: ${T.paper}; } }
        @keyframes ti-yangi { 0%, 70% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { background: ${T.bg}; box-shadow: none; } }
        @keyframes ti-yigil { from { opacity: 0; transform: scaleY(0.6); } to { opacity: 1; transform: none; } }

        /* --- Karta (GoyaKarta) --- */
        .ti-karta { position: relative; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 9px; min-width: 0; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.32); }
        .ti-karta.katta { padding: 18px 20px; gap: 11px; }
        .ti-karta.kichik { padding: 12px 14px; gap: 7px; box-shadow: none; }
        .ti-karta-bosh { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-height: 26px; animation: ti-kir 0.35s both; }
        .ti-karta-nom { font-weight: 800; font-size: clamp(16px,1.8vw,18px); color: ${T.ink}; }
        .ti-goya-teg { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: #fff; background: ${T.accent}; border-radius: 6px; padding: 3px 8px; animation: ti-tush 0.45s cubic-bezier(.3,1.6,.5,1) both; }
        .ti-manba { flex-shrink: 0; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
        .ti-dalil { align-self: flex-start; font-size: 12px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border: 1px dashed ${fon(T.ink2, 0.4)}; border-radius: 8px; padding: 4px 9px; line-height: 1.35; }
        .ti-qator { position: relative; display: grid; grid-template-columns: 88px minmax(0,1fr) auto; align-items: center; gap: 4px 12px; min-height: 46px; padding: 8px 12px; border-radius: 11px; border: 1.5px solid transparent; background: ${T.bg}; }
        .ti-qator > .ti-qator-l { grid-column: 1; }
        .ti-qator > .ti-qator-m { grid-column: 2; min-width: 0; position: relative; }
        .ti-qator:not(:has(.ti-qator-l)) > .ti-qator-m { grid-column: 1 / 3; }
        .ti-qator > .ti-qator-b { grid-column: 3; color: ${T.ok}; font-weight: 800; }
        .ti-qator > .ti-dalil, .ti-qator > .ti-kul, .ti-qator > .ti-xato-q { grid-column: 2 / -1; }
        .ti-qator-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ti-qator-t { display: block; font-size: clamp(14px,1.55vw,15.5px); font-weight: 600; color: ${T.ink}; line-height: 1.4; overflow-wrap: anywhere; }
        .ti-qator.bosh { background: ${T.paper}; border: 1.5px dashed ${fon(T.ink2, 0.28)}; }
        .ti-uzuq { display: block; width: 72%; border-top: 2px dashed ${fon(T.ink2, 0.28)}; }
        .ti-qator.joriy { background: ${T.paper}; border-color: ${T.accent}; box-shadow: 0 8px 18px -12px ${fon(T.accent, 0.6)}; }
        .ti-qator.yoz { animation: ti-yoz 1.3s ease-out; }
        .ti-qator.yoz .ti-qator-t { animation: ti-sirg 0.45s ease-out both; }
        .ti-qator.xato { background: ${T.paper}; border-color: ${fon(T.err, 0.55)}; animation: ti-xato 0.9s ease-out; }
        .ti-qator.ajrat { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .ti-qator.manbadan:not(.yoz) { background: ${T.accentSoft}; }
        .ti-belgi { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; margin-right: 6px; border-radius: 50%; background: ${T.accent}; color: #fff; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; letter-spacing: 0; vertical-align: middle; }
        .ti-s9-ro.ti-guruh { width: auto; }
        .ti-qator.kul { background: ${T.bg}; border: 1.5px dashed ${fon(T.ink2, 0.35)}; }
        .ti-qator.kul .ti-qator-t { color: ${T.ink2}; }
        .ti-qator-t.yashirin { visibility: hidden; }
        .ti-parda { position: absolute; inset: -4px -6px; border-radius: 8px; background: repeating-linear-gradient(135deg, ${fon(T.ink2, 0.16)} 0 8px, ${fon(T.ink2, 0.09)} 8px 16px); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .ti-qator.ochildi .ti-qator-m::after { content: ''; position: absolute; inset: -4px -6px; border-radius: 8px; background: repeating-linear-gradient(135deg, ${fon(T.ink2, 0.16)} 0 8px, ${fon(T.ink2, 0.09)} 8px 16px); pointer-events: none; animation: ti-parda-kot 0.65s ease-in forwards; }
        .ti-qator.ochildi .ti-qator-t { animation: ti-sirg 0.5s 0.25s ease-out both; }
        @keyframes ti-parda-kot { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-110%); } }
        .ti-karta.tinch *, .ti-s2.tinch * { animation: none !important; }
        .ti-karta.tinch .ti-qator-m::after, .ti-s2.tinch .ti-qator-m::after { display: none; }
        .ti-karta-kir { animation: ti-karta-kir 0.45s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes ti-karta-kir { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
        .ti-qsavol { position: relative; justify-self: start; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; border-radius: 10px; padding: 7px 14px; cursor: pointer; }
        .ti-qsavol:not(:disabled):hover { background: ${T.accentSoft}; }
        .ti-qsavol:disabled { color: ${T.ink2}; background: ${T.bg}; border-color: ${T.line}; cursor: default; opacity: 0.75; }

        /* --- Ro'yxat (GoyaRoyxat · GoyaQator) va artefakt-strip --- */
        .ti-royxat { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
        .ti-royxat-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ti-royxat-son { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: ${T.accent}; animation: ti-son 0.35s ease-out; }
        .ti-royxat-son.toliq { color: ${T.ok}; }
        ol.ti-gq-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .ti-gq-2 { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: start; }
        .ti-gq { min-width: 0; border-radius: 10px; background: ${T.bg}; animation: ti-kir 0.3s both; }
        .ti-gq.yangi { animation: ti-yangi 1.3s ease-out; }
        .ti-gq.ajrat { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ti-gq.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ti-gq.ochiq { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .ti-royxat.keng { padding: 14px 16px; }
        .ti-gq-b { width: 100%; min-height: 38px; display: flex; align-items: center; gap: 9px; padding: 7px 10px; background: none; border: none; border-radius: 10px; text-align: left; font-family: 'Manrope', sans-serif; color: ${T.ink}; }
        button.ti-gq-b { cursor: pointer; }
        button.ti-gq-b:hover .ti-gq-z { color: ${T.accent}; }
        .ti-gq-n { flex-shrink: 0; width: 18px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; }
        .ti-gq-t { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ti-gq .ti-manba { background: ${T.paper}; }
        .ti-gq-z { flex-shrink: 0; width: 24px; height: 24px; border-radius: 7px; background: ${T.paper}; color: ${T.ink2}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; }
        .ti-gq-ochiq { padding: 2px 12px 10px 37px; display: flex; flex-direction: column; gap: 4px; }
        p.ti-gq-o { margin: 0; display: grid; grid-template-columns: 82px minmax(0,1fr); gap: 8px; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        p.ti-gq-o b { padding-top: 2px; font-size: 10.5px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .ti-strip { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ti-strip-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .ti-strip-d { position: relative; width: 110px; height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .ti-strip-d i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: ${T.accent}; transition: width 0.6s ease-out; }
        .ti-strip-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }

        /* --- Umumiy: Mentor eslatmasi, nishon qatori, statistika, bashorat qatori, xulosa ichidagi taxmin --- */
        .ti-mnote-c { align-self: flex-end; }
        .ti-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ti-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        p.ti-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.ti-nishon.ketdi { opacity: 0.75; }
        .ti-mstat { display: flex; flex-wrap: wrap; gap: 10px; }
        .ti-mstat-q { display: flex; align-items: baseline; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 8px 14px; }
        .ti-mstat-q b { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.accent}; }
        .ti-mstat-q span { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .ti-bash .q-bashorat { animation: ti-kir 0.45s ease-out both; }
        .ti-bash .q-chip { animation: ti-kir 0.35s ease-out both; }
        .ti-bash .q-chip:nth-child(2) { animation-delay: 0.09s; } .ti-bash .q-chip:nth-child(3) { animation-delay: 0.18s; }
        .ti-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .ti-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ti-tolqin 2.4s ease-in-out 0.6s 3; }

        .ti-bashq { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; transform-origin: top; animation: ti-yigil 0.4s ease-out both; }
        .ti-bashq-t { white-space: nowrap; }
        .ti-bashq-t b { color: ${T.accent}; }
        .ti-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .ti-tx.ok { color: ${T.ok}; }
        .ti-tx b { color: ${T.ok}; }
        .ti-tx b.yoq { color: ${T.err}; }
        .ti-xato-q { display: flex; flex-direction: column; gap: 3px; }
        .ti-bogli { position: relative; }
        .ti-bog { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; z-index: 2; }
        .ti-bog-c { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: ti-chiz 0.75s ease-out forwards; animation-delay: calc(var(--i, 0) * 0.3s + 0.2s); }
        .ti-bog-c.ok { stroke: ${T.ok}; }
        .ti-bog-c.acc { stroke: ${T.accent}; stroke-width: 1.8; }
        @keyframes ti-chiz { to { stroke-dashoffset: 0; } }

        /* --- 0-ekran: uch manba obyekti + «Mentorning g'oyalari» --- */
        .ti-s0 { display: contents; }
        .ti-s0.tanlovsiz .q-variantlar-kol { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 16px; }
        .ti-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -9px; border-radius: 20px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ti-tolqin 2.4s ease-in-out 0.7s 3; }

        .ti-s0-maket { display: flex; flex-direction: column; gap: 12px; }
        .ti-hm { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
        .ti-ob { display: flex; flex-direction: column; gap: 8px; min-height: 168px; padding: 12px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; transition: transform 0.35s, box-shadow 0.35s, opacity 0.35s; animation: ti-kir 0.45s ease-out both; }
        .ti-ob:nth-child(2) { animation-delay: 0.09s; } .ti-ob:nth-child(3) { animation-delay: 0.18s; }
        .ti-ob.on { transform: translateY(-6px); box-shadow: 0 0 0 2px ${T.accent}, 0 14px 26px -12px ${fon(T.accent, 0.5)}; }
        .ti-ob.xira { opacity: 0.6; }
        .ti-ob-q { display: flex; flex-direction: column; gap: 3px; font-size: 13px; color: ${T.ink}; }
        .ti-ob-s { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ok}; }
        .ti-ob-s i { font-style: normal; }
        .ti-ob-ro { display: flex; flex-direction: column; gap: 6px; }
        .ti-ob-ro i { display: block; font-style: normal; font-size: 12px; line-height: 1.3; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ti-ob.mvp { justify-content: center; }
        .ti-mvp-q { display: flex; align-items: center; gap: 5px; padding: 6px 7px; border-radius: 8px; background: ${T.bg}; min-width: 0; }
        .ti-mvp-q b { flex: 1; min-width: 0; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ti-mvp-q i { flex-shrink: 0; width: 16px; height: 11px; border-radius: 5px; background: ${T.line}; }
        .ti-mvp-q.keyin { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.4)}; }
        .ti-mvp-q.keyin b { color: ${T.accent}; }
        .ti-mvp-q.keyin i { background: ${fon(T.accent, 0.3)}; }
        .ti-ob.kocha { justify-content: flex-end; padding: 8px; }
        .ti-kocha { width: 100%; height: auto; display: block; }
        .ks-yer { fill: ${fon(T.ink2, 0.12)}; }
        .ks-bino { fill: ${T.paper}; stroke: ${fon(T.ink2, 0.5)}; stroke-width: 1.4; }
        .ks-tom { fill: ${fon(T.ink2, 0.3)}; }
        .ks-oyna { fill: ${T.accentSoft}; stroke: ${fon(T.ink2, 0.35)}; stroke-width: 0.8; }
        .ks-eshik { fill: ${fon(T.ink2, 0.35)}; }
        .ks-chiz { stroke: ${fon(T.ink2, 0.55)}; stroke-width: 1.6; }
        .ks-bayroq { fill: ${T.accent}; }
        .ks-belgi { fill: ${T.accent}; }
        .ks-mpol { fill: ${fon(T.ok, 0.16)}; stroke: ${fon(T.ok, 0.45)}; stroke-width: 1.2; }
        .ks-mchiz { fill: none; stroke: ${fon(T.ok, 0.45)}; stroke-width: 1; }
        .ks-odam { fill: ${T.ink2}; animation: ti-kir-svg 0.4s ease-out both; animation-delay: calc(0.4s + var(--i) * 0.12s); }
        .ti-mg { display: flex; flex-direction: column; gap: 9px; padding: 12px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; }
        .ti-mg-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ti-mg-k { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 8px; min-height: 40px; align-content: start; }
        @media (max-width: 640px) { .ti-mg-k { grid-template-columns: repeat(3, minmax(0,1fr)); } }
        .ti-yk { display: block; height: 34px; border-radius: 7px; border: 1.5px solid ${fon(T.accent, 0.35)}; background: repeating-linear-gradient(135deg, ${T.accentSoft} 0 6px, ${T.paper} 6px 12px); }
        p.ti-javob { margin: 2px 0 0; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; font-size: clamp(13.5px,1.5vw,15px); font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        .ti-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ti-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .ti-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .ti-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .ti-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .ti-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }

        /* --- 1-ekran: oltita qator (Mentor g'oya nomlari) ✓ oladi, oxirida birinchisi karta-skeletga aylanadi --- */
        .ti-rj { display: flex; flex-direction: column; gap: 14px; }
        ol.ti-rj-ro { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); grid-template-rows: repeat(3, auto); grid-auto-flow: column; gap: 7px 10px; }
        .ti-rj-q { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 9px 10px; border-radius: 10px; background: ${T.paper}; box-shadow: 0 5px 12px -8px rgba(${T.shadowBase},0.25); animation: ti-kir 0.4s ease-out both; animation-delay: calc(var(--i) * 0.08s); }
        .ti-rj-t { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 700; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .ti-rj-ok { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: ${T.ok}; color: #fff; font-size: 11px; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0.4); animation: ti-tush 0.35s cubic-bezier(.3,1.6,.5,1) forwards; animation-delay: calc(var(--i) * 0.4s + 0.7s); }
        .ti-rj-karta { transform-origin: 18% 0; animation: ti-kattalash 0.65s cubic-bezier(.2,.9,.3,1.1) both; animation-delay: 3.3s; }
        @keyframes ti-kattalash { from { opacity: 0; transform: translateY(-110px) scale(0.3); } to { opacity: 1; transform: none; } }





        /* --- 2-ekran: sahna (telefon o'lchamidagi joy) + karta --- */
        .ti-s2 { display: grid; grid-template-columns: 196px minmax(0,1fr); gap: 22px; align-items: start; }
        .ti-s2s { justify-self: center; width: 176px; height: 272px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border-radius: 22px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .ti-s2s.s3 { height: auto; overflow: visible; background: none; border: none; }
        .ti-s2s.s0 { align-items: stretch; justify-content: flex-start; padding: 10px; background: ${T.bg}; }
        .ti-s2-mvp { width: 100%; display: flex; flex-direction: column; gap: 10px; animation: ti-kir 0.4s ease-out both; }
        .ti-s2-ilova { display: flex; flex-direction: column; gap: 7px; padding: 10px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 8px 18px -12px rgba(${T.shadowBase},0.4); }
        .ti-s2-ilova-h { display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 14px; color: ${T.accent}; }
        .ti-s2-ilova-h i { width: 14px; height: 14px; border-radius: 4px; background: ${fon(T.ok, 0.25)}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .ti-s2-slot { display: flex; gap: 5px; }
        .ti-s2-slot i { flex: 1; text-align: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; background: ${T.bg}; border-radius: 6px; padding: 4px 0; }
        .ti-s2-slot i.band { color: ${T.ink2}; text-decoration: line-through; opacity: 0.6; }
        .ti-s2-ilova-sk { display: block; height: 8px; border-radius: 4px; background: ${T.line}; }
        .ti-s2-ilova-sk.qisqa { width: 60%; }
        .ti-s2-keyin { display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 12px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.35)}; animation: ti-kir 0.4s ease-out 0.2s both; }
        .ti-s2-keyin b { text-align: center; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .ti-s2-keyin .ti-sm-chip i { font-style: normal; color: ${T.ok}; }
        .ti-s2-kot { animation: ti-s2-kot 0.6s ease-out 0.6s both; }
        @keyframes ti-s2-kot { to { transform: translateY(-5px); color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 10px 18px -8px ${fon(T.accent, 0.5)}; } }
        .ti-s2-mdn { position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; padding: 10px 6px 6px; }
        .ti-mdn { width: 100%; height: auto; display: block; }
        .mdn-pol { fill: ${fon(T.ok, 0.14)}; stroke: ${fon(T.ok, 0.45)}; stroke-width: 1.5; }
        .mdn-chiz { fill: none; stroke: ${fon(T.ok, 0.45)}; stroke-width: 1.2; }
        .mdn-odam { fill: ${T.ink2}; animation: ti-kir-svg 0.4s ease-out both; animation-delay: calc(var(--i) * 0.09s); }
        .mdn-bosh { fill: none; stroke: ${T.accent}; stroke-width: 1.8; stroke-dasharray: 4 3; animation: ti-bosh 1.6s ease-in-out 0.4s 3; }
        @keyframes ti-bosh { 50% { stroke-width: 3; opacity: 0.6; } }
        .mdn-uy { animation: ti-kir-svg 0.45s ease-out both; animation-delay: calc(var(--i) * 0.11s); }
        .mdn-uy polygon { fill: ${fon(T.ink2, 0.28)}; }
        .mdn-uy rect { fill: ${T.paper}; stroke: ${fon(T.ink2, 0.45)}; stroke-width: 1.2; }
        .mdn-uy rect.mdn-oyna { fill: ${T.accentSoft}; stroke: none; }
        .ti-pufak { position: absolute; top: 14px; left: 50%; translate: -50% 0; white-space: nowrap; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 13px; border-radius: 12px; padding: 6px 12px; animation: ti-tush 0.45s cubic-bezier(.3,1.5,.5,1) 0.3s both; }
        .ti-pufak::after { content: ''; position: absolute; left: 50%; bottom: -5px; width: 10px; height: 10px; background: ${T.accent}; transform: translateX(-50%) rotate(45deg); }
        .ti-mdn-y { position: absolute; top: 40%; left: 50%; translate: -50% 0; white-space: nowrap; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.ink2}; font-weight: 800; font-size: 12px; border-radius: 8px; padding: 3px 9px; animation: ti-tush 0.45s cubic-bezier(.3,1.5,.5,1) 0.5s both; }
        .ti-tel-w { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ti-tel-w .ti-kul { align-self: center; }
        .ti-tel { position: relative; width: 170px; height: 272px; padding: 9px; border-radius: 26px; background: ${T.ink}; box-shadow: 0 18px 34px -18px rgba(${T.shadowBase},0.55); animation: ti-kir 0.5s ease-out both; }
        .ti-tel-k { position: absolute; top: 11px; left: 50%; width: 46px; height: 6px; border-radius: 3px; background: ${fon(T.paper, 0.25)}; transform: translateX(-50%); z-index: 1; }
        .ti-tel-e { height: 100%; display: flex; flex-direction: column; gap: 8px; padding: 24px 10px 10px; border-radius: 19px; background: ${T.bg}; }
        .ti-tel-bar { display: block; width: 60%; height: 10px; border-radius: 5px; background: ${T.line}; }
        .ti-elon { display: flex; flex-direction: column; gap: 7px; padding: 10px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.3); animation: ti-kir 0.45s 0.2s ease-out both; }
        .ti-elon-q { font-size: 12px; color: ${T.ink2}; }
        .ti-elon-q b { color: ${T.ink}; }
        .ti-elon-son { display: inline-block; align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; animation: ti-son 0.5s ease-out; }
        .ti-elon-b { text-align: center; font-weight: 800; font-size: 12.5px; color: #fff; background: ${T.accent}; border-radius: 9px; padding: 7px 8px; }
        .ti-elon-b.bosildi { animation: ti-bos 0.45s ease-out; }
        @keyframes ti-bos { 40% { transform: scale(0.9); filter: brightness(0.9); } }
        .ti-tel-sk { display: block; height: 34px; border-radius: 10px; background: ${T.paper}; opacity: 0.7; }
        .ti-tel-sk.qisqa { width: 70%; height: 22px; }

        /* --- 4-ekran: manba sahnasi, karta, ro'yxat --- */
        .ti-s4q { display: flex; flex-direction: column; gap: 6px; }
        .ti-s4q .q-qadamlar, .ti-s9q .q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 8px 18px; }
        .ti-qbos { position: relative; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 9px; padding: 5px 11px; cursor: pointer; }
        .ti-s4 { position: relative; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.1fr); gap: 18px; align-items: start; }
        .ti-s4.tamom { display: flex; flex-direction: column; align-items: stretch; }
        .ti-s4-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .ti-karta.kutish { box-shadow: none; }
        .ti-tanlovlar { display: flex; flex-direction: column; gap: 7px; }
        .ti-tanlovlar .q-chip { animation: ti-kir 0.35s ease-out both; animation-delay: calc(var(--i) * 0.09s + 0.15s); }


        .ti-sm { display: flex; flex-direction: column; justify-content: center; gap: 8px; min-height: 290px; padding: 14px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; animation: ti-sahna 0.45s ease-out both; }
        @keyframes ti-sahna { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
        .ti-sm-mvp { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.3fr) minmax(0,1fr); gap: 8px; align-items: stretch; }
        .ti-sm-quti { display: flex; flex-direction: column; gap: 7px; min-height: 196px; padding: 10px 8px; border-radius: 12px; background: ${T.bg}; min-width: 0; }
        .ti-sm-quti.keyin { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.35)}; }
        .ti-sm-qh { text-align: center; font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .ti-sm-chip { display: flex; align-items: center; justify-content: center; text-align: center; font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 6px 8px; transition: transform 0.35s, box-shadow 0.35s, color 0.35s; }
        .ti-sm-chip.kul { color: ${T.ink2}; opacity: 0.7; }
        .ti-sm-chip.kul i { font-style: normal; color: ${T.ok}; }
        .ti-sm-manba { display: flex; flex-direction: column; gap: 6px; }
        .ti-sm-manba .ti-dalil { font-size: 11.5px; align-self: stretch; }
        .ti-sm.faol .ti-sm-chip.kot { transform: translateY(-5px); color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 10px 18px -8px ${fon(T.accent, 0.5)}; }
        .ti-sm-ro ol { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
        .ti-sm-ro li { display: flex; align-items: center; font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 7px; padding: 5px 9px; animation: ti-kir 0.3s ease-out both; animation-delay: calc(var(--i) * 0.05s); transition: background 0.35s, color 0.35s, box-shadow 0.35s; }
        .ti-sm-ro li span { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ti-sm.faol .ti-sm-ro li.kot { color: ${T.ink}; font-weight: 700; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ti-sm-yolak { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ti-sm-mgap img { width: 18px; height: 18px; border-radius: 50%; background: ${T.accentSoft}; }
        .ti-test-viz { display: flex; flex-direction: column; }
        .ti-sm-mgap { align-self: flex-start; display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.bg}; border-radius: 12px 12px 12px 3px; padding: 6px 11px; }
        .ti-yl-ich { position: relative; width: 100%; max-width: 360px; }
        .ti-yl-ich svg { width: 100%; height: auto; display: block; }






        .yl-taxta { animation: ti-kir-svg 0.4s ease-out both; }
        .yl-qogoz { animation: ti-kir-svg 0.4s ease-out both; animation-delay: calc(var(--i) * 0.12s + 0.25s); }
        .yl-odam { animation: yl-kel 1.3s ease-out 0.5s both; }
        @keyframes yl-kel { from { opacity: 0; transform: translateX(70px); } 30% { opacity: 1; } to { opacity: 1; transform: none; } }
        .ti-sm-qogoz { position: absolute; top: 35%; left: 49%; transform: translate(-50%, -50%) rotate(-3deg); white-space: nowrap; display: inline-flex; align-items: center; font-size: 13px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${fon(T.ink2, 0.4)}; border-radius: 4px; padding: 6px 10px; box-shadow: 0 6px 12px -8px rgba(${T.shadowBase},0.4); transition: box-shadow 0.35s; }
        .ti-sm.faol .ti-sm-qogoz { box-shadow: 0 0 0 2px ${T.accent}, 0 10px 18px -8px ${fon(T.accent, 0.5)}; }

        /* --- 6-ekran: Starbucks sahnasi (chizilgan; logotip yo'q) --- */
        .ti-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .ti-nuq-l { margin-right: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ti-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .ti-nuq i.ok { background: ${T.ok}; }
        .ti-nuq i.cur { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .ti-voqea { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 7px; }
        .ti-voqea > .zoomable { width: 100%; }
        p.ti-sb-tanish { margin: 0; font-size: 14px; color: ${T.ink2}; animation: ti-kir 0.4s ease-out both; }
        .ti-voqea-h { font-weight: 800; font-size: clamp(16px,1.8vw,19px); color: ${T.ink}; animation: ti-kir 0.35s ease-out both; }
        .ti-voqea .ti-bash, .ti-voqea .ti-bashq, .ti-voqea p.q-xulosa { width: 100%; max-width: 660px; text-align: left; }
        .ti-sb { width: 100%; max-width: 560px; height: auto; display: block; margin: 0 auto; border-radius: 12px; }
        .ti-sb .sb-nom { fill: #00704A; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 17px; }
        .ti-sb .sb-oyna { fill: #FFE9C2; stroke: #D8C2A2; stroke-width: 1; }
        .ti-sb.b0 .sb-yuruvchi { transform: translateX(-60px); animation: sb-yur 5.2s ease-in-out 0.5s 2 both; }
        @keyframes sb-yur { 0% { transform: translateX(-60px); } 36%, 56% { transform: translateX(196px); } 100% { transform: translateX(640px); } }
        .ti-sb.b0 .sb-stakan-p { animation: sb-stakan-p 5.2s linear 0.5s 2 both; }
        @keyframes sb-stakan-p { 0%, 44% { opacity: 1; } 47%, 95% { opacity: 0; } 100% { opacity: 1; } }
        .ti-sb.b0 .sb-stakan-q { opacity: 0; animation: sb-stakan-q 5.2s linear 0.5s 2 both; }
        @keyframes sb-stakan-q { 0%, 45% { opacity: 0; } 48%, 100% { opacity: 1; } }
        .ti-sb .sb-bino { animation: ti-kir-svg 0.45s ease-out both; animation-delay: calc(var(--i) * 0.12s); }
        .ti-sb.b1 .sb-kafe .sb-oyna { animation: sb-yon 1.2s ease-out 1s both; }
        @keyframes sb-yon { to { fill: #FFD98A; stroke: #00704A; } }
        .ti-sb .sb-raqam { animation: ti-kir-svg 0.4s ease-out both; }
        .ti-sb .sb-raqam.uch { animation-delay: 1.2s; }
        .ti-sb .sb-raqam circle { fill: ${T.paper}; stroke: ${fon(T.ink2, 0.5)}; stroke-width: 1.5; }
        .ti-sb .sb-raqam text { fill: ${T.ink2}; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; }
        .ti-sb .sb-raqam.uch circle { fill: #00704A; stroke: #00704A; }
        .ti-sb .sb-raqam.uch text { fill: #fff; }
        .ti-sb.b1 .sb-yolchi { transform: translateX(80px); animation: sb-yol 2.6s ease-in-out 0.3s both; }
        @keyframes sb-yol { from { transform: translateX(80px); } to { transform: translateX(256px); } }
        .ti-sb .sb-chiroq .sb-nur { fill: rgba(255,206,120,0.45); animation: sb-nur-yon 1.4s ease-out both; animation-delay: calc(var(--i) * 0.3s + 0.2s); }
        @keyframes sb-nur-yon { from { opacity: 0; } to { opacity: 1; } }
        .ti-sb .sb-suhbat { animation: ti-kir-svg 0.4s ease-out 1.6s both; }
        .ti-sb .sb-kir { animation: ti-kir-svg 0.5s ease-out both; animation-delay: calc(var(--i) * 0.5s + 0.2s); }

        /* --- 8-ekran: ustaxona --- */
        .lesson-root .q-mustaqil { max-width: none; }
        .ti-s8-k { width: 100%; max-width: 780px; align-self: center; display: flex; flex-direction: column; gap: 10px; }
        .ti-s8-manba { display: flex; flex-direction: column; gap: 8px; }
        .ti-src-ro { display: flex; flex-wrap: wrap; gap: 8px; }
        ol.ti-src-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 6px; }
        .ti-src-b { width: 100%; min-width: 0; display: flex; align-items: center; gap: 6px; text-align: left; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 9px; padding: 7px 10px; cursor: pointer; }
        .ti-src-b span { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ti-src-b:hover { border-color: ${T.accent}; }
        .ti-src-b.ishl { color: ${T.ink2}; opacity: 0.75; }
        .ti-src-b i { font-style: normal; font-weight: 800; color: ${T.ok}; }
        .ti-src-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .ti-src-b.chip { width: auto; max-width: 100%; }
        p.ti-kul-q { margin: 0; font-size: 13px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 7px 10px; }
        .ti-inp { width: 100%; min-width: 0; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 9px 11px; outline: none; }
        .ti-inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .ti-inp:disabled { background: ${T.bg}; color: ${T.ink2}; }
        .ti-inp.yozildi { animation: ti-yozildi 1.2s ease-out; }
        @keyframes ti-yozildi { 0%, 60% { background: ${T.okFon}; border-color: ${T.ok}; } }
        .ti-s8-k .ti-qator { padding: 6px 10px; }
        .ti-s8-k .ti-qator.bosh, .ti-s8-k .ti-qator.bor { border-color: transparent; background: ${T.bg}; }


        .ti-s8-amal { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 2px; }
        .ti-s8-amal .q-btn { align-self: auto; }
        .ti-s8-ro { padding: 9px 12px; gap: 6px; }
        .ti-s8-ro .ti-gq-b { min-height: 31px; padding: 3px 8px; }
        .ti-s8-ro .ti-gq-ro { gap: 4px; }
        .ti-s8-ro .ti-gq-2 { gap: 8px; }
        .ti-s8-ro .ti-gq-z { width: 22px; height: 22px; }
        .ti-yordam { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${T.line}; }

        /* --- 9-ekran: juftlik --- */
        .ti-s9q { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; }
        .ti-s9 { width: 100%; }
        .ti-s9.tanlov { max-width: 860px; align-self: center; }
        .ti-s9-ro button.ti-gq-b { box-shadow: inset 0 0 0 1px ${T.line}; }
        .ti-s9-ro button.ti-gq-b:hover { background: ${T.accentSoft}; }
        .ti-s9-ich { position: relative; display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: 36px; align-items: start; }
        .ti-s9-ich:has(.ti-s9-sol) { align-items: center; }
        .ti-s9-ich.yig { grid-template-columns: minmax(0, 640px); justify-content: center; }
        .ti-s9-yoz { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ti-s9-l { display: flex; flex-direction: column; gap: 6px; }
        .ti-s9-yoz .q-btn { align-self: flex-end; }
        .ti-taymer { display: flex; align-items: center; gap: 14px; }
        .ti-taymer .q-btn { align-self: center; }
        .ti-taymer-h { position: relative; flex-shrink: 0; width: 84px; height: 84px; }
        .ti-taymer-h svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .ti-taymer-h circle { fill: none; stroke-width: 8; }
        .ti-taymer-h circle.f { stroke: ${T.line}; }
        .ti-taymer-h circle.o { stroke: ${T.accent}; stroke-linecap: round; transition: stroke-dashoffset 1s linear; }
        .ti-taymer-s { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 800; color: ${T.ink}; }
        .ti-s9-sol { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; min-width: 0; }
        .ti-pufak2 { position: relative; max-width: 100%; padding: 12px 14px; border-radius: 16px 16px 16px 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 10px 22px -16px rgba(${T.shadowBase},0.4); font-size: 15px; font-weight: 600; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; animation: ti-kir 0.4s ease-out both; }
        .ti-pufak2 b { color: ${T.ink2}; font-weight: 700; }
        .ti-pufak2.tushdi { opacity: 0.6; }
        .ti-s9-tug { display: flex; gap: 10px; flex-wrap: wrap; }
        .ti-s9-tanlov { font-size: 13px; font-weight: 800; padding: 5px 12px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; }
        .ti-s9-tanlov.bir { background: ${T.okFon}; color: ${T.ok}; }
        .ti-s9-tanlov.boshqa { background: ${T.accentSoft}; color: ${T.accent}; }
        .ti-s9-karta { min-width: 0; }

        /* --- 10-ekran: kod --- */
        .ti-darvoza { display: flex; flex-direction: column; gap: 9px; }
        .ti-darvoza-s { font-size: 15px; font-weight: 800; color: ${T.ink}; line-height: 1.4; }
        .ti-darvoza-ro { display: flex; flex-direction: column; gap: 8px; }
        .ti-kalit { animation: ti-kir 0.3s ease-out both; animation-delay: calc(var(--i) * 0.08s); }


        ol.ti-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        ol.ti-vazifa li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        ol.ti-vazifa li i { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        ol.ti-vazifa li.ok i { background: ${T.ok}; color: #fff; }
        ol.ti-vazifa.xira { opacity: 0.5; }
        ol.ti-vazifa { transition: opacity 0.4s; }
        .ti-kyordam { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .ti-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ti-mgap { display: flex; align-items: flex-start; gap: 9px; padding: 9px 12px; border-radius: 4px 14px 14px 14px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .ti-mgap img { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; }
        .ti-amal { display: flex; justify-content: flex-end; }
        .ti-kod { margin: 0; padding: 12px 14px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .ti-kod-iz { color: ${CODE.comment}; font-style: italic; }
        .ti-kod-k { font-weight: 700; color: ${CODE.attr}; border-radius: 4px; transition: background 0.4s, color 0.4s; }
        .ti-kod.ajrat .ti-kod-k { background: ${CODE.attr}; color: ${CODE.bg}; padding: 0 3px; }

        /* --- Kartochkalar, yakun, uyga vazifa --- */
        .ti-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: ti-halqa-k 2.4s ease-in-out 0.4s 3; }
        @keyframes ti-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 3px ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 7px ${fon(T.accent, 0.3)}; } }
        p.ti-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.ti-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ti-puls 1.4s ease-out 3; }
        @keyframes ti-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .ti-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .ti-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.ti-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .ti-hw { display: flex; flex-direction: column; gap: 10px; }
        .ti-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ti-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .ti-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ti-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.ti-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.ti-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.ti-hw-qadam li i { flex-shrink: 0; font-style: normal; font-size: 17px; line-height: 1.3; color: ${T.accent}; }
        .ti-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }

        /* --- Telefon va planshet --- */
        @media (max-width: 860px) {
          .ti-s4, .ti-s9-ich { grid-template-columns: minmax(0,1fr); }
          .ti-s4 > .ti-bog { display: none; }
          .ti-sm { min-height: 0; }
        }
        @media (max-width: 640px) {
          .ti-hm { grid-template-columns: minmax(0,1fr); }
          .ti-ob { min-height: 0; }
          .ti-ob.kocha .ti-kocha { max-height: 120px; }
          .ti-s2 { grid-template-columns: minmax(0,1fr); }
          .ti-gq-2 { grid-template-columns: minmax(0,1fr); gap: 6px; }
          ol.ti-src-list { grid-template-columns: minmax(0,1fr); }
          .ti-qator { grid-template-columns: minmax(0,1fr) auto; }
          .ti-qator > .ti-qator-l { grid-column: 1 / -1; }
          .ti-qator > .ti-qator-m, .ti-qator:not(:has(.ti-qator-l)) > .ti-qator-m { grid-column: 1; }
          .ti-qator > .ti-qator-b { grid-column: 2; }
          .ti-qator > .ti-dalil, .ti-qator > .ti-kul, .ti-qator > .ti-xato-q { grid-column: 1 / -1; }
          .ti-hw-karta { grid-template-columns: minmax(0,1fr); }
          .ti-taymer-h { width: 72px; height: 72px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lesson-root [class*="ti-"], .lesson-root [class*="ti-"]::after, .lesson-root [class*="ti-"] *, .lesson-root .stage-nav .btn-white-accent::after { animation: none !important; transition: none !important; }
          .ti-rj-ok, .ti-rj-karta { opacity: 1 !important; transform: none !important; }
          .ti-qator.ochildi .ti-qator-m::after { display: none; }
          .ti-bog-c { stroke-dashoffset: 0; }
          .ti-sb.b1 .sb-yolchi { transform: translateX(256px); }
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
