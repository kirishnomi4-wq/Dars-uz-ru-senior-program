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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QXato, QXulosa, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm12-09-v1', lessonTitle: { uz: "Video-portfolio: 3 daqiqada o'zingiz va mahsulot", ru: 'Видео-портфолио: вы и продукт за 3 минуты' } }; // 14-Modul 9-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/09-VideoPortfolio-v3.md
// 12 ekran · loyiha kuni (tayanch 4): kirish → reja → tushuncha → Amaliyot 1 → 1-savol → tushuncha → Amaliyot 2 → 2-savol → Amaliyot 3 → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'video', ru: 'видео' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'ssenariy', ru: 'сценарий' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'ekran yozuvi', ru: 'запись экрана' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: '3 daqiqa', ru: '3 минуты' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
// Ekran maqsadlari (quruvchi; ekranga chiqmaydi)
const SCREEN_INTENTS = [
  'hook: videoda yuz va ism ixtiyoriy (ballsiz)', 'reja: uch ish — ssenariy, yozish, tekshirish', "tushuncha: 3 daqiqaga uch bo'lak sig'adi; video-portfolio atamasi",
  "Amaliyot 1: o'z ssenariysi (pm-m12d9-video.bolaklar)", '1-savol: «Qanday ishlayman» — qaror va sabab', 'tushuncha: yozishdan oldin yopiladigan 4 joy',
  'Amaliyot 2: tayyorlash, yozish, fayl repo dan tashqarida (bor, ovozBor)', '2-savol: .env ochiq — avval yopiladi', "Amaliyot 3: o'zi tekshiradi, vaqt, kim ko'radi (maxfiyNarsaYoq, vaqt, sigdi)",
  'podium', 'kartochkalar', 'yakun: besh holat'
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
const INLINE_KEYS = { s4: 2, s7: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); kodsiz kartada raqam 1/2/3 (S-026)
const RECAPS = {
  4: {
    title: { uz: '«Qanday ishlayman» bo\'lagi', ru: 'Часть «Как я работаю»' },
    cards: [
      { ic: 1, h: { uz: "Uch bo'lak", ru: 'Три части' }, body: { uz: <>Video uch bo'lakdan iborat: kimman, nima qurdim, qanday ishlayman.</>, ru: <>Видео состоит из трёх частей: кто я, что я построил, как я работаю.</> } },
      { ic: 2, h: { uz: 'Qaror va sabab', ru: 'Решение и причина' }, body: { uz: <>«Qanday ishlayman» — bitta qaror va uning sababi.</>, ru: <>«Как я работаю» — одно решение и его причина.</> } },
      { ic: 3, h: { uz: 'Nima kirmaydi', ru: 'Что не входит' }, body: { uz: <>Funksiyalar ro'yxati va va'da bu bo'lakka kirmaydi.</>, ru: <>Список функций и обещания в эту часть не входят.</> }, ask: { uz: 'Mahsulotingizda qaysi qarorni sababi bilan ayta olasiz?', ru: 'Какое решение в своём продукте вы можете назвать с причиной?' } }
    ]
  },
  7: {
    title: { uz: 'Yozishdan oldin', ru: 'Перед записью' },
    cards: [
      { ic: 1, h: { uz: 'Faylda qoladi', ru: 'Остаётся в файле' }, body: { uz: <>Ekranda nima tursa, video faylida shu qoladi.</>, ru: <>Что на экране, то и остаётся в видеофайле.</> } },
      { ic: 2, h: { uz: 'Nima yopiladi', ru: 'Что закрывают' }, body: { uz: <><code className="qcode">.env</code>, login, boshqa odamlar ma'lumoti va chat oynalari yopiladi.</>, ru: <><code className="qcode">.env</code>, логин, данные других людей и окна чата закрывают.</> } },
      { ic: 3, h: { uz: 'Keyin yozish', ru: 'Потом запись' }, body: { uz: <>Shundan keyingina yozish boshlanadi.</>, ru: <>Только после этого начинается запись.</> }, ask: { uz: 'Hozir ekraningizda qaysi oynani yopish kerak?', ru: 'Какое окно на вашем экране сейчас нужно закрыть?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="vp-tv fade-step">{vizual}</div>}
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

// qolip-maket: vp-tg vp-joy vp-ix vp-cl-q vp-tm-b vp-nusxa vp-tanlov
// ===== DARSNING BITTA VIZUALI — «Video sahnasi» (VideoSahna: laptop · yozuv belgisi · kamera joyi · ovoz · vaqt chizig'i · fayl kartasi; 163/180) =====
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const NB = String.fromCharCode(160);
const MAYDON_RANG = '#2E9E4F'; // «Maydon Jamoa» nomi — 11-Modul 9.62 yashili (logotip yo'q)
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function useKetma() {
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const kam = kamHarakat();
    let t = 0;
    qadamlar.forEach(([ms, fn]) => { t += kam ? 0 : ms; tm.current.push(setTimeout(fn, t)); });
  }, []);
}
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsYoz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq */ } };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
const halqa = (on) => (on ? 'vp-halqa' : undefined);
const vaqtYoz = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.round(s)) % 60).padStart(2, '0')}`;
// m:ss → soniya (o'quvchi «2:45» yoki «165» yozadi); noto'g'ri — null
const vaqtOqi = (s) => {
  const t = String(s || '').trim().replace(/[.,]/g, ':');
  let m = t.match(/^(\d{1,2}):(\d{1,2})$/);
  if (m) { const ss = +m[2]; return ss < 60 ? (+m[1]) * 60 + ss : null; }
  m = t.match(/^(\d{1,3})$/);
  return m ? +m[1] : null;
};

// --- Saqlash kaliti (tayanch 8 aynan): pm-m12d9-video = { bolaklar: { kimman, nimaQurdim, qandayIshlayman }, bor, tekshiruv: { ovozBor, maxfiyNarsaYoq, vaqt, sigdi }, savedAt }
// Havola, ota-ona javobi, yuz, fayl nomi, ism — kalitga YOZILMAYDI (TAQIQLAR 1, 9.72).
const VIDEO_KALIT = 'pm-m12d9-video';
const BOSH_TEK = { ovozBor: null, maxfiyNarsaYoq: null, vaqt: null, sigdi: null };
const BOSH_BOL = { kimman: null, nimaQurdim: null, qandayIshlayman: null };
const videoOqi = () => {
  const o = lsOqi(VIDEO_KALIT); const v = o && typeof o === 'object' ? o : {};
  const b = v.bolaklar && typeof v.bolaklar === 'object' ? v.bolaklar : {};
  const t = v.tekshiruv && typeof v.tekshiruv === 'object' ? v.tekshiruv : {};
  return {
    bolaklar: { kimman: b.kimman ?? null, nimaQurdim: b.nimaQurdim ?? null, qandayIshlayman: b.qandayIshlayman ?? null },
    bor: typeof v.bor === 'boolean' ? v.bor : null,
    tekshiruv: { ovozBor: typeof t.ovozBor === 'boolean' ? t.ovozBor : null, maxfiyNarsaYoq: typeof t.maxfiyNarsaYoq === 'boolean' ? t.maxfiyNarsaYoq : null, vaqt: Number.isFinite(t.vaqt) ? t.vaqt : null, sigdi: typeof t.sigdi === 'boolean' ? t.sigdi : null },
    savedAt: v.savedAt ?? null
  };
};
const videoYoz = (fn) => { const v = videoOqi(); const y = fn(v); lsYoz(VIDEO_KALIT, { bolaklar: { ...BOSH_BOL, ...(y.bolaklar || {}) }, bor: typeof y.bor === 'boolean' ? y.bor : null, tekshiruv: { ...BOSH_TEK, ...(y.tekshiruv || {}) }, savedAt: Date.now() }); };
const bolakBor = (b) => !!b && ['kimman', 'nimaQurdim', 'qandayIshlayman'].some(k => String(b[k] || '').trim());
// O'qiladigan kalitlar (bo'lmasa — maydon bo'sh, namuna «Yordam»da)
const hikoyaOqi = () => { const h = lsOqi('pm-m12d2-hikoya'); return h && typeof h === 'object' ? h : null; };
const demoQator = () => { const d = lsOqi('pm-m12d6-demo'); const s = d && Array.isArray(d.ssenariy) ? d.ssenariy.map(x => String(x || '').trim()).filter(Boolean).slice(0, 3) : []; return s.length ? s.join('; ') : ''; };
const trekOqi = () => { const p = lsOqi('pm-m9d8-platforma'); return p && (p.trek === 'mobil' || p.trek === 'web') ? p.trek : null; };

// --- Bitta manbalar (A-4 aynan; 180) ---
const VIDEO_BOLAKLAR = [
  { id: 'kimman', nom: { uz: 'Kimman', ru: 'Кто я' }, nisbat: 'qisqa', mentorReja: 20, ph: { uz: "Kim ekaningiz va nima qilishingiz — bir gap", ru: 'Кто вы и чем занимаетесь — одно предложение' } },
  { id: 'nimaQurdim', nom: { uz: 'Nima qurdim', ru: 'Что я построил' }, nisbat: 'katta', mentorReja: 110, ph: { uz: "Qaysi lahza o'zgardi va demoda nimani bosasiz?", ru: 'Какой момент изменился и что вы нажимаете в демо?' } },
  { id: 'qandayIshlayman', nom: { uz: 'Qanday ishlayman', ru: 'Как я работаю' }, nisbat: 'qisqa', mentorReja: 50, ph: { uz: 'Qaysi qarorni qildingiz va nega?', ru: 'Какое решение вы приняли и почему?' } }
];
const MENTOR_SSENARIY = {
  kimman: { gap: { uz: "Men g'oyadan boshlab ishlaydigan ilovagacha mahsulot quraman, kodni agent bilan yozaman.", ru: 'Я создаю продукт от идеи до работающего приложения, код пишу с агентом.' }, ekran: { uz: 'ekranda — lending', ru: 'на экране — лендинг' } },
  nimaQurdim: { gap: { uz: "Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi. Shuning uchun «Maydon Jamoa»ni qurdim.", ru: 'Суббота, 18:00. На поле 8 человек, ещё 2 не пришли — игра не состоялась. Поэтому я сделал «Maydon Jamoa».' }, demo: [{ uz: "O'yinlar", ru: 'Игры' }, { uz: 'Shanba, 18:00 · Mahalla maydoni · 8 / 10', ru: 'Суббота, 18:00 · Махаллинское поле · 8 / 10' }, { uz: "Qo'shilaman", ru: 'Присоединяюсь' }, { uz: '9 / 10', ru: '9 / 10' }], keyin: { uz: "Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.", ru: 'Теперь организатор в пятницу видит: 9 / 10, одно место свободно.' }, ekran: { uz: "ekranda — ilovaning brauzer ko'rinishi", ru: 'на экране — браузерная версия приложения' } },
  qandayIshlayman: { gap: { uz: "Avval odam yig'ish muammosini hal qildim; maydon pulini bo'lishishni keyinga qoldirdim, chunki asosiy muammo shu edi.", ru: 'Сначала я решил проблему сбора людей; разделение оплаты поля отложил, потому что главная проблема была в этом.' }, ekran: { uz: "ekranda — «O'yinlar»", ru: 'на экране — «Игры»' } }
};
// 2-ekran: oltita karta (vaqt soni yo'q — 09-FILTR 5); togri — «Videoga»; bolak — vaqt chizig'idagi joy
const KARTALAR_UCH = [
  { matn: { uz: 'Men kimman — bir gap', ru: 'Кто я — одно предложение' }, togri: true, bolak: 0, xato: { uz: 'Sizni tanimagan odam kim gapirayotganini biladimi?', ru: 'Узнает ли незнакомый человек, кто говорит?' } },
  { matn: { uz: "Ilovadagi hamma funksiyalar ro'yxati", ru: 'Список всех функций приложения' }, togri: false, yorliq: { uz: "ro'yxat", ru: 'список' }, tushdi: { uz: "ro'yxat — odam va lahza yo'q", ru: 'список — нет человека и момента' }, xato: { uz: "Bu funksiyalar ro'yxati — odam va bitta lahza yo'q.", ru: 'Это список функций — нет человека и одного момента.' } },
  { matn: { uz: 'Maktabim, sinfim va telefon raqamim', ru: 'Моя школа, класс и номер телефона' }, togri: false, yorliq: { uz: "shaxsiy ma'lumot", ru: 'личные данные' }, qulf: true, xato: { uz: "Bu shaxsiy ma'lumot. Videoni ko'rgan odamga kerakmi?", ru: 'Это личные данные. Нужны ли они тому, кто смотрит видео?' } },
  { matn: { uz: 'Bitta lahza va ishlayotgan demo', ru: 'Один момент и работающее демо' }, togri: true, bolak: 1, xato: { uz: "Demosiz nima qurganingiz qanday ko'rinadi?", ru: 'Как без демо будет видно, что вы построили?' } },
  { matn: { uz: "Keyingi oyda qo'shiladigan funksiyalar", ru: 'Функции, которые добавятся в следующем месяце' }, togri: false, yorliq: { uz: "hali yo'q", ru: 'ещё нет' }, uzuq: true, xato: { uz: "Video faqat bor narsani ko'rsatadi. Bu funksiya bormi?", ru: 'Видео показывает только то, что есть. Эта функция есть?' } },
  { matn: { uz: 'Bitta qarorim va uning sababi', ru: 'Одно моё решение и его причина' }, togri: true, bolak: 2, xato: { uz: "Qanday ishlashingizni videoda nima ko'rsatadi?", ru: 'Что в видео покажет, как вы работаете?' } }
];
// 5-ekran kadrlari, A2 1-qadam va A3 2-qadam — bitta manba (P-063)
const MAXFIY_ROYXAT = [
  { id: 'kod', yopish: { uz: 'Kod oynasi va `.env` yopiq', ru: 'Окно кода и `.env` закрыты' }, yorliq: { uz: 'maxfiy kalit · `.env`', ru: 'секретный ключ · `.env`' }, tekshir: { uz: 'Maxfiy kalit va `.env`', ru: 'Секретный ключ и `.env`' } },
  { id: 'kirish', yopish: { uz: 'Namuna akkaunt bilan oldindan kirilgan', ru: 'Вход заранее выполнен с демо-аккаунтом' }, yorliq: { uz: 'login va parol', ru: 'логин и пароль' }, tekshir: { uz: 'Shaxsiy login va parol maydoni', ru: 'Поле личного логина и пароля' } },
  { id: 'neon', yopish: { uz: 'Neon va boshqa jadvallar yopiq', ru: 'Neon и другие таблицы закрыты' }, yorliq: { uz: "boshqa odamlarning ma'lumoti", ru: 'данные других людей' }, tekshir: { uz: "Boshqa odamlarning ismi va ma'lumoti", ru: 'Имена и данные других людей' } },
  { id: 'chat', yopish: { uz: 'Chat va pochta oynalari yopiq', ru: 'Окна чата и почты закрыты' }, yorliq: { uz: 'yozishma', ru: 'переписка' }, tekshir: { uz: 'Chat va boshqa yozishmalar', ru: 'Чат и другая переписка' } }
];
const MAXFIY_KADRLAR = MAXFIY_ROYXAT.map(r => r.id);
// A3 2-qadam: to'rt qator + ovoz qatori + umumiy qator (09-FILTR 12)
const TEKSHIR_QATOR = [
  ...MAXFIY_ROYXAT.map(r => ({ id: r.id, t: r.tekshir, ovoz: false })),
  { id: 'ovoz', t: { uz: 'Maktab, telefon, manzil (ovozda ham)', ru: 'Школа, телефон, адрес (и в голосе)' }, ovoz: true, izoh: { uz: "ismingizni aytgan bo'lsangiz — bu ixtiyoriy edi, xato emas", ru: 'если вы назвали имя — это было по желанию, не ошибка' } },
  { id: 'boshqa', t: { uz: 'Yana sizga yoki boshqa odamga tegishli shaxsiy narsa', ru: 'Ещё что-то личное — ваше или другого человека' }, ovoz: false, izoh: { uz: 'xabarnoma, fayl nomi, profil rasmi', ru: 'уведомление, имя файла, фото профиля' } }
];

// --- Sahna qismlari ---
const OvozIc = () => <svg className="vp-mik" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M3 8a5 5 0 0 0 10 0M8 13v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
const QulfIc = () => <svg className="vp-qulf" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;
// Yozuv belgisi — CSS doira (err) + vaqt
const YozuvBelgi = ({ vaqt = 0, yonadi }) => <span className={cx('vp-rec', yonadi && 'on')}><i aria-hidden="true" />{vaqtYoz(vaqt)}</span>;
// Ovoz chizig'i — tekis yoki to'lqin
const OvozChiziq = ({ tolqin }) => (
  <span className={cx('vp-ovoz', tolqin && 'on')}>
    <OvozIc />
    <span className="vp-ovoz-b" aria-hidden="true">{[...Array(18).keys()].map(i => <i key={i} style={{ animationDelay: `${(i % 6) * 0.11}s` }} />)}</span>
    {tolqin && <em className="fade-step">{tr({ uz: 'ovoz', ru: 'голос' })}</em>}
  </span>
);
// Brauzer ichi — «Maydon Jamoa» (soddalashtirilgan maket; logotip yo'q)
const MaydonEkran = ({ tur = 'lending', son = 8, bosildi }) => (
  <div className={cx('vp-mj', 'vp-mj-' + tur)}>
    <div className="vp-mj-bosh"><b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b>{tur !== 'lending' && <span>{tr({ uz: "O'yinlar", ru: 'Игры' })}</span>}</div>
    {tur === 'lending'
      ? <div className="vp-mj-hero"><p className="vp-mj-h">{tr({ uz: "Mahalla futboliga jamoani bir joyda yig'ing", ru: 'Соберите команду на махаллинский футбол в одном месте' })}</p><span className="vp-mj-cta" style={{ background: MAYDON_RANG }}>{tr({ uz: "O'yinlar", ru: 'Игры' })}</span></div>
      : <div className="vp-mj-oyin">
        <p className="vp-mj-e">{tr({ uz: 'Shanba, 18:00 · Mahalla maydoni', ru: 'Суббота, 18:00 · Махаллинское поле' })}</p>
        <p className="vp-mj-son"><b key={son} className={cx(son === 9 && 'yangi')}>{son}{NB}/{NB}10</b></p>
        <span className={cx('vp-mj-btn', bosildi && 'on')} style={bosildi ? undefined : { background: MAYDON_RANG }}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
      </div>}
  </div>
);
// Laptop: brauzer oynasi (manzil satri) yoki boshqa oyna; tepada yozuv belgisi; burchakda kamera joyi; pastda ovoz chizig'i
const Laptop = ({ yorliq, ust, children, vaqt = 0, yonadi, kamera, tolqin, brauzer = true, sinf }) => (
  <div className={cx('vp-lap', sinf)}>
    {(yorliq || ust) && <span className="vp-lap-y">{yorliq}{ust && <b>{ust}</b>}</span>}
    <div className="vp-lap-ek">
      <YozuvBelgi vaqt={vaqt} yonadi={yonadi} />
      {brauzer
        ? <div className="vp-br"><span className="vp-br-url"><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><em>maydon-jamoa-….netlify.app</em></span><div className="vp-br-b">{children}</div></div>
        : <div className="vp-br vp-br-oyna">{children}</div>}
      {kamera && <span className={cx('vp-kam', kamera)}>{kamera === 'savol' ? <b>?</b> : null}{kamera === 'ixtiyoriy' && <em className="fade-step">{tr({ uz: 'yuz — ixtiyoriy', ru: 'лицо — по желанию' })}</em>}</span>}
    </div>
    <span className="vp-lap-asos" aria-hidden="true" />
    {tolqin !== undefined && <OvozChiziq tolqin={tolqin} />}
  </div>
);
// Vaqt chizig'i 0:00–3:00: uch bo'lak joyi (nisbat — qisqa · katta · qisqa; son emas). sek berilsa — o'quvchi vaqti (3:00 dan oshgani err)
const NISBAT = [24, 50, 26];
const Chiziq = ({ holat = [], nom = [], matn = [], sek, xatoJoy = -1, tushdi, slotRef, yorliq, ost }) => {
  const jami = sek ? sek.reduce((a, b) => a + (b || 0), 0) : 0;
  const shkala = Math.max(180, jami);
  const en = (i) => (sek ? ((sek[i] || 0) / shkala) * 100 : NISBAT[i]);
  return (
    <div className="vp-ch">
      {yorliq && <span className="vp-ch-y">{yorliq}</span>}
      <div className="vp-ch-iz">
        {VIDEO_BOLAKLAR.map((b, i) => (sek && !sek[i]) ? null : (
          <span key={b.id} ref={slotRef ? (el => { slotRef.current[i] = el; }) : undefined} className={cx('vp-ch-b', holat[i] || 'bosh', xatoJoy === i && 'xato')} style={{ width: en(i) + '%' }}>
            {nom[i] && <b className="fade-step">{nom[i]}</b>}
            {matn[i] && <span>{matn[i]}</span>}
            {sek && sek[i] ? <em>{vaqtYoz(sek[i])}</em> : null}
          </span>
        ))}
        {sek && jami > 180 && <span className="vp-ch-osh" style={{ left: (180 / shkala) * 100 + '%' }} />}
        {tushdi}
      </div>
      <div className="vp-ch-t"><span>0:00</span>{sek && jami > 180 ? <span style={{ left: (180 / shkala) * 100 + '%' }}>3:00</span> : <span className="o">3:00</span>}</div>
      {ost}
    </div>
  );
};
// Fayl kartasi: «video · fayl» — kompyuterda (repo papkasidan tashqarida) | faqat havola bilan
const FaylKarta = ({ holat = 'kompyuter', yangi }) => (
  <div className={cx('vp-fayl', yangi && 'fade-step')}>
    <span className="vp-fayl-ic" aria-hidden="true"><i /></span>
    <span className="vp-fayl-t"><b>{tr({ uz: 'video · fayl', ru: 'видео · файл' })}</b>
      {holat === 'havola'
        ? <span className="vp-fayl-s h"><QulfIc />{tr({ uz: 'faqat havola bilan', ru: 'только по ссылке' })}</span>
        : <span className="vp-fayl-s">{tr({ uz: 'kompyuterda · repo papkasidan tashqarida', ru: 'на компьютере · вне папки репозитория' })}</span>}
    </span>
  </div>
);
// Yozuv vaqti yuradi (sek/qadam); reduced-motion — birdan oxirgi qiymat
function useYuradi(on, oxiri, qadamMs = 1000, qadam = 1) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return undefined;
    if (kamHarakat()) { setV(oxiri); return undefined; }
    const t = setInterval(() => setV(x => { const n = Math.min(oxiri, x + qadam); if (n >= oxiri) clearInterval(t); return n; }), qadamMs);
    return () => clearInterval(t);
  }, [on, oxiri, qadamMs, qadam]);
  return v;
}
// Bashorat: tanlangach yopilmaydi — ixcham qator natijagacha turadi (SABOQ 11); har variantning o'z chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="vp-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="vp-bash-ix fade-step"><span>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="vp-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="vp-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="vp-x-m">{matn}</span>{izoh && <span className="vp-x-iz">{izoh}</span>}</>;
// O'qituvchi eslatmasi — faqat Mentor rejimida
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="vp-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);
// Ipucha — 40 s harakatsizlikdan keyin (javobni aytmaydi; P-033)
function useIpucha(dep, faol) {
  const [kor, setKor] = useState(false);
  useEffect(() => { setKor(false); if (!faol) return undefined; const t = setTimeout(() => setKor(true), 40000); return () => clearTimeout(t); }, [dep, faol]);
  return kor;
}
const Ipucha = ({ matn }) => <p className="vp-ipucha fade-step"><i aria-hidden="true" />{tr(matn)}</p>;

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz — J-026: hammaga correct: false; sahna har uch tanlovda bir xil o'zgaradi — P-036) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Ha — mahsulotni tushuntirishga yuzim kerak', ru: 'Да — чтобы объяснить продукт, нужно моё лицо' } },
  { id: 'b', label: { uz: "Yo'q — ekran yozuvi va ovozim yetadi", ru: 'Нет — хватит записи экрана и моего голоса' } },
  { id: 'c', label: { uz: 'Ha — yuz bilan birga ism ham kerak', ru: 'Да — вместе с лицом нужно и имя' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Bu kursda yuz va ism — ixtiyoriy: mahsulotingizni ekran yozuvi va ovozingiz ko'rsatadi.</>, ru: <><b>Именно!</b> В этом курсе лицо и имя — по желанию: продукт покажут запись экрана и ваш голос.</> },
  a: { uz: <><b>Qiziq fikr!</b> Yuz bilan ham yozsa bo'ladi. Bu kursda esa yuz — ixtiyoriy: buni ota-onangiz bilan hal qilasiz.</>, ru: <><b>Интересная мысль!</b> Можно записать и с лицом. Но в этом курсе лицо — по желанию: это вы решаете с родителями.</> },
  c: { uz: <><b>Qiziq fikr!</b> Ko'p videoda ism ham, yuz ham bor. Bu kursda ikkalasi ixtiyoriy: ekran va ovoz yetadi.</>, ru: <><b>Интересная мысль!</b> Во многих видео есть и имя, и лицо. В этом курсе оба по желанию: хватит экрана и голоса.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const vaqt = useYuradi(picked !== null, 4);
  const pick = (v) => { if (picked !== null) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const t = picked !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={!t} label={t ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' })} onClick={onNext} />}>
      <div className={cx('vp-hook', !t && 'vp-k-faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>O'zingiz haqidagi videoda <span className="italic" style={{ color: T.accent }}>yuzingiz ko'rinishi shartmi?</span></>, ru: <>Обязательно ли <span className="italic" style={{ color: T.accent }}>показывать лицо</span> в видео о себе?</> })}
          mentor={<Mentor>{t
            ? tr({ uz: "Bugun shunday videoni o'z mahsulotingiz haqida yozasiz — «Davom etish»ni bosing.", ru: 'Сегодня вы запишете такое видео о своём продукте — нажмите «Продолжить».' })
            : tr({ uz: "2-darsdagi video telefoningizda qoldi — bugungisini esa sizni tanimaydigan odam ham ko'rishi mumkin.", ru: 'Видео со 2-го урока осталось в телефоне — а сегодняшнее может увидеть и незнакомый вам человек.' })}</Mentor>}
          maket={<Laptop yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример наставника' })} · <b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b></>} vaqt={vaqt} yonadi={t && vaqt < 4} kamera={t ? 'ixtiyoriy' : 'savol'} tolqin={t}><MaydonEkran tur="lending" /></Laptop>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={t && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
        <Ustoz satrlar={[{ uz: "Sinfdan so'rang: «2-darsdagi videoni ko'rganingizda birinchi nimani sezdingiz?» Javobni sanamang. 2-darsdagi video telefonda qoldi; bugungisi qolmasligi mumkin — shuning uchun yuz, ism va kim ko'rishi dars boshidayoq aytiladi.", ru: 'Спросите класс: «Что вы заметили первым, когда смотрели видео со 2-го урока?» Ответы не считайте. Видео 2-го урока осталось в телефоне; сегодняшнее может не остаться — поэтому про лицо, имя и кто увидит говорится в начале урока.' }]} />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chap — tayyor holat, bir marta o'zi yuradi; o'ng — uch ish, teg yo'q — 172) =====
const REJA = [
  { uz: 'Video ssenariysini yozasiz', ru: 'Напишете сценарий видео' },
  { uz: 'Ekran yozuvi bilan videoni yozasiz', ru: 'Запишете видео записью экрана' },
  { uz: "Videoni tekshirib, kim ko'rishini hal qilasiz", ru: 'Проверите видео и решите, кто его увидит' }
];
const RejaSahna = () => {
  const [n, setN] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[500, () => setN(1)], [900, () => setN(2)], [900, () => setN(3)], [1300, () => setN(4)]]); }, []); // eslint-disable-line
  const vaqt = useYuradi(n >= 1, 180, 60, 3);
  return (
    <div className="vp-reja">
      <Laptop vaqt={vaqt} yonadi={n >= 1 && n < 4} tolqin={n >= 1 && n < 4}><MaydonEkran tur={n >= 2 ? 'oyin' : 'lending'} son={n >= 3 ? 9 : 8} bosildi={n >= 3} /></Laptop>
      <Chiziq holat={[0, 1, 2].map(i => (n > i ? 'oq' : 'bosh'))} />
      {n >= 4 && <FaylKarta yangi />}
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun o'zingiz va mahsulotingiz haqida <span className="italic" style={{ color: T.accent }}>video yozasiz</span>.</>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>запишете видео</span> о себе и своём продукте.</> })}
      mentor={<Mentor>{tr({ uz: "Avval nima aytishingizni yozasiz, keyin ekran yozuvi bilan aytasiz; Mentor misoli «Yordam»da turadi.", ru: 'Сначала напишете, что скажете, потом скажете это с записью экрана; пример наставника — в «Подсказке».' })}</Mentor>}
      chapYorliq={tr({ uz: 'ssenariy, ekran yozuvi va havola', ru: 'сценарий, запись экрана и ссылка' })}
      chap={<RejaSahna />}
      qadamlar={REJA.map(r => ({ t: tr(r) }))}
    >
      <p className="vp-reja-p mono">{tr({ uz: "Bugun kod o'zgarmaydi: video repo'ga qo'shilmaydi · Mentor misoli", ru: 'Сегодня код не меняется: видео не добавляется в репозиторий · пример наставника' })} <code className="qcode">maydon-jamoa</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code className="qcode">m14-dars-09-done</code></p>
      <p className="vp-reja-p">{tr({ uz: "«Maydon Jamoa» — namuna; videoni o'z mahsulotingiz haqida yozasiz.", ru: '«Maydon Jamoa» — образец; видео вы пишете о своём продукте.' })}</p>
      <Ustoz satrlar={[
        { uz: "Video — o'quvchining shaxsiy ma'lumoti: yuz, ism, ovoz. Yuz va ism — ixtiyoriy; video hamma ko'radigan joyga joylanmaydi; havola — faqat ota-ona roziligi bilan va faqat «faqat havola bilan ko'rinadigan joy»ga; havola hech qayerga yozilmaydi.", ru: 'Видео — личные данные ученика: лицо, имя, голос. Лицо и имя — по желанию; видео не выкладывается туда, где его видят все; ссылка — только с согласия родителей и только в «место, видимое только по ссылке»; ссылка никуда не записывается.' },
        { uz: "Ota-ona roziligi qanday olinishi — maktab tartibida; darsda o'quvchi o'zi belgilaydi, Mentor uning yoki ota-onasi nomidan tasdiqlamaydi. Rozilik bo'lmasa ham dars to'liq o'tadi: video kompyuterda fayl bo'lib qoladi.", ru: 'Как получить согласие родителей — по порядку школы; на уроке ученик отмечает сам, наставник не подтверждает за него или родителей. Даже без согласия урок проходит полностью: видео остаётся файлом на компьютере.' },
        { uz: "Ovoz: 12–15 o'quvchi bir xonada bir vaqtda gapirsa, ovozlar bir-biriga tushadi — imkon bo'lsa Amaliyot 2 ni navbat bilan (3–4 kishidan) qiling, qolganlar shu payt Amaliyot 1 dagi ovoz chiqarib o'qishni tugatadi yoki navbatini kutib, ekranini tayyorlaydi.", ru: 'Голос: если 12–15 учеников говорят одновременно в одной комнате, голоса накладываются — по возможности делайте Практику 2 по очереди (по 3–4 человека), остальные заканчивают чтение вслух из Практики 1 или готовят экран.' },
        { uz: "Ekran yozish vositasining nomi va tugmalari bu darsda yozilmagan; ishlamasa — telefonning ekran yozuvi (11-Modul zaxirasi). O'quvchi videolarini proyektorga chiqarmang; kim yuzi bilan yozgani sanalmaydi. Uyga vazifa yo'q. Darsdan oldin: har o'quvchida 6-darsdagi namuna akkaunt bor-yo'qligini tekshiring — bu darsda agent bilan ochilmaydi.", ru: 'Название и кнопки средства записи экрана в уроке не указаны; если не работает — запись экрана телефона (запасной путь из 11-го модуля). Не выводите видео учеников на проектор; кто записался с лицом — не считается. Домашнего задания нет. До урока проверьте у каждого демо-аккаунт из 6-го урока — на этом уроке он не создаётся через агента.' }
      ]} />
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (bashorat → 6 karta bittadan → to'g'ri karta vaqt chizig'iga uchib tushadi → 6/6 — bo'lak nomlari; holat bosishlardan — P-046) =====
const S2_TAXMIN = [{ k: '2', t: { uz: 'Ikkitasi', ru: 'Две' } }, { k: '3', t: { uz: 'Uchtasi', ru: 'Три' } }, { k: '4', t: { uz: "To'rttasi", ru: 'Четыре' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const achMiss = useContext(AchMissCtx);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [i, setI] = useState(avval ? 6 : 0);
  const [joy, setJoy] = useState(avval ? [true, true, true] : [false, false, false]);
  const [chetga, setChetga] = useState(avval ? [1, 2, 4] : []);
  const [nomlar, setNomlar] = useState(avval ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [xSeg, setXSeg] = useState(null);
  const [xJoy, setXJoy] = useState(-1);
  const [silk, setSilk] = useState(null);
  const [ket, setKet] = useState(false);
  const [uch, setUch] = useState(null);
  const [band, setBand] = useState(false);
  const xatoRef = useRef(false);
  const wrapRef = useRef(null); const kartaRef = useRef(null); const slotRef = useRef([]);
  const ketma = useKetma();
  const done = nomlar >= 3;
  const tugadi = useTugadi(done, 900, avval);
  const ipucha = useIpucha(i, !!taxmin && i < 6 && !band);
  useEffect(() => {
    if (done && !avval) onAnswer(screen, { stage: 'concept', screenIdx: screen, correct: !xatoRef.current, picked: true, taxmin });
  }, [done]); // eslint-disable-line
  const keyingi = () => {
    const n = i + 1; setI(n); setBand(false); setKet(false);
    if (n >= 6) ketma([[400, () => setNomlar(1)], [700, () => setNomlar(2)], [700, () => setNomlar(3)]]);
  };
  const uchir = (bolak) => {
    const w = wrapRef.current, k = kartaRef.current, s = slotRef.current[bolak];
    const joyla = () => { setJoy(j => j.map((x, q) => (q === bolak ? true : x))); keyingi(); };
    if (!w || !k || !s || kamHarakat()) { joyla(); return; }
    const wr = w.getBoundingClientRect(); const z = (wr.width / (w.offsetWidth || wr.width)) || 1;
    const kr = k.getBoundingClientRect(), sr = s.getBoundingClientRect();
    const r = (b) => ({ l: (b.left - wr.left) / z, t: (b.top - wr.top) / z, w: b.width / z, h: b.height / z });
    setUch({ matn: KARTALAR_UCH[i].matn, from: r(kr), to: r(sr), bor: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setUch(u => (u ? { ...u, bor: true } : u))));
    ketma([[650, () => { setUch(null); joyla(); }]]);
  };
  const javob = (videoga) => {
    if (!taxmin || band || i >= 6) return;
    const k = KARTALAR_UCH[i];
    if (videoga === k.togri) {
      setXato(null); setBand(true);
      if (k.togri) uchir(k.bolak);
      else { setKet(true); ketma([[420, () => { setChetga(c => [...c, i]); keyingi(); }]]); }
      return;
    }
    xatoRef.current = true; if (achMiss) achMiss.miss(screen);
    setXato(k.xato); setSilk(videoga ? 'v' : 'e');
    if (videoga) { setXSeg(i); ketma([[1300, () => setXSeg(null)]]); }
    else { setXJoy(k.bolak); ketma([[1200, () => setXJoy(-1)]]); }
    ketma([[500, () => setSilk(null)]]);
  };
  const k = KARTALAR_UCH[Math.min(i, 5)];
  const holat = [0, 1, 2].map(q => (done ? 'ok' : joy[q] ? 'joriy' : 'bosh'));
  const nom = VIDEO_BOLAKLAR.map((b, q) => (q < nomlar ? tr(b.nom) : null));
  const matn = [0, 1, 2].map(q => (joy[q] ? tr(KARTALAR_UCH.find(x => x.bolak === q).matn) : null));
  const tushdi = xSeg !== null && (() => { const x = KARTALAR_UCH[xSeg]; return <span key={xSeg} className={cx('vp-ch-tush', x.uzuq && 'uzuq', x.qulf && 'qulf')}>{x.qulf ? <QulfIc /> : null}{x.tushdi ? tr(x.tushdi) : x.uzuq ? tr(x.yorliq) : null}</span>; })();
  const chiziq = <Chiziq holat={holat} nom={nom} matn={matn} xatoJoy={xJoy} tushdi={tushdi} slotRef={slotRef} />;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · uch bo'lak", ru: 'Понятие · три части' })} screen={screen} scrollSignal={i + nomlar} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Kartalarni ajrating (${Math.min(i, 6)}/6)`, ru: `Разберите карточки (${Math.min(i, 6)}/6)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>3 daqiqalik videoga <span className="italic" style={{ color: T.accent }}>nima sig'adi?</span></>, ru: <>Что <span className="italic" style={{ color: T.accent }}>поместится</span> в 3-минутное видео?</> })}
        mentor={<Mentor>{done ? tr({ uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' }) : tr({ uz: "Har kartani o'qing va «Videoga» yoki «Videoga emas»ni bosing.", ru: 'Прочитайте каждую карточку и нажмите «В видео» или «Не в видео».' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={{ uz: 'Oltita kartadan nechtasi videoga kiradi?', ru: 'Сколько из шести карточек войдёт в видео?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={tugadi ? <div className="vp-s2 tug">{chiziq}</div> : <div className="vp-s2" ref={wrapRef}>
          <div className={cx('vp-k-zona', !taxmin && 'yopiq')}>
            {i < 6 && <div className={cx('vp-k-karta', ket && 'ket', uch && 'yashir')} key={i} ref={kartaRef}>
              <span className="vp-k-n">{tr({ uz: 'Karta', ru: 'Карточка' })} {i + 1}{NB}/{NB}6</span>
              <p>{tr(k.matn)}</p>
            </div>}
            {i < 6 && <div className={cx('vp-k-btn', taxmin && !band && 'vp-chorla-b')}>
              <button type="button" className={cx('vp-tg', silk === 'v' && 'silk')} disabled={!taxmin || band} onClick={() => javob(true)}>{tr({ uz: 'Videoga', ru: 'В видео' })}</button>
              <button type="button" className={cx('vp-tg', silk === 'e' && 'silk')} disabled={!taxmin || band} onClick={() => javob(false)}>{tr({ uz: 'Videoga emas', ru: 'Не в видео' })}</button>
            </div>}
            {chetga.length > 0 && <div className="vp-chetga">{chetga.map(c => <span key={c} className="vp-chetga-k fade-step"><s>{tr(KARTALAR_UCH[c].matn)}</s><em>{tr(KARTALAR_UCH[c].yorliq)}</em></span>)}</div>}
            {xato && <QXato key={String(xato.uz) + i}>{tr(xato)}</QXato>}
            {ipucha && !xato && <Ipucha matn={{ uz: 'Bu karta sizni tanimagan odamga nimani ko\'rsatadi?', ru: 'Что эта карточка покажет незнакомому вам человеку?' }} />}
          </div>
          {chiziq}
          {uch && <div className="vp-uchar" aria-hidden="true" style={uch.bor ? { left: uch.to.l, top: uch.to.t, width: uch.to.w, height: uch.to.h } : { left: uch.from.l, top: uch.from.t, width: uch.from.w, height: uch.from.h }}><span>{tr(uch.matn)}</span></div>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === '3'} haqiqat={{ uz: 'uchtasi', ru: 'три' }} />}
          matn={tr({ uz: "Bu misolda 3 daqiqaga uch bo'lak sig'di: kimman, nima qurdim va qanday ishlayman.", ru: 'В этом примере в 3 минуты поместились три части: кто я, что я построил и как я работаю.' })}
          izoh={tr({ uz: "Bu kursda video-portfolio — o'zingiz va mahsulotingiz haqidagi 3 daqiqagacha video.", ru: 'В этом курсе видео-портфолио — видео о вас и вашем продукте длиной до 3 минут.' })} />}
      >
        <Ustoz satrlar={[{ uz: "Bo'laklar vaqti o'quvchi talabi emas — jami 3 daqiqa yagona chegara; Mentorning boshlang'ich rejasi (≈0:20 · ≈1:50 · ≈0:50) faqat Amaliyot 1 «Yordam»ida, o'quvchi o'z balansini taymer bilan topadi. 2-karta — 2-darsdagi qoida (funksiyalar ro'yxati — hikoya emas: odam va lahza yo'q; vaqt — ikkilamchi). 3-karta — maktab nomi, sinf va telefon videoga kerak emas; ism esa ixtiyoriy (1-ekran).", ru: 'Время частей — не требование к ученику: единственная граница — всего 3 минуты; стартовый план наставника (≈0:20 · ≈1:50 · ≈0:50) — только в «Подсказке» Практики 1, ученик находит свой баланс по таймеру. 2-я карточка — правило 2-го урока (список функций — не история: нет человека и момента). 3-я карточка — школа, класс и телефон в видео не нужны; имя — по желанию.' }]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Kitob almashish ilovangiz videosida «Qanday ishlayman» bo'lagiga qaysi gap mos?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish ilovangiz videosida <span className="italic" style={{ color: T.accent }}>«Qanday ishlayman»</span> bo'lagiga qaysi gap mos?</h2>, ru: <h2 className="title h-ask">Какая фраза подходит к части <span className="italic" style={{ color: T.accent }}>«Как я работаю»</span> в видео о вашем приложении обмена книгами?</h2> })}
    options={[
      { uz: 'Ilovada uch narsa bor: qidiruv, chat, xarita', ru: 'В приложении три вещи: поиск, чат, карта' },
      { uz: "Keyingi oyda kitob yetkazish ham qo'shiladi", ru: 'В следующем месяце добавится и доставка книг' },
      { uz: "Xaritani qo'shmadim: kitob sinfda almashiladi", ru: 'Карту не добавил: книги меняют в классе' },
      { uz: 'Ilovani 12 ta sinfdoshim ishlatadi va maqtaydi', ru: 'Приложением пользуются и хвалят 12 одноклассников' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Qaror va uning sababi qanday ishlashingizni ko'rsatadi.", ru: 'Решение и его причина показывают, как вы работаете.' }}
    explainWrong={{
      0: { uz: "Bu — funksiyalar ro'yxati. Qaysi qarorni qildingiz?", ru: 'Это список функций. Какое решение вы приняли?' },
      1: { uz: "Bu — va'da. Video bugun bor narsani ko'rsatadimi?", ru: 'Это обещание. Видео показывает то, что есть сегодня?' },
      3: { uz: 'Bu — ilovani kim ishlatishi. Qaror qayerda?', ru: 'Это о том, кто пользуется. Где решение?' },
      default: { uz: 'Qaror va uning sababi qayerda?', ru: 'Где решение и его причина?' }
    }}
    vizual={<Chiziq holat={['bosh', 'bosh', 'joriy']} matn={[null, null, tr({ uz: "Xaritani qo'shmadim…", ru: 'Карту не добавил…' })]} nom={[null, null, tr(VIDEO_BOLAKLAR[2].nom)]} />} />
);

// ===== SCREEN 5 — TUSHUNCHA (bosib toping: 4 mashq kadri bittadan — P-040, E 53; har kadrda yopiladigan joy va ko'rsatsa bo'ladigan joy) =====
const KadrOyna = ({ id, topildi, aldoq, onJoy, onAldoq, yopiq }) => {
  const J = ({ children, className }) => <button type="button" className={cx('vp-joy', className, topildi && 'xira')} disabled={yopiq || topildi} onClick={onJoy}>{children}{topildi && <em className="vp-joy-y fade-step">{tx(MAXFIY_ROYXAT.find(r => r.id === id).yorliq)}</em>}</button>;
  const A = ({ children, className }) => <button type="button" className={cx('vp-joy', 'ald', className, aldoq && 'kul')} disabled={yopiq || topildi} onClick={onAldoq}>{children}</button>;
  if (id === 'kod') return (
    <div className="vp-kod">
      <A className="vp-kod-f"><span>backend/</span><span>mobil/</span><span className="o">.env</span></A>
      <J className="vp-kod-e"><span className="vp-kod-tab">backend/.env</span><span><code>DATABASE_URL=</code><i /></span><span><code>JWT_SECRET=</code><i /></span></J>
    </div>
  );
  if (id === 'kirish') return (
    <div className="vp-kir">
      <b style={{ color: MAYDON_RANG }}>Maydon Jamoa</b>
      <J className="vp-kir-m"><span>login<em>…</em></span><span>{tr({ uz: 'parol', ru: 'пароль' })}<em>••••••••</em></span></J>
      <A className="vp-kir-btn">{tr({ uz: 'Kirish', ru: 'Войти' })}</A>
    </div>
  );
  if (id === 'neon') return (
    <div className="vp-neon">
      <A className="vp-neon-h">SQL Editor</A>
      <J className="vp-neon-t"><span className="vp-neon-n">oyinchilar</span><span className="vp-neon-r h"><code>ism</code><code>login</code></span>{[0, 1, 2].map(r => <span key={r} className="vp-neon-r"><i /><i /></span>)}</J>
    </div>
  );
  return (
    <div className="vp-chatk">
      <A className="vp-chatk-d"><MaydonEkran tur="oyin" /></A>
      <J className="vp-chatk-x"><b>{tr({ uz: 'Sinf chati', ru: 'Чат класса' })}</b><i /><i /></J>
    </div>
  );
};
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const achMiss = useContext(AchMissCtx);
  const [n, setN] = useState(avval ? 4 : 0);
  const [topildi, setTopildi] = useState(false);
  const [aldoq, setAldoq] = useState(false);
  const [xato, setXato] = useState(null);
  const [yangi, setYangi] = useState(-1);
  const aldRef = useRef(false);
  const ketma = useKetma();
  const done = n >= 4;
  const tugadi = useTugadi(done, 900, avval);
  const ipucha = useIpucha(n, !done && !topildi);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'concept', screenIdx: screen, correct: !aldRef.current, picked: true }); }, [done]); // eslint-disable-line
  const joy = () => {
    if (topildi || done) return;
    setTopildi(true); setXato(null); setYangi(n);
    ketma([[1000, () => setYangi(-1)], [0, () => { setTopildi(false); setAldoq(false); setN(x => x + 1); }]]);
  };
  const ald = () => {
    if (topildi || done) return;
    aldRef.current = true; if (achMiss) achMiss.miss(screen);
    setAldoq(true); setXato({ uz: "Muammo bu joy emas — shaxsiy yoki maxfiy ma'lumot qayerda?", ru: 'Проблема не здесь — где личные или секретные данные?' });
    ketma([[900, () => setAldoq(false)]]);
  };
  const royxat = (
    <div className={cx('vp-yr', done && 'tug')}>
      <span className="vp-yr-h"><b>{tr({ uz: 'Yozishdan oldin', ru: 'Перед записью' })}</b><em>{tr({ uz: 'Yopiladigan joy', ru: 'Что закрыть' })}: {Math.min(n + (topildi ? 1 : 0), 4)}{NB}/{NB}4</em></span>
      {MAXFIY_ROYXAT.map((r, q) => {
        const bor = q < n || (q === n && topildi);
        return <span key={r.id} className={cx('vp-yr-q', bor ? 'ok' : 'bosh', yangi === q && 'yangi')}>{bor ? <><b>✓</b>{tx(r.yopish)}</> : <i>{q + 1}</i>}</span>;
      })}
    </div>
  );
  const laptop = (
    <Laptop yorliq={tr({ uz: 'mashq kadri · Mentor misoli', ru: 'учебный кадр · пример наставника' })} ust={done ? null : ` · ${tr({ uz: 'Kadr', ru: 'Кадр' })} ${n + 1}${NB}/${NB}4`} brauzer={done || MAXFIY_KADRLAR[n] !== 'kod'} sinf={cx(!done && !topildi && 'vp-lap-chorla')}>
      {done ? <MaydonEkran tur="oyin" /> : <KadrOyna key={n} id={MAXFIY_KADRLAR[n]} topildi={topildi} aldoq={aldoq} onJoy={joy} onAldoq={ald} />}
    </Laptop>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ekranni tayyorlash', ru: 'Понятие · подготовка экрана' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Joylarni toping (${n}/4)`, ru: `Найдите места (${n}/4)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Yozishdan oldin ekranda <span className="italic" style={{ color: T.accent }}>nimani yopasiz?</span></>, ru: <>Что вы <span className="italic" style={{ color: T.accent }}>закроете</span> на экране перед записью?</> })}
        mentor={<Mentor>{done ? tr({ uz: "Chapdagi to'rt qator — Amaliyot 2 dagi tayyorlash ro'yxatingiz.", ru: 'Четыре строки слева — ваш список подготовки в Практике 2.' }) : tr({ uz: "Har kadrda videoni ko'rgan odam ko'rmasligi kerak bo'lgan joyni bosing.", ru: 'На каждом кадре нажмите место, которое зритель видео не должен видеть.' })}</Mentor>}
        harakat={<div className="vp-s5-h">{royxat}{xato && <QXato key={n + '-' + String(aldoq)}>{tr(xato)}</QXato>}{ipucha && !xato && <Ipucha matn={{ uz: 'Bu kadrda qaysi yozuv faqat sizga tegishli?', ru: 'Какая надпись на этом кадре касается только вас?' }} />}</div>}
        vizual={tugadi ? <div className="vp-s5-tug">{royxat}{laptop}</div> : laptop}
        xulosa={done && <XulosaQ matn={tr({ uz: "Bu misolda to'rt joy yopildi: maxfiy kalit, login, odamlar jadvali va chat.", ru: 'В этом примере закрыли четыре места: секретный ключ, логин, таблицу людей и чат.' })}
          izoh={tr({ uz: 'Yozuvga tushgan narsa video faylida qoladi — shuning uchun ekran yozishdan oldin tayyorlanadi.', ru: 'Что попало в запись, остаётся в видеофайле — поэтому экран готовят до записи.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "Kadrlar — mashq kadri, Mentorning haqiqiy yozuvi emas. 2-kadr — login ko'rinmasligi uchun demo yo'liga namuna akkaunt bilan oldindan kiriladi (6-darsdagi namuna akkaunt). 3-kadr — Neon'da haqiqiy foydalanuvchilarning ismi va logini bor: u oyna yozish paytida yopiq.", ru: 'Кадры — учебные, не настоящая запись наставника. 2-й кадр — чтобы логин не был виден, в демо заранее входят с демо-аккаунтом (из 6-го урока). 3-й кадр — в Neon имена и логины реальных пользователей: это окно при записи закрыто.' },
          { uz: 'Ovoz ham yozuvga tushadi: maktab, telefon, manzil aytilmaydi (Amaliyot 3 da tekshiriladi).', ru: 'Голос тоже попадает в запись: школа, телефон, адрес не называются (проверяется в Практике 3).' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (INLINE_KEYS.s7 = 1) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Yozishni boshlamoqchisiz, ekranda `.env` ochiq turibdi. Nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Yozishni boshlamoqchisiz, ekranda <code className="qcode">.env</code> ochiq turibdi. <span className="italic" style={{ color: T.accent }}>Nima qilasiz?</span></h2>, ru: <h2 className="title h-ask">Вы собираетесь начать запись, а на экране открыт <code className="qcode">.env</code>. <span className="italic" style={{ color: T.accent }}>Что сделаете?</span></h2> })}
    options={[
      { uz: "Avval yozaman, o'sha joydan esa tez o'taman", ru: 'Сначала запишу, а это место быстро пройду' },
      { uz: 'Avval faylni yopaman, keyin yozishni boshlayman', ru: 'Сначала закрою файл, потом начну запись' },
      { uz: "Agentdan videodagi kalitni yashirishni so'rayman", ru: 'Попрошу агента скрыть ключ в видео' },
      { uz: 'Yozaman, videoni faqat sinfdoshimga yuboraman', ru: 'Запишу и отправлю видео только однокласснику' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Yozuvga tushmagan narsa videoda ham ko'rinmaydi.", ru: 'Что не попало в запись, не видно и в видео.' }}
    explainWrong={{
      0: { uz: "Tez o'tsa ham kadr faylda qoladi. Undan oldin-chi?", ru: 'Даже если быстро пройти, кадр остаётся в файле. А до этого?' },
      2: { uz: 'Kalit yozuvga tushgach, u faylda bor. Undan oldin-chi?', ru: 'Когда ключ попал в запись, он уже в файле. А до этого?' },
      3: { uz: "Sinfdoshga ham kalit ko'rinadi. Yozishdan oldin-chi?", ru: 'Однокласснику тоже виден ключ. А до записи?' },
      default: { uz: 'Yozishdan oldin nima qilinadi?', ru: 'Что делают до записи?' }
    }}
    vizual={<YopilishSahna />} />
);
const YopilishSahna = () => {
  const [yopildi, setYopildi] = useState(false);
  const ketma = useKetma();
  useEffect(() => { ketma([[700, () => setYopildi(true)]]); }, []); // eslint-disable-line
  const vaqt = useYuradi(yopildi, 3);
  return (
    <Laptop sinf="vp-lap-kichik" vaqt={vaqt} yonadi={yopildi} brauzer>
      <div className="vp-s7">
        <MaydonEkran tur="oyin" />
        {!yopildi && <span className="vp-s7-env"><span className="vp-kod-tab">backend/.env</span><span><code>JWT_SECRET=</code><i /></span></span>}
      </div>
    </Laptop>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  fitsThree: { icon: '🎬', name: 'Fits Three', desc: { uz: "Videoga sig'adigan uch bo'lakni topdingiz", ru: 'Вы нашли три части, которые помещаются в видео' } },
  realReason: { icon: '🎯', name: 'Real Reason', desc: { uz: 'Qaror va sababi bor gapni tanladingiz', ru: 'Вы выбрали фразу с решением и причиной' } },
  cleanScreen: { icon: '🛡️', name: 'Clean Screen', desc: { uz: 'Yozishdan oldin yopiladigan joylarni topdingiz', ru: 'Вы нашли места, которые закрывают перед записью' } },
  selfReview: { icon: '👀', name: 'Self Review', desc: { uz: "Videongizni o'zingiz ko'rib tekshirdingiz", ru: 'Вы сами посмотрели и проверили своё видео' } },
};
// Ekran id → nishon: 2, 5 — birinchi urinishda (ballsiz, nishon bilan); 4 — 1-savol birinchi urinishda; a3 — 4-qadam «Bajardim» (bonus, P-048)
const ACH_TRIGGERS = { s2: 'fitsThree', s4: 'realReason', s5: 'cleanScreen', a3: 'selfReview' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 7)
const Q_LABELS = {
  4: { uz: "1 — Qanday ishlayman bo'lagi", ru: '1 — Часть «Как я работаю»' },
  7: { uz: '2 — Yozishdan oldin', ru: '2 — Перед записью' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'video', ru: 'видео' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'ssenariy', ru: 'сценарий' }, l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'ekran yozuvi', ru: 'запись экрана' }, l: 6, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'Kimman', ru: 'Кто я' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'Nima qurdim', ru: 'Что я построил' }, l: 42, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'Qanday ishlayman', ru: 'Как я работаю' }, l: 60, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: '3 daqiqa', ru: '3 минуты' }, l: 24, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'havola', ru: 'ссылка' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'Maydon Jamoa', l: 50, t: 52, s: 20, d: 24, dl: 3.3 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Video-portfolio nima?', ru: 'Что такое видео-портфолио?' }, opts: [{ uz: 'Siz va mahsulot haqida 3 daqiqagacha video', ru: 'Видео о вас и продукте до 3 минут' }, { uz: 'Ilovaning hamma funksiyasi sanalgan uzun video', ru: 'Длинное видео со списком всех функций' }, { uz: 'Sinf kanali uchun 3 daqiqalik reklama videosi', ru: '3-минутный рекламный ролик для канала класса' }, { uz: 'Kodni qatorma-qator tushuntiradigan uzun video', ru: 'Длинное видео, объясняющее код построчно' }], correct: 0 },
  { q: { uz: '«Kimman» bo\'lagida nima aytiladi?', ru: 'Что говорится в части «Кто я»?' }, opts: [{ uz: 'Maktabim va sinfimni to\'liq aytib beraman', ru: 'Полностью называю школу и класс' }, { uz: 'Kim ekanim va nima qilishimni bir gapda', ru: 'Кто я и чем занимаюсь — одной фразой' }, { uz: 'Ilovadagi o\'nta funksiyani sanab beraman', ru: 'Перечисляю десять функций приложения' }, { uz: 'Bir gapda keyingi oydagi rejamni aytaman', ru: 'Одной фразой — план на следующий месяц' }], correct: 1 },
  { q: { uz: 'Bu videoda yuz va ism qanday bo\'ladi?', ru: 'Как в этом видео с лицом и именем?' }, opts: [{ uz: 'Ikkalasi ham videoda bo\'lishi shart', ru: 'Оба обязательно должны быть' }, { uz: 'Yuz shart, ismni aytish kerak emas', ru: 'Лицо обязательно, имя не нужно' }, { uz: 'Ikkalasi ham shart emas, ixtiyoriy', ru: 'Оба не обязательны, по желанию' }, { uz: 'Ism shart, yuzni ko\'rsatish kerak emas', ru: 'Имя обязательно, лицо не нужно' }], correct: 2 },
  { q: { uz: 'Yozishdan oldin Backend\'ni nega uyg\'otasiz?', ru: 'Зачем перед записью будить Backend?' }, opts: [{ uz: 'Video sifati yaxshiroq chiqishi uchun', ru: 'Чтобы видео было качественнее' }, { uz: 'Ovoz balandroq va tiniq yozilishi uchun', ru: 'Чтобы голос записался громче и чище' }, { uz: 'Demo oynasi chiroyliroq ko\'rinishi uchun', ru: 'Чтобы окно демо выглядело красивее' }, { uz: 'Demo boshida uzoq kutib qolmaslik uchun', ru: 'Чтобы не ждать долго в начале демо' }], correct: 3 },
  { q: { uz: 'Yozishdan oldin qaysi oynalarni yopasiz?', ru: 'Какие окна закрыть перед записью?' }, opts: [{ uz: 'Chat va pochta oynalarini', ru: 'Окна чата и почты' }, { uz: 'Demo ochiq turgan oynasini', ru: 'Окно, где открыто демо' }, { uz: 'Yozish vositasining oynasini', ru: 'Окно средства записи' }, { uz: 'Lending ochiq turgan oynani', ru: 'Окно с открытым лендингом' }], correct: 0 },
  { q: { uz: 'Demoda haqiqiy foydalanuvchilar ko\'rinmasligi uchun nima qilasiz?', ru: 'Что сделать, чтобы в демо не было видно реальных пользователей?' }, opts: [{ uz: 'Ular ko\'ringan joydan tez o\'taman', ru: 'Быстро пройду места, где они видны' }, { uz: 'Namuna akkaunt bilan ko\'rsataman', ru: 'Покажу с демо-аккаунтом' }, { uz: 'Haqiqiy akkauntim bilan ko\'rsataman', ru: 'Покажу со своим настоящим аккаунтом' }, { uz: 'Videoni qisqaroq qilib yozib olaman', ru: 'Запишу видео покороче' }], correct: 1 },
  { q: { uz: 'Video faylni qayerda saqlaysiz?', ru: 'Где вы храните видеофайл?' }, opts: [{ uz: 'Repo papkasida, kod yonida', ru: 'В папке репозитория, рядом с кодом' }, { uz: 'Sinf chatida, yo\'qolmasin deb', ru: 'В чате класса, чтобы не потерялся' }, { uz: 'Repo papkasidan tashqarida', ru: 'Вне папки репозитория' }, { uz: 'README fayli yonida, repo\'da', ru: 'Рядом с README, в репозитории' }], correct: 2 },
  { q: { uz: '`git status` da video fayl ko\'rindi. Bu nimani bildiradi?', ru: 'В `git status` виден видеофайл. Что это значит?' }, opts: [{ uz: 'Video GitHub\'ga ham yuklanib ketdi', ru: 'Видео уже загрузилось и на GitHub' }, { uz: 'Video fayl ochilmaydigan bo\'ldi', ru: 'Видеофайл перестал открываться' }, { uz: 'Video 3 daqiqaga sig\'may qoldi', ru: 'Видео не уложилось в 3 минуты' }, { uz: 'Fayl repo papkasi ichida turibdi', ru: 'Файл лежит внутри папки репозитория' }], correct: 3 },
  { q: { uz: 'Video 3 daqiqaga sig\'ganini qanday bilasiz?', ru: 'Как узнать, что видео уложилось в 3 минуты?' }, opts: [{ uz: 'Video oynasidagi vaqtni ko\'raman', ru: 'Посмотрю время в окне видео' }, { uz: 'Agentdan so\'rab, shundan bilaman', ru: 'Спрошу у агента' }, { uz: 'Ssenariy qisqa bo\'lsa, sig\'adi', ru: 'Если сценарий короткий, уложится' }, { uz: 'Fayl hajmiga qarab bilib olaman', ru: 'Пойму по размеру файла' }], correct: 0 },
  { q: { uz: 'Tekshiruvda login ko\'rinib qoldi. Nima qilasiz?', ru: 'При проверке виден логин. Что сделаете?' }, opts: [{ uz: 'Videoni shundayligicha qoldirib yuboraman', ru: 'Оставлю видео как есть и отправлю' }, { uz: 'O\'chirib, ekranni tayyorlab, qayta yozaman', ru: 'Удалю, подготовлю экран, перезапишу' }, { uz: 'Faqat bitta tanish sinfdoshimga yuboraman', ru: 'Отправлю только одному знакомому однокласснику' }, { uz: 'Parol ko\'rinmadi, login ko\'rinsa bo\'laveradi', ru: 'Пароль не виден, логин можно' }], correct: 1 },
  { q: { uz: 'Mahsulotingiz bugun ochilmadi. «Nima qurdim»da nima qilasiz?', ru: 'Продукт сегодня не открылся. Что сделаете в «Что я построил»?' }, opts: [{ uz: 'Mentor misolini o\'zimniki deb ko\'rsataman', ru: 'Покажу пример наставника как свой' }, { uz: 'Ochilmagan sahifani uzoq kutib turaman', ru: 'Буду долго ждать неоткрывшуюся страницу' }, { uz: '6-darsdagi B reja videosini ko\'rsataman', ru: 'Покажу видео плана B с 6-го урока' }, { uz: 'B rejasiz, bu bo\'lakni olib tashlayman', ru: 'Без плана B уберу эту часть' }], correct: 2 },
  { q: { uz: 'Ota-onangiz rozi. Videoni qayerga joylaysiz?', ru: 'Родители согласны. Куда выложите видео?' }, opts: [{ uz: 'Ijtimoiy tarmoqdagi ochiq sahifamga', ru: 'На свою открытую страницу в соцсети' }, { uz: 'Sinf kanaliga, hamma ko\'rib tursin deb', ru: 'В канал класса, чтобы все видели' }, { uz: 'Repo\'ga, havolasini README\'ga yozib', ru: 'В репозиторий, ссылку — в README' }, { uz: 'Faqat havola bilan ko\'rinadigan joyga', ru: 'В место, видимое только по ссылке' }], correct: 3 },
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

// ===== AMALIYOT BLOKLARI (3, 6, 8) — ScreenBlok + QBlok; hammasi o'quvchining o'z mahsulotida (Mentor misoli — namuna). Signal 500+ zonasida — faqat mentor ko'radi =====
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const Kulrang = ({ children }) => <span className="vp-kulrang">{children}</span>;
const Band = ({ children }) => <span className="vp-band">{children}</span>;
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda, doneText, ulgur, ulgurQadam = 99, ulgurShart, qulf, ustoz, extra, boshQadam, vazifa }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? (boshQadam ? boshQadam() : steps.length) : 0));
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
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11 (F-1008-589): Mentor har holatda keyingi harakatni aytadi
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('vp-blok', qulfli && 'qulf', done && 'tugadi')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({ h: tr(c.h), t: c.t }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={doneText ? tr(doneText) : null} natija={natija} natijaYorliq={tr(natijaYorliq || NATIJA_YORLIQ)}
          pastki={<MentorPracticeStats live={_live} screen={screen} />}>
          {vazifa && !done && <p className="vp-vazifa">{tx(vazifa)}</p>}
          {ortda && !done && <p className="vp-ortda">{ortda}</p>}
          {ulgur && !done && <p className="vp-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="vp-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}
const Yordam = ({ children }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="vp-yordam-ust">
      <QTugma ikkinchi aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="vp-yordam fade-step">{children}</span>}
    </span>
  );
};
// Ikki tugmali tanlov (dars holati yoki kalit maydoni) — har variantning o'z yengil chegarasi (E 40)
const Tanlov = ({ variantlar, qiymat, onTanla, chorla }) => (
  <span className={cx('vp-tanlov', chorla && qiymat == null && 'vp-chorla')}>
    {variantlar.map(v => <button type="button" key={String(v.k)} className={cx('q-chip', qiymat === v.k && 'on', v.xavf && qiymat === v.k && 'xavf')} onClick={() => onTanla(v.k)}>{tr(v.t)}</button>)}
  </span>
);
// Mentor ssenariy kartasi (namuna — A-4 aynan) va o'quvchi ssenariysi
const DemoYol = ({ qadamlar }) => <span className="vp-demo">{qadamlar.map((q, i) => <span key={i}>{tr(q)}</span>)}</span>;
const MentorSsenariy = ({ ekranBilan = true }) => (
  <span className="vp-ss">
    {VIDEO_BOLAKLAR.map(b => {
      const m = MENTOR_SSENARIY[b.id];
      return (
        <span key={b.id} className="vp-ss-q">
          <b>{tr(b.nom)}{ekranBilan && <em>{tr(m.ekran)}</em>}</b>
          <span className="vp-ss-g">{tr(m.gap)}</span>
          {m.demo && <DemoYol qadamlar={m.demo} />}
          {m.keyin && <span className="vp-ss-g">{tr(m.keyin)}</span>}
        </span>
      );
    })}
  </span>
);
const OquvchiSsenariy = ({ b }) => (
  <span className="vp-ss oq">
    {VIDEO_BOLAKLAR.map(x => <span key={x.id} className="vp-ss-q"><b>{tr(x.nom)}</b><span className="vp-ss-g">{b[x.id] || ''}</span></span>)}
  </span>
);

// --- Amaliyot 1: ssenariy. Detektorlar (PM-108, ikki tilli; «maktab» so'zi tekshirilmaydi — 09-FILTR 21) ---
const ALOQA_RE = /\+998|@|t\.me\//i;
const RAQAM7_RE = /\d{7,}/;
const SABAB_RE = {
  uz: /chunki|sabab|uchun|:/i,
  ru: /потому|так как|причин|чтобы|поэтому|:/i
};
const BOLAK_MAX = { kimman: 160, nimaQurdim: 300, qandayIshlayman: 200 };
const bolakTekshir = (id, s, yumshoqOtdi) => {
  const t = String(s || '').trim();
  if (!t) return { tur: 'blok', m: { uz: "Bu bo'lakni bir gap bilan yozing.", ru: 'Напишите эту часть одним предложением.' } };
  if (id === 'kimman' && ALOQA_RE.test(t)) return { tur: 'blok', m: { uz: "Ssenariyga telefon, akkaunt va havola yozilmaydi.", ru: 'В сценарий не пишут телефон, аккаунт и ссылку.' } };
  if (yumshoqOtdi) return null;
  if (id === 'kimman' && RAQAM7_RE.test(t.replace(/[\s()-]/g, ''))) return { tur: 'yumshoq', m: { uz: "Maktabingizning nomi yoki aloqa ma'lumoti bo'lmasin.", ru: 'Пусть не будет названия школы или контактов.' } };
  if (id === 'qandayIshlayman' && !SABAB_RE.uz.test(t) && !SABAB_RE.ru.test(t)) return { tur: 'yumshoq', m: { uz: 'Qarorning sababini ham yozing: nega shunday qildingiz?', ru: 'Напишите и причину решения: почему вы так сделали?' } };
  return null;
};
const UchBolakForma = ({ qiymat, onQiymat, j, setJ, manba }) => {
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(false);
  const b = VIDEO_BOLAKLAR[j];
  const keyingi = () => {
    const x = bolakTekshir(b.id, qiymat[b.id], yumshoq);
    if (x) { setXato(x); if (x.tur === 'yumshoq') setYumshoq(true); return; }
    setXato(null); setYumshoq(false); onQiymat(b.id, String(qiymat[b.id]).trim()); setJ(j + 1);
  };
  return (
    <span className="vp-ub">
      <span className="vp-ub-d">{VIDEO_BOLAKLAR.map((x, q) => <span key={x.id} className={cx('vp-ub-n', q === j && 'joriy', q < j && 'ok')}><i>{q < j ? '✓' : q + 1}</i>{tr(x.nom)}</span>)}</span>
      {VIDEO_BOLAKLAR.slice(0, j).map((x, q) => <button type="button" key={x.id} className="vp-ix" onClick={() => { setXato(null); setYumshoq(false); setJ(q); }}><b>✓</b><span><em>{tr(x.nom)}</em> · {qiymat[x.id]}</span><i aria-hidden="true">✎</i></button>)}
      {b && <span className="vp-ub-k fade-step" key={b.id}>
        <label className="vp-ub-m"><span className="vp-ub-l">{j + 1} · {tr(b.nom)}</span>
          <textarea rows={b.id === 'nimaQurdim' ? 4 : 2} maxLength={BOLAK_MAX[b.id]} value={qiymat[b.id] || ''} placeholder={tr(b.ph)} onChange={e => { setXato(null); setYumshoq(false); onQiymat(b.id, e.target.value); }} /></label>
        {b.id === 'kimman' && <Kulrang>{tr({ uz: "Ismingizni bu yerga yozmang: xohlasangiz, videoda o'zingiz aytasiz.", ru: 'Не пишите сюда имя: если хотите, скажете его в видео сами.' })}</Kulrang>}
        {b.id === 'nimaQurdim' && (manba.hikoya || manba.demo) && <span className="vp-manba">{manba.hikoya && <em>{tr({ uz: '2-darsdan olindi', ru: 'взято из 2-го урока' })}</em>}{manba.demo && <em>{tr({ uz: '6-darsdan olindi', ru: 'взято из 6-го урока' })}</em>}</span>}
        {xato && <span className={cx('vp-xato', xato.tur === 'yumshoq' && 'yum')} role="status">{tr(xato.m)}{xato.tur === 'yumshoq' && <em>{tr({ uz: 'Shunday qoldirsangiz — yana bosing.', ru: 'Если оставляете так — нажмите ещё раз.' })}</em>}</span>}
        <span className="vp-ub-btn">
          <QTugma className={halqa(!!String(qiymat[b.id] || '').trim())} onClick={keyingi}>{j === 2 ? tr({ uz: 'Tayyor', ru: 'Готово' }) : tr({ uz: "Keyingi bo'lak", ru: 'Следующая часть' })}</QTugma>
          <Yordam><b>{tr({ uz: 'Mentor misoli', ru: 'Пример наставника' })} · <span style={{ color: MAYDON_RANG }}>Maydon Jamoa</span></b><MentorSsenariy /></Yordam>
        </span>
      </span>}
    </span>
  );
};
const Taymer = ({ onSek }) => {
  const [bosh, setBosh] = useState(null);
  const [sek, setSek] = useState([]);
  const [hozir, setHozir] = useState(0);
  useEffect(() => {
    if (bosh === null || sek.length >= 3) return undefined;
    const t = setInterval(() => setHozir(Math.round((Date.now() - bosh) / 1000)), 250);
    return () => clearInterval(t);
  }, [bosh, sek.length]);
  const boshla = () => { setBosh(Date.now()); setSek([]); setHozir(0); onSek([]); };
  const belgi = (q) => {
    if (bosh === null || q !== sek.length) return;
    const jami = Math.round((Date.now() - bosh) / 1000); const oldin = sek.reduce((a, x) => a + x, 0);
    const s = [...sek, Math.max(1, jami - oldin)]; setSek(s); onSek(s);
  };
  const jami = sek.reduce((a, x) => a + x, 0);
  const tugadi = sek.length >= 3;
  return (
    <span className="vp-tm">
      <span className="vp-tm-r">
        <QTugma ikkinchi className={cx('vp-tm-b', halqa(bosh === null))} onClick={boshla}>{bosh === null ? tr({ uz: 'Taymer', ru: 'Таймер' }) : <>↻ {vaqtYoz(tugadi ? jami : hozir)}</>}</QTugma>
        {VIDEO_BOLAKLAR.map((x, q) => <button type="button" key={x.id} className={cx('q-chip', q < sek.length && 'on', bosh !== null && q === sek.length && 'vp-halqa')} disabled={bosh === null || q !== sek.length} onClick={() => belgi(q)}>{q + 1} · {tr(x.nom)}</button>)}
      </span>
      {tugadi && <span className={cx('vp-tm-n fade-step', jami > 180 && 'osh')}>{jami <= 180 ? tr({ uz: "3 daqiqaga sig'di.", ru: 'Уложились в 3 минуты.' }) : tr({ uz: "3 daqiqadan oshdi — takrorlangan yoki ortiqcha gapni qisqartirib yana o'qing.", ru: 'Больше 3 минут — сократите повторы или лишние фразы и прочитайте ещё раз.' })}</span>}
    </span>
  );
};
const Nusxa = ({ matn }) => {
  const [ok, setOk] = useState(false);
  const bos = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq */ } };
  return <QTugma ikkinchi className="vp-nusxa" onClick={bos}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</QTugma>;
};
const ScreenA1 = (props) => {
  const saqlangan = useMemo(() => videoOqi().bolaklar, []);
  const manba = useMemo(() => {
    if (bolakBor(saqlangan)) return { hikoya: false, demo: false, nima: null };
    const h = hikoyaOqi(); const lahza = h ? [h.lahza, h.ozgarish].map(x => String(x || '').trim()).filter(Boolean).join(' ') : '';
    const d = demoQator();
    return { hikoya: !!lahza, demo: !!d, nima: [lahza, d].filter(Boolean).join(' ') || null };
  }, [saqlangan]);
  const [q, setQ] = useState(() => (bolakBor(saqlangan) ? { ...saqlangan } : { ...BOSH_BOL, nimaQurdim: manba.nima }));
  const [j, setJ] = useState(() => (bolakBor(saqlangan) ? 3 : 0));
  const [sek, setSek] = useState([]);
  const [saqlandi, setSaqlandi] = useState(() => bolakBor(saqlangan));
  const uchala = j >= 3 && VIDEO_BOLAKLAR.every(x => String(q[x.id] || '').trim());
  const onQiymat = (id, v) => { setSaqlandi(false); setQ(o => ({ ...o, [id]: v })); };
  const saqla = () => { videoYoz(v => ({ ...v, bolaklar: { kimman: q.kimman || null, nimaQurdim: q.nimaQurdim || null, qandayIshlayman: q.qandayIshlayman || null } })); setSaqlandi(true); };
  const matn = VIDEO_BOLAKLAR.map(x => `${ou(x.nom)}: ${q[x.id] || ''}`).join('\n');
  const trek = trekOqi();
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx(trek === 'mobil' ? { uz: "demo yo'lingizni laptop brauzerida oching (mobil trekda — ilovaning brauzer ko'rinishi). Uni videoda ko'rsatasiz.", ru: 'откройте свой демо-путь в браузере ноутбука (мобильный трек — браузерная версия приложения). Его вы покажете в видео.' } : trek === 'web' ? { uz: "demo yo'lingizni laptop brauzerida oching (web-trekda — saytingiz). Uni videoda ko'rsatasiz.", ru: 'откройте свой демо-путь в браузере ноутбука (веб-трек — ваш сайт). Его вы покажете в видео.' } : { uz: "demo yo'lingizni laptop brauzerida oching (mobil trekda — ilovaning brauzer ko'rinishi, web-trekda — saytingiz). Uni videoda ko'rsatasiz.", ru: 'откройте свой демо-путь в браузере ноутбука (мобильный трек — браузерная версия приложения, веб-трек — ваш сайт). Его вы покажете в видео.' })}
      <Band>{tr({ uz: "Bu videoni sizni tanimaydigan odam ko'rishi mumkin: u sizni ham, mahsulotingizni ham birinchi marta ko'radi. Shuning uchun har bo'lak qisqa va aniq bo'ladi.", ru: 'Это видео может увидеть незнакомый вам человек: он впервые видит и вас, и ваш продукт. Поэтому каждая часть короткая и точная.' })}</Band>
      {manba.hikoya && <Kulrang>{tr({ uz: "2-darsdagi hikoyangiz «Nima qurdim» kartasiga oldindan yozildi.", ru: 'Ваша история из 2-го урока заранее записана в карточку «Что я построил».' })}</Kulrang>}</> },
    { h: { uz: "Uch bo'lak", ru: 'Три части' }, t: <><UchBolakForma qiymat={q} onQiymat={onQiymat} j={j} setJ={setJ} manba={manba} /></> },
    { h: { uz: "Ovoz chiqarib o'qish", ru: 'Чтение вслух' }, t: <>{tr({ uz: "«Taymer»ni bosing va ssenariyni pastroq ovozda o'qing; «Nima qurdim»da demo yo'lini bir marta bosib chiqing. Har bo'lak tugaganda chapdagi bo'lakni bosing (1 → 2 → 3).", ru: 'Нажмите «Таймер» и прочитайте сценарий вполголоса; в «Что я построил» один раз пройдите демо-путь. Когда часть закончилась, нажмите её слева (1 → 2 → 3).' })}<Taymer onSek={setSek} /><Kulrang>{tr({ uz: "Taymer vaqti saqlanmaydi — bu mashq; videoning haqiqiy vaqti — Amaliyot 3 da.", ru: 'Время таймера не сохраняется — это упражнение; настоящая длина видео — в Практике 3.' })}</Kulrang></> },
    { h: { uz: 'Tayyor ssenariy', ru: 'Готовый сценарий' }, t: <>{tr({ uz: "uch bo'lak bitta kartada.", ru: 'три части в одной карточке.' })}
      <span className="vp-tayyor"><OquvchiSsenariy b={q} /><span className="vp-tayyor-b"><QTugma className={halqa(!saqlandi)} onClick={saqla}>{saqlandi ? tr({ uz: '✓ Saqlandi', ru: '✓ Сохранено' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma><Nusxa matn={matn} /></span></span>
      <Kulrang>{tr({ uz: "Ssenariyni qog'ozga yozib oling yoki telefoningizda oching: yozish paytida dars oynasi ekranda turmasin.", ru: 'Перепишите сценарий на бумагу или откройте в телефоне: во время записи окна урока на экране быть не должно.' })}</Kulrang></> }
  ];
  const holat = VIDEO_BOLAKLAR.map((x, i) => (i < j || (j >= 3) ? 'oq' : i === j ? 'joriy' : 'bosh'));
  const done = !!props.storedAnswer?.solved;
  const natija = (
    <div className="vp-a1n">
      {done && saqlandi ? <OquvchiSsenariy b={q} /> : <MentorSsenariy />}
      <Chiziq holat={holat} sek={sek.length ? sek : null} yorliq={sek.length ? tr({ uz: 'sizning vaqtingiz', ru: 'ваше время' }) : null}
        ost={!sek.length && <span className="vp-ch-reja">{tr({ uz: 'Mentor rejasi — namuna, talab emas', ru: 'План наставника — образец, не требование' })}: ≈0:20 · ≈1:50 · ≈0:50</span>} />
    </div>
  );
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z mahsulotingiz", ru: 'Практика 1 · ваш продукт' }}
      title={{ uz: <>Uch bo'lakni <span className="italic" style={{ color: T.accent }}>o'z mahsulotingiz</span> haqida yozing.</>, ru: <>Напишите три части о <span className="italic" style={{ color: T.accent }}>своём продукте</span>.</> }}
      vazifa={{ uz: "Kimman, Nima qurdim va Qanday ishlayman — har biri o'z gapingiz bilan, ovoz chiqarib o'qilganda 3 daqiqaga sig'sin.", ru: '«Кто я», «Что я построил» и «Как я работаю» — каждое своими словами, чтобы при чтении вслух уложиться в 3 минуты.' }}
      mentor={{ uz: "Har bo'lak — bitta karta, namuna «Yordam»da; «1 · Ochish»dan boshlang.", ru: 'Каждая часть — одна карточка, образец в «Подсказке»; начните с «1 · Открыть».' }}
      steps={steps} natija={natija} natijaYorliq={done && saqlandi ? { uz: 'sizning ssenariyingiz', ru: 'ваш сценарий' } : NATIJA_YORLIQ}
      qulf={(n) => (n === 1 && !uchala) || (n === 3 && !saqlandi)}
      ulgurQadam={2} ulgurShart={() => uchala}
      ortda={<>{tr({ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching:", ru: 'Отстали — откройте пример наставника вне своего репозитория, в новой папке:' })} <code className="qcode">git clone https://github.com/Azizbekcrypto/maydon-jamoa</code> · <code className="qcode">cd maydon-jamoa</code> · <code className="qcode">git checkout -f m14-dars-09-done</code> — {tr({ uz: "oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. Bugun kod o'zgarmaydi — namuna faqat ko'rish uchun; videoni o'z mahsulotingiz haqida yozasiz.", ru: 'последнюю команду запускайте только в этой новой папке: она стирает изменения в папке. Сегодня код не меняется — образец только для просмотра; видео вы пишете о своём продукте.' })}</>}
      ulgur={{ uz: "Ulgurmasangiz: «Qanday ishlayman»ni bitta gap qiling; ovoz chiqarib o'qishni yozishdan oldin bir marta qiling.", ru: 'Не успеваете: сделайте «Как я работаю» одним предложением; прочитайте вслух один раз перед записью.' }}
      doneText={{ uz: "Ssenariy yozildi va ovoz chiqarib o'qildi.", ru: 'Сценарий написан и прочитан вслух.' }}
      ustoz={[{ uz: "Eng ko'p uchraydigan holat — «Nima qurdim» funksiyalar ro'yxatiga aylanadi: «Qaysi lahzani o'zgartirdingiz?» deb so'rang. «Qanday ishlayman»da qaror bo'lmasa — «Avval nimani qildingiz, nimani keyinga qoldirdingiz?» deb so'rang.", ru: 'Чаще всего «Что я построил» превращается в список функций: спросите «Какой момент вы изменили?». Если в «Как я работаю» нет решения — спросите «Что вы сделали сначала, а что отложили?».' }]} />
  );
};

// --- Amaliyot 2: yozish ---
const A2Sahna = () => {
  const [k, setK] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[700, () => setK(1)], [1100, () => setK(2)], [1100, () => setK(3)], [1100, () => setK(4)], [1100, () => setK(5)], [900, () => setK(6)]]); }, []); // eslint-disable-line
  const vaqt = useYuradi(k >= 1, 180, 40, 4);
  const ekran = k <= 1 ? <MaydonEkran tur="lending" /> : <MaydonEkran tur="oyin" son={k >= 4 ? 9 : 8} bosildi={k >= 4} />;
  return (
    <div className="vp-a2n">
      <Laptop vaqt={vaqt} yonadi={k >= 1 && k < 6} tolqin={k >= 1 && k < 6}>{ekran}</Laptop>
      <Chiziq holat={[0, 1, 2].map(i => (k >= 6 || k > [1, 2, 5][i] ? 'ok' : k >= [1, 2, 5][i] ? 'joriy' : 'bosh'))} />
      <div className="vp-a2-ost">
        <FaylKarta />
        <div className="vp-term"><p className="b">$ git status</p><p>On branch main</p><p className="ok">nothing to commit, working tree clean</p></div>
      </div>
    </div>
  );
};
const ScreenA2 = (props) => {
  const v0 = useMemo(() => videoOqi(), []);
  const [tayyor, setTayyor] = useState(() => (props.storedAnswer?.solved ? MAXFIY_ROYXAT.map(() => true) : MAXFIY_ROYXAT.map(() => false)));
  const [bor, setBor] = useState(v0.bor);
  const [ovoz, setOvoz] = useState(v0.tekshiruv.ovozBor);
  const trek = trekOqi();
  const borTanla = (x) => { setBor(x); videoYoz(v => ({ ...v, bor: x })); };
  const ovozTanla = (x) => { setOvoz(x); videoYoz(v => ({ ...v, tekshiruv: { ...v.tekshiruv, ovozBor: x } })); };
  const hammasi = tayyor.every(Boolean);
  const steps = [
    { h: { uz: 'Tayyorlash', ru: 'Подготовка' }, t: <>{tr({ uz: "har birini bosib ✓ qiling:", ru: 'нажмите каждый пункт, чтобы отметить ✓:' })}
      <span className={cx('vp-cl', !hammasi && 'vp-chorla')}>{MAXFIY_ROYXAT.map((r, i) => <button type="button" key={r.id} className={cx('vp-cl-q', tayyor[i] && 'on')} onClick={() => setTayyor(t => t.map((x, q) => (q === i ? !x : x)))}><i>{tayyor[i] ? '✓' : i + 1}</i>{tx(r.yopish)}</button>)}</span>
      <Band>{tr({ uz: "Keyin: yozishdan oldin demo yo'lini bir marta oching va ro'yxat chiqqanini ko'ring. Demo holatini boshiga qaytaring (Mentor misolida — o'yindan chiqish: yana «8 / 10»).", ru: 'Затем: перед записью один раз откройте демо-путь и убедитесь, что список появился. Верните демо в начальное состояние (в примере наставника — выйти из игры: снова «8 / 10»).' })}</Band>
      <Band>{tr(trek === 'mobil' ? { uz: "Demo yo'li: mobil trekda — ilovaning brauzer ko'rinishi; laptop brauzerida, namuna akkaunt bilan.", ru: 'Демо-путь: мобильный трек — браузерная версия приложения; в браузере ноутбука, с демо-аккаунтом.' } : trek === 'web' ? { uz: "Demo yo'li: web-trekda — saytingiz; laptop brauzerida, namuna akkaunt bilan.", ru: 'Демо-путь: веб-трек — ваш сайт; в браузере ноутбука, с демо-аккаунтом.' } : { uz: "Demo yo'li: mobil trekda — ilovaning brauzer ko'rinishi, web-trekda — saytingiz; laptop brauzerida, namuna akkaunt bilan.", ru: 'Демо-путь: мобильный трек — браузерная версия приложения, веб-трек — ваш сайт; в браузере ноутбука, с демо-аккаунтом.' })}</Band>
      <Kulrang>{tr({ uz: "Namuna akkaunt — 6-darsda tayyorlangan. Yo'q bo'lsa — Mentordan yordam so'rang yoki «Nima qurdim» bo'lagida 6-darsdagi B reja videongizni ekranda ochib ko'rsating.", ru: 'Демо-аккаунт готовили на 6-м уроке. Если его нет — попросите помощи у наставника или в части «Что я построил» откройте на экране своё видео плана B с 6-го урока.' })}</Kulrang>
      <Kulrang>{tx({ uz: "Mahsulot ochilmasa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas):", ru: 'Если продукт не открывается — отправьте агенту строку ошибки (не значения `.env`, токены и ключи):' })}</Kulrang>
      <span className="q-prompt vp-prompt"><span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span></span><span className="vp-ps">{tr({ uz: 'Shu xato chiqdi: ', ru: 'Вышла такая ошибка: ' })}<span className="q-joy">{tr({ uz: '{xato}', ru: '{ошибка}' })}</span>{tr({ uz: ". Tuzat, yangi narsa qo'shma.", ru: '. Исправь, ничего нового не добавляй.' })}</span></span>
      <Kulrang>{tr({ uz: "Vaqt yetmasa — «Nima qurdim» bo'lagida 6-darsdagi B reja videongizni ekranda ochib ko'rsatasiz. Ssenariy — qog'ozda yoki telefonda; dars oynasini yozishdan oldin yoping.", ru: 'Если не хватает времени — в части «Что я построил» откроете на экране видео плана B с 6-го урока. Сценарий — на бумаге или в телефоне; окно урока закройте до записи.' })}</Kulrang></> },
    { h: { uz: 'Yozish', ru: 'Запись' }, t: <>{tr({ uz: "kompyuteringizdagi ekran yozish vositasini oching va ovoz (mikrofon) yozilishini yoqing. Kamera — faqat ota-onangiz rozi bo'lsa; bo'lmasa o'chiq qoladi. Ismni aytish — ixtiyoriy.", ru: 'откройте средство записи экрана на компьютере и включите запись звука (микрофон). Камера — только если согласны родители; иначе выключена. Называть имя — по желанию.' })}
      <Band>{tr({ uz: "Yozishni boshlang va ssenariy bo'yicha ayting: «Kimman» (ekranda — lending yoki bosh sahifa) → «Nima qurdim» (lahza, keyin demo yo'li) → «Qanday ishlayman». Vaqtni telefoningizdagi taymer yoki vositaning o'z hisoblagichi bilan kuzating.", ru: 'Начните запись и говорите по сценарию: «Кто я» (на экране — лендинг или главная) → «Что я построил» (момент, потом демо-путь) → «Как я работаю». Следите за временем по таймеру телефона или счётчику средства.' })}</Band>
      <Band>{tr({ uz: "Kichik adashishda davom eting; gap ma'nosi buzilsa va vaqt bo'lsa — boshidan qayta yozing.", ru: 'При маленькой ошибке продолжайте; если смысл фразы сломался и есть время — перезапишите с начала.' })}</Band>
      <Kulrang>{tr({ uz: "Kompyuterda ekran yozish ishlamasa — telefoningizning ekran yozuvi bilan yozing: demo yo'lini telefon brauzerida oching (11-Modulda ekran videosini shunday yozgansiz). U ham bo'lmasa — Mentordan yordam so'rang.", ru: 'Если запись экрана на компьютере не работает — запишите записью экрана телефона: откройте демо-путь в браузере телефона (так вы записывали видео экрана в 11-м модуле). Если и это не выйдет — попросите помощи у наставника.' })}</Kulrang></> },
    { h: { uz: 'Video fayl', ru: 'Видеофайл' }, t: <>{tx({ uz: "videoni repo papkangizdan tashqaridagi papkaga saqlang va papkani o'zingiz ko'ring. Repo papkasida terminalda `git status` — video fayl ro'yxatda ko'rinsa, joyi noto'g'ri: faylni repo'dan tashqariga ko'chiring va qayta ko'ring.", ru: 'сохраните видео в папку вне папки репозитория и сами посмотрите папку. В папке репозитория в терминале `git status` — если видеофайл виден в списке, место неверное: перенесите файл за пределы репозитория и проверьте снова.' })}
      <Band>{tr({ uz: "Video hech qayerga yuklanmaydi — hozircha faqat kompyuteringizda. Belgilang:", ru: 'Видео никуда не загружается — пока только на вашем компьютере. Отметьте:' })}</Band>
      <Tanlov chorla qiymat={bor} onTanla={borTanla} variantlar={[{ k: true, t: { uz: 'Video saqlandi', ru: 'Видео сохранено' } }, { k: false, t: { uz: 'Yozolmadim', ru: 'Не смог записать' }, xavf: true }]} /></> },
    { h: { uz: "Birinchi ko'rish", ru: 'Первый просмотр' }, t: <>{tr({ uz: "video faylni oching va birinchi 20 soniyani ko'ring: ovozingiz eshitiladimi, ekran o'qiladimi? Tanlang:", ru: 'откройте видеофайл и посмотрите первые 20 секунд: слышен ли голос, читается ли экран? Выберите:' })}
      <Tanlov chorla qiymat={ovoz} onTanla={ovozTanla} variantlar={[{ k: true, t: { uz: 'Ovoz va ekran bor', ru: 'Есть голос и экран' } }, { k: false, t: { uz: "Ovoz yo'q", ru: 'Нет голоса' }, xavf: true }]} />
      {ovoz === false && <Kulrang>{tr({ uz: 'Vositada mikrofon yoqilganini tekshirib, qayta yozing.', ru: 'Проверьте, что в средстве включён микрофон, и перезапишите.' })}</Kulrang>}
      <Kulrang>{tr({ uz: "To'liq tekshiruv — Amaliyot 3 da.", ru: 'Полная проверка — в Практике 3.' })}</Kulrang></> }
  ];
  const yaxshi = bor === true && ovoz === true;
  const done = !!props.storedAnswer?.solved;
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z videongiz", ru: 'Практика 2 · ваше видео' }}
      title={{ uz: <>Ekranni tayyorlab, videoni <span className="italic" style={{ color: T.accent }}>ssenariy bo'yicha</span> yozing.</>, ru: <>Подготовьте экран и запишите видео <span className="italic" style={{ color: T.accent }}>по сценарию</span>.</> }}
      vazifa={{ uz: 'Ekranda faqat demo yo\'li; ssenariy qog\'ozda yoki telefonda; video fayl repo papkasidan tashqarida.', ru: 'На экране только демо-путь; сценарий на бумаге или в телефоне; видеофайл вне папки репозитория.' }}
      mentor={{ uz: "Avval to'rt joyni yopasiz, keyin yozasiz; «1 · Tayyorlash»dan boshlang.", ru: 'Сначала закроете четыре места, потом запишете; начните с «1 · Подготовка».' }}
      steps={steps}
      natija={done ? <div className="vp-a2-ost tug"><FaylKarta /><div className="vp-term"><p className="b">$ git status</p><p>On branch main</p><p className="ok">nothing to commit, working tree clean</p></div></div> : <A2Sahna />}
      natijaYorliq={done ? { uz: 'video fayl', ru: 'видеофайл' } : NATIJA_YORLIQ}
      boshQadam={() => (v0.bor === null ? 2 : steps.length)}
      qulf={(n) => (n === 0 && !hammasi) || (n === 2 && bor === null) || (n === 3 && bor === true && ovoz === null)}
      ulgurQadam={3} ulgurShart={() => bor !== null}
      ulgur={{ uz: "Ulgurmasangiz: video bir marta yozilsa yetarli; qayta yozish — faqat Amaliyot 3 tekshiruvidan keyin, kerak bo'lsa.", ru: 'Не успеваете: достаточно записать видео один раз; перезапись — только после проверки в Практике 3, если нужно.' }}
      doneText={yaxshi ? { uz: 'Video yozildi va repo papkasidan tashqarida saqlandi.', ru: 'Видео записано и сохранено вне папки репозитория.' } : { uz: "Video hali tayyor emas — qaysi qadamda to'xtaganingiz belgilandi.", ru: 'Видео ещё не готово — отмечено, на каком шаге вы остановились.' }}
      ustoz={[{ uz: "Ovoz — navbat bilan (2-ekran eslatmasi). Ba'zi kompyuterlar ekran yozishdan oldin ruxsat so'raydi; ruxsat oynasi chiqsa, o'quvchiga yordam bering. Video fayl katta bo'lishi mumkin — kompyuterda joy borligini darsdan oldin tekshiring.", ru: 'Голос — по очереди (заметка 1-го экрана). Некоторые компьютеры перед записью экрана спрашивают разрешение; если появится окно — помогите ученику. Видеофайл может быть большим — заранее проверьте место на диске.' }]} />
  );
};

// --- Amaliyot 3: tekshirish va havola. «Qayta yozish» — bor va tekshiruv hammasi null (09-FILTR 27, 28), Amaliyot 2 ga qaytadi ---
const ScreenA3 = (props) => {
  const v0 = useMemo(() => videoOqi(), []);
  const [qator, setQator] = useState(() => (v0.tekshiruv.maxfiyNarsaYoq === true ? Object.fromEntries(TEKSHIR_QATOR.map(r => [r.id, false])) : {}));
  const [vaqtS, setVaqtS] = useState(() => (v0.tekshiruv.vaqt != null ? vaqtYoz(v0.tekshiruv.vaqt) : ''));
  const [kim, setKim] = useState(props.storedAnswer?.kim ?? null);
  const kimRef = useRef(kim); kimRef.current = kim;
  const tanla = (id, x) => {
    const yangi = { ...qator, [id]: x }; setQator(yangi);
    const toliq = TEKSHIR_QATOR.every(r => typeof yangi[r.id] === 'boolean');
    const bir = TEKSHIR_QATOR.some(r => yangi[r.id] === true);
    videoYoz(v => ({ ...v, tekshiruv: { ...v.tekshiruv, maxfiyNarsaYoq: bir ? false : toliq ? true : null } }));
  };
  const vaqtYozKalit = (s) => { setVaqtS(s); const n = vaqtOqi(s); videoYoz(v => ({ ...v, tekshiruv: { ...v.tekshiruv, vaqt: n, sigdi: n == null ? null : n <= 180 } })); };
  const qaytaYoz = () => { videoYoz(v => ({ ...v, bor: null, tekshiruv: { ...BOSH_TEK } })); setQator({}); setVaqtS(''); if (props.goTo) props.goTo(SCREEN_META.findIndex(m => m.id === 'a2')); };
  const toliq = TEKSHIR_QATOR.every(r => typeof qator[r.id] === 'boolean');
  const korindi = TEKSHIR_QATOR.some(r => qator[r.id] === true);
  const sek = vaqtOqi(vaqtS);
  const v = videoOqi();
  const uchala = v.tekshiruv.ovozBor === true && v.tekshiruv.maxfiyNarsaYoq === true && v.tekshiruv.sigdi === true;
  const steps = [
    { h: { uz: "Ko'rish", ru: 'Просмотр' }, t: <>{tr({ uz: "videoni boshidan oxirigacha bir marta ko'ring (2-darsdagidek). Shoshilmang: shubhali joyda to'xtatib qarang.", ru: 'посмотрите видео от начала до конца один раз (как на 2-м уроке). Не спешите: в сомнительном месте остановите и посмотрите.' })}</> },
    { h: { uz: 'Maxfiy joylar', ru: 'Секретные места' }, t: <>{tr({ uz: 'har biriga tanlang:', ru: 'выберите для каждого:' })}
      <span className="vp-tk">{TEKSHIR_QATOR.map((r, i) => (
        <span key={r.id} className={cx('vp-tk-q', qator[r.id] === false && 'ok', qator[r.id] === true && 'err')}>
          <span className="vp-tk-t"><i>{i + 1}</i>{tx(r.t)}{r.izoh && <em>{tr(r.izoh)}</em>}</span>
          <Tanlov chorla qiymat={qator[r.id] ?? null} onTanla={(x) => tanla(r.id, x)} variantlar={r.ovoz ? [{ k: false, t: { uz: 'Aytilmadi', ru: 'Не сказано' } }, { k: true, t: { uz: 'Aytildi', ru: 'Сказано' }, xavf: true }] : [{ k: false, t: { uz: "Ko'rinmadi", ru: 'Не видно' } }, { k: true, t: { uz: "Ko'rindi", ru: 'Видно' }, xavf: true }]} />
        </span>))}</span>
      {korindi && <span className="vp-qayta fade-step"><Kulrang>{tr({ uz: "Bu videoni hech kimga yubormang va o'chiring; ekranni tayyorlab, qayta yozing.", ru: 'Никому не отправляйте это видео и удалите его; подготовьте экран и перезапишите.' })}</Kulrang>
        {qator.kod === true && <b className="vp-qalin">{tr({ uz: 'Haqiqiy maxfiy kalit yoki token yozuvga tushgan bo\'lsa — videoni o\'chiring va Mentorga ayting: kalitni yangilash kerakligini birga tekshirasiz.', ru: 'Если в запись попал настоящий секретный ключ или токен — удалите видео и скажите наставнику: вместе проверите, нужно ли обновить ключ.' })}</b>}
        <QTugma className="vp-halqa" onClick={qaytaYoz}>{tr({ uz: 'Qayta yozish', ru: 'Перезаписать' })}</QTugma></span>}</> },
    { h: { uz: 'Vaqt', ru: 'Время' }, t: <>{tr({ uz: "video oynasida yozilgan uzunlikni ko'ring va yozing:", ru: 'посмотрите длину в окне видео и запишите:' })}
      <span className="vp-vaqt"><input type="text" inputMode="numeric" maxLength={6} value={vaqtS} placeholder={tr({ uz: 'uzunligi, m:ss', ru: 'длина, м:сс' })} aria-label={tr({ uz: 'uzunligi, m:ss', ru: 'длина, м:сс' })} onChange={e => vaqtYozKalit(e.target.value.replace(/[^\d:.,]/g, ''))} />
        {sek != null && <span className={cx('vp-vaqt-b fade-step', sek > 180 && 'osh')}>{sek <= 180 ? tr({ uz: '3 daqiqagacha', ru: 'до 3 минут' }) : tr({ uz: '3 daqiqadan oshdi', ru: 'больше 3 минут' })}</span>}</span>
      {sek != null && sek > 180 && <Kulrang>{tr({ uz: "Qaysi bo'lak uzun chiqdi? Vaqt bo'lsa, o'shani qisqartirib qayta yozing.", ru: 'Какая часть вышла длинной? Если есть время, сократите её и перезапишите.' })}</Kulrang>}</> },
    { h: { uz: "Kim ko'radi", ru: 'Кто увидит' }, t: <>{tr({ uz: 'tanlang:', ru: 'выберите:' })}
      <Tanlov chorla qiymat={kim} onTanla={setKim} variantlar={[{ k: 'rozi', t: { uz: 'Ota-onam rozi', ru: 'Родители согласны' } }, { k: 'hali', t: { uz: 'Hali gaplashmadim', ru: 'Ещё не говорил' } }]} />
      {kim === 'rozi' && <span className="fade-step"><Band>{tr({ uz: "Videoni ota-onangiz bilan tanlagan, faqat havola bilan ko'rinadigan joyga yuklang — hamma ko'radigan joyga emas.", ru: 'Загрузите видео в выбранное с родителями место, видимое только по ссылке, — не туда, где его видят все.' })}</Band><b className="vp-qalin">{tr({ uz: "Havolani dars formasiga, sinf chatiga va repo'ga yozmang; kimga yuborishni ota-onangiz bilan hal qilasiz.", ru: 'Не пишите ссылку в форму урока, чат класса и репозиторий; кому отправить, решаете с родителями.' })}</b></span>}
      {kim === 'hali' && <Band>{tr({ uz: "Video kompyuteringizda fayl bo'lib qoladi — bu ham tayyor natija. Kimgadir ko'rsatish — ota-onangiz roziligi bilan.", ru: 'Видео остаётся файлом на компьютере — это тоже готовый результат. Показать кому-то — с согласия родителей.' })}</Band>}</> }
  ];
  const done = !!props.storedAnswer?.solved;
  const natija = (
    <div className="vp-a3n">
      <span className="vp-tkk">
        {TEKSHIR_QATOR.map((r, i) => { const o = done ? qator[r.id] : false; return <span key={r.id} className={cx('vp-tkk-q', o === false && 'ok', o === true && 'err')}><i>{i + 1}</i><span>{tx(r.t)}</span><b>{o == null ? '' : o ? (r.ovoz ? tr({ uz: 'Aytildi', ru: 'Сказано' }) : tr({ uz: "Ko'rindi", ru: 'Видно' })) : (r.ovoz ? tr({ uz: 'Aytilmadi', ru: 'Не сказано' }) : tr({ uz: "Ko'rinmadi", ru: 'Не видно' }))}</b></span>; })}
      </span>
      <FaylKarta holat={kim === 'rozi' ? 'havola' : 'kompyuter'} />
    </div>
  );
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 3 · o'z tekshiruvingiz", ru: 'Практика 3 · ваша проверка' }}
      title={{ uz: <>Videoni o'zingiz ko'rib, <span className="italic" style={{ color: T.accent }}>kim ko'rishini</span> hal qiling.</>, ru: <>Посмотрите видео сами и решите, <span className="italic" style={{ color: T.accent }}>кто его увидит</span>.</> }}
      vazifa={{ uz: "Videoda maxfiy narsa yo'q, u 3 daqiqaga sig'adi va kim ko'rishini siz ota-onangiz bilan hal qilasiz.", ru: 'В видео нет секретного, оно укладывается в 3 минуты, и кто его увидит, вы решаете с родителями.' }}
      mentor={{ uz: "Videoni boshidan oxirigacha o'zingiz ko'rasiz — bu tekshiruv sizniki; «1 · Ko'rish»dan boshlang.", ru: 'Вы сами смотрите видео от начала до конца — это ваша проверка; начните с «1 · Просмотр».' }}
      steps={steps} natija={natija} natijaYorliq={done ? { uz: 'sizning tekshiruvingiz', ru: 'ваша проверка' } : NATIJA_YORLIQ}
      boshQadam={() => (v0.tekshiruv.maxfiyNarsaYoq === null ? 1 : steps.length)}
      qulf={(n) => (n === 1 && !toliq) || (n === 3 && kim === null)}
      ulgurQadam={2} ulgurShart={() => toliq}
      extra={() => ({ kim: kimRef.current })}
      ulgur={{ uz: "Ulgurmasangiz: 2-qadam — eng muhimi: «Davom etish» shundan keyin ochiladi. Vaqt va havola — dars oxirida. Maxfiy narsa ko'ringan video darsdan keyin qolmaydi: o'chiring, «Qayta yozish»ni bosing, hech kimga yubormang; qayta yozish — keyin.", ru: 'Не успеваете: 2-й шаг — самый важный: после него откроется «Продолжить». Время и ссылка — в конце урока. Видео, где видно секретное, после урока не остаётся: удалите, нажмите «Перезаписать», никому не отправляйте; перезапись — потом.' }}
      doneText={uchala ? { uz: "Video tekshirildi: maxfiy narsa yo'q, 3 daqiqaga sig'di.", ru: 'Видео проверено: секретного нет, уложились в 3 минуты.' } : { uz: 'Tekshiruv belgilandi — tuzatiladigan joy yozuvda turibdi.', ru: 'Проверка отмечена — то, что нужно исправить, указано в записи.' }}
      ustoz={[
        { uz: "Videoda haqiqiy maxfiy kalit yoki token ko'ringan bo'lsa — o'quvchi sizga aytadi; kalitni yangilash kerakligini birga tekshiring (13-Modul odati: yangi kalit `.env` da va Render'da) — video yuborilmagan bo'lsa ham, faylda nusxasi bor.", ru: 'Если в видео виден настоящий секретный ключ или токен — ученик скажет вам; вместе проверьте, нужно ли обновить ключ (привычка 13-го модуля: новый ключ в `.env` и в Render) — даже если видео не отправлено, копия есть в файле.' },
        { uz: "Havola masalasida o'quvchini shoshirmang: «Hali gaplashmadim» — to'g'ri javob. Kim havola qilganini so'ramang va sanamang.", ru: 'Не торопите ученика со ссылкой: «Ещё не говорил» — правильный ответ. Не спрашивайте и не считайте, кто сделал ссылку.' }
      ]} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); orqa yuz neytral (P10)
const FLASHCARDS = [
  { front: { uz: 'Video-portfolio nima?', ru: 'Что такое видео-портфолио?' }, back: { uz: "Bu kursda — o'zingiz va mahsulotingiz haqidagi 3 daqiqagacha video", ru: 'В этом курсе — видео о вас и вашем продукте до 3 минут' }, note: { uz: "Uch bo'lak: kimman, nima qurdim, qanday ishlayman", ru: 'Три части: кто я, что я построил, как я работаю' } },
  { front: { uz: '«Kimman» bo\'lagida nima aytiladi?', ru: 'Что говорится в части «Кто я»?' }, back: { uz: 'Kim ekaningiz va nima qilishingiz — bir gapda', ru: 'Кто вы и чем занимаетесь — одним предложением' }, note: { uz: 'Ism ixtiyoriy; maktab nomi va telefon kerak emas', ru: 'Имя по желанию; школа и телефон не нужны' } },
  { front: { uz: '«Nima qurdim» bo\'lagi nimadan boshlanadi?', ru: 'С чего начинается часть «Что я построил»?' }, back: { uz: 'Hikoyangizdagi bitta lahzadan', ru: 'С одного момента из вашей истории' }, note: { uz: 'Keyin ishlayotgan demo', ru: 'Потом работающее демо' } },
  { front: { uz: '«Qanday ishlayman» bo\'lagida nima aytiladi?', ru: 'Что говорится в части «Как я работаю»?' }, back: { uz: 'Bitta qaror va uning sababi', ru: 'Одно решение и его причина' }, note: { uz: "Funksiyalar ro'yxati emas", ru: 'Не список функций' } },
  { front: { uz: "Videoda yuzingiz ko'rinishi shartmi?", ru: 'Обязательно ли показывать лицо в видео?' }, back: { uz: "Yo'q, ixtiyoriy", ru: 'Нет, по желанию' }, note: { uz: 'Ekran yozuvi va ovoz yetarli', ru: 'Хватит записи экрана и голоса' } },
  { front: { uz: 'Yozishdan oldin ekranda nimani yopasiz?', ru: 'Что вы закрываете на экране перед записью?' }, back: { uz: 'Kod oynasi va `.env`, Neon jadvali, chat oynalari', ru: 'Окно кода и `.env`, таблицу Neon, окна чата' }, note: { uz: 'Yozuvga tushgan narsa faylda qoladi', ru: 'Что попало в запись, остаётся в файле' } },
  { front: { uz: "Login ko'rinmasligi uchun nima qilasiz?", ru: 'Что сделать, чтобы не был виден логин?' }, back: { uz: 'Namuna akkaunt bilan oldindan kirasiz', ru: 'Заранее войти с демо-аккаунтом' }, note: { uz: '6-darsdagi namuna akkaunt', ru: 'Демо-аккаунт из 6-го урока' } },
  { front: { uz: 'Video fayl qayerda saqlanadi?', ru: 'Где хранится видеофайл?' }, back: { uz: 'Repo papkasidan tashqarida', ru: 'Вне папки репозитория' }, note: { uz: '`git status` da ko\'rinmasligi kerak', ru: 'В `git status` его быть не должно' } },
  { front: { uz: "Video 3 daqiqaga sig'ganini qanday bilasiz?", ru: 'Как узнать, что видео уложилось в 3 минуты?' }, back: { uz: 'Video oynasidagi vaqtga qaraysiz', ru: 'Смотрите на время в окне видео' }, note: { uz: "Tekshiruvni o'zingiz qilasiz", ru: 'Проверку делаете сами' } },
  { front: { uz: "Tekshiruvda maxfiy narsa ko'rindi. Nima qilasiz?", ru: 'При проверке видно секретное. Что делать?' }, back: { uz: "Videoni o'chirib, ekranni tayyorlab, qayta yozasiz", ru: 'Удалить видео, подготовить экран и перезаписать' }, note: { uz: 'Hech kimga yubormaysiz; maxfiy kalit bo\'lsa — Mentorga aytasiz', ru: 'Никому не отправлять; если это секретный ключ — сказать наставнику' } },
  { front: { uz: "Videoni kimgadir ko'rsatish uchun nima kerak?", ru: 'Что нужно, чтобы кому-то показать видео?' }, back: { uz: 'Ota-onangiz roziligi', ru: 'Согласие родителей' }, note: { uz: "Joy — faqat havola bilan ko'rinadigan", ru: 'Место — видимое только по ссылке' } },
  { front: { uz: 'Video havolasi qayerga yoziladi?', ru: 'Куда записывается ссылка на видео?' }, back: { uz: "Hech qayerga: dars formasiga ham, sinf chatiga ham, repo'ga ham", ru: 'Никуда: ни в форму урока, ни в чат класса, ни в репозиторий' }, note: { uz: 'Kimga yuborishni ota-onangiz bilan hal qilasiz', ru: 'Кому отправить, решаете с родителями' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('vp-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="vp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (texnik darslar standarti; SABOQ E 50 — «Bugungi asosiy fikr» yo'q). Sarlavha pm-m12d9-video va blok bayroqlaridan, har holat rost (E 54) =====
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
  const v = videoOqi();
  const t = v.tekshiruv;
  const uch = [t.ovozBor, t.maxfiyNarsaYoq, t.sigdi];
  const a3 = !!answers[SCREEN_META.findIndex(m => m.id === 'a3')]?.solved;
  const sarlavha = v.bor === true && uch.every(x => x === true) ? { uz: 'Video-portfolio tayyor — o\'zingiz tekshirdingiz.', ru: 'Видео-портфолио готово — вы проверили его сами.' }
    : v.bor === true && uch.some(x => x === false) ? { uz: 'Video yozildi — tekshiruvda tuzatiladigan joy chiqdi.', ru: 'Видео записано — при проверке нашлось, что исправить.' }
      : v.bor === true ? { uz: 'Video yozildi — tekshiruv hali tugamagan.', ru: 'Видео записано — проверка ещё не закончена.' }
        : bolakBor(v.bolaklar) ? { uz: 'Ssenariy yozildi — video hali yozilmagan.', ru: 'Сценарий написан — видео ещё не записано.' }
          : { uz: 'Video-portfolio ssenariysi hali yozilmagan.', ru: 'Сценарий видео-портфолио ещё не написан.' };
  const RECAP = [
    { uz: "Bu kursda video-portfolio — o'zingiz va mahsulotingiz haqidagi 3 daqiqagacha video.", ru: 'В этом курсе видео-портфолио — видео о вас и вашем продукте до 3 минут.' },
    { uz: "Video uch bo'lakdan iborat: kimman, nima qurdim va qanday ishlayman.", ru: 'Видео состоит из трёх частей: кто я, что я построил и как я работаю.' },
    { uz: "Yuz va ism — ixtiyoriy: ekran yozuvi va ovoz mahsulotni ko'rsatadi.", ru: 'Лицо и имя — по желанию: продукт покажут запись экрана и голос.' },
    { uz: 'Yozishdan oldin `.env`, login, boshqa odamlar ma\'lumoti va chat oynalari yopiladi.', ru: 'Перед записью закрывают `.env`, логин, данные других людей и окна чата.' },
    { uz: "Video repo'ga qo'shilmaydi; kimga ko'rsatishni ota-onangiz bilan hal qilasiz.", ru: 'Видео не добавляется в репозиторий; кому показать, решаете с родителями.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cx('vp-yakun', !a3 && 'yoq-chip')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Uch blok bajarildi', ru: 'Три блока выполнены' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(r => tx(r))}
          uyga={null}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        >
          <p className="vp-keyingi fade-up d4">{tr({ uz: <>Keyingi dars — <b>«Birinchi buyurtmani qayerdan topasiz?»</b></>, ru: <>Следующий урок — <b>«Birinchi buyurtmani qayerdan topasiz?»</b></> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function VideoPortfolioLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === VIDEO SAHNASI (9-dars) — faqat qolip tokenlari (D3), emoji yo'q (D4); holat ranglari: ok yopildi/sig'di · err ko'rinib qoldi/oshdi · accent joriy · ink2 kutish === */
        .vp-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: vp-puls 2.2s ease-out .3s 3; }
        @keyframes vp-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .vp-chorla .q-chip:not(:disabled), .vp-chorla .q-variant, .vp-chorla-b .vp-tg:not(:disabled), .vp-cl.vp-chorla .vp-cl-q:not(.on) { border-color: ${fon(T.accent, 0.6)}; animation: vp-chorla 1.8s ease-out .5s 2; }
        .vp-chorla .q-chip:nth-child(2), .vp-chorla .q-variant:nth-child(2), .vp-chorla-b .vp-tg:nth-child(2), .vp-cl .vp-cl-q:nth-child(2) { animation-delay: .75s; }
        .vp-chorla .q-variant:nth-child(3), .vp-cl .vp-cl-q:nth-child(3) { animation-delay: 1s; } .vp-cl .vp-cl-q:nth-child(4) { animation-delay: 1.25s; }
        @keyframes vp-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .vp-hook .q-kirish .zoomable:not(.zoom-on) > .zoom-btn { right: auto; left: calc(50% - 52px); top: 34px; } /* P7: ⛶ laptop burchagida, variant ustida emas */
        @media (max-width: 860px) { .vp-hook .q-kirish .zoomable:not(.zoom-on) > .zoom-btn { left: auto; right: 8px; top: 34px; } }
        .vp-hook.vp-k-faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: vp-chorla 1.8s ease-out .5s 2; }
        .vp-hook.vp-k-faol .q-variant:nth-child(2) { animation-delay: .8s; } .vp-hook.vp-k-faol .q-variant:nth-child(3) { animation-delay: 1.1s; }
        .vp-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .vp-bash-ix b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .vp-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .vp-x-tx b { color: ${T.ink}; } .q-xulosa .vp-x-tx.ok, .q-xulosa .vp-x-tx.ok b { color: ${T.ok}; } .q-xulosa .vp-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .vp-x-m { display: block; }
        .q-xulosa .vp-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.vp-ipucha, p.vp-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: ${T.ink2}; }
        p.vp-ipucha i, p.vp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; flex: none; }
        p.vp-fc-ipucha { align-self: center; }
        .vp-ustoz { display: flex; flex-direction: column; gap: 5px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .vp-ustoz b { color: ${T.ink}; font-size: 12.5px; }
        /* Laptop */
        .vp-lap { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 0; width: 100%; max-width: 560px; margin: 0 auto; }
        .vp-lap-y { align-self: flex-start; margin-bottom: 6px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .vp-lap-y b { font-weight: 700; color: ${T.ink2}; }
        .vp-lap-ek { position: relative; padding: 26px 10px 10px; border-radius: 14px 14px 4px 4px; background: ${T.ink}; min-height: 230px; }
        .vp-lap-asos { display: block; height: 10px; margin: 0 -18px; border-radius: 0 0 14px 14px; background: ${T.line}; }
        .vp-lap.vp-lap-chorla .vp-lap-ek { animation: vp-puls 2.2s ease-out .4s 2; }
        .vp-lap.vp-lap-kichik { max-width: 400px; }
        .vp-lap.vp-lap-kichik .vp-lap-ek { min-height: 170px; }
        .vp-rec { position: absolute; top: 6px; left: 12px; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${fon('#FFFFFF', 0.75)}; }
        .vp-rec i { width: 10px; height: 10px; border-radius: 50%; background: ${T.err}; opacity: .5; }
        .vp-rec.on i { opacity: 1; animation: vp-rec 1s ease-in-out infinite; }
        @keyframes vp-rec { 50% { opacity: .35; } }
        .vp-br { display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; background: ${T.paper}; min-height: 190px; }
        .vp-br-url { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .vp-br-url i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; flex: none; }
        .vp-br-url em { margin-left: 8px; flex: 1; min-width: 0; padding: 2px 10px; border-radius: 999px; background: ${T.paper}; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .vp-br-b { flex: 1; display: flex; }
        .vp-br-oyna { background: ${CODE.bg}; }
        .vp-kam { position: absolute; right: 14px; bottom: 14px; width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${T.bg}; border: 2px solid ${T.line}; }
        .vp-kam b { font-size: 20px; color: ${T.ink2}; }
        .vp-kam.ixtiyoriy { background: ${fon(T.paper, 0.6)}; border: 2px dashed ${T.ink2}; }
        .vp-kam em { position: absolute; top: calc(100% + 4px); right: -6px; white-space: nowrap; font-style: normal; font-size: 12px; font-weight: 700; color: ${T.paper}; background: ${fon(T.ink, 0.85)}; padding: 2px 8px; border-radius: 999px; }
        .vp-ovoz { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: ${T.ink2}; }
        .vp-ovoz-b { flex: 1; display: flex; align-items: center; gap: 3px; height: 20px; }
        .vp-ovoz-b i { flex: 1; height: 3px; border-radius: 2px; background: ${T.line}; }
        .vp-ovoz.on .vp-ovoz-b i { background: ${T.accent}; animation: vp-tolqin .9s ease-in-out infinite alternate; }
        @keyframes vp-tolqin { from { height: 3px; } to { height: 18px; } }
        .vp-ovoz em { font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.accent}; }
        /* «Maydon Jamoa» maketi (soddalashtirilgan) */
        .vp-mj { flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; width: 100%; }
        .vp-mj-bosh { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; font-size: 14px; }
        .vp-mj-bosh span { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .vp-mj-hero { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 6px 0; }
        p.vp-mj-h { margin: 0; font-size: 17px; font-weight: 800; line-height: 1.3; color: ${T.ink}; max-width: 340px; }
        .vp-mj-cta, .vp-mj-btn { display: inline-block; padding: 6px 14px; border-radius: 999px; color: #fff; font-size: 13px; font-weight: 700; }
        .vp-mj-btn.on { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .vp-mj-oyin { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.bg}; align-items: flex-start; }
        p.vp-mj-e { margin: 0; font-size: 14px; font-weight: 700; color: ${T.ink}; }
        p.vp-mj-son { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 18px; color: ${T.ink}; white-space: nowrap; }
        p.vp-mj-son b.yangi { color: ${T.ok}; animation: vp-yon 1s ease-out; }
        @keyframes vp-yon { 0% { background: ${T.okFon}; } 100% { background: transparent; } }
        /* Vaqt chizig'i */
        .vp-ch { display: flex; flex-direction: column; gap: 4px; width: 100%; }
        .vp-ch-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .vp-ch-iz { position: relative; display: flex; gap: 4px; min-height: 52px; padding-right: 2px; }
        .vp-ch-b { position: relative; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 6px 8px; border-radius: 8px; min-width: 0; font-size: 14px; line-height: 1.3; transition: background .3s, border-color .3s; }
        .vp-ch-b.bosh { border: 1.5px dashed ${T.ink2}; background: transparent; }
        .vp-ch-b.oq { border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .vp-ch-b.joriy { border: 1.5px solid ${T.accent}; background: ${T.accentSoft}; }
        .vp-ch-b.ok { border: 1.5px solid ${T.ok}; background: ${T.okFon}; }
        .vp-ch-b.xato { border: 1.5px dashed ${T.err}; background: ${T.errFon}; }
        .vp-ch-b b { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .vp-ch-b.ok b { color: ${T.ok}; }
        .vp-ch-b span { font-size: 14px; color: ${T.ink}; }
        .vp-ch-b em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .vp-ch-osh { position: absolute; top: -3px; bottom: -3px; right: 0; background: ${fon(T.err, 0.22)}; border-left: 2px solid ${T.err}; border-radius: 0 8px 8px 0; pointer-events: none; }
        .vp-ch-t { position: relative; display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; height: 16px; }
        .vp-ch-t span[style] { position: absolute; transform: translateX(-50%); color: ${T.err}; font-weight: 700; }
        .vp-ch-reja { font-size: 12.5px; color: ${T.ink2}; }
        .vp-ch-tush { position: absolute; left: 30%; top: -4px; bottom: -4px; width: 40%; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0 8px; border-radius: 8px; background: ${T.errFon}; border: 1.5px solid ${T.err}; color: ${T.err}; font-size: 13.5px; font-weight: 700; text-align: center; animation: vp-tush 1.3s ease both; z-index: 2; }
        .vp-ch-tush.uzuq { background: ${T.paper}; border: 1.5px dashed ${T.ink2}; color: ${T.ink2}; }
        .vp-ch-tush.qulf { background: ${T.errFon}; }
        @keyframes vp-tush { 0% { transform: translateY(-34px); opacity: 0; } 25% { transform: none; opacity: 1; } 75% { transform: none; opacity: 1; } 100% { transform: translateY(-34px); opacity: 0; } }
        /* Fayl kartasi */
        .vp-fayl { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .vp-fayl-ic { width: 30px; height: 36px; border-radius: 5px; background: ${T.bg}; border: 1.5px solid ${T.ink2}; display: flex; align-items: center; justify-content: center; flex: none; }
        .vp-fayl-ic i { width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 9px solid ${T.ink2}; }
        .vp-fayl-t { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .vp-fayl-t b { font-size: 14px; color: ${T.ink}; }
        .vp-fayl-s { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: ${T.ink2}; }
        .vp-fayl-s.h { color: ${T.ok}; font-weight: 700; }
        /* 1-ekran */
        .vp-reja { display: flex; flex-direction: column; gap: 12px; }
        p.vp-reja-p { margin: 0; font-size: 12.5px; color: ${T.ink2}; line-height: 1.6; }
        p.vp-reja-p.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        /* 2-ekran: karta dastasi va uchish */
        .vp-s2 { position: relative; display: flex; flex-direction: column; gap: 14px; }
        .vp-s2.tug { padding-top: 6px; }
        .vp-k-zona { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .vp-k-zona.yopiq { opacity: .55; }
        .vp-k-karta { position: relative; width: min(420px, 100%); padding: 16px 20px; border-radius: 14px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 6px 6px 0 -1px ${T.bg}, 6px 6px 0 0 ${T.line}, 0 14px 30px -18px ${fon(T.ink, 0.35)}; animation: vp-kir .35s ease both; }
        .vp-k-karta p { margin: 4px 0 0; font-size: 17px; font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .vp-k-karta.ket { animation: vp-ket .42s ease forwards; }
        .vp-k-karta.yashir { visibility: hidden; }
        .vp-k-n { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        @keyframes vp-kir { from { transform: translateY(10px); opacity: 0; } }
        @keyframes vp-ket { to { transform: translateX(60px) scale(.9); opacity: 0; filter: grayscale(1); } }
        .vp-k-btn { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .vp-tg { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; padding: 10px 20px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .vp-tg:hover:not(:disabled) { border-color: ${T.accent}; color: ${T.accent}; }
        .vp-tg:disabled { opacity: .5; cursor: default; }
        .vp-tg.silk { animation: vp-silk .45s ease; border-color: ${T.err}; }
        @keyframes vp-silk { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .vp-chetga { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
        .vp-chetga-k { display: inline-flex; flex-direction: column; gap: 1px; padding: 5px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; max-width: 240px; }
        .vp-chetga-k s { font-size: 13px; color: ${T.ink2}; }
        .vp-chetga-k em { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .vp-uchar { position: absolute; z-index: 20; pointer-events: none; display: flex; align-items: center; padding: 6px 10px; border-radius: 10px; background: ${T.accentSoft}; border: 2px solid ${T.accent}; box-shadow: 0 16px 30px -14px ${fon(T.ink, 0.4)}; overflow: hidden; transition: left .6s cubic-bezier(.45,.05,.3,1), top .6s cubic-bezier(.45,.05,.3,1), width .6s cubic-bezier(.45,.05,.3,1), height .6s cubic-bezier(.45,.05,.3,1); }
        .vp-uchar span { font-size: 14px; font-weight: 700; color: ${T.ink}; line-height: 1.3; }
        /* 5-ekran: kadrlar */
        .vp-s5-h { display: flex; flex-direction: column; gap: 10px; }
        .vp-s5-tug { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; align-items: start; }
        .vp-yr { display: flex; flex-direction: column; gap: 7px; }
        .vp-yr-h { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 10px; font-size: 14px; }
        .vp-yr-h em { font-style: normal; font-size: 13px; font-weight: 700; color: ${T.accent}; white-space: nowrap; }
        .vp-yr-q { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 8px 12px; border-radius: 10px; font-size: 14px; line-height: 1.35; }
        .vp-yr-q.bosh { border: 1.5px dashed ${T.ink2}; color: ${T.ink2}; }
        .vp-yr-q.bosh i { font-style: normal; font-size: 12px; font-weight: 700; }
        .vp-yr-q.ok { border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; }
        .vp-yr-q.ok b { color: ${T.ok}; }
        .vp-yr-q.yangi { animation: vp-yangi 1s ease-out; }
        @keyframes vp-yangi { 0% { background: ${T.okFon}; border-color: ${T.ok}; } 100% { background: ${T.paper}; } }
        .vp-joy { position: relative; font: inherit; text-align: left; color: inherit; background: transparent; border: 1.5px solid transparent; border-radius: 8px; padding: 6px 8px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; }
        .vp-joy:hover:not(:disabled) { border-color: ${fon(T.accent, 0.7)}; }
        .vp-joy:disabled { cursor: default; }
        .vp-joy.xira > :not(.vp-joy-y) { filter: blur(3px); opacity: .45; }
        .vp-joy.kul { border-color: ${T.ink2}; animation: vp-silk .45s ease; }
        .vp-joy-y { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); white-space: nowrap; font-style: normal; font-size: 13px; font-weight: 700; color: ${T.ok}; background: ${T.paper}; border: 1.5px solid ${T.ok}; border-radius: 999px; padding: 3px 10px; z-index: 2; }
        .vp-kod { flex: 1; display: grid; grid-template-columns: 110px 1fr; gap: 8px; padding: 8px; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
        .vp-kod-f span { display: block; color: ${CODE.punct}; } .vp-kod-f span.o { color: ${CODE.attr}; }
        .vp-kod-e span { display: flex; align-items: center; gap: 6px; } .vp-kod-e code { color: ${CODE.attr}; font-family: inherit; }
        .vp-kod-e i, .vp-neon-r i, .vp-chatk-x i, .vp-s7-env i { display: inline-block; height: 8px; width: 90px; border-radius: 4px; background: ${fon(T.ink2, 0.45)}; }
        .vp-kod-tab { color: ${CODE.text}; font-size: 11.5px; padding: 2px 8px; border-radius: 6px 6px 0 0; background: ${fon('#FFFFFF', 0.08)}; align-self: flex-start; }
        .vp-kir { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 12px; }
        .vp-kir-m span { display: flex; justify-content: space-between; gap: 18px; min-width: 220px; padding: 7px 10px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 13px; color: ${T.ink2}; }
        .vp-kir-m em { font-style: normal; color: ${T.ink}; }
        .vp-kir-btn { background: ${MAYDON_RANG}; color: #fff; font-weight: 700; font-size: 13px; padding: 6px 18px; border-radius: 999px; }
        .vp-neon { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 10px; }
        .vp-neon-h { font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .vp-neon-t { gap: 5px; }
        .vp-neon-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .vp-neon-r { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 4px 6px; border-bottom: 1px solid ${T.line}; }
        .vp-neon-r.h code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .vp-chatk { flex: 1; position: relative; display: flex; }
        .vp-chatk-d { flex: 1; }
        .vp-chatk-x { position: absolute; right: 10px; bottom: 10px; width: 160px; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 22px -12px ${fon(T.ink, 0.4)}; }
        .vp-chatk-x b { font-size: 12.5px; color: ${T.ink}; }
        /* Testlar: javobdan keyingi kichik vizual */
        .vp-tv { margin-top: 10px; max-width: 560px; }
        .vp-s7 { position: relative; flex: 1; display: flex; }
        .vp-s7-env { position: absolute; inset: 10px 10px auto auto; display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 8px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .vp-s7-env code { color: ${CODE.attr}; font-family: inherit; }
        /* Amaliyot bloklari */
        .vp-blok { display: contents; }
        .vp-mik, .vp-qulf { flex: none; display: inline-block; vertical-align: -2px; }
        .vp-nusxa { font-family: 'Manrope', sans-serif; }
        .vp-blok .q-blok { display: flex; flex-direction: column; }
        .vp-blok .q-blok > .q-split { order: 2; } .vp-blok .q-blok > p.vp-vazifa { order: 1; } .vp-blok .q-blok > p.vp-ortda, .vp-blok .q-blok > p.vp-ulgur, .vp-blok .q-blok > .vp-ustoz { order: 3; }
        p.vp-vazifa { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px ${fon(T.accent, 0.25)}; font-size: 14px; font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        .vp-ub { display: inline; } .vp-ub-d { display: inline-flex; vertical-align: middle; }
        .vp-ub > .vp-ix, .vp-ub > .vp-ub-k { display: flex; margin-top: 8px; } .vp-ub > .vp-ub-k { display: block; }
        .vp-ch-b { overflow: hidden; }
        .vp-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .vp-blok.tugadi .q-blok-qadamlar { display: none; }
        .vp-band, .vp-kulrang, .vp-xato, .vp-yordam-ust, .vp-yordam, .vp-ub, .vp-tm, .vp-tayyor, .vp-cl, .vp-tk, .vp-qayta, .vp-vaqt, .vp-prompt, .vp-ps, .vp-manba, .vp-tanlov { display: block; }
        .vp-band { margin-top: 6px; }
        .vp-kulrang { margin-top: 6px; font-size: 12.5px; color: ${T.ink2}; }
        .vp-xato { margin-top: 6px; font-size: 13px; font-weight: 700; color: ${T.err}; }
        .vp-xato.yum { color: ${T.ink}; }
        .vp-xato em { display: block; font-style: normal; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .vp-qalin { display: block; margin-top: 6px; font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        p.vp-ortda, p.vp-ulgur { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        p.vp-ortda .qcode { white-space: normal; overflow-wrap: anywhere; }
        p.vp-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.paper}; }
        .q-blok-t .qcode { white-space: normal; overflow-wrap: anywhere; }
        .vp-yordam-ust { margin-top: 0; }
        .vp-yordam { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .vp-yordam > b { display: block; margin-bottom: 6px; font-size: 12.5px; color: ${T.ink2}; }
        .vp-ss { display: flex; flex-direction: column; gap: 6px; }
        .vp-a1n .vp-ss-q { padding: 6px 10px; gap: 2px; }
        .vp-a1n .vp-ss-q:first-child { padding-right: 40px; }
        .vp-a1n .vp-ss-q b { display: flex; justify-content: space-between; gap: 8px; }
        .vp-ss-q { display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .vp-ss-q b { font-size: 13px; font-weight: 800; color: ${T.accent}; }
        .vp-ss-g { font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .vp-ss-q em { font-style: normal; font-weight: 600; font-size: 12px; color: ${T.ink2}; }
        .vp-ss.oq .vp-ss-g { font-size: 15px; overflow-wrap: anywhere; }
        .vp-demo { display: flex; flex-wrap: wrap; gap: 4px; }
        .vp-demo span { font-size: 12.5px; padding: 2px 8px; border-radius: 999px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; white-space: nowrap; }
        .vp-demo span + span::before { content: '›'; margin-right: 6px; color: ${T.ink2}; }
        .vp-ub { margin-top: 8px; }
        .vp-ub > * + * { margin-top: 8px; }
        .vp-ub-d { display: flex; flex-wrap: wrap; gap: 6px 12px; }
        .vp-ub-n { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .vp-ub-n i { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .vp-ub-n.joriy { color: ${T.accent}; } .vp-ub-n.joriy i { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .vp-ub-n.ok { color: ${T.ok}; } .vp-ub-n.ok i { border-color: ${T.ok}; background: ${T.okFon}; }
        .vp-ix { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; font: inherit; font-size: 13.5px; padding: 7px 10px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .vp-ix b { color: ${T.ok}; flex: none; } .vp-ix span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .vp-ix span em { font-style: normal; font-weight: 700; }
        .vp-ix i { font-style: normal; color: ${T.ink2}; flex: none; }
        .vp-ub-k { display: block; padding: 12px; border-radius: 12px; border: 2px solid ${T.accent}; background: ${T.paper}; }
        .vp-ub-k > * + * { margin-top: 8px; }
        .vp-ub-m { display: block; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; padding: 8px 10px; }
        .vp-ub-m:focus-within { border-color: ${T.accent}; }
        .vp-ub-l { display: block; font-size: 12.5px; font-weight: 800; color: ${T.accent}; }
        .vp-ub-m textarea { display: block; width: 100%; resize: vertical; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.45; color: ${T.ink}; padding: 4px 0 0; }
        .vp-manba { display: flex; flex-wrap: wrap; gap: 6px; }
        .vp-manba em { font-style: normal; font-size: 12px; color: ${T.ink2}; padding: 1px 8px; border-radius: 999px; background: ${T.bg}; }
        .vp-ub-btn { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start; }
        .vp-tm { margin-top: 8px; }
        .vp-tm-r { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .vp-tm-b { font-family: 'JetBrains Mono', monospace; }
        .vp-tm-n { display: block; margin-top: 8px; padding: 7px 10px; border-radius: 10px; background: ${T.okFon}; color: ${T.ok}; font-size: 13.5px; font-weight: 700; }
        .vp-tm-n.osh { background: ${T.errFon}; color: ${T.err}; }
        .vp-tayyor { margin-top: 8px; }
        .vp-tayyor-b { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .vp-a1n, .vp-a2n, .vp-a3n { display: flex; flex-direction: column; gap: 12px; }
        .vp-a2n .vp-lap-ek { min-height: 170px; } .vp-a2n .vp-br { min-height: 140px; } .vp-a2n .vp-lap { max-width: 460px; }
        .vp-a2-ost { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; align-items: stretch; }
        .vp-a2-ost.tug { grid-template-columns: 1fr; }
        .vp-term { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; }
        .vp-term p { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${CODE.text}; overflow-wrap: anywhere; }
        .vp-term p.b { color: ${CODE.attr}; } .vp-term p.ok { color: ${CODE.str}; }
        .vp-cl { margin-top: 8px; }
        .vp-cl > * + * { margin-top: 6px; }
        .vp-cl-q { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; font: inherit; font-size: 14px; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .vp-cl-q i { width: 22px; height: 22px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 700; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .vp-cl-q.on { border-color: ${T.ok}; background: ${T.okFon}; } .vp-cl-q.on i { border-color: ${T.ok}; background: ${T.ok}; color: #fff; }
        .vp-prompt { margin-top: 6px; }
        .vp-ps { padding: 4px 8px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; }
        .vp-tanlov { margin-top: 8px; }
        .vp-tanlov .q-chip + .q-chip { margin-left: 6px; }
        .vp-tanlov .q-chip.xavf { background: ${T.errFon}; color: ${T.err}; border-color: ${T.err}; }
        .vp-tk { margin-top: 8px; }
        .vp-tk > * + * { margin-top: 6px; }
        .vp-tk-q { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 10px; padding: 7px 10px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .vp-tk-q.ok { border-color: ${fon(T.ok, 0.5)}; } .vp-tk-q.err { border-color: ${T.err}; background: ${T.errFon}; }
        .vp-tk-q .vp-tanlov { margin-top: 0; }
        .vp-tk-t { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 8px; font-size: 13.5px; color: ${T.ink}; min-width: 0; flex: 1 1 220px; }
        .vp-tk-t i { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .vp-tk-t em { flex-basis: 100%; font-style: normal; font-size: 12px; color: ${T.ink2}; }
        .vp-qayta { margin-top: 8px; padding: 8px 10px; border-radius: 10px; background: ${T.errFon}; }
        .vp-qayta .q-btn { margin-top: 8px; }
        .vp-vaqt { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; }
        .vp-vaqt input { width: 170px; font-family: 'JetBrains Mono', monospace; font-size: 15px; padding: 9px 12px; border-radius: 10px; border: 1.5px solid ${fon(T.accent, 0.6)}; background: ${T.paper}; color: ${T.ink}; outline: 0; }
        .vp-vaqt input:focus { border-color: ${T.accent}; }
        .vp-vaqt-b { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: 700; background: ${T.okFon}; color: ${T.ok}; }
        .vp-vaqt-b.osh { background: ${T.errFon}; color: ${T.err}; }
        .vp-tkk { display: flex; flex-direction: column; gap: 5px; padding: 10px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .vp-tkk-q { display: grid; grid-template-columns: 20px minmax(0, 1fr) auto; gap: 8px; align-items: center; font-size: 13.5px; color: ${T.ink}; }
        .vp-tkk-q i { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .vp-tkk-q b { font-size: 12.5px; padding: 1px 8px; border-radius: 999px; white-space: nowrap; }
        .vp-tkk-q.ok b { background: ${T.okFon}; color: ${T.ok}; } .vp-tkk-q.err b { background: ${T.errFon}; color: ${T.err}; }
        /* Kartochka (F-1008-593): orqa yuz — neytral to'q, zarg'aldoq soya yo'q */
        .vp-flash { display: flex; flex-direction: column; gap: 10px; }
        .vp-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: vp-puls 1.8s ease-out .4s 3; }
        .vp-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .vp-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        /* Yakun: ✓ yorliq faqat A3 bajarilganda; «Keyingi dars» nishonlardan oldin */
        .vp-yakun .q-yakun { display: flex; flex-direction: column; }
        .vp-yakun .q-yakun > .ach-coll { order: 5; }
        .vp-yakun .q-yakun > .vp-keyingi { order: 4; }
        .vp-yakun.yoq-chip .done-chip { display: none; }
        p.vp-keyingi { margin: 0; padding: 12px 16px; border-radius: 14px; background: ${T.paper}; font-size: 14.5px; color: ${T.ink}; }
        .lesson-root :has(.zoom-on), .q-fokus:has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 640px) {
          .vp-s5-tug, .vp-a2-ost { grid-template-columns: 1fr; }
          .vp-kod { grid-template-columns: 1fr; }
          .vp-kir-m span { min-width: 0; }
          .vp-lap-ek { min-height: 200px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vp-halqa, .vp-chorla .q-chip, .vp-chorla .q-variant, .vp-chorla-b .vp-tg, .vp-cl-q, .vp-hook .q-variant, .vp-rec.on i, .vp-ovoz.on .vp-ovoz-b i, p.vp-mj-son b.yangi, .vp-ch-tush, .vp-k-karta, .vp-k-karta.ket, .vp-tg.silk, .vp-joy.kul, .vp-yr-q.yangi, .vp-lap.vp-lap-chorla .vp-lap-ek, .vp-flash.yangi .fc-card .fc-front { animation: none !important; }
          .vp-uchar, .vp-ch-b { transition: none !important; }
          .vp-ovoz.on .vp-ovoz-b i { height: 10px; }
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
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
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
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} goTo={setScreen} />
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
