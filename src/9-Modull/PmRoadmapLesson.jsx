import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (LMS) · 6-dars (PM) «Bitiruvgacha nimani qachon qurasiz?» — kalit m9-06, lessonId pm-m9d6-v1.
// MD v3 (manba-haqiqat): feedback/F-1005-11modul/06-PmRoadmap-v3.md (GATE M) · Filtr: 06-FILTR.md · skelet: src/skelet/NamunaDars.jsx (konveyer 04.10).
// Infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletdan, tegilmagan; ekranlar — qolip turlaridan (src/qolip).
// Saqlanadi: pm-m9d6-roadmap (11, 12, 14, 15-darslar o'qiydi) · pm-m9d6-code. O'qiydi: pm-m9d5-prd, pm-m9d2-rice, pm-m9d1-goyalar — kalit yo'q bo'lsa ham ekran ishlaydi.
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
// Kod oynasi (11-ekran) — umumiy kompilyator moduli
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

const LESSON_META = { lessonId: 'pm-m9d6-v1', lessonTitle: { uz: "Bitiruvgacha nimani qachon qurasiz?", ru: 'Что и когда вы построите до выпуска?' } };
// 16 ekran (MD v3): kirish → reja → RICE tartibi → test → uch ufq → test → Uzum → test → o'z ishlariga RICE → juftlik → uch ufqqa joylash → kod → yakuniy test → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'roadmap', ru: 'roadmap' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'ufq', ru: 'горизонт' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'RICE', ru: 'RICE' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'funksiya', ru: 'функция' }, l: 78, tp: 68, s: 13, d: 6.8 }
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
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'koding',      template: 'custom',   scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Ishtirok-kalitlar (-1): 8, 9, 10, 11-ekran signallari (500+ zona), maxrajga kirmaydi.
// ✔ o'rni MD dagidek: s3 — B · s5 — C · s7 — D · s12 — A (yangi dars, birinchi marta belgilangan).
const INLINE_KEYS = { s3: 1, s5: 2, s7: 3, s12: 0, ishlar: -1, juftlik: -1, roadmap: -1, koding: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rnida raqam (S-026)
const RECAPS = {
  3: { title: { uz: "Qamrov teng bo'lsa", ru: "Если охват одинаковый" }, cards: [
    { ic: '1', h: { uz: "RICE: qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz.", ru: 'RICE: охват умножаете на влияние и уверенность и делите на усилия.' } },
    { ic: '2', h: { uz: 'Mentor misolida uch funksiyaning qamrovi — 60.', ru: 'В примере Ментора охват трёх функций — 60.' } },
    { ic: '3', h: { uz: "Qamrov teng bo'lsa, tartibni ta'sir, ishonch va mehnat ajratadi.", ru: "Если охват одинаковый, порядок определяют влияние, уверенность и усилия." }, ask: { uz: "Sizning funksiyalaringizda qaysi bo'lak eng ko'p farq qiladi?", ru: 'Какая часть больше всего различается у ваших функций?' } }
  ] },
  5: { title: { uz: 'Kutadigan ish', ru: 'Работа, которая ждёт' }, cards: [
    { ic: '1', h: { uz: "Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi.", ru: "Горизонт — отрезок времени, куда работы попадают по тому, когда они начинаются." } },
    { ic: '2', h: { uz: "RICE tartibni ko'rsatadi, ish esa unga kerak narsa tayyor bo'lganda boshlanadi.", ru: 'RICE показывает порядок, а работа начинается, когда готово нужное ей.' } },
    { ic: '3', h: { uz: "Eslatma va o'zi yangilanadigan ro'yxat 12-Modulni kutadi — ular «Keyinroq»da.", ru: "Напоминание и автообновление списка ждут 12-й модуль — они в «Позже»." }, ask: { uz: "Roadmap'ingizdagi qaysi ish nimanidir kutadi?", ru: 'Какая работа в вашем roadmap чего-то ждёт?' } }
  ] },
  7: { title: { uz: 'Uzum va poydevor', ru: 'Uzum и фундамент' }, cards: [
    { ic: '1', h: { uz: 'Uzum 2022-yil oktabrda saytdan emas, yetkazib berishdan boshlagan.', ru: 'Uzum в октябре 2022 года начал не с сайта, а с доставки.' } },
    { ic: '2', h: { uz: "Mashina va topshirish punkti ekranda yo'q, lekin buyurtma ular orqali yetib keladi.", ru: 'Машины и пункта выдачи нет на экране, но заказ приходит через них.' } },
    { ic: '3', h: { uz: 'Mentor rejasida «Hozir» poydevordan boshlanadi: busiz hech bir funksiya ishlamaydi.', ru: 'В плане Ментора «Сейчас» начинается с фундамента: без него ни одна функция не работает.' }, ask: { uz: "Sizning mahsulotingizda ekranda ko'rinmaydigan qaysi qism kerak?", ru: 'Какая невидимая на экране часть нужна вашему продукту?' } }
  ] },
  12: { title: { uz: 'PRD va roadmap', ru: 'PRD и roadmap' }, cards: [
    { ic: '1', h: { uz: "Bu modulda «Hozir»ga uchta funksiya sig'adi: 11-Modulda uchta loyiha kuni.", ru: 'В этом модуле в «Сейчас» помещаются три функции: в 11-м модуле три проектных дня.' } },
    { ic: '2', h: { uz: '«Hozir»dagi uchta funksiya PRD dan keladi.', ru: 'Три функции в «Сейчас» приходят из PRD.' } },
    { ic: '3', h: { uz: "Yangi ish yuqori chiqsa — avval PRD qayta ko'riladi, so'ng roadmap.", ru: 'Если новая работа вышла выше — сначала пересматривают PRD, потом roadmap.' }, ask: { uz: "Roadmap'ingizga yangi ish qo'shilsa, PRD ning qaysi bo'limi o'zgaradi?", ru: 'Если в ваш roadmap добавится новая работа, какой раздел PRD изменится?' } }
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
  return <div ref={ref} className="rm-test-viz fade-step">{children}</div>;
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 6-dars «Bitiruvgacha nimani qachon qurasiz?» (MD v3: feedback/F-1005-11modul/06-PmRoadmap-v3.md, GATE M) =====
// Bitta vizual (163/180) — RoadmapDoska: IshKarta (to'liq · ixcham · ustunda) + FormulaKarta + UfqDoska; bitta manba — MENTOR_ISHLAR va o'quvchi ishlari.
// Telefon maketi MaydonTelefon (2-ekran) va Uzum sahnasi (6-ekran) — chizilgan, logotipsiz. Bosiladigan maket klasslari:
// qolip-maket: rm-ish-b rm-dk-b rm-ust-b rm-tuz-b
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => {
  const g = useContext(LiveGateCtx) || {};
  const live = g.live;
  return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') };
};
// 40 s harakatsizlikdan keyin bitta ipucha (javobni aytmaydi); kalit o'zgarsa sanoq yangidan
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
// Son sanab o'sadi (SABOQ 19): maqsadga 8 qadamda yetadi; kam harakat rejimida — birdan
const useSanoq = (son, ms = 45) => {
  const [k, setK] = useState(son);
  useEffect(() => {
    if (k === son) return undefined;
    if (kamHarakat()) { setK(son); return undefined; }
    const q = Math.max(1, Math.ceil(Math.abs(son - k) / 8));
    const t = setTimeout(() => setK(v => (son > v ? Math.min(son, v + q) : Math.max(son, v - q))), ms);
    return () => clearTimeout(t);
  }, [k, son, ms]);
  return k;
};
// Uchish (SABOQ 19): element eski joyidan yangi joyiga suriladi (FLIP). .lesson-root zoom'i hisobga olinadi.
const uchir = (r, el, ms = 560) => {
  if (!r || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !r.width) return;
  const z = (el.offsetWidth || g.width) / g.width;
  const dx = ((r.left + r.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((r.top + r.height / 2) - (g.top + g.height / 2)) * z;
  const sk = Math.min(2.4, Math.max(0.4, r.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sk})`, opacity: 0.8 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const navbat = useRef([]);
  useLayoutEffect(() => {
    if (!navbat.current.length) return;
    const q = navbat.current; navbat.current = [];
    q.forEach(u => uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback((el, k, ms) => {
    const r = el && (el.getBoundingClientRect ? el.getBoundingClientRect() : el);
    if (r) navbat.current.push({ r, k, ms });
  }, []);
};
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="rm-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="rm-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="rm-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
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
    <div className="rm-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('rm-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="rm-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
// Mentor statistikasi (8, 9, 10-ekran): o'quvchilar yuborgan ishtirok-signali (500+ zona) bo'yicha ikki son
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
  return <div className="rm-mstat fade-up">{yorliqlar.map((y, i) => <div key={i} className="rm-mstat-q"><b>{sonlar[i]}</b><span>{tr(y)}</span></div>)}</div>;
};
const halqa = (on) => (on ? 'rm-halqa' : undefined);

// ----- Sonlar: o'zbekcha va ruscha yozuvda o'nlik — vergul (0,5); ishonch — foiz -----
const sonT = (x) => (x === null || x === undefined || x === '' || Number.isNaN(Number(x)) ? '' : String(Math.round(Number(x) * 100) / 100).replace('.', ','));
const foizT = (x) => `${Math.round(Number(x) * 100)}%`;
const riceHisob = (q, t, i, m) => (Number(m) > 0 ? Math.round(((Number(q) * Number(t) * Number(i)) / Number(m)) * 100) / 100 : 0);
const sonOl = (s) => { const v = parseFloat(String(s).replace(',', '.')); return Number.isFinite(v) ? v : NaN; };

// ----- Mentor misoli — tayanch 1.5 jadvali aynan (KOD 3). rice — formula bilan solishtiriladi (72 · 60 · 48 · 15 · 10 · 5) -----
const MENTOR_ISHLAR = [
  { id: 'elon', nom: { uz: "O'yin e'loni va qo'shilish", ru: 'Объявление об игре и присоеди\u00ADнение' }, qamrov: 60, tasir: 3, ishonch: 0.8, mehnat: 2, rice: 72, ufq: 'hozir', turi: 'asosiy', telefon: 'elon',
    sabab: { uz: 'Tartibda birinchi: poydevordan keyin boshlanadi.', ru: 'Первая по порядку: начинается после фундамента.' } },
  { id: 'tasdiq', nom: { uz: "O'yin kuni tasdiq", ru: 'Подтвер\u00ADждение в день игры' }, qamrov: 60, tasir: 2, ishonch: 0.5, mehnat: 1, rice: 60, ufq: 'hozir', turi: 'asosiy', telefon: 'tasdiq',
    sabab: { uz: "Qo'shilganlarga tayanadi: ular birinchi funksiyada paydo bo'ladi.", ru: 'Опирается на присоединившихся: они появляются в первой функции.' } },
  { id: 'navbat', nom: { uz: 'Chiqish va navbat', ru: 'Выход и очередь' }, qamrov: 60, tasir: 1, ishonch: 0.8, mehnat: 1, rice: 48, ufq: 'hozir', turi: 'asosiy', telefon: 'navbat',
    sabab: { uz: '11-Modulda funksiya uchun uchta loyiha kuni bor.', ru: 'В 11-м модуле на функции есть три проектных дня.' } },
  { id: 'eslatma', nom: { uz: "O'yindan oldin eslatma", ru: 'Напоминание перед игрой' }, qamrov: 60, tasir: 1, ishonch: 0.5, mehnat: 2, rice: 15, ufq: 'keyinroq', turi: 'keyin', kutadi: '12-Modul', telefon: 'eslatma',
    sabab: { uz: "Kutadi: telefonga eslatma yuborish — 12-Modul ishi.", ru: 'Ждёт: отправка напоминания на телефон — работа 12-го модуля.' } },
  { id: 'royxat', nom: { uz: "Ro'yxat o'zi yangilanadi", ru: 'Список обновляется сам' }, qamrov: 60, tasir: 1, ishonch: 0.5, mehnat: 3, rice: 10, ufq: 'keyinroq', turi: 'keyin', kutadi: '12-Modul', telefon: 'jonli',
    sabab: { uz: "Kutadi: ro'yxat o'zi yangilanishi — 12-Modul ishi.", ru: "Ждёт: автообновление списка — работа 12-го модуля." } },
  { id: 'pul', nom: { uz: "Maydon pulini bo'lishish", ru: 'Делить плату за поле' }, qamrov: 30, tasir: 1, ishonch: 0.5, mehnat: 3, rice: 5, ufq: 'uzoqroq', turi: 'keyin', telefon: 'pul',
    sabab: { uz: "Muammo gapidan kelmaydi: bitiruvgacha ishlar jamoa yig'ishga qaratilgan.", ru: "Не следует из формулировки проблемы: до выпуска все работы — про сбор команды." } }
];
MENTOR_ISHLAR.forEach(x => { if (riceHisob(x.qamrov, x.tasir, x.ishonch, x.mehnat) !== x.rice && typeof console !== 'undefined') console.warn('[m9-06] RICE mos emas:', ou(x.nom)); });
const MENTOR_TARTIB = MENTOR_ISHLAR.slice().sort((a, b) => b.rice - a.rice);
const UFQLAR = [
  { id: 'hozir', nom: { uz: 'Hozir', ru: 'Сейчас' }, izoh: { uz: '11-Modul', ru: '11-й модуль' } },
  { id: 'keyinroq', nom: { uz: 'Keyinroq', ru: 'Позже' }, izoh: { uz: '12–13-Modul', ru: '12–13-й модуль' } },
  { id: 'uzoqroq', nom: { uz: 'Uzoqroq', ru: 'Дальше' }, izoh: { uz: 'bitiruvdan keyin', ru: 'после выпуска' } }
];
const UFQ_I = { hozir: 0, keyinroq: 1, uzoqroq: 2 };
const SLOT = [{ uz: '1-asosiy funksiya', ru: '1-я основная функция' }, { uz: '2-asosiy funksiya', ru: '2-я основная функция' }, { uz: '3-asosiy funksiya', ru: '3-я основная функция' }];
const TURI = { asosiy: { uz: 'asosiy funksiya', ru: 'основная функция' }, keyin: { uz: '«Keyin» qutisidan', ru: "коробка «Потом»" } };
const BOLAK = [
  { k: 'qamrov', t: { uz: 'qamrov', ru: 'охват' } }, { k: 'tasir', t: { uz: "ta'sir", ru: 'влияние' } },
  { k: 'ishonch', t: { uz: 'ishonch', ru: "увер." } }, { k: 'mehnat', t: { uz: 'mehnat', ru: 'усилия' } }
];
const bolakT = (k, v) => (v === null || v === undefined || v === '' ? '' : k === 'ishonch' ? foizT(v) : sonT(v));
const nomT = (ish) => (typeof ish.nom === 'string' ? ish.nom : tr(ish.nom));
const POYDEVOR_T = { uz: 'Poydevor', ru: 'Фундамент' };
const RICEGA_KIRMAYDI = { uz: 'RICE ga kirmaydi', ru: 'не входит в RICE' };
const Uzum = () => <span className="rm-uzum">Uzum</span>;
const MJ = () => <span className="rm-mj">Maydon Jamoa</span>;

// ----- IshKarta — bitta ish, uch ko'rinish (KOD 2): toliq (to'rt katak + RICE) · ixcham (raqam · nom · RICE · o'ng) · ustunda (nom · RICE) -----
const IshKarta = ({ ish, kor = 'toliq', n, rice, ajrat, kul, onBos, faol, yangi, uch, ong, yorliqsiz, className, style }) => {
  const r = rice !== undefined ? rice : ish.rice;
  const bos = typeof onBos === 'function';
  const Tag = bos ? 'button' : 'div';
  const umum = { className: cxx('rm-ish', kor, bos && 'rm-ish-b', faol && 'rm-halqa', yangi && 'yangi', className), 'data-uch': uch, style, onClick: bos ? onBos : undefined, ...(bos ? { type: 'button' } : {}) };
  if (kor === 'ustunda') return <Tag {...umum}><span className="rm-ish-nom">{nomT(ish)}</span>{r !== null && r !== undefined && <b className="rm-ish-r">{sonT(r)}</b>}</Tag>;
  if (kor === 'ixcham') return (
    <Tag {...umum}>
      {n !== undefined && <span className="rm-ish-n">{n}</span>}
      <span className="rm-ish-nom">{nomT(ish)}</span>
      {r !== null && r !== undefined && <b className="rm-ish-r">{sonT(r)}</b>}
      {ong}
    </Tag>
  );
  return (
    <Tag {...umum}>
      <span className="rm-ish-bosh"><span className="rm-ish-nom">{nomT(ish)}</span>{!yorliqsiz && ish.turi && <span className="rm-kul">{tr(TURI[ish.turi])}</span>}</span>
      <span className="rm-ish-kat">
        {BOLAK.map(b => <span key={b.k} className={cxx('rm-kat', ajrat && ajrat.includes(b.k) && 'ajrat', kul && kul.includes(b.k) && 'kulr')}><i>{tr(b.t)}</i><b>{bolakT(b.k, ish[b.k])}</b></span>)}
        <span className={cxx('rm-kat rice', (r === null || r === undefined) && 'bosh')}><i>RICE</i><b>{r === null || r === undefined ? '' : sonT(r)}</b></span>
      </span>
    </Tag>
  );
};

// ----- FormulaKarta (2, 8-ekran): «qamrov × ta'sir × ishonch ÷ mehnat = RICE»; sonlar joyiga uchib kiradi, RICE sanab o'sadi (formula belgisi faqat shu kartada — T-035) -----
const FormulaKarta = ({ ish, k, yorliq, kichik }) => {
  const toliq = !!(ish && BOLAK.every(b => ish[b.k] !== null && ish[b.k] !== undefined && ish[b.k] !== ''));
  const maqsad = toliq ? riceHisob(ish.qamrov, ish.tasir, ish.ishonch, ish.mehnat) : 0;
  const r = useSanoq(maqsad);
  return (
    <div className={cxx('rm-formula', kichik && 'kichik')}>
      {yorliq && <span className="rm-kul">{yorliq}</span>}
      <div className="rm-f-q">
        {BOLAK.map((b, i) => {
          const v = ish ? bolakT(b.k, ish[b.k]) : '';
          return (
            <React.Fragment key={b.k}>
              {i > 0 && <span className="rm-f-b">{i === 3 ? '÷' : '×'}</span>}
              <span className={cxx('rm-f-s', !v && 'bosh')}><b key={`${k}-${b.k}-${v}`} className={v ? 'kirdi' : undefined} style={{ animationDelay: `${i * 0.09}s` }}>{v}</b><i>{tr(b.t)}</i></span>
            </React.Fragment>
          );
        })}
        <span className="rm-f-b">=</span>
        <span className={cxx('rm-f-s rice', !toliq && 'bosh')}><b>{toliq ? sonT(r) : ''}</b><i>RICE</i></span>
      </div>
    </div>
  );
};

// ----- UfqDoska (4, 5, 7, 10, 12-ekran): yo'l chizig'i, uch zona; «Hozir»da Poydevor bloki va uch katak «1/2/3-asosiy funksiya» (P-056) -----
// hozir: [ish] (≤3, tartib bilan) · keyinroq/uzoqroq: [ish] · ish — { key, nom, rice, uch? }
const UfqDoska = ({ hozir = [], keyinroq = [], uzoqroq = [], yangi, sabab, poydevorOn, roadmap, kichik, keng, faqatHozir, ajratZona, bog, onBos, onAlmash }) => {
  const zonalar = faqatHozir ? UFQLAR.slice(0, 1) : UFQLAR;
  const ichi = { keyinroq, uzoqroq };
  return (
    <div className={cxx('rm-doska', kichik && 'kichik', keng && 'keng', faqatHozir && 'yakka')}>
      {roadmap && <span className="rm-roadmap-y fade-step">roadmap</span>}
      <div className="rm-zonalar">
        {zonalar.map(u => (
          <div key={u.id} className={cxx('rm-zona', u.id, ajratZona === u.id && 'on')}>
            <span className="rm-zona-h"><b>{tr(u.nom)}</b><span>{tr(u.izoh)}</span></span>
            {u.id === 'hozir' ? <>
              <div className={cxx('rm-poydevor', poydevorOn && 'on', bog && 'bog')}><b>{tr(POYDEVOR_T)}</b><span>{tr(RICEGA_KIRMAYDI)}</span></div>
              {[0, 1, 2].map(s => {
                const x = hozir[s];
                return (
                  <div key={s} className={cxx('rm-slot', x ? 'tola' : 'bosh', bog && 'bog')}>
                    <span className="rm-slot-y">{tr(SLOT[s])}</span>
                    {x && <div className="rm-slot-k">
                      <IshKarta ish={x} kor="ustunda" yangi={yangi === x.key} uch={x.uch} onBos={onBos ? () => onBos(x) : undefined} />
                      {onAlmash && hozir.length > 1 && <span className="rm-almash">
                        <QChip disabled={s === 0} aria-label="↑" onClick={() => onAlmash(s, s - 1)}>↑</QChip>
                        <QChip disabled={s === hozir.length - 1} aria-label="↓" onClick={() => onAlmash(s, s + 1)}>↓</QChip>
                      </span>}
                    </div>}
                  </div>
                );
              })}
            </> : ichi[u.id].map(x => <IshKarta key={x.key} ish={x} kor="ustunda" yangi={yangi === x.key} uch={x.uch} onBos={onBos ? () => onBos(x) : undefined} />)}
          </div>
        ))}
      </div>
      {!faqatHozir && <div className="rm-yol" aria-hidden="true"><i /><i /><i /></div>}
      {sabab && <p className="rm-sabab" key={sabab.k}>{sabab.t}</p>}
    </div>
  );
};
// Mentor doskasi — MENTOR_ISHLAR dan (4, 5, 10-ekran mentor rejimi, 7)
const mentorJoy = (soni = 6) => {
  const joy = { hozir: [], keyinroq: [], uzoqroq: [] };
  MENTOR_TARTIB.slice(0, soni).forEach(x => joy[x.ufq].push({ ...x, key: x.id, uch: 'mj-' + x.id }));
  return joy;
};

// ----- MaydonTelefon (2-ekran, chapda, ≈170×272 — SABOQ 22): bosilgan ish ilovada qanday ko'rinadi; nom o'z rangida, yorliq «chizma — hali qurilmagan» -----
const TelKarta = ({ son, kerak = 10, tugma, ok, katta }) => (
  <div className={cxx('rm-tk', katta && 'katta')}>
    <span className="rm-tk-t"><b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b><span>{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span></span>
    <b className="rm-tk-son" key={son}>{son} / {kerak}</b>
    {tugma && <span className={cxx('rm-tk-tg', ok && 'ok')}>{tugma}</span>}
  </div>
);
const MaydonTelefon = ({ holat = 'boshi', k = 0 }) => {
  const [oldi, setOldi] = useState(false);
  useEffect(() => {
    setOldi(false);
    if (holat !== 'elon' && holat !== 'jonli') return undefined;
    const t = setTimeout(() => setOldi(true), kamHarakat() ? 0 : 950);
    return () => clearTimeout(t);
  }, [holat, k]);
  const qosh = tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' });
  let ekran;
  if (holat === 'elon') ekran = <><span className="rm-te-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><TelKarta katta son={oldi ? 9 : 8} tugma={oldi ? tr({ uz: "Qo'shildingiz", ru: 'Вы присоединились' }) : qosh} ok={oldi} />{!oldi && <i className="rm-barmoq" aria-hidden="true" />}</>;
  else if (holat === 'tasdiq') ekran = <><span className="rm-te-h">{tr({ uz: 'Shanba, 18:00 · Mahalla maydoni', ru: 'Суббота, 18:00 · Площадка махалли' })}</span><span className="rm-te-doira">{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < 3 ? 'ok' : ''} />)}</span><span className="rm-tk-tg">{tr({ uz: 'Kelaman', ru: 'Приду' })}</span><span className="rm-te-q">{tr({ uz: 'Kelishini tasdiqladi: 7 / 9', ru: 'Подтвердили: 7 / 9' })}</span></>;
  else if (holat === 'navbat') ekran = <><span className="rm-te-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><div className="rm-tk katta"><span className="rm-tk-t"><b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b><span>{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span></span><b className="rm-tk-son tola">{tr({ uz: "10 / 10 · O'yin to'ldi", ru: '10 / 10 · Игра заполнена' })}</b><span className="rm-tk-tg">{tr({ uz: 'Navbatga yozilish', ru: 'Записаться в очередь' })}</span></div></>;
  else if (holat === 'eslatma') ekran = <div className="rm-te-qulf"><span className="rm-qulf" aria-hidden="true"><i /></span><div className="rm-bild"><b>Maydon Jamoa</b><span>{tr({ uz: 'Bugun, 18:00 · Mahalla maydoni', ru: 'Сегодня, 18:00 · Площадка махалли' })}</span></div></div>;
  else if (holat === 'jonli') ekran = <><span className="rm-te-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><TelKarta katta son={oldi ? 9 : 8} />{oldi && <span className="rm-te-q fade-step">{tr({ uz: "ekran ochiq — son o'zi yangilandi", ru: 'экран открыт — число обновилось само' })}</span>}</>;
  else if (holat === 'pul') ekran = <><span className="rm-te-h">{tr({ uz: "Kim to'ladi", ru: 'Кто заплатил' })}</span><span className="rm-te-pul">{[0, 1, 2, 3].map(i => <span key={i} className="rm-te-pq"><i />{i < 2 ? <b>✓</b> : <em />}</span>)}</span></>;
  else ekran = <><span className="rm-te-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><TelKarta son={8} /><div className="rm-tk"><span className="rm-tk-t"><b>{tr({ uz: 'Shanba, 20:00', ru: 'Суббота, 20:00' })}</b><span>{tr({ uz: 'Maktab maydoni', ru: 'Школьная площадка' })}</span></span><b className="rm-tk-son">6 / 10</b></div></>;
  return (
    <div className="rm-tel-w">
      <div className="rm-tel">
        <div className="rm-tel-bar"><MJ /></div>
        <div className="rm-tel-ekran" key={`${holat}-${k}`}>{ekran}</div>
      </div>
      <span className="rm-kul">{tr({ uz: 'chizma — hali qurilmagan', ru: 'набросок — ещё не построено' })}</span>
    </div>
  );
};

// ----- PRD varag'i (0, 12-ekran): yetti bo'lim (tayanch 1.4); 5 va 6 ochiq, qolgani — yopiq qatorda bo'lim nomi (bo'sh chiziq yo'q — SABOQ 33); mahsulot nomi yozilmaydi -----
const PRD_BOLIM = [
  { uz: 'Muammo', ru: 'Проблема' }, { uz: 'Dalil', ru: 'Довод' }, { uz: 'Kim uchun', ru: 'Для кого' }, { uz: 'Yechim', ru: 'Решение' },
  { uz: 'Uchta asosiy funksiya', ru: 'Три основные функции' }, { uz: 'Qilmaymiz / keyin', ru: 'Не делаем / потом' }, { uz: 'Bosh raqam', ru: 'Главное число' }
];
const PrdMaket = ({ on, kichik, faqat5 }) => {
  const q = (i) => {
    const b = PRD_BOLIM[i];
    const ochiq = i === 4 || (i === 5 && !faqat5);
    return (
      <div key={i} className={cxx('rm-prd-q', ochiq && 'ochiq', on && ochiq && 'on')} style={{ '--i': i }}>
        <span className="rm-prd-t"><i>{i + 1}</i>{tr(b)}</span>
        {i === 4 && ochiq && <span className="rm-prd-ich">{MENTOR_ISHLAR.slice(0, 3).map(x => <span key={x.id} className="rm-prd-f" data-src={'p-' + x.id}>{tr(x.nom)}</span>)}</span>}
        {i === 5 && ochiq && <span className="rm-prd-ich teg"><em>{tr({ uz: 'Keyin:', ru: 'Потом:' })}</em>{MENTOR_ISHLAR.slice(3).map(x => <span key={x.id} className="rm-prd-teg" data-src={'p-' + x.id}>{tr(x.nom)}</span>)}</span>}
      </div>
    );
  };
  return (
    <div className={cxx('rm-prd', kichik && 'kichik')}>
      <span className="rm-prd-h">PRD</span>
      <div className="rm-prd-yop">{[0, 1, 2, 3].map(q)}</div>
      {q(4)}{faqat5 ? <div className="rm-prd-yop">{q(5)}{q(6)}</div> : <>{q(5)}{q(6)}</>}
    </div>
  );
};

// ----- Reja chizmasi (1-ekran): uch ustun, kulrang kartalar 0.4 s oraliqda tushadi — 3 · 2 · 1; birinchi ustun boshida kulrang blok.
// Kartalarda Mentor ishlarining nomi (SABOQ 33: matnsiz chiziq yo'q); ustun nomi va poydevor yorlig'i yo'q — kashfiyot 4-ekranda (P-015).
const REJA_USTUN = [[0, 1, 2], [3, 4], [5]];
const RejaChizma = () => {
  let d = 0;
  return (
    <div className="rm-rj">
      {REJA_USTUN.map((u, j) => (
        <div key={j} className="rm-rj-u">
          {j === 0 && <span className="rm-rj-p" aria-hidden="true" />}
          {u.map(i => { const kech = (d++) * 0.4; return <span key={i} className="rm-rj-k" style={{ animationDelay: `${0.2 + kech}s` }}>{tr(MENTOR_ISHLAR[i].nom)}</span>; })}
        </div>
      ))}
    </div>
  );
};

// ----- Odam (6-ekran sahnasi; SABOQ 36): bosh, soch, ko'z, tabassum, rangli kiyim; qo'lida telefon yoki quti. (x, y) — oyoq ostidagi nuqta -----
const OR = { teri: ['#EDC39C', '#C98E62', '#E3A87C'], soch: ['#2E2019', '#5B3A24', '#1F1A19'], kiyim: ['#E07A5F', '#3E7CB1', '#E9A23B', '#2F9E7A'], shim: '#3B3F5C', oyoq: '#2A2730', quti: '#C8955A', qutiQ: '#9C6B3A' };
const Odam = ({ x = 0, y = 0, s = 1, teri = 0, soch = 0, kiyim = 0, qol, yuz = 1, uzun }) => {
  const k = OR.kiyim[kiyim % 4], t = OR.teri[teri % 3], h = OR.soch[soch % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s * yuz} ${s})`}>
      <rect x="-8" y="-31" width="7.5" height="29" rx="3.5" fill={OR.shim} />
      <rect x="0.5" y="-31" width="7.5" height="29" rx="3.5" fill={OR.shim} />
      <rect x="-9.5" y="-4" width="10" height="4.5" rx="2.2" fill={OR.oyoq} />
      <rect x="0.5" y="-4" width="11" height="4.5" rx="2.2" fill={OR.oyoq} />
      <rect x="-11" y="-58" width="22" height="30" rx="8" fill={k} />
      <rect x="-12" y="-56" width="8" height="24" rx="4" fill={k} opacity="0.85" />
      <rect x="-3" y="-62" width="6" height="6" rx="2" fill={t} />
      {qol === 'quti'
        ? <g><rect x="2" y="-52" width="16" height="7" rx="3.5" fill={k} /><rect x="9" y="-60" width="22" height="18" rx="2" fill={OR.quti} /><line x1="9" y1="-54" x2="31" y2="-54" stroke={OR.qutiQ} strokeWidth="1.4" /><circle cx="12" cy="-46" r="3.2" fill={t} /></g>
        : qol === 'telefon'
          ? <g><rect x="5" y="-54" width="7" height="14" rx="3.5" fill={k} /><rect x="6" y="-45" width="14" height="7" rx="3.5" fill={k} /><circle cx="20" cy="-41.5" r="3.2" fill={t} /><rect x="17.5" y="-54" width="7" height="11" rx="1.6" fill="#2A2730" /><rect x="18.6" y="-52.6" width="4.8" height="7.6" rx="0.8" fill="#9FC3FF" /></g>
          : <g><rect x="5" y="-55" width="7" height="26" rx="3.5" fill={k} /><circle cx="8.5" cy="-28" r="3.2" fill={t} /></g>}
      <circle cx="0" cy="-71" r="10.5" fill={t} />
      {uzun && <path d="M -10.5 -72 C -12 -58, -9 -55, -4 -56 L -6 -68 Z" fill={h} />}
      <path d="M -11 -70 C -12 -86, 12 -86, 11 -71 C 6 -77, -2 -78, -11 -70 Z" fill={h} />
      <circle cx="2.5" cy="-71" r="1.35" fill="#2A2730" />
      <circle cx="7.5" cy="-71" r="1.35" fill="#2A2730" />
      <path d="M 3 -66 Q 5.5 -63.5 8 -66" stroke="#8A4B3A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="9" cy="-67.5" r="1.8" fill="#E8867A" opacity="0.35" />
    </g>
  );
};
// Mashina (Uzum'ning o'z mashinasi — logotipsiz, o'z rangida) va topshirish punkti
const Mashina = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="0" y="-34" width="52" height="28" rx="4" fill="#7000FF" />
    <path d="M 52 -26 h 14 l 9 10 v 10 h -23 z" fill="#5A00CC" />
    <rect x="56" y="-23" width="10" height="8" rx="1.5" fill="#D9CCFF" />
    <circle cx="14" cy="-5" r="6" fill="#2A2730" /><circle cx="14" cy="-5" r="2.4" fill="#B9B4C9" />
    <circle cx="60" cy="-5" r="6" fill="#2A2730" /><circle cx="60" cy="-5" r="2.4" fill="#B9B4C9" />
  </g>
);
const Punkt = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="0" y="-52" width="62" height="52" rx="3" fill="#F4EEFF" stroke="#CBBDF0" strokeWidth="1.4" />
    <path d="M -5 -52 h 72 l -6 -10 h -60 z" fill="#7000FF" />
    <rect x="8" y="-40" width="20" height="16" rx="2" fill="#E3D8FF" />
    <rect x="36" y="-34" width="18" height="34" rx="2" fill="#9C8BD6" />
    {[0, 1, 2].map(i => <rect key={i} x={10 + i * 6} y={-20 + (i % 2) * 2} width="7" height="7" rx="1" fill={OR.quti} />)}
  </g>
);
const MiniTel = ({ x, y, w = 96, h = 176, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width={w} height={h} rx="14" fill="#1F1B2E" />
    <rect x="5" y="9" width={w - 10} height={h - 18} rx="9" fill="#FFFFFF" />
    <rect x={w / 2 - 12} y="3" width="24" height="3.5" rx="1.75" fill="#3A3550" />
    {children}
  </g>
);
// Narsa chizmalari (ilova va guruh postida): futbolka, krossovka, to'p, kitob
const Narsa = ({ tur, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {tur === 0 && <path d="M -9 -8 l 5 -4 h 8 l 5 4 l -3 5 l -3 -2 v 13 h -11 v -13 l -3 2 z" fill="#E07A5F" />}
    {tur === 1 && <path d="M -11 4 v -8 l 6 -1 l 4 4 h 8 q 4 0 4 5 z" fill="#3E7CB1" />}
    {tur === 2 && <g><circle cx="0" cy="0" r="9" fill="#FFFFFF" stroke="#2A2730" strokeWidth="1.2" /><path d="M 0 -4 l 3.8 2.8 l -1.4 4.4 h -4.8 l -1.4 -4.4 z" fill="#2A2730" /></g>}
    {tur === 3 && <g><rect x="-8" y="-10" width="16" height="20" rx="1.5" fill="#2F9E7A" /><rect x="-5" y="-6" width="10" height="2" fill="#E3F0E8" /></g>}
  </g>
);
// Uzum sahnasi (6-ekran; bosqichga qarab o'zgaradi; bankda yo'q narsa — son, narx, asoschi — chizilmaydi)
const UzumSahna = ({ b }) => {
  const kul = { fill: '#8A84A3', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 12 };
  return (
    <svg className={cxx('rm-uz', `b${b}`)} viewBox="0 0 560 230" role="img" aria-label="Uzum" key={b}>
      {b === 0 && <g>
        <rect x="0" y="0" width="560" height="230" fill="#F5F3FB" />
        <rect x="0" y="206" width="560" height="24" fill="#E6E1F2" />
        <g className="rm-uz-kir" style={{ '--i': 0 }}>
          <MiniTel x={120} y={20} w={128} h={186}>
            <rect x="5" y="9" width="118" height="22" rx="8" fill="#E6F1FB" />
            <circle cx="20" cy="20" r="6" fill="#7FB2E5" />
            <rect x="12" y="38" width="104" height="70" rx="8" fill="#F3F1F8" />
            <rect x="18" y="44" width="92" height="44" rx="6" fill="#FFFFFF" />
            <Narsa tur={0} x={64} y={67} s={1.6} />
            <g className="rm-uz-pufak">
              <rect x="12" y="116" width="58" height="18" rx="9" fill="#EDEAF5" /><circle cx="28" cy="125" r="1.8" fill="#9D97B5" /><circle cx="35" cy="125" r="1.8" fill="#9D97B5" /><circle cx="42" cy="125" r="1.8" fill="#9D97B5" />
              <rect x="56" y="140" width="60" height="18" rx="9" fill="#DCEBFA" /><circle cx="76" cy="149" r="1.8" fill="#7FA7CF" /><circle cx="83" cy="149" r="1.8" fill="#7FA7CF" /><circle cx="90" cy="149" r="1.8" fill="#7FA7CF" />
              <rect x="12" y="164" width="48" height="18" rx="9" fill="#EDEAF5" /><circle cx="26" cy="173" r="1.8" fill="#9D97B5" /><circle cx="33" cy="173" r="1.8" fill="#9D97B5" /><circle cx="40" cy="173" r="1.8" fill="#9D97B5" />
            </g>
          </MiniTel>
        </g>
        <text x="184" y="14" textAnchor="middle" style={kul}>{tr({ uz: 'guruh orqali xarid', ru: 'покупка через группу' })}</text>
        <g className="rm-uz-kir" style={{ '--i': 1 }}><Odam x={350} y={206} s={1.45} kiyim={1} teri={0} soch={0} qol="telefon" /></g>
        <g className="rm-uz-kir" style={{ '--i': 2 }}><Odam x={430} y={206} s={1.35} yuz={-1} kiyim={2} teri={1} soch={1} uzun qol="telefon" /></g>
      </g>}
      {b === 1 && <g>
        <rect x="0" y="0" width="560" height="230" fill="#F5F3FB" />
        <rect x="190" y="150" width="370" height="30" fill="#D9D5E3" />
        <line x1="190" y1="165" x2="560" y2="165" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="14 10" />
        <g className="rm-uz-kir" style={{ '--i': 0 }}>
          <MiniTel x={40} y={18} w={120} h={194}>
            <text x="60" y="27" textAnchor="middle" className="rm-uz-nom">Uzum</text>
            {[0, 1, 2, 3].map(i => <g key={i}><rect x={12 + (i % 2) * 50} y={38 + Math.floor(i / 2) * 64} width="46" height="58" rx="7" fill="#F4EEFF" /><Narsa tur={i} x={35 + (i % 2) * 50} y={62 + Math.floor(i / 2) * 64} s={1.2} /><rect x={18 + (i % 2) * 50} y={84 + Math.floor(i / 2) * 64} width="26" height="5" rx="2.5" fill="#CBBDF0" /></g>)}
          </MiniTel>
        </g>
        <g className="rm-uz-kir" style={{ '--i': 1 }}><Punkt x={470} y={150} s={1.15} /></g>
        <g className="rm-uz-yur"><Mashina x={200} y={160} s={0.95} /></g>
        <g>
          <line x1="250" y1="206" x2="440" y2="206" stroke="#CBBDF0" strokeWidth="3" strokeLinecap="round" />
          <circle cx="250" cy="206" r="6" fill="#9C8BD6" />
          <circle className="rm-uz-ertaga" cx="440" cy="206" r="7" />
          <text x="250" y="226" textAnchor="middle" style={kul}>{tr({ uz: 'bugun', ru: 'сегодня' })}</text>
          <text x="440" y="226" textAnchor="middle" className="rm-uz-ert-t">{tr({ uz: 'ertaga', ru: 'завтра' })}</text>
          <text x="345" y="200" textAnchor="middle" style={kul}>→</text>
        </g>
      </g>}
      {b === 2 && <g>
        <rect x="0" y="0" width="560" height="230" fill="#F5F3FB" />
        <rect x="0" y="128" width="560" height="102" fill="#ECE7F7" />
        <line x1="0" y1="128" x2="560" y2="128" stroke="#B9AEDB" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="140" y="16" textAnchor="middle" style={kul}>{tr({ uz: 'ekranda', ru: 'на экране' })}</text>
        <text x="380" y="146" textAnchor="middle" className="rm-uz-yoq">{tr({ uz: "ekranda ko'rinmaydi", ru: 'не видно на экране' })}</text>
        <MiniTel x={96} y={22} w={88} h={100}>
          <text x="44" y="27" textAnchor="middle" className="rm-uz-nom kichik">Uzum</text>
          <rect x="14" y="34" width="60" height="30" rx="6" fill="#F4EEFF" /><Narsa tur={1} x={44} y={50} s={1.1} />
          <rect className="rm-uz-buyurtma" x="14" y="70" width="60" height="18" rx="7" />
          <text x="44" y="83" textAnchor="middle" className="rm-uz-bt">{tr({ uz: 'buyurtma', ru: 'заказ' })}</text>
        </MiniTel>
        <path className="rm-uz-iz" d="M 140 122 C 140 170, 180 196, 230 196 L 470 196" fill="none" stroke="#7000FF" strokeWidth="2" strokeDasharray="5 6" />
        <g className="rm-uz-kir" style={{ '--i': 1 }}><Mashina x={230} y={214} s={0.85} /></g>
        <g className="rm-uz-kir" style={{ '--i': 2 }}><Punkt x={350} y={214} s={1} /></g>
        <g className="rm-uz-kir" style={{ '--i': 3 }}><Odam x={480} y={222} s={1.05} kiyim={3} teri={2} soch={1} qol="quti" yuz={-1} /></g>
      </g>}
    </svg>
  );
};

// Bashorat tanlangach — ixcham qator (SABOQ 11): savol va «Taxminingiz: …» natijagacha turadi
const BashQator = ({ savol, javob }) => <div className="rm-bashq fade-step"><span>{savol}</span><span className="rm-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;
// Natija qatori — xulosaning birinchi qatori (SABOQ 25)
const TaxminQator = ({ togri, javob, haqiqat }) => <span className={cxx('rm-tx', togri && 'ok')}>{togri
  ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
  : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {javob} <b className="yoq">✕</b> · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>;
const TAXMIN_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'qamrov', t: { uz: "Eng ko'p odamga kerak ishdan", ru: "С работы, которая нужна большинству людей" } },
  { id: 'mehnat', t: { uz: 'Eng tez quriladigan ishdan', ru: 'С работы, которую быстрее всего построить' } },
  { id: 'tasir', t: { uz: 'Eng katta foyda beradigan ishdan', ru: 'С работы, которая даёт больше всего пользы' } }
];
const TUP = [[0, 2, -7], [104, 0, 6], [200, 6, -3], [34, 30, 8], [138, 34, -5], [232, 30, 4]];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [uchdi, setUchdi] = useState(storedAnswer ? 6 : 0);
  const maketRef = useRef(null);
  const uch = useUchish();
  // Tanlovdan keyin: PRD ning 5 va 6-bo'limi ko'tariladi, oltita ish navbat bilan (100 ms) «Bugun» uchiga uchib, tartibsiz to'p bo'ladi
  useEffect(() => {
    if (picked === null || uchdi >= 6) return undefined;
    if (kamHarakat()) { setUchdi(6); return undefined; }
    const t = setTimeout(() => {
      const x = MENTOR_ISHLAR[uchdi];
      const src = maketRef.current && maketRef.current.querySelector(`[data-src="p-${x.id}"]`);
      uch(src, 's0-' + x.id, 640);
      setUchdi(uchdi + 1);
    }, uchdi === 0 ? 700 : 100);
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
      <div className={cxx('rm-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Bitiruvgacha nimani <A>qachon qurasiz?</A></>, ru: <>Что и <A>когда</A> вы построите до выпуска?</> })}
          mentor={<Mentor>{tr({ uz: "Mentor misolida PRD da oltita ish bor — ularni birdan qurib bo'lmaydi. O'zingizga yaqin javobni belgilang.", ru: 'В примере Ментора в PRD шесть работ — построить их все сразу нельзя. Отметьте близкий вам ответ.' })}</Mentor>}
          maket={<div className="rm-s0-m" ref={maketRef}>
            <PrdMaket on={picked !== null} />
            <div className="rm-bugun">
              <div className="rm-bugun-q"><span>{tr({ uz: 'Bugun', ru: 'Сегодня' })}</span><i aria-hidden="true" /><span>{tr({ uz: 'Bitiruv', ru: 'Выпуск' })}</span></div>
              <div className="rm-tup">{MENTOR_ISHLAR.slice(0, uchdi).map((x, i) => <span key={x.id} className="rm-tup-k" data-uch={'s0-' + x.id} style={{ left: TUP[i][0], top: TUP[i][1], '--r': `${TUP[i][2]}deg` }}>{tr(x.nom)}</span>)}</div>
            </div>
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="rm-javob fade-step">{tr({ uz: 'Uchalasi ham RICE ning bir bo\'lagi: qamrov, mehnat va ta\'sir. Bugun ular bitta hisobda birlashadi.', ru: 'Все три — части RICE: охват, усилия и влияние. Сегодня они соединятся в одном расчёте.' })}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "Javobni muhokama qilmang — RICE 2-darsda o'tilgan, bugun u PRD dagi ishlarga qo'llanadi. «Poydevordan boshlayman» degan o'quvchi bo'lsa — maqtang, lekin hozir ochmang (4-ekran).", ru: 'Не обсуждайте ответ — RICE прошли во 2-м уроке, сегодня его применяют к работам из PRD. Если ученик скажет «начну с фундамента» — похвалите, но пока не раскрывайте (4-й экран).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Dars oxirida: RICE bo'yicha roadmap» + uch ustun, kartalar 3 · 2 · 1 tushadi; o'ngda 01 · matn · teg) =====
const REJA = [
  { t: { uz: "PRD dagi ishlarni RICE bilan tartiblaysiz", ru: 'Упорядочите работы из PRD с помощью RICE' }, teg: { uz: 'RICE', ru: 'RICE' } },
  { t: { uz: 'Har ishni uch ufqdan biriga joylaysiz', ru: 'Поставите каждую работу в один из трёх горизонтов' }, teg: { uz: 'ufq', ru: 'горизонт' } },
  { t: { uz: <><Uzum /> ishni nimadan boshlaganini ko'rasiz</>, ru: <>Увидите, с чего <Uzum /> начал работу</> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: "O'z ishlaringizdan bitiruvgacha reja tuzasiz", ru: 'Из своих работ составите план до выпуска' }, teg: { uz: 'roadmap', ru: 'roadmap' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun <A>bitiruvgacha reja</A> tuzasiz.</>, ru: <>Сегодня вы составите <A>план до выпуска</A>.</> })}
      mentor={<Mentor>{tr({ uz: "O'tgan darsda PRD yozildi. Bugun undagi har ish qachon qurilishini belgilaysiz.", ru: "На прошлом уроке вы написали PRD. Сегодня отметите, когда будет строиться каждая работа из него." })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida: RICE bo'yicha roadmap", ru: 'В конце урока: roadmap по RICE' })}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — FUNKSIYALARGA RICE (QTushuncha markaziy: bashorat → ish kartasini bosish → formula, tartib ustuni va telefon o'zgaradi) =====
const S2_TAXMIN = ['elon', 'tasdiq', 'royxat'];
const S2_SAVOL = { uz: "Qaysi ish RICE bo'yicha birinchi turadi?", ru: 'Какая работа будет первой по RICE?' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [bosilgan, setBosilgan] = useState(() => (storedAnswer ? MENTOR_ISHLAR.map(x => x.id) : []));
  const [joriy, setJoriy] = useState(storedAnswer ? 'elon' : null);
  const [yangi, setYangi] = useState(null);
  const [tk, setTk] = useState(0);
  const uch = useUchish();
  const done = bosilgan.length >= 6;
  const tugadi = useTugadi(done, 1600, !!storedAnswer);
  const faol = taxmin !== null || isMentor;
  const qolgan = MENTOR_ISHLAR.filter(x => !bosilgan.includes(x.id));
  const keyingi = faol && !done ? qolgan[0] : null;
  const ipucha = useIpucha(faol && !done, bosilgan.length);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!yangi) return undefined; const t = setTimeout(() => setYangi(null), 1200); return () => clearTimeout(t); }, [yangi]);
  const bos = (x, e) => {
    if (!faol || bosilgan.includes(x.id)) return;
    uch(e && e.currentTarget, 's2-' + x.id, 620);
    setBosilgan(b => [...b, x.id]); setJoriy(x.id); setYangi(x.id); setTk(k => k + 1);
  };
  const jx = joriy ? MENTOR_ISHLAR.find(x => x.id === joriy) : null;
  const tartib = MENTOR_TARTIB.filter(x => bosilgan.includes(x.id));
  const txNom = taxmin ? tr(MENTOR_ISHLAR.find(x => x.id === taxmin).nom) : '';
  const qator = (x, i) => <IshKarta key={x.id} kor="ixcham" n={i + 1} ish={x} uch={'s2-' + x.id} yangi={yangi === x.id} />;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · RICE tartibi', ru: 'Понятие · порядок RICE' })} screen={screen} scrollSignal={bosilgan.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Ishlarni bosing (${bosilgan.length}/6)`, ru: `Нажмите на работы (${bosilgan.length}/6)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>PRD dagi oltita ishni <A>RICE qanday tartiblaydi?</A></>, ru: <>Как <A>RICE упорядочит</A> шесть работ из PRD?</> })}
        mentor={<Mentor>{tr({ uz: "2-darsda g'oyalarni RICE bilan baholagansiz — endi PRD dagi har ish kartasini bosing.", ru: 'Во 2-м уроке вы оценивали идеи по RICE — теперь нажмите на каждую карточку работы из PRD.' })}</Mentor>}
        bashorat={!isMentor && (taxmin === null
          ? <div className="rm-bash"><QBashorat yorliq={tr(TAXMIN_YORLIQ)} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(k => ({ k, t: tr(MENTOR_ISHLAR.find(x => x.id === k).nom) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <BashQator savol={tr(S2_SAVOL)} javob={txNom} />)}
        vizual={<div className={cxx('rm-s2', tugadi && 'tugadi')}>
          <div className="rm-s2-tel"><MaydonTelefon holat={jx ? jx.telefon : 'boshi'} k={tk} /></div>
          <div className="rm-s2-ong">
            {!tugadi && <FormulaKarta ish={jx} k={tk} yorliq={tr({ uz: 'Mentorning taxmini', ru: 'Предположение Ментора' })} />}
            {!tugadi && qolgan.length > 0 && <div className={cxx('rm-s2-ishlar', !faol && 'xira')}>
              {qolgan.map(x => <IshKarta key={x.id} ish={x} rice={null} onBos={faol ? (e) => bos(x, e) : undefined} faol={!!keyingi && keyingi.id === x.id} />)}
            </div>}
            {tartib.length > 0 && <div className="rm-tartib">
              <span className="rm-yorliq">{tr({ uz: "RICE bo'yicha tartib", ru: 'Порядок по RICE' })}</span>
              {done
                ? <><div className="rm-qavs-g"><ol className="rm-tartib-ro">{tartib.slice(0, 3).map(qator)}</ol><span className="rm-qavs">{tr({ uz: 'asosiy funksiyalar', ru: 'основные функции' })}</span></div>
                  <ol className="rm-tartib-ro" start={4}>{tartib.slice(3).map((x, i) => qator(x, i + 3))}</ol></>
                : <ol className="rm-tartib-ro">{tartib.map(qator)}</ol>}
            </div>}
          </div>
        </div>}
        natija={done
          ? <QIzoh>{tr({ uz: 'Bu misolda RICE tartibi PRD bilan bir xil chiqdi: uchta asosiy funksiya — yuqorida.', ru: 'В этом примере порядок RICE совпал с PRD: три основные функции — наверху.' })}</QIzoh>
          : ipucha && <QIzoh>{tr({ uz: 'Halqadagi ish kartasini bosing — RICE formulada hisoblanib chiqadi.', ru: 'Нажмите на карточку в рамке — RICE посчитается в формуле.' })}</QIzoh>}
        xulosa={done && <>{taxmin && <TaxminQator togri={taxmin === 'elon'} javob={txNom.toLowerCase()} haqiqat={tr(MENTOR_ISHLAR[0].nom).toLowerCase()} />}{tr({ uz: "Mentor misolida uch funksiyaning qamrovi bir xil — tartibni ta'sir, ishonch va mehnat ajratdi.", ru: "В примере Ментора охват трёх функций одинаковый — порядок определили влияние, уверенность и усилия." })}</>}
      />
      <MentorNote>{tr({ uz: "Mehnat — kursda «bitta odam necha hafta» (2-darsda aytilgan). Telefon maketi — chizma: bu ekranlar 7-darsdan keyin quriladi. Sonlar — Mentorning taxmini. Ishonch sababi so'ralsa: qo'shilish — 80% (1, 2, 3, 5-yozuvlarda kim keladi muammosi) · tasdiq — 50% (odamlar o'yin kuni tugmani bosadimi — hali taxmin) · chiqish va navbat — 80% (oxirgi daqiqada kelmaganlar — 1, 2, 5-yozuvlar). Sinfdan so'rang: «Eslatma ham foydali-ku — nega u pastda?» (qamrov bir xil, ta'sir va ishonch kichik, mehnat ikki hafta).", ru: 'Усилия — в курсе «сколько недель у одного человека» (сказано во 2-м уроке). Макет телефона — набросок: эти экраны строят после 7-го урока. Числа — предположение Ментора. Если спросят о причинах уверенности: присоединение — 80% (в записях 1, 2, 3, 5 проблема «кто придёт») · подтверждение — 50% (нажмут ли люди кнопку в день игры — пока предположение) · выход и очередь — 80% (не пришедшие в последнюю минуту — записи 1, 2, 5). Спросите класс: «Напоминание ведь тоже полезно — почему оно внизу?» (охват тот же, влияние и уверенность меньше, усилия — две недели).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s3 = 1; savol ustida yorliq yo'q — SABOQ 6) =====
const S3Viz = () => <div className="rm-tv-ishlar">{MENTOR_ISHLAR.slice(0, 3).map(x => <IshKarta key={x.id} ish={x} yorliqsiz kul={['qamrov']} ajrat={['tasir', 'ishonch', 'mehnat']} className="kichik" />)}</div>;
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · RICE tartibi', ru: 'Проверка · порядок RICE' })}
    questionText="Mentor misolida uch funksiyaning qamrovi bir xil. Tartibni nima ajratadi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida uch funksiyaning qamrovi bir xil. <A>Tartibni nima ajratadi?</A></h2>, ru: <h2 className="title h-ask">В примере Ментора охват трёх функций одинаковый. <A>Что определяет порядок?</A></h2> })}
    options={[
      { uz: 'Qamrov: oyiga nechta odam ishlatishi', ru: 'Охват: сколько людей пользуется в месяц' },
      { uz: "Ta'sir, ishonch va mehnatdagi farq", ru: 'Разница во влиянии, уверенности и усилиях' },
      { uz: 'PRD da qaysi biri oldin yozilgani', ru: 'Какая из них раньше записана в PRD' },
      { uz: 'Qaysi birini qurish qiziqroq ekani', ru: 'Какую из них интереснее строить' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Qamrov teng bo'lsa, RICE ni qolgan uch bo'lak o'zgartiradi.", ru: "Если охват одинаковый, RICE меняют остальные три части." }}
    explainWrong={{
      0: { uz: 'Qamrov uchalasida 60 — u tartibni ajratmaydi.', ru: "Охват у всех трёх — 60, он порядок не определяет." },
      2: { uz: "PRD dagi o'rni emas, RICE ning bo'laklari ajratadi.", ru: "Порядок определяет не место в PRD, а части RICE." },
      3: { uz: "Qiziqish RICE ga kirmaydi — to'rt bo'lakka qarang.", ru: 'Интерес не входит в RICE — посмотрите на четыре части.' },
      default: { uz: "Formula kartasida qaysi sonlar har xil — shuni ko'ring.", ru: 'Посмотрите, какие числа в карточке формулы разные.' }
    }}
    vizual={<S3Viz />} />
);

// ===== SCREEN 4 — UCH UFQ (QTushuncha, 8-Modul ko'prigi; ketma-ket 6 qadam — P-055): tartib ro'yxati chapda · uch ufqli doska o'ngda =====
const S4_SAVOL = { uz: "To'rtinchi ish — «O'yindan oldin eslatma» — qaysi ufqqa tushadi?", ru: 'Четвёртая работа — «Напоминание перед игрой» — в какой горизонт попадёт?' };
const ufqQ = (id) => { const u = UFQLAR.find(x => x.id === id); return `«${tr(u.nom)}»`; };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(storedAnswer ? 6 : 0);
  const [sabab, setSabab] = useState(null);
  const [yangi, setYangi] = useState(null);
  const [poy, setPoy] = useState(!!storedAnswer);
  const [rm, setRm] = useState(!!storedAnswer);
  const uch = useUchish();
  const faol = taxmin !== null || isMentor;
  const done = n >= 6 && rm;
  const tugadi = useTugadi(done, 1600, !!storedAnswer);
  const ipucha = useIpucha(faol && n < 6, n);
  useEffect(() => { if (n < 6 || poy) return undefined; const t = setTimeout(() => setPoy(true), kamHarakat() ? 0 : 900); return () => clearTimeout(t); }, [n, poy]);
  useEffect(() => { if (!poy || rm) return undefined; const t = setTimeout(() => setRm(true), kamHarakat() ? 0 : 1100); return () => clearTimeout(t); }, [poy, rm]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!yangi) return undefined; const t = setTimeout(() => setYangi(null), 1200); return () => clearTimeout(t); }, [yangi]);
  const bos = (x, e) => {
    if (!faol || n >= 6 || MENTOR_TARTIB[n].id !== x.id) return;
    uch(e && e.currentTarget, 'mj-' + x.id, 640);
    setN(n + 1); setSabab({ t: tr(x.sabab), k: x.id }); setYangi(x.id);
  };
  const joy = mentorJoy(n);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ufq', ru: 'Понятие · горизонт' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Ishlarni joylang (${n}/6)`, ru: `Разложите работы (${n}/6)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Tartibdagi oltita ish <A>qaysi ufqqa tushadi?</A></>, ru: <>В какой <A>горизонт попадёт</A> каждая из шести работ?</> })}
        mentor={<Mentor>{tr({ uz: 'Tartibdagi eng yuqori ishni bosing — u o\'z ufqiga tushadi va sababi ochiladi.', ru: "Нажмите верхнюю работу в порядке — она попадёт в свой горизонт, и откроется причина." })}</Mentor>}
        bashorat={!isMentor && (taxmin === null
          ? <div className="rm-bash"><QBashorat yorliq={tr(TAXMIN_YORLIQ)} savol={tr(S4_SAVOL)} variantlar={UFQLAR.map(u => ({ k: u.id, t: `«${tr(u.nom)}»` }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <BashQator savol={tr(S4_SAVOL)} javob={ufqQ(taxmin)} />)}
        harakat={<div className={cxx('rm-s4-ro', !faol && 'xira')}>
          <span className="rm-yorliq">{tr({ uz: "RICE bo'yicha tartib", ru: 'Порядок по RICE' })}</span>
          <ol>{MENTOR_TARTIB.map((x, i) => (
            <li key={x.id}><IshKarta kor="ixcham" n={i + 1} ish={x} className={cxx(i < n && 'joylandi', i > n && 'kutadi')} faol={faol && i === n} onBos={faol && i === n ? (e) => bos(x, e) : undefined} ong={i < n ? <span className="rm-ok">✓</span> : undefined} /></li>
          ))}</ol>
          {sabab && !poy && <p className="rm-sabab" key={sabab.k}><b>{tr(MENTOR_ISHLAR.find(x => x.id === sabab.k).nom)}</b> — {sabab.t}</p>}
        </div>}
        vizual={<div className="rm-s4-v">
          <p className="rm-eslat"><b>{tr({ uz: '8-Moduldan:', ru: 'Из 8-го модуля:' })}</b> {tr({ uz: 'Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo\'lagi.', ru: "Горизонт — отрезок времени, куда работы попадают по тому, когда они начинаются." })}</p>
          <UfqDoska {...joy} yangi={yangi} poydevorOn={poy} roadmap={rm} keng={tugadi} />
        </div>}
        natija={poy
          ? <QIzoh>{tr({ uz: 'Poydevor RICE ga kirmaydi: busiz hech bir funksiya ishlamaydi.', ru: 'Фундамент не входит в RICE: без него ни одна функция не работает.' })}</QIzoh>
          : ipucha && <QIzoh>{tr({ uz: "Chapdagi halqali ishni bosing — u qaysi ufqqa tushishini ko'ring.", ru: 'Нажмите работу в рамке слева — посмотрите, в какой горизонт она попадёт.' })}</QIzoh>}
        xulosa={done && <>{taxmin && <TaxminQator togri={taxmin === 'keyinroq'} javob={ufqQ(taxmin)} haqiqat={ufqQ('keyinroq')} />}{tr({ uz: 'Bitiruvgacha shunday uch ufqli reja roadmap deyiladi: qaysi ish qaysi ufqda turadi.', ru: 'Такой план из трёх горизонтов до выпуска называют roadmap: какая работа в каком горизонте.' })}</>}
      />
      <MentorNote>{tr({ uz: "8-Modulda ufqlar «uch oy · olti oy» edi (mashq uchun) — bugun modullar. 8-Modul qoidasini eslating: ishni ufqqa unga kerak narsaning tayyor bo'lish payti qo'yadi; RICE esa tartibni ko'rsatadi. «Ro'yxat o'zi yangilanishi» — 12-Modul ishi; 11-Modulda ilova ekran ochilganda va pastga tortib yangilaganda so'raydi — bu tafsilotni faqat so'rasa ayting. Poydevor — 10-dars: bugun uning ichini ochmang.", ru: "В 8-м модуле горизонты были «три месяца · шесть месяцев» (для упражнения) — сегодня это модули. Напомните правило 8-го модуля: работу в горизонт ставит момент, когда готово нужное ей; RICE же показывает порядок. «Автообновление списка» — работа 12-го модуля; в 11-м модуле приложение запрашивает данные при открытии экрана и при обновлении свайпом вниз — эту деталь говорите, только если спросят. Фундамент — 10-й урок: сегодня не раскрывайте, что внутри." })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ C, INLINE_KEYS.s5 = 2) =====
const S5Viz = () => <UfqDoska kichik {...mentorJoy()} ajratZona="keyinroq" />;
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · kutadigan ish', ru: 'Проверка · работа, которая ждёт' })}
    questionText="Ish RICE bo'yicha birinchi, lekin 12-Modulni kutadi. Qayerga qo'yasiz?"
    question={tr({ uz: <h2 className="title h-ask">Ish RICE bo'yicha birinchi, lekin 12-Modulni kutadi. <A>Qayerga qo'yasiz?</A></h2>, ru: <h2 className="title h-ask">Работа первая по RICE, но ждёт 12-й модуль. <A>Куда её поставите?</A></h2> })}
    options={[
      { uz: '«Hozir»ga: tartibda u birinchi turibdi', ru: 'В «Сейчас»: по порядку она первая' },
      { uz: '«Uzoqroq»qa: kutgan ish oxirida turadi', ru: 'В «Дальше»: ждущая работа стоит в конце' },
      { uz: '«Keyinroq»qa: 12-Modulda boshlanadi', ru: 'В «Позже»: начнётся в 12-м модуле' },
      { uz: "Hech qayerga: roadmap'dan o'chiriladi", ru: 'Никуда: её удаляют из roadmap' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Ish unga kerak narsa tayyor bo'lgan ufqda boshlanadi — unga kerak qism 12-Modulda o'tiladi.", ru: 'Работа начинается в горизонте, где готово нужное ей, — нужную часть проходят в 12-м модуле.' }}
    explainWrong={{
      0: { uz: 'Tartib birinchi, lekin unga kerak narsa hali yo\'q.', ru: 'По порядку первая, но нужного ей ещё нет.' },
      1: { uz: "U bitiruvgacha kutmaydi — faqat 12-Modulgacha.", ru: 'Она ждёт не до выпуска — только до 12-го модуля.' },
      3: { uz: "Kutadigan ish o'chirilmaydi — u keyingi ufqda turadi.", ru: 'Ждущую работу не удаляют — она стоит в следующем горизонте.' },
      default: { uz: 'Ish nimani kutayotganiga qarang.', ru: 'Посмотрите, чего ждёт работа.' }
    }}
    vizual={<S5Viz />} />
);

// ===== SCREEN 6 — UZUM (QVoqea, PM keys K1 — bank matni aynan; nom o'z binafsha rangida, logotipsiz; bosqich gapi Mentorda — SABOQ 8) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K1 · tayanch 5 · TechCrunch, 25.03.2024 («started by setting up its logistics, a fleet, and established pickup points to offer next-day deliveries»).
// 3/3 bosqich gapi — bankdagi faktdan mantiqiy izoh (telefon ekranida mashina ko'rinmaydi), yangi fakt emas.
const UZUM_BOSQICH = [
  { h: { uz: 'Bungacha', ru: 'До этого' }, m: { uz: "Uzum — narsani telefonda tanlasangiz, yetkazib beradigan internet-magazin. Bungacha odamlar ko'pincha Instagram va Telegram guruhlari orqali xarid qilgan.", ru: 'Uzum — интернет-магазин: вы выбираете вещь в телефоне, а он её доставляет. До этого люди часто покупали через группы в Instagram и Telegram.' } },
  { h: { uz: '2022-yil oktabr · ishga tushdi', ru: 'Октябрь 2022 · запуск' }, m: { uz: "Uzum 2022-yil oktabrda ishga tushgan. U saytdan emas, yetkazib berishdan boshlagan: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish.", ru: 'Uzum запустился в октябре 2022 года. Он начал не с сайта, а с доставки: свои машины, пункты выдачи и доставка на следующий день.' } },
  { h: { uz: "Ekranda ko'rinmaydigan qism", ru: 'Часть, которой не видно на экране' }, m: { uz: "Xaridor telefonda faqat ekranni ko'radi. Mashina va topshirish punkti ekranda yo'q, lekin buyurtma ular orqali yetib keladi.", ru: 'Покупатель видит в телефоне только экран. Машины и пункта выдачи на экране нет, но заказ приходит через них.' } }
];
const UZ_TAXMIN = [
  { k: 'ertasi', ok: true, t: { uz: 'Ertasi kuni', ru: 'На следующий день' } },
  { k: 'uch', t: { uz: 'Uch kunda', ru: 'За три дня' } },
  { k: 'hafta', t: { uz: 'Bir haftada', ru: 'За неделю' } }
];
const UZ_SAVOL = { uz: 'Uzum boshida buyurtmani qachon yetkazgan?', ru: 'Когда Uzum вначале доставлял заказ?' };
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [xv, setXv] = useState(!!storedAnswer);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!done || xv) return undefined; const t = setTimeout(() => setXv(true), kamHarakat() ? 0 : 1700); return () => clearTimeout(t); }, [done, xv]);
  // Bashorat tanlangach keyingi bosqich o'zi ochiladi (SABOQ 34 — yashirin bosish yo'q)
  useEffect(() => { if (!taxmin || b !== 0 || storedAnswer) return undefined; const t = setTimeout(() => setB(1), kamHarakat() ? 0 : 900); return () => clearTimeout(t); }, [taxmin]); // eslint-disable-line
  const bq = UZUM_BOSQICH[b];
  const kutish = b === 0 && !taxmin && !isMentor;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const tx = UZ_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Uzum /> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || (done && !xv)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Uzum /> ishni telefon ekranidan <A>boshlaganmi?</A></>, ru: <><Uzum /> начал работу <A>с экрана телефона?</A></> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="rm-nuq"><span className="rm-nuq-l">{yorliq}</span>{UZUM_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="rm-voqea">
          <span className="rm-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><UzumSahna b={b} /></Zoomable>
          {kutish && <div className="rm-bash"><QBashorat yorliq={yorliq} savol={tr(UZ_SAVOL)} variantlar={UZ_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          {taxmin && !(done && xv) && <BashQator savol={tr(UZ_SAVOL)} javob={tr(tx.t)} />}
          {done && xv && <QXulosa>{tx && <TaxminQator togri={!!tx.ok} javob={tr(tx.t).toLowerCase()} haqiqat={tr({ uz: 'ertasi kuni', ru: 'на следующий день' })} />}{tr({ uz: 'Uzum ishni saytdan emas, yetkazib berishdan boshlagan — bu qism ekranda ko\'rinmaydi.', ru: 'Uzum начал не с сайта, а с доставки — этой части не видно на экране.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Uzum voqeasi o'quvchilarga oldingi modullardan tanish («Muammodan yechimga», «Hamma birdan kirsa, sayt chidaydimi?», «Bir yilda nimalarni qurdingiz?» darslari) — bugungi savol boshqa: birinchi ish ekranda ko'rinadimi. «Unicorn», kompaniya bahosi va foydalanuvchilar sonini aytmang. «Saytdan emas» — sayt bo'lmagan degani emas (2/3 sahnada ilova ham bor): birinchi tayyorlangan narsa — yetkazib berish. Bu har mahsulotda «avval Backend» degani ham emas. Sinfdan so'rang: «Sizning mahsulotingizda ekranda ko'rinmaydigan qaysi qism kerak?»", ru: 'История Uzum знакома ученикам по прошлым модулям (уроки «От проблемы к решению», «Выдержит ли сайт, если зайдут все сразу?», «Что вы построили за год?») — сегодня вопрос другой: видна ли первая работа на экране. Не говорите про «единорога», оценку компании и число пользователей. «Не с сайта» — не значит, что сайта не было (на сцене 2/3 есть и приложение): первым подготовили доставку. Это и не значит «сначала Backend» в каждом продукте. Спросите класс: «Какая невидимая на экране часть нужна вашему продукту?»' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s7 = 3; Uzum → Mentor rejasi) =====
const S7Viz = () => <UfqDoska kichik faqatHozir hozir={MENTOR_TARTIB.slice(0, 3).map(x => ({ ...x, key: x.id }))} poydevorOn bog />;
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Uzum va roadmap', ru: 'Проверка · Uzum и roadmap' })}
    questionText="Uzum saytdan emas, yetkazib berishdan boshlagan. Mentor «Hozir»ni nimadan boshlaydi?"
    question={tr({ uz: <h2 className="title h-ask"><Uzum /> saytdan emas, yetkazib berishdan boshlagan. <A>Mentor «Hozir»ni nimadan boshlaydi?</A></h2>, ru: <h2 className="title h-ask"><Uzum /> начал не с сайта, а с доставки. <A>С чего Ментор начнёт «Сейчас»?</A></h2> })}
    options={[
      { uz: 'RICE bo\'yicha eng yuqori funksiyadan', ru: 'С самой верхней функции по RICE' },
      { uz: "Ekranda eng ko'p ko'rinadigan qismdan", ru: 'С части, которую больше всего видно на экране' },
      { uz: 'Mehnati eng kichik bo\'lgan ishdan', ru: "С работы, где меньше всего усилий" },
      { uz: 'Har funksiya tayanadigan poydevordan', ru: 'С фундамента, на который опирается каждая функция' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Poydevor RICE ga kirmaydi va birinchi turadi: busiz hech bir funksiya ishlamaydi.', ru: 'Фундамент не входит в RICE и стоит первым: без него ни одна функция не работает.' }}
    explainWrong={{
      0: { uz: 'Bu funksiya poydevordan keyin boshlanadi.', ru: 'Эта функция начинается после фундамента.' },
      1: { uz: "Ko'rinish emas — boshqa ishlar nimaga tayanadi?", ru: 'Дело не в видимости — на что опираются другие работы?' },
      2: { uz: 'Mehnat RICE bo\'lagi, poydevor esa RICE ga kirmaydi.', ru: 'Усилия — часть RICE, а фундамент в RICE не входит.' },
      default: { uz: "Uzum ham ko'rinmaydigan qismdan boshlagan.", ru: 'Uzum тоже начал с невидимой части.' }
    }}
    vizual={<S7Viz />} />
);

// ===== O'quvchi ishlari: o'qiydi pm-m9d5-prd (funksiyalar [3], keyin [1–3]) · yozadi pm-m9d6-roadmap (tayanch 8; ishlar tartibi o'zgarmaydi — yangi ish oxiriga) =====
const ROADMAP_KEY = 'pm-m9d6-roadmap';
const matnOl = (s) => String(typeof s === 'string' ? s : (s && (s.nom || s.matn || s.t)) || '').trim();
const prdIshlar = () => {
  const p = lsGet('pm-m9d5-prd');
  if (!p || typeof p !== 'object') return null;
  const f = Array.isArray(p.funksiyalar) ? p.funksiyalar.map(matnOl).filter(Boolean).slice(0, 3) : [];
  let k = p.keyin;
  if (typeof k === 'string') k = k.split(/[,·\n]+/);
  k = Array.isArray(k) ? k.map(matnOl).filter(Boolean).slice(0, 3) : [];
  if (!f.length && !k.length) return null;
  return [...f.map(nom => ({ nom, turi: 'asosiy' })), ...k.map(nom => ({ nom, turi: 'keyin' }))];
};
const roadmapLs = () => { const v = lsGet(ROADMAP_KEY); return v && Array.isArray(v.ishlar) && v.ishlar.length ? v : null; };
const yangiIsh = (nom = '', turi = 'asosiy') => ({ nom, turi, qamrov: '', tasir: null, ishonch: null, mehnat: '', rice: null, saqlandi: false });
// Saqlash — faqat saqlangan ishlar; ufq, sabab va hozir (10-ekran) o'zgarmaydi, agar bu chaqiruv ularni bermasa
const roadmapYoz = (ishlar, hozir) => {
  const eski = roadmapLs();
  const s = ishlar.filter(x => x.saqlandi !== false);
  const h = Array.isArray(hozir) ? hozir : (eski && Array.isArray(eski.hozir) ? eski.hozir.filter(i => i < s.length) : []);
  lsSet(ROADMAP_KEY, { ishlar: s.map(x => ({ nom: x.nom, qamrov: sonOl(x.qamrov), tasir: x.tasir, ishonch: x.ishonch, mehnat: sonOl(x.mehnat), rice: x.rice, ufq: x.ufq || null, turi: x.turi, sabab: x.sabab || '' })), hozir: h, savedAt: Date.now() });
};
const lsIshlar = () => { const r = roadmapLs(); return r ? r.ishlar.map(x => ({ ...x, nom: matnOl(x.nom), qamrov: String(x.qamrov ?? ''), mehnat: String(x.mehnat ?? ''), saqlandi: true })) : []; };
const tartibla = (ro) => ro.map((x, i) => ({ x, i })).filter(o => o.x.saqlandi !== false).sort((a, b) => (b.x.rice - a.x.rice) || (a.i - b.i));
// 2-darsdagi ikki g'oya qamrovi — yordam qatori (TAYANCHGA SAVOL 2): pm-m9d2-rice.ikkita → baho, nomi — pm-m9d1-goyalar[goya].yechim (qisqa «…»)
const qisqa = (s, n = 22) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; };
const qamrovYordam = () => {
  const r = lsGet('pm-m9d2-rice'), gy = lsGet('pm-m9d1-goyalar');
  if (!r || !Array.isArray(r.ikkita) || !Array.isArray(r.baho)) return null;
  const goy = gy && Array.isArray(gy.goyalar) ? gy.goyalar : [];
  const q = r.ikkita.map(i => { const b = r.baho.find(x => x && x.goya === i); const y = goy[i] && goy[i].yechim; return b && y ? `${qisqa(y)} — ${sonT(b.qamrov)}` : null; }).filter(Boolean);
  return q.length ? q.join(' · ') : null;
};
// Roadmap'im strip (U-042): 10-ekrandan; 11 va 15-ekranlarda
const stripSon = () => { const r = roadmapLs(); if (!r || !r.ishlar.some(x => x.ufq)) return null; return UFQLAR.map(u => r.ishlar.filter(x => x.ufq === u.id).length); };
const RoadmapStrip = ({ son }) => {
  const s = son || stripSon();
  if (!s) return null;
  return <div className="rm-strip fade-step"><span className="rm-strip-l">{tr({ uz: "Roadmap'im", ru: 'Мой roadmap' })}</span>{s.map((v, i) => <span key={i} className={cxx('rm-strip-z', UFQLAR[i].id)}><i>{tr(UFQLAR[i].nom)}</i><b>{v}</b></span>)}</div>;
};
const TASIR = [{ v: 3, t: { uz: 'juda katta', ru: 'очень большое' } }, { v: 2, t: { uz: 'katta', ru: 'большое' } }, { v: 1, t: { uz: "o'rta", ru: 'среднее' } }, { v: 0.5, t: { uz: 'kichik', ru: 'малое' } }, { v: 0.25, t: { uz: 'juda kichik', ru: 'очень малое' } }];
const ISHONCH = [1, 0.8, 0.5];
const TanlovQator = ({ yorliq, qiymatlar, tanlov, onTanla, halqaOn, izohli, silk }) => (
  <div className="rm-fq">
    <span className="rm-fq-l">{yorliq}</span>
    <div className={cxx('rm-fq-t', halqaOn && 'rm-guruh', silk && 'q-silk')} key={silk || 'x'}>
      {qiymatlar.map(o => <span key={o.v} className="rm-fq-o"><QChip holat={tanlov === o.v ? 'on' : undefined} onClick={() => onTanla(o.v)}>{o.l}</QChip>{izohli && <i>{tr(o.t)}</i>}</span>)}
    </div>
  </div>
);

// ===== SCREEN 8 — ISHLARINGIZGA RICE (QMustaqil, USTAXONA 1 — bitta katta karta, saqlangani ro'yxatga uchadi; SABOQ 9, 13, 17, 29) · nishon riceRanker (≥4) =====
const XATO8 = {
  bosh: { uz: 'Qamrov va mehnatni son bilan yozing.', ru: 'Напишите охват и усилия числом.' },
  tanla: { uz: "Ta'sir va ishonchni tanlang.", ru: 'Выберите влияние и уверенность.' },
  yuz: { uz: "Bu kursda 100% — o'lchangan raqam uchun. Dalilingiz bormi?", ru: 'В этом курсе 100% — для измеренного числа. У вас есть доказательство?' },
  olti: { uz: "Bu modulda bitta ishga 6 haftadan ko'p — bo'lsa bo'ladimi?", ru: 'В этом модуле больше 6 недель на одну работу — так можно?' }
};
const QOLDIR8 = { uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: 'Если оставить так — снова нажмите «Сохранить».' };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const YORDAM_T = { uz: 'Yordam', ru: 'Подсказка' };
const tekshir8 = (g) => {
  const q = sonOl(g.qamrov), m = sonOl(g.mehnat);
  if (!(q > 0) || !(m > 0)) return { tur: 'bosh', blok: true, k: !(q > 0) ? 'qamrov' : 'mehnat' };
  if (g.tasir === null || g.tasir === undefined || g.ishonch === null || g.ishonch === undefined) return { tur: 'tanla', blok: true, k: g.tasir === null || g.tasir === undefined ? 'tasir' : 'ishonch' };
  if (g.ishonch === 1) return { tur: 'yuz', k: 'ishonch' };
  if (m > 6) return { tur: 'olti', k: 'mehnat' };
  return null;
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [ishlar, setIshlar] = useState(() => {
    const r = lsIshlar();
    if (r.length) return r;
    const p = prdIshlar();
    return p ? p.map(x => yangiIsh(x.nom, x.turi)) : [yangiIsh(), yangiIsh(), yangiIsh()];
  });
  const [prdYoq] = useState(() => !roadmapLs() && !prdIshlar());
  const [yordamQ] = useState(qamrovYordam);
  const [tahrir, setTahrir] = useState(null);
  const [xato, setXato] = useState(null);
  const [yangi, setYangi] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [kartaK, setKartaK] = useState(0);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const joriyI = tahrir !== null ? tahrir : ishlar.findIndex(x => !x.saqlandi);
  const g = joriyI >= 0 ? ishlar[joriyI] : null;
  const N = ishlar.length;
  const n = ishlar.filter(x => x.saqlandi).length;
  const done = joriyI < 0;
  const tartib = tartibla(ishlar);
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => {
    if (!done || isMentor) return;
    if (!(storedAnswer && storedAnswer.soni === n)) onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'ishlar', solved: true, picked: true, correct: n >= 4, soni: n });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'ishlar', n, true, 0);
  }, [done, n]); // eslint-disable-line
  const setG = (f) => { setIshlar(ro => ro.map((x, i) => (i === joriyI ? { ...x, ...f } : x))); if (xato) setXato(null); };
  const saqla = () => {
    if (!g || !String(g.nom).trim()) return;
    const t = tekshir8(g);
    const imzo = t && `${t.tur}|${g.qamrov}|${g.mehnat}|${g.ishonch}`;
    if (t && (t.blok || !(xato && xato.imzo === imzo))) { setXato({ ...t, imzo, kk: Date.now() }); return; }
    setXato(null);
    const q = sonOl(g.qamrov), m = sonOl(g.mehnat);
    const yg = { ...g, nom: String(g.nom).trim(), qamrov: String(q), mehnat: String(m), rice: riceHisob(q, g.tasir, g.ishonch, m), saqlandi: true };
    const ro = ishlar.map((x, i) => (i === joriyI ? yg : x));
    uch(kartaRef.current, 's8-' + joriyI, 640);
    setIshlar(ro); roadmapYoz(ro); setYangi(joriyI); setTahrir(null); setYordam(false); setKartaK(k => k + 1);
  };
  const yana = () => { if (N >= 6) return; setIshlar(ro => [...ro, yangiIsh('', 'keyin')]); setTahrir(null); setKartaK(k => k + 1); };
  const ochTahrir = (i) => { if (isMentor) return; setTahrir(i); setXato(null); setKartaK(k => k + 1); };
  const navbat = g && (!(sonOl(g.qamrov) > 0) ? 'q' : g.tasir === null ? 't' : g.ishonch === null ? 'i' : !(sonOl(g.mehnat) > 0) ? 'm' : 's');
  const xk = xato && xato.k;
  const xatoQ = (k) => xk === k && <div className="rm-xq"><QXato>{tr(XATO8[xato.tur])}</QXato>{!xato.blok && <QIzoh>{tr(QOLDIR8)}</QIzoh>}</div>;
  // Xulosa (o'quvchi ma'lumotidan, P-046)
  let xulosa = null, qoshimcha = null;
  if (done && tartib.length) {
    const bir = tartib[0].x.nom, oxir = tartib[tartib.length - 1].x.nom;
    xulosa = tr({ uz: `Tartibingiz tayyor: birinchi — «${bir}», oxirgi — «${oxir}».`, ru: `Ваш порядок готов: первая — «${bir}», последняя — «${oxir}».` });
    const pastAsosiy = tartib.reduce((m, o, k) => (o.x.turi === 'asosiy' ? k : m), -1);
    const yuqori = tartib.find((o, k) => o.x.turi === 'keyin' && k < pastAsosiy);
    if (yuqori) qoshimcha = tr({ uz: `«${yuqori.x.nom}» «Keyin» qutisidan, lekin RICE bo'yicha asosiy funksiyadan yuqori.`, ru: `«${yuqori.x.nom}» — из коробки «Потом», но по RICE выше основной функции.` });
  }
  const royxat = (
    <div className={cxx('rm-royxat', done && 'keng')}>
      <div className="rm-royxat-h"><span className="rm-yorliq">{tr({ uz: "Ishlarim · RICE bo'yicha tartib", ru: 'Мои работы · порядок по RICE' })}</span><b className={cxx('rm-royxat-son', done && 'toliq')} key={n}>{n} / {N}</b></div>
      {tartib.length > 0 && <ol className="rm-tartib-ro">{tartib.map((o, k) => (
        <li key={o.i}><IshKarta kor="ixcham" n={k + 1} ish={o.x} uch={'s8-' + o.i} yangi={yangi === o.i} faol={tahrir === o.i}
          ong={!isMentor && <><span className="rm-kul">{tr(TURI[o.x.turi])}</span><button type="button" className="rm-tuz-b" aria-label="✎" onClick={() => ochTahrir(o.i)}>✎</button></>} /></li>
      ))}</ol>}
    </div>
  );
  const forma = g && (
    <div className="rm-s8-k" key={kartaK} ref={kartaRef}>
      <div className="rm-katta">
        {prdYoq && joriyI === 0 && !String(g.nom).trim() && <p className="rm-kul-q">{tr({ uz: "PRD topilmadi — ishlaringizni o'zingiz yozing.", ru: 'PRD не найден — напишите свои работы сами.' })}</p>}
        <div className="rm-katta-bosh">
          <input className={cxx('rm-inp nom', !String(g.nom).trim() && 'rm-halqa-i')} value={g.nom} placeholder={tr({ uz: 'Ish nomi', ru: 'Название работы' })} aria-label={tr({ uz: 'Ish nomi', ru: 'Название работы' })} onChange={(e) => setG({ nom: e.target.value })} />
          <span className="rm-kul">{tr(TURI[g.turi])}</span>
        </div>
        <div className="rm-fq">
          <span className="rm-fq-l">{tr({ uz: 'Qamrov', ru: 'Охват' })}</span>
          <div className="rm-fq-t col">
            <input key={xk === 'qamrov' ? xato.kk : 'q'} className={cxx('rm-inp son', navbat === 'q' && 'rm-halqa-i', xk === 'qamrov' && 'xato')} inputMode="decimal" value={g.qamrov} placeholder={tr({ uz: 'Oyiga nechta odam?', ru: 'Сколько людей в месяц?' })} onChange={(e) => setG({ qamrov: e.target.value })} />
            {yordamQ && <span className="rm-kul-q">{tr({ uz: "2-darsda g'oyalaringiz qamrovi:", ru: 'Охват ваших идей во 2-м уроке:' })} {yordamQ}</span>}
          </div>
        </div>
        {xatoQ('qamrov')}
        <TanlovQator yorliq={tr({ uz: "Ta'sir", ru: 'Влияние' })} izohli qiymatlar={TASIR.map(o => ({ ...o, l: sonT(o.v) }))} tanlov={g.tasir} onTanla={(v) => setG({ tasir: v })} halqaOn={navbat === 't'} silk={xk === 'tasir' && xato.kk} />
        {xatoQ('tasir')}
        <TanlovQator yorliq={tr({ uz: 'Ishonch', ru: 'Уверенность' })} qiymatlar={ISHONCH.map(v => ({ v, l: foizT(v) }))} tanlov={g.ishonch} onTanla={(v) => setG({ ishonch: v })} halqaOn={navbat === 'i'} silk={(xk === 'ishonch') && xato.kk} />
        {xatoQ('ishonch')}
        <div className="rm-fq">
          <span className="rm-fq-l">{tr({ uz: 'Mehnat', ru: 'Усилия' })}</span>
          <div className="rm-fq-t"><input key={xk === 'mehnat' ? xato.kk : 'm'} className={cxx('rm-inp son', navbat === 'm' && 'rm-halqa-i', xk === 'mehnat' && 'xato')} inputMode="decimal" value={g.mehnat} placeholder={tr({ uz: 'Necha hafta?', ru: 'Сколько недель?' })} onChange={(e) => setG({ mehnat: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} /></div>
        </div>
        {xatoQ('mehnat')}
        <FormulaKarta kichik k={kartaK} ish={{ qamrov: sonOl(g.qamrov) > 0 ? sonOl(g.qamrov) : '', tasir: g.tasir, ishonch: g.ishonch, mehnat: sonOl(g.mehnat) > 0 ? sonOl(g.mehnat) : '' }} />
        <div className="rm-amal">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
          <span className="rm-amal-o">
            {N < 6 && <QTugma ikkinchi className="rm-yana" onClick={yana}>{tr({ uz: "+ Yana ish qo'shish", ru: '+ Добавить ещё работу' })}</QTugma>}
            <QTugma className={halqa(navbat === 's' && String(g.nom).trim())} disabled={!String(g.nom).trim()} onClick={saqla}>{tr(SAQLASH)}</QTugma>
          </span>
        </div>
      </div>
      {yordam && <div className="rm-yordam fade-step">
        <QIzoh>{tr({ uz: "Qamrov — funksiyani bir oyda nechta odam ishlatadi. Ta'sir — taxmin: funksiya bitta odamning muammosini qanchalik yengillashtiradi. Ishonch — raqamlaringizga qanchalik ishonasiz: dalil qancha kam bo'lsa, shuncha past.", ru: 'Охват — сколько людей пользуется функцией за месяц. Влияние — предположение: насколько функция облегчает проблему одного человека. Уверенность — насколько вы доверяете своим числам: чем меньше доказательств, тем она ниже.' })}</QIzoh>
        <QIzoh>{tr({ uz: "Mehnat — bitta odam uni necha haftada quradi. Bir mahsulotning funksiyalarida qamrov yaqin bo'lishi mumkin — Mentor misolida uchalasida 60.", ru: 'Усилия — за сколько недель её построит один человек. У функций одного продукта охват может быть близким — в примере Ментора у всех трёх 60.' })}</QIzoh>
      </div>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (__lang === 'ru' ? `Ещё ${N - n}: посчитайте RICE` : `Yana ${N - n} ta ishga RICE`)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>PRD dagi har ishga <A>RICE ni hisoblang.</A></>, ru: <>Посчитайте <A>RICE для каждой работы</A> из PRD.</> })}
        mentor={<Mentor>{tr({ uz: "Har kartada qamrov va mehnatni yozing, ta'sir va ishonchni tanlang — RICE o'zi chiqadi.", ru: 'На каждой карточке напишите охват и усилия, выберите влияние и уверенность — RICE посчитается сам.' })}</Mentor>}
        qadamlar={isMentor
          ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: 'RICE ni hisoblaganlar', ru: 'Посчитали RICE' }, { uz: 'Kamida 4 ish yozganlar', ru: 'Написали не меньше 4 работ' }]} hisob={(rows, jami) => [`${rows.length} / ${jami}`, String(rows.filter(r => r.picked >= 4).length)]} />
            <div className="rm-royxat keng"><div className="rm-royxat-h"><span className="rm-yorliq">{tr({ uz: "Mentorning ishlari · RICE bo'yicha tartib", ru: 'Работы Ментора · порядок по RICE' })}</span><b className="rm-royxat-son toliq">6 / 6</b></div><ol className="rm-tartib-ro">{MENTOR_TARTIB.map((x, i) => <li key={x.id}><IshKarta kor="ixcham" n={i + 1} ish={x} ong={<span className="rm-kul">{tr(TURI[x.turi])}</span>} /></li>)}</ol></div></>
          : royxat}
        forma={!isMentor && !done && forma}
      >
        {done && !isMentor && xulosa && <QXulosa>{xulosa}</QXulosa>}
        {done && !isMentor && qoshimcha && <p className="rm-kul-q">{qoshimcha}</p>}
        {done && !isMentor && N < 6 && <div className="rm-yana-w"><QTugma ikkinchi className="rm-yana" onClick={yana}>{tr({ uz: "+ Yana ish qo'shish", ru: '+ Добавить ещё работу' })}</QTugma></div>}
        <MentorNote>{tr({ uz: "Taymer yo'q — 15 daqiqadan keyin juftlikka o'ting. Eng ko'p savol — «qamrovni qayerdan bilaman?»: intervyudagi odamlar va guruhdagi o'yinchilar kabi tanish sondan boshlansin; qamrovda son chegarasi yo'q. Ishonch 100% bergan o'quvchidan «qayerdan bilasiz?» deb so'rang — bu taqiq emas, dalil savoli.", ru: 'Таймера нет — через 15 минут переходите к работе в парах. Самый частый вопрос — «откуда я знаю охват?»: пусть начнут со знакомого числа — люди из интервью, игроки в группе; ограничения числа в охвате нет. Ученика, поставившего уверенность 100%, спросите «откуда вы знаете?» — это не запрет, а вопрос о доказательстве.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — BIR ISHGA IKKI RICE (QMustaqil, juftlik 3 qadam; P-057 solishtirish sahnasi) · yangi kalit yo'q · nishon pairScore =====
const S9_QADAM = {
  juft: [{ uz: 'Ishni tanlang', ru: 'Выберите работу' }, { uz: 'Sherigingiz belgilaydi', ru: 'Отмечает партнёр' }, { uz: 'Solishtiring', ru: 'Сравните' }],
  yakka: [{ uz: "Ishni o'qing", ru: 'Прочитайте работу' }, { uz: 'Belgilang', ru: 'Отметьте' }, { uz: 'Solishtiring', ru: 'Сравните' }]
};
const MENTOR_TASDIQ = MENTOR_ISHLAR[1];
const Parda = ({ ochiq, children }) => <span className={cxx('rm-parda', ochiq && 'ochiq')}>{children}<i>{tr({ uz: 'yopiq', ru: 'закрыто' })}</i></span>;
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [ishlar, setIshlar] = useState(lsIshlar);
  const juft = isStudent && ishlar.length > 0;
  const yakka = !juft;
  const [tanlangan, setTanlangan] = useState(() => (yakka ? -1 : (storedAnswer?.ish ?? null)));
  const [sh, setSh] = useState(() => storedAnswer?.sherik || { tasir: null, ishonch: null });
  const [saqlandi, setSaqlandi] = useState(!!storedAnswer);
  const [ochildi, setOchildi] = useState(!!storedAnswer || isMentor);
  const [tuzat, setTuzat] = useState(null);
  const ish = yakka ? MENTOR_TASDIQ : (tanlangan !== null ? ishlar[tanlangan] : null);
  const r2 = sh.tasir !== null && sh.ishonch !== null && ish ? riceHisob(sonOl(ish.qamrov), sh.tasir, sh.ishonch, sonOl(ish.mehnat)) : null;
  // «Siz» — juftlikda o'quvchining o'z RICE i (8-ekran); yakkada — o'quvchi belgilagani, «Mentor» — Mentorning raqami
  const siz = yakka ? { tasir: sh.tasir, ishonch: sh.ishonch, rice: r2 } : ish && { tasir: ish.tasir, ishonch: ish.ishonch, rice: ish.rice };
  const u = yakka ? { tasir: MENTOR_TASDIQ.tasir, ishonch: MENTOR_TASDIQ.ishonch, rice: MENTOR_TASDIQ.rice } : { tasir: sh.tasir, ishonch: sh.ishonch, rice: r2 };
  const farq = siz && ochildi ? ['tasir', 'ishonch', 'rice'].filter(k => siz[k] !== u[k]) : [];
  const done = ochildi && !!siz && siz.rice !== null && u.rice !== null;
  useEffect(() => {
    if (!done || isMentor || storedAnswer) return;
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, practice: 'juftlik', solved: true, picked: true, correct: true, ish: tanlangan, sherik: sh, birXil: farq.length === 0 });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'juftlik', farq.length === 0 ? 1 : 2, true, 0);
  }, [done]); // eslint-disable-line
  const qadam = ochildi ? 2 : (yakka ? (saqlandi ? 2 : 1) : (tanlangan === null ? 0 : saqlandi ? 2 : 1));
  const tolaSh = sh.tasir !== null && sh.ishonch !== null;
  const tuzatSaqla = () => {
    if (!tuzat || tanlangan === null) return;
    const ro = ishlar.map((x, i) => (i === tanlangan ? { ...x, tasir: tuzat.tasir, ishonch: tuzat.ishonch, rice: riceHisob(sonOl(x.qamrov), tuzat.tasir, tuzat.ishonch, sonOl(x.mehnat)) } : x));
    setIshlar(ro); roadmapYoz(ro); setTuzat(null);
  };
  const sozT = (k, v) => (v === null || v === undefined ? '' : k === 'ishonch' ? foizT(v) : sonT(v));
  const Ustun = ({ nom, d, kim }) => (
    <div className={cxx('rm-sol-u', kim)}>
      <span className="rm-sol-h">{nom}</span>
      {['tasir', 'ishonch', 'rice'].map(k => <span key={k} className={cxx('rm-sol-k', farq.includes(k) && 'farq')}><i>{k === 'rice' ? 'RICE' : tr(BOLAK.find(b => b.k === k).t)}</i><b>{sozT(k, d[k])}</b></span>)}
    </div>
  );
  const yop = yakka ? u : siz; // parda ostida: yakkada — Mentorning raqamlari, juftlikda — o'quvchining o'zi (sherik ko'rmaydi)
  const karta = ish && (
    <div className="rm-katta rm-s9-k fade-step">
      <div className="rm-katta-bosh"><span className="rm-ish-nom">{nomT(ish)}</span><span className="rm-kul">{yakka ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : tr(TURI[ish.turi])}</span></div>
      <span className="rm-ish-kat">
        <span className="rm-kat"><i>{tr(BOLAK[0].t)}</i><b>{sonT(ish.qamrov)}</b></span>
        <span className="rm-kat"><i>{tr(BOLAK[3].t)}</i><b>{sonT(ish.mehnat)}</b></span>
        <Parda ochiq={ochildi}><span className="rm-kat"><i>{tr(BOLAK[1].t)}</i><b>{sozT('tasir', yop && yop.tasir)}</b></span></Parda>
        <Parda ochiq={ochildi}><span className="rm-kat"><i>{tr(BOLAK[2].t)}</i><b>{sozT('ishonch', yop && yop.ishonch)}</b></span></Parda>
        <Parda ochiq={ochildi}><span className="rm-kat rice"><i>RICE</i><b>{sozT('rice', yop && yop.rice)}</b></span></Parda>
      </span>
      {!yakka && !ochildi && <p className="rm-kul-q">{tr({ uz: 'Ishni sherigingizga bir gap bilan tushuntiring.', ru: 'Объясните работу партнёру одной фразой.' })}</p>}
    </div>
  );
  const belgila = ish && !ochildi && !isMentor && (
    <div className="rm-katta rm-s9-b fade-step">
      <span className="rm-yorliq">{yakka ? tr({ uz: 'Siz', ru: 'Вы' }) : tr({ uz: 'Sherigingiz', ru: 'Партнёр' })}</span>
      <TanlovQator yorliq={tr({ uz: "Ta'sir", ru: 'Влияние' })} izohli qiymatlar={TASIR.map(o => ({ ...o, l: sonT(o.v) }))} tanlov={sh.tasir} onTanla={(v) => { if (!saqlandi) setSh(o => ({ ...o, tasir: v })); }} halqaOn={!saqlandi && sh.tasir === null} />
      <TanlovQator yorliq={tr({ uz: 'Ishonch', ru: 'Уверенность' })} qiymatlar={ISHONCH.map(v => ({ v, l: foizT(v) }))} tanlov={sh.ishonch} onTanla={(v) => { if (!saqlandi) setSh(o => ({ ...o, ishonch: v })); }} halqaOn={!saqlandi && sh.tasir !== null && sh.ishonch === null} />
      <div className="rm-amal">
        {!saqlandi
          ? <QTugma className={halqa(tolaSh)} disabled={!tolaSh} onClick={() => setSaqlandi(true)}>{tr(SAQLASH)}</QTugma>
          : <QTugma className="rm-halqa" onClick={() => setOchildi(true)}>{tr({ uz: 'Ochish', ru: 'Открыть' })}</QTugma>}
      </div>
    </div>
  );
  const solish = ochildi && siz && u.rice !== null && (
    <div className="rm-sol fade-step">
      <Ustun nom={tr({ uz: 'Siz', ru: 'Вы' })} d={siz} kim="siz" />
      <span className={cxx('rm-sol-ora', farq.length === 0 && 'teng')} aria-hidden="true" />
      <Ustun nom={yakka ? tr({ uz: 'Mentor', ru: 'Ментор' }) : tr({ uz: 'Sherigingiz', ru: 'Партнёр' })} d={u} kim="u" />
    </div>
  );
  const tuzatish = juft && ochildi && !isMentor && (tuzat
    ? <div className="rm-katta fade-step">
      <TanlovQator yorliq={tr({ uz: "Ta'sir", ru: 'Влияние' })} izohli qiymatlar={TASIR.map(o => ({ ...o, l: sonT(o.v) }))} tanlov={tuzat.tasir} onTanla={(v) => setTuzat(o => ({ ...o, tasir: v }))} />
      <TanlovQator yorliq={tr({ uz: 'Ishonch', ru: 'Уверенность' })} qiymatlar={ISHONCH.map(v => ({ v, l: foizT(v) }))} tanlov={tuzat.ishonch} onTanla={(v) => setTuzat(o => ({ ...o, ishonch: v }))} />
      <div className="rm-amal"><QTugma onClick={tuzatSaqla}>{tr(SAQLASH)}</QTugma></div>
    </div>
    : <div className="rm-yana-w"><QTugma ikkinchi className="rm-yana" onClick={() => setTuzat({ tasir: ish.tasir, ishonch: ish.ishonch })}>{tr({ uz: '✎ Raqamni tuzatish', ru: '✎ Исправить число' })}</QTugma></div>);
  const sarlavha = yakka && !isMentor
    ? tr({ uz: <>Mentorning bir ishiga <A>qanday RICE berasiz?</A></>, ru: <>Какой <A>RICE вы дадите</A> одной работе Ментора?</> })
    : tr({ uz: <>Sherigingiz bir ishga <A>sizdek RICE beradimi?</A></>, ru: <>Даст ли партнёр одной работе <A>такой же RICE, как вы?</A></> });
  return (
    <Stage eyebrow={yakka && !isMentor ? tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' }) : tr({ uz: 'Juftlikda ish', ru: 'Работа в парах' })} screen={screen} scrollSignal={qadam} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Solishtiring', ru: 'Сравните' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={sarlavha}
        mentor={<Mentor>{yakka && !isMentor
          ? tr({ uz: "Mentorning raqamlari yopiq: «O'yin kuni tasdiq»ga ta'sir va ishonchni o'zingiz belgilang.", ru: 'Числа Ментора закрыты: сами отметьте влияние и уверенность для «Подтверждения в день игры».' })
          : tr({ uz: "Bitta ishingizni tanlang: uning ta'siri va ishonchini sherigingiz o'zi belgilaydi.", ru: 'Выберите одну свою работу: её влияние и уверенность партнёр отметит сам.' })}</Mentor>}
        qadamlar={<div className="rm-s9q">
          <QQadamlar joriy={done ? undefined : qadam} qadamlar={(yakka ? S9_QADAM.yakka : S9_QADAM.juft).map(tr)} />
          {isMentor && <MentorSanoq screen={screen} yorliqlar={[{ uz: 'Bir xil', ru: 'Одинаково' }, { uz: 'Farq bor', ru: 'Есть разница' }]} hisob={(rows) => [String(rows.filter(r => r.picked === 1).length), String(rows.filter(r => r.picked === 2).length)]} />}
        </div>}
        forma={<>
          {juft && tanlangan === null && <div className="rm-royxat"><span className="rm-yorliq">{tr({ uz: 'Ishlarim', ru: 'Мои работы' })}</span>
            <ol className="rm-tartib-ro rm-guruh">{tartibla(ishlar).map((o, k) => <li key={o.i}><IshKarta kor="ixcham" n={k + 1} ish={o.x} rice={null} onBos={() => setTanlangan(o.i)} /></li>)}</ol></div>}
          {karta}
          {belgila}
          {solish}
          {tuzatish}
        </>}
      >
        {done && <QXulosa>{farq.length === 0
          ? tr({ uz: 'Baholaringiz bir xil chiqdi; baribir RICE — taxmin.', ru: 'Ваши оценки совпали; и всё же RICE — это предположение.' })
          : tr({ uz: "Bir ishga ikki xil RICE chiqdi: qaysi bo'lakda farq bor — dalilga qayting.", ru: 'У одной работы получилось два разных RICE: где есть разница — вернитесь к доказательствам.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Keyin rollarni almashtiring — sherik o'z ekranida shu ishni qiladi. Farq chiqishi xato emas: ikki odam bir ishni ikki xil ko'radi. 2–3 juftlikdan so'rang: kimning raqami dalilga yaqinroq va nega? Ishonch — dalil bilan o'zgaradigan son.", ru: 'Потом поменяйтесь ролями — партнёр сделает то же на своём экране. Разница — не ошибка: два человека видят одну работу по-разному. Спросите 2–3 пары: чьё число ближе к доказательствам и почему? Уверенность — число, которое меняется вместе с доказательствами.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — UCH UFQQA JOYLASH (QMustaqil, USTAXONA 2 — ketma-ket karta; artefakt pm-m9d6-roadmap) · nishon roadmapReady =====
const XATO10 = {
  tola: { uz: "Bu modulda «Hozir»da uchta ish — har loyiha kuniga bitta.", ru: 'В этом модуле в «Сейчас» три работы — по одной на каждый проектный день.' },
  teskari: { uz: 'Tartibda yuqoriroq ish uzoqroqda qoldi — u nimani kutadi?', ru: "Работа выше по порядку оказалась в более дальнем горизонте — чего она ждёт?" },
  asosiy: { uz: 'Bu PRD dagi asosiy funksiya — nega keyinga qoldi?', ru: 'Это основная функция из PRD — почему её отложили?' },
  keyin: { uz: "Bu ish PRD dagi uchtasidan emas — PRD ni ham yangilang.", ru: 'Эта работа не из трёх в PRD — обновите и PRD.' },
  kam: { uz: "Bu modulda uchta loyiha kuni — «Hozir»ga uchta ish qo'ying.", ru: 'В этом модуле три проектных дня — поставьте в «Сейчас» три работы.' }
};
const QOLDIR10 = { uz: 'Shunday qoldirsangiz — yana bosing.', ru: 'Если оставить так — нажмите ещё раз.' };
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [bosh] = useState(() => roadmapLs());
  const [ishlar, setIshlar] = useState(lsIshlar);
  const [joy, setJoy] = useState(() => { const o = {}; if (bosh && Array.isArray(bosh.hozir) && bosh.hozir.length) bosh.ishlar.forEach((x, i) => { if (x.ufq) o[i] = x.ufq; }); return o; });
  const [hozirT, setHozirT] = useState(() => (bosh && Array.isArray(bosh.hozir) ? bosh.hozir.filter(i => i < bosh.ishlar.length && bosh.ishlar[i].ufq === 'hozir') : []));
  const [saqlandi, setSaqlandi] = useState(() => !!(storedAnswer && bosh && Array.isArray(bosh.hozir) && bosh.hozir.length));
  const [xato, setXato] = useState(null);
  const [sabab, setSabab] = useState('');
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [kartaK, setKartaK] = useState(0);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const tartib = tartibla(ishlar);
  const cur = tartib.find(o => !joy[o.i]);
  const N = tartib.length;
  const joylandi = Object.keys(joy).length;
  const hammasi = N > 0 && !cur;
  const son = UFQLAR.map(u => Object.values(joy).filter(v => v === u.id).length);
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  const joyla = (ufq) => {
    if (!cur) return;
    const x = cur.x;
    if (ufq === 'hozir' && hozirT.length >= 3) { setXato({ tur: 'tola', blok: true, ufq, kk: Date.now() }); return; }
    let t = null;
    if (x.turi === 'asosiy' && ufq !== 'hozir') t = 'asosiy';
    else if (x.turi === 'keyin' && ufq === 'hozir') t = 'keyin';
    else if (tartib.some(o => joy[o.i] && o.x.rice > x.rice && UFQ_I[joy[o.i]] > UFQ_I[ufq])) t = 'teskari';
    const imzo = t && `${t}|${cur.i}|${ufq}`;
    if (t && !(xato && xato.imzo === imzo)) { setXato({ tur: t, imzo, ufq, kk: Date.now() }); return; }
    const sb = t === 'asosiy' || t === 'keyin' ? sabab.trim() : '';
    uch(kartaRef.current, 's10-' + cur.i, 640);
    setIshlar(ro => ro.map((y, i) => (i === cur.i ? { ...y, ufq, sabab: sb || y.sabab || '' } : y)));
    setJoy(j => ({ ...j, [cur.i]: ufq }));
    if (ufq === 'hozir') setHozirT(h => [...h, cur.i].sort((a, b) => (ishlar[b].rice - ishlar[a].rice) || (a - b)));
    setXato(null); setSabab(''); setYangi(cur.i); setKartaK(k => k + 1); setSaqlandi(false);
  };
  const qaytar = (d) => {
    if (isMentor) return;
    setJoy(j => { const o = { ...j }; delete o[d.i]; return o; });
    setHozirT(h => h.filter(i => i !== d.i)); setXato(null); setSaqlandi(false); setKartaK(k => k + 1);
  };
  const almash = (a, b) => { setHozirT(h => { const o = h.slice(); const t = o[a]; o[a] = o[b]; o[b] = t; return o; }); setSaqlandi(false); };
  const saqla = () => {
    if (!hammasi) return;
    if (hozirT.length < 3 && N >= 3) { setXato({ tur: 'kam', blok: true, kk: Date.now() }); return; }
    const ro = ishlar.map((y, i) => ({ ...y, ufq: joy[i] || null }));
    setIshlar(ro); roadmapYoz(ro, hozirT); setSaqlandi(true); setXato(null);
    const keyindan = hozirT.filter(i => ishlar[i].turi === 'keyin').length;
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'roadmap', solved: true, picked: true, correct: hozirT.length === 3, son, keyindan });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'roadmap', keyindan, true, 0);
  };
  const dk = (i) => ({ ...ishlar[i], key: 'u' + i, i, uch: 's10-' + i });
  const doska = isMentor
    ? <UfqDoska {...mentorJoy()} poydevorOn={false} roadmap />
    : <UfqDoska hozir={hozirT.map(dk)} keyinroq={tartib.filter(o => joy[o.i] === 'keyinroq').map(o => dk(o.i))} uzoqroq={tartib.filter(o => joy[o.i] === 'uzoqroq').map(o => dk(o.i))} yangi={yangi === null ? null : 'u' + yangi} onBos={qaytar} onAlmash={almash} roadmap={saqlandi} keng />;
  const xulosa = saqlandi && (() => {
    const q = UFQLAR.map((u, k) => [u, son[k]]).filter(([, v]) => v > 0);
    const qism = (t) => q.map(([u, v]) => tr(t).replace('{u}', u.nom[__lang] || u.nom.uz).replace('{n}', v)).join(', ');
    return tr({ uz: `Roadmap'ingiz tayyor: ${qism({ uz: '«{u}»da {n}', ru: '' })} ta ish.`, ru: `Ваш roadmap готов: ${qism({ uz: '', ru: 'в «{u}» — {n}' })}.` });
  })();
  const label = isMentor || saqlandi || N === 0 ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !hammasi ? tr({ uz: `Ishlarni joylang (${joylandi}/${N})`, ru: `Разложите работы (${joylandi}/${N})` }) : tr(SAQLASH);
  const navOn = isMentor || saqlandi || N === 0 ? onNext : saqla;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · roadmap', ru: 'Самостоятельная работа · roadmap' })} screen={screen} scrollSignal={joylandi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!isMentor && N > 0 && !hammasi} label={label} onClick={navOn} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Ishlaringizni <A>uch ufqqa joylang.</A></>, ru: <>Разложите свои работы <A>по трём горизонтам.</A></> })}
        mentor={<Mentor>{tr({ uz: "RICE bo'yicha yuqoridagi ishdan boshlang va har biriga savol bering: u nimani kutadi?", ru: 'Начните с верхней работы по RICE и задайте каждой вопрос: чего она ждёт?' })}</Mentor>}
        qadamlar={<div className={cxx('rm-s10-d', (hammasi || isMentor) && 'keng')}>
          {isMentor && <MentorSanoq screen={screen} yorliqlar={[{ uz: "Roadmap'ni saqlaganlar", ru: 'Сохранили roadmap' }, { uz: "«Hozir»ga «Keyin»dan ish olganlar", ru: 'Взяли в «Сейчас» работу из «Потом»' }]} hisob={(rows, jami) => [`${rows.length} / ${jami}`, String(rows.filter(r => r.picked > 0).length)]} />}
          {doska}
          {N === 0 && !isMentor && <p className="rm-kul-q">{tr({ uz: 'Avval 9-ekranda ishlaringizga RICE ni hisoblang.', ru: 'Сначала посчитайте RICE своих работ на 9-м экране.' })}</p>}
          {saqlandi && <RoadmapStrip son={son} />}
        </div>}
        forma={!isMentor && cur && <div className="rm-s10-k" key={kartaK} ref={kartaRef}>
          <div className="rm-katta">
            <div className="rm-katta-bosh"><span className="rm-ish-n">{tartib.indexOf(cur) + 1}</span><span className="rm-ish-nom">{cur.x.nom}</span><b className="rm-ish-r">{sonT(cur.x.rice)}</b><span className="rm-kul">{tr(TURI[cur.x.turi])}</span></div>
            <div className={cxx('rm-ufq-t', !xato && 'rm-guruh', xato && xato.blok && 'q-silk')} key={xato ? xato.kk : 'x'}>
              {UFQLAR.map(u => <QChip key={u.id} holat={xato && xato.ufq === u.id ? (xato.blok ? 'err' : 'on') : undefined} onClick={() => joyla(u.id)}><b>{tr(u.nom)}</b> · {tr(u.izoh)}</QChip>)}
            </div>
            {xato && xato.tur !== 'kam' && <div className="rm-xq">
              <QXato>{tr(XATO10[xato.tur])}</QXato>
              {(xato.tur === 'asosiy' || xato.tur === 'keyin') && <div className="rm-fq"><span className="rm-fq-l">{tr({ uz: 'Sabab', ru: 'Причина' })}</span><div className="rm-fq-t"><input className="rm-inp" value={sabab} maxLength={80} onChange={(e) => setSabab(e.target.value)} /></div></div>}
              {!xato.blok && <QIzoh>{tr(QOLDIR10)}</QIzoh>}
            </div>}
          </div>
          <div className="rm-amal"><QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma></div>
          {yordam && <div className="rm-yordam fade-step"><QIzoh>{tr({ uz: "Ikki savol bering: ish RICE bo'yicha nechanchi? Unga kerak narsa 11-Modulda tayyor bo'ladimi? Bir funksiya boshqasiga tayansa — undan keyin turadi (Mentor misolida tasdiq qo'shilishdan keyin).", ru: "Задайте два вопроса: какое место у работы по RICE? Будет ли нужное ей готово в 11-м модуле? Если одна функция опирается на другую — она стоит после неё (в примере Ментора подтверждение — после присоединения)." })}</QIzoh></div>}
        </div>}
      >
        {xato && xato.tur === 'kam' && <QXato>{tr(XATO10.kam)}</QXato>}
        {xulosa && <QXulosa>{xulosa}</QXulosa>}
        <MentorNote>{tr({ uz: "«Hozir»dagi uchta — kurs sig'imi (11, 12, 14-darslar — uchta loyiha kuni), roadmap'ning umumiy qoidasi emas. «Keyin»dan ish «Hozir»ga kirsa — xato emas, lekin PRD ning uchta funksiyasi ham shunga moslanishi kerak: o'quvchiga ayting (5-darsdagi PRD qayta ochiladi). «Uzoqroq» bo'sh qolsa — so'rang: «Bitiruvgacha hammasi sig'adimi?»", ru: 'Три работы в «Сейчас» — вместимость курса (уроки 11, 12, 14 — три проектных дня), а не общее правило roadmap. Если в «Сейчас» попала работа из «Потом» — это не ошибка, но и три функции PRD нужно подстроить: скажите ученику (PRD из 5-го урока открывается заново). Если «Дальше» пустой — спросите: «До выпуска всё поместится?»' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — KOD YOZISH (QKod + HtmlCompiler; tayanch 4, PM-082): Mentorning oltita ishi RICE bo'yicha tartiblanadi → ufq() → uch ustun =====
// Starter oddiy satrlardan yig'iladi (backtik yo'q). Tekshiruv ma'lumotdan mustaqil (SABOQ 37): ufq() o'z namuna obyekti bilan chaqiriladi; node sinovi — scratchpad 06-qurish/kod-sinov.mjs.
// Qatorlar ≤ 70 belgi: «return "uzoqroq";» yonidagi izoh o'z qatoriga ko'chirildi (hisobotda — MD dan chetlashish).
const KOD_IZ = {
  bosh: { uz: ['// Mentor misoli: oltita ish va RICE;', '// kutadi — ish 12-Modulni kutadi'], ru: ['// Пример Ментора: шесть работ и RICE;', '// kutadi — работа ждёт 12-й модуль'] },
  sort: { uz: ["// RICE bo'yicha tartib: kattasi oldinda", '// (bu qator tayyor)'], ru: ['// Порядок по RICE: больший впереди', '// (эта строка готова)'] },
  qayer: { uz: ['  // ish qaysi ustunga tushadi:', '  // "hozir", "keyinroq" yoki "uzoqroq"'], ru: ['  // в какую колонку попадёт работа:', '  // "hozir", "keyinroq" или "uzoqroq"'] },
  soni: { uz: ['  // hozirSoni — «Hozir» ustuniga allaqachon', '  // tushgan ishlar soni'], ru: ['  // hozirSoni — сколько работ уже', '  // попало в колонку «Hozir»'] },
  siz: { uz: ['  // boshida hamma ish shu yerda — shu joyni siz yozasiz'], ru: ['  // сначала все работы здесь — это место пишете вы'] },
  tayyor: { uz: ["// har ish — o'z ustunida (bu qism tayyor)"], ru: ['// каждая работа — в своей колонке (эта часть готова)'] }
};
// ru-qoldiq-istisno s11: hozir bo'lishish o'yin o'yindan va qo'shilish ro'yxat o'zi
const KOD_ISHLAR = [
  'const ishlar = [',
  '  { nom: "Maydon pulini bo\'lishish", rice: 5 },',
  '  { nom: "O\'yin kuni tasdiq", rice: 60 },',
  '  { nom: "O\'yindan oldin eslatma", rice: 15,',
  '    kutadi: "12-Modul" },',
  '  { nom: "O\'yin e\'loni va qo\'shilish", rice: 72 },',
  '  { nom: "Ro\'yxat o\'zi yangilanadi", rice: 10,',
  '    kutadi: "12-Modul" },',
  '  { nom: "Chiqish va navbat", rice: 48 }',
  '];'
];
const kodStarter = (t) => [...KOD_IZ.bosh[t], ...KOD_ISHLAR, '', ...KOD_IZ.sort[t], 'ishlar.sort(function (a, b) { return b.rice - a.rice; });', '',
  'function ufq(ish, hozirSoni) {', ...KOD_IZ.qayer[t], ...KOD_IZ.soni[t], ...KOD_IZ.siz[t], '  return "uzoqroq";', '}', '',
  ...KOD_IZ.tayyor[t], 'let hozirSoni = 0;', 'ishlar.forEach(function (ish) {', '  const u = ufq(ish, hozirSoni);', '  if (u === "hozir") hozirSoni = hozirSoni + 1;',
  '  const p = document.createElement("p");', '  p.textContent = ish.nom + " · " + ish.rice;', '  document.getElementById(u).appendChild(p);', '});', ''].join('\n');
const KOD_STARTER = { uz: kodStarter('uz'), ru: kodStarter('ru') };
const KOD_INDEX = '<h1>Mentorning roadmap\'i</h1>\n<div class="ufq"><h3>Hozir · 11-Modul</h3><p class="poydevor">Poydevor · RICE ga kirmaydi</p><div id="hozir"></div></div>\n<div class="ufq"><h3>Keyinroq · 12–13-Modul</h3><div id="keyinroq"></div></div>\n<div class="ufq"><h3>Uzoqroq · bitiruvdan keyin</h3><div id="uzoqroq"></div></div>\n';
const KOD_SHART_IFODA = [
  ['ufq({ rice: 15, kutadi: "12-Modul" }, 0)', 'keyinroq'],
  ['ufq({ rice: 48 }, 2) + "|" + ufq({ rice: 5 }, 3)', 'hozir|uzoqroq'],
  ['["hozir", "keyinroq", "uzoqroq"].map(function (id) { return document.querySelectorAll("#" + id + " p").length; }).join(",")', '3,2,1']
];
const KOD_VAZIFA = [
  { uz: '12-Modulni kutadigan ish — `"keyinroq"`', ru: 'Работа, которая ждёт 12-й модуль, — `"keyinroq"`' },
  { uz: '«Hozir»da uchtadan kam bo\'lsa — `"hozir"`', ru: 'Если в «Hozir» меньше трёх — `"hozir"`' },
  { uz: 'Qolgani — `"uzoqroq"`', ru: 'Остальные — `"uzoqroq"`' }
];
const KOD_SHART = [
  { uz: '12-Modulni kutadigan ish «Keyinroq»ga tushsin.', ru: 'Пусть работа, ждущая 12-й модуль, попадёт в «Keyinroq».' },
  { uz: '«Hozir»ga uchta ish, to\'rtinchisi «Uzoqroq»ga.', ru: 'В «Hozir» — три работы, четвёртая — в «Uzoqroq».' },
  { uz: 'Ustunlarda 3, 2 va 1 ta ish bo\'lsin.', ru: 'Пусть в колонках будет 3, 2 и 1 работа.' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — ufq funksiyasini yakunlang', ru: 'app.js — допишите функцию ufq' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: '// ish qaysi ustunga tushadi', ru: '// в какую колонку попадёт работа' } },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: 'body{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start}h1{flex-basis:100%;margin:0 0 4px}.ufq{flex:1 1 0;min-width:0;background:#fff;border:1px solid #E7E3F4;border-radius:8px;padding:8px 10px;box-sizing:border-box}.ufq h3{margin:0 0 6px;font-size:14px}.ufq p{background:#fff;border:1px solid #E7E3F4;border-radius:6px;padding:6px 8px;margin:0 0 6px;font-size:13px}.ufq p.poydevor{background:#F2F0FA;color:#565073}',
  requirements: KOD_SHART_IFODA.map((s, i) => ({ id: 'sh' + i, label: { uz: KOD_VAZIFA[i].uz.split('`').join(''), ru: KOD_VAZIFA[i].ru.split('`').join('') }, check: C.evalEquals(s[0], s[1], KOD_SHART[i]) }))
};
const KOD_DARVOZA = [
  { id: 'hozir', t: '`"hozir"`', ok: false, x: { uz: 'Unga kerak narsa 12-Modulda — «Hozir»ga tushmaydi.', ru: 'Нужное ей будет в 12-м модуле — в «Hozir» не попадает.' } },
  { id: 'keyinroq', t: '`"keyinroq"`', ok: true },
  { id: 'uzoqroq', t: '`"uzoqroq"`', ok: false, x: { uz: 'U bitiruvgacha kutmaydi — 12-Modulda boshlanadi.', ru: 'Она ждёт не до выпуска — начнётся в 12-м модуле.' } }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d): darvozadan keyin kutadi: "12-Modul" qatorlari bir lahza ajraladi
const KodNamuna = ({ ajrat }) => {
  const L = tr(KOD_STARTER).split('\n');
  const fn = L.findIndex(l => l.startsWith('function ufq'));
  const parcha = [...L.slice(0, L.indexOf('];') + 1), '  …', ...L.slice(fn, L.indexOf('}', fn) + 1)];
  return (
    <pre className={cxx('rm-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
      {parcha.map((l, i) => {
        if (l.trim().startsWith('//')) return <span key={i} className="rm-kod-iz">{l}{'\n'}</span>;
        const b = l.split(/(kutadi: "12-Modul")/);
        return <span key={i}>{b.map((x, j) => (j % 2 ? <b key={j} className="rm-kod-k">{x}</b> : x))}{'\n'}</span>;
      })}
    </pre>
  );
};
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (9-Modul 1-dars QKOD_ONG yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'keyinroq' : null));
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
        sarlavha={tr({ uz: <>Ishlarni ufqlarga ajratadigan <A>kod yozamiz.</A></>, ru: <>Пишем <A>код</A>, который разделяет работы по горизонтам.</> })}
        mentor={<Mentor>{tr({ uz: "Mentorning oltita ishi kodda ro'yxat bo'lib turibdi: har birini o'z ufqi ustuniga chiqaring.", ru: 'Шесть работ Ментора лежат в коде списком: выведите каждую в колонку её горизонта.' })}</Mentor>}
        vazifa={<>
          {!isMentor && <RoadmapStrip />}
          <div className="rm-darvoza">
            <span className="rm-darvoza-s">{fmtCode(tr({ uz: '`kutadi: "12-Modul"` yozilgan ish qaysi ustunga tushadi?', ru: 'В какую колонку попадёт работа с `kutadi: "12-Modul"`?' }))}</span>
            <div className={cxx('rm-darvoza-ro', !stage2 && 'rm-guruh')}>
              {KOD_DARVOZA.map(g => {
                const silk = miss && miss.id === g.id;
                return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id || (stage2 && g.ok) ? 'ok' : silk ? 'err' : undefined} disabled={stage2 && !g.ok} onClick={() => pickGate(g)}>{fmtCode(g.t)}</QChip>;
              })}
            </div>
            {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
          </div>
          <ol className={cxx('rm-vazifa', !stage2 && 'xira')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cxx(done && 'ok')}><i>{done ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          {done && <QXulosa>{tr({ uz: 'Kod ishlarni tartib va kutishga qarab uch ustunga ajratdi — Mentor doskasidagidek.', ru: 'Код разделил работы на три колонки по порядку и ожиданию — как на доске Ментора.' })}</QXulosa>}
        </>}
        yordam={stage2 && <div className="rm-kyordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: 'Avval kutishni tekshiring: `if (ish.kutadi === "12-Modul") return "keyinroq";`. So\'ng «Hozir» sonini: `hozirSoni < 3`. Qolgan holatda — `return "uzoqroq";`.', ru: 'Сначала проверьте ожидание: `if (ish.kutadi === "12-Modul") return "keyinroq";`. Потом число в «Hozir»: `hozirSoni < 3`. В остальных случаях — `return "uzoqroq";`.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): `sort` — ro'yxatni tartiblaydi (`b.rice - a.rice` — kattasi oldinda) · `return` — funksiya javobini qaytaradi · `if` — shart rost bo'lsa ishlaydi.", ru: 'Напоминание (из уроков JavaScript): `sort` — упорядочивает список (`b.rice - a.rice` — больший впереди) · `return` — возвращает ответ функции · `if` — срабатывает, если условие истинно.' }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="rm-kodoyna">
          {stage2 && <div className="rm-mgap fade-step"><img src={MENTOR_IMG} alt="" aria-hidden="true" /><span>{tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите здесь результат.' })}</span></div>}
          {stage2 && <div className="rm-amal"><QTugma className={halqa(!done && !isMentor)} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          <KodNamuna ajrat={ajrat} />
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        <MentorNote>{tr({ uz: "Kod — 3–4 daqiqalik mashq, yangi qoida yo'q: 4-ekrandagi uch qoida. sort tayyor — u o'zgarmaydi. Tez bajargan o'quvchi o'z ishlaridan birini ro'yxatga qo'shib ko'rsin (shart emas).", ru: 'Код — упражнение на 3–4 минуты, нового правила нет: три правила с 4-го экрана. sort готов — он не меняется. Кто справился быстро, пусть добавит в список одну свою работу (не обязательно).' })}</MentorNote>
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m9d6-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s12 = 0; tartib, sig'im, kutish birga) =====
const S12Viz = () => (
  <div className="rm-s12v">
    <PrdMaket kichik faqat5 on />
    <span className="rm-ikki" aria-hidden="true"><i /></span>
    <UfqDoska kichik faqatHozir hozir={MENTOR_TARTIB.slice(0, 3).map(x => ({ ...x, key: x.id }))} />
  </div>
);
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="PRD da yo'q yangi ish RICE da birinchi chiqdi. Avval nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">PRD da yo'q yangi ish RICE da birinchi chiqdi. <A>Avval nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Новая работа, которой нет в PRD, вышла первой по RICE. <A>Что сделаете сначала?</A></h2> })}
    options={[
      { uz: 'Avval PRD dagi uchta funksiyani qayta ko\'raman', ru: 'Сначала пересмотрю три функции в PRD' },
      { uz: 'Uni «Hozir»ga to\'rtinchi ish qilib qo\'shaman', ru: 'Добавлю её четвёртой работой в «Сейчас»' },
      { uz: "Uni o'chiraman — PRD da yo'q ish kerak emas", ru: 'Удалю её — работа, которой нет в PRD, не нужна' },
      { uz: "Eng pastdagisini surib, uni «Hozir»ga qo'yaman", ru: 'Сдвину самую нижнюю и поставлю её в «Сейчас»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Roadmap PRD dan ajralmaydi: uchta asosiy funksiya o\'zgarsa, PRD ham yangilanadi.', ru: 'Roadmap не отделяется от PRD: если меняются три основные функции, обновляется и PRD.' }}
    explainWrong={{
      1: { uz: "Bu modulda «Hozir»ga uchta ish sig'adi.", ru: 'В этом модуле в «Сейчас» помещаются три работы.' },
      2: { uz: "Yuqori RICE — o'chirishga emas, o'ylashga sabab.", ru: 'Высокий RICE — повод подумать, а не удалить.' },
      3: { uz: "Surish mumkin, lekin avval PRD qayta ko'riladi.", ru: 'Сдвинуть можно, но сначала пересматривают PRD.' },
      default: { uz: "Roadmap'dagi uchta funksiya qaysi hujjatdan keladi?", ru: 'Из какого документа приходят три функции в roadmap?' }
    }}
    vizual={<S12Viz />} />
);

// ===== 🏅 NISHONLAR — ish qilingan ekranlarda, tekin bonus yo'q (S-034); medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  riceRanker: { icon: '📊', name: 'RICE Ranker!', desc: { uz: "Ishlaringizni RICE bo'yicha tartibladingiz", ru: 'Вы упорядочили свои работы по RICE' } },
  pairScore: { icon: '🤝', name: 'Pair Score!', desc: { uz: 'Bir ishga sherigingiz bilan RICE solishtirdingiz', ru: 'Вы сравнили RICE одной работы с партнёром' } },
  roadmapReady: { icon: '🧭', name: 'Roadmap Ready!', desc: { uz: 'Ishlaringizni uch ufqqa joyladingiz', ru: 'Вы разложили свои работы по трём горизонтам' } },
  horizonCoder: { icon: '💻', name: 'Horizon Coder!', desc: { uz: 'Ishlarni kod bilan ufqlarga ajratdingiz', ru: 'Вы разделили работы по горизонтам с помощью кода' } }
};
// Ekran id → nishon (ish bajarilganda correct: true keladi)
const ACH_TRIGGERS = { s8: 'riceRanker', s9: 'pairScore', s10: 'roadmapReady', s11: 'horizonCoder' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 5, 7, 12 — q22)
const Q_LABELS = {
  3: { uz: '1 — Qamrov teng', ru: "1 — Охват одинаковый" },
  5: { uz: '2 — Kutadigan ish', ru: '2 — Работа, которая ждёт' },
  7: { uz: '3 — Uzum va poydevor', ru: '3 — Uzum и фундамент' },
  12: { uz: '4 — PRD va roadmap', ru: '4 — PRD и roadmap' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — darsning lug'ati (R-008: {uz, ru}; emoji va «Frontend/Backend» yo'q)
const QZ_BG_SHAPES = [
  { ch: 'RICE', l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'qamrov', ru: 'охват' }, l: 84, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: "ta'sir", ru: 'влияние' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'ishonch', ru: 'уверенность' }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'mehnat', ru: 'усилия' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'ufq', ru: 'горизонт' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'roadmap', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'poydevor', ru: 'фундамент' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 }
];
// ⚡ Jonli viktorina — 12 savol (MD aynan), ✔ o'rni: A 1·5·10 · B 3·7·12 · C 2·8·11 · D 4·6·9 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'RICE hisobida qamrov nimani bildiradi?', ru: 'Что означает охват в расчёте RICE?' }, opts: [{ uz: 'Oyiga nechta odamga yetib borishini', ru: 'Скольких людей достигает за месяц' }, { uz: 'Bitta odamga qancha foyda berishini', ru: 'Сколько пользы даёт одному человеку' }, { uz: 'Qurishga necha hafta vaqt ketishini', ru: 'Сколько недель уйдёт на постройку' }, { uz: 'Taxminga qanchalik ishonishingizni', ru: 'Насколько вы верите предположению' }], correct: 0 },
  { q: { uz: 'Bu kursda RICE ning mehnati nima bilan o\'lchanadi?', ru: 'Чем в этом курсе измеряются усилия в RICE?' }, opts: [{ uz: 'Butun guruh necha oy ishlashi bilan', ru: 'Сколько месяцев работает вся группа' }, { uz: 'Kodda nechta qator yozilishi bilan', ru: 'Сколько строк кода написано' }, { uz: 'Bitta odam necha hafta ishlashi bilan', ru: 'Сколько недель работает один человек' }, { uz: 'Nechta ekran chizilishi kerakligi bilan', ru: 'Сколько экранов нужно нарисовать' }], correct: 2 },
  { q: { uz: 'Ikki funksiyada faqat mehnat farq qiladi. Qaysi biri tartibda yuqori?', ru: 'У двух функций различаются только усилия. Какая выше в порядке?' }, opts: [{ uz: "Mehnati ko'proq bo'lgan funksiya", ru: 'Функция с большими усилиями' }, { uz: "Mehnati kamroq bo'lgan funksiya", ru: 'Функция с меньшими усилиями' }, { uz: 'PRD da birinchi yozilgan funksiya', ru: 'Функция, записанная в PRD первой' }, { uz: "Ko'proq ko'rinadigan funksiya", ru: 'Функция, которую больше видно' }], correct: 1 },
  { q: { uz: 'Ish «Keyinroq» ufqida turibdi. Bu nimani bildiradi?', ru: 'Работа стоит в горизонте «Позже». Что это значит?' }, opts: [{ uz: '12–13-Modul bo\'yi qilinishini', ru: "Что её делают на протяжении 12–13-го модуля" }, { uz: '12–13-Modulda tugab bo\'lishini', ru: 'Что она закончится в 12–13-м модуле' }, { uz: 'Bitiruvdan keyin boshlanishini', ru: 'Что она начнётся после выпуска' }, { uz: '12–13-Modulda boshlanishini', ru: 'Что она начнётся в 12–13-м модуле' }], correct: 3 },
  { q: { uz: 'Nega poydevor RICE ga kirmaydi?', ru: 'Почему фундамент не входит в RICE?' }, opts: [{ uz: 'Busiz hech bir funksiya ishlamaydi', ru: 'Без него ни одна функция не работает' }, { uz: 'Uni qurish hammadan tez va oson', ru: 'Его строить быстрее и проще всего' }, { uz: "Uni foydalanuvchi ekranda ko'rmaydi", ru: 'Пользователь не видит его на экране' }, { uz: 'U PRD dagi birinchi bo\'limda turadi', ru: 'Он стоит в первом разделе PRD' }], correct: 0 },
  { q: { uz: "O'yin kuni tasdiq qo'shilganlarga tayanadi. U qachon quriladi?", ru: 'Подтверждение в день игры опирается на присоединившихся. Когда его строят?' }, opts: [{ uz: "Qo'shilish funksiyasidan oldin", ru: 'До функции присоединения' }, { uz: "Qo'shilish bilan bir vaqtda", ru: 'Одновременно с присоединением' }, { uz: 'Bitiruvdan keyin, oxirgi bo\'lib', ru: 'После выпуска, последним' }, { uz: "Qo'shilish funksiyasidan keyin", ru: 'После функции присоединения' }], correct: 3 },
  { q: { uz: "«Hozir» ufqiga 11-Modulda nechta funksiya sig'adi?", ru: 'Сколько функций помещается в горизонт «Сейчас» в 11-м модуле?' }, opts: [{ uz: 'Ikkita: qolgani keyingi modulda', ru: 'Две: остальные в следующем модуле' }, { uz: 'Uchta: har loyiha kuniga bitta', ru: 'Три: по одной на каждый проектный день' }, { uz: 'Oltita: PRD dagi hamma ishlar', ru: 'Шесть: все работы из PRD' }, { uz: "To'rtta: poydevor bilan birga", ru: 'Четыре: вместе с фундаментом' }], correct: 1 },
  { q: { uz: "Uzum'da xaridor telefon ekranida nimani ko'rmaydi?", ru: 'Чего покупатель Uzum не видит на экране телефона?' }, opts: [{ uz: "Narsalar ro'yxati va narxini", ru: 'Список вещей и их цену' }, { uz: 'Narsalarning surati va nomini', ru: 'Фото и названия вещей' }, { uz: 'Mashina va topshirish punktini', ru: 'Машину и пункт выдачи' }, { uz: 'Do\'kon nomi va qidiruv qatorini', ru: 'Название магазина и строку поиска' }], correct: 2 },
  { q: { uz: "Uzum'dagidek, rejaning birinchi ishi qanday bo'lishi mumkin?", ru: "Какой может быть первая работа плана, как у Uzum?" }, opts: [{ uz: "Ekranda eng chiroyli ko'rinadigan qism", ru: 'Часть, которая красивее всего на экране' }, { uz: "Reklamada eng ko'p ko'rsatiladigan qism", ru: 'Часть, которую чаще всего показывают в рекламе' }, { uz: 'Eng tez va eng oson quriladigan qism', ru: 'Часть, которую быстрее и проще всего построить' }, { uz: "Ekranda ko'rinmasa ham kerakli qism", ru: 'Нужная часть, даже если её не видно на экране' }], correct: 3 },
  { q: { uz: 'Sherigingiz bir ishga boshqacha RICE berdi. Bu nimani bildiradi?', ru: 'Партнёр дал одной работе другой RICE. Что это значит?' }, opts: [{ uz: 'RICE taxmin ekanini va dalil kerakligini', ru: 'Что RICE — предположение и нужны доказательства' }, { uz: 'Sherigingiz RICE formulasini bilmasligini', ru: 'Что партнёр не знает формулу RICE' }, { uz: "Ishni roadmap'dan o'chirish kerakligini", ru: 'Что работу нужно удалить из roadmap' }, { uz: "Sizning raqamingiz baribir to'g'ri ekanini", ru: 'Что ваше число всё равно верное' }], correct: 0 },
  { q: { uz: "Roadmap'da har ish haqida nima ko'rinadi?", ru: 'Что видно в roadmap о каждой работе?' }, opts: [{ uz: 'Uni sinfdagi qaysi o\'quvchi qurishi', ru: 'Какой ученик класса её построит' }, { uz: 'Unga qancha pul sarflanishi kerakligi', ru: 'Сколько денег на неё нужно потратить' }, { uz: "U qaysi ufqda va qaysi o'rinda turishi", ru: 'В каком горизонте и на каком месте она стоит' }, { uz: 'Unda necha qator kod yozilishi kerakligi', ru: 'Сколько строк кода в ней нужно написать' }], correct: 2 },
  { q: { uz: '«Uzoqroq» ufqidagi ish bilan bitiruvgacha nima bo\'ladi?', ru: 'Что до выпуска будет с работой в горизонте «Дальше»?' }, opts: [{ uz: '«Hozir»dagi ishlar bilan birga quriladi', ru: 'Её построят вместе с работами из «Сейчас»' }, { uz: 'Bitiruvdan keyin boshlanishini kutadi', ru: "Она ждёт старта после выпуска" }, { uz: "Roadmap'dan butunlay o'chirib tashlanadi", ru: 'Её полностью удаляют из roadmap' }, { uz: '12-Modulda birinchi bo\'lib boshlanadi', ru: 'Она начнётся первой в 12-м модуле' }], correct: 1 }
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

// 🃏 KARTOCHKALAR — MD 14-ekran jadvali aynan (12 karta). Mexanika va ko'rinish — qolipda (QKartochka, DE-204); Mentor yo'q (SABOQ 16)
const KARTOCHKALAR = [
  { front: { uz: 'Roadmap nima?', ru: 'Что такое roadmap?' }, back: { uz: "Qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq", ru: 'План, который показывает, какая работа в каком горизонте; у нас — три горизонта до выпуска' } },
  { front: { uz: 'Ufq nima?', ru: 'Что такое горизонт?' }, back: { uz: 'Ishlar qachon boshlanishiga qarab ajratilgan vaqt bo\'lagi', ru: "Отрезок времени, куда работы попадают по тому, когда они начинаются" } },
  { front: { uz: 'Bu modulda uchta ufq qaysilar?', ru: 'Какие три горизонта в этом модуле?' }, back: { uz: '«Hozir» — 11-Modul, «Keyinroq» — 12–13-Modul, «Uzoqroq» — bitiruvdan keyin', ru: '«Сейчас» — 11-й модуль, «Позже» — 12–13-й модуль, «Дальше» — после выпуска' } },
  { front: { uz: 'RICE qanday hisoblanib chiqadi?', ru: 'Как считается RICE?' }, back: { uz: "Qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz", ru: 'Охват умножаете на влияние и уверенность и делите на усилия' } },
  { front: { uz: "Bu kursda mehnat nima bilan o'lchanadi?", ru: 'Чем в этом курсе измеряются усилия?' }, back: { uz: 'Bitta odam necha hafta ishlashi bilan', ru: 'Сколько недель работает один человек' } },
  { front: { uz: "Funksiyalarning qamrovi teng bo'lsa, tartibni nima ajratadi?", ru: "Что определяет порядок, если охват функций одинаковый?" }, back: { uz: "Ta'sir, ishonch va mehnat", ru: 'Влияние, уверенность и усилия' } },
  { front: { uz: 'Nega poydevor RICE ga kirmaydi?', ru: 'Почему фундамент не входит в RICE?' }, back: { uz: 'Busiz hech bir funksiya ishlamaydi — u har funksiyadan oldin turadi', ru: 'Без него ни одна функция не работает — он стоит перед каждой функцией' } },
  { front: { uz: 'RICE bo\'yicha yuqori ish 12-Modulni kutsa, qayerga tushadi?', ru: 'Куда попадёт верхняя по RICE работа, если она ждёт 12-й модуль?' }, back: { uz: "«Keyinroq»qa: unga kerak narsa 12-Modulda tayyor bo'ladi", ru: 'В «Позже»: нужное ей будет готово в 12-м модуле' } },
  { front: { uz: "Bu modulda «Hozir» ufqiga nechta funksiya sig'adi?", ru: 'Сколько функций помещается в горизонт «Сейчас» в этом модуле?' }, back: { uz: 'Uchta: 11-Modulda funksiya uchun uchta loyiha kuni bor', ru: 'Три: в 11-м модуле на функции есть три проектных дня' } },
  { front: { uz: 'Bir funksiya boshqasiga tayansa, qaysi biri oldin quriladi?', ru: 'Если одна функция опирается на другую, какую строят раньше?' }, back: { uz: "Boshqasi tayanadigan funksiya: Mentor misolida qo'shilish tasdiqdan oldin", ru: 'Ту, на которую опирается другая: в примере Ментора присоединение — до подтверждения' } },
  { front: { uz: 'Uzum ishni nimadan boshlagan?', ru: 'С чего Uzum начал работу?' }, back: { uz: "Saytdan emas, yetkazib berishdan: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish", ru: 'Не с сайта, а с доставки: свои машины, пункты выдачи и доставка на следующий день' } },
  { front: { uz: 'Bir ishga ikki odam har xil RICE bersa, bu nimani bildiradi?', ru: 'Что значит, если два человека дали одной работе разный RICE?' }, back: { uz: "RICE — taxmin: farq qilgan bo'lakda dalilga qaytiladi", ru: 'RICE — предположение: в части, где есть разница, возвращаются к доказательствам' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <div className={cxx('rm-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="rm-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'auditoriyadan bir kishi', ru: 'один человек из аудитории' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '3 funksiya', ru: '3 функции' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "«Hozir» ufqidagi uchta funksiyani auditoriyangizdan bir kishiga ayting va so'rang: «Qaysi biri sizga birinchi kerak?»", ru: 'Назовите три функции из горизонта «Сейчас» одному человеку из вашей аудитории и спросите: «Какая из них нужна вам первой?»' },
  { uz: "Javobini yozib oling. Tartibingizdan farq qilsa, «Nega?» deb so'rang — RICE ni faqat yangi dalil chiqsa tahrirlang (✎).", ru: 'Запишите ответ. Если он отличается от вашего порядка, спросите «Почему?» — меняйте RICE, только если появилось новое доказательство (✎).' },
  { uz: "«Hozir»dagi uchta funksiyani o'qing: qaysi biri boshqasiga tayanadi? Tartib shunga mos kelmasa, ↑ ↓ bilan almashtiring.", ru: 'Прочитайте три функции в «Сейчас»: какая опирается на другую? Если порядок не совпадает, поменяйте их местами через ↑ ↓.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card rm-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="rm-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="rm-hw-q"><span className="rm-hw-k">{tr(r.k)}</span><span className="rm-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="rm-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tr(q)}</span></li>)}</ol>
    {keyingi && <span className="rm-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013; kartochkaga qo'shilmaydi). CODE STRIKE va arena — darsda =====
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
  // «Endi siz bilasiz» — bugungi asosiy fikr takrorlanmaydi (T-048)
  const RECAP = [
    { uz: "Roadmap — qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq.", ru: 'Roadmap — план, который показывает, какая работа в каком горизонте; у нас — три горизонта до выпуска.' },
    { uz: "Qamrov teng bo'lsa, tartibni ta'sir, ishonch va mehnat ajratadi.", ru: "Если охват одинаковый, порядок определяют влияние, уверенность и усилия." },
    { uz: 'Poydevor RICE ga kirmaydi: busiz hech bir funksiya ishlamaydi.', ru: 'Фундамент не входит в RICE: без него ни одна функция не работает.' },
    { uz: "Bu modulda «Hozir» ufqiga uchta funksiya sig'adi — har loyiha kuniga bittadan.", ru: 'В этом модуле в горизонт «Сейчас» помещаются три функции — по одной на каждый проектный день.' },
    { uz: 'Uzum ishni saytdan emas, yetkazib berishdan boshlagan.', ru: 'Uzum начал работу не с сайта, а с доставки.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Jonli prototip: qog'ozdan bosiladigan ekrangacha»</b></>, ru: <>Следующий урок — <b>«Живой прототип: от бумаги до кликабельного экрана»</b></> });
  const r = roadmapLs();
  const tayyor = !!(r && Array.isArray(r.hozir) && r.hozir.length && r.ishlar.some(x => x.ufq));
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tayyor || isMentorL
          ? tr({ uz: <>Roadmap'ingiz <A>tayyor</A>.</>, ru: <>Ваш roadmap <A>готов</A>.</> })
          : tr({ uz: <>Roadmap boshlandi — <A>qolgani uyda</A>.</>, ru: <>Roadmap начат — <A>остальное дома</A>.</> })}
        cta={<>
          <div className="rm-fikr fade-up d1"><span className="rm-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="rm-fikr-t small">{tr({ uz: "RICE ishlar tartibini ko'rsatadi, ish esa unga kerak narsa tayyor bo'lgan ufqda boshlanadi.", ru: 'RICE показывает порядок работ, а работа начинается в горизонте, где готово нужное ей.' })}</p></div>
          {!isMentorL && <RoadmapStrip />}
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
export default function PmRoadmapLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === 11-Modul 6-dars — darsning o'z vizuali (prefiks rm-). Faqat qolip tokenlari (D3); brend ranglari — faqat nomlarda: Uzum #7000FF, Maydon Jamoa (maydon yashili) === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .rm-yorliq { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .rm-kul { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 7px; line-height: 1.3; white-space: nowrap; }
        p.rm-kul-q, span.rm-kul-q { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; line-height: 1.45; }
        .rm-uzum { color: #7000FF; font-weight: 800; font-style: normal; }
        .rm-mj { color: #2E9E4F; font-weight: 800; letter-spacing: 0.01em; }
        .rm-ok { color: ${T.ok}; font-weight: 800; margin-left: auto; }
        /* Navbatdagi harakat halqasi (SABOQ 11, 32): halqa doim, to'lqin yengil — scale ≤ 1.03, shaffoflik ≤ 0.35, sikl 2.4 s; guruhda bitta halqa */
        .rm-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .rm-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: rm-tolqin 2.4s ease-in-out 0.4s 3; }
        .rm-guruh { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 12px; }
        .rm-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 16px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: rm-tolqin 2.4s ease-in-out 0.5s 3; }
        .rm-halqa-i { border-color: ${T.accent} !important; animation: rm-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: rm-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.rm-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.rm-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        @keyframes rm-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes rm-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes rm-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes rm-yashil { 0% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; } }
        @keyframes rm-pop { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }
        @keyframes rm-tush { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: none; } }
        /* Mentorga eslatma (faqat mentor ko'rinishida) va jonli ovoz/statistika */
        .rm-mnote-c { align-self: flex-start; }
        .rm-mnote { display: flex; flex-direction: column; gap: 6px; background: ${T.accentSoft}; border-radius: 12px; padding: 12px 14px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; cursor: pointer; }
        .rm-mnote-l { font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .rm-ovoz { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
        .rm-ovoz-q { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 28px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .rm-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .rm-ovoz-y { height: 8px; border-radius: 99px; background: ${T.bg}; overflow: hidden; } .rm-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease; }
        .rm-mstat { display: flex; gap: 10px; flex-wrap: wrap; }
        .rm-mstat-q { display: flex; flex-direction: column; gap: 2px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 10px 14px; min-width: 150px; }
        .rm-mstat-q b { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.accent}; } .rm-mstat-q span { font-size: 12px; color: ${T.ink2}; font-weight: 600; }
        /* === IshKarta — bitta ish, uch ko'rinish === */
        .rm-ish { font-family: 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 12px; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -10px rgba(${T.shadowBase},0.3); text-align: left; min-width: 0; }
        .rm-ish-b { cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .rm-ish-b:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 10px 22px -10px ${fon(T.accent, 0.45)}; }
        .rm-ish.yangi { animation: rm-yashil 1.2s ease-out; }
        .rm-ish.toliq { display: flex; flex-direction: column; gap: 9px; padding: 11px 12px; width: 100%; }
        .rm-ish-bosh { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .rm-ish-nom { font-weight: 700; font-size: 13.5px; line-height: 1.3; min-width: 0; overflow-wrap: anywhere; }
        .rm-ish-kat { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(0, 1.1fr); gap: 5px; }
        .rm-kat { display: flex; flex-direction: column; gap: 1px; align-items: center; background: ${T.bg}; border-radius: 8px; padding: 5px 2px; min-width: 0; }
        .rm-kat i { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .rm-kat b { font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 800; color: ${T.ink}; min-height: 18px; }
        .rm-kat.ajrat { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; } .rm-kat.ajrat b { color: ${T.accent}; }
        .rm-kat.kulr b { color: ${T.ink2}; }
        .rm-kat.rice { background: ${T.accentSoft}; } .rm-kat.rice b { color: ${T.accent}; }
        .rm-kat.rice.bosh { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; border: 1.5px dashed ${T.line}; }
        .rm-ish.kichik { padding: 9px 10px; gap: 7px; } .rm-ish.kichik .rm-ish-nom { font-size: 12.5px; }
        .rm-ish.ixcham { display: flex; align-items: center; gap: 9px; padding: 8px 11px; width: 100%; }
        .rm-ish-n { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .rm-ish.ixcham .rm-ish-nom { flex: 1; font-size: 13px; }
        .rm-ish-r { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.accent}; flex-shrink: 0; }
        .rm-ish.ixcham.joylandi { opacity: 0.6; } .rm-ish.ixcham.kutadi { opacity: 0.75; }
        .rm-ish.ustunda { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; font-size: 12px; width: 100%; }
        .rm-ish.ustunda .rm-ish-nom { font-size: 12px; font-weight: 700; }
        .rm-ish.ustunda .rm-ish-r { font-size: 11.5px; }
        /* === Formula kartasi === */
        .rm-formula { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 12px 14px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rm-f-q { display: flex; align-items: flex-end; flex-wrap: wrap; gap: 6px; }
        .rm-f-s { display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 52px; }
        .rm-f-s b { font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800; color: ${T.ink}; min-width: 46px; min-height: 30px; padding: 2px 6px; text-align: center; border-radius: 8px; background: ${T.bg}; }
        .rm-f-s.bosh b { background: ${T.paper}; border: 1.5px dashed ${T.line}; }
        .rm-f-s b.kirdi { animation: rm-kir-son 0.42s cubic-bezier(.3,1.4,.5,1) both; }
        @keyframes rm-kir-son { from { opacity: 0; transform: translateY(-14px) scale(1.25); } to { opacity: 1; transform: none; } }
        .rm-f-s i { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .rm-f-s.rice b { background: ${T.accentSoft}; color: ${T.accent}; min-width: 58px; }
        .rm-f-b { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: ${T.ink2}; padding-bottom: 18px; }
        .rm-formula.kichik { padding: 9px 10px; } .rm-formula.kichik .rm-f-s b { font-size: 15px; min-height: 25px; } .rm-formula.kichik .rm-f-s { min-width: 42px; }
        /* === Uch ufqli doska === */
        .rm-doska { position: relative; display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: 14px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 22px -12px rgba(${T.shadowBase},0.25); }
        .rm-roadmap-y { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.paper}; background: ${T.accent}; border-radius: 7px; padding: 3px 10px; }
        .rm-zonalar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; align-items: start; }
        .rm-zona { display: flex; flex-direction: column; gap: 5px; background: ${T.bg}; border-radius: 12px; padding: 8px; min-height: 100px; transition: box-shadow 0.3s ease, background 0.3s ease; }
        .rm-zona.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .rm-zona-h { display: flex; flex-direction: column; gap: 1px; } .rm-zona-h b { font-size: 13.5px; font-weight: 800; } .rm-zona-h span { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .rm-poydevor { /* kesik-ok: shtrix = poydevor, RICE ga kirmaydigan ish (qurilish chizmasidagi poydevor belgisi) */ display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; padding: 7px 9px; border-radius: 9px; background: repeating-linear-gradient(135deg, ${T.line} 0 6px, ${T.paper} 6px 12px); box-shadow: inset 0 0 0 1px ${T.line}; transition: box-shadow 0.3s ease, background 0.3s ease; }
        .rm-poydevor b { font-size: 12.5px; font-weight: 800; background: ${T.paper}; border-radius: 5px; padding: 1px 6px; } .rm-poydevor span { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border-radius: 5px; padding: 1px 6px; }
        .rm-poydevor.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 16px -8px ${fon(T.accent, 0.5)}; animation: rm-pop 0.5s ease; } .rm-poydevor.on b { color: ${T.accent}; }
        .rm-slot { display: flex; flex-direction: column; gap: 3px; border-radius: 9px; padding: 5px 6px; min-height: 40px; }
        .rm-slot.bosh { border: 1.5px dashed ${T.ink2}55; }
        .rm-slot.tola { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rm-slot.bog { position: relative; margin-left: 12px; } .rm-slot.bog::before { content: ''; position: absolute; left: -10px; top: -8px; bottom: 50%; width: 9px; border-left: 2px solid ${T.accent}; border-bottom: 2px solid ${T.accent}; border-radius: 0 0 0 6px; }
        .rm-slot-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .rm-slot-k { display: flex; align-items: center; gap: 4px; } .rm-slot-k > .rm-ish { flex: 1; }
        .rm-almash { display: flex; flex-direction: column; gap: 2px; } .rm-almash .q-chip { padding: 0 6px; font-size: 11px; line-height: 1.4; border-radius: 6px; }
        .rm-yol { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; height: 6px; } .rm-yol i { display: block; height: 4px; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, ${fon(T.accent, 0.35)}); }
        .rm-yol i + i { background: linear-gradient(90deg, ${fon(T.accent, 0.35)}, ${T.line}); }
        p.rm-sabab { font-size: 13px; font-weight: 600; color: ${T.ok}; background: ${T.okFon}; border-radius: 9px; padding: 7px 11px; animation: rm-sabab 1.4s ease-out both; }
        @keyframes rm-sabab { 0% { opacity: 0; transform: translateY(6px); box-shadow: 0 0 0 0 ${fon(T.ok, 0.4)}; } 30% { opacity: 1; transform: none; box-shadow: 0 0 0 4px ${fon(T.ok, 0.25)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } }
        .rm-doska.keng .rm-slot, .rm-doska.kichik .rm-slot { flex-direction: row; align-items: center; gap: 8px; min-height: 0; } .rm-doska.keng .rm-slot-y, .rm-doska.kichik .rm-slot-y { flex-shrink: 0; width: 108px; } .rm-doska.keng .rm-slot-k, .rm-doska.kichik .rm-slot-k { flex: 1; min-width: 0; }
        .rm-doska.kichik { padding: 10px; } .rm-doska.kichik .rm-zona { min-height: 0; } .rm-doska.yakka .rm-zonalar { grid-template-columns: minmax(0, 1fr); }
        /* === Telefon maketi «Maydon Jamoa» (≈170×272, barqaror) === */
        .rm-tel-w { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .rm-tel { width: 170px; height: 272px; flex-shrink: 0; border-radius: 26px; background: #1F1B2E; padding: 9px; box-shadow: 0 16px 30px -14px rgba(${T.shadowBase},0.55); display: flex; flex-direction: column; gap: 6px; }
        .rm-tel-bar { display: flex; align-items: center; justify-content: center; height: 22px; border-radius: 12px 12px 4px 4px; background: ${T.paper}; font-size: 12.5px; }
        .rm-tel-ekran { flex: 1; min-height: 0; border-radius: 4px 4px 16px 16px; background: #F4F8F5; padding: 9px 8px; display: flex; flex-direction: column; gap: 7px; position: relative; overflow: hidden; animation: rm-kir 0.35s ease-out both; }
        .rm-te-h { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .rm-tk { display: flex; flex-direction: column; gap: 4px; background: ${T.paper}; border-radius: 10px; padding: 7px 8px; box-shadow: 0 3px 8px -5px rgba(${T.shadowBase},0.35); }
        .rm-tk-t { display: flex; flex-direction: column; } .rm-tk-t b { font-size: 11.5px; } .rm-tk-t span { font-size: 11px; color: ${T.ink2}; font-weight: 600; }
        .rm-tk-son { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: #2E9E4F; animation: rm-pop 0.45s ease; align-self: flex-start; }
        .rm-tk.katta .rm-tk-son { font-size: 16px; }
        .rm-tk-son.tola { font-size: 11.5px !important; color: ${T.ink2}; }
        .rm-tk-tg { align-self: stretch; text-align: center; font-size: 11.5px; font-weight: 800; color: ${T.paper}; background: #2E9E4F; border-radius: 8px; padding: 6px 4px; }
        .rm-tk-tg.ok { background: ${T.okFon}; color: ${T.ok}; }
        .rm-barmoq { position: absolute; left: 50%; bottom: 52px; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; border: 2px solid ${T.paper}; animation: rm-bos 0.9s ease-in-out both; }
        @keyframes rm-bos { 0% { opacity: 0; transform: translate(20px, 30px) scale(1.2); } 70% { opacity: 1; transform: translate(0, 0) scale(1); } 100% { opacity: 1; transform: scale(0.8); } }
        .rm-te-doira { display: flex; gap: 5px; } .rm-te-doira i { width: 18px; height: 18px; border-radius: 50%; background: ${T.line}; } .rm-te-doira i.ok { background: #8FD1A8; }
        .rm-te-q { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border-radius: 8px; padding: 6px 7px; line-height: 1.35; }
        .rm-te-qulf { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: linear-gradient(180deg, #2B2543, #4A3F72); margin: -9px -8px; padding: 12px 8px; }
        .rm-qulf { position: relative; width: 26px; height: 22px; border-radius: 5px; background: ${fon(T.paper, 0.85)}; margin-top: 10px; } .rm-qulf i { position: absolute; left: 5px; top: -11px; width: 16px; height: 14px; border: 3px solid ${fon(T.paper, 0.85)}; border-bottom: none; border-radius: 9px 9px 0 0; }
        .rm-bild { display: flex; flex-direction: column; gap: 2px; width: 100%; background: ${fon(T.paper, 0.92)}; border-radius: 10px; padding: 8px; animation: rm-tush 0.5s cubic-bezier(.3,1.3,.5,1) 0.3s both; } .rm-bild b { font-size: 11.5px; color: #2E9E4F; } .rm-bild span { font-size: 11px; color: ${T.ink}; font-weight: 600; }
        .rm-te-pul { display: flex; flex-direction: column; gap: 6px; } .rm-te-pq { display: flex; align-items: center; justify-content: space-between; background: ${T.paper}; border-radius: 9px; padding: 6px 8px; }
        .rm-te-pq i { width: 20px; height: 20px; border-radius: 50%; background: ${T.line}; } .rm-te-pq b { color: ${T.ok}; font-size: 13px; } .rm-te-pq em { width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid ${T.line}; }
        /* === PRD varag'i === */
        .rm-prd { display: flex; flex-direction: column; gap: 4px; background: ${T.paper}; border-radius: 14px; padding: 11px 12px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 20px -12px rgba(${T.shadowBase},0.3); }
        .rm-prd-h { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.ink2}; letter-spacing: 0.08em; }
        .rm-prd-q { display: flex; flex-direction: column; gap: 4px; border-radius: 9px; padding: 5px 8px; background: ${T.bg}; animation: rm-kir 0.35s ease-out both; animation-delay: calc(var(--i) * 70ms); transition: box-shadow 0.3s ease, transform 0.3s ease; }
        .rm-prd-q.ochiq { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rm-prd-q.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -10px ${fon(T.accent, 0.55)}; transform: translateY(-2px); }
        .rm-prd-t { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: ${T.ink2}; } .rm-prd-t i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.accent}; }
        .rm-prd-q.ochiq .rm-prd-t { color: ${T.ink}; }
        .rm-prd-ich { display: flex; flex-direction: column; gap: 3px; padding-left: 16px; } .rm-prd-ich.teg { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 4px; }
        .rm-prd-f { font-size: 12px; font-weight: 600; color: ${T.ink}; } .rm-prd-f::before { content: '▸ '; color: ${T.accent}; }
        .rm-prd-ich em { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .rm-prd-teg { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 6px; }
        .rm-prd.kichik { padding: 8px 9px; gap: 3px; } .rm-prd.kichik .rm-prd-q { padding: 3px 7px; } .rm-prd.kichik .rm-prd-t { font-size: 11px; }
        /* === Reja chizmasi === */
        .rm-rj { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; align-items: start; background: ${T.paper}; border-radius: 14px; padding: 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rm-rj-u { display: flex; flex-direction: column; gap: 6px; background: ${T.bg}; border-radius: 10px; padding: 7px; min-height: 150px; }
        .rm-rj-p { /* kesik-ok: shtrix = rejadagi hali bo'sh joy */ display: block; height: 22px; border-radius: 7px; background: repeating-linear-gradient(135deg, ${T.line} 0 6px, ${T.paper} 6px 12px); animation: rm-kir 0.4s ease-out both; }
        .rm-rj-k { font-size: 11.5px; font-weight: 700; line-height: 1.3; color: ${T.ink2}; background: ${T.paper}; border-radius: 8px; padding: 6px 7px; box-shadow: 0 3px 8px -6px rgba(${T.shadowBase},0.4); animation: rm-tush 0.5s cubic-bezier(.3,1.3,.5,1) both; }
        /* === 0-ekran === */
        .rm-s0.tanlovsiz .q-variantlar-kol { position: relative; outline: 2px solid ${T.accent}; outline-offset: 6px; border-radius: 14px; }
        .rm-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -10px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: rm-tolqin 2.4s ease-in-out 0.6s 3; }
        .rm-s0-m { display: flex; flex-direction: column; gap: 10px; }
        .rm-bugun { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 10px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rm-bugun-q { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; color: ${T.ink}; } .rm-bugun-q i { flex: 1; height: 3px; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, ${T.line}); }
        .rm-tup { position: relative; height: 62px; } .rm-tup:empty { height: 0; }
        .rm-tup-k { position: absolute; max-width: 132px; font-size: 11px; font-weight: 700; line-height: 1.25; color: ${T.ink}; background: ${T.paper}; border-radius: 8px; padding: 5px 7px; box-shadow: inset 0 0 0 1px ${T.line}, 0 4px 10px -6px rgba(${T.shadowBase},0.45); transform: rotate(var(--r)); }
        p.rm-javob { font-size: clamp(13px,1.5vw,14.5px); font-weight: 500; color: ${T.ink2}; line-height: 1.5; }
        /* === Bashorat ixcham qatori va natija qatori === */
        .rm-bash { max-width: 680px; }
        .rm-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 12px; }
        .rm-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 16px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: rm-tolqin 2.4s ease-in-out 0.5s 3; }
        @media (prefers-reduced-motion: reduce) { .rm-bash .q-variantlar::after { animation: none; } }
        .rm-bashq { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; background: ${T.paper}; border-radius: 12px; padding: 9px 14px; box-shadow: inset 0 0 0 1px ${T.line}; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .rm-bashq-t b { color: ${T.accent}; }
        .rm-tx { display: block; font-weight: 700; margin-bottom: 4px; color: ${T.ink2}; } .rm-tx b { color: ${T.ink}; } .rm-tx b.yoq { color: ${T.err}; } .rm-tx.ok, .rm-tx.ok b { color: ${T.ok}; }
        /* === 2-ekran === */
        .rm-s2 { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 18px; align-items: start; }
        .rm-s2-tel { position: sticky; top: 0; }
        @media (min-width: 761px) { /* 1280×800: kartalar + tartib oraliq holatda ham sig'sin (F-1007-289) */
          .rm-s2 .rm-ish.toliq { padding: 8px 11px; gap: 6px; } .rm-s2 .rm-kat { padding: 3px 2px; }
          .rm-s2 .rm-formula { padding: 9px 12px; gap: 4px; } .rm-s2 .rm-tartib { padding: 9px 12px; gap: 5px; }
        }
        .rm-s2-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .rm-s2-ishlar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .rm-s2-ishlar.xira, .rm-s4-ro.xira { opacity: 0.55; pointer-events: none; }
        .rm-s2.tugadi { grid-template-columns: 190px minmax(0, 1fr); }
        .rm-tartib { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 11px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        ol.rm-tartib-ro { list-style: none; display: flex; flex-direction: column; gap: 5px; } ol.rm-tartib-ro > li { list-style: none; }
        .rm-qavs-g { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; }
        .rm-qavs { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 7px; position: relative; } .rm-qavs::before { content: ''; position: absolute; left: -9px; top: -34px; bottom: -34px; width: 6px; border: 2px solid ${T.line}; border-left: none; border-radius: 0 7px 7px 0; }
        /* === Testdan keyingi karta va 12-ekran === */
        .rm-test-viz { margin-top: 4px; }
        .rm-tv-ishlar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .rm-tv-ishlar .rm-ish-kat { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .rm-s12v { display: grid; grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr); gap: 6px; align-items: center; }
        .rm-ikki { position: relative; height: 4px; } .rm-ikki i { position: absolute; left: 4px; right: 4px; top: 0; height: 3px; background: ${T.accent}; border-radius: 99px; }
        .rm-ikki::before, .rm-ikki::after { content: ''; position: absolute; top: -4px; width: 0; height: 0; border-top: 5.5px solid transparent; border-bottom: 5.5px solid transparent; }
        .rm-ikki::before { left: 0; border-right: 8px solid ${T.accent}; } .rm-ikki::after { right: 0; border-left: 8px solid ${T.accent}; }
        /* === 4-ekran === */
        .rm-s4-ro { display: flex; flex-direction: column; gap: 6px; } .rm-s4-ro ol { list-style: none; display: flex; flex-direction: column; gap: 5px; } .rm-s4-ro li { list-style: none; }
        .rm-s4-v { display: flex; flex-direction: column; gap: 8px; }
        p.rm-eslat { font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 7px 10px; line-height: 1.45; } p.rm-eslat b { color: ${T.ink}; }
        /* === 6-ekran — Uzum === */
        .rm-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .rm-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 4px; }
        .rm-nuq i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; } .rm-nuq i.ok { background: ${T.ok}; } .rm-nuq i.cur { background: ${T.accent}; transform: scale(1.2); }
        .rm-voqea { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
        .rm-voqea-h { align-self: center; font-weight: 800; font-size: clamp(15px,1.8vw,18px); color: ${T.ink}; animation: rm-kir 0.4s ease-out both; }
        .rm-uz { display: block; width: 100%; max-width: 640px; margin: 0 auto; height: auto; border-radius: 14px; }
        .rm-uz-kir { animation: rm-kir 0.5s ease-out both; animation-delay: calc(var(--i) * 0.12s); }
        .rm-uz-pufak { animation: rm-kir 0.5s ease-out 0.4s both; }
        .rm-uz-yur { animation: rm-yur 2.6s cubic-bezier(.4,0,.3,1) 0.4s both; }
        @keyframes rm-yur { from { transform: translateX(0); } to { transform: translateX(170px); } }
        .rm-uz-ertaga { fill: ${T.line}; animation: rm-ertaga 0.6s ease 2.8s both; } .rm-uz-ert-t { fill: #8A84A3; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; animation: rm-ertaga-t 0.6s ease 2.8s both; }
        @keyframes rm-ertaga { to { fill: #7000FF; } } @keyframes rm-ertaga-t { to { fill: #7000FF; } }
        .rm-uz-nom { fill: #7000FF; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; } .rm-uz-nom.kichik { font-size: 11px; }
        .rm-uz-yoq { fill: #5A00CC; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; }
        .rm-uz-buyurtma { fill: #7000FF; animation: rm-buyurtma 1.2s ease 0.3s 2 both; } .rm-uz-bt { fill: #FFFFFF; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 10px; }
        @keyframes rm-buyurtma { 50% { fill: #5A00CC; } }
        .rm-uz-iz { stroke-dashoffset: 300; animation: rm-iz 2s linear 0.6s both; } @keyframes rm-iz { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }
        /* === 8, 9, 10-ekran — ro'yxat va bitta katta karta === */
        .rm-royxat { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 9px 12px; box-shadow: inset 0 0 0 1px ${T.line}; width: 100%; }
        .rm-royxat.keng { max-width: none; }
        .rm-royxat-h { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .rm-royxat-son { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.accent}; animation: rm-pop 0.4s ease; } .rm-royxat-son.toliq { color: ${T.ok}; }
        .rm-royxat .rm-ish.ixcham .rm-kul { margin-left: 2px; }
        .rm-tuz-b { flex-shrink: 0; width: 26px; height: 26px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; font-size: 13px; line-height: 1; }
        .rm-tuz-b:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .rm-s8-k, .rm-s10-k { display: flex; flex-direction: column; gap: 8px; animation: rm-kir 0.4s ease-out both; }
        .rm-katta { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: 12px 16px; box-shadow: inset 0 0 0 1px ${T.line}, 0 12px 28px -16px rgba(${T.shadowBase},0.4); }
        .rm-katta-bosh { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; } .rm-katta-bosh .rm-ish-nom { font-size: 15px; flex: 1; }
        .rm-inp { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 6px 11px; outline: none; min-width: 0; width: 100%; }
        .rm-inp:focus { border-color: ${T.accent}; background: ${T.paper}; }
        .rm-inp.nom { flex: 1; font-size: 15px; font-weight: 700; width: auto; } .rm-inp.son { max-width: 220px; font-family: 'JetBrains Mono', monospace; }
        .rm-inp.xato { border-color: ${T.err}; background: ${T.errFon}; animation: q-silk 0.32s ease-in-out; }
        .rm-fq { display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 10px; align-items: start; }
        .rm-fq-l { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; padding-top: 7px; }
        .rm-fq-t { display: flex; flex-wrap: wrap; gap: 6px; width: fit-content; max-width: 100%; } .rm-fq-t.col { flex-direction: column; width: 100%; }
        .rm-fq-o { display: flex; flex-direction: column; align-items: center; gap: 2px; } .rm-fq-o i { font-style: normal; font-size: 11px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .rm-fq-o .q-chip { min-width: 46px; text-align: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; padding: 6px 10px; }
        .rm-xq { display: flex; flex-direction: column; gap: 4px; margin-left: 102px; }
        .rm-amal { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .rm-amal > :only-child { margin-left: auto; }
        .rm-s10-k .rm-xq { margin-left: 0; }
        .rm-amal-o { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .rm-yana-w { display: flex; justify-content: flex-end; } .rm-yana { font-size: 12.5px; padding: 6px 12px; }
        .rm-yordam { display: flex; flex-direction: column; gap: 6px; background: ${T.bg}; border-radius: 12px; padding: 10px 12px; }
        .rm-s9q { display: flex; flex-direction: column; gap: 10px; }
        .rm-parda { position: relative; display: block; overflow: hidden; border-radius: 8px; }
        .rm-parda > i { /* kesik-ok: shtrix = hali ochilmagan ufq (parda) */ position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.ink2}; background: repeating-linear-gradient(135deg, ${T.line} 0 5px, ${T.bg} 5px 10px); transition: transform 0.55s cubic-bezier(.4,0,.2,1); }
        .rm-parda.ochiq > i { transform: translateY(-105%); }
        .rm-s9-k .rm-ish-kat { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        .rm-sol { display: grid; grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr); gap: 8px; align-items: stretch; }
        .rm-sol-u { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 11px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rm-sol-h { font-weight: 800; font-size: 13px; }
        .rm-sol-k { display: flex; justify-content: space-between; align-items: center; gap: 6px; background: ${T.bg}; border-radius: 8px; padding: 6px 9px; animation: rm-kir 0.4s ease-out both; }
        .rm-sol-k i { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; } .rm-sol-k b { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; }
        .rm-sol-k.farq { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; } .rm-sol-k.farq b { color: ${T.accent}; }
        .rm-sol-ora { align-self: center; height: 2px; background: ${T.accent}; border-radius: 99px; } .rm-sol-ora.teng { background: ${T.line}; }
        .rm-s10-d { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .rm-ufq-t { display: flex; flex-wrap: wrap; gap: 8px; width: fit-content; max-width: 100%; } .rm-ufq-t .q-chip b { font-weight: 800; }
        .rm-strip { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; align-self: flex-start; background: ${T.paper}; border-radius: 99px; padding: 6px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rm-strip-l { font-weight: 800; font-size: 12.5px; color: ${T.accent}; }
        .rm-strip-z { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; } .rm-strip-z i { font-style: normal; font-weight: 700; color: ${T.ink2}; } .rm-strip-z b { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
        .rm-strip-z + .rm-strip-z::before { content: '·'; color: ${T.ink2}; margin-right: 4px; }
        /* === 11-ekran — kod === */
        .rm-darvoza { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
        .rm-darvoza-s { font-weight: 700; font-size: 14px; line-height: 1.4; }
        .rm-darvoza-ro { display: flex; flex-wrap: wrap; gap: 8px; width: fit-content; max-width: 100%; }
        ol.rm-vazifa { list-style: none; display: flex; flex-direction: column; gap: 6px; margin: 4px 0 8px; } ol.rm-vazifa li { list-style: none; display: flex; gap: 8px; align-items: flex-start; font-size: 13.5px; line-height: 1.4; }
        ol.rm-vazifa li i { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        ol.rm-vazifa li.ok i { background: ${T.okFon}; color: ${T.ok}; } ol.rm-vazifa.xira { opacity: 0.5; }
        .rm-kyordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .rm-kodoyna { display: flex; flex-direction: column; gap: 10px; }
        .rm-mgap { display: flex; gap: 9px; align-items: flex-start; font-size: 13px; line-height: 1.45; color: ${T.ink}; background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 9px 12px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.25); } .rm-mgap img { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
        .rm-kod { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; overflow-x: hidden; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .rm-kod-iz { color: ${CODE.comment}; font-style: italic; } .rm-kod-k { color: ${CODE.attr}; font-weight: 700; border-radius: 4px; transition: background 0.3s ease; }
        .rm-kod.ajrat .rm-kod-k { background: ${fon(T.accent, 0.55)}; color: #FFFFFF; }
        /* === Kartochkalar va yakun === */
        .rm-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: rm-halqa-k 2.4s ease-in-out 0.4s 3; }
        @keyframes rm-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 3px ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 7px ${fon(T.accent, 0.3)}; } }
        p.rm-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; margin-top: 8px; }
        p.rm-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .rm-fikr { display: flex; flex-direction: column; gap: 4px; background: ${T.accentSoft}; border-radius: 14px; padding: 12px 16px; }
        .rm-fikr-l { font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; } p.rm-fikr-t { font-weight: 600; color: ${T.ink}; line-height: 1.5; }
        .rm-hw { display: flex; flex-direction: column; gap: 10px; }
        .rm-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .rm-hw-q { display: flex; flex-direction: column; gap: 2px; background: ${T.bg}; border-radius: 10px; padding: 8px 10px; } .rm-hw-k { font-size: 11px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; } .rm-hw-v { font-size: 13.5px; font-weight: 700; }
        ol.rm-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 7px; } ol.rm-hw-qadam li { list-style: none; display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; } ol.rm-hw-qadam li i { font-style: normal; color: ${T.accent}; font-weight: 800; flex-shrink: 0; }
        .rm-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .rm-prd-yop { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; }
        .rm-voqea .zoomable { width: 100%; max-width: 600px; align-self: center; }
        .lesson-root .q-mustaqil { max-width: none; }
        .rm-s8-k, .rm-s10-k, .rm-s9-k, .rm-s9-b, .rm-sol { width: 100%; max-width: 760px; align-self: center; }
        .rm-s2-ishlar .rm-ish.toliq { padding: 8px 9px; gap: 6px; } .rm-s2-ishlar .rm-kat { padding: 3px 1px; } .rm-s2-ishlar .rm-kat b { font-size: 12.5px; min-height: 16px; }
        @media (min-width: 761px) { /* 1280×800: karta bir qator — nom va yorliq chapda, beshta katak o'ngda; tartib oraliq holatda ko'rinsin (F-1007-289) */
          .rm-s2-ishlar .rm-ish.toliq { display: grid; grid-template-columns: 104px minmax(0, 1fr); align-items: center; column-gap: 8px; }
          .rm-s2-ishlar .rm-kat i { font-size: 10px; letter-spacing: -0.01em; }
          .rm-s2-ishlar .rm-ish-bosh { flex-direction: column; align-items: flex-start; gap: 3px; }
        }
        /* === Telefon kengligi === */
        @media (max-width: 760px) {
          .rm-s2, .rm-s2.tugadi { grid-template-columns: minmax(0, 1fr); } .rm-s2-tel { position: static; }
          .rm-s12v { grid-template-columns: minmax(0, 1fr); } .rm-ikki { width: 4px; height: 30px; justify-self: center; } .rm-ikki i { left: 0; right: auto; top: 4px; bottom: 4px; width: 3px; height: auto; } .rm-ikki::before, .rm-ikki::after { display: none; }
          .rm-tv-ishlar { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 560px) {
          .rm-zonalar { grid-template-columns: minmax(0, 1fr); } .rm-zona { min-height: 0; } .rm-yol { display: none; }
          .rm-s2-ishlar { grid-template-columns: minmax(0, 1fr); }
          .rm-fq { grid-template-columns: minmax(0, 1fr); gap: 4px; } .rm-fq-l { padding-top: 0; } .rm-xq { margin-left: 0; }
          .rm-ish-kat { grid-template-columns: repeat(3, minmax(0, 1fr)); } .rm-s9-k .rm-ish-kat { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .rm-hw-karta { grid-template-columns: minmax(0, 1fr); }
          .rm-sol { grid-template-columns: minmax(0, 1fr); } .rm-sol-ora { display: none; }
          .rm-f-s { min-width: 40px; } .rm-f-s b { font-size: 15px; min-width: 36px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rm-halqa::after, .rm-guruh::after, .rm-halqa-i, .rm-s0.tanlovsiz .q-variantlar-kol::after, .stage-nav .btn-white-accent::after, .rm-flash.yangi .fc-card .fc-front,
          .rm-ish.yangi, .rm-f-s b.kirdi, .rm-poydevor.on, p.rm-sabab, .rm-tel-ekran, .rm-tk-son, .rm-barmoq, .rm-bild, .rm-prd-q, .rm-rj-p, .rm-rj-k, .rm-uz-kir, .rm-uz-pufak, .rm-uz-yur, .rm-uz-iz, .rm-uz-buyurtma,
          .rm-royxat-son, .rm-s8-k, .rm-s10-k, .rm-sol-k, .rm-voqea-h, .rm-inp.xato { animation: none !important; }
          .rm-uz-yur { transform: translateX(170px); } .rm-uz-ertaga, .rm-uz-ertaga { fill: #7000FF; } .rm-uz-ert-t { fill: #7000FF; } .rm-uz-iz { stroke-dashoffset: 0; }
          .rm-parda > i { transition: none; }
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
