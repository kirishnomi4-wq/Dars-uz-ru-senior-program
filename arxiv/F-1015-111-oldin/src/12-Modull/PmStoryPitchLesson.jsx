import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) 2-dars (PM) — «Mahsulotingiz hikoyasini qanday aytasiz?» · kalit m12-02 · 15 ekran · palitra pm.
// Manba-haqiqat: feedback/F-1008-14modul/02-PmStoryPitch-v3.md (+ 02-FILTR.md); skelet — src/skelet/NamunaDars.jsx; pilot naqshi — PmInvestorPitchLesson.jsx (kod ko'chirilmagan).
// Ekranlar: s0 QKirish · s1 QReja · s2 QTushuncha (ro'yxat va lahza) · s3 test · s4 QVoqea (K19 iPhone) · s5 test · s6 QTushuncha (hikoya pitchda) · s7 test ·
//   s8 QMustaqil (uch karta) · s9 QMustaqil (video, rozilik darvozasi) · s10 QMustaqil (o'zini tekshirish) · s11 yakuniy test · podium · QKartochka · QYakun.
// Bitta vizual — HikoyaSahna (telefon · uch uya · funksiyalar ro'yxati · pitch tasmasi); keys — IphoneSahna. Saqlaydi: pm-m12d2-hikoya (tayanch 8); o'qiydi: pm-m12d1-pitch.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d2-v1', lessonTitle: { uz: "Mahsulotingiz hikoyasini qanday aytasiz?", ru: 'Как рассказать историю вашего продукта?' } }; // 14-Modul 2-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/02-PmStoryPitch-v3.md
// 15 ekran (MD v3): kirish → reja → ro'yxat va lahza → test → iPhone → test → hikoya pitchda → test → hikoyangiz → video → tekshirish → yakuniy test → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: 'hikoya', ru: 'история' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'lahza', ru: 'момент' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'video', ru: 'видео' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'pitch', ru: 'питч' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',            type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',            type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'royxatLahza',   type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',            type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'iphone',        type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's5',            type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'pitchdaHikoya', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',            type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'hikoya',        type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'video',         type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'tekshirish',    type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11',           type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',        type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',        type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's14',           type: 'summary',     template: 'custom',   scored: false, scope: null }
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
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' sp-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// MD KOD 12 dagi royxatLahza/iphone/pitchdaHikoya/hikoya/video/tekshirish: -1 — jsx darvozasi «o'lik kalit» deydi (ballsiz ekran nomi submitAnswer ga uzatilmaydi);
// amaliyot signallari submitAnswer(PRACTICE_BASE + ekran, 'practice', …) — shuning uchun bitta 'practice' sentinel (1-dars naqshi).
const INLINE_KEYS = { s3: 1, s5: 3, s7: 2, s11: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM: belgi o'rnida raqam — S-026). «Sinfga savol» — oxirgi kartada.
const RECAPS = {
  3: {
    title: { uz: 'Hikoyani boshlaydigan gap', ru: 'Фраза, с которой начинается история' },
    cards: [
      { ic: '1', h: { uz: "Funksiyalar ro'yxatida odam ham, lahza ham yo'q.", ru: 'В списке функций нет ни человека, ни момента.' } },
      { ic: '2', h: { uz: "Lahza — bo'lib o'tgan bitta voqea: kuni, soati va nima bo'lgani.", ru: 'Момент — один случай, который произошёл: день, час и что случилось.' } },
      { ic: '3', h: { uz: "Umumiy gap va va'da — lahza emas.", ru: 'Общая фраза и обещание — не момент.' }, ask: { uz: 'Mahsulotingiz hikoyasi qaysi lahzadan boshlanadi?', ru: 'С какого момента начинается история вашего продукта?' } }
    ]
  },
  5: {
    title: { uz: 'iPhone va Mentor hikoyasi', ru: 'iPhone и история Ментора' },
    cards: [
      { ic: '1', h: { uz: "2007-yilda telefon kompaniyalari ko'p tugma bilan bellashgan.", ru: 'В 2007 году телефонные компании соревновались числом кнопок.' } },
      { ic: '2', h: { uz: "Apple ko'p tugmani olib tashlagan: bitta ekran va Home tugmasi qolgan.", ru: 'Apple убрала много кнопок: остались один экран и кнопка Home.' } },
      { ic: '3', h: { uz: "Mentor ham pitch boshida ro'yxat o'rniga bitta lahzani qoldirdi.", ru: 'Ментор тоже в начале питча оставил вместо списка один момент.' }, ask: { uz: 'Pitchingizdan nimani olib tashlaysiz?', ru: 'Что вы уберёте из своего питча?' } }
    ]
  },
  7: {
    title: { uz: 'Hikoya pitchda qayerdan', ru: 'Где в питче история' },
    cards: [
      { ic: '1', h: { uz: "Lahza Muammo bo'lagini ochadi.", ru: 'Момент открывает часть «Проблема».' } },
      { ic: '2', h: { uz: "O'zgarish Yechimda, jonli demo bilan ko'rinadi.", ru: 'Изменение видно в Решении, с живым демо.' } },
      { ic: '3', h: { uz: "Raqamlar — hikoyaning qismi emas: mahsulotda nechta foydalanuvchi borligi.", ru: 'Цифры — не часть истории: сколько у продукта пользователей.' }, ask: { uz: "Sizning lahzangiz qaysi bo'lakni ochadi?", ru: 'Какую часть открывает ваш момент?' } }
    ]
  },
  11: {
    title: { uz: "Videoda ro'yxat chiqsa", ru: 'Если в видео получился список' },
    cards: [
      { ic: '1', h: { uz: "Videodan keyin uch savol: lahza bilan boshlandimi, ro'yxatsiz gapirdimmi, 1 daqiqaga sig'dimi.", ru: 'После видео три вопроса: начал ли с момента, говорил ли без списка, уложился ли в 1 минуту.' } },
      { ic: '2', h: { uz: "Ro'yxat chiqsa — uning o'rniga bitta lahza aytiladi.", ru: 'Если получился список — вместо него называют один момент.' } },
      { ic: '3', h: { uz: 'Video faqat telefoningizda qoladi.', ru: 'Видео остаётся только на вашем телефоне.' }, ask: { uz: "Ro'yxat o'rniga qaysi lahzani aytasiz?", ru: 'Какой момент вы назовёте вместо списка?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="sp-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — HikoyaSahna: telefon (JamoaTelefon) · hikoya chizig'i (kim · lahza · o'zgarish) · funksiyalar ro'yxati · pitch tasmasi + taymer · zal =====
// Odam figurasi chizilmaydi (SABOQ P1): kim — bitta urg'uli rol kartasi, zal va o'yinchilar — doirachalar qatori; hakam savoli — rol kartasi (pufak emas).
// Bitta manba: MENTOR_HIKOYA · FUNKSIYA_ROYXAT · JAMOA_PITCH · VAQT · HAKAM_SAVOL · IPHONE_KADR · VIDEO_SAVOL + o'quvchi kaliti pm-m12d2-hikoya (tayanch 8).
// 1-dars OltiBolakSahna dan ko'chirilmagan — dars ichida yozildi (K-020). reduced-motion — CSS da va kamHarakat() bilan.
// qolip-maket: sp-tahrir
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = ' ';
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const MJ = () => <span className="sp-mj">Maydon Jamoa</span>;
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const Brend = ({ r, children }) => <b className={cxx('sp-brend', r)}>{children}</b>; // iPhone · Nokia · BlackBerry — 11-Modul ranglari (9.97), logotipsiz

// --- Saqlanadigan natija (tayanch 8) va o'qiladigan kalit (1-dars) ---
const HIKOYA_KEY = 'pm-m12d2-hikoya';
const PITCH_KEY = 'pm-m12d1-pitch';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const QISM_ID = ['kim', 'lahza', 'ozgarish'];
const QISM_NOM = { kim: { uz: 'Kim', ru: 'Кто' }, lahza: { uz: 'Lahza', ru: 'Момент' }, ozgarish: { uz: "O'zgarish", ru: 'Изменение' } };
const QISM_MAX = { kim: 60, lahza: 160, ozgarish: 160 };
const VIDEO_BOSH = { yozildi: null, lahzaBilan: null, royxatYoq: null, vaqtgaSigdi: null, vaqt: null };
const hikoyaOl = () => {
  const h = lsO(HIKOYA_KEY) || {};
  const v = h.video && typeof h.video === 'object' ? h.video : {};
  const q = Object.fromEntries(QISM_ID.map(k => [k, typeof h[k] === 'string' && h[k].trim() ? h[k] : null]));
  return { ...q, video: Object.fromEntries(Object.keys(VIDEO_BOSH).map(k => [k, v[k] === undefined ? null : v[k]])), savedAt: h.savedAt || null };
};
// Har «Saqlash» va har javobda faqat o'sha maydon yoziladi (birlashtiriladi); ism, telefon, video fayli, havola yozilmaydi
const hikoyaYoz = (qism, video) => {
  const h = hikoyaOl();
  const d = { kim: h.kim, lahza: h.lahza, ozgarish: h.ozgarish, ...(qism || {}), video: { ...h.video, ...(video || {}) }, savedAt: Date.now() };
  lsY(HIKOYA_KEY, d); return d;
};
const kartaSoni = (h) => QISM_ID.filter(k => h && typeof h[k] === 'string' && h[k].trim()).length;
const pitchQator = () => { const p = lsO(PITCH_KEY); const b = p && p.bolaklar; if (!b || typeof b !== 'object') return {}; const s = (v) => (typeof v === 'string' ? v.trim() : ''); return { muammo: s(b.muammo), yechim: s(b.yechim) }; };
const mss = (s) => { const n = Math.max(0, Math.floor(s)); return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); };

// --- Mentor misoli (tayanch 1.1, 1.2 AYNAN) ---
const MENTOR_HIKOYA = {
  kim: { uz: 'tashkilotchi', ru: 'организатор' },
  lahza: { uz: "Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.", ru: 'Суббота, 18:00. На площадке 8 человек, ещё 2 не пришли — игра не состоялась.' },
  ozgarish: { uz: `Endi tashkilotchi juma kuni ko'radi: 9${NB}/${NB}10, bitta joy bo'sh.`, ru: `Теперь организатор в пятницу видит: 9${NB}/${NB}10, одно место свободно.` }
};
const FUNKSIYA_ROYXAT = [{ uz: "O'yin e'loni", ru: 'Объявление игры' }, { uz: "Qo'shilish", ru: 'Присоединение' }, { uz: 'Eslatmalar', ru: 'Напоминания' }, { uz: 'Telegram xabari', ru: 'Сообщение в Telegram' }, { uz: 'Taklif havolasi', ru: 'Ссылка-приглашение' }, { uz: 'Pro', ru: 'Pro' }];
const BOLAK_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi'];
const BOLAK_NOM = { muammo: { uz: 'Muammo', ru: 'Проблема' }, bozor: { uz: 'Bozor', ru: 'Рынок' }, yechim: { uz: 'Yechim', ru: 'Решение' }, raqamlar: { uz: 'Raqamlar', ru: 'Цифры' }, jamoa: { uz: 'Jamoa', ru: 'Команда' }, keyingi: { uz: 'Keyingi qadam', ru: 'Следующий шаг' } };
const VAQT = [40, 30, 90, 60, 30, 50]; // tayanch 9.1 — bu mashqda, jami 5:00
const JAMOA_PITCH = {
  muammo: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'Игрокам трудно собрать людей в команду. У 4 из 5 игроков, которых я спросил, в последней игре не хватило людей или кто-то не пришёл.' },
  bozor: { uz: "Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.", ru: 'В футбольной группе махалли — 60 человек; в приложении — 6 организаторов. Другие махалли мы ещё не проверяли.' },
  yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' },
  raqamlar: { uz: "51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.", ru: '51 пользователь; 11 из них — мои одноклассники, 7 пришли по ссылке-приглашению. 3 организатора письменно подтвердили Pro — это ещё не оплата.' },
  jamoa: { uz: "Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.", ru: 'Я — идея, продукт и код (с агентом). Пробовали — 6 организаторов и игроки.' },
  keyingi: { uz: "Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.", ru: 'С тремя организаторами проверю «Постоянную игру» в тестовом режиме. Одна просьба к вам: познакомьте с владельцами площадок в махалле.' }
};
const S6_MUAMMO = { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida…", ru: 'Игрокам трудно собрать людей в команду. У 4 из 5 игроков, которых я спросил…' }; // MD 6-ekran 1-qadam aynan
const HAKAM_SAVOL = { muammo: { uz: 'Bu muammo borligini qayerdan bilasiz?', ru: 'Откуда вы знаете, что эта проблема есть?' } };
const birinchiGap = (s) => { const t = String(s || '').trim(); const m = t.match(/^.+?[.!?](\s|$)/); return m ? m[0].trim() : t; };

// --- Ekran maqsadlari (PM: quruvchi + SCREEN_INTENTS; ekranga chiqmaydi) ---
const SCREEN_INTENTS = [
  "kirish: ro'yxat bilan boshlangan pitchdan zal nimani bilib oladi", "reja: hikoya yozib, telefonga aytib ko'rish", "ro'yxat o'rniga kim · lahza · o'zgarish; mahsulot hikoyasi tug'iladi",
  "test: lahzali gap (kitob almashish)", "iPhone: ko'p tugma olib tashlangan, keraklisi qolgan", "test: o'xshash usul", "hikoya ikki bo'lakka: Muammo va Yechim; Raqamlar tashqarida",
  "test: hikoya Muammo boshida", "o'z hikoyasi uch kartaga, pm-m12d2-hikoya", "telefonga 1 daqiqa; rozilik darvozasi", "o'zini tekshirish: uch savol",
  "yakuniy test: videoda ro'yxat chiqsa", 'podium', 'kartochkalar', 'yakun: 5 holat'
];

// --- Matn tekshiruvi (8, 10-ekranlar): ikki tilli; apostrof shakllari normT bilan bir xil (PM-108 — node da sinalgan) ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const PII_RE = /@|t\.me\/|\+998|\d{7,}|(?:\d[\s-]?){9,}|http|www\.|\.uz\b|\.com\b/;
const VAQT_RE = /\d|(^|[^a-z'а-яё])(dushanba|seshanba|chorshanba|payshanba|juma|shanba|yakshanba|kecha|bugun|ertalab|kechqurun|tanaffus|soat|hafta|oy(?:da|i|ning)?(?![a-z'])|понедельник|вторник|сред[ауы]|четверг|пятниц|суббот|воскресень|вчера|сегодня|утром|вечером|перемен|час|недел|месяц)/;
const UMUMIY_RE = /(^|[^a-z'а-яё])(har doim|doim|ko'pincha|odatda|hamma|всегда|часто|обычно|все)(?![a-z'а-яё])/;
const VADA_RE = /(^|[^a-z'а-яё])(tez orada|albatta|yetamiz|hamma ishlatadi|скоро|обязательно|достигнем|все будут пользоваться)(?![a-z'а-яё])/;
const TEXNO_RE = /(^|[^a-z])(react|expo|nestjs|neon|render|netlify|socket\.io)(?![a-z])/;
// bloklaydi: bo'sh · 60/160 · telefon/akkaunt/havola; yo'naltiradi (ikkinchi «Saqlash» bilan o'tadi): qolganlari — lahza detektori hech qachon bloklamaydi (9.35)
const tekshirHikoya = (qism, matn) => {
  const s = String(matn || '').trim(); const n = normT(s);
  if (!n) return { x: 'bosh', blok: true };
  if (qism === 'kim' && s.length > 60) return { x: 'kimUzun', blok: true };
  if (qism !== 'kim' && s.length > 160) return { x: 'uzun', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (qism === 'lahza' && UMUMIY_RE.test(n)) return { x: 'umumiy' };
  if (qism === 'lahza' && !VAQT_RE.test(n)) return { x: 'vaqtYoq' };
  if (qism === 'ozgarish' && VADA_RE.test(n)) return { x: 'vada' };
  if (qism === 'ozgarish' && TEXNO_RE.test(n)) return { x: 'texno' };
  return null;
};

// --- Yordamchi ilgaklar ---
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  {matn && <span className="sp-xq-m">{matn}</span>}
  {izoh && <span className="sp-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="sp-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="sp-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);
// Bosqich tugmalari (ixcham, bir qatorda; joriysi accent halqada, bosilgani ✓)
const Qadamlar3 = ({ nomlar, q, faol, onBos }) => (
  <div className="sp-qadamlar">
    {nomlar.map((n, i) => (
      <QChip key={i} holat={i < q ? 'ok' : i === q && faol ? 'on' : undefined} className={cxx(i === q && faol && 'sp-joriy')} disabled={!faol || i !== q} onClick={onBos}>
        <i>{i < q ? '✓' : i + 1}</i>{tr(n)}
      </QChip>
    ))}
  </div>
);
const IPUCHA = (t) => <p className="sp-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('sp-bash', taxmin && 'ix')}>{el}</div>;

// --- Belgilar (SVG; odam figurasi emas) ---
const Kalendar = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-1 4.5h16M8.5 4v4M15.5 4v4m-7 6.5h2m3 0h2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Portfel = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.5V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5M4.5 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm-1 5.5h17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

// --- Telefon: «Maydon Jamoa» — «O'yin» ekrani (≈170×272, o'lchami barqaror); o'zgarish holatida «Juma» va «bitta joy bo'sh» ---
const JamoaTelefon = ({ son = 8, juma = false }) => (
  <div className="sp-tel">
    <div className="sp-tel-ekran">
      <span className="sp-tel-nom"><MJ /></span>
      <span className="sp-tel-y">{juma ? <b className="sp-tel-juma">{tr({ uz: 'Juma', ru: 'Пятница' })}</b> : null}{tr({ uz: "O'yin", ru: 'Игра' })}</span>
      <b className="sp-tel-vaqt">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
      <span className="sp-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
      <b key={son} className={cxx('sp-tel-son', son > 8 && 'yangi')}>{son}{NB}/{NB}10</b>
      <span className="sp-tel-doira">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < son ? 'bor' : ''} />)}</span>
      {juma && <em className="sp-tel-bosh">{tr({ uz: "bitta joy bo'sh", ru: 'одно место свободно' })}</em>}
      <span className="sp-tel-tugma">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div>
  </div>
);
// --- Zal: bitta rol kartasi, ko'p odam — doirachalar qatori (SABOQ P1); reaksiya chizilmaydi ---
const Zal = () => (
  <div className="sp-rolk zal">
    <span className="sp-zal-d" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</span>
    <b>{tr({ uz: 'Zal', ru: 'Зал' })}</b>
  </div>
);
// --- Hakam: bitta rol kartasi + savol (? → ✓) ---
const Hakam = ({ ok }) => (
  <div className="sp-rolk hakam">
    <span className="sp-rolk-ava"><Portfel /></span>
    <b>{tr({ uz: 'Hakam', ru: 'Судья' })}</b>
    <span className={cxx('sp-rolk-s', ok && 'ok')}><i key={ok ? 'ok' : 'q'}>{ok ? '✓' : '?'}</i>{tr(HAKAM_SAVOL.muammo)}</span>
  </div>
);
// --- Funksiyalar ro'yxati (0, 2-ekran): holat — yur (chiziq bo'ylab birma-bir) · ok (✓ yonadi) · kulrang (+ nomsiz uzuq uya) · yozildi · xira ---
const Royxat = ({ holat = 'yozildi', uya = false, chiziq40 = false }) => (
  <div className={cxx('sp-royxat', holat)}>
    <span className="sp-royxat-y">«<MJ />» {tr({ uz: 'funksiyalari', ru: '— функции' })}</span>
    <div className="sp-royxat-q" key={holat}>
      {FUNKSIYA_ROYXAT.map((f, i) => <span key={i} className="sp-fn" style={{ animationDelay: (holat === 'yur' ? 0.3 + i * 0.6 : holat === 'ok' ? i * 0.18 : 0) + 's' }}>{holat === 'ok' && <i>✓</i>}{tr(f)}</span>)}
      {uya && <span className="sp-fn-uya" aria-hidden="true" />}
    </div>
    {chiziq40 && <div className="sp-40">
      <div className="sp-40-l"><i /></div>
      <div className="sp-40-c"><span>{tr({ uz: 'Muammo', ru: 'Проблема' })} · 0</span><span>{tr({ uz: '40 soniya', ru: '40 секунд' })}</span></div>
    </div>}
  </div>
);
// --- Hikoya chizig'i: uch uya (kim — rol kartasi · lahza — maydon chizmasi · o'zgarish — kichik ekran) ---
const Maydon = () => (
  <div className="sp-mdn">
    <b className="sp-mdn-v">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
    <div className="sp-mdn-joy">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < 8 ? 'bor' : 'yoq'} style={{ animationDelay: (0.2 + i * 0.12) + 's' }} />)}</div>
    <em className="sp-mdn-y">{tr({ uz: "o'yin bo'lmadi", ru: 'игра не состоялась' })}</em>
  </div>
);
const MiniEkran = () => (
  <div className="sp-mekran">
    <span className="sp-mekran-j">{tr({ uz: 'Juma', ru: 'Пятница' })}</span>
    <b>9{NB}/{NB}10</b>
    <em>{tr({ uz: "bitta joy bo'sh", ru: 'одно место свободно' })}</em>
  </div>
);
const Uya = ({ n, nom, holat, children, gap, refEl }) => (
  <div ref={refEl} className={cxx('sp-uya', holat)}>
    <span className="sp-uya-n">{nom || n}</span>
    {!/bosh/.test(holat) && children && <div className="sp-uya-r">{children}</div>}
    {!/bosh/.test(holat) && gap && <p className="sp-uya-g">{gap}</p>}
  </div>
);
// Mentor misoli: q — nechta uya to'lgan; ixcham — chizmasiz (6-ekran); uchdi — bo'lakka uchib ketgan qismlar
const HikoyaChiziq = ({ q = 3, joriy = -1, yangi = -1, ixcham = false, uchdi = [], refs = {} }) => (
  <div className={cxx('sp-chiziq', ixcham && 'ixcham')}>
    {QISM_ID.map((id, i) => {
      const holat = i < q ? cxx('toldi', i === yangi && 'yangi', uchdi.includes(id) && 'uchdi') : i === joriy ? 'bosh joriy' : 'bosh';
      const ich = id === 'kim'
        ? <div className="sp-rolk kim"><span className="sp-rolk-ava"><Kalendar /></span><b>{tr(MENTOR_HIKOYA.kim)}</b></div>
        : ixcham ? null : id === 'lahza' ? <Maydon /> : <MiniEkran />;
      return <Uya key={id} n={i + 1} nom={i < q ? tr(QISM_NOM[id]) : null} holat={holat} refEl={el => { refs[id] = el; }} gap={id === 'kim' ? null : tr(MENTOR_HIKOYA[id])}>{ich}</Uya>;
    })}
  </div>
);
// O'quvchi rejimi (8-ekran): telefonsiz, uch uya o'quvchi matni bilan — yozilishi bilan ko'rinadi
const OquvchiUyalar = ({ matn = {}, saq = {}, joriy, yangi }) => (
  <div className="sp-chiziq oquvchi">
    {QISM_ID.map((id, i) => {
      const t = String(matn[id] || '').trim();
      const holat = t ? cxx('toldi', saq[id] && 'saqlandi', yangi === id && 'yangi', joriy === id && 'joriy') : cxx('bosh', joriy === id && 'joriy');
      return (
        <div key={id} className={cxx('sp-uya', holat)}>
          <span className="sp-uya-n">{i + 1} · {tr(QISM_NOM[id])}{saq[id] && <i className="sp-uya-ok">✓</i>}</span>
          {t && <p className="sp-uya-g">{t}</p>}
        </div>
      );
    })}
  </div>
);
// --- Taymer chizig'i 0–5:00 (olti bo'lak, VAQT — 9.1; 12-Modul TaymerChiziq naqshi); hikoya Muammoning boshida (≈8 s) yashil ---
const TaymerChiziq = ({ lahza = false }) => (
  <div className="sp-tm">
    <div className="sp-tm-chiziq">
      {BOLAK_ID.map((id, i) => (
        <span key={id} className="sp-tm-bo" style={{ flex: VAQT[i] }}>
          <span className="sp-tm-t">{id === 'muammo' && lahza && <i />}</span>
          <em>{i === 0 ? '0:00 · ' : ''}{tr(BOLAK_NOM[id])}{i === 5 ? ' · 5:00' : ''}</em>
        </span>
      ))}
    </div>
  </div>
);
// Yechimdagi jonli demo: «8 / 10» → «9 / 10»
const DemoSon = ({ darhol }) => {
  const [s, setS] = useState(darhol || kamHarakat() ? 9 : 8);
  useEffect(() => { if (s === 9) return undefined; const t = setTimeout(() => setS(9), 650); return () => clearTimeout(t); }, []); // eslint-disable-line
  return <b key={s} className={cxx('sp-demo-son', s === 9 && 'yangi')}>{s}{NB}/{NB}10</b>;
};
// --- Pitch tasmasi: olti bo'lak, har birida Mentor qoralamasining birinchi gapi kulrang (tayanch 1.1 aynan) ---
// q: 0 · 1 — kim va lahza Muammoda · 2 — o'zgarish Yechimda (jonli demo 9 / 10) · 3 — Raqamlar alohida yonadi (hikoyadan tashqari)
const PitchTasma = ({ q = 0, refs = {}, darhol = false, katta = false }) => (
  <div className={cxx('sp-tasma', katta && 'katta')}>
    <div className="sp-tasma-b">
      {BOLAK_ID.map(id => {
        const on = (id === 'muammo' && q >= 1) || (id === 'yechim' && q >= 2);
        const tashqi = id === 'raqamlar' && q >= 3;
        return (
          <div key={id} ref={el => { refs[id] = el; }} className={cxx('sp-bo', on && 'hikoya', tashqi && 'tashqi')}>
            <div className="sp-bo-h"><b>{tr(BOLAK_NOM[id])}</b>{id === 'yechim' && <em className={cxx('sp-demo', q >= 2 && 'on')}>{tr({ uz: 'jonli demo', ru: 'живое демо' })}{q >= 2 && <DemoSon darhol={darhol} />}</em>}</div>
            {id === 'muammo' && q >= 1 && <span className="sp-bo-rol">{tr(MENTOR_HIKOYA.kim)}</span>}
            {id === 'muammo' && q >= 1 && <span className="sp-bo-hk">{tr(MENTOR_HIKOYA.lahza)}</span>}
            {id === 'yechim' && q >= 2 && <span className="sp-bo-hk">{tr(MENTOR_HIKOYA.ozgarish)}</span>}
            <span className="sp-bo-m">{id === 'muammo' && q >= 1 ? tr(S6_MUAMMO) : birinchiGap(tr(JAMOA_PITCH[id]))}</span>
          </div>
        );
      })}
    </div>
    <TaymerChiziq lahza={q >= 1} />
  </div>
);
// Bitta vizual — rejim: 'royxat' (0) · 'hikoya' (2) · 'pitch' (6, telefonsiz)
const HikoyaSahna = ({ rejim = 'hikoya', telefon = true, telSon = 8, juma = false, royxat, zal, chiziq, tasma, hakam, className }) => (
  <div className={cxx('sp-sahna', !telefon && 'tel-yoq', rejim === 'hikoya' && 'r-hikoya', className)}>
    {telefon && <div className="sp-sahna-tel"><JamoaTelefon son={telSon} juma={juma} /></div>}
    <div className="sp-sahna-ong">
      {zal && <Zal />}
      {royxat && <Royxat {...royxat} />}
      {chiziq && <HikoyaChiziq {...chiziq} />}
      {hakam}
      {tasma && <PitchTasma {...tasma} />}
    </div>
  </div>
);
// «Hikoyam» kartasi (8-ekran yakuni, 9, 10, 11-ekranlar) — uch qator; mentor — Mentor misoli
const HikoyamKarta = ({ h, mentor, yonadi = {}, tahrir, belgi }) => {
  const src = mentor ? { kim: tr(MENTOR_HIKOYA.kim), lahza: tr(MENTOR_HIKOYA.lahza), ozgarish: tr(MENTOR_HIKOYA.ozgarish) } : (h || {});
  const n = QISM_ID.filter(k => src[k]).length;
  return (
    <div className="sp-hk">
      <div className="sp-hk-h"><b>{mentor ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : tr({ uz: 'Hikoyam', ru: 'Моя история' }) + ' · ' + n + '/3'}</b>{belgi && <em className="sp-hk-b" key={belgi}>{belgi}</em>}</div>
      {QISM_ID.map(k => (
        <div key={k + (yonadi[k] || '')} className={cxx('sp-hk-q', yonadi[k], !src[k] && 'bosh')}>
          <span className="sp-hk-n">{tr(QISM_NOM[k])}</span>
          <span className="sp-hk-m">{src[k] || ''}</span>
          {tahrir && <button type="button" className="sp-tahrir" onClick={() => tahrir(k)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
        </div>
      ))}
    </div>
  );
};
// Testlardan keyingi kichik vizual (SABOQ 4)
const MiniUyalar = ({ items }) => (
  <div className="sp-mini">{items.map((it, i) => <span key={i} className={cxx('sp-mini-u', it.kulrang && 'kulrang', it.yon && 'yon')} style={{ animationDelay: (i * 0.08) + 's' }}><b>{it.n}</b>{it.t}</span>)}</div>
);

// ===== SCREEN 0 — KIRISH (QKirish; «Aynan!» / «Qiziq fikr!» — T-028, T-067; ballsiz — J-026: correct false hammaga) =====
const HOOK_OPTS = [
  { id: 'funksiya', t: { uz: 'Mahsulotda qanday funksiyalar borligini', ru: 'Какие функции есть в продукте' } },
  { id: 'voqea', t: { uz: "Kimda qanday voqea bo'lib o'tganini", ru: 'С кем какой случай произошёл' } },
  { id: 'kimga', t: { uz: 'Bu mahsulot kimga va nega kerakligini', ru: 'Кому и зачем нужен этот продукт' } }
];
const HOOK_JAVOB = {
  funksiya: { uz: <><b>Aynan!</b> Ro'yxat mahsulotda nima borligini aytadi. Kimda qanday muammo bo'lgani hali aytilmadi.</>, ru: <><b>Именно!</b> Список говорит, что есть в продукте. У кого какая была проблема — ещё не сказано.</> },
  voqea: { uz: <><b>Qiziq fikr!</b> Ro'yxatga qarang: unda odam ham, kun ham yo'q — faqat funksiyalar.</>, ru: <><b>Интересная мысль!</b> Посмотрите на список: в нём нет ни человека, ни дня — только функции.</> },
  kimga: { uz: <><b>Qiziq fikr!</b> Ro'yxat nima borligini aytadi, kimga va nega kerakligini emas.</>, ru: <><b>Интересная мысль!</b> Список говорит, что есть, а не кому и зачем это нужно.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('sp-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Mahsulotingiz hikoyasini <A>qanday aytasiz?</A></>, ru: <>Как рассказать <A>историю вашего продукта?</A></> })}
          mentor={<Mentor>{tr({ uz: "Pitchingiz mahsulotdagi funksiyalar ro'yxati bilan boshlansa, zal birinchi 40 soniyada nimani bilib oladi?", ru: 'Если ваш питч начнётся со списка функций продукта, что зал узнает за первые 40 секунд?' })}</Mentor>}
          maket={<HikoyaSahna rejim="royxat" zal royxat={{ holat: picked === 'funksiya' ? 'ok' : picked ? 'kulrang' : 'yur', uya: !!picked && picked !== 'funksiya', chiziq40: true }} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual o'zi yoziladi — matnsiz skelet, P-015; tugagach «Boshlaymiz» halqada) =====
const REJA = [
  { t: { uz: "Funksiyalar ro'yxati bilan hikoya farqini ko'rasiz", ru: 'Увидите разницу между списком функций и историей' }, teg: { uz: 'hikoya', ru: 'история' } },
  { t: { uz: "Hikoya pitchning qaysi bo'laklariga tushishini bilib olasiz", ru: 'Узнаете, в какие части питча попадает история' }, teg: { uz: "bo'laklar", ru: 'части' } },
  { t: { uz: "O'z mahsulotingiz hikoyasini kartalarga yozasiz", ru: 'Запишете историю своего продукта на карточки' }, teg: { uz: 'karta', ru: 'карточка' } },
  { t: { uz: "Hikoyani telefonga aytib, o'zingiz tekshirasiz", ru: 'Расскажете историю на телефон и проверите себя' }, teg: { uz: 'video', ru: 'видео' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [tayyor, setTayyor] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTayyor(true), kamHarakat() ? 0 : 4400); return () => clearTimeout(t); }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun mahsulotingiz hikoyasini <A>yozib, aytib ko'rasiz.</A></>, ru: <>Сегодня вы <A>запишете и расскажете</A> историю своего продукта.</> })}
        mentor={<Mentor>{tr({ uz: "O'tgan darsdagi pitch qoralamangiz saqlangan bo'lsa, uning Muammo va Yechimi kartalar ustida yordamga chiqadi.", ru: 'Если ваш черновик питча с прошлого урока сохранён, его Проблема и Решение появятся над карточками как подсказка.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<div className="sp-reja">
          <span className="sp-reja-teg">{tr({ uz: "5 daqiqalik pitch — hikoya, funksiyalar ro'yxati emas", ru: '5-минутный питч — история, а не список функций' })}</span>
          <div className="sp-skelet">
            <span className="sp-skelet-tel" aria-hidden="true"><i /></span>
            <div className="sp-skelet-u">{QISM_ID.map((id, i) => <span key={id} className="sp-skelet-b" style={{ animationDelay: (0.3 + i * 0.6) + 's' }}>{i + 1}</span>)}</div>
          </div>
          <div className="sp-skelet-tm"><div className="sp-40-l"><i /></div><div className="sp-40-c"><span>0:00</span><span>1:00</span></div></div>
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — RO'YXAT VA LAHZA (QTushuncha keng; bashorat → 3 tugma ketma-ket → ro'yxat o'rniga uch uya; markaziy) =====
const S2_TUGMA = [{ uz: 'Kim', ru: 'Кто' }, { uz: 'Lahza', ru: 'Момент' }, { uz: "O'zgarish", ru: 'Изменение' }];
const S2_IZOH = [
  { uz: "Ro'yxatda odam yo'q edi — bu yerda bitta odam bor: tashkilotchi.", ru: 'В списке не было человека — здесь есть один человек: организатор.' },
  { uz: "9-Modulda shuni hikoya dedik: bitta real odam bilan bo'lib o'tgan ish.", ru: 'В 9-м модуле мы назвали это историей: случай, который произошёл с одним реальным человеком.' },
  { uz: "Bugun hikoyaga uchinchi qism qo'shildi: mahsulot bilan kelgan o'zgarish.", ru: 'Сегодня к истории добавилась третья часть: изменение, которое пришло с продуктом.' }
];
const S2_TAXMIN = [{ k: 'bitta', t: { uz: 'Bitta', ru: 'Один' } }, { k: 'uchta', t: { uz: 'Uchta', ru: 'Три' } }, { k: 'hammasi', t: { uz: 'Hammasini', ru: 'Все' } }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  const sahna = <HikoyaSahna rejim="hikoya" telSon={q >= 3 ? 9 : 8} juma={q >= 3} className={cxx(tugadi && 'tugadi')}
    royxat={tugadi ? null : { holat: q === 0 ? 'yozildi' : 'xira' }}
    chiziq={{ q, joriy: taxmin && !done ? q : -1, yangi: tugadi ? -1 : q - 1 }} />;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · ro'yxat va hikoya", ru: 'Понятие · список и история' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Ro'yxat o'rniga zalga <A>nimani aytasiz?</A></>, ru: <>Что вы скажете залу <A>вместо списка?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va Mentor ro'yxat o'rniga nimani aytishiga qarang.", ru: 'Нажимайте кнопки по одной и смотрите, что Ментор говорит вместо списка.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Mentor ro'yxat o'rniga nechta voqeani aytadi?", ru: 'Сколько случаев Ментор назовёт вместо списка?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="sp-harakat">
          <Qadamlar3 nomlar={S2_TUGMA} q={q} faol={!!taxmin} onBos={() => setQ(n => Math.min(3, n + 1))} />
          {q > 0 && <QIzoh key={q}>{tr(S2_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — uyaga nima tushishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, что попадёт в ячейку.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'bitta'} aslida={tr({ uz: 'bitta', ru: 'один' })} />}
          matn={tr({ uz: "Mahsulot hikoyasi — bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish.", ru: 'История продукта — один человек, один момент и изменение, которое пришло с продуктом.' })}
          izoh={tr(S2_IZOH[2])} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1; ikkinchi misol — kitob almashish ilovasi, P-002) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · lahza', ru: 'Проверка · момент' })}
    questionText="Kitob almashish ilovasi pitchida qaysi gap hikoyani boshlaydi?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish ilovasi pitchida <A>qaysi gap hikoyani boshlaydi?</A></h2>, ru: <h2 className="title h-ask">Какая фраза <A>начинает историю</A> в питче приложения для обмена книгами?</h2> })}
    options={[
      { uz: 'Ilovada kitob qidiruvi, chat va xarita bor', ru: 'В приложении есть поиск книг, чат и карта' },
      { uz: 'Dushanba tanaffusida sinfdosh kitob topolmadi', ru: 'В понедельник на перемене одноклассник не нашёл книгу' },
      { uz: "O'quvchilar ko'pincha kitob topishda qiynaladi", ru: 'Ученикам часто трудно найти книгу' },
      { uz: 'Yil oxirigacha hamma maktab kitob almashadi', ru: 'К концу года все школы будут обмениваться книгами' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Unda bitta odam va bo'lib o'tgan bitta lahza bor.", ru: 'В ней есть один человек и один момент, который произошёл.' }}
    explainWrong={{
      0: { uz: "Bu funksiyalar ro'yxati — unda odam bormi?", ru: 'Это список функций — есть ли в нём человек?' },
      2: { uz: "Bu umumiy gap — qaysi kuni, kim bilan bo'ldi?", ru: 'Это общая фраза — в какой день, с кем это было?' },
      3: { uz: "Bu va'da — bo'lib o'tgan lahza qayerda?", ru: 'Это обещание — где момент, который произошёл?' },
      default: { uz: 'Mentor lahzasida qaysi kun va soat bor edi?', ru: 'Какие день и час были в моменте Ментора?' }
    }}
    vizual={<MiniUyalar items={[{ n: tr({ uz: 'kim', ru: 'кто' }), t: tr({ uz: 'sinfdosh', ru: 'одноклассник' }) }, { n: tr({ uz: 'lahza', ru: 'момент' }), t: tr({ uz: 'dushanba, tanaffus', ru: 'понедельник, перемена' }) }, { n: tr({ uz: "o'zgarish", ru: 'изменение' }), t: '?', kulrang: true }]} />} />
);

// ===== SCREEN 4 — iPHONE (QVoqea; PM keys K19 — bank so'zi aynan, raqamsiz; kadr gapi Mentorda; nomlar o'z rangida, logotipsiz — SABOQ 2, 3, 8, 26) =====
const IPHONE_KADR = [
  { h: { uz: "Ko'p tugma", ru: 'Много кнопок' }, m: { uz: "2007-yilda telefon kompaniyalari kim ko'proq tugma qilishi bilan bellashgan. Nokia va BlackBerry'da klaviatura va stilus bo'lgan.", ru: 'В 2007 году телефонные компании соревновались, у кого больше кнопок. У Nokia и BlackBerry были клавиатура и стилус.' } },
  { h: { uz: 'Bitta ekran', ru: 'Один экран' }, m: { uz: "Apple esa klaviatura, stilus va deyarli hamma tugmani olib tashlagan. Telefonda bitta ekran va Home tugmasi qolgan.", ru: 'А Apple убрала клавиатуру, стилус и почти все кнопки. В телефоне остались один экран и кнопка Home.' } },
  { h: { uz: 'Uch qurilma bittada', ru: 'Три устройства в одном' }, m: { uz: "Stiv Jobs iPhone'ni «uch qurilma bittada» deb taqdim etgan: iPod, telefon va internet. iPod — Apple'ning musiqa pleeri.", ru: 'Стив Джобс представил iPhone как «три устройства в одном»: iPod, телефон и интернет. iPod — музыкальный плеер Apple.' } }
];
const S4_TAXMIN = [{ k: 'olib', t: { uz: 'Deyarli hammasini olib tashlagan', ru: 'Убрала почти все' } }, { k: 'oshancha', t: { uz: "O'shancha qoldirgan", ru: 'Оставила столько же' } }, { k: 'kop', t: { uz: "Ko'paytirgan", ru: 'Добавила' } }];
const QURILMA = [{ k: 'ipod', t: 'iPod' }, { k: 'tel', t: { uz: 'telefon', ru: 'телефон' } }, { k: 'net', t: { uz: 'internet', ru: 'интернет' } }];
const QurilmaBelgi = ({ k }) => (k === 'ipod'
  ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="15" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M9 5.5h6v4H9z" fill="currentColor" /></svg>
  : k === 'tel'
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h2.6l1.4 4-2 1.4a10.5 10.5 0 0 0 6.5 6.5l1.4-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M2.5 8.5h19" stroke="currentColor" strokeWidth="1.8" /><circle cx="5.5" cy="6.3" r=".9" fill="currentColor" /><circle cx="8.3" cy="6.3" r=".9" fill="currentColor" /></svg>);
const IphoneSahna = ({ b }) => (
  <div className={cxx('sp-ip', 'k' + b)} key={'k' + b}>
    {b === 0 && <div className="sp-ip-eski">
      <div className="sp-ip-tel klav"><span className="sp-ip-ekr kichik" /><span className="sp-ip-klav">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ animationDelay: (0.15 + i * 0.07) + 's' }} />)}</span></div>
      <div className="sp-ip-tel stilus"><span className="sp-ip-ekr" /><span className="sp-ip-klav kam">{Array.from({ length: 6 }).map((_, i) => <i key={i} style={{ animationDelay: (1.9 + i * 0.1) + 's' }} />)}</span><span className="sp-ip-qalam" /></div>
      <span className="sp-ip-nomlar"><Brend r="nokia">Nokia</Brend> · <Brend r="bb">BlackBerry</Brend></span>
    </div>}
    {b === 1 && <div className="sp-ip-otish">
      <div className="sp-ip-tel klav ketadi"><span className="sp-ip-ekr kichik" /><span className="sp-ip-klav">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ animationDelay: (i * 0.04) + 's' }} />)}</span><span className="sp-ip-qalam ketadi" /></div>
      <div className="sp-ip-iphone"><span className="sp-ip-katta" /><span className="sp-ip-home" /><em className="sp-ip-hy">Home</em><Brend r="iphone">iPhone</Brend></div>
    </div>}
    {b === 2 && <div className="sp-ip-uch">
      <div className="sp-ip-qur">{QURILMA.map((d, i) => <span key={d.k} className="sp-ip-q" style={{ animationDelay: (0.4 + i * 0.75) + 's' }}><QurilmaBelgi k={d.k} /><em>{tr(d.t)}</em></span>)}</div>
      <div className="sp-ip-iphone"><span className="sp-ip-katta ichida">{QURILMA.map((d, i) => <i key={d.k} style={{ animationDelay: (1.0 + i * 0.75) + 's' }}><QurilmaBelgi k={d.k} /></i>)}</span><span className="sp-ip-home" /><Brend r="iphone">iPhone</Brend></div>
      <span className="sp-ip-ibora">{tr({ uz: 'uch qurilma bittada', ru: 'три устройства в одном' })}</span>
    </div>}
  </div>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tanla = (k) => { if (taxmin || b !== 0) return; setTaxmin(k); setTimeout(() => setB(1), kamHarakat() ? 0 : 650); };
  const kadr = IPHONE_KADR[b];
  const tx = S4_TAXMIN.find(t => t.k === taxmin);
  const davom = () => { if (b < 2) setB(b + 1); else onNext(); };
  const yorliq = <><Brend r="iphone">iPhone</Brend> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={(b === 1) || done} disabled={b === 0 && !taxmin} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Voqea davomi (${b + 1}/3)`, ru: `Продолжение истории (${b + 1}/3)` })} onClick={davom} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Brend r="iphone">iPhone</Brend> 2007-yilda <A>nima bilan ajralib turgan?</A></>, ru: <>Чем <Brend r="iphone">iPhone</Brend> <A>выделялся в 2007 году?</A></> })}
        nuqtalar={<>
          <Mentor key={'m' + b}>{tr(kadr.m)}</Mentor>
          <div className="sp-nuq"><span className="sp-nuq-y">{yorliq}</span>{IPHONE_KADR.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="sp-voqea">
          <span className="sp-voqea-h" key={'h' + b}>{tr(kadr.h)}</span>
          {b === 0 && <p className="sp-tanish"><Brend r="iphone">iPhone</Brend> — {tr({ uz: 'Apple kompaniyasining telefoni.', ru: 'телефон компании Apple.' })} <Brend r="nokia">Nokia</Brend> {tr({ uz: 'va', ru: 'и' })} <Brend r="bb">BlackBerry</Brend> — {tr({ uz: '2007-yilda telefon chiqargan kompaniyalar.', ru: 'компании, выпускавшие телефоны в 2007 году.' })}</p>}
          {b === 2 && <p className="sp-tanish">{tr({ uz: "Stiv Jobs — o'sha paytdagi Apple rahbari.", ru: 'Стив Джобс — руководитель Apple в то время.' })}</p>}
          <div className="sp-voqea-g"><Zoomable><IphoneSahna b={b} /></Zoomable><div className="sp-voqea-o">
          {ixchamBashorat(taxmin, <QBashorat yorliq={<><Brend r="iphone">iPhone</Brend> · 1/3</>}
            savol={tr({ uz: "Apple iPhone'da tugmalarni nima qilgan?", ru: 'Что Apple сделала с кнопками в iPhone?' })}
            variantlar={S4_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) + (b >= 1 && taxmin === v.k ? (v.k === 'olib' ? ' ✓' : ' ✕') : '') }))} tanlov={taxmin} onTanla={tanla} />)}
          {b >= 1 && tx && <QXulosa><XulosaQ taxmin={<TaxminQ togri={taxmin === 'olib'} aslida={tr({ uz: 'deyarli hammasini olib tashlagan', ru: 'убрала почти все' })} />}
            matn={done && tr({ uz: "Bu voqeada Apple ko'p tugmani olib tashlagan, Jobs esa iPhone'ni tanish uch narsa bilan atagan.", ru: 'В этой истории Apple убрала много кнопок, а Джобс назвал iPhone тремя знакомыми вещами.' })} /></QXulosa>}
          </div></div>
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 3; keys ko'prigi — «o'xshash usul») =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · iPhone voqeasi', ru: 'Проверка · история iPhone' })}
    questionText="iPhone voqeasi va Mentor hikoyasida qaysi usul o'xshash?"
    question={tr({ uz: <h2 className="title h-ask">iPhone voqeasi va Mentor hikoyasida <A>qaysi usul o'xshash?</A></h2>, ru: <h2 className="title h-ask">Какой приём <A>похож</A> в истории iPhone и в истории Ментора?</h2> })}
    options={[
      { uz: 'Ikkalasida hamma funksiya birma-bir sanalgan', ru: 'В обеих все функции перечислены по одной' },
      { uz: "Ikkalasida voqea 2007-yilda bo'lib o'tgan", ru: 'В обеих событие произошло в 2007 году' },
      { uz: "Ikkalasida tugmalar soni ko'paytirilgan", ru: 'В обеих число кнопок увеличили' },
      { uz: "Ikkalasida ko'p o'rniga keraklisi qolgan", ru: 'В обеих вместо многого осталось нужное' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Apple tugmani, Mentor esa pitch boshidagi ro'yxatni olgan.", ru: 'Apple убрала кнопки, а Ментор — список в начале питча.' }}
    explainWrong={{
      0: { uz: 'Mentor hikoyasida funksiyalar sanaldimi?', ru: 'Перечислялись ли функции в истории Ментора?' },
      1: { uz: "Mentor lahzasi qaysi kuni bo'lgan edi?", ru: 'В какой день был момент Ментора?' },
      2: { uz: "Apple tugmalarni ko'paytirganmi?", ru: 'Разве Apple увеличила число кнопок?' },
      default: { uz: "Ikkalasida nima o'rniga nima qolganini eslang.", ru: 'Вспомните, что и вместо чего осталось в обеих.' }
    }}
    vizual={<div className="sp-mini-ikki">
      <div className="sp-mini-ip"><span className="sp-ip-katta" /><span className="sp-ip-home" /><Brend r="iphone">iPhone</Brend></div>
      <div className="sp-mini-o">
        <div className="sp-mini-fn">{FUNKSIYA_ROYXAT.map((f, i) => <span key={i}>{tr(f)}</span>)}</div>
        <MiniUyalar items={QISM_ID.map(id => ({ n: tr(QISM_NOM[id]).toLowerCase(), t: id === 'kim' ? tr(MENTOR_HIKOYA.kim) : id === 'lahza' ? tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' }) : `9${NB}/${NB}10`, yon: true }))} />
      </div>
    </div>} />
);

// ===== SCREEN 6 — HIKOYA PITCHDA (QTushuncha keng; bashorat → 3 tugma: Muammo · Yechim · Raqamlar; hikoya qismi bo'lakka ko'rinib uchadi — SABOQ P3; telefonsiz — SABOQ 24) =====
const S6_TUGMA = [{ uz: 'Muammo', ru: 'Проблема' }, { uz: 'Yechim', ru: 'Решение' }, { uz: 'Raqamlar', ru: 'Цифры' }];
const S6_IZOH = [
  { uz: "Lahza Muammoni ochadi; dalil esa bu bitta odamda emasligini aytadi: 5 o'yinchidan 4 tasida.", ru: 'Момент открывает Проблему; а довод говорит, что это не у одного человека: у 4 из 5 игроков.' },
  { uz: "O'zgarish Yechimda jonli demo bilan ko'rinadi: ekranda «9 / 10».", ru: 'Изменение видно в Решении с живым демо: на экране «9 / 10».' },
  { uz: "Hikoya bitta odamni ko'rsatadi; Raqamlar — bu odamdan tashqaridagi son: 51 foydalanuvchi.", ru: 'История показывает одного человека; Цифры — число за пределами этого человека: 51 пользователь.' }
];
const S6_TAXMIN = [{ k: 'bir', t: { uz: 'Bittasiga', ru: 'В одну' } }, { k: 'ikki', t: { uz: 'Ikkitasiga', ru: 'В две' } }, { k: 'uch', t: { uz: 'Uchtasiga', ru: 'В три' } }];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [band, setBand] = useState(false);
  const [uch, setUch] = useState(null);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1400, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const chiziqRefs = useRef({}).current; const tasmaRefs = useRef({}).current;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = () => {
    if (!taxmin || done || band) return;
    const i = q;
    const src = i === 0 ? chiziqRefs.lahza : i === 1 ? chiziqRefs.ozgarish : null;
    const dst = i === 0 ? tasmaRefs.muammo : i === 1 ? tasmaRefs.yechim : tasmaRefs.raqamlar;
    if (kamHarakat() || !dst) { setQ(i + 1); return; }
    setBand(true);
    if (dst.scrollIntoView) dst.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => {
      if (!src) { setQ(i + 1); setBand(false); return; }
      const a = src.getBoundingClientRect(), t = dst.getBoundingClientRect();
      setUch({ i, x: a.left, y: a.top, w: a.width, dx: t.left + 10 - a.left, dy: t.top + 30 - a.top, s: Math.max(0.6, Math.min(1, (t.width - 20) / a.width)), bor: false });
      requestAnimationFrame(() => requestAnimationFrame(() => setUch(u => (u ? { ...u, bor: true } : u))));
      setTimeout(() => { setQ(i + 1); setUch(null); setBand(false); }, 700);
    }, 380);
  };
  const uchdi = q >= 2 ? ['kim', 'lahza', 'ozgarish'] : q >= 1 ? ['kim', 'lahza'] : [];
  const sahna = <HikoyaSahna rejim="pitch" telefon={false} className={cxx(tugadi && 'tugadi')}
    chiziq={tugadi ? null : { q: 3, ixcham: true, uchdi, refs: chiziqRefs }}
    hakam={<Hakam ok={q >= 1} />}
    tasma={{ q, refs: tasmaRefs, darhol: !!storedAnswer, katta: tugadi }} />;
  const tx = S6_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · hikoya va bo'laklar", ru: 'Понятие · история и части' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Hikoya pitchning <A>qaysi bo'laklariga tushadi?</A></>, ru: <>В какие части питча <A>попадает история?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va hikoya qismlari qaysi bo'lakka tushishini ko'ring.", ru: 'Нажимайте кнопки по одной и смотрите, в какую часть попадают части истории.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Mentor hikoyasi nechta bo'lakka tushadi?", ru: 'В сколько частей попадает история Ментора?' })} variantlar={S6_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="sp-harakat">
          <Qadamlar3 nomlar={S6_TUGMA} q={q} faol={!!taxmin && !band} onBos={bos} />
          {q > 0 && <QIzoh key={q}>{tr(S6_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — hikoya qismi qaysi bo'lakka uchishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, в какую часть полетит часть истории.' }))}
        </div>}
        vizual={sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'ikki'} aslida={tr({ uz: 'ikkitasiga', ru: 'в две' })} />}
          matn={tr({ uz: "Bu misolda hikoya ikki bo'lakda: lahza Muammoni ochadi, o'zgarish Yechimda; Raqamlar — tashqaridagi son.", ru: 'В этом примере история в двух частях: момент открывает Проблему, изменение — в Решении; Цифры — внешнее число.' })}
          izoh={tr(S6_IZOH[2])} />}
      />
      {uch && <div className={cxx('sp-uchar', uch.bor && 'bor')} aria-hidden="true"
        style={{ left: uch.x, top: uch.y, width: uch.w, transform: uch.bor ? 'translate(' + uch.dx + 'px,' + uch.dy + 'px) scale(' + uch.s + ')' : 'none' }}>
        {uch.i === 0 && <span className="sp-bo-rol">{tr(MENTOR_HIKOYA.kim)}</span>}
        <span>{tr(uch.i === 0 ? MENTOR_HIKOYA.lahza : MENTOR_HIKOYA.ozgarish)}</span>
      </div>}
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 2; o'quvchining o'z pitchi) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · hikoya va bo'laklar", ru: 'Проверка · история и части' })}
    questionText="Hikoyangizni pitchning qayerida boshlaysiz?"
    question={tr({ uz: <h2 className="title h-ask">Hikoyangizni pitchning <A>qayerida boshlaysiz?</A></h2>, ru: <h2 className="title h-ask">В каком месте питча <A>вы начнёте свою историю?</A></h2> })}
    options={[
      { uz: 'Keyingi qadamdan keyin, pitch oxirida', ru: 'После Следующего шага, в конце питча' },
      { uz: 'Pitchdan oldin, 5 daqiqadan tashqarida', ru: 'До питча, за пределами 5 минут' },
      { uz: "Muammo bo'lagi boshida, lahza bilan", ru: 'В начале части «Проблема», с момента' },
      { uz: "Funksiyalar ro'yxatini aytib bo'lgach", ru: 'После того как назову список функций' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Muammo bo'lagi lahza bilan boshlanadi.", ru: 'Часть «Проблема» начинается с момента.' }}
    explainWrong={{
      0: { uz: "Lahza muammoni ochadi — Muammo qaysi bo'lakda?", ru: 'Момент открывает проблему — в какой части Проблема?' },
      1: { uz: 'Pitch 5 daqiqa — hikoya shu vaqt ichidami?', ru: 'Питч — 5 минут; история внутри этого времени?' },
      3: { uz: "Ro'yxat bilan boshlansa, zal avval nimani eshitadi?", ru: 'Если начать со списка, что зал услышит первым?' },
      default: { uz: "Mentor lahzasi qaysi bo'lakni ochgan edi?", ru: 'Какую часть открыл момент Ментора?' }
    }}
    vizual={<div className="sp-mini-t">{BOLAK_ID.map((id, i) => <span key={id} className={cxx('sp-mini-tb', (id === 'muammo' || id === 'yechim') && 'on')} style={{ animationDelay: (i * 0.06) + 's' }}><b>{tr(BOLAK_NOM[id])}</b>{id === 'muammo' && <em>{tr({ uz: 'lahza', ru: 'момент' })}</em>}{id === 'yechim' && <em>9{NB}/{NB}10</em>}</span>)}</div>} />
);

// ===== SCREEN 8 — HIKOYANGIZ (QMustaqil, USTAXONA — bittadan karta, 3 karta; E 43, E 53) · yozadi pm-m12d2-hikoya · o'qiydi pm-m12d1-pitch (faqat kulrang qator) · nishon My Story! =====
const S8_PLACE = { kim: { uz: 'Kimning lahzasi? Rolini yozing, ism emas', ru: 'Чей это момент? Напишите роль, а не имя' }, lahza: { uz: "Qaysi kuni, qayerda, nima bo'ldi?", ru: 'В какой день, где, что произошло?' }, ozgarish: { uz: 'Mahsulot bilan hozir nima boshqacha?', ru: 'Что сейчас иначе благодаря продукту?' } };
const S8_KULRANG = {
  kim: { uz: "Rol bilan yozing: o'yinchi, sotuvchi, ota-ona — ism emas.", ru: 'Пишите роль: игрок, продавец, родитель — не имя.' },
  lahza: { uz: "Bo'lib o'tgan voqeani yozing — o'ylab topilmaydi.", ru: 'Пишите случай, который произошёл, — не выдуманный.' },
  ozgarish: { uz: "Mahsulot bugun ko'rsata oladigan narsani yozing, va'dani emas.", ru: 'Пишите то, что продукт может показать сегодня, а не обещание.' }
};
const S8_XATO = {
  bosh: { uz: 'Bu kartaga bitta gap yozing.', ru: 'Напишите в эту карточку одну фразу.' },
  kimUzun: { uz: 'Faqat rolini yozing — 60 belgigacha.', ru: 'Напишите только роль — до 60 знаков.' },
  uzun: { uz: '160 belgidan oshdi — gapni qisqartiring.', ru: 'Больше 160 знаков — сократите фразу.' },
  pii: { uz: 'Hikoyaga telefon, akkaunt va havola yozilmaydi.', ru: 'В историю не пишут телефон, аккаунт и ссылку.' },
  vaqtYoq: { uz: "Bu bitta voqeami? Qachon yoki qayerda bo'lganini qo'shing.", ru: 'Это один случай? Добавьте, когда или где это было.' },
  umumiy: { uz: 'Bu umumiy gap — bitta voqeani yozing.', ru: 'Это общая фраза — напишите один случай.' },
  vada: { uz: "Bu va'da — mahsulot bugun nima ko'rsatadi?", ru: 'Это обещание — что продукт показывает сегодня?' },
  texno: { uz: "Bu texnologiya — odam uchun nima o'zgaradi?", ru: 'Это технология — что меняется для человека?' }
};
const S8_YORDAM = {
  kim: { uz: 'Mentor misolida: tashkilotchi.', ru: 'В примере Ментора: организатор.' },
  lahza: { uz: "Mentor misolida: «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.»", ru: 'В примере Ментора: «Суббота, 18:00. На площадке 8 человек, ещё 2 не пришли — игра не состоялась.»' },
  ozgarish: { uz: `Mentor misolida: «Endi tashkilotchi juma kuni ko'radi: 9${NB}/${NB}10, bitta joy bo'sh.»`, ru: `В примере Ментора: «Теперь организатор в пятницу видит: 9${NB}/${NB}10, одно место свободно.»` }
};
const S8_YORDAM_OXIR = { uz: "Hikoyangiz — o'zingizniki: bo'lib o'tgan voqeadan oling.", ru: 'Ваша история — ваша: берите её из случая, который произошёл.' };
// Bitta karta (8-ekran va 10-ekrandagi «Kartani ochish») — maydon, sanoq, tekshiruv, Yordam, «Saqlash»
const KartaTahrir = ({ qism, boshMatn = '', ustQator, onSaqla, onYoz, uchish }) => {
  const [matn, setMatn] = useState(boshMatn || '');
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const max = QISM_MAX[qism]; const i = QISM_ID.indexOf(qism);
  const uz = matn.trim().length;
  const saqla = () => {
    if (uchish) return;
    const m = matn.trim(); const t = tekshirHikoya(qism, m);
    if (t && (t.blok || !(yumshoq && yumshoq.x === t.x && yumshoq.m === m))) { setXato(t); if (!t.blok) setYumshoq({ x: t.x, m }); return; }
    setXato(null); setYumshoq(null); setYordam(false); onSaqla(qism, m);
  };
  return (
    <div className={cxx('sp-karta', xato && xato.blok && 'err', uchish && 'uch')}>
      <span className="q-yorliq">{i + 1} · {tr(QISM_NOM[qism])}</span>
      {ustQator && <p className="sp-ust">{ustQator}</p>}
      <div className={cxx('sp-maydon', !uz && 'chorla')}>
        <i className="sp-maydon-n">{i + 1}</i>
        <textarea className={cxx('sp-inp', xato && 'err')} rows={qism === 'kim' ? 2 : 3} maxLength={max + 120} value={matn} placeholder={tr(S8_PLACE[qism])} aria-label={tr(QISM_NOM[qism])}
          onChange={(e) => { const v = e.target.value; setMatn(v); setXato(null); if (onYoz) onYoz(qism, v); }} />
        <span className={cxx('sp-sanoq', uz > max && 'oshdi')}>{uz}{NB}/{NB}{max}</span>
      </div>
      {xato && <QXato key={xato.x}>{tr(S8_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && <p className="sp-yana">{tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' })}</p>}
      <p className="sp-kulrang">{tr(S8_KULRANG[qism])}</p>
      {yordam && <div className="sp-yordam fade-step"><p>{tr(S8_YORDAM[qism])}</p><p>{tr(S8_YORDAM_OXIR)}</p></div>}
      <div className="sp-karta-tug">
        <QTugma className={cxx(uz > 0 && 'sp-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        <QTugma ikkinchi className="sp-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const pq = useMemo(() => pitchQator(), []);
  const [saq, setSaq] = useState(() => { const h = hikoyaOl(); return Object.fromEntries(QISM_ID.map(k => [k, h[k]])); });
  const [qora, setQora] = useState(() => Object.fromEntries(QISM_ID.map(k => [k, saq[k] || ''])));
  const [joriy, setJoriy] = useState(() => QISM_ID.find(k => !saq[k]) || null);
  const [uchdi, setUchdi] = useState(null);
  const [uchish, setUchish] = useState(false);
  const n = QISM_ID.filter(k => saq[k]).length;
  const toliq = n === 3;
  const och = (k) => { if (uchish) return; setJoriy(k); };
  const saqla = (k, m) => {
    if (!isMentor) hikoyaYoz({ [k]: m });
    const yangi = { ...saq, [k]: m };
    if (QISM_ID.every(x => yangi[x]) && !toliq) {
      if (achMiss && achMiss.earn) achMiss.earn('myStory');
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'hikoya', solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    const keyingi = QISM_ID.slice(QISM_ID.indexOf(k) + 1).find(x => !yangi[x]) || QISM_ID.find(x => !yangi[x]) || null;
    setUchish(true);
    setTimeout(() => { setSaq(yangi); setQora(d => ({ ...d, [k]: m })); setUchdi(k); setJoriy(keyingi); setUchish(false); setTimeout(() => setUchdi(null), 1100); }, kamHarakat() ? 0 : 380);
  };
  const ust = joriy === 'lahza' && pq.muammo ? <>{tr({ uz: 'Pitchingizdagi Muammo:', ru: 'Проблема в вашем питче:' })} {pq.muammo}</>
    : joriy === 'ozgarish' && pq.yechim ? <>{tr({ uz: 'Pitchingizdagi Yechim:', ru: 'Решение в вашем питче:' })} {pq.yechim}</> : null;
  const strip = <div className="sp-strip">
    <span className="sp-strip-y">{tr({ uz: 'Hikoyam', ru: 'Моя история' })} · {n}/3</span>
    {QISM_ID.map((id, i) => <QChip key={id} holat={joriy === id ? 'on' : saq[id] ? 'ok' : undefined} className={cxx('sp-tab', uchdi === id && 'yangi')} onClick={() => och(id)}><i>{saq[id] ? '✓' : i + 1}</i>{tr(QISM_NOM[id])}</QChip>)}
  </div>;
  const yakuniy = toliq && !joriy;
  const forma = isMentor
    ? <div className="sp-fokus"><HikoyamKarta mentor /><MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Uch kartani yozganlar', ru: 'Написали три карточки' }} /></div>
    : yakuniy
      ? <div className="sp-fokus"><Zoomable><HikoyamKarta h={saq} yonadi={uchdi ? { [uchdi]: 'ok' } : {}} tahrir={och} /></Zoomable>
        <QXulosa>{tr({ uz: "Hikoyangiz yozildi: kim, lahza va o'zgarish — uchalasi kartada.", ru: 'Ваша история записана: кто, момент и изменение — все три на карточке.' })}</QXulosa></div>
      : <div className="sp-ish">
        <KartaTahrir key={joriy} qism={joriy} boshMatn={qora[joriy] || ''} ustQator={ust} uchish={uchish} onSaqla={saqla} onYoz={(k, v) => setQora(d => ({ ...d, [k]: v }))} />
        <Zoomable><OquvchiUyalar matn={qora} saq={saq} joriy={joriy} yangi={uchdi} /></Zoomable>
      </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · hikoya', ru: 'Самостоятельная работа · история' })} screen={screen} scrollSignal={n * 10 + (joriy ? QISM_ID.indexOf(joriy) : 9)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={yakuniy} disabled={!toliq && !isMentor} label={toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch kartani yozing (${n}/3)`, ru: `Напишите три карточки (${n}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingiz hikoyasini <A>uch kartaga yozing.</A></>, ru: <>Запишите историю своего продукта <A>на три карточки.</A></> })}
        mentor={<Mentor>{tr({ uz: "Har kartadagi savolga bitta gap bilan javob bering va «Saqlash»ni bosing.", ru: 'Ответьте на вопрос каждой карточки одной фразой и нажмите «Сохранить».' })}</Mentor>}
        qadamlar={!isMentor && !yakuniy && strip}
        forma={forma}
      />
    </Stage>
  );
};

// ===== SCREEN 9 — VIDEOGA YOZISH (QMustaqil; rozilik darvozasi — 9.32 · taymer · «Video yozildi» / «Yozib bo'lmadi» / «Aytdim»; kamera so'ralmaydi — getUserMedia yo'q) =====
const useTaymer = () => {
  const [ish, setIsh] = useState(false); const [s, setS] = useState(0); const t0 = useRef(0);
  useEffect(() => {
    if (!ish) return undefined;
    t0.current = Date.now();
    const id = setInterval(() => setS((Date.now() - t0.current) / 1000), 250);
    return () => clearInterval(id);
  }, [ish]);
  return { ish, s, boshla: () => { setS(0); setIsh(true); }, toxtat: () => setIsh(false) };
};
const Taymer = ({ s, ish }) => {
  const ortiq = Math.max(0, s - 60);
  return (
    <div className={cxx('sp-taymer', ish && 'yur')}>
      <div className="sp-taymer-l"><i style={{ width: Math.min(100, (s / 60) * 100) + '%' }} /></div>
      <div className="sp-taymer-c"><b>{mss(Math.min(s, 60))}</b>{ortiq > 0 && <em>+{mss(ortiq)}</em>}<span>1:00</span></div>
    </div>
  );
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const h0 = useMemo(() => hikoyaOl(), []);
  const bor = kartaSoni(h0) > 0;
  const [rozi, setRozi] = useState(null);
  const tm = useTaymer();
  const [vaqt, setVaqt] = useState(storedAnswer?.vaqt ?? null);
  const [natija, setNatija] = useState(storedAnswer?.natija ?? null); // 'video' | 'yoq' | 'aytdim'
  const [toxtadi, setToxtadi] = useState(!!storedAnswer);
  const yon = tm.ish ? QISM_ID[Math.min(2, Math.floor(tm.s / 20))] : null;
  const boshla = () => { setNatija(null); setToxtadi(false); tm.boshla(); };
  const toxtat = () => { tm.toxtat(); setVaqt(Math.round(tm.s)); setToxtadi(true); };
  const yakunla = (k) => {
    setNatija(k);
    const yozildi = k === 'video';
    if (!isMentor) hikoyaYoz(null, { yozildi, vaqt });
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'video', solved: true, correct: true, picked: true, natija: k, vaqt });
    if (yozildi && _live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const belgi = natija === 'video' ? tr({ uz: 'video ✓', ru: 'видео ✓' }) : natija ? tr({ uz: 'aytildi', ru: 'рассказано' }) : null;
  const karta = <div className="sp-v-chap">
    {!bor && !isMentor && <span className="sp-sahna-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>}
    <HikoyamKarta h={h0} mentor={isMentor || !bor} yonadi={yon ? { [yon]: 'yon' } : {}} belgi={belgi} />
  </div>;
  const tugmaQator = tm.ish
    ? <QTugma className="sp-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>
    : toxtadi && !natija && !isMentor
      ? (rozi === 'ha'
        ? <div className="sp-ikki"><QTugma className="sp-var" onClick={() => yakunla('video')}>{tr({ uz: 'Video yozildi', ru: 'Видео записано' })}</QTugma><QTugma ikkinchi className="sp-var" onClick={() => yakunla('yoq')}>{tr({ uz: "Yozib bo'lmadi", ru: 'Не получилось записать' })}</QTugma></div>
        : <QTugma className="sp-halqa" onClick={() => yakunla('aytdim')}>{tr({ uz: 'Aytdim', ru: 'Рассказал' })}</QTugma>)
      : <QTugma className={cxx((isMentor || rozi) && !natija && 'sp-halqa')} disabled={!isMentor && !rozi} onClick={boshla}>{tr({ uz: 'Taymerni boshlash', ru: 'Запустить таймер' })}</QTugma>;
  const ong = <div className="sp-v-ong">
    {!isMentor && <div className="sp-rozi">
      <span className="sp-rozi-y">{tr({ uz: 'Video yozishdan oldin tanlang:', ru: 'Перед записью видео выберите:' })}</span>
      <div className={cxx('sp-rozi-v', !rozi && 'kutish')}>
        <QChip holat={rozi === 'ha' ? 'on' : undefined} disabled={tm.ish || !!natija} onClick={() => setRozi('ha')}>{tr({ uz: 'Ota-onam rozi', ru: 'Родители согласны' })}</QChip>
        <QChip holat={rozi === 'yoq' ? 'on' : undefined} disabled={tm.ish || !!natija} onClick={() => setRozi('yoq')}>{tr({ uz: 'Hali gaplashmadim', ru: 'Ещё не поговорил' })}</QChip>
      </div>
      {rozi === 'yoq' && <p className="sp-kulrang">{tr({ uz: 'Hikoyani taymer bilan ovoz chiqarib ayting — bu ham tugagan ish.', ru: 'Расскажите историю вслух с таймером — это тоже законченная работа.' })}</p>}
    </div>}
    <Taymer s={tm.ish ? tm.s : (vaqt || 0)} ish={tm.ish} />
    <p className="sp-kulrang">{tr({ uz: "Video faqat telefoningizda qoladi: hech kimga yuborilmaydi va internetga qo'yilmaydi.", ru: 'Видео остаётся только на вашем телефоне: никому не отправляется и не выкладывается в интернет.' })}</p>
    <p className="sp-kulrang">{tr({ uz: "Yuzingiz ko'rinishi shart emas — ovoz yetadi. Kadrda boshqa odam bo'lmasin.", ru: 'Лицо показывать не обязательно — достаточно голоса. В кадре не должно быть других людей.' })}</p>
    {!natija && tugmaQator}
    {natija === 'yoq' && <p className="sp-kulrang">{tr({ uz: "Hikoyani taymer bilan ovoz chiqarib ayting. Uyda ruxsat va imkon bo'lsa, keyin yozasiz.", ru: 'Расскажите историю вслух с таймером. Если дома будет разрешение и возможность — запишете потом.' })}</p>}
    {isMentor && <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Video yozildi deb belgilaganlar', ru: 'Отметили «Видео записано»' }} />}
  </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · video', ru: 'Самостоятельная работа · видео' })} screen={screen} scrollSignal={(natija ? 3 : 0) + (toxtadi ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={!!natija} disabled={!natija && !isMentor} label={natija || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Taymerni boshlang', ru: 'Запустите таймер' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Hikoyangizni 1 daqiqada <A>telefonga yozing.</A></>, ru: <>Запишите свою историю <A>на телефон за 1 минуту.</A></> })}
        mentor={<Mentor>{tr({ uz: "Avval ota-onangiz bilan gaplashganingizni belgilang, so'ng «Taymerni boshlash»ni bosib hikoyani aytib bering.", ru: 'Сначала отметьте, поговорили ли вы с родителями, потом нажмите «Запустить таймер» и расскажите историю.' })}</Mentor>}
        forma={<div className="sp-video">{karta}{ong}</div>}
      >
        {natija && <QXulosa>{natija === 'video' ? tr({ uz: 'Video yozildi — u faqat telefoningizda qoladi.', ru: 'Видео записано — оно остаётся только на вашем телефоне.' }) : tr({ uz: "Hikoya taymer bilan aytildi — video hozir yozilmadi.", ru: 'История рассказана с таймером — видео сейчас не записано.' })}</QXulosa>}
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — O'ZINGIZ TEKSHIRING (QMustaqil; VIDEO_SAVOL varag'i «Ha»/«Yo'q»; «Yo'q» → maslahat + «Kartani ochish»; sarlavha video holatiga qarab — E 54) · nishon Self Check! =====
const VIDEO_SAVOL = [
  { id: 'lahzaBilan', t: { uz: 'Hikoya lahza bilan boshlandimi?', ru: 'История началась с момента?' }, maslahat: { uz: "Lahzani birinchi gapga qo'ying: kun, soat va nima bo'ldi.", ru: 'Поставьте момент в первую фразу: день, час и что произошло.' }, karta: ['lahza'] },
  { id: 'royxatYoq', t: { uz: "Funksiyalar ro'yxatisiz gapirdingizmi?", ru: 'Вы говорили без списка функций?' }, maslahat: { uz: "Funksiyalar o'rniga bitta o'zgarishni ayting.", ru: 'Вместо функций назовите одно изменение.' }, karta: ['ozgarish'] },
  { id: 'vaqtgaSigdi', t: { uz: "Hikoya 1 daqiqaga sig'dimi?", ru: 'История уложилась в 1 минуту?' }, maslahat: { uz: 'Har kartadan bitta qisqa gap qoldiring.', ru: 'Оставьте по одной короткой фразе с каждой карточки.' }, karta: ['kim', 'lahza', 'ozgarish'] }
];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const [h, setH] = useState(() => hikoyaOl());
  const video = !isMentor && h.video.yozildi === true;
  const bor = kartaSoni(h) > 0;
  const [javob, setJavob] = useState(() => Object.fromEntries(VIDEO_SAVOL.map(v => [v.id, h.video[v.id]])));
  const [ozgardi, setOzgardi] = useState({});
  const [ochiq, setOchiq] = useState(null); // { savol, qism }
  const [yon, setYon] = useState({});
  const [xato, setXato] = useState(false);
  const soni = VIDEO_SAVOL.filter(v => typeof javob[v.id] === 'boolean').length;
  const toliq = soni === 3;
  const chaqn = (qismlar, tur) => { setYon(Object.fromEntries(qismlar.map(k => [k, tur]))); setTimeout(() => setYon({}), 1100); };
  const bel = (v, val) => {
    const yangi = { ...javob, [v.id]: val };
    setJavob(yangi); setXato(false);
    if (!isMentor) hikoyaYoz(null, { [v.id]: val });
    if (val) chaqn(v.karta, 'ok');
    if (ochiq && ochiq.savol === v.id && val) setOchiq(null);
    if (VIDEO_SAVOL.every(x => typeof yangi[x.id] === 'boolean') && !toliq) {
      if (achMiss && achMiss.earn) achMiss.earn('selfCheck');
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'tekshirish', solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const kartaSaqla = (qism, m) => {
    const d = isMentor ? { ...h, [qism]: m } : hikoyaYoz({ [qism]: m });
    setH(d); setOzgardi(o => ({ ...o, [ochiq.savol]: true })); chaqn([qism], 'acc'); setOchiq(null);
  };
  const davom = () => { if (video && !toliq) { setXato(true); return; } onNext(); };
  const varaq = <div className="sp-varaq">
    {VIDEO_SAVOL.map((v, i) => {
      const j = javob[v.id];
      return (
        <div key={v.id} className={cxx('sp-vq', video && j === true && 'ha', video && j === false && 'yoq', video && j == null && i === VIDEO_SAVOL.findIndex(x => javob[x.id] == null) && 'navbat')}>
          <div className="sp-vq-r">
            <span className="sp-vq-t"><b>{i + 1}</b>{tr(v.t)}{v.id === 'vaqtgaSigdi' && typeof h.video.vaqt === 'number' && <em className="sp-vq-vaqt">{tr({ uz: 'Taymerda:', ru: 'На таймере:' })} {mss(h.video.vaqt)}</em>}</span>
            {video && <span className="sp-vq-tug">
              <QChip holat={j === true ? 'ok' : undefined} onClick={() => bel(v, true)}>{tr({ uz: 'Ha', ru: 'Да' })}</QChip>
              <QChip holat={j === false ? 'err' : undefined} onClick={() => bel(v, false)}>{tr({ uz: "Yo'q", ru: 'Нет' })}</QChip>
              {j === false && ozgardi[v.id] && <em className="sp-vq-oz">{tr({ uz: "karta o'zgartirildi", ru: 'карточка изменена' })}</em>}
            </span>}
          </div>
          {video && j === false && <div className="sp-vq-m">
            <p className="sp-kulrang">{tr(v.maslahat)}</p>
            {bor && <QTugma ikkinchi onClick={() => setOchiq({ savol: v.id, qism: v.karta[0] })}>{tr({ uz: 'Kartani ochish', ru: 'Открыть карточку' })}</QTugma>}
          </div>}
        </div>
      );
    })}
    {xato && <QXato>{tr({ uz: "Har savolga «Ha» yoki «Yo'q»ni bosing.", ru: 'Нажмите «Да» или «Нет» на каждый вопрос.' })}</QXato>}
    {isMentor && <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Uchala savolga javob berganlar', ru: 'Ответили на все три вопроса' }} />}
  </div>;
  const ochiqSavol = ochiq && VIDEO_SAVOL.find(v => v.id === ochiq.savol);
  const chap = ochiq
    ? <div className="sp-v-chap">
      {ochiqSavol.karta.length > 1 && <div className="sp-strip">{ochiqSavol.karta.map((k, i) => <QChip key={k} holat={ochiq.qism === k ? 'on' : undefined} className="sp-tab" onClick={() => setOchiq(o => ({ ...o, qism: k }))}><i>{i + 1}</i>{tr(QISM_NOM[k])}</QChip>)}</div>}
      <KartaTahrir key={ochiq.savol + ochiq.qism} qism={ochiq.qism} boshMatn={h[ochiq.qism] || ''} onSaqla={kartaSaqla} />
    </div>
    : <div className="sp-v-chap">{!bor && !isMentor && <span className="sp-sahna-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>}<HikoyamKarta h={h} mentor={isMentor || !bor} yonadi={yon} /></div>;
  const hammasiHa = toliq && VIDEO_SAVOL.every(v => javob[v.id] === true);
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · tekshirish', ru: 'Самостоятельная работа · проверка' })} screen={screen} scrollSignal={soni + (ochiq ? 10 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={!video || toliq} label={!video || toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Savollarga javob bering (${soni}/3)`, ru: `Ответьте на вопросы (${soni}/3)` })} onClick={davom} /></>}>
      <QMustaqil
        sarlavha={video
          ? tr({ uz: <>Videongizni ko'ring: <A>hikoya qanday chiqdi?</A></>, ru: <>Посмотрите видео: <A>как получилась история?</A></> })
          : tr({ uz: <>Video yozsangiz, <A>shu uch savolga javob berasiz.</A></>, ru: <>Если запишете видео, <A>ответите на эти три вопроса.</A></> })}
        mentor={<Mentor>{video
          ? tr({ uz: "Videoni bir marta ko'ring va har savolga «Ha» yoki «Yo'q»ni bosing.", ru: 'Посмотрите видео один раз и на каждый вопрос нажмите «Да» или «Нет».' })
          : tr({ uz: "Bu uch savolni eslab qoling — video yozsangiz, shu savollar bilan tekshirasiz.", ru: 'Запомните эти три вопроса — если запишете видео, проверите себя по ним.' })}</Mentor>}
        forma={<div className="sp-video">{chap}{varaq}</div>}
      >
        {video && toliq && !ochiq && <QXulosa>{hammasiHa
          ? tr({ uz: "Uchala savolga «Ha»: hikoya lahzadan boshlandi va 1 daqiqaga sig'di.", ru: 'На все три вопроса «Да»: история началась с момента и уложилась в 1 минуту.' })
          : tr({ uz: "Videoda tuzatadigan joy topildi — kartani o'zgartirib, uyda qayta yozasiz.", ru: 'В видео нашлось что исправить — измените карточку и дома запишете заново.' })}</QXulosa>}
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s11 = 0; o'quvchining o'z videosi) =====
const Screen11 = (props) => {
  const h = hikoyaOl(); const bor = kartaSoni(h) > 0;
  return (
    <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
      questionText="Videongizda funksiyalar ro'yxati chiqdi. Nima qilasiz?"
      question={tr({ uz: <h2 className="title h-ask">Videongizda funksiyalar ro'yxati chiqdi. <A>Nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">В вашем видео получился список функций. <A>Что вы сделаете?</A></h2> })}
      options={[
        { uz: "Ro'yxat o'rniga bitta lahzani aytaman", ru: 'Вместо списка назову один момент' },
        { uz: "Ro'yxatni tezroq aytib, sig'diraman", ru: 'Скажу список быстрее и уложусь' },
        { uz: "Ro'yxatga yana ikki funksiya qo'shaman", ru: 'Добавлю в список ещё две функции' },
        { uz: "Videoni sinf chatiga tashlab so'rayman", ru: 'Отправлю видео в чат класса и спрошу' }
      ]} correctIdx={0}
      explainCorrect={{ uz: "Hikoya ro'yxat bilan emas, lahza bilan boshlanadi.", ru: 'История начинается не со списка, а с момента.' }}
      explainWrong={{
        1: { uz: "Tez aytilgan ro'yxatda ham odam bormi?", ru: 'Есть ли человек в быстро сказанном списке?' },
        2: { uz: "Ro'yxat uzaydi — bitta lahza qayerda?", ru: 'Список станет длиннее — где один момент?' },
        3: { uz: 'Video telefoningizda qoladi, hech kimga yuborilmaydi.', ru: 'Видео остаётся на вашем телефоне и никому не отправляется.' },
        default: { uz: 'Videodan keyingi ikkinchi savolni eslang.', ru: 'Вспомните второй вопрос после видео.' }
      }}
      vizual={<div className="sp-mini-hk"><HikoyamKarta h={h} mentor={!bor} yonadi={{ lahza: 'acc' }} /></div>} />
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  oneMoment: { icon: '📍', name: 'One Moment!', desc: { uz: 'Lahzali gapni birinchi urinishda topdingiz', ru: 'Вы с первой попытки нашли фразу с моментом' } },
  fewerButtons: { icon: '📱', name: 'Fewer Buttons!', desc: { uz: "iPhone voqeasidagi o'xshash usulni topdingiz", ru: 'Вы нашли похожий приём в истории iPhone' } },
  myStory: { icon: '📝', name: 'My Story!', desc: { uz: 'Mahsulot hikoyangizni uch kartaga yozdingiz', ru: 'Вы записали историю продукта на три карточки' } },
  selfCheck: { icon: '🎬', name: 'Self Check!', desc: { uz: "Videongizni ko'rib, uch savolga javob berdingiz", ru: 'Вы посмотрели своё видео и ответили на три вопроса' } }
};
// Ekran id → nishon (birinchi urinish; faqat ballik test). My Story! va Self Check! — 8, 10-ekranlar ichida (ish qilinganda), AchMissCtx.earn orqali.
const ACH_TRIGGERS = { s3: 'oneMoment', s5: 'fewerButtons' };

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
  3: { uz: '1 — Hikoyani boshlaydigan gap', ru: '1 — Фраза, с которой начинается история' },
  5: { uz: '2 — iPhone va Mentor hikoyasi', ru: '2 — iPhone и история Ментора' },
  7: { uz: '3 — Hikoya pitchda qayerdan', ru: '3 — Где в питче история' },
  11: { uz: "Yakuniy — Videoda ro'yxat chiqsa", ru: 'Итог — Если в видео получился список' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: 'hikoya', ru: 'история' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'lahza', ru: 'момент' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: "o'zgarish", ru: 'изменение' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'pitch', ru: 'питч' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: "bo'lak", ru: 'часть' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: "ro'yxat", ru: 'список' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'video', ru: 'видео' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'zal', ru: 'зал' }, l: 56, t: 50, s: 22, d: 22, dl: 3.3 },
  { ch: { uz: 'telefon', ru: 'телефон' }, l: 90, t: 44, s: 22, d: 24, dl: 2.6 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javoblar 4 pozitsiyaga TENG (3/3/3/3, mexanik ketma-ketliksiz).
const QUIZ_BANK = [
  { q: { uz: 'Bizda mahsulot hikoyasi qaysi uch qismdan iborat?', ru: 'Из каких трёх частей у нас состоит история продукта?' }, opts: [{ uz: "Kim, lahza va o'zgarish", ru: 'Кто, момент и изменение' }, { uz: 'Muammo, Bozor va Jamoa', ru: 'Проблема, Рынок и Команда' }, { uz: 'Funksiya, ekran va tugma', ru: 'Функция, экран и кнопка' }, { uz: 'Logotip, rang va shrift', ru: 'Логотип, цвет и шрифт' }], correct: 0 },
  { q: { uz: "Mentor misolida lahza qachon bo'lgan?", ru: 'Когда в примере Ментора был момент?' }, opts: [{ uz: 'Juma kuni, soat 18:00 da', ru: 'В пятницу, в 18:00' }, { uz: 'Shanba kuni, soat 18:00 da', ru: 'В субботу, в 18:00' }, { uz: 'Yakshanba kuni, soat 9:00 da', ru: 'В воскресенье, в 9:00' }, { uz: 'Dushanba kuni, tanaffusda', ru: 'В понедельник, на перемене' }], correct: 1 },
  { q: { uz: "Mentor lahzasida maydonda nechta odam bo'lgan?", ru: 'Сколько человек было на площадке в моменте Ментора?' }, opts: [{ uz: '10 kishi', ru: '10 человек' }, { uz: '9 kishi', ru: '9 человек' }, { uz: '8 kishi', ru: '8 человек' }, { uz: '2 kishi', ru: '2 человека' }], correct: 2 },
  { q: { uz: "Mentor hikoyasida o'zgarishdan keyin ekranda nima ko'rinadi?", ru: 'Что видно на экране после изменения в истории Ментора?' }, opts: [{ uz: "8 / 10, ikki joy hali bo'sh", ru: '8 / 10, два места ещё свободны' }, { uz: "10 / 10, hamma joy to'ldi", ru: '10 / 10, все места заняты' }, { uz: "0 / 10, hech kim yozilmadi", ru: '0 / 10, никто не записался' }, { uz: "9 / 10, bitta joy bo'sh", ru: '9 / 10, одно место свободно' }], correct: 3 },
  { q: { uz: "Funksiyalar ro'yxati zalga nimani aytadi?", ru: 'Что список функций говорит залу?' }, opts: [{ uz: 'Mahsulotda nimalar borligini', ru: 'Что есть в продукте' }, { uz: "Kimda qanday muammo bo'lganini", ru: 'У кого какая была проблема' }, { uz: "Qaysi kuni nima bo'lganini", ru: 'Что случилось в какой день' }, { uz: "Mahsulot nima o'zgartirganini", ru: 'Что изменил продукт' }], correct: 0 },
  { q: { uz: 'Telefon kompaniyalari 2007-yilda nima bilan bellashgan?', ru: 'Чем соревновались телефонные компании в 2007 году?' }, opts: [{ uz: 'Kimda tugma kamroq ekani bilan', ru: 'У кого меньше кнопок' }, { uz: 'Kimda Home tugmasi borligi bilan', ru: 'У кого есть кнопка Home' }, { uz: "Kimda tugma ko'proq ekani bilan", ru: 'У кого больше кнопок' }, { uz: 'Kimda iPod pleeri borligi bilan', ru: 'У кого есть плеер iPod' }], correct: 2 },
  { q: { uz: "Apple iPhone'dan nimalarni olib tashlagan?", ru: 'Что Apple убрала из iPhone?' }, opts: [{ uz: 'Ekran va Home tugmasini', ru: 'Экран и кнопку Home' }, { uz: 'Klaviatura va stilusni', ru: 'Клавиатуру и стилус' }, { uz: 'Telefon va internetni', ru: 'Телефон и интернет' }, { uz: 'iPod musiqa pleerini', ru: 'Музыкальный плеер iPod' }], correct: 1 },
  { q: { uz: "Jobs iPhone'ni qaysi ibora bilan taqdim etgan?", ru: 'Какой фразой Джобс представил iPhone?' }, opts: [{ uz: 'Ikki qurilma bittada', ru: 'Два устройства в одном' }, { uz: "To'rt qurilma bittada", ru: 'Четыре устройства в одном' }, { uz: 'Bitta tugmali telefon', ru: 'Телефон с одной кнопкой' }, { uz: 'Uch qurilma bittada', ru: 'Три устройства в одном' }], correct: 3 },
  { q: { uz: "Hikoyadagi o'zgarish pitchning qaysi bo'lagida ko'rinadi?", ru: 'В какой части питча видно изменение из истории?' }, opts: [{ uz: "Bozor bo'lagida", ru: 'В части «Рынок»' }, { uz: "Muammo bo'lagida", ru: 'В части «Проблема»' }, { uz: "Yechim bo'lagida", ru: 'В части «Решение»' }, { uz: 'Keyingi qadamda', ru: 'В Следующем шаге' }], correct: 2 },
  { q: { uz: "Hikoyadan keyin Raqamlar bo'lagi nimani aytadi?", ru: 'Что после истории говорит часть «Цифры»?' }, opts: [{ uz: 'Mahsulotda nechta foydalanuvchi borligini', ru: 'Сколько пользователей у продукта' }, { uz: "Lahza qaysi kuni va soatda bo'lganini", ru: 'В какой день и час был момент' }, { uz: 'Mahsulotni kim va qanday qilayotganini', ru: 'Кто и как делает продукт' }, { uz: "Pitch oxirida hakamlardan nima so'ralishini", ru: 'О чём в конце питча просят судей' }], correct: 0 },
  { q: { uz: "Videoni ko'rgach o'zingizga qaysi savolni berasiz?", ru: 'Какой вопрос вы зададите себе после просмотра видео?' }, opts: [{ uz: "Video nechta layk to'plab oldi", ru: 'Сколько лайков собрало видео' }, { uz: 'Videoni qaysi chatga tashlayman', ru: 'В какой чат отправлю видео' }, { uz: 'Kadrda yuzim yaxshi chiqdimi', ru: 'Хорошо ли вышло моё лицо в кадре' }, { uz: 'Hikoya lahza bilan boshlandimi', ru: 'Началась ли история с момента' }], correct: 3 },
  { q: { uz: 'Hikoya videosi qayerda qoladi?', ru: 'Где остаётся видео с историей?' }, opts: [{ uz: "Sinf chatida, hamma ko'rishi uchun", ru: 'В чате класса, чтобы все видели' }, { uz: "Faqat o'zingizning telefoningizda", ru: 'Только на вашем телефоне' }, { uz: 'Maktab saytida, ochiq havola bilan', ru: 'На сайте школы, по открытой ссылке' }, { uz: 'Mentorning telefonida, tekshiruvga', ru: 'На телефоне Ментора, для проверки' }], correct: 1 }
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
  }, [live && live.pin, signal]);
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). Rang — neytral (SABOQ P10): orqa yuz T.ink, old yuz chegarasi fon(accent, .45).
const FLASHCARDS = [
  { front: { uz: 'Mahsulot hikoyasi nima?', ru: 'Что такое история продукта?' }, back: { uz: "Bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish (inglizchasi: storytelling)", ru: 'Один человек, один момент и изменение, которое пришло с продуктом (по-английски: storytelling)' } },
  { front: { uz: "Funksiyalar ro'yxati nega hikoya emas?", ru: 'Почему список функций — не история?' }, back: { uz: "Unda odam ham, lahza ham yo'q: faqat mahsulotda nima borligi", ru: 'В нём нет ни человека, ни момента: только то, что есть в продукте' } },
  { front: { uz: "Lahzada nima bo'ladi?", ru: 'Что есть в моменте?' }, back: { uz: "Kun yoki soat, joy va nima bo'lgani: bo'lib o'tgan bitta voqea", ru: 'День или час, место и что случилось: один случай, который произошёл' } },
  { front: { uz: "9-Modulda hikoya qanday ta'riflangan?", ru: 'Как в 9-м модуле определили историю?' }, back: { uz: "Bitta real odam bilan bo'lib o'tgan ish: u yozuvdan olinadi, o'ylab topilmaydi", ru: 'Случай с одним реальным человеком: его берут из записей, а не выдумывают' } },
  { front: { uz: 'Mentor misolida lahza qanday?', ru: 'Какой момент в примере Ментора?' }, back: { uz: "«Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.»", ru: '«Суббота, 18:00. На площадке 8 человек, ещё 2 не пришли — игра не состоялась.»' } },
  { front: { uz: "Mentor misolida o'zgarish qanday?", ru: 'Какое изменение в примере Ментора?' }, back: { uz: `«Endi tashkilotchi juma kuni ko'radi: 9${NB}/${NB}10, bitta joy bo'sh.»`, ru: `«Теперь организатор в пятницу видит: 9${NB}/${NB}10, одно место свободно.»` } },
  { front: { uz: "Hikoya pitchning qaysi bo'lagini ochadi?", ru: 'Какую часть питча открывает история?' }, back: { uz: "Muammo bo'lagini: u lahza bilan boshlanadi", ru: 'Часть «Проблема»: она начинается с момента' } },
  { front: { uz: "Hikoyadagi o'zgarish pitchda qayerda ko'rinadi?", ru: 'Где в питче видно изменение из истории?' }, back: { uz: "Yechim bo'lagida, jonli demo bilan", ru: 'В части «Решение», с живым демо' } },
  { front: { uz: "Apple 2007-yilda iPhone'dan nimani olib tashlagan?", ru: 'Что Apple в 2007 году убрала из iPhone?' }, back: { uz: 'Klaviatura, stilus va deyarli hamma tugmani: bitta ekran va Home tugmasi qolgan', ru: 'Клавиатуру, стилус и почти все кнопки: остались один экран и кнопка Home' } },
  { front: { uz: "Jobs iPhone'ni qanday taqdim etgan?", ru: 'Как Джобс представил iPhone?' }, back: { uz: '«Uch qurilma bittada»: iPod, telefon va internet', ru: '«Три устройства в одном»: iPod, телефон и интернет' } },
  { front: { uz: "Videoni ko'rgach qaysi uch savolga javob berasiz?", ru: 'На какие три вопроса вы отвечаете после просмотра видео?' }, back: { uz: "Hikoya lahza bilan boshlandimi, funksiyalar ro'yxatisiz gapirdimmi, 1 daqiqaga sig'dimi", ru: 'Началась ли история с момента, говорил ли я без списка функций, уложился ли в 1 минуту' } },
  { front: { uz: 'Hikoya videosi qayerda qoladi?', ru: 'Где остаётся видео с историей?' }, back: { uz: "Faqat sizning telefoningizda: hech kimga yuborilmaydi va internetga qo'yilmaydi", ru: 'Только на вашем телефоне: никому не отправляется и не выкладывается в интернет' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('sp-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="sp-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + ①②③; ① holatga qarab, ③ shartli — sinf 14; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z pitchingiz", ru: 'ваш питч' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 hikoya', ru: '1 история' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_1_VIDEO = { uz: "Video yozilmagan bo'lsa — ota-onangiz rozi bo'lsa va imkon bo'lsa, hikoyangizni 1 daqiqada telefonga yozing va uch savolga javob bering; bo'lmasa — taymer bilan yana bir marta ovoz chiqarib ayting.", ru: 'Если видео не записано — с согласия родителей и при возможности запишите историю на телефон за 1 минуту и ответьте на три вопроса; если нет — расскажите её вслух с таймером ещё раз.' };
const HW_1_YOQ = { uz: "«Yo'q» chiqqan bo'lsa — tuzatilgan kartadan qayta yozib, o'sha savolni tekshiring.", ru: 'Если вышло «Нет» — перезапишите по исправленной карточке и проверьте этот вопрос.' };
const HW_2 = { uz: "Xohlasangiz, hikoyangizni ota-onangizga yoki sinfdoshingizga ayting va so'rang: qaysi lahza esda qoldi?", ru: 'Если хотите, расскажите историю родителям или однокласснику и спросите: какой момент запомнился?' };
const HW_3 = { uz: "Yozilmagan karta qolgan bo'lsa — uni to'ldiring.", ru: 'Если осталась незаполненная карточка — заполните её.' };
const HwCard = ({ bandlar, keyingi }) => (
  <div className="card sp-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="sp-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="sp-hw-q"><span className="sp-hw-k">{tr(r.k)}</span><span className="sp-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="sp-hw-qadam">{bandlar.map(b => <li key={b.r}><i>{b.r}</i><span>{tr(b.t)}</span></li>)}</ol>
    <p className="sp-kulrang">{tr({ uz: "Videoni hech kimga yubormang va internetga qo'ymang.", ru: 'Не отправляйте видео никому и не выкладывайте в интернет.' })}</p>
    {keyingi && <span className="sp-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (5 holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50). Belgi ✓ — faqat birinchi holatda.
const SARLAVHA = {
  tayyor: { uz: 'Hikoyangiz yozildi va videoda tekshirildi.', ru: 'Ваша история записана и проверена на видео.' },
  yoq: { uz: 'Hikoya yozildi — videoda tuzatadigan joy topildi.', ru: 'История записана — в видео нашлось что исправить.' },
  tekshiruvYoq: { uz: 'Hikoya yozildi, video tekshiruvi hali qilinmagan.', ru: 'История записана, проверка видео ещё не сделана.' },
  qisman: (n) => ({ uz: `Hikoya hali tugamagan: ${n}${NB}/${NB}3 karta.`, ru: `История ещё не готова: ${n}${NB}/${NB}3 карточки.` }),
  bosh: { uz: 'Mahsulot hikoyasi hali yozilmagan.', ru: 'История продукта ещё не записана.' }
};
const RECAP = [
  { uz: "Mahsulot hikoyasi — bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish.", ru: 'История продукта — один человек, один момент и изменение, которое пришло с продуктом.' },
  { uz: "Funksiyalar ro'yxatida odam ham, lahza ham yo'q.", ru: 'В списке функций нет ни человека, ни момента.' },
  { uz: "Pitchda lahza Muammo bo'lagini ochadi, o'zgarish Yechimda ko'rinadi.", ru: 'В питче момент открывает Проблему, изменение видно в Решении.' },
  { uz: "iPhone voqeasida Apple ko'p tugmani olib tashlab, keraklisini qoldirgan.", ru: 'В истории iPhone Apple убрала много кнопок и оставила нужное.' },
  { uz: 'Hikoya videosi faqat sizning telefoningizda qoladi.', ru: 'Видео с историей остаётся только на вашем телефоне.' }
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
  // Holat — o'quvchining saqlangan hikoyasidan (pm-m12d2-hikoya); mentor proyektorida — Mentor misoli (to'liq sarlavha)
  const h = hikoyaOl(); const n = kartaSoni(h); const v = h.video;
  const jv = [v.lahzaBilan, v.royxatYoq, v.vaqtgaSigdi];
  const holat = isMentorL ? 'tayyor'
    : n === 3 ? (v.yozildi === true && jv.every(x => x === true) ? 'tayyor' : v.yozildi === true && jv.some(x => x === false) ? 'yoq' : 'tekshiruvYoq')
      : n > 0 ? 'qisman' : 'bosh';
  const sarlavha = holat === 'qisman' ? SARLAVHA.qisman(n) : SARLAVHA[holat];
  const belgisiz = holat !== 'tayyor'; // ✓ belgisi faqat to'liq holatda (E 54)
  const bandlar = [
    !isMentorL && v.yozildi !== true ? { r: '①', t: HW_1_VIDEO } : !isMentorL && jv.some(x => x === false) ? { r: '①', t: HW_1_YOQ } : null,
    { r: '②', t: HW_2 },
    !isMentorL && n < 3 ? { r: '③', t: HW_3 } : null
  ].filter(Boolean);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Mahsulot tezligi: o'lchaymiz va tezlashtiramiz»</b></>, ru: <>Следующий урок — <b>«Скорость продукта: измеряем и ускоряем»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('sp-yakun', belgisiz && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(sarlavha)}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard bandlar={bandlar} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmStoryPitchLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 8, 10-ekran nishonlari (ish qilinganda)
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
        /* === 14-Modul 2-dars — darsning o'z vizuali (prefiks sp-): HikoyaSahna · IphoneSahna · hikoya kartalari · taymer. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .sp-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        .sp-brend { font-weight: 800; font-style: normal; white-space: nowrap; } .sp-brend.iphone { color: #3A3A3C; } .sp-brend.nokia { color: #124191; } .sp-brend.bb { color: #111111; }
        @keyframes sp-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes sp-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes sp-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes sp-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes sp-halqa-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.28)}; } }
        @keyframes sp-yashil { 0% { background: ${T.okFon}; border-color: ${T.ok}; } 100% { } }
        @keyframes sp-acc { 0% { background: ${T.accentSoft}; border-color: ${T.accent}; } 100% { } }
        @keyframes sp-pop { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes sp-sirg { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .sp-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: sp-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.sp-halqa { outline-offset: 3px; }
        /* Tanlov guruhi — har variantning o'z yengil chegarasi, navbatma-navbat 2 marta (E 40) */
        .sp-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: sp-chorla-v 1.8s ease-out .5s 2; }
        .sp-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .sp-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: sp-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .sp-bash.ix .q-bashorat { padding-top: 8px; padding-bottom: 8px; flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 6px; }
        .sp-bash.ix .q-bashorat > .q-yorliq { display: none; }
        .q-yorliq .sp-brend { text-transform: none; }
        .sp-bash.ix .q-variantlar { flex-wrap: wrap; }
        @media (min-width: 761px) { .sp-k .q-split { grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 28px; } }
        .sp-k, .sp-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        /* ⛶ vizual burchagida (P7): kirish va reja ekranlarida o'ng ustun matni tugma ostiga tushmasin */
        .sp-k .zoomable:not(.zoom-on) > .q-split > .q-col:last-child, .q-reja .zoomable:not(.zoom-on) > .q-split > .q-col:last-child { padding-right: 40px; }
        .sp-harakat { display: flex; flex-direction: column; gap: 10px; }
        .sp-qadamlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .sp-qadamlar .q-chip i { font-style: normal; font-weight: 800; color: ${T.accent}; margin-right: 7px; }
        .sp-qadamlar .q-chip.ok i { color: ${T.ok}; }
        .sp-qadamlar .q-chip.sp-joriy { animation: sp-puls 2.2s ease-out .3s 3; }
        p.sp-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        /* Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42) */
        .q-xulosa .sp-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .sp-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .sp-xq-m { display: block; }
        .q-xulosa .sp-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        /* HikoyaSahna */
        .sp-sahna { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 22px; align-items: start; }
        .sp-sahna.tel-yoq { grid-template-columns: minmax(0,1fr); }
        .sp-sahna-tel { display: flex; }
        .sp-rolk.zal { align-self: flex-start; }
        .sp-rolk.hakam { align-self: stretch; }
        .sp-tasma.katta .sp-bo.hikoya { box-shadow: 0 0 0 4px ${fon(T.accent, 0.12)}; }
        .sp-ip-tel.stilus { margin-right: 12px; }
        .sp-sahna-ong { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .sp-sahna-y { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .sp-tel { width: 170px; height: 272px; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex: none; }
        .sp-tel-ekran { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 18px; padding: 13px 12px 12px; display: flex; flex-direction: column; gap: 3px; }
        .sp-tel-nom { font-size: 13px; }
        .sp-tel-y { margin-top: 8px; display: flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: ${T.ink2}; }
        .sp-tel-juma { font-size: 10.5px; color: #fff; background: ${MJ_RANG}; border-radius: 5px; padding: 1px 6px; letter-spacing: .04em; animation: sp-kir .4s ease-out both; }
        .sp-tel-vaqt { font-size: 14.5px; color: ${T.ink}; }
        .sp-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .sp-tel-son { margin-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .sp-tel-son.yangi { color: ${MJ_RANG}; animation: sp-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .sp-tel-doira { display: flex; gap: 3px; flex-wrap: wrap; }
        .sp-tel-doira i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .sp-tel-doira i.bor { background: ${MJ_RANG}; }
        .sp-tel-bosh { font-style: normal; font-size: 12px; font-weight: 700; color: ${MJ_RANG}; animation: sp-kir .4s ease-out both; }
        .sp-tel-tugma { margin-top: auto; text-align: center; font-size: 12px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 8px 6px; }
        /* Rol kartasi (SABOQ P1): accent 2px chegara, belgi doirada, nom katta — odam figurasi yo'q */
        .sp-rolk { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 4px 14px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 28px -16px ${fon(T.accent, 0.6)}; animation: sp-kir .4s ease-out both; }
        .sp-rolk > b { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        .sp-rolk-ava { width: 38px; height: 38px; border-radius: 50%; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 0 0 5px ${T.accentSoft}; }
        .sp-rolk-ava svg { width: 21px; height: 21px; }
        .sp-rolk-s { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; line-height: 1.35; color: ${T.ink}; }
        .sp-rolk-s > i { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; flex: none; animation: sp-pop .4s ease-out; }
        .sp-rolk-s.ok { color: ${T.ok}; } .sp-rolk-s.ok > i { background: ${T.ok}; color: #fff; }
        .sp-zal-d { display: inline-flex; gap: 4px; }
        .sp-zal-d i { width: 14px; height: 14px; border-radius: 50%; background: ${fon(T.accent, 0.35)}; }
        .sp-zal-d i:nth-child(3n) { background: ${fon(T.accent, 0.6)}; } .sp-zal-d i:nth-child(3n+1) { background: ${T.accent}; }
        .sp-rolk.kim { padding: 6px 12px; gap: 10px; box-shadow: none; }
        .sp-rolk.kim .sp-rolk-ava { width: 32px; height: 32px; box-shadow: 0 0 0 4px ${T.accentSoft}; } .sp-rolk.kim > b { font-size: 15px; }
        /* Funksiyalar ro'yxati */
        .sp-royxat { display: flex; flex-direction: column; gap: 8px; transition: opacity .5s, transform .5s; }
        .sp-royxat-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .sp-royxat-q { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .sp-fn { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 5px 11px; white-space: nowrap; }
        .sp-royxat.yur .sp-fn { animation: sp-kir .45s ease-out both; }
        .sp-royxat.ok .sp-fn { animation: sp-yashil 1.2s ease-out both; border-color: ${fon(T.ok, 0.5)}; }
        .sp-fn > i { font-style: normal; font-weight: 800; color: ${T.ok}; }
        .sp-royxat.kulrang .sp-fn { color: ${T.ink2}; background: ${T.bg}; }
        .sp-royxat.xira { opacity: .45; transform: translateX(-10px); }
        .sp-fn-uya { width: 92px; height: 32px; border-radius: 9px; border: 2px dashed ${T.accent}; background: ${fon(T.accent, 0.06)}; animation: sp-kir .4s ease-out both, sp-halqa-i 2.4s ease-in-out .4s 3; }
        .sp-40 { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }
        .sp-40-l { height: 10px; border-radius: 99px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .sp-40-l > i { display: block; height: 100%; width: 100%; background: ${T.accent}; border-radius: 99px; transform-origin: left; animation: sp-40 4s linear .3s both; }
        @keyframes sp-40 { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .sp-40-c { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        /* Hikoya chizig'i — uch uya */
        .sp-chiziq { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; align-items: stretch; }
        .sp-chiziq.oquvchi { grid-template-columns: minmax(0,1fr); gap: 8px; }
        .sp-uya { display: flex; flex-direction: column; gap: 7px; min-width: 0; min-height: 96px; padding: 9px 11px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color .3s, opacity .4s; }
        .sp-chiziq.oquvchi .sp-uya { min-height: 64px; }
        .sp-uya.bosh { border: 2px dashed ${T.line}; background: transparent; }
        .sp-uya.bosh.joriy { border-color: ${T.accent}; animation: sp-halqa-i 2.4s ease-in-out .3s 3; }
        .sp-uya.joriy:not(.bosh) { border-color: ${T.accent}; }
        .sp-uya.toldi { animation: sp-sirg .5s ease-out both; }
        .sp-uya.yangi { animation: sp-sirg .5s ease-out both, sp-yashil 1.2s ease-out .2s both; }
        .sp-uya.saqlandi { border-color: ${fon(T.ok, 0.55)}; }
        .sp-uya.uchdi { animation: none; opacity: .45; }
        .sp-uya-n { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: ${T.ink2}; }
        .sp-uya-ok { font-style: normal; color: ${T.ok}; }
        .sp-uya-r { display: flex; }
        p.sp-uya-g { margin: 0; font-size: 14px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .sp-chiziq.ixcham .sp-uya { min-height: 0; }
        .sp-mdn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 7px 8px; border-radius: 10px; background: ${fon(MJ_RANG, 0.1)}; border: 1.5px solid ${fon(MJ_RANG, 0.35)}; }
        .sp-mdn-v { font-size: 13px; color: ${T.ink}; }
        .sp-mdn-joy { display: grid; grid-template-columns: repeat(5, 16px); gap: 6px; }
        .sp-mdn-joy i { width: 16px; height: 16px; border-radius: 50%; }
        .sp-mdn-joy i.bor { background: ${MJ_RANG}; animation: sp-kir .35s ease-out both; }
        .sp-mdn-joy i.yoq { border: 2px dashed ${T.ink2}; animation: sp-kir .35s ease-out both; }
        .sp-mdn-y { font-style: normal; font-size: 12.5px; font-weight: 800; color: ${T.err}; }
        .sp-mekran { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 7px 8px; border-radius: 12px; background: ${T.paper}; border: 4px solid #1E1B26; }
        .sp-mekran-j { font-size: 10.5px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 5px; padding: 1px 7px; }
        .sp-mekran b { font-family: 'JetBrains Mono', monospace; font-size: 22px; color: ${MJ_RANG}; white-space: nowrap; animation: sp-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .sp-mekran em { font-style: normal; font-size: 12px; font-weight: 700; color: ${MJ_RANG}; }
        .sp-sahna.r-hikoya.tugadi .sp-uya { min-height: 120px; }
        /* Pitch tasmasi + taymer */
        .sp-tasma { display: flex; flex-direction: column; gap: 6px; }
        .sp-tasma-b { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .sp-bo { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 7px 11px; border-radius: 11px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color .3s, box-shadow .3s; }
        .sp-bo-h { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .sp-bo-h > b { font-size: 14px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .sp-bo-m { font-size: 14px; line-height: 1.4; color: ${T.ink2}; }
        .sp-bo.hikoya { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.1)}; }
        .sp-bo.tashqi { border-color: ${T.accent}; background: ${T.accentSoft}; animation: sp-kir .4s ease-out both; }
        .sp-bo.tashqi .sp-bo-m { color: ${T.ink}; }
        .sp-bo-rol { align-self: flex-start; font-size: 13px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 7px; padding: 2px 9px; animation: sp-kir .4s ease-out both; }
        .sp-bo-hk { font-size: 14px; line-height: 1.35; font-weight: 700; color: ${T.accent}; animation: sp-kir .45s ease-out both; }
        .sp-demo { display: inline-flex; align-items: center; gap: 6px; font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 1px 8px; white-space: nowrap; }
        .sp-demo.on { color: #fff; background: ${MJ_RANG}; }
        .sp-demo-son { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; white-space: nowrap; }
        .sp-demo-son.yangi { animation: sp-pop .45s ease-out; }
                .sp-tm { display: flex; flex-direction: column; gap: 3px; }
        .sp-tm-chiziq { display: flex; gap: 3px; }
        .sp-tm-bo { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .sp-tm-t { height: 9px; border-radius: 4px; background: ${fon(T.accent, 0.18)}; overflow: hidden; display: block; }
        .sp-tm-t > i { display: block; height: 100%; width: 20%; background: ${T.ok}; animation: sp-kir .4s ease-out both; }
        .sp-tm-bo em { font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: clip; }
        .sp-tm-bo:last-child em { text-align: right; }
        .sp-tm-chet { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .sp-uchar { position: fixed; z-index: 60; pointer-events: none; display: flex; flex-direction: column; gap: 4px; padding: 8px 11px; border-radius: 11px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 16px 34px -12px rgba(${T.shadowBase},0.45); font-size: 14px; font-weight: 700; line-height: 1.4; color: ${T.accent}; transform-origin: top left; transition: transform .62s cubic-bezier(.45,.05,.25,1), opacity .62s; }
        .sp-uchar.bor { opacity: .9; }
        /* Reja skeleti */
        .sp-reja { display: flex; flex-direction: column; gap: 12px; }
        .sp-reja-teg { align-self: flex-start; font-size: 13px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 4px 10px; }
        .sp-skelet { display: flex; gap: 14px; align-items: center; }
        .sp-skelet-tel { width: 54px; height: 88px; border-radius: 12px; background: #1E1B26; padding: 5px; flex: none; display: flex; }
        .sp-skelet-tel i { flex: 1; border-radius: 8px; background: ${T.paper}; }
        .sp-skelet-u { flex: 1; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .sp-skelet-b { height: 64px; border-radius: 12px; border: 2px dashed ${T.line}; display: flex; align-items: flex-start; padding: 7px 9px; font-size: 12px; font-weight: 800; color: ${T.ink2}; animation: sp-skelet .5s ease-out both; }
        @keyframes sp-skelet { from { border-style: dashed; background: transparent; } to { border-style: solid; border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; } }
        .sp-skelet-tm .sp-40-l > i { animation-delay: 2.2s; animation-duration: 2s; }
        /* iPhone sahnasi (K19) */
        .sp-voqea { display: flex; flex-direction: column; gap: 8px; }
        .sp-voqea-g { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 18px; align-items: center; }
        .sp-voqea-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        @media (max-width: 760px) { .sp-voqea-g { grid-template-columns: minmax(0,1fr); } }
        .sp-voqea-h { font-size: 13px; font-weight: 800; color: ${T.accent}; text-transform: uppercase; letter-spacing: .06em; animation: sp-kir .4s ease-out both; }
        p.sp-tanish { margin: 0; font-size: 13px; color: ${T.ink2}; }
        .sp-nuq { display: flex; align-items: center; gap: 6px; }
        .sp-nuq-y { font-size: 12.5px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .sp-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .sp-nuq i.ok { background: ${T.ok}; } .sp-nuq i.cur { background: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .sp-ip { min-height: 196px; display: flex; align-items: center; justify-content: center; padding: 6px 0; }
        .sp-ip-eski, .sp-ip-otish, .sp-ip-uch { display: flex; align-items: flex-end; justify-content: center; gap: 34px; flex-wrap: wrap; position: relative; }
        .sp-ip-eski { padding-bottom: 26px; }
        .sp-ip-nomlar { position: absolute; left: 0; right: 0; bottom: 0; text-align: center; font-size: 15px; }
        .sp-ip-tel { width: 92px; height: 168px; border-radius: 14px; background: #2B2B30; padding: 8px 7px; display: flex; flex-direction: column; gap: 6px; position: relative; }
        .sp-ip-ekr { height: 72px; border-radius: 6px; background: #CFE3F2; flex: none; }
        .sp-ip-ekr.kichik { height: 52px; }
        .sp-ip-klav { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; }
        .sp-ip-klav.kam { grid-template-columns: repeat(3, 1fr); }
        .sp-ip-klav i { height: 10px; border-radius: 3px; background: #6E6E78; animation: sp-tugma .35s ease-out both; }
        @keyframes sp-tugma { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: none; } }
        .sp-ip-qalam { position: absolute; right: -16px; top: 18px; width: 5px; height: 120px; border-radius: 3px; background: #8A8A94; }
        .sp-ip-otish .klav.ketadi { animation: sp-ket 1.4s ease-in .9s both; }
        .sp-ip-otish .klav.ketadi .sp-ip-klav i { animation: sp-sondi .4s ease-in both; }
        @keyframes sp-sondi { to { opacity: 0; transform: scale(.3); } }
        @keyframes sp-ket { to { opacity: .18; } }
        .sp-ip-qalam.ketadi { animation: sp-qalam .8s ease-in .3s both; }
        @keyframes sp-qalam { to { transform: translateY(-160px); opacity: 0; } }
        .sp-ip-iphone { width: 100px; height: 186px; border-radius: 20px; background: #1E1B26; padding: 10px 8px 8px; display: flex; flex-direction: column; align-items: center; gap: 7px; position: relative; animation: sp-kir .5s ease-out 1s both; }
        .sp-ip-uch .sp-ip-iphone { animation: none; }
        .sp-ip-iphone > .sp-brend { position: absolute; bottom: -24px; font-size: 15px; }
        .sp-ip-katta { width: 100%; flex: 1; border-radius: 6px; background: linear-gradient(160deg, #DDEBF7, #B7CFE6); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
        .sp-ip-katta.ichida i { width: 26px; height: 26px; border-radius: 7px; background: ${T.paper}; color: #3A3A3C; display: flex; align-items: center; justify-content: center; animation: sp-kir .35s ease-out both; }
        .sp-ip-katta.ichida i svg { width: 18px; height: 18px; }
        .sp-ip-home { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #8A8A94; flex: none; }
        .sp-ip-hy { position: absolute; right: -44px; bottom: 6px; font-style: normal; font-size: 12.5px; font-weight: 800; color: ${T.ink2}; }
        .sp-ip-uch { align-items: center; gap: 20px; padding-bottom: 26px; }
        .sp-ip-qur { display: flex; flex-direction: column; gap: 10px; }
        .sp-ip-q { display: flex; align-items: center; gap: 8px; color: #3A3A3C; }
        .sp-ip-q svg { animation: sp-uchib 0.7s cubic-bezier(.5,0,.6,1) both; animation-delay: inherit; }
        .sp-ip-q svg { width: 28px; height: 28px; }
        .sp-ip-q em { font-style: normal; font-size: 14px; font-weight: 700; color: ${T.ink}; }
        @keyframes sp-uchib { 0% { transform: none; opacity: 1; } 100% { transform: translateX(150px) scale(.4); opacity: 0; } }
        .sp-ip-ibora { position: absolute; left: 0; right: 0; bottom: 0; text-align: center; font-size: 15px; font-weight: 800; color: ${T.accent}; animation: sp-kir .5s ease-out 3.2s both; }
        .sp-ip-uch .sp-ip-iphone > .sp-brend { display: none; }
        /* Testlardan keyingi kichik vizual */
        .sp-mini { display: flex; flex-wrap: wrap; gap: 6px; }
        .sp-mini-u { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 4px 10px; animation: sp-kir .35s ease-out both; }
        .sp-mini-u b { font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: ${T.ink2}; }
        .sp-mini-u.kulrang { color: ${T.ink2}; border-style: dashed; }
        .sp-mini-u.yon { border-color: ${fon(T.ok, 0.55)}; }
        .sp-mini-ikki { display: flex; gap: 16px; align-items: center; }
        .sp-mini-ip { width: 64px; height: 112px; border-radius: 14px; background: #1E1B26; padding: 7px 6px 6px; display: flex; flex-direction: column; align-items: center; gap: 5px; flex: none; }
        .sp-mini-ip .sp-ip-home { width: 12px; height: 12px; } .sp-mini-ip .sp-brend { display: none; }
        .sp-mini-o { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .sp-mini-fn { display: flex; flex-wrap: wrap; gap: 4px; opacity: .45; }
        .sp-mini-fn span { font-size: 12px; font-weight: 700; color: ${T.ink2}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 7px; text-decoration: line-through; }
        .sp-mini-t { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 5px; }
        .sp-mini-tb { display: flex; flex-direction: column; gap: 3px; padding: 5px 7px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; animation: sp-kir .35s ease-out both; min-width: 0; }
        .sp-mini-tb b { font-size: 12px; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: clip; }
        .sp-mini-tb em { font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; white-space: nowrap; }
        .sp-mini-tb.on { border-color: ${T.accent}; }
        .sp-mini-hk .sp-hk { max-width: 520px; }
        /* Mustaqil ish: strip, karta, maydon */
        .sp-strip { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .sp-strip-y { font-size: 13px; font-weight: 800; color: ${T.ink}; margin-right: 4px; }
        .sp-strip .q-chip i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .sp-strip .q-chip.ok i { color: ${T.ok}; }
        .sp-tab.yangi { animation: sp-yashil 1.1s ease-out both; }
        /* Mustaqil ish ikki ustunli (karta + uyalar · karta + varaq) — qolipning 640px chegarasi bu yerda kengayadi */
        .q-mustaqil:has(> .sp-ish), .q-mustaqil:has(> .sp-video), .q-mustaqil:has(> .sp-fokus) { max-width: none; }
        .sp-ish { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 18px; align-items: start; }
        .sp-karta { display: flex; flex-direction: column; gap: 9px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 14px 30px -18px ${fon(T.accent, 0.55)}; animation: sp-kir .4s ease-out both; transition: transform .38s cubic-bezier(.5,0,.6,1), opacity .38s; }
        .sp-karta.err { border-color: ${T.err}; }
        .sp-karta.uch { transform: translateY(-60px) scale(.6); opacity: 0; }
        p.sp-ust { margin: 0; font-size: 13px; color: ${T.ink2}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .sp-maydon { position: relative; display: flex; }
        .sp-maydon-n { position: absolute; left: 10px; top: 10px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; color: #fff; background: ${T.accent}; }
        textarea.sp-inp { flex: 1; resize: none; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 12px 24px 42px; outline: none; }
        textarea.sp-inp:focus { border-color: ${T.accent}; background: ${T.paper}; }
        textarea.sp-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .sp-maydon.chorla textarea.sp-inp { box-shadow: inset 0 0 0 1px ${fon(T.accent, 0.5)}; animation: sp-chorla 1.8s ease-out .5s 2; }
        .sp-sanoq { position: absolute; right: 10px; bottom: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; }
        .sp-sanoq.oshdi { color: ${T.err}; font-weight: 700; }
        p.sp-kulrang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.sp-yana { margin: 0; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .sp-yordam { display: flex; flex-direction: column; gap: 4px; padding: 9px 12px; border-radius: 10px; background: ${T.bg}; }
        .sp-yordam p { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .sp-karta-tug { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .sp-karta-tug .sp-o { margin-left: auto; }
        .sp-fokus { display: flex; flex-direction: column; gap: 12px; }
        /* «Hikoyam» kartasi */
        .sp-hk { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.35); }
        .sp-hk-h { display: flex; align-items: center; gap: 8px; }
        .sp-hk-h b { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .sp-hk-b { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 6px; padding: 2px 8px; animation: sp-pop .4s ease-out; }
        .sp-hk-q { display: grid; grid-template-columns: 92px minmax(0,1fr) auto; gap: 10px; align-items: start; padding: 7px 9px; border-radius: 10px; border: 1.5px solid transparent; transition: background .4s, border-color .4s; }
        .sp-hk-q.bosh { border: 1.5px dashed ${T.line}; min-height: 34px; }
        .sp-hk-n { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: ${T.ink2}; padding-top: 2px; }
        .sp-hk-m { font-size: 15px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .sp-hk-q.yon { background: ${T.accentSoft}; border-color: ${fon(T.accent, 0.5)}; }
        .sp-hk-q.ok { animation: sp-yashil 1.2s ease-out both; }
        .sp-hk-q.acc { animation: sp-acc 1.2s ease-out both; border-color: ${fon(T.accent, 0.5)}; }
        .sp-mini-hk .sp-hk-q.acc { animation: none; background: ${T.accentSoft}; }
        button.sp-tahrir { border: none; background: transparent; color: ${T.accent}; font-size: 15px; font-weight: 800; cursor: pointer; padding: 0 4px; }
        /* Video va tekshirish */
        .sp-video { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 20px; align-items: start; }
        .sp-v-chap, .sp-v-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .sp-rozi { display: flex; flex-direction: column; gap: 7px; }
        .sp-rozi-y { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .sp-rozi-v { display: flex; gap: 8px; flex-wrap: wrap; }
        .sp-rozi-v.kutish .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: sp-chorla 1.8s ease-out .5s 2; }
        .sp-rozi-v.kutish .q-chip:nth-child(2) { animation-delay: .75s; }
        .sp-taymer { display: flex; flex-direction: column; gap: 5px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .sp-taymer.yur { border-color: ${T.accent}; }
        .sp-taymer-l { height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .sp-taymer-l > i { display: block; height: 100%; background: ${T.accent}; border-radius: 99px; transition: width .25s linear; }
        .sp-taymer-c { display: flex; align-items: baseline; gap: 10px; }
        .sp-taymer-c b { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: ${T.ink}; }
        .sp-taymer-c em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: ${T.ink2}; }
        .sp-taymer-c span { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; }
        .sp-ikki { display: flex; gap: 8px; flex-wrap: wrap; }
        .sp-ikki .sp-var { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: sp-chorla 1.8s ease-out .3s 2; }
        .sp-varaq { display: flex; flex-direction: column; gap: 8px; }
        .sp-vq { display: flex; flex-direction: column; gap: 7px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: background .3s, border-color .3s; }
        .sp-vq.ha { background: ${T.okFon}; border-color: ${fon(T.ok, 0.55)}; }
        .sp-vq.yoq { border-color: ${T.err}; }
        .sp-vq.navbat .q-chip { border-color: ${fon(T.accent, 0.6)}; animation: sp-chorla 1.8s ease-out .4s 2; }
        .sp-vq-r { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .sp-vq-t { flex: 1 1 220px; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-size: 15px; font-weight: 700; color: ${T.ink}; }
        .sp-vq-t > b { color: ${T.accent}; }
        .sp-vq-vaqt { font-style: normal; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .sp-vq-tug { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .sp-vq-oz { font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .sp-vq-m { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        /* Kartochka — neytral (SABOQ P10) */
        .sp-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: sp-puls 1.8s ease-out .4s 3; }
        .sp-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .sp-flash .fc-front { border-color: ${fon(T.accent, 0.45)}; box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.sp-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.sp-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun */
        .sp-yakun.belgisiz .done-chip .tick { display: none; }
        .sp-hw { display: flex; flex-direction: column; gap: 12px; }
        .sp-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .sp-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .sp-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .sp-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.sp-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .sp-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .sp-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .sp-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 760px) {
          .sp-sahna { grid-template-columns: minmax(0,1fr); justify-items: start; }
          .sp-chiziq { grid-template-columns: minmax(0,1fr); }
          .sp-ish, .sp-video { grid-template-columns: minmax(0,1fr); }
          .sp-mini-t { grid-template-columns: repeat(3, minmax(0,1fr)); }
          .sp-hw-karta { grid-template-columns: 1fr; }
          .sp-hk-q { grid-template-columns: minmax(0,1fr) auto; } .sp-hk-n { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) { .sp-tm-bo em { visibility: hidden; } .sp-tasma-b { grid-template-columns: repeat(2, minmax(0,1fr)); } .sp-skelet-u { grid-template-columns: repeat(3, minmax(0,1fr)); } }
        @media (prefers-reduced-motion: reduce) {
          .sp-halqa, .sp-k.kutish .q-variant, .q-bashorat .q-chip, .sp-qadamlar .q-chip, .sp-rolk, .sp-rolk-s > i, .sp-tel-juma, .sp-tel-son, .sp-tel-bosh, .sp-fn, .sp-fn-uya, .sp-40-l > i, .sp-uya, .sp-mdn-joy i, .sp-mekran b, .sp-bo, .sp-bo-rol, .sp-bo-hk, .sp-demo-son, .sp-tm-t > i, .sp-skelet-b, .sp-voqea-h, .sp-ip-klav i, .sp-ip-tel, .sp-ip-qalam, .sp-ip-iphone, .sp-ip-katta.ichida i, .sp-ip-q svg, .sp-ip-ibora, .sp-mini-u, .sp-mini-tb, .sp-tab, .sp-karta, .sp-maydon.chorla textarea.sp-inp, .sp-hk-b, .sp-hk-q, .sp-rozi-v .q-chip, .sp-ikki .sp-var, .sp-vq .q-chip, .sp-flash .fc-front, .sp-uchar, .sp-royxat, .sp-taymer-l > i { animation: none !important; transition: none !important; }
          .sp-ip-q svg { opacity: 0; } .sp-ip-otish .klav.ketadi { opacity: .18; } .sp-ip-qalam.ketadi { opacity: 0; }
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
        .sp-test-viz { margin-top: 4px; }
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
