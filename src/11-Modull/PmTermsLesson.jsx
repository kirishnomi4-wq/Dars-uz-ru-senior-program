import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 7-dars «Foydalanuvchiga shartlarni qanday ochiq aytasiz?» — skeletdan qurildi (08.10.2026, B-to'lqin; 12 ekran, PM+PRAKT); MD: feedback/F-1007-13modul/07-PmTerms-v3.md
// Yangi dars shu fayldan boshlanadi (pilotdan emas): `cp src/skelet/NamunaDars.jsx src/<N>-Modull/<Nom>Lesson.jsx` (importlar o'zgarmaydi),
// keyin konveyer/2-QURUVCHI.md bo'yicha MD v3 (GATE M o'tgan) matni bilan to'ldiriladi.
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — TEGILMAYDI;
//   kontent — har qolip turidan bitta namuna: s0 QKirish · s1 QReja · s2 QTushuncha (bashorat → harakat → vizual → xulosa) ·
//   s3 test (QuestionScreen → QTest) · s4 final QTartib · a1 amaliyot bloki (QBlok + ScreenBlok ulagichi, 172/173) · podium · QKartochka · QYakun.
// ALMASHTIRILADI: LESSON_META · HW_TOKENS · SCREEN_META · INLINE_KEYS · RECAPS · ekranlar (s0…) · ACHIEVEMENTS/ACH_TRIGGERS ·
//   Q_LABELS (kalitlar = ballik ekran indekslari, q22) · QZ_BG_SHAPES ({uz,ru}, R-008) · QUIZ_BANK (12 savol, to'g'ri javob 3/3/3/3) ·
//   NAMUNA_FLASHCARDS (darsda 10–12) · SummaryScreen matnlari · screens massivi · export nomi · .nd- CSS bo'limi.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QXulosa, QXato, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QMustaqil, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m11d7-v1', lessonTitle: { uz: 'Foydalanuvchiga shartlarni qanday ochiq aytasiz?', ru: 'Как честно сказать пользователю об условиях?' } };
// 12 ekran (PM+PRAKT, tayanch 4): kirish → reja → tushuncha → 1-savol → tushuncha → mustaqil ish → Amaliyot 1 → Amaliyot 2 → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'oferta', ru: 'оферта' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'shart', ru: 'условие' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'havola', ru: 'ссылка' }, l: 24, tp: 70, s: 12, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);


function kamHarakat() { return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal, natijaSignal }) => {
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
  // SABOQ P11: yakun holati pastki panel ostida qolmasin — tugash signalida (desktopda ham) natijaga silliq surish
  useEffect(() => {
    if (!natijaSignal) return undefined;
    const t = setTimeout(() => { const el = contentRef.current; if (el && el.scrollHeight > el.clientHeight + 4) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 350);
    return () => clearTimeout(t);
  }, [natijaSignal]);
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
const INLINE_KEYS = { s3: 1, s8: 2, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI); PM darsida emoji o'rniga raqam (S-026)
const RECAPS = {
  3: {
    title: { uz: 'Ofertaga nima yoziladi', ru: 'Что пишут в оферте' },
    ask: { uz: "To'lov taklifi ekraningiz qaysi savolga javob bermaydi?", ru: 'На какой вопрос не отвечает ваш экран предложения оплаты?' },
    cards: [
      { ic: '1', h: { uz: 'Oferta', ru: 'Оферта' }, body: { uz: <>Oferta — hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan.</>, ru: <>Оферта — открытое для всех предложение: что даётся, сколько стоит, на каких условиях.</> } },
      { ic: '2', h: { uz: "Rozi bo'ladi", ru: 'Соглашается' }, body: { uz: <>Odam to'lasa — shu shartlarga rozi bo'ladi.</>, ru: <>Если человек платит — он соглашается с этими условиями.</> } },
      { ic: '3', h: { uz: "To'lashdan oldin", ru: 'До оплаты' }, body: { uz: <>Shuning uchun to'lovchi to'lashdan oldin so'raydigan narsa ofertada yoziladi.</>, ru: <>Поэтому то, о чём плательщик спрашивает до оплаты, пишут в оферте.</> } }
    ]
  },
  8: {
    title: { uz: '«[savol]» qolsa', ru: 'Если остался «[savol]»' },
    ask: { uz: "«[savol]» ni shundayligicha qoldirsangiz, to'lovchi nimani bilmay qoladi?", ru: 'Если оставить «[savol]» как есть, чего не узнает плательщик?' },
    cards: [
      { ic: '1', h: { uz: 'Agent bilmagan joy', ru: 'Место, которого не знает агент' }, body: { uz: <>Agent koddan bilmagan joyni «[savol]» qoldiradi.</>, ru: <>То, чего агент не узнал из кода, он оставляет «[savol]».</> } },
      { ic: '2', h: { uz: "O'zingiz yozasiz", ru: 'Пишете сами' }, body: { uz: <>Mahsulot nima qilishini kodda va ilovada ko'rib — o'zingiz yozasiz.</>, ru: <>Посмотрев в коде и приложении, что делает продукт, — пишете сами.</> } },
      { ic: '3', h: { uz: "Va'da emas", ru: 'Не обещание' }, body: { uz: <>Kodda yo'q narsa sahifaga yozilmaydi — va'da emas.</>, ru: <>Того, чего нет в коде, на странице не пишут — это не обещание.</> } }
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
        {rc.ask && i === rc.cards.length - 1 && <div className="rc-ask"><b>{tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })}</b> {tr(rc.ask)}</div>}
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
            {vizual && (isMentorLive ? mReveal : (solved && !waiting)) && <div className="st-q-viz fade-step">{vizual}</div>}
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

// ===== DARSNING O'Z VIZUALI — «To'lov taklifi ekrani va shartlar sahifasi» (ShartlarSahna, 163/180): bitta manba MENTOR_EKRAN + MENTOR_OFERTA + MENTOR_TOLOV_BANDI; o'quvchi ma'lumoti — pm-m11d4-narx, pm-m11d7-hujjat =====
// qolip-maket: st-havola st-bor st-yoq st-bugun st-real st-tahrir st-ed st-ochildi st-yordam-btn
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const NB = String.fromCharCode(160);
const nbs = (s) => (typeof s === 'string' ? s.replace(/(\d) (?=\d{3}(?!\d))/g, '$1' + NB).replace(/ \/ /g, NB + '/' + NB) : s);
const tn = (o) => nbs(tr(o));
const sonFmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB);
const probel = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const halqa = (on) => (on ? 'st-halqa' : undefined);
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq — natija ekranda qoladi */ } };
const son = (v) => { const s = String(v ?? '').replace(/[\s.,]/g, ''); return /^\d+$/.test(s) ? Number(s) : null; };
// Saqlash kalitlari (tayanch 8): o'qiydi — 4, 2-darslar, trek, lending · yozadi — pm-m11d7-hujjat (11-dars o'qiydi)
const HUJJAT_KEY = 'pm-m11d7-hujjat';
const NARX_KEY = 'pm-m11d4-narx';
const MODEL_KEY = 'pm-m11d2-model';
const TREK_KEY = 'pm-m9d8-platforma';
const LENDING_KEY = 'pm-m10d1-lending';
const BOSHQA_MODEL = ['reklama', 'b2b', 'tranzaksiya'];
const modelOl = () => lsO(MODEL_KEY) || {};
const trekOl = () => { const o = lsO(TREK_KEY); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const hujjatOl = () => { const h = lsO(HUJJAT_KEY); return h && Array.isArray(h.bandlar) && h.bandlar.length === 6 ? h : null; };
const hujjatYoz = (p) => {
  const eski = lsO(HUJJAT_KEY) || {};
  const bandlar = (p.bandlar || eski.bandlar || []).map(b => ({ id: b.id, matn: String(b.matn || ''), savol: String(b.matn || '').includes('[savol]') }));
  lsY(HUJJAT_KEY, {
    bandlar,
    siyosatBand: p.siyosatBand !== undefined ? p.siyosatBand : (eski.siyosatBand ?? null),
    havolalar: { lending: null, ekran: null, ...(eski.havolalar || {}), ...(p.havolalar || {}) },
    chiqdi: p.chiqdi !== undefined ? p.chiqdi : (eski.chiqdi ?? null),
    savedAt: Date.now()
  });
};
const MAYDON_RANG = '#2E9E4F';
const MJ = () => <b className="st-mj">Maydon Jamoa</b>;
const TAXMIN_Y = { uz: 'Mentorning taxmini', ru: 'Предположение Ментора' };
const TEST_REJIM = { uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' };
const OFERTA_MANZIL = 'maydon-jamoa-….netlify.app/oferta.html';
const SIYOSAT_MANZIL = 'maydon-jamoa-….netlify.app/maxfiylik.html';
// To'lov taklifi ekrani (tayanch 1.4 so'zma-so'z)
const MENTOR_EKRAN = {
  sarlavha: { uz: "Doimiy o'yin — Pro'da", ru: 'Постоянная игра — в Pro' },
  matn: { uz: "Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.", ru: 'Каждую неделю в тот же день и час игра объявляется сама.' },
  narx: { uz: "30 kun — 15 000 so'm", ru: '30 дней — 15 000 сумов' },
  tugma: { uz: "To'lovga o'tish", ru: 'Перейти к оплате' },
  havolalar: [{ uz: 'Pro shartlari', ru: 'Условия Pro' }, { uz: 'Maxfiylik siyosati', ru: 'Политика конфиденциальности' }]
};
// Mentor ofertasi (tayanch 1.7 so'zma-so'z): kalit — bugun yoziladi yoki real ishga tushirishda
const MENTOR_OFERTA = {
  tepa: { uz: "Mashq hujjati — real to'lov qabul qilinmaydi", ru: 'Учебный документ — реальная оплата не принимается' },
  sarlavha: { uz: 'Pro shartlari', ru: 'Условия Pro' },
  oxiri: { uz: 'Bu hujjat yuridik maslahat emas.', ru: 'Этот документ — не юридическая консультация.' },
  bandlar: [
    { id: 'kim', nom: { uz: 'Kim taklif qiladi', ru: 'Кто предлагает' }, matn: { uz: '[real ishga tushirishda — yuridik shaxs yoki YaTT]', ru: '[при реальном запуске — юрлицо или ИП]' }, kalit: 'real', savol: { uz: 'Kim bilan kelishyapman?', ru: 'С кем я договариваюсь?' } },
    { id: 'nima', nom: { uz: 'Nima beriladi', ru: 'Что даётся' }, matn: { uz: "«Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi", ru: '«Постоянная игра»: каждую неделю в тот же день и час игра объявляется сама' }, kalit: 'bugun', savol: { uz: 'Pulimga nima olaman?', ru: 'Что я получу за деньги?' } },
    { id: 'narx', nom: { uz: 'Narx va muddat', ru: 'Цена и срок' }, matn: { uz: "30 kun, 15 000 so'm; muddat tugagach Pro o'zi to'xtaydi, pul avtomatik yechilmaydi", ru: '30 дней, 15 000 сумов; по окончании срока Pro сам выключается, деньги автоматически не списываются' }, kalit: 'bugun', taxmin: true, savol: { uz: 'Qancha va necha kunga?', ru: 'Сколько и на сколько дней?' } },
    { id: 'tugasa', nom: { uz: 'Pro tugasa', ru: 'Если Pro закончится' }, matn: { uz: "e'lon qilingan o'yinlar qoladi, yangi o'yin o'zi e'lon qilinmaydi", ru: 'объявленные игры остаются, новая игра сама не объявляется' }, kalit: 'bugun', savol: { uz: "30 kun tugasa, nima bo'ladi?", ru: 'Что будет, когда 30 дней закончатся?' } },
    { id: 'qaytarish', nom: { uz: 'Bekor qilish va pulni qaytarish', ru: 'Отмена и возврат денег' }, matn: { uz: '[real ishga tushirishda yoziladi; mashqda pul yechilmaydi]', ru: '[пишется при реальном запуске; в упражнении деньги не списываются]' }, kalit: 'real', savol: { uz: 'Bekor qilsam, pulim qaytadimi?', ru: 'Если отменю, деньги вернутся?' } },
    { id: 'aloqa', nom: { uz: 'Aloqa', ru: 'Контакты' }, matn: { uz: '[real ishga tushirishda]', ru: '[при реальном запуске]' }, kalit: 'real', savol: { uz: "Savol bo'lsa, kimga yozaman?", ru: 'Если будет вопрос, кому писать?' } }
  ]
};
const BAND_ID = MENTOR_OFERTA.bandlar.map(b => b.id);
// Siyosatga to'lov bandi (tayanch 1.7, 9.29 so'zma-so'z) — ikki bo'lak
const MENTOR_TOLOV_BANDI = {
  qaysi: { uz: "Karta ma'lumoti so'ralmaydi — to'lov test rejimda; Maydon Jamoa kartani ko'rmaydi va saqlamaydi. Biz saqlaymiz: to'lov raqami, kim to'lagani (hisob), holati (to'landi yoki rad etildi), summa, sana va Pro muddati.", ru: 'Данные карты не запрашиваются — оплата в тестовом режиме; Maydon Jamoa не видит и не хранит карту. Мы храним: номер платежа, кто заплатил (аккаунт), статус (оплачен или отклонён), сумму, дату и срок Pro.' },
  nimaUchun: { uz: "To'lov raqami, hisob, holat va summa — to'lovni bir marta hisoblash va «to'lovim qayerda?» savoliga javob berish uchun. Pro muddati — Pro'ni yoqish va to'xtatish uchun.", ru: 'Номер платежа, аккаунт, статус и сумма — чтобы учесть платёж один раз и ответить на вопрос «где мой платёж?». Срок Pro — чтобы включать и выключать Pro.' }
};
// Mentor siyosatining qolgan matni (12-Modul, o'zgarmaydi) — 7-ekran kutilgan natijasi
const MENTOR_SIYOSAT = [
  { s: { uz: 'Qaysi ma\'lumot?', ru: 'Какие данные?' }, eski: { uz: "Ro'yxatdan o'tishda — ism, login va parol; parolning o'zi saqlanmaydi, o'rnida undan yasalgan satr (hash) turadi. Telefon raqami so'ralmaydi. Ilovada qadamlar sanaladi — ism va loginsiz, qurilma ID bilan. Ilova eslatmadan ochilgani ham qurilma ID bilan sanaladi. Lendingda Umami tashrif va tugma bosilishini sanaydi — unga ism va login yuborilmaydi.", ru: 'При регистрации — имя, логин и пароль; сам пароль не хранится, вместо него — строка, сделанная из него (hash). Номер телефона не запрашивается. В приложении считаются шаги — без имени и логина, по ID устройства. Открытие приложения из напоминания тоже считается по ID устройства. На лендинге Umami считает визиты и нажатия кнопки — имя и логин ему не передаются.' }, yangi: MENTOR_TOLOV_BANDI.qaysi },
  { s: { uz: 'Nima uchun?', ru: 'Зачем?' }, eski: { uz: "Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun.", ru: 'Имя — чтобы игроки в игре узнавали друг друга. Логин и пароль — для входа в аккаунт. Подсчёт шагов — чтобы понять, какое место приложения непонятно.' }, yangi: MENTOR_TOLOV_BANDI.nimaUchun },
  { s: { uz: "Kim ko'radi?", ru: 'Кто видит?' }, eski: { uz: "Ism — shu o'yindagi o'yinchilar. Loginni boshqa o'yinchilar ko'rmaydi. Database'ni faqat ilova egasi ko'radi.", ru: 'Имя — игроки этой игры. Логин другие игроки не видят. Database видит только владелец приложения.' } },
  { s: { uz: 'Qancha saqlanadi?', ru: 'Сколько хранится?' }, eski: { uz: "Hisob — o'zingiz o'chirguningizcha: ilovada «Hisobni o'chirish» bor. Qadamlar yozuvi — 60 kun.", ru: 'Аккаунт — пока вы сами его не удалите: в приложении есть «Удалить аккаунт». Запись шагов — 60 дней.' } }
];
const HALOL_GAP = { uz: "Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs (ro'yxatdan o'tgan tashkilot) yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas.", ru: 'Реальный запуск — с письменным согласием родителей и юрлицом (зарегистрированной организацией) или ИП (индивидуальным предпринимателем); не в этом курсе.' };
// 2-ekran: tashkilotchining olti savoli — javobi to'lov taklifi ekranida bormi (qator — ekrandagi mos qator)
const TOLOVCHI_SAVOLLARI = [
  { matn: MENTOR_OFERTA.bandlar[1].savol, ekrandaBor: true, qator: 'matn' },
  { matn: MENTOR_OFERTA.bandlar[2].savol, ekrandaBor: true, qator: 'narx' },
  { matn: { uz: 'Keyingi oy pul o\'zi yechiladimi?', ru: 'В следующем месяце деньги спишутся сами?' }, ekrandaBor: false },
  { matn: MENTOR_OFERTA.bandlar[3].savol, ekrandaBor: false },
  { matn: MENTOR_OFERTA.bandlar[4].savol, ekrandaBor: false },
  { matn: MENTOR_OFERTA.bandlar[0].savol, ekrandaBor: false }
];
// Matnni bo'laklarga ajratadi: «[savol]» — accent uzuq ramka, boshqa kvadrat qavsli matn — kulrang kursiv (U-041)
const BandMatn = ({ matn, dum }) => {
  const s = String(matn || '');
  const qism = s.split(/(\[[^\]]*\])/g).filter(Boolean);
  return <>{qism.map((p, i) => (p === '[savol]' ? <span key={i} className="st-savol">[savol]</span> : /^\[.*\]$/.test(p) ? <em key={i} className="st-kv">{p}</em> : <React.Fragment key={i}>{nbs(p)}</React.Fragment>))}{dum && <span className="st-dum">{dum}</span>}</>;
};
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (MD «O'qituvchi eslatmasi»; o'quvchida ko'rinmaydi)
const Ustoz = ({ satrlar }) => {
  const { isMentor } = useJonli();
  if (!isMentor) return null;
  return <div className="st-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{tx(q)}</span>)}</div>;
};
// --- Telefon (≈170×272, o'lchami barqaror; yorliq ramka ustida) ---
const Tel = ({ yorliq, children, ekranKey, className }) => (
  <div className={cx('st-telj', className)}>
    {yorliq && <span className="st-tel-yorliq">{yorliq}</span>}
    <div className="st-tel"><div key={ekranKey} className="st-tel-ekran">{children}</div></div>
  </div>
);
// To'lov taklifi ekrani: sarlavha · matn · narx · tugma · (7-darsdan) ikki havola · pastda o'zgarmas «Test rejim». Karta maydoni hech qachon chizilmaydi.
const TaklifEkran = ({ sarlavha, matn, narx, tugma, taxmin, yonadi = [], havolalar, faolHavola, onHavola, havolaHalqa }) => (
  <div className="st-taklif">
    <span className="st-app-bar"><i className="st-orqaga" aria-hidden="true">‹</i><MJ /></span>
    <div className="st-taklif-t">
      <b className="st-tk-sar">{sarlavha}</b>
      {matn && <span className={cx('st-tk-matn', yonadi.includes('matn') && 'yon')}>{matn}</span>}
      <span className={cx('st-tk-narx', yonadi.includes('narx') && 'yon')}>{narx}</span>
      {taxmin && <span className="st-tk-tax">{tr(TAXMIN_Y)}</span>}
      <span className="st-tk-btn">{tugma}</span>
      {havolalar && <span className="st-tk-hav">{havolalar.map((h, i) => (onHavola && i === 0
        ? <button key={i} type="button" className={cx('st-havola', faolHavola === i && 'on', halqa(havolaHalqa))} onClick={onHavola}>{h}</button>
        : <span key={i} className={cx('st-havola', faolHavola === i && 'on')}>{h}</span>))}</span>}
      <span className="st-tk-test">{tr(TEST_REJIM)}</span>
    </div>
  </div>
);
const MentorTaklif = (p) => <TaklifEkran sarlavha={tr(MENTOR_EKRAN.sarlavha)} matn={tr(MENTOR_EKRAN.matn)} narx={tn(MENTOR_EKRAN.narx)} tugma={tr(MENTOR_EKRAN.tugma)} taxmin {...p} />;
// Brauzer oynasi: manzil satri + sahifa
const Brauzer = ({ manzil, children, className }) => (
  <div className={cx('st-br', className)}>
    <div className="st-br-bar"><i aria-hidden="true" /><code>{manzil}</code></div>
    <div className="st-br-sahifa">{children}</div>
  </div>
);
// Shartlar sahifasi: tepa qatori · sarlavha · olti band · oxirgi qator. band: { nom, matn, holat: 'bosh' | 'bor', yangi, dum }
const OfertaSahifa = ({ sarlavha, bandlar, tepa, oxiri, refs = {}, ikki }) => (
  <div className="st-of">
    {tepa && <span className="st-of-tepa fade-step">{tr(MENTOR_OFERTA.tepa)}</span>}
    <b className="st-of-sar">{sarlavha}</b>
    <ol className={cx('st-of-b', ikki && 'ikki')}>
      {bandlar.map((b, i) => (
        <li key={i} className={cx('st-of-r', b.yangi && 'yangi')}>
          <span className="st-of-nom">{i + 1} · {b.nom}</span>
          {b.holat === 'bosh' ? <span ref={refs[i]} className="st-of-bosh" /> : b.holat === 'yoq' ? null : <span ref={refs[i]} className="st-of-m"><BandMatn matn={b.matn} dum={b.dum} />{b.taxmin && <em className="st-of-tax">{tr(TAXMIN_Y)}</em>}</span>}
        </li>
      ))}
    </ol>
    {oxiri && <span className="st-of-oxiri fade-step">{tr(MENTOR_OFERTA.oxiri)}</span>}
  </div>
);
const mentorBandlar = (holat = 'bor') => MENTOR_OFERTA.bandlar.map(b => ({ nom: tr(b.nom), matn: tr(b.matn), holat, taxmin: b.taxmin }));
// Varaq «Shartlar» (2-ekran) / «Ofertam» (5-ekran): qator — { id, matn, kul, yangi, tahrir, dum }
const Varaq = ({ sarlavha, hisob, qatorlar, onTahrir, refEl, className, children }) => (
  <div className={cx('st-varaq', className)} ref={refEl}>
    <span className="st-v-sar"><b>{sarlavha}</b>{hisob && <em key={hisob} className="st-v-hisob">{hisob}</em>}</span>
    {qatorlar.map(q => (
      <div key={q.id} className={cx('st-v-r', q.kul && 'kul', q.yangi && 'yangi', q.ok && 'ok', q.yon && 'yon')}>
        {q.nom && <span className="st-v-nom">{q.nom}</span>}
        <span className="st-v-q">{q.matn ? <BandMatn matn={q.matn} dum={q.dum} /> : <span className="st-v-bosh" />}{q.izoh && <em className="st-v-iz">{q.izoh}</em>}</span>
        {onTahrir && q.tahrir != null && <button type="button" className="st-tahrir" onClick={() => onTahrir(q.tahrir)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
      </div>
    ))}
    {children}
  </div>
);
// Tashkilotchi — rol yorlig'i + pufak (odam chizilmaydi — SABOQ P1)
const Pufak = ({ matn, ost, className }) => (
  <div className={cx('st-pufak', className)}>
    <span className="st-pufak-rol">{tr({ uz: 'tashkilotchi', ru: 'организатор' })}</span>
    <span className="st-pufak-m">{matn}</span>
    {ost && <span className="st-pufak-ost">{ost}</span>}
  </div>
);
// Chiziq: telefondagi havoladan brauzer sahifasiga — nuqta yuguradi
const Chiziq = ({ yur, className }) => <div className={cx('st-chiziq', className)} aria-hidden="true"><i className={cx('st-nuqta', yur && 'yur')} /></div>;
// Matn kartadan varaq qatoriga uchadi (SABOQ 19); harakatsiz rejimda — yo'q
const uchir = (fromEl, toEl, matn) => {
  if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  const s = document.createElement('span');
  s.className = 'st-uchar'; s.textContent = matn;
  s.style.left = a.left + 'px'; s.style.top = a.top + 'px';
  document.body.appendChild(s);
  if (!s.animate) { s.remove(); return; }
  const an = s.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px)', opacity: 0.85 }], { duration: 650, easing: 'cubic-bezier(.3,.7,.3,1)' });
  an.onfinish = () => s.remove();
};
// uchuvchi yorliq: band matnining birinchi so'zlari (<= 28 belgi)
const boshSozlar = (m, max = 28) => {
  const t = String(m || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const kes = t.slice(0, max - 1);
  const j = kes.lastIndexOf(' ');
  return (j > 8 ? kes.slice(0, j) : kes).replace(/[\s,;:—-]+$/, '') + '…';
};
const Katak = ({ n, jami = 6 }) => <span className="st-katak" aria-hidden="true">{Array.from({ length: jami }, (_, i) => <i key={i} className={cx(i < n && 'on', i === n && 'joriy')} />)}</span>;
const BASH_Y = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="st-bash fade-up"><QBashorat yorliq={tr(BASH_Y)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v, t: v }))} tanlov={null} onTanla={onTanla} /></div>
  : <p className="st-bash-ix fade-step"><span>{tr({ uz: 'Taxminingiz:', ru: 'Ваше предположение:' })}</span> <b>{tanlov}</b></p>);
// Yashil xulosa qutisi (E 42): birinchi kichik qator — taxmin natijasi, keyin xulosa, oxirida QIzoh
const XulosaQ = ({ togri, natija, matn, izoh }) => <>{natija && <span className={cx('st-x-n', togri && 'ok')}>{natija}</span>}<span className="st-x-m">{matn}</span>{izoh && <span className="st-x-iz">{izoh}</span>}</>;
const taxminQator = (tanlov, aslida) => (String(tanlov) === String(aslida)
  ? tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение подтвердилось ✓' })
  : tr({ uz: 'Taxminingiz ✕ — aslida: ', ru: 'Ваше предположение ✕ — на деле: ' }) + aslida);
// Ipucha — 40 s harakatsizlikda (javobni aytmaydi)
const useIpucha = (faol, kalit) => {
  const [chiq, setChiq] = useState(false);
  useEffect(() => { setChiq(false); if (!faol) return undefined; const t = setTimeout(() => setChiq(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return chiq;
};
const USTOZ = {
  s0: [{ uz: "Sinfdan so'rang: «Telefoningizda biror narsa uchun to'lashdan oldin nimaga qaraysiz?» Javoblarni taxtaga yozing — ular keyin ofertaning bandlariga o'xshab chiqadi. Javoblarni hozir baholamang.", ru: 'Спросите класс: «На что вы смотрите в телефоне, прежде чем за что-то заплатить?» Запишите ответы на доске — потом они окажутся похожи на пункты оферты. Сейчас ответы не оценивайте.' }],
  s1: [{ uz: "Menyu ostidagi «saytda» — dars natijasi: oferta va siyosat lending sahifalari bo'lib internetda turadi. Darsda hech kim pul olmaydi va hech narsa sotmaydi; oferta — mashq hujjati. Sotuvchi, pulni qaytarish va aloqa — real ishga tushirishda (bu kursda emas).", ru: '«На сайте» под названием в меню — результат урока: оферта и политика будут страницами лендинга в интернете. На уроке никто не берёт денег и ничего не продаёт; оферта — учебный документ. Продавец, возврат денег и контакты — при реальном запуске (не в этом курсе).' }],
  s2: [
    { uz: "To'lov taklifi ekrani qisqa: asosiy qulaylik va narx. Qolgan shartlar alohida sahifada yoziladi — to'lovchi uni to'lashdan oldin ochishi kerak. 3-savolda «Test rejim» qatori bugungi mashq haqida: bu kursda pul umuman yechilmaydi; keyingi oy uchun pul yechilish-yechilmasligi — ofertaning shartlaridan biri.", ru: 'Экран предложения оплаты короткий: главная функция и цена. Остальные условия пишут на отдельной странице — плательщик должен открыть её до оплаты. В 3-м вопросе строка «Тестовый режим» — о сегодняшнем упражнении: в этом курсе деньги вообще не списываются; спишутся ли деньги в следующем месяце — одно из условий оферты.' },
    { uz: 'Qonunda bunday taklif ommaviy oferta deb ataladi (369-modda); dars yuridik maslahat bermaydi.', ru: 'В законе такое предложение называется публичной офертой (статья 369); урок не даёт юридических консультаций.' }
  ],
  s4: [
    { uz: "Sotuvchi qatori bo'sh: o'smir real to'lovni o'z nomidan qabul qilmaydi — qonunda (27-modda) 14–18 yoshli bitimni ota-onaning yozma roziligi bilan tuzadi; real sotuvchi — yuridik shaxs (ro'yxatdan o'tgan tashkilot) yoki YaTT. Bu kursda real ishga tushirish yo'q.", ru: 'Строка продавца пустая: подросток не принимает реальную оплату от своего имени — по закону (статья 27) в 14–18 лет сделку заключают с письменного согласия родителей; реальный продавец — юрлицо (зарегистрированная организация) или ИП. В этом курсе реального запуска нет.' },
    { uz: "Aloqa — sotuvchining rasmiy aloqasi: o'quvchining telefoni va Telegram nomi ochiq sahifaga yozilmaydi. 3-banddagi «pul avtomatik yechilmaydi» — Mentor ilovasida Pro muddati tugagach o'zi to'xtaydi (5-dars), keyingi 30 kun uchun pul so'ralmaydi.", ru: 'Контакты — официальные контакты продавца: телефон и имя в Telegram ученика на открытую страницу не пишутся. «Деньги автоматически не списываются» в 3-м пункте — в приложении Ментора Pro сам выключается после срока (5-й урок), за следующие 30 дней деньги не запрашиваются.' },
    { uz: "Mentor sahifasi — kurs shabloni: o'quvchi mahsulotida band nomi va matni boshqacha bo'ladi.", ru: 'Страница Ментора — шаблон курса: в продукте ученика названия и тексты пунктов будут другими.' }
  ],
  s5: [
    { uz: "8 daqiqa. Narxni siz qo'ymaysiz — o'quvchining taxmini. «Hali bilmayman» — halol tanlov: agent kodni ko'rsatadi, gapni o'quvchi yozadi. Sotuvchi, pulni qaytarish va aloqa bandlarini o'quvchi o'zgartirmaydi — mashqda ular kvadrat qavsda qoladi.", ru: '8 минут. Цену ставите не вы — это предположение ученика. «Пока не знаю» — честный выбор: агент покажет код, фразу напишет ученик. Пункты о продавце, возврате денег и контактах ученик не меняет — в упражнении они остаются в квадратных скобках.' },
    { uz: "Eng ko'p xato — 2-bandga «tez orada» qo'shiladigan narsani yozish: «Bugun ilovangizda bu bormi?» deb so'rang.", ru: 'Самая частая ошибка — писать во 2-й пункт то, что добавят «скоро»: спросите «Это сегодня есть в вашем приложении?».' }
  ],
  s6: [
    { uz: "Agent shablonni va bandlarni yozadi, koddan bilinmaganini «[savol]» qoldiradi — gapni o'quvchi yozadi (12-Moduldagi siyosat naqshi). Kodda yo'q narsa ofertaga yozilmaydi: va'da yo'q.", ru: 'Агент пишет шаблон и пункты, то, что не видно из кода, оставляет «[savol]» — фразу пишет ученик (как с политикой в 12-м модуле). Того, чего нет в коде, в оферте нет: никаких обещаний.' },
    { uz: "Mentor misolidagi 4-band: «e'lon qilingan o'yinlar qoladi» — 5-darsda tekshirilgan; «yangi o'yin o'zi e'lon qilinmaydi» — Mentor ilovada tekshiradi. O'quvchi ham faqat mahsulotda ko'rgan gapini qoldiradi.", ru: '4-й пункт в примере Ментора: «объявленные игры остаются» — проверено на 5-м уроке; «новая игра сама не объявляется» — Ментор проверяет в приложении. Ученик тоже оставляет только то, что видел в продукте.' }
  ],
  s7: [
    { uz: "Siyosatning to'rt savoli 10 va 12-Moduldagidek qoladi — faqat to'lov bandi qo'shiladi. Karta ma'lumoti mahsulotga kirmaydi: mashq to'lov karta so'ramaydi (haqiqiy xizmatda kartani to'lov xizmati qabul qiladi — bu siyosatga yozilmaydi: siyosat bugungi holatni aytadi).", ru: 'Четыре вопроса политики остаются как в 10-м и 12-м модулях — добавляется только пункт об оплате. Данные карты в продукт не попадают: учебная оплата карту не запрашивает (в настоящем сервисе карту принимает платёжный сервис — в политику это не пишется: политика говорит о сегодняшнем положении).' },
    { uz: "Pro'siz hisob uchun yangi akkaunt ochilmaydi: o'quvchi o'z hisobida Pro'ni Neon'da bo'sh qiladi (5-darsdagidek); `UPDATE` bitta qatorga tegishi kerak (Neon «1 row affected»). Havola to'lovdan oldin ko'rinishi kerak — shuning uchun to'lov taklifi ekranining o'zida. O'rnatish fayli bu darsda qayta tayyorlanmaydi.", ru: 'Для аккаунта без Pro новый аккаунт не открывают: ученик очищает Pro в своём аккаунте в Neon (как на 5-м уроке); `UPDATE` должен затронуть одну строку (Neon «1 row affected»). Ссылка должна быть видна до оплаты — поэтому она на самом экране предложения оплаты. Установочный файл на этом уроке заново не собирается.' }
  ]
};
// Jonli dars: sinf ovozlari chizig'i — faqat variantlar soni, ism yo'q (MD KOD 10)
const OvozChizigi = ({ live, screen, variantlar }) => {
  const [sanoq, setSanoq] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const rows = await liveAnswers(pin, screen); if (on) setSanoq(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!sanoq) return null;
  const jami = sanoq.reduce((a, b) => a + b, 0);
  return (
    <div className="st-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className="st-ovoz-q"><span>{v}</span><span className="st-ovoz-y"><i style={{ width: `${jami ? Math.round((sanoq[i] / jami) * 100) : 0}%` }} /></span><b>{sanoq[i]}</b></div>)}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026, ballsiz; uchala variantga bitta javob) =====
const HOOK_OPTS = [
  { id: 'tugasa', t: { uz: "30 kun tugasa, nima bo'ladi?", ru: 'Что будет, когда 30 дней закончатся?' } },
  { id: 'yechish', t: { uz: "Keyingi oy pul o'zi yechiladimi?", ru: 'В следующем месяце деньги спишутся сами?' } },
  { id: 'qaytarish', t: { uz: 'Bekor qilsam, pulim qaytadimi?', ru: 'Если отменю, деньги вернутся?' } }
];
const HOOK_JAVOB = { uz: "Uchalasi ham — to'lashdan oldin bilish kerak bo'lgan narsa. Odam ularning javobini qayerdan topadi?", ru: 'Все три — то, что нужно знать до оплаты. Где человек найдёт ответы на них?' };
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const mount = useRef(Date.now());
  const pick = (v) => {
    if (picked !== null || isMentor) return;
    setPicked(v); setSc(c => c + 1);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    const i = HOOK_OPTS.findIndex(o => o.id === v);
    if (isStudent && live.submitAnswer) live.submitAnswer(screen, 's0', i, false, Date.now() - mount.current);
  };
  const tanlangan = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('st-k', picked === null && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>To'lashdan oldin <span className="italic" style={{ color: T.accent }}>nimani bilishni</span> xohlaysiz?</>, ru: <>Что вы хотите <span className="italic" style={{ color: T.accent }}>знать до оплаты?</span></> })}
          mentor={<Mentor>{tr({ uz: "Tasavvur qiling: siz mahallada o'yin yig'adigan tashkilotchisiz va «Maydon Jamoa» sizga shu taklifni ko'rsatdi. Bittasini tanlang.", ru: 'Представьте: вы организатор, который собирает игры в махалле, и «Maydon Jamoa» показал вам это предложение. Выберите один вариант.' })}</Mentor>}
          maket={<div className="st-s0-m">
            <Tel yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>}><MentorTaklif /></Tel>
            <Pufak className={cx(tanlangan && 'tanlandi')} matn={tanlangan ? tr(tanlangan.t) : '…'} ost={tanlangan ? '?' : null} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB)}</p>}
        >
          {live && (isMentor || picked !== null) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} />}
          <Ustoz satrlar={USTOZ.s0} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; chap — natija, vizual bir marta o'zi yuradi) =====
const REJA = [
  { t: { uz: "To'lovchi nimaga rozi bo'lishini bilasiz", ru: 'Узнаете, на что соглашается плательщик' }, teg: { uz: 'oferta', ru: 'оферта' } },
  { t: { uz: 'Qaysi shart bugun yozilishini ajratasiz', ru: 'Отделите, какое условие пишется сегодня' }, teg: { uz: 'real ishga tushirish', ru: 'реальный запуск' } },
  { t: { uz: "O'z shartlaringizni sahifaga yozasiz", ru: 'Запишете свои условия на страницу' }, teg: { uz: 'oferta.html', ru: 'oferta.html' } },
  { t: { uz: "Siyosatga to'lov haqida gap qo'shib, havola qo'yasiz", ru: 'Добавите в политику фразу об оплате и поставите ссылку' }, teg: { uz: 'maxfiylik siyosati', ru: 'политика конфиденциальности' } }
];
const RejaSahna = () => {
  const [k, setK] = useState(() => (kamHarakat() ? 3 : 0));
  useEffect(() => { if (k >= 3) return undefined; const t = setTimeout(() => setK(n => n + 1), k === 0 ? 700 : 1100); return () => clearTimeout(t); }, [k]);
  return (
    <div className="st-reja">
      <Tel yorliq={<MJ />}><MentorTaklif havolalar={MENTOR_EKRAN.havolalar.map(tr)} faolHavola={k >= 1 ? 0 : null} /></Tel>
      <Chiziq yur={k === 2} />
      <Brauzer manzil={OFERTA_MANZIL} className={cx('st-reja-br', k >= 3 ? 'ochiq' : 'yopiq')}>
        <OfertaSahifa tepa sarlavha={tr(MENTOR_OFERTA.sarlavha)} bandlar={MENTOR_OFERTA.bandlar.map(b => ({ nom: tr(b.nom), holat: 'yoq' }))} />
      </Brauzer>
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun to'lov shartlarini <span className="italic" style={{ color: T.accent }}>ochiq yozishni</span> o'rganasiz.</>, ru: <>Сегодня научитесь <span className="italic" style={{ color: T.accent }}>открыто писать</span> условия оплаты.</> })}
      mentor={<Mentor>{tr({ uz: "Narx va to'lov yo'li tayyor — endi to'lovchi nimaga rozi bo'lishini yozamiz. Mentor misoli — namuna, ikkala amaliyot — o'z repo'ngizda.", ru: 'Цена и путь оплаты готовы — теперь напишем, на что соглашается плательщик. Пример Ментора — образец, обе практики — в вашем репозитории.' })}</Mentor>}
      chapYorliq={<>{tr({ uz: 'oferta va maxfiylik siyosati saytda', ru: 'оферта и политика конфиденциальности на сайте' })} <span className="st-sub">{tr({ uz: "Darsda — mashq hujjati: real to'lov qabul qilinmaydi.", ru: 'На уроке — учебный документ: реальная оплата не принимается.' })}</span></>}
      chap={<RejaSahna />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    >
      <p className="st-reja-ost">{tx({ uz: "repo — o'z repo'ngiz · Mentor misoli `maydon-jamoa` · namuna `m13-dars-07-done`", ru: 'репозиторий — ваш собственный · пример Ментора `maydon-jamoa` · образец `m13-dars-07-done`' })}</p>
      <Ustoz satrlar={USTOZ.s1} />
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TO'LOVCHI NIMAGA ROZI BO'LADI (QTushuncha, markaziy; ketma-ket 6 karta — SABOQ 9/13, E 53) =====
const S2_SAVOL = { uz: 'Ekran olti savoldan nechtasiga javob beradi?', ru: 'На сколько из шести вопросов отвечает экран?' };
const S2_XATO = {
  bor: { uz: 'Telefondagi har qatorni yana bir o\'qing.', ru: 'Прочитайте ещё раз каждую строку на телефоне.' },
  test: { uz: "«Test rejim» — bugungi mashq haqida, keyingi oy haqida emas.", ru: '«Тестовый режим» — о сегодняшнем упражнении, а не о следующем месяце.' },
  yoq: { uz: 'Telefonda shu savolga javob beradigan qatorni toping.', ru: 'Найдите на телефоне строку, которая отвечает на этот вопрос.' }
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 6 : 0);
  const [yonadi, setYonadi] = useState([]);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const xatoRef = useRef(!!storedAnswer && storedAnswer.correct === false);
  const kartaRef = useRef(null);
  const varaqRef = useRef(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const done = n >= 6;
  const tugadi = useTugadi(done, 1100, avval);
  const ipucha = useIpucha(!!taxmin && !done, n);
  const javob = (bor) => {
    if (!taxmin || done) return;
    const s = TOLOVCHI_SAVOLLARI[n];
    if (bor !== s.ekrandaBor) {
      xatoRef.current = true;
      setXato(bor ? (n === 2 ? S2_XATO.test : S2_XATO.yoq) : S2_XATO.bor);
      setSilk(bor ? 'bor' : 'yoq');
      timers.current.push(setTimeout(() => setSilk(null), 500));
      return;
    }
    setXato(null);
    if (bor) { setYonadi(y => [...y, s.qator]); timers.current.push(setTimeout(() => setYonadi(y => y.filter(q => q !== s.qator)), 1100)); }
    else uchir(kartaRef.current, varaqRef.current, tr(s.matn));
    const yangi = n + 1;
    setN(yangi);
    if (yangi >= 6) onAnswer(screen, { stage: 'concept', screenIdx: screen, taxmin, correct: !xatoRef.current, picked: true, solved: true });
  };
  const yoqlar = TOLOVCHI_SAVOLLARI.map((s, i) => ({ s, i })).filter(x => !x.s.ekrandaBor && x.i < n);
  const borlar = TOLOVCHI_SAVOLLARI.map((s, i) => ({ s, i })).filter(x => x.s.ekrandaBor && x.i < n);
  const qatorlar = [
    ...(done ? borlar.map(x => ({ id: 'b' + x.i, matn: tr(x.s.matn), izoh: tr({ uz: 'ekranda ham bor', ru: 'есть и на экране' }), kul: true })) : []),
    ...yoqlar.map(x => ({ id: 'y' + x.i, matn: tr(x.s.matn), yangi: x.i === n - 1 && !done }))
  ];
  const joriy = !done && TOLOVCHI_SAVOLLARI[n];
  const sahna = (
    <div className={cx('st-s2-v', tugadi && 'tugadi')}>
      <div className="st-s2-tel">
        <Tel yorliq={<MJ />}><MentorTaklif yonadi={yonadi} /></Tel>
        {borlar.length > 0 && !done && <span className="st-bor-l">{borlar.map(x => <em key={x.i}>✓ {tr(x.s.matn)}</em>)}</span>}
      </div>
      {!tugadi && <div className="st-s2-k">
        {joriy && <div key={'k' + n} ref={kartaRef} className={cx('st-skarta fade-up', xato && 'err', !taxmin && 'xira')}>
          <span className="st-skarta-h">{tr({ uz: 'Savol', ru: 'Вопрос' })} {n + 1} / 6<Katak n={n} /></span>
          <Pufak matn={tr(joriy.matn)} />
        </div>}
        {joriy && <div className={cx('st-tug2', taxmin && 'st-chorla')}>
          <button type="button" className={cx('st-tug st-bor', silk === 'bor' && 'silk')} disabled={!taxmin} onClick={() => javob(true)}>{tr({ uz: 'Ekranda bor', ru: 'Есть на экране' })}</button>
          <button type="button" className={cx('st-tug st-yoq', silk === 'yoq' && 'silk')} disabled={!taxmin} onClick={() => javob(false)}>{tr({ uz: "Ekranda yo'q", ru: 'Нет на экране' })}</button>
        </div>}
        {xato && <QXato>{tr(xato)}</QXato>}
        {ipucha && !xato && <p className="st-ipucha fade-step">{tr({ uz: 'Telefondagi qatorlardan biri shu savolga javob beradimi?', ru: 'Отвечает ли на этот вопрос какая-то строка на телефоне?' })}</p>}
      </div>}
      <Varaq refEl={varaqRef} className="st-s2-varaq" sarlavha={tr({ uz: 'Shartlar', ru: 'Условия' })} hisob={tr({ uz: "ekranda yo'q · ", ru: 'нет на экране · ' }) + yoqlar.length} qatorlar={qatorlar} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · shartlar', ru: 'Понятие · условия' })} screen={screen} scrollSignal={n + (tugadi ? 10 : 0)} natijaSignal={done && tugadi && !avval}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Savollarni ajrating (${n}/6)`, ru: `Разберите вопросы (${n}/6)` })} onClick={onNext} /></>}>
      <div className="st-s2">
        <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
          sarlavha={tr({ uz: <>Tashkilotchi to'lasa, <span className="italic" style={{ color: T.accent }}>nimaga rozi</span> bo'ladi?</>, ru: <>На что <span className="italic" style={{ color: T.accent }}>соглашается</span> организатор, если платит?</> })}
          mentor={<Mentor>{tr({ uz: 'Tashkilotchining har savoli uchun tanlang: javobi to\'lov taklifi ekranida bormi?', ru: 'Для каждого вопроса организатора выберите: есть ли ответ на экране предложения оплаты?' })}</Mentor>}
          bashorat={!(done && tugadi) && <Bashorat savol={S2_SAVOL} variantlar={['1', '2', '4']} tanlov={taxmin} onTanla={setTaxmin} />}
          vizual={sahna}
          xulosa={done && tugadi && <XulosaQ togri={String(taxmin) === '2'} natija={taxmin && taxminQator(taxmin, 2)}
            matn={tr({ uz: "Odam to'lasa — shartlarga rozi bo'ladi. Bu misolda ekran ikki savolga javob beradi, to'rttasiga — yo'q.", ru: 'Если человек платит — он соглашается с условиями. В этом примере экран отвечает на два вопроса, на четыре — нет.' })}
            izoh={tr({ uz: "Hamma uchun ochiq taklif — nima beriladi, qancha turadi, qanday shart bilan — oferta deyiladi.", ru: 'Открытое для всех предложение — что даётся, сколько стоит, на каких условиях — называется офертой.' })} />}
        >
          <Ustoz satrlar={USTOZ.s2} />
        </QTushuncha>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1; ikkinchi misol — uy vazifalari ilovasi) =====
const UyVaraq = () => (
  <Varaq className="ixcham" sarlavha={tr({ uz: 'Uy vazifalari ilovasi · Shartlar', ru: 'Приложение для домашних заданий · Условия' })}
    qatorlar={[
      { id: 'n', matn: tr({ uz: 'nima beriladi', ru: 'что даётся' }), kul: true },
      { id: 'q', matn: tr({ uz: 'narx va muddat', ru: 'цена и срок' }), kul: true },
      { id: 't', matn: tr({ uz: 'muddat tugasa', ru: 'если срок закончится' }), ok: true, yangi: true }
    ]} />
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · oferta', ru: 'Проверка · оферта' })}
    questionText="Uy vazifalari ilovangizda pullik qism bor. Ofertaga nimani yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifalari ilovangizda pullik qism bor. Ofertaga <span className="italic" style={{ color: T.accent }}>nimani yozasiz?</span></h2>, ru: <h2 className="title h-ask">В вашем приложении для домашних заданий есть платная часть. <span className="italic" style={{ color: T.accent }}>Что вы напишете</span> в оферте?</h2> })}
    options={[
      { uz: 'Yaqinda qo\'shiladigan yangi qulayliklarni', ru: 'Новые функции, которые скоро добавятся' },
      { uz: 'Pullik muddat tugasa, nima bo\'lishini', ru: 'Что будет, когда платный срок закончится' },
      { uz: 'Ilovani hozirgacha necha kishi yuklaganini', ru: 'Сколько человек уже скачали приложение' },
      { uz: 'Ilova qaysi dasturlash tilida yozilganini', ru: 'На каком языке программирования написано приложение' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "To'lagan odam bu shartga ham rozi bo'ladi.", ru: 'Заплативший человек соглашается и с этим условием.' }}
    explainWrong={{
      0: { uz: 'Odam to\'laganda buni bugun oladimi?', ru: 'Получит ли человек это сегодня, когда заплатит?' },
      2: { uz: "Bu son to'lovchiga qanday shartni aytadi?", ru: 'Какое условие это число сообщает плательщику?' },
      3: { uz: "Bu to'lovchiga nima berilishini aytadimi?", ru: 'Говорит ли это плательщику, что он получит?' },
      default: { uz: "To'lovchi to'lashdan oldin qaysi savolga javob kutadi?", ru: 'На какой вопрос плательщик ждёт ответа до оплаты?' }
    }}
    vizual={<UyVaraq />} />
);

// ===== SCREEN 4 — MENTOR OFERTASI (QTushuncha, ketma-ket 6 karta — SABOQ 9/13, E 53) =====
const S4_SAVOL = { uz: 'Olti banddan nechtasini Mentor bugun yoza oladi?', ru: 'Сколько из шести пунктов Ментор может написать сегодня?' };
const S4_XATO = [
  { uz: 'Sotuvchi kim bo\'ladi? Kulrang qatorni o\'qing.', ru: 'Кто будет продавцом? Прочитайте серую строку.' },
  { uz: "«Doimiy o'yin» ilovada bugun ishlayaptimi?", ru: '«Постоянная игра» сегодня работает в приложении?' },
  { uz: 'Narx va muddat bugun ilovada bormi?', ru: 'Цена и срок есть в приложении сегодня?' },
  { uz: 'Pro tugaganda nima bo\'lishi ilovada bugun bormi?', ru: 'Есть ли сегодня в приложении то, что происходит, когда Pro заканчивается?' },
  { uz: 'Mashqda pul yechiladimi? Qaytaradigan pul bormi?', ru: 'В упражнении списываются деньги? Есть ли что возвращать?' },
  { uz: 'Aloqaga kimning telefoni yoziladi — sotuvchi bormi?', ru: 'Чей телефон пишется в контакты — продавец есть?' }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 6 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const xatoRef = useRef(!!storedAnswer && storedAnswer.correct === false);
  const kartaRef = useRef(null);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const done = n >= 6;
  const tugadi = useTugadi(done, 1200, avval);
  const ipucha = useIpucha(!!taxmin && !done, n);
  const javob = (kalit) => {
    if (!taxmin || done) return;
    const b = MENTOR_OFERTA.bandlar[n];
    if (kalit !== b.kalit) {
      xatoRef.current = true;
      setXato(S4_XATO[n]); setSilk(kalit);
      timers.current.push(setTimeout(() => setSilk(null), 500));
      return;
    }
    setXato(null);
    const i = n;
    const yangi = n + 1;
    setN(yangi);
    requestAnimationFrame(() => uchir(kartaRef.current, refs[i].current, boshSozlar(tr(b.matn))));
    if (yangi >= 6) onAnswer(screen, { stage: 'concept', screenIdx: screen, taxmin, correct: !xatoRef.current, picked: true, solved: true });
  };
  const joriy = !done && MENTOR_OFERTA.bandlar[n];
  const sahifa = (
    <Brauzer manzil={OFERTA_MANZIL} className="st-s4-br">
      <OfertaSahifa refs={refs} tepa={done} oxiri={done} ikki={tugadi} sarlavha={tr(MENTOR_OFERTA.sarlavha)}
        bandlar={MENTOR_OFERTA.bandlar.map((b, i) => ({ nom: tr(b.nom), matn: tr(b.matn), taxmin: b.taxmin && i < n, holat: i < n ? 'bor' : 'bosh', yangi: i === n - 1 && !done }))} />
    </Brauzer>
  );
  const harakat = !tugadi && (
    <div className="st-s4-k">
        {joriy && <div key={'k' + n} ref={kartaRef} className={cx('st-bkarta fade-up', xato && 'err', !taxmin && 'xira')}>
          <span className="st-skarta-h">{tr({ uz: 'Band', ru: 'Пункт' })} {n + 1} / 6<Katak n={n} /></span>
          <b className="st-bkarta-nom">{tr(joriy.nom)}</b>
          <span className="st-bkarta-s">{tr(joriy.savol)}</span>
        </div>}
        {joriy && <div className={cx('st-tug2', taxmin && 'st-chorla')}>
          <button type="button" className={cx('st-tug st-bugun', silk === 'bugun' && 'silk')} disabled={!taxmin} onClick={() => javob('bugun')}>{tr({ uz: 'Bugun yoziladi', ru: 'Пишется сегодня' })}</button>
          <button type="button" className={cx('st-tug st-real', silk === 'real' && 'silk')} disabled={!taxmin} onClick={() => javob('real')}>{tr({ uz: 'Real ishga tushirishda', ru: 'При реальном запуске' })}</button>
        </div>}
        {xato && <QXato>{tr(xato)}</QXato>}
        {ipucha && !xato && <p className="st-ipucha fade-step">{tr({ uz: 'Bu bandni Mentor bugun rost yoza oladimi?', ru: 'Может ли Ментор сегодня честно написать этот пункт?' })}</p>}
        <p className="st-halol">{tr(HALOL_GAP)}</p>
    </div>
  );
  const sahna = (
    <div className={cx('st-s4-v', tugadi && 'tugadi')}>
      {sahifa}
      {tugadi && <p className="st-halol keng">{tr(HALOL_GAP)}</p>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · oferta bandlari', ru: 'Понятие · пункты оферты' })} screen={screen} scrollSignal={n + (tugadi ? 10 : 0)} natijaSignal={done && tugadi && !avval}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Bandlarni ajrating (${n}/6)`, ru: `Разберите пункты (${n}/6)` })} onClick={onNext} /></>}>
      <div className="st-s4">
        <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
          sarlavha={tr({ uz: <>Mentor ofertaga qaysi shartlarni <span className="italic" style={{ color: T.accent }}>bugun yoza oladi?</span></>, ru: <>Какие условия Ментор может <span className="italic" style={{ color: T.accent }}>написать в оферте сегодня?</span></> })}
          mentor={<Mentor>{tr({ uz: 'Har band uchun tanlang: u bugun yoziladimi yoki real ishga tushirishda?', ru: 'Для каждого пункта выберите: он пишется сегодня или при реальном запуске?' })}</Mentor>}
          bashorat={!(done && tugadi) && <Bashorat savol={S4_SAVOL} variantlar={['2', '3', '4']} tanlov={taxmin} onTanla={setTaxmin} />}
          harakat={harakat}
          vizual={sahna}
          xulosa={done && tugadi && <XulosaQ togri={String(taxmin) === '3'} natija={taxmin && taxminQator(taxmin, 3)}
            matn={tr({ uz: 'Bu mashqda ofertaga bugun ishlaydigan narsa yoziladi; qolgani — real ishga tushirishda.', ru: 'В этом упражнении в оферту пишут то, что работает сегодня; остальное — при реальном запуске.' })}
            izoh={tr({ uz: "«Mashq hujjati» va «yuridik maslahat emas» qatorlari sahifa mashq ekanini ochiq aytadi.", ru: 'Строки «Учебный документ» и «не юридическая консультация» открыто говорят, что страница учебная.' })} />}
        >
          <Ustoz satrlar={USTOZ.s4} />
        </QTushuncha>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — OFERTANGIZ (QMustaqil: ketma-ket 3 qism, bittadan — E 43, E 53; chapda telefon — o'quvchining to'lov taklifi ekrani) =====
const AP = "['`" + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019) + "]";
const KARTA_SOZ_RE = /karta\s*raqam|номер\s*карт|карт\w*\s+номер|\bcvv\b|\bcvc\b/i;
const TEL_RE = /\+\s*998|@|t\.me\/|(?<!\d)998\d{9}(?!\d)/i;
const KARTA_SON_RE = /(?:\d[\s-]?){11,}\d/;
const TEL9_RE = /(?<!\d)\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}(?!\d)/;
const RAQAM7_RE = /\d{7,}/;
const VADA_RE = new RegExp('tez orada|yaqinda|keyinroq|qo' + AP + 'shamiz|qo' + AP + 'shiladi|скоро|позже|добавим|добавится|добавят', 'i');
const KAFOLAT_RE = /kafolat|100\s?%|har doim|hech qachon|гарант|всегда|никогда/i;
const T5 = {
  bosh: { uz: "Bu joy bo'sh — yozing yoki «Hali bilmayman»ni bosing.", ru: 'Поле пустое — напишите или нажмите «Пока не знаю».' },
  tel: { uz: 'Ofertaga telefon va akkaunt nomi yozilmaydi.', ru: 'Телефон и имя аккаунта в оферту не пишутся.' },
  raqam: { uz: 'Bu telefon raqamimi? Telefon yozilmaydi.', ru: 'Это номер телефона? Телефон не пишется.' },
  karta: { uz: "Karta ma'lumoti hech qayerga yozilmaydi.", ru: 'Данные карты нигде не пишутся.' },
  narx: { uz: 'Narxni yozing — 4-darsdagi taxminingiz.', ru: 'Напишите цену — ваше предположение с 4-го урока.' },
  vada: { uz: "Va'da emas — bugun ishlaydigan narsani yozing.", ru: 'Не обещание — напишите то, что работает сегодня.' },
  kafolat: { uz: "Kafolat so'zi o'rniga nima bo'lishini aniq yozing.", ru: 'Вместо слова-гарантии точно напишите, что произойдёт.' },
  yana: { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставляете так — нажмите «Сохранить» ещё раз.' },
  nomBosh: { uz: 'Avval nomni yozing — u sarlavhaga tushadi.', ru: 'Сначала напишите название — оно попадёт в заголовок.' },
  boshYoz: { uz: "Bu joy bo'sh — yozing.", ru: 'Поле пустое — напишите.' }
};
// Matn tekshiruvi (PM-108; node da sinalgan): { t, qat } — qat: bloklaydi; aks holda yumshoq (ikkinchi «Saqlash» bilan o'tadi)
const matnXato = (s) => {
  const v = String(s || '').trim();
  if (!v) return { t: T5.bosh, qat: true };
  if (KARTA_SOZ_RE.test(v)) return { t: T5.karta, qat: true };
  if (TEL_RE.test(v)) return { t: T5.tel, qat: true };
  if (KARTA_SON_RE.test(v)) return { t: T5.karta, qat: true };
  if (TEL9_RE.test(v)) return { t: T5.tel, qat: true };
  if (RAQAM7_RE.test(v)) return { t: T5.raqam, qat: false };
  if (VADA_RE.test(v)) return { t: T5.vada, qat: false };
  if (KAFOLAT_RE.test(v)) return { t: T5.kafolat, qat: false };
  return null;
};
const S5_QISM = [{ uz: 'Nima beriladi', ru: 'Что даётся' }, { uz: 'Narx va muddat', ru: 'Цена и срок' }, null];
const tugasaNom = (nom) => tr({ uz: (nom || '…') + ' tugasa', ru: 'Если ' + (nom || '…') + ' закончится' });
const narxDum = (nom) => tr({ uz: '; muddat tugagach ' + (nom || '…') + " o'zi to'xtaydi, pul avtomatik yechilmaydi", ru: '; по окончании срока ' + (nom || '…') + ' сам выключается, деньги автоматически не списываются' });
const narxBosh = (d) => {
  const n = son(d.narx); const dk = son(d.davr);
  if (!n) return '';
  return dk ? tr({ uz: dk + ' kun, ' + probel(n) + " so'm", ru: dk + ' дней, ' + probel(n) + ' сумов' }) : tr({ uz: probel(n) + " so'm", ru: probel(n) + ' сумов' });
};
// O'quvchi ofertasining olti bandi (tartib va id barqaror — A-12)
const ofertaBandlar = (d) => {
  const nb = narxBosh(d);
  return MENTOR_OFERTA.bandlar.map(b => {
    if (b.id === 'nima') return { id: b.id, nom: tr(b.nom), matn: d.savol1 ? '[savol]' : d.matn1.trim(), oz: true };
    if (b.id === 'narx') return { id: b.id, nom: tr(b.nom), matn: d.savol2 ? '[savol]' : (son(d.davr) ? nb + narxDum(d.nom.trim()) : nb), bosh: d.savol2 ? '[savol]' : nb, dum: !d.savol2 && son(d.davr) ? narxDum(d.nom.trim()) : null, oz: true };
    if (b.id === 'tugasa') return { id: b.id, nom: tugasaNom(d.nom.trim()), matn: d.savol3 ? '[savol]' : d.matn3.trim(), oz: true };
    return { id: b.id, nom: tr(b.nom), matn: tr(b.matn) };
  });
};
const s5Bosh = (st, narx) => {
  if (st && st.d) return { ...st.d };
  return { nom: '', matn1: '', narx: narx && son(narx.narx) ? probel(son(narx.narx)) : '', davr: narx && son(narx.davrKun) ? String(son(narx.davrKun)) : '', matn3: '', savol1: false, savol2: false, savol3: false };
};
const S5_YORDAM = [
  { uz: "Mentor misolida: Pro · «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi · 30 kun, 15 000 so'm · e'lon qilingan o'yinlar qoladi, yangi o'yin o'zi e'lon qilinmaydi.", ru: 'В примере Ментора: Pro · «Постоянная игра»: каждую неделю в тот же день и час игра объявляется сама · 30 дней, 15 000 сумов · объявленные игры остаются, новая игра сама не объявляется.' },
  { uz: "Bandda faqat mahsulotingiz bugun qiladigan narsani yozing. 4-darsda narx yozmagan bo'lsangiz — bugungi taxminingizni yozing, u ham taxmin. Modelingiz reklama, B2B yoki tranzaksiya bo'lsa — bandlarni 4-darsdagi alohida mashq ekrani uchun yozing: bu ham mashq hujjati, lending pastiga havola qo'yilmaydi.", ru: 'Пишите в пункт только то, что ваш продукт делает сегодня. Если на 4-м уроке не записали цену — напишите сегодняшнее предположение, это тоже предположение. Если ваша модель — реклама, B2B или транзакция — пишите пункты для отдельного учебного экрана из 4-го урока: это тоже учебный документ, ссылку внизу лендинга не ставят.' }
];
const StYordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="st-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="st-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="st-yordam-s">{tx(l)}</span>)}</span>}
    </>
  );
};
const Kiritish = ({ n, value, onChange, placeholder, qator = 1, sonli, max, xato, yorliq }) => (
  <label className={cx('st-in-j', xato && 'err')}>
    {n != null && <i className="st-in-n">{n}</i>}
    {yorliq && <em className="st-in-y">{yorliq}</em>}
    {qator > 1
      ? <textarea className="st-in" rows={qator} maxLength={max} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      : <input className="st-in" inputMode={sonli ? 'numeric' : undefined} maxLength={max} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />}
  </label>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const narx = useMemo(() => lsO(NARX_KEY), []);
  const model = useMemo(modelOl, []);
  const [d, setD] = useState(() => s5Bosh(storedAnswer, narx));
  const [k, setK] = useState(() => (storedAnswer && Number.isInteger(storedAnswer.k) ? storedAnswer.k : 0));
  const [tahrir, setTahrir] = useState(null);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const kartaRef = useRef(null);
  const varaqRef = useRef(null);
  const done = k >= 3 && tahrir == null;
  // xato chiqqanda karta pastki panel ostida qolmasin (04-dars naqshi)
  useEffect(() => {
    if (!xato) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.st-karta .q-xato'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 60);
    return () => clearTimeout(t);
  }, [xato]);
  const qism = tahrir != null ? tahrir : k;
  const up = (p) => { setD(o => ({ ...o, ...p })); setXato(null); };
  const yoz = (nd, nk) => {
    const bandlar = ofertaBandlar(nd).map(b => ({ id: b.id, matn: b.matn }));
    if (nk >= 3) hujjatYoz({ bandlar });
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'oferta', d: nd, k: nk, nom: nd.nom.trim(), correct: nk >= 3, picked: true, solved: nk >= 3 });
    if (nk >= 3 && !(storedAnswer && storedAnswer.solved) && isStudent && live.submitAnswer) live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const otkaz = (nd) => {
    const nk = tahrir != null ? 3 : k + 1;
    uchir(kartaRef.current, varaqRef.current, qism === 0 ? (nd.savol1 ? '[savol]' : nd.nom) : qism === 1 ? (nd.savol2 ? '[savol]' : narxBosh(nd)) : (nd.savol3 ? '[savol]' : '✓'));
    setXato(null); setYumshoq(null); setTahrir(null); setK(Math.max(nk, k)); setD(nd);
    yoz(nd, Math.max(nk, k));
  };
  const tekshir = (maydonlar) => {
    for (const [nomi, val, turi] of maydonlar) {
      if (turi === 'narx') { if (!son(val)) return { maydon: nomi, t: T5.narx, qat: true }; continue; }
      const x = matnXato(val);
      if (x) return { maydon: nomi, ...x };
    }
    return null;
  };
  const saqla = () => {
    const m = qism === 0 ? [['nom', d.nom], ['matn1', d.matn1]] : qism === 1 ? [['narx', d.narx, 'narx']] : [['matn3', d.matn3]];
    const x = tekshir(m);
    const kalit = qism + '|' + m.map(q => q[1]).join('|');
    if (x && (x.qat || yumshoq !== kalit)) { setXato(x); if (!x.qat) setYumshoq(kalit); return; }
    otkaz({ ...d, ['savol' + (qism + 1)]: false });
  };
  const bilmayman = () => {
    if (qism === 0) { const x = tekshir([['nom', d.nom]]); if (x && x.qat) { setXato(x.t === T5.bosh ? { ...x, t: T5.nomBosh } : x); return; } }
    otkaz({ ...d, ['savol' + (qism + 1)]: true });
  };
  const bandlar = ofertaBandlar(d);
  const nom = d.nom.trim();
  const telNarx = son(d.narx) ? tn({ uz: (son(d.davr) ? son(d.davr) + ' kun — ' : '') + probel(son(d.narx)) + " so'm", ru: (son(d.davr) ? son(d.davr) + ' дней — ' : '') + probel(son(d.narx)) + ' сумов' }) : '…';
  const e = (narx && narx.ekran) || {};
  const tel = narx && !isMentor && (
    <div className={cx('st-ms-tel', qism === 1 && !done && 'ulag')}>
      <Tel yorliq={tr({ uz: '4-darsdagi ekraningiz', ru: 'Ваш экран с 4-го урока' })}>
        <TaklifEkran sarlavha={e.sarlavha || '…'} matn={e.matn} narx={telNarx} tugma={e.tugma || tr(MENTOR_EKRAN.tugma)} yonadi={qism === 1 && !done ? ['narx'] : []} />
      </Tel>
    </div>
  );
  const vQatorlar = bandlar.map((b, i) => ({
    id: b.id, nom: (i + 1) + ' · ' + b.nom, kul: !b.oz,
    matn: b.oz ? (b.matn ? (b.dum ? b.bosh : b.matn) : '') : b.matn, dum: b.dum,
    yangi: b.oz && done, tahrir: b.oz && done ? ({ 1: 0, 2: 1, 3: 2 })[i] : null,
    yon: !!narx && !isMentor && qism === 1 && !done && b.id === 'narx' // telefondagi narx qatori bilan birga yonadi (SABOQ 35)
  }));
  const xatoBor = (maydon) => xato && xato.maydon === maydon;
  const karta = !done && (
    <div key={'q' + qism} ref={kartaRef} className="st-karta fade-up">
      <span className="st-karta-h">{qism + 1} / 3 · {qism === 2 ? tugasaNom(nom) : tr(S5_QISM[qism])}</span>
      {qism === 0 && <>
        <Kiritish n={1} max={20} value={d.nom} onChange={v => up({ nom: v })} xato={xatoBor('nom')} placeholder={tr({ uz: 'Pullik qismingiz nomi', ru: 'Название платной части' })} />
        <Kiritish n={2} qator={2} max={120} value={d.matn1} onChange={v => up({ matn1: v })} xato={xatoBor('matn1')} placeholder={tr({ uz: "Odam to'lasa, nima oladi?", ru: 'Что получит человек, если заплатит?' })} />
        {model.nima && <p className="st-kul">{tr({ uz: '2-darsda yozganingiz: ', ru: 'Вы писали на 2-м уроке: ' })}«{String(model.nima)}»</p>}
      </>}
      {qism === 1 && <>
        <div className="st-ikki">
          <Kiritish n={3} sonli max={12} value={d.narx} onChange={v => up({ narx: v })} xato={xatoBor('narx')} yorliq={narx && son(narx.narx) ? tr({ uz: '4-darsdagi narxingiz · taxmin', ru: 'Ваша цена с 4-го урока · предположение' }) : null} placeholder={tr({ uz: "Narx, so'm — taxmin", ru: 'Цена, сумы — предположение' })} />
          <Kiritish sonli max={4} value={d.davr} onChange={v => up({ davr: v })} placeholder={tr({ uz: 'kun', ru: 'дней' })} />
        </div>
        <p className="st-band-p"><BandMatn matn={narxBosh(d) || '…'} dum={son(d.davr) ? narxDum(nom) : null} /></p>
        <p className="st-kul">{tr({ uz: 'Mahsulotingizda shunday bo\'lmasa — Amaliyot 1 da agent «[savol]» qoldiradi.', ru: 'Если в вашем продукте не так — в Практике 1 агент оставит «[savol]».' })}</p>
      </>}
      {qism === 2 && <Kiritish n={4} qator={2} max={120} value={d.matn3} onChange={v => up({ matn3: v })} xato={xatoBor('matn3')} placeholder={tr({ uz: "Muddat tugasa, nima qoladi va nima to'xtaydi?", ru: 'Что останется и что остановится, когда срок закончится?' })} />}
      <div className="st-karta-tug">
        <StYordam satrlar={S5_YORDAM} />
        <QTugma ikkinchi onClick={bilmayman}>{tr({ uz: 'Hali bilmayman', ru: 'Пока не знаю' })}</QTugma>
        <span className="st-sp" />
        <QTugma className="st-halqa" onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
      </div>
      {xato && <QXato>{tr(xato.t)}</QXato>}
      {xato && !xato.qat && <p className="st-kul">{tr(T5.yana)}</p>}
    </div>
  );
  const savolBor = bandlar.some(b => b.matn.includes('[savol]'));
  const varaq = <Varaq refEl={varaqRef} className={cx('st-s5-varaq', done && 'keng')} sarlavha={nom ? tr({ uz: nom + ' shartlari', ru: 'Условия ' + nom }) : tr({ uz: 'Ofertam', ru: 'Моя оферта' })} qatorlar={vQatorlar} onTahrir={done ? (i) => { setTahrir(i); setXato(null); } : null} />;
  const forma = isMentor
    ? <div className="st-ms mentor"><Brauzer manzil={OFERTA_MANZIL}><OfertaSahifa tepa oxiri sarlavha={tr(MENTOR_OFERTA.sarlavha)} bandlar={mentorBandlar()} /></Brauzer></div>
    : <div className={cx('st-ms', !narx && 'bir')}>{tel}<div className="st-ms-o">{karta}{varaq}</div></div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · oferta', ru: 'Самостоятельная работа · оферта' })} screen={screen} scrollSignal={k}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={k < 3 && !isMentor} label={k >= 3 || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Bandlarni yozing (${k}/3)`, ru: `Напишите пункты (${k}/3)` })} onClick={onNext} /></>}>
      <div className="st-s5">
        <QMustaqil
          sarlavha={tr({ uz: <>Mahsulotingiz <span className="italic" style={{ color: T.accent }}>ofertasini</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>оферту</span> своего продукта.</> })}
          mentor={!done && !isMentor && <Mentor>{tr({ uz: "Bugun ishlaydigan bandlarni o'zingiz yozasiz, qolgan uchtasi Mentor ofertasidagidek qoladi — birinchi kartadan boshlang.", ru: 'Пункты, которые работают сегодня, напишете сами, остальные три останутся как в оферте Ментора — начните с первой карточки.' })}</Mentor>}
          forma={forma}
        />
        {done && !isMentor && <QXulosa>{savolBor
          ? tr({ uz: "Bandlaringiz tayyor — «[savol]» joyini kodga qarab keyin yozasiz.", ru: 'Пункты готовы — место «[savol]» напишете позже, глядя в код.' })
          : tr({ uz: 'Bandlaringiz tayyor — Amaliyot 1 da agent ularni kod bilan solishtiradi.', ru: 'Пункты готовы — в Практике 1 агент сравнит их с кодом.' })}</QXulosa>}
        <MentorPracticeStats live={live} screen={screen} yorliq={{ uz: 'Bandlar saqlandi', ru: 'Пункты сохранены' }} />
        <Ustoz satrlar={USTOZ.s5} />
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen → QTest; INLINE_KEYS.s8 = 2; ikki blok birga — oferta va siyosatdagi «[savol]») =====
const SavolBand = () => {
  const [f, setF] = useState(() => (kamHarakat() ? 1 : 0));
  useEffect(() => { if (f) return undefined; const t = setTimeout(() => setF(1), 700); return () => clearTimeout(t); }, [f]);
  return (
    <div className="st-sb">
      <span className="st-of-nom">4 · {tr(MENTOR_OFERTA.bandlar[3].nom)}</span>
      <span className={cx('st-sb-m', f && 'tola')}>{f ? <span className="fade-step">{tr(MENTOR_OFERTA.bandlar[3].matn)}</span> : <span className="st-savol">[savol]</span>}</span>
    </div>
  );
};
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Mahsulotingiz ishi haqidagi bandda «[savol]» qoldi. Nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Mahsulotingiz ishi haqidagi bandda «[savol]» qoldi. <span className="italic" style={{ color: T.accent }}>Nima qilasiz?</span></h2>, ru: <h2 className="title h-ask">В пункте о работе вашего продукта остался «[savol]». <span className="italic" style={{ color: T.accent }}>Что вы сделаете?</span></h2> })}
    options={[
      { uz: "Agentdan joyni o'zi to'ldirishini so'rayman", ru: 'Попрошу агента самому заполнить место' },
      { uz: '«[savol]»ni shundayligicha qoldirib chiqaraman', ru: 'Оставлю «[savol]» как есть и опубликую' },
      { uz: "Mahsulot nima qilishini ko'rib, o'zim yozaman", ru: 'Посмотрю, что делает продукт, и напишу сам' },
      { uz: "Boshqa ilovaning shartlaridan gap ko'chiraman", ru: 'Скопирую фразу из условий другого приложения' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Sahifada faqat mahsulotingiz bugun qiladigan narsa turadi.', ru: 'На странице только то, что ваш продукт делает сегодня.' }}
    explainWrong={{
      0: { uz: "Agent kodda ko'rmagan narsani qayerdan oladi?", ru: 'Откуда агент возьмёт то, чего не видел в коде?' },
      1: { uz: "To'lovchi «[savol]»dan qanday shartni bilib oladi?", ru: 'Какое условие плательщик узнает из «[savol]»?' },
      3: { uz: "Boshqa ilova sizning mahsulotingiz nima qilishini biladimi?", ru: 'Знает ли другое приложение, что делает ваш продукт?' },
      default: { uz: "«[savol]» qayerda va nima uchun paydo bo'lgan edi?", ru: 'Где и почему появился «[savol]»?' }
    }}
    vizual={<SavolBand />} />
);

// ===== 🏅 NISHONLAR (4) — qilingan ishni aytadi; medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  askBeforePay: { icon: '🔎', name: 'Ask Before Pay!', desc: { uz: 'Ekran qaysi savolga javob berishini topdingiz', ru: 'Нашли, на какой вопрос отвечает экран' } },
  openOffer: { icon: '📄', name: 'Open Offer!', desc: { uz: 'Ofertaga nima yozilishini topdingiz', ru: 'Нашли, что пишут в оферте' } },
  clauseSorter: { icon: '🗂️', name: 'Clause Sorter!', desc: { uz: 'Bugun yoziladigan bandlarni ajratdingiz', ru: 'Отделили пункты, которые пишутся сегодня' } },
  termsChecked: { icon: '🔗', name: 'Terms Checked!', desc: { uz: 'Ikki amaliyotni tekshiruvigacha bajardingiz', ru: 'Выполнили обе практики до проверки' } }
};
// Ekran id → nishon: s2, s4 — olti savol/band birinchi urinishda; s3 — 1-savol birinchi urinishda; a2 — bonus (Amaliyot 1 bajarilgan va uchala tekshiruv belgilangan)
const ACH_TRIGGERS = { s2: 'askBeforePay', s3: 'openOffer', s4: 'clauseSorter', a2: 'termsChecked' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 8)
const Q_LABELS = {
  3: { uz: '1 — Ofertaga nima yoziladi', ru: '1 — Что пишут в оферте' },
  8: { uz: 'Yakuniy — «[savol]» qolsa', ru: 'Итоговый — если остался «[savol]»' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'oferta', ru: 'оферта' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'shart', ru: 'условие' }, l: 84, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'band', ru: 'пункт' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'narx', ru: 'цена' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'muddat', ru: 'срок' }, l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'havola', ru: 'ссылка' }, l: 66, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'siyosat', ru: 'политика' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'mashq hujjati', ru: 'учебный документ' }, l: 20, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: 'Maydon Jamoa', l: 56, t: 52, s: 20, d: 24, dl: 3.3 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD jadvali), to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12
const QUIZ_BANK = [
  { q: { uz: 'Oferta qanday taklif?', ru: 'Какое предложение — оферта?' }, opts: [{ uz: 'Hamma uchun ochiq, shartlari yozilgan', ru: 'Открытое для всех, с записанными условиями' }, { uz: "Faqat do'stlarga yashirin yuborilgan", ru: 'Тайно отправленное только друзьям' }, { uz: "Narxsiz, faqat og'zaki aytilgan taklif", ru: 'Без цены, сказанное только устно' }, { uz: "To'lovdan keyingina ko'rsatiladigan", ru: 'Показываемое только после оплаты' }], correct: 0 },
  { q: { uz: "Odam to'lasa, ofertaga nisbatan nima bo'ladi?", ru: 'Что происходит с офертой, если человек платит?' }, opts: [{ uz: "Hech narsa — u faqat narxni ko'rdi", ru: 'Ничего — он видел только цену' }, { uz: "Undagi shartlarga rozi bo'ladi", ru: 'Он соглашается с её условиями' }, { uz: "Oferta shu zahoti bekor bo'ladi", ru: 'Оферта сразу отменяется' }, { uz: "Shartlarni o'zi o'zgartira oladi", ru: 'Может сам изменить условия' }], correct: 1 },
  { q: { uz: 'Tashkilotchi: «Bekor qilsam, pulim qaytadimi?» Javob qayerda?', ru: 'Организатор: «Если отменю, деньги вернутся?» Где ответ?' }, opts: [{ uz: "To'lov taklifi ekranidagi narxda", ru: 'В цене на экране предложения оплаты' }, { uz: "Mashq to'lov sahifasi tugmasida", ru: 'В кнопке учебной страницы оплаты' }, { uz: 'Ofertaning bekor qilish bandida', ru: 'В пункте оферты об отмене' }, { uz: "Ilovaning e'lon berish qismida", ru: 'В разделе объявлений приложения' }], correct: 2 },
  { q: { uz: "Mentor ofertasida sotuvchi qatori nega bo'sh?", ru: 'Почему в оферте Ментора строка продавца пустая?' }, opts: [{ uz: "Mentor o'z ismini yozishni unutgan", ru: 'Ментор забыл написать своё имя' }, { uz: "Sotuvchini agent keyin o'zi qo'yadi", ru: 'Продавца потом поставит сам агент' }, { uz: "Qatorni Pro olgan odam to'ldiradi", ru: 'Строку заполнит тот, кто взял Pro' }, { uz: "Bu kursda real ishga tushirish yo'q", ru: 'В этом курсе нет реального запуска' }], correct: 3 },
  { q: { uz: 'Qaysi gap ofertaga yoziladi?', ru: 'Какая фраза пишется в оферте?' }, opts: [{ uz: "Pro tugasa, e'lon qilingan o'yin qoladi", ru: 'Если Pro закончится, объявленная игра остаётся' }, { uz: "Tez orada Pro'ga yana qulaylik qo'shamiz", ru: 'Скоро добавим в Pro ещё функции' }, { uz: "Boshqa tashkilotchilar ham Pro'ni oldi", ru: 'Другие организаторы тоже взяли Pro' }, { uz: "Pro bilan har o'yiningiz to'lib boradi", ru: 'С Pro каждая ваша игра будет заполняться' }], correct: 0 },
  { q: { uz: "Mentor misolida Pro muddati tugasa, nima bo'ladi?", ru: 'Что будет в примере Ментора, когда срок Pro закончится?' }, opts: [{ uz: "Keyingi 30 kun puli o'zi yechiladi", ru: 'Деньги за следующие 30 дней спишутся сами' }, { uz: "Pro o'zi to'xtaydi, pul so'ralmaydi", ru: 'Pro сам выключится, деньги не запросят' }, { uz: "E'lon qilingan o'yinlar o'chib ketadi", ru: 'Объявленные игры удалятся' }, { uz: "O'yinchilar uchun ilova pullik bo'ladi", ru: 'Приложение станет платным для игроков' }], correct: 1 },
  { q: { uz: 'Real ishga tushirish uchun nima kerak?', ru: 'Что нужно для реального запуска?' }, opts: [{ uz: "Ilovani do'konga joylashning o'zi", ru: 'Только выложить приложение в магазин' }, { uz: "Sinfdoshlarning og'zaki roziligi", ru: 'Устное согласие одноклассников' }, { uz: 'Ota-ona yozma roziligi va sotuvchi', ru: 'Письменное согласие родителей и продавец' }, { uz: "Ofertani lendingga qo'yishning o'zi", ru: 'Только поставить оферту на лендинг' }], correct: 2 },
  { q: { uz: 'Agent ofertada «[savol]» qoldirdi. Bu nimani bildiradi?', ru: 'Агент оставил в оферте «[savol]». Что это значит?' }, opts: [{ uz: 'Bandni olib tashlash kerakligini', ru: 'Что пункт нужно удалить' }, { uz: 'Sahifa internetda ochilmasligini', ru: 'Что страница не откроется в интернете' }, { uz: "Agent uni keyin o'zi to'ldirishini", ru: 'Что агент потом сам его заполнит' }, { uz: 'Agent buni koddan bilolmaganini', ru: 'Что агент не смог узнать это из кода' }], correct: 3 },
  { q: { uz: 'Kitob almashish ilovangiz ofertasidagi narxni qanday tekshirasiz?', ru: 'Как проверить цену в оферте вашего приложения обмена книгами?' }, opts: [{ uz: "Ilovada va kodida o'zim ko'raman", ru: 'Сам посмотрю в приложении и в коде' }, { uz: "Agentdan «to'g'rimi?» deb so'rayman", ru: 'Спрошу агента «правильно?»' }, { uz: "Sinfdoshimdan narxni so'rab olaman", ru: 'Спрошу цену у одноклассника' }, { uz: "Tekshirmayman — narx o'zgarmaydi", ru: 'Не проверяю — цена не меняется' }], correct: 0 },
  { q: { uz: "Siyosatdagi to'lov bandida qaysi gap rost?", ru: 'Какая фраза в пункте об оплате в политике верна?' }, opts: [{ uz: 'Karta raqamini biz xavfsiz saqlaymiz', ru: 'Мы надёжно храним номер карты' }, { uz: "Karta ma'lumotini mahsulot saqlamaydi", ru: 'Продукт не хранит данные карты' }, { uz: "To'lov haqida hech narsa saqlanmaydi", ru: 'Об оплате ничего не хранится' }, { uz: "Karta ma'lumotini Mentor tekshirib turadi", ru: 'Данные карты проверяет Ментор' }], correct: 1 },
  { q: { uz: "Mentor misolida to'lov uchun nima saqlanadi?", ru: 'Что хранится об оплате в примере Ментора?' }, opts: [{ uz: 'Karta raqami va egasining telefoni', ru: 'Номер карты и телефон владельца' }, { uz: 'Tashkilotchining ismi va maktab raqami', ru: 'Имя организатора и номер школы' }, { uz: "To'lov raqami, hisob, holat va summa", ru: 'Номер платежа, аккаунт, статус и сумма' }, { uz: "Hech narsa — to'lovdan keyin o'chadi", ru: 'Ничего — после оплаты всё удаляется' }], correct: 2 },
  { q: { uz: "Tashkilotchi Pro shartlarini qachon o'qiy olishi kerak?", ru: 'Когда организатор должен иметь возможность прочитать условия Pro?' }, opts: [{ uz: "To'lov o'tgandan keyin, chatda", ru: 'После оплаты, в чате' }, { uz: "Pro muddati tugagan kunning o'zida", ru: 'В день окончания срока Pro' }, { uz: "Mentordan so'rab bilgan paytida", ru: 'Когда спросит у Ментора' }, { uz: "To'lov tugmasini bosishdan oldin", ru: 'До нажатия кнопки оплаты' }], correct: 3 }
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

// ===== AMALIYOT BLOKLARI (QBlok + ScreenBlok; o'quvchining o'z repo'si, 4 qadam). «Davom etish»: A1 — 3-qadamdan, A2 — 2-qadamdan keyin (E 55); bayroq — faqat 4-qadam «Bajardim»idan =====
const S5_IDX = SCREEN_META.findIndex(m => m.id === 's5');
const A1_IDX = SCREEN_META.findIndex(m => m.id === 'a1');
const A2_IDX = SCREEN_META.findIndex(m => m.id === 'a2');
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
// Telefonda blok qadami (13-Modul sinf-supurish A): Stage eng pastga surmaydi — natija maketi ostida joriy band va tugash xulosasi ekrandan tepada qolardi.
// Joriy band boshi kontent tepasiga (16 px), tugash xulosasi markazga suriladi.
const telBlokSur = (tugadi) => {
  const bajarilgan = document.querySelectorAll('.q-blok-q.bajarildi');
  const el = tugadi ? document.querySelector('.q-blok-tugadi') || bajarilgan[bajarilgan.length - 1] : document.querySelector('.q-blok-q.joriy');
  const c = el && el.closest('.stage-content');
  if (!c) return;
  const cr = c.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const markaz = tugadi && r.height < cr.height - 32;
  const delta = markaz ? (r.top + r.bottom) / 2 - (cr.top + cr.bottom) / 2 : r.top - cr.top - 16;
  c.scrollTo({ top: c.scrollTop + delta, behavior: kamHarakat() ? 'auto' : 'smooth' });
};
const BLOK_TUGADI = { uz: 'Blok tugadi — «Davom etish»ni bosing.', ru: 'Блок завершён — нажмите «Продолжить».' };
const XATO_GAP = { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Появилась такая ошибка: {ошибка}. Исправь.»' };
// Prompt qutisi: {…} joylari ajralib ko'rinadi, bo'sh joy yonida kulrang namuna; ✎ — matnni tahrirlash; «Nusxalash» — butun matn (oldin — tekshir())
const StPrompt = ({ satrlar, namuna = {}, toldir = {}, tahrir = true, tekshir }) => {
  const [ok, setOk] = useState(false);
  const [ed, setEd] = useState(null);
  const [edOchiq, setEdOchiq] = useState(false);
  const asl = satrlar.flatMap(l => (Array.isArray(l) ? l : [l])).map(l => { let s = tr(l); Object.entries(toldir).forEach(([j, v]) => { if (v) s = s.split(j).join(v); }); return s; });
  const matn = ed != null ? ed.split('\n') : asl;
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const n = namuna[p];
    const yangi = !!n && !korildi.has(p);
    if (yangi) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{yangi && <span className="st-joy-n">{Array.isArray(n) ? n.map((x, k) => <span key={k}>{tx(x)}</span>) : tx(n)}</span>}</React.Fragment>;
  });
  const nusxa = async () => {
    if (tekshir && !tekshir()) return;
    try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt st-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span>
        {tahrir && <button type="button" className="st-ed" aria-pressed={edOchiq} onClick={() => { if (ed == null) setEd(asl.join('\n')); setEdOchiq(o => !o); }} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
        <button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {edOchiq
        ? <textarea className="st-prompt-ta" value={ed ?? ''} rows={Math.min(14, Math.max(5, matn.length + 1))} onChange={e => setEd(e.target.value)} aria-label={tr({ uz: 'Prompt matni', ru: 'Текст промпта' })} />
        : matn.map((l, i) => <span key={i} className="st-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Band = ({ children, accent, kul }) => <span className={cx('st-band', accent && 'accent', kul && 'kul')}>{children}</span>;
const Artefakt = ({ answers }) => {
  const h = hujjatOl();
  if (!h) return null;
  const nom = answers && answers[S5_IDX] && answers[S5_IDX].nom;
  return <span className="st-art">{nom ? tr({ uz: nom + ' shartlari', ru: 'Условия ' + nom }) : tr({ uz: 'Ofertam', ru: 'Моя оферта' })} · {tr({ uz: '6 band', ru: '6 пунктов' })}</span>;
};
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, answers, eyebrow, title, mentor, steps, natija, ortda, doneText, doneIzoh, ulgur, ulgurQadam = 99, yakun, ustoz }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam || isMentorLive;
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { ...(storedAnswer || {}), stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(yakun ? yakun() : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(stepN); // oldingi qadam: StrictMode ikkinchi chaqiruvida ham ochilishda surilmaydi
  const tor = useIsMobile(768);
  useEffect(() => {
    if (birinchi.current === stepN) { return undefined; }
    birinchi.current = stepN;
    const t = setTimeout(() => { if (tor) { telBlokSur(done); return; } const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, tor ? 420 : 120); // telefonda — Mentor yig'ilish o'tishidan (0,38 s) keyin
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  const dt = typeof doneText === 'function' ? doneText() : doneText;
  const di = typeof doneIzoh === 'function' ? doneIzoh() : doneIzoh;
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={tor ? 0 : stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="st-blok">
        <QBlok til={__lang} sarlavha={<>{tr(title)}<Artefakt answers={answers} /></>} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({
            h: tr(c.h),
            t: <>{tx(c.t)}{c.bandlar && c.bandlar.filter(Boolean).map((b, i) => (b && (b.accent !== undefined || b.kul) ? <Band key={i} accent={b.accent} kul={b.kul}>{tx(b.t || b)}</Band> : <Band key={i}>{tx(b)}</Band>))}{c.prompt && <StPrompt satrlar={c.prompt} namuna={c.namuna} toldir={c.toldir} tahrir={c.tahrir !== false} tekshir={c.tekshir} />}{c.ichi}</>,
            xato: c.yordam ? <>{c.err && <span className="st-band">{tx(c.err)}</span>}<StYordam satrlar={c.yordam} /></> : (c.err && tx(c.err))
          }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={dt ? tr(dt) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && di && <p className="st-blok-iz">{tr(di)}</p>}<MentorPracticeStats live={_live} screen={screen} />{ustoz && <Ustoz satrlar={ustoz} />}</>}>
          {ortda && <p className="st-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="st-ulgur">{tx(ulgur)}</p>}
        </QBlok>
      </div>
    </Stage>
  );
}
const trekGap = (trek, mobil, web, ikkala) => (trek === 'mobil' ? mobil : trek === 'web' ? web : ikkala);
// Prompt joylari (qavslar) — uz va ru nomi; toldir/namuna kaliti tr(J.x)
const J = {
  nom: { uz: '{nom}', ru: '{название}' },
  bandlar: { uz: '{oferta bandlari}', ru: '{пункты оферты}' },
  tolovBandi: { uz: "{to'lov bandi}", ru: '{пункт об оплате}' },
  lending: { uz: '{lending manzili}', ru: '{адрес лендинга}' },
  tugma: { uz: "{to'lov tugmasi}", ru: '{кнопка оплаты}' },
  ekran: { uz: "{to'lov taklifi ekrani}", ru: '{экран предложения оплаты}' }
};
// O'quvchi ofertasi qatorlari: «N. Band nomi — matn» (5-ekrandan)
const bandQatorlar = (h, nom) => (h ? h.bandlar.map((b, i) => {
  const m = MENTOR_OFERTA.bandlar[i];
  const n = b.id === 'tugasa' ? tugasaNom(nom) : tr(m.nom);
  return (i + 1) + '. ' + n + ' — ' + b.matn;
}) : null);
const MENTOR_QATORLAR = () => MENTOR_OFERTA.bandlar.map((b, i) => ({ uz: (i + 1) + '. ' + b.nom.uz + ' — ' + b.matn.uz, ru: (i + 1) + '. ' + b.nom.ru + ' — ' + b.matn.ru }));
// --- Amaliyot 1: kutilgan natija — brauzer (Mentor ofertasi) · agent javobi kartasi · kichik izoh ---
const NatijaA1 = () => (
  <div className="st-nat">
    <Brauzer manzil="lending/oferta.html"><OfertaSahifa tepa oxiri sarlavha={tr(MENTOR_OFERTA.sarlavha)} bandlar={mentorBandlar()} /></Brauzer>
    <div className="st-agent">
      <span className="st-agent-h">Antigravity</span>
      <p className="st-agent-m">{tx({ uz: "2-band — «Doimiy o'yin» va «Har hafta takrorlansin»: `mobil/`, `backend/` · 3-band — 15 000 so'm: to'lov taklifi ekrani; 30 kun: to'lovdan keyin `pro_gacha`; avtomatik yechadigan kod yo'q · 4-band — Pro tugashi: 5-darsdagi o'zgarish, `backend/` · «[savol]» — yo'q", ru: '2-й пункт — «Постоянная игра» и «Повторять каждую неделю»: `mobil/`, `backend/` · 3-й пункт — 15 000 сумов: экран предложения оплаты; 30 дней: после оплаты `pro_gacha`; кода автоматического списания нет · 4-й пункт — окончание Pro: изменение 5-го урока, `backend/` · «[savol]» — нет' })}</p>
    </div>
    <p className="st-nat-iz">{tr({ uz: 'Fayl nomlari sizda boshqacha bo\'ladi — gap va u qaysi faylda ekani muhim.', ru: 'Имена файлов у вас будут другими — важны фраза и файл, где она.' })}</p>
  </div>
);
const A1_PROMPT_BOSH = [
  { uz: "Qayerda: `lending/` — yangi sahifa `oferta.html`, lendingdagi boshqa sahifalar uslubida.", ru: 'Где: `lending/` — новая страница `oferta.html`, в стиле других страниц лендинга.' },
  { uz: "Nima qilsin: sahifa sarlavhasi — «{nom} shartlari». Sarlavha tepasida — «Mashq hujjati — real to'lov qabul qilinmaydi». Keyin olti band: har biri — sarlavha va matn; pastdagi so'zlarimni o'zgartirma. Sahifa oxirida — «Bu hujjat yuridik maslahat emas.»", ru: 'Что сделать: заголовок страницы — «Условия {название}». Над заголовком — «Учебный документ — реальная оплата не принимается». Дальше шесть пунктов: у каждого заголовок и текст; мои слова ниже не меняй. В конце страницы — «Этот документ — не юридическая консультация.»' }
];
const A1_PROMPT_OXIR = [
  { uz: "2, 3, 4-bandlardagi har gapni loyiha kodi bilan solishtir: kodda bo'lsa — qaysi fayl va qatordan ekanini ayt; kodda ko'rinmasa yoki boshqacha bo'lsa — o'sha gapni «[savol]» bilan almashtir va nima uchunligini ayt, o'zingdan gap qo'shma. 1, 5, 6-bandlardagi kvadrat qavsli matnga tegma.", ru: 'Каждую фразу пунктов 2, 3, 4 сравни с кодом проекта: если есть в коде — скажи, из какого файла и строки; если в коде не видно или иначе — замени эту фразу на «[savol]» и скажи почему, от себя фраз не добавляй. Текст в квадратных скобках в пунктах 1, 5, 6 не трогай.' },
  { uz: "Sahifada forma, to'lov tugmasi va karta haqida maydon bo'lmasin; sahifa hech qanday ma'lumot yig'masin va tashrifni sanamasin.", ru: 'На странице не должно быть формы, кнопки оплаты и полей о карте; страница не собирает никаких данных и не считает визиты.' },
  { uz: "Nima buzilmasin: lendingdagi `index.html` va `maxfiylik.html` o'zgarmasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: `index.html` и `maxfiylik.html` лендинга не меняются. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_YORDAM = [
  { uz: "Mentor misolidagi to'liq talab:", ru: 'Полное требование в примере Ментора:' },
  A1_PROMPT_BOSH[0],
  { uz: "Nima qilsin: sahifa sarlavhasi — «Pro shartlari». Sarlavha tepasida — «Mashq hujjati — real to'lov qabul qilinmaydi». Keyin olti band: har biri — sarlavha va matn; pastdagi so'zlarimni o'zgartirma. Sahifa oxirida — «Bu hujjat yuridik maslahat emas.»", ru: 'Что сделать: заголовок страницы — «Условия Pro». Над заголовком — «Учебный документ — реальная оплата не принимается». Дальше шесть пунктов: у каждого заголовок и текст; мои слова ниже не меняй. В конце страницы — «Этот документ — не юридическая консультация.»' },
  ...MENTOR_QATORLAR(),
  ...A1_PROMPT_OXIR
];
const A1_DALIL = [{ uz: "Ofertadagi 2, 3, 4-bandlarning har gapi uchun ro'yxat ber: gap · fayl · qator raqami. «[savol]» qo'ygan joyingda nima uchun qo'yganingni bir gap bilan ayt. Kodni o'zgartirma.", ru: 'Дай список для каждой фразы пунктов 2, 3, 4 оферты: фраза · файл · номер строки. Там, где поставил «[savol]», одной фразой скажи почему. Код не меняй.' }];
// 4-qadam: o'quvchi ofertasi varag'i — 2, 3, 4-bandlarda ✎ (matn va «[savol]» belgisi yangilanadi)
const OfertamTahrir = ({ nom, onOzgar }) => {
  const [h, setH] = useState(hujjatOl);
  const [ed, setEd] = useState(null);
  const [qiymat, setQiymat] = useState('');
  const [xato, setXato] = useState(null);
  if (!h) return <Band kul>{tr({ uz: "Avval «Mustaqil ish»dagi bandlarni yozing.", ru: 'Сначала напишите пункты в «Самостоятельной работе».' })}</Band>;
  const saqla = () => {
    const x = matnXato(qiymat);
    if (x && x.qat) { setXato(x.t === T5.bosh ? T5.boshYoz : x.t); return; }
    const bandlar = h.bandlar.map((b, i) => (i === ed ? { ...b, matn: qiymat.trim() } : b));
    hujjatYoz({ bandlar });
    setH(hujjatOl()); setEd(null); setXato(null);
    if (onOzgar) onOzgar();
  };
  return (
    <span className="st-otahrir">
      <Varaq className="ixcham" sarlavha={nom ? tr({ uz: nom + ' shartlari', ru: 'Условия ' + nom }) : tr({ uz: 'Ofertam', ru: 'Моя оферта' })}
        qatorlar={h.bandlar.map((b, i) => ({ id: b.id, nom: (i + 1) + ' · ' + (b.id === 'tugasa' ? tugasaNom(nom) : tr(MENTOR_OFERTA.bandlar[i].nom)), matn: b.matn, kul: [0, 4, 5].includes(i), tahrir: [1, 2, 3].includes(i) ? i : null }))}
        onTahrir={(i) => { setEd(i); setQiymat(h.bandlar[i].matn === '[savol]' ? '' : h.bandlar[i].matn); setXato(null); }} />
      {ed != null && <span className="st-otahrir-f fade-step">
        <Kiritish n={ed + 1} qator={2} max={160} value={qiymat} onChange={v => { setQiymat(v); setXato(null); }} placeholder={tr({ uz: "Mahsulotda ko'rganingizni yozing", ru: 'Напишите то, что увидели в продукте' })} />
        <QTugma className="st-halqa" onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        {xato && <QXato>{tr(xato)}</QXato>}
      </span>}
    </span>
  );
};
const ScreenA1 = (props) => {
  const { answers } = props;
  const nom = (answers && answers[S5_IDX] && answers[S5_IDX].nom) || '';
  const h = useMemo(hujjatOl, []);
  const [, setV] = useState(0);
  const qatorlar = bandQatorlar(h, nom);
  const toldir = { [tr(J.nom)]: nom };
  const namuna = { [tr(J.nom)]: { uz: 'masalan: Pro', ru: 'например: Pro' }, [tr(J.bandlar)]: MENTOR_QATORLAR() };
  const savolBor = () => { const x = hujjatOl(); return !!(x && x.bandlar.some(b => String(b.matn).includes('[savol]'))); };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Ofertangiz lendingda <span className="italic" style={{ color: T.accent }}>alohida sahifa</span> bo'lsin.</>, ru: <>Пусть ваша оферта будет <span className="italic" style={{ color: T.accent }}>отдельной страницей</span> на лендинге.</> }}
      mentor={{ uz: "Talab tayyor — bandlaringiz unga o'zi qo'yilgan; «1 · Ochish»dan boshlang.", ru: 'Требование готово — ваши пункты уже в нём; начните с «1 · Открыть».' }}
      ulgurQadam={3}
      ustoz={USTOZ.s6}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: файлов `.env` в списке быть не должно; если видны — агенту: «Добавь файлы `.env` в `.gitignore`.»' },
          bandlar: [{ uz: "Lending — `lending/` papkasi (12-Modulda yozgansiz). 2-qadamdagi talabda bandlaringiz turibdi — o'qib chiqing. Bu blok ikkala trekda bir xil: o'zgarish faqat `lending/` da.", ru: 'Лендинг — папка `lending/` (вы писали его в 12-м модуле). В требовании на 2-м шаге стоят ваши пункты — прочитайте. Этот блок одинаков для обоих треков: изменения только в `lending/`.' }] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavslarni tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте скобки, нажмите «Скопировать» и отправьте в Antigravity:' },
          prompt: [...A1_PROMPT_BOSH, qatorlar || J.bandlar, ...A1_PROMPT_OXIR], toldir, namuna, yordam: A1_YORDAM,
          bandlar: [!qatorlar && { kul: true, t: { uz: "Avval «Mustaqil ish»dagi bandlarni yozing.", ru: 'Сначала напишите пункты в «Самостоятельной работе».' } }] },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "agent tugatgach `lending/oferta.html` ni brauzerda oching (12-Moduldagi lending kabi). Agentning hisobotiga emas, sahifaning o'ziga qarang: bandlar «Mustaqil ish»dagi yozuvingiz bilan bir xilmi.", ru: 'когда агент закончит, откройте `lending/oferta.html` в браузере (как лендинг в 12-м модуле). Смотрите не на отчёт агента, а на саму страницу: совпадают ли пункты с вашей записью в «Самостоятельной работе».' },
          bandlar: [{ uz: 'Keyin agentdan dalillarni so\'rang:', ru: 'Затем попросите у агента доказательства:' }],
          ichi: <><StPrompt satrlar={A1_DALIL} tahrir={false} /><Band>{tx(XATO_GAP)}</Band></> },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: 'agent nima desa ham, o\'zingiz ko\'ring:', ru: 'что бы ни сказал агент, посмотрите сами:' },
          bandlar: [
            { uz: "(1) Sahifada: tepada «Mashq hujjati — real to'lov qabul qilinmaydi», oxirida «Bu hujjat yuridik maslahat emas.»; 1, 5, 6-bandlarda kvadrat qavsli matn; forma va to'lov tugmasi yo'q.", ru: '(1) На странице: вверху «Учебный документ — реальная оплата не принимается», в конце «Этот документ — не юридическая консультация.»; в пунктах 1, 5, 6 текст в квадратных скобках; формы и кнопки оплаты нет.' },
            { uz: "(2) 2, 3, 4-bandlar: agent aytgan fayl va qatorni oching — gap kodda bormi. Kod yetmaydi: har gapni mahsulotda ham ko'rgan bo'lishingiz kerak — 4, 5-darslarda tekshirgansiz yoki hozir ilovada tekshiring; tekshira olmagan gapingiz «[savol]» bo'lib qolsin.", ru: '(2) Пункты 2, 3, 4: откройте файл и строку, которые назвал агент, — есть ли фраза в коде. Кода мало: каждую фразу нужно увидеть и в продукте — вы проверяли на 4-м и 5-м уроках или проверьте сейчас в приложении; фраза, которую не смогли проверить, остаётся «[savol]».' },
            { kul: true, t: { uz: "Mentor misolida: narx — to'lov taklifi ekranida, 30 kun — to'lovdan keyin Pro muddati yoziladigan joyda; Pro tugashi va e'lon qilingan o'yinlar — 5-darsda tekshirilgan.", ru: 'В примере Ментора: цена — на экране предложения оплаты, 30 дней — там, где после оплаты пишется срок Pro; окончание Pro и объявленные игры — проверены на 5-м уроке.' } },
            { uz: "(3) «[savol]» qolgan bo'lsa — mahsulot nima qilishini kodda va ilovada ko'ring, shuni o'zingiz yozing; ko'ra olmasangiz — «[savol]» qolsin; mahsulotda yo'q narsani yozmang, bu gapni olib tashlang. Agentga: «{band}dagi «[savol]» o'rniga shuni yoz: {matn}. Faqat shu joyni o'zgartir.»", ru: '(3) Если остался «[savol]» — посмотрите в коде и приложении, что делает продукт, и напишите это сами; если не видно — пусть остаётся «[savol]»; не пишите то, чего нет в продукте, уберите эту фразу. Агенту: «Вместо «[savol]» в {пункт} напиши: {текст}. Меняй только это место.»' },
            { uz: "Yozganingizni pastdagi varaqda ham ✎ bilan sahifadagidek qiling — «[savol]» belgisi o'chadi.", ru: 'Сделайте написанное так же, как на странице, и в листе ниже через ✎ — метка «[savol]» исчезнет.' },
            { uz: "Mos kelmagan gapni agentga yozing: «{band} kodga mos emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»", ru: 'Несовпадающую фразу напишите агенту: «{пункт} не совпадает с кодом: {как должно быть}. Больше ничего не трогай, назови изменённые файлы.»' }
          ],
          ichi: <OfertamTahrir nom={nom} onOzgar={() => setV(v => v + 1)} /> }
      ]}
      natija={<NatijaA1 />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-07-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi (`lending/oferta.html` — namuna).", ru: 'Отстали — откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-07-done` — последнюю команду запускайте только в этой новой папке: она удаляет изменения в папке (`lending/oferta.html` — образец).' }}
      ulgur={{ uz: "Ulgurmasangiz: 3-qadamdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting; 4-qadam — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Не успеваете: после 3-го шага откроется «Продолжить» — переходите ко 2-й практике; 4-й шаг — домашнее задание ①. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      doneText={() => (savolBor() ? { uz: "Oferta sahifasi yozildi — «[savol]» joylari qoldi.", ru: 'Страница оферты написана — остались места «[savol]».' } : { uz: 'Oferta sahifasi tayyor: bandlar kod va ilova bilan solishtirildi.', ru: 'Страница оферты готова: пункты сверены с кодом и приложением.' })}
      doneIzoh={{ uz: "Bandni kodda va ilovada o'zingiz ko'rdingiz — agentning «mos» degani yetmaydi.", ru: 'Вы сами увидели пункт в коде и приложении — слова агента «совпадает» недостаточно.' }} />
  );
};
// --- Amaliyot 2: kutilgan natija — telefon (ikki havola) → chiziq → kichik kadr …/oferta.html · brauzer maxfiylik.html ---
const NatijaA2 = () => {
  const [k, setK] = useState(() => (kamHarakat() ? 3 : 0));
  useEffect(() => { if (k >= 3) return undefined; const t = setTimeout(() => setK(n => n + 1), k === 0 ? 900 : 1000); return () => clearTimeout(t); }, [k]);
  return (
    <div className="st-nat">
      <div className="st-nat2-r">
        <Tel yorliq={<MJ />}><MentorTaklif havolalar={MENTOR_EKRAN.havolalar.map(tr)} faolHavola={k >= 1 ? 0 : null} /></Tel>
        <Chiziq yur={k === 2} className="kichik" />
        <Brauzer manzil="…/oferta.html" className={cx('st-mini', k >= 3 ? 'ochiq' : 'yopiq')}><OfertaSahifa tepa sarlavha={tr(MENTOR_OFERTA.sarlavha)} bandlar={MENTOR_OFERTA.bandlar.slice(0, 3).map(b => ({ nom: tr(b.nom), holat: 'yoq' }))} /></Brauzer>
      </div>
      <Brauzer manzil={SIYOSAT_MANZIL}>
        <div className="st-siy">
          <b className="st-siy-sar"><MJ /> · {tr({ uz: 'maxfiylik siyosati', ru: 'политика конфиденциальности' })}</b>
          {MENTOR_SIYOSAT.map((q, i) => <p key={i} className="st-siy-q"><b>{tr(q.s)}</b> {tr(q.eski)}{q.yangi && <> <mark className="st-yangi">{tr(q.yangi)}</mark></>}</p>)}
          <span className="st-siy-ost"><span className="st-havola">{tr({ uz: 'Maxfiylik siyosati', ru: 'Политика конфиденциальности' })}</span><span className="st-havola on">{tr(MENTOR_EKRAN.havolalar[0])}</span></span>
        </div>
      </Brauzer>
      <p className="st-nat-iz">{tr({ uz: "Siyosatning eski gaplari — 12-Modulda yozilgani; sizda boshqacha bo'ladi.", ru: 'Старые фразы политики — написанные в 12-м модуле; у вас будут другими.' })}</p>
    </div>
  );
};
const A2_PROMPT = (boshqa) => [
  { uz: "Qayerda: `lending/maxfiylik.html` — «Qaysi ma'lumot?» va «Nima uchun?» javoblari; `lending/index.html` — sahifaning pastki qismi; {to'lov taklifi ekrani}.", ru: 'Где: `lending/maxfiylik.html` — ответы на «Какие данные?» и «Зачем?»; `lending/index.html` — нижняя часть страницы; {экран предложения оплаты}.' },
  { uz: "Nima qilsin: 1) Maxfiylik siyosatiga to'lov bandini qo'sh, gaplarini «Qaysi ma'lumot?» va «Nima uchun?» javoblariga mos joyiga qo'y: {to'lov bandi}", ru: 'Что сделать: 1) Добавь в политику конфиденциальности пункт об оплате, поставь его фразы в подходящие места ответов «Какие данные?» и «Зачем?»: {пункт об оплате}' },
  { uz: "To'lov uchun qaysi ma'lumot saqlanishini koddan tekshir va qaysi faylga qarab aytganingni ayt; kod boshqacha bo'lsa, koddan bilinmasa yoki kodda saqlanadigan, lekin bandda yo'q ma'lumot bo'lsa — o'sha joyni «[savol]» deb qoldir va nimaligini ayt, uni men yozaman. Siyosatning boshqa gaplariga tegma; to'lov qo'shilgani boshqa javobga ham tegsa (masalan, «Qancha saqlanadi?») — buni ayt, o'zing o'zgartirma.", ru: 'Проверь по коду, какие данные хранятся об оплате, и скажи, по какому файлу; если код иначе, из кода не понятно или в коде хранятся данные, которых нет в пункте, — оставь это место «[savol]» и скажи, что это, я напишу сам. Другие фразы политики не трогай; если добавление оплаты касается другого ответа (например, «Сколько хранится?») — скажи об этом, сам не меняй.' },
  !boshqa && { uz: "2) Lending sahifasining pastida, «Maxfiylik siyosati» yonida — «{nom} shartlari» havolasi, `oferta.html` ga.", ru: '2) Внизу страницы лендинга, рядом с «Политика конфиденциальности» — ссылка «Условия {название}» на `oferta.html`.' },
  { uz: "3) To'lov taklifi ekranida «{to'lov tugmasi}» ostida ikki kichik havola: «{nom} shartlari» va «Maxfiylik siyosati». Ular brauzerda {lending manzili}/oferta.html va {lending manzili}/maxfiylik.html ni ochsin.", ru: '3) На экране предложения оплаты под «{кнопка оплаты}» две маленькие ссылки: «Условия {название}» и «Политика конфиденциальности». Пусть они открывают в браузере {адрес лендинга}/oferta.html и {адрес лендинга}/maxfiylik.html.' },
  { uz: "Nima buzilmasin: «{to'lov tugmasi}» va mashq to'lov avvalgidek ishlasin; «Test rejim: pul yechilmaydi» qatori joyida qolsin; lending sarlavhasi, foydalar, asosiy tugma va Umami o'zgarmasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: «{кнопка оплаты}» и учебная оплата работают как раньше; строка «Тестовый режим: деньги не списываются» остаётся на месте; заголовок лендинга, преимущества, главная кнопка и Umami не меняются. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
].filter(Boolean);
const A2_YORDAM = [
  { uz: "Mentor misolidagi to'liq talab:", ru: 'Полное требование в примере Ментора:' },
  { uz: "Qayerda: `lending/maxfiylik.html` — «Qaysi ma'lumot?» va «Nima uchun?» javoblari; `lending/index.html` — sahifaning pastki qismi; ilovadagi to'lov taklifi ekrani (`mobil/`).", ru: 'Где: `lending/maxfiylik.html` — ответы на «Какие данные?» и «Зачем?»; `lending/index.html` — нижняя часть страницы; экран предложения оплаты в приложении (`mobil/`).' },
  { uz: "Nima qilsin: 1) Maxfiylik siyosatiga to'lov bandini qo'sh, gaplarini «Qaysi ma'lumot?» va «Nima uchun?» javoblariga mos joyiga qo'y — «Qaysi ma'lumot?» ga: " + MENTOR_TOLOV_BANDI.qaysi.uz + " «Nima uchun?» ga: " + MENTOR_TOLOV_BANDI.nimaUchun.uz, ru: 'Что сделать: 1) Добавь в политику конфиденциальности пункт об оплате, поставь его фразы в подходящие места ответов «Какие данные?» и «Зачем?» — в «Какие данные?»: ' + MENTOR_TOLOV_BANDI.qaysi.ru + ' В «Зачем?»: ' + MENTOR_TOLOV_BANDI.nimaUchun.ru },
  { uz: "To'lov uchun qaysi ma'lumot saqlanishini koddan tekshir va qaysi faylga qarab aytganingni ayt; kod boshqacha bo'lsa, koddan bilinmasa yoki kodda saqlanadigan, lekin bandda yo'q ma'lumot bo'lsa — o'sha joyni «[savol]» deb qoldir va nimaligini ayt, uni men yozaman. Siyosatning boshqa gaplariga tegma; to'lov qo'shilgani boshqa javobga ham tegsa (masalan, «Qancha saqlanadi?») — buni ayt, o'zing o'zgartirma.", ru: 'Проверь по коду, какие данные хранятся об оплате, и скажи, по какому файлу; если код иначе, из кода не понятно или в коде хранятся данные, которых нет в пункте, — оставь это место «[savol]» и скажи, что это, я напишу сам. Другие фразы политики не трогай; если добавление оплаты касается другого ответа (например, «Сколько хранится?») — скажи об этом, сам не меняй.' },
  { uz: "2) Lending sahifasining pastida, «Maxfiylik siyosati» yonida — «Pro shartlari» havolasi, `oferta.html` ga.", ru: '2) Внизу страницы лендинга, рядом с «Политика конфиденциальности» — ссылка «Условия Pro» на `oferta.html`.' },
  { uz: "3) To'lov taklifi ekranida «To'lovga o'tish» ostida ikki kichik havola: «Pro shartlari» va «Maxfiylik siyosati». Ular brauzerda maydon-jamoa-….netlify.app/oferta.html va maydon-jamoa-….netlify.app/maxfiylik.html ni ochsin.", ru: '3) На экране предложения оплаты под «Перейти к оплате» две маленькие ссылки: «Условия Pro» и «Политика конфиденциальности». Пусть они открывают в браузере maydon-jamoa-….netlify.app/oferta.html и maydon-jamoa-….netlify.app/maxfiylik.html.' },
  { uz: "Nima buzilmasin: «To'lovga o'tish» va mashq to'lov avvalgidek ishlasin; «Test rejim: pul yechilmaydi» qatori joyida qolsin; lending sarlavhasi, foydalar, asosiy tugma va Umami o'zgarmasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: «Перейти к оплате» и учебная оплата работают как раньше; строка «Тестовый режим: деньги не списываются» остаётся на месте; заголовок лендинга, преимущества, главная кнопка и Umami не меняются. Не трогай файлы `.env`. Больше ничего не трогай, назови изменённые файлы.' }
];
const T7 = {
  bosh: { uz: "To'lov bandini yozing — to'lovda nima saqlanadi?", ru: 'Напишите пункт об оплате — что хранится при оплате?' },
  karta: { uz: "Karta ma'lumoti hech qayerga yozilmaydi.", ru: 'Данные карты нигде не пишутся.' },
  kartaYoq: { uz: 'Karta haqida ham yozing: so\'raladimi, saqlanadimi?', ru: 'Напишите и о карте: запрашивается ли, хранится ли?' }
};
const tolovBandXato = (s) => {
  const v = String(s || '').trim();
  if (!v) return { t: T7.bosh, qat: true };
  if (KARTA_SON_RE.test(v) || /\bcvv\b|\bcvc\b/i.test(v)) return { t: T7.karta, qat: true };
  if (!/kart|карт/i.test(v)) return { t: T7.kartaYoq, qat: false };
  return null;
};
const TEK = [
  { k: 'chiqdi', uz: "(1) Telefon brauzerida lending manzilingizga `/oferta.html` qo'shib oching — tepada «Mashq hujjati — real to'lov qabul qilinmaydi».", ru: '(1) В браузере телефона откройте адрес лендинга с `/oferta.html` — вверху «Учебный документ — реальная оплата не принимается».' },
  { k: 'lending', uz: "(2) Lendingning o'zini oching: pastdagi «Maxfiylik siyosati» va «{nom} shartlari» — ikkalasi ochiladi; siyosatda «Qaysi ma'lumot?» va «Nima uchun?» ostida to'lov bandi bor. Bandning har gapini agent aytgan fayl bilan solishtiring.", ru: '(2) Откройте сам лендинг: внизу «Политика конфиденциальности» и «Условия {название}» — обе открываются; в политике под «Какие данные?» и «Зачем?» есть пункт об оплате. Сверьте каждую фразу пункта с файлом, который назвал агент.' },
  { k: 'ekran', uz: "(3) To'lov taklifi ekranini oching — Pro'siz hisob kerak (mobil — Expo Go'da, web — saytingizda). Hisobingizda Pro yoqilgan bo'lsa — Neon SQL Editor'da 5-darsdagi so'rov bilan uni bo'sh qiling: `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {hisob raqami};` — `WHERE` siz yubormang. Keyin ilovani yopib oching. «{to'lov tugmasi}» ostidagi ikki havolani bosing — brauzerda oferta va siyosat ochiladi; «{to'lov tugmasi}» avvalgidek mashq to'lov sahifasini ochadi.", ru: '(3) Откройте экран предложения оплаты — нужен аккаунт без Pro (мобильный — в Expo Go, веб — на сайте). Если в вашем аккаунте включён Pro — очистите его в Neon SQL Editor запросом из 5-го урока: `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {номер аккаунта};` — без `WHERE` не отправляйте. Затем закройте и откройте приложение. Нажмите две ссылки под «{кнопка оплаты}» — в браузере откроются оферта и политика; «{кнопка оплаты}» как раньше открывает учебную страницу оплаты.' }
];
const ScreenA2 = (props) => {
  const { storedAnswer, onAnswer, screen, answers } = props;
  const nom = (answers && answers[S5_IDX] && answers[S5_IDX].nom) || '';
  const narx = useMemo(() => lsO(NARX_KEY), []);
  const trek = useMemo(trekOl, []);
  const model = useMemo(modelOl, []);
  const boshqa = BOSHQA_MODEL.includes(model.model);
  const h0 = useMemo(hujjatOl, []);
  const [band, setBand] = useState(() => (h0 && h0.siyosatBand) || '');
  const [manzil, setManzil] = useState(() => { const l = lsO(LENDING_KEY); return (l && typeof l.manzil === 'string' && l.manzil) || ''; });
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const bosh = { chiqdi: h0 ? h0.chiqdi ?? null : null, lending: h0 && h0.havolalar ? h0.havolalar.lending ?? null : null, ekran: h0 && h0.havolalar ? h0.havolalar.ekran ?? null : null };
  const [tek, setTek] = useState(() => (storedAnswer && storedAnswer.tek) || bosh);
  const tugmaNom = (narx && narx.ekran && String(narx.ekran.tugma || '').trim()) || tr(MENTOR_EKRAN.tugma);
  const ekranGap = trekGap(trek, { uz: "ilovadagi to'lov taklifi ekrani (`mobil/`)", ru: 'экран предложения оплаты в приложении (`mobil/`)' }, { uz: "saytdagi to'lov taklifi ekrani", ru: 'экран предложения оплаты на сайте' }, null);
  const toldir = { [tr(J.nom)]: nom, [tr(J.tugma)]: tugmaNom, [tr(J.tolovBandi)]: band.trim(), [tr(J.lending)]: manzil.trim().replace(/\/+$/, ''), ...(ekranGap ? { [tr(J.ekran)]: tr(ekranGap) } : {}) };
  const namuna = {
    [tr(J.nom)]: { uz: 'masalan: Pro', ru: 'например: Pro' },
    [tr(J.tolovBandi)]: { uz: "masalan: Karta ma'lumoti so'ralmaydi — to'lov test rejimda; … kartani ko'rmaydi va saqlamaydi. Biz saqlaymiz: …", ru: 'например: Данные карты не запрашиваются — оплата в тестовом режиме; … не видит и не хранит карту. Мы храним: …' },
    [tr(J.lending)]: { uz: 'masalan: maydon-jamoa-….netlify.app', ru: 'например: maydon-jamoa-….netlify.app' },
    [tr(J.ekran)]: { uz: "masalan: ilovadagi to'lov taklifi ekrani (`mobil/`)", ru: 'например: экран предложения оплаты в приложении (`mobil/`)' }
  };
  const tekshir = () => {
    const x = tolovBandXato(band);
    if (x && (x.qat || yumshoq !== band)) { setXato(x); if (!x.qat) setYumshoq(band); return false; }
    setXato(null);
    hujjatYoz({ siyosatBand: band.trim() });
    return true;
  };
  const tanla = (k, v) => {
    const t = { ...tek, [k]: v };
    setTek(t);
    if (k === 'chiqdi') hujjatYoz({ chiqdi: v }); else hujjatYoz({ havolalar: { [k]: v } });
    if (!(storedAnswer && storedAnswer.solved)) onAnswer(screen, { ...(storedAnswer || {}), tek: t, solved: false, correct: false });
  };
  const joriyTek = ['chiqdi', 'lending', 'ekran'].findIndex(k => tek[k] === null);
  const a1 = !!(answers && answers[A1_IDX] && answers[A1_IDX].solved);
  const uchala = tek.chiqdi !== null && tek.lending !== null && tek.ekran !== null;
  const hammaOchildi = tek.chiqdi === true && tek.lending === true && tek.ekran === true;
  const tekKarta = (
    <span className="st-tek">
      {TEK.map((q, i) => {
        if (i > (joriyTek === -1 ? 2 : joriyTek)) return null;
        const v = tek[q.k];
        const matn = boshqa && q.k === 'lending' ? { uz: "(2) Lendingning o'zini oching: pastdagi «Maxfiylik siyosati» ochiladi; siyosatda «Qaysi ma'lumot?» va «Nima uchun?» ostida to'lov bandi bor. Bandning har gapini agent aytgan fayl bilan solishtiring.", ru: '(2) Откройте сам лендинг: внизу открывается «Политика конфиденциальности»; в политике под «Какие данные?» и «Зачем?» есть пункт об оплате. Сверьте каждую фразу пункта с файлом, который назвал агент.' } : q;
        return (
          <span key={q.k} className={cx('st-tek-k', v !== null && 'tanlandi')}>
            <span className="st-tek-m">{tx({ uz: matn.uz.split('{nom}').join(nom || '…').split("{to'lov tugmasi}").join(tugmaNom), ru: matn.ru.split('{название}').join(nom || '…').split('{кнопка оплаты}').join(tugmaNom) })}</span>
            <span className={cx('st-tek-tug', v === null && 'st-chorla')}>
              <QChip holat={v === true ? 'ok' : undefined} onClick={() => tanla(q.k, true)}>{tr({ uz: 'Ochildi', ru: 'Открылось' })}</QChip>
              <QChip holat={v === false ? 'on' : undefined} onClick={() => tanla(q.k, false)}>{tr({ uz: 'Ochilmadi', ru: 'Не открылось' })}</QChip>
            </span>
          </span>
        );
      })}
      {Object.values(tek).some(v => v === false) && <Band>{tr({ uz: "«Ochilmadi» bo'lsa — agentga: «{nima}: kutganim {nima kutdim}, bo'ldi {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» → push → qayta oching. Lending yangilanmagan bo'lsa — bir necha daqiqadan keyin qayta oching.", ru: 'Если «Не открылось» — агенту: «{что}: ожидал {что ожидал}, получилось {что получилось}. Исправь, назови изменённые файлы.» → push → откройте снова. Если лендинг не обновился — откройте снова через несколько минут.' })}</Band>}
      {trek !== 'web' && <Band kul>{tr({ uz: "O'rnatish fayli va brauzer ko'rinishi o'zi yangilanmaydi: odamlardagi ilovada havolalar faqat yangi versiyada ko'rinadi.", ru: 'Установочный файл и браузерная версия сами не обновляются: у людей в приложении ссылки появятся только в новой версии.' })}</Band>}
    </span>
  );
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>To'lovchi shartlarni <span className="italic" style={{ color: T.accent }}>to'lashdan oldin</span> ko'rsin.</>, ru: <>Пусть плательщик видит условия <span className="italic" style={{ color: T.accent }}>до оплаты</span>.</> }}
      mentor={{ uz: "Siyosatga to'lov bandini o'zingiz yozasiz — mahsulotingiz to'lovda nimani saqlashini siz bilasiz; «1 · Ochish»dan boshlang.", ru: 'Пункт об оплате в политику напишете сами — вы знаете, что ваш продукт хранит при оплате; начните с «1 · Открыть».' }}
      ulgurQadam={2}
      ustoz={USTOZ.s7}
      yakun={() => ({ tek, correct: a1 && uchala })}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "`lending/maxfiylik.html` ni oching: 12-Modulda yozgan to'rt javobingiz. Ular o'zgarmaydi — faqat to'lov bandi qo'shiladi. To'lov uchun nima saqlanishini 3-darsdagi jadvalingizdan eslang (Mentor misolida — `tolovlar`).", ru: 'Откройте `lending/maxfiylik.html`: ваши четыре ответа из 12-го модуля. Они не меняются — добавляется только пункт об оплате. Что хранится об оплате, вспомните по своей таблице из 3-го урока (в примере Ментора — `tolovlar`).' },
          bandlar: [
            trekGap(trek, { uz: "Mobil trek — to'lov taklifi ekrani ilovada (`mobil/`), uni Expo Go'da ochasiz.", ru: 'Мобильный трек — экран предложения оплаты в приложении (`mobil/`), открываете его в Expo Go.' }, { uz: "Web-trek — to'lov taklifi ekrani saytingizda.", ru: 'Веб-трек — экран предложения оплаты на вашем сайте.' }, { uz: "Mobil trek — to'lov taklifi ekrani ilovada (`mobil/`), uni Expo Go'da ochasiz · web-trek — to'lov taklifi ekrani saytingizda.", ru: 'Мобильный трек — экран предложения оплаты в приложении (`mobil/`), открываете его в Expo Go · веб-трек — экран предложения оплаты на вашем сайте.' }),
            { uz: "To'lov taklifi ekrani hali yo'q bo'lsa — promptdagi 3-bandni o'chiring: havolalar faqat lendingda turadi.", ru: 'Если экрана предложения оплаты ещё нет — удалите в промпте пункт 3: ссылки будут только на лендинге.' },
            { accent: boshqa, t: { uz: "Modelingiz reklama, B2B yoki tranzaksiya bo'lsa (4-darsdagi alohida mashq ekrani) — promptdagi 2-band o'zi tushib qoladi: shartlar havolasi faqat mashq ekranida bo'ladi.", ru: 'Если ваша модель — реклама, B2B или транзакция (отдельный учебный экран из 4-го урока) — пункт 2 промпта уберётся сам: ссылка на условия будет только на учебном экране.' } }
          ] },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«To'lov bandi»ni o'zingiz yozing, lending manzilini tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: '«Пункт об оплате» напишите сами, проверьте адрес лендинга, нажмите «Скопировать» и отправьте в Antigravity:' },
          ichi: <span className="st-a2-in">
            <Kiritish n={1} qator={3} max={200} value={band} onChange={v => { setBand(v); setXato(null); }} xato={!!xato} placeholder={tr({ uz: "To'lov bandi: to'lovda nima saqlanadi?", ru: 'Пункт об оплате: что хранится при оплате?' })} />
            <Kiritish n={2} max={80} value={manzil} onChange={setManzil} placeholder={tr({ uz: 'Lending manzili', ru: 'Адрес лендинга' })} />
            {xato && <QXato>{tr(xato.t)}</QXato>}
            {xato && !xato.qat && <span className="st-kul">{tr({ uz: "Shunday qoldirsangiz — yana «Nusxalash»ni bosing.", ru: 'Если оставляете так — нажмите «Скопировать» ещё раз.' })}</span>}
            <StPrompt satrlar={A2_PROMPT(boshqa)} toldir={toldir} namuna={namuna} tekshir={tekshir} />
          </span>,
          yordam: A2_YORDAM },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `lending/oferta.html` (Amaliyot 1) ham shu ro'yxatda. Har faylni `git add <fayl>` bilan qo'shing, `git commit -m \"oferta va siyosat\"`, `git push`.", ru: 'когда агент закончит: `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет; `lending/oferta.html` (Практика 1) тоже в этом списке. Добавьте каждый файл через `git add <файл>`, `git commit -m "oferta va siyosat"`, `git push`.' },
          bandlar: [
            { uz: "Lending push'dan keyin odatda o'zi yangilanadi — bir necha daqiqa cho'zilishi mumkin. Kutayotganda siyosatdagi «[savol]» joylarini o'zingiz yozing: agentga «Siyosatdagi «[savol]» o'rniga shuni yoz: {matn}. Faqat shu joyni o'zgartir.» → yana push.", ru: 'После push лендинг обычно обновляется сам — это может занять несколько минут. Пока ждёте, напишите сами места «[savol]» в политике: агенту «Вместо «[savol]» в политике напиши: {текст}. Меняй только это место.» → снова push.' },
            XATO_GAP
          ] },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: "telefoningizda; har biridan keyin «Ochildi» yoki «Ochilmadi»ni tanlang:", ru: 'на телефоне; после каждой проверки выберите «Открылось» или «Не открылось»:' },
          ichi: tekKarta }
      ]}
      natija={<NatijaA2 />}
      ulgur={{ uz: "Ulgurmasangiz: 2-qadamdan keyin «Davom etish» ochiladi; push va telefonda tekshirish — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Не успеваете: после 2-го шага откроется «Продолжить»; push и проверка на телефоне — домашнее задание ①. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      doneText={() => (hammaOchildi ? { uz: "Oferta va siyosat saytda: to'lovchi ularni to'lashdan oldin ochadi.", ru: 'Оферта и политика на сайте: плательщик открывает их до оплаты.' } : { uz: 'Sahifalar yozildi — saytda ochilishini tugatish qoldi.', ru: 'Страницы написаны — осталось добиться, чтобы они открывались на сайте.' })} />
  );
};

// ===== KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); qolip QKartochka =====
const KARTALAR = [
  { front: { uz: 'Oferta nima?', ru: 'Что такое оферта?' }, back: { uz: 'Hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan', ru: 'Открытое для всех предложение: что даётся, сколько стоит, на каких условиях' }, note: { uz: "O'zbekiston qonunchiligida — ommaviy oferta (369-modda)", ru: 'В законодательстве Узбекистана — публичная оферта (статья 369)' } },
  { front: { uz: "Odam to'lasa, ofertaga nisbatan nima bo'ladi?", ru: 'Что происходит с офертой, если человек платит?' }, back: { uz: "Shu shartlarga rozi bo'ladi", ru: 'Он соглашается с этими условиями' }, note: { uz: "Shuning uchun shartlar to'lashdan oldin ochiq turadi", ru: 'Поэтому условия открыты до оплаты' } },
  { front: { uz: "Mentor misolida to'lov taklifi ekrani qaysi shartlarni aytadi?", ru: 'Какие условия называет экран предложения оплаты в примере Ментора?' }, back: { uz: 'Nima beriladi, narx va muddat', ru: 'Что даётся, цена и срок' }, note: { uz: "Qolgan to'rt savolning javobi ekranda yo'q", ru: 'Ответов на остальные четыре вопроса на экране нет' } },
  { front: { uz: 'Mentor ofertasi qaysi bandlardan iborat?', ru: 'Из каких пунктов состоит оферта Ментора?' }, back: { uz: 'Kim taklif qiladi, nima beriladi, narx va muddat, Pro tugasa, bekor qilish va pulni qaytarish, aloqa', ru: 'Кто предлагает, что даётся, цена и срок, если Pro закончится, отмена и возврат денег, контакты' }, note: { uz: "Kurs shabloni — sizda band nomlari boshqacha bo'lishi mumkin", ru: 'Шаблон курса — у вас названия пунктов могут быть другими' } },
  { front: { uz: 'Bu mashqda qaysi bandlar real ishga tushirishda yoziladi?', ru: 'Какие пункты в этом упражнении пишутся при реальном запуске?' }, back: { uz: 'Kim taklif qiladi, bekor qilish va pulni qaytarish, aloqa', ru: 'Кто предлагает, отмена и возврат денег, контакты' }, note: { uz: 'Ofertada ular kvadrat qavsda turadi', ru: 'В оферте они стоят в квадратных скобках' } },
  { front: { uz: 'Real ishga tushirish uchun nima kerak?', ru: 'Что нужно для реального запуска?' }, back: { uz: 'Ota-onaning yozma roziligi va yuridik shaxs yoki YaTT', ru: 'Письменное согласие родителей и юрлицо или ИП' }, note: { uz: "Yuridik shaxs — ro'yxatdan o'tgan tashkilot, YaTT — yakka tartibdagi tadbirkor; bu kursda emas", ru: 'Юрлицо — зарегистрированная организация, ИП — индивидуальный предприниматель; не в этом курсе' } },
  { front: { uz: "Mentor misolida Pro tugasa, pul o'zi yechiladimi?", ru: 'В примере Ментора, когда Pro закончится, деньги спишутся сами?' }, back: { uz: "Yo'q — Pro o'zi to'xtaydi", ru: 'Нет — Pro сам выключается' }, note: { uz: "Mentor ofertasining «Narx va muddat» bandi", ru: 'Пункт «Цена и срок» в оферте Ментора' } },
  { front: { uz: "Ofertaga va'da yoziladimi?", ru: 'Пишут ли в оферте обещания?' }, back: { uz: "Yo'q — bugun ishlaydigan narsa yoziladi", ru: 'Нет — пишут то, что работает сегодня' }, note: { uz: "«Tez orada», «yaqinda» — ofertada yo'q", ru: '«Скоро», «в ближайшее время» — в оферте нет' } },
  { front: { uz: 'Agent koddan bilmagan joyni qanday belgilaydi?', ru: 'Как агент отмечает место, которое не узнал из кода?' }, back: { uz: '«[savol]» deb qoldiradi', ru: 'Оставляет «[savol]»' }, note: { uz: "Gapni kod va ilovaga qarab o'zingiz yozasiz", ru: 'Фразу пишете сами, глядя в код и приложение' } },
  { front: { uz: 'Mashq ofertasining tepasida va oxirida nima yoziladi?', ru: 'Что пишут вверху и в конце учебной оферты?' }, back: { uz: "«Mashq hujjati — real to'lov qabul qilinmaydi» va «Bu hujjat yuridik maslahat emas.»", ru: '«Учебный документ — реальная оплата не принимается» и «Этот документ — не юридическая консультация.»' }, note: { uz: 'Sahifa mashq ekanini ochiq aytadi', ru: 'Страница открыто говорит, что она учебная' } },
  { front: { uz: "Siyosatdagi to'lov bandi nimani aytadi?", ru: 'О чём говорит пункт об оплате в политике?' }, back: { uz: "Karta so'ralmasligini va mahsulot nimani saqlashini", ru: 'Что карту не запрашивают и что хранит продукт' }, note: { uz: "Mentor misolida: to'lov raqami, hisob, holat, summa, sana va Pro muddati", ru: 'В примере Ментора: номер платежа, аккаунт, статус, сумма, дата и срок Pro' } },
  { front: { uz: "To'lovchi shartlarni qayerdan ochadi?", ru: 'Где плательщик открывает условия?' }, back: { uz: "To'lov taklifi ekranidagi va lendingdagi havoladan", ru: 'По ссылке на экране предложения оплаты и на лендинге' }, note: { uz: "To'lashdan oldin", ru: 'До оплаты' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('st-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="st-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (besh holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
const RECAP_YAKUN = [
  { uz: "Oferta — hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan. Odam to'lasa — shu shartlarga rozi bo'ladi.", ru: 'Оферта — открытое для всех предложение: что даётся, сколько стоит, на каких условиях. Если человек платит — он соглашается с этими условиями.' },
  { uz: "Ofertaga bugun ishlaydigan narsa yoziladi — va'da emas.", ru: 'В оферту пишут то, что работает сегодня, — не обещание.' },
  { uz: "Bu mashqda sotuvchi, pulni qaytarish va aloqa — real ishga tushirishda; real ishga tushirish bu kursda emas.", ru: 'В этом упражнении продавец, возврат денег и контакты — при реальном запуске; реального запуска в этом курсе нет.' },
  { uz: "Agent koddan bilmagan joyni «[savol]» qoldiradi — uni kod va ilovaga qarab o'zingiz yozasiz.", ru: 'То, чего агент не узнал из кода, он оставляет «[savol]» — это вы пишете сами, глядя в код и приложение.' },
  { uz: "Siyosatdagi to'lov bandi karta so'ralmasligini va mahsulot nimani saqlashini aytadi.", ru: 'Пункт об оплате в политике говорит, что карту не запрашивают и что хранит продукт.' }
];
const SARLAVHA = {
  tayyor: { uz: 'Oferta va siyosat saytda — havolalar ishlaydi.', ru: 'Оферта и политика на сайте — ссылки работают.' },
  tekshir: { uz: 'Hujjatlar yozildi — saytda tekshirish qoldi.', ru: 'Документы написаны — осталось проверить на сайте.' },
  a1: { uz: 'Oferta yozildi — siyosat va havolalar qoldi.', ru: 'Оферта написана — остались политика и ссылки.' },
  bandlar: { uz: 'Bandlaringiz tayyor — sahifani yozish qoldi.', ru: 'Пункты готовы — осталось написать страницу.' },
  yoq: { uz: 'Oferta hali yozilmagan — bandlarni uyda yozing.', ru: 'Оферта ещё не написана — напишите пункты дома.' }
};
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z mahsulotingiz", ru: 'ваш продукт' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: 'ikki ish', ru: 'два дела' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BITTA = { uz: 'bitta ish', ru: 'одно дело' }; // ① yashirilganda faqat ② qoladi
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card st-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="st-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="st-hw-q"><span className="st-hw-k">{tr(r.k)}</span><span className="st-hw-v">{tr(i === 1 && qolgan.length === 0 ? HW_BITTA : r.v)}</span></div>)}</div>
    <ol className="st-hw-qadam">
      {qolgan.length > 0 && <li><i>①</i><span>{tr({ uz: 'Darsda qolgan ishni tugating: ', ru: 'Закончите то, что осталось с урока: ' })}{qolgan.map(tr).join(' · ')}.</span></li>}
      <li><i>②</i><span>{tr({ uz: "Bitta tanish odam — ota-onangiz yoki sinfdoshingiz — ofertangizni telefonida ochsin. Undan so'rang: «Qaysi joyi tushunarsiz?» Tushunarsiz gapni soddaroq yozing va push qiling.", ru: 'Пусть один знакомый человек — родители или одноклассник — откроет вашу оферту на телефоне. Спросите его: «Какое место непонятно?» Непонятную фразу напишите проще и сделайте push.' })}</span></li>
    </ol>
    <p className="st-hw-ost">{tr({ uz: "Ofertaga telefoningiz, Telegram nomingiz va karta ma'lumoti yozilmaydi.", ru: 'В оферту не пишутся ваш телефон, имя в Telegram и данные карты.' })}</p>
    {keyingi && <span className="st-hw-keyingi">{keyingi}</span>}
  </div>
);
// Erta tugatgan o'quvchi yo'li (PM-109, SABOQ P4): AI to'lovchi (tashkilotchi) rolida ofertani o'qiydi va savol beradi; o'quvchi tushunarsiz bandni o'zi qayta yozadi (sinfda gemini.google.com)
const aiSorov = (nom) => {
  const h = hujjatOl();
  const bandlar = h ? bandQatorlar(h, nom).join('\n') : MENTOR_QATORLAR().map(tr).join('\n');
  return tr({ uz: "Sen mening mahsulotimga pul to'lamoqchi bo'lgan odamsan. Pastda mahsulotim shartlari (oferta) — bu mashq hujjati, real to'lov qabul qilinmaydi. Avval har bandni o'qib, o'z so'zing bilan ayt: to'lasang, nimaga rozi bo'lasan. Keyin to'lashdan oldin javobini topa olmagan uchta savolingni ber. Bandlarni o'zing qayta yozma — qaysi biri tushunarsizligini ayt, xolos.\n\n", ru: 'Ты — человек, который хочет заплатить за мой продукт. Ниже условия моего продукта (оферта) — это учебный документ, реальная оплата не принимается. Сначала прочитай каждый пункт и своими словами скажи, на что ты соглашаешься, если заплатишь. Потом задай три вопроса, ответы на которые ты не нашёл до оплаты. Сам пункты не переписывай — только скажи, какой непонятен.\n\n' }) + bandlar;
};
const AiDavomCard = ({ nom }) => {
  const [nusxa, setNusxa] = useState(false);
  const sorov = useMemo(() => aiSorov(nom), [nom]);
  const kochir = () => { try { navigator.clipboard.writeText(sorov); setNusxa(true); setTimeout(() => setNusxa(false), 1800); } catch { /* qo'lda belgilab oladi */ } };
  return (
    <div className="card st-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="st-ai-m">{tr({ uz: "gemini.google.com'ni oching va pastdagi so'rovni yuboring — AI to'lovchi bo'lib ofertangizni o'qiydi va savol beradi. Javobi topilmagan bandni «Orqaga» bilan qaytib, o'zingiz qayta yozing.", ru: 'Откройте gemini.google.com и отправьте запрос ниже — AI в роли плательщика прочитает вашу оферту и задаст вопросы. Пункт, на который не нашёлся ответ, вернувшись «Назад», перепишите сами.' })}</p>
      <pre className="st-ai-sorov">{sorov}</pre>
      <button type="button" className="q-chip st-ai-btn" onClick={kochir}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
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
  const h = hujjatOl();
  const nom = (answers[S5_IDX] && answers[S5_IDX].nom) || '';
  const a1 = !!(answers[A1_IDX] && answers[A1_IDX].solved);
  const a2 = !!(answers[A2_IDX] && answers[A2_IDX].solved);
  const savol = !!(h && h.bandlar.some(b => String(b.matn).includes('[savol]')));
  const hav = (h && h.havolalar) || {};
  const ochildi = !!(h && h.chiqdi === true && hav.lending === true && hav.ekran === true);
  const holat = a2 ? (ochildi && !savol ? 'tayyor' : 'tekshir') : a1 ? 'a1' : h ? 'bandlar' : 'yoq';
  const qolgan = [];
  if (!h) qolgan.push({ uz: 'oferta bandlarini yozing', ru: 'напишите пункты оферты' });
  else if (savol) qolgan.push({ uz: '«[savol]» joylarini kod va ilovaga qarab yozing', ru: 'напишите места «[savol]», глядя в код и приложение' });
  if (!a2) qolgan.push({ uz: "siyosatga to'lov bandi va havolalarni qo'shing", ru: 'добавьте в политику пункт об оплате и ссылки' });
  if (!ochildi) qolgan.push({ uz: 'push qilib, telefonda oching', ru: 'сделайте push и откройте на телефоне' });
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: ketayotgan foydalanuvchini qaytarish»</b></>, ru: <>Следующий урок — <b>«Loyiha kuni: ketayotgan foydalanuvchini qaytarish»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cx('st-yakun', holat !== 'tayyor' && 'tiksiz')}>
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
          recap={RECAP_YAKUN.map(tr)}
          uyga={<HwCard qolgan={holat === 'tayyor' ? [] : qolgan} keyingi={keyingi} />}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        >
          {!isMentorL && <AiDavomCard nom={nom} />}
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmTermsLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, ScreenA1, ScreenA2, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI (st-) — faqat qolip tokenlari (D3), emoji yo'q (D4). Izohlarda teskari tirnoq yozilmaydi === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(980px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .st-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: st-puls 2.2s ease-out .3s 3; }
        @keyframes st-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .st-k { display: contents; }
        @media (min-width: 761px) { .st-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        .st-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: st-chorla-v 1.8s ease-out .5s 2; }
        @keyframes st-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .st-bash .q-chip:not(:disabled), .st-chorla > .q-chip:not(:disabled), .st-chorla > .st-tug:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: st-chorla 1.8s ease-out .5s 2; }
        @keyframes st-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .st-k.faol .q-variant:nth-child(2), .st-bash .q-chip:nth-child(2), .st-chorla > :nth-child(2) { animation-delay: .75s; }
        .st-k.faol .q-variant:nth-child(3), .st-bash .q-chip:nth-child(3) { animation-delay: 1s; }
        p.st-bash-ix { margin: 0; font-size: 13px; color: ${T.ink2}; }
        p.st-bash-ix b { color: ${T.ink}; }
        .st-mj { color: ${MAYDON_RANG}; font-weight: 800; white-space: nowrap; }
        .st-uchar { position: fixed; z-index: 1200; pointer-events: none; font: 700 12.5px 'Manrope', sans-serif; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 8px; padding: 3px 8px; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.4); }
        @keyframes st-kir { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
        @keyframes st-yashil { 0% { background: ${T.okFon}; } 100% { background: transparent; } }
        /* telefon */
        .st-telj { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .st-tel-yorliq { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; text-align: center; }
        .st-tel { width: 170px; height: 272px; border-radius: 24px; background: ${T.ink}; padding: 7px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: none; }
        .st-tel-ekran { position: relative; width: 100%; height: 100%; border-radius: 17px; background: ${T.paper}; overflow: hidden; display: flex; flex-direction: column; }
        .st-app-bar { flex: none; display: flex; align-items: center; gap: 6px; padding: 6px 9px; border-bottom: 1px solid ${T.line}; font-size: 12px; }
        .st-orqaga { font-style: normal; color: ${T.ink2}; font-size: 15px; line-height: 1; }
        .st-taklif { flex: 1; min-height: 0; display: flex; flex-direction: column; }
        .st-taklif-t { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; padding: 8px 10px 7px; }
        .st-tk-sar { font-size: 13.5px; font-weight: 800; color: ${T.ink}; line-height: 1.2; overflow-wrap: anywhere; }
        .st-tk-matn { font-size: 11px; line-height: 1.3; color: ${T.ink2}; border-radius: 5px; overflow-wrap: anywhere; transition: background .3s, color .3s; }
        .st-tk-narx { font-size: 12.5px; font-weight: 800; color: ${T.ink}; line-height: 1.25; border-radius: 5px; overflow-wrap: anywhere; transition: background .3s; }
        .st-tk-matn.yon, .st-tk-narx.yon { background: ${T.accentSoft}; color: ${T.ink}; box-shadow: 0 0 0 2px ${fon(T.accent, 0.5)}; }
        .st-tk-tax { align-self: flex-start; font-size: 10px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 0 5px; }
        .st-tk-btn { margin-top: auto; font: 700 11.5px 'Manrope', sans-serif; border-radius: 10px; padding: 7px; background: ${T.accent}; color: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .st-tk-hav { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .st-havola { font: 600 10px 'Manrope', sans-serif; color: ${T.accent}; text-decoration: underline; background: none; border: 0; padding: 0 2px; border-radius: 4px; cursor: default; white-space: nowrap; }
        button.st-havola { cursor: pointer; }
        .st-havola.on { background: ${T.accentSoft}; }
        .st-tk-test { font-size: 10px; color: ${T.ink2}; text-align: center; line-height: 1.2; }
        /* brauzer va shartlar sahifasi */
        .st-br { display: flex; flex-direction: column; min-width: 0; width: 100%; border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.35); overflow: hidden; }
        .st-br-bar { flex: none; display: flex; align-items: center; gap: 6px; padding: 5px 9px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .st-br-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; box-shadow: 12px 0 0 ${T.line}, 24px 0 0 ${T.line}; margin-right: 26px; flex: none; }
        .st-br-bar code { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .st-br-sahifa { padding: 10px 14px 12px; }
        .st-of { display: flex; flex-direction: column; gap: 6px; }
        .st-of-tepa { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 6px; padding: 2px 8px; }
        .st-of-sar { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        ol.st-of-b { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
        ol.st-of-b.ikki { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 14px; }
        ol.st-of-b.ikki { row-gap: 2px; } ol.st-of-b.ikki .st-of-r { padding: 2px 6px; }
        .st-s4-v.tugadi { gap: 8px; } .st-s4-v.tugadi .st-br-sahifa { padding: 8px 14px 10px; }
        .st-of-r { display: flex; flex-direction: column; gap: 1px; padding: 3px 6px; border-radius: 7px; }
        .st-of-r.yangi { animation: st-yashil 1.2s ease; }
        .st-of-nom { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .st-of-m { font-size: 12px; line-height: 1.4; color: ${T.ink}; }
        .st-of-bosh { display: block; height: 6px; border-bottom: 1.5px dashed ${T.line}; margin-right: 30%; } /* bo'sh qator ixcham — 5-ekran boshida brauzer panel ostida qolmasin */
        .st-of-tax { font-style: normal; font-size: 10.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 5px; padding: 0 5px; margin-left: 6px; white-space: nowrap; }
        .st-of-oxiri { font-size: 11.5px; color: ${T.ink2}; border-top: 1px solid ${T.line}; padding-top: 5px; }
        .st-kv { font-style: italic; color: ${T.ink2}; }
        .st-savol { display: inline-block; font-weight: 700; color: ${T.accent}; border: 1.5px dashed ${T.accent}; border-radius: 6px; padding: 0 6px; white-space: nowrap; }
        .st-dum { color: ${T.ink2}; }
        /* varaq */
        .st-varaq { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; min-width: 0; width: 100%; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.35); }
        .st-v-sar { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        .st-v-sar b { font: 800 12px 'Manrope', sans-serif; letter-spacing: .05em; text-transform: uppercase; color: ${T.ink2}; }
        .st-v-hisob { font-style: normal; font: 700 12px 'JetBrains Mono', monospace; color: ${T.accent}; animation: st-kir .4s ease; }
        .st-v-r { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 8px; row-gap: 1px; padding: 6px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; }
        .st-v-r.kul { opacity: .7; }
        .st-v-r.ok { background: ${T.okFon}; border-color: ${fon(T.ok, 0.4)}; }
        .st-v-r.yangi { animation: st-kir .5s ease, st-yashil 1.2s ease; }
        .st-v-nom { grid-column: 1; font: 800 12px 'Manrope', sans-serif; color: ${T.ink}; }
        .st-v-q { grid-column: 1; font-size: 13px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .st-v-iz { font-style: normal; font-size: 11px; color: ${T.ink2}; margin-left: 8px; }
        .st-v-bosh { display: block; height: 14px; border-bottom: 1.5px dashed ${fon(T.accent, 0.5)}; margin-right: 20%; }
        .st-tahrir { grid-column: 2; grid-row: 1 / span 2; align-self: center; width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid ${fon(T.accent, 0.5)}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; font-size: 13px; }
        .st-varaq.ixcham { padding: 9px 11px; gap: 4px; }
        .st-varaq.ixcham .st-v-r { padding: 4px 8px; }
        /* tashkilotchi pufagi va chiziq */
        .st-pufak { display: flex; flex-direction: column; gap: 3px; padding: 9px 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px 14px 14px 4px; box-shadow: 0 8px 18px -12px rgba(${T.shadowBase},0.35); max-width: 260px; }
        .st-pufak-rol { font: 700 10.5px 'JetBrains Mono', monospace; color: ${T.ink2}; }
        .st-pufak-m { font-size: 14px; font-weight: 700; color: ${T.ink}; line-height: 1.3; }
        .st-pufak.tanlandi { border-color: ${T.accent}; animation: st-kir .4s ease; }
        .st-pufak-ost { font-size: 18px; font-weight: 800; color: ${T.accent}; line-height: 1; }
        .st-chiziq { position: relative; flex: 1 1 30px; min-width: 24px; height: 2px; align-self: center; border-top: 2px dashed ${fon(T.accent, 0.5)}; }
        .st-nuqta { position: absolute; top: -6px; left: 0; width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; opacity: 0; }
        .st-nuqta.yur { animation: st-yugur 1s ease-in-out forwards; }
        @keyframes st-yugur { 0% { left: 0; opacity: 1; } 100% { left: calc(100% - 10px); opacity: 1; } }
        /* xulosa qutisi */
        .st-x-n { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; margin-bottom: 4px; }
        .st-x-n.ok { color: ${T.ok}; }
        .st-x-m { display: block; }
        .st-x-iz { display: block; font-size: 12.5px; color: ${T.ink2}; border-top: 1px solid ${fon(T.ok, 0.25)}; margin-top: 6px; padding-top: 5px; }
        .st-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .st-ustoz b { color: ${T.ink}; }
        .st-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .st-ovoz-q { display: grid; grid-template-columns: minmax(0, 1fr) 120px 28px; gap: 8px; align-items: center; font-size: 12.5px; }
        .st-ovoz-y { height: 8px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .st-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width .4s; }
        /* 0, 1-ekran */
        .st-s0-m { display: flex; align-items: center; gap: 14px; }
        .st-sub { display: block; font-weight: 500; font-size: 12.5px; color: ${T.ink2}; text-transform: none; letter-spacing: 0; margin-top: 3px; }
        .st-reja { display: flex; align-items: center; gap: 8px; }
        .st-reja-br { flex: 1 1 220px; transition: opacity .4s, transform .4s; }
        .st-reja-br.yopiq { opacity: .35; transform: translateX(8px); }
        p.st-reja-ost { margin: 6px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        /* 2-ekran */
        .st-s2-v { display: grid; grid-template-columns: auto minmax(0, 300px) minmax(0, 1fr); gap: 18px; align-items: start; }
        .st-s2-v.tugadi { grid-template-columns: auto minmax(0, 1fr); }
        .st-s2-v.tugadi .st-v-r { padding: 4px 10px; }
        .st-s2-tel { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .st-bor-l { display: flex; flex-direction: column; gap: 3px; max-width: 180px; }
        .st-bor-l em { font-style: normal; font-size: 11.5px; color: ${T.ok}; animation: st-kir .4s ease; }
        .st-s2-k, .st-s4-k { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .st-skarta, .st-bkarta { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 10px 22px -14px ${fon(T.accent, 0.5)}; transition: background .25s; }
        .st-skarta.err, .st-bkarta.err { background: ${T.errFon}; }
        .st-skarta.xira, .st-bkarta.xira { opacity: .6; }
        .st-skarta .st-pufak { box-shadow: none; max-width: none; }
        .st-skarta-h { font: 700 11.5px 'JetBrains Mono', monospace; color: ${T.ink2}; }
        .st-bkarta-nom { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        .st-bkarta-s { font-size: 13px; color: ${T.ink2}; }
        .st-tug2 { display: flex; gap: 8px; flex-wrap: wrap; }
        .st-tug { flex: 1 1 120px; font: 700 13.5px 'Manrope', sans-serif; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: background .2s, border-color .2s; }
        .st-tug:hover:not(:disabled) { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .st-tug:disabled { opacity: .5; cursor: not-allowed; }
        .st-tug.silk { animation: st-silk .4s ease; border-color: ${T.err}; }
        @keyframes st-silk { 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
        p.st-ipucha { margin: 0; font-size: 12.5px; color: ${T.ink2}; font-style: italic; }
        /* 4-ekran */
        .st-s4-v { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; align-items: start; }
        @media (min-width: 761px) { .st-s4 .q-split { grid-template-columns: minmax(0, 320px) minmax(0, 1fr); gap: 18px; align-items: start; } }
        .st-s4-v.tugadi { grid-template-columns: minmax(0, 1fr); }
        p.st-halol { margin: 0; font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        /* 3, 8-ekran — javobdan keyingi kichik vizual */
        .st-q-viz { margin-top: 10px; max-width: 420px; }
        .st-sb { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .st-sb-m { font-size: 13px; padding: 4px 8px; border-radius: 8px; border: 1.5px dashed ${T.accent}; transition: border-color .4s; }
        .st-sb-m.tola { border-style: solid; border-color: ${fon(T.ok, 0.6)}; background: ${T.okFon}; }
        /* 5-ekran */
        .st-ms { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 20px; align-items: start; }
        .st-ms.bir, .st-ms.mentor { grid-template-columns: minmax(0, 1fr); }
        .st-ms-tel.ulag .st-tk-narx { box-shadow: 0 0 0 2px ${T.accent}; }
        .st-v-r.yon { border-color: ${T.accent}; box-shadow: 0 0 0 1px ${T.accent}; background: ${T.accentSoft}; }
        .st-ms-o { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .st-karta { display: flex; flex-direction: column; gap: 9px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 12px 26px -16px ${fon(T.accent, 0.5)}; }
        .st-karta-h { font: 700 12px 'JetBrains Mono', monospace; color: ${T.ink2}; }
        .st-in-j { position: relative; display: flex; flex-direction: column; }
        .st-in-n { position: absolute; left: 10px; top: 10px; width: 20px; height: 20px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font: 800 11px 'Manrope', sans-serif; font-style: normal; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .st-in-y { font-style: normal; font-size: 11px; color: ${T.ink2}; margin: 0 0 3px 2px; }
        .st-in { width: 100%; font: 500 14px 'Manrope', sans-serif; color: ${T.ink}; padding: 9px 12px 9px 38px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; resize: vertical; }
        .st-in:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .st-in-j.err .st-in { background: ${T.errFon}; border-color: ${fon(T.err, 0.5)}; }
        .st-in-j:not(:has(.st-in-n)) .st-in { padding-left: 12px; }
        .st-ikki { display: grid; grid-template-columns: minmax(0, 1fr) 110px; gap: 8px; align-items: end; }
        p.st-band-p { margin: 0; font-size: 13px; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; }
        p.st-kul, span.st-kul { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .st-karta-tug { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .st-sp { flex: 1; }
        .st-yordam { flex-basis: 100%; display: flex; flex-direction: column; gap: 4px; padding: 9px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; color: ${T.ink2}; }
        .st-katak { display: inline-flex; gap: 4px; margin-left: 10px; vertical-align: middle; }
        .st-katak i { width: 10px; height: 10px; border-radius: 3px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .st-katak i.on { background: ${T.accent}; border-color: ${T.accent}; }
        .st-katak i.joriy { border-color: ${T.accent}; }
        .st-s5 .q-mustaqil { max-width: none; }
        .st-ms-o { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
        .st-ms-o > .st-varaq.keng { grid-column: 1 / -1; }
        .st-s2, .st-s4, .st-blok { display: flex; flex-direction: column; flex: 1 0 auto; min-height: 0; }
        .st-s2-varaq, .st-s4-br { align-self: start; }
        .st-chiziq.kichik { min-width: 18px; flex-basis: 18px; }
        .st-yordam-btn { flex: none; }
        .st-yordam-s { display: block; }
        .st-ai, .st-hw { display: flex; flex-direction: column; }
        .st-ai-btn { align-self: flex-start; }
        /* bloklar (6, 7-ekran) */
        .st-prompt .st-ps { display: block; }
        .st-joy-n { display: inline-flex; flex-direction: column; font-size: 11.5px; color: ${T.ink2}; font-style: italic; margin-left: 6px; }
        .st-ed { border: 0; background: none; color: ${T.accent}; cursor: pointer; font-size: 14px; margin-left: auto; margin-right: 6px; }
        .st-prompt-ta { width: 100%; font: 12.5px 'JetBrains Mono', monospace; border-radius: 8px; border: 1.5px solid ${T.line}; padding: 8px; }
        .st-band { display: block; margin-top: 6px; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .st-band.kul { color: ${T.ink2}; font-size: 12.5px; }
        .st-band.accent { color: ${T.ink}; background: ${T.accentSoft}; border-radius: 8px; padding: 5px 8px; }
        .st-art { display: inline-block; vertical-align: middle; margin-left: 10px; font: 700 11px 'JetBrains Mono', monospace; color: ${T.ok}; background: ${T.okFon}; border-radius: 99px; padding: 2px 9px; white-space: nowrap; }
        p.st-blok-iz { margin: 6px 0 0; font-size: 12.5px; color: ${T.ink2}; }
        p.st-ortda, p.st-ulgur { margin: 8px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        @media (max-width: 640px) { p.st-ortda .qcode, p.st-ulgur .qcode { white-space: normal; overflow-wrap: anywhere; } } /* 13-Modul sinf-supurish C: uzun buyruq (git clone URL) telefonda o'ng chetdan kesilmaydi */
        .st-nat { display: flex; flex-direction: column; gap: 10px; }
        .st-agent { padding: 9px 12px; border-radius: 12px 12px 12px 4px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .st-agent-h { font: 700 11px 'JetBrains Mono', monospace; color: ${T.ink2}; }
        p.st-agent-m { margin: 3px 0 0; font-size: 12px; line-height: 1.45; color: ${T.ink}; }
        p.st-nat-iz { margin: 0; font-size: 11.5px; color: ${T.ink2}; }
        .st-nat2-r { display: flex; align-items: center; gap: 6px; }
        .st-mini { flex: 1 1 150px; transition: opacity .4s; }
        .st-mini.yopiq { opacity: .35; }
        .st-mini .st-of-sar { font-size: 13px; }
        .st-siy { display: flex; flex-direction: column; gap: 6px; font-size: 11.5px; line-height: 1.45; color: ${T.ink}; }
        .st-siy-sar { font-size: 13px; }
        p.st-siy-q { margin: 0; }
        mark.st-yangi { background: ${T.accentSoft}; color: ${T.ink}; border-radius: 4px; padding: 0 2px; }
        .st-siy-ost { display: flex; gap: 10px; border-top: 1px solid ${T.line}; padding-top: 5px; }
        .st-otahrir { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .st-otahrir-f { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .st-otahrir-f .st-in-j { width: 100%; }
        .st-a2-in { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .st-tek { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .st-tek-k { display: flex; flex-direction: column; gap: 6px; padding: 9px 11px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; }
        .st-tek-k.tanlandi { border-color: ${T.line}; }
        .st-tek-m { font-size: 13px; line-height: 1.45; }
        .st-tek-tug { display: flex; gap: 8px; }
        /* kartochka, yakun */
        .st-flash { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .st-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: st-puls 1.8s ease-out .4s 3; }
        p.st-fc-ipucha { margin: 0; display: flex; align-items: center; gap: 8px; font-size: 13px; color: ${T.ink2}; }
        p.st-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .st-yakun.tiksiz .done-chip .tick { display: none; }
        .st-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 6px 0 10px; }
        .st-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; }
        .st-hw-k { font-size: 11px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .05em; }
        .st-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.st-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        ol.st-hw-qadam li { display: flex; gap: 8px; font-size: 14px; line-height: 1.45; }
        ol.st-hw-qadam i { font-style: normal; color: ${T.accent}; font-weight: 800; }
        p.st-hw-ost { margin: 8px 0 0; font-size: 12.5px; color: ${T.ink2}; }
        .st-hw-keyingi { display: block; margin-top: 8px; font-size: 13.5px; color: ${T.ink}; }
        p.st-ai-m { margin: 4px 0 8px; font-size: 13.5px; line-height: 1.5; }
        pre.st-ai-sorov { margin: 0 0 8px; white-space: pre-wrap; font: 12px/1.5 'JetBrains Mono', monospace; background: ${T.bg}; border-radius: 10px; padding: 10px 12px; max-height: none; }
        @media (max-width: 760px) {
          .st-s0-m { flex-direction: column; }
          .st-reja { flex-direction: column; } .st-chiziq { flex: none; width: 2px; height: 24px; border-top: 0; border-left: 2px dashed ${fon(T.accent, 0.5)}; }
          .st-s2-v, .st-s2-v.tugadi, .st-s4-v, .st-ms, .st-ms-o { grid-template-columns: minmax(0, 1fr); justify-items: stretch; }
          .st-s2-tel, .st-ms-tel { justify-self: center; }
          .st-nat2-r { flex-direction: column; } .st-mini { width: 100%; }
          .st-hw-karta { grid-template-columns: minmax(0, 1fr); }
          ol.st-of-b.ikki { grid-template-columns: minmax(0, 1fr); }
          .st-ovoz-q { grid-template-columns: minmax(0, 1fr) 70px 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .st-halqa, .st-k.faol .q-variant, .st-bash .q-chip, .st-chorla > *, .st-flash.yangi .fc-card .fc-front, .st-v-r.yangi, .st-of-r.yangi, .st-tug.silk, .st-pufak.tanlandi, .st-v-hisob, .st-bor-l em { animation: none !important; }
          .st-nuqta.yur { animation: none; opacity: 0; }
          .st-reja-br, .st-mini { transition: none; }
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
