import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul · 10-dars (PM) «Odam ilovangizda qayerda to'xtab qoladi?» — kalit m7-10. Manba-haqiqat: feedback/F-1005-9modul/10-PmUsabilityTest-v3.md (GATE M).
// Skeletdan qurildi (src/skelet/NamunaDars.jsx, konveyer 04.10.2026): infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletniki;
//   kontent: s0 QKirish · s1 QReja · s2/s4/s9 QTushuncha · s3/s5/s7/s11 test (QuestionScreen → QTest) · s6 QVoqea · s8/s12 QMustaqil · s10 QKod (+ HtmlCompiler) ·
//   podium · QKartochka · QYakun (+ PM HwCard, M-q9). Bitta vizual — Sinov sahnasi (telefon «Maydon» + barmoq halqasi + hisoblagich + kuzatuv yozuvi), manba SINOV / TOXTASH.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('pm'), shadowBase: '58, 53, 48' };
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QTaxmin, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKod, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';
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

const LESSON_META = { lessonId: 'm7-10-v1', lessonTitle: { uz: "Odam ilovangizda qayerda to'xtab qoladi?", ru: 'Где человек застревает в вашем приложении?' } };
// 16 ekran · oqim: kirish → reja → sinovni kuzatish → 1-savol → yordam tajribasi → 2-savol → Internet-magazin → 3-savol → vazifa (mustaqil) → birinchi qaysi → kod → yakuniy savol → juftlikda sinov → podium → kartochkalar → yakun
// Uyga vazifa banneri fonidagi so'zlar (R-008; MD «Fon so'zlari»)
const HW_TOKENS = [
  { t: { uz: 'sinov', ru: 'тест' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'vazifa', ru: 'задание' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "to'xtash", ru: 'остановка' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'yozuv', ru: 'запись' }, l: 78, tp: 68, s: 13, d: 6.8 },
  { t: { uz: 'odam', ru: 'человек' }, l: 46, tp: 40, s: 11, d: 7.2 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0  · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1  · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2  · QTushuncha: sinovni kuzating
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 3  · 1-savol
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4  · QTushuncha: yordam bersangiz-chi?
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 5  · 2-savol
  { id: 's6',  type: 'case',        template: 'custom',   scored: false, scope: null },            // 6  · QVoqea: Internet-magazin
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 7  · 3-savol
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 8  · QMustaqil: sinov vazifasi
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 9  · QTushuncha: birinchi qaysi?
  { id: 's10', type: 'koding',      template: 'custom',   scored: false, scope: null },            // 10 · QKod
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 11 · yakuniy savol
  { id: 's12', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 12 · QMustaqil: juftlikda sinov
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },            // 13 · podium
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },            // 14 · QKartochka
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 15 · QYakun
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
  const faol = !((freeRide ? false : disabled) || locked); // SABOQ 11 (F-1005-85): yoqilgan tugma — keyingi bosiladigan joy (halqa + qisqa puls)
  return <button className={`btn-white-accent${faol ? ' ut-bos-nav' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD: s3 = 2-variant, s5 = 4, s7 = 1, s11 = 3 (yangi dars).
const INLINE_KEYS = { s3: 1, s5: 3, s7: 0, s11: 2 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3). Karta matni — MD «Qisqa takrorlash oynalari» aynan.
const RECAPS = {
  3: {
    title: { uz: 'Yozuvga nima tushadi', ru: 'Что попадает в запись' },
    cards: [
      { ic: '1', h: { uz: "Odam nima qilgani — siz ko'rgan harakat, vaqti bilan.", ru: 'Что сделал человек — действие, которое вы видели, со временем.' } },
      { ic: '2', h: { uz: 'Xulosangiz («katak kichik») yozuvga tushmaydi.', ru: 'Ваш вывод («ячейка маленькая») в запись не попадает.' } },
      { ic: '3', h: { uz: 'Bitta odamdan hamma haqida gap chiqarilmaydi.', ru: 'По одному человеку не судят обо всех.' } }
    ]
  },
  5: {
    title: { uz: 'Savolni qaytaring', ru: 'Верните вопрос' },
    cards: [
      { ic: '1', h: { uz: "Sinovda yechimni ko'rsatib bermaysiz: ko'rsatsangiz, qiyinchilik ko'rinmay qoladi.", ru: 'На тесте вы не показываете решение: если показать, трудность не будет видна.' } },
      { ic: '2', h: { uz: "Odam so'rasa: «O'zingiz qanday deb o'ylaysiz?»", ru: 'Если человек спросит: «А вы как думаете?»' } },
      { ic: '3', h: { uz: 'Jim qolsa — kutasiz va vaqtini yozasiz.', ru: 'Если он молчит — вы ждёте и записываете время.' } }
    ]
  },
  7: {
    title: { uz: 'Vazifa natijani aytadi', ru: 'Задание называет результат' },
    cards: [
      { ic: '1', h: { uz: 'Internet-magazinda vazifa bitta edi: xaridni oxiriga yetkazish.', ru: 'В интернет-магазине задание было одно: довести покупку до конца.' } },
      { ic: '2', h: { uz: "Qaysi tugmani bosish aytilmagan — shuning uchun forma to'xtash bo'lib ko'rindi.", ru: 'Какую кнопку нажать, не говорили — поэтому форма стала видна как место остановки.' } },
      { ic: '3', h: { uz: 'Vazifada odam nimaga erishishi yoziladi, qadamlar emas.', ru: 'В задании пишут, чего человек должен добиться, а не шаги.' } }
    ]
  },
  11: {
    title: { uz: "Sinovning to'rt qismi", ru: 'Четыре части теста' },
    cards: [
      { ic: '1', h: { uz: 'Vazifa berasiz.', ru: 'Вы даёте задание.' } },
      { ic: '2', h: { uz: "Yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz.", ru: 'Не объясняете путь и не показываете решение.' } },
      { ic: '3', h: { uz: "Qayerda to'xtaganini vaqti bilan yozasiz.", ru: 'Записываете, где он остановился, со временем.' } }
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

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, vizual, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
        savol={<>{tr(question)}{vizual && (isMentorLive ? (mReveal && vizual(correctIdx, true)) : (picked !== null && vizual(picked, waiting ? null : picked === correctIdx)))}</>}
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

// ===== DARSNING BITTA VIZUALI — Sinov sahnasi (SinovSahna, 163/180): telefon «Maydon» + barmoq halqasi + hisoblagich + pufaklar · kuzatuv yozuvi =====
// qolip-maket: ut-karta ut-q ut-tahrir
// Chapda telefon ramkasi (191) — «Maydon» sayti (K1 kataklar 16:00…21:00, K3 «‹ Bugun ›» kichik strelkalar, forma ostidagi tugma ekrandan pastda — tayanch 3, dars-09-done);
// ustida barmoq halqasi (CSS doira, emoji emas) va vaqt hisoblagichi (m:ss). O'ngda kuzatuv yozuvi — oq karta, «vaqt · nima qildi» qatorlari.
// Qator holati: bosh (skelet) → yangi (bir lahza ajraladi) → toxtash (accent chegara, «to'xtadi») → yozilmadi (kulrang, chizilgan) → «Birinchi» → xato (errFon).
// Manba (180): SINOV — telefon holati vaqt bo'yicha (t — Mentor sinovi, ty — s4 «ko'rsatdingiz»), TOXTASH — uch to'xtash (s2 qatori, s9 kartasi), PUFAK.
// Hammasi prefers-reduced-motion da o'tishsiz (CSS pastda).
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const cxx = (...a) => a.filter(Boolean).join(' ');
const mss = (s) => { const n = Math.max(0, Math.floor(s)); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const norm = (s) => String(s || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'").replace(/\s+/g, ' ').trim();
// P-051: mashq yakunlanganda xulosaga ~400 ms kechikish bilan silliq skroll (boshidan tugagan ekranda — yo'q)
const useXulosaSkroll = (on, boshdanTugagan) => {
  const bosh = useRef(!!boshdanTugagan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 400);
    return () => clearTimeout(t);
  }, [on]); // eslint-disable-line
};
// Tayanch 6-bo'lim: pm-m7d10-vazifa { matn } (s8 → s12) · pm-m7d10-sinov { toxtashlar: [{ vaqt, matn }], birinchi } (s9, s12 → 11-dars)
const KEY_VAZIFA = 'pm-m7d10-vazifa';
const KEY_SINOV = 'pm-m7d10-sinov';
const VAZIFA = { uz: 'Shanba kuni soat 18:00 ga maydon band qiling.', ru: 'Забронируйте поле на субботу на 18:00.' };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const YORDAM = { uz: 'Yordam', ru: 'Подсказка' };
const QOLDIR = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставить так — нажмите «Сохранить» ещё раз.' };
const OXIR = 121;   // Mentor sinovi 2:01 da tugaydi
const OXIR_Y = 30;  // s4: ko'rsatsangiz — 0:30
const SINOV = [
  { t: 0,   ty: 0,  ekran: 'bugun',  halqa: 'qidir',   nima: 'saytni ochdi', ru: 'открыл сайт' },
  { t: 25,  ty: 3,  ekran: 'shanba', halqa: 'strelka', bos: true, nima: "shanbaga o'tdi", ru: 'перешёл на субботу' },
  { t: 29,  ty: 7,  ekran: 'forma',  halqa: 'katak',   bos: true, nima: '18:00 katagini bosdi', ru: 'нажал ячейку 18:00' },
  { t: 33,  ty: 11, ekran: 'forma',  halqa: 'ism' },
  { t: 37,  ty: 15, ekran: 'forma',  halqa: 'tel' },
  { t: 41,  ty: 20, ekran: 'toldi',  halqa: 'forma',   nima: 'ism va telefonni yozdi', ru: 'ввёл имя и телефон' },
  { t: 103, ty: 23, ekran: 'band',   halqa: 'tugma',   bos: true, nima: 'Band qilish tugmasini bosdi', ru: 'нажал кнопку «Забронировать»' },
  { t: 107, ty: 27, ekran: 'tayyor', halqa: 'qara' },
  { t: 121, ty: 30, ekran: 'tayyor', halqa: 'katak',   bos: true, nima: 'katakni yana bosdi', ru: 'снова нажал ячейку' }
];
const TOXTASH = [
  { n: 1, joy: 'kun', t: 0, gacha: 25, ty: 0, vaqt: '0:00–0:25', toxtatadi: false, sakrash: 'strelka',
    yozuv: { uz: 'Bugungi kataklarni surib, shanbani qidirdi', ru: 'Листал сегодняшние ячейки, искал субботу' },
    muammo: { uz: 'Kunni almashtirishni sezmadi', ru: 'Не заметил, что день можно сменить' },
    javob: { uz: "Yo'q: 25 soniyadan keyin o'zi topdi.", ru: 'Нет: через 25 секунд нашёл сам.' },
    korsat: { uz: 'Strelkani bosing', ru: 'Нажмите на стрелку' } },
  { n: 2, joy: 'tugma', t: 41, gacha: 103, ty: 20, vaqt: '0:41–1:43', toxtatadi: true, sakrash: 'tugma',
    yozuv: { uz: "Tugmani qidirdi, «Qanday yuboriladi?» deb so'radi", ru: 'Искал кнопку, спросил: «Как отправить?»' },
    muammo: { uz: "«Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi", ru: 'Не нашёл кнопку «Забронировать» — она под формой, её не видно' },
    javob: { uz: 'Ha: tasodifan surmaganda band qila olmasdi.', ru: 'Да: если бы случайно не прокрутил, не смог бы забронировать.' },
    korsat: { uz: "Pastga suring, tugma o'sha yerda", ru: 'Прокрутите вниз, кнопка там' } },
  { n: 3, joy: 'band', t: 103, gacha: 121, ty: 27, vaqt: '1:43–2:01', toxtatadi: false, sakrash: 'katak',
    yozuv: { uz: '«Band qilindi» chiqqach, katakni yana bosdi', ru: 'После «Забронировано» снова нажал на ячейку' },
    muammo: { uz: "Band bo'lgandan keyin nima bo'lganini tushunmadi", ru: 'Не понял, что произошло после брони' },
    javob: { uz: "Yo'q: band bo'ldi, u faqat ishonmadi.", ru: 'Нет: бронь прошла, он просто не поверил.' },
    korsat: { uz: "Bo'ldi, band qilindi", ru: 'Готово, забронировано' } }
];
const PUFAK = [
  { dan: 70, gacha: 96, kim: 'oyinchi', t: { uz: 'Qanday yuboriladi?', ru: 'Как отправить?' } },
  { dan: 72, gacha: 96, kim: 'siz', t: { uz: "O'zingiz qanday deb o'ylaysiz?", ru: 'А вы как думаете?' } },
  { dan: 121, gacha: 999, kim: 'oyinchi', t: { uz: "Bo'ldimi?", ru: 'Получилось?' } }
];
const KATAKLAR = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const BAND_SHANBA = ['17:00', '20:00'];
// Halqa joyi telefon ekranida [top, left] px (ekran 156×296; «band» holatida ekran 44 px suriladi — tugma ko'rinadi)
const HALQA_JOY = { qidir: [126, 78], strelka: [43, 140], katak: [123, 78], ism: [233, 78], tel: [261, 78], forma: [247, 78], tugma: [271, 78], qara: [123, 78] };
const kadr = (t, y) => { let r = SINOV[0]; for (const s of SINOV) if ((y ? s.ty : s.t) <= t) r = s; return r; };
const faolToxtash = (t) => TOXTASH.find(s => t >= s.t && (t < s.gacha || (s.gacha === OXIR && t <= OXIR)));
const CHEGARALAR = [...new Set([...SINOV.map(s => s.t), ...TOXTASH.map(s => s.gacha), ...PUFAK.map(p => p.dan), OXIR])].sort((a, b) => a - b);
// Mentor sinovi (y=false) yoki s4 «ko'rsatdingiz» (y=true) — t paytidagi telefon holati
const telHolat = (t, y) => {
  const k = kadr(t, y);
  const kt = y ? k.ty : k.t;
  const toast = y ? (t >= 23 && t < 27) : (t >= 103 && t < 107);
  const s = y ? null : faolToxtash(t);
  return { ekran: k.ekran, halqa: k.halqa, bosKey: k.bos ? kt : null, surilish: k.ekran === 'band' ? 44 : 0, toast, aylan: !!s && ['qidir', 'forma', 'qara'].includes(k.halqa) };
};

// Telefon — «Maydon» sayti (chizilgan CSS maket; nom o'z rangida, logotip yo'q)
const MaydonTel = ({ ekran = 'bugun', halqa, aylan, bosKey, surilish = 0, toast, toastQayta, belgi, pufaklar = [], className }) => {
  const kun = ekran === 'bugun' ? { uz: 'Bugun', ru: 'Сегодня' } : { uz: 'Shanba', ru: 'Суббота' };
  const forma = ['forma', 'toldi', 'band'].includes(ekran);
  const toldi = ekran === 'toldi' || ekran === 'band';
  const joy = halqa && HALQA_JOY[halqa];
  return (
    <div className={cxx('ut-tel', className)} aria-hidden="true">
      <span className="ut-tel-kesik" />
      <div className="ut-tel-ekran">
        <div className={cxx('ut-tel-ichi', ekran === 'bugun' && aylan && 'qidir')} style={{ transform: `translateY(${-surilish}px)` }}>
          <div className="ut-m-bosh"><span className="ut-m-nom">Maydon</span></div>
          <div className={cxx('ut-m-kun', belgi === 'kun' && 'belgi')}><i>‹</i><b key={kun.uz}>{tr(kun)}</b><i>›</i></div>
          <div className="ut-m-kataklar">
            {KATAKLAR.map(k => {
              const band = ekran !== 'bugun' && (BAND_SHANBA.includes(k) || (k === '18:00' && ekran === 'tayyor'));
              return <span key={k} className={cxx('ut-m-katak', band && 'band', forma && k === '18:00' && 'tanlandi')}><b>{k}</b>{band && <i>{tr({ uz: 'band', ru: 'занято' })}</i>}</span>;
            })}
          </div>
          {forma && <div className="ut-m-forma">
            <span className={cxx('ut-m-inp', (toldi || halqa === 'tel') && 'toldi')}><i>{tr({ uz: 'Ism', ru: 'Имя' })}</i></span>
            <span className={cxx('ut-m-inp', toldi && 'toldi')}><i>{tr({ uz: 'Telefon', ru: 'Телефон' })}</i></span>
            <span className={cxx('ut-m-tugma', belgi === 'tugma' && 'belgi')}>{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</span>
          </div>}
        </div>
        {(toast || toastQayta) && <span className={cxx('ut-m-toast', toastQayta && 'qayta')}>✓ {tr({ uz: 'Band qilindi', ru: 'Забронировано' })}</span>}
        {joy && <span className={cxx('ut-halqa', aylan && 'aylan', belgi && 'belgi')} style={{ top: joy[0], left: joy[1] }}>{bosKey != null && <i key={bosKey} className="ut-halqa-bos" />}</span>}
      </div>
      {pufaklar.map((p, i) => <span key={`${p.kim}-${i}-${p.dan ?? ''}`} className={cxx('ut-pufak', p.kim)}>{tr(p.t)}</span>)}
    </div>
  );
};
// Telefon ustidagi qator: yorliq · ×5 · hisoblagich · «Yozildi: N»
const TelUst = ({ yorliq, tez, soat, accent, toxtadi, yozildi }) => (
  <div className="ut-tel-ust">
    {yorliq && <span key={yorliq} className="ut-tel-yorliq">{yorliq}</span>}
    {tez && <span className="ut-tez">×5</span>}
    {soat != null && <span className={cxx('ut-soat', accent && 'accent', toxtadi && 'toxtadi')}>{mss(soat)}</span>}
    {yozildi != null && <span className="ut-yozildi">{tr({ uz: 'Yozildi', ru: 'Записано' })}: {yozildi}</span>}
  </div>
);
const QATOR_YORLIQ = { toxtash: { uz: "to'xtadi", ru: 'застрял' }, yozilmadi: { uz: 'yozilmadi', ru: 'не записано' } };
const BIRINCHI = { uz: 'Birinchi', ru: 'Первое' };
// Yozuv qatori: { vaqt, ichi (kiritish) | matn | en (skelet eni), holat, yorliq, birinchi, yangi, ajral, ong }
const Qator = ({ q, onClick }) => {
  const ichi = <>
    <span className="ut-q-v">{q.vaqt}</span>
    {q.ichi ? q.ichi : q.matn ? <span className="ut-q-t">{q.matn}</span> : <span className="ut-skelet" style={q.en ? { maxWidth: q.en } : undefined} />}
    {q.yorliq && <span className="ut-q-y">{tr(QATOR_YORLIQ[q.yorliq])}</span>}
    {q.birinchi && <span key="bir" className="ut-q-y bir">{tr(BIRINCHI)}</span>}
    {q.ong}
  </>;
  const sinf = cxx('ut-q', q.holat, q.yangi && 'yangi', q.ajral && 'ajral');
  // bosiladigan qator ichida QChip bo'lishi mumkin — shuning uchun <button> emas, role="button" (ichma-ich tugma yo'q)
  return onClick
    ? <div role="button" tabIndex={0} className={cxx(sinf, 'bos')} onClick={onClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}>{ichi}</div>
    : <div className={sinf}>{ichi}</div>;
};
// Kuzatuv yozuvi (oq karta): nom · «Vazifa: «…»» · qatorlar · bo'sh joy (keyingi qator) · pastki xulosa-qator
const Yozuv = ({ nom, vazifa, vazifaHolat, vazifaOng, qatorlar = [], bosh = 0, oxir, holat, className, onQator, children }) => (
  <div className={cxx('ut-yozuv', holat, className)}>
    {nom && <span key={nom} className="ut-yozuv-nom">{nom}</span>}
    {vazifa !== undefined && <div className={cxx('ut-vazifa', vazifaHolat)}>
      <span>{tr({ uz: 'Vazifa', ru: 'Задание' })}: {vazifa ? <b>«{vazifa}»</b> : <span className="ut-skelet qisqa" />}</span>{vazifaOng}
    </div>}
    {(qatorlar.length > 0 || bosh > 0) && <div className="ut-qatorlar">
      {qatorlar.map((q, i) => <Qator key={q.k ?? i} q={q} onClick={onQator ? () => onQator(q, i) : undefined} />)}
      {Array.from({ length: bosh }).map((_, i) => <div key={`b${i}`} className="ut-q bosh"><span className="ut-q-v" /><span className="ut-skelet" /></div>)}
    </div>}
    {oxir && <span className="ut-yozuv-oxir">{oxir}</span>}
    {children}
  </div>
);
// Bashorat (181): tanlangach yopilmaydi — ixcham qator «Taxminingiz: N» natijagacha turadi (SABOQ 11)
const Bashorat = ({ yorliq, savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <QBashorat yorliq={yorliq} savol={savol} variantlar={variantlar} tanlov={tanlov} onTanla={onTanla} />
  : <div className="ut-taxmin-q" role="status"><span className="ut-taxmin-s">{savol}</span><span className="ut-taxmin-b">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{(variantlar.find(v => v.k === tanlov) || {}).t}</b></span></div>);
// Bir qatordan to'rt qatorgacha o'sadigan matn maydoni (DE-175)
const GrowInput = ({ value, onChange, onEnter, className, ...p }) => {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 112)}px`; }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={cxx('ut-kirit', className)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && onEnter) { e.preventDefault(); onEnter(); } }} {...p} />;
};
// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosib ochiladi
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
// Jonli dars: sinf ovozlari chizig'i (har variant va foizi; J-026 — hammaga correct: false)
const SinfOvozi = ({ live, screen, variantlar, mening }) => {
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
    <div className="ut-ovoz fade-step" aria-label={tr({ uz: 'Jonli natija', ru: 'Живой результат' })}>
      {variantlar.map((v, i) => {
        const pct = jami ? Math.round((n[i] / jami) * 100) : 0;
        return (
          <div key={i} className={cxx('ut-ovoz-q', mening === i && 'men')}>
            <span className="ut-ovoz-t">{v}</span>
            <span className="ut-ovoz-yol"><i style={{ width: `${pct}%` }} /></span>
            <span className="ut-ovoz-n">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — ikkala variantga bir xil javob, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'korsat', t: { uz: "Qayerni bosishni ko'rsataman", ru: 'Покажу, куда нажать' } },
  { id: 'jim', t: { uz: "Jim turib, nima qilishini ko'raman", ru: 'Промолчу и посмотрю, что он сделает' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [soat, setSoat] = useState(8);
  const toxtadi = picked !== null;
  // hisoblagich sekin yuradi: 0:08 → 0:12; tanlangach to'xtaydi
  useEffect(() => {
    if (toxtadi || soat >= 12 || kamHarakat()) return undefined;
    const id = setTimeout(() => setSoat(s => s + 1), 1200);
    return () => clearTimeout(id);
  }, [toxtadi, soat]);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · birinchi odam', ru: 'Введение · первый человек' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Sinfdoshingiz «Maydon»da to'xtab qoldi. <A>Nima qilasiz?</A></>, ru: <>Одноклассник застрял в «Maydon». <A>Что вы сделаете?</A></> })}
        mentor={<Mentor>{tr({ uz: "O'tgan darsda «Maydon» tayyor bo'ldi. Endi uni birinchi marta boshqa odam ishlatyapti.", ru: 'На прошлом уроке «Maydon» был готов. Теперь им впервые пользуется другой человек.' })}</Mentor>}
        maket={<div className="ut-sahna ut-s0">
          <div className="ut-tel-kol">
            <TelUst soat={soat} accent={!toxtadi} toxtadi={toxtadi} />
            <MaydonTel ekran="bugun" halqa="qidir" aylan={!toxtadi} pufaklar={toxtadi ? [{ kim: 'savol', t: { uz: "U qayerda to'xtadi?", ru: 'Где он застрял?' } }] : []} />
          </div>
          <Yozuv vazifa={tr(VAZIFA)} bosh={1} className={toxtadi ? 'yonib' : undefined} />
        </div>}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
        javob={<>
          {picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Oddiy vaziyatda yordam berish mumkin. Bugun esa saytni sinayapmiz: ko'rsatsangiz, tushunarsiz joyni ko'rmay qolasiz.", ru: 'В обычной ситуации помочь можно. Но сегодня мы тестируем сайт: если покажете, не увидите непонятное место.' })}</p>}
          {isLive && (picked !== null || isMentor) && <SinfOvozi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
        </>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda dars oxiridagi yozuv o'zi yoziladi — javob ochilmaydi, matn kulrang chiziq; o'ngda «01 · matn · teg») =====
const REJA = [
  { t: { uz: "Odam qayerda to'xtashini kuzatib, yozasiz", ru: 'Наблюдаете, где человек застревает, и записываете' }, teg: { uz: 'kuzatish', ru: 'наблюдение' } },
  { t: { uz: "Yordam bersangiz, yozuvda nima qolishini ko'rasiz", ru: 'Увидите, что останется в записи, если помогать' }, teg: { uz: 'yordam', ru: 'помощь' } },
  { t: { uz: 'Odamga beriladigan vazifani yozasiz', ru: 'Пишете задание для человека' }, teg: { uz: 'vazifa', ru: 'задание' } },
  { t: { uz: 'Sinfdoshingiz bilan bir-biringizni kuzatasiz', ru: 'С одноклассником наблюдаете друг за другом' }, teg: { uz: 'juftlik', ru: 'пара' } }
];
const REJA_QATOR = [
  { vaqt: '0:00', en: '62%' },
  { vaqt: '0:14', en: '74%', toxtadi: true },
  { vaqt: '0:31', en: '48%' },
  { vaqt: '0:58', en: '66%', toxtadi: true, birinchi: true }
];
const RejaYozuv = () => {
  const [n, setN] = useState(() => (kamHarakat() ? 5 : 1));
  useEffect(() => { if (n >= 5) return undefined; const id = setTimeout(() => setN(k => k + 1), 900); return () => clearTimeout(id); }, [n]);
  return <Yozuv className="ut-reja-yozuv" qatorlar={REJA_QATOR.slice(0, Math.min(n, 4)).map((q, i) => ({ k: i, vaqt: q.vaqt, en: q.en, holat: q.toxtadi ? 'toxtash' : undefined, yorliq: q.toxtadi ? 'toxtash' : null, birinchi: n >= 5 && q.birinchi, yangi: true }))} />;
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun odam <A>qayerda to'xtashini</A> ko'rib, yozasiz.</>, ru: <>Сегодня вы увидите и запишете, <A>где человек застревает</A>.</> })}
      mentor={<Mentor>{tr({ uz: 'Saytni o\'zingiz qurgansiz — qayerni bosishni bilasiz. Uni birinchi marta ochgan odam bilmaydi.', ru: 'Сайт вы построили сами — знаете, куда нажимать. Человек, который открыл его впервые, этого не знает.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida — shunday yozuv: odam nima qildi va qayerda to'xtadi", ru: 'В конце урока — такая запись: что делал человек и где застрял' })}
      chap={<RejaYozuv />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — SINOVNI KUZATING (QTushuncha: bashorat → ×5 ijro → o'quvchi har to'xtashni yozadi → «Kuzatuv yozuvi» / «Sinov» nomi → xulosa; nishon silentObserver) =====
// Bosish to'xtash oynasida — qator; harakat paytida — QXato; to'xtash yozilmay o'tib ketsa — sinov shu joyda pauza qiladi, tugma pulsda.
// reduced-motion: ijro o'zi yurmaydi — «Keyingi ›» bilan qadam-baqadam (KOD 5).
const S2_TAXMIN = [{ k: '1', t: '1' }, { k: '2', t: '2' }, { k: '3', t: '3' }];
const S2_XATO = {
  harakat: { uz: "Hozir u to'g'ri yo'lda ketyapti — bu to'xtash emas.", ru: 'Сейчас он идёт верным путём — это не остановка.' },
  otdi: { uz: "Bu yerda u qiynaldi — to'xtashni yozing.", ru: 'Здесь ему было трудно — запишите остановку.' }
};
const yozuvQatorlari = (nlar, yangi) => TOXTASH.filter(x => nlar.includes(x.n)).map(x => ({ k: x.n, vaqt: x.vaqt, matn: tr(x.yozuv), holat: 'toxtash', yorliq: 'toxtash', yangi: yangi === x.n }));
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const kam = useMemo(kamHarakat, []);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [t, setT] = useState(storedAnswer ? OXIR : 0);
  const [yur, setYur] = useState(false);
  const [boshlandi, setBoshlandi] = useState(!!storedAnswer);
  const [yoz, setYoz] = useState(() => (storedAnswer ? [1, 2, 3] : []));
  const [yangi, setYangi] = useState(null);
  const [xato, setXato] = useState(null);
  const [pauza, setPauza] = useState(null);
  const otganRef = useRef(!!storedAnswer);
  const missRef = useRef(false);
  const tRef = useRef(t); tRef.current = t;
  const yozRef = useRef(yoz); yozRef.current = yoz;
  const done = t >= OXIR && yoz.length === 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const ilgari = (n) => {
    const p = tRef.current;
    const otdi = TOXTASH.find(s => !yozRef.current.includes(s.n) && p < s.gacha && n >= s.gacha);
    if (otdi) {
      const q = Math.max(p, otdi.gacha - 0.5);
      tRef.current = q; setT(q); setYur(false); setPauza(otdi.n); setXato('otdi');
      if (!missRef.current) { missRef.current = true; if (achMiss && !otganRef.current) achMiss.miss(screen); }
      return;
    }
    tRef.current = n; setT(n);
    if (n >= OXIR) setYur(false);
  };
  const ilgariRef = useRef(ilgari); ilgariRef.current = ilgari;
  useEffect(() => {
    if (!yur || kam) return undefined;
    const id = setInterval(() => ilgariRef.current(Math.min(OXIR, tRef.current + 0.5)), 100);
    return () => clearInterval(id);
  }, [yur, kam]);
  useEffect(() => {
    if (!done || otganRef.current) return;
    otganRef.current = true;
    onAnswer(screen, { stage: 'kuzatish', screenIdx: screen, correct: !missRef.current, picked: true, solved: true, taxmin, yozildi: 3 });
  }, [done]); // eslint-disable-line
  useEffect(() => { if (xato !== 'harakat') return undefined; const id = setTimeout(() => setXato(x => (x === 'harakat' ? null : x)), 2500); return () => clearTimeout(id); }, [xato]);
  const boshla = () => { setBoshlandi(true); setYur(true); setXato(null); };
  const keyingi = () => ilgari(CHEGARALAR.find(c => c > tRef.current) ?? OXIR);
  const yozish = () => {
    const s = faolToxtash(tRef.current);
    if (!s) { setXato('harakat'); return; }
    if (yoz.includes(s.n)) return;
    setYoz(v => [...v, s.n]); setYangi(s.n); setXato(null);
    if (pauza === s.n) { setPauza(null); setYur(true); }
  };
  const qayta = () => { tRef.current = 0; setT(0); setYoz([]); setYur(false); setBoshlandi(false); setPauza(null); setXato(null); setYangi(null); };
  const h = telHolat(t, false);
  const s = boshlandi ? faolToxtash(t) : null;
  const pufaklar = boshlandi ? PUFAK.filter(p => t >= p.dan && t < p.gacha) : [];
  const otildi = done || otganRef.current;
  const vizual = (
    <div className="ut-sahna">
      <div className="ut-tel-kol">
        <TelUst tez={!done} yorliq={done ? tr({ uz: 'Sinov', ru: 'Тест' }) : null} soat={t} accent={!!s && !done} yozildi={done ? null : yoz.length} />
        <MaydonTel {...h} aylan={boshlandi && !kam && h.aylan && !done} bosKey={boshlandi ? h.bosKey : null} pufaklar={pufaklar} />
      </div>
      <div className="ut-yozuv-kol">
        <Yozuv nom={done ? tr({ uz: 'Kuzatuv yozuvi', ru: 'Запись наблюдения' }) : null} vazifa={tr(VAZIFA)} qatorlar={yozuvQatorlari(yoz, yangi)} bosh={done ? 0 : 1} />
        {!tugadi && taxmin && !done && <div className="ut-amal">
          {!boshlandi && <QTugma className="ut-bos" onClick={boshla}>{tr({ uz: 'Sinovni boshlash', ru: 'Начать тест' })}</QTugma>}
          {boshlandi && kam && <QTugma ikkinchi onClick={keyingi} disabled={!!pauza}>{tr({ uz: 'Keyingi ›', ru: 'Дальше ›' })}</QTugma>}
          {boshlandi && <QTugma key={pauza ? `p${pauza}` : 'y'} className={pauza ? 'ut-bos' : undefined} disabled={!!s && yoz.includes(s.n)} onClick={yozish}>{tr({ uz: "To'xtashni yozish", ru: 'Записать остановку' })}</QTugma>}
        </div>}
        {xato && !done && <QXato key={xato}>{tr(S2_XATO[xato])}</QXato>}
      </div>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · kuzatish', ru: 'Понятие · наблюдение' })} screen={screen} scrollSignal={(taxmin ? 1 : 0) + (boshlandi ? 2 : 0) + (done ? 4 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!otildi && !isMentor} label={otildi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !boshlandi ? tr({ uz: 'Sinovni boshlang', ru: 'Начните тест' }) : `${tr({ uz: "To'xtashlarni yozing", ru: 'Записывайте остановки' })} (${tr({ uz: 'Yozildi', ru: 'Записано' })}: ${yoz.length})`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>O'yinchi «Maydon»da <A>qayerda to'xtaydi?</A></>, ru: <>Где игрок <A>застрянет в «Maydon»?</A></> })}
        mentor={<Mentor>{tr({ uz: "2-darsda odamdan bo'lib o'tgan ishini so'ragansiz. Bugun so'ramaysiz: o'yinchi vazifani bajaradi, siz har to'xtashini yozasiz.", ru: 'На 2-м уроке вы спрашивали человека о том, что уже было. Сегодня не спрашиваете: игрок выполняет задание, а вы записываете каждую его остановку.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "O'yinchi necha marta to'xtaydi?", ru: 'Сколько раз игрок застрянет?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={vizual}
        natija={done && <div className="ut-natija">
          {taxmin && <QTaxmin togri={taxmin === '3'}>{taxmin === '3'
            ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>3</b></>}</QTaxmin>}
          <QTugma ikkinchi onClick={qayta}>{tr({ uz: '↻ Qaytadan', ru: '↻ Заново' })}</QTugma>
        </div>}
        xulosa={done && tr({ uz: "Real odam saytni o'zi ishlatadi, siz kuzatasiz — bu sinov deyiladi. Intervyuda so'raysiz, sinovda ko'rasiz.", ru: 'Реальный человек сам пользуется сайтом, а вы наблюдаете — это называется тестом. На интервью вы спрашиваете, на тесте — видите.' })}
      >
        <MentorNote>{tr({ uz: "AvtoPizza botida «qayerda to'xtab qoldingiz?» deb so'ragan edingiz — bugun javobni odamning o'zidan emas, uning harakatidan olasiz. Sinfga savol: «Siz o'yinchining o'rnida qayerda to'xtardingiz?»", ru: 'В боте AvtoPizza вы спрашивали «где вы застряли?» — сегодня ответ вы берёте не из слов человека, а из его действий. Вопрос классу: «Где бы вы застряли на месте игрока?»' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1). Tanlagach savol ostida kichik yozuv-qatori: to'g'ri — yashil, xato — errFon =====
const MiniQator = ({ matn, ok }) => <div className={cxx('ut-mini', ok === true && 'ok', ok === false && 'xato')}><span className="ut-q-t">{matn}</span></div>;
const S3_OPTS = [
  { uz: '0:40 · 18:00 katagi juda kichik ekan', ru: '0:40 · ячейка 18:00 оказалась слишком маленькой' },
  { uz: '0:40 · Katakka qarab turdi, bosmadi', ru: '0:40 · Смотрел на ячейку, не нажал' },
  { uz: '0:40 · Odamlar kataklarni tushunmaydi', ru: '0:40 · Люди не понимают ячейки' },
  { uz: "0:40 · Sayt unga yoqmagan bo'lsa kerak", ru: '0:40 · Наверное, сайт ему не понравился' }
];
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · kuzatuv yozuvi', ru: 'Проверка · запись наблюдения' })}
    vizual={(i, ok) => <MiniQator matn={tr(S3_OPTS[i])} ok={ok} />}
    questionText="Sinfdoshingiz 18:00 katagi oldida to'xtadi. Yozuvga nima yoziladi?"
    question={tr({ uz: <h2 className="title h-ask">Sinfdoshingiz 18:00 katagi oldida to'xtadi. <A>Yozuvga nima yoziladi?</A></h2>, ru: <h2 className="title h-ask">Одноклассник застрял перед ячейкой 18:00. <A>Что пишется в запись?</A></h2> })}
    options={S3_OPTS} correctIdx={1}
    explainCorrect={{ uz: "Yozuvga u nima qilgani tushadi — siz ko'rgan harakat.", ru: 'В запись попадает то, что он сделал, — действие, которое вы видели.' }}
    explainWrong={{
      0: { uz: 'Kichikligi — sizning xulosangiz. U nima qildi?', ru: 'Что она маленькая — ваш вывод. Что он сделал?' },
      2: { uz: 'Bitta odamdan hamma haqida gap chiqmaydi.', ru: 'По одному человеку нельзя судить обо всех.' },
      3: { uz: 'Bu sizning fikringiz: u buni aytmadi ham, qilmadi ham.', ru: 'Это ваше мнение: он этого не говорил и не делал.' },
      default: { uz: "Odam nima qilganini toping — ko'rgan harakatingizni.", ru: 'Найдите, что сделал человек, — действие, которое вы видели.' }
    }} />
);

// ===== SCREEN 4 — YORDAM BERSANGIZ-CHI? (QTushuncha: bashorat → o'sha sinov qayta yuradi, har to'xtashda pauza + «Ko'rsatish» (N/3) → ikki yozuv yonma-yon) =====
// Ko'rsatilganda: telefon ustida sizning pufagingiz, halqa shu zahoti kerakli joyga o'tadi, hisoblagich 2–3 soniyada davom etadi; yozuv qatori kulrang va chizilgan — «yozilmadi».
// «0 to'xtash» — bu simulyatsiyada (audit 2). «Kutdingiz» yozuvi TOXTASH dan to'liq (s2 qatorlari bir xil).
const S4_TAXMIN = [{ k: '0', t: '0' }, { k: '1', t: '1' }, { k: '3', t: '3' }];
const TOXT_SON = { uz: "to'xtash", ru: 'остановок' };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [t, setT] = useState(storedAnswer ? OXIR_Y : 0);
  const [yur, setYur] = useState(false);
  const [korsat, setKorsat] = useState(storedAnswer ? 3 : 0);
  const [pufak, setPufak] = useState(null);
  const tRef = useRef(t); tRef.current = t;
  const kRef = useRef(korsat); kRef.current = korsat;
  const done = t >= OXIR_Y && korsat === 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const otganRef = useRef(!!storedAnswer);
  // bashorat tanlangach sinov o'zi qayta yuradi
  useEffect(() => {
    if (!taxmin || otganRef.current || tRef.current > 0) return undefined;
    const id = setTimeout(() => setYur(true), 700);
    return () => clearTimeout(id);
  }, [taxmin]);
  useEffect(() => {
    if (!yur) return undefined;
    const id = setInterval(() => {
      const p = tRef.current;
      const s = TOXTASH.find(x => x.n === kRef.current + 1);
      if (s && p >= s.ty) { setYur(false); return; }
      let n = p + 0.25;
      if (s && n > s.ty) n = s.ty;
      n = Math.min(OXIR_Y, n);
      tRef.current = n; setT(n);
      if (n >= OXIR_Y) setYur(false);
    }, 100);
    return () => clearInterval(id);
  }, [yur]);
  useEffect(() => {
    if (!done || otganRef.current) return;
    otganRef.current = true;
    onAnswer(screen, { stage: 'yordam', screenIdx: screen, correct: true, picked: true, solved: true, taxmin });
  }, [done]); // eslint-disable-line
  const kut = !done && TOXTASH.find(x => x.n === korsat + 1 && t >= x.ty);
  const korsatish = () => {
    if (!kut) return;
    setKorsat(korsat + 1); setPufak({ n: kut.n, dan: t }); setYur(true);
  };
  const h = telHolat(t, true);
  const ust = TOXTASH.find(x => korsat >= x.n && t >= x.ty && t < x.ty + 3);
  const halqa = ust ? ust.sakrash : h.halqa;
  const surilish = (ust && ust.joy === 'tugma') || h.ekran === 'band' ? 44 : 0;
  const pufaklar = pufak && t < pufak.dan + 3 ? [{ kim: 'siz', t: TOXTASH[pufak.n - 1].korsat, dan: pufak.dan }] : [];
  const yozilmadi = TOXTASH.filter(x => x.n <= korsat).map(x => ({ k: x.n, vaqt: mss(x.ty), matn: tr(x.yozuv), holat: 'yozilmadi', yorliq: 'yozilmadi', yangi: !done }));
  const nomK = tr({ uz: "Ko'rsatdingiz", ru: 'Вы показали' });
  const vizual = done
    ? <div className="ut-ikki">
        <Yozuv nom={tr({ uz: 'Kutdingiz', ru: 'Вы ждали' })} vazifa={tr(VAZIFA)} qatorlar={yozuvQatorlari([1, 2, 3])} oxir={`3 ${tr(TOXT_SON)} · ${mss(OXIR)}`} />
        <Yozuv nom={nomK} vazifa={tr(VAZIFA)} qatorlar={yozilmadi} oxir={`0 ${tr(TOXT_SON)} · ${mss(OXIR_Y)}`} />
      </div>
    : <div className="ut-sahna">
        <div className="ut-tel-kol">
          <TelUst soat={t} accent={!!kut} />
          <MaydonTel ekran={h.ekran} halqa={halqa} aylan={!!kut && ['qidir', 'forma', 'qara'].includes(halqa)} bosKey={h.bosKey} surilish={surilish} toast={h.toast} pufaklar={pufaklar} />
        </div>
        <div className="ut-yozuv-kol">
          <Yozuv nom={nomK} vazifa={tr(VAZIFA)} qatorlar={yozilmadi} bosh={korsat < 3 ? 1 : 0} />
          {!tugadi && kut && <div className="ut-amal"><QTugma key={`k${kut.n}`} className="ut-bos" onClick={korsatish}>{tr({ uz: "Ko'rsatish", ru: 'Показать' })} ({kut.n}/3)</QTugma></div>}
        </div>
      </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · yordam', ru: 'Опыт · помощь' })} screen={screen} scrollSignal={(taxmin ? 1 : 0) + korsat + (done ? 8 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !otganRef.current && !isMentor} label={done || otganRef.current || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Har to'xtashda ko'rsating", ru: 'Показывайте на каждой остановке' })} (${korsat}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Yordam bersangiz, <A>yozuvda nima qoladi?</A></>, ru: <>Если помогать, <A>что останется в записи?</A></> })}
        mentor={<Mentor>{tr({ uz: "Bu safar o'yinchi to'xtagan har joyda unga yo'lni ko'rsating. Keyin ikki yozuvni solishtiring.", ru: 'На этот раз в каждом месте, где игрок застрял, покажите ему путь. Потом сравните две записи.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Ko'rsatsangiz, yozuvda nechta to'xtash qoladi?", ru: 'Если показывать, сколько остановок останется в записи?' })} variantlar={S4_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={vizual}
        natija={done && taxmin && <QTaxmin togri={taxmin === '0'}>{taxmin === '0'
          ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
          : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>0</b></>}</QTaxmin>}
        xulosa={done && tr({ uz: "Ko'rsatsangiz, odam tezroq davom etadi, lekin o'sha joyni o'zi topa olarmidi — buni bilmay qolasiz.", ru: 'Если показать, человек пойдёт дальше быстрее, но вы так и не узнаете, нашёл бы он это место сам.' })}
      >
        <MentorNote>{tr({ uz: "Ko'rsatish yomon odat emas — darsda bir-biringizga yordam berasiz. Faqat sinov paytida yordam to'xtash joyini yashiradi.", ru: 'Показывать — не плохая привычка: на уроке вы помогаете друг другу. Только во время теста помощь прячет место остановки.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 3) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · yechimni ko'rsatmaysiz", ru: 'Проверка · не показываете решение' })}
    questionText="O'yinchi so'radi: «Endi nimani bosaman?» Nima deysiz?"
    question={tr({ uz: <h2 className="title h-ask">O'yinchi so'radi: «Endi nimani bosaman?» <A>Nima deysiz?</A></h2>, ru: <h2 className="title h-ask">Игрок спросил: «Что теперь нажать?» <A>Что вы ответите?</A></h2> })}
    options={[
      { uz: "«Pastga suring, tugma o'sha yerda»", ru: '«Прокрутите вниз, кнопка там»' },
      { uz: '«Avval kunni, keyin vaqtni tanlaysiz»', ru: '«Сначала выбираете день, потом время»' },
      { uz: "«Bering, bu joyini o'zim qilaman»", ru: '«Дайте, это место я сделаю сам»' },
      { uz: "«O'zingiz qanday deb o'ylaysiz?»", ru: '«А вы как думаете?»' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Savol unga qaytdi — u o'zi qidiradi, siz to'xtashni yozasiz.", ru: 'Вопрос вернулся к нему — он ищет сам, а вы записываете остановку.' }}
    explainWrong={{
      0: { uz: "Bu yordam: tugmani o'zi topishi endi bilinmaydi.", ru: 'Это помощь: теперь не узнать, нашёл бы он кнопку сам.' },
      1: { uz: "Bu tushuntirish: u qayerda to'xtashi yozilmay qoladi.", ru: 'Это объяснение: где он застрял бы, так и не запишется.' },
      2: { uz: "Siz qilsangiz, to'xtash yozuvga tushmaydi.", ru: 'Если сделаете вы, остановка не попадёт в запись.' },
      default: { uz: 'Javob bermang — savolni unga qaytaring.', ru: 'Не отвечайте — верните вопрос ему.' }
    }} />
);

// ===== SCREEN 6 — INTERNET-MAGAZIN (QVoqea, PM-028: nuqtalar · bosqich nomi + FormaMaket · 3/6 va 5/6 da bashorat, S-015) =====
// Manba (o'quvchi ko'rmaydi; MD A-7, 05.10.2026 ochib tekshirilgan): Jared M. Spool, «The $300 Million Button», 14.01.2009 —
//   https://articles.centercentre.com/three_hund_million_button/ · forma «Email Address, Password, Login, Register, Forgot Password»; natija: xaridorlar 45% ko'p,
//   birinchi oy +15 mln $, birinchi yil +300 mln $. Magazin nomi maqolada yo'q — sahnada ham yo'q (logotip, nom chizilmaydi).
// SABOQ 8 (qaror 81 A): bosqich gapini Mentor aytadi (har bosqichda almashadi), sahnada bosqich nomi va jonli maket.
//   MD dagi Mentor gapi (Jared Spool izohi, S-018) — 1/6 da sahnada bir qatorli tanishtiruv bo'lib turadi (1-dars DbTanishuv naqshi).
const MAGAZIN = [
  { h: { uz: 'Xarid oxirida — oddiy forma', ru: 'В конце покупки — обычная форма' }, m: { uz: "Savatni to'ldirib, xaridga o'tgan odam forma ko'rardi: email, parol, «Kirish», «Ro'yxatdan o'tish» va «Parolni unutdingizmi?».", ru: 'Человек, наполнивший корзину и перешедший к покупке, видел форму: email, пароль, «Войти», «Регистрация» и «Забыли пароль?».' } },
  { h: { uz: "Sinov: ro'yxat va pul", ru: 'Тест: список и деньги' }, m: { uz: "Tadqiqotchilar odamlarga xarid ro'yxati va pul berishdi. Vazifa bitta edi: xaridni oxiriga yetkazish.", ru: 'Исследователи дали людям список покупок и деньги. Задание было одно: довести покупку до конца.' } },
  { bashorat: 'a', savol: { uz: "Formaga yetgan odamlar bilan nima bo'ldi?", ru: 'Что стало с людьми, дошедшими до формы?' }, togri: 'tosiq',
    variantlar: [{ k: 'yoq', t: { uz: "Forma ularni to'xtatmadi", ru: 'Форма их не остановила' } }, { k: 'ikki', t: { uz: "Ba'zilari formada ikkilandi", ru: 'Некоторые засомневались на форме' } }, { k: 'tosiq', t: { uz: "Forma xaridga to'siq bo'ldi", ru: 'Форма стала преградой для покупки' } }] },
  { h: { uz: "Kuzatuvda nima ko'rindi", ru: 'Что показало наблюдение' }, m: { uz: "Yangi xaridorlar ro'yxatdan o'tishni xohlamadi. Bittasi aytdi: «Men bu yerga tanishgani kelmadim. Shunchaki xarid qilmoqchiman.» Oldin kelganlarning ko'pi parolini eslay olmadi.", ru: 'Новые покупатели не хотели регистрироваться. Один сказал: «Я пришёл сюда не знакомиться. Я просто хочу купить.» Многие из тех, кто приходил раньше, не помнили пароль.' } },
  { bashorat: 'b', savol: { uz: "Dizaynerlar formada nimani o'zgartirdi?", ru: 'Что дизайнеры изменили в форме?' }, togri: 'tugma',
    variantlar: [{ k: 'tugma', t: { uz: 'Bitta tugmaning yozuvini almashtirdi', ru: 'Сменили надпись на одной кнопке' } }, { k: 'olib', t: { uz: 'Formani butunlay olib tashladi', ru: 'Полностью убрали форму' } }, { k: 'qayta', t: { uz: 'Saytni boshidan qayta qurdi', ru: 'Пересобрали сайт с нуля' } }] },
  { h: { uz: 'Bitta tugma', ru: 'Одна кнопка' }, m: { uz: "«Ro'yxatdan o'tish» o'rniga «Davom etish» qo'yildi va bitta gap: xarid uchun ro'yxatdan o'tish shart emas. Xarid qilgan mijozlar soni 45% oshdi, birinchi yilda magazin qo'shimcha 300 million dollar oldi.", ru: 'Вместо «Регистрация» поставили «Продолжить» и одну фразу: для покупки регистрация не нужна. Число покупателей выросло на 45%, за первый год магазин получил дополнительно 300 миллионов долларов.' } }
];
const MAG_N = MAGAZIN.length;
// FormaMaket (PM-029): chizilgan brauzer oynasi — savat · forma (ikki qator, ikki tugma, bitta havola) · ro'yxat-karta va pul · halqa · pufaklar · «+45%» ustun
const FormaMaket = ({ b }) => {
  const davom = b >= 5;
  return (
    <div className={`ut-fm b${b}`} role="img" aria-label={tr({ uz: 'Internet-magazin formasi', ru: 'Форма интернет-магазина' })}>
      <div className="ut-fm-oyna">
        <span className="ut-fm-bar"><i /><i /><i /><span className="ut-fm-url" /></span>
        <div className="ut-fm-ichi">
          <div className="ut-fm-savat"><b>{tr({ uz: 'Savat', ru: 'Корзина' })}</b><i /><i /><i /><span className="ut-fm-jami" /></div>
          <div className="ut-fm-forma">
            <span className="ut-fm-l">Email</span><span className="ut-fm-inp" />
            <span className="ut-fm-l">{tr({ uz: 'Parol', ru: 'Пароль' })}</span><span className="ut-fm-inp parol" />
            <span className="ut-fm-tugmalar">
              <span className="ut-fm-t">{tr({ uz: 'Kirish', ru: 'Войти' })}</span>
              <span key={davom ? 'd' : 'r'} className={cxx('ut-fm-t', 'asosiy', davom && 'yangi')}>{davom ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ro'yxatdan o'tish", ru: 'Регистрация' })}</span>
            </span>
            {davom && <span className="ut-fm-gap">{tr({ uz: "Xarid uchun ro'yxatdan o'tish shart emas.", ru: 'Для покупки регистрация не нужна.' })}</span>}
            <span className="ut-fm-havola">{tr({ uz: 'Parolni unutdingizmi?', ru: 'Забыли пароль?' })}</span>
          </div>
          {b >= 1 && b <= 4 && <span className={cxx('ut-halqa', 'ut-fm-halqa', b >= 3 && 'aylan')} />}
          {b === 3 && <>
            <span className="ut-pufak oyinchi ut-fm-p1">{tr({ uz: 'Shunchaki xarid qilmoqchiman.', ru: 'Я просто хочу купить.' })}</span>
            <span className="ut-pufak oyinchi ut-fm-p2">••••• ?</span>
          </>}
        </div>
      </div>
      {b >= 1 && b <= 4 && <div className="ut-fm-royxat"><b>{tr({ uz: "Xarid ro'yxati", ru: 'Список покупок' })}</b><i /><i /><i /><span className="ut-fm-pul">$</span></div>}
      {davom && <div className="ut-fm-ustun" aria-hidden="true"><span className="ut-fm-u oldin" /><span className="ut-fm-u keyin"><b>+45%</b></span></div>}
    </div>
  );
};
const BASHORAT_MENTOR = { uz: "Avval o'zingiz belgilab ko'ring.", ru: 'Сначала отметьте сами.' };
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? MAG_N - 1 : 0);
  const [taxmin, setTaxmin] = useState(() => storedAnswer?.taxmin || {});
  const done = b >= MAG_N - 1;
  const bq = MAGAZIN[b];
  const kutish = !!bq.bashorat && !taxmin[bq.bashorat];
  useXulosaSkroll(done, storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const keyingi = () => { if (b < MAG_N - 1) setB(b + 1); else onNext(); };
  const yorliq = `${tr({ uz: 'Internet-magazin', ru: 'Интернет-магазин' })} · ${b + 1}/${MAG_N}`;
  const tx = bq.bashorat && taxmin[bq.bashorat];
  const txV = tx && bq.variantlar.find(v => v.k === tx);
  const toV = bq.bashorat && bq.variantlar.find(v => v.k === bq.togri);
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={b < MAG_N - 1 ? `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/${MAG_N})` : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Internet-magazin xaridorlari <A>qayerda to'xtab qolgan?</A></>, ru: <>Где <A>застревали покупатели</A> интернет-магазина?</> })}
        nuqtalar={<>
          {/* SABOQ 8: bosqich gapi Mentorda, har bosqichda almashadi (QVoqea da mentor slot yo'q — nuqtalar slotida) */}
          <Mentor key={`m${b}`}>{tr(bq.bashorat ? BASHORAT_MENTOR : bq.m)}</Mentor>
          <div className="ut-nuqtalar"><span className="ut-nuq-l">{yorliq}</span>{MAGAZIN.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="ut-voqea" key={b}>
          {bq.h && <span className="ut-voqea-h">{tr(bq.h)}</span>}
          <Zoomable>
            <div className="ut-fm-w">
              {b === 0 && <span className="ut-tanish"><b>Jared Spool</b> — {tr({ uz: "odamlar saytni qanday ishlatishini o'rganadigan tadqiqotchi. Bu voqeani u 2009-yilda yozgan, magazin nomini aytmagan.", ru: 'исследователь, который изучает, как люди пользуются сайтами. Эту историю он описал в 2009 году, название магазина не назвал.' })}</span>}
              <FormaMaket b={b} />
            </div>
          </Zoomable>
          {bq.bashorat && <QBashorat yorliq={yorliq} savol={tr(bq.savol)}
            variantlar={bq.variantlar.map(v => ({ k: v.k, t: tx === v.k ? `${v.k === bq.togri ? '✓' : '✗'} ${tr(v.t)}` : tr(v.t) }))} tanlov={tx || null} onTanla={(k) => setTaxmin(p => ({ ...p, [bq.bashorat]: k }))} />}
          {txV && <QTaxmin togri={tx === bq.togri}>{tx === bq.togri
            ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(txV.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(toV.t)}</b></>}</QTaxmin>}
          {done && <QXulosa>{tr({ uz: "Vazifada qaysi tugmani bosish aytilmagan — shuning uchun formadagi to'xtash ko'rindi.", ru: 'В задании не говорили, какую кнопку нажать, — поэтому остановка на форме стала видна.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Raqamlar maqoladan (45% — xarid qilgan mijozlar soni, maqolada «The number of customers purchasing went up by 45%»; 15 mln $ — birinchi oy; 300 mln $ — birinchi yil). Magazin nomini taxmin qilmang — maqolada yo'q.", ru: 'Цифры из статьи (45% — число покупателей, в статье «The number of customers purchasing went up by 45%»; 15 млн $ — первый месяц; 300 млн $ — первый год). Название магазина не угадывайте — в статье его нет.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0; keys qoidasi «Maydon» egasiga) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Internet-magazindagidek', ru: 'Проверка · как в интернет-магазине' })}
    questionText="Internet-magazindagidek: maydon egasiga qaysi vazifani berasiz?"
    question={tr({ uz: <h2 className="title h-ask">Internet-magazindagidek: maydon egasiga <A>qaysi vazifani berasiz?</A></h2>, ru: <h2 className="title h-ask">Как в интернет-магазине: <A>какое задание вы дадите</A> владельцу поля?</h2> })}
    options={[
      { uz: '«Ertaga kim band qilganini bilib oling»', ru: '«Узнайте, кто забронировал на завтра»' },
      { uz: '«Kirishni bosib, parolingizni yozing»', ru: '«Нажмите «Войти» и введите пароль»' },
      { uz: '«Ega sahifasi sizga yoqdimi, ayting»', ru: '«Скажите, понравилась ли вам страница владельца»' },
      { uz: "«Ro'yxat qayerdaligini o'zim ko'rsataman»", ru: '«Я сам покажу, где список»' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Vazifa natijani aytadi — qayerni bosishni ega o\'zi topadi.', ru: 'Задание называет результат — куда нажать, владелец найдёт сам.' }}
    explainWrong={{
      1: { uz: "Bu qadamlarni aytadi: to'xtash ko'rinmay qoladi.", ru: 'Это называет шаги: остановка не будет видна.' },
      2: { uz: "Bu fikr so'raydi: ega bajaradigan ish yo'q.", ru: 'Это спрашивает мнение: владельцу нечего выполнять.' },
      3: { uz: "Ko'rsatsangiz, ega qayerda to'xtashini bilmaysiz.", ru: 'Если покажете, не узнаете, где владелец застрянет.' },
      default: { uz: 'Ega nimaga erishishi kerakligini toping.', ru: 'Найдите, чего должен добиться владелец.' }
    }} />
);

// ===== SCREEN 8 — MUSTAQIL ISH (QMustaqil): o'z saytingiz uchun sinov vazifasi · artefakt pm-m7d10-vazifa (s12, uyga vazifa) · nishon taskGiver =====
// Tekshiruv (PM-032): faqat bo'sh qator bloklaydi; qadam so'zi, fikr so'rash, qisqa gap — maslahat (ikkinchi «Saqlash» saqlaydi). «tanlab», «bosib o'tib» bloklanmaydi.
const RE_QADAM = /(^|[^a-z'\u0400-\u04ff])(bosing|tugma[a-z']*|kata[kg][a-z']*|menyu[a-z']*|oching|tanlang|\u043d\u0430\u0436\u043c\u0438\u0442\u0435|\u043a\u043d\u043e\u043f\u043a[\u0430-\u044f]*|\u044f\u0447\u0435\u0439\u043a[\u0430-\u044f]*|\u043c\u0435\u043d\u044e|\u043e\u0442\u043a\u0440\u043e\u0439\u0442\u0435|\u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435)(?=$|[^a-z'\u0400-\u04ff])/;
const RE_FIKR = /\?|yoqdimi|qanday ekan|\u043d\u0440\u0430\u0432\u0438\u0442\u0441\u044f|\u043a\u0430\u043a \u0432\u0430\u043c/;
const tekshir8 = (v) => { const n = norm(v); if (!n) return 'bosh'; if (RE_FIKR.test(n)) return 'fikr'; if (RE_QADAM.test(n)) return 'qadam'; if (n.length < 15) return 'qisqa'; return null; };
const XABAR8 = {
  bosh: { uz: 'Odam nimaga erishsin — shuni yozing.', ru: 'Чего должен добиться человек — это и напишите.' },
  qadam: { uz: "Bu gap maqsadni aytyaptimi yoki yo'lni ham ko'rsatyaptimi?", ru: 'Эта фраза называет цель или ещё и показывает путь?' },
  fikr: { uz: "Bu fikr so'raydi. Odam bajaradigan ishni yozing.", ru: 'Это спрашивает мнение. Напишите дело, которое человек выполнит.' },
  qisqa: { uz: "Vazifa to'liq gap bo'lsin: nima va qachon.", ru: 'Пусть задание будет полной фразой: что и когда.' }
};
const SizTel = () => (
  <div className="ut-tel kichik" aria-hidden="true"><span className="ut-tel-kesik" /><div className="ut-tel-ekran"><div className="ut-siz-sk"><b /><i /><i /><i /><span /></div></div></div>
);
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [vazifa, setVazifa] = useState(() => { const v = lsGet(KEY_VAZIFA); return v && v.matn ? v.matn : null; });
  const [tahrir, setTahrir] = useState(false);
  const [val, setVal] = useState('');
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const yuborildi = useRef(!!storedAnswer);
  const saqlandi = !!vazifa && !tahrir;
  useXulosaSkroll(saqlandi, storedAnswer || saqlandi);
  const saqla = () => {
    const tur = tekshir8(val);
    if (tur === 'bosh' || (tur && !(xato && xato.tur === tur && xato.v === val))) { setXato({ tur, v: val }); return; }
    const matn = val.trim();
    setVazifa(matn); lsSet(KEY_VAZIFA, { matn }); setXato(null); setTahrir(false);
    onAnswer(screen, { stage: 'vazifa', screenIdx: screen, practice: 'vazifa', matn, correct: !tur, picked: true, solved: true });
    if (!yuborildi.current && live && live.mode === 'student') { yuborildi.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
  };
  const tahrirla = () => { setTahrir(true); setVal(vazifa || ''); setXato(null); };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={saqlandi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!vazifa && !isMentor} label={vazifa || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Vazifani yozing', ru: 'Напишите задание' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Odamga <A>maqsadni</A> qanday aytasiz?</>, ru: <>Как сказать человеку <A>цель</A>?</> })}
        mentor={<Mentor>{tr({ uz: "«Qilamiz» ro'yxatingizdagi asosiy ishni oling. Vazifada odam nimaga erishishini yozing — qayerni bosishni emas.", ru: 'Возьмите главное дело из своего списка «делаем». В задании напишите, чего человек должен добиться, — а не куда нажимать.' })}</Mentor>}
        forma={<div className="ut-s8">
          {!saqlandi && <QIzoh>{tr({ uz: "Saytingiz hali ishlamasa, «Maydon» bilan davom eting.", ru: 'Если ваш сайт ещё не работает, продолжайте с «Maydon».' })}</QIzoh>}
          <div className="ut-sahna">
            {!saqlandi && <div className="ut-tel-kol"><TelUst yorliq={tr({ uz: 'Sizning saytingiz', ru: 'Ваш сайт' })} /><SizTel /></div>}
            <div className="ut-yozuv-kol">
            <Yozuv holat={saqlandi ? 'saqlandi' : undefined} vazifa={saqlandi ? vazifa : null} vazifaHolat={xato ? 'xato' : saqlandi ? 'ok' : undefined}
              vazifaOng={saqlandi && !isMentor && <button type="button" className="ut-tahrir" onClick={tahrirla} aria-label={tr({ uz: 'Tahrirlash', ru: 'Изменить' })} title={tr({ uz: 'Tahrirlash', ru: 'Изменить' })}>✎</button>} />
            {!saqlandi && !isMentor && <div className={cxx('ut-yozish', xato && 'xato', !val && 'chorla')}>
              <GrowInput value={val} onChange={e => setVal(e.target.value)} onEnter={saqla} placeholder={tr({ uz: 'Odam nimaga erishsin?', ru: 'Чего должен добиться человек?' })} maxLength={160} aria-label={tr({ uz: 'Sinov vazifasi', ru: 'Задание для теста' })} />
              {xato && <div className="ut-xato"><QXato key={`${xato.tur}-${xato.v}`}>{tr(XABAR8[xato.tur])}</QXato>{xato.tur !== 'bosh' && <QIzoh>{tr(QOLDIR)}</QIzoh>}</div>}
              <div className="ut-amal"><QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma><QTugma className={val.trim() ? 'ut-bos' : undefined} onClick={saqla}>{tr(SAQLASH)}</QTugma></div>
            </div>}
            </div>
          </div>
        </div>}
        yordam={!saqlandi && !isMentor && yordam && <QIzoh>{tr({ uz: "«Maydon» vazifasida qaysi tugmani bosish yo'q — faqat natija bor: kun, soat va band qilish. Saytingizda odam oxirida nimaga ega bo'ladi? Shuni yozing.", ru: 'В задании «Maydon» нет, какую кнопку нажать, — есть только результат: день, час и бронь. Что человек получит в конце на вашем сайте? Это и напишите.' })}</QIzoh>}
      >
        {saqlandi && <QXulosa>{tr({ uz: "Vazifangiz tayyor. Uni sinfdoshingizga o'qib berasiz — qolganini u o'zi qiladi.", ru: 'Ваше задание готово. Вы прочитаете его однокласснику — остальное он сделает сам.' })}</QXulosa>}
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — BIRINCHI QAYSI? (QTushuncha: 1-bosqich — karta bosilsa telefonda o'sha joy, ostida savol va javob · 2-bosqich — «Birinchi» uyasi (sig'im 1); nishon firstFix) =====
// Kartalar akkordeon emas: bosish → telefon holati o'zgaradi (DE-184). Tanlov o'quvchiniki (S-008): kun/band ham saqlanadi, Mentor tanlovi yonida ko'rsatiladi.
// Saqlanadi: pm-m7d10-sinov { toxtashlar: [{ vaqt, matn }], birinchi } — birinchi = toxtashlar indeksi (11-dars shu tanlov bilan boshlanadi).
const S9_TEL = {
  kun: { ekran: 'bugun', halqa: 'strelka', belgi: 'kun' },
  tugma: { ekran: 'toldi', surilish: 19, belgi: 'tugma' },
  band: { ekran: 'tayyor', toastQayta: true }
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [korildi, setKorildi] = useState(() => (storedAnswer ? TOXTASH.map(x => x.joy) : []));
  const [joriy, setJoriy] = useState(storedAnswer?.birinchi ?? null);
  const [birinchi, setBirinchi] = useState(storedAnswer?.birinchi ?? null);
  const birRef = useRef(storedAnswer?.birinchi ?? null);
  const bosqich2 = korildi.length >= 3;
  const done = !!birinchi;
  const tugadi = useTugadi(done, 1500, !!storedAnswer);
  useXulosaSkroll(tugadi, storedAnswer);
  const kor = (x) => { setJoriy(x.joy); if (!korildi.includes(x.joy)) setKorildi(k => [...k, x.joy]); };
  const tanla = (x) => {
    setBirinchi(x.joy); setJoriy(x.joy);
    lsSet(KEY_SINOV, { toxtashlar: TOXTASH.map(y => ({ vaqt: y.vaqt, matn: ou(y.yozuv) })), birinchi: TOXTASH.findIndex(y => y.joy === x.joy) });
    if (birRef.current === null) birRef.current = x.joy;
    onAnswer(screen, { stage: 'birinchi', screenIdx: screen, picked: x.joy, birinchi: x.joy, correct: birRef.current === 'tugma', solved: true });
  };
  const almashtir = () => { setBirinchi(null); };
  const fokus = birinchi || joriy;
  const tel = fokus ? S9_TEL[fokus] : { ekran: 'bugun' };
  const jx = TOXTASH.find(x => x.joy === joriy);
  const qatorlar = TOXTASH.map(x => ({ k: x.n, vaqt: x.vaqt, matn: tr(x.yozuv), holat: 'toxtash', yorliq: 'toxtash', ajral: x.joy === fokus, birinchi: x.joy === birinchi }));
  const karta = (x, rejim) => {
    const ok = korildi.includes(x.joy);
    return (
      <button key={x.joy} type="button" className={cxx('ut-karta', ok && 'korildi', x.joy === joriy && !bosqich2 && 'joriy', rejim)} onClick={() => (bosqich2 ? (!done && tanla(x)) : kor(x))} disabled={rejim === 'keyin'}>
        <span className="ut-karta-v">{x.vaqt}</span>
        <span className="ut-karta-t">{tr(x.muammo)}</span>
        {!bosqich2 && <span className="ut-karta-b" aria-hidden="true">{ok ? '✓' : '›'}</span>}
      </button>
    );
  };
  const harakat = !tugadi && <div className="ut-s9">
    {!bosqich2 && <>
      <div className="ut-kartalar chorla">{TOXTASH.map(x => karta(x))}</div>
      {jx && <div className="ut-qa fade-step" key={jx.joy}><span className="ut-qa-s">{tr({ uz: "Bu to'xtash vazifani to'xtatadimi?", ru: 'Эта остановка мешает выполнить задание?' })}</span><span className={cxx('ut-qa-j', jx.toxtatadi && 'ha')}>{tr(jx.javob)}</span></div>}
    </>}
    {bosqich2 && <>
      <span className="ut-qa-s">{tr({ uz: 'Birinchi tuzatiladiganini tanlang', ru: 'Выберите, что исправлять первым' })}</span>
      <div className="ut-uya"><span className="ut-uya-l">{tr(BIRINCHI)}</span>{birinchi ? karta(TOXTASH.find(x => x.joy === birinchi), 'tanlandi') : <span className="ut-uya-bosh" aria-hidden="true" />}</div>
      {!birinchi && <div className="ut-kartalar tanla">{TOXTASH.map(x => karta(x))}</div>}
      {birinchi && <div className="ut-keyin"><span className="ut-uya-l">{tr({ uz: 'Keyin', ru: 'Потом' })}</span>{TOXTASH.filter(x => x.joy !== birinchi).map(x => karta(x, 'keyin'))}</div>}
    </>}
  </div>;
  const vizual = (
    <div className="ut-sahna">
      <div className="ut-tel-kol"><MaydonTel {...tel} /></div>
      <Yozuv nom={tr({ uz: 'Kuzatuv yozuvi', ru: 'Запись наблюдения' })} vazifa={tr(VAZIFA)} qatorlar={qatorlar} />
    </div>
  );
  const JOY_SOZ = { kun: { uz: 'kun', ru: 'день' }, tugma: { uz: 'tugma', ru: 'кнопка' }, band: { uz: 'band', ru: 'бронь' } };
  return (
    <Stage eyebrow={tr({ uz: 'Mashq · birinchi tuzatiladigan', ru: 'Упражнение · что исправлять первым' })} screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !bosqich2 ? `${tr({ uz: "Uch kartani ko'ring", ru: 'Посмотрите три карточки' })} (${korildi.length}/3)` : tr({ uz: 'Birinchisini tanlang', ru: 'Выберите первое' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Qaysi to'xtash <A>birinchi tuzatiladi?</A></>, ru: <>Какую остановку <A>исправить первой?</A></> })}
        mentor={<Mentor>{tr({ uz: "Yozuvdagi har to'xtash ortida bitta muammo bor. Uchalasini ko'rib, birinchisini o'zingiz tanlang.", ru: 'За каждой остановкой в записи стоит одна проблема. Посмотрите все три и выберите первую сами.' })}</Mentor>}
        harakat={harakat}
        vizual={vizual}
        natija={done && birinchi !== 'tugma' && <div className="ut-natija">
          <QTaxmin togri={false}>{tr({ uz: 'Tanlovingiz', ru: 'Ваш выбор' })}: {tr(JOY_SOZ[birinchi])} · {tr({ uz: 'Mentor tanlovi', ru: 'Выбор Ментора' })}: <b>{tr(JOY_SOZ.tugma)}</b> — {tr({ uz: "usiz band qilib bo'lmaydi.", ru: 'без неё не забронировать.' })}</QTaxmin>
          <QTugma ikkinchi onClick={almashtir}>{tr({ uz: 'Tanlovni almashtirish', ru: 'Изменить выбор' })}</QTugma>
        </div>}
        xulosa={done && tr({ uz: "Bu sinovda vazifani tugatishga to'sqinlik qilgan to'xtashdan boshlaymiz. Qolgan ikkitasi navbatda turadi.", ru: 'В этом тесте начинаем с остановки, которая мешала закончить задание. Остальные две ждут своей очереди.' })}
      >
        <MentorNote>{tr({ uz: "Tanlovni sinfda muhokama qiling: «Kun» ham, «band» ham haqiqiy muammo — faqat vazifani to'xtatmaydi. Tugmani tuzatish — keyingi dars ishi.", ru: 'Обсудите выбор с классом: и «день», и «бронь» — настоящие проблемы, просто они не останавливают задание. Починить кнопку — работа следующего урока.' })}</MentorNote>
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 10 — KOD YOZISH (QKod + HtmlCompiler; darvoza-mashq PM-082 c/e; kod nusxalanmaydi PM-082 d; «kompilyator» ta'riflanmaydi) =====
// Harakatlar — SINOV dan (faqat bosish/yozish qatorlari, 180). Shartlar xulq-atvorga bog'langan (manba-regex emas): for ham, reduce ham o'tadi; starter holatida uchalasi qizil.
const HARAKATLAR = SINOV.filter(s => s.nima);
const harakatQatorlari = (ru) => HARAKATLAR.map((h, i) => `  { t: ${(h.t + ',').padEnd(5)}nima: ${JSON.stringify(ru ? h.ru : h.nima)} }${i < HARAKATLAR.length - 1 ? ',' : ''}`).join('\n');
const KOD_STARTER = { uz: `// O'yinchining harakatlari: t — sinov boshidan necha soniya o'tgani
const harakatlar = [
${harakatQatorlari(false)}
];

function toxtashlar(royxat, chegara) {
  // ikki harakat orasi chegaradan uzun bo'lsa — to'xtash
  return [];   // shu joyni siz yozasiz
}

console.log(toxtashlar(harakatlar, 15));
// ["saytni ochdi: 25 soniya", "ism va telefonni yozdi: 62 soniya", "Band qilish tugmasini bosdi: 18 soniya"]
console.log(toxtashlar(harakatlar, 60));
// ["ism va telefonni yozdi: 62 soniya"]
console.log(toxtashlar([], 15));
// []`,
  ru: `// Действия игрока: t — сколько секунд прошло с начала теста
const harakatlar = [
${harakatQatorlari(true)}
];

function toxtashlar(royxat, chegara) {
  // если между двумя действиями прошло больше порога — это остановка
  return [];   // это место пишете вы
}

console.log(toxtashlar(harakatlar, 15));
// ["открыл сайт: 25 soniya", "ввёл имя и телефон: 62 soniya",
//  "нажал кнопку «Забронировать»: 18 soniya"]
console.log(toxtashlar(harakatlar, 60));
// ["ввёл имя и телефон: 62 soniya"]
console.log(toxtashlar([], 15));
// []` };
const KOD_DATA = `[${HARAKATLAR.map(h => `{t:${h.t},nima:${JSON.stringify(h.nima)}}`).join(',')}]`;
const KOD_VAZIFA = [
  { uz: "Funksiya ro'yxat (massiv) qaytaradi", ru: 'Функция возвращает список (массив)' },
  { uz: "Ikki harakat orasi chegaradan uzun bo'lsa, ro'yxatga qator tushadi", ru: 'Если между двумя действиями больше порога, в список попадает строка' },
  { uz: 'Uchala `console.log` kutilgandek chiqdi', ru: 'Все три `console.log` вывели ожидаемое' }
];
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: 'app.js — toxtashlar funksiyasini yakunlang', ru: 'app.js — допишите функцию toxtashlar' },
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: "// to'xtashlarni yig'ib qaytaring", ru: '// соберите и верните остановки' } }],
  requirements: [
    { id: 'royxat', label: KOD_VAZIFA[0],
      check: C.evalEquals(`(function(){var a=toxtashlar(${KOD_DATA},15);return (Array.isArray(a)&&a.length===3)?"ha":"yoq";})()`, 'ha', { uz: "Funksiya ro'yxat qaytarsin: chegara 15 da uchta qator.", ru: 'Функция должна вернуть список: при пороге 15 — три строки.' }) },
    { id: 'qator', label: KOD_VAZIFA[1],
      check: C.evalEquals(`(function(){var a=toxtashlar(${KOD_DATA},15);if(!Array.isArray(a))return "";return a.join("|").replace(/секунд[а-я]*/g,"soniya");})()`, 'saytni ochdi: 25 soniya|ism va telefonni yozdi: 62 soniya|Band qilish tugmasini bosdi: 18 soniya', { uz: "Har qator «harakat: N soniya» ko'rinishida bo'lsin.", ru: 'Каждая строка — в виде «действие: N soniya».' }) },
    { id: 'uch', label: { uz: 'Uchala console.log kutilgandek chiqdi', ru: 'Все три console.log вывели ожидаемое' },
      check: C.evalEquals(`(function(){var b=toxtashlar([],15),c=toxtashlar(${KOD_DATA},60);if(!Array.isArray(b)||!Array.isArray(c))return "";return b.length+"/"+c.join("|").replace(/секунд[а-я]*/g,"soniya");})()`, '0/ism va telefonni yozdi: 62 soniya', { uz: "Bo'sh ro'yxatga — bo'sh; chegara 60 da faqat bitta qator.", ru: 'Для пустого списка — пустой; при пороге 60 — только одна строка.' }) }
  ]
};
const KOD_DARVOZA = [
  { id: '41', ok: false, x: { uz: '41 — birinchi harakat vaqti. Ikkalasining farqini toping.', ru: '41 — время первого действия. Найдите разницу между ними.' } },
  { id: '62', ok: true },
  { id: '103', ok: false, x: { uz: '103 — ikkinchi harakat vaqti. 103 dan 41 ni ayiring.', ru: '103 — время второго действия. Вычтите 41 из 103.' } }
];
// Kod namunasi (o'qish uchun; nusxalanmaydi): darvozadan keyin t: 41 va t: 103 qatorlari bir lahza ajraladi, orasida «62» chizig'i
const KodNamuna = ({ ajrat }) => (
  <pre className={cxx('ut-kod', ajrat && 'ajrat')} onCopy={(e) => e.preventDefault()} aria-label="app.js">
    {tr(KOD_STARTER).split('\n').slice(0, 15).map((l, i) => {
      if (l.trim().startsWith('//')) return <span key={i} className="ut-kod-izoh">{l}{'\n'}</span>;
      const m = /^(\s*\{ t: )(41|103)(,.*)$/.exec(l);
      if (!m) return <span key={i}>{l}{'\n'}</span>;
      return <span key={i} className="ut-kod-q">{m[1]}<b className="ut-kod-t">{m[2]}</b>{m[3]}{m[2] === '41' && ajrat && <span className="ut-kod-62">62</span>}{'\n'}</span>;
    })}
  </pre>
);
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — o'quvchi matni emas, qolip API nomi (1-dars naqshi, MEXANIZM-TAKLIF 10).
const QKOD_ONG = 'muh\u0061rrir';
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [gpick, setGpick] = useState(() => (storedAnswer ? '62' : null));
  const [miss, setMiss] = useState(null);
  const [ajrat, setAjrat] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = !!gpick || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 2600); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) { setGpick(g.id); setMiss(null); setAjrat(true); }
    else setMiss({ id: g.id, k: Date.now() });
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
  const darvoza = (
    <div className="ut-darvoza">
      <span className="ut-darvoza-s">{tr({ uz: 'Harakatlar 41 va 103-soniyada. Orasida necha soniya o\'tdi?', ru: 'Действия на 41-й и 103-й секунде. Сколько секунд прошло между ними?' })}</span>
      <div className="ut-tanlov">
        {KOD_DARVOZA.map(g => {
          const silk = miss && miss.id === g.id;
          return <QChip key={silk ? `${g.id}-${miss.k}` : g.id} silk={silk} holat={gpick === g.id ? 'ok' : undefined} disabled={stage2 && gpick !== g.id} onClick={() => pickGate(g)}><span className="mono">{g.id}</span></QChip>;
        })}
      </div>
      {miss && <QXato>{tr(KOD_DARVOZA.find(g => g.id === miss.id).x)}</QXato>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish', ru: 'Пишем код' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Farqni toping', ru: 'Найдите разницу' }) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>To'xtashlarni topadigan <A>kod</A> yozamiz.</>, ru: <>Пишем <A>код</A>, который находит остановки.</> })}
        mentor={<Mentor>{!stage2
          ? tr({ uz: "2-ekranda to'xtashni ko'zingiz bilan topdingiz, endi kod harakatlar orasidagi uzun tanaffusni belgilaydi. Bu — ehtimoliy to'xtash: muammo ekanini siz kuzatuv bilan tekshirasiz.", ru: 'На 2-м экране вы нашли остановки глазами, теперь код отметит длинную паузу между действиями. Это — возможная остановка: проблема ли это, вы проверяете наблюдением.' })
          : tr({ uz: "Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Нажмите кнопку — откроется окно кода: вы пишете код и сразу видите результат здесь.' })}</Mentor>}
        vazifa={<>
          {darvoza}
          {stage2 && <ol className="ut-kvazifa">{KOD_VAZIFA.map((v, i) => <li key={i}><i>{i + 1}</i><span>{fmtCode(tr(v))}</span></li>)}</ol>}
        </>}
        yordam={stage2 && <div className="ut-yordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM)}</QTugma>
          {yordam && <>
            <QIzoh>{fmtCode(tr({ uz: "Qo'shni ikki harakatni oling: `royxat[i]` va `royxat[i + 1]`. Orasi — `royxat[i + 1].t - royxat[i].t`. Ishlagach `for` bilan hammasini aylanib chiqing.", ru: 'Возьмите два соседних действия: `royxat[i]` и `royxat[i + 1]`. Разница — `royxat[i + 1].t - royxat[i].t`. Когда заработает, обойдите все через `for`.' }))}</QIzoh>
            <QIzoh>{fmtCode(tr({ uz: "Eslatma (JavaScript darslaridan): `for` — bir ishni ro'yxat bo'ylab takrorlaydi · `push` — ro'yxat oxiriga qo'shadi · `console.log` — qiymatni ekranga chiqaradi.", ru: 'Напоминание (из уроков JavaScript): `for` — повторяет действие по списку · `push` — добавляет в конец списка · `console.log` — выводит значение на экран.' }))}</QIzoh>
          </>}
        </div>}
        {...{ [QKOD_ONG]: <div className="ut-kodoyna">
          <KodNamuna ajrat={ajrat} />
          {stage2 && <div className="ut-amal"><QTugma className={!done && !isMentor ? 'ut-bos' : undefined} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma></div>}
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), .hc-root ham o'zi qo'yadi — qobiq tashqi zoomni bekor qiladi (PmLesson25 naqshi). */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m7d10-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s11 = 2; qoidaning to'rt qismi birga) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Qaysi sinov qoidaga to'liq mos o'tkazildi?"
    question={tr({ uz: <h2 className="title h-ask">Qaysi sinov <A>qoidaga to'liq mos</A> o'tkazildi?</h2>, ru: <h2 className="title h-ask">Какой тест проведён <A>полностью по правилу</A>?</h2> })}
    options={[
      { uz: 'Saytni tushuntirib, keyin vazifa berdi', ru: 'Объяснил сайт, потом дал задание' },
      { uz: "Vazifa berdi, to'xtaganda tugmani ko'rsatdi", ru: 'Дал задание, при остановке показал кнопку' },
      { uz: "Vazifa berdi, jim kuzatib, to'xtashni yozdi", ru: 'Дал задание, молча наблюдал, записал остановку' },
      { uz: "Saytni ko'rsatib, «yoqdimi?» deb so'radi", ru: 'Показал сайт и спросил «понравилось?»' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Vazifa berildi, tushuntirilmadi, yordam berilmadi va to'xtash yozildi.", ru: 'Задание дано, ничего не объяснили, не помогали, и остановка записана.' }}
    explainWrong={{
      0: { uz: "Oldindan tushuntirsangiz, to'xtash joylari yo'qoladi.", ru: 'Если объяснить заранее, места остановок пропадут.' },
      1: { uz: "Ko'rsatish — yordam: to'xtash yozuvdan yo'qoladi.", ru: 'Показать — это помощь: остановка исчезает из записи.' },
      3: { uz: "Bu fikr so'rash: sinovda odam vazifa bajaradi.", ru: 'Это спросить мнение: на тесте человек выполняет задание.' },
      default: { uz: "To'rt qismni tekshiring: vazifa, tushuntirish, yordam, yozuv.", ru: 'Проверьте четыре части: задание, объяснение, помощь, запись.' }
    }} />
);

// ===== SCREEN 12 — JUFTLIKDA SINOV (QMustaqil, 3 qadam): vazifani o'qib bering → to'xtashlarni yozing (3 daqiqa) → birinchisini belgilang · artefakt pm-m7d10-sinov · nishon pairTester =====
const S12_QADAM = [{ uz: "Vazifani o'qib bering", ru: 'Прочитайте задание' }, { uz: "To'xtashlarni yozing", ru: 'Запишите остановки' }, { uz: 'Birinchisini belgilang', ru: 'Отметьте первое' }];
const RE_XULOSA = /(^|[^a-z'\u0400-\u04ff])(yomon|noqulay|chalkash|kerak|\u043f\u043b\u043e\u0445\u043e|\u043d\u0435\u0443\u0434\u043e\u0431\u043d[\u0430-\u044f]*|\u0437\u0430\u043f\u0443\u0442\u0430\u043d\u043d[\u0430-\u044f]*|\u043d\u0443\u0436\u043d\u043e|\u043d\u0430\u0434\u043e)(?=$|[^a-z'\u0400-\u04ff])/;
const XABAR12 = { bosh: { uz: 'Odam nima qilganini yozing.', ru: 'Напишите, что сделал человек.' }, xulosa: { uz: 'Bu xulosa. Odam nima qilganini yozing.', ru: 'Это вывод. Напишите, что сделал человек.' } };
const PAIR_S = 180;
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const jonli = !!(live && (live.mode === 'student' || live.mode === 'mentor'));
  const vazifa = useMemo(() => { const v = lsGet(KEY_VAZIFA); return !isMentor && v && v.matn ? v.matn : tr(VAZIFA); }, [isMentor]);
  const [qadam, setQadam] = useState(storedAnswer ? 3 : 0);
  const [soniya, setSoniya] = useState(0);
  const [yur, setYur] = useState(false);
  const [qatorlar, setQatorlar] = useState(() => storedAnswer?.qatorlar || []);
  const [birinchi, setBirinchi] = useState(storedAnswer?.birinchiId ?? null);
  const [yoq, setYoq] = useState(!!storedAnswer?.yoq);
  const [xato, setXato] = useState(null);
  const [tahrir, setTahrir] = useState(null);
  const idRef = useRef(qatorlar.length);
  const yuborildi = useRef(!!storedAnswer);
  const done = qadam >= 3 && tahrir === null;
  useXulosaSkroll(done, storedAnswer);
  useEffect(() => {
    if (!yur) return undefined;
    if (soniya >= PAIR_S) { setYur(false); return undefined; }
    const id = setTimeout(() => setSoniya(s => s + 1), 1000);
    return () => clearTimeout(id);
  }, [yur, soniya]);
  const boshla = () => { setSoniya(0); setYur(true); setQadam(1); setYoq(false); setXato(null); };
  const yozish = () => { const id = ++idRef.current; setQatorlar(q => [...q, { id, vaqt: mss(soniya), matn: '', ha: null }]); setXato(null); };
  const ozgar = (id, v) => setQatorlar(q => q.map(r => (r.id === id ? { ...r, matn: v } : r)));
  // Qatorlar tekshiruvi: bo'sh — bloklaydi; xulosa so'zi — maslahat (ikkinchi bosish o'tkazadi)
  const tekshir = (royxat) => {
    for (const r of royxat) {
      const n = norm(r.matn);
      if (!n) return { id: r.id, tur: 'bosh' };
      if (RE_XULOSA.test(n) && !(xato && xato.id === r.id && xato.tur === 'xulosa' && xato.v === r.matn)) return { id: r.id, tur: 'xulosa', v: r.matn };
    }
    return null;
  };
  const belgila = () => { const x = tekshir(qatorlar); if (x) { setXato(x); return; } setXato(null); setYur(false); setQadam(2); };
  const bolmadi = () => { setYur(false); setYoq(true); setQatorlar([]); setBirinchi(null); setQadam(2); setXato(null); };
  const saqla = () => {
    if (!yoq && qatorlar.length && birinchi === null) { setXato({ tur: 'birinchi' }); return; }
    if (tahrir !== null) { const x = tekshir(qatorlar.filter(r => r.id === tahrir)); if (x) { setXato(x); return; } }
    setXato(null); setTahrir(null); setQadam(3);
    const bi = qatorlar.findIndex(r => r.id === birinchi);
    lsSet(KEY_SINOV, { toxtashlar: qatorlar.map(r => ({ vaqt: r.vaqt, matn: r.matn.trim() })), birinchi: bi >= 0 ? bi : null });
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, practice: 'juftlik', qatorlar, birinchiId: birinchi, yoq, correct: true, picked: true, solved: true });
    if (!yuborildi.current && live && live.mode === 'student') { yuborildi.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
  };
  const haYoq = (id, v) => setQatorlar(q => q.map(r => (r.id === id ? { ...r, ha: v } : r)));
  const qatorRender = qatorlar.map(r => {
    const tahrirda = qadam === 1 || tahrir === r.id;
    const xatoQ = xato && xato.id === r.id;
    const ong = <>
      {qadam === 2 && <span className="ut-haq" onClick={e => e.stopPropagation()}>
        <span className="ut-haq-s">{tr({ uz: 'Vazifani to\'xtatdimi?', ru: 'Остановило задание?' })}</span>
        <QChip holat={r.ha === true ? 'on' : undefined} onClick={() => haYoq(r.id, true)}>{tr({ uz: 'Ha', ru: 'Да' })}</QChip>
        <QChip holat={r.ha === false ? 'on' : undefined} onClick={() => haYoq(r.id, false)}>{tr({ uz: "Yo'q", ru: 'Нет' })}</QChip>
      </span>}
      {done && !isMentor && <button type="button" className="ut-tahrir" onClick={() => { setTahrir(r.id); setXato(null); }} aria-label={tr({ uz: 'Tahrirlash', ru: 'Изменить' })} title={tr({ uz: 'Tahrirlash', ru: 'Изменить' })}>✎</button>}
    </>;
    return {
      k: r.id, vaqt: r.vaqt, holat: cxx(qadam === 1 && !r.matn && 'toxtash', xatoQ && 'xato', qadam === 2 && 'tanlov'),
      yorliq: qadam === 1 && !r.matn ? 'toxtash' : null, birinchi: r.id === birinchi, yangi: qadam === 1,
      matn: r.matn,
      ichi: tahrirda && <GrowInput value={r.matn} onChange={e => ozgar(r.id, e.target.value)} onEnter={qadam === 1 ? undefined : saqla} placeholder={tr({ uz: 'Qayerda, nima qildi?', ru: 'Где и что сделал?' })} maxLength={140} aria-label={tr({ uz: 'Qayerda, nima qildi?', ru: 'Где и что сделал?' })} />,
      ong
    };
  });
  const qadamN = done ? 3 : qadam;
  return (
    <Stage eyebrow={tr({ uz: 'Juftlikda sinov', ru: 'Тест в паре' })} screen={screen} scrollSignal={qatorlar.length + qadam} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Sinovni o'tkazing", ru: 'Проведите тест' })} (${Math.min(qadam, 3)}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sinfdoshingiz saytingizda <A>qayerda to'xtaydi?</A></>, ru: <>Где одноклассник <A>застрянет на вашем сайте?</A></> })}
        mentor={<Mentor>{jonli
          ? tr({ uz: 'Avval siz vazifa berib kuzatasiz, keyin rollarni almashasiz. Savol bersa — unga qaytaring.', ru: 'Сначала вы даёте задание и наблюдаете, потом меняетесь ролями. Если спросит — верните вопрос ему.' })
          : tr({ uz: 'Uydagi biror kishiga saytingizni bering va kuzating. Savol bersa — unga qaytaring.', ru: 'Дайте свой сайт кому-нибудь дома и наблюдайте. Если спросит — верните вопрос ему.' })}</Mentor>}
        qadamlar={!done && <QQadamlar qadamlar={S12_QADAM.map(tr)} joriy={qadamN} />}
        forma={<div className="ut-s12">
          {!done && <div className="ut-taymer-q">
            <span className={cxx('ut-soat', yur && 'accent', !yur && soniya >= PAIR_S && 'toxtadi')}>{mss(soniya)}</span>
            <span className="ut-taymer-yol" aria-hidden="true"><i style={{ width: `${Math.round((soniya / PAIR_S) * 100)}%` }} /></span>
            {qadam === 0 && <QTugma className="ut-bos" onClick={boshla}>{tr({ uz: 'Sinovni boshlash', ru: 'Начать тест' })}</QTugma>}
            {qadam === 1 && yur && <QTugma ikkinchi onClick={() => setYur(false)}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
            {qadam === 1 && !yur && <QTugma ikkinchi onClick={() => setYur(true)} disabled={soniya >= PAIR_S}>{tr({ uz: 'Sinovni boshlash', ru: 'Начать тест' })}</QTugma>}
          </div>}
          <Yozuv holat={done ? 'saqlandi' : qadam === 2 && !yoq && birinchi === null ? 'tanla' : undefined} nom={done ? tr({ uz: 'Kuzatuv yozuvi', ru: 'Запись наблюдения' }) : null} vazifa={vazifa} vazifaHolat={done ? 'ok' : undefined}
            qatorlar={qatorRender} onQator={qadam === 2 && !yoq ? (q) => { setBirinchi(q.k); setXato(null); } : undefined}
            oxir={yoq ? tr({ uz: "To'xtash bo'lmadi", ru: 'Остановок не было' }) : null} />
          {xato && <div className="ut-xato">
            {xato.tur === 'birinchi'
              ? <QXato>{tr({ uz: 'Bitta qatorni bosib, «Birinchi» qiling.', ru: 'Нажмите на одну строку, чтобы сделать её «Первой».' })}</QXato>
              : <><QXato key={`${xato.id}-${xato.tur}`}>{tr(XABAR12[xato.tur])}</QXato>{xato.tur === 'xulosa' && <QIzoh>{tr(QOLDIR)}</QIzoh>}</>}
          </div>}
          {!isMentor && <div className="ut-amal">
            {qadam === 1 && qatorlar.length === 0 && <QTugma ikkinchi onClick={bolmadi}>{tr({ uz: "To'xtash bo'lmadi", ru: 'Остановок не было' })}</QTugma>}
            {qadam === 1 && <QTugma className={yur ? 'ut-bos' : undefined} onClick={yozish} disabled={!yur}>{tr({ uz: "To'xtashni yozish", ru: 'Записать остановку' })}</QTugma>}
            {qadam === 1 && !yur && qatorlar.length > 0 && <QTugma onClick={belgila}>{tr(S12_QADAM[2])} →</QTugma>}
            {(qadam === 2 || tahrir !== null) && <QTugma className={birinchi !== null || yoq || tahrir !== null ? 'ut-bos' : undefined} onClick={saqla}>{tr(SAQLASH)}</QTugma>}
          </div>}
        </div>}
      >
        {done && <QXulosa>{tr({ uz: "Kuzatuv yozuvingiz tayyor: vazifa, to'xtashlar va birinchi tuzatiladigani.", ru: 'Ваша запись наблюдения готова: задание, остановки и то, что исправлять первым.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Juftliklarni oldindan bo'ling. Har sinov 3 daqiqa, keyin almashish. Kuzatuvchi faqat «O'zingiz qanday deb o'ylaysiz?» deydi — boshqa gap yo'q. Darsdagi sinfdosh — mashq; real odam bilan sinov — uyga vazifa.", ru: 'Разбейте пары заранее. Каждый тест — 3 минуты, потом смена. Наблюдатель говорит только «А вы как думаете?» — больше ничего. Одноклассник на уроке — тренировка; тест с реальным человеком — домашнее задание.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — MD «Nishonlar (4)»; inglizcha nom qoladi, medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  silentObserver: { icon: '👀', name: 'Silent Observer!', desc: { uz: "Sinovda uchala to'xtashni o'zingiz yozdingiz", ru: 'Вы сами записали все три остановки в тесте' } },
  taskGiver: { icon: '🎯', name: 'Task Giver!', desc: { uz: 'Sinov vazifangizni qoidaga mos yozdingiz', ru: 'Вы написали задание для теста по правилу' } },
  firstFix: { icon: '🔧', name: 'First Fix!', desc: { uz: "Vazifani to'xtatadigan to'xtashni birinchi tanladingiz", ru: 'Вы первой выбрали остановку, которая мешает заданию' } },
  pairTester: { icon: '🤝', name: 'Pair Tester!', desc: { uz: "Sinfdoshingiz bilan sinov o'tkazib, yozuvni saqladingiz", ru: 'Вы провели тест с одноклассником и сохранили запись' } }
};
// Ekran id → nishon. s2: uchala to'xtash o'z vaqtida yozildi (o'tib ketib pauza bo'lmadi — AchMissCtx.miss) · s8: vazifa tekshiruvdan maslahatsiz o'tdi ·
// s9: birinchi tanlov — tugma · s12: yozuv saqlandi.
const ACH_TRIGGERS = { s2: 'silentObserver', s8: 'taskGiver', s9: 'firstFix', s12: 'pairTester' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 11) — MD 13-ekran
const Q_LABELS = {
  3: { uz: '1 — Yozuvga nima yoziladi', ru: '1 — Что пишется в запись' },
  5: { uz: '2 — Savolni qaytarish', ru: '2 — Вернуть вопрос' },
  7: { uz: '3 — Egaga vazifa', ru: '3 — Задание владельцу' },
  11: { uz: "4 — To'g'ri o'tgan sinov", ru: '4 — Верно проведённый тест' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — darsning lug'ati (R-008: {uz, ru}; MD «Fon so'zlari» + o'yin qatlami belgilari)
const QZ_BG_SHAPES = [
  { ch: { uz: 'sinov', ru: 'тест' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'kuzatish', ru: 'наблюдение' }, l: 80, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: "to'xtash", ru: 'остановка' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'vazifa', ru: 'задание' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'yozuv', ru: 'запись' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'tugma', ru: 'кнопка' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'vaqt', ru: 'время' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'odam', ru: 'человек' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: '0:25', l: 56, t: 52, s: 22, d: 22, dl: 0.6 },
  { ch: '2:01', l: 88, t: 44, s: 20, d: 24, dl: 2.4 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD «Jonli viktorina»), to'g'ri javoblar 4 pozitsiyaga TENG: A 1·6·9 · B 3·5·11 · C 2·8·12 · D 4·7·10.
const QUIZ_BANK = [
  { q: { uz: 'Sinov nima?', ru: 'Что такое тест?' }, opts: [{ uz: 'Real odam saytni ishlatadi, siz kuzatasiz', ru: 'Реальный человек пользуется сайтом, вы наблюдаете' }, { uz: 'Siz saytni ishlatasiz, odam sizni kuzatadi', ru: 'Вы пользуетесь сайтом, человек наблюдает за вами' }, { uz: "Odamdan sayt haqidagi fikrini so'raysiz", ru: 'Спрашиваете у человека мнение о сайте' }, { uz: "Saytni o'zingiz qayta-qayta ishlatib ko'rasiz", ru: 'Сами снова и снова пробуете сайт' }], correct: 0 },
  { q: { uz: 'Sinov intervyudan nimasi bilan farq qiladi?', ru: 'Чем тест отличается от интервью?' }, opts: [{ uz: "Sinovda odamga ko'proq savol beriladi", ru: 'На тесте человеку задают больше вопросов' }, { uz: "Intervyuda odam saytni o'zi ishlatadi", ru: 'На интервью человек сам пользуется сайтом' }, { uz: "Sinovda so'ramaysiz, odamni kuzatasiz", ru: 'На тесте не спрашиваете, а наблюдаете' }, { uz: 'Sinovda faqat sinfdoshlaringiz qatnashadi', ru: 'В тесте участвуют только одноклассники' }], correct: 2 },
  { q: { uz: "O'yinchi 25 soniya hech narsa bosmadi. Bu nima?", ru: 'Игрок 25 секунд ничего не нажимал. Что это?' }, opts: [{ uz: 'Sayt juda sekin ochilayotganining belgisi', ru: 'Признак того, что сайт открывается медленно' }, { uz: "To'xtash: yozuvga vaqti bilan tushadi", ru: 'Остановка: попадает в запись со временем' }, { uz: 'Odam saytni yoqtirmaganining belgisi', ru: 'Признак того, что сайт не понравился' }, { uz: 'Sinov shu yerda tugaganining belgisi', ru: 'Признак того, что тест закончился' }], correct: 1 },
  { q: { uz: 'Sinovda odamga yordam bersangiz, yozuvda nima bo\'ladi?', ru: 'Что будет в записи, если помогать человеку на тесте?' }, opts: [{ uz: "Yozuvga ko'proq to'xtash tushadi", ru: 'В запись попадёт больше остановок' }, { uz: "Yozuv avvalgidek o'zgarmay qoladi", ru: 'Запись останется как была' }, { uz: "Odam to'xtagan joylar ikki marta yoziladi", ru: 'Места остановок запишутся дважды' }, { uz: "To'xtash joyi yozuvga tushmay qoladi", ru: 'Место остановки не попадёт в запись' }], correct: 3 },
  { q: { uz: 'Yaxshi sinov vazifasi nimani aytadi?', ru: 'Что говорит хорошее задание для теста?' }, opts: [{ uz: 'Qaysi tugmalarni bosish kerakligini', ru: 'Какие кнопки нужно нажать' }, { uz: 'Odam nimaga erishishi kerakligini', ru: 'Чего человек должен добиться' }, { uz: 'Sayt qaysi qismlardan qurilganini', ru: 'Из каких частей собран сайт' }, { uz: 'Odamga sayt yoqqan-yoqmaganini', ru: 'Понравился ли сайт человеку' }], correct: 1 },
  { q: { uz: "Qaysi biri sinov vazifasi bo'la oladi?", ru: 'Что может быть заданием для теста?' }, opts: [{ uz: '«Shanba kuni soat 18:00 ga maydon band qiling»', ru: '«Забронируйте поле на субботу на 18:00»' }, { uz: '«18:00 katagini bosib, ism va telefonni yozing»', ru: '«Нажмите ячейку 18:00 и введите имя и телефон»' }, { uz: '«Sayt sizga qulaymi? Fikringizni aytib bering»', ru: '«Удобен ли вам сайт? Скажите своё мнение»' }, { uz: '«Pastdagi «Band qilish» tugmasini topib bosing»', ru: '«Найдите внизу кнопку «Забронировать» и нажмите»' }], correct: 0 },
  { q: { uz: 'Kuzatuv yozuviga qaysi qator tushadi?', ru: 'Какая строка попадёт в запись наблюдения?' }, opts: [{ uz: '«Tugma juda noqulay joyga qo\'yilgan ekan»', ru: '«Кнопка стоит в очень неудобном месте»' }, { uz: "«Hamma odam bunday formani yomon ko'radi»", ru: '«Все люди не любят такие формы»' }, { uz: '«Sayt menga ham chalkash tuyuldi»', ru: '«Мне сайт тоже показался запутанным»' }, { uz: '«Tugmani qidirib, 1 daqiqa ekranni surdi»', ru: '«Искал кнопку, 1 минуту листал экран»' }], correct: 3 },
  { q: { uz: "Internet-magazinda odamlar qayerda to'xtab qolgan?", ru: 'Где застревали люди в интернет-магазине?' }, opts: [{ uz: 'Savatga narsalarni solayotgan paytda', ru: 'Когда клали товары в корзину' }, { uz: 'Kerakli narsani qidiruvdan izlayotganda', ru: 'Когда искали нужный товар в поиске' }, { uz: "Email va parol so'raydigan formada", ru: 'На форме, которая просит email и пароль' }, { uz: 'Yetkazib berish manzilini yozayotganda', ru: 'Когда писали адрес доставки' }], correct: 2 },
  { q: { uz: "Internet-magazinda nima o'zgartirildi?", ru: 'Что изменили в интернет-магазине?' }, opts: [{ uz: "«Ro'yxatdan o'tish» o'rniga «Davom etish»", ru: '«Продолжить» вместо «Регистрация»' }, { uz: "Formaga yana bitta qator qo'shib qo'yildi", ru: 'В форму добавили ещё одну строку' }, { uz: 'Sayt boshidan to\'liq qayta qurib chiqildi', ru: 'Сайт полностью пересобрали с нуля' }, { uz: "Ro'yxatdan o'tganlarga chegirma berildi", ru: 'Зарегистрированным дали скидку' }], correct: 0 },
  { q: { uz: "Uch to'xtashdan qaysi biri birinchi tuzatiladi?", ru: 'Какую из трёх остановок исправляют первой?' }, opts: [{ uz: 'Sinovning eng oxirida bo\'lgani', ru: 'Ту, что была в самом конце теста' }, { uz: "Eng qisqa vaqt olgan to'xtash", ru: 'Самую короткую остановку' }, { uz: "O'zingizga eng qiziq tuyulgani", ru: 'Ту, что вам интереснее всего' }, { uz: "Vazifani to'xtatib qo'yadigani", ru: 'Ту, что останавливает задание' }], correct: 3 },
  { q: { uz: "Real odam bilan sinovni kim bilan o'tkazasiz?", ru: 'С кем проводить тест с реальным человеком?' }, opts: [{ uz: "Saytni qurgan o'zingiz bilan", ru: 'С самим собой — тем, кто строил сайт' }, { uz: "Saytingiz mo'ljallangan odam bilan", ru: 'С человеком, для которого сайт' }, { uz: "Saytni oldin ko'rgan dasturchi bilan", ru: 'С программистом, который уже видел сайт' }, { uz: "Sinfdagi eng a'lochi o'quvchi bilan", ru: 'С лучшим учеником класса' }], correct: 1 },
  { q: { uz: 'Sinovdan keyin kuzatuv yozuvi bilan nima qilasiz?', ru: 'Что делать с записью наблюдения после теста?' }, opts: [{ uz: "Uni o'chirib, yangisini boshidan boshlayman", ru: 'Удалю и начну новую с нуля' }, { uz: "Hamma to'xtashni bir kunning o'zida tuzataman", ru: 'Исправлю все остановки за один день' }, { uz: "Birinchi tuzatiladigan to'xtashni tanlayman", ru: 'Выберу остановку, которую исправлять первой' }, { uz: "Odamdan yozuvni tasdiqlashini so'rayman", ru: 'Попрошу человека подтвердить запись' }], correct: 2 },
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
    // Arena tokenlari — SHU darsning so'zlaridan (QZ_BG_SHAPES, R-008): dekorativ suzuvchi so'zlar
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

// 🃏 KARTOCHKALAR — MD 14-ekran jadvali (12 ta); mexanika va ko'rinish qolipda: QKartochka (DE-204)
const KARTOCHKALAR = [
  { front: { uz: 'Sinov nima?', ru: 'Что такое тест?' }, back: { uz: 'Real odam saytni o\'zi ishlatadi, siz kuzatasiz', ru: 'Реальный человек сам пользуется сайтом, вы наблюдаете' }, note: { uz: 'Inglizcha — usability test', ru: 'По-английски — usability test' } },
  { front: { uz: 'Sinov intervyudan nimasi bilan farq qiladi?', ru: 'Чем тест отличается от интервью?' }, back: { uz: "Intervyuda so'raysiz, sinovda kuzatasiz", ru: 'На интервью спрашиваете, на тесте наблюдаете' }, note: { uz: 'Javob — odamning harakatida', ru: 'Ответ — в действиях человека' } },
  { front: { uz: 'Sinovning qoidasi qanday?', ru: 'Какое правило у теста?' }, back: { uz: "Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz", ru: 'На тесте этого урока: даёте задание, не объясняете путь, не показываете решение и записываете, где человек остановился' }, note: { uz: "To'rt qism — bitta gap", ru: 'Четыре части — одна фраза' } },
  { front: { uz: "To'xtash nima?", ru: 'Что такое остановка?' }, back: { uz: 'Odam keyingi qadamni topishda qiynalgan joy: jim qoladi, qidiradi yoki noto\'g\'ri bosadi', ru: 'Место, где человеку трудно найти следующий шаг: молчит, ищет или нажимает не туда' }, note: { uz: 'Yozuvga vaqti bilan tushadi', ru: 'Попадает в запись со временем' } },
  { front: { uz: 'Kuzatuv yozuviga nima tushadi?', ru: 'Что попадает в запись наблюдения?' }, back: { uz: "Odam nima qilgani va qayerda to'xtagani", ru: 'Что сделал человек и где остановился' }, note: { uz: "Ko'rgan harakat — u qilganidek", ru: 'Увиденное действие — как он его сделал' } },
  { front: { uz: 'Yozuvga nima tushmaydi?', ru: 'Что не попадает в запись?' }, back: { uz: 'Sizning xulosangiz', ru: 'Ваш вывод' }, note: { uz: '«Katak kichik» — xulosa', ru: '«Ячейка маленькая» — вывод' } },
  { front: { uz: 'Odam «Endi nimani bosaman?» desa-chi?', ru: 'А если человек спросит «Что теперь нажать?»' }, back: { uz: "«O'zingiz qanday deb o'ylaysiz?»", ru: '«А вы как думаете?»' }, note: { uz: 'Savol unga qaytadi', ru: 'Вопрос возвращается к нему' } },
  { front: { uz: 'Sinovda yordam bersangiz nima bo\'ladi?', ru: 'Что будет, если помогать на тесте?' }, back: { uz: "To'xtash yozuvdan yo'qoladi", ru: 'Остановка исчезает из записи' }, note: { uz: "Odam tez tugatadi, yozuv bo'sh", ru: 'Человек быстро закончит, запись пустая' } },
  { front: { uz: 'Yaxshi sinov vazifasi nimani aytadi?', ru: 'Что говорит хорошее задание для теста?' }, back: { uz: 'Odam nimaga erishishini', ru: 'Чего человек должен добиться' }, note: { uz: 'Qaysi tugmani bosishni emas', ru: 'А не какую кнопку нажать' } },
  { front: { uz: "Maydon sinovida birinchi qaysi to'xtash tuzatildi?", ru: 'Какую остановку в тесте Maydon исправили первой?' }, back: { uz: "Vazifani tugatishga to'sqinlik qilgani", ru: 'Ту, что мешала закончить задание' }, note: { uz: '«Maydon»da — tugma', ru: 'В «Maydon» — кнопка' } },
  { front: { uz: "Internet-magazinda nima o'zgardi?", ru: 'Что изменилось в интернет-магазине?' }, back: { uz: "«Ro'yxatdan o'tish» o'rniga «Davom etish»", ru: '«Продолжить» вместо «Регистрация»' }, note: { uz: 'Xarid qilgan mijozlar soni 45% oshdi', ru: 'Число покупателей выросло на 45%' } },
  { front: { uz: 'Real odam bilan sinovni kimga berasiz?', ru: 'Кому давать тест с реальным человеком?' }, back: { uz: "Saytingiz mo'ljallangan odamga", ru: 'Человеку, для которого ваш сайт' }, note: { uz: 'Sinfdosh — darsdagi mashq', ru: 'Одноклассник — тренировка на уроке' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16 (F-1005-91): Mentor jim (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha */}
        <div className={cxx('ut-flash', !bosildi && 'yangi')} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="ut-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: karta «kim bilan · nechta · muddat» + raqamli qadamlar; GATE M M-q9 — alohida .homework.jsx YO'Q) =====
// s8 da saqlangan sinov vazifasi 1-qadam ostida ko'rinadi (KOD 8).
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: '2-darsda intervyu bergan odamlardan ikkitasi', ru: 'двое из тех, кто давал интервью на 2-м уроке' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '2 ta sinov', ru: '2 теста' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Sinov vazifangizni o'qib bering va telefonni (yoki laptopni) bering.", ru: 'Прочитайте задание для теста и дайте телефон (или ноутбук).' },
  { uz: "Tushuntirmang, yordam bermang — har to'xtashni vaqti bilan yozing.", ru: 'Не объясняйте, не помогайте — записывайте каждую остановку со временем.' },
  { uz: "Vazifani to'xtatgan to'xtashni «Birinchi» deb belgilang va yozuvni keyingi darsga olib keling.", ru: 'Отметьте остановку, которая остановила задание, как «Первую», и принесите запись на следующий урок.' }
];
const HwCard = ({ keyingi }) => {
  const v = lsGet(KEY_VAZIFA);
  return (
    <div className="card ut-hw fade-up">
      <div className="ut-hw-karta">
        {HW_KARTA.map((r, i) => <div key={i} className="ut-hw-q"><span className="ut-hw-k">{tr(r.k)}</span><span className="ut-hw-v">{tr(r.v)}</span></div>)}
      </div>
      <ol className="ut-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}{i === 0 && v && v.matn && <b className="ut-hw-vazifa">«{v.matn}»</b>}</span></li>)}</ol>
      {keyingi && <span className="ut-hw-keyingi">{keyingi}</span>}
    </div>
  );
};

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
  // «Endi siz bilasiz» — MD 15-ekran aynan (2-band — A-1 ta'rifi so'zma-so'z, T-042)
  const RECAP = [
    { uz: "Sinov — real odam saytni o'zi ishlatadi, siz kuzatasiz.", ru: 'Тест — реальный человек сам пользуется сайтом, вы наблюдаете.' },
    { uz: "Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.", ru: 'На тесте этого урока: даёте задание, не объясняете путь, не показываете решение и записываете, где человек остановился.' },
    { uz: 'Kuzatuv yozuviga xulosangiz emas, odam nima qilgani vaqti bilan tushadi.', ru: 'В запись наблюдения попадает не ваш вывод, а то, что сделал человек, со временем.' },
    { uz: "Maydon sinovida birinchi — vazifani tugatishga to'sqinlik qilgan to'xtash.", ru: 'В тесте Maydon первой исправляют остановку, которая мешала закончить задание.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: sinovdan keyingi tuzatish»</b>. Sinovda topilgan birinchi to'xtashni agent bilan tuzatasiz.</>, ru: <>Следующий урок — <b>«День проекта: исправление после теста»</b>. Первую найденную на тесте остановку вы исправите с агентом.</> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Kuzatuv yozuvi tayyor: <span className="italic" style={{ color: T.accent }}>birinchi tuzatish aniq</span>.</>, ru: <>Запись наблюдения готова: <span className="italic" style={{ color: T.accent }}>первое исправление понятно</span>.</> })}
        cta={<>
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
export default function PmUsabilityTestLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — Sinov sahnasi (ut-). Faqat qolip tokenlari (D3); «Maydon» nomi va magazin formasi — maket mazmuni rangi; emoji yo'q (D4) === */
        .ut-sahna { display: flex; flex-wrap: wrap; gap: 14px 26px; align-items: flex-start; justify-content: center; width: 100%; }
        .ut-sahna > .ut-yozuv, .ut-yozuv-kol { flex: 1 1 250px; min-width: 0; max-width: 560px; }
        .ut-yozuv-kol { display: flex; flex-direction: column; gap: 10px; }
        .ut-tel-kol { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 0 0 auto; position: relative; }
        .ut-tel-ust { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 26px; flex-wrap: wrap; }
        .ut-soat { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 15px; color: ${T.ink}; padding: 2px 10px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 58px; text-align: center; transition: color .3s, border-color .3s, background .3s; }
        .ut-soat.accent { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ut-soat.toxtadi { color: ${T.ink2}; background: ${T.bg}; }
        .ut-tez, .ut-tel-yorliq, .ut-yozildi { font-size: 11.5px; font-weight: 800; letter-spacing: .03em; padding: 3px 9px; border-radius: 999px; background: ${T.bg}; color: ${T.ink2}; border: 1px solid ${T.line}; white-space: nowrap; }
        .ut-tel-yorliq { color: ${T.accent}; background: ${T.accentSoft}; border-color: transparent; animation: ut-kir .4s ease-out both; }
        .ut-yozildi { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        @keyframes ut-kir { from { opacity: 0; transform: translateY(6px); } }

        /* telefon — «Maydon» sayti (ekran 156x296; «band» holatida ichi 44 px suriladi) */
        .ut-tel { position: relative; width: 176px; height: 316px; border-radius: 28px; background: ${T.ink}; padding: 10px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.55); flex: 0 0 auto; }
        .ut-tel-kesik { position: absolute; top: 4px; left: 50%; width: 46px; height: 5px; margin-left: -23px; border-radius: 4px; background: ${fon(T.paper, 0.28)}; z-index: 2; }
        .ut-tel-ekran { position: relative; width: 156px; height: 296px; border-radius: 20px; background: ${T.paper}; overflow: hidden; }
        .ut-tel-ichi { position: absolute; left: 0; right: 0; top: 0; padding: 0 10px; transition: transform .6s cubic-bezier(.4,0,.2,1); }
        .ut-tel-ichi.qidir .ut-m-kataklar { animation: ut-sur 2.6s ease-in-out infinite; }
        @keyframes ut-sur { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .ut-m-bosh { height: 30px; display: flex; align-items: flex-end; padding-bottom: 4px; }
        .ut-m-nom { font-weight: 800; font-size: 14px; color: #1E8449; letter-spacing: .01em; }
        .ut-m-kun { height: 26px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 700; color: ${T.ink}; border-radius: 6px; transition: box-shadow .3s; }
        .ut-m-kun i { font-style: normal; font-size: 10px; color: ${T.ink2}; width: 14px; text-align: center; }
        .ut-m-kun b { animation: ut-kir .35s ease-out both; }
        .ut-m-kataklar { display: flex; flex-direction: column; }
        .ut-m-katak { height: 22px; margin-top: 4px; display: flex; align-items: center; justify-content: space-between; padding: 0 8px; border-radius: 6px; border: 1px solid ${T.line}; font-size: 11px; color: ${T.ink}; transition: background .5s, border-color .5s, color .5s; }
        .ut-m-katak b { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        .ut-m-katak i { font-style: normal; font-size: 10px; font-weight: 700; color: ${T.ink2}; }
        .ut-m-katak.band { background: ${T.bg}; color: ${T.ink2}; }
        .ut-m-katak.tanlandi { border-color: #1E8449; background: rgba(30,132,73,0.10); }
        .ut-m-forma { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; animation: ut-kir .35s ease-out both; }
        .ut-m-inp { height: 22px; border-radius: 6px; border: 1px solid ${T.line}; display: flex; align-items: center; padding: 0 8px; font-size: 10.5px; color: ${T.ink2}; }
        .ut-m-inp i { font-style: normal; }
        .ut-m-inp.toldi i { display: none; }
        .ut-m-inp.toldi::after { content: ''; height: 5px; width: 58%; border-radius: 3px; background: ${T.ink2}; opacity: .55; animation: ut-yoz .8s steps(6) both; }
        @keyframes ut-yoz { from { width: 0; } }
        .ut-m-tugma { margin-top: 24px; height: 26px; border-radius: 8px; background: #1E8449; color: #fff; font-size: 11.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; transition: box-shadow .3s; }
        .ut-m-kun.belgi, .ut-m-tugma.belgi { box-shadow: 0 0 0 3px ${T.accent}; }
        .ut-m-toast { position: absolute; left: 12px; right: 12px; bottom: 12px; padding: 7px 10px; border-radius: 10px; background: ${T.ok}; color: ${T.paper}; font-size: 11.5px; font-weight: 800; text-align: center; animation: ut-toast .4s ease-out both; z-index: 3; }
        .ut-m-toast.qayta { animation: ut-toast-q 2.8s ease-in-out infinite; }
        @keyframes ut-toast { from { opacity: 0; transform: translateY(8px); } }
        @keyframes ut-toast-q { 0%, 8% { opacity: 0; transform: translateY(8px); } 18%, 52% { opacity: 1; transform: none; } 68%, 100% { opacity: 0; transform: none; } }
        .ut-halqa { position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; border: 2.5px solid ${T.accent}; background: ${fon(T.accent, 0.12)}; transition: top .55s cubic-bezier(.4,0,.2,1), left .55s cubic-bezier(.4,0,.2,1); z-index: 4; pointer-events: none; }
        .ut-halqa.aylan { animation: ut-aylan 1.8s linear infinite; }
        @keyframes ut-aylan { 0% { transform: translate(10px,0); } 25% { transform: translate(0,7px); } 50% { transform: translate(-10px,0); } 75% { transform: translate(0,-7px); } 100% { transform: translate(10px,0); } }
        .ut-halqa.belgi { box-shadow: 0 0 0 5px ${fon(T.accent, 0.22)}; }
        .ut-halqa-bos { position: absolute; inset: -3px; border-radius: 50%; border: 2px solid ${T.accent}; animation: ut-bosish .6s ease-out both; }
        @keyframes ut-bosish { from { transform: scale(.6); opacity: 1; } to { transform: scale(1.9); opacity: 0; } }
        .ut-pufak { position: absolute; z-index: 5; max-width: 156px; padding: 6px 10px; border-radius: 12px; font-size: 11.5px; font-weight: 700; line-height: 1.3; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.5); animation: ut-pufak .35s cubic-bezier(.3,1.4,.5,1) both; }
        .ut-pufak.oyinchi { left: -26px; top: 86px; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.line}; border-bottom-left-radius: 3px; }
        .ut-pufak.siz { right: -34px; top: 150px; background: ${T.accent}; color: ${T.paper}; border-bottom-right-radius: 3px; }
        .ut-pufak.savol { left: 50%; top: 248px; transform: translateX(-50%); background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}; white-space: nowrap; animation-name: ut-pufak-o; }
        @keyframes ut-pufak { from { opacity: 0; transform: scale(.7); } }
        @keyframes ut-pufak-o { from { opacity: 0; transform: translateX(-50%) scale(.7); } }
        .ut-tel.kichik { width: 112px; height: 196px; border-radius: 22px; padding: 7px; }
        .ut-tel.kichik .ut-tel-ekran { width: 98px; height: 182px; border-radius: 16px; }
        .ut-siz-sk { display: flex; flex-direction: column; gap: 7px; padding: 18px 10px; }
        .ut-siz-sk b { height: 10px; width: 55%; border-radius: 4px; background: ${T.accentSoft}; }
        .ut-siz-sk i { height: 18px; border-radius: 5px; border: 1px dashed ${T.line}; }
        .ut-siz-sk span { height: 20px; margin-top: 8px; border-radius: 6px; background: ${T.line}; }

        /* kuzatuv yozuvi */
        .ut-yozuv { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); min-width: 0; position: relative; transition: border-color .4s; }
        .ut-yozuv.saqlandi { border-color: ${T.ok}; }
        .ut-yozuv-nom { font-weight: 800; font-size: 14.5px; color: ${T.ink}; animation: ut-kir .4s ease-out both; }
        .ut-vazifa { font-size: 13px; font-weight: 600; color: ${T.ink2}; line-height: 1.4; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; display: flex; align-items: center; justify-content: space-between; gap: 8px; transition: background .3s; }
        .ut-vazifa b { color: ${T.ink}; font-weight: 700; }
        .ut-vazifa > span { min-width: 0; overflow-wrap: anywhere; }
        .ut-vazifa.xato { background: ${T.errFon}; }
        .ut-vazifa.ok { background: ${T.okFon}; }
        .ut-qatorlar { display: flex; flex-direction: column; gap: 6px; }
        .ut-q { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; min-height: 34px; padding: 6px 10px; border-radius: 9px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink}; text-align: left; width: 100%; transition: background .3s, border-color .3s, box-shadow .3s; }
        .ut-q.bos { cursor: pointer; }
        .ut-q.bos:hover { border-color: ${T.accent}; }
        .ut-q-v { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; flex: 0 0 auto; min-width: 34px; }
        .ut-q-t { flex: 1 1 140px; min-width: 0; line-height: 1.35; overflow-wrap: anywhere; }
        .ut-q-y { flex: 0 0 auto; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: ${T.accentSoft}; color: ${T.accent}; }
        .ut-q-y.bir { background: ${T.accent}; color: ${T.paper}; animation: ut-pufak .35s ease-out both; }
        .ut-skelet { flex: 1; height: 7px; border-radius: 4px; background: ${T.line}; max-width: 70%; }
        .ut-skelet.qisqa { display: inline-block; width: 120px; vertical-align: middle; }
        .ut-q.bosh { border-style: dashed; }
        .ut-q.yangi { animation: ut-yangi .9s ease-out both; }
        @keyframes ut-yangi { 0% { opacity: 0; transform: translateX(-10px); background: ${T.accentSoft}; } 35% { opacity: 1; transform: none; background: ${T.accentSoft}; } 100% { background: ${T.paper}; } }
        .ut-q.toxtash { border-color: ${T.accent}; }
        .ut-q.yozilmadi { color: ${T.ink2}; background: ${T.bg}; border-color: ${T.line}; }
        .ut-q.yozilmadi .ut-q-t { text-decoration: line-through; }
        .ut-q.yozilmadi .ut-q-y { background: ${T.paper}; color: ${T.ink2}; border: 1px solid ${T.line}; }
        .ut-q.xato { background: ${T.errFon}; border-color: ${T.err}; }
        .ut-q.ajral { box-shadow: 0 0 0 2px ${fon(T.accent, 0.35)}; background: ${T.accentSoft}; }
        .ut-q .ut-kirit { flex: 1 1 160px; }
        .ut-yozuv.yonib .ut-q.bosh { animation: ut-yonib 1.2s ease-out 1; }
        @keyframes ut-yonib { 30% { background: ${T.accentSoft}; border-color: ${T.accent}; } }
        .ut-yozuv-oxir { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${T.ink}; padding-top: 8px; border-top: 1px dashed ${T.line}; margin-top: auto; }
        .ut-ikki { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; align-items: stretch; width: 100%; }
        .ut-ikki > .ut-yozuv { height: 100%; }
        .ut-mini { margin-top: 10px; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 9px; border: 1px solid ${T.line}; background: ${T.paper}; font-size: 13.5px; color: ${T.ink}; animation: ut-kir .3s ease-out both; max-width: 520px; }
        .ut-mini.ok { background: ${T.okFon}; border-color: ${T.ok}; }
        .ut-mini.xato { background: ${T.errFon}; border-color: ${T.err}; }
        .ut-tahrir { flex: 0 0 auto; width: 28px; height: 28px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 14px; cursor: pointer; }
        .ut-tahrir:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .ut-reja-yozuv { min-height: 196px; }

        /* harakat qatori, bashorat ixcham qatori, natija */
        .ut-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ut-natija { display: flex; align-items: center; justify-content: space-between; gap: 10px 14px; flex-wrap: wrap; }
        .ut-natija > .q-taxmin { flex: 1 1 260px; margin: 0; }
        .ut-xato { display: flex; flex-direction: column; gap: 4px; }
        .ut-taxmin-q { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; animation: ut-kir .3s ease-out both; }
        .ut-taxmin-s { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; min-width: 0; }
        .ut-taxmin-b { font-size: 13.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 12px; border-radius: 999px; white-space: nowrap; }
        .ut-taxmin-b b { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
        .ut-kirit { width: 100%; resize: none; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 10px; font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.paper}; outline: none; min-height: 38px; }
        .ut-kirit:focus { border-color: ${T.accent}; }
        .ut-yozish { display: flex; flex-direction: column; gap: 8px; }
        .ut-yozish.xato .ut-kirit { border-color: ${T.err}; }
        .ut-s8, .ut-s12 { display: flex; flex-direction: column; gap: 12px; width: 100%; }
        .ut-s8 .ut-sahna { justify-content: flex-start; }

        /* --- SABOQ 11 (qat'iy): keyingi bosiladigan joy — halqa doim, puls 2–3 marta; reduced-motion da faqat halqa --- */
        .ut-bos, .ut-bos-nav { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: ut-puls 1.6s ease-out .5s 3; }
        @keyframes ut-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 70%, 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .q-kirish .q-variantlar-kol:not(:has(.q-variant.on)) .q-variant:not(:disabled),
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled),
        .q-test-ro:not(:has(.q-test-v.xato, .q-test-v.ok, .q-test-v.kutish, .q-test-v.xira)) .q-test-v:not(:disabled),
        .ut-darvoza:not(:has(.q-chip.ok)) .q-chip:not(:disabled):not(.q-silk),
        .ut-kartalar.chorla .ut-karta:not(.korildi), .ut-kartalar.tanla .ut-karta,
        .ut-yozish.chorla .ut-kirit, .ut-yozuv.tanla .ut-q.bos {
          box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}; animation: ut-chorla 1.7s ease-out .6s 2;
        }
        .q-variant:nth-child(2), .q-chip:not(.q-silk):nth-child(2), .q-test-v:nth-child(2), .ut-karta:nth-child(2) { animation-delay: .78s; }
        .q-variant:nth-child(3), .q-chip:not(.q-silk):nth-child(3), .q-test-v:nth-child(3), .ut-karta:nth-child(3) { animation-delay: .96s; }
        .q-test-v:nth-child(4) { animation-delay: 1.14s; }
        @keyframes ut-chorla { 0% { box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}, 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 2px ${fon(T.accent, 0.32)}, 0 0 0 10px ${fon(T.accent, 0)}; } }
        .mnote-chip { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 999px; border: 1px dashed ${T.line}; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; }
        .mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; }
        .mnote-lbl { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.accent}; }
        .mnote-body { font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ut-ovoz { display: flex; flex-direction: column; gap: 6px; }
        .ut-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 40px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink2}; }
        .ut-ovoz-q.men { color: ${T.ink}; font-weight: 700; }
        .ut-ovoz-yol { height: 8px; border-radius: 4px; background: ${T.bg}; overflow: hidden; }
        .ut-ovoz-yol i { display: block; height: 100%; background: ${T.accent}; border-radius: 4px; transition: width .5s; }
        .ut-ovoz-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: right; }

        /* --- s6 Internet-magazin: nuqtalar, bosqich kartasi, FormaMaket --- */
        .ut-nuqtalar { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .ut-nuq-l { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; margin-right: 6px; }
        .ut-nuqtalar i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background .3s, transform .3s; }
        .ut-nuqtalar i.ok { background: ${T.ok}; }
        .ut-nuqtalar i.cur { background: ${T.accent}; transform: scale(1.25); }
        .ut-voqea { display: flex; flex-direction: column; gap: 10px; align-items: stretch; width: 100%; animation: ut-kir .35s ease-out both; }
        .ut-voqea-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,1.9vw,19px); color: ${T.ink}; text-align: center; }
        .ut-voqea .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 8px 14px; }
        .ut-voqea .q-bashorat .q-yorliq { margin: 0; }
        .ut-voqea .q-bashorat .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .ut-voqea .q-taxmin { text-align: center; }
        .ut-fm-w { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .ut-tanish { font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; text-align: center; max-width: 640px; animation: ut-kir .4s ease-out both; }
        .ut-tanish b { color: ${T.ink}; }
        .ut-fm { position: relative; display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; width: 100%; min-height: 236px; padding: 6px 0; }
        .ut-fm-oyna { width: 400px; max-width: 100%; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},0.5); overflow: hidden; }
        .ut-fm-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ut-fm-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .ut-fm-url { flex: 1; height: 12px; margin-left: 8px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ut-fm-ichi { position: relative; display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 14px; padding: 14px; }
        .ut-fm-savat { display: flex; flex-direction: column; gap: 7px; padding: 10px; border-radius: 10px; background: ${T.bg}; font-size: 12px; color: ${T.ink}; }
        .ut-fm-savat i { height: 10px; border-radius: 4px; background: ${T.line}; }
        .ut-fm-savat i:nth-of-type(2) { width: 80%; } .ut-fm-savat i:nth-of-type(3) { width: 64%; }
        .ut-fm-jami { margin-top: 4px; height: 12px; width: 50%; align-self: flex-end; border-radius: 4px; background: ${T.ink2}; opacity: .5; }
        .ut-fm-forma { display: flex; flex-direction: column; gap: 5px; font-size: 11.5px; color: ${T.ink}; text-align: left; }
        .ut-fm-l { font-weight: 700; color: ${T.ink2}; font-size: 11px; }
        .ut-fm-inp { height: 22px; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .ut-fm-inp.parol { background-image: radial-gradient(circle, ${T.ink2} 2px, transparent 2.5px); background-size: 10px 10px; background-repeat: repeat-x; background-position: 8px center; }
        .ut-fm-tugmalar { display: flex; gap: 6px; margin-top: 4px; }
        .ut-fm-t { flex: 1; text-align: center; padding: 6px 4px; border-radius: 7px; border: 1px solid ${T.line}; font-weight: 700; font-size: 11px; color: ${T.ink}; background: ${T.paper}; }
        .ut-fm-t.asosiy { background: #2F5DA8; border-color: #2F5DA8; color: #fff; }
        .ut-fm-t.yangi { background: ${T.ok}; border-color: ${T.ok}; animation: ut-almash .6s ease-out both; }
        @keyframes ut-almash { 0% { transform: rotateX(90deg); } 100% { transform: none; } }
        .ut-fm-gap { font-size: 11px; font-weight: 700; color: ${T.ok}; animation: ut-kir .4s ease-out .2s both; }
        .ut-fm-havola { font-size: 10.5px; color: #2F5DA8; text-decoration: underline; }
        .ut-fm-halqa { left: 30%; top: 62%; }
        .ut-fm.b2 .ut-fm-halqa { left: 58%; top: 44%; }
        .ut-fm.b3 .ut-fm-halqa, .ut-fm.b4 .ut-fm-halqa { left: 70%; top: 56%; }
        .ut-pufak.ut-fm-p1 { left: auto; right: 10px; top: 8px; }
        .ut-pufak.ut-fm-p2 { left: 36%; top: 40%; font-family: 'JetBrains Mono', monospace; }
        .ut-fm-royxat { width: 132px; display: flex; flex-direction: column; gap: 7px; padding: 12px; border-radius: 10px; background: #FFF8E1; border: 1px solid #F0D98A; transform: rotate(-3deg); font-size: 11.5px; color: ${T.ink}; animation: ut-kir .4s ease-out both; }
        .ut-fm-royxat i { height: 7px; border-radius: 3px; background: #E2CC7A; }
        .ut-fm-royxat i:nth-of-type(2) { width: 76%; } .ut-fm-royxat i:nth-of-type(3) { width: 58%; }
        .ut-fm-pul { align-self: flex-start; margin-top: 4px; padding: 3px 12px; border-radius: 4px; background: #9CCB86; color: #1E4D17; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
        .ut-fm-ustun { display: flex; align-items: flex-end; gap: 10px; height: 150px; padding: 0 6px; border-bottom: 2px solid ${T.line}; }
        .ut-fm-u { width: 42px; border-radius: 6px 6px 0 0; position: relative; }
        .ut-fm-u.oldin { height: 64px; background: ${T.line}; }
        .ut-fm-u.keyin { height: 93px; background: ${T.ok}; animation: ut-osish 1s cubic-bezier(.3,1.2,.5,1) .3s both; transform-origin: bottom; }
        .ut-fm-u.keyin b { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ok}; white-space: nowrap; }
        @keyframes ut-osish { from { transform: scaleY(0); } }

        /* --- s9 birinchi qaysi --- */
        .ut-s9 { display: flex; flex-direction: column; gap: 10px; }
        .ut-kartalar { display: grid; grid-auto-rows: 1fr; gap: 8px; }
        .ut-karta { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 58px; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 600; color: ${T.ink}; text-align: left; cursor: pointer; transition: border-color .2s, background .2s, opacity .3s; }
        .ut-karta:hover:not(:disabled) { border-color: ${T.accent}; }
        .ut-karta.joriy { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ut-karta.tanlandi { border-color: ${T.accent}; background: ${T.accentSoft}; cursor: default; animation: ut-kir .35s ease-out both; }
        .ut-karta.keyin { min-height: 0; padding: 7px 10px; font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; cursor: default; opacity: .85; }
        .ut-karta-v { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; flex: 0 0 auto; }
        .ut-karta-t { flex: 1; min-width: 0; line-height: 1.35; }
        .ut-karta-b { flex: 0 0 auto; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        .ut-karta.korildi .ut-karta-b { color: ${T.ok}; background: ${T.okFon}; }
        .ut-qa { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; }
        .ut-qa-s { font-weight: 700; font-size: 14px; color: ${T.ink}; }
        .ut-qa-j { font-size: 13.5px; color: ${T.ink2}; }
        .ut-qa-j.ha { color: ${T.accent}; font-weight: 700; }
        .ut-uya, .ut-keyin { display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 12px; border: 1.5px dashed ${T.line}; }
        .ut-uya { border-color: ${T.accent}; }
        .ut-uya-l { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.accent}; }
        .ut-keyin .ut-uya-l { color: ${T.ink2}; }
        .ut-keyin { border-style: solid; background: ${T.bg}; }
        .ut-uya-bosh { height: 40px; border-radius: 10px; background: ${T.accentSoft}; opacity: .5; }

        /* --- s10 kod --- */
        .ut-darvoza { display: flex; flex-direction: column; gap: 8px; }
        .ut-darvoza-s { font-weight: 700; font-size: 14.5px; color: ${T.ink}; }
        .ut-tanlov { display: flex; flex-wrap: wrap; gap: 8px; }
        .ut-yordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .ut-kodoyna { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ut-kod { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; user-select: none; -webkit-user-select: none; }
        .ut-kod-izoh { color: ${CODE.comment}; }
        .ut-kod-q { border-radius: 4px; transition: background .4s; }
        .ut-kod.ajrat .ut-kod-q { background: rgba(255,211,128,0.16); }
        .ut-kod-t { color: ${CODE.attr}; }
        .ut-kod-62 { display: inline-block; margin-left: 10px; padding: 0 8px; border-radius: 999px; background: ${CODE.attr}; color: ${CODE.bg}; font-weight: 800; animation: ut-kir .35s ease-out both; }
        .lesson-root ol.ut-kvazifa, .lesson-root ol.ut-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .ut-kvazifa li, .ut-hw-qadam li { display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .ut-kvazifa li i, .ut-hw-qadam li i { flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; background: ${T.accentSoft}; color: ${T.accent}; }

        /* --- s12 juftlik --- */
        .ut-taymer-q { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ut-taymer-yol { flex: 1; min-width: 80px; height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .ut-taymer-yol i { display: block; height: 100%; background: ${T.accent}; transition: width 1s linear; }
        .ut-haq { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .ut-haq-s { font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .ut-haq .q-chip { padding: 4px 10px; font-size: 12px; }
        .ut-q.tanlov { cursor: pointer; }

        /* --- uyga vazifa (PM HwCard) --- */
        .ut-hw { display: flex; flex-direction: column; gap: 12px; }
        .ut-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ut-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .ut-hw-k { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .ut-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.35; }
        .ut-hw-vazifa { display: block; margin-top: 4px; color: ${T.accent}; }
        .ut-hw-keyingi { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }

        /* === kartochkalar — qolipda (QKartochka); SABOQ 16: karta yuzi halqada, ostida ko'rsatma === */
        .ut-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: ut-fc-halqa 1.6s ease-out 3; }
        @keyframes ut-fc-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        p.ut-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .ut-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ut-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes ut-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }

        @media (max-width: 760px) {
          .ut-ikki, .ut-hw-karta { grid-template-columns: minmax(0,1fr); }
          .ut-fm-ichi { grid-template-columns: minmax(0,1fr); }
          .ut-fm-savat { display: none; }
          .ut-fm-oyna { width: 300px; }
          .ut-pufak.oyinchi { left: -6px; }
          .ut-pufak.siz { right: -8px; }
          .ut-fm-ustun { height: 120px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ut-halqa, .ut-tel-ichi, .ut-m-katak { transition: none !important; }
          .ut-halqa.aylan, .ut-tel-ichi.qidir .ut-m-kataklar, .ut-halqa-bos, .ut-pufak, .ut-m-toast, .ut-m-inp.toldi::after, .ut-m-forma, .ut-m-kun b,
          .ut-q.yangi, .ut-q-y.bir, .ut-yozuv.yonib .ut-q.bosh, .ut-yozuv-nom, .ut-tel-yorliq, .ut-taxmin-q, .ut-mini,
          .ut-voqea, .ut-tanish, .ut-fm-t.yangi, .ut-fm-gap, .ut-fm-royxat, .ut-fm-u.keyin, .ut-karta.tanlandi, .ut-kod-62 { animation: none !important; }
          .ut-m-toast.qayta { opacity: 1; }
          .ut-bos, .ut-bos-nav, .q-variant, .q-chip:not(.q-silk), .q-test-v, .ut-karta, .ut-kirit, .ut-flash.yangi .fc-card:not(.flip) .fc-front, .ut-fc-ipucha i { animation: none !important; }
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
