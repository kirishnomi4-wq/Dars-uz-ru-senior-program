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
// Kod oynasi (11-ekran): app.js + index.html, tekshiruv — checks (C)
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

const LESSON_META = { lessonId: 'pm-m9d3-v1', lessonTitle: { uz: "Ikki g'oyadan qaysi biri odamlarga kerak?", ru: 'Какая из двух идей нужна людям?' } };
// 16 ekran (MD v3): kirish → reja → tushuncha (2) → test → tushuncha (4) → test → tushuncha (6) → keys → test → mustaqil (9, 10) → kod → yakuniy test → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'intervyu', ru: 'интервью' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'yozuv', ru: 'запись' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'savol', ru: 'вопрос' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "g'oya", ru: 'идея' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD: 3 — C · 5 — A · 8 — D · 12 — B (yangi dars, o'rni shunday qoladi). -1 — praktika signali (variant yo'q).
const INLINE_KEYS = { s3: 2, s5: 0, s8: 3, s12: 1, shablon: -1, yozuv: -1, koding: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rnida raqam (S-026)
const RECAPS = {
  3: { title: { uz: 'Bir xil savollar', ru: 'Одинаковые вопросы' }, cards: [
    { ic: '1', h: { uz: "Voqea savoli bo'lib o'tgan ishni so'raydi; «ishlatarmidingiz?» — bo'sh savol.", ru: 'Вопрос о событии спрашивает о том, что было; «пользовались бы?» — пустой вопрос.' } },
    { ic: '2', h: { uz: "Ikkala g'oyaga savollar bir xil.", ru: 'Для обеих идей вопросы одинаковые.' } },
    { ic: '3', h: { uz: "Faqat 1-savolda bo'lak almashadi.", ru: 'Только в 1-м вопросе меняется часть.' }, ask: { uz: "Sinf uy vazifalari g'oyasida birinchi savol qanday bo'ladi?", ru: 'Каким будет первый вопрос для идеи о домашних заданиях класса?' } }
  ] },
  5: { title: { uz: 'Hozir nima bilan', ru: 'Чем сейчас' }, cards: [
    { ic: '1', h: { uz: "To'rtinchi savol: «Hozir buni nima bilan hal qilyapsiz?»", ru: 'Четвёртый вопрос: «Чем вы сейчас это решаете?»' } },
    { ic: '2', h: { uz: 'Javob odam hozir nima qilayotganini aytadi.', ru: 'Ответ говорит, что человек делает сейчас.' } },
    { ic: '3', h: { uz: 'Yangi yechim shu bilan solishtiriladi.', ru: 'С этим сравнивают новое решение.' }, ask: { uz: "Siz jamoani hozir nima bilan yig'asiz?", ru: 'Чем вы сейчас собираете команду?' } }
  ] },
  8: { title: { uz: 'Airbnb — odam oldiga borish', ru: 'Airbnb — прийти к человеку' }, cards: [
    { ic: '1', h: { uz: "2007-yilda asoschilar o'z uyida uchta havo to'shagini ijaraga bergan.", ru: 'В 2007 году основатели сдали у себя дома три надувных матраса.' } },
    { ic: '2', h: { uz: "Saytga yangi odamlar qo'shilmay qolganda, ular Nyu-Yorkdagi kvartiralarni o'zlari aylangan.", ru: 'Когда новые люди перестали приходить на сайт, они сами обошли квартиры в Нью-Йорке.' } },
    { ic: '3', h: { uz: "Yomon suratlar xalaqit berayotganini o'sha yerda bilgan.", ru: 'Там они узнали, что мешают плохие фото.' }, ask: { uz: "Ikki g'oyangiz odamlarini qayerda uchratasiz?", ru: 'Где вы встретите людей ваших двух идей?' } }
  ] },
  12: { title: { uz: 'Harakat belgisi', ru: 'Знак действия' }, cards: [
    { ic: '1', h: { uz: "Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish — harakat belgisi.", ru: 'Интерес, который человек в конце интервью показал не словом, а делом, — знак действия.' } },
    { ic: '2', h: { uz: "Mentor misolida — odam sinab ko'rishga kun belgiladimi.", ru: 'В примере Ментора — назначил ли человек день, чтобы попробовать.' } },
    { ic: '3', h: { uz: "Yozuvga faqat «ha» yoki «yo'q» tushadi.", ru: 'В запись попадает только «да» или «нет».' }, ask: { uz: "Do'stingiz g'oyangizni maqtadi — bu harakat belgisimi?", ru: 'Друг похвалил вашу идею — это знак действия?' } }
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
  return <div ref={ref} className="io-test-viz fade-step">{children}</div>;
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
        {/* MD: javob topilgach (jonli darsda — natija ochilgandan keyin) savol ostida kichik karta */}
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 3-dars «Ikki g'oyadan qaysi biri odamlarga kerak?» (MD v3: feedback/F-1005-11modul/03-PmInterviewsOne-v3.md, GATE M) =====
// Bitta vizual (163/180): ikki ustunli shablon — IkkiShablon + YozuvKarta + Joylar; bitta manba — SHABLON, MENTOR_GOYALAR2, MENTOR_YOZUVLAR va o'quvchi ma'lumoti (pm-m9d3-intervyu).
// qolip-maket: io-tomon io-qalam io-yk
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Bosiladigan joy halqasi (SABOQ 11, 32): accent halqa doim, yengil to'lqin (≤3%, 2.4 s, 3 marta); guruhda bitta halqa — io-guruh
const halqa = (on) => (on ? 'io-halqa' : undefined);
// Kechikkan holat: shart bajarilgach ms dan keyin true (darhol — saqlangan holatda; kam harakatda — kutishsiz)
const useKeyin = (shart, ms, darhol = false) => {
  const [on, setOn] = useState(!!(shart && darhol));
  useEffect(() => {
    if (!shart) { setOn(false); return undefined; }
    if (kamHarakat()) { setOn(true); return undefined; }
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [shart, ms]);
  return on;
};
// Ekrandan chiqilsa to'xtaydigan setTimeout
const useTaymer = () => {
  const ids = useRef([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => { ids.current.push(setTimeout(fn, ms)); }, []);
};
// Harakatsizlikda bitta ipucha (javobni aytmaydi): kalit o'zgarsa sanoq qaytadan
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
// Uchish (SABOQ 19, FLIP): narsa bosilgan joyidan yangi joyiga uchadi. Manba o'lchami bosishda olinadi; yangi element (data-uch) chizilgach
// o'sha nuqtadan o'z joyiga suriladi (kech — kechikish, ms). Kam harakat rejimida — darrov joyida.
const uchir = (dan, el, ms = 560, kech = 0) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width; // .lesson-root zoom tuzatmasi
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.3, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: 'none', opacity: 1 }], { duration: ms, delay: kech, fill: 'backwards', easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const navbat = useRef([]);
  useLayoutEffect(() => {
    if (!navbat.current.length) return;
    const q = navbat.current; navbat.current = [];
    q.forEach(u => uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms, u.kech));
  });
  return useCallback((manba, k, ms, kech) => {
    const r = manba && (manba.getBoundingClientRect ? manba.getBoundingClientRect() : manba);
    if (r) navbat.current.push({ r, k, ms, kech });
  }, []);
};
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="io-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="io-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="io-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};
// 151-qonun: nishon sharti qatori (birinchi urinish); nishon olingach yoki mashq-o'tishida ko'rinmaydi
const NishonQatori = ({ screen }) => {
  const olingan = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || (olingan && olingan.has(ach))) return null;
  const ketdi = am.missed.has(sid);
  return <p className={cxx('io-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
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
    <div className="io-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('io-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="io-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};
// Mentor statistikasi (9, 10-ekran): jonli darsda o'quvchilar yuborgan ishtirok-signali (500+ zona) bo'yicha ikki son
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
  return <div className="io-mstat fade-up">{yorliqlar.map((y, i) => <div key={i} className="io-mstat-q"><b>{sonlar[i]}</b><span>{tr(y)}</span></div>)}</div>;
};
// Brend nomi o'z rangida (PM-028/029, S-018); logotip chizilmaydi
const Telegram = () => <span className="io-brend-tg">Telegram</span>;
const Airbnb = () => <span className="io-brend-ab">Airbnb</span>;

// ----- Ma'lumot (tayanch 1.1–1.3 aynan): shablon, Mentorning ikki g'oyasi, birinchi beshta yozuv -----
const SHABLON = [
  { kalit: 'kim', nom: { uz: 'Kim', ru: 'Кто' } },
  { kalit: 'oxirgi', nom: { uz: 'Oxirgi marta', ru: 'В последний раз' }, savol: { uz: "Oxirgi marta {bolak} qachon bo'ldi?", ru: 'Когда вы в последний раз {bolak}?' } },
  { kalit: 'qanday', nom: { uz: 'Qanday qildi', ru: 'Как поступил' }, savol: { uz: "O'shanda qanday qildingiz?", ru: 'Как вы тогда поступили?' } },
  { kalit: 'qiyin', nom: { uz: 'Eng qiyini', ru: 'Самое трудное' }, savol: { uz: "Eng qiyini nima bo'ldi?", ru: 'Что было самым трудным?' } },
  { kalit: 'hozir', nom: { uz: 'Hozir nima bilan', ru: 'Чем сейчас' }, savol: { uz: 'Hozir buni nima bilan hal qilyapsiz?', ru: 'Чем вы сейчас это решаете?' } },
  { kalit: 'belgi', nom: { uz: 'Harakat belgisi', ru: 'Знак действия' }, savol: { uz: "Birinchi versiya tayyor bo'lganda, uni sinab ko'rishga 10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?", ru: 'Когда первая версия будет готова, дадите 10 минут, чтобы её попробовать? Какой день назначите?' } }
];
const SH = Object.fromEntries(SHABLON.map(q => [q.kalit, q]));
const KIMDAN_L = { uz: 'Kimdan', ru: 'У кого' };
const SAVOLLAR_UZ = SHABLON.slice(1).map(q => q.savol.uz); // pm-m9d3-intervyu.savollar: 1-savolda «{bolak}» joyi
const YOQ = "yo'q";
const MENTOR_GOYALAR2 = [
  { nom: { uz: "Jamoa yig'ish", ru: 'Сбор команды' }, muammo: { uz: "o'yinga odam yetmaydi, kim kelishi noma'lum", ru: 'на игру не хватает людей, неизвестно, кто придёт' }, kim: { uz: "mahalladagi o'yinchilar", ru: 'игроки из махалли' }, bolak: { uz: "o'yinga odam yig'ganingiz", ru: 'собирали людей на игру' }, rice: 24 },
  { nom: { uz: "Mahalla to'garaklari", ru: 'Кружки махалли' }, muammo: { uz: "qaysi to'garak qayerda va qachon — bilinmaydi", ru: 'какой кружок где и когда — неизвестно' }, kim: { uz: "to'garak izlayotgan o'smirlar", ru: 'подростки, которые ищут кружок' }, bolak: { uz: "to'garak izlaganingiz", ru: 'искали кружок' }, rice: 20 }
];
const MENTOR_YOZUVLAR = [
  { n: 1, goya: 0, kun: 'shanba', belgi: 'ha', kim: { uz: "o'yinchi, 15 yosh", ru: 'игрок, 15 лет' }, oxirgi: { uz: "o'tgan shanba: 10 kishi kerak edi, 7 kishi keldi", ru: 'прошлая суббота: нужно было 10 человек, пришли 7' }, qanday: { uz: "Telegram guruhida «kim keladi?» deb yozdi", ru: 'написал в Telegram-группе «кто придёт?»' }, qiyin: { uz: "kim «+» qo'ygani xabarlar orasida yo'qoldi", ru: 'кто поставил «+», потерялось среди сообщений' }, hozir: { uz: 'Telegram guruhi', ru: 'Telegram-группа' } },
  { n: 2, goya: 0, kun: 'yakshanba', belgi: 'ha', kim: { uz: "o'yinchi, 14 yosh", ru: 'игрок, 14 лет' }, oxirgi: { uz: 'kecha: ikki kishi oxirgi daqiqada kelmadi', ru: 'вчера: двое не пришли в последнюю минуту' }, qanday: { uz: "tanishlariga birma-bir qo'ng'iroq qildi", ru: 'обзвонил знакомых по одному' }, qiyin: { uz: 'kim aniq kelishini bilmadi', ru: 'не знал, кто точно придёт' }, hozir: { uz: "Telegram guruhi va qo'ng'iroq", ru: 'Telegram-группа и звонки' } },
  { n: 3, goya: 0, kun: 'shanba', belgi: 'ha', kim: { uz: "o'yinchi, 16 yosh, o'yinni ko'pincha o'zi yig'adi", ru: 'игрок, 16 лет, часто сам собирает игру' }, oxirgi: { uz: "uch kun oldin: 6 kishi yig'ildi, o'yin bo'lmadi", ru: 'три дня назад: собралось 6 человек, игры не было' }, qanday: { uz: 'guruhga uch marta yozdi', ru: 'написал в группу три раза' }, qiyin: { uz: 'javoblar boshqa xabarlar ostida qoldi', ru: 'ответы остались под другими сообщениями' }, hozir: { uz: 'Telegram guruhi', ru: 'Telegram-группа' } },
  { n: 6, goya: 1, kun: null, belgi: YOQ, kim: { uz: "o'smir, 14 yosh", ru: 'подросток, 14 лет' }, oxirgi: { uz: "yozda: robototexnika to'garagini qidirdi, topolmadi", ru: 'летом: искал кружок робототехники, не нашёл' }, qanday: { uz: "onasi tanishlaridan so'radi", ru: 'мама спросила у знакомых' }, qiyin: { uz: "qayerda va qachon ekani noma'lum", ru: 'неизвестно, где и когда' }, hozir: { uz: 'ota-onaning tanishlari', ru: 'знакомые родителей' } },
  { n: 7, goya: 1, kun: 'yakshanba', belgi: 'ha', kim: { uz: "ota-ona (o'g'li 13 yoshda)", ru: 'родитель (сыну 13 лет)' }, oxirgi: { uz: "sentabrda: suzish to'garagini qidirdi", ru: 'в сентябре: искал кружок плавания' }, qanday: { uz: "mahalla guruhida va tanishlardan so'radi", ru: 'спросил в группе махалли и у знакомых' }, qiyin: { uz: "jadvalni bilish uchun borib ko'rish kerak", ru: 'чтобы узнать расписание, надо сходить и посмотреть' }, hozir: { uz: 'tanishlar', ru: 'знакомые' } }
];
const QISM_L = { muammo: { uz: 'Muammo', ru: 'Проблема' }, kim: { uz: 'Kim uchun', ru: 'Для кого' } };
const qisqa = (s, n = 40) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; };

// ----- Saqlash (tayanch 8): pm-m9d3-intervyu = { goyalar: [{ matn, kim, bolak }] × 2, savollar: [5], yozuvlar: [], savedAt }; o'qiydi pm-m9d2-rice (ikkita) va pm-m9d1-goyalar -----
const INTERVYU_KEY = 'pm-m9d3-intervyu';
const intervyuLs = () => { const v = lsGet(INTERVYU_KEY); return v && Array.isArray(v.goyalar) && v.goyalar.length === 2 && v.goyalar.every(g => g && typeof g.bolak === 'string' && g.bolak.trim()) ? v : null; };
const ikkiGoyaLs = () => {
  const r = lsGet('pm-m9d2-rice'); const g = lsGet('pm-m9d1-goyalar');
  const ro = g && Array.isArray(g.goyalar) ? g.goyalar : [];
  if (!r || !Array.isArray(r.ikkita) || r.ikkita.length < 2) return null;
  const ikki = r.ikkita.slice(0, 2).map(i => (typeof i === 'number' ? ro[i] : i)).filter(x => x && typeof x === 'object' && (x.yechim || x.matn || x.muammo));
  return ikki.length === 2 ? ikki.map(x => ({ matn: String(x.yechim || x.matn || x.muammo).trim(), kim: String(x.kim || '').trim() })) : null;
};
// Tutuq va qo'shtirnoq turlari bitta ko'rinishga (belgilar kod bilan yig'iladi — fayl ichida maxsus belgi turmaydi)
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const QOSHTIRNOQ_RE = new RegExp('[' + String.fromCharCode(0xAB, 0xBB, 0x22, 0x201C, 0x201D) + '.!?,;:]+', 'g');
const normYoz = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(QOSHTIRNOQ_RE, ' ').replace(/\s+/g, ' ').trim();

// ----- Shablon vizuali: savol matni (1-savolda bo'lak accent fonda) -----
const SavolT = ({ kalit, bolak, ajrat = true, bolakKey }) => {
  const s = tr(SH[kalit] && SH[kalit].savol);
  if (!s) return null;
  const [a, b] = s.split('{bolak}');
  if (b === undefined) return <i className="io-sv">{s}</i>;
  return <i className="io-sv">{a}<span key={bolakKey} className={cxx('io-bolak', ajrat && 'on', bolakKey && 'almash')}>{bolak ? tr(bolak) : '…'}</span>{b}</i>;
};
// IkkiShablon — ikki ustunli shablon (dars bo'yi bitta vizual). Bitta grid: har qator ikki katakda — bir xil qatorlar bir balandlikda, orasida chiziq (SABOQ 1, 35).
// ustunlar: [{ nom, bolak, kimdan }] · qatorlar: ['kim' | 'kimdan' | 'oxirgi' | 'qanday' | 'qiyin' | 'hozir' | 'belgi'] ·
// yangi: { [kalit]: true } — qator sirg'alib kiradi va ~1 s yashil yonadi · kat(ui, q): { yoq, yangi, kul, ichi, tepada, osti, uch, qalam } — katakni sozlash ·
// ostida: [node, node] — ustun ostida · chiziq: bir xil qatorlar orasida ingichka chiziq · faol: ajralgan ustun · ixcham: faqat qator nomlari
const IkkiShablon = ({ ustunlar, qatorlar, yangi = {}, kat, ostida, chiziq, ajrat = true, faol, kichik, ixcham, className, ustida }) => {
  const katak = (ui, q) => (kat && kat(ui, q)) || {};
  const bor = (ui, q) => !katak(ui, q).yoq;
  const oxirgi = ustunlar.map((_, ui) => { const b = qatorlar.filter(q => bor(ui, q)); return b.length ? b[b.length - 1] : null; });
  return (
    <div className={cxx('io-sh', kichik && 'kichik', ixcham && 'ixcham', chiziq && 'chiziq', className)}>
      {ustunlar.map((u, ui) => (
        <div key={`h${ui}`} className={cxx('io-sh-k', 'bosh', faol === ui && 'faol', !ostida && oxirgi[ui] === null && 'oxir')} style={{ gridColumn: ui + 1, gridRow: 1 }}>
          {ustida && ustida[ui]}
          <b className="io-sh-nom">{tr(u.nom)}</b>
        </div>
      ))}
      {qatorlar.map((q, qi) => ustunlar.map((u, ui) => {
        const o = katak(ui, q);
        if (o.yoq) return null;
        const juft = ui === 0 && ustunlar.length > 1 && bor(1, q);
        return (
          <div key={`${q}-${ui}`} data-uch={o.uch} data-q={`${q}-${ui}`}
            className={cxx('io-sh-k', (o.yangi ?? yangi[q]) && 'yangi', o.kul && 'kul', juft && 'juft', faol === ui && 'faol', !ostida && oxirgi[ui] === q && 'oxir')}
            style={{ gridColumn: ui + 1, gridRow: qi + 2, '--r': qi + 1 }}>
            {o.tepada}
            <span className="io-sh-l">{tr(q === 'kimdan' ? KIMDAN_L : SH[q].nom)}</span>
            {o.ichi !== undefined ? o.ichi : q === 'kimdan' ? <span className="io-sh-v">{u.kimdan}</span> : (q === 'kim' || ixcham) ? null : <SavolT kalit={q} bolak={u.bolak} ajrat={ajrat} />}
            {o.osti}
            {o.qalam && <button type="button" className="io-qalam" onClick={o.qalam} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
          </div>
        );
      }))}
      {ostida && ustunlar.map((u, ui) => <div key={`o${ui}`} className={cxx('io-sh-k', 'ostida', 'oxir', faol === ui && 'faol')} style={{ gridColumn: ui + 1, gridRow: qatorlar.length + 2 }}>{ostida[ui]}</div>)}
    </div>
  );
};
// Harakat belgisi: «ha» — yashil ✓, «yo'q» — kulrang
const BelgiT = ({ b }) => (b === 'ha'
  ? <span className="io-belgi ha">{tr({ uz: 'ha', ru: 'да' })} ✓</span>
  : b === YOQ ? <span className="io-belgi yoq">{tr({ uz: "yo'q", ru: 'нет' })}</span> : null);
// YozuvKarta: ixcham (Kim · harakat belgisi) va to'liq (olti qator, tayanch 1.3 matni); ixchamini bosish — to'liq ochiladi (U-013)
const YozuvKarta = ({ y, ixcham, onBos, ochiq, uch, katta, className, qatorlar, yangi, ichi = {}, teg }) => {
  if (ixcham) {
    const ich = <><span className="io-yk-k">{tr(y.kim)}</span><BelgiT b={y.belgi} /></>;
    return onBos
      ? <button type="button" className={cxx('io-yk', ochiq && 'on', className)} data-uch={uch} onClick={onBos}>{ich}</button>
      : <span className={cxx('io-yk', className)} data-uch={uch}>{ich}</span>;
  }
  const ro = qatorlar || SHABLON.map(q => q.kalit);
  return (
    <div className={cxx('io-yt', katta && 'katta', className)} data-uch={uch}>
      {teg}
      {ro.map(k => (
        <div key={k} className={cxx('io-yt-q', yangi === k && 'yangi', k === 'belgi' && 'belgi')}>
          <span className="io-sh-l">{tr(SH[k].nom)}</span>
          <span className="io-yt-v">{ichi[k] !== undefined ? ichi[k] : k === 'belgi' ? <BelgiT b={y.belgi} /> : tr(y[k])}</span>
        </div>
      ))}
    </div>
  );
};
// Yozuv joylari (P-056 sig'im-sahnasi): «Yozuvlar · n / 5» va beshta joy — bo'sh joy kichik uzuq iz, to'ldirilgani — oq yozuv kartasi
const Joylar = ({ yozuvlar = [], jami = 5, sanoq = true, kirish, onOch, ochiq, teg }) => {
  const ochY = ochiq != null ? yozuvlar.find(y => y.id === ochiq) : null;
  return (
    <div className={cxx('io-joy', kirish && 'kir')}>
      <span className="io-joy-y">{tr({ uz: 'Yozuvlar', ru: 'Записи' })}{sanoq && <> · <b key={yozuvlar.length}>{yozuvlar.length} / {jami}</b></>}</span>
      {teg}
      <div className="io-joy-ro">
        {Array.from({ length: jami }).map((_, i) => {
          const y = yozuvlar[i];
          return y
            ? <YozuvKarta key={i} y={y} ixcham uch={y.uch} ochiq={ochiq === y.id} onBos={onOch && (() => onOch(ochiq === y.id ? null : y.id))} />
            : <span key={i} className="io-joy-b" style={{ '--i': i }} />;
        })}
      </div>
      {ochY && <YozuvKarta y={ochY} className="io-joy-toliq" />}
    </div>
  );
};
// Real ko'rinishdagi odam (SABOQ 36): bosh, soch, ko'z, tabassum, rangli kiyim; qo'lida narsa. (x, y) — oyoq ostidagi nuqta, bo'yi ≈ 88.
const RANG = {
  teri: ['#EEC6A0', '#C98F66', '#E2A982'], soch: ['#2B1E17', '#5A3A25', '#1E1A1A'],
  kiyim: ['#E0765C', '#3D7EB4', '#E7A33E', '#7A62C8', '#2E9C78', '#D56B8A'], shim: '#394060', oyoq: '#2A2730', lab: '#8A4B3A',
  devor: '#F6EDE1', pol: '#E5D4BF', yogoch: '#B98552', yogochQ: '#8C5A33'
};
const Odam = ({ x = 0, y = 0, s = 1, teri = 0, soch = 0, kiyim = 0, yuz = 1, sochTur = 'qisqa', qol, className, style }) => {
  const k = RANG.kiyim[kiyim % RANG.kiyim.length], t = RANG.teri[teri % 3], h = RANG.soch[soch % 3];
  return (
    <g className={className} style={style}><g transform={`translate(${x} ${y}) scale(${s * yuz} ${s})`}>
      <rect x="-8.5" y="-34" width="7.5" height="32" rx="3.5" fill={RANG.shim} />
      <rect x="1" y="-34" width="7.5" height="32" rx="3.5" fill={RANG.shim} />
      <rect x="-10.5" y="-4" width="10" height="4.5" rx="2.2" fill={RANG.oyoq} />
      <rect x="1" y="-4" width="11" height="4.5" rx="2.2" fill={RANG.oyoq} />
      {qol === 'sumka' && <rect x="-21" y="-56" width="10" height="21" rx="3" fill={RANG.yogochQ} />}
      <rect x="-15.5" y="-60" width="7" height="27" rx="3.5" fill={k} opacity="0.88" />
      <rect x="-12" y="-64" width="24" height="33" rx="9" fill={k} />
      <circle cx="-12" cy="-32.5" r="3.3" fill={t} />
      {qol === 'telefon' || qol === 'kamera'
        ? <>
          <rect x="7.5" y="-60" width="7" height="15" rx="3.5" fill={k} />
          <rect x="8" y="-49" width="15" height="7" rx="3.5" fill={k} />
          <circle cx="23" cy="-45.5" r="3.3" fill={t} />
          {qol === 'telefon'
            ? <rect x="20" y="-57" width="7" height="11" rx="1.6" fill="#2A2730" />
            : <g><rect x="17" y="-58" width="15" height="10" rx="2" fill="#2F3142" /><circle cx="24.5" cy="-53" r="3" fill="#8FB3D9" /><rect x="19" y="-60" width="5" height="2.4" rx="1" fill="#2F3142" /></g>}
        </>
        : <><rect x="8.5" y="-60" width="7" height="27" rx="3.5" fill={k} /><circle cx="12" cy="-32.5" r="3.3" fill={t} /></>}
      <rect x="-3" y="-70" width="6" height="7" rx="2" fill={t} />
      <circle cx="0" cy="-78" r="11" fill={t} />
      {sochTur === 'uzun' && <path d="M -11 -79 C -13 -63, -10 -59, -4 -60 L -6 -74 Z" fill={h} />}
      <path d="M -11.5 -77 C -13 -94, 13 -94, 11.5 -78 C 6 -84, -2 -85, -11.5 -77 Z" fill={h} />
      {sochTur === 'dumaloq' && <circle cx="-8" cy="-89" r="4.5" fill={h} />}
      <circle cx="3" cy="-78" r="1.4" fill="#2A2730" />
      <circle cx="8" cy="-78" r="1.4" fill="#2A2730" />
      <path d="M 3.5 -72.5 Q 6 -70 8.5 -72.5" stroke={RANG.lab} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="9.5" cy="-74" r="1.8" fill="#E8867A" opacity="0.35" />
    </g></g>
  );
};
const OdamSvg = ({ w = 56, h = 92, className, ...p }) => <svg className={cxx('io-odam', className)} viewBox="-30 -96 64 98" width={w} height={h} aria-hidden="true"><Odam {...p} /></svg>;
// Telefon maketi (SABOQ 22): o'lchami barqaror ≈170×272, maket doim chapda
const Telefon = ({ children, className }) => <div className={cxx('io-tel', className)}><span className="io-tel-k" /><div className="io-tel-e">{children}</div></div>;
// Artefakt-strip (U-042): «Shablonim · 2 g'oya» — 10, 11, 15-ekranlarda
const ShStrip = () => {
  const v = intervyuLs();
  if (!v) return null;
  return <div className="io-strip fade-up"><span className="io-strip-l">{tr({ uz: "Shablonim · 2 g'oya", ru: 'Мой шаблон · 2 идеи' })}</span>{v.goyalar.map((g, i) => <span key={i} className="io-strip-g">{qisqa(g.matn, 30) || `${i + 1}-g'oya`}</span>)}</div>;
};

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'jamoa', t: { uz: "Jamoa yig'ish — mahalla o'yinchilariga", ru: 'Сбор команды — игрокам махалли' } },
  { id: 'togarak', t: { uz: "Mahalla to'garaklari — o'smirlarga", ru: 'Кружки махалли — подросткам' } }
];
// Ikki g'oya kartasi — ixcham ko'rinish (nom · muammo · kim uchun · RICE yorlig'i)
const GoyaIxcham = ({ g, holat }) => (
  <div className={cxx('io-gk', holat)}>
    <b className="io-gk-n">{tr(g.nom)}</b>
    <span className="io-gk-q"><span className="io-sh-l">{tr(QISM_L.muammo)}</span>{tr(g.muammo)}</span>
    <span className="io-gk-q"><span className="io-sh-l">{tr(QISM_L.kim)}</span>{tr(g.kim)}</span>
    <span className="io-kul">RICE {g.rice}</span>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const joyVaqt = useKeyin(picked !== null, 650, !!storedAnswer);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('io-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Ikki g'oyadan <A>qaysi biri</A> odamlarga kerak?</>, ru: <>Какая из двух идей <A>нужна людям</A>?</> })}
          mentor={<Mentor>{tr({ uz: "RICE bo'yicha eng yuqori ikki g'oyam — shular. O'zingizga yaqin javobni belgilang.", ru: 'Вот две мои идеи с самым высоким RICE. Отметьте близкий вам ответ.' })}</Mentor>}
          maket={<div className="io-s0-maket">
            {MENTOR_GOYALAR2.map((g, i) => (
              <div key={i} className="io-s0-u" style={{ '--i': i }}>
                <GoyaIxcham g={g} holat={picked === null ? undefined : picked === HOOK_OPTS[i].id ? 'on' : 'xira'} />
                {joyVaqt && <Joylar kirish />}
              </div>
            ))}
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="io-javob fade-step">{tr({ uz: "Ikkalasi ham bo'lishi mumkin. Hozircha bu — taxmin: ikkala g'oya bo'yicha odamlardan hali so'ralmagan.", ru: 'Возможны оба. Пока это предположение: людей ещё не спрашивали ни по одной идее.' })}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "Javobni muhokama qilmang va RICE ni qayta hisoblamang — savol taxmin haqida. Sinfdan so'rang: «Kim qaysi birini tanladi va nega?» — javoblar faqat eshitiladi.", ru: 'Не обсуждайте ответ и не пересчитывайте RICE — вопрос о предположении. Спросите класс: «Кто что выбрал и почему?» — ответы только выслушиваются.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda ikki ustunli shablon skeleti — qator nomlari navbat bilan chiziladi, beshta yozuv joyi oq kartaga aylanib ✓ oladi) =====
const REJA = [
  { t: { uz: "Ikki g'oyaga bir xil savollar tuzasiz", ru: 'Составите одинаковые вопросы для двух идей' }, teg: { uz: 'shablon', ru: 'шаблон' } },
  { t: { uz: "Odamning so'zi va ishini ajratishni bilib olasiz", ru: 'Научитесь отличать слова человека от его дел' }, teg: { uz: 'belgi', ru: 'знак' } },
  { t: { uz: <><Airbnb /> asoschilari muammoni qayerda topganini ko'rasiz</>, ru: <>Увидите, где основатели <Airbnb /> нашли проблему</> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: 'Sinfdoshingizdan birinchi yozuvni olasiz', ru: 'Получите первую запись от одноклассника' }, teg: { uz: 'juftlik', ru: 'пара' } }
];
// SABOQ 33: bo'sh kulrang chiziq yo'q — qatorlarda nomlar (9-Moduldan), yozuv joylarida Mentor yozuvlarining «Kim»i
const RejaChizma = () => (
  <div className="io-rj">
    <IkkiShablon kichik ixcham className="io-rj-sh" ustunlar={MENTOR_GOYALAR2} qatorlar={['kim', 'oxirgi', 'qanday', 'qiyin']}
      ostida={[0, 1].map(ui => {
        const ro = MENTOR_YOZUVLAR.filter(y => y.goya === ui);
        return (
          <div key={ui} className="io-rj-joy">
            {ro.map((y, i) => <span key={i} className="io-rj-y" style={{ '--d': `${0.9 + (ui === 0 ? i : 3 + i) * 0.4}s` }}><b aria-hidden="true">✓</b><span className="io-yk-k">{tr(y.kim)}</span></span>)}
            {Array.from({ length: 5 - ro.length }).map((_, i) => <span key={`b${i}`} className="io-joy-b" />)}
          </div>
        );
      })} />
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun <A>ikki g'oya</A> bo'yicha intervyuni boshlaysiz.</>, ru: <>Сегодня вы начнёте интервью <A>по двум идеям</A>.</> })}
      mentor={<Mentor>{tr({ uz: 'RICE baholari hali taxmin. Endi ularni odamlarning o\'z voqeasi bilan tekshirasiz.', ru: 'Оценки RICE — пока предположение. Теперь вы проверите их историями самих людей.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida: 10 intervyu, 1-qism: ikki g'oya, bir xil savollar", ru: 'В конце урока: 10 интервью, часть 1: две идеи, одинаковые вопросы' })}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — IKKINCHI G'OYAGA SAVOLLAR (QTushuncha markaziy: 9-Modul tomonlari → savollar shablonga uchadi → «To'garakka moslash» — bo'lak almashadi) =====
const S2_SAVOLLAR = [
  { matn: { uz: "«Jamoa yig'adigan ilova bo'lsa, ishlatarmidingiz?»", ru: '«Если бы было приложение для сбора команды, вы бы им пользовались?»' }, tomon: 'bosh', javob: { uz: 'Ha, ishlatardim.', ru: 'Да, пользовался бы.' }, yorliq: { uz: "va'da", ru: 'обещание' }, xato: { uz: "Ilova hali yo'q — javobi va'da bo'ladi.", ru: 'Приложения ещё нет — ответ будет обещанием.' } },
  { matn: { uz: "«Oxirgi marta o'yinga odam yig'ganingiz qachon bo'ldi?»", ru: '«Когда вы в последний раз собирали людей на игру?»' }, tomon: 'voqea', qator: 'oxirgi' },
  { matn: { uz: "«Odam yig'ish qiyin, shundaymi?»", ru: '«Собирать людей трудно, да?»' }, tomon: 'bosh', javob: { uz: 'Ha, qiyin.', ru: 'Да, трудно.' }, yorliq: { uz: 'javob savolda', ru: 'ответ в вопросе' }, xato: { uz: "Javobni savolning o'zi aytib qo'ydi.", ru: 'Ответ подсказал сам вопрос.' } },
  { matn: { uz: "«O'shanda qanday qildingiz?»", ru: '«Как вы тогда поступили?»' }, tomon: 'voqea', qator: 'qanday' },
  { matn: { uz: "«Eng qiyini nima bo'ldi?»", ru: '«Что было самым трудным?»' }, tomon: 'voqea', qator: 'qiyin' }
];
const S2_VOQEA_XATO = { uz: "Bu savol bo'lib o'tgan kunni so'rayapti.", ru: 'Этот вопрос спрашивает о прошедшем дне.' };
const TOMON = [
  { id: 'voqea', t: { uz: "Bo'lib o'tgan ishni so'raydi", ru: 'Спрашивает о том, что было' }, nom: { uz: 'voqea savoli', ru: 'вопрос о событии' } },
  { id: 'bosh', t: { uz: "So'ramaydi", ru: 'Не спрашивает' }, nom: { uz: "bo'sh savol", ru: 'пустой вопрос' } }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const am = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [i, setI] = useState(avval ? 5 : 0);
  const [joy, setJoy] = useState(avval ? ['oxirgi', 'qanday', 'qiyin'] : []);
  const [tushdi, setTushdi] = useState(avval ? [0, 2] : []);
  const [yangiQ, setYangiQ] = useState(null);
  const [pufak, setPufak] = useState(null);
  const [ket, setKet] = useState(false);
  const [xato, setXato] = useState(null);
  const [moslandi, setMoslandi] = useState(avval);
  const almashdi = useKeyin(moslandi, 1100, avval);
  const xatoBor = useRef(false);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const taymer = useTaymer();
  const saralandi = i >= 5;
  const done = moslandi && almashdi;
  const tugadi = useTugadi(done, 2600, avval);
  const ipucha = useIpucha(!saralandi && !ket, i);
  useEffect(() => { if (yangiQ === null) return undefined; const t = setTimeout(() => setYangiQ(null), 1300); return () => clearTimeout(t); }, [yangiQ]);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, solved: true, birinchi: !xatoBor.current }); }, [done]); // eslint-disable-line
  const s = S2_SAVOLLAR[i];
  const tomonla = (tid) => {
    if (saralandi || ket || !s) return;
    if (tid !== s.tomon) {
      setXato({ i, tid, k: Date.now() });
      if (!xatoBor.current) { xatoBor.current = true; if (am) am.miss(screen); }
      return;
    }
    setXato(null);
    if (s.tomon === 'voqea') {
      uch(kartaRef.current, `s2r-${s.qator}`, 620);
      setJoy(j => [...j, s.qator]); setYangiQ(s.qator); setPufak(null); setI(i + 1);
    } else {
      const bu = i;
      setPufak({ javob: s.javob, yorliq: s.yorliq }); setKet(true);
      taymer(() => { setTushdi(t => [...t, bu]); setKet(false); setPufak(null); setI(bu + 1); }, kamHarakat() ? 300 : 1600);
    }
  };
  const moslash = () => {
    if (moslandi) return;
    ['oxirgi', 'qanday', 'qiyin'].forEach((q, n) => uch(document.querySelector(`.lesson-root [data-q="${q}-0"]`), `s2t-${q}`, 600, n * 150));
    setMoslandi(true);
  };
  const ustunlar = [
    { nom: MENTOR_GOYALAR2[0].nom, bolak: MENTOR_GOYALAR2[0].bolak },
    { nom: MENTOR_GOYALAR2[1].nom, bolak: almashdi ? MENTOR_GOYALAR2[1].bolak : MENTOR_GOYALAR2[0].bolak }
  ];
  const kat = (ui, q) => {
    if (q === 'kim') return {};
    if (ui === 0) return { uch: `s2r-${q}` };
    if (!moslandi) return { yoq: true };
    return {
      uch: `s2t-${q}`, yangi: !almashdi,
      ichi: q === 'oxirgi' ? <SavolT kalit="oxirgi" bolak={ustunlar[1].bolak} bolakKey={almashdi ? 'b2' : 'b1'} /> : undefined,
      tepada: q === 'oxirgi' && almashdi && <span className="io-kul io-bolak-y fade-step">{tr({ uz: "bo'lak — g'oyaga qarab almashadi", ru: 'часть — меняется по идее' })}</span>,
      osti: q !== 'oxirgi' && almashdi && <span className="io-ozg fade-step">✓ {tr({ uz: "o'zgarmadi", ru: 'не изменился' })}</span>
    };
  };
  const harakat = !tugadi && (
    <div className="io-s2h">
      {!saralandi && s && (
        <div className="io-s2-sahna">
          <div ref={kartaRef} key={`k${i}-${xato ? xato.k : 0}`} className={cxx('io-s2-karta', ket && 'tush', xato && xato.i === i && 'silk')}>
            <span className="io-s2-n">{i + 1} / 5</span>
            <span className="io-s2-m">{tr(s.matn)}</span>
          </div>
          <div className="io-s2-odam">
            <span className={cxx('io-pufak', !pufak && 'kut')}>{pufak ? tr(pufak.javob) : '…'}</span>
            {pufak && <span className="io-kul fade-step">{tr(pufak.yorliq)}</span>}
            <OdamSvg w={58} h={94} kiyim={1} teri={0} soch={0} />
            <span className="io-s2-rol">{tr({ uz: "o'yinchi", ru: 'игрок' })}</span>
          </div>
        </div>
      )}
      <div className={cxx('io-tomonlar', !saralandi && !ket && 'io-guruh', saralandi && 'tayyor')}>
        {TOMON.map(t => (
          <div key={t.id} className="io-tomon-u">
            {saralandi && <span className={cxx('io-tomon-nom', t.id, 'fade-step')}>{tr(t.nom)}</span>}
            <button type="button" className={cxx('io-tomon', t.id)} disabled={saralandi || ket} onClick={() => tomonla(t.id)}>{tr(t.t)}</button>
            {t.id === 'bosh' && tushdi.length > 0 && <div className="io-tushdi">{tushdi.map(k => <span key={k} className="io-tushdi-k"><span>{tr(S2_SAVOLLAR[k].matn)}</span><em>{tr(S2_SAVOLLAR[k].yorliq)}</em></span>)}</div>}
          </div>
        ))}
      </div>
      {xato && <QXato key={xato.k}>{tr(xato.tid === 'bosh' ? S2_VOQEA_XATO : S2_SAVOLLAR[xato.i].xato)}</QXato>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Takror · 9-Modul qoidasi', ru: 'Повтор · правило 9-го модуля' })} screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !saralandi ? `${tr({ uz: 'Savollarni joylang', ru: 'Разместите вопросы' })} (${i}/5)` : tr({ uz: "To'garakka moslang", ru: 'Приспособьте к кружкам' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Ikkinchi g'oyaga <A>qaysi savollarni</A> berasiz?</>, ru: <>Какие <A>вопросы</A> зададите по второй идее?</> })}
        mentor={<Mentor>{tr({ uz: "Jamoa yig'ish uchun beshta savol yozdim — har birini o'z tomoniga joylang.", ru: 'Я написал пять вопросов для сбора команды — поставьте каждый на свою сторону.' })}</Mentor>}
        harakat={harakat}
        vizual={<div className={cxx('io-s2v', tugadi && 'tinch')}>
          <IkkiShablon ustunlar={ustunlar} qatorlar={['kim', ...joy]} yangi={yangiQ ? { [yangiQ]: true } : {}} kat={kat} chiziq={almashdi} />
          {saralandi && !moslandi && <div className="io-amal fade-step"><QTugma className="io-halqa" onClick={moslash}>{tr({ uz: "To'garakka moslash", ru: 'Приспособить к кружкам' })}</QTugma></div>}
        </div>}
        natija={!saralandi && ipucha && <QIzoh>{tr({ uz: "Bu savolning javobida kun yoki qilingan ish bo'ladimi?", ru: 'Будет ли в ответе на этот вопрос день или сделанное дело?' })}</QIzoh>}
        xulosa={done && tr({ uz: "Savollar ikkala g'oyaga bir xil — shunda javoblarni qatorma-qator solishtirasiz.", ru: 'Вопросы для обеих идей одинаковые — так вы сравните ответы строка за строкой.' })}
      />
      <NishonQatori screen={screen} />
      <MentorNote>{tr({ uz: "Tomonlar 9-Modulning «Besh odamdan nimani bilib olasiz?» darsidan — qayta o'rgatmang, bir daqiqada eslating. Bugungi yangisi — o'ng ustun: savollar ikkinchi g'oyaga bitta bo'lak almashib o'tadi. Sinfdan so'rang: «To'garak g'oyasiga butunlay boshqa savollar bersak, javoblarni nima bilan solishtiramiz?»", ru: 'Стороны — из урока 9-го модуля «Что вы узнаете от пяти человек?» — не переучивайте, напомните за минуту. Новое сегодня — правая колонка: вопросы переходят ко второй идее, меняется одна часть. Спросите класс: «Если задать по идее кружков совсем другие вопросы, с чем сравнивать ответы?»' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s3 = 2; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · bir xil savollar', ru: 'Проверка · одинаковые вопросы' })}
    questionText="To'garak izlagan o'smirga birinchi savolingiz qaysi?"
    question={tr({ uz: <h2 className="title h-ask">To'garak izlagan o'smirga <A>birinchi savolingiz</A> qaysi?</h2>, ru: <h2 className="title h-ask">Какой ваш <A>первый вопрос</A> подростку, который искал кружок?</h2> })}
    options={[
      { uz: "«To'garaklar xaritasi bo'lsa, ochib ko'rarmidingiz?»", ru: '«Если бы была карта кружков, вы бы её открыли?»' },
      { uz: "«Oxirgi marta o'yinga odam yig'ganingiz qachon bo'ldi?»", ru: '«Когда вы в последний раз собирали людей на игру?»' },
      { uz: "«Oxirgi marta to'garak izlaganingiz qachon bo'ldi?»", ru: '«Когда вы в последний раз искали кружок?»' },
      { uz: "«To'garak topish ko'pincha qiyin bo'ladi, shundaymi?»", ru: '«Найти кружок часто трудно, да?»' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Savol o'tgan voqeani so'raydi, bo'lagi esa to'garakka almashgan.", ru: 'Вопрос спрашивает о прошедшем событии, а часть заменена на кружок.' }}
    explainWrong={{
      0: { uz: "Xarita hali yo'q — javobi va'da bo'ladi.", ru: 'Карты ещё нет — ответ будет обещанием.' },
      1: { uz: "Bo'lak jamoa yig'ish g'oyasidan qolib ketgan.", ru: 'Часть осталась от идеи сбора команды.' },
      3: { uz: "Javobni savolning o'zi aytib qo'ydi.", ru: 'Ответ подсказал сам вопрос.' },
      default: { uz: "Savol o'tgan ishni so'rasin, bo'lagi to'garakka mos bo'lsin.", ru: 'Пусть вопрос спрашивает о прошлом, а часть подходит к кружку.' }
    }}
    vizual={<IkkiShablon kichik ustunlar={MENTOR_GOYALAR2} qatorlar={['oxirgi']} chiziq />} />
);

// ===== SCREEN 4 — HOZIR NIMA BILAN (QTushuncha ketma-ket, 5 yozuv; SABOQ 9/13): telefon maketi chapda — javobga qarab almashadi · shablon o'ngda =====
// Telefon maketidagi chat xabarlari — namoyish (tayanch 9.57): «Futbol» guruhi — «Shanba o'yin. Kim keladi?», «+» lar, boshqa xabarlar · «Mahalla» guruhi — savol xabari
const TgBosh = ({ nom }) => <div className="io-tg-h"><Telegram /><span className="io-tg-g">{nom}</span></div>;
const Xabar = ({ men, kir, k, className, children }) => <div className={cxx('io-xb', men && 'men', kir && 'kir', className)} style={kir ? { '--k': `${k}s` } : undefined}>{children}</div>;
const Stiker = () => <svg className="io-stiker" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#F6C443" /><circle cx="14" cy="17" r="2.4" fill="#2A2730" /><circle cx="26" cy="17" r="2.4" fill="#2A2730" /><path d="M 12 24 Q 20 31 28 24" stroke="#2A2730" strokeWidth="2.2" fill="none" strokeLinecap="round" /></svg>;
const Ovoz = () => <span className="io-ovozx" aria-hidden="true"><i className="io-ovozx-p" />{[6, 11, 7, 13, 9, 5, 10, 7].map((h, i) => <b key={i} style={{ height: h }} />)}</span>;
const BOSHQA = [
  { id: 'stiker', men: false, node: <Stiker /> },
  { id: 'uy', men: false, node: { uz: 'uy vazifasi nima edi?', ru: 'что задали на дом?' } },
  { id: 'ovoz', men: false, node: <Ovoz /> }
];
const xabarT = (x) => (React.isValidElement(x.node) ? x.node : tr(x.node));
const KIM_KELADI = { uz: 'Kim keladi?', ru: 'Кто придёт?' };
const TanishlarSahna = ({ tinch }) => (
  <svg className={cxx('io-tan', tinch && 'tinch')} viewBox="0 0 160 230" role="img" aria-label={tr({ uz: 'ota-onaning tanishlari', ru: 'знакомые родителей' })}>
    <rect x="0" y="0" width="160" height="230" rx="14" fill={RANG.devor} />
    <rect x="0" y="196" width="160" height="34" fill={RANG.pol} />
    {[[122, 62], [128, 128], [118, 192]].map(([x, y], i) => <line key={`l${i}`} className="io-tan-l" style={{ '--i': i }} x1="52" y1="132" x2={x - 12} y2={y - 46} />)}
    <Odam x={42} y={198} s={1.1} kiyim={5} teri={1} soch={1} sochTur="uzun" qol="telefon" />
    {[[122, 62, 2, 0], [128, 128, 3, 2], [118, 192, 4, 1]].map(([x, y, kiyim, teri], i) => (
      <g key={`t${i}`} className="io-tan-o" style={{ '--i': i }}>
        <Odam x={x} y={y} s={0.56} kiyim={kiyim} teri={teri} soch={i % 3} sochTur={i === 1 ? 'uzun' : 'qisqa'} yuz={-1} />
        <g className="io-tan-s"><circle cx={x + 18} cy={y - 50} r="9" fill="#FFFFFF" stroke={RANG.yogoch} /><text x={x + 18} y={y - 46} textAnchor="middle">?</text></g>
      </g>
    ))}
  </svg>
);
// Telefon holatlari: tgChat (xabarlar oqimi, «+» lar yuqoriga suriladi) · qongiroq · tgUch · tanishlar · mahallaChat
const S4Ekran = ({ h, tinch }) => {
  if (h === 'tanishlar') return <TanishlarSahna tinch={tinch} />;
  if (h === 'royxat') return (
    <div className="io-tg">
      <div className="io-tg-h"><Telegram /></div>
      <div className="io-tg-list">{['Futbol', 'Mahalla'].map((n, i) => <span key={n} className="io-tg-chat" style={{ '--i': i }}><i className={cxx('io-tg-av', i ? 'b' : 'a')}>{n[0]}</i><b>{n}</b></span>)}</div>
    </div>
  );
  if (h === 'mahallaChat') return (
    <div className="io-tg">
      <TgBosh nom="Mahalla" />
      <div className="io-tg-b">
        <Xabar men>{tr({ uz: "Suzish to'garagi qayerda bor?", ru: 'Где есть кружок плавания?' })}</Xabar>
        <div className="io-tg-tanish">{[0, 1, 2].map(i => <span key={i} className="io-tg-tq" style={{ '--k': `${0.5 + i * 0.45}s` }}><OdamSvg w={30} h={48} kiyim={i + 2} teri={i % 3} soch={i % 3} /><i>?</i></span>)}</div>
      </div>
    </div>
  );
  const plus = (n) => Array.from({ length: n }).map((_, i) => <Xabar key={`p${i}`} className="plus">+</Xabar>);
  let ro;
  if (h === 'tgUch') ro = [<Xabar key="a" men>{tr(KIM_KELADI)}</Xabar>, ...BOSHQA.slice(0, 2).map((x, i) => <Xabar key={`b${i}`} kir k={0.4 + i * 0.5}>{xabarT(x)}</Xabar>),
    <Xabar key="c" men kir k={1.4}>{tr(KIM_KELADI)}</Xabar>, <Xabar key="d" kir k={1.9}>{xabarT(BOSHQA[2])}</Xabar>, <Xabar key="e" men kir k={2.4}>{tr(KIM_KELADI)}</Xabar>, <Xabar key="f" kir k={2.9}>{xabarT(BOSHQA[0])}</Xabar>];
  else if (tinch) ro = BOSHQA.map((x, i) => <Xabar key={i}>{xabarT(x)}</Xabar>);
  else ro = [<Xabar key="a" men>{tr({ uz: "Shanba o'yin. Kim keladi?", ru: 'Игра в субботу. Кто придёт?' })}</Xabar>, ...plus(3), ...(h === 'tgChat' ? BOSHQA.map((x, i) => <Xabar key={`b${i}`} kir k={0.9 + i * 0.8}>{xabarT(x)}</Xabar>) : [])];
  return (
    <div className="io-tg">
      <TgBosh nom="Futbol" />
      <div className="io-tg-b">{ro}</div>
      {!tinch && <div className="io-tg-k" aria-hidden="true"><i /><b /></div>}
      {h === 'qongiroq' && <div className="io-qong">
        <b className="io-qong-h">{tr({ uz: "Qo'ng'iroqlar", ru: 'Звонки' })}</b>
        {[0, 1, 2, 3].map(i => <span key={i} className="io-qong-q" style={{ '--i': i }}><i className="io-qong-av" /><span>{tr({ uz: "o'yinchi", ru: 'игрок' })}</span><em aria-hidden="true">→</em></span>)}
      </div>}
    </div>
  );
};
// 4-ekranda 2–4-savollar faqat qator nomi bilan (2-ekranda ko'rilgan; yakuniy holat 1280×800 ga sig'sin — SABOQ 25), yangi qator — savoli bilan
const S4_KAT = (ui, q) => (q === 'hozir' || q === 'kim' ? {} : { ichi: null });
const S4_HOLAT = ['tgChat', 'qongiroq', 'tgUch', 'tanishlar', 'mahallaChat'];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [n, setN] = useState(avval ? 5 : 0);
  const [qatorYangi, setQatorYangi] = useState(!avval);
  const [oxirgi, setOxirgi] = useState(null);
  const done = n >= 5;
  const tugadi = useTugadi(done, 3200, avval);
  useEffect(() => { if (!qatorYangi) return undefined; const t = setTimeout(() => setQatorYangi(false), 1500); return () => clearTimeout(t); }, [qatorYangi]);
  useEffect(() => { if (oxirgi === null) return undefined; const t = setTimeout(() => setOxirgi(null), 1300); return () => clearTimeout(t); }, [oxirgi]);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, solved: true }); }, [done]); // eslint-disable-line
  const ber = (k) => { if (k !== n) return; setN(n + 1); setOxirgi(k); };
  const holat = n > 0 ? S4_HOLAT[n - 1] : 'royxat';
  const yozuvlar = (ui) => (
    <div className="io-s4-y">
      <span className="io-joy-y">{tr({ uz: 'Yozuvlar', ru: 'Записи' })}</span>
      {MENTOR_YOZUVLAR.map((y, k) => (y.goya !== ui ? null : (
        <div key={k} className={cxx('io-s4-yk', k === n && !done && 'joriy', k < n && 'bor', oxirgi === k && 'yangi')}>
          <span className="io-yk-k">{tr(y.kim)}</span>
          {k < n && <span className="io-s4-hz"><em>{tr(SH.hozir.nom)}:</em> {tr(y.hozir)}</span>}
          {k === n && !done && <QTugma className="io-halqa" onClick={() => ber(k)}>{tr({ uz: 'Savolni berish', ru: 'Задать вопрос' })}</QTugma>}
        </div>
      )))}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · to'rtinchi savol", ru: 'Понятие · четвёртый вопрос' })} screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savolni bering', ru: 'Задайте вопрос' })} (${n}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Odamlar bu muammoni <A>hozir nima bilan</A> hal qilyapti?</>, ru: <>Чем люди <A>сейчас</A> решают эту проблему?</> })}
        mentor={<Mentor>{tr({ uz: "Birinchi beshta intervyuda shu savolni ham berdim — har odamga «Savolni berish»ni bosing.", ru: 'В первых пяти интервью я задал и этот вопрос — нажимайте «Задать вопрос» для каждого человека.' })}</Mentor>}
        vizual={<div className={cxx('io-s4', tugadi && 'tinch')}>
          {!tugadi
            ? <Telefon key={holat} className="io-s4-tel"><S4Ekran h={holat} /></Telefon>
            : <div className="io-s4-mini">
              <div className="io-mini"><S4Ekran h="tgChat" tinch /></div>
              <div className="io-mini tan"><TanishlarSahna tinch /></div>
            </div>}
          <IkkiShablon className="io-s4-sh" kichik ustunlar={MENTOR_GOYALAR2} qatorlar={['kim', 'oxirgi', 'qanday', 'qiyin', 'hozir']} yangi={{ hozir: qatorYangi }} kat={S4_KAT} chiziq ostida={[yozuvlar(0), yozuvlar(1)]} />
        </div>}
        xulosa={done && tr({ uz: "Bu savol odam muammoni hozir nima bilan hal qilayotganini ochadi — yangi yechimni shu bilan solishtirasiz.", ru: 'Этот вопрос открывает, чем человек решает проблему сейчас, — с этим вы сравните новое решение.' })}
      />
      <MentorNote>{tr({ uz: "Yozuvlarni sanamang va g'oyalarni solishtirmang — beshta yozuv xulosa uchun kam. Telefon maketidagi xabar matni — namoyish, yozuvning o'zi emas. To'garak yozuvlarida ota-ona ham bor: 9-Modulda «muammoning ikki tomoni bo'lsa, ikkalasidan ham so'rang» degan edik. Sinfdan so'rang: «Siz jamoani hozir nima bilan yig'asiz?» Hozirgi yo'l borligi muammo bor-yo'qligini ham, og'irligini ham o'zi aytmaydi — og'irligini «Eng qiyini» qatori ko'rsatadi.", ru: 'Не считайте записи и не сравнивайте идеи — пяти записей мало для вывода. Текст сообщений на макете телефона — демонстрация, а не сама запись. В записях о кружках есть и родители: в 9-м модуле мы говорили «если у проблемы две стороны — спросите обе». Спросите класс: «Чем вы сейчас собираете команду?» Наличие нынешнего способа само не говорит, есть ли проблема и насколько она тяжела, — тяжесть показывает строка «Самое трудное».' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s5 = 0; ikkinchi misol — Mentorning 4-g'oyasi, P-002) =====
// Iqtibos — savol ustida, suhbatdosh pufagida
const Iqtibos = ({ kim, children, osti, odam = {} }) => (
  <div className="io-iqt fade-up">
    <OdamSvg w={46} h={76} {...odam} />
    <div className="io-iqt-b"><span className="io-iqt-k">{kim}</span><span className="io-iqt-t">{children}</span>{osti && <span className="io-iqt-o">{osti}</span>}</div>
  </div>
);
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · to'rtinchi savol", ru: 'Проверка · четвёртый вопрос' })}
    questionText="Bu javobdan nimani bilib olasiz?"
    question={tr({
      uz: <><Iqtibos kim="O'quvchi:" odam={{ kiyim: 3, teri: 2, soch: 1, sochTur: 'uzun' }}>«Hozir uy vazifasini sinf chatidan qidiraman.»</Iqtibos><h2 className="title h-ask">Bu javobdan <A>nimani bilib olasiz?</A></h2></>,
      ru: <><Iqtibos kim="Ученик:" odam={{ kiyim: 3, teri: 2, soch: 1, sochTur: 'uzun' }}>«Сейчас ищу домашнее задание в чате класса.»</Iqtibos><h2 className="title h-ask">Что вы <A>узнаёте из этого ответа?</A></h2></>
    })}
    options={[
      { uz: 'Yangi yechim sinf chati bilan solishtiriladi', ru: 'Новое решение сравнивают с чатом класса' },
      { uz: "Uy vazifasi bo'yicha unda hech muammo yo'q ekan", ru: 'С домашним заданием у него проблем нет' },
      { uz: 'Vazifalar ilovasi chiqsa, uni ishlatib ko\'radi', ru: 'Если выйдет приложение заданий, он его попробует' },
      { uz: 'Yangi ilovani sinf chatiga o\'xshatib qurasiz', ru: 'Новое приложение вы построите похожим на чат класса' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Odam muammoni hozir sinf chati bilan hal qilyapti — yangi yechim shu bilan solishtiriladi.', ru: 'Человек сейчас решает проблему чатом класса — с ним и сравнивают новое решение.' }}
    explainWrong={{
      1: { uz: 'Chatdan qidirish ham mehnat — muammo yo\'q demadi.', ru: 'Искать в чате — тоже труд: он не говорил, что проблемы нет.' },
      2: { uz: 'U ilova haqida gapirmadi — bu sizning taxminingiz.', ru: 'Он не говорил о приложении — это ваше предположение.' },
      3: { uz: 'Javob hozirgi ishini aytdi, ilova qanday bo\'lishini emas.', ru: 'Ответ сказал, что он делает сейчас, а не каким быть приложению.' },
      default: { uz: 'U hozir nima bilan hal qilyapti — shuni toping.', ru: 'Чем он решает это сейчас — найдите это.' }
    }}
    vizual={<div className="io-s5v"><span className="io-s5v-k">{tr({ uz: "o'quvchi", ru: 'ученик' })}</span><span className="io-s5v-q"><span className="io-sh-l">{tr(SH.hozir.nom)}</span><b>{tr({ uz: 'sinf chati', ru: 'чат класса' })}</b></span></div>} />
);

// ===== SCREEN 6 — HARAKAT BELGISI (QTushuncha ketma-ket, 5 yozuv; atama — misoldan keyin): telefon «Sinov kunlari» chapda · joriy yozuv kartasi o'ngda =====
// «Sinov kunlari» — Mentor telefonidagi namoyish (tayanch 9.59): 1 — Shanba · 2 — Yakshanba · 3 — Shanba · 7 — Yakshanba; 6 — kun belgilanmadi
const S6_TAXMIN = [
  { k: 'maqtov', t: { uz: "G'oyani maqtaydi", ru: 'Хвалит идею' } },
  { k: 'ishlatardim', t: { uz: '«Ishlatardim» deydi', ru: 'Говорит «пользовался бы»' } },
  { k: 'kun', ok: true, t: { uz: "Sinab ko'rishga kun belgilaydi", ru: 'Назначает день, чтобы попробовать' } }
];
// Natijada 2–5-savollar qator nomi bilan (oldingi ekranlarda ko'rilgan), yangi oltinchi qator — savoli bilan: yakuniy holat 1280×800 ga sig'adi (SABOQ 25)
const S6_KAT = (ui, q) => (q === 'belgi' || q === 'kim' ? {} : { ichi: null });
const S6_SAVOL = { uz: "Qaysi javob qiziqishni eng aniq ko'rsatadi?", ru: 'Какой ответ точнее всего показывает интерес?' };
const KUNLAR = [{ k: 'shanba', t: { uz: 'Shanba', ru: 'Суббота' } }, { k: 'yakshanba', t: { uz: 'Yakshanba', ru: 'Воскресенье' } }, { k: 'dushanba', t: { uz: 'Dushanba', ru: 'Понедельник' } }];
const TAXMIN_L = { uz: 'Taxminingiz', ru: 'Ваше предположение' };
const TaxminQator = ({ tx, haqiqat }) => (
  <span className={cxx('io-tx', tx.ok && 'ok')}>{tx.ok
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr(TAXMIN_L)}: {tr(tx.t).toLowerCase()} <b className="yoq">✕</b> · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</span>
);
const SinovKunlari = ({ belgilar, joriy }) => (
  <div className="io-sk">
    <div className="io-sk-h"><b>{tr({ uz: 'Sinov kunlari', ru: 'Дни проверки' })}</b></div>
    <div className="io-sk-ro">
      {KUNLAR.map(d => {
        const bu = belgilar.filter(b => b.kun === d.k);
        return (
          <div key={d.k} className="io-sk-q">
            <span className="io-sk-k">{tr(d.t)}</span>
            <div className="io-sk-j">
              {[0, 1].map(i => (bu[i]
                ? <span key={i} className={cxx('io-sk-m', bu[i].yangi && 'tush')}>{tr(bu[i].kim)}</span>
                : <span key={i} className="io-sk-b" />))}
            </div>
          </div>
        );
      })}
    </div>
    {joriy && <span className={cxx('io-sk-hol', joriy === 'ha' ? 'ok' : 'yoq')} key={joriy}>{joriy === 'ha' ? tr({ uz: 'Belgilandi ✓', ru: 'Назначено ✓' }) : tr({ uz: 'Kun belgilanmadi', ru: 'День не назначен' })}</span>}
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [k, setK] = useState(avval ? 5 : 0);
  const [sorov, setSorov] = useState(false);
  const [ochiq, setOchiq] = useState(null);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const taymer = useTaymer();
  const done = k >= 5;
  const tugadi = useTugadi(done, 2200, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, solved: true, taxmin }); }, [done]); // eslint-disable-line
  const y = MENTOR_YOZUVLAR[k];
  const ber = () => {
    if (!taxmin || sorov || done) return;
    const bu = k;
    setSorov(true);
    taymer(() => { uch(kartaRef.current, `s6j-${bu}`, 640); setSorov(false); setK(bu + 1); }, kamHarakat() ? 400 : 2300);
  };
  const belgilar = MENTOR_YOZUVLAR.map((r, i) => ({ ...r, yangi: i === k && sorov })).filter((r, i) => r.kun && (i < k || (i === k && sorov)));
  const tx = S6_TAXMIN.find(t => t.k === taxmin);
  const ustunJoy = (ui, toliq) => {
    const ro = MENTOR_YOZUVLAR.map((r, i) => ({ ...r, id: i, uch: `s6j-${i}` })).filter((r, i) => r.goya === ui && i < k);
    return <Joylar yozuvlar={ro} onOch={toliq ? setOchiq : undefined} ochiq={ochiq} teg={done && <span className="io-tag fade-step">{tr({ uz: 'harakat belgisi', ru: 'знак действия' })}</span>} />;
  };
  const karta = !done && y && (
    <div className="io-s6-k" key={`y${k}`} ref={kartaRef}>
      <YozuvKarta katta y={y} className="io-kir" qatorlar={['kim', 'oxirgi', 'qanday', 'qiyin', 'hozir', 'belgi']}
        ichi={{ belgi: sorov
          ? <span className="io-s6-b fade-step"><i className="io-sv">{tr(SH.belgi.savol)}</i><BelgiT b={y.belgi} /></span>
          : <QTugma className={halqa(!!taxmin)} disabled={!taxmin} onClick={ber}>{tr({ uz: 'Oxirgi savolni berish', ru: 'Задать последний вопрос' })}</QTugma> }} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · so'z va ish", ru: 'Понятие · слово и дело' })} screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Yozuvlarni yakunlang', ru: 'Завершите записи' })} (${k}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Odam rostdan <A>qiziqqanini</A> qanday bilasiz?</>, ru: <>Как узнать, что человек <A>действительно заинтересован</A>?</> })}
        mentor={<Mentor>{tr({ uz: "Oxirgi savolni muammo haqidagi savollardan keyin berdim — beshta yozuvni birma-bir yakunlang.", ru: 'Последний вопрос я задал после вопросов о проблеме — завершите пять записей по одной.' })}</Mentor>}
        vizual={<div className={cxx('io-s6', done && 'tayyor', tugadi && 'tinch')}>
          {!tugadi && <Telefon className="io-s6-tel"><SinovKunlari belgilar={belgilar} joriy={sorov ? y.belgi : null} /></Telefon>}
          <div className="io-s6-o">
            {/* Bashorat o'ng ustunda, kartadan oldin (telefon chapda — ekran 1280×800 ga sig'adi) */}
            {!taxmin
              ? <div className="io-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S6_SAVOL)} variantlar={S6_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
              : !done && <div className="io-bashq fade-step"><span>{tr(S6_SAVOL)}</span><span className="io-bashq-t">{tr(TAXMIN_L)}: <b>{tr(tx.t)}</b></span></div>}
            {karta}
            {!done
              ? taxmin && <div className="io-s6-ust fade-step">{MENTOR_GOYALAR2.map((g, ui) => <div key={ui} className="io-s6-u"><b className="io-sh-nom">{tr(g.nom)}</b>{ustunJoy(ui, false)}</div>)}</div>
              : <IkkiShablon kichik ustunlar={MENTOR_GOYALAR2} qatorlar={['kim', 'oxirgi', 'qanday', 'qiyin', 'hozir', 'belgi']} yangi={{ belgi: !tugadi }} kat={S6_KAT} chiziq ostida={[ustunJoy(0, true), ustunJoy(1, true)]} />}
          </div>
        </div>}
        xulosa={done && <>{tx && <TaxminQator tx={tx} haqiqat={{ uz: "sinab ko'rishga kun belgilaydi", ru: 'назначает день, чтобы попробовать' }} />}{tr({ uz: "Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish — harakat belgisi.", ru: 'Интерес, который человек в конце интервью показал не словом, а делом, — знак действия.' })}</>}
      />
      <MentorNote>{tr({ uz: "Belgilarni sanamang va g'oyalarni solishtirmang. Nega oxirida: g'oyani boshida aytsangiz, keyingi javoblar maqtovga aylanadi (9-Modul qoidasi). Vaqt so'rash — taklif, majburlash emas: «yo'q» ham javob. «Yo'q» — shu yozuvdagi belgi: odam qiziqmaydi yoki g'oya yomon degani emas. Sinfdan so'rang: «Do'stingiz g'oyangizni maqtadi — bu harakat belgisimi?»", ru: 'Не считайте знаки и не сравнивайте идеи. Почему в конце: если назвать идею в начале, следующие ответы превратятся в похвалу (правило 9-го модуля). Просить время — предложение, а не принуждение: «нет» — тоже ответ. «Нет» — знак этой записи, а не то, что человек не заинтересован или идея плохая. Спросите класс: «Друг похвалил вашу идею — это знак действия?»' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 7 — AIRBNB (QVoqea, PM keys K4 — bank matni, raqamsiz; nom o'z rangida, logotipsiz; bosqich gapi Mentorda) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K4 · tayanch 5. «bandlovni o'ldirayotgan» → «band qilinishiga xalaqit berayotgan» (ibora yumshoq, ma'no o'sha);
// «O'sish to'xtaganda» → «Saytga yangi odamlar qo'shilmay qolganda» (KORPUS §138 B). Bankda yo'q natija (band qilish ko'paydi, surat saytga qo'yildi) chizilmaydi (9.58).
const AIRBNB_BOSQICH = [
  { h: { uz: 'San-Fransisko · 2007', ru: 'Сан-Франциско · 2007' }, m: { uz: "2007-yilda San-Fransiskoda katta konferensiya bo'lib, mehmonxonalar to'lgan. Asoschilar o'z uyida uchta havo to'shagini ijaraga bergan.", ru: 'В 2007 году в Сан-Франциско прошла большая конференция, и гостиницы были заполнены. Основатели сдали у себя дома три надувных матраса.' } },
  { h: { uz: 'Nyu-York', ru: 'Нью-Йорк' }, m: { uz: "Saytga yangi odamlar qo'shilmay qolganda, asoschilar Nyu-Yorkka borgan. Kvartiralarni o'zlari aylanib, suratga olgan.", ru: 'Когда новые люди перестали приходить на сайт, основатели поехали в Нью-Йорк. Сами обошли квартиры и сфотографировали их.' } },
  { h: { uz: 'Yomon suratlar', ru: 'Плохие фото' }, m: { uz: "Shunda ular yomon suratlar uylar band qilinishiga xalaqit berayotganini bilgan. Buni saytga qarab emas, kvartiralarga borib ko'rishgan.", ru: 'Тогда они узнали, что плохие фото мешают бронировать жильё. Они увидели это не глядя на сайт, а придя в квартиры.' } }
];
const AB_TAXMIN = [
  { k: 'sayt', t: { uz: 'Saytni qaytadan chizgan', ru: 'Перерисовали сайт' } },
  { k: 'xat', t: { uz: 'Uy egalariga xat yozgan', ru: 'Написали хозяевам жилья' } },
  { k: 'borgan', ok: true, t: { uz: "Kvartiralarga o'zlari borgan", ru: 'Сами поехали в квартиры' } }
];
const AB_SAVOL = { uz: "Saytga yangi odamlar qo'shilmay qolganda, asoschilar nima qilgan?", ru: 'Что сделали основатели, когда новые люди перестали приходить на сайт?' };
const HavoToshak = ({ x, y, i }) => (
  <g className="ab-tosh" style={{ '--i': i }}>
    <rect x={x} y={y} width="70" height="16" rx="7" fill="#BFD8EE" stroke="#8DB3D6" strokeWidth="1.2" />
    {[16, 32, 48].map(d => <line key={d} x1={x + d + 3} y1={y + 3} x2={x + d + 3} y2={y + 13} stroke="#8DB3D6" strokeWidth="1" />)}
    <rect x={x + 4} y={y - 6} width="18" height="9" rx="4" fill="#FFFFFF" stroke="#C9D7E6" />
  </g>
);
const Eloon = ({ x, y, w = 150, h = 120, nom, xira = true }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="8" fill="#FFFFFF" stroke="#E2DED6" strokeWidth="1.2" />
    <rect x={x + 8} y={y + 8} width={w - 16} height={h - 46} rx="5" fill={xira ? '#4A4458' : '#F3E3C4'} />
    <g opacity={xira ? 0.35 : 1}>
      <rect x={x + 22} y={y + h - 72} width={w - 80} height="22" rx="4" fill={xira ? '#8C8496' : '#C9734A'} />
      <rect x={x + w - 54} y={y + 16} width="28" height="24" rx="2" fill={xira ? '#6F6880' : '#FFFFFF'} stroke={xira ? 'none' : '#D8C2A2'} />
    </g>
    <text className="ab-eloon-t" x={x + 10} y={y + h - 16}>{nom}</text>
  </g>
);
// Sahna (chizilgan SVG, bosqichga qarab o'zgaradi; odamlar real ko'rinishda — SABOQ 36; bankda yo'q narsa chizilmaydi — asoschi surati, son, natija yo'q)
const AirbnbSahna = ({ b, kichik }) => (
  <svg className={cxx('io-ab', `b${b}`, kichik && 'kichik')} viewBox="0 0 560 210" role="img" aria-label={tr(AIRBNB_BOSQICH[b].h)} key={b}>
    {b === 0 && <g>
      <rect x="0" y="0" width="560" height="210" fill="#EAF3F8" />
      <rect x="0" y="182" width="250" height="28" fill="#D8CFC3" />
      <rect x="30" y="30" width="150" height="152" rx="3" fill="#E9D6BE" />
      {[0, 1, 2].map(r => [0, 1, 2, 3].map(c => <rect key={`${r}${c}`} x={42 + c * 34} y={42 + r * 30} width="22" height="18" rx="2" fill="#FFE9B8" />))}
      <rect x="86" y="134" width="38" height="48" rx="3" fill={RANG.yogochQ} />
      <g className="ab-joyyoq"><rect x="66" y="112" width="78" height="18" rx="4" fill="#FFFFFF" stroke="#C2362B" strokeWidth="1.5" /><text x="105" y="125" textAnchor="middle" className="ab-yoq-t">{tr({ uz: "Joy yo'q", ru: 'Мест нет' })}</text></g>
      <Odam x={208} y={184} s={0.8} kiyim={2} teri={2} soch={1} qol="sumka" yuz={-1} />
      <rect x="260" y="20" width="290" height="170" rx="6" fill={RANG.devor} stroke="#D8C2A2" strokeWidth="1.5" />
      <rect x="260" y="160" width="290" height="30" fill={RANG.pol} />
      <rect x="292" y="40" width="64" height="48" rx="3" fill="#CFE4F5" stroke="#D8C2A2" />
      <line x1="324" y1="40" x2="324" y2="88" stroke="#D8C2A2" />
      {[[282, 150, 0], [362, 150, 1], [442, 150, 2]].map(([x, y, i]) => <HavoToshak key={i} x={x} y={y} i={i} />)}
      <g className="ab-mehmon"><Odam x={470} y={190} s={0.82} kiyim={1} teri={0} soch={0} qol="sumka" yuz={-1} /><Odam x={516} y={190} s={0.82} kiyim={4} teri={1} soch={2} sochTur="uzun" qol="sumka" yuz={-1} /></g>
    </g>}
    {b === 1 && <g>
      <rect x="0" y="0" width="560" height="210" fill="#E6EEF6" />
      {[[0, 40, 46], [50, 14, 40], [94, 56, 52], [150, 24, 44], [198, 46, 40]].map(([x, y, w], i) => (
        <g key={i}><rect x={x} y={y} width={w} height={182 - y} fill={['#B8C6D8', '#A9B9CE', '#C4D0DE', '#AEBDD1', '#BCC9DA'][i]} />
          {Array.from({ length: Math.floor((150 - y) / 22) }).map((_, r) => <rect key={r} x={x + 8} y={y + 12 + r * 22} width={w - 16} height="9" rx="1" fill="#E9F0F8" opacity="0.8" />)}</g>
      ))}
      <rect x="0" y="182" width="250" height="28" fill="#CFC8BE" />
      {[40, 120, 200].map(x => <rect key={x} x={x} y="146" width="22" height="36" rx="2" fill={RANG.yogochQ} />)}
      <g className="ab-yur"><Odam x={60} y={196} s={0.78} kiyim={0} teri={0} soch={0} qol="kamera" /><Odam x={30} y={196} s={0.78} kiyim={3} teri={2} soch={1} /></g>
      <rect x="270" y="16" width="280" height="178" rx="6" fill={RANG.devor} stroke="#D8C2A2" strokeWidth="1.5" />
      <rect x="270" y="160" width="280" height="34" fill={RANG.pol} />
      <rect x="300" y="36" width="80" height="62" rx="3" fill="#CFE4F5" stroke="#D8C2A2" /><line x1="340" y1="36" x2="340" y2="98" stroke="#D8C2A2" /><line x1="300" y1="67" x2="380" y2="67" stroke="#D8C2A2" />
      <rect x="400" y="118" width="120" height="30" rx="10" fill="#9E7BB5" /><rect x="394" y="140" width="132" height="26" rx="9" fill="#B08FC5" />
      <Odam x={330} y={192} s={0.82} kiyim={0} teri={0} soch={0} qol="kamera" />
      <circle className="ab-chaqnash" cx="355" cy="140" r="26" fill="#FFFFFF" />
    </g>}
    {b === 2 && <g>
      <rect x="0" y="0" width="560" height="210" fill="#F4F1EC" />
      <rect x="12" y="10" width="380" height="190" rx="10" fill="#FFFFFF" stroke="#DCD6CC" strokeWidth="1.5" />
      <rect x="12" y="10" width="380" height="28" rx="10" fill="#EFEBE4" />
      {[30, 44, 58].map(x => <circle key={x} cx={x} cy="24" r="4" fill="#D2CABF" />)}
      <rect x="76" y="16" width="200" height="16" rx="8" fill="#FFFFFF" /><text x="88" y="28" className="ab-manzil">airbnb.com</text>
      <text x="28" y="60" className="ab-nom">Airbnb</text>
      <Eloon x={28} y={70} nom={tr({ uz: 'Nyu-York · kvartira', ru: 'Нью-Йорк · квартира' })} />
      <Eloon x={198} y={70} nom={tr({ uz: 'Nyu-York · xona', ru: 'Нью-Йорк · комната' })} />
      <g className="ab-xira"><rect x="40" y="80" width="88" height="18" rx="9" fill="#FFFFFF" opacity="0.92" /><text x="84" y="93" textAnchor="middle" className="ab-xira-t">{tr({ uz: 'suratlar xira', ru: 'фото тусклые' })}</text></g>
      <g className="ab-kadr"><rect x="410" y="44" width="136" height="118" rx="4" fill="#FFFFFF" stroke="#D8C2A2" strokeWidth="1.5" transform="rotate(3 478 103)" />
        <g transform="rotate(3 478 103)"><rect x="418" y="52" width="120" height="86" rx="2" fill="#FBEFD9" /><rect x="432" y="58" width="40" height="32" rx="2" fill="#CFE4F5" stroke="#E2C9A6" /><rect x="440" y="104" width="84" height="24" rx="8" fill="#C9734A" /><rect x="436" y="120" width="92" height="16" rx="6" fill="#D88A5E" /></g></g>
      <g className="ab-kamera"><rect x="452" y="166" width="40" height="26" rx="5" fill="#2F3142" /><circle cx="472" cy="179" r="8" fill="#8FB3D9" /><rect x="458" y="161" width="12" height="6" rx="2" fill="#2F3142" /><circle className="ab-chaqnash" cx="472" cy="170" r="22" fill="#FFFFFF" /></g>
    </g>}
  </svg>
);
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 2;
  const xulosaVaqt = useKeyin(done, 1800, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bq = AIRBNB_BOSQICH[b];
  const kutish = b === 0 && !taxmin;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const tx = AB_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Airbnb /> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || (done && !xulosaVaqt)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Airbnb /> asoschilari muammoni <A>qayerda bilgan?</A></>, ru: <>Где основатели <Airbnb /> <A>узнали о проблеме?</A></> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="io-nuq"><span className="io-nuq-l">{yorliq}</span>{AIRBNB_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}{kutish && <span className="io-nuq-k">{tr({ uz: 'Avval shu bosqichni tugating', ru: 'Сначала завершите этот этап' })}</span>}</div>
        </>}
        karta={<div className="io-voqea">
          {b === 0 && <p className="io-ab-tanish"><Airbnb /> — {tr({ uz: "begona odamning uyida ijaraga turish xizmati.", ru: 'сервис, где можно снять жильё у незнакомого человека.' })}</p>}
          <span className="io-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><AirbnbSahna b={b} /></Zoomable>
          {kutish && <div className="io-bash"><QBashorat yorliq={yorliq} savol={tr(AB_SAVOL)} variantlar={AB_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          {taxmin && !(done && xulosaVaqt) && <div className="io-bashq fade-step"><span>{tr(AB_SAVOL)}</span><span className="io-bashq-t">{tr(TAXMIN_L)}: <b>{tr(tx.t)}</b></span></div>}
          {done && xulosaVaqt && <QXulosa>{tx && <TaxminQator tx={tx} haqiqat={{ uz: "kvartiralarga o'zlari borgan", ru: 'сами поехали в квартиры' }} />}{tr({ uz: "Airbnb asoschilari muammoni saytga qarab emas, kvartiralarga o'zlari borib bilgan.", ru: 'Основатели Airbnb узнали о проблеме не глядя на сайт, а сами придя в квартиры.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Airbnb 7-Modulda («Botingizni ishlatgan odamdan nimani so'raysiz?») ham bo'lgan — bugungi savol boshqa: muammoni qayerda bilgan. Ko'prik og'zaki: intervyu ham shunday — odamning oldiga borib, uning voqeasini o'zingiz eshitasiz. Bankdan tashqari son va natija qo'shmang («band qilishlar ko'paydi» — bankda yo'q).", ru: 'Airbnb был и в 7-м модуле («Что спросить у человека, который пользовался вашим ботом?») — сегодня вопрос другой: где узнали о проблеме. Мостик устно: интервью — то же самое: вы приходите к человеку и сами слышите его историю. Не добавляйте чисел и результатов вне банка («бронирований стало больше» — в банке нет).' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s8 = 3; Airbnb qoidasi — to'garak olamida) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Airbnb'dagidek", ru: 'Проверка · как в Airbnb' })}
    questionText="Airbnb asoschilaridek, to'garak muammosini qanday bilasiz?"
    question={tr({ uz: <h2 className="title h-ask"><Airbnb /> asoschilaridek, to'garak muammosini <A>qanday bilasiz?</A></h2>, ru: <h2 className="title h-ask">Как вы, подобно основателям <Airbnb />, <A>узнаете проблему кружков?</A></h2> })}
    options={[
      { uz: "Internetda to'garaklar haqidagi sharhlarni o'qiysiz", ru: 'Прочитаете в интернете отзывы о кружках' },
      { uz: "Sinf chatiga «to'garak kerakmi?» deb yozib so'raysiz", ru: 'Спросите в чате класса «нужен ли кружок?»' },
      { uz: "To'garaklar xaritasini chizib, do'stga ko'rsatasiz", ru: 'Нарисуете карту кружков и покажете другу' },
      { uz: "To'garak izlagan odamning o'zi bilan gaplashasiz", ru: 'Поговорите с самим человеком, который искал кружок' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Asoschilar kvartiralarga o'zlari borib ko'rgan; siz odamning oldiga borib, voqeasini o'zingiz eshitasiz.", ru: 'Основатели сами пришли в квартиры; вы приходите к человеку и сами слышите его историю.' }}
    explainWrong={{
      0: { uz: "Sharhni boshqalar yozgan — odamni o'zingiz ko'rmadingiz.", ru: 'Отзывы писали другие — вы сами человека не видели.' },
      1: { uz: "Bu savolga va'da yoki baho keladi, voqea emas.", ru: 'На такой вопрос приходит обещание или оценка, а не история.' },
      2: { uz: "Xaritani ko'rsatsangiz, g'oyangizga baho eshitasiz.", ru: 'Покажете карту — услышите оценку вашей идеи.' },
      default: { uz: 'Asoschilar muammoni qayerda bilganini eslang.', ru: 'Вспомните, где основатели узнали о проблеме.' }
    }}
    vizual={<div className="io-s8v"><AirbnbSahna b={2} kichik /></div>} />
);

// ===== SCREEN 9 — IKKI G'OYANGIZGA SHABLON (QMustaqil, USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29) · artefakt pm-m9d3-intervyu · nishon twoIdeas =====
const KENG_KIM = ['hamma', 'odamlar', 'har kim', 'hamma odamlar', 'barcha odamlar', 'barcha'];
const KELAJAK_RE = /(bo'lsa|armidingiz|ardingiz|kelasi|keyingi)/;
const GOYA_SOZ_RE = /(^|\s)(ilova|sayt|bot|g'oya)/;
const S9_XATO = {
  keng: { uz: '"Hamma" — juda keng. Aynan kim duch keladi?', ru: '«Все» — слишком широко. Кто именно сталкивается?' },
  kelajak: { uz: "Bu ish hali bo'lmagan — o'tgan kunni so'rang.", ru: 'Этого ещё не было — спросите о прошедшем дне.' },
  goya: { uz: "Savolda g'oyangiz bor — odamning o'zi haqida so'rang.", ru: 'В вопросе ваша идея — спросите о самом человеке.' },
  bosh: { uz: "Bo'lakni yozing: odam nima qilganda qiynalgan?", ru: 'Напишите часть: что человек делал, когда ему было трудно?' }
};
const tekshirS9 = (g) => {
  const k = normYoz(g.kim), b = normYoz(g.bolak);
  if (KENG_KIM.includes(k)) return { k: 'kim', x: S9_XATO.keng };
  if (!b) return { k: 'bolak', x: S9_XATO.bosh };
  if (KELAJAK_RE.test(b)) return { k: 'bolak', x: S9_XATO.kelajak };
  if (GOYA_SOZ_RE.test(b)) return { k: 'bolak', x: S9_XATO.goya };
  return null;
};
const S9_QADAM = [{ uz: "1-g'oya", ru: '1-я идея' }, { uz: "2-g'oya", ru: '2-я идея' }, { uz: 'Qolgan savollar', ru: 'Остальные вопросы' }];
const QOLGAN = ['qanday', 'qiyin', 'hozir', 'belgi'];
const YORDAM_T = { uz: 'Yordam', ru: 'Подсказка' };
const goyaNom = (g, i) => (g && g.matn && g.matn.trim() ? qisqa(g.matn, 36) : { uz: `${i + 1}-g'oya`, ru: `${i + 1}-я идея` });
const saqlaShablon = (gs, toliq) => {
  const old = lsGet(INTERVYU_KEY) || {};
  lsSet(INTERVYU_KEY, { goyalar: gs.map(g => ({ matn: String(g.matn || '').trim(), kim: String(g.kim || '').trim(), bolak: String(g.bolak || '').trim() })), savollar: toliq ? SAVOLLAR_UZ : (Array.isArray(old.savollar) ? old.savollar : []), yozuvlar: Array.isArray(old.yozuvlar) ? old.yozuvlar : [], savedAt: Date.now() });
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [manba] = useState(ikkiGoyaLs);
  const [saqlangan] = useState(intervyuLs);
  const boshG = (i) => (saqlangan ? { ...saqlangan.goyalar[i] } : { matn: manba ? manba[i].matn : '', kim: manba ? manba[i].kim : '', bolak: '' });
  const [goyalar, setGoyalar] = useState(() => [boshG(0), boshG(1)]);
  const [yozildi, setYozildi] = useState(() => (saqlangan ? [true, true] : [false, false]));
  const [qolgan, setQolgan] = useState(() => !!(saqlangan && Array.isArray(saqlangan.savollar) && saqlangan.savollar.length === 5));
  const [tahrir, setTahrir] = useState(null);
  const [xato, setXato] = useState(null);
  const [okQ, setOkQ] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [qoshildi, setQoshildi] = useState(false);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const qadam = tahrir !== null ? tahrir : !yozildi[0] ? 0 : !yozildi[1] ? 1 : !qolgan ? 2 : 3;
  const done = qadam === 3;
  const [qor, setQor] = useState(() => boshG(0));
  useEffect(() => { if (qadam < 2) setQor({ ...goyalar[qadam] }); setXato(null); setYordam(false); }, [qadam]); // eslint-disable-line
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => { if (!qoshildi) return undefined; const t = setTimeout(() => setQoshildi(false), 1400); return () => clearTimeout(t); }, [qoshildi]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'shablon', correct: true, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'shablon', 0, true, 0);
  }, [done]); // eslint-disable-line
  const matnKerak = !manba && !saqlangan;
  const tayyor = !!(qor.kim.trim() && qor.bolak.trim() && (!matnKerak || qor.matn.trim()));
  const ozgar = (k, v) => { setQor(o => ({ ...o, [k]: v })); if (xato && xato.k === k) setXato(null); setOkQ(false); };
  const yoz = () => {
    const i = qadam;
    if (i > 1 || !qor.kim.trim() || (matnKerak && !qor.matn.trim())) return;
    const t = tekshirS9(qor);
    if (t) { setXato({ ...t, kk: Date.now() }); setOkQ(false); return; }
    setXato(null);
    const gs = goyalar.map((g, j) => (j === i ? { ...qor } : g));
    uch(kartaRef.current, `s9h-${i}`, 620);
    setGoyalar(gs); setYozildi(y => y.map((v, j) => (j === i ? true : v))); setYangi(i); setOkQ(true);
    saqlaShablon(gs, qolgan);
    if (tahrir !== null) setTahrir(null);
  };
  const qosh = () => {
    const r = kartaRef.current && kartaRef.current.getBoundingClientRect();
    QOLGAN.forEach((q, n) => { uch(r, `s9q-${q}-0`, 620, n * 80); uch(r, `s9q-${q}-1`, 620, n * 80); });
    setQolgan(true); setQoshildi(true); setOkQ(false);
    saqlaShablon(goyalar, true);
  };
  const ustunlar = goyalar.map((g, i) => ({ nom: goyaNom(g, i), bolak: g.bolak, kimdan: g.kim }));
  const kat = (ui, q) => {
    if ((q === 'kimdan' || q === 'oxirgi') && !yozildi[ui]) return { yoq: true };
    const o = { uch: q === 'kimdan' ? `s9h-${ui}` : q === 'oxirgi' ? undefined : `s9q-${q}-${ui}` };
    if (done && !isMentor && (q === 'kimdan' || q === 'oxirgi')) o.qalam = () => setTahrir(ui);
    if (q === 'kimdan' || q === 'oxirgi') o.yangi = yangi === ui;
    else o.yangi = qoshildi;
    return o;
  };
  const kirishQ = manba
    ? tr({ uz: `2-darsda tanlangan ikki g'oyangiz: «${qisqa(manba[0].matn, 60)}» va «${qisqa(manba[1].matn, 60)}».`, ru: `Две идеи, выбранные на 2-м уроке: «${qisqa(manba[0].matn, 60)}» и «${qisqa(manba[1].matn, 60)}».` })
    : !saqlangan && tr({ uz: "Ikki g'oyangizning muammosini yozing — har biriga bitta qator.", ru: 'Напишите проблему каждой из двух идей — по одной строке.' });
  const bolakInp = <input className={cxx('io-inp', 'bolak', !qor.bolak.trim() && qor.kim.trim() && 'io-halqa-i')} value={qor.bolak} placeholder={tr({ uz: "masalan: to'garak izlaganingiz", ru: 'например: искали кружок' })} aria-label={tr({ uz: "Bo'lak", ru: 'Часть' })} onChange={(e) => ozgar('bolak', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') yoz(); }} />;
  const karta = qadam < 2 ? (
    <div className="io-s9k io-kir" key={`k${qadam}`} ref={kartaRef}>
      <span className="io-s9k-h">{tr(S9_QADAM[qadam])}{!matnKerak && qor.matn ? <> · <b>{qisqa(qor.matn, 48)}</b></> : null}</span>
      {matnKerak && <label className="io-s9-q"><span className="io-sh-l">{tr(QISM_L.muammo)}</span><input className={cxx('io-inp', !qor.matn.trim() && 'io-halqa-i')} value={qor.matn} placeholder={tr({ uz: 'Odamlar nimadan qiynaladi?', ru: 'От чего страдают люди?' })} onChange={(e) => ozgar('matn', e.target.value)} /></label>}
      <label className={cxx('io-s9-q', xato && xato.k === 'kim' && 'err')}><span className="io-sh-l">{tr({ uz: "Kimdan so'raysiz", ru: 'У кого спросите' })}</span><input className={cxx('io-inp', !qor.kim.trim() && (!matnKerak || qor.matn.trim()) && 'io-halqa-i')} value={qor.kim} placeholder={tr({ uz: 'Bu muammoga kim duch keladi?', ru: 'Кто сталкивается с этой проблемой?' })} onChange={(e) => ozgar('kim', e.target.value)} /></label>
      <div className={cxx('io-s9-q', xato && xato.k === 'bolak' && 'err')}>
        <span className="io-sh-l">{tr({ uz: "Bo'lak", ru: 'Часть' })}</span>
        <span className="io-s9-sv">{tr({ uz: 'Oxirgi marta', ru: 'Когда вы в последний раз' })} {bolakInp} {tr({ uz: "qachon bo'ldi?", ru: '?' })}</span>
      </div>
      {xato && <QXato key={xato.kk}>{tr(xato.x)}</QXato>}
      <div className="io-s9-amal">
        <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
        <QTugma className={halqa(tayyor)} disabled={!qor.kim.trim() || (matnKerak && !qor.matn.trim())} onClick={yoz}>{tr({ uz: 'Shablonga yozish', ru: 'Записать в шаблон' })}</QTugma>
      </div>
      {yordam && <QIzoh>{tr({ uz: "Bo'lakni «-ganingiz» bilan yozing, masalan: «to'garak izlaganingiz». Kimdan — g'oyaning «Kim uchun» qatoridagi odamlar.", ru: 'Пишите часть в прошедшем времени, например: «искали кружок». У кого — люди из строки «Для кого» вашей идеи.' })}</QIzoh>}
    </div>
  ) : qadam === 2 ? (
    <div className="io-s9k io-kir" key="k2" ref={kartaRef}>
      <span className="io-s9k-h">3 · {tr(S9_QADAM[2])}</span>
      <ol className="io-s9-ro">{QOLGAN.map((q, n) => <li key={q}><b>{n + 2}</b><i className="io-sv">{tr(SH[q].savol)}</i></li>)}</ol>
      <div className="io-s9-amal"><QTugma className="io-halqa" onClick={qosh}>{tr({ uz: "Ikkala g'oyaga qo'shish", ru: 'Добавить к обеим идеям' })}</QTugma></div>
    </div>
  ) : null;
  const shablon = <IkkiShablon ustunlar={ustunlar} qatorlar={['kimdan', 'oxirgi', ...(qolgan ? QOLGAN : [])]} kat={kat} chiziq={qolgan} faol={qadam < 2 ? qadam : undefined} />;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qadam}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Uch qadamni bajaring', ru: 'Выполните три шага' })} (${Math.min(qadam, 3)}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Ikki g'oyangiz bo'yicha <A>kimdan nimani</A> so'raysiz?</>, ru: <>Кого и <A>о чём</A> спросите по двум идеям?</> })}
        mentor={<Mentor>{tr({ uz: "Har g'oya uchun kimdan so'rashni va 1-savoldagi bo'lakni yozing: qolgan to'rt savol ikkalasiga bir xil.", ru: 'Для каждой идеи напишите, у кого спросить, и часть 1-го вопроса: остальные четыре вопроса у обеих одинаковые.' })}</Mentor>}
        qadamlar={isMentor
          ? <MentorSanoq screen={screen} yorliqlar={[{ uz: 'Bajardi', ru: 'Выполнили' }, { uz: 'Hali bajarmoqda', ru: 'Ещё выполняют' }]} hisob={(rows, jami) => [String(rows.length), String(Math.max(0, jami - rows.length))]} />
          : <div className="io-s9q">{kirishQ && <p className="io-kirq">{kirishQ}</p>}<QQadamlar joriy={done ? undefined : qadam} qadamlar={S9_QADAM.map(tr)} /></div>}
        forma={isMentor
          ? <IkkiShablon ustunlar={MENTOR_GOYALAR2.map(g => ({ ...g, kimdan: tr(g.kim) }))} qatorlar={['kimdan', 'oxirgi', ...QOLGAN]} chiziq />
          : <div className={cxx('io-s9', done && 'tayyor')}>
            {okQ && !done && <p className="io-ok-q fade-step">{tr({ uz: "Savol o'tgan voqeani so'rayapti — shablonga yozildi.", ru: 'Вопрос спрашивает о прошедшем событии — записано в шаблон.' })}</p>}
            {karta}
            {shablon}
          </div>}
      >
        {done && !isMentor && <QXulosa>{tr({ uz: "Shablon tayyor: ikki g'oyaga besh savol, faqat birinchisida bo'lak har xil.", ru: 'Шаблон готов: пять вопросов для двух идей, разная только часть в первом.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "2-dars natijasi yo'q o'quvchi 1-dars ro'yxatidan ikkita g'oyani tanlasin. Eng ko'p xato — bo'lakka g'oyani yozish («ilovani ishlatganingiz»): «Odam nima qilganda qiynalgan edi?» deb so'rang.", ru: 'Ученик без результата 2-го урока выбирает две идеи из списка 1-го урока. Самая частая ошибка — писать в часть идею («пользовались приложением»): спросите «Что делал человек, когда ему было трудно?»' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — SINFDOSH BILAN INTERVYU (QMustaqil, juftlik 3 qadam; yakka rejim bilan) · pm-m9d3-intervyu.yozuvlar · nishon firstInterview =====
const S10_QADAM = [{ uz: 'Kim', ru: 'Кто' }, { uz: 'Savollar', ru: 'Вопросы' }, { uz: 'Harakat belgisi', ru: 'Знак действия' }];
const S10_SAVOL = ['oxirgi', 'qanday', 'qiyin', 'hozir'];
const XULOSA_SOZ_RE = /(^|\s)(kerak|hamma|ko'pchilik|odatda)(\s|$)/;
const bosh10 = () => ({ goya: null, tur: null, mashqGoya: null, kim: tr({ uz: 'sinfdosh', ru: 'одноклассник' }), javob: [], belgi: null });
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [sh] = useState(intervyuLs);
  const goyalar = sh
    ? sh.goyalar.map((g, i) => ({ nom: goyaNom(g, i), kim: g.kim, bolak: g.bolak }))
    : MENTOR_GOYALAR2.map(g => ({ nom: tr(g.nom), kim: tr(g.kim), bolak: tr(g.bolak) }));
  const [yozuvlar, setYozuvlar] = useState(() => (sh && Array.isArray(sh.yozuvlar) ? sh.yozuvlar.slice(0, 2) : []));
  const [forma, setForma] = useState(() => !(sh && Array.isArray(sh.yozuvlar) && sh.yozuvlar.length));
  const [d, setD] = useState(bosh10);
  const [qadam, setQadam] = useState(0);
  const [si, setSi] = useState(0);
  const [javobQ, setJavobQ] = useState('');
  const [ogoh, setOgoh] = useState(null);
  const [yangiQ, setYangiQ] = useState(null);
  const [yordam, setYordam] = useState(false);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const taymer = useTaymer();
  const done = yozuvlar.length > 0 && !forma;
  useEffect(() => { if (yangiQ === null) return undefined; const t = setTimeout(() => setYangiQ(null), 1300); return () => clearTimeout(t); }, [yangiQ]);
  const gi = d.tur === 'haqiqiy' ? d.goya : d.mashqGoya;
  const tanla = (i) => {
    if (qadam !== 0) return;
    if (i < 0) setD(o => ({ ...o, tur: 'mashq', goya: null, mashqGoya: null }));
    else setD(o => ({ ...o, tur: 'haqiqiy', goya: i, mashqGoya: null }));
  };
  const qosh = () => {
    if (qadam === 0) {
      if (gi === null) return;
      if (!String(d.kim).trim()) { setOgoh({ tur: 'bosh' }); return; }
      setOgoh(null); setYangiQ('kim'); setQadam(1); setSi(0); setJavobQ('');
      return;
    }
    if (qadam !== 1) return;
    const m = javobQ.trim();
    if (!m) { setOgoh({ tur: 'bosh' }); return; }
    if (XULOSA_SOZ_RE.test(normYoz(m)) && !(ogoh && ogoh.tur === 'xulosa' && ogoh.matn === m)) { setOgoh({ tur: 'xulosa', matn: m }); return; }
    setOgoh(null);
    setD(o => ({ ...o, javob: [...o.javob, m] })); setYangiQ(S10_SAVOL[si]); setJavobQ('');
    if (si < 3) setSi(si + 1); else setQadam(2);
  };
  const belgila = (b) => {
    if (qadam !== 2 || d.belgi) return;
    const yz = { goya: gi, kim: String(d.kim).trim(), oxirgi: d.javob[0], qanday: d.javob[1], qiyin: d.javob[2], hozir: d.javob[3], belgi: b, tur: d.tur };
    setD(o => ({ ...o, belgi: b })); setYangiQ('belgi');
    const idx = yozuvlar.length;
    taymer(() => {
      uch(kartaRef.current, `s10y-${idx}`, 640);
      const ro = [...yozuvlar, yz];
      setYozuvlar(ro); setForma(false); setD(bosh10()); setQadam(0); setSi(0); setYordam(false);
      const old = lsGet(INTERVYU_KEY) || {};
      lsSet(INTERVYU_KEY, { goyalar: Array.isArray(old.goyalar) ? old.goyalar : [], savollar: Array.isArray(old.savollar) ? old.savollar : [], yozuvlar: ro, savedAt: Date.now() });
      if (storedAnswer === undefined && idx === 0) onAnswer(screen, { stage: 'juftlik', screenIdx: screen, practice: 'yozuv', correct: true, picked: yz.tur === 'haqiqiy' ? 0 : 1, solved: true, tur: yz.tur });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'yozuv', yz.tur === 'haqiqiy' ? 0 : 1, true, 0);
    }, kamHarakat() ? 300 : 1400);
  };
  const yozuvY = (y, i) => ({ ...y, id: i, uch: `s10y-${i}`, kim: y.kim });
  const ustunJoy = (ui) => <Joylar yozuvlar={yozuvlar.map(yozuvY).filter(y => y.tur === 'haqiqiy' && y.goya === ui)} />;
  const mashqlar = yozuvlar.map(yozuvY).filter(y => y.tur === 'mashq');
  const oxirgiY = yozuvlar[yozuvlar.length - 1];
  const tegKl = d.tur === 'mashq' ? 'kul' : 'ok';
  const tegTur = d.tur && <span className={cxx('io-tag', tegKl)}>{d.tur === 'haqiqiy' ? tr({ uz: 'haqiqiy yozuv', ru: 'настоящая запись' }) : tr({ uz: 'mashq yozuvi', ru: 'тренировочная запись' })}</span>;
  const bolakT = gi !== null ? goyalar[gi].bolak : '';
  const savolMatn = (k) => (k === 'oxirgi' ? tr(SH.oxirgi.savol).replace('{bolak}', bolakT) : tr(SH[k].savol));
  const qatorlarD = ['kim', ...S10_SAVOL.slice(0, d.javob.length), ...(d.belgi ? ['belgi'] : [])];
  const yozuvD = { kim: d.kim, oxirgi: d.javob[0] && `«${d.javob[0]}»`, qanday: d.javob[1] && `«${d.javob[1]}»`, qiyin: d.javob[2] && `«${d.javob[2]}»`, hozir: d.javob[3] && `«${d.javob[3]}»`, belgi: d.belgi };
  const kartaIchi = (
    <div className="io-s10k io-kir" key={`f${yozuvlar.length}`} ref={kartaRef}>
      {qadam === 0 && <div className="io-s10-kim">
        <span className="io-s10-s">{tr({ uz: "Sherigingiz qaysi g'oyangizning «Kim uchun» qatoriga mos keladi?", ru: 'Строке «Для кого» какой вашей идеи подходит партнёр?' })}</span>
        <div className={cxx('io-s10-g', d.tur === null && 'io-guruh')}>
          {goyalar.map((g, i) => <div key={i} className="io-s10-gu"><QChip holat={d.tur === 'haqiqiy' && d.goya === i ? 'on' : undefined} onClick={() => tanla(i)}>«{tr(g.nom)}»</QChip>{g.kim && <span className="io-s10-ku">{tr(QISM_L.kim)}: {g.kim}</span>}</div>)}
          <div className="io-s10-gu"><QChip holat={d.tur === 'mashq' ? 'on' : undefined} onClick={() => tanla(-1)}>{tr({ uz: 'Hech biri', ru: 'Никакой' })}</QChip></div>
        </div>
        {d.tur === 'haqiqiy' && <QIzoh>{tr({ uz: "Haqiqiy yozuv — «Kim uchun» qatoriga mos odamdan olingan yozuv: u o'ntaga kiradi.", ru: 'Настоящая запись — запись от человека, подходящего строке «Для кого»: она входит в десятку.' })}</QIzoh>}
        {d.tur === 'mashq' && <>
          <div className={cxx('io-s10-mq', d.mashqGoya === null && 'io-guruh')}>{goyalar.map((g, i) => <QChip key={i} holat={d.mashqGoya === i ? 'on' : undefined} onClick={() => setD(o => ({ ...o, mashqGoya: i }))}>{tr(g.nom)}</QChip>)}</div>
          <QIzoh>{tr({ uz: "Mashq yozuvi o'ntaga kirmaydi — u savol berishni sinash uchun.", ru: 'Тренировочная запись не входит в десятку — она для пробы вопросов.' })}</QIzoh>
        </>}
        {gi !== null && <label className="io-s9-q"><span className="io-sh-l">{tr(SH.kim.nom)}</span><input className="io-inp" value={d.kim} onChange={(e) => { setD(o => ({ ...o, kim: e.target.value })); setOgoh(null); }} aria-label={tr(SH.kim.nom)} /></label>}
      </div>}
      {qadam === 1 && <div className="io-s10-sv">
        <span className="io-s10-n">{si + 1} / 4</span>
        <i className="io-sv katta">{savolMatn(S10_SAVOL[si])}</i>
        <label className="io-s9-q"><span className="io-sh-l">{tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })}</span><input key={si} className={cxx('io-inp', !javobQ.trim() && 'io-halqa-i')} value={javobQ} onChange={(e) => { setJavobQ(e.target.value); if (ogoh && ogoh.tur === 'bosh') setOgoh(null); }} onKeyDown={(e) => { if (e.key === 'Enter') qosh(); }} aria-label={tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' })} /></label>
      </div>}
      {qadam === 2 && <div className="io-s10-sv">
        <i className="io-sv katta">{tr(SH.belgi.savol)}</i>
        <div className={cxx('io-s10-bt', !d.belgi && 'io-guruh')}>
          <QChip holat={d.belgi === 'ha' ? 'ok' : undefined} disabled={!!d.belgi} onClick={() => belgila('ha')}>{tr({ uz: 'Ha — kun belgiladi', ru: 'Да — назначил день' })}</QChip>
          <QChip holat={d.belgi === YOQ ? 'on' : undefined} disabled={!!d.belgi} onClick={() => belgila(YOQ)}>{tr({ uz: "Yo'q — belgilamadi", ru: 'Нет — не назначил' })}</QChip>
        </div>
        <QIzoh>{tr({ uz: "Yozuvga faqat «ha» yoki «yo'q» tushadi.", ru: 'В запись попадает только «да» или «нет».' })}</QIzoh>
      </div>}
      {qadam > 0 && <YozuvKarta y={yozuvD} qatorlar={qatorlarD} yangi={yangiQ} teg={tegTur} className="io-s10-yz" />}
      {ogoh && <div className="io-s10-og"><QXato>{ogoh.tur === 'xulosa' ? tr({ uz: "Bu xulosaga o'xshaydi — u aytganidek yozing.", ru: 'Это похоже на вывод — запишите так, как он сказал.' }) : tr({ uz: 'Sherigingiz nima dedi — shuni yozing.', ru: 'Что сказал партнёр — это и запишите.' })}</QXato>{ogoh.tur === 'xulosa' && <QIzoh>{tr({ uz: 'Shunday qoldirsangiz — yana bosing.', ru: 'Если оставить так — нажмите ещё раз.' })}</QIzoh>}</div>}
      {qadam < 2 && <div className="io-s9-amal">
        <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
        <QTugma className={halqa(qadam === 0 ? gi !== null : !!javobQ.trim())} disabled={qadam === 0 && gi === null} onClick={qosh}>{tr({ uz: "Yozuvga qo'shish", ru: 'Добавить в запись' })}</QTugma>
      </div>}
      {qadam === 0 && tegTur && <div className="io-s10-teg">{tegTur}</div>}
      {yordam && <QIzoh>{tr({ uz: "Sherigingizda bu voqea bo'lmagan bo'lsa — shuni yozing: bu ham javob. Kamroq gapiring, ko'proq tinglang.", ru: 'Если у партнёра такого случая не было — так и запишите: это тоже ответ. Говорите меньше, слушайте больше.' })}</QIzoh>}
    </div>
  );
  const shablon = (
    <IkkiShablon kichik ixcham ustunlar={goyalar.map(g => ({ nom: g.nom, bolak: g.bolak }))} qatorlar={SHABLON.map(q => q.kalit)} faol={forma && gi !== null ? gi : undefined}
      ostida={[ustunJoy(0), ustunJoy(1)]} />
  );
  const mentorGap = isStudent
    ? tr({ uz: "Avval siz so'raysiz, keyin sherigingiz: javobni o'sha zahoti, u aytganidek yozing.", ru: 'Сначала спрашиваете вы, потом партнёр: записывайте ответ сразу и так, как он сказал.' })
    : tr({ uz: "Yoningizdagi bir odamga savollaringizni bering: javobni o'sha zahoti, u aytganidek yozing.", ru: 'Задайте свои вопросы человеку рядом: записывайте ответ сразу и так, как он сказал.' });
  const yakka = !isStudent && !isMentor;
  return (
    <Stage eyebrow={isStudent || isMentor ? tr({ uz: 'Juftlikda · intervyu', ru: 'В паре · интервью' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qadam * 10 + si}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor && !yakka} label={done || isMentor || yakka ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Uch qadamni bajaring', ru: 'Выполните три шага' })} (${qadam}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sinfdoshingizdan <A>birinchi yozuvni</A> oling.</>, ru: <>Получите <A>первую запись</A> от одноклассника.</> })}
        mentor={<Mentor>{mentorGap}</Mentor>}
        qadamlar={isMentor
          ? <MentorSanoq screen={screen} yorliqlar={[{ uz: 'Haqiqiy yozuv', ru: 'Настоящая запись' }, { uz: 'Mashq yozuvi', ru: 'Тренировочная запись' }]} hisob={(rows) => [String(rows.filter(r => r.picked === 0).length), String(rows.filter(r => r.picked === 1).length)]} />
          : <div className="io-s9q"><QQadamlar joriy={!forma ? undefined : qadam} qadamlar={S10_QADAM.map(tr)} />{sh && <ShStrip />}</div>}
        forma={isMentor ? shablon : <div className={cxx('io-s10', !forma && 'tayyor')}>
          {forma && kartaIchi}
          {shablon}
          {mashqlar.length > 0 && <div className="io-s10-mashq"><span className="io-joy-y">{tr({ uz: 'Mashq', ru: 'Тренировка' })}</span><div className="io-joy-ro">{mashqlar.map(y => <YozuvKarta key={y.id} y={y} ixcham uch={y.uch} />)}</div></div>}
          {!forma && yozuvlar.length < 2 && <div className="io-amal"><QTugma ikkinchi onClick={() => setForma(true)}>{tr({ uz: 'Yana bitta yozuv', ru: 'Ещё одна запись' })}</QTugma></div>}
        </div>}
        yordam={yakka && forma && <QIzoh>{tr({ uz: "Yoningizda odam bo'lmasa, uydagilardan biriga qo'ng'iroq qilib so'rang yoki bu qadamni uyda bajaring.", ru: 'Если рядом никого нет — позвоните кому-то из домашних или выполните этот шаг дома.' })}</QIzoh>}
      >
        {done && oxirgiY && <QXulosa>{oxirgiY.tur === 'haqiqiy'
          ? tr({ uz: "Haqiqiy yozuv tayyor: u shu g'oya ustunidagi beshtaning birinchisi.", ru: 'Настоящая запись готова: она первая из пяти в колонке этой идеи.' })
          : tr({ uz: "Mashq yozuvi tayyor: savollarni sinadingiz, lekin u o'ntaga kirmaydi.", ru: 'Тренировочная запись готова: вы опробовали вопросы, но в десятку она не входит.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Juftlikka 8 daqiqa — 4 daqiqa birinchisi so'raydi, 4 daqiqa ikkinchisi. Sinfdosh ko'p g'oyaning auditoriyasi (o'smirlar, sinfdoshlar) — bo'lmasa mashq: bu ham foydali. Telefon raqami so'ralmaydi: odam faqat sinab ko'rish uchun kun belgilaydi, yozuvga «ha» / «yo'q». Sherigida voqea bo'lmagan bo'lsa — aynan shuni yozsin; «muammo yo'q» degan xulosani o'zi qo'shmasin.", ru: 'На пару 8 минут — 4 минуты спрашивает первый, 4 минуты второй. Одноклассник — аудитория многих идей (подростки, одноклассники); если нет — тренировка: это тоже полезно. Номер телефона не спрашивают: человек только назначает день для проверки, в запись — «да» / «нет». Если у партнёра такого случая не было — пусть так и запишет; вывод «проблемы нет» сам не добавляет.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — KOD YOZISH (QKod + HtmlCompiler; tayanch 4, PM-082): umumiy savollar massivi va ikki g'oyaning bo'lagi → sahifada ikki ustunli shablon =====
// Starter matni oddiy satrlardan yig'iladi (backtick yo'q). Qatorlar ≤ 70 belgi (SABOQ 37): uzun 5-savol «+» bilan ikki satrga bo'lingan.
// Tekshiruv ma'lumotdan mustaqil (SABOQ 37): funksiya o'z namuna obyekti bilan chaqiriladi; ustunlar soni — goyalar uzunligiga teng (node sinovi: scratchpad 03-qurish/kod-sinov.mjs).
const KOD_DATA = [
  'const goyalar = [',
  '  {',
  '    nom: "Jamoa yig\'ish",',
  '    bolak: "o\'yinga odam yig\'ganingiz"',
  '  },',
  '  {',
  '    nom: "Mahalla to\'garaklari",',
  '    bolak: "to\'garak izlaganingiz"',
  '  }',
  '];',
  ''
];
const KOD_UMUMIY = [
  'const umumiy = [',
  '  "O\'shanda qanday qildingiz?",',
  '  "Eng qiyini nima bo\'ldi?",',
  '  "Hozir buni nima bilan hal qilyapsiz?",',
  '  "Birinchi versiya tayyor bo\'lganda, uni sinab ko\'rishga " +',
  '    "10 daqiqa vaqt berasizmi? Qaysi kunni belgilaysiz?"',
  '];',
  ''
];
const KOD_IZ = {
  bosh: { uz: "// Mentorning ikki g'oyasi:\n// birinchi savolda almashadigan bo'lak", ru: '// Две идеи Ментора:\n// часть, которая меняется в первом вопросе' },
  umumiy: { uz: "// 2–5-savollar ikkala g'oyaga bir xil", ru: '// Вопросы 2–5 одинаковые для обеих идей' },
  fn1: { uz: '  // birinchi savolni goya.bolak bilan yasang,', ru: '  // соберите первый вопрос с goya.bolak,' },
  fn2: { uz: "  // keyin umumiy savollarni qo'shing", ru: '  // потом добавьте общие вопросы' },
  siz: { uz: '   // shu joyni siz yozasiz', ru: '   // это место пишете вы' },
  tayyor: { uz: "// har g'oya — sahifada bitta ustun (bu qism tayyor)", ru: '// каждая идея — одна колонка на странице (эта часть готова)' }
};
const kodStarter = (t) => [KOD_IZ.bosh[t], ...KOD_DATA, KOD_IZ.umumiy[t], ...KOD_UMUMIY,
  'function savollar(goya) {', KOD_IZ.fn1[t], KOD_IZ.fn2[t], '  return [];' + KOD_IZ.siz[t], '}', '',
  KOD_IZ.tayyor[t], 'const joy = document.getElementById("shablon");', 'goyalar.forEach(function (goya) {',
  '  const ustun = document.createElement("div");', '  ustun.className = "ustun";', '  const sarlavha = document.createElement("h2");',
  '  sarlavha.textContent = goya.nom;', '  ustun.appendChild(sarlavha);', '  const royxat = document.createElement("ol");',
  '  savollar(goya).forEach(function (matn) {', '    const qator = document.createElement("li");', '    qator.textContent = matn;',
  '    royxat.appendChild(qator);', '  });', '  ustun.appendChild(royxat);', '  joy.appendChild(ustun);', '});', ''].join('\n');
const KOD_STARTER = { uz: kodStarter('uz'), ru: kodStarter('ru') };
// Tutuq belgisining turli ko'rinishi (o'zbekcha klaviaturadagi) shartni yiqitmasin
const KOD_TUTUQ = 'String(x).replace(/[\\u02BB\\u02BC\\u2018\\u2019]/g, "\'")';
const KOD_SHART_IFODA = [
  ['String(savollar({ nom: "x", bolak: "a" }).length) + "|" + String(savollar({ nom: "y", bolak: "b" }).length)', '5|5'],
  [`(function(){var s=savollar({ nom: "x", bolak: "a" });return (function(x){return ${KOD_TUTUQ}})(s[0])+"#"+(s.slice(1).join("|")===umumiy.join("|"));})()`, "Oxirgi marta a qachon bo'ldi?#true"],
  ['(function(){var u=document.querySelectorAll("#shablon .ustun");if(u.length<2||u.length!==goyalar.length)return "yoq";for(var i=0;i<u.length;i++){if(u[i].querySelectorAll("li").length!==5)return "yoq";}return "ha";})()', 'ha']
];
const KOD_INDEX = { uz: "<h1>Shablon: ikki g'oya</h1>\n<div id=\"shablon\"></div>\n", ru: "<h1>Шаблон: две идеи</h1>\n<div id=\"shablon\"></div>\n" };
const KOD_VAZIFA = [
  { uz: "`savollar` besh savollik ro'yxat qaytaradi", ru: '`savollar` возвращает список из пяти вопросов' },
  { uz: 'Birinchi savolda `goya.bolak` turadi', ru: 'В первом вопросе стоит `goya.bolak`' },
  { uz: 'Sahifada ikki ustun, har birida besh savol', ru: 'На странице две колонки, в каждой пять вопросов' }
];
const KOD_SHART = [
  { uz: "Har g'oyaga besh savol: ro'yxat uzunligi 5 bo'lsin.", ru: 'Пять вопросов на идею: длина списка — 5.' },
  { uz: "1-savol: «Oxirgi marta», bo'lak va «qachon bo'ldi?»", ru: '1-й вопрос: «Oxirgi marta», часть и «qachon bo\'ldi?»' },
  { uz: "Sahifada ikki ustun, har birida besh savol bo'lsin.", ru: 'Пусть на странице будут две колонки по пять вопросов.' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — savollar funksiyasini yakunlang', ru: 'app.js — допишите функцию savollar' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: "// birinchi savolni yasang, keyin umumiy savollarni qo'shing", ru: '// соберите первый вопрос, потом добавьте общие' } },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: '#shablon{display:grid;grid-template-columns:1fr 1fr;gap:16px}.ustun{background:#fff;border:1px solid #E7E3F4;border-radius:8px;padding:10px 14px}.ustun h2{font-size:17px;margin:0 0 8px}.ustun ol{margin:0;padding-left:22px}.ustun li{margin:0 0 8px;line-height:1.4}',
  requirements: [
    { id: 'besh', label: KOD_VAZIFA[0], check: C.evalEquals(KOD_SHART_IFODA[0][0], KOD_SHART_IFODA[0][1], KOD_SHART[0]) },
    { id: 'bolak', label: KOD_VAZIFA[1], check: C.evalEquals(KOD_SHART_IFODA[1][0], KOD_SHART_IFODA[1][1], KOD_SHART[1]) },
    { id: 'ustun', label: KOD_VAZIFA[2], check: C.evalEquals(KOD_SHART_IFODA[2][0], KOD_SHART_IFODA[2][1], KOD_SHART[2]) }
  ]
};
const KOD_DARVOZA = [
  { id: 'bolak', t: { uz: "Birinchi savoldagi bo'lak", ru: 'Часть в первом вопросе' }, ok: true },
  { id: 'hammasi', t: { uz: 'Beshala savolning hammasi', ru: 'Все пять вопросов' }, ok: false, x: { uz: "Hammasi o'zgarsa, javoblarni solishtirib bo'lmaydi.", ru: 'Если поменять всё, ответы не сравнить.' } },
  { id: 'daqiqa', t: { uz: 'Oxirgi savoldagi «10 daqiqa»', ru: '«10 минут» в последнем вопросе' }, ok: false, x: { uz: "Oxirgi savol ikkala g'oyaga bir xil.", ru: 'Последний вопрос одинаковый для обеих идей.' } }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d): darvozadan keyin bolak qiymatlari bir lahza ajraladi (shablondagi accent rangida)
const kodParcha = (kod) => {
  const L = kod.split('\n').filter(l => l.trim());
  const u = L.findIndex(l => l.startsWith('const umumiy')), fn = L.findIndex(l => l.startsWith('function savollar'));
  return [...L.slice(0, u), 'const umumiy = [ … ];', ...L.slice(fn, fn + 5)];
};
const KodNamuna = ({ ajrat }) => (
  <pre className={cxx('io-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
    {kodParcha(tr(KOD_STARTER)).map((l, i) => {
      if (l.trim().startsWith('//')) return <span key={i} className="io-kod-iz">{l}{'\n'}</span>;
      const m = l.match(/^(.*bolak: )(".*?")(.*)$/);
      if (!m) return <span key={i}>{l}{'\n'}</span>;
      return <span key={i}>{m[1]}<b className="io-kod-b">{m[2]}</b>{m[3]}{'\n'}</span>;
    })}
  </pre>
);
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi, MEXANIZM-TAKLIF 10)
const QKOD_ONG = ['muh', 'arrir'].join('');
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [gpick, setGpick] = useState(() => (storedAnswer ? 'bolak' : null));
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
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: 'Пишем код' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: '① Kod-savolini yeching', ru: '① Решите вопрос о коде' }) : tr({ uz: '② Kodni yozing', ru: '② Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Savollarni ikki g'oyaga moslaydigan <A>kod yozamiz</A>.</>, ru: <>Пишем <A>код</A>, который подстраивает вопросы под две идеи.</> })}
        mentor={<Mentor>{tr({ uz: "Shablon kodda turibdi: har g'oya uchun besh savollik ro'yxat yig'asiz.", ru: 'Шаблон лежит в коде: для каждой идеи вы соберёте список из пяти вопросов.' })}</Mentor>}
        vazifa={<>
          <ShStrip />
          <div className="io-darvoza">
            <span className="io-darvoza-s">{tr({ uz: "Ikkinchi g'oya uchun savollarning qaysi qismi o'zgaradi?", ru: 'Какая часть вопросов меняется для второй идеи?' })}</span>
            <div className={cxx('io-darvoza-ro', !stage2 && 'io-guruh')}>
              {KOD_DARVOZA.map(g => {
                const silk = miss && miss.id === g.id;
                return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : silk ? 'err' : undefined} disabled={stage2 && gpick !== g.id} onClick={() => pickGate(g)}>{tr(g.t)}</QChip>;
              })}
            </div>
            {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
          </div>
          <ol className={cxx('io-vazifa', !stage2 && 'xira')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cxx(done && 'ok')}><i>{done ? '✓' : i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>
          {done && <QXulosa>{tr({ uz: "Kod ikki g'oyaga bitta shablonni sahifaga chiqardi.", ru: 'Код вывел на страницу один шаблон для двух идей.' })}</QXulosa>}
        </>}
        yordam={stage2 && <div className="io-kyordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: "Avval birinchi savolni yasang: `\"Oxirgi marta \" + goya.bolak + \" qachon bo'ldi?\"`. Keyin `umumiy` dagi to'rt savolni `forEach` bilan ro'yxatga `push` qiling.", ru: 'Сначала соберите первый вопрос: `"Oxirgi marta " + goya.bolak + " qachon bo\'ldi?"`. Потом добавьте `push` четыре вопроса из `umumiy` через `forEach`.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): massiv — ro'yxat · `+` — ikki matnni qo'shadi · `push` — ro'yxat oxiriga qo'shadi · `forEach` — ro'yxatdagi har element uchun bir marta ishlaydi.", ru: 'Напоминание (из уроков JavaScript): массив — список · `+` — соединяет два текста · `push` — добавляет в конец списка · `forEach` — срабатывает один раз для каждого элемента списка.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Qo'shimcha: `goyalar` ga o'z ikki g'oyangizning bo'lagini yozing — sahifada o'z shabloningiz chiqadi.", ru: 'Дополнительно: запишите в `goyalar` части своих двух идей — на странице появится ваш шаблон.' }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="io-kodoyna">
          {stage2 && !done && <div className="io-mgap fade-step"><img src={MENTOR_IMG} alt="" aria-hidden="true" /><span>{tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите результат.' })}</span></div>}
          {stage2 && <div className="io-amal"><QTugma className={halqa(!done && !isMentor)} ikkinchi={done} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {done
            ? <div className="io-kod-natija fade-step"><span className="io-sh-l">{tr({ uz: 'Sahifada', ru: 'На странице' })}</span><IkkiShablon kichik ustunlar={MENTOR_GOYALAR2} qatorlar={['oxirgi', 'qanday', 'qiyin', 'hozir', 'belgi']} chiziq /></div>
            : <KodNamuna ajrat={ajrat} />}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      >
        <MentorNote>{tr({ uz: "Kod — 3–4 daqiqalik mashq, yangi qoida yo'q: bir xil savollar va almashadigan bo'lak. O'z g'oyalarini `goyalar` ga yozgan o'quvchini maqtang — shart emas.", ru: 'Код — упражнение на 3–4 минуты, нового правила нет: одинаковые вопросы и меняющаяся часть. Похвалите ученика, который записал в `goyalar` свои идеи, — это не обязательно.' })}</MentorNote>
      </QKod>
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m9d3-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s12 = 1; harakat belgisi) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Harakat belgisi qatoriga nima yozasiz?"
    question={tr({
      uz: <><Iqtibos kim="Sinfdosh:" odam={{ kiyim: 4, teri: 1, soch: 0 }} osti="sinab ko'rishga kun belgilamadi">«Ajoyib g'oya, men ishlatardim!»</Iqtibos><h2 className="title h-ask">Harakat belgisi qatoriga <A>nima yozasiz?</A></h2></>,
      ru: <><Iqtibos kim="Одноклассник:" odam={{ kiyim: 4, teri: 1, soch: 0 }} osti="день для проверки не назначил">«Отличная идея, я бы пользовался!»</Iqtibos><h2 className="title h-ask">Что вы <A>запишете</A> в строку «Знак действия»?</h2></>
    })}
    options={[
      { uz: '«ha» — ishlatishini o\'zi aytdi', ru: '«да» — сам сказал, что будет пользоваться' },
      { uz: "«yo'q» — kun belgilamadi", ru: '«нет» — день не назначил' },
      { uz: "«ha» — g'oyani maqtab gapirdi", ru: '«да» — хвалил идею' },
      { uz: 'Hech narsa — javob noaniq bo\'ldi', ru: 'Ничего — ответ был неясным' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Maqtov va «ishlatardim» — so'z; kun belgilanmadi — bu yozuvda belgi «yo'q».", ru: 'Похвала и «пользовался бы» — слова; день не назначен — в этой записи знак «нет».' }}
    explainWrong={{
      0: { uz: "«Ishlatardim» — hali bo'lmagan ish haqida va'da.", ru: '«Пользовался бы» — обещание о том, чего ещё не было.' },
      2: { uz: "Maqtov — g'oyaga baho, ish emas.", ru: 'Похвала — оценка идеи, а не дело.' },
      3: { uz: 'Javob bor: u kun belgilamadi.', ru: 'Ответ есть: он не назначил день.' },
      default: { uz: "Odam so'z aytdimi yoki ish qildimi — shuni qarang.", ru: 'Смотрите: человек сказал слово или сделал дело.' }
    }}
    vizual={<div className="io-s12v"><span className="io-sh-l">{tr(SH.belgi.nom)}</span><BelgiT b={YOQ} /></div>} />
);

// ===== 🏅 BADGES (nishonlar) — ish qilingan ekranlarda, tekin bonus yo'q (S-034); medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  sameQuestions: { icon: '🧩', name: 'Same Questions!', desc: { uz: "Savollarni birinchi urinishda ajratib, ikkinchi g'oyaga moslab berdingiz", ru: 'С первой попытки разделили вопросы и подстроили их под вторую идею' } },
  twoIdeas: { icon: '📋', name: 'Two Ideas Ready!', desc: { uz: "Ikki g'oyangizga bir xil savollar bilan shablon tuzdingiz", ru: 'Составили шаблон с одинаковыми вопросами для двух идей' } },
  firstInterview: { icon: '🎙️', name: 'First Interview!', desc: { uz: "Sinfdoshingizdan intervyu olib, birinchi yozuvni to'ldirdingiz", ru: 'Взяли интервью у одноклассника и заполнили первую запись' } },
  questionCoder: { icon: '💻', name: 'Question Coder!', desc: { uz: 'Savollarni ikki g\'oyaga moslaydigan kod yozdingiz', ru: 'Написали код, который подстраивает вопросы под две идеи' } },
};
// Ekran id → nishon (onAnswer correct: true bo'lganda; s2 — beshala savol birinchi urinishda)
const ACH_TRIGGERS = { s2: 'sameQuestions', s9: 'twoIdeas', s10: 'firstInterview', s11: 'questionCoder' };

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


// Podium savol yorliqlari (SCORED_IDX: 3, 5, 8, 12)
const Q_LABELS = {
  3: { uz: "1 — To'garakka birinchi savol", ru: '1 — Первый вопрос о кружке' },
  5: { uz: '2 — Hozir nima bilan', ru: '2 — Чем сейчас' },
  8: { uz: "3 — Airbnb'dagidek", ru: '3 — Как в Airbnb' },
  12: { uz: '4 — Harakat belgisi', ru: '4 — Знак действия' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'intervyu', ru: 'интервью' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'yozuv', ru: 'запись' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'shablon', ru: 'шаблон' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'voqea', ru: 'событие' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'belgi', ru: 'знак' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: "g'oya", ru: 'идея' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'sherik', ru: 'партнёр' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 1·6·11 · B 4·8·12 · C 2·5·9 · D 3·7·10 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: "Ikki g'oyani intervyuda qanday savollar bilan tekshirasiz?", ru: 'Какими вопросами вы проверите две идеи на интервью?' }, opts: [{ uz: 'Ikkalasiga bir xil savollar bilan', ru: 'Одинаковыми вопросами для обеих' }, { uz: 'Har biriga alohida savollar bilan', ru: 'Отдельными вопросами для каждой' }, { uz: "Kuchlirog'iga ko'proq savollar bilan", ru: 'Сильной — больше вопросов' }, { uz: 'Har biriga bitta-ikkita savol bilan', ru: 'По одному-два вопроса каждой' }], correct: 0 },
  { q: { uz: "To'garak g'oyasida savollarning nimasi almashadi?", ru: 'Что меняется в вопросах для идеи кружков?' }, opts: [{ uz: 'Beshala savolning hammasi birdan', ru: 'Все пять вопросов сразу' }, { uz: "Faqat oxirgi savoldagi bitta so'z", ru: 'Только одно слово в последнем вопросе' }, { uz: "Faqat birinchi savoldagi bo'lak", ru: 'Только часть в первом вопросе' }, { uz: 'Savollar qaysi tartibda kelishi', ru: 'Порядок вопросов' }], correct: 2 },
  { q: { uz: "To'garak izlagan odamga qaysi savol voqeani ochadi?", ru: 'Какой вопрос откроет историю человека, искавшего кружок?' }, opts: [{ uz: "«Xaritasi bo'lsa, ochib ko'rardingizmi?»", ru: '«Была бы карта — открыли бы?»' }, { uz: "«Yozda to'garak topish qiyin edimi?»", ru: '«Летом было трудно найти кружок?»' }, { uz: "«Odatda to'garakni qanday tanlaysiz?»", ru: '«Как вы обычно выбираете кружок?»' }, { uz: "«Yozda to'garakni qanday qidirdingiz?»", ru: '«Как вы искали кружок летом?»' }], correct: 3 },
  { q: { uz: '«Hozir buni nima bilan hal qilyapsiz?» savoli nimani ochadi?', ru: 'Что открывает вопрос «Чем вы сейчас это решаете?»' }, opts: [{ uz: 'Odam ilovani qaysi kuni yuklab olishini', ru: 'В какой день человек скачает приложение' }, { uz: "Muammo chiqqanda odam bugun qanday yo'l tutishini", ru: 'Как человек сегодня поступает, когда возникает проблема' }, { uz: "Odamga ikki g'oyadan qaysi biri yoqishini", ru: 'Какая из двух идей нравится человеку' }, { uz: 'Odam bu muammoni kimdan eshitib qolganini', ru: 'От кого человек услышал об этой проблеме' }], correct: 1 },
  { q: { uz: "Mentor misolida o'yinchilar jamoani hozir qanday yig'adi?", ru: 'Как в примере Ментора игроки сейчас собирают команду?' }, opts: [{ uz: "Maktabdagi e'lon taxtasi orqali", ru: 'Через доску объявлений в школе' }, { uz: "Maydon egasiga qo'ng'iroq qilib", ru: 'Звонят хозяину поля' }, { uz: "Telegram guruhiga yozib, so'rab", ru: 'Пишут и спрашивают в Telegram-группе' }, { uz: 'Maxsus futbol ilovasi orqali yozib', ru: 'Пишут через особое футбольное приложение' }], correct: 2 },
  { q: { uz: 'Mentor misolida qaysi biri harakat belgisi?', ru: 'Что в примере Ментора — знак действия?' }, opts: [{ uz: 'Sinovga kun belgiladi', ru: 'Назначил день проверки' }, { uz: "«Ajoyib g'oya» deb maqtadi", ru: 'Похвалил: «Отличная идея»' }, { uz: '«Ishlatardim» deb aytdi', ru: 'Сказал «пользовался бы»' }, { uz: 'Intervyuda uzoq gapirdi', ru: 'Долго говорил на интервью' }], correct: 0 },
  { q: { uz: 'Harakat belgisi savoli intervyuning qayerida beriladi?', ru: 'Где в интервью задают вопрос о знаке действия?' }, opts: [{ uz: 'Eng boshida, salomlashgandan keyin', ru: 'В самом начале, после приветствия' }, { uz: 'Birinchi savolni berishdan oldin', ru: 'Перед первым вопросом' }, { uz: "Uchinchi savoldan keyin, o'rtada", ru: 'После третьего вопроса, в середине' }, { uz: "Oxirida, muammo haqida so'ragach", ru: 'В конце, после вопросов о проблеме' }], correct: 3 },
  { q: { uz: 'Yozuvning harakat belgisi qatoriga nima tushadi?', ru: 'Что попадает в строку «Знак действия» записи?' }, opts: [{ uz: 'Odamning ismi va sinov kuni', ru: 'Имя человека и день проверки' }, { uz: "Faqat «ha» yoki «yo'q» belgisi", ru: 'Только знак «да» или «нет»' }, { uz: 'Odamning «ishlatardim» degan gapi', ru: 'Его слова «пользовался бы»' }, { uz: "Sizning g'oya haqidagi fikringiz", ru: 'Ваше мнение об идее' }], correct: 1 },
  { q: { uz: "Saytga yangi odamlar qo'shilmay qolganda Airbnb asoschilari nima qilgan?", ru: 'Что сделали основатели Airbnb, когда новые люди перестали приходить на сайт?' }, opts: [{ uz: "Saytdagi tugmalarni o'zgartirgan", ru: 'Поменяли кнопки на сайте' }, { uz: 'Uy egalariga uzun xatlar yozgan', ru: 'Писали хозяевам длинные письма' }, { uz: "Kvartiralarni o'zlari aylangan", ru: 'Сами обошли квартиры' }, { uz: "Saytga ko'proq reklama bergan", ru: 'Дали больше рекламы сайту' }], correct: 2 },
  { q: { uz: 'Airbnb asoschilari kvartiralarda nimani bilgan?', ru: 'Что основатели Airbnb узнали в квартирах?' }, opts: [{ uz: 'Uylarning narxi juda balandligini', ru: 'Что цены на жильё слишком высокие' }, { uz: 'Uy egalari saytni bilmasligini', ru: 'Что хозяева не знают сайт' }, { uz: 'Mehmonlar uyda shovqin qilishini', ru: 'Что гости шумят дома' }, { uz: 'Yomon suratlar xalaqit berishini', ru: 'Что мешают плохие фото' }], correct: 3 },
  { q: { uz: "Sherigingiz g'oya auditoriyasidan emas. Uning yozuvi qanday bo'ladi?", ru: 'Партнёр не из аудитории идеи. Какой будет его запись?' }, opts: [{ uz: "Mashq yozuvi — o'ntaga kirmaydi", ru: 'Тренировочная — не входит в десятку' }, { uz: "Haqiqiy yozuv — o'ntaga qo'shiladi", ru: 'Настоящая — добавится в десятку' }, { uz: 'Yozuv olinmaydi — vaqt bekor ketadi', ru: 'Запись не берут — время потеряно' }, { uz: "Ikki yozuv — har g'oyaga bittadan", ru: 'Две записи — по одной на идею' }], correct: 0 },
  { q: { uz: 'Sinfdoshingiz javobini yozuvga qanday yozasiz?', ru: 'Как вы запишете ответ одноклассника?' }, opts: [{ uz: 'Uyda, eslab qolganingizcha', ru: 'Дома, как запомнили' }, { uz: "O'sha zahoti, u aytganidek", ru: 'Сразу и так, как он сказал' }, { uz: "O'z xulosangiz bilan qo'shib", ru: 'Добавив свой вывод' }, { uz: "Bitta so'z bilan, qisqartirib", ru: 'Одним словом, сократив' }], correct: 1 },
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204, texnik darslar standarti aynan). Mentor yo'q (KORPUS §61, SABOQ 16).
const KARTOCHKALAR = [
  { front: { uz: "Nega ikki g'oyani bir xil savollar bilan tekshirasiz?", ru: 'Зачем проверять две идеи одинаковыми вопросами?' }, back: { uz: 'Javoblarni qatorma-qator solishtirish uchun', ru: 'Чтобы сравнивать ответы строка за строкой' } },
  { front: { uz: "Ikkinchi g'oyada savolning qaysi qismi almashadi?", ru: 'Какая часть вопроса меняется во второй идее?' }, back: { uz: "Faqat 1-savoldagi bo'lak: «o'yinga odam yig'ganingiz» o'rniga «to'garak izlaganingiz»", ru: 'Только часть 1-го вопроса: вместо «собирали людей на игру» — «искали кружок»' } },
  { front: { uz: "Qaysi savol bo'lib o'tgan ishni so'raydi?", ru: 'Какой вопрос спрашивает о том, что было?' }, back: { uz: "«Oxirgi marta … qachon bo'ldi?» kabi savol — voqea savoli", ru: 'Вопрос вроде «Когда в последний раз …?» — вопрос о событии' } },
  { front: { uz: "«Ilova bo'lsa, ishlatarmidingiz?» savoliga qanday javob keladi?", ru: 'Какой ответ приходит на вопрос «Было бы приложение — пользовались бы?»' }, back: { uz: "Va'da: ilova hali yo'q", ru: 'Обещание: приложения ещё нет' } },
  { front: { uz: '«Hozir buni nima bilan hal qilyapsiz?» savoli nimani ochadi?', ru: 'Что открывает вопрос «Чем вы сейчас это решаете?»' }, back: { uz: 'Odam muammoni hozir nima bilan hal qilayotganini — yangi yechim shu bilan solishtiriladi', ru: 'Чем человек решает проблему сейчас — с этим сравнивают новое решение' } },
  { front: { uz: 'Harakat belgisi nima?', ru: 'Что такое знак действия?' }, back: { uz: "Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish", ru: 'Интерес, который человек в конце интервью показал не словом, а делом' } },
  { front: { uz: 'Mentor misolida harakat belgisi qaysi ish edi?', ru: 'Каким делом был знак действия в примере Ментора?' }, back: { uz: "Odam sinab ko'rishga kun belgiladimi — «ha» yoki «yo'q»", ru: 'Назначил ли человек день, чтобы попробовать, — «да» или «нет»' } },
  { front: { uz: 'Odam sinovga kun belgiladi. Bu nega maqtovdan kuchliroq?', ru: 'Человек назначил день проверки. Почему это сильнее похвалы?' }, back: { uz: "U o'z vaqtini berishga rozi bo'ldi — maqtov esa hech narsa talab qilmaydi", ru: 'Он согласился отдать своё время, а похвала ничего не требует' } },
  { front: { uz: 'Odam «ishlatardim» dedi, lekin kun belgilamadi. Belgi qanday?', ru: 'Человек сказал «пользовался бы», но день не назначил. Какой знак?' }, back: { uz: "«Yo'q»: so'z bor, ish yo'q", ru: '«Нет»: слово есть, дела нет' } },
  { front: { uz: 'Airbnb asoschilari yomon suratlarni qanday bilgan?', ru: 'Как основатели Airbnb узнали о плохих фото?' }, back: { uz: 'Nyu-Yorkdagi kvartiralarni o\'zlari aylanib, suratga olib', ru: 'Сами обошли квартиры в Нью-Йорке и сфотографировали их' } },
  { front: { uz: "Sherigingiz g'oyangiz auditoriyasidan bo'lmasa, yozuv qanday bo'ladi?", ru: 'Если партнёр не из аудитории вашей идеи, какой будет запись?' }, back: { uz: "Mashq yozuvi: u o'ntaga kirmaydi", ru: 'Тренировочная: она не входит в десятку' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q; birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('io-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="io-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q; uy yozuvlari qog'ozda — 9.44) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "ikki g'oyangiz auditoriyasidan", ru: 'из аудитории двух ваших идей' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "10 yozuv — har g'oyaga 5", ru: '10 записей — по 5 на идею' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Har g'oya uchun «Kim uchun» qatoridagi odamlardan beshtasini toping — 1-darsdagi qog'ozingizdan boshlang.", ru: 'Для каждой идеи найдите пятерых людей из строки «Для кого» — начните с бумаги из 1-го урока.' },
  { uz: "Har biriga shablondagi besh savolni bering: g'oyangizni faqat oxirgi savolda aytasiz.", ru: 'Задайте каждому пять вопросов шаблона: свою идею называете только в последнем вопросе.' },
  { uz: "Javobni o'sha zahoti, u aytganidek qog'ozga yozing; harakat belgisiga faqat «ha» yoki «yo'q».", ru: 'Записывайте ответ на бумагу сразу и так, как он сказал; в знак действия — только «да» или «нет».' },
  { uz: "O'nta yozuvli qog'ozni keyingi darsga olib keling — darsdagi haqiqiy yozuv ham shu o'ntaga kiradi.", ru: 'Принесите бумагу с десятью записями на следующий урок — настоящая запись с урока тоже входит в десятку.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card io-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="io-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="io-hw-q"><span className="io-hw-k">{tr(r.k)}</span><span className="io-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="io-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③', '④'][i]}</i><span>{tr(q)}</span></li>)}</ol>
    {keyingi && <span className="io-hw-keyingi">{keyingi}</span>}
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
  // «Endi siz bilasiz» — bugungi asosiy fikrni takrorlamaydi (T-048)
  const RECAP = [
    { uz: "Ikkala g'oyaga savollar bir xil — faqat 1-savolda bo'lak almashadi.", ru: 'Вопросы для обеих идей одинаковые — меняется только часть в 1-м вопросе.' },
    { uz: '«Hozir buni nima bilan hal qilyapsiz?» savoli yangi yechim nima bilan solishtirilishini ochadi.', ru: 'Вопрос «Чем вы сейчас это решаете?» открывает, с чем сравнивать новое решение.' },
    { uz: "Harakat belgisi — intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish.", ru: 'Знак действия — интерес, который человек в конце интервью показал не словом, а делом.' },
    { uz: "Sherik g'oya auditoriyasidan bo'lmasa, yozuv mashq bo'lib qoladi.", ru: 'Если партнёр не из аудитории идеи, запись остаётся тренировочной.' },
    { uz: "Airbnb asoschilari muammoni kvartiralarga o'zlari borib bilgan.", ru: 'Основатели Airbnb узнали о проблеме, сами придя в квартиры.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«O'n intervyudan keyin qaysi g'oya qoladi?»</b></>, ru: <>Следующий урок — <b>«Какая идея останется после десяти интервью?»</b></> });
  const v = intervyuLs();
  const yozuvBor = !!(v && Array.isArray(v.yozuvlar) && v.yozuvlar.length > 0);
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={yozuvBor || isMentorL
          ? tr({ uz: <>Shablon va <A>birinchi yozuvingiz</A> tayyor.</>, ru: <>Шаблон и <A>первая запись</A> готовы.</> })
          : tr({ uz: <>Shablon tayyor — <A>yozuvlar uyda</A>.</>, ru: <>Шаблон готов — <A>записи дома</A>.</> })}
        cta={<>
          <div className="io-fikr fade-up d1"><span className="io-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="io-fikr-t small">{tr({ uz: "Ikki g'oyani bir xil savollar bilan tekshirasiz; odamning qiziqishini so'zidan ko'ra ishi aniqroq ko'rsatadi.", ru: 'Две идеи вы проверяете одинаковыми вопросами; интерес человека точнее показывают его дела, чем слова.' })}</p></div>
          {!isMentorL && <ShStrip />}
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
export default function PmInterviewsOneLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === 11-Modul 3-dars — darsning o'z vizuali (prefiks io-). Faqat qolip tokenlari (D3); brend rangi — faqat nomda: Telegram #229ED9, Airbnb #FF5A5F; chizmalar ichida RANG === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .io-kul { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; line-height: 1.3; }
        .io-brend-tg { color: #229ED9; font-weight: 800; font-style: normal; }
        .io-brend-ab { color: #FF5A5F; font-weight: 800; font-style: normal; }
        /* Bosiladigan joy halqasi (SABOQ 11, 32): accent halqa doim, to'lqin ≤3% va shaffoflik ≤0.35, 2.4 s, 3 marta; kam harakatda — statik halqa */
        .io-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .io-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: io-tolqin 2.4s ease-in-out 0.4s 3; }
        .io-guruh { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .io-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: io-tolqin 2.4s ease-in-out 0.5s 3; }
        .io-halqa-i { border-color: ${T.accent} !important; animation: io-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: io-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.io-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.io-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        @keyframes io-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes io-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes io-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes io-sirg { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
        @keyframes io-yashil { 0%, 65% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { background: ${T.paper}; } }
        @keyframes io-tush { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
        @keyframes io-son { from { transform: scale(1.4); } to { transform: none; } }
        @keyframes io-chiz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes io-silk { 0%, 100% { transform: none; } 20% { transform: translateX(-8px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(3px); } }
        @keyframes io-pastga { 0% { opacity: 1; transform: none; } 30% { opacity: 1; transform: translateY(-4px); filter: grayscale(1); } 100% { opacity: 0; transform: translateY(70px) rotate(-6deg) scale(0.8); filter: grayscale(1); } }
        @keyframes io-almash { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: none; } }
        @keyframes io-xb-kir { from { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; margin-top: -5px; } to { max-height: 90px; opacity: 1; } }
        @keyframes io-chaq { 0%, 100% { opacity: 0; } 8% { opacity: 0.95; } 22% { opacity: 0; } 46% { opacity: 0; } 54% { opacity: 0.85; } 68% { opacity: 0; } }
        @keyframes io-yur { from { transform: translateX(0); } to { transform: translateX(150px); } }
        @keyframes io-qadam { from { transform: translateX(80px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes io-chiziq-svg { from { stroke-dashoffset: 120; } to { stroke-dashoffset: 0; } }
        @keyframes io-yuqori { from { transform: translateY(100%); } to { transform: none; } }
        @keyframes io-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 100% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } }
        @keyframes io-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.3)}; } }
        .io-kir { animation: io-kir 0.42s ease-out both; }
        /* --- Umumiy yorliqlar --- */
        .io-sh-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .io-sv { font-style: italic; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .io-sv.katta { font-size: clamp(15px,1.7vw,17px); font-weight: 600; }
        .io-bolak { font-style: normal; font-weight: 700; padding: 1px 6px; border-radius: 6px; }
        .io-bolak.on { background: ${T.accentSoft}; color: ${T.accent}; }
        .io-bolak.almash { display: inline-block; animation: io-almash 0.45s ease-out both; }
        .io-tag { align-self: flex-start; font-size: 11px; font-weight: 800; letter-spacing: 0.04em; padding: 3px 9px; border-radius: 99px; background: ${T.accentSoft}; color: ${T.accent}; }
        .io-tag.ok { background: ${T.okFon}; color: ${T.ok}; } .io-tag.kul { background: ${T.bg}; color: ${T.ink2}; }
        p.io-javob { margin: 2px 0 0; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; font-size: clamp(13.5px,1.5vw,15px); font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        p.io-kirq { margin: 0; font-size: 13.5px; color: ${T.ink2}; line-height: 1.45; }
        p.io-ok-q { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.okFon}; color: ${T.ok}; font-size: 13.5px; font-weight: 700; }
        p.io-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.io-nishon.ketdi { opacity: 0.75; }
        .io-amal { display: flex; justify-content: flex-end; gap: 10px; }
        .io-mnote-c { align-self: flex-end; }
        .io-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .io-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .io-mstat { display: flex; flex-wrap: wrap; gap: 10px; }
        .io-mstat-q { display: flex; align-items: baseline; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 8px 14px; }
        .io-mstat-q b { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.accent}; }
        .io-mstat-q span { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .io-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .io-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .io-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .io-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .io-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .io-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }
        .io-bash .q-bashorat { animation: io-kir 0.45s ease-out both; }
        .io-bash .q-chip { animation: io-kir 0.35s ease-out both; }
        .io-bash .q-chip:nth-child(2) { animation-delay: 0.09s; } .io-bash .q-chip:nth-child(3) { animation-delay: 0.18s; }
        .io-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .io-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: io-tolqin 2.4s ease-in-out 0.6s 3; }
        .io-bashq { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .io-bashq-t { white-space: nowrap; }
        .io-bashq-t b { color: ${T.accent}; }
        .io-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .io-tx.ok { color: ${T.ok}; }
        .io-tx b { color: ${T.ok}; }
        .io-tx b.yoq { color: ${T.err}; }
        .io-test-viz { display: flex; flex-direction: column; }
        /* --- IkkiShablon: bitta grid, har ustun — oq karta (katakchalardan) --- */
        .io-sh { --gap: 26px; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: var(--gap); width: 100%; align-items: stretch; }
        .io-sh-k { position: relative; display: flex; flex-direction: column; gap: 3px; min-width: 0; padding: 8px 14px; background: ${T.paper}; border-left: 1px solid ${T.line}; border-right: 1px solid ${T.line}; box-shadow: inset 0 1px 0 ${T.line}; animation: io-kir 0.4s ease-out both; animation-delay: calc(var(--r, 0) * 0.06s); }
        .io-sh-k.bosh { border-top: 1px solid ${T.line}; border-radius: 14px 14px 0 0; box-shadow: 0 -6px 18px -14px rgba(${T.shadowBase},0.3); padding-top: 12px; }
        .io-sh-k.oxir { border-bottom: 1px solid ${T.line}; border-radius: 0 0 14px 14px; padding-bottom: 12px; }
        .io-sh-k.bosh.oxir { border-radius: 14px; }
        .io-sh-k.faol { border-left-color: ${T.accent}; border-right-color: ${T.accent}; }
        .io-sh-k.faol.bosh { border-top-color: ${T.accent}; } .io-sh-k.faol.oxir { border-bottom-color: ${T.accent}; }
        .io-sh-k.yangi { animation: io-kir 0.4s ease-out both, io-yashil 1.3s ease-out 0.1s both; animation-delay: calc(var(--r, 0) * 0.06s), 0.1s; }
        .io-sh-k.kul { opacity: 0.6; }
        .io-sh-k.ostida { box-shadow: inset 0 1px 0 ${T.line}; background: ${T.bg}; padding-top: 10px; }
        .io-sh-nom { font-size: 14.5px; font-weight: 800; color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
        .io-sh-v { font-size: 13.5px; font-weight: 600; color: ${T.ink}; overflow-wrap: anywhere; }
        .io-sh.chiziq .io-sh-k.juft::after { content: ''; position: absolute; top: 50%; right: calc(-1 * var(--gap) - 1px); width: var(--gap); border-top: 1.5px dashed ${T.accent}; opacity: 0.6; transform-origin: left; animation: io-chiz 0.5s ease-out 0.2s both; pointer-events: none; }
        .io-sh.kichik .io-sh-k { padding: 6px 11px; } .io-sh.kichik .io-sv { font-size: 12.5px; } .io-sh.kichik .io-sh-nom { font-size: 13.5px; }
        .io-sh.kichik .io-sh-k.bosh { padding-top: 9px; } .io-sh.kichik .io-sh-k.oxir { padding-bottom: 9px; }
        .io-sh.ixcham .io-sh-k { padding-top: 5px; padding-bottom: 5px; }
        .io-qalam { position: absolute; top: 5px; right: 6px; width: 26px; height: 26px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 13px; cursor: pointer; font-family: inherit; }
        .io-qalam:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .io-bolak-y { margin-bottom: 2px; }
        .io-ozg { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ok}; }
        /* --- Yozuv joylari va kartalari --- */
        .io-joy { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .io-joy-y { font-size: 10.5px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .io-joy-y b { display: inline-block; font-family: 'JetBrains Mono', monospace; letter-spacing: 0; color: ${T.accent}; animation: io-son 0.35s ease-out; }
        .io-joy-ro { display: flex; flex-wrap: wrap; gap: 6px; }
        .io-joy-b { flex-shrink: 0; width: 30px; height: 24px; border-radius: 6px; border: 1.5px dashed ${fon(T.ink2, 0.35)}; }
        .io-joy.kir .io-joy-b { animation: io-tush 0.35s ease-out both; animation-delay: calc(0.08s * var(--i, 0)); }
        .io-joy-toliq { margin-top: 4px; animation: io-kir 0.35s ease-out both; }
        .io-yk { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-width: 0; padding: 4px 9px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: inherit; font-size: 12px; font-weight: 700; color: ${T.ink}; animation: io-tush 0.35s ease-out both; }
        button.io-yk { cursor: pointer; } button.io-yk:hover { border-color: ${T.accent}; }
        .io-yk.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .io-yk-k { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .io-belgi { flex-shrink: 0; font-size: 11.5px; font-weight: 800; padding: 1px 7px; border-radius: 5px; font-style: normal; }
        .io-belgi.ha { color: ${T.ok}; background: ${T.okFon}; } .io-belgi.yoq { color: ${T.ink2}; background: ${T.bg}; }
        .io-yt { display: flex; flex-direction: column; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.32); }
        .io-yt > .io-tag { margin: 10px 12px 0; }
        .io-yt-q { display: grid; grid-template-columns: 124px minmax(0,1fr); gap: 10px; align-items: baseline; padding: 7px 12px; border-top: 1px solid ${T.line}; }
        .io-yt-q:first-child, .io-yt > .io-tag + .io-yt-q { border-top: none; }
        .io-yt-v { font-size: 13.5px; line-height: 1.45; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
        .io-yt-q.yangi { animation: io-sirg 0.45s ease-out both, io-yashil 1.3s ease-out 0.1s both; }
        .io-yt.katta .io-yt-q { padding: 8px 16px; }
        .io-yt-q.belgi { align-items: center; }
        /* --- Odam va telefon --- */
        .io-odam { display: block; flex-shrink: 0; overflow: visible; }
        .io-tel { flex-shrink: 0; width: 170px; height: 272px; padding: 9px 7px; border-radius: 26px; background: #221D33; box-shadow: 0 16px 30px -18px rgba(${T.shadowBase},0.55); position: relative; animation: io-kir 0.4s ease-out both; }
        .io-tel-k { position: absolute; top: 4px; left: 50%; width: 46px; height: 4px; margin-left: -23px; border-radius: 3px; background: #3A3450; }
        .io-tel-e { width: 100%; height: 100%; border-radius: 19px; overflow: hidden; background: ${T.paper}; display: flex; flex-direction: column; }
        .io-tg { display: flex; flex-direction: column; height: 100%; min-height: 0; background: #EEF3F7; position: relative; }
        .io-tg-h { display: flex; align-items: center; gap: 6px; padding: 9px 10px 7px; background: ${T.paper}; border-bottom: 1px solid ${T.line}; font-size: 12px; }
        .io-tg-g { font-weight: 700; color: ${T.ink}; }
        .io-tg-g::before { content: '·'; margin-right: 6px; color: ${T.ink2}; }
        .io-tg-b { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 5px; padding: 8px; overflow: hidden; -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 26px); mask-image: linear-gradient(to bottom, transparent 0, #000 26px); }
        .io-xb { flex-shrink: 0; align-self: flex-start; max-width: 86%; padding: 6px 9px; border-radius: 4px 12px 12px 12px; background: ${T.paper}; font-size: 11.5px; line-height: 1.35; color: ${T.ink}; box-shadow: 0 1px 2px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .io-xb.men { align-self: flex-end; border-radius: 12px 4px 12px 12px; background: #DDF0FB; }
        .io-xb.plus { font-weight: 800; color: #229ED9; padding: 3px 10px; }
        .io-xb.kir { animation: io-xb-kir 0.5s ease-out var(--k, 0s) both; }
        .io-tg-k { flex-shrink: 0; display: flex; align-items: center; gap: 6px; padding: 6px 8px; background: ${T.paper}; border-top: 1px solid ${T.line}; }
        .io-tg-k i { flex: 1; height: 20px; border-radius: 10px; background: #EEF3F7; }
        .io-tg-k b { width: 20px; height: 20px; border-radius: 50%; background: #229ED9; }
        .io-stiker { display: block; width: 56px; height: 56px; }
        .io-ovozx { display: inline-flex; align-items: center; gap: 2px; }
        .io-ovozx-p { width: 14px; height: 14px; border-radius: 50%; background: #229ED9; margin-right: 4px; }
        .io-ovozx b { width: 3px; border-radius: 2px; background: #8CC7E6; }
        .io-tg-list { display: flex; flex-direction: column; background: ${T.paper}; }
        .io-tg-chat { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-bottom: 1px solid ${T.line}; font-size: 12.5px; animation: io-kir 0.35s ease-out both; animation-delay: calc(0.12s * var(--i, 0)); }
        .io-tg-av { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; color: #FFFFFF; background: #229ED9; }
        .io-tg-av.b { background: #2E9C78; }
        .io-tg-tanish { display: flex; justify-content: center; gap: 4px; padding-top: 6px; }
        .io-tg-tq { position: relative; display: inline-flex; animation: io-kir 0.4s ease-out var(--k, 0s) both; }
        .io-tg-tq i { position: absolute; top: -4px; right: -6px; width: 16px; height: 16px; border-radius: 50%; background: ${T.paper}; border: 1px solid ${T.line}; font-style: normal; font-weight: 800; font-size: 11px; line-height: 14px; text-align: center; color: ${T.accent}; }
        .io-qong { position: absolute; left: 0; right: 0; bottom: 0; height: 74%; padding: 10px; border-radius: 16px 16px 0 0; background: ${T.paper}; box-shadow: 0 -8px 20px -10px rgba(${T.shadowBase},0.35); display: flex; flex-direction: column; gap: 4px; animation: io-yuqori 0.5s ease-out both; }
        .io-qong-h { font-size: 12.5px; font-weight: 800; color: ${T.ink}; margin-bottom: 2px; }
        .io-qong-q { display: flex; align-items: center; gap: 7px; padding: 6px 4px; border-bottom: 1px solid ${T.line}; font-size: 12px; color: ${T.ink}; animation: io-kir 0.3s ease-out both; animation-delay: calc(0.45s + 0.22s * var(--i, 0)); }
        .io-qong-av { width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; }
        .io-qong-q em { margin-left: auto; display: inline-block; transform: rotate(-45deg); font-style: normal; font-weight: 800; color: ${T.ok}; }
        .io-tan { display: block; width: 100%; height: 100%; }
        .io-tan text { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; fill: ${T.accent}; }
        .io-tan-l { stroke: ${T.accent}; stroke-width: 1.5; stroke-dasharray: 4 4; opacity: 0.7; }
        .io-tan:not(.tinch) .io-tan-l { stroke-dasharray: 120; animation: io-chiziq-svg 0.7s ease-out both; animation-delay: calc(0.3s + 0.3s * var(--i, 0)); }
        .io-tan:not(.tinch) .io-tan-o { animation: io-kir 0.4s ease-out both; animation-delay: calc(0.5s + 0.3s * var(--i, 0)); }
        .io-tan:not(.tinch) .io-tan-s { animation: io-tush 0.35s ease-out both; animation-delay: calc(0.9s + 0.3s * var(--i, 0)); transform-box: fill-box; transform-origin: center; }
        /* --- 0-ekran --- */
        .io-s0 { display: contents; }
        .io-s0.tanlovsiz .q-variantlar-kol { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 16px; }
        .io-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -9px; border-radius: 20px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: io-tolqin 2.4s ease-in-out 0.7s 3; }
        .io-s0-maket { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; align-items: start; }
        .io-s0-u { display: flex; flex-direction: column; gap: 10px; animation: io-kir 0.45s ease-out both; animation-delay: calc(0.1s + 0.1s * var(--i, 0)); }
        .io-gk { display: flex; flex-direction: column; gap: 7px; min-height: 100%; padding: 14px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.32); transition: transform 0.35s ease, box-shadow 0.35s ease, opacity 0.35s ease, border-color 0.35s ease; }
        .io-gk.on { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 16px 30px -16px ${fon(T.accent, 0.5)}; transform: translateY(-4px); }
        .io-gk.xira { opacity: 0.72; }
        .io-gk-n { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .io-gk-q { display: flex; flex-direction: column; gap: 2px; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        /* --- 1-ekran (reja) --- */
        .io-rj { display: flex; flex-direction: column; }
        .io-rj-sh { max-width: 520px; }
        .io-rj-joy { display: flex; flex-wrap: wrap; gap: 6px; }
        .io-rj-y { display: inline-flex; align-items: center; gap: 5px; max-width: 100%; min-width: 0; padding: 4px 8px; border-radius: 8px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 11.5px; font-weight: 700; color: ${T.ink}; animation: io-tush 0.4s ease-out both; animation-delay: var(--d, 0s); }
        .io-rj-y b { color: ${T.ok}; font-size: 11px; }
        /* --- 2-ekran --- */
        .io-s2h { display: flex; flex-direction: column; gap: 14px; }
        .io-s2-sahna { display: flex; align-items: flex-end; gap: 12px; }
        .io-s2-karta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.4); animation: io-kir 0.4s ease-out both; }
        .io-s2-karta.silk { animation: io-silk 0.45s ease-out; border-color: ${T.err}; }
        .io-s2-karta.tush { animation: io-pastga 1.5s ease-in 0.2s both; }
        .io-s2-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.accent}; }
        .io-s2-m { font-size: clamp(15px,1.7vw,17.5px); font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .io-s2-odam { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; width: 112px; }
        .io-pufak { position: relative; max-width: 112px; padding: 7px 10px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; font-weight: 700; color: ${T.ink}; text-align: center; animation: io-tush 0.3s ease-out both; }
        .io-pufak.kut { color: ${T.ink2}; letter-spacing: 0.1em; }
        .io-s2-rol { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .io-tomonlar { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: start; }
        .io-tomon-u { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .io-tomon { width: 100%; min-height: 54px; padding: 12px 14px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-family: inherit; font-size: 14px; font-weight: 700; line-height: 1.3; cursor: pointer; transition: border-color 0.2s, transform 0.15s; }
        .io-tomon:hover:not(:disabled) { border-color: ${T.accent}; transform: translateY(-1px); }
        .io-tomon:disabled { cursor: default; opacity: 0.8; }
        .io-tomon.voqea:disabled { border-color: ${T.ok}; }
        .io-tomon-nom { align-self: center; font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 99px; }
        .io-tomon-nom.voqea { background: ${T.okFon}; color: ${T.ok}; } .io-tomon-nom.bosh { background: ${T.bg}; color: ${T.ink2}; }
        .io-tushdi { display: flex; flex-direction: column; gap: 5px; }
        .io-tushdi-k { display: flex; flex-direction: column; gap: 2px; padding: 6px 9px; border-radius: 10px; background: ${T.bg}; font-size: 11.5px; line-height: 1.35; color: ${T.ink2}; animation: io-tush 0.35s ease-out both; }
        .io-tushdi-k em { font-style: normal; font-weight: 800; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em; }
        .io-s2v { display: flex; flex-direction: column; gap: 12px; }
        /* --- 4-ekran --- */
        .io-s4 { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 22px; align-items: start; }
        .io-s4-mini { display: flex; flex-direction: column; gap: 10px; }
        .io-mini { width: 170px; height: 130px; border-radius: 14px; overflow: hidden; border: 1px solid ${T.line}; background: ${T.paper}; animation: io-tush 0.4s ease-out both; }
        .io-mini.tan { height: 150px; }
        .io-s4-y { display: flex; flex-direction: column; gap: 6px; }
        .io-s4-yk { display: flex; flex-direction: column; gap: 5px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .io-s4-yk.joriy { border-color: ${T.accent}; }
        .io-s4-yk.yangi { animation: io-yashil 1.3s ease-out both; }
        .io-s4-yk.bor { flex-direction: row; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
        .io-s4-sh { align-self: start; }
        .io-s4-hz { font-weight: 600; font-size: 12.5px; color: ${T.ink}; animation: io-sirg 0.45s ease-out both; }
        .io-s4-hz em { font-style: normal; font-weight: 800; color: ${T.ink2}; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em; }
        /* --- 5, 8, 12-ekranlar (javobdan keyin) --- */
        .io-iqt { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 10px; }
        .io-iqt-b { position: relative; display: flex; flex-direction: column; gap: 3px; padding: 10px 14px; border-radius: 4px 14px 14px 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .io-iqt-k { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; }
        .io-iqt-t { font-size: clamp(14px,1.6vw,16px); font-weight: 600; line-height: 1.4; color: ${T.ink}; }
        .io-iqt-o { font-size: 12px; color: ${T.ink2}; }
        .io-s5v { display: flex; flex-direction: column; gap: 6px; width: min(420px, 100%); padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .io-s5v-k { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .io-s5v-q { display: flex; align-items: baseline; gap: 10px; padding: 7px 10px; border-radius: 8px; background: ${T.accentSoft}; }
        .io-s5v-q b { font-size: 14px; color: ${T.accent}; }
        .io-s8v { width: min(420px, 100%); }
        .io-s12v { display: flex; align-items: center; gap: 12px; width: min(420px, 100%); padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        /* --- 6-ekran --- */
        .io-s6 { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 22px; align-items: start; }
        .io-s6.tinch { grid-template-columns: minmax(0,1fr); }
        .io-s6 .io-yt-q { padding: 5px 14px; } .io-s6 .io-yt-v { font-size: 13px; }
        .io-s6-o { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .io-s6-k { display: flex; flex-direction: column; }
        .io-s6-b { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .io-s6-ust { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; align-items: start; }
        .io-s6-u { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 6px 12px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; }
        .io-s6-u .io-joy { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 6px 10px; }
        .io-sk { display: flex; flex-direction: column; height: 100%; background: ${T.paper}; }
        .io-sk-h { padding: 11px 12px 8px; border-bottom: 1px solid ${T.line}; font-size: 13px; color: ${T.ink}; }
        .io-sk-ro { display: flex; flex-direction: column; }
        .io-sk-q { display: flex; flex-direction: column; gap: 5px; padding: 8px 10px; border-bottom: 1px solid ${T.line}; }
        .io-sk-k { font-size: 11.5px; font-weight: 800; color: ${T.ink}; }
        .io-sk-j { display: flex; gap: 5px; }
        .io-sk-b { flex: 1; min-height: 24px; border-radius: 6px; border: 1.5px dashed ${fon(T.ink2, 0.35)}; }
        .io-sk-m { flex: 1; min-width: 0; min-height: 22px; padding: 3px 5px; border-radius: 6px; background: ${T.okFon}; color: ${T.ok}; font-size: 9.5px; line-height: 1.2; font-weight: 800; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .io-sk-m.tush { animation: io-tush 0.45s cubic-bezier(.3,1.4,.5,1) 0.5s both; }
        .io-sk-hol { margin: auto 10px 10px; padding: 6px 8px; border-radius: 8px; text-align: center; font-size: 12px; font-weight: 800; animation: io-kir 0.35s ease-out 0.8s both; }
        .io-sk-hol.ok { background: ${T.okFon}; color: ${T.ok}; } .io-sk-hol.yoq { background: ${T.bg}; color: ${T.ink2}; }
        /* --- 7-ekran (Airbnb) --- */
        .io-nuq { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 7px; }
        .io-nuq-l { margin-right: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .io-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .io-nuq i.ok { background: ${T.ok}; }
        .io-nuq i.cur { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .io-nuq-k { margin-left: 8px; font-size: 12px; color: ${T.ink2}; }
        .io-voqea { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 7px; }
        .io-voqea > .zoomable { width: 100%; }
        p.io-ab-tanish { margin: 0; font-size: 13.5px; color: ${T.ink2}; }
        .io-voqea-h { font-weight: 800; font-size: clamp(16px,1.8vw,19px); color: ${T.ink}; animation: io-kir 0.35s ease-out both; }
        .io-voqea .io-bash, .io-voqea .io-bashq, .io-voqea p.q-xulosa { width: 100%; max-width: 660px; text-align: left; }
        .io-ab { display: block; width: 100%; max-width: 640px; height: auto; margin: 0 auto; border-radius: 14px; overflow: hidden; animation: io-kir 0.4s ease-out both; }
        .io-voqea .io-ab { max-width: 460px; }
        .io-ab.kichik { max-width: 420px; }
        .io-ab text { font-family: 'Manrope', sans-serif; }
        .ab-yoq-t { font-size: 11px; font-weight: 800; fill: #C2362B; }
        .ab-manzil { font-size: 10px; fill: #8A8494; }
        .ab-nom { font-size: 17px; font-weight: 800; fill: #FF5A5F; }
        .ab-eloon-t { font-size: 10.5px; font-weight: 700; fill: #3A3546; }
        .ab-xira-t { font-size: 10px; font-weight: 800; fill: #5A5466; }
        .io-ab.b0 .ab-tosh { animation: io-tush 0.45s ease-out both; animation-delay: calc(0.5s + 0.35s * var(--i, 0)); transform-box: fill-box; transform-origin: center bottom; }
        .io-ab.b0 .ab-mehmon { animation: io-qadam 1s ease-out 1.6s both; }
        .io-ab.b0 .ab-joyyoq { animation: io-tush 0.4s ease-out 0.2s both; transform-box: fill-box; transform-origin: center; }
        .io-ab.b1 .ab-yur { animation: io-yur 2.4s ease-in-out 0.3s both; }
        .io-ab .ab-chaqnash { opacity: 0; }
        .io-ab:not(.kichik).b1 .ab-chaqnash, .io-ab:not(.kichik).b2 .ab-chaqnash { animation: io-chaq 1.8s ease-out 1s both; }
        .io-ab.b2 .ab-kadr { animation: io-tush 0.5s cubic-bezier(.3,1.4,.5,1) 1.3s both; transform-box: fill-box; transform-origin: center; }
        .io-ab.kichik .ab-kadr { animation: none; }
        .io-ab.b2 .ab-kamera { animation: io-kir 0.4s ease-out 0.7s both; }
        .io-ab.b2 .ab-xira { animation: io-kir 0.4s ease-out 0.4s both; }
        /* --- 9, 10-ekranlar (mustaqil ish) --- */
        .io-s9q { display: flex; flex-direction: column; gap: 8px; }
        .q-mustaqil:has(.io-s9.tayyor), .q-mustaqil:has(.io-s10.tayyor) { max-width: none; }
        .io-s9-amal > :only-child { margin-left: auto; }
        .io-s9q ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .io-s9 { display: flex; flex-direction: column; gap: 14px; }
        .io-s9k { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.4); }
        .io-s9k-h { font-size: 14px; font-weight: 800; color: ${T.accent}; }
        .io-s9k-h b { color: ${T.ink}; }
        .io-s9-q { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .io-s9-q.err { background: ${T.errFon}; }
        .io-s9-sv { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-style: italic; font-size: 14px; color: ${T.ink}; }
        .io-inp { width: 100%; min-width: 0; padding: 9px 11px; border-radius: 9px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: inherit; font-size: 14px; color: ${T.ink}; outline: none; }
        .io-inp:focus { border-color: ${T.accent}; }
        .io-inp.bolak { width: auto; flex: 1 1 180px; font-style: normal; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; }
        .io-s9-amal { display: flex; justify-content: space-between; gap: 10px; }
        ol.io-s9-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        ol.io-s9-ro li { display: flex; align-items: baseline; gap: 8px; padding: 7px 10px; border-radius: 9px; background: ${T.bg}; }
        ol.io-s9-ro li b { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.accent}; }
        .io-s10 { display: flex; flex-direction: column; gap: 14px; }
        .io-s10k { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.4); }
        .io-s10-kim { display: flex; flex-direction: column; gap: 10px; }
        .io-s10-s { font-size: clamp(14.5px,1.6vw,16px); font-weight: 700; color: ${T.ink}; line-height: 1.4; }
        .io-s10-g { display: flex; flex-wrap: wrap; gap: 10px; width: fit-content; max-width: 100%; }
        .io-s10-gu { display: flex; flex-direction: column; gap: 4px; min-width: 0; max-width: 260px; }
        .io-s10-ku { font-size: 11.5px; color: ${T.ink2}; line-height: 1.35; }
        .io-s10-mq { display: flex; flex-wrap: wrap; gap: 8px; width: fit-content; max-width: 100%; }
        .io-s10-sv { display: flex; flex-direction: column; gap: 8px; }
        .io-s10-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.accent}; }
        .io-s10-bt { display: flex; flex-wrap: wrap; gap: 10px; width: fit-content; max-width: 100%; }
        .io-s10-yz { box-shadow: none; }
        .io-s10-og { display: flex; flex-direction: column; gap: 3px; }
        .io-s10-teg { display: flex; }
        .io-s10-mashq { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; }
        /* --- 11-ekran (kod) --- */
        .io-darvoza { display: flex; flex-direction: column; gap: 8px; }
        .io-darvoza-s { font-size: 14px; font-weight: 700; color: ${T.ink}; }
        .io-darvoza-ro { display: flex; flex-wrap: wrap; gap: 8px; width: fit-content; max-width: 100%; }
        ol.io-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; transition: opacity 0.3s; }
        ol.io-vazifa.xira { opacity: 0.5; }
        ol.io-vazifa li { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        ol.io-vazifa li i { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        ol.io-vazifa li.ok i { background: ${T.okFon}; color: ${T.ok}; }
        .io-kyordam { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .io-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .io-mgap { display: flex; align-items: flex-start; gap: 9px; padding: 9px 12px; border-radius: 4px 14px 14px 14px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        .io-mgap img { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
        .io-kod { margin: 0; padding: 12px 14px; border-radius: 12px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .io-kod-iz { color: ${CODE.comment}; font-style: italic; }
        .io-kod-b { font-weight: 500; color: ${CODE.str}; border-radius: 4px; transition: background 0.3s, color 0.3s; }
        .io-kod.ajrat .io-kod-b { background: ${T.accentSoft}; color: ${T.accent}; }
        .io-kod-natija { display: flex; flex-direction: column; gap: 6px; }
        .io-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; padding: 7px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .io-strip-l { font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.accent}; }
        .io-strip-g { font-size: 12px; font-weight: 700; color: ${T.ink}; padding: 2px 8px; border-radius: 6px; background: ${T.bg}; }
        /* --- Kartochka va yakun --- */
        .io-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: io-halqa-k 2.4s ease-in-out 0.4s 3; }
        p.io-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.io-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: io-puls 1.4s ease-out 3; }
        .io-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .io-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.io-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .io-hw { display: flex; flex-direction: column; gap: 10px; }
        .io-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .io-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .io-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .io-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.io-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.io-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.io-hw-qadam li i { flex-shrink: 0; font-style: normal; font-size: 17px; line-height: 1.3; color: ${T.accent}; }
        .io-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        @media (max-width: 760px) {
          .io-s4, .io-s6 { grid-template-columns: minmax(0,1fr); }
          .io-s4-tel, .io-s6-tel, .io-s4-mini { justify-self: center; }
          .io-s4-mini { flex-direction: row; flex-wrap: wrap; justify-content: center; }
        }
        @media (max-width: 640px) {
          .io-sh { --gap: 12px; }
          .io-sh-k { padding: 6px 8px; } .io-sh .io-sv { font-size: 12px; } .io-sh-nom { font-size: 13px; }
          .io-s0-maket, .io-tomonlar, .io-s6-ust { grid-template-columns: minmax(0,1fr); }
          .io-s2-odam { width: 84px; }
          .io-yt-q { grid-template-columns: minmax(0,1fr); gap: 2px; }
          .io-hw-karta { grid-template-columns: minmax(0,1fr); }
          .io-mini { width: 150px; }
          .io-s4-sh .io-sh-k:not(.bosh):not(.ostida):not([data-q^="hozir"]) { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lesson-root [class*="io-"], .lesson-root [class*="io-"]::after, .lesson-root [class*="ab-"] { animation: none !important; transition: none !important; }
          .io-s2-karta.tush { opacity: 0.4; }
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
