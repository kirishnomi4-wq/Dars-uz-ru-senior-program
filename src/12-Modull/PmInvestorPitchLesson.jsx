import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) 1-dars (PM, pitch ildizi) «Investorga pitchni qanday tuzasiz?» — MD feedback/F-1008-14modul/01-PmInvestorPitch-v3.md (GATE M 14M-GATE-1).
// Skeletdan (src/skelet/NamunaDars.jsx) qurilgan, 1-to'lqin pilot (F-1008-572). 16 ekran: kirish → reja → olti bo'lak → Airbnb → test → Bozor → test → Jamoa → test →
//   Keyingi qadam → Mentor qoralamasi (tartib) → o'z qoralamasi (QMustaqil) → yakuniy test → podium → kartochkalar → yakun.
// Bitta vizual — OltiBolakSahna (telefon · bo'laklar · taymer · hakamlar); keys — AirbnbTasma (K12). Saqlaydi: pm-m12d1-pitch (tayanch 8).
// O'qiydi: pm-m10d12-pitch, pm-m10d10-hisobot, pm-m11d9-tasdiq (bo'lmasa ham ekran ishlaydi). REPO va kod ekrani yo'q.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKartochka, QYakun, QVoqea, QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d1-v1', lessonTitle: { uz: 'Investorga pitchni qanday tuzasiz?', ru: 'Как построить питч для инвестора?' } }; // 14-Modul 1-dars (LMS), 1-to'lqin pilot — MD feedback/F-1008-14modul/01-PmInvestorPitch-v3.md
// 16 ekran (MD v3) · ballik testlar 4, 6, 8, 12 (ketma-ket emas — P-012)
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: 'питч' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'qoralama', ru: 'черновик' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'bozor', ru: 'рынок' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "so'rov", ru: 'просьба' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',        type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',        type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'oltiBolak', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'airbnb',    type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's4',        type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'bozor',     type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',        type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'jamoa',     type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',        type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'keyingi',   type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'tartib',    type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'practice',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',    type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',    type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's15',       type: 'summary',     template: 'custom',   scored: false, scope: null }
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
const NavNext = ({ disabled, label, onClick, optionalLive, halqa }) => {
  const lbl = tr(label) || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' ip-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). -1 — sentinel (variant yo'q, ballsiz ekran).
// To'g'ri javob o'rinlari (MD): s4 B · s6 D · s8 A · s12 C — har biri har xil.
// MD KOD 14 dagi ballsiz ekran sentinel'lari (oltiBolak, airbnb, bozor, jamoa, keyingi, tartib) — jsx-lint «o'lik kalit» (submitAnswer ga uzatilmaydi), shuning uchun yo'q; practice — 11-ekran signali.
const INLINE_KEYS = { s4: 1, s6: 3, s8: 0, s12: 2, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM: emoji o'rniga raqam — S-026)
const RECAPS = {
  4: {
    title: { uz: "Investor uchun nima qo'shiladi", ru: 'Что добавляется для инвестора' },
    cards: [
      { ic: '1', h: { uz: "Airbnb taqdimotida muammo va yechimdan keyin bozor, mahsulot va jamoa bo'lgan.", ru: 'В презентации Airbnb после проблемы и решения были рынок, продукт и команда.' } },
      { ic: '2', h: { uz: "Bizning pitchga ham Bozor va Jamoa bo'laklari qo'shildi.", ru: 'В наш питч тоже добавились части «Рынок» и «Команда».' } },
      { ic: '3', h: { uz: 'Jonli demo pitchda qoladi — Yechim ichida.', ru: 'Живое демо остаётся в питче — внутри Решения.' }, ask: { uz: "Pitchingizdagi qaysi ikki bo'lak yangi?", ru: 'Какие две части в вашем питче новые?' } }
    ]
  },
  6: {
    title: { uz: 'Bozorda qaysi son', ru: 'Какое число в Рынке' },
    cards: [
      { ic: '1', h: { uz: 'Bozor — mahsulotga muhtoj odamlar va biz bilgan ularning soni.', ru: 'Рынок — люди, которым нужен продукт, и известное нам их число.' } },
      { ic: '2', h: { uz: 'Mentor misolida: guruhda 60 kishi, ilovada 6 tashkilotchi.', ru: 'В примере Ментора: в группе 60 человек, в приложении 6 организаторов.' } },
      { ic: '3', h: { uz: "Manbasi yo'q son o'rniga — «hali tekshirilmagan».", ru: 'Вместо числа без источника — «ещё не проверено».' }, ask: { uz: 'Bozoringizdagi son qayerdan olingan?', ru: 'Откуда взято число в вашем Рынке?' } }
    ]
  },
  8: {
    title: { uz: "Jamoa bo'lagi", ru: 'Часть «Команда»' },
    cards: [
      { ic: '1', h: { uz: "Jamoa bo'lagida kim nima qilgani rost aytiladi.", ru: 'В Команде честно говорится, кто что сделал.' } },
      { ic: '2', h: { uz: "Agent — asbob, jamoa a'zosi emas.", ru: 'Агент — инструмент, а не член команды.' } },
      { ic: '3', h: { uz: "Sinab ko'rgan real odamlar ham aytiladi, lekin a'zo deb emas.", ru: 'Реальные люди, которые пробовали, тоже называются, но не как члены.' }, ask: { uz: 'Mahsulotingizda kim nima qildi?', ru: 'Кто что сделал в вашем продукте?' } }
    ]
  },
  12: {
    title: { uz: 'Keyingi qadam', ru: 'Следующий шаг' },
    cards: [
      { ic: '1', h: { uz: "Keyingi qadamda — keyingi ish va bitta aniq so'rov.", ru: 'В Следующем шаге — следующее дело и одна точная просьба.' } },
      { ic: '2', h: { uz: "Mentor misolida pul so'ralmaydi — bitta aniq so'rov: tanishtirish.", ru: 'В примере Ментора денег не просят — одна точная просьба: познакомить.' } },
      { ic: '3', h: { uz: "Va'da emas — aniq ish aytiladi.", ru: 'Не обещание — называется конкретное дело.' }, ask: { uz: "Hakamdan qanday aniq so'rov qilasiz?", ru: 'О чём точно вы попросите судью?' } }
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
        {card.body && <p className="rc-body">{tr(card.body)}</p>}
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="ip-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — OltiBolakSahna: telefon (JamoaTelefon) · bo'laklar (besh | olti) · taymer chizig'i + «savol-javob» · hakamlar =====
// Hakamlar — rol yorlig'i «hakam» + savol pufagi; odam figurasi chizilmaydi (13-Modul SABOQ P1).
// Bitta manba: JAMOA_PITCH · JAMOA_PITCH_12 · HAKAM_SAVOL · BOZOR_SON · AIRBNB_KADR + o'quvchi qoralamasi (pm-m12d1-pitch).
// 12-Modul BeshDaqiqaSahna dan ko'chirilmagan — dars ichida yozildi (K-020). Rangli yon chiziq yo'q; reduced-motion — CSS da.
// qolip-maket: ip-son ip-tahrir ip-uya q-dd-chip q-dd-slot
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = ' ';
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const AIRBNB_RANG = '#FF5A5F'; // Airbnb — o'z rangi (10-Modul TAYANCHGA SAVOL 9), logotipsiz
const MJ = () => <span className="ip-mj">Maydon Jamoa</span>;
const Brend = ({ nom, rang }) => <span className="ip-brend" style={{ color: rang }}>{nom}</span>;
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const brendAjrat = (s) => (typeof s === 'string' && s.includes('Airbnb'))
  ? s.split('Airbnb').map((p, i) => <React.Fragment key={i}>{i > 0 && <Brend nom="Airbnb" rang={AIRBNB_RANG} />}{p}</React.Fragment>)
  : s;

// --- Saqlanadigan natija (tayanch 8) va o'qiladigan kalitlar (12, 13-Modul) ---
const PITCH_KEY = 'pm-m12d1-pitch';
const P12_KEY = 'pm-m10d12-pitch';
const HISOBOT_KEY = 'pm-m10d10-hisobot';
const TASDIQ_KEY = 'pm-m11d9-tasdiq';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };

const BOLAK_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi'];
const BESH_ID = ['muammo', 'yechim', 'demo', 'raqamlar', 'keyingi'];
const BOLAK_NOM = {
  muammo: { uz: 'Muammo', ru: 'Проблема' }, bozor: { uz: 'Bozor', ru: 'Рынок' }, yechim: { uz: 'Yechim', ru: 'Решение' },
  raqamlar: { uz: 'Raqamlar', ru: 'Цифры' }, jamoa: { uz: 'Jamoa', ru: 'Команда' }, keyingi: { uz: 'Keyingi qadam', ru: 'Следующий шаг' },
  demo: { uz: 'Jonli demo', ru: 'Живое демо' }
};
const VAQT_OLTI = [40, 30, 90, 60, 30, 50]; // tayanch 9.1 — bu mashqda, jami 5:00
const VAQT_BESH = [40, 20, 90, 90, 60]; // 12-Modul taqsimoti
// Mentor misoli — «Maydon Jamoa» qoralamasi (tayanch 1.1 AYNAN; sonlar 1.14)
const JAMOA_PITCH = {
  muammo: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'Игрокам трудно собрать людей в команду. У 4 из 5 игроков, которых я спросил, в последней игре не хватило людей или кто-то не пришёл.' },
  bozor: { uz: "Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.", ru: 'В футбольной группе махалли — 60 человек; в приложении — 6 организаторов. Другие махалли мы ещё не проверяли.' },
  yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' },
  raqamlar: { uz: "51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.", ru: '51 пользователь; 11 из них — мои одноклассники, 7 пришли по ссылке-приглашению. 3 организатора дали письменное подтверждение на Pro — это ещё не оплата.' },
  jamoa: { uz: "Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.", ru: 'Я — идея, продукт и код (с агентом). Пробовали — 6 организаторов и игроки.' },
  keyingi: { uz: "Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.", ru: 'С тремя организаторами проверю «Постоянную игру» в тестовом режиме. Одна просьба к вам: познакомьте с владельцами площадок в махалле.' },
  birinchi: { // har bo'lakning birinchi gapi — 10-ekran
    muammo: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi.", ru: 'Игрокам трудно собрать людей в команду.' },
    bozor: { uz: "Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi.", ru: 'В футбольной группе махалли — 60 человек; в приложении — 6 организаторов.' },
    yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' },
    raqamlar: { uz: "51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi.", ru: '51 пользователь; 11 из них — мои одноклассники, 7 пришли по ссылке-приглашению.' },
    jamoa: { uz: "Men — g'oya, mahsulot va kod (agent bilan).", ru: 'Я — идея, продукт и код (с агентом).' },
    keyingi: { uz: "Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinayman.", ru: 'С тремя организаторами проверю «Постоянную игру» в тестовом режиме.' }
  },
  vaqt: VAQT_OLTI
};
// 12-Moduldagi besh bo'lak (12-Modul tayanchi 1.12 aynan; bir qatordan) — 0, 2, 9-ekranlarning «oldin» holati
const JAMOA_PITCH_12 = {
  muammo: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi.", ru: 'Игрокам трудно собрать людей в команду.' },
  yechim: JAMOA_PITCH.yechim,
  demo: { uz: "2-telefonda «8 / 10» o'rniga «9 / 10» o'zi chiqadi", ru: 'На 2-м телефоне вместо «8 / 10» само появляется «9 / 10»' },
  raqamlar: { uz: "44 kishidan 11 tasi — sinfdoshlarim", ru: 'Из 44 человек 11 — мои одноклассники' },
  keyingi: { uz: "E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.", ru: 'После объявления организатор кнопкой «Поделиться ссылкой» отправляет ссылку своей команде — цель 50.' }
};
// Hakam savollari — bitta manba (tayanch 9.3; to'rttasi 12-Modul ZAL_SAVOL aynan). Kurs savollari, real hakam gapi emas.
const HAKAM_SAVOL = {
  muammo: { uz: 'Bu muammo borligini qayerdan bilasiz?', ru: 'Откуда вы знаете, что эта проблема есть?' },
  bozor: { uz: 'Bu mahsulot yana qancha odamga kerak?', ru: 'Скольким ещё людям нужен этот продукт?' },
  yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' },
  raqamlar: { uz: 'Bu son qayerdan va nimani sanaydi?', ru: 'Откуда это число и что оно считает?' },
  jamoa: { uz: 'Buni kim qilyapti?', ru: 'Кто это делает?' },
  keyingi: { uz: 'Endi nima qilasiz?', ru: 'Что будете делать дальше?' }
};
// 5-ekran son kartalari (uchinchisida manba yo'q)
const BOZOR_SON = [
  { id: 'guruh', son: { uz: '60 kishi', ru: '60 человек' }, kim: { uz: 'mahalla futbol guruhi', ru: 'футбольная группа махалли' }, manba: { uz: 'Telegram guruhi', ru: 'Telegram-группа' }, gap: { uz: 'Mahalla futbol guruhida — 60 kishi', ru: 'В футбольной группе махалли — 60 человек' } },
  { id: 'ilova', son: { uz: '6 tashkilotchi', ru: '6 организаторов' }, kim: { uz: 'ilovada', ru: 'в приложении' }, manba: { uz: 'Database', ru: 'Database' }, gap: { uz: '; ilovada — 6 tashkilotchi.', ru: '; в приложении — 6 организаторов.' } },
  { id: 'boshqa', son: { uz: '?', ru: '?' }, kim: { uz: 'boshqa mahallalar', ru: 'другие махалли' }, manba: null, gap: { uz: 'Boshqa mahallalarni hali tekshirmaganmiz.', ru: 'Другие махалли мы ещё не проверяли.' } }
];
// 3-ekran — K12 Airbnb pitch deck (bank so'zi aynan, raqamsiz; PM_Prompt_v8.md 228–231, tayanch 5)
const AIRBNB_KADR = [
  { h: { uz: 'Investorlar uchun taqdimot', ru: 'Презентация для инвесторов' }, m: { uz: "Airbnb — begonaning uyida ijaraga turish xizmati. Uning investorlar uchun birinchi taqdimoti — o'nga yaqin oddiy slayd.", ru: 'Airbnb — сервис, где можно снять жильё у незнакомого человека. Его первая презентация для инвесторов — около десятка простых слайдов.' } },
  { h: { uz: 'Muammo va yechim', ru: 'Проблема и решение' }, m: { uz: 'Taqdimot muammo va yechimdan boshlangan.', ru: 'Презентация начиналась с проблемы и решения.' } },
  { h: { uz: 'Muammodan jamoagacha', ru: 'От проблемы до команды' }, m: { uz: "Tartib shunday: muammo, yechim, bozor, mahsulot, jamoa. Taqdimot ochiq turadi: u eng ko'p tahlil qilinadigan pitchlardan biri.", ru: 'Порядок такой: проблема, решение, рынок, продукт, команда. Презентация лежит в открытом доступе: это один из самых разбираемых питчей.' } }
];
const SLAYD_NOM = [{ uz: 'Muammo', ru: 'Проблема' }, { uz: 'Yechim', ru: 'Решение' }, { uz: 'Bozor', ru: 'Рынок' }, { uz: 'Mahsulot', ru: 'Продукт' }, { uz: 'Jamoa', ru: 'Команда' }];
const SLAYD_SONI = 10; // «o'nga yaqin» — ekranda son yozilmaydi

// --- Ekran maqsadlari (PM: quruvchi + SCREEN_INTENTS; ekranga chiqmaydi) ---
const SCREEN_INTENTS = [
  'kirish: besh bo\'lakli pitch qaysi hakam savoliga javob topolmaydi', 'reja: olti bo\'lakli qoralama', 'olti bo\'lak: hakam, Bozor, Jamoa, savol-javob',
  'Airbnb: investorlar taqdimotida bozor va jamoa', 'test: zal pitchidan investor pitchiga', 'Bozor: manbali son, qolgani hali tekshirilmagan', 'test: manbasiz son',
  'Jamoa: kim nima qilgani, agent — asbob', 'test: yolg\'iz qurgan o\'quvchi', 'Keyingi qadam: keyingi ish va aniq so\'rov, pul emas', 'Mentor qoralamasini tartiblash',
  'o\'z qoralamasi: olti karta, pm-m12d1-pitch', 'yakuniy test: Keyingi qadam', 'podium', 'kartochkalar', 'yakun: 4 holat'
];

// --- Matn tekshiruvi (11-ekran): ikki tilli; apostrof shakllari normT bilan bir xil ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const PII_RE = /@|t\.me\/|\+998|\d{7,}|(?:\d[\s-]?){9,}|https?:|www\.|\.uz\b|\.com\b/;
const UMUMIY_RE = /(minglab|millionlab|hamma odam|butun shahar|butun dunyo|тысяч|миллион|все люди|всем людям|весь город|весь мир)/;
const TEXNO_RE = /(^|[^a-z])(react|expo|nestjs|neon|render|netlify|socket\.io)(?![a-z])/;
const PUL_RE = /(^|[^a-z'а-яё])(investitsiya\S*|pul|pulga|puli|pulni|puldan|so'm\S*|dollar\S*|ulush\S*|summa\S*|million\S*|mln|инвестиц\S*|деньг\S*|денег|сум|сумм\S*|доллар\S*|дол[яюи]|миллион\S*|млн)(?![a-z'а-яё])/;
const VADA_RE = /(^|[^a-z'а-яё])(tez orada|albatta|yetamiz|aniq bo'ladi|скоро|обязательно|достигнем|точно будет)(?![a-z'а-яё])/;
// bloklaydi: bo'sh · 160 · {…} · telefon/akkaunt/havola; yo'naltiradi (ikkinchi «Saqlash» bilan o'tadi): qolganlari
const tekshir = (id, matn) => {
  const s = String(matn || '').trim(); const n = normT(s);
  if (!n) return { x: 'bosh', blok: true };
  if (s.length > 160) return { x: 'uzun', blok: true };
  if (/\{[^}]*\}/.test(s)) return { x: 'qavs', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (id === 'bozor' && UMUMIY_RE.test(n)) return { x: 'umumiy' };
  if (id === 'yechim' && TEXNO_RE.test(n)) return { x: 'texno' };
  if (id === 'raqamlar' && /tasdiq|подтвержд/.test(n) && !/to'lov emas|не оплата/.test(n)) return { x: 'tasdiq' };
  if (id === 'jamoa' && /agent|агент/.test(n) && /a'zo|член|участник/.test(n)) return { x: 'agent' };
  if (id === 'keyingi' && PUL_RE.test(n)) return { x: 'pul' };
  if (id === 'keyingi' && VADA_RE.test(n)) return { x: 'vada' };
  return null;
};
const pulVadasiz = (s) => { const n = normT(s); return !!n && !PUL_RE.test(n) && !VADA_RE.test(n); };

// --- O'quvchining oldingi natijalari (bo'lmasa ham ekran ishlaydi) ---
const p12Matn = (v) => (typeof v === 'string' ? v.trim() : (v && typeof v === 'object' ? String(v.gap || '').trim() : ''));
const pitch12Ol = () => { const p = lsO(P12_KEY); const b = p && p.bolaklar; return b && typeof b === 'object' ? b : null; };
const besh12 = () => {
  const b = pitch12Ol(); if (!b) return null;
  const q = { muammo: p12Matn(b.muammo), yechim: p12Matn(b.yechim), demo: b.demo && typeof b.demo === 'object' ? String(b.demo.bosiladi || '').trim() : '', raqamlar: b.raqamlar && typeof b.raqamlar === 'object' ? String(b.raqamlar.halolGap || b.raqamlar.bosh || '').trim() : '', keyingi: p12Matn(b.keyingi) };
  return Object.values(q).some(Boolean) ? q : null;
};
const oldindanOl = () => {
  const b = pitch12Ol(); if (!b) return {};
  const mu = b.muammo && typeof b.muammo === 'object' ? [b.muammo.gap, b.muammo.dalil].map(x => String(x || '').trim()).filter(Boolean).join(' ') : p12Matn(b.muammo);
  const o = { muammo: mu, yechim: p12Matn(b.yechim), raqamlar: b.raqamlar && typeof b.raqamlar === 'object' ? String(b.raqamlar.halolGap || '').trim() : '', keyingi: p12Matn(b.keyingi) };
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v));
};
const hisobotOl = () => {
  const h = lsO(HISOBOT_KEY); const r = h && h.royxat;
  if (!r || h.tuzatishQator === 'royxat' || r.soni === null || r.soni === undefined || !Number.isFinite(Number(r.soni))) return null;
  return { soni: Number(r.soni), sana: typeof r.sana === 'string' ? r.sana.trim() : (r.sana && typeof r.sana === 'object' ? String(r.sana.uz || '').trim() : '') };
};
// 13-Modul 9-dars (tayanch 8): hisobga olinadigan yozma tasdiqlar soni — tekshiruv 'qabul' va tasdiqlar[].hisobga === true (01-FILTR 5 shartnomasi)
const tasdiqSoni = () => { const t = lsO(TASDIQ_KEY); return t && t.tekshiruv === 'qabul' && Array.isArray(t.tasdiqlar) ? t.tasdiqlar.filter(x => x && x.hisobga === true).length : 0; };
const pitchOl = () => { const p = lsO(PITCH_KEY); return p && p.bolaklar && typeof p.bolaklar === 'object' ? p : null; };
const bosh6 = () => Object.fromEntries(BOLAK_ID.map(k => [k, null]));
const pitchYoz = (id, matn, manba) => {
  const p = lsO(PITCH_KEY) || {};
  const d = { bolaklar: { ...bosh6(), ...(p.bolaklar || {}), [id]: matn }, manba: { ...bosh6(), ...(p.manba || {}), [id]: manba }, savedAt: Date.now() };
  lsY(PITCH_KEY, d); return d;
};
const saqlanganSoni = (b) => BOLAK_ID.filter(id => b && typeof b[id] === 'string' && b[id].trim()).length;

// --- Yordamchi ilgaklar ---
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const Sanagich = ({ dan, gacha, ms = 1200, onSon }) => {
  const [v, setV] = useState(kamHarakat() ? gacha : dan);
  useEffect(() => {
    if (kamHarakat()) { setV(gacha); return undefined; }
    let i = dan; const t = setInterval(() => { i += 1; setV(i); if (i >= gacha) clearInterval(t); }, ms / Math.max(1, gacha - dan));
    return () => clearInterval(t);
  }, [dan, gacha, ms]);
  useEffect(() => { if (onSon) onSon(v); }, [v]); // eslint-disable-line
  return <b className="ip-sanoq-n">{v}</b>;
};
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="ip-xq-m">{matn}</span>
  {izoh && <span className="ip-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="ip-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="ip-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);

// --- Telefon: «Maydon Jamoa» — «O'yin» ekrani (≈170×272, o'lchami barqaror) ---
const JamoaTelefon = ({ son = 8 }) => (
  <div className="ip-tel">
    <div className="ip-tel-ekran">
      <span className="ip-tel-nom"><MJ /></span>
      <span className="ip-tel-y">{tr({ uz: "O'yin", ru: 'Игра' })}</span>
      <b className="ip-tel-vaqt">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
      <span className="ip-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
      <b key={son} className={cxx('ip-tel-son', son > 8 && 'yangi')}>{son}{NB}/{NB}10</b>
      <span className="ip-tel-doira">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < son ? 'bor' : ''} />)}</span>
      <span className="ip-tel-tugma">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div>
  </div>
);
// --- Taymer chizig'i 0–5:00: besh yoki olti bo'lak + 5:00 dan keyin uzuq «savol-javob» bo'lagi ---
const TaymerChiziq = ({ rejim = 'olti', tol = 'toliq', kechik = 0, sj = false, nomlar = true }) => {
  const ids = rejim === 'olti' ? BOLAK_ID : BESH_ID;
  const v = rejim === 'olti' ? VAQT_OLTI : VAQT_BESH;
  const DAV = 2.4; let acc = 0;
  return (
    <div className={cxx('ip-tm', tol)}>
      <div className="ip-tm-q">
        <div className="ip-tm-ch">
          <div className="ip-tm-chiziq">
            {ids.map((id, i) => {
              const d = acc; acc += v[i];
              return (
                <span key={id} className="ip-tm-bo" style={{ flex: v[i] }}>
                  <span className="ip-tm-t"><i style={tol === 'yur' ? { animationDelay: (kechik + (d / 300) * DAV) + 's', animationDuration: ((v[i] / 300) * DAV) + 's' } : undefined} /></span>
                  {nomlar && <em>{tr(BOLAK_NOM[id])}</em>}
                </span>
              );
            })}
          </div>
          <div className="ip-tm-chet"><span>0:00</span><span>5:00</span></div>
        </div>
        {sj && <span className="ip-tm-sj" style={tol === 'yur' ? { animationDelay: (kechik + DAV) + 's' } : undefined}><span className="ip-tm-t" /><em>{tr({ uz: 'savol-javob', ru: 'вопросы-ответы' })}</em></span>}
      </div>
    </div>
  );
};
// --- Investor: bitta asosiy tinglovchi (F-1008-574, 576) — rol kartasi (portfel belgisi, odam figurasi emas — SABOQ P1) + uning savollari; javob topilsa — ✓ ---
const Portfel = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.5V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5M4.5 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm-1 5.5h17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Investor = ({ savollar = [], sj = false }) => (
  <div className={cxx('ip-ivr', sj && 'sj')}>
    <span className="ip-ivr-ava"><Portfel /></span>
    <div className="ip-ivr-o">
      <b className="ip-ivr-nom">{tr({ uz: 'Investor', ru: 'Инвестор' })}</b>
      <div className="ip-ivr-sl">
        {savollar.map((q, i) => (
          <span key={q.k ?? i} className={cxx('ip-ivr-s', q.ok && 'ok', !q.matn && 'kut')} style={{ animationDelay: (i * 0.12) + 's' }}>
            <i key={q.ok ? 'ok' : 'q'}>{q.ok ? '✓' : '?'}</i>{q.matn && <span>{q.matn}</span>}
          </span>
        ))}
        {sj && <em className="ip-ivr-sj">{tr({ uz: 'savol-javob', ru: 'вопросы-ответы' })}</em>}
      </div>
    </div>
  </div>
);
// --- Bo'lak kartasi: holat — bosh · joriy · yozildi · ok · yangi · oraliq ---
const BolakKarta = ({ b, fokus }) => {
  const kichik = !!fokus && fokus !== b.id;
  return (
    <div className={cxx('ip-bolak', b.holat, kichik && 'kichik', fokus === b.id && 'fokus')}>
      {b.nom && <div className="ip-bolak-h">
        <b>{b.nom}</b>
        {b.yorliq && <em className="ip-bolak-y">{b.yorliq}</em>}
        {b.belgi && <i className="ip-bolak-b" key={b.belgi}>{b.belgi}</i>}
        {b.tahrir && <button type="button" className="ip-tahrir" onClick={b.tahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
      </div>}
      {!kichik && b.matn && <span className="ip-bolak-m">{b.matn}</span>}
      {!kichik && b.qosh}
    </div>
  );
};
const OltiBolakSahna = ({ telefon = false, telSon = 8, investor, bolaklar = [], taymer, yorliq, fokus, ostida, className }) => (
  <div className={cxx('ip-sahna', !telefon && 'tel-yoq', fokus && 'fokusli', className)}>
    {telefon && <div className="ip-sahna-tel"><JamoaTelefon son={telSon} /></div>}
    <div className="ip-sahna-ong">
      {yorliq && <span className="ip-sahna-y">{yorliq}</span>}
      {investor && <Investor {...investor} />}
      {fokus
        ? <div className="ip-bolaklar">
          <div className="ip-fk-qator">{bolaklar.map(b => <span key={b.id} className={cxx('ip-fk-chip', b.id === fokus && 'on')}>{b.nom}</span>)}</div>
          {bolaklar.filter(b => b.id === fokus).map(b => <BolakKarta key={b.id} b={b} fokus={fokus} />)}
        </div>
        : <div className="ip-bolaklar">{bolaklar.map(b => <BolakKarta key={b.id} b={b} fokus={fokus} />)}</div>}
      {ostida}
      {taymer && <TaymerChiziq {...taymer} />}
    </div>
  </div>
);
// Mentor qoralamasi — olti bo'lak to'liq matn (10-ekran yakuni, 11-ekran mentor rejimi)
const mentorOlti = (holat = 'yozildi') => BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: tr(JAMOA_PITCH[id]), holat, yorliq: id === 'yechim' ? tr({ uz: 'jonli demo', ru: 'живое демо' }) : null }));
// Fokus ko'rinishi: bitta bo'lak joriy, qolgani ixcham (5, 7, 9-ekranlar — telefonsiz, SABOQ 24)
const fokusOlti = (fid, b) => BOLAK_ID.map(id => (id === fid ? { id, ...b } : { id, nom: tr(BOLAK_NOM[id]), holat: 'yozildi' }));
// Testlar javobidan keyingi kichik vizual (SABOQ 4)
const MiniOlti = ({ ajrat = [] }) => (
  <div className="ip-mini">{BOLAK_ID.map((id, i) => <span key={id} className={cxx('ip-mini-b', ajrat.includes(id) && 'ajrat')} style={{ animationDelay: (i * 0.06) + 's' }}>{tr(BOLAK_NOM[id])}</span>)}</div>
);
const MiniBolak = ({ id }) => (
  <div className="ip-mini-k"><b>{tr({ uz: 'Mentorning', ru: 'У Ментора:' })} {tr(BOLAK_NOM[id])} {tr({ uz: "bo'lagi", ru: '' })}</b><span>{tr(JAMOA_PITCH[id])}</span></div>
);
// Bosqich tugmalari (ixcham, bir qatorda; joriysi accent halqada, bosilgani ✓)
const Qadamlar3 = ({ nomlar, q, faol, onBos }) => (
  <div className="ip-qadamlar">
    {nomlar.map((n, i) => (
      <QChip key={i} holat={i < q ? 'ok' : i === q && faol ? 'on' : undefined} className={cxx(i === q && faol && 'ip-joriy')} disabled={!faol || i !== q} onClick={onBos}>
        <i>{i < q ? '✓' : i + 1}</i>{tr(n)}
      </QChip>
    ))}
  </div>
);
const IPUCHA = (t) => <p className="ip-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('ip-bash', taxmin && 'ix')}>{el}</div>;

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026: correct false hammaga; javob «Aynan!» / «Qiziq fikr!» — T-028, T-067) =====
const HOOK_OPTS = ['bozor', 'muammo', 'raqamlar'];
const HOOK_JAVOB = {
  bozor: { uz: <><b>Aynan!</b> Besh bo'lakda bu savolga joy yo'q — yangi bo'lak kerak; hakamda yana bitta savol bor.</>, ru: <><b>Именно!</b> В пяти частях нет места для этого вопроса — нужна новая часть; у судьи есть ещё один вопрос.</> },
  muammo: { uz: <><b>Qiziq fikr!</b> Bu savolga Muammo bo'lagidagi dalil javob beradi — u besh bo'lakda bor.</>, ru: <><b>Интересная мысль!</b> На этот вопрос отвечает довод в части «Проблема» — она есть среди пяти частей.</> },
  raqamlar: { uz: <><b>Qiziq fikr!</b> Bu savolga Raqamlar bo'lagi javob beradi — u ham besh bo'lakda bor.</>, ru: <><b>Интересная мысль!</b> На этот вопрос отвечает часть «Цифры» — она тоже есть среди пяти частей.</> }
};
const birinchiGap = (s) => { const t = String(s || '').trim(); const m = t.match(/^.+?[.!?](\s|$)/); return m ? m[0].trim() : t; };
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const oz = useMemo(() => besh12(), []);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const matn = (id) => (oz ? birinchiGap(oz[id]) : tr(JAMOA_PITCH_12[id]));
  const ids = picked === 'bozor' ? ['muammo', 'oraliq', 'yechim', 'demo', 'raqamlar', 'keyingi'] : BESH_ID;
  const bolaklar = ids.map(id => (id === 'oraliq'
    ? { id, nom: null, holat: 'oraliq' }
    : { id, nom: tr(BOLAK_NOM[id]), matn: matn(id) || null, holat: picked === id ? 'ok' : (matn(id) ? 'yozildi' : 'bosh'), belgi: picked === id ? '✓' : null }));
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('ip-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Investorga pitchni <A>qanday tuzasiz?</A></>, ru: <>Как построить <A>питч для инвестора?</A></> })}
          mentor={<Mentor>{tr({ uz: "Investor — loyihaga pul tikadigan odam: 12-Moduldagi besh bo'lakli pitchni u eshitsa, qaysi savolga javob topolmaydi?", ru: 'Инвестор — человек, который вкладывает деньги в проект: если он услышит питч из пяти частей из 12-го модуля, на какой вопрос не найдёт ответа?' })}</Mentor>}
          maket={<OltiBolakSahna rejim="besh" yorliq={!oz ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : null}
            investor={{ savollar: [{ matn: picked ? tr(HAKAM_SAVOL[picked]) : null, k: picked || 'q' }] }}
            bolaklar={bolaklar} taymer={{ rejim: 'besh', tol: 'toliq', nomlar: false }} />}
          variantlar={HOOK_OPTS.map(id => ({ id, t: tr(HAKAM_SAVOL[id]).replace(/[?]$/, '') }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual o'zi yoziladi, tugagach «Boshlaymiz» halqada) =====
// MD «matnsiz skelet» → SABOQ 33: bo'sh kulrang chiziqlar o'rnida bo'lak nomlari (kulrang yorliq ham shu olti nomni aytadi — 2-ekran kashfiyoti ochilmaydi).
const REJA = [
  { t: { uz: "Investor uchun pitch qanday tuzilishini bilib olasiz", ru: 'Узнаете, как устроен питч для инвестора' }, teg: { uz: "olti bo'lak", ru: 'шесть частей' } },
  { t: { uz: "Mahsulot kimga kerakligini va uni kim qilayotganini aytishni o'rganasiz", ru: 'Научитесь говорить, кому нужен продукт и кто его делает' }, teg: { uz: 'bozor · jamoa', ru: 'рынок · команда' } },
  { t: { uz: "Pitch oxirida nima so'rashni bilib olasiz", ru: 'Узнаете, о чём просить в конце питча' }, teg: { uz: 'keyingi qadam', ru: 'следующий шаг' } },
  { t: { uz: "O'z mahsulotingiz uchun pitch qoralamasini yozasiz", ru: 'Напишете черновик питча для своего продукта' }, teg: { uz: 'qoralama', ru: 'черновик' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [tayyor, setTayyor] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTayyor(true), kamHarakat() ? 0 : 6 * 600 + 2900); return () => clearTimeout(t); }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun investor uchun <A>pitch qoralamasini yozasiz.</A></>, ru: <>Сегодня напишете <A>черновик питча</A> для инвестора.</> })}
        mentor={<Mentor>{tr({ uz: "12-Moduldagi pitchingiz saqlangan bo'lsa, uning bo'laklari qoralamaga o'zi qo'yiladi.", ru: 'Если ваш питч из 12-го модуля сохранён, его части сами появятся в черновике.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="ip-reja">
          <span className="ip-reja-teg">{tr({ uz: "olti bo'lak: muammo, bozor, yechim, raqamlar, jamoa, keyingi qadam", ru: 'шесть частей: проблема, рынок, решение, цифры, команда, следующий шаг' })}</span>
          <div className="ip-skelet">{BOLAK_ID.map((id, i) => <span key={id} className="ip-skelet-b" style={{ animationDelay: (i * 0.6) + 's' }}>{tr(BOLAK_NOM[id])}</span>)}</div>
          <TaymerChiziq rejim="olti" tol="yur" kechik={3.6} sj nomlar={false} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — OLTI BO'LAK (QTushuncha keng; bashorat → 3 tugma ketma-ket → besh bo'lak oltiga aylanadi; markaziy) =====
const S2_TUGMA = [{ uz: 'Investor savollari', ru: 'Вопросы инвестора' }, { uz: "Yangi bo'laklar", ru: 'Новые части' }, { uz: 'Besh daqiqa va savol-javob', ru: 'Пять минут и вопросы-ответы' }];
const S2_IZOH = [
  { uz: 'Pitchni baholaydigan odam — investor yoki tadbirkor — hakam deyiladi.', ru: 'Человек, который оценивает питч, — инвестор или предприниматель — называется судьёй.' },
  { uz: "Bozor — mahsulotga muhtoj odamlar va biz bilgan ularning soni; Jamoa — mahsulotni kim qilayotgani.", ru: 'Рынок — люди, которым нужен продукт, и известное нам их число; Команда — кто делает продукт.' },
  { uz: "Pitch 5 daqiqa; undan keyin investor savol beradi, siz javob berasiz — bu savol-javob deyiladi.", ru: 'Питч — 5 минут; потом инвестор задаёт вопросы, вы отвечаете — это называется «вопросы-ответы».' }
];
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Одну' } }, { k: '2', t: { uz: 'Ikkita', ru: 'Две' } }, { k: '3', t: { uz: 'Uchta', ru: 'Три' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const olti = q >= 2;
  const bolaklar = olti
    ? BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: id === 'bozor' || id === 'jamoa' ? tr(JAMOA_PITCH.birinchi[id]) : tr(JAMOA_PITCH_12[id]), holat: id === 'bozor' || id === 'jamoa' ? (q === 2 ? 'yangi' : 'ok') : 'yozildi', belgi: (id === 'bozor' || id === 'jamoa') ? '✓' : null, yorliq: id === 'yechim' ? tr({ uz: 'jonli demo', ru: 'живое демо' }) : null }))
    : BESH_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: tr(JAMOA_PITCH_12[id]), holat: 'yozildi' }));
  const savollar = q === 0 ? [{ matn: null, k: 'q0' }]
    : q === 1 ? [{ matn: tr(HAKAM_SAVOL.bozor), k: 'b' }, { matn: tr(HAKAM_SAVOL.jamoa), k: 'j' }]
      : q === 2 ? [{ matn: tr(HAKAM_SAVOL.bozor), ok: true, k: 'b' }, { matn: tr(HAKAM_SAVOL.jamoa), ok: true, k: 'j' }]
        : [{ matn: null, k: 's1' }, { matn: null, k: 's2' }, { matn: null, k: 's3' }];
  const sahna = <OltiBolakSahna telefon telSon={olti ? 9 : 8} investor={{ savollar, sj: q >= 3 }} bolaklar={bolaklar}
    taymer={q >= 3 ? { rejim: 'olti', tol: 'yur', sj: true } : { rejim: 'besh', tol: 'toliq' }} />;
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · olti bo'lak", ru: 'Понятие · шесть частей' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Investor uchun pitchga <A>nima qo'shiladi?</A></>, ru: <>Что добавляется <A>в питч для инвестора?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va pitch qanday o'zgarishiga qarang.", ru: 'Нажимайте кнопки по одной и смотрите, как меняется питч.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Mentor pitchiga nechta yangi bo'lak qo'shiladi?", ru: 'Сколько новых частей добавится в питч Ментора?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="ip-harakat">
          <Qadamlar3 nomlar={S2_TUGMA} q={q} faol={!!taxmin} onBos={() => setQ(n => Math.min(3, n + 1))} />
          {q > 0 && <QIzoh key={q}>{tr(S2_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — pitch qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняется питч.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '2'} aslida={tr({ uz: 'ikkita', ru: 'две' })} />}
          matn={tr({ uz: "Bizda investor pitchi olti bo'lakdan iborat: Muammo, Bozor, Yechim, Raqamlar, Jamoa va Keyingi qadam.", ru: 'У нас питч для инвестора состоит из шести частей: Проблема, Рынок, Решение, Цифры, Команда и Следующий шаг.' })}
          izoh={tr(S2_IZOH[2])} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — AIRBNB (QVoqea; K12; Mentor kadr gapini aytadi, sahnada kadr nomi va jonli tasma; bashorat 2/3 da, ballsiz) =====
const S3_TAXMIN = [{ k: 'boshida', t: { uz: 'Boshida', ru: 'В начале' } }, { k: 'ortasida', t: { uz: "O'rtasida", ru: 'В середине' } }, { k: 'oxirida', t: { uz: 'Oxirida', ru: 'В конце' } }];
const AirbnbTasma = ({ b }) => (
  <div className="ip-ab">
    <div className="ip-ab-bosh"><Brend nom="Airbnb" rang={AIRBNB_RANG} /></div>
    <div className="ip-ab-tasma">
      {Array.from({ length: SLAYD_SONI }).map((_, i) => {
        const nom = (i < 2 && b >= 1) || (i >= 2 && i < 5 && b >= 2) ? SLAYD_NOM[i] : null;
        const savol = i >= 2 && i < 5 && b === 1;
        return (
          <span key={i} className={cxx('ip-ab-s', b >= 2 && (i === 2 || i === 4) && 'ajrat')} style={{ animationDelay: (i * 0.09) + 's' }}>
            {nom ? <b key={'n' + b} style={{ animationDelay: ((i % 3) * 0.12) + 's' }}>{tr(nom)}</b> : savol ? <em>?</em> : null}
          </span>
        );
      })}
    </div>
  </div>
);
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (k) => { if (taxmin || b !== 1) return; setTaxmin(k); setTimeout(() => setB(2), kamHarakat() ? 0 : 650); };
  const kadr = AIRBNB_KADR[b];
  const tx = S3_TAXMIN.find(t => t.k === taxmin);
  const davom = () => { if (b < 2) setB(b + 1); else onNext(); };
  const yorliq = <><Brend nom="Airbnb" rang={AIRBNB_RANG} /> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={b === 0 || done || (b === 1 && !!taxmin)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Voqea davomi (${b + 1}/3)`, ru: `Продолжение истории (${b + 1}/3)` })} onClick={davom} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Brend nom="Airbnb" rang={AIRBNB_RANG} /> investorlarga <A>qanday taqdimot ko'rsatgan?</A></>, ru: <>Какую презентацию <Brend nom="Airbnb" rang={AIRBNB_RANG} /> <A>показал инвесторам?</A></> })}
        nuqtalar={<>
          <Mentor key={'m' + b}>{brendAjrat(tr(kadr.m))}</Mentor>
          <div className="ip-nuq"><span className="ip-nuq-y">{yorliq}</span>{AIRBNB_KADR.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="ip-voqea">
          <span className="ip-voqea-h" key={'h' + b}>{tr(kadr.h)}</span>
          <Zoomable><AirbnbTasma b={b} /></Zoomable>
          {(b === 1 || (done && taxmin)) && ixchamBashorat(taxmin, <QBashorat yorliq={yorliq}
            savol={tr({ uz: 'Shu besh slayd ichida Jamoa qayerda turgan?', ru: 'Где среди этих пяти слайдов стояла Команда?' })}
            variantlar={S3_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) + (done && taxmin === v.k ? (v.k === 'oxirida' ? ' ✓' : ' ✕') : '') }))} tanlov={taxmin} onTanla={tanla} />)}
          {done && <QXulosa><XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'oxirida'} aslida={tr({ uz: 'shu besh slayd ichida — oxirida', ru: 'среди этих пяти слайдов — в конце' })} />}
            matn={tr({ uz: "Bu voqeada investorlar uchun taqdimotda bozor va jamoa slaydi ham bo'lgan.", ru: 'В этой истории в презентации для инвесторов были и слайды о рынке и команде.' })} /></QXulosa>}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 1) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Airbnb'dagidek", ru: 'Проверка · как у Airbnb' })}
    questionText="Airbnb'dagidek, zalga aytilgan pitchni investorga qanday moslaysiz?"
    question={tr({ uz: <h2 className="title h-ask">Airbnb'dagidek, zalga aytilgan pitchni <A>investorga qanday moslaysiz?</A></h2>, ru: <h2 className="title h-ask">Как, по примеру Airbnb, <A>адаптировать для инвестора</A> питч, сказанный залу?</h2> })}
    options={[
      { uz: 'Jonli demoni pitchdan olib tashlayman', ru: 'Уберу живое демо из питча' },
      { uz: "Bozor va Jamoa bo'laklarini qo'shaman", ru: 'Добавлю части «Рынок» и «Команда»' },
      { uz: "Har bo'lakka uzun matn va jadval qo'shaman", ru: 'Добавлю в каждую часть длинный текст и таблицу' },
      { uz: "Muammo bo'lagini pitch oxiriga ko'chiraman", ru: 'Перенесу часть «Проблема» в конец питча' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Airbnb taqdimotida ham bozor va jamoa slaydi bo\'lgan.', ru: 'В презентации Airbnb тоже были слайды о рынке и команде.' }}
    explainWrong={{
      0: { uz: "Jonli demo pitchda qoladi — u Yechim ichida.", ru: 'Живое демо остаётся в питче — оно внутри Решения.' },
      2: { uz: "Airbnb slaydlari oddiy bo'lgan, uzun emas.", ru: 'Слайды Airbnb были простыми, не длинными.' },
      3: { uz: 'Airbnb taqdimoti muammodan boshlangan.', ru: 'Презентация Airbnb начиналась с проблемы.' },
      default: { uz: 'Airbnb taqdimotida qaysi slaydlar bor edi?', ru: 'Какие слайды были в презентации Airbnb?' }
    }}
    vizual={<MiniOlti ajrat={['bozor', 'jamoa']} />} />
);

// ===== SCREEN 5 — BOZOR (QTushuncha; bashorat → 3 son kartasi ketma-ket: 1, 2 — Bozor bo'lagiga uchadi, 3 — silkinadi; telefonsiz — SABOQ 24) =====
const S5_TAXMIN = [{ k: 'ilova', t: { uz: 'Faqat ilovadagi sonlar', ru: 'Только числа из приложения' } }, { k: 'ikki', t: { uz: 'Ilova va guruhdagi sonlar', ru: 'Числа из приложения и группы' } }, { k: 'shahar', t: { uz: 'Butun shahar sonlari', ru: 'Числа по всему городу' } }];
const S5_IZOH = [
  { uz: "60 kishi — biz biladigan guruh a'zolari; hammasiga ilova kerakligi hali tekshirilmagan.", ru: '60 человек — участники известной нам группы; нужно ли приложение всем, ещё не проверено.' },
  { uz: "60 va 6 qo'shilmaydi: biri guruhdagi odamlar, biri ilovadagi tashkilotchilar.", ru: '60 и 6 не складываются: одно — люди в группе, другое — организаторы в приложении.' },
  { uz: "Manbasi yo'q son Bozorga yozilmaydi — «hali tekshirilmagan» deyiladi.", ru: 'Число без источника в Рынок не пишется — говорят «ещё не проверено».' }
];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(storedAnswer ? 3 : 0);
  const [band, setBand] = useState(null); // { i, tur: 'uch' | 'silk' }
  const done = n >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, n);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const kartaRef = useRef([]); const qatorRef = useRef([]);
  const [uch, setUch] = useState(null); // { i, x, y, w, h, dx, dy, bor }
  const bos = (i) => {
    if (!taxmin || i !== n || band) return;
    const km = kamHarakat();
    const k = kartaRef.current[i], q = qatorRef.current[i];
    if (km || !k || !q) { setN(i + 1); return; }
    const a = k.getBoundingClientRect(), t = q.getBoundingClientRect();
    setBand({ i, tur: 'uchmoqda' });
    setUch({ i, x: a.left, y: a.top, w: a.width, h: a.height, dx: t.left - a.left, dy: t.top + t.height / 2 - (a.top + a.height / 2), sx: Math.min(1, t.width / a.width), bor: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setUch(u => (u ? { ...u, bor: true } : u))));
    setTimeout(() => { setN(i + 1); setUch(null); }, 640);
    setTimeout(() => setBand(null), i < 2 ? 700 : 1150);
  };
  const matn = n === 0 ? null : <>
    <span key="g1" className={cxx(n === 1 && 'ip-yangi-q')}>{tr(BOZOR_SON[0].gap)}</span>
    {n >= 2 && <span key="g2" className={cxx(n === 2 && 'ip-yangi-q')}>{tr(BOZOR_SON[1].gap)}</span>}
    {n >= 3 && <> <span key="g3" className="ip-yangi-q">{tr(BOZOR_SON[2].gap)}</span></>}
  </>;
  const qatorlar = <div className="ip-bz">
    {BOZOR_SON.map((s, i) => (
      <div key={s.id} ref={el => { qatorRef.current[i] = el; }} className={cxx('ip-bz-q', i < n && (s.manba ? 'ok' : 'yoq'), i === n && taxmin && !done && 'kutadi', i === n - 1 && band && 'yangi', i === 2 && i === n - 1 && band && 'silk')}>
        {i < n ? <>
          <b>{tr(s.son)}</b><span className="ip-bz-kim">{tr(s.kim)}</span>
          <em>{s.manba ? <>{tr({ uz: 'manba:', ru: 'источник:' })} {tr(s.manba)}</> : tr({ uz: 'hali tekshirilmagan', ru: 'ещё не проверено' })}</em>
          <i>{s.manba ? '✓' : '?'}</i>
        </> : <span className="ip-bz-bosh">{i + 1}</span>}
      </div>
    ))}
  </div>;
  const sahna = <OltiBolakSahna fokus="bozor" investor={{ savollar: [{ matn: tr(HAKAM_SAVOL.bozor), ok: n >= 3 }] }}
    bolaklar={fokusOlti('bozor', { nom: tr(BOLAK_NOM.bozor), matn, holat: n >= 3 ? 'ok' : 'joriy', qosh: qatorlar })} />;
  const tx = S5_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · Bozor bo'lagi", ru: 'Понятие · часть «Рынок»' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Kartalarni bosing (${n}/3)`, ru: `Нажмите карточки (${n}/3)` })} onClick={onNext} /></>}>
      <div className="ip-teskari">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>Bozor bo'lagiga <A>qaysi sonlar yoziladi?</A></>, ru: <>Какие числа <A>пишутся в часть «Рынок»?</A></> })}
          mentor={<Mentor>{tr({ uz: "Son kartalarini birma-bir bosing: qaysi biri Bozor bo'lagiga tushishini ko'ring.", ru: 'Нажимайте карточки с числами по одной: смотрите, какая попадёт в часть «Рынок».' })}</Mentor>}
          bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Mentor misolida Bozorga qaysi sonlar yoziladi?', ru: 'Какие числа в примере Ментора пишутся в Рынок?' })} variantlar={S5_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
          harakat={!done && <div className="ip-harakat">
            <div className="ip-sonlar">
              {BOZOR_SON.map((s, i) => (
                <button key={s.id} ref={el => { kartaRef.current[i] = el; }} type="button" className={cxx('ip-son', taxmin && i === n && !band && 'cur', i < n && 'tushdi', band && band.i === i && 'jo')} disabled={!taxmin || i !== n || !!band} onClick={() => bos(i)}>
                  <b>{tr(s.son)}</b><span>{tr(s.kim)}</span>
                  <small>{tr({ uz: 'manba:', ru: 'источник:' })} {s.manba ? tr(s.manba) : tr({ uz: "yo'q", ru: 'нет' })}</small>
                  {i < n && <i className="ip-son-ok">✓</i>}
                </button>
              ))}
            </div>
            {n > 0 && <QIzoh key={n}>{tr(S5_IZOH[n - 1])}</QIzoh>}
            {ipucha && IPUCHA(tr({ uz: "Yoqilgan kartani bosing — Bozor bo'lagi qanday to'lishini ko'ring.", ru: 'Нажмите активную карточку — посмотрите, как заполняется часть «Рынок».' }))}
          </div>}
          vizual={sahna}
          xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'ikki'} aslida={tr({ uz: 'ilova va guruhdagi sonlar', ru: 'числа из приложения и группы' })} />}
            matn={tr({ uz: "Bu misolda Bozorda faqat manbasi bor sonlar turadi, qolgani — «hali tekshirilmagan».", ru: 'В этом примере в Рынке только числа с источником, остальное — «ещё не проверено».' })}
            izoh={tr(S5_IZOH[2])} />}
        />
      </div>
      {uch && <div className={cxx('ip-uchar', uch.bor && 'bor', !BOZOR_SON[uch.i].manba && 'yoq')} aria-hidden="true"
        style={{ left: uch.x, top: uch.y, width: uch.w, height: uch.h, transform: uch.bor ? 'translate(' + uch.dx + 'px,' + uch.dy + 'px) scale(' + Math.max(0.55, uch.sx * 0.9) + ')' : 'none' }}>
        <b>{tr(BOZOR_SON[uch.i].son)}</b><span>{tr(BOZOR_SON[uch.i].kim)}</span>
      </div>}
    </Stage>
  );
};

// ===== SCREEN 6 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s6 = 3; ikkinchi misol — kitob almashish ilovasi, P-002) =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Bozor bo'lagi", ru: 'Проверка · часть «Рынок»' })}
    questionText="Kitob almashish ilovasi: shahar sonini topolmadingiz. Bozorda nima deysiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish ilovasi: shahar sonini topolmadingiz. <A>Bozorda nima deysiz?</A></h2>, ru: <h2 className="title h-ask">Приложение для обмена книгами: число по городу вы не нашли. <A>Что скажете в Рынке?</A></h2> })}
    options={[
      { uz: "«Shahardagi minglab o'quvchiga bu kerak» deyman", ru: '«Это нужно тысячам школьников города», — скажу' },
      { uz: "«Yil oxirigacha hamma maktabga yetamiz» deyman", ru: '«К концу года дойдём до всех школ», — скажу' },
      { uz: "«Bozor haqida pitchda gapirmayman» deyman", ru: '«О рынке в питче говорить не буду», — скажу' },
      { uz: "«Chatda 120 kishi, shahar hali noma'lum» deyman", ru: '«В чате 120 человек, город пока неизвестен», — скажу' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Manbasi bor son aytiladi, qolgani — hali tekshirilmagan.", ru: 'Называется число с источником, остальное — ещё не проверено.' }}
    explainWrong={{
      0: { uz: "Bu son qayerdan? Manbasiz son Bozorga yozilmaydi.", ru: 'Откуда это число? Число без источника в Рынок не пишется.' },
      1: { uz: "Bu va'da — bugun bilgan soningiz qancha?", ru: 'Это обещание — какое число вы знаете сегодня?' },
      2: { uz: "Bozor bo'lagi «qancha odamga kerak?» savoliga javob.", ru: 'Часть «Рынок» отвечает на вопрос «скольким людям нужно?».' },
      default: { uz: "Mentor boshqa mahallalar haqida nima degan edi?", ru: 'Что Ментор сказал о других махаллях?' }
    }}
    vizual={<MiniBolak id="bozor" />} />
);

// ===== SCREEN 7 — JAMOA (QTushuncha keng; bashorat → 3 tugma: rol yorliqlari · agent — asbob · sinab ko'rganlar alohida qatorda; odam figurasi yo'q — SABOQ P1) =====
const S7_TUGMA = [{ uz: 'Kim nima qildi', ru: 'Кто что сделал' }, { uz: 'Agent', ru: 'Агент' }, { uz: "Sinab ko'rganlar", ru: 'Кто пробовал' }];
const S7_TAXMIN = [{ k: 'bitta', t: { uz: 'Bitta', ru: 'Один' } }, { k: 'uchta', t: { uz: 'Uchta', ru: 'Трое' } }, { k: 'beshta', t: { uz: 'Beshta', ru: 'Пятеро' } }];
const S7_IZOH = [null,
  { uz: "Agent — asbob, jamoa a'zosi emas: talabni Mentor yozdi, natijani o'zi tekshirdi.", ru: 'Агент — инструмент, а не член команды: требование написал Ментор, результат проверил сам.' },
  { uz: "Sinab ko'rgan real odamlar ham aytiladi, lekin ular jamoa a'zosi deb aytilmaydi.", ru: 'Реальные люди, которые пробовали, тоже называются, но не как члены команды.' }];
const ROL_YORLIQ = [{ uz: "g'oya", ru: 'идея' }, { uz: 'mahsulot', ru: 'продукт' }, { uz: 'kod', ru: 'код' }];
const Asbob = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7 6.3 21l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const matn = q === 0 ? null : <span key={'j' + Math.min(q, 2)} className="ip-yangi-q">{q === 1 ? tr({ uz: "Men — g'oya, mahsulot va kod.", ru: 'Я — идея, продукт и код.' }) : tr(JAMOA_PITCH.birinchi.jamoa)}{q >= 3 && <> {tr({ uz: "Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.", ru: 'Пробовали — 6 организаторов и игроки.' })}</>}</span>;
  const panel = <div className="ip-jm">
    <span className="ip-rol">{tr({ uz: 'men', ru: 'я' })}</span>
    {q >= 1 && <span className="ip-jm-y">{ROL_YORLIQ.map((r, i) => <span key={i} style={{ animationDelay: (i * 0.12) + 's' }}>{tr(r)}</span>)}
      {q >= 2 && <span className="ip-asbob"><Asbob />{tr({ uz: 'agent', ru: 'агент' })}</span>}</span>}
  </div>;
  const sinab = q >= 3 && <div className="ip-sinab"><span>{tr({ uz: "sinab ko'rganlar", ru: 'пробовали' })}</span>{Array.from({ length: 6 }).map((_, i) => <i key={i} style={{ animationDelay: (0.1 + i * 0.07) + 's' }} />)}</div>;
  const sahna = <OltiBolakSahna fokus="jamoa" investor={{ savollar: [{ matn: tr(HAKAM_SAVOL.jamoa), ok: q >= 3 }] }}
    bolaklar={fokusOlti('jamoa', { nom: tr(BOLAK_NOM.jamoa), matn, holat: q >= 3 ? 'ok' : 'joriy', qosh: panel })} ostida={sinab} />;
  const tx = S7_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · Jamoa bo'lagi", ru: 'Понятие · часть «Команда»' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Mahsulotni kim qilayotganini <A>qanday aytasiz?</A></>, ru: <>Как сказать, <A>кто делает продукт?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va Jamoa bo'lagi qanday yozilishini ko'ring.", ru: 'Нажимайте кнопки по одной и смотрите, как пишется часть «Команда».' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Mentor misolida mahsulotni nechta odam qilyapti?', ru: 'Сколько человек делает продукт в примере Ментора?' })} variantlar={S7_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="ip-harakat">
          <Qadamlar3 nomlar={S7_TUGMA} q={q} faol={!!taxmin} onBos={() => setQ(x => Math.min(3, x + 1))} />
          {q > 0 && S7_IZOH[q - 1] && <QIzoh key={q}>{tr(S7_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — Jamoa bo'lagiga nima yozilishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, что пишется в часть «Команда».' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'bitta'} aslida={tr({ uz: 'bitta', ru: 'один' })} />}
          matn={tr({ uz: "Bu misolda Jamoa bo'lagida bitta odam: kim nima qilgani rost aytilgan, yolg'on rol yo'q.", ru: 'В этом примере в Команде один человек: кто что сделал, сказано честно, выдуманных ролей нет.' })}
          izoh={tr(S7_IZOH[2])} />}
      />
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s8 = 0) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Jamoa bo'lagi", ru: 'Проверка · часть «Команда»' })}
    questionText="Mahsulotni yolg'iz qurdingiz. Jamoa bo'lagida nima deysiz?"
    question={tr({ uz: <h2 className="title h-ask">Mahsulotni yolg'iz qurdingiz. <A>Jamoa bo'lagida nima deysiz?</A></h2>, ru: <h2 className="title h-ask">Вы построили продукт в одиночку. <A>Что скажете в части «Команда»?</A></h2> })}
    options={[
      { uz: "«Men — g'oya va kod, agent bilan»", ru: '«Я — идея и код, с агентом»' },
      { uz: "«Jamoamiz besh kishi, hammasi dasturchi»", ru: '«Нас в команде пятеро, все программисты»' },
      { uz: "«Agent — jamoamizning ikkinchi a'zosi»", ru: '«Агент — второй член нашей команды»' },
      { uz: "«Jamoamiz kichik, lekin juda kuchli»", ru: '«Команда у нас маленькая, но очень сильная»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Jamoa bo'lagida kim nima qilgani rost aytiladi.", ru: 'В Команде честно говорится, кто что сделал.' }}
    explainWrong={{
      1: { uz: "Bu odamlar yo'q — Jamoa bo'lagida faqat bor odamlar.", ru: 'Этих людей нет — в Команде только те, кто есть.' },
      2: { uz: "Agent — asbob, jamoa a'zosi emas.", ru: 'Агент — инструмент, а не член команды.' },
      3: { uz: "Bu maqtov — kim nima qilganini ayting.", ru: 'Это похвала — скажите, кто что сделал.' },
      default: { uz: "Mentor Jamoa bo'lagida o'zini qanday aytgan edi?", ru: 'Как Ментор назвал себя в части «Команда»?' }
    }}
    vizual={<MiniBolak id="jamoa" />} />
);

// ===== SCREEN 9 — KEYINGI QADAM (QTushuncha keng; bashorat → 3 tugma: hisoblagich 44 → 51 · keyingi ish · aniq so'rov; «Investitsiya summasi» kartasi chizilib chiqib ketadi) =====
const S9_TUGMA = [{ uz: 'Maqsad 50', ru: 'Цель 50' }, { uz: 'Keyingi ish', ru: 'Следующее дело' }, { uz: "Aniq so'rov", ru: 'Точная просьба' }];
const S9_TAXMIN = [{ k: 'bitta', t: { uz: 'Bitta', ru: 'Одну' } }, { k: 'ikkita', t: { uz: 'Ikkita', ru: 'Две' } }, { k: 'uchta', t: { uz: 'Uchta', ru: 'Три' } }];
const S9_IZOH = [
  { uz: "12-Moduldagi sonli qadam 51 ga yetdi — endi Keyingi qadam yangilanadi.", ru: 'Числовой шаг из 12-го модуля дошёл до 51 — теперь Следующий шаг обновляется.' },
  null,
  { uz: "Bu kursda pul so'ralmaydi — aniq so'rov: tanishtirish, maslahat yoki sinash joyi.", ru: 'На этом курсе деньги не просят — точная просьба: познакомить, посоветовать или дать место для проверки.' }];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [son, setSon] = useState(storedAnswer ? 51 : 44);
  const [inv, setInv] = useState(false);
  const done = q >= 3;
  const tugadi = useTugadi(done, 2900, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (q !== 3 || storedAnswer) return undefined; setInv(true); const t = setTimeout(() => setInv(false), kamHarakat() ? 1200 : 2700); return () => clearTimeout(t); }, [q]); // eslint-disable-line
  const panel = <div className="ip-kq">
    {q >= 1 && <div className="ip-sanoq">
      <span className="ip-sanoq-y">{tr({ uz: 'Foydalanuvchilar', ru: 'Пользователи' })}</span>
      {storedAnswer ? <b className="ip-sanoq-n">51</b> : <Sanagich dan={44} gacha={51} onSon={setSon} />}
      <span className="ip-sanoq-bar"><i style={{ width: ((son / 60) * 100) + '%' }} /><b style={{ left: ((50 / 60) * 100) + '%' }} /><small style={{ left: ((50 / 60) * 100) + '%' }}>50</small></span>
    </div>}
    {q >= 2 && <span className="ip-kq-yangi">{tr(JAMOA_PITCH.birinchi.keyingi)}{q >= 3 && <> <span className="ip-yangi-q">{tr({ uz: "Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.", ru: 'Одна просьба к вам: познакомьте с владельцами площадок в махалле.' })}</span></>}</span>}
    {q >= 2 && <span className="ip-kq-teg">{tr({ uz: "«Doimiy o'yin» — Pro'dagi qulaylik", ru: '«Постоянная игра» — удобство в Pro' })}</span>}
    {inv && <span className="ip-inv">{tr({ uz: 'Investitsiya summasi', ru: 'Сумма инвестиций' })}</span>}
  </div>;
  const eski = <span key="eski" className={cxx(q >= 1 && 'ip-kq-eski')}>{tr(JAMOA_PITCH_12.keyingi)}</span>;
  const sahna = <OltiBolakSahna fokus="keyingi" investor={{ savollar: [{ matn: tr(HAKAM_SAVOL.keyingi), ok: q >= 3 }] }}
    bolaklar={fokusOlti('keyingi', { nom: tr(BOLAK_NOM.keyingi), matn: eski, holat: q >= 3 ? 'ok' : 'joriy', qosh: panel })} />;
  const tx = S9_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Keyingi qadam', ru: 'Понятие · Следующий шаг' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Pitch oxirida <A>hakamdan nima so'raysiz?</A></>, ru: <>О чём вы <A>попросите судью</A> в конце питча?</> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va Keyingi qadam bo'lagi qanday o'zgarishini ko'ring.", ru: 'Нажимайте кнопки по одной и смотрите, как меняется часть «Следующий шаг».' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Mentor hakamdan nechta narsa so'raydi?", ru: 'О скольких вещах Ментор просит судью?' })} variantlar={S9_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="ip-harakat">
          <Qadamlar3 nomlar={S9_TUGMA} q={q} faol={!!taxmin} onBos={() => setQ(x => Math.min(3, x + 1))} />
          {q > 0 && S9_IZOH[q - 1] && <QIzoh key={q}>{tr(S9_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — Keyingi qadam qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняется Следующий шаг.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'bitta'} aslida={tr({ uz: 'bitta', ru: 'одну' })} />}
          matn={tr({ uz: "Bu misolda Keyingi qadam — keyingi ish va bitta aniq so'rov: pul emas, tanishtirish.", ru: 'В этом примере Следующий шаг — следующее дело и одна точная просьба: не деньги, а знакомство.' })}
          izoh={tr(S9_IZOH[2])} />}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — MENTOR QORALAMASI (tartib-mashqi, ballsiz; MD «QTartib», E 44) =====
// Qolip QTartib aralash tartibni tasodifiy beradi va bo'lakni bosganda birinchi bo'sh uyaga qo'yadi; MD esa qat'iy aralash tartib,
// «avval gap, so'ng uya» va har noto'g'ri joylashda silkinish talab qiladi — shuning uchun mexanika shu yerda, ko'rinish qolipning q-dd klasslari bilan (qolip taklifi hisobotda).
const TARTIB_ARALASH = ['jamoa', 'muammo', 'keyingi', 'bozor', 'raqamlar', 'yechim'];
const TartibJoy = ({ yechildi, onYechildi, onXato, onSoni }) => {
  const [joy, setJoy] = useState(() => (yechildi ? BOLAK_ID.slice() : BOLAK_ID.map(() => null)));
  const [xato, setXato] = useState(null); // { k, i } — oxirgi xato joy
  const [ust, setUst] = useState(null); // sudrashda ustidagi uya
  const pool = TARTIB_ARALASH.filter(id => !joy.includes(id));
  const joriy = pool[0] || null;
  const toliq = joy.every(Boolean);
  useEffect(() => { if (onSoni) onSoni(joy.filter(Boolean).length); }, [joy]); // eslint-disable-line
  const qoy = (i) => {
    if (!joriy || joy[i]) return;
    setUst(null);
    if (BOLAK_ID[i] === joriy) {
      const nj = joy.slice(); nj[i] = joriy; setJoy(nj); setXato(null);
      if (nj.every(Boolean) && onYechildi) onYechildi();
    } else {
      setXato(x => ({ k: (x ? x.k : 0) + 1, i })); if (onXato) onXato();
    }
  };
  const dr = (i) => (joriy && !joy[i] ? {
    onDragOver: (e) => { e.preventDefault(); if (ust !== i) setUst(i); },
    onDragLeave: () => setUst(u => (u === i ? null : u)),
    onDrop: (e) => { e.preventDefault(); qoy(i); }
  } : {});
  return (
    <div className="ip-tj">
      <div className="q-dd-slots ip-tj-uyalar">
        {joy.map((id, i) => (
          <button key={i} type="button" className={cxx('q-dd-slot', 'ip-uya', id && 'filled ok', !id && joriy && 'kutadi', ust === i && 'ust', xato && xato.i === i && !id && 'bad')} disabled={!!id || !joriy} onClick={() => qoy(i)} {...dr(i)}>
            <span className="q-dd-n">{i + 1}</span>
            {id ? <span className="ip-uya-gap">{tr(JAMOA_PITCH.birinchi[id])}</span> : <span className="q-dd-hint">{tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}</span>}
            {id && toliq && <em className="ip-uya-nom" style={{ animationDelay: (i * 0.08) + 's' }}>{tr(BOLAK_NOM[id])}</em>}
          </button>
        ))}
      </div>
      {joriy && <div className="ip-tj-ong">
        <div className="ip-dasta">
          {pool.length > 1 && <i className="ip-dasta-q q1" aria-hidden="true" />}
          {pool.length > 2 && <i className="ip-dasta-q q2" aria-hidden="true" />}
          <div key={joriy + (xato ? xato.k : 0)} className={cxx('ip-gap', xato && 'silk')} draggable
            onDragStart={(e) => { try { e.dataTransfer.setData('text/plain', joriy); e.dataTransfer.effectAllowed = 'move'; } catch { /* sudrash ishlamasa — bosish yetadi */ } }}>
            <span className="ip-gap-n">{6 - pool.length + 1}{NB}/{NB}6</span>
            <span className="ip-gap-t">«{tr(JAMOA_PITCH.birinchi[joriy])}»</span>
          </div>
        </div>
        {xato && <QXato key={xato.k}>{tr({ uz: "Bu joyga boshqa bo'lak keladi: tartibni eslang.", ru: 'Сюда встаёт другая часть: вспомните порядок.' })}</QXato>}
      </div>}
    </div>
  );
};
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const xatoRef = useRef(false);
  const [xatoBor, setXatoBor] = useState(false);
  const [done, setDone] = useState(!!storedAnswer);
  const [n, setN] = useState(storedAnswer ? 6 : 0);
  const tugadi = useTugadi(done, 1600, !!storedAnswer);
  const onXato = () => { xatoRef.current = true; setXatoBor(true); if (achMiss) achMiss.miss(screen); };
  const yechildi = () => {
    if (done) return; setDone(true);
    const first = !xatoRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'practice', screenIdx: screen, question: "Mentor qoralamasini to'g'ri tartibga qo'ying", correct: first, firstAttemptCorrect: first, solved: true, picked: true });
  };
  const sahna = done && <OltiBolakSahna className="katta" bolaklar={mentorOlti('yozildi')} taymer={{ rejim: 'olti', tol: 'yur', sj: true, kechik: 0.3 }} />;
  return (
    <Stage eyebrow={tr({ uz: 'Mashq · Mentor qoralamasi', ru: 'Упражнение · черновик Ментора' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Gaplarni joylang (${n}/6)`, ru: `Расставьте фразы (${n}/6)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Mentor qoralamasini <A>to'g'ri tartibga qo'ying.</A></>, ru: <>Расставьте черновик Ментора <A>в правильном порядке.</A></> })}
        mentor={<Mentor>{tr({ uz: "Gapni o'qing va chapdagi o'z joyini bosing.", ru: 'Прочитайте фразу и нажмите на её место слева.' })}</Mentor>}
        harakat={<div className="ip-harakat">
          <TartibJoy yechildi={!!storedAnswer} onYechildi={yechildi} onXato={onXato} onSoni={setN} />
          {!isMentor && !done && <p className="ip-nishon-q">{xatoBor ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ matn={tr({ uz: "Bu misolda olti bo'lakning har birida bitta-ikkita qisqa gap bor.", ru: 'В этом примере в каждой из шести частей одна-две короткие фразы.' })}
          izoh={tr({ uz: "Raqamlar bo'lagidagi halol gap: 3 yozma tasdiq — bu hali to'lov emas.", ru: 'Честная фраза в Цифрах: 3 письменных подтверждения — это ещё не оплата.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 11 — PITCH QORALAMASI (QMustaqil, USTAXONA — bittadan karta, olti bo'lak; E 43, E 53) · yozadi pm-m12d1-pitch · nishonlar sixParts, freshNumbers, clearAsk =====
const S11_KULRANG = {
  muammo: { uz: 'Muammo gapi va bitta dalil: son yoki kuzatuv.', ru: 'Фраза о проблеме и один довод: число или наблюдение.' },
  bozor: { uz: 'Har son manbasi bilan: guruh, chat yoki Database.', ru: 'Каждое число — с источником: группа, чат или Database.' },
  yechim: { uz: "Jonli demo shu bo'lak ichida — 12-Moduldagidek ikki qurilmada.", ru: 'Живое демо — внутри этой части, как в 12-м модуле, на двух устройствах.' },
  raqamlar: { uz: 'Eng yangi sonni sanoq sahifasidan oling va sanasini yozing.', ru: 'Возьмите самое свежее число со страницы подсчёта и напишите дату.' },
  jamoa: { uz: 'Rol bilan yozing, ismsiz: men, sinfdoshim; agent — asbob sifatida.', ru: 'Пишите ролями, без имён: я, одноклассник; агент — как инструмент.' },
  keyingi: { uz: "Keyingi ish va bitta aniq so'rov: tanishtirish, maslahat yoki sinash joyi.", ru: 'Следующее дело и одна точная просьба: познакомить, посоветовать или дать место для проверки.' }
};
const S11_XATO = {
  bosh: { uz: "Bu bo'lakka bitta-ikkita gap yozing.", ru: 'Напишите в эту часть одну-две фразы.' },
  uzun: { uz: "160 belgidan oshdi — bitta gapni qisqartiring.", ru: 'Больше 160 знаков — сократите одну фразу.' },
  qavs: { uz: "{…} o'rniga o'zingiznikini yozing.", ru: 'Вместо {…} напишите своё.' },
  pii: { uz: 'Pitchga telefon, akkaunt va havola yozilmaydi.', ru: 'В питч не пишут телефон, аккаунт и ссылку.' },
  umumiy: { uz: "Son qayerdan? Manbasini yozing yoki «hali tekshirilmagan».", ru: 'Откуда число? Напишите источник или «ещё не проверено».' },
  texno: { uz: "Bu texnologiya — mahsulot odamga nima beradi?", ru: 'Это технология — а что продукт даёт человеку?' },
  tasdiq: { uz: "Tasdiq hali to'lov emas — buni gapda ayting.", ru: 'Подтверждение — ещё не оплата: скажите это во фразе.' },
  agent: { uz: "Agent — asbob, jamoa a'zosi emas.", ru: 'Агент — инструмент, а не член команды.' },
  pul: { uz: "Bu kursda pul so'ralmaydi — bitta aniq so'rov yozing.", ru: 'На этом курсе деньги не просят — напишите одну точную просьбу.' },
  vada: { uz: "Bu va'da — keyingi haftada aynan nima qilasiz?", ru: 'Это обещание — что именно сделаете на следующей неделе?' }
};
const S11_YORDAM_OXIR = { uz: "Sonlaringiz kichik bo'lsa ham — o'zingizniki: o'ylab topilmaydi.", ru: 'Пусть числа маленькие — зато ваши: их не выдумывают.' };
const S11_DEMO = { uz: 'Jonli demo — shu gapdan keyin.', ru: 'Живое демо — после этой фразы.' };
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const oldin = useMemo(() => oldindanOl(), []);
  const hisobot = useMemo(() => hisobotOl(), []);
  const tasdiqN = useMemo(() => tasdiqSoni(), []);
  const bor = Object.keys(oldin).length > 0;
  const [saq, setSaq] = useState(() => { const p = pitchOl(); return Object.fromEntries(BOLAK_ID.map(id => [id, p && typeof p.bolaklar[id] === 'string' && p.bolaklar[id].trim() ? p.bolaklar[id] : null])); });
  const [qora, setQora] = useState(() => Object.fromEntries(BOLAK_ID.map(id => [id, saq[id] ?? oldin[id] ?? ''])));
  const [joriy, setJoriy] = useState(() => BOLAK_ID.find(id => !saq[id]) || null);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [uchdi, setUchdi] = useState(null);
  const [uchish, setUchish] = useState(false);
  const [tanla, setTanla] = useState(0);
  const inpRef = useRef(null);
  const n = saqlanganSoni(saq);
  const toliq = n === 6;
  // «So'rov qo'shish» dan keyin {…} belgilanadi — yozish shu joyni almashtiradi
  useEffect(() => {
    if (!tanla || !inpRef.current) return;
    const el = inpRef.current; const i = el.value.indexOf('{…}');
    if (i >= 0) { el.focus(); el.setSelectionRange(i, i + 3); }
  }, [tanla]);
  const och = (id) => { if (uchish) return; setJoriy(id); setXato(null); setYumshoq(null); setYordam(false); };
  const qosh = (q, bosh) => { if (!joriy) return; setQora(d => { const v = String(d[joriy] || '').trim(); return { ...d, [joriy]: v ? v + ' ' + q : (bosh || q) }; }); setXato(null); setTanla(t => t + 1); };
  const saqla = () => {
    if (!joriy || uchish) return;
    const id = joriy; const matn = String(qora[id] || '').trim(); const t = tekshir(id, matn);
    if (t && (t.blok || !(yumshoq && yumshoq.id === id && yumshoq.x === t.x && yumshoq.matn === matn))) { setXato(t); if (!t.blok) setYumshoq({ id, x: t.x, matn }); if (t.x === 'qavs') setTanla(k => k + 1); return; }
    const manba = oldin[id] ? (matn === oldin[id] ? '12-modul' : 'tahrir') : 'yangi';
    if (!isMentor) pitchYoz(id, matn, manba);
    const yangi = { ...saq, [id]: matn };
    const earn = achMiss && achMiss.earn;
    if (earn && id === 'raqamlar' && manba !== '12-modul') earn('freshNumbers');
    if (earn && id === 'keyingi' && pulVadasiz(matn)) earn('clearAsk');
    if (id === 'keyingi' && pulVadasiz(matn) && _live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + 50 + screen, 'practice', 0, true, 0);
    const olti = BOLAK_ID.every(k => yangi[k]);
    if (olti && !toliq) {
      if (earn) earn('sixParts');
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'pitch', solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    setXato(null); setYumshoq(null); setYordam(false);
    const keyingi = BOLAK_ID.slice(BOLAK_ID.indexOf(id) + 1).find(k => !yangi[k]) || BOLAK_ID.find(k => !yangi[k]) || null;
    setUchish(true);
    setTimeout(() => { setSaq(yangi); setUchdi(id); setJoriy(keyingi); setUchish(false); setTimeout(() => setUchdi(null), 1100); }, kamHarakat() ? 0 : 380);
  };
  const strip = <div className="ip-strip">
    <span className="ip-strip-y">{tr({ uz: 'Pitchim', ru: 'Мой питч' })} · {n}/6</span>
    {BOLAK_ID.map((id, i) => <QChip key={id} holat={joriy === id ? 'on' : saq[id] ? 'ok' : undefined} className={cxx('ip-tab', uchdi === id && 'yangi')} onClick={() => och(id)}><i>{saq[id] ? '✓' : i + 1}</i>{tr(BOLAK_NOM[id])}</QChip>)}
  </div>;
  const ikkinchi = joriy === 'bozor' ? [<QTugma key="b" ikkinchi onClick={() => qosh(tr({ uz: 'Qolganini hali tekshirmaganman.', ru: 'Остальное я ещё не проверял.' }), tr({ uz: 'Sonini hali tekshirmaganman.', ru: 'Число я ещё не проверял.' }))}>{tr({ uz: 'Hali tekshirilmagan', ru: 'Ещё не проверено' })}</QTugma>]
    : joriy === 'raqamlar' ? [
      hisobot && <QTugma key="h" ikkinchi onClick={() => qosh(hisobot.soni + ' ' + tr({ uz: "kishi ro'yxatdan o'tgan", ru: 'человек зарегистрировались' }) + (hisobot.sana ? ' (' + hisobot.sana + ').' : '.'))}>+ {hisobot.soni} {tr({ uz: "kishi ro'yxatdan o'tgan", ru: 'человек зарегистрировались' })}{hisobot.sana ? ' (' + hisobot.sana + ')' : ''}</QTugma>,
      tasdiqN > 0 && <QTugma key="t" ikkinchi onClick={() => qosh(tasdiqN + ' ' + tr({ uz: "yozma tasdiq — bu hali to'lov emas.", ru: 'письменных подтверждения — это ещё не оплата.' }))}>+ {tasdiqN} {tr({ uz: "yozma tasdiq — bu hali to'lov emas", ru: 'письменных подтверждения — это ещё не оплата' })}</QTugma>].filter(Boolean)
      : joriy === 'keyingi' ? [<QTugma key="k" ikkinchi onClick={() => qosh(tr({ uz: "Sizdan bitta so'rov: {…}", ru: 'Одна просьба к вам: {…}' }))}>{tr({ uz: "So'rov qo'shish", ru: 'Добавить просьбу' })}</QTugma>] : [];
  const matn = joriy ? String(qora[joriy] || '') : '';
  const uz = matn.trim().length;
  const karta = joriy && (
    <div key={joriy} className={cxx('ip-karta', xato && xato.blok && 'err', uchish && 'uch')}>
      <span className="q-yorliq">{BOLAK_ID.indexOf(joriy) + 1} · {tr(BOLAK_NOM[joriy])}</span>
      <div className={cxx('ip-maydon', !uz && 'chorla')}>
        <i className="ip-maydon-n">{BOLAK_ID.indexOf(joriy) + 1}</i>
        <textarea ref={inpRef} className={cxx('ip-inp', xato && 'err', tanla && 'qoshildi')} key={'t' + tanla} rows={3} maxLength={400} value={matn} placeholder={tr(HAKAM_SAVOL[joriy])} aria-label={tr(BOLAK_NOM[joriy])}
          onChange={(e) => { const v = e.target.value; setQora(d => ({ ...d, [joriy]: v })); setXato(null); }} />
        <span className={cxx('ip-sanoq-b', uz > 160 && 'oshdi')}>{uz}{NB}/{NB}160</span>
      </div>
      {xato && <QXato key={xato.x}>{tr(S11_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && <p className="ip-yana">{tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' })}</p>}
      <p className="ip-kulrang">{tr(S11_KULRANG[joriy])}</p>
      {yordam && <div className="ip-yordam fade-step">
        <p>{tr({ uz: 'Mentor misolida:', ru: 'В примере Ментора:' })} «{tr(JAMOA_PITCH[joriy])}»{joriy === 'yechim' && <> {tr(S11_DEMO)}</>}</p>
        <p>{tr(S11_YORDAM_OXIR)}</p>
      </div>}
      <div className="ip-karta-tug">
        <QTugma className={cxx(uz > 0 && 'ip-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        {ikkinchi}
        <QTugma ikkinchi className="ip-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
  const yakuniy = toliq && !joriy;
  const forma = isMentor
    ? <div className="ip-fokus"><Zoomable><OltiBolakSahna telefon telSon={9} yorliq={tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} bolaklar={mentorOlti('yozildi')} taymer={{ rejim: 'olti', tol: 'toliq', sj: true }} /></Zoomable>
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: "Olti bo'lakni yozganlar", ru: 'Написали шесть частей' }} />
      <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 50 + screen} yorliq={{ uz: "Keyingi qadamda pul so'zi yo'qlar", ru: 'Без слова «деньги» в Следующем шаге' }} /></div>
    : yakuniy
      ? <div className="ip-fokus"><Zoomable><OltiBolakSahna yorliq={tr({ uz: 'Pitchim', ru: 'Мой питч' }) + ' · 6/6'} bolaklar={BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: saq[id], holat: uchdi === id ? 'yangi' : 'yozildi', tahrir: () => och(id) }))} taymer={{ rejim: 'olti', tol: 'yur', sj: true, kechik: 0.3 }} /></Zoomable>
        <QXulosa>{tr({ uz: "Olti bo'lak yozildi — bu pitchingizning birinchi qoralamasi.", ru: 'Шесть частей написаны — это первый черновик вашего питча.' })}</QXulosa></div>
      : karta;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n * 10 + (joriy ? BOLAK_ID.indexOf(joriy) : 9)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={toliq && !joriy} disabled={!toliq && !isMentor} label={toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Olti bo'lakni yozing (${n}/6)`, ru: `Напишите шесть частей (${n}/6)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Investor uchun pitchingizni <A>olti bo'lakka yozing.</A></>, ru: <>Напишите свой питч для инвестора <A>в шести частях.</A></> })}
        mentor={<Mentor>{isMentor ? tr({ uz: "Har kartaga avval bitta gap yozib «Saqlash»ni bosing — manba va sonni keyin qo'shasiz.", ru: 'Сначала напишите в каждую карточку одну фразу и нажмите «Сохранить» — источник и число добавите потом.' }) : bor
          ? tr({ uz: "12-Moduldagi pitchingizdan bor bo'laklar qo'yildi: har kartani tekshirib, «Saqlash»ni bosing.", ru: 'Части из вашего питча 12-го модуля уже вставлены: проверьте каждую карточку и нажмите «Сохранить».' })
          : tr({ uz: "Har kartaga avval bitta gap yozib «Saqlash»ni bosing — manba va sonni keyin qo'shasiz.", ru: 'Сначала напишите в каждую карточку одну фразу и нажмите «Сохранить» — источник и число добавите потом.' })}</Mentor>}
        qadamlar={!isMentor && !yakuniy && strip}
        forma={forma}
      />
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s12 = 2) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Bu kursda Keyingi qadam bo'lagida nima aytasiz?"
    question={tr({ uz: <h2 className="title h-ask">Bu kursda Keyingi qadam bo'lagida <A>nima aytasiz?</A></h2>, ru: <h2 className="title h-ask">Что вы скажете на этом курсе <A>в части «Следующий шаг»?</A></h2> })}
    options={[
      { uz: 'Mahsulot uchun kerakli pul summasini aytaman', ru: 'Назову нужную продукту сумму денег' },
      { uz: "Tez orada hamma ishlatishini va'da qilaman", ru: 'Пообещаю, что скоро пользоваться будут все' },
      { uz: "Keyingi ishni va bitta aniq so'rovni aytaman", ru: 'Скажу следующее дело и одну точную просьбу' },
      { uz: 'Rahmat aytib, pitchni shu yerda tugataman', ru: 'Скажу спасибо и на этом закончу питч' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Keyingi qadam — keyingi ish va bitta aniq so'rov, pul emas.", ru: 'Следующий шаг — следующее дело и одна точная просьба, не деньги.' }}
    explainWrong={{
      0: { uz: "Bu kursda pul so'ralmaydi — aniq so'rov aytiladi.", ru: 'На этом курсе деньги не просят — говорят точную просьбу.' },
      1: { uz: "Bu va'da — keyingi haftada aynan nima qilasiz?", ru: 'Это обещание — что именно сделаете на следующей неделе?' },
      3: { uz: "Keyingi qadam bo'sh qoldi — keyin nima qilasiz?", ru: 'Следующий шаг остался пустым — что будете делать дальше?' },
      default: { uz: 'Mentor Keyingi qadamda nimani aytgan edi?', ru: 'Что Ментор сказал в Следующем шаге?' }
    }}
    vizual={<MiniBolak id="keyingi" />} />
);

// ===== 🏅 BADGES (nishonlar, 4 — PM: «!» bilan, 9.23) — faqat ish qilingan ekranlarda (S-034) =====
const ACHIEVEMENTS = {
  rightOrder: { icon: '🧩', name: 'Right Order!', desc: { uz: 'Qoralamani birinchi urinishda tartibladingiz', ru: 'Вы расставили черновик с первой попытки' } },
  sixParts: { icon: '📝', name: 'Six Parts!', desc: { uz: "Pitch qoralamasini olti bo'lakka yozdingiz", ru: 'Вы написали черновик питча из шести частей' } },
  freshNumbers: { icon: '🔢', name: 'Fresh Numbers!', desc: { uz: "Raqamlar bo'lagini yangilab yozdingiz", ru: 'Вы обновили часть «Цифры»' } },
  clearAsk: { icon: '🎯', name: 'Clear Ask!', desc: { uz: "Keyingi qadamni pul va va'dasiz yozdingiz", ru: 'Вы написали Следующий шаг без денег и обещаний' } }
};
// Ekran id → nishon (birinchi urinish). 11-ekran nishonlari — Screen11 ichida (saqlashga qarab), AchMissCtx.earn orqali.
const ACH_TRIGGERS = { tartib: 'rightOrder' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 6, 8, 12 — q22)
const Q_LABELS = {
  4: { uz: "1 — Investor uchun nima qo'shiladi", ru: '1 — Что добавляется для инвестора' },
  6: { uz: '2 — Bozorda qaysi son', ru: '2 — Какое число в Рынке' },
  8: { uz: "3 — Jamoa bo'lagi", ru: '3 — Часть «Команда»' },
  12: { uz: '4 — Keyingi qadam', ru: '4 — Следующий шаг' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'pitch', ru: 'питч' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "bo'lak", ru: 'часть' }, l: 85, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'bozor', ru: 'рынок' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'jamoa', ru: 'команда' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'hakam', ru: 'судья' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'investor', ru: 'инвестор' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'slayd', ru: 'слайд' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 56, t: 52, s: 20, d: 22, dl: 3.3 },
  { ch: { uz: "so'rov", ru: 'просьба' }, l: 90, t: 44, s: 20, d: 24, dl: 2.6 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), to'g'ri javob o'rni: A 1·5·10 · B 2·8·11 · C 3·6·12 · D 4·7·9 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: "Bizda Bozor qaysi bo'lakdan keyin turadi?", ru: 'После какой части у нас стоит Рынок?' }, opts: [{ uz: 'Muammodan keyin', ru: 'После Проблемы' }, { uz: 'Yechimdan keyin', ru: 'После Решения' }, { uz: 'Jamoadan keyin', ru: 'После Команды' }, { uz: 'Raqamlardan keyin', ru: 'После Цифр' }], correct: 0 },
  { q: { uz: "Mentor misolida Raqamlar bo'lagida nechta foydalanuvchi aytilgan?", ru: 'Сколько пользователей названо в Цифрах у Ментора?' }, opts: [{ uz: '44 foydalanuvchi', ru: '44 пользователя' }, { uz: '51 foydalanuvchi', ru: '51 пользователь' }, { uz: '60 foydalanuvchi', ru: '60 пользователей' }, { uz: '6 foydalanuvchi', ru: '6 пользователей' }], correct: 1 },
  { q: { uz: 'Airbnb qanday xizmat?', ru: 'Что за сервис Airbnb?' }, opts: [{ uz: 'Shahar ichida tez taksi chaqirish xizmati', ru: 'Сервис быстрого вызова такси по городу' }, { uz: 'Internetda kitob sotib olish xizmati', ru: 'Сервис покупки книг в интернете' }, { uz: 'Begonaning uyida ijaraga turish xizmati', ru: 'Сервис, где снимают жильё у незнакомых' }, { uz: 'Uyga tayyor ovqat yetkazish xizmati', ru: 'Сервис доставки готовой еды домой' }], correct: 2 },
  { q: { uz: "Airbnb'ning besh slayd nomi ichida jamoa qayerda?", ru: 'Где команда среди пяти названий слайдов Airbnb?' }, opts: [{ uz: 'Besh nomning boshida', ru: 'В начале пяти названий' }, { uz: 'Muammo slaydidan keyin', ru: 'После слайда о проблеме' }, { uz: 'Yechim slaydi ichida', ru: 'Внутри слайда о решении' }, { uz: 'Besh nomning oxirida', ru: 'В конце пяти названий' }], correct: 3 },
  { q: { uz: "Hakam «Buni kim qilyapti?» desa, qaysi bo'lak javob beradi?", ru: 'Судья спросил «Кто это делает?» — какая часть отвечает?' }, opts: [{ uz: "Jamoa bo'lagi", ru: 'Часть «Команда»' }, { uz: "Bozor bo'lagi", ru: 'Часть «Рынок»' }, { uz: "Yechim bo'lagi", ru: 'Часть «Решение»' }, { uz: "Muammo bo'lagi", ru: 'Часть «Проблема»' }], correct: 0 },
  { q: { uz: 'Mentor misolida boshqa mahallalar haqida nima deyilgan?', ru: 'Что сказано у Ментора о других махаллях?' }, opts: [{ uz: 'Ularda ham 60 kishidan bor', ru: 'Там тоже по 60 человек' }, { uz: 'Ularga ilova kerak emas ekan', ru: 'Им приложение не нужно' }, { uz: 'Ularni hali tekshirmaganmiz', ru: 'Их мы ещё не проверяли' }, { uz: "Ularda o'yin tashkil qilinmaydi", ru: 'Там игры не проводят' }], correct: 2 },
  { q: { uz: "Mentor Jamoa bo'lagida agentni qanday aytgan?", ru: 'Как Ментор назвал агента в Команде?' }, opts: [{ uz: "Agentni jamoa a'zosi deb aytgan", ru: 'Назвал агента членом команды' }, { uz: 'Agentni bosh dasturchimiz deb aytgan', ru: 'Назвал агента главным программистом' }, { uz: 'Agent haqida hech narsa demagan', ru: 'Ничего не сказал об агенте' }, { uz: 'Kodni agent bilan yozganini aytgan', ru: 'Сказал, что писал код с агентом' }], correct: 3 },
  { q: { uz: "Mentor misolida sinab ko'rganlar kimlar?", ru: 'Кто пробовал продукт в примере Ментора?' }, opts: [{ uz: 'Faqat Mentorning sinfdoshlari', ru: 'Только одноклассники Ментора' }, { uz: "6 tashkilotchi va o'yinchilar", ru: '6 организаторов и игроки' }, { uz: 'Investor va tadbirkorlar', ru: 'Инвесторы и предприниматели' }, { uz: "Agent va Mentorning o'zi", ru: 'Агент и сам Ментор' }], correct: 1 },
  { q: { uz: "Mentor hakamdan nima so'raydi?", ru: 'О чём Ментор просит судью?' }, opts: [{ uz: 'Pro uchun yozma tasdiq berishlarini', ru: 'Дать письменное подтверждение на Pro' }, { uz: 'Ilovani mahalla guruhiga ulashishni', ru: 'Поделиться приложением в группе махалли' }, { uz: 'Ilova uchun kerakli pul summasini', ru: 'Нужную приложению сумму денег' }, { uz: 'Maydon egalari bilan tanishtirishni', ru: 'Познакомить с владельцами площадок' }], correct: 3 },
  { q: { uz: '12-Moduldagi «maqsad 50» nega yangilandi?', ru: 'Почему обновилась «цель 50» из 12-го модуля?' }, opts: [{ uz: 'Foydalanuvchilar 51 taga yetdi', ru: 'Пользователей стало 51' }, { uz: "Maqsad juda katta bo'lib qoldi", ru: 'Цель оказалась слишком большой' }, { uz: "Ro'yxatdagi sonlar xato chiqdi", ru: 'Числа в списке оказались ошибочными' }, { uz: 'Taklif havolasi ishlamay qoldi', ru: 'Ссылка-приглашение перестала работать' }], correct: 0 },
  { q: { uz: 'Mentor 3 yozma tasdiqni Raqamlarda qanday aytgan?', ru: 'Как Ментор назвал 3 письменных подтверждения в Цифрах?' }, opts: [{ uz: "Uch tashkilotchi Pro'ni sotib oldi", ru: 'Три организатора купили Pro' }, { uz: "Yozma tasdiq bor, to'lov hali yo'q", ru: 'Письменное подтверждение есть, оплаты ещё нет' }, { uz: "Hamma tashkilotchi Pro'ga yozildi", ru: 'Все организаторы подписались на Pro' }, { uz: 'Tasdiqlar pitchda umuman aytilmaydi', ru: 'Подтверждения в питче вообще не называют' }], correct: 1 },
  { q: { uz: 'Mentor misolida Muammo dalili qayerdan olingan?', ru: 'Откуда взят довод Проблемы в примере Ментора?' }, opts: [{ uz: 'Ilovadagi 51 foydalanuvchidan', ru: 'От 51 пользователя приложения' }, { uz: 'Mahalla futbol guruhidagi 60 kishidan', ru: 'От 60 человек в футбольной группе махалли' }, { uz: "So'ralgan 5 o'yinchining javobidan", ru: 'Из ответов 5 опрошенных игроков' }, { uz: "Uch tashkilotchining tasdig'idan", ru: 'Из подтверждения трёх организаторов' }], correct: 2 },
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
const MentorPracticeStats = ({ live, screen, sig, yorliq }) => {
  const signal = sig ?? (PRACTICE_BASE + screen);
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, signal)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen, signal]);
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.accent }}>{tr(yorliq || { uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
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

// 🃏 KARTOCHKALAR — 12 (MD 14-ekran; kartochka mexanikasi va ko'rinishi — qolipda: QKartochka, DE-204). Mentorsiz (SABOQ 16).
const FLASHCARDS = [
  { front: { uz: "Bizda investor pitchi qaysi olti bo'lakdan iborat?", ru: 'Из каких шести частей у нас состоит питч для инвестора?' }, back: { uz: 'Muammo, Bozor, Yechim, Raqamlar, Jamoa va Keyingi qadam', ru: 'Проблема, Рынок, Решение, Цифры, Команда и Следующий шаг' } },
  { front: { uz: "12-Moduldagi besh bo'lakli pitchga qaysi ikki bo'lak qo'shildi?", ru: 'Какие две части добавились к питчу из пяти частей 12-го модуля?' }, back: { uz: 'Bozor va Jamoa', ru: 'Рынок и Команда' } },
  { front: { uz: 'Jonli demo endi pitchning qayerida?', ru: 'Где теперь живое демо в питче?' }, back: { uz: "Yechim bo'lagi ichida", ru: 'Внутри части «Решение»' } },
  { front: { uz: 'Savol-javob pitchning qayerida bo\'ladi?', ru: 'Где в питче бывают вопросы-ответы?' }, back: { uz: '5 daqiqalik pitchdan keyin: hakamlar savol beradi, siz javob berasiz (inglizchasi: Q&A)', ru: 'После 5-минутного питча: судьи задают вопросы, вы отвечаете (по-английски: Q&A)' } },
  { front: { uz: 'Hakam kim?', ru: 'Кто такой судья?' }, back: { uz: 'Pitchni baholaydigan odam: investor yoki tadbirkor', ru: 'Человек, который оценивает питч: инвестор или предприниматель' } },
  { front: { uz: "Bozor bo'lagiga qanday son yoziladi?", ru: 'Какое число пишется в часть «Рынок»?' }, back: { uz: 'Manbasi bor son; qolgani — «hali tekshirilmagan»', ru: 'Число с источником; остальное — «ещё не проверено»' } },
  { front: { uz: "Mentor misolida Bozor bo'lagida nima yozilgan?", ru: 'Что написано в Рынке в примере Ментора?' }, back: { uz: "Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi; boshqa mahallalar hali tekshirilmagan", ru: 'В футбольной группе махалли — 60 человек; в приложении — 6 организаторов; другие махалли ещё не проверены' } },
  { front: { uz: "Nega 60 kishi va 6 tashkilotchi qo'shilmaydi?", ru: 'Почему 60 человек и 6 организаторов не складываются?' }, back: { uz: "Biri guruhdagi odamlar, biri ilovadagi tashkilotchilar: o'lchovi har xil", ru: 'Одно — люди в группе, другое — организаторы в приложении: мера разная' } },
  { front: { uz: "Airbnb investorlarga qanday taqdimot ko'rsatgan?", ru: 'Какую презентацию Airbnb показал инвесторам?' }, back: { uz: "O'nga yaqin oddiy slayd: muammo, yechim, bozor, mahsulot, jamoa", ru: 'Около десятка простых слайдов: проблема, решение, рынок, продукт, команда' } },
  { front: { uz: "Jamoa bo'lagida nima aytiladi?", ru: 'Что говорится в части «Команда»?' }, back: { uz: "Kim nima qilgani — rost, rol bilan; agent — asbob, jamoa a'zosi emas", ru: 'Кто что сделал — честно, ролями; агент — инструмент, а не член команды' } },
  { front: { uz: "Keyingi qadamda hakamdan nima so'raladi?", ru: 'О чём просят судью в Следующем шаге?' }, back: { uz: "Bitta aniq so'rov: tanishtirish, maslahat yoki sinash joyi — pul emas", ru: 'Одна точная просьба: познакомить, посоветовать или дать место для проверки — не деньги' } },
  { front: { uz: 'Yozma tasdiq pitchda qanday aytiladi?', ru: 'Как в питче называют письменное подтверждение?' }, back: { uz: "Dalil sifatida, «bu hali to'lov emas» gapi bilan", ru: 'Как довод, с фразой «это ещё не оплата»' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('ip-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="ip-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + ①②③; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z mahsulotingiz pitchi", ru: 'питч вашего продукта' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '3 ish', ru: '3 дела' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { uz: "Qoralamada yozilmagan bo'lak qolgan bo'lsa — har biriga bitta-ikkita gap yozing.", ru: 'Если в черновике осталась ненаписанная часть — напишите в каждую одну-две фразы.' },
  { uz: "Bozordagi har sonning manbasini tekshiring: guruh yoki chat a'zolari, Database. Topilmasa — «hali tekshirilmagan» deb qoldiring.", ru: 'Проверьте источник каждого числа в Рынке: участники группы или чата, Database. Не нашли — оставьте «ещё не проверено».' },
  { uz: "Keyingi qadamdagi so'rovni bitta gapga keltiring: kim bilan tanishtirsin, qanday maslahat yoki qayerda sinash.", ru: 'Сведите просьбу в Следующем шаге к одной фразе: с кем познакомить, какой совет или где проверить.' }
];
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ keyingi }) => (
  <div className="card ip-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ip-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="ip-hw-q"><span className="ip-hw-k">{tr(r.k)}</span><span className="ip-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="ip-hw-qadam">{HW_BANDLAR.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}</ol>
    {keyingi && <span className="ip-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (4 holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50). Belgi ✓ — faqat to'liq holatda.
const SARLAVHA = {
  toliq: { uz: 'Investor uchun pitch qoralamangiz yozildi.', ru: 'Ваш черновик питча для инвестора написан.' },
  qayta: { uz: "Qoralama yozildi — Keyingi qadamni qayta ko'ring.", ru: 'Черновик написан — пересмотрите Следующий шаг.' },
  qisman: (n) => ({ uz: `Pitch qoralamasi hali tugamagan: ${n}${NB}/${NB}6 bo'lak.`, ru: `Черновик питча ещё не готов: ${n}${NB}/${NB}6 частей.` }),
  bosh: { uz: 'Pitch qoralamasi hali yozilmagan.', ru: 'Черновик питча ещё не написан.' }
};
const RECAP = [
  { uz: "Bizda investor pitchi olti bo'lakdan iborat: Muammo, Bozor, Yechim, Raqamlar, Jamoa va Keyingi qadam.", ru: 'У нас питч для инвестора состоит из шести частей: Проблема, Рынок, Решение, Цифры, Команда и Следующий шаг.' },
  { uz: "Bozorda manbasi bor son aytiladi, qolgani — «hali tekshirilmagan».", ru: 'В Рынке называют число с источником, остальное — «ещё не проверено».' },
  { uz: "Jamoa bo'lagida kim nima qilgani rost aytiladi: agent — asbob.", ru: 'В Команде честно говорят, кто что сделал: агент — инструмент.' },
  { uz: "Keyingi qadamda pul emas — keyingi ish va bitta aniq so'rov aytiladi.", ru: 'В Следующем шаге — не деньги, а следующее дело и одна точная просьба.' }
];
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
  // Holat — o'quvchining saqlangan qoralamasidan (pm-m12d1-pitch); mentor proyektorida — Mentor misoli yozilgan (to'liq sarlavha)
  const p = pitchOl(); const b = (p && p.bolaklar) || {};
  const n = saqlanganSoni(b);
  const holat = isMentorL ? 'toliq' : n === 6 ? (pulVadasiz(b.keyingi) ? 'toliq' : 'qayta') : n > 0 ? 'qisman' : 'bosh';
  const sarlavha = holat === 'qisman' ? SARLAVHA.qisman(n) : SARLAVHA[holat];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Mahsulotingiz hikoyasini qanday aytasiz?»</b></>, ru: <>Следующий урок — <b>«Как рассказать историю своего продукта?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('ip-yakun', holat !== 'toliq' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
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
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmInvestorPitchLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 11-ekran nishonlari (saqlashga qarab)
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === 14-Modul 1-dars — darsning o'z vizuali (prefiks ip-): OltiBolakSahna · AirbnbTasma · tartib · pitch kartasi. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .ip-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        .ip-brend { font-weight: 800; font-style: normal; letter-spacing: -0.01em; white-space: nowrap; }
        @keyframes ip-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes ip-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes ip-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes ip-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes ip-halqa-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.28)}; } }
        @keyframes ip-yashil { 0% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes ip-pop { 0% { transform: scale(1.25); } 100% { transform: scale(1); } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .ip-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ip-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.ip-halqa { outline-offset: 3px; }
        /* Tanlov guruhi — har variantning o'z yengil chegarasi, navbatma-navbat 2 marta (E 40) */
        .ip-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: ip-chorla-v 1.8s ease-out .5s 2; }
        .ip-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .ip-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: ip-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .ip-bash.ix .q-bashorat { padding-top: 10px; padding-bottom: 10px; }
        @media (min-width: 761px) { .ip-k .q-split { grid-template-columns: minmax(0,1.2fr) minmax(0,1fr); gap: 28px; } }
        .ip-k, .ip-teskari, .ip-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .ip-teskari .q-split > .q-col:last-child { order: -1; }
        .ip-harakat { display: flex; flex-direction: column; gap: 10px; }
        .ip-qadamlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .ip-qadamlar .q-chip i { font-style: normal; font-weight: 800; color: ${T.accent}; margin-right: 7px; }
        .ip-qadamlar .q-chip.ok i { color: ${T.ok}; }
        .ip-qadamlar .q-chip.ip-joriy { animation: ip-puls 2.2s ease-out .3s 3; }
        p.ip-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        /* Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42) */
        .q-xulosa .ip-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .ip-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .ip-xq-m { display: block; }
        .q-xulosa .ip-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        /* OltiBolakSahna */
        .ip-sahna { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 24px; align-items: start; }
        .ip-sahna.tel-yoq { grid-template-columns: minmax(0,1fr); }
        .ip-sahna-ong { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ip-sahna-y { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .ip-tel { width: 170px; height: 272px; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex: none; }
        .ip-tel-ekran { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 18px; padding: 13px 12px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ip-tel-nom { font-size: 13px; }
        .ip-tel-y { margin-top: 8px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: ${T.ink2}; }
        .ip-tel-vaqt { font-size: 14.5px; color: ${T.ink}; }
        .ip-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .ip-tel-son { margin-top: 10px; font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .ip-tel-son.yangi { color: ${MJ_RANG}; animation: ip-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .ip-tel-doira { display: flex; gap: 3px; flex-wrap: wrap; }
        .ip-tel-doira i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .ip-tel-doira i.bor { background: ${MJ_RANG}; }
        .ip-tel-tugma { margin-top: auto; text-align: center; font-size: 12px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 8px 6px; }
        /* Investor kartasi (F-1008-574, 576): bitta asosiy tinglovchi — accent chegara, portfel belgisi, savollar katta shriftda */
        .ip-ivr { display: flex; align-items: center; gap: 12px; padding: 8px 14px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 28px -16px ${fon(T.accent, 0.6)}; animation: ip-kir .4s ease-out both; }
        .ip-ivr-ava { width: 40px; height: 40px; border-radius: 50%; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 0 0 5px ${T.accentSoft}; }
        .ip-ivr-ava svg { width: 22px; height: 22px; }
        .ip-ivr-o { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 6px 16px; min-width: 0; flex: 1; }
        .ip-ivr-nom { font-size: 16px; font-weight: 800; color: ${T.ink}; letter-spacing: .01em; }
        .ip-ivr-sl { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; }
        .ip-ivr-s { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; line-height: 1.35; color: ${T.ink}; animation: ip-kir .35s ease-out both; }
        .ip-ivr-s > i { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; flex: none; animation: ip-pop .4s ease-out; }
        .ip-ivr-s.ok { color: ${T.ok}; }
        .ip-ivr-s.ok > i { background: ${T.ok}; color: #fff; }
        .ip-ivr-s.kut > i { background: ${T.bg}; color: ${T.ink2}; }
        .ip-ivr-sj { font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 10px; }
        .ip-hakamlar { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
        .ip-hakamlar.sj { justify-content: flex-end; }
        .ip-hakam { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; max-width: 48%; animation: ip-kir .4s ease-out both; }
        .ip-hakam-y { font-size: 11px; font-weight: 800; letter-spacing: .03em; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 9px; }
        .ip-pufak { display: flex; flex-direction: column; gap: 2px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px 12px 12px 4px; padding: 6px 10px; font-size: 12.5px; font-weight: 600; line-height: 1.35; color: ${T.ink}; animation: ip-kir .35s ease-out both; }
        .ip-pufak.savol { border-color: ${fon(T.accent, 0.55)}; }
        .ip-pufak.ok { color: ${T.ok}; border-color: ${T.ok}; background: ${T.okFon}; font-weight: 800; }
        .ip-pufak small { font-size: 11px; color: ${T.ink2}; font-weight: 800; }
        .ip-bolaklar { display: flex; flex-direction: column; gap: 4px; }
        /* Fokus ekranlari (5, 7, 9): olti bo'lak nomi bitta qatorda (joriysi accent), ostida joriy bo'lak kartasi — tugagan holat 1280x800 ga sig'adi */
        .ip-fk-qator { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
        /* 10-ekran yakuni (F-1008-578): Mentor qoralamasi — asosiy natija, kattaroq shrift */
        .ip-sahna.katta .ip-bolaklar { gap: 4px; }
        .ip-sahna.katta .ip-bolak:not(.fokus):not(.oraliq) { padding: 4px 14px; gap: 14px; }
        .ip-sahna.katta .ip-bolak-h b { font-size: 15px; }
        .ip-sahna.katta .ip-bolak:not(.fokus) .ip-bolak-h { min-width: 118px; }
        .ip-sahna.katta .ip-bolak-m { font-size: 15px; line-height: 1.4; }
        .ip-sahna.katta .ip-bolak:not(.fokus) .ip-bolak-m { -webkit-line-clamp: 3; }
        .ip-sahna.katta .ip-tm-bo em, .ip-sahna.katta .ip-tm-sj em { font-size: 13px; }
        .ip-fk-chip { font-size: 12.5px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 8px; padding: 3px 11px; white-space: nowrap; }
        .ip-fk-chip.on { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ip-sahna.fokusli .ip-bolaklar { flex-direction: row; flex-wrap: wrap; }
        .ip-bolak { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 11px; padding: 7px 11px; display: flex; flex-direction: column; gap: 3px; min-width: 0; transition: border-color .3s, background .3s; }
        .ip-bolak-h { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .ip-bolak-h b { font-size: 14px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .ip-bolak-y { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 7px; white-space: nowrap; animation: ip-kir .4s ease-out both; }
        .ip-bolak-b { margin-left: auto; font-style: normal; font-weight: 800; color: ${T.ok}; animation: ip-pop .4s ease-out; }
        .ip-bolak-m { font-size: 14px; line-height: 1.4; color: ${T.ink}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ip-bolak.bosh { border-style: dashed; background: transparent; }
        .ip-bolak.oraliq { border: 2px dashed ${T.accent}; background: ${fon(T.accent, 0.06)}; min-height: 30px; animation: ip-kir .4s ease-out both, ip-halqa-i 2.4s ease-in-out .4s 3; }
        .ip-bolak.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .ip-bolak.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .ip-bolak.yangi { border-color: ${T.accent}; animation: ip-sirg .55s ease-out both; }
        @keyframes ip-sirg { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        .ip-bolak.kichik { padding: 4px 10px; opacity: .75; }
        .ip-bolak.kichik .ip-bolak-h b { font-size: 12px; }
        .ip-bolak.fokus { flex-basis: 100%; padding: 12px 14px; gap: 7px; }
        .ip-bolak.fokus .ip-bolak-h b { font-size: 14px; }
        .ip-bolak.fokus .ip-bolak-m { font-size: 14.5px; -webkit-line-clamp: 4; }
        .ip-yangi-q { animation: ip-yashil 1.2s ease-out; border-radius: 4px; }
        .ip-tahrir { margin-left: auto; border: none; background: ${T.bg}; color: ${T.accent}; border-radius: 8px; width: 26px; height: 26px; cursor: pointer; font-size: 13px; flex: none; }
        .ip-tahrir:hover { background: ${T.accentSoft}; }
        /* Taymer chizig'i */
        .ip-tm-q { display: flex; align-items: flex-start; gap: 8px; }
        .ip-tm-ch { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
        .ip-tm-chiziq { display: flex; gap: 3px; }
        .ip-tm-bo { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .ip-tm-t { display: block; height: 10px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .ip-tm-t > i { display: block; height: 100%; background: ${T.accent}; transform-origin: left; transform: scaleX(0); }
        .ip-tm.toliq .ip-tm-t > i { transform: scaleX(1); }
        .ip-tm.yur .ip-tm-t > i { animation: ip-tm-yur linear both; }
        @keyframes ip-tm-yur { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .ip-tm-bo em, .ip-tm-sj em { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; text-align: center; }
        .ip-tm-chet { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .ip-tm-sj { flex: 0 0 78px; display: flex; flex-direction: column; gap: 4px; }
        .ip-tm-sj .ip-tm-t { border: none; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px ${fon(T.accent, 0.35)}; }
        .ip-tm-sj em { color: ${T.accent}; font-weight: 800; }
        .ip-tm.toliq .ip-tm-sj .ip-tm-t, .ip-tm.yur .ip-tm-sj .ip-tm-t { animation: ip-sj .5s ease-out both; animation-delay: inherit; }
        .ip-tm-sj { animation: ip-kir .01s both; }
        @keyframes ip-sj { from { border-color: ${T.ink2}; background: transparent; } to { border-color: ${T.accent}; background: ${fon(T.accent, 0.12)}; } }
        @media (max-width: 640px) { .ip-sahna { grid-template-columns: minmax(0,1fr); } .ip-sahna-tel { justify-self: center; } .ip-tm-bo em { display: none; } }
        /* Reja: olti bo'lak birma-bir to'q bo'ladi, so'ng taymer yuradi */
        .ip-reja { display: flex; flex-direction: column; gap: 12px; }
        .ip-reja-teg { font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 6px 10px; }
        .ip-skelet { display: flex; flex-direction: column; gap: 6px; }
        .ip-skelet-b { padding: 7px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 13px; font-weight: 700; animation: ip-toq .5s ease-out both; }
        @keyframes ip-toq { from { color: ${fon(T.ink, 0.18)}; border-color: ${T.line}; } to { color: ${T.ink}; border-color: ${fon(T.accent, 0.45)}; } }
        /* Airbnb tasmasi */
        .ip-voqea { display: flex; flex-direction: column; gap: 12px; }
        .ip-voqea-h { font-weight: 800; font-size: 15px; color: ${T.ink}; animation: ip-kir .35s ease-out both; }
        .ip-nuq { display: flex; align-items: center; gap: 8px; }
        .ip-nuq-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; margin-right: 4px; }
        .ip-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .ip-nuq i.ok { background: ${T.ok}; } .ip-nuq i.cur { background: ${T.accent}; }
        .ip-ab { display: flex; flex-direction: column; gap: 10px; background: ${T.bg}; border-radius: 14px; padding: 14px; }
        .ip-ab-bosh { font-size: 19px; }
        .ip-ab-tasma { display: grid; grid-template-columns: repeat(10, minmax(0,1fr)); gap: 7px; }
        .ip-ab-s { aspect-ratio: 16 / 10; min-height: 0; min-width: 0; background: #fff; border: 1.5px solid ${T.line}; border-radius: 6px; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.3); display: flex; align-items: center; justify-content: center; padding: 2px; font-size: 12.5px; color: ${T.ink}; animation: ip-kir .35s ease-out both; }
        .ip-ab-s b { font-weight: 700; animation: ip-kir .4s ease-out both; }
        .ip-ab-s em { font-style: normal; font-weight: 700; font-size: 16px; color: ${T.ink2}; }
        .ip-ab-s.ajrat { border-color: ${T.accent}; animation: ip-kir .35s ease-out both, ip-halqa-i 1.4s ease-in-out .4s 2; }
        @media (max-width: 760px) { .ip-ab-tasma { grid-template-columns: repeat(5, minmax(0,1fr)); } .ip-ab-s { font-size: 10px; } .ip-ab { padding: 10px; } }
        /* 5-ekran son kartalari */
        .ip-sonlar { display: flex; flex-direction: column; gap: 10px; }
        /* 5-ekran (F-1008-575): Bozor bo'lagi ichida uch qator — karta o'z qatoriga uchib tushadi; manbasiz son — kulrang «hali tekshirilmagan» */
        .ip-bz { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
        .ip-bz-q { position: relative; display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 7px 12px; border-radius: 10px; border: 1.5px dashed ${T.line}; background: ${T.bg}; transition: border-color .3s, background .3s; }
        .ip-bz-q.kutadi { border-color: ${fon(T.accent, 0.55)}; }
        .ip-bz-bosh { width: 22px; height: 22px; border-radius: 7px; background: ${T.paper}; color: ${T.ink2}; font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .ip-bz-q b { font-size: 16px; font-weight: 800; white-space: nowrap; color: ${T.ink}; }
        .ip-bz-kim { font-size: 14px; color: ${T.ink}; flex: 1; min-width: 0; }
        .ip-bz-q em { font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .ip-bz-q > i { font-style: normal; font-weight: 800; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex: none; }
        .ip-bz-q.ok { border-style: solid; border-color: ${T.ok}; background: ${T.okFon}; }
        .ip-bz-q.ok > i { background: ${T.ok}; color: #fff; }
        .ip-bz-q.yoq { border-style: dashed; border-color: ${T.ink2}; background: ${T.paper}; }
        .ip-bz-q.yoq b, .ip-bz-q.yoq .ip-bz-kim { color: ${T.ink2}; }
        .ip-bz-q.yoq > i { background: ${T.bg}; color: ${T.ink2}; }
        .ip-bz-q.yangi { animation: ip-pop .45s ease-out; }
        .ip-bz-q.silk { animation: q-silk .4s ease-in-out .1s 2; }
        .ip-son.jo { opacity: .25; transform: scale(.97); }
        .ip-uchar { position: fixed; z-index: 1300; pointer-events: none; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 2px solid ${T.ok}; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; transform-origin: left center; transition: transform .6s cubic-bezier(.45,.05,.3,1); }
        .ip-uchar.yoq { border-color: ${T.ink2}; }
        .ip-uchar b { font-size: 20px; font-weight: 800; color: ${T.ink}; }
        .ip-uchar span { font-size: 13px; color: ${T.ink2}; }
        .ip-son { position: relative; text-align: left; display: flex; flex-direction: column; gap: 3px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 11px 14px; cursor: pointer; font-family: 'Manrope', sans-serif; color: ${T.ink}; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.25); transition: opacity .3s, transform .45s ease-in; }
        .ip-son b { font-size: 20px; font-weight: 800; white-space: nowrap; }
        .ip-son span { font-size: 13px; }
        .ip-son small { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .ip-son.cur { border-color: ${fon(T.accent, 0.6)}; animation: ip-chorla 1.8s ease-out .3s 2; }
        .ip-son:disabled { cursor: default; }
        .ip-son.tushdi { opacity: .45; box-shadow: none; }
        .ip-son-ok { position: absolute; top: 10px; right: 12px; font-style: normal; font-weight: 800; color: ${T.ok}; }
        .ip-son.silk { border-color: ${T.err}; animation: q-silk .35s ease-in-out 2; }
        .ip-son.silk small { color: ${T.err}; }
        .ip-manba { display: flex; gap: 6px; flex-wrap: wrap; }
        .ip-manba span { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 8px; animation: ip-kir .35s ease-out both; }
        /* 7-ekran: rol yorliqlari, asbob, sinab ko'rganlar */
        .ip-jm { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ip-rol { font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 11px; }
        .ip-jm-y { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .ip-jm-y > span:not(.ip-asbob) { font-size: 11.5px; font-weight: 700; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 2px 8px; animation: ip-kir .35s ease-out both; }
        .ip-asbob { display: inline-flex; align-items: center; gap: 5px; color: ${T.ink2}; font-size: 11.5px; font-weight: 700; animation: ip-kir .4s ease-out both; }
        .ip-asbob::before { content: ''; width: 18px; border-top: 1.5px dashed ${T.ink2}; }
        .ip-asbob svg { width: 17px; height: 17px; }
        .ip-sinab { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; padding: 8px 12px; border-radius: 10px; background: ${T.bg}; color: ${T.ink2}; font-size: 12px; font-weight: 700; animation: ip-kir .4s ease-out both; }
        .ip-sinab i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid ${T.ink2}; background: ${T.paper}; animation: ip-kir .3s ease-out both; }
        /* 9-ekran: hisoblagich, yangi gap, «Investitsiya summasi» */
        .ip-kq { display: flex; flex-direction: column; gap: 9px; }
        .ip-kq-eski { display: block; font-size: 12px !important; color: ${T.ink2}; opacity: .8; }
        .ip-sanoq { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; animation: ip-kir .35s ease-out both; }
        .ip-sanoq-y { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .05em; }
        .ip-sanoq-n { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; min-width: 32px; }
        .ip-sanoq-bar { position: relative; flex: 1; min-width: 120px; max-width: 240px; height: 8px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; margin-bottom: 12px; }
        .ip-sanoq-bar i { position: absolute; left: 0; top: 0; bottom: 0; background: ${T.accent}; border-radius: 4px; transition: width .15s linear; }
        .ip-sanoq-bar b { position: absolute; top: -4px; bottom: -4px; width: 2px; background: ${T.ink}; }
        .ip-sanoq-bar small { position: absolute; top: 10px; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${T.ink2}; }
        .ip-kq-yangi { font-size: 14.5px; line-height: 1.45; color: ${T.ink}; animation: ip-kir .4s ease-out both; }
        .ip-kq-teg { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 8px; animation: ip-kir .4s ease-out both; }
        .ip-inv { align-self: flex-start; position: relative; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1.5px dashed ${T.line}; border-radius: 8px; padding: 6px 12px; animation: ip-inv 2.6s ease-in-out both; }
        .ip-inv::after { content: ''; position: absolute; left: 8px; right: 8px; top: 50%; border-top: 2px solid ${T.err}; transform-origin: left; animation: ip-chiz .5s ease-out .6s both; }
        @keyframes ip-chiz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes ip-inv { 0% { opacity: 0; transform: translateY(6px); } 15%, 70% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateX(40px); } }
        /* Testlardan keyingi kichik vizual */
        .ip-test-viz { margin-top: 2px; }
        .ip-mini { display: flex; flex-wrap: wrap; gap: 6px; }
        .ip-mini-b { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.line}; animation: ip-kir .3s ease-out both; }
        .ip-mini-b.ajrat { border-color: ${T.accent}; animation: ip-kir .3s ease-out both, ip-halqa-i 1.4s ease-in-out .5s 2; }
        .ip-mini-k { display: flex; flex-direction: column; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 11px; padding: 10px 13px; animation: ip-kir .35s ease-out both; }
        .ip-mini-k b { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .ip-mini-k span { font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        /* 10-ekran: tartib (qolip q-dd ko'rinishi; .q-dd-chip rangi o'zgarmaydi — faqat shrift, 13-Modul SABOQ P7) */
        .ip-dd .q-dd-pool { flex-direction: column; align-items: stretch; }
        /* 10-ekran (F-1008-577): PM karta dastasi — chapda olti uya, o'ngda bitta joriy karta (oq, accent chegara, «n / 6»); karta doim tanlangan — joyni bosish yetadi */
        .ip-tj { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 20px; align-items: start; }
        .ip-tj-uyalar { gap: 8px; }
        .ip-tj .q-dd-slot { min-height: 50px; padding: 7px 12px; text-align: left; font: inherit; cursor: default; }
        .ip-tj .q-dd-slot.kutadi { cursor: pointer; border-color: ${fon(T.accent, 0.55)}; background: ${fon(T.accent, 0.04)}; }
        .ip-tj .q-dd-slot.kutadi:hover, .ip-tj .q-dd-slot.ust { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ip-tj-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; position: sticky; top: 8px; }
        .ip-dasta { position: relative; padding-bottom: 10px; }
        .ip-dasta-q { position: absolute; left: 10px; right: 10px; height: 100%; top: 0; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .ip-dasta-q.q1 { transform: translateY(6px); left: 6px; right: 6px; }
        .ip-dasta-q.q2 { transform: translateY(12px); left: 12px; right: 12px; opacity: .7; }
        .ip-gap { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 6px; padding: 14px 18px; border-radius: 14px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}, 0 14px 28px -16px ${fon(T.accent, 0.55)}; cursor: grab; animation: ip-kir .35s ease-out both; }
        .ip-gap:active { cursor: grabbing; }
        .ip-gap.silk { animation: q-silk .42s ease-in-out; }
        .ip-gap-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .ip-gap-t { font-size: 16px; font-weight: 600; line-height: 1.45; color: ${T.ink}; }
        @media (max-width: 760px) { .ip-tj { grid-template-columns: 1fr; gap: 12px; } .ip-tj-ong { order: -1; position: static; } .ip-gap-t { font-size: 15px; } .ip-ivr { padding: 10px 12px; gap: 10px; } .ip-ivr-ava { width: 38px; height: 38px; } .ip-ivr-s { font-size: 14px; } .ip-bz-q { flex-wrap: wrap; } }
        .ip-dd .q-dd-slots { gap: 7px; }
        .ip-dd .q-dd-slot { min-height: 48px; padding: 6px 12px; }
        .ip-dd .q-dd-chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; line-height: 1.4; text-align: left; white-space: normal; }
        .ip-dd .q-dd-chip.tan { outline: 3px solid ${fon(T.accent, 0.35)}; outline-offset: 2px; transform: translateY(-3px); }
        .ip-dd .q-dd-chip.silk { animation: q-silk .4s; }
        .ip-dd .q-dd-chip.chorla { animation: ip-puls 2.2s ease-out .4s 3; }
        button.q-dd-slot.ip-uya { width: 100%; font: inherit; text-align: left; cursor: pointer; color: ${T.ink}; }
        button.q-dd-slot.ip-uya:disabled { cursor: default; opacity: 1; }
        .q-dd-slot.ip-uya.kutadi { border-color: ${fon(T.accent, 0.6)}; animation: ip-chorla 1.8s ease-out 2; }
        .ip-uya-gap { flex: 1; min-width: 0; font-size: 15px; line-height: 1.4; font-weight: 600; }
        .ip-uya-nom { font-style: normal; font-size: 12.5px; font-weight: 800; color: ${T.ok}; background: ${T.paper}; border-radius: 6px; padding: 2px 8px; white-space: nowrap; animation: ip-kir .35s ease-out both; }
        p.ip-nishon-q { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        /* 11-ekran: pitch kartasi (bittadan, E 53; yorliq input ichida, E 43) */
        .ip-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .ip-strip-y { font-size: 12px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 11px; margin-right: 4px; white-space: nowrap; }
        .ip-strip .q-chip.ip-tab { padding: 6px 10px; font-size: 12.5px; }
        .ip-strip .q-chip.ip-tab i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .ip-strip .q-chip.ip-tab.ok i { color: ${T.ok}; }
        .ip-strip .q-chip.ip-tab.yangi { animation: ip-pop .5s ease-out; }
        .ip-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; animation: ip-kartakir .4s ease-out both; }
        @keyframes ip-kartakir { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .ip-karta.uch { animation: ip-uch .38s ease-in both; }
        @keyframes ip-uch { to { opacity: 0; transform: translateY(-46px) scale(.6); } }
        .ip-karta.err { box-shadow: inset 0 0 0 1.5px ${T.err}, 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .ip-maydon { position: relative; }
        .ip-maydon-n { position: absolute; left: 12px; top: 11px; width: 22px; height: 22px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        textarea.ip-inp { display: block; width: 100%; resize: vertical; min-height: 92px; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 11px 14px 26px 44px; outline: none; }
        textarea.ip-inp:focus { border-color: ${T.accent}; }
        textarea.ip-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        textarea.ip-inp.qoshildi { animation: ip-yashil 1s ease-out; }
        textarea.ip-inp::selection { background: ${fon(T.accent, 0.3)}; }
        .ip-maydon.chorla textarea.ip-inp { border-color: ${fon(T.accent, 0.6)}; animation: ip-chorla 1.8s ease-out .4s 2; }
        .ip-sanoq-b { position: absolute; right: 12px; bottom: 9px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .ip-sanoq-b.oshdi { color: ${T.err}; font-weight: 800; }
        p.ip-kulrang { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        p.ip-yana { margin: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .ip-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .ip-yordam p { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .ip-yordam p + p { font-size: 12.5px; color: ${T.ink2}; }
        .ip-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .ip-karta-tug .ip-o { margin-left: auto; }
        .ip-fokus { display: flex; flex-direction: column; gap: 12px; }
        /* Kartochka: birinchi bosishgacha yengil halqa va ipucha (SABOQ 16, E 49) */
        .ip-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: ip-puls 1.8s ease-out .4s 3; }
        /* Kartochka (F-1008-593, global): orqa yuz — neytral to'q (qolipdagi zarg'aldoq gradiyent o'rniga), qizil/zarg'aldoq soya yo'q */
        .ip-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .ip-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.ip-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.ip-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun: ✓ faqat to'liq holatda; uyga vazifa kartasi */
        .ip-yakun.belgisiz .done-chip .tick { display: none; }
        .ip-hw { display: flex; flex-direction: column; gap: 12px; }
        .ip-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .ip-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .ip-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .ip-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.ip-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .ip-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ip-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .ip-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 560px) { .ip-hw-karta { grid-template-columns: 1fr; } }
        /* Ixcham joylashuv (1280×800 skrollsiz — U-006): bo'lak bir qatorda (nom · matn), bashorat bir qatorda, hakam yorlig'i pufak yonida */
        .ip-bolak:not(.fokus):not(.oraliq) { flex-direction: row; align-items: baseline; gap: 10px; padding: 4px 12px; }
        .ip-bolak:not(.fokus) .ip-bolak-h { flex: none; min-width: 92px; }
        .ip-bolak:not(.fokus) .ip-bolak-m { flex: 1; min-width: 0; -webkit-line-clamp: 1; }
        .ip-hakam { flex-direction: row-reverse; align-items: center; gap: 6px; max-width: 100%; }
        .ip-pufak { padding: 4px 9px; font-size: 12px; flex-direction: row; align-items: baseline; gap: 6px; }
        .ip-harakat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 8px; }
        .ip-teskari .ip-harakat { flex-direction: column; align-items: stretch; }
        .ip-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 6px; padding: 10px 14px; }
        .ip-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        .ip-voqea { align-items: stretch; text-align: left; width: 100%; }
        .ip-voqea > .zoomable { width: 100%; }
        .q-mustaqil:has(.ip-karta), .q-mustaqil:has(.ip-fokus) { max-width: none; }
        @media (max-width: 640px) { .ip-bolak:not(.fokus):not(.oraliq) { flex-direction: column; gap: 2px; } .ip-bolak:not(.fokus) .ip-bolak-m { -webkit-line-clamp: 2; } }
        @media (prefers-reduced-motion: reduce) {
          .ip-halqa, .ip-k.kutish .q-variant, .q-bashorat .q-chip, .ip-qadamlar .q-chip, .ip-hakam, .ip-pufak, .ip-bolak, .ip-bolak-y, .ip-bolak-b, .ip-yangi-q, .ip-tm-t > i, .ip-tm-sj, .ip-tm-sj .ip-tm-t,
          .ip-skelet-b, .ip-voqea-h, .ip-ab-s, .ip-ab-s b, .ip-son, .ip-manba span, .ip-jm-y > span, .ip-asbob, .ip-sinab, .ip-sinab i, .ip-sanoq, .ip-kq-yangi, .ip-kq-teg, .ip-inv, .ip-inv::after,
          .ip-mini-b, .ip-mini-k, .ip-dd .q-dd-chip, .q-dd-slot.ip-uya, .ip-uya-nom, .ip-strip .q-chip, .ip-karta, textarea.ip-inp, .ip-maydon.chorla textarea.ip-inp, .ip-flash .fc-front, .ip-tel-son { animation: none !important; transition: none !important; }
          .ip-tm.yur .ip-tm-t > i { transform: scaleX(1); }
          .ip-tm-sj .ip-tm-t { border-color: ${T.accent}; background: ${fon(T.accent, 0.12)}; }
          .ip-skelet-b { color: ${T.ink}; }
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
        @media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } } /* F-1008-583: ⛶ vizual burchagida, kontentdan tashqarida emas */
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
