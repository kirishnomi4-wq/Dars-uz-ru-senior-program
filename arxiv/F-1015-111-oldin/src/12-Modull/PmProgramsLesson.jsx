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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKartochka, QYakun, QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d11-v1', lessonTitle: { uz: "Qaysi xalqaro dasturga ariza berasiz?", ru: 'В какую международную программу подадите заявку?' } }; // 14-Modul 11-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/11-PmPrograms-v3.md
// 12 ekran (MD v3, «PM 12» shakli): kirish → reja → shartlar → test → Y Combinator → test → konsept → ariza qoralamasi → yakuniy test → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: 'ariza', ru: 'заявка' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'shart', ru: 'условие' }, l: 70, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'konsept', ru: 'концепт' }, l: 24, tp: 70, s: 12, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',           type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',           type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'shartlar',     type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',           type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'solishtirish', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',           type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'konsept',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'practice',     type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',           type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',       type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',       type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's11',          type: 'summary',     template: 'custom',   scored: false, scope: null }
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
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' xd-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). To'g'ri javob o'rinlari (MD): s3 B · s5 D · s8 A.
// MD KOD 12 dagi ballsiz ekran sentinel'lari (shartlar, solishtirish, konsept) — jsx-lint «o'lik kalit» (submitAnswer ga uzatilmaydi), shuning uchun yo'q (01 pilot naqshi); practice — 7-ekran signali.
const INLINE_KEYS = { s3: 1, s5: 3, s8: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM: emoji o'rniga raqam — S-026)
const RECAPS = {
  3: {
    title: { uz: 'Jamoa sharti', ru: 'Условие о команде' },
    cards: [
      { ic: '1', h: { uz: "Diamond Challenge'da jamoa — 2–4 maktab o'quvchisi.", ru: 'В Diamond Challenge команда — 2–4 школьника.' } },
      { ic: '2', h: { uz: "Topshirish kuni har a'zo 14–18 yoshda bo'ladi.", ru: 'В день подачи каждому участнику 14–18 лет.' } },
      { ic: '3', h: { uz: "Yordam beradigan 21 yoshdan katta odam — jamoa a'zosi emas, maslahatchi.", ru: 'Помогающий взрослый старше 21 года — не член команды, а консультант.' }, ask: { uz: 'Mahsulotni yolg\'iz qurgan bo\'lsangiz, jamoaga kimni chaqirasiz?', ru: 'Если вы сделали продукт в одиночку, кого позовёте в команду?' } }
    ]
  },
  5: {
    title: { uz: 'Yosh yozilmagan sahifa', ru: 'Страница без возраста' },
    cards: [
      { ic: '1', h: { uz: 'Sahifada yosh yozilmagani ruxsat ham, taqiq ham emas.', ru: 'То, что возраст не указан, — ни разрешение, ни запрет.' } },
      { ic: '2', h: { uz: "Qolgan shartlar ham o'qiladi: vaqt va joy.", ru: 'Читают и остальные условия: время и место.' } },
      { ic: '3', h: { uz: "Y Combinator to'liq vaqt va San-Fransiskoda yuzma-yuz ishlashni kutadi.", ru: 'Y Combinator ждёт работы полный день и очно в Сан-Франциско.' }, ask: { uz: 'Rasmiy sahifada yana qaysi shartlarni qidirasiz?', ru: 'Какие ещё условия вы будете искать на официальной странице?' } }
    ]
  },
  8: {
    title: { uz: 'Ariza qanday topshiriladi', ru: 'Как подают заявку' },
    cards: [
      { ic: '1', h: { uz: 'Ariza maslahatchi bilan topshiriladi.', ru: 'Заявку подают вместе с консультантом.' } },
      { ic: '2', h: { uz: "Ariza saytiga shaxsiy ma'lumot — ota-ona xabardorligida.", ru: 'Личные данные на сайт заявки — с ведома родителей.' } },
      { ic: '3', h: { uz: "Diamond Challenge'ga ariza ingliz tilida; undagi har son rost bo'ladi.", ru: 'Заявка в Diamond Challenge — на английском; каждое число в ней честное.' }, ask: { uz: 'Arizangizni kim bilan topshirasiz?', ru: 'С кем вы подадите свою заявку?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="xd-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — ArizaSahna: Brauzer (rasmiy sahifa) · Varaq (shartlar | solishtirish | ariza) · PitchTasma =====
// Bitta manba: DASTUR_SHART · JAMOA_PITCH · MENTOR_KONSEPT · MENTOR_ARIZA · GAP_KARTA + o'quvchi ma'lumoti (pm-m12d1-pitch, pm-m12d11-dastur).
// Dars ichida yozildi (K-020, JR-14 — pilotdan kod ko'chirilmadi). Rangli yon chiziq yo'q; odam figurasi yo'q; reduced-motion — CSS va kamHarakat() da.
// qolip-maket: xd-gap-b xd-var xd-tab xd-tahrir
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = ' ';
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const DC_RANG = '#003C71'; // Diamond Challenge — rasmiy sayt rangi (diamondchallenge.org, 08.10.2026 tekshirildi), logotipsiz
const YC_RANG = '#FF6600'; // Y Combinator — rasmiy sayt rangi (ycombinator.com/faq, 08.10.2026 tekshirildi), logotipsiz
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const Brend = ({ nom, rang }) => <span className="xd-brend" style={{ color: rang }}>{nom}</span>;
const MJ = () => <span className="xd-mj">Maydon Jamoa</span>;
const DC = () => <Brend nom="Diamond Challenge" rang={DC_RANG} />;
const YC = () => <Brend nom="Y Combinator" rang={YC_RANG} />;
// Matndagi dastur va mahsulot nomlari — o'z rangida (S-018)
const NOM_RE = /(Diamond Challenge|Y Combinator|Maydon Jamoa)/;
const nomAjrat = (s) => (typeof s !== 'string' ? s : s.split(NOM_RE).map((p, i) => (p === 'Diamond Challenge' ? <DC key={i} /> : p === 'Y Combinator' ? <YC key={i} /> : p === 'Maydon Jamoa' ? <MJ key={i} /> : p)));

// --- Saqlanadigan natija (tayanch 8): o'qiydi pm-m12d1-pitch · yozadi pm-m12d11-dastur ---
const PITCH_KEY = 'pm-m12d1-pitch';
const DASTUR_KEY = 'pm-m12d11-dastur';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };

// --- Rasmiy faktlar — BITTA manba (180-qonun; tayanch 1.11, 6; MD A-6). asl — inglizcha iqtibos, faqat kod izohida (o'quvchiga chiqmaydi) ---
const DASTUR_SHART = {
  diamond: {
    nom: 'Diamond Challenge', url: 'diamondchallenge.org/competition',
    izoh: { uz: "maktab o'quvchilari g'oyasi uchun xalqaro tanlov", ru: 'международный конкурс идей школьников' },
    // Sanalar — BITTA joyda (11-FILTR 22; tayanch 9.82): 2-ekran qatorlari, 7-ekran 1-karta, kartochka 7 shundan. Yangi tanlovda faqat shu qator o'zgaradi.
    // 08.10.2026 rasmiy sahifa qayta ochildi: «January 14» (5PM EST), «March 9» — mos.
    sanalar: { yil: 2027, muddat: { uz: '14-yanvar, 2027', ru: '14 января 2027' }, finalistlar: { uz: '9-mart, 2027', ru: '9 марта 2027' } },
    qatorlar: [
      { id: 'jamoa', uz: "Jamoa — 2–4 maktab o'quvchisi, topshirish kuni 14–18 yosh", ru: 'Команда — 2–4 школьника, в день подачи им 14–18 лет' }, // asl: «Teams must consist of 2-4 high school students aged 14-18 at the submission deadline.»
      { id: 'maslahatchi', uz: 'Jamoaga yordam beradigan, 21 yoshdan katta bitta odam', ru: 'Один взрослый старше 21 года, который помогает команде' }, // asl: «Each team is required to have one adult advisor aged 21 or older.»
      { id: 'til', uz: 'Hamma narsa ingliz tilida topshiriladi', ru: 'Всё подаётся на английском языке' }, // asl: «All submissions are to be written in English.»
      { id: 'mamlakat', uz: 'Istalgan mamlakatdan qatnashish mumkin, onlayn ham', ru: 'Участвовать можно из любой страны, в том числе онлайн' }, // asl: «Any Idea, Any Team, Any Country» · «…participants have the option to compete virtually…»
      { id: 'muddat', uz: 'Topshirish muddati', ru: 'Срок подачи', sana: 'muddat' }, // asl: «January 14» «5PM EST»
      { id: 'finalistlar', uz: "Finalistlar e'lon qilinadi", ru: 'Объявление финалистов', sana: 'finalistlar' } // asl: finalistlar — 9-mart (tayanch 1.11)
    ],
    bosqich1: { uz: "Ingliz tilida 3–5 betlik yozma g'oya va 60 soniyalik tanishtiruv videosi", ru: 'Письменная идея на 3–5 страниц на английском и 60-секундное видео-знакомство' }, // asl: «Written concept narratives and introductory videos…» · «The narrative is limited to 3-5 pages…»
    yonalish: { uz: "Ikki yo'nalish: Business Innovation va Social Innovation", ru: 'Два направления: Business Innovation и Social Innovation' }, // tayanch 1.11 — o'quvchi tanlamaydi (11-FILTR 25)
    sol: [
      { uz: "14–18 yoshli 2–4 o'quvchi", ru: '2–4 школьника 14–18 лет' },
      { uz: "ingliz tilida 3–5 betlik yozma g'oya va 60 soniyalik video", ru: 'письменная идея на 3–5 страниц на английском и 60-секундное видео' },
      { uz: 'istalgan mamlakatdan, onlayn ham', ru: 'из любой страны, в том числе онлайн' }
    ]
  },
  yc: {
    nom: 'Y Combinator', url: 'ycombinator.com/faq',
    izoh: { uz: 'Amerikadagi, yangi kompaniya asoschilari uchun dastur', ru: 'американская программа для основателей новых компаний' },
    qatorlar: [
      { id: 'kim', uz: "Sahifa: o'qiyotgan yoki ishlayotgan odam ham ariza berishi mumkin", ru: 'На странице: подать заявку может и тот, кто учится или работает' }, // asl: «You can certainly apply when you are a full-time student or employee…»
      { id: 'vaqt', uz: "Asoschilar dastur davomida va keyin o'z kompaniyasida to'liq vaqt ishlaydi", ru: 'Основатели во время программы и после неё работают в своей компании полный день' }, // asl: «…we expect the founders to commit to working full-time on their company during the batch and afterwards if accepted.»
      { id: 'joy', uz: "Dastur San-Fransiskoda, yuzma-yuz o'tadi", ru: 'Программа проходит в Сан-Франциско, очно' } // asl: «The batch takes place in-person in San Francisco.»
    ],
    early: { uz: "O'qishini tugatib, keyin kompaniya ochmoqchi talabalar uchun yo'l", ru: 'Путь для студентов, которые хотят сначала окончить учёбу, а потом открыть компанию' }, // asl: «This program is designed for students who want to finish their degree before starting a company.»
    sol: [
      { uz: "yosh yozilmagan; sahifa: o'qiyotgan odam ham ariza berishi mumkin", ru: 'возраст не указан; на странице: подать может и тот, кто учится' },
      { uz: "dastur davomida va keyin — to'liq vaqt o'z kompaniyasida", ru: 'во время программы и после — полный день в своей компании' },
      { uz: 'San-Fransiskoda, yuzma-yuz', ru: 'в Сан-Франциско, очно' }
    ]
  }
};
const sanaS = (k) => DASTUR_SHART.diamond.sanalar[k];
const qatorMatn = (q) => (q.sana ? { uz: q.uz + ' — ' + sanaS(q.sana).uz, ru: q.ru + ' — ' + sanaS(q.sana).ru } : q);
const muddatVaraq = () => ({ uz: 'Muddat — ' + sanaS('muddat').uz, ru: 'Срок — ' + sanaS('muddat').ru });

// --- Mentor misoli (tayanch 1.1 AYNAN; 1.12; MD A-7) ---
const BOLAK_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi'];
const BOLAK_NOM = {
  muammo: { uz: 'Muammo', ru: 'Проблема' }, bozor: { uz: 'Bozor', ru: 'Рынок' }, yechim: { uz: 'Yechim', ru: 'Решение' },
  raqamlar: { uz: 'Raqamlar', ru: 'Цифры' }, jamoa: { uz: 'Jamoa', ru: 'Команда' }, keyingi: { uz: 'Keyingi qadam', ru: 'Следующий шаг' }
};
const JAMOA_PITCH = {
  muammo: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'Игрокам трудно собрать людей в команду. У 4 из 5 игроков, которых я спросил, в последней игре не хватило людей или кто-то не пришёл.' },
  bozor: { uz: 'Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.', ru: 'В футбольной группе махалли — 60 человек; в приложении — 6 организаторов. Другие махалли мы ещё не проверяли.' },
  yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' },
  raqamlar: { uz: "51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.", ru: '51 пользователь; 11 из них — мои одноклассники, 7 пришли по ссылке-приглашению. 3 организатора дали письменное подтверждение на Pro — это ещё не оплата.' },
  jamoa: { uz: "Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.", ru: 'Я — идея, продукт и код (с агентом). Пробовали — 6 организаторов и игроки.' },
  keyingi: { uz: "Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.", ru: 'Проверю «Постоянную игру» в тестовом режиме с тремя организаторами. Одна просьба к вам: познакомьте с владельцами площадок в махалле.' }
};
const MENTOR_KONSEPT = {
  muammo: JAMOA_PITCH.muammo,
  kimUchun: { uz: "Mahallada mini-futbol o'ynaydigan o'yinchilar va o'yin e'lon qiladigan tashkilotchilar.", ru: 'Игроки, которые играют в мини-футбол в махалле, и организаторы, которые объявляют игры.' },
  yechim: JAMOA_PITCH.yechim
};
// Mentor misolida ariza: Diamond Challenge · Jamoa bo'lagida bitta odam · maslahatchi hali aniqlanmagan · ro'yxat hali yo'q (yosh ko'rsatilmaydi — TAYANCHGA SAVOL 5)
const MENTOR_ARIZA = { dastur: 'diamond', jamoa: 1, maslahatchi: null, royxat: false, qoralama: { muammo: ou(MENTOR_KONSEPT.muammo), kimUchun: ou(MENTOR_KONSEPT.kimUchun), yechim: ou(MENTOR_KONSEPT.yechim) } };
// 2-ekran: eshitilgan olti gap (olam matni) · javob kaliti [bor, bor, bor, bor, yo'q, yo'q] — DASTUR_SHART qatorlaridan
const GAP_KARTA = [
  { matn: { uz: "Jamoada 2–4 o'quvchi bo'ladi.", ru: 'В команде 2–4 ученика.' }, javob: 'bor', qator: 0, varaq: { uz: "Jamoa — 2–4 o'quvchi", ru: 'Команда — 2–4 ученика' } },
  { matn: { uz: "Topshirish kuni yoshingiz 14–18 bo'lishi kerak.", ru: 'В день подачи вам должно быть 14–18 лет.' }, javob: 'bor', qator: 0, varaq: { uz: 'Yosh — 14–18, topshirish kuni', ru: 'Возраст — 14–18, в день подачи' } },
  { matn: { uz: 'Jamoaga 21 yoshdan katta bitta odam yordam beradi.', ru: 'Команде помогает один человек старше 21 года.' }, javob: 'bor', qator: 1, varaq: { uz: 'Maslahatchi — 21 yoshdan katta', ru: 'Консультант — старше 21 года' } },
  { matn: { uz: 'Ariza ingliz tilida yoziladi.', ru: 'Заявка пишется на английском.' }, javob: 'bor', qator: 2, varaq: { uz: 'Til — ingliz', ru: 'Язык — английский' } },
  { matn: { uz: 'Faqat Amerika maktablari qatnasha oladi.', ru: 'Участвовать могут только американские школы.' }, javob: 'yoq', qator: 3, varaq: { uz: 'Mamlakat — istalgan, onlayn ham', ru: 'Страна — любая, онлайн тоже' } },
  { matn: { uz: 'Ariza bergan har jamoa finalga chiqadi.', ru: 'Каждая подавшая команда выходит в финал.' }, javob: 'yoq', qator: 5, varaq: null }
];

// --- Ekran maqsadlari (PM: quruvchi + SCREEN_INTENTS; ekranga chiqmaydi) ---
const SCREEN_INTENTS = [
  'kirish: ariza oldidan birinchi nima bilinadi', 'reja: shartlar va ariza qoralamasi', 'Diamond Challenge: eshitilgan gap va rasmiy sahifa',
  'test: yolg\'iz qurilgan mahsulot va jamoa sharti', 'Y Combinator: yosh yozilmagan, lekin bugungi yo\'l emas', 'test: yoshi yozilmagan sahifa',
  'pitchdan konsept: muammo, kim uchun, yechim', 'o\'z ariza qoralamasi: olti karta, pm-m12d11-dastur', 'yakuniy test: ariza qanday topshiriladi',
  'podium', 'kartochkalar', 'yakun: 5 holat'
];

// --- Yordamchilar ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const birinchiGap = (s) => { const t = String(s || '').trim(); const m = t.match(/^.+?[.!?](\s|$)/); return m ? m[0].trim() : t; };
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
// Ko'rinib uchish (SABOQ P3): manba elementidan nishon elementiga fixed nusxa ~0,6 s; reduced-motion — birdan
const useUchar = () => {
  const [u, setU] = useState(null);
  const uchir = useCallback((dan, ga, matn, tur, ms = 640) => new Promise(res => {
    if (kamHarakat() || !dan || !ga) { res(); return; }
    const a = dan.getBoundingClientRect(), t = ga.getBoundingClientRect();
    setU({ x: a.left, y: a.top, w: Math.min(a.width, 420), dx: t.left - a.left, dy: t.top + t.height / 2 - (a.top + a.height / 2), sx: Math.min(1, t.width / Math.min(a.width, 420)), matn, tur, bor: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setU(v => (v ? { ...v, bor: true } : v))));
    setTimeout(() => { setU(null); res(); }, ms);
  }), []);
  const el = u && <div className={cxx('xd-uchar', u.bor && 'bor', u.tur)} aria-hidden="true"
    style={{ left: u.x, top: u.y, width: u.w, transform: u.bor ? 'translate(' + u.dx + 'px,' + u.dy + 'px) scale(' + Math.max(0.55, u.sx * 0.92) + ')' : 'none' }}>{u.matn}</div>;
  return [uchir, el];
};
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="xd-xq-m">{matn}</span>
  {izoh && <span className="xd-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="xd-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="xd-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);
const IPUCHA = (t) => <p className="xd-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('xd-bash', taxmin && 'ix')}>{el}</div>;
const Qadamlar3 = ({ nomlar, q, faol, onBos }) => (
  <div className="xd-qadamlar">
    {nomlar.map((n, i) => (
      <QChip key={i} holat={i < q ? 'ok' : i === q && faol ? 'on' : undefined} className={cxx(i === q && faol && 'xd-joriy')} disabled={!faol || i !== q} onClick={onBos}>
        <i>{i < q ? '✓' : i + 1}</i>{tr(n)}
      </QChip>
    ))}
  </div>
);

// --- Brauzer: rasmiy sahifa maketi (manzil satri · nom o'z rangida + izoh · qatorlar). Holat: kul · yon · ok · kulyon · savol · savolYon ---
const Brauzer = ({ d, qatorlar, holat = () => 'kul', qRef, tugma, til = true }) => {
  const s = d ? DASTUR_SHART[d] : null;
  return (
    <div className={cxx('xd-br', !s && 'nomsiz')}>
      <div className="xd-br-bar"><span className="xd-br-n"><i /><i /><i /></span><span className={cxx('xd-br-url', !s && 'bosh')}>{s ? s.url : ''}</span></div>
      <div className="xd-br-ich">
        {s
          ? <div className="xd-br-bosh">
            <div className="xd-br-nr"><Brend nom={s.nom} rang={d === 'diamond' ? DC_RANG : YC_RANG} />{til && <span className="xd-br-til">{tr({ uz: "Sahifa ingliz tilida — mazmuni o'zbekcha", ru: 'Страница на английском — суть по-узбекски' })}</span>}</div>
            <span className="xd-br-izoh">{tr(s.izoh)}</span>
          </div>
          : <div className="xd-br-bosh"><b className="xd-br-nomsiz">{tr({ uz: 'Xalqaro dastur', ru: 'Международная программа' })}</b></div>}
        <ol className="xd-br-q">
          {qatorlar.map((q, i) => {
            const h = holat(i);
            return (
              <li key={q.id || i} ref={qRef ? (el => { qRef.current[i] = el; }) : undefined} className={cxx('xd-brq', h, q.bar && 'bar')}>
                <i>{h === 'ok' ? '✓' : (h === 'savol' || h === 'savolYon') ? '?' : i + 1}</i>
                {q.bar ? <span className="xd-bar" style={{ width: q.bar + '%' }} /> : <span>{tr(q.matn || qatorMatn(q))}</span>}
              </li>
            );
          })}
        </ol>
        {tugma && <span className="xd-br-tugma">{tr({ uz: 'Ariza berish', ru: 'Подать заявку' })}</span>}
      </div>
    </div>
  );
};
// --- Varaq (oq, soyasiz — «ma'lumot», E 45): rejim shartlar | solishtirish | ariza ---
const Varaq = ({ rejim, sarlavha, children, className }) => (
  <div className={cxx('xd-varaq', rejim, className)}>
    <div className="xd-varaq-h">{sarlavha}</div>
    {children}
  </div>
);
const SOL_QATOR = [{ uz: 'Kim uchun', ru: 'Для кого' }, { uz: 'Nima kutiladi', ru: 'Чего ждут' }, { uz: 'Qayerda', ru: 'Где' }];
// --- Pitch tasmasi (olti bo'lak, bir qatordan; Mentor misoli — kulrang yorliq bilan) ---
const PitchTasma = ({ matnlar = {}, mentor, fokus, kulrang = {}, refs, nomsiz, yonik = [], kichik, faqatNom }) => (
  <div className={cxx('xd-tasma', kichik && 'kichik', faqatNom && 'nomlar')}>
    {mentor && <span className="xd-tasma-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></span>}
    <div className="xd-tasma-q">
      {BOLAK_ID.map(id => (
        <div key={id} ref={refs ? (el => { refs.current[id] = el; }) : undefined} className={cxx('xd-tb', (fokus === id || yonik.includes(id)) && 'on', !nomsiz && !matnlar[id] && 'bosh')}>
          {nomsiz ? <span className="xd-bar" /> : <><b>{tr(BOLAK_NOM[id])}</b>{matnlar[id] && !faqatNom && <span>{kulrang[id] || matnlar[id]}</span>}</>}
        </div>
      ))}
    </div>
  </div>
);
// O'quvchi pitchi (pm-m12d1-pitch) yoki Mentor misoli — tasma uchun birinchi gaplar
const pitchOl = () => { const p = lsO(PITCH_KEY); return p && p.bolaklar && typeof p.bolaklar === 'object' ? p.bolaklar : null; };
const pitchMatn = (b, id) => (b && typeof b[id] === 'string' && b[id].trim() ? b[id].trim() : null);
const tasmaMatnlar = (b) => Object.fromEntries(BOLAK_ID.map(id => [id, b ? (pitchMatn(b, id) ? birinchiGap(pitchMatn(b, id)) : null) : birinchiGap(tr(JAMOA_PITCH[id]))]));
// Testlardan keyingi kichik vizual (SABOQ 4): varaq qatorlari, biri ajratilgan
const MiniVaraq = ({ yorliq, qatorlar }) => (
  <div className="xd-mini">
    <span className="xd-mini-y">{yorliq}</span>
    {qatorlar.map((q, i) => <span key={i} className={cxx('xd-mini-q', q.ajrat && 'ajrat')} style={{ animationDelay: (i * 0.06) + 's' }}>{q.t}{q.kul && <em>{q.kul}</em>}</span>)}
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026: correct false hammaga; javob «Aynan!» / «Qiziq fikr!» — T-028, T-067) =====
const HOOK_OPTS = [
  { id: 'kim', t: { uz: 'Kim ariza bera olishini', ru: 'Кто может подать заявку' }, q: { uz: 'Kim qatnasha oladi?', ru: 'Кто может участвовать?' } },
  { id: 'goliblar', t: { uz: 'Oldin kimlar yutganini', ru: 'Кто побеждал раньше' }, q: { uz: "G'oliblar", ru: 'Победители' } },
  { id: 'muddat', t: { uz: 'Muddat qachon tugashini', ru: 'Когда заканчивается срок' }, q: { uz: 'Muddat', ru: 'Срок' } }
];
const HOOK_JAVOB = {
  kim: { uz: <><b>Aynan!</b> Shartga mos kelmasangiz, qolgan savollar kerak bo'lmaydi — avval shu o'qiladi.</>, ru: <><b>Именно!</b> Если вы не подходите под условия, остальные вопросы не нужны — сначала читают это.</> },
  goliblar: { uz: <><b>Qiziq fikr!</b> Bu ham foydali — lekin avval o'zingiz qatnasha olishingizni bilish kerak.</>, ru: <><b>Интересная мысль!</b> Это тоже полезно — но сначала нужно знать, можете ли вы участвовать.</> },
  muddat: { uz: <><b>Qiziq fikr!</b> Muddat ham kerak — lekin avval kim qatnasha olishini bilish kerak.</>, ru: <><b>Интересная мысль!</b> Срок тоже нужен — но сначала нужно знать, кто может участвовать.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const oz = useMemo(() => pitchOl(), []);
  const matnlar = useMemo(() => tasmaMatnlar(oz), [oz]); // eslint-disable-line
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const pi = HOOK_OPTS.findIndex(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('xd-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Qaysi xalqaro dasturga <A>ariza berasiz?</A></>, ru: <>В какую международную программу <A>подадите заявку?</A></> })}
          mentor={<Mentor>{tr({ uz: 'Tasavvur qiling: pitchingiz bilan xalqaro dasturga ariza bermoqchisiz — birinchi nimani bilish kerak?', ru: 'Представьте: вы хотите подать заявку со своим питчем в международную программу — что нужно знать в первую очередь?' })}</Mentor>}
          maket={<div className="xd-kir">
            <Brauzer qatorlar={HOOK_OPTS.map(o => ({ id: o.id, matn: o.q }))} holat={(i) => (i === pi ? 'savolYon' : 'savol')} tugma til={false} />
            <span className="xd-strelka" aria-hidden="true" />
            <PitchTasma matnlar={matnlar} mentor={!oz} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual bir marta o'zi yuradi — matnsiz: sahifa qatorlari yonadi → varaqqa chiziqlar → tasmadagi ikki bo'lak varaqqa uchadi; tugagach «Boshlaymiz» halqada) =====
const REJA = [
  { t: { uz: "Dastur shartini rasmiy sahifadan o'qishni bilib olasiz", ru: 'Научитесь читать условия программы на официальной странице' }, teg: { uz: 'rasmiy sahifa', ru: 'официальная страница' } },
  { t: { uz: 'Ikki dasturning shartlari sizga qanday mos kelishini solishtirasiz', ru: 'Сравните, как условия двух программ подходят вам' }, teg: { uz: 'Diamond Challenge · Y Combinator', ru: 'Diamond Challenge · Y Combinator' } },
  { t: { uz: "Pitchdan ariza uchun qisqa qoralama olishni o'rganasiz", ru: 'Научитесь делать из питча короткий черновик для заявки' }, teg: { uz: 'konsept', ru: 'концепт' } },
  { t: { uz: 'Ariza qoralamasini olti kartaga yozasiz', ru: 'Напишете черновик заявки на шести карточках' }, teg: { uz: 'jamoa · maslahatchi', ru: 'команда · консультант' } }
];
const REJA_BAR = [78, 64, 70, 58, 74, 52].map((bar, i) => ({ id: 'r' + i, bar }));
const Screen1 = ({ screen, onNext, onPrev }) => {
  const km = kamHarakat();
  const [q, setQ] = useState(km ? 12 : 0); // 1–6 sahifa qatorlari · 7–9 varaq chiziqlari · 10–11 ikki bo'lak uchdi · 12 tayyor
  const tasRef = useRef({}); const slotRef = useRef([]);
  const [uchir, uchEl] = useUchar();
  useEffect(() => {
    if (km) return undefined;
    let on = true; const ts = [];
    const qoy = (ms, fn) => ts.push(setTimeout(() => { if (on) fn(); }, ms));
    for (let i = 1; i <= 9; i += 1) qoy(300 + i * 380, () => setQ(i));
    qoy(4000, () => uchir(tasRef.current.muammo, slotRef.current[0], <span className="xd-bar" />, 'bar').then(() => { if (on) setQ(10); }));
    qoy(4900, () => uchir(tasRef.current.yechim, slotRef.current[1], <span className="xd-bar" />, 'bar').then(() => { if (on) { setQ(11); setTimeout(() => { if (on) setQ(12); }, 300); } }));
    return () => { on = false; ts.forEach(clearTimeout); };
  }, []); // eslint-disable-line
  const tayyor = q >= 12;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun shartlarni o'qib, <A>ariza qoralamasini boshlaysiz.</A></>, ru: <>Сегодня прочитаете условия и <A>начнёте черновик заявки.</A></> })}
        mentor={<Mentor>{tr({ uz: "Bugun hech qayerga ariza yuborilmaydi: shartlar o'qiladi, qoralama yoziladi.", ru: 'Сегодня никуда заявку не отправляем: читаем условия, пишем черновик.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="xd-reja">
          <span className="xd-reja-teg">{tr({ uz: 'Diamond Challenge, Y Combinator: shartlar va ariza', ru: 'Diamond Challenge, Y Combinator: условия и заявка' })}</span>
          <div className="xd-reja-s">
            <Brauzer qatorlar={REJA_BAR} til={false} holat={(i) => (i === q - 1 ? 'yon' : i < Math.min(q, 6) ? 'ok' : 'kul')} />
            <Varaq rejim="reja" sarlavha={<span className="xd-bar k" />}>
              {[0, 1, 2].map(i => <span key={i} className={cxx('xd-vchiziq', q >= 7 + i && 'bor')} />)}
              <div className="xd-reja-slot">{[0, 1].map(i => <span key={i} ref={el => { slotRef.current[i] = el; }} className={cxx('xd-rslot', q >= 10 + i && 'bor')} />)}</div>
            </Varaq>
          </div>
          <PitchTasma nomsiz refs={tasRef} yonik={q >= 9 && q < 12 ? ['muammo', 'yechim'] : []} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 2 — KIM ARIZA BERA OLADI (QTushuncha keng; markaziy: bashorat → olti gap ketma-ket «Sahifada bor / yo'q» → varaq to'ladi; nishon Source Reader!) =====
const S2_TAXMIN = [{ k: '2', t: { uz: '2', ru: '2' } }, { k: '4', t: { uz: '4', ru: '4' } }, { k: '6', t: { uz: '6', ru: '6' } }];
const S2_XATO = [
  { uz: "Sahifadagi qatorlarni yana bir o'qing.", ru: 'Перечитайте строки на странице.' },
  { uz: 'Sahifada mamlakat haqida nima yozilgan?', ru: 'Что на странице написано о стране?' },
  { uz: 'Sahifada «finalistlar» qatorini toping.', ru: 'Найдите на странице строку «финалисты».' }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(storedAnswer ? 7 : 0); // 0–6 javob berilgan kartalar · 7 — muddat qatori ham kirdi
  const [xato, setXato] = useState(null); // { i, k }
  const [xatoSoni, setXatoSoni] = useState(0);
  const [band, setBand] = useState(false);
  const [yon, setYon] = useState(null); // brauzerda ~1 s yonib turgan qator
  const done = n >= 7;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && n < 6, n);
  const kartaRef = useRef(null); const slotRef = useRef([]); const taxRef = useRef(null); const brRef = useRef([]);
  const [uchir, uchEl] = useUchar();
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { correct: true, picked: true, taxmin, xato: xatoSoni });
    if (xatoSoni === 0 && achMiss && achMiss.earn) achMiss.earn('sourceReader');
  }, [done]); // eslint-disable-line
  const yonib = (i) => { setYon(i); setTimeout(() => setYon(y => (y === i ? null : y)), 1100); };
  const javob = (k) => {
    if (!taxmin || n >= 6 || band) return;
    const g = GAP_KARTA[n];
    if (k !== g.javob) { setXato({ i: n, k }); setXatoSoni(s => s + 1); return; }
    setXato(null); setBand(true); yonib(g.qator);
    const i = n;
    const bor = g.javob === 'bor';
    uchir(kartaRef.current, bor ? slotRef.current[i] : taxRef.current, bor ? tr(g.varaq) : <s>{tr(g.matn)}</s>, bor ? '' : 'yoq').then(() => {
      setN(i + 1); setBand(false);
      if (i === 5) {
        setTimeout(() => { yonib(4); uchir(brRef.current[4], slotRef.current[5], tr(muddatVaraq()), '').then(() => setN(7)); }, kamHarakat() ? 0 : 450);
      }
    });
  };
  const yxt = xato && (xato.i < 4 ? S2_XATO[0] : xato.i === 4 ? S2_XATO[1] : S2_XATO[2]);
  const shartlar = GAP_KARTA.filter(g => g.varaq).map(g => g.varaq);
  const varaqQator = (i) => (i < 5 ? (n > i ? shartlar[i] : null) : (n >= 7 ? muddatVaraq() : null));
  const taxminlar = GAP_KARTA.filter((g, i) => g.javob === 'yoq' && i < n);
  const brHolat = (i) => {
    if (yon === i) return i === 5 ? 'kulyon' : 'yon';
    if (i === 5) return n >= 6 ? 'kulyon' : 'kul';
    const ochiq = GAP_KARTA.some((g, j) => j < n && g.qator === i) || (i === 4 && n >= 7);
    return ochiq ? 'ok' : 'kul';
  };
  const brauzer = <Brauzer d="diamond" qatorlar={DASTUR_SHART.diamond.qatorlar} holat={brHolat} qRef={brRef} />;
  const varaq = (
    <Varaq rejim="shartlar" sarlavha={tr({ uz: 'Shartlar jadvali', ru: 'Таблица условий' })}>
      <div className="xd-vq-ro">
        {[0, 1, 2, 3, 4, 5].map(i => {
          const m = varaqQator(i);
          return <div key={i} ref={el => { slotRef.current[i] = el; }} className={cxx('xd-vq', !m && 'bosh', m && 'bor', m && i === (n >= 7 ? 5 : n - 1) && !storedAnswer && 'yangi')}>{m ? tr(m) : ''}{i === 5 && m && <em className="xd-vq-kul">{tr({ uz: '2027-yil tanlovi; sana saytda o\'zgarishi mumkin', ru: 'конкурс 2027 года; дата на сайте может измениться' })}</em>}</div>;
        })}
      </div>
      <div ref={taxRef} className="xd-taxmin">
        <b>{tr({ uz: 'Taxmin', ru: 'Догадка' })} · {taxminlar.length}</b>
        {taxminlar.map((g, i) => <s key={i}>{tr(g.matn)}</s>)}
      </div>
    </Varaq>
  );
  const g = n < 6 ? GAP_KARTA[n] : null;
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · rasmiy shartlar', ru: 'Понятие · официальные условия' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Gaplarni solishtiring (${Math.min(n, 6)}/6)`, ru: `Сравните фразы (${Math.min(n, 6)}/6)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <><DC />'ga <A>kim ariza bera oladi?</A></>, ru: <>Кто может <A>подать заявку</A> в <DC />?</> })}
        mentor={<Mentor>{tr({ uz: 'Har gapni rasmiy sahifa bilan solishtiring: u yerda shunday yozilganmi?', ru: 'Сравните каждую фразу с официальной страницей: там так написано?' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Olti gapdan nechtasi rasmiy sahifada yozilgan?', ru: 'Сколько из шести фраз написано на официальной странице?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="xd-harakat">
          {g && <div ref={kartaRef} key={n} className={cxx('xd-gap', xato && xato.i === n && 'err', !taxmin && 'qulf', band && 'ketdi')}>
            <span className="xd-gap-y">{tr({ uz: 'Eshitilgan gap', ru: 'Услышанная фраза' })} · {n + 1}{NB}/{NB}6</span>
            <p className="xd-gap-t">«{tr(g.matn)}»</p>
            <div className="xd-gap-tug">
              {['bor', 'yoq'].map(k => (
                <button key={k} type="button" className={cxx('xd-gap-b', taxmin && !band && 'chorla', xato && xato.i === n && xato.k === k && 'silk')} disabled={!taxmin || band} onClick={() => javob(k)}>
                  {k === 'bor' ? tr({ uz: 'Sahifada bor', ru: 'На странице есть' }) : tr({ uz: "Sahifada yo'q", ru: 'На странице нет' })}
                </button>
              ))}
            </div>
          </div>}
          {xato && <QXato key={'x' + xatoSoni}>{tr(yxt)}</QXato>}
          {(n === 3 || n === 4) && <QIzoh>{tr({ uz: "Jamoaga yordam beradigan katta yoshli odam maslahatchi deyiladi.", ru: 'Взрослый, который помогает команде, называется консультантом.' })}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: 'Sahifadagi qatorlardan biri shu gapni aytadimi?', ru: 'Говорит ли это одна из строк на странице?' }))}
        </div>}
        vizual={<div className="xd-ikki">{brauzer}{varaq}</div>}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '4'} aslida="4" />}
          matn={tr({ uz: "Ariza rasmiy sahifadagi shartlarni o'qishdan boshlanadi: sahifada yo'q gap — taxmin.", ru: 'Заявка начинается с чтения условий на официальной странице: фраза, которой нет на странице, — догадка.' })}
          izoh={tr({ uz: 'Bu darsda xalqaro dastur — ariza topshiriladigan va qatnashchilar tanlanadigan xalqaro tanlov yoki dastur.', ru: 'На этом уроке международная программа — международный конкурс или программа, куда подают заявку и где отбирают участников.' })} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1; o'quvchining o'z holati — yolg'iz qurilgan mahsulot) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · jamoa sharti', ru: 'Проверка · условие о команде' })}
    questionText="Yoshingiz Diamond Challenge'ga mos, mahsulotni yolg'iz qurdingiz. Endi nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Yoshingiz <DC />'ga mos, mahsulotni yolg'iz qurdingiz. <A>Endi nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Ваш возраст подходит для <DC />, продукт вы сделали в одиночку. <A>Что теперь сделаете?</A></h2> })}
    options={[
      { uz: "Yolg'iz ariza beraman: g'oya o'zimniki", ru: 'Подам заявку один: идея моя' },
      { uz: 'Bir-ikki sinfdoshimni jamoaga chaqiraman', ru: 'Позову в команду одного-двух одноклассников' },
      { uz: "Katta yoshli akamni jamoaga qo'shib qo'yaman", ru: 'Добавлю в команду старшего брата' },
      { uz: 'Arizada jamoamizni uch kishi deb yozaman', ru: 'Напишу в заявке, что нас в команде трое' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Diamond Challenge'da jamoa 2–4 o'quvchidan iborat bo'ladi.", ru: 'В Diamond Challenge команда состоит из 2–4 учеников.' }}
    explainWrong={{
      0: { uz: "Sahifada jamoada nechta o'quvchi deyilgan?", ru: 'Сколько учеников в команде указано на странице?' },
      2: { uz: "Jamoa a'zosi 14–18 yoshda; kattasi maslahatchi bo'ladi.", ru: 'Члену команды 14–18 лет; взрослый будет консультантом.' },
      3: { uz: "Arizadagi har gap rost bo'lishi kerak.", ru: 'Каждая фраза в заявке должна быть правдой.' },
      default: { uz: "Diamond Challenge'da jamoa sharti qanday edi?", ru: 'Каким было условие о команде в Diamond Challenge?' }
    }}
    vizual={<MiniVaraq yorliq={tr({ uz: 'Shartlar jadvali', ru: 'Таблица условий' })} qatorlar={[
      { t: tr(GAP_KARTA[0].varaq), ajrat: true }, { t: tr(GAP_KARTA[1].varaq) }, { t: tr(GAP_KARTA[2].varaq) }]} />} />
);

// ===== SCREEN 4 — Y COMBINATOR (QTushuncha keng; bashorat → 3 tugma: varaq «Solishtirish» ikki ustuni to'ladi; tugagach varaq fokusda) =====
const S4_TAXMIN = [{ k: '14', t: { uz: '14 yoshdan', ru: 'С 14 лет' } }, { k: '16', t: { uz: '16 yoshdan', ru: 'С 16 лет' } }, { k: 'yoq', t: { uz: 'Yozilmagan', ru: 'Не указан' } }];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [yon, setYon] = useState(null);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = () => { if (!taxmin || done) return; const i = q; setQ(i + 1); setYon(i); setTimeout(() => setYon(y => (y === i ? null : y)), 1100); };
  const brauzer = <Brauzer d="yc" qatorlar={DASTUR_SHART.yc.qatorlar} holat={(i) => (yon === i ? 'yon' : i < q ? 'ok' : 'kul')} />;
  const varaq = (
    <Varaq rejim="solishtirish" sarlavha={tr({ uz: 'Solishtirish', ru: 'Сравнение' })}>
      <table className="xd-sol">
        <thead><tr><th /><th><DC /></th><th><YC /></th></tr></thead>
        <tbody>
          {SOL_QATOR.map((nom, i) => (
            <tr key={i}>
              <th>{tr(nom)}</th>
              <td className={cxx(i >= q && 'bosh', i === yon && 'yangi')}>{i < q ? tr(DASTUR_SHART.diamond.sol[i]) : ''}</td>
              <td className={cxx(i >= q && 'bosh', i === yon && (i === 0 ? 'yashil' : 'yangi'), i === 1 && q >= 2 && 'urg')}>{i < q ? tr(DASTUR_SHART.yc.sol[i]) : ''}</td>
            </tr>
          ))}
          {q >= 3 && <tr className="xd-sol-bugun">
            <th>{tr({ uz: "Bugun maktab o'quvchisi uchun:", ru: 'Сегодня для школьника:' })}</th>
            <td>{tr({ uz: "yoshingiz mos bo'lsa — bugungi yo'l", ru: 'если возраст подходит — путь на сегодня' })}</td>
            <td>{tr({ uz: "bugungi yo'l emas", ru: 'не путь на сегодня' })}</td>
          </tr>}
        </tbody>
      </table>
    </Varaq>
  );
  const tx = S4_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ikki dastur', ru: 'Понятие · две программы' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <><YC /> <A>bugun sizga mos yo'lmi?</A></>, ru: <><YC /> — <A>подходящий ли путь для вас сегодня?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Tugmalarni birma-bir bosing: ikki dastur sahifasi bir xil savolga nima deydi?', ru: 'Нажимайте кнопки по одной: что страницы двух программ отвечают на один и тот же вопрос?' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Y Combinator sahifasida yosh chegarasi qanday yozilgan?', ru: 'Как на странице Y Combinator указан возрастной предел?' })} variantlar={S4_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="xd-harakat">
          <Qadamlar3 nomlar={SOL_QATOR} q={q} faol={!!taxmin} onBos={bos} />
          {q === 2 && <QIzoh>{tr({ uz: "To'liq vaqt — butun ish kunini o'z kompaniyasiga berish.", ru: 'Полный день — отдавать своей компании весь рабочий день.' })}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — ikki ustun qanday to'lishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как заполняются два столбца.' }))}
        </div>}
        vizual={tugadi ? varaq : <div className="xd-ikki">{brauzer}{varaq}</div>}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'yoq'} aslida={tr({ uz: 'yozilmagan', ru: 'не указан' })} />}
          matn={tr({ uz: "Sahifada yosh chegarasi yo'q; bu kursda to'liq vaqt va yuzma-yuz format sabab u bugungi yo'l emas.", ru: 'На странице возрастного предела нет; на этом курсе из-за полного дня и очного формата это не путь на сегодня.' })}
          izoh={tr({ uz: "Universitet yillarida Early Decision yo'li bor: u o'qishini tugatmoqchi talabalar uchun.", ru: 'В годы университета есть путь Early Decision: он для студентов, которые хотят окончить учёбу.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 3; o'quvchining o'z holati — yoshi yozilmagan sahifa) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · rasmiy shartlar', ru: 'Проверка · официальные условия' })}
    questionText="Dastur sahifasida yosh chegarasi yozilmagan. Endi nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Dastur sahifasida yosh chegarasi yozilmagan. <A>Endi nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">На странице программы возрастной предел не указан. <A>Что теперь сделаете?</A></h2> })}
    options={[
      { uz: 'Yosh yo\'q ekan, ariza yozishni boshlayman', ru: 'Раз возраста нет, начну писать заявку' },
      { uz: 'Sinfdoshim nima desa, shunga ishonaman', ru: 'Поверю тому, что скажет одноклассник' },
      { uz: 'Yosh yo\'q ekan, bu dasturni qoldiraman', ru: 'Раз возраста нет, оставлю эту программу' },
      { uz: 'Qolgan shartlarini ham o\'qib chiqaman', ru: 'Прочитаю и остальные условия' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Yosh yozilmagani — ruxsat ham, taqiq ham emas.', ru: 'То, что возраст не указан, — ни разрешение, ни запрет.' }}
    explainWrong={{
      0: { uz: 'Sahifada boshqa shartlar ham yozilganmi?', ru: 'На странице написаны и другие условия?' },
      1: { uz: 'Bu gap rasmiy sahifada yozilganmi?', ru: 'Эта фраза написана на официальной странице?' },
      2: { uz: 'Sahifada sizga mos kelmaydigan shart bormi?', ru: 'Есть ли на странице условие, которое вам не подходит?' },
      default: { uz: 'Y Combinator sahifasida yoshdan boshqa nima yozilgan edi?', ru: 'Что ещё, кроме возраста, было написано на странице Y Combinator?' }
    }}
    vizual={<MiniVaraq yorliq={<>{tr({ uz: 'Solishtirish', ru: 'Сравнение' })} · <YC /></>} qatorlar={DASTUR_SHART.yc.sol.map((c, i) => ({ t: tr(c), ajrat: i > 0 }))} />} />
);

// ===== SCREEN 6 — PITCHDAN KONSEPT (QTushuncha keng; bashorat → 3 tugma: Muammo va Yechim tasmadan varaqqa uchadi, Kim uchun — yangi gap; Bozor sonlari tasmada qoladi) =====
const S6_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Одной' } }, { k: '2', t: { uz: 'Ikkita', ru: 'Двух' } }, { k: '3', t: { uz: 'Uchta', ru: 'Трёх' } }];
const KONSEPT_ID = ['muammo', 'kimUchun', 'yechim'];
const KONSEPT_NOM = { muammo: { uz: 'Muammo', ru: 'Проблема' }, kimUchun: { uz: 'Kim uchun', ru: 'Для кого' }, yechim: { uz: 'Yechim', ru: 'Решение' } };
const BOZOR_SON_RE = /(60 kishi|6 tashkilotchi|60 человек|6 организаторов)/;
const bozorKul = (s) => String(s).split(BOZOR_SON_RE).map((p, i) => (BOZOR_SON_RE.test(p) ? <em key={i} className="xd-son-kul">{p}</em> : p));
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [band, setBand] = useState(false);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tasRef = useRef({}); const slotRef = useRef([]);
  const [uchir, uchEl] = useUchar();
  const MANBA = ['muammo', 'bozor', 'yechim'];
  const bos = () => {
    if (!taxmin || done || band) return;
    const i = q; setBand(true);
    if (i === 1) { setTimeout(() => { setQ(2); setBand(false); }, kamHarakat() ? 0 : 500); return; }
    uchir(tasRef.current[MANBA[i]], slotRef.current[i], tr(MENTOR_KONSEPT[KONSEPT_ID[i]]), 'gap').then(() => { setQ(i + 1); setBand(false); });
  };
  const matnlar = tasmaMatnlar(null);
  const fokus = band || (q > 0 && q <= 3 && !done) ? MANBA[band ? q : q - 1] : null;
  const varaq = (
    <Varaq rejim="ariza" sarlavha={<>{tr({ uz: 'Ariza qoralamasi', ru: 'Черновик заявки' })} · <MJ /></>}>
      <span className="xd-av-kh">{tr({ uz: 'Konsept', ru: 'Концепт' })}</span>
      {KONSEPT_ID.map((id, i) => (
        <div key={id} ref={el => { slotRef.current[i] = el; }} className={cxx('xd-av-q', i >= q && 'bosh', i === q - 1 && !storedAnswer && 'yangi')}>
          <b>{tr(KONSEPT_NOM[id])}</b>
          {i < q && <span>{tr(MENTOR_KONSEPT[id])}</span>}
        </div>
      ))}
      {done && <p className="xd-av-kul">{nomAjrat(tr({ uz: "Diamond Challenge so'raydigan 3–5 betlik yozma g'oya shu uch gapdan boshlanadi.", ru: 'Письменная идея на 3–5 страниц, которую просит Diamond Challenge, начинается с этих трёх фраз.' }))}</p>}
    </Varaq>
  );
  const tx = S6_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · konsept', ru: 'Понятие · концепт' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Konsept qoralamasini <A>pitchdan qanday boshlaysiz?</A></>, ru: <>Как начать черновик концепта <A>из питча?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing: Mentor qoralamasi pitchdan qanday boshlanishini ko'ring.", ru: 'Нажимайте кнопки по одной: посмотрите, как черновик Ментора начинается из питча.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Qoralamaga nechta pitch bo'lagidan boshlang'ich gap olasiz?", ru: 'Из скольких частей питча вы возьмёте начальную фразу для черновика?' })} variantlar={S6_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="xd-harakat">
          <Qadamlar3 nomlar={KONSEPT_ID.map(id => KONSEPT_NOM[id])} q={q} faol={!!taxmin && !band} onBos={bos} />
          {q === 2 && <QIzoh>{tr({ uz: 'Kim uchun — qancha emas, kimlar: sonlar pitchdagi Bozor bo\'lagida qoladi.', ru: 'Для кого — не сколько, а кто: числа остаются в части «Рынок» питча.' })}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — varaqqa nima yozilishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, что запишется в лист.' }))}
        </div>}
        vizual={tugadi ? varaq : <div className="xd-kons"><PitchTasma kichik matnlar={matnlar} mentor refs={tasRef} fokus={fokus} kulrang={q >= 2 || (band && q === 1) ? { bozor: bozorKul(matnlar.bozor) } : {}} />{varaq}</div>}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '2'} aslida={tr({ uz: 'ikkita', ru: 'двух' })} />}
          matn={tr({ uz: "Bu misolda Muammo va Yechim pitchdan boshlang'ich gap bo'ldi, kim uchun — yangi gap.", ru: 'В этом примере Проблема и Решение стали начальными фразами из питча, «для кого» — новая фраза.' })}
          izoh={tr({ uz: 'Bu darsdagi konsept qoralamasi uch narsani aytadi: muammo, kim uchun va yechim.', ru: 'Черновик концепта на этом уроке говорит о трёх вещах: проблема, для кого и решение.' })} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 7 — ARIZA QORALAMASI (QMustaqil, USTAXONA — bittadan karta, 6 karta; E 43, E 53) · yozadi pm-m12d11-dastur · nishonlar programPicked, conceptDraft =====
const KARTA_ID = ['dastur', 'jamoa', 'maslahatchi', 'muammo', 'kimUchun', 'yechim'];
const KARTA_NOM = { dastur: { uz: 'Dastur', ru: 'Программа' }, jamoa: { uz: 'Jamoa', ru: 'Команда' }, maslahatchi: { uz: 'Maslahatchi', ru: 'Консультант' }, ...KONSEPT_NOM };
const JAMOA_VAR = [1, 2, 3, 4, 'hali'];
const BOSHQA_NOM = { uz: 'Boshqa dastur — shartini tekshiraman', ru: 'Другая программа — проверю условия' };
const HALI_YOQ = { uz: "Hali yo'q", ru: 'Пока нет' };
const DASTUR_BOSH = () => ({ dastur: null, jamoa: null, maslahatchi: null, qoralama: { muammo: null, kimUchun: null, yechim: null }, royxat: null, savedAt: null });
// A-13 shartnomasi: dastur 'diamond' | 'boshqa' | null · jamoa 1–4 | 'hali' | null · maslahatchi bool | null · qoralama.* string | null · royxat bool | null (faqat diamond)
const dasturOl = () => {
  const v = lsO(DASTUR_KEY); const b = DASTUR_BOSH(); if (!v) return b;
  const q = v.qoralama && typeof v.qoralama === 'object' ? v.qoralama : {};
  const str = (x) => (typeof x === 'string' && x.trim() ? x : null);
  const dastur = v.dastur === 'diamond' || v.dastur === 'boshqa' ? v.dastur : null;
  return { dastur, jamoa: JAMOA_VAR.includes(v.jamoa) ? v.jamoa : null, maslahatchi: typeof v.maslahatchi === 'boolean' ? v.maslahatchi : null,
    qoralama: { muammo: str(q.muammo), kimUchun: str(q.kimUchun), yechim: str(q.yechim) }, royxat: dastur === 'diamond' && typeof v.royxat === 'boolean' ? v.royxat : null, savedAt: v.savedAt || null };
};
const saqlandi = (d, id) => (id === 'dastur' ? (d.dastur === 'boshqa' || (d.dastur === 'diamond' && typeof d.royxat === 'boolean'))
  : id === 'jamoa' ? d.jamoa !== null : id === 'maslahatchi' ? typeof d.maslahatchi === 'boolean' : !!d.qoralama[id]);
const arizaSoni = (d) => KARTA_ID.filter(id => saqlandi(d, id)).length;
// Varaqdagi belgi: diamond — ✓ / ✕ / ?; boshqa — faqat «?» (11-FILTR 2); dastur tanlanmagan — belgisiz. Maslahatchi «Hali yo'q» — «?», ✕ emas (11-FILTR 16)
const shartBelgi = (d, id) => {
  if (!d.dastur) return null;
  if (d.dastur === 'boshqa') return '?';
  if (id === 'jamoa') return d.jamoa === null ? null : d.jamoa === 'hali' ? '?' : d.jamoa >= 2 ? '✓' : '✕';
  if (id === 'maslahatchi') return d.maslahatchi === null ? null : d.maslahatchi ? '✓' : '?';
  return d.royxat === false ? '?' : null;
};
const jamoaMatn = (j) => (j === 'hali' ? { uz: 'Hali bilmayman', ru: 'Пока не знаю' } : { uz: j + " o'quvchi", ru: j + ' уч.' });
const qiymatMatn = (d, id, mentor) => {
  if (id === 'dastur') return d.dastur === 'diamond' ? <DC /> : d.dastur === 'boshqa' ? tr(BOSHQA_NOM) : null;
  if (id === 'jamoa') return d.jamoa === null ? null : tr(jamoaMatn(d.jamoa));
  if (id === 'maslahatchi') return d.maslahatchi === true ? tr({ uz: 'Bor', ru: 'Есть' }) : d.maslahatchi === false ? tr(HALI_YOQ) : mentor ? tr({ uz: 'hali aniqlanmagan', ru: 'пока не определён' }) : null;
  if (id === 'royxat') return d.dastur !== 'diamond' ? null : d.royxat === true ? tr({ uz: "ro'yxatdan o'tilgan", ru: 'регистрация пройдена' }) : d.royxat === false ? tr(HALI_YOQ) : null;
  return mentor ? tr(MENTOR_KONSEPT[id]) : d.qoralama[id];
};
const ArizaVaraq = ({ d, refs, yangi, tahrir, mentor }) => {
  const r = (id) => (refs ? (el => { refs.current[id] = el; }) : undefined);
  const tah = (id) => tahrir && <button type="button" className="xd-tahrir" onClick={() => tahrir(id)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>;
  const sh = [
    { id: 'jamoa', nom: KARTA_NOM.jamoa, k: 'jamoa', b: shartBelgi(d, 'jamoa') },
    { id: 'maslahatchi', nom: KARTA_NOM.maslahatchi, k: 'maslahatchi', b: mentor && d.maslahatchi === null ? '?' : shartBelgi(d, 'maslahatchi') },
    { id: 'royxat', nom: { uz: "Ro'yxat", ru: 'Регистрация' }, k: 'dastur', b: shartBelgi(d, 'royxat') }
  ];
  return (
    <Varaq rejim="ariza" sarlavha={mentor ? <>{tr({ uz: 'Ariza qoralamasi', ru: 'Черновик заявки' })} · <MJ /></> : tr({ uz: 'Ariza qoralamasi', ru: 'Черновик заявки' })}>
      <div ref={r('dastur')} className={cxx('xd-av-d', !d.dastur && 'bosh', yangi === 'dastur' && 'yangi')}>
        <b>{tr({ uz: 'Dastur:', ru: 'Программа:' })}</b><span>{qiymatMatn(d, 'dastur', mentor)}</span>{tah('dastur')}
      </div>
      <div className="xd-av-sh">
        {sh.map(s => {
          const v = qiymatMatn(d, s.id, mentor);
          return (
            <div key={s.id} ref={s.id === 'royxat' ? undefined : r(s.id)} className={cxx('xd-av-s', !v && !s.b && 'bosh', yangi === s.k && 'yangi')}>
              <b>{tr(s.nom)}</b><span>{v}</span>
              {d.dastur === 'boshqa' && <em>{tr({ uz: 'rasmiy sahifadan tekshiriladi', ru: 'проверяется на официальной странице' })}</em>}
              {s.b && <i className={cxx('xd-belgi', s.b === '✓' && 'ok', s.b === '✕' && 'x')}>{s.b}</i>}
              {tah(s.k)}
            </div>
          );
        })}
      </div>
      {d.dastur === 'diamond' && <p className="xd-av-kul">{tr({ uz: "Yosh, til va muddat — varaqda yo'q: uyda rasmiy sahifadan tekshiriladi.", ru: 'Возраста, языка и срока на листе нет: дома проверяется на официальной странице.' })}</p>}
      <span className="xd-av-kh">{tr({ uz: 'Konsept', ru: 'Концепт' })}</span>
      {KONSEPT_ID.map(id => {
        const v = qiymatMatn(d, id, mentor);
        return <div key={id} ref={r(id)} className={cxx('xd-av-q', !v && 'bosh', yangi === id && 'yangi')}><b>{tr(KONSEPT_NOM[id])}</b>{v && <span>{v}</span>}{tah(id)}</div>;
      })}
    </Varaq>
  );
};
const S7_XATO = {
  tanla: { uz: 'Bittasini tanlang.', ru: 'Выберите один вариант.' },
  royxat: { uz: "Ro'yxat holatini belgilang: «Hali yo'q» ham javob.", ru: 'Отметьте статус регистрации: «Пока нет» — тоже ответ.' },
  yolgiz: { uz: "Diamond Challenge'ga kamida yana bitta o'quvchi kerak.", ru: 'Для Diamond Challenge нужен ещё хотя бы один ученик.' },
  bosh: { uz: 'Bu kartaga bitta-ikkita gap yozing.', ru: 'Напишите в эту карточку одну-две фразы.' },
  uzun: { uz: '160 belgidan oshdi — gapni qisqartiring.', ru: 'Больше 160 знаков — сократите фразу.' },
  pii: { uz: 'Telefon va akkaunt nomi yozilmaydi.', ru: 'Телефон и имя аккаунта не пишут.' },
  raqam: { uz: 'Asosiy javob — odamlarning roli; son pitchda qoladi.', ru: 'Главный ответ — роль людей; число остаётся в питче.' },
  hamma: { uz: 'Hamma uchun emas — aniq kimlarga kerak?', ru: 'Не для всех — кому именно нужно?' },
  texno: { uz: 'Bu texnologiya — mahsulot odamga nima beradi?', ru: 'Это технология — а что продукт даёт человеку?' },
  vada: { uz: "Va'da emas — bugun bor narsani yozing.", ru: 'Не обещание — напишите то, что есть сегодня.' }
};
const S7_PLACEHOLDER = { muammo: { uz: 'Qaysi odamlar nimada qiynaladi?', ru: 'Кто и в чём испытывает трудности?' }, kimUchun: { uz: 'Mahsulot kimlarga kerak?', ru: 'Кому нужен продукт?' }, yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' } };
const S7_YORDAM = {
  dastur: { uz: "Mentor misolida: Diamond Challenge — «Maydon Jamoa» konsepti uchun; saytda ro'yxat — hali yo'q.", ru: 'В примере Ментора: Diamond Challenge — для концепта «Maydon Jamoa»; регистрации на сайте — пока нет.' },
  jamoa: { uz: "Mentor misolida: Jamoa bo'lagida bitta odam — Diamond Challenge'ga yana kamida bitta o'quvchi kerak.", ru: 'В примере Ментора: в части «Команда» один человек — для Diamond Challenge нужен ещё хотя бы один ученик.' },
  maslahatchi: { uz: 'Mentor misolida: maslahatchi hali aniqlanmagan.', ru: 'В примере Ментора: консультант пока не определён.' }
};
// Matn tekshiruvi (PM-108: node da 10+ namuna bilan sinaladi): bloklaydi — bo'sh · 160 · telefon/akkaunt/havola; yo'naltiradi (ikkinchi «Saqlash» bilan o'tadi) — qolganlari
const PII_RE = /@|t\.me\/|\+998|\d{7,}|(?:\d[\s-]?){9,}|https?:|www\.|\.uz\b|\.com\b/;
const HAMMA_RE = /(hamma odam|hamma uchun|butun dunyo|millionlab|все люди|для всех|весь мир|миллион)/;
const TEXNO_RE = /(^|[^a-z])(react|expo|nestjs|neon|render|netlify|socket\.io)(?![a-z])/;
const VADA_RE = /(^|[^a-z'а-яё])(tez orada|yaqinda|albatta|kafolat\S*|скоро|обязательно|гарант\S*)(?![a-z'а-яё])/;
const tekshirMatn = (id, matn) => {
  const s = String(matn || '').trim(); const n = normT(s);
  if (!n) return { x: 'bosh', blok: true };
  if (s.length > 160) return { x: 'uzun', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (id === 'kimUchun' && /\d/.test(n)) return { x: 'raqam' };
  if (id === 'kimUchun' && HAMMA_RE.test(n)) return { x: 'hamma' };
  if (id === 'yechim' && TEXNO_RE.test(n)) return { x: 'texno' };
  if (VADA_RE.test(n)) return { x: 'vada' };
  return null;
};
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const pitch = useMemo(() => pitchOl(), []);
  const oldin = useMemo(() => ({ muammo: pitchMatn(pitch, 'muammo'), yechim: pitchMatn(pitch, 'yechim') }), [pitch]);
  const bor = !!(oldin.muammo || oldin.yechim);
  const [d, setD] = useState(() => dasturOl());
  const [tan, setTan] = useState(() => ({ dastur: d.dastur, royxat: d.royxat, jamoa: d.jamoa, maslahatchi: d.maslahatchi }));
  const [matn, setMatn] = useState(() => ({ muammo: d.qoralama.muammo ?? oldin.muammo ?? '', kimUchun: d.qoralama.kimUchun ?? '', yechim: d.qoralama.yechim ?? oldin.yechim ?? '' }));
  const [joriy, setJoriy] = useState(() => KARTA_ID.find(id => !saqlandi(d, id)) || null);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [band, setBand] = useState(false);
  const [yonik, setYonik] = useState([]);
  const kartaRef = useRef(null); const varRefs = useRef({});
  const [uchir, uchEl] = useUchar();
  const n = arizaSoni(d);
  const toliq = n === 6;
  const och = (id) => { if (band) return; setJoriy(id); setXato(null); setYumshoq(null); setYordam(false); };
  const tanla = (k, v) => { setTan(t => ({ ...t, [k]: v, ...(k === 'dastur' && v !== 'diamond' ? { royxat: null } : {}) })); setXato(null); };
  const saqla = () => {
    if (!joriy || band) return;
    const id = joriy; let t = null;
    if (id === 'dastur') { if (!tan.dastur) t = { x: 'tanla', blok: true }; else if (tan.dastur === 'diamond' && typeof tan.royxat !== 'boolean') t = { x: 'royxat', blok: true }; }
    else if (id === 'jamoa') { if (tan.jamoa === null) t = { x: 'tanla', blok: true }; else if (tan.jamoa === 1 && d.dastur === 'diamond') t = { x: 'yolgiz' }; }
    else if (id === 'maslahatchi') { if (typeof tan.maslahatchi !== 'boolean') t = { x: 'tanla', blok: true }; }
    else t = tekshirMatn(id, matn[id]);
    const mt = KONSEPT_ID.includes(id) ? String(matn[id] || '').trim() : String(tan[id]);
    if (t && (t.blok || !(yumshoq && yumshoq.id === id && yumshoq.x === t.x && yumshoq.m === mt))) { setXato(t); if (!t.blok) setYumshoq({ id, x: t.x, m: mt }); return; }
    const yd = { ...d, qoralama: { ...d.qoralama } };
    if (id === 'dastur') { yd.dastur = tan.dastur; yd.royxat = tan.dastur === 'diamond' ? tan.royxat : null; }
    else if (id === 'jamoa') yd.jamoa = tan.jamoa;
    else if (id === 'maslahatchi') yd.maslahatchi = tan.maslahatchi;
    else yd.qoralama[id] = mt;
    yd.savedAt = Date.now();
    if (!isMentor) lsY(DASTUR_KEY, yd);
    const earn = achMiss && achMiss.earn;
    if (earn && ['dastur', 'jamoa', 'maslahatchi'].every(k => saqlandi(yd, k))) earn('programPicked');
    if (earn && KONSEPT_ID.every(k => saqlandi(yd, k))) earn('conceptDraft');
    if (arizaSoni(yd) === 6 && !toliq) {
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'ariza', solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    setXato(null); setYumshoq(null); setYordam(false); setBand(true);
    if (oldin[id]) { setYonik([id]); setTimeout(() => setYonik([]), 1100); }
    const keyingi = KARTA_ID.slice(KARTA_ID.indexOf(id) + 1).find(k => !saqlandi(yd, k)) || KARTA_ID.find(k => !saqlandi(yd, k)) || null;
    uchir(kartaRef.current, varRefs.current[id], <><b>{tr(KARTA_NOM[id])}</b><span>{qiymatMatn(yd, id)}</span></>, 'karta').then(() => {
      setD(yd); setYangi(id); setJoriy(keyingi); setBand(false); setTimeout(() => setYangi(y => (y === id ? null : y)), 1100);
    });
  };
  const varBtn = (k, v, label) => (
    <button key={String(v)} type="button" className={cxx('xd-var', tan[k] === v && 'on')} onClick={() => tanla(k, v)}>
      <span className="q-radio">{tan[k] === v && <span className="q-radio-dot" />}</span><span>{label}</span>
    </button>
  );
  const guruh = (k, el, ...vars) => <div className={cxx('xd-vars', (tan[k] === null || tan[k] === undefined) && 'kutish')}>{el}{vars}</div>;
  const strip = <div className="xd-strip">
    <span className="xd-strip-y">{tr({ uz: 'Arizam', ru: 'Моя заявка' })} · {n}/6</span>
    {KARTA_ID.map((id, i) => <QChip key={id} holat={joriy === id ? 'on' : saqlandi(d, id) ? 'ok' : undefined} className={cxx('xd-tab', yangi === id && 'yangi')} onClick={() => och(id)}><i>{saqlandi(d, id) ? '✓' : i + 1}</i>{tr(KARTA_NOM[id])}</QChip>)}
  </div>;
  const dNow = joriy === 'dastur' ? tan.dastur : d.dastur;
  const kulQ = (t, key) => <p key={key} className="xd-kulrang">{t}</p>;
  let ichi = null;
  if (joriy === 'dastur') {
    ichi = <>
      <span className="q-yorliq">{tr({ uz: 'Qaysi dasturga ariza tayyorlaysiz?', ru: 'В какую программу готовите заявку?' })}</span>
      {guruh('dastur', null, varBtn('dastur', 'diamond', <DC />), varBtn('dastur', 'boshqa', tr(BOSHQA_NOM)))}
      {tan.dastur === 'diamond' && kulQ(tr({ uz: 'Shart: ' + sanaS('muddat').uz + " kuni yoshingiz 14–18 bo'lsin — o'zingiz tekshiring.", ru: 'Условие: на ' + sanaS('muddat').ru + ' вам должно быть 14–18 лет — проверьте сами.' }), 'k1')}
      {tan.dastur === 'boshqa' && kulQ(tr({ uz: "O'zbekistondagi tanlovlar nomini aytmaymiz — shartini tekshirmadik. Mentordan so'rang.", ru: 'Названия конкурсов в Узбекистане не называем — их условия мы не проверяли. Спросите Ментора.' }), 'k2')}
      {tan.dastur === 'diamond' && <>
        <span className="q-yorliq">{tr({ uz: "Saytda ro'yxatdan o'tganmisiz?", ru: 'Вы зарегистрировались на сайте?' })}</span>
        {guruh('royxat', null, varBtn('royxat', false, tr(HALI_YOQ)), varBtn('royxat', true, tr({ uz: "Ha, o'tganman", ru: 'Да, прошёл(-ла)' })))}
      </>}
    </>;
  } else if (joriy === 'jamoa') {
    const pj = pitchMatn(pitch, 'jamoa');
    ichi = <>
      <span className="q-yorliq">{tr({ uz: "Jamoada necha o'quvchi bo'ladi — siz bilan birga?", ru: 'Сколько учеников будет в команде — вместе с вами?' })}</span>
      {guruh('jamoa', null, ...JAMOA_VAR.map(v => varBtn('jamoa', v, v === 'hali' ? tr({ uz: 'Hali bilmayman', ru: 'Пока не знаю' }) : String(v))))}
      {pj && kulQ(<>{tr({ uz: 'Pitchingizdagi Jamoa:', ru: 'Команда в вашем питче:' })} «{pj}»</>, 'k1')}
      {kulQ(tr({ uz: 'Ism yozilmaydi — faqat son.', ru: 'Имена не пишем — только число.' }), 'k2')}
    </>;
  } else if (joriy === 'maslahatchi') {
    ichi = <>
      <span className="q-yorliq">{dNow === 'diamond' ? tr({ uz: "Diamond Challenge uchun 21 yoshdan katta maslahatchi bormi?", ru: 'Есть ли для Diamond Challenge консультант старше 21 года?' }) : tr({ uz: 'Katta yoshli maslahatchi bormi?', ru: 'Есть ли взрослый консультант?' })}</span>
      {guruh('maslahatchi', null, varBtn('maslahatchi', true, tr({ uz: 'Bor', ru: 'Есть' })), varBtn('maslahatchi', false, tr(HALI_YOQ)))}
      {kulQ(tr({ uz: "Ismini yozmang — kim bo'lishini ota-onangiz bilan kelishing.", ru: 'Не пишите имя — кто это будет, договоритесь с родителями.' }), 'k1')}
    </>;
  } else if (joriy) {
    const v = String(matn[joriy] || ''); const uz = v.trim().length;
    const pb = pitchMatn(pitch, 'bozor');
    ichi = <>
      <div className={cxx('xd-maydon', !uz && 'chorla')}>
        <i className="xd-maydon-n">{KARTA_ID.indexOf(joriy) + 1}</i>
        <textarea className={cxx('xd-inp', xato && 'err')} rows={3} maxLength={400} value={v} placeholder={tr(S7_PLACEHOLDER[joriy])} aria-label={tr(KARTA_NOM[joriy])}
          onChange={(e) => { const x = e.target.value; setMatn(m => ({ ...m, [joriy]: x })); setXato(null); }} />
        <span className={cxx('xd-sanoq-b', uz > 160 && 'oshdi')}>{uz}{NB}/{NB}160</span>
      </div>
      {joriy === 'muammo' && oldin.muammo && kulQ(tr({ uz: "Pitchingizdagi Muammo — kerak bo'lsa qisqartiring.", ru: 'Проблема из вашего питча — при необходимости сократите.' }), 'k1')}
      {joriy === 'kimUchun' && pb && kulQ(<>{tr({ uz: 'Pitchingizdagi Bozor:', ru: 'Рынок в вашем питче:' })} «{pb}»</>, 'k1')}
      {joriy === 'kimUchun' && kulQ(tr({ uz: 'Sonni emas, odamlarni yozing — rol bilan.', ru: 'Пишите не число, а людей — по роли.' }), 'k2')}
      {joriy === 'yechim' && kulQ(tr({ uz: 'Mahsulot odamga nima beradi — texnologiya nomisiz.', ru: 'Что продукт даёт человеку — без названий технологий.' }), 'k1')}
    </>;
  }
  const tayyor = joriy && (KONSEPT_ID.includes(joriy) ? String(matn[joriy] || '').trim().length > 0 : joriy === 'dastur' ? !!tan.dastur && (tan.dastur !== 'diamond' || typeof tan.royxat === 'boolean') : tan[joriy] !== null);
  const karta = joriy && (
    <div ref={kartaRef} key={joriy} className={cxx('xd-karta', xato && xato.blok && 'err', band && 'uch')}>
      <span className="xd-karta-h">{KARTA_ID.indexOf(joriy) + 1} · {tr(KARTA_NOM[joriy])}</span>
      {ichi}
      {xato && <QXato key={xato.x}>{tr(S7_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && <p className="xd-yana">{tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' })}</p>}
      {yordam && <div className="xd-yordam fade-step"><p>{KONSEPT_ID.includes(joriy) ? <>{tr({ uz: 'Mentor misolida:', ru: 'В примере Ментора:' })} «{tr(MENTOR_KONSEPT[joriy])}»</> : nomAjrat(tr(S7_YORDAM[joriy]))}</p></div>}
      <div className="xd-karta-tug">
        <QTugma className={cxx(tayyor && 'xd-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        <QTugma ikkinchi className="xd-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
  const yakuniy = toliq && !joriy;
  const xulosa = d.dastur === 'boshqa'
    ? { uz: "Konsept tayyor — dastur shartini Mentordan so'rab, varaqqa yozing.", ru: 'Концепт готов — спросите условия программы у Ментора и запишите на лист.' }
    : (typeof d.jamoa === 'number' && d.jamoa >= 2 && d.maslahatchi === true)
      ? { uz: 'Qoralama tayyor; yosh, til va muddatni uyda rasmiy sahifadan tekshirasiz.', ru: 'Черновик готов; возраст, язык и срок проверите дома на официальной странице.' }
      : { uz: 'Konsept tayyor — ✕ va ? qatorlarini uyda hal qilasiz.', ru: 'Концепт готов — строки с ✕ и ? решите дома.' };
  const forma = isMentor
    ? <div className="xd-fokus"><Zoomable><ArizaVaraq d={MENTOR_ARIZA} mentor /></Zoomable>
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Olti kartani yozganlar', ru: 'Написали шесть карточек' }} /></div>
    : yakuniy
      ? <div className="xd-fokus"><Zoomable><ArizaVaraq d={d} yangi={yangi} tahrir={och} /></Zoomable><QXulosa>{tr(xulosa)}</QXulosa></div>
      : <div className="xd-ish">
        <div className="xd-ish-chap"><Zoomable><ArizaVaraq d={d} refs={varRefs} yangi={yangi} /></Zoomable>
          {pitch && <PitchTasma faqatNom matnlar={tasmaMatnlar(pitch)} mentor={false} yonik={yonik} />}</div>
        <div className="xd-ish-ong">{karta}</div>
      </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n * 10 + (joriy ? KARTA_ID.indexOf(joriy) : 9)} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={yakuniy} disabled={!toliq && !isMentor} label={toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Olti kartani yozing (${n}/6)`, ru: `Заполните шесть карточек (${n}/6)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Ariza qoralamasini <A>olti kartaga yozing.</A></>, ru: <>Напишите черновик заявки <A>на шести карточках.</A></> })}
        mentor={<Mentor>{bor && !isMentor
          ? tr({ uz: "Pitchingizdan Muammo va Yechim qo'yildi: har kartani tekshirib, «Saqlash»ni bosing.", ru: 'Проблема и Решение взяты из вашего питча: проверьте каждую карточку и нажмите «Сохранить».' })
          : tr({ uz: "Har kartadagi savolga javob bering va «Saqlash»ni bosing.", ru: 'Ответьте на вопрос каждой карточки и нажмите «Сохранить».' })}</Mentor>}
        qadamlar={!isMentor && !yakuniy && strip}
        forma={forma}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s8 = 0; ariza xavfsizligi va rasmiy shart) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Diamond Challenge arizasini qanday topshirasiz?"
    question={tr({ uz: <h2 className="title h-ask"><DC /> arizasini <A>qanday topshirasiz?</A></h2>, ru: <h2 className="title h-ask">Как вы <A>подадите заявку</A> в <DC />?</h2> })}
    options={[
      { uz: 'Maslahatchi va ota-onam bilan topshiraman', ru: 'Подам вместе с консультантом и родителями' },
      { uz: 'Ota-onamga aytmasdan, o\'zim topshiraman', ru: 'Подам сам, не говоря родителям' },
      { uz: "Qoralamani o'zbekcha holicha yuboraman", ru: 'Отправлю черновик как есть, на узбекском' },
      { uz: 'Hakamlarga yoqishi uchun sonlarni oshiraman', ru: 'Увеличу числа, чтобы понравиться судьям' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Maslahatchi — rasmiy shart; ota-ona bilan — kurs qoidasi.', ru: 'Консультант — официальное условие; с родителями — правило курса.' }}
    explainWrong={{
      1: { uz: 'Ariza saytiga ma\'lumot — ota-onangiz bilan.', ru: 'Данные на сайт заявки — вместе с родителями.' },
      2: { uz: 'Rasmiy sahifada ariza tili qanday edi?', ru: 'Какой язык заявки был на официальной странице?' },
      3: { uz: 'Arizadagi son ham pitchdagidek rost bo\'ladi.', ru: 'Число в заявке тоже честное, как в питче.' },
      default: { uz: 'Ariza kim bilan va qaysi tilda topshiriladi?', ru: 'С кем и на каком языке подают заявку?' }
    }}
    vizual={<MiniVaraq yorliq={tr({ uz: 'Ariza qoralamasi', ru: 'Черновик заявки' })} qatorlar={[
      { t: tr(KARTA_NOM.maslahatchi), ajrat: true, kul: tr({ uz: 'uyda, ota-ona bilan', ru: 'дома, с родителями' }) }]} />} />
);

// ===== 🏅 BADGES (nishonlar, 4 — PM: «!» bilan, 9.23) — faqat ish qilingan ekranlarda (S-034) =====
const ACHIEVEMENTS = {
  sourceReader: { icon: '🔎', name: 'Source Reader!', desc: { uz: 'Rasmiy sahifadagi gapni taxmindan ajratdingiz', ru: 'Вы отделили фразу с официальной страницы от догадки' } },
  teamRule: { icon: '🤝', name: 'Team Rule!', desc: { uz: "Jamoa shartini o'z holatingizga qo'lladingiz", ru: 'Вы применили условие о команде к своей ситуации' } },
  programPicked: { icon: '🧭', name: 'Program Picked!', desc: { uz: "Dastur yo'lini va jamoangizni belgiladingiz", ru: 'Вы отметили путь программы и свою команду' } },
  conceptDraft: { icon: '📝', name: 'Concept Draft!', desc: { uz: 'Konsept qoralamasini uch gapga yozdingiz', ru: 'Вы написали черновик концепта в трёх фразах' } }
};
// Ekran id → nishon (faqat ballik test, birinchi urinish). 2-ekran va 7-ekran nishonlari — ekran ichida (xatosiz olti gap · kartalar saqlanganda), AchMissCtx.earn orqali.
const ACH_TRIGGERS = { s3: 'teamRule' };

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
  3: { uz: '1 — Jamoa sharti', ru: '1 — Условие о команде' },
  5: { uz: '2 — Yosh yozilmagan sahifa', ru: '2 — Страница без возраста' },
  8: { uz: 'Yakuniy — ariza qanday topshiriladi', ru: 'Итоговый — как подают заявку' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'dastur', ru: 'программа' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'ariza', ru: 'заявка' }, l: 85, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'shart', ru: 'условие' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'jamoa', ru: 'команда' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'maslahatchi', ru: 'консультант' }, l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'konsept', ru: 'концепт' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'muddat', ru: 'срок' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'pitch', ru: 'питч' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'sahifa', ru: 'страница' }, l: 56, t: 52, s: 20, d: 22, dl: 3.3 },
  { ch: { uz: 'tanlov', ru: 'конкурс' }, l: 90, t: 44, s: 20, d: 24, dl: 2.6 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), to'g'ri javob o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: "Diamond Challenge jamoasida nechta o'quvchi bo'ladi?", ru: 'Сколько учеников в команде Diamond Challenge?' }, opts: [{ uz: '2 tadan 4 tagacha', ru: 'От 2 до 4' }, { uz: '1 tadan 3 tagacha', ru: 'От 1 до 3' }, { uz: '3 tadan 6 tagacha', ru: 'От 3 до 6' }, { uz: '5 tadan 10 tagacha', ru: 'От 5 до 10' }], correct: 0 },
  { q: { uz: "Topshirish kuni jamoa a'zolari necha yoshda bo'ladi?", ru: 'Сколько лет участникам команды в день подачи?' }, opts: [{ uz: '12 yoshdan 16 yoshgacha', ru: 'От 12 до 16 лет' }, { uz: '14 yoshdan 18 yoshgacha', ru: 'От 14 до 18 лет' }, { uz: '16 yoshdan 21 yoshgacha', ru: 'От 16 до 21 года' }, { uz: '18 yoshdan 25 yoshgacha', ru: 'От 18 до 25 лет' }], correct: 1 },
  { q: { uz: "Diamond Challenge'da maslahatchi kamida necha yoshda?", ru: 'Сколько лет как минимум консультанту в Diamond Challenge?' }, opts: [{ uz: '16 yoshdan katta', ru: 'Старше 16 лет' }, { uz: '18 yoshdan katta', ru: 'Старше 18 лет' }, { uz: '21 yoshdan katta', ru: 'Старше 21 года' }, { uz: '25 yoshdan katta', ru: 'Старше 25 лет' }], correct: 2 },
  { q: { uz: "Diamond Challenge'ga ariza qaysi tilda yoziladi?", ru: 'На каком языке пишут заявку в Diamond Challenge?' }, opts: [{ uz: "O'zbek tilida", ru: 'На узбекском' }, { uz: 'Fransuz tilida', ru: 'На французском' }, { uz: 'Istalgan tilda', ru: 'На любом языке' }, { uz: 'Ingliz tilida', ru: 'На английском' }], correct: 3 },
  { q: { uz: 'Ariza bergan har jamoa finalga chiqadimi?', ru: 'Каждая подавшая команда выходит в финал?' }, opts: [{ uz: "Yo'q, finalistlar tanlab olinadi", ru: 'Нет, финалистов отбирают' }, { uz: 'Ha, ariza bergan hamma chiqadi', ru: 'Да, выходят все подавшие' }, { uz: 'Ha, onlayn qatnashganlar chiqadi', ru: 'Да, выходят участники онлайн' }, { uz: "Yo'q, faqat Amerika jamoasi chiqadi", ru: 'Нет, выходит только команда из Америки' }], correct: 0 },
  { q: { uz: 'Y Combinator sahifasida qaysi yosh chegarasi yozilgan?', ru: 'Какой возрастной предел указан на странице Y Combinator?' }, opts: [{ uz: '14 yoshdan', ru: 'С 14 лет' }, { uz: 'Yozilmagan', ru: 'Не указан' }, { uz: '16 yoshdan', ru: 'С 16 лет' }, { uz: '21 yoshdan', ru: 'С 21 года' }], correct: 1 },
  { q: { uz: 'Y Combinator asoschilardan nimani kutadi?', ru: 'Чего Y Combinator ждёт от основателей?' }, opts: [{ uz: "Faqat ta'tilda ishlashni", ru: 'Работать только на каникулах' }, { uz: 'Faqat onlayn ishlashni', ru: 'Работать только онлайн' }, { uz: "To'liq vaqt ishlashni", ru: 'Работать полный день' }, { uz: 'Haftada bir kun kelishni', ru: 'Приходить раз в неделю' }], correct: 2 },
  { q: { uz: "Y Combinator dasturi qayerda o'tadi?", ru: 'Где проходит программа Y Combinator?' }, opts: [{ uz: 'Toshkent shahrida', ru: 'В Ташкенте' }, { uz: 'Istalgan shaharda', ru: 'В любом городе' }, { uz: 'Faqat internetda', ru: 'Только в интернете' }, { uz: 'San-Fransiskoda', ru: 'В Сан-Франциско' }], correct: 3 },
  { q: { uz: 'Early Decision kim uchun?', ru: 'Для кого Early Decision?' }, opts: [{ uz: "O'qishini tugatmoqchi talabalar", ru: 'Студенты, которые хотят окончить учёбу' }, { uz: "14–18 yoshli maktab o'quvchilari", ru: 'Школьники 14–18 лет' }, { uz: 'Diamond Challenge finalistlari', ru: 'Финалисты Diamond Challenge' }, { uz: 'Kompaniyada ishlayotgan kattalar', ru: 'Взрослые, работающие в компании' }], correct: 0 },
  { q: { uz: 'Konsept qaysi uch qismdan iborat?', ru: 'Из каких трёх частей состоит концепт?' }, opts: [{ uz: 'Bozor, Raqamlar va Jamoa', ru: 'Рынок, Цифры и Команда' }, { uz: 'Muammo, kim uchun, yechim', ru: 'Проблема, для кого, решение' }, { uz: 'Yosh, til va maslahatchi', ru: 'Возраст, язык и консультант' }, { uz: 'Muddat, mamlakat va video', ru: 'Срок, страна и видео' }], correct: 1 },
  { q: { uz: "Konseptdagi «Kim uchun» qatoriga nima yoziladi?", ru: 'Что пишут в строку «Для кого» в концепте?' }, opts: [{ uz: 'Guruhdagi odamlarning soni', ru: 'Число людей в группе' }, { uz: 'Mahsulotning texnologiyasi', ru: 'Технологию продукта' }, { uz: 'Mahsulotga muhtoj odamlar', ru: 'Людей, которым нужен продукт' }, { uz: "Jamoa a'zolarining ismlari", ru: 'Имена членов команды' }], correct: 2 },
  { q: { uz: 'Sinfdosh aytgan gap rasmiy sahifada yo\'q. U nima?', ru: 'Фразы одноклассника нет на официальной странице. Что это?' }, opts: [{ uz: 'Rasmiy shart', ru: 'Официальное условие' }, { uz: 'Ariza qismi', ru: 'Часть заявки' }, { uz: 'Muhim qoida', ru: 'Важное правило' }, { uz: 'Faqat taxmin', ru: 'Только догадка' }], correct: 3 }
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

// 🃏 KARTOCHKALAR — 12 (MD 10-ekran; kartochka mexanikasi va ko'rinishi — qolipda: QKartochka, DE-204). Mentorsiz (SABOQ 16). Kartochka 7 — sanalar DASTUR_SHART dan (11-FILTR 22)
const flashKartalar = () => [
  { front: { uz: 'Bu darsda xalqaro dastur deganda nima nazarda tutiladi?', ru: 'Что на этом уроке понимается под международной программой?' }, back: { uz: 'Ariza topshiriladigan va qatnashchilar tanlanadigan xalqaro tanlov yoki dastur', ru: 'Международный конкурс или программа, куда подают заявку и где отбирают участников' } },
  { front: { uz: 'Ariza nima?', ru: 'Что такое заявка?' }, back: { uz: 'Dasturga qatnashish uchun topshiriladigan yozuv va fayllar', ru: 'Текст и файлы, которые подают для участия в программе' } },
  { front: { uz: "Dastur shartini qayerdan o'qiysiz?", ru: 'Где вы читаете условия программы?' }, back: { uz: 'Dasturning rasmiy sahifasidan', ru: 'На официальной странице программы' } },
  { front: { uz: "Diamond Challenge'da jamoa qanday bo'ladi?", ru: 'Какой бывает команда в Diamond Challenge?' }, back: { uz: "2–4 maktab o'quvchisi, topshirish kuni 14–18 yosh", ru: '2–4 школьника, в день подачи 14–18 лет' } },
  { front: { uz: 'Maslahatchi kim?', ru: 'Кто такой консультант?' }, back: { uz: 'Jamoaga yordam beradigan katta yoshli odam', ru: 'Взрослый, который помогает команде' } },
  { front: { uz: "Diamond Challenge'ning birinchi bosqichida nima topshiriladi?", ru: 'Что подают на первом этапе Diamond Challenge?' }, back: { uz: "Ingliz tilida 3–5 betlik yozma g'oya va 60 soniyalik video", ru: 'Письменную идею на 3–5 страниц на английском и 60-секундное видео' } },
  { front: { uz: DASTUR_SHART.diamond.sanalar.yil + '-yil tanlovida topshirish muddati qachon?', ru: 'Когда срок подачи на конкурсе ' + DASTUR_SHART.diamond.sanalar.yil + ' года?' }, back: sanaS('muddat') },
  { front: { uz: 'Sahifada yosh yozilmagani nimani bildiradi?', ru: 'Что значит, что на странице не указан возраст?' }, back: { uz: "Ruxsat ham, taqiq ham emas: qolgan shartlar ham o'qiladi", ru: 'Ни разрешение, ни запрет: читают и остальные условия' } },
  { front: { uz: "Nega Y Combinator maktab o'quvchisi uchun bugungi yo'l emas?", ru: 'Почему Y Combinator — не путь на сегодня для школьника?' }, back: { uz: "Asoschilar dastur davomida va keyin to'liq vaqt ishlaydi, dastur San-Fransiskoda", ru: 'Основатели работают полный день во время программы и после, программа — в Сан-Франциско' } },
  { front: { uz: 'Bu darsda konsept qoralamasi nimani aytadi?', ru: 'О чём говорит черновик концепта на этом уроке?' }, back: { uz: 'Uch narsani: muammo, kim uchun va yechim', ru: 'О трёх вещах: проблема, для кого и решение' } },
  { front: { uz: 'Konsept qoralamasi qayerdan boshlanadi?', ru: 'С чего начинается черновик концепта?' }, back: { uz: "Pitchdan: Muammo va Yechim — boshlang'ich gap, kim uchun — yangi", ru: 'С питча: Проблема и Решение — начальные фразы, «для кого» — новая' } },
  { front: { uz: 'Ariza bersangiz, qabul qilinasizmi?', ru: 'Если подадите заявку, вас примут?' }, back: { uz: "Bunday va'da yo'q: finalistlarni dastur tanlaydi", ru: 'Такого обещания нет: финалистов выбирает программа' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('xd-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={flashKartalar().map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="xd-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + ①②③, ① shartli; alohida .homework.jsx yo'q) =====
const HW_BANDLAR = [
  { uz: "Yozilmagan kartalar qolgan bo'lsa — ularni to'ldiring.", ru: 'Если остались незаполненные карточки — заполните их.' },
  { uz: 'Tanlagan dasturingizning rasmiy sahifasini ota-onangiz bilan oching va shartlarni birga o\'qing (Diamond Challenge — diamondchallenge.org/competition).', ru: 'Откройте с родителями официальную страницу выбранной программы и прочитайте условия вместе (Diamond Challenge — diamondchallenge.org/competition).' },
  { uz: "Diamond Challenge'ni tanlagan va davom ettirmoqchi bo'lsangiz — jamoa va maslahatchi bo'lishi mumkin bo'lgan odamlar bilan gaplashing; ularning ismini hech qayerga yozmang. Boshqa dastur bo'lsa — rasmiy shartini Mentor va ota-onangiz bilan tekshiring.", ru: 'Если выбрали Diamond Challenge и хотите продолжать — поговорите с людьми, которые могут стать командой и консультантом; их имена никуда не пишите. Если программа другая — проверьте её официальные условия вместе с Ментором и родителями.' }
];
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ toliq, keyingi }) => {
  const bandlar = HW_BANDLAR.map((b, i) => ({ b, r: HW_RAQAM[i] })).filter((x, i) => i > 0 || !toliq);
  const karta = [
    { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z arizangiz", ru: 'ваша заявка' } },
    { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: bandlar.length + ' ish', ru: bandlar.length + ' дела' } },
    { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
  ];
  return (
    <div className="card xd-hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="xd-hw-karta">{karta.map((r, i) => <div key={i} className="xd-hw-q"><span className="xd-hw-k">{tr(r.k)}</span><span className="xd-hw-v">{tr(r.v)}</span></div>)}</div>
      <ol className="xd-hw-qadam">{bandlar.map(x => <li key={x.r}><i>{x.r}</i><span>{nomAjrat(tr(x.b))}</span></li>)}</ol>
      <p className="xd-kulrang">{tr({ uz: "Ro'yxatdan o'tish — xohlasangiz, faqat maslahatchi va ota-ona bilan, uyda.", ru: 'Регистрация — если захотите, только с консультантом и родителями, дома.' })}</p>
      {keyingi && <span className="xd-hw-keyingi">{keyingi}</span>}
    </div>
  );
};

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (5 holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50). Belgi ✓ — faqat to'liq holatda.
const SARLAVHA = {
  toliq: { uz: 'Diamond Challenge uchun ariza qoralamasi yozildi.', ru: 'Черновик заявки в Diamond Challenge написан.' },
  aniqEmas: { uz: 'Konsept yozildi: jamoa yoki maslahatchi hali aniq emas.', ru: 'Концепт написан: команда или консультант пока не определены.' },
  boshqa: { uz: 'Konsept yozildi — dastur shartini aniqlash qoldi.', ru: 'Концепт написан — осталось уточнить условия программы.' },
  qisman: (n) => ({ uz: `Ariza qoralamasi hali tugamagan: ${n}${NB}/${NB}6 karta.`, ru: `Черновик заявки ещё не готов: ${n}${NB}/${NB}6 карточек.` }),
  bosh: { uz: 'Ariza qoralamasi hali yozilmagan.', ru: 'Черновик заявки ещё не написан.' }
};
const RECAP = [
  { uz: "Ariza berishdan oldin rasmiy sahifadagi shartlar o'qiladi; sahifada yo'q gap — taxmin.", ru: 'Перед подачей заявки читают условия на официальной странице; фраза, которой там нет, — догадка.' },
  { uz: "Diamond Challenge'da jamoa — 2–4 o'quvchi, topshirish kuni 14–18 yosh; maslahatchi — 21 yoshdan katta.", ru: 'В Diamond Challenge команда — 2–4 ученика, в день подачи 14–18 лет; консультант — старше 21 года.' },
  { uz: "Y Combinator sahifasida yosh yozilmagan, lekin to'liq vaqt kutiladi — bu kursda maktab o'quvchisi uchun bugungi yo'l emas.", ru: 'На странице Y Combinator возраст не указан, но ждут полного дня — на этом курсе для школьника это не путь на сегодня.' },
  { uz: "Bu darsdagi konsept qoralamasi uch narsani aytadi: muammo, kim uchun va yechim; boshlang'ich gaplari pitchdan olinadi.", ru: 'Черновик концепта на этом уроке говорит о трёх вещах: проблема, для кого и решение; начальные фразы берутся из питча.' },
  { uz: "Ariza berish qabul qilinish degani emas; Diamond Challenge'da maslahatchi kerak, bu kursda esa ro'yxat va topshirish ota-ona xabardorligida.", ru: 'Подать заявку — не значит быть принятым; в Diamond Challenge нужен консультант, а на этом курсе регистрация и подача — с ведома родителей.' }
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
  // Holat — o'quvchining saqlangan arizasidan (pm-m12d11-dastur); mentor proyektorida — Mentor misoli (jamoa 1, maslahatchi aniqlanmagan — sarlavha rost)
  const d = isMentorL ? MENTOR_ARIZA : dasturOl();
  const n = isMentorL ? 6 : arizaSoni(d);
  const holat = n === 6
    ? (d.dastur === 'boshqa' ? 'boshqa' : (typeof d.jamoa === 'number' && d.jamoa >= 2 && d.maslahatchi === true ? 'toliq' : 'aniqEmas'))
    : n > 0 ? 'qisman' : 'bosh';
  const sarlavha = holat === 'qisman' ? SARLAVHA.qisman(n) : SARLAVHA[holat];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Keyingi olti oyda nima qilasiz?»</b></>, ru: <>Следующий урок — <b>«Что вы будете делать в ближайшие полгода?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('xd-yakun', holat !== 'toliq' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={nomAjrat(tr(sarlavha))}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard toliq={n === 6} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmProgramsLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 2 va 7-ekran nishonlari (ekran ichida)
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === 14-Modul 11-dars — darsning o'z vizuali (prefiks xd-): Brauzer · Varaq · PitchTasma · ariza kartasi. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .xd-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        .xd-brend { font-weight: 800; font-style: normal; letter-spacing: -0.01em; white-space: nowrap; }
        @keyframes xd-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes xd-sirg { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
        @keyframes xd-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes xd-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes xd-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes xd-yashil { 0% { background: ${T.okFon}; } 100% { background: ${T.paper}; } }
        @keyframes xd-yon { 0% { background: ${fon(T.accent, 0.16)}; } 100% { background: ${fon(T.accent, 0.16)}; } }
        @keyframes xd-silk { 0%, 100% { transform: none; } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
        @keyframes xd-ket { to { opacity: 0; transform: scale(.92); } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .xd-halqa { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: xd-puls 2.2s ease-out .3s 3; }
        /* Tanlov guruhi — har variantning o'z yengil chegarasi, navbatma-navbat 2 marta (E 40) */
        .xd-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: xd-chorla-v 1.8s ease-out .5s 2; }
        .xd-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .xd-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: xd-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .xd-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 6px; padding: 10px 14px; }
        .xd-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        .xd-bash.ix .q-bashorat { padding-top: 8px; padding-bottom: 8px; }
        .xd-br.nomsiz .xd-br-ich { gap: 6px; }
        @media (min-width: 761px) { .xd-k .q-split { grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 28px; } }
        .xd-k, .xd-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .xd-harakat { display: flex; flex-direction: column; gap: 10px; }
        .xd-qadamlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .xd-qadamlar .q-chip i { font-style: normal; font-weight: 800; color: ${T.accent}; margin-right: 7px; }
        .xd-qadamlar .q-chip.ok i { color: ${T.ok}; }
        .xd-qadamlar .q-chip.xd-joriy { animation: xd-puls 2.2s ease-out .3s 3; }
        p.xd-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .q-xulosa .xd-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .xd-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .xd-xq-m { display: block; }
        .q-xulosa .xd-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        /* Brauzer — rasmiy sahifa maketi */
        .xd-br { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; box-shadow: 0 14px 32px -20px rgba(${T.shadowBase},0.4); overflow: hidden; min-width: 0; animation: xd-kir .4s ease-out both; }
        .xd-br-bar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .xd-br-n { display: inline-flex; gap: 5px; flex: none; } .xd-br-n i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .xd-br-url { flex: 1; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 3px 12px; overflow-wrap: anywhere; }
        .xd-br-url.bosh { min-height: 22px; visibility: hidden; }
        .xd-br-ich { padding: 10px 14px 12px; display: flex; flex-direction: column; gap: 6px; }
        .xd-br-bosh { display: flex; flex-direction: column; gap: 2px; }
        .xd-br-bosh .xd-brend { font-size: 18px; }
        .xd-br-izoh { font-size: 13px; color: ${T.ink2}; }
        .xd-br-nomsiz { font-size: 17px; font-weight: 800; color: ${T.ink}; }
        .xd-br-nr { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 10px; }
        .xd-br-til { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 3px 10px; }
        ol.xd-br-q { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
        .xd-brq { display: flex; align-items: baseline; gap: 9px; padding: 4px 9px; border-radius: 9px; font-size: 14px; line-height: 1.4; color: ${T.ink2}; transition: background .3s, color .3s; }
        .xd-brq > i { flex: none; width: 20px; height: 20px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 11.5px; background: ${T.bg}; color: ${T.ink2}; }
        .xd-brq.yon, .xd-brq.savolYon { background: ${fon(T.accent, 0.12)}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.5)}; }
        .xd-brq.yon > i, .xd-brq.savolYon > i { background: ${T.accent}; color: #fff; }
        .xd-brq.ok { color: ${T.ink}; } .xd-brq.ok > i { background: ${T.okFon}; color: ${T.ok}; }
        .xd-brq.kulyon { background: ${T.bg}; color: ${T.ink}; } .xd-brq.kulyon > i { background: ${T.line}; color: ${T.ink}; }
        .xd-brq.savol { color: ${T.ink}; font-weight: 600; } .xd-brq.savol > i { background: ${T.bg}; color: ${T.ink2}; }
        .xd-brq.bar { align-items: center; }
        .xd-bar { display: block; height: 9px; border-radius: 6px; background: ${T.line}; width: 70%; }
        .xd-bar.k { width: 46%; height: 10px; background: ${T.ink2}; opacity: .35; }
        .xd-brq.yon .xd-bar { background: ${fon(T.accent, 0.45)}; } .xd-brq.ok .xd-bar { background: ${fon(T.ink, 0.28)}; }
        .xd-br-tugma { align-self: flex-start; font-size: 13px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 10px; padding: 6px 14px; }
        /* Varaq — oq, soyasiz, katak chiziqlari (E 45); bo'sh uya — uzuq (U-041) */
        .xd-varaq { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 6px; min-width: 0; animation: xd-kir .4s ease-out both; }
        .xd-varaq-h { font-size: 14px; font-weight: 800; color: ${T.paper}; background: ${T.ink}; border-radius: 9px; padding: 6px 12px; }
        .xd-varaq-h .xd-mj { background: ${T.paper}; border-radius: 6px; padding: 0 6px; }
        .xd-vq-ro { display: flex; flex-direction: column; gap: 3px; }
        .xd-vq { min-height: 28px; display: flex; flex-wrap: wrap; align-items: baseline; align-content: center; gap: 0 10px; padding: 3px 11px; border-radius: 9px; font-size: 14px; font-weight: 600; line-height: 1.35; color: ${T.ink}; border: 1px solid ${T.line}; background: ${T.bg}; }
        .xd-vq.bosh { border: 1.5px dashed ${fon(T.ink2, 0.35)}; background: transparent; }
        .xd-vq.yangi { animation: xd-sirg .4s ease-out both, xd-yashil 1.1s ease-out; }
        .xd-vq-kul { font-style: normal; font-size: 12px; font-weight: 500; color: ${T.ink2}; }
        .xd-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 12px; padding: 5px 11px; border-radius: 9px; background: ${T.bg}; font-size: 13px; color: ${T.ink2}; min-height: 34px; }
        .xd-taxmin b { color: ${T.ink2}; font-weight: 800; }
        .xd-taxmin s { text-decoration-color: ${T.err}; text-decoration-thickness: 2px; animation: xd-kir .35s ease-out both; }
        .xd-ikki { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 16px; align-items: start; }
        /* Solishtirish jadvali */
        table.xd-sol { width: 100%; border-collapse: separate; border-spacing: 4px; table-layout: fixed; font-size: 14px; }
        .xd-sol th { text-align: left; font-weight: 800; color: ${T.ink}; padding: 6px 8px; font-size: 13.5px; vertical-align: top; }
        .xd-sol thead th { font-size: 14px; } .xd-sol thead th:first-child { width: 26%; }
        .xd-sol td { padding: 7px 9px; border-radius: 9px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-weight: 600; line-height: 1.35; vertical-align: top; transition: box-shadow .3s; }
        .xd-sol td.bosh { background: transparent; border: 1.5px dashed ${fon(T.ink2, 0.35)}; height: 38px; }
        .xd-sol td.yangi { animation: xd-sirg .4s ease-out both, xd-yashil 1.1s ease-out; }
        .xd-sol td.yashil { animation: xd-sirg .4s ease-out both; background: ${T.okFon}; }
        .xd-sol td.urg { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .xd-sol-bugun th { color: ${T.accent}; }
        .xd-sol-bugun td { background: ${T.accentSoft}; border-color: ${fon(T.accent, 0.35)}; animation: xd-kir .4s ease-out both; }
        .xd-sol-bugun td:last-child { color: ${T.accent}; font-weight: 800; }
        /* Pitch tasmasi */
        .xd-tasma { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .xd-tasma-y { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .xd-tasma-q { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 6px; }
        .xd-tb { display: flex; flex-direction: column; gap: 3px; padding: 7px 9px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; transition: box-shadow .3s, background .3s; }
        .xd-tb b { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .xd-tb span { font-size: 12.5px; line-height: 1.35; color: ${T.ink2}; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .xd-tb.on { background: ${fon(T.accent, 0.1)}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .xd-tb.bosh { border-style: dashed; }
        .xd-tb .xd-bar { width: 80%; }
        .xd-tasma.kichik .xd-tb span { -webkit-line-clamp: 2; }
        .xd-tasma.nomlar .xd-tb { padding: 5px 8px; align-items: center; } .xd-tasma.nomlar .xd-tb b { font-size: 12px; line-height: 1.2; text-align: center; }
        em.xd-son-kul { font-style: normal; color: ${fon(T.ink2, 0.55)}; background: ${T.bg}; border-radius: 4px; padding: 0 3px; }
        /* Kirish maketi */
        .xd-kir { display: flex; flex-direction: column; gap: 6px; }
        .xd-kir .xd-tasma-q { grid-template-columns: repeat(3, minmax(0,1fr)); } .xd-kir .xd-tb span { -webkit-line-clamp: 2; }
        .xd-strelka { align-self: center; width: 2px; height: 22px; border-left: 2px dashed ${fon(T.accent, 0.55)}; position: relative; }
        .xd-strelka::before { content: ''; position: absolute; left: -7px; top: -4px; border: 6px solid transparent; border-bottom: 8px solid ${fon(T.accent, 0.7)}; border-top: 0; }
        /* Reja vizuali */
        .xd-reja { display: flex; flex-direction: column; gap: 10px; }
        .xd-reja-teg { align-self: flex-start; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 4px 12px; }
        .xd-reja-s { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; align-items: start; }
        .xd-varaq.reja .xd-varaq-h { background: ${T.bg}; padding: 9px 12px; }
        .xd-vchiziq { display: block; height: 10px; border-radius: 6px; background: ${T.line}; opacity: 0; transform: translateY(-6px); transition: opacity .35s, transform .35s; }
        .xd-vchiziq.bor { opacity: 1; transform: none; }
        .xd-vchiziq:nth-child(3) { width: 82%; } .xd-vchiziq:nth-child(4) { width: 64%; }
        .xd-reja-slot { display: flex; gap: 6px; margin-top: 4px; }
        .xd-rslot { flex: 1; height: 26px; border-radius: 8px; border: 1.5px dashed ${fon(T.ink2, 0.35)}; }
        .xd-rslot.bor { border: 1px solid ${fon(T.accent, 0.4)}; background: ${T.accentSoft}; animation: xd-yashil 1s ease-out; }
        /* Ko'rinib uchadigan nusxa (SABOQ P3) */
        .xd-uchar { position: fixed; z-index: 1300; pointer-events: none; display: flex; flex-direction: column; gap: 2px; padding: 9px 13px; border-radius: 12px; background: ${T.paper}; border: 2px solid ${T.ok}; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; font-size: 14px; font-weight: 600; line-height: 1.35; color: ${T.ink}; transform-origin: left center; transition: transform .6s cubic-bezier(.45,.05,.3,1); }
        .xd-uchar.yoq { border-color: ${T.ink2}; color: ${T.ink2}; }
        .xd-uchar.bar { width: 80px !important; padding: 7px; } .xd-uchar.bar .xd-bar { width: 100%; background: ${fon(T.accent, 0.5)}; }
        .xd-uchar.gap, .xd-uchar.karta { border-color: ${T.accent}; }
        .xd-uchar.karta b { font-size: 12.5px; color: ${T.accent}; }
        .xd-uchar span { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        /* 2-ekran: eshitilgan gap kartasi */
        .xd-gap { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 12px 16px; border-radius: 14px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 28px -18px ${fon(T.accent, 0.7)}; animation: xd-kir .35s ease-out both; }
        .xd-gap.qulf { border-color: ${T.line}; box-shadow: none; opacity: .75; }
        .xd-gap.err { background: ${T.errFon}; }
        .xd-gap.ketdi { animation: xd-ket .3s ease-in .25s both; }
        .xd-gap-y { flex-basis: 100%; font-size: 12px; font-weight: 800; color: ${T.accent}; text-transform: uppercase; letter-spacing: .04em; }
        p.xd-gap-t { margin: 0; flex: 1 1 300px; font-size: 16px; font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .xd-gap-tug { display: flex; gap: 8px; flex-wrap: wrap; }
        button.xd-gap-b { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; padding: 9px 16px; border-radius: 11px; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${fon(T.accent, 0.45)}; }
        button.xd-gap-b:hover:not(:disabled) { background: ${T.accentSoft}; }
        button.xd-gap-b:disabled { opacity: .5; cursor: default; }
        button.xd-gap-b.chorla { animation: xd-chorla 1.8s ease-out .4s 2; } button.xd-gap-b.chorla + button.xd-gap-b.chorla { animation-delay: .75s; }
        button.xd-gap-b.silk { border-color: ${T.err}; animation: xd-silk .4s ease-out; }
        /* 6-ekran: konsept varag'i va tasma */
        .xd-kons { display: flex; flex-direction: column; gap: 12px; }
        .xd-av-kh { font-size: 12px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
        .xd-av-q, .xd-av-s, .xd-av-d { display: flex; align-items: baseline; gap: 10px; padding: 4px 11px; border-radius: 9px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 15px; line-height: 1.4; color: ${T.ink}; min-height: 31px; }
        .xd-av-q > b, .xd-av-s > b, .xd-av-d > b { flex: none; min-width: 92px; font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .xd-av-q > span, .xd-av-s > span, .xd-av-d > span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .xd-av-q.bosh, .xd-av-s.bosh, .xd-av-d.bosh { border: 1.5px dashed ${fon(T.ink2, 0.35)}; background: transparent; }
        .xd-av-q.bosh > b, .xd-av-s.bosh > b, .xd-av-d.bosh > b { color: ${T.ink2}; }
        .xd-av-q.yangi, .xd-av-s.yangi, .xd-av-d.yangi { animation: xd-sirg .4s ease-out both, xd-yashil 1.1s ease-out; }
        .xd-av-sh { display: flex; flex-direction: column; gap: 4px; }
        .xd-av-s > em { flex: none; font-style: normal; font-size: 12px; color: ${T.ink2}; }
        .xd-belgi { flex: none; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 13px; background: ${T.paper}; color: ${T.ink2}; border: 1px solid ${T.line}; align-self: center; }
        .xd-belgi.ok { background: ${T.ok}; color: #fff; border-color: ${T.ok}; } .xd-belgi.x { background: ${T.err}; color: #fff; border-color: ${T.err}; }
        p.xd-av-kul { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        button.xd-tahrir { flex: none; align-self: center; border: none; background: transparent; color: ${T.accent}; font-size: 15px; cursor: pointer; padding: 0 2px; }
        /* 7-ekran: ariza kartasi (bittadan, E 53; yorliq input ichida, E 43) */
        .q-mustaqil:has(.xd-ish), .q-mustaqil:has(.xd-fokus) { max-width: none; }
        .xd-ish { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); gap: 18px; align-items: start; }
        .xd-ish-chap { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .xd-ish-ong { position: sticky; top: 0; min-width: 0; }
        .xd-fokus { display: flex; flex-direction: column; gap: 12px; }
        .xd-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .xd-strip-y { font-size: 12px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 11px; margin-right: 4px; white-space: nowrap; }
        .xd-strip .q-chip.xd-tab { padding: 6px 10px; font-size: 12.5px; }
        .xd-strip .q-chip.xd-tab i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .xd-strip .q-chip.xd-tab.ok i { color: ${T.ok}; }
        .xd-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; animation: xd-kir .4s ease-out both; }
        .xd-karta.uch { animation: xd-ket .3s ease-in .2s both; }
        .xd-karta.err { box-shadow: inset 0 0 0 1.5px ${T.err}, 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .xd-karta-h { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        .xd-vars { display: flex; flex-wrap: wrap; gap: 8px; }
        button.xd-var { display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope', sans-serif; font-size: 14.5px; font-weight: 600; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.35)}; border-radius: 12px; padding: 9px 14px; cursor: pointer; text-align: left; }
        button.xd-var:hover { background: ${T.accentSoft}; }
        button.xd-var.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .xd-vars.kutish button.xd-var { animation: xd-chorla 1.8s ease-out .5s 2; }
        .xd-vars.kutish button.xd-var:nth-child(2) { animation-delay: .75s; } .xd-vars.kutish button.xd-var:nth-child(3) { animation-delay: 1s; } .xd-vars.kutish button.xd-var:nth-child(4) { animation-delay: 1.25s; } .xd-vars.kutish button.xd-var:nth-child(5) { animation-delay: 1.5s; }
        .xd-maydon { position: relative; }
        .xd-maydon-n { position: absolute; left: 12px; top: 11px; width: 22px; height: 22px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        textarea.xd-inp { display: block; width: 100%; resize: vertical; min-height: 96px; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 11px 14px 26px 44px; outline: none; }
        textarea.xd-inp:focus { border-color: ${T.accent}; }
        textarea.xd-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .xd-maydon.chorla textarea.xd-inp { border-color: ${fon(T.accent, 0.6)}; animation: xd-chorla 1.8s ease-out .4s 2; }
        .xd-sanoq-b { position: absolute; right: 12px; bottom: 9px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .xd-sanoq-b.oshdi { color: ${T.err}; font-weight: 800; }
        p.xd-kulrang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.xd-yana { margin: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .xd-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; }
        .xd-yordam p { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .xd-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .xd-karta-tug .xd-o { margin-left: auto; }
        /* Testlardan keyingi kichik vizual */
        .xd-mini { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .xd-mini-y { font-size: 12px; font-weight: 800; color: ${T.ink2}; margin-right: 4px; }
        .xd-mini-q { display: inline-flex; align-items: baseline; gap: 8px; padding: 5px 10px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; font-size: 13.5px; font-weight: 600; color: ${T.ink}; animation: xd-kir .3s ease-out both; }
        .xd-mini-q.ajrat { border-color: ${T.accent}; background: ${fon(T.accent, 0.1)}; }
        .xd-mini-q em { font-style: normal; font-size: 12.5px; font-weight: 500; color: ${T.ink2}; }
        /* Kartochka (SABOQ P10): orqa yuz — neytral to'q, birinchi bosishgacha yengil halqa va ipucha (E 49) */
        .xd-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: xd-puls 1.8s ease-out .4s 3; }
        .xd-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .xd-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.xd-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.xd-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun: ✓ faqat to'liq holatda; uyga vazifa kartasi */
        .xd-yakun.belgisiz .done-chip .tick { display: none; }
        .xd-hw { display: flex; flex-direction: column; gap: 12px; }
        .xd-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .xd-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .xd-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .xd-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.xd-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .xd-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .xd-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .xd-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 760px) {
          .xd-ikki, .xd-reja-s, .xd-ish { grid-template-columns: minmax(0,1fr); }
          .xd-ish-ong { order: -1; position: static; }
          .xd-tasma-q { grid-template-columns: repeat(3, minmax(0,1fr)); }
          .xd-hw-karta { grid-template-columns: 1fr; }
          .xd-av-q > b, .xd-av-s > b, .xd-av-d > b { min-width: 76px; }
          table.xd-sol { font-size: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .xd-halqa, .xd-k.kutish .q-variant, .q-bashorat .q-chip, .xd-qadamlar .q-chip, .xd-br, .xd-varaq, .xd-vq, .xd-taxmin s, .xd-sol td, .xd-gap, button.xd-gap-b,
          .xd-av-q, .xd-av-s, .xd-av-d, .xd-karta, button.xd-var, textarea.xd-inp, .xd-mini-q, .xd-flash .fc-front, .xd-rslot, .xd-vchiziq, .xd-uchar { animation: none !important; transition: none !important; }
        }
        .xd-test-viz { margin-top: 2px; }
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
        @media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }
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
