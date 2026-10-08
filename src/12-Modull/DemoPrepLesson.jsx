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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm12-06-v1', lessonTitle: { uz: "Demoga tayyorgarlik: risklar va B reja", ru: 'Подготовка к демо: риски и план Б' } }; // 14-Modul 6-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/06-DemoPrep-v3.md
// 12 ekran (loyiha kuni shakli): kirish → reja → tushuncha → Amaliyot 1 → 1-savol → tushuncha → Amaliyot 2 → 2-savol → Amaliyot 3 → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'demo', ru: 'демо' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'B reja', ru: 'план Б' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'teg', ru: 'тег' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'risk', ru: 'риск' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }
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
// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s4 D · s7 B (MD ✔). Bloklar (3, 6, 8) — `practice: -1` (signal 500+ zonasida, variant yo'q).
const INLINE_KEYS = { s4: 3, s7: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); kodsiz kartada raqam (S-026)
const rcRaqam = (n) => <b className="dp-rc-n">{n}</b>;
const RECAPS = {
  4: {
    title: { uz: "Keyingi o'tishdan oldin", ru: 'Перед следующим прогоном' },
    cards: [
      { ic: rcRaqam(1), h: { uz: "Demo ma'lumotni o'zgartiradi", ru: 'Демо меняет данные' }, body: { uz: <>Mentor qo'shildi, son «9 / 10».</>, ru: <>Ментор присоединился, число «9 / 10».</> } },
      { ic: rcRaqam(2), h: { uz: "Ikkinchi o'tish", ru: 'Второй прогон' }, body: { uz: <>Ikkinchi o'tishda «Qo'shilaman» yo'q — 3-qadam to'xtaydi.</>, ru: <>Во втором прогоне нет «Qo'shilaman» — шаг 3 останавливается.</> } },
      { ic: rcRaqam(3), h: { uz: 'Boshiga qaytarish', ru: 'Возврат к началу' }, body: { uz: <>Shuning uchun har o'tishdan keyin holat boshiga qaytariladi.</>, ru: <>Поэтому после каждого прогона состояние возвращают к началу.</> }, ask: { uz: "Demongizda qaysi qadam ma'lumotni o'zgartiradi?", ru: 'Какой шаг вашего демо меняет данные?' } }
    ]
  },
  7: {
    title: { uz: "Uyg'otish qachon", ru: 'Когда будить' },
    cards: [
      { ic: rcRaqam(1), h: { uz: 'Uxlash', ru: 'Засыпание' }, body: { uz: <>Render'ning bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi.</>, ru: <>Бесплатный сервис Render засыпает, если 15 минут нет запросов.</> } },
      { ic: rcRaqam(2), h: { uz: "Uyg'onish", ru: 'Пробуждение' }, body: { uz: <>Birinchi so'rov uni taxminan bir daqiqada uyg'otadi.</>, ru: <>Первый запрос будит его примерно за минуту.</> } },
      { ic: rcRaqam(3), h: { uz: 'Navbatdan oldin', ru: 'Перед очередью' }, body: { uz: <>Shuning uchun navbatdan bir necha daqiqa oldin demo yo'li ochiladi.</>, ru: <>Поэтому путь демо открывают за несколько минут до очереди.</> }, ask: { uz: "Navbatingiz uzoq bo'lsa, uyg'otishni qachon qilasiz?", ru: 'Если очередь далеко, когда будете будить?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="dp-tviz fade-step">{vizual}</div>}
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

// ===== 14-Modul 6-dars yordamchilari (dp- prefiksi: global .mentor va boshqa darslar bilan to'qnashmaydi) =====
// qolip-maket: dp-oyinlar dp-korsat dp-yana dp-qaytar dp-kutish dp-havola dp-fayl dp-qadam dp-nusxa dp-tahrir dp-belgi
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'dp-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ketma-ket sahna qadamlari: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — holatlar kechikishsiz (DE-200)
function useKetma() {
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const kam = kamHarakat();
    let t = 0;
    qadamlar.forEach(([ms, fn]) => { t += kam ? 0 : ms; tm.current.push(setTimeout(fn, t)); });
  }, []);
}
// Ipucha — 40 soniya harakatsizlikda (P-033); javobni aytmaydi
function useIpucha(faol, kalit) {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return k;
}
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsYoz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq */ } };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
const NB = ' ';
const Bo = ({ on, className, children, ...p }) => (on ? <button type="button" className={className} onClick={on} {...p}>{children}</button> : <span className={className}>{children}</span>);
const SoatIc = () => <svg className="dp-soat-ic" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 4.6V8l2.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
// «Uchadi» (SABOQ P3): manba joyidan nishon joyiga ko'rinib uchadigan nusxa (~0,6 s); reduced-motion — uchmaydi
const uchir = (juftlar) => {
  if (kamHarakat() || typeof document === 'undefined') return;
  juftlar.forEach(({ a, b, matn }, i) => {
    if (!a || !b) return;
    const el = document.createElement('div');
    el.className = 'dp-uchar';
    el.textContent = matn;
    Object.assign(el.style, { left: a.left + 'px', top: a.top + 'px', width: Math.max(120, Math.min(a.width, 360)) + 'px' });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transitionDelay = (i * 70) + 'ms';
      el.style.transform = 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px)';
      el.style.opacity = '0.25';
    }));
    setTimeout(() => el.remove(), 800 + i * 70);
  });
};

// Bashorat: tanlangach yopilmaydi — ixcham qator natijagacha turadi (SABOQ 11); variantlar — har birining o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="dp-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="dp-bash-ix fade-step"><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="dp-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="dp-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="dp-x-m">{matn}</span>{izoh && <span className="dp-x-iz">{izoh}</span>}</>;
const navYorliq = (taxmin, q, jami, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' }
    : { uz: `Tugmalarni navbat bilan bosing (${q}/${jami})`, ru: `Нажимайте кнопки по очереди (${q}/${jami})` });
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="dp-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);
const Ipucha = ({ on, matn }) => (on ? <p className="dp-ipucha fade-step">{tr(matn)}</p> : null);

// ===== BITTA MANBA (MD A-6, KOD 2): Mentor misoli «Maydon Jamoa» — hamma ekran, Yordam, kutilgan natija, kartochka va arena shundan o'qiydi =====
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» nomi — 11-Modul 9.62 yashili (logotipsiz)
const MANZIL = 'maydon-jamoa-….netlify.app';
const SSENARIY_CHIP = [
  { uz: 'Kirish', ru: 'Вход' }, { uz: "O'yinlar", ru: 'Игры' }, { uz: "Qo'shilish", ru: 'Присоединение' }, { uz: 'Ikkinchi telefon', ru: 'Второй телефон' }, { uz: "Hozir ko'ryapti", ru: 'Сейчас смотрят' }
];
const MENTOR_SSENARIY = [
  { uz: 'Kirish: ilova ochiq, namuna akkaunt kirgan', ru: 'Вход: приложение открыто, вошёл образцовый аккаунт' },
  { uz: "O'yinlar: «Shanba, 18:00 · Mahalla maydoni · 8 / 10»", ru: 'Игры: «Суббота, 18:00 · Поле махалли · 8 / 10»' },
  { uz: "Qo'shilish: «Qo'shilaman» — laptopda «9 / 10»", ru: 'Присоединение: «Qo\'shilaman» — на ноутбуке «9 / 10»' },
  { uz: "Ikkinchi telefon: son o'zi «9 / 10» bo'ladi", ru: 'Второй телефон: число само становится «9 / 10»' },
  { uz: "Hozir ko'ryapti: 2", ru: 'Сейчас смотрят: 2' }
];
const MENTOR_TAYYORLOV = [
  { uz: "Backend uyg'otildi — ro'yxat chiqdi", ru: 'Backend разбужен — список появился' },
  { uz: 'Ikkala qurilmada namuna akkaunt bilan kirilgan', ru: 'На обоих устройствах вход с образцового аккаунта' },
  { uz: "Demo holati boshida: «8 / 10», «Qo'shilaman» ko'rinadi", ru: 'Состояние демо в начале: «8 / 10», видно «Qo\'shilaman»' },
  { uz: 'B reja videosi laptopda ochishga tayyor', ru: 'Видео плана Б готово к открытию на ноутбуке' },
  { uz: 'Telefon zaryadlangan', ru: 'Телефон заряжен' }
];
const TAYYORLOV_KURS = [
  { uz: "Backend uyg'otildi", ru: 'Backend разбужен' },
  { uz: 'Ikkala qurilmada namuna akkaunt bilan kirilgan', ru: 'На обоих устройствах вход с образцового аккаунта' },
  { uz: 'Demo holati boshiga qaytarilgan', ru: 'Состояние демо возвращено к началу' },
  { uz: 'B reja videosi laptopda ochishga tayyor', ru: 'Видео плана Б готово к открытию на ноутбуке' }
];
const MENTOR_KEYIN = { uz: "O'yindan chiqaman — yana «8 / 10»", ru: 'Выхожу из игры — снова «8 / 10»' };
const RISKLAR = [
  { id: 'internet', nom: { uz: "Internet yo'q", ru: 'Нет интернета' }, hodisa: { uz: "Zal Wi-Fi'i demo paytida uzilib qolishi mumkin.", ru: 'Wi-Fi в зале может отключиться во время демо.' }, mentorBYol: { uz: "B reja: laptopdagi 60 soniyalik videoni ko'rsataman.", ru: 'План Б: покажу 60-секундное видео с ноутбука.' } },
  { id: 'backend', nom: { uz: 'Backend uxlagan', ru: 'Backend уснул' }, hodisa: { uz: 'Navbatingizni kutguncha ilovani hech kim ochmasligi mumkin.', ru: 'Пока вы ждёте очереди, приложение может никто не открывать.' }, mentorBYol: { uz: "Navbatimdan bir necha daqiqa oldin demo yo'lini ochib, Backend'ni uyg'otaman.", ru: 'За несколько минут до очереди открою путь демо и разбужу Backend.' } },
  { id: 'login', nom: { uz: 'Login esdan chiqdi', ru: 'Забыл логин' }, hodisa: { uz: 'Kirish oynasi chiqsa, parol esdan chiqishi mumkin.', ru: 'Если появится окно входа, можно забыть пароль.' }, mentorBYol: { uz: "Demodan oldin ikkala qurilmada namuna akkaunt bilan kirib qo'yaman.", ru: 'Перед демо войду с образцового аккаунта на обоих устройствах.' } },
  { id: 'royxat', nom: { uz: "Ro'yxat bo'sh", ru: 'Список пуст' }, hodisa: { uz: "Demo kuni ro'yxatda birorta o'yin bo'lmasligi mumkin.", ru: 'В день демо в списке может не быть ни одной игры.' }, mentorBYol: { uz: "Demo namuna o'yinda: «Shanba, 18:00» ro'yxatda turadi.", ru: 'Демо на образцовой игре: «Суббота, 18:00» стоит в списке.' } },
  { id: 'ikki', nom: { uz: 'Ikki marta bosish', ru: 'Двойное нажатие' }, hodisa: { uz: 'Hayajonda tugma tez ikki marta bosilishi mumkin.', ru: 'От волнения кнопку можно быстро нажать дважды.' }, mentorBYol: { uz: "4-darsdagi bosish javobi bor: «Qo'shilaman» bir bosishda holatini o'zgartiradi.", ru: 'Есть ответ на нажатие из 4-го урока: «Qo\'shilaman» меняет состояние с одного нажатия.' } }
];
const B_REJA_GAPI = { uz: "Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.", ru: 'Интернет пропал — покажу 60-секундное видео этого демо.' };
const B_REJA_YOLLAR = [
  { id: 'kutish', nom: { uz: 'Internet qaytishini kutish', ru: 'Ждать, пока вернётся интернет' }, natija: 'vaqt' },
  { id: 'havola', nom: { uz: 'Havoladagi video', ru: 'Видео по ссылке' }, natija: 'ochilmadi' },
  { id: 'fayl', nom: { uz: 'Laptopdagi video fayl', ru: 'Видеофайл на ноутбуке' }, natija: 'video' }
];
const B_REJA_QATOR = [
  { uz: "Video: laptopda, 60 soniya, repo'da emas", ru: 'Видео: на ноутбуке, 60 секунд, не в репо' },
  { uz: 'Gap: ' + B_REJA_GAPI.uz, ru: 'Фраза: ' + B_REJA_GAPI.ru },
  { uz: "Uyg'otish: navbatdan bir necha daqiqa oldin, demo yo'lini ochib", ru: 'Пробуждение: за несколько минут до очереди, открыв путь демо' },
  { uz: 'Namuna akkaunt: laptop va telefonda oldindan kirilgan', ru: 'Образцовый аккаунт: заранее вошли на ноутбуке и телефоне' }
];
// Fayl kartasi shabloni (DEMO_MD): bo'lim sarlavhalari mono, o'zbekcha nomlar faylning o'zi (tarjima qilinmaydi)
const DEMO_MD = { fayl: 'DEMO.md', ss: '## Ssenariy', rs: '## Risklar', br: '## B reja' };

// ===== BITTA VIZUAL — «Demo sahnasi» (DemoSahna qismlari): laptop brauzeri · telefon · ssenariy chizig'i + taymer · DEMO.md kartasi =====
const MJ = () => <span className="dp-mj">Maydon Jamoa</span>;
const Doiralar = ({ bor }) => <span className="dp-doira" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={cx(i < bor && 'bor')} />)}</span>;
const WifiIc = ({ yoq }) => (
  <svg className={cx('dp-wifi', yoq && 'yoq')} viewBox="0 0 20 16" width="16" height="13" aria-hidden="true">
    <path d="M2 6.2a11.5 11.5 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M5 9.3a7.2 7.2 0 0 1 10 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="10" cy="12.8" r="1.6" fill="currentColor" />
    {yoq && <path d="M3 15 17 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
  </svg>
);
const CHIROQ = { uxlayapti: { uz: 'uxlayapti', ru: 'спит' }, uygonmoqda: { uz: "uyg'onmoqda…", ru: 'просыпается…' }, ishlayapti: { uz: 'ishlayapti', ru: 'работает' } };
const Chiroq = ({ holat, yozuvsiz, soat }) => (
  <span className={cx('dp-chiroq', holat)}>
    <i aria-hidden="true" /><span className="dp-chiroq-n">Backend · Render</span>
    {!yozuvsiz && holat && <b key={holat} className="fade-step">{tr(CHIROQ[holat])}</b>}
    {soat && <span className="dp-soat"><SoatIc /><em>{tr({ uz: 'taxminan bir daqiqa', ru: 'примерно минута' })}</em></span>}
  </span>
);
const OYINLAR_T = { uz: "O'yinlar", ru: 'Игры' };
const OyinKarta = ({ son }) => (
  <span className="dp-oy-karta"><b>{tr({ uz: 'Shanba', ru: 'Суббота' })}, 18:00</b><span>{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span><b className="dp-mono">{son}{NB}/{NB}10</b></span>
);
const OyinEkran = ({ son, qoshildi, sonYangi, korayapti, tugma = true, sinf }) => (
  <span className={cx('dp-oyin', sinf)}>
    <b className="dp-oyin-sar">{tr({ uz: "O'yin", ru: 'Игра' })}</b>
    <b className="dp-oyin-vaqt">{tr({ uz: 'Shanba', ru: 'Суббота' })}, 18:00</b>
    <span className="dp-oyin-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span>
    <b className={cx('dp-oyin-son', sonYangi && 'yangi')} key={son + (sonYangi ? 'y' : '')}>{son}{NB}/{NB}10</b>
    <Doiralar bor={son} />
    {tugma && <span className={cx('dp-oyin-tugma', qoshildi && 'chiq')}>{qoshildi ? tr({ uz: "O'yindan chiqish", ru: 'Выйти из игры' }) : tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>}
    {korayapti != null && <span className="dp-oyin-kor fade-step">{tr({ uz: "Hozir ko'ryapti", ru: 'Сейчас смотрят' })}: <b>{korayapti}</b></span>}
  </span>
);
// Laptop brauzeri (o'ngda, kattaroq): ekran — bosh · yuklanmoqda · oyinlar · oyin · ochilmadi · havola · video
const LAPTOP_Y = { uz: 'laptop · proyektorga', ru: 'ноутбук · на проектор' };
const Laptop = ({ ekran = 'oyin', son = 8, qoshildi, sonYangi, korayapti, chiroq, chiroqYozuvsiz, soat, wifiYoq, manzil = MANZIL, yorliq = LAPTOP_Y, xira, onOyinlar, oyinlarHalqa, videoQ = -1, videoTol = 0, pufak, akkaunt, sinf, ust }) => (
  <div className={cx('dp-lap-w', sinf)}>
    <span className="dp-qur-y"><span>{tr(yorliq)}</span>{chiroq && <Chiroq holat={chiroq} yozuvsiz={chiroqYozuvsiz} soat={soat} />}</span>
    {ust}
    <div className="dp-lap">
      <span className="dp-lap-bar"><i /><i /><i /><span className={cx('dp-url', ekran === 'havola' && 'qizil')}>{ekran === 'havola' ? tr({ uz: 'video havolasi', ru: 'ссылка на видео' }) : ekran === 'video' ? tr({ uz: 'demo-video · laptopdagi fayl', ru: 'demo-video · файл на ноутбуке' }) : manzil}</span><WifiIc yoq={wifiYoq} /></span>
      <div className="dp-lap-ekran">
        {ekran !== 'video' && ekran !== 'havola' && <span className="dp-lap-ust"><MJ />{akkaunt && <em>{tr(akkaunt)}</em>}</span>}
        {ekran === 'bosh' && <span className="dp-lap-bosh">
          <span className="dp-lap-xush">{tr({ uz: 'Mahalladagi mini-futbol uchun jamoa', ru: 'Команда для мини-футбола в махалле' })}</span>
          <Bo on={onOyinlar} className={cx('dp-oyinlar', xira && 'xira', halqa(oyinlarHalqa))}>{tr(OYINLAR_T)}</Bo>
        </span>}
        {ekran === 'yuklanmoqda' && <span className="dp-lap-yuk"><i className="dp-aylana" aria-hidden="true" />{tr({ uz: 'Yuklanmoqda…', ru: 'Загрузка…' })}</span>}
        {ekran === 'oyinlar' && <span className="dp-lap-ro fade-step"><b className="dp-oyin-sar">{tr(OYINLAR_T)}</b><OyinKarta son={son} /></span>}
        {ekran === 'oyin' && <OyinEkran son={son} qoshildi={qoshildi} sonYangi={sonYangi} korayapti={korayapti} />}
        {ekran === 'ochilmadi' && <span className="dp-lap-xato"><WifiIc yoq /><b>{tr({ uz: 'Sahifa ochilmadi', ru: 'Страница не открылась' })}</b></span>}
        {ekran === 'havola' && <span className="dp-lap-xato fade-step"><WifiIc yoq /><b>{tr({ uz: "Sahifa ochilmadi — internet yo'q", ru: 'Страница не открылась — нет интернета' })}</b></span>}
        {ekran === 'video' && <span className="dp-video fade-step">
          {pufak && <span className="dp-pufak fade-step"><em>{tr({ uz: 'Mentor', ru: 'Ментор' })}</em>{tr(pufak)}</span>}
          <span className="dp-video-ram">
            <span className="dp-video-ch">{SSENARIY_CHIP.map((c, i) => <i key={i} className={cx(i <= videoQ && 'on')}>{i + 1}</i>)}</span>
            <MJ />
            <OyinEkran son={videoQ >= 2 ? 9 : 8} qoshildi={videoQ >= 2} sinf="mini" korayapti={videoQ >= 4 ? 2 : null} />
          </span>
          <span className="dp-video-bar"><span className="dp-video-play" aria-hidden="true" /><span className="dp-video-iz"><i style={{ transform: 'scaleX(' + videoTol + ')' }} /></span><b>{tr({ uz: '60 soniya', ru: '60 секунд' })}</b></span>
        </span>}
      </div>
    </div>
    <span className="dp-lap-tag" aria-hidden="true" />
  </div>
);
// Telefon (chapda, ≈170×272, o'lchami barqaror — SABOQ 22): o'sha «O'yin» ekrani, son o'zi o'zgaradi
const TEL_Y = { uz: '2-qurilma · telefon brauzeri', ru: '2-е устройство · браузер телефона' };
const Telefon = ({ son = 8, sonYangi, korayapti, kulrang, yorliq = TEL_Y }) => (
  <div className="dp-tel-w">
    <span className="dp-qur-y"><span>{tr(yorliq)}</span></span>
    <div className={cx('dp-tel', kulrang && 'kulrang')} aria-hidden="true">
      <span className="dp-tel-bar"><MJ /><span className="dp-tel-url">{MANZIL}</span></span>
      <span className="dp-tel-ekran"><OyinEkran son={son} sonYangi={sonYangi} korayapti={korayapti} /></span>
    </div>
  </div>
);
// Ssenariy chizig'i: besh chip (joriy — accent, o'tgani ✓, to'xtagani — qizil); ustida kichik yorliq
const SsenariyChiziq = ({ holat = [], yorliq = {}, nomsiz }) => (
  <span className="dp-ss">
    {SSENARIY_CHIP.map((c, i) => (
      <span key={i} className={cx('dp-ss-i', holat[i])}>
        {yorliq[i] && <em className={cx('dp-ss-y fade-step', yorliq[i].tur)}>{tr(yorliq[i].t)}</em>}
        <i>{holat[i] === 'ok' ? '✓' : holat[i] === 'err' ? '✕' : i + 1}</i>{!nomsiz && <span>{tr(c)}</span>}
      </span>
    ))}
  </span>
);
// Taymer chizig'i (12-Modul TaymerChiziq naqshi): max soniya shkalasi; reja oralig'i 60–90 va «Yechim bo'lagi: 90 soniya» belgisi
const REJA_Y = { uz: 'Mentor rejasi: 60–90 soniya', ru: 'План Ментора: 60–90 секунд' };
const YECHIM_Y = { uz: "Yechim bo'lagi: 90 soniya", ru: 'Часть «Решение»: 90 секунд' };
const Taymer = ({ tol = 0, holat, max = 120, reja, yechim, yorliqsiz, ust, dur }) => (
  <span className={cx('dp-tm', holat)}>
    {!yorliqsiz && <span className="dp-tm-yorl">{reja && <span>{tr(REJA_Y)}</span>}{yechim && <span className="yechim">{tr(YECHIM_Y)}</span>}{ust && <b className="fade-step">{tr(ust)}</b>}</span>}
    <span className="dp-tm-chiziq">
      {reja && <span className="dp-tm-reja" style={{ left: (60 / max * 100) + '%', width: (30 / max * 100) + '%' }} />}
      <i className="dp-tm-tol" style={{ transform: 'scaleX(' + Math.max(0, Math.min(1, tol)) + ')', transitionDuration: dur ? dur + 'ms' : undefined }} />
      {yechim && <span className="dp-tm-belgi" style={{ left: (90 / max * 100) + '%' }} />}
    </span>
    {!yorliqsiz && <span className="dp-tm-chet"><span>0</span><span>{max}{NB}{tr({ uz: 'soniya', ru: 'сек' })}</span></span>}
  </span>
);
// DEMO.md kartasi (fayl ko'rinishi): bo'sh — uzuq qatorlar (bugun to'ladigan joy); namuna — Mentor matni; o'quvchi matni bo'lsa — o'sha
const MdQator = ({ children, sinf, i = 0 }) => <span className={cx('dp-md-q', sinf)} data-i={i} style={sinf && sinf.includes('kirdi') ? { animationDelay: (0.55 + i * 0.07) + 's' } : undefined}>{children}</span>;
const DemoMd = ({ bosh, ss, keyin, tayyorlov, rs, br, teg, ssRef, rsRef, faqat, yangiSs, yangiRs }) => (
  <div className="dp-md">
    <span className="dp-md-fayl"><b>{DEMO_MD.fayl}</b>{teg && <span className="dp-teg fade-step">m14-demo</span>}</span>
    {(!faqat || faqat.includes('ss')) && <span className="dp-md-b" ref={ssRef}>
      <b className="dp-md-h">{DEMO_MD.ss}</b>
      {bosh ? <><MdQator sinf="bosh" /><MdQator sinf="bosh" /></> : <>
        {tayyorlov && tayyorlov.map((t, i) => <MdQator key={'t' + i} sinf="kul">[ ] {tr(t)}</MdQator>)}
        {ss && ss.map((t, i) => <MdQator key={'s' + i} i={i} sinf={yangiSs ? 'kirdi' : undefined}>{i + 1}. {tr(t)}</MdQator>)}
        {keyin && <MdQator i={5} sinf={yangiSs ? 'kirdi' : undefined}>{tr({ uz: 'Keyin', ru: 'Keyin' })}: {tr(keyin)}</MdQator>}
      </>}
    </span>}
    {(!faqat || faqat.includes('rs')) && <span className="dp-md-b" ref={rsRef}>
      <b className="dp-md-h">{DEMO_MD.rs}</b>
      {bosh ? <><MdQator sinf="bosh" /><MdQator sinf="bosh" /></> : (rs || []).map((r, i) => <MdQator key={i} i={i} sinf={yangiRs && i === rs.length - 1 ? 'kirdi' : undefined}>{tr(r.risk)} — {tr(r.bYol)}</MdQator>)}
    </span>}
    {(!faqat || faqat.includes('br')) && <span className="dp-md-b">
      <b className="dp-md-h">{DEMO_MD.br}</b>
      {bosh || !br ? <><MdQator sinf="bosh" /><MdQator sinf="bosh" /></> : br.map((t, i) => <MdQator key={i} i={i} sinf="kirdi">{tr(t)}</MdQator>)}
    </span>}
  </div>
);
const MISOL_Y = { uz: 'Mentor misoli · Maydon Jamoa', ru: 'Пример Ментора · Maydon Jamoa' };

// ===== SCREEN 0 — KIRISH (QKirish): variantlar → javob → «O'yinlar» → Backend uyg'onadi, ro'yxat chiqadi =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Ro'yxat odatdagidek, kutishsiz chiqib keladi", ru: 'Список появится как обычно, без ожидания' } },
  { id: 'b', label: { uz: "Ro'yxat bir daqiqagacha chiqmay turishi mumkin", ru: 'Список может не появляться до минуты' } },
  { id: 'c', label: { uz: 'Ilova xato berib, sahifa yopilib qolishi mumkin', ru: 'Приложение может выдать ошибку и закрыть страницу' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Render'ning bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi. Birinchi so'rov uni taxminan bir daqiqada uyg'otadi.</>, ru: <><b>Именно!</b> Бесплатный сервис Render засыпает, если 15 минут нет запросов. Первый запрос будит его примерно за минуту.</> },
  a: { uz: <><b>Qiziq fikr!</b> Odatda shunday. Lekin bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi va taxminan bir daqiqada uyg'onadi.</>, ru: <><b>Интересная мысль!</b> Обычно так. Но бесплатный Backend засыпает, если 15 минут нет запросов, и просыпается примерно за минуту.</> },
  c: { uz: <><b>Qiziq fikr!</b> Bunday ham bo'lishi mumkin. Mentor misolida ro'yxat chiqdi — faqat uxlagan Backend uyg'ongandan keyin.</>, ru: <><b>Интересная мысль!</b> Бывает и так. В примере Ментора список появился — только после того, как уснувший Backend проснулся.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  // b: -1 hali bosilmagan · 0 yuklanmoqda (uxlayapti) · 1 uyg'onmoqda · 2 ro'yxat chiqdi
  const [b, setB] = useState(avval ? 2 : -1);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const javob = picked !== null;
  const tamom = b >= 2;
  const pick = (v) => { if (picked !== null) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const oyinlar = () => {
    if (!javob || b !== -1) return;
    setB(0); setSc(n => n + 1);
    ketma([[1300, () => setB(1)], [3600, () => { setB(2); setSc(n => n + 1); }]]);
  };
  const chiroq = b === -1 ? 'uxlayapti' : b === 0 ? 'uxlayapti' : b === 1 ? 'uygonmoqda' : 'ishlayapti';
  const label = !javob ? { uz: 'Javobni tanlang', ru: 'Выберите ответ' } : !tamom ? { uz: "«O'yinlar»ni bosing", ru: 'Нажмите «Игры»' } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!tamom} label={tr(label)} onClick={onNext} />}>
      <div className={cx('dp-k', !javob && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Ilova uzoq ochilmadi — <span className="italic" style={{ color: T.accent }}>birinchi bosishda nima bo'ladi?</span></>, ru: <>Приложение долго не открылось — <span className="italic" style={{ color: T.accent }}>что будет при первом нажатии?</span></> })}
          mentor={<Mentor>{javob
            ? tr({ uz: "Endi laptopda «O'yinlar»ni bosing va nima bo'lishiga qarang.", ru: 'Теперь нажмите на ноутбуке «Игры» и посмотрите, что будет.' })
            : tr({ uz: 'Mentor misolida boshqalar pitch aytguncha ilovani hech kim ochmadi — avval javobni tanlang.', ru: 'В примере Ментора, пока другие выступали с питчем, приложение никто не открывал, — сначала выберите ответ.' })}</Mentor>}
          maket={<div className="dp-sahna dp-k-sahna">
            <span className="dp-misol-y">{tr(MISOL_Y)}</span>
            <SsenariyChiziq nomsiz holat={tamom ? [undefined, 'joriy'] : []} yorliq={tamom ? { 1: { t: { uz: 'Backend uxlagan edi', ru: 'Backend спал' }, tur: 'kul' } } : {}} />
            <div className="dp-qurilma">
              <Telefon kulrang />
              <Laptop ekran={b === -1 ? 'bosh' : b <= 1 ? 'yuklanmoqda' : 'oyinlar'} chiroq={chiroq} chiroqYozuvsiz={!javob} soat={b === 1} xira={!javob}
                onOyinlar={javob && b === -1 ? oyinlar : undefined} oyinlarHalqa={javob && b === -1} />
            </div>
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={javob && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
      <Ustoz satrlar={[
        { uz: "Render uxlashi 11-Modulda risk sifatida o'tilgan («birinchi ochilish bir daqiqagacha») — sinfdan so'rang: «Pitch paytida sizda nima ishlamay qolgan?» Javoblarni taxtaga yozing — ular bugungi risklar ro'yxatiga o'xshab chiqadi; kim nima deganini sanamang.", ru: 'То, что Render засыпает, проходили в 11-м модуле как риск («первое открытие до минуты»), — спросите класс: «Что у вас не сработало во время питча?» Запишите ответы на доске — они окажутся похожи на сегодняшний список рисков; не считайте, кто что сказал.' },
        { uz: "Hakamlar oldidagi chiqishda boshqalar pitch aytayotganda 15 daqiqa tez o'tadi — uyg'otish navbatdan oldin qilinadi (Amaliyot 2).", ru: 'При выступлении перед судьями, пока другие говорят питч, 15 минут проходят быстро, — будят перед своей очередью (Практика 2).' }
      ]} />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — DEMO.md uch bo'limi (bo'sh), teg, taymer bir marta yuradi =====
const REJA = [
  { uz: 'Demo ssenariysi va risklar', ru: 'Сценарий демо и риски' },
  { uz: 'Namuna akkaunt, uyg\'otish va B reja videosi', ru: 'Образцовый аккаунт, пробуждение и видео плана Б' },
  { uz: "Demoni bir marta ko'rsatish va yangi funksiyani to'xtatish", ru: 'Один раз показать демо и остановить новые функции' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [tol, setTol] = useState(0);
  useEffect(() => { const t = setTimeout(() => setTol(1), kamHarakat() ? 0 : 500); return () => clearTimeout(t); }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun demongizni <span className="italic" style={{ color: T.accent }}>hakamlar oldiga tayyorlaysiz</span>.</>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>подготовите демо для судей</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Har blokni avval Mentor misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Bugun mahsulotga yangi narsa qo'shilmaydi.", ru: 'Каждый блок вы сначала увидите на примере Ментора, потом сделаете в своём продукте. Сегодня в продукт ничего нового не добавляется.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="dp-reja-chap">
          <DemoMd bosh teg />
          <Taymer tol={tol} yorliqsiz dur={kamHarakat() ? 1 : 3200} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r) }))}
      >
        <p className="dp-mono-q">{tx({ uz: "o'z repo'ngiz — `DEMO.md`, teg `m14-demo` · Mentor misoli `maydon-jamoa` · boshlang'ich `m14-dars-06-start` · namuna `m14-dars-06-done`", ru: 'ваш репозиторий — `DEMO.md`, тег `m14-demo` · пример Ментора `maydon-jamoa` · начальный `m14-dars-06-start` · образец `m14-dars-06-done`' })}</p>
        <Ustoz satrlar={[
          { uz: "Og'ir qism — Amaliyot 2 (namuna akkaunt, Backend uyg'onishi, video yozish). Telefon proyektorga ulanmaydi: demo laptop brauzerida, telefon — ikkinchi qurilma (tekshirilmagan yo'l kursda ishlatilmaydi).", ru: 'Тяжёлая часть — Практика 2 (образцовый аккаунт, пробуждение Backend, запись видео). Телефон к проектору не подключают: демо в браузере ноутбука, телефон — второе устройство (непроверенный путь в курсе не используется).' },
          { uz: "Juftlikda qulay: biri laptopda, ikkinchisi telefonda kuzatadi — har kim baribir o'z mahsulotini tayyorlaydi. Bugun kod yozilmaydi; agent faqat `DEMO.md` ni yozadi va kerak bo'lsa namuna akkaunt ochadi.", ru: 'Удобно в паре: один на ноутбуке, второй следит с телефона — каждый всё равно готовит свой продукт. Сегодня код не пишут; агент только пишет `DEMO.md` и при необходимости открывает образцовый аккаунт.' }
        ]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha): bashorat → «Demoni ko'rsatish» → «Yana bir marta» → «Boshiga qaytarish» =====
const S2_TAXMIN = [{ k: 'birinchi', t: { uz: 'Birinchisidek o\'tadi', ru: 'Пройдёт как первое' } }, { k: 'ortada', t: { uz: "O'rtasida to'xtaydi", ru: 'Остановится посередине' } }, { k: 'boshida', t: { uz: 'Boshidanoq ochilmaydi', ru: 'Не откроется с самого начала' } }];
const S2_HARAKAT = [{ id: 'korsat', t: { uz: "Demoni ko'rsatish", ru: 'Показать демо' } }, { id: 'yana', t: { uz: 'Yana bir marta', ru: 'Ещё раз' } }, { id: 'qaytar', t: { uz: 'Boshiga qaytarish', ru: 'Вернуть к началу' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  // sahna holati
  const [chip, setChip] = useState([]);
  const [yorl, setYorl] = useState({});
  const [lap, setLap] = useState({ ekran: 'oyin', son: 8, qoshildi: false });
  const [tel, setTel] = useState({ son: 8, yangi: false });
  const [kor, setKor] = useState(null);
  const [tol, setTol] = useState(0);
  const [qatorlar, setQatorlar] = useState(avval);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1100, avval);
  const ip = useIpucha(!!taxmin && !done && !band, q);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const korsat = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setTol(1); setChip(['joriy']); setLap({ ekran: 'bosh', son: 8, qoshildi: false });
    ketma([
      [1900, () => { setChip(['ok', 'joriy']); setLap({ ekran: 'oyinlar', son: 8, qoshildi: false }); }],
      [2000, () => { setChip(['ok', 'ok', 'joriy']); setLap({ ekran: 'oyin', son: 8, qoshildi: false }); }],
      [1300, () => setLap({ ekran: 'oyin', son: 9, qoshildi: true, yangi: true })],
      [1500, () => { setChip(['ok', 'ok', 'ok', 'joriy']); setTel({ son: 9, yangi: true }); }],
      [1700, () => { setChip(['ok', 'ok', 'ok', 'ok', 'joriy']); setKor(2); }],
      [1500, () => { setChip(['ok', 'ok', 'ok', 'ok', 'ok']); setQ(1); setBand(false); }]
    ]);
  };
  const yana = () => {
    if (q !== 1 || band) return;
    setBand(true); setTol(0); setKor(null); setChip(['joriy']); setLap({ ekran: 'bosh', son: 9, qoshildi: true }); setTel({ son: 9, yangi: false });
    ketma([
      [400, () => setTol(0.55)],
      [1300, () => { setChip(['ok', 'joriy']); setLap({ ekran: 'oyinlar', son: 9, qoshildi: true }); }],
      [1700, () => { setChip(['ok', 'ok', 'joriy']); setLap({ ekran: 'oyin', son: 9, qoshildi: true }); }],
      [1500, () => { setChip(['ok', 'ok', 'err']); setYorl({ 2: { t: { uz: 'Mentor allaqachon qo\'shilgan', ru: 'Ментор уже присоединился' }, tur: 'kul' } }); setQ(2); setBand(false); }]
    ]);
  };
  const qaytar = () => {
    if (q !== 2 || band) return;
    setBand(true);
    ketma([
      [500, () => setLap({ ekran: 'oyin', son: 8, qoshildi: false, yangi: true })],
      [900, () => setTel({ son: 8, yangi: true })],
      [900, () => { setChip([]); setYorl({}); setTol(0); setQatorlar(true); }],
      [900, () => { setQ(3); setBand(false); }]
    ]);
  };
  const fn = [korsat, yana, qaytar];
  const yakun = avval;
  const lapH = yakun ? { ekran: 'oyin', son: 8, qoshildi: false } : lap;
  const telH = yakun ? { son: 8 } : tel;
  const mGap = !taxmin ? { uz: "Avval taxminingizni belgilang, keyin «Demoni ko'rsatish»ni bosing.", ru: 'Сначала отметьте предположение, потом нажмите «Показать демо».' }
    : q === 0 ? { uz: "Avval taxminingizni belgilang, keyin «Demoni ko'rsatish»ni bosing.", ru: 'Сначала отметьте предположение, потом нажмите «Показать демо».' }
      : q === 1 ? { uz: "Endi xuddi shu demoni «Yana bir marta» bilan ko'rsating.", ru: 'Теперь покажите то же демо кнопкой «Ещё раз».' }
        : q === 2 ? { uz: "3-qadam to'xtadi — «Boshiga qaytarish»ni bosing.", ru: 'Шаг 3 остановился — нажмите «Вернуть к началу».' }
          : { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · demo ssenariysi', ru: 'Понятие · сценарий демо' })} screen={screen} scrollSignal={tugadi ? 9 : q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Demoni ikkinchi marta ko'rsatsangiz, <span className="italic" style={{ color: T.accent }}>nima bo'ladi?</span></>, ru: <>Что будет, если показать демо <span className="italic" style={{ color: T.accent }}>второй раз?</span></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Mentor demoni ikkinchi marta ko'rsatsa, nima bo'ladi?", ru: 'Что будет, если Ментор покажет демо второй раз?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="dp-sahna">
          <SsenariyChiziq holat={yakun ? [] : chip} yorliq={yakun ? {} : yorl} />
          <Taymer tol={yakun ? 0 : tol} reja max={120} dur={q === 0 && band ? 9800 : 900} />
          {qatorlar && <span className="dp-tk-qator">
            <span className="dp-sirg">{tr({ uz: "Tayyorlov: o'yin «8 / 10», «Qo'shilaman» ko'rinadi", ru: 'Подготовка: игра «8 / 10», видно «Qo\'shilaman»' })}</span>
            <span className="dp-sirg" style={{ animationDelay: '.18s' }}>{tr({ uz: "Keyin: o'yindan chiqaman — yana «8 / 10»", ru: 'Keyin: выхожу из игры — снова «8 / 10»' })}</span>
          </span>}
          <div className="dp-qurilma">
            <Telefon son={telH.son} sonYangi={telH.yangi} korayapti={yakun ? null : kor} yorliq={{ uz: '2-qurilma · telefon brauzeri · 2-namuna akkaunt', ru: '2-е устройство · браузер телефона · 2-й образцовый аккаунт' }} />
            <Laptop ekran={lapH.ekran} son={lapH.son} qoshildi={lapH.qoshildi} sonYangi={lapH.yangi} korayapti={yakun ? null : kor} akkaunt={{ uz: '1-namuna akkaunt', ru: '1-й образцовый аккаунт' }} />
          {!tugadi && <div className="dp-amal ustun">
            {S2_HARAKAT.map((h, i) => <Bo key={h.id} on={taxmin && q === i && !band ? fn[i] : undefined} className={cx('dp-sb', ['dp-korsat', 'dp-yana', 'dp-qaytar'][i], q > i && 'ok', halqa(!!taxmin && q === i && !band))}>{q > i && <b>✓</b>}{tr(h.t)}</Bo>)}
            <Ipucha on={ip} matn={{ uz: 'Yoqilgan tugmani bosing — laptop va telefonga qarang.', ru: 'Нажмите активную кнопку — посмотрите на ноутбук и телефон.' }} />
          </div>}
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'ortada'} haqiqat={{ uz: "o'rtasida to'xtaydi", ru: 'остановится посередине' }} />}
          matn={tr({ uz: "Bu misolda demo o'yindagi sonni o'zgartiradi: keyingi ko'rsatishdan oldin holat boshiga qaytariladi.", ru: 'В этом примере демо меняет число в игре: перед следующим показом состояние возвращают к началу.' })}
          izoh={tr({ uz: "Demoda bosiladigan qadamlar ro'yxati — demo ssenariysi; boshidan oxirigacha bir marta ko'rsatish — demo o'tishi.", ru: 'Список шагов, которые нажимают в демо, — сценарий демо; один показ от начала до конца — прогон демо.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "Holatni o'zgartiradigan demo (qo'shilish, buyurtma, xabar) uchun keyingi o'tishdan oldin boshlang'ich holat qaytariladi; faqat o'qiydigan demoda kerak emas — Mentor misolida «O'yindan chiqish» (12-Modul 12-darsida ham shunday edi). Sinfdan so'rang: «Sizning demongizda qaysi qadam ma'lumotni o'zgartiradi?»", ru: 'Для демо, которое меняет состояние (присоединение, заказ, сообщение), перед следующим прогоном возвращают начальное состояние; для демо, которое только читает, не нужно, — в примере Ментора «Выйти из игры» (так было и на 12-м уроке 12-го модуля). Спросите класс: «Какой шаг вашего демо меняет данные?»' },
          { uz: "Demo ssenariysi — umumiy qolip emas: o'quvchida qadamlar boshqa bo'ladi; besh qadam — bu mashqdagi shakl.", ru: 'Сценарий демо — не общий шаблон: у ученика шаги будут другими; пять шагов — форма этого упражнения.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s4 = 3, D) — javobdan keyin: kitob ilovasi «Olingan» → «Qaytarish» → «Olaman» =====
const KitobVizual = () => {
  const [h, setH] = useState(kamHarakat() ? 2 : 0);
  useEffect(() => { if (kamHarakat()) return undefined; const a = setTimeout(() => setH(1), 900); const b = setTimeout(() => setH(2), 1900); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="dp-kitob">
      <div className="dp-kitob-tel" aria-hidden="true">
        <b className="dp-kitob-sar">{tr({ uz: 'Kitob almashish', ru: 'Обмен книгами' })}</b>
        <span className="dp-kitob-k"><i /><span><b>{tr({ uz: 'Kitob', ru: 'Книга' })}</b><em>{h === 0 ? tr({ uz: 'Olingan', ru: 'Взята' }) : tr({ uz: 'Bo\'sh', ru: 'Свободна' })}</em></span></span>
        {h === 0 && <span className="dp-kitob-t ikk">{tr({ uz: 'Qaytarish', ru: 'Вернуть' })}</span>}
        {h === 1 && <span className="dp-kitob-t ikk bos">{tr({ uz: 'Qaytarish', ru: 'Вернуть' })}</span>}
        {h === 2 && <span className="dp-kitob-t fade-step">{tr({ uz: 'Olaman', ru: 'Беру' })}</span>}
      </div>
      {h === 2 && <span className="dp-kitob-y fade-step">{tr({ uz: 'boshiga qaytdi', ru: 'вернулось к началу' })}</span>}
    </div>
  );
};
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Kitob almashish demosida «Olaman» bosildi. Keyingi o'tishdan oldin nima qilasiz?"
    question={<h2 className="title h-ask">{tr({ uz: "Kitob almashish demosida «Olaman» bosildi. Keyingi o'tishdan oldin nima qilasiz?", ru: 'В демо обмена книгами нажали «Olaman». Что вы сделаете перед следующим прогоном?' })}</h2>}
    options={[
      { uz: 'Sahifani yangilayman, holat o\'zi qaytadi', ru: 'Обновлю страницу, состояние вернётся само' },
      { uz: 'Hech narsa qilmayman, demo yana shunday o\'tadi', ru: 'Ничего не сделаю, демо снова пройдёт так же' },
      { uz: 'Agentga «Olaman» qayta chiqadigan kod yozdiraman', ru: 'Попрошу агента написать код, чтобы «Olaman» снова появлялась' },
      { uz: 'Kitobni qaytarib, holatni boshiga keltiraman', ru: 'Верну книгу и приведу состояние к началу' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Ma'lumot o'zgardi — keyingi o'tish boshidan boshlanadi.", ru: 'Данные изменились — следующий прогон начинается с начала.' }}
    explainWrong={{
      0: { uz: "«Olaman» Backend'ga yozildi. Yangilash uni o'chiradimi?", ru: '«Olaman» записано в Backend. Обновление это сотрёт?' },
      1: { uz: "Ikkinchi o'tishda «Olaman» tugmasi ekranda bo'ladimi?", ru: 'Будет ли кнопка «Olaman» на экране во втором прогоне?' },
      2: { uz: 'Demodan oldin yangi funksiya — yangi risk. Tayyor ish bormi?', ru: 'Новая функция перед демо — новый риск. Есть готовое действие?' },
      default: { uz: "Mentor 2-ekranda ikkinchi o'tishdan oldin nima qildi?", ru: 'Что Ментор сделал на 2-м экране перед вторым прогоном?' }
    }}
    vizual={<KitobVizual />} />
);

// ===== SCREEN 5 — TUSHUNCHA (QTushuncha): internet uzildi — kutish · havola · laptopdagi fayl =====
const S5_TAXMIN = [{ k: 'bitta', t: { uz: 'Bittasi', ru: 'Один' } }, { k: 'ikki', t: { uz: 'Ikkitasi', ru: 'Два' } }, { k: 'uch', t: { uz: 'Uchalasi', ru: 'Все три' } }];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [band, setBand] = useState(false);
  const [ekran, setEkran] = useState(avval ? 'video' : 'ochilmadi');
  const [tol, setTol] = useState(avval ? 0.67 : 0);
  const [tmHolat, setTmHolat] = useState(avval ? 'ok' : undefined);
  const [tmUst, setTmUst] = useState(null);
  const [vq, setVq] = useState(avval ? 4 : -1);
  const [vtol, setVtol] = useState(avval ? 1 : 0);
  const [belgi, setBelgi] = useState(avval ? ['err', 'err', 'ok'] : []);
  const [dur, setDur] = useState(900);
  const ketma = useKetma();
  const done = q >= 3;
  const tugadi = useTugadi(done, 1100, avval);
  const ip = useIpucha(!!taxmin && !done && !band, q);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const kutish = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setDur(3000); setTol(1);
    ketma([[3100, () => { setTmHolat('err'); setTmUst({ uz: "Yechim bo'lagi vaqti tugadi", ru: 'Время части «Решение» вышло' }); setBelgi(['err']); setQ(1); setBand(false); }]]);
  };
  const havola = () => {
    if (q !== 1 || band) return;
    setBand(true);
    ketma([[300, () => setEkran('havola')], [1200, () => { setBelgi(['err', 'err']); setQ(2); setBand(false); }]]);
  };
  const fayl = () => {
    if (q !== 2 || band) return;
    setBand(true); setDur(1); setTol(0); setTmHolat(undefined); setTmUst(null); setEkran('video'); setVq(-1); setVtol(0);
    const qadam = [0, 1, 2, 3, 4].map(i => [1150, () => { setVq(i); setVtol((i + 1) / 5); setDur(1100); setTol((i + 1) / 5 * 0.67); }]);
    ketma([[250, () => {}], ...qadam, [700, () => { setTmHolat('ok'); setBelgi(['err', 'err', 'ok']); setQ(3); setBand(false); }]]);
  };
  const fn = [kutish, havola, fayl];
  const mGap = !taxmin ? { uz: "Mentor misolida 2-qadamda zal Wi-Fi'i uzildi — avval taxminingizni belgilang.", ru: 'В примере Ментора на шаге 2 отключился Wi-Fi зала — сначала отметьте предположение.' }
    : q === 0 ? { uz: "«Internet qaytishini kutish»ni bosing va taymerga qarang.", ru: 'Нажмите «Ждать, пока вернётся интернет» и смотрите на таймер.' }
      : q === 1 ? { uz: "Endi «Havoladagi video»ni bosing.", ru: 'Теперь нажмите «Видео по ссылке».' }
        : q === 2 ? { uz: "Oxirgisi — «Laptopdagi video fayl».", ru: 'Последнее — «Видеофайл на ноутбуке».' }
          : { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · B reja', ru: 'Понятие · план Б' })} screen={screen} scrollSignal={tugadi ? 9 : q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 3, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Internet uzildi — <span className="italic" style={{ color: T.accent }}>demoni qanday davom ettirasiz?</span></>, ru: <>Интернет пропал — <span className="italic" style={{ color: T.accent }}>как продолжить демо?</span></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: "Uch yo'ldan nechtasi Yechim bo'lagining 90 soniyasiga sig'adi?", ru: 'Сколько из трёх путей уложатся в 90 секунд части «Решение»?' }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<div className="dp-sahna">
          <SsenariyChiziq holat={['ok', 'ok']} yorliq={{ 1: { t: { uz: "internet yo'q", ru: 'нет интернета' }, tur: 'qizil' } }} />
          <Taymer tol={tol} holat={tmHolat} max={90} yechim ust={tmUst} dur={dur} />
          <div className="dp-qurilma bir">
            <Laptop ekran={ekran} wifiYoq={ekran !== 'video'} videoQ={vq} videoTol={vtol} pufak={ekran === 'video' && vq >= 0 ? B_REJA_GAPI : null} />
            {!tugadi && <div className="dp-amal ustun">
              {B_REJA_YOLLAR.map((h, i) => <Bo key={h.id} on={taxmin && q === i && !band ? fn[i] : undefined} className={cx('dp-sb', ['dp-kutish', 'dp-havola', 'dp-fayl'][i], belgi[i], halqa(!!taxmin && q === i && !band))}>{belgi[i] && <b>{belgi[i] === 'ok' ? '✓' : '✕'}</b>}{tr(h.nom)}</Bo>)}
              <Ipucha on={ip} matn={{ uz: "Yoqilgan tugmani bosing — internetsiz nima ochiladi?", ru: 'Нажмите активную кнопку — что откроется без интернета?' }} />
            </div>}
          </div>
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'bitta'} haqiqat={{ uz: 'bittasi', ru: 'один' }} />}
          matn={tr({ uz: "Bu misolda internet uzilganda faqat laptopdagi video fayl ochildi — havolaga ham internet kerak.", ru: 'В этом примере без интернета открылся только видеофайл на ноутбуке — для ссылки тоже нужен интернет.' })}
          izoh={tr({ uz: "Demo ishlamay qolsa, o'rniga ko'rsatiladigan oldindan yozilgan ekran videosi — B reja.", ru: 'Заранее записанное видео экрана, которое показывают, если демо не сработало, — план Б.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "«Kutish» va «havola» — hayotda tez-tez tanlanadigan yo'l; bu misolda internet qaytmadi. Telefon internetini laptopga ulash ham yo'l bo'lishi mumkin, lekin telefon demoning ikkinchi qurilmasi va u ham internetga bog'liq — B reja internetsiz ochilishi kerak.", ru: '«Ждать» и «ссылка» — путь, который в жизни выбирают часто; в этом примере интернет не вернулся. Можно раздать интернет с телефона на ноутбук, но телефон — второе устройство демо и тоже зависит от интернета: план Б должен открываться без интернета.' },
          { uz: "Video ommaviy joyga, sinf chatiga yuklanmaydi va repo'ga qo'shilmaydi (Amaliyot 2). Ekran yozish vositasi har kompyuterda boshqacha — umumiy so'z bilan ayting.", ru: 'Видео не выкладывают в открытый доступ, в чат класса и не добавляют в репо (Практика 2). Средство записи экрана на каждом компьютере своё — говорите общими словами.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 1, B) — javobdan keyin: chiroq yashil, «uyg'otish → navbat → demo» 15 daqiqa ichida =====
const UygotishVizual = () => (
  <div className="dp-uy">
    <Chiroq holat="ishlayapti" />
    <div className="dp-uy-chiz" aria-hidden="true">
      <span className="dp-uy-qavs"><em>15{NB}{tr({ uz: 'daqiqa', ru: 'минут' })}</em></span>
      <span className="dp-uy-o"><i /><b>{tr({ uz: "uyg'otish", ru: 'пробуждение' })}</b></span>
      <span className="dp-uy-o"><i /><b>{tr({ uz: 'navbat', ru: 'очередь' })}</b></span>
      <span className="dp-uy-o ok"><i /><b>{tr({ uz: 'demo', ru: 'демо' })}</b></span>
    </div>
  </div>
);
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Hakamlar oldida chiqishdan oldin Backend'ni qachon uyg'otasiz?"
    question={<h2 className="title h-ask">{tr({ uz: "Hakamlar oldida chiqishdan oldin Backend'ni qachon uyg'otasiz?", ru: 'Когда вы разбудите Backend перед выступлением у судей?' })}</h2>}
    options={[
      { uz: 'Ertalab, darsga kelishdan oldin, uyda', ru: 'Утром, дома, до прихода на урок' },
      { uz: 'Navbatimdan bir necha daqiqa oldin', ru: 'За несколько минут до своей очереди' },
      { uz: "Demo boshlangach, «O'yinlar»ni bosganda", ru: 'Когда демо началось и я нажал «Игры»' },
      { uz: 'Kerak emas: agent «ishlaydi» degan edi', ru: 'Не нужно: агент сказал «работает»' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Navbatdan sal oldin ochsangiz, 15 daqiqa so\'rovsiz qolmaydi.', ru: 'Если открыть незадолго до очереди, 15 минут без запросов не пройдёт.' }}
    explainWrong={{
      0: { uz: "Uyg'otgandan keyin 15 daqiqa so'rovsiz o'tsa-chi?", ru: 'А если после пробуждения пройдёт 15 минут без запросов?' },
      2: { uz: 'Birinchi bosishdan keyin zal qancha kutadi?', ru: 'Сколько зал будет ждать после первого нажатия?' },
      3: { uz: "Agentning gapi — da'vo. Backend 15 daqiqada nima qiladi?", ru: 'Слова агента — утверждение. Что Backend делает за 15 минут?' },
      default: { uz: 'Bepul Backend necha daqiqa so\'rovsiz qolsa uxlaydi?', ru: 'Через сколько минут без запросов засыпает бесплатный Backend?' }
    }}
    vizual={<UygotishVizual />} />
);

const ACHIEVEMENTS = {
  freshStart: { icon: '🔄', name: 'Fresh Start', desc: { uz: "Keyingi o'tishdan oldin holatni qaytarishni tanladingiz", ru: 'Вы выбрали вернуть состояние перед следующим прогоном' } },
  wakeUp: { icon: '⏰', name: 'Wake Up', desc: { uz: "Backend'ni qachon uyg'otishni topdingiz", ru: 'Вы нашли, когда будить Backend' } },
  planBReady: { icon: '🎬', name: 'Plan B Ready', desc: { uz: 'B reja videosini yozib, oxirigacha tekshirdingiz', ru: 'Вы записали видео плана Б и проверили его до конца' } },
  demoFreeze: { icon: '🏷️', name: 'Demo Freeze', desc: { uz: "Teg qo'yib, demoni taymer bilan bir marta o'tdingiz", ru: 'Вы поставили тег и один раз прошли демо с таймером' } }
};
// Ekran id → nishon: 4, 7 — ballik test (birinchi urinishda to'g'ri); s6 — Amaliyot 2 4-qadam «Bajardim» + «Video tayyor»; s8 — Amaliyot 3 4-qadam + «Teg GitHub'da» + taymer (bonus, 152)
const ACH_TRIGGERS = { s4: 'freshStart', s7: 'wakeUp', s6: 'planBReady', s8: 'demoFreeze' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 7)
const Q_LABELS = {
  4: { uz: "1 — Keyingi o'tishdan oldin", ru: '1 — Перед следующим прогоном' },
  7: { uz: "2 — Uyg'otish qachon", ru: '2 — Когда будить' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — MD «Fon so'zlari» (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'demo', ru: 'демо' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'ssenariy', ru: 'сценарий' }, l: 82, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: { uz: "o'tish", ru: 'прогон' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'risk', ru: 'риск' }, l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: { uz: 'B reja', ru: 'план Б' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'teg', ru: 'тег' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Maydon Jamoa', l: 20, t: 16, s: 20, d: 18, dl: 2.9 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD aynan: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12)
const QUIZ_BANK = [
  { q: { uz: 'Demoda nimani oldindan yozib qo\'yasiz?', ru: 'Что вы заранее записываете для демо?' }, opts: [{ uz: "Bosiladigan qadamlar ro'yxatini", ru: 'Список шагов, которые нажимают' }, { uz: 'Hakamlar beradigan savollarni', ru: 'Вопросы, которые зададут судьи' }, { uz: 'Ilovadagi hamma funksiyalarni', ru: 'Все функции приложения' }, { uz: "Sinfdoshlar fikrlari ro'yxatini", ru: 'Список мнений одноклассников' }], correct: 0 },
  { q: { uz: "Demoning besh qadami bir marta ko'rsatildi. Bu nima?", ru: 'Пять шагов демо показали один раз. Что это?' }, opts: [{ uz: "Demo ssenariysining yangi ko'rinishi", ru: 'Новый вид сценария демо' }, { uz: "Boshidan oxirigacha bitta demo o'tishi", ru: 'Один прогон демо от начала до конца' }, { uz: "Demoga yangi qadam qo'shilgan holati", ru: 'Демо с добавленным новым шагом' }, { uz: "Hakamlarning demo haqida qo'ygan bahosi", ru: 'Оценка демо от судей' }], correct: 1 },
  { q: { uz: "Mentor «O'yindan chiqish»ni qachon bosadi?", ru: 'Когда Ментор нажимает «Выйти из игры»?' }, opts: [{ uz: 'Demoning eng birinchi qadamida', ru: 'На самом первом шаге демо' }, { uz: 'Hakamlar savol bera boshlaganda', ru: 'Когда судьи начинают задавать вопросы' }, { uz: "Har demo o'tishi tugagandan keyin", ru: 'После окончания каждого прогона демо' }, { uz: 'Faqat internet uzilib qolgan paytda', ru: 'Только когда пропал интернет' }], correct: 2 },
  { q: { uz: "«Backend uxlagan» riskiga qaysi biri B yo'l?", ru: 'Что из этого — путь Б для риска «Backend уснул»?' }, opts: [{ uz: 'Agentga uxlamaydigan kod yozdirib qo\'yish', ru: 'Попросить агента написать код, чтобы не засыпал' }, { uz: "Hakamdan bir daqiqa kutib turishni so'rash", ru: 'Попросить судью подождать минуту' }, { uz: 'Demoni tashlab, Raqamlar bo\'lagini aytish', ru: 'Бросить демо и рассказать часть «Цифры»' }, { uz: "Navbatdan oldin demo yo'lini ochish", ru: 'Открыть путь демо перед очередью' }], correct: 3 },
  { q: { uz: 'B reja videosini nega havolada emas, faylda saqlaysiz?', ru: 'Почему видео плана Б хранят в файле, а не по ссылке?' }, opts: [{ uz: 'Internet uzilsa ham u ochiladi', ru: 'Оно откроется даже без интернета' }, { uz: 'Faylni hakamlar o\'zlari yuklab oladi', ru: 'Судьи сами скачают файл' }, { uz: "Havolani agent o'chirib yuborishi mumkin", ru: 'Агент может удалить ссылку' }, { uz: "Fayl repo'ga o'zi qo'shilib boradi", ru: 'Файл сам добавляется в репо' }], correct: 0 },
  { q: { uz: "Demoni qaysi akkaunt bilan ko'rsatasiz?", ru: 'С какого аккаунта показываете демо?' }, opts: [{ uz: "Eng faol o'yinchining akkaunti bilan", ru: 'С аккаунта самого активного игрока' }, { uz: 'Sanoqqa kirmaydigan namuna akkaunt bilan', ru: 'С образцового аккаунта, который не входит в подсчёт' }, { uz: 'Sinfdoshingizning shaxsiy akkaunti bilan', ru: 'С личного аккаунта одноклассника' }, { uz: 'Demo kuni ochilgan yangi akkaunt bilan', ru: 'С нового аккаунта, открытого в день демо' }], correct: 1 },
  { q: { uz: 'B reja videosini yozishdan oldin ekrandan nimani yopasiz?', ru: 'Что вы закрываете на экране перед записью видео плана Б?' }, opts: [{ uz: "Demo yo'lidagi «O'yinlar» ro'yxatini", ru: 'Список «Игры» на пути демо' }, { uz: 'Taymer va `DEMO.md` ssenariysini', ru: 'Таймер и сценарий `DEMO.md`' }, { uz: 'Parol, `.env` va chat oynalarini', ru: 'Окна с паролем, `.env` и чатом' }, { uz: 'Mahsulot nomi yozilgan sarlavhani', ru: 'Заголовок с названием продукта' }], correct: 2 },
  { q: { uz: 'Bepul Backend qachon uxlab qoladi?', ru: 'Когда засыпает бесплатный Backend?' }, opts: [{ uz: 'Demo ssenariysi tugashi bilan', ru: 'Сразу после конца сценария демо' }, { uz: "Teg GitHub'ga chiqqanidan keyin", ru: 'После того как тег ушёл на GitHub' }, { uz: 'Laptop proyektorga ulanganda', ru: 'Когда ноутбук подключили к проектору' }, { uz: "15 daqiqa so'rovsiz qolganda", ru: 'Когда 15 минут нет запросов' }], correct: 3 },
  { q: { uz: '`m14-demo` tegidan keyin mahsulotda nima qilinadi?', ru: 'Что делают в продукте после тега `m14-demo`?' }, opts: [{ uz: "Faqat tuzatish, yangi funksiya yo'q", ru: 'Только исправления, без новых функций' }, { uz: "Faqat yangi funksiyalar qo'shiladi", ru: 'Добавляют только новые функции' }, { uz: "Repo o'chirilib, qaytadan ochiladi", ru: 'Репо удаляют и открывают заново' }, { uz: "Demo videosi repo'ga yuklab qo'yiladi", ru: 'Видео демо загружают в репо' }], correct: 0 },
  { q: { uz: "Tegni GitHub'ga qaysi buyruq chiqaradi?", ru: 'Какая команда отправляет тег на GitHub?' }, opts: [{ uz: "Oddiy `git push`, teg o'zi ketadi", ru: 'Обычный `git push`, тег уйдёт сам' }, { uz: "`git push origin m14-demo` buyrug'i", ru: 'Команда `git push origin m14-demo`' }, { uz: "Faqat `git tag m14-demo` o'zi yetadi", ru: 'Хватит одного `git tag m14-demo`' }, { uz: '`git add m14-demo`, keyin commit', ru: '`git add m14-demo`, потом commit' }], correct: 1 },
  { q: { uz: 'Ikkinchi qurilma — telefon. Demo unda qayerda ochiladi?', ru: 'Второе устройство — телефон. Где на нём открывают демо?' }, opts: [{ uz: "Telefonga o'rnatilgan APK ilovada", ru: 'В установленном APK-приложении' }, { uz: 'Hakamning telefonida, havola bilan', ru: 'На телефоне судьи, по ссылке' }, { uz: "Telefon brauzerida, o'sha manzilda", ru: 'В браузере телефона, по тому же адресу' }, { uz: 'Sinfdosh telefonida, uning akkauntida', ru: 'На телефоне одноклассника, в его аккаунте' }], correct: 2 },
  { q: { uz: "Demo o'tishida bir qadam rejadagidek bo'lmadi. Nima qilasiz?", ru: 'В прогоне один шаг прошёл не по плану. Что вы сделаете?' }, opts: [{ uz: 'Yashiraman, hakam baribir bilmaydi', ru: 'Скрою, судья всё равно не узнает' }, { uz: "O'rniga yangi funksiya qo'shaman", ru: 'Вместо этого добавлю новую функцию' }, { uz: "Hech narsa, keyingi safar o'tadi", ru: 'Ничего, в следующий раз пройдёт' }, { uz: "Uni risklar ro'yxatiga yozaman", ru: 'Запишу его в список рисков' }], correct: 3 }
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

// ===== AMALIYOT BLOKLARI (3, 6, 8) — ScreenBlok + QBlok + prompt; hammasi o'quvchining o'z repo'sida (Mentor misoli — namuna) =====
// Saqlash: pm-m12d6-demo = { ssenariy: [string] (5), keyin, risklar: [{ risk, bYol }], video, videoVaqt, uygotish, teg, otishVaqt, savedAt } — tayanch 8 aynan (7 va 13-darslar o'qiydi)
// Kalitga login, parol, manzil (URL), video fayl nomi, sherik ismi yozilmaydi. O'qiladi: pm-m9d8-platforma.trek · pm-m12d3-tezlik (trek, oldin.baho, keyin.baho)
const DEMO_KALIT = 'pm-m12d6-demo';
const demoOqi = () => { const o = lsOqi(DEMO_KALIT); return o && typeof o === 'object' ? o : {}; };
const demoYoz = (yangi) => {
  const o = demoOqi();
  lsYoz(DEMO_KALIT, {
    ssenariy: Array.isArray(o.ssenariy) ? o.ssenariy : [], keyin: o.keyin ?? null, risklar: Array.isArray(o.risklar) ? o.risklar : [],
    video: o.video ?? null, videoVaqt: o.videoVaqt ?? null, uygotish: o.uygotish ?? null, teg: o.teg ?? null, otishVaqt: o.otishVaqt ?? null,
    ...yangi, savedAt: Date.now()
  });
};
// Trek: pm-m9d8-platforma.trek → pm-m12d3-tezlik.trek → chiplar (tanlov dars holatida qoladi, kalitga yozilmaydi)
let __dpTrek = null;
const trekOqi = () => {
  const p = lsOqi('pm-m9d8-platforma'); if (p && (p.trek === 'mobil' || p.trek === 'web')) return { trek: p.trek, kalit: true };
  const t = lsOqi('pm-m12d3-tezlik'); if (t && (t.trek === 'mobil' || t.trek === 'web')) return { trek: t.trek, kalit: true };
  return { trek: __dpTrek, kalit: false };
};
// --- Matn tekshiruvi (ikki tilli; apostrof shakllari bir xil) — PM-108: node da 10+ namuna bilan sinalgan ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const PII_RE = /@|t\.me\/|\+998|\d{7,}|(?:\d[\s-]?){9,}|https?:|www\.|\.uz\b|\.com\b|\.app\b/;
const YANGI_RE = /(yangi|qo'sh(?!il)|нов|добав)/;
const NARSA_RE = /(kod|tugma|funksiya|код|кнопк|функци)/;
const UMID_RE = /(umid|omad|yaxshi ishlaydi|hammasi joyida|надеюсь|надежд|удач|хорошо работает|вс[её] в порядке)/;
// Risk kartasi: bo'sh — bloklaydi; login/telefon/havola — bloklaydi; yangi funksiya, umid — yumshoq (ikkinchi bosish bilan o'tadi)
const bYolTekshir = (s) => {
  const n = normT(s);
  if (!n) return { x: 'bosh', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (YANGI_RE.test(n) && NARSA_RE.test(n)) return { x: 'yangi' };
  if (UMID_RE.test(n)) return { x: 'umid' };
  return null;
};
// Ssenariy: qator bo'sh — bloklaydi; login/telefon/havola — bloklaydi; 60 dan uzun, «Keyin» bo'sh — yumshoq
const ssTekshir = (qatorlar, keyin) => {
  const s = qatorlar.map(x => String(x || '').trim());
  if (s.some(x => !x)) return { x: 'bosh', blok: true };
  if ([...s, keyin].some(x => PII_RE.test(normT(x)))) return { x: 'pii', blok: true };
  if (s.some(x => x.length > 60)) return { x: 'uzun' };
  if (!String(keyin || '').trim()) return { x: 'keyin' };
  return null;
};
const XATO = {
  ssBosh: { uz: "Besh qadamni yozing — har qatorga bittadan.", ru: 'Напишите пять шагов — по одному в строку.' },
  ssUzun: { uz: "Qadamni qisqartiring: ekran va zal ko'radigan narsa.", ru: 'Сократите шаг: экран и то, что видит зал.' },
  ssKeyin: { uz: "Holat o'zgaradimi? O'zgarmasa — «kerak emas» deb yozing.", ru: 'Меняется ли состояние? Если нет — напишите «kerak emas».' },
  rsBosh: { uz: "B yo'lni yozing: demodan oldin nima qilasiz?", ru: 'Напишите путь Б: что вы сделаете до демо?' },
  rsYangi: { uz: 'Bu — yangi funksiya. Demodan oldin tayyor ishni yozing.', ru: 'Это новая функция. Напишите готовое действие до демо.' },
  rsUmid: { uz: 'Buni demodan oldin qanday qilasiz? Bitta ishni yozing.', ru: 'Как вы сделаете это до демо? Напишите одно действие.' },
  pii: { uz: 'Bu yerga login, telefon va havola yozilmaydi.', ru: 'Сюда не пишут логин, телефон и ссылку.' },
  yana: { uz: 'Shunday qoldirsangiz — yana bosing.', ru: 'Если оставляете так — нажмите ещё раз.' },
  nimaBoldi: { uz: "Qaysi qadamda nima bo'lganini bir qatorda yozing.", ru: 'Напишите в одну строку, на каком шаге что случилось.' }
};
const Xato = ({ x }) => (x ? <span className="dp-xato-q" role="status"><b>{tr(x.t)}</b>{!x.blok && <em>{tr(XATO.yana)}</em>}</span> : null);
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const Band = ({ children }) => <span className="dp-band-q">{children}</span>;
const Kulrang = ({ children }) => <span className="dp-kulrang">{children}</span>;
const Qalin = ({ children }) => <span className="dp-qalin">{children}</span>;
// Prompt qutisi: {…} joylari — kulrang namuna bilan; avto — dars holatidan oldindan to'ldiriladi; kod (`…`) ichidagi qavs joy emas
const DpPrompt = ({ satrlar, avto = {}, joylar = [], qiymat = {}, onYoz, tekshir, onNusxa, kim }) => {
  const [ok, setOk] = useState(false);
  const [xato, setXato] = useState(null);
  const subst = (s) => {
    let a = s;
    Object.entries(avto).forEach(([k, v]) => { if (v != null && v !== '') a = a.split(k).join(v); });
    joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) a = a.split(j.joy).join(v); });
    return a;
  };
  const matn = satrlar.map(l => subst(tr(l)));
  const kor = (t, li) => t.split('`').flatMap((p, i) => (i % 2
    ? [<code key={li + 'c' + i} className="qcode">{p}</code>]
    : p.split(/(\{[^}\s][^}]*\})/g).map((x, j) => (/^\{[^\s].*\}$/.test(x) ? <span key={li + '-' + i + '-' + j} className="q-joy">{x}</span> : <React.Fragment key={li + '-' + i + '-' + j}>{x}</React.Fragment>))));
  const nusxa = async () => {
    const x = tekshir ? tekshir(qiymat) : null;
    if (x) { setXato(x); return; }
    setXato(null);
    if (onNusxa) onNusxa();
    try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt dp-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr(kim || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa dp-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => l.split('\n').map((ql, k) => <span key={i + '-' + k} className="dp-ps">{kor(ql, i + '-' + k)}</span>))}
      {joylar.length > 0 && <span className="dp-joylar">{joylar.map(j => (
        <label key={j.id} className="dp-joy-m"><span className="dp-joy-n">{j.joy}</span>
          <input type="text" value={qiymat[j.id] || ''} maxLength={160} placeholder={tr(j.namuna)} onChange={e => { setXato(null); onYoz(j.id, e.target.value); }} /></label>))}</span>}
      {xato && <span className="dp-xato" role="status">{tr(xato)}</span>}
    </span>
  );
};
// Bitta buyruq — «Nusxalash» bilan (terminal qatorlari kartada oddiy matn)
const Buyruq = ({ b }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(b); setOk(true); setTimeout(() => setOk(false), 1400); } catch { /* clipboard yopiq */ } };
  return <span className="dp-buyruq"><code>{b}</code><button type="button" className="dp-nusxa" onClick={nusxa}>{ok ? '✓' : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>;
};
const Yordam = ({ satrlar, sarlavha, ost }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="dp-yordam-ust">
      <QTugma ikkinchi className="dp-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="dp-yordam fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="dp-yordam-s">{tx(l)}</span>)}{ost && <span className="dp-kulrang">{tx(ost)}</span>}</span>}
    </span>
  );
};
const TrekChip = ({ trek, onTanla }) => (
  <span className={cx('dp-trek', !trek && 'dp-chorla')}>{[['mobil', { uz: 'Mobil trek', ru: 'Мобильный трек' }], ['web', { uz: 'Web-trek', ru: 'Веб-трек' }]].map(([id, t]) => <button type="button" key={id} className={cx('q-chip', trek === id && 'on')} onClick={() => onTanla(id)}>{tr(t)}</button>)}</span>
);
// Ikki-uch tanlov tugmasi (holat belgisi): tanlangani — accent, qolgani xira
const Tanlov = ({ variantlar, tanlov, onTanla }) => (
  <span className={cx('dp-tanlov', tanlov == null && 'dp-chorla')}>{variantlar.map(v => <button type="button" key={String(v.k)} disabled={v.yopiq} className={cx('q-chip', tanlov === v.k && 'on')} onClick={() => onTanla(v.k)}>{tr(v.t)}</button>)}</span>
);
const Belgi = ({ on, onClick, children, yopiq }) => (
  <button type="button" className={cx('dp-belgi', on && 'on')} disabled={yopiq} onClick={onClick} aria-pressed={!!on}><i>{on ? '✓' : ''}</i><span>{children}</span></button>
);

function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, ulgur, ulgurQadam = 99, ulgurShart, qulf, ustoz, extra, boshqar }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || (stepN >= ulgurQadam && (!ulgurShart || ulgurShart()));
  const qulfli = !done && !!qulf && qulf(stepN);
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, ...(extra ? extra() : {}) });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  if (boshqar) boshqar.current = { qaytar };
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' } : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('dp-blok', qulfli && 'qulf', done && 'tugadi')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tx(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({ h: tx(c.h), t: c.t }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={doneText ? tr(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<MentorPracticeStats live={_live} screen={screen} />}>
          {ortda && !done && <p className="dp-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="dp-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="dp-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}

// --- Amaliyot 1: ssenariy va risklar ---
const SS_YORLIQ = [
  { uz: "1 · Qaysi ekran va zal nimani ko'radi?", ru: '1 · Какой экран и что видит зал?' }, { uz: '2 · …', ru: '2 · …' }, { uz: '3 · …', ru: '3 · …' }, { uz: '4 · …', ru: '4 · …' }, { uz: '5 · …', ru: '5 · …' }
];
const SsenariyForma = ({ ssRef, onSaqla }) => {
  const d0 = useMemo(demoOqi, []);
  const bor = Array.isArray(d0.ssenariy) && d0.ssenariy.length === 5;
  const [qator, setQator] = useState(() => (bor ? d0.ssenariy.slice() : ['', '', '', '', '']));
  const [keyin, setKeyin] = useState(d0.keyin || '');
  const [saqlandi, setSaqlandi] = useState(bor);
  const [xato, setXato] = useState(null);
  const inp = useRef([]);
  const saqla = () => {
    const x = ssTekshir(qator, keyin);
    if (x && (x.blok || !xato || xato.x !== x.x)) {
      const t = x.x === 'bosh' ? XATO.ssBosh : x.x === 'pii' ? XATO.pii : x.x === 'uzun' ? XATO.ssUzun : XATO.ssKeyin;
      setXato({ ...x, t }); return;
    }
    const s = qator.map(v => v.trim()); const k = keyin.trim() || null;
    const manba = inp.current.map(el => (el ? el.getBoundingClientRect() : null));
    demoYoz({ ssenariy: s, keyin: k });
    setXato(null); setSaqlandi(true); onSaqla && onSaqla();
    setTimeout(() => { const box = ssRef && ssRef.current; if (!box) return; const qs = box.querySelectorAll('.dp-md-q'); const tq = [...qs].slice(-6); uchir(manba.map((a, i) => ({ a, b: tq[i] && tq[i].getBoundingClientRect(), matn: i < 5 ? s[i] : (k || '') }))); }, 40);
  };
  if (saqlandi) return <span className="dp-ixcham fade-step"><b>✓</b>{tr({ uz: 'Ssenariy', ru: 'Сценарий' })} · 5<button type="button" className="dp-tahrir" onClick={() => setSaqlandi(false)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button></span>;
  return (
    <span className="dp-forma">
      {qator.map((v, i) => <label key={i} className="dp-inp"><input ref={el => { inp.current[i] = el; }} type="text" value={v} maxLength={120} placeholder={tr(SS_YORLIQ[i])} onChange={e => { setXato(null); const n = qator.slice(); n[i] = e.target.value; setQator(n); }} />{v.trim().length > 60 && <em className="dp-sanoq">{v.trim().length}/60</em>}</label>)}
      <label className="dp-inp keyin"><input ref={el => { inp.current[5] = el; }} type="text" value={keyin} maxLength={120} placeholder={tr({ uz: 'Keyin · Holatni qanday boshiga qaytarasiz?', ru: 'Keyin · Как вернёте состояние к началу?' })} onChange={e => { setXato(null); setKeyin(e.target.value); }} /></label>
      <Xato x={xato} />
      <QTugma ikkinchi={false} className={cx('dp-saqla', halqa(qator.every(v => v.trim())))} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
    </span>
  );
};
const RiskKartalar = ({ rsRef, onSaqla }) => {
  const d0 = useMemo(demoOqi, []);
  const bor = Array.isArray(d0.risklar) && d0.risklar.length > 0 && !!d0.ssenariy;
  const [natijalar, setNatijalar] = useState([]);
  const [i, setI] = useState(0);
  const [qiymat, setQiymat] = useState('');
  const [xato, setXato] = useState(null);
  const [saqlandi, setSaqlandi] = useState(bor ? d0.risklar.length : null);
  const yordamRef = useRef(null);
  const r = RISKLAR[i];
  const oxirgi = i === RISKLAR.length - 1;
  const yakunla = (arr) => {
    const risklar = arr.filter(x => x.bYol).map(x => ({ risk: ou(RISKLAR.find(y => y.id === x.id).nom), bYol: x.bYol }));
    demoYoz({ risklar }); setSaqlandi(risklar.length); onSaqla && onSaqla();
  };
  const keyingi = () => {
    const x = bYolTekshir(qiymat);
    if (x && (x.blok || !xato || xato.x !== x.x)) {
      const t = x.x === 'bosh' ? XATO.rsBosh : x.x === 'pii' ? XATO.pii : x.x === 'yangi' ? XATO.rsYangi : XATO.rsUmid;
      setXato({ ...x, t }); return;
    }
    const arr = [...natijalar, { id: r.id, bYol: qiymat.trim() }];
    setNatijalar(arr); setQiymat(''); setXato(null);
    if (oxirgi) yakunla(arr); else setI(i + 1);
  };
  const yoq = () => {
    const arr = [...natijalar, { id: r.id, bYol: null }];
    setNatijalar(arr); setQiymat(''); setXato(null);
    if (oxirgi) yakunla(arr); else setI(i + 1);
  };
  if (saqlandi != null) return <span className="dp-ixcham fade-step"><b>✓</b>{tr({ uz: 'Risklar', ru: 'Риски' })} · {saqlandi}<button type="button" className="dp-tahrir" onClick={() => { setSaqlandi(null); setNatijalar([]); setI(0); }} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button></span>;
  return (
    <span className="dp-risklar">
      {natijalar.map((n) => { const rr = RISKLAR.find(y => y.id === n.id); return <span key={n.id} className={cx('dp-rs-ix fade-step', !n.bYol && 'yoq')}><b>{tr(rr.nom)}</b><span>{n.bYol || tr({ uz: 'demoda yo\'q', ru: 'нет в демо' })}</span></span>; })}
      <span className="dp-rs-karta fade-step" key={r.id}>
        <span className="dp-rs-n">{tr({ uz: 'Risk', ru: 'Риск' })} {i + 1}{NB}/{NB}5</span>
        <b className="dp-rs-hod">{tr(r.hodisa)}</b>
        <span className="dp-rs-nom">{tr(r.nom)}</span>
        <label className="dp-inp"><input type="text" value={qiymat} maxLength={160} placeholder={tr({ uz: "B yo'l · Oldindan nima qilasiz?", ru: 'Путь Б · Что сделаете заранее?' })} onChange={e => { setXato(null); setQiymat(e.target.value); }} /></label>
        <Xato x={xato} />
        <span className="dp-rs-tugma">
          <QTugma className={halqa(!!qiymat.trim())} onClick={keyingi}>{oxirgi ? tr({ uz: 'Saqlash', ru: 'Сохранить' }) : tr({ uz: 'Keyingi risk', ru: 'Следующий риск' })}</QTugma>
          <QTugma ikkinchi onClick={yoq}>{tr({ uz: 'Bu risk demongizda yo\'q', ru: 'Этого риска нет в вашем демо' })}</QTugma>
          <span className="dp-rs-yordam" ref={yordamRef}><Yordam key={r.id} satrlar={r.id === 'internet' ? [r.mentorBYol, { uz: "B reja — laptopdagi oldindan yozilgan ekran videosi (11-Modulda jonli ko'rsatish ishlamasa ko'rsatilgan video); uni Amaliyot 2 da yozasiz.", ru: 'План Б — заранее записанное видео экрана на ноутбуке (в 11-м модуле — видео, которое показывали, если живой показ не сработал); его вы запишете в Практике 2.' }] : [r.mentorBYol]} /></span>
        </span>
      </span>
      <Kulrang>{tr({ uz: "B yo'l uchun yangi funksiya qo'shmang: bor imkoniyatni oldindan tayyorlang; muammo bo'lsa — faqat tuzatish.", ru: 'Для пути Б не добавляйте новую функцию: заранее подготовьте то, что уже есть; если проблема — только исправление.' })}</Kulrang>
    </span>
  );
};
const A1_PROMPT = [
  { uz: "Loyiha ildizida `DEMO.md` faylini yarat (fayl bor bo'lsa — faqat «## Ssenariy» va «## Risklar» bo'limlarini yangila). Pastdagi yozuvimni so'zma-so'z ko'chir: «## Ssenariy» — avval «Tayyorlov» ro'yxati (har qator oldida `[ ]` — hali bajarilmagan, demo kuni belgilanadi), keyin besh qadam raqam bilan, oxirida «Keyin» qatori; «## Risklar» — har qator «risk — B yo'l».", ru: "Loyiha ildizida `DEMO.md` faylini yarat (fayl bor bo'lsa — faqat «## Ssenariy» va «## Risklar» bo'limlarini yangila). Pastdagi yozuvimni so'zma-so'z ko'chir: «## Ssenariy» — avval «Tayyorlov» ro'yxati (har qator oldida `[ ]` — hali bajarilmagan, demo kuni belgilanadi), keyin besh qadam raqam bilan, oxirida «Keyin» qatori; «## Risklar» — har qator «risk — B yo'l»." },
  { uz: "Login, parol va `.env` qiymatlari bu faylga yozilmaydi. Faylning boshqa joyiga va boshqa fayllarga tegma. Nima yozganingni ayt.", ru: "Login, parol va `.env` qiymatlari bu faylga yozilmaydi. Faylning boshqa joyiga va boshqa fayllarga tegma. Nima yozganingni ayt." },
  { uz: '{demo yozuvi}', ru: '{demo yozuvi}' }
];
const demoYozuvi = (d) => {
  if (!Array.isArray(d.ssenariy) || d.ssenariy.length !== 5) return null;
  const t = TAYYORLOV_KURS.map(x => '[ ] ' + x.uz);
  const s = d.ssenariy.map((x, i) => (i + 1) + '. ' + x);
  const k = 'Keyin: ' + (d.keyin || 'kerak emas');
  const r = (d.risklar || []).map(x => x.risk + ' — ' + x.bYol);
  return ['## Ssenariy', 'Tayyorlov:', ...t, ...s, k, '## Risklar', ...r].join('\n');
};
const A1Natija = ({ ssRef, rsRef, v }) => {
  const d = demoOqi();
  const ssBor = Array.isArray(d.ssenariy) && d.ssenariy.length === 5;
  const rsBor = Array.isArray(d.risklar) && d.risklar.length > 0;
  return (
    <div className="dp-an" data-v={v}>
      <div className="dp-qurilma mini"><Telefon /><Laptop ekran="oyin" /></div>
      <DemoMd faqat={['ss', 'rs']} ssRef={ssRef} rsRef={rsRef} tayyorlov={ssBor ? TAYYORLOV_KURS : MENTOR_TAYYORLOV} ss={ssBor ? d.ssenariy.map(x => ({ uz: x, ru: x })) : MENTOR_SSENARIY}
        keyin={ssBor ? (d.keyin ? { uz: d.keyin, ru: d.keyin } : { uz: 'kerak emas', ru: 'kerak emas' }) : MENTOR_KEYIN} yangiSs={ssBor}
        rs={rsBor ? d.risklar.map(r => ({ risk: { uz: r.risk, ru: r.risk }, bYol: { uz: r.bYol, ru: r.bYol } })) : RISKLAR.map(r => ({ risk: r.nom, bYol: r.mentorBYol }))} />
    </div>
  );
};
const ScreenA1 = (props) => {
  const tk = useMemo(trekOqi, []);
  const [trek, setTrek] = useState(tk.trek);
  const [v, setV] = useState(0);
  const [rsOk, setRsOk] = useState(() => { const d = demoOqi(); return Array.isArray(d.risklar) && d.risklar.length > 0; });
  const ssRef = useRef(null); const rsRef = useRef(null);
  const yangila = () => setV(n => n + 1);
  const trekTanla = (t) => { setTrek(t); __dpTrek = t; };
  const d = demoOqi();
  const ssBor = Array.isArray(d.ssenariy) && d.ssenariy.length === 5;
  const rsBor = rsOk;
  const tez = lsOqi('pm-m12d3-tezlik') || {};
  const bOld = tez.oldin && tez.oldin.baho != null ? tez.oldin.baho : null;
  const bKey = tez.keyin && tez.keyin.baho != null ? tez.keyin.baho : null;
  const yozuv = demoYozuvi(d);
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Demongizning ssenariysi va <span className="italic" style={{ color: T.accent }}>risklarini yozing</span>.</>, ru: <>Напишите сценарий и <span className="italic" style={{ color: T.accent }}>риски своего демо</span>.</> }}
      mentor={{ uz: "Qadamlar va risklarni o'z demongizdan yozasiz, Mentor namunasi «Yordam»da; «1 · Ochish»dan boshlang.", ru: 'Шаги и риски вы пишете из своего демо, образец Ментора — в «Подсказке»; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: файлов `.env` в списке быть не должно.' })}
          <Band>{tr({ uz: "Demo yo'lingizni laptop brauzerida oching (mobil trekda — brauzer ko'rinishi, web-trekda — saytingiz). Telefonda o'sha manzilni brauzerda oching — bu ikkinchi qurilma.", ru: 'Откройте путь демо в браузере ноутбука (мобильный трек — браузерная версия, веб-трек — ваш сайт). На телефоне откройте тот же адрес в браузере — это второе устройство.' })}</Band>
          {!tk.kalit && <Band><TrekChip trek={trek} onTanla={trekTanla} /></Band>}
          <Kulrang>{tr({ uz: "APK yoki Expo Go emas: yangi versiyadan keyin sahifani yangilasangiz, ikkala ekranda bir xil versiya bo'ladi.", ru: 'Не APK и не Expo Go: если после новой версии обновить страницу, на обоих экранах будет одна версия.' })}</Kulrang>
          <Kulrang>{tr({ uz: "Mahsulotingizda ikkinchi qurilmada ko'rinadigan o'zgarish bo'lmasa — demo bitta laptopda, telefon kerak emas.", ru: 'Если в продукте нет изменения, видимого на втором устройстве, — демо на одном ноутбуке, телефон не нужен.' })}</Kulrang></> },
        { h: { uz: 'Ssenariy', ru: 'Сценарий' }, t: <>{tr({ uz: "chapda besh qator va «Keyin» qatori. Har qator — bitta qadam, qisqa. «Saqlash».", ru: 'слева пять строк и строка «Keyin». Каждая строка — один короткий шаг. «Сохранить».' })}
          <Kulrang>{tr({ uz: "Bu mashqda demongizni besh qadamga bo'ling — qadamlar mazmuni sizniki, soni mashq shakli.", ru: 'В этом упражнении разбейте демо на пять шагов — содержание шагов ваше, их число — форма упражнения.' })}</Kulrang>
          {bKey != null && bOld != null
            ? <Kulrang>{tr({ uz: `3-darsda lendingingiz o'lchangan: Lighthouse bahosi ${bOld} va ${bKey}. Tezlik haqida shu son bilan gapiring.`, ru: `На 3-м уроке ваш лендинг измерен: оценка Lighthouse ${bOld} и ${bKey}. О скорости говорите этим числом.` })}</Kulrang>
            : <Kulrang>{tr({ uz: "Lending tezligi o'lchanmagan — demoda «tez ochiladi» demang.", ru: 'Скорость лендинга не измерена — не говорите на демо «быстро открывается».' })}</Kulrang>}
          <SsenariyForma ssRef={ssRef} onSaqla={yangila} />
          <Yordam sarlavha={{ uz: 'Mentor misolidan', ru: 'Из примера Ментора' }} satrlar={[...MENTOR_SSENARIY.map((s, i) => ({ uz: (i + 1) + ' ' + s.uz, ru: (i + 1) + ' ' + s.ru })), { uz: 'Keyin: ' + MENTOR_KEYIN.uz, ru: 'Keyin: ' + MENTOR_KEYIN.ru }]} /></> },
        { h: { uz: 'Risklar', ru: 'Риски' }, t: <>{tr({ uz: '11-Modulda risk — rejaga xalaqit berishi mumkin bo\'lgan narsa edi; bugun — demoga.', ru: 'В 11-м модуле риск был тем, что может помешать плану; сегодня — демо.' })}
          <Band>{tr({ uz: "Risk bo'lsa ham demo davom etishi uchun oldindan qilinadigan ish — B yo'l.", ru: 'Действие, которое делают заранее, чтобы демо продолжилось даже при риске, — путь Б.' })}</Band>
          <RiskKartalar rsRef={rsRef} onSaqla={() => { setRsOk(true); yangila(); }} /></> },
        { h: { uz: '`DEMO.md`', ru: '`DEMO.md`' }, t: <>{tr({ uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Нажмите «Скопировать» и отправьте в Antigravity:' })}
          <DpPrompt satrlar={A1_PROMPT} avto={{ '{demo yozuvi}': yozuv }} />
          <Band>{tx({ uz: "Agent tugatgach: `DEMO.md` ni oching va yozuvingiz bilan solishtiring → `git diff -- DEMO.md` (faqat o'z yozuvingiz, boshqa qator yo'q) → `git status` — faqat `DEMO.md`, `.env` yo'q → `git add DEMO.md` → `git commit -m \"demo ssenariysi va risklar\"` → `git push`.", ru: 'Когда агент закончит: откройте `DEMO.md` и сравните со своей записью → `git diff -- DEMO.md` (только ваша запись, других строк нет) → `git status` — только `DEMO.md`, `.env` нет → `git add DEMO.md` → `git commit -m "demo ssenariysi va risklar"` → `git push`.' })}</Band>
          <Kulrang>{tx({ uz: "Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` qiymatlarini emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt.»", ru: 'Если появилась ошибка — отправьте агенту только строку ошибки (не значения `.env`): «Shu xato chiqdi: {xato}. Nima bo\'lganini ayt.»' })}</Kulrang></> }
      ]}
      qulf={(i) => (i === 1 && !ssBor) || (i === 2 && !rsBor) || (i === 3 && !yozuv)}
      natija={<A1Natija ssRef={ssRef} rsRef={rsRef} v={v} />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-06-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz.", ru: 'Отстали — откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-06-done` — последнюю команду запускайте только в этой новой папке: она стирает изменения в папке. В `backend/.env` и `mobil/.env` впишете свои значения.' }}
      ulgur={{ uz: "Ulgurmasangiz: 3-qadamdan keyin (risklar saqlangach) «Davom etish» ochiladi; 4-qadam (`DEMO.md`) — Amaliyot 3 dan oldin, shu ekranga qaytib: teg `DEMO.md` bilan qo'yilsin. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: после 3-го шага (риски сохранены) откроется «Продолжить»; 4-й шаг (`DEMO.md`) — до Практики 3, вернувшись на этот экран: тег ставится вместе с `DEMO.md`. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={3} ulgurShart={() => ssBor && rsBor}
      extra={() => ({ trek: trek || null })}
      doneText={{ uz: "Ssenariy va risklar `DEMO.md` da — endi B yo'llarni tayyorlaysiz.", ru: 'Сценарий и риски в `DEMO.md` — теперь подготовите пути Б.' }}
      ustoz={[
        { uz: "Eng ko'p xato — B yo'lga «yaxshi ishlaydi» yoki «agentga tuzattiraman» yozish: «Demodan oldin aniq nima qilasiz?» deb so'rang. Bir gap: har B reja — bu risk uchun B yo'l; lekin har B yo'l video emas.", ru: 'Самая частая ошибка — писать в путь Б «хорошо работает» или «попрошу агента исправить»: спросите «Что именно вы сделаете до демо?». Одна фраза: каждый план Б — это путь Б для риска; но не каждый путь Б — видео.' },
        { uz: "Login va parol `DEMO.md` ga yozilmasin — repo GitHub'da. 3-darsda lending o'lchanmagan bo'lsa, o'quvchi pitchda «tez ochiladi» demasin.", ru: 'Логин и пароль не пишут в `DEMO.md` — репо на GitHub. Если на 3-м уроке лендинг не измеряли, ученик не говорит в питче «быстро открывается».' }
      ]} />
  );
};

// --- Amaliyot 2: namuna akkaunt, uyg'otish va B reja ---
const A2_PROMPT = [
  { uz: "Qayerda: Database — faqat demo uchun namuna akkauntlar va demo ko'rsatiladigan {demo yozuvi}. Kod va fayllarni o'zgartirma.", ru: "Qayerda: Database — faqat demo uchun namuna akkauntlar va demo ko'rsatiladigan {demo yozuvi}. Kod va fayllarni o'zgartirma." },
  { uz: "Nima qilsin: demo uchun ikkita namuna akkaunt bormi — tekshir va tasdiqla: ikkisi ham namuna (foydalanuvchilar sanog'iga tushmaydigan) va sanoq, eslatma, Telegram xabari va taklif sanog'iga kirmaydi. Login va parolni javobingda chiqarma. {demo yozuvi} da haqiqiy foydalanuvchilar bormi — ayt. Bo'lsa, birinchi namuna akkauntdan shunday yangi {demo yozuvi} yarat; sanasi o'tgan bo'lsa — demo kunidan keyingi sanaga ko'chir.", ru: "Nima qilsin: demo uchun ikkita namuna akkaunt bormi — tekshir va tasdiqla: ikkisi ham namuna (foydalanuvchilar sanog'iga tushmaydigan) va sanoq, eslatma, Telegram xabari va taklif sanog'iga kirmaydi. Login va parolni javobingda chiqarma. {demo yozuvi} da haqiqiy foydalanuvchilar bormi — ayt. Bo'lsa, birinchi namuna akkauntdan shunday yangi {demo yozuvi} yarat; sanasi o'tgan bo'lsa — demo kunidan keyingi sanaga ko'chir." },
  { uz: "Nima buzilmasin: haqiqiy foydalanuvchilarning akkauntlari va yozuvlariga tegma; `.env` ga tegma. Nima o'zgartirganingni ayt.", ru: "Nima buzilmasin: haqiqiy foydalanuvchilarning akkauntlari va yozuvlariga tegma; `.env` ga tegma. Nima o'zgartirganingni ayt." }
];
const A2_YORDAM = A2_PROMPT.map(l => ({ uz: l.uz.split('{demo yozuvi}').join("o'yin «Shanba, 18:00 · Mahalla maydoni»").replace("namuna (foydalanuvchilar sanog'iga tushmaydigan)", 'namuna (`namuna = true`)'), ru: l.ru.split('{demo yozuvi}').join("o'yin «Shanba, 18:00 · Mahalla maydoni»").replace("namuna (foydalanuvchilar sanog'iga tushmaydigan)", 'namuna (`namuna = true`)') }));
const A2_BREJA_PROMPT = [
  { uz: "`DEMO.md` ga «## B reja» bo'limini qo'sh: pastdagi yozuvimni so'zma-so'z ko'chir. Login, parol, video fayl nomi va manzili yozilmaydi. Faylning qolgan qismiga va boshqa fayllarga tegma.", ru: "`DEMO.md` ga «## B reja» bo'limini qo'sh: pastdagi yozuvimni so'zma-so'z ko'chir. Login, parol, video fayl nomi va manzili yozilmaydi. Faylning qolgan qismiga va boshqa fayllarga tegma." },
  { uz: '{B reja yozuvi}', ru: '{B reja yozuvi}' }
];
const VIDEO_TEK = [
  { uz: "beshala qadam ko'rinadi", ru: 'видны все пять шагов' },
  { uz: "parol, `.env`, maxfiy tokenli manzil va haqiqiy foydalanuvchi ismi ko'rinmaydi", ru: 'не видно пароля, `.env`, адреса с секретным токеном и имени настоящего пользователя' },
  { uz: 'fayl laptopda, havola emas', ru: 'файл на ноутбуке, не ссылка' }
];
const A2Natija = ({ uygotish, video }) => (
  <div className="dp-an">
    <Laptop ekran="video" videoQ={4} videoTol={1} pufak={B_REJA_GAPI} chiroq={uygotish === false ? 'uxlayapti' : 'ishlayapti'} sinf="dp-an-lap" />
    <DemoMd faqat={['br']} br={B_REJA_QATOR} />
    {video === false && <Kulrang>{tr({ uz: 'B reja videosi hali yo\'q', ru: 'Видео плана Б ещё нет' })}</Kulrang>}
  </div>
);
const ScreenA2 = (props) => {
  const d0 = useMemo(demoOqi, []);
  const [qiymat, setQiymat] = useState({});
  const [uygotish, setUygotish] = useState(d0.uygotish ?? null);
  const [tek, setTek] = useState([false, false, false]);
  const [video, setVideo] = useState(d0.video ?? null);
  const [n, setN] = useState(d0.videoVaqt != null ? String(d0.videoVaqt) : '');
  const uyTanla = (v) => { setUygotish(v); demoYoz({ uygotish: v }); };
  const nSon = /^\d{1,3}$/.test(n.trim()) ? parseInt(n.trim(), 10) : null;
  const videoTanla = (v) => { setVideo(v); demoYoz({ video: v, videoVaqt: v === true ? nSon : null }); };
  useEffect(() => { if (video === true) demoYoz({ videoVaqt: nSon }); }, [n]); // eslint-disable-line
  const gap = 'Internet uzildi — shu demoning ' + (nSon != null ? nSon : '{N}') + " soniyalik videosini ko'rsataman.";
  const brYozuv = video === true
    ? ['Video: laptopda, ' + (nSon != null ? nSon : '{N}') + " soniya, repo'da emas", 'Gap: ' + gap, B_REJA_QATOR[2].uz, B_REJA_QATOR[3].uz].join('\n')
    : video === false ? ["Video: hali yo'q", B_REJA_QATOR[2].uz, B_REJA_QATOR[3].uz].join('\n') : null;
  const doneText = uygotish === false ? { uz: "Backend ochilmadi — xato qatori agentda, B yo'llar hali tugamagan.", ru: 'Backend не открылся — строка ошибки у агента, пути Б ещё не готовы.' }
    : video === true ? { uz: "Akkaunt, uyg'otish va B reja tayyor — hammasi `DEMO.md` da.", ru: 'Аккаунт, пробуждение и план Б готовы — всё в `DEMO.md`.' }
      : { uz: "Akkaunt va uyg'otish tayyor — B reja videosi hali yo'q.", ru: 'Аккаунт и пробуждение готовы — видео плана Б ещё нет.' };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z demongiz", ru: 'Практика 2 · ваше демо' }}
      title={{ uz: <>B yo'llarni tayyorlang: <span className="italic" style={{ color: T.accent }}>akkaunt, uyg'otish va B reja</span>.</>, ru: <>Подготовьте пути Б: <span className="italic" style={{ color: T.accent }}>аккаунт, пробуждение и план Б</span>.</> }}
      mentor={{ uz: "Har ishni o'z demongizda qilib, o'zingiz tekshirasiz; «1 · Namuna akkaunt»dan boshlang.", ru: 'Каждое дело делаете в своём демо и проверяете сами; начните с «1 · Образцовый аккаунт».' }}
      steps={[
        { h: { uz: 'Namuna akkaunt', ru: 'Образцовый аккаунт' }, t: <>{tr({ uz: "12-Modulda demo uchun ochilgan, sanoqqa kirmaydigan akkaunt — namuna akkaunt.", ru: 'Аккаунт, открытый в 12-м модуле для демо и не входящий в подсчёт, — образцовый аккаунт.' })}
          <Band>{tr({ uz: "Qavsni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Заполните скобку, нажмите «Скопировать» и отправьте в Antigravity:' })}</Band>
          <DpPrompt satrlar={A2_PROMPT} joylar={[{ id: 'yozuv', joy: '{demo yozuvi}', namuna: { uz: "masalan: o'yin «Shanba, 18:00 · Mahalla maydoni»", ru: 'например: игра «Суббота, 18:00 · Поле махалли»' } }]} qiymat={qiymat} onYoz={(k, v) => setQiymat(q => ({ ...q, [k]: v }))}
            tekshir={(q) => (!String(q.yozuv || '').trim() ? { uz: "{demo yozuvi} ni yozing.", ru: 'Заполните {demo yozuvi}.' } : PII_RE.test(normT(q.yozuv)) ? XATO.pii : null)} />
          <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={A2_YORDAM} />
          <Band>{tx({ uz: "Namuna akkaunt yo'q bo'lsa — uni ro'yxatdan o'tish ekranidan o'zingiz ochasiz (login va parolni o'zingiz tanlaysiz; parol agentga aytilmaydi), keyin agentga: «{login} akkauntini namuna qil — sanoq, eslatma va xabarlarga kirmasin. Parolni so'rama.»", ru: 'Если образцового аккаунта нет — откройте его сами с экрана регистрации (логин и пароль выбираете сами; пароль агенту не говорят), потом агенту: «{login} akkauntini namuna qil — sanoq, eslatma va xabarlarga kirmasin. Parolni so\'rama.»' })}</Band>
          <Band>{tr({ uz: 'Keyin laptopda 1-namuna akkaunt, telefonda 2-namuna akkaunt bilan kiring va demo yozuvini ikkalasida oching.', ru: 'Потом войдите на ноутбуке с 1-го образцового аккаунта, на телефоне — со 2-го и откройте демо-запись на обоих.' })}</Band>
          <Qalin>{tx({ uz: "Parol hech qayerga — `DEMO.md`, repo, agent chati, video — yozilmaydi; login `DEMO.md`, repo va videoda yo'q.", ru: 'Пароль никуда — `DEMO.md`, репо, чат агента, видео — не пишут; логина нет в `DEMO.md`, репо и видео.' })}</Qalin></> },
        { h: { uz: "Uyg'otish", ru: 'Пробуждение' }, t: <>{tr({ uz: "laptopda demo yo'lini yangilang: ilova Backend'ga so'rov yuboradi. Birinchi ochilish taxminan bir daqiqa cho'zilishi mumkin; ro'yxat chiqsa — Backend uyg'ondi.", ru: 'обновите путь демо на ноутбуке: приложение отправит запрос в Backend. Первое открытие может длиться примерно минуту; появился список — Backend проснулся.' })}
          <Kulrang>{tr({ uz: "Hakamlar oldida chiqishda buni navbatingizdan bir necha daqiqa oldin qilasiz: 15 daqiqa so'rovsiz qolsa, Backend yana uxlaydi.", ru: 'При выступлении у судей вы делаете это за несколько минут до очереди: если 15 минут нет запросов, Backend снова засыпает.' })}</Kulrang>
          <Band><Tanlov tanlov={uygotish} onTanla={uyTanla} variantlar={[{ k: true, t: { uz: "Uyg'ondi — ro'yxat chiqdi", ru: 'Проснулся — список появился' } }, { k: false, t: { uz: 'Ochilmadi', ru: 'Не открылся' } }]} /></Band>
          {uygotish === false && <Band>{tx({ uz: "Agentga faqat xato qatori: «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»", ru: 'Агенту только строку ошибки: «Shu xato chiqdi: {xato}. Nima bo\'lganini ayt, hech narsani o\'zgartirma.»' })}</Band>}
          <Kulrang>{tr({ uz: 'Kutayotganda: video uchun boshqa oyna va bildirishnomalarni yoping (3-qadam).', ru: 'Пока ждёте: закройте другие окна и уведомления для видео (3-й шаг).' })}</Kulrang>
          <Yordam satrlar={[{ uz: "Mentor misolida: brauzerda `https://maydon-jamoa-….onrender.com/oyinlar` — javobda o'yinlar ro'yxati chiqadi (bu manzil kirmagan odamga ham ochiq — 12-Modulda).", ru: 'В примере Ментора: в браузере `https://maydon-jamoa-….onrender.com/oyinlar` — в ответе появится список игр (этот адрес открыт и без входа — в 12-м модуле).' }]} /></> },
        { h: { uz: 'Video', ru: 'Видео' }, t: <>{tr({ uz: "kompyuteringizdagi ekran yozish vositasi bilan demo ssenariysini bir marta o'ting va yozing: tayyorlovdan «Hozir ko'ryapti»gacha, demo o'tishingiz uzunligida (Mentor misolida — 60 soniya).", ru: 'средством записи экрана на компьютере один раз пройдите и запишите сценарий демо: от подготовки до «Сейчас смотрят», длиной с ваш прогон (в примере Ментора — 60 секунд).' })}
          <Band>{tx({ uz: "Yozishdan oldin: parol kiritiladigan joy, `.env`, terminal, chat, maxfiy tokenli manzil va boshqa oynalar ekranda ko'rinmasin. Ovoz shart emas; yuzingiz yoki ismingiz videoga tushsa — 2-darsdagi video qoidasi (ota-ona roziligi) ishga tushadi, ekran yozuvining o'zi uchun kerak emas.", ru: 'Перед записью: поле для пароля, `.env`, терминал, чат, адрес с секретным токеном и другие окна не должны быть видны. Звук не обязателен; если в видео попадут лицо или имя — действует правило видео из 2-го урока (согласие родителей), для самой записи экрана не нужно.' })}</Band>
          <Band>{tx({ uz: "Videoni repo papkasiga emas, laptopdagi boshqa papkaga saqlang — `git add` bilan GitHub'ga tushib qolmasin. Keyin demo holatini boshiga qaytaring («Keyin» qatoringiz).", ru: 'Сохраните видео не в папку репо, а в другую папку на ноутбуке, — чтобы через `git add` оно не попало на GitHub. Потом верните состояние демо к началу (ваша строка «Keyin»).' })}</Band>
          <Yordam satrlar={[{ uz: "Mentor misolida: laptopda ikki oyna yonma-yon — chapda demo yo'li (1-namuna akkaunt), o'ngda yashirin oynada o'sha o'yin (2-namuna akkaunt): 4-qadam videoda ham ko'rinadi.", ru: 'В примере Ментора: на ноутбуке два окна рядом — слева путь демо (1-й образцовый аккаунт), справа в скрытом окне та же игра (2-й образцовый аккаунт): шаг 4 тоже виден на видео.' }]} /></> },
        { h: { uz: 'Tekshirish va `DEMO.md`', ru: 'Проверить и `DEMO.md`' }, t: <>{tr({ uz: "video faylni laptopda ochib, oxirigacha ko'ring va uch qatorni belgilang:", ru: 'откройте видеофайл на ноутбуке, досмотрите до конца и отметьте три строки:' })}
          <span className="dp-belgilar">{VIDEO_TEK.map((t, i) => <Belgi key={i} on={tek[i]} onClick={() => { const a = tek.slice(); a[i] = !a[i]; setTek(a); }}>({i + 1}) {tx(t)}</Belgi>)}</span>
          <Band><Tanlov tanlov={video} onTanla={videoTanla} variantlar={[{ k: true, t: { uz: 'Video tayyor', ru: 'Видео готово' }, yopiq: !tek.every(Boolean) }, { k: false, t: { uz: "Video hali yo'q", ru: 'Видео ещё нет' } }]} /></Band>
          <Band><label className="dp-inp n"><span className="dp-joy-n">{'{N}'}</span><input type="text" inputMode="numeric" value={n} maxLength={3} placeholder={tr({ uz: 'soniya', ru: 'секунд' })} onChange={e => setN(e.target.value.replace(/\D/g, ''))} /></label>
            <span className="dp-gap">{tr({ uz: 'B reja gapingiz', ru: 'Ваша фраза плана Б' })}: «{gap}»</span></Band>
          <Band>{tr({ uz: '«Nusxalash» bilan Antigravity\'ga:', ru: 'Через «Скопировать» в Antigravity:' })}</Band>
          <DpPrompt satrlar={A2_BREJA_PROMPT} avto={{ '{B reja yozuvi}': brYozuv }} />
          <Band>{tx({ uz: "`DEMO.md` ni oching va solishtiring → `git diff -- DEMO.md` (faqat «## B reja» qatorlari) → `git status` — video ro'yxatda yo'q, faqat `DEMO.md` → `git add DEMO.md` → `git commit -m \"demo: B reja\"` → `git push`.", ru: 'Откройте `DEMO.md` и сравните → `git diff -- DEMO.md` (только строки «## B reja») → `git status` — видео в списке нет, только `DEMO.md` → `git add DEMO.md` → `git commit -m "demo: B reja"` → `git push`.' })}</Band></> }
      ]}
      qulf={(i) => (i === 1 && uygotish == null) || (i === 3 && (video == null || (video === true && nSon == null)))}
      natija={<A2Natija uygotish={uygotish} video={video} />}
      ulgur={{ uz: "Ulgurmasangiz: 2-qadamdan keyin «Davom etish» ochiladi; video — Amaliyot 3 dan keyin, shu ekranga qaytib. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: после 2-го шага откроется «Продолжить»; видео — после Практики 3, вернувшись на этот экран. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={2} ulgurShart={() => uygotish != null}
      extra={() => ({ correct: video === true, video, uygotish })}
      doneText={doneText}
      ustoz={[
        { uz: "Video yozishdan oldin ekranga birga qarang — ochiq chat, parol saqlagich oynasi, terminal ko'rinmasin. Video sinf chatiga yuborilmaydi. Namuna akkaunt paroli `DEMO.md` ga yozilmaganini tekshiring.", ru: 'Перед записью видео посмотрите на экран вместе — открытого чата, окна менеджера паролей, терминала быть не должно. Видео в чат класса не отправляют. Проверьте, что пароль образцового аккаунта не записан в `DEMO.md`.' },
        { uz: "Telefon brauzerida real vaqt ishlashini kuzating: telefon kirgan bo'lishi kerak (kirmagan odamning ekrani o'zi yangilanmaydi — 12-Modul).", ru: 'Следите, чтобы в браузере телефона работало реальное время: на телефоне должен быть выполнен вход (у невошедшего экран сам не обновляется — 12-й модуль).' }
      ]} />
  );
};

// --- Amaliyot 3: demo o'tishi, tuzatish va teg ---
const TEG_BUYRUQ = ['git tag m14-demo', 'git push origin m14-demo', 'git ls-remote --tags origin', 'git rev-parse HEAD m14-demo'];
const A3_RISK_PROMPT = [{ uz: "`DEMO.md` dagi «## Risklar» bo'limiga bitta qator qo'sh: «{qadam}: {nima bo'ldi} — {B yo'l}». Boshqa joyga va boshqa fayllarga tegma.", ru: "`DEMO.md` dagi «## Risklar» bo'limiga bitta qator qo'sh: «{qadam}: {nima bo'ldi} — {B yo'l}». Boshqa joyga va boshqa fayllarga tegma." }];
const mss = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const A3Natija = ({ belgilar, teg, rsRef, yangiRs, v }) => {
  const d = demoOqi();
  const rs = (d.risklar || []).map(r => ({ risk: { uz: r.risk, ru: r.risk }, bYol: { uz: r.bYol, ru: r.bYol } }));
  const yashil = teg === true;
  return (
    <div className="dp-an" data-v={v}>
      <div className={cx('dp-term', yashil && 'yashil')}>
        <p className="dp-term-b">$ git push origin m14-demo</p><p className="dp-term-j">{' * [new tag]         m14-demo -> m14-demo'}</p>
        <p className="dp-term-b">$ git ls-remote --tags origin</p><p className="dp-term-j">{'…	refs/tags/m14-demo'}</p>
        <p className="dp-term-b">$ git rev-parse HEAD m14-demo</p><p className="dp-term-j">{'4f1c2e…'}</p><p className="dp-term-j">{'4f1c2e…'}</p>
      </div>
      <div className="dp-an-ss">
        <SsenariyChiziq holat={belgilar.map(b => (b === true ? 'ok' : b === false ? 'err' : undefined))} />
        <Taymer tol={0} reja max={120} />
        <Kulrang>{tr({ uz: 'Keyin', ru: 'Keyin' })}: {tr(MENTOR_KEYIN)}</Kulrang>
      </div>
      <DemoMd faqat={['rs']} rsRef={rsRef} rs={rs.length ? rs : RISKLAR.map(r => ({ risk: r.nom, bYol: r.mentorBYol }))} teg={yashil} yangiRs={yangiRs} />
    </div>
  );
};
const ScreenA3 = (props) => {
  const d0 = useMemo(demoOqi, []);
  const tk = useMemo(trekOqi, []);
  const trek = tk.trek || __dpTrek;
  const ss = Array.isArray(d0.ssenariy) && d0.ssenariy.length === 5 ? d0.ssenariy : [1, 2, 3, 4, 5].map(i => i + '-qadam');
  const [tay, setTay] = useState([false, false, false, false]);
  const [ishla, setIshla] = useState(false);
  const [sek, setSek] = useState(0);
  const [otish, setOtish] = useState(d0.otishVaqt ?? null);
  const [belgilar, setBelgilar] = useState([null, null, null, null, null]);
  const [nima, setNima] = useState(['', '', '', '', '']);
  const [shart, setShart] = useState(false);
  const [qiymat, setQiymat] = useState({});
  const [teg, setTeg] = useState(d0.teg ?? null);
  const [yangiRs, setYangiRs] = useState(false);
  const [v, setV] = useState(0);
  const boshqar = useRef(null);
  const rsRef = useRef(null);
  const t0 = useRef(0); const iv = useRef(null);
  useEffect(() => () => clearInterval(iv.current), []);
  const boshla = () => { setBelgilar([null, null, null, null, null]); setNima(['', '', '', '', '']); setShart(false); setSek(0); setIshla(true); t0.current = Date.now(); clearInterval(iv.current); iv.current = setInterval(() => setSek(Math.floor((Date.now() - t0.current) / 1000)), 250); };
  const toxtat = () => {
    if (belgilar.some((b, i) => b === false && !nima[i].trim())) { setShart(true); return; }
    clearInterval(iv.current); setIshla(false);
    const s = Math.max(0, Math.floor((Date.now() - t0.current) / 1000));
    setSek(s); setOtish(s); demoYoz({ otishVaqt: s }); setV(n => n + 1);
  };
  const belgila = (i, val) => { if (!ishla) return; const a = belgilar.slice(); a[i] = val; setBelgilar(a); setShart(false); };
  const xQadam = belgilar.findIndex(b => b === false);
  const xBor = xQadam >= 0;
  const hammasiOk = belgilar.every(b => b === true);
  const avto = xBor ? { '{qadam}': (xQadam + 1) + '-qadam', "{nima bo'ldi}": nima[xQadam].trim() || null } : {};
  const riskQosh = () => {
    if (!xBor) return;
    const b = String(qiymat.byol || '').trim();
    const risk = (xQadam + 1) + '-qadam: ' + nima[xQadam].trim();
    const d = demoOqi();
    const eski = Array.isArray(d.risklar) ? d.risklar.filter(r => r.risk !== risk) : [];
    demoYoz({ risklar: [...eski, { risk, bYol: b }].slice(0, 7) });
    setYangiRs(true); setV(n => n + 1);
    const a = document.activeElement && document.activeElement.getBoundingClientRect ? document.activeElement.getBoundingClientRect() : null;
    setTimeout(() => { const box = rsRef.current; if (!box) return; const qs = box.querySelectorAll('.dp-md-q'); const t = qs[qs.length - 1]; uchir([{ a, b: t && t.getBoundingClientRect(), matn: risk + ' — ' + b }]); }, 40);
  };
  const tegTanla = (val) => { setTeg(val === 'ok'); setTegK(val); demoYoz({ teg: val === 'ok' }); setV(n => n + 1); };
  const [tegK, setTegK] = useState(d0.teg === true ? 'ok' : d0.teg === false ? 'yoq' : null);
  const qaytaOt = () => { boshqar.current && boshqar.current.qaytar(1); boshla(); };
  const doneText = (tegK === 'ok')
    ? <>{hammasiOk ? tr({ uz: 'Demo rejadagidek o\'tdi, tekshirilgan versiyaga teg qo\'yildi.', ru: 'Демо прошло по плану, на проверенную версию поставлен тег.' }) : tx({ uz: "Demo o'tdi — rejadagidek bo'lmagan qadam `DEMO.md` da; teg qo'yildi.", ru: 'Демо прошло — шаг не по плану записан в `DEMO.md`; тег поставлен.' })}
      <span className="dp-tug-q">{tr({ uz: "Shu tegdan keyin demo kunigacha mahsulotga yangi narsa qo'shilmaydi — faqat tuzatish.", ru: 'После этого тега до дня демо в продукт ничего нового не добавляют — только исправления.' })}</span>
      <span className="dp-tug-q">{tr({ uz: "Bu holat «yangi funksiya to'xtatildi» deyiladi.", ru: 'Это состояние называется «новые функции остановлены».' })}</span></>
    : tr({ uz: "Demo o'tdi — teg hali tekshirilgan versiyada emas, agent bilan ko'ring.", ru: 'Демо пройдено — тег ещё не на проверенной версии, разберитесь с агентом.' });
  return (
    <ScreenBlok {...props} boshqar={boshqar} eyebrow={{ uz: "Amaliyot 3 · o'z repo'ngiz", ru: 'Практика 3 · ваш репозиторий' }}
      title={{ uz: <>Demoni boshidan oxirigacha o'ting <span className="italic" style={{ color: T.accent }}>va teg qo'ying</span>.</>, ru: <>Пройдите демо от начала до конца <span className="italic" style={{ color: T.accent }}>и поставьте тег</span>.</> }}
      mentor={{ uz: "Demoni taymer bilan o'tasiz, tekshirilgan versiyaga teg qo'yasiz; «1 · Tayyorlov»dan boshlang.", ru: 'Пройдёте демо с таймером и поставите тег на проверенную версию; начните с «1 · Подготовка».' }}
      steps={[
        { h: { uz: 'Tayyorlov', ru: 'Подготовка' }, t: <>{tx({ uz: "terminalda `git status`: o'zgargan fayl yo'q va tarmoq «up to date» (hammasi push qilingan).", ru: 'в терминале `git status`: изменённых файлов нет и ветка «up to date» (всё запушено).' })}
          {trek !== 'web' && <Band>{tx({ uz: "Mobil trekda — brauzer ko'rinishini yangilang (push'dan keyin o'zi yangilanmaydi): `npx expo export -p web` → `netlify deploy --prod --dir dist`.", ru: 'В мобильном треке — обновите браузерную версию (после push сама не обновляется): `npx expo export -p web` → `netlify deploy --prod --dir dist`.' })}</Band>}
          {trek !== 'mobil' && <Band>{tr({ uz: "Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'В веб-треке после push Netlify обычно сам обновляет сайт.' })}</Band>}
          <Band>{tx({ uz: "Keyin `DEMO.md` dagi «Tayyorlov» ro'yxatini (`[ ]` qatorlari) bittadan belgilang:", ru: 'Потом отметьте по одной строки списка «Tayyorlov» в `DEMO.md` (строки `[ ]`):' })}</Band>
          <span className="dp-belgilar">{TAYYORLOV_KURS.map((t, i) => {
            const kul = i === 3 && d0.video !== true;
            return <Belgi key={i} on={tay[i]} yopiq={kul} onClick={() => { const a = tay.slice(); a[i] = !a[i]; setTay(a); }}>{tr(t)}{kul && <em className="dp-kul-y"> · {tr({ uz: 'video hali yo\'q', ru: 'видео ещё нет' })}</em>}</Belgi>;
          })}</span>
          <Kulrang>{tr({ uz: 'Kutayotganda (eksport, Netlify) — tayyorlov qatorlarini belgilang.', ru: 'Пока ждёте (экспорт, Netlify) — отмечайте строки подготовки.' })}</Kulrang></> },
        { h: { uz: "Demo o'tishi", ru: 'Прогон демо' }, t: <>{tx({ uz: "«Taymer»ni bosing va `DEMO.md` dagi ssenariy bo'yicha demo qiling; har qadamdan keyin chapdagi qadamni bosing: ✓ (rejadagidek) yoki ✕ (bosilsa — «Nima bo'ldi» bir qator). Oxirida «Taymerni to'xtatish».", ru: 'Нажмите «Таймер» и проведите демо по сценарию из `DEMO.md`; после каждого шага нажмите шаг слева: ✓ (по плану) или ✕ (если нажали — одна строка «Что случилось»). В конце «Остановить таймер».' })}
          <Kulrang>{tr({ uz: "Taymer chizig'ida ikki belgi: «Mentor rejasi: 60–90 soniya» · «Yechim bo'lagi: 90 soniya» (bu mashqda — pitch mashqida Yechim bo'lagiga 90 soniya ajratilgan, jonli demo shu ichida joylashadi; vaqt baho emas). Sherik bo'lsa — laptop ekraniga qarab, hakam o'rnida o'tiradi; ismi hech qayerga yozilmaydi.", ru: 'На шкале таймера две метки: «План Ментора: 60–90 секунд» · «Часть «Решение»: 90 секунд» (в этом упражнении — в питче на часть «Решение» отведено 90 секунд, живое демо помещается в них; время — не оценка). Если есть напарник — он сидит на месте судьи и смотрит на экран ноутбука; его имя нигде не пишут.' })}</Kulrang>
          <span className="dp-otish">
            <span className="dp-otish-tm"><Taymer tol={Math.min(1, sek / 120)} reja yechim max={120} holat={ishla ? undefined : otish != null ? 'ok' : undefined} dur={300} /><b className="dp-mono">{mss(ishla ? sek : (otish ?? 0))}</b></span>
            {!ishla
              ? <QTugma className={halqa(otish == null)} onClick={boshla}>{tr({ uz: 'Taymer', ru: 'Таймер' })}</QTugma>
              : <span className="dp-otish-ro">
                {ss.map((s, i) => (
                  <span key={i} className={cx('dp-otish-q', belgilar[i] === true && 'ok', belgilar[i] === false && 'err')}>
                    <span className="dp-otish-t"><i>{i + 1}</i>{s}</span>
                    <button type="button" className={cx('dp-qadam', 'ok', belgilar[i] === true && 'on')} onClick={() => belgila(i, true)} aria-label="✓">✓</button>
                    <button type="button" className={cx('dp-qadam', 'err', belgilar[i] === false && 'on')} onClick={() => belgila(i, false)} aria-label="✕">✕</button>
                    {belgilar[i] === false && <label className="dp-inp nima"><input type="text" value={nima[i]} maxLength={120} placeholder={tr({ uz: "Nima bo'ldi", ru: 'Что случилось' })} onChange={e => { const a = nima.slice(); a[i] = e.target.value; setNima(a); setShart(false); }} /></label>}
                  </span>
                ))}
                {shart && <span className="dp-xato-q"><b>{tr(XATO.nimaBoldi)}</b></span>}
                <QTugma className={halqa(belgilar.every(b => b !== null))} onClick={toxtat}>{tr({ uz: "Taymerni to'xtatish", ru: 'Остановить таймер' })}</QTugma>
              </span>}
          </span></> },
        { h: { uz: 'Natija: tuzatish va qayta o\'tish', ru: 'Итог: исправление и повторный прогон' }, t: <>{tr({ uz: 'vaqtingiz kartada (soniya).', ru: 'ваше время на карточке (секунды).' })}
          <span className="dp-vaqt"><b className="dp-mono">{otish ?? 0}</b>{NB}{tr({ uz: 'soniya', ru: 'секунд' })}</span>
          {otish != null && otish > 90 && <Kulrang>{tr({ uz: 'Qaysi qadam cho\'zildi? Ssenariyni qisqartirish mumkinmi?', ru: 'Какой шаг затянулся? Можно ли сократить сценарий?' })}</Kulrang>}
          {xBor ? <>
            <Band>{tr({ uz: '✕ qadam bo\'lsa — (a) «Nusxalash» bilan Antigravity\'ga:', ru: 'Если есть шаг ✕ — (а) через «Скопировать» в Antigravity:' })}</Band>
            <DpPrompt satrlar={A3_RISK_PROMPT} avto={avto} joylar={[{ id: 'byol', joy: "{B yo'l}", namuna: { uz: 'masalan: tayyorlovda shu ekranni oldindan ochaman', ru: 'например: на подготовке заранее открою этот экран' } }]} qiymat={qiymat} onYoz={(k, val) => setQiymat(q => ({ ...q, [k]: val }))}
              tekshir={(q) => { const x = bYolTekshir(q.byol); return x && x.blok ? (x.x === 'pii' ? XATO.pii : XATO.rsBosh) : null; }} onNusxa={riskQosh} />
            <Band>{tx({ uz: "`git diff -- DEMO.md` — faqat shu qator qo'shilganini ko'ring → `git add DEMO.md` → `git commit -m \"demo: yangi risk\"` → `git push`.", ru: '`git diff -- DEMO.md` — убедитесь, что добавлена только эта строка → `git add DEMO.md` → `git commit -m "demo: yangi risk"` → `git push`.' })}</Band>
            <Band>{tx({ uz: "(b) Tuzatish kerak bo'lsa — faqat tuzatish, yangi funksiya yo'q: agentga «{qadam} demoda {nima bo'ldi}. Faqat shuni tuzat, yangi narsa qo'shma, o'zgargan fayllarni ayt.» → `git diff` — faqat shu muammoga tegishli qatorlar o'zgarganmi (yangi tugma, ekran, kutubxona yo'q) → lokal ko'ring (demo yo'lidagi o'sha qadam) → `git add <fayl>` → `git commit -m \"demo: tuzatish\"` → `git push` → mobil trekda brauzer ko'rinishini qayta eksport qiling, web-trekda Netlify yangilanishini kuting; ikkala qurilmada sahifani yangilang.", ru: '(б) Если нужно исправление — только исправление, без новой функции: агенту «{qadam} demoda {nima bo\'ldi}. Faqat shuni tuzat, yangi narsa qo\'shma, o\'zgargan fayllarni ayt.» → `git diff` — изменились ли только строки этой проблемы (нет новой кнопки, экрана, библиотеки) → посмотрите локально (тот же шаг пути демо) → `git add <fayl>` → `git commit -m "demo: tuzatish"` → `git push` → в мобильном треке заново экспортируйте браузерную версию, в веб-треке дождитесь обновления Netlify; обновите страницу на обоих устройствах.' })}</Band>
            <Band>{tr({ uz: "(c) Tuzatishdan keyin demoni boshidan oxirigacha yana bir marta o'ting (2-qadam kabi, taymer bilan) — natija oxirgi o'tishniki. Yana ✕ chiqsa — holat «hali tugamagan» bo'lib qoladi: ikkinchi tuzatish aylanishi bu darsda yo'q.", ru: '(в) После исправления пройдите демо от начала до конца ещё раз (как шаг 2, с таймером) — итог по последнему прогону. Если снова ✕ — состояние остаётся «ещё не готово»: второго круга исправлений на этом уроке нет.' })}</Band>
            <QTugma ikkinchi className="dp-qayta" onClick={qaytaOt}>{tr({ uz: "Qayta o'tish", ru: 'Повторный прогон' })}</QTugma>
          </> : null}
          <Kulrang>{tr({ uz: "Oxirida «Keyin» qatoringiz bo'yicha demo holatini boshiga qaytaring.", ru: 'В конце верните состояние демо к началу по своей строке «Keyin».' })}</Kulrang></> },
        { h: { uz: 'Teg', ru: 'Тег' }, t: <>{tx({ uz: "faqat oxirgi o'tish tugagach (tekshirilgan versiya): `git status` — toza va «up to date». Terminalda, navbat bilan («Nusxalash» bilan):", ru: 'только после последнего прогона (проверенная версия): `git status` — чисто и «up to date». В терминале по очереди (через «Скопировать»):' })}
          <span className="dp-buyruqlar">{TEG_BUYRUQ.map(b => <Buyruq key={b} b={b} />)}</span>
          <Band>{tx({ uz: "Javobda `* [new tag] m14-demo -> m14-demo`; ro'yxatda `refs/tags/m14-demo` qatori bo'lsin; `git rev-parse HEAD m14-demo` — ikki qator bir xil bo'lsin (teg aynan shu tekshirilgan versiyada).", ru: 'В ответе `* [new tag] m14-demo -> m14-demo`; в списке должна быть строка `refs/tags/m14-demo`; `git rev-parse HEAD m14-demo` — две строки одинаковые (тег именно на этой проверенной версии).' })}</Band>
          <Kulrang>{tx({ uz: 'Oddiy `git push` tegni olib ketmaydi — teg alohida yuboriladi.', ru: 'Обычный `git push` тег не уносит — тег отправляют отдельно.' })}</Kulrang>
          <Kulrang>{tx({ uz: "«tag 'm14-demo' already exists» chiqsa — `git rev-parse HEAD m14-demo`: bir xil bo'lsa faqat push va tekshiruv; har xil bo'lsa «Teg mos emas».", ru: 'Если появилось «tag \'m14-demo\' already exists» — `git rev-parse HEAD m14-demo`: одинаковые — только push и проверка; разные — «Тег не совпадает».' })}</Kulrang>
          <Kulrang>{tx({ uz: "«Ortda qoldingizmi»dagi `m14-dars-…-done` — Mentor repo'sidagi teg; bugun o'z repo'ngizga tegni o'zingiz qo'ydingiz.", ru: '`m14-dars-…-done` из «Отстали» — тег в репо Ментора; сегодня вы сами поставили тег в свой репо.' })}</Kulrang>
          <Band><Tanlov tanlov={tegK} onTanla={tegTanla} variantlar={[{ k: 'ok', t: { uz: "Teg GitHub'da", ru: 'Тег на GitHub' } }, { k: 'yoq', t: { uz: 'Teg chiqmadi', ru: 'Тег не ушёл' } }, { k: 'mos', t: { uz: 'Teg mos emas', ru: 'Тег не совпадает' } }]} /></Band>
          {tegK === 'yoq' && <Band>{tx({ uz: "Xato qatorini agentga: «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»", ru: 'Строку ошибки — агенту: «Shu xato chiqdi: {xato}. Nima bo\'lganini ayt, hech narsani o\'zgartirma.»' })}</Band>}
          {tegK === 'mos' && <Kulrang>{tr({ uz: "Eski versiyada — agent bilan ko'ring; tegni ko'chirish bu darsda o'rgatilmaydi.", ru: 'На старой версии — разберитесь с агентом; перенос тега на этом уроке не изучают.' })}</Kulrang>}</> }
      ]}
      qulf={(i) => (i === 1 && (otish == null || ishla)) || (i === 3 && tegK == null)}
      natija={<A3Natija belgilar={belgilar} teg={teg} rsRef={rsRef} yangiRs={yangiRs} v={v} />}
      ulgur={{ uz: "Ulgurmasangiz: 2-qadamdan keyin (demo o'tishi tugagach) «Davom etish» ochiladi; tuzatish, qayta o'tish va teg — dars oxirida, shu ekranga qaytib (teg tekshirilmagan versiyaga qo'yilmaydi). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: после 2-го шага (прогон закончен) откроется «Продолжить»; исправление, повторный прогон и тег — в конце урока, вернувшись на этот экран (на непроверенную версию тег не ставят). Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={2} ulgurShart={() => otish != null && !ishla}
      extra={() => ({ correct: teg === true && otish != null, teg, otishVaqt: otish, otishOk: hammasiOk })}
      doneText={doneText}
      ustoz={[
        { uz: "Kim kimdan tez o'tgani sanalmaydi. Mobil trekda eksport unutilsa, demo eski versiyada ko'rsatiladi — 1-qadamni va tuzatishdan keyingi qayta eksportni o'tkazib yubormang. Teg faqat oxirgi tekshirilgan o'tishdan keyin; agentga «yana bir narsa qo'shay» desa — «Yo'q, faqat tuzatish».", ru: 'Кто кого быстрее прошёл — не считают. Если в мобильном треке забыть экспорт, демо покажут на старой версии, — не пропускайте 1-й шаг и повторный экспорт после исправления. Тег — только после последнего проверенного прогона; если агенту скажут «добавлю ещё кое-что» — «Нет, только исправление».' }
      ]} />
  );
};

const KARTALAR = [
  { front: { uz: 'Demo ssenariysi nima?', ru: 'Что такое сценарий демо?' }, back: { uz: "Demoda bosiladigan qadamlar ro'yxati", ru: 'Список шагов, которые нажимают в демо' }, note: { uz: 'Mentor misolida — besh qadam, 60–90 soniya', ru: 'В примере Ментора — пять шагов, 60–90 секунд' } },
  { front: { uz: "Demo o'tishi nima?", ru: 'Что такое прогон демо?' }, back: { uz: "Demoni boshidan oxirigacha bir marta ko'rsatish", ru: 'Один показ демо от начала до конца' }, note: { uz: "Taymer bilan o'tiladi", ru: 'Проходят с таймером' } },
  { front: { uz: "Nega har o'tishdan keyin holat boshiga qaytariladi?", ru: 'Зачем после каждого прогона возвращать состояние к началу?' }, back: { uz: "Demo ma'lumotni o'zgartiradi — keyingi o'tish boshidan boshlanishi kerak", ru: 'Демо меняет данные — следующий прогон должен начаться с начала' }, note: { uz: "Mentor misolida — o'yindan chiqish, yana «8 / 10»", ru: 'В примере Ментора — выход из игры, снова «8 / 10»' } },
  { front: { uz: 'Bu darsda risk nima?', ru: 'Что такое риск на этом уроке?' }, back: { uz: "Demoga xalaqit berishi mumkin bo'lgan narsa", ru: 'То, что может помешать демо' }, note: { uz: '11-Modulda — rejaga xalaqit beradigan narsa edi', ru: 'В 11-м модуле — то, что мешает плану' } },
  { front: { uz: "B yo'l nima?", ru: 'Что такое путь Б?' }, back: { uz: "Risk bo'lsa ham demo davom etishi uchun oldindan qilinadigan ish", ru: 'Действие заранее, чтобы демо продолжилось даже при риске' }, note: { uz: 'Yangi funksiya emas; tuzatish mumkin', ru: 'Не новая функция; исправление можно' } },
  { front: { uz: 'B reja nima?', ru: 'Что такое план Б?' }, back: { uz: "Demo ishlamay qolsa ko'rsatiladigan oldindan yozilgan ekran videosi", ru: 'Заранее записанное видео экрана, которое показывают, если демо не сработало' }, note: { uz: '11-Modulda — ekran videosi; Mentor misolida 60 soniya', ru: 'В 11-м модуле — видео экрана; в примере Ментора 60 секунд' } },
  { front: { uz: 'B reja videosi qayerda turadi?', ru: 'Где хранится видео плана Б?' }, back: { uz: 'Demo ochiladigan laptopda, faylda', ru: 'На ноутбуке, где открывают демо, в файле' }, note: { uz: "Havola internetsiz ochilmaydi; repo'ga qo'shilmaydi", ru: 'Ссылка без интернета не откроется; в репо не добавляют' } },
  { front: { uz: 'Bepul Backend qachon uxlab qoladi?', ru: 'Когда засыпает бесплатный Backend?' }, back: { uz: "15 daqiqa so'rovsiz qolganda", ru: 'Когда 15 минут нет запросов' }, note: { uz: "Render; uyg'onishi taxminan bir daqiqa", ru: 'Render; просыпается примерно за минуту' } },
  { front: { uz: "Backend'ni qanday uyg'otasiz?", ru: 'Как разбудить Backend?' }, back: { uz: "Navbatdan bir necha daqiqa oldin demo yo'lini ochib", ru: 'Открыв путь демо за несколько минут до очереди' }, note: { uz: "Ro'yxat chiqsa — uyg'ondi", ru: 'Появился список — проснулся' } },
  { front: { uz: "Demoni qaysi akkaunt bilan ko'rsatasiz?", ru: 'С какого аккаунта показываете демо?' }, back: { uz: 'Namuna akkaunt bilan — ikkala qurilmada oldindan kirilgan', ru: 'С образцового аккаунта — вход заранее на обоих устройствах' }, note: { uz: "Sanoqqa kirmaydi; parol `DEMO.md` ga yozilmaydi", ru: 'Не входит в подсчёт; пароль в `DEMO.md` не пишут' } },
  { front: { uz: "«Yangi funksiya to'xtatildi» nimani bildiradi?", ru: 'Что значит «новые функции остановлены»?' }, back: { uz: "Tegdan keyin faqat tuzatish, yangi narsa qo'shilmaydi", ru: 'После тега только исправления, ничего нового не добавляют' }, note: { uz: 'Inglizchasi: feature freeze; teg `m14-demo`', ru: 'По-английски: feature freeze; тег `m14-demo`' } },
  { front: { uz: "Tegni GitHub'ga qanday chiqarasiz?", ru: 'Как отправить тег на GitHub?' }, back: { uz: '`git push origin m14-demo` buyrug\'i bilan', ru: 'Командой `git push origin m14-demo`' }, note: { uz: 'Oddiy `git push` tegni olib ketmaydi', ru: 'Обычный `git push` тег не уносит' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('dp-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="dp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (SABOQ E 50 — «Bugungi asosiy fikr» yo'q; uyga vazifa yo'q — loyiha kuni). Sarlavha holatga qarab, har biri rost (E 54) =====
const YAKUN_SARLAVHA = {
  toliq: { uz: "Demo bir marta to'liq o'tdi — B reja va teg tayyor.", ru: 'Демо один раз пройдено полностью — план Б и тег готовы.' },
  otdi: { uz: "Demo bir marta o'tdi — hali tugamagan ish bor.", ru: 'Демо пройдено один раз — есть незаконченная работа.' },
  ssenariy: { uz: "Ssenariy va risklar yozildi — demo o'tishi qoldi.", ru: 'Сценарий и риски записаны — осталось пройти демо.' },
  chala: { uz: 'Demoga tayyorgarlik hali tugamagan.', ru: 'Подготовка к демо ещё не закончена.' },
  yoq: { uz: 'Demo ssenariysi bugun hali yozilmagan.', ru: 'Сценарий демо сегодня ещё не написан.' }
};
const RECAP = [
  { uz: "Demoda bosiladigan qadamlar ro'yxati — demo ssenariysi.", ru: 'Список шагов, которые нажимают в демо, — сценарий демо.' },
  { uz: "Demo ma'lumotni o'zgartirsa, keyingi o'tishdan oldin holat boshiga qaytariladi.", ru: 'Если демо меняет данные, перед следующим прогоном состояние возвращают к началу.' },
  { uz: "Har riskka B yo'l oldindan tayyorlanadi — demo oldidan yangi funksiya qo'shilmaydi, faqat tuzatish.", ru: 'Для каждого риска заранее готовят путь Б — перед демо новые функции не добавляют, только исправления.' },
  { uz: 'B reja videosi laptopda faylda turadi: internet uzilsa ham ochiladi.', ru: 'Видео плана Б хранится на ноутбуке в файле: откроется даже без интернета.' },
  { uz: "Teg qo'yilgach yangi funksiya to'xtatiladi — faqat tuzatish qilinadi.", ru: 'После тега новые функции останавливают — делают только исправления.' }
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
  const blok = (id) => answers[SCREEN_META.findIndex(m => m.id === id)];
  const a1 = !!blok('s3')?.solved; const a2 = !!blok('s6')?.solved; const a3 = blok('s8');
  const d = demoOqi();
  const ssOk = Array.isArray(d.ssenariy) && d.ssenariy.length === 5;
  const holat = a1 && a2 && a3?.solved && d.video === true && d.teg === true && a3.otishOk === true ? 'toliq'
    : d.otishVaqt != null ? 'otdi'
      : a1 ? 'ssenariy'
        : ssOk ? 'chala' : 'yoq';
  const chip = a2 ? { uz: '`DEMO.md` tayyor', ru: '`DEMO.md` готов' } : a1 ? { uz: '`DEMO.md`: ssenariy va risklar', ru: '`DEMO.md`: сценарий и риски' } : null;
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cx('dp-yakun', !chip && 'belgisiz', holat !== 'toliq' && 'nishonsiz')}>
        <QYakun til={__lang}
          chip={chip ? tx(chip) : ''}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(r => tx(r))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="dp-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Investor ko'zi bilan: demo buzilmaydimi?»</b></>, ru: <>Следующий урок — <b>«Investor ko'zi bilan: demo buzilmaydimi?»</b></> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};

export default function DemoPrepLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen4, Screen5, ScreenA2, Screen7, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === 14-Modul 6-dars (dp-): bitta vizual — laptop brauzeri + telefon + ssenariy chizig'i + taymer + DEMO.md kartasi. Faqat qolip tokenlari (D3) + «Maydon Jamoa» yashili; emoji yo'q (D4) === */
        .dp-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: dp-puls 2.2s ease-out .3s 3; }
        @keyframes dp-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .dp-k { display: contents; }
        .dp-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: dp-chorla-v 1.8s ease-out .5s 2; }
        .dp-k.faol .q-variant:nth-child(2), .dp-chorla .q-chip:nth-child(2) { animation-delay: .75s; }
        .dp-k.faol .q-variant:nth-child(3), .dp-chorla .q-chip:nth-child(3) { animation-delay: 1s; }
        .dp-chorla .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: dp-chorla-c 1.8s ease-out .5s 2; }
        @keyframes dp-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes dp-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .dp-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .dp-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .dp-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .dp-x-tx b { color: ${T.ink}; } .q-xulosa .dp-x-tx.ok, .q-xulosa .dp-x-tx.ok b { color: ${T.ok}; } .q-xulosa .dp-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .dp-x-m { display: block; font-size: 15px; }
        .q-xulosa .dp-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; }
        .dp-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .dp-ustoz b { color: ${T.ink}; }
        p.dp-ipucha { margin: 0; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .dp-uchar { position: fixed; z-index: 2000; pointer-events: none; padding: 6px 10px; border-radius: 8px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.45); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: transform .6s cubic-bezier(.5,0,.3,1), opacity .6s ease-in; }
        .dp-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        .dp-mono { font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
        .dp-sahna { display: flex; flex-direction: column; gap: 10px; }
        .dp-k-sahna { gap: 8px; }
        .q-kirish .zoomable:not(.zoom-on) > .zoom-btn { right: auto; left: calc(50% - 58px); }
        @media (max-width: 760px) { .q-kirish .zoomable:not(.zoom-on) > .zoom-btn { left: auto; right: 8px; } }
        .dp-misol-y { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; padding: 3px 9px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .dp-qurilma { display: flex; gap: 14px; align-items: flex-end; justify-content: center; }
        .dp-qurilma.bir { align-items: center; }
        .dp-qurilma.mini { zoom: .62; justify-content: flex-start; }
        .dp-qur-y { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        /* Telefon ≈170×272 */
        .dp-tel-w { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .dp-tel { width: 170px; height: 272px; flex: none; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex-direction: column; }
        .dp-tel > * { background: ${T.paper}; }
        .dp-tel-bar { display: flex; flex-direction: column; gap: 1px; padding: 9px 10px 4px; border-radius: 18px 18px 0 0; font-size: 12px; }
        .dp-tel-url { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; }
        .dp-tel-ekran { flex: 1; display: flex; padding: 2px 10px 10px; border-radius: 0 0 18px 18px; min-height: 0; }
        .dp-tel.kulrang .dp-tel-ekran > *, .dp-tel.kulrang .dp-tel-bar > * { opacity: .45; }
        .dp-oyin { flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; min-width: 0; }
        .dp-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .dp-oyin-vaqt { font-size: 13px; color: ${T.ink}; }
        .dp-oyin-joy { font-size: 12px; color: ${T.ink2}; }
        .dp-oyin-son { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 800; color: ${T.ink}; margin-top: 2px; white-space: nowrap; }
        .dp-oyin-son.yangi { color: ${MJ_RANG}; animation: dp-pop .5s cubic-bezier(.3,1.5,.5,1); }
        @keyframes dp-pop { from { transform: scale(1.35); } }
        .dp-doira { display: flex; flex-wrap: wrap; gap: 3px; }
        .dp-doira i { width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid ${T.line}; }
        .dp-doira i.bor { border: 0; background: ${fon(MJ_RANG, 0.75)}; }
        .dp-oyin-tugma { margin-top: auto; align-self: stretch; text-align: center; font-size: 12px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 7px 6px; transition: background .3s; }
        .dp-oyin-tugma.chiq { background: ${fon(T.ink, 0.1)}; color: ${T.ink}; }
        .dp-oyin-kor { font-size: 12px; color: ${T.ink2}; } .dp-oyin-kor b { color: ${T.ink}; }
        .dp-oyin.mini { zoom: .78; }
        /* Laptop brauzeri */
        .dp-lap-w { display: flex; flex-direction: column; gap: 6px; flex: 1 1 300px; min-width: 260px; max-width: 460px; }
        .dp-lap { border-radius: 12px 12px 4px 4px; background: #1E1B26; padding: 8px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); }
        .dp-lap-bar { display: flex; align-items: center; gap: 5px; padding: 6px 8px; border-radius: 7px 7px 0 0; background: ${T.bg}; }
        .dp-lap-bar > i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; flex: none; }
        .dp-url { flex: 1; min-width: 0; margin-left: 4px; padding: 3px 8px; border-radius: 999px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .dp-url.qizil { color: ${T.err}; }
        .dp-wifi { flex: none; color: ${T.ink2}; } .dp-wifi.yoq { color: ${T.err}; }
        .dp-lap-ekran { display: flex; flex-direction: column; gap: 8px; min-height: 196px; padding: 10px 12px 12px; border-radius: 0 0 7px 7px; background: ${T.paper}; }
        .dp-lap-ust { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; font-size: 14px; }
        .dp-lap-ust em { font-style: normal; font-size: 11.5px; color: ${T.ink2}; }
        .dp-lap-bosh { flex: 1; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 12px; }
        .dp-lap-xush { font-size: 14px; color: ${T.ink2}; }
        .dp-oyinlar { font: inherit; font-size: 14px; font-weight: 800; padding: 9px 18px; border-radius: 10px; border: 0; color: #fff; background: ${MJ_RANG}; cursor: pointer; }
        .dp-oyinlar.xira { opacity: .4; cursor: default; }
        .dp-lap-yuk { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 700; color: ${T.ink2}; }
        .dp-aylana { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid ${T.line}; border-top-color: ${T.accent}; animation: dp-ayl 0.9s linear infinite; }
        @keyframes dp-ayl { to { transform: rotate(360deg); } }
        .dp-lap-ro { display: flex; flex-direction: column; gap: 8px; }
        .dp-oy-karta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 14px; color: ${T.ink2}; }
        .dp-oy-karta b { color: ${T.ink}; }
        .dp-lap-xato { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; font-size: 15px; color: ${T.err}; }
        .dp-lap-xato .dp-wifi { width: 34px; height: 28px; }
        .dp-video { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .dp-pufak { display: flex; flex-direction: column; gap: 2px; padding: 8px 11px; border-radius: 4px 12px 12px 12px; background: ${T.accentSoft}; font-size: 14px; line-height: 1.4; color: ${T.ink}; }
        .dp-pufak em { font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.accent}; }
        .dp-video-ram { position: relative; display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 12px; }
        .dp-video-ch { display: flex; gap: 4px; }
        .dp-video-ch i { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10.5px; font-weight: 800; background: ${T.line}; color: ${T.ink2}; transition: background .3s, color .3s; }
        .dp-video-ch i.on { background: ${T.okFon}; color: ${T.ok}; }
        .dp-video-bar { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .dp-video-bar b { color: ${T.ink}; white-space: nowrap; }
        .dp-video-play { width: 0; height: 0; border-left: 9px solid ${T.ink}; border-top: 6px solid transparent; border-bottom: 6px solid transparent; flex: none; }
        .dp-video-iz { flex: 1; height: 5px; border-radius: 99px; background: ${T.line}; overflow: hidden; }
        .dp-video-iz i { display: block; height: 100%; background: ${T.ok}; transform-origin: left; transition: transform 1.1s linear; }
        .dp-lap-tag { display: block; height: 8px; margin: 0 -10px; border-radius: 0 0 10px 10px; background: ${fon(T.ink, 0.25)}; }
        /* Backend chirog'i */
        .dp-chiroq { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; color: ${T.ink2}; }
        .dp-chiroq > i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background .4s; }
        .dp-chiroq-n { font-weight: 700; }
        .dp-chiroq b { font-weight: 800; color: ${T.ink2}; }
        .dp-chiroq.uygonmoqda > i { background: ${T.accent}; animation: dp-milt 1s ease-in-out infinite; } .dp-chiroq.uygonmoqda b { color: ${T.accent}; }
        .dp-chiroq.ishlayapti > i { background: ${T.ok}; } .dp-chiroq.ishlayapti b { color: ${T.ok}; }
        @keyframes dp-milt { 50% { opacity: .35; } }
        .dp-soat { display: inline-flex; align-items: center; gap: 4px; color: ${T.accent}; } .dp-soat em { font-style: normal; font-size: 11.5px; }
        .dp-soat-ic { animation: dp-ayl 2s linear infinite; }
        /* Ssenariy chizig'i */
        .dp-ss { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; padding-top: 18px; }
        .dp-ss-i { position: relative; display: flex; align-items: center; gap: 6px; min-width: 0; padding: 7px 8px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; font-weight: 700; color: ${T.ink2}; transition: background .3s, border-color .3s, color .3s; }
        .dp-ss-i > i { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.line}; color: ${T.ink2}; }
        .dp-ss-i > span { min-width: 0; line-height: 1.2; }
        .dp-ss-i.joriy { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.ink}; } .dp-ss-i.joriy > i { background: ${T.accent}; color: #fff; }
        .dp-ss-i.ok { background: ${T.okFon}; border-color: ${fon(T.ok, 0.3)}; color: ${T.ok}; } .dp-ss-i.ok > i { background: ${T.ok}; color: #fff; }
        .dp-ss-i.err { background: ${T.errFon}; border-color: ${fon(T.err, 0.35)}; color: ${T.err}; } .dp-ss-i.err > i { background: ${T.err}; color: #fff; }
        .dp-ss-y { position: absolute; left: 0; bottom: calc(100% + 3px); white-space: nowrap; font-style: normal; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .dp-ss-y.qizil { color: ${T.err}; }
        /* Taymer chizig'i */
        .dp-tm { display: flex; flex-direction: column; gap: 3px; }
        .dp-tm-yorl { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .dp-tm-yorl .yechim { color: ${T.accent}; } .dp-tm-yorl b { color: ${T.err}; }
        .dp-tm.ok .dp-tm-yorl b { color: ${T.ok}; }
        .dp-tm-chiziq { position: relative; display: block; height: 8px; border-radius: 99px; background: ${T.line}; overflow: visible; }
        .dp-tm-reja { position: absolute; top: -3px; bottom: -3px; border-radius: 4px; background: ${fon(T.ok, 0.22)}; }
        .dp-tm-tol { position: absolute; inset: 0; display: block; border-radius: 99px; background: ${T.accent}; transform-origin: left; transition-property: transform, background; transition-timing-function: linear; transition-duration: 900ms; }
        .dp-tm.err .dp-tm-tol { background: ${T.err}; } .dp-tm.ok .dp-tm-tol { background: ${T.ok}; }
        .dp-tm-belgi { position: absolute; top: -5px; bottom: -5px; width: 2px; margin-left: -1px; background: ${T.accent}; }
        .dp-tm-chet { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        /* DEMO.md kartasi */
        .dp-md { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .dp-md-fayl { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
        .dp-teg { padding: 2px 9px; border-radius: 999px; background: ${T.okFon}; color: ${T.ok}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
        .dp-md-b { display: flex; flex-direction: column; gap: 3px; }
        .dp-md-h { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.accent}; }
        .dp-md-q { display: block; font-size: 14px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .dp-md-q.kul { color: ${T.ink2}; font-size: 13px; }
        .dp-md-q.bosh { height: 12px; margin: 3px 0; border-radius: 4px; border: 1.5px dashed ${T.line}; }
        .dp-md-q.kirdi { animation: dp-kir .35s ease-out both; }
        @keyframes dp-kir { from { opacity: 0; transform: translateY(4px); } }
        .dp-reja-chap { display: flex; flex-direction: column; gap: 12px; }
        p.dp-mono-q { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        .dp-tk-qator { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
        @media (max-width: 760px) { .dp-tk-qator { grid-template-columns: 1fr; } }
        .dp-sirg { font-size: 14px; color: ${T.ink2}; padding: 5px 10px; border-radius: 8px; background: ${T.paper}; animation: dp-sirg .45s ease-out both; }
        @keyframes dp-sirg { from { opacity: 0; transform: translateX(-14px); } }
        .dp-amal { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; }
        .dp-amal.ustun { flex-direction: column; align-items: stretch; flex: 0 1 220px; align-self: center; }
        .dp-sb { font: inherit; display: inline-flex; align-items: center; gap: 6px; padding: 10px 15px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 14px; font-weight: 700; }
        button.dp-sb { cursor: pointer; color: ${T.ink}; border-color: ${fon(T.accent, 0.55)}; }
        .dp-sb.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.35)}; background: ${T.okFon}; }
        .dp-sb.err { color: ${T.err}; border-color: ${fon(T.err, 0.35)}; background: ${T.errFon}; }
        .dp-sb b { font-weight: 800; }
        .dp-korsat, .dp-yana, .dp-qaytar, .dp-kutish, .dp-havola, .dp-fayl { min-height: 42px; }
        /* Test vizuallari */
        .dp-kitob { display: flex; align-items: center; gap: 14px; }
        .dp-kitob-tel { width: 150px; display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 20px; border: 6px solid #1E1B26; background: ${T.paper}; }
        .dp-kitob-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .dp-kitob-k { display: flex; gap: 8px; align-items: center; }
        .dp-kitob-k > i { width: 24px; height: 32px; border-radius: 3px; background: ${fon(T.accent, 0.3)}; }
        .dp-kitob-k > span { display: flex; flex-direction: column; font-size: 12px; } .dp-kitob-k em { font-style: normal; color: ${T.ink2}; }
        .dp-kitob-t { text-align: center; font-size: 12px; font-weight: 800; padding: 7px; border-radius: 9px; background: ${T.accent}; color: #fff; }
        .dp-kitob-t.ikk { background: ${fon(T.ink, 0.1)}; color: ${T.ink}; } .dp-kitob-t.bos { box-shadow: 0 0 0 2px ${T.accent}; }
        .dp-kitob-y { font-size: 13px; font-weight: 800; color: ${T.accent}; }
        .dp-uy { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .dp-uy-chiz { position: relative; display: flex; gap: 0; width: 100%; max-width: 420px; padding-top: 22px; }
        .dp-uy-qavs { position: absolute; top: 0; left: 8%; right: 8%; height: 14px; border: 1.5px solid ${T.ok}; border-bottom: 0; border-radius: 6px 6px 0 0; }
        .dp-uy-qavs em { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); padding: 0 6px; background: ${T.bg}; font-style: normal; font-size: 12px; font-weight: 800; color: ${T.ok}; }
        .dp-uy-o { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; position: relative; }
        .dp-uy-o > i { width: 12px; height: 12px; border-radius: 50%; background: ${T.ok}; z-index: 1; }
        .dp-uy-o + .dp-uy-o::before { content: ''; position: absolute; top: 5px; right: 50%; width: 100%; height: 2px; background: ${fon(T.ok, 0.4)}; }
        .dp-uy-o b { font-size: 13px; color: ${T.ink}; } .dp-uy-o.ok b { color: ${T.ok}; }
        /* Amaliyot bloklari */
        .dp-blok { display: contents; }
        .dp-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .dp-blok.tugadi .q-blok-qadamlar { display: none; }
        .dp-band-q, .dp-kulrang, .dp-qalin, .dp-xato, .dp-ps, .dp-joylar, .dp-yordam, .dp-yordam-s, .dp-yordam-ust, .dp-trek, .dp-tanlov, .dp-belgilar, .dp-forma, .dp-risklar, .dp-otish, .dp-buyruqlar, .dp-vaqt, .dp-ixcham, .dp-xato-q { display: block; }
        .dp-band-q { margin-top: 6px; }
        .dp-kulrang { margin-top: 6px; font-size: 13px; color: ${T.ink2}; }
        .dp-qalin { margin-top: 8px; font-weight: 800; color: ${T.ink}; }
        .dp-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .dp-xato-q { margin-top: 6px; }
        .dp-xato-q b { display: block; font-size: 13.5px; color: ${T.err}; } .dp-xato-q em { display: block; font-style: normal; font-size: 12.5px; color: ${T.ink2}; }
        .q-blok-t .qcode, .dp-yordam .qcode, .dp-ps .qcode { white-space: normal; overflow-wrap: anywhere; }
        .dp-prompt { display: block; }
        .dp-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; }
        .dp-ps + .dp-ps { margin-top: 4px; }
        .dp-ps .q-joy { display: inline-block; max-width: 100%; }
        .dp-joylar { margin-top: 8px; }
        .dp-joy-m { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .dp-joy-m:focus-within { border-color: ${T.accent}; }
        .dp-joy-n { flex: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .dp-joy-m input { flex: 1; min-width: 160px; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; padding: 10px 10px 10px 0; color: ${T.ink}; }
        .dp-nusxa { font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; padding: 4px 10px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; }
        .dp-buyruqlar > * + * { margin-top: 5px; }
        .dp-buyruq { display: flex; align-items: center; gap: 8px; }
        .dp-buyruq code { flex: 1; min-width: 0; padding: 6px 10px; border-radius: 8px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; overflow-wrap: anywhere; }
        .dp-yordam-ust { margin-top: 8px; }
        .dp-yordam-ust .q-btn { margin-left: 0; }
        .dp-yordam-btn { align-self: flex-start; }
        .dp-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .dp-yordam b { display: block; margin-bottom: 4px; font-size: 12px; color: ${T.ink2}; }
        .dp-yordam-s + .dp-yordam-s { margin-top: 4px; }
        .dp-trek .q-chip + .q-chip, .dp-tanlov .q-chip + .q-chip { margin-left: 6px; }
        .dp-tanlov .q-chip { margin-top: 4px; }
        .dp-belgilar { margin-top: 6px; }
        .dp-belgilar > * + * { margin-top: 5px; }
        .dp-belgi { font: inherit; display: flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; padding: 7px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-size: 13.5px; cursor: pointer; }
        .dp-belgi > i { flex: none; width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; color: #fff; }
        .dp-belgi.on { border-color: ${fon(T.ok, 0.4)}; background: ${T.okFon}; } .dp-belgi.on > i { background: ${T.ok}; border-color: ${T.ok}; }
        .dp-belgi:disabled { opacity: .6; cursor: default; }
        .dp-kul-y { font-style: normal; color: ${T.ink2}; }
        p.dp-ortda, p.dp-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.dp-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.paper}; }
        .dp-ixcham { margin-top: 8px; padding: 7px 12px; border-radius: 10px; background: ${T.okFon}; color: ${T.ok}; font-weight: 800; font-size: 14px; }
        .dp-ixcham b { margin-right: 6px; }
        .dp-tahrir { font: inherit; margin-left: 10px; padding: 1px 8px; border-radius: 7px; border: 1px solid ${fon(T.ok, 0.35)}; background: ${T.paper}; color: ${T.ok}; cursor: pointer; }
        .dp-forma { margin-top: 8px; }
        .dp-forma > * + * { margin-top: 6px; }
        .dp-inp { position: relative; display: flex; align-items: center; gap: 8px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; padding-left: 10px; }
        .dp-inp:focus-within { border-color: ${T.accent}; }
        .dp-inp input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14px; padding: 9px 10px 9px 0; color: ${T.ink}; }
        .dp-inp.keyin { border-style: solid; background: ${T.bg}; }
        .dp-inp.n { display: inline-flex; width: 140px; }
        .dp-inp.nima { flex-basis: 100%; margin-top: 4px; }
        .dp-sanoq { font-style: normal; font-size: 11.5px; color: ${T.err}; padding-right: 8px; }
        .dp-saqla { margin-top: 6px; }
        .dp-gap { display: block; margin-top: 6px; font-size: 14px; color: ${T.ink}; }
        .dp-risklar { margin-top: 8px; }
        .dp-risklar > * + * { margin-top: 6px; }
        .dp-rs-ix { display: flex; gap: 8px; align-items: baseline; padding: 6px 10px; border-radius: 9px; background: ${T.okFon}; font-size: 13px; color: ${T.ink}; }
        .dp-rs-ix b { flex: none; color: ${T.ok}; } .dp-rs-ix span { min-width: 0; overflow-wrap: anywhere; }
        .dp-rs-ix.yoq { background: ${T.bg}; color: ${T.ink2}; } .dp-rs-ix.yoq b { color: ${T.ink2}; }
        .dp-rs-karta { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 2px solid ${fon(T.accent, 0.55)}; }
        .dp-rs-n { font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .dp-rs-hod { font-size: 15px; line-height: 1.4; color: ${T.ink}; }
        .dp-rs-nom { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; padding: 2px 8px; border-radius: 999px; background: ${T.bg}; }
        .dp-rs-tugma { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; }
        .dp-rs-tugma .q-btn { margin-left: 0; }
        .dp-rs-yordam { margin-left: auto; }
        .dp-rs-yordam .dp-yordam-ust { margin-top: 0; }
        .dp-an { display: flex; flex-direction: column; gap: 10px; }
        .dp-blok .q-blok-t { font-variant-ligatures: none; font-feature-settings: "ss01", "cv11", "calt" 0, "liga" 0, "dlig" 0; }
        .dp-an .dp-ss-i { font-size: 12px; padding: 6px 5px; gap: 4px; }
        .dp-an .dp-ss-i > span { overflow-wrap: anywhere; }
        .dp-an-ss { display: flex; flex-direction: column; gap: 6px; }
        .dp-an-lap { max-width: none; }
        .dp-term { display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; border-radius: 12px; background: ${CODE.bg}; }
        p.dp-term-b, p.dp-term-j { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }
        p.dp-term-b { color: ${CODE.attr}; } p.dp-term-j { color: ${CODE.text}; }
        .dp-term.yashil p.dp-term-j { color: ${CODE.str}; }
        .dp-otish { margin-top: 8px; }
        .dp-otish > * + * { margin-top: 8px; }
        .dp-otish-tm { display: flex; align-items: flex-end; gap: 10px; }
        .dp-otish-tm > .dp-tm { flex: 1; }
        .dp-otish-tm > b { font-size: 18px; color: ${T.ink}; }
        .dp-otish-ro { display: flex; flex-direction: column; gap: 5px; }
        .dp-otish-q { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .dp-otish-q.ok { background: ${T.okFon}; border-color: ${fon(T.ok, 0.3)}; } .dp-otish-q.err { background: ${T.errFon}; border-color: ${fon(T.err, 0.3)}; }
        .dp-otish-t { flex: 1; min-width: 0; display: flex; gap: 6px; align-items: baseline; font-size: 14px; color: ${T.ink}; overflow-wrap: anywhere; }
        .dp-otish-t i { font-style: normal; font-weight: 800; color: ${T.ink2}; }
        .dp-qadam { font: inherit; width: 32px; height: 32px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-weight: 800; cursor: pointer; }
        .dp-qadam.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.4)}; } .dp-qadam.err { color: ${T.err}; border-color: ${fon(T.err, 0.4)}; }
        .dp-qadam.ok.on { background: ${T.ok}; color: #fff; } .dp-qadam.err.on { background: ${T.err}; color: #fff; }
        .dp-vaqt { margin-top: 6px; font-size: 15px; color: ${T.ink}; } .dp-vaqt b { font-size: 22px; }
        .dp-qayta { margin-top: 8px; }
        .dp-tug-q { display: block; margin-top: 6px; font-weight: 700; }
        /* Kartochka (P10 — neytral) va yakun */
        .dp-flash { display: flex; flex-direction: column; gap: 10px; }
        .dp-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: dp-puls 1.8s ease-out .4s 3; }
        .dp-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .dp-flash .fc-front { border: 1.5px solid ${fon(T.accent, 0.45)}; box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        .dp-flash .fc-note { color: rgba(255,255,255,0.75); }
        p.dp-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.ink2}; }
        p.dp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .dp-yakun { display: contents; }
        .dp-yakun.belgisiz .done-chip { display: none; }
        .dp-yakun .q-yakun { display: flex; flex-direction: column; }
        .dp-yakun .q-yakun > .ach-coll { order: 1; }
        p.dp-keyingi { margin: 0; font-size: 14.5px; line-height: 1.5; color: ${T.ink2}; }
        p.dp-keyingi b { color: ${T.ink}; }
        .dp-tviz { display: flex; justify-content: center; padding: 10px 0 2px; }
        .dp-rc-n { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: ${T.accent}; }
        /* Tugagan sahna (q-fokus) — butun enga, 1280×800 ga sig'adi */
        .q-fokus .dp-sahna .dp-qurilma { zoom: .6; }
        .q-fokus .dp-sahna { gap: 6px; }
        .q-fokus .dp-sahna .dp-qurilma.bir { zoom: .44; }
        .q-fokus .dp-sahna .dp-pufak { font-size: 32px; }
        .q-fokus .dp-sahna .dp-tm-chet { display: none; }
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on), .q-fokus:has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 760px) {
          .dp-qurilma { flex-direction: column; align-items: center; }
          .dp-qurilma.bir { align-items: stretch; }
          .dp-lap-w { width: 100%; max-width: none; min-width: 0; }
          .dp-amal.ustun { flex-basis: auto; order: -1; width: 100%; flex-direction: row; flex-wrap: wrap; }
          .dp-amal.ustun > .dp-sb { flex: 1 1 150px; }
          .dp-ss { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
          .dp-ss-i { flex-direction: column; padding: 6px 4px; font-size: 11px; text-align: center; }
          .dp-ss-y { left: 50%; transform: translateX(-50%); font-size: 10.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dp-halqa, .dp-k.faol .q-variant, .dp-chorla .q-chip, .dp-oyin-son.yangi, .dp-aylana, .dp-chiroq.uygonmoqda > i, .dp-soat-ic, .dp-md-q.kirdi, .dp-sirg, .dp-flash.yangi .fc-front { animation: none !important; }
          .dp-tm-tol, .dp-video-iz i, .dp-ss-i, .dp-uchar { transition: none !important; }
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
