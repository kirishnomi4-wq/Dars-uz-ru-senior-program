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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QKartochka, QYakun, QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d5-v1', lessonTitle: { uz: "Guruh pitchingizda nimani tuzatishni aytadi?", ru: 'Что группа советует исправить в вашем питче?' } }; // 14-Modul 5-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/05-PmPitchTraining-v3.md
// 12 ekran (keyssiz PM shakli — tayanch 4): kirish → reja → Mentor varag'i → 1-savol → tuzatishlar ro'yxati → 2-savol → guruhda pitch → tuzatishlaringiz → yakuniy savol → podium → kartochkalar → yakun.
// Bitta vizual — GuruhVaraqSahna (guruh · taymer chizig'i · baholash varag'i · tuzatishlar ro'yxati). Saqlaydi: pm-m12d5-varaq (tayanch 8); o'qiydi: pm-m12d1-pitch, pm-m12d2-hikoya.
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: 'питч' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'tuzatish', ru: 'исправление' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'taymer', ru: 'таймер' }, l: 22, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'varaq', ru: 'лист' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'varaq', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'tuzatish', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'guruh', type: 'practice',  template: 'custom',   scored: false, scope: null },
  { id: 'royxat', type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 'yakun', type: 'summary',   template: 'custom',   scored: false, scope: null }
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
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' gv-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s3/s5/s8 — ballik testlar (✔ C · A · D — MD). Qolgani — -1 sentinel (ballsiz ekranlar, praktika signali 500+).
// MD KOD 12 «varaq/tuzatish/guruh/royxat: -1» — jsx-lint «o'lik kalit» deb rad etadi (submitAnswer ularni ishlatmaydi); praktika signali — 'practice' (500+).
const INLINE_KEYS = { s3: 2, s5: 0, s8: 3, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida emoji o'rniga raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Izoh nima haqida', ru: 'О чём замечание' },
    cards: [
      { ic: '1', h: { uz: "✗ yonidagi izoh bo'lak haqida yoziladi.", ru: 'Замечание рядом с ✗ пишут о части.' } },
      { ic: '2', h: { uz: 'Unda nima yetishmagani aytiladi: kim, son yoki manba.', ru: 'В нём сказано, чего не хватило: кто, число или источник.' } },
      { ic: '3', h: { uz: "Odam haqidagi gap va «qiziq emas» kabi fikr — izoh emas.", ru: 'Слова о человеке и мнение вроде «неинтересно» — не замечание.' }, ask: { uz: 'Mentor pitchiga yozilgan ikki izoh nima haqida edi?', ru: 'О чём были два замечания к питчу Ментора?' } }
    ]
  },
  5: {
    title: { uz: 'Aniq tuzatish', ru: 'Точное исправление' },
    cards: [
      { ic: '1', h: { uz: 'Tuzatish izohga javob beradi.', ru: 'Исправление отвечает на замечание.' } },
      { ic: '2', h: { uz: "Unda qaysi bo'lak va nima o'zgarishi yoziladi.", ru: 'В нём написано, какая часть и что изменится.' } },
      { ic: '3', h: { uz: "To'qilgan son va va'da qo'shilmaydi, bo'lak olib tashlanmaydi.", ru: 'Не добавляют выдуманное число и обещание, часть не убирают.' }, ask: { uz: '«Keyingi safar yaxshiroq aytaman» — bunda nima yetishmaydi?', ru: '«В следующий раз скажу лучше» — чего здесь не хватает?' } }
    ]
  },
  8: {
    title: { uz: "✗ olgan bo'lak", ru: 'Часть с ✗' },
    cards: [
      { ic: '1', h: { uz: '✗ va izoh — tuzatish uchun material.', ru: '✗ и замечание — материал для исправления.' } },
      { ic: '2', h: { uz: "Izohni o'qib, shu bo'lakka tuzatish yoziladi.", ru: 'Прочитав замечание, пишут исправление к этой части.' } },
      { ic: '3', h: { uz: "Belgi o'chirilmaydi, tinglovchi ko'ndirilmaydi.", ru: 'Знак не стирают, слушателя не уговаривают.' }, ask: { uz: '✗ olganingizda birinchi nima qilasiz?', ru: 'Что вы сделаете первым, получив ✗?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="gv-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — GuruhVaraqSahna: guruh (gapiruvchi pufagi + «Tinglovchilar» rol kartasi — SABOQ P1, odam figurasi yo'q) · taymer chizig'i · baholash varag'i · tuzatishlar ro'yxati =====
// qolip-maket: gv-var gv-rejim gv-bt gv-tahrir gv-bolak-t gv-tanla gv-navbat
const NB = String.fromCharCode(160);
const cxx = (...a) => a.filter(Boolean).join(' ');
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const MJ = () => <span className="gv-mj">Maydon Jamoa</span>;
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mss = (s) => Math.floor(Math.max(0, s) / 60) + ':' + String(Math.max(0, s) % 60).padStart(2, '0');

// --- Saqlash kalitlari (tayanch 8): o'qiydi pm-m12d1-pitch, pm-m12d2-hikoya · yozadi pm-m12d5-varaq ---
const PITCH_KEY = 'pm-m12d1-pitch';
const HIKOYA_KEY = 'pm-m12d2-hikoya';
const VARAQ_KEY = 'pm-m12d5-varaq';

// --- Bitta manbalar (P-063) ---
const BOLAK_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi'];
const BOLAK_NOM = {
  muammo: { uz: 'Muammo', ru: 'Проблема' }, bozor: { uz: 'Bozor', ru: 'Рынок' }, yechim: { uz: 'Yechim', ru: 'Решение' },
  raqamlar: { uz: 'Raqamlar', ru: 'Цифры' }, jamoa: { uz: 'Jamoa', ru: 'Команда' }, keyingi: { uz: 'Keyingi qadam', ru: 'Следующий шаг' }
};
const VAQT = [40, 30, 90, 60, 30, 50]; // tayanch 9.1 — bu mashqda, jami 5:00
const JAMI = 300;
const BOSH_SEK = VAQT.map((_, i) => VAQT.slice(0, i).reduce((a, v) => a + v, 0));
// Mentor pitchi — tayanch 1.1 aynan (9.2; 1-dars bilan bir manba)
const JAMOA_PITCH = {
  muammo: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'Игрокам трудно собрать людей в команду. У 4 из 5 игроков, которых я спросил, на последней игре не хватило людей или кто-то не пришёл.' },
  bozor: { uz: "Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.", ru: 'В футбольной группе махалли — 60 человек; в приложении — 6 организаторов. Другие махалли мы ещё не проверяли.' },
  yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются в одно нажатие и в день игры подтверждают, что придут.' },
  raqamlar: { uz: "51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.", ru: '51 пользователь; 11 — мои одноклассники, 7 пришли по ссылке-приглашению. 3 организатора дали письменное подтверждение на Pro — это ещё не оплата.' },
  jamoa: { uz: "Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.", ru: 'Я — идея, продукт и код (с агентом). Попробовали — 6 организаторов и игроки.' },
  keyingi: { uz: 'Uch tashkilotchi bilan "Doimiy o\'yin"ni test rejimda sinayman. Sizdan bitta so\'rov: mahalladagi maydon egalari bilan tanishtiring.', ru: 'С тремя организаторами проверю «Постоянную игру» в тестовом режиме. Одна просьба к вам: познакомьте с владельцами площадок в махалле.' }
};
// 2-dars qarori (05-FILTR TS7): aytilganda Muammo lahza bilan ochiladi — 2-dars MD dagi lahza gapi aynan
const LAHZA = { uz: "Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.", ru: 'Суббота, 18:00. На поле 8 человек, ещё 2 не пришли — игра не состоялась.' };
// Hakam savollari — tayanch 9.3 aynan (1-dars bilan bir)
const HAKAM_SAVOL = {
  muammo: { uz: 'Bu muammo borligini qayerdan bilasiz?', ru: 'Откуда вы знаете, что эта проблема есть?' },
  bozor: { uz: 'Bu mahsulot yana qancha odamga kerak?', ru: 'Скольким ещё людям нужен этот продукт?' },
  yechim: { uz: 'Mahsulot nima qiladi?', ru: 'Что делает продукт?' },
  raqamlar: { uz: 'Bu son qayerdan va nimani sanaydi?', ru: 'Откуда это число и что оно считает?' },
  jamoa: { uz: 'Buni kim qilyapti?', ru: 'Кто это делает?' },
  keyingi: { uz: 'Endi nima qilasiz?', ru: 'Что будете делать дальше?' }
};
// Mentor varag'i — tayanch 1.5 aynan (✓ qatorlarida izoh yo'q)
const MENTOR_VARAQ = [
  { bolak: 'muammo', belgi: '✓', izoh: null },
  { bolak: 'bozor', belgi: '✗', izoh: { uz: "60 kishi kim — o'yinchimi, guruhmi?", ru: '60 человек — кто это: игроки или группа?' } },
  { bolak: 'yechim', belgi: '✓', izoh: null },
  { bolak: 'raqamlar', belgi: '✗', izoh: { uz: "tasdiq — to'lovmi?", ru: 'подтверждение — это оплата?' } },
  { bolak: 'jamoa', belgi: '✓', izoh: null },
  { bolak: 'keyingi', belgi: '✓', izoh: null }
];
const MENTOR_HAKAM_SAVOL = { uz: "Nega maydon egalari bunga pul to'lamaydi?", ru: 'Почему владельцы площадок за это не платят?' };
// Mentorning tuzatishlar ro'yxati — MD A-6 (tayanch 9.53)
const MENTOR_TUZATISH = [
  { bolak: 'bozor', manba: 'x', nima: { uz: "60 kim ekanini aytaman: mahalla futbol guruhi a'zolari", ru: 'Скажу, кто эти 60: участники футбольной группы махалли' } },
  { bolak: 'raqamlar', manba: 'x', nima: { uz: 'Tasdiq nima ekanini aytaman: yozma javob, pul emas', ru: 'Скажу, что такое подтверждение: письменный ответ, не деньги' } },
  { bolak: 'keyingi', manba: 'savol', nima: { uz: "Ular to'lovchi emas — faqat tanishtirish so'rayman", ru: 'Они не плательщики — прошу только познакомить' } }
];
// Varaqda ✗ tushganda pufakda qaytadigan gap va undagi izoh so'zi
const AJRAT_SOZ = {
  bozor: { gap: 0, soz: { uz: '60 kishi', ru: '60 человек' } },
  raqamlar: { gap: 1, soz: { uz: 'tasdiq', ru: 'подтверждение' } },
  keyingi: { gap: 1, soz: { uz: 'maydon egalari', ru: 'владельцами площадок' } }
};
const gaplar = (s) => (String(s || '').match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || []).map(g => g.trim()).filter(Boolean);
const birinchiGap = (s) => gaplar(s)[0] || '';
const Ajrat = ({ matn, soz }) => {
  const i = soz ? matn.indexOf(soz) : -1;
  return i < 0 ? <>{matn}</> : <>{matn.slice(0, i)}<b className="gv-ajrat">{soz}</b>{matn.slice(i + soz.length)}</>;
};
const SCREEN_INTENTS = [
  'kirish: guruhning qaysi gapi pitchni tuzatishga foyda beradi', 'reja: guruh varag\'idan tuzatish', 'Mentor varag\'i: ikki ✗, izohlar, hakam savoli',
  'test: izoh bo\'lak haqida', 'Mentor varag\'idan uch tuzatish', 'test: aniq tuzatish', 'guruhda pitch: taymer, varaq, hakam savoli; yakka rejim',
  'o\'z varag\'idan uch tuzatish', 'yakuniy test: ✗ olganda nima qilasiz', 'podium', 'kartochkalar', 'yakun: 4 holat'
];

// --- Matn tekshiruvi (6, 7-ekran): ikki tilli; apostrof shakllari normT bilan bir xil ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const PII_RE = /@|t\.me\/|\+998|(?:\d[\s-]?){9,}/;
const BAHO_RE = /(^|[^a-z'а-яё])(yomon|zerikarli|yoqmadi|скучн\S*|плох\S*|не понравил\S*)(?![a-z'а-яё])/;
const PUL_RE = /(^|[^a-z'а-яё])(investitsiya\S*|ulush\S*|summa\S*|инвестиц\S*|дол[яюеи]\S*|сумм\S*)(?![a-z'а-яё])/;
const VADA_RE = /(^|[^a-z'а-яё])(tez orada|albatta|yetamiz|aniq bo'ladi|скоро|обязательно|достигнем|точно будет)(?![a-z'а-яё])/;
const MAVHUM_RE = /(yaxshiroq|chiroyliroq|yaxshilayman|лучше|красивее|улучшу)/;
const TASHLA_RE = /(olib tashla|уберу|удалю)/;
// bloklaydi: belgisiz · ✗ izoh < 8 · telefon/akkaunt; yo'naltiradi (ikkinchi bosish bilan o'tadi): baho-so'z · oltita ✓
const tekshirIzoh = (belgi, izoh, hammaOk) => {
  const n = normT(izoh);
  if (!belgi) return { x: 'belgi', blok: true };
  if (belgi === '✗' && String(izoh || '').trim().length < 8) return { x: 'qisqa', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (BAHO_RE.test(n)) return { x: 'baho' };
  if (hammaOk) return { x: 'hammaok' };
  return null;
};
const tekshirSavol = (s) => {
  const n = normT(s);
  if (!n) return { x: 'bosh', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (PUL_RE.test(n)) return { x: 'pul' };
  return null;
};
const tekshirTuzatish = (bolak, matn, band) => {
  const n = normT(matn);
  if (!n) return { x: 'bosh', blok: true };
  if (!bolak) return { x: 'bolak', blok: true };
  if (PII_RE.test(n)) return { x: 'pii', blok: true };
  if (band) return { x: 'takror' };
  if (VADA_RE.test(n)) return { x: 'vada' };
  if (MAVHUM_RE.test(n) && n.length < 30) return { x: 'mavhum' };
  if (TASHLA_RE.test(n)) return { x: 'tashla' };
  return null;
};

// --- Yordamchi ilgaklar ---
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
// «Uchadi» — ko'rinib uchadi (SABOQ P3): o'lchab, position: fixed nusxa, ~0,6 s
const useUchish = () => {
  const [u, setU] = useState(null);
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  const uch = (fromEl, toEl, matn, tur, ms = 640) => new Promise(res => {
    if (kamHarakat() || !fromEl || !toEl) { res(); return; }
    const a = fromEl.getBoundingClientRect(), t = toEl.getBoundingClientRect();
    setU({ x: a.left, y: a.top, w: Math.min(a.width, 420), h: a.height, dx: t.left - a.left, dy: t.top + t.height / 2 - (a.top + a.height / 2), sx: Math.max(0.55, Math.min(1, t.width / Math.min(a.width, 420))), bor: false, matn, tur });
    requestAnimationFrame(() => requestAnimationFrame(() => setU(v => (v ? { ...v, bor: true } : v))));
    tRef.current.push(setTimeout(() => { setU(null); res(); }, ms));
  });
  const el = u && <div className={cxx('gv-uchar', u.tur, u.bor && 'bor')} aria-hidden="true" style={{ left: u.x, top: u.y, width: u.w, minHeight: u.h, transform: u.bor ? 'translate(' + u.dx + 'px,' + u.dy + 'px) scale(' + u.sx + ')' : 'none' }}>{u.matn}</div>;
  return [uch, el];
};
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="gv-xq-m">{matn}</span>
  {izoh && <span className="gv-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="gv-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="gv-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);
const IPUCHA = (t) => <p className="gv-ipucha fade-step">{t}</p>;

// --- Telefon: «Maydon Jamoa» (≈90×146, faqat Mentor misolida — Yechimda «8 / 10» → «9 / 10») ---
const JamoaTelefon = ({ son = 8 }) => (
  <div className="gv-tel" aria-hidden="true">
    <div className="gv-tel-e">
      <span className="gv-tel-nom"><MJ /></span>
      <b className="gv-tel-vaqt">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
      <span className="gv-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
      <b key={son} className={cxx('gv-tel-son', son > 8 && 'yangi')}>{son}{NB}/{NB}10</b>
    </div>
  </div>
);
// --- Guruh: gapiruvchi — pufak (yorliq «gapiradi» / «siz»); tinglovchilar — bitta urg'uli rol kartasi, ko'p odam — doirachalar ---
const Doirachalar = ({ n = 3 }) => <span className="gv-doira" aria-hidden="true">{Array.from({ length: n }).map((_, i) => <i key={i} />)}</span>;
const Gapiruvchi = ({ yorliq, pufak, pufakKey, telefon, ostida, yozilmoqda }) => (
  <div className="gv-gap">
    <div className="gv-gap-o">
      <span className="gv-gap-y"><i aria-hidden="true" />{yorliq}{yozilmoqda && <em className="gv-yoz">{tr({ uz: 'yozilmoqda', ru: 'идёт запись' })}</em>}</span>
      {pufak !== undefined && <p key={pufakKey} className={cxx('gv-pufak', !pufak && 'bosh')}>{pufak || '…'}</p>}
      {ostida}
    </div>
    {telefon}
  </div>
);
const Tinglovchilar = ({ n = 3, pufaklar = [], yorliq, refS }) => (
  <div className="gv-tng">
    <span className="gv-tng-ava"><Doirachalar n={n} /></span>
    <div className="gv-tng-o">
      <div className="gv-tng-b"><b className="gv-tng-nom">{tr({ uz: 'Tinglovchilar', ru: 'Слушатели' })}</b><em className="gv-tng-y">{yorliq || tr({ uz: 'tinglaydi', ru: 'слушают' })}</em></div>
      {pufaklar.length > 0 && <div className="gv-tng-sl">
        {pufaklar.map((p, i) => (
          <span key={p.k ?? i} ref={p.ref ? refS : undefined} className={cxx('gv-tng-s', p.q && 'q', p.matn && 'matn')} style={{ animationDelay: (i * 0.1) + 's' }}>
            <i>{p.q ? '?' : '…'}</i>{p.matn && <span>{p.matn}</span>}
          </span>
        ))}
      </div>}
    </div>
  </div>
);
// --- Taymer chizig'i 0–5:00 (12-Modul TaymerChiziq naqshi, shu darsda yozildi — K-020); «savol-javob» bo'lagi yo'q (05-FILTR 25) ---
const TaymerChiziq = ({ sek = null, tolgan = null, joriy = null, xato = [], ok = [], halqa = null, yorliq, silliq = false, katta = false }) => {
  const oshdi = sek !== null && sek > JAMI ? sek - JAMI : 0;
  return (
    <div className={cxx('gv-tm', katta && 'katta')}>
      {yorliq && <span className="gv-tm-y">{yorliq}</span>}
      <div className="gv-tm-q">
        <div className="gv-tm-chiziq">
          {BOLAK_ID.map((id, i) => {
            const f = tolgan !== null ? (i < tolgan ? 1 : 0) : sek === null ? 0 : Math.max(0, Math.min(1, (sek - BOSH_SEK[i]) / VAQT[i]));
            return (
              <span key={id} className={cxx('gv-tm-bo', joriy === i && 'joriy', xato.includes(id) && 'xato', ok.includes(id) && 'ok', halqa === id && 'halqa')} style={{ flex: VAQT[i] }}>
                <span className="gv-tm-t"><i style={{ width: (f * 100) + '%', transition: silliq ? 'width .85s linear' : 'none' }} /></span>
                <em>{tr(BOLAK_NOM[id])}</em>
              </span>
            );
          })}
        </div>
        {oshdi > 0 && <span className="gv-tm-osh" style={{ flexBasis: Math.min(26, (oshdi / JAMI) * 100) + '%' }}><span className="gv-tm-t"><i /></span><em>+{mss(oshdi)}</em></span>}
      </div>
      <div className="gv-tm-chet"><span>0:00</span><span>5:00</span></div>
    </div>
  );
};
// --- Baholash varag'i (jadval — «ma'lumot» ko'rinishi, E 45): olti qator + hakam savoli + vaqt ---
// qatorlar: [{ id, belgi, izoh, holat: 'xira' | 'ajrat' | 'yangi', royxatda }] · hakam: { matn, yorliq, holat, royxatda }
const Varaq = ({ qatorlar, hakam, vaqt, ixcham = false, refQ, refHk }) => (
  <div className={cxx('gv-varaq', ixcham && 'ixcham')}>
    <div className="gv-v-h">{tr({ uz: "Baholash varag'i", ru: 'Оценочный лист' })} · {qatorlar.filter(q => q.belgi).length}{NB}/{NB}6</div>
    {qatorlar.map(q => (
      <div key={q.id} ref={refQ ? (el => { refQ.current[q.id] = el; }) : undefined} className={cxx('gv-v-q', q.holat)}>
        <span className="gv-v-nom"><b>{tr(BOLAK_NOM[q.id])}</b>{!ixcham && <small>{tr(HAKAM_SAVOL[q.id])}</small>}</span>
        <span key={q.belgi || 'bo'} className={cxx('gv-v-b', q.belgi === '✓' && 'ok', q.belgi === '✗' && 'x')}>{q.belgi || ''}</span>
        <span className="gv-v-iz">{q.izoh && <span key={q.izoh} className="gv-v-izm">{q.izoh}</span>}{q.royxatda && <em className="gv-v-r">{tr({ uz: "ro'yxatda", ru: 'в списке' })}</em>}</span>
      </div>
    ))}
    {hakam && <div ref={refHk} className={cxx('gv-v-hk', !hakam.matn && 'bosh', hakam.holat)}>
      <span className="gv-v-hk-y">{hakam.yorliq}</span>
      <span className="gv-v-hk-m">{hakam.matn || ''}</span>
      {hakam.royxatda && <em className="gv-v-r">{tr({ uz: "ro'yxatda", ru: 'в списке' })}</em>}
    </div>}
    {vaqt && <div className="gv-v-vaqt">{vaqt}</div>}
  </div>
);
// --- Tuzatishlar ro'yxati (4, 7-ekran): uch raqamli qator «bo'lak · nima o'zgaradi» ---
const Royxat = ({ bandlar, refR, yangi = null, onTahrir }) => (
  <div className="gv-royxat">
    <div className="gv-r-h">{tr({ uz: "Tuzatishlar ro'yxati", ru: 'Список исправлений' })} · {bandlar.filter(Boolean).length}{NB}/{NB}3</div>
    {[0, 1, 2].map(i => {
      const b = bandlar[i];
      return (
        <div key={i} ref={refR ? (el => { refR.current[i] = el; }) : undefined} className={cxx('gv-r-q', !b && 'bosh', yangi === i && 'yangi')}>
          <i>{i + 1}</i>
          <span className="gv-r-m">{b && <><b>{b.nom}</b> · {b.nima}</>}</span>
          {b && onTahrir && <button type="button" className="gv-tahrir" onClick={() => onTahrir(i)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
        </div>
      );
    })}
  </div>
);
const GuruhVaraqSahna = ({ yorliq, guruh, taymer, varaq, royxat, past, chapOstida, className }) => (
  <div className={cxx('gv-sahna-w', className)}>
    <div className={cxx('gv-sahna', !(guruh || taymer) && 'faqat-ong', !(varaq || royxat) && 'faqat-chap')}>
      {(guruh || taymer) && <div className="gv-sahna-ch">{yorliq && <span className="gv-sahna-y">{yorliq}</span>}{guruh}{taymer}{chapOstida}</div>}
      {(varaq || royxat) && <div className="gv-sahna-on">{varaq}{royxat}</div>}
    </div>
    {past && <div className="gv-sahna-past">{past}</div>}
  </div>
);
const mentorQatorlar = (fn) => MENTOR_VARAQ.map(q => ({ id: q.bolak, belgi: q.belgi, izoh: q.izoh ? tr(q.izoh) : null, ...(fn ? fn(q) : {}) }));
// Bosqich tugmalari (ixcham, bir qatorda; joriysi accent halqada, bosilgani ✓)
const Qadamlar3 = ({ nomlar, q, faol, onBos }) => (
  <div className="gv-qadamlar">
    {nomlar.map((n, i) => (
      <QChip key={i} holat={i < q ? 'ok' : i === q && faol ? 'on' : undefined} className={cxx(i === q && faol && 'gv-joriy')} disabled={!faol || i !== q} onClick={onBos}>
        <i>{i < q ? '✓' : i + 1}</i>{tr(n)}
      </QChip>
    ))}
  </div>
);
const ixchamBashorat = (taxmin, el) => <div className={cxx('gv-bash', taxmin && 'ix')}>{el}</div>;

// ===== SCREEN 0 — KIRISH (QKirish; sof so'rovnoma — J-026: correct false hammaga; «Aynan!» / «Qiziq fikr!» — T-028, T-067) =====
const HOOK_OPTS = [
  { id: 'qism', t: { uz: "Qaysi bo'lakda nima yetishmagani", ru: 'В какой части чего не хватило' } },
  { id: 'yoqdi', t: { uz: "Pitchingiz ularga yoqdimi, yo'qmi", ru: 'Понравился им ваш питч или нет' } },
  { id: 'kim', t: { uz: 'Guruhda kimniki yaxshiroq chiqqani', ru: 'У кого в группе получилось лучше' } }
];
const HOOK_JAVOB = {
  qism: { uz: <><b>Aynan!</b> Bo'lak va unda nima yetishmagani aytilsa, nimani tuzatishni aniq bilasiz.</>, ru: <><b>Именно!</b> Если названа часть и чего в ней не хватило, вы точно знаете, что исправлять.</> },
  yoqdi: { uz: <><b>Qiziq fikr!</b> Bu ham fikr, lekin u qaysi bo'lakni tuzatishni aytmaydi.</>, ru: <><b>Интересная мысль!</b> Это тоже мнение, но оно не говорит, какую часть исправлять.</> },
  kim: { uz: <><b>Qiziq fikr!</b> Bu darsda pitchlar solishtirilmaydi — har pitch o'z bo'laklari bilan ko'riladi.</>, ru: <><b>Интересная мысль!</b> На этом уроке питчи не сравнивают — каждый смотрят по его частям.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const qism = picked === 'qism';
  const pufaklar = [{ k: 'a' }, { k: qism ? 'bq' : 'b', q: qism }, { k: 'c' }];
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('gv-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Guruh pitchingizda <A>nimani tuzatishni aytadi?</A></>, ru: <>Что группа советует <A>исправить в вашем питче?</A></> })}
          mentor={<Mentor>{tr({ uz: "Pitchingizni guruhdagi sinfdoshlaringiz eshitsa, ularning qaysi gapi sizga ko'proq foyda beradi?", ru: 'Если ваш питч услышат одноклассники в группе, какие их слова принесут вам больше пользы?' })}</Mentor>}
          maket={<GuruhVaraqSahna
            guruh={<><Gapiruvchi yorliq={tr({ uz: 'siz', ru: 'вы' })} /><Tinglovchilar pufaklar={pufaklar} /></>}
            taymer={<TaymerChiziq tolgan={6} halqa={qism ? 'bozor' : null} />} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual — skelet, bir marta o'zi yuradi; tugagach «Boshlaymiz» halqada) =====
// MD «matnsiz skelet» → SABOQ P11 / 1-dars pilot: bo'sh chiziqlar o'rnida bo'lak nomlari va raqamli bo'sh qatorlar (2, 4-ekran kashfiyoti ochilmaydi).
const REJA = [
  { t: { uz: "Varaqdan nimani tuzatishni o'qishni bilib olasiz", ru: 'Научитесь читать по листу, что исправлять' }, teg: { uz: "baholash varag'i", ru: 'оценочный лист' } },
  { t: { uz: "Izohdan aniq tuzatish yozishni o'rganasiz", ru: 'Научитесь писать по замечанию точное исправление' }, teg: { uz: 'tuzatish', ru: 'исправление' } },
  { t: { uz: 'Pitchingizni guruhga 5 daqiqada aytasiz', ru: 'Расскажете питч группе за 5 минут' }, teg: { uz: 'taymer', ru: 'таймер' } },
  { t: { uz: 'Varaqingizdan uchta tuzatish yozasiz', ru: 'Напишете три исправления по своему листу' }, teg: { uz: "tuzatishlar ro'yxati", ru: 'список исправлений' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [bi, setBi] = useState(kamHarakat() ? 6 : 0);
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const t = [0, 1, 2, 3, 4, 5].map(i => setTimeout(() => setBi(i + 1), 500 + i * 650));
    return () => t.forEach(clearTimeout);
  }, []);
  const tayyor = bi >= 6;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun pitchingizga <A>guruh varag'idan tuzatish yozasiz.</A></>, ru: <>Сегодня напишете к питчу <A>исправления по листу группы.</A></> })}
        mentor={<Mentor>{tr({ uz: 'Avval Mentor misolida varaqni ko\'rasiz, keyin pitchingizni guruhga aytasiz.', ru: 'Сначала посмотрите лист на примере Ментора, потом расскажете свой питч группе.' })}</Mentor>}
        chapYorliq={tr({ uz: "pitch mashqi 1: guruh fidbeki va tuzatishlar ro'yxati", ru: 'тренировка питча 1: фидбек группы и список исправлений' })}
        chap={<div className="gv-reja">
          <p className="gv-kulrang">{tr({ uz: "Guruh — 3–4 kishi; guruh bo'lmasa, varaqni o'zingiz to'ldirasiz.", ru: 'Группа — 3–4 человека; если группы нет, лист заполните сами.' })}</p>
          <div className="gv-reja-g"><Doirachalar n={4} /><TaymerChiziq tolgan={bi} silliq /></div>
          <div className="gv-reja-v">
            <div className="gv-skelet">{BOLAK_ID.map((id, i) => <span key={id} className={cxx('gv-skelet-q', i < bi && 'on')}>{tr(BOLAK_NOM[id])}</span>)}</div>
            <div className="gv-skelet-r">{[1, 2, 3].map(n => <span key={n}><i>{n}</i></span>)}</div>
          </div>
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — MENTOR VARAG'I (QTushuncha keng; bashorat → 3 tugma ketma-ket: Pitch · Varaq · Hakam savoli; markaziy) =====
const S2_TUGMA = [{ uz: 'Pitch', ru: 'Питч' }, { uz: 'Varaq', ru: 'Лист' }, { uz: 'Hakam savoli', ru: 'Вопрос судьи' }];
const S2_IZOH = [
  { uz: 'Guruh pitchni oxirigacha tinglaydi — varaq pitchdan keyin to\'ldiriladi.', ru: 'Группа слушает питч до конца — лист заполняют после питча.' },
  { uz: 'Ikkala izoh ham bo\'lak haqida: unda nima tushunarsiz qolgani yozilgan.', ru: 'Оба замечания — о части: в них написано, что осталось непонятным.' },
  { uz: 'Hakam savoli — tinglovchi pitchdan keyin hakam o\'rnida yozgan bitta savol.', ru: 'Вопрос судьи — один вопрос, который слушатель после питча записал в роли судьи.' }
];
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Одну' } }, { k: '2', t: { uz: 'Ikkita', ru: 'Две' } }, { k: '3', t: { uz: 'Uchta', ru: 'Три' } }];
// Pitch tezlashtirilgan: 7 pufak (avval lahza, keyin olti bo'lak), har biri ≈ 0,85 s
const S2_PUFAK = [{ b: 0, lahza: true }, { b: 0 }, { b: 1 }, { b: 2 }, { b: 3 }, { b: 4 }, { b: 5 }];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [band, setBand] = useState(false);
  const [pi, setPi] = useState(storedAnswer ? 7 : -1); // pitch pufagi bosqichi
  const [vi, setVi] = useState(storedAnswer ? 6 : 0); // varaqqa tushgan belgilar
  const [hk, setHk] = useState(storedAnswer ? 2 : 0); // 0 — yo'q · 1 — pufakda · 2 — varaqda
  const [qayt, setQayt] = useState(null); // ✗ tushganda pufakda qaytgan bo'lak
  const done = q >= 3;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done && !band, q);
  const [uch, uchEl] = useUchish();
  const pufRef = useRef(null); const hkRef = useRef(null);
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const keyin = (fn, ms) => tRef.current.push(setTimeout(fn, kamHarakat() ? 0 : ms));
  const bos = () => {
    if (!taxmin || band || done) return;
    setBand(true);
    if (q === 0) {
      S2_PUFAK.forEach((_, i) => keyin(() => setPi(i), i * 850));
      keyin(() => { setPi(7); setQ(1); setBand(false); }, S2_PUFAK.length * 850 + 200);
    } else if (q === 1) {
      MENTOR_VARAQ.forEach((r, i) => keyin(() => { setVi(i + 1); setQayt(r.belgi === '✗' ? r.bolak : null); }, i * 700 + 100));
      keyin(() => { setQayt(null); setQ(2); setBand(false); }, MENTOR_VARAQ.length * 700 + 700);
    } else if (q === 2) {
      setHk(1);
      keyin(async () => { await uch(pufRef.current, hkRef.current, tr(MENTOR_HAKAM_SAVOL), 'savol'); setHk(2); setQ(3); setBand(false); }, 700);
    }
  };
  // Pufak matni: pitch davomida — joriy gap; ✗ tushganda — o'sha bo'lakning gapi (izoh so'zi accent)
  const pBo = pi >= 0 && pi < 7 ? S2_PUFAK[pi] : null;
  const pufak = qayt
    ? <Ajrat matn={gaplar(tr(JAMOA_PITCH[qayt]))[AJRAT_SOZ[qayt].gap]} soz={tr(AJRAT_SOZ[qayt].soz)} />
    : pBo ? (pBo.lahza ? tr(LAHZA) : birinchiGap(tr(JAMOA_PITCH[BOLAK_ID[pBo.b]]))) : null;
  const joriy = qayt ? BOLAK_ID.indexOf(qayt) : pBo ? pBo.b : null;
  const telSon = pi >= 4 ? 9 : 8;
  const xatoBo = MENTOR_VARAQ.slice(0, vi).filter(r => r.belgi === '✗').map(r => r.bolak);
  const okBo = MENTOR_VARAQ.slice(0, vi).filter(r => r.belgi === '✓').map(r => r.bolak);
  const qatorlar = MENTOR_VARAQ.map((r, i) => ({ id: r.bolak, belgi: i < vi ? r.belgi : null, izoh: i < vi && r.izoh ? tr(r.izoh) : null, holat: i === vi - 1 && band ? 'yangi' : null }));
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  const sahna = <GuruhVaraqSahna className={done ? 'tayyor' : null}
    yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>}
    guruh={<>
      {!done && <Gapiruvchi yorliq={tr({ uz: 'gapiradi', ru: 'говорит' })} pufak={pufak || (pi < 0 ? null : undefined)} pufakKey={(qayt || '') + pi}
        telefon={pBo && pBo.b === 2 ? <JamoaTelefon son={telSon} /> : null} />}
      <Tinglovchilar yorliq={q >= 2 ? tr({ uz: "hakam o'rnida", ru: 'в роли судьи' }) : null} refS={pufRef}
        pufaklar={hk === 1 ? [{ k: 'hk', q: true, ref: true, matn: tr(MENTOR_HAKAM_SAVOL) }] : []} />
    </>}
    taymer={<TaymerChiziq tolgan={pi < 0 ? 0 : Math.min(6, pi === 7 ? 6 : (pBo ? pBo.b + 1 : 0))} joriy={band && q === 0 ? joriy : null} xato={xatoBo} ok={okBo} silliq
      yorliq={band && q === 0 ? tr({ uz: 'tezlashtirilgan', ru: 'ускорено' }) : null} />}
    varaq={<Varaq qatorlar={qatorlar} refHk={hkRef}
      hakam={{ yorliq: tr({ uz: 'Hakam savoli', ru: 'Вопрос судьи' }), matn: hk === 2 ? tr(MENTOR_HAKAM_SAVOL) : null, holat: hk === 2 && !storedAnswer ? 'yangi' : null }} />}
    chapOstida={done && <QXulosa><XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '2'} aslida={tr({ uz: 'ikkita', ru: 'две' })} />}
      matn={tr({ uz: "Bu darsda varaqda har bo'lakka ✓ yoki ✗, ✗ yonida izoh va oxirida bitta hakam savoli turadi.", ru: 'На этом уроке в листе у каждой части ✓ или ✗, рядом с ✗ — замечание, а в конце — один вопрос судьи.' })}
      izoh={tr(S2_IZOH[2])} /></QXulosa>} />;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · baholash varag'i", ru: 'Понятие · оценочный лист' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Mentor pitchini eshitgan guruh <A>varaqqa nima yozdi?</A></>, ru: <>Что группа, услышав питч Ментора, <A>записала в лист?</A></> })}
        mentor={<Mentor>{tr({ uz: 'Tugmalarni birma-bir bosing va har bosishdan keyin varaqqa qarang.', ru: 'Нажимайте кнопки по одной и после каждого нажатия смотрите на лист.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Guruh Mentor pitchining nechta bo'lagiga ✗ qo'ydi?", ru: 'Скольким частям питча Ментора группа поставила ✗?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!done && <div className="gv-harakat">
          <Qadamlar3 nomlar={S2_TUGMA} q={q} faol={!!taxmin && !band} onBos={bos} />
          {q > 0 && <QIzoh key={q}>{tr(S2_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — varaq qanday to'lishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как заполняется лист.' }))}
        </div>}
        vizual={sahna}
      />
      {uchEl}
    </Stage>
  );
};

// --- Testlar javobidan keyingi kichik vizual (SABOQ 4): bitta varaq yoki ro'yxat qatori ---
const MiniQator = ({ bolak, belgi, matn }) => (
  <div className="gv-mini">
    <b>{tr(BOLAK_NOM[bolak])}</b>
    {belgi && <i className={belgi === '✗' ? 'x' : 'ok'}>{belgi}</i>}
    <span>{matn}</span>
  </div>
);
// 8-ekran: varaqdagi Raqamlar ✗ qatori ro'yxatdagi bo'sh qatorga uchadi — «Raqamlar · …» (o'quvchi o'zi yozadi)
const MiniUchish = () => (
  <div className="gv-mini-u">
    <div className="gv-mini gv-mini-src"><b>{tr(BOLAK_NOM.raqamlar)}</b><i className="x">✗</i><span>{tr({ uz: 'izoh', ru: 'замечание' })}</span></div>
    <div className="gv-mini-dst"><i>1</i><span className="gv-mini-fly"><b>{tr(BOLAK_NOM.raqamlar)}</b> · …</span></div>
  </div>
);

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2; ikkinchi misol — kitob almashish ilovasi, P-002) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · izoh', ru: 'Проверка · замечание' })}
    questionText="Kitob almashish pitchida Jamoa bo'lagi tushunarsiz bo'ldi. Izohga nima yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish pitchida Jamoa bo'lagi tushunarsiz bo'ldi. <A>Izohga nima yozasiz?</A></h2>, ru: <h2 className="title h-ask">В питче приложения для обмена книгами часть «Команда» оказалась непонятной. <A>Что напишете в замечании?</A></h2> })}
    options={[
      { uz: '«Siz bugun yaxshi gapira olmadingiz»', ru: '«Вы сегодня не смогли хорошо выступить»' },
      { uz: '«Hamma bo\'lak yaxshi edi, izoh shart emas»', ru: '«Все части были хорошие, замечание не нужно»' },
      { uz: '«Jamoa bo\'lagida kim nima qilgani yo\'q»', ru: '«В части „Команда“ нет, кто что сделал»' },
      { uz: '«Jamoa bo\'lagi umuman qiziq emas edi»', ru: '«Часть „Команда“ была совсем неинтересной»' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Izoh bo'lak haqida: unda nima yetishmagani yoziladi.", ru: 'Замечание — о части: в нём пишут, чего в ней не хватило.' }}
    explainWrong={{
      0: { uz: "Bu odam haqida — Jamoa bo'lagida nima yetishmadi?", ru: 'Это о человеке — чего не хватило в части «Команда»?' },
      1: { uz: 'Jamoa tushunarsiz edi — yashirilsa, tuzatilmaydi.', ru: '«Команда» была непонятной — если скрыть, её не исправят.' },
      3: { uz: "Bu fikr — unda nima yetishmagani yo'q.", ru: 'Это мнение — в нём нет, чего не хватило.' },
      default: { uz: 'Mentor pitchiga yozilgan izohlar nima haqida edi?', ru: 'О чём были замечания к питчу Ментора?' }
    }}
    vizual={<MiniQator bolak="jamoa" belgi="✗" matn={tr({ uz: "kim nima qilgani yo'q", ru: 'нет, кто что сделал' })} />} />
);

// ===== SCREEN 4 — TUZATISHLAR RO'YXATI (QTushuncha; ketma-ket 3 karta — E 53; to'g'ri — ro'yxatga uchadi, xato — silkinadi; bashorat yo'q — MD) =====
const TUZATISH_KARTA = [
  { bolak: 'bozor', tur: 'x', manba: MENTOR_VARAQ[1].izoh, togri: 1,
    variantlar: [{ uz: 'Bozorga kattaroq son yozaman: butun shahar aholisi soni', ru: 'Напишу в Рынок число побольше: население всего города' }, MENTOR_TUZATISH[0].nima, { uz: "Bozor bo'lagini pitchdan butunlay olib tashlayman", ru: 'Полностью уберу часть «Рынок» из питча' }],
    xato: [{ uz: 'Bu son qayerdan? Manbasiz son Bozorga yozilmaydi.', ru: 'Откуда это число? Число без источника в Рынок не пишут.' }, null, { uz: "Bo'lak qoladi — unda nima o'zgaradi?", ru: 'Часть остаётся — что в ней изменится?' }] },
  { bolak: 'raqamlar', tur: 'x', manba: MENTOR_VARAQ[3].izoh, togri: 0,
    variantlar: [MENTOR_TUZATISH[1].nima, { uz: '"3 tashkilotchi Pro\'ni sotib oldi" deb aytaman', ru: 'Скажу: «3 организатора купили Pro»' }, { uz: 'Tasdiqlar haqida pitchda umuman hech narsa demayman', ru: 'О подтверждениях в питче вообще ничего не скажу' }],
    xato: [null, { uz: "Tasdiq — to'lov emas: bu gap rost bo'lmaydi.", ru: 'Подтверждение — не оплата: эта фраза будет неправдой.' }, { uz: 'Tasdiq — dalil: u yashirilmaydi, tushuntiriladi.', ru: 'Подтверждение — довод: его не скрывают, а объясняют.' }] },
  { bolak: 'keyingi', tur: 'savol', manba: MENTOR_HAKAM_SAVOL, togri: 2,
    kulrang: { uz: "Savoldagi «maydon egalari» — Keyingi qadam bo'lagida.", ru: '«Владельцы площадок» из вопроса — в части «Следующий шаг».' },
    variantlar: [{ uz: "Maydon egalari ham keyin to'laydi, deb aytaman", ru: 'Скажу, что владельцы площадок тоже потом заплатят' }, { uz: "So'rovdan maydon egalarini butunlay olib tashlayman", ru: 'Полностью уберу владельцев площадок из просьбы' }, MENTOR_TUZATISH[2].nima],
    xato: [{ uz: "Bu va'da — bugun bilgan narsangizni ayting.", ru: 'Это обещание — скажите то, что знаете сегодня.' }, { uz: 'Savol qoladi — unga javob bering.', ru: 'Вопрос остаётся — ответьте на него.' }, null] }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [n, setN] = useState(storedAnswer ? 3 : 0);
  const [xato, setXato] = useState(null); // { i, k }
  const [band, setBand] = useState(false);
  const [yangi, setYangi] = useState(null);
  const xatoSoni = useRef(0);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  const ipucha = useIpucha(!done && !band, n);
  const [uch, uchEl] = useUchish();
  const varRef = useRef([]); const rRef = useRef([]);
  const bos = async (i) => {
    if (done || band) return;
    const k = TUZATISH_KARTA[n];
    if (i !== k.togri) { xatoSoni.current += 1; setXato({ i, k: Date.now() }); return; }
    setXato(null); setBand(true);
    await uch(varRef.current[i], rRef.current[n], tr(k.variantlar[i]), 'ok');
    const yn = n + 1;
    setN(yn); setYangi(n); setBand(false);
    setTimeout(() => setYangi(null), 1100);
    if (yn === 3 && storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, correct: xatoSoni.current === 0, picked: true, solved: true });
  };
  const k = !done ? TUZATISH_KARTA[n] : null;
  const bandlar = MENTOR_TUZATISH.map((t, i) => (i < n ? { nom: tr(BOLAK_NOM[t.bolak]), nima: tr(t.nima) } : null));
  const qatorlar = mentorQatorlar(r => ({ holat: done ? null : (r.belgi === '✗' || (n === 2 && r.bolak === 'keyingi') ? 'ajrat' : 'xira'), royxatda: (r.bolak === 'bozor' && n > 0) || (r.bolak === 'raqamlar' && n > 1) }));
  const varaq = <Varaq ixcham={!done} qatorlar={qatorlar} hakam={{ yorliq: tr({ uz: 'Hakam savoli', ru: 'Вопрос судьи' }), matn: tr(MENTOR_HAKAM_SAVOL), holat: done ? null : 'ajrat', royxatda: n > 2 }} />;
  const royxat = <Royxat bandlar={bandlar} refR={rRef} yangi={yangi} />;
  const karta = k && (
    <div key={n} className="gv-karta">
      <div className="gv-karta-h"><b>{k.tur === 'x' ? <>{tr(BOLAK_NOM[k.bolak])} · <span className="gv-x">✗</span></> : tr({ uz: 'Hakam savoli', ru: 'Вопрос судьи' })}</b><span className="gv-karta-n">{n + 1}{NB}/{NB}3</span></div>
      <p className="gv-manba">«{tr(k.manba)}»</p>
      {k.kulrang && <p className="gv-kulrang">{tr(k.kulrang)}</p>}
      <div className="gv-varlar">
        {k.variantlar.map((v, i) => (
          <button key={i} ref={el => { varRef.current[i] = el; }} type="button" disabled={band} className={cxx('gv-var', xato && xato.i === i && 'err')} onClick={() => bos(i)}>{tr(v)}</button>
        ))}
      </div>
      {xato && k.xato[xato.i] && <QXato key={xato.k}>{tr(k.xato[xato.i])}</QXato>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · tuzatishlar ro'yxati", ru: 'Понятие · список исправлений' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Kartalarni yeching (${n}/3)`, ru: `Решите карточки (${n}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor varag'idan <A>qanday tuzatish chiqadi?</A></>, ru: <>Какое исправление <A>получается из листа Ментора?</A></> })}
        mentor={<Mentor>{tr({ uz: "Har kartada izohga javob beradigan tuzatishni tanlang — u ro'yxatga tushadi.", ru: 'На каждой карточке выберите исправление, которое отвечает на замечание, — оно попадёт в список.' })}</Mentor>}
        vizual={<GuruhVaraqSahna className={cxx('gv-s4', done && 'tayyor')} guruh={varaq} varaq={done ? <>{royxat}<QXulosa><XulosaQ matn={tr({ uz: "Bu misolda har tuzatish izohga yoki savolga javob beradi: to'qilgan son va va'da yo'q.", ru: 'В этом примере каждое исправление отвечает на замечание или вопрос: ни выдуманного числа, ни обещания.' })}
          izoh={tr({ uz: "Tuzatishlar ro'yxati — uch band: qaysi bo'lak va unda nima o'zgaradi.", ru: 'Список исправлений — три пункта: какая часть и что в ней изменится.' })} /></QXulosa></> : <>{karta}{ipucha && IPUCHA(tr({ uz: "Qaysi gap izohga javob beradi va yangi narsa to'qimaydi?", ru: 'Какая фраза отвечает на замечание и ничего не выдумывает?' }))}{royxat}</>} />}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 0; ikkinchi misol — kitob almashish ilovasi) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · tuzatish', ru: 'Проверка · исправление' })}
    questionText="Kitob almashish pitchida Raqamlar ✗ oldi: «son qayerdan?». Nima yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish pitchida Raqamlar ✗ oldi: «son qayerdan?». <A>Nima yozasiz?</A></h2>, ru: <h2 className="title h-ask">В питче приложения для обмена книгами «Цифры» получили ✗: «откуда число?». <A>Что напишете?</A></h2> })}
    options={[
      { uz: 'Raqamlar: sonning manbasini aytaman', ru: 'Цифры: назову источник числа' },
      { uz: 'Raqamlar: sonni ikki barobar qilaman', ru: 'Цифры: увеличу число вдвое' },
      { uz: "Raqamlar: bo'lakni olib tashlayman", ru: 'Цифры: уберу эту часть' },
      { uz: 'Raqamlar: keyin yaxshiroq qilib aytaman', ru: 'Цифры: потом расскажу получше' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Tuzatish izohga javob beradi va nima o'zgarishini aytadi.", ru: 'Исправление отвечает на замечание и говорит, что изменится.' }}
    explainWrong={{
      1: { uz: "Bu son o'ylab topilgan — izoh nimani so'radi?", ru: 'Это число выдумано — о чём спросило замечание?' },
      2: { uz: "Bo'lak qoladi — unda nima o'zgaradi?", ru: 'Часть остаётся — что в ней изменится?' },
      3: { uz: "«Yaxshiroq» — aniq nima o'zgaradi?", ru: '«Получше» — что конкретно изменится?' },
      default: { uz: 'Mentor «tasdiq» izohiga qanday tuzatish yozgan edi?', ru: 'Какое исправление Ментор написал к замечанию про «подтверждение»?' }
    }}
    vizual={<MiniQator bolak="raqamlar" matn={tr({ uz: 'sonning manbasini aytaman', ru: 'назову источник числа' })} />} />
);

// ===== SCREEN 6 — GURUHDA PITCH (QMustaqil, USTAXONA: rejim → 3 qism ketma-ket; guruh + yakka) · yozadi pm-m12d5-varaq (tur, varaq, hakamSavoli, vaqt) · nishon pitchRound =====
const PITCHDAN_OLDIN = [
  { uz: 'Guruh — 3 kishi (4 ham mumkin): navbat bilan bittangiz aytasiz, qolganlar tinglaydi.', ru: 'Группа — 3 человека (можно 4): говорите по очереди, остальные слушают.' },
  { uz: "Yechimda jonli demoni qurilmangizda ko'rsating; ochilmasa — og'zaki aytib bering.", ru: 'В Решении покажите живое демо на своём устройстве; если не откроется — расскажите устно.' },
  { uz: "Tinglovchilar pitch tugaguncha yozmaydi — varaq keyin to'ldiriladi: u guruhning bitta umumiy yozuvi, alohida odamlarning ovozi emas.", ru: 'Слушатели не пишут, пока питч не закончится, — лист заполняют потом: это одна общая запись группы, а не голоса отдельных людей.' },
  { uz: "Boshqa oynalarni yoping — varaqdan boshqa shaxsiy narsa ekranda bo'lmasin.", ru: 'Закройте другие окна — кроме листа, на экране не должно быть личного.' }
];
const PITCHDAN_OLDIN_YAKKA = { uz: 'Yozuv — video yoki ovoz; u telefoningizda qoladi, hech qayerga yuklanmaydi.', ru: 'Запись — видео или голос; она остаётся в вашем телефоне и никуда не загружается.' };
const S6_MENTOR = {
  guruh: [
    { uz: "Navbatingiz kelganda «5 daqiqani boshlash»ni bosing; tugatgach — «To'xtatish».", ru: 'Когда подойдёт ваша очередь, нажмите «Начать 5 минут»; закончив — «Остановить».' },
    { uz: "Pitch tugagach, varaq ekrani ochiq holda qurilmangizni guruhga uzating: ular har bo'lakka birga ✓ yoki ✗ qo'yadi.", ru: 'Когда питч закончится, передайте группе устройство с открытым листом: они вместе поставят каждой части ✓ или ✗.' },
    { uz: "Guruh hakam o'rnida bitta savol yozsin — pitchdan keyin ularda qolgan savol.", ru: 'Пусть группа в роли судьи напишет один вопрос — тот, что остался у них после питча.' }
  ],
  yakka: [
    { uz: "Telefoningizda yozishni yoqing, so'ng «5 daqiqani boshlash»ni bosing; tugatgach — «To'xtatish».", ru: 'Включите запись на телефоне, затем нажмите «Начать 5 минут»; закончив — «Остановить».' },
    { uz: "Yozuvni bir marta ko'ring va har bo'lakka o'zingiz ✓ yoki ✗ qo'ying.", ru: 'Один раз посмотрите запись и сами поставьте каждой части ✓ или ✗.' },
    { uz: "Hakam o'rnida o'zingizga bitta savol yozing — pitchdan keyin sizda qolgan savol.", ru: 'В роли судьи напишите себе один вопрос — тот, что остался у вас после питча.' }
  ]
};
const S6_XATO = {
  belgi: { uz: "Bu bo'lakka ✓ yoki ✗ qo'ying.", ru: 'Поставьте этой части ✓ или ✗.' },
  qisqa: { uz: "✗ qo'ydingiz — nima yetishmaganini yozing.", ru: 'Вы поставили ✗ — напишите, чего не хватило.' },
  baho: { uz: "Odam haqida emas — bo'lakda nima yetishmadi?", ru: 'Не о человеке — чего не хватило в части?' },
  hammaok: { uz: "Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?", ru: 'Везде ✓ — какая часть может быть ещё точнее?' },
  pii: { uz: 'Varaqqa telefon va akkaunt nomi yozilmaydi.', ru: 'В лист не пишут телефон и имя аккаунта.' },
  bosh: { uz: 'Bitta hakam savolini yozing.', ru: 'Напишите один вопрос судьи.' },
  pul: { uz: "Bu kursda summa so'ralmaydi — savolni summasiz yozing.", ru: 'На этом курсе сумму не просят — напишите вопрос без суммы.' }
};
const S6_QISM = [{ uz: 'Pitch', ru: 'Питч' }, { uz: 'Varaq', ru: 'Лист' }, { uz: 'Hakam savoli', ru: 'Вопрос судьи' }];
const hkYorliq = (tur) => (tur === 'guruh' ? tr({ uz: 'Tinglovchining hakam savoli', ru: 'Вопрос судьи от слушателя' }) : tr({ uz: 'Hakam savoli', ru: 'Вопрос судьи' }));
const varaqOl = () => { const v = lsO(VARAQ_KEY); return v && Array.isArray(v.varaq) && v.varaq.length === 6 && typeof v.hakamSavoli === 'string' && v.hakamSavoli.trim() ? v : null; };
const YANA = (t) => <p className="gv-yana">{t}</p>;
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const isStudent = !!(_live && _live.mode === 'student');
  const achMiss = useContext(AchMissCtx);
  const sq = useMemo(() => varaqOl(), []);
  const pitch = useMemo(() => { const p = lsO(PITCH_KEY); return p && p.bolaklar && typeof p.bolaklar === 'object' ? p.bolaklar : null; }, []);
  const lahza = useMemo(() => { const h = lsO(HIKOYA_KEY); return h && typeof h.lahza === 'string' && h.lahza.trim() ? h.lahza.trim() : null; }, []);
  const [tur, setTur] = useState(sq ? (sq.tur === 'guruh' ? 'guruh' : 'yakka') : (isStudent ? 'guruh' : 'yakka'));
  const [qism, setQism] = useState(sq ? 3 : 0);
  const [sek, setSek] = useState(sq && Number.isFinite(sq.vaqt) ? sq.vaqt : 0);
  const [yur, setYur] = useState(false);
  const [toxtadi, setToxtadi] = useState(!!sq && Number.isFinite(sq.vaqt));
  const [tasdiq, setTasdiq] = useState(!!sq);
  const [varaq, setVaraq] = useState(() => BOLAK_ID.map((id, i) => { const v = sq && sq.varaq[i]; return { bolak: id, belgi: v && (v.belgi === '✓' || v.belgi === '✗') ? v.belgi : null, izoh: v && typeof v.izoh === 'string' ? v.izoh : '' }; }));
  const [k, setK] = useState(sq ? 6 : 0);
  const [savol, setSavol] = useState(sq ? sq.hakamSavoli : '');
  const [hkTushdi, setHkTushdi] = useState(!!sq);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [band, setBand] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [nv, setNv] = useState(1);
  const [uch, uchEl] = useUchish();
  const startRef = useRef(0);
  const okRef = useRef(null); const xRef = useRef(null); const savolRef = useRef(null);
  const qRef = useRef({}); const hkRef = useRef(null);
  const done = qism >= 3;
  useEffect(() => {
    if (!yur) return undefined;
    const t = setInterval(() => setSek(Math.floor((Date.now() - startRef.current) / 1000)), 250);
    return () => clearInterval(t);
  }, [yur]);
  const boshla = () => { startRef.current = Date.now(); setSek(0); setYur(true); setToxtadi(false); };
  const toxtat = () => {
    setSek(Math.floor((Date.now() - startRef.current) / 1000)); setYur(false); setToxtadi(true);
    if (isMentor) return;
    if (isStudent) _live.submitAnswer(PRACTICE_BASE + 50 + screen, 'practice', 0, true, 0);
    setQism(q => (q === 0 ? 1 : q));
  };
  const qayta = () => { setYur(false); setToxtadi(false); setSek(0); setQism(0); };
  const qq = varaq[Math.min(k, 5)];
  const setBelgi = (b) => { if (band) return; setVaraq(v => v.map((r, i) => (i === k ? { ...r, belgi: b } : r))); setXato(null); };
  const setIzoh = (t) => { setVaraq(v => v.map((r, i) => (i === k ? { ...r, izoh: t } : r))); setXato(null); };
  const yoqma = (t, kalit) => t && (t.blok || !(yumshoq && yumshoq.k === kalit && yumshoq.x === t.x));
  const keyingiBolak = async () => {
    if (band || k > 5) return;
    const t = tekshirIzoh(qq.belgi, qq.izoh, k === 5 && varaq.every(r => r.belgi === '✓'));
    if (yoqma(t, k)) { setXato({ ...t, n: Date.now() }); if (!t.blok) setYumshoq({ k, x: t.x }); return; }
    setXato(null); setYumshoq(null); setBand(true);
    await uch(qq.belgi === '✓' ? okRef.current : xRef.current, qRef.current[qq.bolak], qq.belgi, qq.belgi === '✓' ? 'ok' : 'x', 560);
    setYangi(qq.bolak); setTimeout(() => setYangi(null), 1000);
    setK(k + 1); setBand(false);
    if (k === 5) setQism(2);
  };
  const saqla = async () => {
    if (band) return;
    const t = tekshirSavol(savol);
    if (yoqma(t, 'savol')) { setXato({ ...t, n: Date.now() }); if (!t.blok) setYumshoq({ k: 'savol', x: t.x }); return; }
    setXato(null); setYumshoq(null); setBand(true);
    await uch(savolRef.current, hkRef.current, savol.trim(), 'savol');
    const d = { tur, varaq: varaq.map(r => ({ bolak: r.bolak, belgi: r.belgi, izoh: String(r.izoh || '').trim().slice(0, 120) })), hakamSavoli: savol.trim().slice(0, 120), tuzatishlar: [], vaqt: toxtadi ? sek : null, savedAt: Date.now() };
    if (!isMentor) lsY(VARAQ_KEY, d);
    if (achMiss && achMiss.earn && d.vaqt !== null) achMiss.earn('pitchRound');
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'varaq', solved: true, correct: true, picked: true });
    if (isStudent) _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    setHkTushdi(true); setYangi('hk'); setTimeout(() => setYangi(null), 1100); setBand(false); setQism(3);
  };
  // --- Sahna (chap) ---
  const jt = BOLAK_ID.findIndex((_, i) => sek < BOSH_SEK[i] + VAQT[i]);
  const jIdx = yur || toxtadi ? (jt < 0 ? 5 : jt) : 0;
  const jb = BOLAK_ID[jIdx];
  const ozGap = pitch && typeof pitch[jb] === 'string' && pitch[jb].trim() ? birinchiGap(pitch[jb]) : null;
  const xBo = varaq.slice(0, k).filter(r => r.belgi === '✗').map(r => r.bolak);
  const okBo = varaq.slice(0, k).filter(r => r.belgi === '✓').map(r => r.bolak);
  const taymerEl = <TaymerChiziq sek={yur || toxtadi ? sek : null} joriy={yur ? jIdx : null} xato={xBo} ok={okBo} />;
  const guruhSahna = <GuruhVaraqSahna
    guruh={<>
      <Gapiruvchi yorliq={tr({ uz: 'siz', ru: 'вы' })} yozilmoqda={tur === 'yakka'} pufakKey={jb}
        pufak={<><b className="gv-pufak-b">{tr(BOLAK_NOM[jb])}</b>{ozGap || <span className="gv-yozilmagan">{tr({ uz: 'yozilmagan', ru: 'не написано' })}</span>}</>}
        ostida={jb === 'muammo' && lahza && <p className="gv-kulrang">{tr({ uz: 'Hikoyangiz:', ru: 'Ваша история:' })} «{lahza}»</p>} />
      {tur === 'guruh' && <Tinglovchilar />}
    </>}
    taymer={taymerEl} />;
  const varaqEl = (ix) => <Varaq ixcham={ix} refQ={qRef} refHk={hkRef}
    qatorlar={varaq.map((r, i) => ({ id: r.bolak, belgi: i < k ? r.belgi : null, izoh: i < k && r.izoh.trim() ? r.izoh.trim() : null, holat: yangi === r.bolak ? 'yangi' : (!done && i === k ? 'ajrat' : null) }))}
    hakam={{ yorliq: hkYorliq(tur), matn: hkTushdi ? savol.trim() : null, holat: yangi === 'hk' ? 'yangi' : null }}
    vaqt={k >= 6 && toxtadi ? tr({ uz: 'Vaqt:', ru: 'Время:' }) + ' ' + mss(sek) : null} />;
  // --- Joriy qism kartasi (o'ng) ---
  const pitchKarta = (
    <div key="pitch" className="gv-karta">
      <div className="gv-oldin">
        <b>{tr({ uz: 'Pitchdan oldin', ru: 'Перед питчем' })}</b>
        {PITCHDAN_OLDIN.map((s, i) => <p key={i}>{tr(tur === 'yakka' && i === 2 ? PITCHDAN_OLDIN_YAKKA : s)}</p>)}
      </div>
      <div className="gv-taymer">
        {yur && <span className="gv-taymer-y">{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
        {(yur || toxtadi) && <b className={cxx('gv-taymer-v', sek > JAMI && 'osh')}>{sek > JAMI ? '+' + mss(sek - JAMI) : mss(sek)}</b>}
        {!yur ? <QTugma className="gv-halqa" onClick={boshla}>{tr({ uz: '5 daqiqani boshlash', ru: 'Начать 5 минут' })}</QTugma>
          : <QTugma className="gv-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
      </div>
    </div>
  );
  const tasdiqKarta = (
    <div key="tasdiq" className="gv-karta">
      <div className="gv-vaqt-q"><span>{tr({ uz: 'Vaqt:', ru: 'Время:' })} <b className={cxx(sek > JAMI && 'osh')}>{mss(sek)}</b></span><QTugma ikkinchi onClick={qayta}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma></div>
      {tur === 'guruh' && <p className="gv-kulrang">{tr({ uz: 'Qurilmani tinglovchilar oldi.', ru: 'Устройство взяли слушатели.' })}</p>}
      <div className="gv-karta-tug"><QTugma className="gv-halqa" onClick={() => setTasdiq(true)}>{tur === 'guruh' ? tr({ uz: "Biz tingladik — varaqni to'ldiramiz", ru: 'Мы послушали — заполняем лист' }) : tr({ uz: "Yozuvni ko'rdim", ru: 'Я посмотрел запись' })}</QTugma></div>
    </div>
  );
  const bolakKarta = k <= 5 && (
    <div key={'b' + k} className={cxx('gv-karta', xato && xato.blok && 'err', band && 'kutadi')}>
      <div className="gv-karta-h"><b>{tr(BOLAK_NOM[qq.bolak])}</b><span className="gv-karta-n">{k + 1}{NB}/{NB}6</span></div>
      <p className="gv-hs">{tr(HAKAM_SAVOL[qq.bolak])}</p>
      <div className="gv-bt-q">
        <span className="gv-savol">{tr({ uz: "Bo'lak shu savolga javob berdimi?", ru: 'Ответила ли часть на этот вопрос?' })}</span>
        <button ref={okRef} type="button" className={cxx('gv-bt', 'ok', qq.belgi === '✓' && 'on', !qq.belgi && 'chorla')} onClick={() => setBelgi('✓')} aria-label="✓">✓</button>
        <button ref={xRef} type="button" className={cxx('gv-bt', 'x', qq.belgi === '✗' && 'on', !qq.belgi && 'chorla')} onClick={() => setBelgi('✗')} aria-label="✗">✗</button>
      </div>
      <div className={cxx('gv-maydon', qq.belgi === '✗' && !qq.izoh.trim() && 'chorla')}>
        <i className="gv-maydon-n">{k + 1}</i>
        <textarea className={cxx('gv-inp', xato && xato.blok && 'err')} rows={2} maxLength={120} value={qq.izoh} placeholder={tr({ uz: 'Nima yetishmadi?', ru: 'Чего не хватило?' })} aria-label={tr(BOLAK_NOM[qq.bolak])} onChange={(e) => setIzoh(e.target.value)} />
      </div>
      {xato && <QXato key={xato.n}>{tr(S6_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && YANA(tr({ uz: 'Shunday qoldirsangiz — tugmani yana bosing.', ru: 'Если оставите так — нажмите кнопку ещё раз.' }))}
      {tur === 'guruh' && <p className="gv-kulrang">{tr({ uz: "Belgini guruh birga tanlaydi; fikrlar farq qilsa — muhokama qiling, tushunarsiz qolgan joyni izohda yozing.", ru: 'Знак группа выбирает вместе; если мнения расходятся — обсудите, а непонятное место запишите в замечании.' })}</p>}
      <div className="gv-karta-tug"><QTugma className={cxx(qq.belgi && 'gv-halqa')} disabled={band} onClick={keyingiBolak}>{tr({ uz: "Keyingi bo'lak", ru: 'Следующая часть' })}</QTugma></div>
    </div>
  );
  const savolKarta = (
    <div key="savol" className={cxx('gv-karta', xato && xato.blok && 'err')}>
      <div className="gv-karta-h"><b>{hkYorliq(tur)}</b></div>
      <div className={cxx('gv-maydon', !savol.trim() && 'chorla')}>
        <i className="gv-maydon-n">?</i>
        <textarea ref={savolRef} className={cxx('gv-inp', xato && xato.blok && 'err')} rows={2} maxLength={120} value={savol} placeholder={tr({ uz: "Hakam yana nima so'raydi?", ru: 'О чём ещё спросит судья?' })} aria-label={hkYorliq(tur)} onChange={(e) => { setSavol(e.target.value); setXato(null); }} />
      </div>
      {xato && <QXato key={xato.n}>{tr(S6_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && YANA(tr({ uz: 'Shunday qoldirsangiz — tugmani yana bosing.', ru: 'Если оставите так — нажмите кнопку ещё раз.' }))}
      <p className="gv-kulrang">{tr({ uz: "Bitta savol — bo'lak yoki mahsulot haqida, odam haqida emas; ism va shaxsiy ma'lumot yozilmaydi.", ru: 'Один вопрос — о части или о продукте, не о человеке; имя и личные данные не пишут.' })}</p>
      <div className="gv-karta-tug"><QTugma className={cxx(savol.trim() && 'gv-halqa')} disabled={band} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
    </div>
  );
  const ongKarta = qism === 0 ? pitchKarta : qism === 1 ? (tasdiq ? bolakKarta : tasdiqKarta) : savolKarta;
  const bajarildi = (toxtadi ? 1 : 0) + (k >= 6 ? 1 : 0) + (done ? 1 : 0);
  const strip = <div className="gv-strip">
    {qism === 0 && !yur && !toxtadi && <div className="gv-rejim-q">
      {[['guruh', { uz: 'Guruh tinglaydi', ru: 'Слушает группа' }], ['yakka', { uz: "Guruh yo'q — o'zim", ru: 'Группы нет — сам' }]].map(([id, t]) => (
        <button key={id} type="button" className={cxx('gv-rejim', tur === id && 'on')} onClick={() => setTur(id)}>{tr(t)}</button>
      ))}
    </div>}
    {S6_QISM.map((n, i) => <QChip key={i} holat={i < bajarildi ? 'ok' : i === qism ? 'on' : undefined} className="gv-tab"><i>{i < bajarildi ? '✓' : i + 1}</i>{tr(n)}</QChip>)}
    <span className="gv-strip-y">{tr({ uz: 'Varaqim', ru: 'Мой лист' })} · {Math.min(k, 6)}/6</span>
  </div>;
  const forma = isMentor
    ? <div className="gv-fokus">
      <Zoomable><div className="gv-proyektor">
        <div className="gv-navbat-q">{[1, 2, 3, 4].map(n => <button key={n} type="button" className={cxx('gv-navbat', nv === n && 'on')} onClick={() => setNv(n)}>{n}-{tr({ uz: 'navbat', ru: 'очередь' })}</button>)}</div>
        <b className={cxx('gv-katta-v', sek > JAMI && 'osh')}>{sek > JAMI ? '+' + mss(sek - JAMI) : mss(sek)}</b>
        <TaymerChiziq sek={yur || toxtadi ? sek : null} joriy={yur ? jIdx : null} katta />
        <div className="gv-karta-tug">{!yur ? <QTugma onClick={boshla}>{tr({ uz: '5 daqiqani boshlash', ru: 'Начать 5 минут' })}</QTugma> : <QTugma onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}</div>
      </div></Zoomable>
      <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 50 + screen} yorliq={{ uz: 'Pitchni aytdi', ru: 'Рассказали питч' }} />
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Varaq saqlandi', ru: 'Лист сохранён' }} />
    </div>
    : done
      ? <div className="gv-ish gv-tayyor q-fokus"><Zoomable>{varaqEl(false)}</Zoomable><div className="gv-ong">{taymerEl}
        {sek > JAMI && <QIzoh>{tr({ uz: "Vaqt 5 daqiqadan oshdi — bu alohida topilma: uyda qaysi bo'lak qisqarishini belgilaysiz.", ru: 'Время больше 5 минут — это отдельная находка: дома отметите, какую часть сократить.' })}</QIzoh>}
        <QXulosa>{tur === 'guruh' ? tr({ uz: "Guruh varag'i to'ldi: belgilar, izohlar va bitta hakam savoli.", ru: 'Лист группы заполнен: знаки, замечания и один вопрос судьи.' }) : tr({ uz: "Varaqni o'zingiz to'ldirdingiz — bu yakka rejimdagi varaq.", ru: 'Вы заполнили лист сами — это лист в одиночном режиме.' })}</QXulosa></div></div>
      : <div className="gv-ish">
        <Zoomable>{qism === 0 ? guruhSahna : <div className="gv-chap">{varaqEl(true)}{taymerEl}</div>}</Zoomable>
        <div className="gv-ong">{ongKarta}</div>
      </div>;
  return (
    <Stage eyebrow={tur === 'guruh' ? tr({ uz: 'Guruhda ish', ru: 'Работа в группе' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qism * 10 + k} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={done} disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch qismni bajaring (${bajarildi}/3)`, ru: `Выполните три части (${bajarildi}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tur === 'guruh'
          ? tr({ uz: <>Pitchingizni guruhga <A>5 daqiqada ayta olasizmi?</A></>, ru: <>Сможете рассказать питч группе <A>за 5 минут?</A></> })
          : tr({ uz: <>Pitchingizni <A>5 daqiqada ayta olasizmi?</A></>, ru: <>Сможете рассказать питч <A>за 5 минут?</A></> })}
        mentor={<Mentor>{tr(S6_MENTOR[tur][Math.min(qism, 2)])}</Mentor>}
        qadamlar={!isMentor && !done && strip}
        forma={forma}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 7 — TUZATISHLARINGIZ (QMustaqil, USTAXONA — bittadan karta, 3 band; E 43, E 53) · yozadi pm-m12d5-varaq.tuzatishlar · nishon threeFixes =====
const S7_XATO = {
  bosh: { uz: "Bu bo'lakda nima o'zgarishini yozing.", ru: 'Напишите, что изменится в этой части.' },
  bolak: { uz: "Avval bo'lakni tanlang.", ru: 'Сначала выберите часть.' },
  takror: { uz: "Bu bo'lak ro'yxatda bor — boshqasini tanlaysizmi?", ru: 'Эта часть уже в списке — выберете другую?' },
  vada: { uz: "Bu va'da — bo'lakda aynan nima o'zgaradi?", ru: 'Это обещание — что именно изменится в части?' },
  mavhum: { uz: "Nima o'zgaradi — gapni yoki sonni aniq yozing.", ru: 'Что изменится — точно напишите фразу или число.' },
  tashla: { uz: "Bo'lak qoladi — unda nima o'zgaradi?", ru: 'Часть остаётся — что в ней изменится?' },
  pii: { uz: 'Tuzatishga telefon va akkaunt nomi yozilmaydi.', ru: 'В исправление не пишут телефон и имя аккаунта.' }
};
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const isStudent = !!(_live && _live.mode === 'student');
  const achMiss = useContext(AchMissCtx);
  const sq = useMemo(() => varaqOl(), []);
  const xlar = sq ? sq.varaq.filter(r => r && r.belgi === '✗').map(r => r.bolak) : [];
  const hakam = sq ? sq.hakamSavoli.trim() : null;
  const [bandlar, setBandlar] = useState(() => (sq && Array.isArray(sq.tuzatishlar) ? sq.tuzatishlar.filter(t => t && BOLAK_ID.includes(t.bolak) && typeof t.nima === 'string').slice(0, 3) : []));
  const [tanlov, setTanlov] = useState(() => (xlar.length > 3 ? bandlar.filter(b => b.manba === 'x').map(b => b.bolak).slice(0, 3) : xlar));
  const tanlandi = xlar.length <= 3 || tanlov.length >= 3;
  const kartalar = useMemo(() => [
    ...tanlov.slice(0, 3).map(id => ({ tur: 'x', bolak: id })),
    ...(hakam ? [{ tur: 'savol', bolak: null }] : []),
    { tur: 'aniqroq', bolak: null }, { tur: 'aniqroq', bolak: null }, { tur: 'aniqroq', bolak: null }
  ].slice(0, 3), [tanlov, hakam]);
  const [tahrir, setTahrir] = useState(null);
  const j = tahrir !== null ? tahrir : bandlar.length;
  const karta = j < 3 ? (tahrir !== null && bandlar[j] ? { tur: bandlar[j].manba, bolak: bandlar[j].manba === 'x' ? bandlar[j].bolak : null } : kartalar[j]) : null;
  const [tb, setTb] = useState(() => (karta && karta.bolak) || null);
  const [matn, setMatn] = useState('');
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [band, setBand] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [uch, uchEl] = useUchish();
  const kRef = useRef(null); const rRef = useRef([]);
  const n = bandlar.length;
  const done = n >= 3 && tahrir === null;
  useEffect(() => { if (tanlandi && tahrir === null && !tb && kartalar[j] && kartalar[j].bolak) setTb(kartalar[j].bolak); }, [tanlandi]); // eslint-disable-line
  const ochKarta = (i, b) => { setTahrir(i); setTb(b ? b.bolak : null); setMatn(b ? b.nima : ''); setXato(null); setYumshoq(null); setYordam(false); };
  const saqla = async () => {
    if (band || !karta) return;
    const takror = !!tb && bandlar.some((b, i) => i !== j && b.bolak === tb);
    const t = tekshirTuzatish(tb, matn, takror);
    if (t && (t.blok || !(yumshoq && yumshoq.j === j && yumshoq.x === t.x))) { setXato({ ...t, n: Date.now() }); if (!t.blok) setYumshoq({ j, x: t.x }); return; }
    setXato(null); setYumshoq(null); setYordam(false); setBand(true);
    await uch(kRef.current, rRef.current[j], tr(BOLAK_NOM[tb]) + ' · ' + matn.trim(), 'ok');
    const yb = [...bandlar]; yb[j] = { bolak: tb, nima: matn.trim().slice(0, 120), manba: karta.tur };
    if (!isMentor && sq) lsY(VARAQ_KEY, { ...sq, tuzatishlar: yb, savedAt: Date.now() });
    const birinchi3 = yb.length === 3 && bandlar.length < 3;
    setBandlar(yb); setYangi(j); setTimeout(() => setYangi(null), 1100);
    setTahrir(null); setMatn(''); setBand(false);
    const nk = yb.length < 3 ? kartalar[yb.length] : null;
    setTb(nk && nk.bolak ? nk.bolak : null);
    if (birinchi3) {
      if (achMiss && achMiss.earn) achMiss.earn('threeFixes');
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'tuzatish', solved: true, correct: true, picked: true });
      if (isStudent) _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const royxatdagi = (id) => bandlar.some(b => b.manba !== 'savol' && b.bolak === id);
  const varaqEl = sq && <Varaq ixcham
    qatorlar={sq.varaq.map(r => ({ id: r.bolak, belgi: r.belgi, izoh: r.izoh ? String(r.izoh) : null, holat: !done && tb === r.bolak ? 'ajrat' : null, royxatda: royxatdagi(r.bolak) }))}
    hakam={{ yorliq: hkYorliq(sq.tur), matn: hakam, holat: !done && karta && karta.tur === 'savol' ? 'ajrat' : null, royxatda: bandlar.some(b => b.manba === 'savol') }}
    vaqt={Number.isFinite(sq.vaqt) ? tr({ uz: 'Vaqt:', ru: 'Время:' }) + ' ' + mss(sq.vaqt) : null} />;
  const royxatEl = (ed) => <Royxat refR={rRef} yangi={yangi} onTahrir={ed ? (i) => ochKarta(i, bandlar[i]) : null}
    bandlar={[0, 1, 2].map(i => (bandlar[i] ? { nom: tr(BOLAK_NOM[bandlar[i].bolak]), nima: bandlar[i].nima } : null))} />;
  const manbaQator = karta && (karta.tur === 'x'
    ? <>✗ · {tr(BOLAK_NOM[karta.bolak])} · «{(sq.varaq.find(r => r.bolak === karta.bolak) || {}).izoh}»</>
    : karta.tur === 'savol' ? <>{tr({ uz: 'Hakam savoli', ru: 'Вопрос судьи' })} · «{hakam}»</>
      : <>✓ · {tb ? tr(BOLAK_NOM[tb]) + ' · ' : ''}{tr({ uz: 'yanada aniqroq', ru: 'ещё точнее' })}</>);
  const tanlashKarta = (
    <div key="tanla" className="gv-karta">
      <div className="gv-karta-h"><b>{tr({ uz: 'Eng muhim uchtasini tanlang', ru: 'Выберите три самых важных' })}</b><span className="gv-karta-n">{tanlov.length}{NB}/{NB}3</span></div>
      <div className="gv-bolak-q">{xlar.map(id => <button key={id} type="button" className={cxx('gv-tanla', tanlov.includes(id) && 'on')} onClick={() => setTanlov(t => (t.includes(id) ? t.filter(x => x !== id) : t.length < 3 ? [...t, id] : t))}>✗ {tr(BOLAK_NOM[id])}</button>)}</div>
      <p className="gv-kulrang">{tr({ uz: "Qolgan ✗ lar — uyga vazifada.", ru: 'Остальные ✗ — в домашнем задании.' })}</p>
    </div>
  );
  const tuzKarta = karta && (
    <div key={'t' + j + (tahrir !== null ? 'e' : '')} ref={kRef} className={cxx('gv-karta', xato && xato.blok && 'err')}>
      <div className="gv-karta-h"><b className="gv-manba-q">{manbaQator}</b><span className="gv-karta-n">{j + 1}{NB}/{NB}3</span></div>
      {karta.tur !== 'x' && <p className="gv-kulrang">{karta.tur === 'savol' ? tr({ uz: "Bu savolga qaysi bo'lak javob berishi kerak?", ru: 'Какая часть должна ответить на этот вопрос?' }) : tr({ uz: "Qaysi bo'lakni yanada aniqroq qilasiz?", ru: 'Какую часть сделаете ещё точнее?' })}</p>}
      <div className="gv-bolak-q">{BOLAK_ID.map(id => <button key={id} type="button" className={cxx('gv-bolak-t', tb === id && 'on', !tb && 'chorla')} onClick={() => { setTb(id); setXato(null); }}>{tr(BOLAK_NOM[id])}</button>)}</div>
      <div className={cxx('gv-maydon', tb && !matn.trim() && 'chorla')}>
        <i className="gv-maydon-n">{j + 1}</i>
        <textarea className={cxx('gv-inp', xato && xato.blok && 'err')} rows={2} maxLength={120} value={matn} placeholder={tr({ uz: "Bu bo'lakda nima o'zgaradi?", ru: 'Что изменится в этой части?' })} aria-label={tr({ uz: 'Tuzatish', ru: 'Исправление' })} onChange={(e) => { setMatn(e.target.value); setXato(null); }} />
      </div>
      {xato && <QXato key={xato.n}>{tr(S7_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && YANA(tr({ uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — снова нажмите «Сохранить».' }))}
      {yordam && <div className="gv-yordam fade-step">
        <p>{tr({ uz: 'Mentor misolida:', ru: 'В примере Ментора:' })} {MENTOR_TUZATISH.map((t, i) => <React.Fragment key={i}>{i > 0 && ' · '}{tr(BOLAK_NOM[t.bolak])} — «{tr(t.nima)}»</React.Fragment>)}</p>
        <p>{tr({ uz: "Har tuzatish izohga yoki savolga javob beradi. Yangi son to'qimang — faqat manbasi bor son; bilmasangiz «hali tekshirilmagan» deb yozing.", ru: 'Каждое исправление отвечает на замечание или вопрос. Не выдумывайте новое число — только число с источником; если не знаете, напишите «ещё не проверено».' })}</p>
      </div>}
      <div className="gv-karta-tug">
        <QTugma className={cxx(tb && matn.trim() && 'gv-halqa')} disabled={band} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        <QTugma ikkinchi className="gv-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
  const strip = <div className="gv-strip">
    <p className="gv-kulrang">{tr({ uz: "Uch bandning hammasi xato degani emas: biri savolga javob, biri bo'lakni yanada aniq qilish bo'lishi mumkin.", ru: 'Три пункта — не обязательно три ошибки: один может отвечать на вопрос, другой — делать часть точнее.' })}</p>
    <span className="gv-strip-y">{tr({ uz: 'Tuzatishlarim', ru: 'Мои исправления' })} · {n}/3</span>
  </div>;
  const forma = isMentor
    ? <div className="gv-fokus"><Zoomable><GuruhVaraqSahna yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>}
      guruh={<Varaq ixcham qatorlar={mentorQatorlar(r => ({ royxatda: r.belgi === '✗' }))} hakam={{ yorliq: tr({ uz: 'Hakam savoli', ru: 'Вопрос судьи' }), matn: tr(MENTOR_HAKAM_SAVOL), royxatda: true }} />}
      varaq={<Royxat bandlar={MENTOR_TUZATISH.map(t => ({ nom: tr(BOLAK_NOM[t.bolak]), nima: tr(t.nima) }))} />} /></Zoomable>
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Uch tuzatish yozdi', ru: 'Написали три исправления' }} /></div>
    : !sq
      ? <p className="gv-kulrang gv-bosh-xabar">{tr({ uz: "Tuzatishlar varaqdan chiqadi — avval pitchni aytib, varaqni to'ldiring.", ru: 'Исправления берутся из листа — сначала расскажите питч и заполните лист.' })}</p>
      : done
        ? <div className="gv-fokus q-fokus"><Zoomable>{royxatEl(true)}</Zoomable>
          <QXulosa>{tr({ uz: "Tuzatishlar ro'yxatingiz tayyor: uch bo'lak va har birida nima o'zgaradi.", ru: 'Ваш список исправлений готов: три части и что в каждой изменится.' })}</QXulosa></div>
        : <div className="gv-ish-w">
          <div className="gv-ish">
            <Zoomable>{varaqEl}</Zoomable>
            <div className="gv-ong">{tanlandi ? tuzKarta : tanlashKarta}{royxatEl(false)}</div>
          </div>
        </div>;
  return (
    <Stage eyebrow={tr({ uz: "Mustaqil ish · tuzatishlar ro'yxati", ru: 'Самостоятельная работа · список исправлений' })} screen={screen} scrollSignal={n * 10 + (tahrir ?? 9)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done && !!sq && !isMentor} label={done || !sq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch bandni yozing (${n}/3)`, ru: `Напишите три пункта (${n}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Varaqingizdan <A>uchta tuzatish yozing.</A></>, ru: <>Напишите по своему листу <A>три исправления.</A></> })}
        mentor={<Mentor>{tr({ uz: "Har kartadagi izohni o'qing va shu bo'lakda nima o'zgarishini bir gapda yozing.", ru: 'Прочитайте замечание на каждой карточке и одной фразой напишите, что изменится в этой части.' })}</Mentor>}
        qadamlar={!isMentor && sq && !done && strip}
        forma={forma}
      />
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s8 = 3; ikkala trekka to'g'ri) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Guruh Raqamlar bo'lagingizga ✗ qo'ydi. Endi nima qilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Guruh Raqamlar bo'lagingizga ✗ qo'ydi. <A>Endi nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">Группа поставила вашей части «Цифры» ✗. <A>Что будете делать?</A></h2> })}
    options={[
      { uz: 'Tinglovchini ko\'ndirib, belgini almashtiraman', ru: 'Уговорю слушателя и поменяю знак' },
      { uz: "Bo'lakdagi belgini o'chirib, saqlab qo'yaman", ru: 'Сотру знак у части и сохраню' },
      { uz: 'Boshqa guruhga aytib, yangi belgi olaman', ru: 'Расскажу другой группе и получу новый знак' },
      { uz: "Izohni o'qib, shu bo'lakka tuzatish yozaman", ru: 'Прочитаю замечание и напишу исправление к этой части' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Izoh qaysi joyni tuzatishni aytadi — u ro'yxatga yoziladi.", ru: 'Замечание говорит, какое место исправить, — оно идёт в список.' }}
    explainWrong={{
      0: { uz: 'Tinglovchi nimani tushunmadi? Izohda yozilgan.', ru: 'Что слушатель не понял? Это написано в замечании.' },
      1: { uz: "Belgi o'chsa ham, kamchilik qoladi.", ru: 'Даже если стереть знак, недостаток останется.' },
      2: { uz: "Bu guruh nimani ko'rsatdi — izohni o'qing.", ru: 'Что показала эта группа — прочитайте замечание.' },
      default: { uz: "Mentor ✗ olgan bo'laklar bilan nima qildi?", ru: 'Что Ментор сделал с частями, получившими ✗?' }
    }}
    vizual={<MiniUchish />} />
);

// ===== 🏅 BADGES (nishonlar, 4 — PM: «!» bilan, 9.23) — faqat ish qilingan ekranlarda (S-034) =====
const ACHIEVEMENTS = {
  partNotPerson: { icon: '🎯', name: 'Part, Not Person!', desc: { uz: "Izohni bo'lak haqida yozishni tanladingiz", ru: 'Вы выбрали замечание о части' } },
  fixFinder: { icon: '🔧', name: 'Fix Finder!', desc: { uz: "Mentor varag'idan uch aniq tuzatishni topdingiz", ru: 'Вы нашли три точных исправления по листу Ментора' } },
  pitchRound: { icon: '⏱️', name: 'Pitch Round!', desc: { uz: 'Pitchni taymer bilan aytdingiz, varaq saqlandi', ru: 'Вы рассказали питч с таймером, лист сохранён' } },
  threeFixes: { icon: '✍️', name: 'Three Fixes!', desc: { uz: 'Varaqingizdan uchta tuzatish yozdingiz', ru: 'Вы написали три исправления по своему листу' } }
};
// Ekran id → nishon: s3 — ballik test (birinchi urinish) · tuzatish — 4-ekran kartalari (xatosiz). pitchRound, threeFixes — ish qilingan ekranda earn() bilan.
const ACH_TRIGGERS = { s3: 'partNotPerson', tuzatish: 'fixFinder' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 8)
const Q_LABELS = {
  3: { uz: '1 — Izoh nima haqida', ru: '1 — О чём замечание' },
  5: { uz: '2 — Aniq tuzatish', ru: '2 — Точное исправление' },
  8: { uz: 'Yakuniy — ✗ olganda nima qilasiz', ru: 'Итог — что делать, получив ✗' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}, emojisiz)
const QZ_BG_SHAPES = [
  { ch: { uz: 'pitch', ru: 'питч' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "bo'lak", ru: 'часть' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'varaq', ru: 'лист' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'izoh', ru: 'замечание' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'hakam', ru: 'судья' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'guruh', ru: 'группа' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: { uz: 'tinglovchi', ru: 'слушатель' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'tuzatish', ru: 'исправление' }, l: 56, t: 50, s: 22, d: 22, dl: 3.3 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 88, t: 44, s: 22, d: 24, dl: 2.6 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12.
const QUIZ_BANK = [
  { q: { uz: 'Bu darsda varaq qachon to\'ldiriladi?', ru: 'Когда на этом уроке заполняют лист?' }, opts: [{ uz: 'Pitch oxirigacha aytilgandan keyin', ru: 'После того как питч рассказан до конца' }, { uz: "Har bo'lak aytilayotgan paytda", ru: 'Пока рассказывают каждую часть' }, { uz: 'Pitch boshlanishidan ancha oldin', ru: 'Задолго до начала питча' }, { uz: 'Faqat uyda, dars tugaganidan keyin', ru: 'Только дома, после урока' }], correct: 0 },
  { q: { uz: "Mentor misolida guruh qaysi bo'laklarga ✗ qo'ydi?", ru: 'Каким частям в примере Ментора группа поставила ✗?' }, opts: [{ uz: 'Muammo va Yechim', ru: 'Проблема и Решение' }, { uz: 'Bozor va Raqamlar', ru: 'Рынок и Цифры' }, { uz: 'Jamoa va Raqamlar', ru: 'Команда и Цифры' }, { uz: 'Muammo va Bozor', ru: 'Проблема и Рынок' }], correct: 1 },
  { q: { uz: 'Mentor tuzatishida «60 kishi» kimlar?', ru: 'Кто такие «60 человек» в исправлении Ментора?' }, opts: [{ uz: 'Ilovadagi hamma tashkilotchilar', ru: 'Все организаторы в приложении' }, { uz: 'Mahalladagi hamma maydon egalari', ru: 'Все владельцы площадок в махалле' }, { uz: "Mahalla futbol guruhi a'zolari", ru: 'Участники футбольной группы махалли' }, { uz: 'Mentorning hamma sinfdoshlari', ru: 'Все одноклассники Ментора' }], correct: 2 },
  { q: { uz: 'Guruh rejimida hakam savolini kim yozadi?', ru: 'Кто в групповом режиме пишет вопрос судьи?' }, opts: [{ uz: "Pitch aytgan o'quvchining o'zi", ru: 'Сам ученик, рассказавший питч' }, { uz: 'Mentor, dars boshlanishidan oldin', ru: 'Ментор, до начала урока' }, { uz: "Agent, pitch matnini o'qib chiqib", ru: 'Агент, прочитав текст питча' }, { uz: 'Tinglovchilar, pitchdan keyin', ru: 'Слушатели, после питча' }], correct: 3 },
  { q: { uz: "Guruhda fikrlar har xil bo'lsa, varaqda nima bo'ladi?", ru: 'Что будет в листе, если мнения в группе разные?' }, opts: [{ uz: 'Muhokamadan keyin bitta belgi', ru: 'После обсуждения — один знак' }, { uz: "Ko'pchilik qo'yadigan ✓ belgisi", ru: 'Знак ✓, который ставит большинство' }, { uz: 'Qator hech qanday belgisiz qoladi', ru: 'Строка остаётся без знака' }, { uz: 'Ikkala belgi ham yonma-yon turadi', ru: 'Оба знака стоят рядом' }], correct: 0 },
  { q: { uz: 'Mentor varag\'ida ikkita ✗. Uchinchi tuzatish qayerdan olindi?', ru: 'В листе Ментора два ✗. Откуда взято третье исправление?' }, opts: [{ uz: 'Sinfdagi ovozlar sonidan', ru: 'Из числа голосов в классе' }, { uz: 'Guruhning hakam savolidan', ru: 'Из вопроса судьи от группы' }, { uz: "Mentorning o'z taxminidan", ru: 'Из догадки самого Ментора' }, { uz: 'Pitchning umumiy vaqtidan', ru: 'Из общего времени питча' }], correct: 1 },
  { q: { uz: 'Bu darsda tuzatish qanday yoziladi?', ru: 'Как на этом уроке пишут исправление?' }, opts: [{ uz: "Faqat bo'lakning nomi bilan", ru: 'Только названием части' }, { uz: 'Pitchdagi hamma gaplar bilan', ru: 'Всеми фразами питча' }, { uz: "Bo'lak va unda nima o'zgarishi", ru: 'Часть и что в ней изменится' }, { uz: 'Tinglovchining ismi bilan birga', ru: 'Вместе с именем слушателя' }], correct: 2 },
  { q: { uz: 'Mentor «tasdiq — to\'lovmi?» izohiga qanday tuzatish yozdi?', ru: 'Какое исправление Ментор написал к замечанию «подтверждение — это оплата?»?' }, opts: [{ uz: 'Tasdiqlarni pitchdan olib tashlash', ru: 'Убрать подтверждения из питча' }, { uz: '"Pro\'ni sotib oldi" deb aytish', ru: 'Сказать «купили Pro»' }, { uz: 'Tasdiqlar sonini oshirib aytish', ru: 'Назвать подтверждений больше' }, { uz: 'Tasdiq nima ekanini tushuntirish', ru: 'Объяснить, что такое подтверждение' }], correct: 3 },
  { q: { uz: "Qaysi izoh bo'lak haqida yozilgan?", ru: 'Какое замечание написано о части?' }, opts: [{ uz: '«Yechimda nima qilishi aytilmadi»', ru: '«В Решении не сказано, что он делает»' }, { uz: '«Siz juda hayajonlanib gapirdingiz»', ru: '«Вы говорили очень взволнованно»' }, { uz: '«Umuman olganda menga yoqmadi»', ru: '«В целом мне не понравилось»' }, { uz: '«Mening pitchim yaxshiroq chiqdi»', ru: '«Мой питч получился лучше»' }], correct: 0 },
  { q: { uz: "Guruh bo'lmasa, varaqni kim to'ldiradi?", ru: 'Кто заполняет лист, если группы нет?' }, opts: [{ uz: "Mentor, darsdan keyin o'zi", ru: 'Ментор, сам после урока' }, { uz: "O'zingiz, yozuvni ko'rib", ru: 'Вы сами, посмотрев запись' }, { uz: 'Varaqsiz qoladi — kerak emas', ru: 'Без листа — он не нужен' }, { uz: "Agent, pitch matnini o'qib", ru: 'Агент, прочитав текст питча' }], correct: 1 },
  { q: { uz: 'Yakka rejimda pitch yozuvi qayerda qoladi?', ru: 'Где остаётся запись питча в одиночном режиме?' }, opts: [{ uz: 'Sinfning chatiga yuboriladi', ru: 'Отправляется в чат класса' }, { uz: 'Mentorga havolasi yuboriladi', ru: 'Ментору отправляют ссылку' }, { uz: 'Faqat telefoningizda qoladi', ru: 'Остаётся только в вашем телефоне' }, { uz: 'Guruh kanaliga joylanadi', ru: 'Выкладывается в канал группы' }], correct: 2 },
  { q: { uz: 'Hakam «Nega maydon egalari pul to\'lamaydi?» desa, Mentor nima deydi?', ru: 'Если судья спросит «Почему владельцы площадок не платят?», что ответит Ментор?' }, opts: [{ uz: "«Ular ham keyin to'lab beradi»", ru: '«Они тоже потом заплатят»' }, { uz: "«Bu savolning pitchga aloqasi yo'q»", ru: '«Этот вопрос не связан с питчем»' }, { uz: '«Maydon egalari bizga kerak emas»', ru: '«Владельцы площадок нам не нужны»' }, { uz: "«Ular bugun to'lovchi emas»", ru: '«Сегодня они не плательщики»' }], correct: 3 }
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
  }, [live && live.pin, screen, signal]);
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

// 🃏 KARTOCHKALAR — 12 (MD 10-ekran; mexanika va ko'rinish — qolipda: QKartochka, DE-204). Mentorsiz (SABOQ 16); karta neytral (SABOQ P10).
const FLASHCARDS = [
  { front: { uz: 'Bu darsda varaqda nima yoziladi?', ru: 'Что на этом уроке пишут в листе?' }, back: { uz: "Har bo'lakka ✓ yoki ✗, ✗ yonida izoh va oxirida bitta hakam savoli", ru: 'Каждой части ✓ или ✗, рядом с ✗ — замечание, в конце — один вопрос судьи' }, note: { uz: "12-Moduldagi baholash varag'i — bugun olti qator", ru: 'Оценочный лист из 12-го модуля — сегодня шесть строк' } },
  { front: { uz: "Varaq qachon to'ldiriladi?", ru: 'Когда заполняют лист?' }, back: { uz: 'Pitch oxirigacha aytilgandan keyin', ru: 'После того как питч рассказан до конца' }, note: { uz: 'Pitch davomida tinglovchilar jim', ru: 'Во время питча слушатели молчат' } },
  { front: { uz: '✗ yonidagi izoh nima haqida bo\'ladi?', ru: 'О чём замечание рядом с ✗?' }, back: { uz: "Bo'lak haqida: unda nima yetishmagani", ru: 'О части: чего в ней не хватило' }, note: { uz: "Odam haqida gap yo'q", ru: 'Ни слова о человеке' } },
  { front: { uz: 'Hakam savoli nima?', ru: 'Что такое вопрос судьи?' }, back: { uz: "Tinglovchi pitchdan keyin hakam o'rnida yozgan bitta savol", ru: 'Один вопрос, который слушатель после питча записал в роли судьи' }, note: { uz: 'Pitchdan keyin tinglovchida qolgan savol', ru: 'Вопрос, оставшийся у слушателя после питча' } },
  { front: { uz: "Guruhda fikrlar har xil bo'lsa, belgi qanday qo'yiladi?", ru: 'Как ставят знак, если мнения в группе разные?' }, back: { uz: 'Muhokama qilib, bitta belgi — tushunarsiz joy izohda', ru: 'Обсудив, один знак — непонятное место в замечании' }, note: { uz: 'Varaq — guruhning bitta umumiy yozuvi', ru: 'Лист — одна общая запись группы' } },
  { front: { uz: "Mentor misolida guruh qaysi bo'laklarga ✗ qo'ydi?", ru: 'Каким частям в примере Ментора группа поставила ✗?' }, back: { uz: 'Bozor va Raqamlar', ru: 'Рынок и Цифры' }, note: { uz: "Izohlar: «60 kishi kim — o'yinchimi, guruhmi?» va «tasdiq — to'lovmi?»", ru: 'Замечания: «60 человек — кто это: игроки или группа?» и «подтверждение — это оплата?»' } },
  { front: { uz: "Tuzatishlar ro'yxati nima?", ru: 'Что такое список исправлений?' }, back: { uz: "Uch band: qaysi bo'lak va unda nima o'zgaradi", ru: 'Три пункта: какая часть и что в ней изменится' }, note: { uz: "Bugun bo'laklar qayta yozilmaydi", ru: 'Сегодня части не переписывают' } },
  { front: { uz: "✗ ikkita bo'lsa, uchinchi band qayerdan olinadi?", ru: 'Если ✗ два, откуда берут третий пункт?' }, back: { uz: 'Hakam savolidan', ru: 'Из вопроса судьи' }, note: { uz: "Unga qaysi bo'lak javob berishi kerakligini tanlaysiz", ru: 'Вы выбираете, какая часть должна на него ответить' } },
  { front: { uz: "Hammasi ✓ bo'lsa, tuzatish qayerdan olinadi?", ru: 'Если везде ✓, откуда берут исправление?' }, back: { uz: "Hakam savolidan va yanada aniqroq bo'ladigan bo'lakdan", ru: 'Из вопроса судьи и из части, которую можно сделать точнее' }, note: { uz: "Yo'q kamchilik o'ylab topilmaydi", ru: 'Несуществующий недостаток не выдумывают' } },
  { front: { uz: 'Tuzatishda nima yoziladi?', ru: 'Что пишут в исправлении?' }, back: { uz: "Bo'lakda aynan qaysi gap yoki son o'zgarishi", ru: 'Какая именно фраза или число в части изменится' }, note: { uz: "To'qilgan son va va'da qo'shilmaydi — faqat manbasi bor son", ru: 'Выдуманное число и обещание не добавляют — только число с источником' } },
  { front: { uz: "Mentor «tasdiq — to'lovmi?» izohiga qanday tuzatish yozdi?", ru: 'Какое исправление Ментор написал к замечанию «подтверждение — это оплата?»?' }, back: { uz: 'Tasdiq nima ekanini aytaman: yozma javob, pul emas', ru: 'Скажу, что такое подтверждение: письменный ответ, не деньги' }, note: { uz: "Gapda «to'lov emas» bor edi — tinglovchida savol qolgan", ru: 'Во фразе было «не оплата» — у слушателя остался вопрос' } },
  { front: { uz: "Guruh bo'lmasa, varaqni kim to'ldiradi?", ru: 'Кто заполняет лист, если группы нет?' }, back: { uz: "O'zingiz: pitchni telefonga yozib, bir marta ko'rib", ru: 'Вы сами: записав питч на телефон и посмотрев один раз' }, note: { uz: 'Yozuv telefonda qoladi', ru: 'Запись остаётся в телефоне' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('gv-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="gv-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi.', ru: 'Нажмите на карточку — откроется ответ.' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + ① ② + shartli ③; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z pitchingiz", ru: 'ваш питч' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: 'ikki ish', ru: 'два дела' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_BANDLAR = [
  { uz: "Uch tuzatishni pitchingizga kiriting: har bandda aytilgan bo'lakni qayta yozing; vaqt 5 daqiqadan oshgan bo'lsa — qaysi bo'lak qisqarishini ham belgilang.", ru: 'Внесите три исправления в питч: перепишите часть из каждого пункта; если время больше 5 минут — отметьте и то, какая часть сократится.' },
  { uz: 'Pitchni taymer bilan bir marta ovoz chiqarib ayting — xohlasangiz tanish odamga, bo\'lmasa o\'zingiz telefonga yozib.', ru: 'Один раз расскажите питч вслух с таймером — если хотите, знакомому человеку, если нет — запишите себя на телефон.' }
];
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card gv-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="gv-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="gv-hw-q"><span className="gv-hw-k">{tr(r.k)}</span><span className="gv-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="gv-hw-qadam">
      {HW_BANDLAR.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}
      {qolgan.length > 0 && <li><i>{HW_RAQAM[2]}</i><span>{tr({ uz: 'Darsda qolgan ishni tugating:', ru: 'Доделайте то, что осталось с урока:' })} {qolgan.map(tr).join('; ')}.</span></li>}
    </ol>
    <p className="gv-kulrang">{tr({ uz: "Yozuv telefoningizda qoladi — hech qayerga yuklanmaydi; tinglovchining ismi yozilmaydi.", ru: 'Запись остаётся в вашем телефоне — никуда не загружается; имя слушателя не пишут.' })}</p>
    {keyingi && <span className="gv-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolip QYakun (DE-204) + holatga qarab sarlavha (4 holat, E 54). Standart (E 50): chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar =====
// «Bugungi asosiy fikr» qutisi va artefakt-strip — ko'rsatilmaydi (E 50). Belgi ✓ — faqat birinchi ikki holatda.
const SARLAVHA = {
  guruh: { uz: "Guruh varag'i olindi, uchta tuzatish yozildi.", ru: 'Лист группы получен, три исправления написаны.' },
  yakka: { uz: "Varaqni o'zingiz to'ldirdingiz, uchta tuzatish yozildi.", ru: 'Вы заполнили лист сами, три исправления написаны.' },
  qisman: { uz: "Varaq tayyor — tuzatishlar ro'yxati hali tugamagan.", ru: 'Лист готов — список исправлений ещё не закончен.' },
  bosh: { uz: "Varaq hali to'ldirilmagan — pitch va ro'yxat qoldi.", ru: 'Лист ещё не заполнен — остались питч и список.' }
};
const RECAP = [
  { uz: "Bu darsda varaqda har bo'lakka ✓ yoki ✗, ✗ yonida izoh va oxirida bitta hakam savoli turadi.", ru: 'На этом уроке в листе у каждой части ✓ или ✗, рядом с ✗ — замечание, а в конце — один вопрос судьи.' },
  { uz: "Izoh bo'lak haqida: unda nima yetishmagani yoziladi, odam haqida emas.", ru: 'Замечание — о части: в нём пишут, чего не хватило, а не о человеке.' },
  { uz: "Tuzatishlar ro'yxati — uch band: qaysi bo'lak va unda nima o'zgaradi.", ru: 'Список исправлений — три пункта: какая часть и что в ней изменится.' },
  { uz: "Tuzatish izohga yoki savolga javob beradi: to'qilgan son va va'da qo'shilmaydi — faqat manbasi bor son.", ru: 'Исправление отвечает на замечание или вопрос: выдуманное число и обещание не добавляют — только число с источником.' }
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
  // Holat — pm-m12d5-varaq dan (P-046): tur, varaq saqlangan-saqlanmagan, tuzatishlar.length; mentor proyektorida — to'liq
  const v = varaqOl();
  const tz = v && Array.isArray(v.tuzatishlar) ? v.tuzatishlar.length : 0;
  const holat = isMentorL ? 'guruh' : !v ? 'bosh' : tz >= 3 ? (v.tur === 'guruh' ? 'guruh' : 'yakka') : 'qisman';
  const toliq = holat === 'guruh' || holat === 'yakka';
  const xSoni = v ? v.varaq.filter(r => r && r.belgi === '✗').length : 0;
  const qolgan = isMentorL ? [] : [
    ...(!v ? [{ uz: "pitchni telefonga yozib, varaqni o'zingiz to'ldiring", ru: 'запишите питч на телефон и заполните лист сами' }] : []),
    ...(v && tz < 3 ? [{ uz: "tuzatishlar ro'yxatini uchtaga yetkazing", ru: 'доведите список исправлений до трёх' }] : []),
    ...(v && xSoni > 3 ? [{ uz: "qolgan ✗ larni ham ro'yxat ostiga yozing", ru: 'запишите оставшиеся ✗ под списком' }] : [])
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Demoga tayyorgarlik: risklar va B reja»</b></>, ru: <>Следующий урок — <b>«Подготовка к демо: риски и план Б»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('gv-yakun', !toliq && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard qolgan={qolgan} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmPitchTrainingLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 6, 7-ekran nishonlari (ish qilinganda)
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
        /* === 14-Modul 5-dars — darsning o'z vizuali (prefiks gv-): GuruhVaraqSahna · varaq · ro'yxat · karta. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .gv-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        @keyframes gv-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes gv-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes gv-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes gv-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes gv-yashil { 0% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes gv-pop { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes gv-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }
        @keyframes gv-err { 0% { background: ${T.errFon}; } 100% { background: ${T.paper}; } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .gv-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: gv-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.gv-halqa { outline-offset: 3px; }
        .gv-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: gv-chorla-v 1.8s ease-out .5s 2; }
        .gv-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .gv-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: gv-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .gv-bash.ix .q-bashorat { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 6px 12px; padding-top: 8px; padding-bottom: 8px; }
        .gv-bash.ix .q-bashorat > .q-yorliq, .gv-bash.ix .q-bashorat .q-chip:not(.on) { display: none; }
        @media (min-width: 761px) { .gv-k .q-split { grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 28px; } }
        @media (min-width: 761px) { .gv-k .zoomable:not(.zoom-on) > .zoom-btn { right: auto; left: calc(55.5% - 52px); } } /* ⛶ maket burchagida, variant ustida emas (SABOQ P7) */
        .gv-k, .gv-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .gv-harakat { display: flex; flex-direction: column; gap: 8px; }
        .gv-qadamlar { display: flex; flex-wrap: wrap; gap: 8px; }
        .gv-qadamlar .q-chip i { font-style: normal; font-weight: 800; color: ${T.accent}; margin-right: 7px; }
        .gv-qadamlar .q-chip.ok i { color: ${T.ok}; }
        .gv-qadamlar .q-chip.gv-joriy { animation: gv-puls 2.2s ease-out .3s 3; }
        p.gv-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.gv-kulrang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.gv-yana { margin: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .q-xulosa .gv-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .gv-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .gv-xq-m { display: block; }
        .q-xulosa .gv-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        /* GuruhVaraqSahna */
        .gv-sahna-w { display: flex; flex-direction: column; gap: 12px; }
        .gv-sahna { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.05fr); gap: 20px; align-items: start; }
        .gv-sahna.faqat-ong, .gv-sahna.faqat-chap { grid-template-columns: minmax(0,1fr); }
        .gv-sahna-ch, .gv-sahna-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .gv-sahna-y { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .gv-gap { display: flex; align-items: flex-start; gap: 12px; }
        .gv-gap-o { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .gv-gap-y { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 800; color: ${T.ink2}; text-transform: lowercase; }
        .gv-gap-y > i { width: 12px; height: 12px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .gv-yoz { font-style: normal; font-weight: 700; font-size: 12px; color: ${T.err}; display: inline-flex; align-items: center; gap: 5px; margin-left: 6px; }
        .gv-yoz::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: ${T.err}; }
        p.gv-pufak { margin: 0; position: relative; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 4px 14px 14px 14px; padding: 10px 14px; font-size: 15px; line-height: 1.45; color: ${T.ink}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.4); animation: gv-kir .3s ease-out both; }
        p.gv-pufak.bosh { color: ${T.ink2}; }
        .gv-pufak-b { display: block; font-size: 12.5px; font-weight: 800; color: ${T.accent}; margin-bottom: 2px; }
        .gv-yozilmagan { color: ${T.ink2}; font-style: italic; }
        .gv-ajrat { color: ${T.accent}; font-weight: 800; }
        .gv-gap-o p.gv-kulrang { font-size: 13px; }
        .gv-tel { width: 92px; height: 146px; border-radius: 16px; background: #1E1B26; padding: 6px; flex: none; display: flex; animation: gv-kir .3s ease-out both; }
        .gv-tel-e { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 11px; padding: 8px 7px; display: flex; flex-direction: column; gap: 2px; }
        .gv-tel-nom { font-size: 9.5px; }
        .gv-tel-vaqt { font-size: 10.5px; color: ${T.ink}; margin-top: 6px; }
        .gv-tel-joy { font-size: 9px; color: ${T.ink2}; }
        .gv-tel-son { margin-top: auto; font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .gv-tel-son.yangi { color: ${MJ_RANG}; animation: gv-pop .5s cubic-bezier(.3,1.5,.5,1); }
        /* Tinglovchilar — bitta urg'uli rol kartasi (SABOQ P1) */
        .gv-tng { display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 28px -16px ${fon(T.accent, 0.6)}; animation: gv-kir .4s ease-out both; }
        .gv-tng-ava { width: 44px; height: 44px; border-radius: 50%; background: ${T.accent}; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 0 0 5px ${T.accentSoft}; }
        .gv-doira { display: inline-flex; gap: 3px; }
        .gv-doira i { width: 9px; height: 9px; border-radius: 50%; background: #fff; }
        .gv-reja-g .gv-doira i { width: 14px; height: 14px; background: ${T.accent}; opacity: .85; }
        .gv-tng-o { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .gv-tng-b { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .gv-tng-nom { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        .gv-tng-y { font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 10px; }
        .gv-tng-sl { display: flex; flex-wrap: wrap; gap: 6px 10px; }
        .gv-tng-s { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; line-height: 1.35; color: ${T.ink}; animation: gv-kir .35s ease-out both; }
        .gv-tng-s > i { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 13px; background: ${T.bg}; color: ${T.ink2}; flex: none; }
        .gv-tng-s.q > i { background: ${T.accentSoft}; color: ${T.accent}; animation: gv-pop .4s ease-out; }
        /* Taymer chizig'i */
        .gv-tm { display: flex; flex-direction: column; gap: 4px; }
        .gv-tm-y { align-self: flex-end; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .gv-tm-q { display: flex; gap: 3px; align-items: flex-start; }
        .gv-tm-chiziq { flex: 1; min-width: 0; display: flex; gap: 3px; }
        .gv-tm-bo { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .gv-tm-t { display: block; height: 11px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .gv-tm-t > i { display: block; height: 100%; background: ${T.accent}; }
        .gv-tm-bo.ok .gv-tm-t { border-color: ${T.ok}; } .gv-tm-bo.ok .gv-tm-t > i { background: ${T.ok}; }
        .gv-tm-bo.xato .gv-tm-t { border: 2px solid ${T.err}; } .gv-tm-bo.xato .gv-tm-t > i { background: ${fon(T.err, 0.55)}; }
        .gv-tm-bo.joriy .gv-tm-t { box-shadow: 0 0 0 2px ${fon(T.accent, 0.35)}; }
        .gv-tm-bo.halqa .gv-tm-t { box-shadow: 0 0 0 3px ${T.accent}; animation: gv-puls 1.8s ease-out .2s 3; }
        .gv-tm-bo em { font-style: normal; font-size: 11.5px; line-height: 1.15; font-weight: 700; color: ${T.ink2}; text-align: center; }
        .gv-tm-bo.joriy em, .gv-tm-bo.halqa em { color: ${T.accent}; }
        .gv-tm-bo.xato em { color: ${T.err}; }
        .gv-tm-osh { display: flex; flex-direction: column; gap: 4px; min-width: 44px; }
        .gv-tm-osh .gv-tm-t { border-color: ${T.err}; } .gv-tm-osh .gv-tm-t > i { width: 100%; background: ${T.err}; }
        .gv-tm-osh em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.err}; text-align: center; }
        .gv-tm-chet { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .gv-tm.katta .gv-tm-t { height: 22px; border-radius: 7px; } .gv-tm.katta .gv-tm-bo em { font-size: 15px; }
        /* Baholash varag'i — jadval («ma'lumot» ko'rinishi, E 45: to'q sarlavha, katak chiziqlari, kulrang fon, soyasiz) */
        .gv-varaq { border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.bg}; }
        .gv-v-h { background: ${T.ink}; color: #fff; font-size: 13.5px; font-weight: 800; padding: 8px 12px; letter-spacing: .01em; }
        .gv-v-q { display: grid; grid-template-columns: minmax(0,1.15fr) 34px minmax(0,1.6fr); align-items: center; gap: 10px; padding: 6px 12px; border-top: 1px solid ${T.line}; transition: opacity .3s; }
        .gv-v-nom { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .gv-v-nom b { font-size: 14px; color: ${T.ink}; }
        .gv-v-nom small { font-size: 12px; line-height: 1.3; color: ${T.ink2}; }
        .gv-v-b { width: 30px; height: 30px; border-radius: 8px; border: 1.5px dashed ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; background: ${T.paper}; }
        .gv-v-b.ok { border: none; background: ${T.ok}; color: #fff; animation: gv-pop .4s ease-out; }
        .gv-v-b.x { border: none; background: ${T.err}; color: #fff; animation: gv-pop .4s ease-out; }
        .gv-v-iz { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; font-size: 14px; line-height: 1.35; color: ${T.ink}; }
        .gv-v-izm { animation: gv-kir .4s ease-out both; }
        .gv-v-hk .gv-v-r { align-self: flex-start; }
        .gv-sahna-on > .gv-karta:first-child .gv-karta-h, .gv-sahna-on > .gv-royxat:first-child .gv-r-h, .gv-sahna-on > .gv-varaq:first-child .gv-v-h, .gv-sahna.faqat-chap .gv-sahna-ch > :first-child { padding-right: 40px; }
        .gv-v-r { font-style: normal; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 1px 8px; white-space: nowrap; }
        .gv-v-q.xira { opacity: .45; }
        .gv-v-q.ajrat { background: ${T.paper}; box-shadow: inset 3px 0 0 ${T.accent}; }
        .gv-v-q.yangi { animation: gv-yashil 1s ease-out; }
        .gv-v-hk { display: flex; flex-direction: column; gap: 3px; margin: 8px 10px 10px; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .gv-v-hk.bosh { border: 1.5px dashed ${fon(T.accent, 0.5)}; background: transparent; min-height: 52px; }
        .gv-v-hk.ajrat { box-shadow: inset 3px 0 0 ${T.accent}; }
        .gv-v-hk.yangi { border-color: ${T.accent}; animation: gv-yashil 1.1s ease-out; }
        .gv-v-hk-y { font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .gv-v-hk-m { font-size: 15px; font-weight: 600; line-height: 1.4; color: ${T.ink}; }
        .gv-v-vaqt { padding: 0 12px 10px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .gv-varaq.ixcham .gv-v-q { padding: 5px 12px; }
        /* Tuzatishlar ro'yxati */
        .gv-royxat { display: flex; flex-direction: column; gap: 6px; }
        .gv-r-h { font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .gv-r-q { display: flex; align-items: center; gap: 10px; min-height: 38px; padding: 5px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .gv-r-q.bosh { background: transparent; border: 1.5px dashed ${fon(T.accent, 0.45)}; }
        .gv-r-q.yangi { animation: gv-yashil 1.1s ease-out; border-color: ${T.ok}; }
        .gv-r-q > i { width: 24px; height: 24px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; flex: none; }
        .gv-r-m { flex: 1; min-width: 0; font-size: 15px; line-height: 1.4; color: ${T.ink}; }
        .gv-r-m b { color: ${T.accent}; }
        .gv-tahrir { border: none; background: ${T.bg}; color: ${T.ink2}; border-radius: 8px; width: 30px; height: 30px; cursor: pointer; font-size: 14px; flex: none; }
        .gv-tahrir:hover { color: ${T.accent}; }
        /* Uchish — position: fixed nusxa (SABOQ P3) */
        .gv-uchar { position: fixed; z-index: 1300; pointer-events: none; display: flex; align-items: center; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 2px solid ${T.ok}; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; font-size: 14.5px; font-weight: 700; color: ${T.ink}; transform-origin: left center; transition: transform .6s cubic-bezier(.4,.1,.2,1), opacity .6s; }
        .gv-uchar.x { border-color: ${T.err}; color: ${T.err}; justify-content: center; font-size: 18px; }
        .gv-uchar.ok:not(:has(*)) { color: ${T.ok}; }
        .gv-uchar.savol { border-color: ${T.accent}; }
        .gv-uchar.bor { opacity: .9; }
        /* Karta (4, 6, 7-ekran) */
        .gv-ish-w { display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 761px) { .gv-ish.gv-tayyor { grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); } }
        .gv-chap .gv-tm-chet { display: none; }
        .gv-ish { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.05fr); gap: 20px; align-items: start; }
        .gv-ong, .gv-chap { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .gv-karta { background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 9px; animation: gv-kir .4s ease-out both; }
        .gv-karta.err { box-shadow: inset 0 0 0 1.5px ${T.err}, 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .gv-karta-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .gv-karta-h b { font-size: 16px; font-weight: 800; color: ${T.ink}; }
        .gv-karta-h .gv-manba-q { font-size: 14.5px; font-weight: 700; line-height: 1.4; }
        .gv-karta-n { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .gv-x { color: ${T.err}; }
        p.gv-manba { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        p.gv-hs { margin: 0; font-size: 14px; color: ${T.ink2}; }
        .gv-savol { font-size: 14px; font-weight: 700; color: ${T.ink}; margin-right: auto; }
        .gv-varlar { display: flex; flex-direction: column; gap: 8px; }
        .gv-var { text-align: left; font-family: 'Manrope', sans-serif; font-size: 14.5px; font-weight: 600; line-height: 1.4; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 12px; padding: 10px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.45)}; animation: gv-chorla-v 1.8s ease-out .5s 2; transition: background .2s; }
        .gv-var:nth-child(2) { animation-delay: .8s; } .gv-var:nth-child(3) { animation-delay: 1.1s; }
        .gv-var:hover:not(:disabled) { background: ${T.accentSoft}; }
        .gv-var.err { animation: gv-silk .4s ease-out, gv-err 1s ease-out; box-shadow: inset 0 0 0 1.5px ${T.err}; }
        .gv-var:disabled { cursor: default; opacity: .7; }
        .gv-bt-q { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .gv-bt { width: 48px; height: 40px; border-radius: 10px; border: none; background: ${T.paper}; font-size: 18px; font-weight: 800; cursor: pointer; border: 1.5px solid ${T.line}; }
        .gv-bt.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.55)}; } .gv-bt.x { color: ${T.err}; border-color: ${fon(T.err, 0.55)}; }
        .gv-bt.chorla { animation: gv-chorla 1.8s ease-out .4s 2; } .gv-bt.x.chorla { animation-delay: .75s; }
        .gv-bt.ok.on { background: ${T.ok}; border-color: ${T.ok}; color: #fff; } .gv-bt.x.on { background: ${T.err}; border-color: ${T.err}; color: #fff; }
        .gv-maydon { position: relative; }
        .gv-maydon-n { position: absolute; left: 11px; top: 10px; width: 22px; height: 22px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        textarea.gv-inp { display: block; width: 100%; resize: vertical; min-height: 64px; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px 14px 10px 42px; outline: none; }
        textarea.gv-inp:focus { border-color: ${T.accent}; }
        textarea.gv-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .gv-maydon.chorla textarea.gv-inp { border-color: ${fon(T.accent, 0.6)}; animation: gv-chorla 1.8s ease-out .4s 2; }
        .gv-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: flex-end; }
        .gv-karta-tug .gv-o { margin-left: 0; }
        .gv-oldin { display: flex; flex-direction: column; gap: 5px; background: ${T.bg}; border-radius: 12px; padding: 10px 14px; }
        .gv-oldin b { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .gv-oldin p { margin: 0; font-size: 14px; line-height: 1.45; color: ${T.ink2}; }
        .gv-taymer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: flex-end; }
        .gv-taymer-y { font-size: 13px; font-weight: 800; color: ${T.accent}; margin-right: auto; }
        .gv-taymer-v { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 800; color: ${T.ink}; }
        .gv-taymer-v.osh, .gv-vaqt-q b.osh, .gv-katta-v.osh { color: ${T.err}; }
        .gv-vaqt-q { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 14px; color: ${T.ink2}; }
        .gv-vaqt-q b { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: ${T.ink}; }
        .gv-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .gv-rejim-q { display: flex; gap: 8px; margin-right: 10px; }
        .gv-rejim { font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.45)}; border-radius: 10px; padding: 7px 12px; cursor: pointer; }
        .gv-rejim.on { background: ${T.accentSoft}; color: ${T.accent}; border-color: ${T.accent}; }
        .gv-strip .q-chip.gv-tab { padding: 6px 10px; font-size: 12.5px; cursor: default; }
        .gv-strip .q-chip.gv-tab i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .gv-strip .q-chip.gv-tab.ok i { color: ${T.ok}; }
        .gv-strip-y { font-size: 12px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 11px; margin-left: auto; white-space: nowrap; }
        .gv-bolak-q { display: flex; flex-wrap: wrap; gap: 5px; }
        .zoomable > .gv-royxat { padding-right: 40px; }
        .gv-strip > p.gv-kulrang { flex: 1; min-width: 0; }
        .gv-bolak-t, .gv-tanla { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${fon(T.accent, 0.4)}; border-radius: 9px; padding: 5px 9px; cursor: pointer; }
        .gv-bolak-t.chorla { animation: gv-chorla 1.8s ease-out .4s 2; }
        .gv-bolak-t.on, .gv-tanla.on { background: ${T.accent}; border-color: ${T.accent}; color: #fff; }
        .gv-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .gv-yordam p { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .gv-yordam p + p { font-size: 13px; color: ${T.ink2}; }
        .gv-fokus { display: flex; flex-direction: column; gap: 12px; }
        p.gv-bosh-xabar { font-size: 15px; background: ${T.paper}; border-radius: 12px; padding: 14px 16px; }
        .q-mustaqil:has(.gv-ish), .q-mustaqil:has(.gv-fokus), .q-mustaqil:has(.gv-ish-w) { max-width: none; }
        .gv-proyektor { display: flex; flex-direction: column; gap: 14px; }
        .gv-navbat-q { display: flex; gap: 8px; flex-wrap: wrap; }
        .gv-navbat { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; padding: 7px 13px; cursor: pointer; background: ${T.bg}; color: ${T.ink}; }
        .gv-navbat.on { background: ${T.accent}; color: #fff; }
        .gv-katta-v { font-family: 'JetBrains Mono', monospace; font-size: 64px; font-weight: 800; color: ${T.ink}; text-align: center; }
        .gv-sahna-past { display: flex; flex-direction: column; gap: 8px; }
        @media (min-width: 761px) { .gv-sahna-w.tayyor .gv-sahna { grid-template-columns: minmax(0,1fr) minmax(0,1fr); } }
        .gv-s4 .gv-sahna-on { gap: 12px; }
        .gv-karta.kutadi .gv-bt, .gv-karta.kutadi textarea.gv-inp { pointer-events: none; }
        .gv-mini.gv-mini-src { opacity: .8; }
        /* Reja skeleti */
        .gv-reja { display: flex; flex-direction: column; gap: 12px; }
        .gv-reja-g { display: flex; flex-direction: column; align-items: stretch; gap: 8px; }
        @media (min-width: 761px) { .q-reja .zoomable:not(.zoom-on) > .zoom-btn { right: auto; left: calc(50% - 50px); } }
        .gv-reja-g .gv-tm { flex: 1; min-width: 0; }
        .gv-reja-v { display: grid; grid-template-columns: minmax(0,1.3fr) minmax(0,1fr); gap: 12px; }
        .gv-skelet { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; }
        .gv-skelet-q { font-size: 13.5px; font-weight: 700; color: ${T.ink2}; padding: 5px 10px; border-top: 1px solid ${T.line}; background: ${T.bg}; transition: color .3s, background .3s; }
        .gv-skelet-q:first-child { border-top: none; }
        .gv-skelet-q.on { color: ${T.ink}; background: ${T.paper}; }
        .gv-skelet-r { display: flex; flex-direction: column; gap: 6px; }
        .gv-skelet-r span { flex: 1; min-height: 30px; border-radius: 8px; border: 1.5px dashed ${fon(T.accent, 0.4)}; display: flex; align-items: center; padding: 0 8px; }
        .gv-skelet-r i { font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; }
        /* Test javobidan keyingi kichik vizual (SABOQ 4) */
        .gv-test-viz { margin-top: 2px; }
        .gv-mini { display: inline-flex; align-items: center; gap: 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 12px; font-size: 14.5px; color: ${T.ink}; }
        .gv-mini b { font-weight: 800; }
        .gv-mini > i { width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; color: #fff; background: ${T.ok}; }
        .gv-mini > i.x { background: ${T.err}; }
        .gv-mini-u { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .gv-mini-dst { position: relative; display: flex; align-items: center; gap: 10px; min-width: 260px; min-height: 40px; padding: 7px 12px; border-radius: 10px; border: 1.5px dashed ${fon(T.accent, 0.45)}; }
        .gv-mini-dst > i { width: 24px; height: 24px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .gv-mini-fly { font-size: 14.5px; color: ${T.ink}; animation: gv-tush .8s cubic-bezier(.4,.1,.2,1) .3s both; }
        .gv-mini-fly b { color: ${T.accent}; }
        @keyframes gv-tush { from { opacity: .3; transform: translateY(-48px); } to { opacity: 1; transform: none; } }
        /* Kartochka — neytral (SABOQ P10) */
        .gv-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: gv-puls 1.8s ease-out .4s 3; }
        .gv-flash .fc-front { border-color: ${fon(T.accent, 0.45)}; box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        .gv-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .gv-flash .fc-note { color: rgba(255,255,255,0.78); }
        p.gv-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.gv-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun */
        .gv-yakun.belgisiz .done-chip .tick { display: none; }
        .gv-hw { display: flex; flex-direction: column; gap: 12px; }
        .gv-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .gv-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .gv-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .gv-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.gv-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .gv-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .gv-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .gv-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 760px) {
          .gv-sahna, .gv-ish, .gv-reja-v { grid-template-columns: minmax(0,1fr); gap: 12px; }
          .gv-hw-karta { grid-template-columns: 1fr; }
          .gv-tm-bo em { display: none; }
          .gv-v-q { grid-template-columns: minmax(0,1fr) 30px minmax(0,1.3fr); gap: 8px; padding: 6px 10px; }
          .gv-strip-y { margin-left: 0; }
          .gv-tel { width: 84px; height: 136px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gv-halqa, .gv-k.kutish .q-variant, .q-bashorat .q-chip, .gv-qadamlar .q-chip, .gv-pufak, .gv-tel, .gv-tel-son, .gv-tng, .gv-tng-s, .gv-tng-s > i, .gv-tm-bo.halqa .gv-tm-t, .gv-v-b, .gv-v-izm, .gv-v-q, .gv-v-hk, .gv-r-q,
          .gv-karta, .gv-var, .gv-bt, textarea.gv-inp, .gv-bolak-t, .gv-mini-fly, .gv-flash .fc-front { animation: none !important; transition: none !important; }
          .gv-tm-t > i, .gv-uchar { transition: none !important; }
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
        /* F-1008-583 (SABOQ P7): ⛶ vizualning o'z burchagida (top 8, right 8), kontentdan tashqarida emas;
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
