import { createPortal } from 'react-dom';
import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 13-Modul 11-dars «Mahsulotingiz hozir qayerda?» — skeletdan (08.10.2026, 2-to'lqin); MD: feedback/F-1007-13modul/11-PmReflection-v3.md
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QXulosa, QXato, QKirish, QReja, QTushuncha, QTest, QTestJavob, QVoqea, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m11d11-v1', lessonTitle: { uz: 'Mahsulotingiz hozir qayerda?', ru: 'Где сейчас ваш продукт?' } };
// 12 ekran (MD v3): kirish → reja → holatlar → 1-savol → Tesla → 2-savol → o'z roadmap'ingiz → shaxsiy hisobot → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'roadmap', ru: 'roadmap' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'holat', ru: 'статус' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'qaror', ru: 'решение' }, l: 24, tp: 70, s: 12, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal, natijaSignal }) => {
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
  // SABOQ P11: tugagan holat — desktopda ham natija (yashil xulosa) pastki panel ustida ko'rinsin
  useEffect(() => {
    if (!natijaSignal) return undefined;
    const el = contentRef.current;
    if (!el) return undefined;
    const t = setTimeout(() => { if (el && el.scrollHeight > el.clientHeight + 4) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, 520);
    return () => clearTimeout(t);
  }, [natijaSignal]);
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `practice: -1` — 6, 7-ekran «Saqlash» signali (PRACTICE_BASE + ekran) haqiqatan yuboriladi (SABOQ P15).
// To'g'ri javob o'rinlari (MD): 3-ekran B · 5-ekran D · 8-ekran A.
const INLINE_KEYS = { s3: 1, s5: 3, s8: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: "Roadmap'da yo'q ish", ru: 'Работа, которой нет в roadmap' },
    cards: [
      { ic: '1', h: { uz: "Bu darsda holat roadmap'dagi ish o'z ufqiga qarab qayerda ekanini aytadi.", ru: 'На этом уроке статус говорит, где работа из roadmap относительно своего горизонта.' } },
      { ic: '2', h: { uz: "«Bajarildi» — roadmap'dagi ish uchun: o'z ufqi ichida tugagan va hozir ishlaydi.", ru: '«Выполнено» — для работы из roadmap: закончена в своём горизонте и сейчас работает.' } },
      { ic: '3', h: { uz: "Roadmap'da yo'q, lekin qilingan ish — yangi qo'shildi.", ru: 'Не было в roadmap, но сделано — добавлено новое.' }, ask: { uz: "Mahsulotingizda roadmap'da yo'q qaysi ish bor?", ru: 'Какая работа в вашем продукте не была в roadmap?' } }
    ]
  },
  5: {
    title: { uz: 'Roadmap nimaga kerak', ru: 'Зачем нужен roadmap' },
    cards: [
      { ic: '1', h: { uz: 'Tesla rejasi hammaga ochiq yozilgan edi.', ru: 'План Tesla был записан открыто для всех.' } },
      { ic: '2', h: { uz: 'Bu voqeada reja bosqichma-bosqich bajarilgan.', ru: 'В этой истории план выполнялся поэтапно.' } },
      { ic: '3', h: { uz: 'Roadmap ham keyin nima bajarilganini solishtirish uchun yoziladi.', ru: 'Roadmap тоже пишут, чтобы потом сравнить, что выполнено.' }, ask: { uz: "Roadmap'ingizni oxirgi marta qachon ochgansiz?", ru: 'Когда вы в последний раз открывали свой roadmap?' } }
    ]
  },
  8: {
    title: { uz: "Noto'g'ri chiqqan qaror", ru: 'Решение, оказавшееся неверным' },
    cards: [
      { ic: '1', h: { uz: "Shaxsiy hisobotda o'z qaroringiz yoziladi.", ru: 'В личном отчёте записывается ваше собственное решение.' } },
      { ic: '2', h: { uz: "Noto'g'ri chiqqan qaror yonida — uni ko'rsatgan dalil: son yoki yozuv.", ru: 'Рядом с неверным решением — довод, который его показал: число или запись.' } },
      { ic: '3', h: { uz: 'Mentor misolida: 1-darsdagi narx taxmini va 4-darsdagi xarajat hisobi.', ru: 'В примере Ментора: предположение о цене на 1-м уроке и расчёт расходов на 4-м уроке.' }, ask: { uz: "Qaysi son yoki suhbat fikringizni o'zgartirdi?", ru: 'Какое число или разговор изменили ваше мнение?' } }
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
  // javobdan keyin chiqqan varaq pastki panel ostida qolmasin (qayta kirganda surilmaydi)
  const vizOchiq = !!vizual && (isMentorLive ? mReveal : (solved && revealed));
  const vizBosh = useRef(vizOchiq);
  useEffect(() => {
    if (!vizOchiq || vizBosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.hd-tviz'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 720);
    return () => clearTimeout(t);
  }, [vizOchiq]);
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="hd-tviz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI — «Holat doskasi» (HolatDoska: doska · telefon · hisobot varag'i; MD A «Bitta vizual», KOD 3) =====
// qolip-maket: hd-karta hd-holat hd-qator hd-vq-t
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// son va «8 / 10» qator oxirida bo'linmaydi (SABOQ P9)
const nb = (s) => (typeof s === 'string' ? s.replace(/(\d) (\d{3})(?!\d)/g, '$1 $2').replace(/(\d) \/ (\d)/g, '$1 / $2') : s);
const ruKop = (n, f) => { const a = Math.abs(n) % 100, b = a % 10; return a > 10 && a < 20 ? f[2] : b === 1 ? f[0] : b >= 2 && b <= 4 ? f[1] : f[2]; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq — natija ekranda qoladi */ } };
const matnOl = (v) => (typeof v === 'string' ? v.trim() : (v && typeof v === 'object' ? String(v.uz || v.ru || '').trim() : ''));
const qisqa = (s, n = 26) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

// Kalitlar (tayanch 8): o'qiydi — 11-Modul roadmap va reja, 13-Modul 1, 2, 4, 6, 9-darslar; yozadi — faqat pm-m11d11-refleksiya
const ROADMAP_KEY = 'pm-m9d6-roadmap';
const REJA_KEY = 'pm-m9d15-reja';
const BIRLIK_KEY = 'pm-m11d1-birlik';
const MODEL_KEY = 'pm-m11d2-model';
const NARX_KEY = 'pm-m11d4-narx';
const SUHBAT_KEY = 'pm-m11d6-suhbat';
const TASDIQ_KEY = 'pm-m11d9-tasdiq';
const REF_KEY = 'pm-m11d11-refleksiya';

const MAYDON_RANG = '#2E9E4F'; // 11-Modul 9.62 — «Maydon Jamoa» nomi (src/9-Modull, src/10-Modull darslari bilan bir)
const TESLA_RANG = '#E31937';
const TELEGRAM_RANG = '#229ED9';
const MJ = () => <b className="hd-mj">Maydon Jamoa</b>;
const TAXMIN_YORLIQ = { uz: 'Mentorning taxmini', ru: 'Предположение Ментора' };

const UFQLAR = [
  { id: 'hozir', t: { uz: 'Hozir · 11-Modul', ru: 'Сейчас · Модуль 11' }, q: { uz: 'Hozir', ru: 'Сейчас' } },
  { id: 'keyinroq', t: { uz: 'Keyinroq · 12–13-Modul', ru: 'Позже · Модули 12–13' }, q: { uz: 'Keyinroq', ru: 'Позже' } },
  { id: 'uzoqroq', t: { uz: 'Uzoqroq · bitiruvdan keyin', ru: 'Дальше · после выпуска' }, q: { uz: 'Uzoqroq', ru: 'Дальше' } }
];
const UFQSIZ = { id: 'ufqsiz', t: { uz: "Ufqi yo'q", ru: 'Без горизонта' } };
const HOLATLAR = {
  bajarildi: { t: { uz: 'Bajarildi', ru: 'Выполнено' }, ch: { uz: 'bajarildi', ru: 'выполнено' } },
  kechikdi: { t: { uz: 'Kechikdi', ru: 'Опоздало' }, ch: { uz: 'kechikdi', ru: 'опоздало' } },
  'olib-tashlandi': { t: { uz: 'Olib tashlandi', ru: 'Убрано' }, ch: { uz: 'olib tashlandi', ru: 'убрано' } },
  uzoqroqda: { t: { uz: 'Uzoqroqda qoldi', ru: 'Осталось дальше' }, ch: { uz: 'uzoqroqda qoldi', ru: 'осталось дальше' } },
  yangi: { t: { uz: "Yangi qo'shildi", ru: 'Добавлено новое' }, ch: { uz: "yangi qo'shildi", ru: 'добавлено новое' } }
};
const HOLAT_TARTIB = ['bajarildi', 'kechikdi', 'olib-tashlandi', 'uzoqroqda', 'yangi'];
const TARIX_HOLAT = { bajarildi: { uz: 'bajarildi', ru: 'выполнено' }, kechikdi: { uz: 'kechikdi', ru: 'опоздало' }, boshlanmadi: { uz: 'boshlanmadi', ru: 'не начато' } };

// --- Bitta manbalar (A-6 aynan; tayanch 1.11) ---
const SABAB_11 = { uz: '11-Modulda qurildi', ru: 'Построено в Модуле 11' };
const SABAB_12 = { uz: '12-Modulda qurildi', ru: 'Построено в Модуле 12' };
const MENTOR_ROADMAP = [
  { id: 'elon', nom: { uz: "O'yin e'loni va qo'shilish", ru: 'Объявление об игре и присоединение' }, ufq: 'hozir', holat: 'bajarildi', sabab: SABAB_11, telefon: 'elon' },
  { id: 'tasdiq', nom: { uz: "O'yin kuni tasdiq", ru: 'Подтверждение в день игры' }, ufq: 'hozir', holat: 'bajarildi', sabab: SABAB_11, telefon: 'elon' },
  { id: 'navbat', nom: { uz: 'Chiqish va navbat', ru: 'Выход и очередь' }, ufq: 'hozir', holat: 'bajarildi', sabab: SABAB_11, telefon: 'elon' },
  { id: 'eslatma', nom: { uz: "O'yindan oldin eslatma", ru: 'Напоминание перед игрой' }, ufq: 'keyinroq', holat: 'bajarildi', sabab: SABAB_12, telefon: 'eslatma' },
  { id: 'royxat', nom: { uz: "Ro'yxat o'zi yangilanadi", ru: 'Список обновляется сам' }, ufq: 'keyinroq', holat: 'bajarildi', sabab: SABAB_12, telefon: 'jonli' },
  { id: 'pul', nom: { uz: "Maydon pulini bo'lishish", ru: 'Делить плату за поле' }, ufq: 'uzoqroq', holat: 'uzoqroqda', sabab: { uz: "muammo gapidan kelmaydi; 2-darsda solishtirildi", ru: 'не следует из формулировки проблемы; сравнили на 2-м уроке' }, telefon: 'yoq' }
];
const SABAB_YANGI = { uz: '50 foydalanuvchi va pul — 12–13-Modul ishi', ru: '50 пользователей и деньги — работа Модулей 12–13' };
const MENTOR_YANGI = [
  { id: 'lending', nom: { uz: 'Lending', ru: 'Лендинг' }, holat: 'yangi', sabab: SABAB_YANGI, telefon: 'yangi' },
  { id: 'pro', nom: { uz: "Pro va test to'lov", ru: 'Pro и тестовая оплата' }, holat: 'yangi', sabab: SABAB_YANGI, telefon: 'yangi' },
  { id: 'telegram', nom: { uz: 'Telegram xabari', ru: 'Сообщение в Telegram' }, holat: 'yangi', sabab: SABAB_YANGI, telefon: 'yangi' },
  { id: 'taklif', nom: { uz: 'Taklif havolasi', ru: 'Ссылка-приглашение' }, holat: 'yangi', sabab: SABAB_YANGI, telefon: 'yangi' }
];
const MENTOR_KARTALAR = [
  { ids: ['elon', 'tasdiq', 'navbat'], togri: 'bajarildi', telefon: 'elon',
    dalil: { uz: "11-Modul 15-darsida «kechikdi» edi — o'z darsidan keyin, 11-Modul ichida ishladi.", ru: 'На 15-м уроке Модуля 11 было «опоздало» — заработало после своего урока, внутри Модуля 11.' },
    izoh: { uz: "Bajarildi — roadmap'dagi ish o'z ufqi ichida tugagan va hozir ishlaydi.", ru: 'Выполнено — работа из roadmap закончена в своём горизонте и сейчас работает.' } },
  { ids: ['eslatma'], togri: 'bajarildi', telefon: 'eslatma' },
  { ids: ['royxat'], togri: 'bajarildi', telefon: 'jonli' },
  { ids: ['pul'], togri: 'uzoqroqda', telefon: 'yoq',
    izoh: { uz: "Uzoqroqda qoldi — vaqti hali kelmagan ish o'z ustunida turibdi.", ru: 'Осталось дальше — работа, время которой ещё не пришло, стоит в своей колонке.' } },
  { ids: ['lending', 'pro', 'telegram', 'taklif'], togri: 'yangi', telefon: 'yangi',
    izoh: { uz: "Yangi qo'shildi — roadmap'da yo'q edi, lekin mahsulotga qo'shildi.", ru: 'Добавлено новое — в roadmap не было, но в продукт добавлено.' } }
];
const MENTOR_JAVOBLAR = [
  { k: 'qarorim', j: { uz: "Pro'ni o'yinchiga emas, tashkilotchiga qo'ydim.", ru: 'Я сделал Pro для организатора, а не для игрока.' } },
  { k: 'notogri', j: { uz: "1-darsda narxni 10 000 deb taxmin qildim; 4-darsda xarajatni qo'shib, narxni qayta ko'rdim.", ru: 'На 1-м уроке я предположил цену 10 000; на 4-м уроке добавил расходы и пересмотрел цену.' }, yorliq: TAXMIN_YORLIQ },
  { k: 'keyingi', j: { uz: "To'lashga tayyorligini yozgan uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinab ko'raman.", ru: 'С тремя организаторами, написавшими о готовности платить, испытаю «Постоянную игру» в тестовом режиме.' }, yorliq: { uz: "tasdiq — 9-darsdagi yozma tasdiq", ru: 'подтверждение — письменное подтверждение с 9-го урока' } }
];
const SAVOLLAR = [
  { k: 'qarorim', q: { uz: "O'z qarorim bilan nima qildim?", ru: 'Что я сделал по своему решению?' }, ch: { uz: 'Qarorim', ru: 'Моё решение' }, ph: { uz: "O'zingiz qaysi qarorni qildingiz?", ru: 'Какое решение приняли вы сами?' } },
  { k: 'notogri', q: { uz: "Qaysi qarorim noto'g'ri chiqdi va buni qaysi dalil ko'rsatdi?", ru: 'Какое моё решение оказалось неверным и какой довод это показал?' }, ch: { uz: "Noto'g'ri chiqqan qaror", ru: 'Неверное решение' }, ph: { uz: 'Qaysi qaror va qaysi son yoki yozuv?', ru: 'Какое решение и какое число или запись?' } },
  { k: 'keyingi', q: { uz: 'Keyingi 4 haftada nima qilaman?', ru: 'Что я сделаю в ближайшие 4 недели?' }, ch: { uz: 'Keyingi 4 hafta', ru: 'Ближайшие 4 недели' }, ph: { uz: 'Bitta aniq ish: nima qilasiz, qachon yoki kim bilan?', ru: 'Одно конкретное дело: что сделаете, когда или с кем?' } }
];
const MODEL_NOM = {
  freemium: { uz: "bepul asos va pullik qo'shimcha", ru: 'бесплатная основа и платное дополнение' },
  obuna: { uz: 'pullik obuna', ru: 'платная подписка' },
  reklama: { uz: 'reklama', ru: 'реклама' },
  b2b: { uz: "B2B — boshqa biznes to'laydi", ru: 'B2B — платит другой бизнес' },
  tranzaksiya: { uz: "tranzaksiya — har to'lovdan ulush", ru: 'транзакция — доля с каждого платежа' }
};

// --- O'quvchi ma'lumoti (yo'q bo'lsa — null; ekran baribir ishlaydi) ---
const roadmapOl = () => {
  const r = lsO(ROADMAP_KEY);
  if (!r || !Array.isArray(r.ishlar)) return null;
  const ishlar = r.ishlar.map(x => ({ nom: matnOl(x && x.nom), ufq: x && UFQLAR.some(u => u.id === x.ufq) ? x.ufq : null })).filter(x => x.nom);
  return ishlar.length ? ishlar : null;
};
const tarixOl = (nom) => {
  const r = lsO(REJA_KEY);
  if (!r || !Array.isArray(r.holatlar)) return null;
  const n = nom.toLowerCase().trim();
  const t = r.holatlar.find(h => h && matnOl(h.ish).toLowerCase() === n);
  return t && TARIX_HOLAT[t.holat] ? t.holat : null;
};
const refOl = () => lsO(REF_KEY);
const refYoz = (patch) => {
  const e = refOl() || {};
  const d = { roadmapManba: e.roadmapManba || null, ishlar: Array.isArray(e.ishlar) ? e.ishlar : null, javoblar: { qarorim: null, notogri: null, keyingi: null, ...(e.javoblar || {}) }, completedAt: e.completedAt || null, ...patch, savedAt: Date.now() };
  if (patch.javoblar) d.javoblar = { qarorim: null, notogri: null, keyingi: null, ...(e.javoblar || {}), ...patch.javoblar };
  const toliq = Array.isArray(d.ishlar) && d.ishlar.length > 0 && SAVOLLAR.every(s => typeof d.javoblar[s.k] === 'string' && d.javoblar[s.k].trim());
  if (toliq && !d.completedAt) d.completedAt = Date.now();
  if (!d.roadmapManba) delete d.roadmapManba; // tayanch 8: bu maydonlar faqat qiymat bo'lsa yoziladi
  if (!Array.isArray(d.ishlar)) delete d.ishlar;
  lsY(REF_KEY, d);
  return d;
};
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (04 `Ustoz` naqshi); matn MD dan, ekran raqami hisoblagich bo'yicha (SABOQ P8, P15)
const Ustoz = ({ satrlar }) => {
  const g = useContext(LiveGateCtx) || {};
  if (!(g.live && g.live.mode === 'mentor')) return null;
  return <div className="hd-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{tr(q)}</span>)}</div>;
};
const USTOZ = {
  s0: [
    { uz: "Javoblarni muhokama qilmang — bugun har o'quvchi o'z roadmap'ini birma-bir ko'radi. Mentor misolida: besh ish bajarildi, bittasi hali qilinmagan (uzoqroq ufqda), roadmap'da yo'q to'rtta ish qo'shilgan.", ru: 'Не обсуждайте ответы — сегодня каждый ученик по очереди посмотрит свой roadmap. В примере Ментора: пять работ выполнено, одна ещё не сделана (на дальнем горизонте), добавлены четыре работы, которых не было в roadmap.' },
    { uz: "Roadmap'i saqlanmagan o'quvchi 7-ekranda ishlarni o'zi yozadi.", ru: 'Ученик, у которого roadmap не сохранился, на 7-м экране сам запишет работы.' }
  ],
  s1: [
    { uz: "12-Modul 11-darsida pitchdagi da'volar va dalillar, 11-Modul 15-darsida Demo Day oldidan reja va risklar ko'rilgan; bugun — ortga qarash: mahsulot va o'zingiz. Yakkama-yakka bu darsda yo'q.", ru: 'На 11-м уроке Модуля 12 смотрели утверждения и доводы в питче, на 15-м уроке Модуля 11 — план и риски перед Demo Day; сегодня — взгляд назад: продукт и вы сами. Работы один на один на этом уроке нет.' }
  ],
  s2: [
    { uz: "11-Modul 15-darsida holat ishning o'z darsiga qarab qo'yilgan edi — o'shanda «Chiqish va navbat» kechikdi (14-darsda ishlamadi). Bugun roadmap'ga butun yo'l bilan qaraymiz: ishning vaqti — ufqi; navbat 11-Modul ichida ishladi — bajarildi.", ru: 'На 15-м уроке Модуля 11 статус ставили по уроку самой работы — тогда «Выход и очередь» опоздала (на 14-м уроке не работала). Сегодня смотрим на roadmap по всему пути: время работы — её горизонт; очередь заработала внутри Модуля 11 — выполнено.' },
    { uz: "O'sha darsdagi «boshlanmadi» bugun ikkiga bo'lingan: vaqti kelmagan uzoqroq ish — «uzoqroqda qoldi», vaqti o'tib, qilinmagan ish — «kechikdi». Roadmap'da yo'q to'rtta ish — Mentor roadmap darajasidagi katta ishlarni yozgan; «Hozir ko'ryapti» kabi kichik qismlar alohida sanalmagan.", ru: '«Не начато» того урока сегодня разделено на два: более дальняя работа, время которой не пришло, — «осталось дальше», работа, время которой прошло, а она не сделана, — «опоздало». Четыре работы, которых нет в roadmap, — Ментор записал крупные работы уровня roadmap; мелкие части вроде «Сейчас смотрят» отдельно не считались.' },
    { uz: "«Maydon pulini bo'lishish» 2-darsda modellar bilan solishtirilgan, lekin roadmap'dan o'chirilmagan — shuning uchun «olib tashlandi» emas. Sinfga savol: «Sizning roadmap'ingizda kechikkan ish bormi?»", ru: '«Делить плату за поле» на 2-м уроке сравнивали с моделями, но из roadmap не удалили — поэтому это не «убрано». Вопрос классу: «Есть ли в вашем roadmap опоздавшая работа?»' }
  ],
  s4: [
    { uz: "Tesla voqeasini 8-Modulda uch ufqli reja darsida ko'rgansiz — bugungi savol boshqa: yozilgan reja keyin nima uchun kerak. Ko'prik — umumiy joy: mahsulotingiz Tesla emas, roadmap'ingiz ham o'n yillik emas.", ru: 'Историю Tesla вы видели в Модуле 8 на уроке о плане с тремя горизонтами — сегодня вопрос другой: зачем записанный план нужен потом. Мост — общее место: ваш продукт не Tesla, и ваш roadmap тоже не на десять лет.' },
    { uz: "Bank bosqichlar qachon tugaganini, sotuv sonini, narxni aytmaydi — sahnaga son va sana qo'shmang; so'ralsa: «bu voqeada aytilmagan». «Maxfiy» — rejaning nomi; reja hammaga ochiq e'lon qilingan.", ru: 'Банк не говорит, когда закончились этапы, сколько продано и какая цена, — не добавляйте в сцену чисел и дат; если спросят: «в этой истории это не сказано». «Секретный» — название плана; план был объявлен открыто для всех.' }
  ],
  s6: [
    { uz: "20 daqiqa. Eng ko'p savol — «ishlayapti, lekin kech tugadi: bajarildimi?»: ufqiga qarang — ufqi ichida tugagan bo'lsa bajarildi, keyin tugagan bo'lsa kechikdi. Sababni o'quvchi yozadi, siz aytmaysiz.", ru: '20 минут. Самый частый вопрос — «работает, но закончили поздно: это выполнено?»: посмотрите на горизонт — если закончили внутри горизонта, выполнено, если позже — опоздало. Причину пишет ученик, вы её не называете.' },
    { uz: "Kechikkan va olib tashlangan ish — baho emas: roadmap taxmin bilan yozilgan edi, mahsulot esa o'zgardi. Keyinroq ufqi (12–13-Modul) shu modulda tugaydi, yangi funksiya uchun loyiha kuni qolmagan — shuning uchun undagi qilinmagan ish bugun «kechikdi».", ru: 'Опоздавшая и убранная работа — не оценка: roadmap писали по предположению, а продукт изменился. Горизонт «Позже» (Модули 12–13) заканчивается в этом модуле, проектных дней для новой функции не осталось — поэтому несделанная работа из него сегодня «опоздало».' },
    { uz: "Ish ko'p bo'lsa — avval Hozir va Keyinroq ustunlari.", ru: 'Если работ много — сначала колонки «Сейчас» и «Позже».' }
  ],
  s7: [
    { uz: "18 daqiqa. Noto'g'ri chiqqan qaror topmagan o'quvchi «Hozircha bunday qaror topmadim»ni bosadi va qayta ko'rishga sabab bo'lgan dalilni yozadi — bu to'g'ri javob; xato qaror o'ylab topishga undamang. Javoblarni ovoz chiqarib o'qitmang va sinfda solishtirmang — hisobot shaxsiy.", ru: '18 минут. Ученик, не нашедший решения, которое оказалось неверным, нажимает «Пока такого решения не нашёл» и пишет довод, из-за которого пересмотрел решение, — это правильный ответ; не подталкивайте придумывать ошибочное решение. Не давайте читать ответы вслух и не сравнивайте их в классе — отчёт личный.' },
    { uz: "Mentorning uchinchi javobi — niyat, va'da emas; bu kursda real pul yo'q: to'lov faqat test rejimda. «Keyingi 4 hafta» — o'quvchining o'z rejasi: keyingi modul va bitiruv haqida gapirmang.", ru: 'Третий ответ Ментора — намерение, не обещание; в этом курсе настоящих денег нет: оплата только в тестовом режиме. «Ближайшие 4 недели» — собственный план ученика: не говорите о следующем модуле и выпуске.' }
  ]
};
// Jonli dars: sinf ovozlari chizig'i — har variant va ovozlar soni, ism yo'q (04 `OvozChizigi` naqshi; MD 0-ekran)
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
    <div className="hd-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx('hd-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="hd-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>
  );
};
const javobSoni = (r) => (r && r.javoblar ? SAVOLLAR.filter(s => typeof r.javoblar[s.k] === 'string' && r.javoblar[s.k].trim()).length : 0);

function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn, kechik = 0, tur) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    const qosh = () => setUchlar(u => [...u, { k, matn, tur, x: a.left + Math.min(20, a.width / 3), y: a.top + Math.min(8, a.height / 3), dx: b.left - a.left + 6, dy: b.top - a.top + 4 }]);
    if (kechik) setTimeout(qosh, kechik); else qosh();
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 1050 + kechik);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className={cxx('hd-uch', z.tur)} style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
const useIpucha = (faol, dep) => {
  const [ko, setKo] = useState(false);
  useEffect(() => { setKo(false); if (!faol) return undefined; const t = setTimeout(() => setKo(true), 40000); return () => clearTimeout(t); }, [faol, dep]);
  return ko && faol;
};
const useYurish = (vaqtlar) => {
  const [f, setF] = useState(() => (kamHarakat() ? vaqtlar.length : 0));
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const ts = vaqtlar.map((ms, i) => setTimeout(() => setF(i + 1), ms));
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line
  return f;
};
// telefon sahnasi ichidagi qadamlar (faqat shu karta faol paytda; reduced-motion — oxirgi qadam)
const useAylanish = (soni, ms, faol) => {
  const [q, setQ] = useState(0);
  useEffect(() => {
    if (!faol) { setQ(0); return undefined; }
    if (kamHarakat()) { setQ(soni - 1); return undefined; }
    const t = setInterval(() => setQ(v => (v + 1) % soni), ms);
    return () => clearInterval(t);
  }, [faol, soni, ms]);
  return q;
};
// Taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori (E 42); QIzoh — oxirgi kichik qatori
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('hd-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="hd-x-m">{matn}</span>{izoh && <span className="hd-x-iz">{izoh}</span>}</>;
const BashoratQ = ({ savol, javob }) => <div className="hd-bashq fade-step"><span>{savol}</span><span className="hd-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;

// --- Doska: uch ufq ustuni + «Yangi qo'shildi» qatori; ish kartasi — nom · holat yorlig'i · sabab ---
const HdKarta = ({ x, joriy, xato, refs, onTahrir, i = 0 }) => {
  const h = x.holat && HOLATLAR[x.holat];
  const ichi = <>
    <span className="hd-nom">{x.nom}</span>
    <span key={x.holat || 'bosh'} className={cxx('hd-holat', !h && 'bosh')}>{h ? tr(h.ch) : '?'}</span>
    {x.sabab && <span className="hd-sabab">{x.sabab}</span>}
    {onTahrir && <span className="hd-tahrir" aria-hidden="true">✎</span>}
  </>;
  const cls = cxx('hd-karta', x.holat && 'h-' + x.holat, joriy && 'joriy', xato && 'xato', x.yangiH && 'yangiH');
  const rf = refs ? (el) => { refs.current[x.key] = el; } : undefined;
  return onTahrir
    ? <button type="button" ref={rf} className={cls} style={{ '--i': i }} onClick={() => onTahrir(x.key)}>{ichi}</button>
    : <div ref={rf} className={cls} style={{ '--i': i }}>{ichi}</div>;
};
const HolatDoska = ({ ishlar, yangi = [], rejim = 'toliq', joriy, xato, refs, yangiRef, onTahrir, skan, ustunIz, yangiIz, yorliq, sakra, yonish, yangiBos = true }) => {
  const ustunlar = ishlar.some(x => !x.ufq) ? [...UFQLAR, UFQSIZ] : UFQLAR;
  let n = 0;
  return (
    <div className={cxx('hd', 'hd-' + rejim, sakra && 'sakra', yonish && 'yonish')}>
      {yorliq && <span className="hd-yorliq">{yorliq}</span>}
      <div className="hd-ustunlar" style={{ '--n': ustunlar.length }}>
        {ustunlar.map(u => (
          <div key={u.id} className="hd-ustun">
            <span className="hd-ustun-h">{tr(u.t)}</span>
            {ishlar.filter(x => (x.ufq || 'ufqsiz') === u.id).map(x => <HdKarta key={x.key} x={x} i={n++} refs={refs} joriy={joriy && joriy.has(x.key)} xato={xato && xato.has(x.key)} onTahrir={onTahrir} />)}
            {ustunIz && ustunIz[u.id] && <span className="hd-ustun-iz fade-step">{ustunIz[u.id]}</span>}
          </div>
        ))}
        {skan && <span key={skan} className="hd-skan" aria-hidden="true" />}
      </div>
      <div ref={yangiRef} className={cxx('hd-yangi', yangi.length === 0 && 'bosh')}>
        <span className="hd-ustun-h">{tr(HOLATLAR.yangi.t)}{yangiIz && <i className="hd-yangi-iz">{yangiIz}</i>}</span>
        {yangi.length > 0
          ? <div className="hd-yangi-q">{yangi.map(x => <HdKarta key={x.key} x={x} i={n++} refs={refs} joriy={joriy && joriy.has(x.key)} onTahrir={onTahrir} />)}</div>
          : yangiBos && <span className="hd-bosh-q" aria-hidden="true" />}
      </div>
    </div>
  );
};
// Mentor roadmap'i doska shaklida (holat — berilgan to'plamdagi ishlarda)
const mentorIshlar = (holatli = null, sababli = holatli) => MENTOR_ROADMAP.map(x => ({ key: x.id, nom: tr(x.nom), ufq: x.ufq, holat: holatli && holatli.has(x.id) ? x.holat : null, sabab: sababli && sababli.has(x.id) ? tr(x.sabab) : null }));
const mentorYangi = (bor = true) => (bor ? MENTOR_YANGI.map(x => ({ key: x.id, nom: tr(x.nom), holat: 'yangi', sabab: tr(x.sabab) })) : []);
const HAMMA_ID = new Set([...MENTOR_ROADMAP.map(x => x.id)]);

// --- Hisobot varag'i: sarlavha · uch raqamli qator (savol kulrang, javob qora) ---
const Varaq = ({ sarlavha, qatorlar, joriy, refs, onTahrir, kichik, yonma }) => (
  <div className={cxx('hd-varaq', kichik && 'kichik', yonma && 'yonma')}>
    <span className="hd-varaq-s">{sarlavha}</span>
    {qatorlar.map((q, i) => (
      <div key={i} ref={refs ? (el) => { refs.current['v' + i] = el; } : undefined} className={cxx('hd-vq', joriy === i && 'joriy', q.j && 'tola')}>
        <span className="hd-vq-n">{i + 1}</span>
        <span className="hd-vq-b">
          {q.s && <span className="hd-vq-s">{q.s}</span>}
          {q.j ? <span key={q.j} className="hd-vq-j">{q.j}{q.yorliq && <i className="hd-kul-y">{q.yorliq}</i>}</span> : <span className="hd-bosh-q" aria-hidden="true" />}
        </span>
        {onTahrir && q.j && <button type="button" className="hd-vq-t" onClick={() => onTahrir(i)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
      </div>
    ))}
  </div>
);

// --- Telefon «Maydon Jamoa» (SABOQ 22: ≈170×272, chapda; nom 11-Modul yashilida, logotipsiz) ---
const OyinKarta = ({ son, children, yonib }) => (
  <div className={cxx('hd-oyin', yonib && 'yonib')}>
    <b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
    <span>{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}{son && <> · <b key={son} className="hd-son">{nb(son)}</b></>}</span>
    {children}
  </div>
);
const MjTelefon = ({ sahna, qadam = 0, telRef }) => {
  const bar = (ulangan) => <div className="hd-tel-bar"><MJ />{ulangan && <span className="hd-ulangan"><i />{tr({ uz: 'Ulangan', ru: 'Подключено' })}</span>}</div>;
  let ichi = null;
  if (sahna === 'oyinlar') ichi = <>{bar()}<div className="hd-ilova"><span className="hd-ilova-y">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><OyinKarta son="8 / 10" /></div></>;
  if (sahna === 'elon') ichi = <>{bar()}<div className="hd-ilova">
    <span className="hd-ilova-y">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
    {qadam < 3
      ? <OyinKarta son={qadam === 0 ? '8 / 10' : '9 / 10'} yonib={qadam === 1}>
          {qadam < 2
            ? <span className={cxx('hd-tel-tg', qadam === 1 && 'bosildi')}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
            : <span className="hd-tel-tg ok">{tr({ uz: 'Kelaman', ru: 'Приду' })}</span>}
        </OyinKarta>
      : <OyinKarta><span className="hd-tel-tg ikki">{tr({ uz: 'Navbatga yozilish', ru: 'Записаться в очередь' })}</span></OyinKarta>}
  </div></>;
  if (sahna === 'eslatma') ichi = <div className="hd-qulf"><span className="hd-qulf-v">18:00</span><div className="hd-bildir fade-step"><MJ /><span>{tr({ uz: 'Bugun, 18:00 · Mahalla maydoni', ru: 'Сегодня, 18:00 · Площадка махалли' })}</span></div></div>;
  if (sahna === 'jonli') ichi = <>{bar(true)}<div className="hd-ilova"><span className="hd-ilova-y">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><OyinKarta son={qadam % 2 ? '9 / 10' : '8 / 10'} yonib={qadam % 2 === 1} /><span className="hd-kul">{tr({ uz: 'hech narsa bosilmadi', ru: 'ничего не нажато' })}</span></div></>;
  if (sahna === 'yoq') ichi = <>{bar()}<div className="hd-ilova"><span className="hd-ilova-y">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><OyinKarta son="9 / 10" /><span className="hd-yoq">{tr({ uz: "ilovada yo'q", ru: 'в приложении нет' })}</span></div></>;
  if (sahna === 'yangi') {
    const lending = (kod) => <div className="hd-brauzer"><div className="hd-br-bar"><i /><i /><i /><span /></div><b className="hd-lend-s">{tr({ uz: "Mahalla futboliga jamoani bir joyda yig'ing", ru: 'Собирайте команду на футбол в махалле в одном месте' })}</b>{kod && <span className="hd-lend-kod">{tr({ uz: 'Taklif kodi: AB12CD', ru: 'Код приглашения: AB12CD' })}</span>}</div>;
    ichi = [
      lending(false),
      <>{bar()}<div className="hd-pay"><b>{tr({ uz: "Doimiy o'yin — Pro'da", ru: 'Постоянная игра — в Pro' })}</b><span className="hd-pay-n">{nb(tr({ uz: "30 kun — 15 000 so'm", ru: '30 дней — 15 000 сумов' }))}</span><i className="hd-kul-y">{tr(TAXMIN_YORLIQ)}</i><span className="hd-tel-tg">{tr({ uz: "To'lovga o'tish", ru: 'Перейти к оплате' })}</span><span className="hd-test">{tr({ uz: 'Test rejim: pul yechilmaydi', ru: 'Тестовый режим: деньги не списываются' })}</span></div></>,
      <><div className="hd-tel-bar"><b style={{ color: TELEGRAM_RANG }}>Telegram</b></div><div className="hd-chat"><span className="hd-pf">{tr({ uz: "Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni", ru: 'Игра в субботу, 18:00, снова объявлена · Площадка махалли' })}</span></div></>,
      lending(true)
    ][qadam % 4];
  }
  return <div ref={telRef} className={cxx('hd-tel', sahna === 'eslatma' && 'qora')}><div key={sahna + '-' + (sahna === 'yangi' ? qadam % 4 : '')} className="hd-tel-ich">{ichi}</div></div>;
};

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma J-026: uchala variantga bitta javob, ballsiz) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Roadmap'dagi ishlar bajarildi", ru: 'Работы из roadmap выполнены' } },
  { id: 'b', label: { uz: 'Ba\'zi ishlarning vaqti hali kelmagan', ru: 'Для некоторых работ время ещё не пришло' } },
  { id: 'c', label: { uz: "Roadmap'da yo'q ishlar qo'shildi", ru: 'Добавились работы, которых не было в roadmap' } }
];
const HOOK_JAVOB = { uz: "Uchalasi ham uchraydi: Mentor misolida bitta roadmap'da uchalasi bor. Har ish qayerda ekanini bugun belgilaysiz.", ru: 'Встречаются все три: в примере Ментора в одном roadmap есть все три. Где каждая работа, вы отметите сегодня.' };
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [rm] = useState(() => roadmapOl());
  const live = (useContext(LiveGateCtx) || {}).live;
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', HOOK_OPTS.findIndex(o => o.id === v), false, 0);
  };
  const doska = rm
    ? <HolatDoska rejim="kichik" sakra={picked !== null} ishlar={rm.map((x, i) => ({ key: 'o' + i, nom: qisqa(x.nom, 22), ufq: x.ufq }))} />
    : <div className="hd-ikki kichik"><MjTelefon sahna="oyinlar" /><HolatDoska rejim="kichik" sakra={picked !== null} yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} ishlar={mentorIshlar()} /></div>;
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('hd-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Mahsulotingiz <A>hozir qayerda?</A></>, ru: <>Где сейчас <A>ваш продукт?</A></> })}
          mentor={<Mentor>{tr({ uz: "Roadmap'ingizni 11-Modulda yozgansiz. Bugungi mahsulotingizni u bilan solishtirsangiz, nima ko'rinadi?", ru: 'Свой roadmap вы написали в Модуле 11. Если сравнить с ним сегодняшний продукт, что будет видно?' })}</Mentor>}
          maket={doska}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={<>
            {picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB)}</p>}
            {isLive && (picked !== null || live.mode === 'mentor') && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.label))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        >
          <Ustoz satrlar={USTOZ.s0} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; chap: menyu osti + doska o'zi yuradi — ish nomlari haqiqiy, holat nomlari va savollar yo'q — SABOQ 33, P-036) =====
const REJA = [
  { t: { uz: "Roadmap'dagi har ish bugun qayerda ekanini belgilaysiz", ru: 'Отметите, где сегодня каждая работа из roadmap' }, teg: { uz: 'holat', ru: 'статус' } },
  { t: { uz: "Roadmap'da yo'q, lekin qilingan ishlarni qo'shasiz", ru: 'Добавите работы, которых не было в roadmap, но они сделаны' }, teg: { uz: "yangi qo'shildi", ru: 'добавлено новое' } },
  { t: { uz: "O'z qarorlaringiz haqida savollarga javob yozasiz", ru: 'Напишете ответы на вопросы о своих решениях' }, teg: { uz: 'shaxsiy hisobot', ru: 'личный отчёт' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [rm] = useState(() => roadmapOl());
  const ishlar = rm ? rm.map((x, i) => ({ key: 'o' + i, nom: qisqa(x.nom, 22), ufq: x.ufq })) : mentorIshlar();
  const f = useYurish(ishlar.map((_, i) => 300 + i * 160).concat([300 + ishlar.length * 160 + 200, 300 + ishlar.length * 160 + 600]));
  const kor = ishlar.slice(0, Math.min(f, ishlar.length));
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <div className="hd-r">
        <QReja zoom={Zoomable}
          sarlavha={tr({ uz: <>Bugun mahsulotingizni <A>roadmap bilan solishtirasiz.</A></>, ru: <>Сегодня вы сравните свой продукт <A>с roadmap.</A></> })}
          mentor={<Mentor>{tr({ uz: "11-Modulda roadmap bo'yicha risklarni, 12-Modulda pitchdagi dalillarni ko'rgansiz. Endi ortga qaraysiz: nima qurildi va qarorlaringiz qanday chiqdi.", ru: 'В Модуле 11 вы смотрели риски по roadmap, в Модуле 12 — доводы в питче. Теперь оглянетесь назад: что построено и как сработали ваши решения.' })}</Mentor>}
          chapYorliq={tr({ uz: 'Dars oxirida — roadmap bilan solishtirish va shaxsiy hisobot', ru: 'В конце урока — сравнение с roadmap и личный отчёт' })}
          chap={<div className="hd-r-chap">
            <HolatDoska rejim="kichik" ishlar={kor} yorliq={rm ? null : <>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} yangiBos={f > ishlar.length} />
            {f > ishlar.length + 1 && <div className="fade-step"><Varaq kichik yonma sarlavha={tr({ uz: 'Shaxsiy hisobot', ru: 'Личный отчёт' })} qatorlar={[{}, {}, {}]} /></div>}
          </div>}
          qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
        >
          <Ustoz satrlar={USTOZ.s1} />
        </QReja>
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — HOLATLAR (QTushuncha, markaziy: bashorat → 5 karta ketma-ket, besh tugma → holat yorlig'i kartaga uchadi → atama «holat» tug'iladi) =====
const S2_X = {
  k1kech: { uz: 'Ufqiga qarang: uchalasi qaysi modulda qurildi?', ru: 'Посмотрите на горизонт: в каком модуле построены все три?' },
  telefon: { uz: 'Telefonga qarang: bu ish ilovada bormi?', ru: 'Посмотрите на телефон: эта работа есть в приложении?' },
  ufq12: { uz: 'Ufqi — 12–13-Modul. U qaysi modulda qurildi?', ru: 'Горизонт — Модули 12–13. В каком модуле её построили?' },
  bor: { uz: "Bu ish roadmap'da bor edi — qaysi ustunda?", ru: 'Эта работа была в roadmap — в какой колонке?' },
  uzKech: { uz: 'Uning ufqi — bitiruvdan keyin. Vaqti keldimi?', ru: 'Её горизонт — после выпуска. Время пришло?' },
  uzOlib: { uz: "Mentor uni roadmap'dan o'chirdimi — ustunga qarang.", ru: 'Ментор удалил её из roadmap? Посмотрите на колонку.' },
  y5baj: { uz: "Bajarildi — roadmap'dagi ish uchun. Bular unda bormidi?", ru: 'Выполнено — для работы из roadmap. Были ли они в нём?' },
  y5: { uz: "Bu ishlar roadmap'ning qaysi ustunida edi?", ru: 'В какой колонке roadmap были эти работы?' }
};
const s2Xato = (k, h) => {
  if (k === 4) return h === 'bajarildi' ? S2_X.y5baj : S2_X.y5;
  if (h === 'yangi') return S2_X.bor;
  if (k === 0 && h === 'kechikdi') return S2_X.k1kech;
  if ((k === 1 || k === 2) && h === 'kechikdi') return S2_X.ufq12;
  if (k === 3 && h === 'kechikdi') return S2_X.uzKech;
  if (k === 3 && h === 'olib-tashlandi') return S2_X.uzOlib;
  return S2_X.telefon;
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [k, setK] = useState(storedAnswer ? 5 : 0);
  const [xatoBor, setXatoBor] = useState(storedAnswer ? storedAnswer.correct === false : false);
  const [xato, setXato] = useState(null); // { h, t, n }
  const [izoh, setIzoh] = useState(null);
  const [uch, qatlam] = useUchish();
  const refs = useRef({});
  const tRefs = useRef({});
  const telRef = useRef(null);
  const yangiRef = useRef(null);
  const done = k >= 5;
  const tugadi = useTugadi(done, 900, !!storedAnswer);
  const faolKarta = !done && taxmin ? MENTOR_KARTALAR[k] : null;
  const qadam = useAylanish(faolKarta && faolKarta.telefon === 'elon' ? 4 : faolKarta && faolKarta.telefon === 'yangi' ? 4 : 2, faolKarta && faolKarta.telefon === 'yangi' ? 1300 : 1200, !!faolKarta && ['elon', 'yangi', 'jonli'].includes(faolKarta.telefon));
  const ipucha = useIpucha(!!taxmin && !done, k);
  useEffect(() => { if (!izoh) return undefined; const t = setTimeout(() => setIzoh(null), 3200); return () => clearTimeout(t); }, [izoh]);
  // izoh yoki xato chiqqanda kompyuterda ham pastki panel ostida qolmasin
  useEffect(() => {
    if (!xato && !izoh) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.hd-s2 .hd-o .q-xato, .hd-s2 .hd-o .hd-izoh-q'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 160);
    return () => clearTimeout(t);
  }, [xato, izoh, k]); // k: to'g'ri javobdan keyin doska o'sadi — izoh yana tekshiriladi
  const bos = (h) => {
    if (!taxmin || done) return;
    const kr = MENTOR_KARTALAR[k];
    if (h !== kr.togri) { setXatoBor(true); setXato({ h, t: s2Xato(k, h), n: Date.now() }); return; }
    setXato(null);
    if (kr.togri === 'yangi') MENTOR_YANGI.forEach((x, i) => uch(telRef.current, yangiRef.current, tr(x.nom), i * 120));
    else kr.ids.forEach((id, i) => uch(tRefs.current[h], refs.current[id], tr(HOLATLAR[h].ch), i * 90, 'ok'));
    if (kr.izoh) setIzoh(kr.izoh);
    const n = k + 1;
    setTimeout(() => setK(n), kamHarakat() ? 0 : 420);
    if (n >= 5 && storedAnswer === undefined) onAnswer(screen, { stage: 'concept', screenIdx: screen, correct: !xatoBor, picked: true, solved: true, taxmin });
  };
  const bajarilgan = new Set(MENTOR_KARTALAR.slice(0, done ? 5 : k).flatMap(c => c.ids));
  const ishlar = mentorIshlar(isMentor ? HAMMA_ID : bajarilgan);
  const yangi = mentorYangi(isMentor || bajarilgan.has('lending'));
  const joriy = faolKarta ? new Set(faolKarta.ids) : null;
  const xatoSet = xato && faolKarta && faolKarta.togri !== 'yangi' ? new Set(faolKarta.ids) : null;
  const ustunIz = (taxmin || isMentor) ? { hozir: tr(MENTOR_KARTALAR[0].dalil) } : null;
  const doska = <HolatDoska rejim="toliq" ishlar={ishlar} yangi={yangi} refs={refs} yangiRef={yangiRef} joriy={joriy} xato={xatoSet} ustunIz={ustunIz}
    skan={faolKarta && faolKarta.togri === 'yangi' ? 'skan' : null} yangiIz={(bajarilgan.has('lending') || isMentor) ? tr({ uz: 'faqat katta ishlar', ru: 'только крупные работы' }) : null}
    yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} />;
  const tugmalar = (
    <div className={cxx('hd-tugmalar', taxmin && !done && 'chorla')}>
      {HOLAT_TARTIB.map(h => (
        <button key={h} type="button" ref={(el) => { tRefs.current[h] = el; }} className={cxx('q-chip', 'hd-ht', 'h-' + h, xato && xato.h === h && 'silk')} disabled={!taxmin || done || isMentor} onClick={() => bos(h)}>{tr(HOLATLAR[h].t)}</button>
      ))}
    </div>
  );
  const tel = <div className="hd-telj"><MjTelefon sahna={faolKarta ? faolKarta.telefon : 'oyinlar'} qadam={qadam} telRef={telRef} /><span className="hd-karta-n">{tr({ uz: 'Karta', ru: 'Карточка' })} · <b>{Math.min(k + 1, 5)} / 5</b></span></div>;
  const TAXMIN = [{ k: '4', t: '4' }, { k: '5', t: '5' }, { k: '6', t: '6' }];
  const navL = done || isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : { uz: `Holat qo'ying (${k}/5)`, ru: `Поставьте статус (${k}/5)` };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · holat', ru: 'Понятие · статус' })} screen={screen} scrollSignal={k + (taxmin ? 1 : 0)} natijaSignal={tugadi ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={tr(navL)} onClick={onNext} /></>}>
      <div className="hd-s2">
        <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval harakat={!tugadi && tugmalar}
          sarlavha={tr({ uz: <>Mentor roadmap'idagi ishlar <A>bugun qayerda?</A></>, ru: <>Где сегодня <A>работы из roadmap Ментора?</A></> })}
          mentor={<Mentor>{tr({ uz: 'Telefonda — Mentorning bugungi ilovasi: har kartaga mos holatni bosing.', ru: 'На телефоне — сегодняшнее приложение Ментора: нажмите подходящий статус для каждой карточки.' })}</Mentor>}
          bashorat={!isMentor && (taxmin
            ? <BashoratQ savol={tr({ uz: "Mentor roadmap'idagi oltita ishdan nechtasi bajarildi?", ru: 'Сколько из шести работ в roadmap Ментора выполнено?' })} javob={taxmin} />
            : <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Mentor roadmap'idagi oltita ishdan nechtasi bajarildi?", ru: 'Сколько из шести работ в roadmap Ментора выполнено?' })} variantlar={TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />)}
          vizual={tugadi ? <div className="hd-fokus">{doska}</div> : <div className="hd-ikki">{tel}<div className="hd-o">{doska}
            {xato && <QXato key={xato.n}>{tr(xato.t)}</QXato>}
            {!xato && izoh && <p key={tr(izoh)} className="hd-izoh-q fade-step">{tr(izoh)}</p>}
            {!xato && !izoh && ipucha && <p className="hd-ipucha fade-step">{tr({ uz: 'Telefonda bu ish bormi va doskaning qaysi ustunida turibdi?', ru: 'Есть ли эта работа в телефоне и в какой колонке доски она стоит?' })}</p>}
          </div></div>}
          xulosa={done && !isMentor && <XulosaQ
            natija={taxmin && <TaxminQ togri={taxmin === '5'} haqiqat="5" />}
            matn={tr({ uz: "Bu darsda holat roadmap'dagi ish o'z ufqiga qarab qayerda ekanini aytadi; yonida — bir qator sabab.", ru: 'На этом уроке статус говорит, где работа из roadmap относительно своего горизонта; рядом — причина в одну строку.' })}
            izoh={tr({ uz: "Mentor misolida kechikkan va olib tashlangan ish yo'q — sizda bo'lishi mumkin.", ru: 'В примере Ментора нет опоздавших и убранных работ — у вас они могут быть.' })} />}
        >
          <Ustoz satrlar={USTOZ.s2} />
        </QTushuncha>
        {qatlam}
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s3 = 1; ikkinchi misol — uy vazifalari ilovasi; savol ustida yorliq yo'q — SABOQ 6) =====
const MiniDoska = ({ sarlavha, children }) => <div className="hd-mini"><span className="hd-mini-s">{sarlavha}</span>{children}</div>;
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · holat', ru: 'Проверка · статус' })}
    questionText="Uy vazifalari ilovangizda eslatma bor, lekin roadmap'da yo'q edi. Holati?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifalari ilovangizda eslatma bor, lekin roadmap'da yo'q edi. <A>Holati?</A></h2>, ru: <h2 className="title h-ask">В вашем приложении для домашних заданий есть напоминание, но в roadmap его не было. <A>Какой статус?</A></h2> })}
    options={[
      { uz: 'Bajarildi: ilovada hozir ishlab turibdi', ru: 'Выполнено: сейчас работает в приложении' },
      { uz: "Yangi qo'shildi: roadmap'dan tashqari ish", ru: 'Добавлено новое: работа вне roadmap' },
      { uz: "Kechikdi: o'z ufqidan ancha keyin qo'shildi", ru: 'Опоздало: добавлено намного позже своего горизонта' },
      { uz: "Uzoqroqda qoldi: keyinroq kerak bo'ladi", ru: 'Осталось дальше: понадобится позже' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Roadmap'da yo'q, lekin qilingan ish — yangi qo'shildi.", ru: 'Не было в roadmap, но сделано — добавлено новое.' }}
    explainWrong={{
      0: { uz: "Ishlayapti — lekin u roadmap'da bormidi?", ru: 'Работает — но было ли это в roadmap?' },
      2: { uz: "Kechikish uchun ish roadmap'da bo'lishi kerak edi.", ru: 'Чтобы опоздать, работа должна была быть в roadmap.' },
      3: { uz: 'Eslatma allaqachon ilovada bor — keyin emas.', ru: 'Напоминание уже есть в приложении — не потом.' },
      default: { uz: "Bu ish roadmap'da bormidi — shundan boshlang.", ru: 'Была ли эта работа в roadmap — начните с этого.' }
    }}
    vizual={<MiniDoska sarlavha={tr({ uz: 'Uy vazifalari ilovasi', ru: 'Приложение для домашних заданий' })}>
      <div className="hd-yangi hd-mini-y"><span className="hd-ustun-h">{tr(HOLATLAR.yangi.t)}</span><div className="hd-yangi-q"><div className="hd-karta h-yangi tush"><span className="hd-nom">{tr({ uz: 'Eslatma', ru: 'Напоминание' })}</span><span className="hd-holat">{tr(HOLATLAR.yangi.ch)}</span></div></div></div>
    </MiniDoska>} />
);

// ===== SCREEN 4 — TESLA (QVoqea, keys; brauzer oynasi, uch mashina, tanga, vaqt chizig'i; bankda yo'q narsa chizilmaydi) =====
const TESLA_KADRLAR = [
  { nom: { uz: "Reja e'lon qilindi", ru: 'План объявлен' }, mentor: { uz: <>2006-yilda Musk Tesla'ning «maxfiy master-rejasi»ni e'lon qilgan.</>, ru: <>В 2006 году Маск объявил «секретный генеральный план» Tesla.</> } },
  { nom: { uz: 'Uch bosqich', ru: 'Три этапа' }, mentor: { uz: <>Rejada uch bosqich bor edi: avval qimmat sport mashinasi kichik seriyada, ya'ni oz sonda. Uning pulidan — arzonroq mashina, uning pulidan esa — ommaviy mashina.</>, ru: <>В плане было три этапа: сначала дорогой спортивный автомобиль малой серией, то есть в небольшом количестве. На его деньги — более дешёвый автомобиль, а на его деньги — массовый.</> } },
  { nom: { uz: 'Ochiq reja', ru: 'Открытый план' }, mentor: { uz: <>Nomi «maxfiy» bo'lsa ham, reja hammaga ochiq bo'lgan va o'n yildan ortiq bajarilgan.</>, ru: <>Хотя план назывался «секретным», он был открыт для всех и выполнялся больше десяти лет.</> } }
];
const TESLA_QATOR = [
  { uz: 'qimmat sport mashinasi, oz sonda', ru: 'дорогой спортивный автомобиль, в небольшом количестве' },
  { uz: 'arzonroq mashina', ru: 'более дешёвый автомобиль' },
  { uz: 'ommaviy mashina', ru: 'массовый автомобиль' }
];
const Mashina = ({ tur }) => (
  <svg className={cxx('hd-mash', tur)} viewBox="0 0 64 26" aria-hidden="true">
    {tur === 'sport'
      ? <path d="M3 19 L9 13 Q20 7 34 8 L46 12 L60 15 Q62 19 59 20 L5 20 Z" />
      : <path d="M4 20 L6 13 Q9 7 19 6 L40 6 Q47 7 51 12 L59 14 Q61 18 59 20 L5 20 Z" />}
    <circle cx="16" cy="20.5" r="4.2" /><circle cx="48" cy="20.5" r="4.2" />
  </svg>
);
const TeslaSahna = ({ kadr }) => (
  <div className="hd-tesla">
    {kadr === 2 && <span className="hd-ochiq fade-step">{tr({ uz: 'hammaga ochiq', ru: 'открыт для всех' })}</span>}
    <div className="hd-brauzer keng">
      <div className="hd-br-bar"><i /><i /><i /><span /></div>
      <b className="hd-tesla-s"><span style={{ color: TESLA_RANG }}>Tesla</span>{tr({ uz: "'ning maxfiy master-rejasi", ru: ': секретный генеральный план' })}</b>
      {TESLA_QATOR.map((q, i) => (
        <div key={i} className={cxx('hd-tq', kadr >= 1 && 'ochiq')} style={{ '--i': i }}>
          <span className="hd-tq-n">{i + 1}</span>
          <span className="hd-tq-t">{kadr >= 1 ? tr(q) : '?'}</span>
          {kadr >= 1 && <span className="hd-tq-m">{i === 0 ? <><Mashina tur="sport" /><Mashina tur="sport kichik" /></> : i === 1 ? <Mashina tur="oddiy" /> : <><Mashina tur="oddiy kichik" /><Mashina tur="oddiy kichik" /><Mashina tur="oddiy kichik" /><Mashina tur="oddiy kichik" /></>}</span>}
          {kadr === 1 && i < 2 && <span className="hd-tanga" style={{ '--i': i }} aria-hidden="true" />}
        </div>
      ))}
    </div>
    {kadr === 2 && <div className="hd-vaqt fade-step"><span>2006</span><i className="hd-vaqt-ch">{[0, 1, 2].map(i => <b key={i} style={{ '--i': i }} />)}</i><span>{tr({ uz: "o'n yildan ortiq", ru: 'больше десяти лет' })}</span></div>}
  </div>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [kadr, setKadr] = useState(storedAnswer ? 2 : 0);
  const done = kadr >= 2 && !!taxmin;
  const ipucha = useIpucha(!done, kadr + (taxmin ? 10 : 0));
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'case', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const TX = [{ k: 'bir', t: tr({ uz: 'Bir yil ichida', ru: 'В течение года' }) }, { k: 'necha', t: tr({ uz: 'Bir necha yil', ru: 'Несколько лет' }) }, { k: 'on', t: tr({ uz: "O'n yildan ortiq", ru: 'Больше десяти лет' }) }];
  const tx = TX.find(t => t.k === taxmin);
  const K = TESLA_KADRLAR[kadr];
  const davom = () => setKadr(v => Math.min(2, v + 1));
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={kadr + (taxmin ? 1 : 0)} natijaSignal={done ? 1 : 0}
      navContent={<><NavBack onPrev={onPrev} />{done
        ? <NavNext optionalLive label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />
        : <button type="button" className={cxx('btn-white-accent', 'hd-davom', taxmin && 'chorla')} disabled={!taxmin} onClick={davom} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{tr({ uz: `Voqea davomi (${kadr + 1}/3)`, ru: `Продолжение (${kadr + 1}/3)` })}</button>}</>}>
      <div className="hd-s4">
        <QVoqea
          sarlavha={tr({ uz: <>Tesla o'z rejasini <A>qanday yozgan?</A></>, ru: <>Как Tesla <A>записала свой план?</A></> })}
          nuqtalar={<>
            <Mentor key={kadr}>{tr(K.mentor)}</Mentor>
            <div className="hd-nuqtalar">{[0, 1, 2].map(i => <span key={i} className={cxx('hd-nq', i <= kadr && 'on')} />)}<b>Tesla · {kadr + 1}/3</b><span className="hd-kadr-n">{tr(K.nom)}</span></div>
          </>}
          karta={<div className="hd-voqea">
            {kadr === 0 && <p className="hd-brend fade-step"><b style={{ color: TESLA_RANG }}>Tesla</b> — {tr({ uz: 'elektromobil ishlab chiqaradigan kompaniya.', ru: 'компания, которая производит электромобили.' })}</p>}
            <Zoomable><TeslaSahna kadr={kadr} /></Zoomable>
            {taxmin
              ? <BashoratQ savol={<>Tesla · {kadr + 1}/3 · {tr({ uz: 'Bu reja qancha vaqt bajarilgan?', ru: 'Сколько времени выполнялся этот план?' })}</>} javob={tx && tx.t} />
              : <QBashorat yorliq={`Tesla · ${kadr + 1}/3 · ${tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })}`} savol={tr({ uz: 'Bu reja qancha vaqt bajarilgan?', ru: 'Сколько времени выполнялся этот план?' })} variantlar={TX} tanlov={taxmin} onTanla={setTaxmin} />}
            {!done && ipucha && <p className="hd-ipucha fade-step">{tr({ uz: 'Brauzerdagi reja sarlavhasiga va uch qatorga qarang.', ru: 'Посмотрите на заголовок плана в браузере и на три строки.' })}</p>}
          </div>}
        >
          {done && <QXulosa><XulosaQ natija={<TaxminQ togri={taxmin === 'on'} haqiqat={tr({ uz: "o'n yildan ortiq", ru: 'больше десяти лет' })} />}
            matn={tr({ uz: 'Bu voqeada reja ochiq yozilgan va bosqichma-bosqich bajarilgan.', ru: 'В этой истории план был записан открыто и выполнялся поэтапно.' })}
            izoh={tr({ uz: 'Roadmap ham shuning uchun yoziladi: keyin nima bajarilganini solishtirish uchun.', ru: 'Roadmap пишут для того же: чтобы потом сравнить, что выполнено.' })} /></QXulosa>}
          <Ustoz satrlar={USTOZ.s4} />
        </QVoqea>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen → QTest; ✔ D, INLINE_KEYS.s5 = 3; keys ko'prigi — o'quvchining o'z roadmap'i) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · roadmap', ru: 'Проверка · roadmap' })}
    questionText="Roadmap'ingizni 11-Modulda yozgansiz. Bugun u sizga nimaga kerak?"
    question={tr({ uz: <h2 className="title h-ask">Roadmap'ingizni 11-Modulda yozgansiz. <A>Bugun u sizga nimaga kerak?</A></h2>, ru: <h2 className="title h-ask">Свой roadmap вы написали в Модуле 11. <A>Зачем он вам сегодня?</A></h2> })}
    options={[
      { uz: 'Mahsulotni noldan boshlab qayta qurishga', ru: 'Чтобы заново построить продукт с нуля' },
      { uz: "Mentordan ball olish uchun ko'rsatishga", ru: 'Чтобы показать Ментору ради баллов' },
      { uz: "Sinfdoshlar roadmap'i bilan solishtirishga", ru: 'Чтобы сравнить с roadmap одноклассников' },
      { uz: 'Bugungi mahsulot bilan solishtirishga', ru: 'Чтобы сравнить с сегодняшним продуктом' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Yozilgan roadmap bilan bugungi mahsulotni solishtirasiz.', ru: 'Вы сравниваете записанный roadmap с сегодняшним продуктом.' }}
    explainWrong={{
      0: { uz: 'Bugun hech narsa qurilmaydi — qurilganga qaraysiz.', ru: 'Сегодня ничего не строят — смотрят на построенное.' },
      1: { uz: "Roadmap — o'zingiz uchun, ball uchun emas.", ru: 'Roadmap — для вас, а не ради баллов.' },
      2: { uz: "Sinfdoshlaringiz mahsuloti boshqa — o'zingiznikiga qarang.", ru: 'У одноклассников другой продукт — смотрите на свой.' },
      default: { uz: 'Tesla voqeasining oxirgi gapini eslang.', ru: 'Вспомните последнюю фразу истории Tesla.' }
    }}
    vizual={<MiniDoska sarlavha={tr({ uz: "roadmap · bugungi mahsulot", ru: 'roadmap · сегодняшний продукт' })}>
      <HolatDoska rejim="kichik" yonish ishlar={mentorIshlar(HAMMA_ID, new Set())} yangi={mentorYangi().map(x => ({ ...x, sabab: null }))} yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} />
    </MiniDoska>} />
);

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen → QTest; ✔ A, INLINE_KEYS.s8 = 0; scope final; ikkinchi misol — kitob almashish ilovasi) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Kitob ilovangizda to'lovni sinfdoshlardan kutdingiz. Bu qarorni qayta ko'rishga nima dalil bo'ladi?"
    question={tr({ uz: <h2 className="title h-ask">Kitob ilovangizda to'lovni sinfdoshlardan kutdingiz. <A>Bu qarorni qayta ko'rishga nima dalil bo'ladi?</A></h2>, ru: <h2 className="title h-ask">В приложении для книг вы ждали оплату от одноклассников. <A>Что станет доводом, чтобы пересмотреть это решение?</A></h2> })}
    options={[
      { uz: "Uch suhbatda uchalasi to'lamasligini aytdi", ru: 'В трёх разговорах все трое сказали, что не заплатят' },
      { uz: "Endi bu qaror menga negadir yoqmay qoldi", ru: 'Теперь это решение мне почему-то разонравилось' },
      { uz: "Keyingi oyda narxni boshqacha qilib ko'raman", ru: 'В следующем месяце попробую другую цену' },
      { uz: "Qolgan hamma qarorlarim esa to'g'ri chiqdi", ru: 'А все остальные мои решения оказались верными' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Uch suhbat yozuvi — dalil: son va odamlarning o'z gapi.", ru: 'Записи трёх разговоров — довод: число и собственные слова людей.' }}
    explainWrong={{
      1: { uz: "Bu fikringiz — uni qaysi son yoki yozuv ko'rsatadi?", ru: 'Это ваше мнение — какое число или запись его показывает?' },
      2: { uz: "Bu keyingi ish — dalil o'tgan ishdan olinadi.", ru: 'Это следующее дело — довод берут из прошедшего.' },
      3: { uz: 'Savol shu qaror haqida — uning dalili qayerda?', ru: 'Вопрос об этом решении — где его довод?' },
      default: { uz: 'Dalil — son yoki yozuv. Qaysi variantda bor?', ru: 'Довод — число или запись. В каком варианте он есть?' }
    }}
    vizual={<Varaq kichik sarlavha={tr({ uz: 'Kitob almashish ilovasi', ru: 'Приложение для обмена книгами' })} qatorlar={[
      { s: null, j: null },
      { s: null, j: <>{tr({ uz: "To'lovni sinfdoshlardan kutdim", ru: 'Ждал оплату от одноклассников' })}<span className="hd-dalil-q">{tr({ uz: "uch suhbat: uchalasi to'lamasligini aytdi", ru: 'три разговора: все трое сказали, что не заплатят' })}</span></> },
      { s: null, j: null }
    ]} />} />
);

// ===== 6–7-EKRAN TEKSHIRUVLARI (MD 6, 7-ekran jadvallari; PM-108 — node bilan sinaladi: scratchpad 11-qurish/t108.mjs) =====
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const norm = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const AKKAUNT_RE = /@|t\.me\/|\+\s*998/;
const TELEFON_RE = /(^|[^\d])\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}(?!\d)/;
const RAQAM7_RE = /\d{7,}/;
const HALI_RE = /hali|qilmadim|qilinmadi|ещё не|еще не|не сделал|не сделан/;
const VOZ_RE = /kerak emas|voz kechdim|не нужн|отказал/;
const DALIL_RE = /suhbat|tasdiq|hisob|(^|[^\p{L}'])son|yozuv|sinov|intervyu|разговор|подтвержд|расч[её]т|числ|запис|интервью/u;
const PUL_RE = /pul olaman|to'lov olaman|karta|получу деньги|приму оплату|карт[аоуы]/;
// natija: { t: matn kaliti, blok: bool } | null
function s6Tekshir({ holat, sabab, yangiNom, roadmapNomlar = [], yangi = false }) {
  const s = norm(sabab);
  if (yangi) {
    const n = norm(yangiNom);
    if (!n) return { t: 'bosh', blok: true };
    if (AKKAUNT_RE.test(n) || TELEFON_RE.test(n)) return { t: 'tel', blok: true };
  } else if (!holat) return { t: 'holat', blok: true };
  if (!s) return { t: 'bosh', blok: true };
  if (String(sabab).trim().length > 80) return { t: 'uzun', blok: true };
  if (AKKAUNT_RE.test(s) || TELEFON_RE.test(s)) return { t: 'tel', blok: true };
  if (RAQAM7_RE.test(s) || (yangi && RAQAM7_RE.test(norm(yangiNom)))) return { t: 'raqam', blok: false };
  if (!yangi && holat === 'bajarildi' && HALI_RE.test(s)) return { t: 'hali', blok: false };
  if (!yangi && holat === 'kechikdi' && VOZ_RE.test(s)) return { t: 'voz', blok: false };
  if (yangi && roadmapNomlar.some(r => norm(r) === norm(yangiNom))) return { t: 'takror', blok: false };
  return null;
}
function s7Tekshir({ k, matn, dalilBosildi = false, mentorJavob = [] }) {
  const s = norm(matn);
  if (!s) return { t: 'bosh', blok: true };
  if (AKKAUNT_RE.test(s) || TELEFON_RE.test(s)) return { t: 'tel', blok: true };
  if (RAQAM7_RE.test(s)) return { t: 'raqam', blok: false };
  if (mentorJavob.some(m => norm(m) === s)) return { t: 'mentor', blok: false };
  if (k === 'notogri' && !dalilBosildi && !/\d/.test(s) && !DALIL_RE.test(s)) return { t: 'dalil', blok: false };
  if (k === 'keyingi' && PUL_RE.test(s)) return { t: 'pul', blok: false };
  if (k === 'keyingi' && String(matn).trim().length < 20) return { t: 'qisqa', blok: false };
  return null;
}
const TX6 = {
  holat: { uz: 'Avval holatni tanlang.', ru: 'Сначала выберите статус.' },
  bosh: { uz: 'Sababini bir qatorda yozing.', ru: 'Напишите причину в одну строку.' },
  uzun: { uz: "Bir qatorga sig'diring — 80 belgigacha.", ru: 'Уместите в одну строку — до 80 знаков.' },
  tel: { uz: 'Telefon va akkaunt nomi yozilmaydi.', ru: 'Телефон и имя аккаунта не пишут.' },
  raqam: { uz: 'Bu telefon raqamimi? Telefon yozilmaydi.', ru: 'Это номер телефона? Телефон не пишут.' },
  hali: { uz: "Sababda «hali qilinmadi» bor — holatni qayta qarang.", ru: 'В причине есть «ещё не сделано» — пересмотрите статус.' },
  voz: { uz: 'Sababga qarang: ish endi qilinmaydimi?', ru: 'Посмотрите на причину: работу больше не делают?' },
  takror: { uz: "Bu ish roadmap'da bor — holatini o'z kartasida qo'ying.", ru: 'Эта работа есть в roadmap — поставьте статус на её карточке.' }
};
const TX7 = {
  bosh: { uz: 'Javobingizni bir-ikki gapda yozing.', ru: 'Напишите ответ в одно-два предложения.' },
  tel: TX6.tel, raqam: TX6.raqam,
  mentor: { uz: "Bu Mentorning javobi — o'z mahsulotingiz haqida yozing.", ru: 'Это ответ Ментора — напишите о своём продукте.' },
  dalil: { uz: "Qaysi dalil ko'rsatdi — son yoki yozuvni qo'shing.", ru: 'Какой довод показал — добавьте число или запись.' },
  pul: { uz: "Bu kursda real pul olinmaydi — to'lov faqat test rejimda.", ru: 'В этом курсе реальные деньги не берут — оплата только в тестовом режиме.' },
  qisqa: { uz: 'Bitta aniq ish yozing: nima va qachon.', ru: 'Напишите одно конкретное дело: что и когда.' }
};
const YUMSHOQ_YORLIQ = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' };
const SABAB_PH = {
  bajarildi: { uz: 'Qachon tugadi?', ru: 'Когда закончили?' },
  kechikdi: { uz: "Keyin tugadimi yoki hali yo'qmi? Nega?", ru: 'Закончили позже или ещё нет? Почему?' },
  'olib-tashlandi': { uz: 'Nega endi kerak emas?', ru: 'Почему больше не нужно?' },
  uzoqroqda: { uz: 'Nega hozir emas?', ru: 'Почему не сейчас?' }
};
const IZOH6 = {
  kechikdi: { uz: "Kechikdi — ish o'z ufqi ichida tugamagan: keyin tugagan yoki hali yo'q.", ru: 'Опоздало — работа не закончена в своём горизонте: закончена позже или её ещё нет.' },
  'olib-tashlandi': { uz: 'Olib tashlandi — ish endi qilinmaydi.', ru: 'Убрано — работу больше не делают.' }
};
const Yordam = ({ children }) => {
  const [ochiq, setOchiq] = useState(false);
  return <div className="hd-yordam">
    <button type="button" className="q-chip hd-yordam-t" onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })} {ochiq ? '▴' : '▾'}</button>
    {ochiq && <div className="hd-yordam-m fade-step">{children}</div>}
  </div>;
};
const Strip = ({ n }) => <div className="hd-strip"><span>{tr({ uz: "Roadmap'im", ru: 'Мой roadmap' })} · <b>{n} {tr({ uz: 'ish', ru: ruKop(n, ['работа', 'работы', 'работ']) })}</b></span></div>;

// ===== SCREEN 6 — O'Z ROADMAP'INGIZ (QMustaqil, USTAXONA 1/2 — ketma-ket karta; SABOQ 9, 13, 29, E 43, E 53) =====
// Ichki holat dars progressida (E 51): st = { faza: 'yozish' | 'karta' | 'yangi' | 'tayyor', manba, ishlar[{ key, nom, ufq, holat, sabab, ok }], yangi[{ key, nom, sabab }], k, tahrir, saqlandi, izohlar }
const s6Bosh = () => {
  const r = refOl();
  if (r && Array.isArray(r.ishlar) && r.ishlar.length) {
    const ishlar = r.ishlar.filter(x => x.holat !== 'yangi').map((x, i) => ({ key: 'o' + i, nom: x.nom, ufq: x.ufq || null, holat: x.holat, sabab: x.sabab, ok: true }));
    const yangi = r.ishlar.filter(x => x.holat === 'yangi').map((x, i) => ({ key: 'y' + i, nom: x.nom, sabab: x.sabab }));
    return { faza: 'tayyor', manba: r.roadmapManba || 'saqlangan', ishlar, yangi, k: 0, tahrir: null, saqlandi: true, izohlar: [] };
  }
  const rm = roadmapOl();
  if (rm) return { faza: 'karta', manba: 'saqlangan', ishlar: rm.map((x, i) => ({ key: 'o' + i, nom: x.nom, ufq: x.ufq, holat: null, sabab: '', ok: false })), yangi: [], k: 0, tahrir: null, saqlandi: false, izohlar: [] };
  return { faza: 'yozish', manba: 'qayta-yozilgan', ishlar: [], yangi: [], k: 0, tahrir: null, saqlandi: false, izohlar: [] };
};
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [st, setSt] = useState(() => (storedAnswer && storedAnswer.st) || s6Bosh());
  const [model] = useState(() => lsO(MODEL_KEY));
  const [holat, setHolat] = useState(null);
  const [sabab, setSabab] = useState('');
  const [nom, setNom] = useState('');
  const [ufq, setUfq] = useState(null);
  const [xato, setXato] = useState(null);
  const [izoh, setIzoh] = useState(null);
  const yumRef = useRef(null);
  const signalRef = useRef(false);
  const refs = useRef({});
  const kartaRef = useRef(null);
  const yangiRef = useRef(null);
  const [uch, qatlam] = useUchish();
  useEffect(() => { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'holat', st, correct: true, solved: !!st.saqlandi }); }, [st]); // eslint-disable-line
  useEffect(() => { if (!izoh) return undefined; const t = setTimeout(() => setIzoh(null), 3500); return () => clearTimeout(t); }, [izoh]);
  const N = st.ishlar.length;
  const n = st.ishlar.filter(x => x.ok).length;
  const joriyIsh = st.faza === 'karta' ? st.ishlar.find(x => x.key === (st.tahrir || (st.ishlar[st.k] && st.ishlar[st.k].key))) : null;
  const joriyYangi = st.faza === 'yangi' && st.tahrir ? st.yangi.find(x => x.key === st.tahrir) : null;
  // yangi karta ochilganda: uzoqroq ustunida «Uzoqroqda qoldi» oldindan tanlangan; tahrirda — saqlangan qiymat
  const ochKey = joriyIsh ? joriyIsh.key : joriyYangi ? joriyYangi.key : st.faza;
  useEffect(() => {
    setXato(null); yumRef.current = null;
    if (joriyIsh) { setHolat(joriyIsh.holat || (joriyIsh.ufq === 'uzoqroq' ? 'uzoqroqda' : null)); setSabab(joriyIsh.sabab || ''); }
    else if (joriyYangi) { setNom(joriyYangi.nom); setSabab(joriyYangi.sabab); }
    else { setHolat(null); setSabab(''); setNom(''); setUfq(null); }
  }, [ochKey]); // eslint-disable-line
  const tekshir = (args, kalit, nomdami) => {
    const r = s6Tekshir(args);
    if (r && (r.blok || yumRef.current !== kalit)) { setXato(nomdami && nomdami(r) ? { ...r, nom: true } : r); yumRef.current = r.blok ? null : kalit; return false; }
    setXato(null); yumRef.current = null; return true;
  };
  const keyingiK = (ishlar, dan) => { const i = ishlar.findIndex((x, j) => j >= dan && !x.ok); return i >= 0 ? i : ishlar.findIndex(x => !x.ok); };
  const saqlaIsh = () => {
    if (!joriyIsh) return;
    if (!tekshir({ holat, sabab }, holat + '|' + sabab)) return;
    const ishlar = st.ishlar.map(x => (x.key === joriyIsh.key ? { ...x, holat, sabab: sabab.trim(), ok: true } : x));
    uch(kartaRef.current, refs.current[joriyIsh.key], tr(HOLATLAR[holat].ch), 0, holat === 'bajarildi' ? 'ok' : 'acc');
    const izohlar = st.izohlar || [];
    if (IZOH6[holat] && !izohlar.includes(holat)) setIzoh(IZOH6[holat]);
    const nk = keyingiK(ishlar, st.k + 1);
    const tahrirdan = !!st.tahrir;
    setSt({ ...st, ishlar, izohlar: IZOH6[holat] && !izohlar.includes(holat) ? [...izohlar, holat] : izohlar, tahrir: null, saqlandi: false,
      k: nk >= 0 ? nk : st.k, faza: nk >= 0 ? 'karta' : (tahrirdan ? 'tayyor' : 'yangi') });
  };
  const qoshYangi = () => {
    // xato nomdan chiqqan bo'lsa (telefon/akkaunt/7+ raqam, takror) — qizil chegara nom maydonida
    const nn = norm(nom);
    const nomdami = (r) => (r.t === 'tel' ? AKKAUNT_RE.test(nn) || TELEFON_RE.test(nn) : r.t === 'raqam' ? RAQAM7_RE.test(nn) && !RAQAM7_RE.test(norm(sabab)) : r.t === 'takror');
    if (!tekshir({ yangi: true, yangiNom: nom, sabab, roadmapNomlar: st.ishlar.map(x => x.nom) }, 'y|' + nom + '|' + sabab, nomdami)) return;
    const el = { key: st.tahrir || ('y' + Date.now()), nom: nom.trim(), sabab: sabab.trim() };
    const yangi = st.tahrir ? st.yangi.map(x => (x.key === st.tahrir ? el : x)) : [...st.yangi, el];
    uch(kartaRef.current, yangiRef.current, el.nom, 0, 'acc');
    setSt({ ...st, yangi, tahrir: null, saqlandi: false, faza: st.tahrir || yangi.length >= 4 ? 'tayyor' : 'yangi' });
    setNom(''); setSabab('');
  };
  const qoshYozish = () => {
    const nn = nom.trim(); if (!nn || !ufq) return;
    if (AKKAUNT_RE.test(norm(nn)) || TELEFON_RE.test(norm(nn))) { setXato({ t: 'tel', blok: true }); return; }
    const ishlar = [...st.ishlar, { key: 'o' + st.ishlar.length, nom: nn.slice(0, 60), ufq, holat: null, sabab: '', ok: false }];
    setXato(null); setNom(''); setUfq(null);
    setSt({ ...st, ishlar, faza: ishlar.length >= 8 ? 'karta' : 'yozish', k: 0 });
  };
  const tahrirla = (key) => {
    if (st.faza !== 'tayyor') return;
    setSt({ ...st, tahrir: key, faza: key[0] === 'y' ? 'yangi' : 'karta' });
  };
  const saqla = () => {
    const ishlarK = [...st.ishlar.map(x => ({ nom: x.nom, ufq: x.ufq || null, holat: x.ufq !== 'uzoqroq' && x.holat === 'uzoqroqda' ? 'kechikdi' : x.holat, sabab: x.sabab })),
      ...st.yangi.map(x => ({ nom: x.nom, ufq: null, holat: 'yangi', sabab: x.sabab }))];
    refYoz({ roadmapManba: st.manba, ishlar: ishlarK });
    setSt({ ...st, saqlandi: true });
    if (live && live.mode === 'student' && !signalRef.current) { signalRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
  };
  if (isMentor) {
    return (
      <Stage eyebrow={tr({ uz: "Mustaqil ish · holat", ru: 'Самостоятельная работа · статус' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
        <QMustaqil sarlavha={tr({ uz: <>Roadmap'ingizdagi har ishga <A>holat qo'ying.</A></>, ru: <>Поставьте статус <A>каждой работе в своём roadmap.</A></> })}
          mentor={<Mentor>{tr({ uz: "Har kartada ishni mahsulotingiz bilan solishtiring: holatni bosing va sababini bir qatorda yozing.", ru: 'На каждой карточке сравните работу со своим продуктом: нажмите статус и напишите причину в одну строку.' })}</Mentor>}
          forma={<><Zoomable><HolatDoska rejim="toliq" ishlar={mentorIshlar(HAMMA_ID)} yangi={mentorYangi()} yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} /></Zoomable><MentorPracticeStats live={live} screen={screen} yorliq={tr({ uz: "Holat qo'ydi", ru: 'Поставили статус' })} /></>}>
          <Ustoz satrlar={USTOZ.s6} />
        </QMustaqil>
      </Stage>
    );
  }
  const tayyor = st.faza === 'tayyor';
  const doskaIsh = st.ishlar.map(x => ({ key: x.key, nom: qisqa(x.nom, 34), ufq: x.ufq, holat: x.ok ? x.holat : null, sabab: x.ok ? x.sabab : null }));
  const doskaYangi = st.yangi.map(x => ({ key: x.key, nom: qisqa(x.nom, 34), holat: 'yangi', sabab: x.sabab }));
  const joriy = joriyIsh ? new Set([joriyIsh.key]) : null;
  const doska = <HolatDoska rejim={tayyor ? 'toliq' : 'orta'} ishlar={doskaIsh} yangi={doskaYangi} refs={refs} yangiRef={yangiRef} joriy={joriy} onTahrir={tayyor ? tahrirla : null} yangiBos={st.faza !== 'yozish'} />;
  const xatoP = xato && <><QXato key={xato.t + (xato.blok ? 'b' : 'y')}>{tr(TX6[xato.t])}</QXato>{!xato.blok && <p className="hd-kul fade-step">{tr(YUMSHOQ_YORLIQ)}</p>}</>;
  let karta = null;
  if (st.faza === 'yozish') {
    karta = <div ref={kartaRef} className="hd-mk fade-step">
      <p className="hd-kul">{tr({ uz: "Roadmap'ingiz topilmadi — eslagan ishlaringizni yozing: nomi va ufqi. Bu asl roadmap emas, qayta yozilgani.", ru: 'Ваш roadmap не найден — запишите работы, которые помните: название и горизонт. Это не исходный roadmap, а записанный заново.' })}</p>
      <input className={cxx('hd-inp', nom.trim() && 'tola')} maxLength={60} value={nom} placeholder={tr({ uz: 'Ish nomi', ru: 'Название работы' })} onChange={e => { setNom(e.target.value); setXato(null); }} />
      <div className="hd-tugmalar kichik">{UFQLAR.map(u => <button key={u.id} type="button" className={cxx('q-chip', 'hd-ht', ufq === u.id && 'on')} onClick={() => setUfq(u.id)}>{tr(u.q)}</button>)}</div>
      {xatoP}
      <div className="hd-mk-t"><QTugma disabled={!nom.trim() || !ufq} onClick={qoshYozish}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>{N > 0 && <QTugma ikkinchi onClick={() => setSt({ ...st, faza: 'karta', k: 0 })}>{tr({ uz: "Ro'yxat tayyor", ru: 'Список готов' })}</QTugma>}</div>
    </div>;
  } else if (st.faza === 'karta' && joriyIsh) {
    const idx = st.ishlar.indexOf(joriyIsh);
    const tarix = tarixOl(joriyIsh.nom);
    const ufqT = UFQLAR.find(u => u.id === joriyIsh.ufq);
    const tugmalar = ['bajarildi', 'kechikdi', 'olib-tashlandi', ...(joriyIsh.ufq === 'uzoqroq' ? ['uzoqroqda'] : [])];
    karta = <div key={joriyIsh.key} ref={kartaRef} className="hd-mk fade-step">
      <span className="hd-mk-n">{tr({ uz: 'Ish', ru: 'Работа' })} {idx + 1} / {N}</span>
      <b className="hd-mk-nom">{joriyIsh.nom}</b>
      {ufqT && <span className="hd-kul-y">{tr(ufqT.t)}</span>}
      {tarix && <p className="hd-kul">{tr({ uz: '11-Modul 15-darsida', ru: 'На 15-м уроке Модуля 11' })}: {tr(TARIX_HOLAT[tarix])}</p>}
      <div className={cxx('hd-tugmalar', !holat && 'chorla')}>{tugmalar.map(h => <button key={h} type="button" className={cxx('q-chip', 'hd-ht', 'h-' + h, holat === h && 'on')} onClick={() => { setHolat(h); setXato(null); }}>{tr(HOLATLAR[h].t)}</button>)}</div>
      {holat && <input className={cxx('hd-inp', 'fade-step', xato && xato.t !== 'holat' && 'err')} value={sabab} placeholder={tr(SABAB_PH[holat])} onChange={e => { setSabab(e.target.value); setXato(null); }} onKeyDown={e => { if (e.key === 'Enter') saqlaIsh(); }} />}
      {xatoP}
      {izoh && <p key={tr(izoh)} className="hd-izoh-q fade-step">{tr(izoh)}</p>}
      <div className="hd-mk-t"><QTugma className={holat && sabab.trim() ? 'hd-chorla-t' : undefined} onClick={saqlaIsh}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
    </div>;
  } else if (st.faza === 'yangi') {
    karta = <div key={'yangi' + (st.tahrir || '')} ref={kartaRef} className="hd-mk fade-step">
      {izoh && <p key={tr(izoh)} className="hd-izoh-q fade-step">{tr(izoh)}</p>}
      <b className="hd-mk-nom">{tr({ uz: "Roadmap'da yo'q, lekin mahsulotingizga qo'shilgan ish bormi?", ru: 'Есть ли работа, которой не было в roadmap, но она добавлена в продукт?' })}</b>
      <p className="hd-kul">{tr({ uz: "Eng muhim to'rttagacha ishni qo'shing.", ru: 'Добавьте до четырёх самых важных работ.' })}</p>
      {model && model.nima && !nom && <button type="button" className="q-chip hd-taklif" onClick={() => setNom(String(model.nima).slice(0, 60))}>{tr({ uz: '2-darsdagi pullik qismingiz', ru: 'Ваша платная часть со 2-го урока' })}: {qisqa(String(model.nima), 48)}</button>}
      <input className={cxx('hd-inp', xato && xato.nom && 'err')} maxLength={60} value={nom} placeholder={tr({ uz: 'Qaysi ish qo\'shildi?', ru: 'Какая работа добавлена?' })} onChange={e => { setNom(e.target.value); setXato(null); }} />
      <input className={cxx('hd-inp', xato && !xato.nom && 'err')} value={sabab} placeholder={tr({ uz: "Nega qo'shildi?", ru: 'Почему добавлена?' })} onChange={e => { setSabab(e.target.value); setXato(null); }} onKeyDown={e => { if (e.key === 'Enter') qoshYangi(); }} />
      {xatoP}
      <div className="hd-mk-t">
        <QTugma disabled={!nom.trim()} onClick={qoshYangi}>{st.tahrir ? tr({ uz: 'Saqlash', ru: 'Сохранить' }) : tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>
        {!st.tahrir && <QTugma ikkinchi onClick={() => setSt({ ...st, faza: 'tayyor', saqlandi: false })}>{tr({ uz: "Yangi ish yo'q", ru: 'Новых работ нет' })}</QTugma>}
      </div>
    </div>;
  }
  const yangiSoni = st.yangi.length;
  const jami = N + yangiSoni;
  const navL = tayyor ? (st.saqlandi ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Saqlash', ru: 'Сохранить' }) : { uz: `Ishlarga holat qo'ying (${n}/${N})`, ru: `Поставьте статус работам (${n}/${N})` };
  return (
    <Stage eyebrow={tr({ uz: "Mustaqil ish · holat", ru: 'Самостоятельная работа · статус' })} screen={screen} scrollSignal={n * 10 + yangiSoni + (tayyor ? 100 : 0) + (st.faza === 'karta' ? 1000 : 0)} natijaSignal={st.saqlandi ? 1 : 0}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tayyor} label={tr(navL)} onClick={tayyor && !st.saqlandi ? saqla : onNext} /></>}>
      <div className="hd-s6">
        <QMustaqil
          sarlavha={tr({ uz: <>Roadmap'ingizdagi har ishga <A>holat qo'ying.</A></>, ru: <>Поставьте статус <A>каждой работе в своём roadmap.</A></> })}
          mentor={<Mentor>{st.faza === 'yozish'
            ? tr({ uz: "Avval eslagan ishlaringizni yozing — keyin har biriga holat qo'yasiz.", ru: 'Сначала запишите работы, которые помните, — потом поставите статус каждой.' })
            : tr({ uz: "Har kartada ishni mahsulotingiz bilan solishtiring: holatni bosing va sababini bir qatorda yozing.", ru: 'На каждой карточке сравните работу со своим продуктом: нажмите статус и напишите причину в одну строку.' })}</Mentor>}
          qadamlar={N > 0 && <div className="hd-strip"><span>{tr({ uz: "Roadmap'im", ru: 'Мой roadmap' })} · <b key={n}>{n} / {N}</b></span></div>}
          forma={tayyor
            ? <div className="hd-fokus"><Zoomable>{doska}</Zoomable></div>
            : <div className="hd-ikki s6"><div className="hd-o"><Zoomable>{doska}</Zoomable></div>{karta}</div>}
          yordam={!tayyor && <Yordam>
            <p>{tr({ uz: "Ishni mahsulotingizda oching — web-trekda saytingizda: u ishlayaptimi? O'z ufqi ichida tugagan va ishlayotgan ish — bajarildi; keyin tugagan yoki hali yo'q — kechikdi; endi qilmaysiz — olib tashlandi.", ru: 'Откройте работу в своём продукте — на веб-треке на сайте: она работает? Закончена в своём горизонте и работает — выполнено; закончена позже или её ещё нет — опоздало; больше не делаете — убрано.' })}</p>
            <p>{tr({ uz: "Bu darsda keyinroq ufqidagi hali qilinmagan ish ham — kechikdi: 12-dars yangi ish qo'shmaydi. Roadmap'da yo'q ishni oxirida qo'shing: funksiya yoki katta qism, har tugma emas.", ru: 'На этом уроке ещё не сделанная работа из горизонта «Позже» тоже — опоздало: 12-й урок новых работ не добавляет. Работу, которой нет в roadmap, добавьте в конце: функцию или крупную часть, а не каждую кнопку.' })}</p>
            <p>{tr({ uz: "Mentor misolida: «Maydon pulini bo'lishish» — uzoqroqda qoldi: muammo gapidan kelmaydi; 2-darsda solishtirildi. Olib tashlash — mag'lubiyat emas: ish endi kerak emasligini bilib oldingiz.", ru: 'В примере Ментора: «Делить плату за поле» — осталось дальше: не следует из формулировки проблемы; сравнили на 2-м уроке. Убрать — не поражение: вы узнали, что работа больше не нужна.' })}</p>
          </Yordam>}
        >
          {tayyor && st.saqlandi && <QXulosa>{yangiSoni > 0
            ? tr({ uz: `Har ishga holat va sabab qo'yildi: ${jami} ta ish, shundan ${yangiSoni} tasi yangi.`, ru: `Каждой работе поставлены статус и причина: ${jami} ${ruKop(jami, ['работа', 'работы', 'работ'])}, из них новых — ${yangiSoni}.` })
            : tr({ uz: `Har ishga holat va sabab qo'yildi: ${jami} ta ish.`, ru: `Каждой работе поставлены статус и причина: ${jami} ${ruKop(jami, ['работа', 'работы', 'работ'])}.` })}</QXulosa>}
          {qatlam}
        </QMustaqil>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — SHAXSIY HISOBOT (QMustaqil, USTAXONA 2/2 — ketma-ket 3 karta; chapda Mentor javobi yopiq turadi, o'quvchi avval o'zi yozadi) =====
const sonF = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const dalillarOl = () => {
  const out = [];
  const sh = lsO(SUHBAT_KEY);
  const real = sh && Array.isArray(sh.suhbatlar) ? sh.suhbatlar.filter(y => y && y.tur === 'real') : [];
  if (real.length) {
    const c = (j) => real.filter(y => y.javob === j).length;
    const uz = [['ha', 'ha'], ['qimmat', 'qimmat'], ['yoq', "yo'q"], ['javobsiz', 'javobsiz']].filter(([j]) => c(j)).map(([j, t]) => `${t} ${c(j)}`).join(', ');
    const ru = [['ha', 'да'], ['qimmat', 'дорого'], ['yoq', 'нет'], ['javobsiz', 'без ответа']].filter(([j]) => c(j)).map(([j, t]) => `${t} ${c(j)}`).join(', ');
    out.push({ id: 'suhbat', t: { uz: `6-dars · suhbatlar: ${real.length} ta — ${uz}`, ru: `Урок 6 · разговоры: ${real.length} — ${ru}` } });
  }
  const ts = lsO(TASDIQ_KEY);
  if (ts && Number(ts.soralgan) > 0) {
    const t = (Array.isArray(ts.tasdiqlar) ? ts.tasdiqlar : []).filter(x => x && x.hisobga !== false).length;
    out.push({ id: 'tasdiq', t: { uz: `9-dars · yozma javob so'ralgan ${ts.soralgan} kishidan ${t} ta yozma tasdiq`, ru: `Урок 9 · из ${ts.soralgan} человек, у которых просили письменный ответ, — ${t} ${ruKop(t, ['письменное подтверждение', 'письменных подтверждения', 'письменных подтверждений'])}` } });
  }
  const b = lsO(BIRLIK_KEY), nx = lsO(NARX_KEY);
  if (b && b.tur === 'real' && Number.isFinite(b.narxTaxmin) && nx && Number.isFinite(nx.narx)) out.push({ id: 'narx', t: { uz: `Narx taxminlarim: 1-darsda ${sonF(b.narxTaxmin)} so'm, 4-darsda ${sonF(nx.narx)} so'm`, ru: `Мои предположения о цене: на 1-м уроке ${sonF(b.narxTaxmin)} сумов, на 4-м уроке ${sonF(nx.narx)} сумов` } });
  const r = refOl();
  const kech = r && Array.isArray(r.ishlar) ? r.ishlar.filter(x => x.holat === 'kechikdi') : [];
  if (kech.length) out.push({ id: 'roadmap', t: { uz: `Bugun · roadmap: ${kech.length} ta ish o'z ufqida tugamadi`, ru: `Сегодня · roadmap: ${kech.length} ${ruKop(kech.length, ['работа не закончена', 'работы не закончены', 'работ не закончено'])} в своём горизонте` } });
  return out;
};
const TOPMADIM = { uz: "Hozircha noto'g'ri chiqqan qaror topmadim. Qayta ko'rishga sabab bo'lgan dalil: ", ru: 'Пока не нашёл решения, которое оказалось неверным. Довод, из-за которого я пересмотрел решение: ' };
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [st, setSt] = useState(() => {
    if (storedAnswer && storedAnswer.st) return storedAnswer.st;
    const r = refOl(); const j = { qarorim: null, notogri: null, keyingi: null, ...((r && r.javoblar) || {}) };
    const bosh = SAVOLLAR.findIndex(s => !(typeof j[s.k] === 'string' && j[s.k].trim()));
    return { javoblar: j, j: bosh < 0 ? 3 : bosh, qoralama: {}, dalil: {}, tahrir: null, bonus: false };
  });
  const [mOchiq, setMOchiq] = useState(false);
  const [xato, setXato] = useState(null);
  const yumRef = useRef(null);
  const signalRef = useRef(false);
  const vRefs = useRef({});
  const inpRef = useRef(null);
  const [uch, qatlam] = useUchish();
  const [ctx] = useState(() => {
    const r = refOl(); const m = lsO(MODEL_KEY);
    const ishlar = r && Array.isArray(r.ishlar) ? r.ishlar : [];
    const kech = ishlar.filter(x => x.holat === 'kechikdi').map(x => x.nom);
    return { model: m, ishSoni: ishlar.length, kech, dalillar: dalillarOl() };
  });
  useEffect(() => { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'hisobot', st, correct: st.bonus, solved: st.j >= 3 }); }, [st]); // eslint-disable-line
  useEffect(() => { setXato(null); yumRef.current = null; setMOchiq(false); }, [st.j]);
  const done = st.j >= 3;
  const sv = !done ? SAVOLLAR[st.j] : null;
  const matn = sv ? (st.qoralama[sv.k] ?? st.javoblar[sv.k] ?? '') : '';
  const setMatn = (v) => { if (!sv) return; setXato(null); setSt(s => ({ ...s, qoralama: { ...s.qoralama, [sv.k]: v } })); };
  const ishlatilgan = sv ? (st.dalil[sv.k] || []) : [];
  const dalilBos = (d) => {
    if (ishlatilgan.includes(d.id)) return;
    const t = tr(d.t);
    setSt(s => ({ ...s, qoralama: { ...s.qoralama, [sv.k]: (matn.trim() ? (/[:;]$/.test(matn.trim()) ? matn.trim() : matn.trim().replace(/[.,]?$/, ';')) + ' ' : '') + t }, dalil: { ...s.dalil, [sv.k]: [...ishlatilgan, d.id] } }));
    setXato(null);
  };
  const saqla = () => {
    const r = s7Tekshir({ k: sv.k, matn, dalilBosildi: ishlatilgan.length > 0, mentorJavob: MENTOR_JAVOBLAR.filter(m => m.k === sv.k).flatMap(m => [m.j.uz, m.j.ru]) });
    const kalit = sv.k + '|' + matn;
    if (r && (r.blok || yumRef.current !== kalit)) { setXato(r); yumRef.current = r.blok ? null : kalit; return; }
    const t = matn.trim().slice(0, 200);
    const d = refYoz({ javoblar: { [sv.k]: t } });
    uch(inpRef.current, vRefs.current['v' + st.j], qisqa(t, 30), 0, 'ok');
    const javoblar = { ...st.javoblar, [sv.k]: t };
    const keyingi = SAVOLLAR.findIndex(s => !(typeof javoblar[s.k] === 'string' && javoblar[s.k].trim()));
    const hammasi = keyingi < 0;
    const bonus = st.bonus || hammasi;
    setSt(s => ({ ...s, javoblar, j: hammasi ? 3 : keyingi, tahrir: null, bonus }));
    if (hammasi && live && live.mode === 'student' && !signalRef.current) { signalRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
    return d;
  };
  const tahrirla = (i) => setSt(s => ({ ...s, j: i, tahrir: i }));
  const n = SAVOLLAR.filter(s => typeof st.javoblar[s.k] === 'string' && st.javoblar[s.k].trim()).length;
  const sarlavha = tr({ uz: <>O'z qarorlaringiz haqida <A>uch savolga javob yozing.</A></>, ru: <>Напишите ответы <A>на три вопроса о своих решениях.</A></> });
  // joy so'zi telefonda ham rost bo'lsin (≤760 px — Mentor kartasi tepada): «MD ga taklif»
  const tor = useIsMobile(761);
  // kompyuterda: yangi savol, dalil yoki ogohlantirish chiqqanda «Saqlash» pastki panel ostida qolmasin (telefonda Stage o'zi suradi)
  const s7Bir = useRef(true);
  useEffect(() => {
    if (s7Bir.current) { s7Bir.current = false; return undefined; }
    if (st.j >= 3 || typeof window === 'undefined' || window.innerWidth <= 768) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.hd-s7 .hd-mk-t'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 360);
    return () => clearTimeout(t);
  }, [st.j, ishlatilgan.length, xato]);
  const mentorGap = <Mentor>{tor
    ? tr({ uz: "O'zingiz yozing; kerak bo'lsa — tepadagi Mentor misolini oching.", ru: 'Пишите сами; если нужно — откройте пример Ментора выше.' })
    : tr({ uz: "O'zingiz yozing; kerak bo'lsa — chapdagi Mentor misolini oching.", ru: 'Пишите сами; если нужно — откройте пример Ментора слева.' })}</Mentor>;
  const mentorVaraq = <Varaq sarlavha={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} qatorlar={MENTOR_JAVOBLAR.map((m, i) => ({ s: tr(SAVOLLAR[i].q), j: nb(tr(m.j)), yorliq: m.yorliq && tr(m.yorliq) }))} />;
  if (isMentor) {
    return (
      <Stage eyebrow={tr({ uz: 'Mustaqil ish · shaxsiy hisobot', ru: 'Самостоятельная работа · личный отчёт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
        <QMustaqil sarlavha={sarlavha} mentor={mentorGap} forma={<><Zoomable>{mentorVaraq}</Zoomable><MentorPracticeStats live={live} screen={screen} yorliq={tr({ uz: 'Hisobot yozdi', ru: 'Написали отчёт' })} /></>}>
          <Ustoz satrlar={USTOZ.s7} />
        </QMustaqil>
      </Stage>
    );
  }
  const oz = <Varaq sarlavha={tr({ uz: 'Shaxsiy hisobotim', ru: 'Мой личный отчёт' })} refs={vRefs} joriy={done ? null : st.j} onTahrir={done ? tahrirla : null}
    qatorlar={SAVOLLAR.map(s => ({ s: tr(s.q), j: st.javoblar[s.k] || null }))} kichik={!done} />;
  const mj = sv && MENTOR_JAVOBLAR[st.j];
  const xatoP = xato && <><QXato key={xato.t + (xato.blok ? 'b' : 'y')}>{tr(TX7[xato.t])}</QXato>{!xato.blok && <p className="hd-kul fade-step">{tr(YUMSHOQ_YORLIQ)}</p>}</>;
  const ust = sv && sv.k === 'qarorim' && ctx.model && MODEL_NOM[ctx.model.model]
    ? tr({ uz: `2-darsdagi tanlovingiz: ${MODEL_NOM[ctx.model.model].uz}` + (matnOl(ctx.model.kim) ? `; to'laydi — ${matnOl(ctx.model.kim)}` : '') + '.', ru: `Ваш выбор на 2-м уроке: ${MODEL_NOM[ctx.model.model].ru}` + (matnOl(ctx.model.kim) ? `; платит — ${matnOl(ctx.model.kim)}` : '') + '.' })
    : sv && sv.k === 'keyingi' && ctx.kech.length
      ? tr({ uz: 'Kechikkan ishlaringiz', ru: 'Ваши опоздавшие работы' }) + ': ' + ctx.kech.slice(0, 3).map(x => qisqa(x, 30)).join(', ') + (ctx.kech.length > 3 ? ', …' : '')
      : null;
  const karta = sv && <div key={sv.k} className="hd-mk fade-step">
    <span className="hd-mk-n">{st.j + 1} / 3 · {tr(sv.ch)}</span>
    <b className="hd-mk-nom">{tr(sv.q)}</b>
    {ust && <p className="hd-kul">{ust}</p>}
    {sv.k === 'notogri' && !matn.trim() && <button type="button" className="q-chip hd-taklif" onClick={() => setMatn(tr(TOPMADIM))}>{tr({ uz: 'Hozircha bunday qaror topmadim', ru: 'Пока такого решения не нашёл' })}</button>}
    <textarea ref={inpRef} rows={3} maxLength={200} className={cxx('hd-inp', 'hd-ta', xato && 'err', !matn.trim() && 'chorla')} value={matn} placeholder={tr(sv.ph)} onChange={e => setMatn(e.target.value)} />
    {sv.k === 'notogri' && <p className="hd-kul">{tr({ uz: 'Dalil — son yoki yozuv; qayerdan olinganini ham yozing.', ru: 'Довод — число или запись; укажите и откуда он взят.' })}</p>}
    {sv.k === 'notogri' && ctx.dalillar.length > 0 && <div className="hd-dalillar">{ctx.dalillar.map(d => <button key={d.id} type="button" className={cxx('q-chip', 'hd-dalil', ishlatilgan.includes(d.id) && 'ishl')} disabled={ishlatilgan.includes(d.id)} onClick={() => dalilBos(d)}>{ishlatilgan.includes(d.id) && '✓ '}{tr(d.t)}</button>)}</div>}
    {xatoP}
    <div className="hd-mk-t"><QTugma className={matn.trim() ? 'hd-chorla-t' : undefined} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
  </div>;
  const qismlar = <div className="hd-qism">{SAVOLLAR.map((s, i) => <span key={s.k} className={cxx('hd-qism-c', i === st.j && 'on', st.javoblar[s.k] && 'ok')}>{st.javoblar[s.k] ? '✓' : i + 1} {tr(s.ch)}</span>)}</div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · shaxsiy hisobot', ru: 'Самостоятельная работа · личный отчёт' })} screen={screen} scrollSignal={st.j * 10 + (xato ? 1 : 0)} natijaSignal={done ? 1 : 0}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Savollarga javob yozing (${n}/3)`, ru: `Напишите ответы на вопросы (${n}/3)` })} onClick={onNext} /></>}>
      <div className="hd-s7">
        <QMustaqil sarlavha={sarlavha} mentor={mentorGap}
          qadamlar={<div className="hd-s7-ust">
            <p className="hd-kul">{tr({ uz: "Hisobotingiz Mentor ekraniga chiqmaydi — faqat saqlangani ko'rinadi.", ru: 'Ваш отчёт не выводится на экран Ментора — видно только, что он сохранён.' })}</p>
            <div className="hd-s7-ch">{ctx.ishSoni > 0 && <Strip n={ctx.ishSoni} />}{!done && qismlar}</div>
          </div>}
          forma={done
            ? <div className="hd-fokus"><Zoomable>{oz}</Zoomable></div>
            : <div className="hd-ikki s7">
                <div className="hd-o">
                  <div className="hd-mj-karta">
                    <span className="hd-kul-y">{tr({ uz: 'Mentor misolida', ru: 'В примере Ментора' })} · <MJ /></span>
                    {mOchiq
                      ? <p key={st.j} className="hd-mj-j fade-step">{nb(tr(mj.j))}{mj.yorliq && <i className="hd-kul-y">{tr(mj.yorliq)}</i>}</p>
                      : <button type="button" className="q-chip hd-mj-och" onClick={() => setMOchiq(true)}>{tr({ uz: "Mentor misolini ko'rish", ru: 'Посмотреть пример Ментора' })}</button>}
                  </div>
                  {oz}
                </div>
                {karta}
              </div>}
          yordam={!done && <Yordam>
            <p>{tr({ uz: "Birinchi savol — o'zingiz tanlagan narsa: kim to'laydi, nima bepul qoladi, narx, qaysi ish birinchi. Agent yoki Mentor tanlagani emas.", ru: 'Первый вопрос — то, что выбрали вы сами: кто платит, что остаётся бесплатным, цена, какая работа первая. Не то, что выбрал агент или Ментор.' })}</p>
            <p>{tr({ uz: "Ikkinchi savol — fikringizni o'zgartirgan son yoki yozuv: suhbat, yozma tasdiq, hisob. Noto'g'ri chiqqan qaror — mag'lubiyat emas: uni dalil ko'rsatdi. Topmagan bo'lsangiz — shuni yozing va qaysi dalil qarorni qayta ko'rishga sabab bo'lganini qo'shing. Uchinchi savol — bitta aniq ish: nima qilasiz, qachon yoki kim bilan.", ru: 'Второй вопрос — число или запись, которые изменили ваше мнение: разговор, письменное подтверждение, расчёт. Неверное решение — не поражение: его показал довод. Если не нашли — так и напишите и добавьте, какой довод заставил пересмотреть решение. Третий вопрос — одно конкретное дело: что сделаете, когда или с кем.' })}</p>
          </Yordam>}
        >
          {done && <QXulosa><XulosaQ matn={tr({ uz: 'Shaxsiy hisobotingiz tayyor: qaror, dalil va keyingi 4 hafta.', ru: 'Ваш личный отчёт готов: решение, довод и ближайшие 4 недели.' })}
            izoh={tr({ uz: "O'z qarorlaringiz haqidagi bu uch javob — shaxsiy hisobot.", ru: 'Эти три ответа о ваших решениях — личный отчёт.' })} /></QXulosa>}
          {qatlam}
        </QMustaqil>
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  statusCheck: { icon: '🗂️', name: 'Status Check!', desc: { uz: 'Mentor ishlariga mos holat qo\'ydingiz', ru: 'Вы поставили подходящие статусы работам Ментора' } },
  notInPlan: { icon: '➕', name: 'Not in Plan!', desc: { uz: "Roadmap'da yo'q ishning holatini topdingiz", ru: 'Вы нашли статус работы, которой не было в roadmap' } },
  openPlan: { icon: '🗺️', name: 'Open Plan!', desc: { uz: 'Roadmap nimaga kerakligini topdingiz', ru: 'Вы нашли, зачем нужен roadmap' } },
  lookBack: { icon: '🔭', name: 'Look Back!', desc: { uz: 'Shaxsiy hisobotingizni yozib saqladingiz', ru: 'Вы написали и сохранили личный отчёт' } }
};
// Ekran id → nishon: 2-ekran — besh karta birinchi urinishda (challenge) · 3, 5 — ballik test · 7 — uchala javob saqlanganda (bonus, ish bajarilgan ekranda — P-048)
const ACH_TRIGGERS = { s2: 'statusCheck', s3: 'notInPlan', s5: 'openPlan', s7: 'lookBack' };

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
  3: { uz: "1 — Roadmap'da yo'q ish", ru: '1 — Работа вне roadmap' },
  5: { uz: '2 — Roadmap nimaga kerak', ru: '2 — Зачем нужен roadmap' },
  8: { uz: "Yakuniy — Qayta ko'rishga dalil", ru: 'Итог — довод для пересмотра' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (MD; R-008: {uz, ru}, emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'roadmap', ru: 'roadmap' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'ufq', ru: 'горизонт' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'holat', ru: 'статус' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'bajarildi', ru: 'выполнено' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'kechikdi', ru: 'опоздало' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'sabab', ru: 'причина' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'reja', ru: 'план' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'qaror', ru: 'решение' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'dalil', ru: 'довод' }, l: 55, t: 50, s: 22, d: 22, dl: 3.4 },
  { ch: 'Tesla', l: 88, t: 44, s: 22, d: 24, dl: 0.6 },
  { ch: 'Maydon Jamoa', l: 32, t: 58, s: 20, d: 26, dl: 2.6 }
];
// ⚡ Mustahkamlash-jang — 12 savol (MD jadvali), to'g'ri javoblar A·B·C·D ×3: 0·2·1·3·0·1·2·3·0·1·2·3
const QUIZ_BANK = [
  { q: { uz: 'Bu darsda holat nimani aytadi?', ru: 'О чём говорит статус на этом уроке?' }, opts: [{ uz: "Roadmap'dagi ish ufqiga qarab qayerda ekanini", ru: 'Где работа из roadmap относительно горизонта' }, { uz: 'Ishga qancha vaqt va qancha kuch sarflanganini', ru: 'Сколько времени и сил ушло на работу' }, { uz: 'Ishni kim yoki qaysi agent yozib berganini', ru: 'Кто или какой агент написал работу' }, { uz: 'Ishning RICE bahosi hozir necha ball ekanini', ru: 'Сколько баллов сейчас у оценки RICE' }], correct: 0 },
  { q: { uz: "Ish o'z ufqidan keyin tugadi. Holati qanday?", ru: 'Работа закончена после своего горизонта. Какой статус?' }, opts: [{ uz: 'Bajarildi: hozir ishlab turibdi', ru: 'Выполнено: сейчас работает' }, { uz: "Olib tashlandi: vaqti o'tib ketdi", ru: 'Убрано: время прошло' }, { uz: 'Kechikdi: ufqi ichida tugamagan', ru: 'Опоздало: не закончено в горизонте' }, { uz: "Yangi qo'shildi: keyin qo'shilgan", ru: 'Добавлено новое: добавлено позже' }], correct: 2 },
  { q: { uz: "Mentor «Maydon pulini bo'lishish»ga qaysi holatni qo'ydi?", ru: 'Какой статус Ментор поставил работе «Делить плату за поле»?' }, opts: [{ uz: 'Olib tashlandi: endi kerak emas', ru: 'Убрано: больше не нужно' }, { uz: 'Uzoqroqda qoldi: vaqti kelmagan', ru: 'Осталось дальше: время не пришло' }, { uz: 'Kechikdi: ufqida qilinmay qoldi', ru: 'Опоздало: не сделано в горизонте' }, { uz: "Bajarildi: 2-darsda ko'rib chiqildi", ru: 'Выполнено: рассмотрено на 2-м уроке' }], correct: 1 },
  { q: { uz: "Mentor roadmap'ida qaysi ish yo'q edi?", ru: 'Какой работы не было в roadmap Ментора?' }, opts: [{ uz: "O'yin kuni kelishini tasdiqlash", ru: 'Подтверждение прихода в день игры' }, { uz: "O'yindan oldin eslatma chiqarish", ru: 'Напоминание перед игрой' }, { uz: "Maydon pulini o'zaro bo'lishish", ru: 'Делить плату за поле между собой' }, { uz: 'Telegram orqali xabar yuborish', ru: 'Отправка сообщения через Telegram' }], correct: 3 },
  { q: { uz: "Ishdan voz kechdingiz. Roadmap'da u qanday qoladi?", ru: 'Вы отказались от работы. Как она остаётся в roadmap?' }, opts: [{ uz: '«Olib tashlandi» deb, sababi bilan', ru: 'Как «убрано», с причиной' }, { uz: "Butunlay o'chiriladi, izi qolmaydi", ru: 'Удаляется полностью, без следа' }, { uz: '«Kechikdi» deb, keyinga suriladi', ru: 'Как «опоздало», переносится' }, { uz: "Holatsiz, o'z ustunida turaveradi", ru: 'Без статуса, стоит в своей колонке' }], correct: 0 },
  { q: { uz: 'Holat yonida yana nima yoziladi?', ru: 'Что ещё пишут рядом со статусом?' }, opts: [{ uz: 'Ishning RICE bahosi va qaysi ufqi', ru: 'Оценка RICE и горизонт работы' }, { uz: 'Nega shu holat ekanining sababi', ru: 'Причина, почему такой статус' }, { uz: "Agentga yozilgan to'liq prompt", ru: 'Полный промпт для агента' }, { uz: 'Ishning kodidan olingan bo\'lak', ru: 'Фрагмент кода работы' }], correct: 1 },
  { q: { uz: "Tesla 2006-yilgi rejasini kimga ko'rsatgan?", ru: 'Кому Tesla показала свой план 2006 года?' }, opts: [{ uz: 'Faqat kompaniya ichida, yashirin', ru: 'Только внутри компании, тайно' }, { uz: 'Bir necha tanish odamga aytib', ru: 'Рассказав нескольким знакомым' }, { uz: "Hamma ko'ra oladigan qilib, ochiq", ru: 'Открыто, чтобы видели все' }, { uz: "Hech kimga, o'zida saqlab qo'ygan", ru: 'Никому, оставила у себя' }], correct: 2 },
  { q: { uz: 'Tesla rejasining birinchi bosqichi nima edi?', ru: 'Каким был первый этап плана Tesla?' }, opts: [{ uz: "Ko'pchilik uchun ommaviy mashina", ru: 'Массовый автомобиль для многих' }, { uz: "Narxi arzonroq bo'lgan mashina", ru: 'Более дешёвый автомобиль' }, { uz: "Rejani hammaga ochiq e'lon qilish", ru: 'Открыто объявить план всем' }, { uz: 'Qimmat sport mashinasi, oz sonda', ru: 'Дорогой спортивный автомобиль, немного' }], correct: 3 },
  { q: { uz: 'Shaxsiy hisobotning birinchi savoli nima haqida?', ru: 'О чём первый вопрос личного отчёта?' }, opts: [{ uz: "O'z qarorim bilan nima qilganim", ru: 'Что я сделал по своему решению' }, { uz: 'Agent men uchun nima qilib bergani', ru: 'Что агент сделал за меня' }, { uz: 'Mentor ishimni qanday baholagani', ru: 'Как Ментор оценил мою работу' }, { uz: "Roadmap'dagi qaysi ish kechikkani", ru: 'Какая работа в roadmap опоздала' }], correct: 0 },
  { q: { uz: "Mentor qaysi qarorini qayta ko'rganini aytdi?", ru: 'Какое решение, по словам Ментора, он пересмотрел?' }, opts: [{ uz: "Pro'ni tashkilotchiga qo'yganini", ru: 'Что сделал Pro для организатора' }, { uz: "1-darsda narxni qanday o'ylaganini", ru: 'Какую цену задумал на 1-м уроке' }, { uz: "Telegram xabarini ham qo'shganini", ru: 'Что добавил и сообщение в Telegram' }, { uz: "Maydon pulini uzoqroqqa qo'yganini", ru: 'Что отложил дележ платы за поле' }], correct: 1 },
  { q: { uz: "Qaysi javob «keyingi 4 hafta» uchun aniq ish?", ru: 'Какой ответ — конкретное дело на «ближайшие 4 недели»?' }, opts: [{ uz: 'Mahsulotni yanada yaxshiroq qilaman', ru: 'Сделаю продукт ещё лучше' }, { uz: 'Hamma ishni vaqtida bajarib boraman', ru: 'Буду всё делать вовремя' }, { uz: "Uch tanishdan narx haqida so'rayman", ru: 'Спрошу троих знакомых о цене' }, { uz: "Ilovam juda mashhur bo'lib ketadi", ru: 'Моё приложение станет очень популярным' }], correct: 2 },
  { q: { uz: "Noto'g'ri chiqqan qarorni hisobotda nima qilasiz?", ru: 'Что вы делаете в отчёте с неверным решением?' }, opts: [{ uz: 'Yashiraman: hisobotga yozmayman', ru: 'Прячу: не пишу в отчёт' }, { uz: "To'g'ri chiqqan deb yozib qo'yaman", ru: 'Пишу, что оно оказалось верным' }, { uz: 'Faqat Mentorga og\'zaki aytaman', ru: 'Говорю только Ментору устно' }, { uz: "Uni dalili bilan yozib qo'yaman", ru: 'Записываю его вместе с доводом' }], correct: 3 }
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
      <div className="card-lbl" style={{ color: T.accent }}>{yorliq || tr({ uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
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

const KARTOCHKALAR = [
  { front: { uz: 'Bu darsda holat nimani aytadi?', ru: 'О чём говорит статус на этом уроке?' }, back: { uz: "Roadmap'dagi ish o'z ufqiga qarab qayerda ekanini", ru: 'Где работа из roadmap относительно своего горизонта' }, note: { uz: 'Yonida — bir qator sabab', ru: 'Рядом — причина в одну строку' } },
  { front: { uz: '«Bajarildi» qachon qo\'yiladi?', ru: 'Когда ставят «выполнено»?' }, back: { uz: "Roadmap'dagi ish o'z ufqi ichida tugagan va hozir ishlaydi", ru: 'Работа из roadmap закончена в своём горизонте и сейчас работает' }, note: { uz: 'Mentor misolida: uch asosiy funksiya — 11-Modulda', ru: 'В примере Ментора: три основные функции — в Модуле 11' } },
  { front: { uz: '«Kechikdi» qachon qo\'yiladi?', ru: 'Когда ставят «опоздало»?' }, back: { uz: "Ish o'z ufqi ichida tugamagan: keyin tugagan yoki hali yo'q", ru: 'Работа не закончена в своём горизонте: закончена позже или её ещё нет' }, note: { uz: "11-Modulda ishning vaqti — o'z darsi edi, bugun — ufqi", ru: 'В Модуле 11 время работы — её урок, сегодня — горизонт' } },
  { front: { uz: '«Olib tashlandi» nimani bildiradi?', ru: 'Что значит «убрано»?' }, back: { uz: 'Ish endi qilinmaydi', ru: 'Работу больше не делают' }, note: { uz: 'Doskada qoladi — nomi ustidan chiziq va sababi bilan', ru: 'Остаётся на доске — зачёркнутое название и причина' } },
  { front: { uz: '«Uzoqroqda qoldi» qaysi ishga qo\'yiladi?', ru: 'Какой работе ставят «осталось дальше»?' }, back: { uz: "Vaqti hali kelmagan, o'z ustunida turgan ishga", ru: 'Работе, время которой ещё не пришло, стоящей в своей колонке' }, note: { uz: "Mentor misolida: maydon pulini bo'lishish", ru: 'В примере Ментора: делить плату за поле' } },
  { front: { uz: "«Yangi qo'shildi» qaysi ishga qo'yiladi?", ru: 'Какой работе ставят «добавлено новое»?' }, back: { uz: "Roadmap'da yo'q edi, lekin mahsulotga qo'shilgan ishga", ru: 'Работе, которой не было в roadmap, но она добавлена в продукт' }, note: { uz: "Mentor misolida: lending, Pro va test to'lov, Telegram xabari, taklif havolasi", ru: 'В примере Ментора: лендинг, Pro и тестовая оплата, сообщение в Telegram, ссылка-приглашение' } },
  { front: { uz: 'Holat yonida yana nima yoziladi?', ru: 'Что ещё пишут рядом со статусом?' }, back: { uz: 'Bir qator sabab', ru: 'Причину в одну строку' }, note: { uz: "Mentor misolida: «muammo gapidan kelmaydi; 2-darsda solishtirildi»", ru: 'В примере Ментора: «не следует из формулировки проблемы; сравнили на 2-м уроке»' } },
  { front: { uz: 'Tesla 2006-yilda nimani e\'lon qilgan?', ru: 'Что Tesla объявила в 2006 году?' }, back: { uz: '«Maxfiy master-reja»ni — u hammaga ochiq bo\'lgan', ru: '«Секретный генеральный план» — он был открыт для всех' }, note: { uz: 'Uch bosqich: qimmat sport mashinasi, arzonroq mashina, ommaviy mashina', ru: 'Три этапа: дорогой спортивный автомобиль, более дешёвый, массовый' } },
  { front: { uz: 'Roadmap nega yozib qo\'yiladi?', ru: 'Зачем записывают roadmap?' }, back: { uz: 'Keyin nima bajarilganini solishtirish uchun', ru: 'Чтобы потом сравнить, что выполнено' }, note: { uz: 'Tesla voqeasida reja ochiq yozilgan va bosqichma-bosqich bajarilgan', ru: 'В истории Tesla план был записан открыто и выполнялся поэтапно' } },
  { front: { uz: 'Shaxsiy hisobot nima?', ru: 'Что такое личный отчёт?' }, back: { uz: "O'z qarorlaringiz haqida uch savolga yozma javob", ru: 'Письменные ответы на три вопроса о ваших решениях' }, note: { uz: "Nima qildim, nima noto'g'ri chiqdi, keyingi 4 haftada nima qilaman", ru: 'Что сделал, что оказалось неверным, что сделаю в ближайшие 4 недели' } },
  { front: { uz: "Noto'g'ri chiqqan qaror yonida nima yoziladi?", ru: 'Что пишут рядом с неверным решением?' }, back: { uz: "Uni ko'rsatgan dalil: son yoki yozuv", ru: 'Довод, который его показал: число или запись' }, note: { uz: 'Mentor misolida: 4-darsdagi xarajat hisobi', ru: 'В примере Ментора: расчёт расходов на 4-м уроке' } },
  { front: { uz: "Mentor Pro'ni kimga qo'ydi?", ru: 'Для кого Ментор сделал Pro?' }, back: { uz: "Tashkilotchiga, o'yinchiga emas", ru: 'Для организатора, а не для игрока' }, note: { uz: 'Mentorning shaxsiy hisobotidagi birinchi javob', ru: 'Первый ответ в личном отчёте Ментора' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + ①②③; ① varianti va ③ — holatdan; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "o'zingiz", ru: 'сами' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: "bitta ish bo'yicha qaror", ru: 'решение по одной работе' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_1 = { uz: "Hali tugamagan kechikkan ishlaringizdan birini tanlang: yangi ufq berasizmi yoki olib tashlaysizmi — qaroringizni sababi bilan qog'ozga yozing.", ru: 'Выберите одну из опоздавших работ, которая ещё не закончена: дадите ей новый горизонт или уберёте — запишите решение с причиной на бумаге.' };
const HW_1_YOQ = { uz: "(Bunday ish bo'lmasa: uzoqroqda qolgan bitta ishni ko'rib chiqing — hali kerakmi, sababi bilan yozing.)", ru: '(Если такой работы нет: рассмотрите одну работу, которая осталась дальше, — нужна ли она ещё, напишите с причиной.)' };
const HW_2 = { uz: "«Keyingi 4 hafta» javobingizdagi ishni qachon boshlashingizni yozing.", ru: 'Напишите, когда начнёте дело из ответа «ближайшие 4 недели».' };
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ kech, qolgan, keyingi }) => (
  <div className="card hd-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="hd-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="hd-hw-q"><span className="hd-hw-k">{tr(r.k)}</span><span className="hd-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="hd-hw-qadam">
      <li><i>{HW_RAQAM[0]}</i><span>{kech === true ? tr(HW_1) : kech === false ? tr(HW_1_YOQ).replace(/^\(|\)$/g, '') : <>{tr(HW_1)} {tr(HW_1_YOQ)}</>}</span></li>
      <li><i>{HW_RAQAM[1]}</i><span>{tr(HW_2)}</span></li>
      {qolgan && <li><i>{HW_RAQAM[2]}</i><span>{qolgan}</span></li>}
    </ol>
    {keyingi && <span className="hd-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (besh holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50)
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
  // «Endi siz bilasiz» — MD 11-ekran aynan (asosiy fikr so'zma-so'z takrorlanmaydi — T-048)
  const RECAP = [
    { uz: "Bu darsda holat roadmap'dagi ish o'z ufqiga qarab qayerda ekanini aytadi; yonida — bir qator sabab.", ru: 'На этом уроке статус говорит, где работа из roadmap относительно своего горизонта; рядом — причина в одну строку.' },
    { uz: "Roadmap'dagi ish bajarildi, kechikdi, olib tashlandi yoki uzoqroqda qoldi; roadmap'da yo'q ish — yangi qo'shildi.", ru: 'Работа из roadmap выполнена, опоздала, убрана или осталась дальше; работа, которой не было в roadmap, — добавлено новое.' },
    { uz: 'Roadmap keyin nima bajarilganini solishtirish uchun yoziladi.', ru: 'Roadmap пишут, чтобы потом сравнить, что выполнено.' },
    { uz: "Shaxsiy hisobot — o'z qarorlaringiz haqida uch savolga yozma javob.", ru: 'Личный отчёт — письменные ответы на три вопроса о ваших решениях.' },
    { uz: "Noto'g'ri chiqqan qaror yonida — uni ko'rsatgan dalil: son yoki yozuv.", ru: 'Рядом с неверным решением — довод, который его показал: число или запись.' }
  ];
  const r = refOl() || {};
  const ishlarOk = Array.isArray(r.ishlar) && r.ishlar.length > 0;
  const jN = javobSoni(r);
  const p6 = answers[6] && answers[6].st, p7 = answers[7] && answers[7].st;
  const boshlangan = !!((p6 && ((p6.ishlar || []).some(x => x.ok) || (p6.yangi || []).length || (p6.faza === 'yozish' && (p6.ishlar || []).length))) || (p7 && Object.values(p7.qoralama || {}).some(v => String(v || '').trim())) || jN > 0);
  const holat = isMentorL ? 'mentor'
    : ishlarOk && jN === 3 ? 'toliq'
      : ishlarOk ? 'faqatSol'
        : jN === 3 ? 'faqatHis'
          : boshlangan ? 'boshlangan' : 'bosh';
  const SARLAVHA = {
    toliq: { uz: <>Roadmap solishtirildi, <A>shaxsiy hisobotingiz tayyor.</A></>, ru: <>Roadmap сравнён, <A>ваш личный отчёт готов.</A></> },
    faqatSol: { uz: <>Roadmap solishtirildi — <A>hisobot hali tugamagan.</A></>, ru: <>Roadmap сравнён — <A>отчёт ещё не закончен.</A></> },
    faqatHis: { uz: <>Hisobot tayyor — <A>solishtirish hali tugamagan.</A></>, ru: <>Отчёт готов — <A>сравнение ещё не закончено.</A></> },
    boshlangan: { uz: <>Solishtirish hali tugamagan — <A>uyda tugating.</A></>, ru: <>Сравнение ещё не закончено — <A>закончите дома.</A></> },
    bosh: { uz: <>Roadmap hali solishtirilmagan — <A>uyda boshlang.</A></>, ru: <>Roadmap ещё не сравнён — <A>начните дома.</A></> },
    mentor: { uz: <>Mahsulotingiz <A>hozir qayerda?</A></>, ru: <>Где сейчас <A>ваш продукт?</A></> }
  };
  const kech = ishlarOk ? r.ishlar.some(x => x.holat === 'kechikdi') : null;
  const qolganlar = isMentorL ? [] : [
    !ishlarOk && tr({ uz: "roadmap'dagi ishlarga holat va sabab qo'ying", ru: 'поставьте работам из roadmap статус и причину' }),
    jN < 3 && tr({ uz: "shaxsiy hisobotning qolgan savoliga javob yozing", ru: 'напишите ответ на оставшийся вопрос личного отчёта' })
  ].filter(Boolean);
  const qolgan = qolganlar.length ? <>{tr({ uz: 'Darsda qolgan qismni tugating', ru: 'Закончите часть, оставшуюся на уроке' })}: {qolganlar.join(' · ')}.</> : null;
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: barqarorlashtirish»</b></>, ru: <>Следующий урок — <b>«День проекта: стабилизация»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('hd-yakun', holat !== 'toliq' && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={<>{tr(SARLAVHA[holat])}{!isMentorL && r.roadmapManba === 'qayta-yozilgan' && <span className="hd-yakun-kul">{tr({ uz: 'Roadmap qayta yozilgan — asl nusxa topilmadi.', ru: 'Roadmap записан заново — исходник не найден.' })}</span>}</>}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard kech={kech} qolgan={qolgan} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(t => ({ ...t, t: tr(t.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: holat === 'toliq' && !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmReflectionLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === «HOLAT DOSKASI» — darsning bitta vizuali (hd-): faqat qolip tokenlari (D3), emoji yo'q (D4), rangli yon chiziq yo'q, qizil holat yo'q === */
        .hd-mj { color: ${MAYDON_RANG}; font-weight: 800; white-space: nowrap; }
        p.hd-kul, span.hd-kul { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .hd-kul-y { display: block; font-style: normal; font-size: 11.5px; font-weight: 600; color: ${T.ink2}; }
        p.hd-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.hd-izoh-q { margin: 0; padding: 7px 12px; border-radius: 10px; background: ${T.okFon}; color: ${T.ok}; font-size: 13px; font-weight: 600; line-height: 1.4; }
        .hd-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: ${T.accent}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 4px 10px; white-space: nowrap; max-width: 240px; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); animation: hd-uch 0.95s cubic-bezier(.4,0,.2,1) forwards; }
        .hd-uch.ok { color: ${T.ok}; border-color: ${T.ok}; }
        @keyframes hd-uch { 0% { transform: translate(0,0); opacity: 0; } 12% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)); opacity: 0; } }
        .hd-tx { display: block; margin-bottom: 5px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .hd-tx b { color: ${T.ink}; } .hd-tx.ok, .hd-tx.ok b { color: ${T.ok}; } .hd-tx b.yoq { color: ${T.err}; }
        .q-xulosa .hd-x-m { display: block; }
        .q-xulosa .hd-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.2)}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .hd-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 8px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .hd-bashq-t b { color: ${T.accent}; }
        /* kirish: variantlar — har birining o'z yengil chegarasi, navbat bilan 2 marta (E 40); maket ustuni aniq px (P2, P5) */
        @media (min-width: 761px) { .hd-k .q-split { grid-template-columns: 470px minmax(0, 1fr); gap: 28px; } }
        .hd-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: hd-chorla-v 1.8s ease-out .5s 2; }
        .hd-k.kutish .q-variant:nth-child(2) { animation-delay: .8s; } .hd-k.kutish .q-variant:nth-child(3) { animation-delay: 1.1s; }
        @keyframes hd-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.3)}; } 70% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 7px ${fon(T.accent, 0)}; } 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0)}; } }
        @keyframes hd-halqa { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        /* doska */
        .hd { display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 12px; border-radius: 14px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .hd-yorliq { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .hd-ustunlar { position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 8px; overflow: hidden; }
        .hd-ustun { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .hd-ustun-h { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; font-weight: 800; letter-spacing: .02em; color: ${T.ink2}; text-transform: uppercase; }
        .hd-karta { position: relative; display: flex; flex-direction: column; gap: 3px; align-items: flex-start; text-align: left; min-width: 0; width: 100%; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-family: 'Manrope', sans-serif; color: ${T.ink}; animation: fade-in-up .35s ease-out both; animation-delay: calc(var(--i, 0) * 60ms); transition: border-color .3s, background .3s; }
        button.hd-karta { cursor: pointer; padding-right: 26px; } button.hd-karta:hover { border-color: ${T.accent}; }
        .hd-nom { font-size: 12.5px; font-weight: 700; line-height: 1.3; overflow-wrap: anywhere; }
        .hd-holat { display: inline-block; padding: 1px 8px; border-radius: 99px; font-size: 11px; font-weight: 800; background: ${T.line}; color: ${T.ink2}; animation: hd-tush .45s cubic-bezier(.3,1.4,.5,1) both; }
        .hd-holat.bosh { animation: none; background: transparent; border: 1px dashed ${T.line}; color: ${T.ink2}; }
        @keyframes hd-tush { from { transform: translateY(-8px); opacity: 0; } }
        .hd-sabab { font-size: 11px; line-height: 1.35; color: ${T.ink2}; overflow-wrap: anywhere; }
        .hd-tahrir { position: absolute; top: 6px; right: 8px; font-size: 12px; color: ${T.accent}; }
        .hd-karta.h-bajarildi { border-color: ${fon(T.ok, 0.55)}; } .hd-karta.h-bajarildi .hd-holat { background: ${T.okFon}; color: ${T.ok}; }
        .hd-karta.h-bajarildi .hd-holat::before { content: '✓ '; }
        .hd-karta.h-kechikdi { border-color: ${T.accent}; } .hd-karta.h-kechikdi .hd-holat { background: ${T.accentSoft}; color: ${T.accent}; }
        .hd-karta.h-olib-tashlandi .hd-nom { text-decoration: line-through; color: ${T.ink2}; } .hd-karta.h-olib-tashlandi .hd-holat { color: ${T.ink2}; }
        .hd-karta.h-uzoqroqda .hd-holat { color: ${T.ink2}; }
        .hd-karta.h-yangi { background: ${T.accentSoft}; border-color: ${fon(T.accent, 0.3)}; } .hd-karta.h-yangi .hd-holat { background: ${T.paper}; color: ${T.accent}; }
        .hd-karta.joriy { border-color: ${T.accent}; animation: hd-halqa 1.8s ease-out .3s 3; }
        .hd-karta.xato { background: ${T.errFon}; }
        .hd-ustun-iz { font-size: 11px; line-height: 1.35; color: ${T.ink2}; }
        .hd-skan { position: absolute; top: 0; bottom: 0; left: 0; width: 34%; background: linear-gradient(90deg, transparent, ${fon(T.ink2, 0.14)}, transparent); pointer-events: none; animation: hd-skan 1.6s ease-in-out .2s both; }
        @keyframes hd-skan { from { transform: translateX(-100%); } to { transform: translateX(300%); opacity: 0; } }
        .hd-yangi { display: flex; flex-direction: column; gap: 6px; padding-top: 8px; border-top: 1px solid ${T.line}; }
        .hd-yangi-iz { font-style: normal; font-weight: 600; text-transform: none; letter-spacing: 0; color: ${T.ink2}; }
        .hd-yangi-q { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 6px; }
        .hd-bosh-q { display: block; height: 30px; border-radius: 10px; border: 1.5px dashed ${T.line}; }
        .hd.sakra .hd-holat.bosh { animation: hd-sakra .5s ease-out both; animation-delay: calc(var(--i, 0) * 100ms); }
        .hd.sakra .hd-bosh-q { animation: hd-yon 1s ease-out .6s 1; }
        @keyframes hd-sakra { 50% { transform: translateY(-5px); border-color: ${T.accent}; color: ${T.accent}; } }
        @keyframes hd-yon { 50% { border-color: ${T.accent}; } }
        .hd.yonish .hd-holat { animation: hd-yonish .9s ease-out both; animation-delay: calc(var(--i, 0) * 120ms + .2s); }
        @keyframes hd-yonish { 40% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.25)}; } }
        .hd-kichik { padding: 9px; gap: 6px; } .hd-kichik .hd-karta { padding: 6px 7px; } .hd-kichik .hd-nom { font-size: 11px; } .hd-kichik .hd-holat { font-size: 10px; } .hd-kichik .hd-ustun-h { font-size: 10px; } .hd-kichik .hd-sabab { display: none; } .hd-kichik .hd-bosh-q { height: 22px; } .hd-kichik .hd-yangi-q { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); }
        .hd-orta .hd-sabab { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .hd-toliq .hd-karta, .hd-orta .hd-karta { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 8px; row-gap: 2px; }
        .hd-toliq .hd-sabab, .hd-orta .hd-sabab { flex-basis: 100%; }
        .hd-s2 .q-bashorat .q-chip:not(:disabled), .hd-s4 .q-bashorat .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: hd-halqa 1.8s ease-out .4s 2; }
        .hd-s2 .q-bashorat .q-chip:nth-child(2), .hd-s4 .q-bashorat .q-chip:nth-child(2) { animation-delay: .7s; } .hd-s2 .q-bashorat .q-chip:nth-child(3), .hd-s4 .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        /* hisobot varag'i */
        .hd-varaq { display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
        .hd-varaq-s { font-size: 14px; font-weight: 800; color: ${T.ink}; padding-right: 30px; }
        .hd-vq { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 8px; align-items: start; padding: 6px 0; border-top: 1px solid ${T.line}; }
        .hd-vq.joriy .hd-vq-n { background: ${T.accent}; color: #fff; }
        .hd-vq-n { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 800; background: ${T.line}; color: ${T.ink2}; }
        .hd-vq.tola .hd-vq-n { background: ${T.okFon}; color: ${T.ok}; }
        .hd-vq-b { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .hd-vq-s { font-size: 12px; color: ${T.ink2}; line-height: 1.35; }
        .hd-vq-j { font-size: 13px; font-weight: 600; color: ${T.ink}; line-height: 1.4; overflow-wrap: anywhere; animation: fade-in-up .4s ease-out both; }
        .hd-vq-t { border: none; background: transparent; color: ${T.accent}; font-size: 14px; cursor: pointer; padding: 2px 6px; }
        .hd-varaq.kichik { padding: 10px 12px; gap: 4px; } .hd-varaq.kichik .hd-varaq-s { font-size: 12.5px; } .hd-varaq.kichik .hd-vq-j { font-size: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } .hd-varaq.kichik .hd-vq-s { display: none; } .hd-varaq.kichik .hd-bosh-q { height: 20px; }
        .hd-varaq.yonma { flex-direction: row; align-items: center; gap: 10px; } .hd-varaq.yonma .hd-varaq-s { padding-right: 0; white-space: nowrap; } .hd-varaq.yonma .hd-vq { flex: 1; border-top: none; padding: 0; grid-template-columns: 22px minmax(0, 1fr); }
        .hd-dalil-q { display: block; margin-top: 4px; padding: 3px 8px; border-radius: 8px; background: ${T.okFon}; color: ${T.ok}; font-size: 12px; font-weight: 700; }
        /* telefon (SABOQ 22: ≈170×272, chapda, o'lchami barqaror) */
        .hd-telj { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .hd-karta-n { font-size: 11.5px; color: ${T.ink2}; } .hd-karta-n b { color: ${T.accent}; }
        .hd-tel { width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 8px 10px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .hd-tel.qora { background: ${T.ink}; }
        .hd-tel-ich { flex: 1; min-height: 0; display: flex; flex-direction: column; animation: fade-in-up .35s ease-out both; }
        .hd-tel-bar { display: flex; align-items: center; justify-content: space-between; gap: 6px; height: 24px; flex: none; padding: 0 4px 6px; border-bottom: 1px solid ${T.line}; font-size: 12px; }
        .hd-ulangan { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: ${T.ok}; } .hd-ulangan i { width: 6px; height: 6px; border-radius: 50%; background: ${T.ok}; }
        .hd-ilova { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 8px; }
        .hd-ilova-y { font-size: 10.5px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: .06em; }
        .hd-oyin { display: flex; flex-direction: column; gap: 3px; padding: 9px 10px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.bg}; font-size: 11px; color: ${T.ink2}; transition: background .4s; }
        .hd-oyin b { color: ${T.ink}; } .hd-oyin.yonib { background: ${T.okFon}; }
        .hd-son { display: inline-block; white-space: nowrap; animation: hd-tush .4s ease-out both; }
        .hd-tel-tg { align-self: flex-start; margin-top: 5px; padding: 5px 10px; border-radius: 8px; background: ${T.accent}; color: #fff; font-size: 10.5px; font-weight: 800; white-space: nowrap; }
        .hd-tel-tg.bosildi { transform: translateY(1px); opacity: .7; } .hd-tel-tg.ok { background: ${T.ok}; } .hd-tel-tg.ikki { background: ${T.paper}; color: ${T.accent}; border: 1.5px solid ${T.accent}; }
        .hd-kul, .hd-yoq { font-size: 10.5px; }
        .hd-yoq { align-self: center; margin-top: 10px; padding: 4px 10px; border-radius: 8px; border: 1px dashed ${T.line}; color: ${T.ink2}; font-weight: 700; }
        .hd-qulf { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; padding-top: 22px; color: #fff; }
        .hd-qulf-v { font-size: 30px; font-weight: 300; letter-spacing: .02em; }
        .hd-bildir { width: 100%; display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 12px; background: rgba(255,255,255,0.9); color: ${T.ink}; font-size: 10.5px; }
        .hd-brauzer { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .hd-br-bar { display: flex; align-items: center; gap: 4px; padding: 4px 6px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .hd-br-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.line}; flex: none; } .hd-br-bar span { flex: 1; height: 8px; margin-left: 4px; border-radius: 99px; background: ${T.paper}; }
        .hd-lend-s { font-size: 12.5px; line-height: 1.3; color: ${T.ink}; padding: 4px 2px; }
        .hd-lend-kod { align-self: flex-start; padding: 4px 8px; border-radius: 8px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 10.5px; font-weight: 800; white-space: nowrap; }
        .hd-pay { flex: 1; display: flex; flex-direction: column; gap: 5px; padding-top: 10px; font-size: 12px; color: ${T.ink}; }
        .hd-pay-n { font-size: 13px; font-weight: 800; white-space: nowrap; }
        .hd-test { margin-top: auto; font-size: 10px; color: ${T.ink2}; }
        .hd-chat { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 10px; }
        .hd-pf { align-self: flex-start; max-width: 94%; padding: 6px 8px; border-radius: 10px; border-bottom-left-radius: 3px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 10.5px; line-height: 1.38; }
        /* joylashuv */
        .hd-ikki { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 18px; align-items: start; }
        .hd-ikki.kichik { grid-template-columns: 170px minmax(0, 1fr); gap: 12px; }
        .hd-ikki.s6 { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); }
        .hd-ikki.s7 { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); }
        .hd-s6 .q-mustaqil, .hd-s7 .q-mustaqil { max-width: none; }
        @media (min-width: 1200px) { .hd-ikki.s6, .hd-ikki.s7 { column-gap: 54px; } }
        .hd-o { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .hd-fokus { animation: fade-in-up .5s ease-out both; }
        .hd-r { display: contents; } .hd-hw { position: relative; }
        .hd-r-chap { display: flex; flex-direction: column; gap: 10px; }
        .hd-tugmalar { display: flex; flex-wrap: wrap; gap: 6px; }
        .hd-tugmalar .hd-ht:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; }
        .hd-tugmalar.chorla .hd-ht:not(:disabled) { animation: hd-halqa 1.8s ease-out .4s 2; }
        .hd-tugmalar.chorla .hd-ht:nth-child(2) { animation-delay: .7s; } .hd-tugmalar.chorla .hd-ht:nth-child(3) { animation-delay: 1s; } .hd-tugmalar.chorla .hd-ht:nth-child(4) { animation-delay: 1.3s; } .hd-tugmalar.chorla .hd-ht:nth-child(5) { animation-delay: 1.6s; }
        .hd-ht.silk { animation: hd-silk .4s ease-in-out; }
        @keyframes hd-silk { 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .hd-ht.on.h-bajarildi { background: ${T.okFon}; color: ${T.ok}; border-color: ${T.ok}; }
        .hd-chorla-t { animation: hd-halqa 1.8s ease-out .3s 3; }
        .hd-davom.chorla:not(:disabled) { animation: hd-halqa 1.8s ease-out .3s 3; }
        /* testlardan keyingi kichik vizual */
        .hd-tviz { margin-top: 12px; max-width: 460px; }
        .hd-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .hd-ustoz b { color: ${T.ink}; }
        .hd-ovoz { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .hd-ovoz-q { display: grid; grid-template-columns: minmax(0,1fr) 90px 26px; gap: 8px; align-items: center; font-size: 12.5px; color: ${T.ink}; }
        .hd-ovoz-q.men { font-weight: 800; color: ${T.accent}; }
        .hd-ovoz-y { height: 8px; border-radius: 999px; background: ${T.line}; overflow: hidden; }
        .hd-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width .6s ease; }
        @media (prefers-reduced-motion: reduce) { .hd-ovoz-y i { transition: none; } }
        @media (max-width: 760px) { .hd-r .q-yorliq { padding-right: 46px; } }
        @media (min-width: 761px) { .hd-s2 .q-tushuncha { gap: 12px; } .hd-s2 .q-bashorat { padding-top: 11px; padding-bottom: 11px; gap: 6px; } .hd-s2 .hd-bosh-q { height: 22px; } }
        .hd-mini { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .hd-mini-s { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .hd-mini-y { border-top: none; padding-top: 0; }
        .hd-karta.tush { animation: hd-tushK .7s cubic-bezier(.3,1.3,.5,1) .2s both; }
        @keyframes hd-tushK { from { transform: translateY(-26px); opacity: 0; } }
        /* Tesla sahnasi */
        .hd-s4 .q-voqea { text-align: left; } .hd-voqea { width: 100%; } .hd-voqea .zoomable { width: 100%; }
        .hd-voqea { display: flex; flex-direction: column; gap: 12px; }
        p.hd-brend { margin: 0; font-size: 14px; color: ${T.ink}; }
        .hd-nuqtalar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12.5px; color: ${T.ink2}; }
        .hd-nq { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; } .hd-nq.on { background: ${T.accent}; }
        .hd-kadr-n { font-weight: 700; color: ${T.ink}; }
        .hd-tesla { position: relative; display: flex; flex-direction: column; gap: 10px; }
        .hd-ochiq { align-self: flex-start; padding: 3px 10px; border-radius: 99px; background: ${T.line}; color: ${T.ink2}; font-size: 12px; font-weight: 700; }
        .hd-brauzer.keng { padding: 10px 12px 12px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.ink}; gap: 8px; }
        .hd-tesla-s { font-size: 15px; color: ${T.ink}; }
        .hd-tq { position: relative; display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; align-items: center; gap: 10px; min-height: 38px; padding: 6px 10px; border-radius: 10px; background: ${T.bg}; }
        .hd-tq.ochiq { animation: fade-in-up .45s ease-out both; animation-delay: calc(var(--i) * 450ms); }
        .hd-tq-n { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; font-weight: 800; }
        .hd-tq-t { font-size: 13px; font-weight: 600; color: ${T.ink}; }
        .hd-tq-m { display: flex; align-items: flex-end; gap: 3px; }
        .hd-mash { width: 54px; height: 22px; } .hd-mash.kichik { width: 30px; height: 13px; }
        .hd-mash.sport { fill: ${TESLA_RANG}; } .hd-mash.oddiy { fill: ${T.ink2}; }
        .hd-tanga { position: absolute; right: 40px; bottom: -9px; width: 14px; height: 14px; border-radius: 50%; background: #E8A13A; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.12); animation: hd-tanga 1.4s ease-in-out both; animation-delay: calc(var(--i) * 450ms + 500ms); z-index: 2; }
        @keyframes hd-tanga { from { transform: translateY(-14px); opacity: 0; } 30% { opacity: 1; } to { transform: translateY(14px); opacity: 0; } }
        .hd-vaqt { display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .hd-vaqt-ch { flex: 1; display: flex; justify-content: space-around; align-items: center; height: 2px; background: ${T.line}; }
        .hd-vaqt-ch b { width: 10px; height: 10px; border-radius: 50%; background: ${T.paper}; border: 2px solid ${T.ink2}; animation: fade-in-up .4s ease-out both; animation-delay: calc(var(--i) * 300ms + 200ms); }
        /* mustaqil ish: bitta katta karta */
        .hd-mk { display: flex; flex-direction: column; gap: 9px; min-width: 0; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.35)}; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.35); }
        .hd-mk-n { font-size: 11.5px; font-weight: 800; color: ${T.accent}; text-transform: uppercase; letter-spacing: .05em; }
        .hd-mk-nom { font-size: 16px; line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; }
        .hd-inp { width: 100%; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.5)}; border-radius: 10px; padding: 10px 12px; outline: none; }
        .hd-inp:focus { border-color: ${T.accent}; } .hd-inp.err { background: ${T.errFon}; border-color: ${fon(T.err, 0.6)}; } .hd-inp.tola { border-color: ${T.line}; }
        .hd-inp.chorla { animation: hd-halqa 1.8s ease-out .5s 2; }
        .hd-ta { resize: vertical; min-height: 78px; line-height: 1.45; }
        .hd-mk-t { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .hd-taklif, .hd-mj-och, .hd-yordam-t { align-self: flex-start; color: ${T.ink2}; }
        .hd-yordam { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .hd-yordam-m { display: flex; flex-direction: column; gap: 6px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .hd-strip { display: inline-flex; align-self: flex-start; padding: 5px 12px; border-radius: 99px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .hd-strip b { color: ${T.ink}; white-space: nowrap; }
        .hd-s7-ust { display: flex; flex-direction: column; gap: 8px; }
        .hd-s7-ch { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .hd-qism { display: flex; flex-wrap: wrap; gap: 6px; }
        .hd-qism-c { padding: 4px 11px; border-radius: 99px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .hd-qism-c.on { border-color: ${T.accent}; color: ${T.accent}; } .hd-qism-c.ok { background: ${T.okFon}; color: ${T.ok}; border-color: transparent; }
        .hd-mj-karta { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 14px; background: ${T.bg}; border: 1px solid ${T.line}; }
        p.hd-mj-j { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; font-style: italic; }
        p.hd-mj-j .hd-kul-y { margin-top: 4px; }
        .hd-dalillar { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
        .hd-dalil { text-align: left; white-space: normal; font-size: 12.5px; padding: 6px 11px; } .hd-dalil.ishl { opacity: .55; }
        /* yakun */
        .hd-yakun.belgisiz .done-chip .tick { display: none; }
        .hd-yakun-kul { display: block; margin-top: 6px; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0; color: ${T.ink2}; }
        .hd-hw-karta { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-bottom: 10px; }
        .hd-hw-q { display: inline-flex; gap: 6px; font-size: 13px; } .hd-hw-k { color: ${T.ink2}; } .hd-hw-v { font-weight: 700; color: ${T.ink}; }
        .hd-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .hd-hw-qadam li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .hd-hw-qadam i { font-style: normal; color: ${T.accent}; font-weight: 800; }
        .hd-hw-keyingi { display: block; margin-top: 10px; font-size: 13px; color: ${T.ink2}; }
        /* ⛶ oynasi (E 48, SABOQ 38) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(980px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 760px) {
          .hd-ikki, .hd-ikki.kichik, .hd-ikki.s6, .hd-ikki.s7 { grid-template-columns: 1fr; justify-items: stretch; }
          .hd-telj { align-self: center; }
          .hd-ustunlar { grid-template-columns: 1fr; }
          .hd-kichik .hd-ustunlar { grid-template-columns: repeat(var(--n), minmax(0, 1fr)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hd-uch, .hd-skan, .hd-tanga { display: none; }
          .hd-karta, .hd-holat, .hd-son, .hd-tel-ich, .hd-tq.ochiq, .hd-vaqt-ch b, .hd-vq-j, .hd-fokus, .hd-karta.tush, .hd.sakra .hd-holat.bosh, .hd.sakra .hd-bosh-q, .hd.yonish .hd-holat, .hd-karta.joriy, .hd-tugmalar.chorla .hd-ht, .hd-chorla-t, .hd-davom.chorla, .hd-inp.chorla, .hd-k.kutish .q-variant, .hd-ht.silk, .hd-s2 .q-bashorat .q-chip, .hd-s4 .q-bashorat .q-chip { animation: none !important; }
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
