import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul 8-dars «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?» (PM + amaliyot, m10-08, keys K6 Netflix) — skeletdan (konveyer, 04.10.2026); MD v3: feedback/F-1006-12modul/08-PmDropOff-v3.md + 08-FILTR.md
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun, QVoqea, QMustaqil, QQadamlar, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m10d8-v1', lessonTitle: { uz: "Foydalanuvchilar qaysi qadamda to'xtab qolyapti?", ru: "На каком шаге пользователи останавливаются?" } };
// 12 ekran (MD v3, tayanch 4 «PM+PRAKT»; 8-darsda Amaliyot 1 mustaqil ishdan oldin): kirish → reja → qadamlar va foiz → 1-savol → Amaliyot 1 → Netflix → o'z sonlaringiz → Amaliyot 2 → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'qadamlar', ru: 'шаги' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'foiz', ru: 'процент' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'gipoteza', ru: 'гипотеза' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'yangi versiya', ru: 'новая версия' }, l: 74, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Yangi dars — ✔ o'rni MD dagidek: s3 C · s8 A (yakuniy). Bloklar ballsiz — signal PRACTICE_BASE + ekran.
const INLINE_KEYS = { s3: 2, s8: 0 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: "To'xtab qolish qadami", ru: 'Шаг остановки' },
    cards: [
      { ic: '1', h: { uz: 'Har oraliqda keyingi qadamdagi son oldingisining necha foizi ekanini toping.', ru: 'В каждом промежутке найдите, сколько процентов число на следующем шаге составляет от предыдущего.' } },
      { ic: '2', h: { uz: "Foizi past oraliq — to'xtab qolish qadami; bu darsda eng past ikkitasi olinadi.", ru: 'Промежуток с низким процентом — шаг остановки; на этом уроке берут два самых низких.' } },
      { ic: '3', h: { uz: "Eng kichik son shart emas: Mentor misolida 12 dan 9 tasi o'tgan — 75 foiz.", ru: 'Самое маленькое число — не обязательно: в примере Ментора перешли 9 из 12 — 75 процентов.' }, ask: { uz: "Oxirgi qadamda son eng kichik bo'lsa, u to'xtab qolish qadamimi?", ru: 'Если на последнем шаге число самое маленькое, это шаг остановки?' } }
    ]
  },
  8: {
    title: { uz: 'Gipoteza va sonlar', ru: 'Гипотеза и числа' },
    cards: [
      { ic: '1', h: { uz: "«Tuzatildi» — ish fakti: tuzatish qilindi va o'zingiz tekshirdingiz.", ru: '«Исправлено» — факт работы: исправление сделано, и вы сами проверили.' } },
      { ic: '2', h: { uz: "Gipoteza to'g'rimi — keyingi kunlardagi sonlar ko'rsatadi.", ru: 'Верна ли гипотеза — покажут числа следующих дней.' } },
      { ic: '3', h: { uz: 'Bir-ikki kunlik oz sondan xulosa chiqarilmaydi — bu kuzatuv.', ru: 'По малым числам за день-два выводов не делают — это наблюдение.' }, ask: { uz: "Tuzatish chiqdi — gipoteza to'g'ri ekanini qachon bilamiz?", ru: 'Исправление вышло — когда мы узнаем, верна ли гипотеза?' } }
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

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev, ustida }) => {
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
        savol={<>{ustida}{tr(question)}</>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — QadamSanoq: chapda maket (telefon yoki brauzer, o'lchami barqaror), o'ngda to'rt ustun va uch oraliq; bitta manba — QADAM_SANOQ =====
// qolip-maket: qs-oraliq qs-ustun qs-telefon do-ok do-tahrir do-prompt-ed do-yordam-btn do-uya-b do-xulq
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
// «Maydon Jamoa» nomi — 11-Modul tayanch 9.62 yashili (PM palitrasining ok yashilidan farqli; A to'lqindan saboq)
const MAYDON_RANG = '#2E9E4F';
const NETFLIX_RANG = '#E50914';
const QADAM_KEY = 'pm-m10d8-qadamlar';
const REJA_KEY = 'pm-m10d7-reja';
const LEND_KEY = 'pm-m10d1-lending';
const TREK_KEY = 'pm-m9d8-platforma';
const trekOl = () => { const p = lsO(TREK_KEY); return p && (p.trek === 'web' || p.trek === 'mobil') ? p.trek : null; };
const trekYoz = (t) => lsY(TREK_KEY, { ...(lsO(TREK_KEY) || {}), trek: t });
const bugun = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
// pm-m10d8-qadamlar — tayanch 8 shakli aynan (9, 10-darslar o'qiydi): id q1…q5 tartibi o'zgarmaydi · toxtash[0] — ★ (tuzatiladigani), toxtash[1] — «Keyin»
const qadamBosh = () => ({ tur: 'real', qadamlar: [], toxtash: [], gipoteza: { agar: '', ozgaradi: '', chunki: '' }, tuzatildi: false, chiqarildi: false, chiqarildiVaqt: null, sana: null });
const qadamOl = () => {
  const o = lsO(QADAM_KEY); const b = qadamBosh();
  if (!o) return b;
  return { ...b, ...o, tur: o.tur === 'mashq' ? 'mashq' : 'real', qadamlar: Array.isArray(o.qadamlar) ? o.qadamlar.filter(q => q && typeof q === 'object') : [], toxtash: Array.isArray(o.toxtash) ? o.toxtash : [], gipoteza: { ...b.gipoteza, ...(o.gipoteza && typeof o.gipoteza === 'object' ? o.gipoteza : {}) } };
};
const qadamYoz = (patch) => { const n = { ...qadamOl(), ...patch }; lsY(QADAM_KEY, n); return n; };
const qadamSaqlangan = (k) => !!(k && k.qadamlar.length >= 3 && k.toxtash.length >= 1 && String(k.gipoteza.agar || '').trim());
const rejaOl = () => lsO(REJA_KEY) || {};

// Foiz — keyingi qadamdagi son oldingisining necha foizi (butun songa); 0 ga bo'lish — «—»
const foiz = (keyingi, oldingi) => (Number.isFinite(keyingi) && Number.isFinite(oldingi) && oldingi > 0 ? Math.round((keyingi / oldingi) * 100) : null);
const oraliqlar = (qs) => qs.slice(1).map((q, i) => ({ i, dan: qs[i], ga: q, foiz: foiz(q.soni, qs[i].soni), otmadi: Number.isFinite(qs[i].soni) && Number.isFinite(q.soni) ? qs[i].soni - q.soni : null }));
// Foizi eng past ikki oraliq (teng bo'lsa — yo'ldagi birinchisi)
const engPast = (ors) => ors.filter(o => o.foiz != null).sort((a, b) => a.foiz - b.foiz || a.i - b.i).slice(0, 2).map(o => o.i);
const oraliqId = (i) => 'q' + (i + 2); // oraliq oxiridagi qadam id si (tayanch 8: toxtash)
const idOraliq = (id) => { const n = Number(String(id || '').slice(1)); return Number.isFinite(n) && n >= 2 ? n - 2 : -1; };

// Mentor misoli — tayanch 1.8 va 1.13 aynan (boshqa son yo'q); foizlar va «o'tmadi» — hisob funksiyasidan, qo'lda yozilmaydi
const QADAM_SANOQ = {
  nom: 'Maydon Jamoa',
  url: 'maydon-jamoa-….netlify.app',
  mentor: [
    { id: 'q1', y: { uz: 'ochdi', ru: 'открыл' }, soni: 46 },
    { id: 'q2', y: { uz: "ro'yxatdan o'tdi", ru: 'зарегистрировался' }, soni: 27 },
    { id: 'q3', y: { uz: "qo'shildi", ru: 'присоединился' }, soni: 12 },
    { id: 'q4', y: { uz: 'kelishini tasdiqladi', ru: 'подтвердил приход' }, soni: 9 }
  ],
  db: 27,
  sinfdosh: 11,
  ekran: ['kirish', 'oyinlar', 'oyin'], // 2-ekran: har oraliqda telefonda ochiladigan qadam ekrani
  mashq: [40, 30, 10, 8], // 3-ekran testi — «mashq uchun» (Mentor misoli emas)
  gipoteza: {
    agar: { uz: "o'yinlar ro'yxati ro'yxatdan o'tmasdan ham ko'rinsa", ru: 'список игр будет виден и без регистрации' },
    ozgaradi: { uz: "ochganlardan ko'prog'i ro'yxatdan o'tadi", ru: 'больше открывших зарегистрируются' },
    chunki: { uz: "hozir ilova birinchi ekranda parol so'raydi — ichida nima borligi ko'rinmaydi", ru: 'сейчас приложение на первом экране просит пароль — не видно, что внутри' }
  },
  oyin: { kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '18:00', joy: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, bor: 8, kerak: 10 }
};
const QS = QADAM_SANOQ;
const mentorQadamlar = () => QS.mentor.map(q => ({ id: q.id, nom: tr(q.y), soni: q.soni }));
const mashqQadamlar = () => QS.mentor.map((q, i) => ({ id: q.id, nom: tr(q.y), soni: QS.mashq[i] }));
const gapYig = (g) => { const s = (k) => String(g[k] || '').trim(); return `${tr({ uz: 'Agar', ru: 'Если' })} ${s('agar')}, ${s('ozgaradi')}, ${tr({ uz: 'chunki', ru: 'потому что' })} ${s('chunki')}.`; };
const mentorGap = () => gapYig({ agar: tr(QS.gipoteza.agar), ozgaradi: tr(QS.gipoteza.ozgaradi), chunki: tr(QS.gipoteza.chunki) });

// Son sanab o'sadi (reduced-motion va qayta kirishda — darhol)
const useSanash = (n, on, darhol) => {
  const [v, setV] = useState(on && (darhol || kamHarakat()) ? n : 0);
  useEffect(() => {
    if (!on) { setV(0); return undefined; }
    if (darhol || kamHarakat()) { setV(n); return undefined; }
    let i = 0; const q = Math.max(1, Math.round(n / 12));
    const t = setInterval(() => { i = Math.min(n, i + q); setV(i); if (i >= n) clearInterval(t); }, 60);
    return () => clearInterval(t);
  }, [n, on]); // eslint-disable-line
  return v;
};
const Sanoq = ({ n, on = true, darhol }) => { const v = useSanash(n, on, darhol); return <>{v}</>; };
// Vizual o'zi bir marta yuradi: bosqichlar vaqti (ms) — reduced-motion da oxirgi holat darhol
const useYurish = (vaqtlar) => {
  const [f, setF] = useState(() => (kamHarakat() ? vaqtlar.length : 0));
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const ts = vaqtlar.map((ms, i) => setTimeout(() => setF(i + 1), ms));
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line
  return f;
};
// Bosish → narsa uchadi (SABOQ 19): portal — transformli ota-blokka bog'lanmasin
function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    setUchlar(u => [...u, { k, matn, x: a.left, y: a.top, dx: b.left - a.left, dy: b.top - a.top }]);
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 820);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className="do-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
// Taxmin qatori — yashil xulosaning birinchi kichik qatori (E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('do-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
// QIzoh — o'sha qutining oxirgi kichik qatori (E 42)
const IzohQ = ({ children }) => <span className="do-izoh">{children}</span>;
// Bashorat tanlangach — ixcham qator natijagacha turadi (SABOQ 11)
const BashoratQ = ({ savol, javob }) => <div className="do-bashq fade-step"><span>{savol}</span><span className="do-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;

// --- Maket 1: telefon «Maydon Jamoa» (nom o'z rangida, logotipsiz; 170×272 barqaror)
// ekran: 'kirish' | 'oyinlar' | 'oyin' | 'mehmon' | 'royxat' · qoshil: «Qo'shilaman» tugmasi ('bor' | 'bos')
const MaydonNom = () => <b className="qs-nom">{QS.nom}</b>;
const QsTelefon = ({ ekran = 'oyinlar', qoshil, className }) => {
  const o = QS.oyin;
  const karta = (
    <span className="qs-karta">
      <b>{tr(o.kun)}, {o.soat}</b><span>{tr(o.joy)}</span><b className="qs-son">{o.bor} / {o.kerak}</b>
      {qoshil && <span className={cxx('qs-tel-btn', 'kichik', qoshil === 'bos' && 'bos')}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>}
    </span>
  );
  return (
    <div className={cxx('qs-tel', className)}>
      <span className={cxx('qs-tel-bar', ekran === 'mehmon' && 'mehmon')}><MaydonNom />{ekran === 'mehmon' && <span className="qs-tel-kir">{tr({ uz: 'Kirish', ru: 'Вход' })}</span>}</span>
      {ekran === 'ochilish' && <span className="qs-ekran qs-ochilish" key="o"><span className="qs-ochilish-n"><MaydonNom /></span></span>}
      {ekran === 'kirish' && (
        <span className="qs-ekran" key="k">
          <b className="qs-tel-sar">{tr({ uz: 'Kirish', ru: 'Вход' })}</b>
          <span className="qs-maydon">{tr({ uz: 'Login', ru: 'Логин' })}</span>
          <span className="qs-maydon">{tr({ uz: 'Parol', ru: 'Пароль' })}</span>
          <span className="qs-tel-btn">{tr({ uz: 'Kirish', ru: 'Вход' })}</span>
          <span className="qs-tel-hv">{tr({ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' })}</span>
        </span>
      )}
      {(ekran === 'oyinlar' || ekran === 'mehmon') && (
        <span className="qs-ekran" key={ekran}>
          <b className="qs-tel-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
          <span className="qs-tel-kun">{tr(o.kun)}</span>
          {karta}
        </span>
      )}
      {ekran === 'oyin' && (
        <span className="qs-ekran" key="y">
          <span className="qs-tel-orqa">‹ {tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
          <b className="qs-tel-sar">{tr(o.kun)}, {o.soat}</b>
          <span className="qs-tel-joy">{tr(o.joy)}</span>
          <b className="qs-son katta">{o.bor} / {o.kerak}</b>
          <span className="qs-tel-btn past">{tr({ uz: 'Kelaman', ru: 'Приду' })}</span>
        </span>
      )}
      {ekran === 'royxat' && (
        <span className="qs-ekran" key="r">
          <b className="qs-tel-sar">{tr({ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' })}</b>
          <span className="qs-maydon">{tr({ uz: 'Ism', ru: 'Имя' })}</span>
          <span className="qs-maydon">{tr({ uz: 'Login', ru: 'Логин' })}</span>
          <span className="qs-maydon">{tr({ uz: 'Parol', ru: 'Пароль' })}</span>
          <span className="qs-tel-btn">{tr({ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' })}</span>
        </span>
      )}
    </div>
  );
};
// --- Maket 2: brauzer — sanoq sahifasi (holat: 'kalit' — kalit maydoni, 'sanoq' — sonlar). Faqat sonlar: ism, login, qurilma ID yo'q
const QsBrauzer = ({ holat = 'sanoq', qadamlar = [], yangi = -1 }) => (
  <div className="qs-oyna">
    <div className="qs-bar"><i /><i /><i /><span className="qs-url"><span className="qs-url-t">{QS.url}/sanoq.html</span></span></div>
    <div className="qs-oyna-ich">
      {holat === 'kalit' ? (
        <span className="qs-kalit fade-step" key="k"><span className="qs-kalit-m">••••••••••••</span><span className="qs-kalit-b">›</span></span>
      ) : (
        <span className="qs-sahifa fade-step" key="s">
          <b className="qs-sahifa-h"><MaydonNom /> · {tr({ uz: 'sanoq', ru: 'подсчёт' })}</b>
          {qadamlar.map((q, i) => <span key={q.id} className={cxx('qs-sq', yangi === i && 'yangi')}><span>{q.nom}</span><b key={q.soni}>{q.soni}</b></span>)}
          <span className="qs-sq-osti">{tr({ uz: 'har qadamda turli qurilmalar', ru: 'на каждом шаге — разные устройства' })}</span>
          <span className="qs-sq akk"><span>{tr({ uz: "Ro'yxatdan o'tgan akkauntlar", ru: 'Зарегистрированные аккаунты' })}:</span><b>{QS.db}</b></span>
        </span>
      )}
    </div>
  </div>
);
// --- Oraliq yorlig'i: bo'sh — uzuq chiziq (U-041); ochilgach «46 dan 27 — 59%» sanab chiqadi, ostida «19 tasi o'tmadi»
// holat: 'bosh' | 'belgi' (kulrang, foizsiz) | 'ochiq' · tus: 'err' | 'ok' · onClick bo'lsa — tugma
const Oraliq = ({ o, holat, tus, halqa, onClick, darhol, belgi, lahza, bRef }) => {
  const ochiq = holat === 'ochiq';
  const f = useSanash(o.foiz || 0, ochiq && o.foiz != null, darhol);
  const ichi = ochiq
    ? <>
        <b className="qs-or-f">{tr({ uz: <>{o.dan.soni} dan {o.ga.soni} — {o.foiz == null ? '—' : f + '%'}</>, ru: <>{o.ga.soni} из {o.dan.soni} — {o.foiz == null ? '—' : f + '%'}</> })}</b>
        {o.otmadi != null && o.otmadi >= 0 && <span className="qs-or-o">{tr({ uz: `${o.otmadi} tasi o'tmadi`, ru: `${o.otmadi} не перешли` })}</span>}
        {belgi && <span className={cxx('qs-or-belgi', belgi === '★' && 'yulduz')}>{belgi}</span>}
      </>
    : <span className="qs-or-f">%</span>;
  const cls = cxx('qs-oraliq', holat, tus, lahza && 'lahza', halqa && 'do-halqa');
  return onClick
    ? <button type="button" ref={bRef} className={cls} onClick={onClick} aria-label={`${o.dan.nom} — ${o.ga.nom}`}>{ichi}</button>
    : <span className={cls} ref={bRef}>{ichi}</span>;
};
// --- To'rt ustun: teng kenglikda, balandligi songa mos (noldan o'sadi); torayib boradigan shakl yo'q (voronka obrazi taqiq)
// qadamlar: [{ id, nom, soni | null }] · oraliq: [{ holat, tus, belgi, lahza }] · halqa: bosiladigan oraliq · toxtash: ustun indekslari
const QsUstunlar = ({ qadamlar, oraliq = [], halqa = -1, onOraliq, toxtash = [], tolqin, yorliq, izohOxir, sonsiz, darhol, oraliqsiz, kichik, orRef }) => {
  const n = qadamlar.length;
  const max = Math.max(1, ...qadamlar.map(q => (Number.isFinite(q.soni) ? q.soni : 0)));
  const ors = oraliqlar(qadamlar);
  const ust = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` };
  return (
    <div className={cxx('qs-ustunlar', kichik && 'kichik', sonsiz && 'sonsiz')}>
      {yorliq && <span className="qs-yorliq">{yorliq}</span>}
      <div className="qs-ust-maydon" style={ust}>
        {qadamlar.map((q, i) => (
          <div key={q.id || i} className="qs-ust-k">
            {Number.isFinite(q.soni)
              ? <>{!sonsiz && <b className="qs-ust-son"><Sanoq n={q.soni} darhol={darhol} /></b>}<i className="qs-ustun" style={{ height: Math.max(3, (q.soni / max) * 100) + '%', '--d': (i * 0.12) + 's' }} /></>
              : <i className={cxx('qs-ustun', 'bosh', tolqin && 'tolqin')} style={{ '--d': (i * 0.1) + 's' }} />}
          </div>
        ))}
      </div>
      <div className="qs-ust-nomlar" style={ust}>
        {qadamlar.map((q, i) => (
          <span key={q.id || i} className="qs-ust-nom">
            <span>{q.nom}</span>
            {toxtash.includes(i) && <em className="qs-toxtash fade-step">{tr({ uz: "to'xtab qolish qadami", ru: 'шаг остановки' })}</em>}
            {i === n - 1 && izohOxir && <em className="qs-izoh-oxir fade-step">{izohOxir}</em>}
          </span>
        ))}
      </div>
      {!oraliqsiz && ors.length > 0 && (
        <div className="qs-oraliqlar" style={{ gridTemplateColumns: `minmax(0, 0.5fr) repeat(${n - 1}, minmax(0, 1fr)) minmax(0, 0.5fr)` }}>
          <span />
          {ors.map(o => {
            const h = oraliq[o.i] || {};
            return <span key={o.i} className="qs-or-joy"><Oraliq o={o} holat={h.holat || 'bosh'} tus={h.tus} belgi={h.belgi} lahza={h.lahza} halqa={halqa === o.i} darhol={darhol || h.darhol}
              onClick={onOraliq && (h.bosiladi !== false) ? () => onOraliq(o.i) : undefined} bRef={orRef ? (el) => { orRef.current[o.i] = el; } : undefined} /></span>;
          })}
          <span />
        </div>
      )}
    </div>
  );
};
// Bitta vizual: chapda maket, o'ngda ustunlar (yonma — tor joyda: maket 176px)
const QadamSanoq = ({ maket, yonma, children }) => (
  <div className={cxx('qs-sanoq', yonma && 'yonma', !maket && 'yakka')}>
    {maket && <div className="qs-maket">{maket}</div>}
    <div className="qs-ong">{children}</div>
  </div>
);
const MENTOR_YORLIQ = { uz: 'Mentor misolida · 3 kun · har qadamda turli qurilmalar', ru: 'В примере Ментора · 3 дня · на каждом шаге — разные устройства' };

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz — J-026; «Aynan!» / «Qiziq fikr!»; ikkala tanlovda vizual bir xil) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Foydalanuvchilarning o'zidan so'rab bilaman", ru: 'Узнаю, спросив самих пользователей' } },
  { id: 'b', label: { uz: 'Har qadamda nechta qurilma borligidan bilaman', ru: 'Узнаю по числу устройств на каждом шаге' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Sanoq qaysi oraliqda kamroq qurilma o'tganini bir qarashda ko'rsatadi. Nega — hali taxmin.</>, ru: <><b>Именно!</b> Подсчёт сразу показывает, в каком промежутке перешло меньше устройств. Почему — пока предположение.</> },
  a: { uz: <><b>Qiziq fikr!</b> So'rash qayerda va nega to'xtaganini aytadi. Hamma qadamni bir xil solishtirish uchun esa sanoq kerak.</>, ru: <><b>Интересная мысль!</b> Вопрос скажет, где и почему остановились. А чтобы одинаково сравнить все шаги, нужен подсчёт.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const qs = mentorQadamlar().map((q, i) => (i === 1 || i === 2 ? { ...q, soni: null } : q));
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('do-s0', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Foydalanuvchilar qaysi qadamda <A>to'xtab qolyapti?</A></>, ru: <>На каком шаге пользователи <A>останавливаются?</A></> })}
          mentor={<Mentor>{tr({ uz: "Mentor misolida 3 kunda ilova 46 ta qurilmada ochildi, o'yinga kelish esa 9 tasida tasdiqlandi. Ikki javobdan birini tanlang.", ru: 'В примере Ментора за 3 дня приложение открыли на 46 устройствах, а приход на игру подтвердили на 9. Выберите один из двух ответов.' })}</Mentor>}
          maket={<QadamSanoq yonma maket={<QsTelefon ekran="oyinlar" />}>
            <QsUstunlar qadamlar={qs} oraliqsiz tolqin={picked !== null} yorliq={tr({ uz: 'Mentor misolida · 3 kun · turli qurilmalar', ru: 'В примере Ментора · 3 дня · разные устройства' })} />
          </QadamSanoq>}
          savol={tr({ uz: "Boshqalari qaysi qadamda to'xtaganini qanday bilasiz?", ru: 'Как вы узнаете, на каком шаге остановились остальные?' })}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; chap — vizual bir marta o'zi yuradi: telefon ochiladi → to'rt kulrang ustun sonsiz o'sadi → ikki oraliqda kulrang belgi → telefonda ekran almashadi → «yangi versiya») =====
const REJA = [
  { t: { uz: 'Har qadamda nechta qurilma borligini sanaysiz', ru: 'Посчитаете, сколько устройств на каждом шаге' }, teg: { uz: 'sanoq', ru: 'подсчёт' } },
  { t: { uz: "Qaysi qadamga kam odam o'tganini foizdan topasiz", ru: 'По проценту найдёте, на какой шаг перешло мало людей' }, teg: { uz: 'foiz', ru: 'процент' } },
  { t: { uz: 'Bittasi uchun gipoteza yozasiz', ru: 'Для одного напишете гипотезу' }, teg: { uz: 'gipoteza', ru: 'гипотеза' } },
  { t: { uz: 'Tuzatishni tekshirib, yangi versiyani chiqarasiz', ru: 'Проверите исправление и выпустите новую версию' }, teg: { uz: 'yangi versiya', ru: 'новая версия' } }
];
const RejaChizma = () => {
  const f = useYurish([900, 2300, 3300, 4300]);
  const qs = mentorQadamlar();
  return (
    <div className="do-rj">
      <QadamSanoq yonma maket={<QsTelefon ekran={f >= 3 ? 'mehmon' : 'kirish'} className="do-rj-tel" />}>
        {f >= 1 ? <QsUstunlar sonsiz qadamlar={qs} oraliq={f >= 2 ? [{ holat: 'belgi' }, { holat: 'belgi' }, {}] : []} /> : <span className="do-rj-bosh" aria-hidden="true" />}
      </QadamSanoq>
      {f >= 4 && <span className="do-rj-yangi fade-step">✓ {tr({ uz: 'yangi versiya', ru: 'новая версия' })}</span>}
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [olchov] = useState(() => { const r = rejaOl(); return !!(r.tekshiruv && r.tekshiruv.olchov); });
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun sanoq ko'rsatgan <A>bitta joyni tuzatasiz.</A></>, ru: <>Сегодня исправите <A>одно место, которое покажет подсчёт.</A></> })}
        mentor={<Mentor>{tr({ uz: "11-Modulda uch sinovchi qayerda to'xtaganini kuzatgansiz — bugun buni har qadam sanog'i ko'rsatadi. Kodni agent yozadi, qaysi qadamni tuzatishni siz tanlaysiz.", ru: 'В 11-м модуле вы наблюдали, где остановились три тестировщика, — сегодня это покажет подсчёт каждого шага. Код пишет агент, какой шаг исправлять — выбираете вы.' })}</Mentor>}
        chapYorliq={tr({ uz: "qadamlar bo'yicha sanoq, gipoteza va shu darsda tuzatish", ru: 'подсчёт по шагам, гипотеза и исправление на этом уроке' })}
        chap={<RejaChizma />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="do-past mono">{fmtCode(tr({ uz: "repo `maydon-jamoa` · boshlang'ich holat `m12-dars-08-start` · namuna `m12-dars-08-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.", ru: 'репозиторий `maydon-jamoa` · начальное состояние `m12-dars-08-start` · образец `m12-dars-08-done` — практики выполняете на своём продукте.' }))}</p>
        {!olchov && <p className="do-past">{tr({ uz: "Ilovangizda qadamlar hali sanalmasa — Amaliyot 1 ning birinchi bo'limi nima qilishni aytadi.", ru: 'Если в вашем приложении шаги ещё не считаются, — первый раздел Практики 1 скажет, что делать.' })}</p>}
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — QADAMLAR VA FOIZ (QTushuncha markaziy: bashorat → uch oraliq tartibda → ikki to'xtab qolish qadami; tugagach ustunlar fokusga) =====
const S2_TAXMIN = [
  { k: 'q2', t: { uz: "Ro'yxatdan o'tdi", ru: 'Зарегистрировался' } },
  { k: 'q3', ok: true, t: { uz: "Qo'shildi", ru: 'Присоединился' } },
  { k: 'q4', t: { uz: 'Kelishini tasdiqladi', ru: 'Подтвердил приход' } }
];
const S2_SAVOL = { uz: "Qaysi qadamga o'tganlar foizi eng kichik?", ru: 'На какой шаг перешёл самый маленький процент?' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = storedAnswer !== undefined;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 3 : 0);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1800, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = (i) => { if (!taxmin || i !== n || n >= 3) return; setN(n + 1); };
  const qs = mentorQadamlar();
  const oraliq = [0, 1, 2].map(i => ({ holat: i < n ? 'ochiq' : 'bosh', tus: done ? (i < 2 ? 'err' : 'ok') : undefined, bosiladi: i === n }));
  const ustunlar = <QsUstunlar qadamlar={qs} oraliq={oraliq} darhol={avval} halqa={taxmin && !done ? n : -1} onOraliq={taxmin && !done ? bos : undefined}
    toxtash={done ? [1, 2] : []} izohOxir={done && tr({ uz: "eng kichik son — 75% o'tgan", ru: 'самое маленькое число — перешли 75%' })} yorliq={tr(MENTOR_YORLIQ)} />;
  const tel = <QsTelefon ekran={n === 0 ? 'oyinlar' : QS.ekran[n - 1]} qoshil={n === 2 ? 'bor' : undefined} />;
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const joriy = done && !tugadi && <p className="do-joriy fade-step">{tr({ uz: "Keyingi qadamga o'tganlar foizi past bo'lgan joy to'xtab qolish qadami deyiladi; bu darsda — eng past ikkitasi.", ru: 'Место, где процент перешедших на следующий шаг низкий, называется шагом остановки; на этом уроке — два самых низких.' })}</p>;
  const mGap = !taxmin ? { uz: "Mentor misolining 3 kunlik sanog'i tayyor — avval javobingizni belgilang.", ru: 'Подсчёт примера Ментора за 3 дня готов — сначала отметьте свой ответ.' }
    : !done ? { uz: 'Keyingi oraliqni bosing — telefonda shu qadam ekrani ochiladi.', ru: 'Нажмите следующий промежуток — на телефоне откроется экран этого шага.' }
    : { uz: "Foizlarni solishtirib, «Davom etish»ni bosing.", ru: 'Сравните проценты и нажмите «Продолжить».' };
  const navL = !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !done ? { uz: `Oraliqni bosing (${n + 1}/3)`, ru: `Нажмите промежуток (${n + 1}/3)` } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · qadamlar', ru: 'Понятие · шаги' })} screen={screen} scrollSignal={n + (taxmin ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navL)} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Qadamdan qadamga <A>necha foiz o'tdi?</A></>, ru: <>Сколько процентов <A>перешло с шага на шаг?</A></> })}
        mentor={<Mentor>{tr(mGap)}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tr(tx.t)} />}
        vizual={tugadi
          ? <div className="do-fokus">{ustunlar}</div>
          : <QadamSanoq maket={tel}>{ustunlar}{joriy}</QadamSanoq>}
        xulosa={done && <>{tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: "qo'shildi — 44%, ro'yxatdan o'tdi — 59%", ru: 'присоединился — 44%, зарегистрировался — 59%' })} />}{tr({ uz: "Bu misolda to'xtab qolish qadamlari — ro'yxatdan o'tish va qo'shilish. Eng kichik son — 9 — ulardan emas.", ru: 'В этом примере шаги остановки — регистрация и присоединение. Самое маленькое число — 9 — не из них.' })}</>}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida mashq kartasi, yorliq yo'q — SABOQ 6) =====
const MashqKarta = () => (
  <div className="do-mashq">
    <span className="do-mashq-y">{tr({ uz: 'mashq uchun · turli qurilmalar', ru: 'для упражнения · разные устройства' })}</span>
    <span className="do-mashq-q">{mashqQadamlar().map(q => <span key={q.id} className="do-mashq-k"><span>{q.nom}</span><b>{q.soni}</b></span>)}</span>
  </div>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · to'xtab qolish qadami", ru: 'Проверка · шаг остановки' })}
    ustida={<MashqKarta />}
    questionText="Shu sanoqda qaysi oraliqda o'tganlar foizi eng past?"
    question={tr({ uz: <h2 className="title h-ask">Shu sanoqda qaysi oraliqda <A>o'tganlar foizi eng past?</A></h2>, ru: <h2 className="title h-ask">В каком промежутке этого подсчёта <A>процент перешедших самый низкий?</A></h2> })}
    options={[
      { uz: 'Tasdiqlashda: qurilmalar soni eng kichik', ru: 'На подтверждении: число устройств самое маленькое' },
      { uz: "Ro'yxatdan o'tishda: 40 dan 30 tasi o'tgan", ru: 'На регистрации: перешли 30 из 40' },
      { uz: "Qo'shilishda: 30 dan 10 tasi o'tgan", ru: 'На присоединении: перешли 10 из 30' },
      { uz: 'Ochishda: qurilmalar soni eng katta', ru: 'На открытии: число устройств самое большое' }
    ]} correctIdx={2}
    explainCorrect={{ uz: '30 dan 10 tasi — 33 foiz: oraliqlar ichida eng pasti.', ru: '10 из 30 — 33 процента: самый низкий из промежутков.' }}
    explainWrong={{
      0: { uz: "Son kichik, lekin 10 dan 8 tasi o'tgan — 80 foiz.", ru: 'Число маленькое, но перешли 8 из 10 — 80 процентов.' },
      1: { uz: '40 dan 30 — 75 foiz. Pastrog\'i qaysi oraliqda?', ru: '30 из 40 — 75 процентов. В каком промежутке ниже?' },
      3: { uz: "Ochish — birinchi qadam: undan oldingi son yo'q.", ru: 'Открытие — первый шаг: числа до него нет.' },
      default: { uz: '30 dan 10 tasi — 33 foiz: oraliqlar ichida eng pasti.', ru: '10 из 30 — 33 процента: самый низкий из промежутков.' }
    }} />
);

// ===== SCREEN 5 — NETFLIX (QVoqea, PM keys K6 — faqat bank matni; SABOQ 2, 3, 8, 26). Manba: PM_Prompt_v8.md K6 (198–202) · tayanch 5 =====
// Sahna chizilgan (CSS), logotipsiz; bankda yo'q narsa chizilmaydi: film nomi, boshqa son, yil yo'q. «Ko'rish» belgilari sanaladigan bo'lmaydi (08-FILTR 10).
const NETFLIX_KADR = [
  { h: { uz: "Har kimda o'ziniki", ru: 'У каждого своя' }, m: { uz: "Netflix'da bosh sahifa har kimda o'ziniki: tavsiyalar ko'rish tarixidan — odam oldin ko'rganlaridan yig'iladi.", ru: 'В Netflix главная страница у каждого своя: рекомендации собираются из истории просмотров — из того, что человек смотрел раньше.' } },
  { h: { uz: 'Qidiruvdan emas', ru: 'Не из поиска' }, m: { uz: "2016-yilda Netflix ochiq aytgan: ko'rishlarning qariyb 80 foizi qidiruvdan emas, tavsiyalardan keladi.", ru: 'В 2016 году Netflix открыто заявил: почти 80 процентов просмотров приходят не из поиска, а из рекомендаций.' } },
  { h: { uz: "Son yo'lni ko'rsatadi", ru: 'Число показывает путь' }, m: { uz: "Sizning sanog'ingiz ham yo'lni ko'rsatadi: odamlar qaysi qadamda to'xtab qolyapti.", ru: 'Ваш подсчёт тоже показывает путь: на каком шаге люди останавливаются.' } }
];
const NF_TAXMIN = [
  { k: '20', t: { uz: 'Qariyb 20 foizi', ru: 'Почти 20 процентов' } },
  { k: '50', t: { uz: 'Qariyb 50 foizi', ru: 'Почти 50 процентов' } },
  { k: '80', ok: true, t: { uz: 'Qariyb 80 foizi', ru: 'Почти 80 процентов' } }
];
const NF_SAVOL = { uz: "2016-yilda Netflix aytishicha, ko'rishlarning qanchasi tavsiyalardan keladi?", ru: 'По словам Netflix в 2016 году, какая часть просмотров приходит из рекомендаций?' };
const Nf = () => <span className="do-nf">Netflix</span>;
// Netflix bosh sahifasi: to'q fon, rangli kartalar qatorlari — matnsiz; palitra har telefonda boshqa (qatorlar har kimda o'ziniki)
const NF_PALITRA = [['#E8A13A', '#3D8BD9', '#B5679E', '#5FA37A'], ['#4A90A4', '#E07A5F', '#8B5CF6', '#C9B037']];
const NfTel = ({ p = 0, qidiruv, katta, kichik }) => {
  const r = NF_PALITRA[p];
  return (
    <div className={cxx('do-nf-tel', katta && 'katta', kichik && 'kichik')}>
      <span className="do-nf-tel-bar"><Nf /></span>
      {qidiruv && <span className="do-nf-qid" aria-hidden="true" />}
      {[0, 1, 2].map(q => (
        <span key={q} className={cxx('do-nf-qator', q === 0 && 'bosh')}>
          {[0, 1, 2].map(k => <i key={k} style={{ background: r[(q + k) % r.length] }} />)}
        </span>
      ))}
    </div>
  );
};
const NetflixSahna = ({ b, qadamlar }) => (
  <div className={cxx('do-nf-sahna', 'k' + b)}>
    {b === 0 && (
      <div className="do-nf-ikki" key="k0">
        {[0, 1].map(p => (
          <div key={p} className="do-nf-ustun">
            <NfTel p={p} />
            <i className="do-nf-chiz" aria-hidden="true" />
            <span className="do-nf-korgan">{NF_PALITRA[p].slice(0, 3).map((c, i) => <i key={i} style={{ borderColor: c }} />)}</span>
            <span className="do-nf-korgan-y">{tr({ uz: "ko'rganlari", ru: 'что смотрел' })}</span>
          </div>
        ))}
      </div>
    )}
    {b === 1 && (
      <div className="do-nf-oqim" key="k1">
        <div className="do-nf-oqim-tel">
          <NfTel p={0} qidiruv katta />
          <span className="do-nf-y qid">{tr({ uz: 'qidiruv', ru: 'поиск' })}</span>
          <span className="do-nf-y tav">{tr({ uz: 'tavsiyalar', ru: 'рекомендации' })}</span>
        </div>
        <div className="do-nf-yol" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <i key={i} className="t" style={{ '--d': (i * 0.38) + 's', '--y': (58 + (i % 3) * 22) + 'px' }}>▶</i>)}
          {[0, 1].map(i => <i key={'q' + i} className="q" style={{ '--d': (0.9 + i * 1.6) + 's', '--y': '30px' }}>▶</i>)}
        </div>
        <span className="do-nf-kor">{tr({ uz: "ko'rishlar", ru: 'просмотры' })}</span>
      </div>
    )}
    {b === 2 && (
      <div className="do-nf-kopr" key="k2">
        <NfTel p={0} kichik />
        <div className="do-nf-kopr-ong">
          <span className="do-nf-kopr-nom"><MaydonNom /></span>
          <QsUstunlar kichik darhol qadamlar={qadamlar} oraliq={[0, 1, 2].map(i => ({ holat: 'ochiq', darhol: true, tus: i < 2 ? 'err' : undefined, lahza: i < 2 }))} />
        </div>
      </div>
    )}
  </div>
);
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const kadr = NETFLIX_KADR[b];
  const kutish = b === 0 && !taxmin;
  const tx = NF_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Nf /> · {b + 1}/3</>;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={kutish ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Nf />'da <A>ko'rishlar qayerdan keladi?</A></>, ru: <>Откуда <A>приходят просмотры</A> в <Nf />?</> })}
        nuqtalar={<>
          <Mentor key={'m' + b}>{tr(kadr.m)}</Mentor>
          <div className="do-nuq"><span className="do-nuq-l">{yorliq}</span>{NETFLIX_KADR.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="do-voqea">
          {b === 0 && <p className="do-tanish"><Nf /> — {tr({ uz: "film va serial ko'rsatadigan xizmat.", ru: 'сервис, который показывает фильмы и сериалы.' })}</p>}
          <span className="do-voqea-h" key={'h' + b}>{tr(kadr.h)}</span>
          {taxmin && !done && <BashoratQ savol={tr(NF_SAVOL)} javob={tr(tx.t)} />}
          <div className={cxx('do-voqea-qator', done && 'ikki')}>
            <Zoomable><NetflixSahna b={b} qadamlar={mentorQadamlar()} /></Zoomable>
            {done && <QXulosa>{tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'qariyb 80 foizi', ru: 'почти 80 процентов' })} />}{tr({ uz: "Bu voqeada son ko'rishlar qayerdan kelishini ko'rsatdi: qariyb 80 foizi — tavsiyalardan.", ru: 'В этой истории число показало, откуда приходят просмотры: почти 80 процентов — из рекомендаций.' })}</QXulosa>}
          </div>
          {kutish && <div className="do-nf-bash"><QBashorat yorliq={yorliq} savol={tr(NF_SAVOL)} variantlar={NF_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — O'Z SONLARINGIZ (QMustaqil, ketma-ket karta — E 53, SABOQ 9/13/29): 1 · Sonlar → 2 · To'xtash → 3 · Gipoteza → «Saqlash» → pm-m10d8-qadamlar =====
// Faqat bo'sh maydon bloklaydi; qolgani — maslahat, qaror o'quvchida (S-008). Holat o'z kaliti bilan, effektda tiklanmaydi (E 51).
const S6_XATO = {
  nom: { uz: 'Qadam nomini yozing.', ru: 'Напишите название шага.' },
  son: { uz: 'Shu qadamda nechta qurilma — son yozing.', ru: 'Сколько устройств на этом шаге — напишите число.' },
  katta: { uz: "Keyingi qadamga ko'proq o'tganmi? Sonni tekshiring.", ru: 'На следующий шаг перешло больше? Проверьте число.' },
  oraliq: { uz: 'Bu oraliqda foiz kattaroq. Sababingiz bormi?', ru: 'В этом промежутке процент выше. Есть причина?' },
  ozgaradi: { uz: "Qaysi qadamga ko'proq o'tishi kerak — shuni yozing.", ru: 'На какой шаг должно переходить больше — напишите это.' },
  ikki: { uz: "Bitta o'zgarish yozing — bugun bittasi quriladi.", ru: 'Напишите одно изменение — сегодня строится одно.' }
};
const S6_YORDAM = { uz: "Mentor misolida: ochdi 46 · ro'yxatdan o'tdi 27 · qo'shildi 12 · kelishini tasdiqladi 9 — foizlar 59 · 44 · 75. To'xtab qolish qadamlari — ro'yxatdan o'tish va qo'shilish. Mentor ro'yxatdan o'tishni tanladi: u yo'lda birinchi — undan o'tmagan odam keyingi qadamlarga yetmaydi. Gipoteza: «Agar o'yinlar ro'yxati ro'yxatdan o'tmasdan ham ko'rinsa, ochganlardan ko'prog'i ro'yxatdan o'tadi, chunki hozir ilova birinchi ekranda parol so'raydi — ichida nima borligi ko'rinmaydi.»", ru: 'В примере Ментора: открыл 46 · зарегистрировался 27 · присоединился 12 · подтвердил приход 9 — проценты 59 · 44 · 75. Шаги остановки — регистрация и присоединение. Ментор выбрал регистрацию: она на пути первая — кто её не прошёл, до следующих шагов не дойдёт. Гипотеза: «Если список игр будет виден и без регистрации, больше открывших зарегистрируются, потому что сейчас приложение на первом экране просит пароль — не видно, что внутри.»' };
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
// «o'zgaradi» da qadam nomi bormi — har qadam nomining birinchi so'zi o'zagi bo'yicha (maslahat, bloklamaydi)
const qadamTilga = (matn, qatorlar) => { const m = normS(matn); return qatorlar.some(q => { const w = normS(q.nom).split(' ')[0] || ''; const o = w.slice(0, Math.max(3, w.length - 3)); return o && m.includes(o); }); };
const IKKI_RE = /(^|[\s,])(va|ham)([\s,.]|$)/;
const sonOk = (v) => /^\d+$/.test(String(v));
const qatorQ = (qatorlar) => qatorlar.map((q, i) => ({ id: 'q' + (i + 1), nom: String(q.nom || '').trim(), soni: sonOk(q.soni) ? Number(q.soni) : null }));
const GIP_MAYDON = [
  { k: 'agar', b: { uz: 'Agar …', ru: 'Если …' }, p: { uz: "Nimani o'zgartirasiz?", ru: 'Что измените?' } },
  { k: 'ozgaradi', b: { uz: "… o'zgaradi", ru: '… изменится' }, p: { uz: "Qaysi qadamga ko'proq o'tadi?", ru: 'На какой шаг перейдёт больше?' } },
  { k: 'chunki', b: { uz: 'chunki …', ru: 'потому что …' }, p: { uz: "Nega shunday deb o'ylaysiz?", ru: 'Почему вы так думаете?' } }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [k0] = useState(qadamOl);
  const avval = qadamSaqlangan(k0);
  const [qatorlar, setQatorlar] = useState(() => (avval ? k0.qadamlar.map(q => ({ nom: String(q.nom || ''), soni: q.soni == null ? '' : String(q.soni) })) : []));
  const [tur, setTur] = useState(avval ? k0.tur : 'real');
  const [qism, setQism] = useState(avval ? 3 : 0); // 0 Sonlar · 1 To'xtash · 2 Gipoteza · 3 saqlandi
  const [karta, setKarta] = useState({ nom: '', soni: '' });
  const [tahrirI, setTahrirI] = useState(null);
  const [tanlangan, setTanlangan] = useState(() => (avval ? k0.toxtash.map(idOraliq).filter(i => i >= 0) : []));
  const [yulduz, setYulduz] = useState(() => (avval ? idOraliq(k0.toxtash[0]) : -1));
  const [gip, setGip] = useState(() => (avval ? { agar: String(k0.gipoteza.agar || ''), ozgaradi: String(k0.gipoteza.ozgaradi || ''), chunki: String(k0.gipoteza.chunki || '') } : { agar: '', ozgaradi: '', chunki: '' }));
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [saqlandi, setSaqlandi] = useState(avval);
  const [yangi, setYangi] = useState(-1);
  const [uch, qatlam] = useUchish();
  const kartaRef = useRef(null), qatorRef = useRef([]), uyaRef = useRef([]), orRef = useRef([]);
  const done = saqlandi;
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Qadamlar', solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi < 0) return undefined; const t = setTimeout(() => setYangi(-1), 1100); return () => clearTimeout(t); }, [yangi]);
  const qs = qatorQ(qatorlar);
  const ors = oraliqlar(qs);
  const past = engPast(ors);
  const nOr = Math.max(0, qs.length - 1);
  const tugadi = saqlandi && qism === 3;
  // --- 1 · Sonlar
  const qosh = () => {
    const nom = karta.nom.trim();
    if (!nom) { setXato('nom'); return false; }
    if (!sonOk(karta.soni)) { setXato('son'); return false; }
    if (tahrirI != null) {
      setQatorlar(a => a.map((q, j) => (j === tahrirI ? { nom, soni: karta.soni } : q)));
      setYangi(tahrirI); setTahrirI(null);
    } else {
      uch(kartaRef.current, qatorRef.current[qatorlar.length - 1] || kartaRef.current, `${nom} · ${karta.soni}`);
      setYangi(qatorlar.length); setQatorlar(a => [...a, { nom, soni: karta.soni }]);
    }
    setKarta({ nom: '', soni: '' }); setXato(null); setYordam(false); setTanlangan([]); setYulduz(-1);
    return true;
  };
  const tahrir = (i) => { setTahrirI(i); setKarta({ ...qatorlar[i] }); setQism(0); setXato(null); };
  const mashq = () => { setQatorlar(mentorQadamlar().map(q => ({ nom: q.nom, soni: String(q.soni) }))); setTur('mashq'); setKarta({ nom: '', soni: '' }); setTahrirI(null); setXato(null); setTanlangan([]); setYulduz(-1); };
  const toxtashga = () => {
    if (karta.nom.trim() || karta.soni) { if (!qosh()) return; }
    const n = qatorlar.length + (karta.nom.trim() && sonOk(karta.soni) ? 1 : 0);
    if (n < 3) return;
    if (n === 3) setTanlangan([0, 1]); // 3 qadam — ikki oraliq, ikkalasi tanlanadi
    setQism(1); setXato(null); setYordam(false);
  };
  // --- 2 · To'xtash: ikki oraliq → ★ bittasi
  const orBos = (i) => {
    if (tanlangan.includes(i)) { setTanlangan(t => t.filter(x => x !== i)); if (yulduz === i) setYulduz(-1); return; }
    if (tanlangan.length >= 2) return;
    const joy = tanlangan.length;
    uch(orRef.current[i], uyaRef.current[joy], `${ors[i].ga.nom} · ${ors[i].foiz == null ? '—' : ors[i].foiz + '%'}`);
    setTanlangan(t => [...t, i]);
  };
  const keyin = tanlangan.find(i => i !== yulduz);
  // --- 3 · Gipoteza
  const saqla = () => {
    const bosh = GIP_MAYDON.find(m => !String(gip[m.k] || '').trim());
    if (bosh) { setXato('g-' + bosh.k); return; }
    qadamYoz({ tur, qadamlar: qs, toxtash: [oraliqId(yulduz), oraliqId(keyin)], gipoteza: { agar: gip.agar.trim(), ozgaradi: gip.ozgaradi.trim(), chunki: gip.chunki.trim() }, sana: bugun() });
    setSaqlandi(true); setQism(3); setXato(null); setYordam(false);
  };
  const ixcham = (q, i) => `${q.nom} · ${q.soni}` + (i > 0 && ors[i - 1].foiz != null ? ` · ${tr({ uz: 'oldingisidan', ru: 'от предыдущего' })} — ${ors[i - 1].foiz}%` : '');
  const kattaMi = (i) => i > 0 && qs[i].soni != null && qs[i - 1].soni != null && qs[i].soni > qs[i - 1].soni;
  const yorliqMashq = tur === 'mashq' && <span className="do-mashq-b">{tr({ uz: 'mashq sonlari — Mentor misoli', ru: 'учебные числа — пример Ментора' })}</span>;
  const orHolat = (i) => {
    const t = tanlangan.includes(i);
    return { holat: 'ochiq', darhol: qism !== 0, tus: t ? 'err' : undefined, belgi: t && yulduz === i ? '★' : t && yulduz >= 0 ? tr({ uz: 'Keyin', ru: 'Потом' }) : undefined };
  };
  const toxtashUst = tanlangan.map(i => i + 1);
  const ustunlar = (bos) => <QsUstunlar qadamlar={qs} kichik={!bos} darhol={qism !== 0} orRef={orRef} oraliq={ors.map(o => orHolat(o.i))} toxtash={qism >= 2 || bos ? toxtashUst : []}
    onOraliq={bos ? orBos : undefined} yorliq={yorliqMashq || undefined} />;
  const ixchamQism = (n) => {
    if (n === 0) return <button type="button" className="do-ok" onClick={() => { setQism(0); setXato(null); }}><i>✓</i><span>1 · {tr({ uz: 'Sonlar', ru: 'Числа' })}: {qs.map(q => `${q.nom} ${q.soni}`).join(' · ')}</span></button>;
    const y = ors[yulduz], k = ors[keyin];
    return <button type="button" className="do-ok" onClick={() => { setQism(1); setXato(null); }}><i>✓</i><span>2 · {tr({ uz: "To'xtash", ru: 'Остановка' })}: ★ {y ? `${y.ga.nom} ${y.foiz}%` : ''}{k ? ` · ${tr({ uz: 'Keyin', ru: 'Потом' })}: ${k.ga.nom} ${k.foiz}%` : ''}</span></button>;
  };
  const yordamTugma = <QTugma ikkinchi className="do-yordam-btn" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>;
  const yordamMatn = yordam && <p className="do-yordam fade-step">{tr(S6_YORDAM)}</p>;
  let forma;
  if (isMentor) {
    const m = mentorQadamlar();
    forma = (
      <div className="do-fokus">
        <QsUstunlar qadamlar={m} darhol toxtash={[1, 2]} oraliq={[0, 1, 2].map(i => ({ holat: 'ochiq', darhol: true, tus: i < 2 ? 'err' : undefined, belgi: i === 0 ? '★' : i === 1 ? tr({ uz: 'Keyin', ru: 'Потом' }) : undefined }))} yorliq={tr(MENTOR_YORLIQ)} />
        <p className="do-gap"><b>★ {m[1].nom} · 59%</b> {mentorGap()}</p>
      </div>
    );
  } else if (tugadi) {
    const y = ors[yulduz];
    forma = (
      <div className="do-fokus">
        <div className="do-natija-k">
          <div className="do-natija-q">{ustunlar(false)}<button type="button" className="do-tahrir" onClick={() => tahrir(0)} aria-label={tr({ uz: 'Sonlarni tahrirlash', ru: 'Редактировать числа' })}>✎</button></div>
          <div className="do-natija-q"><span className="do-yulduz">★ {y ? `${y.ga.nom} · ${y.foiz}%` : ''}</span><button type="button" className="do-tahrir" onClick={() => setQism(1)} aria-label={tr({ uz: 'Tanlovni tahrirlash', ru: 'Редактировать выбор' })}>✎</button></div>
          <div className="do-natija-q"><p className="do-gap">{gapYig(gip)}</p><button type="button" className="do-tahrir" onClick={() => setQism(2)} aria-label={tr({ uz: 'Gipotezani tahrirlash', ru: 'Редактировать гипотезу' })}>✎</button></div>
        </div>
        <QXulosa>{tr({ uz: "Sonlaringiz saqlandi: ikki to'xtab qolish qadami topildi, biri uchun gipoteza yozildi.", ru: 'Ваши числа сохранены: найдены два шага остановки, для одного написана гипотеза.' })}</QXulosa>
      </div>
    );
  } else if (qism === 0) {
    const toliq = karta.nom.trim() && sonOk(karta.soni);
    const oldingi = tahrirI != null ? qs[tahrirI - 1] : qs[qs.length - 1];
    const jonliFoiz = toliq && oldingi && (tahrirI == null || tahrirI > 0) ? foiz(Number(karta.soni), oldingi.soni) : null;
    const yetarli = qatorlar.length >= 3;
    const kartaKor = tahrirI != null || qatorlar.length < 5;
    forma = (
      <div className="do-s6">
        {qs.length > 0 && ustunlar(false)}
        {qs.length > 0 && <div className="do-oklar">
          {qs.map((q, i) => (i === tahrirI ? null : (
            <div key={i} className="do-ok-q">
              <button type="button" ref={el => { qatorRef.current[i] = el; }} className={cxx('do-ok', yangi === i && 'yangi')} onClick={() => tahrir(i)} aria-label={`${q.nom} · ${tr({ uz: 'tahrirlash', ru: 'редактировать' })}`}><i>✓</i><span>{ixcham(q, i)}</span></button>
              {kattaMi(i) && <QXato>{tr(S6_XATO.katta)}</QXato>}
            </div>
          )))}
        </div>}
        {kartaKor && (
          <div key={'k' + (tahrirI ?? qatorlar.length)} ref={kartaRef} className={cxx('do-karta', 'do-kirish', (xato === 'nom' || xato === 'son') && 'err')}>
            <span className="q-yorliq">1 · {tr({ uz: 'Sonlar', ru: 'Числа' })} · {(tahrirI ?? qatorlar.length) + 1} / {Math.max(3, qatorlar.length + (tahrirI == null ? 1 : 0))}</span>
            <label className={cxx('do-mz', xato === 'nom' && 'err', !karta.nom.trim() && 'do-halqa-i')}>
              <span className="do-mz-n">{(tahrirI ?? qatorlar.length) + 1}</span>
              <input className="do-inp" value={karta.nom} maxLength={40} placeholder={tr({ uz: 'Qadam nomi', ru: 'Название шага' })} aria-label={tr({ uz: 'Qadam', ru: 'Шаг' })} onChange={(e) => { setKarta(k => ({ ...k, nom: e.target.value })); setXato(null); }} />
            </label>
            <label className={cxx('do-mz', 'son', xato === 'son' && 'err', karta.nom.trim() && !karta.soni && 'do-halqa-i')}>
              <span className="do-mz-n">#</span>
              <input className="do-inp" value={karta.soni} inputMode="numeric" maxLength={6} placeholder={tr({ uz: 'Nechta qurilma', ru: 'Сколько устройств' })} aria-label={tr({ uz: 'Nechta qurilma', ru: 'Сколько устройств' })} onChange={(e) => { setKarta(k => ({ ...k, soni: e.target.value.replace(/\D/g, '').slice(0, 6) })); setXato(null); }} onKeyDown={(e) => { if (e.key === 'Enter') qosh(); }} />
              {jonliFoiz != null && <span className="do-mz-y fade-step">{tr({ uz: 'oldingisidan', ru: 'от предыдущего' })} — {jonliFoiz}%</span>}
            </label>
            {(xato === 'nom' || xato === 'son') && <QXato>{tr(S6_XATO[xato])}</QXato>}
            {yordamMatn}
            <div className="do-karta-tug">
              {yetarli && tahrirI == null
                ? <><QTugma className="do-halqa" onClick={toxtashga}>2 · {tr({ uz: "To'xtash", ru: 'Остановка' })} ›</QTugma><QTugma ikkinchi onClick={qosh}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma></>
                : <QTugma className={cxx(toliq && 'do-halqa')} onClick={qosh}>{tahrirI != null ? tr({ uz: 'Saqlash', ru: 'Сохранить' }) : tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>}
              {yordamTugma}
            </div>
          </div>
        )}
        {!kartaKor && <div className="do-karta-tug"><QTugma className="do-halqa" onClick={toxtashga}>2 · {tr({ uz: "To'xtash", ru: 'Остановка' })} ›</QTugma>{yordamTugma}</div>}
        {!kartaKor && yordamMatn}
        {qatorlar.length === 0 && tahrirI == null && <button type="button" className="do-xulq" onClick={mashq}>{tr({ uz: "Sonlarim hali yo'q", ru: 'Моих чисел пока нет' })}</button>}
      </div>
    );
  } else if (qism === 1) {
    const ikki = tanlangan.length === 2;
    const uzoq = tanlangan.filter(i => !past.includes(i));
    forma = (
      <div className="do-s6">
        {ixchamQism(0)}
        <p className="do-kirish-q">{tr({ uz: "Foizi eng past ikki oraliqni bosing. Qaysi biridan boshlashni o'zingiz tanlaysiz.", ru: 'Нажмите два промежутка с самым низким процентом. С какого начать — выбираете сами.' })}</p>
        <div className="do-karta">{ustunlar(true)}</div>
        <div className="do-uyalar">
          {[0, 1].map(j => {
            const i = tanlangan[j];
            const o = i != null ? ors[i] : null;
            const yl = o && yulduz === i;
            return (
              <div key={j} ref={el => { uyaRef.current[j] = el; }} className={cxx('do-uya', o && 'tola', yl && 'yulduz')}>
                {o ? <>
                  <b className="do-uya-t">{yl ? '★ ' : ''}{o.ga.nom} · {o.foiz == null ? '—' : o.foiz + '%'}</b>
                  {ikki && yulduz < 0 && <button type="button" className="do-uya-b" onClick={() => setYulduz(i)}>★ {tr({ uz: 'Avval shuni tuzataman', ru: 'Сначала исправлю это' })}</button>}
                  {yulduz >= 0 && !yl && <span className="do-keyin">{tr({ uz: 'Keyin', ru: 'Потом' })}</span>}
                </> : <span className="do-uya-y">{tr({ uz: "to'xtab qolish qadami", ru: 'шаг остановки' })}</span>}
              </div>
            );
          })}
        </div>
        {uzoq.length > 0 && <QXato>{tr(S6_XATO.oraliq)}</QXato>}
        {yordamMatn}
        <div className="do-karta-tug">
          <QTugma className={cxx(ikki && yulduz >= 0 && 'do-halqa')} disabled={!(ikki && yulduz >= 0)} onClick={() => { setQism(2); setXato(null); setYordam(false); }}>3 · {tr({ uz: 'Gipoteza', ru: 'Гипотеза' })} ›</QTugma>
          {yordamTugma}
        </div>
      </div>
    );
  } else {
    const y = ors[yulduz];
    const ozM = String(gip.ozgaradi).trim().length >= 6 && !qadamTilga(gip.ozgaradi, qs);
    const ikkiM = IKKI_RE.test(normS(gip.agar));
    const hammasi = GIP_MAYDON.every(m => String(gip[m.k] || '').trim());
    forma = (
      <div className="do-s6">
        {ixchamQism(0)}
        {ixchamQism(1)}
        <div className="do-karta do-kirish" key="g">
          <span className="do-yulduz">★ {y ? `${y.ga.nom} · ${y.foiz == null ? '—' : y.foiz + '%'}` : ''}</span>
          {GIP_MAYDON.map((m, j) => {
            const bosh = !String(gip[m.k] || '').trim();
            const oldin = GIP_MAYDON.slice(0, j).every(x => String(gip[x.k] || '').trim());
            const gx = xato === 'g-' + m.k;
            return (
              <React.Fragment key={m.k}>
                <label className={cxx('do-mz', gx && 'err', bosh && oldin && 'do-halqa-i')}>
                  <span className="do-mz-n">{tr(m.b)}</span>
                  <input className="do-inp" value={gip[m.k]} maxLength={140} placeholder={tr(m.p)} aria-label={tr(m.b)} onChange={(e) => { const v = e.target.value; setGip(g => ({ ...g, [m.k]: v })); setXato(null); }} />
                </label>
                {m.k === 'agar' && ikkiM && <QXato>{tr(S6_XATO.ikki)}</QXato>}
                {m.k === 'ozgaradi' && ozM && <QXato>{tr(S6_XATO.ozgaradi)}</QXato>}
              </React.Fragment>
            );
          })}
          <p className="do-gap kulrang">{gapYig(gip)}</p>
          {yordamMatn}
          <div className="do-karta-tug">
            <QTugma className={cxx(hammasi && 'do-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
            {yordamTugma}
          </div>
        </div>
      </div>
    );
  }
  const navL = done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Sonlarni kiriting (${Math.min(qism, 2) + 1}/3)`, ru: `Введите числа (${Math.min(qism, 2) + 1}/3)` };
  const qadamlarT = [`1 · ${tr({ uz: 'Sonlar', ru: 'Числа' })}`, `2 · ${tr({ uz: "To'xtash", ru: 'Остановка' })}`, `3 · ${tr({ uz: 'Gipoteza', ru: 'Гипотеза' })}`];
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qism * 10 + qatorlar.length + tanlangan.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={tr(navL)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sizning ilovangizda odamlar <A>qayerda to'xtab qolyapti?</A></>, ru: <>Где в вашем приложении <A>люди останавливаются?</A></> })}
        mentor={<Mentor>{tr({ uz: "Sanoq sahifangizdagi sonlarni qadamlar tartibida kiriting — foizni ekran o'zi hisoblaydi, tanlovni siz qilasiz.", ru: 'Введите числа со своей страницы подсчёта в порядке шагов — процент экран посчитает сам, выбор делаете вы.' })}</Mentor>}
        qadamlar={!isMentor && !tugadi && <>
          <p className="do-kirish-q">{tr({ uz: "Sonlaringiz kichik bo'lsa ham kiriting: topilgan joy — taxmin, isbot emas.", ru: 'Вводите, даже если числа маленькие: найденное место — предположение, не доказательство.' })}</p>
          <QQadamlar qadamlar={qadamlarT} joriy={Math.min(qism, 2)} />
        </>}
        forma={forma}
      >
        <MentorPracticeStats live={live} screen={screen} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen → QTest; ✔ A, INLINE_KEYS.s8 = 0; savol ustida kichik holat kartasi) =====
const HolatKarta = () => (
  <div className="do-mashq">
    <span className="do-mashq-q">
      <span className="do-mashq-k"><span>{tr({ uz: 'Tuzatish', ru: 'Исправление' })}</span><b className="ok">{tr({ uz: 'tekshirildi ✓', ru: 'проверено ✓' })}</b></span>
      <span className="do-mashq-k"><span>{tr({ uz: 'Yangi versiya', ru: 'Новая версия' })}</span><b className="ok">{tr({ uz: 'chiqdi ✓', ru: 'вышла ✓' })}</b></span>
      <span className="do-mashq-k"><span>{tr({ uz: 'Keyingi kunlardagi sonlar', ru: 'Числа следующих дней' })}</span><b>—</b></span>
    </span>
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    ustida={<HolatKarta />}
    questionText="Tuzatish tekshirildi va odamlarga chiqdi. Gipoteza to'g'ri ekani bilindimi?"
    question={tr({ uz: <h2 className="title h-ask">Tuzatish tekshirildi va odamlarga chiqdi. <A>Gipoteza to'g'ri ekani bilindimi?</A></h2>, ru: <h2 className="title h-ask">Исправление проверено и вышло к людям. <A>Стало ли известно, что гипотеза верна?</A></h2> })}
    options={[
      { uz: "Yo'q — buni keyingi kunlarning sonlari aytadi", ru: 'Нет — это скажут числа следующих дней' },
      { uz: "Ha — tuzatish chiqdi, demak gipoteza to'g'ri", ru: 'Да — исправление вышло, значит гипотеза верна' },
      { uz: "Ha — agent «tuzatdim» dedi, shuning o'zi yetadi", ru: 'Да — агент сказал «исправил», этого достаточно' },
      { uz: "Yo'q — gipotezani endi tekshirib bo'lmaydi", ru: 'Нет — гипотезу теперь не проверить' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Tuzatish — ish fakti. Gipotezani keyingi sonlar aytadi.', ru: 'Исправление — факт работы. О гипотезе скажут следующие числа.' }}
    explainWrong={{
      1: { uz: 'Chiqqan tuzatish — ish. Keyingi sonlar hali bormi?', ru: 'Вышедшее исправление — это работа. Следующие числа уже есть?' },
      2: { uz: "Agentning so'zi — da'vo. Sonlar nima deydi?", ru: 'Слова агента — заявление. Что скажут числа?' },
      3: { uz: "Keyingi kunlarda sanoq sahifasi nimani ko'rsatadi?", ru: 'Что покажет страница подсчёта в следующие дни?' },
      default: { uz: 'Tuzatish — ish fakti. Gipotezani keyingi sonlar aytadi.', ru: 'Исправление — факт работы. О гипотезе скажут следующие числа.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar) — qilingan ish uchun (§184); bonus ikkitasi — bloklar oxirgi «Bajardim»i (P-048) =====
const ACHIEVEMENTS = {
  dropoffFinder: { icon: '🔎', name: 'Drop-off Finder!', desc: { uz: 'Foizi eng past oraliqni birinchi urinishda topdingiz', ru: 'С первой попытки нашли промежуток с самым низким процентом' } },
  liveCounter: { icon: '📊', name: 'Live Counter!', desc: { uz: "Sanoq sahifangiz kalit bilan ochiladi va o'zi yangilanadi", ru: 'Ваша страница подсчёта открывается по ключу и обновляется сама' } },
  hypothesisReady: { icon: '💡', name: 'Hypothesis Ready!', desc: { uz: "O'z sonlaringizdan to'xtab qolish qadamini topib, gipoteza yozdingiz", ru: 'По своим числам нашли шаг остановки и написали гипотезу' } },
  newVersion: { icon: '🚀', name: 'New Version!', desc: { uz: "Tuzatishni o'zingiz tekshirib, yangi versiyani chiqardingiz", ru: 'Сами проверили исправление и выпустили новую версию' } },
};
// Ekran id → nishon: s3 — birinchi urinishda to'g'ri · a1 — oxirgi «Bajardim» · s6 — «Saqlash» · a2 — «Yangi versiya chiqdi» (08-FILTR 21; tekin emas)
const ACH_TRIGGERS = { s3: 'dropoffFinder', a1: 'liveCounter', s6: 'hypothesisReady', a2: 'newVersion' };

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
  3: { uz: '1 — Eng past foiz', ru: '1 — Самый низкий процент' },
  8: { uz: '2 — Gipoteza va sonlar', ru: '2 — Гипотеза и числа' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z atamalari (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'qadamlar', ru: 'шаги' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'foiz', ru: 'процент' }, l: 70, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: { uz: "to'xtab qolish qadami", ru: 'шаг остановки' }, l: 6, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'sanoq sahifasi', ru: 'страница подсчёта' }, l: 66, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'maxfiy kalit', ru: 'секретный ключ' }, l: 44, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'gipoteza', ru: 'гипотеза' }, l: 58, t: 28, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: "mehmon ko'rinishi", ru: 'гостевой вид' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'yangi versiya', ru: 'новая версия' }, l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: 'APK', l: 84, t: 40, s: 22, d: 22, dl: 0.6 },
  { ch: 'Maydon Jamoa', l: 34, t: 58, s: 22, d: 24, dl: 1.4 },
  { ch: '59%', l: 76, t: 88, s: 22, d: 26, dl: 2.6 },
  { ch: '44%', l: 90, t: 20, s: 26, d: 19, dl: 0.2 },
];
// ⚡ Mustahkamlash-jang — 12 savol, ✔ o'rni MD dagidek: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Sinfdoshingiz sanoq sahifasi manzilini bilib oldi. U sonlarni ko\'radimi?', ru: 'Одноклассник узнал адрес страницы подсчёта. Увидит ли он числа?' }, opts: [{ uz: 'Yo\'q: kalitsiz sonlar chiqmaydi', ru: 'Нет: без ключа чисел не будет' }, { uz: "Ha: manzilni bilgan har kim ko'radi", ru: 'Да: видит любой, кто знает адрес' }, { uz: 'Ha: lending hammaga ochiq turibdi', ru: 'Да: лендинг открыт для всех' }, { uz: "Ha, ilovani o'rnatgan bo'lsa ko'radi", ru: 'Да, если он установил приложение' }], correct: 0 },
  { q: { uz: "Render'dagi Backend `SANOQ_KALITI` ni qayerdan oladi?", ru: 'Откуда Backend на Render берёт `SANOQ_KALITI`?' }, opts: [{ uz: 'Backend kodiga yozilgan qatordan', ru: 'Из строки, записанной в коде Backend' }, { uz: "Xizmatning Environment bo'limidan", ru: 'Из раздела Environment сервиса' }, { uz: "Repo'dagi README faylining ichidan", ru: 'Из файла README в репозитории' }, { uz: 'Lending sahifasining kodi ichidan', ru: 'Из кода страницы лендинга' }], correct: 1 },
  { q: { uz: "Sanoq sahifasi o'zi qanday yangilanadi?", ru: 'Как страница подсчёта обновляется сама?' }, opts: [{ uz: "Har 5 soniyada Backend'dan qayta-qayta so'raydi", ru: 'Каждые 5 секунд снова и снова спрашивает Backend' }, { uz: "Ega sahifani o'zi qo'lda yangilab o'tiradi", ru: 'Владелец сам обновляет страницу вручную' }, { uz: "Ulanish orqali Backend aytadi, sahifa so'raydi", ru: 'Backend сообщает через соединение, страница запрашивает' }, { uz: "Ilova sonlarni sahifaga o'zi yozib boradi", ru: 'Приложение само пишет числа на страницу' }], correct: 2 },
  { q: { uz: "20 qurilmadan 15 tasi keyingi qadamga o'tdi. Foiz qancha?", ru: 'Из 20 устройств 15 перешли на следующий шаг. Сколько процентов?' }, opts: [{ uz: '15 foiz', ru: '15 процентов' }, { uz: '20 foiz', ru: '20 процентов' }, { uz: '5 foiz', ru: '5 процентов' }, { uz: '75 foiz', ru: '75 процентов' }], correct: 3 },
  { q: { uz: 'Yangi telefonda ilovani uch marta ochdingiz. `ochdi` qancha oshadi?', ru: 'Вы открыли приложение на новом телефоне три раза. На сколько вырастет `ochdi`?' }, opts: [{ uz: 'Bittaga: turli qurilmalar sanaladi', ru: 'На один: считаются разные устройства' }, { uz: 'Uchtaga: har ochish alohida sanaladi', ru: 'На три: каждое открытие считается отдельно' }, { uz: 'Oshmaydi: egasi sanoqqa kirmaydi', ru: 'Не вырастет: владелец не считается' }, { uz: 'Ikkitaga: birinchi ochish sanalmaydi', ru: 'На два: первое открытие не считается' }], correct: 0 },
  { q: { uz: "Sanoqda «ro'yxatdan o'tdi» — 30, Database'da — 28. Nima deysiz?", ru: 'В подсчёте «зарегистрировался» — 30, в Database — 28. Что скажете?' }, opts: [{ uz: "Ikkalasi bir narsa, farqini o'chiramiz", ru: 'Это одно и то же, разницу уберём' }, { uz: "O'lchovi boshqa: qurilma va akkaunt", ru: 'Мера разная: устройство и аккаунт' }, { uz: 'Biri xato, qaysi biri ekanini qidiramiz', ru: 'Одно ошибочно, ищем, какое' }, { uz: "Teng bo'lishi shart, bo'lmasa sanoq xato", ru: 'Должны совпадать, иначе подсчёт неверен' }], correct: 1 },
  { q: { uz: "2016-yilda Netflix aytishicha, ko'rishlarning qariyb 80 foizi qayerdan keladi?", ru: 'По словам Netflix в 2016 году, откуда приходят почти 80 процентов просмотров?' }, opts: [{ uz: 'Qidiruv qatoridan', ru: 'Из строки поиска' }, { uz: 'Reklama oynalaridan', ru: 'Из рекламных окон' }, { uz: 'Tavsiyalar qatoridan', ru: 'Из ряда рекомендаций' }, { uz: "Do'stlar havolasidan", ru: 'По ссылкам друзей' }], correct: 2 },
  { q: { uz: "Bu darsda nechta to'xtab qolish qadami tuzatiladi?", ru: 'Сколько шагов остановки исправляют на этом уроке?' }, opts: [{ uz: 'Ikkalasi ham, birdaniga', ru: 'Оба, сразу' }, { uz: 'Hech biri, avval kutiladi', ru: 'Ни одного, сначала ждут' }, { uz: 'Uchalasi ham, navbat bilan', ru: 'Все три, по очереди' }, { uz: 'Bittasi, ikkinchisi keyin', ru: 'Один, второй потом' }], correct: 3 },
  { q: { uz: "Mentor misolida kirmagan odam «Qo'shilaman»ni bossa, nima ochiladi?", ru: 'Что откроется в примере Ментора, если невошедший нажмёт «Присоединяюсь»?' }, opts: [{ uz: "«Ro'yxatdan o'tish» ekrani", ru: 'Экран «Регистрация»' }, { uz: "«O'yin to'ldi» degan yozuv", ru: 'Надпись «Игра заполнена»' }, { uz: "O'yinchilar ismlari ro'yxati", ru: 'Список имён игроков' }, { uz: "Ilovaning o'rnatish fayli", ru: 'Файл установки приложения' }], correct: 0 },
  { q: { uz: "Mehmon ko'rinishi APK o'rnatgan telefonda qachon chiqadi?", ru: 'Когда гостевой вид появится на телефоне с установленным APK?' }, opts: [{ uz: '`git push` qilinishi bilanoq', ru: 'Сразу после `git push`' }, { uz: "Yangi faylni o'rnatgandan keyin", ru: 'После установки нового файла' }, { uz: 'Render qayta ishga tushganda', ru: 'Когда Render перезапустится' }, { uz: 'Ilovani yopib, qaytadan ochganda', ru: 'Когда закроют и снова откроют приложение' }], correct: 1 },
  { q: { uz: "Gipotezaning «chunki» qismi nimani aytadi?", ru: 'Что говорит часть гипотезы «потому что»?' }, opts: [{ uz: "Qaysi ekranda nima o'zgarishini", ru: 'Что изменится на каком экране' }, { uz: 'Tuzatishga qancha vaqt ketishini', ru: 'Сколько времени займёт исправление' }, { uz: 'Nega shunday kutayotganimizni', ru: 'Почему мы этого ждём' }, { uz: 'Tuzatishni kim yozib berishini', ru: 'Кто напишет исправление' }], correct: 2 },
  { q: { uz: "Agent «tuzatdim» dedi. Birinchi nima qilasiz?", ru: 'Агент сказал «исправил». Что сделаете первым?' }, opts: [{ uz: "Yangi o'rnatish faylini tayyorlaysiz", ru: 'Подготовите новый файл установки' }, { uz: "Lendingga yangi havolani qo'yib qo'yasiz", ru: 'Поставите новую ссылку на лендинг' }, { uz: 'Gipotezani isbotlandi deb yozib qo\'yasiz', ru: 'Запишете, что гипотеза доказана' }, { uz: "Ilovada tuzatishni o'zingiz tekshirasiz", ru: 'Сами проверите исправление в приложении' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 bo'lim, hammasi o'quvchining o'z repo'sida (5-bo'lim yo'q). steps [{ h, t (node), prompt?: { satrlar, namuna, toldir }, yordam?: [satr] }].
// Qolipda yo'q (qolip taklifi): {…} yonida kulrang «masalan: …», prompt ✎ tahriri, bo'lim ichidagi «Yordam», tanlovlar, «Ulgurmasangiz» qatori, trek tanlovi — shu faylda (src/qolip ga tegilmaydi).
// Blok bayrog'i — faqat oxirgi (tekshiruv) «Bajardim»idan (tayanch 9.36 h); 3-bo'limdan keyin «Davom etish» ochiladi (E 55), bayroq qo'yilmaydi.
// Bo'lim ichida faqat <span> (QBlok matnni <p> ichida chizadi — <div>/<p> ichma-ich bo'lmasin).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-08-done'];
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const Bq = ({ children, k }) => <span className={cxx('do-band', k)}>{fmtCode(children)}</span>;
const DoPrompt = ({ satrlar, namuna = {}, toldir = {}, kim }) => {
  const asl = satrlar.map(l => { let s = tr(l); Object.entries(toldir).forEach(([j, v]) => { if (v) s = s.split(j).join(v); }); return s; });
  const [tahrir, setTahrir] = useState(false);
  const [matn, setMatn] = useState(null);
  const [ok, setOk] = useState(false);
  const qator = matn != null ? matn.split('\n') : asl;
  const korildi = new Set();
  const joy = (t, li) => t.split(/(\{[^}]+\})/g).map((p, i) => {
    if (!/^\{.+\}$/.test(p)) return <React.Fragment key={li + '-' + i}>{fmtCode(p)}</React.Fragment>;
    const nm = namuna[p] && !korildi.has(p) ? namuna[p] : null;
    if (nm) korildi.add(p);
    return <React.Fragment key={li + '-' + i}><span className="q-joy">{p}</span>{nm && <span className="do-joy-n">{fmtCode(tr(nm))}</span>}</React.Fragment>;
  });
  const nusxa = async () => { try { await navigator.clipboard.writeText(qator.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt">
      <span className="q-prompt-h">
        <span className="q-prompt-kim">{kim || tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span>
        <span className="do-prompt-tug">
          <button type="button" className="do-prompt-ed" aria-expanded={tahrir} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })} onClick={() => { if (matn == null) setMatn(asl.join('\n')); setTahrir(x => !x); }}>✎</button>
          <button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button>
        </span>
      </span>
      {tahrir
        ? <textarea className="do-prompt-ta" value={matn ?? ''} rows={Math.min(12, Math.max(3, qator.length + 2))} aria-label={tr({ uz: 'Prompt matni', ru: 'Текст промпта' })} onChange={(e) => setMatn(e.target.value)} />
        : qator.map((l, i) => <span key={i} className="do-ps">{joy(l, i)}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [o, setO] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="do-yordam-btn" aria-expanded={o} onClick={() => setO(x => !x)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {o && <span className="do-yordam-p fade-step"><span className="do-yp-y">{tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })}</span>{satrlar.map((l, i) => <span key={i} className="do-yp">{fmtCode(tr(l))}</span>)}</span>}
    </>
  );
};
const TrekTanlov = ({ trek, onTanla }) => (trek ? null : (
  <div className="do-trek fade-step"><span>{tr({ uz: 'Trekingiz:', ru: 'Ваш трек:' })}</span>
    <div className="do-chorla">{[['mobil', { uz: 'Mobil trek', ru: 'Мобильный трек' }], ['web', { uz: 'Web-trek', ru: 'Веб-трек' }]].map(([k, t]) => <QChip key={k} onClick={() => onTanla(k)}>{tr(t)}</QChip>)}</div>
  </div>
));
// yakunTogri — oxirgi «Bajardim» nishon beradimi (A2 da — yo'q: nishon «Yangi versiya chiqdi» tanlanganda, 08-FILTR 21) · onTugadi — oxirgi «Bajardim» · keyin — blok tugagach bo'limlar ostida
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, eyebrow, title, mentor, steps, natija, doneText, ulgur, ulgurQadam = 3, ortda, ustida, pastQator, yakunTogri = true, onTugadi, keyin }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam || isMentorLive;
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length) {
      if (onTugadi) onTugadi();
      if (!avval) {
        onAnswer(screen, { ...(storedAnswer || {}), stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: !!yakunTogri, picked: true });
        if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
      }
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.do-keyin-q') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, bo'limlar orasida keyingi bo'lim, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi bo'lim — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий раздел — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="do-blok">
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<><Mentor>{tr(mGap)}</Mentor>{ustida}</>} zoom={Zoomable}
          qadamlar={steps.map(c => ({
            h: tr(c.h),
            t: <>{c.t}{c.prompt && <DoPrompt satrlar={c.prompt.satrlar} namuna={c.prompt.namuna} toldir={c.prompt.toldir} />}</>,
            xato: c.yordam ? <Yordam satrlar={c.yordam} /> : null
          }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={doneText ? tr(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{(done || isMentorLive) && keyin}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {pastQator}
          {ulgur && !done && <p className="do-ulgur">{fmtCode(tr(ulgur))}</p>}
          {ortda && <p className="do-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini alohida papkada oching:', ru: 'Отстали — откройте пример Ментора в отдельной папке:' })} <code className="do-buyruq">{ORTDA[0]}</code> · <code className="do-buyruq">{ORTDA[1]}</code> · <code className="do-buyruq">{ORTDA[2]}</code> {fmtCode(tr(ortda))}</p>}
        </QBlok>
      </div>
    </Stage>
  );
}
const WebQator = ({ children }) => <p className="do-web"><b>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}:</b> {fmtCode(children)}</p>;

// ===== AMALIYOT 1 — sanoq sahifasi (screens[4]; tayanch 1.8, 3; talab zinapoyasi: tayyor talab + bitta joy {nimani sanasin}) =====
const A1_PROMPT = [
  { uz: "Qayerda: Backend — yangi yo'l `GET /hodisalar/sanoq` va real vaqt ulanishi; `lending/` — yangi sahifa `sanoq.html`.", ru: 'Где: Backend — новый путь `GET /hodisalar/sanoq` и соединение в реальном времени; `lending/` — новая страница `sanoq.html`.' },
  { uz: "Nima qilsin: `GET /hodisalar/sanoq` `hodisalar` jadvalidan {nimani sanasin} bersin (`?dan=` vaqt berilsa — shu vaqtdan keyingi yozuvlar bo'yicha); yonida — ro'yxatdan o'tgan akkauntlar soni, namuna va tekshiruv akkauntlarisiz (7-darsdagi `namuna` belgisi bo'yicha).", ru: 'Что сделать: `GET /hodisalar/sanoq` пусть отдаёт из таблицы `hodisalar` {nimani sanasin} (если передано время `?dan=` — по записям после этого времени); рядом — число зарегистрированных аккаунтов без тестовых и проверочных (по отметке `namuna` с 7-го урока).' },
  { uz: "Kalit so'rov sarlavhasida kelsin; kalit bo'lmasa yoki `.env` dagi `SANOQ_KALITI` bilan mos kelmasa — `401`.", ru: 'Ключ приходит в заголовке запроса; если ключа нет или он не совпадает с `SANOQ_KALITI` в `.env` — `401`.' },
  { uz: "`lending/sanoq.html` avval kalitni so'rasin, keyin sonlarni qadamlar tartibida ko'rsatsin; kalit faqat ochiq sahifada tursin — sahifa yangilansa, qayta so'ralsin.", ru: '`lending/sanoq.html` сначала спрашивает ключ, потом показывает числа в порядке шагов; ключ живёт только в открытой странице — после обновления спрашивается снова.' },
  { uz: "Sahifa o'zi yangilansin: ulanayotganda kalitni yuborsin; kalit to'g'ri bo'lsa, Backend uni faqat `sanoq` xonasiga qo'shsin — o'yin xonalari va foydalanuvchi harakatlariga emas; `hodisalar` ga yangi yozuv saqlanib tugagach shu xonaga `sanoq-ozgardi` yuborsin, sahifa sonlarni qayta so'rasin.", ru: 'Страница обновляется сама: при подключении отправляет ключ; если ключ верный, Backend добавляет её только в комнату `sanoq` — не в игровые комнаты и не к действиям пользователей; после сохранения новой записи в `hodisalar` отправляет в эту комнату `sanoq-ozgardi`, страница заново запрашивает числа.' },
  { uz: "Backend {lending manzili} dan kelgan so'rov va ulanishni ham qabul qilsin (oldingi manzillar ham qolsin). README dagi o'zgaruvchilar ro'yxatiga `SANOQ_KALITI` nomini qiymatsiz qo'sh.", ru: 'Backend принимает запросы и подключения и с {lending manzili} (прежние адреса тоже остаются). В список переменных в README добавь имя `SANOQ_KALITI` без значения.' },
  { uz: "Nima buzilmasin: ilova va uning ulanishi, `POST /hodisalar` va boshqa yo'llar avvalgidek ishlasin. `sanoq.html` ga lendingdan havola qo'yma, unda Umami bo'lmasin; sahifada faqat sonlar — ism, login va qurilma ID ko'rsatilmasin.", ru: 'Что не должно сломаться: приложение и его соединение, `POST /hodisalar` и другие пути работают как раньше. На `sanoq.html` не ставь ссылку с лендинга, Umami в ней нет; на странице только числа — имя, логин и ID устройства не показываются.' },
  { uz: "Kalitni kodga yozma, `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Ключ в код не пиши, `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
const A1_NAMUNA = {
  '{nimani sanasin}': { uz: "masalan: to'rt qadam — `ochdi`, `royxatdan-otdi`, `qoshildi`, `tasdiqladi`, shu tartibda; har birida turli qurilmalar soni.", ru: 'например: четыре шага — `ochdi`, `royxatdan-otdi`, `qoshildi`, `tasdiqladi`, в этом порядке; на каждом — число разных устройств.' },
  '{lending manzili}': { uz: "1-darsdagi manzilingizdan o'zi qo'yiladi; bo'lmasa — o'zingiz yozasiz.", ru: 'подставляется сам из вашего адреса с 1-го урока; если его нет — пишете сами.' }
};
const A1_YORDAM = [
  { uz: "Qayerda: `backend/` — yangi yo'l `GET /hodisalar/sanoq`, gateway va `POST /hodisalar`; `lending/` — yangi `sanoq.html`.", ru: 'Где: `backend/` — новый путь `GET /hodisalar/sanoq`, gateway и `POST /hodisalar`; `lending/` — новая `sanoq.html`.' },
  { uz: "Nima qilsin: `GET /hodisalar/sanoq` to'rt qadam uchun turli `qurilma_id` lar sonini bersin — `ochdi`, `royxatdan-otdi`, `qoshildi`, `tasdiqladi`, shu tartibda (`?dan=` vaqt berilsa — shu vaqtdan keyingi yozuvlar bo'yicha); yonida — `oyinchilar` dagi `namuna = false` akkauntlar soni.", ru: 'Что сделать: `GET /hodisalar/sanoq` отдаёт число разных `qurilma_id` для четырёх шагов — `ochdi`, `royxatdan-otdi`, `qoshildi`, `tasdiqladi`, в этом порядке (если передано время `?dan=` — по записям после него); рядом — число аккаунтов `namuna = false` в `oyinchilar`.' },
  { uz: "Kalit so'rov sarlavhasida kelsin; kalit bo'lmasa yoki `SANOQ_KALITI` bilan mos kelmasa — `401`.", ru: 'Ключ приходит в заголовке запроса; если ключа нет или он не совпадает с `SANOQ_KALITI` — `401`.' },
  { uz: "`lending/sanoq.html` — «Maydon Jamoa · sanoq»: avval kalit maydoni, keyin to'rt qadam va ro'yxatdan o'tgan akkauntlar; kalit faqat sahifa holatida, yangilansa qayta so'raladi.", ru: '`lending/sanoq.html` — «Maydon Jamoa · sanoq»: сначала поле ключа, потом четыре шага и зарегистрированные аккаунты; ключ только в состоянии страницы, после обновления спрашивается снова.' },
  { uz: "Gateway: ulanishda `auth` da kalit kelsa va to'g'ri bo'lsa — ulanish faqat `sanoq` xonasiga qo'shilsin (o'yin xonalari va o'yin yo'llariga kira olmaydi), noto'g'ri bo'lsa — yopilsin; ilovaning token bilan ulanishi o'zgarmasin. `POST /hodisalar` yangi qatorni yozib tugatgandan keyin `sanoq` xonasiga `sanoq-ozgardi` yuborsin; sahifa sonlarni qayta so'rasin.", ru: 'Gateway: если при подключении в `auth` пришёл верный ключ — подключение добавляется только в комнату `sanoq` (в игровые комнаты и игровые пути не попадает), если неверный — закрывается; подключение приложения с токеном не меняется. `POST /hodisalar` после записи новой строки отправляет в комнату `sanoq` `sanoq-ozgardi`; страница заново запрашивает числа.' },
  { uz: "Backend `maydon-jamoa-….netlify.app` (lending) dan kelgan so'rov va ulanishni ham qabul qilsin — brauzer ko'rinishi manzili ham qolsin. README dagi o'zgaruvchilar ro'yxatiga `SANOQ_KALITI` nomini qiymatsiz qo'sh.", ru: 'Backend принимает запросы и подключения и с `maydon-jamoa-….netlify.app` (лендинг) — адрес браузерной версии тоже остаётся. В список переменных в README добавь имя `SANOQ_KALITI` без значения.' },
  { uz: "Nima buzilmasin: ilova, real vaqt ulanishi, eslatma, `POST /hodisalar` va boshqa yo'llar avvalgidek ishlasin. `sanoq.html` ga lendingdan havola qo'yma, unda Umami bo'lmasin; sahifada ism, login va qurilma ID yo'q. Kalitni kodga yozma, `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не должно сломаться: приложение, соединение в реальном времени, напоминание, `POST /hodisalar` и другие пути работают как раньше. На `sanoq.html` не ставь ссылку с лендинга, Umami в ней нет; на странице нет имени, логина и ID устройства. Ключ в код не пиши, `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' }
];
// O'ng tomon: telefon chapda, brauzer o'ngda; bir marta o'zi yuradi — kalit → sonlar → yangi qurilma → «ochdi» 46 → 47 (sahifa yangilanmagan)
const NatijaA1 = () => {
  const f = useYurish([1400, 3200, 4400]);
  const qs = mentorQadamlar().map((q, i) => (i === 0 && f >= 3 ? { ...q, soni: q.soni + 1 } : q));
  return (
    <div className="do-natija">
      <div className="do-natija-r">
        <div className={cxx('do-yangi-tel', f >= 2 && 'on')}><QsTelefon ekran={f >= 2 ? 'kirish' : 'ochilish'} /><span className="do-tel-y">{tr({ uz: 'yangi qurilma', ru: 'новое устройство' })}</span></div>
        <div className="do-natija-br"><QsBrauzer holat={f >= 1 ? 'sanoq' : 'kalit'} qadamlar={qs} yangi={f >= 3 ? 0 : -1} /></div>
      </div>
      <code className="do-401">…onrender.com/hodisalar/sanoq → <b>401</b></code>
      <QIzoh>{tr({ uz: "Bu misolda «ro'yxatdan o'tdi» va Database'dagi son teng chiqdi — 27. Biri qurilmani, biri akkauntni sanaydi.", ru: 'В этом примере «зарегистрировался» и число в Database совпали — 27. Одно считает устройства, другое — аккаунты.' })}</QIzoh>
      <span className="do-kulrang">{tr({ uz: "Sonlar Mentor misolidan — sizda boshqacha. Ro'yxatdan o'tgan 27 akkauntdan 11 tasi — sinfdosh (Mentor bilganicha).", ru: 'Числа из примера Ментора — у вас будут другие. Из 27 зарегистрированных аккаунтов 11 — одноклассники (насколько знает Ментор).' })}</span>
    </div>
  );
};
const ScreenA1 = (props) => {
  const [trek, setTrek] = useState(trekOl);
  const [lend] = useState(() => lsO(LEND_KEY));
  const [reja] = useState(rejaOl);
  const manzil = lend && typeof lend.manzil === 'string' && lend.manzil.trim() ? lend.manzil.trim().replace(/\/+$/, '') : '';
  const royxat = reja && reja.royxat != null && reja.royxat !== '' ? reja.royxat : null;
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const web = trek !== 'mobil';
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>
      <Bq k="bir">{tr({ uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi.", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status`: изменённых файлов нет, `.env` в списке не виден.' })}</Bq>
      <Bq>{tr({ uz: "`backend/.env` ga yangi qator yozing: `SANOQ_KALITI=` va o'zingiz o'ylagan uzun kalit — harf va raqamlar; boshqa joyda ishlatadigan parolingiz emas. Shu nom va qiymatni Render'da xizmatingizning Environment bo'limiga qo'shib saqlang.", ru: 'Впишите в `backend/.env` новую строку: `SANOQ_KALITI=` и придуманный вами длинный ключ — буквы и цифры; не пароль, который вы используете где-то ещё. Это имя и значение добавьте и сохраните в разделе Environment вашего сервиса на Render.' })}</Bq>
      <Bq>{tr({ uz: "Kalitni agentga, chatga va repo'ga yozmang — agent faqat nomini biladi.", ru: 'Не пишите ключ агенту, в чат и в репозиторий — агент знает только имя.' })}</Bq>
      <Bq k="kulrang">{tr({ uz: "7-darsda qadamlar sanog'i yoqilmagan bo'lsa (`hodisalar` jadvali yo'q) — avval 7-darsdagi Amaliyot 2 ning 2 va 3-bo'limini bajaring; sanoq sahifasi shundan keyin quriladi.", ru: 'Если на 7-м уроке подсчёт шагов не включён (таблицы `hodisalar` нет) — сначала выполните разделы 2 и 3 Практики 2 с 7-го урока; страница подсчёта строится после этого.' })}</Bq>
    </> },
    { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>
      <Bq k="bir">{tr({ uz: "qavs ichini to'ldiring (kulrang namunaga qarang), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'заполните скобки (смотрите серый пример), нажмите «Скопировать», отправьте в Antigravity:' })}</Bq>
    </>, prompt: { satrlar: A1_PROMPT, namuna: A1_NAMUNA, toldir: manzil ? { '{lending manzili}': manzil } : {} }, yordam: A1_YORDAM },
    { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: <>
      <Bq k="bir">{tr({ uz: '`git diff` — o\'zgarish agent aytgan fayllardami. `git status` → `.env` ro\'yxatda yo\'q → har faylni `git add <fayl>` bilan → `git commit -m "8-dars: sanoq sahifasi"` → `git push`.', ru: '`git diff` — изменения в файлах, которые назвал агент? `git status` → `.env` в списке нет → каждый файл через `git add <fayl>` → `git commit -m "8-dars: sanoq sahifasi"` → `git push`.' })}</Bq>
      <Bq>{tr({ uz: "Render'da yangi deploy tugashini kuting (odatda bir necha daqiqa); lending Netlify'da push'dan keyin odatda o'zi yangilanadi (1-darsda repo bilan ulangan).", ru: 'Дождитесь окончания нового deploy на Render (обычно несколько минут); лендинг на Netlify после push обычно обновляется сам (на 1-м уроке связан с репозиторием).' })}</Bq>
      <Bq>{tr({ uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Tuzat.»' })}</Bq>
    </> },
    { h: { uz: 'Tekshirish', ru: 'Проверка' }, t: <>
      <Bq k="bir">{tr({ uz: "agent nima desa ham, o'zingiz tekshiring:", ru: 'что бы ни сказал агент, проверьте сами:' })}</Bq>
      <Bq>{tr({ uz: "(1) Brauzerda Render manzilingizga `/hodisalar/sanoq` qo'shib oching — sonlar emas, `401` chiqishi kerak: kalitsiz yopiq.", ru: '(1) Откройте в браузере свой адрес Render с `/hodisalar/sanoq` — должны появиться не числа, а `401`: без ключа закрыто.' })}</Bq>
      <Bq>{tr({ uz: "(2) Lending manzilingizga `/sanoq.html` qo'shib oching → kalitni kiriting: qadamlar sonlari va ro'yxatdan o'tgan akkauntlar soni chiqishi kerak. Noto'g'ri kalit bilan sonlar chiqmasligi kerak; sahifani yangilang — kalit qayta so'ralishi kerak. Kalitni bilgan har kim sahifani ochadi: kalit chiqib ketsa — `.env` va Render'da yangisini qo'ying.", ru: '(2) Откройте свой адрес лендинга с `/sanoq.html` → введите ключ: должны появиться числа шагов и число зарегистрированных аккаунтов. С неверным ключом чисел быть не должно; обновите страницу — ключ должны спросить снова. Страницу откроет любой, кто знает ключ: если ключ утёк — поставьте новый в `.env` и на Render.' })}</Bq>
      <Bq>{tr({ uz: "(3) Ilovangizni hali ochilmagan qurilmada oching — sherigingiz telefonida lendingdagi havoladan yoki laptopda brauzer ko'rinishida. Sanoq sahifasini yangilamang: «ochdi» bittaga oshishi kerak — odatda bir necha soniyada.", ru: '(3) Откройте приложение на устройстве, где его ещё не открывали, — на телефоне напарника по ссылке с лендинга или на ноутбуке в браузерной версии. Не обновляйте страницу подсчёта: «открыл» должно вырасти на один — обычно за несколько секунд.' })}</Bq>
      <Bq k="ich">{tr({ uz: "O'z telefoningiz allaqachon sanalgan — u sonni oshirmaydi: har qadamda turli qurilmalar sanaladi.", ru: 'Ваш телефон уже посчитан — он число не увеличит: на каждом шаге считаются разные устройства.' })}</Bq>
      {royxat != null && <Bq>{tr({ uz: `(4) 7-darsda yozgan soningiz shu yerda: «Ro'yxatdan o'tgan: ${royxat}${reja.sana ? ' · ' + reja.sana : ''}» — sahifadagi son bilan solishtiring. Sonlarni mustaqil ishda kiritasiz.`, ru: `(4) Ваше число с 7-го урока здесь: «Зарегистрировались: ${royxat}${reja.sana ? ' · ' + reja.sana : ''}» — сравните с числом на странице. Числа введёте в самостоятельной работе.` })}</Bq>}
      <Bq>{tr({ uz: "Mos kelmagan qatorni agentga yozing: «Shu qator talabga mos emas: {nima}. Tuzat.»", ru: 'Несовпадающую строку напишите агенту: «Shu qator talabga mos emas: {nima}. Tuzat.»' })}</Bq>
    </> }
  ];
  return (
    <ScreenBlok {...props} steps={steps}
      eyebrow={{ uz: 'Amaliyot 1 · sanoq sahifasi', ru: 'Практика 1 · страница подсчёта' }}
      title={{ uz: <>Qadamlar soni bitta <A>yopiq sahifada ko'rinsin.</A></>, ru: <>Пусть число шагов будет видно <A>на одной закрытой странице.</A></> }}
      mentor={{ uz: "Talab tayyor — qavs ichiga nimani va qanday sanashni yozasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — в скобки впишете, что и как считать; начните с «1 · Открыть».' }}
      ustida={<><TrekTanlov trek={trek} onTanla={tanla} /><QIzoh>{tr({ uz: "Qadamlar sonini maxfiy kalit bilan ko'rsatadigan sahifa sanoq sahifasi deyiladi. 10-Modulda uni dashboard degansiz.", ru: 'Страница, которая показывает число шагов по секретному ключу, называется страницей подсчёта. В 10-м модуле вы называли её dashboard.' })}</QIzoh></>}
      natija={<NatijaA1 />}
      doneText={{ uz: "Sanoq sahifasi faqat kalit bilan ochiladi va yangi qurilma kelganda o'zi yangilanadi.", ru: 'Страница подсчёта открывается только по ключу и сама обновляется, когда приходит новое устройство.' }}
      ulgur={{ uz: "Vaqt tugayaptimi — push qiling: «Davom etish» ochiladi, blok 4-bo'limdagi tekshiruvdan keyin bajarilgan sanaladi. Sonlarni hozircha Neon SQL Editor'dan oling: `SELECT nom, COUNT(DISTINCT qurilma_id) FROM hodisalar GROUP BY nom;` → «Run». Tekshirishni uyda qilasiz.", ru: 'Время кончается — сделайте push: «Продолжить» откроется, блок засчитается после проверки в разделе 4. Числа пока возьмите из Neon SQL Editor: `SELECT nom, COUNT(DISTINCT qurilma_id) FROM hodisalar GROUP BY nom;` → «Run». Проверку сделаете дома.' }}
      pastQator={web && <WebQator>{tr({ uz: "o'sha talab — «qurilma» o'rnida brauzer ID (`brauzer_id`, 10-Moduldagidek); (3) da yangi brauzer — inkognito oyna (hamma inkognito oynalar yopilib, yangisi ochilsa); sanoq sahifasi ham `lending/` da.", ru: 'то же требование — вместо «устройства» браузерный ID (`brauzer_id`, как в 10-м модуле); в (3) новый браузер — окно инкогнито (если закрыть все окна инкогнито и открыть новое); страница подсчёта тоже в `lending/`.' })}</WebQator>}
      ortda={{ uz: "(faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz; `backend/.env` ga o'z kalitingizni yozasiz.", ru: '(только в этой новой папке — команда стирает изменения в папке) — увидите, как это работает; в `backend/.env` впишете свой ключ.' }} />
  );
};

// ===== AMALIYOT 2 — tuzatish va yangi versiya (screens[7]; talab zinapoyasi: «Nima qilsin» qatorini o'quvchi yozadi; tayanch 1.8) =====
const A2_PROMPT = [
  { uz: "Qayerda: ilovamda — «{to'xtab qolish qadami}» qadami turgan ekran va u so'raydigan Backend yo'li.", ru: "Где: в моём приложении — экран, где стоит шаг «{to'xtab qolish qadami}», и путь Backend, который он запрашивает." },
  { uz: 'Nima qilsin: {nima qilsin}', ru: 'Что сделать: {nima qilsin}' },
  { uz: "Nima buzilmasin: qolgan ekranlar va yo'llar avvalgidek ishlasin; qadamlar sanog'i (`hodisaYoz`) o'z joyida qolsin. Kirmagan odamga boshqa foydalanuvchilarning ismi va shaxsiy ma'lumoti ko'rinmasin — kirmagan odamga ketadigan maydonlar ro'yxatini avval menga ko'rsat, faqat shular ketsin.", ru: 'Что не должно сломаться: остальные экраны и пути работают как раньше; подсчёт шагов (`hodisaYoz`) остаётся на месте. Невошедший человек не видит имён и личных данных других пользователей — список полей, которые уходят невошедшему, сначала покажи мне, уходят только они.' },
  { uz: "`.env` ga tegma. Tekshiruv uchun yozuv yaratsang — `id` larini ayt va faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: '`.env` не трогай. Если создашь записи для проверки — назови их `id` и удали только их. Больше ничего не трогай, назови изменённые файлы.' }
];
const A2_NAMUNA = {
  '{nima qilsin}': { uz: "masalan: kirmagan odam ham o'yinlar ro'yxatini ko'rsin; «Qo'shilaman» bosilsa — «Ro'yxatdan o'tish» ochilsin. Bitta o'zgarish yozing — butun ilovani qayta qurish emas.", ru: 'например: невошедший человек тоже видит список игр; при нажатии «Qo\'shilaman» открывается «Ro\'yxatdan o\'tish». Напишите одно изменение — не перестройку всего приложения.' }
};
const A2_YORDAM = [
  { uz: "Qayerda: `backend/` — `GET /oyinlar`; `mobil/` — ilova ochilgandagi birinchi ekran, «O'yinlar», «O'yin» va «Qo'shilaman».", ru: "Где: `backend/` — `GET /oyinlar`; `mobil/` — первый экран при открытии приложения, «O'yinlar», «O'yin» и «Qo'shilaman»." },
  { uz: "Nima qilsin: kirmagan odam ham «O'yinlar»ni ko'rsin. `GET /oyinlar` token bo'lmasa ham javob bersin — faqat shu maydonlar: `id`, `kun`, `soat`, `maydon`, `kerak`, `qoshilgan`; boshqa hech qanday maydon (`men…`, o'yinchilar ismi va keyin qo'shiladiganlari) bo'lmasin.", ru: "Что сделать: невошедший человек тоже видит «O'yinlar». `GET /oyinlar` отвечает и без токена — только эти поля: `id`, `kun`, `soat`, `maydon`, `kerak`, `qoshilgan`; никаких других полей (`men…`, имён игроков и тех, что добавят позже)." },
  { uz: "Ilova tokeni yo'q odamga birinchi ekranda «O'yinlar»ni ko'rsatsin, tepada «Kirish» havolasi bilan; «Qo'shilaman» bosilsa — «Ro'yxatdan o'tish» ochilsin. Kirmagan odamga ro'yxat ekran ochilganda va pastga tortganda yangilansin; real vaqt ulanishi — faqat kirganlarga.", ru: "Приложение показывает человеку без токена на первом экране «O'yinlar» со ссылкой «Kirish» сверху; при нажатии «Qo'shilaman» открывается «Ro'yxatdan o'tish». Невошедшему список обновляется при открытии экрана и при оттягивании вниз; соединение в реальном времени — только вошедшим." },
  { uz: "Nima buzilmasin: kirgan o'yinchi uchun qo'shilish, tasdiq, chiqish, navbat, real vaqt va eslatma avvalgidek ishlasin; to'rt qadam sanog'i (`hodisaYoz`) o'z joyida qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не должно сломаться: для вошедшего игрока присоединение, подтверждение, выход, очередь, реальное время и напоминание работают как раньше; подсчёт четырёх шагов (`hodisaYoz`) на месте. `.env` не трогай. Больше ничего не трогай, назови изменённые файлы.' },
  { uz: "Saytingizda ham shunday: kirmagan odamga ro'yxat sahifa ochilganda va «Yangilash» bosilganda so'raladi.", ru: 'На сайте так же: невошедшему список запрашивается при открытии страницы и при нажатии «Обновить».' }
];
const LENDING_PROMPT = [{ uz: "`lending/index.html` dagi «Android: ilovani o'rnatish» havolasini shu manzilga almashtir: {yangi havola}. Boshqa joyga tegma.", ru: "Замени в `lending/index.html` ссылку «Android: ilovani o'rnatish» на этот адрес: {yangi havola}. Больше ничего не трогай." }];
// O'ng tomon: telefon (kirmagan holat) → «Qo'shilaman» → «Ro'yxatdan o'tish»; tokensiz javob; lending kartasi (≤3 blok)
const NatijaA2 = () => {
  const f = useYurish([1800, 2800]);
  return (
    <div className="do-natija">
      <div className="do-natija-r">
        <QsTelefon ekran={f >= 2 ? 'royxat' : 'mehmon'} qoshil={f >= 2 ? undefined : f >= 1 ? 'bos' : 'bor'} />
        <div className="do-natija-ust">
          <span className="do-json"><code className="do-json-u">…onrender.com/oyinlar</code><code>{'[{ "id": 1, "kun": "…", "soat": "18:00", "maydon": "Mahalla maydoni", "kerak": 10, "qoshilgan": 8, … }]'}</code></span>
          <span className="do-lend"><b>{tr({ uz: 'Lending · Qanday qo\'shilaman', ru: 'Лендинг · Как присоединиться' })}</b><span className="do-lend-hv"><span className="do-lend-a">{tr({ uz: "Android: ilovani o'rnatish", ru: 'Android: установить приложение' })}</span><em>✓ {tr({ uz: 'yangi havola', ru: 'новая ссылка' })}</em></span></span>
        </div>
      </div>
      <QIzoh>{tr({ uz: "Tuzatish chiqdi — bu ish fakti. Gipoteza to'g'rimi — keyingi kunlardagi sonlar ko'rsatadi.", ru: 'Исправление вышло — это факт работы. Верна ли гипотеза — покажут числа следующих дней.' })}</QIzoh>
    </div>
  );
};
const ScreenA2 = (props) => {
  const { storedAnswer, onAnswer, screen } = props;
  const [trek, setTrek] = useState(trekOl);
  const [k0] = useState(qadamOl);
  const [chiq, setChiq] = useState(() => (k0.chiqarildi ? 'chiqdi' : storedAnswer && storedAnswer.navbatda ? 'navbat' : null)); // 'chiqdi' | 'navbat' | null
  const tanla = (t) => { trekYoz(t); setTrek(t); };
  const mobil = trek !== 'web', web = trek !== 'mobil';
  const yIdx = qadamSaqlangan(k0) ? idOraliq(k0.toxtash[0]) : -1;
  const yQadam = yIdx >= 0 ? k0.qadamlar[yIdx + 1] : null;
  const yNom = yQadam && String(yQadam.nom || '').trim();
  const g = k0.gipoteza;
  const gBor = qadamSaqlangan(k0);
  const gipQ = gBor
    ? <b className="do-gip-q">«{gapYig(g)}»</b>
    : <span>«{tr({ uz: 'Agar', ru: 'Если' })} <span className="q-joy">{'{agar}'}</span>, <span className="q-joy">{"{o'zgaradi}"}</span>, {tr({ uz: 'chunki', ru: 'потому что' })} <span className="q-joy">{'{chunki}'}</span>.»</span>;
  const tanlov = (v) => {
    if (v === 'chiqdi') qadamYoz({ tuzatildi: true, chiqarildi: true, chiqarildiVaqt: new Date().toISOString() });
    else qadamYoz({ chiqarildi: false, chiqarildiVaqt: null });
    setChiq(v);
    onAnswer(screen, { ...(storedAnswer || {}), stage: 'practice', screenIdx: screen, practice: 'Amaliyot 2', solved: true, picked: true, correct: v === 'chiqdi', navbatda: v === 'navbat' });
  };
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>
      <Bq k="bir">{tr({ uz: 'Amaliyot 1 push qilingan. Gipotezangiz shu yerda:', ru: 'Практика 1 отправлена (push). Ваша гипотеза здесь:' })}</Bq>
      <span className="do-band">{gipQ} {tr({ uz: '«Agar» qismi — bugungi tuzatish.', ru: 'Часть «Если» — сегодняшнее исправление.' })}</span>
      <Bq>{tr({ uz: "U bitta ekran yoki bitta Backend yo'liga sig'sin; katta bo'lsa — birinchi ko'rinadigan qismini tanlang. Ilovangizda ★ qadam turgan ekranni oching. Mentor misolida bu — ilova ochilgandagi birinchi ekran: hozir u «Kirish».", ru: 'Пусть оно помещается в один экран или один путь Backend; если большое — выберите первую видимую часть. Откройте в приложении экран, где стоит шаг ★. В примере Ментора это первый экран при открытии приложения: сейчас это «Вход».' })}</Bq>
    </> },
    { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>
      <Bq k="bir">{tr({ uz: "«Qayerda» qatori mustaqil ishdagi ★ qadamdan to'ldirilgan (tahrirlash mumkin). «Nima qilsin» qatorini yozing (kulrang namunaga qarang), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Строка «Где» заполнена по шагу ★ из самостоятельной работы (можно править). Напишите строку «Что сделать» (смотрите серый пример), нажмите «Скопировать», отправьте в Antigravity:' })}</Bq>
    </>, prompt: { satrlar: A2_PROMPT, namuna: A2_NAMUNA, toldir: yNom ? { "{to'xtab qolish qadami}": yNom } : {} }, yordam: A2_YORDAM },
    { h: { uz: 'Ishga tushirish', ru: 'Запуск' }, t: <>
      <Bq k="bir">{tr({ uz: '`git diff` → `git status` → `git add <fayl>` → `git commit -m "8-dars: {tuzatishingiz nomi}"` → `git push`; Render\'da yangi deploy tugashini kuting.', ru: '`git diff` → `git status` → `git add <fayl>` → `git commit -m "8-dars: {tuzatishingiz nomi}"` → `git push`; дождитесь окончания нового deploy на Render.' })}</Bq>
      <Bq>{tr({ uz: "Mobil trekda `npx expo start`, QR'ni Expo Go bilan oching (bitta Wi-Fi; bo'lmasa `--tunnel`); web-trekda `npm run dev`. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'В мобильном треке `npx expo start`, откройте QR в Expo Go (одна Wi-Fi; иначе `--tunnel`); в веб-треке `npm run dev`. Если ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Tuzat.»' })}</Bq>
    </> },
    { h: { uz: 'Tekshirish', ru: 'Проверка' }, t: <>
      <Bq k="bir">{tr({ uz: "agent nima desa ham, o'zingiz tekshiring:", ru: 'что бы ни сказал агент, проверьте сами:' })}</Bq>
      <Bq>{tr({ uz: "(1) «Hisobdan chiqish» → ilovani qayta oching: tuzatilgan joy gipotezangizdagidek ko'rinishi kerak. Mentor misolida — «O'yinlar» ro'yxatdan o'tmasdan ko'rinadi, «Qo'shilaman» → «Ro'yxatdan o'tish».", ru: '(1) «Выйти из аккаунта» → снова откройте приложение: исправленное место должно выглядеть как в вашей гипотезе. В примере Ментора — «Игры» видны без регистрации, «Присоединяюсь» → «Регистрация».' })}</Bq>
      <span className="do-band do-joriy-b">{tr({ uz: "Kirmagan odam ko'radigan bu ekran mehmon ko'rinishi deyiladi: ro'yxat bor, harakat uchun ro'yxatdan o'tish kerak.", ru: 'Этот экран, который видит невошедший человек, называется гостевым видом: список есть, для действия нужна регистрация.' })}</span>
      <Bq>{tr({ uz: "(2) Brauzerda Render manzilingizga o'zgargan yo'lni qo'shib, tokensiz oching (Mentor misolida `/oyinlar`): javobda ism, login va `men…` maydonlari bo'lmasligi kerak. Tuzatishingiz Backend yo'liga tegmagan bo'lsa — bu bandni o'tkazing.", ru: '(2) Откройте в браузере свой адрес Render с изменённым путём без токена (в примере Ментора `/oyinlar`): в ответе не должно быть имён, логинов и полей `men…`. Если исправление не затронуло путь Backend — пропустите этот пункт.' })}</Bq>
      <Bq>{tr({ uz: "(3) Kiring: asosiy harakat va real vaqt avvalgidek ishlashi kerak. Shu yerda «Bajardim» — tuzatish qilindi va tekshirildi.", ru: '(3) Войдите: основное действие и реальное время должны работать как раньше. Здесь «Готово» — исправление сделано и проверено.' })}</Bq>
    </> }
  ];
  const doneT = chiq === 'chiqdi'
    ? { uz: "Tuzatish tekshirildi va odamlarga chiqdi: yangi kelganlar uni lendingdagi havoladan oladi.", ru: 'Исправление проверено и вышло к людям: новые получат его по ссылке на лендинге.' }
    : chiq === 'navbat' ? { uz: "Tuzatish tekshirildi, Backend yangilandi. Fayl tayyor bo'lgach, lendingdagi havolani almashtirasiz.", ru: 'Исправление проверено, Backend обновлён. Когда файл будет готов, замените ссылку на лендинге.' } : null;
  const keyin = (
    <div className="do-keyin-q fade-step">
      <p className="do-keyin-t"><b>(4) {tr({ uz: 'Yangi versiya', ru: 'Новая версия' })}</b> — {tr({ uz: "Backend push'dan keyin yangilandi.", ru: 'Backend после push обновился.' })}{mobil && <> {fmtCode(tr({ uz: "Brauzer ko'rinishi push'dan keyin o'zi yangilanmaydi: `npx expo export -p web`, keyin `netlify deploy --prod --dir dist` bilan qayta chiqaring.", ru: 'Браузерная версия после push сама не обновляется: `npx expo export -p web`, затем выложите заново через `netlify deploy --prod --dir dist`.' }))}</>}</p>
      {mobil && <>
        <p className="do-keyin-t">{fmtCode(tr({ uz: "APK o'zi yangilanmaydi — yangi o'rnatish fayli kerak: `cd mobil` → `eas build -p android --profile preview` (bepul rejada oyiga 15 ta Android build — keraksiz qayta tayyorlamang). Navbatni kutmang — yakuniy savolga o'ting.", ru: 'APK сам не обновляется — нужен новый файл установки: `cd mobil` → `eas build -p android --profile preview` (в бесплатном плане 15 Android build в месяц — не готовьте лишний раз). Не ждите очередь — переходите к итоговому вопросу.' }))}</p>
        <p className="do-keyin-t">{tr({ uz: "Fayl tayyor bo'lgach agentga:", ru: 'Когда файл будет готов, агенту:' })}</p>
        <DoPrompt satrlar={LENDING_PROMPT} />
        <p className="do-keyin-t">{fmtCode(tr({ uz: "→ `git push`. Eski faylni o'rnatgan odamda tuzatish yo'q — u yangisini o'rnatgandagina chiqadi; yangi keladiganlar lendingdagi yangi havoladan o'rnatadi.", ru: '→ `git push`. У того, кто установил старый файл, исправления нет — оно появится, только когда он установит новый; новые люди установят по новой ссылке на лендинге.' }))}</p>
      </>}
      <span className="do-tanlov">
        <span className="do-belgi-y">{tr({ uz: 'Tanlang:', ru: 'Выберите:' })}</span>
        <span className={cxx('do-belgi-g', !chiq && 'do-chorla')}>
          <QChip holat={chiq === 'chiqdi' ? 'on' : undefined} onClick={() => tanlov('chiqdi')}>{tr({ uz: 'Yangi versiya chiqdi', ru: 'Новая версия вышла' })}</QChip>
          {mobil && <QChip holat={chiq === 'navbat' ? 'on' : undefined} onClick={() => tanlov('navbat')}>{tr({ uz: "O'rnatish fayli navbatda", ru: 'Файл установки в очереди' })}</QChip>}
        </span>
      </span>
      {doneT && <div className="q-blok-tugadi fade-step" key={chiq}><p>{tr(doneT)}</p></div>}
    </div>
  );
  return (
    <ScreenBlok {...props} steps={steps} yakunTogri={false} onTugadi={() => qadamYoz({ tuzatildi: true })} keyin={keyin}
      eyebrow={{ uz: 'Amaliyot 2 · tuzatish', ru: 'Практика 2 · исправление' }}
      title={{ uz: <>Gipotezadagi bitta o'zgarish <A>odamlarga chiqsin.</A></>, ru: <>Пусть одно изменение из гипотезы <A>выйдет к людям.</A></> }}
      mentor={{ uz: "Endi «Nima qilsin» qatorini gipotezangizdan o'zingiz yozasiz; «1 · Ochish»dan boshlang.", ru: 'Теперь строку «Что сделать» пишете сами из своей гипотезы; начните с «1 · Открыть».' }}
      ustida={<TrekTanlov trek={trek} onTanla={tanla} />}
      natija={<NatijaA2 />}
      doneText={null}
      ulgur={{ uz: "Vaqt tugayaptimi — (1)–(3) ni tekshirib, push qiling; yangi o'rnatish fayli va lending havolasi uyda. Tekshirilmagan tuzatishdan o'rnatish fayli tayyorlamang.", ru: 'Время кончается — проверьте (1)–(3) и сделайте push; новый файл установки и ссылка на лендинге — дома. Из непроверенного исправления файл установки не готовьте.' }}
      pastQator={web && <WebQator>{tr({ uz: "tuzatish — saytingizda; o'rnatish fayli yo'q. (4) da saytni telefonda ochib, tuzatish ko'rinishini tekshirasiz: ko'rinmasa — sayt Netlify'ga buyruq bilan chiqarilgan, qayta `netlify deploy --prod` (7-darsdagidek); ko'rinsa — «Yangi versiya chiqdi».", ru: 'исправление — на вашем сайте; файла установки нет. В (4) откройте сайт на телефоне и проверьте, видно ли исправление: если нет — сайт выложен на Netlify командой, снова `netlify deploy --prod` (как на 7-м уроке); если видно — «Новая версия вышла».' })}</WebQator>} />
  );
};

// ===== KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16); birinchi bosishgacha karta yuzi yengil halqada (E 49) =====
const KARTOCHKALAR = [
  { front: { uz: 'Qadamlar nima?', ru: 'Что такое шаги?' }, back: { uz: "Foydalanuvchi mahsulotda bosib o'tadigan yo'l bo'laklari", ru: 'Части пути, который пользователь проходит в продукте' }, note: { uz: "Inglizchasi: funnel. Mentor misolida: ochdi, ro'yxatdan o'tdi, qo'shildi, kelishini tasdiqladi", ru: 'По-английски: funnel. В примере Ментора: открыл, зарегистрировался, присоединился, подтвердил приход' } },
  { front: { uz: "Bu darsda foiz nimani ko'rsatadi?", ru: 'Что на этом уроке показывает процент?' }, back: { uz: "Bir qadamdan keyingisiga o'tganlar foizini", ru: 'Процент перешедших с одного шага на следующий' }, note: { uz: '46 dan 27 tasi — 59 foiz', ru: '27 из 46 — 59 процентов' } },
  { front: { uz: "To'xtab qolish qadami nima?", ru: 'Что такое шаг остановки?' }, back: { uz: "Keyingi qadamga o'tganlar foizi past bo'lgan joy", ru: 'Место, где процент перешедших на следующий шаг низкий' }, note: { uz: 'Bu darsda foizi eng past ikki oraliq olinadi', ru: 'На этом уроке берут два промежутка с самым низким процентом' } },
  { front: { uz: "Eng kichik son — to'xtab qolish qadamimi?", ru: 'Самое маленькое число — это шаг остановки?' }, back: { uz: 'Shart emas: foizga qarang', ru: 'Не обязательно: смотрите на процент' }, note: { uz: "Mentor misolida 12 dan 9 tasi o'tgan — 75 foiz", ru: 'В примере Ментора перешли 9 из 12 — 75 процентов' } },
  { front: { uz: 'Har qadamda nima sanaladi?', ru: 'Что считается на каждом шаге?' }, back: { uz: 'Turli qurilmalar soni', ru: 'Число разных устройств' }, note: { uz: 'Bitta qurilma necha marta ochsa ham — bitta', ru: 'Сколько бы раз одно устройство ни открывало — одно' } },
  { front: { uz: "Sanoq sahifasini kim ko'radi?", ru: 'Кто видит страницу подсчёта?' }, back: { uz: 'Maxfiy kalitni bilgan odam', ru: 'Тот, кто знает секретный ключ' }, note: { uz: "Kalitsiz so'rovga Backend `401` beradi; kalit chiqib ketsa — yangisi qo'yiladi", ru: 'На запрос без ключа Backend отвечает `401`; если ключ утёк — ставят новый' } },
  { front: { uz: '`SANOQ_KALITI` qayerda turadi?', ru: 'Где хранится `SANOQ_KALITI`?' }, back: { uz: "Backend `.env` da va Render'da", ru: 'В `.env` Backend и на Render' }, note: { uz: "Agentga, chatga va repo'ga yozilmaydi", ru: 'Не пишется агенту, в чат и в репозиторий' } },
  { front: { uz: 'Gipoteza qanday shaklda yoziladi?', ru: 'В какой форме пишется гипотеза?' }, back: { uz: "«Agar … qilsak, … o'zgaradi, chunki …»", ru: '«Если … сделаем, … изменится, потому что …»' }, note: { uz: '«Chunki» — nega shunday kutayotganimiz', ru: '«Потому что» — почему мы этого ждём' } },
  { front: { uz: "Mehmon ko'rinishi nima?", ru: 'Что такое гостевой вид?' }, back: { uz: "Kirmagan odam ko'radigan ekran: ro'yxat bor, harakat uchun ro'yxatdan o'tish kerak", ru: 'Экран, который видит невошедший человек: список есть, для действия нужна регистрация' }, note: { uz: "Mentor misolida boshqa o'yinchilarning ismi unda yo'q", ru: 'В примере Ментора имён других игроков в нём нет' } },
  { front: { uz: "APK o'rnatgan telefonda tuzatish o'zi paydo bo'ladimi?", ru: 'Появится ли исправление само на телефоне с установленным APK?' }, back: { uz: "Yo'q: yangi fayl tayyorlanadi va havola almashtiriladi", ru: 'Нет: готовят новый файл и меняют ссылку' }, note: { uz: "Backend esa push'dan keyin odatda o'zi yangilanadi", ru: 'А Backend после push обычно обновляется сам' } },
  { front: { uz: '2016-yilda Netflix nimani ochiq aytgan?', ru: 'Что Netflix открыто заявил в 2016 году?' }, back: { uz: "Ko'rishlarning qariyb 80 foizi qidiruvdan emas, tavsiyalardan keladi", ru: 'Почти 80 процентов просмотров приходят не из поиска, а из рекомендаций' }, note: { uz: "Netflix — film va serial ko'rsatadigan xizmat", ru: 'Netflix — сервис, который показывает фильмы и сериалы' } },
  { front: { uz: "Tuzatish chiqdi — gipoteza to'g'ri ekani bilindimi?", ru: 'Исправление вышло — стало ли известно, что гипотеза верна?' }, back: { uz: "Yo'q: buni keyingi kunlardagi sonlar ko'rsatadi", ru: 'Нет: это покажут числа следующих дней' }, note: { uz: '«Tuzatildi» — ish fakti, natija — keyingi sonlar', ru: '«Исправлено» — факт работы, результат — следующие числа' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('do-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="do-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + raqamli bandlar; ① — mobil trekda va fayl/havola qolgan bo'lsa; ③ — holatdan yig'iladi, hammasi tugagan bo'lsa ko'rinmaydi) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z ilovangiz", ru: 'ваше приложение' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: 'bitta tuzatish va bitta yozuv', ru: 'одно исправление и одна запись' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QOLGAN = {
  sanoq: { uz: 'sanoq sahifasini tekshiring', ru: 'проверьте страницу подсчёта' },
  gipoteza: { uz: 'gipotezani yozing', ru: 'напишите гипотезу' },
  tuzatish: { uz: 'tuzatishni tekshirib push qiling', ru: 'проверьте исправление и сделайте push' }
};
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ keyingi, qolgan, android }) => {
  const bandlar = [
    android && tr({ uz: "Mobil trekda: yangi o'rnatish fayli tayyor bo'lgach, lendingdagi «Android» havolasini almashtiring va telefonda havoladan o'rnatib ko'ring.", ru: 'В мобильном треке: когда новый файл установки будет готов, замените ссылку «Android» на лендинге и попробуйте установить по ссылке на телефоне.' }),
    tr({ uz: "2–3 kundan keyin sanoq sahifasini oching va qadamlar sonini sanasi bilan yozib oling. Mashq sonlari bilan ishlagan bo'lsangiz — o'z sonlaringizni mustaqil ishga kiriting.", ru: 'Через 2–3 дня откройте страницу подсчёта и запишите числа шагов с датой. Если работали с учебными числами — введите свои числа в самостоятельную работу.' }),
    qolgan.length > 0 && <>{tr({ uz: 'Darsda qolgan qismni tugating', ru: 'Закончите то, что осталось с урока' })}: {qolgan.map(k => tr(HW_QOLGAN[k])).join(' · ')}.</>
  ].filter(Boolean);
  return (
    <div className="card do-hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="do-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="do-hw-q"><span className="do-hw-k">{tr(r.k)}</span><span className="do-hw-v">{tr(r.v)}</span></div>)}</div>
      <ol className="do-hw-qadam">{bandlar.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{b}</span></li>)}</ol>
      <span className="do-hw-osti">{tr({ uz: 'Bir-ikki kunlik oz sondan xulosa chiqarmang — bu kuzatuv.', ru: 'Не делайте выводов по малым числам за день-два — это наблюдение.' })}</span>
      {keyingi && <span className="do-hw-keyingi">{keyingi}</span>}
    </div>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar. Sarlavha — besh holat, har biri rost (E 54); «Bugungi asosiy fikr» ko'rsatilmaydi (E 50) =====
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
    { uz: 'Har qadamda turli qurilmalar sanaladi: bitta qurilma necha marta ochsa ham — bitta.', ru: 'На каждом шаге считаются разные устройства: сколько бы раз одно устройство ни открывало — одно.' },
    { uz: "To'xtab qolish qadamini eng kichik son emas, past foiz ko'rsatadi.", ru: 'Шаг остановки показывает не самое маленькое число, а низкий процент.' },
    { uz: "Sanoq sahifasi maxfiy kalit bilan ochiladi; kalit agentga va repo'ga yozilmaydi.", ru: 'Страница подсчёта открывается по секретному ключу; ключ не пишут агенту и в репозиторий.' },
    { uz: "APK o'zi yangilanmaydi: tuzatishdan keyin yangi fayl tayyorlanadi va havola almashtiriladi.", ru: 'APK сам не обновляется: после исправления готовят новый файл и меняют ссылку.' },
    { uz: "Kam qurilmadagi farq — kuzatuv, isbot emas.", ru: 'Разница на малом числе устройств — наблюдение, не доказательство.' }
  ];
  const k = qadamOl();
  const trek = trekOl();
  const a1 = !!(answers[4] && answers[4].solved);
  const gip = qadamSaqlangan(k);
  const tuz = !!k.tuzatildi;
  const chiq = !!k.chiqarildi;
  // Holat (P-046, tayanch 7.1): yuqoridan birinchi mos kelgani — a1 (dars ichida), pm-m10d8-qadamlar (gipoteza, tuzatildi, chiqarildi)
  const holat = isMentorL || (tuz && chiq) ? 'chiqdi' : tuz ? 'tayyor' : gip ? 'gipoteza' : a1 ? 'sanoq' : 'yoq';
  const SARLAVHA = {
    chiqdi: { uz: <>Tuzatish <A>odamlarga chiqdi.</A></>, ru: <>Исправление <A>вышло к людям.</A></> },
    tayyor: { uz: <>Tuzatish tayyor — <A>yangi versiya qoldi.</A></>, ru: <>Исправление готово — <A>осталась новая версия.</A></> },
    gipoteza: { uz: <>Gipoteza tayyor — <A>tuzatish qoldi.</A></>, ru: <>Гипотеза готова — <A>осталось исправление.</A></> },
    sanoq: { uz: <>Sanoq sahifasi tayyor — <A>gipoteza qoldi.</A></>, ru: <>Страница подсчёта готова — <A>осталась гипотеза.</A></> },
    yoq: { uz: <>Sanoq sahifasi hali tugamagan — <A>uyda tugating.</A></>, ru: <>Страница подсчёта ещё не готова — <A>закончите её дома.</A></> } // E 54 (F-1006-389)
  };
  const toliq = holat === 'chiqdi';
  const mashq = !isMentorL && gip && k.tur === 'mashq';
  const qolgan = isMentorL ? [] : [!a1 && 'sanoq', !gip && 'gipoteza', !tuz && 'tuzatish'].filter(Boolean);
  const android = !isMentorL && trek !== 'web' && !chiq;
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: foydalanuvchini qaytaradigan eslatma»</b></>, ru: <>Следующий урок — <b>«День проекта: напоминание, которое возвращает пользователя»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('do-yakun', !toliq && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={<>{tr(SARLAVHA[holat])}{mashq && <span className="do-yakun-osti">{tr({ uz: "Gipoteza mashq sonlarida — o'z sonlaringiz bilan qayta tekshiring.", ru: 'Гипотеза на учебных числах — перепроверьте со своими числами.' })}</span>}</>}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={keyingi} qolgan={qolgan} android={android} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmDropOffLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, ScreenA1, Screen5, Screen6, ScreenA2, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — QadamSanoq (qs-): telefon · brauzer maketi, to'rt ustun va oraliqlar; dars elementlari (do-). Faqat qolip tokenlari (D3) va brend nomlari rangi; emoji yo'q (D4) === */
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .lesson-root .q-ekran > ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .lesson-root .q-mustaqil { max-width: none; }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        .do-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: do-puls 2.2s ease-out .3s 3; }
        @keyframes do-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .do-mz.do-halqa-i { border-color: ${T.accent}; animation: do-tolqin-i 2.4s ease-in-out .4s 3; }
        /* Variantlar va chiplar: guruh atrofida ramka yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .do-s0 { display: contents; }
        .do-s0.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: do-chorla-v 1.8s ease-out .5s 2; }
        .do-s0.kutish .q-variant:nth-child(2) { animation-delay: .75s; }
        @keyframes do-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled), .do-chorla > .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: do-chorla-c 1.8s ease-out .5s 2; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:nth-child(2), .do-chorla > .q-chip:nth-child(2) { animation-delay: .75s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:nth-child(3), .do-chorla > .q-chip:nth-child(3) { animation-delay: 1s; }
        @keyframes do-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes do-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        /* Bitta vizual: maket chapda (o'lchami barqaror — SABOQ 22), ustunlar o'ngda (SABOQ 21/26) */
        .qs-sanoq { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: clamp(14px,2.4vw,26px); align-items: start; width: 100%; }
        .qs-sanoq.yonma { grid-template-columns: 176px minmax(0, 1fr); gap: 14px; }
        .qs-sanoq.yakka { grid-template-columns: minmax(0, 1fr); }
        .qs-maket { display: flex; align-items: center; justify-content: center; min-height: 290px; min-width: 0; }
        .qs-sanoq.yonma .qs-maket { min-height: 276px; }
        .qs-ong { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .qs-nom { font-weight: 800; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        .qs-tel { position: relative; width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 6px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 9px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .qs-tel-bar { display: flex; align-items: center; justify-content: center; gap: 8px; height: 16px; flex: none; font-size: 12.5px; }
        .qs-tel-bar.mehmon { justify-content: space-between; padding: 0 2px; }
        .qs-tel-kir { font-size: 10.5px; font-weight: 800; color: ${T.accent}; text-decoration: underline; text-underline-offset: 2px; }
        .qs-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 5px; animation: do-ekran .35s ease-out both; }
        .qs-tel-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .qs-maydon { display: flex; align-items: center; height: 26px; flex: none; padding: 0 9px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 11.5px; font-weight: 600; color: ${T.ink2}; }
        .qs-tel-btn { display: flex; align-items: center; justify-content: center; height: 26px; flex: none; border-radius: 8px; background: ${T.accent}; color: #fff; font-size: 11.5px; font-weight: 800; }
        .qs-tel-btn.past { margin-top: auto; }
        .qs-tel-btn.kichik { height: 22px; margin-top: 4px; font-size: 10.5px; }
        .qs-tel-btn.bos { box-shadow: 0 0 0 3px ${fon(T.accent, 0.3)}; animation: do-pop .4s ease-out; }
        .qs-tel-hv { margin-top: auto; text-align: center; font-size: 10.5px; font-weight: 700; color: ${T.accent}; text-decoration: underline; }
        .qs-tel-kun { margin-top: 2px; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; }
        .qs-karta { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink2}; }
        .qs-karta b { font-size: 12px; color: ${T.ink}; }
        .qs-son { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink}; margin-top: 2px; }
        .qs-son.katta { font-size: 22px; }
        .qs-tel-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; } .qs-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .qs-oyna { width: 100%; max-width: 300px; display: flex; flex-direction: column; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.35); }
        .qs-bar { display: flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; border-radius: 13px 13px 0 0; flex: none; }
        .qs-bar > i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.16)}; flex: none; }
        .qs-url { flex: 1; min-width: 0; height: 20px; margin-left: 6px; padding: 0 10px; border-radius: 999px; background: ${T.paper}; display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; white-space: nowrap; }
        .qs-url-t { min-width: 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
        .qs-oyna-ich { padding: 12px 14px 14px; min-height: 196px; display: flex; flex-direction: column; justify-content: center; }
        .qs-kalit { display: flex; align-items: center; gap: 8px; }
        .qs-kalit-m { flex: 1; height: 34px; display: flex; align-items: center; padding: 0 12px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.bg}; font-size: 14px; letter-spacing: 0.1em; color: ${T.ink}; }
        .qs-kalit-b { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 9px; background: ${T.accent}; color: #fff; font-weight: 800; }
        .qs-sahifa { display: flex; flex-direction: column; gap: 5px; }
        .qs-sahifa-h { font-size: 13px; color: ${T.ink}; margin-bottom: 2px; }
        .qs-sq { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; padding: 4px 8px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 12px; color: ${T.ink}; }
        .qs-sq b { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
        .qs-sq.yangi { animation: do-yashil 1.6s ease-out both; } .qs-sq.yangi b { color: ${T.ok}; animation: do-pop .45s ease-out; }
        .qs-sq.akk { margin-top: 4px; background: ${T.paper}; }
        .qs-sq-osti { font-size: 10.5px; color: ${T.ink2}; }
        /* To'rt ustun — teng kenglikda, balandligi songa mos (noldan); voronka shakli yo'q */
        .qs-ustunlar { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .qs-yorliq { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .qs-ust-maydon { display: grid; gap: 10px; height: 150px; align-items: end; padding: 0 2px; border-bottom: 2px solid ${T.line}; }
        .qs-ustunlar.kichik .qs-ust-maydon { height: 96px; gap: 8px; }
        .qs-ust-k { height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: stretch; gap: 3px; min-width: 0; }
        .qs-ust-son { text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .qs-ustunlar.kichik .qs-ust-son { font-size: 12.5px; }
        .qs-ustun { display: block; width: 100%; border-radius: 7px 7px 2px 2px; background: ${T.accent}; transform-origin: bottom; animation: do-os .7s cubic-bezier(.3,1,.4,1) var(--d, 0s) both; }
        .qs-ustunlar.sonsiz .qs-ustun:not(.bosh) { background: ${fon(T.ink, 0.22)}; }
        .qs-ustun.bosh { height: 62%; background: transparent; border: 1.5px dashed ${fon(T.ink, 0.3)}; animation: none; transition: border-color .3s; }
        .qs-ustun.bosh.tolqin { border-color: ${T.accent}; animation: do-tolqin-u 1.3s ease-out var(--d, 0s) 2; }
        .qs-ust-nomlar { display: grid; gap: 10px; }
        .qs-ustunlar.kichik .qs-ust-nomlar { gap: 8px; }
        .qs-ust-nom { display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center; font-size: 11.5px; line-height: 1.3; font-weight: 700; color: ${T.ink2}; min-width: 0; overflow-wrap: break-word; }
        .qs-sanoq.yonma .qs-ust-nom { font-size: 10px; letter-spacing: -0.01em; }
        .qs-sanoq.yonma .qs-ust-maydon, .qs-sanoq.yonma .qs-ust-nomlar, .qs-sanoq.yonma .qs-oraliqlar { gap: 6px; }
        .qs-toxtash { font-style: normal; font-size: 10.5px; font-weight: 800; color: ${T.err}; background: ${T.errFon}; border-radius: 6px; padding: 1px 6px; }
        .qs-izoh-oxir { font-style: normal; font-size: 10.5px; font-weight: 600; color: ${T.ink2}; }
        .qs-oraliqlar { display: grid; gap: 10px; align-items: start; }
        .qs-or-joy { display: flex; justify-content: center; min-width: 0; }
        .qs-oraliq { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 0; max-width: 100%; padding: 5px 8px; border-radius: 10px; border: 1.5px dashed ${fon(T.ink, 0.28)}; background: transparent; font-family: 'Manrope', sans-serif; color: ${T.ink2}; text-align: center; }
        button.qs-oraliq { cursor: pointer; }
        button.qs-oraliq.bosh { border-color: ${fon(T.accent, 0.6)}; color: ${T.accent}; }
        button.qs-oraliq.ochiq:not(.err) { border-style: solid; border-color: ${fon(T.accent, 0.55)}; box-shadow: 0 4px 12px -8px ${fon(T.accent, 0.4)}; }
        .qs-oraliq.belgi { border-style: solid; border-color: ${fon(T.ink, 0.2)}; background: ${fon(T.ink, 0.08)}; animation: do-kir .45s ease-out both; }
        .qs-oraliq.ochiq { border-style: solid; border-color: ${T.line}; background: ${T.paper}; color: ${T.ink}; animation: do-kir .4s ease-out both; }
        .qs-oraliq.err { border-color: ${fon(T.err, 0.45)}; background: ${T.errFon}; }
        .qs-oraliq.ok { border-color: ${fon(T.ok, 0.45)}; background: ${T.okFon}; }
        .qs-oraliq.lahza { animation: do-lahza 1.4s ease-out .5s both; }
        .qs-or-f { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; line-height: 1.3; }
        .qs-oraliq.err .qs-or-f { color: ${T.err}; } .qs-oraliq.ok .qs-or-f { color: ${T.ok}; }
        .qs-or-o { font-size: 10.5px; font-weight: 600; color: ${T.ink2}; }
        .qs-or-belgi { font-size: 10.5px; font-weight: 800; color: ${T.ink2}; }
        .qs-or-belgi.yulduz { color: ${T.accent}; font-size: 12px; }
        .qs-ustunlar.kichik .qs-or-f { font-size: 11px; }
        /* Ekran tuzilishi; tugagach natija fokusda (DE-199) */
        .do-fokus { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 760px; margin: 0 auto; }
        p.do-joriy { margin: 0; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; animation: do-kir .45s ease-out both; }
        /* Taxmin va izoh yashil xulosa ichida (E 42): kichik qatorlar 12.5px */
        .do-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .do-tx b { color: ${T.ink}; } .do-tx.ok, .do-tx.ok b { color: ${T.ok}; } .do-tx b.yoq { color: ${T.err}; }
        .do-izoh { display: block; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .do-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .do-bashq-t b { color: ${T.accent}; }
        .do-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 4px 10px; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: do-uchish .8s cubic-bezier(.4,0,.2,1) forwards; }
        p.do-past { margin: 0; font-size: 12px; line-height: 1.55; color: ${T.ink2}; }
        p.do-past.mono { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        /* Reja vizuali: bir marta o'zi yuradi */
        .do-rj { display: flex; flex-direction: column; gap: 10px; padding: 10px; border: 1.5px solid ${T.line}; border-radius: 14px; background: ${T.paper}; }
        .do-rj-tel { animation: do-kir .5s ease-out both; }
        .do-rj-bosh { display: block; height: 150px; }
        .do-rj-yangi { align-self: center; font-size: 12.5px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 4px 14px; }
        /* 3 va 8-ekran: savol ustidagi kichik karta */
        .do-mashq { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .do-mashq-y { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .do-mashq-q { display: flex; flex-wrap: wrap; gap: 8px; }
        .do-mashq-k { display: inline-flex; align-items: baseline; gap: 6px; padding: 4px 10px; border-radius: 8px; background: ${T.bg}; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .do-mashq-k b { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${T.ink}; } .do-mashq-k b.ok { font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ok}; }
        .do-mashq-b { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 999px; padding: 2px 10px; }
        /* 5-ekran — Netflix (nom o'z rangida, logotipsiz; sahna chizilgan) */
        .do-nf { font-weight: 800; font-style: normal; color: ${NETFLIX_RANG}; }
        .do-voqea { display: flex; flex-direction: column; gap: 12px; }
        p.do-tanish { margin: 0; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .do-voqea-h { font-weight: 800; font-size: 15px; color: ${T.ink}; animation: do-kir .4s ease-out both; }
        .do-voqea-qator { display: flex; justify-content: center; }
        .do-voqea-qator.ikki { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 18px; align-items: center; }
        .do-nf-bash { display: flex; justify-content: center; }
        .do-nuq { display: flex; align-items: center; gap: 6px; }
        .do-nuq-l { font-size: 12px; font-weight: 800; color: ${T.ink2}; margin-right: 4px; }
        .do-nuq i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .do-nuq i.ok { background: ${T.ok}; } .do-nuq i.cur { background: ${T.accent}; }
        .do-nf-sahna { position: relative; display: flex; justify-content: center; width: min(100%, 640px); padding: 14px 10px; border-radius: 14px; background: ${T.bg}; min-height: 300px; }
        .do-nf-tel { width: 132px; height: 222px; flex: none; display: flex; flex-direction: column; gap: 7px; padding: 8px; border-radius: 20px; border: 2px solid #2A2730; background: #141414; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.5); animation: do-kir .45s ease-out both; }
        .do-nf-tel.katta { width: 150px; height: 250px; }
        .do-nf-tel.kichik { width: 104px; height: 176px; gap: 5px; }
        .do-nf-tel-bar { display: flex; justify-content: center; font-size: 12px; }
        .do-nf-qid { height: 16px; border-radius: 999px; background: #3A3A3A; flex: none; }
        .do-nf-qator { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 5px; flex: 1; min-height: 0; }
        .do-nf-qator i { border-radius: 5px; opacity: 0.9; }
        .do-nf-qator.bosh i { box-shadow: 0 0 0 1.5px #fff; }
        .do-nf-ikki { display: flex; gap: clamp(14px,4vw,40px); justify-content: center; }
        .do-nf-ustun { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .do-nf-chiz { width: 2px; height: 18px; background: ${fon(T.ink, 0.35)}; animation: do-chiz-y .6s ease-out .4s both; transform-origin: bottom; }
        .do-nf-korgan { display: flex; gap: 5px; }
        .do-nf-korgan i { width: 26px; height: 18px; border-radius: 4px; background: ${T.paper}; border: 2px solid; animation: do-kir .4s ease-out .2s both; }
        .do-nf-korgan-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .do-nf-oqim { position: relative; display: flex; align-items: center; gap: 10px; width: 100%; max-width: 560px; padding-left: 66px; }
        .do-nf-oqim-tel { position: relative; flex: none; }
        .do-nf-y { position: absolute; right: calc(100% + 6px); font-size: 10.5px; font-weight: 800; color: ${T.ink2}; white-space: nowrap; }
        .do-nf-y.qid { top: 22px; } .do-nf-y.tav { top: 64px; color: ${T.ink}; }
        .do-nf-yol { position: relative; flex: 1; height: 250px; min-width: 120px; overflow: hidden; }
        .do-nf-yol i { position: absolute; left: 0; top: var(--y); font-style: normal; font-size: 13px; color: ${NETFLIX_RANG}; opacity: 0; animation: do-oqim 2.6s linear var(--d) 4; }
        .do-nf-yol i.q { color: ${T.ink2}; }
        .do-nf-kor { flex: none; align-self: center; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .do-nf-kopr { display: flex; align-items: center; gap: 18px; width: 100%; max-width: 560px; }
        .do-nf-kopr-ong { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; animation: do-kir .5s ease-out .3s both; }
        .do-nf-kopr-nom { font-size: 13px; }
        /* Mustaqil ish: bir vaqtda bitta katta karta (E 53), yorliq input ichida (E 43) */
        .do-s6 { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 680px; }
        p.do-kirish-q { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .do-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; transition: background .3s; min-width: 0; }
        .do-karta.err { background: ${T.errFon}; }
        .do-kirish { animation: do-karta-k .45s cubic-bezier(.3,1.2,.5,1) both; }
        .do-mz { position: relative; display: flex; align-items: center; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; transition: border-color .2s, box-shadow .2s; min-width: 0; }
        .do-mz:focus-within { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .do-mz.err { border-color: ${T.err}; background: ${T.errFon}; }
        .do-mz-n { flex: none; min-width: 34px; text-align: center; padding: 0 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.accent}; border-right: 1px solid ${T.line}; white-space: nowrap; }
        .do-inp { flex: 1; min-width: 0; border: 0; background: transparent; outline: none; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; color: ${T.ink}; padding: 10px 12px; }
        .do-mz.son .do-inp { font-family: 'JetBrains Mono', monospace; }
        .do-mz-y { flex: none; padding: 0 10px; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .do-karta-tug { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .do-karta-tug .do-yordam-btn { margin-left: auto; }
        p.do-yordam { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 10px 12px; }
        .do-oklar { display: flex; flex-direction: column; gap: 6px; }
        .do-ok-q { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .do-ok { display: flex; align-items: baseline; gap: 8px; text-align: left; padding: 7px 10px; border-radius: 10px; border: 1px solid ${fon(T.ok, 0.35)}; background: ${fon(T.ok, 0.06)}; font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink}; cursor: pointer; min-width: 0; }
        .do-ok:hover { border-color: ${T.ok}; }
        .do-ok i { font-style: normal; font-weight: 800; color: ${T.ok}; }
        .do-ok span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
        .do-ok.yangi { animation: do-yashil 1.1s ease-out both; }
        .do-xulq { align-self: flex-start; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: transparent; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 12px; cursor: pointer; }
        .do-xulq:hover { border-color: ${fon(T.accent, 0.6)}; color: ${T.ink}; }
        .do-uyalar { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        .do-uya { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-height: 64px; padding: 10px 12px; border-radius: 12px; border: 1.5px dashed ${fon(T.ink, 0.28)}; background: transparent; }
        .do-uya.tola { border-style: solid; border-color: ${fon(T.err, 0.4)}; background: ${T.errFon}; animation: do-kir .4s ease-out both; }
        .do-uya.yulduz { box-shadow: 0 0 0 2px ${T.accent}; }
        .do-uya-y { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .do-uya-t { font-size: 13.5px; color: ${T.err}; }
        .do-uya.yulduz .do-uya-t { color: ${T.accent}; }
        .do-uya-b { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; color: #fff; background: ${T.accent}; border: none; border-radius: 8px; padding: 6px 10px; cursor: pointer; }
        .do-keyin { font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 2px 9px; }
        .do-yulduz { font-size: 13.5px; font-weight: 800; color: ${T.accent}; }
        p.do-gap { margin: 0; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        p.do-gap.kulrang { font-size: 13px; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        .do-natija-k { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .do-natija-q { display: flex; align-items: flex-start; gap: 10px; }
        .do-natija-q > :first-child { flex: 1; min-width: 0; }
        .do-tahrir { flex: none; width: 26px; height: 26px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; font-size: 13px; }
        .do-kulrang { display: block; font-size: 12px; color: ${T.ink2}; }
        /* Amaliyot bloki: bo'lim ichidagi elementlar <span> (QBlok matni <p> ichida) */
        .do-blok { display: contents; }
        .do-band { display: block; margin-top: 6px; }
        .q-blok-t > .do-band.bir:first-of-type { display: inline; margin: 0; }
        .do-band.ich { padding-left: 18px; margin-top: 2px; }
        .do-band.kulrang { font-size: 12px; color: ${T.ink2}; }
        .do-joriy-b { padding: 8px 10px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; font-weight: 600; }
        .do-gip-q { font-weight: 700; color: ${T.ink}; }
        .do-ps { display: block; }
        .do-joy-n { margin-left: 6px; font-size: 11.5px; color: ${T.ink2}; }
        .do-prompt-tug { display: inline-flex; align-items: center; gap: 6px; }
        .do-prompt-ed { width: 26px; height: 26px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; }
        .do-prompt-ta { display: block; width: 100%; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.accent}; background: ${T.paper}; color: ${T.ink}; resize: vertical; }
        .do-yordam-p { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .do-yp-y { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .do-yp { font-size: 12px; line-height: 1.5; color: ${T.ink}; overflow-wrap: anywhere; }
        .do-tanlov { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .do-belgi-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .do-belgi-g { display: flex; flex-wrap: wrap; gap: 6px; }
        .do-keyin-q { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        p.do-keyin-t { margin: 0; font-size: 13.5px; line-height: 1.55; color: ${T.ink}; }
        .do-trek { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .do-chorla { display: flex; flex-wrap: wrap; gap: 6px; }
        p.do-ulgur, p.do-web { margin: 6px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        p.do-web b { color: ${T.ink}; }
        p.do-ortda { margin: 6px 0 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        code.do-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; }
        .do-natija { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .do-natija-r { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
        .do-natija-br { flex: 1; min-width: 200px; display: flex; }
        .do-yangi-tel { width: 170px; flex: none; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .do-tel-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .qs-ochilish { justify-content: center; align-items: center; }
        .qs-ochilish-n { font-size: 17px; opacity: 0.85; }
        .qs-tel:has(.qs-ochilish) .qs-tel-bar { visibility: hidden; }
        .do-yangi-tel.on .qs-tel { animation: do-kir .45s ease-out both; }
        code.do-401 { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        code.do-401 b { color: ${T.err}; }
        .do-natija-ust { flex: 1; min-width: 190px; display: flex; flex-direction: column; gap: 10px; }
        .do-json { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; background: ${CODE.bg}; }
        .do-json code { font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.5; color: ${CODE.str}; overflow-wrap: anywhere; }
        .do-json code.do-json-u { color: ${CODE.attr}; }
        .do-lend { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; }
        .do-lend b { color: ${T.ink}; }
        .do-lend-hv { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-weight: 800; color: ${T.accent}; }
        .do-lend-a { text-decoration: underline; text-underline-offset: 2px; }
        .do-lend-hv em { font-style: normal; font-size: 11px; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 1px 8px; }
        /* Kartochka halqasi yengil (E 49): ingichka chegara, puls 3 marta */
        .do-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 1.5px ${T.accent}; animation: do-halqa-k 2.4s ease-in-out .4s 3; }
        @keyframes do-halqa-k { 0%, 100% { box-shadow: 0 0 0 1.5px ${T.accent}; } 50% { box-shadow: 0 0 0 1.5px ${T.accent}, 0 0 0 6px ${fon(T.accent, 0.22)}; } }
        p.do-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.do-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: do-nuqta 2.4s ease-in-out 3; }
        .do-hw { display: flex; flex-direction: column; gap: 12px; }
        .do-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .do-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .do-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .do-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.do-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .do-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .do-hw-qadam li i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .do-hw-osti { font-size: 12.5px; color: ${T.ink2}; }
        .do-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .do-yakun { display: contents; }
        .do-yakun.belgisiz .done-chip .tick { display: none; }
        .do-yakun-osti { display: block; margin-top: 6px; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0; color: ${T.ink2}; }
        @keyframes do-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes do-yashil { 0%, 45% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes do-pop { from { transform: scale(1.25); } to { transform: none; } }
        @keyframes do-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        @keyframes do-karta-k { from { opacity: 0; transform: translateX(18px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes do-uchish { to { transform: translate(var(--dx), var(--dy)) scale(0.92); opacity: 0.15; } }
        @keyframes do-nuqta { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        @keyframes do-os { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes do-tolqin-u { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes do-lahza { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.err, 0)}; } 35% { box-shadow: 0 0 0 6px ${fon(T.err, 0.3)}; } }
        @keyframes do-chiz-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes do-oqim { 0% { opacity: 0; left: 0; } 12% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; left: calc(100% - 14px); } }
        @media (max-width: 760px) {
          .qs-sanoq, .qs-sanoq.yonma { grid-template-columns: minmax(0, 1fr); }
          .qs-maket, .qs-sanoq.yonma .qs-maket { min-height: 0; }
          .do-voqea-qator.ikki { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 640px) {
          .qs-sanoq:not(.yakka), .qs-sanoq.yonma { grid-template-columns: 104px minmax(0, 1fr); gap: 10px; }
          .qs-maket .qs-tel { zoom: 0.6; }
          .qs-sanoq .qs-ust-nom { font-size: 10px; letter-spacing: -0.01em; }
          .qs-ust-maydon { height: 120px; gap: 6px; }
          .qs-ust-nomlar, .qs-oraliqlar { gap: 6px; }
          .qs-ust-nom { font-size: 10.5px; }
          .qs-oraliq { padding: 4px 4px; }
          .qs-or-f { font-size: 10.5px; }
          .do-hw-karta { grid-template-columns: minmax(0, 1fr); }
          .do-uyalar { grid-template-columns: minmax(0, 1fr); }
          .do-nf-tel { width: 118px; height: 200px; }
          .do-nf-tel.katta { width: 128px; height: 214px; }
          .do-nf-sahna { min-height: 0; }
          .do-nf-yol { height: 214px; min-width: 80px; }
          .do-nf-y { display: none; }
          .do-nf-oqim { padding-left: 0; }
          .do-nf-kopr { flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) {
          .do-halqa, .do-mz.do-halqa-i, .do-s0.kutish .q-variant, .q-bashorat .q-chip, .do-chorla > .q-chip, .qs-ekran, .qs-tel-btn.bos, .qs-sq.yangi, .qs-sq.yangi b,
          .qs-ustun, .qs-ustun.bosh.tolqin, .qs-oraliq, .qs-oraliq.lahza, p.do-joriy, .do-rj-tel, .do-voqea-h, .do-nf-tel, .do-nf-chiz, .do-nf-korgan i, .do-nf-kopr-ong,
          .do-kirish, .do-ok.yangi, .do-uya.tola, .do-uch, .do-yangi-tel.on .qs-tel, .do-flash.yangi .fc-card:not(.flip) .fc-front, p.do-fc-ipucha i { animation: none !important; }
          .do-nf-yol i { animation: none !important; opacity: 1; }
          .do-nf-yol i:nth-child(n+5) { display: none; }
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
        /* ⛶ kattalashtirish — skeletda tushib qolgan qoida (SABOQ 38); ikki klassli selektor: keyingi «.zoomable position relative» qoidasi uni bekor qilmasin (SABOQ 48, F-1006-386) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(920px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed» ni o'ziga bog'lamasin (F-1006-386) */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
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
