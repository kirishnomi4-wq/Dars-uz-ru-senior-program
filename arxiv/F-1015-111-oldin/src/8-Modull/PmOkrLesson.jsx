import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 10-Modul · 1-dars (PM, 2-tur) «Bir oyda qaysi raqamni o'stirasiz?» — kalit m8-01, 15 ekran.
// Manba-haqiqat: feedback/F-1005-10modul/01-PmOkr-v3.md (GATE M ✓). Skelet: src/skelet/NamunaDars.jsx · qolip: src/qolip.
// Oqim: s0 QKirish · s1 QReja · s2 QTushuncha (maqsad va asosiy natija) · s3 test · s4 QTushuncha (saralash) · s5 test · s6 QTushuncha (foiz) ·
//   s7 test · s8 QTushuncha (tajriba) · s9 QMustaqil (OKR) · s10 QKod (Neon SQL) · s11 yakuniy test · podium · QKartochka · QYakun.
// Bitta vizual: OKR doskasi (OkrUstunlar + OkrKarta), bitta manba MAYDON_OKR (tayanch 1). Saqlanadi: pm-m8d1-okr (tayanch 9.8); o'qiydi: pm-m7d3-muammo.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m8d1-okr-v1', lessonTitle: { uz: "Bir oyda qaysi raqamni o'stirasiz?", ru: 'Какое число вы увеличите за месяц?' } };
// 15 ekran (MD v3): kirish → reja → maqsad va asosiy natija → test → saralash → test → foiz → test → tajriba → mustaqil ish → Neon SQL → yakuniy savol → podium → kartochkalar → yakun
// Uyga vazifa banneri fon so'zlari (R-008, faqat so'z)
const HW_TOKENS = [
  { t: { uz: 'maqsad', ru: 'цель' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'raqam', ru: 'число' }, l: 70, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'hozir', ru: 'сейчас' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'oy oxiri', ru: 'конец месяца' }, l: 74, tp: 68, s: 13, d: 6.8 }
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
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
// SCREEN_INTENTS — har ekran nima uchun bor (bola nima QILADI yoki nima BILADI)
export const SCREEN_INTENTS = {
  s0: "Bola o'tgan haftaning uch ustunidan qaysi biri «Maydon» o'z ishini bajarganini ko'rsatishini tanlaydi va «Band qildi» ostida «bosh raqam» chiqqanini ko'radi",
  s1: "Bola dars oxirida o'z loyihasiga OKR doskasini to'ldirishini oldindan ko'radi",
  s2: "Bola maqsad ostidagi qatorga uch bo'lakni birma-bir qo'shib, oy oxirida tekshiriladigan asosiy natija tug'ilishini ko'radi",
  s3: "Bola mini-do'kon qatorlaridan uch bo'lagi to'liq qatorni topadi",
  s4: "Bola besh qatorni birma-bir OKR doskasiga yoki «Qilinadigan ishlar»ga joylab, mehnat raqamini natijadan ajratadi",
  s5: "Bola mini-do'kon OKR'iga xaridor qilgan ishni sanaydigan qatorni tanlaydi",
  s6: "Bola foizni surib, «Band qildi» ustuni va bosh raqam qanday o'sishini ko'radi",
  s7: "Bola 20 kishidan 5 tasi necha foiz ekanini hisoblaydi",
  s8: "Bola tugma matni o'zgarishini uni bevosita tekshiradigan asosiy natijaga ulaydi",
  s9: "Bola o'z loyihasiga maqsad, uch asosiy natija va bitta tajribani yozadi",
  s10: "Bola Neon SQL Editor'da bosh raqamni bandlar jadvalidan sanaydi va sonni yozadi",
  s11: "Bola qaytib kelishni o'zgartiradigan bitta o'zgarishni tajriba sifatida tanlaydi",
  podium: "Bola sinf reytingida o'z o'rnini ko'radi",
  sflash: "Bola darsning o'n bitta savolini kartochkada takrorlaydi",
  s14: "Bola darsda nimani bilib olganini va uyda nima qilishini ko'radi"
};
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). To'g'ri javob o'rni (MD v3): s3 — C · s5 — A · s7 — D · s11 — B.
// Ishtirok-kalitlar (-1, s-qolipsiz): saralash (s4) · foiz (s6) · tajriba (s8) · practice (s9) · koding (s10) — maxrajga kirmaydi.
const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s11: 1, saralash: -1, foiz: -1, tajriba: -1, practice: -1, koding: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI). PM darsi: emoji o'rniga raqam 1/2/3 (S-026).
const RECAPS = {
  3: {
    title: { uz: "Asosiy natijaning uch bo'lagi", ru: 'Три части ключевого результата' },
    cards: [
      { ic: '1', h: { uz: 'Nima sanaladi: haftada band qilingan vaqtlar.', ru: "Что считается: брони за неделю." } },
      { ic: '2', h: { uz: 'Hozirgi raqam: 6.', ru: 'Текущее число: 6.' } },
      { ic: '3', h: { uz: 'Oy oxiridagi raqam: 20.', ru: 'Число к концу месяца: 20.' }, ask: { uz: "Mini-do'kon: qaysi qatorda uchala bo'lak ham bor?", ru: 'Мини-магазин: в какой строке есть все три части?' } }
    ]
  },
  5: {
    title: { uz: 'Mehnatmi yoki natijami', ru: "Труд или результат" },
    cards: [
      { ic: '1', h: { uz: "Bu misolda asosiy natija o'yinchilar nima qilganini sanaydi.", ru: 'В этом примере ключевой результат считает, что сделали игроки.' } },
      { ic: '2', h: { uz: "E'lon, rasm, talab — siz qilgan ish, mehnat raqami.", ru: "Объявление, фото, требование — ваша работа, число труда." } },
      { ic: '3', h: { uz: "Ishlar asosiy natijani o'zgartirish uchun qilinadi.", ru: 'Работу делают, чтобы изменить ключевой результат.' }, ask: { uz: "Mini-do'konning keyingi oy OKR'iga qaysi qator asosiy natija?", ru: 'Какая строка — ключевой результат для OKR мини-магазина на следующий месяц?' } }
    ]
  },
  7: {
    title: { uz: 'Foiz hisobi', ru: 'Расчёт процента' },
    cards: [
      { ic: '1', h: { uz: 'Vaqtni 25 kishi tanladi.', ru: 'Время выбрали 25 человек.' } },
      { ic: '2', h: { uz: 'Ulardan 6 tasi band qildi.', ru: 'Из них 6 забронировали.' } },
      { ic: '3', h: { uz: "6 ni 25 ga bo'lib, 100 ga ko'paytirsak — 24 foiz.", ru: 'Делим 6 на 25 и умножаем на 100 — 24 процента.' }, ask: { uz: '20 kishi vaqt tanladi, 5 tasi band qildi. Foiz qancha?', ru: '20 человек выбрали время, 5 забронировали. Какой процент?' } }
    ]
  },
  11: {
    title: { uz: 'Bitta tajriba', ru: 'Один эксперимент' },
    cards: [
      { ic: '1', h: { uz: "Tajriba — bitta o'zgarish.", ru: 'Эксперимент — одно изменение.' } },
      { ic: '2', h: { uz: "U o'zi tegadigan asosiy natijaga ulanadi.", ru: "Его привязывают к ключевому результату, которого он касается." } },
      { ic: '3', h: { uz: "Bir nechtasi birga o'zgarsa, nima yordam berganini ajratish qiyin.", ru: 'Если меняется несколько сразу, трудно понять, что помогло.' }, ask: { uz: 'Ikkinchi marta band qilganlar uchun qaysi biri tajriba?', ru: 'Что из этого — эксперимент для забронировавших второй раз?' } }
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
// Son sanab o'sadi (SABOQ 19): oldingi qiymatdan yangisiga; reduced-motion — darhol
const useSanoq = (n, ms = 650) => {
  const [v, setV] = useState(n);
  const oldin = useRef(n);
  useEffect(() => {
    const dan = oldin.current; oldin.current = n;
    if (dan === n || kamHarakat() || typeof n !== 'number' || typeof dan !== 'number') { setV(n); return undefined; }
    let raf = 0; const t0 = performance.now();
    const qadam = (t) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(dan + (n - dan) * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(qadam); };
    raf = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(raf);
  }, [n, ms]);
  return v;
};
// P-051: mashq yakunida xulosaga silliq skroll (boshidan tugagan ekranda — yo'q)
const useXulosaSkroll = (on, boshdanTugagan) => {
  const bosh = useRef(!!boshdanTugagan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 900);
    return () => clearTimeout(t);
  }, [on]);
};
// Bo'lak joyiga uchib boradi (SABOQ 9, 19): manba to'rtburchagidan yangi paydo bo'lgan joyga arvoh-nusxa; reduced-motion — yo'q
const uchir = (manba, nishonSel, matn) => {
  if (!manba || typeof document === 'undefined' || kamHarakat()) return;
  requestAnimationFrame(() => {
    const nishon = document.querySelector(nishonSel);
    if (!nishon) return;
    const b = nishon.getBoundingClientRect();
    const g = document.createElement('div');
    g.className = 'okr-arvoh'; g.textContent = matn;
    Object.assign(g.style, { left: `${manba.left}px`, top: `${manba.top}px`, width: `${manba.width}px` });
    document.body.appendChild(g);
    const dx = (b.left + b.width / 2) - (manba.left + manba.width / 2);
    const dy = (b.top + b.height / 2) - (manba.top + g.offsetHeight / 2);
    const sk = Math.max(0.55, Math.min(1, b.width / manba.width));
    const an = g.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(${sk})`, opacity: 0.25 }], { duration: 560, easing: 'cubic-bezier(.45,.05,.25,1)' });
    an.onfinish = () => g.remove(); an.oncancel = () => g.remove();
  });
};

// Bir qatordan to'rt qatorgacha o'sadigan matn maydoni (DE-175)
const GrowInput = ({ value, onChange, onEnter, className, ...p }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 112)}px`; }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={cxx('okr-kirit', className)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && onEnter) { e.preventDefault(); onEnter(); } }} {...p} />;
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
  return <span className={cxx('ach-rule', lost && 'lost')}>{lost
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
    <div className="okr-ovoz fade-step" aria-label={tr({ uz: 'Jonli natija', ru: 'Живой результат' })}>
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('okr-ovoz-q', mening === i && 'men')}>
          <span className="okr-ovoz-t">{v}</span>
          <span className="okr-ovoz-yol"><i style={{ width: `${jami ? Math.round((n[i] / jami) * 100) : 0}%` }} /></span>
          <span className="okr-ovoz-n">{n[i]}</span>
        </div>
      ))}
    </div>
  );
};

// Bashorat (181) — kirishda ko'tariladi, variantlar navbat bilan; tanlangach ixcham qatorga «yig'iladi» va natijagacha turadi (SABOQ 11, 19)
const TAXMIN_L = { uz: 'Taxminingiz', ru: "Ваше предположение" };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="okr-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(savol)} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="okr-taxmin"><span className="okr-taxmin-l">{tr(TAXMIN_L)}</span><span className="okr-taxmin-s">{tr(savol)}</span><b className="okr-taxmin-j">{(variantlar.find(v => v.k === tanlov) || {}).t}</b></div>);
// Natija bloki (SABOQ 25): taxmin qatori + izoh — xulosa bilan bitta blok
const NatijaBlok = ({ children }) => <div className="okr-nb">{children}</div>;

// ===== DARSNING BITTA VIZUALI — OKR doskasi (163, 180). Bitta manba: MAYDON_OKR (tayanch 1 raqamlari va OKR aynan) =====
// Chapda «O'tgan hafta · Mentor misoli» — uch ustun (har odam-belgisi — bitta kishi); o'ngda — OKR doskasi (maqsad · uchta asosiy natija), ostida tajriba qatori.
// qolip-maket: okr-ustun okr-q okr-bolak
const MAYDON_OKR = {
  hafta: { ochdi: 40, vaqtniTanladi: 25, bandQildi: 6 },
  muammo: { uz: "O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.", ru: 'Игрокам трудно перед выходом на поле узнать свободное время и забронировать его.' },
  maqsad: { uz: "Mahalladagi o'yinchilar maydonni qo'ng'iroqsiz band qilsin.", ru: "Пусть игроки из махалли бронируют поле без звонков." },
  natijalar: [
    { nima: { uz: 'Haftada band qilingan vaqtlar', ru: "Брони за неделю" }, hozir: '6', oyOxirida: '20' },
    { nima: { uz: 'Vaqtni tanlaganlardan band qilganlar foizi', ru: 'Процент забронировавших среди выбравших время' }, hozir: '24%', oyOxirida: '40%' },
    { nima: { uz: "Ikkinchi marta band qilgan o'yinchilar", ru: 'Игроки, забронировавшие второй раз' }, hozir: '0', oyOxirida: '5' }
  ],
  tajriba: { nima: { uz: 'Tugmada tanlangan soat yozilsin', ru: "Пусть на кнопке будет выбранный час" }, natija: 2 },
  ishlar: [
    { id: 'elon', nima: { uz: "Mahalla chatiga yozilgan e'lonlar", ru: 'Объявления в чате махалли' }, hozir: '0', oyOxirida: '4' },
    { id: 'rasm', nima: { uz: "Saytga qo'shilgan yangi rasmlar", ru: 'Новые фото на сайте' }, hozir: '0', oyOxirida: '3' },
    { id: 'talab', nima: { uz: 'Agentga berilgan talablar', ru: "Требования, данные агенту" }, hozir: '0', oyOxirida: '6' }
  ]
};
const USTUN = [
  { id: 'ochdi', t: { uz: 'Ochdi', ru: 'Открыли' } },
  { id: 'vaqt', t: { uz: 'Vaqtni tanladi', ru: 'Выбрали время' } },
  { id: 'band', t: { uz: 'Band qildi', ru: 'Забронировали' } }
];
const YORLIQ = {
  maqsad: { uz: 'maqsad', ru: 'цель' },
  natija: { uz: 'asosiy natija', ru: 'ключевой результат' },
  tajriba: { uz: 'tajriba', ru: 'эксперимент' }
};
const HOZIR = { uz: 'hozir', ru: 'сейчас' };
const OY_OXIRIDA = { uz: 'oy oxirida', ru: 'к концу месяца' };
const OKR_SARLAVHA = { uz: 'OKR · keyingi oy', ru: 'OKR · следующий месяц' };
const CHAP_SARLAVHA = { uz: "O'tgan hafta · Mentor misoli", ru: 'Прошлая неделя · пример Ментора' };
const SANOQ_SHART = { uz: 'Mashqda har kishi har qadamda bir marta sanalgan.', ru: 'В упражнении каждый человек посчитан на каждом шаге один раз.' };

// Chap qism: uch ustun. Holatlar — tanlangan (accent), «bosh raqam» yorlig'i, oy oxiri joyi, foiz oralig'i, «2 · qaytib keldi», bir lahza yonish, kulrang o'tish
function OkrUstunlar({ sarlavha = CHAP_SARLAVHA, tanlangan, onTanla, band = MAYDON_OKR.hafta.bandQildi, bosh, oyOxiri, foiz, oraliqYon, qaytdi, yon, supur, db, izoh, tepa, kichik, keng, children }) {
  const h = MAYDON_OKR.hafta;
  const bandK = useSanoq(band);
  const sonlar = { ochdi: h.ochdi, vaqt: h.vaqtniTanladi, band };
  return (
    <div className={cxx('okr-chap', kichik && 'kichik', keng && 'keng')}>
      {sarlavha && <span className="okr-chap-s">{tr(sarlavha)}</span>}
      {tepa}
      <div className="okr-ustunlar">
        {supur ? <span className="okr-supur-w" aria-hidden="true"><span key={supur} className="okr-supur" /></span> : null}
        {USTUN.map((u, i) => {
          const n = sonlar[u.id];
          const isBand = u.id === USTUN[2].id;
          const El = onTanla ? 'button' : 'div';
          return (
            <React.Fragment key={u.id}>
              {i > 0 && <span className={cxx('okr-oraliq', i === 2 && oraliqYon && 'yon')} aria-hidden="true">
                {i === 2 && foiz ? <b className="okr-foiz" key={foiz}>{foiz}</b> : null}
                <i>→</i>
              </span>}
              <El {...(onTanla ? { type: 'button', onClick: () => onTanla(u.id) } : {})} className={cxx('okr-ustun', tanlangan === u.id && 'on', onTanla && 'bosiladi')} style={{ animationDelay: `${0.06 + i * 0.1}s` }}>
                {isBand && (oyOxiri || qaytdi) ? <span className="okr-u-ust">
                  {oyOxiri && <span className="okr-oy-joy">{tr({ uz: 'oy oxirida ?', ru: 'к концу месяца ?' })}</span>}
                  {qaytdi && <span className="okr-qaytdi">{tr({ uz: '2 · qaytib keldi', ru: '2 · вернулся' })}</span>}
                </span> : null}
                <b className="okr-son">{u.id === 'band' ? bandK : n}</b>
                <span className="okr-odamlar">
                  {Array.from({ length: n }, (_, k) => <i key={k} className={cxx('okr-odam', isBand && k >= h.bandQildi && 'yangi', isBand && qaytdi && k === 0 && 'qayt')} style={{ '--k': k }} />)}
                </span>
                <span className="okr-u-t">{tr(u.t)}</span>
                <span className="okr-u-alt">{isBand && (bosh || db) ? <span className="okr-bosh" key={db ? 'db' : 'b'}>{db ? tr({ uz: "Database'dan", ru: 'из Database' }) : tr({ uz: 'bosh raqam', ru: 'главное число' })}</span> : null}</span>
                {yon && yon.id === u.id ? <span key={yon.k} className="okr-u-yon" aria-hidden="true" /> : null}
              </El>
            </React.Fragment>
          );
        })}
      </div>
      {izoh && <p className="okr-chap-izoh">{tr(izoh)}</p>}
      {children}
    </div>
  );
}

// Oy oxiri belgisi: chizilgan kalendar varag'i (oxirgi kun ajralgan) + savol pufagi
const OyBelgi = ({ pufak }) => (
  <span className="okr-oy">
    {pufak ? <span className={cxx('okr-pufak', pufak === '✓' && 'ok')} key={pufak === '✓' ? 'ok' : tr(pufak)}>{pufak === '✓' ? '✓' : tr(pufak)}</span> : null}
    <span className="okr-kal" aria-hidden="true"><i className="okr-kal-b" /><span className="okr-kal-k">{Array.from({ length: 12 }, (_, k) => <i key={k} className={k === 11 ? 'oxir' : undefined} />)}</span></span>
  </span>
);

// Tajriba → asosiy natija bog'lanish chizig'i (o'lcham — DOM dan; o'lcham o'zgarsa qayta hisob)
const useYol = (ulangan, ongRef, tajRef, qRefs) => {
  const [yol, setYol] = useState(null);
  useLayoutEffect(() => {
    if (!ulangan) { setYol(null); return undefined; }
    const hisob = () => {
      const o = ongRef.current, a = tajRef.current, b = qRefs.current[ulangan];
      if (!o || !a || !b) return;
      const r = o.getBoundingClientRect(); const z = o.offsetWidth ? r.width / o.offsetWidth : 1;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const x1 = (ra.right - r.left) / z, y1 = (ra.top + ra.height / 2 - r.top) / z;
      const x2 = (rb.right - r.left) / z, y2 = (rb.top + rb.height / 2 - r.top) / z;
      const xr = Math.max(x1, x2) + 12;
      setYol(`M ${x1.toFixed(1)} ${y1.toFixed(1)} H ${xr.toFixed(1)} V ${y2.toFixed(1)} H ${(x2 + 2).toFixed(1)}`);
    };
    hisob();
    const t = setTimeout(hisob, 520);
    window.addEventListener('resize', hisob);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(hisob) : null;
    if (ro && ongRef.current) ro.observe(ongRef.current);
    return () => { clearTimeout(t); window.removeEventListener('resize', hisob); if (ro) ro.disconnect(); };
  }, [ulangan]); // eslint-disable-line
  return yol;
};

// O'ng qism: OKR doskasi. Qator: { i, nima, hozir, oyOxirida, chiziq, holat: bosh|joriy|xato|ok|nishon, kir, uch, onClick, tahrir, bosh: matn }
function OkrKarta({ sarlavha, yorliq, pufak, muammo, maqsad, natijalar = [], tajriba, ulangan, ishlar, mehnat, ishlarYigil, children }) {
  const ongRef = useRef(null), tajRef = useRef(null), qRefs = useRef({});
  const yol = useYol(ulangan, ongRef, tajRef, qRefs);
  const qator = (r) => {
    const bos = !!r.onClick;
    return (
      <div key={r.i} ref={el => { qRefs.current[r.i] = el; }} data-uch={r.uch} data-qator={bos ? r.i : undefined}
        className={cxx('okr-q', r.holat, bos && 'bosiladi', r.kir && 'kir', ulangan === r.i && 'ulangan')}
        {...(bos ? { role: 'button', tabIndex: 0, onClick: r.onClick, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); r.onClick(); } } } : {})}>
        <span className="okr-q-n">{r.holat === 'ok' ? '✓' : r.i}</span>
        <span className="okr-q-b">
          {r.nima ? <span className="okr-q-t">{r.nima}</span> : <span className="okr-q-bosh">{r.bosh}</span>}
          {(r.hozir != null || r.oyOxirida != null) && <span className="okr-q-r">
            {r.hozir != null && <span className="okr-chip" key={`h${r.hozir}`}>{tr(HOZIR)} <b>{r.hozir}</b></span>}
            <span className="okr-q-ch"><i style={{ transform: `scaleX(${r.chiziq ?? (r.oyOxirida != null ? 1 : 0)})` }} /></span>
            {r.oyOxirida != null && <span className="okr-chip" key={`o${r.oyOxirida}`}>{tr(OY_OXIRIDA)} <b>{r.oyOxirida}</b></span>}
          </span>}
        </span>
        {r.tahrir}
      </div>
    );
  };
  const mq = maqsad && (typeof maqsad === 'object' && !React.isValidElement(maqsad) && 't' in maqsad ? maqsad : { t: maqsad });
  return (
    <div ref={ongRef} className="okr-ong">
      <div className="okr-karta">
        <div className="okr-k-bosh">
          {sarlavha ? <span className="okr-k-s" key="s">{tr(OKR_SARLAVHA)}</span> : <span />}
          {pufak !== undefined && <OyBelgi pufak={pufak} />}
        </div>
        {muammo && <div className="okr-muammo">{muammo}</div>}
        {mq && <>
          {yorliq && <span className="okr-yorliq">{tr(YORLIQ.maqsad)}</span>}
          <div className={cxx('okr-q maqsad', mq.holat, mq.kir && 'kir')} data-uch={mq.uch}>
            {mq.holat === 'ok' && <span className="okr-q-n">✓</span>}
            <span className="okr-q-b">{mq.t ? <span className="okr-q-t">{mq.t}</span> : <span className="okr-q-bosh">{mq.bosh}</span>}</span>
            {mq.tahrir}
          </div>
        </>}
        {yorliq && natijalar.length > 0 && <span className="okr-yorliq">{tr(YORLIQ.natija)}</span>}
        {natijalar.map(qator)}
      </div>
      {tajriba && <div ref={tajRef} data-uch={tajriba.uch} className={cxx('okr-tajriba', tajriba.holat, ulangan && 'ulangan')}>
        {tajriba.yorliq && <span className="okr-yorliq">{tr(YORLIQ.tajriba)}</span>}
        {tajriba.ichi}
        {tajriba.tahrir}
      </div>}
      {ishlar && ishlar.length > 0 && ishlarYigil && <div className="okr-ishlar yig">
        <span className="okr-yorliq">{tr({ uz: 'Qilinadigan ishlar', ru: "Список дел" })}</span>
        <span className="okr-ishlar-q">{ishlar.map(x => x.nima).join(' · ')}</span>
        <b className="okr-ishlar-n">{ishlar.length} ✓</b>
        {mehnat && <span className="okr-mehnat">{tr({ uz: 'mehnat raqami', ru: "число труда" })}</span>}
      </div>}
      {ishlar && ishlar.length > 0 && !ishlarYigil && <div className="okr-ishlar">
        <span className="okr-yorliq">{tr({ uz: 'Qilinadigan ishlar', ru: "Список дел" })}</span>
        {ishlar.map(s => <div key={s.id} data-uch={s.uch} className={cxx('okr-ish', s.kir && 'kir')}><span>{s.nima}</span><b>{s.hozir} → {s.oyOxirida}</b></div>)}
        {mehnat && <span className="okr-mehnat">{tr({ uz: 'mehnat raqami', ru: "число труда" })}</span>}
      </div>}
      {yol && <svg className="okr-yol" aria-hidden="true"><path key={`${ulangan}`} d={yol} pathLength="1" /></svg>}
      {children}
    </div>
  );
}
// Doska: chap (ustunlar) va o'ng (OKR) — telefonda ustma-ust (KOD 3)
const OkrDoska = ({ chap, ong, tur }) => <div className={cxx('okr-doska', tur)}>{chap}{ong}</div>;
// Mentor misolining to'liq qatorlari (s6, s8 va mentor rejimi)
const maydonQator = (i, extra) => ({ i: i + 1, nima: tr(MAYDON_OKR.natijalar[i].nima), hozir: MAYDON_OKR.natijalar[i].hozir, oyOxirida: MAYDON_OKR.natijalar[i].oyOxirida, ...extra });

// ===== SCREEN 0 — KIRISH (QKirish: chapda o'tgan haftaning uch ustuni, o'ngda radio-variantlar; J-026 — ballsiz) =====
const HOOK_OPTS = [
  { id: 'ochdi', t: { uz: 'Ochdi: 40', ru: 'Открыли: 40' } },
  { id: 'vaqt', t: { uz: 'Vaqtni tanladi: 25', ru: 'Выбрали время: 25' } },
  { id: 'band', t: { uz: 'Band qildi: 6', ru: 'Забронировали: 6' } }
];
const HOOK_JAVOB = {
  band: { uz: <><b>Aynan!</b> «Maydon» band qilish uchun qurilgan. Band qilinganlar o'ssa, sayt o'z ishini ko'proq bajaradi.</>, ru: <><b>Именно!</b> «Maydon» создан для бронирования. Растут брони — сайт больше делает свою работу.</> },
  ochdi: { uz: <><b>Qiziq fikr!</b> Ochganlar ko'paysa yaxshi, lekin 40 kishidan 6 tasi band qildi. Sayt band qilish uchun qurilgan.</>, ru: <><b>Интересная мысль!</b> Больше открывших — хорошо, но из 40 человек забронировали 6. Сайт создан для бронирования.</> },
  vaqt: { uz: <><b>Qiziq fikr!</b> Vaqt tanlagan 25 kishidan 6 tasi band qildi. Sayt band qilinganda o'z ishini bajaradi.</>, ru: <><b>Интересная мысль!</b> Из 25 выбравших время забронировали 6. Сайт делает свою работу, когда бронируют.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [ochiq, setOchiq] = useState(!!storedAnswer || isMentor);
  useEffect(() => {
    if (picked === null || ochiq) return undefined;
    const t = setTimeout(() => setOchiq(true), kamHarakat() ? 0 : 750);
    return () => clearTimeout(t);
  }, [picked, ochiq]);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const faol = picked === null && !isMentor;
  return (
    <Stage eyebrow={tr({ uz: "Kirish · «Maydon» o'tgan hafta", ru: 'Введение · «Maydon» на прошлой неделе' })} screen={screen} navContent={<NavNext optionalLive disabled={faol} label={faol ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Bir oyda <A>qaysi raqamni</A> o'stirasiz?</>, ru: <>Какое <A>число</A> вы увеличите за месяц?</> })}
        mentor={<Mentor>{tr({ uz: "«Maydon» bir hafta ishladi. O'tgan haftaning uch ustunidan bittasini belgilang.", ru: '«Maydon» проработал неделю. Отметьте один из трёх столбцов прошлой недели.' })}</Mentor>}
        maket={<OkrUstunlar keng tanlangan={picked} onTanla={faol ? pick : undefined} bosh={ochiq} oyOxiri={ochiq} izoh={SANOQ_SHART} />}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
          {isLive && (picked !== null || isMentor) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
        </>}
      >
        <MentorNote>{tr({ uz: "Bosh raqam 5-Modulda bot uchun o'tilgan: «bot o'z ishini bajarganini sanaydigan raqam». Sinfdan so'rang: «Maydon» o'z ishini qachon bajardi deyish mumkin?", ru: 'Главное число проходили в 5-м модуле для бота: «число, которое считает, что бот сделал свою работу». Спросите класс: когда можно сказать, что «Maydon» сделал свою работу?' })}</MentorNote>
      </QKirish>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda OKR doskasining skeleti o'zi yoziladi — matnsiz; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: "Qaysi raqamni o'stirishni tanlaysiz", ru: 'Выберете, какое число увеличивать' }, teg: { uz: 'bosh raqam', ru: 'главное число' } },
  { t: { uz: "Oy oxirida yetganingizni sanashni o'rganasiz", ru: 'Научитесь считать, чего достигли к концу месяца' }, teg: { uz: 'asosiy natija', ru: 'ключевой результат' } },
  { t: { uz: "Oyning birinchi o'zgarishini tanlaysiz", ru: 'Выберете первое изменение месяца' }, teg: { uz: 'tajriba', ru: 'эксперимент' } },
  { t: { uz: 'Loyihangizga keyingi oy uchun yozasiz', ru: 'Напишете для своего проекта на следующий месяц' }, teg: { uz: 'OKR', ru: 'OKR' } }
];
// Skelet: kulrang chiziqlar 0.9 s oraliqda birma-bir to'q chiziqqa aylanadi, oxirida tajriba chizig'i bitta qatorga ulanadi
const OkrSkelet = () => {
  const [n, setN] = useState(() => (kamHarakat() ? 6 : 0));
  useEffect(() => { if (n >= 6) return undefined; const t = setTimeout(() => setN(k => k + 1), n === 0 ? 500 : 900); return () => clearTimeout(t); }, [n]);
  const ch = (k, w) => <i className={cxx('okr-sk', n > k && 'on')} style={{ width: w }} />;
  return (
    <OkrKarta pufak={null}
      maqsad={{ t: ch(0, '86%') }}
      natijalar={[1, 2, 3].map(i => ({ i, nima: ch(i, ['72%', '84%', '64%'][i - 1]), hozir: null, oyOxirida: null }))}
      tajriba={{ ichi: ch(4, '58%'), holat: n > 4 ? 'tayyor' : undefined }} ulangan={n > 5 ? 2 : null} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun loyihangizga <A>oylik maqsad va raqamlar</A> yozasiz.</>, ru: <>Сегодня пишете <A>цель на месяц и числа</A>.</> })}
      mentor={<Mentor>{tr({ uz: "O'tgan modulda «Maydon» qurildi va sinovdan keyin tuzatildi. Bugungi misol ham shu sayt haqida.", ru: "В прошлом модуле построили «Maydon» и исправили его после теста. Сегодняшний пример тоже про этот сайт." })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida — bosh raqam, OKR va birinchi tajriba', ru: 'К концу урока — главное число, OKR и первый эксперимент' })}
      chap={<OkrSkelet />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — MAQSAD VA ASOSIY NATIJA (QTushuncha markaziy: bashorat → bo'laklar birma-bir → doska va pufak o'zgaradi → atamalar misoldan keyin) =====
const S2_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const S2_SAVOL = { uz: 'Oy oxirida tekshirish uchun qatorga nechta bo\'lak kerak?', ru: 'Сколько частей нужно строке, чтобы проверить её в конце месяца?' };
const S2_BOLAK = [
  { uz: "Nima sanalishini qo'shing", ru: 'Добавьте, что считается' },
  { uz: "Hozirgi raqamni qo'shing", ru: 'Добавьте текущее число' },
  { uz: "Oy oxiridagi raqamni qo'shing", ru: 'Добавьте число к концу месяца' }
];
const S2_PUFAK = [
  { uz: 'Nimani sanaysiz?', ru: 'Что считаете?' },
  { uz: 'Hozir nechta?', ru: 'Сколько сейчас?' },
  { uz: 'Oy oxirida nechta?', ru: 'Сколько к концу месяца?' }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(storedAnswer ? 3 : 0);
  const [yon, setYon] = useState(null);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1500, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, n);
  useXulosaSkroll(done, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const qosh = () => { if (!taxmin || done) return; if (n === 0) setYon({ id: 'band', k: Date.now() }); setN(k => Math.min(3, k + 1)); };
  const r = MAYDON_OKR.natijalar[0];
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  const vizual = (
    <OkrDoska tur="chap-kichik"
      chap={<OkrUstunlar kichik bosh yon={yon} />}
      ong={<OkrKarta sarlavha={done} yorliq={done} pufak={done ? '✓' : S2_PUFAK[n]}
        muammo={<><b>{tr({ uz: 'Muammo:', ru: 'Проблема:' })}</b> {tr(MAYDON_OKR.muammo)}</>}
        maqsad={tr(MAYDON_OKR.maqsad)}
        natijalar={[{ i: 1, nima: n >= 1 ? tr(r.nima) : null, bosh: '', hozir: n >= 2 ? r.hozir : null, oyOxirida: n >= 3 ? r.oyOxirida : null, holat: n === 0 ? 'bosh' : (done ? undefined : 'joriy') }]}>
        {taxmin && !tugadi && <div className="okr-bolaklar fade-step">
          {S2_BOLAK.map((b, k) => k < n
            ? <span key={k} className="okr-bolak-ok"><i>✓</i>{tr(b)}</span>
            : k === n
              ? <QTugma key={k} className="okr-bos" onClick={qosh}>{k + 1} · {tr(b)}</QTugma>
              : <span key={k} className="okr-bolak-kut"><i>{k + 1}</i>{tr(b)}</span>)}
          {ipucha && <span className="okr-ipucha fade-step">{tr({ uz: "Keyingi bo'lakni qo'shing — oy oxiri savoli qanday o'zgarishini ko'ring.", ru: 'Добавьте следующую часть — посмотрите, как изменится вопрос о конце месяца.' })}</span>}
        </div>}
      </OkrKarta>} />
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · oy oxiri', ru: 'Понятие · конец месяца' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'laklarni qo'shing", ru: 'Добавьте части' })} (${n}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Oy oxirida yetganingizni <A>qanday bilasiz?</A></>, ru: <>Как вы <A>узнаете в конце месяца</A>, что достигли?</> })}
        mentor={<Mentor>{tr({ uz: "«Maydon» doskasida muammo hal bo'lgandagi holat yozilgan — o'yinchilar nima qiladi. Ostiga bo'laklarni birma-bir qo'shing va oy oxiri savoliga qarang.", ru: 'На доске «Maydon» записано, что будет, когда проблема решена: что делают игроки. Добавляйте под ней части по одной и смотрите на вопрос о конце месяца.' })}</Mentor>}
        bashorat={!done && <Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={vizual}
        natija={done && <NatijaBlok>
          {tx && <QTaxmin togri={taxmin === '3'}>{taxmin === '3'
            ? tr({ uz: <>Taxminingiz to'g'ri chiqdi: <b>3</b>.</>, ru: <>Ваше предположение оказалось верным: <b>3</b>.</> })
            : <>{tr(TAXMIN_L)}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>3</b></>}</QTaxmin>}
          <QIzoh>{tr({ uz: 'Tepadagi raqamsiz yo\'nalish — maqsad, raqamli qator — asosiy natija. Ikkalasi birga OKR deyiladi (Objectives and Key Results).', ru: 'Направление сверху без чисел — цель, строка с числами — ключевой результат. Вместе они называются OKR (Objectives and Key Results).' })}</QIzoh>
          <QIzoh>{tr({ uz: "Bu darsda har asosiy natijani uch bo'lak bilan yozamiz: nima sanaladi, hozir nechta, oy oxirida nechta.", ru: 'На этом уроке каждый ключевой результат пишем из трёх частей: что считается, сколько сейчас, сколько к концу месяца.' })}</QIzoh>
        </NatijaBlok>}
        xulosa={done && tr({ uz: 'Asosiy natija — raqam bilan, muddat bilan sanaladigan natija.', ru: "Ключевой результат — результат, который считают числом к определённому сроку." })}
      >
        <MentorNote>{tr({ uz: "Maqsad muammo gapidan o'sadi: muammo hal bo'lsa, o'yinchi qo'ng'iroq qilmasdan band qiladi. «Haftada … 20» — oyning oxirgi haftasidagi raqam, oy bo'yi jami emas. 20 — Mentor tanlagan maqsad, hisoblab topilgan «to'g'ri son» emas: erishsa bo'ladigan, lekin hozirgidan sezilarli katta son tanlanadi. Sinfdan so'rang: «20» ni maqsad qatoriga yozsak, nima o'zgaradi?", ru: "Цель вырастает из формулировки проблемы: если проблема решена, игрок бронирует без звонка. «В неделю … 20» — число последней недели месяца, а не сумма за месяц. 20 — цель, выбранная Ментором, а не вычисленное «правильное число»: берут достижимое, но заметно больше текущего. Спросите класс: что изменится, если «20» написать в строку цели?" })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2; ikkinchi olam — mini-do'kon) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · asosiy natija', ru: 'Проверка · ключевой результат' })}
    questionText="Mini-do'kon: qaysi qatorda uchala bo'lak ham bor?"
    question={tr({ uz: <h2 className="title h-ask">Mini-do'kon: <A>qaysi qatorda</A> uchala bo'lak ham bor?</h2>, ru: <h2 className="title h-ask">Мини-магазин: <A>в какой строке</A> есть все три части?</h2> })}
    options={[
      { uz: "Oy oxirida buyurtmalar 30 ta bo'lsin", ru: "Пусть к концу месяца будет 30 заказов" },
      { uz: "Do'kon xaridorlarga qulayroq bo'lsin", ru: "Пусть магазин станет удобнее для покупателей" },
      { uz: 'Buyurtmalar hozir 12 ta, oy oxirida 30', ru: 'Заказов сейчас 12, к концу месяца 30' },
      { uz: "Hozir 12 ta buyurtma bor, ular ko'paysin", ru: 'Сейчас 12 заказов, пусть их станет больше' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Unda nima sanalishi, hozirgi raqam va oy oxiridagi raqam bor.', ru: 'В ней есть, что считается, текущее число и число к концу месяца.' }}
    explainWrong={{
      0: { uz: 'Oy oxiri bor, lekin hozir nechta ekani yozilmagan.', ru: 'Конец месяца есть, но не написано, сколько сейчас.' },
      1: { uz: "Bu yo'nalish — maqsadga o'xshaydi, unda raqam yo'q.", ru: "Это направление похоже на цель — в нём нет числа." },
      3: { uz: "Hozirgi raqam bor, oy oxirida qanchaga yetishi yo'q.", ru: 'Текущее число есть, а до скольки дойти к концу месяца — нет.' },
      default: { uz: 'Nima sanaladi, hozir, oy oxirida — qaysi gapda uchalasi?', ru: 'Что считается, сейчас, к концу месяца — в какой фразе все три?' }
    }} />
);

// ===== SCREEN 4 — ASOSIY NATIJA YOKI ISH (QTushuncha saralash: qatorlar bittadan katta karta bo'lib chiqadi, joyiga uchib boradi — SABOQ 9, 13) =====
const S4_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const S4_SAVOL = { uz: "Besh qatordan nechtasi asosiy natija bo'ladi?", ru: 'Сколько из пяти строк станут ключевыми результатами?' };
// QATORLAR — aralash tartibda, hammasi bir shaklda (nima · hozir → oy oxirida); manba — MAYDON_OKR
const QATORLAR = [
  { id: 'elon', ish: 0, joy: 'ish' },
  { id: 'foiz', natija: 1, joy: 'natija', qator: 2 },
  { id: 'rasm', ish: 1, joy: 'ish' },
  { id: 'ikki', natija: 2, joy: 'natija', qator: 3 },
  { id: 'talab', ish: 2, joy: 'ish' }
].map(q => ({ ...q, ...(q.joy === 'ish' ? MAYDON_OKR.ishlar[q.ish] : MAYDON_OKR.natijalar[q.natija]), id: q.id }));
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const achMiss = useContext(AchMissCtx);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [joylangan, setJoylangan] = useState(() => (storedAnswer ? QATORLAR.map(q => q.id) : []));
  const [kir, setKir] = useState(null);
  const [xato, setXato] = useState(0);
  const [supur, setSupur] = useState(0);
  const [yon, setYon] = useState(null);
  const xatoRef = useRef(false);
  const kartaRef = useRef(null);
  const done = joylangan.length >= QATORLAR.length;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  useXulosaSkroll(done, !!storedAnswer);
  const joriy = QATORLAR[joylangan.length];
  const bor = (id) => joylangan.includes(id);
  // Yangi qator kartasi chiqqanda — butunlay ko'rinadigan joyga (tugmalari pastda qolmasin)
  useEffect(() => {
    if (!taxmin || done) return undefined;
    const t = setTimeout(() => { const el = kartaRef.current; if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 380);
    return () => clearTimeout(t);
  }, [taxmin, joylangan.length, xato, done]);
  const joyla = (joy) => {
    if (!joriy || !taxmin) return;
    if (joy !== joriy.joy) { xatoRef.current = true; if (achMiss) achMiss.miss(screen); setXato(k => k + 1); return; }
    const rect = kartaRef.current ? kartaRef.current.getBoundingClientRect() : null;
    setXato(0); setKir(joriy.id); setJoylangan(j => [...j, joriy.id]);
    if (joy === 'ish') setSupur(k => k + 1);
    else setYon({ id: joriy.id, k: Date.now() });
    uchir(rect, `[data-uch="${joriy.id}"]`, tr(joriy.nima));
    if (joylangan.length + 1 >= QATORLAR.length) {
      const first = !xatoRef.current;
      onAnswer(screen, { stage: 'saralash', screenIdx: screen, correct: first, firstAttemptCorrect: first, solved: true, picked: true, taxmin });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'saralash', 0, true, 0);
    }
  };
  const natijaQatorlar = [maydonQator(0)];
  QATORLAR.filter(q => q.joy === 'natija' && bor(q.id)).forEach(q => natijaQatorlar.push({ i: q.qator, nima: tr(q.nima), hozir: q.hozir, oyOxirida: q.oyOxirida, uch: q.id, kir: kir === q.id }));
  natijaQatorlar.sort((a, b) => a.i - b.i);
  const ishlar = QATORLAR.filter(q => q.joy === 'ish' && bor(q.id)).map(q => ({ id: q.id, uch: q.id, kir: kir === q.id, nima: tr(q.nima), hozir: q.hozir, oyOxirida: q.oyOxirida }));
  const tx = S4_TAXMIN.find(t => t.k === taxmin);
  const vizual = (
    <OkrDoska tur={tugadi ? 'chap-kichik' : undefined}
      chap={<div className="okr-chap-col">
        <OkrUstunlar kichik bosh foiz={bor('foiz') ? '24%' : null} oraliqYon={!!(yon && yon.id === 'foiz')} qaytdi={bor('ikki')} supur={supur} yon={yon && yon.id === 'ikki' ? { id: 'band', k: yon.k } : null} />
        {taxmin && joriy && <div className="okr-sar-wrap" key={joriy.id}>
          <div ref={kartaRef} key={xato} className={cxx('okr-saralash', xato > 0 && 'silk')}>
            <span className="okr-saralash-n">{joylangan.length + 1}/5</span>
            <span className="okr-saralash-t">{tr(joriy.nima)}</span>
            <span className="okr-q-r"><span className="okr-chip">{tr(HOZIR)} <b>{joriy.hozir}</b></span><span className="okr-q-ch"><i /></span><span className="okr-chip">{tr(OY_OXIRIDA)} <b>{joriy.oyOxirida}</b></span></span>
            {xato > 0 && <QXato>{tr({ uz: 'Bu raqam qilgan ishingizni sanaydimi yoki natijani?', ru: 'Это число считает вашу работу или результат?' })}</QXato>}
            <div className="okr-saralash-a">
              <AchRule screen={screen} />
              <QTugma ikkinchi onClick={() => joyla('natija')}>{tr({ uz: 'OKR doskasiga', ru: 'На доску OKR' })}</QTugma>
              <QTugma ikkinchi onClick={() => joyla('ish')}>{tr({ uz: 'Qilinadigan ishlar', ru: "Список дел" })}</QTugma>
            </div>
          </div>
        </div>}
      </div>}
      ong={<OkrKarta sarlavha yorliq maqsad={tr(MAYDON_OKR.maqsad)} natijalar={natijaQatorlar} ishlar={ishlar} mehnat={done} ishlarYigil={tugadi} />} />
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · kim nima qildi', ru: 'Понятие · кто что сделал' })} screen={screen} scrollSignal={joylangan.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Qatorlarni joylang', ru: "Распределите строки" })} (${joylangan.length}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qaysi qator <A>mehnatni emas, natijani</A> sanaydi?</>, ru: <>Какая строка считает <A>результат, а не труд</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Keyingi oyga yana qatorlar yozildi, hammasida raqam bor. Har birini OKR doskasiga yoki «Qilinadigan ishlar» ro'yxatiga joylang.", ru: "На следующий месяц написали ещё строки, во всех есть числа. Распределите каждую: на доску OKR или в «Список дел»." })}</Mentor>}
        bashorat={!done && <Bashorat savol={S4_SAVOL} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={vizual}
        natija={done && <NatijaBlok>
          {tx && <QTaxmin togri={taxmin === '2'}>{taxmin === '2'
            ? tr({ uz: <>Taxminingiz to'g'ri chiqdi: <b>2</b>.</>, ru: <>Ваше предположение оказалось верным: <b>2</b>.</> })
            : <>{tr(TAXMIN_L)}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>2</b></>}</QTaxmin>}
        </NatijaBlok>}
        xulosa={done && tr({ uz: "Bu misolda asosiy natijalar o'yinchilar nima qilganini sanaydi. Siz qilgan ish soni — mehnat raqami.", ru: "В этом примере ключевые результаты считают, что сделали игроки. Количество вашей работы — число труда." })}
      >
        <MentorNote>{tr({ uz: "«Mehnat raqami» — «Raqamingiz nimani isbotlaydi?» darsidan: u jarayonni ko'rsatadi. Sinfdan so'rang: e'lonlar 4 ta bo'ldi, lekin hech kim band qilmadi — maqsadga yaqinlashdikmi? Mezon — «mehnatmi yoki natijami», «kim qildi» emas: boshqa mahsulotda asosiy natija sahifa xatolari kamayishi ham bo'lishi mumkin. 3-qatorning «hozir 0» si `bandlar` jadvalidagi telefon raqamlaridan sanaladi (Umami buni bermaydi). Ishlar kerak — ular asosiy natijani o'zgartirish uchun qilinadi (8-ekranga ko'prik, aytib bermang).", ru: "«Число труда» — из урока «Что доказывает ваше число?»: оно показывает процесс. Спросите класс: объявлений стало 4, но никто не забронировал — приблизились ли мы к цели? Критерий — «труд или результат», а не «кто сделал»: в другом продукте ключевым результатом может быть и уменьшение ошибок страницы. «Сейчас 0» в 3-й строке считается по номерам телефонов в таблице `bandlar` (Umami этого не даёт). Работа нужна — её делают, чтобы изменить ключевой результат (мостик к 8-му экрану, не рассказывайте)." })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s5 = 0) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · kim nima qildi', ru: 'Проверка · кто что сделал' })}
    questionText="Mini-do'konning keyingi oy OKR'iga qaysi qator asosiy natija?"
    question={tr({ uz: <h2 className="title h-ask">Mini-do'konning keyingi oy OKR'iga <A>qaysi qator</A> asosiy natija?</h2>, ru: <h2 className="title h-ask">Какая строка — <A>ключевой результат</A> для OKR мини-магазина на следующий месяц?</h2> })}
    options={[
      { uz: 'Buyurtma berganlar haftada 3 tadan 10 taga', ru: 'Сделавшие заказ за неделю: с 3 до 10' },
      { uz: 'Yozilgan mahsulot tavsiflari 5 tadan 20 taga', ru: 'Написанные описания товаров: с 5 до 20' },
      { uz: "Saytga qo'shilgan rasmlar 10 tadan 30 taga", ru: 'Добавленные на сайт фото: с 10 до 30' },
      { uz: "Do'stlarga yuborilgan havolalar 0 dan 15 taga", ru: 'Отправленные друзьям ссылки: с 0 до 15' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Buyurtmalar — maqsaddagi natija; qolgan qatorlar siz qiladigan ishni sanaydi.', ru: 'Заказы — результат из цели; остальные строки считают вашу работу.' }}
    explainWrong={{
      1: { uz: 'Tavsiflarni siz yozasiz — bu mehnat raqami.', ru: "Описания пишете вы — это число труда." },
      2: { uz: "Rasmlarni siz qo'shasiz — bu ham sizning ishingiz.", ru: 'Фото добавляете вы — это тоже ваша работа.' },
      3: { uz: 'Havolani siz yuborasiz — xaridor hali hech narsa qilmadi.', ru: 'Ссылку отправляете вы — покупатель ещё ничего не сделал.' },
      default: { uz: 'Mehnatni emas, natijani sanaydigan qatorni toping.', ru: "Найдите строку, которая считает результат, а не труд." }
    }} />
);

// ===== SCREEN 6 — FOIZ (QTushuncha: surgich 24…40 → «Band qildi» ustuni o'sadi, 2-qator chizig'i chiziladi) =====
const S6_TAXMIN = [{ k: '6', t: '6' }, { k: '8', t: '8' }, { k: '10', t: '10' }];
const S6_SAVOL = { uz: 'Vaqtni yana 25 kishi tanlasa, 40 foizda nechtasi band qiladi?', ru: 'Если время снова выберут 25 человек, сколько забронируют при 40 процентах?' };
const FOIZLAR = [24, 28, 32, 36, 40];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [foiz, setFoiz] = useState(storedAnswer ? 40 : 24);
  const [yetdi, setYetdi] = useState(!!storedAnswer);
  const tugadi = useTugadi(yetdi, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !yetdi, foiz);
  useXulosaSkroll(yetdi, !!storedAnswer);
  const band = Math.round(MAYDON_OKR.hafta.vaqtniTanladi * foiz / 100);
  const sur = (v) => { if (!taxmin) return; setFoiz(v); if (v >= 40 && !yetdi) { setYetdi(true); if (storedAnswer === undefined) { onAnswer(screen, { stage: 'foiz', screenIdx: screen, correct: true, picked: true, taxmin }); if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'foiz', 0, true, 0); } } };
  const tx = S6_TAXMIN.find(t => t.k === taxmin);
  const vizual = (
    <OkrDoska tur="chap-katta"
      chap={<OkrUstunlar keng bosh band={band} foiz={`${foiz}%`} oraliqYon={foiz > 24}
        tepa={<QIzoh>{tr({ uz: 'Bu mashqda har kishi har qadamda bir marta sanaladi.', ru: 'В этом упражнении каждый человек считается на каждом шаге один раз.' })}</QIzoh>}>
        {!tugadi && <div className={cxx('okr-surgich', !taxmin && 'yopiq')}>
          <span className="okr-surgich-l">{tr({ uz: 'Foiz', ru: 'Процент' })}</span>
          <span className="okr-surgich-y">
            <input type="range" min={24} max={40} step={4} value={foiz} disabled={!taxmin} onChange={e => sur(Number(e.target.value))} className={cxx(taxmin && foiz === 24 && 'okr-bos')} aria-label={tr({ uz: 'Foiz', ru: 'Процент' })} />
            <span className="okr-surgich-t">{FOIZLAR.map(v => <i key={v} className={v === foiz ? 'on' : undefined}>{v}</i>)}</span>
          </span>
        </div>}
        {ipucha && <span className="okr-ipucha fade-step">{tr({ uz: "Surgichni o'ngga suring — ustun qanday o'zgarishini ko'ring.", ru: 'Сдвиньте ползунок вправо — посмотрите, как изменится столбец.' })}</span>}
      </OkrUstunlar>}
      ong={<OkrKarta sarlavha yorliq natijalar={[maydonQator(0), maydonQator(1, { holat: 'joriy', chiziq: (foiz - 24) / 16 }), maydonQator(2)]} />} />
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · foiz', ru: 'Понятие · процент' })} screen={screen} scrollSignal={yetdi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!yetdi} label={yetdi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Foizni 40 gacha suring', ru: 'Сдвиньте процент до 40' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Foiz 24 dan 40 ga o'ssa, <A>nima o'zgaradi?</A></>, ru: <>Если процент вырастет с 24 до 40, <A>что изменится?</A></> })}
        mentor={<Mentor>{tr({ uz: "Bu darsdagi foiz — vaqtni tanlagan har 100 kishidan nechtasi band qilgani. Foizni o'ngga surib, «Band qildi» ustuniga qarang.", ru: 'Процент на этом уроке — сколько из каждых 100 выбравших время забронировали. Сдвигайте процент вправо и смотрите на столбец «Забронировали».' })}</Mentor>}
        bashorat={!yetdi && <Bashorat savol={S6_SAVOL} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={vizual}
        natija={yetdi && tx && <NatijaBlok>
          <QTaxmin togri={taxmin === '10'}>{taxmin === '10'
            ? tr({ uz: <>Taxminingiz to'g'ri chiqdi: <b>10</b>.</>, ru: <>Ваше предположение оказалось верным: <b>10</b>.</> })
            : <>{tr(TAXMIN_L)}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>10</b></>}</QTaxmin>
        </NatijaBlok>}
        xulosa={yetdi && tr({ uz: 'Bu misolda 25 kishidan 10 tasi band qilsa — 40 foiz, bosh raqam esa 6 dan 10 ga o\'sadi.', ru: "В этом примере: если из 25 человек забронируют 10 — это 40 процентов, а главное число вырастет с 6 до 10." })}
      >
        <MentorNote>{tr({ uz: "Sinfdan so'rang: foiz 40 bo'lganda haftada 20 band bo'lishi uchun vaqtni nechta kishi tanlashi kerak? (50.) Shuning uchun bitta asosiy natija yetmaydi — 1 va 2-qator birga.", ru: 'Спросите класс: сколько человек должны выбрать время, чтобы при 40 процентах было 20 броней в неделю? (50.) Поэтому одного ключевого результата мало — 1-я и 2-я строки вместе.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s7 = 3; faqat arifmetika) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · foiz', ru: 'Проверка · процент' })}
    questionText="20 kishi vaqt tanladi, 5 tasi band qildi. Foiz qancha?"
    question={tr({ uz: <h2 className="title h-ask">20 kishi vaqt tanladi, 5 tasi band qildi. <A>Foiz qancha?</A></h2>, ru: <h2 className="title h-ask">20 человек выбрали время, 5 забронировали. <A>Какой процент?</A></h2> })}
    options={[
      { uz: '5 foiz', ru: '5 процентов' },
      { uz: '15 foiz', ru: '15 процентов' },
      { uz: '4 foiz', ru: '4 процента' },
      { uz: '25 foiz', ru: '25 процентов' }
    ]} correctIdx={3}
    explainCorrect={{ uz: '20 kishidan 5 tasi — 100 kishidan 25 tasi degani.', ru: '5 из 20 человек — это 25 из 100.' }}
    explainWrong={{
      0: { uz: '5 — band qilganlar, foiz emas.', ru: '5 — это забронировавшие, а не процент.' },
      1: { uz: '15 — band qilmay ketganlar, foiz emas.', ru: '15 — ушедшие без брони, а не процент.' },
      2: { uz: "20 ni 5 ga bo'ldingiz — bo'lish teskari.", ru: 'Вы разделили 20 на 5 — деление наоборот.' },
      default: { uz: "Vaqt tanlagan 100 kishidan nechtasi band qilgan bo'lardi?", ru: 'Сколько из 100 выбравших время забронировали бы?' }
    }} />
);

// ===== SCREEN 8 — TAJRIBA (QTushuncha: o'zgarish bo'lagini bitta asosiy natijaga ulash — bosish yoki sudrash) =====
// Tugma maketi: «Band qilish» bir marta «18:00 ni band qilish» ga almashadi, keyin ikkalasi yonma-yon (reduced-motion — darhol yonma-yon)
const TugmaMaket = ({ yon }) => {
  const [f, setF] = useState(() => (kamHarakat() || yon ? 2 : 0));
  useEffect(() => { if (f >= 2) return undefined; const t = setTimeout(() => setF(x => x + 1), f === 0 ? 1300 : 1700); return () => clearTimeout(t); }, [f]);
  const A_ = { t: { uz: 'Band qilish', ru: 'Забронировать' }, y: HOZIR };
  const B_ = { t: { uz: '18:00 ni band qilish', ru: 'Забронировать 18:00' }, y: { uz: 'yangi', ru: 'новая' } };
  const tugma = (x, k) => <span className="okr-tm-b" key={k}><span className="okr-tm-tugma">{tr(x.t)}</span><i>{tr(x.y)}</i></span>;
  return (
    <div className={cxx('okr-tm', yon && 'yon')}>
      {f === 0 && tugma(A_, 'a0')}
      {f === 1 && tugma(B_, 'b1')}
      {f >= 2 && <>{tugma(A_, 'a')}{tugma(B_, 'b')}</>}
    </div>
  );
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const achMiss = useContext(AchMissCtx);
  const [ulangan, setUlangan] = useState(storedAnswer ? 2 : null);
  const [tanla, setTanla] = useState(false);
  const [izoh1, setIzoh1] = useState(0);
  const [xato, setXato] = useState(0);
  const xatoRef = useRef(false);
  const bolakRef = useRef(null);
  const done = ulangan === 2;
  const tugadi = useTugadi(done, 1400, !!storedAnswer);
  useXulosaSkroll(done, !!storedAnswer);
  const ula = (q) => {
    if (done) return;
    if (q === 2) {
      setUlangan(2); setXato(0); setIzoh1(0);
      const first = !xatoRef.current;
      onAnswer(screen, { stage: 'tajriba', screenIdx: screen, correct: first, firstAttemptCorrect: first, solved: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'tajriba', 0, true, 0);
    } else if (q === 1) { setXato(0); setIzoh1(k => k + 1); }
    else { xatoRef.current = true; if (achMiss) achMiss.miss(screen); setIzoh1(0); setXato(k => k + 1); }
  };
  // Sudrash: bo'lakni qator ustiga qo'yish (bosish ham ishlaydi)
  const down = (ev) => {
    if (done || (ev.button != null && ev.button !== 0)) return;
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    const mv = (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (!moved && Math.abs(dx) + Math.abs(dy) > 6) { moved = true; el.style.transition = 'none'; el.style.zIndex = '30'; } if (moved) el.style.transform = `translate(${dx}px,${dy}px) rotate(-1.5deg)`; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      el.style.transition = ''; el.style.transform = ''; el.style.zIndex = '';
      if (!moved) { setTanla(t => !t); return; }
      const hit = document.elementsFromPoint(e.clientX, e.clientY).map(x => x.closest && x.closest('[data-qator]')).find(Boolean);
      if (hit) ula(Number(hit.getAttribute('data-qator')));
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  const qatorlar = [0, 1, 2].map(i => maydonQator(i, { holat: !done ? ((tanla || izoh1 || xato) ? 'nishon faol' : 'nishon') : undefined, onClick: done ? undefined : () => ula(i + 1) }));
  const bolakMatn = tr(MAYDON_OKR.tajriba.nima);
  const vizual = (
    <OkrDoska tur="chap-kichik"
      chap={<OkrUstunlar kichik bosh oraliqYon={done}><TugmaMaket yon={done} /></OkrUstunlar>}
      ong={<OkrKarta sarlavha yorliq maqsad={tr(MAYDON_OKR.maqsad)} natijalar={qatorlar} ulangan={ulangan}
        tajriba={{ yorliq: done, holat: done ? 'tayyor' : 'kutadi', ichi: done
          ? <span className="okr-taj-t fade-step">{bolakMatn} <b>· {tr({ uz: '2-asosiy natijaga', ru: 'ко 2-му ключевому результату' })}</b></span>
          : <span ref={bolakRef} key={`${izoh1}-${xato}`} role="button" tabIndex={0} onPointerDown={down} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTanla(t => !t); } }}
              className={cxx('okr-bolak', tanla && 'tanlangan', izoh1 > 0 && 'qayt', xato > 0 && 'silk', !tanla && !izoh1 && !xato && 'okr-bos')}>{bolakMatn}</span> }} />} />
  );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · bitta o'zgarish", ru: 'Понятие · одно изменение' })} screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "O'zgarishni ulang", ru: "Привяжите изменение" })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Tugma matnini <A>qaysi raqam bilan</A> tekshirasiz?</>, ru: <>Каким <A>числом</A> вы проверите текст кнопки?</> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolida «Band qilish» tugmasida tanlangan soat yoziladi. Shu o'zgarishni eng bevosita tekshiradigan asosiy natijaga ulang.", ru: "В примере Ментора на кнопке «Забронировать» пишется выбранный час. Привяжите это изменение к ключевому результату, который проверяет его напрямую." })}</Mentor>}
        vizual={vizual}
        harakat={!done && <div className="okr-s8-alt">
          {izoh1 > 0 && <QIzoh>{tr({ uz: "Haftalik bandlar ham o'zgarishi mumkin. Lekin tugma vaqt tanlashdan band qilishga o'tishga bevosita tegadi — asosiy o'lchov uchun 2-qatorni oling.", ru: 'Брони за неделю тоже могут измениться. Но кнопка напрямую касается перехода от выбора времени к брони — для главного измерения возьмите 2-ю строку.' })}</QIzoh>}
          {xato > 0 && <QXato>{tr({ uz: 'Ikkinchi marta kelish keyin bo\'ladi — tugma qaysi qadamda?', ru: 'Второй приход бывает позже — на каком шаге кнопка?' })}</QXato>}
          <AchRule screen={screen} />
        </div>}
        natija={done && <NatijaBlok>
          <QIzoh>{tr({ uz: "Asosiy natijani o'zgartirish uchun sinab ko'riladigan bitta o'zgarish tajriba deyiladi. Yordam berdimi — buni raqam ko'rsatadi.", ru: 'Одно изменение, которое пробуют, чтобы изменить ключевой результат, называется экспериментом. Помогло ли — покажет число.' })}</QIzoh>
        </NatijaBlok>}
        xulosa={done && tr({ uz: "Tajriba bitta bo'lsa, raqam o'zgarganda nima yordam berganini ajratish osonroq.", ru: "Когда эксперимент один, легче понять, что помогло, если число изменилось." })}
      >
        <MentorNote>{tr({ uz: "«Nega bitta?» — o'tgan modulning tuzatish darsidagidek: bir nechtasi birga o'zgarsa, qaysi biri yordam berganini ajratish qiyin. Tajriba ishladimi — hozir aytmang: buni oy davomida raqam ko'rsatadi. Tugma — 9-Modul tuzatishidan keyin ekran pastiga qotirilgan o'sha tugma.", ru: '«Почему одно?» — как в уроке исправлений прошлого модуля: если меняется несколько вещей сразу, трудно понять, что помогло. Сработал ли эксперимент — сейчас не говорите: это покажет число в течение месяца. Кнопка — та самая, закреплённая внизу экрана после исправлений 9-го модуля.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 9 — MUSTAQIL ISH (QMustaqil: bir vaqtda bitta bosqich — forma chapda, o'quvchining OKR doskasi o'ngda; saqlanadi pm-m8d1-okr) =====
const KEY_OKR = 'pm-m8d1-okr';
const KEY_MUAMMO = 'pm-m7d3-muammo';
const OKR_BOSH = () => ({ maqsad: '', natijalar: [0, 1, 2].map(() => ({ nima: '', hozir: '', oyOxirida: '' })), tajriba: { nima: '', natija: null } });
// tayanch 9.8 (qat'iy): { maqsad, natijalar: [{ nima, hozir, oyOxirida }] × 3, tajriba: { nima, natija }, savedAt }
const okrOqi = () => {
  const v = lsGet(KEY_OKR);
  if (!v || typeof v !== 'object') return null;
  const s = (x) => (typeof x === 'string' ? x : '');
  return {
    maqsad: s(v.maqsad),
    natijalar: [0, 1, 2].map(i => { const r = (Array.isArray(v.natijalar) && v.natijalar[i]) || {}; return { nima: s(r.nima), hozir: s(r.hozir), oyOxirida: s(r.oyOxirida) }; }),
    tajriba: { nima: s(v.tajriba && v.tajriba.nima), natija: v.tajriba && [1, 2, 3].includes(v.tajriba.natija) ? v.tajriba.natija : null }
  };
};
const muammoOqi = () => { const o = lsGet(KEY_MUAMMO); return o && typeof o.nima === 'string' && o.nima.trim() ? o.nima.trim() : null; };
const bosqichTayyor = (o, k) => {
  if (k === 0) return !!o.maqsad.trim();
  if (k <= 3) { const q = o.natijalar[k - 1]; return !!(q.nima.trim() && q.hozir.trim() && q.oyOxirida.trim()); }
  return !!(o.tajriba.nima.trim() && o.tajriba.natija);
};
const okrSoni = (o) => [0, 1, 2, 3, 4].filter(k => bosqichTayyor(o, k)).length;
// Tekshiruv (PM-108; javob forma ostida, yozilgan zahoti — 106d). Natija: null — o'tdi, { tur, blok } — blok: true bloklaydi, false yo'naltiradi
const ISH_SOZ = /qo'sh|yoz|joyla|yubor|post|e'lon|rasm|добав|напис|размест|отправ|пост|объявлен|фото/; // ru rejimida o'quvchi ruscha yozadi
const sonOl = (s) => { const m = String(s || '').replace(/\s/g, '').replace(',', '.').match(/\d+(?:\.\d+)?/); return m ? Number(m[0]) : null; };
function okrTekshir(k, q) {
  if (k === 0) return /\d/.test(q.maqsad || '') ? { tur: 'maqsadRaqam', blok: true } : null;
  if (k === 4) return q.natija ? null : { tur: 'tajriba', blok: true };
  const hozir = String(q.hozir || '').trim();
  if (!hozir || (hozir !== '?' && sonOl(hozir) === null)) return { tur: 'hozir', blok: true };
  if (sonOl(q.oyOxirida) === null) return { tur: 'oyOxirida', blok: true };
  if (hozir !== '?' && sonOl(hozir) === sonOl(q.oyOxirida)) return { tur: 'teng', blok: false };
  if (ISH_SOZ.test(norm(q.nima))) return { tur: 'ish', blok: false };
  return null;
}
const XABAR9 = {
  maqsadRaqam: { uz: "Maqsadda raqam bo'lmaydi — uni asosiy natijaga o'tkazing.", ru: 'В цели не бывает чисел — перенесите число в ключевой результат.' },
  hozir: { uz: "Hozirgi raqamni yozing; bilmasangiz — «?» qo'ying.", ru: 'Напишите текущее число; если не знаете — поставьте «?».' },
  oyOxirida: { uz: "Oy oxirida qancha bo'lishini raqam bilan yozing.", ru: 'Напишите числом, сколько будет к концу месяца.' },
  teng: { uz: "Oy oxiridagi raqam hozirgidek — o'sish qayerda?", ru: "Число к концу месяца такое же, как сейчас, — где рост?" },
  ish: { uz: "Bu siz qiladigan ishga o'xshaydi — odamlar nima qiladi?", ru: 'Это похоже на вашу работу — что делают люди?' },
  tajriba: { uz: 'Tajriba qaysi asosiy natijaga ulanadi? Bittasini tanlang.', ru: "К какому ключевому результату привязан эксперимент? Выберите один." }
};
const QOLDIR9 = { uz: "Shunday qoldirsangiz — yana «Doskaga yozish»ni bosing.", ru: 'Если оставить так — нажмите «Записать на доску» ещё раз.' };
const BOSQICH9 = [
  { uz: 'Maqsad', ru: 'Цель' },
  { uz: '1-asosiy natija', ru: '1-й ключевой результат' },
  { uz: '2-asosiy natija', ru: '2-й ключевой результат' },
  { uz: '3-asosiy natija', ru: '3-й ключевой результат' },
  { uz: 'Tajriba', ru: 'Эксперимент' }
];
const DOSKAGA = { uz: 'Doskaga yozish', ru: 'Записать на доску' };
const YORDAM = { uz: 'Yordam', ru: 'Подсказка' };
const qoralamaOl = (o, k) => (k === 0 ? { maqsad: o.maqsad } : k <= 3 ? { ...o.natijalar[k - 1] } : { ...o.tajriba });
const birinchiBosh = (o, dan = 0) => { for (let k = dan; k < 5; k++) if (!bosqichTayyor(o, k)) return k; for (let k = 0; k < dan; k++) if (!bosqichTayyor(o, k)) return k; return 5; };

// Artefakt-strip «OKR'im» (U-042): 9-ekrandan; 10, 13, 14-ekranlarda ixcham
const OkrStrip = ({ jonli }) => {
  const o = jonli || okrOqi();
  const n = o ? okrSoni(o) : 0;
  if (!o || n === 0) return null;
  return (
    <div className="okr-strip fade-step">
      <span className="okr-strip-l">{tr({ uz: "OKR'im", ru: 'Мой OKR' })}</span>
      <span className="okr-strip-d" aria-hidden="true">{[0, 1, 2, 3, 4].map(k => <i key={k} className={bosqichTayyor(o, k) ? 'on' : undefined} />)}</span>
      {o.maqsad && <span className="okr-strip-t">{qisqa(o.maqsad, 48)}</span>}
      <b>{n}/5</b>
    </div>
  );
};

const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [okr, setOkr] = useState(() => okrOqi() || OKR_BOSH());
  const [bosqich, setBosqich] = useState(() => birinchiBosh(okrOqi() || OKR_BOSH()));
  const [q, setQ] = useState(() => { const o = okrOqi() || OKR_BOSH(); return qoralamaOl(o, birinchiBosh(o)); });
  const [xato, setXato] = useState(null);
  const [kir, setKir] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [muammo] = useState(() => muammoOqi());
  const [muammoQ, setMuammoQ] = useState(() => (storedAnswer && storedAnswer.muammo) || '');
  const done = bosqich >= 5;
  const yuborildi = useRef(!!storedAnswer);
  useXulosaSkroll(done, !!storedAnswer || okrSoni(okr) === 5);
  useEffect(() => {
    if (!done || yuborildi.current) return;
    yuborildi.current = true;
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, practice: 'okr', correct: true, picked: true, solved: true, muammo: muammoQ });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [done]); // eslint-disable-line
  const ochish = (k) => { setBosqich(k); setQ(qoralamaOl(okr, k)); setXato(null); setYordam(false); };
  const yoz = () => {
    if (done) return;
    const x = okrTekshir(bosqich, q);
    const imzo = JSON.stringify(q);
    if (x && (x.blok || !(xato && xato.tur === x.tur && xato.imzo === imzo))) { setXato({ ...x, imzo, k: Date.now() }); return; }
    const yangi = { maqsad: okr.maqsad, natijalar: okr.natijalar.map(r => ({ ...r })), tajriba: { ...okr.tajriba } };
    if (bosqich === 0) yangi.maqsad = q.maqsad.trim();
    else if (bosqich <= 3) yangi.natijalar[bosqich - 1] = { nima: q.nima.trim(), hozir: q.hozir.trim(), oyOxirida: q.oyOxirida.trim() };
    else yangi.tajriba = { nima: q.nima.trim(), natija: q.natija };
    setOkr(yangi); lsSet(KEY_OKR, { ...yangi, savedAt: Date.now() });
    setXato(null); setKir(`${bosqich}-${Date.now()}`); setYordam(false);
    const kel = birinchiBosh(yangi, bosqich + 1);
    setBosqich(kel); setQ(kel < 5 ? qoralamaOl(yangi, kel) : {});
  };
  const bosh = bosqich === 0 ? !String(q.maqsad || '').trim() : bosqich <= 3 ? !String(q.nima || '').trim() : !String(q.nima || '').trim();
  const qHolat = (k) => {
    if (!done && bosqich === k) return xato ? (xato.blok ? 'xato' : 'joriy') : 'joriy';
    return bosqichTayyor(okr, k) ? 'ok' : 'bosh';
  };
  const korsat = (k) => (!done && bosqich === k && xato ? (k === 0 ? { maqsad: q.maqsad } : k <= 3 ? q : { nima: q.nima, natija: q.natija }) : (k === 0 ? { maqsad: okr.maqsad } : k <= 3 ? okr.natijalar[k - 1] : okr.tajriba));
  const tahrir = (k) => done && !isMentor ? <QTugma ikkinchi className="okr-tahrir" onClick={() => ochish(k)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Изменить' })}>✎</QTugma> : null;
  const kirK = (k) => !!(kir && kir.startsWith(`${k}-`));
  // O'quvchining doskasi (mentor proyektorida — Mentor misoli)
  const doska = isMentor
    ? <OkrKarta sarlavha yorliq muammo={<><b>{tr({ uz: 'Muammo:', ru: 'Проблема:' })}</b> {tr(MAYDON_OKR.muammo)}</>} maqsad={tr(MAYDON_OKR.maqsad)} natijalar={[0, 1, 2].map(i => maydonQator(i))}
        ulangan={2} tajriba={{ yorliq: true, holat: 'tayyor', ichi: <span className="okr-taj-t">{tr(MAYDON_OKR.tajriba.nima)}</span> }} />
    : (() => {
        const m = korsat(0);
        const tj = !done && bosqich === 4 ? { nima: q.nima || '', natija: q.natija } : korsat(4);
        const ulangan = !done && bosqich === 4 ? q.natija : okr.tajriba.natija;
        return (
          <OkrKarta sarlavha yorliq
            muammo={muammo
              ? <><b>{tr({ uz: 'Muammo:', ru: 'Проблема:' })}</b> {muammo}</>
              : <label className="okr-muammo-q"><b>{tr({ uz: 'Muammo:', ru: 'Проблема:' })}</b><GrowInput value={muammoQ} onChange={e => setMuammoQ(e.target.value)} placeholder={tr({ uz: 'Loyihangiz muammosini bir gapda yozing', ru: 'Опишите проблему проекта одной фразой' })} maxLength={160} aria-label={tr({ uz: 'Loyihangiz muammosini bir gapda yozing', ru: 'Опишите проблему проекта одной фразой' })} /></label>}
            maqsad={{ t: m.maqsad ? qisqa(m.maqsad, 90) : null, bosh: '', holat: qHolat(0), kir: kirK(0), tahrir: tahrir(0) }}
            natijalar={[1, 2, 3].map(k => { const r = korsat(k); const yoz_ = !!(r.nima || '').trim(); return { i: k, nima: yoz_ ? qisqa(r.nima, 60) : null, bosh: '', hozir: yoz_ && r.hozir ? qisqa(r.hozir, 8) : null, oyOxirida: yoz_ && r.oyOxirida ? qisqa(r.oyOxirida, 8) : null, holat: qHolat(k), kir: kirK(k), tahrir: tahrir(k) }; })}
            ulangan={ulangan}
            tajriba={{ yorliq: true, holat: qHolat(4), ichi: (tj.nima || '').trim() ? <span className="okr-taj-t">{qisqa(tj.nima, 70)}{tj.natija ? <b> · {tr({ uz: `${tj.natija}-asosiy natijaga`, ru: `к ${tj.natija}-му ключевому результату` })}</b> : null}</span> : null, tahrir: tahrir(4) }} />
        );
      })();
  const maydon = (key, ph, extra = {}) => <GrowInput key={`${bosqich}-${key}`} value={q[key] || ''} onChange={e => setQ(v => ({ ...v, [key]: e.target.value }))} onEnter={yoz} placeholder={tr(ph)} aria-label={tr(ph)} maxLength={140} {...extra} />;
  const forma = !done && !isMentor && (
    <div className="okr-forma" key={bosqich}>
      <span className="okr-forma-s">{tr(BOSQICH9[bosqich])}</span>
      {bosqich === 0 && maydon('maqsad', { uz: 'Odamlar nima qilsin?', ru: 'Что должны делать люди?' })}
      {bosqich >= 1 && bosqich <= 3 && <>
        {maydon('nima', { uz: 'Nima sanaladi?', ru: 'Что считается?' })}
        <div className="okr-forma-ikki">
          {maydon('hozir', { uz: 'Hozir', ru: 'Сейчас' }, { maxLength: 12, className: 'son' })}
          <span className="okr-q-ch" aria-hidden="true"><i style={{ transform: 'scaleX(1)' }} /></span>
          {maydon('oyOxirida', { uz: 'Oy oxirida', ru: 'К концу месяца' }, { maxLength: 12, className: 'son' })}
        </div>
      </>}
      {bosqich === 4 && <>
        {maydon('nima', { uz: "Bitta o'zgarish", ru: 'Одно изменение' })}
        <span className="okr-forma-y">{tr({ uz: 'Qaysi asosiy natijaga?', ru: 'К какому ключевому результату?' })}</span>
        <div className="okr-forma-tanlov">
          {okr.natijalar.map((r, i) => <QChip key={i} holat={q.natija === i + 1 ? 'on' : undefined} onClick={() => setQ(v => ({ ...v, natija: i + 1 }))}><b>{i + 1}</b> {qisqa(r.nima, 38)}</QChip>)}
        </div>
      </>}
      {xato && <div className="okr-forma-x" key={xato.k}><QXato>{tr(XABAR9[xato.tur])}</QXato>{!xato.blok && <QIzoh>{tr(QOLDIR9)}</QIzoh>}</div>}
      <div className="okr-amal">
        <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
        <QTugma className={!bosh ? 'okr-bos' : undefined} disabled={bosh} onClick={yoz}>{tr(DOSKAGA)}</QTugma>
      </div>
      {yordam && <QIzoh>{tr({ uz: "Hozirgi raqamni bor manbadan oling: Umami (saytingizda odamlar nima qilganini yozib boradigan xizmat, o'tgan modulda ulangan) yoki Database. Hali sanay olmaydiganiga «?» qo'ying. Asosiy natija topilmasa — o'z uch qadamingizdan boshlang: odamlar oxirgi qadamga qancha yetdi?", ru: "Текущее число берите из того, что есть: Umami (сервис, который записывает, что люди делали на сайте, подключён в прошлом модуле) или Database. То, что пока не можете посчитать, отметьте «?». Если не находите ключевой результат — начните со своих трёх шагов: сколько людей дошли до последнего шага?" })}</QIzoh>}
      <p className="okr-doimiy">{tr({ uz: "Yo'q raqamni o'ylab topmaysiz: hozirgisini bilmasangiz, «?» qo'yasiz.", ru: 'Несуществующее число не придумываете: не знаете текущее — ставите «?».' })}</p>
    </div>
  );
  const strip = !isMentor && (
    <div className="okr-bosqichlar" aria-label={tr({ uz: "OKR'im", ru: 'Мой OKR' })}>
      <span className="okr-strip-l">{tr({ uz: "OKR'im", ru: 'Мой OKR' })}</span>
      {BOSQICH9.map((b, k) => { const t = bosqichTayyor(okr, k); const j = !done && bosqich === k; return <span key={k} className={cxx('okr-bq', j ? 'joriy' : t && 'ok')} title={tr(b)}>{t && !j ? '✓' : k + 1}</span>; })}
      <b className="okr-bq-n">{okrSoni(okr)}/5</b>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={bosqich} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Beshta qatorni yozing', ru: 'Напишите пять строк' })} (${okrSoni(okr)}/5)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Loyihangizga <A>keyingi oy OKR'ini</A> yozing.</>, ru: <>Напишите проекту <A>OKR на следующий месяц</A>.</> })}
        mentor={<Mentor>{tr({ uz: "Maqsadni muammo gapingizdan oling: muammo hal bo'lganda odamlar nima qiladi? Har qatorni yozib, «Doskaga yozish»ni bosing.", ru: "Цель берите из формулировки проблемы: что делают люди, когда проблема решена? Пишите каждую строку и нажимайте «Записать на доску»." })}</Mentor>}
        forma={<div className={cxx('okr-s9', (done || isMentor) && 'tayyor')}>
          {!done && !isMentor && <div className="okr-s9-chap">{strip}{forma}</div>}
          <div className={cxx('okr-s9-doska', done && 'q-fokus')}>{doska}</div>
        </div>}
      >
        {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        {done && !isMentor && <QXulosa>{tr({ uz: "OKR'ingiz va unga ulangan birinchi tajribangiz tayyor.", ru: "Ваш OKR и привязанный к нему первый эксперимент готовы." })}</QXulosa>}
        <MentorNote>{tr({ uz: "Juftlikda sherigining doskasini o'qisin: maqsadda raqam yo'qmi, har asosiy natijada uch bo'lak bormi, tajriba bitta qatorga ulanganmi. «?» qo'yilgan qatorlar — uyga vazifa ①. Jonli darsda bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: "В парах пусть читают доску соседа: нет ли чисел в цели, есть ли три части в каждом ключевом результате, привязан ли эксперимент к одной строке. Строки с «?» — домашнее задание ①. На живом уроке эту работу делают ученики, вы наблюдаете; «Продолжить» для вас открыто." })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — KOD YOZISH: BOSH RAQAM (QKod, Neon varianti: chapda vazifa, o'ngda Neon SQL Editor maketi; GATE M M-q0 A) =====
const S10_DARVOZA = [
  { id: 'kun', ok: false, x: { uz: "`kun` — o'yin kuni, band qilingan kun emas.", ru: '`kun` — день игры, а не день брони.' } },
  { id: 'soat', ok: false, x: { uz: "`soat` — vaqt katagi, unda sana yo'q.", ru: '`soat` — ячейка времени, в ней нет даты.' } },
  { id: 'yaratilgan', ok: true }
];
const S10_VAZIFA = [
  { uz: "Neon'da `maydon` loyihangizni oching va SQL Editor'ga o'ting.", ru: 'Откройте в Neon свой проект `maydon` и перейдите в SQL Editor.' },
  { uz: "Bo'sh joyni to'ldirib, SQL'ni o'zingiz yozing va «Run»ni bosing.", ru: 'Заполните пропуск, напишите SQL сами и нажмите «Run».' },
  { uz: "Neon ko'rsatgan sonni pastdagi maydonga yozing.", ru: 'Впишите число, которое показал Neon, в поле ниже.' }
];
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = 'muh\u0061rrir';
// Neon SQL Editor maketi (chizilgan, logotipsiz): SQL bo'sh joy bilan · «Run» · natija jadvali `count`
const NeonMaket = ({ ustun, ajrat, son }) => {
  const k = useSanoq(son == null ? null : son, 700);
  return (
    <div className="okr-neon">
      <div className="okr-neon-bar"><i /><i /><i /><span className="okr-neon-tab">SQL Editor</span><span className="okr-neon-run">▶ Run</span></div>
      <pre className="okr-neon-sql"><span className="kw">SELECT</span> COUNT(*){'\n'}<span className="kw">FROM</span> bandlar{'\n'}<span className="kw">WHERE</span> {ustun ? <b className={cxx('okr-neon-ustun', ajrat && 'ajrat')}>{ustun}</b> : <span className="okr-neon-joy">______</span>} {'>'}= NOW() - INTERVAL <span className="str">'7 days'</span>;</pre>
      <div className="okr-neon-jadval">
        <span className="okr-neon-th">count</span>
        <span className={cxx('okr-neon-td', son != null && 'bor')} key={son == null ? 'q' : 'n'}>{son == null ? '?' : k}</span>
      </div>
    </div>
  );
};
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'yaratilgan' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [son, setSon] = useState(() => (storedAnswer && storedAnswer.son != null ? String(storedAnswer.son) : ''));
  const [yordam, setYordam] = useState(false);
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2400); return () => clearTimeout(t); }, [ajrat]);
  useXulosaSkroll(done, !!storedAnswer);
  const sonT = son.trim();
  const sonOk = /^\d{1,7}$/.test(sonT);
  const pickGate = (g) => {
    if (gpick || isMentor) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); }
    else setMiss({ id: g.id, k: Date.now() });
  };
  const bajardim = () => {
    if (done || !gpick || !sonOk) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, son: Number(sonT), solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const qulf = !gpick ? tr({ uz: 'Avval ustun savolini yeching', ru: 'Сначала ответьте на вопрос о столбце' }) : !sonOk ? tr({ uz: "Avval Neon ko'rsatgan sonni yozing", ru: 'Сначала впишите число из Neon' }) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · Neon', ru: 'Пишем код · Neon' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bajardim — SQL ishladi, son yozildi', ru: 'Готово — SQL сработал, число записано' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Bosh raqamni Database'dan sanaydigan <A>SQL yozamiz</A>.</>, ru: <>Пишем <A>SQL</A>, который считает главное число в Database.</> })}
        mentor={<Mentor>{fmtCode(tr({ uz: "Doskadagi «haftada 6 band» o'ylab topilmagan — u «Maydon»ning `bandlar` jadvalidan sanalgan. Neon'dagi SQL Editor'da shu sonni o'zingiz oling.", ru: '«6 броней в неделю» на доске не придуманы — их посчитали по таблице `bandlar` в «Maydon». Получите это число сами в SQL Editor в Neon.' }))}</Mentor>}
        vazifa={<>
          <OkrStrip />
          <div className={cxx('okr-darvoza', !gpick && !isMentor && 'okr-bos')}>
            <span className="okr-darvoza-s">{tr({ uz: 'Haftada band qilingan vaqtlarni qaysi ustun bo\'yicha sanaymiz?', ru: "По какому столбцу считаем брони за неделю?" })}</span>
            <div className="okr-darvoza-t">
              {S10_DARVOZA.map(g => {
                const silk = miss && miss.id === g.id;
                return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : silk ? 'err' : undefined} disabled={!!gpick && gpick !== g.id} onClick={() => pickGate(g)}><span className="mono">{g.id}</span></QChip>;
              })}
            </div>
            {miss && <QXato>{fmtCode(tr(S10_DARVOZA.find(g => g.id === miss.id).x))}</QXato>}
          </div>
          <ol className="okr-vazifa">{S10_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          <label className={cxx('okr-son-m', !gpick && 'yopiq')}>
            <span>{tr({ uz: 'Oxirgi 7 kunda:', ru: 'За последние 7 дней:' })}</span>
            <input type="text" inputMode="numeric" value={son} disabled={!gpick || done || isMentor} onChange={e => setSon(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') bajardim(); }} placeholder={tr({ uz: "Neon ko'rsatgan son", ru: 'Число из Neon' })} aria-label={tr({ uz: 'Oxirgi 7 kunda', ru: 'За последние 7 дней' })} maxLength={8} className={cxx(gpick && !sonT && !done && 'okr-bos')} />
          </label>
          {sonT && !sonOk && <QXato>{tr({ uz: "Neon ko'rsatgan sonni shu yerga yozing.", ru: 'Впишите сюда число, которое показал Neon.' })}</QXato>}
        </>}
        yordam={<div className="okr-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (SQL darslaridan): `SELECT` — ma'lumotni ko'rsatadi · `WHERE` — qaysi qatorlar olinishi · `COUNT(*)` — qatorlarni sanaydi · `NOW() - INTERVAL '7 days'` — hozirdan 7 kun oldin.", ru: "Напоминание (из уроков SQL): `SELECT` — показывает данные · `WHERE` — какие строки берутся · `COUNT(*)` — считает строки · `NOW() - INTERVAL '7 days'` — 7 дней назад от текущего момента." }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: '`bandlar` jadvali — o\'tgan modulda «Maydon»ga qo\'shilgan jadval (namuna bandlar ham shu yerda).', ru: 'Таблица `bandlar` — таблица, добавленная в «Maydon» в прошлом модуле (там же примерные брони).' }))}</QIzoh>
          </>}
        </div>}
        bajardim={done
          ? <QXulosa>{tr({ uz: 'Bosh raqam Database\'dan olindi — u o\'ylab topilmaydi.', ru: 'Главное число взято из Database — его не придумывают.' })}</QXulosa>
          : <QTugma className={qulf ? undefined : 'okr-bos'} disabled={!!qulf || isMentor} onClick={bajardim}>{qulf || tr({ uz: 'Bajardim — SQL ishladi, son yozildi', ru: 'Готово — SQL сработал, число записано' })}</QTugma>}
        {...{ [QKOD_ONG]: <div className="okr-kod-ong">
          <NeonMaket ustun={gpick} ajrat={ajrat} son={sonOk ? Number(sonT) : null} />
          <QIzoh>{tr({ uz: "Sizning soningiz shu katakda chiqadi — u sizning Database'ingizdan. Mentor misolida — 6.", ru: 'Ваше число появится в этой ячейке — оно из вашей Database. В примере Ментора — 6.' })}</QIzoh>
          <div className={cxx('okr-bosh-s', sonOk && 'db')}>
            <span className="okr-bosh-s-l">{tr({ uz: 'Bosh raqam', ru: 'Главное число' })}</span>
            <span className="okr-bosh-s-t">{tr({ uz: 'Band qildi · haftada', ru: 'Забронировали · за неделю' })}</span>
            <b key={sonOk ? 'db' : 'm'}>{sonOk ? Number(sonT) : 6}</b>
            <span className="okr-bosh">{sonOk ? tr({ uz: "Database'dan", ru: 'из Database' }) : tr({ uz: 'Mentor misoli', ru: "Пример Ментора" })}</span>
          </div>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        <MentorNote>{fmtCode(tr({ uz: "Laptopdagi va Render'dagi Backend bitta Neon Database'ga yozadi — o'quvchining o'z tekshiruv bandlari va namuna bandlar ham sanaladi: son Mentornikidan farq qilishi tabiiy. Telefon raqamlarini ekranga chiqarmang: `SELECT *` emas — faqat son. `NOW()` Database vaqtida ishlaydi; 7 kunlik oraliq uchun Toshkent vaqti farqi sezilmaydi. O'z loyihasida boshqa jadval bo'lsa — uyda o'sha jadval nomi bilan (9-ekrandagi «Hozir» shu yerdan olinishi mumkin). Foiz hisobi 6-ekran surgichida — bu ekranda takrorlanmaydi.", ru: "Backend на ноутбуке и на Render пишет в одну Neon Database — считаются и проверочные брони ученика, и примерные: число может отличаться от числа Ментора, это нормально. Не выводите номера телефонов на экран: не `SELECT *` — только число. `NOW()` работает по времени Database; для 7 дней разница с Ташкентом незаметна. Если в своём проекте другая таблица — дома с её именем («Сейчас» на 9-м экране можно взять отсюда). Процент считали ползунком на 6-м экране — здесь не повторяем." }))}</MentorNote>
      </QKod>
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s11 = 1; tajriba bitta o'zgarish va u raqamning o'zi emas) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Ikkinchi marta band qilganlar uchun qaysi biri tajriba?"
    question={tr({ uz: <h2 className="title h-ask">Ikkinchi marta band qilganlar uchun <A>qaysi biri tajriba?</A></h2>, ru: <h2 className="title h-ask">Что из этого — <A>эксперимент</A> для забронировавших второй раз?</h2> })}
    options={[
      { uz: 'Ikkinchi marta band qilganlar 5 taga yetsin', ru: "Пусть забронировавших второй раз станет 5" },
      { uz: "O'yindan keyin o'yinchiga eslatma yuborish", ru: 'Отправлять игроку напоминание после игры' },
      { uz: "O'yinchilar «Maydon»ni yaxshi ko'rib qolsin", ru: 'Пусть игроки полюбят «Maydon»' },
      { uz: 'Saytning hamma sahifasini birdan yangilash', ru: 'Обновить все страницы сайта сразу' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Bu bitta o\'zgarish, u qaytib kelishni sanaydigan raqamga ulanadi.', ru: "Это одно изменение, его привязывают к числу, которое считает возвраты." }}
    explainWrong={{
      0: { uz: "Bu raqam — asosiy natija, o'zgarishning o'zi emas.", ru: 'Это число — ключевой результат, а не само изменение.' },
      2: { uz: "Bu yo'nalish, raqamsiz — maqsadga o'xshaydi.", ru: 'Это направление без числа — похоже на цель.' },
      3: { uz: "Hammasi birdan o'zgarsa, nima yordam bergani ajralmaydi.", ru: 'Если всё меняется сразу, не понять, что помогло.' },
      default: { uz: "Qaytib kelishni o'zgartiradigan bitta o'zgarishni toping.", ru: 'Найдите одно изменение, которое меняет возвраты.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — inglizcha nom, o'zbekcha tavsif (qilingan ishni aytadi, §184); tekin bonus yo'q (S-034) =====
const ACHIEVEMENTS = {
  resultFinder: { icon: '🔎', name: 'Result Finder!', desc: { uz: 'Besh qatordan asosiy natijalarni topdingiz', ru: 'Вы нашли ключевые результаты среди пяти строк' } },
  oneChange: { icon: '🔗', name: 'One Change!', desc: { uz: 'Tajribani u bevosita tegadigan asosiy natijaga uladingiz', ru: "Вы привязали эксперимент к ключевому результату, которого он касается напрямую" } },
  okrWriter: { icon: '✍️', name: 'OKR Writer!', desc: { uz: "Loyihangizga keyingi oy OKR'ini yozdingiz", ru: 'Вы написали OKR на следующий месяц для своего проекта' } },
  ownCount: { icon: '🧮', name: 'Own Count!', desc: { uz: "Bosh raqamni Database'dan o'zingiz sandingiz", ru: 'Вы сами посчитали главное число в Database' } }
};
// Ekran id → nishon: s4, s8 — birinchi urinishda xatosiz; s9 — 5/5; s10 — «Bajardim»
const ACH_TRIGGERS = { s4: 'resultFinder', s8: 'oneChange', s9: 'okrWriter', s10: 'ownCount' };

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


// Podium savol yorliqlari (kalit = SCORED_IDX: 3, 5, 7, 11)
const Q_LABELS = {
  3: { uz: "1 — Asosiy natija bo'laklari", ru: '1 — Части ключевого результата' },
  5: { uz: '2 — Kim qilgani sanaladi', ru: "2 — Чьё действие считается" },
  7: { uz: '3 — Foiz hisobi', ru: '3 — Расчёт процента' },
  11: { uz: '4 — Bitta tajriba', ru: '4 — Один эксперимент' }
};
const QUIZ_MS = 15000;
// Arena fon so'zlari — darsning o'z atamalari (R-008: {uz, ru}, emojisiz)
const QZ_BG_SHAPES = [
  { ch: 'OKR', l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'maqsad', ru: 'цель' }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'asosiy natija', ru: 'ключевой результат' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'tajriba', ru: 'эксперимент' }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'foiz', ru: 'процент' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'bosh raqam', ru: 'главное число' }, l: 60, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'hafta', ru: 'неделя' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'oy', ru: 'месяц' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'band', ru: 'бронь' }, l: 88, t: 44, s: 22, d: 22, dl: 0.6 },
  { ch: { uz: 'raqam', ru: 'число' }, l: 36, t: 58, s: 22, d: 24, dl: 1.4 }
];
// ⚡ Mustahkamlash-jang — 12 savol, to'g'ri javob: A — 1, 5, 9 · B — 2, 6, 10 · C — 3, 7, 11 · D — 4, 8, 12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: '«Maydon»da bosh raqam qaysi?', ru: 'Какое главное число у «Maydon»?' }, opts: [{ uz: 'Haftada band qilingan vaqtlar', ru: "Брони за неделю" }, { uz: 'Haftada saytni ochganlar soni', ru: 'Число открывших сайт за неделю' }, { uz: 'Haftada vaqt tanlaganlar soni', ru: 'Число выбравших время за неделю' }, { uz: "Haftada chatga yozilgan e'lonlar", ru: 'Объявления в чате за неделю' }], correct: 0 },
  { q: { uz: "Qaysi gap maqsad bo'la oladi?", ru: 'Какая фраза может быть целью?' }, opts: [{ uz: 'Har haftada 20 ta vaqt band qilinsin', ru: "Пусть каждую неделю будет 20 броней" }, { uz: "O'yinchilar maydonni oson band qilsin", ru: "Пусть игроки легко бронируют поле" }, { uz: "Tugmaga tanlangan soatni yozib qo'yish", ru: 'Написать на кнопке выбранный час' }, { uz: 'Band qilganlar foizi 40 ga yetib borsin', ru: 'Процент забронировавших пусть дойдёт до 40' }], correct: 1 },
  { q: { uz: '«Haftada band qilingan vaqtlar: hozir 6, oy oxirida 20» — bu nima?', ru: "«Брони за неделю: сейчас 6, к концу месяца 20» — что это?" }, opts: [{ uz: 'Maqsad qatori', ru: 'Строка цели' }, { uz: 'Tajriba qatori', ru: 'Строка эксперимента' }, { uz: 'Asosiy natija', ru: 'Ключевой результат' }, { uz: 'Mehnat raqami', ru: "Число труда" }], correct: 2 },
  { q: { uz: 'Hozirgi raqamni bilmasangiz, nima yozasiz?', ru: 'Что напишете, если не знаете текущее число?' }, opts: [{ uz: 'Oy oxiridagi raqamni', ru: 'Число к концу месяца' }, { uz: "O'ylab topilgan raqamni", ru: 'Придуманное число' }, { uz: 'Hozircha 0 raqamini', ru: "Пока что 0" }, { uz: "So'roq belgisini", ru: 'Вопросительный знак' }], correct: 3 },
  { q: { uz: 'Vaqtni 50 kishi tanladi, 20 tasi band qildi. Foiz qancha?', ru: 'Время выбрали 50 человек, 20 забронировали. Какой процент?' }, opts: [{ uz: '40 foiz', ru: '40 процентов' }, { uz: '20 foiz', ru: '20 процентов' }, { uz: '30 foiz', ru: '30 процентов' }, { uz: '250 foiz', ru: '250 процентов' }], correct: 0 },
  { q: { uz: '«Sayt uchun yozilgan yangi matnlar: 0 dan 5 ga» — qanday raqam?', ru: '«Новые тексты для сайта: с 0 до 5» — какое это число?' }, opts: [{ uz: 'Bosh raqam', ru: 'Главное число' }, { uz: 'Mehnat raqami', ru: "Число труда" }, { uz: 'Asosiy natija', ru: 'Ключевой результат' }, { uz: 'Qadam foizi', ru: 'Процент шага' }], correct: 1 },
  { q: { uz: "«Maydon» tajribasida nima o'zgaradi?", ru: 'Что меняется в эксперименте «Maydon»?' }, opts: [{ uz: 'Saytning ranglari va shrifti', ru: 'Цвета и шрифт сайта' }, { uz: 'Vaqt kataklarining soni', ru: 'Число ячеек времени' }, { uz: 'Band qilish tugmasi matni', ru: 'Текст кнопки бронирования' }, { uz: 'Ega sahifasidagi parol', ru: 'Пароль на странице владельца' }], correct: 2 },
  { q: { uz: "Tajriba nega bitta o'zgarish bo'ladi?", ru: 'Почему эксперимент — одно изменение?' }, opts: [{ uz: "Bitta o'zgarishni tezroq qilsa bo'ladi", ru: 'Одно изменение можно сделать быстрее' }, { uz: "Bitta o'zgarishni yozish qisqaroq", ru: 'Одно изменение короче записать' }, { uz: 'Doskada tajriba uchun bitta qator bor', ru: 'На доске одна строка для эксперимента' }, { uz: 'Yordam bergan narsa osonroq ajraladi', ru: 'Легче понять, что помогло' }], correct: 3 },
  { q: { uz: 'OKR qisqartmasi qaysi qismlarni bildiradi?', ru: 'Какие части означает сокращение OKR?' }, opts: [{ uz: 'Maqsad va asosiy natijalar', ru: 'Цель и ключевые результаты' }, { uz: 'Bosh raqam va qadam foizlari', ru: 'Главное число и проценты шагов' }, { uz: 'Muammo gapi va yechimlar', ru: "Формулировка проблемы и решения" }, { uz: 'Tajriba va qilinadigan ishlar', ru: 'Эксперимент и список дел' }], correct: 0 },
  { q: { uz: 'Sinfdosh maqsadiga «haftada 30 buyurtma» deb yozdi. Nima qilasiz?', ru: 'Одноклассник написал в цель «30 заказов в неделю». Что сделаете?' }, opts: [{ uz: "Shunday qoldirasiz, maqsad tayyor bo'ldi", ru: 'Оставите так, цель готова' }, { uz: "Raqamni asosiy natijaga o'tkazasiz", ru: 'Перенесёте число в ключевой результат' }, { uz: "Raqamni tajriba qatoriga ko'chirasiz", ru: 'Перенесёте число в строку эксперимента' }, { uz: "Yoniga yana bitta raqam qo'shasiz", ru: 'Добавите рядом ещё одно число' }], correct: 1 },
  { q: { uz: '«Ikkinchi marta band qilganlar» nimani ko\'rsatadi?', ru: 'Что показывают «забронировавшие второй раз»?' }, opts: [{ uz: 'Saytni nechta odam ochganini', ru: 'Сколько людей открыли сайт' }, { uz: 'Vaqt tanlaganlar foizini', ru: 'Процент выбравших время' }, { uz: "O'yinchilar qaytib kelganini", ru: 'Что игроки вернулись' }, { uz: 'Ega nechta vaqt ochganini', ru: "Сколько ячеек времени открыл владелец" }], correct: 2 },
  { q: { uz: 'Sinfdosh tajribasi bitta, lekin hech bir qatorga ulanmagan. Nima qilasiz?', ru: "У одноклассника один эксперимент, но он не привязан ни к одной строке. Что сделаете?" }, opts: [{ uz: "Yana ikkita tajriba yozib qo'yasiz", ru: 'Допишете ещё два эксперимента' }, { uz: "Tajribani maqsad qatoriga ko'chirasiz", ru: 'Перенесёте эксперимент в строку цели' }, { uz: "Tajribani doskadan o'chirib tashlaysiz", ru: 'Удалите эксперимент с доски' }, { uz: 'U tegadigan asosiy natijaga ulaysiz', ru: "Привяжете к ключевому результату, которого он касается" }], correct: 3 }
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
    // Arena tokenlari — shu darsning atamalari (QZ_BG_SHAPES dan; emojisiz, «Frontend/Backend» yo'q)
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

// 🃏 KARTOCHKALAR — qolipda: QKartochka (DE-204). Mentor yo'q (KORPUS §61, SABOQ 16); birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma.
const KARTOCHKALAR = [
  { front: { uz: "Bosh raqam nimani ko'rsatadi?", ru: 'Что показывает главное число?' }, back: { uz: "Mahsulot o'z ishini bajarganini; «Maydon»da — haftada band qilingan vaqtlar (inglizchasi North Star — «Qutb yulduzi»)", ru: "Что продукт делает свою работу; у «Maydon» — брони за неделю (по-английски North Star — «Полярная звезда»)" } },
  { front: { uz: 'Muammo gapidan maqsad qanday olinadi?', ru: "Как из формулировки проблемы получают цель?" }, back: { uz: "Muammo hal bo'lgan holat yoziladi: odamlar nima qiladi", ru: 'Пишут, что будет, когда проблема решена: что делают люди' } },
  { front: { uz: "Maqsadda raqam bo'ladimi?", ru: 'Бывает ли в цели число?' }, back: { uz: "Yo'q: maqsad — so'z bilan yozilgan yo'nalish, raqamsiz", ru: 'Нет: цель — направление словами, без чисел' } },
  { front: { uz: "Bu darsda asosiy natija qaysi uch bo'lak bilan yoziladi?", ru: 'Из каких трёх частей на этом уроке пишется ключевой результат?' }, back: { uz: 'Nima sanalishi, hozirgi raqam va oy oxiridagi raqam', ru: 'Что считается, текущее число и число к концу месяца' } },
  { front: { uz: "«Mahalla chatiga 4 ta e'lon» — asosiy natijami?", ru: '«4 объявления в чате махалли» — ключевой результат?' }, back: { uz: 'Yo\'q, bu mehnat raqami: u siz qilgan ishni sanaydi', ru: 'Нет, это число усилий: оно считает вашу работу' } },
  { front: { uz: '«Maydon» maqsadi qanday?', ru: 'Какая цель у «Maydon»?' }, back: { uz: "Mahalladagi o'yinchilar maydonni qo'ng'iroqsiz band qilsin", ru: "Пусть игроки из махалли бронируют поле без звонков" } },
  { front: { uz: 'Vaqtni 25 kishi tanlab, 6 tasi band qilsa, foiz qancha?', ru: 'Если время выбрали 25 человек и 6 забронировали, какой процент?' }, back: { uz: '24 foiz', ru: '24 процента' } },
  { front: { uz: 'Bu darsdagi foiz nimani sanaydi?', ru: 'Что считает процент на этом уроке?' }, back: { uz: 'Vaqtni tanlagan har 100 kishidan nechtasi band qilganini', ru: 'Сколько из каждых 100 выбравших время забронировали' } },
  { front: { uz: 'Tajriba nima?', ru: 'Что такое эксперимент?' }, back: { uz: "Asosiy natijani o'zgartirish uchun sinab ko'riladigan bitta o'zgarish", ru: 'Одно изменение, которое пробуют, чтобы изменить ключевой результат' } },
  { front: { uz: '«Maydon» tajribasi qaysi asosiy natija bilan tekshiriladi?', ru: 'Каким ключевым результатом проверяется эксперимент «Maydon»?' }, back: { uz: 'Vaqtni tanlaganlardan band qilganlar foizi bilan', ru: 'Процентом забронировавших среди выбравших время' } },
  { front: { uz: 'Bosh raqamni qayerdan olasiz?', ru: 'Откуда берёте главное число?' }, back: { uz: "Database'dan — bandlar jadvalini SQL bilan sanab", ru: "Из Database — посчитав таблицу bandlar через SQL" } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <OkrStrip />
        <div className={cxx('okr-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="okr-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: karta «kim uchun · nechta · muddat» + raqamli qadamlar; alohida .homework.jsx YO'Q — tayanch 4) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z loyihangiz", ru: 'ваш проект' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 OKR', ru: '1 OKR' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Umami yoki Database ko'rsatadigan «Hozir» raqamlarini o'sha joydan olib yozing.", ru: 'Числа «Сейчас», которые показывают Umami или Database, возьмите оттуда и запишите.' },
  { uz: "Ko'rsatmaydigan qatorda «?» qoldiring va yoniga yozing: uni sanash uchun qaysi harakat yozilishi kerak.", ru: 'В строке, которую они не показывают, оставьте «?» и напишите рядом: какое действие нужно записывать, чтобы её посчитать.' },
  { uz: "Maqsadingizni bir do'stingizga o'qib bering; tushunarsiz bo'lsa — qayta yozing.", ru: "Прочитайте свою цель другу; если непонятно — перепишите." }
];
const HwCard = ({ keyingi }) => (
  <div className="card okr-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="okr-hw-karta">
      {HW_KARTA.map((r, i) => <div key={i} className="okr-hw-q"><span className="okr-hw-k">{tr(r.k)}</span><span className="okr-hw-v">{tr(r.v)}</span></div>)}
    </div>
    <ol className="okr-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
    <p className="okr-hw-izoh">{tr({ uz: "Umami'da raqam 0 bo'lsa — 0 yozing: bu ham hozirgi holat.", ru: 'Если в Umami число 0 — пишите 0: это тоже текущее состояние.' })}</p>
    {keyingi && <span className="okr-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami, darsda =====
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
  // Birinchi qator — bugungi asosiy fikr (P-013, A-2 so'zma-so'z); qolganlari uni takrorlamaydi (T-048)
  const RECAP = [
    { uz: "Maqsad so'z bilan yoziladi, asosiy natija esa unga yetganingizni raqam bilan sanaydi.", ru: "Цель пишется словами, а ключевой результат числом считает, достигли ли вы её." },
    { uz: "Bu darsda asosiy natija uch bo'lak bilan yozildi: nima sanaladi, hozir nechta, oy oxirida nechta.", ru: 'На этом уроке ключевой результат писали из трёх частей: что считается, сколько сейчас, сколько к концу месяца.' },
    { uz: "Siz qilgan ish soni — mehnat raqami, u asosiy natija bo'lmaydi.", ru: "Количество вашей работы — число труда, оно не ключевой результат." },
    { uz: "Tajriba OKR ning qismi emas: bu bitta o'zgarish, uni bitta asosiy natija bilan tekshirasiz.", ru: 'Эксперимент — не часть OKR: это одно изменение, его проверяют одним ключевым результатом.' },
    { uz: "Hozirgi raqamni bilmasangiz, uni o'ylab topmaysiz — «?» qo'yasiz.", ru: 'Если не знаете текущее число, не придумываете его — ставите «?».' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Hodisalar tizimi: har harakat jadvalga yoziladi»</b>.</>, ru: <>Следующий урок — <b>«Система событий: каждое действие записывается в таблицу»</b>.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Loyihangizda endi <A>OKR va birinchi tajriba</A> bor.</>, ru: <>Теперь у проекта <A>OKR и первый эксперимент</A>.</> })}
        cta={<>
          <OkrStrip />
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
export default function PmOkrLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === OKR DOSKASI — darsning bitta vizuali. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .okr-doska { display: grid; grid-template-columns: minmax(0,0.85fr) minmax(0,1.15fr); gap: clamp(12px,2vw,22px); align-items: start; }
        .okr-doska.chap-kichik { grid-template-columns: minmax(0,0.62fr) minmax(0,1.38fr); }
        .okr-doska.chap-katta { grid-template-columns: minmax(0,1.05fr) minmax(0,0.95fr); }
        .okr-doska > * { min-width: 0; }
        .okr-chap-col { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        /* chap: o'tgan hafta ustunlari (har odam-belgisi — bitta kishi) */
        .okr-chap { --ow: 12px; --og: 3px; display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 14px 14px 12px; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.28); min-width: 0; }
        .okr-chap.kichik { --ow: 8px; --og: 2px; --on: 7; padding: 10px 10px 8px; gap: 8px; }
        .okr-chap.keng { --on: 8; }
        .okr-chap.keng .okr-oraliq { margin-bottom: 50px; }
        .okr-chap-s { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .okr-ustunlar { position: relative; display: flex; align-items: flex-end; justify-content: center; gap: 4px; }
        .okr-ustun { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; padding: 8px 8px 6px; border-radius: 12px; background: ${T.bg}; border: 1.5px solid transparent; font-family: 'Manrope', sans-serif; color: ${T.ink}; min-width: 0; transition: transform 0.35s cubic-bezier(.3,1.4,.5,1), background 0.25s, border-color 0.25s, box-shadow 0.25s; animation: okr-kir 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .okr-chap.kichik .okr-ustun { padding: 6px 5px 5px; gap: 4px; }
        button.okr-ustun { cursor: pointer; }
        button.okr-ustun:hover { border-color: ${fon(T.accent, 0.45)}; }
        .okr-ustun.on { background: ${T.accentSoft}; border-color: ${T.accent}; transform: translateY(-6px); box-shadow: 0 12px 22px -12px ${fon(T.accent, 0.55)}; }
        .okr-u-ust { min-height: 24px; display: flex; align-items: flex-end; justify-content: center; }
        .okr-chap.kichik .okr-u-ust { min-height: 20px; }
        .okr-oy-joy { font-size: 11px; font-weight: 800; color: ${T.accent}; border: 1.5px dashed ${T.accent}; border-radius: 8px; padding: 2px 7px; white-space: nowrap; background: ${T.paper}; animation: okr-pop 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .okr-qaytdi { font-size: 11px; font-weight: 800; line-height: 1.25; text-align: center; color: #fff; background: ${T.accent}; border-radius: 10px; padding: 2px 7px; max-width: 100%; animation: okr-pop 0.45s cubic-bezier(.3,1.4,.5,1) 0.45s both; }
        .okr-son { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 26px; line-height: 1; color: ${T.ink}; }
        .okr-chap.kichik .okr-son { font-size: 19px; }
        .okr-ustun.on .okr-son { color: ${T.accent}; }
        .okr-odamlar { display: flex; flex-wrap: wrap-reverse; justify-content: center; gap: var(--og); width: calc(var(--on, 5) * var(--ow) + (var(--on, 5) - 1) * var(--og)); color: ${fon(T.ink2, 0.42)}; transition: color 0.3s; }
        .okr-ustun.on .okr-odamlar { color: ${T.accent}; }
        .okr-odam { position: relative; display: block; width: var(--ow); height: calc(var(--ow) * 1.17); animation: okr-odam 0.3s cubic-bezier(.3,1.4,.5,1) both; animation-delay: calc(var(--k, 0) * 12ms + 0.25s); }
        .okr-odam::before { content: ''; position: absolute; top: 0; left: calc(var(--ow) * 0.25); width: calc(var(--ow) * 0.5); height: calc(var(--ow) * 0.5); border-radius: 50%; background: currentColor; }
        .okr-odam::after { content: ''; position: absolute; bottom: 0; left: 0; width: var(--ow); height: calc(var(--ow) * 0.58); border-radius: calc(var(--ow) * 0.5) calc(var(--ow) * 0.5) 2px 2px; background: currentColor; }
        .okr-odam.yangi { color: ${T.accent}; animation: okr-yangi 0.55s cubic-bezier(.3,1.4,.5,1) both; }
        .okr-odam.qayt { color: ${T.accent}; }
        .okr-odam.qayt::before { box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 3.5px ${T.accent}; }
        .okr-u-t { font-size: 12.5px; font-weight: 700; line-height: 1.25; text-align: center; color: ${T.ink}; min-height: 2.5em; display: flex; align-items: center; }
        .okr-chap.kichik .okr-u-t { font-size: 12px; }
        .okr-u-alt { min-height: 22px; display: flex; align-items: center; justify-content: center; }
        .okr-bosh { font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.line}; border-radius: 99px; padding: 3px 8px; white-space: nowrap; animation: okr-pop 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .okr-u-yon { position: absolute; inset: -2px; border-radius: 13px; box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 4px ${fon(T.accent, 0.18)}; background: ${fon(T.accent, 0.1)}; pointer-events: none; animation: okr-yon 1.3s ease-out both; }
        .okr-oraliq { align-self: flex-end; margin-bottom: 64px; display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 18px; color: ${fon(T.ink2, 0.6)}; font-size: 13px; transition: color 0.3s; }
        .okr-chap.kichik .okr-oraliq { margin-bottom: 52px; min-width: 14px; }
        .okr-oraliq i { font-style: normal; font-weight: 800; }
        .okr-oraliq.yon { color: ${T.accent}; }
        .okr-oraliq:has(.okr-foiz) { min-width: 40px; }
        .okr-oraliq.yon i { animation: okr-oq 1.2s ease-in-out 2; }
        .okr-foiz { font-size: 11.5px; font-weight: 800; color: #fff; background: ${T.accent}; border-radius: 99px; padding: 3px 7px; white-space: nowrap; animation: okr-pop 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .okr-supur-w { position: absolute; inset: 0; overflow: hidden; border-radius: 12px; pointer-events: none; z-index: 2; }
        .okr-supur { position: absolute; top: 0; bottom: 0; left: 0; width: 22%; background: linear-gradient(90deg, transparent, ${fon(T.ink2, 0.2)}, transparent); animation: okr-supur 0.9s ease-in-out both; }
        p.okr-chap-izoh { margin: 0; font-size: 12px; line-height: 1.4; color: ${T.ink2}; text-align: center; }
        /* o'ng: OKR doskasi */
        .okr-ong { position: relative; display: flex; flex-direction: column; gap: 8px; padding-right: 16px; min-width: 0; }
        .okr-karta { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 12px 14px 14px; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.28); }
        .okr-k-bosh { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; min-height: 28px; }
        .okr-k-s { font-size: 11.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; animation: okr-pop 0.4s ease-out both; }
        .okr-yorliq { display: block; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; margin-top: 1px; animation: fade-step 0.35s ease-out both; }
        .okr-muammo { font-size: 13px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 7px 11px; }
        .okr-muammo b { color: ${T.ink}; font-weight: 700; }
        label.okr-muammo-q { display: flex; flex-direction: column; gap: 4px; }
        .okr-q { position: relative; display: flex; align-items: center; gap: 10px; padding: 7px 11px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; min-width: 0; transition: border-color 0.25s, background 0.25s, box-shadow 0.25s; animation: okr-kir 0.4s ease-out both; }
        .okr-q.maqsad { background: ${T.bg}; border-color: transparent; }
        .okr-q.maqsad .okr-q-t { font-size: 15px; }
        .okr-q-n { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        .okr-q.ok .okr-q-n { color: #fff; background: ${T.ok}; animation: okr-pop 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .okr-q-b { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
        .okr-q-t { flex: 1 1 190px; min-width: 0; font-size: 14px; font-weight: 700; line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; animation: fade-step 0.35s ease-out both; }
        .okr-q-bosh { flex: 1 1 auto; min-height: 20px; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .okr-q-r { display: flex; align-items: center; gap: 6px; flex: 0 0 auto; }
        .okr-chip { font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 4px 8px; white-space: nowrap; animation: okr-pop 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .okr-chip b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; font-weight: 800; }
        .okr-q-ch { position: relative; display: block; width: 30px; height: 2px; border-radius: 2px; background: ${T.line}; overflow: hidden; flex-shrink: 0; }
        .okr-q-ch i { position: absolute; inset: 0; background: ${T.accent}; transform-origin: left center; transition: transform 0.6s cubic-bezier(.4,0,.2,1); animation: okr-chiz 0.7s cubic-bezier(.4,0,.2,1) 0.15s backwards; }
        .okr-q.bosh { border-style: dashed; background: transparent; animation: none; padding-block: 5px; }
        .okr-q.maqsad.bosh, .okr-q.maqsad.joriy:not(:has(.okr-q-t)) { min-height: 34px; }
        .okr-tajriba:not(:has(.okr-taj-t)):not(:has(.okr-bolak)) { min-height: 34px; }
        .okr-q.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.14)}; }
        .okr-q.xato { border-color: ${fon(T.err, 0.45)}; background: ${T.errFon}; }
        .okr-q.ok { border-color: ${fon(T.ok, 0.35)}; }
        .okr-q.maqsad.ok { border-color: transparent; }
        .okr-q.bosiladi, .okr-ustun.bosiladi { cursor: pointer; }
        .okr-q.nishon { cursor: pointer; }
        .okr-q.nishon:hover, .okr-q.nishon:focus-visible { border-color: ${T.accent}; outline: none; }
        .okr-q.nishon::after { content: ''; position: absolute; right: -6px; top: 50%; width: 10px; height: 10px; margin-top: -5px; border-radius: 50%; background: ${T.paper}; border: 2px dashed ${fon(T.accent, 0.6)}; }
        .okr-q.nishon.faol::after { border-style: solid; border-color: ${T.accent}; animation: okr-puls 1.4s ease-out 3; }
        .okr-q.ulangan { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .okr-q.ulangan::after { content: ''; position: absolute; right: -6px; top: 50%; width: 10px; height: 10px; margin-top: -5px; border-radius: 50%; background: ${T.accent}; }
        .okr-q.kir { animation: okr-qabul 1.5s ease-out both; }
        .okr-tajriba { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; min-height: 42px; padding: 7px 11px; border-radius: 12px; border: 1.5px dashed ${T.line}; background: transparent; min-width: 0; }
        .okr-tajriba .okr-yorliq { flex-basis: auto; flex-shrink: 0; margin: 0; }
        .okr-tajriba.ulangan, .okr-tajriba.tayyor { border-style: solid; border-color: ${T.accent}; background: ${T.paper}; }
        .okr-tajriba.joriy { border-style: solid; border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.14)}; }
        .okr-tajriba.xato { border-style: solid; border-color: ${fon(T.err, 0.45)}; background: ${T.errFon}; }
        .okr-tajriba.ok { border-style: solid; border-color: ${fon(T.ok, 0.35)}; background: ${T.paper}; }
        .okr-taj-t { flex: 1 1 auto; min-width: 0; font-size: 14px; font-weight: 700; color: ${T.ink}; overflow-wrap: anywhere; }
        .okr-taj-t b { color: ${T.accent}; font-weight: 800; }
        .okr-yol { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 3; }
        .okr-yol path { fill: none; stroke: ${T.accent}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: okr-yol 0.85s cubic-bezier(.4,0,.2,1) 0.1s forwards; }
        .okr-ishlar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .okr-ishlar > .okr-yorliq { flex-basis: 100%; margin: 0; }
        .okr-ishlar.yig { flex-wrap: nowrap; gap: 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 5px 12px; }
        .okr-ishlar.yig > .okr-yorliq { flex-basis: auto; flex-shrink: 0; }
        .okr-ishlar-q { flex: 1; min-width: 0; font-size: 12.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .okr-ishlar-n { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ok}; }
        .okr-ishlar.yig .okr-mehnat { flex-shrink: 0; }
        .okr-ish { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 6px 10px; min-width: 0; }
        .okr-ish b { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; white-space: nowrap; }
        .okr-ish.kir { animation: okr-qabul 1.5s ease-out both; }
        .okr-mehnat { font-size: 11.5px; font-weight: 800; color: #fff; background: ${T.ink2}; border-radius: 99px; padding: 4px 10px; animation: okr-pop 0.45s cubic-bezier(.3,1.4,.5,1) 0.4s both; }
        /* oy oxiri belgisi */
        .okr-oy { display: inline-flex; align-items: center; gap: 8px; margin-left: auto; }
        .okr-kal { width: 28px; height: 30px; border-radius: 6px; background: ${T.paper}; border: 1.5px solid ${T.line}; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
        .okr-kal-b { display: block; height: 6px; background: ${T.accent}; }
        .okr-kal-k { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; padding: 3px; }
        .okr-kal-k i { border-radius: 1px; background: ${T.line}; }
        .okr-kal-k i.oxir { background: ${T.accent}; }
        .okr-pufak { position: relative; font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 10px 10px 2px 10px; padding: 5px 10px; animation: okr-pop 0.35s cubic-bezier(.3,1.4,.5,1) both; }
        .okr-pufak.ok { width: 24px; height: 24px; padding: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; background: ${T.ok}; font-weight: 800; }
        /* skelet (reja ekrani): matnsiz chiziqlar birma-bir to'q bo'ladi */
        .okr-sk { display: block; height: 10px; border-radius: 6px; background: ${T.line}; transition: background 0.5s ease; }
        .okr-sk.on { background: ${fon(T.ink, 0.72)}; }
        .okr-tajriba .okr-sk { flex: 0 0 auto; }
        /* harakat: bo'lak tugmalari, saralash kartasi, ipucha */
        .okr-bolaklar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .okr-bolaklar .q-btn { align-self: center; }
        .okr-bolak-ok, .okr-bolak-kut { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; border-radius: 10px; padding: 7px 10px; }
        .okr-bolaklar .q-btn { padding: 8px 13px; font-size: 13px; }
        .okr-bolak-ok { color: ${T.ok}; background: ${T.okFon}; }
        .okr-bolak-ok i, .okr-bolak-kut i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; }
        .okr-bolak-kut { color: ${T.ink2}; background: ${T.bg}; }
        .okr-bos { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: okr-puls 1.6s ease-out 0.5s 3; }
        .okr-ipucha { font-size: 13px; font-weight: 700; color: ${T.accent}; flex-basis: 100%; }
        .okr-sar-wrap { display: flex; flex-direction: column; gap: 8px; }
        .okr-saralash { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.1)}, 0 14px 30px -18px rgba(${T.shadowBase},0.35); animation: okr-kel 0.45s cubic-bezier(.2,.9,.3,1.2) both; }
        .okr-saralash.silk { animation: q-silk 0.32s ease-in-out; }
        .okr-saralash-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .okr-saralash-t { font-size: clamp(15px,1.7vw,17px); font-weight: 800; line-height: 1.3; color: ${T.ink}; }
        .okr-saralash .okr-q-r { flex-wrap: wrap; }
        .okr-saralash-a { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px; }
        .okr-saralash-a .ach-rule { flex: 1 1 100%; }
        .okr-saralash-a .q-btn { align-self: auto; }
        .okr-s8-alt { display: flex; flex-direction: column; gap: 6px; }
        /* foiz surgichi */
        .okr-surgich { display: flex; align-items: center; gap: 12px; padding: 8px 4px 0; border-top: 1px dashed ${T.line}; }
        .okr-surgich.yopiq { opacity: 0.45; }
        .okr-surgich-l { font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .okr-surgich-y { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .okr-surgich-y input { width: 100%; accent-color: ${T.accent}; cursor: pointer; height: 22px; margin: 0; border-radius: 99px; }
        .okr-surgich-y input:disabled { cursor: not-allowed; }
        .okr-surgich-t { display: flex; justify-content: space-between; padding: 0 2px; }
        .okr-surgich-t i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .okr-surgich-t i.on { color: ${T.accent}; font-weight: 800; }
        /* tugma maketi (tajriba ekrani) */
        .okr-tm { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px 6px 4px; border-top: 1px dashed ${T.line}; transition: box-shadow 0.3s; border-radius: 0 0 10px 10px; }
        .okr-tm.yon { box-shadow: inset 0 0 0 2px ${fon(T.accent, 0.5)}; background: ${fon(T.accent, 0.06)}; }
        .okr-tm-b { display: flex; flex-direction: column; align-items: center; gap: 4px; animation: okr-flip 0.45s ease-out both; }
        .okr-tm-tugma { font-size: 12px; font-weight: 800; color: #fff; background: ${T.ink}; border-radius: 9px; padding: 7px 12px; white-space: nowrap; box-shadow: 0 6px 12px -8px rgba(${T.shadowBase},0.6); }
        .okr-tm-b i { font-style: normal; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .okr-bolak { display: inline-flex; align-items: center; font-size: 14px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 11px; padding: 8px 12px; cursor: grab; touch-action: none; user-select: none; position: relative; transition: transform 0.2s; }
        .okr-bolak.tanlangan { transform: translateY(-3px); box-shadow: 0 10px 18px -10px ${fon(T.accent, 0.7)}; }
        .okr-bolak.qayt { animation: okr-qayt 0.9s ease-in-out; }
        .okr-bolak.silk { animation: q-silk 0.32s ease-in-out 2; }
        .screen.q-tushuncha { gap: 14px; }
        /* natija bloki: taxmin qatori + izoh — yashil xulosa bilan bitta blok (SABOQ 25) */
        .okr-nb { display: flex; flex-direction: column; gap: 6px; background: ${T.okFon}; border-radius: 12px 12px 0 0; padding: 12px clamp(14px,2.5vw,20px) 2px; gap: 4px; margin-bottom: -14px; animation: fade-step 0.3s ease-out both; }
        .okr-nb + .q-xulosa { border-radius: 0 0 12px 12px; padding-top: 8px; font-weight: 700; }
        .q-ekran > .okr-nb:last-child { border-radius: 12px; margin-bottom: 0; padding-bottom: 12px; }
        /* bashorat: kirishda ko'tariladi, variantlar navbat bilan; tanlangach ixcham qatorga yig'iladi */
        .okr-bash { animation: okr-kot 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .okr-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 6px 16px; padding: 10px 14px; }
        .okr-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        .okr-bash .q-variantlar { display: flex; gap: 8px; }
        .okr-bash .q-chip { min-width: 44px; text-align: center; }
        .okr-bash .q-chip { animation: okr-pop 0.32s cubic-bezier(.3,1.4,.5,1) both; }
        .okr-bash .q-chip:nth-child(1) { animation-delay: 0.22s; } .okr-bash .q-chip:nth-child(2) { animation-delay: 0.32s; } .okr-bash .q-chip:nth-child(3) { animation-delay: 0.42s; }
        .okr-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; transform-origin: top center; animation: okr-yigil 0.35s ease-out both; }
        .okr-taxmin-l { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        .okr-taxmin-s { font-size: 13.5px; color: ${T.ink2}; }
        .okr-taxmin-j { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        /* hook — jonli ovozlar */
        .okr-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .okr-ovoz-q { display: grid; grid-template-columns: minmax(0,1.3fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .okr-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .okr-ovoz-yol { height: 8px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .okr-ovoz-yol i { display: block; height: 100%; background: ${T.accent}; transition: width 0.5s ease; }
        .okr-ovoz-t { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .okr-ovoz-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; text-align: right; }
        /* mustaqil ish: forma chapda, o'quvchining doskasi o'ngda; tugagach doska butun enga */
        .q-mustaqil:has(> .okr-s9) { max-width: none; }
        .okr-s9 { display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: clamp(14px,2.2vw,24px); align-items: start; }
        .okr-s9.tayyor { grid-template-columns: minmax(0,1fr); max-width: 780px; width: 100%; margin: 0 auto; }
        .okr-s9-chap { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .okr-s9-doska { min-width: 0; }
        .okr-forma { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 0 0 4px ${fon(T.accent, 0.08)}, 0 12px 26px -18px rgba(${T.shadowBase},0.3); animation: okr-kel 0.4s cubic-bezier(.2,.9,.3,1.15) both; }
        .okr-forma-s { font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .okr-forma-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .okr-forma-ikki { display: grid; grid-template-columns: minmax(0,1fr) 30px minmax(0,1fr); align-items: center; gap: 8px; }
        .okr-forma-tanlov { display: flex; flex-direction: column; gap: 6px; }
        .okr-forma-tanlov .q-chip b { font-family: 'JetBrains Mono', monospace; color: ${T.accent}; margin-right: 4px; }
        .okr-forma-x { display: flex; flex-direction: column; gap: 4px; }
        .okr-amal { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
        .okr-amal .q-btn { align-self: auto; }
        p.okr-doimiy { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        textarea.okr-kirit { width: 100%; resize: none; font-family: 'Manrope', sans-serif; font-size: 14.5px; font-weight: 600; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; outline: none; transition: border-color 0.2s, background 0.2s; overflow: hidden; }
        textarea.okr-kirit:focus { border-color: ${T.accent}; background: ${T.paper}; }
        textarea.okr-kirit::placeholder { color: ${fon(T.ink2, 0.7)}; font-weight: 500; }
        textarea.okr-kirit.son { font-family: 'JetBrains Mono', monospace; text-align: center; }
        .okr-muammo-q textarea.okr-kirit { font-size: 13px; padding: 6px 10px; background: ${T.paper}; }
        label.okr-muammo-q { flex-direction: row; align-items: center; gap: 8px; }
        label.okr-muammo-q > b { flex-shrink: 0; }
        .q-btn.okr-tahrir { align-self: center; flex-shrink: 0; padding: 4px 9px; font-size: 13px; line-height: 1; }
        .okr-bosqichlar, .okr-strip { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; align-self: flex-start; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 99px; padding: 6px 12px; min-width: 0; max-width: 100%; }
        .okr-strip-l { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        .okr-bq { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border: 1.5px solid ${T.line}; transition: all 0.25s; }
        .okr-bq.joriy { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }
        .okr-bq.ok { color: #fff; background: ${T.ok}; border-color: ${T.ok}; animation: okr-pop 0.35s cubic-bezier(.3,1.5,.5,1) both; }
        .okr-bq-n, .okr-strip > b { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .okr-strip-d { display: inline-flex; gap: 3px; }
        .okr-strip-d i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .okr-strip-d i.on { background: ${T.ok}; }
        .okr-strip-t { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 340px; }
        /* kod ekrani: darvoza, vazifa, son maydoni, Neon maketi */
        .okr-darvoza { display: flex; flex-direction: column; gap: 8px; border-radius: 12px; padding: 10px 12px; margin: -4px -4px 0; background: ${T.bg}; }
        .okr-darvoza-s { font-size: 14px; font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .okr-darvoza-t { display: flex; flex-wrap: wrap; gap: 8px; }
        .okr-darvoza-t .q-chip { font-size: 13.5px; }
        ol.okr-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        ol.okr-vazifa li { display: flex; align-items: flex-start; gap: 9px; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        ol.okr-vazifa li i, ol.okr-hw-qadam li i { font-style: normal; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        label.okr-son-m { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 14px; font-weight: 700; color: ${T.ink}; }
        label.okr-son-m.yopiq { opacity: 0.5; }
        label.okr-son-m input { width: 190px; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 12px; outline: none; }
        label.okr-son-m input:focus { border-color: ${T.accent}; background: ${T.paper}; }
        label.okr-son-m input::placeholder { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 500; color: ${fon(T.ink2, 0.7)}; }
        .okr-yordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .okr-yordam .q-btn { align-self: flex-start; }
        .okr-kod-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .okr-neon { border-radius: 14px; overflow: hidden; border: 1px solid ${T.line}; background: ${CODE.bg}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.5); animation: okr-kir 0.45s ease-out both; }
        .okr-neon-bar { display: flex; align-items: center; gap: 6px; padding: 8px 10px; background: rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .okr-neon-bar > i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.22); }
        .okr-neon-tab { margin-left: 6px; font-size: 12px; font-weight: 700; color: ${CODE.text}; background: rgba(255,255,255,0.08); border-radius: 6px; padding: 3px 9px; }
        .okr-neon-run { margin-left: auto; font-size: 12px; font-weight: 800; color: ${CODE.bg}; background: ${CODE.str}; border-radius: 6px; padding: 4px 10px; }
        pre.okr-neon-sql { margin: 0; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-variant-ligatures: none; font-size: 13.5px; line-height: 1.7; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; }
        .okr-neon-sql .kw { color: ${CODE.punct}; font-weight: 700; }
        .okr-neon-sql .str { color: ${CODE.str}; }
        .okr-neon-joy { color: ${CODE.attr}; letter-spacing: 1px; }
        .okr-neon-ustun { color: ${CODE.attr}; font-weight: 800; border-radius: 4px; padding: 0 2px; }
        .okr-neon-ustun.ajrat { animation: okr-ajrat 2.4s ease-out both; }
        .okr-neon-jadval { display: grid; grid-template-columns: max-content; margin: 0 16px 16px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); }
        .okr-neon-th, .okr-neon-td { font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 6px 22px; text-align: center; }
        .okr-neon-th { color: ${CODE.comment}; background: rgba(255,255,255,0.06); font-weight: 700; }
        .okr-neon-td { color: ${CODE.comment}; font-weight: 800; font-size: 16px; }
        .okr-neon-td.bor { color: ${CODE.str}; animation: okr-pop 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .okr-bosh-s { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; transition: border-color 0.3s, background 0.3s; }
        .okr-bosh-s.db { border-color: ${fon(T.ok, 0.4)}; background: ${T.okFon}; }
        .okr-bosh-s-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .okr-bosh-s-t { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .okr-bosh-s > b { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; animation: okr-pop 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        /* kartochkalar: birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma (SABOQ 16) */
        .okr-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: okr-fc-halqa 1.6s ease-out 3; }
        @keyframes okr-fc-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        p.okr-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .okr-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: okr-nuqta 1.4s ease-in-out 3; }
        /* uyga vazifa (PM HwCard) */
        .okr-hw { display: flex; flex-direction: column; gap: 12px; }
        .okr-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .okr-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .okr-hw-k { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .okr-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        ol.okr-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.okr-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        p.okr-hw-izoh { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .okr-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        /* mentor eslatmasi, nishon sharti */
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ach-rule { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .ach-rule.lost { color: ${fon(T.ink2, 0.75)}; }
        /* uchib boradigan arvoh-nusxa (body ichida) */
        .okr-arvoh { position: fixed; z-index: 3000; pointer-events: none; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 16px 30px -14px ${fon(T.accent, 0.6)}; transform-origin: center; }
        @keyframes okr-kir { from { opacity: 0; transform: translateY(10px); } }
        @keyframes okr-odam { from { opacity: 0; transform: scale(0.3); } }
        @keyframes okr-yangi { 0% { opacity: 0; transform: translateY(-14px) scale(0.4); } 60% { opacity: 1; transform: scale(1.25); } 100% { transform: none; } }
        @keyframes okr-pop { 0% { opacity: 0; transform: scale(0.6); } 70% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: none; } }
        @keyframes okr-yon { 0% { opacity: 0; } 25% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes okr-oq { 0%, 100% { transform: none; } 50% { transform: translateX(4px); } }
        @keyframes okr-supur { from { transform: translateX(-110%); } to { transform: translateX(480%); } }
        @keyframes okr-chiz { from { transform: scaleX(0); } }
        @keyframes okr-qabul { 0%, 32% { opacity: 0; transform: translateY(6px); } 44% { opacity: 1; transform: none; background: ${T.okFon}; border-color: ${T.ok}; } 100% { opacity: 1; } }
        @keyframes okr-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70%, 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        @keyframes okr-kel { from { opacity: 0; transform: translateY(14px) scale(0.97); } }
        @keyframes okr-kot { from { opacity: 0; transform: translateY(12px); } }
        @keyframes okr-yigil { from { opacity: 0.2; transform: scaleY(1.5); } }
        @keyframes okr-qayt { 0%, 100% { transform: none; } 45% { transform: translateY(-22px); } }
        @keyframes okr-flip { from { opacity: 0; transform: rotateX(80deg); } }
        @keyframes okr-yol { to { stroke-dashoffset: 0; } }
        @keyframes okr-ajrat { 0%, 70% { background: ${fon(T.accent, 0.45)}; color: #fff; } 100% { background: transparent; } }
        @keyframes okr-nuqta { 50% { transform: scale(1.6); opacity: 0.4; } }
        @media (max-width: 760px) {
          .okr-doska, .okr-doska.chap-kichik, .okr-doska.chap-katta, .okr-s9 { grid-template-columns: minmax(0,1fr); }
          .okr-s9 > .okr-s9-doska { order: -1; }
          .okr-hw-karta { grid-template-columns: minmax(0,1fr); }
          .okr-oraliq { margin-bottom: 58px; }
          .okr-chap.keng { --on: 5; --ow: 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="okr-"], [class*="okr-"]::before, [class*="okr-"]::after { animation: none !important; transition: none !important; }
          .okr-yol path { stroke-dashoffset: 0; }
          .okr-u-yon, .okr-supur-w { display: none; }
          .okr-bos { animation: none !important; }
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
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda yo'q edi — ⛶ ishlamasdi (11-Modul seansi, F-1007-290; MEXANIZM-TAKLIF 10) */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; } /* qolip .q-fokus (fill both) transform qoldiradi — yakuniy holatda ⛶ oynasi siljiydi (F-1007-290; MEXANIZM-TAKLIF 12) */
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
