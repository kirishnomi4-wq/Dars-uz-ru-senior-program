import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul · 4-dars (PM + amaliyot) «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» — kalit m8-04, 12 ekran. Skeletdan (src/skelet/NamunaDars.jsx) qurildi, konveyer 06.10.2026.
// Manba-haqiqat: feedback/F-1005-10modul/04-PmAbTest-v3.md (GATE M) · saboqlar: feedback/F-1005-10modul/QURUVCHI_SABOQ.md.
// Bitta vizual — A/B maketi (AbTel · AbQadam · AbOqim · GipKarta; bitta manba MAYDON_AB, GIPOTEZA, SINF). Keys — K9 Booking.com (bank).
// Amaliyot — repo bloklari A1/A2 (QBlok); A1 5-qadami — gipoteza (USTAXONA), saqlanadi pm-m8d4-gipoteza; o'qiydi pm-m8d1-okr.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QVoqea, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm8-04-v1', lessonTitle: { uz: 'Ikki variantdan qaysi biri yaxshiroq ishlaydi?', ru: 'Какой из двух вариантов работает лучше?' } };
// 12 ekran (MD v3): kirish → reja → gipoteza → 1-savol → Booking.com → ikki guruh → amaliyot 1 → amaliyot 2 → yakuniy savol → podium → kartochkalar → yakun
// Uyga vazifa banneri fon so'zlari (R-008, faqat so'z)
const HW_TOKENS = [
  { t: { uz: 'gipoteza', ru: 'гипотеза' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: 'A/B test', l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'variant', ru: 'вариант' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'foiz', ru: 'процент' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
// SCREEN_INTENTS — har ekran nima uchun bor (o'quvchi nima QILADI yoki nima BILADI)
const SCREEN_INTENTS = [
  'hook: tugmaning ikki matni — qaysi biri yaxshiroq (ballsiz)', 'reja: A/B maketi o\'zi o\'ynaydi + 4 qadam', 'gipoteza: uch bo\'lak tanlanadi, telefon javob beradi (atama)',
  '1-savol: kun strelkalariga eng yaqin raqam', 'Booking.com: A/B test atamasi va 2017-yil raqami (ikki bashorat)', 'ikki guruh: uch usul sinaladi, maket yuradi',
  'amaliyot 1: variant va tugma matni; o\'z gipotezasi (pm-m8d4-gipoteza)', 'amaliyot 2: dashboard\'da A va B foizi, sinfdoshlar ochadi', 'yakuniy savol: 17 ta brauzer — xulosa hali erta',
  'podium', 'kartochkalar', 'yakun'
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
              <div className="mono small" style={{ color: T.ink2, whiteSpace: 'nowrap' }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s3 — C (2), s8 — B (1) (MD, yangi dars). practice: -1 — bloklar signali (sentinel); s2/s5 jonli signal yubormaydi.
const INLINE_KEYS = { s3: 2, s8: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida emoji o'rniga raqam (S-026)
const RECAPS = {
  3: {
    title: { uz: 'Eng yaqin raqam', ru: 'Самое близкое число' },
    cards: [
      { ic: '1', h: { uz: "O'zgarish qaysi qadamda?", ru: 'На каком шаге изменение?' }, body: { uz: <>Bu misolda o'zgarish qaysi qadamda turganini toping: kun strelkalari — <b>vaqt tanlashdan oldin</b>.</>, ru: <>В этом примере найдите, на каком шаге стоит изменение: стрелки дня — <b>до выбора времени</b>.</> } },
      { ic: '2', h: { uz: "O'sha qadamning foizi", ru: 'Процент этого шага' }, body: { uz: <>Raqam — o'sha qadamning foizi: <b>ochganlardan vaqtni tanlaganlar</b>.</>, ru: <>Число — процент этого шага: <b>выбравшие время среди открывших</b>.</> } },
      { ic: '3', h: { uz: 'Tugma — keyingi qadam', ru: 'Кнопка — следующий шаг' }, body: { uz: <>Tugma matni esa keyingi qadamga tegadi: <b>vaqtni tanlaganlardan band qilganlar</b>.</>, ru: <>А текст кнопки касается следующего шага: <b>забронировавшие среди выбравших время</b>.</> }, ask: { uz: "Formadagi «Ism» qatorini olib tashlasak, qaysi raqamga qaraysiz?", ru: 'Если убрать из формы строку «Имя», на какое число вы посмотрите?' } }
    ]
  },
  8: {
    title: { uz: '17 ta brauzer', ru: '17 браузеров' },
    cards: [
      { ic: '1', h: { uz: 'A guruhi', ru: 'Группа A' }, body: { uz: <>A: 9 tadan 3 — <b>taxminan 33 foiz</b>.</>, ru: <>A: 3 из 9 — <b>примерно 33 процента</b>.</> } },
      { ic: '2', h: { uz: 'B guruhi', ru: 'Группа B' }, body: { uz: <>B: 8 tadan 4 — <b>50 foiz</b>.</>, ru: <>B: 4 из 8 — <b>50 процентов</b>.</> } },
      { ic: '3', h: { uz: 'Xulosa hali erta', ru: 'Выводы делать рано' }, body: { uz: <>17 ta brauzer xulosa uchun kam — <b>test davom etadi</b>, raqam kuzatiladi.</>, ru: <>17 браузеров для вывода мало — <b>тест продолжается</b>, число наблюдают.</> }, ask: { uz: 'B oldinda. Nega hali hammaga B ni qo\'ymaymiz?', ru: 'B впереди. Почему мы пока не ставим B всем?' } }
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

// ===== YORDAMCHILAR (darsning o'zi) =====
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const cxx = (...a) => a.filter(Boolean).join(' ');
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const norm = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/\s+/g, ' ').trim();
const qisqa = (s, n = 46) => { const t = String(s || '').trim(); return t.length > n ? `${t.slice(0, n - 1).trim()}…` : t; };
// Taymerlar ekrandan chiqilganda tozalanadi; ssenariy qayta boshlansa — eskisi to'xtaydi
const useTaymer = () => {
  const ref = useRef([]);
  useEffect(() => () => { ref.current.forEach(clearTimeout); ref.current = []; }, []);
  const qoy = useCallback((fn, ms) => { ref.current.push(setTimeout(fn, ms)); }, []);
  const tozala = useCallback(() => { ref.current.forEach(clearTimeout); ref.current = []; }, []);
  return useMemo(() => ({ qoy, tozala }), [qoy, tozala]);
};
// 40 soniya harakatsizlikda bitta ipucha (P-033; javobni aytmaydi)
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
// Son sanab o'sadi (SABOQ 19): 0 dan maqsadgacha; reduced-motion — darhol
const useSanoq = (n, faol = true, kech = 300, ms = 800) => {
  const [v, setV] = useState(() => (faol && !kamHarakat() ? 0 : n));
  useEffect(() => {
    if (!faol || kamHarakat()) { setV(n); return undefined; }
    let raf = 0; let t0 = 0;
    const qadam = (t) => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / ms); setV(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(qadam); };
    const id = setTimeout(() => { raf = requestAnimationFrame(qadam); }, kech);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, [n, faol, kech, ms]);
  return v;
};
// P-051: mashq yakunida xulosaga silliq skroll (boshidan tugagan ekranda — yo'q)
const useXulosaSkroll = (on, boshdanTugagan) => {
  const bosh = useRef(!!boshdanTugagan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 1700);
    return () => clearTimeout(t);
  }, [on]);
};
// O'qituvchi eslatmasi — faqat mentor proyektorida, yig'ilgan chip
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const [open, setOpen] = useState(false);
  if (!gate.live || gate.live.mode !== 'mentor') return null;
  if (!open) return <button type="button" className="mnote-chip" onClick={() => setOpen(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</button>;
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} role="note">
      <span className="mnote-lbl">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span>
      <span className="mnote-body">{children}</span>
    </div>
  );
};
// 151-qonun: birinchi urinish nishoni — shart oldindan aytiladi
const AchRule = ({ screen }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <span className={cxx('ab-ach', lost && 'lost')}>{lost
    ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' })
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</span>;
};
// Jonli dars: hook ovozlari chizig'i (J-026 — hammaga correct: false)
const OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [n, setN] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await liveAnswers(pin, screen); if (on) setN(variantlar.map((_, i) => rows.filter(r => r.picked === i).length)); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!n) return null;
  const jami = n.reduce((a, b) => a + b, 0);
  return (
    <div className="ab-ovoz fade-step" aria-label={tr({ uz: 'Jonli natija', ru: 'Живой результат' })}>
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('ab-ovoz-q', mening === i && 'men')}>
          <span className="ab-ovoz-t">{v}</span>
          <span className="ab-ovoz-yol"><i style={{ width: `${jami ? Math.round((n[i] / jami) * 100) : 0}%` }} /></span>
          <span className="ab-ovoz-n">{n[i]}</span>
        </div>
      ))}
    </div>
  );
};
// Bashorat (181) — kirishda ko'tariladi, variantlar navbat bilan; tanlangach ixcham qatorga «yig'iladi» va natijagacha turadi (SABOQ 11, 19)
const TAXMIN_L = { uz: 'Taxminingiz', ru: 'Ваш прогноз' };
const Bashorat = ({ yorliq, savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="ab-bash"><QBashorat yorliq={yorliq || tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="ab-taxmin"><span className="ab-taxmin-l">{tr(TAXMIN_L)}</span><span className="ab-taxmin-s">{savol}</span><b className="ab-taxmin-j">{(variantlar.find(v => v.k === tanlov) || {}).t}</b></div>);

// ===== DARSNING BITTA VIZUALI — A/B maketi (163, 180). Bitta manba: MAYDON_AB · GIPOTEZA · SINF (tayanch 1 va 3 aynan) =====
// Bo'laklar: AbTel (o'yinchi telefoni = «Maydon» sayti) · AbQadam (mini uch qadam) · AbOqim (kirish oqimi va ajratgich) · GipKarta (gipoteza kartasi) · DashAB (dashboard'ning A/B qismi).
// qolip-maket: ab-telefon ab-qism ab-usul
const SOAT = '18:00';
const MAYDON_AB = {
  tugma: { A: { uz: 'Band qilish', ru: 'Забронировать' }, B: (soat) => ({ uz: `${soat} ni band qilish`, ru: `Забронировать ${soat}` }) },
  forma: { uz: 'Bugun · 18:00–19:00', ru: 'Сегодня · 18:00–19:00' },
  soatlar: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
};
const tugmaT = (v) => tr(v === 'B' ? MAYDON_AB.tugma.B(SOAT) : MAYDON_AB.tugma.A);
const UCH_QADAM = [
  { k: 'ochdi', t: { uz: 'ochdi', ru: 'открыл' } },
  { k: 'tanladi', t: { uz: 'vaqtni tanladi', ru: 'выбрал время' } },
  { k: 'band', t: { uz: 'band qildi', ru: 'забронировал' } }
];
// Mentor gipotezasi (qaror 7; dars bo'yi aynan) — kodda `olchov`, o'quvchi matnida «Raqam» (T-066)
const GIPOTEZA = {
  agar: { uz: 'tugmada tanlangan soatni yozsak', ru: 'напишем на кнопке выбранное время' },
  ozgaradi: { uz: "vaqtni tanlaganlardan ko'proq o'yinchi band qiladi", ru: 'больше игроков из выбравших время забронируют' },
  chunki: { uz: "o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi", ru: 'игрок видит прямо на кнопке, какое время бронирует' },
  olchov: { uz: 'vaqtni tanlaganlardan band qilganlar foizi', ru: 'процент забронировавших среди выбравших время' }
};
// Mentor misoli, sinfda (tayanch 1): A — 9 tadan 3, B — 8 tadan 4 (har qadamda turli brauzerlar soni)
const SINF = { A: { tanladi: 9, band: 3 }, B: { tanladi: 8, band: 4 } };
const foizi = (g) => (g.tanladi ? Math.round((g.band / g.tanladi) * 100) : 0);

// O'yinchi telefoni = «Maydon» sayti (SABOQ 22–23): o'lchami barqaror 172×272 — bosh ekranda ham, ikki telefonli ekranda ham; yorliq ramka ustida, ostida — children.
// v: tugma matni ('A' | 'B') · rang: ramka rangi (A — kulrang, B — accent; kirishda — betaraf) · sahifa: 'forma' | 'kataklar' (forma vaqt tanlangach ochiladi) ·
// yangi: tugma yonida kulrang «yangi» matn (2-ekran) · strelka: «‹ Bugun ›» kattalashgan (3-ekran) · pufak: o'yinchi o'yi · chaqnash: tugma bir lahza yonadi
const AbTel = ({ v = 'A', rang, yorliq, sahifa = 'forma', on, xira, pufak, yangi, strelka, chaqnash, onBos, navbat, kir, className, children }) => {
  const ichi = (
    <>
      <span className="ab-tel-manzil" aria-hidden="true"><i /></span>
      <span className="ab-tel-s">
        <b className="ab-tel-nom">Maydon</b>
        <span className={cxx('ab-kun', strelka && 'katta')}>{strelka && <i>‹</i>}<span>{tr({ uz: 'Bugun', ru: 'Сегодня' })}</span>{strelka && <i>›</i>}</span>
        <span className="ab-kataklar">{MAYDON_AB.soatlar.map(s => <span key={s} className={cxx('ab-katak', s === SOAT && sahifa === 'forma' && 'on')}>{s}</span>)}</span>
        {sahifa === 'forma' && <span className="ab-forma" key="f">
          <span className="ab-forma-s">{tr(MAYDON_AB.forma)}</span>
          <span className="ab-inp"><small>{tr({ uz: 'Ism', ru: 'Имя' })}</small></span>
          <span className="ab-inp"><small>{tr({ uz: 'Telefon', ru: 'Телефон' })}</small></span>
        </span>}
      </span>
      {sahifa === 'forma' && <span key={`t${v}${chaqnash || ''}`} className={cxx('ab-tel-tugma', chaqnash && 'chaq')}>{tugmaT(v)}{yangi && <small className="ab-tel-teg">{tr({ uz: 'hozir', ru: 'сейчас' })}</small>}</span>}
    </>
  );
  const ramka = cxx('ab-telefon', rang && (v === 'B' ? 'b' : 'a'), on && 'on', xira && 'xira', navbat && 'ab-navbat');
  return (
    <div className={cxx('ab-tel-ust', className)} style={kir != null ? { '--d': `${kir}ms` } : undefined}>
      {yorliq && <span className={cxx('ab-tel-yorliq', rang && v === 'B' && 'b')}>{yorliq}</span>}
      <span className="ab-tel-joy">
        {onBos ? <button type="button" className={ramka} onClick={onBos}>{ichi}</button> : <span className={ramka}>{ichi}</span>}
        {yangi && <span className="ab-yangi"><small className="ab-tel-teg">{tr({ uz: 'yangi', ru: 'новый' })}</small>{tugmaT('B')}</span>}
        {pufak && <span key={tr(pufak)} className="ab-pufak">{tr(pufak)}</span>}
      </span>
      {children}
    </div>
  );
};
// Telefonning pastki qismi (A1 natijasi, 4-ekran 5/5): o'sha telefon — eni 172, forma va tugma; tepasi kesilgan (sahifa balandligi uchun)
const TelPast = ({ v = 'A', rang, yorliq, kir }) => (
  <div className="ab-tel-ust" style={kir != null ? { '--d': `${kir}ms` } : undefined}>
    {yorliq && <span className={cxx('ab-tel-yorliq', rang && v === 'B' && 'b')}>{yorliq}</span>}
    <span className={cxx('ab-past', rang && (v === 'B' ? 'b' : 'a'))}>
      <span className="ab-forma">
        <span className="ab-forma-s">{tr(MAYDON_AB.forma)}</span>
        <span className="ab-inp"><small>{tr({ uz: 'Ism', ru: 'Имя' })}</small></span>
        <span className="ab-inp"><small>{tr({ uz: 'Telefon', ru: 'Телефон' })}</small></span>
      </span>
      <span className="ab-tel-tugma">{tugmaT(v)}</span>
    </span>
  </div>
);
// Mini uch qadam (telefon ostida): ochdi · vaqtni tanladi · band qildi — raqamsiz; «vaqtni tanladi → band qildi» oralig'ida foiz yorlig'i («?» yoki «foiz»)
// yon: yongan ustun · ochir: kulrang chiziq bilan o'chgan ustun · foiz: null ('?') | 'on' | 'yuq' ('?' va yuqoriga strelka) · strelka: «band qildi» ustida ↑ · soroq: uch ustun ustida «?» · kalendar · chiziq: ustunlar kulrang chiziq (reja)
const AbQadam = ({ yon, ochir, foiz, strelka, soroq, kalendar, chiziq }) => (
  <span className={cxx('ab-qadam', chiziq && 'chiziq')}>
    {soroq && <b className="ab-q-soroq" key="s">?</b>}
    {kalendar && <span className="ab-q-kal" key="k" aria-hidden="true"><i /></span>}
    <span className="ab-q-ust">
      {UCH_QADAM.map((q, i) => (
        <span key={q.k} className={cxx('ab-q-u', yon === q.k && 'yon', ochir === q.k && 'ochir')}>
          <span className="ab-q-bar">{strelka && q.k === 'band' && <b className="ab-q-str" key="st">↑</b>}<i style={{ height: chiziq ? undefined : `${[100, 64, 34][i]}%` }} /></span>
          <span className="ab-q-n">{tr(q.t)}</span>
        </span>
      ))}
      {!chiziq && <span key={`f${foiz || 'b'}`} className={cxx('ab-q-foiz', foiz === 'on' && 'on', foiz === 'yuq' && 'yuq')}>{foiz === 'on' ? tr({ uz: 'foiz', ru: 'процент' }) : '?'}{foiz === 'yuq' && <b>↑</b>}</span>}
    </span>
  </span>
);

// Kirish oqimi (1 va 5-ekran): brauzer belgilari (doira + qisqa ID) tepadan keladi → ajratgich → A (kulrang halqa) yoki B (accent halqa) tomoniga o'tadi.
// belgilar: [{ id, v: 'A'|'B'|null, joy: 'start'|'guruh', k, ikki, ok, yangila }] · ajrat: ajratgich ko'rinadi · kal: 1-usul kalendari · yorliq: chiziq ustidagi yorliq
const belgiJoy = (b, past) => (b.joy === 'start'
  ? { left: '50%', top: '4px' }
  : { left: `calc(${b.v === 'B' ? 75 : 25}% + ${(b.k - 1.5) * 20}px)`, top: `${past}px` });
const AbOqim = ({ belgilar = [], ajrat = true, kal, elon, yorliq, pufak, ixcham }) => (
  <div className={cxx('ab-oqim', ixcham && 'ixcham')} aria-hidden={!pufak && !yorliq ? 'true' : undefined}>
    {ajrat && !kal && <svg className="ab-ayri" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M200 20 L200 30 L100 54 M200 30 L300 54" />
      <rect x="194" y="24" width="12" height="12" transform="rotate(45 200 30)" />
    </svg>}
    {kal && <div className="ab-kal">
      <span className="ab-kal-k a">{tr({ uz: "O'tgan hafta", ru: 'Прошлая неделя' })} · A</span>
      <span className="ab-kal-k b">{tr({ uz: 'Bu hafta', ru: 'Эта неделя' })} · B{elon && <span className="ab-elon">{tr({ uz: "Mahalla chatida e'lon", ru: 'Объявление в чате махалли' })}</span>}</span>
    </div>}
    {belgilar.map(b => (
      <span key={b.key || b.id} className={cxx('ab-br', b.kul && 'kul', !b.kul && b.v === 'A' && 'a', !b.kul && b.v === 'B' && 'b', b.ikki && 'ikki', b.ok && 'ok', b.joy === 'start' && 'start')} style={belgiJoy(b, ixcham ? 28 : 44)}>
        <i>{b.yangila ? '↻' : b.ok ? '✓' : ''}</i>{!b.kul && (b.joy === 'start' || b.ok) && <code>{b.id}</code>}
      </span>
    ))}
    {yorliq && <span className="ab-oqim-y fade-step">{yorliq}</span>}
    {pufak && <span key={tr(pufak)} className="ab-pufak ab-pufak-oqim">{tr(pufak)}</span>}
  </div>
);
// Ikki telefon yonma-yon (0, 1, 5-ekran, bloklar): A «Band qilish» | B «18:00 ni band qilish»
const AbJuft = ({ ust, chap, ong, orta, className }) => (
  <div className={cxx('ab-juft-ust', className)}>
    {ust}
    <div className="ab-juft">{chap}{ong}{orta}</div>
  </div>
);

// Gipoteza kartasi (2-ekran) — to'rt qator: «Agar …» · «… o'zgaradi» · «chunki …» · «Raqam»; holatlar: bo'sh (uzuq chiziq) · yozildi · joriy (accent) · xato (err fon)
const GIP_QATOR = [
  { k: 'agar', l: { uz: 'Agar …', ru: 'Если …' } },
  { k: 'ozgaradi', l: { uz: "… o'zgaradi", ru: '… изменится' } },
  { k: 'chunki', l: { uz: 'chunki …', ru: 'потому что …' } },
  { k: 'olchov', l: { uz: 'Raqam', ru: 'Число' } }
];
// Mentor gipotezasining to'liq gapi (tugadi holati, MD 2-ekran)
const GipGap = ({ g }) => (
  <span className="ab-gap">
    {tr({ uz: 'Agar', ru: 'Если' })} <b>{g.agar}</b>, <b>{g.ozgaradi}</b>, {tr({ uz: 'chunki', ru: 'потому что' })} <b>{g.chunki}</b>. {tr({ uz: 'Raqam', ru: 'Число' })}: <b>{g.olchov}</b>.
  </span>
);

// ===== SCREEN 0 — KIRISH (QKirish: chapda ikki telefon — tugmaning ikki matni, o'ngda radio-variantlar; J-026 — ballsiz, javob ikkalasida bir xil) =====
const HOOK_OPTS = [
  { id: 'chap', t: { uz: 'Chapdagi tugma', ru: 'Левая кнопка' } },
  { id: 'ong', t: { uz: "O'ngdagi tugma", ru: 'Правая кнопка' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const faol = picked === null && !isMentor;
  const ochiq = picked !== null || isMentor;
  const tel = (v, id, kir) => (
    <AbTel v={v} kir={kir} on={picked === id} onBos={faol ? () => pick(id) : undefined}>
      <span key={ochiq ? 'o' : 'b'} className={cxx('ab-joy', ochiq && 'tola')}>{ochiq && <>{tr({ uz: 'band qildi', ru: 'забронировали' })}: <b>?</b></>}</span>
    </AbTel>
  );
  return (
    <Stage eyebrow={tr({ uz: '«Maydon» tugmasi', ru: 'Кнопка «Maydon»' })} screen={screen} navContent={<NavNext optionalLive disabled={faol} label={faol ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите одну' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Ikki variantdan <A>qaysi biri</A> yaxshiroq ishlaydi?</>, ru: <><A>Какой</A> из двух вариантов работает лучше?</> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolida «Maydon» formasidagi tugma ikki xil yozildi. O'yinchi bo'lib ikkalasiga qarang va bittasini tanlang.", ru: 'В примере Ментора кнопку в форме «Maydon» написали по-разному. Посмотрите на обе глазами игрока и выберите одну.' })}</Mentor>}
        maket={<AbJuft className={cxx('ab-s0', faol && 'kut')} chap={tel('A', 'chap', 0)} ong={tel('B', 'ong', 110)} orta={ochiq && <b className="ab-katta-soroq" aria-hidden="true">?</b>} />}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Ikkalasi ham bo'lishi mumkin. Qaysi birida ko'proq o'yinchi band qilishini taxmin emas, raqam ko'rsatadi.", ru: 'Может быть и та, и другая. В какой больше игроков забронируют, покажет не догадка, а число.' })}</p>}
          {isLive && (picked !== null || isMentor) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
        </>}
      >
        <MentorNote>{tr({ uz: "Tugma — o'tgan modulda sinovdan keyin telefon ekrani pastiga qotirilgan o'sha «Band qilish». Sinfdan so'rang: «Siz o'yinchi bo'lsangiz, qaysi biri sizga aniqroq?» — javobni ochiq qoldiring: bugun raqam emas, savolni to'g'ri qo'yish o'rganiladi.", ru: "Кнопка — та самая «Забронировать», которую в прошлом модуле после проверки закрепили внизу экрана телефона. Спросите класс: «Будь вы игроком, какая вам понятнее?» — ответ оставьте открытым: сегодня учимся не числу, а правильному вопросу." })}</MentorNote>
      </QKirish>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda A/B maketi o'zi o'ynaydi — kulrang doiralar ikki telefonga bo'linadi, raqamsiz; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: "Tajribani tekshirsa bo'ladigan gapga aylantirasiz", ru: 'Превратите эксперимент во фразу, которую можно проверить' }, teg: { uz: 'gipoteza', ru: 'гипотеза' } },
  { t: { uz: "Odamlarni ikki guruhga bo'lishni o'rganasiz", ru: 'Научитесь делить людей на две группы' }, teg: 'A/B test' },
  { t: { uz: "«Maydon»da tugmaning yangi matnini ishga tushirasiz", ru: 'Запустите в «Maydon» новый текст кнопки' }, teg: { uz: 'variant', ru: 'вариант' } },
  { t: { uz: "Ikki guruh foizini dashboard'da solishtirasiz", ru: "Сравните процент двух групп в дашборде" }, teg: { uz: 'foiz', ru: 'процент' } }
];
const REJA_OQIM = [['7f3a…', 'A'], ['c2a8…', 'B'], ['b41d…', 'A'], ['9e07…', 'B'], ['3f2c…', 'A'], ['a90c…', 'B']];
// Oqim o'zi bir marta o'ynaydi (DE-200): har brauzer tepada paydo bo'ladi va o'z telefoni tomoniga o'tadi; tugagach — to'xtaydi (bezak-aylanish yo'q)
const useAvtoOqim = (royxat, boshla = 500, oraliq = 620) => {
  const [n, setN] = useState(() => (kamHarakat() ? royxat.length * 2 : 0));
  useEffect(() => {
    if (n >= royxat.length * 2) return undefined;
    const t = setTimeout(() => setN(k => k + 1), n === 0 ? boshla : oraliq / 2);
    return () => clearTimeout(t);
  }, [n, royxat.length, boshla, oraliq]);
  const sanoq = { A: 0, B: 0 };
  return royxat.slice(0, Math.ceil(n / 2)).map(([id, v], i) => {
    const joyda = n > i * 2 + 1;
    const k = joyda ? sanoq[v]++ : 0;
    return { id, v, joy: joyda ? 'guruh' : 'start', k };
  });
};
const RejaMaket = () => {
  const belgilar = useAvtoOqim(REJA_OQIM).map(b => ({ ...b, kul: true }));
  return (
    <AbJuft className="ab-reja" ust={<AbOqim ixcham belgilar={belgilar} />}
      chap={<AbTel v="A" kir={150}><AbQadam chiziq /></AbTel>}
      ong={<AbTel v="B" kir={260}><AbQadam chiziq /></AbTel>} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun «Maydon»da <A>tugmaning yangi matni</A> ishga tushadi.</>, ru: <>Сегодня в «Maydon» запускается <A>новый текст кнопки</A>.</> })}
      mentor={<Mentor>{tr({ uz: "Bugungi misol — «Maydon» OKR'idagi tajriba: tugmada tanlangan soat. Kodni Antigravity yozadi, raqamlarni dashboard ko'rsatadi.", ru: "Сегодняшний пример — эксперимент из OKR «Maydon»: выбранное время на кнопке. Код пишет Antigravity, числа показывает дашборд." })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida: gipoteza va A/B test — B varianti bugun ishga tushadi', ru: 'К концу урока: гипотеза и A/B-тест — вариант B запускается сегодня' })}
      chap={<RejaMaket />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    >
      <p className="ab-repo">{tr({ uz: 'repo', ru: 'репозиторий' })} <code>maydon</code> · {tr({ uz: "boshlang'ich holat", ru: 'начальное состояние' })} <code>m10-dars-04-start</code> · {tr({ uz: 'tayyor namuna', ru: 'готовый образец' })} <code>m10-dars-04-done</code></p>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — GIPOTEZA (QTushuncha markaziy, keng: chapda o'yinchi telefoni + mini uch qadam, o'ngda gipoteza kartasi; joriy qatorda javoblar — SABOQ 21, 26) =====
// QISMLAR (o'zgaradi 3 · chunki 2 · raqam 3): to'g'ri → kartaning qatori + telefon holati; xato → QXato + pufak + err fon; «haftada …» — QIzoh, xato rangisiz (04-FILTR 4)
const QISMLAR = [
  { k: 'ozgaradi', javob: [
    { id: 'yaxshi', t: { uz: "sayt yaxshiroq bo'ladi", ru: 'сайт станет лучше' }, tur: 'xato', x: { uz: "Yaxshiroq — qayerda? O'yinchi nimani boshqacha qiladi?", ru: 'Лучше — где? Что игрок будет делать иначе?' } },
    { id: 'ok', t: GIPOTEZA.ozgaradi, tur: 'ok' },
    { id: 'ochadi', t: { uz: "saytni ko'proq odam ochadi", ru: 'сайт откроет больше людей' }, tur: 'xato', x: { uz: 'Tugma vaqt tanlangandan keyin chiqadi — ochishga tegmaydi.', ru: 'Кнопка появляется после выбора времени — на открытие она не влияет.' } }
  ] },
  { k: 'chunki', javob: [
    { id: 'agent', t: { uz: "agent tugma matnini tez o'zgartira oladi", ru: 'агент может быстро поменять текст кнопки' }, tur: 'xato', x: { uz: "Bu biz uchun qulay. O'yinchi nega ko'proq band qiladi?", ru: 'Это удобно нам. Почему игрок будет бронировать больше?' } },
    { id: 'ok', t: GIPOTEZA.chunki, tur: 'ok' }
  ] },
  { k: 'olchov', javob: [
    { id: 'ochgan', t: { uz: 'saytni ochganlar soni', ru: 'число открывших сайт' }, tur: 'xato', x: { uz: "Ochganlar hali tugmani ko'rmagan.", ru: 'Открывшие ещё не видели кнопку.' } },
    { id: 'ok', t: GIPOTEZA.olchov, tur: 'ok' },
    { id: 'hafta', t: { uz: 'haftada band qilingan vaqtlar', ru: 'брони за неделю' }, tur: 'izoh', x: { uz: "Bandlar ham o'zgarishi mumkin, lekin tugmaga eng yaqin raqam — vaqt tanlaganlardan band qilganlar foizi.", ru: 'Брони тоже могут измениться, но ближе всего к кнопке число — процент забронировавших среди выбравших время.' } }
  ] }
];
// Xulosa (≤110) — tugagach karta ustunida, natija bloki bilan birga (SABOQ 25: bitta natija bloki, yonma-yon — bo'sh ustun yo'q)
const S2_XULOSA = { uz: "Gipoteza nimani o'zgartirishimizni, qanday natija va nega kutayotganimizni, qaysi raqamga qarashimizni aytadi.", ru: 'Гипотеза говорит, что мы меняем, какого результата и почему ждём и на какое число смотрим.' };
const PUFAK = {
  yaxshi: { uz: 'Qayerda yaxshiroq?', ru: 'Где лучше?' },
  agent: { uz: 'Bu menga nima beradi?', ru: 'Что это даёт мне?' },
  chunki: { uz: "18:00 — men tanlagan vaqt", ru: '18:00 — время, которое я выбрал' }
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [n, setN] = useState(avval ? 3 : 0);
  const [bosildi, setBosildi] = useState({});
  const [oxirgi, setOxirgi] = useState(null); // { k, id } — telefonning oxirgi reaksiyasi
  const [silk, setSilk] = useState(null);
  const xatoRef = useRef(false);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1700, avval);
  const ipucha = useIpucha(!done, n);
  useXulosaSkroll(done, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: !xatoRef.current, picked: true }); }, [done]); // eslint-disable-line
  const tanla = (q, j) => {
    if (done || bosildi[j.id]) return;
    if (j.tur === 'ok') { setOxirgi({ k: q.k, id: 'ok' }); setBosildi({}); setN(x => x + 1); return; }
    setOxirgi({ k: q.k, id: j.id }); setBosildi(b => ({ ...b, [j.id]: true })); setSilk(`${j.id}${Date.now()}`);
    if (!xatoRef.current) { xatoRef.current = true; if (achMiss) achMiss.miss(screen); }
  };
  // Telefon javob beradi (MD: Harakat → Vizual o'zgarish)
  const o = oxirgi && oxirgi.id !== 'ok' ? oxirgi.id : null;
  const pufak = o === 'yaxshi' ? PUFAK.yaxshi : o === 'agent' ? PUFAK.agent : (n >= 2 || avval) ? PUFAK.chunki : null;
  const qator = QISMLAR[n];
  const joriyX = qator && oxirgi && oxirgi.k === qator.k && o ? qator.javob.find(j => j.id === o) : null;
  const g = { agar: tr(GIPOTEZA.agar), ozgaradi: tr(GIPOTEZA.ozgaradi), chunki: tr(GIPOTEZA.chunki), olchov: tr(GIPOTEZA.olchov) };
  const vizual = (
    <div className={cxx('ab-s2', tugadi && 'tugadi')}>
      <div className="ab-s2-tel">
        <AbTel v="A" yangi sahifa={o === 'ochadi' ? 'kataklar' : 'forma'} pufak={pufak}>
          <AbQadam yon={o === 'ochadi' ? 'ochdi' : undefined} ochir={o === 'ochgan' ? 'ochdi' : undefined} soroq={o === 'yaxshi'} kalendar={o === 'hafta'}
            strelka={n >= 1} foiz={n >= 3 ? 'on' : null} />
        </AbTel>
      </div>
      <div className={cxx('ab-gk', done && 'tayyor')}>
        <span className="ab-gk-y" key={done ? 'g' : 't'}>{done ? tr({ uz: 'gipoteza', ru: 'гипотеза' }) : tr({ uz: 'tajriba', ru: 'эксперимент' })}</span>
        {done && <QIzoh>{tr({ uz: "«Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin gipoteza deyiladi.", ru: "Проверяемая догадка в форме «Если сделаем …, изменится …, потому что …» называется гипотезой." })}</QIzoh>}
        {tugadi ? <GipGap g={g} /> : GIP_QATOR.map((r, i) => {
          const holat = i === 0 || i <= n ? 'yozildi' : i === n + 1 ? (joriyX && joriyX.tur === 'xato' ? 'xato' : 'joriy') : 'bosh';
          const q = QISMLAR[i - 1];
          return (
            <div key={r.k} className={cxx('ab-gk-q', holat)}>
              <span className="ab-gk-l">{tr(r.l)}</span>
              <span className="ab-gk-m">
                {holat === 'yozildi' && <span className="ab-gk-t" key="y"><i>✓</i>{g[r.k]}{i === 0 && <small className="ab-gk-teg">{tr({ uz: "OKR'dagi tajriba", ru: 'эксперимент из OKR' })}</small>}</span>}
                {(holat === 'joriy' || holat === 'xato') && q && <span className="ab-gk-javob" key={`j${i}`}>
                  {q.javob.map((j, k) => (
                    <QChip key={j.id} className="ab-qism" style={{ '--k': k }} holat={bosildi[j.id] ? (j.tur === 'xato' ? 'err' : 'xira') : undefined}
                      silk={bosildi[j.id] && silk && silk.startsWith(j.id)} disabled={!!bosildi[j.id]} onClick={() => tanla(q, j)}>{tr(j.t)}</QChip>
                  ))}
                  {joriyX && (joriyX.tur === 'xato' ? <QXato key={joriyX.id}>{tr(joriyX.x)}</QXato> : <QIzoh key={joriyX.id}>{tr(joriyX.x)}</QIzoh>)}
                </span>}
              </span>
            </div>
          );
        })}
        {tugadi && <span className="ab-gk-xulosa">
          <QXulosa>{tr(S2_XULOSA)}</QXulosa>
          <QIzoh>{tr({ uz: "«Chunki» — nega shunday kutayotganimiz. A/B test raqam o'zgardimi — shuni ko'rsatadi, sababni o'zi isbotlamaydi.", ru: '«Потому что» — почему мы этого ждём. A/B-тест показывает, изменилось ли число, но причину сам не доказывает.' })}</QIzoh>
        </span>}
        {!done && <span className="ab-gk-past">{ipucha ? <span className="ab-ipucha fade-step">{tr({ uz: "Joriy qatordagi javoblarni o'qing — qaysi biri o'yinchi haqida?", ru: 'Прочитайте ответы в текущей строке — какой из них про игрока?' })}</span> : <AchRule screen={screen} />}</span>}
      </div>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · taxmin', ru: "Понятие · догадка" })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'laklarni tanlang", ru: 'Выберите части' })} (${n}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Tajribani <A>tekshirsa bo'ladigan</A> gapga aylantiring.</>, ru: <>Сделайте из эксперимента <A>проверяемую фразу</A>.</> })}
        mentor={<Mentor>{tr({ uz: 'Tajriba gapi nimani kutishni aytmaydi — har bo\'lakda bittasini tanlang.', ru: 'Фраза эксперимента не говорит, чего ждать, — выберите по одному в каждой части.' })}</Mentor>}
        vizual={vizual}
      >
        <MentorNote>{tr({ uz: "«Bir oyda qaysi raqamni o'stirasiz?» darsida bu tajriba 2-asosiy natija bilan tekshiriladigan qilib ulangan (24% → 40%; tajriba OKR ning qismi emas). «Chunki» — nega shunday kutayotganimiz haqidagi taxmin; A/B test avvalo tanlangan raqam o'zgardimi — shuni tekshiradi, sababni o'zi isbotlamaydi (B yutsa ham sabab matn aniqligi, tugma uzunligi yoki tasodif bo'lishi mumkin). Sinfdan so'rang: «Tugmada soat yozilsa, kim uchun nima o'zgaradi?»", ru: "На уроке «Какое число вы увеличите за месяц?» этот эксперимент связали со 2-м ключевым результатом, чтобы его можно было проверить (24% → 40%; эксперимент — не часть OKR). «Потому что» — догадка о том, почему мы этого ждём; A/B-тест прежде всего проверяет, изменилось ли выбранное число, а причину сам не доказывает (даже если B выиграет, причиной может быть понятность текста, длина кнопки или случайность). Спросите класс: «Если на кнопке будет время, что и для кого изменится?»" })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2; savol ustida telefonning yuqori qismi — «‹ Bugun ›» strelkalari kattalashgan) =====
const TelKesim = () => (
  <span className="ab-kesim" aria-hidden="true">
    <span className="ab-kesim-tel"><span className="ab-tel-manzil"><i /></span><b className="ab-tel-nom">Maydon</b>
      <span className="ab-kun katta"><i>‹</i><span>{tr({ uz: 'Bugun', ru: 'Сегодня' })}</span><i>›</i></span>
      <span className="ab-kataklar">{MAYDON_AB.soatlar.map(s => <span key={s} className="ab-katak">{s}</span>)}</span>
    </span>
    <small className="ab-tel-teg ab-kesim-teg">{tr({ uz: 'yangi', ru: 'новый' })}</small>
  </span>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · qaysi raqam', ru: 'Проверка · какое число' })}
    questionText="Kun strelkalarini kattalashtirdingiz. Unga eng yaqin raqam qaysi?"
    question={<div className="ab-savol-ust"><TelKesim /><h2 className="title h-ask">{tr({ uz: <>Kun strelkalarini kattalashtirdingiz. Unga <A>eng yaqin raqam</A> qaysi?</>, ru: <>Вы увеличили стрелки дня. Какое число <A>ближе всего</A> к этому?</> })}</h2></div>}
    options={[
      { uz: 'Vaqtni tanlaganlardan band qilganlar foizi', ru: 'Процент забронировавших среди выбравших время' },
      { uz: 'Haftada band qilingan vaqtlar soni', ru: 'Число броней за неделю' },
      { uz: 'Ochganlardan vaqtni tanlaganlar foizi', ru: 'Процент выбравших время среди открывших' },
      { uz: "Dashboard'dagi «Oxirgi 5 daqiqada» raqami", ru: "Число «За последние 5 минут» в дашборде" }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Strelka vaqt tanlashdan oldin — o'sha qadam foizi o'zgaradi.", ru: 'Стрелка стоит до выбора времени — меняется процент этого шага.' }}
    explainWrong={{
      0: { uz: 'Bu tugma qadami — strelka undan oldin turadi.', ru: 'Это шаг кнопки — стрелка стоит раньше него.' },
      1: { uz: "Bandlar ham o'zgarishi mumkin — lekin strelkadan uzoqroq.", ru: 'Брони тоже могут измениться — но они дальше от стрелки.' },
      3: { uz: 'Bu raqam oxirgi 5 daqiqani sanaydi — qadamni emas.', ru: 'Это число считает последние 5 минут, а не шаг.' },
      default: { uz: 'Strelka qaysi qadamda? Shu qadamning raqamini toping.', ru: 'На каком шаге стрелка? Найдите число этого шага.' }
    }} />
);

// ===== SCREEN 4 — BOOKING.COM (QVoqea, K9 bank; P-053): nuqtalar · bosqich nomi · jonli sahna (booking.com brauzer oynasi, odam-belgilari) · ikki bashorat (2/5, 4/5) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md bank K9 — deyarli har o'zgarish avval foydalanuvchilarning bir qismida tekshiriladi; bir vaqtda 1000 dan ortiq A/B test (kompaniya chiqishlari, 2017).
// SABOQ 8: bosqich gapi Mentorda (har bosqichda almashadi); sahnada — bosqich nomi va jonli maket. SABOQ 2: nom o'z rangida, logotipsiz, tanish maket (brauzer oynasi).
const BOOKING_BOSQICH = [
  { h: { uz: 'Hammaga birdan emas', ru: 'Не всем сразу' }, m: { uz: "Kompaniyaning o'zi aytishicha, saytdagi deyarli har o'zgarish (tugma rangi, matn, bo'limlar tartibi) avval foydalanuvchilarning bir qismida tekshiriladi.", ru: 'По словам самой компании, почти любое изменение на сайте (цвет кнопки, текст, порядок блоков) сначала проверяют на части пользователей.' } },
  { bashorat: 'qolgan' },
  { h: { uz: 'Ikki guruh — bir vaqtda', ru: 'Две группы — одновременно' }, m: { uz: <>Odamlarning bir qismi A ni, qolgani B ni ko'radi, keyin raqamlar solishtiriladi. A — hozirgi variant, B — yangi. Bunday tekshiruv <b>A/B test</b> deyiladi.</>, ru: <>Одна часть людей видит A, остальные — B, потом числа сравнивают. A — текущий вариант, B — новый. Такая проверка называется <b>A/B-тест</b>.</> } },
  { bashorat: 'son' },
  { h: { uz: 'Bir vaqtda — 1000 dan ortiq', ru: 'Одновременно — больше 1000' }, m: { uz: "Kompaniyaning 2017-yildagi chiqishlariga ko'ra, saytda bir vaqtda 1000 dan ortiq A/B test o'tkazilgan. «Maydon»da hozircha bitta: tugma matni.", ru: 'По выступлениям компании в 2017 году, на сайте одновременно шло больше 1000 A/B-тестов. В «Maydon» пока один: текст кнопки.' } }
];
const BK_TAXMIN = {
  qolgan: { savol: { uz: "Qolganlar shu paytda nimani ko'radi?", ru: 'Что в это время видят остальные?' }, togri: 'hozirgi', haqiqat: { uz: 'hozirgi sahifani', ru: 'текущую страницу' },
    v: [{ k: 'yopiq', t: { uz: 'Yopiq sahifani', ru: 'Закрытую страницу' } }, { k: 'hozirgi', t: { uz: 'Hozirgi sahifani', ru: 'Текущую страницу' } }, { k: 'navbat', t: { uz: 'Ikkalasini navbat bilan', ru: 'Обе по очереди' } }] },
  son: { savol: { uz: '2017-yilda Booking.com bir vaqtda nechta A/B test o\'tkazgan?', ru: 'Сколько A/B-тестов одновременно проводил Booking.com в 2017 году?' }, togri: 'ming', haqiqat: { uz: '1000 dan ortiq', ru: 'больше 1000' },
    v: [{ k: 'on', t: { uz: '10 dan ortiq', ru: 'больше 10' } }, { k: 'yuz', t: { uz: '100 dan ortiq', ru: 'больше 100' } }, { k: 'ming', t: { uz: '1000 dan ortiq', ru: 'больше 1000' } }] }
};
const BK_RANG = '#003B95'; // Booking.com nom-yorlig'i — o'z rangida (to'q ko'k); maket mazmuni, qolip tokeni emas
const Bk = () => <span className="ab-bk">Booking.com</span>;
// Odam-belgisi (P-053: ≤4 tur belgi — odam, brauzer oynasi, raqam qutisi, juftlik)
const Odam = ({ b, i }) => <i className={cxx('ab-odam', b && 'b')} style={{ '--i': i }} />;
// booking.com brauzer oynasi — chizilgan, logotipsiz: manzil qatori, to'q ko'k sarlavha, sariq hoshiyali qidiruv, mehmonxona kartalari; v: 'A' | 'B' (bitta tugma farqi) | 'yopiq' (hali noma'lum)
const BkOyna = ({ v = 'A', yorliq, son }) => (
  <span className={cxx('ab-bko', v === 'B' && 'b', v === 'yopiq' && 'yopiq')}>
    {yorliq && <span className={cxx('ab-bko-y', v === 'B' && 'b')}>{yorliq}</span>}
    <span className="ab-bko-oyna">
      <span className="ab-bko-bar"><i /><i /><i /><em>booking.com</em></span>
      <span className="ab-bko-bosh"><i /><i /></span>
      <span className="ab-bko-qidir"><i /><b /></span>
      <span className="ab-bko-ro">{[0, 1].map(k => <span key={k} className="ab-bko-m"><i /><span><em /><em /></span><b /></span>)}</span>
      {v === 'yopiq' && <span className="ab-bko-soroq">?</span>}
    </span>
    {son && <span className="ab-bko-son">?</span>}
  </span>
);
const BkSahna = ({ b, taxmin1 }) => {
  if (b === 0) return (
    <div className="ab-bks b0">
      <span className="ab-bks-oqim">{[0, 1, 2, 3, 4, 5, 6, 7].map(i => <Odam key={i} i={i} b={i === 1 || i === 4 || i === 6} />)}</span>
      <i className="ab-bks-str" aria-hidden="true" />
      <BkOyna v="A" />
    </div>
  );
  if (b === 1 || b === 2 || b === 3) {
    const ochiq = b >= 2 || !!taxmin1;
    return (
      <div className="ab-bks b-ikki">
        <span className="ab-bks-g"><span className="ab-bks-odamlar">{[0, 1, 2, 3, 4].map(i => <Odam key={i} i={i} />)}</span><BkOyna v={ochiq ? 'A' : 'yopiq'} yorliq={b >= 2 ? tr({ uz: 'A · hozirgi', ru: 'A · текущий' }) : undefined} son={b >= 2} /></span>
        <span className="ab-bks-g"><span className="ab-bks-odamlar">{[0, 1, 2].map(i => <Odam key={i} i={i} b />)}</span><BkOyna v="B" yorliq={b >= 2 ? tr({ uz: 'B · yangi', ru: 'B · новый' }) : undefined} son={b >= 2} /></span>
      </div>
    );
  }
  return <BkTor />;
};
// 5/5: ko'p kichik A/B juftliklari to'r bo'lib turadi (3 × 6 — SABOQ 27), «1000+» sanab o'sadi; keyin bittasi kattalashib «Maydon» telefonlariga aylanadi
const BkTor = () => {
  const [faza, setFaza] = useState(() => (kamHarakat() ? 2 : 0));
  useEffect(() => {
    if (faza >= 2) return undefined;
    const t = setTimeout(() => setFaza(f => f + 1), faza === 0 ? 1500 : 650);
    return () => clearTimeout(t);
  }, [faza]);
  const son = useSanoq(1000, true, 200, 1100);
  return (
    <div className={cxx('ab-bks', 'b4', `f${faza}`)}>
      <div className="ab-tor-tel">{faza >= 2 && <>
        <TelPast v="A" rang yorliq="A · Maydon" kir={0} />
        <TelPast v="B" rang yorliq="B · Maydon" kir={120} />
      </>}</div>
      <div className="ab-tor">
        <span className="ab-tor-son"><b>{son}+</b><small>{tr({ uz: 'A/B test bir vaqtda · 2017', ru: 'A/B-тестов одновременно · 2017' })}</small></span>
        <span className="ab-tor-g">{Array.from({ length: 18 }).map((_, i) => <span key={i} className={cxx('ab-tor-j', i === 8 && 'tanla')} style={{ '--i': i }}><i /><i /></span>)}</span>
      </div>
    </div>
  );
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [b, setB] = useState(avval ? 4 : 0);
  const [tx, setTx] = useState(() => ({ qolgan: storedAnswer?.taxmin1 ?? null, son: storedAnswer?.taxmin2 ?? null }));
  const done = b >= 4;
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin1: tx.qolgan, taxmin2: tx.son }); }, [done]); // eslint-disable-line
  useXulosaSkroll(done, avval);
  const bq = BOOKING_BOSQICH[b];
  const kutish = !!bq.bashorat && !tx[bq.bashorat];
  const keyingi = () => { if (b < 4) setB(b + 1); else onNext(); };
  const yorliq = <><Bk /> · {b + 1}/5</>;
  // Mentor: bosqich gapi (SABOQ 8). 1/5 da — brend izohi bir marta (S-018); bashorat bosqichida — oldingi bosqich gapi yoki belgilash yo'rig'i
  const mGap = b === 0
    ? <>{tr({ uz: "Booking.com — mehmonxonada yoki ijara uyda oldindan joy band qilinadigan sayt. «Maydon» kabi, u ham band qilish uchun qurilgan.", ru: 'Booking.com — сайт, где заранее бронируют место в гостинице или съёмном доме. Как и «Maydon», он создан для бронирования.' })}<span className="ab-m-q">{tr(bq.m)}</span></>
    : bq.bashorat ? (tx[bq.bashorat] ? tr(BOOKING_BOSQICH[b - 1].m) : tr({ uz: "Avval o'zingiz belgilab ko'ring.", ru: 'Сначала отметьте сами.' })) : tr(bq.m);
  // Natija qatori (QTaxmin matni); xulosa ichida — <span> (p ichida p bo'lmaydi)
  const taxminMatn = (k) => {
    const d = BK_TAXMIN[k]; const tanlov = tx[k];
    const v = d.v.find(x => x.k === tanlov);
    return tanlov === d.togri
      ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваш прогноз оказался верным' })}: <b>{tr(d.haqiqat)}</b></>
      : <>{tr(TAXMIN_L)}: {v ? tr(v.t).toLowerCase() : '—'} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(d.haqiqat)}</b></>;
  };
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={kutish ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : b < 4 ? `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/5)` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Bk /> bir vaqtda <A>nechta tekshiruv</A> o'tkazgan?</>, ru: <>Сколько <A>проверок сразу</A> вёл <Bk />?</> })}
        nuqtalar={<>
          <Mentor key={`m${b}${tx.qolgan ? 1 : 0}${tx.son ? 1 : 0}`}>{mGap}</Mentor>
          <div className="ab-nuq"><span className="ab-nuq-l">{yorliq}</span>{BOOKING_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="ab-voqea" key={b}>
          {bq.h && <span className="ab-voqea-h">{tr(bq.h)}</span>}
          <Zoomable><BkSahna b={b} taxmin1={tx.qolgan} /></Zoomable>
          {bq.bashorat && !(b === 1 && tx.qolgan) && <Bashorat yorliq={yorliq} savol={tr(BK_TAXMIN[bq.bashorat].savol)} variantlar={BK_TAXMIN[bq.bashorat].v.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={tx[bq.bashorat]} onTanla={(k) => setTx(t => ({ ...t, [bq.bashorat]: k }))} />}
          {b === 1 && tx.qolgan && <div className="ab-taxmin ab-taxmin-n"><QTaxmin togri={tx.qolgan === BK_TAXMIN.qolgan.togri}>{taxminMatn('qolgan')}</QTaxmin></div>}
          {done && <QXulosa><span className={cxx('ab-nb-t', 'q-taxmin', tx.son === BK_TAXMIN.son.togri && 'ok')}>{taxminMatn('son')}</span>{tr({ uz: "Booking.com'da yangi o'zgarish avval foydalanuvchilarning bir qismida tekshiriladi, keyin ikki guruh solishtiriladi.", ru: 'В Booking.com новое изменение сначала проверяют на части пользователей, потом сравнивают две группы.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Booking «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?» darsida «A/B» so'zisiz ko'rilgan — bugun atama va 2017-yil raqami qo'shildi. Booking qaysi testda nimani topgani aytilmaydi — bankda yo'q. Raqam — kompaniyaning ochiq chiqishlaridan (2017).", ru: 'Booking уже встречался на уроке «Какое число скажет, что ваш бот работает хорошо?» без слова «A/B» — сегодня добавлены термин и число 2017 года. Что Booking нашёл в каком тесте, не говорим — этого нет в банке. Число — из открытых выступлений компании (2017).' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 5 — IKKI GURUH (QTushuncha: bashorat → uch usul (har biri sinab ko'riladi) → maket o'sha usul bilan yuradi → taxmin · izoh · xulosa) =====
// Chapda A/B maketi (kirish oqimi, ajratgich, ikki telefon — SABOQ 21), o'ngda usul tugmalari; tugagach maket 3-usul holatida butun enga (DE-199)
const USULLAR = [
  { k: 1, t: { uz: 'Bu hafta hammaga B, keyin o\'tgan hafta bilan solishtirish', ru: 'На этой неделе всем B, потом сравнить с прошлой неделей' }, x: { uz: "Bu hafta e'lon ham chiqdi — farq qayerdan kelgani noma'lum.", ru: 'На этой неделе вышло и объявление — откуда разница, неизвестно.' } },
  { k: 2, t: { uz: 'Har ochilishda tasodifiy — brauzer eslab qolmaydi', ru: 'Случайно при каждом открытии — браузер не запоминает' }, x: { uz: 'Bitta brauzer ikkala guruhga tushdi — qaysi biriga sanaysiz?', ru: 'Один браузер попал в обе группы — в какую его считать?' } },
  { k: 3, t: { uz: 'Birinchi kirishda tasodifiy — keyin brauzer eslab qoladi', ru: 'Случайно при первом входе — потом браузер запоминает' } }
];
const S5_TAXMIN = [
  { k: 'bir', t: { uz: 'Bittasida', ru: 'В одном' } },
  { k: 'ikki', t: { uz: 'Ikkitasida', ru: 'В двух' } },
  { k: 'uch', t: { uz: 'Uchalasida', ru: 'Во всех трёх' } }
];
const S5_SAVOL = { uz: 'Nechta usulda guruhlarni to\'g\'ri solishtirsa bo\'ladi?', ru: 'Сколькими способами можно правильно сравнить группы?' };
// 3-usul: brauzerlar birin-ketin, har biri A yoki B ni tasodifiy oladi (bu mashqda tartib oldindan berilgan: 4 va 3 — sal farq qiladi)
const OQIM3 = [['7f3a…', 'A'], ['c2a8…', 'B'], ['b41d…', 'A'], ['9e07…', 'B'], ['3f2c…', 'A'], ['a90c…', 'B'], ['e51b…', 'A']];
const oqim3Yakun = () => { const s = { A: 0, B: 0 }; return OQIM3.map(([id, v]) => ({ id, v, joy: 'guruh', k: s[v]++ })); };
// Xulosa (≤110, MD) — natija blokining oxirgi qatori
const S5_XULOSA = { uz: 'Bu testda A va B bir vaqtda ishlaydi, har brauzer esa birinchi olgan variantida qoladi.', ru: 'В этом тесте A и B работают одновременно, а каждый браузер остаётся в варианте, который получил первым.' };
const MAKET_BOSH = { belgilar: [], kal: false, elon: false, pufakB: null, pufakOqim: null, foizB: null, xiraA: false, chaq: {}, yorliq: null };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [sinaldi, setSinaldi] = useState(() => (avval ? [1, 2, 3] : []));
  const [faol, setFaol] = useState(null);   // hozir yurayotgan usul
  const [oxirgi, setOxirgi] = useState(avval ? 3 : null);
  const [m, setM] = useState(() => (avval ? { ...MAKET_BOSH, belgilar: oqim3Yakun(), yorliq: true } : MAKET_BOSH));
  const tay = useTaymer();
  const done = sinaldi.length >= 3;
  // Yakun (qabul 1-aylanish): o'ng ustunda uch usul ixcham (✕ · ✕ · ✓) + bitta natija bloki; maket chapda, ostida hech narsa yo'q (SABOQ 20, 25)
  const yakun = useTugadi(done && !faol, 900, avval);
  const ipucha = useIpucha(!!taxmin && !done && !faol, sinaldi.length);
  useXulosaSkroll(yakun, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // Tugagach maket 3-usul holatida qoladi
  useEffect(() => { if (yakun && oxirgi !== 3) setM({ ...MAKET_BOSH, belgilar: oqim3Yakun(), yorliq: true }); }, [yakun]); // eslint-disable-line
  const tugat = (k) => { setFaol(null); setSinaldi(s => (s.includes(k) ? s : [...s, k])); };
  const yur = (k) => {
    if (!taxmin || faol || yakun) return;
    tay.tozala(); setFaol(k); setOxirgi(k);
    const kam = kamHarakat();
    if (k === 1) {
      if (kam) { setM({ ...MAKET_BOSH, kal: true, elon: true, foizB: 'yuq', xiraA: true, pufakB: { uz: "Foiz o'zgardi — tugmadanmi, e'londanmi?", ru: 'Процент изменился — из-за кнопки или из-за объявления?' } }); tugat(1); return; }
      setM({ ...MAKET_BOSH, kal: true, xiraA: true });
      tay.qoy(() => setM(x => ({ ...x, elon: true })), 700);
      tay.qoy(() => setM(x => ({ ...x, foizB: 'yuq' })), 1500);
      tay.qoy(() => setM(x => ({ ...x, pufakB: { uz: "Foiz o'zgardi — tugmadanmi, e'londanmi?", ru: 'Процент изменился — из-за кнопки или из-за объявления?' } })), 2100);
      tay.qoy(() => tugat(1), 2500);
    } else if (k === 2) {
      const bir = (v, joy, extra) => [{ id: 'c2a8…', key: 'c2', v, joy, k: 0, ...extra }];
      const ikki = [{ id: 'c2a8…', key: 'c2a', v: 'A', joy: 'guruh', k: 0, ikki: true }, { id: 'c2a8…', key: 'c2b', v: 'B', joy: 'guruh', k: 0, ikki: true }];
      const pufak = { uz: 'Qaysi tugmani ko\'rib band qildim?', ru: 'Какую кнопку я видел, когда бронировал?' };
      if (kam) { setM({ ...MAKET_BOSH, belgilar: ikki, pufakOqim: pufak }); tugat(2); return; }
      setM({ ...MAKET_BOSH, belgilar: bir(null, 'start') });
      tay.qoy(() => setM(x => ({ ...x, belgilar: bir('A', 'guruh'), chaq: { A: 1 } })), 500);
      tay.qoy(() => setM(x => ({ ...x, belgilar: bir(null, 'start', { yangila: true }) })), 1400);
      tay.qoy(() => setM(x => ({ ...x, belgilar: bir('B', 'guruh'), chaq: { B: 2 } })), 1900);
      tay.qoy(() => setM(x => ({ ...x, belgilar: bir(null, 'start', { yangila: true }) })), 2800);
      tay.qoy(() => setM(x => ({ ...x, belgilar: bir('A', 'guruh'), chaq: { A: 3 } })), 3300);
      tay.qoy(() => setM(x => ({ ...x, belgilar: ikki, pufakOqim: pufak })), 4100);
      tay.qoy(() => tugat(2), 4400);
    } else {
      if (kam) { setM({ ...MAKET_BOSH, belgilar: oqim3Yakun().map(b => (b.id === 'c2a8…' ? { ...b, ok: true } : b)), yorliq: true }); tugat(3); return; }
      setM({ ...MAKET_BOSH });
      const s = { A: 0, B: 0 };
      const joy = [];
      OQIM3.forEach(([id, v], i) => {
        const k2 = s[v]++;
        tay.qoy(() => setM(x => ({ ...x, belgilar: [...x.belgilar.filter(b => b.id !== id), { id, v: null, joy: 'start', k: 0 }] })), 200 + i * 560);
        tay.qoy(() => { joy.push(id); setM(x => ({ ...x, belgilar: x.belgilar.map(b => (b.id === id ? { id, v, joy: 'guruh', k: k2 } : b)) })); }, 480 + i * 560);
      });
      const t0 = 480 + OQIM3.length * 560;
      tay.qoy(() => setM(x => ({ ...x, belgilar: [...x.belgilar, { id: 'c2a8…', key: 'c2-qayta', v: null, joy: 'start', k: 0, yangila: true }] })), t0);
      tay.qoy(() => setM(x => ({ ...x, belgilar: x.belgilar.filter(b => b.key !== 'c2-qayta').map(b => (b.id === 'c2a8…' ? { ...b, ok: true } : b)), chaq: { B: 9 } })), t0 + 650);
      tay.qoy(() => setM(x => ({ ...x, belgilar: x.belgilar.map(b => ({ ...b, ok: false })), yorliq: true })), t0 + 1700);
      tay.qoy(() => tugat(3), t0 + 1900);
    }
  };
  const tx = S5_TAXMIN.find(t => t.k === taxmin);
  const s5Togri = taxmin === S5_TAXMIN[0].k; // to'g'ri taxmin — «Bittasida»
  const usulX = oxirgi && oxirgi !== 3 && !faol ? USULLAR[oxirgi - 1] : null;
  const vizual = (
    <AbJuft className={cxx('ab-s5', yakun && 'yakun')}
      ust={<AbOqim belgilar={m.belgilar} kal={m.kal} elon={m.elon} ajrat={!m.kal}
        yorliq={m.yorliq ? tr({ uz: "bir vaqtda · har brauzer o'z variantida", ru: 'одновременно · каждый браузер в своём варианте' }) : null} pufak={m.pufakOqim} />}
      chap={<AbTel v="A" rang yorliq="A" xira={m.xiraA} chaqnash={m.chaq.A}>{m.kal && !yakun && <AbQadam />}</AbTel>}
      ong={<AbTel v="B" rang yorliq="B" chaqnash={m.chaq.B} pufak={m.pufakB}>{m.kal && !yakun && <AbQadam foiz={m.foizB} />}</AbTel>} />
  );
  const harakat = (
    <div className={cxx('ab-usullar', yakun && 'yakun')}>
      {!yakun && <Bashorat savol={tr(S5_SAVOL)} variantlar={S5_TAXMIN.map(t => ({ k: t.k, t: tr(t.t) }))} tanlov={taxmin} onTanla={setTaxmin} />}
      {USULLAR.map((u, i) => {
        const bor = sinaldi.includes(u.k);
        const holat = faol === u.k ? 'yur' : bor ? (u.k === 3 ? 'ok' : 'err') : '';
        return (
          <React.Fragment key={u.k}>
            <button type="button" className={cxx('ab-usul', holat, yakun && 'ixcham', !taxmin && 'kut', taxmin && !faol && !bor && 'ab-navbat')} style={{ '--k': i }} disabled={!taxmin || !!faol || yakun} onClick={() => yur(u.k)} title={yakun ? tr(u.t) : undefined}>
              <span className="ab-usul-n">{bor && faol !== u.k ? (u.k === 3 ? '✓' : '✕') : u.k}</span>
              <span className="ab-usul-t">{tr(u.t)}</span>
            </button>
            {!yakun && usulX && usulX.k === u.k && <QXato key={`x${u.k}`}>{tr(u.x)}</QXato>}
          </React.Fragment>
        );
      })}
      {yakun && <QXulosa>
        {tx && <span className={cxx('ab-nb-t', 'q-taxmin', s5Togri && 'ok')}>{s5Togri
          ? tr({ uz: <>Taxminingiz to'g'ri chiqdi: <b>bittasida</b>.</>, ru: <>Ваш прогноз оказался верным: <b>в одном</b>.</> })
          : <>{tr(TAXMIN_L)}: {tr(tx.t).toLowerCase()} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'bittasida', ru: 'в одном' })}</b></>}</span>}
        <span className="ab-s5-iz">{tr({ uz: 'Tasodifiy bo\'lishda guruhlar teng chiqmasligi mumkin — shuning uchun foiz solishtiriladi.', ru: 'При случайном делении группы могут выйти неравными — поэтому сравнивают процент.' })}</span>
        {tr(S5_XULOSA)}
      </QXulosa>}
      {ipucha && <span className="ab-ipucha fade-step">{tr({ uz: "Hali bosilmagan usulni sinab ko'ring — maketda nima o'zgarishini kuzating.", ru: 'Попробуйте ещё не нажатый способ — следите, что меняется в макете.' })}</span>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ikki guruh', ru: 'Понятие · две группы' })} screen={screen} scrollSignal={sinaldi.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done || !!faol} label={done && !faol ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : `${tr({ uz: "Usullarni sinab ko'ring", ru: 'Попробуйте способы' })} (${sinaldi.length}/3)`} onClick={onNext} /></>}>
      {/* tugadi={false} ataylab (DE-199 istisnosi, qabul 1-aylanish): tugagach ham usullar ixcham holda o'ngda qoladi, natija bloki ular ostida */}
      <QTushuncha zoom={Zoomable} tugadi={false}
        sarlavha={tr({ uz: <>Qaysi o'yinchi A ni, <A>qaysi biri B ni</A> ko'radi?</>, ru: <>Какой игрок видит A, а <A>какой — B</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Sinfdoshlar bugun «Maydon»ni telefonida ochadi — ularni ikki guruhga bo'lish kerak. Har usulni sinab, maketga qarang.", ru: 'Сегодня одноклассники откроют «Maydon» на телефонах — их нужно разделить на две группы. Попробуйте каждый способ и смотрите на макет.' })}</Mentor>}
        harakat={harakat}
        vizual={vizual}
      >
        <MentorNote>{tr({ uz: "«Nega o'tgan hafta bilan solishtirmaymiz?» — haftalar orasida boshqa narsa ham o'zgaradi (e'lon, bayram, ob-havo). «Eslab qoladi» — brauzer xotirasi (localStorage), brauzer ID yonida. Bitta o'yinchi telefon va laptopdan kirsa, ikki xil variant ko'rishi mumkin: variant brauzerga beriladi, odamga emas.", ru: '«Почему не сравниваем с прошлой неделей?» — между неделями меняется и другое (объявление, праздник, погода). «Запоминает» — память браузера (localStorage), рядом с ID браузера. Если один игрок заходит с телефона и с ноутбука, он может увидеть два разных варианта: вариант выдаётся браузеру, а не человеку.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — 4 ta (S-031); tekin bonus bitta — B Launched (S-034) =====
const ACHIEVEMENTS = {
  hypothesisBuilder: { icon: '💡', name: 'Hypothesis Builder!', desc: { uz: "Gipotezaning uch bo'lagini birinchi urinishda to'g'ri tanladingiz", ru: 'Вы с первой попытки верно выбрали три части гипотезы' } },
  rightNumber: { icon: '🎯', name: 'Right Number!', desc: { uz: "O'zgarish tegadigan raqamni birinchi urinishda topdingiz", ru: 'Вы с первой попытки нашли число, которого касается изменение' } },
  patientTester: { icon: '⏳', name: 'Patient Tester!', desc: { uz: '17 ta brauzerdan chiqqan raqamdan shoshilib xulosa chiqarmadingiz', ru: 'Вы не поспешили с выводом по числу из 17 браузеров' } },
  bLaunched: { icon: '🚀', name: 'B Launched!', desc: { uz: 'B variantingiz sinfdoshlarga ketdi', ru: 'Ваш вариант B ушёл к одноклассникам' } }
};
// Ekran id → nishon: s2 — birinchi urinishda xatosiz; s3, s8 — birinchi urinishda; a2 — oxirgi «Bajardim» (bonus)
const ACH_TRIGGERS = { s2: 'hypothesisBuilder', s3: 'rightNumber', s8: 'patientTester', a2: 'bLaunched' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 8 — q22)
const Q_LABELS = {
  3: { uz: '1 — Strelka qaysi raqamga tegadi', ru: '1 — Какого числа касается стрелка' },
  8: { uz: 'Yakuniy — 17 ta brauzer', ru: 'Итоговый — 17 браузеров' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'gipoteza', ru: 'гипотеза' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'A/B test', l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'variant A', ru: 'вариант A' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'variant B', ru: 'вариант B' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'foiz', ru: 'процент' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'maydon-variant', l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'Band qilish', ru: 'Забронировать' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'dashboard', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang — 12 savol (MD), to'g'ri javob o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Gipoteza qaysi shaklda yoziladi?', ru: 'В какой форме пишется гипотеза?' }, opts: [{ uz: "Agar … qilsak, … o'zgaradi, chunki …", ru: 'Если сделаем …, изменится …, потому что …' }, { uz: '… ni qilamiz, chunki bu juda yaxshi g\'oya', ru: 'Сделаем …, потому что это очень хорошая идея' }, { uz: 'Hozir … ta bor, oy oxirida … taga yetsin', ru: 'Сейчас …, к концу месяца пусть станет …' }, { uz: "Avval … ni qilamiz, keyin … ni ko'ramiz", ru: 'Сначала сделаем …, потом посмотрим …' }], correct: 0 },
  { q: { uz: '«Maydon» gipotezasida «chunki» qismi qaysi?', ru: 'Какая часть гипотезы «Maydon» — «потому что»?' }, opts: [{ uz: 'Tugmada tanlangan soatni yozsak', ru: 'Напишем на кнопке выбранное время' }, { uz: "O'yinchi tanlagan vaqtini tugmada ko'radi", ru: 'Игрок видит выбранное время на кнопке' }, { uz: "Vaqtni tanlaganlardan ko'proq o'yinchi band qiladi", ru: 'Больше игроков из выбравших время забронируют' }, { uz: 'Vaqtni tanlaganlardan band qilganlar foizi', ru: 'Процент забронировавших среди выбравших время' }], correct: 1 },
  { q: { uz: '«Band qilish» tugmasi qaysi qadamdan keyin chiqadi?', ru: "После какого шага появляется кнопка «Забронировать»?" }, opts: [{ uz: 'Sahifa ochilgandan keyin', ru: 'После открытия страницы' }, { uz: "Band qilib bo'lgandan keyin", ru: 'После бронирования' }, { uz: 'Vaqtni tanlagandan keyin', ru: 'После выбора времени' }, { uz: 'Parolni kiritgandan keyin', ru: 'После ввода пароля' }], correct: 2 },
  { q: { uz: 'A/B testda variant A qaysi biri?', ru: 'Какой вариант в A/B-тесте — A?' }, opts: [{ uz: "Yangi, sinab ko'riladigan variant", ru: 'Новый вариант, который пробуют' }, { uz: "Ega o'zi tanlagan eng yaxshisi", ru: 'Лучший, выбранный владельцем' }, { uz: "Dashboard'da birinchi turgani", ru: "Первый в дашборде" }, { uz: "Hozirgi, o'zgarmagan variant", ru: 'Текущий, неизменённый вариант' }], correct: 3 },
  { q: { uz: 'Nega A va B bir vaqtda ishlaydi?', ru: 'Почему A и B работают одновременно?' }, opts: [{ uz: 'Boshqa vaqtning farqi aralashmasligi uchun', ru: "Чтобы не примешались изменения другого времени" }, { uz: "Backend'ga kamroq so'rov kelishi uchun", ru: 'Чтобы в Backend приходило меньше запросов' }, { uz: "O'yinchi ikkalasini solishtirishi uchun", ru: 'Чтобы игрок сравнил оба' }, { uz: "Dashboard'dagi raqamlar tezroq chiqishi uchun", ru: "Чтобы числа в дашборде появлялись быстрее" }], correct: 0 },
  { q: { uz: 'Bizning testda brauzer variantni qachon oladi?', ru: 'Когда браузер получает вариант в нашем тесте?' }, opts: [{ uz: 'Har safar sahifa yangilanganda', ru: 'При каждом обновлении страницы' }, { uz: 'Birinchi kirganda, bir marta', ru: 'При первом входе, один раз' }, { uz: 'Band qilish tugmasini bosganda', ru: 'При нажатии кнопки бронирования' }, { uz: "Ega dashboard'ni ochgan paytda", ru: "Когда владелец открывает дашборд" }], correct: 1 },
  { q: { uz: "Brauzer sahifani yangilaganda A ni ham, B ni ham ko'rdi. Muammo nima?", ru: 'При обновлении страницы браузер увидел и A, и B. В чём проблема?' }, opts: [{ uz: "Tugma matni juda uzun bo'lib qoldi", ru: 'Текст кнопки стал слишком длинным' }, { uz: "Backend hodisani qabul qilmay qo'ydi", ru: 'Backend перестал принимать событие' }, { uz: "Uni qaysi guruhga sanash noma'lum", ru: 'Неизвестно, в какую группу его считать' }, { uz: 'Brauzer ID har safar yangilanadi', ru: 'ID браузера каждый раз обновляется' }], correct: 2 },
  { q: { uz: 'A — 9 tadan 3, B — 8 tadan 4. B ning foizi qancha?', ru: 'A — 3 из 9, B — 4 из 8. Какой процент у B?' }, opts: [{ uz: '4 foiz', ru: '4 процента' }, { uz: '33 foiz', ru: '33 процента' }, { uz: '12 foiz', ru: '12 процентов' }, { uz: '50 foiz', ru: '50 процентов' }], correct: 3 },
  { q: { uz: 'Guruhlar 9 va 8 chiqdi. Bu nimani bildiradi?', ru: 'Группы вышли 9 и 8. Что это значит?' }, opts: [{ uz: 'Tasodifiy bo\'lishda bu tabiiy hol', ru: 'При случайном делении это обычно' }, { uz: "Bo'lish noto'g'ri, qayta boshlash kerak", ru: 'Деление неверное, нужно начать заново' }, { uz: "B guruhidagi tugma kamroq yoqqan", ru: 'Кнопка в группе B понравилась меньше' }, { uz: 'Kimdir ikki marta sanalib qolgan', ru: 'Кого-то посчитали дважды' }], correct: 0 },
  { q: { uz: "2017-yilda Booking.com bir vaqtda nechta A/B test o'tkazgan?", ru: 'Сколько A/B-тестов одновременно проводил Booking.com в 2017 году?' }, opts: [{ uz: '10 dan ortiq', ru: 'Больше 10' }, { uz: '1000 dan ortiq', ru: 'Больше 1000' }, { uz: '100 dan ortiq', ru: 'Больше 100' }, { uz: '5000 dan ortiq', ru: 'Больше 5000' }], correct: 1 },
  { q: { uz: 'Hodisa qaysi variantdan kelganini Backend qanday biladi?', ru: 'Как Backend узнаёт, из какого варианта пришло событие?' }, opts: [{ uz: 'Brauzer ID ning birinchi harfidan', ru: 'По первой букве ID браузера' }, { uz: 'Hodisa yozilgan soat va daqiqadan', ru: 'По часу и минуте записи события' }, { uz: 'Hodisa bilan kelgan variantdan', ru: 'По варианту, пришедшему с событием' }, { uz: "Ega sahifasidagi bandlar ro'yxatidan", ru: 'По списку броней на странице владельца' }], correct: 2 },
  { q: { uz: "Gipotezada «sayt yaxshiroq bo'ladi» deyilgan. Nima yetishmaydi?", ru: 'В гипотезе сказано «сайт станет лучше». Чего не хватает?' }, opts: [{ uz: 'Qancha vaqt kutish kerakligi', ru: 'Сколько нужно ждать' }, { uz: 'Saytga nechta odam kirishi', ru: 'Сколько людей зайдёт на сайт' }, { uz: 'Kodni kim yozishi kerakligi', ru: 'Кто должен писать код' }, { uz: "Qaysi raqam o'zgarishi", ru: 'Какое число изменится' }], correct: 3 },
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
    // Arena tokenlari — shu darsning lug'atidan (QZ_BG_SHAPES), emoji yo'q
    const TOK = QZ_BG_SHAPES.map(sh => tr(sh.ch));
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err?, yordam?: [satr], forma?: true }] · natija · ortda · forma (5-qadam «O'z g'oyangiz»).
// forma: { render(q, yoz), tayyor(q), prompt(q), izoh(q), bosh(storedAnswer) } — qolipda forma turi yo'q, shu ulagichda; «Bajardim» forma tayyor bo'lgach ochiladi (JS qulf + CSS :has).
// «Yordam» (namuna) qolipdagi QPrompt'da yo'q — QBlok qadamining izoh-qatori (xato) joyida, bosilsa ochiladi. Signal 500+ zonasida — faqat mentor ko'radi.
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => { // ochilgan namuna va «Bajardim» bir ko'rinishda qolsin
    if (!ochiq) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="ab-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="ab-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="ab-yordam-s">{fmtCode(tr(l))}</span>)}</span>}
    </>
  );
};
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, ust, steps, natija, natijaYorliq, ortda = [], doneText, forma }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [fq, setFq] = useState(() => (forma ? forma.bosh(storedAnswer) : {}));
  const formaN = steps.findIndex(c => c.forma);
  const tayyor = forma ? forma.tayyor(fq) : true;
  const done = stepN >= steps.length;
  const fqRef = useRef(fq); fqRef.current = fq;
  const yoz = (patch) => { const f = { ...fqRef.current, ...patch }; fqRef.current = f; setFq(f); if (!avval) onAnswer(screen, { ...(storedAnswer || {}), forma: f }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tayyor) return; // 5-qadam: forma tayyor bo'lmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, forma: fq });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt, 5-qadam formasi) «Bajardim»i bilan birga ko'rinsin
  const birinchiRef = useRef(true);
  useEffect(() => {
    if (birinchiRef.current) { birinchiRef.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mentor)}</Mentor>{ust && ust(fq)}</>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: c.forma && forma ? <>{fmtCode(tr(c.t))}{forma.render(fq, yoz)}</> : fmtCode(tr(c.t)),
          prompt: c.forma && forma ? forma.prompt(fq) : c.prompt && c.prompt.map(l => tr(l)),
          kimga: (c.prompt || (c.forma && forma && forma.prompt(fq))) && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
          xato: c.forma && forma ? forma.izoh(fq) : c.yordam ? <Yordam satrlar={c.yordam} /> : (c.err && fmtCode(tr(c.err)))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const QADAM_OCHISH = { uz: 'Ochish', ru: 'Открыть' };
const QADAM_PROMPT = { uz: 'Prompt', ru: 'Промпт' };
const QADAM_ISHGA = { uz: 'Ishga tushirish', ru: 'Запуск' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };

// --- Saqlanadigan natija (tayanch 8): o'qiydi pm-m8d1-okr (tajriba → gipotezaning boshi), yozadi pm-m8d4-gipoteza { agar, ozgaradi, chunki, olchov, savedAt } ---
const KEY_OKR = 'pm-m8d1-okr';
const KEY_GIP = 'pm-m8d4-gipoteza';
const okrTajriba = () => {
  const v = lsGet(KEY_OKR);
  if (!v || typeof v !== 'object' || !v.tajriba || typeof v.tajriba !== 'object') return null;
  const nima = typeof v.tajriba.nima === 'string' ? v.tajriba.nima.trim() : '';
  if (!nima || nima === '?') return null;
  const n = [1, 2, 3].includes(v.tajriba.natija) ? v.tajriba.natija : null;
  const r = n && Array.isArray(v.natijalar) ? v.natijalar[n - 1] : null;
  const natija = r && typeof r.nima === 'string' ? r.nima.trim() : '';
  return { nima, n, natija: natija && natija !== '?' ? natija : '' };
};
const GIP_KALIT = ['agar', 'ozgaradi', 'chunki', 'olchov'];
const gipOqi = () => {
  const v = lsGet(KEY_GIP);
  if (!v || typeof v !== 'object') return null;
  const g = Object.fromEntries(GIP_KALIT.map(k => [k, typeof v[k] === 'string' ? v[k] : '']));
  return GIP_KALIT.every(k => g[k].trim()) ? g : null;
};
// Tekshiruv (PM-108; forma ostida, yozilgan zahoti — 106d): null — o'tdi; { tur, blok } — blok: true bloklaydi, false yo'naltiradi
const YAXSHI_SOZ = /yaxshiroq|chiroyli|zo'r|лучше|красивее|круче/; // ru rejimida o'quvchi ruscha yozadi
const SANOQ_SOZ = /\d|%|foiz|\bsoni?\b|nechta|(^|\s)ta($|\s|[.,!?])|процент|число|количеств|сколько/;
function gipTekshir(k, matn) {
  const t = norm(matn);
  if (!t) return { tur: 'bosh', blok: true };
  if (k === 'ozgaradi' && YAXSHI_SOZ.test(t)) return { tur: 'yaxshi', blok: false };
  if (k === 'olchov' && !SANOQ_SOZ.test(t)) return { tur: 'sanoq', blok: false };
  return null;
}
const GIP_XATO = {
  bosh: { uz: "Bu bo'lak bo'sh — uni ham yozing.", ru: 'Эта часть пустая — напишите и её.' },
  yaxshi: { uz: 'Yaxshiroq — qayerda? Odamlar nimani boshqacha qiladi?', ru: 'Лучше — где? Что люди будут делать иначе?' },
  sanoq: { uz: 'Qanday sanaysiz? Masalan: «… foizi» yoki «… soni».', ru: 'Как будете считать? Например: «процент …» или «число …».' }
};
const GIP_MAYDON = [
  { k: 'agar', l: { uz: 'Agar … qilsak', ru: 'Если сделаем …' }, ph: { uz: "Nima o'zgartirasiz?", ru: 'Что измените?' } },
  { k: 'ozgaradi', l: { uz: "… o'zgaradi", ru: '… изменится' }, ph: { uz: 'Odamlar nimani boshqacha qiladi?', ru: 'Что люди будут делать иначе?' } },
  { k: 'chunki', l: { uz: 'chunki …', ru: 'потому что …' }, ph: { uz: "Nega shunday deb o'ylaysiz?", ru: 'Почему вы так думаете?' } },
  { k: 'olchov', l: { uz: 'Raqam', ru: 'Число' }, ph: { uz: 'Qaysi raqamga qaraysiz?', ru: 'На какое число смотрите?' } }
];
// Bir qatordan to'rt qatorgacha o'sadigan matn maydoni (DE-175)
const GrowInput = ({ value, onChange, onEnter, className, ...p }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 104)}px`; }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={cxx('ab-kirit', className)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && onEnter) { e.preventDefault(); onEnter(); } }} {...p} />;
};
// Artefakt-strip (U-042): «Gipotezam» — A1 5-qadamidan keyin, A2 va yakunda (test, arena, podiumda yo'q)
const GipStrip = ({ g }) => {
  const s = g || gipOqi();
  if (!s) return null;
  return (
    <div className="ab-strip fade-step">
      <span className="ab-strip-l">{tr({ uz: 'Gipotezam', ru: 'Моя гипотеза' })}</span>
      <span className="ab-strip-t">{tr({ uz: 'Agar', ru: 'Если' })} {qisqa(s.agar, 40)}</span>
      <span className="ab-strip-r">{tr({ uz: 'Raqam', ru: 'Число' })}: <b>{qisqa(s.olchov, 34)}</b></span>
    </div>
  );
};
// A1 5-qadam — gipoteza formasi: bir vaqtda bitta bo'lak katta karta (SABOQ 29); tepada ixcham chiziq, tayyor bo'laklar — holat belgisi; to'rttasi yozilgach — to'liq gap va «Saqlash»
const GipForma = ({ q, yoz }) => {
  const okr = useMemo(() => okrTajriba(), []);
  const i = q.i ?? 0;
  const [bosildi, setBosildi] = useState(false);
  const m = GIP_MAYDON[i];
  const tek = m ? gipTekshir(m.k, q[m.k]) : null;
  const korsat = tek && (tek.tur !== 'bosh' ? norm(q[m.k]).length >= 3 : bosildi);
  const keyingi = () => {
    if (!m) return;
    if (tek && tek.blok) { setBosildi(true); return; }
    setBosildi(false); yoz({ i: i + 1 });
  };
  const saqla = () => {
    const g = Object.fromEntries(GIP_KALIT.map(k => [k, String(q[k] || '').trim()]));
    lsSet(KEY_GIP, { ...g, savedAt: Date.now() });
    yoz({ saqlandi: true });
  };
  return (
    <span className="ab-gf" data-tayyor={q.saqlandi ? '1' : '0'}>
      {okr && <span className="ab-gf-kirish">{tr({ uz: 'Siz yozgan tajriba', ru: 'Ваш эксперимент' })}: <b>{qisqa(okr.nima, 60)}</b>{okr.n && okr.natija && <> · {okr.n}-{tr({ uz: 'asosiy natija bilan tekshiriladi', ru: "й ключевой результат для проверки" })}: <b>{qisqa(okr.natija, 60)}</b></>}</span>}
      <span className="ab-gf-chiziq">
        <span className="ab-gf-chiziq-l">{tr({ uz: 'Gipotezam', ru: 'Моя гипотеза' })}</span>
        {GIP_MAYDON.map((x, k) => {
          const tola = !!norm(q[x.k]);
          return <button key={x.k} type="button" className={cxx('ab-gf-n', k === i && 'joriy', tola && k !== i && 'tola')} disabled={q.saqlandi} onClick={() => yoz({ i: k })} aria-label={tr(x.l)}>{tola && k !== i ? '✓' : k + 1}</button>;
        })}
        <b className="ab-gf-son">{Math.min(i, 4)}/4</b>
      </span>
      {m ? (
        <span className="ab-gf-karta" key={m.k}>
          <span className="ab-gf-l">{i === 0 && !okr ? tr({ uz: 'Loyihangizda qaysi bitta o\'zgarishni sinab ko\'rasiz?', ru: 'Какое одно изменение вы попробуете в своём проекте?' }) : tr(m.l)}</span>
          <GrowInput value={q[m.k] || ''} placeholder={tr(m.ph)} autoFocus onChange={e => { setBosildi(false); yoz({ [m.k]: e.target.value }); }} onEnter={keyingi} />
          {m.k === 'olchov' && okr && okr.natija && <span className="ab-gf-maslahat">{tr({ uz: "OKR'ingizdagi asosiy natija", ru: 'Ключевой результат из вашего OKR' })}: {qisqa(okr.natija, 70)}</span>}
          {korsat && <span className="ab-gf-xato" role="status" key={tek.tur}>{tr(GIP_XATO[tek.tur])}</span>}
          <QTugma ikkinchi className="ab-gf-btn" onClick={keyingi}>{i < 3 ? tr({ uz: 'Keyingisi →', ru: 'Дальше →' }) : tr({ uz: "Gapni yig'ish →", ru: 'Собрать фразу →' })}</QTugma>
        </span>
      ) : (
        <span className="ab-gf-gap" key="gap">
          <span className="ab-gap">{tr({ uz: 'Agar', ru: 'Если' })} <b>{q.agar}</b>, <b>{q.ozgaradi}</b>, {tr({ uz: 'chunki', ru: 'потому что' })} <b>{q.chunki}</b>. {tr({ uz: 'Raqam', ru: 'Число' })}: <b>{q.olchov}</b>.</span>
          {q.saqlandi ? <span className="ab-gf-ok" key="ok">✓ {tr({ uz: 'Saqlandi', ru: 'Сохранено' })}</span> : <QTugma className="ab-gf-saqla" onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>}
        </span>
      )}
    </span>
  );
};
const A1_FORMA = {
  bosh: (st) => {
    if (st && st.forma) return st.forma;
    const g = gipOqi();
    if (g) return { ...g, i: 4, saqlandi: true };
    const okr = okrTajriba();
    return { agar: okr ? okr.nima : '', ozgaradi: '', chunki: '', olchov: '', i: 0 };
  },
  render: (q, yoz) => <GipForma q={q} yoz={yoz} />,
  tayyor: (q) => !!q.saqlandi,
  // Javoblar prompt qavslariga qo'yiladi; o'quvchi yozadigan qavslar — {loyiha papkasi}, {o'zgarish joyi}
  prompt: (q) => q.saqlandi ? [
    tr({ uz: "Qayerda: {loyiha papkasi} — hodisa yuboradigan funksiya va {o'zgarish joyi}.", ru: 'Где: {папка проекта} — функция, которая отправляет события, и {место изменения}.' }),
    `${tr({ uz: 'Nima qilsin: brauzer birinchi kirishda A yoki B ni tasodifiy olsin va eslab qolsin; har hodisaga ', ru: 'Что сделать: пусть браузер при первом входе случайно получает A или B и запоминает; к каждому событию добавляется ' })}variant${tr({ uz: ' qo\'shilsin. A — hozirgidek, B — gipotezam bo\'yicha: «Agar ', ru: '. A — как сейчас, B — по моей гипотезе: «Если ' })}${String(q.agar || '').trim()}».`,
    tr({ uz: "Nima buzilmasin: hozirgi hodisalar va asosiy sahifa. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: текущие события и главная страница. Больше ничего не трогай, скажи, какие файлы изменил.' })
  ] : undefined,
  izoh: (q) => q.saqlandi ? <span className="ab-kul">{tr({ uz: "Loyihangizda hodisa yuboradigan funksiya hali bo'lmasa — promptni saqlab qo'ying.", ru: 'Если в вашем проекте ещё нет функции, отправляющей события, — сохраните промпт.' })}</span> : undefined
};
// A2 5-qadam — o'z loyihasi uchun dashboard prompti: {gipotezangizdagi raqam} — A1 dagi «Raqam» qatoridan, {nima buzilmasin} — o'quvchi yozadi
const A2Forma = ({ q, yoz }) => (
  <span className="ab-gf ab-a2f" data-tayyor={norm(q.olchov) && norm(q.buzilmasin) ? '1' : '0'}>
    <span className="ab-gf-karta">
      <span className="ab-gf-l">{tr({ uz: 'Gipotezangizdagi raqam', ru: 'Число из вашей гипотезы' })}</span>
      <GrowInput value={q.olchov || ''} placeholder={tr({ uz: 'Qaysi raqamga qaraysiz?', ru: 'На какое число смотрите?' })} onChange={e => yoz({ olchov: e.target.value })} />
      <span className="ab-gf-l">{tr({ uz: 'Nima buzilmasin', ru: 'Что не сломать' })}</span>
      <GrowInput value={q.buzilmasin || ''} placeholder={tr({ uz: 'Hozir ishlayotgan qaysi joyga tegilmasin?', ru: 'Какое работающее место не трогать?' })} onChange={e => yoz({ buzilmasin: e.target.value })} />
    </span>
  </span>
);
const A2_FORMA = {
  bosh: (st) => (st && st.forma) || { olchov: (gipOqi() || {}).olchov || '', buzilmasin: '' },
  render: (q, yoz) => <A2Forma q={q} yoz={yoz} />,
  tayyor: (q) => !!(norm(q.olchov) && norm(q.buzilmasin)),
  prompt: (q) => [
    tr({ uz: "Qayerda: {loyiha papkasi} — dashboard yoki ega ko'radigan sahifa.", ru: "Где: {папка проекта} — дашборд или страница, которую видит владелец." }),
    `${tr({ uz: 'Nima qilsin: A va B uchun ', ru: "Что сделать: пусть для A и B рядом выводится " })}${String(q.olchov || '').trim() || tr({ uz: '{gipotezangizdagi raqam}', ru: '{число из вашей гипотезы}' })}${tr({ uz: ' yonma-yon chiqsin; har variantda turli brauzerlar sanalsin.', ru: "; в каждом варианте пусть считаются разные браузеры." })}`,
    `${tr({ uz: 'Nima buzilmasin: ', ru: 'Что не сломать: ' })}${String(q.buzilmasin || '').trim() || tr({ uz: '{nima buzilmasin}', ru: '{что не сломать}' })}${tr({ uz: ". Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: '. Больше ничего не трогай, скажи, какие файлы изменил.' })}`
  ],
  izoh: () => undefined
};

// A1 kutilgan natija — ikki telefon (localhost:5173 va inkognito oyna) + Neon SQL Editor: bitta brauzer ID ning hamma qatorida bir xil variant
const NEON_QATOR = [
  { nom: 'vaqt-tanladi', id: '9e07…', v: 'B' },
  { nom: 'ochdi', id: '9e07…', v: 'B' },
  { nom: 'vaqt-tanladi', id: 'b41d…', v: 'A' },
  { nom: 'ochdi', id: 'b41d…', v: 'A' }
];
const A1Natija = () => (
  <div className="ab-a1n">
    <div className="ab-juft">
      <TelPast v="A" rang yorliq="localhost:5173" kir={0} />
      <TelPast v="B" rang yorliq={tr({ uz: 'inkognito oyna', ru: 'окно инкогнито' })} kir={120} />
    </div>
    <div className="ab-neon">
      <span className="ab-neon-h"><i /><i /><i /><b>Neon · SQL Editor</b></span>
      <table className="ab-neon-t">
        <thead><tr><th>nom</th><th>brauzer_id</th><th>variant</th></tr></thead>
        <tbody>{NEON_QATOR.map((r, i) => <tr key={i} style={{ '--i': i }}><td>{r.nom}</td><td>{r.id}</td><td><span className={cxx('ab-v', r.v === 'B' && 'b')}>{r.v}</span></td></tr>)}</tbody>
      </table>
    </div>
    <p className="ab-izoh-k">{tr({ uz: 'Sizda variant boshqacha chiqishi mumkin — u tasodifiy.', ru: 'У вас вариант может выпасть другой — он случайный.' })}</p>
  </div>
);
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · variant', ru: 'Практика 1 · вариант' }}
    title={{ uz: <>Brauzer B ni olsa, <A>tugmada tanlangan soat</A> chiqsin.</>, ru: <>Вариант B: <A>на кнопке выбранное время</A>.</> }}
    mentor={{ uz: <>Talab tayyor — siz <code className="qcode">{'{qachon va qanday olsin}'}</code> joyini yozasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование готово — вы заполняете <code className="qcode">{'{когда и как получать}'}</code>; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    ust={(q) => q.saqlandi && <GipStrip g={q} />}
    forma={A1_FORMA}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`. Brauzerda `localhost:5173` — kataklar chiqsin.", ru: 'Откройте папку `maydon` в Antigravity. В первом терминале `cd backend`, `npm run start:dev`; во втором `cd web`, `npm run dev`. В браузере `localhost:5173` — пусть появятся ячейки.' } },
      { h: QADAM_PROMPT, t: { uz: "`{qachon va qanday olsin}` joyiga brauzer variantni qachon va qanday olishini yozing (uch usulli mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Вместо `{когда и как получать}` напишите, когда и как браузер получает вариант (вспомните упражнение с тремя способами), нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: Backend'da hodisalar jadvali va POST /hodisalar; saytda web/src/hodisa.js va «Band qilish» tugmasi (web/src/BandForma.jsx).", ru: 'Где: в Backend таблица hodisalar и POST /hodisalar; на сайте web/src/hodisa.js и кнопка «Band qilish» (web/src/BandForma.jsx).' },
        { uz: "Nima qilsin: hodisalar ga variant ustunini qo'sh: A yoki B, eski qatorlarda bo'sh. Brauzer variantni {qachon va qanday olsin}; variant localStorage'dagi maydon-variant da tursin.", ru: "Что сделать: добавь в hodisalar столбец variant — A или B, в старых строках пусто. Браузер получает вариант так: {когда и как получать}; вариант хранится в localStorage в maydon-variant." },
        { uz: "hodisaYoz har hodisaga variant ni qo'shib yuborsin. Tugma matni: A — «Band qilish», B — tanlangan soat bilan, masalan «18:00 ni band qilish».", ru: 'Пусть hodisaYoz добавляет variant к каждому событию. Текст кнопки: A — «Band qilish», B — с выбранным временем, например «18:00 ni band qilish».' },
        { uz: "Nima buzilmasin: uch hodisa va brauzer ID, band qilish va «Bu vaqt band» xabari, /ega va /dashboard. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: три события и ID браузера, бронирование и сообщение «Bu vaqt band», /ega и /dashboard. Больше ничего не трогай, скажи, какие файлы изменил.' }
      ], yordam: [
        { uz: '«birinchi kirishda A yoki B ni teng ehtimol bilan olsin va keyin o\'zgartirmasin»', ru: '«при первом входе пусть получает A или B с равной вероятностью и потом не меняет»' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "Backend terminali o'zi qayta yukladi (yangi ustun ham o'zi qo'shiladi), sayt o'zi yangilandi, xato yo'q.", ru: 'Терминал Backend перезагрузился сам (новый столбец тоже добавится сам), сайт обновился сам, ошибок нет.' }, err: XATO_YOLI },
      { h: { uz: 'Brauzerda tekshirish', ru: 'Проверка в браузере' }, t: { uz: "talabning har qatorini tekshiring: (1) `localhost:5173` da bo'sh katakni bosing: forma ostidagi tugmada «Band qilish» yoki siz bosgan soat bilan matn. Sahifani yangilang (F5) va yana bosing — matn o'sha: variant eslab qolindi. (2) Hamma inkognito oynalarni yoping va yangisini oching (Chrome va Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) — sayt uni yangi brauzer deb ko'radi va variantni qaytadan beradi. O'sha matn yana chiqishi ham to'g'ri — tasodif. Ikkala matnni sinfdoshlar telefonida ko'rasiz (Amaliyot 2). (3) Neon SQL Editor'da: `SELECT nom, brauzer_id, variant FROM hodisalar ORDER BY yaratilgan DESC LIMIT 6;` — yangi qatorlarda `variant` A yoki B, bitta brauzer ID ning hamma qatorida bir xil. Mos kelmagan qatorni uch qism bilan agentga yozing. Hammasi mos bo'lsa: `git add .`, `git commit -m \"A/B variant\"`, `git push` — Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).", ru: 'проверьте каждую строку требования: (1) на `localhost:5173` нажмите свободную ячейку: на кнопке под формой «Band qilish» или текст с выбранным временем. Обновите страницу (F5) и нажмите снова — текст тот же: вариант запомнился. (2) Закройте все окна инкогнито и откройте новое (Chrome и Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) — сайт видит его как новый браузер и выдаёт вариант заново. Если выпал тот же текст — это тоже верно, случайность. Оба текста увидите на телефонах одноклассников (Практика 2). (3) В Neon SQL Editor: `SELECT nom, brauzer_id, variant FROM hodisalar ORDER BY yaratilgan DESC LIMIT 6;` — в новых строках `variant` A или B, во всех строках одного ID браузера одинаковый. Несовпавшую строку напишите агенту тремя частями. Если всё совпало: `git add .`, `git commit -m \"A/B variant\"`, `git push` — Render и Netlify возьмут код из GitHub и обновятся сами (несколько минут).' } },
      { h: QADAM_GOYA, t: { uz: "loyihangiz uchun gipoteza yozing. Javoblaringiz ostidagi promptning qavslariga o'zi qo'yiladi — «Nusxalash», uyda o'z loyihangizda yuborasiz.", ru: 'напишите гипотезу для своего проекта. Ответы сами встанут в скобки промпта ниже — «Скопировать», дома отправите в своём проекте.' }, forma: true }
    ]}
    natija={<A1Natija />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, <>git checkout -f m10-dars-04-start <span className="ab-ortda-iz">{tr({ uz: "(.env fayllaringiz o'zgarmaydi)", ru: '(ваши файлы .env не меняются)' })}</span></>]}
    doneText={{ uz: 'Har brauzer o\'z variantini oldi: B da tugmada tanlangan soat chiqadi.', ru: 'Каждый браузер получил свой вариант: в B на кнопке выбранное время.' }} />
);

// Dashboard'ning A/B qismi (3-darsdagi maket ko'rinishi; bugun qo'shiladigan «A/B test · tugma matni») — A2 o'ng tomoni va 8-ekran savoli ustida; raqamlar SINF dan
const AbJadval = ({ kirish = true }) => {
  const a = useSanoq(SINF.A.tanladi, kirish, 350), ab = useSanoq(SINF.A.band, kirish, 450), af = useSanoq(foizi(SINF.A), kirish, 600);
  const b = useSanoq(SINF.B.tanladi, kirish, 350), bb = useSanoq(SINF.B.band, kirish, 450), bf = useSanoq(foizi(SINF.B), kirish, 600);
  const qator = (v, t, bn, f) => (
    <div className={cxx('ab-abq', v === 'B' && 'b')}>
      <span className="ab-abq-v"><b>{v}</b>{tugmaT(v)}</span>
      <span className="ab-abq-s">{t}</span><span className="ab-abq-s">{bn}</span>
      <span className="ab-abq-f"><b>{f}%</b><i style={{ width: `${f}%` }} /></span>
    </div>
  );
  return (
    <div className="ab-ab">
      <span className="ab-ab-n">A/B test · {tr({ uz: 'tugma matni', ru: 'текст кнопки' })}</span>
      <div className="ab-abq ab-abq-bosh"><span /><span className="ab-abq-s">{tr({ uz: 'vaqtni tanladi', ru: 'выбрали время' })}</span><span className="ab-abq-s">{tr({ uz: 'band qildi', ru: 'забронировали' })}</span><span className="ab-abq-f">{tr({ uz: 'foiz', ru: 'процент' })}</span></div>
      {qator('A', a, ab, af)}
      {qator('B', b, bb, bf)}
    </div>
  );
};
const DashAB = () => (
  <div className="ab-dash">
    <span className="ab-dash-bar"><i /><i /><i /><span className="ab-dash-manzil">maydon-….netlify.app/dashboard</span></span>
    <div className="ab-dash-s">
      <b className="ab-dash-bosh">Maydon · dashboard</b>
      <div className="ab-dash-kul" aria-hidden="true">
        <span className="ab-dash-hozir"><i />{tr({ uz: 'Oxirgi 5 daqiqada', ru: 'За последние 5 минут' })}</span>
        <span className="ab-dash-uch">{UCH_QADAM.map(q => <span key={q.k}>{tr(q.t)}</span>)}</span>
      </div>
      <AbJadval />
      <span className="ab-dash-iz">{tr({ uz: 'har variantda — turli brauzerlar soni · Sizda raqamlar boshqacha — o\'z tekshiruv bosishlaringiz ham sanaladi.', ru: 'в каждом варианте — число разных браузеров · У вас числа другие — ваши проверочные нажатия тоже считаются.' })}</span>
    </div>
  </div>
);
const A2Natija = () => (
  <div className="ab-a2n">
    <DashAB />
    <QIzoh>{tr({ uz: 'A ning foizi faqat A ni ko\'rgan brauzerlardan, B niki — faqat B ni ko\'rganlardan chiqadi.', ru: 'Процент A считается только по браузерам, видевшим A, процент B — только по видевшим B.' })}</QIzoh>
    <QIzoh>{tr({ uz: '17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi.', ru: '17 браузеров для вывода мало — это упражнение на запуск.' })}</QIzoh>
  </div>
);
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · dashboard va sinfdoshlar', ru: "Практика 2 · дашборд и одноклассники" }}
    title={{ uz: <>Dashboard <A>A va B foizini</A> yonma-yon ko'rsatsin.</>, ru: <>Пусть дашборд показывает <A>процент A и B</A> рядом.</> }}
    mentor={{ uz: <>Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Теперь строку «Что сделать» пишете сами, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    ust={() => <GipStrip />}
    forma={A2_FORMA}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "ikkala terminal ishlayapti. `localhost:5173/dashboard` ga ega paroli bilan kiring: «Oxirgi 5 daqiqada» va uch qadam bor, A va B hali yo'q.", ru: "оба терминала работают. Войдите на `localhost:5173/dashboard` с паролем владельца: есть «Oxirgi 5 daqiqada» и три шага, A и B пока нет." } },
      { h: QADAM_PROMPT, t: { uz: "`{nima qilsin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'строку `{что сделать}` напишите сами, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: Backend'da GET /hodisalar/sanoq; saytda /dashboard sahifasi (web/).", ru: 'Где: в Backend GET /hodisalar/sanoq; на сайте страница /dashboard (web/).' },
        { uz: 'Nima qilsin: {nima qilsin}', ru: 'Что сделать: {что сделать}' },
        { uz: "Nima buzilmasin: «Oxirgi 5 daqiqada» va uch qadam, har 5 soniyalik so'rov, parol bilan kirish va POST /hodisalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: «Oxirgi 5 daqiqada» и три шага, запрос каждые 5 секунд, вход по паролю и POST /hodisalar. Больше ничего не трогай, скажи, какие файлы изменил.' }
      ], yordam: [
        { uz: "«Nima qilsin: sanoq javobiga `variantlar` qo'shilsin — A va B uchun `vaqt-tanladi`, `band-qildi` (shu kun, turli brauzerlar soni) va `foiz` (band qildi / vaqtni tanladi × 100, butun songa yaxlitlab; hech kim tanlamagan bo'lsa — 0). Dashboard uch qadam ostida A va B ni yonma-yon ko'rsatsin.»", ru: "«Что сделать: в ответ подсчёта добавь `variantlar` — для A и B `vaqt-tanladi`, `band-qildi` (за этот день, число разных браузеров) и `foiz` (забронировали / выбрали время × 100, округлить до целого; если никто не выбрал — 0). Дашборд под тремя шагами пусть показывает A и B рядом.»" }
      ] },
      { h: QADAM_ISHGA, t: { uz: "laptopda dashboard'da A va B qatori chiqdi. Keyin `git add .`, `git commit -m \"A/B dashboard\"`, `git push` — Render va Netlify o'zi yangilanadi (bir necha daqiqa).", ru: "на ноутбуке в дашборде появились строки A и B. Затем `git add .`, `git commit -m \"A/B dashboard\"`, `git push` — Render и Netlify обновятся сами (несколько минут)." }, err: XATO_YOLI },
      { h: { uz: 'Sinfdoshlar bilan tekshirish', ru: 'Проверка с одноклассниками' }, t: { uz: "Netlify manzilingizni (`….netlify.app`) 3–4 sinfdoshingizga bering: ular telefonida ochib, o'zi xohlagan vaqtni tanlasin; band qilish-qilmasligini o'zi hal qiladi (ism va telefon — namuna). Telefonlarni yonma-yon qo'ying: tugmada ikki xil matn chiqishi mumkin. Siz `….netlify.app/dashboard` da ega paroli bilan kuzating: A va B qatori keyingi so'rovdan keyin yangilanadi. Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha. Netlify yoki Render yangilanmasa — tekshiruvni laptopda inkognito oyna bilan qiling, push'ni mentor bilan ko'rasiz.", ru: 'Дайте адрес Netlify (`….netlify.app`) 3–4 одноклассникам: пусть откроют на телефоне и выберут любое время; бронировать или нет — решают сами (имя и телефон — образец). Положите телефоны рядом: на кнопке может быть два разных текста. Вы следите на `….netlify.app/dashboard` с паролем владельца: строки A и B обновятся после следующего запроса. Если бесплатный Backend уснул, первый ответ может задержаться — примерно до минуты. Если Netlify или Render не обновились — проверьте на ноутбуке в окне инкогнито, push разберёте с ментором.' } },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z loyihangiz uchun yozing: dashboard gipotezangizdagi raqamni A va B uchun ko'rsatsin. Qavslarni to'ldiring, «Nusxalash» — uyda yuborasiz.", ru: "напишите этот промпт для своего проекта: пусть дашборд показывает число из вашей гипотезы для A и B. Заполните скобки, «Скопировать» — отправите дома." }, forma: true }
    ]}
    natija={<A2Natija />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, <>git checkout -f m10-dars-04-done <span className="ab-ortda-iz">{tr({ uz: "(Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan)", ru: '(Render и Netlify — ваши, с деплоя прошлого модуля)' })}</span></>]}
    doneText={{ uz: 'B varianti sinfdoshlarga ketdi, dashboard A va B foizini ko\'rsatadi.', ru: "Вариант B ушёл к одноклассникам, дашборд показывает процент A и B." }} />
);

// ===== SCREEN 8 — 2-SAVOL, YAKUNIY (QuestionScreen → QTest; INLINE_KEYS.s8 = 1; savol ustida dashboard'ning A/B qismi — SINF dan) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="B ning foizi yuqori. Endi nima qilasiz?"
    question={<div className="ab-s8-ust"><AbJadval /><h2 className="title h-ask">{tr({ uz: <>B ning foizi yuqori. <A>Endi nima qilasiz?</A></>, ru: <>Процент B выше. <A>Что вы сделаете теперь?</A></> })}</h2></div>}
    options={[
      { uz: 'B yutdi — hammaga B ni qo\'yamiz', ru: 'B победил — ставим B всем' },
      { uz: "Ma'lumot hali kam — test davom etadi", ru: 'Данных пока мало — тест продолжается' },
      { uz: "Guruhlar teng emas — test noto'g'ri", ru: 'Группы не равны — тест неверный' },
      { uz: 'A yaxshiroq — vaqt tanlaganlar ko\'p', ru: 'A лучше — выбравших время больше' }
    ]} correctIdx={1}
    explainCorrect={{ uz: '17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi.', ru: '17 браузеров для вывода мало — это упражнение на запуск.' }}
    explainWrong={{
      0: { uz: 'B oldinda — rost. Lekin 17 ta brauzer xulosaga yetadimi?', ru: 'B впереди — верно. Но хватит ли 17 браузеров для вывода?' },
      2: { uz: 'Tasodifiy bo\'lishda 9 va 8 — tabiiy, foiz solishtiriladi.', ru: 'При случайном делении 9 и 8 — обычно, сравнивают процент.' },
      3: { uz: 'Vaqt tanlash tugmadan oldin — gipotezadagi raqam qaysi?', ru: 'Выбор времени — до кнопки. Какое число в гипотезе?' },
      default: { uz: 'Nechta brauzer bor? Shu son xulosaga yetadimi?', ru: 'Сколько браузеров? Хватит ли этого для вывода?' }
    }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (SABOQ 12), qolipdagi QKartochka (DE-204). Orqa tomon — oddiy matn (kod-belgisiz); old va izoh — fmtCode.
const KARTALAR = [
  { front: { uz: 'Gipoteza nima?', ru: 'Что такое гипотеза?' }, back: { uz: "«Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin", ru: "Проверяемая догадка в форме «Если сделаем …, изменится …, потому что …»" }, note: { uz: 'Yoniga qaysi raqamga qarashingiz yoziladi', ru: 'Рядом пишут, на какое число смотреть' } },
  { front: { uz: '«Maydon» gipotezasi qanday?', ru: 'Какая гипотеза у «Maydon»?' }, back: { uz: "Agar tugmada tanlangan soatni yozsak, vaqtni tanlaganlardan ko'proq o'yinchi band qiladi", ru: 'Если напишем на кнопке выбранное время, больше игроков из выбравших время забронируют' }, note: { uz: "Chunki o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi", ru: 'Потому что игрок видит прямо на кнопке, какое время бронирует' } },
  { front: { uz: 'Gipotezadagi «chunki» nima uchun kerak?', ru: 'Зачем в гипотезе «потому что»?' }, back: { uz: "O'zgarish odamga nega ta'sir qilishini aytadi", ru: 'Говорит, почему изменение повлияет на человека' }, note: { uz: 'Sabab ham taxmin — uni raqam tekshiradi', ru: "Причина — тоже догадка, её проверяет число" } },
  { front: { uz: "Tugma matni o'zgarsa, qaysi raqamga qaraysiz?", ru: 'Если меняется текст кнопки, на какое число смотрите?' }, back: { uz: 'Vaqtni tanlaganlardan band qilganlar foiziga', ru: 'На процент забронировавших среди выбравших время' }, note: { uz: 'Tugma vaqt tanlangandan keyin chiqadi', ru: 'Кнопка появляется после выбора времени' } },
  { front: { uz: 'A/B test nima?', ru: 'Что такое A/B-тест?' }, back: { uz: "Odamlarning bir qismi A ni, qolgani B ni ko'radi, keyin raqamlar solishtiriladi", ru: 'Одна часть людей видит A, остальные — B, потом числа сравнивают' }, note: { uz: 'A — hozirgi variant, B — yangi', ru: 'A — текущий вариант, B — новый' } },
  { front: { uz: "Nega hammaga B ni ko'rsatib, o'tgan hafta bilan solishtirmaymiz?", ru: 'Почему не показать всем B и не сравнить с прошлой неделей?' }, back: { uz: "Haftalar orasida boshqa narsa ham o'zgaradi", ru: 'Между неделями меняется и другое' }, note: { uz: "Masalan, mahalla chatida e'lon chiqadi", ru: 'Например, в чате махалли выходит объявление' } },
  { front: { uz: 'Bizning testda brauzer variantni qanday oladi?', ru: 'Как в нашем тесте браузер получает вариант?' }, back: { uz: 'Birinchi kirishda tasodifiy, keyin eslab qoladi', ru: 'Случайно при первом входе, потом запоминает' }, note: { uz: '`maydon-variant` — sahifa yangilansa ham o\'sha variant', ru: '`maydon-variant` — даже после обновления страницы тот же вариант' } },
  { front: { uz: "Bitta o'yinchi telefon va laptopdan kirsa, qaysi variantni ko'radi?", ru: 'Если один игрок заходит с телефона и с ноутбука, какой вариант он увидит?' }, back: { uz: "Har brauzerda alohida — ikki xil bo'lishi mumkin", ru: 'В каждом браузере свой — может быть два разных' }, note: { uz: 'Variant brauzerga beriladi, odamga emas', ru: 'Вариант выдаётся браузеру, а не человеку' } },
  { front: { uz: 'Guruhlar 9 va 8 chiqsa, nimani solishtirasiz?', ru: 'Если группы вышли 9 и 8, что сравниваете?' }, back: { uz: 'Har guruhdagi foizni', ru: 'Процент в каждой группе' }, note: { uz: 'Tasodifiy bo\'lishda guruhlar teng chiqmasligi mumkin', ru: 'При случайном делении группы могут выйти неравными' } },
  { front: { uz: 'A — 9 tadan 3, B — 8 tadan 4. Xulosa chiqarasizmi?', ru: 'A — 3 из 9, B — 4 из 8. Делаете вывод?' }, back: { uz: "Hali yo'q: 17 ta brauzer xulosa uchun kam", ru: 'Пока нет: 17 браузеров для вывода мало' }, note: { uz: 'Bu — ishga tushirish mashqi', ru: 'Это — упражнение на запуск' } },
  { front: { uz: "Booking.com o'zgarishni qanday tekshiradi?", ru: 'Как Booking.com проверяет изменение?' }, back: { uz: 'Avval foydalanuvchilarning bir qismida, A/B test bilan', ru: 'Сначала на части пользователей, A/B-тестом' }, note: { uz: '2017-yilda bir vaqtda 1000 dan ortiq A/B test (kompaniya chiqishlari)', ru: 'В 2017 году одновременно больше 1000 A/B-тестов (выступления компании)' } },
  { front: { uz: 'Hodisa qaysi variantdan kelganini Backend qanday biladi?', ru: 'Как Backend узнаёт, из какого варианта пришло событие?' }, back: { uz: "hodisaYoz har hodisaga variant ni qo'shadi", ru: 'hodisaYoz добавляет variant к каждому событию' }, note: { uz: '`hodisalar` jadvalida `variant` ustuni', ru: 'Столбец `variant` в таблице `hodisalar`' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <div className={cxx('ab-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="ab-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «kim uchun · nechta · muddat» + raqamli qadamlar; alohida .homework.jsx YO'Q — tayanch 4) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "«Maydon» nusxangiz va o'z loyihangiz", ru: 'ваша копия «Maydon» и ваш проект' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '3–5 kishi', ru: '3–5 человек' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Netlify havolangizni 3–5 kishiga yuboring (oila, do'stlar): «Bo'sh vaqtni tanlab ko'ring». Ism va telefon o'rniga namuna yozishlarini ayting.", ru: "Отправьте ссылку Netlify 3–5 людям (семья, друзья): «Попробуйте выбрать свободное время». Попросите вместо имени и телефона вписать что-нибудь для примера." },
  { uz: "Ular kirgan kuni `/dashboard` ni oching va A, B qatorini yozib qo'ying: vaqtni tanladi, band qildi, foiz.", ru: 'В день, когда они зайдут, откройте `/dashboard` и запишите строки A и B: выбрали время, забронировали, процент.' },
  { uz: "Amaliyot 1 da saqlagan promptni o'z loyihangizga yuboring; hodisalar hali bo'lmasa — saqlab qo'ying.", ru: 'Отправьте промпт, сохранённый в Практике 1, в свой проект; если событий ещё нет — сохраните его.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card ab-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ab-hw-karta">
      {HW_KARTA.map((r, i) => <div key={i} className="ab-hw-q"><span className="ab-hw-k">{tr(r.k)}</span><span className="ab-hw-v">{tr(r.v)}</span></div>)}
    </div>
    <ol className="ab-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{fmtCode(tr(q))}</span></li>)}</ol>
    <p className="ab-hw-izoh">{tr({ uz: 'Bir-ikki kishi kirsa ham yozing — bu kuzatuv, xulosa emas.', ru: 'Пишите, даже если зашли один-два человека, — это наблюдение, а не вывод.' })}</p>
    {keyingi && <span className="ab-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013 — kartochkaga qo'shilmaydi) + «Gipotezam» strip. CODE STRIKE va arena — darsda =====
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
    { uz: "Bu misolda raqam — o'zgarishga eng yaqin qadamning foizi.", ru: 'В этом примере число — процент ближайшего к изменению шага.' },
    { uz: "A va B bir vaqtda ishlasa, boshqa vaqtga xos o'zgarishlar kamroq aralashadi.", ru: 'Если A и B работают одновременно, изменения другого времени примешиваются меньше.' },
    { uz: 'Bizning testda har brauzer variantni tasodifiy oladi va o\'sha variantda qoladi.', ru: 'В нашем тесте каждый браузер получает вариант случайно и остаётся в нём.' },
    { uz: "Tasodifiy bo'lishda guruhlar teng chiqmasligi mumkin, shuning uchun foiz solishtiriladi.", ru: 'При случайном делении группы могут выйти неравными, поэтому сравнивают процент.' },
    { uz: '17 ta brauzer xulosa uchun kam: bugungi test — ishga tushirish mashqi.', ru: '17 браузеров для вывода мало: сегодняшний тест — упражнение на запуск.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Kiberxavfsizlik: zaiflikni topib yopamiz»</b>.</>, ru: <>Следующий урок — <b>«Кибербезопасность: находим и закрываем уязвимость»</b>.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Gipoteza endi <A>raqam bilan</A> tekshirilmoqda.</>, ru: <>Гипотезу теперь проверяют <A>числом</A>.</> })}
        cta={<>
          <div className="ab-fikr fade-up d1"><span className="ab-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="ab-fikr-t small">{tr({ uz: 'Gipoteza qaysi raqamga qarashni oldindan aytadi, A/B test shu raqamni ikki guruhda bir vaqtda solishtiradi.', ru: 'Гипотеза заранее говорит, на какое число смотреть, а A/B-тест сравнивает это число в двух группах одновременно.' })}</p></div>
          <GipStrip />
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
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
export default function PmAbTestLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARS VIZUALI — A/B maketi (ab-). Faqat qolip tokenlari (D3); Booking.com nom rangi — maket mazmuni; emoji yo'q (D4) === */
        /* Navbatdagi harakat: halqa + yengil pulsatsiya (SABOQ 11) */
        .ab-navbat { animation: ab-puls 1.9s ease-out 0.6s infinite; }
        @keyframes ab-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.42)}; } 70%, 100% { box-shadow: 0 0 0 11px ${fon(T.accent, 0)}; } }
        @keyframes ab-kir { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes ab-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.ok, 0.5)}; } 100% { box-shadow: 0 0 0 10px ${fon(T.ok, 0)}; } }
        @keyframes ab-pop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.18); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes ab-sur { from { opacity: 0; transform: translateX(14px); background: ${T.accentSoft}; } to { opacity: 1; transform: none; } }
        /* Telefon = «Maydon» sayti: o'lchami barqaror 172×272 (SABOQ 22), yorliq ramka ustida (SABOQ 23) */
        .ab-tel-ust { position: relative; display: flex; flex-direction: column; align-items: center; gap: 7px; flex: none; min-width: 0; animation: ab-kir 0.5s cubic-bezier(.2,.9,.3,1.1) both; animation-delay: var(--d, 0ms); }
        .ab-tel-yorliq { font-size: 12px; font-weight: 800; letter-spacing: 0.02em; padding: 3px 12px; border-radius: 999px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; white-space: nowrap; }
        .ab-tel-yorliq.b { border-color: ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; }
        .ab-tel-joy { position: relative; display: flex; align-items: flex-end; gap: 12px; }
        .ab-telefon { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 6px; padding: 8px 8px 10px; border: 2px solid ${T.ink}; border-radius: 22px; background: ${T.paper}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); overflow: hidden; font-family: 'Manrope', sans-serif; text-align: left; color: ${T.ink}; transition: transform 0.35s cubic-bezier(.2,.9,.3,1.25), border-color 0.25s, box-shadow 0.25s, opacity 0.3s; }
        button.ab-telefon { cursor: pointer; font: inherit; }
        button.ab-telefon:hover:not(:disabled) { border-color: ${T.accent}; }
        .ab-telefon.a { border-color: ${T.ink2}; }
        .ab-telefon.b { border-color: ${T.accent}; }
        .ab-telefon.on { border-color: ${T.accent}; transform: translateY(-8px); box-shadow: 0 20px 30px -14px ${fon(T.accent, 0.55)}; }
        .ab-telefon.xira { opacity: 0.5; }
        .ab-tel-manzil { flex: none; height: 14px; display: flex; align-items: center; padding: 0 7px; border-radius: 7px; background: ${T.bg}; }
        .ab-tel-manzil i { display: block; width: 46%; height: 4px; border-radius: 2px; background: ${T.line}; }
        .ab-tel-s { display: flex; flex-direction: column; gap: 5px; min-height: 0; }
        .ab-tel-nom { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .ab-kun { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ab-kun i { font-style: normal; }
        .ab-kun.katta { justify-content: space-between; font-size: 12px; color: ${T.ink}; }
        .ab-kun.katta i { display: grid; place-items: center; width: 32px; height: 26px; border-radius: 8px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 20px; font-weight: 800; line-height: 1; box-shadow: inset 0 0 0 1.5px ${T.accent}; animation: ab-pop 0.5s ease-out 0.3s both; }
        .ab-kataklar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 4px; }
        .ab-katak { display: grid; place-items: center; height: 19px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ab-katak.on { background: ${T.accentSoft}; border-color: ${T.accent}; color: ${T.accent}; font-weight: 700; }
        .ab-forma { display: flex; flex-direction: column; gap: 4px; padding-top: 2px; animation: fade-step 0.3s ease-out; }
        .ab-forma-s { font-size: 11px; font-weight: 800; color: ${T.ink}; }
        .ab-inp { display: flex; align-items: center; height: 22px; padding: 0 7px; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .ab-inp small { font-size: 11px; color: ${T.ink2}; }
        .ab-tel-tugma { position: relative; margin-top: auto; display: block; text-align: center; padding: 8px 6px; border-radius: 9px; background: ${T.accent}; color: #fff; font-size: 11.5px; font-weight: 800; white-space: nowrap; animation: fade-step 0.35s ease-out; }
        .ab-tel-tugma.chaq { animation: ab-chaq 0.8s ease-out; }
        @keyframes ab-chaq { 0% { transform: scale(1); box-shadow: 0 0 0 0 ${fon(T.accent, 0.6)}; } 30% { transform: scale(1.07); } 100% { transform: scale(1); box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .ab-tel-tugma .ab-tel-teg { position: absolute; top: -9px; right: 6px; }
        .ab-tel-teg { display: inline-block; padding: 1px 7px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; line-height: 1.4; }
        .ab-yangi { position: absolute; left: calc(100% + 14px); bottom: 10px; display: block; padding: 8px 12px; border-radius: 9px; border: 1.5px dashed ${T.ink2}; color: ${T.ink2}; background: ${T.paper}; font-size: 12px; font-weight: 800; white-space: nowrap; animation: ab-kir 0.45s ease-out 0.4s both; }
        .ab-yangi .ab-tel-teg { position: absolute; top: -11px; left: 8px; }
        .ab-pufak { position: absolute; z-index: 3; left: 86px; bottom: 48px; transform: translateX(-50%); max-width: 196px; width: max-content; padding: 7px 11px; border-radius: 12px; background: ${T.ink}; color: #fff; font-size: 12.5px; font-weight: 700; line-height: 1.35; text-align: center; box-shadow: 0 10px 22px -10px rgba(${T.shadowBase},0.6); animation: ab-pufak 0.4s cubic-bezier(.2,.9,.3,1.3) both; }
        .ab-pufak::after { content: ''; position: absolute; left: 50%; bottom: -6px; margin-left: -6px; border: 6px solid transparent; border-top-color: ${T.ink}; border-bottom-width: 0; }
        @keyframes ab-pufak { from { opacity: 0; transform: translate(-50%, 8px) scale(0.85); } to { opacity: 1; transform: translateX(-50%); } }
        /* Mini uch qadam: raqamsiz ustunlar; «vaqtni tanladi → band qildi» oralig'ida foiz yorlig'i */
        .ab-qadam { position: relative; display: block; width: 172px; padding-top: 14px; }
        .ab-q-ust { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .ab-q-u { display: flex; flex-direction: column; align-items: stretch; gap: 3px; min-width: 0; transition: opacity 0.3s; }
        .ab-q-bar { position: relative; display: flex; align-items: flex-end; height: 30px; padding: 0 9px; }
        .ab-q-bar i { display: block; width: 100%; border-radius: 4px 4px 2px 2px; background: ${T.line}; transition: background 0.3s, height 0.5s; }
        .ab-q-n { font-size: 11px; font-weight: 700; line-height: 1.2; text-align: center; color: ${T.ink2}; }
        .ab-q-u.yon .ab-q-bar i { background: ${T.accent}; animation: ab-yon 1s ease-out; }
        .ab-q-u.yon .ab-q-n { color: ${T.accent}; }
        .ab-q-u.ochir { opacity: 0.45; }
        .ab-q-u.ochir .ab-q-bar::after { content: ''; position: absolute; left: 4px; right: 4px; top: 50%; border-top: 2px solid ${T.ink2}; transform: rotate(-18deg); animation: fade-step 0.3s ease-out; }
        .ab-q-str { position: absolute; left: 50%; top: 0; transform: translateX(-50%); font-size: 15px; font-weight: 800; color: ${T.accent}; animation: ab-pop 0.5s ease-out both; }
        .ab-q-foiz { position: absolute; left: 66.6%; top: -15px; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 2px; padding: 1px 7px; border-radius: 999px; background: ${T.paper}; border: 1.5px dashed ${T.line}; font-size: 11px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; }
        .ab-q-foiz.on { border-style: solid; border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; animation: ab-pop 0.5s ease-out both; }
        .ab-q-foiz.yuq { border-color: ${T.accent}; color: ${T.accent}; animation: ab-pop 0.5s ease-out both; }
        .ab-q-foiz b { font-size: 12px; }
        .ab-q-soroq { position: absolute; left: 30%; top: -14px; z-index: 2; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: ${T.paper}; border: 1.5px solid ${T.ink2}; color: ${T.ink2}; font-size: 14px; animation: ab-pop 0.45s ease-out both; }
        .ab-q-kal { position: absolute; left: 30%; top: -16px; z-index: 2; transform: translateX(-50%); width: 26px; height: 24px; border-radius: 5px; border: 1.5px solid ${T.ink2}; border-top-width: 6px; background: ${T.paper}; animation: ab-pop 0.45s ease-out both; }
        .ab-q-kal i { position: absolute; inset: 4px 4px 4px; background-image: radial-gradient(${T.ink2} 1.2px, transparent 1.4px); background-size: 6px 6px; }
        .ab-qadam.chiziq { padding-top: 6px; }
        .ab-qadam.chiziq .ab-q-bar { height: 8px; }
        .ab-qadam.chiziq .ab-q-bar i { height: 4px; }
        /* Kirish oqimi: brauzer belgilari tepada → ajratgich → A yoki B tomoniga */
        .ab-juft-ust { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; width: 100%; }
        .ab-juft { position: relative; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); justify-items: center; align-items: start; gap: 14px; }
        .ab-oqim { position: relative; height: 64px; }
        .ab-juft-ust.ab-reja { padding-top: 2px; }
        .ab-oqim.ixcham { height: 46px; }
        .ab-oqim.ixcham .ab-ayri { inset: 8px 0 0; height: 30px; }
        .ab-past { position: relative; display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; width: 172px; height: 146px; padding: 0 8px 10px; border: 2px solid ${T.ink}; border-top: 0; border-radius: 0 0 22px 22px; background: ${T.paper}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35); -webkit-mask-image: linear-gradient(transparent, #000 28%); mask-image: linear-gradient(transparent, #000 28%); }
        .ab-past.a { border-color: ${T.ink2}; }
        .ab-past.b { border-color: ${T.accent}; }
        .ab-past > .ab-tel-tugma { margin-top: 0; }
        .ab-ayri { position: absolute; inset: 12px 0 0; width: 100%; height: 38px; overflow: visible; }
        .ab-ayri path { fill: none; stroke: ${T.line}; stroke-width: 2; stroke-dasharray: 5 5; vector-effect: non-scaling-stroke; }
        .ab-ayri rect { fill: ${T.paper}; stroke: ${T.ink2}; stroke-width: 1.5; vector-effect: non-scaling-stroke; }
        .ab-br { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 5px; transform: translateX(-50%); transition: left 0.6s cubic-bezier(.45,.05,.25,1), top 0.6s cubic-bezier(.45,.05,.25,1); animation: ab-pop 0.4s ease-out both; }
        .ab-br i { display: grid; place-items: center; width: 16px; height: 16px; border-radius: 50%; background: ${T.paper}; border: 3px solid ${T.line}; font-style: normal; font-size: 9px; font-weight: 800; color: ${T.ink2}; line-height: 1; transition: border-color 0.3s; }
        .ab-br code { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .ab-br.a i { border-color: ${T.ink2}; }
        .ab-br.kul i { width: 14px; height: 14px; border: 0; background: ${fon(T.ink2, 0.45)}; }
        .ab-br.b i { border-color: ${T.accent}; }
        .ab-br.ikki i { border-color: ${T.accent} ${T.ink2} ${T.ink2} ${T.accent}; }
        .ab-br.ok i { border-color: ${T.ok}; color: ${T.ok}; animation: ab-yon 1s ease-out; }
        .ab-br.ok code { border-color: ${T.ok}; color: ${T.ok}; }
        .ab-br.start i { animation: ab-pop 0.4s ease-out both; }
        .ab-oqim-y { position: absolute; left: 50%; top: 22px; transform: translateX(-50%); padding: 3px 12px; border-radius: 999px; background: ${T.okFon}; color: ${T.ok}; font-size: 12px; font-weight: 800; white-space: nowrap; }
        .ab-pufak.ab-pufak-oqim { left: 50%; bottom: auto; top: -2px; max-width: none; white-space: nowrap; }
        .ab-kal { position: absolute; inset: 4px 0 0; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
        .ab-kal-k { position: relative; justify-self: center; display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 150px; padding: 6px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; border-top: 5px solid ${T.ink2}; background: ${T.paper}; font-size: 12px; font-weight: 800; color: ${T.ink2}; animation: ab-kir 0.4s ease-out both; }
        .ab-kal-k.b { border-top-color: ${T.accent}; color: ${T.accent}; }
        .ab-elon { display: block; padding: 2px 8px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink2}; font-size: 11px; font-weight: 700; white-space: nowrap; animation: ab-tush 0.6s cubic-bezier(.3,1.4,.5,1) both; }
        @keyframes ab-tush { from { opacity: 0; transform: translateY(-40px) rotate(-6deg); } to { opacity: 1; transform: none; } }
        /* 0-ekran: ikki telefon, ostida keyin to'ldiriladigan joy (U-041) */
        .ab-joy { display: block; min-width: 120px; height: 26px; margin-top: 4px; border-radius: 8px; border: 1.5px dashed ${T.line}; }
        .ab-joy.tola { display: flex; align-items: center; justify-content: center; gap: 4px; border-style: solid; border-color: ${T.line}; background: ${T.bg}; font-size: 12px; font-weight: 700; color: ${T.ink2}; animation: ab-pop 0.45s ease-out both; }
        .ab-joy.tola b { color: ${T.accent}; font-size: 14px; }
        .ab-katta-soroq { position: absolute; z-index: 3; left: 50%; top: 112px; transform: translateX(-50%); width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: ${T.accent}; color: #fff; font-size: 26px; font-weight: 800; box-shadow: 0 10px 22px -8px ${fon(T.accent, 0.6)}; animation: ab-pop 0.5s ease-out both; }
        .ab-s0.kut .ab-telefon { animation: ab-puls 1.9s ease-out 1.2s infinite; }
        .q-kirish:has(.ab-s0) > .zoomable > .q-split, .q-kirish:has(.ab-s0) > .q-split { align-items: start; }
        p.ab-repo { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.ab-repo code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; }
        .q-reja .q-split { align-items: start; }
        /* 2-ekran: chapda telefon (+ «yangi» matn), o'ngda gipoteza kartasi; joriy qatorda javoblar */
        .ab-s2 { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: start; gap: clamp(16px,2.6vw,30px); }
        .ab-s2-tel { display: flex; justify-content: flex-start; padding: 4px 158px 0 0; }
        .ab-gk { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 14px 16px 12px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; animation: ab-kir 0.45s ease-out 0.15s both; }
        .ab-gk.tayyor { border-color: ${T.accent}; box-shadow: 0 12px 26px -16px ${fon(T.accent, 0.6)}; }
        .ab-gk-y { align-self: flex-start; padding: 2px 10px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; animation: ab-pop 0.45s ease-out both; }
        .ab-gk.tayyor .ab-gk-y { background: ${T.accent}; color: #fff; }
        .ab-gk-q { display: grid; grid-template-columns: 92px minmax(0,1fr); align-items: start; gap: 10px; padding: 8px 10px; border-radius: 11px; border: 1.5px dashed ${T.line}; min-height: 40px; transition: background 0.3s, border-color 0.3s; }
        .ab-gk-q.yozildi { border-style: solid; border-color: transparent; background: ${T.bg}; }
        .ab-gk-q.joriy { border-style: solid; border-color: ${T.accent}; background: ${T.paper}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; animation: ab-puls 1.9s ease-out 0.8s infinite; }
        .ab-gk-q.xato { border-style: solid; border-color: ${T.err}; background: ${T.errFon}; }
        .ab-gk-l { padding-top: 3px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ab-gk-q.joriy .ab-gk-l { color: ${T.accent}; }
        .ab-gk-m { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .ab-gk-t { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; font-size: 14px; font-weight: 700; line-height: 1.4; color: ${T.ink}; animation: ab-sur 0.5s ease-out both; border-radius: 6px; }
        .ab-gk-t > i { font-style: normal; color: ${T.ok}; font-weight: 800; animation: ab-pop 0.4s ease-out 0.2s both; }
        .ab-gk-teg { padding: 1px 8px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink2}; font-size: 11px; font-weight: 700; }
        .ab-gk-javob { display: flex; flex-direction: column; gap: 6px; }
        .ab-gk-javob > .q-chip.ab-qism { width: 100%; animation: ab-kir 0.38s ease-out both; animation-delay: calc(0.12s + var(--k, 0) * 0.09s); }
        .q-chip.xira { opacity: 0.55; }
        .ab-gk-past { display: block; min-height: 18px; }
        .ab-gk > p.q-izoh { animation: fade-step 0.35s ease-out; }
        .ab-gk-xulosa { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
        .ab-s2.tugadi { align-items: stretch; }
        .ab-ach { font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .ab-ach.lost { opacity: 0.7; }
        .ab-ipucha { display: block; font-size: 12.5px; font-weight: 700; color: ${T.accent}; }
        .ab-gap { display: block; font-size: clamp(14.5px,1.7vw,16.5px); line-height: 1.65; color: ${T.ink}; }
        .ab-gap b { font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 6px; padding: 1px 6px; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
        .ab-s2.tugadi .ab-gk .ab-gap { animation: ab-kir 0.5s ease-out both; }
        /* 3-ekran: savol ustida telefonning yuqori qismi — kun strelkalari */
        .ab-savol-ust { display: flex; align-items: center; gap: clamp(14px,2.4vw,24px); }
        .ab-savol-ust > h2 { flex: 1; min-width: 0; }
        .ab-kesim { position: relative; flex: none; display: block; width: 172px; }
        .ab-kesim-tel { display: flex; flex-direction: column; gap: 5px; height: 118px; padding: 8px 8px 0; border: 2px solid ${T.ink}; border-bottom: 0; border-radius: 22px 22px 0 0; background: ${T.paper}; overflow: hidden; -webkit-mask-image: linear-gradient(#000 70%, transparent); mask-image: linear-gradient(#000 70%, transparent); }
        .ab-kesim-teg { position: absolute; right: -8px; top: 34px; }
        /* 4-ekran: booking.com sahnasi — tanish brauzer oynasi, logotipsiz; nom o'z rangida */
        .ab-bk { font-weight: 800; color: ${BK_RANG}; white-space: nowrap; }
        .ab-nuq { display: flex; align-items: center; justify-content: center; gap: 6px; }
        .ab-nuq-l { margin-right: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ab-nuq i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; transition: background 0.3s; }
        .ab-nuq i.ok { background: ${T.ok}; }
        .ab-nuq i.cur { background: ${T.accent}; transform: scale(1.25); }
        span.ab-m-q { display: block; margin-top: 6px; }
        .ab-voqea { display: flex; flex-direction: column; gap: 10px; width: 100%; min-width: 0; animation: fade-step 0.3s ease-out; }
        .ab-voqea-h { align-self: center; font-size: clamp(16px,1.9vw,19px); font-weight: 800; color: ${T.ink}; }
        .ab-bks { position: relative; display: flex; align-items: flex-end; justify-content: center; gap: clamp(18px,4vw,48px); min-height: 236px; padding: 6px 4px 4px; }
        .ab-bks.b-ikki { align-items: flex-end; }
        .ab-bks.b0 { align-items: center; gap: 18px; }
        .ab-bks-oqim { display: grid; grid-template-columns: repeat(4, 16px); gap: 12px 10px; }
        i.ab-bks-str { display: block; width: 64px; height: 0; border-top: 2px dashed ${T.ink2}; position: relative; }
        i.ab-bks-str::after { content: ''; position: absolute; right: -2px; top: -7px; border: 6px solid transparent; border-left: 9px solid ${T.ink2}; border-right-width: 0; }
        .ab-bks.b0 .ab-bko-oyna { width: 360px; }
        .ab-bks-g { display: flex; flex-direction: column; align-items: center; gap: 8px; animation: ab-kir 0.45s ease-out both; }
        .ab-bks-g + .ab-bks-g { animation-delay: 0.12s; }
        .ab-bks-odamlar { display: flex; gap: 8px; }
        .ab-odam { position: relative; display: block; width: 16px; height: 22px; font-style: normal; animation: ab-odam 0.5s ease-out both; animation-delay: calc(var(--i, 0) * 0.09s); }
        .ab-odam::before { content: ''; position: absolute; left: 4px; top: 0; width: 8px; height: 8px; border-radius: 50%; background: ${T.ink2}; }
        .ab-odam::after { content: ''; position: absolute; left: 1px; top: 10px; width: 14px; height: 11px; border-radius: 7px 7px 3px 3px; background: ${T.ink2}; }
        .ab-odam.b::before, .ab-odam.b::after { background: ${T.accent}; }
        .ab-odam.b { filter: drop-shadow(0 0 0 transparent); }
        .ab-bks.b0 .ab-odam.b::after { box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}; animation: ab-halqa 0.5s ease-out both; animation-delay: calc(0.9s + var(--i, 0) * 0.12s); }
        @keyframes ab-odam { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
        @keyframes ab-halqa { from { box-shadow: 0 0 0 0 ${T.paper}, 0 0 0 0 ${T.accent}; } }
        .ab-bko { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .ab-bko-y { padding: 2px 11px; border-radius: 999px; background: ${T.paper}; border: 1.5px solid ${T.ink2}; color: ${T.ink2}; font-size: 12px; font-weight: 800; animation: ab-pop 0.4s ease-out both; }
        .ab-bko-y.b { border-color: ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; }
        .ab-bko-oyna { position: relative; display: flex; flex-direction: column; width: 270px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; overflow: hidden; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.55); }
        .ab-bko.b .ab-bko-oyna { border-color: ${T.accent}; }
        .ab-bko-bar { display: flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ab-bko-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .ab-bko-bar em { margin-left: 6px; flex: 1; padding: 1px 8px; border-radius: 6px; background: ${T.paper}; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ab-bko-bosh { display: flex; gap: 6px; height: 26px; align-items: center; padding: 0 10px; background: ${BK_RANG}; }
        .ab-bko-bosh i { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.75); }
        .ab-bko-bosh i:first-child { width: 54px; } .ab-bko-bosh i:last-child { width: 30px; margin-left: auto; opacity: 0.6; }
        .ab-bko-qidir { display: flex; gap: 4px; margin: 8px 10px 0; padding: 3px; border-radius: 6px; background: #FFB700; }
        .ab-bko-qidir i { flex: 1; height: 14px; border-radius: 3px; background: ${T.paper}; }
        .ab-bko-qidir b { width: 40px; height: 14px; border-radius: 3px; background: #006CE4; }
        .ab-bko-ro { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px 10px; }
        .ab-bko-m { display: grid; grid-template-columns: 38px minmax(0,1fr) auto; align-items: end; gap: 8px; }
        .ab-bko-m > i { height: 30px; border-radius: 5px; background: linear-gradient(135deg, #D7E3F2, #B8CBE4); }
        .ab-bko-m > span { display: flex; flex-direction: column; gap: 4px; }
        .ab-bko-m em { display: block; height: 5px; border-radius: 3px; background: ${T.line}; }
        .ab-bko-m em + em { width: 60%; }
        .ab-bko-m > b { width: 44px; height: 14px; border-radius: 4px; background: #006CE4; }
        .ab-bko.b .ab-bko-m > b { background: ${T.accent}; box-shadow: 0 0 0 2px ${T.accentSoft}; animation: ab-pop 0.5s ease-out 0.3s both; }
        .ab-bko.yopiq .ab-bko-ro, .ab-bko.yopiq .ab-bko-qidir, .ab-bko.yopiq .ab-bko-bosh { filter: blur(3px); opacity: 0.6; }
        .ab-bko-soroq { position: absolute; left: 50%; top: 58%; transform: translate(-50%, -50%); width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: ${T.ink}; color: #fff; font-size: 20px; font-weight: 800; }
        .ab-bko-son { display: grid; place-items: center; min-width: 64px; height: 30px; padding: 0 12px; border-radius: 9px; border: 1.5px dashed ${T.ink2}; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; animation: ab-pop 0.45s ease-out 0.3s both; }
        .ab-bks.b4 { align-items: center; gap: clamp(18px,3vw,36px); }
        .ab-tor-tel { display: flex; gap: 14px; }
        .ab-tor-tel:empty { display: none; }
        .ab-tor { display: flex; flex-direction: column; align-items: center; gap: 12px; transition: transform 0.5s; }
        .ab-tor-son { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .ab-tor-son b { font-family: 'JetBrains Mono', monospace; font-size: clamp(30px,4vw,42px); font-weight: 800; line-height: 1; color: ${T.accent}; }
        .ab-tor-son small { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ab-tor-g { display: grid; grid-template-columns: repeat(6, 40px); gap: 8px; }
        .ab-tor-j { display: flex; gap: 3px; padding: 4px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; animation: ab-pop 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 0.04s); }
        .ab-tor-j i { flex: 1; height: 16px; border-radius: 3px; background: ${T.line}; }
        .ab-tor-j i + i { background: ${fon(T.accent, 0.35)}; }
        .ab-tor-j.tanla { border-color: ${T.accent}; }
        .ab-bks.f1 .ab-tor-j.tanla { transform: scale(1.6); box-shadow: 0 8px 18px -8px ${fon(T.accent, 0.7)}; transition: transform 0.45s cubic-bezier(.2,.9,.3,1.3); }
        .ab-bks.f2 .ab-tor-j { opacity: 0.55; }
        .ab-bks.f2 .ab-tor-j.tanla { opacity: 1; background: ${T.accentSoft}; }
        .ab-voqea > .q-xulosa { display: flex; flex-direction: column; gap: 3px; }
        span.ab-nb-t { display: block; }
        span.ab-nb-t > .q-taxmin { display: block; }
        /* Bashorat: karta yengil ko'tarilib kiradi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi */
        .ab-bash .q-bashorat { border-color: ${T.accent}; animation: ab-kir 0.5s cubic-bezier(.2,.9,.3,1.1) both, ab-puls 1.9s ease-out 0.8s infinite; }
        .ab-bash .q-chip { animation: ab-kir 0.38s ease-out both; }
        .ab-bash .q-chip:nth-child(1) { animation-delay: 0.2s; } .ab-bash .q-chip:nth-child(2) { animation-delay: 0.3s; } .ab-bash .q-chip:nth-child(3) { animation-delay: 0.4s; }
        .ab-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 8px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; transform-origin: top center; animation: ab-yig 0.42s cubic-bezier(.2,.9,.3,1.1) both; }
        @keyframes ab-yig { from { opacity: 0.2; transform: scaleY(1.9); } to { opacity: 1; transform: none; } }
        .ab-taxmin-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .ab-taxmin-s { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .ab-taxmin-j { font-size: 14px; color: ${T.ink}; }
        .ab-taxmin.ab-taxmin-n { align-self: center; align-items: center; }
        .ab-taxmin-n > .q-taxmin { font-size: 13.5px; }
        /* 5-ekran: chapda maket (telefonlar doim chapda — SABOQ 21), o'ngda usullar */
        @media (min-width: 861px) { .q-tushuncha > .q-split:has(.ab-s5) { grid-template-columns: minmax(0,0.82fr) minmax(0,1.18fr); column-gap: clamp(24px,4.6vw,58px); align-items: start; } }
        .q-tushuncha > .q-split:has(.ab-s5) > .q-col:last-child { order: -1; }
        .ab-usullar { display: flex; flex-direction: column; gap: 8px; }
        .ab-usullar > .ab-taxmin { margin-bottom: 2px; }
        /* 5-ekran yakuni: o'ng ustunda uch usul ixcham (bitta qatordan) + bitta natija bloki (taxmin · izoh · xulosa) — SABOQ 20, 25 */
        .ab-usul.ixcham { align-items: center; padding: 8px 12px; font-size: 13.5px; animation: ab-yig 0.4s cubic-bezier(.2,.9,.3,1.1) both; }
        .ab-usul.ixcham .ab-usul-n { width: 22px; height: 22px; font-size: 11px; }
        .ab-usul.ixcham .ab-usul-t { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ab-usullar.yakun { gap: 6px; }
        .ab-usullar > .q-xulosa { display: flex; flex-direction: column; gap: 5px; margin-top: 6px; animation: ab-kir 0.45s ease-out 0.15s both; }
        .ab-s5-iz { display: block; font-size: 13px; font-weight: 600; line-height: 1.45; color: ${T.ink2}; }
        .ab-usul { display: flex; align-items: flex-start; gap: 11px; width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: clamp(13.5px,1.55vw,14.5px); font-weight: 600; line-height: 1.4; color: ${T.ink}; text-align: left; cursor: pointer; transition: border-color 0.2s, background 0.2s; animation: ab-kir 0.4s ease-out both; animation-delay: calc(0.1s + var(--k, 0) * 0.09s); }
        .ab-usul:hover:not(:disabled) { border-color: ${T.accent}; }
        .ab-usul:disabled { cursor: default; }
        .ab-usul.kut { color: ${T.ink2}; border-style: dashed; box-shadow: none; }
        .ab-usul.kut .ab-usul-n { opacity: 0.6; }
        .ab-usul.yur { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ab-usul.ok { border-color: ${fon(T.ok, 0.5)}; background: ${T.okFon}; }
        .ab-usul.err { border-color: ${fon(T.err, 0.45)}; background: ${T.errFon}; }
        .ab-usul-n { flex: none; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        .ab-usul.yur .ab-usul-n { background: ${T.accent}; color: #fff; }
        .ab-usul.ok .ab-usul-n { background: ${T.ok}; color: #fff; }
        .ab-usul.err .ab-usul-n { background: ${T.err}; color: #fff; }
        .ab-usul-t { min-width: 0; }
        /* Amaliyot bloklari: «Yordam», gipoteza formasi (bir vaqtda bitta bo'lak — SABOQ 29), strip */
        .ab-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .ab-yordam-s { display: block; padding: 7px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .q-blok-xato .q-btn.ab-yordam-btn { padding: 5px 12px; font-size: 12.5px; }
        p.q-blok-xato:has(> .ab-kul) { color: ${T.ink2}; font-weight: 600; }
        .ab-kul { color: ${T.ink2}; font-size: 12.5px; font-weight: 600; }
        .ab-strip { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; align-self: flex-start; max-width: 100%; padding: 6px 14px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ab-strip-l { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        .ab-strip-t { font-size: 12.5px; font-weight: 600; color: ${T.ink}; min-width: 0; }
        .ab-strip-r { font-size: 12.5px; color: ${T.ink2}; }
        .ab-strip-r b { color: ${T.ink}; }
        .ab-gf { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .ab-gf-kirish { display: block; padding: 7px 10px; border-radius: 9px; background: ${T.bg}; color: ${T.ink2}; font-size: 12.5px; line-height: 1.45; }
        .ab-gf-kirish b { color: ${T.ink}; }
        .ab-gf-chiziq { display: flex; align-items: center; gap: 6px; }
        .ab-gf-chiziq-l { margin-right: 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        button.ab-gf-n { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border-radius: 50%; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; cursor: pointer; }
        button.ab-gf-n:disabled { cursor: default; }
        .ab-gf-n.joriy { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .ab-gf-n.tola { border-color: ${T.ok}; background: ${T.ok}; color: #fff; animation: ab-pop 0.4s ease-out both; }
        .ab-gf-son { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; }
        .ab-gf-karta { display: flex; flex-direction: column; gap: 7px; padding: 12px 13px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.1)}; animation: ab-kir 0.35s ease-out both; }
        .ab-gf-l { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.accent}; }
        textarea.ab-kirit { display: block; width: 100%; min-height: 38px; resize: none; overflow: hidden; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 8px 10px; }
        textarea.ab-kirit:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .ab-gf-maslahat { font-size: 12px; color: ${T.ink2}; }
        .ab-gf-xato { font-size: 13px; font-weight: 600; color: ${T.err}; animation: fade-step 0.25s ease-out; }
        .ab-gf-karta > .q-btn.ab-gf-btn { padding: 7px 14px; font-size: 13px; }
        .ab-gf-gap { display: flex; flex-direction: column; gap: 8px; padding: 12px 13px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.accent}; animation: ab-kir 0.4s ease-out both; }
        .ab-gf-gap .ab-gap { font-size: 14px; line-height: 1.6; }
        .ab-gf-ok { align-self: flex-end; font-size: 13px; font-weight: 800; color: ${T.ok}; animation: ab-pop 0.4s ease-out both; }
        .ab-gf-gap > .q-btn.ab-gf-saqla { padding: 8px 18px; }
        .q-blok-q.joriy:has(.ab-gf[data-tayyor="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .ab-a2f .ab-gf-karta { gap: 6px; }
        /* Kutilgan natija maketlari */
        .ab-a1n, .ab-a2n { display: flex; flex-direction: column; gap: 10px; }
        .ab-neon { display: flex; flex-direction: column; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; overflow: hidden; animation: ab-kir 0.45s ease-out 0.25s both; }
        .ab-neon-h { display: flex; align-items: center; gap: 4px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ab-neon-h i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; }
        .ab-neon-h b { margin-left: 6px; font-size: 12px; font-weight: 800; color: ${T.ink2}; }
        table.ab-neon-t { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .ab-neon-t th { text-align: left; padding: 4px 10px; font-weight: 700; color: ${T.ink2}; border-bottom: 1px solid ${T.line}; }
        .ab-neon-t td { padding: 3px 10px; color: ${T.ink}; border-bottom: 1px solid ${T.bg}; }
        .ab-neon-t tbody tr { animation: ab-kir 0.35s ease-out both; animation-delay: calc(0.5s + var(--i, 0) * 0.1s); }
        .ab-v { display: inline-grid; place-items: center; width: 22px; height: 20px; border-radius: 6px; background: ${T.bg}; border: 1.5px solid ${T.ink2}; color: ${T.ink2}; font-weight: 800; }
        .ab-v.b { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        p.ab-izoh-k { margin: 0; font-size: 12px; color: ${T.ink2}; }
        .ab-a1n > .ab-juft { gap: 12px; }
        .ab-ortda-iz { display: block; margin-top: 2px; font-family: 'Manrope', sans-serif; font-size: 12px; color: ${T.ink2}; white-space: normal; }
        .ab-dash { display: flex; flex-direction: column; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; overflow: hidden; box-shadow: 0 14px 30px -20px rgba(${T.shadowBase},0.5); animation: ab-kir 0.45s ease-out both; }
        .ab-dash-bar { display: flex; align-items: center; gap: 5px; min-height: 32px; padding: 4px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ab-dash-bar i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; }
        .ab-dash-manzil { flex: 1; min-width: 0; margin-left: 6px; padding: 2px 10px; border-radius: 8px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ab-dash-s { display: flex; flex-direction: column; gap: 8px; padding: 9px 12px 11px; }
        .ab-dash-bosh { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .ab-dash-kul { display: flex; align-items: stretch; gap: 6px; opacity: 0.6; }
        .ab-dash-hozir { flex: none; display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 10px; background: ${T.bg}; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ab-dash-hozir i { width: 7px; height: 7px; border-radius: 50%; background: ${T.ink2}; }
        .ab-dash-uch { flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .ab-dash-uch span { display: flex; align-items: center; padding: 6px 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-radius: 8px; border: 1px solid ${T.line}; font-size: 11.5px; font-weight: 600; color: ${T.ink2}; }
        .ab-dash-iz { font-size: 11.5px; line-height: 1.4; color: ${T.ink2}; }
        .ab-ab { display: flex; flex-direction: column; gap: 4px; padding: 9px 12px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.08)}; animation: ab-kir 0.45s ease-out 0.2s both; }
        .ab-ab-n { font-size: 11.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .ab-abq { display: grid; grid-template-columns: minmax(0,1.9fr) 0.85fr 0.7fr minmax(0,0.85fr); align-items: center; gap: 8px; padding: 5px 4px; border-top: 1px solid ${T.bg}; }
        .ab-abq.ab-abq-bosh { border-top: 0; padding-top: 0; padding-bottom: 0; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ab-abq-v { display: flex; align-items: center; gap: 7px; min-width: 0; font-size: 12.5px; font-weight: 700; color: ${T.ink}; white-space: nowrap; }
        .ab-abq-v b { flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid ${T.ink2}; color: ${T.ink2}; font-size: 12px; }
        .ab-abq.b .ab-abq-v b { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; }
        .ab-abq-s { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${T.ink}; text-align: center; }
        .ab-abq-bosh .ab-abq-s, .ab-abq-bosh .ab-abq-f { font-family: 'Manrope', sans-serif; font-size: 11px; color: ${T.ink2}; text-align: center; white-space: nowrap; }
        .ab-abq-f { position: relative; display: flex; flex-direction: column; gap: 3px; }
        .ab-abq-f b { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink2}; }
        .ab-abq.b .ab-abq-f b { color: ${T.accent}; }
        .ab-abq-f i { display: block; height: 6px; border-radius: 3px; background: ${T.ink2}; transition: width 0.8s cubic-bezier(.2,.9,.3,1); }
        .ab-abq.b .ab-abq-f i { background: ${T.accent}; }
        .ab-a2n > .q-izoh { font-size: 12px; line-height: 1.4; }
        .ab-a2n { gap: 6px; }
        /* 8-ekran: savol ustida dashboard'ning A/B qismi */
        .ab-s8-ust { display: flex; flex-direction: column; gap: 12px; }
        .ab-s8-ust > .ab-ab { max-width: 560px; }
        /* Kartochkalar: birinchi bosishgacha karta yuzi halqada (SABOQ 16) */
        .ab-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ab-fc-halqa 1.6s ease-out 3; }
        @keyframes ab-fc-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 100% { box-shadow: 0 0 0 14px ${fon(T.accent, 0)}; } }
        p.ab-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .ab-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ab-nuqta 1.4s ease-in-out 3; }
        @keyframes ab-nuqta { 50% { transform: scale(1.6); opacity: 0.4; } }
        /* Yakun: bugungi asosiy fikr, uyga vazifa (PM HwCard) */
        .ab-fikr { display: flex; flex-direction: column; gap: 3px; align-items: center; text-align: center; background: ${T.paper}; border-radius: 16px; padding: 10px 20px 14px; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .ab-fikr-l { font-weight: 800; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.ab-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .q-yakun .ab-strip { align-self: center; }
        .ab-hw { display: flex; flex-direction: column; gap: 12px; }
        .ab-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ab-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .ab-hw-k { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ab-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        ol.ab-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.ab-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.ab-hw-qadam li i { font-style: normal; flex-shrink: 0; font-size: 16px; line-height: 1.35; color: ${T.accent}; }
        p.ab-hw-izoh { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .ab-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        /* Jonli dars: ovozlar chizig'i, mentor eslatmasi */
        .ab-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ab-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 120px 28px; align-items: center; gap: 8px; font-size: 13px; color: ${T.ink2}; }
        .ab-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .ab-ovoz-yol { height: 8px; border-radius: 4px; background: ${T.bg}; overflow: hidden; }
        .ab-ovoz-yol i { display: block; height: 100%; background: ${T.accent}; transition: width 0.5s; }
        .ab-ovoz-t { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ab-ovoz-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: right; }
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        /* Telefon eni (393): ikki telefon ustma-ust, oqim va kalendar soddalashadi */
        @media (max-width: 640px) {
          .ab-juft { gap: 10px; }
          .ab-bks.b0 { flex-direction: column; }
          i.ab-bks-str { width: 0; height: 28px; border-top: 0; border-left: 2px dashed ${T.ink2}; }
          i.ab-bks-str::after { display: none; }
          .ab-bks.b0 .ab-bko-oyna { width: min(300px, 100%); }
          .ab-s2 { grid-template-columns: minmax(0,1fr); }
          .ab-s2-tel { justify-content: flex-start; }
          .ab-gk-q { grid-template-columns: minmax(0,1fr); gap: 4px; }
          .ab-savol-ust { flex-direction: column; align-items: flex-start; }
          .ab-bks { flex-direction: column; align-items: center; min-height: 0; }
          .ab-bko-oyna { width: min(270px, 100%); }
          .ab-tor-g { grid-template-columns: repeat(6, 30px); gap: 6px; }
          .ab-tor-tel { flex-direction: column; }
          .ab-hw-karta { grid-template-columns: minmax(0,1fr); }
          .ab-abq { grid-template-columns: minmax(0,1.4fr) 0.6fr 0.6fr minmax(0,0.9fr); gap: 5px; }
          .ab-abq-v { font-size: 11.5px; }
          .ab-dash-kul { flex-wrap: wrap; }
          .ab-dash-uch { flex-basis: 100%; }
        }
        /* Juda tor ekran (<380): ikki telefon yonma-yon sig'maydi — ustma-ust, oqim va kalendar yashirin */
        @media (max-width: 379px) {
          .ab-juft { grid-template-columns: minmax(0,1fr); gap: 18px; }
          .ab-oqim { display: none; }
          .ab-katta-soroq { top: 50%; transform: translate(-50%, -50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ab-navbat, .ab-s0.kut .ab-telefon, .ab-tel-ust, .ab-tel-tugma, .ab-tel-tugma.chaq, .ab-pufak, .ab-yangi, .ab-q-str, .ab-q-foiz.on, .ab-q-foiz.yuq, .ab-q-soroq, .ab-q-kal, .ab-q-u.yon .ab-q-bar i,
          .ab-br, .ab-br.ok i, .ab-kal-k, .ab-elon, .ab-joy.tola, .ab-katta-soroq, .ab-gk, .ab-gk-y, .ab-gk-t, .ab-gk-t > i, .ab-gk-javob > .q-chip.ab-qism, .ab-gap, .ab-s2.tugadi .ab-gk .ab-gap,
          .ab-kun.katta i, .ab-gk-q.joriy, .ab-bks-g, .ab-odam, .ab-bks.b0 .ab-odam.b::after, .ab-bko-y, .ab-bko.b .ab-bko-m > b, .ab-bko-son, .ab-tor-j, .ab-bash .q-bashorat, .ab-bash .q-chip, .ab-taxmin, .ab-usul, .ab-usul.ixcham, .ab-usullar > .q-xulosa,
          .ab-gf-karta, .ab-gf-gap, .ab-gf-ok, .ab-gf-n.tola, .ab-neon, .ab-neon-t tbody tr, .ab-dash, .ab-ab, .ab-flash.yangi .fc-card:not(.flip) .fc-front, .ab-fc-ipucha i, .ab-voqea, .ab-forma { animation: none !important; }
          .ab-br, .ab-telefon, .ab-abq-f i, .ab-tor, .ab-bks.f1 .ab-tor-j.tanla { transition: none !important; }
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
        /* Telefonda (≤640) o'ngda joy yo'q — ⛶ mazmun ustida alohida qatorda turadi, matn va kartani yopmaydi (10-Modul pilot, F-1005-171) */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
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
