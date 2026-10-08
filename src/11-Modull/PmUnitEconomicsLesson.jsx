import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 1-dars «Bitta foydalanuvchi sizga qanchaga tushadi?» — skeletdan (08.10.2026, 2-to'lqin); MD: feedback/F-1007-13modul/01-PmUnitEconomics-v3.md
// Qurildi 08.10.2026 (2-to'lqin, A): 14 ekran — s0 QKirish · s1 QReja · s2/s4/s5 QTushuncha · s3/s6/s10 QTest · s7/s8 QMustaqil · s9 QKod (HtmlCompiler) ·
//   podium QNatija · sflash QKartochka · s13 QYakun. Bitta vizual — BirlikSahna (kanallar · odam belgilari · telefon · ikki ustun).
// Kalitlar: o'qiydi pm-m10d6-kanallar, pm-m10d10-hisobot; yozadi pm-m11d1-birlik (tayanch 8), kod qoralamasi pm-m11d1-code.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QMustaqil, QXato, QIzoh, QXulosa, QKartochka, QYakun } from '../qolip/index.jsx';
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

const LESSON_META = { lessonId: 'pm-m11d1-v1', lessonTitle: { uz: 'Bitta foydalanuvchi sizga qanchaga tushadi?', ru: 'Во сколько вам обходится один пользователь?' } };
const HW_TOKENS = [
  { t: { uz: 'kanal', ru: 'канал' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'taxmin', ru: 'предположение' }, l: 66, tp: 18, s: 12, d: 7.5 },
  { t: { uz: "to'lovchi", ru: 'плательщик' }, l: 36, tp: 70, s: 12, d: 8.5 }
];
// 14 ekran (MD KOD 2): hook · reja · tushuncha · test · tushuncha · tushuncha · test · amaliyot · amaliyot · kod · yakuniy test · podium · kartochkalar · yakun
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's13', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal, deskSignal, deskDelay = 320 }) => {
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
  // kompyuter: natija pastki panel ostida qolsa — tugash signalida unga silliq surish (199-qoida)
  useEffect(() => {
    if (!deskSignal || isNarrow) return undefined;
    const el = contentRef.current;
    if (!el) return undefined;
    const t = setTimeout(() => { if (el && el.scrollHeight > el.clientHeight + 4) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, deskDelay);
    return () => clearTimeout(t);
  }, [deskSignal, isNarrow]); // eslint-disable-line
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD KOD 2: 3 — B · 6 — D · 10 — A; ballsiz bashorat/amaliyot/kod — -1 (ishtirok signali).
const INLINE_KEYS = { s3: 1, s6: 3, s10: 0, jalb: -1, keltir: -1, solishtir: -1, practice: -1, koding: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI; PM darsida raqam 1/2/3 — S-026)
const RECAPS = {
  3: {
    title: { uz: 'Jalb qilish narxi', ru: 'Цена привлечения' },
    cards: [
      { ic: '1', h: { uz: 'Qaysi pul olinadi', ru: 'Какие деньги берут' }, body: { uz: 'Bir davrda kanallarga sarflangan pul olinadi.', ru: 'Берут деньги, потраченные на каналы за период.' } },
      { ic: '2', h: { uz: 'Kimga bo\'linadi', ru: 'На кого делят' }, body: { uz: "U shu davrda kelgan yangi foydalanuvchilarga bo'linadi — oldin kelganlar kirmaydi.", ru: 'Их делят на новых пользователей за этот период — пришедшие раньше не входят.' } },
      { ic: '3', h: { uz: 'Sinfdoshlar', ru: 'Одноклассники' }, body: { uz: 'Sinfdoshlar ham sanaladi, lekin alohida aytiladi.', ru: 'Одноклассников тоже считают, но называют отдельно.' }, ask: { uz: 'Sizning kanallaringizga shu oy qancha pul ketdi?', ru: 'Сколько денег ушло на ваши каналы в этом месяце?' } }
    ]
  },
  6: {
    title: { uz: 'Ikki son', ru: 'Два числа' },
    cards: [
      { ic: '1', h: { uz: "To'lovchi", ru: 'Плательщик' }, body: { uz: "Pul to'laydigan foydalanuvchi — to'lovchi.", ru: 'Пользователь, который платит, — плательщик.' } },
      { ic: '2', h: { uz: 'Bitta to\'lovchi uchun', ru: 'Для одного плательщика' }, body: { uz: "Ikki son bitta to'lovchi uchun solishtiriladi.", ru: 'Два числа сравнивают для одного плательщика.' } },
      { ic: '3', h: { uz: 'Keltiradigan pul', ru: 'Приносимые деньги' }, body: { uz: "Keltiradigan pul — narx, necha oy to'lashiga ko'paytirilgan.", ru: 'Приносимые деньги — цена, умноженная на число месяцев оплаты.' }, ask: { uz: "Mahsulotingizda kim to'lovchi bo'lishi mumkin?", ru: 'Кто может быть плательщиком в вашем продукте?' } }
    ]
  },
  10: {
    title: { uz: 'Taxmin', ru: 'Предположение' },
    cards: [
      { ic: '1', h: { uz: 'Hali hech kim to\'lamagan', ru: 'Ещё никто не платил' }, body: { uz: "Hali hech kim to'lamagan narx — taxmin.", ru: 'Цена, которую ещё никто не платил, — предположение.' } },
      { ic: '2', h: { uz: 'Yorliq bilan', ru: 'С ярлыком' }, body: { uz: "Taxmin ham yoziladi — yonida yorlig'i bilan.", ru: 'Предположение тоже записывают — с ярлыком рядом.' } },
      { ic: '3', h: { uz: 'Qaytganlar foizi', ru: 'Доля вернувшихся' }, body: { uz: 'Qaytganlar foizi ilovani yana ochishni sanaydi, pullik obunani emas.', ru: 'Доля вернувшихся считает повторные открытия приложения, а не платную подписку.' }, ask: { uz: 'Ikki soningizdan qaysi biri taxmin?', ru: 'Какое из ваших двух чисел — предположение?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="bs-tviz-w fade-step">{vizual}</div>}
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

// ===== DARS VIZUALI — «Bitta foydalanuvchi» sahnasi (BirlikSahna: kanallar · odamlar · telefon · ustunlar) — bitta manba: MENTOR_KANALLAR · MENTOR_SONLAR · AGAR (MD A-6, 163/180) =====
// qolip-maket: bs-kanal bs-tugma bs-ustun bs-qator bs-belgi bs-kartatab bs-tahrir
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (MD «O'qituvchi eslatmasi»; ekran raqami hisoblagich bilan bir — 1 dan)
const Ustoz = ({ satrlar }) => {
  const { isMentor } = useJonli();
  if (!isMentor || !satrlar) return null;
  return <div className="bs-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{fmtCode(tr(q))}</span>)}</div>;
};
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa — dars progressida qoladi */ } };
const KANAL_KEY = 'pm-m10d6-kanallar';
const HISOBOT_KEY = 'pm-m10d10-hisobot';
const BIRLIK_KEY = 'pm-m11d1-birlik';
const KOD_KEY = 'pm-m11d1-code';
const NB = String.fromCharCode(160);
// Son va so'm qator oxirida bo'linmaydi (SABOQ P9): ming ajratgich va «so'm» oldida — NBSP
const sonFmt = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, NB);
const somT = (n) => sonFmt(n) + NB + tr({ uz: "so'm", ru: 'сум' });
const MAYDON_RANG = '#2E9E4F';
const MJ = () => <b className="bs-mj">Maydon Jamoa</b>;

// Mentor misoli (tayanch 1.0, 1.1, 1.13; 12-Modul 1.6, 1.13 — aynan)
const MENTOR_KANALLAR = [
  { id: 'mahalla', nom: { uz: 'mahalla futbol guruhi', ru: 'футбольная группа махалли' }, sarf: 0 },
  { id: 'sinf', nom: { uz: 'sinf chati', ru: 'чат класса' }, sarf: 0 },
  { id: 'insta', nom: { uz: 'Instagram sahifasi', ru: 'страница в Instagram' }, sarf: 0 }
];
const MENTOR_SONLAR = { yangi: 44, sinfdosh: 11, davr: { uz: 'ishga tushgandan keyingi ikki hafta', ru: 'две недели после запуска' }, tashkilotchi: 6, narx: 10000, oy: 3, keltiradi: 30000, qaytgan: 43 };
const AGAR = { sarf: 60000, yangi: 12, tolovchi: 1 };
const TAXMIN_MASHQ = { uz: 'Mentorning taxmini · mashq', ru: 'Предположение Ментора · упражнение' };
const CHEGARA_QATOR = { uz: "Bu hisobda faqat kanallarga sarflangan pul bor — mahsulotni ushlab turish puli kirmagan.", ru: 'В этом расчёте только деньги, потраченные на каналы, — деньги на содержание продукта не входят.' };
const MUHR = {
  qoplanadi: { uz: 'qoplanadi', ru: 'покрывается' },
  zarar: { uz: 'zarar', ru: 'убыток' },
  teng: { uz: 'teng', ru: 'равно' },
  nomalum: { uz: "noma'lum", ru: 'неизвестно' },
  sarfsiz: { uz: 'pul sarflanmagan', ru: 'деньги не потрачены' }
};

// --- yordamchi hook'lar ---
const useIpucha = (faol, dep) => {
  const [ko, setKo] = useState(false);
  useEffect(() => { setKo(false); if (!faol) return undefined; const t = setTimeout(() => setKo(true), 40000); return () => clearTimeout(t); }, [faol, dep]);
  return ko && faol;
};
// Hisoblagich sanab o'sadi (SABOQ 19); reduced-motion — birdan
const useSanash = (maqsad, ms = 900) => {
  const [n, setN] = useState(() => (kamHarakat() ? maqsad : 0));
  const oldin = useRef(n);
  useEffect(() => {
    if (kamHarakat()) { setN(maqsad); oldin.current = maqsad; return undefined; }
    const bosh = oldin.current, t0 = Date.now();
    let raf = 0;
    const qadam = () => { const p = Math.min(1, (Date.now() - t0) / ms); const v = Math.round(bosh + (maqsad - bosh) * p); setN(v); if (p < 1) raf = requestAnimationFrame(qadam); else oldin.current = maqsad; };
    raf = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(raf);
  }, [maqsad, ms]);
  return n;
};
// Bosilgan narsa kartadan ustunga uchadi (portal, reduced-motion — yo'q)
function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    setUchlar(u => [...u, { k, matn, x: a.left + Math.min(20, a.width / 4), y: a.top + Math.min(10, a.height / 3), dx: b.left - a.left, dy: b.top - a.top }]);
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 900);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className="bs-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
// Taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori (E 42); izoh — oxirgi kichik qatori
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('bs-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="bs-x-m">{matn}</span>{izoh && <span className="bs-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="bs-bashq fade-step"><span>{savol}</span><span className="bs-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;
const BASHORAT_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };

// --- Odam belgisi (SABOQ P1: o'z chizmasi emas — 9-Modul PmInterviewsOneLesson dagi tayyor «Odam» shakli; D 36: bosh, soch, rangli kiyim) ---
const ODAM_RANG = {
  teri: ['#EEC6A0', '#C98F66', '#E2A982'], soch: ['#2B1E17', '#5A3A25', '#1E1A1A'],
  kiyim: ['#E0765C', '#3D7EB4', '#E7A33E', '#7A62C8', '#2E9C78', '#D56B8A'], shim: '#394060', oyoq: '#2A2730', lab: '#8A4B3A'
};
const Odam = ({ teri = 0, soch = 0, kiyim = 0, sochTur = 'qisqa', bayroq }) => {
  const k = typeof kiyim === 'string' ? kiyim : ODAM_RANG.kiyim[kiyim % ODAM_RANG.kiyim.length], t = ODAM_RANG.teri[teri % 3], h = ODAM_RANG.soch[soch % 3];
  return (
    <g>
      <rect x="-8.5" y="-34" width="7.5" height="32" rx="3.5" fill={ODAM_RANG.shim} />
      <rect x="1" y="-34" width="7.5" height="32" rx="3.5" fill={ODAM_RANG.shim} />
      <rect x="-10.5" y="-4" width="10" height="4.5" rx="2.2" fill={ODAM_RANG.oyoq} />
      <rect x="1" y="-4" width="11" height="4.5" rx="2.2" fill={ODAM_RANG.oyoq} />
      <rect x="-15.5" y="-60" width="7" height="27" rx="3.5" fill={k} opacity="0.88" />
      <rect x="-12" y="-64" width="24" height="33" rx="9" fill={k} />
      <circle cx="-12" cy="-32.5" r="3.3" fill={t} />
      {bayroq
        ? <><rect x="8.5" y="-74" width="7" height="22" rx="3.5" fill={k} /><circle cx="12" cy="-75" r="3.3" fill={t} /><rect x="11" y="-96" width="2.4" height="24" rx="1" fill="#2A2730" /><path d="M13.4 -96 L30 -90 L13.4 -84 Z" fill={T.accent} /></>
        : <><rect x="8.5" y="-60" width="7" height="27" rx="3.5" fill={k} /><circle cx="12" cy="-32.5" r="3.3" fill={t} /></>}
      <rect x="-3" y="-70" width="6" height="7" rx="2" fill={t} />
      <circle cx="0" cy="-78" r="11" fill={t} />
      {sochTur === 'uzun' && <path d="M -11 -79 C -13 -63, -10 -59, -4 -60 L -6 -74 Z" fill={h} />}
      <path d="M -11.5 -77 C -13 -94, 13 -94, 11.5 -78 C 6 -84, -2 -85, -11.5 -77 Z" fill={h} />
      <circle cx="3" cy="-78" r="1.4" fill="#2A2730" />
      <circle cx="8" cy="-78" r="1.4" fill="#2A2730" />
      <path d="M 3.5 -72.5 Q 6 -70 8.5 -72.5" stroke={ODAM_RANG.lab} strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  );
};
// 44 kishi: 11 tasi sinfdosh (bitta rang — ko'k), 6 tasi tashkilotchi (bayroqcha — «E'lon» belgisi); qolganlari iliq ranglarda
const SINFDOSH_I = [1, 4, 7, 12, 15, 20, 23, 28, 31, 36, 39];
const TASHKILOTCHI_I = [2, 10, 17, 25, 33, 42];
const odamTur = (i) => ({ sinfdosh: SINFDOSH_I.includes(i), tashkilotchi: TASHKILOTCHI_I.includes(i) });
const BelgiSvg = ({ i = 0, kiyim, bayroq, className, style }) => {
  const tur = odamTur(i);
  const kv = kiyim !== undefined ? kiyim : tur.sinfdosh ? 1 : [0, 2, 3, 4, 5][i % 5];
  return <svg className={cxx('bs-odam', className)} style={style} viewBox="-18 -98 50 100" aria-hidden="true"><Odam teri={i % 3} soch={(i + 1) % 3} kiyim={kv} sochTur={i % 4 === 1 ? 'uzun' : 'qisqa'} bayroq={bayroq !== undefined ? bayroq : tur.tashkilotchi} /></svg>;
};
// Odam belgilari to'ri (11 × 4); n — nechtasi ko'rinadi (kirish navbat bilan); xira — tashkilotchidan boshqasi xira
const OdamTor = ({ n = 44, jami = 44, sinf = true, tashkil = true, ajrat, kiyim, ustida, className, tRef, qadam = 22 }) => (
  <div ref={tRef} className={cxx('bs-tor', className)} style={{ '--ust': Math.min(11, jami) }}>
    {Array.from({ length: jami }).map((_, i) => {
      const tur = odamTur(i);
      const kor = i < n;
      return (
        <span key={i} className={cxx('bs-tor-k', kor && 'kor', ajrat === 'tashkilotchi' && !tur.tashkilotchi && 'xira')} style={{ animationDelay: kor ? `${Math.min(i, 44) * qadam}ms` : undefined }}>
          {kor && <BelgiSvg i={i} kiyim={kiyim !== undefined ? kiyim : sinf ? undefined : [0, 2, 3, 4, 5][i % 5]} bayroq={tashkil ? undefined : false} />}
          {kor && ustida && <b className="bs-tor-u">{ustida(i)}</b>}
        </span>
      );
    })}
  </div>
);

// --- Kanal kartasi (chizilgan: pufak belgisi + nom + so'm yorlig'i; logotip yo'q) ---
const KanalKarta = ({ nom, som, holat, agar, onClick, kRef, sRef, faol, disabled, yon, style }) => {
  const Teg = onClick ? 'button' : 'div';
  return (
    <Teg ref={kRef} type={onClick ? 'button' : undefined} className={cxx('bs-kanal', agar && 'agar', holat, faol && 'faol', yon && 'yon')} onClick={onClick} disabled={onClick ? disabled : undefined} style={style}>
      {agar && <span className="bs-kanal-y">{tr(TAXMIN_MASHQ)}</span>}
      <span className="bs-kanal-q">
        <i className="bs-kanal-ic" aria-hidden="true"><i /><i /></i>
        <span className="bs-kanal-n">{nom}</span>
        <b ref={sRef} className="bs-kanal-som">{som}</b>
      </span>
      {agar && <span className="bs-kanal-iz">{tr({ uz: "pul to'lab post chiqariladigan kanal", ru: 'канал, где пост выходит за деньги' })}</span>}
    </Teg>
  );
};

// --- Telefon (chapda, ≈170×272): «Maydon Jamoa» — «O'yinlar»; rejim: null | 'oyinchi' | 'tashkilotchi' ---
const Telefon = ({ rejim }) => {
  const oyinchiYon = rejim === 'oyinchi';
  return (
  <div className="bs-telj">
    <div className="bs-tel">
      <span className="bs-tel-bar"><MJ /></span>
      <div className="bs-tel-ekran">
        <span className="bs-tel-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
        {rejim && <span key={rejim} className="bs-tel-rol fade-step">{rejim === 'oyinchi' ? tr({ uz: "o'yinchi", ru: 'игрок' }) : tr({ uz: 'tashkilotchi', ru: 'организатор' })}</span>}
        <div key={'k' + (rejim || '')} className={cxx('bs-tel-karta', oyinchiYon && 'yon')}>
          <b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
          <span>{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
          <span className="bs-tel-son">8{NB}/{NB}10</span>
        </div>
        {rejim === 'tashkilotchi'
          ? <span key="e" className="bs-tel-btn yon">{tr({ uz: "E'lon berish", ru: 'Объявить игру' })}</span>
          : <span key={'q' + (rejim || '')} className={cxx('bs-tel-btn', oyinchiYon && 'yon')}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>}
      </div>
    </div>
  </div>
  );
};

// --- Ikki ustun (gorizontal, so'm shkalasi) + muhr + doimiy chegara qatori + halol qator ---
const ustunMatn = (v, bolmaydi) => (v === null || v === undefined ? (bolmaydi ? tr({ uz: "bo'lib bo'lmaydi", ru: 'нельзя разделить' }) : tr({ uz: "noma'lum", ru: 'неизвестно' })) : somT(v));
const Ustunlar = ({ jalb, keltir, jalbY, keltirY, jalbIz, keltirIz, muhr, halol, ixcham, bolmaydi, chegara = true, uRef, oraQator, className }) => {
  const mx = Math.max(Number(jalb) || 0, Number(keltir) || 0, 1);
  const w = (v) => (v === null || v === undefined || v === '?' ? 0 : Math.max(2, Math.round((Number(v) / mx) * 100)));
  return (
    <div ref={uRef} className={cxx('bs-ustunlar', ixcham && 'ixcham', className)}>
      <div className="bs-ust jalb">
        <span className="bs-ust-y">{jalbY || tr({ uz: 'Jalb qilish narxi', ru: 'Цена привлечения' })}</span>
        <div className="bs-ust-t"><i key={String(jalb)} style={{ width: w(jalb) + '%' }} /></div>
        <b className="bs-ust-s">{jalb === '?' ? '?' : ustunMatn(jalb, bolmaydi)}{jalbIz && <em>{jalbIz}</em>}</b>
      </div>
      {oraQator && <span key={'o' + String(oraQator).length} className="bs-ora fade-step">{oraQator}</span>}
      {muhr !== undefined && <span key={String(muhr)} className={cxx('bs-muhr', muhr || 'bosh')}>{muhr ? tr(MUHR[muhr]) : '?'}</span>}
      <div className="bs-ust keltir">
        <span className="bs-ust-y">{keltirY || tr({ uz: 'Keltiradigan pul', ru: 'Приносимые деньги' })}</span>
        <div className="bs-ust-t"><i key={String(keltir)} style={{ width: w(keltir) + '%' }} /></div>
        <b className="bs-ust-s">{keltir === '?' ? '?' : ustunMatn(keltir)}{keltirIz && <em>{keltirIz}</em>}</b>
      </div>
      {muhr && chegara && <span className="bs-chegara">{tr(CHEGARA_QATOR)}</span>}
      {halol && <span className="bs-halol fade-step">{halol}</span>}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz so'rovnoma J-026, javob «Aynan!» / «Qiziq fikr!» — T-028, T-067) =====
const USTOZ = {
  s0: [{ uz: "Javoblarni muhokama qilmang — Mentor sonlari 3-ekranda chiqadi. Sinfdan so'rang: «Postingizni yozish va javob berish qancha vaqt oldi?» (son yig'ilmaydi, qo'l ko'tartirilmaydi).", ru: 'Не обсуждайте ответы — числа Ментора появятся на 3-м экране. Спросите класс: «Сколько времени ушло на пост и ответы?» (числа не собираются, руки не поднимают).' },
    { uz: "12-Modulda kanallar bepul edi (sinf chati, guruhlar, Instagram) — pul to'lagan o'quvchi bo'lsa, u 8-ekranda o'z sonini yozadi; pul to'lash rag'batlantirilmaydi.", ru: 'В 12-м модуле каналы были бесплатными (чат класса, группы, Instagram) — если кто-то платил, он впишет своё число на 8-м экране; платить не поощряется.' }],
  s1: [{ uz: "Modul boshida bir gap ayting: bu modulda pul haqida gaplashamiz, lekin hech kim haqiqiy pul to'lamaydi — to'lovlar test rejimda, narxlar taxmin. Kanallar va metrika hisoboti 12-Moduldan; topilmasa dars to'xtamaydi — o'quvchi o'zi yozadi.", ru: 'В начале модуля скажите: в этом модуле говорим о деньгах, но никто не платит по-настоящему — платежи в тестовом режиме, цены — предположения. Каналы и отчёт по метрикам — из 12-го модуля; если их нет, урок не останавливается — ученик пишет сам.' }],
  s2: [{ uz: "44 — Mentor misolida ilova ishga tushgandan keyingi ikki haftada ro'yxatdan o'tganlar (11 tasi — sinfdosh; sinfdoshlar sanaladi, lekin alohida aytiladi). Bu — sodda hisob: shu davrdagi hamma yangi foydalanuvchi olinadi; kim qaysi kanaldan kelgani Mentor misolida sanalmagan (12-Modulda kanal bo'yicha faqat lendingga tashrif sanalgan) — «44 kishi shu kanallardan keldi» demang.", ru: '44 — зарегистрировавшиеся за две недели после запуска в примере Ментора (11 — одноклассники; их считают, но называют отдельно). Это простой расчёт: берутся все новые пользователи за период; кто из какого канала пришёл, не считали (в 12-м модуле по каналам считали только визиты на лендинг) — не говорите «44 человека пришли из этих каналов».' },
    { uz: "Bepul kanal ham «tekin» emas: post yozish, javob berish, guruh egasidan ruxsat so'rash — vaqt.", ru: 'Бесплатный канал тоже не «даром»: написать пост, ответить, спросить разрешения у владельца группы — это время.' },
    { uz: "Mentor misolida guruh va sinf chatidagi a'zolar soni cheklangan: ular ro'yxatdan o'tib bo'lgach, u yerdan yangi foydalanuvchi kam kelishi mumkin — bu shu misol haqida, har bepul kanal haqida emas. 60 000 va 12 — mashq sonlari (Mentorning taxmini): pullik post narxi haqida fakt aytmang; o'quvchilarni pullik kanalga pul to'lashga undamang — bu dars uni faqat hisoblaydi.", ru: 'В примере Ментора участников в группе и чате класса немного: когда они зарегистрируются, новых оттуда может прийти мало — это про этот пример, не про любой бесплатный канал. 60 000 и 12 — числа упражнения (предположение Ментора): не называйте фактов о цене платного поста; не подталкивайте учеников платить каналу — урок только считает.' },
    { uz: "Sinfga savol: «Sizning kanallaringizda hali ro'yxatdan o'tmagan a'zo qolganmi?» (javoblar og'zaki, sanalmaydi).", ru: 'Вопрос классу: «В ваших каналах остались участники, которые ещё не зарегистрировались?» (ответы устно, не считаются).' }],
  s4: [{ uz: "Pro va «Doimiy o'yin» — Mentor misolining rejasi: ilovada hali yo'q, bu darsda qachon qurilishi aytilmaydi. Nega pul o'yinchidan emas, tashkilotchidan — keyingi darsning savoli: bugun ochmang, faqat «Mentor misolida shunday» deng.", ru: 'Pro и «Постоянная игра» — план из примера Ментора: в приложении их ещё нет, когда сделают — на уроке не говорится. Почему платит организатор, а не игрок, — вопрос следующего урока: сегодня не раскрывайте, скажите только «в примере Ментора так».' },
    { uz: "10 000 va 3 oy — taxmin: hali hech kim to'lamagan. Hisoblashni so'z bilan ayting: «narxni oylar soniga ko'paytiramiz». 6 tashkilotchi — Database'dagi `namuna = false` va kamida bitta o'yin e'lon qilgan hisoblar; ular 44 kishi va 24 asosiy harakatni qilgan ichida.", ru: '10 000 и 3 месяца — предположение: ещё никто не платил. Скажите словами: «умножаем цену на число месяцев». 6 организаторов — записи в Database с `namuna = false`, объявившие хотя бы одну игру; они входят в 44 человека и в 24, сделавших главное действие.' },
    { uz: "43% — qurilmalar bo'yicha (61 dan 26): ilovani yana ochish pul to'lash bilan bir xil o'lchov emas — «3 oy» unga tayanmaydi.", ru: '43% — по устройствам (26 из 61): повторно открыть приложение — не то же самое, что платить, — «3 месяца» на это не опираются.' }],
  s5: [{ uz: "Ko'p uchraydigan xato — 5 000 ni 30 000 bilan solishtirib, «qoplanadi» deyish: 5 000 — har bir kelgan foydalanuvchi uchun, 30 000 esa to'laydigan tashkilotchidan. «12 kishidan bittasi tashkilotchi» — Mentorning taxmini.", ru: 'Частая ошибка — сравнить 5 000 с 30 000 и сказать «покрывается»: 5 000 — на каждого пришедшего, а 30 000 — от платящего организатора. «Один из 12 — организатор» — предположение Ментора.' },
    { uz: "Mentorning haqiqiy holati (bepul kanallar): jalb qilish narxi pulda 0 so'm — pulda zarar yo'q, lekin vaqt ketgan; o'quvchi o'zinikini 8-ekranda ko'radi. «Zarar» — mahsulot yomon degani emas: bu misolda pullik kanal shu sonlar bilan o'z pulini qoplamaydi.", ru: 'Реальная ситуация Ментора (бесплатные каналы): цена привлечения в деньгах 0 сумов — убытка в деньгах нет, но ушло время; ученик увидит своё на 8-м экране. «Убыток» не значит, что продукт плохой: в этом примере платный канал с такими числами себя не покрывает.' },
    { uz: "«Qoplanadi» chiqqanda ham — bu faqat kanal puli haqida: mahsulotni ushlab turish puli (Backend, sayt) bu hisobda yo'q.", ru: 'Даже когда вышло «покрывается» — это только о деньгах на канал: денег на содержание продукта (Backend, сайт) в расчёте нет.' },
    { uz: "Sinfga savol: «Sizning mahsulotingizda kim to'lovchi bo'lishi mumkin?» (javoblar og'zaki, sanalmaydi).", ru: 'Вопрос классу: «Кто в вашем продукте может быть плательщиком?» (ответы устно, не считаются).' }],
  s7: [{ uz: "12-Modulda kanallarga pul to'lash talab qilinmagan — sarflangan pul 0 bo'lishi kutiladi: bu yaxshi ham, yomon ham emas, holat. Kim to'laydi — rol bilan («ota-ona», «o'qituvchi», «tashkilotchi»), ism yozilmaydi.", ru: 'В 12-м модуле платить каналам не требовалось — ожидается 0: это ни хорошо, ни плохо, это состояние. Кто платит — ролью («родитель», «учитель», «организатор»), без имён.' },
    { uz: "Narxni baholamang va «shuncha qo'ying» demang — bugun faqat taxmin. Ilova ishga tushmagan yoki foydalanuvchisi yo'q o'quvchi — «Mentor sonlari bilan mashq» yoki yangi foydalanuvchilarga 0 (jalb qilish narxi — «bo'lib bo'lmaydi»).", ru: 'Не оценивайте цену и не говорите «поставьте столько» — сегодня только предположение. Если приложение не запущено или нет пользователей — «Упражнение с числами Ментора» или 0 новых (цена привлечения — «нельзя разделить»).' },
    { uz: "Sinfda kim qancha yozganini so'ramang va qo'l ko'tartirmang.", ru: 'Не спрашивайте в классе, кто сколько написал, и не просите поднять руки.' }],
  s8: [{ uz: "≈ 2 × 3 daqiqa + tuzatish. Sherik son haqida yozadi, odam haqida emas. Halol yozilgan taxmin — ✓: «taxmin» xato emas. 3-savolda «kimdir aytgan» bo'lsa — kim (rol), ism emas; real suhbat bu darsda yo'q.", ru: '≈ 2 × 3 минуты + исправление. Партнёр пишет о числе, а не о человеке. Честно записанное предположение — ✓: «предположение» не ошибка. Если в 3-м вопросе «кто-то сказал» — кто (роль), не имя; реального разговора на этом уроке нет.' },
    { uz: "2-savol to'lovchi mahsulotdan foydalanishini talab qilmaydi: ota-ona farzandi uchun to'lashi ham mumkin — muhimi, u nima olishini aytib bera olish.", ru: '2-й вопрос не требует, чтобы плательщик сам пользовался продуктом: родитель может платить за ребёнка — важно уметь сказать, что он получает.' }],
  s9: [{ uz: "Ko'p uchraydigan xato — `yangi` 0 ni tekshirmaslik: natijada `Infinity` chiqadi va 2-shart ✕ qoladi. Kod — haqiqiy Backend emas: sonlar qo'lda yozilgan (Mentor misoli — mashq).", ru: 'Частая ошибка — не проверить `yangi` на 0: выйдет `Infinity`, и 2-е условие останется ✕. Код — не настоящий Backend: числа написаны вручную (пример Ментора — упражнение).' },
    { uz: "«Mahsulotim» qatorida keltiradigan pul — taxmin; narx yoki oy yozilmagan bo'lsa — «noma'lum» chiqadi («bo'lib bo'lmaydi» — faqat yangi foydalanuvchi 0 bo'lganda). Kalit yo'q bo'lsa qatorlar «Mashq» yorlig'i bilan — Mentor sonlari o'quvchiniki deb ko'rsatilmaydi. Kod o'quvchi uchun xulosa chiqarmaydi: uning xulosasi «Ikki sonim» kartasida (to'lovchilar soni hisobga olinadi).", ru: 'В строке «Мой продукт» приносимые деньги — предположение; если цена или месяцы не указаны — выйдет «неизвестно» («нельзя разделить» — только при 0 новых). Без ключа строки с ярлыком «Mashq» — числа Ментора не выдаются за числа ученика. Код не делает вывод за ученика: его вывод — в карточке «Два моих числа» (учитывается число плательщиков).' }]
};
const HOOK_OPTS = [
  { id: 'hech', label: { uz: 'Hech narsaga — kanallarga pul bermadim', ru: 'Ни во что — каналам я не платил' },
    javob: { uz: <><b>Qiziq fikr!</b> Pulda — rost: bu kanallarda pul so'ralmaydi. Lekin har post va javobga vaqt ketgan.</>, ru: <><b>Интересная мысль!</b> В деньгах — правда: эти каналы денег не просят. Но на каждый пост и ответ ушло время.</> } },
  { id: 'vaqt', label: { uz: 'Pulga emas — postlarga ketgan vaqtimga', ru: 'Не в деньги — во время на посты' },
    javob: { uz: <><b>Aynan!</b> Pul ketmagan bo'lsa ham, post yozish va javob berishga vaqt ketgan.</>, ru: <><b>Именно!</b> Даже если денег не ушло, на посты и ответы ушло время.</> } },
  { id: 'bilmayman', label: { uz: 'Bilmayman — buni hech sanamaganman', ru: 'Не знаю — я это не считал' },
    javob: { uz: <><b>Qiziq fikr!</b> Kanallaringizga qarang: postlar bepul joyda bo'lsa, pul emas — vaqt ketgan.</>, ru: <><b>Интересная мысль!</b> Посмотрите на свои каналы: если посты в бесплатных местах — ушли не деньги, а время.</> } }
];
// O'quvchining 12-Modul natijasi (bo'lmasa — null; Mentor misoli zaxirasi)
const oquvchiKanallar = () => {
  const k = lsO(KANAL_KEY);
  const r = (k && Array.isArray(k.kanallar) ? k.kanallar : []).filter(x => x && x.ruxsat === 'bor' && String(x.nom || '').trim()).slice(0, 3);
  return r.map((x, i) => ({ id: x.id || 'k' + i, nom: String(x.nom).trim() }));
};
const royxatOl = () => {
  const h = lsO(HISOBOT_KEY);
  if (!h || !h.royxat) return null;
  const tuzatish = h.tekshiruv === 'tuzatish' && h.tuzatishQator === 'royxat';
  const soni = Number(h.royxat.soni);
  const sinfdosh = Number(h.royxat.sinfdosh);
  return { soni: !tuzatish && Number.isFinite(soni) && soni >= 0 ? soni : null, sinfdosh: Number.isFinite(sinfdosh) ? sinfdosh : 0, sana: h.royxat.sana ? String(h.royxat.sana) : '', tuzatish };
};
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
    <div className="bs-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('bs-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="bs-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
const HookMaket = ({ tanlov }) => {
  const [kanallar] = useState(oquvchiKanallar);
  const [royxat] = useState(royxatOl);
  const oz = kanallar.length > 0;
  const kartalar = oz ? kanallar.map(k => ({ id: k.id, nom: k.nom })) : MENTOR_KANALLAR.map(k => ({ id: k.id, nom: tr(k.nom) }));
  const soni = oz ? (royxat ? royxat.soni : null) : MENTOR_SONLAR.yangi;
  return (
    <div className={cxx('bs-hook', !oz && 'telli')}>
      {!oz && <Telefon />}
      <div className="bs-hook-o">
        {oz && <span className="bs-yorliq">{tr({ uz: 'Sizning kanallaringiz', ru: 'Ваши каналы' })}</span>}
        <div className="bs-kanallar">
          {kartalar.map((k, i) => <KanalKarta key={k.id} nom={k.nom} som={'?' + NB + tr({ uz: "so'm", ru: 'сум' })} holat="kutish" yon={!!tanlov} style={{ animationDelay: `${0.1 + i * 0.1}s`, '--yd': `${i * 0.18}s` }} />)}
        </div>
        {oz && soni !== null && soni > 0 && <OdamTor n={Math.min(44, soni)} jami={Math.min(44, soni)} tashkil={false} className="kichik" />}
        <span className="bs-kulrang">{oz
          ? <>{tr({ uz: "Ro'yxatdan o'tgan", ru: 'Зарегистрировались' })}: {soni === null ? '?' : soni}</>
          : <>{MENTOR_SONLAR.yangi} {tr({ uz: "kishi ro'yxatdan o'tgan · Mentor misolida", ru: 'человека зарегистрировались · в примере Ментора' })}</>}</span>
        {tanlov && <span className="bs-kulrang bs-yangi-q fade-step">{tr({ uz: 'Bitta foydalanuvchiga', ru: 'На одного пользователя' })}: ?{NB}{tr({ uz: "so'm", ru: 'сум' })}</span>}
      </div>
    </div>
  );
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', HOOK_OPTS.findIndex(o => o.id === v), false, 0);
  };
  const tanlangan = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('bs-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Bitta foydalanuvchi sizga <A>qanchaga tushadi?</A></>, ru: <>Во сколько вам <A>обходится один пользователь?</A></> })}
          mentor={<Mentor>{tr({ uz: "12-Modulda foydalanuvchilarni o'z kanallaringizdagi postlar orqali yig'dingiz — o'sha kunlarni eslab, javobni tanlang.", ru: 'В 12-м модуле вы собирали пользователей постами в своих каналах — вспомните те дни и выберите ответ.' })}</Mentor>}
          maket={<HookMaket tanlov={picked} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={<>
            {tanlangan && <p className="hook-ack fade-step">{tr(tanlangan.javob)}</p>}
            {isLive && (picked !== null || live.mode === 'mentor') && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.label))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        >
          <Ustoz satrlar={USTOZ.s0} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chap — menyu osti + sahna o'zi yuradi, ustun nomlari haqiqiy, son o'rnida «?» — P-036, SABOQ D 33) =====
const REJA = [
  { t: { uz: "Bitta foydalanuvchini olib kelish qanchaga tushishini sanaysiz", ru: 'Посчитаете, во сколько обходится привести одного пользователя' }, teg: { uz: 'jalb qilish narxi', ru: 'цена привлечения' } },
  { t: { uz: 'Foydalanuvchi qancha pul keltirishini hisoblab, solishtirasiz', ru: 'Посчитаете, сколько денег приносит пользователь, и сравните' }, teg: { uz: 'keltiradigan pul', ru: 'приносимые деньги' } },
  { t: { uz: "Ikki sonni o'z mahsulotingiz uchun yozasiz", ru: 'Запишете два числа для своего продукта' }, teg: { uz: 'taxmin', ru: 'предположение' } },
  { t: { uz: 'Ikki sonni hisoblaydigan kod yozasiz', ru: 'Напишете код, который считает два числа' }, teg: { uz: 'kod oynasi', ru: 'окно кода' } }
];
const RejaSahna = () => {
  const [f, setF] = useState(() => (kamHarakat() ? 5 : 0));
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const ts = [150, 380, 610, 850, 1250].map((ms, i) => setTimeout(() => setF(i + 1), ms));
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <div className="bs-reja">
      <div className="bs-kanallar qator">
        {MENTOR_KANALLAR.map((k, i) => f > i && <KanalKarta key={k.id} nom={tr(k.nom)} som={'?' + NB + tr({ uz: "so'm", ru: 'сум' })} holat="kutish kir" />)}
      </div>
      {f >= 4 && <OdamTor n={44} className="kichik" qadam={8} />}
      <Ustunlar jalb="?" keltir="?" ixcham chegara={false}
        jalbY={tr({ uz: 'bitta foydalanuvchiga', ru: 'на одного пользователя' })}
        keltirY={tr({ uz: 'bitta foydalanuvchidan', ru: 'от одного пользователя' })} className={f >= 5 ? 'kir' : 'yashirin'} />
      <span className="bs-kulrang">{tr({ uz: "Bu modulda haqiqiy pul to'lanmaydi va so'ralmaydi.", ru: 'В этом модуле настоящие деньги не платят и не просят.' })}</span>
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="bs-r">
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun foydalanuvchi uchun <A>ikki sonni hisoblaysiz.</A></>, ru: <>Сегодня вы посчитаете <A>два числа</A> для пользователя.</> })}
        mentor={<Mentor>{tr({ uz: "Sonlar 12-Moduldagi kanallaringiz va metrika hisobotingizdan olinadi. Ular topilmasa — o'zingiz yozasiz.", ru: 'Числа берутся из ваших каналов и отчёта по метрикам из 12-го модуля. Если их нет — напишете сами.' })}</Mentor>}
        chapYorliq={<>{tr({ uz: 'Dars oxirida', ru: 'В конце урока' })} <span className="bs-chap-y">{tr({ uz: 'jalb qilish narxi va foydalanuvchi keltiradigan pul', ru: 'цена привлечения и деньги, которые приносит пользователь' })}</span></>}
        chap={<RejaSahna />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <Ustoz satrlar={USTOZ.s1} />
      </QReja>
    </div>
  </Stage>
);

// ===== SCREEN 2 — JALB QILISH NARXI (QTushuncha, 2 qadam; bashorat → 3 kanal → 44 belgi → natija 0 → «Agar pullik kanal bo'lsa?» → 12 belgi, 5 000) =====
const S2_SAVOL = { uz: "Bitta foydalanuvchini olib kelish necha so'mga tushgan?", ru: 'Во сколько обошлось привести одного пользователя?' };
const S2_TAXMIN = [
  { k: '0', t: { uz: "0 so'm", ru: '0 сумов' } },
  { k: 'ming', t: { uz: "bir necha ming so'm", ru: 'несколько тысяч сумов' } },
  { k: 'kop', t: { uz: "o'n ming so'mdan ko'p", ru: 'больше десяти тысяч сумов' } }
];
const QadamChiziq = ({ qadamlar, joriy }) => (
  <div className="bs-qchiziq">{qadamlar.map((q, i) => <span key={i} className={cxx('bs-qc', i < joriy && 'otdi', i === joriy && 'joriy')}><i>{i < joriy ? '✓' : i + 1}</i>{q}</span>)}</div>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [bosilgan, setBosilgan] = useState(() => (avval ? MENTOR_KANALLAR.map(k => k.id) : []));
  const [agar, setAgar] = useState(avval);
  const [uch, qatlam] = useUchish();
  const kRef = useRef({}), sarfRef = useRef(null), agarRef = useRef(null);
  const bepulTayyor = bosilgan.length >= 3;
  const done = bepulTayyor && agar;
  const tugadi = useTugadi(done, 1500, avval);
  const odamN = useSanash(bepulTayyor ? MENTOR_SONLAR.yangi : 0, 1100);
  const agarN = useSanash(agar ? AGAR.yangi : 0, 700);
  const ochiq = !!taxmin || isMentor;
  const ipucha = useIpucha(ochiq && !done, bosilgan.length + (agar ? 1 : 0));
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = (k) => {
    if (!ochiq || bosilgan.includes(k.id)) return;
    uch(kRef.current[k.id], sarfRef.current, '0' + NB + tr({ uz: "so'm", ru: 'сум' }));
    setBosilgan(b => [...b, k.id]);
  };
  const agarBos = () => { if (!bepulTayyor || agar) return; setAgar(true); setTimeout(() => uch(agarRef.current, sarfRef.current, sonFmt(AGAR.sarf) + NB + tr({ uz: "so'm", ru: 'сум' })), 60); };
  const joriyK = MENTOR_KANALLAR.find(k => !bosilgan.includes(k.id));
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const qadam = !bepulTayyor ? 0 : !agar ? 1 : 2;
  const somY = tr({ uz: "so'm", ru: 'сум' });
  const natijaQ = (sarf, yangi, nat) => <>{sonFmt(sarf)}{NB}{tr({ uz: "so'mni", ru: 'сумов делим на' })} {yangi}{NB}{tr({ uz: 'kishiga bo\'lamiz', ru: 'человек' })} <b>→ {sonFmt(nat)}{NB}{somY}</b></>;
  const ustunKarta = (
    <div className={cxx('bs-ukarta', tugadi && 'toliq')}>
      <span className="bs-ukarta-h">{tr({ uz: 'Bitta foydalanuvchiga', ru: 'На одного пользователя' })}</span>
      {!tugadi && <>
        <div className="bs-uq"><span>{tr({ uz: 'Kanallarga sarflangan pul', ru: 'Потрачено на каналы' })}:</span><b ref={sarfRef} key={'s' + bosilgan.length} className={cxx(bosilgan.length > 0 && 'yangi')}>{bepulTayyor ? '0' : bosilgan.length ? Array(bosilgan.length).fill('0').join(' + ') : '?'}{NB}{somY}</b></div>
        <div className="bs-uq"><span>{tr({ uz: 'Shu davrda yangi foydalanuvchilar', ru: 'Новых пользователей за период' })}:</span><b key={'y' + bepulTayyor} className={cxx(bepulTayyor && 'yangi')}>{bepulTayyor ? odamN : '?'}</b></div>
        <div className={cxx('bs-unat', bepulTayyor && 'ok')}>{bepulTayyor ? natijaQ(0, MENTOR_SONLAR.yangi, 0) : <>?{NB}{somY}</>}</div>
        {bepulTayyor && <QIzoh>{tr({ uz: "Bu misolda pul sarflanmagan — vaqt sarflangan. Guruh va sinf chatidagi a'zolar soni cheklangan.", ru: 'В этом примере деньги не потрачены — потрачено время. Участников в группе и чате класса немного.' })}</QIzoh>}
        {agar && <div className="bs-unat agar fade-step">{natijaQ(AGAR.sarf, AGAR.yangi, AGAR.sarf / AGAR.yangi)}</div>}
        {agar && <QIzoh>{tr({ uz: "Mashq sonlari — Mentorning taxmini: hech qayerga pul to'lanmagan.", ru: 'Числа упражнения — предположение Ментора: никуда деньги не платились.' })}</QIzoh>}
      </>}
      {tugadi && <div className="bs-ikki-nat">
        <div className="bs-nat-k"><span>{tr({ uz: 'bepul kanallar', ru: 'бесплатные каналы' })}</span><b>0{NB}{somY}</b><em>{tr({ uz: "Bu misolda pul sarflanmagan — vaqt sarflangan. Guruh va sinf chatidagi a'zolar soni cheklangan.", ru: 'В этом примере деньги не потрачены — потрачено время. Участников в группе и чате класса немного.' })}</em></div>
        <div className="bs-nat-k agar"><span>{tr({ uz: 'pullik kanal (mashq)', ru: 'платный канал (упражнение)' })}</span><b>{sonFmt(AGAR.sarf / AGAR.yangi)}{NB}{somY}</b><em>{tr({ uz: "Mashq sonlari — Mentorning taxmini: hech qayerga pul to'lanmagan.", ru: 'Числа упражнения — предположение Ментора: никуда деньги не платились.' })}</em></div>
      </div>}
    </div>
  );
  const kanalQism = !tugadi && (
    <div className="bs-kq">
      <span className="bs-yorliq">{tr({ uz: 'Mentor misolida', ru: 'В примере Ментора' })}</span>
      <div className={cxx('bs-kanallar', ochiq && !bepulTayyor && 'bs-chorla')}>
        {MENTOR_KANALLAR.map(k => {
          const b = bosilgan.includes(k.id);
          return <KanalKarta key={k.id} kRef={(el) => { kRef.current[k.id] = el; }} nom={tr(k.nom)} som={(b ? '0' : '?') + NB + somY} holat={b ? 'ochiq' : 'kutish'} faol={ochiq && joriyK && joriyK.id === k.id} disabled={!ochiq || b} onClick={() => bos(k)} />;
        })}
        {agar && <KanalKarta agar kRef={agarRef} nom={tr({ uz: 'pullik kanal', ru: 'платный канал' })} som={sonFmt(AGAR.sarf) + NB + somY} holat="ochiq kir" />}
      </div>
      {bepulTayyor && !agar && <QTugma className="bs-halqa bs-agar-btn" onClick={agarBos}>{tr({ uz: "Agar pullik kanal bo'lsa?", ru: 'А если канал платный?' })}</QTugma>}
      {bepulTayyor && <div className="bs-maydon fade-step">
        <span className="bs-maydon-h">{tr({ uz: "Shu davrda ro'yxatdan o'tganlar", ru: 'Зарегистрировались за период' })}</span>
        <OdamTor n={odamN} tashkil={false} className="kichik" qadam={14} />
        <span className="bs-kulrang qora">{tr({ uz: 'Shu davrda yangi foydalanuvchilar', ru: 'Новых пользователей за период' })}: <b>{odamN}{NB}{tr({ uz: 'kishi', ru: 'чел.' })}</b> · {tr(MENTOR_SONLAR.davr)}</span>
        <span className="bs-kulrang">{MENTOR_SONLAR.sinfdosh} {tr({ uz: 'tasi — sinfdosh', ru: 'из них — одноклассники' })}</span>
        {agar && <div className="bs-agar-odam fade-step"><OdamTor n={agarN} jami={AGAR.yangi} kiyim={3} tashkil={false} /><span className="bs-kulrang">{tr({ uz: "«agar» mashqi: shu kanal davrida 12 kishi ro'yxatdan o'tsa", ru: 'упражнение «если»: если за период канала зарегистрируются 12 человек' })}</span></div>}
      </div>}
    </div>
  );
  const navL = !ochiq ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !bepulTayyor ? { uz: `Kanallarni bosing (${bosilgan.length}/3)`, ru: `Нажмите каналы (${bosilgan.length}/3)` } : !agar ? { uz: "Pullik kanalni ko'ring", ru: 'Посмотрите платный канал' } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · jalb qilish narxi', ru: 'Понятие · цена привлечения' })} screen={screen} scrollSignal={bosilgan.length + (agar ? 4 : 0) + (taxmin ? 8 : 0)} deskSignal={bepulTayyor && !agar ? 1 : 0} deskDelay={1300} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Mentor misolida bitta foydalanuvchi <A>qanchaga tushdi?</A></>, ru: <>Во сколько обошёлся <A>один пользователь</A> в примере Ментора?</> })}
        mentor={<Mentor>{bepulTayyor && !agar
          ? tr({ uz: "Endi «Agar pullik kanal bo'lsa?» tugmasini bosing — ikki natijani solishtiring.", ru: 'Теперь нажмите кнопку «А если канал платный?» — сравните два результата.' })
          : tr({ uz: "Mentor shu davrda kanallarga post yozgan — har kanalni bosib, unga qancha pul ketganini ko'ring.", ru: 'Ментор за этот период писал посты в каналы — нажимайте каждый канал и смотрите, сколько денег на него ушло.' })}</Mentor>}
        bashorat={<>
          {!taxmin && !isMentor && <QBashorat yorliq={tr(BASHORAT_YORLIQ)} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={(k) => { setTaxmin(k); if (live && live.mode === 'student') live.submitAnswer(screen, 'jalb', 0, true, 0); }} />}
          {taxmin && !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tx ? tr(tx.t) : ''} />}
          {ochiq && !tugadi && <QadamChiziq joriy={qadam} qadamlar={[tr({ uz: 'Bepul kanallar', ru: 'Бесплатные каналы' }), tr({ uz: 'Pullik kanal', ru: 'Платный канал' })]} />}
        </>}
        harakat={kanalQism}
        vizual={ustunKarta}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={taxmin === '0'} haqiqat={'0' + NB + somY} />}
          matn={tr({ uz: "Bir davrda kanallarga sarflangan pulni shu davrda kelgan yangi foydalanuvchilarga bo'lsak — jalb qilish narxi.", ru: 'Если деньги, потраченные на каналы за период, разделить на новых пользователей за этот период, — это цена привлечения.' })} />}
      >
        {ipucha && <p className="bs-ipucha fade-step">{tr({ uz: "Halqadagi kanal kartasini bosing — unga ketgan pul shu yerda yoziladi.", ru: 'Нажмите карточку канала в рамке — потраченные на него деньги запишутся здесь.' })}</p>}
        <Ustoz satrlar={USTOZ.s2} />
      </QTushuncha>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s3 = 1; material — kitob almashish ilovasi, «mashq sonlari»; savol ustida yorliq yo'q — SABOQ 6) =====
const KitobKarta = ({ yon }) => (
  <div className={cxx('bs-mat', yon && 'yon')}>
    <span className="bs-mat-y">{tr({ uz: 'mashq sonlari', ru: 'числа упражнения' })}</span>
    <b className="bs-mat-h">{tr({ uz: 'Kitob almashish ilovasi · shu oy', ru: 'Приложение обмена книгами · этот месяц' })}</b>
    <span className="bs-mat-q">{tr({ uz: 'Pullik kanalga', ru: 'Платному каналу' })}: <b className="pul">24{NB}000{NB}{tr({ uz: "so'm", ru: 'сум' })}</b></span>
    <span className="bs-mat-q">{tr({ uz: 'Shu oy kelgan yangi foydalanuvchilar', ru: 'Новых пользователей за этот месяц' })}: <b className="yangi">8{NB}{tr({ uz: 'kishi', ru: 'чел.' })}</b> ({tr({ uz: '3 tasi — sinfdosh', ru: '3 из них — одноклассники' })})</span>
    <span className="bs-mat-q">{tr({ uz: 'Ilovada jami', ru: 'Всего в приложении' })}: 12{NB}{tr({ uz: 'kishi', ru: 'чел.' })}</span>
  </div>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · jalb qilish narxi', ru: 'Проверка · цена привлечения' })}
    questionText="Bitta yangi foydalanuvchini jalb qilish narxi necha so'm?"
    question={<><KitobKarta /><h2 className="title h-ask">{tr({ uz: <>Bitta yangi foydalanuvchini jalb qilish narxi <A>necha so'm?</A></>, ru: <>Сколько сумов стоит <A>привлечь одного нового пользователя?</A></> })}</h2></>}
    options={[
      { uz: "2 000 so'm", ru: '2 000 сумов' },
      { uz: "3 000 so'm", ru: '3 000 сумов' },
      { uz: "4 800 so'm", ru: '4 800 сумов' },
      { uz: "24 000 so'm", ru: '24 000 сумов' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Pul shu oy kelgan 8 kishiga bo'linadi — sinfdoshlar ham.", ru: 'Деньги делят на 8 человек, пришедших в этом месяце, — одноклассников тоже.' }}
    explainWrong={{
      0: { uz: '12 — ilovadagi hamma. Shu oy nechtasi yangi keldi?', ru: '12 — все в приложении. Сколько пришло новых в этом месяце?' },
      2: { uz: 'Sinfdoshlar ham yangi foydalanuvchi — ular sanaladimi?', ru: 'Одноклассники — тоже новые пользователи. Их считают?' },
      3: { uz: 'Bu — butun pul. Bitta foydalanuvchiga qanchadan tushadi?', ru: 'Это все деньги. Сколько приходится на одного пользователя?' },
      default: { uz: "Pul qaysi foydalanuvchilarga bo'linishini eslang.", ru: 'Вспомните, на каких пользователей делят деньги.' }
    }}
    vizual={<div className="bs-tviz"><span className="bs-tv-q"><b className="pul">24{NB}000{NB}{tr({ uz: "so'm", ru: 'сум' })}</b><i className="bs-tv-ch" /><b className="yangi">8{NB}{tr({ uz: 'kishi', ru: 'чел.' })}</b><i className="bs-tv-ch" /><b className="nat">3{NB}000{NB}{tr({ uz: "so'm", ru: 'сум' })}</b></span></div>} />
);

// ===== SCREEN 4 — KELTIRADIGAN PUL (QTushuncha, 3 tugma: O'yinchi · Tashkilotchi · Uch oy; telefon chapda) =====
const S4_SAVOL = { uz: "44 kishidan nechtasi ilovaga pul to'lashi mumkin?", ru: 'Сколько из 44 человек могут платить приложению?' };
const S4_TAXMIN = [
  { k: 'oz', t: { uz: 'ozchiligi', ru: 'меньшинство' } },
  { k: 'yarmi', t: { uz: 'yarmi', ru: 'половина' } },
  { k: 'hammasi', t: { uz: 'hammasi', ru: 'все' } }
];
const S4_TUGMA = [{ uz: "O'yinchi", ru: 'Игрок' }, { uz: 'Tashkilotchi', ru: 'Организатор' }, { uz: 'Uch oy', ru: 'Три месяца' }];
const TugmaQator = ({ tugmalar, n, ochiq, onBos, className }) => (
  <div className={cxx('bs-tqator', ochiq && n < tugmalar.length && 'bs-chorla-t', className)}>
    {tugmalar.map((t, i) => <button key={i} type="button" className={cxx('bs-tugma', i < n && 'otdi', i === n && ochiq && 'joriy')} disabled={!ochiq || i !== n} onClick={() => onBos(i)}><i>{i < n ? '✓' : i + 1}</i>{tr(t)}</button>)}
  </div>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const [oy, setOy] = useState(avval ? 3 : 0);
  const done = n >= 3 && oy >= 3;
  const tugadi = useTugadi(done, 1500, avval);
  const ochiq = !!taxmin || isMentor;
  const ipucha = useIpucha(ochiq && n < 3, n);
  const pul = useSanash(oy * MENTOR_SONLAR.narx, 500);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => {
    if (n < 3 || oy >= 3) return undefined;
    if (kamHarakat()) { setOy(3); return undefined; }
    const t = setTimeout(() => setOy(o => o + 1), 520);
    return () => clearTimeout(t);
  }, [n, oy]);
  const bos = (i) => { if (i !== n) return; setN(i + 1); };
  const rejim = n === 0 ? null : n === 1 ? 'oyinchi' : 'tashkilotchi';
  const tx = S4_TAXMIN.find(x => x.k === taxmin);
  const somY = tr({ uz: "so'm", ru: 'сум' });
  const PRO_IZ = { uz: "3 oy — taxmin: qaytganlar foizi (43%) ilovani yana ochganlarni sanaydi, pullik obunani emas.", ru: '3 месяца — предположение: доля вернувшихся (43%) считает тех, кто снова открыл приложение, а не платную подписку.' };
  const karta = (
    <div className={cxx('bs-ukarta', tugadi && 'toliq')}>
      {n >= 2 && !tugadi && <div className="bs-tash-ch fade-step"><span className="bs-tash-odam">{TASHKILOTCHI_I.map((i, j) => <BelgiSvg key={i} i={i} kiyim={T.accent} bayroq style={{ animationDelay: `${j * 70}ms` }} className="kir" />)}</span><span>{tr({ uz: '44 kishidan 6 tasi — tashkilotchi', ru: '6 из 44 — организаторы' })}</span></div>}
      <span className="bs-ukarta-h">{tr({ uz: 'Bitta foydalanuvchidan', ru: 'От одного пользователя' })}</span>
      {n === 0 && <div className="bs-unat">?{NB}{somY}</div>}
      {n >= 1 && <div className="bs-uq kir"><span>{tr({ uz: "O'yinchi", ru: 'Игрок' })}:</span><b>0{NB}{somY}{!tugadi && <> — {tr({ uz: 'ilova unga bepul', ru: 'для него приложение бесплатно' })}</>}</b></div>}
      {n >= 2 && <div className={cxx('bs-pro', !tugadi && 'kir')}>
        <span className="bs-pro-y">{tr({ uz: 'Mentorning rejasi', ru: 'План Ментора' })}</span>
        <span>{tr({ uz: "Pro — tashkilotchi 30 kun uchun to'laydi: pullik obuna", ru: 'Pro — организатор платит за 30 дней: платная подписка' })}</span>
        {!tugadi && <span>{tr({ uz: "Pro'da: «Doimiy o'yin» — har hafta shu kun va soatda o'yin o'zi e'lon qilinadi", ru: 'В Pro: «Постоянная игра» — каждую неделю в тот же день и час игра объявляется сама' })}</span>}
      </div>}
      {n >= 2 && !tugadi && <div className="bs-uq kir"><span>{tr({ uz: 'Tashkilotchi', ru: 'Организатор' })}:</span><b>Pro — {tr({ uz: '30 kunga', ru: 'за 30 дней' })} {sonFmt(MENTOR_SONLAR.narx)}{NB}{somY} · <em>{tr({ uz: 'Mentorning taxmini', ru: 'предположение Ментора' })}</em></b></div>}
      {n >= 3 && !tugadi && <>
        <span className="bs-kulrang">{tr({ uz: "Mentorning taxmini: tashkilotchi Pro'ni o'rtacha 3 oy ushlab turadi", ru: 'Предположение Ментора: организатор держит Pro в среднем 3 месяца' })}</span>
        <div className="bs-oylar">{[1, 2, 3].map(o => <span key={o} className={cxx('bs-oy', o <= oy && 'tushdi')}><b>{o}-{tr({ uz: 'oy', ru: 'й мес.' })}</b>{o <= oy && <i className="bs-tanga">{sonFmt(MENTOR_SONLAR.narx)}{NB}{somY}</i>}</span>)}</div>
      </>}
      {n >= 3 && <Ustunlar jalb={null} keltir={pul} keltirY={tr({ uz: 'Keltiradigan pul', ru: 'Приносимые деньги' })} className="yakka" />}
      {n >= 3 && oy >= 3 && !tugadi && <div className="bs-unat ok kir">{tr({ uz: 'Bitta tashkilotchidan', ru: 'От одного организатора' })}: <b>{sonFmt(MENTOR_SONLAR.keltiradi)}{NB}{somY}</b> · {tr({ uz: 'taxmin', ru: 'предположение' })}</div>}
      {tugadi && <div className="bs-uq"><span>{tr({ uz: 'Tashkilotchi', ru: 'Организатор' })}:</span><b>{sonFmt(MENTOR_SONLAR.keltiradi)}{NB}{somY} · {tr({ uz: 'taxmin', ru: 'предположение' })}</b></div>}
      {n >= 3 && oy >= 3 && !tugadi && <QIzoh>{tr(PRO_IZ)}</QIzoh>}
    </div>
  );
  const navL = !ochiq ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Tugmalarni bosing (${n}/3)`, ru: `Нажмите кнопки (${n}/3)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · keltiradigan pul', ru: 'Понятие · приносимые деньги' })} screen={screen} scrollSignal={n + (taxmin ? 4 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval={false}
        sarlavha={tr({ uz: <>Bitta foydalanuvchi <A>qancha pul keltiradi?</A></>, ru: <>Сколько денег <A>приносит один пользователь?</A></> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolida foydalanuvchilar ilovada har xil ish qiladi — tugmalarni birma-bir bosib, telefonga qarang.", ru: 'В примере Ментора пользователи делают в приложении разное — нажимайте кнопки по одной и смотрите на телефон.' })}</Mentor>}
        bashorat={<>
          {!taxmin && !isMentor && <QBashorat yorliq={tr(BASHORAT_YORLIQ)} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={(k) => { setTaxmin(k); if (live && live.mode === 'student') live.submitAnswer(screen, 'keltir', 0, true, 0); }} />}
          {taxmin && !done && <BashoratQ savol={tr(S4_SAVOL)} javob={tx ? tr(tx.t) : ''} />}
        </>}
        vizual={<div className={cxx('bs-ikki', tugadi && 'toliq')}><Telefon rejim={rejim} /><div className="bs-ong">{karta}{!tugadi && <TugmaQator tugmalar={S4_TUGMA} n={n} ochiq={ochiq} onBos={bos} />}</div></div>}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={taxmin === 'oz'} haqiqat={tr({ uz: 'ozchiligi — 44 kishidan 6 tasi', ru: 'меньшинство — 6 из 44' })} />}
          matn={tr({ uz: 'Bitta foydalanuvchidan butun foydalanish davomida keladigan pul — foydalanuvchi keltiradigan pul.', ru: 'Деньги, которые приходят от одного пользователя за всё время использования, — это деньги, которые приносит пользователь.' })}
          izoh={tr(PRO_IZ)} />}
      >
        {ipucha && <p className="bs-ipucha fade-step">{tr({ uz: 'Yoqilgan tugmani bosing — telefonda nima o\'zgarishini ko\'ring.', ru: 'Нажмите активную кнопку — посмотрите, что изменится на телефоне.' })}</p>}
        <Ustoz satrlar={USTOZ.s4} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — IKKI SONNI SOLISHTIRISH (QTushuncha, 2 tugma; «agar» kanal: bitta foydalanuvchi va bitta tashkilotchi, muhr «zarar») =====
const S5_SAVOL = { uz: "12 kishidan bittasi tashkilotchi bo'lsa, uni jalb qilish necha so'mga tushadi?", ru: 'Если один из 12 — организатор, во сколько обходится его привлечь?' };
const S5_TAXMIN = [
  { k: '5000', t: { uz: "5 000 so'm", ru: '5 000 сумов' } },
  { k: '30000', t: { uz: "30 000 so'm", ru: '30 000 сумов' } },
  { k: '60000', t: { uz: "60 000 so'm", ru: '60 000 сумов' } }
];
const S5_TUGMA = [{ uz: 'Bitta foydalanuvchiga', ru: 'На одного пользователя' }, { uz: 'Bitta tashkilotchiga', ru: 'На одного организатора' }];
const ZARAR_BAHO = { uz: "Zarar — baho emas: qaysi son o'zgarishi kerakligini ko'rsatadi.", ru: 'Убыток — не оценка: он показывает, какое число должно измениться.' };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 2 : 0);
  const done = n >= 2;
  const tugadi = useTugadi(done, 1700, avval);
  const ochiq = !!taxmin || isMentor;
  const ipucha = useIpucha(ochiq && !done, n);
  const jalb = useSanash(n === 0 ? 0 : n === 1 ? AGAR.sarf / AGAR.yangi : AGAR.sarf, 800);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tx = S5_TAXMIN.find(x => x.k === taxmin);
  const somY = tr({ uz: "so'm", ru: 'сум' });
  const IKKITA = 7;
  const chap = !tugadi && (
    <div className="bs-kq">
      <KanalKarta agar nom={tr({ uz: 'pullik kanal', ru: 'платный канал' })} som={sonFmt(AGAR.sarf) + NB + somY} holat="ochiq" />
      <OdamTor n={AGAR.yangi} jami={AGAR.yangi} kiyim={3} tashkil={false} className={cxx('oniki', n === 2 && 'yigildi')}
        ajrat={n === 2 ? 'tashkilotchi' : undefined}
        ustida={n >= 1 ? (i) => (n === 1 ? sonFmt(AGAR.sarf / AGAR.yangi) : i === IKKITA ? sonFmt(AGAR.sarf) : null) : undefined} />
      {n === 2 && <span className="bs-kulrang qora fade-step"><BelgiSvg i={IKKITA} kiyim={T.accent} bayroq className="mini" /> {tr({ uz: 'tashkilotchi', ru: 'организатор' })}</span>}
    </div>
  );
  const jalbY = n === 0 ? tr({ uz: 'Jalb qilish narxi', ru: 'Цена привлечения' }) : n === 1 ? tr({ uz: 'Jalb qilish narxi — bitta foydalanuvchiga', ru: 'Цена привлечения — на одного пользователя' }) : tr({ uz: 'Jalb qilish narxi — bitta tashkilotchiga', ru: 'Цена привлечения — на одного организатора' });
  const ustun = (
    <div className={cxx('bs-ukarta', tugadi && 'toliq')}>
      <Ustunlar jalb={n === 0 ? '?' : jalb} keltir={MENTOR_SONLAR.keltiradi} jalbY={jalbY}
        keltirY={tr({ uz: 'Keltiradigan pul — bitta tashkilotchidan', ru: 'Приносимые деньги — от одного организатора' })} keltirIz={tr({ uz: 'taxmin', ru: 'предположение' })}
        muhr={n === 0 ? undefined : n === 1 ? null : 'zarar'}
        oraQator={n === 1 && tr({ uz: "Lekin ulardan bittasi to'laydi — qolganlari pul to'lamaydi.", ru: 'Но платит только один из них — остальные не платят.' })} />
      {n === 2 && <QIzoh>{tr({ uz: "Pul to'laydigan foydalanuvchi — to'lovchi: ikki son uning uchun solishtiriladi.", ru: 'Пользователь, который платит, — плательщик: два числа сравнивают для него.' })}</QIzoh>}
    </div>
  );
  const navL = !ochiq ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Tugmalarni bosing (${n}/2)`, ru: `Нажмите кнопки (${n}/2)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · solishtirish', ru: 'Понятие · сравнение' })} screen={screen} scrollSignal={n + (taxmin ? 4 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval={false}
        sarlavha={tr({ uz: <>Pullik kanal Mentor misolida <A>o'z pulini qoplaydimi?</A></>, ru: <>Окупает ли платный канал <A>свои деньги</A> в примере Ментора?</> })}
        mentor={<Mentor>{tr({ uz: 'Pullik kanal mashqidagi sonlar qaytdi — tugmalarni birma-bir bosib, ustunlarga qarang.', ru: 'Вернулись числа из упражнения с платным каналом — нажимайте кнопки по одной и смотрите на столбики.' })}</Mentor>}
        bashorat={<>
          {!taxmin && !isMentor && <QBashorat yorliq={tr(BASHORAT_YORLIQ)} savol={tr(S5_SAVOL)} variantlar={S5_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={(k) => { setTaxmin(k); if (live && live.mode === 'student') live.submitAnswer(screen, 'solishtir', 0, true, 0); }} />}
          {taxmin && !done && <BashoratQ savol={tr(S5_SAVOL)} javob={tx ? tr(tx.t) : ''} />}
        </>}
        vizual={<div className={cxx('bs-ikki', 'sol', tugadi && 'toliq')}>{chap}{ustun}</div>}
        harakat={!tugadi && <TugmaQator tugmalar={S5_TUGMA} n={n} ochiq={ochiq} onBos={(i) => { if (i === n) setN(i + 1); }} />}
        xulosa={done && <XulosaQ natija={tx && <TaxminQ togri={taxmin === '60000'} haqiqat={sonFmt(AGAR.sarf) + NB + somY} />}
          matn={tr({ uz: "Keltiradigan pul to'lovchini jalb qilish narxini qoplashi kerak; bu misolda qoplamaydi — zarar.", ru: 'Деньги, которые приносит плательщик, должны покрывать цену его привлечения; в этом примере не покрывают — убыток.' })}
          izoh={tr(ZARAR_BAHO)} />}
      >
        {ipucha && <p className="bs-ipucha fade-step">{tr({ uz: "Yoqilgan tugmani bosing — ustunlar qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как изменятся столбики.' })}</p>}
        <Ustoz satrlar={USTOZ.s5} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 6 — 2-SAVOL (QuestionScreen → QTest; ✔ D, INLINE_KEYS.s6 = 3; Mentor misoli) =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · solishtirish', ru: 'Проверка · сравнение' })}
    questionText="Mentor misolida pullik kanal o'z pulini qoplashini qaysi sonlar ko'rsatadi?"
    question={<h2 className="title h-ask">{tr({ uz: <>Mentor misolida pullik kanal o'z pulini qoplashini <A>qaysi sonlar ko'rsatadi?</A></>, ru: <>Какие числа показывают, <A>окупает ли платный канал</A> свои деньги в примере Ментора?</> })}</h2>}
    options={[
      { uz: "Bitta foydalanuvchini jalb qilish narxi va Pro'dan keladigan pul", ru: 'Цена привлечения одного пользователя и деньги от Pro' },
      { uz: 'Kanaldan kelgan yangi kishilar soni va kanalga sarflangan pul', ru: 'Число новых людей из канала и деньги, потраченные на канал' },
      { uz: "Bitta tashkilotchini jalb qilish narxi va Pro'ning 30 kunlik narxi", ru: 'Цена привлечения одного организатора и цена Pro за 30 дней' },
      { uz: 'Bitta tashkilotchini jalb qilish narxi va u keltiradigan pul', ru: 'Цена привлечения одного организатора и деньги, которые он приносит' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Ikki son ham bitta tashkilotchi — to'lovchi haqida.", ru: 'Оба числа — об одном организаторе, плательщике.' }}
    explainWrong={{
      0: { uz: "Bitta foydalanuvchi to'lamasligi mumkin — kim to'laydi?", ru: 'Один пользователь может не платить — кто платит?' },
      1: { uz: 'Kishilar soni — pul emas. Qaysi ikki pul solishtiriladi?', ru: 'Число людей — не деньги. Какие две суммы сравнивают?' },
      2: { uz: "Tashkilotchi bir oy emas, bir necha oy to'laydi.", ru: 'Организатор платит не один месяц, а несколько.' },
      default: { uz: "Ikki son bitta to'lovchi haqidami — tekshiring.", ru: 'Проверьте: оба числа об одном плательщике?' }
    }}
    vizual={<Ustunlar ixcham jalb={AGAR.sarf} keltir={MENTOR_SONLAR.keltiradi} muhr="zarar" chegara={false} />} />
);

// ===== IKKI SONIM — hisoblash qoidasi (MD KOD 8; bitta funksiya, PM-108: node da 10+ namuna) va kalit pm-m11d1-birlik (tayanch 8 aynan) =====
const HAMMA = 'hamma foydalanuvchi';
const sonOl = (v) => { const s = String(v ?? '').replace(/[\s.,]/g, '').split(NB).join(''); return /^\d+$/.test(s) ? Number(s) : null; };
// f: { kanallar: [{ nom, sarf, yangi }], yangi, yangiBilmayman, davr, kanalBilan, kim, kimTur, narx, oy, narxBilmayman, tur }
function birlikHisob(f) {
  const rows = (f.kanallar || []).map(k => ({ nom: String(k.nom || '').trim(), sarf: sonOl(k.sarf), yangi: sonOl(k.yangi) }));
  const sarfJami = rows.reduce((a, k) => a + (k.sarf || 0), 0);
  const yangiJami = f.kanalBilan
    ? (rows.length && rows.every(k => k.yangi !== null) ? rows.reduce((a, k) => a + k.yangi, 0) : null)
    : (f.yangiBilmayman ? null : sonOl(f.yangi));
  const jalbNarxi = yangiJami === null || yangiJami === 0 ? null : Math.round(sarfJami / yangiJami);
  const narxTaxmin = f.narxBilmayman ? null : sonOl(f.narx);
  const oyTaxmin = f.narxBilmayman ? null : sonOl(f.oy);
  const keltiradi = narxTaxmin !== null && oyTaxmin !== null ? narxTaxmin * oyTaxmin : null;
  const kimTolaydi = f.kimTur === 'hamma' ? HAMMA : f.kimTur === 'bilmayman' ? null : (String(f.kim || '').trim() || null);
  let xulosa, sabab;
  if (jalbNarxi === null) { xulosa = 'nomalum'; sabab = yangiJami === 0 ? 'nol' : 'yangisiz'; }
  else if (sarfJami === 0) { xulosa = 'sarfsiz'; sabab = 'sarfsiz'; }
  else if (keltiradi === null) { xulosa = 'nomalum'; sabab = 'pulsiz'; }
  else if (kimTolaydi !== HAMMA) { xulosa = 'nomalum'; sabab = 'tolovchisiz'; }
  else if (jalbNarxi < keltiradi) { xulosa = 'qoplanadi'; sabab = 'qoplanadi'; }
  else if (jalbNarxi > keltiradi) { xulosa = 'zarar'; sabab = 'zarar'; }
  else { xulosa = 'teng'; sabab = 'teng'; }
  return { rows, sarfJami, yangiJami, jalbNarxi, narxTaxmin, oyTaxmin, keltiradi, kimTolaydi, xulosa, sabab };
}
const HALOL = {
  sarfsiz: { uz: "Kanallarga pul sarflanmagan — vaqt sarflangan, u bu songa kirmaydi.", ru: 'Деньги на каналы не тратились — тратилось время, оно в это число не входит.' },
  pulsiz: { uz: "Kim to'lashi yoki qancha to'lashi hali noma'lum — bu ham halol javob.", ru: 'Кто будет платить или сколько — пока неизвестно; это тоже честный ответ.' },
  tolovchisiz: { uz: "Bitta to'lovchini jalb qilish narxi kerak — to'lovchilar hali sanalmagan.", ru: 'Нужна цена привлечения одного плательщика — плательщиков ещё не считали.' },
  qoplanadi: { uz: "Keltiradigan pul — taxmin: hali hech kim to'lamagan.", ru: 'Приносимые деньги — предположение: ещё никто не платил.' },
  teng: { uz: "Ikki son teng: jalb qilish narxi zo'rg'a qoplanadi.", ru: 'Числа равны: цена привлечения еле покрывается.' },
  zarar: ZARAR_BAHO,
  nol: { uz: "Yangi foydalanuvchi 0 — bo'lib bo'lmaydi.", ru: 'Новых пользователей 0 — разделить нельзя.' },
  yangisiz: { uz: "Yangi foydalanuvchilar soni hali noma'lum.", ru: 'Число новых пользователей пока неизвестно.' }
};
// Kalitga yoziladigan yozuv (tayanch 8 — yangi maydon yo'q; ism, telefon yo'q; nom — kanal turi)
const birlikYozuv = (f) => {
  const h = birlikHisob(f);
  const kanallar = f.kanalBilan
    ? h.rows.map(k => ({ nom: k.nom || 'kanal', sarf: k.sarf || 0, yangi: k.yangi }))
    : [{ nom: h.rows.map(k => k.nom).filter(Boolean).join(', ') || 'kanal', sarf: h.sarfJami, yangi: h.yangiJami }];
  return { tur: f.tur === 'mashq' ? 'mashq' : 'real', davr: String(f.davr || '').trim(), kanallar, jalbNarxi: h.jalbNarxi, kimTolaydi: h.kimTolaydi, narxTaxmin: h.narxTaxmin, oyTaxmin: h.oyTaxmin, keltiradi: h.keltiradi, xulosa: h.xulosa, savedAt: Date.now() };
};
const birlikOl = () => { const b = lsO(BIRLIK_KEY); return b && Array.isArray(b.kanallar) ? b : null; };
// Saqlangan yozuvdan forma (✎ va 9-ekran «Tuzating» uchun)
const yozuvdanForma = (b) => {
  const bitta = b.kanallar.length === 1 || b.kanallar.some(k => k.yangi === null || k.yangi === undefined);
  const jamiY = b.kanallar.reduce((a, k) => a + (Number(k.yangi) || 0), 0);
  return {
    kanallar: bitta && b.kanallar.length === 1
      ? String(b.kanallar[0].nom || '').split(', ').map((nom, i) => ({ nom, sarf: i === 0 ? String(b.kanallar[0].sarf ?? '') : '0', yangi: '' }))
      : b.kanallar.map(k => ({ nom: k.nom || '', sarf: String(k.sarf ?? ''), yangi: k.yangi === null || k.yangi === undefined ? '' : String(k.yangi) })),
    yangi: bitta ? (b.kanallar[0].yangi === null || b.kanallar[0].yangi === undefined ? '' : String(b.kanallar[0].yangi)) : String(jamiY),
    yangiBilmayman: bitta && (b.kanallar[0].yangi === null || b.kanallar[0].yangi === undefined),
    davr: b.davr || '', kanalBilan: !bitta,
    kim: b.kimTolaydi && b.kimTolaydi !== HAMMA ? b.kimTolaydi : '', kimTur: b.kimTolaydi === HAMMA ? 'hamma' : b.kimTolaydi === null ? 'bilmayman' : null,
    narx: b.narxTaxmin === null || b.narxTaxmin === undefined ? '' : String(b.narxTaxmin), oy: b.oyTaxmin === null || b.oyTaxmin === undefined ? '' : String(b.oyTaxmin),
    narxBilmayman: (b.narxTaxmin === null || b.narxTaxmin === undefined) && (b.oyTaxmin === null || b.oyTaxmin === undefined),
    tur: b.tur === 'mashq' ? 'mashq' : 'real'
  };
};
const MENTOR_FORMA = () => ({
  kanallar: MENTOR_KANALLAR.map(k => ({ nom: tr(k.nom), sarf: '0', yangi: '' })), yangi: String(MENTOR_SONLAR.yangi), yangiBilmayman: false,
  davr: tr(MENTOR_SONLAR.davr), kanalBilan: false, kim: tr({ uz: 'tashkilotchi', ru: 'организатор' }), kimTur: null,
  narx: String(MENTOR_SONLAR.narx), oy: String(MENTOR_SONLAR.oy), narxBilmayman: false, tur: 'mashq'
});
const boshForma = () => {
  const b = birlikOl(); if (b) return yozuvdanForma(b);
  const k = oquvchiKanallar(); const r = royxatOl();
  return {
    kanallar: k.length ? k.map(x => ({ nom: x.nom, sarf: '', yangi: '' })) : [{ nom: '', sarf: '', yangi: '' }],
    yangi: r && r.soni !== null ? String(r.soni) : '', yangiBilmayman: false,
    davr: r && r.soni !== null && r.sana ? tr({ uz: `ishga tushgandan ${r.sana} gacha`, ru: `с запуска до ${r.sana}` }) : '', kanalBilan: false,
    kim: '', kimTur: null, narx: '', oy: '', narxBilmayman: false, tur: 'real'
  };
};
const KARTA_NOM = [{ uz: 'Kanallar', ru: 'Каналы' }, { uz: "Kim to'laydi", ru: 'Кто платит' }, { uz: 'Narx va oy', ru: 'Цена и месяцы' }];
const XATO = {
  sarf: { uz: "Sarflangan pulni yozing: bermagan bo'lsangiz — 0.", ru: 'Напишите потраченные деньги: если не платили — 0.' },
  yangi: { uz: "Shu davrda nechta kishi ro'yxatdan o'tdi — yozing.", ru: 'Напишите, сколько человек зарегистрировалось за период.' },
  davr: { uz: 'Davrni yozing: qachondan qachongacha?', ru: 'Напишите период: с какого по какое?' },
  kim: { uz: "Kim to'lashi mumkin — rolini yozing yoki tugmani bosing.", ru: 'Кто может платить — напишите роль или нажмите кнопку.' },
  oy: { uz: "Necha oy to'lashini ham yozing — taxmin bo'lsa ham.", ru: 'Напишите и сколько месяцев он платит — даже если это предположение.' }
};
const kartaXato = (f, i) => {
  if (i === 0) {
    if ((f.kanallar || []).some(k => sonOl(k.sarf) === null)) return XATO.sarf;
    if (f.kanalBilan ? (f.kanallar || []).some(k => sonOl(k.yangi) === null) : (!f.yangiBilmayman && sonOl(f.yangi) === null)) return XATO.yangi;
    if (!String(f.davr || '').trim()) return XATO.davr;
  }
  if (i === 1 && !String(f.kim || '').trim() && !f.kimTur) return XATO.kim;
  if (i === 2 && !f.narxBilmayman && sonOl(f.narx) !== null && sonOl(f.oy) === null) return XATO.oy;
  return null;
};
// Yorliq input ichida (E 43): raqam belgisi + qisqa savol placeholder'da
const Maydon = ({ n, value, onChange, ph, son, err, halqa, disabled, max = 80, yozildi }) => (
  <label className={cxx('bs-maydon-i', err && 'err', halqa && 'bs-halqa-i', disabled && 'off', yozildi && 'yozildi')}>
    {n !== undefined && <i className="bs-mn">{n}</i>}
    <input value={value} maxLength={max} placeholder={ph} aria-label={ph} inputMode={son ? 'numeric' : undefined} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
  </label>
);
// Bitta karta (7-ekran va 9-ekran «Tuzating» bir xil manbadan)
const KartaForma = ({ karta, f, setF, xato, yozildi }) => {
  const h = birlikHisob(f);
  const somY = tr({ uz: "so'm", ru: 'сум' });
  const set = (patch) => setF({ ...f, ...patch });
  const setK = (i, patch) => setF({ ...f, kanallar: f.kanallar.map((k, j) => (j === i ? { ...k, ...patch } : k)) });
  const r = royxatOl();
  const birinchiBosh = (v) => !String(v || '').trim();
  if (karta === 0) {
    const yangiBosh = !f.kanalBilan && !f.yangiBilmayman && birinchiBosh(f.yangi);
    const sarfBoshI = f.kanallar.findIndex(k => birinchiBosh(k.sarf));
    return (
      <div className="bs-kf">
        {f.kanallar.map((k, i) => (
          <div key={i} className="bs-kanal-qator">
            <Maydon value={k.nom} onChange={(v) => setK(i, { nom: v })} ph={tr({ uz: 'Kanal nomi', ru: 'Название канала' })} max={40} yozildi={yozildi} />
            <Maydon n="1" son value={k.sarf} onChange={(v) => setK(i, { sarf: v })} ph={tr({ uz: "Sarflangan pul, so'm — bermagan bo'lsangiz 0", ru: 'Потрачено, сум — если не платили, 0' })} err={xato === XATO.sarf && birinchiBosh(k.sarf)} halqa={sarfBoshI === i} max={12} yozildi={yozildi} />
            {f.kanalBilan && <Maydon son value={k.yangi} onChange={(v) => setK(i, { yangi: v })} ph={tr({ uz: 'Yangi', ru: 'Новых' })} err={xato === XATO.yangi && birinchiBosh(k.yangi)} max={8} />}
          </div>
        ))}
        {f.kanallar.length < 5 && <button type="button" className="q-chip bs-qosh" onClick={() => set({ kanallar: [...f.kanallar, { nom: '', sarf: '', yangi: '' }] })}>{tr({ uz: "+ Kanal qo'shish", ru: '+ Добавить канал' })}</button>}
        <div className="bs-kanal-qator">
          <Maydon n="2" son value={f.kanalBilan ? String(h.yangiJami ?? '') : (f.yangiBilmayman ? '' : f.yangi)} disabled={f.kanalBilan || f.yangiBilmayman} onChange={(v) => set({ yangi: v })} ph={tr({ uz: "Shu davrda nechta kishi ro'yxatdan o'tdi?", ru: 'Сколько человек зарегистрировалось за период?' })} err={xato === XATO.yangi && !f.kanalBilan} halqa={sarfBoshI < 0 && yangiBosh} max={8} yozildi={yozildi} />
          {!f.kanalBilan && <button type="button" className={cxx('q-chip', f.yangiBilmayman && 'on')} onClick={() => set({ yangiBilmayman: !f.yangiBilmayman })}>{tr({ uz: 'Hozircha bilmayman', ru: 'Пока не знаю' })}</button>}
        </div>
        {r && r.tuzatish && <span className="bs-kulrang">{tr({ uz: "Hisobotda bu son «tuzatish» olgan — tuzatilganini yozing.", ru: 'В отчёте это число получило «исправление» — напишите исправленное.' })}</span>}
        {r && !r.tuzatish && r.soni !== null && f.tur !== 'mashq' && <span className="bs-kulrang">{tr({ uz: 'metrika hisobotidan', ru: 'из отчёта по метрикам' })}{r.sinfdosh > 0 && <> · {tr({ uz: `shundan ${r.sinfdosh} tasi — sinfdosh`, ru: `из них ${r.sinfdosh} — одноклассники` })}</>}</span>}
        <Maydon n="3" value={f.davr} onChange={(v) => set({ davr: v })} ph={tr({ uz: 'Davr: qachondan qachongacha?', ru: 'Период: с какого по какое?' })} err={xato === XATO.davr} halqa={sarfBoshI < 0 && !yangiBosh && birinchiBosh(f.davr)} max={60} yozildi={yozildi} />
        <label className="bs-belgi"><input type="checkbox" checked={!!f.kanalBilan} onChange={(e) => set({ kanalBilan: e.target.checked })} /><span>{tr({ uz: 'Har kanaldan nechta kelganini bilaman', ru: 'Знаю, сколько пришло из каждого канала' })}</span></label>
        <span className="bs-jonli">{h.jalbNarxi !== null
          ? <>{tr({ uz: 'Jalb qilish narxi', ru: 'Цена привлечения' })}: <b>{sonFmt(h.jalbNarxi)}{NB}{somY}</b></>
          : tr(h.yangiJami === 0 ? HALOL.nol : HALOL.yangisiz)}</span>
      </div>
    );
  }
  if (karta === 1) {
    const kimHamma = f.kimTur === 'hamma', kimBilmayman = f.kimTur === 'bilmayman';
    return (
      <div className="bs-kf">
        <Maydon n="1" value={f.kimTur ? '' : f.kim} disabled={!!f.kimTur} onChange={(v) => set({ kim: v })} ph={tr({ uz: "Kim pul to'lashi mumkin? Rolini yozing, ism emas", ru: 'Кто может платить? Напишите роль, не имя' })} err={xato === XATO.kim} halqa={!f.kimTur && birinchiBosh(f.kim)} max={60} yozildi={yozildi} />
        <div className="bs-tugmalar">
          <button type="button" className={cxx('q-chip', kimHamma && 'on')} onClick={() => set({ kimTur: f.kimTur === 'hamma' ? null : 'hamma' })}>{tr({ uz: 'Hamma foydalanuvchi', ru: 'Все пользователи' })}</button>
          <button type="button" className={cxx('q-chip', kimBilmayman && 'on')} onClick={() => set({ kimTur: f.kimTur === 'bilmayman' ? null : 'bilmayman' })}>{tr({ uz: 'Hozircha bilmayman', ru: 'Пока не знаю' })}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="bs-kf">
      <Maydon n="1" son value={f.narxBilmayman ? '' : f.narx} disabled={f.narxBilmayman} onChange={(v) => set({ narx: v })} ph={tr({ uz: "Narx taxmini: 30 kunga necha so'm?", ru: 'Предположение цены: сколько сумов за 30 дней?' })} halqa={!f.narxBilmayman && birinchiBosh(f.narx)} max={10} yozildi={yozildi} />
      <Maydon n="2" son value={f.narxBilmayman ? '' : f.oy} disabled={f.narxBilmayman} onChange={(v) => set({ oy: v })} ph={tr({ uz: "Necha oy to'laydi? Taxmin", ru: 'Сколько месяцев платит? Предположение' })} err={xato === XATO.oy} halqa={!f.narxBilmayman && !birinchiBosh(f.narx) && birinchiBosh(f.oy)} max={4} yozildi={yozildi} />
      <div className="bs-tugmalar"><button type="button" className={cxx('q-chip', f.narxBilmayman && 'on')} onClick={() => set({ narxBilmayman: !f.narxBilmayman })}>{tr({ uz: 'Hozircha bilmayman', ru: 'Пока не знаю' })}</button></div>
      <span className="bs-jonli">{h.keltiradi !== null
        ? <>{tr({ uz: 'Keltiradigan pul', ru: 'Приносимые деньги' })}: <b>{sonFmt(h.keltiradi)}{NB}{somY}</b> · {tr({ uz: 'taxmin', ru: 'предположение' })}</>
        : tr(HALOL.pulsiz)}</span>
    </div>
  );
};
// «Ikki sonim» kartasi — o'quvchi sonlari bilan ikki ustun, muhr, doimiy qator, halol qator (yakuniy karta, 9/10/11-ekranlarda ixcham)
const IkkiSonim = ({ f, ixcham, onTahrir, uRef, taxminYon }) => {
  const h = birlikHisob(f);
  return (
    <div className={cxx('bs-ikkisonim', ixcham && 'ixcham')}>
      <div className="bs-is-h"><b>{tr({ uz: 'Ikki sonim', ru: 'Два моих числа' })}</b>{f.tur === 'mashq' && <span className="bs-mashq-y">{tr({ uz: 'mashq', ru: 'упражнение' })}</span>}</div>
      <Ustunlar uRef={uRef} jalb={h.jalbNarxi} bolmaydi={h.yangiJami === 0} keltir={h.keltiradi}
        jalbY={<>{tr({ uz: 'Jalb qilish narxi', ru: 'Цена привлечения' })}{onTahrir && <button type="button" className="bs-tahrir" aria-label="✎" onClick={() => onTahrir(0)}>✎</button>}</>}
        keltirY={<>{tr({ uz: 'Keltiradigan pul', ru: 'Приносимые деньги' })}{onTahrir && <button type="button" className="bs-tahrir" aria-label="✎" onClick={() => onTahrir(2)}>✎</button>}</>}
        keltirIz={h.keltiradi !== null && <span className={cxx('bs-tx-y', taxminYon && 'yon')}>{tr({ uz: 'taxmin', ru: 'предположение' })}</span>}
        muhr={h.xulosa} halol={!ixcham && tr(HALOL[h.sabab])} ixcham={ixcham} />
      {onTahrir && <div className="bs-is-kim"><span>{tr({ uz: "Kim to'laydi", ru: 'Кто платит' })}: <b>{h.kimTolaydi === HAMMA ? tr({ uz: 'Hamma foydalanuvchi', ru: 'Все пользователи' }) : h.kimTolaydi || tr({ uz: "noma'lum", ru: 'неизвестно' })}</b></span><button type="button" className="bs-tahrir" aria-label="✎" onClick={() => onTahrir(1)}>✎</button></div>}
    </div>
  );
};
const IkkiSonimStrip = ({ n }) => <div className="bs-strip fade-step"><b>{tr({ uz: 'Ikki sonim', ru: 'Два моих числа' })}</b><span>{n >= 3 ? '✓' : `${n}/3`}</span></div>;

// ===== SCREEN 7 — O'Z SONLARINGIZ (QMustaqil, USTAXONA — 3 karta ketma-ket; E 43, E 53) · yozadi pm-m11d1-birlik · nishon twoNumbers (bonus) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const st = storedAnswer || {};
  const [f, setF] = useState(() => st.forma || boshForma());
  const [karta, setKarta] = useState(() => (st.saqlandi ? 3 : st.karta || 0));
  const [toldi, setToldi] = useState(() => st.toldi || (st.saqlandi ? [true, true, true] : [false, false, false]));
  const [saqlandi, setSaqlandi] = useState(!!st.saqlandi);
  const [ozgardi, setOzgardi] = useState(false);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yozildi, setYozildi] = useState(false);
  const [yashil, setYashil] = useState(false);
  const yozF = (nf) => { setF(nf); setXato(null); if (saqlandi) setOzgardi(true); };
  const n = toldi.filter(Boolean).length;
  const saqla = () => {
    const rec = birlikYozuv(f);
    lsY(BIRLIK_KEY, rec);
    const t = [true, true, true];
    setToldi(t); setSaqlandi(true); setOzgardi(false); setKarta(3); setYashil(true); setTimeout(() => setYashil(false), 1100);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'ikki-son', forma: f, toldi: t, saqlandi: true, solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const keyingi = () => {
    const x = kartaXato(f, karta);
    if (x) { setXato(x); return; }
    const t = toldi.map((v, i) => v || i === karta);
    setToldi(t); setXato(null);
    if (karta < 2) { setKarta(karta + 1); onAnswer(screen, { stage: 'practice', screenIdx: screen, forma: f, toldi: t, karta: karta + 1, saqlandi, correct: false, picked: true }); }
    else saqla();
  };
  const mashq = () => { setF(MENTOR_FORMA()); setXato(null); setYozildi(true); setTimeout(() => setYozildi(false), 1400); if (saqlandi) setOzgardi(true); };
  const tahrir = (i) => { setKarta(i); setXato(null); };
  const h = birlikHisob(f);
  const somY = tr({ uz: "so'm", ru: 'сум' });
  const jalbM = h.jalbNarxi !== null ? `${sonFmt(h.jalbNarxi)}${NB}${somY}` : tr(h.yangiJami === 0 ? { uz: "bo'lib bo'lmaydi", ru: 'нельзя разделить' } : { uz: "noma'lum", ru: 'неизвестно' });
  const xulosaM = h.keltiradi !== null
    ? tr({ uz: `Jalb qilish narxi — ${jalbM}, keltiradigan pul — ${sonFmt(h.keltiradi)}${NB}so'm (taxmin).`, ru: `Цена привлечения — ${jalbM}, приносимые деньги — ${sonFmt(h.keltiradi)}${NB}сум (предположение).` })
    : tr({ uz: `Jalb qilish narxi — ${jalbM}; keltiradigan pul hali noma'lum.`, ru: `Цена привлечения — ${jalbM}; приносимые деньги пока неизвестны.` });
  const chiziq = (
    <div className="bs-chiziq">
      <b>{tr({ uz: 'Ikki sonim', ru: 'Два моих числа' })} · {saqlandi && !ozgardi ? '✓' : `${n}/3`}</b>
      {KARTA_NOM.map((k, i) => <button key={i} type="button" className={cxx('bs-kartatab', i === karta && 'joriy', toldi[i] && 'ok')} disabled={isMentor || (!toldi[i] && i !== karta && !(i > 0 && toldi[i - 1]))} onClick={() => tahrir(i)}><i>{toldi[i] ? '✓' : i + 1}</i>{tr(k)}</button>)}
    </div>
  );
  const kartaQism = karta < 3 && !isMentor && (
    <div key={karta} className="bs-katta fade-step">
      <div className="bs-katta-h"><b>{karta + 1} · {tr(KARTA_NOM[karta])}</b>{f.tur === 'mashq' && <span className="bs-mashq-y">{tr({ uz: 'mashq', ru: 'упражнение' })}</span>}</div>
      <KartaForma karta={karta} f={f} setF={yozF} xato={xato} yozildi={yozildi} />
      {xato && <QXato>{tr(xato)}</QXato>}
      <div className="bs-katta-tug">
        <QTugma className="bs-halqa" onClick={keyingi}>{karta < 2 ? tr({ uz: 'Keyingi', ru: 'Далее' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        <QTugma ikkinchi onClick={mashq}>{tr({ uz: 'Mentor sonlari bilan mashq', ru: 'Упражнение с числами Ментора' })}</QTugma>
        <QTugma ikkinchi className="bs-yordam-btn" aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      </div>
    </div>
  );
  const yakuniy = (karta === 3 || isMentor) && (
    <div className={cxx('bs-katta', 'yakuniy', saqlandi && !isMentor && 'yig', yashil && 'yashil', 'fade-step')}>
      <IkkiSonim f={isMentor ? MENTOR_FORMA() : f} onTahrir={isMentor ? null : tahrir} />
      {!isMentor && <div className="bs-katta-tug"><QTugma className={cxx(ozgardi && 'bs-halqa')} ikkinchi={!ozgardi} onClick={saqla}>{saqlandi ? tr({ uz: 'Yangilash', ru: 'Обновить' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>}
    </div>
  );
  const navL = saqlandi ? { uz: 'Davom etish', ru: 'Продолжить' } : n >= 3 ? { uz: 'Saqlang', ru: 'Сохраните' } : { uz: `Kartalarni to'ldiring (${n}/3)`, ru: `Заполните карточки (${n}/3)` };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · ikki son', ru: 'Самостоятельная работа · два числа' })} screen={screen} scrollSignal={karta + (saqlandi ? 4 : 0)} deskSignal={saqlandi && karta === 3 ? 1 : 0} deskDelay={500} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi && !isMentor} label={tr(isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : navL)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingiz uchun <A>ikki sonni yozing.</A></>, ru: <>Запишите <A>два числа</A> для своего продукта.</> })}
        mentor={<Mentor>{tr({ uz: "Har kartani to'ldirib, «Keyingi»ni bosing — bilmagan soningiz uchun «Hozircha bilmayman» bor.", ru: 'Заполните каждую карточку и нажмите «Далее» — для неизвестного числа есть «Пока не знаю».' })}</Mentor>}
        qadamlar={!isMentor && chiziq}
        forma={<>{kartaQism}{yakuniy}</>}
        yordam={yordam && karta < 3 && <div className="bs-yordam fade-step">
          <span>{tr({ uz: "Mentor misolida: mahalla futbol guruhi, sinf chati va Instagram sahifasi — 0 so'm; ishga tushgandan keyingi ikki haftada 44 kishi (11 tasi — sinfdosh). Kim to'laydi: tashkilotchi (44 kishidan 6 tasi). Narx taxmini: 30 kunga 10 000 so'm, 3 oy.", ru: 'В примере Ментора: футбольная группа махалли, чат класса и страница в Instagram — 0 сумов; за две недели после запуска 44 человека (11 — одноклассники). Кто платит: организатор (6 из 44). Предположение цены: 10 000 сумов за 30 дней, 3 месяца.' })}</span>
          <span>{tr({ uz: "Sonni o'ylab topmang: bilmasangiz — «Hozircha bilmayman». Qaytganlar foizi oylar sonini aytmaydi. Pul to'lagan kanalingiz bo'lmasa — hammasiga 0 yozing: pullik kanalga pul to'lash shart emas. Web-trekda ham shunday.", ru: 'Не придумывайте числа: если не знаете — «Пока не знаю». Доля вернувшихся не говорит о числе месяцев. Если вы не платили ни одному каналу — пишите везде 0: платить каналу не нужно. В веб-треке так же.' })}</span>
        </div>}
      >
        {saqlandi && karta === 3 && <QXulosa>{xulosaM}</QXulosa>}
        {isMentor && <MentorPracticeStats live={live} screen={screen} yorliq={{ uz: 'Ikki sonni saqlaganlar', ru: 'Сохранили два числа' }} />}
        <Ustoz satrlar={USTOZ.s7} />
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 8 — JUFTLIKDA TEKSHIRUV (QMustaqil: 1 Ayting · 2 Belgilang · 3 Tuzating; yakka rejim; varaq kalitga yozilmaydi — TS 11) =====
const SHERIK_SAVOL = [
  { savol: { uz: 'Yangi foydalanuvchilar soni qayerdan olingan?', ru: 'Откуда взято число новых пользователей?' }, karta: 0 },
  { savol: { uz: 'To\'lovchi mahsulotingizdan nima oladi?', ru: 'Что получает плательщик от вашего продукта?' }, karta: 1 },
  { savol: { uz: 'Narx va oy — kimdir aytganmi yoki taxminmi?', ru: 'Цена и месяцы — кто-то назвал или это предположение?' }, karta: 2 }
];
const S8_TAB = [{ uz: 'Ayting', ru: 'Скажите' }, { uz: 'Belgilang', ru: 'Отметьте' }, { uz: 'Tuzating', ru: 'Исправьте' }];
const YOMON_RE = /(yomon|zerikarli|yoqmadi|плох|скучн|не понрав)/i;
const vaqtM = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const st = storedAnswer || {};
  const [yakka, setYakka] = useState(!!st.yakka);
  const [tab, setTab] = useState(st.tab || 0);
  const [bosh, setBosh] = useState(null);
  const [soniya, setSoniya] = useState(st.gapirdi ? 60 : 0);
  const [gapirdi, setGapirdi] = useState(!!st.gapirdi);
  const [belgi, setBelgi] = useState(st.belgi || [null, null, null]);
  const [izoh, setIzoh] = useState(st.izoh || ['', '', '']);
  const [aniq, setAniq] = useState(st.aniq || [false, false, false]);
  const [aniqlik, setAniqlik] = useState(st.aniqlik || ['', '', '']);
  const [ochiq, setOchiq] = useState(null);
  const [tf, setTf] = useState(null);
  const [xato, setXato] = useState(null);
  const [yon, setYon] = useState(false);
  const [birlik, setBirlik] = useState(birlikOl);
  const f = birlik ? yozuvdanForma(birlik) : MENTOR_FORMA();
  useEffect(() => {
    if (bosh === null) return undefined;
    const t = setInterval(() => setSoniya(Math.floor((Date.now() - bosh) / 1000)), 250);
    return () => clearInterval(t);
  }, [bosh]);
  const saqlaHolat = (patch) => onAnswer(screen, { stage: 'practice', screenIdx: screen, yakka, tab, gapirdi, belgi, izoh, aniq, aniqlik, correct: false, picked: true, ...patch });
  const boshla = () => { setBosh(Date.now() - soniya * 1000); };
  const toxtat = () => { setBosh(null); setGapirdi(true); setTab(1); saqlaHolat({ gapirdi: true, tab: 1 }); };
  const xBor = belgi.some(b => b === 'x');
  const varaqXato = () => {
    if (belgi.some(b => b === null)) return { uz: "Har savolga ✓ yoki ✕ qo'ying.", ru: 'Поставьте ✓ или ✕ на каждый вопрос.' };
    if (belgi.some((b, i) => b === 'x' && String(izoh[i]).trim().length < 8)) return { uz: "✕ qo'ydingiz — nima yetishmaganini bir qatorda yozing.", ru: 'Вы поставили ✕ — напишите в одной строке, чего не хватило.' };
    return null;
  };
  const varaqOk = !varaqXato();
  const yomon = belgi.some((b, i) => b === 'x' && YOMON_RE.test(String(izoh[i])));
  const tayyor = varaqOk && belgi.every((b, i) => b === 'ok' || aniq[i]);
  const tabBos = (i) => {
    if (isMentor) { setTab(i); return; }
    if (i === 2) { const x = varaqXato(); if (x) { setXato(x); return; } if (!xBor) return; }
    if (i >= 1 && !gapirdi && !yakka) return;
    setXato(null); setTab(i); saqlaHolat({ tab: i });
  };
  const belgila = (i, v) => { const b = belgi.map((x, j) => (j === i ? v : x)); setBelgi(b); setXato(null); saqlaHolat({ belgi: b }); };
  const ochQator = (i) => { if (belgi[i] !== 'x' || aniq[i]) return; setOchiq(i); setTf(f); setXato(null); };
  const tuzatSaqla = () => {
    const i = ochiq;
    const ozgardi = JSON.stringify(birlikHisob(tf)) !== JSON.stringify(birlikHisob(f)) || JSON.stringify(tf) !== JSON.stringify(f);
    if (!ozgardi && !String(aniqlik[i]).trim()) { setXato({ uz: 'Izohga mos joyni o\'zgartiring yoki aniqlikni yozing.', ru: 'Измените нужное место по замечанию или напишите уточнение.' }); return; }
    if (ozgardi) { const rec = birlikYozuv(tf); lsY(BIRLIK_KEY, rec); setBirlik(rec); setYon(true); setTimeout(() => setYon(false), 1200); }
    const a = aniq.map((x, j) => (j === i ? true : x));
    setAniq(a); setOchiq(null); setTf(null); setXato(null);
    const hammasi = belgi.every((b, j) => b === 'ok' || a[j]);
    saqlaHolat({ aniq: a, solved: hammasi, correct: false });
    if (hammasi && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  useEffect(() => {
    if (!tayyor || xBor || st.solved) return;
    saqlaHolat({ solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [tayyor]); // eslint-disable-line
  const okSoni = belgi.filter(b => b === 'ok').length;
  const mentorGap = yakka
    ? { uz: "Savollarni o'zingizga bering va har biriga halol belgi qo'ying.", ru: 'Задайте вопросы себе и честно отметьте каждый.' }
    : tab === 0 ? { uz: "Avval «1 daqiqani boshlash»ni bosib gapiring — keyin qurilmangizni uzating, u har savolga belgi qo'yadi.", ru: 'Сначала нажмите «Начать 1 минуту» и расскажите — потом передайте устройство, партнёр отметит каждый вопрос.' }
      : tab === 1 ? { uz: "Gap tugagach, qurilmangizni sherigingizga bering — u har savolga ✓ yoki ✕ qo'yadi.", ru: 'Когда закончите, передайте устройство партнёру — он поставит ✓ или ✕ на каждый вопрос.' }
        : { uz: "✕ olgan qatorni bosib, sherigingiz izohiga mos joyni aniqlashtiring.", ru: 'Нажмите строку с ✕ и уточните место по замечанию партнёра.' };
  const taymer = !yakka && tab === 0 && !isMentor && (
    <div className="bs-taymer fade-step">
      <span className="bs-yoriq">{tr({ uz: 'Avval A aytadi, B tinglaydi; keyin almashasiz.', ru: 'Сначала говорит A, B слушает; потом меняетесь.' })}</span>
      <div className="bs-tm-q"><span className="bs-tm-y"><i style={{ width: `${Math.min(100, (soniya / 60) * 100)}%` }} /></span><b className={cxx(soniya > 60 && 'oshdi')}>{soniya <= 60 ? vaqtM(60 - soniya) : '+' + vaqtM(soniya - 60)}</b></div>
      {bosh === null
        ? <QTugma className="bs-halqa" onClick={boshla}>{tr({ uz: '1 daqiqani boshlash', ru: 'Начать 1 минуту' })}</QTugma>
        : <QTugma className="bs-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
    </div>
  );
  const keyingiBelgi = belgi.findIndex(b => b === null);
  const yigV = useTugadi(tayyor && ochiq === null && !isMentor, 900, !!st.solved);
  const varaq = (tab >= 1 || yakka || isMentor) && (yigV ? (
    <div className="bs-varaq yig fade-step">
      {SHERIK_SAVOL.map((q, i) => <span key={i} title={tr(q.savol)} className={cxx('bs-vq-ch', belgi[i] === 'ok' ? 'ok' : 'x')}><i>{i + 1}</i>{belgi[i] === 'ok' ? '✓' : '✕'}{aniq[i] && <em>{tr({ uz: 'aniqlashtirildi', ru: 'уточнено' })}</em>}</span>)}
    </div>
  ) : 
    <div className="bs-varaq fade-step">
      {SHERIK_SAVOL.map((q, i) => (
        <div key={i} className={cxx('bs-vq', belgi[i] === 'ok' && 'ok', belgi[i] === 'x' && 'x', tab === 2 && belgi[i] === 'x' && !aniq[i] && 'bosiladi')}>
          <div className="bs-vq-t" onClick={tab === 2 ? () => ochQator(i) : undefined} role={tab === 2 && belgi[i] === 'x' && !aniq[i] ? 'button' : undefined}>
            <span className="bs-vq-n">{i + 1}</span><span className="bs-vq-s">{tr(q.savol)}</span>
            {aniq[i] && <span className="bs-aniq-y">{tr({ uz: 'aniqlashtirildi', ru: 'уточнено' })}</span>}
          </div>
          {!isMentor && <div className={cxx('bs-vq-b', tab === 1 && keyingiBelgi === i && 'bs-chorla')}>
            <button type="button" className={cxx('q-chip', 'bs-belgi-b', belgi[i] === 'ok' && 'on ok')} disabled={tab !== 1} onClick={() => belgila(i, 'ok')}>✓</button>
            <button type="button" className={cxx('q-chip', 'bs-belgi-b', belgi[i] === 'x' && 'on x')} disabled={tab !== 1} onClick={() => belgila(i, 'x')}>✕</button>
          </div>}
          {belgi[i] === 'x' && <div className="bs-vq-iz"><Maydon value={izoh[i]} disabled={tab !== 1} onChange={(v) => { const z = izoh.map((x, j) => (j === i ? v : x)); setIzoh(z); setXato(null); }} ph={tr({ uz: 'Nima yetishmadi?', ru: 'Чего не хватило?' })} max={80} halqa={tab === 1 && String(izoh[i]).trim().length < 8} /></div>}
          {ochiq === i && tf && <div className="bs-tuzat fade-step">
            <KartaForma karta={q.karta} f={tf} setF={(nf) => { setTf(nf); setXato(null); }} xato={null} />
            <Maydon value={aniqlik[i]} onChange={(v) => setAniqlik(aniqlik.map((x, j) => (j === i ? v : x)))} ph={tr({ uz: 'Aniqlik: …', ru: 'Уточнение: …' })} max={80} />
            <div className="bs-katta-tug"><QTugma className="bs-halqa" onClick={tuzatSaqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
          </div>}
        </div>
      ))}
      {yomon && <QIzoh>{tr({ uz: 'Odam haqida emas — sonda nima yetishmadi?', ru: 'Не о человеке — чего не хватило в числе?' })}</QIzoh>}
      {xato && <QXato>{tr(xato)}</QXato>}
      {tab === 1 && !isMentor && xBor && <QTugma className={cxx(varaqOk && 'bs-halqa')} onClick={() => tabBos(2)}>{tr({ uz: '3 · Tuzating', ru: '3 · Исправьте' })}</QTugma>}
    </div>
  );
  const xulosa = tayyor && !isMentor && (xBor
    ? tr({ uz: `Uch savoldan ${okSoni} tasiga ✓; ✕ qatorlar aniqlashtirildi.`, ru: `Из трёх вопросов ✓ — ${okSoni}; строки с ✕ уточнены.` })
    : tr({ uz: 'Uchala savolga javob bor: sonlaringiz qayerdan ekani aytildi.', ru: 'На все три вопроса есть ответ: сказано, откуда ваши числа.' }));
  return (
    <Stage eyebrow={yakka ? tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' }) : tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' })} screen={screen} scrollSignal={tab + (tayyor ? 4 : 0) + (ochiq !== null ? 8 : 0)} deskSignal={yigV ? 1 : 0} deskDelay={400} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor && !isMentor} label={tayyor || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Varaqni to\'ldiring', ru: 'Заполните лист' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={yakka
          ? tr({ uz: <>Ikki soningiz <A>qayerdanligini ayta olasizmi?</A></>, ru: <>Можете сказать, <A>откуда ваши два числа?</A></> })
          : tr({ uz: <>Ikki soningiz qayerdan — <A>sherigingizga ayta olasizmi?</A></>, ru: <>Откуда ваши два числа — <A>сможете сказать партнёру?</A></> })}
        mentor={<Mentor>{tr(mentorGap)}</Mentor>}
        qadamlar={!isMentor && <div className="bs-s8-bosh">
          <IkkiSonimStrip n={birlik ? 3 : 0} />
          <div className="bs-tablar">{S8_TAB.map((t, i) => <button key={i} type="button" className={cxx('bs-kartatab', i === tab && 'joriy', i < tab && 'ok')} disabled={i === 0 ? false : i === 1 ? !(gapirdi || yakka) : !xBor} onClick={() => tabBos(i)}><i>{i < tab ? '✓' : i + 1}</i>{tr(t)}</button>)}</div>
          {!gapirdi && tab === 0 && <button type="button" className={cxx('q-chip', 'bs-yakka', yakka && 'on')} onClick={() => { const y = !yakka; setYakka(y); if (y) setTab(1); else setTab(0); saqlaHolat({ yakka: y, tab: y ? 1 : 0 }); }}>{tr({ uz: 'Yakka rejim', ru: 'Одиночный режим' })}</button>}
        </div>}
        forma={<div className={cxx('bs-s8', (tab >= 1 || yakka || isMentor) && 'ikki')}>
          <div className={cxx('bs-s8-chap', yon && 'yon')}><IkkiSonim f={f} ixcham /></div>
          {taymer}
          {varaq}
        </div>}
      >
        {xulosa && <QXulosa>{xulosa}</QXulosa>}
        {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        <Ustoz satrlar={USTOZ.s8} />
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — KOD YOZISH: IKKI SON (QKod + HtmlCompiler, JS; tayanch 1.1, 4; PM-082) =====
// Starter oddiy satrlardan yig'iladi (backtick yo'q), qatorlar ≤ 70 belgi (SABOQ 37). Faqat bitta JS fayl (app.js) — kompilyator uni o'zi ulaydi
// (index.html da script src yo'q: srcdoc ichida yuklanmaydi). Tekshiruv — o'z namunasi bilan funksiya chaqiriladi (kanal va meniki ga bog'lanmaydi).
const menikiOl = () => {
  const b = birlikOl();
  if (!b) return null;
  const sarf = b.kanallar.reduce((a, k) => a + (Number(k.sarf) || 0), 0);
  const yangi = b.kanallar.reduce((a, k) => a + (Number(k.yangi) || 0), 0);
  const nn = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v));
  return { real: b.tur === 'real', sarf, yangi, narx: nn(b.narxTaxmin), oy: nn(b.oyTaxmin) };
};
const KOD_M = {
  uz: { tepa: '// Mentor misoli: pullik kanal — mashq, Mentorning taxmini', mentor: "// Mentor sonlari — o'zingiznikiga almashtiring", siz: "// Sizning sonlaringiz («Ikki sonim» kartasidan)",
    mahsulot: 'Mahsulotim', mashq: 'Mashq', jIz: "  // yangi 0 bo'lsa — null;\n  // aks holda pulni yangilarga bo'ling", kIz: "  // narxni oylar soniga ko'paytiring", siz2: '  return 0; // shu joyni siz yozasiz',
    tayyor: '// natija — bu qism tayyor', bolmaydi: "bo'lib bo'lmaydi", som: " so'm", nomalum: "noma'lum", qop: 'qoplanadi', zar: 'zarar', teng: 'teng',
    q1: 'Mentor · bitta foydalanuvchi: ', q2: 'Mentor · bitta tashkilotchi: ', q3: 'Mentor · tashkilotchi keltiradi: ', q4: 'Mentor · pullik kanal: ', q5: ' · bitta foydalanuvchi: ', q6: ' · keltiradi, taxmin: ' },
  ru: { tepa: '// Пример Ментора: платный канал — упражнение, предположение', mentor: '// Числа Ментора — замените своими', siz: '// Ваши числа (из карточки «Два моих числа»)',
    mahsulot: 'Мой продукт', mashq: 'Упражнение', jIz: '  // если yangi 0 — null;\n  // иначе делите деньги на новых', kIz: '  // умножьте цену на число месяцев', siz2: '  return 0; // это место пишете вы',
    tayyor: '// результат — эта часть готова', bolmaydi: 'нельзя разделить', som: ' сум', nomalum: 'неизвестно', qop: 'покрывается', zar: 'убыток', teng: 'равно',
    q1: 'Ментор · один пользователь: ', q2: 'Ментор · один организатор: ', q3: 'Ментор · организатор приносит: ', q4: 'Ментор · платный канал: ', q5: ' · один пользователь: ', q6: ' · приносит, предположение: ' }
};
const kodStarter = (m, til) => {
  const L = KOD_M[til] || KOD_M.uz;
  const q = (s) => '"' + s + '"';
  const men = m || { real: false, sarf: 0, yangi: MENTOR_SONLAR.yangi, narx: MENTOR_SONLAR.narx, oy: MENTOR_SONLAR.oy };
  const sn = (v) => (v === null ? 'null' : String(v));
  return [
    L.tepa,
    'const kanal = { sarf: 60000,',
    '  yangi: 12, tashkilotchi: 1 };',
    'const pro = { narx: 10000, oy: 3 };',
    '',
    m ? L.siz : L.mentor,
    'const meniki = {',
    '  yorliq: ' + q(m && m.real ? L.mahsulot : L.mashq) + ', sarf: ' + sn(men.sarf) + ', yangi: ' + sn(men.yangi) + ', narx: ' + sn(men.narx) + ', oy: ' + sn(men.oy),
    '};',
    '',
    'function jalbNarxi(sarf, yangi) {',
    L.jIz,
    L.siz2,
    '}',
    '',
    'function keltiradi(narx, oy) {',
    L.kIz,
    L.siz2,
    '}',
    '',
    L.tayyor,
    'function som(n) {',
    '  if (n === null) return ' + q(L.bolmaydi) + ';',
    '  return Math.round(n) + ' + q(L.som) + ';',
    '}',
    'function xulosa(jalb, pul) {',
    '  if (jalb === null || pul === null) return ' + q(L.nomalum) + ';',
    '  if (jalb < pul) return ' + q(L.qop) + ';',
    '  if (jalb > pul) return ' + q(L.zar) + ';',
    '  return ' + q(L.teng) + ';',
    '}',
    'const joy = document.getElementById("natija");',
    'function qator(matn) {',
    '  const li = document.createElement("li");',
    '  li.textContent = matn;',
    '  joy.appendChild(li);',
    '}',
    'const birFoyd = jalbNarxi(kanal.sarf, kanal.yangi);',
    'const birTash = jalbNarxi(kanal.sarf, kanal.tashkilotchi);',
    'const proPuli = keltiradi(pro.narx, pro.oy);',
    'qator(' + q(L.q1) + ' + som(birFoyd));',
    'qator(' + q(L.q2) + ' + som(birTash));',
    'qator(' + q(L.q3) + ' + som(proPuli));',
    'qator(' + q(L.q4) + ' + xulosa(birTash, proPuli));',
    '',
    'const menJalb = jalbNarxi(meniki.sarf, meniki.yangi);',
    'const menPul = meniki.narx === null || meniki.oy === null',
    '  ? null : keltiradi(meniki.narx, meniki.oy);',
    'const pulMatn = menPul === null ? ' + q(L.nomalum) + ' : som(menPul);',
    'qator(meniki.yorliq + ' + q(L.q5) + ' + som(menJalb));',
    'qator(meniki.yorliq + ' + q(L.q6) + ' + pulMatn);',
    ''
  ].join('\n');
};
const KOD_INDEX = { uz: '<h3>Bitta foydalanuvchi: ikki son</h3>\n<ul id="natija"></ul>\n', ru: '<h3>Один пользователь: два числа</h3>\n<ul id="natija"></ul>\n' };
const KOD_VAZIFA = [
  { uz: '`jalbNarxi` pulni yangi kelganlar soniga bo\'ladi.', ru: '`jalbNarxi` делит деньги на число новых.' },
  { uz: 'Yangi kelganlar 0 bo\'lsa — `null` qaytaradi.', ru: 'Если новых 0 — возвращает `null`.' },
  { uz: '`keltiradi` narxni oylar soniga ko\'paytiradi.', ru: '`keltiradi` умножает цену на число месяцев.' }
];
const KOD_SHART = [
  { uz: "1 — 60 000 ni 12 ga bo'lganda 5 000 chiqsin.", ru: '1 — 60 000 разделить на 12 — должно выйти 5 000.' },
  { uz: "2 — Yangi kelganlar 0 bo'lsa, null qaytsin.", ru: '2 — Если новых 0, пусть вернётся null.' },
  { uz: "3 — 10 000 ni 3 oyga ko'paytirganda 30 000 chiqsin.", ru: '3 — 10 000 умножить на 3 месяца — должно выйти 30 000.' }
];
const KOD_SHART_IFODA = [['jalbNarxi(60000, 12)', 5000], ['jalbNarxi(5000, 0)', 'null'], ['keltiradi(10000, 3)', 30000]];
// Kompilyator yorlig'ida kod-chip belgisi ko'rinmasin (u matnni xom chiqaradi)
const BT = String.fromCharCode(96);
const belgisiz = (o) => ({ uz: o.uz.split(BT).join(''), ru: o.ru.split(BT).join('') });
const kodPreviewCss = () => 'h3{font:700 16px Manrope,system-ui,sans-serif;margin:0 0 10px;color:' + T.ink + '}'
  + '#natija{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}'
  + '#natija li{font:600 14px Manrope,system-ui,sans-serif;color:' + T.ink + ';background:' + T.bg + ';border:1px solid ' + T.line + ';border-radius:10px;padding:8px 12px}';
const kodTask = (starter) => ({
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — jalbNarxi va keltiradi funksiyalarini yozing', ru: 'app.js — напишите функции jalbNarxi и keltiradi' },
  files: [
    { name: 'app.js', lang: 'js', starter, placeholder: { uz: "// bo'sh joylar: bo'lish, null, ko'paytirish", ru: '// пустые места: деление, null, умножение' } },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: kodPreviewCss(),
  requirements: KOD_SHART_IFODA.map(([ifoda, kut], i) => ({ id: 'sh' + (i + 1), label: belgisiz(KOD_VAZIFA[i]), check: C.evalEquals(ifoda, kut, KOD_SHART[i]) }))
});
// Darvoza-mashq (PM-082 c/e): to'g'ri — jalbNarxi(kanal.sarf, kanal.tashkilotchi)
const KOD_DARVOZA = [
  { id: 'togri', kod: 'jalbNarxi(kanal.sarf, kanal.tashkilotchi)', natija: '60000', ok: true },
  { id: 'yangi', kod: 'jalbNarxi(kanal.sarf, kanal.yangi)', natija: '5000', x: { uz: "Bu — bitta foydalanuvchi narxi: hammasi ham to'lamaydi.", ru: 'Это цена одного пользователя: платят не все.' } },
  { id: 'teskari', kod: 'jalbNarxi(kanal.yangi, kanal.sarf)', natija: '0.0002', x: { uz: 'Pul birinchi, kishilar soni ikkinchi turadi.', ru: 'Деньги идут первыми, число людей — вторым.' } }
];
// Kod natijasidan o'quvchi qatorlari (iframe DOM ini o'qib bo'lmaydi — meniki obyekti koddan o'qiladi; funksiyalar uchala shartdan o'tgan)
const kodMeniki = (code) => {
  const s = String(code || '');
  const blok = (s.match(/const\s+meniki\s*=\s*\{([\s\S]*?)\}/) || [])[1] || '';
  const ol = (k) => { const m = blok.match(new RegExp(k + '\\s*:\\s*(null|-?\\d+(?:\\.\\d+)?)')); return m ? (m[1] === 'null' ? null : Number(m[1])) : null; };
  const y = blok.match(/yorliq\s*:\s*["']([^"']*)["']/);
  return { yorliq: y ? y[1] : '', sarf: ol('sarf'), yangi: ol('yangi'), narx: ol('narx'), oy: ol('oy') };
};
const QKOD_ONG = ['muh', 'arrir'].join('');
const KodNamuna = ({ kod }) => {
  const L = String(kod).split('\n');
  const i0 = L.findIndex(l => l.startsWith('function jalbNarxi'));
  const qism = i0 >= 0 ? L.slice(i0, i0 + 10) : L.slice(0, 10);
  return <pre className="bs-kod" onCopy={(e) => e.preventDefault()} aria-label="app.js">{qism.map((l, i) => <span key={i}>{l}{'\n'}</span>)}</pre>;
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const achMiss = useContext(AchMissCtx);
  const st = storedAnswer || {};
  const [meniki] = useState(menikiOl);
  const starter = useMemo(() => ({ uz: kodStarter(meniki, 'uz'), ru: kodStarter(meniki, 'ru') }), [meniki]);
  const task = useMemo(() => kodTask(starter), [starter]);
  const [gpick, setGpick] = useState(st.gpick || null);
  const [miss, setMiss] = useState(null);
  const missRef = useRef(!!st.gateMiss);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(typeof st.code === 'string' ? st.code : null);
  const [kodOk, setKodOk] = useState(!!st.kodOk);
  const [done, setDone] = useState(!!st.done);
  const [uyda, setUyda] = useState(!!st.uyda);
  const [uch, qatlam] = useUchish();
  const natRef = useRef(null), sahnaRef = useRef(null);
  const stage2 = gpick === 'togri' || isMentor || done;
  const pickGate = (g) => {
    if (gpick === 'togri') return;
    setGpick(g.id);
    if (g.ok) setMiss(null); else { missRef.current = true; if (achMiss) achMiss.miss(screen); setMiss({ id: g.id, k: Date.now() }); }
  };
  const javob = (patch) => onAnswer(screen, { stage: 'koding', screenIdx: screen, gpick, gateMiss: missRef.current, code, kodOk, done, uyda, solved: true, picked: true, correct: false, ...patch });
  const finish = ({ codes, code: htmlCode }) => {
    const yangi = (codes && codes['app.js']) || htmlCode || code || tr(starter);
    setOpen(false); setCode(yangi); setKodOk(true);
    if (!done) javob({ code: yangi, kodOk: true });
  };
  const bajardim = () => {
    if (gpick !== 'togri' || !kodOk || done) return;
    setDone(true); setUyda(false);
    setTimeout(() => uch(natRef.current, sahnaRef.current, tr({ uz: 'pullik kanal: zarar', ru: 'платный канал: убыток' })), 80);
    javob({ done: true, uyda: false, correct: !missRef.current });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const uydaBos = () => { if (done) return; setUyda(true); javob({ uyda: true, done: false, correct: false }); };
  const mk = kodMeniki(code || tr(starter));
  const menJalb = mk.yangi === null || mk.yangi === 0 || mk.sarf === null ? null : mk.sarf / mk.yangi;
  const menPul = mk.narx === null || mk.oy === null ? null : mk.narx * mk.oy;
  const L = KOD_M[__lang] || KOD_M.uz;
  const natijaQatorlar = [
    L.q1 + sonFmt(AGAR.sarf / AGAR.yangi) + L.som, L.q2 + sonFmt(AGAR.sarf) + L.som, L.q3 + sonFmt(MENTOR_SONLAR.keltiradi) + L.som, L.q4 + L.zar,
    mk.yorliq + L.q5 + (menJalb === null ? L.bolmaydi : sonFmt(menJalb) + L.som), mk.yorliq + L.q6 + (menPul === null ? L.nomalum : sonFmt(menPul) + L.som)
  ];
  const bajLabel = gpick !== 'togri' ? { uz: 'Avval qator savolini yeching', ru: 'Сначала решите вопрос о строке' } : !kodOk ? { uz: 'Avval uchala shartni bajaring', ru: 'Сначала выполните три условия' } : { uz: 'Bajardim — ikki son hisoblandi', ru: 'Готово — два числа посчитаны' };
  const tayyor = done || uyda || isMentor;
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · ikki son', ru: 'Пишем код · два числа' })} screen={screen} scrollSignal={(gpick ? 1 : 0) + (kodOk ? 2 : 0) + (done ? 4 : 0) + (uyda ? 8 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor} label={tayyor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(bajLabel)} onClick={onNext} /></>}>
      {!isMentor && <IkkiSonimStrip n={birlikOl() ? 3 : 0} />}
      <QKod
        sarlavha={tr({ uz: <>Ikki sonni hisoblab solishtiradigan <A>kod yozamiz.</A></>, ru: <>Пишем <A>код,</A> который считает и сравнивает два числа.</> })}
        mentor={<Mentor>{tr({ uz: "Funksiyalar avval Mentor sonlari bilan tekshiriladi, keyin sizning sonlaringizni hisoblaydi — bo'sh joylarni to'ldiring.", ru: 'Функции сначала проверяются на числах Ментора, потом считают ваши числа — заполните пустые места.' })}</Mentor>}
        vazifa={<>
          {!stage2 ? (
            <div className="bs-darvoza">
              <code className="bs-dv-kod">{'const kanal = { sarf: 60000,\n  yangi: 12, tashkilotchi: 1 };'}</code>
              <span className="bs-dv-s">{tr({ uz: 'Qaysi qator bitta tashkilotchining jalb qilish narxini beradi?', ru: 'Какая строка даёт цену привлечения одного организатора?' })}</span>
              <div className="bs-dv-ro bs-chorla">
                {KOD_DARVOZA.map(g => {
                  const silk = miss && miss.id === g.id;
                  return <QChip key={silk ? g.id + '-' + miss.k : g.id} className="bs-dv" silk={silk} holat={silk ? 'err' : gpick === g.id ? 'on' : undefined} onClick={() => pickGate(g)}><code>{g.kod}</code></QChip>;
                })}
              </div>
              <div className="bs-dv-nat">{KOD_DARVOZA.map(g => <code key={g.id} className={cxx(gpick === g.id && 'yon')}>{g.natija}</code>)}</div>
              {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
            </div>
          ) : <div className="bs-dv-ok"><code>{KOD_DARVOZA[0].kod}</code><b>{KOD_DARVOZA[0].natija}</b></div>}
          <ol className={cxx('bs-vazifa', !stage2 && 'xira')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cxx(kodOk && 'ok')}><i>{kodOk ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          {done && <QXulosa>{tr({ uz: 'Kod Mentor sonlarini ham, sizning sonlaringizni ham hisobladi.', ru: 'Код посчитал и числа Ментора, и ваши числа.' })}</QXulosa>}
          {uyda && !done && <span className="bs-kulrang fade-step">{tr({ uz: 'Uyga vazifaga «kodni tugating» qo\'shildi.', ru: 'В домашнее задание добавлено «допишите код».' })}</span>}
        </>}
        yordam={stage2 && !done && <div className="bs-kyordam">
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {yordam && <div className="bs-yordam fade-step">
            <span>{fmtCode(tr({ uz: "Bo'lish belgisi — `/`, ko'paytirish — `*`. Yangi kelganlar 0 bo'lsa, bo'lishdan oldin `if` bilan `null` qaytaring.", ru: 'Знак деления — `/`, умножения — `*`. Если новых 0, перед делением верните `null` через `if`.' }))}</span>
            <span>{fmtCode(tr({ uz: "`meniki` — sizning sonlaringiz: «Ikki sonim» saqlangan bo'lsa, o'zi qo'yilgan; bo'lmasa — o'zingiz yozing yoki shunday qoldiring. O'z sonlaringizni yozsangiz, `yorliq` ni «Mahsulotim» qiling. Natija qismiga tegmang — u tayyor.", ru: '`meniki` — ваши числа: если «Два моих числа» сохранены, они уже подставлены; если нет — впишите сами или оставьте так. Если пишете свои числа, сделайте `yorliq` «Мой продукт». Часть с результатом не трогайте — она готова.' }))}</span>
          </div>}
        </div>}
        bajardim={stage2 && !isMentor && !done && <div className="bs-baj">
          <QTugma className={cxx(kodOk && 'bs-halqa')} disabled={gpick !== 'togri' || !kodOk} onClick={bajardim}>{tr(bajLabel)}</QTugma>
          {!uyda && <QTugma ikkinchi onClick={uydaBos}>{tr({ uz: 'Kodni uyda tugataman', ru: 'Допишу код дома' })}</QTugma>}
        </div>}
        {...{ [QKOD_ONG]: <div className="bs-kodoyna">
          {!stage2 && <div className="bs-dv-sahna"><KanalKarta agar nom={tr({ uz: 'pullik kanal', ru: 'платный канал' })} som={sonFmt(AGAR.sarf) + NB + tr({ uz: "so'm", ru: 'сум' })} holat="ochiq" /><OdamTor n={AGAR.yangi} jami={AGAR.yangi} kiyim={3} tashkil={false} className="oniki" /></div>}
          {stage2 && !done && <div className="bs-mgap fade-step"><img src={MENTOR_IMG} alt="" aria-hidden="true" /><span>{tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijani shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и видите результат здесь.' })}</span></div>}
          {stage2 && !done && <div className="bs-amal"><QTugma className={cxx(!kodOk && 'bs-halqa')} ikkinchi={kodOk} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {stage2 && !kodOk && <KodNamuna kod={code || tr(starter)} />}
          {kodOk && <ul ref={natRef} className="bs-natija fade-step">{natijaQatorlar.map((t, i) => <li key={i} className={cxx(i === 3 && 'zarar', i >= 4 && 'men')}>{t}</li>)}</ul>}
          {done && <div ref={sahnaRef} className="bs-kod-sahna fade-step">
            <Ustunlar ixcham jalb={AGAR.sarf} keltir={MENTOR_SONLAR.keltiradi} jalbY={tr({ uz: 'Mentor · bitta tashkilotchi', ru: 'Ментор · один организатор' })} keltirY={tr({ uz: 'Mentor · tashkilotchi keltiradi', ru: 'Ментор · организатор приносит' })} muhr="zarar" chegara={false} />
            <Ustunlar ixcham jalb={menJalb === null ? null : Math.round(menJalb)} bolmaydi keltir={menPul} jalbY={mk.yorliq + ' · ' + tr({ uz: 'bitta foydalanuvchi', ru: 'один пользователь' })} keltirY={mk.yorliq + ' · ' + tr({ uz: 'keltiradi, taxmin', ru: 'приносит, предположение' })} />
          </div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        <Ustoz satrlar={USTOZ.s9} />
      </QKod>
      {qatlam}
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={task} starterCode={code || tr(starter)} storageKey={KOD_KEY} onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 10 — YAKUNIY SAVOL (QuestionScreen → QTest; ✔ A, INLINE_KEYS.s10 = 0; scope final; ikkala trekka to'g'ri) =====
const Screen10 = (props) => {
  const [b] = useState(birlikOl);
  const f = b ? yozuvdanForma(b) : null;
  return (
    <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
      questionText="Narx va oy taxminingiz bor, hech kim to'lamagan. Keltiradigan pulni qanday yozasiz?"
      question={<h2 className="title h-ask">{tr({ uz: <>Narx va oy taxminingiz bor, hech kim to'lamagan. <A>Keltiradigan pulni qanday yozasiz?</A></>, ru: <>У вас есть предположение цены и месяцев, никто не платил. <A>Как запишете приносимые деньги?</A></> })}</h2>}
      options={[
        { uz: 'Hisoblab, yoniga taxmin ekanini yozasiz', ru: 'Посчитаете и рядом напишете, что это предположение' },
        { uz: "Yozmaysiz, chunki hozircha to'lov yo'q", ru: 'Не запишете, потому что оплаты пока нет' },
        { uz: 'Narxni kattaroq yozasiz, ishonarli bo\'lsin', ru: 'Запишете цену побольше, чтобы было убедительно' },
        { uz: "Oylar o'rniga qaytganlar foizini qo'yasiz", ru: 'Вместо месяцев поставите долю вернувшихся' }
      ]} correctIdx={0}
      explainCorrect={{ uz: 'Taxmin ham yoziladi — yonida yorlig\'i bilan.', ru: 'Предположение тоже записывают — с ярлыком рядом.' }}
      explainWrong={{
        1: { uz: "Son bo'lmasa, solishtirib bo'lmaydi — qanday yozasiz?", ru: 'Без числа не сравнить — как запишете?' },
        2: { uz: "Kattaroq narx sonni o'zgartiradi, dalil qo'shmaydi.", ru: 'Большая цена меняет число, но не добавляет довода.' },
        3: { uz: 'Qaytganlar foizi ilovani ochishni sanaydi — oylarni emas.', ru: 'Доля вернувшихся считает открытия приложения, а не месяцы.' },
        default: { uz: "Taxmin bo'lgan son qanday yozilishini eslang.", ru: 'Вспомните, как записывают число-предположение.' }
      }}
      vizual={f
        ? <IkkiSonim f={f} ixcham taxminYon />
        : <div className="bs-tviz"><span className="bs-tv-q">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}: <b className="nat">{sonFmt(MENTOR_SONLAR.keltiradi)}{NB}{tr({ uz: "so'm", ru: 'сум' })}</b> <span className="bs-tx-y yon">{tr({ uz: 'taxmin', ru: 'предположение' })}</span></span></div>} />
  );
};

// ===== 🏅 BADGES (nishonlar) — MD «Nishonlar (4)»: inglizcha nom, tavsif qilingan ishni aytadi; tekin bonus bitta (Two Numbers) =====
const ACHIEVEMENTS = {
  costCheck: { icon: '🧮', name: 'Cost Check!', desc: { uz: 'Bitta yangi foydalanuvchining jalb qilish narxini birinchi urinishda topdingiz', ru: 'Вы с первой попытки нашли цену привлечения одного нового пользователя' } },
  rightPair: { icon: '⚖️', name: 'Right Pair!', desc: { uz: 'Solishtiriladigan ikki sonni birinchi urinishda tanladingiz', ru: 'Вы с первой попытки выбрали два числа для сравнения' } },
  twoNumbers: { icon: '📊', name: 'Two Numbers!', desc: { uz: 'Mahsulotingiz uchun ikki sonni yozib saqladingiz', ru: 'Вы записали и сохранили два числа для своего продукта' } },
  twoFunctions: { icon: '⚙️', name: 'Two Functions!', desc: { uz: 'Ikki sonni hisoblaydigan funksiyalarni yozdingiz', ru: 'Вы написали функции, которые считают два числа' } }
};
// Ekran id → nishon. s3, s6 — ballik test (birinchi urinish); s7 — saqlanganda (bonus, P-048); s9 — darvoza birinchi urinishda + «Bajardim»
const ACH_TRIGGERS = { s3: 'costCheck', s6: 'rightPair', s7: 'twoNumbers', s9: 'twoFunctions' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 6, 10)
const Q_LABELS = {
  3: { uz: '1 — Bitta yangi foydalanuvchi narxi', ru: '1 — Цена одного нового пользователя' },
  6: { uz: '2 — Qaysi ikki son', ru: '2 — Какие два числа' },
  10: { uz: "Yakuniy — Taxmin yorlig'i", ru: 'Итог — ярлык «предположение»' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (MD «Fon so'zlari», R-008: {uz, ru}, emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'jalb qilish narxi', ru: 'цена привлечения' }, l: 4, t: 10, s: 22, d: 19, dl: 0 },
  { ch: { uz: 'keltiradigan pul', ru: 'приносимые деньги' }, l: 70, t: 8, s: 22, d: 23, dl: 1.5 },
  { ch: { uz: 'kanal', ru: 'канал' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: "to'lovchi", ru: 'плательщик' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'taxmin', ru: 'предположение' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'Pro', l: 62, t: 30, s: 26, d: 17, dl: 0.4 },
  { ch: { uz: 'zarar', ru: 'убыток' }, l: 26, t: 36, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'qoplanadi', ru: 'покрывается' }, l: 20, t: 18, s: 22, d: 18, dl: 2.9 },
  { ch: 'Maydon Jamoa', l: 40, t: 56, s: 20, d: 22, dl: 3.4 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD «Jonli viktorina»), to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12
const QUIZ_BANK = [
  { q: { uz: 'Jalb qilish narxi uchun qaysi pul olinadi?', ru: 'Какие деньги берут для цены привлечения?' }, opts: [{ uz: 'Kanallarga sarflangan pul', ru: 'Деньги, потраченные на каналы' }, { uz: "Pro uchun to'lanadigan pul", ru: 'Деньги, которые платят за Pro' }, { uz: "O'yinchi to'laydigan pul", ru: 'Деньги, которые платит игрок' }, { uz: 'Post yozishga ketgan vaqt', ru: 'Время на написание поста' }], correct: 0 },
  { q: { uz: 'Mentor misolida bepul kanallar nimaga tushdi?', ru: 'Во что обошлись бесплатные каналы в примере Ментора?' }, opts: [{ uz: "Har bir kishiga 5 000 so'mga", ru: 'По 5 000 сумов на человека' }, { uz: 'Pulga emas — sarflangan vaqtga', ru: 'Не в деньги — в потраченное время' }, { uz: "Pro narxiga — 10 000 so'mga", ru: 'В цену Pro — 10 000 сумов' }, { uz: 'Hech nimaga — vaqt ham ketmagan', ru: 'Ни во что — и времени не ушло' }], correct: 1 },
  { q: { uz: "Mentor misolida ilovaga kim pul to'lashi mumkin?", ru: 'Кто может платить приложению в примере Ментора?' }, opts: [{ uz: 'Hamma foydalanuvchi har oy', ru: 'Все пользователи каждый месяц' }, { uz: 'Sinfdoshlar, boshqalar emas', ru: 'Одноклассники, а не другие' }, { uz: 'Pro oladigan tashkilotchi', ru: 'Организатор, который берёт Pro' }, { uz: "Maydon egasi har o'yinda", ru: 'Хозяин площадки за каждую игру' }], correct: 2 },
  { q: { uz: 'Mentor misolida Pro nima?', ru: 'Что такое Pro в примере Ментора?' }, opts: [{ uz: 'Bir martalik kirish puli', ru: 'Разовая плата за вход' }, { uz: "Har o'yin uchun to'lov", ru: 'Плата за каждую игру' }, { uz: 'Yangi ilova versiyasi', ru: 'Новая версия приложения' }, { uz: '30 kunlik pullik obuna', ru: 'Платная подписка на 30 дней' }], correct: 3 },
  { q: { uz: 'Mentorning taxminicha, bitta Pro tashkilotchi qancha keltiradi?', ru: 'Сколько, по предположению Ментора, приносит один организатор с Pro?' }, opts: [{ uz: "30 000 so'm", ru: '30 000 сумов' }, { uz: "10 000 so'm", ru: '10 000 сумов' }, { uz: "60 000 so'm", ru: '60 000 сумов' }, { uz: "20 000 so'm", ru: '20 000 сумов' }], correct: 0 },
  { q: { uz: "Bu darsdagi jalbNarxi yangi foydalanuvchi 0 bo'lsa nima qaytaradi?", ru: 'Что возвращает jalbNarxi из этого урока, если новых пользователей 0?' }, opts: [{ uz: '0 — chunki pul ham nol', ru: '0 — ведь и денег ноль' }, { uz: "null — bo'lib bo'lmaydi", ru: 'null — нельзя разделить' }, { uz: "Sarflangan pulning o'zini", ru: 'Сами потраченные деньги' }, { uz: 'Infinity — cheksiz son', ru: 'Infinity — бесконечность' }], correct: 1 },
  { q: { uz: 'Qaytganlar foizi nimani sanaydi?', ru: 'Что считает доля вернувшихся?' }, opts: [{ uz: 'Pullik obunani uzaytirganlarni', ru: 'Тех, кто продлил платную подписку' }, { uz: 'Pro olgan tashkilotchilar sonini', ru: 'Число организаторов с Pro' }, { uz: 'Ilovani yana ochgan qurilmalarni', ru: 'Устройства, снова открывшие приложение' }, { uz: 'Kanaldan kelgan yangi kishilarni', ru: 'Новых людей из канала' }], correct: 2 },
  { q: { uz: "To'lovchini jalb qilish 25 000 so'm, u 20 000 keltiradi. Xulosa?", ru: 'Привлечь плательщика — 25 000 сумов, он приносит 20 000. Вывод?' }, opts: [{ uz: 'Qoplanadi — chunki pul keladi', ru: 'Покрывается — ведь деньги приходят' }, { uz: "Teng — ikkalasi ham so'mda", ru: 'Равно — оба в сумах' }, { uz: "Noma'lum — sonlar juda katta", ru: 'Неизвестно — числа слишком большие' }, { uz: 'Zarar — jalb qilish qimmat', ru: 'Убыток — привлечение дороже' }], correct: 3 },
  { q: { uz: 'Mentor misolida bepul kanallar nega chegarali?', ru: 'Почему бесплатные каналы в примере Ментора ограничены?' }, opts: [{ uz: "Ulardagi a'zolar soni cheklangan", ru: 'В них немного участников' }, { uz: "Ularga keyin pul to'lash kerak", ru: 'Потом им нужно платить' }, { uz: 'Ularda post yozish taqiqlangan', ru: 'В них запрещено писать посты' }, { uz: 'Ular bir haftadan keyin yopiladi', ru: 'Они закрываются через неделю' }], correct: 0 },
  { q: { uz: 'Jalb qilish narxida «yangi foydalanuvchi» kim?', ru: 'Кто «новый пользователь» в цене привлечения?' }, opts: [{ uz: 'Ilovani bir marta ochgan qurilma', ru: 'Устройство, один раз открывшее приложение' }, { uz: "Shu davrda ro'yxatdan o'tgan kishi", ru: 'Человек, зарегистрировавшийся за период' }, { uz: "Pro uchun pul to'lagan tashkilotchi", ru: 'Организатор, заплативший за Pro' }, { uz: "Postni o'qib chiqqan har bir kishi", ru: 'Каждый, кто прочитал пост' }], correct: 1 },
  { q: { uz: 'Pullik kanalni baholashda kimni jalb qilish narxi olinadi?', ru: 'Чью цену привлечения берут, оценивая платный канал?' }, opts: [{ uz: 'Kanaldan kelgan har bir kishini', ru: 'Каждого, кто пришёл из канала' }, { uz: 'Ilovadagi hamma foydalanuvchini', ru: 'Всех пользователей приложения' }, { uz: "Pul to'laydigan foydalanuvchini", ru: 'Пользователя, который платит' }, { uz: "Eng ko'p o'ynaydigan o'yinchini", ru: 'Игрока, который играет больше всех' }], correct: 2 },
  { q: { uz: 'Keltiradigan pulni qanday hisoblaymiz?', ru: 'Как считаем приносимые деньги?' }, opts: [{ uz: "Narxni kishilar soniga ko'paytiramiz", ru: 'Умножаем цену на число людей' }, { uz: "Narxga kanal pulini ham qo'shamiz", ru: 'Прибавляем к цене деньги на канал' }, { uz: "Oylarni kishilar soniga bo'lamiz", ru: 'Делим месяцы на число людей' }, { uz: "Narxni oylar soniga ko'paytiramiz", ru: 'Умножаем цену на число месяцев' }], correct: 3 }
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
const MentorPracticeStats = ({ live, screen, yorliq }) => {
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

// 🃏 KARTOCHKALAR — MD «Kartochkalar (12)» (alohida ekran, Mentorsiz — SABOQ 12, 16; ko'rinish qolipda: QKartochka)
const FLASHCARDS = [
  { front: { uz: 'Jalb qilish narxi nima?', ru: 'Что такое цена привлечения?' }, back: { uz: "Bir davrda kanallarga sarflangan pulni shu davrda kelgan yangi foydalanuvchilarga bo'lganda chiqadigan son", ru: 'Число, которое выходит, если деньги на каналы за период разделить на новых пользователей за этот период' }, note: { uz: 'Inglizchasi: CAC', ru: 'По-английски: CAC' } },
  { front: { uz: 'Foydalanuvchi keltiradigan pul nima?', ru: 'Что такое деньги, которые приносит пользователь?' }, back: { uz: 'Bitta foydalanuvchidan butun foydalanish davomida keladigan pul', ru: 'Деньги от одного пользователя за всё время использования' }, note: { uz: "Inglizchasi: LTV. Hisoblash: narxni necha oy to'lashiga ko'paytiramiz", ru: 'По-английски: LTV. Расчёт: умножаем цену на число месяцев оплаты' } },
  { front: { uz: 'Mentor misolida kanallarga qancha pul sarflangan?', ru: 'Сколько денег потрачено на каналы в примере Ментора?' }, back: { uz: "0 so'm", ru: '0 сумов' }, note: { uz: 'Pul emas — vaqt sarflangan: postlar va javoblar', ru: 'Потрачены не деньги, а время: посты и ответы' } },
  { front: { uz: 'Mentor misolida bepul kanallar nega yetmay qolishi mumkin?', ru: 'Почему в примере Ментора бесплатных каналов может не хватить?' }, back: { uz: "Guruh va sinf chatidagi a'zolar soni cheklangan", ru: 'Участников в группе и чате класса немного' }, note: { uz: 'Bu — shu misol haqida, har bepul kanal haqida emas', ru: 'Это про этот пример, а не про любой бесплатный канал' } },
  { front: { uz: "Mentor misolida ilovaga kim pul to'lashi mumkin?", ru: 'Кто может платить приложению в примере Ментора?' }, back: { uz: "Pro oladigan tashkilotchi; o'yinchilar uchun ilova bepul", ru: 'Организатор, который берёт Pro; для игроков приложение бесплатно' }, note: { uz: '44 kishidan 6 tasi — tashkilotchi', ru: '6 из 44 — организаторы' } },
  { front: { uz: 'Pro nima?', ru: 'Что такое Pro?' }, back: { uz: 'Mentor misolida tashkilotchi uchun 30 kunlik pullik obuna', ru: 'В примере Ментора — платная подписка на 30 дней для организатора' }, note: { uz: "Unda «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi", ru: 'В ней «Постоянная игра»: каждую неделю в тот же день и час игра объявляется сама' } },
  { front: { uz: 'Bitta Pro tashkilotchi qancha pul keltiradi?', ru: 'Сколько денег приносит один организатор с Pro?' }, back: { uz: "Mentorning taxmini: 30 000 so'm", ru: 'Предположение Ментора: 30 000 сумов' }, note: { uz: "30 kunga 10 000 so'm, o'rtacha 3 oy", ru: '10 000 сумов за 30 дней, в среднем 3 месяца' } },
  { front: { uz: "To'lovchi kim?", ru: 'Кто такой плательщик?' }, back: { uz: "Pul to'laydigan foydalanuvchi", ru: 'Пользователь, который платит' }, note: { uz: 'Ikki son uning uchun solishtiriladi', ru: 'Два числа сравнивают для него' } },
  { front: { uz: '«Agar» mashqida pullik kanal nega zarar?', ru: 'Почему платный канал в упражнении «если» — убыток?' }, back: { uz: "Bitta tashkilotchini jalb qilish 60 000 so'm — u keltiradigan 30 000 dan ko'p", ru: 'Привлечь одного организатора стоит 60 000 сумов — больше, чем 30 000, которые он приносит' }, note: { uz: 'Mashq sonlari — Mentorning taxmini', ru: 'Числа упражнения — предположение Ментора' } },
  { front: { uz: 'Qaytganlar foizi pullik obunani davom ettirish bilan bir xilmi?', ru: 'Доля вернувшихся — то же, что продление платной подписки?' }, back: { uz: "Yo'q: u ilovani yana ochgan qurilmalarni sanaydi", ru: 'Нет: она считает устройства, снова открывшие приложение' }, note: { uz: 'Mentor misolida 43%', ru: 'В примере Ментора 43%' } },
  { front: { uz: "Yangi foydalanuvchi 0 bo'lsa, jalb qilish narxi qancha?", ru: 'Какая цена привлечения, если новых пользователей 0?' }, back: { uz: "Hisoblab bo'lmaydi: nolga bo'linmaydi", ru: 'Посчитать нельзя: на ноль не делят' }, note: { uz: 'Bu darsdagi kodda — `null`', ru: 'В коде этого урока — `null`' } },
  { front: { uz: '«Zarar» chiqsa — bu yomon bahomi?', ru: 'Если вышел «убыток» — это плохая оценка?' }, back: { uz: "Yo'q: qaysi son o'zgarishi kerakligini ko'rsatadi", ru: 'Нет: он показывает, какое число должно измениться' }, note: { uz: "Masalan: kanal narxi yoki nechta to'lovchi kelishi", ru: 'Например: цена канала или сколько придёт плательщиков' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('bs-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back), note: fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="bs-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③; ③ holatdan; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'ota-ona yoki sinfdosh', ru: 'родитель или одноклассник' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '2 son', ru: '2 числа' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { uz: 'Ikki soningizni bir kishiga tushuntiring: qaysi biri sanalgan, qaysi biri taxmin.', ru: 'Объясните одному человеку свои два числа: какое посчитано, а какое — предположение.' },
  { uz: "Keltiradigan pulingizga qarab yozing: pullik kanal o'z pulini qoplashi uchun bitta to'lovchini jalb qilish narxi necha so'mdan oshmasligi kerak?", ru: 'Глядя на свои приносимые деньги, напишите: сколько сумов не должна превышать цена привлечения одного плательщика, чтобы платный канал окупил свои деньги?' }
];
const HW_RAQAM = ['①', '②', '③'];
// PM-109 (SABOQ P4): erta tugatgan o'quvchi yo'li — AI sherik (tekshiruvchi) rolida, o'quvchi o'z sonlarini o'zi aytadi; sinfda gemini.google.com
const AI_SOROV = {
  uz: "Sen mening sinfdoshimsan va ikki sonimni tekshirasan: jalb qilish narxi va foydalanuvchi keltiradigan pul. Menga bittadan uchta savol ber: yangi foydalanuvchilar soni qayerdan olingan, to'lovchi mahsulotimdan nima oladi, narx va oy — kimdir aytganmi yoki taxminmi. Har javobimdan keyin ✓ yoki ✕ qo'y va nima yetishmaganini bir gapda ayt. Sonni o'zing o'ylab topma. Mening sonlarim: ",
  ru: 'Ты мой одноклассник и проверяешь два моих числа: цену привлечения и деньги, которые приносит пользователь. Задай мне по одному три вопроса: откуда взято число новых пользователей, что плательщик получает от моего продукта, цена и месяцы — кто-то назвал или это предположение. После каждого моего ответа ставь ✓ или ✕ и одной фразой скажи, чего не хватило. Сам числа не придумывай. Мои числа: '
};
const AiDavomCard = () => {
  const [nusxa, setNusxa] = useState(false);
  const kochir = () => { try { navigator.clipboard.writeText(tr(AI_SOROV)); setNusxa(true); setTimeout(() => setNusxa(false), 1800); } catch { /* qo'lda belgilab oladi */ } };
  return (
    <div className="card bs-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <span className="bs-ai-m">{tr({ uz: "gemini.google.com'ni oching, pastdagi so'rovni yuboring va oxiriga ikki soningizni yozing — AI sherigingiz bo'lib, uchta savol beradi. ✕ olgan joyni «Orqaga» bilan qaytib, «Ikki sonim» kartasida aniqlashtiring.", ru: 'Откройте gemini.google.com, отправьте запрос ниже и допишите в конце свои два числа — AI станет вашим партнёром и задаст три вопроса. Место с ✕ уточните в карточке «Два моих числа», вернувшись через «Назад».' })}</span>
      <pre className="bs-ai-sorov">{tr(AI_SOROV)}</pre>
      <button type="button" className="q-chip bs-ai-btn" onClick={kochir}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card bs-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="bs-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="bs-hw-q"><span className="bs-hw-k">{tr(r.k)}</span><span className="bs-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="bs-hw-qadam">
      {HW_BANDLAR.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}
      {qolgan.length > 0 && <li><i>{HW_RAQAM[2]}</i><span>{tr({ uz: 'Darsda qolgan qismni tugating:', ru: 'Закончите то, что осталось с урока:' })} {qolgan.map(tr).join(' · ')}.</span></li>}
    </ol>
    <span className="bs-hw-ost">{tr({ uz: "Hech qayerga pul to'lamang: pullik kanal — faqat mashq.", ru: 'Никуда не платите: платный канал — только упражнение.' })}</span>
    {keyingi && <span className="bs-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (to'rt holat, E 54; ✓ faqat birinchisida). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50)
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
  // «Endi siz bilasiz» — asosiy fikr so'zma-so'z takrorlanmaydi (T-048)
  const RECAP = [
    { uz: "Jalb qilish narxi — bir davrda kanallarga sarflangan pulni shu davrda kelgan yangi foydalanuvchilarga bo'lganda chiqadigan son.", ru: 'Цена привлечения — число, которое выходит, если деньги на каналы за период разделить на новых пользователей за этот период.' },
    { uz: 'Foydalanuvchi keltiradigan pul — bitta foydalanuvchidan butun foydalanish davomida keladigan pul.', ru: 'Деньги, которые приносит пользователь, — деньги от одного пользователя за всё время использования.' },
    { uz: "Ikki son bitta to'lovchi uchun solishtiriladi; mahsulotni ushlab turish puli bu hisobga kirmaydi.", ru: 'Два числа сравнивают для одного плательщика; деньги на содержание продукта в этот расчёт не входят.' },
    { uz: 'Bepul kanalda pul sarflanmaydi, lekin vaqt sarflanadi.', ru: 'На бесплатный канал не тратят деньги, но тратят время.' },
    { uz: "Hali tekshirilmagan son yoniga «taxmin» deb yoziladi.", ru: 'Рядом с ещё не проверенным числом пишут «предположение».' }
  ];
  const b = birlikOl();
  const s9 = answers[9] || {};
  const kodQoldi = !s9.done;
  const holat = isMentorL ? 'mentor' : !b ? 'yoq' : b.tur === 'mashq' ? 'mashq' : (b.jalbNarxi !== null && b.jalbNarxi !== undefined && b.keltiradi !== null && b.keltiradi !== undefined) ? 'toliq' : 'qisman';
  const SARLAVHA = {
    toliq: { uz: <>Ikki soningiz yozildi — <A>keltiradigan pul taxmin bilan.</A></>, ru: <>Два ваших числа записаны — <A>приносимые деньги с пометкой «предположение».</A></> },
    qisman: { uz: <>Sonlaringiz yozildi — <A>ba'zisi hali noma'lum.</A></>, ru: <>Ваши числа записаны — <A>некоторые пока неизвестны.</A></> },
    mashq: { uz: <>Mentor sonlari bilan <A>mashq qildingiz.</A></>, ru: <>Вы потренировались <A>на числах Ментора.</A></> },
    yoq: { uz: <>Ikki son hali yozilmagan — <A>uyda yozing.</A></>, ru: <>Два числа ещё не записаны — <A>запишите дома.</A></> },
    mentor: { uz: <>Bitta foydalanuvchi sizga <A>qanchaga tushadi?</A></>, ru: <>Во сколько вам <A>обходится один пользователь?</A></> }
  };
  const qolgan = isMentorL ? [] : [
    !b && { uz: 'ikki sonni yozing', ru: 'запишите два числа' },
    kodQoldi && { uz: 'kodni tugating', ru: 'допишите код' }
  ].filter(Boolean);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Mahsulotingiz qanday pul topadi?»</b></>, ru: <>Следующий урок — <b>«Как ваш продукт зарабатывает?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('bs-yakun', holat !== 'toliq' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
            {!isMentorL && <AiDavomCard />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard qolgan={qolgan} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmUnitEconomicsLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARS VIZUALI — BirlikSahna (.bs-): faqat qolip tokenlari (D3), emoji yo'q (D4); rangli yon chiziq yo'q === */
        .bs-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .bs-ustoz b { color: ${T.ink}; }
        .bs-mj { color: ${MAYDON_RANG}; font-weight: 800; white-space: nowrap; }
        .bs-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 4px 10px; white-space: nowrap; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: bs-uch 0.85s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes bs-uch { 0% { transform: none; opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(0.85); opacity: 0.15; } }
        .bs-tx { display: block; margin-bottom: 5px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .bs-tx b { color: ${T.ink}; } .bs-tx.ok, .bs-tx.ok b { color: ${T.ok}; } .bs-tx b.yoq { color: ${T.err}; }
        .q-xulosa .bs-x-m { display: block; }
        .q-xulosa .bs-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.2)}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .bs-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 8px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .bs-bashq-t b { color: ${T.accent}; }
        .bs-yorliq { font-size: 11.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .bs-kulrang { display: block; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .bs-kulrang.qora { color: ${T.ink}; } .bs-kulrang b { color: ${T.ink}; white-space: nowrap; }
        p.bs-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .kir { animation: fade-in-up 0.45s ease-out both; }
        /* Odam belgilari (11 × 4 to'r) */
        .bs-odam { display: block; width: 22px; height: 44px; }
        .bs-odam.mini { display: inline-block; width: 14px; height: 28px; vertical-align: middle; }
        .bs-tor { display: grid; grid-template-columns: repeat(var(--ust, 11), 22px); gap: 2px 4px; justify-content: start; }
        .bs-tor.kichik { grid-template-columns: repeat(var(--ust, 11), 16px); gap: 1px 3px; }
        .bs-tor.kichik .bs-odam { width: 16px; height: 32px; }
        .bs-tor-k { position: relative; min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; transition: opacity 0.35s; }
        .bs-tor.kichik .bs-tor-k { min-height: 32px; }
        .bs-tor-k.kor { animation: bs-odam 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .bs-tor-k.xira { opacity: 0.25; }
        @keyframes bs-odam { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .bs-tor.oniki { grid-template-columns: repeat(6, 44px); gap: 6px 6px; }
        .bs-tor.oniki .bs-tor-k { min-height: 64px; }
        .bs-tor-u { font-size: 11px; font-weight: 800; color: ${T.accent}; white-space: nowrap; animation: fade-in-up 0.35s ease-out both; }
        .bs-tor.yigildi .bs-tor-k:not(.xira) .bs-tor-u { font-size: 12.5px; background: ${T.accentSoft}; border-radius: 6px; padding: 1px 5px; }
        /* Kanal kartasi */
        .bs-kanallar { display: flex; flex-direction: column; gap: 8px; }
        .bs-kanallar.qator { flex-direction: row; flex-wrap: wrap; }
        .bs-kanal { display: flex; flex-direction: column; gap: 4px; padding: 9px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-family: 'Manrope', sans-serif; text-align: left; color: ${T.ink}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.18); transition: border-color 0.25s, background 0.25s; min-width: 0; }
        button.bs-kanal { cursor: pointer; }
        button.bs-kanal:disabled { cursor: default; }
        .bs-kanal-q { display: flex; align-items: center; gap: 9px; min-width: 0; }
        .bs-kanal-ic { position: relative; flex: none; width: 26px; height: 20px; border-radius: 8px 8px 8px 2px; background: ${fon(T.accent, 0.14)}; display: flex; flex-direction: column; justify-content: center; gap: 3px; padding: 0 5px; }
        .bs-kanal-ic i { display: block; height: 2.5px; border-radius: 2px; background: ${T.accent}; } .bs-kanal-ic i + i { width: 60%; }
        .bs-kanal-n { flex: 1; min-width: 0; font-size: 13px; font-weight: 700; line-height: 1.3; }
        .bs-kanal-som { flex: none; font-size: 13px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; padding: 2px 8px; border-radius: 8px; background: ${T.bg}; }
        .bs-kanal.ochiq .bs-kanal-som { color: ${T.ink}; background: ${T.okFon}; }
        .bs-kanal.yon .bs-kanal-som { animation: bs-yon 1.1s ease-out var(--yd, 0s) both; }
        @keyframes bs-yon { 0%, 100% { color: ${T.ink2}; background: ${T.bg}; } 35%, 65% { color: #fff; background: ${T.accent}; } }
        .bs-kanal.faol { border-color: ${fon(T.accent, 0.6)}; animation: bs-chorla 1.8s ease-out .4s 2; }
        .bs-kanal.agar { border-style: dashed; border-color: ${T.ink2}; }
        .bs-kanal-y { align-self: flex-start; font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 6px; }
        .bs-kanal-iz { font-size: 12px; color: ${T.ink2}; }
        /* Telefon (≈170×272, chapda) */
        .bs-telj { flex: none; }
        .bs-tel { width: 170px; height: 272px; border-radius: 26px; background: #1F2027; padding: 9px; box-shadow: 0 14px 30px -12px rgba(${T.shadowBase},0.45); }
        .bs-tel-bar { display: flex; align-items: center; justify-content: center; height: 26px; border-radius: 16px 16px 0 0; background: ${T.paper}; font-size: 12.5px; border-bottom: 1px solid ${T.line}; }
        .bs-tel-ekran { height: calc(100% - 26px); border-radius: 0 0 16px 16px; background: ${T.bg}; padding: 9px 9px; display: flex; flex-direction: column; gap: 7px; overflow: hidden; }
        .bs-tel-h { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .bs-tel-rol { align-self: flex-start; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 1px 7px; }
        .bs-tel-karta { display: flex; flex-direction: column; gap: 2px; padding: 9px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 4px 10px -6px rgba(${T.shadowBase},0.3); font-size: 12px; color: ${T.ink2}; }
        .bs-tel-karta b { font-size: 13px; color: ${T.ink}; }
        .bs-tel-son { font-weight: 800; color: ${MAYDON_RANG}; white-space: nowrap; }
        .bs-tel-karta.yon { animation: bs-tel-yon 1.4s ease-out both; }
        @keyframes bs-tel-yon { 0%, 100% { box-shadow: 0 4px 10px -6px rgba(${T.shadowBase},0.3); } 40% { box-shadow: 0 0 0 3px ${fon(T.accent, 0.45)}; } }
        .bs-tel-btn { margin-top: auto; text-align: center; padding: 8px 6px; border-radius: 10px; background: ${MAYDON_RANG}; color: #fff; font-size: 12.5px; font-weight: 800; }
        .bs-tel-btn.yon { animation: bs-tel-btn 1.6s ease-out both; }
        @keyframes bs-tel-btn { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.6)}; } 50% { box-shadow: 0 0 0 7px ${fon(T.accent, 0.2)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        /* Ikki ustun + muhr */
        .bs-ustunlar { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .bs-ustunlar.yashirin { visibility: hidden; }
        .bs-ustunlar.yakka .bs-ust.jalb { display: none; }
        .bs-ust { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 4px 10px; align-items: end; }
        .bs-ust-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; min-width: 0; }
        .bs-ust-s { font-size: 15px; font-weight: 800; color: ${T.ink}; white-space: nowrap; text-align: right; }
        .bs-ust-s em { display: inline-block; margin-left: 6px; font-style: normal; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .bs-ust-t { grid-column: 1 / -1; height: 14px; border-radius: 7px; background: ${fon(T.ink2, 0.14)}; overflow: hidden; }
        .bs-ust-t i { display: block; height: 100%; border-radius: 7px; animation: bs-osish 0.9s cubic-bezier(.4,0,.2,1) both; transform-origin: left; }
        .bs-ust.jalb .bs-ust-t i { background: ${T.accent}; } .bs-ust.keltir .bs-ust-t i { background: ${T.ok}; }
        @keyframes bs-osish { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .bs-ustunlar.ixcham { gap: 7px; } .bs-ustunlar.ixcham .bs-ust-t { height: 10px; } .bs-ustunlar.ixcham .bs-ust-s { font-size: 13.5px; }
        .bs-muhr { align-self: center; padding: 3px 14px; border-radius: 8px; border: 2px solid ${T.ink2}; color: ${T.ink2}; font-size: 13px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; transform: rotate(-3deg); animation: bs-muhr 0.45s cubic-bezier(.3,1.5,.5,1) both; white-space: nowrap; }
        .bs-muhr.qoplanadi { border-color: ${T.ok}; color: ${T.ok}; } .bs-muhr.zarar { border-color: ${T.err}; color: ${T.err}; }
        .bs-muhr.bosh { border-style: dashed; animation: none; }
        @keyframes bs-muhr { from { opacity: 0; transform: rotate(-3deg) translateY(-12px) scale(1.25); } to { opacity: 1; transform: rotate(-3deg); } }
        .bs-chegara, .bs-halol, .bs-ora { display: block; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .bs-halol { color: ${T.ink}; }
        .bs-ora { text-align: center; }
        /* 1-ekran: kirish maketi */
        @media (min-width: 761px) {
          .bs-katta.yakuniy.yig { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap: 8px 22px; align-items: start; padding: 14px 18px; }
          .bs-katta.yakuniy.yig > .bs-ikkisonim, .bs-katta.yakuniy.yig .bs-ustunlar { display: contents; }
          .bs-katta.yakuniy.yig .bs-is-h { grid-column: 1; grid-row: 1; align-self: center; }
          .bs-katta.yakuniy.yig > .bs-katta-tug { grid-column: 2; grid-row: 1; justify-content: flex-end; }
          .bs-katta.yakuniy.yig .bs-ust.jalb { grid-column: 1; grid-row: 2; }
          .bs-katta.yakuniy.yig .bs-muhr { grid-column: 1; grid-row: 3; justify-self: center; }
          .bs-katta.yakuniy.yig .bs-ust.keltir { grid-column: 1; grid-row: 4; }
          .bs-katta.yakuniy.yig .bs-chegara { grid-column: 2; grid-row: 2; align-self: center; }
          .bs-katta.yakuniy.yig .bs-halol { grid-column: 2; grid-row: 3; align-self: center; }
          .bs-katta.yakuniy.yig .bs-is-kim { grid-column: 2; grid-row: 4; align-self: end; }
          .bs-katta.yakuniy.yig .bs-ust-t { height: 10px; }
        }
        .bs-varaq.yig { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px; }
        .bs-vq-ch { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px 6px 6px; border-radius: 999px; font-size: 13.5px; font-weight: 800; background: ${T.okFon}; color: ${T.ok}; }
        .bs-vq-ch.x { background: ${T.bg}; color: ${T.err}; }
        .bs-vq-ch i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11.5px; background: ${T.paper}; color: ${T.ink2}; }
        .bs-vq-ch em { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        @media (min-width: 761px) { .bs-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        .bs-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: bs-chorla-v 1.8s ease-out .5s 2; }
        .bs-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .bs-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .bs-hook { display: flex; gap: 14px; align-items: flex-start; }
        .bs-hook-o { display: flex; flex-direction: column; gap: 9px; width: 210px; min-width: 0; }
        .bs-hook:not(.telli) .bs-hook-o { width: 300px; }
        .bs-hook .bs-kanal { animation: fade-in-up 0.4s ease-out both; }
        .bs-ovoz { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
        .bs-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 90px 26px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .bs-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .bs-ovoz-y { height: 8px; border-radius: 4px; background: ${fon(T.ink2, 0.15)}; overflow: hidden; } .bs-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.5s; }
        /* 2-ekran: reja */
        .bs-chap-y { display: inline-block; margin-left: 6px; font-size: 12px; font-weight: 700; color: ${T.ink2}; text-transform: none; letter-spacing: 0; }
        .bs-reja { display: flex; flex-direction: column; gap: 9px; padding: 12px 14px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.2); }
        .bs-reja .bs-kanal { animation: fade-in-up 0.4s ease-out both; }
        .bs-reja .bs-tor-k.kor { animation-duration: 0.3s; }
        /* Qadamlar chizig'i va tugmalar qatori */
        .bs-qchiziq { display: flex; flex-wrap: wrap; gap: 8px; }
        .bs-qc { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px 5px 6px; border-radius: 999px; background: ${T.paper}; font-size: 13px; font-weight: 700; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .bs-qc i { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 11.5px; font-weight: 800; background: ${T.bg}; }
        .bs-qc.joriy { color: ${T.accent}; border-color: ${fon(T.accent, 0.5)}; } .bs-qc.joriy i { background: ${T.accent}; color: #fff; }
        .bs-qc.otdi { color: ${T.ok}; } .bs-qc.otdi i { background: ${T.okFon}; color: ${T.ok}; }
        .bs-tqator { display: flex; flex-wrap: wrap; gap: 8px; }
        .bs-tugma { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px 10px 10px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; color: ${T.ink2}; cursor: pointer; }
        .bs-tugma i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.bg}; }
        .bs-tugma:disabled { cursor: default; }
        .bs-tugma.joriy { color: ${T.accent}; border-color: ${T.accent}; outline: 2px solid ${fon(T.accent, 0.35)}; outline-offset: 2px; animation: bs-puls 2.2s ease-out .3s 3; }
        .bs-tugma.joriy i { background: ${T.accent}; color: #fff; }
        .bs-tugma.otdi { color: ${T.ok}; border-color: ${fon(T.ok, 0.4)}; } .bs-tugma.otdi i { background: ${T.okFon}; color: ${T.ok}; }
        /* Ustun kartasi, sahna ustunlari */
        .q-tushuncha .q-split { align-items: start; }
        .bs-kq { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .bs-ukarta { display: flex; flex-direction: column; gap: 9px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.22); min-width: 0; }
        .bs-ukarta-h { font-size: 12.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.accent}; }
        .bs-uq { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 10px; font-size: 13.5px; color: ${T.ink2}; }
        .bs-uq b { color: ${T.ink}; } .bs-uq b.yangi { animation: bs-yangi 1s ease-out both; border-radius: 6px; padding: 0 4px; }
        .bs-uq b em { font-style: normal; font-weight: 600; color: ${T.ink2}; }
        @keyframes bs-yangi { 0% { background: ${fon(T.ok, 0.35)}; } 100% { background: transparent; } }
        .bs-unat { padding: 9px 12px; border-radius: 10px; background: ${T.bg}; font-size: 14px; color: ${T.ink2}; }
        .bs-unat b { color: ${T.ink}; white-space: nowrap; } .bs-unat.ok { background: ${T.okFon}; } .bs-unat.agar { border: 1.5px dashed ${T.line}; }
        .bs-ikki-nat { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; }
        .bs-nat-k { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; background: ${T.okFon}; }
        .bs-nat-k.agar { background: ${T.bg}; border: 1.5px dashed ${T.line}; }
        .bs-nat-k span { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; } .bs-nat-k b { font-size: 22px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .bs-nat-k em { font-style: normal; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .bs-ong { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        .bs-ikki { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 18px; align-items: start; }
        .bs-ikki.sol { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
        .bs-ikki.toliq { grid-template-columns: auto minmax(0,1fr); }
        .bs-ikki.sol.toliq { grid-template-columns: minmax(0,1fr); }
        .q-fokus .bs-ukarta.toliq { width: 100%; }
        .bs-maydon { display: flex; flex-direction: column; gap: 7px; padding: 12px; border-radius: 14px; background: ${T.paper}; }
        .bs-maydon-h { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .bs-agar-odam { display: flex; flex-direction: column; gap: 5px; padding-top: 8px; border-top: 1px dashed ${T.line}; }
        .bs-agar-btn { align-self: flex-start; }
        .bs-tash-ch { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .bs-tash-odam { display: flex; gap: 2px; } .bs-tash-odam .bs-odam { width: 16px; height: 32px; }
        .bs-pro { display: flex; flex-direction: column; gap: 3px; padding: 9px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .bs-pro-y { align-self: flex-start; font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 1px 6px; }
        .bs-oylar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .bs-oy { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 6px; border-radius: 10px; border: 1.5px dashed ${T.line}; min-height: 62px; font-size: 12.5px; color: ${T.ink2}; }
        .bs-oy.tushdi { border-style: solid; border-color: ${fon(T.ok, 0.45)}; background: ${T.okFon}; }
        .bs-tanga { font-style: normal; font-size: 12.5px; font-weight: 800; color: ${T.ok}; white-space: nowrap; animation: bs-tanga 0.45s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes bs-tanga { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        /* 4-ekran: material va javobdan keyingi vizual */
        .bs-mat { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .bs-mat-y { align-self: flex-start; font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 6px; }
        .bs-mat-h { font-size: 14px; color: ${T.ink}; }
        .bs-mat-q b { color: ${T.ink}; white-space: nowrap; }
        .bs-tviz-w { margin-top: 4px; }
        .bs-tviz { padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .bs-tv-q { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; color: ${T.ink2}; }
        .bs-tv-q b { white-space: nowrap; color: ${T.ink}; } .bs-tv-q b.yangi { color: ${T.accent}; } .bs-tv-q b.nat { color: ${T.ok}; font-size: 16px; }
        .bs-tv-ch { display: inline-block; width: 26px; height: 2px; background: ${T.accent}; position: relative; animation: bs-osish 0.6s ease-out both; transform-origin: left; }
        .bs-tv-ch::after { content: ''; position: absolute; right: -2px; top: -3px; border-left: 6px solid ${T.accent}; border-top: 4px solid transparent; border-bottom: 4px solid transparent; }
        /* 8-ekran: kartalar va maydonlar */
        .bs-chiziq, .bs-s8-bosh { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .bs-chiziq > b { font-size: 13px; font-weight: 800; color: ${T.ink}; margin-right: 4px; }
        .bs-kartatab { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px 5px 6px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; color: ${T.ink2}; cursor: pointer; }
        .bs-kartatab:disabled { cursor: default; opacity: 0.6; }
        .bs-kartatab i { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 11.5px; font-weight: 800; background: ${T.bg}; }
        .bs-kartatab.joriy { color: ${T.accent}; border-color: ${fon(T.accent, 0.5)}; } .bs-kartatab.joriy i { background: ${T.accent}; color: #fff; }
        .bs-kartatab.ok { color: ${T.ok}; } .bs-kartatab.ok i { background: ${T.okFon}; color: ${T.ok}; }
        .bs-katta { display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border-radius: 18px; background: ${T.paper}; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.25); transition: background 0.4s; }
        .bs-katta.yashil { background: ${T.okFon}; }
        .bs-katta-h { display: flex; align-items: center; gap: 10px; font-size: 15px; color: ${T.ink}; }
        .bs-mashq-y { font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 7px; }
        .bs-katta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .bs-yordam-btn { margin-left: auto; }
        .bs-yordam { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 12px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .bs-kf { display: flex; flex-direction: column; gap: 9px; }
        .bs-kanal-qator { display: grid; grid-template-columns: minmax(0,0.75fr) minmax(0,1.5fr) auto; gap: 8px; align-items: center; }
        .bs-kanal-qator:has(> .bs-maydon-i:only-child) { grid-template-columns: minmax(0,1fr); }
        .bs-kanal-qator:has(> .q-chip) { grid-template-columns: minmax(0,1fr) auto; }
        .bs-maydon-i { display: flex; align-items: center; gap: 8px; padding: 0 10px; min-height: 42px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; transition: border-color 0.2s; min-width: 0; }
        .bs-maydon-i:focus-within { border-color: ${T.accent}; }
        .bs-maydon-i input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-family: 'Manrope', sans-serif; font-size: 13.5px; color: ${T.ink}; padding: 9px 0; }
        .bs-maydon-i input::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .bs-maydon-i.err { border-color: ${T.err}; } .bs-maydon-i.off { opacity: 0.55; background: ${T.bg}; }
        .bs-maydon-i.yozildi { animation: bs-yangi 1.2s ease-out both; }
        .bs-mn { flex: none; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .bs-halqa-i { border-color: ${T.accent} !important; animation: bs-halqa-i 2.4s ease-in-out .4s 3; }
        .bs-qosh { align-self: flex-start; }
        .bs-belgi { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: ${T.ink}; cursor: pointer; }
        .bs-belgi input { width: 16px; height: 16px; accent-color: ${T.accent}; }
        .bs-jonli { display: block; padding: 8px 12px; border-radius: 10px; background: ${T.bg}; font-size: 13.5px; color: ${T.ink2}; }
        .bs-jonli b { color: ${T.ink}; white-space: nowrap; }
        .bs-tugmalar { display: flex; flex-wrap: wrap; gap: 8px; }
        .bs-ikkisonim { display: flex; flex-direction: column; gap: 10px; }
        .bs-ikkisonim.ixcham { padding: 12px 14px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 6px 18px -10px rgba(${T.shadowBase},0.25); }
        .bs-is-h { display: flex; align-items: center; gap: 8px; font-size: 14px; color: ${T.ink}; }
        .bs-is-kim { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 13px; color: ${T.ink2}; padding-top: 8px; border-top: 1px solid ${T.line}; }
        .bs-is-kim b { color: ${T.ink}; }
        .bs-tahrir { flex: none; width: 26px; height: 26px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 13px; cursor: pointer; }
        .bs-tahrir:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .bs-tx-y { display: inline-block; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; border-radius: 6px; padding: 0 6px; background: ${T.bg}; }
        .bs-tx-y.yon { color: #fff; background: ${T.accent}; animation: bs-puls 2s ease-out .2s 2; }
        .bs-strip { display: inline-flex; align-self: flex-start; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; margin-bottom: 6px; }
        .bs-strip b { color: ${T.ink}; } .bs-strip span { font-weight: 800; color: ${T.ok}; }
        /* 9-ekran: juftlik varag'i */
        .bs-s8 { display: grid; grid-template-columns: minmax(0,1fr); gap: 16px; align-items: start; }
        .bs-s8.ikki { grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); }
        .bs-s8-chap { transition: transform 0.3s; } .bs-s8-chap.yon .bs-ikkisonim { animation: bs-yangi 1.2s ease-out both; }
        .bs-taymer { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; }
        .bs-yoriq { font-size: 13.5px; color: ${T.ink}; }
        .bs-tm-q { display: flex; align-items: center; gap: 12px; }
        .bs-tm-y { flex: 1; height: 10px; border-radius: 5px; background: ${fon(T.ink2, 0.15)}; overflow: hidden; } .bs-tm-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.25s linear; }
        .bs-tm-q b { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: ${T.ink}; } .bs-tm-q b.oshdi { color: ${T.ink2}; }
        .bs-varaq { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 8px 22px -12px rgba(${T.shadowBase},0.22); }
        .bs-vq { display: flex; flex-direction: column; gap: 7px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; border: 1.5px solid transparent; transition: background 0.3s, border-color 0.3s; }
        .bs-vq.ok { background: ${T.okFon}; } .bs-vq.x { border-color: ${T.err}; }
        .bs-vq.bosiladi { cursor: pointer; border-color: ${T.accent}; animation: bs-chorla 1.8s ease-out .4s 2; }
        .bs-vq-t { display: flex; align-items: flex-start; gap: 9px; }
        .bs-vq-n { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11.5px; font-weight: 800; background: ${T.paper}; color: ${T.ink2}; }
        .bs-vq-s { flex: 1; font-size: 14px; font-weight: 600; color: ${T.ink}; line-height: 1.4; }
        .bs-aniq-y { flex: none; font-size: 11px; font-weight: 800; color: ${T.ok}; background: ${T.paper}; border-radius: 6px; padding: 1px 7px; }
        .bs-vq-b { display: flex; gap: 8px; }
        .bs-belgi-b { min-width: 44px; justify-content: center; font-weight: 800; }
        .bs-belgi-b.on.ok { color: ${T.ok}; } .bs-belgi-b.on.x { color: ${T.err}; }
        .bs-tuzat { display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        /* 10-ekran: kod */
        .bs-darvoza { display: flex; flex-direction: column; gap: 9px; margin-bottom: 12px; }
        .bs-dv-kod, .bs-dv-ok code, .bs-dv code, .bs-dv-nat code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; white-space: nowrap; }
        .bs-dv-kod { display: block; white-space: pre; line-height: 1.5; padding: 8px 10px; border-radius: 8px; background: ${CODE.bg}; color: ${CODE.text}; overflow-x: auto; }
        .bs-dv-s { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        .bs-dv-ro { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .bs-dv code { background: transparent; }
        .bs-dv-nat { display: flex; gap: 10px; flex-wrap: wrap; font-size: 12px; color: ${T.ink2}; }
        .bs-dv-nat code { padding: 2px 8px; border-radius: 6px; background: ${T.bg}; transition: background 0.3s; } .bs-dv-nat code.yon { background: ${T.accent}; color: #fff; }
        .bs-dv-ok { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 10px; padding: 8px 10px; border-radius: 10px; background: ${T.okFon}; }
        .bs-dv-ok b { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ok}; }
        ol.bs-vazifa { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        ol.bs-vazifa.xira { opacity: 0.5; }
        ol.bs-vazifa li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        ol.bs-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.bg}; color: ${T.ink2}; }
        ol.bs-vazifa li.ok i { background: ${T.okFon}; color: ${T.ok}; }
        .bs-kyordam { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; align-items: flex-start; }
        .bs-baj { display: flex; flex-wrap: wrap; gap: 8px; }
        .bs-kodoyna { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .bs-dv-sahna { display: flex; flex-direction: column; gap: 10px; padding: 14px; border-radius: 16px; background: ${T.paper}; }
        .bs-mgap { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; color: ${T.ink}; }
        .bs-mgap img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex: none; }
        .bs-amal { display: flex; }
        pre.bs-kod { margin: 0; padding: 12px 14px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; overflow-x: auto; user-select: none; }
        ul.bs-natija { list-style: none; margin: 0; padding: 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; display: flex; flex-direction: column; gap: 6px; }
        ul.bs-natija li { font-size: 13.5px; font-weight: 600; color: ${T.ink}; padding: 7px 10px; border-radius: 8px; background: ${T.bg}; animation: fade-in-up 0.35s ease-out both; }
        ul.bs-natija li:nth-child(2) { animation-delay: .08s; } ul.bs-natija li:nth-child(3) { animation-delay: .16s; } ul.bs-natija li:nth-child(4) { animation-delay: .24s; } ul.bs-natija li:nth-child(5) { animation-delay: .32s; } ul.bs-natija li:nth-child(6) { animation-delay: .4s; }
        ul.bs-natija li.zarar { color: ${T.err}; } ul.bs-natija li.men { background: ${T.accentSoft}; }
        .bs-kod-sahna { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 14px; padding: 14px; border-radius: 16px; background: ${T.paper}; }
        /* 13-ekran: kartochkalar; 14-ekran: yakun */
        .bs-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: bs-puls 1.8s ease-out .4s 3; }
        p.bs-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.bs-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: bs-nuqta 2.4s ease-in-out 3; }
        .bs-ai-m { display: block; margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .bs-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .bs-hw { display: flex; flex-direction: column; gap: 12px; }
        .bs-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .bs-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .bs-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .bs-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.bs-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.bs-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        ol.bs-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .bs-hw-ost, .bs-hw-keyingi { display: block; font-size: 12.5px; color: ${T.ink2}; }
        .bs-yakun { display: contents; }
        .bs-ai { display: flex; flex-direction: column; } .bs-ai-btn { align-self: flex-start; }
        .bs-r { display: contents; } .bs-tablar { display: flex; flex-wrap: wrap; gap: 8px; }
        .bs-tqator.bs-chorla-t { padding: 2px 0; } .bs-vq-iz { padding-left: 31px; }
        .bs-yakka { font-size: 13px; } .bs-yangi-q { color: ${T.accent}; font-weight: 700; }
        .bs-mat-q b.pul, .bs-tv-q b.pul { color: ${T.ink}; } .bs-katta.yakuniy { gap: 14px; }
        .bs-yakun.belgisiz .done-chip .tick { display: none; }
        /* Navbatdagi harakat: bitta tugma — halqa (puls 3 marta, scale yo'q); variantlar — har birining o'z chegarasi, navbatma-navbat 2 marta (E 40) */
        .bs-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: bs-puls 2.2s ease-out .3s 3; }
        .bs-chorla > .bs-kanal.faol { border-color: ${fon(T.accent, 0.6)}; }
        .bs-chorla > .q-chip:not(:disabled), .bs-chorla > button.q-chip { border-color: ${fon(T.accent, 0.6)}; animation: bs-chorla 1.8s ease-out .4s 2; }
        .bs-chorla > :nth-child(2) { animation-delay: .65s; } .bs-chorla > :nth-child(3) { animation-delay: .9s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: bs-chorla 1.8s ease-out .5s 2; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat:not(:has(.q-chip.on)) .q-chip:nth-child(3) { animation-delay: 1s; }
        @keyframes bs-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes bs-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes bs-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes bs-halqa-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.28)}; } }
        @keyframes bs-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        /* ⛶ oynasi markazda (E 48): ikki klassli selektor; ota-blok animatsiyasi oynani siljitmasin */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(980px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.25s ease-out; }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 760px) {
          .bs-ikki, .bs-ikki.sol, .bs-ikki.toliq, .bs-s8.ikki, .bs-kod-sahna, .bs-ikki-nat { grid-template-columns: minmax(0,1fr); }
          .bs-ikki > .bs-telj { justify-self: start; }
          .bs-hw-karta { grid-template-columns: minmax(0,1fr); }
          .bs-kanal-qator, .bs-kanal-qator:has(> .q-chip) { grid-template-columns: minmax(0,1fr); }
          .bs-kanal-qator > .q-chip { justify-self: start; }
          .bs-k .bs-hook-o { padding-top: 36px; }
          .bs-hook-o, .bs-hook:not(.telli) .bs-hook-o { width: auto; flex: 1; }
          .bs-tor.oniki { grid-template-columns: repeat(6, 40px); }
        }
        @media (max-width: 420px) {
          .bs-hook.telli { gap: 10px; }
          .bs-hook .bs-kanal { padding: 7px 9px; }
          .bs-hook .bs-kanal-n, .bs-hook .bs-kanal-som { font-size: 12px; }
          .bs-tor { grid-template-columns: repeat(var(--ust, 11), 20px); gap: 2px 3px; } .bs-tor .bs-odam { width: 20px; height: 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bs-uch { display: none; }
          .bs-tor-k.kor, .bs-kanal, .bs-kanal.yon .bs-kanal-som, .bs-kanal.faol, .bs-tel-karta.yon, .bs-tel-btn.yon, .bs-ust-t i, .bs-muhr, .bs-tanga, .bs-tv-ch, .kir, .bs-k.kutish .q-variant, .bs-tugma.joriy, .bs-halqa, .bs-halqa-i, .bs-chorla > *, .q-bashorat .q-chip, .bs-vq.bosiladi, .bs-tx-y.yon, .bs-flash .fc-front, p.bs-fc-ipucha i, ul.bs-natija li, .bs-uq b.yangi, .bs-maydon-i.yozildi, .bs-tor-u { animation: none !important; }
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
