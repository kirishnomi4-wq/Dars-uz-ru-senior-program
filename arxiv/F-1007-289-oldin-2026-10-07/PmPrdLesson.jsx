import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// YANGI DARS SKELETI — «Namuna dars» (konveyer, 04.10.2026). App.jsx ga ULANMAGAN — faqat nusxa olish uchun.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m9d5-v1', lessonTitle: { uz: "G'oyangiz bir sahifaga sig'adimi?", ru: 'Поместится ли ваша идея на одну страницу?' } };
// 16 ekran (MD v3) · oqim: kirish → reja → tushuncha → test → tushuncha → test → voqea → test → tushuncha → mustaqil (PRD) → juftlik → PRD.md → yakuniy test → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'PRD', ru: 'PRD' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'dalil', ru: 'доказательство' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'qabul', ru: 'принято' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'tuzatish', ru: 'исправление' }, l: 78, tp: 68, s: 13, d: 6.8 }
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
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). To'g'ri javob o'rni (MD): s3 — B · s5 — C · s7 — A · s12 — D.
// prd · tekshiruv · prdmd — amaliyot signali (500+ zona), sentinel -1 (variant yo'q).
const INLINE_KEYS = { s3: 1, s5: 2, s7: 0, s12: 3, prd: -1, tekshiruv: -1, prdmd: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: { title: { uz: 'Dalil — intervyudan sanoq', ru: 'Доказательство — счёт из интервью' }, cards: [
    { ic: '1', h: { uz: "Bu PRD da dalil bo'limiga intervyudan sanoq yoziladi.", ru: 'В этом PRD в раздел «Доказательство» пишут счёт из интервью.' } },
    { ic: '2', h: { uz: 'Har son yonida sharti: nechta odamdan nechtasi.', ru: 'Рядом с каждым числом — условие: у скольких из скольких.' } },
    { ic: '3', h: { uz: "Fikr va taxmin dalil emas — ular bo'lib o'tgan ish emas.", ru: 'Мнение и догадка — не доказательство: это не то, что случилось.' }, ask: { uz: 'Sizning PRD ingizdagi dalil qaysi yozuvlardan keladi?', ru: 'Из каких записей приходит доказательство в вашем PRD?' } }
  ] },
  5: { title: { uz: '«Qilmaymiz» va «Keyin»', ru: '«Не делаем» и «Потом»' }, cards: [
    { ic: '1', h: { uz: "«Keyin»ga yozuvlarda sababi bor ish tushadi: u o'chirilmaydi, navbati suriladi.", ru: 'В «Потом» попадает работа с причиной в записях: её не удаляют, очередь сдвигают.' } },
    { ic: '2', h: { uz: '«Qilmaymiz»ga yozuvlarda sababi topilmagan ish tushadi.', ru: 'В «Не делаем» попадает работа, для которой в записях не нашлось причины.' } },
    { ic: '3', h: { uz: "Yozilmagan ishni quradigan odam o'z taxmini bilan qo'shishi mumkin.", ru: 'Незаписанную работу строящий может добавить по своей догадке.' }, ask: { uz: 'Mahsulotingizda nimani qurmaysiz?', ru: 'Что вы не будете строить в своём продукте?' } }
  ] },
  7: { title: { uz: 'Amazon — hujjat koddan oldin', ru: 'Amazon — документ до кода' }, cards: [
    { ic: '1', h: { uz: "Amazon'da ish press-relizdan boshlanadi — go'yo mahsulot allaqachon chiqqandek.", ru: 'В Amazon работа начинается с пресс-релиза — как будто продукт уже вышел.' } },
    { ic: '2', h: { uz: 'Press-reliz hech kimni qiziqtirmasa, mahsulot qilinmaydi.', ru: 'Если пресс-релиз никого не заинтересует, продукт не делают.' } },
    { ic: '3', h: { uz: "Amazon o'zi ham tor boshlagan: 1995-yilda faqat kitob.", ru: 'Amazon и сам начинал узко: в 1995 году — только книги.' }, ask: { uz: 'PRD ingizda nimani qurmasligingiz qaysi bo\'limda yozilgan?', ru: 'В каком разделе вашего PRD записано, что вы не строите?' } }
  ] },
  12: { title: { uz: 'Qabul yoki tuzatish', ru: 'Принято или исправление' }, cards: [
    { ic: '1', h: { uz: "Uch savol: dalil bormi, bajariladimi, bosh raqam sanaladimi.", ru: 'Три вопроса: есть ли доказательство, выполнимо ли, считается ли главное число.' } },
    { ic: '2', h: { uz: 'Uchalasiga «ha» — qabul.', ru: 'На все три «да» — принято.' } },
    { ic: '3', h: { uz: "Bittasiga «yo'q» — tuzatish, bo'lim nomi bilan.", ru: 'На один «нет» — исправление с названием раздела.' }, ask: { uz: 'Mentor misolida qaysi savolda tuzatish chiqdi?', ru: 'На каком вопросе в примере Ментора вышло исправление?' } }
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

// Testdan keyingi karta (MD: javob topilgach savol ostida; jonli darsda — natija ochilgandan keyin) — ko'rinadigan joyga suriladi
const TestViz = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 650); return () => clearTimeout(t); }, []);
  return <div ref={ref} className="pr-test-viz fade-step">{children}</div>;
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 5-dars «G'oyangiz bir sahifaga sig'adimi?» (MD v3: feedback/F-1005-11modul/05-PmPrd-v3.md, GATE M) =====
// Bitta vizual (163/180): PRD sahifasi PrdSahifa (to'rt katak · to'liq · ixcham) + telefon JamoaTelefon; bitta manba — MENTOR_PRD, BOLIMLAR, TEKSHIRUV_SAVOLLAR va o'quvchi PRD si.
// qolip-maket: pr-qsavol pr-fn-b pr-tahrir pr-nusxa pr-darvoza-b
const cxp = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsOl = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsQoy = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham ekran ishlaydi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Harakatsizlikda bitta ipucha: kalit o'zgarsa sanoq qaytadan
const useIpucha = (faol, kalit, ms = 40000) => {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(false); if (!faol) return undefined; const t = setTimeout(() => setOn(true), ms); return () => clearTimeout(t); }, [faol, kalit, ms]);
  return on;
};
// Son sanab o'sadi (SABOQ 19); kam harakatda — birdan
const useSanab = (son, ms = 90) => {
  const [k, setK] = useState(son);
  useEffect(() => {
    if (k === son) return undefined;
    if (kamHarakat()) { setK(son); return undefined; }
    const t = setTimeout(() => setK(v => v + (son > v ? 1 : -1)), ms);
    return () => clearTimeout(t);
  }, [k, son, ms]);
  return k;
};
// Bir martalik kechikish (ekran almashsa tozalanadi)
const useKechik = () => {
  const ids = useRef([]);
  useEffect(() => () => { ids.current.forEach(clearTimeout); ids.current = []; }, []);
  return useCallback((fn, ms) => { ids.current.push(setTimeout(fn, kamHarakat() ? 0 : ms)); }, []);
};
// Uchish (SABOQ 19, FLIP): bosilgan joyning to'rtburchagi olinadi, yangi joydagi element (data-uch) o'sha nuqtadan o'z joyiga suriladi
const uchibKel = (dan, el, ms) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width; // .lesson-root zoom
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.4, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: 'none', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUch = () => {
  const navbat = useRef([]);
  useLayoutEffect(() => {
    if (!navbat.current.length) return;
    const n = navbat.current; navbat.current = [];
    n.forEach(u => uchibKel(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback((manba, k, ms = 600) => {
    const r = manba && (manba.getBoundingClientRect ? manba.getBoundingClientRect() : manba);
    if (r) navbat.current.push({ r, k, ms });
  }, []);
};
// Bosiladigan joy halqasi (SABOQ 11, 32): accent halqa doim, yengil to'lqin (≤3%, 2.4 s)
const halqa = (on) => (on ? 'pr-halqa' : undefined);
// Ish tugagach (tugadi) ekran tepaga qaytadi — yakuniy natija boshidan ko'rinadi
const useTepaga = (on) => { useEffect(() => { if (!on) return undefined; const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: 0, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 120); return () => clearTimeout(t); }, [on]); };
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="pr-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="pr-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="pr-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};
// 151-qonun: nishon sharti qatori (birinchi urinish)
const NishonQatori = ({ screen }) => {
  const olingan = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || (olingan && olingan.has(ach))) return null;
  const ketdi = am.missed.has(sid);
  return <p className={cxp('pr-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
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
    <div className="pr-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxp('pr-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="pr-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
// Mentor statistikasi (9, 10-ekranlar): o'quvchilar yuborgan ishtirok-signali (500+ zona) bo'yicha ikki son
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
  return <div className="pr-mstat fade-up">{yorliqlar.map((y, i) => <div key={i} className="pr-mstat-q"><b>{sonlar[i]}</b><span>{tr(y)}</span></div>)}</div>;
};

// ----- Brend va nomlar: nom o'z rangida, logotipsiz (SABOQ 2) -----
const MaydonJamoa = () => <span className="pr-mj">Maydon Jamoa</span>;
const Amazon = () => <span className="pr-amazon">Amazon</span>;
const KUL_DALIL = { uz: "10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.", ru: '10 интервью — маленькое число; это доказательство для выбора, а не доказательство истины.' };
const NIMAGA = { uz: 'Nimaga qarang:', ru: 'На что смотреть:' };

// ----- Ma'lumot: yetti bo'lim (BOLIMLAR), Mentor misoli (MENTOR_PRD — tayanch 1.4 aynan), uch savol (TEKSHIRUV_SAVOLLAR — bitta manba, P-063) -----
// savol — bo'lim ustidagi kulrang savol: eski to'rt katak — 8-Modul varag'i savollari, yangi uchtasi — 2-ekrandagi quradigan odamning savollari
const BOLIMLAR = [
  { id: 'muammo', nom: { uz: 'Muammo', ru: 'Проблема' }, savol: { uz: 'Nima qiynayapti?', ru: 'Что мешает?' }, ph: { uz: 'Kim nimadan qiynaladi?', ru: 'Кто от чего страдает?' }, max: 160 },
  { id: 'dalil', nom: { uz: 'Dalil', ru: 'Доказательство' }, savol: { uz: "Bu muammo kimda bo'lgan?", ru: 'У кого была эта проблема?' }, ph: { uz: 'Nechta odamdan nechtasida?', ru: 'У скольких из скольких?' }, max: 200 },
  { id: 'kim', nom: { uz: 'Kim uchun', ru: 'Для кого' }, savol: { uz: 'Aynan kim qiynalyapti?', ru: 'Кто именно страдает?' }, ph: { uz: 'Aynan qanday odamlar?', ru: 'Какие именно люди?' }, max: 140 },
  { id: 'yechim', nom: { uz: 'Yechim', ru: 'Решение' }, savol: { uz: 'Nima quriladi?', ru: 'Что строим?' }, ph: { uz: 'Mahsulot nima qiladi? Bir gap.', ru: 'Что делает продукт? Одной фразой.' }, max: 160 },
  { id: 'funksiyalar', nom: { uz: 'Uchta asosiy funksiya', ru: 'Три основные функции' }, savol: { uz: 'Birinchi nimani quramiz?', ru: 'Что строим первым?' }, max: 40 },
  { id: 'qilmaymiz', nom: { uz: 'Qilmaymiz / Keyin', ru: 'Не делаем / Потом' }, savol: { uz: 'Nimani qurmaymiz?', ru: 'Что не строим?' }, ph: { uz: 'Nimani qurmaysiz?', ru: 'Что не будете строить?' }, max: 120 },
  { id: 'boshRaqam', nom: { uz: 'Bosh raqam', ru: 'Главное число' }, savol: { uz: 'Natijani qaysi sondan bilamiz?', ru: 'По какому числу узнаем результат?' }, ph: { uz: "Qaysi bitta raqam mahsulot ishini ko'rsatadi?", ru: 'Какое одно число показывает работу продукта?' }, max: 120 }
];
const BOL = Object.fromEntries(BOLIMLAR.map((b, i) => [b.id, { ...b, n: i + 1 }]));
const QUTI_NOM = { qilmaymiz: { uz: 'Qilmaymiz', ru: 'Не делаем' }, keyin: { uz: 'Keyin', ru: 'Потом' } };
const F_ELON = { uz: "O'yin e'loni va qo'shilish", ru: 'Объявление об игре и присоединение' };
const F_TASDIQ = { uz: "O'yin kuni tasdiq", ru: 'Подтверждение в день игры' };
const F_NAVBAT = { uz: 'Chiqish va navbat', ru: 'Выход и очередь' };
const F_PUL = { uz: "Maydon pulini bo'lishish", ru: 'Делить плату за поле' };
const ISH_ESLATMA = { uz: "O'yindan oldin eslatma", ru: 'Напоминание перед игрой' };
const ISH_ROYXAT = { uz: "Ro'yxat o'zi yangilanadi", ru: 'Список обновляется сам' };
const MENTOR_PRD = {
  muammo: { uz: "O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.", ru: 'Игроки перед игрой с трудом собирают в команду достаточно людей и не знают, кто точно придёт.' },
  dalil: { uz: "10 intervyu. Jamoa yig'ish bo'yicha 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan; 5 tadan 4 tasi birinchi versiyani sinab ko'rishga kun belgilagan (harakat belgisi).", ru: '10 интервью. По сбору команды: у 4 из 5 игроков на последней игре не хватило людей или кто-то не пришёл; 4 из 5 назначили день, чтобы попробовать первую версию (знак действия).' },
  kim: { uz: "Mahalladagi mini-futbol o'yinchilari: tashkilotchi — o'yinni e'lon qiladi, o'yinchi — o'yinga qo'shiladi.", ru: 'Игроки в мини-футбол из махалли: организатор объявляет игру, игрок присоединяется к игре.' },
  yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' },
  funksiyalar: [F_ELON, F_TASDIQ, F_NAVBAT],
  qilmaymiz: [{ uz: 'chat (Telegram bor)', ru: 'чат (есть Telegram)' }, { uz: 'reyting va baho', ru: 'рейтинг и оценки' }],
  keyin: [{ uz: "o'yindan oldin eslatma", ru: 'напоминание перед игрой' }, { uz: "ro'yxat o'zi yangilanadi", ru: 'список обновляется сам' }, { uz: "maydon pulini bo'lishish", ru: 'делить плату за поле' }],
  boshRaqam: { uz: "Haftada to'lgan o'yinlar — kerakli odam soniga yetgan e'lonlar soni.", ru: 'Заполненные игры за неделю — число объявлений, набравших нужное число людей.' },
  // qoralama (2, 4-ekranlar; tekshiruvdan oldin): 3-funksiya — maydon pulini bo'lishish, «Keyin»da faqat eslatma va ro'yxat
  qoralama: { funksiya3: F_PUL, keyin: 2 }
};
// 8-Moduldagi to'rt katak (2-ekran boshida): Muammo · Kim · Yechim · O'lchov
const TORT_KATAK = [
  { id: 'muammo', nom: { uz: 'Muammo', ru: 'Проблема' }, savol: BOL.muammo.savol, matn: MENTOR_PRD.muammo },
  { id: 'kim', nom: { uz: 'Kim', ru: 'Кто' }, savol: BOL.kim.savol, matn: { uz: "tashkilotchi va o'yinchilar", ru: 'организатор и игроки' } },
  { id: 'yechim', nom: { uz: 'Yechim', ru: 'Решение' }, savol: BOL.yechim.savol, matn: MENTOR_PRD.yechim },
  { id: 'boshRaqam', nom: { uz: "O'lchov", ru: 'Измерение' }, savol: BOL.boshRaqam.savol, matn: { uz: "haftada to'lgan o'yinlar", ru: 'заполненные игры за неделю' } }
];
const TEKSHIRUV_SAVOLLAR = [
  { id: 'dalil', bolim: 'dalil', savol: { uz: 'Dalil bormi?', ru: 'Есть ли доказательство?' }, qarang: { uz: 'Dalil yozuvlardanmi va unda sanoq bormi — nechta odamdan nechtasi?', ru: 'Доказательство из записей и есть ли в нём счёт — у скольких из скольких?' } },
  { id: 'bajar', bolim: 'funksiyalar', savol: { uz: 'Bajariladimi?', ru: 'Выполнимо ли?' }, qarang: { uz: 'har funksiya muammo gapiga xizmat qiladimi va uchalasi shu modulda quriladimi?', ru: 'служит ли каждая функция фразе-проблеме и построятся ли все три в этом модуле?' } },
  { id: 'raqam', bolim: 'boshRaqam', savol: { uz: 'Bosh raqam sanaladimi?', ru: 'Считается ли главное число?' }, qarang: { uz: "bu raqamni har hafta sanab bo'ladimi?", ru: 'можно ли считать это число каждую неделю?' }, qarangO: { uz: 'bu raqamni muntazam — har hafta yoki har oy — sanab bera olasizmi?', ru: 'сможете ли вы считать это число регулярно — каждую неделю или каждый месяц?' } }
];
// «dalil bormi, bajariladimi, bosh raqam sanaladimi» — uch savol bitta manbadan (s8 xulosa, kartochka, recap, yakun)
const tsQator = (sep = ', ') => TEKSHIRUV_SAVOLLAR.map(s => { const t = tr(s.savol).replace('?', ''); return t.charAt(0).toLowerCase() + t.slice(1); }).join(sep);
// Raqamni bir lahza ajratish (dalil: «4 tasida», «4 tasi»; ru — «4 из 5»)
const sonAjrat = (s, on) => {
  if (!on || typeof s !== 'string') return s;
  const b = s.split(/(\d+ tasi(?:da)?|\d+ \u0438\u0437 \d+)/);
  return b.map((x, i) => (i % 2 ? <b key={i} className="pr-son">{x}</b> : x));
};

// ----- O'quvchi PRD si va 4-dars final g'oyasi (tayanch 8 kalitlari aynan) -----
const PRD_KEY = 'pm-m9d5-prd';
const FINAL_KEY = 'pm-m9d4-final';
const BOSH_PRD = { muammo: '', dalil: '', kim: '', yechim: '', funksiyalar: ['', '', ''], qilmaymiz: '', keyin: [''], boshRaqam: '', tekshiruv: null, tuzatish: null };
const prdOl = () => {
  const v = lsOl(PRD_KEY);
  if (!v || typeof v !== 'object') return null;
  const s = (x) => (typeof x === 'string' ? x : '');
  const fn = Array.isArray(v.funksiyalar) ? v.funksiyalar.map(s).concat(['', '', '']).slice(0, 3) : ['', '', ''];
  const ky = Array.isArray(v.keyin) ? v.keyin.map(s).filter(x => x.trim()).slice(0, 3) : [];
  return { muammo: s(v.muammo), dalil: s(v.dalil), kim: s(v.kim), yechim: s(v.yechim), funksiyalar: fn, qilmaymiz: s(v.qilmaymiz), keyin: ky.length ? ky : [''], boshRaqam: s(v.boshRaqam), tekshiruv: v.tekshiruv === 'qabul' || v.tekshiruv === 'tuzatish' ? v.tekshiruv : null, tuzatish: typeof v.tuzatish === 'string' ? v.tuzatish : null };
};
const prdYoz = (p) => lsQoy(PRD_KEY, { muammo: p.muammo, dalil: p.dalil, kim: p.kim, yechim: p.yechim, funksiyalar: p.funksiyalar, qilmaymiz: p.qilmaymiz, keyin: p.keyin.filter(x => x.trim()), boshRaqam: p.boshRaqam, tekshiruv: p.tekshiruv ?? null, tuzatish: p.tuzatish ?? null, savedAt: Date.now() });
// Bo'lim yozilganmi (saqlangan PRD bo'yicha)
const bolimBor = (p, id) => {
  if (!p) return false;
  if (id === 'funksiyalar') return p.funksiyalar.every(x => x.trim());
  if (id === 'qilmaymiz') return !!p.qilmaymiz.trim() && p.keyin.some(x => x.trim());
  return !!String(p[id] || '').trim();
};
const prdSon = (p) => BOLIMLAR.filter(b => bolimBor(p, b.id)).length;
// 4-dars: { goya, final: 'a'|'b', muammoGapi, dalil: { a: { takror, belgi }, b }, yozuvlarSoni: { a, b }, vaqtincha } — kalit yo'q bo'lsa ham ekran ishlaydi
const finalOl = () => {
  const v = lsOl(FINAL_KEY);
  if (!v || typeof v !== 'object') return null;
  const f = v.final === 'b' ? 'b' : 'a';
  const N = v.yozuvlarSoni && v.yozuvlarSoni[f];
  const d = v.dalil && v.dalil[f];
  const sanoq = (x) => (typeof x === 'number' && typeof N === 'number' ? `${x} / ${N}` : (x ?? ''));
  const dalil = d && N != null ? tr({ uz: `${N} intervyu. Muammo takrorlandi: ${sanoq(d.takror)}. Harakat belgisi: ${sanoq(d.belgi)}.`, ru: `${N} интервью. Проблема повторилась: ${sanoq(d.takror)}. Знак действия: ${sanoq(d.belgi)}.` }) : '';
  return { goya: typeof v.goya === 'string' ? v.goya.trim() : '', muammo: typeof v.muammoGapi === 'string' ? v.muammoGapi.trim() : '', dalil, vaqtincha: !!v.vaqtincha };
};
const MENING_NOM = { uz: 'Mening PRD sahifam', ru: 'Моя страница PRD' };
const VAQTINCHA = { uz: 'vaqtincha tanlov', ru: 'временный выбор' };

// ----- Bo'lim tekshiruvi (9, 10-ekran; bo'sh — bloklaydi, qolgani yumshoq: ikkinchi «Saqlash» bilan o'tadi) -----
const TUTUQ_P = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const norm = (s) => String(s || '').toLowerCase().replace(TUTUQ_P, "'").replace(/[«»"“”.!?,;:]+/g, ' ').replace(/\s+/g, ' ').trim();
const XOHISH = /(xohlaydi|xohlardi|yoqadi|yaxshi ko'radi|bo'lsa yaxshi)/;
const HAMMA = ['hamma', 'odamlar', 'hamma odamlar', 'barcha odamlar', 'har kim', 'hamma uchun'];
const SANAB_BOLMAS = /(yoqadi|mamnun|qulay|chiroyli|yaxshi)/;
const tekshirBolim = (id, v) => {
  if (id === 'funksiyalar') {
    if (v.funksiyalar.some(x => !x.trim())) return { tur: 'fbosh', q: true };
    const n = v.funksiyalar.map(norm);
    if (new Set(n).size < n.length) return { tur: 'fbir' };
    return null;
  }
  if (id === 'qilmaymiz') return (!v.qilmaymiz.trim() || !v.keyin.some(x => x.trim())) ? { tur: 'bosh', q: true } : null;
  const s = norm(v[id]);
  if (!s) return { tur: 'bosh', q: true };
  if (id === 'muammo' && XOHISH.test(s)) return { tur: 'xohish' };
  if (id === 'dalil' && !/\d/.test(s)) return { tur: 'raqamsiz' };
  if (id === 'kim' && HAMMA.includes(s)) return { tur: 'hamma' };
  if (id === 'yechim') { const w = s.split(' ').filter(Boolean); if (w.length <= 2 && w.some(x => /^(ilova|sayt|bot|ai)/.test(x))) return { tur: 'nom' }; }
  if (id === 'boshRaqam' && SANAB_BOLMAS.test(s)) return { tur: 'sanab' };
  return null;
};
const XABAR = {
  bosh: { uz: "Bo'lim bo'sh — quradigan odam uni taxmin qiladi.", ru: 'Раздел пуст — тот, кто строит, будет угадывать.' },
  xohish: { uz: "Bu xohish — odam nimadan qiynalgani ko'rinmaydi.", ru: 'Это желание — не видно, от чего страдает человек.' },
  raqamsiz: { uz: "Dalilda son bo'lsin: nechta odamdan nechtasi.", ru: 'Пусть в доказательстве будет число: у скольких из скольких.' },
  hamma: { uz: "Kim uchun aniqroq bo'lsin: qanday odamlar?", ru: 'Для кого — точнее: какие люди?' },
  nom: { uz: 'Mahsulot aynan nima qiladi? Bir gap bilan yozing.', ru: 'Что именно делает продукт? Напишите одной фразой.' },
  fbosh: { uz: 'Uchta funksiyani ham yozing.', ru: 'Напишите все три функции.' },
  fbir: { uz: 'Bu funksiya yuqorida bor — boshqasini yozing.', ru: 'Эта функция уже есть выше — напишите другую.' },
  sanab: { uz: "Buni sanab bo'lmaydi — nima sanalishini yozing.", ru: 'Это нельзя посчитать — напишите, что считается.' }
};
const QOLDIR = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — снова нажмите «Сохранить».' };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const YORDAM_T = { uz: 'Yordam', ru: 'Подсказка' };
const MISOLIDA = { uz: 'Mentor misolida:', ru: 'В примере Ментора:' };
// Yordam qatori — bo'limga qarab bitta qator, Mentor misolidan (A-6 jadvali)
const yordamMatn = (id) => {
  if (id === 'funksiyalar') return MENTOR_PRD.funksiyalar.map(tr).join(' · ');
  if (id === 'qilmaymiz') return `${tr(QUTI_NOM.qilmaymiz)}: ${MENTOR_PRD.qilmaymiz.map(tr).join(' · ')}. ${tr(QUTI_NOM.keyin)}: ${MENTOR_PRD.keyin.map(tr).join(' · ')}.`;
  return tr(MENTOR_PRD[id]);
};

// ----- Telefon «Maydon Jamoa» (≈170×272, chapda, o'lchami barqaror — SABOQ 21, 22): holat muammo (Telegram guruhi) | elon («8 / 10», «Qo'shilaman») -----
const TG_XABAR = [{ k: 'a', t: 'Kim keladi?' }, { k: 'b', t: '+' }, { k: 'c', rasm: true }, { k: 'd', t: '+' }, { k: 'e', rasm: true }, { k: 'b', t: '+' }];
const JamoaTelefon = ({ holat = 'elon', son = 8, bosildi = 0, ostida, className }) => {
  const toldi = son >= 10;
  return (
    <div className={cxp('pr-tel-w', className)}>
      <div className="pr-tel">
        <span className="pr-tel-k" />
        {holat === 'muammo' ? (
          <div className="pr-tel-e tg" key="tg">
            <span className="pr-tg-h">{tr({ uz: 'Telegram guruhi', ru: 'Группа в Telegram' })}</span>
            <div className="pr-tg-ro">{TG_XABAR.map((x, i) => (
              <span key={i} className={cxp('pr-tg-x', `k${x.k}`, x.t === '+' && 'plus', x.rasm && 'rasm')} style={{ '--i': i }}>{x.rasm ? <i aria-hidden="true" /> : x.t}</span>
            ))}</div>
          </div>
        ) : (
          <div className="pr-tel-e" key="elon">
            <span className="pr-tel-bar"><MaydonJamoa /></span>
            <div className={cxp('pr-elon', toldi && 'toldi')}>
              <b className="pr-elon-k">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
              <span className="pr-elon-m">{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span>
              <span className="pr-elon-son" key={son}>{son} / 10{toldi && <em>{tr({ uz: "To'ldi", ru: 'Набрано' })}</em>}</span>
              <span className="pr-elon-y"><i style={{ width: `${son * 10}%` }} /></span>
              <span className={cxp('pr-elon-b', toldi && 'off')} key={`b${bosildi}`} data-bos={bosildi > 0 ? '1' : undefined}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
            </div>
          </div>
        )}
      </div>
      <span className="pr-kul">{tr({ uz: 'chizma — hali qurilmagan', ru: 'набросок — ещё не построено' })}</span>
      {ostida}
    </div>
  );
};

// ----- Uchinchi qism: «Qilmaymiz / Keyin» — 9-Modul MVP doskasi qutilari ko'rinishida («N ta») -----
const QutiSon = ({ son }) => { const k = useSanab(son); return <b className="pr-quti-n" key={k}>{tr({ uz: `${k} ta`, ru: `${k} шт.` })}</b>; };
const Qutilar = ({ qilmaymiz = [], keyin = [], yangi, uchK, bosh }) => (
  <div className="pr-qutilar">
    {[['qilmaymiz', qilmaymiz], ['keyin', keyin]].map(([k, ro]) => (
      <div key={k} className={cxp('pr-quti', k, !ro.length && 'bosh')} data-quti={k}>
        <span className="pr-quti-h"><span>{tr(QUTI_NOM[k])}</span>{!bosh && <QutiSon son={ro.length} />}</span>
        {ro.map((x, i) => <span key={i} className={cxp('pr-quti-ch', yangi === `${k}${i}` && 'yangi')} data-uch={uchK ? `${uchK}-${k}${i}` : undefined}>{x.t || x}{x.osti && <em className="pr-quti-dalil">{x.osti}</em>}</span>)}
      </div>
    ))}
  </div>
);

// ----- PRD sahifasi (163/180): rejim tortKatak | toliq | ixcham; bo'lim holatlari bosh · joriy · yoz · tek · tuz · ok · xira; muhr «Qabul» / «Tuzatish: …» -----
// bolimlar: [{ id, nom, matn, holat, yangiNom, osti, ichi, ung, onTahrir }] (toliq) · ochiq: [id] — qolganlari bitta qatorga yig'iladi
const PrdSahifa = ({ rejim = 'toliq', nom, nomYorliq, bolimlar = [], muhr, ostiYorliq, ostiMatn, ochiq, raqamli = true, sanoq, className, children }) => {
  const yigilgan = (b) => ochiq && !ochiq.includes(b.id);
  const ixSon = sanoq != null ? sanoq : bolimlar.filter(b => String(b.holat || '').split(' ').includes('ok')).length;
  const qatorlar = [];
  if (rejim === 'toliq') bolimlar.forEach((b, i) => {
    if (yigilgan(b)) {
      const oxirgi = qatorlar[qatorlar.length - 1];
      if (oxirgi && oxirgi.yig) oxirgi.ro.push({ b, i }); else qatorlar.push({ yig: true, ro: [{ b, i }] });
    } else qatorlar.push({ b, i });
  });
  return (
    <div className={cxp('pr-sahifa-w', className)}>
      <div className={cxp('pr-sahifa', rejim)}>
        {(nom || muhr) && <div className="pr-sh-h">
          {nom && <span className="pr-sh-nom">{nom}{nomYorliq && <span className="pr-kul">{nomYorliq}</span>}</span>}
          {muhr && <span className={cxp('pr-muhr', muhr.tur)} key={muhr.k || muhr.tur}>{muhr.t}</span>}
        </div>}
        {rejim === 'tortKatak' && <div className="pr-katak-g">{bolimlar.map(b => (
          <div key={b.id} className={cxp('pr-katak', b.holat)}><span className="pr-k-s">{tr(b.savol)}</span><b className="pr-k-n">{tr(b.nom)}</b><p className="pr-k-t">{tr(b.matn)}</p></div>
        ))}</div>}
        {rejim === 'toliq' && <ol className={`pr-bo-ro q${qatorlar.length}`}>{qatorlar.map((q, j) => q.yig
          ? <li key={`y${j}`} className="pr-yig">{q.ro.map(({ b, i }) => <span key={b.id} className={cxp('pr-yig-q', b.holat)}>{raqamli && <i>{i + 1}</i>}{tr(b.nom)}</span>)}</li>
          : <li key={q.b.id} className={cxp('pr-bo', q.b.holat)} data-bolim={q.b.id}>
            <span className="pr-bo-n">{raqamli ? (q.b.n ?? q.i + 1) : ''}</span>
            <div className="pr-bo-b">
              <span className="pr-bo-h"><b className={cxp('pr-bo-nom', q.b.yangiNom && 'yangi')} key={q.b.yangiNom ? 'y' : 'e'}>{tr(q.b.nom)}</b>{q.b.ung}{q.b.onTahrir && <button type="button" className="pr-tahrir" onClick={q.b.onTahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}</span>
              {q.b.matn != null && q.b.matn !== '' && <p className="pr-bo-t">{q.b.matn}</p>}
              {q.b.ichi}
              {q.b.osti}
            </div>
          </li>)}</ol>}
        {rejim === 'ixcham' && <div className="pr-ix">
          <span className="pr-ix-l">PRD · {ixSon} / 7<span className="pr-ix-d" aria-hidden="true"><i style={{ width: `${Math.round(ixSon / 7 * 100)}%` }} /></span></span>
          <div className="pr-ix-ro">{bolimlar.map((b, i) => <span key={b.id} className={cxp('pr-ix-q', b.holat)} data-uch={b.uch}>{b.holat === 'ok' ? <b>✓</b> : <i>{i + 1}</i>}{tr(b.nom)}</span>)}</div>
        </div>}
        {children}
      </div>
      <div className="pr-sahifa-ost">
        <span className="pr-ramka">{tr({ uz: '1 sahifa', ru: '1 страница' })}</span>
        {ostiYorliq && <span className="pr-osti-y fade-step">{ostiYorliq}</span>}
        {ostiMatn && <span className="pr-osti-m fade-step">{ostiMatn}</span>}
      </div>
    </div>
  );
};
// O'quvchi PRD sidan bo'lim matni (to'liq rejim uchun)
const bolimMatn = (p, id) => {
  if (!p) return '';
  if (id === 'funksiyalar') return p.funksiyalar.filter(x => x.trim()).join(' · ');
  if (id === 'qilmaymiz') return '';
  return p[id];
};
const bolimIchi = (p, id) => (id === 'qilmaymiz' && p && (p.qilmaymiz.trim() || p.keyin.some(x => x.trim()))
  ? <Qutilar qilmaymiz={p.qilmaymiz.trim() ? [p.qilmaymiz.trim()] : []} keyin={p.keyin.filter(x => x.trim())} /> : null);
// Mentor misolining to'liq PRD si (8-ekran natijasi): 9, 10-ekranlar mentor rejimida
const mentorBolimlar = () => BOLIMLAR.map(b => ({
  id: b.id, nom: b.nom, holat: 'ok',
  matn: b.id === 'funksiyalar' ? MENTOR_PRD.funksiyalar.map(tr).join(' · ') : b.id === 'qilmaymiz' ? '' : tr(MENTOR_PRD[b.id]),
  ichi: b.id === 'qilmaymiz' ? <Qutilar qilmaymiz={MENTOR_PRD.qilmaymiz.map(tr)} keyin={MENTOR_PRD.keyin.map(tr)} /> : null
}));
// Artefakt-strip «PRD · n/7» (U-042): 10, 11, 15-ekranlar
const PStrip = ({ fayl }) => {
  const n = prdSon(prdOl());
  return (
    <div className="pr-strip fade-up">
      <span className="pr-strip-l">PRD</span>
      <span className="pr-strip-d" aria-hidden="true"><i style={{ width: `${Math.round(n / 7 * 100)}%` }} /></span>
      <span className="pr-strip-n">{n} / 7</span>
      {fayl && <span className="pr-strip-f fade-step">PRD.md ✓</span>}
    </div>
  );
};

// ----- Real ko'rinishdagi odam (SABOQ 36): bosh, soch, ko'z va tabassum, rangli kiyim, qo'lida narsa -----
const ODAM_R = { teri: ['#F1C7A0', '#D49A6C', '#B97A50'], soch: ['#2B1D16', '#6B4226', '#1C1B1E'], kiyim: ['#E2725B', '#3F7FBF', '#E8A33D', '#7A62D1', '#2E9C78', '#D4668C', '#5B8DB8'], shim: '#3A3E5A', oyoq: '#26232C' };
const Odam = ({ x = 0, y = 0, s = 1, k = 0, t = 0, h = 0, uzun, qol, chap }) => {
  const kv = ODAM_R.kiyim[k % ODAM_R.kiyim.length], tv = ODAM_R.teri[t % 3], hv = ODAM_R.soch[h % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${chap ? -s : s} ${s})`}>
      <path d="M-6 -31 L-7 -3" stroke={ODAM_R.shim} strokeWidth="7" strokeLinecap="round" />
      <path d="M5 -31 L6 -3" stroke={ODAM_R.shim} strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="-8" cy="-1.5" rx="6" ry="2.6" fill={ODAM_R.oyoq} />
      <ellipse cx="8" cy="-1.5" rx="6" ry="2.6" fill={ODAM_R.oyoq} />
      <path d="M-12 -29 Q-14 -55 0 -58 Q14 -55 12 -29 Z" fill={kv} />
      <path d="M-11 -51 Q-17 -42 -14 -31" stroke={kv} strokeWidth="6.5" fill="none" strokeLinecap="round" />
      <circle cx="-14" cy="-30" r="3.2" fill={tv} />
      {qol
        ? <><path d="M11 -51 Q19 -46 19 -39" stroke={kv} strokeWidth="6.5" fill="none" strokeLinecap="round" /><circle cx="19" cy="-38" r="3.2" fill={tv} />
          {qol === 'telefon' && <rect x="16" y="-49" width="7" height="12" rx="1.6" fill="#2A2730" />}
          {qol === 'varaq' && <g><rect x="15" y="-52" width="13" height="16" rx="1.2" fill="#FFFFFF" stroke="#C9C2D8" strokeWidth="0.8" /><path d="M17.5 -47 h8 M17.5 -44 h8 M17.5 -41 h5" stroke="#B9B2CC" strokeWidth="1" /></g>}</>
        : <><path d="M11 -51 Q17 -42 14 -31" stroke={kv} strokeWidth="6.5" fill="none" strokeLinecap="round" /><circle cx="14" cy="-30" r="3.2" fill={tv} /></>}
      <rect x="-3" y="-64" width="6" height="7" rx="2" fill={tv} />
      <circle cx="0" cy="-72" r="10" fill={tv} />
      {uzun && <path d="M-10 -74 Q-13 -60 -6 -57 L-7 -70 Z" fill={hv} />}
      <path d="M-10.5 -73 Q-11.5 -86 0 -85.5 Q11.5 -86 10.5 -73 Q5 -80 -10.5 -73 Z" fill={hv} />
      <circle cx="3" cy="-72" r="1.3" fill="#2A2730" />
      <circle cx="7.5" cy="-72" r="1.3" fill="#2A2730" />
      <path d="M3.4 -67.4 Q5.5 -65.2 7.6 -67.4" stroke="#8A4B3A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="9" cy="-68.6" r="1.7" fill="#E8867A" opacity="0.35" />
    </g>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish, sof so'rovnoma J-026: hammaga correct: false, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'gap', t: { uz: "Ha, bitta gapga ham sig'adi", ru: 'Да, поместится даже в одну фразу' } },
  { id: 'sahifa', t: { uz: "Ha, bir sahifaga sig'adi", ru: 'Да, поместится на одну страницу' } },
  { id: 'kop', t: { uz: "Yo'q, bir necha sahifa kerak", ru: 'Нет, нужно несколько страниц' } }
];
// O'tgan darslardan uchta yopiq karta — sahifaga uchib kirib, matnli qatorga aylanadi (bo'lim nomlarisiz — P-036; bo'sh chiziq yo'q — SABOQ 33)
const S0_KARTA = [
  { yorliq: { uz: "g'oya", ru: 'идея' }, matn: { uz: "Jamoa yig'ish: o'yinga odam yetmaydi, kim kelishi noma'lum", ru: 'Сбор команды: на игру не хватает людей, неизвестно, кто придёт' } },
  { yorliq: { uz: '10 yozuv', ru: '10 записей' }, matn: { uz: "5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan", ru: 'У 4 из 5 игроков на последней игре не хватило людей или кто-то не пришёл' } },
  { yorliq: { uz: 'muammo gapi', ru: 'фраза-проблема' }, matn: MENTOR_PRD.muammo }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [uchdi, setUchdi] = useState(storedAnswer ? 3 : 0);
  const r0 = useRef(null), r1 = useRef(null), r2 = useRef(null);
  const refs = [r0, r1, r2];
  const uch = useUch();
  // Tanlovdan keyin: uchta yopiq karta navbat bilan (100 ms) sahifaga uchib kiradi
  useEffect(() => {
    if (picked === null || uchdi >= 3) return undefined;
    if (kamHarakat()) { setUchdi(3); return undefined; }
    const t = setTimeout(() => { uch(refs[uchdi].current, `s0q${uchdi}`, 560); setUchdi(uchdi + 1); }, uchdi === 0 ? 450 : 100);
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
      <div className={cxp('pr-w pr-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>G'oyangiz bir sahifaga <A>sig'adimi?</A></>, ru: <>Поместится ли ваша идея <A>на одну страницу?</A></> })}
          mentor={<Mentor>{tr({ uz: "Final g'oya tanlandi, nomi — Maydon Jamoa. Endi uni quradigan odam o'qiydigan qilib yozish kerak: o'zingizga yaqin javobni belgilang.", ru: 'Финальная идея выбрана, её название — Maydon Jamoa. Теперь её нужно записать так, чтобы её прочитал тот, кто будет строить: отметьте близкий вам ответ.' })}</Mentor>}
          maket={<div className="pr-s0-maket">
            <JamoaTelefon holat="elon" />
            <div className="pr-s0-o">
              <div className="pr-s0-kartalar" aria-hidden={uchdi >= 3}>
                {S0_KARTA.map((k, i) => <span key={i} ref={refs[i]} className={cxp('pr-yk', i < uchdi && 'ketdi')} style={{ '--i': i }}>{tr(k.yorliq)}</span>)}
              </div>
              <PrdSahifa className="pr-s0-sahifa">
                <div className="pr-s0-ro">{S0_KARTA.slice(0, uchdi).map((k, i) => <p key={i} className="pr-s0-q" data-uch={`s0q${i}`}>{tr(k.matn)}</p>)}</div>
              </PrdSahifa>
            </div>
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="pr-javob fade-step">{tr({ uz: "Uchalasi ham bor: yechim bir gapda aytiladi, katta jamoada hujjat bir necha sahifa. Bugun — bir sahifa.", ru: 'Бывает всё три: решение говорится одной фразой, в большой команде документ — на несколько страниц. Сегодня — одна страница.' })}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "Javobni muhokama qilmang — 2-ekran sahifani o'zi to'ldiradi. Sinfdan bir-ikki kishidan so'rang: final g'oyangizni hozir qayerda yozib qo'ygansiz?", ru: 'Не обсуждайте ответ — 2-й экран сам заполнит страницу. Спросите одного-двух учеников: где у вас сейчас записана финальная идея?' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Dars oxirida» — sahifaga Mentor misolining qatorlari navbat bilan yoziladi, oxirida «Qabul» muhri tushadi) =====
const REJA = [
  { t: { uz: "To'rt katakli varaqdan to'liq PRD ga o'tasiz", ru: 'Перейдёте от листа из четырёх клеток к полному PRD' }, teg: { uz: 'PRD', ru: 'PRD' } },
  { t: { uz: 'Nimani qurmaslikni ham yozishni bilib olasiz', ru: 'Научитесь записывать и то, что не будете строить' }, teg: { uz: 'qilmaymiz', ru: 'не делаем' } },
  { t: { uz: <><Amazon /> hujjatni qachon yozishini ko'rasiz</>, ru: <>Увидите, когда <Amazon /> пишет документ</> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: 'PRD yozib, uni uch savol bilan tekshirasiz', ru: 'Напишете PRD и проверите его тремя вопросами' }, teg: { uz: 'tekshiruv', ru: 'проверка' } }
];
const REJA_QATOR = [MENTOR_PRD.muammo, MENTOR_PRD.kim, MENTOR_PRD.yechim, MENTOR_PRD.boshRaqam];
const RejaChizma = () => (
  <PrdSahifa className="pr-rj" nom={<MaydonJamoa />} muhr={{ tur: 'ok kech', t: tr({ uz: 'Qabul', ru: 'Принято' }) }}>
    <div className="pr-rj-ro">{REJA_QATOR.map((q, i) => <p key={i} className="pr-rj-q" style={{ '--i': i }}>{tr(q)}</p>)}</div>
  </PrdSahifa>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun final g'oyangizni <A>bir sahifaga</A> yozasiz.</>, ru: <>Сегодня вы запишете финальную идею <A>на одну страницу</A>.</> })}
      mentor={<Mentor>{tr({ uz: "8-Modulda to'rt katakli varaqni PRD deb atagansiz — mahsulot talablari hujjati (Product Requirements Document). Bugun shu hujjat final g'oyangiz uchun to'liq yoziladi.", ru: 'В 8-м модуле вы назвали лист из четырёх клеток PRD — документ требований к продукту (Product Requirements Document). Сегодня этот документ пишется полностью для вашей финальной идеи.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida: Mentor tekshiruvi va to\'liq PRD', ru: 'В конце урока: проверка Ментора и полный PRD' })}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — TO'RT KATAKDAN YETTI BO'LIMGA (QTushuncha markaziy: bashorat → uch savol-tugma → sahifa va telefon o'zgaradi → atama «to'liq PRD» misoldan keyin) =====
const S2_SAVOL = [
  { k: 'dalil', t: { uz: "Bu muammo kimda bo'lgan?", ru: 'У кого была эта проблема?' } },
  { k: 'funksiyalar', t: { uz: 'Birinchi nimani quramiz?', ru: 'Что строим первым?' } },
  { k: 'qilmaymiz', t: { uz: 'Nimani qurmaymiz?', ru: 'Что не строим?' } }
];
const S2_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const S2_BASH = { uz: "To'rt katakka yana nechta bo'lim kerak?", ru: 'Сколько ещё разделов нужно к четырём клеткам?' };
const TAXMININGIZ = { uz: 'Taxminingiz', ru: 'Ваше предположение' };
const HAQIQATDA = { uz: 'haqiqatda', ru: 'на деле' };
const TOGRI_CHIQDI = { uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' };
const BashQator = ({ savol, javob }) => <div className="pr-bashq fade-step"><span>{savol}</span><span className="pr-bashq-t">{tr(TAXMININGIZ)}: <b>{javob}</b></span></div>;
const TaxQator = ({ togri, javob, haqiqat }) => <span className={cxp('pr-tx', togri && 'ok')}>{togri ? <>{tr(TOGRI_CHIQDI)} <b>✓</b></> : <>{tr(TAXMININGIZ)}: {javob} · {tr(HAQIQATDA)}: <b>{haqiqat}</b></>}</span>;
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [nomlar, setNomlar] = useState(!!storedAnswer);
  const [bosildi, setBosildi] = useState(storedAnswer ? 1 : 0);
  const kech = useKechik();
  const done = nomlar;
  const tugadi = useTugadi(done, 2600, !!storedAnswer);
  useTepaga(tugadi && !storedAnswer);
  const ipucha = useIpucha(!!taxmin && q < 3, q);
  useEffect(() => { if (q === 3 && !nomlar) kech(() => setNomlar(true), 1100); }, [q]); // eslint-disable-line
  // 2-savol: telefon e'lon holatiga qaytadi, «Qo'shilaman» bir marta o'zi bosiladi — «8 / 10» → «9 / 10»
  useEffect(() => { if (q >= 2 && !bosildi) kech(() => setBosildi(1), 900); }, [q]); // eslint-disable-line
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // Navbatdagi savol-tugma ko'rinadigan joyda tursin (SABOQ 34)
  useEffect(() => { if (!taxmin || q > 2) return undefined; const t = setTimeout(() => { const el = document.querySelector('.lesson-root .pr-qsavol.pr-halqa'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 700); return () => clearTimeout(t); }, [q, taxmin]);
  const yangiNom = nomlar && !storedAnswer;
  const bolimlar = q === 0 ? TORT_KATAK : [
    { id: 'muammo', nom: BOL.muammo.nom, matn: tr(MENTOR_PRD.muammo) },
    { id: 'dalil', nom: BOL.dalil.nom, holat: q === 1 ? 'yoz' : '', matn: sonAjrat(tr(MENTOR_PRD.dalil), q === 1), osti: <span className="pr-kul">{tr(KUL_DALIL)}</span> },
    { id: 'kim', nom: nomlar ? BOL.kim.nom : TORT_KATAK[1].nom, yangiNom, matn: tr(nomlar ? MENTOR_PRD.kim : TORT_KATAK[1].matn) },
    { id: 'yechim', nom: BOL.yechim.nom, matn: tr(MENTOR_PRD.yechim) },
    ...(q >= 2 ? [{ id: 'funksiyalar', nom: BOL.funksiyalar.nom, holat: q === 2 ? 'yoz' : '', ichi: <ol className="pr-fn-ro">{[F_ELON, F_TASDIQ, MENTOR_PRD.qoralama.funksiya3].map((f, i) => <li key={i} className={cxp('pr-fn', q === 2 && 'kir')} style={{ '--i': i }}><span>{tr(f)}</span></li>)}</ol> }] : []),
    ...(q >= 3 ? [{ id: 'qilmaymiz', nom: BOL.qilmaymiz.nom, holat: !nomlar ? 'yoz' : '', ichi: <Qutilar bosh /> }] : []),
    { id: 'boshRaqam', nom: nomlar ? BOL.boshRaqam.nom : TORT_KATAK[3].nom, yangiNom, matn: tr(nomlar ? MENTOR_PRD.boshRaqam : TORT_KATAK[3].matn) }
  ];
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  // Xulosa (taxmin qatori — birinchi qatori, SABOQ 25): kompyuterda telefon ostida, telefon kengligida — sahifa ostida (yakuniy holat 1280×800 ga sig'adi)
  const s2Xulosa = done && <QXulosa>{tx && <TaxQator togri={taxmin === '3'} javob={tx.t} haqiqat="3" />}{tr({ uz: "Bizda to'liq PRD — g'oyaning yetti bo'limli bir sahifasi.", ru: 'У нас полный PRD — одна страница идеи из семи разделов.' })}</QXulosa>;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · to'liq PRD", ru: 'Понятие · полный PRD' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni bosing', ru: 'Нажмите на вопросы' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>To'rt katakka yana <A>qaysi bo'limlar</A> qo'shiladi?</>, ru: <>Какие <A>разделы</A> добавятся к четырём клеткам?</> })}
        mentor={<Mentor>{tr({ uz: "Varaqni o'qib, qurishni boshlagan odam beradigan savollarni birma-bir bosing.", ru: 'Нажимайте по одному вопросы, которые задаёт человек, прочитавший лист и начавший строить.' })}</Mentor>}
        bashorat={!taxmin
          ? <div className="pr-bash pr-guruh-w"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_BASH)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <BashQator savol={tr(S2_BASH)} javob={tx.t} />}
        vizual={<div className={cxp('pr-s2', tugadi && 'tinch')}>
          <div className="pr-chap">
            <JamoaTelefon holat={q === 1 ? 'muammo' : 'elon'} son={bosildi ? 9 : 8} bosildi={bosildi}
              ostida={q >= 3 && <span className="pr-kul pr-tel-izoh fade-step">{tr({ uz: "chat yo'q — Telegram bor", ru: 'чата нет — есть Telegram' })}</span>} />
            {s2Xulosa && <div className="pr-xul-chap">{s2Xulosa}</div>}
          </div>
          <div className="pr-s2-o">
            <PrdSahifa rejim={q === 0 ? 'tortKatak' : 'toliq'} nom={<MaydonJamoa />} bolimlar={bolimlar} raqamli={nomlar}
              ostiYorliq={nomlar && tr({ uz: "to'liq PRD", ru: 'полный PRD' })} />
            {!tugadi && <div className="pr-s2-sav">{S2_SAVOL.map((s, i) => {
              const faol = !!taxmin && i === q;
              return <button key={s.k} type="button" className={cxp('pr-qsavol', i < q && 'ok', halqa(faol))} disabled={!faol} onClick={() => setQ(i + 1)}>{i < q && <b>✓</b>}{tr(s.t)}</button>;
            })}</div>}
            {nomlar && <QIzoh>{tr({ uz: "To'rt katakka uch bo'lim qo'shildi — yetti bo'limli bu sahifa to'liq PRD deyiladi.", ru: 'К четырём клеткам добавились три раздела — эту страницу из семи разделов называют полным PRD.' })}</QIzoh>}
            {s2Xulosa && <div className="pr-xul-ost">{s2Xulosa}</div>}
          </div>
        </div>}
        natija={!done && ipucha && <QIzoh>{tr({ uz: "Sahifa ostidagi yoqilgan savolni bosing — sahifada nima qo'shilishini ko'ring.", ru: 'Нажмите активный вопрос под страницей — посмотрите, что добавится на странице.' })}</QIzoh>}
      />
      <MentorNote>{tr({ uz: "8-Modulda (basseyn ilovasi) PRD to'rt katak edi — eslating. «O'lchov» katagi endi bosh raqam: mahsulot o'z ishini bajarganini ko'rsatadigan bitta raqam. Uchinchi funksiya hozircha qoralama — 8-ekranda tekshiruv uni o'zgartiradi; buni oldindan aytmang.", ru: 'В 8-м модуле (приложение бассейна) PRD был из четырёх клеток — напомните. Клетка «Измерение» теперь — главное число: одно число, которое показывает, что продукт делает свою работу. Третья функция пока черновик — на 8-м экране проверка её изменит; не говорите об этом заранее.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s3 = 1; ikkinchi olam — to'garaklar, P-002) =====
const S3_OPTS = [
  { uz: 'Mahallada yaqinda 2 ta yangi to\'garak ochildi', ru: 'В махалле недавно открылись 2 новых кружка' },
  { uz: "5 kishidan 3 tasi to'garak topishda qiynalgan", ru: 'У 3 из 5 человек были трудности с поиском кружка' },
  { uz: "O'smirlar xaritani ishlatsa kerak, deb o'ylayman", ru: 'Думаю, подростки, наверное, будут пользоваться картой' },
  { uz: "To'garaklar xaritasi va jadvalini ko'rsatadi", ru: 'Показывает карту и расписание кружков' }
];
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · dalil', ru: 'Проверка · доказательство' })}
    questionText="To'garaklar PRD sida Dalil bo'limiga qaysi qator yoziladi?"
    question={tr({ uz: <h2 className="title h-ask">To'garaklar PRD sida <A>Dalil bo'limiga</A> qaysi qator yoziladi?</h2>, ru: <h2 className="title h-ask">Какая строка пишется в <A>раздел «Доказательство»</A> PRD кружков?</h2> })}
    options={S3_OPTS} correctIdx={1}
    explainCorrect={{ uz: "Bu PRD da dalil — intervyudan sanoq: nechta odamdan nechtasida muammo bo'lgan.", ru: 'В этом PRD доказательство — счёт из интервью: у скольких из скольких была проблема.' }}
    explainWrong={{
      0: { uz: "To'garaklar haqida rost gap, lekin kim qiynalgani yo'q.", ru: 'Правда о кружках, но нет того, кто страдал.' },
      2: { uz: "Bu taxmin — intervyuda bo'lib o'tgan ish emas.", ru: 'Это догадка — не то, что случилось в интервью.' },
      3: { uz: "Bu — yechim bo'limining qatori.", ru: 'Это строка раздела «Решение».' },
      default: { uz: 'Dalil intervyudan keladi: unda nima sanalgan?', ru: 'Доказательство приходит из интервью: что в нём посчитано?' }
    }}
    vizual={<PrdSahifa className="kichik" nom={tr({ uz: "Mahalla to'garaklari", ru: 'Кружки махалли' })} bolimlar={[
      { id: 'muammo', nom: BOL.muammo.nom, matn: tr({ uz: "qaysi to'garak qayerda va qachon — bilinmaydi", ru: 'какой кружок где и когда — неизвестно' }) },
      { id: 'dalil', nom: BOL.dalil.nom, holat: 'tek', matn: tr(S3_OPTS[1]) }
    ]} />} />
);

// ===== SCREEN 4 — QILMAYMIZ VA KEYIN (QTushuncha ketma-ket, 4 ish; SABOQ 9/13): chapda sahifa (5, 6-bo'limlar ochiq) · o'ngda bitta katta ish kartasi =====
const S4_ISHLAR = [
  { qadam: { uz: 'Chat', ru: 'Чат' }, nom: { uz: 'Chat', ru: 'Чат' }, togri: 'qilmaymiz', sabab: { uz: "Telegram allaqachon bor: qiyinchilik chat yo'qligida emas, kim kelishi bilinmasligida.", ru: 'Telegram уже есть: трудность не в отсутствии чата, а в том, что неизвестно, кто придёт.' } },
  { qadam: { uz: 'Eslatma', ru: 'Напоминание' }, nom: ISH_ESLATMA, togri: 'keyin', sabab: { uz: "2-yozuv: «ikki kishi oxirgi daqiqada kelmadi».", ru: 'Запись 2: «два человека не пришли в последнюю минуту».' } },
  { qadam: { uz: 'Reyting', ru: 'Рейтинг' }, nom: { uz: 'Reyting va baho', ru: 'Рейтинг и оценки' }, togri: 'qilmaymiz', sabab: { uz: "O'n yozuvda baho haqida gap yo'q.", ru: 'В десяти записях нет речи об оценках.' } },
  { qadam: { uz: "Ro'yxat", ru: 'Список' }, nom: ISH_ROYXAT, togri: 'keyin', sabab: { uz: "5-yozuv: «kim kelishini bilmadi» — ro'yxat ochiq turganda ham yangi qo'shilganlar ko'rinsin.", ru: 'Запись 5: «не знал, кто придёт» — пусть новые присоединившиеся видны, даже когда список открыт.' } }
];
const S4_XATO = {
  keyin: { uz: "O'n yozuvda bunga sabab topilmadi.", ru: 'В десяти записях для этого не нашлось причины.' },
  qilmaymiz: { uz: "Yozuvlarda bunga sabab bor — o'chirmang, navbatini suring.", ru: 'В записях есть причина — не удаляйте, сдвиньте очередь.' }
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [i, setI] = useState(storedAnswer ? 4 : 0);
  const [joy, setJoy] = useState(storedAnswer ? S4_ISHLAR.map(x => x.togri) : []);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [sabab, setSabab] = useState(null);
  const [yangi, setYangi] = useState(null);
  const [izoh, setIzoh] = useState(!!storedAnswer);
  const kartaRef = useRef(null);
  const uch = useUch();
  const kech = useKechik();
  const done = i >= 4;
  const tugadi = useTugadi(done && izoh, 2800, !!storedAnswer);
  useTepaga(tugadi && !storedAnswer);
  useEffect(() => { if (done && !izoh) kech(() => setIzoh(true), 1000); }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, solved: true }); }, [done]); // eslint-disable-line
  const tanla = (quti) => {
    if (done) return;
    const ish = S4_ISHLAR[i];
    if (quti !== ish.togri) { setXato({ k: quti, kk: Date.now() }); setYordam(true); if (achMiss) achMiss.miss(screen); return; }
    setXato(null);
    const n = joy.filter(j => j === quti).length;
    uch(kartaRef.current, `s4-${quti}${n}`, 640);
    setJoy([...joy, quti]); setSabab(i); setYangi(`${quti}${n}`); setI(i + 1);
  };
  // 4/4 dan keyin «Keyin» qutisi: tartib — joylangan tartibda
  const ochiqQuti = { qilmaymiz: [], keyin: [] };
  joy.forEach((k, j) => ochiqQuti[k].push(tr(S4_ISHLAR[j].nom)));
  const bolimlar = BOLIMLAR.map(b => {
    if (b.id === 'funksiyalar') return { id: b.id, nom: b.nom, holat: izoh && !tugadi ? 'tek' : '', ichi: <ol className="pr-fn-ro">{[F_ELON, F_TASDIQ, MENTOR_PRD.qoralama.funksiya3].map((f, j) => <li key={j} className="pr-fn"><span>{tr(f)}</span></li>)}</ol>,
      osti: izoh && <QIzoh>{tr({ uz: "Uchta asosiy funksiya — 9-Moduldagi «Qilamiz» qutisi: busiz muammo hal bo'lmaydi.", ru: 'Три основные функции — коробка «Делаем» из 9-го модуля: без них проблема не решится.' })}</QIzoh> };
    if (b.id === 'qilmaymiz') return { id: b.id, nom: b.nom, ichi: <Qutilar qilmaymiz={ochiqQuti.qilmaymiz} keyin={ochiqQuti.keyin} yangi={yangi} uchK="s4" /> };
    return { id: b.id, nom: b.nom };
  });
  const ish = !done ? S4_ISHLAR[i] : null;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Qilmaymiz / Keyin', ru: 'Понятие · Не делаем / Потом' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Ishlarni joylang', ru: 'Разложите работы' })} (${i}/4)`} onClick={onNext} /></>}>
      <div className="pr-w pr-ong">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>Qurilmaydigan ish ham <A>PRD ga yoziladimi?</A></>, ru: <>Пишут ли в PRD <A>и то, что не будут строить?</A></> })}
          mentor={<Mentor>{tr({ uz: "Mentor o'ylagan to'rtta qo'shimcha ishni birma-bir joylang: yozuvlarda sababi bor ishni «Keyin»ga, sababi yo'q ishni «Qilmaymiz»ga.", ru: 'Разложите по одной четыре дополнительные работы, которые придумал Ментор: работу с причиной в записях — в «Потом», без причины — в «Не делаем».' })}</Mentor>}
          harakat={!done && <div className="pr-s4-h">
            <div className="pr-qq"><QQadamlar qadamlar={S4_ISHLAR.map(x => tr(x.qadam))} joriy={i} /></div>
            <div className={cxp('pr-ish', xato && 'silk')} key={xato ? `x${xato.kk}` : `i${i}`} ref={kartaRef}>
              <span className="pr-ish-l">{tr({ uz: "Qo'shimcha ish", ru: 'Дополнительная работа' })} · {i + 1}/4</span>
              <b className="pr-ish-n">{tr(ish.nom)}</b>
            </div>
            <div className="pr-guruh pr-s4-b">
              <QTugma ikkinchi onClick={() => tanla('qilmaymiz')}>{tr(QUTI_NOM.qilmaymiz)}</QTugma>
              <QTugma ikkinchi onClick={() => tanla('keyin')}>{tr(QUTI_NOM.keyin)}</QTugma>
            </div>
            {xato && <QXato>{tr(S4_XATO[xato.k])}</QXato>}
            {sabab !== null && <p className="pr-sabab" key={`s${sabab}`}>{tr(S4_ISHLAR[sabab].sabab)}</p>}
            {yordam && <QIzoh>{tr({ uz: "«Keyin» — o'chirilmaydi, navbati suriladi: yozuvlarda sababi bor. «Qilmaymiz» — yozuvlarda sababi topilmagan ish.", ru: '«Потом» — не удаляется, очередь сдвигается: в записях есть причина. «Не делаем» — работа, для которой в записях не нашлось причины.' })}</QIzoh>}
            <NishonQatori screen={screen} />
          </div>}
          vizual={<PrdSahifa nom={<MaydonJamoa />} bolimlar={bolimlar} ochiq={['funksiyalar', 'qilmaymiz']} className="pr-s4-s" />}
          natija={done && sabab !== null && !tugadi && <p className="pr-sabab" key={`s${sabab}`}>{tr(S4_ISHLAR[sabab].sabab)}</p>}
          xulosa={done && izoh && tr({ uz: "Bu misolda qo'shimcha ishlardan «Keyin»ga yozuvlarda sababi borlari, «Qilmaymiz»ga sababsizlari tushdi.", ru: 'В этом примере из дополнительных работ в «Потом» попали те, у которых есть причина в записях, в «Не делаем» — без причины.' })}
        />
      </div>
      <MentorNote>{tr({ uz: "9-Modulda o'quvchilar aynan shu uch qutini to'ldirgan (Qilamiz · Keyin · Qilmaymiz) — PRD da ular 5 va 6-bo'lim. Sinfdan so'rang: «Qilmaymiz» yozilmasa, quradigan odam chat qo'shadimi? (8-Modul qoidasi: bo'sh qolgan joyni quradigan odam o'z taxmini bilan to'ldiradi.) Bu qoida qo'shimcha ishlar uchun: kirish, xavfsizlik kabi zarur ishlar intervyuda aytilmasa ham quriladi.", ru: 'В 9-м модуле ученики заполняли именно эти три коробки (Делаем · Потом · Не делаем) — в PRD это 5-й и 6-й разделы. Спросите класс: если не написать «Не делаем», добавит ли строящий чат? (Правило 8-го модуля: пустое место строящий заполняет своей догадкой.) Это правило — для дополнительных работ: нужные работы вроде входа и безопасности строятся, даже если о них не сказали в интервью.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ C, INLINE_KEYS.s5 = 2; ikkinchi olam — uy vazifalari, P-002) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Qilmaymiz yoki Keyin', ru: 'Проверка · Не делаем или Потом' })}
    questionText="Uy vazifasi ilovasi: intervyularda reyting haqida hech kim gapirmadi. Qayerga yoziladi?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifasi ilovasi: intervyularda reyting haqida hech kim gapirmadi. <A>Qayerga yoziladi?</A></h2>, ru: <h2 className="title h-ask">Приложение для домашних заданий: в интервью о рейтинге никто не говорил. <A>Куда это записать?</A></h2> })}
    options={[
      { uz: 'Asosiy funksiyalarga — u ilovani qiziq qiladi', ru: 'В основные функции — он делает приложение интересным' },
      { uz: "«Keyin»ga — kelajakda kerak bo'lib qolishi mumkin", ru: 'В «Потом» — в будущем может понадобиться' },
      { uz: "«Qilmaymiz»ga — uni qurish uchun sabab topilmadi", ru: 'В «Не делаем» — причины его строить не нашлось' },
      { uz: "Bosh raqamga — reytingni har hafta sanasa bo'ladi", ru: 'В главное число — рейтинг можно считать каждую неделю' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Yozuvlarda sababi yo'q ish «Qilmaymiz»ga yoziladi.", ru: 'Работа без причины в записях пишется в «Не делаем».' }}
    explainWrong={{
      0: { uz: "Asosiy funksiyaga busiz muammo hal bo'lmaydigan ish kiradi.", ru: 'В основные функции входит работа, без которой проблема не решится.' },
      1: { uz: '«Keyin»ga yozuvlarda sababi bor ish tushadi.', ru: 'В «Потом» попадает работа, у которой есть причина в записях.' },
      3: { uz: "Bosh raqam mahsulot o'z ishini bajarganini sanaydi.", ru: 'Главное число считает, что продукт сделал свою работу.' },
      default: { uz: "Yozuvlarda bu ishga sabab bormi — shuni eslang.", ru: 'Есть ли в записях причина для этой работы — вспомните это.' }
    }}
    vizual={<PrdSahifa className="kichik" nom={tr({ uz: 'Sinf uy vazifalari', ru: 'Домашние задания класса' })} bolimlar={[
      { id: 'qilmaymiz', n: 6, nom: BOL.qilmaymiz.nom, ichi: <Qutilar qilmaymiz={[tr({ uz: 'reyting', ru: 'рейтинг' })]} keyin={[]} yangi="qilmaymiz0" /> }
    ]} />} />
);

// ===== SCREEN 6 — AMAZON (QVoqea, PM keys K16; SABOQ 2, 3, 8, 26): sahna + nuqtalar qatori + bashorat; bosqich gapi Mentorda =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K16 (bank: raqamsiz; 1995 — yil) · tayanch 5. «Press-reliz — … xabar» — atama izohi. Bankda yo'q narsa chizilmaydi.
const AMAZON_BOSQICH = [
  { h: { uz: 'Press-reliz', ru: 'Пресс-релиз' }, m: { uz: "Amazon'da yangi mahsulot uchun bitta matn yoziladi — press-reliz. Press-reliz — kompaniya yangi mahsulot chiqqani haqida yozadigan xabar.", ru: 'В Amazon для нового продукта пишут один текст — пресс-релиз. Пресс-релиз — сообщение компании о том, что вышел новый продукт.' } },
  { h: { uz: "Go'yo chiqqandek", ru: 'Как будто уже вышел' }, m: { uz: "Press-reliz go'yo mahsulot allaqachon chiqqandek yoziladi, kod esa hali yo'q. Press-reliz hech kimni qiziqtirmasa, mahsulot qilinmaydi.", ru: 'Пресс-релиз пишут так, будто продукт уже вышел, а кода ещё нет. Если пресс-релиз никого не заинтересует, продукт не делают.' } },
  { h: { uz: 'Tor boshlash', ru: 'Узкий старт' }, m: { uz: "Amazon o'zi ham tor boshlagan: 1995-yilda u faqat kitob sotgan.", ru: 'Amazon и сам начинал узко: в 1995 году он продавал только книги.' } }
];
const AM_TAXMIN = [
  { k: 'keyin', t: { uz: 'Kod tugagach', ru: 'Когда код готов' } },
  { k: 'birga', t: { uz: 'Kod bilan birga', ru: 'Вместе с кодом' } },
  { k: 'oldin', ok: true, t: { uz: 'Koddan oldin', ru: 'До кода' } }
];
const AM_SAVOL = { uz: 'Bu press-reliz qachon yoziladi?', ru: 'Когда пишется этот пресс-релиз?' };
const AM_KITOB = ['#C0504D', '#4F81BD', '#9BBB59', '#8064A2', '#F79646', '#4BACC6', '#D9A13B'];
const ReliZQator = ({ y, w, i, toliq }) => <rect className={cxp('am-q', toliq && 'toliq')} x="326" y={y} width={w} height="7" rx="3.5" style={{ '--i': i }} />;
const RELIZ_Q = [[58, 172], [76, 150], [94, 166], [112, 120], [130, 170], [148, 140], [166, 96]];
const BrauzerUst = ({ x, y, w, yil }) => (
  <g>
    <path d={`M${x} ${y + 8} a8 8 0 0 1 8 -8 h${w - 16} a8 8 0 0 1 8 8 v18 h${-w} z`} fill="#232F3E" />
    {['#FF6159', '#FFBD2E', '#28C840'].map((c, i) => <circle key={c} cx={x + 13 + i * 10} cy={y + 13} r="3" fill={c} />)}
    <text x={x + w / 2} y={y + 17.5} textAnchor="middle" className="am-nom">Amazon{yil && <tspan className="am-yil"> · 1995</tspan>}</text>
  </g>
);
const AmazonSahna = ({ b }) => (
  <svg className={cxp('am-sahna', `b${b}`)} viewBox="0 0 560 232" role="img" aria-label={tr(AMAZON_BOSQICH[b].h)} key={b}>
    <rect width="560" height="232" rx="10" fill="#F4F1EA" />
    {b === 0 && <g>
      <g className="am-kir" style={{ '--i': 0 }}>
        <rect x="18" y="16" width="250" height="160" rx="8" fill="#FFFFFF" stroke="#D9D3C7" />
        <BrauzerUst x={18} y={16} w={250} />
        <rect x="34" y="56" width="218" height="104" rx="6" fill="#ECE8DF" stroke="#CFC8BA" strokeDasharray="5 4" />
        <text x="143" y="112" textAnchor="middle" className="am-kul">{tr({ uz: "mahsulot hali yo'q", ru: 'продукта ещё нет' })}</text>
      </g>
      <g className="am-kir" style={{ '--i': 1 }}>
        <rect x="310" y="12" width="214" height="200" rx="4" fill="#FFFFFF" stroke="#D9D3C7" />
        <text x="326" y="40" className="am-sar">{tr({ uz: 'Press-reliz', ru: 'Пресс-релиз' })}</text>
        {RELIZ_Q.slice(0, 4).map(([y, w], i) => <ReliZQator key={i} y={y} w={w} i={i} />)}
      </g>
      <g className="am-kir" style={{ '--i': 2 }}>
        <rect x="18" y="188" width="250" height="26" rx="6" fill="#1A2436" />
        {['#FF6159', '#FFBD2E', '#28C840'].map((c, i) => <circle key={c} cx={31 + i * 10} cy="201" r="3" fill={c} opacity="0.7" />)}
        <text x="252" y="205" textAnchor="end" className="am-kod">{'{ }'}</text>
      </g>
    </g>}
    {b === 1 && <g>
      <g className="am-yop">
        <rect x="18" y="40" width="250" height="150" rx="8" fill="#1A2436" />
        {['#FF6159', '#FFBD2E', '#28C840'].map((c, i) => <circle key={c} cx={31 + i * 10} cy="53" r="3" fill={c} opacity="0.7" />)}
        <text x="34" y="86" className="am-kod">{tr({ uz: '0 qator', ru: '0 строк' })}</text>
        <rect x="34" y="96" width="2" height="14" fill="#7DD181" className="am-kursor" />
      </g>
      <g className="am-tush"><rect x="76" y="100" width="134" height="30" rx="6" fill="#FFFFFF" stroke="#C2362B" strokeWidth="2" /><text x="143" y="120" textAnchor="middle" className="am-yoq">{tr({ uz: 'qilinmaydi', ru: 'не делают' })}</text></g>
      <rect x="300" y="10" width="224" height="200" rx="4" fill="#FFFFFF" stroke="#D9D3C7" />
      <text x="316" y="36" className="am-sar">{tr({ uz: 'Press-reliz', ru: 'Пресс-релиз' })}</text>
      <g className="am-chiqdi"><rect x="446" y="22" width="62" height="20" rx="10" fill="#E3F0E8" /><text x="477" y="36" textAnchor="middle" className="am-ok">{tr({ uz: 'chiqdi', ru: 'вышел' })}</text></g>
      {RELIZ_Q.map(([y, w], i) => <rect key={i} className="am-q toliq" x="316" y={y - 4} width={w} height="7" rx="3.5" />)}
      <g className="am-olomon">
        {[[352, 0, 3, 1], [470, 4, 0, 2], [396, 2, 1, 0], [436, 1, 2, 1], [330, 5, 0, 2], [500, 3, 1, 0], [374, 6, 2, 1], [416, 0, 0, 2], [454, 2, 1, 0]].map(([x, k, t, h], i) => (
          <Odam key={i} x={x} y={i < 4 ? 214 : 230} s={i < 4 ? 0.74 : 0.86} k={k} t={t} h={h} uzun={i % 3 === 0} chap={i % 2 === 1} />
        ))}
      </g>
    </g>}
    {b === 2 && <g>
      <rect x="40" y="10" width="480" height="212" rx="8" fill="#FFFFFF" stroke="#D9D3C7" />
      <BrauzerUst x={40} y={10} w={480} yil />
      {[0, 1, 2].map(r => (
        <g key={r} className="am-javon" style={{ '--i': r }}>
          {Array.from({ length: 8 }).map((_, c) => {
            const x = 64 + c * 54, y = 48 + r * 58, rang = AM_KITOB[(r * 3 + c) % AM_KITOB.length];
            return <g key={c}><rect x={x} y={y} width="38" height="46" rx="2" fill={rang} /><rect x={x + 5} y={y + 7} width="28" height="9" rx="1.5" fill="#FFFFFF" opacity="0.75" /><rect x={x} y={y} width="4" height="46" fill="#000000" opacity="0.12" /></g>;
          })}
          <rect x="56" y={96 + r * 58} width="448" height="5" rx="2" fill="#B98552" />
        </g>
      ))}
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
  const bq = AMAZON_BOSQICH[b];
  const kutish = b === 0 && !taxmin;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const tx = AM_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Amazon /> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || (done && !xulosaVaqt)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Amazon /> yangi mahsulotni <A>nimadan boshlaydi?</A></>, ru: <>С чего <Amazon /> <A>начинает новый продукт?</A></> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="pr-nuq"><span className="pr-nuq-l">{yorliq}</span>{AMAZON_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="pr-voqea">
          {b === 0 && <p className="pr-brend-t"><Amazon /> — {tr({ uz: 'juda katta internet-magazin.', ru: 'очень большой интернет-магазин.' })}</p>}
          <span className="pr-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><AmazonSahna b={b} /></Zoomable>
          {kutish && <div className="pr-bash pr-guruh-w"><QBashorat yorliq={yorliq} savol={tr(AM_SAVOL)} variantlar={AM_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          {taxmin && !(done && xulosaVaqt) && <BashQator savol={tr(AM_SAVOL)} javob={tr(tx.t)} />}
          {done && xulosaVaqt && <QXulosa>{tx && <span className={cxp('pr-tx', tx.ok && 'ok')}>{tx.ok
            ? <>{tr(TOGRI_CHIQDI)} <b>✓</b></>
            : <>{tr(TAXMININGIZ)}: {tr(tx.t).toLowerCase()} <b className="yoq">✕</b> · {tr(HAQIQATDA)}: <b>{tr({ uz: 'koddan oldin', ru: 'до кода' })}</b></>}</span>}
            {tr({ uz: "Bu voqeada hujjat koddan oldin yozildi, mahsulot esa tor boshlandi — faqat kitobdan.", ru: 'В этой истории документ написали до кода, а продукт начали узко — только с книг.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Amazon 5-Modulning «Ilova nimani yozib qoladi?» darsida ham bo'lgan — eslating; bugungi savol boshqa: PRD qachon yoziladi va nima uchun unda «Qilmaymiz» bor. Sinfdan so'rang: Amazon faqat kitobdan boshlagan — sizning PRD ingizda «Qilmaymiz»ga nima tushadi? Bankdan tashqari raqam, yil va voqea qo'shmang. Press-reliz — PRD emas: ikkalasi ham koddan oldin yoziladigan hujjat, umumiy joyi shu.", ru: 'Amazon уже был в уроке 5-го модуля «Что запоминает приложение?» — напомните; сегодня вопрос другой: когда пишется PRD и зачем в нём «Не делаем». Спросите класс: Amazon начинал только с книг — что в вашем PRD попадёт в «Не делаем»? Не добавляйте чисел, лет и событий вне банка. Пресс-релиз — не PRD: оба — документы, которые пишут до кода, общее у них только это.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s7 = 0; Amazon qoidasi — o'quvchining o'z PRD si) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Amazon'dagidek", ru: 'Проверка · как в Amazon' })}
    questionText="Amazon'dagidek hujjat koddan oldin bo'lsa, PRD ni qachon yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Amazon'dagidek hujjat koddan oldin bo'lsa, <A>PRD ni qachon yozasiz?</A></h2>, ru: <h2 className="title h-ask">Если, как в Amazon, документ — до кода, <A>когда вы пишете PRD?</A></h2> })}
    options={[
      { uz: 'Kod yozishdan oldin, nimani qurishni hal qilib', ru: 'До написания кода, решив, что строить' },
      { uz: "Ilova tayyor bo'lgach, nima qurilganini ko'rib", ru: 'Когда приложение готово, посмотрев, что построено' },
      { uz: 'Kod bilan birga, har kuni bittadan bo\'limini', ru: 'Вместе с кодом, каждый день по разделу' },
      { uz: 'Birinchi foydalanuvchi ilovani ochgan kuni', ru: 'В день, когда первый пользователь откроет приложение' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Amazon'da hujjat koddan oldin yoziladi: nima qurilishini u hal qiladi.", ru: 'В Amazon документ пишут до кода: он решает, что будет построено.' }}
    explainWrong={{
      1: { uz: "Ilova tayyor bo'lsa, nima qurilishi allaqachon hal bo'lgan.", ru: 'Если приложение готово, что строить — уже решено.' },
      2: { uz: "Amazon'da press-reliz yozilganda kod qay holatda edi?", ru: 'В каком состоянии был код, когда в Amazon писали пресс-релиз?' },
      3: { uz: 'Foydalanuvchi ochganda ilova allaqachon qurilgan bo\'ladi.', ru: 'Когда пользователь откроет приложение, оно уже построено.' },
      default: { uz: 'Press-reliz kod bilan qaysi tartibda edi?', ru: 'В каком порядке были пресс-релиз и код?' }
    }} />
);

// ===== SCREEN 8 — UCH SAVOL (QTushuncha markaziy; ketma-ket, 3 qadam): chapda telefon · o'rtada sahifa (qoralama) · o'ngda bitta savol kartasi =====
const S8_TAXMIN = [
  { k: '0', t: { uz: 'Tuzatishsiz', ru: 'Без исправлений' } },
  { k: '1', ok: true, t: { uz: 'Bitta tuzatish bilan', ru: 'С одним исправлением' } },
  { k: '3', t: { uz: 'Uch tuzatish bilan', ru: 'С тремя исправлениями' } }
];
const S8_BASH = { uz: "Mentor PRD si uch savoldan qanday o'tadi?", ru: 'Как PRD Ментора пройдёт три вопроса?' };
const S8_FN = [
  { f: F_ELON, dan: { uz: 'muammo gapidan: yetarli odam', ru: 'из фразы-проблемы: достаточно людей' } },
  { f: F_TASDIQ, dan: { uz: 'muammo gapidan: kim aniq keladi', ru: 'из фразы-проблемы: кто точно придёт' } },
  { f: F_PUL, dan: { uz: "oltita g'oyadan biri: maydon pulini bo'lishish", ru: 'одна из шести идей: делить плату за поле' }, sigmaydi: true }
];
const S8_NAVBAT_DAN = { uz: "muammo gapidan: yetarli odam — chiqqan o'rniga navbatdagi kiradi", ru: 'из фразы-проблемы: достаточно людей — вместо вышедшего входит следующий' };
const S8_PUL_DALIL = { uz: "9-Modul intervyusi: 5 kishidan 1 tasi «pulni bo'lishish qiyin»", ru: 'Интервью 9-го модуля: 1 из 5 человек — «трудно делить деньги»' };
const S8_XATO = [
  { uz: "Dalil bo'limini qayta o'qing: unda nechta odamdan nechtasi?", ru: 'Перечитайте раздел «Доказательство»: у скольких из скольких?' },
  { uz: 'Bu funksiya muammo gapidan keladi — boshqasini qarang.', ru: 'Эта функция идёт из фразы-проблемы — посмотрите другую.' },
  { uz: "Telefonga qarang: «10 / 10» — bitta to'lgan o'yin.", ru: 'Посмотрите на телефон: «10 / 10» — одна заполненная игра.' }
];
const HA = { uz: 'Ha', ru: 'Да' };
const QABUL = { uz: 'Qabul', ru: 'Принято' };
const QABUL_KUL = { uz: 'Qabul — bugungi tekshiruv natijasi: PRD keyin ham yangilanadi.', ru: 'Принято — это итог сегодняшней проверки: PRD и дальше будет обновляться.' };
// Har qadamda ochiq bo'limlar: savolga tegishlisi (1 → Dalil · 2 → muammo gapi, funksiyalar, «Keyin» · 3 → funksiyalar, Bosh raqam)
const S8_OCHIQ = [['dalil'], ['muammo', 'funksiyalar', 'qilmaymiz'], ['funksiyalar', 'boshRaqam'], ['muammo', 'dalil', 'funksiyalar', 'qilmaymiz', 'boshRaqam']];
const tuzatishMatn = (id) => `${tr({ uz: 'Tuzatish', ru: 'Исправление' })}: ${tr(BOL[id].nom)}`;
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qadam, setQadam] = useState(storedAnswer ? 3 : 0);
  const [tuz, setTuz] = useState(storedAnswer ? 2 : 0); // 0 — qoralama · 1 — «Keyin»ga uchdi, navbat kirdi (muhr «Tuzatish») · 2 — ✓
  const [son, setSon] = useState(storedAnswer ? 10 : 8);
  const [bos, setBos] = useState(0);
  const [xato, setXato] = useState(null);
  const [qabul, setQabul] = useState(!!storedAnswer);
  const uch = useUch();
  const kech = useKechik();
  const done = qabul;
  const tugadi = useTugadi(done, 3200, !!storedAnswer);
  useTepaga(tugadi && !storedAnswer);
  const hafta = useSanab(son >= 10 ? 1 : 0, 300);
  // 3-qadam: telefonda «Qo'shilaman» ikki marta o'zi bosiladi — «8 / 10» → «9 / 10» → «10 / 10 · To'ldi»
  useEffect(() => { if (qadam !== 2 || son >= 10) return; kech(() => { setSon(9); setBos(1); }, 800); kech(() => { setSon(10); setBos(2); }, 1700); }, [qadam]); // eslint-disable-line
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // Joriy savolning bo'limi ko'rinadigan joyga suriladi (sahifa ekrandan uzun bo'lsa)
  useEffect(() => { if (!taxmin || qadam > 2) return undefined; const t = setTimeout(() => { const el = document.querySelector('.lesson-root .pr-s8 .pr-bo.tek'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 350); return () => clearTimeout(t); }, [qadam, taxmin]);
  const javob = (ha) => {
    if (!taxmin || qadam > 2) return;
    if (qadam === 0) { if (ha) { setXato(null); setQadam(1); } else setXato({ q: 0, kk: Date.now() }); }
    else if (qadam === 2) { if (ha) { setXato(null); setQadam(3); kech(() => setQabul(true), 400); } else setXato({ q: 2, kk: Date.now() }); }
  };
  const fnBos = (j, e) => {
    if (qadam !== 1 || tuz > 0 || !taxmin) return;
    if (!S8_FN[j].sigmaydi) { setXato({ q: 1, kk: Date.now() }); return; }
    setXato(null);
    uch(e.currentTarget, 's8-keyin2', 720);
    setTuz(1);
    kech(() => setTuz(2), 1900);
    kech(() => setQadam(2), 2400);
  };
  const ts = qadam < 3 ? TEKSHIRUV_SAVOLLAR[qadam] : null;
  const tek = (id) => (ts && ts.bolim === id && !tugadi ? 'tek' : '');
  const fnRo = tuz === 0
    ? <ol className={cxp('pr-fn-ro', qadam === 1 && taxmin && 'pr-guruh')}>{S8_FN.map((x, j) => qadam === 1
      ? <li key={j} className="pr-fn"><button type="button" className={cxp('pr-fn-b', xato && xato.q === 1 && !x.sigmaydi && 'silk')} onClick={(e) => fnBos(j, e)}><span>{tr(x.f)}</span><em className="pr-kul">{tr(x.dan)}</em></button></li>
      : <li key={j} className="pr-fn"><span>{tr(x.f)}</span></li>)}</ol>
    : <ol className="pr-fn-ro">{[S8_FN[0], S8_FN[1]].map((x, j) => <li key={j} className="pr-fn"><span>{tr(x.f)}</span>{qadam === 1 && <em className="pr-kul">{tr(x.dan)}</em>}</li>)}
      <li className="pr-fn kir yangi"><span>{tr(F_NAVBAT)}</span>{qadam === 1 && <em className="pr-kul">{tr(S8_NAVBAT_DAN)}</em>}</li></ol>;
  const keyinRo = [...MENTOR_PRD.keyin.slice(0, MENTOR_PRD.qoralama.keyin).map(tr), ...(tuz >= 1 ? [{ t: tr(MENTOR_PRD.keyin[2]), osti: !tugadi && tr(S8_PUL_DALIL) }] : [])];
  const bolimlar = BOLIMLAR.map(b => {
    const asos = { id: b.id, nom: b.nom, holat: tek(b.id) };
    if (b.id === 'dalil') return { ...asos, matn: sonAjrat(tr(MENTOR_PRD.dalil), qadam === 0 && !!taxmin), osti: <span className="pr-kul">{tr(KUL_DALIL)}</span> };
    if (b.id === 'funksiyalar') return { ...asos, ichi: fnRo, ung: tuz === 1 ? <span className="pr-muhr acc mini" key="t">{tuzatishMatn('funksiyalar')}</span> : tuz === 2 ? <b className="pr-bo-ok" key="ok">✓</b> : null };
    if (b.id === 'qilmaymiz') return { ...asos, ichi: <Qutilar qilmaymiz={MENTOR_PRD.qilmaymiz.map(tr)} keyin={keyinRo} uchK="s8" /> };
    if (b.id === 'boshRaqam') return { ...asos, matn: tr(MENTOR_PRD.boshRaqam) };
    if (b.id === 'muammo' || b.id === 'kim' || b.id === 'yechim') return { ...asos, matn: tr(MENTOR_PRD[b.id]) };
    return asos;
  });
  const tx = S8_TAXMIN.find(x => x.k === taxmin);
  const s8Xulosa = done && <QXulosa>{tx && <TaxQator togri={!!tx.ok} javob={tr(tx.t).toLowerCase()} haqiqat={tr({ uz: 'bitta tuzatish bilan', ru: 'с одним исправлением' })} />}{tr({ uz: 'Mentor tekshiruvi — uch savol: ', ru: 'Проверка Ментора — три вопроса: ' })}{tsQator()}.</QXulosa>;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · Mentor tekshiruvi', ru: 'Понятие · проверка Ментора' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni bering', ru: 'Задайте вопросы' })} (${Math.min(qadam, 3)}/3)`} onClick={onNext} /></>}>
      <div className="pr-w pr-ong pr-s8w">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>PRD ni qurishdan oldin <A>qanday tekshirasiz?</A></>, ru: <>Как <A>проверить PRD</A> до того, как строить?</> })}
          mentor={<Mentor>{tr({ uz: 'Mentor misolidagi PRD ni uchta savol bilan birma-bir tekshiring.', ru: 'Проверьте PRD из примера Ментора тремя вопросами по одному.' })}</Mentor>}
          bashorat={!taxmin
            ? <div className="pr-bash pr-guruh-w"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S8_BASH)} variantlar={S8_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
            : !done && <BashQator savol={tr(S8_BASH)} javob={tr(tx.t)} />}
          harakat={!done && <div className="pr-s8-h">
            <div className="pr-qq"><QQadamlar qadamlar={TEKSHIRUV_SAVOLLAR.map(s => tr(s.savol))} joriy={qadam < 3 ? qadam : undefined} /></div>
            {ts && <div className={cxp('pr-skarta', !taxmin && 'xira', xato && 'silk', qadam === 1 && 'chapga')} key={xato ? `x${xato.kk}` : `q${qadam}`}>
              <b className="pr-skarta-s">{tr(ts.savol)}</b>
              <p className="pr-skarta-q"><span>{tr(NIMAGA)}</span> {tr(ts.qarang)}</p>
              {qadam === 1
                ? <span className="pr-chap-k" aria-hidden="true">←</span>
                : <div className={cxp('pr-skarta-b', taxmin && 'pr-guruh')}>
                  <QTugma disabled={!taxmin} onClick={() => javob(true)}>{tr(HA)}</QTugma>
                  <QTugma ikkinchi disabled={!taxmin} onClick={() => javob(false)}>{tr({ uz: "Yo'q", ru: 'Нет' })}</QTugma>
                </div>}
            </div>}
            {xato && <QXato>{tr(S8_XATO[xato.q])}</QXato>}
          </div>}
          vizual={<div className={cxp('pr-s8', tugadi && 'tinch')}>
            <div className="pr-chap">
              <JamoaTelefon holat="elon" son={son} bosildi={bos}
                ostida={qadam >= 2 && <div className="pr-hafta fade-step"><span>{tr({ uz: "Bu hafta to'lgan o'yinlar", ru: 'Заполненных игр на этой неделе' })}: <b key={hafta}>{hafta}</b></span>{!tugadi && <em className="pr-kul">{tr({ uz: "Bu raqam muammo gapiga qaraydi: o'yin kerakli odam soniga yetdimi?", ru: 'Это число смотрит на фразу-проблему: набрала ли игра нужное число людей?' })}</em>}</div>} />
              {s8Xulosa && <div className="pr-xul-chap">{s8Xulosa}</div>}
            </div>
            <div className="pr-s8-o">
              <PrdSahifa nom={<MaydonJamoa />} bolimlar={bolimlar} ochiq={S8_OCHIQ[done ? 3 : qadam]}
                muhr={done && { tur: 'ok', t: tr(QABUL) }} ostiYorliq={done && tr({ uz: 'Mentor tekshiruvi', ru: 'Проверка Ментора' })} ostiMatn={done && tr(QABUL_KUL)} />
              {done && <QIzoh>{tr({ uz: "PRD ni uch savol bilan ko'rish — Mentor tekshiruvi deyiladi. Javob — qabul yoki tuzatish.", ru: 'Просмотр PRD тремя вопросами называют проверкой Ментора. Ответ — «принято» или «исправление».' })}</QIzoh>}
              {s8Xulosa && <div className="pr-xul-ost">{s8Xulosa}</div>}
            </div>
          </div>}
        />
      </div>
      <MentorNote>{tr({ uz: "Dastur bu darsni «Mentor g'oyani tasdiqlaydi» deb ataydi — tekshiruv shu uch savol, javobi «qabul» yoki «tuzatish» (o'quvchi matnida «tasdiq» faqat «O'yin kuni tasdiq» funksiyasida). Tuzatish — yomon belgi emas: Mentor PRD si ham bitta tuzatishdan so'ng qabul qilindi. «Bajariladimi?» — saralashdagi savol bilan bir ildiz: u yerda g'oya, bu yerda uchta funksiya. Maydon pulini bo'lishish ikki mezondan ham o'tmaydi: muammo gapidan kelmaydi (boshqa g'oya) va to'lov ishi modulga sig'maydi.", ru: 'Программа называет этот урок «Ментор утверждает идею» — проверка — это три вопроса, ответ «принято» или «исправление» (в тексте ученика «подтверждение» — только в функции «Подтверждение в день игры»). Исправление — не плохой знак: PRD Ментора тоже приняли после одного исправления. «Выполнимо ли?» — того же корня, что вопрос при отборе: там идея, здесь три функции. Деление платы за поле не проходит оба критерия: не идёт из фразы-проблемы (другая идея) и работа с оплатой не помещается в модуль.' })}</MentorNote>
    </Stage>
  );
};

// ===== Bo'lim kartasi (9, 10-ekran): bitta katta karta — nomi · kulrang savoli · maydon · hisoblagich · Yordam · «Saqlash» o'ngda (SABOQ 29) =====
const FN_PH = [{ uz: '1-funksiya nomi', ru: 'Название 1-й функции' }, { uz: '2-funksiya nomi', ru: 'Название 2-й функции' }, { uz: '3-funksiya nomi', ru: 'Название 3-й функции' }];
const KEYIN_PH = { uz: 'Keyinga qoldirilgan ish', ru: 'Отложенная работа' };
const qiymatOl = (v, id) => {
  if (id === 'funksiyalar') return { funksiyalar: v.funksiyalar.map(x => x.trim()) };
  if (id === 'qilmaymiz') { const k = v.keyin.map(x => x.trim()).filter(Boolean); return { qilmaymiz: v.qilmaymiz.trim(), keyin: k.length ? k : [''] }; }
  return { [id]: String(v[id] || '').trim() };
};
const Hisob = ({ s, max }) => <span className={cxp('pr-hisob', s.length >= max && 'chet')}>{s.length} / {max}</span>;
const BolimKarta = ({ id, v, setV, xato, onSaqla, kRef, qoshimcha, kirish }) => {
  const b = BOL[id];
  const [yordam, setYordam] = useState(false);
  const t = tekshirBolim(id, v);
  const toliq = !(t && t.q);
  const xm = xato && <div className="pr-xato-q"><QXato>{tr(XABAR[xato.tur])}</QXato>{!xato.q && <QIzoh>{tr(QOLDIR)}</QIzoh>}</div>;
  const ozgar = (patch) => setV(o => ({ ...o, ...patch }));
  const birinchi = id === 'funksiyalar' ? v.funksiyalar.findIndex(x => !x.trim()) : -1;
  let maydon;
  if (id === 'funksiyalar') maydon = <div className="pr-fk">{v.funksiyalar.map((x, i) => (
    <label key={i} className="pr-fk-q"><span className="pr-fk-n">{i + 1}</span>
      <input className={cxp('pr-inp', i === birinchi && 'pr-halqa-i', xato && xato.tur === 'fbir' && 'xato')} value={x} maxLength={b.max} placeholder={tr(FN_PH[i])} onChange={(e) => ozgar({ funksiyalar: v.funksiyalar.map((y, j) => (j === i ? e.target.value : y)) })} />
      <Hisob s={x} max={b.max} /></label>
  ))}</div>;
  else if (id === 'qilmaymiz') maydon = <div className="pr-fk">
    <span className="pr-fk-l">{tr(QUTI_NOM.qilmaymiz)}</span>
    <textarea rows={2} className={cxp('pr-inp', !v.qilmaymiz.trim() && 'pr-halqa-i')} value={v.qilmaymiz} maxLength={b.max} placeholder={tr(b.ph)} onChange={(e) => ozgar({ qilmaymiz: e.target.value })} />
    <Hisob s={v.qilmaymiz} max={b.max} />
    <span className="pr-fk-l">{tr(QUTI_NOM.keyin)}</span>
    {v.keyin.map((x, i) => <label key={i} className="pr-fk-q"><span className="pr-fk-n">{i + 1}</span>
      <input className={cxp('pr-inp', v.qilmaymiz.trim() && !v.keyin.some(y => y.trim()) && i === 0 && 'pr-halqa-i')} value={x} maxLength={40} placeholder={tr(KEYIN_PH)} onChange={(e) => ozgar({ keyin: v.keyin.map((y, j) => (j === i ? e.target.value : y)) })} />
      <Hisob s={x} max={40} /></label>)}
    {v.keyin.length < 3 && <QTugma ikkinchi className="pr-yana" onClick={() => ozgar({ keyin: [...v.keyin, ''] })}>{tr({ uz: '+ Yana ish', ru: '+ Ещё работа' })}</QTugma>}
  </div>;
  else maydon = <>
    <textarea rows={id === 'dalil' ? 3 : 2} className={cxp('pr-inp', !String(v[id] || '').trim() && 'pr-halqa-i', xato && 'xato')} value={v[id]} maxLength={b.max} placeholder={tr(b.ph)} onChange={(e) => ozgar({ [id]: e.target.value })} />
    <Hisob s={v[id] || ''} max={b.max} />
  </>;
  return (
    <div className={cxp('pr-bk', kirish && 'kir')} ref={kRef}>
      <div className="pr-bk-h"><span className="pr-bk-n">{b.n}</span><b className="pr-bk-nom">{tr(b.nom)}</b><span className="pr-bk-s">{tr(b.savol)}</span></div>
      {maydon}
      {xm}
      {yordam && <QIzoh>{tr(MISOLIDA)} {yordamMatn(id)}</QIzoh>}
      <div className="pr-bk-amal">
        <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
        {qoshimcha}
        <QTugma className={halqa(toliq)} disabled={!toliq && !xato} onClick={onSaqla}>{tr(SAQLASH)}</QTugma>
      </div>
    </div>
  );
};
// Saqlash: bo'sh — bloklaydi; yumshoq xato — bir marta ko'rsatiladi, ikkinchi «Saqlash» bilan o'tadi
const useBolimSaqla = () => {
  const [xato, setXato] = useState(null);
  const tayyor = (id, v) => {
    const t = tekshirBolim(id, v);
    const imzo = t && `${t.tur}|${norm(JSON.stringify(qiymatOl(v, id)))}`;
    if (t && (t.q || !(xato && xato.imzo === imzo))) { setXato({ ...t, imzo, kk: Date.now() }); return false; }
    setXato(null);
    return true;
  };
  return { xato, setXato, tayyor };
};

// ===== SCREEN 9 — O'Z PRD INGIZ (QMustaqil, USTAXONA — ketma-ket karta, 7 bo'lim; SABOQ 9, 13, 17, 29): tepada ixcham sahifa «PRD · n / 7» · markazda bitta katta karta =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [fin] = useState(finalOl);
  const [s, setS] = useState(() => prdOl() || { ...BOSH_PRD });
  const [v, setV] = useState(() => ({ ...s, muammo: s.muammo || (fin && fin.muammo) || '', dalil: s.dalil || (fin && fin.dalil) || '' }));
  const [tahrir, setTahrir] = useState(null);
  const [yangi, setYangi] = useState(null);
  const [kartaK, setKartaK] = useState(0);
  const { xato, setXato, tayyor } = useBolimSaqla();
  const kartaRef = useRef(null);
  const uch = useUch();
  const n = prdSon(s);
  const navb = BOLIMLAR.find(b => !bolimBor(s, b.id));
  const joriy = tahrir || (navb && navb.id) || null;
  const done = n >= 7 && !tahrir;
  const finBor = !!(fin && (fin.muammo || fin.dalil));
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => {
    if (n < 7 || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'prd', correct: true, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'prd', /\d/.test(s.dalil) ? 1 : 0, true, 0);
  }, [n]); // eslint-disable-line
  const saqla = () => {
    if (!joriy || !tayyor(joriy, v)) return;
    const yS = { ...s, ...qiymatOl(v, joriy) };
    uch(kartaRef.current, `s9-${joriy}`, 640);
    setS(yS); prdYoz(yS); setYangi(joriy); setTahrir(null); setKartaK(k => k + 1);
  };
  const ochTahrir = (id) => { if (isMentor) return; setTahrir(id); setXato(null); setV(o => ({ ...o, ...s })); setKartaK(k => k + 1); };
  const nom = (fin && fin.goya) || tr(MENING_NOM);
  const nomYorliq = fin && fin.vaqtincha && tr(VAQTINCHA);
  const ixcham = <PrdSahifa rejim="ixcham" className="pr-s9-ix" nom={nom} nomYorliq={nomYorliq} sanoq={n}
    bolimlar={BOLIMLAR.map(b => ({ id: b.id, nom: b.nom, uch: `s9-${b.id}`, holat: cxp(bolimBor(s, b.id) ? 'ok' : b.id === joriy ? 'joriy' : '', yangi === b.id && 'yangi') }))} />;
  const toliqSahifa = <PrdSahifa nom={nom} nomYorliq={nomYorliq} className="pr-s9-t fade-step"
    bolimlar={BOLIMLAR.map(b => ({ id: b.id, nom: b.nom, holat: yangi === b.id ? 'yoz' : '', matn: bolimMatn(s, b.id), ichi: bolimIchi(s, b.id), onTahrir: () => ochTahrir(b.id) }))} />;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor || n >= 7 ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (__lang === 'ru' ? `Напишите ещё разделов: ${7 - n}` : `Yana ${7 - n} ta bo'lim yozing`)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Final g'oyangiz uchun <A>yetti bo'limni</A> yozing.</>, ru: <>Напишите <A>семь разделов</A> для своей финальной идеи.</> })}
        mentor={<Mentor>{finBor
          ? tr({ uz: "Muammo va dalil o'tgan darsdan keldi — ularni o'qib chiqing va qolgan beshta bo'limni bittalab yozing.", ru: 'Проблема и доказательство пришли с прошлого урока — прочитайте их и напишите остальные пять разделов по одному.' })
          : tr({ uz: "Yetti bo'limni bittalab yozing: avval muammo, so'ng dalil.", ru: 'Напишите семь разделов по одному: сначала проблему, потом доказательство.' })}</Mentor>}
        qadamlar={isMentor
          ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: "Yetti bo'limni yozganlar", ru: 'Написали семь разделов' }, { uz: 'Dalilida son borlar', ru: 'С числом в доказательстве' }]} hisob={(rows, jami) => [`${rows.length} / ${jami}`, String(rows.filter(r => r.picked > 0).length)]} />
            <PrdSahifa nom={<MaydonJamoa />} bolimlar={mentorBolimlar()} muhr={{ tur: 'ok', t: tr(QABUL) }} /></>
          : (done ? toliqSahifa : ixcham)}
        forma={!isMentor && !done && joriy && <div className="pr-s9-k" key={`${joriy}-${kartaK}`}>
          <BolimKarta id={joriy} v={v} setV={setV} xato={xato} onSaqla={saqla} kRef={kartaRef} kirish />
        </div>}
      >
        {done && !isMentor && <QXulosa>{tr({ uz: "PRD ingiz yozildi: yetti bo'lim — bir sahifada.", ru: 'Ваш PRD написан: семь разделов — на одной странице.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Taymer yo'q — 20 daqiqadan so'ng 10-ekranga o'ting; ulgurmagan bo'lim uyda yoziladi. Eng ko'p xato — dalilni fikr bilan yozish («hammaga kerak»): «Intervyuda nechta odamdan nechtasi aytdi?» deb so'rang. Ikkinchi xato — funksiya o'rniga butun mahsulot nomi: «Bu ish o'yinchiga aynan nima beradi?»", ru: 'Таймера нет — через 20 минут переходите на 10-й экран; несделанный раздел допишут дома. Самая частая ошибка — доказательство-мнение («всем нужно»): спросите «Сколько человек из скольких сказали это в интервью?». Вторая ошибка — вместо функции название всего продукта: «Что именно эта работа даёт игроку?»' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — UCH SAVOL: O'Z PRD INGIZ (QMustaqil; juftlik + yakka rejim, 3 qadam): chapda o'quvchining sahifasi · o'ngda savol kartasi =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const juft = isStudent;
  const [fin] = useState(finalOl);
  const vaqtincha = !!(fin && fin.vaqtincha);
  const [p, setP] = useState(() => prdOl() || { ...BOSH_PRD });
  const [qadam, setQadam] = useState(storedAnswer ? 3 : 0);
  const [uyda, setUyda] = useState(storedAnswer?.uyda ?? null);
  const [tuzatildi, setTuzatildi] = useState(!!storedAnswer?.tuzatildi);
  const [okB, setOkB] = useState(() => (storedAnswer ? TEKSHIRUV_SAVOLLAR.map(x => x.bolim).filter(x => x !== storedAnswer.uyda) : []));
  const [ochiq, setOchiq] = useState(null);
  const [v, setV] = useState(p);
  const [yangi, setYangi] = useState(null);
  const { xato, setXato, tayyor } = useBolimSaqla();
  const kartaRef = useRef(null);
  const uch = useUch();
  const done = qadam >= 3;
  const ts = !done ? TEKSHIRUV_SAVOLLAR[qadam] : null;
  const haOchiq = !(qadam === 0 && vaqtincha);
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const yP = { ...p, tekshiruv: uyda ? 'tuzatish' : 'qabul', tuzatish: uyda || null };
    setP(yP); prdYoz(yP);
    onAnswer(screen, { stage: 'tekshiruv', screenIdx: screen, practice: 'tekshiruv', correct: true, picked: true, solved: true, uyda, tuzatildi });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'tekshiruv', uyda ? 1 : 0, true, 0);
  }, [done]); // eslint-disable-line
  const ha = () => { if (!ts || !haOchiq) return; setOkB(o => [...o, ts.bolim]); setQadam(q => q + 1); };
  const yoq = () => { if (!ts) return; setOchiq(ts.bolim); setV({ ...p }); setXato(null); };
  const uydaB = () => { if (!ts) return; setUyda(u => u || ts.bolim); setOchiq(null); setXato(null); setQadam(q => q + 1); };
  const saqla = () => {
    if (!ochiq || !tayyor(ochiq, v)) return;
    const yP = { ...p, ...qiymatOl(v, ochiq) };
    uch(kartaRef.current, `s10-${ochiq}`, 640);
    setP(yP); prdYoz(yP); setYangi(ochiq); setTuzatildi(true);
    // 4-dars tanlovi vaqtincha bo'lsa — «Dalil bormi?» natijasi «Tuzatish: Dalil» (05-FILTR 1)
    if (vaqtincha && ochiq === 'dalil') { setUyda(u => u || 'dalil'); setQadam(q => q + 1); }
    setOchiq(null);
  };
  const muhr = done && (uyda ? { tur: 'acc', t: tuzatishMatn(uyda) } : { tur: 'ok', t: juft ? tr(QABUL) : tr({ uz: 'Tuzatish topilmadi', ru: 'Исправлений не найдено' }) });
  const xulosa = !done ? null : uyda
    ? tr({ uz: `Tuzatish: ${tr(BOL[uyda].nom)} bo'limi. Uni uyga vazifada tuzatasiz.`, ru: `Исправление: раздел «${tr(BOL[uyda].nom)}». Исправите его в домашнем задании.` })
    : !juft ? tr({ uz: "Uch savolga ham «ha» — o'z tekshiruvingizda tuzatish topilmadi.", ru: 'На все три вопроса «да» — в своей проверке вы не нашли исправлений.' })
      : tuzatildi ? tr({ uz: "Mentor misolidagidek: tuzatishdan so'ng PRD ingiz qabul qilindi.", ru: 'Как в примере Ментора: после исправления ваш PRD принят.' })
        : tr({ uz: "Uch savolga ham «ha» — PRD ingiz qabul qilindi.", ru: 'На все три вопроса «да» — ваш PRD принят.' });
  const bolimlar = BOLIMLAR.map(b => ({
    id: b.id, nom: b.nom, uch: `s10-${b.id}`,
    holat: cxp(ts && ts.bolim === b.id && !ochiq ? 'tek' : '', uyda === b.id && 'tuz', yangi === b.id && 'yoz'),
    matn: bolimMatn(p, b.id), ichi: bolimIchi(p, b.id),
    ung: okB.includes(b.id) ? <b className="pr-bo-ok">✓</b> : null
  }));
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в парах' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Uch savolni bering', ru: 'Задайте три вопроса' })} (${qadam}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>PRD ingiz uch savoldan <A>o'tadimi?</A></>, ru: <>Пройдёт ли ваш PRD <A>три вопроса?</A></> })}
        mentor={<Mentor>{juft
          ? tr({ uz: "Sherigingiz PRD ingizni o'qib, uch savolni beradi — javobni birga belgilang.", ru: 'Партнёр читает ваш PRD и задаёт три вопроса — отметьте ответ вместе.' })
          : tr({ uz: "Uch savolni o'zingizga bering va javobini PRD dan toping.", ru: 'Задайте себе три вопроса и найдите ответ в PRD.' })}</Mentor>}
        qadamlar={<div className="pr-qq"><QQadamlar qadamlar={TEKSHIRUV_SAVOLLAR.map(x => tr(x.savol))} joriy={done ? undefined : qadam} /></div>}
        forma={isMentor
          ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: 'Qabul', ru: 'Принято' }, { uz: 'Tuzatish', ru: 'Исправление' }]} hisob={(rows) => [String(rows.filter(r => r.picked === 0).length), String(rows.filter(r => r.picked > 0).length)]} />
            <PrdSahifa nom={<MaydonJamoa />} bolimlar={mentorBolimlar()} muhr={{ tur: 'ok', t: tr(QABUL) }} /></>
          : <div className={cxp('pr-s10', done && 'tugadi')}>
            <PrdSahifa nom={(fin && fin.goya) || tr(MENING_NOM)} nomYorliq={fin && fin.vaqtincha && tr(VAQTINCHA)} bolimlar={bolimlar} ochiq={done ? undefined : ['muammo', 'dalil', 'funksiyalar', 'boshRaqam']} muhr={muhr} />
            {!done && <div className="pr-s10-o">
              {ochiq
                ? <div key={`t${ochiq}`}><BolimKarta id={ochiq} v={v} setV={setV} xato={xato} onSaqla={saqla} kRef={kartaRef} kirish
                  qoshimcha={<QTugma ikkinchi className={cxp('pr-uyda', vaqtincha && ochiq === 'dalil' && 'pr-halqa')} onClick={uydaB}>{tr({ uz: 'Uyda tuzataman', ru: 'Исправлю дома' })}</QTugma>} /></div>
                : <div className="pr-skarta" key={`q${qadam}`}>
                  <b className="pr-skarta-s">{tr(ts.savol)}</b>
                  <p className="pr-skarta-q"><span>{tr(NIMAGA)}</span> {tr(ts.qarangO || ts.qarang)}</p>
                  <div className="pr-skarta-b pr-guruh">
                    <QTugma disabled={!haOchiq} onClick={ha}>{tr(HA)}</QTugma>
                    <QTugma ikkinchi onClick={yoq}>{tr({ uz: "Yo'q — tuzataman", ru: 'Нет — исправлю' })}</QTugma>
                  </div>
                </div>}
            </div>}
          </div>}
      >
        {xulosa && !isMentor && <QXulosa>{xulosa}</QXulosa>}
        <MentorNote>{tr({ uz: "Juftlikda sherik o'z ekranida emas, o'quvchining ekranida savol beradi — 4 daqiqadan so'ng «O'rin almashing» deng. «Tuzatish» — yaxshi natija: muammo qurishdan oldin topildi. O'qituvchi 2–3 o'quvchining PRD sini sinf bilan uch savol orqali tekshiradi (ekranga chiqarib), qolganlar juftlikda.", ru: 'В паре партнёр задаёт вопросы не на своём экране, а на экране ученика — через 4 минуты скажите «Поменяйтесь местами». «Исправление» — хороший результат: проблему нашли до того, как строить. Учитель проверяет PRD 2–3 учеников вместе с классом тремя вопросами (выведя на экран), остальные — в парах.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — PRD.md (QKod, VS Code rejimi: kod oynasi yo'q — hujjat; PM-082 c, d, e) =====
const MD_DARVOZA = [
  { id: 'sar', t: '`## Muammo`', ok: true },
  { id: 'izoh', t: '`// Muammo`', x: { uz: "`//` — JavaScript izohi; Markdown'da u oddiy matn.", ru: "`//` — комментарий JavaScript; в Markdown это обычный текст." } },
  { id: 'qator', t: '`Muammo:`', x: { uz: "Bu oddiy qator bo'lib chiqadi, sarlavha emas.", ru: 'Это получится обычной строкой, а не заголовком.' } }
];
const MD_VAZIFA = [
  { uz: 'Kompyuteringizda mahsulotingiz nomi bilan papka oching va VS Code\'da unda `PRD.md` faylini yarating.', ru: 'Откройте на компьютере папку с названием вашего продукта и создайте в ней в VS Code файл `PRD.md`.' },
  { uz: "Yetti bo'limni `## ` bilan boshlang, har sarlavha ostiga — PRD ingizdagi matn; funksiyalar `- ` bilan ro'yxat bo'ladi.", ru: 'Начните семь разделов с `## `, под каждым заголовком — текст из вашего PRD; функции станут списком с `- `.' },
  { uz: "Ko'rinishni oching: Ctrl+Shift+V (Mac'da Cmd+Shift+V) — yetti sarlavha ko'rinsin.", ru: 'Откройте просмотр: Ctrl+Shift+V (на Mac — Cmd+Shift+V) — должны быть видны семь заголовков.' }
];
const QKOD_ONG = ['muh', 'arrir'].join(''); // QKod o'ng ustun propi (qolip API nomi, o'quvchi matni emas) — til-lint «ekran-nomi» qoidasidan chetda
const nusxala = (matn) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(matn).catch(() => {}); return; } } catch { /* pastdagi zaxira */ }
  try { const t = document.createElement('textarea'); t.value = matn; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); } catch { /* nusxa olinmasa ham davom etadi */ }
};
// PRD.md namunasi — o'quvchining PRD sidan (yo'q bo'lsa — Mentor misoli); #, ##, «- » belgilari nusxalanmaydi (qo'lda teriladi)
const mdQismlar = (p) => {
  const ol = (id, x) => (x && String(x).trim()) || '…';
  if (!p) return { nom: 'Maydon Jamoa', tek: tr({ uz: 'qabul', ru: 'принято' }), bo: BOLIMLAR.map(b => {
    if (b.id === 'funksiyalar') return { id: b.id, ro: MENTOR_PRD.funksiyalar.map(tr) };
    if (b.id === 'qilmaymiz') return { id: b.id, q: [`${tr(QUTI_NOM.qilmaymiz)}: ${MENTOR_PRD.qilmaymiz.map(tr).join(', ')}.`, `${tr(QUTI_NOM.keyin)}: ${MENTOR_PRD.keyin.map(tr).join(', ')}.`] };
    return { id: b.id, q: [tr(MENTOR_PRD[b.id])] };
  }) };
  return { nom: null, tek: p.tekshiruv === 'qabul' ? tr({ uz: 'qabul', ru: 'принято' }) : p.tekshiruv === 'tuzatish' ? tr({ uz: 'tuzatish', ru: 'исправление' }) : null, bo: BOLIMLAR.map(b => {
    if (b.id === 'funksiyalar') return { id: b.id, ro: p.funksiyalar.map(x => ol(b.id, x)) };
    if (b.id === 'qilmaymiz') return { id: b.id, q: [`${tr(QUTI_NOM.qilmaymiz)}: ${ol(b.id, p.qilmaymiz)}`, `${tr(QUTI_NOM.keyin)}: ${ol(b.id, p.keyin.filter(x => x.trim()).join(', '))}`] };
    return { id: b.id, q: [ol(b.id, p[b.id])] };
  }) };
};
const PrdMarkdown = ({ p, nom, ajrat, belgi }) => {
  const [nus, setNus] = useState(null);
  useEffect(() => { if (nus === null) return undefined; const t = setTimeout(() => setNus(null), 1400); return () => clearTimeout(t); }, [nus]);
  const m = mdQismlar(p);
  return (
    <div className="pr-md">
      <div className="pr-md-bar"><i /><i /><i /><span>PRD.md</span><em>VS Code</em></div>
      <div className="pr-md-k">
        <p className="pr-md-q"><span className="pr-md-b">#</span> {m.nom || nom} — PRD</p>
        {m.tek && <p className="pr-md-q">{tr({ uz: 'Mentor tekshiruvi', ru: 'Проверка Ментора' })}: {m.tek}</p>}
        {m.bo.map((s, i) => (
          <div key={s.id} className="pr-md-bo">
            <p className={cxp('pr-md-q sar', ajrat && 'ajrat')} style={{ '--i': i }}><span className="pr-md-b">##</span> {tr(BOL[s.id].nom)}{belgi && <b className="pr-md-ok" style={{ '--i': i }}>✓</b>}</p>
            {s.ro ? s.ro.map((l, j) => <p key={j} className="pr-md-q"><span className="pr-md-b">- </span>{l}</p>) : s.q.map((l, j) => <p key={j} className="pr-md-q">{l}</p>)}
            <button type="button" className={cxp('pr-nusxa', nus === s.id && 'ok')} onClick={() => { nusxala((s.ro || s.q).join('\n')); setNus(s.id); }}>{nus === s.id ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button>
          </div>
        ))}
      </div>
    </div>
  );
};
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [p] = useState(() => { const x = prdOl(); return x && prdSon(x) > 0 ? x : null; });
  const [fin] = useState(finalOl);
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'sar' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const ochildi = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2600); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (g) => {
    if (gpick || done) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); } else setMiss({ id: g.id, k: Date.now() });
  };
  const bajardim = () => {
    if (done || !ochildi) return;
    setDone(true);
    onAnswer(screen, { stage: 'prdmd', screenIdx: screen, practice: 'prdmd', solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'prdmd', 0, true, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'VS Code · PRD.md', ru: 'VS Code · PRD.md' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !gpick ? tr({ uz: 'Avval savolni yeching', ru: 'Сначала решите вопрос' }) : tr({ uz: 'PRD.md ni yozing', ru: 'Напишите PRD.md' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>PRD ni koddan oldin <A>faylga yozamiz.</A></>, ru: <>Запишем PRD <A>в файл до кода.</A></> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "PRD — kod emas, hujjat: uni VS Code'da `PRD.md` fayliga yozasiz. Bo'lim sarlavhalarini qo'lda terasiz — shunda Markdown yozuvi esda qoladi.", ru: 'PRD — не код, а документ: вы запишете его в VS Code в файл `PRD.md`. Заголовки разделов наберёте вручную — так запись Markdown запомнится.' }))}</Mentor>}
        vazifa={<>
          <PStrip fayl={done} />
          <div className="pr-darvoza">
            <span className="pr-darvoza-s">{tr({ uz: "Markdown'da bo'lim sarlavhasi qaysi qator bo'ladi?", ru: 'Какая строка в Markdown будет заголовком раздела?' })}</span>
            <div className={cxp('pr-darvoza-ro', !gpick && !done && 'pr-guruh')}>
              {MD_DARVOZA.map((g, i) => {
                const silk = miss && miss.id === g.id;
                return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id || (done && g.ok) ? 'ok' : silk ? 'err' : undefined} disabled={!!gpick && gpick !== g.id} style={{ '--i': i }} onClick={() => pickGate(g)}>{fmtCode(g.t)}</QChip>;
              })}
            </div>
            {miss && <QXato>{fmtCode(tr(MD_DARVOZA.find(g => g.id === miss.id).x))}</QXato>}
            {(gpick || done) && <QIzoh>{fmtCode(tr({ uz: "Markdown — matnni belgilar bilan sarlavha va ro'yxatga ajratib yozish usuli; 8-Modulda `SKILL.md` ham shunday yozilgan.", ru: 'Markdown — способ записи, где символы делят текст на заголовки и списки; в 8-м модуле `SKILL.md` тоже написан так.' }))}</QIzoh>}
          </div>
          <ol className={cxp('pr-vazifa', !ochildi && 'xira')}>{MD_VAZIFA.map((x, i) => <li key={i} className={cxp(done && 'ok')}><i>{done ? '✓' : i + 1}</i><span>{fmtCode(tr(x))}</span></li>)}</ol>
          {done && <QXulosa>{tr({ uz: "PRD ingiz fayl bo'ldi: yetti bo'lim — kod yozilishidan oldin.", ru: 'Ваш PRD стал файлом: семь разделов — до того, как написан код.' })}</QXulosa>}
        </>}
        yordam={ochildi && yordam && <div className="pr-kyordam"><QIzoh>{fmtCode(tr({ uz: "Bitta bo'limdan boshlang: `## Muammo`, ostiga muammo gapingiz. Sarlavhadan oldin bo'sh qator qoldiring. Ko'rinish yonma-yon kerak bo'lsa — Ctrl+K, so'ng V.", ru: 'Начните с одного раздела: `## Muammo`, под ним — ваша фраза-проблема. Перед заголовком оставьте пустую строку. Если просмотр нужен рядом — Ctrl+K, потом V.' }))}</QIzoh></div>}
        bajardim={<div className="pr-bajardim">
          {ochildi && !done && <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>}
          {!done && <QTugma className={halqa(ochildi && !isMentor)} disabled={!ochildi || isMentor} onClick={bajardim}>{ochildi ? tr({ uz: "✓ PRD.md yozildi — yetti sarlavha ko'rindi", ru: '✓ PRD.md написан — видно семь заголовков' }) : tr({ uz: 'Avval savolni yeching', ru: 'Сначала решите вопрос' })}</QTugma>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div>}
        {...{ [QKOD_ONG]: <PrdMarkdown p={p} nom={(fin && fin.goya) || tr(MENING_NOM)} ajrat={ajrat} belgi={done} /> }}
      >
        <MentorNote>{tr({ uz: "10 daqiqa. PRD.md 7-darsda o'quvchi repo'si ochilganda repo ildiziga, README.md yoniga qo'shiladi — papkani keyin topa oladigan joyga saqlashni ayting. VS Code'da ko'rinish ochilmasa, fayl kengaytmasini tekshiring: .md bo'lishi kerak.", ru: '10 минут. PRD.md на 7-м уроке, когда откроется репозиторий ученика, добавится в его корень рядом с README.md — скажите сохранить папку там, где её потом легко найти. Если в VS Code просмотр не открывается, проверьте расширение файла: должно быть .md.' })}</MentorNote>
      </QKod>
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s12 = 3; Mentor tekshiruvi javobi) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Sherigingiz PRD sida Dalil bo'limi bo'sh. Tekshiruv javobi qanday?"
    question={tr({ uz: <h2 className="title h-ask">Sherigingiz PRD sida Dalil bo'limi bo'sh. <A>Tekshiruv javobi qanday?</A></h2>, ru: <h2 className="title h-ask">В PRD партнёра раздел «Доказательство» пуст. <A>Какой ответ проверки?</A></h2> })}
    options={[
      { uz: 'Qabul — qolgan olti bo\'lim yozilgan', ru: 'Принято — остальные шесть разделов написаны' },
      { uz: 'Tuzatish — PRD ni boshidan qayta yozish', ru: 'Исправление — переписать PRD с начала' },
      { uz: "Qabul — dalilni kod yozilgach qo'shadi", ru: 'Принято — доказательство добавит после кода' },
      { uz: "Tuzatish — Dalil bo'limini to'ldirish", ru: 'Исправление — заполнить раздел «Доказательство»' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "«Dalil bormi?» savoliga javob — yo'q: tuzatish, bo'lim nomi bilan.", ru: 'Ответ на вопрос «Есть ли доказательство?» — нет: исправление с названием раздела.' }}
    explainWrong={{
      0: { uz: 'Qabul uchun uch savolga ham «ha» kerak.', ru: 'Для «принято» нужно «да» на все три вопроса.' },
      1: { uz: "Tuzatish butun PRD ni emas, bitta bo'limni aytadi.", ru: 'Исправление называет не весь PRD, а один раздел.' },
      2: { uz: "Amazon'dagidek: hujjat koddan oldin to'liq bo'ladi.", ru: 'Как в Amazon: документ полон до кода.' },
      default: { uz: "Qaysi savolga «yo'q» chiqdi — shuni eslang.", ru: 'На какой вопрос вышло «нет» — вспомните это.' }
    }}
    vizual={<PrdSahifa rejim="ixcham" className="kichik" sanoq={6} muhr={{ tur: 'acc', t: tuzatishMatn('dalil') }}
      bolimlar={BOLIMLAR.map(b => ({ id: b.id, nom: b.nom, holat: b.id === 'dalil' ? 'tuz' : 'ok' }))} />} />
);

// ===== 🏅 NISHONLAR (4) — qilingan ishni aytadi (§184); tekin bonus yo'q (S-034) =====
const ACHIEVEMENTS = {
  clearLimits: { icon: '🧭', name: 'Clear Limits!', desc: { uz: "To'rt ishni birinchi urinishda «Qilmaymiz» yoki «Keyin»ga to'g'ri joyladingiz", ru: 'Вы с первой попытки верно разложили четыре работы в «Не делаем» или «Потом»' } },
  fullPrd: { icon: '📄', name: 'Full PRD!', desc: { uz: "Final g'oyangiz uchun yetti bo'limni yozdingiz", ru: 'Вы написали семь разделов для своей финальной идеи' } },
  threeQuestions: { icon: '🔍', name: 'Three Questions!', desc: { uz: 'PRD ingizni uch savol bilan tekshirdingiz', ru: 'Вы проверили свой PRD тремя вопросами' } },
  docFirst: { icon: '📝', name: 'Doc First!', desc: { uz: 'PRD ni koddan oldin PRD.md fayliga yozdingiz', ru: 'Вы записали PRD в файл PRD.md до кода' } }
};
// Ekran id → nishon (s4 — birinchi urinish; s9, s10, s11 — ish bajarilganda)
const ACH_TRIGGERS = { s4: 'clearLimits', s9: 'fullPrd', s10: 'threeQuestions', s11: 'docFirst' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 12 — q22)
const Q_LABELS = {
  3: { uz: "1 — Dalil bo'limi", ru: '1 — Раздел «Доказательство»' },
  5: { uz: '2 — Qilmaymiz yoki Keyin', ru: '2 — Не делаем или Потом' },
  7: { uz: '3 — Amazon', ru: '3 — Amazon' },
  12: { uz: '4 — Tekshiruv javobi', ru: '4 — Ответ проверки' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: 'PRD', l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'muammo', ru: 'проблема' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'dalil', ru: 'доказательство' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'kim uchun', ru: 'для кого' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'yechim', ru: 'решение' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'funksiya', ru: 'функция' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'Qilmaymiz', ru: 'Не делаем' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'Keyin', ru: 'Потом' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'bosh raqam', ru: 'главное число' }, l: 56, t: 54, s: 20, d: 22, dl: 0.6 },
  { ch: { uz: 'qabul', ru: 'принято' }, l: 36, t: 62, s: 22, d: 24, dl: 1.3 },
  { ch: { uz: 'tuzatish', ru: 'исправление' }, l: 88, t: 44, s: 20, d: 26, dl: 2.5 },
  { ch: 'Markdown', l: 4, t: 46, s: 20, d: 21, dl: 3.1 }
];
// ⚡ Jonli viktorina — 12 savol (MD aynan); to'g'ri javob o'rni: A 3·6·9 · B 1·5·12 · C 4·8·11 · D 2·7·10 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: "8-Moduldagi to'rt katakka PRD da yana nima qo'shildi?", ru: 'Что ещё добавилось в PRD к четырём клеткам из 8-го модуля?' }, opts: [{ uz: 'Ekranlar rasmi, ranglar va shriftlar', ru: 'Картинки экранов, цвета и шрифты' }, { uz: 'Dalil, funksiyalar va qurilmaydiganlar', ru: 'Доказательство, функции и то, что не строим' }, { uz: 'Ishning narxi, muddati va ish jadvali', ru: 'Цена работы, срок и график' }, { uz: "Dasturchilar ro'yxati va ularning ishi", ru: 'Список программистов и их работа' }], correct: 1 },
  { q: { uz: 'Sinfdoshingiz dalilga «hammaga yoqadi» deb yozdi. Nima yetishmaydi?', ru: 'Одноклассник написал в доказательстве «всем нравится». Чего не хватает?' }, opts: [{ uz: 'Ilovaning chiroyli nomi va rangi', ru: 'Красивое название и цвет приложения' }, { uz: 'Yechimning uzun va batafsil matni', ru: 'Длинный подробный текст решения' }, { uz: "O'xshash ilovalarning ro'yxati", ru: 'Список похожих приложений' }, { uz: 'Intervyuda buni aytganlar soni', ru: 'Число сказавших это в интервью' }], correct: 3 },
  { q: { uz: 'Qaysi ish uchta asosiy funksiya qatoriga kiradi?', ru: 'Какая работа входит в три основные функции?' }, opts: [{ uz: "Busiz muammo hal bo'lmaydigan ish", ru: 'Работа, без которой проблема не решится' }, { uz: "Eng chiroyli ko'rinadigan ish", ru: 'Самая красивая на вид работа' }, { uz: "Boshqa ilovalarda bor bo'lgan ish", ru: 'Работа, которая есть в других приложениях' }, { uz: "Qurish uchun eng oson bo'lgan ish", ru: 'Самая лёгкая для постройки работа' }], correct: 0 },
  { q: { uz: 'Yozuvlarda sababi bor, lekin hozir shart emas. Qayerga yozasiz?', ru: 'Причина в записях есть, но сейчас не обязательно. Куда запишете?' }, opts: [{ uz: 'Uchta asosiy funksiya qatoriga', ru: 'В три основные функции' }, { uz: "Qilmaymiz qutisiga, o'chirib", ru: 'В коробку «Не делаем», удалив' }, { uz: "Keyin qutisiga, saqlab qo'yib", ru: 'В коробку «Потом», сохранив' }, { uz: "Yechim gapiga qo'shib yozib", ru: 'Дописав во фразу решения' }], correct: 2 },
  { q: { uz: "«O'yinchilar ilovadan mamnun» — bosh raqam bo'la oladimi?", ru: '«Игроки довольны приложением» — может ли это быть главным числом?' }, opts: [{ uz: "Ha — o'yinchilarning fikri muhim", ru: 'Да — мнение игроков важно' }, { uz: "Yo'q — mamnunlikni sanab bo'lmaydi", ru: 'Нет — довольство нельзя посчитать' }, { uz: 'Ha — intervyuda shunday deyishgan', ru: 'Да — так сказали в интервью' }, { uz: "Yo'q — bosh raqam faqat pul bo'ladi", ru: 'Нет — главное число бывает только деньгами' }], correct: 1 },
  { q: { uz: '«Bajariladimi?» savoli nimani tekshiradi?', ru: 'Что проверяет вопрос «Выполнимо ли?»' }, opts: [{ uz: "Funksiyalar modulga sig'ishini", ru: 'Помещаются ли функции в модуль' }, { uz: 'Muammo gapi qanchalik qisqaligini', ru: 'Насколько коротка фраза-проблема' }, { uz: 'Dalilda nechta odam yozilganini', ru: 'Сколько людей записано в доказательстве' }, { uz: 'Bosh raqam qanday nomlanganini', ru: 'Как названо главное число' }], correct: 0 },
  { q: { uz: 'Mentor tekshiruvida uch savolga ham «ha». Javob qanday?', ru: 'В проверке Ментора на все три вопроса «да». Какой ответ?' }, opts: [{ uz: 'Tuzatish — har ehtimolga qarshi', ru: 'Исправление — на всякий случай' }, { uz: 'Tuzatish — yana intervyular kerak', ru: 'Исправление — нужны ещё интервью' }, { uz: "Javob yo'q — PRD dan oldin kod kutiladi", ru: 'Ответа нет — до PRD ждут код' }, { uz: "Qabul — PRD bilan qursa bo'ladi", ru: 'Принято — можно строить по PRD' }], correct: 3 },
  { q: { uz: "Amazon'da press-reliz qanday yoziladi?", ru: 'Как в Amazon пишут пресс-релиз?' }, opts: [{ uz: 'Mahsulot sotuvga chiqqan kunida', ru: 'В день выхода продукта в продажу' }, { uz: 'Kod tugagach, xatolar bilan birga', ru: 'Когда код готов, вместе с ошибками' }, { uz: "Mahsulot go'yo chiqib bo'lgandek", ru: 'Как будто продукт уже вышел' }, { uz: 'Dasturchilar uchun ichki xat qilib', ru: 'Как внутреннее письмо программистам' }], correct: 2 },
  { q: { uz: "Amazon'da press-reliz hech kimni qiziqtirmasa, nima bo'ladi?", ru: 'Что будет в Amazon, если пресс-релиз никого не заинтересует?' }, opts: [{ uz: 'Mahsulot umuman qilinmaydi', ru: 'Продукт вообще не делают' }, { uz: 'Kichikroq hajmda quriladi', ru: 'Строят в меньшем объёме' }, { uz: 'Baribir oxirigacha quriladi', ru: 'Всё равно строят до конца' }, { uz: 'Boshqa nom bilan chiqadi', ru: 'Выходит под другим названием' }], correct: 0 },
  { q: { uz: "Mentor misolida maydon pulini bo'lishish nega funksiyalardan chiqdi?", ru: 'Почему в примере Ментора деление платы за поле вышло из функций?' }, opts: [{ uz: "Yozuvlarda unga hech qanday sabab yo'q", ru: 'В записях для неё нет никакой причины' }, { uz: 'Bosh raqamni u hech sanab bera olmadi', ru: 'Она никак не могла посчитать главное число' }, { uz: 'Telegram guruhida bu ish allaqachon bor', ru: 'В группе Telegram эта работа уже есть' }, { uz: "U alohida g'oya, shu modulga sig'madi", ru: 'Это отдельная идея, не поместилась в модуль' }], correct: 3 },
  { q: { uz: 'PRD.md faylida «## Dalil» qatori nima?', ru: 'Что такое строка «## Dalil» в файле PRD.md?' }, opts: [{ uz: "JavaScript'dagi izoh qatori", ru: 'Строка комментария в JavaScript' }, { uz: "Fayl nomining bitta bo'lagi", ru: 'Одна часть имени файла' }, { uz: "Dalil bo'limining sarlavhasi", ru: 'Заголовок раздела «Доказательство»' }, { uz: "Ro'yxatdagi bitta band qatori", ru: 'Строка одного пункта списка' }], correct: 2 },
  { q: { uz: 'PRD dagi yechim bo\'limiga nima yoziladi?', ru: 'Что пишется в разделе «Решение» в PRD?' }, opts: [{ uz: "Uchta funksiyaning to'liq tavsifi", ru: 'Полное описание трёх функций' }, { uz: 'Mahsulot nima qilishi, bir gapda', ru: 'Что делает продукт, одной фразой' }, { uz: 'Intervyudagi har bir odamning gapi', ru: 'Слова каждого человека из интервью' }, { uz: 'Ilova qaysi kod tilida yozilishi', ru: 'На каком языке кода пишется приложение' }], correct: 1 },
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
    // Arena tokenlari — SHU darsning mavzusidan (PRD): dekorativ suzuvchi so'zlar
    const TOK = ['PRD', 'dalil', 'qabul', 'tuzatish', 'PRD.md', '##', 'Keyin', 'Qilmaymiz', 'funksiya', 'Markdown'];
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

// 🃏 KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16; KORPUS §61): mexanika qolipda — QKartochka (DE-204)
const KARTOCHKALAR = [
  { front: { uz: "8-Moduldagi to'rt katakka qaysi uch bo'lim qo'shildi?", ru: 'Какие три раздела добавились к четырём клеткам из 8-го модуля?' }, back: { uz: "Dalil, uchta asosiy funksiya va «Qilmaymiz / Keyin»", ru: 'Доказательство, три основные функции и «Не делаем / Потом»' } },
  { front: { uz: "Bu PRD ning dalil bo'limiga nima yoziladi?", ru: 'Что пишется в раздел «Доказательство» этого PRD?' }, back: { uz: "Intervyudan sanoq: nechta odamdan nechtasida muammo bo'lgan", ru: 'Счёт из интервью: у скольких из скольких была проблема' } },
  { front: { uz: "9-Moduldagi «Qilamiz» qutisi PRD ning qaysi bo'limi bo'ldi?", ru: 'Каким разделом PRD стала коробка «Делаем» из 9-го модуля?' }, back: { uz: "Uchta asosiy funksiya bo'limi", ru: 'Раздел «Три основные функции»' } },
  { front: { uz: '«Keyin» bilan «Qilmaymiz» farqi nima?', ru: 'Чем «Потом» отличается от «Не делаем»?' }, back: { uz: "«Keyin»ga yozuvlarda sabab bor, «Qilmaymiz»ga yo'q", ru: 'У «Потом» в записях есть причина, у «Не делаем» — нет' } },
  { front: { uz: 'Nega PRD ga qurilmaydigan ish ham yoziladi?', ru: 'Зачем в PRD пишут и то, что не будут строить?' }, back: { uz: "Yozilmasa, quradigan odam uni o'z taxmini bilan qo'shishi mumkin", ru: 'Если не написать, строящий может добавить это по своей догадке' } },
  { front: { uz: "Bosh raqam nimani ko'rsatadi?", ru: 'Что показывает главное число?' }, back: { uz: "Mahsulot o'z ishini bajarganini ko'rsatadigan bitta raqam", ru: 'Одно число, которое показывает, что продукт делает свою работу' } },
  { front: { uz: 'Mentor tekshiruvida qaysi uch savol beriladi?', ru: 'Какие три вопроса задают в проверке Ментора?' }, back: null },
  { front: { uz: 'Mentor tekshiruvining javobi qanday bo\'ladi?', ru: 'Каким бывает ответ проверки Ментора?' }, back: { uz: 'Qabul yoki tuzatish; tuzatishda bo\'lim nomi aytiladi', ru: 'Принято или исправление; при исправлении называют раздел' } },
  { front: { uz: "Mentor misolida tekshiruvdan so'ng uchinchi funksiya qaysi bo'ldi?", ru: 'Какой стала третья функция в примере Ментора после проверки?' }, back: F_NAVBAT },
  { front: { uz: "Amazon'da press-reliz qanday yoziladi?", ru: 'Как в Amazon пишут пресс-релиз?' }, back: { uz: "Go'yo mahsulot allaqachon chiqqandek — kod hali yo'q", ru: 'Как будто продукт уже вышел — кода ещё нет' } },
  { front: { uz: 'Amazon o\'zi qanday boshlagan?', ru: 'Как начинал сам Amazon?' }, back: { uz: 'Tor: 1995-yilda faqat kitob sotgan', ru: 'Узко: в 1995 году продавал только книги' } },
  { front: { uz: '`PRD.md` da bo\'lim sarlavhasi qanday yoziladi?', ru: 'Как в `PRD.md` пишется заголовок раздела?' }, back: { uz: '`##` belgisi bilan, masalan `## Dalil`', ru: 'Символом `##`, например `## Dalil`' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  // 7-karta javobi — TEKSHIRUV_SAVOLLAR dan (bitta manba, P-063)
  const kartalar = KARTOCHKALAR.map(c => ({ front: fmtCode(tr(c.front)), back: c.back ? tr(c.back).replace(/`/g, '') : TEKSHIRUV_SAVOLLAR.map(s => tr(s.savol)).join(' ') }));
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <div className={cxp('pr-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={kartalar} />
          {!bosildi && <p className="pr-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard («Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'uydagilardan biri', ru: 'кто-то из домашних' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 PRD, 3 savol', ru: '1 PRD, 3 вопроса' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = () => [
  { uz: "`PRD.md` ni yetti bo'limgacha yakunlang — darsdagi PRD ingizdan.", ru: 'Доведите `PRD.md` до семи разделов — по вашему PRD с урока.' },
  { uz: `PRD ni uydagilardan biriga o'qing: u tushunmagan joyni belgilang. Uch savolni esa o'zingiz qayta bering: ${tsQator()}.`, ru: `Прочитайте PRD кому-то из домашних: отметьте место, которое он не понял. А три вопроса задайте себе ещё раз: ${tsQator()}.` },
  { uz: "Tushunilmagan yoki «yo'q» chiqqan bo'limni tuzating — `PRD.md` da ham, darsdagi PRD ingizda ham.", ru: 'Исправьте раздел, который не поняли или где вышло «нет», — и в `PRD.md`, и в PRD на уроке.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card pr-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="pr-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="pr-hw-q"><span className="pr-hw-k">{tr(r.k)}</span><span className="pr-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="pr-hw-qadam">{HW_QADAM().map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{fmtCode(tr(q))}</span></li>)}</ol>
    {keyingi && <span className="pr-hw-keyingi">{keyingi}</span>}
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
  // «Endi siz bilasiz» — bugungi asosiy fikrni takrorlamaydi (T-048); s15 RECAP 5 band
  const RECAP = [
    { uz: "Bizda to'liq PRD — g'oyaning yetti bo'limli bir sahifasi.", ru: 'У нас полный PRD — одна страница идеи из семи разделов.' },
    { uz: 'Bu PRD da dalil — intervyudan sanoq: nechta odamdan nechtasi.', ru: 'В этом PRD доказательство — счёт из интервью: у скольких из скольких.' },
    { uz: "«Keyin»ga yozuvlarda sababi bor ish, «Qilmaymiz»ga sababsiz ish yoziladi.", ru: 'В «Потом» пишут работу с причиной в записях, в «Не делаем» — без причины.' },
    { uz: `Mentor tekshiruvi uch savol beradi: ${tsQator()}.`, ru: `Проверка Ментора задаёт три вопроса: ${tsQator()}.` },
    { uz: "Amazon'da hujjat koddan oldin yoziladi.", ru: 'В Amazon документ пишут до кода.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Bitiruvgacha nimani qachon qurasiz?»</b></>, ru: <>Следующий урок — <b>«Что и когда вы построите до выпуска?»</b></> });
  const p = prdOl();
  const tuzatishBor = !!(p && p.tekshiruv === 'tuzatish');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tuzatishBor && !isMentorL
          ? tr({ uz: <>PRD ingiz yozildi — <A>bitta bo'lim tuzatiladi</A>.</>, ru: <>Ваш PRD написан — <A>один раздел исправят</A>.</> })
          : tr({ uz: <>PRD ingiz yozildi va <A>tekshirildi</A>.</>, ru: <>Ваш PRD написан и <A>проверен</A>.</> })}
        cta={<>
          <div className="pr-fikr fade-up d1"><span className="pr-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="pr-fikr-t small">{tr({ uz: "G'oya bir sahifaga yetti bo'lim bo'lib yoziladi va qurishdan oldin uch savol bilan tekshiriladi.", ru: 'Идея записывается на одну страницу семью разделами и до постройки проверяется тремя вопросами.' })}</p></div>
          {!isMentorL && <PStrip />}
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
export default function PmPrdLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === 11-Modul 5-dars — darsning o'z vizuali (prefiks pr-). Faqat qolip tokenlari (D3); brend ranglari — faqat nomlarda: Maydon Jamoa (#2E9E4F, tayanch 9.62), Amazon, Telegram === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .pr-w { display: flex; flex-direction: column; flex: 1 0 auto; min-width: 0; }
        .pr-kul { font-size: 11.5px; font-weight: 600; color: ${T.ink2}; line-height: 1.35; }
        .pr-mj { color: #2E9E4F; font-weight: 800; font-style: normal; letter-spacing: 0.01em; }
        .pr-amazon { color: #C45500; font-weight: 800; font-style: normal; }
        /* Bosiladigan joy halqasi (SABOQ 11, 32): halqa doim, to'lqin ≤3% · shaffoflik ≤0.35 · 2.4 s; guruhda bitta halqa */
        .pr-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .pr-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pr-tolqin 2.4s ease-in-out 0.4s 3; }
        .pr-guruh, .pr-guruh-w .q-variantlar, .pr-s0.tanlovsiz .q-variantlar-kol { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .pr-guruh::after, .pr-guruh-w .q-variantlar::after, .pr-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pr-tolqin 2.4s ease-in-out 0.5s 3; }
        .pr-guruh-w .q-variantlar { width: fit-content; max-width: 100%; }
        .pr-halqa-i { border-color: ${T.accent} !important; animation: pr-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pr-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.pr-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.pr-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        @keyframes pr-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes pr-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes pr-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pr-sirg { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
        @keyframes pr-yashil { 0%, 70% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { box-shadow: inset 0 0 0 1.5px transparent; } }
        @keyframes pr-acc { 0%, 70% { color: ${T.accent}; } 100% { color: ${T.ink}; } }
        @keyframes pr-son { 0%, 75% { background: ${fon(T.accent, 0.18)}; color: ${T.accent}; } 100% { background: transparent; } }
        @keyframes pr-muhr { 0% { opacity: 0; transform: scale(1.7) rotate(-8deg); } 60% { opacity: 1; transform: scale(0.94) rotate(-4deg); } 100% { opacity: 1; transform: scale(1) rotate(-4deg); } }
        @keyframes pr-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }
        @keyframes pr-tush { from { opacity: 0; transform: translateY(-22px); } to { opacity: 1; transform: none; } }
        @keyframes pr-err { 0%, 60% { background: ${T.errFon}; } 100% { background: ${T.errFon}; } }
        @keyframes pr-bos { 0%, 100% { transform: none; } 40% { transform: scale(0.9); filter: brightness(0.85); } }
        @keyframes pr-yoz-q { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
        /* — ixcham qadam chiplari (QQadamlar gorizontal) — */
        .pr-qq .q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 16px; }
        /* — chap-o'ng almashinuvi: sahifa (vizual) chapda, harakat o'ngda (MD 4, 8-ekran) — */
        @media (min-width: 861px) {
          .pr-ong .q-split { grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); align-items: start; }
          .pr-ong .q-split > .q-col:first-child { order: 2; }
          .pr-s8w .q-split { grid-template-columns: minmax(0,1.75fr) minmax(0,1fr); }
        }
        /* ⛶ — sahifa chapda bo'lgan ekranlarda tugma vizual ichida (o'ng ustundagi qadamlar ustiga tushmasin) */
        .pr-ong .zoomable:not(.zoom-on) > .zoom-btn { top: 6px !important; right: 6px !important; visibility: visible; }
        .pr-ong .pr-sh-h { padding-right: 34px; }
        /* === TELEFON «Maydon Jamoa» (≈170×272, barqaror) === */
        .pr-tel-w { display: flex; flex-direction: column; align-items: center; gap: 7px; flex-shrink: 0; width: 170px; }
        .pr-tel { position: relative; width: 170px; height: 272px; padding: 9px; border-radius: 26px; background: ${T.ink}; box-shadow: 0 18px 34px -18px rgba(${T.shadowBase},0.55); animation: pr-kir 0.5s ease-out both; }
        .pr-tel-k { position: absolute; top: 11px; left: 50%; width: 46px; height: 6px; border-radius: 3px; background: ${fon(T.paper, 0.25)}; transform: translateX(-50%); z-index: 1; }
        .pr-tel-e { height: 100%; display: flex; flex-direction: column; gap: 8px; padding: 24px 10px 10px; border-radius: 19px; background: ${T.bg}; overflow: hidden; animation: pr-kir 0.4s ease-out both; }
        .pr-tel-bar { font-size: 12.5px; padding-bottom: 6px; border-bottom: 1px solid ${T.line}; }
        .pr-elon { display: flex; flex-direction: column; gap: 5px; padding: 10px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.3); transition: box-shadow 0.3s; }
        .pr-elon.toldi { box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .pr-elon-k { font-size: 12.5px; color: ${T.ink}; }
        .pr-elon-m { font-size: 11.5px; color: ${T.ink2}; font-weight: 600; }
        .pr-elon-son { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; animation: pr-sonkir 0.5s ease-out; }
        .pr-elon-son em { display: block; font-style: normal; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 800; color: ${T.ok}; }
        @keyframes pr-sonkir { from { transform: scale(1.35); color: ${T.ok}; } to { transform: none; } }
        .pr-elon-y { display: block; height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .pr-elon-y i { display: block; height: 100%; background: ${T.ok}; transition: width 0.6s ease-out; }
        .pr-elon-b { align-self: stretch; text-align: center; margin-top: 3px; padding: 7px 8px; border-radius: 9px; background: ${T.ok}; color: #FFFFFF; font-size: 12px; font-weight: 800; }
        .pr-elon-b[data-bos] { animation: pr-bos 0.45s ease-in-out; }
        .pr-elon-b.off { background: ${T.line}; color: ${T.ink2}; }
        .pr-tel-e.tg { background: #E9F1F7; }
        .pr-tg-h { font-size: 11.5px; font-weight: 800; color: #FFFFFF; background: #229ED9; margin: -6px -10px 2px; padding: 7px 10px; }
        .pr-tg-ro { display: flex; flex-direction: column; gap: 5px; }
        .pr-tg-x { align-self: flex-start; max-width: 80%; padding: 5px 9px; border-radius: 10px 10px 10px 3px; background: #FFFFFF; font-size: 11.5px; font-weight: 600; color: ${T.ink}; box-shadow: 0 2px 4px -2px rgba(${T.shadowBase},0.2); animation: pr-kir 0.35s ease-out both; animation-delay: calc(var(--i) * 0.1s); }
        .pr-tg-x.ka { font-weight: 800; }
        .pr-tg-x.plus { align-self: flex-end; background: #DCF3C9; border-radius: 10px 10px 3px 10px; }
        .pr-tg-x.rasm i { display: block; width: 74px; height: 34px; border-radius: 6px; background: linear-gradient(135deg, #BFD7EA 0%, #8FB6D8 100%); }
        .pr-tel-izoh { text-align: center; }
        .pr-hafta em { font-style: normal; }
        .pr-hafta { display: flex; flex-direction: column; gap: 3px; align-items: center; text-align: center; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .pr-hafta b { color: ${T.ok}; font-family: 'JetBrains Mono', monospace; font-size: 15px; display: inline-block; animation: pr-sonkir 0.5s ease-out; }
        /* === PRD SAHIFASI === */
        .pr-sahifa-w { display: flex; flex-direction: column; gap: 6px; min-width: 0; container-type: inline-size; }
        /* Keng sahifada yetti bo'lim ikki ustunda (1–4 chapda, 5–7 o'ngda) — sahifa 1280×800 ga sig'adi (SABOQ 25) */
        @container (min-width: 700px) {
          .pr-sahifa.toliq .pr-bo-ro:is(.q6, .q7) { display: block; column-count: 2; column-gap: 14px; }
          .pr-sahifa.toliq .pr-bo-ro:is(.q6, .q7) > li { break-inside: avoid; margin-bottom: 2px; }
          .pr-sahifa.toliq .pr-bo-ro:is(.q6, .q7) > li[data-bolim="funksiyalar"] { break-before: column; }
          .pr-sahifa.toliq .pr-bo { padding: 4px 8px; }
          .pr-sahifa.toliq p.pr-bo-t { font-size: 12px; line-height: 1.4; }
          .pr-sahifa.toliq .pr-bo-ro:is(.q6, .q7) .pr-qutilar { grid-template-columns: minmax(0,1fr); gap: 5px; }
          .pr-sahifa.toliq .pr-bo-ro:is(.q6, .q7) .pr-quti { min-height: 0; padding: 6px 8px; }
        }
        .pr-sahifa { position: relative; display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 14px 16px; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.4), 4px 4px 0 -1px ${T.bg}, 4px 4px 0 0 ${T.line}; min-height: 120px; animation: pr-kir 0.45s ease-out both; }
        .pr-sh-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 22px; }
        .pr-sh-nom { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14.5px; color: ${T.ink}; }
        .pr-muhr { flex-shrink: 0; padding: 4px 11px; border-radius: 8px; border: 2px solid currentColor; font-weight: 800; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; background: ${T.paper}; transform: rotate(-4deg); animation: pr-muhr 0.55s cubic-bezier(.3,1.4,.5,1) both; }
        .pr-muhr.ok { color: ${T.ok}; }
        .pr-muhr.acc { color: ${T.accent}; }
        .pr-muhr.kech { animation-delay: 2s; }
        .pr-muhr.mini { font-size: 10.5px; padding: 2px 7px; text-transform: none; letter-spacing: 0; }
        .pr-katak-g { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 8px; }
        .pr-katak { display: flex; flex-direction: column; gap: 3px; padding: 10px 11px; border-radius: 10px; background: ${T.bg}; }
        .pr-k-s { font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        .pr-k-n { font-size: 13px; color: ${T.ink}; }
        p.pr-k-t { font-size: 12.5px; line-height: 1.45; color: ${T.ink}; }
        .pr-bo-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
        .pr-bo { display: grid; grid-template-columns: 20px minmax(0,1fr); gap: 8px; padding: 7px 8px; border-radius: 9px; transition: background 0.3s, box-shadow 0.3s; }
        .pr-bo-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; padding-top: 1px; }
        .pr-bo-b { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .pr-bo-h { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .pr-bo-nom { font-size: 13px; color: ${T.ink}; }
        .pr-bo-nom.yangi { animation: pr-acc 1.4s ease-out both; }
        p.pr-bo-t { font-size: 12.5px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; }
        .pr-bo.yoz { animation: pr-sirg 0.5s ease-out both, pr-yashil 1.4s ease-out 0.2s both; }
        .pr-bo.tek { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        .pr-bo.tuz { background: ${T.errFon}; box-shadow: inset 0 0 0 1.5px ${fon(T.err, 0.45)}; }
        .pr-bo.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .pr-bo-ok { color: ${T.ok}; font-size: 14px; animation: pr-tush 0.4s ease-out both; }
        .pr-son { font-weight: 800; border-radius: 4px; padding: 0 2px; animation: pr-son 1.8s ease-out both; }
        .pr-yig { align-self: start; display: flex; flex-wrap: wrap; gap: 6px 12px; padding: 6px 8px; border-radius: 9px; background: ${T.bg}; }
        .pr-yig-q { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pr-yig-q i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.accent}; }
        .pr-tahrir { margin-left: auto; width: 24px; height: 24px; margin-top: -3px; margin-bottom: -3px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; font-size: 13px; }
        .pr-tahrir:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .pr-ix { display: flex; flex-direction: column; gap: 8px; }
        .pr-ix-l { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .pr-ix-d { position: relative; width: 120px; height: 7px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .pr-ix-d i { position: absolute; left: 0; top: 0; bottom: 0; background: ${T.accent}; border-radius: 4px; transition: width 0.6s ease-out; }
        .pr-ix-ro { display: flex; flex-wrap: wrap; gap: 6px; }
        .pr-ix-q { display: inline-flex; align-items: center; gap: 5px; padding: 5px 9px; border-radius: 8px; background: ${T.bg}; font-size: 12px; font-weight: 700; color: ${T.ink2}; transition: background 0.3s; }
        .pr-ix-q i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .pr-ix-q b { color: ${T.ok}; }
        .pr-ix-q.ok { color: ${T.ink}; background: ${T.okFon}; }
        .pr-ix-q.joriy { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; background: ${T.paper}; }
        .pr-ix-q.tuz { background: ${T.errFon}; color: ${T.err}; }
        .pr-ix-q.yangi { animation: pr-yashil 1.3s ease-out both; }
        .pr-sahifa-ost { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .pr-ramka { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px dashed ${T.line}; border-radius: 6px; padding: 2px 8px; }
        .pr-osti-m { font-size: 11.5px; font-weight: 600; color: ${T.ink2}; }
        .pr-osti-y { font-size: 11.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 3px 9px; }
        .pr-test-viz { display: flex; flex-direction: column; }
        .pr-rj, .pr-s9-t { width: 100%; }
        .pr-sahifa-w.kichik { max-width: 460px; width: 100%; align-self: center; }
        .pr-sahifa-w.kichik .pr-sahifa { min-height: 0; }
        /* — funksiyalar va qutilar — */
        .pr-fn-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
        .pr-fn-ro.pr-guruh { outline-offset: 3px; border-radius: 10px; }
        .pr-fn { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pr-fn::before { content: '–'; color: ${T.ink2}; }
        .pr-fn.kir { animation: pr-sirg 0.45s ease-out both; animation-delay: calc(var(--i, 0) * 0.35s); }
        .pr-fn.yangi > span { animation: pr-acc 1.6s ease-out 0.3s both; }
        .pr-fn em { font-style: normal; }
        .pr-fn:has(.pr-fn-b)::before { display: none; }
        .pr-fn:has(.pr-fn-b) { display: block; }
        .pr-fn-b { width: 100%; display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; padding: 5px 9px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; font: inherit; font-weight: 700; color: ${T.ink}; text-align: left; cursor: pointer; }
        .pr-fn-b:hover { border-color: ${T.accent}; }
        .pr-fn-b.silk { animation: pr-silk 0.35s ease-in-out; }
        .pr-fn-b em { font-style: normal; }
        .pr-qutilar { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 8px; align-items: start; }
        .pr-quti { display: flex; flex-direction: row; flex-wrap: wrap; align-content: flex-start; gap: 5px; min-height: 44px; padding: 8px 9px; border-radius: 10px; background: ${T.bg}; border: 1.5px solid ${T.line}; }
        .pr-quti.bosh { border-style: dashed; background: ${T.paper}; }
        .pr-quti-h { flex-basis: 100%; display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .pr-quti-n { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.accent}; text-transform: none; letter-spacing: 0; display: inline-block; animation: pr-sonkir 0.4s ease-out; }
        .pr-quti-ch { display: flex; flex-direction: column; gap: 2px; padding: 4px 8px; border-radius: 7px; background: ${T.paper}; box-shadow: 0 1px 0 ${T.line}; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .pr-quti-ch.yangi { animation: pr-tush 0.45s ease-out both, pr-yashil 1.3s ease-out 0.2s both; }
        .pr-quti-dalil { font-style: normal; font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        /* === 0-EKRAN === */
        .pr-s0-maket { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; }
        .pr-s0-o { flex: 0 1 236px; min-width: 160px; max-width: 236px; display: flex; flex-direction: column; gap: 8px; }
        .pr-s0-kartalar { display: flex; gap: 6px; flex-wrap: wrap; min-height: 30px; }
        .pr-yk { padding: 5px 10px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 6px 12px -8px rgba(${T.shadowBase},0.4); font-size: 11.5px; font-weight: 800; color: ${T.ink2}; transform: rotate(calc((var(--i) - 1) * 5deg)); animation: pr-kir 0.4s ease-out both; animation-delay: calc(var(--i) * 0.1s); }
        .pr-yk.ketdi { visibility: hidden; }
        .pr-s0-sahifa .pr-sahifa { min-height: 0; aspect-ratio: 1 / 1.2; }
        .pr-s0-ro { display: flex; flex-direction: column; gap: 6px; }
        p.pr-s0-q { font-size: 11.5px; line-height: 1.4; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 5px 8px; }
        p.pr-javob { margin: 2px 0 0; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .pr-ovoz { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
        .pr-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 90px 22px; align-items: center; gap: 8px; font-size: 12px; color: ${T.ink2}; }
        .pr-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .pr-ovoz-y { height: 7px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .pr-ovoz-y i { display: block; height: 100%; background: ${T.accent}; }
        /* === 1-EKRAN (reja) === */
        .pr-rj-ro { display: flex; flex-direction: column; gap: 7px; }
        p.pr-rj-q { font-size: 12px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 5px 8px; animation: pr-yoz-q 0.6s ease-out both; animation-delay: calc(0.3s + var(--i) * 0.4s); }
        /* === 2-EKRAN === */
        .pr-s2 { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: clamp(14px,2.4vw,26px); align-items: start; }
        .pr-s2-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pr-chap { display: flex; flex-direction: column; gap: 12px; width: 170px; }
        .pr-xul-ost { display: none; }
        .pr-xul-chap p.q-xulosa { font-size: 13px; padding: 10px 12px; }
        .pr-s2-sav { display: flex; flex-wrap: wrap; gap: 8px; }
        .pr-qsavol { display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 11px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; cursor: pointer; }
        .pr-qsavol:disabled { cursor: default; color: ${T.ink2}; opacity: 0.6; }
        .pr-qsavol.ok { opacity: 1; background: ${T.okFon}; border-color: transparent; color: ${T.ink}; }
        .pr-qsavol.ok b { color: ${T.ok}; }
        .pr-qsavol.pr-halqa { border-color: ${T.accent}; color: ${T.accent}; opacity: 1; }
        .pr-bash { display: flex; }
        .pr-bashq { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .pr-bashq-t { white-space: nowrap; }
        .pr-bashq-t b { color: ${T.accent}; }
        .pr-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .pr-tx.ok, .pr-tx b { color: ${T.ok}; }
        .pr-tx b.yoq { color: ${T.err}; }
        /* === 4-EKRAN === */
        .pr-s4-h, .pr-s8-h { display: flex; flex-direction: column; gap: 10px; }
        .pr-ish { display: flex; flex-direction: column; gap: 6px; padding: 18px 18px 20px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.45); animation: pr-kir 0.4s ease-out both; }
        .pr-ish.silk { animation: pr-silk 0.36s ease-in-out; }
        .pr-ish-l { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .pr-ish-n { font-family: 'Manrope', sans-serif; font-size: clamp(18px,2.2vw,22px); font-weight: 800; color: ${T.ink}; }
        .pr-s4-b { display: flex; gap: 10px; align-self: flex-start; }
        .pr-s4-b .q-btn { min-width: 124px; text-align: center; }
        p.pr-sabab { font-size: 13px; line-height: 1.45; color: ${T.ink2}; border-radius: 9px; padding: 7px 10px; animation: pr-yashil 1.3s ease-out both; }
        .pr-s4-s .pr-sahifa { min-height: 0; }
        /* === 6-EKRAN (Amazon) === */
        .pr-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .pr-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 4px; }
        .pr-nuq i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .pr-nuq i.ok { background: ${T.ok}; } .pr-nuq i.cur { background: ${T.accent}; }
        .pr-voqea { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; }
        .pr-voqea > .zoomable { width: 100%; max-width: 520px; }
        p.pr-brend-t { font-size: 13.5px; color: ${T.ink2}; }
        .pr-voqea-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; animation: pr-kir 0.4s ease-out both; }
        .pr-voqea .pr-bash, .pr-voqea .pr-bashq, .pr-voqea p.q-xulosa { width: 100%; max-width: 640px; text-align: left; }
        .am-sahna { display: block; width: 100%; height: auto; }
        .am-nom { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; fill: #FF9900; }
        .am-yil { fill: #FFFFFF; font-weight: 700; }
        .am-kul { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; fill: #8A8478; }
        .am-sar { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800; fill: ${T.ink}; }
        .am-kod { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; fill: #8FA0BA; }
        .am-ok { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 800; fill: ${T.ok}; }
        .am-yoq { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 800; fill: ${T.err}; letter-spacing: 0.04em; }
        .am-q { fill: #D8D2E6; }
        .am-sahna .am-q:not(.toliq) { transform-box: fill-box; transform-origin: left center; animation: pr-am-yoz 0.5s ease-out both; animation-delay: calc(0.5s + var(--i) * 0.45s); }
        @keyframes pr-am-yoz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .am-kir { animation: pr-kir 0.5s ease-out both; animation-delay: calc(var(--i) * 0.12s); }
        .am-kursor { animation: pr-am-kursor 1s steps(2) infinite; }
        @keyframes pr-am-kursor { 50% { opacity: 0; } }
        .am-chiqdi { animation: pr-tush 0.45s ease-out 0.3s both; }
        .am-olomon { animation: pr-am-kulrang 0.9s ease-out 1.4s both; }
        @keyframes pr-am-kulrang { from { filter: none; opacity: 1; } to { filter: grayscale(1); opacity: 0.55; } }
        .am-tush { animation: pr-am-tush 0.5s cubic-bezier(.3,1.4,.5,1) 2.3s both; }
        @keyframes pr-am-tush { from { opacity: 0; transform: translateY(-36px); } to { opacity: 1; transform: none; } }
        .am-yop { transform-box: fill-box; transform-origin: center; animation: pr-am-yop 0.6s ease-in 3s both; }
        @keyframes pr-am-yop { from { transform: scaleY(1); } to { transform: scaleY(0.17); } }
        .am-javon { animation: pr-kir 0.45s ease-out both; animation-delay: calc(0.2s + var(--i) * 0.25s); }
        /* === 8-EKRAN === */
        .pr-s8 { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: clamp(12px,2vw,22px); align-items: start; }
        .pr-s8-o { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .pr-skarta { position: relative; display: flex; flex-direction: column; gap: 9px; padding: 18px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.45); animation: pr-kir 0.4s ease-out both; }
        .pr-skarta.silk { animation: pr-silk 0.36s ease-in-out; }
        .pr-skarta.xira { opacity: 0.55; }
        .pr-skarta-s { font-family: 'Manrope', sans-serif; font-size: clamp(18px,2.2vw,21px); font-weight: 800; color: ${T.ink}; }
        p.pr-skarta-q { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        p.pr-skarta-q span { font-weight: 800; color: ${T.ink2}; }
        .pr-skarta-b { display: flex; gap: 10px; align-self: flex-start; flex-wrap: wrap; }
        .pr-skarta-b .q-btn { min-width: 92px; text-align: center; }
        .pr-chap-k { font-size: 30px; font-weight: 800; color: ${T.accent}; line-height: 1; animation: pr-chap 1.6s ease-in-out 3; }
        @keyframes pr-chap { 0%, 100% { transform: none; } 50% { transform: translateX(-6px); } }
        /* === 9, 10-EKRAN (bo'lim kartasi) === */
        .pr-s9-ix .pr-sahifa { min-height: 0; padding: 10px 14px; }
        .pr-s9-k { display: flex; flex-direction: column; }
        .pr-bk { display: flex; flex-direction: column; gap: 9px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},0.45); }
        .pr-bk.kir { animation: pr-kir 0.4s ease-out both; }
        .pr-bk-h { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px 10px; }
        .pr-bk-n { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.accent}; }
        .pr-bk-nom { font-size: 16px; color: ${T.ink}; }
        .pr-bk-s { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .pr-inp { width: 100%; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 11px; resize: vertical; outline: none; }
        .pr-inp:focus { border-color: ${T.accent}; background: ${T.paper}; }
        .pr-inp.xato { animation: pr-err 0.6s ease-out both; }
        .pr-hisob { align-self: flex-end; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .pr-hisob.chet { color: ${T.accent}; }
        .pr-fk { display: flex; flex-direction: column; gap: 7px; }
        .pr-fk-l { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .pr-fk-q { display: grid; grid-template-columns: 22px minmax(0,1fr) auto; align-items: center; gap: 8px; }
        .pr-fk-q .pr-hisob { align-self: center; }
        .pr-fk-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .pr-yana { align-self: flex-start; }
        .pr-xato-q { display: flex; flex-direction: column; gap: 3px; }
        .pr-bk-amal { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pr-bk-amal > :last-child { margin-left: auto; }
        .q-mustaqil:has(.pr-s10) { max-width: none; }
        .q-mustaqil:has(.pr-s9-k) { max-width: 760px; margin-left: auto; margin-right: auto; }
        .pr-s10 { display: grid; grid-template-columns: minmax(0,1.2fr) minmax(0,1fr); gap: clamp(14px,2.4vw,24px); align-items: start; }
        .pr-s10.tugadi { grid-template-columns: minmax(0,1fr); }
        .pr-s10-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        /* === 11-EKRAN (PRD.md) === */
        .pr-strip { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pr-strip-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; color: ${T.accent}; }
        .pr-strip-d { position: relative; width: 100px; height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .pr-strip-d i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: ${T.accent}; transition: width 0.6s ease-out; }
        .pr-strip-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pr-strip-f { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ok}; }
        .pr-darvoza { display: flex; flex-direction: column; gap: 7px; margin: 8px 0; }
        .pr-darvoza-s { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; color: ${T.ink}; }
        .pr-darvoza-ro { display: flex; flex-wrap: wrap; gap: 8px; width: fit-content; max-width: 100%; }
        .pr-vazifa { list-style: none; margin: 2px 0 10px; padding: 0; display: flex; flex-direction: column; gap: 6px; transition: opacity 0.3s; }
        .pr-vazifa.xira { opacity: 0.45; }
        .pr-vazifa li { display: grid; grid-template-columns: 24px minmax(0,1fr); gap: 9px; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .pr-vazifa li i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.ink2}; }
        .pr-vazifa li.ok i { background: ${T.ok}; border-color: ${T.ok}; color: #FFFFFF; }
        .pr-kyordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; margin-bottom: 8px; }
        .pr-bajardim { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; margin-top: auto; }
        .pr-bajardim > .q-btn:last-child { margin-left: auto; }
        .pr-md { display: flex; flex-direction: column; border-radius: 14px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 16px 30px -18px rgba(${T.shadowBase},0.6); min-height: 0; }
        .pr-md-bar { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: #141C2B; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .pr-md-bar i { width: 9px; height: 9px; border-radius: 50%; background: #3A4458; }
        .pr-md-bar span { margin-left: 6px; font-weight: 700; }
        .pr-md-bar em { margin-left: auto; font-style: normal; color: ${CODE.comment}; }
        .pr-md-k { display: flex; flex-direction: column; gap: 3px; padding: 12px 14px; max-height: 360px; overflow: auto; }
        .pr-md-bo { display: flex; flex-direction: column; gap: 3px; padding-top: 8px; }
        p.pr-md-q { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        p.pr-md-q.sar { color: #FFFFFF; font-weight: 700; }
        .pr-md-b { color: ${CODE.tag}; font-weight: 800; user-select: none; -webkit-user-select: none; }
        p.pr-md-q.sar.ajrat .pr-md-b { animation: pr-md-ajrat 1.2s ease-out both; animation-delay: calc(var(--i) * 0.18s); }
        @keyframes pr-md-ajrat { 0%, 70% { color: #FFFFFF; background: ${fon(CODE.tag, 0.45)}; border-radius: 4px; } 100% { color: ${CODE.tag}; } }
        .pr-md-ok { margin-left: 8px; color: ${CODE.str}; animation: pr-tush 0.4s ease-out both; animation-delay: calc(var(--i) * 0.15s); }
        .pr-nusxa { align-self: flex-start; margin-top: 2px; padding: 3px 9px; border-radius: 7px; border: 1px solid #36425A; background: transparent; color: ${CODE.punct}; font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 700; cursor: pointer; }
        .pr-nusxa:hover { border-color: ${CODE.punct}; color: #FFFFFF; }
        .pr-nusxa.ok { color: ${CODE.str}; border-color: ${CODE.str}; }
        /* === umumiy: eslatma, nishon, mentor statistikasi === */
        .pr-mnote-c { align-self: flex-end; }
        .pr-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .pr-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        p.pr-nishon { font-size: 12px; color: ${T.ink2}; }
        p.pr-nishon.ketdi { color: ${T.ink2}; opacity: 0.8; }
        .pr-mstat { display: flex; gap: 10px; flex-wrap: wrap; }
        .pr-mstat-q { display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; border-radius: 12px; background: ${T.accentSoft}; min-width: 150px; }
        .pr-mstat-q b { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: ${T.accent}; }
        .pr-mstat-q span { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        /* === kartochkalar (SABOQ 16): birinchi bosishgacha karta yuzi halqada === */
        .pr-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: pr-halqa-k 2.4s ease-in-out 0.4s 3; }
        @keyframes pr-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 3px ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 7px ${fon(T.accent, 0.3)}; } }
        p.pr-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; font-size: 13.5px; font-weight: 700; color: ${T.accent}; text-align: center; }
        p.pr-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* === yakun === */
        .pr-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .pr-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.pr-fikr-t { color: ${T.ink}; font-weight: 600; line-height: 1.5; }
        .pr-hw { display: flex; flex-direction: column; gap: 10px; }
        .pr-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .pr-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .pr-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .pr-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .pr-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .pr-hw-qadam li { display: grid; grid-template-columns: 22px minmax(0,1fr); gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .pr-hw-qadam li i { font-style: normal; color: ${T.accent}; font-weight: 800; }
        .pr-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        /* === telefon kengligi === */
        @media (max-width: 860px) {
          .pr-s10 { grid-template-columns: minmax(0,1fr); }
        }
        @media (max-width: 640px) {
          .pr-s2, .pr-s8 { grid-template-columns: minmax(0,1fr); justify-items: center; }
          .pr-s2-o, .pr-s8-o { width: 100%; }
          .pr-xul-chap { display: none; } .pr-xul-ost { display: block; }
          .pr-s0-maket { justify-content: center; }
          .pr-katak-g, .pr-qutilar { grid-template-columns: minmax(0,1fr); }
          .pr-hw-karta { grid-template-columns: minmax(0,1fr); }
          .pr-s4-b .q-btn, .pr-skarta-b .q-btn { min-width: 0; flex: 1; }
          .pr-s4-b, .pr-skarta-b { align-self: stretch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pr-halqa::after, .pr-guruh::after, .pr-guruh-w .q-variantlar::after, .pr-s0.tanlovsiz .q-variantlar-kol::after, .stage-nav .btn-white-accent::after { animation: none !important; }
          .am-olomon { filter: grayscale(1); opacity: 0.55; } .am-yop { transform: scaleY(0.17); }
          .pr-halqa-i, .pr-tel, .pr-tel-e, .pr-tg-x, .pr-elon-son, .pr-elon-b, .pr-sahifa, .pr-muhr, .pr-bo, .pr-bo-nom, .pr-son, .pr-fn, .pr-fn > span, .pr-quti-n, .pr-quti-ch, .pr-yk, p.pr-rj-q, .pr-ish, p.pr-sabab, .pr-skarta, .pr-chap-k, .pr-bk, .pr-ix-q, .pr-hafta b, .pr-bo-ok, .pr-md-ok, .pr-md-b, .am-sahna *, .pr-flash .fc-front, .pr-voqea-h { animation: none !important; }
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
