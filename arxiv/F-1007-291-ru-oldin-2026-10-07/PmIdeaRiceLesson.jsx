import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul 2-dars «Oltita g'oyadan qaysi uchtasi qoladi?» (m9-02, PM 2-tur) — MD v3: feedback/F-1005-11modul/02-PmIdeaRice-v3.md (GATE M).
// Skeletdan (src/skelet/NamunaDars.jsx) qurildi: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — skeletniki.
// 16 ekran: s0 QKirish · s1 QReja · s2/s4 QTushuncha (keng) · s3/s5/s7/s12 test (QuestionScreen → QTest) · s6 QVoqea (K14 Instagram Stories) ·
//   s8/s9/s10 QMustaqil (saralash · RICE · juftlik) · s11 QKod (VS Code) · podium · QKartochka · QYakun (+ PM HwCard).
// Saqlash: o'qiydi pm-m9d1-goyalar (1-dars) · yozadi pm-m9d2-rice (3, 6-darslar o'qiydi; tayanch 8 aynan).
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

const LESSON_META = { lessonId: 'pm-m9d2-v1', lessonTitle: { uz: "Oltita g'oyadan qaysi uchtasi qoladi?", ru: 'Какие три из шести идей останутся?' } };
// 16 ekran · PM 2-tur (artefakt — saralangan g'oyalar va RICE jadvali, pm-m9d2-rice) · ballik testlar 3, 5, 7, 12 (✔ B · D · A · C)
const HW_TOKENS = [
  { t: { uz: "g'oya", ru: 'идея' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'RICE', ru: 'RICE' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'tanish', ru: 'знакомый' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'uchta', ru: 'три' }, l: 78, tp: 68, s: 13, d: 6.8 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `saralash/rice/juftlik/koding: -1` — mashq sentineli (variant yo'q, 500+ zona).
// ✔ o'rni MD dagidek: s3 — B · s5 — D · s7 — A · s12 — C (yangi dars, birinchi marta belgilangan).
const INLINE_KEYS = { s3: 1, s5: 3, s7: 0, s12: 2, saralash: -1, rice: -1, juftlik: -1, koding: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rnida raqam (S-026)
const RECAPS = {
  3: { title: { uz: 'Real auditoriya', ru: 'Реальная аудитория' }, cards: [
    { ic: '1', h: { uz: 'Uch savol: bajariladimi, real auditoriya bormi, qiziqmi.', ru: 'Три вопроса: выполнимо ли, есть ли реальная аудитория, интересно ли.' } },
    { ic: '2', h: { uz: 'Real auditoriya savoli — gaplasha oladigan kamida 5 tanishingiz bormi.', ru: 'Вопрос о реальной аудитории — есть ли хотя бы 5 знакомых для разговора.' } },
    { ic: '3', h: { uz: "Bitta «yo'q» bo'lsa, g'oya chetda qoladi.", ru: 'При одном «нет» идея остаётся в стороне.' }, ask: { uz: "Qog'ozingizdagi tanishga o'xshash yana kimlarni bilasiz?", ru: 'Кого ещё, похожего на знакомого с вашего листка, вы знаете?' } }
  ] },
  5: { title: { uz: 'RICE hisobi', ru: 'Расчёт RICE' }, cards: [
    { ic: '1', h: { uz: "Qamrovni ta'sirga ko'paytiring.", ru: 'Умножьте охват на влияние.' } },
    { ic: '2', h: { uz: "Keyin ishonchga ko'paytiring: 80% — 0,8.", ru: 'Потом умножьте на уверенность: 80% — 0,8.' } },
    { ic: '3', h: { uz: "Oxirida mehnatga bo'ling.", ru: 'В конце разделите на усилия.' }, ask: { uz: "Mehnat ikki baravar oshsa, baho nima bo'ladi?", ru: 'Что будет с оценкой, если усилия вырастут вдвое?' } }
  ] },
  7: { title: { uz: 'Instagram Stories', ru: 'Instagram Stories' }, cards: [
    { ic: '1', h: { uz: "Stories'ni Snapchat o'ylab topgan.", ru: 'Stories придумал Snapchat.' } },
    { ic: '2', h: { uz: "2016-yilda Instagram formatni ochiq oldi; u yerda tayyor katta auditoriya bor edi.", ru: 'В 2016 году Instagram открыто взял формат; там уже была большая аудитория.' } },
    { ic: '3', h: { uz: "Format Instagram'da ko'proq ishlatildi — RICE da bu qamrov.", ru: 'Формат больше использовали в Instagram — в RICE это охват.' }, ask: { uz: "G'oyangiz qayerda ko'proq odamga yetadi?", ru: 'Где ваша идея дойдёт до большего числа людей?' } }
  ] },
  12: { title: { uz: 'RICE — hukm emas', ru: 'RICE — не приговор' }, cards: [
    { ic: '1', h: { uz: 'RICE sonlari — taxmin.', ru: 'Числа RICE — догадки.' } },
    { ic: '2', h: { uz: 'Qarorga sonlardan tashqari dalil ham kerak.', ru: 'Для решения нужны доказательства помимо чисел.' } },
    { ic: '3', h: { uz: 'Ikkitani almashtirsangiz, sababini yozasiz.', ru: 'Если заменяете две, пишете причину.' }, ask: { uz: "RICE da uchinchi bo'lgan g'oyani qachon tanlasa bo'ladi?", ru: 'Когда можно выбрать идею, ставшую в RICE третьей?' } }
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
// Ochilgan yordam/izoh 1280×800 da panel ostida qolmasin — bir marta ko'rinadigan joyga suriladi (F-1007-289)
const Korinsin = ({ className, children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { const el = ref.current; if (el && el.scrollIntoView) el.scrollIntoView({ behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); }, 120); return () => clearTimeout(t); }, []);
  return <div ref={ref} className={className}>{children}</div>;
};
const TestViz = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 650); return () => clearTimeout(t); }, []);
  return <div ref={ref} className="ri-test-viz fade-step">{children}</div>;
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 2-dars «Oltita g'oyadan qaysi uchtasi qoladi?» (MD v3: feedback/F-1005-11modul/02-PmIdeaRice-v3.md, GATE M) =====
// Bitta vizual (163/180): g'oyalar jadvali GoyaJadval (saralash · RICE) + RiceFormula; bitta manba — MENTOR_GOYALAR, MENTOR_SARALASH, MENTOR_RICE va o'quvchi ma'lumoti.
// qolip-maket: ri-sv ri-th-b ri-hy ri-tl ri-son-b ri-bel ri-gq-b
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Kasr ko'rinishi — vergul bilan («0,5», «3,75»); kodda nuqta (MD KOD 3)
const sonT = (x) => (x === null || x === undefined || Number.isNaN(x) ? '' : String(Math.round(x * 100) / 100).replace('.', ','));
const foizT = (v) => `${Math.round(v * 100)}%`;
const riceHisob = (b) => (b && b.mehnat ? Math.round((b.qamrov * b.tasir * b.ishonch / b.mehnat) * 100) / 100 : 0);
// Harakatsizlikda bitta ipucha (javobni aytmaydi): kalit o'zgarsa sanoq qaytadan boshlanadi
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
// Son sanab o'sadi (SABOQ 19): ko'rsatilgan qiymat maqsadga silliq yetadi; kam harakat rejimida — birdan
const useSanoqK = (son, ms = 650) => {
  const [k, setK] = useState(son);
  const oldin = useRef(son);
  useEffect(() => {
    const dan = typeof oldin.current === 'number' ? oldin.current : 0;
    oldin.current = son;
    if (typeof son !== 'number' || kamHarakat() || dan === son) { setK(son); return undefined; }
    let raf = 0; const t0 = performance.now();
    const qadam = (t) => { const p = Math.min(1, (t - t0) / ms); setK(dan + (son - dan) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(qadam); };
    raf = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(raf);
  }, [son, ms]);
  return k;
};
const Son = ({ v, foiz }) => { const k = useSanoqK(v); return <>{typeof k === 'number' ? (foiz ? foizT(k) : sonT(k)) : ''}</>; };
// Uchish (SABOQ 19): narsa joyidan yangi joyiga uchadi — manba to'rtburchagi bosishda olinadi, yangi element (data-uch) chizilgach o'sha nuqtadan suriladi
const uchir = (dan, el, ms = 560) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width; // .lesson-root zoom tuzatmasi
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.3, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const q = useRef([]);
  useLayoutEffect(() => {
    if (!q.current.length) return;
    const navbat = q.current; q.current = [];
    navbat.forEach(u => uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback((manba, k, ms) => {
    const r = manba && (manba.getBoundingClientRect ? manba.getBoundingClientRect() : manba);
    if (r) q.current.push({ r, k, ms });
  }, []);
};
// Qayta tartiblash (FLIP, MD KOD 2): data-fk li qatorlar eski joyidan yangi joyiga silliq siljiydi; kalit o'zgarganda ishlaydi
const useFlip = (ref, kalit) => {
  const oldin = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r0 = el.getBoundingClientRect();
    const z = r0.width ? el.offsetWidth / r0.width : 1;
    const yangi = {};
    const nodes = el.querySelectorAll('[data-fk]');
    nodes.forEach(n => { const r = n.getBoundingClientRect(); yangi[n.dataset.fk] = { x: (r.left - r0.left) * z, y: (r.top - r0.top) * z }; });
    const o = oldin.current;
    if (o && !kamHarakat()) nodes.forEach(n => {
      const a = o[n.dataset.fk], b = yangi[n.dataset.fk];
      if (!a || !n.animate) return;
      const dx = a.x - b.x, dy = a.y - b.y;
      if (Math.abs(dx) + Math.abs(dy) < 2) return;
      n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
    oldin.current = yangi;
  }, [kalit]); // eslint-disable-line
};
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="ri-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="ri-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="ri-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
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
  return <p className={cxx('ri-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
};
// Jonli dars: hook ovozlari chizig'i (sof so'rovnoma, J-026) — har variant va ovozlar soni
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
    <div className="ri-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('ri-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="ri-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};
// Mentor statistikasi (8, 9, 10-ekran): jonli darsda o'quvchilar yuborgan ishtirok-signali (500+ zona) bo'yicha sonlar
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
  return <div className="ri-mstat fade-up">{yorliqlar.map((y, i) => <div key={i} className="ri-mstat-q"><b>{sonlar[i]}</b><span>{tr(y)}</span></div>)}</div>;
};
// Bashorat tanlangach ixcham qator (SABOQ 11): natijagacha turadi
const BashQator = ({ savol, javob }) => (
  <div className="ri-bashq fade-step"><span>{savol}</span><span className="ri-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>
);
// Natija qatori — xulosaning birinchi qatori (SABOQ 25)
const TaxminQator = ({ togri, javob, haqiqat }) => (
  <span className={cxx('ri-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {javob} <b className="yoq">✕</b> · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);

// ----- Ma'lumot: Mentorning 6 g'oyasi (tayanch 1.1 aynan — 1-dars bilan bir), saralash va RICE (tayanch 1.2 aynan) -----
const MANBA_T = { royxat: { uz: "9-Modul ro'yxati", ru: 'Список 9-го модуля' }, keyin: { uz: '«Keyin» qutisi', ru: 'Коробка «Потом»' }, kuzatuv: { uz: 'Yangi kuzatuv', ru: 'Новое наблюдение' } };
const QISM = [
  { k: 'muammo', t: { uz: 'Muammo', ru: 'Проблема' } },
  { k: 'kim', t: { uz: 'Kim uchun', ru: 'Для кого' } },
  { k: 'yechim', t: { uz: 'Yechim', ru: 'Решение' } }
];
const MENTOR_GOYALAR = [
  { nom: { uz: "Jamoa yig'ish", ru: 'Сбор команды' }, muammo: { uz: "o'yinga odam yetmaydi, kim kelishi noma'lum", ru: 'на игру не хватает людей, неизвестно, кто придёт' }, kim: { uz: "mahalladagi o'yinchilar", ru: 'игроки из махалли' }, yechim: { uz: "o'yin e'loni va «Qo'shilaman»", ru: 'объявление об игре и «Присоединяюсь»' }, manba: 'keyin' },
  { nom: { uz: "Maydon pulini bo'lishish", ru: 'Делить плату за поле' }, muammo: { uz: "kim qancha to'lagani unutiladi", ru: 'забывается, кто сколько заплатил' }, kim: { uz: "maydonni birga band qiladigan o'yinchilar", ru: 'игроки, которые вместе бронируют поле' }, yechim: { uz: "kim to'lagani ro'yxati", ru: 'список, кто заплатил' }, manba: 'keyin' },
  { nom: { uz: "Mahalla to'garaklari", ru: 'Кружки махалли' }, muammo: { uz: "qaysi to'garak qayerda va qachon — bilinmaydi", ru: 'какой кружок где и когда — неизвестно' }, kim: { uz: "to'garak izlayotgan o'smirlar", ru: 'подростки, которые ищут кружок' }, yechim: { uz: "to'garaklar xaritasi va jadvali", ru: 'карта и расписание кружков' }, manba: 'kuzatuv' },
  { nom: { uz: 'Sinf uy vazifalari', ru: 'Домашние задания класса' }, muammo: { uz: "uy vazifasi chatlarda yo'qoladi", ru: 'домашнее задание теряется в чатах' }, kim: { uz: 'sinfdoshlar', ru: 'одноклассники' }, yechim: { uz: "har fan bo'yicha vazifalar bir joyda", ru: 'задания по каждому предмету в одном месте' }, manba: 'kuzatuv' },
  { nom: { uz: 'Eski darsliklar', ru: 'Старые учебники' }, muammo: { uz: 'eski darsligini kimga berishni bilmaydi, u uyda yillab turadi', ru: 'не знает, кому отдать старый учебник, и он годами лежит дома' }, kim: { uz: "o'quvchilar", ru: 'ученики' }, yechim: { uz: "ishlatilgan darsliklar e'loni", ru: 'объявления о б/у учебниках' }, manba: 'royxat' },
  { nom: { uz: "Yo'qolgan buyumlar", ru: 'Потерянные вещи' }, muammo: { uz: "maktabda yo'qolgan narsa topilmaydi", ru: 'потерянную в школе вещь не найти' }, kim: { uz: "maktab o'quvchilari", ru: 'ученики школы' }, yechim: { uz: "topilgan buyumlar e'loni", ru: 'объявления о найденных вещах' }, manba: 'kuzatuv' }
];
// Uch savol — bitta manba (s2, s3 javob karta, s8, recap 3, kartochka 1–2; tayanch 1.2, siz-forma — 9.48)
const SAVOLLAR = [
  { k: 'b', q: { uz: 'Bajariladimi?', ru: 'Выполнимо?' }, t: { uz: 'Birinchi versiyasini shu modulning 6 haftasida qura olasizmi?', ru: 'Сможете построить первую версию за 6 недель этого модуля?' } },
  { k: 'a', q: { uz: 'Real auditoriya bormi?', ru: 'Есть реальная аудитория?' }, t: { uz: 'Gaplasha oladigan kamida 5 tanishingiz bormi?', ru: 'Есть хотя бы 5 знакомых, с кем можно поговорить?' } },
  { k: 'q', q: { uz: 'Qiziqmi?', ru: 'Интересно?' }, t: { uz: 'Bitiruvgacha shu ustida ishlashni xohlaysizmi?', ru: 'Хотите работать над этим до выпуска?' } }
];
// Mentor saralashi (A-bo'lim jadvali): ha 1 · yo'q 0 · so'ralmadi null; sabab — yorliq (siz-forma emas)
const MENTOR_SARALASH = [
  { b: 1, a: 1, q: 1 }, { b: 1, a: 1, q: 1 }, { b: 1, a: 1, q: 1 }, { b: 1, a: 1, q: 1 },
  { b: 0, a: null, q: null, sabab: { uz: 'pul va yetkazish kerak', ru: 'нужны деньги и доставка' } },
  { b: 1, a: 0, q: null, sabab: { uz: 'kamida 5 tanish topilmadi', ru: 'не нашлось 5 знакомых' } }
];
// Mentor RICE (tayanch 1.2 aynan; kirish tartibi — 2-ekrandagi: 1, 2, 3, 4; taxminlar, ishonch — intervyudan oldingi holat)
const MENTOR_RICE = [
  { goya: 0, qamrov: 60, tasir: 2, ishonch: 0.8, mehnat: 4, rice: 24 },
  { goya: 1, qamrov: 30, tasir: 1, ishonch: 0.5, mehnat: 3, rice: 5 },
  { goya: 2, qamrov: 80, tasir: 1, ishonch: 0.5, mehnat: 2, rice: 20 },
  { goya: 3, qamrov: 30, tasir: 0.5, ishonch: 0.5, mehnat: 2, rice: 3.75 }
];
const TASIR_SHKALA = [
  { v: 3, t: { uz: 'juda katta', ru: 'очень большое' } }, { v: 2, t: { uz: 'katta', ru: 'большое' } }, { v: 1, t: { uz: "o'rta", ru: 'среднее' } },
  { v: 0.5, t: { uz: 'kichik', ru: 'малое' } }, { v: 0.25, t: { uz: 'juda kichik', ru: 'очень малое' } }
];
const ISHONCH_SHKALA = [
  { v: 1, t: { uz: "o'lchangan son bor", ru: 'есть измеренное число' } }, { v: 0.8, t: { uz: 'dalil bor', ru: 'есть доказательство' } }, { v: 0.5, t: { uz: 'faqat taxmin', ru: 'только догадка' } }
];
const MEHNAT_HAFTA = [1, 2, 3, 4, 5, 6];
// RICE ustunlari: sarlavha avval savol, ochilgach nom (T-011)
const USTUNLAR = [
  { k: 'qamrov', n: { uz: 'Qamrov', ru: 'Охват' }, s: { uz: 'Bir oyda nechta odamga yetadi?', ru: 'Скольким людям в месяц дойдёт?' } },
  { k: 'tasir', n: { uz: "Ta'sir", ru: 'Влияние' }, s: { uz: 'Bitta odamga qancha foyda?', ru: 'Сколько пользы одному человеку?' } },
  { k: 'ishonch', n: { uz: 'Ishonch', ru: 'Уверенность' }, s: { uz: 'Taxminga qanchalik ishonasiz?', ru: 'Насколько вы уверены в догадке?' } },
  { k: 'mehnat', n: { uz: 'Mehnat', ru: 'Усилия' }, s: { uz: 'Bitta odam necha hafta ishlaydi?', ru: 'Сколько недель работает один человек?' } },
  { k: 'rice', n: { uz: 'RICE', ru: 'RICE' }, s: { uz: 'Hisoblash', ru: 'Посчитать' } }
];
const DALIL_JAMOA = { uz: "9-Modul intervyusi: 5 kishidan 2 tasi «jamoaga odam yetmadi»", ru: 'Интервью 9-го модуля: 2 из 5 человек — «не хватило людей в команду»' };
const qiymatT = (k, v) => (k === 'ishonch' ? foizT(v) : sonT(v));

// ----- O'quvchi ma'lumoti: 1-dars `pm-m9d1-goyalar` (indeks o'zgarmaydi — 02-FILTR 20) va shu darsning `pm-m9d2-rice` (tayanch 8 aynan) -----
const GOYA_KEY = 'pm-m9d1-goyalar';
const RICE_KEY = 'pm-m9d2-rice';
const goyalarLs = () => {
  const v = lsGet(GOYA_KEY);
  const ro = v && Array.isArray(v.goyalar) ? v.goyalar : [];
  return ro.map((g, i) => (g && g.muammo && g.kim && g.yechim ? { muammo: String(g.muammo), kim: String(g.kim), yechim: String(g.yechim), manba: g.manba || null, i } : null)).filter(Boolean).slice(0, 6);
};
const riceLs = () => { const v = lsGet(RICE_KEY); return v && typeof v === 'object' ? v : {}; };
const riceYoz = (yangi) => lsSet(RICE_KEY, { ...riceLs(), ...yangi, savedAt: Date.now() });
// Ixcham ko'rinishda yechim qisqa «…» (karta cho'zilmaydi — SABOQ 29)
const qisqa = (s, n = 34) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; };
// «Uchta» — RICE bo'yicha eng yuqori uchtasi (teng bo'lsa saralash tartibi) · «Ikkita» default — eng yuqori ikkitasi
const tartibla = (baho, otdi) => baho.slice().sort((x, y) => (y.rice - x.rice) || (otdi.indexOf(x.goya) - otdi.indexOf(y.goya)));
const uchtaHisob = (baho, otdi) => tartibla(baho, otdi).slice(0, 3).map(b => b.goya);

// ----- GoyaJadval: bitta vizual, ikki ko'rinish (saralash · rice) -----
// Saralash katagi: holat '?' | 1 (✓) | 0 (✕) | null (so'ralmadi «—»)
const Katak = ({ h, yangi, kech }) => (
  <span className={cxx('ri-kt', h === 1 && 'ok', h === 0 && 'yoq', h === null && 'yoqli', yangi && 'yangi')} style={yangi ? { animationDelay: `${kech || 0}ms` } : undefined} aria-hidden="true">
    {h === 1 ? '✓' : h === 0 ? '✕' : h === null ? '—' : '?'}
  </span>
);
// qatorlar: [{ fk, nom, kat: [h,h,h], sabab, chetda, yondi, yangiUst }] · qoldi — hisoblagich «Qoldi: n»
const SaralashJadval = ({ qatorlar, qoldi, sarlavha, kichik }) => {
  const ref = useRef(null);
  const otgan = qatorlar.filter(r => !r.chetda), chetda = qatorlar.filter(r => r.chetda);
  useFlip(ref, qatorlar.map(r => `${r.fk}${r.chetda ? 'c' : 'o'}`).join('|'));
  const k = useSanoqK(qoldi, 500);
  const qator = (r, i) => (
    <li key={r.fk} className={cxx('ri-sq', r.chetda && 'chetda', r.yondi && 'yondi')} data-fk={r.fk}>
      <span className="ri-sq-n">{tr(r.nom)}</span>
      <span className="ri-sq-k">{r.kat.map((h, j) => <Katak key={j} h={h} yangi={r.yangiUst === j} kech={i * 60} />)}</span>
      {r.sabab && <span className="ri-sq-s fade-step">{tr(r.sabab)}</span>}
    </li>
  );
  return (
    <div ref={ref} className={cxx('ri-jad', 'saralash', kichik && 'kichik')}>
      <div className="ri-jad-h">
        <span className="ri-yorliq">{sarlavha || tr({ uz: "Mentorning g'oyalari", ru: 'Идеи Ментора' })}</span>
        {typeof qoldi === 'number' && <b className="ri-qoldi">{tr({ uz: 'Qoldi', ru: 'Осталось' })}: <span key={Math.round(k)}>{Math.round(k)}</span></b>}
      </div>
      <ol className="ri-sq-ro">{otgan.map(qator)}</ol>
      {chetda.length > 0 && <div className="ri-chetda">
        <span className="ri-chetda-l">{tr({ uz: 'Chetda', ru: 'В стороне' })}</span>
        <ol className="ri-sq-ro">{chetda.map(qator)}</ol>
      </div>}
    </div>
  );
};
// RICE ko'rinishi: qatorlar × ustunlar; ochiq — nechta ustun ochilgan (0…5); ustunTugma — joriy ustun sarlavhasi tugma (halqada)
// qatorlar: [{ fk, nom, b: { qamrov, tasir, ishonch, mehnat, rice }, dalil, ajrat: ustun-kaliti, kul }] · uchta, ikkita — fk ro'yxati
const RiceJadval = ({ qatorlar, ochiq = 5, joriy = null, onUstun, faol = true, uchta = [], ikkita = [], ostiYorliq, tepaYorliq, belgi, kichik, savolOst = true }) => {
  const ref = useRef(null);
  useFlip(ref, qatorlar.map(r => r.fk).join('|'));
  return (
    <div ref={ref} className={cxx('ri-jad', 'rice', kichik && 'kichik', uchta.length > 0 && 'qavs')}>
      <div className="ri-tr ri-thr">
        <span className="ri-th ri-th-g">{tepaYorliq || tr({ uz: "G'oya", ru: 'Идея' })}</span>
        {USTUNLAR.map((u, j) => {
          const och = j < ochiq, jor = joriy === j;
          return (
            <span key={u.k} className={cxx('ri-th', och && 'och', jor && 'jor')}>
              {jor && onUstun
                ? <button type="button" className={cxx('ri-th-b', faol && 'ri-halqa')} disabled={!faol} onClick={onUstun}>{tr(u.s)}</button>
                : och ? <><b className="ri-th-n fade-step">{tr(u.n)}</b>{savolOst && j < 4 && <span className="ri-th-s">{tr(u.s)}</span>}</> : <span className="ri-th-q">{tr(u.s)}</span>}
              {!och && <span className="ri-th-m" aria-hidden="true">{j + 1}</span>}
            </span>
          );
        })}
      </div>
      <ol className="ri-tr-ro">
        {qatorlar.map((r, i) => {
          const u = uchta.indexOf(r.fk), ik = ikkita.includes(r.fk);
          return (
            <li key={r.fk} className={cxx('ri-tr', u >= 0 && 'uchta', u === 0 && 'u1', u === uchta.length - 1 && u >= 0 && 'uoxir', r.kul && 'kul', r.yondi && 'yondi')} data-fk={r.fk} data-ul={u === 0 ? tr({ uz: 'Uchta', ru: 'Три' }) : undefined}>
              <span className="ri-td ri-td-g">{belgi && belgi(r)}<span className="ri-td-nom">{r.nom}</span>{ik && <span className="ri-ikkita fade-step">{tr({ uz: 'Ikkita', ru: 'Две' })}</span>}</span>
              {USTUNLAR.map((c, j) => (
                <span key={c.k} className={cxx('ri-td', c.k === 'rice' && 'rice', r.ajrat === c.k && 'ajrat')} data-uch={`${r.fk}-${c.k}`}>
                  {j < ochiq && r.b && r.b[c.k] !== undefined && r.b[c.k] !== null
                    ? <b className="ri-td-v" key={`${c.k}${r.b[c.k]}`}><Son v={r.b[c.k]} foiz={c.k === 'ishonch'} /></b>
                    : <i className="ri-uzuq" />}
                </span>
              ))}
              {r.dalil && <span className="ri-dalil fade-step">{tr(r.dalil)}</span>}
            </li>
          );
        })}
      </ol>
      {ostiYorliq}
    </div>
  );
};
const GoyaJadval = ({ tur, ...p }) => (tur === 'rice' ? <RiceJadval {...p} /> : <SaralashJadval {...p} />);
// Formula kartasi (RiceFormula): «qamrov × ta'sir × ishonch ÷ mehnat = RICE»; sonlar uchib kiradi (data-uch), natija sanab o'sadi. Belgilar faqat shu kartada (T-035)
const RiceFormula = ({ b, uchKalit, kichik, children }) => (
  <div className={cxx('ri-fm', kichik && 'kichik', b && 'tola')}>
    <div className="ri-fm-q">
      {USTUNLAR.slice(0, 4).map((u, j) => (
        <React.Fragment key={u.k}>
          {j > 0 && <span className="ri-fm-z" aria-hidden="true">{j === 3 ? '÷' : '×'}</span>}
          <span className="ri-fm-b"><b className="ri-fm-v" data-uch={uchKalit ? `${uchKalit}-${u.k}` : undefined}>{b ? qiymatT(u.k, b[u.k]) : '·'}</b><span className="ri-fm-n">{tr(u.n).toLowerCase()}</span></span>
        </React.Fragment>
      ))}
      <span className="ri-fm-z" aria-hidden="true">=</span>
      <span className="ri-fm-b natija"><b className="ri-fm-v">{b ? <Son v={b.rice} /> : '·'}</b><span className="ri-fm-n">RICE</span></span>
    </div>
    {children}
  </div>
);
// Artefakt-strip «Uchta g'oyam» (U-042): 10, 11, 15-ekranlar — uch qisqa yechim · RICE
const UchtaStrip = () => {
  const r = riceLs(); const gl = goyalarLs();
  const baho = Array.isArray(r.baho) ? r.baho : [];
  const uchta = Array.isArray(r.uchta) ? r.uchta : [];
  if (!uchta.length) return null;
  return (
    <div className="ri-strip fade-up">
      <span className="ri-strip-l">{tr({ uz: "Uchta g'oyam", ru: 'Мои три идеи' })}</span>
      {uchta.map((gi, i) => { const g = gl.find(x => x.i === gi); const b = baho.find(x => x.goya === gi); return g ? <span key={gi} className="ri-strip-q"><i>{i + 1}</i>{qisqa(g.yechim, 22)} <b>{b ? sonT(b.rice) : ''}</b></span> : null; })}
    </div>
  );
};
// Brend nomi o'z rangida (PM-028/029, logotipsiz): Instagram — pushti-binafsha
const Instagram = () => <span className="ri-insta">Instagram</span>;
// Bosiladigan joy halqasi (SABOQ 11, 32): accent halqa doim, juda yengil to'lqin; guruhda bitta
const halqa = (on) => (on ? 'ri-halqa' : undefined);
const guruh = (on) => (on ? 'ri-guruh' : undefined);

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'qiziq', t: { uz: "O'zimga eng qiziq bo'lgan g'oyalar", ru: 'Самые интересные мне идеи' } },
  { id: 'kerak', t: { uz: "Ko'p odamga kerakli bo'lgan g'oyalar", ru: 'Идеи, нужные многим людям' } },
  { id: 'tez', t: { uz: "Eng tez qurib bo'ladigan g'oyalar", ru: 'Идеи, которые быстрее всего построить' } }
];
// Maket: «Mentorning g'oyalari · 6 / 6» (1-dars ro'yxati, bosilmaydi) + yo'l «6 g'oya → ? → 3 g'oya»; tanlovdan keyin qatorlar «?» tomonga siljib qaytadi, «3 g'oya» ostida uchta uzuq katak
const HookMaket = ({ tanlandi }) => (
  <div className={cxx('ri-s0m', tanlandi && 'tanlandi')}>
    <div className="ri-yol" aria-hidden="true">
      <span className="ri-yol-b">{tr({ uz: "6 g'oya", ru: '6 идей' })}</span>
      <span className="ri-yol-c" />
      <span className="ri-yol-s">?</span>
      <span className="ri-yol-c" />
      <span className="ri-yol-b uch">{tr({ uz: "3 g'oya", ru: '3 идеи' })}
        {tanlandi && <span className="ri-yol-k">{[0, 1, 2].map(i => <i key={i} style={{ animationDelay: `${0.55 + i * 0.1}s` }}>?</i>)}</span>}
      </span>
    </div>
    <div className="ri-mg">
      <div className="ri-mg-h"><span className="ri-yorliq">{tr({ uz: "Mentorning g'oyalari", ru: 'Идеи Ментора' })}</span><b className="ri-mg-son">6 / 6</b></div>
      <ol className="ri-mg-ro">{MENTOR_GOYALAR.map((g, i) => (
        <li key={i} className="ri-mg-q" style={{ '--i': i }}><span className="ri-mg-i">{i + 1}</span><span className="ri-mg-t">{tr(g.nom)}</span><span className="ri-manba">{tr(MANBA_T[g.manba])}</span></li>
      ))}</ol>
    </div>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('ri-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Oltita g'oyadan <A>qaysi uchtasi</A> qoladi?</>, ru: <>Какие <A>три из шести</A> идей останутся?</> })}
          mentor={<Mentor>{tr({ uz: "O'tgan darsda oltita g'oya yozildi, bitiruvgacha esa bittasi quriladi. O'zingizga yaqin javobni belgilang.", ru: 'На прошлом уроке написали шесть идей, а до выпуска будет построена одна. Отметьте близкий вам ответ.' })}</Mentor>}
          maket={<HookMaket tanlandi={picked !== null} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="ri-javob fade-step">{tr({ uz: 'Uchalasi ham hisobga olinadi. Mentor oltita g\'oyasini aynan shu uch tomondan ko\'rib chiqdi.', ru: 'Учитываются все три. Ментор рассмотрел свои шесть идей именно с этих трёх сторон.' })}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "1-dars uyga vazifasidagi qog'ozni (har g'oyaga bitta tanish) stolga chiqarib qo'yishni so'rang — 8-ekranda kerak. Hook'da to'g'ri javob yo'q: uch variant — dars savollarining uch tomoni (qiziqmi · odamlar · qura olish).", ru: 'Попросите положить на стол листок из домашнего задания 1-го урока (по одному знакомому на идею) — он нужен на 8-м экране. В хуке нет верного ответа: три варианта — три стороны вопросов урока (интересно ли · люди · сможете ли построить).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Dars oxirida» — Mentorning oltita g'oyasi uch «?» katagi bilan, pastda «Uchta» uchun uch bo'sh joy; natija ochilmaydi — P-036, SABOQ 33) =====
const REJA = [
  { t: { uz: "Har g'oyaga uchta «ha / yo'q» savol berasiz", ru: 'Зададите каждой идее три вопроса «да / нет»' }, teg: { uz: 'saralash', ru: 'отбор' } },
  { t: { uz: "Savollardan o'tgan g'oyalarni to'rt son bilan baholaysiz", ru: 'Оцените прошедшие вопросы идеи четырьмя числами' }, teg: { uz: 'RICE', ru: 'RICE' } },
  { t: { uz: <><Instagram /> Stories qayerda ko'p ishlatilganini ko'rasiz</>, ru: <>Увидите, где больше пользовались <Instagram /> Stories</> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: 'Bitta soningizni sherigingizga tushuntirasiz', ru: 'Объясните партнёру одно своё число' }, teg: { uz: 'juftlik', ru: 'пара' } }
];
const RejaChizma = () => (
  <div className="ri-rj">
    <ol className="ri-rj-ro">{MENTOR_GOYALAR.map((g, i) => (
      <li key={i} className="ri-rj-q" style={{ '--i': i }}><span className="ri-rj-t">{tr(g.nom)}</span><span className="ri-rj-k" aria-hidden="true">{[0, 1, 2].map(j => <i key={j}>?</i>)}</span></li>
    ))}</ol>
    <div className="ri-rj-uch"><span className="ri-rj-uch-l">{tr({ uz: 'Uchta', ru: 'Три' })}</span>{[0, 1, 2].map(j => <i key={j} style={{ '--j': j }}>?</i>)}</div>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun oltita g'oyadan <A>uchtasini</A> tanlab olasiz.</>, ru: <>Сегодня вы выберете <A>три</A> из шести идей.</> })}
      mentor={<Mentor>{tr({ uz: 'User Story darsida hikoyalarga navbat belgilagansiz (prioritet). Bugun oltita g\'oyaga navbatni savollar va sonlar bilan belgilaysiz.', ru: 'На уроке User Story вы расставляли историям очерёдность (приоритет). Сегодня расставите очерёдность шести идеям вопросами и числами.' })}</Mentor>}
      chapYorliq={<>{tr({ uz: 'Dars oxirida: saralash va ', ru: 'В конце урока: отбор и оценка ' })}<span className="ri-kulteg">RICE</span>{tr({ uz: ' bahosi', ru: '' })}</>}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — UCH SAVOL (QTushuncha markaziy, keng: bashorat → uch savol-tugma → GoyaJadval saralash o'zgaradi → atama «saralash» misoldan keyin) =====
const S2_TAXMIN = [{ k: '2', t: { uz: '2 ta', ru: '2' } }, { k: '4', t: { uz: '4 ta', ru: '4' } }, { k: '5', t: { uz: '5 ta', ru: '5' } }];
const S2_SAVOL = { uz: "Oltita g'oyadan nechtasi uch savoldan o'tadi?", ru: 'Сколько из шести идей пройдут три вопроса?' };
const SK = ['b', 'a', 'q'];
// Mentor qatorlari: q — nechta savol bosilgan, kq — chetga surilish qo'llangan savollar soni (✓/✕ tushgach ~0,8 s keyin)
const s2Qatorlar = (q, kq) => MENTOR_GOYALAR.map((g, i) => {
  const s = MENTOR_SARALASH[i];
  const vals = SK.map(k => s[k]);
  const yiq = vals.indexOf(0);
  const chetda = yiq >= 0 && yiq < kq;
  const kat = vals.map((v, j) => (j < q ? (yiq >= 0 && j > yiq ? null : v) : (yiq >= 0 && yiq < q ? null : '?')));
  return { fk: `m${i}`, nom: g.nom, kat, chetda, sabab: yiq >= 0 && yiq < q ? s.sabab : null, yangiUst: q > 0 && (yiq < 0 || q - 1 <= yiq) ? q - 1 : null, yondi: q >= 3 && kq >= 3 && yiq < 0 };
});
const SavolTugmalar = ({ q, faol, onBos }) => (
  <div className="ri-svr">
    {SAVOLLAR.map((s, j) => {
      const jor = j === q, bosildi = j < q;
      return (
        <button key={s.k} type="button" className={cxx('ri-sv', bosildi && 'bosildi', jor && faol && 'ri-halqa')} disabled={!jor || !faol} onClick={onBos}>
          <span className="ri-sv-n">{bosildi ? '✓' : j + 1}</span>
          <span className="ri-sv-b"><b>{tr(s.q)}</b><span>{tr(s.t)}</span></span>
        </button>
      );
    })}
  </div>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [kq, setKq] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3 && kq >= 3;
  useEffect(() => { if (kq === q) return undefined; const t = setTimeout(() => setKq(q), kamHarakat() ? 0 : 850); return () => clearTimeout(t); }, [q, kq]);
  const tugadi = useTugadi(done, 2200, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const qatorlar = s2Qatorlar(q, kq);
  const qoldi = qatorlar.filter(r => !r.chetda).length;
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · saralash', ru: 'Понятие · отбор' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni bosing', ru: 'Нажмите на вопросы' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentorning qaysi g'oyalari <A>uch savoldan</A> o'tadi?</>, ru: <>Какие идеи Ментора пройдут <A>три вопроса?</A></> })}
        mentor={<Mentor>{tr({ uz: "Savollarni tartib bilan bosing — har biridan keyin ro'yxatga qarang.", ru: 'Нажимайте вопросы по порядку — после каждого смотрите на список.' })}</Mentor>}
        bashorat={!taxmin
          ? <div className="ri-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(t => ({ k: t.k, t: tr(t.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <BashQator savol={tr(S2_SAVOL)} javob={tr(tx.t)} />}
        vizual={<div className={cxx('ri-s2', tugadi && 'tinch')}>
          {tugadi
            ? <span className="ri-yigdi fade-step">{tr({ uz: '3 savol', ru: '3 вопроса' })} <b>✓</b></span>
            : <SavolTugmalar q={q} faol={!!taxmin && q === kq} onBos={() => setQ(v => Math.min(3, v + 1))} />}
          <GoyaJadval tur="saralash" qatorlar={qatorlar} qoldi={qoldi} />
          {q >= 3 && <QIzoh>{tr({ uz: "Uchala savolga «ha» olgan g'oya qoladi. G'oyalarni uch savol bilan ajratish saralash deyiladi.", ru: 'Остаётся идея, получившая «да» на все три вопроса. Разделение идей тремя вопросами называется отбором.' })}</QIzoh>}
        </div>}
        natija={!done && ipucha && <QIzoh>{tr({ uz: "Yoqilgan savolni bosing — ro'yxatda nima o'zgarishini ko'ring.", ru: 'Нажмите активный вопрос — посмотрите, что изменится в списке.' })}</QIzoh>}
        xulosa={done && <>{tx && <TaxminQator togri={taxmin === '4'} javob={tr(tx.t)} haqiqat={tr({ uz: '4 ta', ru: '4' })} />}{tr({ uz: "Bu misolda oltitadan to'rtta g'oya o'tdi. Qolgan ikkitasi o'chirilmadi — chetda turibdi.", ru: 'В этом примере из шести прошли четыре идеи. Остальные две не удалены — стоят в стороне.' })}</>}
      />
      <MentorNote>{tr({ uz: "6 hafta — shu modulning taxminiy davomi: birinchi versiya Demo Day 7 gacha quriladi. Chetdagi g'oyalar yomon emas — bu modulga mos kelmadi, xolos. Real auditoriya savoli muammo borligini isbotlamaydi — u faqat gaplashadigan odamlar borligini tekshiradi; muammoni odamlar bilan suhbat tekshiradi. Sinfdan so'rang: «Yo'qolgan buyumlar g'oyasi uchun 5 tanishni kimdan topsa bo'lardi?» — real auditoriya savoli 8-ekranda uyga vazifa qog'ozidan boshlanadi.", ru: '6 недель — примерная длина этого модуля: первая версия строится до Demo Day 7. Идеи в стороне не плохие — просто не подошли этому модулю. Вопрос о реальной аудитории не доказывает проблему — он лишь проверяет, есть ли люди для разговора; проблему проверяет разговор с людьми. Спросите класс: «Где для идеи о потерянных вещах можно найти 5 знакомых?» — на 8-м экране вопрос о реальной аудитории начинается с листка из домашнего задания.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s3 = 1; ikkinchi olam — sinfdosh g'oyasi, P-002; savol ustida yorliq yo'q — SABOQ 6) =====
const S3Vizual = () => (
  <div className="ri-tv3">
    <span className="ri-tv3-n">{tr({ uz: "Sinfdosh g'oyasi", ru: 'Идея одноклассника' })}</span>
    <span className="ri-tv3-k">
      {SAVOLLAR.map((s, j) => (
        <span key={s.k} className={cxx('ri-tv3-c', j === 1 && 'ajrat')}><small>{tr(s.q)}</small><b>{j === 1 ? '✕' : '?'}</b>{j === 1 && <em>{tr({ uz: '2 tanish', ru: '2 знакомых' })}</em>}</span>
      ))}
    </span>
    <span className="ri-chetda-chip">{tr({ uz: 'Chetda', ru: 'В стороне' })}</span>
  </div>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · real auditoriya', ru: 'Проверка · реальная аудитория' })}
    questionText="Sinfdoshingiz g'oyasi uchun faqat 2 tanishi bilan gaplasha oladi. Qaysi savolga «yo'q»?"
    question={tr({ uz: <h2 className="title h-ask">Sinfdoshingiz g'oyasi uchun faqat 2 tanishi bilan gaplasha oladi. <A>Qaysi savolga «yo'q»?</A></h2>, ru: <h2 className="title h-ask">Для своей идеи одноклассник может поговорить только с 2 знакомыми. <A>На какой вопрос «нет»?</A></h2> })}
    options={[
      { uz: 'Bajariladimi — 6 haftada qura oladimi', ru: 'Выполнимо — сможет ли построить за 6 недель' },
      { uz: 'Real auditoriya bormi — 5 tanishi bormi', ru: 'Есть реальная аудитория — есть ли 5 знакомых' },
      { uz: 'Qiziqmi — shu ustida ishlashni xohlaydimi', ru: 'Интересно — хочет ли над этим работать' },
      { uz: 'Hech biriga — tanishlar keyin ham topiladi', ru: 'Ни на какой — знакомых можно найти и потом' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Gaplasha oladigan kamida 5 tanish bo'lmasa, real auditoriya savoliga «yo'q».", ru: 'Если нет хотя бы 5 знакомых для разговора — на вопрос о реальной аудитории «нет».' }}
    explainWrong={{
      0: { uz: "Qura olish haqida savolda hech narsa yo'q.", ru: 'В вопросе ничего нет о том, сможет ли он построить.' },
      2: { uz: "Qiziqish haqida savolda gap yo'q — odamlarga qarang.", ru: 'Об интересе в вопросе речи нет — смотрите на людей.' },
      3: { uz: 'Ikki tanish kam: bu savolga kamida 5 kerak.', ru: 'Двух знакомых мало: для этого вопроса нужно хотя бы 5.' },
      default: { uz: 'Uch savolni eslang: qaysi biri odamlar haqida?', ru: 'Вспомните три вопроса: какой из них — о людях?' }
    }}
    vizual={<S3Vizual />} />
);

// ===== SCREEN 4 — TO'RT SON (QTushuncha markaziy, keng: ustun sarlavhalari — savol-tugmalar; «Hisoblash» → RiceFormula, RICE ustuni, qayta tartiblash, «Uchta» / «Ikkita») =====
const S4_TAXMIN = [{ k: '1', t: { uz: 'Birinchi', ru: 'Первой' } }, { k: '2', t: { uz: 'Ikkinchi', ru: 'Второй' } }, { k: '3', t: { uz: 'Uchinchi', ru: 'Третьей' } }];
const S4_SAVOL = { uz: "Qamrovi eng katta «Mahalla to'garaklari» oxirida nechanchi bo'ladi?", ru: 'Какой по счёту в конце окажется «Кружки махалли» с самым большим охватом?' };
const MENTOR_FK = (i) => `r${MENTOR_RICE[i].goya}`;
// Shkala qatori (ustun ostida): ta'sir — besh qiymat, ishonch — «Bu kursda:» bilan (02-FILTR 1); ishlatilgan qiymatlar bir lahza yonadi
const Shkala = ({ tur }) => (tur === 'tasir'
  ? <p className="ri-shk fade-step">{TASIR_SHKALA.map((s, i) => <span key={i} className={cxx('ri-shk-q', [2, 1, 0.5].includes(s.v) && 'ish')}><b>{sonT(s.v)}</b> {tr(s.t)}</span>)}</p>
  : <p className="ri-shk fade-step"><span className="ri-shk-l">{tr({ uz: 'Bu kursda:', ru: 'В этом курсе:' })}</span>{ISHONCH_SHKALA.map((s, i) => <span key={i} className={cxx('ri-shk-q', [0.8, 0.5].includes(s.v) && 'ish')}><b>{foizT(s.v)}</b> — {tr(s.t)}</span>)}</p>);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ochiq, setOchiq] = useState(storedAnswer ? 5 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [rq, setRq] = useState(storedAnswer ? 6 : 0);
  const uch = useUchish();
  const done = rq >= 6;
  // «Hisoblash»dan keyin: formula (1) → qolgan qatorlarga RICE navbat bilan (2–4) → qayta tartiblash (5) → «Uchta» / «Ikkita» (6)
  useEffect(() => {
    if (rq < 1 || rq >= 6) return undefined;
    const t = setTimeout(() => setRq(v => v + 1), kamHarakat() ? 0 : (rq === 1 ? 1300 : rq === 4 ? 900 : rq === 5 ? 800 : 480));
    return () => clearTimeout(t);
  }, [rq]);
  const tugadi = useTugadi(done, 1600, !!storedAnswer);
  const ipucha = useIpucha(!done && (ochiq === 0 || !!taxmin), ochiq);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const faol = ochiq === 0 || !!taxmin;
  const ustunBos = () => {
    if (!faol || ochiq >= 5) return;
    if (ochiq === 4) {
      ['qamrov', 'tasir', 'ishonch', 'mehnat'].forEach(k => uch(document.querySelector(`.lesson-root [data-uch="r0-${k}"]`), `s4f-${k}`, 620));
      setOchiq(5); setRq(1);
    } else setOchiq(ochiq + 1);
  };
  const tartib = rq >= 5 ? [0, 2, 1, 3] : [0, 1, 2, 3];
  const qatorlar = tartib.map((i, j) => {
    const m = MENTOR_RICE[i];
    const riceKor = (i === 0 && rq >= 1) || (i === 1 && rq >= 2) || (i === 2 && rq >= 3) || (i === 3 && rq >= 4);
    return {
      fk: MENTOR_FK(i), nom: tr(MENTOR_GOYALAR[m.goya].nom), kul: rq >= 6 && j === 3,
      b: { qamrov: m.qamrov, tasir: m.tasir, ishonch: m.ishonch, mehnat: m.mehnat, rice: riceKor ? m.rice : null },
      dalil: i === 0 && ochiq >= 3 && !tugadi ? DALIL_JAMOA : null,
      ajrat: i === 2 && ochiq === 1 ? 'qamrov' : null
    };
  });
  const tx = S4_TAXMIN.find(t => t.k === taxmin);
  const kerakTaxmin = ochiq >= 1 && !taxmin;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · to'rt son", ru: 'Понятие · четыре числа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Ustunlarni oching', ru: 'Откройте столбцы' })} (${ochiq}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>To'rt g'oyadan qaysi uchtasi <A>oldinga chiqadi?</A></>, ru: <>Какие три из четырёх идей <A>выйдут вперёд?</A></> })}
        mentor={<Mentor>{tr({ uz: "To'rt g'oyaga birdaniga vaqt yetmaydi: jadval ustunlarini chapdan o'ngga birma-bir oching.", ru: 'На четыре идеи сразу времени не хватит: открывайте столбцы таблицы слева направо по одному.' })}</Mentor>}
        bashorat={kerakTaxmin
          ? <div className="ri-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={S4_TAXMIN.map(t => ({ k: t.k, t: tr(t.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : taxmin && !done && <BashQator savol={tr(S4_SAVOL)} javob={tr(tx.t)} />}
        vizual={<div className={cxx('ri-s4', tugadi && 'tinch')}>
          {!tugadi && ochiq < 5 && <div className="ri-mob-ust"><button type="button" className={cxx('ri-th-b', faol && 'ri-halqa')} disabled={!faol} onClick={ustunBos}><b>{ochiq + 1}/5</b> {tr(USTUNLAR[ochiq].s)}</button></div>}
          <GoyaJadval tur="rice" qatorlar={qatorlar} ochiq={ochiq} joriy={!tugadi && ochiq < 5 ? ochiq : null} onUstun={ustunBos} faol={faol}
            uchta={rq >= 6 ? ['r0', 'r2', 'r1'] : []} ikkita={rq >= 6 ? ['r0', 'r2'] : []}
            tepaYorliq={ochiq >= 1 && <span className="ri-kul fade-step">{tr({ uz: 'Sonlar — Mentorning taxmini', ru: 'Числа — догадка Ментора' })}</span>} />
          {ochiq === 2 && <Shkala tur="tasir" />}
          {ochiq === 3 && <Shkala tur="ishonch" />}
          {rq >= 1 && <RiceFormula b={MENTOR_RICE[0]} uchKalit="s4f">
            <QIzoh>{tr({ uz: "Bu baho RICE deyiladi. RICE — to'rt so'zning bosh harflari: Reach, Impact, Confidence, Effort.", ru: 'Эта оценка называется RICE. RICE — первые буквы четырёх слов: Reach, Impact, Confidence, Effort.' })}</QIzoh>
            <p className="ri-manba-q">{tr({ uz: 'RICE Intercom kompaniyasida (mijozlar bilan yozishadigan chat dasturi) o\'ylab topilgan. U yerda mehnat odam-oyda, bu kursda — haftada sanaladi.', ru: 'RICE придумали в компании Intercom (чат-сервис для переписки с клиентами). Там усилия считают в человеко-месяцах, в этом курсе — в неделях.' })}</p>
          </RiceFormula>}
        </div>}
        natija={!done && ipucha && <QIzoh>{tr({ uz: 'Yoqilgan ustun sarlavhasini bosing — kataklarga sonlar yoziladi.', ru: 'Нажмите активный заголовок столбца — в клетки впишутся числа.' })}</QIzoh>}
        xulosa={done && <>{tx && <TaxminQator togri={taxmin === '2'} javob={tr(tx.t).toLowerCase()} haqiqat={tr({ uz: 'ikkinchi', ru: 'второй' })} />}{tr({ uz: "Bu misolda qamrovi eng katta g'oya ikkinchi bo'ldi. RICE — tanlovga yordam, hukm emas.", ru: 'В этом примере идея с самым большим охватом стала второй. RICE — помощь в выборе, а не приговор.' })}</>}
      />
      <MentorNote>{tr({ uz: "Ko'prik — «Qaysi ishni birinchi qilasiz?» darsidagi ikki savol («nechta odam so'raydi», «qancha vaqt oladi») RICE da qamrov va mehnat bo'ldi; yangisi — ta'sir va ishonch. Jamoa yig'ishda ishonch 80% — 9-Modul intervyusidagi dalil; qolganlarida dalil yo'q — 50%. Mehnati eng ko'p g'oya birinchi chiqdi: ta'sir va ishonch uni ko'tardi — shuni sinf bilan ko'ring. «Ikkita» — jamoa yig'ish va mahalla to'garaklari: Mentor ular bo'yicha odamlar bilan gaplashadi (3–4-darslar; o'quvchilarga va'da qilib aytmang).", ru: 'Мостик — два вопроса из урока «Какую работу делать первой?» («сколько людей просит», «сколько времени займёт») в RICE стали охватом и усилиями; новое — влияние и уверенность. У сбора команды уверенность 80% — доказательство из интервью 9-го модуля; у остальных доказательств нет — 50%. Первой вышла идея с самыми большими усилиями: её подняли влияние и уверенность — разберите это с классом. «Две» — сбор команды и кружки махалли: по ним Ментор будет говорить с людьми (уроки 3–4; не обещайте ученикам).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s5 = 3; RICE hisobi — ikkinchi olam sonlari) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · RICE hisobi', ru: 'Проверка · расчёт RICE' })}
    questionText="G'oyangizda qamrov 120, ta'sir 0,5, ishonch 80%, mehnat 3. RICE qancha?"
    question={tr({ uz: <h2 className="title h-ask">G'oyangizda qamrov 120, ta'sir 0,5, ishonch 80%, mehnat 3. <A>RICE qancha?</A></h2>, ru: <h2 className="title h-ask">У вашей идеи охват 120, влияние 0,5, уверенность 80%, усилия 3. <A>Сколько RICE?</A></h2> })}
    options={['32', '48', '20', '16']} correctIdx={3}
    explainCorrect={{ uz: "120 ni 0,5 ga va 80% ga ko'paytirib, 3 ga bo'lsangiz, 16 chiqadi.", ru: 'Умножив 120 на 0,5 и на 80% и разделив на 3, получите 16.' }}
    explainWrong={{
      0: { uz: "Bu son ta'sirsiz chiqdi — to'rtala sonni ishlating.", ru: 'Это число без влияния — используйте все четыре числа.' },
      1: { uz: "Mehnatga bo'linmadi: ko'p mehnat bahoni kamaytiradi.", ru: 'Не поделили на усилия: большие усилия снижают оценку.' },
      2: { uz: "Bu son ishonchsiz chiqdi — to'rtala sonni ishlating.", ru: 'Это число без уверенности — используйте все четыре числа.' },
      default: { uz: "Qamrovni ta'sir va ishonchga ko'paytirib, mehnatga bo'ling.", ru: 'Умножьте охват на влияние и уверенность, разделите на усилия.' }
    }}
    vizual={<RiceFormula kichik b={{ qamrov: 120, tasir: 0.5, ishonch: 0.8, mehnat: 3, rice: 16 }} />} />
);

// ===== SCREEN 6 — INSTAGRAM STORIES (QVoqea, PM keys K14 — bank matni aynan, raqamsiz; nomlar o'z rangida, logotipsiz; bosqich gapi Mentorda) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K14 (raqamsiz, 2016) · tayanch 5 · Snapchat izohi — MATN_KORPUS §189 · Stories izohi — m3-05 (PmLesson8) bilan bir ma'noda.
const STORIES_BOSQICH = [
  { h: { uz: "Snapchat'da yangi format", ru: 'Новый формат в Snapchat' }, m: { uz: "Snapchat (yuborilgan surat ko'rilgach yo'qoladigan ilova) Stories'ni o'ylab topgan. Stories — bir kundan keyin o'chib ketadigan surat va videolar.", ru: 'Snapchat (приложение, где отправленное фото исчезает после просмотра) придумал Stories. Stories — фото и видео, которые исчезают через день.' } },
  { h: { uz: 'Instagram ham qo\'shdi', ru: 'Instagram тоже добавил' }, m: { uz: "2016-yilda Instagram shu formatni ochiq oldi. Instagram'da tayyor katta auditoriya bor edi.", ru: 'В 2016 году Instagram открыто взял этот формат. У Instagram уже была большая аудитория.' } },
  { h: { uz: "Format qayerda ko'p ishlatildi", ru: 'Где формат использовали больше' }, m: { uz: "Format aynan Instagram'da ko'proq ishlatildi. Bu voqeada g'oya muallifi emas, foydalanuvchiga yaxshiroq yetkazgan yutdi.", ru: 'Формат больше использовали именно в Instagram. В этой истории выиграл не автор идеи, а тот, кто лучше донёс её до пользователей.' } }
];
const ST_TAXMIN = [
  { k: 'snap', t: { uz: "Snapchat'da", ru: 'В Snapchat' } },
  { k: 'teng', t: { uz: 'Ikkalasida teng', ru: 'Поровну в обоих' } },
  { k: 'insta', ok: true, t: { uz: "Instagram'da", ru: 'В Instagram' } }
];
const ST_SAVOL = { uz: "Instagram ham Stories qo'shsa, format qayerda ko'proq ishlatiladi?", ru: 'Если Instagram тоже добавит Stories, где формат будут использовать больше?' };
// Odam (SVG guruh, SABOQ 36): bosh, soch, yuz belgisi, rangli kiyim, qo'lida telefon; (x, y) — yelka ostidagi nuqta
const OD_RANG = { teri: ['#EDC39C', '#C98E62', '#E3A87C'], soch: ['#2E2019', '#5B3A24', '#1F1A19'], kiyim: ['#E07A5F', '#3E7CB1', '#E9A23B', '#7B61C9', '#2F9E7A', '#D96C8A'] };
const Odamcha = ({ x, y, s = 1, teri = 0, soch = 0, kiyim = 0, uzun, i = 0, className }) => {
  const t = OD_RANG.teri[teri % 3], h = OD_RANG.soch[soch % 3], k = OD_RANG.kiyim[kiyim % 6];
  return (
    <g className={className} style={{ '--i': i }}><g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -15 0 Q -15 -19 0 -20 Q 15 -19 15 0 Z" fill={k} />
      <rect x="-3.2" y="-25" width="6.4" height="6" rx="2" fill={t} />
      <circle cx="0" cy="-33" r="9.5" fill={t} />
      {uzun && <path d="M -9.5 -34 C -11 -22, -8 -20, -4 -21 L -6 -31 Z" fill={h} />}
      <path d="M -10 -32 C -11 -46, 11 -46, 10 -32 C 6 -38, -2 -39, -10 -32 Z" fill={h} />
      <circle cx="-3.4" cy="-33" r="1.25" fill="#2A2730" /><circle cx="3.4" cy="-33" r="1.25" fill="#2A2730" />
      <path d="M -3 -28.6 Q 0 -26.4 3 -28.6" stroke="#8A4B3A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <rect x="6" y="-15" width="7" height="11" rx="1.6" fill="#2A2730" /><circle cx="9.5" cy="-5" r="3" fill={t} />
    </g></g>
  );
};
const ST_KAD = [[30, 40], [58, 40], [86, 40], [114, 40]];
const ST_ODAM_I = [[565, 156], [607, 156], [649, 156], [565, 222], [607, 222], [649, 222], [565, 288], [607, 288], [649, 288]];
const ST_ODAM_S = [[58, 156], [58, 222], [58, 288]];
// Doiracha (Stories halqasi + avatar): halqa rangi — ilova rangi
const Doira = ({ cx, cy, insta, cls, i }) => (
  <g className={cls} style={{ '--i': i }}>
    <circle cx={cx} cy={cy} r="11.5" fill={['#FFD6A5', '#BDE0FE', '#CDEAC0', '#FFC8DD'][i % 4]} stroke={insta ? 'url(#ri-ig)' : '#F2D500'} strokeWidth="2.6" />
    <circle cx={cx} cy={cy - 2.5} r="3.6" fill="#8C6B52" opacity="0.75" /><path d={`M ${cx - 6} ${cy + 7} Q ${cx} ${cy + 1} ${cx + 6} ${cy + 7}`} fill="#8C6B52" opacity="0.75" />
  </g>
);
const Post = ({ y, rang }) => (
  <g transform={`translate(0 ${y})`}>
    <circle cx="20" cy="8" r="6" fill="#E9D8C8" /><circle cx="20" cy="7" r="2.4" fill="#8C6B52" />
    <rect x="12" y="20" width="126" height="62" rx="6" fill={rang} />
    <circle cx="112" cy="36" r="8" fill="#FFE9A8" /><path d="M 12 74 L 46 48 L 74 70 L 96 54 L 138 78 L 138 82 L 12 82 Z" fill="#FFFFFF" opacity="0.55" />
    <path d="M 18 94 c -3 -4 -9 -1 -6 4 l 6 6 l 6 -6 c 3 -5 -3 -8 -6 -4 z" fill="none" stroke="#2A2730" strokeWidth="1.4" />
    <circle cx="40" cy="96" r="5" fill="none" stroke="#2A2730" strokeWidth="1.4" />
  </g>
);
// Sahna (SABOQ 2, 3, 8, 22, 26, 36): ikki telefon yonma-yon bir o'lchamda; bosqichga qarab o'zgaradi; logotip, son, sana-yorliq yo'q
const StoriesSahna = ({ b, tinch }) => (
  <svg className={cxx('ri-st', `b${b}`, tinch && 'tinch')} viewBox="0 0 680 312" role="img" aria-label={tr(STORIES_BOSQICH[b].h)}>
    <defs><linearGradient id="ri-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#F58529" /><stop offset="0.5" stopColor="#DD2A7B" /><stop offset="1" stopColor="#8134AF" /></linearGradient>
      <clipPath id="ri-st-ek"><rect x="7" y="10" width="136" height="242" rx="14" /></clipPath></defs>
    <rect x="147" y="8" width="96" height="26" rx="13" fill="#FFFC00" stroke="#E2CF00" />
    <text className="ri-st-nom" x="195" y="26" textAnchor="middle" fill="#1F1D27">Snapchat</text>
    <text className="ri-st-nom ig" x="465" y="27" textAnchor="middle" fill="url(#ri-ig)">Instagram</text>
    <g transform="translate(120 44)">
      <rect x="0" y="0" width="150" height="262" rx="22" fill="#1F1D27" />
      <g clipPath="url(#ri-st-ek)">
        <rect x="7" y="10" width="136" height="242" fill="#E8EEF5" />
        <rect x="7" y="170" width="136" height="82" fill="#D9E2EC" />
        <circle cx="75" cy="222" r="16" fill="none" stroke="#FFFFFF" strokeWidth="4" />
        {ST_KAD.map(([cx, cy], i) => <Doira key={i} cx={cx} cy={cy} i={i} cls={cxx('ri-st-d', b === 0 && !tinch && 'kir', b === 0 && i === 1 && !tinch && 'bos')} />)}
        {b === 0 && !tinch && <g className="ri-st-foto">
          <rect x="7" y="10" width="136" height="242" fill="#BFE3F5" />
          <circle cx="104" cy="70" r="16" fill="#FFE08A" />
          <path d="M 7 200 L 52 140 L 86 182 L 112 156 L 143 196 L 143 252 L 7 252 Z" fill="#7FC29B" />
          <rect className="ri-st-vaqt" x="16" y="18" width="118" height="3" rx="1.5" fill="#FFFFFF" />
        </g>}
      </g>
      <rect x="58" y="4" width="34" height="5" rx="2.5" fill="#3A3744" />
    </g>
    <g transform="translate(390 44)">
      <rect x="0" y="0" width="150" height="262" rx="22" fill="#1F1D27" />
      <g clipPath="url(#ri-st-ek)">
        <rect x="7" y="10" width="136" height="242" fill="#FFFFFF" />
        <g className={cxx('ri-st-lenta', b >= 1 && 'past')}>
          <Post y={30} rang="#CFE4F7" />
          <Post y={138} rang="#F7D9C4" />
        </g>
        {b >= 1 && <g className={cxx('ri-st-qator', b >= 2 && 'surildi')}>
          {ST_KAD.map(([cx, cy], i) => <Doira key={i} cx={cx} cy={cy} i={i} insta cls={cxx('ri-st-d', !tinch && 'kir')} />)}
          {b >= 2 && <Doira cx={142} cy={40} i={4} insta cls={cxx('ri-st-d', !tinch && 'kir')} />}
        </g>}
      </g>
      <rect x="58" y="4" width="34" height="5" rx="2.5" fill="#3A3744" />
    </g>
    {b >= 2 && <g className="ri-st-chiz">{ST_ODAM_I.map(([x, y], i) => {
      const [cx, cy] = ST_KAD[i % 4];
      return <path key={i} d={`M ${x - 12} ${y - 34} Q ${(x + 390 + cx) / 2} ${y - 80} ${390 + cx - 12} ${44 + cy + 10}`} pathLength="1" style={{ '--i': i }} />;
    })}</g>}
    {b >= 1 && <>
      {ST_ODAM_S.map(([x, y], i) => <Odamcha key={`s${i}`} x={x} y={y} i={i} teri={i} soch={i + 1} kiyim={i * 2} uzun={i === 1} className={cxx('ri-st-od', !tinch && 'kir')} />)}
      {ST_ODAM_I.map(([x, y], i) => <Odamcha key={`i${i}`} x={x} y={y} i={i + 2} teri={i % 3} soch={i % 3} kiyim={i + 1} uzun={i % 3 === 1} className={cxx('ri-st-od', !tinch && 'kir')} />)}
    </>}
  </svg>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [xulosaVaqt, setXulosaVaqt] = useState(!!storedAnswer);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!done || xulosaVaqt) return undefined; const t = setTimeout(() => setXulosaVaqt(true), kamHarakat() ? 0 : 1900); return () => clearTimeout(t); }, [done, xulosaVaqt]);
  const bq = STORIES_BOSQICH[b];
  const kutish = b === 0 && !taxmin;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const tx = ST_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Instagram /> Stories · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || (done && !xulosaVaqt)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <>Stories'ni o'ylab topgan ilova <A>yutdimi?</A></>, ru: <>Выиграло ли приложение, <A>придумавшее Stories?</A></> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="ri-nuq"><span className="ri-nuq-l">{yorliq}</span>{STORIES_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="ri-voqea">
          <span className="ri-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><StoriesSahna b={b} /></Zoomable>
          {kutish && <div className="ri-bash"><QBashorat yorliq={yorliq} savol={tr(ST_SAVOL)} variantlar={ST_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>}
          {taxmin && !(done && xulosaVaqt) && <BashQator savol={tr(ST_SAVOL)} javob={tr(tx.t)} />}
          {done && xulosaVaqt && <QXulosa>{tx && <TaxminQator togri={!!tx.ok} javob={tr(tx.t)} haqiqat={tr({ uz: "Instagram'da", ru: 'в Instagram' })} />}{tr({ uz: "Bu voqeada tayyor katta auditoriya formatni ko'proq odamga yetkazdi — RICE da buni qamrov o'lchaydi.", ru: 'В этой истории готовая большая аудитория донесла формат до большего числа людей — в RICE это измеряет охват.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "Bu voqea «Qaysi ishni birinchi qilasiz?» darsida ham chiqqan — eslating: u yerda «nechta odam so'raydi» savoli edi, bugun u RICE ning qamrov bo'lagi. «Snapchat yutqazdi» demang, foydalanuvchilar soni va boshqa sana qo'shmang — bankda yo'q. Siluetlar — «tayyor katta auditoriya» chizmasi, son emas. Sinfdan so'rang: «G'oyangiz ko'proq odamga qayerda yetadi — maktabdami, mahallada yoki Telegram guruhidami?»", ru: 'Эта история уже была в уроке «Какую работу делать первой?» — напомните: там был вопрос «сколько людей просит», сегодня это часть RICE — охват. Не говорите «Snapchat проиграл», не добавляйте число пользователей и другие даты — их нет в банке. Фигуры — рисунок «готовой большой аудитории», а не число. Спросите класс: «Где ваша идея дойдёт до большего числа людей — в школе, в махалле или в Telegram-группе?»' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 7 — 3-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s7 = 0; Stories — RICE bo'lagi) =====
const S7Vizual = () => (
  <div className="ri-tv7">
    <span className="ri-tv7-u">{USTUNLAR.slice(0, 4).map((u, j) => <b key={u.k} className={cxx(j === 0 && 'ajrat')}>{tr(u.n)}</b>)}</span>
    <div className="ri-tv7-s"><StoriesSahna b={1} tinch /></div>
  </div>
);
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · Stories va RICE', ru: 'Проверка · Stories и RICE' })}
    questionText="Stories voqeasi RICE ning qaysi bo'lagini ko'rsatadi?"
    question={tr({ uz: <h2 className="title h-ask">Stories voqeasi RICE ning <A>qaysi bo'lagini</A> ko'rsatadi?</h2>, ru: <h2 className="title h-ask">Какую <A>часть RICE</A> показывает история Stories?</h2> })}
    options={[
      { uz: 'Qamrov — bir oyda nechta odamga yetadi', ru: 'Охват — скольким людям дойдёт за месяц' },
      { uz: "Ta'sir — bitta odamga qancha foyda beradi", ru: 'Влияние — сколько пользы даёт одному человеку' },
      { uz: 'Ishonch — taxminga qanchalik ishonasiz', ru: 'Уверенность — насколько уверены в догадке' },
      { uz: 'Mehnat — bitta odam necha hafta ishlaydi', ru: 'Усилия — сколько недель работает один человек' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Instagram'dagi tayyor katta auditoriya formatni ko'proq odamga yetkazdi.", ru: 'Готовая большая аудитория Instagram донесла формат до большего числа людей.' }}
    explainWrong={{
      1: { uz: 'Format ikkala ilovada bir xil edi — farq boshqa joyda.', ru: 'Формат в обоих приложениях был одинаковым — разница в другом.' },
      2: { uz: "Voqeada taxmin haqida gap bo'lmadi.", ru: 'В истории не было речи о догадке.' },
      3: { uz: "Voqeada qurish vaqti haqida gap bo'lmadi.", ru: 'В истории не было речи о времени на постройку.' },
      default: { uz: "Instagram'da nima ko'p edi — shuni eslang.", ru: 'Вспомните, чего было много в Instagram.' }
    }}
    vizual={<S7Vizual />} />
);

// ===== SCREEN 8 — SARALASH (QMustaqil, USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29) · o'qiydi pm-m9d1-goyalar · yozadi pm-m9d2-rice.otdi · nishon sortedIt =====
const PH8 = { muammo: { uz: 'Odamlar nimadan qiynaladi?', ru: 'От чего страдают люди?' }, kim: { uz: 'Aynan qanday odamlar?', ru: 'Какие именно люди?' }, yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' } };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const YORDAM_T = { uz: 'Yordam', ru: 'Подсказка' };
const QOLDIR = { uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: 'Если оставить так — снова нажмите «Сохранить».' };
// javob[i] = [h, h, h] (1 — ha · 0 — yo'q · undefined — hali so'ralmagan); bitta «yo'q» yetadi
const saralandi = (j) => !!j && (j.includes(0) || (j[0] === 1 && j[1] === 1 && j[2] === 1));
const otdimi = (j) => !!j && j[0] === 1 && j[1] === 1 && j[2] === 1;
const s8Bosh = () => {
  const r = riceLs();
  if (!Array.isArray(r.otdi)) return {};
  const o = {};
  goyalarLs().forEach(g => { o[g.i] = r.otdi.includes(g.i) ? [1, 1, 1] : [0]; });
  return o;
};
const GoyaQator = ({ g, n, holat, onTahrir, yangi, joriy }) => (
  <li className={cxx('ri-gq', holat === 'otdi' && 'otdi', holat === 'chetda' && 'chetda', yangi && 'yangi', joriy && 'joriy')} data-fk={`g${g.i}`} data-uch={`s8g${g.i}`}>
    <span className="ri-gq-n">{n}</span>
    <span className="ri-gq-t">{qisqa(g.yechim)}</span>
    <span className={cxx('ri-holat', holat)}>{holat === 'otdi' ? tr({ uz: "O'tdi ✓", ru: 'Прошла ✓' }) : holat === 'chetda' ? tr({ uz: 'Chetda', ru: 'В стороне' }) : '?'}</span>
    {onTahrir && <button type="button" className="ri-gq-b" aria-label={tr({ uz: 'Qayta saralash', ru: 'Отобрать заново' })} onClick={onTahrir}>✎</button>}
  </li>
);
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [goyalar, setGoyalar] = useState(goyalarLs);
  const [zaxira] = useState(() => goyalarLs().length === 0);
  const [javob, setJavob] = useState(() => storedAnswer?.javob || s8Bosh());
  const [tahrir, setTahrir] = useState(null);
  const [ketyapti, setKetyapti] = useState(null);
  const [kartaK, setKartaK] = useState(0);
  const [yangi, setYangi] = useState(null);
  const [yoqBor, setYoqBor] = useState(false);
  const [forma, setForma] = useState({ muammo: '', kim: '', yechim: '' });
  const [fXato, setFXato] = useState(false);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const ro = useRef(null);
  const N = goyalar.length;
  const sanoq = goyalar.filter(g => saralandi(javob[g.i]) && ketyapti !== g.i && tahrir !== g.i).length;
  const joriyI = ketyapti !== null ? ketyapti : tahrir !== null ? tahrir : (goyalar.find(g => !saralandi(javob[g.i])) || {}).i;
  const joriy = joriyI === undefined ? null : goyalar.find(g => g.i === joriyI);
  const done = N > 0 && !joriy && goyalar.every(g => saralandi(javob[g.i]));
  const otdi = goyalar.filter(g => otdimi(javob[g.i])).map(g => g.i);
  const k = otdi.length;
  const yordamOn = useIpucha(!done && !isMentor, kartaK, 60000);
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => {
    if (!done) return;
    const r = riceLs();
    riceYoz({ otdi, baho: Array.isArray(r.baho) ? r.baho.filter(b => otdi.includes(b.goya)) : [] });
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'saralash', correct: true, picked: true, solved: true, javob, otdi });
    if (storedAnswer === undefined && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'saralash', k, true, 0);
  }, [done, otdi.join(',')]); // eslint-disable-line
  const javobBer = (j, v) => {
    if (!joriy || ketyapti !== null || isMentor) return;
    const i = joriy.i;
    const eski = (javob[i] || []).slice(0, j);
    const yj = [...eski, v];
    setJavob(o => ({ ...o, [i]: yj }));
    if (v === 0) setYoqBor(true);
    if (v === 0 || j === 2) {
      setKetyapti(i);
      setTimeout(() => {
        uch(kartaRef.current, `s8g${i}`, 620);
        setKetyapti(null); setTahrir(null); setYangi(i); setKartaK(x => x + 1);
      }, kamHarakat() ? 0 : 750);
    }
  };
  const ochTahrir = (i) => { if (isMentor || ketyapti !== null) return; setJavob(o => ({ ...o, [i]: [] })); setTahrir(i); setKartaK(x => x + 1); };
  const saqlaForma = () => {
    const t = { muammo: forma.muammo.trim(), kim: forma.kim.trim(), yechim: forma.yechim.trim() };
    if (!t.muammo || !t.kim || !t.yechim) { setFXato(true); return; }
    const v = lsGet(GOYA_KEY);
    const raw = v && Array.isArray(v.goyalar) ? v.goyalar : [];
    const yangiRaw = [...raw, { ...t, manba: 'kuzatuv' }];
    lsSet(GOYA_KEY, { goyalar: yangiRaw, savedAt: Date.now() });
    setGoyalar(goyalarLs()); setForma({ muammo: '', kim: '', yechim: '' }); setFXato(false); setKartaK(x => x + 1);
  };
  const tartibli = [...goyalar.filter(g => !(saralandi(javob[g.i]) && !otdimi(javob[g.i]) && ketyapti !== g.i)), ...goyalar.filter(g => saralandi(javob[g.i]) && !otdimi(javob[g.i]) && ketyapti !== g.i)];
  const holatI = (g) => (ketyapti === g.i || tahrir === g.i || !saralandi(javob[g.i]) ? '?' : otdimi(javob[g.i]) ? 'otdi' : 'chetda');
  useFlip(ro, tartibli.map(g => `${g.i}${holatI(g)}`).join('|'));
  const nomer = (g) => goyalar.indexOf(g) + 1;
  const satr = (g) => <GoyaQator key={g.i} g={g} n={nomer(g)} holat={holatI(g)} yangi={yangi === g.i} joriy={joriyI === g.i} onTahrir={done && !isMentor ? () => ochTahrir(g.i) : undefined} />;
  const yuqori = tartibli.filter(g => holatI(g) !== 'chetda'), past = tartibli.filter(g => holatI(g) === 'chetda');
  const roy = N > 0 && (
    <div ref={ro} className={cxx('ri-royxat', done && 'keng')}>
      <div className="ri-royxat-h"><span className="ri-yorliq">{tr({ uz: "G'oyalarim", ru: 'Мои идеи' })}</span><b className="ri-royxat-son">{tr({ uz: 'Saralandi', ru: 'Отобрано' })}: <span key={sanoq}>{sanoq}</span> / {N}</b></div>
      <ol className="ri-gq-ro">{yuqori.map(satr)}</ol>
      {past.length > 0 && <div className="ri-chetda"><span className="ri-chetda-l">{tr({ uz: 'Chetda', ru: 'В стороне' })}</span><ol className="ri-gq-ro">{past.map(satr)}</ol></div>}
    </div>
  );
  const jv = joriy ? (javob[joriy.i] || []) : [];
  const savolJ = jv.length;
  const karta = joriy && (
    <div className="ri-s8-k" key={kartaK} ref={kartaRef}>
      <div className={cxx('ri-karta', 'katta', ketyapti !== null && (otdimi(javob[ketyapti]) ? 'otdi' : 'chetga'))}>
        <div className="ri-karta-bosh"><span className="ri-yorliq">{tr({ uz: "G'oya", ru: 'Идея' })} {nomer(joriy)}</span>{joriy.manba && MANBA_T[joriy.manba] && <span className="ri-manba">{tr(MANBA_T[joriy.manba])}</span>}</div>
        <div className="ri-karta-ich">
        <div className="ri-karta-g">{QISM.map(q => <div key={q.k} className="ri-kq"><span className="ri-kq-l">{tr(q.t)}</span><span className="ri-kq-t">{joriy[q.k]}</span></div>)}</div>
        <div className="ri-ks">
          {SAVOLLAR.map((s, j) => {
            const h = jv[j];
            const yiqildi = jv.includes(0) && j > jv.indexOf(0);
            const jor = j === savolJ && ketyapti === null && !yiqildi;
            return (
              <div key={s.k} className={cxx('ri-ks-q', h === 1 && 'ok', h === 0 && 'yoq', jor && 'jor', (j > savolJ || yiqildi) && 'kut')}>
                <span className="ri-ks-s"><b>{tr(s.q)}</b><span>{tr(s.t)}</span>{j === 1 && jor && <em>{tr({ uz: "Qog'ozdagi tanishingizdan boshlang: unga o'xshash yana to'rt kishini ayta olasizmi?", ru: 'Начните со знакомого с листка: сможете назвать ещё четырёх похожих людей?' })}</em>}</span>
                {h === 1 || h === 0
                  ? <span className={cxx('ri-ks-b', h === 1 ? 'ok' : 'yoq')}>{h === 1 ? '✓' : '✕'}</span>
                  : yiqildi ? <span className="ri-ks-b yoqli">—</span>
                    : <span className={cxx('ri-ks-t', guruh(jor))}>
                      <QChip disabled={!jor} onClick={() => javobBer(j, 1)}>{tr({ uz: 'Ha', ru: 'Да' })}</QChip>
                      <QChip disabled={!jor} onClick={() => javobBer(j, 0)}>{tr({ uz: "Yo'q", ru: 'Нет' })}</QChip>
                    </span>}
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
  const formaEl = zaxira && !joriy && N < 6 && !isMentor && (
    <div className="ri-s8-k" key={`f${kartaK}`}>
      <div className="ri-karta katta">
        <p className="ri-kul-q">{tr({ uz: "G'oyalaringiz topilmadi — qog'ozdagi g'oyalarni bittadan yozing.", ru: 'Ваши идеи не найдены — запишите идеи с листка по одной.' })}</p>
        {QISM.map((q, j) => (
          <label key={q.k} className="ri-kq">
            <span className="ri-kq-l">{tr(q.t)}</span>
            <input className={cxx('ri-inp', !forma[q.k].trim() && QISM.findIndex(x => !forma[x.k].trim()) === j && 'ri-halqa-i')} value={forma[q.k]} placeholder={tr(PH8[q.k])} onChange={(e) => setForma(f => ({ ...f, [q.k]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') saqlaForma(); }} />
          </label>
        ))}
        {fXato && <QXato>{tr({ uz: "Uch qatorni ham to'ldiring.", ru: 'Заполните все три строки.' })}</QXato>}
        <div className="ri-amal"><QTugma className={halqa(!!(forma.muammo.trim() && forma.kim.trim() && forma.yechim.trim()))} onClick={saqlaForma}>{tr(SAQLASH)}</QTugma></div>
      </div>
    </div>
  );
  const qoldi = N - sanoq;
  const nav = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (N === 0 ? tr({ uz: "G'oyalarni yozing", ru: 'Запишите идеи' }) : tr({ uz: `Yana ${qoldi} ta g'oya qoldi`, ru: `Осталось идей: ${qoldi}` }));
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={sanoq} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!isMentor && (!done || k < 3)} label={nav} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>G'oyalaringizdan qaysilari <A>uch savoldan</A> o'tadi?</>, ru: <>Какие из ваших идей пройдут <A>три вопроса?</A></> })}
        mentor={<Mentor>{tr({ uz: "Birinchi g'oyadan boshlang: har savolga «Ha» yoki «Yo'q» ni bosing.", ru: 'Начните с первой идеи: на каждый вопрос нажмите «Да» или «Нет».' })}</Mentor>}
        qadamlar={isMentor
          ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: 'Saralashni tugatganlar', ru: 'Закончили отбор' }, { uz: 'Uchtadan kam o\'tganlar', ru: 'Прошло меньше трёх' }]} hisob={(rows, jami) => [`${rows.length} / ${jami}`, String(rows.filter(r => r.picked < 3).length)]} />
            <GoyaJadval tur="saralash" qatorlar={s2Qatorlar(3, 3)} qoldi={4} /></>
          : roy}
        forma={!isMentor && !done && (karta || formaEl)}
      >
        {!isMentor && done && k < 3 && <QIzoh>{tr({ uz: "Uchtasini ajratish uchun kamida uchta g'oya o'tishi kerak: «Chetda» gi g'oyani ✎ bilan qayta ko'ring.", ru: 'Чтобы выделить три, должны пройти хотя бы три идеи: пересмотрите идею «В стороне» через ✎.' })}</QIzoh>}
        {!isMentor && done && k === N && N >= 6 && <QIzoh>{tr({ uz: "Oltitasi ham o'tdi — har biriga 5 tanishni ayta olasizmi? Kerak bo'lsa ✎ bilan qayta ko'ring.", ru: 'Прошли все шесть — сможете назвать по 5 знакомых для каждой? Если нужно — пересмотрите через ✎.' })}</QIzoh>}
        {!isMentor && !done && (yoqBor || yordamOn) && <div className="ri-yordam fade-step"><span className="ri-yordam-l">{tr(YORDAM_T)}</span><QIzoh>{tr({ uz: "Bitta «yo'q» g'oyani chetga chiqaradi, lekin o'chirmaydi. Qaysi savolga ishonchingiz komil emasligini sherigingiz bilan ko'ring.", ru: 'Одно «нет» отводит идею в сторону, но не удаляет её. С какими вопросами вы не уверены — посмотрите с партнёром.' })}</QIzoh></div>}
        {!isMentor && done && <QXulosa>{tr({ uz: `${N} ta g'oyadan ${k} tasi uch savoldan o'tdi, ${N - k} tasi chetda turibdi.`, ru: `Из ${N} идей три вопроса прошли ${k}, в стороне — ${N - k}.` })}</QXulosa>}
        <MentorNote>{tr({ uz: "Eng ko'p ikkilanish — real auditoriya: «5 tanish» — o'quvchi bugun-erta gaplasha oladigan odamlar (ismi emas, kimligi). Uyga vazifa qog'ozi yo'q o'quvchi og'zaki sanaydi. Hamma g'oyasi o'tgan o'quvchidan bittasini so'rang: «Shu g'oya uchun 5 kishini ayting». G'oyani «yomon» demang.", ru: 'Чаще всего сомневаются в реальной аудитории: «5 знакомых» — люди, с которыми ученик может поговорить сегодня-завтра (не имя, а кто это). Без листка домашнего задания ученик считает устно. У ученика, у которого прошли все идеи, спросите одну: «Назовите 5 человек для этой идеи». Не называйте идею «плохой».' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 9 — RICE BAHOSI (QMustaqil, USTAXONA — ketma-ket karta; jonli RICE, «Uchta» / «Ikkita») · yozadi pm-m9d2-rice · nishon riceRated =====
const BOSH_R = { qamrov: '', tasir: null, ishonch: null, mehnat: null };
const qamrovSon = (s) => { const t = String(s).trim().replace(/\s/g, '').replace(',', '.'); if (!/^\d+(\.\d+)?$/.test(t)) return NaN; return Number(t); };
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [goyalar] = useState(goyalarLs);
  const [otdi] = useState(() => { const r = riceLs(); return Array.isArray(r.otdi) ? r.otdi.filter(i => goyalarLs().some(g => g.i === i)) : []; });
  const [baho, setBaho] = useState(() => {
    if (storedAnswer && Array.isArray(storedAnswer.baho)) return storedAnswer.baho;
    const r = riceLs(); return Array.isArray(r.baho) ? r.baho.filter(b => otdi.includes(b.goya)) : [];
  });
  const [ikkita, setIkkita] = useState(() => storedAnswer?.ikkita || (Array.isArray(riceLs().ikkita) ? riceLs().ikkita : null));
  const [sabab, setSabab] = useState(() => storedAnswer?.sabab ?? (riceLs().sabab || ''));
  const [tahrir, setTahrir] = useState(null);
  const [f, setF] = useState(BOSH_R);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [kartaK, setKartaK] = useState(0);
  const [yozildi, setYozildi] = useState(null);
  const [yangi, setYangi] = useState(null);
  const kartaRef = useRef(null);
  const ro = useRef(null);
  const uch = useUchish();
  const g = (i) => goyalar.find(x => x.i === i);
  const baholi = (i) => baho.some(b => b.goya === i);
  const joriyI = tahrir !== null ? tahrir : otdi.find(i => !baholi(i));
  const joriy = joriyI === undefined ? null : g(joriyI);
  const tayyorBaho = otdi.length > 0 && !joriy && otdi.every(baholi);
  const tartib = tartibla(baho.filter(b => tahrir !== b.goya), otdi);
  const uchta = tayyorBaho ? uchtaHisob(baho, otdi) : [];
  const taklif = uchta.slice(0, 2);
  const ik = (ikkita && ikkita.every(i => uchta.includes(i)) ? ikkita : taklif);
  const ozgardi = ik.length === 2 && !(ik.includes(taklif[0]) && ik.includes(taklif[1]));
  const tayyor = tayyorBaho && ik.length === Math.min(2, uchta.length) && (!ozgardi || !!sabab.trim());
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => { if (yozildi === null) return undefined; const t = setTimeout(() => setYozildi(null), 1100); return () => clearTimeout(t); }, [yozildi]);
  useEffect(() => {
    if (!otdi.length) return;
    riceYoz({ otdi, baho, uchta: tayyorBaho ? uchta : uchtaHisob(baho, otdi), ikkita: tayyorBaho ? ik : uchtaHisob(baho, otdi).slice(0, 2), sabab: ozgardi ? sabab.trim() : '' });
  }, [baho, ik.join(','), sabab, tayyorBaho]); // eslint-disable-line
  useEffect(() => {
    if (!tayyor) return;
    onAnswer(screen, { stage: 'ustaxona', screenIdx: screen, practice: 'rice', correct: true, picked: true, solved: true, baho, ikkita: ik, sabab: ozgardi ? sabab.trim() : '' });
    if (storedAnswer === undefined && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'rice', ozgardi ? 1 : 0, true, 0);
  }, [tayyor]); // eslint-disable-line
  const toliq = f.qamrov !== '' && f.tasir !== null && f.ishonch !== null && f.mehnat !== null;
  const qs = qamrovSon(f.qamrov);
  const jb = toliq && qs > 0 ? { qamrov: qs, tasir: f.tasir, ishonch: f.ishonch, mehnat: f.mehnat } : null;
  if (jb) jb.rice = riceHisob(jb);
  const tanla = (k, v) => { setF(o => ({ ...o, [k]: v })); setYozildi(k); if (xato && xato.k === k) setXato(null); };
  const saqla = () => {
    if (!joriy) return;
    if (!toliq) { setXato({ k: 'bosh', q: true }); setYordam(true); return; }
    if (!(qs > 0)) { setXato({ k: 'qamrov', q: true }); setYordam(true); return; }
    if (f.ishonch === 1 && !(xato && xato.k === 'ishonch')) { setXato({ k: 'ishonch', q: false }); setYordam(true); return; }
    const yb = { goya: joriy.i, qamrov: qs, tasir: f.tasir, ishonch: f.ishonch, mehnat: f.mehnat, rice: riceHisob({ qamrov: qs, tasir: f.tasir, ishonch: f.ishonch, mehnat: f.mehnat }) };
    const oxirgi = otdi.every(x => x === joriy.i || baholi(x));
    uch(kartaRef.current, oxirgi ? `${joriy.i}-rice` : `s9r${joriy.i}`, 620);
    setBaho(o => [...o.filter(b => b.goya !== joriy.i), yb]);
    setYangi(joriy.i); setTahrir(null); setF(BOSH_R); setXato(null); setKartaK(x => x + 1);
  };
  const ochTahrir = (i) => { if (isMentor) return; const b = baho.find(x => x.goya === i); setTahrir(i); setF(b ? { qamrov: String(b.qamrov), tasir: b.tasir, ishonch: b.ishonch, mehnat: b.mehnat } : BOSH_R); setXato(null); setKartaK(x => x + 1); };
  const belgila = (i) => {
    if (isMentor) return;
    const on = ik.includes(i);
    setIkkita(on ? ik.filter(x => x !== i) : (ik.length < 2 ? [...ik, i] : [ik[0], i]));
  };
  useFlip(ro, tartib.map(b => `${b.goya}:${b.rice}`).join('|'));
  // To'rt qator to'lgach sonlar formula qatoriga uchadi (MD 9-ekran «Harakat → Vizual o'zgarish»)
  const jbBor = !!jb;
  useEffect(() => {
    if (!jbBor || !kartaRef.current) return;
    ['qamrov', 'tasir', 'ishonch', 'mehnat'].forEach(k => {
      const m = kartaRef.current.querySelector(`[data-rk="${k}"] .ri-rq-m`);
      const t = kartaRef.current.querySelector(`[data-uch="s9f-${k}"]`);
      if (m && t) uchir(m.getBoundingClientRect(), t, 600);
    });
  }, [jbBor]); // eslint-disable-line
  const birinchiBosh = !f.qamrov ? 'qamrov' : f.tasir === null ? 'tasir' : f.ishonch === null ? 'ishonch' : f.mehnat === null ? 'mehnat' : null;
  const QATOR_T = {
    qamrov: <input className={cxx('ri-inp', 'son', yozildi === 'qamrov' && 'yozildi', birinchiBosh === 'qamrov' && 'ri-halqa-i')} inputMode="numeric" value={f.qamrov} placeholder={tr({ uz: 'masalan: 60', ru: 'например: 60' })} onChange={(e) => { setF(o => ({ ...o, qamrov: e.target.value })); if (xato && xato.k === 'qamrov') setXato(null); }} onBlur={() => f.qamrov && setYozildi('qamrov')} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />,
    tasir: <span className={cxx('ri-tl', guruh(birinchiBosh === 'tasir'))}>{TASIR_SHKALA.map(s => <QChip key={s.v} holat={f.tasir === s.v ? 'on' : undefined} onClick={() => tanla('tasir', s.v)}>{sonT(s.v)} {tr(s.t)}</QChip>)}</span>,
    ishonch: <span className={cxx('ri-tl', guruh(birinchiBosh === 'ishonch'))}>{ISHONCH_SHKALA.map(s => <QChip key={s.v} holat={f.ishonch === s.v ? 'on' : undefined} onClick={() => tanla('ishonch', s.v)}>{foizT(s.v)} {tr(s.t)}</QChip>)}</span>,
    mehnat: <span className={cxx('ri-tl', guruh(birinchiBosh === 'mehnat'))}>{MEHNAT_HAFTA.map(h => <QChip key={h} holat={f.mehnat === h ? 'on' : undefined} onClick={() => tanla('mehnat', h)}>{h}</QChip>)}<span className="ri-tl-h">{tr({ uz: 'hafta', ru: 'недель' })}</span></span>
  };
  const XATO_T = {
    bosh: { uz: "To'rt qatorni ham to'ldiring.", ru: 'Заполните все четыре строки.' },
    qamrov: { uz: 'Qamrovni son bilan yozing: bir oyda nechta odam?', ru: 'Запишите охват числом: сколько людей в месяц?' },
    ishonch: { uz: "100% — o'lchangan son bo'lsa. Sizda qaysi son bor?", ru: '100% — если есть измеренное число. Какое число у вас?' }
  };
  const tepa = otdi.length > 0 && !tayyorBaho && (
    <div ref={ro} className="ri-royxat">
      <div className="ri-royxat-h"><span className="ri-yorliq">{tr({ uz: 'Baholanganlar', ru: 'Оценённые' })}</span><b className="ri-royxat-son"><span key={tartib.length}>{tartib.length}</span> / {otdi.length}</b></div>
      {tartib.length > 0 && <ol className="ri-gq-ro">{tartib.map((b, n) => (
        <li key={b.goya} className={cxx('ri-gq', yangi === b.goya && 'yangi')} data-fk={`b${b.goya}`} data-uch={`s9r${b.goya}`}>
          <span className="ri-gq-n">{n + 1}</span><span className="ri-gq-t">{qisqa(g(b.goya)?.yechim)}</span><b className="ri-gq-r">{sonT(b.rice)}</b>
          <button type="button" className="ri-gq-b" aria-label={tr({ uz: 'Tahrirlash', ru: 'Изменить' })} onClick={() => ochTahrir(b.goya)}>✎</button>
        </li>
      ))}</ol>}
    </div>
  );
  const karta = joriy && (
    <div className="ri-s8-k" key={kartaK} ref={kartaRef}>
      <div className="ri-karta katta">
        <div className="ri-karta-bosh"><span className="ri-yorliq">{tr({ uz: 'Yechim', ru: 'Решение' })}</span><span className="ri-karta-nom">{qisqa(joriy.yechim, 60)}</span></div>
        {USTUNLAR.slice(0, 4).map(u => {
          const tol = u.k === 'qamrov' ? f.qamrov !== '' : f[u.k] !== null;
          return (
            <div key={u.k} data-rk={u.k} className={cxx('ri-rq', tol && 'tol', yozildi === u.k && 'yozildi', birinchiBosh === u.k && 'jor')}>
              <span className="ri-rq-s"><b>{tr(u.n)}</b><span>{tr(u.s)}</span></span>
              <span className="ri-rq-m">{QATOR_T[u.k]}</span>
              <span className="ri-rq-b" aria-hidden="true">{tol ? '✓' : ''}</span>
              {xato && xato.k === u.k && <div className="ri-rq-x"><QXato>{tr(XATO_T[u.k])}</QXato>{!xato.q && <QIzoh>{tr(QOLDIR)}</QIzoh>}</div>}
            </div>
          );
        })}
        {xato && xato.k === 'bosh' && <QXato>{tr(XATO_T.bosh)}</QXato>}
        <RiceFormula kichik b={jb} uchKalit={jb ? 's9f' : undefined} />
        <div className="ri-amal">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)} {yordam ? '▾' : '▸'}</QTugma>
          <QTugma className={halqa(toliq)} onClick={saqla}>{tr(SAQLASH)}</QTugma>
        </div>
        {yordam && <div className="ri-yordam fade-step">
          <QIzoh>{tr({ uz: "Qamrov — maktabingiz, mahallangiz yoki Telegram guruhingizdagi shunday odamlarni sanang. Ta'sir — taxmin: g'oya bitta odamning muammosini qanchalik yengillashtiradi — juda ko'p bo'lsa 3, sezilmas bo'lsa 0,25.", ru: 'Охват — посчитайте таких людей в вашей школе, махалле или Telegram-группе. Влияние — догадка: насколько идея облегчает проблему одного человека — если очень сильно, 3, если незаметно, 0,25.' })}</QIzoh>
          <QIzoh>{tr({ uz: "Ishonch — odamlar shu muammoni aytgan bo'lsa 80%, faqat o'zingiz o'ylagan bo'lsa 50%. Mehnatga 6 hafta qo'ysangiz, «Bajariladimi?» javobini qayta ko'ring: shu modulda boshqa ishga vaqt qolmaydi.", ru: 'Уверенность — 80%, если люди называли эту проблему, 50%, если вы придумали сами. Если ставите на усилия 6 недель, пересмотрите ответ «Выполнимо?»: на другую работу в этом модуле времени не останется.' })}</QIzoh>
        </div>}
      </div>
    </div>
  );
  const teng = tayyorBaho && tartib.some((b, n) => n > 0 && b.rice === tartib[n - 1].rice && n <= 3);
  const yakunJadval = tayyorBaho && (
    <div className="ri-s9-y">
      <QIzoh>{tr({ uz: "Chuqurroq tekshirish uchun ikkitasini belgilang: RICE birinchi ikkitasini taklif qiladi, qaror — sizniki.", ru: 'Отметьте две для более глубокой проверки: RICE предлагает первые две, решение — за вами.' })}</QIzoh>
      <GoyaJadval tur="rice" ochiq={5} savolOst={false}
        qatorlar={tartib.map(b => ({ fk: b.goya, nom: qisqa(g(b.goya)?.yechim, 24), b, kul: !uchta.includes(b.goya), yondi: yangi === b.goya }))}
        uchta={uchta} ikkita={ik}
        belgi={(r) => uchta.includes(r.fk) && <button type="button" className={cxx('ri-bel', ik.includes(r.fk) && 'on')} aria-pressed={ik.includes(r.fk)} aria-label={tr({ uz: 'Ikkita', ru: 'Две' })} onClick={() => belgila(r.fk)}>{ik.includes(r.fk) ? '✓' : ''}</button>}
        ostiYorliq={<>
          {teng && <span className="ri-kul">{tr({ uz: "Baho teng — qaysi biri oldin, o'zingiz tanlaysiz.", ru: 'Оценки равны — какая раньше, выбираете сами.' })}</span>}
          {goyalar.length > otdi.length && <span className="ri-chetda-q">{tr({ uz: 'Chetda', ru: 'В стороне' })}: {goyalar.length - otdi.length} {tr({ uz: 'ta', ru: '' })}</span>}
        </>} />
      {ozgardi && <label className="ri-sabab fade-step">
        <span className="ri-kq-l">{tr({ uz: 'Nega aynan shu ikkitasi?', ru: 'Почему именно эти две?' })}</span>
        <input className={cxx('ri-inp', !sabab.trim() && 'ri-halqa-i')} value={sabab} placeholder={tr({ uz: 'Nega aynan shu ikkitasi?', ru: 'Почему именно эти две?' })} onChange={(e) => setSabab(e.target.value)} />
        {!sabab.trim() && <QXato>{tr({ uz: 'Sababini bir qatorda yozing.', ru: 'Напишите причину в одну строку.' })}</QXato>}
      </label>}
    </div>
  );
  const qoldi = otdi.filter(i => !baholi(i)).length + (tahrir !== null ? 1 : 0);
  const nav = isMentor || tayyor || otdi.length === 0 ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tayyorBaho ? tr({ uz: 'Ikkitasini belgilang', ru: 'Отметьте две' }) : tr({ uz: `Yana ${qoldi} ta g'oyani baholang`, ru: `Оцените ещё идей: ${qoldi}` });
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={baho.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!isMentor && !tayyor && otdi.length > 0} label={nav} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Qaysi uchta g'oyangiz <A>oldinga chiqadi?</A></>, ru: <>Какие три ваши идеи <A>выйдут вперёд?</A></> })}
        mentor={<Mentor>{tr({ uz: "Birinchi g'oyadan boshlang: to'rt qatorni to'ldiring — RICE kartaning o'zida chiqadi.", ru: 'Начните с первой идеи: заполните четыре строки — RICE появится прямо на карточке.' })}</Mentor>}
        qadamlar={isMentor
          ? <><MentorSanoq screen={screen} yorliqlar={[{ uz: 'RICE jadvalini tugatganlar', ru: 'Закончили таблицу RICE' }, { uz: "Ikkitasini o'zi almashtirganlar", ru: 'Сами заменили две' }]} hisob={(rows, jami) => [`${rows.length} / ${jami}`, String(rows.filter(r => r.picked === 1).length)]} />
            <GoyaJadval tur="rice" ochiq={5} savolOst={false} qatorlar={[0, 2, 1, 3].map((i, j) => ({ fk: MENTOR_FK(i), nom: tr(MENTOR_GOYALAR[MENTOR_RICE[i].goya].nom), b: MENTOR_RICE[i], kul: j === 3 }))} uchta={['r0', 'r2', 'r1']} ikkita={['r0', 'r2']} /></>
          : (otdi.length === 0 ? <QIzoh>{tr({ uz: "Saralashdan o'tgan g'oya topilmadi — oldingi ekranda g'oyalaringizni saralang.", ru: 'Не найдено идей, прошедших отбор, — отберите идеи на предыдущем экране.' })}</QIzoh> : (tayyorBaho ? yakunJadval : tepa))}
        forma={!isMentor && karta}
      >
        {!isMentor && tayyor && <QXulosa>{ozgardi
          ? tr({ uz: "RICE jadvalida yuqori uchta g'oya chiqdi; ikkitasini sababi bilan o'zingiz belgiladingiz.", ru: 'В таблице RICE вверху оказались три идеи; две вы отметили сами, с причиной.' })
          : tr({ uz: "RICE jadvalida yuqori uchta g'oya chiqdi; ikkitasi — RICE taklif qilgani.", ru: 'В таблице RICE вверху оказались три идеи; две — те, что предложил RICE.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Sonlar taxmin — «to'g'ri son» yo'q. Qamrovi katta chiqqan o'quvchidan so'rang: «Bu odamlar kimlar, qayerda?» Ishonch 100% qo'ygan o'quvchidan — qaysi son o'lchangan. Ikkitasini almashtirgan o'quvchi sababini sinfga aytsin: RICE — tanlovga yordam, hukm emas.", ru: 'Числа — догадки, «правильного числа» нет. У ученика с большим охватом спросите: «Кто эти люди, где они?» У поставившего уверенность 100% — какое число измерено. Пусть ученик, заменивший две, скажет классу причину: RICE — помощь в выборе, а не приговор.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 10 — SHERIK «NEGA?» DEYDI (QMustaqil, juftlik 3 qadam; P-057 solishtirish sahnasi) · pm-m9d2-rice yangilanadi · nishon pairReview =====
const S10_QADAM = {
  juft: [{ uz: 'Sonni tanlang', ru: 'Выберите число' }, { uz: 'Sababini ayting', ru: 'Назовите причину' }, { uz: 'Qaror', ru: 'Решение' }],
  yakka: [{ uz: 'Sonni tanlang', ru: 'Выберите число' }, { uz: 'Mentorni o\'qing', ru: 'Прочитайте Ментора' }, { uz: 'Qaror', ru: 'Решение' }]
};
// Mentorning sabablari (tayanch 1.2 oxiri, 9.52) — «Mahalla to'garaklari» kartasi
const MENTOR_SABAB = {
  qamrov: { uz: "Mahallada to'garak izlaydigan o'smirlar ko'p deb o'yladim, lekin ularni sanamaganman.", ru: 'Я думал, что подростков, ищущих кружок в махалле, много, но я их не считал.' },
  tasir: { uz: "To'garak topilsa foydasi bor, lekin u har kuni kerak bo'ladigan narsa emas.", ru: 'Если кружок найдётся, польза есть, но это не то, что нужно каждый день.' },
  ishonch: { uz: "Bu g'oya bo'yicha hali hech kim bilan gaplashmaganman — faqat taxmin.", ru: 'По этой идее я ещё ни с кем не говорил — только догадка.' },
  mehnat: { uz: "Xarita va jadval — ikki ekran: bir o'zim ikki haftada qura olaman deb o'yladim.", ru: 'Карта и расписание — два экрана: думал, что один построю за две недели.' }
};
const TAYMER_R = 46;
function PairTimer({ soniya = 60, onBosh }) {
  const [st, setSt] = useState({ yur: false, qoldi: soniya, bosh: false });
  useEffect(() => {
    if (!st.yur) return undefined;
    if (st.qoldi <= 0) { setSt(p => ({ ...p, yur: false, qoldi: soniya })); return undefined; }
    const t = setTimeout(() => setSt(p => ({ ...p, qoldi: p.qoldi - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st]); // eslint-disable-line
  const C = 2 * Math.PI * TAYMER_R;
  const qism = st.yur ? st.qoldi / soniya : 1;
  return (
    <div className={cxx('ri-taymer', st.yur && 'yur')}>
      <div className="ri-taymer-h">
        <svg viewBox="0 0 110 110" aria-hidden="true"><circle className="f" cx="55" cy="55" r={TAYMER_R} /><circle className="o" cx="55" cy="55" r={TAYMER_R} style={{ strokeDasharray: C, strokeDashoffset: C * (1 - qism) }} /></svg>
        <span className="ri-taymer-s">{Math.floor(st.qoldi / 60)}:{String(st.qoldi % 60).padStart(2, '0')}</span>
      </div>
      {!st.yur && <QTugma ikkinchi className={halqa(!st.bosh)} onClick={() => { setSt({ yur: true, qoldi: soniya, bosh: true }); if (onBosh) onBosh(); }}>{tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' })}</QTugma>}
    </div>
  );
}
// Katta karta: yechim qisqa, to'rt son katta-katta va RICE (9-ekrandan); son bosiladi
const SonKarta = ({ nom, b, tanlov, onTanla, faol, belgi, uchKalit }) => (
  <div className="ri-sk">
    <span className="ri-sk-nom">{nom}</span>
    <div className={cxx('ri-sk-ro', guruh(faol && !tanlov))}>
      {USTUNLAR.slice(0, 4).map(u => (
        <button key={u.k} type="button" className={cxx('ri-son-b', tanlov === u.k && 'on')} disabled={!faol} onClick={() => onTanla(u.k)}>
          <span>{tr(u.n)}</span><b key={`${u.k}${b[u.k]}`} className="fade-step">{qiymatT(u.k, b[u.k])}</b>{tanlov === u.k && belgi && <i className="ri-son-ok">{belgi}</i>}
        </button>
      ))}
      <span className="ri-son-b rice" data-uch={uchKalit}><span>RICE</span><b><Son v={b.rice} /></b></span>
    </div>
  </div>
);
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [goyalar] = useState(goyalarLs);
  const [rice0] = useState(riceLs);
  const birinchi = Array.isArray(rice0.uchta) && rice0.uchta.length ? rice0.uchta[0] : null;
  const [baho, setBaho] = useState(() => (Array.isArray(rice0.baho) ? rice0.baho : []));
  const gb = birinchi !== null ? goyalar.find(x => x.i === birinchi) : null;
  const juft = isStudent && !!gb && baho.some(b => b.goya === birinchi);
  const yakka = !juft;
  const [tanlov, setTanlov] = useState(storedAnswer?.tanlov ?? null);
  const [taymer, setTaymer] = useState(!!storedAnswer);
  const [ozgar, setOzgar] = useState(false);
  const [yv, setYv] = useState(null);
  const [natija, setNatija] = useState(storedAnswer?.natija ?? null);
  const ro = useRef(null);
  const done = natija !== null;
  const otdi = Array.isArray(rice0.otdi) ? rice0.otdi : [];
  const bJ = juft ? baho.find(b => b.goya === birinchi) : MENTOR_RICE[2];
  const uchta = juft ? uchtaHisob(baho, otdi) : [];
  useFlip(ro, uchta.join('|'));
  const qaror = (v) => {
    if (natija !== null || isMentor) return;
    setNatija(v);
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'juftlik', screenIdx: screen, correct: true, picked: v, solved: true, natija: v, tanlov });
    const p = { qoldi: 0, ozgardi: 1, orin: 2, ishonarli: 0, ishonarsiz: 1 }[v];
    if (juft && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'juftlik', p, true, 0);
  };
  const saqlaYangi = () => {
    if (yv === null || yv === '' || !tanlov) return;
    const v = tanlov === 'qamrov' ? qamrovSon(yv) : yv;
    if (!(v > 0)) return;
    const eskiUch = uchtaHisob(baho, otdi);
    const yb = baho.map(b => (b.goya === birinchi ? { ...b, [tanlov]: v, rice: riceHisob({ ...b, [tanlov]: v }) } : b));
    const yUch = uchtaHisob(yb, otdi);
    const eskiIk = Array.isArray(rice0.ikkita) ? rice0.ikkita : eskiUch.slice(0, 2);
    const ozIk = !!(rice0.sabab && String(rice0.sabab).trim());
    const ik = ozIk && eskiIk.every(i => yUch.includes(i)) ? eskiIk : yUch.slice(0, 2);
    setBaho(yb); setOzgar(false);
    riceYoz({ baho: yb, uchta: yUch, ikkita: ik });
    qaror(eskiUch.join(',') === yUch.join(',') ? 'ozgardi' : 'orin');
  };
  const kartaNom = juft ? qisqa(gb.yechim, 46) : tr(MENTOR_GOYALAR[2].nom);
  const qadam = done ? undefined : !tanlov ? 0 : (juft && !taymer ? 1 : 2);
  const tahrirEl = ozgar && tanlov && (
    <div className="ri-rq jor fade-step">
      <span className="ri-rq-s"><b>{tr(USTUNLAR.find(u => u.k === tanlov).n)}</b><span>{tr(USTUNLAR.find(u => u.k === tanlov).s)}</span></span>
      <span className="ri-rq-m">{tanlov === 'qamrov'
        ? <input className="ri-inp son ri-halqa-i" inputMode="numeric" value={yv ?? ''} placeholder={tr({ uz: 'masalan: 60', ru: 'например: 60' })} onChange={(e) => setYv(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saqlaYangi(); }} />
        : <span className={cxx('ri-tl', guruh(yv === null))}>{(tanlov === 'tasir' ? TASIR_SHKALA.map(s => ({ v: s.v, t: `${sonT(s.v)} ${tr(s.t)}` })) : tanlov === 'ishonch' ? ISHONCH_SHKALA.map(s => ({ v: s.v, t: `${foizT(s.v)} ${tr(s.t)}` })) : MEHNAT_HAFTA.map(h => ({ v: h, t: String(h) }))).map(o => <QChip key={o.v} holat={yv === o.v ? 'on' : undefined} onClick={() => setYv(o.v)}>{o.t}</QChip>)}</span>}</span>
      <div className="ri-amal"><QTugma className={halqa(yv !== null && yv !== '')} onClick={saqlaYangi}>{tr(SAQLASH)}</QTugma></div>
    </div>
  );
  const qarorEl = !done && tanlov && (yakka || taymer) && !ozgar && (
    <div className={cxx('ri-qaror', 'fade-step', guruh(true))}>
      {juft
        ? <><QChip onClick={() => qaror('qoldi')}>{tr({ uz: '✓ Son qoladi', ru: '✓ Число остаётся' })}</QChip><QChip onClick={() => { setOzgar(true); setYv(null); }}>{tr({ uz: '✎ Sonni o\'zgartiraman', ru: '✎ Изменю число' })}</QChip></>
        : <><QChip onClick={() => qaror('ishonarli')}>{tr({ uz: '✓ Ishonarli', ru: '✓ Убедительно' })}</QChip><QChip onClick={() => qaror('ishonarsiz')}>{tr({ uz: '✕ Ishonarsiz', ru: '✕ Неубедительно' })}</QChip></>}
    </div>
  );
  const xulosa = {
    qoldi: { uz: "Soningizni sabab bilan tushuntirdingiz — baho o'zgarmadi.", ru: 'Вы объяснили своё число причиной — оценка не изменилась.' },
    ozgardi: { uz: "Bitta son o'zgardi va baho ham o'zgardi: RICE sonlari — taxmin.", ru: 'Изменилось одно число — изменилась и оценка: числа RICE — догадки.' },
    orin: { uz: "Bitta son o'zgardi va g'oyalar o'rni almashdi: RICE sonlari — taxmin.", ru: 'Изменилось одно число — и идеи поменялись местами: числа RICE — догадки.' },
    ishonarli: { uz: 'Sababi bor — son qoladi. Lekin bu misolda ishonch 50%: sonlar hali taxmin.', ru: 'Причина есть — число остаётся. Но в этом примере уверенность 50%: числа пока догадки.' },
    ishonarsiz: { uz: "Ishonarsiz son pasaysa, g'oya o'rni o'zgarishi mumkin: RICE sonlari — taxmin.", ru: 'Если неубедительное число снизить, место идеи может измениться: числа RICE — догадки.' }
  };
  const sarlavha = yakka && !isMentor
    ? tr({ uz: <>Mentorning qaysi soniga <A>«nega?»</A> der edingiz?</>, ru: <>Про какое число Ментора вы бы спросили <A>«почему?»</A></> })
    : tr({ uz: <>Sherigingiz qaysi soningizga <A>«nega?»</A> deydi?</>, ru: <>Про какое ваше число партнёр спросит <A>«почему?»</A></> });
  const mentorGap = yakka && !isMentor
    ? tr({ uz: "Mentorning ikkinchi g'oyasidan bitta sonni tanlang — Mentor sababini aytadi.", ru: 'Выберите одно число второй идеи Ментора — Ментор назовёт причину.' })
    : tr({ uz: "Birinchi o'rindagi g'oyangizni sherigingizga ko'rsating — u bitta sonni tanlab, «nega?» deb so'raydi.", ru: 'Покажите партнёру идею на первом месте — он выберет одно число и спросит «почему?».' });
  return (
    <Stage eyebrow={yakka && !isMentor ? tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' }) : tr({ uz: 'Juftlikda ish', ru: 'Работа в парах' })} screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Qarorni belgilang', ru: 'Отметьте решение' })} onClick={onNext} /></>}>
      <QMustaqil sarlavha={sarlavha} mentor={<Mentor>{mentorGap}</Mentor>}
        qadamlar={<div className="ri-s10q"><QQadamlar joriy={qadam} qadamlar={(yakka ? S10_QADAM.yakka : S10_QADAM.juft).map(tr)} />{juft && <UchtaStrip />}</div>}
        forma={<div className={cxx('ri-s10', yakka && 'yakka', tanlov && 'tanlandi')}>
          {yakka && tanlov && <div className="ri-pufak fade-step" key={tanlov}>
            <span className="ri-pufak-h">{tr({ uz: 'Mentor', ru: 'Ментор' })} · <b>{tr(USTUNLAR.find(u => u.k === tanlov).n)} {qiymatT(tanlov, bJ[tanlov])}</b></span>
            <p className="ri-pufak-t">{tr(MENTOR_SABAB[tanlov])}</p>
          </div>}
          <div className="ri-s10-k">
            {juft && !tanlov && <span className="ri-kul">{tr({ uz: 'Sherigingiz qaysi sonni so\'radi?', ru: 'Про какое число спросил партнёр?' })}</span>}
            <SonKarta nom={kartaNom} b={bJ} tanlov={tanlov} faol={!tanlov && !isMentor} onTanla={setTanlov} belgi={natija === 'qoldi' || natija === 'ishonarli' ? '✓' : null} />
            {juft && tanlov && !taymer && <PairTimer onBosh={() => setTaymer(true)} />}
            {tahrirEl}
            {qarorEl}
          </div>
          {juft && (natija === 'ozgardi' || natija === 'orin') && <div ref={ro} className="ri-royxat ri-s10-u fade-step">
            <div className="ri-royxat-h"><span className="ri-yorliq">{tr({ uz: "Uchta g'oyam", ru: 'Мои три идеи' })}</span></div>
            <ol className="ri-gq-ro">{uchta.map((gi, n) => { const b = baho.find(x => x.goya === gi); const gg = goyalar.find(x => x.i === gi); return (
              <li key={gi} className={cxx('ri-gq', gi === birinchi && 'joriy')} data-fk={`u${gi}`}><span className="ri-gq-n">{n + 1}</span><span className="ri-gq-t">{qisqa(gg?.yechim)}</span><b className="ri-gq-r">{b ? sonT(b.rice) : ''}</b></li>
            ); })}</ol>
          </div>}
        </div>}
      >
        {done && <QXulosa>{tr(xulosa[natija])}</QXulosa>}
        <MentorSanoq screen={screen} yorliqlar={[{ uz: 'Son qoldi', ru: 'Число осталось' }, { uz: "Son o'zgardi", ru: 'Число изменилось' }, { uz: "O'rin almashdi", ru: 'Места поменялись' }]} hisob={(rows) => [0, 1, 2].map(p => String(rows.filter(r => r.picked === p).length))} />
        <MentorNote>{tr({ uz: "1 daqiqadan keyin «O'rin almashing» deng. Sonni o'zgartirgan 2–3 o'quvchidan so'rang: qaysi son, nega va o'rin o'zgardimi? O'zgarish — xato emas: sonlar taxmin.", ru: 'Через минуту скажите «Поменяйтесь местами». Спросите 2–3 учеников, изменивших число: какое число, почему и поменялось ли место? Изменение — не ошибка: числа — догадки.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 11 — KOD YOZISH (QKod, VS Code varianti: darvoza-savol → vazifa + Yordam + «Bajardim» · rice.js qo'lda yoziladi; terminal «Kutilgan natija» boshidan xira — 9-Modul m7-03 naqshi) =====
// Kod qatorlari ≤ 70 belgi (SABOQ 37 — gorizontal skroll yo'q): MD dagi uzun qatorlar ikki qatorga bo'lindi, so'zlar o'zgarmadi
const KD_KOD = {
  uz: [
    "// rice.js — Mentorning to'rtta g'oyasi:",
    '// RICE bahosi va eng yuqori uchtasi',
    '',
    '// ishonch kodda kasr bilan: 80% — 0.8, 50% — 0.5',
    'const goyalar = [',
    '  { nom: "Jamoa yig\'ish",',
    '    qamrov: 60, tasir: 2, ishonch: 0.8, mehnat: 4 },',
    '  { nom: "Maydon pulini bo\'lishish",',
    '    qamrov: 30, tasir: 1, ishonch: 0.5, mehnat: 3 },',
    '  { nom: "Mahalla to\'garaklari",',
    '    qamrov: 80, tasir: 1, ishonch: 0.5, mehnat: 2 },',
    '  { nom: "Sinf uy vazifalari",',
    '    qamrov: 30, tasir: 0.5, ishonch: 0.5, mehnat: 2 },',
    '];',
    '',
    'function rice(g) {',
    "  // qamrovni ta'sirga va ishonchga ko'paytirib,",
    "  // mehnatga bo'ling",
    '  return 0;   // shu joyni siz yozasiz',
    '}',
    '',
    "// har g'oyaga baho qo'shamiz va kattadan kichikka tartiblaymiz",
    '// (bu qism tayyor)',
    'goyalar.forEach(function (g) { g.baho = rice(g); });',
    'goyalar.sort(function (a, b) { return b.baho - a.baho; });',
    '',
    '// Shu yerga: eng yuqori uchtasini terminalga chiqaring',
    '// (Yordam ▸)'
  ],
  ru: [
    '// rice.js — четыре идеи Ментора:',
    '// оценка RICE и три верхние',
    '',
    '// уверенность в коде — дробью: 80% — 0.8, 50% — 0.5',
    'const goyalar = [',
    '  { nom: "Jamoa yig\'ish",',
    '    qamrov: 60, tasir: 2, ishonch: 0.8, mehnat: 4 },',
    '  { nom: "Maydon pulini bo\'lishish",',
    '    qamrov: 30, tasir: 1, ishonch: 0.5, mehnat: 3 },',
    '  { nom: "Mahalla to\'garaklari",',
    '    qamrov: 80, tasir: 1, ishonch: 0.5, mehnat: 2 },',
    '  { nom: "Sinf uy vazifalari",',
    '    qamrov: 30, tasir: 0.5, ishonch: 0.5, mehnat: 2 },',
    '];',
    '',
    'function rice(g) {',
    '  // умножьте охват на влияние и уверенность,',
    '  // разделите на усилия',
    '  return 0;   // это место пишете вы',
    '}',
    '',
    '// каждой идее добавляем оценку и сортируем',
    '// от большей к меньшей',
    '// (эта часть готова)',
    'goyalar.forEach(function (g) { g.baho = rice(g); });',
    'goyalar.sort(function (a, b) { return b.baho - a.baho; });',
    '',
    '// Сюда: выведите три верхние в терминал',
    '// (Подсказка ▸)'
  ]
};
const KD_NATIJA = ["1. Jamoa yig'ish — 24", "2. Mahalla to'garaklari — 20", "3. Maydon pulini bo'lishish — 5"];
const KD_SHART = [
  { uz: <><code className="qcode">rice(g)</code> qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'ladi</>, ru: <><code className="qcode">rice(g)</code> умножает охват на влияние и уверенность и делит на усилия</> },
  { uz: 'Terminalda uchta qator: o\'rni, nomi va bahosi', ru: 'В терминале три строки: место, название и оценка' },
  { uz: "Birinchi qator — «1. Jamoa yig'ish — 24»", ru: "Первая строка — «1. Jamoa yig'ish — 24»" }
];
const KD_ESLATMA = [
  { k: 'g.qamrov', t: { uz: "g'oyaning qamrovi", ru: 'охват идеи' } },
  { k: null, t: { uz: <><code className="qcode">*</code> — ko'paytirish, <code className="qcode">/</code> — bo'lish</>, ru: <><code className="qcode">*</code> — умножение, <code className="qcode">/</code> — деление</> } },
  { k: 'return', t: { uz: 'funksiya natijasini qaytaradi', ru: 'возвращает результат функции' } },
  { k: 'for', t: { uz: "qatorlarni birma-bir ko'rib chiqadi (sikl)", ru: 'перебирает строки по одной (цикл)' } },
  { k: 'console.log', t: { uz: 'terminalga chiqaradi', ru: 'выводит в терминал' } },
  { k: 'sort', t: { uz: "ro'yxatni tartiblaydi (bu kodda tayyor)", ru: 'сортирует список (в этом коде готово)' } },
  { k: 'terminal', plain: true, t: { uz: <><code className="qcode">node rice.js</code> yozib natijani ko'radigan oyna</>, ru: <>окно, где пишете <code className="qcode">node rice.js</code> и видите результат</> } },
  { k: null, t: { uz: <>kodda 80% — <code className="qcode">0.8</code> (kasr nuqta bilan)</>, ru: <>в коде 80% — <code className="qcode">0.8</code> (дробь с точкой)</> } }
];
const KD_QADAM = [
  { uz: <><code className="qcode">rice</code> ichida: <code className="qcode">return g.qamrov * g.tasir * g.ishonch / g.mehnat;</code></>, ru: <>Внутри <code className="qcode">rice</code>: <code className="qcode">return g.qamrov * g.tasir * g.ishonch / g.mehnat;</code></> },
  { uz: <>Sikl: <code className="qcode">{'for (let i = 0; i < 3; i++)'}</code></>, ru: <>Цикл: <code className="qcode">{'for (let i = 0; i < 3; i++)'}</code></> },
  { uz: <>Sikl ichida: <code className="qcode">{'console.log((i + 1) + ". " + goyalar[i].nom + " — " + goyalar[i].baho);'}</code></>, ru: <>Внутри цикла: <code className="qcode">{'console.log((i + 1) + ". " + goyalar[i].nom + " — " + goyalar[i].baho);'}</code></> }
];
const KOD_DARVOZA = [
  { t: { uz: 'RICE bahosi eng katta g\'oya', ru: 'Идея с самой большой оценкой RICE' }, ok: true },
  { t: { uz: "Ro'yxatga birinchi yozilgan g'oya", ru: 'Идея, записанная в список первой' }, ok: false },
  { t: { uz: "RICE bahosi eng kichik g'oya", ru: 'Идея с самой маленькой оценкой RICE' }, ok: false }
];
const JS_TOKEN = /(\/\/[^\n]*|"[^"]*"|\b(?:const|let|for|function|return)\b)/g;
const jsHl = (ln) => ln.split(JS_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} className="ri-kd-iz">{p}</span>;
  if (p.startsWith('"')) return <span key={i} className="ri-kd-str">{p}</span>;
  if (/^(const|let|for|function|return)$/.test(p)) return <span key={i} className="ri-kd-kw">{p}</span>;
  return <span key={i}>{p}</span>;
});
// VS Code oynasi: kod o'qiladi, nusxalanmaydi (PM-082 d, user-select: none); terminal — kutilgan natija, «Bajardim»dan keyin to'liq rangda
const KodNamuna = ({ tayyor, ajrat }) => (
  <div className="ri-vsc" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()} onContextMenu={e => e.preventDefault()} title={tr({ uz: "Kod nusxalanmaydi — o'zingiz terib yozasiz", ru: 'Код не копируется — наберите сами' })}>
    <div className="ri-vsc-bar"><span className="ri-vsc-fayl"><b>JS</b> rice.js</span><span className="ri-vsc-lock">{tr({ uz: "qo'lda yoziladi", ru: 'пишется вручную' })}</span></div>
    <div className="ri-vsc-body">{tr(KD_KOD).map((ln, i) => <div key={i} className={cxx('ri-vsc-q', ajrat && ln.startsWith('goyalar.sort') && 'ajrat')}><span className="ri-vsc-n">{i + 1}</span><span className="ri-vsc-k">{ln ? jsHl(ln) : ' '}</span></div>)}</div>
    <div className={cxx('ri-term', tayyor && 'tayyor')}>
      <span className="ri-term-l">{tr({ uz: 'Kutilgan natija', ru: 'Ожидаемый результат' })}</span>
      <span className="ri-term-q buyruq">$ node rice.js</span>
      {KD_NATIJA.map((q, i) => <span key={i} className="ri-term-q" style={{ '--i': i }}>{q}</span>)}
    </div>
  </div>
);
// Jonli darsda: «Sinfda: N bajardi · N hali bajarmoqda» (500+ zona signali)
const SinfSanoq = ({ live, screen }) => {
  const [d, setD] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const [p, r] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]); if (on) setD({ jami: p.length, bajardi: new Set(r.map(x => x.player_id)).size }); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [pin, screen]); // eslint-disable-line
  if (!d) return null;
  return <p className="ri-sinf fade-step">{tr({ uz: 'Sinfda', ru: 'В классе' })}: <b>{d.bajardi}</b> {tr({ uz: 'bajardi', ru: 'выполнили' })} · <b>{Math.max(0, d.jami - d.bajardi)}</b> {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</p>;
};
// QKod o'ng ustun propining qolip-nomi til-lint «ekran-nomi-tarjimasi» qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (9-Modul 1-dars QKOD_ONG yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const am = useContext(AchMissCtx);
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const [gateOk, setGateOk] = useState(!!storedAnswer);
  const [miss, setMiss] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [ajrat, setAjrat] = useState(false);
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const stage2 = gateOk || isMentor || done;
  useEffect(() => { if (!ajrat) return undefined; const t = setTimeout(() => setAjrat(false), 1600); return () => clearTimeout(t); }, [ajrat]);
  const pickGate = (i) => {
    if (stage2) return;
    if (KOD_DARVOZA[i].ok) { setGateOk(true); setMiss(null); setAjrat(true); }
    else { if (!miss && am) am.miss(screen); setMiss({ i, k: Date.now() }); }
  };
  const bajardim = () => {
    if (done || isMentor) return;
    setDone(true);
    setTimeout(() => { const t = document.querySelector('.lesson-root .ri-term'); if (t && t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Avval kod-savolini yeching', ru: 'Сначала ответьте на вопрос о коде' }) : tr({ uz: '② Kodni yozing va tugmani bosing', ru: '② Напишите код и нажмите кнопку' });
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · VS Code', ru: 'Пишем код · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>RICE bahosini hisoblaydigan <A>kod</A> yozamiz.</>, ru: <>Пишем <A>код</A>, который считает оценку RICE.</> })}
        mentor={<Mentor key={stage2 ? 'k2' : 'k1'}>{!stage2
          ? tr({ uz: "Avval bitta savol — so'ng kod yoziladi.", ru: 'Сначала один вопрос — потом пишем код.' })
          : tr({ uz: <>Jadvalda ko'rgan hisobni endi kod qiladi: <code className="qcode">rice</code> funksiyasini va eng yuqori uchtasini yozing.</>, ru: <>Расчёт, который вы видели в таблице, теперь делает код: напишите функцию <code className="qcode">rice</code> и три верхние.</> })}</Mentor>}
        vazifa={!stage2
          ? <div className="ri-darvoza">
              <span className="ri-darvoza-s">{tr({ uz: <>Kodda <code className="qcode">sort</code> dan keyin <code className="qcode">goyalar[0]</code> da qaysi g'oya turadi?</>, ru: <>Какая идея окажется в <code className="qcode">goyalar[0]</code> после <code className="qcode">sort</code>?</> })}</span>
              <div className={cxx('ri-darvoza-v', 'ri-guruh')}>{KOD_DARVOZA.map((g, i) => { const silk = miss && miss.i === i; return <QChip key={silk ? `${i}-${miss.k}` : i} silk={silk} onClick={() => pickGate(i)}>{tr(g.t)}</QChip>; })}</div>
              {miss && <QXato>{tr({ uz: <>Bu kodda <code className="qcode">sort</code> bahoni kattadan kichikka tartiblaydi.</>, ru: <>В этом коде <code className="qcode">sort</code> сортирует оценки от большей к меньшей.</> })}</QXato>}
            </div>
          : <>
              <span className="q-yorliq">{tr({ uz: 'Kod nima chiqarsin', ru: 'Что должен вывести код' })}</span>
              <ol className="ri-vazifa">{KD_SHART.map((v, i) => <li key={i}><i>{i + 1}</i><span>{tr(v)}</span></li>)}</ol>
            </>}
        yordam={stage2 && <div className="ri-kyordam">
          <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)} {yordam ? '▾' : '▸'}</QTugma>
        </div>}
        bajardim={stage2 && <><div className="ri-amal">
          <QTugma className={!done && !isMentor ? 'ri-halqa' : undefined} disabled={done || isMentor} onClick={bajardim}>{done ? '✓ ' : ''}{tr({ uz: 'Bajardim — uch qator chiqdi', ru: 'Готово — вывелись три строки' })}</QTugma>
        </div>
          {yordam && <Korinsin className="ri-kyordam-b fade-step">
            <span className="ri-kyordam-h">{tr({ uz: 'Eslatma (JavaScript darslaridan)', ru: 'Напоминание (из уроков JavaScript)' })}</span>
            <ul className="ri-esl">{KD_ESLATMA.map((e, k) => <li key={k}>{e.k === null ? tr(e.t) : <>{e.plain ? <b>{e.k}</b> : <code className="qcode">{e.k}</code>} — {tr(e.t)}</>}</li>)}</ul>
            <span className="ri-kyordam-h">{tr({ uz: 'Uch qadam', ru: 'Три шага' })}</span>
            <ol className="ri-vazifa">{KD_QADAM.map((q, i) => <li key={i}><i>{i + 1}</i><span>{tr(q)}</span></li>)}</ol>
          </Korinsin>}
        </>}
        {...{ [QKOD_ONG]: <div className="ri-kodoyna"><KodNamuna tayyor={done} ajrat={ajrat} /></div> }}
      >
        {isLive && stage2 && <SinfSanoq live={live} screen={screen} />}
        {!isMentor && <UchtaStrip />}
        <NishonQatori screen={screen} />
        <MentorNote>{tr({ uz: "Kod — 3–4 daqiqalik mashq: rice bitta qator, sikl uch qator. «node rice.js» — VS Code terminalida. Ekranda «0,8», kodda «0.8» — sinfga bir gap bilan ayting. Kuchli o'quvchi o'z uchta g'oyasini massivga qo'shib ko'rsa bo'ladi — shart emas.", ru: 'Код — упражнение на 3–4 минуты: rice — одна строка, цикл — три. «node rice.js» — в терминале VS Code. На экране «0,8», в коде «0.8» — скажите классу одной фразой. Сильный ученик может добавить в массив свои три идеи — не обязательно.' })}</MentorNote>
      </QKod>
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ C, INLINE_KEYS.s12 = 2; RICE — tanlovga yordam, hukm emas) =====
const S12Vizual = () => (
  <div className="ri-tv12">
    <span className="ri-kul">{tr({ uz: 'taxmin', ru: 'догадка' })}</span>
    {[20, 18].map((v, i) => <div key={v} className="ri-tv12-q"><b>{v}</b><span className="ri-tv12-y"><i style={{ width: `${v * 4}%`, animationDelay: `${0.2 + i * 0.15}s` }} /></span></div>)}
  </div>
);
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Ikki g'oyangiz RICE da 20 va 18 oldi. Bu nimani bildiradi?"
    question={tr({ uz: <h2 className="title h-ask">Ikki g'oyangiz RICE da 20 va 18 oldi. <A>Bu nimani bildiradi?</A></h2>, ru: <h2 className="title h-ask">Две ваши идеи получили в RICE 20 и 18. <A>Что это значит?</A></h2> })}
    options={[
      { uz: "Birinchisi g'olib — ikkinchisini o'chirasiz", ru: 'Первая — победитель, вторую удаляете' },
      { uz: 'Birinchisini qurasiz — gaplashish shart emas', ru: 'Строите первую — говорить не обязательно' },
      { uz: 'Sonlar taxmin — boshqa dalil ham kerak', ru: 'Числа — догадки, нужны и другие доказательства' },
      { uz: 'Ikkinchisi yomon — RICE uni chetga chiqardi', ru: 'Вторая плохая — RICE её отвёл в сторону' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'RICE — tanlovga yordam, hukm emas: sonlar taxmin, qarorga boshqa dalil ham kerak.', ru: 'RICE — помощь в выборе, а не приговор: числа — догадки, для решения нужны и другие доказательства.' }}
    explainWrong={{
      0: { uz: 'RICE hukm emas: 20 ham, 18 ham — taxmindan chiqqan son.', ru: 'RICE — не приговор: и 20, и 18 — числа из догадок.' },
      1: { uz: 'Baho — taxmin, isbot emas.', ru: 'Оценка — догадка, а не доказательство.' },
      3: { uz: 'RICE chetga chiqarmaydi — u faqat tartiblaydi.', ru: 'RICE не отводит в сторону — он только упорядочивает.' },
      default: { uz: 'RICE nimaga yordam berishini eslang.', ru: 'Вспомните, в чём помогает RICE.' }
    }}
    vizual={<S12Vizual />} />
);

// ===== 🏅 BADGES (nishonlar) — ish qilingan ekranlarda, tekin bonus yo'q (S-034); medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  sortedIt: { icon: '🗂️', name: 'Sorted It!', desc: { uz: 'G\'oyalaringizni uch savol bilan saraladingiz', ru: 'Вы отобрали свои идеи тремя вопросами' } },
  riceRated: { icon: '⚖️', name: 'RICE Rated!', desc: { uz: "Savollardan o'tgan g'oyalaringizni RICE bilan baholab, ikkitasini belgiladingiz", ru: 'Вы оценили прошедшие вопросы идеи по RICE и отметили две' } },
  pairReview: { icon: '🤝', name: 'Pair Review!', desc: { uz: 'Bitta soningizni sabab bilan tushuntirdingiz', ru: 'Вы объяснили одно своё число причиной' } },
  riceCoder: { icon: '🧮', name: 'RICE Coder!', desc: { uz: 'RICE bahosini hisoblaydigan kod yozdingiz', ru: 'Вы написали код, который считает оценку RICE' } }
};
// Ekran id → nishon (onAnswer correct: true bo'lganda; s11 — darvoza-savol birinchi urinishda va «Bajardim»)
const ACH_TRIGGERS = { s8: 'sortedIt', s9: 'riceRated', s10: 'pairReview', s11: 'riceCoder' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 7, 12)
const Q_LABELS = {
  3: { uz: '1 — Real auditoriya', ru: '1 — Реальная аудитория' },
  5: { uz: '2 — RICE hisobi', ru: '2 — Расчёт RICE' },
  7: { uz: '3 — Instagram Stories', ru: '3 — Instagram Stories' },
  12: { uz: '4 — Yakuniy savol', ru: '4 — Итоговый вопрос' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: "g'oya", ru: 'идея' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'saralash', ru: 'отбор' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'RICE', ru: 'RICE' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'qamrov', ru: 'охват' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: "ta'sir", ru: 'влияние' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'ishonch', ru: 'уверенность' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'mehnat', ru: 'усилия' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'tanish', ru: 'знакомый' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: "G'oya uch savoldan qachon o'tadi?", ru: 'Когда идея проходит три вопроса?' }, opts: [{ uz: "Uchala savolga «ha» olsa", ru: 'Если получит «да» на все три' }, { uz: "Ikkita savolga «ha» olsa", ru: 'Если получит «да» на два' }, { uz: "Birinchi savolga «ha» olsa", ru: 'Если получит «да» на первый' }, { uz: "Bitta savolga «yo'q» olsa", ru: 'Если получит «нет» на один' }], correct: 0 },
  { q: { uz: '«Real auditoriya bormi?» savoli nimani so\'raydi?', ru: 'О чём спрашивает вопрос «Есть реальная аудитория?»' }, opts: [{ uz: '6 hafta ichida qura olasizmi', ru: 'Сможете ли построить за 6 недель' }, { uz: 'Kamida 5 tanishingiz bormi', ru: 'Есть ли хотя бы 5 знакомых' }, { uz: "Shu g'oya o'zingizga qiziqmi", ru: 'Интересна ли вам эта идея' }, { uz: 'Ilovani necha kishi yuklaydi', ru: 'Сколько человек скачает приложение' }], correct: 1 },
  { q: { uz: "Qaysi g'oyaning birinchi versiyasini 6 haftada qurish qiyin?", ru: 'Первую версию какой идеи трудно построить за 6 недель?' }, opts: [{ uz: "Sinf vazifalari ro'yxati", ru: 'Список заданий класса' }, { uz: 'Oshxona menyusi sahifasi', ru: 'Страница меню столовой' }, { uz: 'Uyga ovqat yetkazish xizmati', ru: 'Служба доставки еды на дом' }, { uz: "To'garaklar jadvali sahifasi", ru: 'Страница расписания кружков' }], correct: 2 },
  { q: { uz: "Ta'sir 3 nimani bildiradi?", ru: 'Что означает влияние 3?' }, opts: [{ uz: 'Uch kishiga foyda yetkazadi', ru: 'Приносит пользу трём людям' }, { uz: 'Uch hafta mehnat talab qiladi', ru: 'Требует трёх недель усилий' }, { uz: "Ro'yxatda uchinchi o'rinda", ru: 'На третьем месте в списке' }, { uz: 'Har odamga juda katta foyda', ru: 'Очень большая польза каждому' }], correct: 3 },
  { q: { uz: "Bu kursda ishonch 50% qachon qo'yiladi?", ru: 'Когда в этом курсе ставят уверенность 50%?' }, opts: [{ uz: "Dalil yo'q, faqat taxmin bo'lsa", ru: 'Если доказательств нет, только догадка' }, { uz: "O'lchangan aniq son bor bo'lsa", ru: 'Если есть точное измеренное число' }, { uz: "Ko'p odamlar shuni aytgan bo'lsa", ru: 'Если об этом сказали многие' }, { uz: "G'oyaning yarmi qurilgan bo'lsa", ru: 'Если идея построена наполовину' }], correct: 0 },
  { q: { uz: 'Bu kursda mehnat qanday sanaladi?', ru: 'Как в этом курсе считают усилия?' }, opts: [{ uz: 'Odam-oyda — bitta odam bir oyda', ru: 'В человеко-месяцах — один человек за месяц' }, { uz: 'Haftada — bir odam necha hafta', ru: 'В неделях — сколько недель один человек' }, { uz: 'Kunda — butun sinf necha kun', ru: 'В днях — сколько дней весь класс' }, { uz: 'Soatda — kod necha soat oladi', ru: 'В часах — сколько часов займёт код' }], correct: 1 },
  { q: { uz: "Qamrov 90, ta'sir 2, ishonch 50%, mehnat 3. RICE qancha?", ru: 'Охват 90, влияние 2, уверенность 50%, усилия 3. Сколько RICE?' }, opts: [{ uz: '15', ru: '15' }, { uz: '60', ru: '60' }, { uz: '30', ru: '30' }, { uz: '90', ru: '90' }], correct: 2 },
  { q: { uz: "Qamrovi katta g'oyaning bahosi nega past chiqishi mumkin?", ru: 'Почему у идеи с большим охватом оценка может выйти низкой?' }, opts: [{ uz: "Odam ko'p bo'lsa, baho o'zi pasayadi", ru: 'Когда людей много, оценка сама падает' }, { uz: 'Qamrov bahoda umuman sanalmaydi', ru: 'Охват в оценке вообще не считается' }, { uz: "Mehnati juda kam bo'lgani uchun", ru: 'Потому что усилия очень малы' }, { uz: "Ta'sir yoki ishonch kichik bo'lsa", ru: 'Если влияние или уверенность малы' }], correct: 3 },
  { q: { uz: 'Stories voqeasidan qaysi xulosa chiqadi?', ru: 'Какой вывод следует из истории Stories?' }, opts: [{ uz: 'Yaxshiroq yetkazgan ilova yutdi', ru: 'Выиграло приложение, лучше донёсшее формат' }, { uz: 'Uni birinchi o\'ylab topgan yutdi', ru: 'Выиграл тот, кто придумал первым' }, { uz: 'Arzonroq bo\'lgan ilova yutdi', ru: 'Выиграло более дешёвое приложение' }, { uz: 'Eng keyin chiqqan ilova yutdi', ru: 'Выиграло приложение, вышедшее последним' }], correct: 0 },
  { q: { uz: 'Sherigingiz bitta soningizga «nega?» dedi. Nima qilasiz?', ru: 'Партнёр спросил «почему?» про ваше число. Что сделаете?' }, opts: [{ uz: 'Hech narsa demay, sonni o\'zgartirmaysiz', ru: 'Ничего не говорите и не меняете число' }, { uz: 'Sababini aytib, kerak bo\'lsa tuzatasiz', ru: 'Называете причину и при нужде исправляете' }, { uz: "G'oyani butunlay chetga chiqarasiz", ru: 'Полностью отводите идею в сторону' }, { uz: 'Sherigingiz aytgan sonni yozib qo\'yasiz', ru: 'Записываете число, которое назвал партнёр' }], correct: 1 },
  { q: { uz: "Mentorning jamoa yig'ish g'oyasida ishonch nega 80%?", ru: 'Почему в идее Ментора о сборе команды уверенность 80%?' }, opts: [{ uz: 'Mentorga bu g\'oya hammasidan qiziq', ru: 'Ментору эта идея интереснее всех' }, { uz: "Bu g'oyaning ta'siri ikkiga teng", ru: 'Влияние этой идеи равно двум' }, { uz: '9-Modulda 5 kishidan 2 tasi aytgan', ru: 'В 9-м модуле так сказали 2 из 5 человек' }, { uz: "Uning mehnati 4 hafta — eng ko'p", ru: 'Её усилия — 4 недели, больше всех' }], correct: 2 },
  { q: { uz: '`rice(g)` funksiyasi nimani qaytaradi?', ru: 'Что возвращает функция `rice(g)`?' }, opts: [{ uz: "Bitta g'oyaning qisqa nomini", ru: 'Короткое название одной идеи' }, { uz: "Eng yuqori uchta g'oya nomini", ru: 'Названия трёх верхних идей' }, { uz: "Ro'yxatdagi g'oyalar sonini", ru: 'Число идей в списке' }, { uz: "Bitta g'oyaning bahosini", ru: 'Оценку одной идеи' }], correct: 3 },
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

// ===== 🃏 KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 16; MD 14-ekran jadvali aynan) =====
const KARTOCHKALAR = [
  { front: { uz: "G'oyani saralashda qaysi uch savol beriladi?", ru: 'Какие три вопроса задают при отборе идеи?' }, back: { uz: 'Bajariladimi, real auditoriya bormi va qiziqmi', ru: 'Выполнимо ли, есть ли реальная аудитория и интересно ли' } },
  { front: { uz: '«Bajariladimi?» savoli nimani so\'raydi?', ru: 'О чём спрашивает вопрос «Выполнимо?»' }, back: { uz: 'Birinchi versiyasini shu modulning 6 haftasida qura olasizmi', ru: 'Сможете ли построить первую версию за 6 недель этого модуля' } },
  { front: { uz: 'Real auditoriya savoli nimani tekshiradi?', ru: 'Что проверяет вопрос о реальной аудитории?' }, back: { uz: 'Gaplasha oladigan kamida 5 tanishingiz borligini — muammo borligini emas', ru: 'Есть ли хотя бы 5 знакомых для разговора — а не есть ли проблема' } },
  { front: { uz: "Qaysi g'oya RICE ga o'tadi?", ru: 'Какая идея переходит к RICE?' }, back: { uz: "Uchala savolga «ha» olgan g'oya", ru: 'Идея, получившая «да» на все три вопроса' } },
  { front: { uz: 'RICE ni qanday hisoblaysiz?', ru: 'Как считают RICE?' }, back: { uz: "Qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz", ru: 'Умножаете охват на влияние и уверенность и делите на усилия' } },
  { front: { uz: "Qamrov nimani o'lchaydi?", ru: 'Что измеряет охват?' }, back: { uz: "G'oya bir oyda nechta odamga yetishini", ru: 'Скольким людям идея дойдёт за месяц' } },
  { front: { uz: "Ta'sir qaysi sonlar bilan belgilanadi?", ru: 'Какими числами обозначают влияние?' }, back: { uz: "3 juda katta, 2 katta, 1 o'rta, 0,5 kichik, 0,25 juda kichik", ru: '3 очень большое, 2 большое, 1 среднее, 0,5 малое, 0,25 очень малое' } },
  { front: { uz: "Bu kursda ishonch qachon 80% bo'ladi?", ru: 'Когда в этом курсе уверенность 80%?' }, back: { uz: 'Dalil bo\'lsa: masalan, odamlar shu muammoni aytgan', ru: 'Когда есть доказательство: например, люди назвали эту проблему' } },
  { front: { uz: 'Bu kursda mehnat qanday sanaladi?', ru: 'Как в этом курсе считают усилия?' }, back: { uz: 'Bitta odam necha hafta ishlashi bilan', ru: 'Тем, сколько недель работает один человек' } },
  { front: { uz: "Nega Stories Instagram'da ko'proq ishlatildi?", ru: 'Почему Stories больше использовали в Instagram?' }, back: { uz: "U yerda tayyor katta auditoriya bor edi — format ko'proq odamga yetdi", ru: 'Там уже была большая аудитория — формат дошёл до большего числа людей' } },
  { front: { uz: "Mentorning qaysi g'oyasi RICE da birinchi bo'ldi va nega?", ru: 'Какая идея Ментора стала первой в RICE и почему?' }, back: { uz: "Jamoa yig'ish: ta'siri katta va ishonchi 80% — dalil bor", ru: 'Сбор команды: большое влияние и уверенность 80% — есть доказательство' } },
  { front: { uz: 'RICE tanlovni o\'zi hal qiladimi?', ru: 'Решает ли RICE выбор сам?' }, back: { uz: "Yo'q: u faqat tartiblaydi, sonlar esa taxmin", ru: 'Нет: он только упорядочивает, а числа — догадки' } }
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
        <div className={cxx('ri-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="ri-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'uydagilardan biri', ru: 'кто-то из домашних' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "2 g'oya, 10 tanish", ru: '2 идеи, 10 знакомых' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Darsda ulgurmagan g'oyalarni saralang va baholang — «Uchta g'oyam» ro'yxatida.", ru: 'Отберите и оцените идеи, до которых не дошли на уроке, — в списке «Мои три идеи».' },
  { uz: "Uchta g'oyangizning RICE sonlarini uydagilardan biriga ko'rsating. U qaysi soniga «nega?» desa, o'sha sonni qayta ko'ring.", ru: 'Покажите числа RICE своих трёх идей кому-то из домашних. Про какое число он спросит «почему?», то и пересмотрите.' },
  { uz: "Belgilangan ikki g'oyangizning har biri uchun gaplasha oladigan 5 kishini qog'ozga yozing: ismi emas, kimligi.", ru: 'Для каждой из двух отмеченных идей запишите на бумаге 5 человек, с кем можно поговорить: не имя, а кто это.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card ri-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ri-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="ri-hw-q"><span className="ri-hw-k">{tr(r.k)}</span><span className="ri-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="ri-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tr(q)}</span></li>)}</ol>
    {keyingi && <span className="ri-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013, ScoreRing ostida — kartochkaga qo'shilmaydi). CODE STRIKE va arena — darsda =====
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
    { uz: "G'oyani uch savol bilan saralaysiz: bajariladimi, real auditoriya bormi, qiziqmi.", ru: 'Вы отбираете идею тремя вопросами: выполнимо ли, есть ли реальная аудитория, интересно ли.' },
    { uz: "RICE uchun qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz.", ru: 'Для RICE умножаете охват на влияние и уверенность и делите на усилия.' },
    { uz: 'Bu kursda mehnat — bitta odam necha hafta ishlashi.', ru: 'В этом курсе усилия — сколько недель работает один человек.' },
    { uz: "Stories voqeasida format ko'proq odamga yetgan joyda ko'proq ishlatildi.", ru: 'В истории Stories формат больше использовали там, где он дошёл до большего числа людей.' },
    { uz: "Bitta son o'zgarsa, g'oyalar o'rni ham o'zgarishi mumkin.", ru: 'Если изменится одно число, могут поменяться и места идей.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Ikki g'oyadan qaysi biri odamlarga kerak?»</b></>, ru: <>Следующий урок — <b>«Какая из двух идей нужна людям?»</b></> });
  const r = riceLs();
  const k = Array.isArray(r.baho) ? r.baho.length : 0;
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={k >= 3 || isMentorL
          ? tr({ uz: <>Uchta g'oyangiz <A>RICE jadvalida</A> oldinga chiqdi.</>, ru: <>Три ваши идеи <A>вышли вперёд</A> в таблице RICE.</> })
          : tr({ uz: <>{k} ta g'oya baholandi — <A>qolgani uyda</A>.</>, ru: <>Оценено идей: {k} — <A>остальные дома</A>.</> })}
        cta={<>
          <div className="ri-fikr fade-up d1"><span className="ri-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="ri-fikr-t small">{tr({ uz: "Uch savoldan o'tgan g'oyalarni RICE tartiblaydi; RICE — tanlovga yordam, hukm emas.", ru: 'Идеи, прошедшие три вопроса, упорядочивает RICE; RICE — помощь в выборе, а не приговор.' })}</p></div>
          {!isMentorL && <UchtaStrip />}
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={<HwCard keyingi={keyingi} />}
        keyingi={keyingi}
        hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmIdeaRiceLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === 11-Modul 2-dars — darsning o'z vizuali (prefiks ri-). Faqat qolip tokenlari (D3); brend rangi — faqat Snapchat (sariq) va Instagram (pushti-binafsha) nomlari === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .lesson-root .q-mustaqil { max-width: none; }
        .q-mustaqil:empty { display: none; }
        .ri-yorliq { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .ri-kul { align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; line-height: 1.3; }
        .ri-kulteg { display: inline-block; font-size: 0.95em; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 5px; padding: 0 5px; margin: 0 1px; }
        .ri-manba { flex-shrink: 0; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
        /* Bosiladigan joy halqasi (SABOQ 11, 32): accent halqa doim, yengil to'lqin (≤3%, 0.35, ≥2 s); kam harakatda to'lqin o'chadi, halqa qoladi */
        .ri-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .ri-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ri-tolqin 2.4s ease-in-out 0.4s 3; }
        .ri-guruh { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .ri-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ri-tolqin 2.4s ease-in-out 0.5s 3; }
        .ri-halqa-i { border-color: ${T.accent} !important; animation: ri-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ri-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.ri-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.ri-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        .ri-s0.tanlovsiz .q-variantlar-kol { position: relative; outline: 2px solid ${T.accent}; outline-offset: 6px; border-radius: 16px; }
        .ri-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -10px; border-radius: 20px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ri-tolqin 2.4s ease-in-out 0.6s 3; }
        @keyframes ri-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes ri-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.35)}; } }
        @keyframes ri-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes ri-tush { 0% { opacity: 0; transform: translateY(-8px) scale(0.5); } 70% { opacity: 1; transform: translateY(1px) scale(1.12); } 100% { opacity: 1; transform: none; } }
        @keyframes ri-yashil { 0% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { } }
        @keyframes ri-ajrat { 0%, 100% { background: transparent; } 25%, 70% { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; } }
        @keyframes ri-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes ri-siljish { 0%, 100% { transform: none; } 45% { transform: translateX(8px); } }
        /* Umumiy: Mentor eslatmasi, nishon qatori, statistikalar, bashorat qatori, taxmin natijasi */
        .ri-mnote-c { align-self: flex-end; }
        .ri-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ri-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        p.ri-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.ri-nishon.ketdi { opacity: 0.75; }
        .ri-mstat { display: flex; flex-wrap: wrap; gap: 10px; }
        .ri-mstat-q { display: flex; align-items: baseline; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 8px 14px; }
        .ri-mstat-q b { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: ${T.accent}; }
        .ri-mstat-q span { font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .ri-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ri-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .ri-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .ri-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .ri-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .ri-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }
        .ri-bash .q-bashorat { animation: ri-kir 0.45s ease-out both; }
        .ri-bash .q-chip { animation: ri-kir 0.35s ease-out both; }
        .ri-bash .q-chip:nth-child(2) { animation-delay: 0.09s; } .ri-bash .q-chip:nth-child(3) { animation-delay: 0.18s; }
        .ri-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .ri-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ri-tolqin 2.4s ease-in-out 0.6s 3; }
        .ri-bashq { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 9px 14px; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .ri-bashq-t { white-space: nowrap; }
        .ri-bashq-t b { color: ${T.accent}; }
        .ri-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .ri-tx.ok { color: ${T.ok}; }
        .ri-tx b { color: ${T.ok}; }
        .ri-tx b.yoq { color: ${T.err}; }
        p.ri-javob { margin: 4px 0 0; font-size: 14px; line-height: 1.5; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 11px 14px; }
        .ri-inp { width: 100%; min-width: 0; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 9px 11px; outline: none; }
        .ri-inp.son { max-width: 180px; font-family: 'JetBrains Mono', monospace; }
        .ri-inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .ri-inp.yozildi { animation: ri-yashil 1.1s ease-out; }
        .ri-amal { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; align-items: center; }
        .ri-yordam { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${T.line}; }
        .ri-yordam-l { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        p.ri-kul-q { margin: 0; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 8px 11px; }
        .ri-strip { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ri-strip-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .ri-strip-q { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; color: ${T.ink}; }
        .ri-strip-q i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ri-strip-q b { font-family: 'JetBrains Mono', monospace; color: ${T.accent}; }
        .ri-test-viz { display: flex; flex-direction: column; }
        /* === GoyaJadval — saralash ko'rinishi === */
        .ri-jad { position: relative; display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 12px 16px; }
        .ri-jad-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ri-qoldi { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.accent}; }
        .ri-qoldi span { display: inline-block; animation: ri-tush 0.4s ease-out; }
        ol.ri-sq-ro { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 8px 14px; }
        .ri-sq { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: 4px 10px; padding: 9px 12px; border-radius: 11px; background: ${T.bg}; transition: opacity 0.4s; }
        .ri-sq.yondi { animation: ri-yashil 1.2s ease-out; }
        .ri-sq.chetda { opacity: 0.55; }
        .ri-sq-n { font-weight: 700; font-size: 14px; color: ${T.ink}; }
        .ri-sq-k { display: inline-flex; gap: 5px; }
        .ri-sq-s { grid-column: 1 / -1; font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .ri-kt { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 7px; font-size: 13px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ri-kt.ok { color: #fff; background: ${T.ok}; border-color: ${T.ok}; }
        .ri-kt.yoq { color: ${T.ink2}; background: ${T.line}; border-color: ${T.line}; }
        .ri-kt.yoqli { color: ${T.line}; background: transparent; border-style: dashed; }
        .ri-kt.yangi { animation: ri-tush 0.42s ease-out both; }
        .ri-chetda { display: flex; flex-direction: column; gap: 6px; padding-top: 8px; border-top: 1px dashed ${T.line}; }
        .ri-chetda-l { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .ri-jad.kichik { padding: 10px 12px; }
        /* === GoyaJadval — RICE ko'rinishi (ustunlar: g'oya · qamrov · ta'sir · ishonch · mehnat · RICE) === */
        .ri-tr { display: grid; grid-template-columns: minmax(0,2.1fr) repeat(5, minmax(0,1fr)); gap: 6px; align-items: center; }
        ol.ri-tr-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .ri-tr-ro > .ri-tr { padding: 4px 10px; border-radius: 11px; background: ${T.bg}; transition: opacity 0.5s; }
        .ri-tr.kul { opacity: 0.5; }
        .ri-tr.yondi { animation: ri-yashil 1.2s ease-out; }
        .ri-thr { padding: 0 10px; align-items: end; }
        .ri-th { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: ${T.ink2}; min-width: 0; }
        .ri-th-g { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; }
        .ri-th-g > .ri-kul { text-transform: none; letter-spacing: 0; }
        .ri-th-n { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .ri-th-s, .ri-th-q { font-size: 11px; line-height: 1.3; color: ${T.ink2}; }
        .ri-th-q { opacity: 0.6; }
        .ri-th-b { width: 100%; text-align: left; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; line-height: 1.3; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 9px; padding: 7px 8px; cursor: pointer; }
        .ri-th-b:disabled { opacity: 0.5; cursor: not-allowed; }
        .ri-td { position: relative; display: flex; align-items: center; justify-content: center; min-height: 28px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${T.ink}; background: ${T.paper}; }
        .ri-td.rice { font-weight: 800; color: ${T.accent}; }
        .ri-td.ajrat { animation: ri-ajrat 1.6s ease-out; }
        .ri-td-g { justify-content: flex-start; flex-wrap: nowrap; gap: 4px 8px; padding: 2px 0; background: transparent; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; }
        .ri-td-nom { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ri-td-v { display: inline-block; animation: ri-tush 0.42s ease-out both; }
        .ri-uzuq { display: block; width: 60%; height: 0; border-top: 2px dashed ${T.line}; }
        .ri-ikkita { font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.04em; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 8px; }
        .ri-dalil { grid-column: 1 / -1; justify-self: start; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; color: ${T.ink2}; background: ${T.paper}; border: 1px dashed ${T.line}; border-radius: 7px; padding: 2px 8px; }
        .ri-jad.rice.qavs { padding-left: 40px; }
        .ri-jad.rice.qavs .ri-tr.uchta::before { content: ''; position: absolute; left: -18px; top: -4px; bottom: -4px; width: 9px; border-left: 2px solid ${T.accent}; pointer-events: none; }
        .ri-jad.rice.qavs .ri-tr.u1::before { top: 6px; border-top: 2px solid ${T.accent}; border-top-left-radius: 7px; }
        .ri-jad.rice.qavs .ri-tr.uoxir::before { bottom: 6px; border-bottom: 2px solid ${T.accent}; border-bottom-left-radius: 7px; }
        .ri-jad.rice.qavs .ri-tr.u1::after { content: attr(data-ul); position: absolute; left: -36px; top: calc(100% + 25px); transform: translateY(-50%) rotate(-90deg); font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; background: ${T.paper}; padding: 0 3px; }
        .ri-tr-ro > .ri-tr { position: relative; }
        .ri-mob-ust { display: none; }
        .ri-th-m { display: none; }
        /* === RiceFormula === */
        .ri-fm { display: flex; flex-direction: column; gap: 8px; align-items: center; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 12px 14px; animation: ri-kir 0.4s ease-out both; }
        .ri-fm-q { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: center; gap: 6px 10px; }
        .ri-fm-b { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 52px; }
        .ri-fm-v { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; background: ${T.bg}; border-radius: 9px; padding: 4px 10px; min-width: 44px; text-align: center; }
        .ri-fm-b.natija .ri-fm-v { color: #fff; background: ${T.accent}; }
        .ri-fm-n { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .ri-fm-z { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: ${T.ink2}; line-height: 36px; }
        .ri-fm:has(> .q-izoh) { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 4px 20px; }
        .ri-fm:has(> .q-izoh) > .ri-fm-q { grid-row: 1 / span 2; }
        .ri-fm:has(> .q-izoh) > p.ri-manba-q { text-align: left; }
        .ri-fm.kichik { padding: 9px 12px; } .ri-fm.kichik .ri-fm-v { font-size: 16px; padding: 3px 8px; } .ri-fm.kichik .ri-fm-z { font-size: 16px; line-height: 30px; }
        .ri-fm:not(.tola) .ri-fm-v { color: ${T.line}; }
        p.ri-manba-q { margin: 0; font-size: 12px; line-height: 1.45; color: ${T.ink2}; text-align: center; }
        /* === 0-ekran: yo'l «6 g'oya → ? → 3 g'oya» + Mentorning g'oyalari === */
        .ri-s0m { display: flex; flex-direction: column; gap: 12px; }
        .ri-yol { display: flex; align-items: flex-start; gap: 6px; }
        .ri-yol-b { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 6px 10px; white-space: nowrap; }
        .ri-yol-b.uch { color: ${T.accent}; border-color: ${fon(T.accent, 0.35)}; }
        .ri-yol-c { flex: 1; height: 0; margin-top: 15px; border-top: 2px dashed ${T.line}; min-width: 14px; }
        .ri-yol-s { width: 32px; height: 32px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ${T.bg}; border: 1px solid ${T.line}; font-weight: 800; color: ${T.ink2}; }
        .ri-yol-k { display: flex; gap: 4px; }
        .ri-yol-k i { width: 22px; height: 26px; display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; color: ${T.accent}; border: 1.5px dashed ${fon(T.accent, 0.5)}; border-radius: 6px; animation: ri-kir 0.35s ease-out both; }
        .ri-mg { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 12px 14px; }
        .ri-mg-h { display: flex; justify-content: space-between; align-items: center; }
        .ri-mg-son { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ok}; }
        ol.ri-mg-ro { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 6px 10px; }
        .ri-mg-q { display: flex; align-items: center; gap: 7px; padding: 7px 9px; border-radius: 9px; background: ${T.bg}; animation: ri-kir 0.35s ease-out both; animation-delay: calc(var(--i) * 0.08s); }
        .ri-s0m.tanlandi .ri-mg-q { animation: ri-siljish 0.7s ease-in-out both; animation-delay: calc(var(--i) * 0.06s); }
        .ri-mg-i { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ri-mg-t { flex: 1; min-width: 0; font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .ri-mg-q .ri-manba { font-size: 10.5px; padding: 1px 6px; background: ${T.paper}; }
        /* === 1-ekran: reja chizmasi === */
        .ri-rj { display: flex; flex-direction: column; gap: 10px; }
        ol.ri-rj-ro { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 6px 10px; }
        .ri-rj-q { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; animation: ri-kir 0.35s ease-out both; animation-delay: calc(var(--i) * 0.09s); }
        .ri-rj-t { font-size: 13px; font-weight: 700; color: ${T.ink}; min-width: 0; }
        .ri-rj-k { display: inline-flex; gap: 3px; }
        .ri-rj-k i { width: 17px; height: 17px; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 10px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 5px; animation: ri-tush 0.35s ease-out both; animation-delay: 0.8s; }
        .ri-rj-uch { display: flex; align-items: center; gap: 8px; align-self: flex-start; padding: 8px 12px; border-radius: 12px; border: 1.5px solid ${fon(T.accent, 0.4)}; background: ${T.paper}; animation: ri-kir 0.4s ease-out both; animation-delay: 1.2s; }
        .ri-rj-uch-l { font-size: 12px; font-weight: 800; color: ${T.accent}; letter-spacing: 0.05em; text-transform: uppercase; }
        .ri-rj-uch i { width: 34px; height: 26px; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; color: ${T.accent}; border: 1.5px dashed ${fon(T.accent, 0.5)}; border-radius: 7px; animation: ri-tush 0.35s ease-out both; animation-delay: calc(1.4s + var(--j) * 0.1s); }
        /* === 2-ekran: uch savol-tugma + jadval === */
        .ri-s2, .ri-s4 { display: flex; flex-direction: column; gap: 12px; }
        .ri-svr { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
        .ri-sv { display: flex; align-items: flex-start; gap: 9px; text-align: left; font-family: 'Manrope', sans-serif; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 13px; padding: 10px 12px; cursor: pointer; color: ${T.ink}; transition: background 0.3s, border-color 0.3s; }
        .ri-sv:disabled { cursor: default; }
        .ri-sv:disabled:not(.bosildi) { opacity: 0.55; }
        .ri-sv.bosildi { background: ${T.okFon}; border-color: ${fon(T.ok, 0.4)}; }
        .ri-sv-n { flex-shrink: 0; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        .ri-sv.bosildi .ri-sv-n { color: #fff; background: ${T.ok}; }
        .ri-sv-b { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ri-sv-b b { font-size: 14px; }
        .ri-sv-b span { font-size: 12px; line-height: 1.35; color: ${T.ink2}; }
        .ri-yigdi { align-self: flex-start; font-size: 13px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 4px 12px; }
        /* === 3-ekran: testdan keyingi karta === */
        .ri-tv3 { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ri-tv3-n { font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
        .ri-tv3-k { display: flex; flex-wrap: wrap; gap: 6px; }
        .ri-tv3-c { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 4px 8px; }
        .ri-tv3-c small { font-size: 11.5px; }
        .ri-tv3-c b { font-size: 13px; }
        .ri-tv3-c em { font-style: normal; font-weight: 700; font-size: 11.5px; }
        .ri-tv3-c.ajrat { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ri-chetda-chip { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; background: ${T.line}; border-radius: 999px; padding: 3px 10px; animation: ri-tush 0.4s ease-out 0.4s both; }
        /* === 4-ekran: shkala qatori === */
        p.ri-shk { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
        .ri-shk-l { font-size: 12px; font-weight: 800; color: ${T.ink2}; align-self: center; }
        .ri-shk-q { font-size: 12.5px; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 8px; padding: 4px 9px; }
        .ri-shk-q b { color: ${T.ink}; font-family: 'JetBrains Mono', monospace; }
        .ri-shk-q.ish { animation: ri-ajrat 1.8s ease-out 0.3s both; }
        /* === 6-ekran: Stories sahnasi === */
        .ri-insta { font-weight: 800; background: linear-gradient(90deg, #F58529, #DD2A7B, #8134AF); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .ri-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .ri-nuq-l { margin-right: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ri-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .ri-nuq i.ok { background: ${T.ok}; }
        .ri-nuq i.cur { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .ri-voqea { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .ri-voqea > .zoomable:not(.zoom-on) { width: 100%; display: flex; justify-content: center; }
        .ri-voqea > .zoomable.zoom-on { display: flex; justify-content: center; }
        .ri-voqea-h { font-weight: 800; font-size: clamp(16px,1.8vw,19px); color: ${T.ink}; animation: ri-kir 0.35s ease-out both; }
        .ri-voqea .ri-bash, .ri-voqea .ri-bashq, .ri-voqea p.q-xulosa { width: 100%; max-width: 680px; text-align: left; }
        .ri-st { display: block; width: 100%; max-width: 440px; height: auto; } /* 1280×800 da bashorat kartasi panel ustida (F-1007-289) */
        .ri-st-nom { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800; }
        .ri-st-nom.ig { font-size: 18px; }
        .ri-st-d.kir { animation: ri-kir 0.4s ease-out both; animation-delay: calc(var(--i) * 0.22s); transform-box: fill-box; transform-origin: center; }
        .ri-st-d.bos { animation: ri-kir 0.4s ease-out 0.22s both, ri-st-bos 0.5s ease-in-out 1.3s both; }
        @keyframes ri-st-bos { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.8); } }
        .ri-st-foto { opacity: 0; animation: ri-st-foto 3.4s ease-in-out 1.7s both; }
        @keyframes ri-st-foto { 0% { opacity: 0; } 10%, 82% { opacity: 1; } 100% { opacity: 0; } }
        .ri-st-vaqt { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); animation: ri-st-vaqt 2.6s linear 2s both; }
        @keyframes ri-st-vaqt { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .ri-st-lenta { transition: transform 0.6s cubic-bezier(.2,.8,.2,1); }
        .ri-st-lenta.past { transform: translateY(28px); }
        .ri-st-qator { transition: transform 0.9s cubic-bezier(.2,.8,.2,1) 0.6s; }
        .ri-st-qator.surildi { transform: translateX(-14px); }
        .ri-st.b2 .ri-st-qator .ri-st-d circle:first-child { filter: drop-shadow(0 0 3px rgba(221,42,123,0.55)); }
        .ri-st-chiz path { fill: none; stroke: #DD2A7B; stroke-width: 1.3; opacity: 0.55; stroke-dasharray: 1; stroke-dashoffset: 1; animation: ri-st-chiz 0.9s ease-out both; animation-delay: calc(0.3s + var(--i) * 0.09s); }
        @keyframes ri-st-chiz { to { stroke-dashoffset: 0; } }
        .ri-st-od.kir { animation: ri-kir 0.45s ease-out both; animation-delay: calc(var(--i) * 0.08s); }
        .ri-st.tinch * { animation: none !important; transition: none !important; }
        .ri-st.tinch .ri-st-chiz path { stroke-dashoffset: 0; }
        /* === 7, 12-ekran: testdan keyingi kartalar === */
        .ri-tv7 { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ri-tv7-u { display: flex; flex-wrap: wrap; gap: 6px; }
        .ri-tv7-u b { font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 4px 10px; }
        .ri-tv7-u b.ajrat { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ri-tv7-s { width: 100%; max-width: 300px; }
        .ri-tv12 { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .ri-tv12-q { display: flex; align-items: center; gap: 10px; }
        .ri-tv12-q b { width: 28px; font-family: 'JetBrains Mono', monospace; font-size: 15px; color: ${T.ink}; }
        .ri-tv12-y { flex: 1; height: 12px; border-radius: 6px; background: ${T.bg}; overflow: hidden; }
        .ri-tv12-y i { display: block; height: 100%; border-radius: 6px; background: ${T.accent}; transform-origin: left; animation: ri-tv12 0.8s ease-out both; }
        @keyframes ri-tv12 { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        /* === 8, 9-ekran: ixcham ro'yxat + bitta katta karta (SABOQ 29) === */
        .ri-royxat { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 12px 14px; }
        .ri-royxat-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ri-royxat-son { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.accent}; }
        .ri-royxat-son span { display: inline-block; animation: ri-tush 0.4s ease-out; }
        ol.ri-gq-ro { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 6px 12px; }
        .ri-gq { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; transition: opacity 0.4s; }
        .ri-gq.chetda { opacity: 0.55; }
        .ri-gq.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; background: ${T.accentSoft}; }
        .ri-gq.yangi { animation: ri-yashil 1.2s ease-out; }
        .ri-gq-n { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .ri-gq-t { flex: 1; min-width: 0; font-size: 13px; font-weight: 700; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ri-gq-r { font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: ${T.accent}; }
        .ri-gq-b { flex-shrink: 0; width: 26px; height: 26px; border: none; border-radius: 7px; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; font-size: 13px; }
        .ri-gq-b:hover { color: ${T.accent}; }
        .ri-holat { flex-shrink: 0; font-size: 11.5px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border-radius: 999px; padding: 2px 9px; }
        .ri-holat.otdi { color: ${T.ok}; background: ${T.okFon}; }
        .ri-holat.chetda { color: ${T.ink2}; background: ${T.line}; }
        .ri-s8-k { width: 100%; max-width: 860px; align-self: center; animation: ri-kir 0.45s ease-out both; }
        .ri-karta { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 18px; padding: 14px 16px; box-shadow: 0 14px 34px -22px rgba(${T.shadowBase},0.5); transition: transform 0.5s, opacity 0.5s, border-color 0.4s; }
        .ri-karta.otdi { border-color: ${T.ok}; box-shadow: 0 0 0 2px ${fon(T.ok, 0.25)}; }
        .ri-karta.chetga { opacity: 0.55; transform: translateY(10px); }
        .ri-karta.katta { padding: 16px 18px; }
        .ri-royxat.keng ol.ri-gq-ro { gap: 8px 14px; }
        .ri-th.och .ri-th-n { color: ${T.ink}; }
        .ri-jad.saralash { gap: 10px; }
        .ri-rq.tol { border-color: ${fon(T.ok, 0.35)}; }
        .ri-karta-bosh { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ri-karta-nom { font-weight: 800; font-size: 14.5px; color: ${T.ink}; text-align: right; }
        .ri-kq { display: grid; grid-template-columns: 110px minmax(0,1fr); align-items: center; gap: 10px; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; }
        .ri-kq-l { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ri-kq-t { font-size: 14px; font-weight: 600; color: ${T.ink}; overflow-wrap: anywhere; }
        .ri-karta-ich { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); gap: 10px 14px; align-items: start; }
        .ri-karta-g { display: flex; flex-direction: column; gap: 6px; }
        .ri-karta-g .ri-kq { grid-template-columns: minmax(0,1fr); gap: 1px; padding: 6px 10px; }
        .ri-ks { display: flex; flex-direction: column; gap: 6px; }
        .ri-ks-q { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 11px; border: 1px solid ${T.line}; transition: background 0.3s, opacity 0.3s; }
        .ri-ks-q.jor { border-color: ${fon(T.accent, 0.4)}; }
        .ri-ks-q.kut { opacity: 0.45; }
        .ri-ks-q.ok { animation: ri-yashil 1.1s ease-out; }
        .ri-ks-q.yoq { background: ${T.bg}; }
        .ri-ks-s { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .ri-ks-s b { font-size: 14px; color: ${T.ink}; }
        .ri-ks-s span { font-size: 12.5px; color: ${T.ink2}; }
        .ri-ks-s em { font-style: normal; font-size: 12px; color: ${T.ink2}; margin-top: 3px; }
        .ri-ks-t { display: inline-flex; gap: 8px; }
        .ri-ks-b { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 800; animation: ri-tush 0.4s ease-out both; }
        .ri-ks-b.ok { color: #fff; background: ${T.ok}; }
        .ri-ks-b.yoq { color: ${T.ink2}; background: ${T.line}; }
        .ri-ks-b.yoqli { color: ${T.line}; animation: none; }
        .ri-rq { position: relative; display: grid; grid-template-columns: 190px minmax(0,1fr) 22px; align-items: center; gap: 6px 12px; padding: 7px 11px; border-radius: 11px; border: 1px solid ${T.line}; }
        .ri-rq.jor { border-color: ${fon(T.accent, 0.45)}; }
        .ri-rq.yozildi { animation: ri-yashil 1.1s ease-out; }
        .ri-rq-s { display: flex; flex-direction: column; gap: 1px; }
        .ri-rq-s b { font-size: 14px; color: ${T.ink}; }
        .ri-rq-s span { font-size: 12px; color: ${T.ink2}; line-height: 1.35; }
        .ri-rq-m { min-width: 0; }
        .ri-rq-b { font-weight: 800; color: ${T.ok}; }
        .ri-rq-x { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 3px; }
        .ri-tl { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .ri-tl .q-chip { font-size: 12.5px; padding: 6px 10px; }
        .ri-tl-h { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ri-s9-y { display: flex; flex-direction: column; gap: 10px; }
        .ri-bel { width: 22px; height: 22px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 2px solid ${T.accent}; background: ${T.paper}; color: #fff; font-size: 13px; font-weight: 800; cursor: pointer; padding: 0; }
        .ri-bel.on { background: ${T.accent}; }
        .ri-chetda-q { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 3px 10px; }
        .ri-sabab { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        /* === 10-ekran: juftlik === */
        .ri-s10q { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
        .ri-s10 { display: grid; grid-template-columns: minmax(0,1fr); gap: 14px; align-items: start; }
        .ri-s10.yakka.tanlandi { grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); }
        .ri-s10:has(.ri-s10-u) { grid-template-columns: minmax(0,1.2fr) minmax(0,0.8fr); }
        .ri-s10-k { display: flex; flex-direction: column; gap: 10px; }
        .ri-sk { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 18px; padding: 14px 16px; box-shadow: 0 14px 34px -22px rgba(${T.shadowBase},0.5); }
        .ri-sk-nom { font-weight: 800; font-size: 15px; color: ${T.ink}; }
        .ri-sk-ro { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 8px; width: 100%; }
        .ri-sk-ro.ri-guruh { width: 100%; }
        .ri-son-b { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.bg}; font-family: 'Manrope', sans-serif; cursor: pointer; transition: transform 0.3s, border-color 0.3s, background 0.3s; }
        .ri-son-b span { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .ri-son-b b { font-family: 'JetBrains Mono', monospace; font-size: 22px; color: ${T.ink}; }
        .ri-son-b:disabled { cursor: default; }
        .ri-son-b.on { border-color: ${T.accent}; background: ${T.accentSoft}; transform: scale(1.06); box-shadow: 0 0 0 3px ${fon(T.accent, 0.25)}; }
        .ri-son-b.on b { color: ${T.accent}; }
        .ri-son-b.rice { cursor: default; background: ${T.paper}; }
        .ri-son-b.rice b { color: ${T.accent}; }
        .ri-son-ok { position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; color: #fff; background: ${T.ok}; border-radius: 50%; animation: ri-tush 0.4s ease-out both; }
        .ri-qaror { display: flex; flex-wrap: wrap; gap: 8px; }
        .ri-pufak { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 14px 14px 14px 4px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.5); }
        .ri-pufak::after { content: ''; position: absolute; right: -10px; top: 26px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 10px solid ${T.accent}; }
        .ri-pufak-h { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ri-pufak-h b { color: ${T.accent}; }
        p.ri-pufak-t { margin: 0; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; }
        .ri-taymer { display: flex; align-items: center; gap: 14px; }
        .ri-taymer .q-btn { align-self: center; }
        .ri-taymer-h { position: relative; flex-shrink: 0; width: 76px; height: 76px; }
        .ri-taymer-h svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .ri-taymer-h circle { fill: none; stroke-width: 8; }
        .ri-taymer-h circle.f { stroke: ${T.line}; }
        .ri-taymer-h circle.o { stroke: ${T.accent}; stroke-linecap: round; transition: stroke-dashoffset 1s linear; }
        .ri-taymer-s { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: ${T.ink}; }
        /* === 11-ekran: VS Code oynasi === */
        .ri-darvoza { display: flex; flex-direction: column; gap: 10px; }
        .ri-darvoza-s { font-weight: 700; font-size: 15px; line-height: 1.45; color: ${T.ink}; }
        .ri-darvoza-v { display: flex; flex-direction: column; align-items: stretch; gap: 8px; width: 100%; }
        .ri-darvoza-v .q-chip { text-align: left; }
        ol.ri-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        ol.ri-vazifa li { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; }
        ol.ri-vazifa li i { flex-shrink: 0; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }
        ol.ri-vazifa li span { min-width: 0; overflow-wrap: anywhere; }
        .ri-kyordam { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .ri-kyordam .q-btn { align-self: flex-start; }
        .ri-kyordam-b { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; }
        .ri-amal + .ri-kyordam-b { margin-top: 10px; } /* eslatma «Bajardim» ostida — tugma doim ko'rinadi (F-1007-289) */
        .ri-kyordam-h { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ri-kyordam-b .qcode { white-space: normal; overflow-wrap: anywhere; }
        ul.ri-esl { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .ri-kodoyna { display: flex; flex-direction: column; gap: 10px; height: 100%; }
        .ri-vsc { display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; background: #1E1E1E; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.7); user-select: none; -webkit-user-select: none; flex: 1; }
        .ri-vsc-bar { display: flex; justify-content: space-between; align-items: center; background: #252526; padding: 0 10px 0 0; }
        .ri-vsc-fayl { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #1E1E1E; color: #E8E5DD; font-family: 'JetBrains Mono', monospace; font-size: 12px; border-top: 2px solid ${T.accent}; }
        .ri-vsc-fayl b { color: #E8C547; font-size: 10.5px; }
        .ri-vsc-lock { font-size: 11px; color: #9DA3AE; font-family: 'Manrope', sans-serif; }
        .ri-vsc-body { padding: 8px 0; }
        @media (min-width: 761px) { .ri-vsc-body { max-height: max(220px, calc(100vh - 520px)); overflow-y: auto; scrollbar-width: thin; scrollbar-color: #4A4A4A transparent; } } /* 1280×800: kutilgan natija ko'rinsin, kod oyna ichida suriladi (F-1007-289) */
        .ri-vsc-q { display: flex; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 1.3; color: #D4D4D4; white-space: pre; transition: background 0.3s; }
        .ri-vsc-q.ajrat { background: rgba(255,211,128,0.18); box-shadow: inset 3px 0 0 #FFD380; }
        .ri-vsc-n { width: 30px; flex-shrink: 0; text-align: right; padding-right: 10px; color: #6E7681; }
        .ri-vsc-k { min-width: 0; }
        .ri-kd-iz { color: #6A9955; font-style: italic; } .ri-kd-str { color: #CE9178; } .ri-kd-kw { color: #569CD6; }
        .ri-term { display: flex; flex-direction: column; gap: 1px; padding: 8px 14px 10px; background: #141414; border-top: 1px solid #333; opacity: 0.42; transition: opacity 0.6s; }
        .ri-term.tayyor { opacity: 1; }
        .ri-term-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #9DA3AE; margin-bottom: 3px; }
        .ri-term-q { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #7DD181; }
        .ri-term-q.buyruq { color: #FFD380; }
        .ri-term.tayyor .ri-term-q:not(.buyruq) { animation: ri-tq 0.7s ease-out both; animation-delay: calc(var(--i) * 0.3s + 0.3s); }
        @keyframes ri-tq { 0% { background: transparent; } 40% { background: rgba(125,209,129,0.22); } 100% { background: transparent; } }
        p.ri-sinf { margin: 0; font-size: 13px; color: ${T.ink2}; }
        p.ri-sinf b { color: ${T.accent}; font-family: 'JetBrains Mono', monospace; }
        /* === Kartochkalar va yakun === */
        .ri-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: ri-halqa-k 2.4s ease-in-out 0.4s 3; }
        @keyframes ri-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 3px ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 7px ${fon(T.accent, 0.3)}; } }
        p.ri-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.ri-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ri-puls 1.4s ease-out 3; }
        .ri-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .ri-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.ri-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .ri-hw { display: flex; flex-direction: column; gap: 10px; }
        .ri-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ri-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .ri-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .ri-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.ri-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.ri-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.ri-hw-qadam li i { flex-shrink: 0; font-style: normal; font-size: 17px; line-height: 1.3; color: ${T.accent}; }
        .ri-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        @media (max-width: 760px) {
          .ri-s10.yakka.tanlandi, .ri-s10:has(.ri-s10-u) { grid-template-columns: minmax(0,1fr); }
          .ri-pufak::after { display: none; }
        }
        @media (max-width: 640px) {
          ol.ri-sq-ro, ol.ri-gq-ro, ol.ri-mg-ro, ol.ri-rj-ro { grid-template-columns: minmax(0,1fr); }
          .ri-royxat:not(.keng):not(.ri-s10-u) ol.ri-gq-ro { display: flex; flex-wrap: wrap; gap: 6px; }
          .ri-royxat:not(.keng):not(.ri-s10-u) .ri-gq { padding: 5px 8px; gap: 6px; }
          .ri-royxat:not(.keng):not(.ri-s10-u) .ri-gq-t { display: none; }
          .ri-svr { grid-template-columns: minmax(0,1fr); gap: 6px; }
          .ri-sv-b span { display: none; }
          .ri-tr { grid-template-columns: repeat(5, minmax(0,1fr)); gap: 4px; }
          .ri-tr > .ri-td-g { grid-column: 1 / -1; }
          .ri-thr > .ri-th-g { display: none; }
          .ri-th-s, .ri-th-q { display: none; }
          .ri-thr .ri-th-b { display: none; }
          .ri-th-m { display: inline-flex; align-self: center; width: 22px; height: 22px; align-items: center; justify-content: center; border-radius: 50%; font-size: 11px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; }
          .ri-th.jor .ri-th-m { color: #fff; background: ${T.accent}; }
          .ri-mob-ust { display: block; }
          .ri-mob-ust .ri-th-b { font-size: 13px; padding: 9px 10px; }
          .ri-td { font-size: 12.5px; min-height: 26px; }
          .ri-jad.rice.qavs { padding-left: 32px; }
          .ri-jad.rice.qavs .ri-tr.u1::after { left: -30px; }
          .ri-kq { grid-template-columns: minmax(0,1fr); gap: 2px; }
          .ri-karta-ich { grid-template-columns: minmax(0,1fr); }
          .ri-ks-q { grid-template-columns: minmax(0,1fr); }
          .ri-rq { grid-template-columns: minmax(0,1fr) 22px; }
          .ri-rq > .ri-rq-m { grid-column: 1 / -1; grid-row: 2; }
          .ri-sk-ro { grid-template-columns: repeat(3, minmax(0,1fr)); }
          .ri-son-b b { font-size: 18px; }
          .ri-hw-karta { grid-template-columns: minmax(0,1fr); }
          .ri-fm:has(> .q-izoh) { grid-template-columns: minmax(0,1fr); }
          .ri-fm:has(> .q-izoh) > .ri-fm-q { grid-row: auto; }
          .ri-yol-b { font-size: 12px; padding: 5px 8px; }
          .ri-vsc-q { font-size: 8.8px; }
          .ri-vsc-n { width: 22px; padding-right: 6px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lesson-root [class*="ri-"], .lesson-root [class*="ri-"]::after, .lesson-root [class*="ri-"] *, .lesson-root .stage-nav .btn-white-accent::after { animation: none !important; transition: none !important; }
          .ri-st-foto { display: none; }
          .ri-st-chiz path { stroke-dashoffset: 0; }
          .ri-st-vaqt { transform: scaleX(1); }
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
