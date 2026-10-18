import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 2-dars «Mahsulotingiz qanday pul topadi?» — skeletdan (08.10.2026, 2-to'lqin); MD: feedback/F-1007-13modul/02-PmMonetization-v3.md
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKod, QVoqea, QMustaqil, QXato, QXulosa, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m11d2-v1', lessonTitle: { uz: 'Mahsulotingiz qanday pul topadi?', ru: 'Как ваш продукт зарабатывает?' } };
// 15 ekran (MD v3): kirish → reja → kim to'laydi → 1-savol → besh yo'l → 2-savol → Telegram Premium → 3-savol → modelingiz → juftlikda tekshiruv → Neon SQL → yakuniy savol → podium → kartochkalar → yakun
// Uyga vazifa banneri — fon so'zlari (MD: model · to'lovchi · bepul qism)
const HW_TOKENS = [
  { t: { uz: 'model', ru: 'модель' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "to'lovchi", ru: 'плательщик' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'bepul qism', ru: 'бесплатная часть' }, l: 30, tp: 70, s: 12, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal, natija }) => {
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
  // kompyuterda ham: natija/navbatdagi tugma ochilganda u pastki panel ostida qolmasin (SABOQ P11) — faqat sig'magan bo'lsa
  useEffect(() => {
    if (!natija || isNarrow) return undefined;
    const el = contentRef.current;
    if (!el) return undefined;
    const pas = () => { if (el && el.scrollHeight > el.clientHeight + el.scrollTop + 4) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); };
    const t = setTimeout(pas, 380), t2 = setTimeout(pas, 1100);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [natija, isNarrow]);
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
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' ms-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi; MD: 3 — C, 5 — A, 7 — D, 11 — B)
const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s11: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM darsida belgi o'rniga raqam — S-026)
const RECAPS = {
  3: {
    title: { uz: "Kim to'laydi", ru: 'Кто платит' }, ask: { uz: 'Sizning mahsulotingizda kim har hafta bir xil ishni qayta qiladi?', ru: 'Кто в вашем продукте каждую неделю повторяет одну и ту же работу?' },
    cards: [
      { ic: '1', h: { uz: "O'yinchilar", ru: 'Игроки' }, body: { uz: "O'yinchilar o'yinni to'ldiradi — ilova ular uchun bepul.", ru: 'Игроки заполняют игру — приложение для них бесплатно.' } },
      { ic: '2', h: { uz: 'Tashkilotchi', ru: 'Организатор' }, body: { uz: "Tashkilotchi har hafta o'yin e'lonini qayta yozadi.", ru: 'Организатор каждую неделю заново пишет объявление об игре.' } },
      { ic: '3', h: { uz: 'Pro', ru: 'Pro' }, body: { uz: "Pro shu ishni oladi — Mentor rejasida to'lovchi tashkilotchi.", ru: 'Pro берёт эту работу на себя — в плане Ментора платит организатор.' } }
    ]
  },
  5: {
    title: { uz: 'Model', ru: 'Модель' }, ask: { uz: 'Mahsulotingizda nima bepul qolishi kerak?', ru: 'Что в вашем продукте должно остаться бесплатным?' },
    cards: [
      { ic: '1', h: { uz: 'Monetizatsiya modeli', ru: 'Модель монетизации' }, body: { uz: 'Mahsulot qanday pul topishi — monetizatsiya modeli.', ru: 'То, как продукт зарабатывает, — модель монетизации.' } },
      { ic: '2', h: { uz: 'Pullik obuna', ru: 'Платная подписка' }, body: { uz: "Bu darsdagi pullik obuna modelida har bir foydalanuvchi to'laydi.", ru: 'В модели платной подписки на этом уроке платит каждый пользователь.' } },
      { ic: '3', h: { uz: 'Mentor modeli', ru: 'Модель Ментора' }, body: { uz: 'Mentor modelida asosiy ish bepul, faqat qo\'shimcha pullik.', ru: 'В модели Ментора основное бесплатно, платное — только дополнение.' } }
    ]
  },
  7: {
    title: { uz: 'Telegram Premium', ru: 'Telegram Premium' }, ask: { uz: 'Siz ishlatadigan ilovada pullik qism bormi?', ru: 'Есть ли платная часть в приложении, которым вы пользуетесь?' },
    cards: [
      { ic: '1', h: { uz: '2022-yil iyun', ru: 'Июнь 2022' }, body: { uz: '2022-yil iyunda Telegram pullik obunani ishga tushirdi.', ru: 'В июне 2022 года Telegram запустил платную подписку.' } },
      { ic: '2', h: { uz: 'Bepul qism', ru: 'Бесплатная часть' }, body: { uz: 'Bepul Telegram qisqartirilmadi.', ru: 'Бесплатный Telegram не урезали.' } },
      { ic: '3', h: { uz: 'Ustiga', ru: 'Сверху' }, body: { uz: "Premium ustiga qulaylik qo'shdi.", ru: 'Premium добавил удобства сверху.' } }
    ]
  },
  11: {
    title: { uz: 'Tanlov', ru: 'Выбор' }, ask: { uz: 'Modelingizni bir gapda ayta olasizmi?', ru: 'Сможете назвать свою модель одной фразой?' },
    cards: [
      { ic: '1', h: { uz: "Kim to'laydi", ru: 'Кто платит' }, body: { uz: "Avval kim to'lashi yoziladi.", ru: 'Сначала записывают, кто платит.' } },
      { ic: '2', h: { uz: 'Nima bepul', ru: 'Что бесплатно' }, body: { uz: 'Keyin nima bepul qolishi yoziladi.', ru: 'Потом — что остаётся бесплатным.' } },
      { ic: '3', h: { uz: 'Model', ru: 'Модель' }, body: { uz: 'Keyin model tanlanadi — sababi mahsulotdan.', ru: 'Потом выбирают модель — с причиной из продукта.' } }
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
        {(card.ask || (last && rc.ask)) && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask || rc.ask)}</div>}
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
    <Stage eyebrow={eyebrow} screen={screen} narrow natija={vizual && picked !== null ? 'p' + picked : null} audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
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
        {vizual && ((isMentorLive && mReveal) || (!isMentorLive && solved && revealed)) && <div className="ms-qviz fade-step">{vizual}</div>}
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

// ===== DARS VIZUALI — «Pul qayerdan keladi» sahnasi (ModelSahna: telefon · odamlar · tanga chizig'i · Pro kartasi · tashqi to'lovchi) — bitta manba: MENTOR_ROLLAR · YOLLAR · MENTOR_MODEL (MD A, KOD 3–4; 163/180) =====
// qolip-maket: ms-rol ms-qoy ms-keyingi ms-tahrir ms-belgi ms-mbtn ms-run ms-yana
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (MD «O'qituvchi eslatmasi»; o'quvchida ko'rinmaydi)
const Ustoz = ({ satrlar }) => {
  const { isMentor } = useJonli();
  if (!isMentor || !satrlar) return null;
  return <div className="ms-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{fmtCode(tr(q))}</span>)}</div>;
};
const USTOZ = {
  s0: [{ uz: "Javoblarni muhokama qilmang — uchala yo'l ham bugun ko'rinadi. Sinfdan so'rang: «Siz ishlatadigan bepul ilova pulni qayerdan topadi deb o'ylaysiz?» (javoblar og'zaki, sanalmaydi, qo'l ko'tartirilmaydi). Pul haqida — faqat taxmin: bugun hech kimdan pul so'ralmaydi.", ru: 'Не обсуждайте ответы — все пути будут видны сегодня. Спросите класс: «Откуда, по-вашему, берёт деньги бесплатное приложение, которым вы пользуетесь?» (устно, без подсчёта и поднятия рук). О деньгах — только предположение: сегодня ни у кого денег не просят.' }],
  s1: [{ uz: "Bir gap ayting: bu modulda pul haqida gaplashamiz, lekin hech kim haqiqiy pul to'lamaydi. O'tgan darsning «kim to'lashi mumkin» javobi bo'lmasa — dars to'xtamaydi, o'quvchi 9-ekranda o'zi yozadi.", ru: 'Скажите одну фразу: в этом модуле говорим о деньгах, но никто не платит настоящих денег. Если ответа «кто может платить» с прошлого урока нет — урок не останавливается, ученик напишет сам на 9-м экране.' }],
  s2: [
    { uz: "Pro — hali Mentorning rejasi: ilovada yo'q, bu darsda qachon qurilishi aytilmaydi. «To'lovchi» — o'tgan darsdagi so'z: pul to'laydigan foydalanuvchi; bu yerda «to'lashi mumkin» ma'nosida — hech kim to'lamagan.", ru: 'Pro — пока план Ментора: в приложении его нет, когда его построят, на уроке не говорится. «Плательщик» — слово прошлого урока; здесь в смысле «может платить» — никто не платил.' },
    { uz: "Mentor sababi: tashkilotchi har hafta e'lonni qayta yozadi — Pro shu ishni oladi (odam chaqirishni Pro qilmaydi — buni aytmang); o'yinchilar bepul qoladi — ular bo'lmasa o'yin to'lmaydi. Sahnadagi to'rtta Shanba — namuna, son emas.", ru: 'Причина Ментора: организатор каждую неделю заново пишет объявление — Pro берёт эту работу на себя (созывать людей Pro не умеет — не говорите этого); игроки остаются бесплатными — без них игра не наберётся. Четыре субботы на сцене — пример, не число.' },
    { uz: "Sinfga savol: «Sizning mahsulotingizda kim har hafta bir xil ishni qayta qiladi?» (javoblar og'zaki, sanalmaydi).", ru: 'Вопрос классу: «Кто в вашем продукте каждую неделю повторяет одну и ту же работу?» (устно, без подсчёта).' }
  ],
  s4: [
    { uz: "«Hozir tanlanmadi» — Mentor misolida va hozir: reklama va B2B keyinroq mumkin, tranzaksiya roadmap'da «uzoqroq»; boshqa mahsulotda boshqa yo'l mos kelishi mumkin. Har sabab — Mentorning taxmini.", ru: '«Сейчас не выбран» — в примере Ментора и сейчас: реклама и B2B возможны позже, транзакция в roadmap — «дальше»; в другом продукте может подойти другой путь. Каждая причина — предположение Ментора.' },
    { uz: "Reklama: sabab — auditoriya hali kichik. So'ralsa: Mentor o'smirlar ma'lumotini reklama uchun ishlatmaydi — bu Mentor qarori; reklama uchun ma'lumot berish shart emas. Qonun haqida gapirmang. B2B: maydon egasi pul to'lashi mumkin edi, lekin ilova unga xizmat qilmaydi — muammo gapi o'yinchilar haqida.", ru: 'Реклама: причина — аудитория пока мала. Если спросят: Ментор не использует данные подростков для рекламы — это решение Ментора; давать данные для рекламы не обязательно. О законе не говорите. B2B: владелец поля мог бы платить, но приложение ему не служит — фраза проблемы про игроков.' },
    { uz: "Tranzaksiya: «Maydon pulini bo'lishish» — 11-Modul roadmap'ida «uzoqroq»; bu darsda so'z faqat to'lov ma'nosida — boshqa ma'nolarini tilga olmang. «Yuridik shaxs» — kartada qavsda ochilgan («ro'yxatdan o'tgan firma»); rasmiy asos — Payme kassasi faqat yuridik shaxs yoki YaTT uchun; bu kursda hech kim boshqalar nomidan pul yig'maydi (keyingi darslarni va'da qilmang).", ru: 'Транзакция: «Делить деньги за поле» — в roadmap 11-го модуля «дальше»; на уроке слово только в смысле оплаты. «Юрлицо» раскрыто в скобках; официальное основание — касса Payme только для юрлица или ИП; на курсе никто не собирает деньги от имени других.' },
    { uz: "Pro ham pullik obuna, lekin model «pullik obuna» emas: hamma to'lamaydi — keyingi savol shuni so'raydi.", ru: 'Pro — тоже платная подписка, но модель не «платная подписка»: платят не все — следующий вопрос именно об этом.' }
  ],
  s6: [
    { uz: "Faqat bank faktlari: 2022-yil iyun · bepul qism qisqartirilmagan · 2024-yilda Premium'ga pullik obuna bo'lganlar uch barobar (12 million gacha; 2025-yil mayda — 15 million) · 2024-yilda birinchi marta foydaga chiqqan · 2024-yil daromadi 1 milliard dollardan oshgan.", ru: 'Только факты банка: июнь 2022 · бесплатную часть не урезали · в 2024 платных подписчиков Premium втрое больше (до 12 миллионов; к маю 2025 — 15 миллионов) · в 2024 впервые прибыль · выручка 2024 больше 1 миллиарда долларов.' },
    { uz: "Premium'da qaysi qulayliklar borligi, narxi — bankda yo'q: so'ralsa, «bu voqeada aytilmagan» deng. «Premium tufayli foydaga chiqdi» demang — voqea ikkalasi bir yilda bo'lganini aytadi, sababini emas.", ru: 'Какие удобства в Premium и сколько он стоит — в банке нет: если спросят, скажите «в этой истории не сказано». Не говорите «прибыль благодаря Premium» — история говорит, что оба факта в одном году, а не о причине.' },
    { uz: "12 million va 1 milliard — Telegram'ning sonlari, o'quvchi mahsulotiga maqsad emas. Ko'prik — umumiy joy: «Maydon Jamoa» Telegram emas, faqat bepul qismni qisqartirmaslik qarori bir xil.", ru: '12 миллионов и 1 миллиард — числа Telegram, не цель для продукта ученика. Мост — общее: «Maydon Jamoa» не Telegram, одинаково лишь решение не урезать бесплатную часть.' }
  ],
  s8: [
    { uz: "Tanlovni baholamang — bugun u taxmin: hali hech kim to'lamagan. Mentor modelini ko'chirish shart emas; reklama yoki B2B tanlagan o'quvchi to'lovchi sifatida kompaniya rolini yozadi (masalan, «o'quv markazi») — bugun hech kimga yozilmaydi va hech kimdan pul so'ralmaydi.", ru: 'Не оценивайте выбор — сегодня это предположение: никто ещё не платил. Копировать модель Ментора не нужно; кто выбрал рекламу или B2B, пишет роль компании (например, «учебный центр») — сегодня никому не пишут и денег не просят.' },
    { uz: "To'lovchi — rol bilan, ism yozilmaydi. Sinfda kim qaysi modelni tanlaganini qo'l ko'tartirib sanamang.", ru: 'Плательщик — ролью, без имени. Не считайте поднятием рук, кто какую модель выбрал.' }
  ],
  s9: [
    { uz: "≈ 2 × 3 daqiqa + tuzatish. Sherik model haqida yozadi, odam haqida emas; modelni «yaxshi» yoki «yomon» deb baholamaydi — faqat ikki savolga javob bormi.", ru: '≈ 2 × 3 минуты + исправление. Партнёр пишет о модели, а не о человеке; не оценивает «хорошо/плохо» — только есть ли ответ на два вопроса.' },
    { uz: "«Taxmin» — xato emas: hali hech kim to'lamagan. 2-savolda «fakt» — mahsulotdagi narsa (kim nima qiladi, nima ko'p takrorlanadi), «menga yoqadi» emas.", ru: '«Предположение» — не ошибка: никто ещё не платил. «Факт» во 2-м вопросе — то, что есть в продукте (кто что делает, что часто повторяется), а не «мне нравится».' }
  ],
  s10: [
    { uz: "12 daqiqa. Faqat `SELECT` — jadval o'zgarmaydi. Neon'da yo'l (rasmiy hujjat, 07.10.2026): loyihani tanlash → Postgres database → SQL Editor → branch va database → «Run».", ru: '12 минут. Только `SELECT` — таблица не меняется. Путь в Neon (документация, 07.10.2026): выбрать проект → Postgres database → SQL Editor → branch и database → «Run».' },
    { uz: "6 — Pro olganlar emas: hali hech kim to'lamagan; bu — Pro to'lovchi roliga mos tashkilotchilar, to'lashga tayyorligi noma'lum (hech kim so'ralmagan). O'chirilgan hisobning o'yinlari tashkilotchisiz qoladi (12-Modul «Hisobni o'chirish») — `JOIN` ularni sanamaydi.", ru: '6 — не купившие Pro: никто ещё не платил; это организаторы, подходящие под роль плательщика Pro, готовность платить неизвестна. Игры удалённого аккаунта остаются без организатора — `JOIN` их не считает.' },
    { uz: "`namuna` ustuni bo'lmasa — namuna akkauntlar bilan sanalgan son yozilmaydi: «Hozircha bilmayman», ustun — 12-Moduldagi ish. Son Mentornikidan farq qilishi tabiiy. Telefon va login ekranga chiqmasin.", ru: 'Если столбца `namuna` нет — число вместе с образцовыми аккаунтами не записывают: «Пока не знаю», столбец — работа 12-го модуля. Число может отличаться от Ментора. Телефон и логин на экран не выводить.' }
  ]
};
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const MAYDON_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili
const TELEGRAM_RANG = '#2AABEE'; // Telegram — o'z rangida, logotipsiz
const TANGA_RANG = '#E2A93B'; // chizilgan tanga belgisi (emoji emas)
const NEON_RANG = '#00E599'; // Neon — o'z rangida, logotipsiz
const MJ = () => <b className="ms-mj">Maydon Jamoa</b>;
const qisqa = (s, n = 28) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

// Saqlash kalitlari (tayanch 8 aynan): o'qiydi — 1-dars birligi, 11-Modul PRD va trek, 12-Modul lending · yozadi — pm-m11d2-model
const BIRLIK_KEY = 'pm-m11d1-birlik';
const PRD_KEY = 'pm-m9d5-prd';
const LENDING_KEY = 'pm-m10d1-lending';
const PLATFORMA_KEY = 'pm-m9d8-platforma';
const MODEL_KEY = 'pm-m11d2-model';
const HAMMA = 'hamma foydalanuvchi';
const birlikOl = () => { const b = lsO(BIRLIK_KEY); return b && b.tur === 'real' ? b : null; }; // tur: 'mashq' — o'quvchiniki emas (9.19)
const nomOl = () => { const l = lsO(LENDING_KEY); const n = l && String(l.nom || '').trim(); return n || null; };
const prdOl = () => {
  const p = lsO(PRD_KEY); if (!p) return null;
  const f = Array.isArray(p.funksiyalar) ? p.funksiyalar.map(x => String((x && typeof x === 'object' ? (x.nom || x.nomi || x.t || '') : x) || '').trim()).filter(Boolean).slice(0, 3) : [];
  return { kim: String(p.kim || '').trim(), funksiyalar: f };
};
const modelOl = () => { const m = lsO(MODEL_KEY); return m && m.model ? m : null; };

const MODEL_NOM = {
  freemium: { uz: "Bepul asos va pullik qo'shimcha", ru: 'Бесплатная основа и платное дополнение' },
  obuna: { uz: 'Pullik obuna', ru: 'Платная подписка' },
  reklama: { uz: 'Reklama', ru: 'Реклама' },
  b2b: { uz: 'B2B', ru: 'B2B' },
  tranzaksiya: { uz: 'Tranzaksiya', ru: 'Транзакция' }
};
const MODEL_KIM = {
  freemium: { uz: "qo'shimchani olganlar", ru: 'кто берёт дополнение' },
  obuna: { uz: 'hamma foydalanuvchi', ru: 'все пользователи' },
  reklama: { uz: 'reklama bergan kompaniya', ru: 'компания-рекламодатель' },
  b2b: { uz: 'xizmat olgan biznes', ru: 'бизнес, получивший услугу' },
  tranzaksiya: { uz: "har to'lovdan ulush", ru: 'доля с каждой оплаты' }
};
const MODEL_TARTIB = ['freemium', 'obuna', 'reklama', 'b2b', 'tranzaksiya'];
const MENTOR_ROLLAR = [
  { id: 'oyinchi', kim: { uz: "O'yinchi", ru: 'Игрок' }, nima: { uz: "o'yinga qo'shiladi", ru: 'присоединяется к игре' }, pul: { uz: 'ilova unga bepul', ru: 'приложение для него бесплатно' } },
  { id: 'tashkilotchi', kim: { uz: 'Tashkilotchi', ru: 'Организатор' }, nima: { uz: "har hafta o'yin e'lonini qayta yozadi", ru: 'каждую неделю заново пишет объявление об игре' }, pul: { uz: "Pro'ni olishi mumkin", ru: 'может взять Pro' } }
];
const PRO_SATR = [
  { uz: 'Pro — 30 kunlik pullik obuna', ru: 'Pro — платная подписка на 30 дней' },
  { uz: "Doimiy o'yin: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi", ru: 'Постоянная игра: каждую неделю в тот же день и час игра объявляется сама' }
];
const MUAMMO_GAPI = { uz: "O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.", ru: 'Игрокам трудно перед игрой собрать достаточно людей в команду и знать, кто точно придёт.' };
// 4-ekran — besh yo'l (tartib MD: tanlangani oxirida); sahna — ModelSahna holati
const YOLLAR = [
  { id: 'obuna', hodisa: { uz: "Har bir foydalanuvchi ma'lum muddatga pul to'laydi.", ru: 'Каждый пользователь платит на определённый срок.' }, nom: { uz: "pullik obuna — hamma to'laydi", ru: 'платная подписка — платят все' },
    sabab: { uz: "Telegram guruhi bepul — o'yinchilar ketsa, o'yin to'lmaydi.", ru: 'Telegram-группа бесплатна — если игроки уйдут, игра не наберётся.' }, tanlandi: false,
    sahna: { oqim: 'hamma' }, kech: { oqim: 'hamma', xira: [1, 4, 6], sonQ: true } },
  { id: 'reklama', hodisa: { uz: "Boshqa kompaniya o'z mahsulotini ilovada ko'rsatish uchun to'laydi.", ru: 'Другая компания платит, чтобы показывать свой продукт в приложении.' }, nom: { uz: 'reklama', ru: 'реклама' },
    sabab: { uz: "44 foydalanuvchi — reklama beruvchi uchun hali kichik auditoriya.", ru: '44 пользователя — для рекламодателя пока маленькая аудитория.' }, tanlandi: false,
    sahna: { tel: 'reklama', oqim: 'tashqi', tashqi: 'bino', ustida: 'bepulHamma', yorliq44: true } },
  { id: 'b2b', hodisa: { uz: "Mahsulot boshqa biznesning o'z ishiga xizmat qiladi — pulni o'sha biznes to'laydi.", ru: 'Продукт служит делу другого бизнеса — платит этот бизнес.' }, nom: { uz: "B2B — boshqa biznes to'laydi", ru: 'B2B — платит другой бизнес' },
    sabab: { uz: "Maydon egasi to'lashi mumkin edi, lekin ilova bugun unga xizmat qilmaydi — muammo gapida u yo'q.", ru: 'Владелец поля мог бы платить, но приложение сегодня ему не служит — во фразе проблемы его нет.' }, tanlandi: false,
    sahna: { tashqi: 'maydon', oqim: 'maydon', muammo: true } },
  { id: 'tranzaksiya', hodisa: { uz: "Ilova orqali o'tadigan har to'lovdan bir ulush oladi.", ru: 'Берёт долю с каждой оплаты, проходящей через приложение.' }, nom: { uz: "tranzaksiya — har to'lovdan ulush", ru: 'транзакция — доля с каждой оплаты' },
    sabab: { uz: "Boshqalar nomidan pul yig'ish: yuridik shaxs (ro'yxatdan o'tgan firma) va shartnoma kerak.", ru: 'Собирать деньги от имени других: нужны юрлицо (зарегистрированная фирма) и договор.' }, tanlandi: false,
    sahna: { tashqi: 'joy', oqim: 'orqali', teg: true }, kech: { tashqi: 'joy', oqim: 'orqali', teg: true, qulf: true } },
  { id: 'freemium', hodisa: { uz: "Asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik.", ru: 'Основное — бесплатно для всех, дополнительное удобство — платное.' }, nom: { uz: "bepul asos va pullik qo'shimcha", ru: 'бесплатная основа и платное дополнение' },
    sabab: { uz: "O'yinchilar bepul qoladi, Pro'ni tashkilotchi oladi. Pro — pullik obuna, lekin faqat qo'shimcha uchun.", ru: 'Игроки остаются бесплатными, Pro берёт организатор. Pro — платная подписка, но только за дополнение.' }, tanlandi: true,
    sahna: { oqim: 'bitta', ustida: 'bepul', pro: 'ochiq' } }
];
const MUHR = { tanlandi: { uz: 'tanlandi', ru: 'выбран' }, yoq: { uz: 'hozir tanlanmadi', ru: 'сейчас не выбран' } };
// Mentor modeli — 8-ekran Yordami va Mentor rejimi (MD 8-ekran Yordam aynan)
const MENTOR_MODEL = {
  model: 'freemium',
  kim: { uz: 'tashkilotchi', ru: 'организатор' },
  nima: { uz: "«Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi", ru: '«Постоянная игра»: каждую неделю в тот же день и час игра объявляется сама' },
  bepul: { uz: "o'yin e'loni, qo'shilish, chiqish va navbat", ru: 'объявление игры, присоединение, выход и очередь' },
  sabab: { uz: "o'yinchilar bo'lmasa o'yin to'lmaydi", ru: 'без игроков игра не наберётся' },
  rad: [{ model: 'obuna', sabab: { uz: 'Telegram guruhi bepul', ru: 'Telegram-группа бесплатна' } }]
};
const MENTOR_SONI = 6;
const SQL_QATOR = ['SELECT COUNT(', 'DISTINCT', ' g.tashkilotchi_id)', 'FROM oyinlar g', 'JOIN oyinchilar o ON o.id = g.tashkilotchi_id', 'WHERE o.namuna = false;'];

// --- yordamchi hook'lar ---
const useIpucha = (faol, dep) => {
  const [ko, setKo] = useState(false);
  useEffect(() => { setKo(false); if (!faol) return undefined; const t = setTimeout(() => setKo(true), 40000); return () => clearTimeout(t); }, [faol, dep]);
  return ko && faol;
};
// Taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori (E 42); QIzoh — oxirgi kichik qatori
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('ms-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="ms-x-m">{matn}</span>{izoh && <span className="ms-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="ms-bashq fade-step"><span>{savol}</span><span className="ms-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;

// --- Odam (SABOQ P1: o'z chizmasi yo'q — 9-Modul PmInterviewsOneLesson dagi tayyor «Odam», telefon ushlagan) ---
const RANG = {
  teri: ['#EEC6A0', '#C98F66', '#E2A982'], soch: ['#2B1E17', '#5A3A25', '#1E1A1A'],
  kiyim: ['#E0765C', '#3D7EB4', '#E7A33E', '#7A62C8', '#2E9C78', '#D56B8A'], shim: '#394060', oyoq: '#2A2730', lab: '#8A4B3A'
};
const Odam = ({ x = 0, y = 0, s = 1, teri = 0, soch = 0, kiyim = 0, yuz = 1, sochTur = 'qisqa', qol }) => {
  const k = RANG.kiyim[kiyim % RANG.kiyim.length], t = RANG.teri[teri % 3], h = RANG.soch[soch % 3];
  return (
    <g><g transform={`translate(${x} ${y}) scale(${s * yuz} ${s})`}>
      <rect x="-8.5" y="-34" width="7.5" height="32" rx="3.5" fill={RANG.shim} />
      <rect x="1" y="-34" width="7.5" height="32" rx="3.5" fill={RANG.shim} />
      <rect x="-10.5" y="-4" width="10" height="4.5" rx="2.2" fill={RANG.oyoq} />
      <rect x="1" y="-4" width="11" height="4.5" rx="2.2" fill={RANG.oyoq} />
      <rect x="-15.5" y="-60" width="7" height="27" rx="3.5" fill={k} opacity="0.88" />
      <rect x="-12" y="-64" width="24" height="33" rx="9" fill={k} />
      <circle cx="-12" cy="-32.5" r="3.3" fill={t} />
      {qol === 'telefon'
        ? <>
          <rect x="7.5" y="-60" width="7" height="15" rx="3.5" fill={k} />
          <rect x="8" y="-49" width="15" height="7" rx="3.5" fill={k} />
          <circle cx="23" cy="-45.5" r="3.3" fill={t} />
          <rect x="20" y="-57" width="7" height="11" rx="1.6" fill="#2A2730" />
        </>
        : <><rect x="8.5" y="-60" width="7" height="27" rx="3.5" fill={k} /><circle cx="12" cy="-32.5" r="3.3" fill={t} /></>}
      <rect x="-3" y="-70" width="6" height="7" rx="2" fill={t} />
      <circle cx="0" cy="-78" r="11" fill={t} />
      {sochTur === 'uzun' && <path d="M -11 -79 C -13 -63, -10 -59, -4 -60 L -6 -74 Z" fill={h} />}
      <path d="M -11.5 -77 C -13 -94, 13 -94, 11.5 -78 C 6 -84, -2 -85, -11.5 -77 Z" fill={h} />
      <circle cx="3" cy="-78" r="1.4" fill="#2A2730" />
      <circle cx="8" cy="-78" r="1.4" fill="#2A2730" />
      <path d="M 3.5 -72.5 Q 6 -70 8.5 -72.5" stroke={RANG.lab} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="9.5" cy="-74" r="1.8" fill="#E8867A" opacity="0.35" />
    </g></g>
  );
};
const OdamSvg = ({ w = 26, h = 40, className, ...p }) => <svg className={cxx('ms-odam-svg', className)} viewBox="-30 -96 64 98" width={w} height={h} aria-hidden="true"><Odam {...p} /></svg>;
const ODAMLAR = [
  { kiyim: 0, teri: 0, soch: 0 }, { kiyim: 1, teri: 1, soch: 1, sochTur: 'uzun' }, { kiyim: 2, teri: 2, soch: 2 }, { kiyim: 3, teri: 0, soch: 1 },
  { kiyim: 4, teri: 1, soch: 0, sochTur: 'uzun' }, { kiyim: 5, teri: 2, soch: 2 }, { kiyim: 1, teri: 0, soch: 1 }, { kiyim: 2, teri: 1, soch: 0, sochTur: 'uzun' },
  { kiyim: 4, teri: 2, soch: 1, qol: 'telefon' }
];
const Bino = () => (
  <svg viewBox="0 0 54 60" width="46" height="52" aria-hidden="true">
    <rect x="6" y="8" width="42" height="50" rx="3" fill="#8C93A8" />
    <rect x="2" y="56" width="50" height="4" rx="2" fill="#5E6478" />
    {[0, 1, 2].map(r => [0, 1, 2].map(c => <rect key={r + '-' + c} x={12 + c * 11} y={14 + r * 12} width="7" height="7" rx="1.5" fill="#DCE6F5" />))}
    <rect x="22" y="46" width="10" height="12" rx="1.5" fill="#4A5064" />
  </svg>
);
const MaydonChizigi = () => (
  <svg viewBox="0 0 80 46" width="80" height="46" aria-hidden="true">
    <rect x="1" y="1" width="78" height="44" rx="5" fill="#4FAF5E" />
    <rect x="5" y="5" width="70" height="36" rx="2" fill="none" stroke="#E9F7EA" strokeWidth="1.5" />
    <line x1="40" y1="5" x2="40" y2="41" stroke="#E9F7EA" strokeWidth="1.5" />
    <circle cx="40" cy="23" r="6.5" fill="none" stroke="#E9F7EA" strokeWidth="1.5" />
  </svg>
);
const Tanga = ({ r = 6 }) => <><circle r={r} fill={TANGA_RANG} stroke="#B07A1C" strokeWidth="1.4" /><circle r={r * 0.5} fill="none" stroke="#B07A1C" strokeWidth="1" /></>;
const Qulf = () => (
  <svg viewBox="0 0 20 22" width="20" height="22" aria-hidden="true"><path d="M5 10 V7 a5 5 0 0 1 10 0 V10" fill="none" stroke={T.ink2} strokeWidth="2.2" /><rect x="2" y="10" width="16" height="11" rx="2.5" fill={T.ink2} /></svg>
);

// --- Telefon «Maydon Jamoa» (≈170×272; rejimlar oddiy · oyinchi · tashkilotchi · reklama) yoki o'quvchi mahsulot kartasi ---
const MjTelefon = ({ tel = 'oddiy', sonQ, sonAcc, tRef }) => (
  <div ref={tRef} className="ms-tel" data-rejim={tel}>
    <span className="ms-tel-bar"><MJ /></span>
    <div className="ms-tel-ekran">
      <b className="ms-tel-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
      {tel === 'reklama' && <span className="ms-rekl">{tr({ uz: 'reklama', ru: 'реклама' })}</span>}
      <div className="ms-oyin">
        <span className="ms-oyin-v">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</span>
        <span className="ms-oyin-j">{tr({ uz: 'Mahalla maydoni', ru: 'Поле махалли' })}</span>
        <span key={sonQ ? 'q' : 'n'} className={cxx('ms-oyin-son', sonAcc && 'acc', sonQ && 'savol')}>{sonQ ? '? / 10' : '8 / 10'}</span>
        <span className={cxx('ms-tel-btn', tel === 'oyinchi' && 'yon')}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
      </div>
      <span className={cxx('ms-tel-btn', 'elon', tel === 'tashkilotchi' && 'yon')}>{tr({ uz: "E'lon berish", ru: 'Объявить игру' })}</span>
    </div>
  </div>
);
const MahsulotKarta = ({ nom, kim, bepul = [], pullik = [], tRef }) => (
  <div ref={tRef} className="ms-mk">
    <span className="ms-mk-bar">{nom || tr({ uz: 'Mahsulotim', ru: 'Мой продукт' })}</span>
    <div className="ms-mk-ich">
      {kim && <span className="ms-mk-kim">{tr({ uz: "To'lovchi", ru: 'Плательщик' })}: <b>{qisqa(kim, 30)}</b></span>}
      {bepul.length > 0 && <span className="ms-mk-g bepul"><i>{tr({ uz: 'bepul', ru: 'бесплатно' })}</i>{bepul.map((f, j) => <em key={j}>{qisqa(f, 22)}</em>)}</span>}
      {pullik.length > 0 && <span className="ms-mk-g pullik"><i>{tr({ uz: 'pullik', ru: 'платно' })}</i>{pullik.map((f, j) => <em key={j}>{qisqa(f, 22)}</em>)}</span>}
      {!kim && bepul.length === 0 && pullik.length === 0 && <span className="ms-mk-bosh">…</span>}
    </div>
  </div>
);

// --- ModelSahna — bitta vizual. Tanga chizig'i: to'lovchidan mahsulotga (SVG yo'l + animateMotion, reduced-motion — harakatsiz) ---
// p: { rejim: 'mentor'|'oquvchi', tel, sonQ, sonAcc, oqim: 'hamma'|'bitta'|'tashqi'|'maydon'|'orqali'|null, ustida: 'bepul'|'bepulHamma'|'?'|null, xira: [i], tashqi: 'bino'|'maydon'|'joy'|null,
//      qulf, pro: null|'yopiq'|'ochiq', haftalar: null|'yozadi'|'ozi', yorliq44, muammo, teg, nom, kim, bepulF, pullikF, tolovchiYorliq, ong }
const ModelSahna = (p) => {
  const rootRef = useRef(null), telRef = useRef(null), tashRef = useRef(null), odamRef = useRef([]);
  const [geo, setGeo] = useState(null);
  const oqim = p.oqim || null;
  const yonBor = !!(p.tashqi || p.pro || p.haftalar || p.teg || p.ong);
  useLayoutEffect(() => {
    const root = rootRef.current; if (!root) return undefined;
    const olch = () => {
      const r = root.getBoundingClientRect(); if (!r.width) return;
      const q = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.left - r.left, y: b.top - r.top, w: b.width, h: b.height }; };
      setGeo({ w: r.width, h: r.height, tel: q(telRef.current), tash: q(tashRef.current), odam: odamRef.current.map(q) });
    };
    olch();
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(olch); ro.observe(root); }
    const t = setTimeout(olch, 450);
    return () => { if (ro) ro.disconnect(); clearTimeout(t); };
  }, [oqim, p.tashqi, p.pro, p.haftalar, p.muammo, p.yorliq44, p.tel, p.rejim, p.ong]);
  const yollar = [];
  if (geo && geo.tel && oqim) {
    const tb = { x: geo.tel.x + geo.tel.w / 2, y: geo.tel.y + geo.tel.h - 6 };
    const top = (o) => o && { x: o.x + o.w / 2, y: o.y + 4 };
    if (oqim === 'hamma') geo.odam.forEach((o, i) => { const a = top(o); if (a) yollar.push({ a, b: { x: tb.x + (i - 4) * 7, y: tb.y }, k: i }); });
    if (oqim === 'bitta') { const a = top(geo.odam[8]); if (a) yollar.push({ a, b: tb, k: 8, acc: true }); }
    if ((oqim === 'tashqi' || oqim === 'maydon') && geo.tash) {
      const a = { x: geo.tash.x + 4, y: geo.tash.y + geo.tash.h / 2 };
      const b = { x: geo.tel.x + geo.tel.w - 4, y: geo.tel.y + geo.tel.h * 0.55 };
      if (oqim === 'maydon') yollar.push({ a, b: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, k: 'm', uzuq: b });
      else yollar.push({ a, b, k: 't' });
    }
    if (oqim === 'orqali' && geo.tash) {
      [0, 3, 6].forEach(i => { const a = top(geo.odam[i]); if (a) yollar.push({ a, b: { x: tb.x + (i - 3) * 6, y: tb.y }, k: i }); });
      yollar.push({ a: { x: geo.tel.x + geo.tel.w - 4, y: geo.tel.y + geo.tel.h * 0.55 }, b: { x: geo.tash.x + 6, y: geo.tash.y + geo.tash.h / 2 }, k: 'o', kech: 1.1 });
    }
  }
  const harakat = !kamHarakat();
  const bracket = p.ustida === 'bepul' ? { span: 8, t: tr({ uz: 'bepul', ru: 'бесплатно' }), c: 'bepul' } : p.ustida === 'bepulHamma' ? { span: 9, t: tr({ uz: 'bepul', ru: 'бесплатно' }), c: 'bepul' } : p.ustida === '?' ? { span: 9, t: '?', c: 'savol' } : null;
  const oq = p.rejim === 'oquvchi';
  const qulfJoy = p.qulf && yollar.find(y => y.k === 'o');
  return (
    <div ref={rootRef} className={cxx('ms', p.kichik && 'kichik', !yonBor && 'yonsiz')}>
      {p.muammo && <p className="ms-muammo fade-step"><i>{tr({ uz: 'muammo gapi', ru: 'фраза проблемы' })}</i>{tr(MUAMMO_GAPI)}</p>}
      <div className="ms-qator">
        <div className="ms-chap">
          {p.yorliq44 && <span className="ms-44 fade-step">44 {tr({ uz: 'foydalanuvchi', ru: 'пользователя' })}</span>}
          {oq ? <MahsulotKarta nom={p.nom} kim={p.kim} bepul={p.bepulF} pullik={p.pullikF} tRef={telRef} /> : <MjTelefon tel={p.tel} sonQ={p.sonQ} sonAcc={p.sonAcc} tRef={telRef} />}
          <div className="ms-odamlar">
            <div className="ms-ust">{bracket && <span key={p.ustida} className={cxx('ms-qavs', bracket.c)} style={{ gridColumn: `1 / span ${bracket.span}` }}>{bracket.t}</span>}
              {(p.xira || []).map(i => <span key={'x' + i} className="ms-qm" style={{ gridColumn: `${i + 1} / span 1` }}>?</span>)}</div>
            <div className="ms-odam-ro">
              {ODAMLAR.map((o, i) => (
                <span key={i} ref={(el) => { odamRef.current[i] = el; }} className={cxx('ms-odam', (p.xira || []).includes(i) && 'xira', ((oqim === 'bitta' && i === 8) || (oqim === 'hamma')) && 'tolaydi')}>
                  <OdamSvg {...o} qol={!oq && i === 8 ? 'telefon' : undefined} />
                </span>
              ))}
            </div>
            <div className="ms-rol-ro">
              {oq
                ? <><span style={{ gridColumn: p.tolovchiYorliq ? '1 / span 5' : '1 / span 9' }}>{tr({ uz: 'foydalanuvchilar', ru: 'пользователи' })}</span>{p.tolovchiYorliq && <b style={{ gridColumn: '6 / span 4', textAlign: 'right' }}>{qisqa(p.tolovchiYorliq, 16)}</b>}</>
                : <><span style={{ gridColumn: '1 / span 8' }}>{tr({ uz: "o'yinchilar", ru: 'игроки' })}</span><b style={{ gridColumn: '9 / span 1' }}>{tr({ uz: "E'lon", ru: 'Объявл.' })}</b></>}
            </div>
          </div>
        </div>
        {yonBor && (
          <div className="ms-yon">
            {p.ong}
            {p.tashqi === 'bino' && <div ref={tashRef} className="ms-tash fade-step"><Bino /><span>{tr({ uz: 'kompaniya', ru: 'компания' })}</span></div>}
            {p.tashqi === 'maydon' && <div ref={tashRef} className="ms-tash fade-step"><span className="ms-tash-q"><OdamSvg w={30} h={46} kiyim={3} teri={1} soch={2} /><MaydonChizigi /></span><span>{tr({ uz: 'maydon egasi', ru: 'владелец поля' })}</span></div>}
            {p.tashqi === 'joy' && <div ref={tashRef} className="ms-tash fade-step"><MaydonChizigi /><span>{tr({ uz: 'maydon', ru: 'поле' })}</span></div>}
            {p.teg && <span className="ms-teg fade-step">{tr({ uz: "Maydon pulini bo'lishish · roadmap: uzoqroq", ru: 'Делить деньги за поле · roadmap: дальше' })}</span>}
            {p.haftalar && (
              <div className={cxx('ms-hafta', p.haftalar)}>
                {[0, 1, 2, 3].map(i => <span key={i} className="ms-hk" style={{ animationDelay: `${i * 0.12}s` }}><b>{tr({ uz: 'Shanba', ru: 'Суббота' })}</b><i style={{ animationDelay: `${0.3 + i * 0.35}s` }} />{p.haftalar === 'ozi' && <em>{tr({ uz: "o'zi", ru: 'сама' })}</em>}</span>)}
              </div>
            )}
            {p.pro && (
              <div className={cxx('ms-pro', p.pro)}>
                <span className="ms-pro-y">{tr({ uz: 'Mentorning rejasi', ru: 'План Ментора' })}</span>
                <b className="ms-pro-n">Pro</b>
                {p.pro === 'ochiq' && PRO_SATR.map((s, i) => <span key={i} className="ms-pro-s" style={{ animationDelay: `${0.15 + i * 0.15}s` }}>{tr(s)}</span>)}
              </div>
            )}
          </div>
        )}
      </div>
      {geo && yollar.length > 0 && (
        <svg key={oqim + '-' + (p.tashqi || '') + '-' + Math.round(geo.w)} className="ms-oqim" width={geo.w} height={geo.h} aria-hidden="true">
          {yollar.map((y, i) => (
            <g key={y.k}>
              <path d={`M ${y.a.x} ${y.a.y} L ${y.b.x} ${y.b.y}`} className={cxx('ms-iz', y.acc && 'acc')} />
              {y.uzuq && <path d={`M ${y.b.x + (y.uzuq.x - y.b.x) * 0.25} ${y.b.y + (y.uzuq.y - y.b.y) * 0.25} L ${y.uzuq.x} ${y.uzuq.y}`} className="ms-iz uzuq" />}
              {harakat
                ? <g opacity="0"><Tanga /><animateMotion dur="1.3s" begin={`${(y.kech || 0) + (typeof y.k === 'number' ? y.k * 0.08 : 0)}s`} repeatCount="2" fill="freeze" path={`M ${y.a.x} ${y.a.y} L ${y.b.x} ${y.b.y}`} /><set attributeName="opacity" to="1" begin={`${(y.kech || 0) + (typeof y.k === 'number' ? y.k * 0.08 : 0)}s`} fill="freeze" /></g>
                : <g transform={`translate(${(y.a.x + y.b.x) / 2} ${(y.a.y + y.b.y) / 2})`}><Tanga /></g>}
            </g>
          ))}
          {oqim === 'orqali' && geo.tel && <g transform={`translate(${geo.tel.x + geo.tel.w - 12} ${geo.tel.y + geo.tel.h * 0.55 - 14})`}><Tanga r={4} /></g>}
          {qulfJoy && <g transform={`translate(${(qulfJoy.a.x + qulfJoy.b.x) / 2 - 10} ${(qulfJoy.a.y + qulfJoy.b.y) / 2 - 24})`}><g className="ms-qulf"><Qulf /></g></g>}
        </svg>
      )}
    </div>
  );
};

// Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; MD 0-ekran)
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
    <div className="ms-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('ms-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="ms-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish, sof so'rovnoma — J-026: correct false hammaga, to'rttala javob «Qiziq fikr!») =====
const HOOK_OPTS = [
  { id: 'hamma', label: { uz: "Hamma foydalanuvchi oz-ozdan to'laydi", ru: 'Все пользователи платят понемногу' }, sahna: { oqim: 'hamma' },
    javob: { uz: "Bunday yo'lda har bir foydalanuvchi ma'lum muddatga to'laydi. Bepul qism bo'lmaydi.", ru: 'На таком пути каждый пользователь платит на определённый срок. Бесплатной части нет.' } },
  { id: 'bazi', label: { uz: "Ba'zilari qo'shimcha uchun to'laydi", ru: 'Некоторые платят за дополнительное' }, sahna: { oqim: 'bitta', ustida: 'bepul' },
    javob: { uz: "Bunday yo'lda asosiy ish bepul qoladi. Pulni qo'shimcha kerak bo'lganlar to'laydi.", ru: 'На таком пути основное остаётся бесплатным. Платят те, кому нужно дополнительное.' } },
  { id: 'kompaniya', label: { uz: "Foydalanuvchi emas, kompaniya to'laydi", ru: 'Платит не пользователь, а компания' }, sahna: { oqim: 'tashqi', tashqi: 'bino', ustida: 'bepulHamma' },
    javob: { uz: "Bunday yo'lda foydalanuvchi to'lamaydi. Kompaniya nima uchun to'lashini topish kerak.", ru: 'На таком пути пользователь не платит. Нужно найти, за что платит компания.' } },
  { id: 'bilmayman', label: { uz: "Hali bilmayman — kim to'lashi noma'lum", ru: 'Пока не знаю — кто платит, неизвестно' }, sahna: { ustida: '?' },
    javob: { uz: "Hozircha tanga hech kimdan chiqmayapti. Kim to'lashini besh yo'lni solishtirib belgilaysiz.", ru: 'Пока монета ни от кого не идёт. Кто платит, определите, сравнив пять путей.' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [birlik] = useState(birlikOl);
  const [nom] = useState(nomOl);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', HOOK_OPTS.findIndex(o => o.id === v), false, 0);
  };
  const o = HOOK_OPTS.find(h => h.id === picked);
  const kimT = birlik ? (birlik.kimTolaydi ? String(birlik.kimTolaydi) : tr({ uz: "hali noma'lum", ru: 'пока неизвестно' })) : null;
  const maket = (
    <div className="ms-k-maket">
      <ModelSahna kichik rejim={birlik ? 'oquvchi' : 'mentor'} nom={nom} {...(o ? o.sahna : {})} />
      <p className="ms-kulrang">{birlik
        ? <>{tr({ uz: "Kim to'lashi mumkin", ru: 'Кто может платить' })}: <b>{kimT}</b></>
        : <>{tr({ uz: "Kim to'laydi: ? · Mentor misolida", ru: 'Кто платит: ? · в примере Ментора' })}</>}</p>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('ms-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Mahsulotingiz qanday <A>pul topadi?</A></>, ru: <>Как ваш продукт <A>зарабатывает?</A></> })}
          mentor={<Mentor>{tr({ uz: "O'tgan darsda keltiradigan pulni hisobladingiz — endi o'sha pul kimdan kelishini o'ylab, javobni tanlang.", ru: 'На прошлом уроке вы посчитали приносимые деньги — теперь подумайте, от кого они придут, и выберите ответ.' })}</Mentor>}
          maket={maket}
          variantlar={HOOK_OPTS.map(h => ({ id: h.id, t: tr(h.label) }))} tanlov={picked} onTanla={pick}
          javob={<>
            {o && <p className="hook-ack fade-step"><b>{tr({ uz: 'Qiziq fikr!', ru: 'Интересная мысль!' })}</b> {tr(o.javob)}</p>}
            {isLive && (picked !== null || live.mode === 'mentor') && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(h => tr(h.label))} mening={HOOK_OPTS.findIndex(h => h.id === picked)} />}
          </>}
        >
          <Ustoz satrlar={USTOZ.s0} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; chap: App.jsx osti so'zma-so'z + sahna o'zi yuradi — uch xil tanga oqimi, yo'l nomi va muhr yo'q) =====
const REJA = [
  { t: { uz: "Mentor misolida pulni kim to'lashi mumkinligini ko'rasiz", ru: 'В примере Ментора увидите, кто может платить' }, teg: { uz: "to'lovchi", ru: 'плательщик' } },
  { t: { uz: "Pul topish yo'llarini «Maydon Jamoa»ga qo'yib solishtirasiz", ru: 'Сравните пути заработка, примерив их к «Maydon Jamoa»' }, teg: { uz: 'model', ru: 'модель' } },
  { t: { uz: "O'z mahsulotingiz uchun bittasini tanlab, sababini yozasiz", ru: 'Для своего продукта выберете один и напишете причину' }, teg: { uz: 'tanlov', ru: 'выбор' } },
  { t: { uz: "To'lashi mumkin bo'lganlarni Neon'da sanaysiz", ru: 'Посчитаете в Neon тех, кто может платить' }, teg: { uz: 'SQL', ru: 'SQL' } }
];
const REJA_AYLANISH = [{ oqim: 'hamma' }, { oqim: 'bitta' }, { oqim: 'tashqi', tashqi: 'bino' }];
const RejaSahna = () => {
  const [i, setI] = useState(() => (kamHarakat() ? -1 : 0));
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const t = setInterval(() => setI(n => (n < 0 ? n : n >= 5 ? -1 : n + 1)), 2600);
    return () => clearInterval(t);
  }, []);
  const s = i >= 0 && i <= 5 ? REJA_AYLANISH[i % 3] : {};
  return <ModelSahna kichik rejim="mentor" {...s} />;
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="ms-reja">
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun mahsulotingizga <A>pul topish yo'lini tanlaysiz.</A></>, ru: <>Сегодня выберете для продукта <A>путь заработка.</A></> })}
        mentor={<Mentor>{tr({ uz: "Tanlov o'tgan darsdagi «kim to'lashi mumkin» javobingizdan boshlanadi. U yozilmagan bo'lsa — bugun yozasiz.", ru: 'Выбор начинается с вашего ответа «кто может платить» с прошлого урока. Если его нет — напишете сегодня.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<>
          <span className="ms-reja-yorliq">{tr({ uz: 'besh model: bepul asos, pullik obuna, reklama, B2B, tranzaksiya', ru: 'пять моделей: бесплатная основа, платная подписка, реклама, B2B, транзакция' })}</span>
          <RejaSahna />
          <p className="ms-kulrang">{tr({ uz: "Bu modulda haqiqiy pul to'lanmaydi va so'ralmaydi.", ru: 'В этом модуле настоящие деньги не платят и не просят.' })}</p>
        </>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <Ustoz satrlar={USTOZ.s1} />
      </QReja>
    </div>
  </Stage>
);

// ===== SCREEN 2 — KIM TO'LAYDI (QTushuncha keng: bashorat → 2 rol tugmasi ketma-ket → telefon, odamlar, Pro kartasi o'zgaradi → yashil xulosa, E 42) =====
const S2_TAXMIN = [{ k: 'oy', t: { uz: 'Oyda bir marta', ru: 'Раз в месяц' } }, { k: 'ikki', t: { uz: 'Ikki haftada bir', ru: 'Раз в две недели' } }, { k: 'hafta', t: { uz: 'Har hafta', ru: 'Каждую неделю' } }];
const S2_SAVOL = { uz: "Tashkilotchi bir xil o'yin e'lonini qanchalik tez-tez qayta yozadi?", ru: 'Как часто организатор заново пишет одно и то же объявление об игре?' };
const S2_IZOH = { uz: "O'yinchilar bo'lmasa o'yin to'lmaydi — shuning uchun ular bepul qoladi.", ru: 'Без игроков игра не наберётся — поэтому они остаются бесплатными.' };
const RolKarta = ({ rol, izoh }) => (
  <div key={rol.id} className="ms-rolk fade-step">
    <span className="ms-rolk-n">{tr(rol.kim)}</span>
    <span className="ms-rolk-q">{tr(rol.nima)}</span>
    <span className={cxx('ms-rolk-p', rol.id === 'oyinchi' ? 'ok' : 'acc')}>{tr(rol.pul)}</span>
    {izoh && <p className="ms-rolk-iz">{tr(izoh)}</p>}
  </div>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [bosildi, setBosildi] = useState(() => (avval ? ['oyinchi', 'tashkilotchi'] : []));
  const [joriy, setJoriy] = useState(avval ? 'tashkilotchi' : null);
  const [proOchiq, setProOchiq] = useState(avval);
  const done = bosildi.length >= 2 && proOchiq;
  const tugadi = useTugadi(done, 900, avval);
  const ipucha = useIpucha(!!taxmin && !done, bosildi.length);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => {
    if (joriy !== 'tashkilotchi' || proOchiq) return undefined;
    const t = setTimeout(() => setProOchiq(true), kamHarakat() ? 0 : 1700);
    return () => clearTimeout(t);
  }, [joriy, proOchiq]);
  const bos = (id) => { if (!taxmin) return; setJoriy(id); setBosildi(b => (b.includes(id) ? b : [...b, id])); };
  const keyingiId = !bosildi.includes('oyinchi') ? 'oyinchi' : !bosildi.includes('tashkilotchi') ? 'tashkilotchi' : null;
  const sahna = tugadi || joriy === 'tashkilotchi'
    ? { tel: 'tashkilotchi', oqim: proOchiq ? 'bitta' : null, haftalar: proOchiq ? 'ozi' : 'yozadi', pro: proOchiq ? 'ochiq' : 'yopiq', ustida: tugadi ? 'bepul' : null }
    : joriy === 'oyinchi' ? { tel: 'oyinchi', sonAcc: true, ustida: 'bepul', pro: 'yopiq' } : { pro: 'yopiq' };
  const rol = MENTOR_ROLLAR.find(r => r.id === (tugadi ? 'tashkilotchi' : joriy));
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  const n = bosildi.length;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · kim to'laydi", ru: 'Понятие · кто платит' })} screen={screen} scrollSignal={n + (taxmin ? 10 : 0) + (tugadi ? 100 : 0)} natija={tugadi && !avval} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Rollarni bosing (${n}/2)`, ru: `Нажмите роли (${n}/2)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Maydon Jamoa pulni <A>kimdan topadi?</A></>, ru: <>От кого Maydon Jamoa <A>получает деньги?</A></> })}
        mentor={<Mentor>{tr({ uz: "O'tgan darsda Pro tashkilotchi uchun reja edi — ikkala rolni birma-bir bosib, nega shunday ekanini ko'ring.", ru: 'На прошлом уроке Pro был планом для организатора — нажмите обе роли по очереди и посмотрите, почему так.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !tugadi && <BashoratQ savol={tr(S2_SAVOL)} javob={tx && tr(tx.t)} />}
        harakat={!tugadi && (
          <div className="ms-harakat">
            <div className="ms-tugmalar">
              {MENTOR_ROLLAR.map((r, i) => (
                <button key={r.id} type="button" disabled={!taxmin} className={cxx('ms-rol', joriy === r.id && 'on', bosildi.includes(r.id) && 'ok', taxmin && keyingiId === r.id && 'ms-halqa')} onClick={() => bos(r.id)}>
                  <i>{bosildi.includes(r.id) ? '✓' : i + 1}</i>{tr(r.kim)}
                </button>
              ))}
            </div>
            {ipucha && <p className="ms-ipucha fade-step">{tr({ uz: "Yoqilgan rol tugmasini bosing — telefonda nima o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку роли — посмотрите, что изменится в телефоне.' })}</p>}
          </div>
        )}
        vizual={<div className={cxx('ms-ikki', !rol && 'yakka', tugadi && 'yakun')}>
          <ModelSahna rejim="mentor" {...sahna} />
          {rol && <RolKarta rol={rol} izoh={rol.id === 'oyinchi' && !tugadi ? S2_IZOH : null} />}
        </div>}
        xulosa={done && tugadi && <XulosaQ natija={<TaxminQ togri={taxmin === 'hafta'} haqiqat={tr({ uz: 'har hafta', ru: 'каждую неделю' })} />}
          matn={tr({ uz: "Mentor rejasida tashkilotchi to'laydi: Pro uning har haftalik e'lonini o'zi qiladi. O'yinchilar bepul qoladi.", ru: 'В плане Ментора платит организатор: Pro сам делает его еженедельное объявление. Игроки остаются бесплатными.' })}
          izoh={tr(S2_IZOH)} />}
      >
        <Ustoz satrlar={USTOZ.s2} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · kim to'laydi", ru: 'Проверка · кто платит' })}
    questionText="Mentor rejasida kim to'laydi va nega?"
    question={tr({ uz: <h2 className="title h-ask">Mentor rejasida <A>kim to'laydi va nega?</A></h2>, ru: <h2 className="title h-ask">Кто платит в плане Ментора <A>и почему?</A></h2> })}
    options={[
      { uz: "O'yinchi: u har o'yinga qo'shiladi", ru: 'Игрок: он присоединяется к каждой игре' },
      { uz: "Maydon egasi: o'yin uning maydonida", ru: 'Владелец поля: игра на его поле' },
      { uz: 'Tashkilotchi: Pro haftalik ishini oladi', ru: 'Организатор: Pro берёт его недельную работу' },
      { uz: "Tashkilotchi: Pro'siz e'lon bera olmaydi", ru: 'Организатор: без Pro не может объявить игру' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Pro tashkilotchining haftalik o'yin e'lonini o'zi qiladi.", ru: 'Pro сам делает еженедельное объявление организатора.' }}
    explainWrong={{
      0: { uz: "O'yinchilar o'yinni to'ldiradi — ular to'lasa, nima bo'ladi?", ru: 'Игроки заполняют игру — что будет, если они будут платить?' },
      1: { uz: 'Maydon egasi ilovadan foydalanadimi? Kim foydalanadi?', ru: 'Пользуется ли владелец поля приложением? Кто пользуется?' },
      3: { uz: "E'lon berish bepul qoladi — unda Pro nimani oladi?", ru: 'Объявлять игру бесплатно — что тогда берёт Pro?' },
      default: { uz: 'Tashkilotchi har hafta nima qilishini eslang.', ru: 'Вспомните, что организатор делает каждую неделю.' }
    }}
    vizual={<ModelSahna kichik rejim="mentor" tel="tashkilotchi" oqim="bitta" ustida="bepul" />} />
);

// ===== SCREEN 4 — BESH YO'L (QTushuncha keng: bashorat → 5 karta ketma-ket, bittadan — E 53; har kartada hodisa → «qo'yish» → sahna → nom → sabab → muhr) =====
const S4_TAXMIN = [{ k: 'bitta', t: { uz: 'Bittasi', ru: 'Один' } }, { k: 'ikki', t: { uz: 'Ikki-uchtasi', ru: 'Два-три' } }, { k: 'hamma', t: { uz: 'Hammasi', ru: 'Все' } }];
const S4_SAVOL = { uz: "Bu yo'llardan nechtasi Maydon Jamoa'ga hozir mos keladi?", ru: 'Сколько из этих путей подходят Maydon Jamoa сейчас?' };
const Muhr = ({ ok, kichik }) => <span className={cxx('ms-muhr', ok ? 'ok' : 'yoq', kichik && 'kichik')}>{tr(ok ? MUHR.tanlandi : MUHR.yoq)}</span>;
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [idx, setIdx] = useState(avval ? 4 : 0);
  const [qoyildi, setQoyildi] = useState(avval);
  const [kech, setKech] = useState(avval);
  const done = idx === 4 && qoyildi;
  const tugadi = useTugadi(done, 1400, avval);
  const ipucha = useIpucha(!!taxmin && !done, idx * 2 + (qoyildi ? 1 : 0));
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => {
    if (!qoyildi || kech || !YOLLAR[idx].kech) return undefined;
    const t = setTimeout(() => setKech(true), kamHarakat() ? 0 : 1600);
    return () => clearTimeout(t);
  }, [qoyildi, kech, idx]);
  const y = YOLLAR[idx];
  const qoy = () => setQoyildi(true);
  const keyingi = () => { setIdx(i => Math.min(4, i + 1)); setQoyildi(false); setKech(false); };
  const sahna = tugadi ? YOLLAR[4].sahna : qoyildi ? (kech && y.kech ? y.kech : y.sahna) : {};
  const nOch = idx + (qoyildi ? 1 : 0);
  const tx = S4_TAXMIN.find(t => t.k === taxmin);
  const nuqtalar = <div className="ms-nuqtalar"><span className="ms-nuqta-ro">{YOLLAR.map((v, i) => <i key={v.id} className={cxx(i < idx && 'ok', i === idx && 'cur')}>{i < idx ? '✓' : ''}</i>)}</span><span className="ms-n5">{idx + 1}{' / '}5</span></div>;
  const karta = !taxmin
    ? <div className="ms-yolk">{nuqtalar}</div>
    : tugadi
    ? <div className="ms-yolk tugadi">{YOLLAR.map((v, i) => <div key={v.id} className={cxx('ms-yol-q', v.tanlandi && 'ok')} style={{ animationDelay: `${i * 0.08}s` }}><b>{tr(v.nom)}</b><Muhr ok={v.tanlandi} kichik /></div>)}</div>
    : (
      <div className="ms-yolk">
        {nuqtalar}
        {idx > 0 && <div className="ms-yol-otgan">{YOLLAR.slice(0, idx).map(v => <div key={v.id} className="ms-yol-q"><b>{tr(v.nom)}</b><Muhr ok={v.tanlandi} kichik /></div>)}</div>}
        <div key={y.id} className="ms-yol-karta">
          <p className="ms-hodisa">{tr(y.hodisa)}</p>
          {!qoyildi
            ? <button type="button" className="ms-qoy ms-halqa" onClick={qoy}>{tr({ uz: "Maydon Jamoa'ga qo'yish", ru: 'Примерить к Maydon Jamoa' })}</button>
            : <>
              <span className="ms-bu">{tr({ uz: 'Bu —', ru: 'Это —' })} <b>{tr(y.nom)}</b></span>
              <span className="ms-tax-y">{tr({ uz: 'Mentorning taxmini', ru: 'Предположение Ментора' })}</span>
              <p className="ms-sabab">{tr(y.sabab)}</p>
              <div className="ms-yol-past"><Muhr ok={y.tanlandi} />{idx < 4 && <button type="button" className="ms-keyingi ms-halqa" onClick={keyingi}>{tr({ uz: "Keyingi yo'l", ru: 'Следующий путь' })} →</button>}</div>
            </>}
        </div>
        {ipucha && <p className="ms-ipucha fade-step">{tr({ uz: "Kartadagi «Maydon Jamoa'ga qo'yish»ni bosing — telefon o'zgaradi.", ru: 'Нажмите на карточке «Примерить к Maydon Jamoa» — телефон изменится.' })}</p>}
      </div>
    );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · pul topish yo'llari", ru: 'Понятие · пути заработка' })} screen={screen} scrollSignal={nOch + (taxmin ? 10 : 0) + (tugadi ? 100 : 0)} natija={taxmin && !avval ? `${idx}-${qoyildi ? 1 : 0}-${kech ? 1 : 0}-${tugadi ? 1 : 0}` : null} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Kartalarni oching (${nOch}/5)`, ru: `Откройте карточки (${nOch}/5)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Maydon Jamoa'ga qaysi yo'l <A>mos keladi?</A></>, ru: <>Какой путь <A>подходит</A> Maydon Jamoa?</> })}
        mentor={<Mentor>{tr({ uz: "Har kartada «Maydon Jamoa'ga qo'yish»ni bosing — telefonda nima o'zgarishini kuzating.", ru: 'На каждой карточке нажмите «Примерить к Maydon Jamoa» — следите, что меняется в телефоне.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !tugadi && <BashoratQ savol={tr(S4_SAVOL)} javob={tx && tr(tx.t)} />}
        vizual={<div className={cxx('ms-ikki keng', tugadi && 'yakun')}><ModelSahna rejim="mentor" {...sahna} />{karta}</div>}
        xulosa={done && tugadi && <XulosaQ natija={<TaxminQ togri={taxmin === 'bitta'} haqiqat={tr({ uz: 'bittasi', ru: 'один' })} />}
          matn={tr({ uz: <>Mahsulot qanday pul topishi — <b>monetizatsiya modeli</b> deyiladi. Mentor yo'llarni solishtirib, bittasini tanladi.</>, ru: <>То, как продукт зарабатывает, называется <b>моделью монетизации</b>. Ментор сравнил пути и выбрал один.</> })} />}
      >
        <Ustoz satrlar={USTOZ.s4} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (✔ A, INLINE_KEYS.s5 = 0) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · model', ru: 'Проверка · модель' })}
    questionText="Pro pullik bo'lsa ham, nega bu «pullik obuna» modeli emas?"
    question={tr({ uz: <h2 className="title h-ask">Pro pullik bo'lsa ham, nega bu <A>«pullik obuna» modeli emas?</A></h2>, ru: <h2 className="title h-ask">Pro платный, но почему это <A>не модель «платная подписка»?</A></h2> })}
    options={[
      { uz: "Pro'dan boshqa hamma ish bepul qoladi", ru: 'Всё, кроме Pro, остаётся бесплатным' },
      { uz: "Pro'ga hali hech kim pul to'lamagan", ru: 'За Pro ещё никто не платил' },
      { uz: 'Pro bilan birga ilovada reklama turadi', ru: 'Вместе с Pro в приложении есть реклама' },
      { uz: "Bepul qism yo'q, hamma Pro'ni oladi", ru: 'Бесплатной части нет, все берут Pro' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Pullik faqat qo'shimcha — asosiy ish hamma uchun bepul.", ru: 'Платное — только дополнение, основное бесплатно для всех.' }}
    explainWrong={{
      1: { uz: "Rost, hali to'lov yo'q. Lekin modelda nima bepul qoladi?", ru: 'Верно, оплаты пока нет. Но что в модели остаётся бесплатным?' },
      2: { uz: "Mentor rejasida reklama yo'q — bepul nima qoladi?", ru: 'В плане Ментора рекламы нет — что остаётся бесплатным?' },
      3: { uz: "Mentor rejasida o'yinchilar Pro oladimi?", ru: 'В плане Ментора игроки берут Pro?' },
      default: { uz: "Pullik obuna modelida kim to'lashini eslang.", ru: 'Вспомните, кто платит в модели платной подписки.' }
    }}
    vizual={<div className="ms-qviz-q"><ModelSahna kichik rejim="mentor" oqim="bitta" ustida="bepul" pro="ochiq" /><Muhr ok /></div>} />
);

// ===== SCREEN 6 — TELEGRAM PREMIUM (QVoqea, PM keys K2: 3 kadr; Mentor bosqich gapini aytadi; bashorat 1/3 da, natija 2/3 da; bankda yo'q narsa chizilmaydi) =====
const K2_KADR = [
  { nom: { uz: '2022-yil iyun', ru: 'Июнь 2022' }, mentor: { uz: '2022-yil iyunda Telegram pullik obunani ishga tushirdi — Telegram Premium.', ru: 'В июне 2022 года Telegram запустил платную подписку — Telegram Premium.' } },
  { nom: { uz: 'Bepul qism', ru: 'Бесплатная часть' }, mentor: { uz: "Bepul Telegram qisqartirilmadi — Premium ustiga qulaylik qo'shdi.", ru: 'Бесплатный Telegram не урезали — Premium добавил удобства сверху.' } },
  { nom: { uz: '2024-yil', ru: '2024 год' }, mentor: { uz: "2024-yilda Premium'ga pullik obuna bo'lganlar uch barobar ko'paydi — 12 million gacha. O'sha yili Telegram birinchi marta foydaga chiqdi.", ru: 'В 2024 году платных подписчиков Premium стало втрое больше — до 12 миллионов. В том же году Telegram впервые вышел в прибыль.' } }
];
const K2_TAXMIN = [{ k: 'hech', t: { uz: 'Hech narsa qisqartirilmadi', ru: 'Ничего не урезали' } }, { k: 'bazi', t: { uz: "Ba'zi narsalar pullik bo'ldi", ru: 'Кое-что стало платным' } }, { k: 'hamma', t: { uz: "Hammasi pullik bo'ldi", ru: 'Всё стало платным' } }];
const K2_SAVOL = { uz: "Premium chiqqanda bepul Telegram'da nima o'zgardi?", ru: 'Что изменилось в бесплатном Telegram, когда вышел Premium?' };
const K2_CHATLAR = [{ uz: 'Sinf chati', ru: 'Чат класса' }, { uz: 'Oila', ru: 'Семья' }, { uz: 'Futbol guruhi', ru: 'Футбольная группа' }];
const TgTelefon = ({ k, kichik }) => (
  <div className={cxx('ms-tg', kichik && 'kichik')}>
    <span className="ms-tg-bar">Telegram</span>
    {k === 1
      ? <div className="ms-tg-qatlam">
        <div className="ms-tg-pre fade-step"><b>Premium</b><span>{tr({ uz: '+ qulaylik', ru: '+ удобство' })}</span></div>
        <div className="ms-tg-bepul"><span className="ms-tg-bn">{tr({ uz: 'Bepul Telegram', ru: 'Бесплатный Telegram' })}</span>{K2_CHATLAR.map((c, i) => <span key={i} className="ms-tg-chat ok"><i />{tr(c)}<b>✓</b></span>)}</div>
      </div>
      : <div className="ms-tg-ro">
        {k === 0 && <span className="ms-tg-chat pre"><i />Telegram Premium</span>}
        {K2_CHATLAR.map((c, i) => <span key={i} className="ms-tg-chat"><i />{tr(c)}</span>)}
      </div>}
  </div>
);
const PremiumSahna = ({ k, ong }) => (
  <div className={cxx('ms-k2', k === 2 && 'uch')}>
    <Zoomable><TgTelefon k={k} kichik={k === 2} /></Zoomable>
    <div className="ms-k2-ong">
      {ong}
      {k === 2 && <>
        <div className="ms-k2-kartalar">
          <div className="ms-k2-k fade-step">
            <span className="ms-k2-y">{tr({ uz: "2024 · Premium'ga pullik obuna bo'lganlar", ru: '2024 · платные подписчики Premium' })}</span>
            <div className="ms-k2-ustun"><i className="bir" /><i className="uch" /></div>
            <b className="ms-k2-son">{tr({ uz: '×3 · 12\u00a0million gacha', ru: '×3 · до 12\u00a0миллионов' })}</b>
          </div>
          <div className="ms-k2-k fade-step" style={{ animationDelay: '.2s' }}>
            <span className="ms-k2-y">{tr({ uz: '2024 · Telegram', ru: '2024 · Telegram' })}</span>
            <b className="ms-k2-f">{tr({ uz: 'birinchi marta foydaga chiqdi', ru: 'впервые вышел в прибыль' })}</b>
            <span className="ms-kulrang-s">{tr({ uz: "daromad — 1\u00a0milliard dollardan ko'p", ru: 'выручка — больше 1\u00a0миллиарда долларов' })}</span>
          </div>
        </div>
        <p className="ms-kulrang">{tr({ uz: "Ikkalasi bir yilda bo'lgan — biri ikkinchisining sababi ekani bu yerda aytilmagan.", ru: 'Оба факта в одном году — что одно стало причиной другого, здесь не сказано.' })}</p>
      </>}
    </div>
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [k, setK] = useState(avval ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = k >= 2;
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (v) => { if (taxmin) return; setTaxmin(v); setTimeout(() => setK(1), kamHarakat() ? 0 : 450); };
  const tx = K2_TAXMIN.find(t => t.k === taxmin);
  const togri = taxmin === 'hech';
  const yorliq = `Telegram Premium · ${k + 1}/3`;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={k} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={!done && (k > 0 || !!taxmin)} disabled={k === 0 && !taxmin} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Voqea davomi (${k + 1}/3)`, ru: `Продолжение истории (${k + 1}/3)` })} onClick={done ? onNext : () => setK(n => Math.min(2, n + 1))} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Telegram pul topish uchun <A>nimani qo'shdi?</A></>, ru: <>Что Telegram <A>добавил,</A> чтобы зарабатывать?</> })}
        nuqtalar={<>
          <Mentor><span key={k} className="fade-step">{tr(K2_KADR[k].mentor)}</span></Mentor>
          <div className="ms-k2-nuqta"><span className="ms-nuqta-ro">{K2_KADR.map((c, i) => <i key={i} className={cxx(i < k && 'ok', i === k && 'cur')}>{i < k ? '✓' : ''}</i>)}</span><b>{yorliq}</b><span className="ms-k2-kadr" key={'n' + k}>{tr(K2_KADR[k].nom)}</span></div>
        </>}
        karta={<PremiumSahna k={k} ong={<>
          {k === 0 && <p className="ms-brend"><b style={{ color: TELEGRAM_RANG }}>Telegram</b> — {tr({ uz: 'xabar almashish ilovasi', ru: 'приложение для обмена сообщениями' })} · <b style={{ color: TELEGRAM_RANG }}>Telegram Premium</b> — {tr({ uz: "Telegram'ning pullik obunasi", ru: 'платная подписка Telegram' })}</p>}
          {k === 0 && !taxmin && <QBashorat yorliq={yorliq} savol={tr(K2_SAVOL)} variantlar={K2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={tanla} />}
          {taxmin && <div className="ms-bashq fade-step"><span>{tr(K2_SAVOL)}</span><span className="ms-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{tx && tr(tx.t)}</b>{k >= 1 && <b className={togri ? 'ok' : 'yoq'}>{togri ? ' ✓' : ' ✕'}</b>}</span></div>}
          {k === 1 && <QTaxmin togri={togri}>{togri ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' }) : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tx && tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'hech narsa qisqartirilmadi', ru: 'ничего не урезали' })}</b></>}</QTaxmin>}
        </>} />}
      >
        {done && <QXulosa>{tr({ uz: "Bu voqeada bepul Telegram qisqartirilmagan, Premium ustiga qo'shilgan. Mentor ham bepul qismni qisqartirmaydi.", ru: 'В этой истории бесплатный Telegram не урезали, Premium добавили сверху. Ментор тоже не урезает бесплатную часть.' })}</QXulosa>}
        <Ustoz satrlar={USTOZ.s6} />
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (✔ D, INLINE_KEYS.s7 = 3; keys ko'prigi) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Telegram Premium', ru: 'Проверка · Telegram Premium' })}
    questionText="Telegram Premium va Mentor tanlovida nima umumiy?"
    question={tr({ uz: <h2 className="title h-ask">Telegram Premium va Mentor tanlovida <A>nima umumiy?</A></h2>, ru: <h2 className="title h-ask">Что общего у Telegram Premium <A>и выбора Ментора?</A></h2> })}
    options={[
      { uz: "Hamma foydalanuvchi har oy pul to'laydi", ru: 'Все пользователи платят каждый месяц' },
      { uz: "To'laydiganlar uch barobar ko'paydi", ru: 'Платящих стало втрое больше' },
      { uz: "Bepul qismdan bir qismi pullik bo'ldi", ru: 'Часть бесплатного стала платной' },
      { uz: "Pullik qism bepul qism ustiga qo'shildi", ru: 'Платная часть добавлена поверх бесплатной' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Ikkalasida ham bepul qism qisqartirilmaydi.', ru: 'В обоих случаях бесплатную часть не урезают.' }}
    explainWrong={{
      0: { uz: "Mentor rejasida o'yinchilar to'laydimi?", ru: 'В плане Ментора игроки платят?' },
      1: { uz: "Bu Telegram'ning soni — Mentor misolida bormi?", ru: 'Это число Telegram — есть ли оно в примере Ментора?' },
      2: { uz: 'Bu voqeada bepul Telegram qisqartirildimi?', ru: 'В этой истории бесплатный Telegram урезали?' },
      default: { uz: "Bepul qism bilan nima bo'lganini eslang.", ru: 'Вспомните, что стало с бесплатной частью.' }
    }}
    vizual={<div className="ms-qviz-ikki"><TgTelefon k={1} kichik /><ModelSahna kichik rejim="mentor" oqim="bitta" ustida="bepul" pro="ochiq" /></div>} />
);

// ===== SCREEN 8 — MODELINGIZ (QMustaqil, USTAXONA: 3 karta ketma-ket, bittadan — E 53; yorliq input ichida — E 43; yozadi pm-m11d2-model) =====
const S8_QISM = [
  { id: 'kim', h: { uz: "Kim to'laydi", ru: 'Кто платит' } },
  { id: 'bepul', h: { uz: 'Nima bepul', ru: 'Что бесплатно' } },
  { id: 'model', h: { uz: 'Model', ru: 'Модель' } }
];
const S8_X = {
  kim: { uz: "Kim to'lashini yozing yoki tugmani bosing.", ru: 'Напишите, кто платит, или нажмите кнопку.' },
  nima: { uz: 'Pullik qism unga nima berishini yozing.', ru: 'Напишите, что ему даёт платная часть.' },
  model: { uz: 'Modellardan bittasini tanlang.', ru: 'Выберите одну из моделей.' },
  sabab: { uz: 'Nega aynan shu — mahsulotdan bitta fakt yozing.', ru: 'Почему именно эта — напишите один факт о продукте.' },
  rad: { uz: 'Kamida bitta modelni rad etib, sababini yozing.', ru: 'Отклоните хотя бы одну модель и напишите причину.' },
  radSabab: { uz: 'Bu model nega mos emasligini yozing.', ru: 'Напишите, почему эта модель не подходит.' },
  funk: { uz: "Har funksiyaga «bepul» yoki «pullik»ni tanlang.", ru: 'Для каждой функции выберите «бесплатно» или «платно».' },
  freemium: { uz: 'Bepul asos tanlandi — bepul nima qoladi?', ru: 'Выбрана бесплатная основа — что остаётся бесплатным?' },
  obuna: { uz: "Bu modelda har foydalanuvchi uchun to'lanadi — shundaymi?", ru: 'В этой модели платят за каждого пользователя — так?' },
  kompaniya: { uz: "Bu modelda foydalanuvchi emas, kompaniya to'laydi.", ru: 'В этой модели платит не пользователь, а компания.' }
};
const YUMSHOQ_YORLIQ = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' };
// Saqlangandan keyin tugma «Yangilash» — yorliq ham shu nomni aytadi (tugma bilan bir xil)
const YUMSHOQ_YORLIQ_Y = { uz: "Shunday qoldirsangiz — yana «Yangilash»ni bosing.", ru: 'Если оставите так — нажмите «Обновить» ещё раз.' };
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const HECH_RE = new RegExp("^(hech narsa|hech nima|yo'q|yoq|" + '\u043d\u0438\u0447\u0435\u0433\u043e|\u043d\u0435\u0442' + ')[.!]?$');
const hammami = (kim) => { const n = normS(kim); return n === HAMMA || n === 'hamma' || n === '\u0432\u0441\u0435 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438'; };
const bepulMatn = (d, prdF) => [...(prdF || []).filter((_, i) => d.funk[i] === 'bepul'), String(d.qosh || '').trim()].filter(Boolean).join(', ');
// Tekshiruv (MD 8-ekran ro'yxati; PM-108 — node da sinalgan): qism → { k, yumshoq } | null
function s8Tekshir(qism, d, prdF) {
  const t = (s) => String(s || '').trim();
  if (qism === 'kim') return !t(d.kim) ? { k: 'kim' } : !t(d.nima) ? { k: 'nima' } : null;
  if (qism === 'bepul') return (prdF && prdF.length && prdF.some((_, i) => !d.funk[i])) ? { k: 'funk' } : null;
  if (!d.model) return { k: 'model' };
  if (t(d.sabab).length < 8) return { k: 'sabab' };
  const rad = (d.rad || []).filter(r => r.model && r.model !== d.model);
  if (rad.length === 0) return { k: 'rad' };
  if (rad.some(r => !t(r.sabab))) return { k: 'radSabab' };
  const bep = bepulMatn(d, prdF);
  if (d.model === 'freemium' && (!bep || HECH_RE.test(normS(bep)))) return { k: 'freemium' };
  if ((d.model === 'reklama' || d.model === 'b2b') && hammami(d.kim)) return { k: 'kompaniya' };
  if (d.model === 'obuna' && !hammami(d.kim)) return { k: 'obuna', yumshoq: true };
  return null;
}
const yangiD = () => ({ kim: '', nima: '', funk: [null, null, null], qosh: '', model: null, sabab: '', rad: [{ model: null, sabab: '' }] });
const dModeldan = (m, prdF) => {
  const bep = String(m.bepul || '');
  const funk = (prdF || []).map(f => (bep.split(',').map(x => x.trim()).includes(f) ? 'bepul' : 'pullik'));
  const qosh = bep.split(',').map(x => x.trim()).filter(x => x && !(prdF || []).includes(x)).join(', ');
  return { kim: String(m.kim || ''), nima: String(m.nima || ''), funk: [...funk, null, null, null].slice(0, 3), qosh, model: m.model || null, sabab: String(m.sabab || ''), rad: Array.isArray(m.rad) && m.rad.length ? m.rad.map(r => ({ model: r.model || null, sabab: String(r.sabab || '') })) : [{ model: null, sabab: '' }] };
};
const sahnaOquvchi = (d, prdF, nom) => {
  const kimT = String(d.kim || '').trim();
  const bepulF = (prdF || []).filter((_, i) => d.funk[i] === 'bepul');
  const pullikF = (prdF || []).filter((_, i) => d.funk[i] === 'pullik');
  if (!(prdF && prdF.length) && String(d.qosh || '').trim()) bepulF.push(String(d.qosh).trim());
  const kompaniya = d.model === 'reklama' || d.model === 'b2b';
  const oqim = kompaniya ? 'tashqi' : hammami(kimT) ? 'hamma' : kimT ? 'bitta' : null;
  return { rejim: 'oquvchi', nom, kim: kimT || null, bepulF, pullikF, oqim, tashqi: kompaniya ? 'bino' : null, ustida: kompaniya ? 'bepulHamma' : oqim === 'bitta' ? 'bepul' : null, tolovchiYorliq: oqim === 'bitta' ? kimT : null };
};
const Kirit = ({ value, onChange, ph, max = 120, err, halqa, iRef, son, aria, ta }) => (ta
  ? <textarea ref={iRef} className={cxx('ms-inp', 'ms-ta', err && 'err', halqa && 'ms-halqa-i')} value={value} maxLength={max} rows={2} placeholder={ph} aria-label={aria || ph} onChange={(e) => onChange(e.target.value)} />
  : <input ref={iRef} className={cxx('ms-inp', err && 'err', halqa && 'ms-halqa-i')} value={value} maxLength={max} placeholder={ph} aria-label={aria || ph} inputMode={son ? 'numeric' : undefined}
    onChange={(e) => onChange(son ? e.target.value.replace(/[^\d]/g, '') : e.target.value)} />);
const ModelimKarta = ({ m, mentor, onTahrir, yangi, ixcham, yon }) => {
  const nom = (k) => tr(MODEL_NOM[k] || { uz: '…', ru: '…' });
  const v = (x) => (typeof x === 'object' && x ? tr(x) : String(x || '').trim() || '—');
  const qatorlar = [
    { q: 'kim', k: { uz: "Kim to'laydi", ru: 'Кто платит' }, v: v(m.kim) },
    { q: 'kim', k: { uz: 'Nima uchun', ru: 'За что' }, v: v(m.nima) },
    { q: 'bepul', k: { uz: 'Bepul qoladi', ru: 'Остаётся бесплатным' }, v: v(m.bepul) },
    { q: 'model', k: { uz: 'Sabab', ru: 'Причина' }, v: v(m.sabab) },
    ...(m.rad || []).filter(r => r.model).map(r => ({ q: 'model', k: { uz: 'Rad etildi', ru: 'Отклонено' }, v: `${nom(r.model)} — ${v(r.sabab)}` }))
  ];
  return (
    <div className={cxx('ms-modelim', ixcham && 'ixcham')}>
      <span className="q-yorliq">{mentor ? tr({ uz: 'Mentor misoli · Modelim', ru: 'Пример Ментора · Моя модель' }) : tr({ uz: 'Modelim', ru: 'Моя модель' })}</span>
      <b className="ms-modelim-n">{nom(m.model)}</b>
      {qatorlar.map((r, i) => (
        <p key={i} className={cxx('ms-mq', yangi === r.q && 'yangi', yon && yon.includes(r.k.uz) && 'yon')}>
          <span>{tr(r.k)}:</span> <b>{r.v}</b>
          {onTahrir && <button type="button" className="ms-tahrir" aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })} onClick={() => onTahrir(r.q)}>✎</button>}
        </p>
      ))}
    </div>
  );
};
const S8_YORDAM = [
  { uz: "Mentor misolida: kim to'laydi — tashkilotchi; nima uchun — «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi; bepul qoladi — o'yin e'loni, qo'shilish, chiqish va navbat; model — bepul asos va pullik qo'shimcha; sabab — o'yinchilar bo'lmasa o'yin to'lmaydi; rad etildi — pullik obuna: Telegram guruhi bepul.", ru: 'В примере Ментора: платит — организатор; за что — «Постоянная игра»: каждую неделю в тот же день и час игра объявляется сама; бесплатно — объявление игры, присоединение, выход и очередь; модель — бесплатная основа и платное дополнение; причина — без игроков игра не наберётся; отклонено — платная подписка: Telegram-группа бесплатна.' },
  { uz: "Mentorning tanlovi sizga majburiy emas: mahsulotingizda boshqa model mos kelishi mumkin. To'lovchi — rol bilan («ota-ona», «o'quv markazi»), ism emas. Web-trekda ham shunday.", ru: 'Выбор Ментора не обязателен: вашему продукту может подойти другая модель. Плательщик — ролью («родитель», «учебный центр»), не именем. В веб-треке так же.' }
];
const Screen8 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [kir] = useState(() => {
    const prd = prdOl(); const prdF = prd ? prd.funksiyalar : [];
    const m = modelOl(); const b = birlikOl();
    const d = m ? dModeldan(m, prdF) : { ...yangiD(), kim: b && b.kimTolaydi ? String(b.kimTolaydi) : '' };
    return { prd, prdF, d, saqlangan: !!m, oldin: !m && !!(b && b.kimTolaydi), nom: nomOl() };
  });
  const prdF = kir.prdF;
  const [d, setD] = useState(kir.d);
  const [qism, setQism] = useState(kir.saqlangan ? 3 : 0);
  const [saqlandi, setSaqlandi] = useState(kir.saqlangan || !!storedAnswer);
  const [tahrir, setTahrir] = useState(null);
  const [xato, setXato] = useState(null);
  const [yumshoqOtdi, setYumshoqOtdi] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [radI, setRadI] = useState(0);
  const toliq = saqlandi && qism >= 3;
  const tugadi = useTugadi(toliq && tahrir === null, 1100, kir.saqlangan);
  const o = (patch) => { setD(x => ({ ...x, ...patch })); setXato(null); setYumshoqOtdi(null); };
  const joriy = tahrir !== null ? tahrir : qism < 3 ? S8_QISM[qism].id : null;
  const saqla = () => {
    const tartib = tahrir !== null ? ['kim', 'bepul', 'model'] : [joriy];
    for (const q of tartib) {
      const x = s8Tekshir(q, d, prdF);
      if (x && !(x.yumshoq && yumshoqOtdi === x.k)) { setXato(x); if (x.yumshoq) setYumshoqOtdi(x.k); return; }
    }
    setXato(null); setYumshoqOtdi(null);
    if (joriy !== 'model' && tahrir === null) { setQism(q => q + 1); setYordam(false); return; }
    const eski = modelOl() || {};
    const p10 = (answers && answers[10]) || {};
    const soniBor = Object.prototype.hasOwnProperty.call(eski, 'soni') && eski.soniManba !== undefined;
    const rec = {
      model: d.model, kim: String(d.kim).trim(), nima: String(d.nima).trim(), bepul: bepulMatn(d, prdF), sabab: String(d.sabab).trim(),
      rad: d.rad.filter(r => r.model && r.model !== d.model).map(r => ({ model: r.model, sabab: String(r.sabab).trim() })),
      soni: soniBor ? eski.soni : (p10.soniManba !== undefined ? p10.soni : null),
      soniManba: soniBor ? eski.soniManba : (p10.soniManba !== undefined ? p10.soniManba : null),
      soniAsos: soniBor ? (eski.soniAsos ?? null) : (p10.soniManba !== undefined ? (p10.soniAsos ?? null) : null),
      savedAt: Date.now()
    };
    lsY(MODEL_KEY, rec);
    setYangi(tahrir || 'model'); setTimeout(() => setYangi(null), 1300);
    setQism(3); setTahrir(null); setYordam(false);
    if (!saqlandi) {
      setSaqlandi(true);
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'model', solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const xatoEl = xato && <QXato>{tr(S8_X[xato.k])}{xato.yumshoq && <span className="ms-yumshoq"> {tr(saqlandi ? YUMSHOQ_YORLIQ_Y : YUMSHOQ_YORLIQ)}</span>}</QXato>;
  const err = (k) => !!(xato && !xato.yumshoq && xato.k === k);
  const n = Math.min(qism, 3);
  const sahna = sahnaOquvchi(d, prdF, kir.nom);
  const radModellar = (i) => MODEL_TARTIB.filter(mk => mk !== d.model && !d.rad.some((r, j) => j !== i && r.model === mk));
  const kartaIchi = joriy === 'kim' ? (
    <>
      {kir.prd && kir.prd.kim && <p className="ms-kulrang">{tr({ uz: 'PRD da kim uchun', ru: 'В PRD для кого' })}: {qisqa(kir.prd.kim, 60)}</p>}
      <div className="ms-inp-q">
        <Kirit value={hammami(d.kim) ? tr(MODEL_KIM.obuna) : d.kim} onChange={(v) => o({ kim: v })} ph={tr({ uz: "Kim to'laydi? Rolini yozing, ism emas", ru: 'Кто платит? Напишите роль, не имя' })} err={err('kim')} halqa={!String(d.kim).trim()} max={60} />
        <button type="button" className={cxx('q-chip', hammami(d.kim) && 'on')} onClick={() => o({ kim: hammami(d.kim) ? '' : HAMMA })}>{tr({ uz: 'Hamma foydalanuvchi', ru: 'Все пользователи' })}</button>
      </div>
      {kir.oldin && <span className="ms-kulrang-s">{tr({ uz: "o'tgan darsdagi javobingiz", ru: 'ваш ответ с прошлого урока' })}</span>}
      <Kirit ta value={d.nima} onChange={(v) => o({ nima: v })} ph={tr({ uz: 'Nima uchun to\'laydi? Pullik qism unga nima beradi', ru: 'За что платит? Что ему даёт платная часть' })} err={err('nima')} halqa={!!String(d.kim).trim() && !String(d.nima).trim()} max={140} />
    </>
  ) : joriy === 'bepul' ? (
    <>
      {prdF.length > 0
        ? <>
          <div className="ms-funk">{prdF.map((f, i) => (
            <div key={i} className={cxx('ms-funk-q', err('funk') && !d.funk[i] && 'err')}><span>{f}</span>
              <span className="ms-funk-t">{['bepul', 'pullik'].map(v => <button key={v} type="button" className={cxx('q-chip', d.funk[i] === v && 'on')} onClick={() => { const fn = [...d.funk]; fn[i] = v; o({ funk: fn }); }}>{tr(v === 'bepul' ? { uz: 'bepul', ru: 'бесплатно' } : { uz: 'pullik', ru: 'платно' })}</button>)}</span>
            </div>))}</div>
          <Kirit value={d.qosh} onChange={(v) => o({ qosh: v })} ph={tr({ uz: "Yana nima bepul qoladi? Bo'lmasa — bo'sh qoldiring", ru: 'Что ещё остаётся бесплатным? Если нет — оставьте пустым' })} max={120} />
          <p className="ms-jonli">{tr({ uz: 'Bepul', ru: 'Бесплатно' })}: <b>{d.funk.filter(x => x === 'bepul').length}</b> · {tr({ uz: 'pullik', ru: 'платно' })}: <b>{d.funk.filter(x => x === 'pullik').length}</b></p>
        </>
        : <Kirit ta value={d.qosh} onChange={(v) => o({ qosh: v })} ph={tr({ uz: "Bepul qismda nima qoladi? Hech narsa bo'lmasa — shunday yozing", ru: 'Что остаётся в бесплатной части? Если ничего — так и напишите' })} halqa={!String(d.qosh).trim()} max={140} />}
    </>
  ) : joriy === 'model' ? (
    <>
      <div className="ms-modellar">{MODEL_TARTIB.map(mk => (
        <button key={mk} type="button" className={cxx('ms-mbtn', d.model === mk && 'on', err('model') && 'err')} onClick={() => o({ model: mk, rad: d.rad.map(r => (r.model === mk ? { ...r, model: null } : r)) })}>
          <b>{tr(MODEL_NOM[mk])}</b><span>{tr(MODEL_KIM[mk])}</span>
        </button>))}</div>
      <Kirit value={d.sabab} onChange={(v) => o({ sabab: v })} ph={tr({ uz: 'Nega aynan shu? Mahsulotingizdan bitta fakt yozing', ru: 'Почему именно эта? Напишите один факт о продукте' })} err={err('sabab')} halqa={!!d.model && String(d.sabab).trim().length < 8} max={140} />
      <div className="ms-rad">
        <span className="q-yorliq">{tr({ uz: 'Rad etgan modelingiz', ru: 'Отклонённая модель' })}</span>
        {d.rad.map((r, i) => (
          <div key={i} className="ms-rad-q">
            <span className="ms-rad-t">{radModellar(i).map(mk => <button key={mk} type="button" className={cxx('q-chip', r.model === mk && 'on', err('rad') && 'err')} onClick={() => { const rr = d.rad.map((x, j) => (j === i ? { ...x, model: mk } : x)); o({ rad: rr }); setRadI(i); }}>{tr(MODEL_NOM[mk])}</button>)}</span>
            {r.model && <Kirit value={r.sabab} onChange={(v) => o({ rad: d.rad.map((x, j) => (j === i ? { ...x, sabab: v } : x)) })} ph={tr({ uz: 'Nega mos emas?', ru: 'Почему не подходит?' })} err={err('radSabab') && !String(r.sabab).trim()} halqa={radI === i && !String(r.sabab).trim()} max={120} />}
          </div>
        ))}
        {d.rad.length < 4 && d.rad.every(r => r.model) && <button type="button" className="ms-yana" onClick={() => { o({ rad: [...d.rad, { model: null, sabab: '' }] }); setRadI(d.rad.length); }}>{tr({ uz: '+ Yana bitta', ru: '+ Ещё одну' })}</button>}
      </div>
    </>
  ) : null;
  const qi = joriy ? S8_QISM.findIndex(q => q.id === joriy) : 2;
  const karta = joriy && (
    <div key={joriy + (tahrir ? '-t' : '')} className={cxx('ms-karta', xato && !xato.yumshoq && 'err')}>
      <span className="q-yorliq">{qi + 1}{' / '}3 · {tr(S8_QISM[qi].h)}</span>
      {kartaIchi}
      {xatoEl}
      {yordam && <div className="ms-yordam fade-step">{S8_YORDAM.map((y, i) => <p key={i}>{tr(y)}</p>)}</div>}
      <div className="ms-karta-tug">
        <QTugma className="ms-halqa" onClick={saqla}>{joriy === 'model' || tahrir ? (saqlandi ? tr({ uz: 'Yangilash', ru: 'Обновить' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })) : tr({ uz: 'Keyingi', ru: 'Далее' })}</QTugma>
        <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
  const strip = !isMentor && (
    <div className="ms-strip-ro">
      <span className="ms-strip">{tr({ uz: 'Modelim', ru: 'Моя модель' })} · {toliq ? '✓' : `${n}/3`}</span>
      {S8_QISM.map((q, i) => <span key={q.id} className={cxx('ms-qism', (i < n || toliq) && 'ok', joriy === q.id && 'cur')}><i>{i < n || toliq ? '✓' : i + 1}</i>{tr(q.h)}</span>)}
    </div>
  );
  const m = modelOl();
  const xulosa = m && `${tr(MODEL_NOM[m.model])}: ${m.kim} ${tr({ uz: "to'laydi", ru: 'платит' })} — ${m.nima}.${m.bepul ? ` ${tr({ uz: 'Bepul qoladi', ru: 'Бесплатно остаётся' })}: ${m.bepul}.` : ''}`;
  const forma = isMentor
    ? <div className="ms-ish yakuniy"><ModelSahna rejim="mentor" oqim="bitta" ustida="bepul" pro="ochiq" /><ModelimKarta m={MENTOR_MODEL} mentor /></div>
    : toliq && tahrir === null && m
      ? <div className="ms-fokus">
        <div className="ms-ish yakuniy"><Zoomable><ModelSahna {...sahnaOquvchi(dModeldan(m, prdF), prdF, kir.nom)} /></Zoomable><ModelimKarta m={m} yangi={yangi} onTahrir={(q) => { setTahrir(q); setXato(null); }} /></div>
        <p className="ms-kulrang">{tr({ uz: "Hali hech kim to'lamagan — bu tanlov ham taxmin.", ru: 'Ещё никто не платил — этот выбор тоже предположение.' })}</p>
        {tugadi && <QXulosa>{xulosa}</QXulosa>}
      </div>
      : <div className="ms-ish"><Zoomable><ModelSahna {...sahna} /></Zoomable>{karta}</div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · model', ru: 'Самостоятельная работа · модель' })} screen={screen} scrollSignal={qism * 10 + (tahrir ? 1 : 0)} natija={isMentor ? null : joriy === 'model' ? `k3-${d.rad.length}-${d.rad.filter(r => r.model).length}-${xato ? xato.k : ''}` : (toliq && tahrir === null && tugadi && !kir.saqlangan ? 'fin' : null)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi && !isMentor} label={saqlandi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : qism >= 2 ? tr({ uz: 'Saqlang', ru: 'Сохраните' }) : tr({ uz: `Kartalarni to'ldiring (${n}/3)`, ru: `Заполните карточки (${n}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingizga kim va <A>nima uchun to'laydi?</A></>, ru: <>Кто и <A>за что платит</A> в вашем продукте?</> })}
        mentor={<Mentor>{tr({ uz: "Har kartani to'ldirib, «Keyingi»ni bosing — model oxirgi kartada tanlanadi.", ru: 'Заполните каждую карточку и нажмите «Далее» — модель выбирается на последней карточке.' })}</Mentor>}
        qadamlar={strip}
        forma={forma}
      >
        <MentorPracticeStats live={live} screen={screen} yorliq={{ uz: 'Modelni saqlaganlar', ru: 'Сохранили модель' }} />
        <Ustoz satrlar={USTOZ.s8} />
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — JUFTLIKDA TEKSHIRUV (QMustaqil; 3 qadam: Ayting · Belgilang · Tuzating; jonli darsda juftlik, aks holda yakka rejim; varaq kalitga yozilmaydi) =====
const SHERIK_SAVOL = [
  { savol: { uz: "Kim to'laydi va nima uchun to'laydi — aniq aytildimi?", ru: 'Кто платит и за что — сказано ясно?' }, karta: 'kim' },
  { savol: { uz: 'Nega aynan shu model — sabab mahsulotdagi faktdanmi?', ru: 'Почему именно эта модель — причина из факта о продукте?' }, karta: 'model' }
];
const S9_QADAM = [{ uz: 'Ayting', ru: 'Скажите' }, { uz: 'Belgilang', ru: 'Отметьте' }, { uz: 'Tuzating', ru: 'Исправьте' }];
const YOMON_RE = new RegExp('(yomon|zerikarli|yoqmadi|\u043f\u043b\u043e\u0445|\u0441\u043a\u0443\u0447\u043d|\u043d\u0435 \u043f\u043e\u043d\u0440\u0430\u0432)');
const s9Tekshir = (belgi, izoh, otdi) => {
  if (belgi.some(b => !b)) return { k: 'belgi' };
  const i = belgi.findIndex((b, j) => b === 'x' && String(izoh[j] || '').trim().length < 8);
  if (i >= 0) return { k: 'izoh' };
  if (!otdi && izoh.some((z, j) => belgi[j] === 'x' && YOMON_RE.test(normS(z)))) return { k: 'odam', yumshoq: true };
  return null;
};
const S9_X = {
  belgi: { uz: "Har savolga ✓ yoki ✕ qo'ying.", ru: 'Поставьте ✓ или ✕ на каждый вопрос.' },
  izoh: { uz: "✕ qo'ydingiz — nima yetishmaganini bir qatorda yozing.", ru: 'Вы поставили ✕ — напишите в одну строку, чего не хватило.' },
  odam: { uz: 'Odam haqida emas — modelda nima yetishmadi?', ru: 'Не о человеке — чего не хватило в модели?' },
  ozgarmadi: { uz: "Karta o'zgarmadi — sherigingiz izohini qayta o'qing.", ru: 'Карточка не изменилась — перечитайте комментарий партнёра.' }
};
const fmtVaqt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const juft = isStudent || isMentor;
  const [m, setM] = useState(modelOl);
  const s = storedAnswer || {};
  const [bosqich, setBosqich] = useState(s.bosqich || 'ayt');
  const [boshla, setBoshla] = useState(null);
  const [vaqt, setVaqt] = useState(0);
  const [belgi, setBelgi] = useState(s.belgi || [null, null]);
  const [izoh, setIzoh] = useState(s.izoh || ['', '']);
  const [ozg, setOzg] = useState(s.ozgartirildi || [false, false]);
  const [tahrir, setTahrir] = useState(null);
  const [td, setTd] = useState(null);
  const [xato, setXato] = useState(null);
  const [otdi, setOtdi] = useState(false);
  const [yangi, setYangi] = useState(null);
  useEffect(() => { if (!boshla) return undefined; const t = setInterval(() => setVaqt(Math.floor((Date.now() - boshla) / 1000)), 250); return () => clearInterval(t); }, [boshla]);
  const tayyor = bosqich === 'tayyor';
  const yoz = (patch) => onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'sherik', bosqich, belgi, izoh, ozgartirildi: ozg, ...patch, solved: patch.bosqich === 'tayyor' || tayyor, correct: true, picked: true });
  const toxtat = () => { setBoshla(null); setBosqich('belgi'); };
  const belgiladim = () => {
    const x = s9Tekshir(belgi, izoh, otdi);
    if (x) { setXato(x); if (x.yumshoq) setOtdi(true); return; }
    setXato(null);
    const keyin = belgi.every(b => b === 'v') || !m ? 'tayyor' : 'tuzat';
    setBosqich(keyin); yoz({ bosqich: keyin });
    if (keyin === 'tayyor' && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const och = (i) => { if (!m || belgi[i] !== 'x') return; const q = SHERIK_SAVOL[i].karta; setTahrir(i); setTd(q === 'kim' ? { kim: m.kim, nima: m.nima } : { model: m.model, sabab: m.sabab }); setXato(null); };
  const tSaqla = () => {
    const q = SHERIK_SAVOL[tahrir].karta;
    const ozgardi = q === 'kim' ? (String(td.kim).trim() !== String(m.kim).trim() || String(td.nima).trim() !== String(m.nima).trim()) : (td.model !== m.model || String(td.sabab).trim() !== String(m.sabab).trim());
    if (!ozgardi) { setXato({ k: 'ozgarmadi' }); return; }
    const t = (v) => String(v || '').trim();
    if (q === 'kim' && (!t(td.kim) || !t(td.nima))) { setXato({ k8: !t(td.kim) ? 'kim' : 'nima' }); return; }
    if (q === 'model' && t(td.sabab).length < 8) { setXato({ k8: 'sabab' }); return; }
    const rec = { ...m, ...(q === 'kim' ? { kim: t(td.kim), nima: t(td.nima) } : { model: td.model, sabab: t(td.sabab), rad: (m.rad || []).filter(r => r.model !== td.model) }), savedAt: Date.now() };
    const prdF9 = (prdOl() || {}).funksiyalar || [];
    const xm = s8Tekshir('model', dModeldan(rec, prdF9), prdF9);
    if (xm && !xm.yumshoq) { setXato({ k8: xm.k }); return; }
    lsY(MODEL_KEY, rec); setM(rec);
    const oz = ozg.map((v, j) => (j === tahrir ? true : v)); setOzg(oz);
    setYangi(q); setTimeout(() => setYangi(null), 1300);
    setTahrir(null); setTd(null); setXato(null);
    const hammasi = belgi.every((b, j) => b === 'v' || oz[j]);
    if (hammasi) { setBosqich('tayyor'); yoz({ bosqich: 'tayyor', ozgartirildi: oz }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
    else yoz({ ozgartirildi: oz });
  };
  const qi = bosqich === 'ayt' ? 0 : bosqich === 'belgi' ? 1 : 2;
  const mentorGap = !juft
    ? { uz: "Savollarni o'zingizga bering va har biriga halol belgi qo'ying.", ru: 'Задайте вопросы себе и честно отметьте каждый.' }
    : bosqich === 'ayt' ? { uz: "Avval «1 daqiqani boshlash»ni bosib gapiring — keyin qurilmangizni uzating, u har savolga belgi qo'yadi.", ru: 'Сначала нажмите «Начать 1 минуту» и говорите — потом передайте устройство, он отметит каждый вопрос.' }
      : bosqich === 'belgi' ? { uz: "Gap tugagach, qurilmangizni sherigingizga bering — u har savolga ✓ yoki ✕ qo'yadi.", ru: 'Когда закончите, дайте устройство партнёру — он поставит ✓ или ✕ на каждый вопрос.' }
        : { uz: "✕ olgan qatorni bosib, sherigingiz izohiga qarab kartani o'zgartiring.", ru: 'Нажмите строку с ✕ и измените карточку по комментарию партнёра.' };
  const mk = m || MENTOR_MODEL;
  const s9Prd = ((prdOl() || {}).funksiyalar) || [];
  const s9Sahna = m
    ? <ModelSahna key={m.savedAt || 0} {...sahnaOquvchi(dModeldan(m, s9Prd), s9Prd, nomOl())} />
    : <ModelSahna rejim="mentor" oqim="bitta" ustida="bepul" />;
  const chap = (
    <div className="ms-s9-chap">
      <div className="ms-s9-mk">
      <div className="ms-s9-sahna">{s9Sahna}</div>
      {tahrir !== null && td ? (
        <div className="ms-karta fade-step">
          <span className="q-yorliq">{tr(SHERIK_SAVOL[tahrir].karta === 'kim' ? S8_QISM[0].h : S8_QISM[2].h)}</span>
          {SHERIK_SAVOL[tahrir].karta === 'kim'
            ? <><Kirit value={td.kim} onChange={(v) => setTd({ ...td, kim: v })} ph={tr({ uz: "Kim to'laydi? Rolini yozing, ism emas", ru: 'Кто платит? Напишите роль, не имя' })} max={60} />
              <Kirit ta value={td.nima} onChange={(v) => setTd({ ...td, nima: v })} ph={tr({ uz: "Nima uchun to'laydi? Pullik qism unga nima beradi", ru: 'За что платит? Что ему даёт платная часть' })} max={140} /></>
            : <><div className="ms-modellar">{MODEL_TARTIB.filter(k => !((m.rad || []).length === 1 && m.rad[0].model === k)).map(k => <button key={k} type="button" className={cxx('ms-mbtn', td.model === k && 'on')} onClick={() => setTd({ ...td, model: k })}><b>{tr(MODEL_NOM[k])}</b><span>{tr(MODEL_KIM[k])}</span></button>)}</div>
              <Kirit value={td.sabab} onChange={(v) => setTd({ ...td, sabab: v })} ph={tr({ uz: 'Nega aynan shu? Mahsulotingizdan bitta fakt yozing', ru: 'Почему именно эта? Напишите один факт о продукте' })} max={140} /></>}
          {xato && <QXato>{xato.k ? tr(S9_X[xato.k]) : tr(S8_X[xato.k8])}</QXato>}
          <div className="ms-karta-tug"><QTugma className="ms-halqa" onClick={tSaqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
        </div>
      ) : <ModelimKarta m={mk} mentor={!m} ixcham yangi={yangi} />}
      </div>
      {bosqich === 'ayt' && (
        <div className="ms-taymer">
          {juft && <p className="ms-kulrang">{tr({ uz: 'Avval A aytadi, B tinglaydi; keyin almashasiz.', ru: 'Сначала A говорит, B слушает; потом меняетесь.' })}</p>}
          <div className="ms-taymer-ro">
            <span className="ms-taymer-y"><i style={{ width: `${Math.min(100, (vaqt / 60) * 100)}%` }} /></span>
            <b className="ms-taymer-s">{vaqt <= 60 ? fmtVaqt(vaqt) : <>1:00 <em>+{fmtVaqt(vaqt - 60)}</em></>}</b>
          </div>
          {!boshla
            ? <QTugma className="ms-halqa" onClick={() => { setVaqt(0); setBoshla(Date.now()); }}>{tr({ uz: '1 daqiqani boshlash', ru: 'Начать 1 минуту' })}</QTugma>
            : <QTugma className="ms-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
        </div>
      )}
    </div>
  );
  const varaq = bosqich !== 'ayt' && (
    <div className="ms-varaq fade-step">
      <span className="q-yorliq">{juft ? tr({ uz: 'Tekshiruv varag\'i · sherik to\'ldiradi', ru: 'Лист проверки · заполняет партнёр' }) : tr({ uz: "Tekshiruv varag'i", ru: 'Лист проверки' })}</span>
      {SHERIK_SAVOL.map((q, i) => (
        <div key={i} className={cxx('ms-vq', belgi[i] === 'v' && 'ok', belgi[i] === 'x' && 'yoq', bosqich === 'tuzat' && belgi[i] === 'x' && !ozg[i] && 'bos')}
          onClick={bosqich === 'tuzat' ? () => och(i) : undefined} role={bosqich === 'tuzat' && belgi[i] === 'x' ? 'button' : undefined}>
          <span className="ms-vq-s"><i>{i + 1}</i>{tr(q.savol)}</span>
          <span className="ms-vq-b">
            {bosqich === 'belgi'
              ? [['v', '✓'], ['x', '✕']].map(([k, t]) => <button key={k} type="button" className={cxx('ms-belgi', k, belgi[i] === k && 'on', !belgi[i] && 'ms-chorla-b')} onClick={() => { const b = [...belgi]; b[i] = k; setBelgi(b); setXato(null); }}>{t}</button>)
              : <b className={belgi[i] === 'v' ? 'okc' : 'errc'}>{belgi[i] === 'v' ? '✓' : '✕'}</b>}
            {ozg[i] && <em className="ms-ozg">{tr({ uz: "o'zgartirildi", ru: 'изменено' })}</em>}
          </span>
          {bosqich === 'belgi' && belgi[i] === 'x' && <Kirit value={izoh[i]} onChange={(v) => { const z = [...izoh]; z[i] = v; setIzoh(z); setXato(null); setOtdi(false); }} ph={tr({ uz: 'Nima yetishmadi?', ru: 'Чего не хватило?' })} halqa={String(izoh[i]).trim().length < 8} max={120} />}
          {bosqich !== 'belgi' && belgi[i] === 'x' && izoh[i] && <span className="ms-vq-iz">{izoh[i]}</span>}
        </div>
      ))}
      {bosqich === 'belgi' && <>{xato && <QXato>{tr(S9_X[xato.k])}</QXato>}<div className="ms-karta-tug"><QTugma className={cxx(belgi.every(Boolean) && 'ms-halqa')} onClick={belgiladim}>{tr({ uz: 'Belgiladim', ru: 'Отметил' })}</QTugma></div></>}
    </div>
  );
  const nX = belgi.filter(b => b === 'v').length;
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qi * 10 + (tahrir !== null ? 1 : 0)} natija={tayyor ? 'tayyor' : tahrir !== null ? 't' + tahrir + (xato ? '-x' : '') : null} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor && !isMentor} label={tayyor || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `${qi + 1}-qadam: ${tr(S9_QADAM[qi])}`, ru: `Шаг ${qi + 1}: ${tr(S9_QADAM[qi])}` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={juft ? tr({ uz: <>Modelingizni sherigingizga <A>tushuntira olasizmi?</A></>, ru: <>Сможете <A>объяснить модель</A> партнёру?</> }) : tr({ uz: <>Modelingizni o'zingiz <A>tekshira olasizmi?</A></>, ru: <>Сможете <A>сами проверить</A> свою модель?</> })}
        mentor={<Mentor><span key={bosqich + juft} className="fade-step">{tr(mentorGap)}</span></Mentor>}
        qadamlar={<div className="ms-strip-ro">{S9_QADAM.map((q, i) => <span key={i} className={cxx('ms-qism', (i < qi || tayyor) && 'ok', i === qi && !tayyor && 'cur')}><i>{i < qi || tayyor ? '✓' : i + 1}</i>{tr(q)}</span>)}</div>}
        forma={<>
          <div className={cxx('ms-s9', bosqich === 'ayt' && 'yakka')}>{chap}{varaq}</div>
          {tayyor && (belgi.every(b => b === 'v')
            ? <QXulosa>{tr({ uz: 'Ikkala savolga javob bor: modelingiz sababi bilan aytildi.', ru: 'На оба вопроса есть ответ: модель названа с причиной.' })}</QXulosa>
            : m && belgi.every((b, j) => b === 'v' || ozg[j])
              ? <QXulosa>{tr({ uz: `Ikki savoldan ${nX} tasiga ✓; ✕ qatorlarda karta o'zgartirildi.`, ru: `Из двух вопросов ✓ — ${nX}; в строках с ✕ карточка изменена.` })}</QXulosa>
              : null)}
        </>}
      >
        <MentorPracticeStats live={live} screen={screen} yorliq={{ uz: 'Tekshiruvni tugatganlar', ru: 'Закончили проверку' }} />
        <Ustoz satrlar={USTOZ.s9} />
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — KOD YOZISH: SQL (QKod, Neon varianti — kod oynasi o'rnida Neon maketi; darvoza-mashq → vazifa → son / taxmin / «Hozircha bilmayman») =====
const S10_DARVOZA = [
  { id: 'distinct', t: 'COUNT(DISTINCT g.tashkilotchi_id)', ok: true },
  { id: 'oddiy', t: 'COUNT(g.tashkilotchi_id)', x: { uz: "Bu har o'yin e'lonini sanaydi — u uch marta kiradi.", ru: 'Это считает каждое объявление — он войдёт три раза.' } },
  { id: 'yulduz', t: 'COUNT(*)', x: { uz: "Bu o'yinlar qatorini sanaydi, tashkilotchilarni emas.", ru: 'Это считает строки игр, а не организаторов.' } }
];
const S10_QADAM = [
  { uz: "Neon'da loyihangizni tanlang va SQL Editor'ni oching.", ru: 'В Neon выберите свой проект и откройте SQL Editor.' },
  { uz: "To'lovchi rolingiz qaysi jadvalda ekanini toping va SQL'ni o'zingiz yozing.", ru: 'Найдите, в какой таблице роль плательщика, и напишите SQL сами.' },
  { uz: "«Run»ni bosing va Neon ko'rsatgan sonni pastga yozing.", ru: 'Нажмите «Run» и запишите ниже число, которое покажет Neon.' }
];
const S10_X = {
  son: { uz: "Neon ko'rsatgan sonni shu yerga yozing.", ru: 'Запишите сюда число, которое показал Neon.' },
  taxmin: { uz: "Taxminingizni yozing yoki «Hozircha bilmayman»ni bosing.", ru: 'Напишите предположение или нажмите «Пока не знаю».' },
  asos: { uz: 'Taxmin nimaga tayanganini yozing.', ru: 'Напишите, на что опирается предположение.' }
};
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul 1-dars QKOD_ONG naqshi)
const QKOD_ONG = 'muh\u0061rrir';
const NeonMaket = ({ ochiq, run, onRun, mRef }) => (
  <div className="ms-neon">
    <div className="ms-neon-bar"><b>SQL Editor</b><button type="button" className={cxx('ms-run', ochiq && !run && 'ms-halqa')} disabled={!ochiq || run} onClick={onRun}>Run</button></div>
    <pre className="ms-sql">{SQL_QATOR[0]}<span key={ochiq ? 'd' : 'b'} className={cxx('ms-sql-b', ochiq && 'ochiq')}>{ochiq ? SQL_QATOR[1] : '______'}</span>{SQL_QATOR[2]}{'\n'}{SQL_QATOR[3]}{'\n'}{SQL_QATOR[4]}{'\n'}{SQL_QATOR[5]}</pre>
    <div className="ms-neon-jad"><span className="ms-neon-h">count</span><span ref={mRef} key={run ? 'r' : 'n'} className={cxx('ms-neon-q', run && 'ok')}>{run ? MENTOR_SONI : '?'}</span></div>
    {run && <p className="ms-izoh-q fade-step">{tr({ uz: "Mentor misolida — 6 tashkilotchi: o'tgan darsdagi son shu SQL'dan.", ru: 'В примере Ментора — 6 организаторов: число прошлого урока — из этого SQL.' })}</p>}
  </div>
);
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const achMiss = useContext(AchMissCtx);
  const s = storedAnswer || {};
  const [darvoza, setDarvoza] = useState(s.solved ? 'distinct' : null);
  const [dXato, setDXato] = useState(null);
  const birinchiRef = useRef(s.solved ? !!s.birinchi : null);
  const [run, setRun] = useState(!!s.solved);
  const [rejim, setRejim] = useState(s.soniManba === 'taxmin' ? 'taxmin' : s.soniManba === 'database' ? 'son' : s.solved ? 'bilmayman' : 'son');
  const [son, setSon] = useState(s.soniManba === 'database' ? String(s.soni) : '');
  const [taxmin, setTaxmin] = useState(s.soniManba === 'taxmin' ? String(s.soni) : '');
  const [asos, setAsos] = useState(s.soniAsos || '');
  const [bilmayman, setBilmayman] = useState(!!s.solved && s.soniManba === null);
  const [xato, setXato] = useState(null);
  const [bajardi, setBajardi] = useState(!!s.solved);
  const [yordam, setYordam] = useState(false);
  const [platforma] = useState(() => lsO(PLATFORMA_KEY));
  const [model] = useState(modelOl);
  const ochiq = darvoza === 'distinct';
  const webQator = !platforma || platforma.trek === 'web';
  const kompaniya = model && (model.model === 'reklama' || model.model === 'b2b');
  const tanlaD = (v) => {
    if (ochiq) return;
    const d = S10_DARVOZA.find(x => x.id === v);
    if (birinchiRef.current === null) { birinchiRef.current = !!d.ok; if (!d.ok && achMiss) achMiss.miss(screen); }
    if (d.ok) { setDarvoza(v); setDXato(null); } else setDXato(v);
  };
  const tayyorBor = (rejim === 'son' && son) || (rejim === 'taxmin' && taxmin) || bilmayman;
  const qulf = !ochiq ? tr({ uz: 'Avval qator savolini yeching', ru: 'Сначала решите вопрос о строке' }) : !tayyorBor ? tr({ uz: 'Avval sonni yozing yoki tugmani bosing', ru: 'Сначала запишите число или нажмите кнопку' }) : null;
  const bajardim = () => {
    if (qulf || bajardi) return;
    let natija;
    if (bilmayman) natija = { soni: null, soniManba: null, soniAsos: null };
    else if (rejim === 'son') { const n = Number(son); if (!son || !Number.isFinite(n)) { setXato('son'); return; } natija = { soni: n, soniManba: 'database', soniAsos: null }; }
    else { const n = Number(taxmin); if (!taxmin || !Number.isFinite(n)) { setXato('taxmin'); return; } if (String(asos).trim().length < 8) { setXato('asos'); return; } natija = { soni: n, soniManba: 'taxmin', soniAsos: String(asos).trim() }; }
    setXato(null); setBajardi(true);
    const m = modelOl();
    if (m) lsY(MODEL_KEY, { ...m, ...natija, savedAt: Date.now() }); // model saqlanmagan bo'lsa — son dars progressida (8-ekran saqlaganda birga yoziladi)
    const yozildi = natija.soniManba !== null;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'sql', solved: true, picked: true, birinchi: !!birinchiRef.current, correct: !!birinchiRef.current && yozildi, ...natija });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const nat = bajardi ? (bilmayman ? null : rejim === 'son' ? son : taxmin) : null;
  const vazifa = (
    <>
      {!isMentor && <span key={nat !== null ? 'n' : 'b'} className={cxx('ms-strip', nat !== null && 'yangi')}>{tr({ uz: 'Modelim', ru: 'Моя модель' })} · {tr({ uz: "to'lashi mumkin", ru: 'могут платить' })}: {nat !== null ? nat : '?'}{nat !== null && rejim === 'taxmin' && <em> · {tr({ uz: 'taxmin', ru: 'предположение' })}</em>}</span>}
      {!ochiq
        ? <div className="ms-darvoza">
          <p className="ms-darvoza-s">{tr({ uz: 'Masalan, bir tashkilotchi uchta o\'yin e\'lon qilgan. Qaysi qator uni bir marta sanaydi?', ru: 'Например, один организатор объявил три игры. Какая строка посчитает его один раз?' })}</p>
          <div className="ms-chorla">{S10_DARVOZA.map(d => <button key={d.id} type="button" className={cxx('q-chip', 'ms-kodchip', dXato === d.id && 'err')} onClick={() => tanlaD(d.id)}>{d.t}</button>)}</div>
          {dXato && <QXato>{tr(S10_DARVOZA.find(d => d.id === dXato).x)}</QXato>}
        </div>
        : <p className="ms-darvoza-ok fade-step">✓ <code>COUNT(DISTINCT g.tashkilotchi_id)</code></p>}
      <ol className="ms-qadamlar">{S10_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
      {webQator && <p className="ms-kulrang">{tr({ uz: "Web-trekda ham shunday: saytingizning Database'ida to'lovchi rolini sanaysiz.", ru: 'В веб-треке так же: считаете роль плательщика в Database сайта.' })}</p>}
      {kompaniya && <p className="ms-kulrang">{tr({ uz: "Modelingizda kompaniya to'laydi — u Database'da yo'q: taxminingizni yozing.", ru: 'В вашей модели платит компания — её нет в Database: напишите предположение.' })}</p>}
      {ochiq && !isMentor && !bajardi && (
        <div className="ms-son">
          {rejim === 'son' && !bilmayman && <div className="ms-inp-q"><Kirit son value={son} onChange={(v) => { setSon(v); setXato(null); }} ph={tr({ uz: "Neon ko'rsatgan son", ru: 'Число из Neon' })} halqa={!son && !bajardi} max={7} /><button type="button" className="q-chip" disabled={bajardi} onClick={() => { setRejim('taxmin'); setXato(null); }}>{tr({ uz: "Database'da sanab bo'lmaydi", ru: 'В Database не посчитать' })}</button></div>}
          {rejim === 'taxmin' && !bilmayman && <>
            <div className="ms-inp-q"><Kirit son value={taxmin} onChange={(v) => { setTaxmin(v); setXato(null); }} ph={tr({ uz: "Taxminingiz: nechtasi to'lashi mumkin?", ru: 'Ваше предположение: сколько могут платить?' })} err={xato === 'taxmin'} halqa={!taxmin && !bajardi} max={7} /><span className="ms-tax-teg">{tr({ uz: 'taxmin', ru: 'предположение' })}</span></div>
            <Kirit value={asos} onChange={(v) => { setAsos(v); setXato(null); }} ph={tr({ uz: 'Nimaga tayanib? Masalan: guruhda nechta tashkilotchi borligi', ru: 'На что опираетесь? Например: сколько организаторов в группе' })} err={xato === 'asos'} halqa={!!taxmin && String(asos).trim().length < 8 && !bajardi} max={120} />
          </>}
          <button type="button" className={cxx('q-chip', bilmayman && 'on')} disabled={bajardi} onClick={() => { setBilmayman(b => !b); setXato(null); }}>{tr({ uz: 'Hozircha bilmayman', ru: 'Пока не знаю' })}</button>
          {xato && <QXato>{tr(S10_X[xato])}</QXato>}
        </div>
      )}
      {bajardi && <QXulosa>{bilmayman
        ? tr({ uz: 'Sanoq hali qilinmadi — uyda Neon\'da sanang yoki taxmin yozing.', ru: 'Подсчёт ещё не сделан — дома посчитайте в Neon или напишите предположение.' })
        : rejim === 'taxmin' ? tr({ uz: "To'lashi mumkin bo'lganlar taxmin va uning asosi bilan yozildi.", ru: 'Те, кто может платить, записаны предположением и его основанием.' })
          : tr({ uz: "To'lashi mumkin bo'lganlar sanaldi: bu rolingizdagi hisoblar, to'lashga tayyorlar emas.", ru: 'Те, кто может платить, посчитаны: это аккаунты вашей роли, а не готовые платить.' })}</QXulosa>}
      {!bajardi && <p className="ms-kulrang-s">{tr({ uz: "Vaqt tugasa — «Hozircha bilmayman»ni bosing: sanoq uyga qoladi.", ru: 'Если время кончится — нажмите «Пока не знаю»: подсчёт останется на дом.' })}</p>}
    </>
  );
  const yordamEl = (
    <>
      {yordam && <div className="ms-yordam fade-step">
        <p>{tr({ uz: <>Eslatma: <code>COUNT(DISTINCT …)</code> — takrorlanmagan qiymatlarni sanaydi (10-Modulda brauzer ID lar shunday sanalgan) · <code>JOIN … ON</code> — ikki jadvalni <code>id</code> orqali bog'laydi · <code>WHERE o.namuna = false</code> — namuna va tekshiruv akkauntlari sanalmaydi (12-Modul).</>, ru: <>Напоминание: <code>COUNT(DISTINCT …)</code> — считает неповторяющиеся значения (в 10-м модуле так считали ID браузеров) · <code>JOIN … ON</code> — связывает две таблицы через <code>id</code> · <code>WHERE o.namuna = false</code> — образцовые и проверочные аккаунты не считаются (12-й модуль).</> })}</p>
        <p>{tr({ uz: <>Jadval nomini bilmasangiz — agentga yozing: «Database'da {'{'}to'lovchi roli{'}'} qaysi jadval va ustunda ko'rinadi? Faqat nomlarini ayt, hech narsani o'zgartirma.» <code>SELECT *</code> yozmang: jadvalda ism va login bor — sizga faqat son kerak. Faqat <code>SELECT</code> — <code>DELETE</code>, <code>UPDATE</code> yo'q.</>, ru: <>Если не знаете имя таблицы — напишите агенту: «В какой таблице и столбце Database видна {'{'}роль плательщика{'}'}? Назови только имена, ничего не меняй.» Не пишите <code>SELECT *</code>: в таблице есть имена и логины — вам нужно только число. Только <code>SELECT</code> — без <code>DELETE</code>, <code>UPDATE</code>.</> })}</p>
        <p>{tr({ uz: <>Masalan (Mentor misoli): to'lovchi — tashkilotchi; u <code>oyinlar</code> jadvalida <code>tashkilotchi_id</code> ustunida ko'rinadi.</>, ru: <>Например (пример Ментора): плательщик — организатор; он виден в таблице <code>oyinlar</code>, в столбце <code>tashkilotchi_id</code>.</> })}</p>
      </div>}
      <div className="ms-karta-tug chap"><QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma></div>
    </>
  );
  const bajardimEl = !isMentor && !bajardi && (
    <div className="ms-bajardim">
      <QTugma className={cxx(!qulf && 'ms-halqa')} disabled={!!qulf} onClick={bajardim}>{tr({ uz: 'Bajardim — son yozildi', ru: 'Готово — число записано' })}</QTugma>
      {qulf && <span className="ms-qulf-y">{qulf}</span>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · Neon', ru: 'Пишем код · Neon' })} screen={screen} scrollSignal={(ochiq ? 1 : 0) + (run ? 2 : 0) + (bajardi ? 4 : 0)} natija={isMentor ? null : bajardi ? 'bajardi' : tayyorBor ? 'tayyor' : null} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!bajardi && !isMentor} label={bajardi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : qulf || tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="ms-s10">
        <QKod
          sarlavha={tr({ uz: <>To'lashi mumkin bo'lganlarni sanaydigan <A>SQL yozamiz.</A></>, ru: <>Пишем <A>SQL,</A> который считает тех, кто может платить.</> })}
          mentor={<Mentor><span key={ochiq ? 'o' : 'y'} className="fade-step">{ochiq
            ? tr({ uz: "Endi Neon'da o'z to'lovchi rolingizni xuddi shunday sanang.", ru: 'Теперь так же посчитайте в Neon свою роль плательщика.' })
            : tr({ uz: "Mentor misolida bular — o'yin e'lon qilgan tashkilotchilar: avval SQL'dagi bo'sh joyni to'ldiring.", ru: 'В примере Ментора это организаторы, объявившие игры: сначала заполните пропуск в SQL.' })}</span></Mentor>}
          vazifa={vazifa} yordam={yordamEl} bajardim={bajardimEl}
          {...{ [QKOD_ONG]: <><Zoomable><NeonMaket ochiq={ochiq} run={run} onRun={() => setRun(true)} /></Zoomable><p className="ms-kulrang">{tr({ uz: <><code>oyinlar</code> va <code>oyinchilar</code> — Mentor misolidagi jadvallar. Sizda nomlar boshqacha bo'lishi mumkin.</>, ru: <><code>oyinlar</code> и <code>oyinchilar</code> — таблицы примера Ментора. У вас имена могут быть другими.</> })}</p></> }}
        >
          <MentorPracticeStats live={live} screen={screen} yorliq={{ uz: 'Sonni yozganlar', ru: 'Записали число' }} />
          <Ustoz satrlar={USTOZ.s10} />
        </QKod>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY SAVOL (✔ B, INLINE_KEYS.s11 = 1; o'quvchining o'z ishi) =====
const S11Viz = () => {
  const m = modelOl();
  const mk = m || { model: 'freemium', kim: tr({ uz: 'tashkilotchi', ru: 'организатор' }), bepul: tr({ uz: "o'yin e'loni, qo'shilish", ru: 'объявление игры, присоединение' }), nima: '', sabab: '', rad: [] };
  return <ModelimKarta m={{ ...mk, nima: mk.nima || '…', sabab: mk.sabab || '…' }} mentor={!m} ixcham yon={["Kim to'laydi", 'Bepul qoladi']} />;
};
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Modelni tanlashdan oldin nimani bilishingiz kerak?"
    question={tr({ uz: <h2 className="title h-ask">Modelni tanlashdan oldin <A>nimani bilishingiz kerak?</A></h2>, ru: <h2 className="title h-ask">Что нужно знать <A>до выбора модели?</A></h2> })}
    options={[
      { uz: 'Telegram Premium necha pul turishini', ru: 'Сколько стоит Telegram Premium' },
      { uz: "Kim to'lashi va nima bepul qolishini", ru: 'Кто платит и что остаётся бесплатным' },
      { uz: 'Qaysi model hozir eng mashhurligini', ru: 'Какая модель сейчас самая популярная' },
      { uz: 'Mentor kimdan pul olishni tanlaganini', ru: 'У кого Ментор решил брать деньги' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Avval kim to'lashi va nima bepul qolishi aniqlanadi.", ru: 'Сначала определяют, кто платит и что остаётся бесплатным.' }}
    explainWrong={{
      0: { uz: 'Telegram — voqea. Mahsulotingiz haqida nima kerak?', ru: 'Telegram — история. Что нужно знать о вашем продукте?' },
      2: { uz: 'Mashhurlik mahsulotingizga mos kelishini aytmaydi.', ru: 'Популярность не говорит, подходит ли модель вашему продукту.' },
      3: { uz: "Mentor misoli — namuna. Sizda kim to'laydi?", ru: 'Пример Ментора — образец. Кто платит у вас?' },
      default: { uz: "O'z modelingizning birinchi ikki kartasini eslang.", ru: 'Вспомните первые две карточки своей модели.' }
    }}
    vizual={<S11Viz />} />
);

// ===== 🏅 BADGES (nishonlar) — 4 ta (MD): 3, 7-ekran — birinchi urinishda; 8 — bonus (ish qilingan); 10 — darvoza birinchi urinishda + son yoki taxmin =====
const ACHIEVEMENTS = {
  whoPays: { icon: '🧭', name: 'Who Pays!', desc: { uz: "Mentor rejasida kim to'lashini va nega ekanini birinchi urinishda topdingiz", ru: 'С первой попытки нашли, кто платит в плане Ментора и почему' } },
  freePart: { icon: '🎁', name: 'Free Part!', desc: { uz: 'Telegram Premium va Mentor tanlovidagi umumiy joyni birinchi urinishda topdingiz', ru: 'С первой попытки нашли общее у Telegram Premium и выбора Ментора' } },
  myModel: { icon: '🧩', name: 'My Model!', desc: { uz: 'Mahsulotingiz uchun model tanlab, sababini yozib saqladingiz', ru: 'Выбрали модель для продукта, написали причину и сохранили' } },
  countQuery: { icon: '🔢', name: 'Count Query!', desc: { uz: 'Bir tashkilotchini bir marta sanaydigan qatorni topib, sonni yozdingiz', ru: 'Нашли строку, которая считает организатора один раз, и записали число' } }
};
// Ekran id → nishon (MD «Nishonlar»): s3, s7 — ballik test; s8 — tekin bonus (S-034, ish qilingan ekran); s10 — darvoza + son
const ACH_TRIGGERS = { s3: 'whoPays', s7: 'freePart', s8: 'myModel', s10: 'countQuery' };

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


// Podium savol yorliqlari (SCORED_IDX: 3, 5, 7, 11 — MD 12-ekran)
const Q_LABELS = {
  3: { uz: "1 — Kim to'laydi va nega", ru: '1 — Кто платит и почему' },
  5: { uz: '2 — Pro va model nomi', ru: '2 — Pro и название модели' },
  7: { uz: '3 — Telegram Premium', ru: '3 — Telegram Premium' },
  11: { uz: 'Yakuniy — Model nimadan tanlanadi', ru: 'Итог — из чего выбирают модель' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — MD «Fon so'zlari» (R-008, {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'model', ru: 'модель' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'bepul asos', ru: 'бесплатная основа' }, l: 78, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: { uz: 'pullik obuna', ru: 'платная подписка' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'reklama', ru: 'реклама' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'B2B', l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'tranzaksiya', ru: 'транзакция' }, l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: "to'lovchi", ru: 'плательщик' }, l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Pro', l: 20, t: 16, s: 26, d: 18, dl: 2.9 },
  { ch: 'Telegram Premium', l: 36, t: 56, s: 20, d: 24, dl: 1.3 },
  { ch: 'Maydon Jamoa', l: 58, t: 48, s: 20, d: 22, dl: 2.5 }
];
// ⚡ Mustahkamlash-jang — 12 savol (MD «Jonli viktorina» aynan; ✔ A 1·6·10 · B 3·8·11 · C 2·5·12 · D 4·7·9)
const QUIZ_BANK = [
  { q: { uz: "Bepul asos va pullik qo'shimchada nima bepul?", ru: 'Что бесплатно в бесплатной основе с платным дополнением?' }, opts: [{ uz: 'Hamma uchun asosiy ish', ru: 'Основное для всех' }, { uz: "Faqat birinchi o'ttiz kun", ru: 'Только первые тридцать дней' }, { uz: 'Faqat reklamali sahifalar', ru: 'Только страницы с рекламой' }, { uz: "Qo'shimcha qulayliklar", ru: 'Дополнительные удобства' }], correct: 0 },
  { q: { uz: "Reklama modelida pulni kim to'laydi?", ru: 'Кто платит в модели рекламы?' }, opts: [{ uz: 'Ilovani ishlatadigan har kim', ru: 'Каждый, кто пользуется приложением' }, { uz: "Reklamani ko'rgan foydalanuvchi", ru: 'Пользователь, увидевший рекламу' }, { uz: 'Reklama bergan boshqa kompaniya', ru: 'Другая компания-рекламодатель' }, { uz: 'Ilova xizmat qiladigan biznes', ru: 'Бизнес, которому служит приложение' }], correct: 2 },
  { q: { uz: "Mentor misolida B2B bo'lsa, kim to'lardi?", ru: 'Кто платил бы в примере Ментора при B2B?' }, opts: [{ uz: "O'yinga qo'shiladigan o'yinchilar", ru: 'Игроки, присоединяющиеся к игре' }, { uz: "O'yin bo'ladigan maydonning egasi", ru: 'Владелец поля, где проходит игра' }, { uz: 'Ilovada reklama bergan kompaniya', ru: 'Компания, давшая рекламу в приложении' }, { uz: "O'yinni e'lon qiladigan tashkilotchi", ru: 'Организатор, объявляющий игру' }], correct: 1 },
  { q: { uz: "Mentor misolida tranzaksiya modeli qaysi ish bo'lardi?", ru: 'Какой работой была бы транзакция в примере Ментора?' }, opts: [{ uz: "Har hafta o'yinni e'lon qilish", ru: 'Объявлять игру каждую неделю' }, { uz: "O'yinga qo'shilish va chiqish", ru: 'Присоединение к игре и выход' }, { uz: "O'yinchilarga eslatmalar yuborish", ru: 'Отправка напоминаний игрокам' }, { uz: "Maydon pulini ilovada bo'lishish", ru: 'Делить деньги за поле в приложении' }], correct: 3 },
  { q: { uz: "Mentor maydon pulini bo'lishishni nega hozir olmadi?", ru: 'Почему Ментор сейчас не взял деление денег за поле?' }, opts: [{ uz: '44 foydalanuvchi buning uchun kam', ru: '44 пользователей для этого мало' }, { uz: 'Maydon egasi ilovani ishlatmaydi', ru: 'Владелец поля не пользуется приложением' }, { uz: 'Yuridik shaxs va shartnoma kerak', ru: 'Нужны юрлицо и договор' }, { uz: "Roadmap'da u hozirgi ufqda turadi", ru: 'В roadmap оно на текущем горизонте' }], correct: 2 },
  { q: { uz: "Mentor rejasida o'yinchi Pro'siz nima qila oladi?", ru: 'Что игрок может без Pro в плане Ментора?' }, opts: [{ uz: "O'yinlarga bepul qo'shila oladi", ru: 'Бесплатно присоединяться к играм' }, { uz: "Faqat o'yin e'lonlarini o'qiydi", ru: 'Только читать объявления игр' }, { uz: "Faqat bitta o'yinga qo'shiladi", ru: 'Присоединиться только к одной игре' }, { uz: 'Hech narsa: ilova unga pullik', ru: 'Ничего: приложение для него платное' }], correct: 0 },
  { q: { uz: 'Telegram pullik obunani qachon ishga tushirgan?', ru: 'Когда Telegram запустил платную подписку?' }, opts: [{ uz: '2020-yil iyunda', ru: 'В июне 2020' }, { uz: '2024-yil mayda', ru: 'В мае 2024' }, { uz: '2019-yil martda', ru: 'В марте 2019' }, { uz: '2022-yil iyunda', ru: 'В июне 2022' }], correct: 3 },
  { q: { uz: "2024-yilda Premium'ga pullik obuna bo'lganlar qanday o'zgardi?", ru: 'Как изменилось число платных подписчиков Premium в 2024?' }, opts: [{ uz: "Deyarli o'zgarmadi", ru: 'Почти не изменилось' }, { uz: "Uch barobar ko'paydi", ru: 'Выросло втрое' }, { uz: 'Ikki barobar kamaydi', ru: 'Уменьшилось вдвое' }, { uz: "O'n barobar ko'paydi", ru: 'Выросло в десять раз' }], correct: 1 },
  { q: { uz: 'Bu darsdagi pullik obuna modelida bepul qism qanday bo\'ladi?', ru: 'Какая бесплатная часть в модели платной подписки на этом уроке?' }, opts: [{ uz: 'Asosiy ishi hamma uchun bepul', ru: 'Основное бесплатно для всех' }, { uz: "Pulni boshqa kompaniya to'laydi", ru: 'Платит другая компания' }, { uz: "Bepul qism kattaroq bo'ladi", ru: 'Бесплатная часть больше' }, { uz: "Bepul qism yo'q, hamma to'laydi", ru: 'Бесплатной части нет, платят все' }], correct: 3 },
  { q: { uz: "Bu darsdagi SQL'da DISTINCT nima uchun yozilgan?", ru: 'Зачем в SQL этого урока написан DISTINCT?' }, opts: [{ uz: 'Har tashkilotchi bir marta sanalsin', ru: 'Чтобы каждый организатор считался один раз' }, { uz: 'Namuna akkauntlar sanoqqa kirmasin', ru: 'Чтобы образцовые аккаунты не считались' }, { uz: "Ikki jadval o'zaro id orqali bog'lansin", ru: 'Чтобы две таблицы связались через id' }, { uz: 'Faqat Pro olganlar sanoqqa kirsin', ru: 'Чтобы считались только купившие Pro' }], correct: 0 },
  { q: { uz: "SQL'dagi `namuna = false` sharti nima qiladi?", ru: 'Что делает условие `namuna = false` в SQL?' }, opts: [{ uz: 'Pro olmagan akkauntlarni sanamaydi', ru: 'Не считает аккаунты без Pro' }, { uz: 'Tekshiruv akkauntlarini sanamaydi', ru: 'Не считает проверочные аккаунты' }, { uz: "O'yin e'lon qilmaganlarni sanaydi", ru: 'Считает не объявлявших игры' }, { uz: 'Sinfdoshlarni alohida sanab beradi', ru: 'Отдельно считает одноклассников' }], correct: 1 },
  { q: { uz: 'Telegram Premium nima?', ru: 'Что такое Telegram Premium?' }, opts: [{ uz: "Telegram'ning yangi versiyasi", ru: 'Новая версия Telegram' }, { uz: "Telegram'ning bepul qismi", ru: 'Бесплатная часть Telegram' }, { uz: "Telegram'ning pullik obunasi", ru: 'Платная подписка Telegram' }, { uz: "Telegram'dagi reklama turi", ru: 'Вид рекламы в Telegram' }], correct: 2 }
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

// 🃏 KARTOCHKALAR (12) — MD «Kartochkalar» jadvali aynan; alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTOCHKALAR = [
  { front: { uz: 'Monetizatsiya modeli nima?', ru: 'Что такое модель монетизации?' }, back: { uz: 'Mahsulot qanday pul topishi', ru: 'То, как продукт зарабатывает' }, note: { uz: 'Qisqasi — model', ru: 'Коротко — модель' } },
  { front: { uz: "Bepul asos va pullik qo'shimcha nima?", ru: 'Что такое бесплатная основа и платное дополнение?' }, back: { uz: "Asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik", ru: 'Основное бесплатно для всех, дополнительное удобство платное' }, note: { uz: 'Inglizchasi: freemium', ru: 'По-английски: freemium' } },
  { front: { uz: "Bu darsdagi pullik obuna modelida kim to'laydi?", ru: 'Кто платит в модели платной подписки на этом уроке?' }, back: { uz: "Har bir foydalanuvchi — ma'lum muddatga", ru: 'Каждый пользователь — на определённый срок' }, note: { uz: "Inglizchasi: subscription. Pro ham pullik obuna, lekin faqat qo'shimcha uchun", ru: 'По-английски: subscription. Pro — тоже платная подписка, но только за дополнение' } },
  { front: { uz: "Reklama modelida kim to'laydi?", ru: 'Кто платит в модели рекламы?' }, back: { uz: "Boshqa kompaniya — o'z mahsulotini ko'rsatish uchun", ru: 'Другая компания — чтобы показать свой продукт' }, note: { uz: 'Mentor misolida hozir tanlanmadi: auditoriya hali kichik', ru: 'В примере Ментора сейчас не выбрана: аудитория пока мала' } },
  { front: { uz: 'B2B nima?', ru: 'Что такое B2B?' }, back: { uz: "Boshqa biznes to'laydi: mahsulot uning o'z ishiga xizmat qiladi", ru: 'Платит другой бизнес: продукт служит его делу' }, note: { uz: 'Inglizchasi: business to business', ru: 'По-английски: business to business' } },
  { front: { uz: 'Tranzaksiya modeli nima?', ru: 'Что такое модель транзакции?' }, back: { uz: "Ilova orqali o'tadigan har to'lovdan ulush olish", ru: 'Брать долю с каждой оплаты через приложение' }, note: { uz: "Mentor misolida — maydon pulini bo'lishish", ru: 'В примере Ментора — делить деньги за поле' } },
  { front: { uz: "Mentor rejasida kim to'laydi va nega?", ru: 'Кто платит в плане Ментора и почему?' }, back: { uz: "Tashkilotchi: Pro uning har haftalik o'yin e'lonini o'zi qiladi", ru: 'Организатор: Pro сам делает его еженедельное объявление' }, note: { uz: "«Doimiy o'yin» — har hafta shu kun va soatda o'yin o'zi e'lon qilinadi", ru: '«Постоянная игра» — каждую неделю в тот же день и час игра объявляется сама' } },
  { front: { uz: "Nega Mentor o'yinchilardan pul so'ramaydi?", ru: 'Почему Ментор не просит денег у игроков?' }, back: { uz: "Ular bo'lmasa o'yin to'lmaydi", ru: 'Без них игра не наберётся' }, note: { uz: 'Telegram guruhi esa bepul', ru: 'А Telegram-группа бесплатна' } },
  { front: { uz: "Nega B2B Maydon Jamoa'ga hozir mos emas?", ru: 'Почему B2B сейчас не подходит Maydon Jamoa?' }, back: { uz: 'Ilova bugun maydon egasiga xizmat qilmaydi', ru: 'Приложение сегодня не служит владельцу поля' }, note: { uz: "Muammo gapida maydon egasi yo'q", ru: 'Во фразе проблемы владельца поля нет' } },
  { front: { uz: "Maydon pulini bo'lishish nega hozir olinmadi?", ru: 'Почему деление денег за поле сейчас не взяли?' }, back: { uz: "Boshqalar nomidan pul yig'ish uchun yuridik shaxs va shartnoma kerak", ru: 'Чтобы собирать деньги от имени других, нужны юрлицо и договор' }, note: { uz: "Yuridik shaxs — davlatda ro'yxatdan o'tgan firma. Roadmap'da — «uzoqroq»", ru: 'Юрлицо — фирма, зарегистрированная государством. В roadmap — «дальше»' } },
  { front: { uz: "Telegram Premium chiqqanda bepul Telegram bilan nima bo'ldi?", ru: 'Что стало с бесплатным Telegram, когда вышел Premium?' }, back: { uz: "Qisqartirilmadi — Premium ustiga qulaylik qo'shdi", ru: 'Не урезали — Premium добавил удобства сверху' }, note: { uz: '2022-yil iyun', ru: 'Июнь 2022' } },
  { front: { uz: "To'lashi mumkin bo'lganlar soni — to'laganlar sonimi?", ru: 'Число тех, кто может платить, — это число заплативших?' }, back: { uz: "Yo'q: bu rolga mos hisoblar soni — hech kim to'lamagan", ru: 'Нет: это число аккаунтов подходящей роли — никто не платил' }, note: { uz: "To'lashga tayyorligi ham noma'lum · Mentor misolida — 6 tashkilotchi", ru: 'Готовность платить тоже неизвестна · в примере Ментора — 6 организаторов' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('ms-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="ms-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③; ③ holatdan; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'ota-ona yoki sinfdosh', ru: 'родитель или одноклассник' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 model', ru: '1 модель' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { uz: "Modelingizni tushuntirib bering: kim to'laydi, nima uchun va nima bepul qoladi.", ru: 'Объясните свою модель: кто платит, за что и что остаётся бесплатным.' },
  { uz: "Yana bitta modelni mahsulotingizga qo'yib ko'ring: kim to'lardi va nega mos emas?", ru: 'Примерьте к продукту ещё одну модель: кто бы платил и почему она не подходит?' }
];
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card ms-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ms-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="ms-hw-q"><span className="ms-hw-k">{tr(r.k)}</span><span className="ms-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="ms-hw-qadam">
      {HW_BANDLAR.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}
      {qolgan.length > 0 && <li><i>{HW_RAQAM[2]}</i><span>{tr({ uz: 'Darsda qolgan qismni tugating:', ru: 'Закончите то, что осталось с урока:' })} {qolgan.map(tr).join(' · ')}.</span></li>}
    </ol>
    <p className="ms-hw-ost">{tr({ uz: "Hech kimdan pul so'ramang: bugun faqat model tanlanadi.", ru: 'Ни у кого не просите денег: сегодня только выбираем модель.' })}</p>
    {keyingi && <span className="ms-hw-keyingi">{keyingi}</span>}
  </div>
);
// SABOQ P4 (PM-109): erta tugatgan o'quvchi — AI sherik rolida (9-ekrandagi ikki savol), o'quvchi modelini o'zi tushuntiradi; matn MD da yo'q — «MD ga taklif»
const AI_SOROV = { uz: "Sen mening sherigimsan. Men senga mahsulotim uchun tanlagan pul topish modelimni tushuntiraman. Faqat ikki savolga qarab belgi qo'y: 1) kim to'laydi va nima uchun to'laydi — aniq aytildimi? 2) nega aynan shu model — sabab mahsulotdagi faktdanmi? Har biriga ✓ yoki ✕ qo'yib, bir gap izoh yoz. Model tanlab berma, narx aytma, pul so'rashni maslahat berma. Mening modelim: ", ru: 'Ты мой партнёр. Я объясню тебе модель заработка, которую выбрал для своего продукта. Отметь только два вопроса: 1) ясно ли сказано, кто платит и за что? 2) почему именно эта модель — причина из факта о продукте? На каждый поставь ✓ или ✕ и напиши одно предложение. Не выбирай модель за меня, не называй цену, не советуй просить деньги. Моя модель: ' };
const aiSorov = (m) => {
  const q = m ? `${tr(MODEL_NOM[m.model])}. ${tr({ uz: "To'laydi", ru: 'Платит' })}: ${m.kim}. ${tr({ uz: 'Nima uchun', ru: 'За что' })}: ${m.nima}. ${tr({ uz: 'Sabab', ru: 'Причина' })}: ${m.sabab}.` : '';
  return tr(AI_SOROV) + q;
};
const AiDavomCard = () => {
  const [nusxa, setNusxa] = useState(false);
  const [m] = useState(modelOl);
  const matn = aiSorov(m);
  const kochir = () => { try { navigator.clipboard.writeText(matn); setNusxa(true); setTimeout(() => setNusxa(false), 1800); } catch { /* qo'lda belgilab oladi */ } };
  return (
    <div className="card ms-ai fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Erta tugatdingizmi? AI bilan davom eting', ru: 'Закончили раньше? Продолжите с AI' })}</div>
      <p className="ms-ai-m">{tr({ uz: "gemini.google.com'ni oching va pastdagi so'rovni yuboring — AI sherigingiz bo'lib, modelingizni ikki savol bilan tekshiradi. ✕ olgan qatorni «Orqaga» bilan qaytib, 9-ekrandagi kartada o'zingiz tuzating.", ru: 'Откройте gemini.google.com и отправьте запрос ниже — AI станет партнёром и проверит модель двумя вопросами. Строку с ✕ исправьте сами в карточке 9-го экрана, вернувшись через «Назад».' })}</p>
      <pre className="ms-ai-sorov">{matn}</pre>
      <button type="button" className="q-chip ms-ai-btn" onClick={kochir}>{nusxa ? tr({ uz: 'Nusxalandi ✓', ru: 'Скопировано ✓' }) : tr({ uz: "So'rovni nusxalash", ru: 'Скопировать запрос' })}</button>
    </div>
  );
};

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (to'rt holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
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
  // «Endi siz bilasiz» — MD aynan (asosiy fikr so'zma-so'z takrorlanmaydi, T-048)
  const RECAP = [
    { uz: 'Mahsulot qanday pul topishi — monetizatsiya modeli.', ru: 'То, как продукт зарабатывает, — модель монетизации.' },
    { uz: "Bepul asos va pullik qo'shimchada asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik.", ru: 'В бесплатной основе с платным дополнением основное бесплатно для всех, дополнительное удобство платное.' },
    { uz: "Bu darsdagi pullik obuna modelida har bir foydalanuvchi to'laydi.", ru: 'В модели платной подписки на этом уроке платит каждый пользователь.' },
    { uz: 'Telegram Premium voqeasida bepul qism qisqartirilmagan.', ru: 'В истории Telegram Premium бесплатную часть не урезали.' },
    { uz: "To'lashi mumkin bo'lganlar — rolga mos hisoblar soni, to'lashga tayyorlar emas.", ru: 'Те, кто может платить, — число аккаунтов подходящей роли, а не готовые платить.' }
  ];
  const m = modelOl();
  // Sarlavha holatga qarab va rost (E 54) — MD dagi to'rt holat; ✓ va nishon faqat birinchisida
  const holat = isMentorL ? 'mentor' : !m ? 'yoq' : m.soniManba === 'database' ? 'database' : m.soniManba === 'taxmin' ? 'taxmin' : 'sanoqsiz';
  const SARLAVHA = {
    database: { uz: <>Modelingiz tanlandi, <A>Neon'da sanoq qilindi.</A></>, ru: <>Модель выбрана, <A>подсчёт в Neon сделан.</A></> },
    taxmin: { uz: <>Modelingiz tanlandi, <A>sanoq hozircha taxmin.</A></>, ru: <>Модель выбрана, <A>подсчёт пока предположение.</A></> },
    sanoqsiz: { uz: <>Modelingiz tanlandi, <A>sanoq hali qilinmagan.</A></>, ru: <>Модель выбрана, <A>подсчёт ещё не сделан.</A></> },
    yoq: { uz: <>Model hali tanlanmagan — <A>uyda tanlang.</A></>, ru: <>Модель ещё не выбрана — <A>выберите дома.</A></> },
    mentor: { uz: <>Mahsulotingiz qanday <A>pul topadi?</A></>, ru: <>Как ваш продукт <A>зарабатывает?</A></> }
  };
  const toliq = holat === 'database';
  const qolgan = isMentorL ? [] : [
    !m && { uz: 'modelni tanlab saqlang', ru: 'выберите и сохраните модель' },
    (!m || !m.soniManba) && { uz: "Neon'da sanang yoki taxmin yozing", ru: 'посчитайте в Neon или напишите предположение' }
  ].filter(Boolean);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Webhook: to'lov Backend'ga qanday yetib keladi»</b></>, ru: <>Следующий урок — <b>«Webhook: как оплата доходит до Backend»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('ms-yakun', !toliq && 'belgisiz')}>
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
export default function PmMonetizationLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARS VIZUALI (ms-) — ModelSahna, kartalar, forma. Faqat qolip tokenlari + brend/illyustratsiya ranglari (Maydon Jamoa, Telegram, Neon, tanga); emoji yo'q (D4) === */
        .ms { position: relative; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ms-qator { display: flex; gap: 14px; align-items: flex-start; }
        .ms.yonsiz .ms-qator { justify-content: center; }
        .ms-odam-svg { display: block; }
        .ms-ikki.keng { align-items: start; }
        .ms-ish.yakuniy { align-items: center; }
        .ms-chap { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .ms-yon { display: flex; flex-direction: column; gap: 8px; width: 150px; flex: none; padding-top: 18px; }
        .ms-oqim { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; z-index: 3; }
        .ms-iz { fill: none; stroke: ${TANGA_RANG}; stroke-width: 2; stroke-dasharray: 4 4; opacity: 0.75; }
        .ms-iz.acc { stroke: ${T.accent}; opacity: 0.9; }
        .ms-iz.uzuq { stroke: ${T.ink2}; opacity: 0.35; stroke-dasharray: 2 6; }
        .ms-qulf { animation: ms-kir 0.4s ease-out both; }
        .ms-mj { color: ${MAYDON_RANG}; font-weight: 800; white-space: nowrap; }
        .ms-tel { width: 170px; height: 272px; border-radius: 24px; background: #23222B; padding: 7px; display: flex; flex-direction: column; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.45); }
        .ms-tel-bar { height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12.5px; }
        .ms-tel-ekran { flex: 1; min-height: 0; background: ${T.paper}; border-radius: 17px; padding: 10px 9px; display: flex; flex-direction: column; gap: 7px; overflow: hidden; }
        .ms-tel-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .ms-rekl { flex: none; height: 30px; border-radius: 8px; background: ${T.line}; color: ${T.ink2}; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; animation: ms-kir 0.45s ease-out both; }
        .ms-oyin { border: 1px solid ${T.line}; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 3px; background: ${T.bg}; }
        .ms-oyin-v { font-size: 12px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .ms-oyin-j { font-size: 11px; color: ${T.ink2}; }
        .ms-oyin-son { align-self: flex-start; font-size: 11.5px; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: ${T.okFon}; color: ${T.ok}; white-space: nowrap; }
        .ms-oyin-son.acc { background: ${T.accentSoft}; color: ${T.accent}; animation: ms-pop 0.45s ease-out; }
        .ms-oyin-son.savol { background: ${T.line}; color: ${T.ink2}; animation: ms-pop 0.45s ease-out; }
        .ms-tel-btn { display: block; text-align: center; font-size: 11.5px; font-weight: 700; padding: 6px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink}; white-space: nowrap; }
        .ms-tel-btn.elon { margin-top: auto; }
        .ms-tel-btn.yon { background: ${MAYDON_RANG}; border-color: ${MAYDON_RANG}; color: #fff; animation: ms-pop 0.45s ease-out; }
        .ms-mk { width: 170px; min-height: 196px; border-radius: 18px; background: ${T.paper}; border: 1.5px solid ${T.line}; overflow: hidden; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.35); display: flex; flex-direction: column; }
        .ms-mk-bar { background: ${T.accent}; color: #fff; font-size: 13px; font-weight: 800; padding: 8px 10px; overflow-wrap: anywhere; }
        .ms-mk-ich { padding: 10px; display: flex; flex-direction: column; gap: 7px; }
        .ms-mk-kim { font-size: 12px; color: ${T.ink2}; } .ms-mk-kim b { color: ${T.accent}; }
        .ms-mk-g { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
        .ms-mk-g i { font-style: normal; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 2px; }
        .ms-mk-g.bepul i { color: ${T.ok}; } .ms-mk-g.pullik i { color: ${T.accent}; }
        .ms-mk-g em { font-style: normal; font-size: 11px; padding: 2px 6px; border-radius: 6px; animation: ms-kir 0.35s ease-out both; }
        .ms-mk-g.bepul em { background: ${T.okFon}; color: ${T.ok}; } .ms-mk-g.pullik em { background: ${T.accentSoft}; color: ${T.accent}; }
        .ms-mk-bosh { color: ${T.ink2}; font-size: 13px; }
        .ms-44 { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: ${T.ink}; color: ${T.paper}; white-space: nowrap; }
        p.ms-muammo { margin: 0; font-size: 12.5px; line-height: 1.45; padding: 8px 12px; border-radius: 10px; background: ${T.accentSoft}; color: ${T.ink}; }
        p.ms-muammo i { display: block; font-style: normal; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.accent}; margin-bottom: 2px; }
        .ms-odamlar { display: flex; flex-direction: column; gap: 1px; align-items: center; }
        .ms-ust, .ms-odam-ro, .ms-rol-ro { display: grid; grid-template-columns: repeat(9, 26px); column-gap: 3px; }
        .ms-ust { min-height: 18px; align-items: end; }
        .ms-qavs { text-align: center; font-size: 10.5px; font-weight: 800; border-top: 2px solid; border-radius: 6px 6px 0 0; padding-top: 1px; animation: ms-kir 0.4s ease-out both; white-space: nowrap; }
        .ms-qavs.bepul { color: ${T.ok}; border-color: ${T.ok}; } .ms-qavs.savol { color: ${T.ink2}; border-color: ${fon(T.ink2, 0.5)}; }
        .ms-qm { text-align: center; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; animation: ms-kir 0.4s ease-out both; }
        .ms-odam { display: flex; justify-content: center; transition: opacity 0.5s ease; }
        .ms-odam.xira { opacity: 0.3; }
        .ms-rol-ro span { text-align: center; font-size: 10.5px; color: ${T.ink2}; border-top: 1px dashed ${T.line}; padding-top: 2px; }
        .ms-rol-ro b { text-align: center; font-size: 10px; color: ${T.accent}; white-space: nowrap; padding-top: 2px; }
        .ms-tash { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ms-tash-q { display: flex; align-items: flex-end; gap: 2px; }
        .ms-teg { font-size: 10.5px; line-height: 1.35; padding: 4px 7px; border-radius: 6px; background: ${T.bg}; border: 1px dashed ${T.line}; color: ${T.ink2}; }
        .ms-hafta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .ms-hk { padding: 5px 6px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; font-size: 10.5px; display: flex; flex-direction: column; gap: 3px; animation: ms-kir 0.4s ease-out both; }
        .ms-hk b { font-weight: 700; color: ${T.ink}; }
        .ms-hk i { display: block; height: 4px; border-radius: 2px; background: ${fon(T.accent, 0.35)}; transform-origin: left; }
        .ms-hafta.yozadi .ms-hk i { animation: ms-yoz 0.9s ease-out both 2; }
        .ms-hafta.ozi .ms-hk i { background: ${fon(T.ok, 0.4)}; }
        .ms-hk em { font-style: normal; font-size: 10px; font-weight: 800; color: ${T.ok}; animation: ms-kir 0.35s ease-out both; }
        .ms-pro { border: 1.5px solid ${T.line}; border-radius: 12px; padding: 8px 10px; background: ${T.paper}; display: flex; flex-direction: column; gap: 3px; }
        .ms-pro.ochiq { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px ${fon(T.accent, 0.45)}; animation: ms-pop 0.45s ease-out; }
        .ms-pro-y { font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.ink2}; }
        .ms-pro-n { font-size: 15px; font-weight: 800; color: ${T.accent}; }
        .ms-pro-s { font-size: 11.5px; line-height: 1.35; color: ${T.ink}; animation: ms-kir 0.4s ease-out both; }
        .ms-ikki { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 20px; align-items: start; }
        .ms-ikki.yakka { grid-template-columns: auto; justify-content: start; }
        @media (min-width: 761px) { .ms-ikki.yakun .ms-tel { height: 214px; } .ms-ikki.yakun .ms-yon { padding-top: 0; } }
        .ms-rolk { max-width: 380px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.25); }
        .ms-rolk-n { font-size: 17px; font-weight: 800; color: ${T.ink}; }
        .ms-rolk-q { font-size: 14px; color: ${T.ink}; }
        .ms-rolk-p { align-self: flex-start; font-size: 12.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
        .ms-rolk-p.ok { background: ${T.okFon}; color: ${T.ok}; } .ms-rolk-p.acc { background: ${T.accentSoft}; color: ${T.accent}; }
        p.ms-rolk-iz { margin: 0; font-size: 12.5px; color: ${T.ink2}; border-top: 1px solid ${T.line}; padding-top: 6px; }
        .ms-harakat { display: flex; flex-direction: column; gap: 8px; }
        .ms-tugmalar { display: flex; gap: 8px; flex-wrap: wrap; }
        .ms-rol { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; padding: 9px 14px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; display: inline-flex; gap: 8px; align-items: center; }
        .ms-rol i { width: 22px; height: 22px; border-radius: 50%; background: ${T.bg}; font-size: 11.5px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; font-style: normal; }
        .ms-rol.on { border-color: ${T.accent}; color: ${T.accent}; } .ms-rol.ok i { background: ${T.okFon}; color: ${T.ok}; }
        .ms-rol:disabled, .ms-qoy:disabled { opacity: 0.45; cursor: not-allowed; }
        p.ms-ipucha { margin: 0; font-size: 12.5px; font-weight: 600; color: ${T.accent}; }
        .ms-bashq { display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: center; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; color: ${T.ink2}; }
        .ms-bashq-t { color: ${T.ink}; } .ms-bashq-t b.ok { color: ${T.ok}; } .ms-bashq-t b.yoq { color: ${T.ink2}; }
        .ms-tx { display: block; font-size: 12.5px; color: ${T.ink2}; margin-bottom: 4px; }
        .ms-tx.ok b { color: ${T.ok}; } .ms-tx b.yoq { color: ${T.ink2}; }
        .ms-x-m { display: block; }
        .ms-x-iz { display: block; font-size: 12.5px; color: ${T.ink2}; border-top: 1px solid ${fon(T.ok, 0.25)}; margin-top: 6px; padding-top: 6px; }
        .ms-yolk { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ms-yolk.tugadi { gap: 5px; }
        .ms-nuqtalar { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .ms-nuqta-ro { display: flex; gap: 5px; }
        .ms-nuqta-ro i { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid ${T.line}; font-size: 10px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; font-style: normal; background: ${T.paper}; }
        .ms-nuqta-ro i.ok { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; } .ms-nuqta-ro i.cur { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ms-n5 { font-size: 12.5px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; }
        .ms-yol-otgan { display: flex; flex-direction: column; gap: 4px; }
        .ms-yol-q { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; font-size: 12.5px; animation: ms-kir 0.35s ease-out both; }
        .ms-yol-q b { font-weight: 700; color: ${T.ink}; } .ms-yol-q.ok { background: ${T.okFon}; }
        .ms-yol-karta { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.25); animation: ms-karta 0.35s ease-out both; }
        p.ms-hodisa { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.4; color: ${T.ink}; }
        .ms-qoy, .ms-keyingi { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; padding: 9px 14px; border-radius: 10px; border: none; background: ${T.accent}; color: #fff; cursor: pointer; align-self: flex-start; }
        .ms-keyingi { background: ${T.paper}; color: ${T.accent}; border: 1.5px solid ${T.accent}; }
        .ms-bu { font-size: 14px; color: ${T.ink}; animation: ms-kir 0.35s ease-out both; } .ms-bu b { color: ${T.accent}; }
        .ms-tax-y { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; animation: ms-kir 0.35s ease-out 0.15s both; }
        p.ms-sabab { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; animation: ms-kir 0.35s ease-out 0.25s both; }
        .ms-yol-past { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ms-muhr { display: inline-block; font-size: 11.5px; font-weight: 800; padding: 4px 10px; border-radius: 8px; border: 2px solid; transform: rotate(-4deg); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; animation: ms-muhr 0.45s ease-out 0.35s both; }
        .ms-muhr.ok { color: ${T.ok}; border-color: ${T.ok}; background: ${T.okFon}; } .ms-muhr.yoq { color: ${T.ink2}; border-color: ${fon(T.ink2, 0.55)}; background: ${T.paper}; }
        .ms-muhr.kichik { font-size: 10px; padding: 2px 6px; transform: none; animation: none; border-width: 1.5px; }
        .ms-k2 { display: flex; gap: 22px; align-items: flex-start; justify-content: flex-start; text-align: left; }
        .ms-k2 > .zoomable { flex: none; }
        .ms-ish > .zoomable:not(.zoom-on) > .zoom-btn, .ms-k2 > .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }
        .ms-k2-ong { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
        .ms-tg { width: 170px; height: 272px; border-radius: 24px; background: #23222B; padding: 7px; display: flex; flex-direction: column; flex: none; transition: width 0.4s ease, height 0.4s ease; }
        .ms-tg.kichik { width: 140px; height: 224px; }
        .ms-tg-bar { height: 24px; text-align: center; color: ${TELEGRAM_RANG}; font-size: 13px; font-weight: 800; line-height: 24px; }
        .ms-tg-ro, .ms-tg-qatlam { flex: 1; min-height: 0; background: ${T.paper}; border-radius: 17px; padding: 8px; display: flex; flex-direction: column; gap: 6px; overflow: hidden; }
        .ms-tg-chat { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 600; padding: 6px; border-radius: 8px; background: ${T.bg}; color: ${T.ink}; }
        .ms-tg-chat i { width: 18px; height: 18px; border-radius: 50%; background: ${fon(TELEGRAM_RANG, 0.35)}; flex: none; }
        .ms-tg-chat.pre { background: ${T.accentSoft}; color: ${T.accent}; animation: ms-kir 0.5s ease-out 0.4s both; }
        .ms-tg-chat.ok b { margin-left: auto; color: ${T.ok}; }
        .ms-tg-pre { padding: 6px 8px; border-radius: 8px; border: 1.5px dashed ${T.accent}; display: flex; justify-content: space-between; font-size: 11.5px; color: ${T.accent}; }
        .ms-tg-bepul { display: flex; flex-direction: column; gap: 5px; padding-top: 4px; }
        .ms-tg-bn { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ok}; }
        .ms-k2-kartalar { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ms-k2-k { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 6px; }
        .ms-k2-y { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .ms-k2-ustun { display: flex; align-items: flex-end; gap: 12px; height: 76px; padding: 0 8px; border-bottom: 1px solid ${T.line}; }
        .ms-k2-ustun i { width: 26px; border-radius: 4px 4px 0 0; background: ${fon(TELEGRAM_RANG, 0.35)}; }
        .ms-k2-ustun i.bir { height: 24px; } .ms-k2-ustun i.uch { height: 72px; background: ${TELEGRAM_RANG}; transform-origin: bottom; animation: ms-osish 0.9s ease-out 0.25s both; }
        .ms-k2-son { font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .ms-k2-f { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .ms-k2-nuqta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .ms-k2-nuqta b { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .ms-k2-kadr { font-size: 12.5px; color: ${T.ink2}; animation: ms-kir 0.35s ease-out both; }
        p.ms-brend { margin: 0 0 10px; font-size: 13px; color: ${T.ink}; }
        .ms-qviz { margin-top: 4px; }
        .ms-qviz-ikki { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; }
        .ms-qviz-q { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ms-ish { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 18px; align-items: start; }
        @media (min-width: 761px) { .q-mustaqil:has(> .ms-ish:not(.yakuniy)) { max-width: 940px; } }
        .ms-karta { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.25); animation: ms-karta 0.35s ease-out both; min-width: 0; }
        .ms-karta.err { border-color: ${fon(T.err, 0.55)}; }
        .ms-inp { width: 100%; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; color: ${T.ink}; padding: 9px 11px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; outline: none; }
        .ms-ta { resize: vertical; min-height: 58px; line-height: 1.4; }
        .ms-inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .ms-inp.err { border-color: ${T.err}; }
        .ms-inp::placeholder { color: ${fon(T.ink, 0.42)}; }
        .ms-inp-q { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .ms-inp-q .ms-inp { flex: 1 1 200px; width: auto; }
        .ms-karta-tug { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
        .ms-karta-tug.chap { justify-content: flex-start; }
        .ms-yordam { padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; display: flex; flex-direction: column; gap: 6px; }
        .ms-yordam p { margin: 0; } .ms-yordam code, p.ms-kulrang code, p.ms-darvoza-ok code { white-space: nowrap; }
        .ms-yumshoq { font-weight: 600; }
        .ms-funk { display: flex; flex-direction: column; gap: 6px; }
        .ms-funk-q { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; font-size: 13px; color: ${T.ink}; }
        .ms-funk-q.err { box-shadow: inset 0 0 0 1.5px ${fon(T.err, 0.6)}; }
        .ms-funk-t { display: flex; gap: 6px; flex: none; }
        p.ms-jonli { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .ms-modellar { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
        .ms-mbtn { font-family: 'Manrope', sans-serif; text-align: left; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; cursor: pointer; display: flex; flex-direction: column; gap: 2px; }
        .ms-mbtn b { font-size: 13px; color: ${T.ink}; } .ms-mbtn span { font-size: 11.5px; color: ${T.ink2}; }
        .ms-mbtn.on { border-color: ${T.accent}; background: ${T.accentSoft}; } .ms-mbtn.err { border-color: ${fon(T.err, 0.55)}; }
        .ms-rad { display: flex; flex-direction: column; gap: 6px; padding-top: 8px; border-top: 1px dashed ${T.line}; }
        .ms-rad-q { display: flex; flex-direction: column; gap: 6px; }
        .ms-rad-t { display: flex; flex-wrap: wrap; gap: 6px; }
        .ms-yana { align-self: flex-start; background: none; border: none; color: ${T.accent}; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; padding: 2px 0; }
        .ms-strip-ro { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; }
        .ms-strip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; background: ${T.ink}; color: ${T.paper}; font-size: 12.5px; font-weight: 700; white-space: nowrap; }
        .ms-strip em { font-style: normal; opacity: 0.75; } .ms-strip.yangi { animation: ms-pop 0.45s ease-out; }
        .ms-qism { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; display: inline-flex; gap: 5px; align-items: center; }
        .ms-qism i { width: 18px; height: 18px; border-radius: 50%; background: ${T.bg}; border: 1px solid ${T.line}; font-style: normal; font-size: 10px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .ms-qism.ok i { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; } .ms-qism.cur { color: ${T.accent}; } .ms-qism.cur i { border-color: ${T.accent}; color: ${T.accent}; }
        .ms-modelim { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 5px; min-width: 0; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.25); }
        .ms-modelim.ixcham { padding: 10px 12px; }
        .ms-modelim-n { font-size: 17px; font-weight: 800; color: ${T.accent}; }
        p.ms-mq { margin: 0; font-size: 13px; line-height: 1.4; display: flex; gap: 5px; align-items: baseline; flex-wrap: wrap; color: ${T.ink}; border-radius: 6px; }
        p.ms-mq > span { color: ${T.ink2}; } p.ms-mq > b { font-weight: 600; min-width: 0; overflow-wrap: anywhere; }
        p.ms-mq.yangi { animation: ms-yon-bg 1.3s ease-out; } p.ms-mq.yon { background: ${T.accentSoft}; padding: 2px 6px; }
        .ms-tahrir { margin-left: auto; background: none; border: none; color: ${T.ink2}; cursor: pointer; font-size: 13px; padding: 0 2px; }
        .ms-tahrir:hover { color: ${T.accent}; }
        .ms-fokus { display: flex; flex-direction: column; gap: 12px; animation: ms-karta 0.4s ease-out both; }
        .q-mustaqil:has(> .ms-s9:not(.yakka)) { max-width: 900px; }
        .ms-s9 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 18px; align-items: start; }
        .ms-s9.yakka { grid-template-columns: minmax(0, 560px); }
        .ms-s9-chap { display: flex; flex-direction: column; gap: 10px; }
        .ms-s9-mk { display: flex; flex-direction: column; gap: 10px; }
        .ms-s9-sahna { display: flex; justify-content: center; }
        .ms-s9-sahna .ms-mk { min-height: 0; width: 150px; }
        .q-mustaqil:has(> .ms-s9.yakka) { max-width: 820px; }
        @media (min-width: 761px) { .ms-s9.yakka { grid-template-columns: minmax(0, 1fr); } .ms-s9.yakka .ms-s9-mk { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; align-items: start; } }
        .ms-taymer { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; align-items: flex-start; }
        .ms-taymer-ro { display: flex; align-items: center; gap: 10px; width: 100%; }
        .ms-taymer-y { flex: 1; height: 8px; border-radius: 999px; background: ${T.line}; overflow: hidden; }
        .ms-taymer-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.25s linear; }
        .ms-taymer-s { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; white-space: nowrap; color: ${T.ink}; }
        .ms-taymer-s em { font-style: normal; color: ${T.ink2}; font-size: 12px; }
        .ms-varaq { background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .ms-vq { display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: background 0.3s ease; }
        .ms-vq.ok { background: ${T.okFon}; border-color: ${fon(T.ok, 0.4)}; } .ms-vq.yoq { border-color: ${fon(T.err, 0.55)}; }
        .ms-vq.bos { cursor: pointer; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ms-puls 2.2s ease-out 0.3s 3; }
        .ms-vq-s { font-size: 13.5px; font-weight: 600; display: flex; gap: 8px; color: ${T.ink}; }
        .ms-vq-s i { flex: none; width: 20px; height: 20px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .ms-vq-b { display: flex; gap: 6px; align-items: center; }
        .ms-belgi { width: 38px; height: 32px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-size: 15px; font-weight: 800; cursor: pointer; color: ${T.ink}; }
        .ms-belgi.v.on { background: ${T.okFon}; border-color: ${T.ok}; color: ${T.ok}; } .ms-belgi.x.on { background: ${T.errFon}; border-color: ${T.err}; color: ${T.err}; }
        .ms-chorla-b { border-color: ${fon(T.accent, 0.6)}; animation: ms-chorla 1.8s ease-out 0.5s 2; }
        .okc { color: ${T.ok}; } .errc { color: ${T.err}; }
        .ms-ozg { font-style: normal; font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; animation: ms-pop 0.45s ease-out; }
        .ms-vq-iz { font-size: 12.5px; color: ${T.ink2}; }
        .ms-s10 { display: contents; }
        .ms-darvoza { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.accentSoft}; }
        p.ms-darvoza-s { margin: 0; font-size: 13.5px; font-weight: 600; line-height: 1.45; color: ${T.ink}; }
        .ms-chorla { display: flex; flex-wrap: wrap; gap: 6px; }
        .ms-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: ms-chorla 1.8s ease-out 0.4s 2; }
        .ms-chorla > :nth-child(2) { animation-delay: 0.65s; } .ms-chorla > :nth-child(3) { animation-delay: 0.9s; }
        .ms-kodchip { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; white-space: nowrap; }
        .ms-kodchip.err { border-color: ${T.err}; }
        p.ms-darvoza-ok { margin: 0; font-size: 13px; color: ${T.ok}; font-weight: 700; }
        ol.ms-qadamlar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .ms-qadamlar li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .ms-qadamlar li > i { flex: none; width: 20px; height: 20px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .ms-son { display: flex; flex-direction: column; gap: 8px; align-items: stretch; }
        .ms-son > .q-chip { align-self: flex-start; }
        .ms-son.yopiq { opacity: 0.7; }
        .ms-tax-teg { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: ${T.bg}; border: 1px dashed ${T.line}; color: ${T.ink2}; }
        .ms-bajardim { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .ms-qulf-y { font-size: 12.5px; color: ${T.ink2}; }
        .ms-neon { background: ${CODE.bg}; border-radius: 12px; overflow: hidden; color: ${CODE.text}; }
        .ms-neon-bar { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(0,0,0,0.25); font-size: 12.5px; }
        .ms-neon-bar b { color: ${NEON_RANG}; }
        @media (max-width: 760px) { .zoomable .ms-neon-bar { padding-right: 46px; } }
        .ms-run { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 800; padding: 5px 14px; border-radius: 8px; border: none; background: ${NEON_RANG}; color: #0B1110; cursor: pointer; }
        .ms-run:disabled { opacity: 0.5; cursor: not-allowed; }
        .ms-run.ms-halqa { outline-color: ${NEON_RANG}; }
        pre.ms-sql { margin: 0; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .ms-sql-b { color: ${CODE.attr}; background: rgba(255,255,255,0.08); padding: 0 3px; border-radius: 4px; }
        .ms-sql-b.ochiq { color: ${CODE.str}; animation: ms-pop 0.5s ease-out; }
        .ms-neon-jad { margin: 0 12px 12px; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
        .ms-neon-h { padding: 5px 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; background: rgba(255,255,255,0.08); }
        .ms-neon-q { padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${CODE.text}; }
        .ms-neon-q.ok { color: ${CODE.str}; animation: ms-yashil-q 1.2s ease-out; }
        p.ms-izoh-q { margin: 0 12px 12px; font-size: 12.5px; line-height: 1.45; color: ${CODE.text}; opacity: 0.88; }
        p.ms-kulrang { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .ms-kulrang-s { font-size: 11.5px; color: ${T.ink2}; }
        .ms-reja-yorliq { display: inline-block; align-self: flex-start; font-size: 12px; padding: 3px 10px; border-radius: 999px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink2}; margin-bottom: 6px; }
        .ms-reja { display: contents; }
        @media (min-width: 761px) { .ms-reja .ms-tel { height: 236px; } }
        .ms-k { display: contents; }
        .ms-k-maket { display: flex; flex-direction: column; gap: 8px; }
        /* F-1007-473 (SABOQ P2): maket ustuni o'z kengligida — variantlar uning yonida; ichida CSS zoom yo'q (P5) */
        @media (min-width: 761px) { .ms-k .q-split { grid-template-columns: max-content minmax(0, 1fr); gap: 28px; } }
        .ms-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: ms-chorla-v 1.8s ease-out 0.5s 2; }
        .ms-k.kutish .q-variant:nth-child(2) { animation-delay: 0.75s; } .ms-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; } .ms-k.kutish .q-variant:nth-child(4) { animation-delay: 1.25s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: ms-chorla 1.8s ease-out 0.5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: 0.75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .ms-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ms-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 110px 26px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink}; }
        .ms-ovoz-q.men { font-weight: 800; color: ${T.accent}; }
        .ms-ovoz-y { height: 8px; border-radius: 999px; background: ${T.line}; overflow: hidden; }
        .ms-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease; }
        .ms-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: ms-puls 2.2s ease-out 0.3s 3; }
        .ms-halqa-i { border-color: ${T.accent} !important; animation: ms-halqa-i 2.4s ease-in-out 0.4s 3; }
        .ms-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .ms-ustoz b { color: ${T.ink}; }
        .ms-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ms-puls 1.8s ease-out 0.4s 3; }
        p.ms-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.ms-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ms-nuqta 2.4s ease-in-out 3; }
        .ms-hw { display: flex; flex-direction: column; gap: 12px; }
        .ms-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .ms-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .ms-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .ms-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.ms-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .ms-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ms-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        p.ms-hw-ost { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .ms-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .ms-ai { display: flex; flex-direction: column; }
        p.ms-ai-m { margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .ms-ai-sorov { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.45; color: ${T.ink}; white-space: pre-wrap; }
        .ms-ai-btn { margin: 0; align-self: flex-start; }
        .card-lbl.acc { color: ${T.accent}; }
        .ms-yakun { display: contents; }
        .ms-yakun.belgisiz .done-chip .tick { display: none; }
        @media (max-width: 760px) {
          .ms-ikki, .ms-ish, .ms-s9 { grid-template-columns: minmax(0, 1fr); }
          .ms-ikki > .ms, .ms-ish > .zoomable { justify-self: center; }
          .ms-ish > .ms-karta { order: -1; }
          .ms-k2 { flex-direction: column; align-items: center; } .ms-k2-kartalar { grid-template-columns: 1fr; }
          .ms-hw-karta { grid-template-columns: 1fr; }
        }
        @media (max-width: 440px) {
          .ms-qator { flex-direction: column; align-items: center; }
          .ms-yon { width: 100%; padding-top: 0; flex-direction: row; flex-wrap: wrap; justify-content: center; }
          .ms-yon > .ms-pro, .ms-yon > .ms-hafta { flex: 1 1 150px; }
        }
        @keyframes ms-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes ms-karta { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
        @keyframes ms-pop { 0% { transform: scale(1.18); } 100% { transform: none; } }
        @keyframes ms-muhr { 0% { opacity: 0; transform: rotate(-4deg) scale(1.6); } 100% { opacity: 1; transform: rotate(-4deg) scale(1); } }
        @keyframes ms-yoz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes ms-osish { from { transform: scaleY(0.33); } to { transform: scaleY(1); } }
        @keyframes ms-yon-bg { 0%, 40% { background-color: ${T.accentSoft}; } 100% { background-color: transparent; } }
        @keyframes ms-yashil-q { 0%, 50% { background-color: ${fon(T.ok, 0.35)}; } 100% { background-color: transparent; } }
        @keyframes ms-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes ms-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes ms-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes ms-halqa-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.28)}; } }
        @keyframes ms-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @media (prefers-reduced-motion: reduce) {
          .ms-qulf, .ms-rekl, .ms-oyin-son, .ms-tel-btn.yon, .ms-mk-g em, .ms-qavs, .ms-qm, .ms-hk, .ms-hk i, .ms-hk em, .ms-pro, .ms-pro-s, .ms-yol-q, .ms-yol-karta, .ms-bu, .ms-tax-y, p.ms-sabab, .ms-muhr, .ms-tg-chat.pre, .ms-k2-ustun i.uch, .ms-k2-kadr,
          .ms-karta, .ms-strip.yangi, p.ms-mq.yangi, .ms-fokus, .ms-vq.bos, .ms-chorla-b, .ms-ozg, .ms-chorla > .q-chip, .ms-sql-b.ochiq, .ms-neon-q.ok, .ms-k.kutish .q-variant, .q-bashorat .q-chip, .ms-halqa, .ms-halqa-i, .ms-flash .fc-front, p.ms-fc-ipucha i { animation: none !important; }
          .ms-odam, .ms-tg, .ms-taymer-y i { transition: none; }
        }
        /* ⛶ oynasi (SABOQ 38, E 48): ikki klassli selektor — keyingi «.zoomable position relative» qoidasi uni bekor qilmasin; ota-blok animatsiyasi «fixed» ni o'ziga bog'lamasin */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(980px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* 13-Modul sinf-supurish B: ⛶ oynasi faqat ko'rish uchun — maket ichidagi tugma (telefon tugmasi, jadval katagi, belgi) oynada bosilmaydi, harakat ⛶ dan tashqarida qoladi. Kirish ekrani variantlari va maket tugmasi qolipniki — tegilmaydi. */
        .zoom-on button:not(.zoom-btn) { pointer-events: none; cursor: default; }
        .q-kirish .zoom-on button { pointer-events: auto; cursor: pointer; }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
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
