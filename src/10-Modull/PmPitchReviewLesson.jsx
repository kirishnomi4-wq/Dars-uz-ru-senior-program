import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun, QChip, QMustaqil, QQadamlar, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m10d11-v1', lessonTitle: { uz: "Raqamlaringiz pitchni qanday o'zgartiradi?", ru: "Как ваши цифры меняют питч?" } };
// 12 ekran (MD v3): kirish · reja · 2 tushuncha · 1-savol · 3 mustaqil ish (da'volar → dalillar → tuzatilgan pitch) · yakuniy savol · podium · kartochkalar · yakun
const HW_TOKENS = [
  { t: { uz: 'pitch', ru: 'питч' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'dalil', ru: 'довод' }, l: 70, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'son', ru: 'число' }, l: 40, tp: 70, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },
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
const INLINE_KEYS = { s4: 2, s8: 1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  4: {
    title: { uz: 'Dalilda uch narsa', ru: 'Три вещи в доводе' },
    cards: [
      { ic: '1', h: { uz: 'Bu darsda har dalilda uch narsa bor: son yoki yozuv, manba va qachon olingani.', ru: 'В этом уроке в каждом доводе три вещи: число или запись, источник и когда получено.' } },
      { ic: '2', h: { uz: 'Manba — dalil qayerdan olingani.', ru: 'Источник — откуда взят довод.' } },
      { ic: '3', h: { uz: "Qachon sanalgani ham yoziladi: vaqt o'tib son o'zgaradi.", ru: 'Пишут и когда посчитано: со временем число меняется.' }, ask: { uz: 'Pitchingizdagi eng katta son qachon sanalgan?', ru: 'Когда посчитано самое большое число в вашем питче?' } }
    ]
  },
  8: {
    title: { uz: "Dalilsiz va'da", ru: 'Обещание без довода' },
    cards: [
      { ic: '1', h: { uz: "Dalilsiz da'vo qayta yoziladi yoki olib tashlanadi.", ru: 'Утверждение без довода переписывают или убирают.' } },
      { ic: '2', h: { uz: "Kelajakdagi sonni hech qaysi manba ko'rsatmaydi: va'da olib tashlanadi yoki maqsad deb qayta yoziladi.", ru: 'Число из будущего не показывает ни один источник: обещание убирают или переписывают как цель.' } },
      { ic: '3', h: { uz: "O'rniga Keyingi qadam bo'lagida qiladigan ishingiz aytiladi.", ru: 'Вместо него в части «Следующий шаг» называют дело, которое вы сделаете.' }, ask: { uz: 'Pitchingizda «tez orada» degan gap bormi?', ru: 'Есть ли в вашем питче фраза со словом «скоро»?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="pd-tviz fade-step">{vizual}</div>}
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

// ===== BITTA VIZUAL — «Pitch va dalil» (PitchDalil; 163/180): bitta manba MENTOR_PITCH + MENTOR_MANBA + o'quvchi pitchi; har ekran shuni ishlatadi =====
// qolip-maket: pd-gap pd-tahrir pd-manba-q pd-tanlov pd-ms-q pd-chek pd-yordam-b
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const halqa = (on) => (on ? 'pd-halqa' : undefined);
const bas = (s) => { const t = String(s || ''); return t.charAt(0).toUpperCase() + t.slice(1); };
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq — natija javobda qoladi */ } };
const PITCH_KEY = 'pm-m9d16-pitch';
const HISOBOT_KEY = 'pm-m10d10-hisobot';
const NATIJA_KEY = 'pm-m10d11-pitch';
// «Maydon Jamoa» nomi — 11-Modul 9.62 yashili (PM palitrasining ok yashilidan farqli; topshiriq «A to'lqindan saboq»)
const NOM_RANG = '#2E9E4F';
// 10-darsda «tuzatish» olgan qator — sariq (MD 6-ekran); qolipda sariq token yo'q, shu bitta const
const SARIQ = '#9A6A12';
// Ketma-ket sahna qadamlari: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — kechikishsiz (DE-200)
function useKetma() {
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const kam = kamHarakat();
    let t = 0;
    qadamlar.forEach(([ms, fn]) => { t += kam ? 0 : ms; tm.current.push(setTimeout(fn, t)); });
  }, []);
}
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
    ? createPortal(uchlar.map(z => <span key={z.k} className="pd-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
// Navbatdagi tugma yoki natija ko'rinadigan joyga suriladi: faqat dep o'zgarganda, block 'nearest'
function useKorin(dep, nishon) {
  const oldin = useRef(dep);
  useEffect(() => {
    if (oldin.current === dep) return undefined;
    oldin.current = dep;
    const t = setTimeout(() => {
      const el = typeof nishon === 'string' ? document.querySelector(nishon) : nishon && nishon.current;
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' });
    }, 260);
    return () => clearTimeout(t);
  }, [dep]); // eslint-disable-line
}
// Ipucha: 40 s harakatsizlikda (MD — javobni aytmaydi); dep o'zgarsa qayta sanaladi
function useIpucha(faol, dep, ms = 40000) {
  const [ko, setKo] = useState(false);
  useEffect(() => {
    setKo(false);
    if (!faol) return undefined;
    const t = setTimeout(() => setKo(true), ms);
    return () => clearTimeout(t);
  }, [faol, dep]); // eslint-disable-line
  return ko;
}
const qisqa = (s, n = 26) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
// Gaplarga bo'lish (KOD 7): «. » «! » «? » bo'yicha; «8 / 10» kabi sonlar bo'linmaydi; bo'sh qism tushadi
const gaplargaBol = (s) => String(s || '').split(/(?<=[.!?…])\s+(?=\S)/).map(x => x.trim()).filter(Boolean);
const raqamBor = (s) => /\d/.test(String(s || ''));

const BOLAK = [
  { id: 'muammo', nom: { uz: 'Muammo', ru: 'Проблема' } },
  { id: 'yechim', nom: { uz: 'Yechim', ru: 'Решение' } },
  { id: 'demo', nom: { uz: 'Jonli demo', ru: 'Живое демо' } },
  { id: 'keyingi', nom: { uz: 'Keyingi qadam', ru: 'Следующий шаг' } }
];
const bolakNom = (id) => tr((BOLAK.find(b => b.id === id) || BOLAK[0]).nom);
const DEMO_YORLIQ = { uz: "jonli demoda ko'rinadi", ru: 'видно в живом демо' };
const YOQ_YORLIQ = { uz: "dalil yo'q", ru: 'нет довода' };
const MENTOR_MISOLIDA = { uz: 'Mentor misolida', ru: 'В примере Ментора' };
const MANBA = {
  database: { uz: 'Database', ru: 'Database' },
  sanoq: { uz: 'sanoq sahifasi', ru: 'страница подсчёта' },
  umami: { uz: 'Umami', ru: 'Umami' },
  intervyu: { uz: 'intervyu yozuvlari', ru: 'записи интервью' },
  sinov: { uz: 'sinov yozuvlari', ru: 'записи тестов' }
};
const MANBA_K = ['database', 'sanoq', 'umami', 'intervyu', 'sinov'];
const SANAYDI = ['database', 'sanoq', 'umami'];
// Hisobotdagi manba yozuvi ('Database' · 'sanoq sahifasi' · 'Umami') → kalit
const manbaKey = (s) => { const t = String(s || '').toLowerCase(); if (t.includes('sanoq')) return 'sanoq'; if (t.includes('umami')) return 'umami'; if (t.includes('intervyu')) return 'intervyu'; if (t.includes('sinov')) return 'sinov'; return 'database'; };

// Mentor misoli — bitta manba (A-7 aynan; tayanch 1.10, 1.11, 1.13)
const MENTOR_PITCH = {
  gaplar: {
    muammo: [{ k: 'm1', t: { uz: "O'yinchilar jamoaga odam yig'ishda qiynaladi.", ru: 'Игрокам трудно собрать людей в команду.' }, d: 0 }],
    yechim: [{ k: 'y1', demo: true, t: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' } }],
    demo: [
      { k: 'j1', demo: true, t: { uz: "Telefonda «Qo'shilaman» bosiladi: «8 / 10» o'rniga «9 / 10».", ru: "На телефоне нажимают «Присоединяюсь»: вместо «8 / 10» — «9 / 10»." } },
      { k: 'j2', t: { uz: 'Ilovani odamlar ishlatyapti.', ru: 'Приложением пользуются люди.' }, d: 1 },
      { k: 'j3', t: { uz: "O'yinchilarga ilova yoqdi.", ru: 'Игрокам понравилось приложение.' }, d: 2 }
    ],
    keyingi: [{ k: 'k1', t: { uz: 'Tez orada 50 ga yetamiz.', ru: 'Скоро дойдём до 50.' }, d: 3 }]
  },
  davolar: [
    { id: 'd1', bolak: 'muammo', k: 'm1', kalit: 'bor', qaror: 'qoldi',
      dalil: { yozuv: { uz: "5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.", ru: 'У 4 из 5 игроков в последней игре не хватило людей или кто-то не пришёл.' }, manba: 'intervyu', qachon: { uz: '11-Modul 3–4-darslari', ru: '11-й модуль, уроки 3–4' } },
      izoh: { uz: "5 o'yinchi — kichik son: bu tanlov uchun dalil, isbot emas.", ru: '5 игроков — маленькое число: это довод для выбора, не доказательство.' } },
    { id: 'd2', bolak: 'demo', k: 'j2', kalit: 'bor', qaror: 'qoldi',
      dalil: { son: { uz: "38 kishi ro'yxatdan o'tdi, 19 tasi asosiy harakatni qildi.", ru: '38 человек зарегистрировались, 19 из них сделали основное действие.' }, manba: 'database', qachon: { uz: 'ishga tushirilganidan bir hafta keyin', ru: 'через неделю после запуска' } },
      izoh: { uz: "asosiy harakat — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan", ru: 'основное действие — сейчас участвует хотя бы в одной игре или объявил игру' } },
    { id: 'd3', bolak: 'demo', k: 'j3', kalit: 'yoq', qaror: 'qayta-yozildi',
      yangiGap: { uz: 'Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi.', ru: 'Из 46 устройств, открывших приложение в первые три дня, 17 снова открыли его в следующие два дня.' },
      dalil: { son: { uz: '46 qurilmadan 17 tasi', ru: '17 из 46 устройств' }, manba: 'database', qachon: { uz: 'ishga tushirilganidan besh kun keyin', ru: 'через пять дней после запуска' } } },
    { id: 'd4', bolak: 'keyingi', k: 'k1', kalit: 'yoq', qaror: 'olib-tashlandi',
      yangiGap: { uz: "E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi.", ru: "После объявления организатор кнопкой «Поделиться ссылкой» отправляет ссылку своей команде." }, dalil: null }
  ]
};
const MENTOR_MANBA = {
  intervyu: { sar: { uz: "jamoa yig'ish · 5 o'yinchi · 11-Modul", ru: 'сбор команды · 5 игроков · 11-й модуль' }, qator: { n: { uz: "oxirgi marta muammo bo'lgan", ru: 'в последний раз была проблема' }, v: '4 / 5' } },
  database: [{ k: 'royxat', n: { uz: "ro'yxatdan o'tgan", ru: 'зарегистрировались' }, v: '38' }, { k: 'asosiy', n: { uz: 'asosiy harakatni qilgan', ru: 'сделали основное действие' }, v: '19' }],
  qaytgan: [{ k: 'q1', n: { uz: 'birinchi 3 kunda ochgan', ru: 'открыли в первые 3 дня' }, v: '46' }, { k: 'q2', n: { uz: 'keyingi 2 kunda yana ochgan', ru: 'снова открыли в следующие 2 дня' }, v: '17' }],
  sanoq: [{ k: 's1', n: { uz: 'ochdi', ru: 'открыли' }, v: '61' }, { k: 's2', n: { uz: "ro'yxatdan o'tdi", ru: 'зарегистрировались' }, v: '38' }, { k: 's3', n: { uz: "qo'shildi", ru: 'присоединились' }, v: '18' }, { k: 's4', n: { uz: 'kelishini tasdiqladi', ru: 'подтвердили приход' }, v: '14' }],
  umami: [{ k: 'u1', n: { uz: 'tashriflar', ru: "посещения" }, v: '74' }, { k: 'u2', n: { uz: "Qo'shilmoqchiman", ru: "Хочу присоединиться" }, v: '41' }],
  vaqt: [{ k: 'v1', n: { uz: 'ishga tushirish kuni', ru: 'день запуска' }, v: '20' }, { k: 'v2', n: { uz: '3 kun keyin', ru: 'через 3 дня' }, v: '27' }, { k: 'v3', n: { uz: 'bir hafta keyin', ru: 'через неделю' }, v: '38' }],
  zaxira: { uz: "ilovada e'lon berilgach «Havolani ulashish» tugmasi", ru: "кнопка «Поделиться ссылкой» после объявления в приложении" }
};
const mDalil = (d) => (d ? [tr(d.son || d.yozuv), tr(MANBA[d.manba]), tr(d.qachon)] : null);

// O'quvchi ma'lumoti: 11-Modul pitchi (tayanch 8 shakli) va 10-darsdagi hisobot; yo'q bo'lsa — null (ekranlar Mentor misoli bilan ishlaydi)
const matnS = (v) => (typeof v === 'string' ? v.trim() : '');
const pitchOl = () => {
  const p = lsO(PITCH_KEY);
  if (!p) return null;
  const m = p.muammo && typeof p.muammo === 'object' ? p.muammo : {};
  const d = p.demo && typeof p.demo === 'object' ? p.demo : {};
  const o = { muammo: { gap: matnS(m.gap), dalil: matnS(m.dalil) }, yechim: matnS(p.yechim), demo: { harakat: matnS(d.harakat), tuzatish: matnS(d.tuzatish), son: matnS(d.son) }, keyingi: matnS(p.keyingi) };
  return (o.muammo.gap || o.demo.tuzatish || o.demo.son || o.keyingi) ? o : null;
};
const hisobotOl = () => { const h = lsO(HISOBOT_KEY); return h && (h.royxat || h.asosiy || h.bosh || h.qaytgan) ? h : null; };

// ---------- Manba oynasi (chapda; o'lchami barqaror; chizilgan, logotipsiz) ----------
// tur: 'bosh' | 'database' | 'sanoq' | 'umami' | 'intervyu' | 'sinov'; qatorlar: [{ k, n, v, on, err, bog, onBos, chorla }]
const ManbaOyna = ({ tur = 'bosh', qatorlar = [], yorliq, sar, xoch, chiziq, kichik }) => {
  const brauzer = tur === 'sanoq' || tur === 'umami';
  return (
    <div className={cx('pd-manba', 'pd-m-' + tur, kichik && 'kichik')}>
      <div className="pd-m-bar">
        {brauzer && <span className="pd-m-nuqta" aria-hidden="true"><i /><i /><i /></span>}
        <b>{tur === 'bosh' ? tr({ uz: 'Manba', ru: 'Источник' }) : bas(tr(MANBA[tur]))}</b>
        {tur === 'database' && <span className="pd-m-sql">Neon SQL Editor</span>}
      </div>
      {brauzer && <span className="pd-m-url">{tur === 'sanoq' ? 'lending/sanoq.html' : tr({ uz: 'Umami · lending', ru: 'Umami · лендинг' })}</span>}
      <div className="pd-m-tana" key={tur + (yorliq ? '1' : '0') + (sar || '')}>
        {(yorliq || sar) && <span className="pd-m-yorliq">{sar && <b>{sar}</b>}{yorliq}</span>}
        {tur === 'bosh'
          ? <div className="pd-m-bosh">{['database', 'sanoq', 'umami', 'intervyu'].map(k => <span key={k}>{bas(tr(MANBA[k]))}</span>)}</div>
          : <div className="pd-m-jadval">{qatorlar.map((q, i) => {
            const ic = <><span className="pd-m-n">{q.n}</span><b className="pd-m-v">{q.v}</b></>;
            const kl = cx(q.on && 'on', q.err && 'err', q.bog && 'bog', (q.yozuv || String(q.v || '').length > 14) && 'yozuv');
            return q.onBos
              ? <button key={q.k || i} type="button" className={cx('pd-manba-q', kl, q.chorla && 'chorla')} style={{ animationDelay: `${i * 90}ms` }} onClick={q.onBos}>{ic}</button>
              : <div key={q.k || i} className={cx('pd-m-q', kl)} style={{ animationDelay: `${i * 90}ms` }}>{ic}</div>;
          })}</div>}
        {chiziq && <div className="pd-m-chiziq"><span className="pd-m-chiziq-n">{tr({ uz: "ro'yxatdan o'tgan", ru: 'зарегистрировались' })}: <b>{chiziq.son} / {chiziq.jami}</b></span><span className="pd-m-bar2"><i style={{ width: `${Math.round((chiziq.son / chiziq.jami) * 100)}%` }} /><em>?</em></span></div>}
        {xoch && <span className="pd-m-xoch fade-step" key={xoch.k}>✕ {xoch.t}</span>}
      </div>
    </div>
  );
};
// Mentor manbasi qatorlari (bitta manbadan)
const mQator = (arr, on) => arr.map(q => ({ k: q.k, n: tr(q.n), v: q.v, on: on && on.includes(q.k) }));
const intervyuQ = (on) => [{ k: 'i0', n: tr(MENTOR_MANBA.intervyu.qator.n), v: MENTOR_MANBA.intervyu.qator.v, on }];

// ---------- Dalil tegi: «son yoki yozuv · manba · qachon» — bo'sh katak uzuq chiziq (U-041), to'lgani yashil ----------
const DalilTeg = ({ kataklar = [], soni = 3, yorliqlar, yangiI = -1, errI = -1, halqaI = -1, bogI = -1, ixcham }) => (
  <span className={cx('pd-teg', ixcham && 'ixcham')}>
    {Array.from({ length: soni }, (_, i) => {
      const v = kataklar[i];
      return <span key={i} className={cx('pd-katak', v ? 'bor' : 'bosh', yangiI === i && 'yangi', errI === i && 'err', halqaI === i && 'pd-halqa', bogI === i && 'bog')}>{v || (yorliqlar && yorliqlar[i]) || ''}</span>;
    })}
  </span>
);
const TEG_YORLIQ = () => [tr({ uz: 'son yoki yozuv', ru: 'число или запись' }), tr({ uz: 'manba', ru: 'источник' }), tr({ uz: 'qachon', ru: 'когда' })];

// ---------- Pitch varag'i (o'ngda): to'rt bo'lak ustma-ust; gap holatlari ----------
// gap: { k, t, holat: 'oddiy'|'demo'|'davo'|'kul', joriy, err, yoq, qayta, olindi, yangiT, dalilQ, izoh, teg, onBos, on, tahrir, qaror, chorla }
const Gap = ({ g }) => {
  const matn = <span className="pd-g-t">{g.t}</span>;
  return (
    <div className={cx('pd-g', g.holat && 'h-' + g.holat, g.joriy && 'joriy', g.err && 'err', g.qayta && 'qayta', g.olindi && 'olindi', g.yangiKir && 'yangi')} data-k={g.k}>
      <div className="pd-g-q">
        {g.onBos ? <button type="button" className={cx('pd-gap', g.on && 'on', g.chorla && 'chorla')} aria-pressed={!!g.on} onClick={g.onBos}>{matn}</button> : matn}
        {g.holat === 'demo' && <span className="pd-g-demo">{tr(DEMO_YORLIQ)}</span>}
        {g.dalilY && <span className="pd-g-demo">{tr({ uz: 'dalil', ru: 'довод' })}</span>}
        {g.yoq && <span className="pd-g-yoq fade-step">{tr(YOQ_YORLIQ)}</span>}
        {g.qaror && <span className="pd-g-qaror">{g.qaror}</span>}
        {g.tahrir}
      </div>
      {g.yangiT && <span className="pd-g-yangi" key={'y' + g.k}>{g.yangiT}</span>}
      {g.dalilQ && <span className="pd-g-dalil fade-step">{g.dalilQ}</span>}
      {g.izoh && <span className="pd-g-izoh fade-step">{g.izoh}</span>}
      {g.teg && <DalilTeg {...g.teg} />}
    </div>
  );
};
const PitchVaraq = ({ sarlavha, bolaklar = [], kichik, tepa, past, className, yondi }) => (
  <div className={cx('pd-varaq', kichik && 'kichik', yondi && 'yondi', className)}>
    <div className="pd-v-sar">{sarlavha}</div>
    {tepa}
    {bolaklar.map((b, bi) => (
      <div key={b.id} className={cx('pd-bolak', b.kul && 'kul')} style={{ animationDelay: `${bi * 90}ms` }}>
        <span className="pd-b-nom">{bolakNom(b.id)}{b.belgi}</span>
        <div className="pd-b-gaplar">{b.gaplar.map(g => <Gap key={g.k} g={g} />)}{b.past}</div>
      </div>
    ))}
    {past}
  </div>
);
const NomMJ = () => <b className="pd-nom">Maydon Jamoa</b>;
const MentorSar = () => <>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <NomMJ /> {tr({ uz: 'pitchi', ru: '— питч' })}</>;
// Mentor varag'ining gaplari (bitta manbadan); fn(g, bolakId) → gap holati
const mentorBolaklar = (fn) => BOLAK.map(b => ({ id: b.id, gaplar: MENTOR_PITCH.gaplar[b.id].map(g => ({ k: g.k, t: tr(g.t), holat: g.demo ? 'demo' : 'oddiy', ...(fn ? fn(g, b.id) : {}) })) }));

// ---------- Zal (faqat 3-ekranda): uch odam — bosh, soch, yuz, rangli kiyim (SABOQ 36); savol pufagi ----------
const ODAMLAR = [{ soch: '#3B2A20', kiyim: '#E07A3F', teri: '#E9B98F' }, { soch: '#1E1B1A', kiyim: '#3E8ED0', teri: '#C98E62' }, { soch: '#7A4B26', kiyim: '#D9A93A', teri: '#F0C9A0' }];
const Odam = ({ soch, kiyim, teri }) => (
  <svg className="pd-odam" viewBox="0 0 40 46" aria-hidden="true">
    <path d="M5 46c0-10 6.5-15 15-15s15 5 15 15z" fill={kiyim} />
    <circle cx="20" cy="17" r="10" fill={teri} />
    <path d="M10 16c-.5-7.5 4.5-12 10-12s10.5 4 10 11c-3-3.5-6.5-4.5-10.5-4.5S12.5 12 10 16z" fill={soch} />
    <circle cx="16.4" cy="18.2" r="1.3" fill="#2B2230" /><circle cx="23.6" cy="18.2" r="1.3" fill="#2B2230" />
    <path d="M17 22.6q3 2.2 6 0" stroke="#2B2230" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);
const Zal = ({ pufak, ok }) => (
  <div className="pd-zal">
    <div className="pd-zal-o">{ODAMLAR.map((o, i) => <Odam key={i} {...o} />)}</div>
    <span className={cx('pd-pufak', ok && 'ok')} key={ok ? 'ok' : String(pufak || '?')}>{ok ? '✓' : (pufak || '?')}</span>
  </div>
);
// Sahna: chapda manba oynasi, o'ngda varaq (SABOQ 21); toliq — varaq butun enga
const PitchDalil = ({ manba, chap, varaq, zal, past, toliq, className }) => (
  <div className={cx('pd-sahna', toliq && 'toliq', className)}>
    {!toliq && manba && <div className="pd-sahna-m">{manba}{chap && <div className="pd-chap-tug">{chap}</div>}</div>}
    <div className="pd-sahna-v">{zal}{varaq}{past}</div>
  </div>
);

// Ballsiz bashorat: tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11); har chipning o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="pd-chorla-g"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="pd-bash-ix fade-step"><span>{tr(savol)}</span><span className="pd-bash-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></span></div>);
// Taxmin natijasi — yashil xulosaning birinchi, kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="pd-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="pd-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="pd-x-m">{matn}</span>{izoh && <span className="pd-x-iz">{izoh}</span>}</>;
// O'qituvchi eslatmasi — faqat Mentor rejimida (MD aytgan joyda)
const Ustoz = ({ matn }) => {
  const { isMentor } = useJonli();
  if (!isMentor) return null;
  return <div className="pd-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{(Array.isArray(matn) ? matn : [matn]).map((m, i) => <span key={i}>{tx(m)}</span>)}</div>;
};
// Faqat jonli darsda ko'rinadigan kulrang qator (MD «faqat jonli darsda»)
const JonliQator = ({ matn }) => {
  const { live } = useJonli();
  if (!live || (live.mode !== 'student' && live.mode !== 'mentor')) return null;
  return <p className="pd-kul">{tr(matn)}</p>;
};

// ===== SCREEN 0 — KIRISH (QKirish, sof so'rovnoma — J-026): o'quvchi pitchi (yoki Mentor misoli) va 10-darsdagi ikki son; tanlovdan keyin sonlar varaq ustida suzadi, har bo'lakda «?» =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Pitchga yangi sonlar qo'shiladi", ru: 'В питч добавятся новые числа' } },
  { id: 'b', label: { uz: 'Ba\'zi gaplar qayta yoziladi', ru: 'Некоторые фразы перепишут' } },
  { id: 'c', label: { uz: 'Ba\'zi gaplar olib tashlanadi', ru: 'Некоторые фразы уберут' } }
];
const HOOK_JAVOB = { uz: "Uchalasi ham uchraydi: Mentor misolida bitta pitchda uchalasi bor. Har gap bilan nima bo'lishini dalil hal qiladi.", ru: 'Встречаются все три: в примере Ментора в одном питче есть все три. Что будет с каждой фразой, решает довод.' };
const birinchiGap = (p, id) => {
  if (id === 'muammo') return gaplargaBol(p.muammo.gap)[0] || '';
  if (id === 'yechim') return gaplargaBol(p.yechim)[0] || '';
  if (id === 'demo') return gaplargaBol(p.demo.harakat || p.demo.tuzatish || p.demo.son)[0] || '';
  return gaplargaBol(p.keyingi)[0] || '';
};
const S0Maket = ({ tanlandi }) => {
  const [p] = useState(pitchOl);
  const [h] = useState(hisobotOl);
  const bolaklar = BOLAK.map(b => {
    const t = p ? birinchiGap(p, b.id) : tr(MENTOR_PITCH.gaplar[b.id][0].t);
    return { id: b.id, belgi: tanlandi && <span className="pd-b-savol fade-step" style={{ animationDelay: `${300 + BOLAK.indexOf(b) * 110}ms` }}>?</span>, gaplar: t ? [{ k: b.id, t: qisqa(t, 62), holat: 'oddiy' }] : [] };
  });
  const sonlar = p
    ? (h ? { r: h.royxat && h.royxat.soni, a: h.asosiy && h.asosiy.soni } : null)
    : { r: 38, a: 19 };
  return (
    <div className="pd-s0">
      <PitchVaraq kichik sarlavha={p ? tr({ uz: 'Pitchim · 11-Modul', ru: 'Мой питч · 11-й модуль' }) : <>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <NomMJ /></>} bolaklar={bolaklar} />
      {sonlar && <p className={cx('pd-s0-son', tanlandi && 'suz')}>{tr({ uz: "Ro'yxatdan o'tgan", ru: 'Зарегистрировались' })}: <b>{sonlar.r ?? '—'}</b> · {tr({ uz: 'Asosiy harakatni qilgan', ru: 'Сделали основное действие' })}: <b>{sonlar.a ?? '—'}</b></p>}
    </div>
  );
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cx('pd-k', picked === null && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Raqamlaringiz pitchni <A>qanday o'zgartiradi?</A></>, ru: <>Как ваши цифры <A>меняют питч?</A></> })}
          mentor={<Mentor>{tr({ uz: "11-Modul pitchingiz mahsulotingiz odamlarga yuborilishidan oldin yozilgan edi, 10-darsda esa foydalanuvchilarni sanadingiz. Sizningcha, pitchda nima o'zgaradi?", ru: 'Ваш питч из 11-го модуля был написан до того, как продукт отправили людям, а на 10-м уроке вы посчитали пользователей. Как думаете, что изменится в питче?' })}</Mentor>}
          maket={<S0Maket tanlandi={picked !== null} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB)}</p>}
        >
          <Ustoz matn={[{ uz: "Javoblarni muhokama qilmang — uchalasi ham bugun ko'rinadi. Sinfdan so'rang: «11-Modul pitchingizda bugun eskirgan gap bormi?» Dars nomidagi «raqam» — matnda «son» (A-5).", ru: "Не обсуждайте ответы — все три сегодня будут видны. Спросите класс: «Есть ли в вашем питче из 11-го модуля фраза, которая сегодня устарела?» «Цифры» из названия урока в тексте — «число» (A-5)." }]} />
        </QKirish>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda yorliq + varaq o'zi yuradi — to'rt bo'lak navbat bilan, har birida uch katakli bo'sh uzuq teg, sarlavha yonida «?»; kashfiyot ochilmaydi) =====
const REJA = [
  { t: { uz: "Pitchingizdan tekshirsa bo'ladigan gaplarni topasiz", ru: 'Найдёте в питче фразы, которые можно проверить' }, teg: { uz: "da'vo", ru: 'утверждение' } },
  { t: { uz: "Har biriga sonlaringizdan dalil qo'yasiz", ru: 'К каждой поставите довод из ваших чисел' }, teg: { uz: 'dalil', ru: 'довод' } },
  { t: { uz: 'Dalilsiz gapni qayta yozasiz yoki olib tashlaysiz', ru: 'Фразу без довода перепишете или уберёте' }, teg: { uz: 'tuzatilgan pitch', ru: 'исправленный питч' } },
  { t: { uz: "Pitchingizni Mentor bilan yakkama-yakka ko'rasiz", ru: "Разберёте питч с Ментором на встрече один на один" }, teg: { uz: 'yakkama-yakka', ru: "встреча один на один" } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[300, () => setF(1)], [420, () => setF(2)], [420, () => setF(3)], [420, () => setF(4)], [600, () => setF(5)], [700, () => setF(6)]]); }, []); // eslint-disable-line
  const bolaklar = BOLAK.slice(0, f).map(b => {
    const g = MENTOR_PITCH.gaplar[b.id][b.id === 'demo' ? 1 : 0];
    return { id: b.id, gaplar: [{ k: g.k, t: tr(g.t), holat: 'kul', teg: f >= 5 ? { soni: 3, kataklar: [] } : null }] };
  });
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun pitchingizni <A>sonlaringiz bilan tuzatasiz.</A></>, ru: <>Сегодня вы исправите питч <A>своими числами.</A></> })}
        mentor={<Mentor>{tr({ uz: "Roadmap'ingizni 11-Modulda ko'rgansiz — bugun pitch. Har biringiz bilan yakkama-yakka gaplashaman: pitchingizni birga ko'ramiz.", ru: 'Свой roadmap вы смотрели в 11-м модуле — сегодня питч. С каждым поговорю один на один: посмотрим ваш питч вместе.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida — Mentor bilan yakkama-yakka: tuzatilgan pitch', ru: "В конце урока — встреча с Ментором один на один: исправленный питч" })}
        chap={<div className="pd-reja"><PitchVaraq kichik sarlavha={<><NomMJ />{f >= 6 && <span className="pd-b-savol fade-step">?</span>}</>} bolaklar={bolaklar} /></div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <Ustoz matn={[{ uz: "Roadmap holati va risklar bugun ochilmaydi — 11-Modul 15-darsida ko'rilgan (tayanch 1.11). Pitchning Keyingi qadam bo'lagi o'sha rejadan va 10-darsdagi zaxira rejadan.", ru: "Состояние roadmap и риски сегодня не открываем — их смотрели на 15-м уроке 11-го модуля. Часть «Следующий шаг» в питче — из того плана и из запасного плана 10-го урока." }]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — DA'VO VA DALIL (QTushuncha markaziy: bashorat → 4 gap navbat bilan «Dalil bor» / «Dalil yo'q» → manba oynasi ochiladi, son gapga uchadi yoki Mentor qarori o'ynaydi → xulosa; tugagach varaq butun enga) =====
const S2_TAXMIN = [{ k: '1', t: { uz: '1', ru: '1' } }, { k: '2', t: { uz: '2', ru: '2' } }, { k: '3', t: { uz: '3', ru: '3' } }];
const S2_SAVOL = { uz: "Mentor pitchidagi to'rt gapdan nechtasining dalili bor?", ru: 'У скольких из четырёх фраз питча Ментора есть довод?' };
const S2_KALIT = ['bor', 'bor', 'yoq', 'yoq'];
const S2_XATO = [
  { uz: "11-Modul intervyularini eslang: necha o'yinchi qiynalgan?", ru: 'Вспомните интервью 11-го модуля: скольким игрокам было трудно?' },
  { uz: '10-darsdagi hisobotni eslang: unda qaysi sonlar bor?', ru: 'Вспомните отчёт 10-го урока: какие в нём числа?' },
  { uz: 'Qaysi manbada «yoqdi» sanalgan?', ru: 'В каком источнике посчитано «понравилось»?' },
  { uz: 'Bugungi son bor. «Tez orada» uchun qaysi son bor?', ru: 'Сегодняшнее число есть. А какое число есть для «скоро»?' }
];
const S2_IZOH = [null,
  { uz: "Dalil pitchda yo'q edi, Database'da bor — pitchga qo'shildi.", ru: 'В питче довода не было, в Database он есть — добавлен в питч.' },
  { uz: 'Mentor «yoqdi» o\'rniga odamlar nima qilganini Database sonlari bilan yozdi.', ru: 'Вместо «понравилось» Ментор написал числами из Database, что сделали люди.' },
  { uz: "Mentor bu va'dani olib tashladi — o'rniga zaxira rejadagi ish.", ru: 'Ментор убрал это обещание — вместо него дело из запасного плана.' }];
const S2_GAP = ['m1', 'j2', 'j3', 'k1'];
const XOCH = { uz: 'yoqdi — sanalmagan', ru: '«понравилось» — не посчитано' };
const navYorliq = (taxmin, q, jami, qadamY, done) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' }
    : { uz: `${qadamY.uz} (${q}/${jami})`, ru: `${qadamY.ru} (${q}/${jami})` });
const s2Manba = (m) => {
  if (m.tur === 'intervyu') return <ManbaOyna tur="intervyu" sar={tr(MENTOR_MANBA.intervyu.sar)} qatorlar={intervyuQ(m.on)} xoch={m.xoch} />;
  if (m.tur === 'database') return <ManbaOyna tur="database" yorliq={tr(m.yorliq || MENTOR_MISOLIDA)} qatorlar={m.qaytgan ? mQator(MENTOR_MANBA.qaytgan, m.on ? ['q1', 'q2'] : []) : (m.chiziq ? [] : mQator(MENTOR_MANBA.database, m.on ? ['royxat', 'asosiy'] : []))} chiziq={m.chiziq} xoch={m.xoch} />;
  if (m.tur === 'sanoq') return <ManbaOyna tur="sanoq" yorliq={tr({ uz: 'qurilma', ru: 'устройство' })} qatorlar={mQator(MENTOR_MANBA.sanoq)} xoch={m.xoch} />;
  if (m.tur === 'umami') return <ManbaOyna tur="umami" yorliq={tr({ uz: 'tashrif', ru: "посещение" })} qatorlar={mQator(MENTOR_MANBA.umami)} xoch={m.xoch} />;
  return <ManbaOyna tur="bosh" />;
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!(storedAnswer && storedAnswer.done);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [m, setM] = useState({ tur: 'bosh' });
  const [g, setG] = useState(() => (avval ? [{ dalil: 1 }, { dalil: 1 }, { yoq: 1, qayta: 1 }, { yoq: 1, olindi: 1 }] : [{}, {}, {}, {}]));
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const [izoh, setIzoh] = useState(null);
  const wrongRef = useRef(false);
  const ketma = useKetma();
  const [uch, qatlam] = useUchish();
  const done = q >= 4;
  const tugadi = useTugadi(done, 1600, avval);
  const ipucha = useIpucha(!!taxmin && !done && !band, q);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: !wrongRef.current, picked: true, taxmin, done: true }); }, [done]); // eslint-disable-line
  useKorin(tugadi, '.q-xulosa');
  const upG = (i, p) => setG(a => a.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const uchir = (matn, i) => uch(document.querySelector('.pd-manba .pd-m-q.on'), document.querySelector(`.pd-varaq [data-k="${S2_GAP[i]}"]`), matn);
  const bos = (javob) => {
    if (!taxmin || band || done) return;
    if (javob !== S2_KALIT[q]) {
      wrongRef.current = true; if (achMiss) achMiss.miss(screen);
      setXato(q); setSilk(javob + q + Date.now());
      upG(q, { err: 1 }); ketma([[650, () => upG(q, { err: 0 })]]);
      return;
    }
    setXato(null); setBand(true); setIzoh(null);
    const i = q;
    if (i === 0) {
      setM({ tur: 'intervyu', on: true });
      ketma([[650, () => uchir('4 / 5', 0)], [500, () => upG(0, { dalil: 1 })], [500, () => { setQ(1); setBand(false); }]]);
    } else if (i === 1) {
      setM({ tur: 'database', on: true });
      ketma([[650, () => uchir('38 · 19', 1)], [500, () => { upG(1, { dalil: 1 }); setIzoh(1); }], [500, () => { setQ(2); setBand(false); }], [2500, () => setIzoh(z => (z === 1 ? null : z))]]);
    } else if (i === 2) {
      upG(2, { yoq: 1 });
      const xs = { k: 0, t: tr(XOCH) };
      ketma([[150, () => setM({ tur: 'database', xoch: { ...xs, k: 1 } })], [750, () => setM({ tur: 'sanoq', xoch: { ...xs, k: 2 } })], [750, () => setM({ tur: 'umami', xoch: { ...xs, k: 3 } })], [750, () => setM({ tur: 'intervyu', xoch: { ...xs, k: 4 } })],
        [900, () => { upG(2, { qayta: 1 }); setM({ tur: 'database', qaytgan: true, on: true, yorliq: { uz: 'Mentor misolida · qurilma', ru: 'В примере Ментора · устройство' } }); }],
        [700, () => { setIzoh(2); setQ(3); setBand(false); }]]);
    } else {
      setM({ tur: 'database', chiziq: { son: 38, jami: 50 }, yorliq: { uz: 'Mentor misolida · bir hafta keyin', ru: 'В примере Ментора · через неделю' } });
      ketma([[500, () => upG(3, { yoq: 1 })], [1000, () => upG(3, { olindi: 1 })], [700, () => { setIzoh(3); setQ(4); setBand(false); }]]);
    }
  };
  const d = MENTOR_PITCH.davolar;
  const varaq = (
    <PitchVaraq sarlavha={<MentorSar />} bolaklar={mentorBolaklar((gp) => {
      if (gp.d === undefined) return {};
      const i = gp.d, s = g[i] || {};
      const dv = d[i];
      return {
        joriy: !done && !band && q === i && !!taxmin, err: !!s.err, yoq: !!s.yoq && !s.olindi, qayta: !!s.qayta, olindi: !!s.olindi,
        yangiT: (s.qayta || s.olindi) ? tr(dv.yangiGap) : null,
        dalilQ: s.dalil ? tr((dv.dalil.son || dv.dalil.yozuv)) : null, izoh: s.dalil ? tr(dv.izoh) : null
      };
    })} />
  );
  const tugmalar = !tugadi && (
    <div className="pd-s2-tug">
      <div className={cx('pd-chorla', taxmin && !band && !done && 'faol')}>
        {[{ k: 'bor', t: { uz: 'Dalil bor', ru: 'Довод есть' } }, { k: 'yoq', t: { uz: "Dalil yo'q", ru: 'Довода нет' } }].map(b => (
          <QChip key={b.k} silk={silk && String(silk).startsWith(b.k)} disabled={!taxmin || band || done} onClick={() => bos(b.k)}>{tr(b.t)}</QChip>
        ))}
      </div>
      {xato !== null && <QXato>{tr(S2_XATO[xato])}</QXato>}
      {izoh && !done && <QIzoh>{tr(S2_IZOH[izoh])}</QIzoh>}
      {ipucha && <QIzoh>{tr({ uz: "Bu gapni 11-Modul intervyusi yoki 10-darsdagi hisobot ko'rsatadimi?", ru: 'Эту фразу подтверждает интервью 11-го модуля или отчёт 10-го урока?' })}</QIzoh>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · da'vo va dalil", ru: 'Понятие · утверждение и довод' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 4, { uz: 'Gaplarni belgilang', ru: 'Отметьте фразы' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor pitchidagi qaysi gapning <A>dalili bor?</A></>, ru: <>У какой фразы в питче Ментора <A>есть довод?</A></> })}
        mentor={<Mentor>{tr({ uz: "Mentor misolida pitchga ilova chiqqandan keyingi gaplar qo'shilgan — har gapga mos tugmani bosing.", ru: 'В примере Ментора в питч добавлены фразы после выхода приложения — нажмите подходящую кнопку для каждой фразы.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<PitchDalil toliq={tugadi} manba={s2Manba(m)} varaq={varaq} chap={tugmalar} />}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === '2'} haqiqat="2" />} matn={tr({ uz: "Pitchdagi tekshirsa bo'ladigan gap — da'vo. Da'voni ko'rsatadigan son yoki yozuv — dalil.", ru: 'Фраза в питче, которую можно проверить, — утверждение. Число или запись, которые его показывают, — довод.' })} />}
      >
        <Ustoz matn={[{ uz: "Yechim va telefondagi harakatni zal jonli demoda o'zi ko'radi — bu ham dalil, faqat bugungi mashqqa kirmaydi: bugun zal ko'ra olmaydigan gaplar — odamlar, sonlar, natija (A-9). 3-gapning yangi shakli «yoqdi»ni isbotlamaydi — qurilmalar nima qilganini aytadi.", ru: 'Решение и действие на телефоне зал сам увидит в живом демо — это тоже довод, просто не входит в сегодняшнее упражнение: сегодня — фразы, которые зал увидеть не может: люди, числа, результат. Новая форма 3-й фразы не доказывает «понравилось» — она говорит, что сделали устройства.' },
          { uz: "1-gap: 5 o'yinchidan 4 tasi — «hamma o'yinchi qiynaladi» degani emas; pitchda gap dalili bilan birga aytiladi. 2-gap: «ishlatyapti» — keng so'z; zal «ishlatish nima?» desa, javob dalil ostidagi kulrang qatorda (hozir o'yinda yoki e'lon qilgan — 19 hisob; 38 — ro'yxatdan o'tganlar).", ru: '1-я фраза: 4 из 5 игроков — не значит «всем игрокам трудно»; в питче фразу говорят вместе с доводом. 2-я фраза: «пользуются» — широкое слово; если зал спросит «что значит пользоваться?», ответ — в серой строке под доводом (сейчас в игре или объявил — 19 аккаунтов; 38 — зарегистрировались).' },
          { uz: "4-gapda «50» — modul maqsadi: maqsadni maqsad deb aytish mumkin («Maqsadimiz — 50»), «yetamiz» esa dalilsiz va'da. Mentor uni olib tashladi — bu Mentorning tanlovi, yagona yo'l emas. Sinfga savol: «Pitchingizda «tez orada» yoki «yoqdi» kabi gap bormi?»", ru: 'В 4-й фразе «50» — цель модуля: цель можно назвать целью («Наша цель — 50»), а «дойдём» — обещание без довода. Ментор его убрал — это выбор Ментора, не единственный путь. Вопрос классу: «Есть ли в вашем питче фраза вроде «скоро» или «понравилось»?»' }]} />
      </QTushuncha>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 3 — SON, MANBA, QACHON (QTushuncha: bashorat → uch tanlov ketma-ket; teg kataklari bittadan paydo bo'ladi; zal pufagi savol beradi → ✓) =====
const S3_TAXMIN = [{ k: '0', t: { uz: '0', ru: '0' } }, { k: '1', t: { uz: '1', ru: '1' } }, { k: '2', t: { uz: '2', ru: '2' } }];
const S3_SAVOL = { uz: 'Dalilga sondan tashqari yana nechta narsa yoziladi?', ru: 'Сколько ещё вещей, кроме числа, пишут в доводе?' };
const S3_SON = { uz: "38 kishi ro'yxatdan o'tdi, 19 tasi asosiy harakatni qildi", ru: '38 человек зарегистрировались, 19 из них сделали основное действие' };
const S3_SON_T = { uz: "38 kishi ro'yxatdan o'tdi, 19 tasi asosiy harakatni qildi (11 tasi — sinfdosh)", ru: '38 человек зарегистрировались, 19 из них сделали основное действие (11 — одноклассники)' };
const S3_QACHON = { uz: 'ishga tushirilganidan bir hafta keyin', ru: 'через неделю после запуска' };
const S3_QADAM = [{ uz: 'Son', ru: 'Число' }, { uz: 'Manba', ru: 'Источник' }, { uz: 'Qachon', ru: 'Когда' }];
const S3_MANBA = [{ k: 'database', t: { uz: 'Database', ru: 'Database' } }, { k: 'umami', t: { uz: 'Umami', ru: 'Umami' } }, { k: 'intervyu', t: { uz: 'Intervyu yozuvlari', ru: 'Записи интервью' } }];
const S3_XATO = {
  kop: { uz: '«Ko\'p» — son emas: necha kishi?', ru: '«Много» — не число: сколько человек?' },
  umami: { uz: 'Umami lendingga tashrifni sanaydi — ilovadagi ishni emas.', ru: "Umami считает посещения лендинга — а не действия в приложении." },
  intervyu: { uz: "Intervyular ilova chiqishidan oldin bo'lgan.", ru: 'Интервью были до выхода приложения.' },
  vaqt: { uz: 'Bu kunda boshqa son sanalgan — tegdagi son qachon edi?', ru: 'В этот день посчитано другое число — когда было число в теге?' }
};
const S3_PUFAK = [null, { uz: 'Bu son qayerdan?', ru: 'Откуда это число?' }, { uz: 'Qachon sanalgan?', ru: 'Когда посчитано?' }];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!(storedAnswer && storedAnswer.done);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qd, setQd] = useState(avval ? 3 : 0);
  const [m, setM] = useState(avval ? 'database' : 'bosh');
  const [xato, setXato] = useState(null);
  const [errK, setErrK] = useState(-1);
  const [silk, setSilk] = useState(null);
  const [yangiI, setYangiI] = useState(-1);
  const [izoh, setIzoh] = useState(null);
  const wrongRef = useRef(false);
  const ketma = useKetma();
  const [uch, qatlam] = useUchish();
  const done = qd >= 3;
  const tugadi = useTugadi(done, 1500, avval);
  const ipucha = useIpucha(!!taxmin && !done, qd);
  useEffect(() => { if (done && !avval) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: !wrongRef.current, picked: true, taxmin, done: true }); }, [done]); // eslint-disable-line
  useKorin(tugadi, '.q-xulosa');
  const xatoQil = (k, s) => { wrongRef.current = true; if (achMiss) achMiss.miss(screen); setXato(k); setSilk(s + Date.now()); setErrK(qd); ketma([[650, () => setErrK(-1)]]); };
  const togri = (keyingi) => { setXato(null); setYangiI(qd); ketma([[1000, () => setYangiI(-1)]]); setQd(keyingi); };
  const sonTanla = (ok) => {
    if (!taxmin || done || qd !== 0) return;
    if (!ok) { xatoQil('kop', 'kop'); return; }
    uch(document.querySelector('.pd-s3-var [data-ok]'), document.querySelector('.pd-s3 .pd-katak'), '38 · 19');
    togri(1); setIzoh(null);
  };
  const manbaTanla = (k) => {
    if (!taxmin || done || qd !== 1) return;
    setM(k);
    if (k !== 'database') { xatoQil(k, k); return; }
    ketma([[500, () => { uch(document.querySelector('.pd-manba .pd-m-q'), document.querySelectorAll('.pd-s3 .pd-katak')[1], 'Database'); togri(2); setIzoh('manba'); }]]);
  };
  const vaqtTanla = (k) => {
    if (!taxmin || done || qd !== 2) return;
    if (k !== 'v3') { xatoQil('vaqt', k); return; }
    uch(document.querySelectorAll('.pd-manba .pd-manba-q')[2], document.querySelectorAll('.pd-s3 .pd-katak')[2], tr({ uz: 'bir hafta keyin', ru: 'через неделю' }));
    togri(3); setIzoh('qachon');
  };
  const kataklar = [qd >= 1 ? tr(tugadi ? S3_SON_T : S3_SON) : '', qd >= 2 ? 'Database' : '', qd >= 3 ? tr(S3_QACHON) : ''];
  const soni = Math.min(qd + 1, 3);
  const manba = m === 'database'
    ? (qd >= 2 && !done ? <ManbaOyna tur="database" yorliq={tr({ uz: "ro'yxatdan o'tgan, jami · Mentor misolida", ru: 'зарегистрировались, всего · в примере Ментора' })} qatorlar={MENTOR_MANBA.vaqt.map(v => ({ k: v.k, n: tr(v.n), v: v.v, err: silk && String(silk).startsWith(v.k) && errK >= 0, onBos: () => vaqtTanla(v.k), chorla: true }))} />
      : <ManbaOyna tur="database" yorliq={tr(MENTOR_MISOLIDA)} qatorlar={mQator(MENTOR_MANBA.database).map(r => ({ ...r, bog: r.k === 'royxat' && qd >= 2 }))} />)
    : m === 'umami' ? <ManbaOyna tur="umami" yorliq={tr(MENTOR_MISOLIDA)} qatorlar={mQator(MENTOR_MANBA.umami)} />
      : m === 'intervyu' ? <ManbaOyna tur="intervyu" yorliq={tr(MENTOR_MISOLIDA)} sar={tr(MENTOR_MANBA.intervyu.sar)} qatorlar={intervyuQ(false)} />
        : <ManbaOyna tur="bosh" />;
  const varaq = (
    <PitchVaraq className="pd-s3" sarlavha={<MentorSar />} bolaklar={[{ id: 'demo', gaplar: [{
      k: 'j2', t: tr(MENTOR_PITCH.gaplar.demo[1].t), holat: 'oddiy',
      izoh: qd >= 1 && !tugadi ? <>{tr({ uz: 'shundan 11 tasi — sinfdosh', ru: 'из них 11 — одноклассники' })}<br />{tr(MENTOR_PITCH.davolar[1].izoh)}</> : null,
      teg: { soni, kataklar, yangiI, errI: errK, bogI: qd >= 2 && !done ? 0 : -1 }
    }] }]} />
  );
  const tanlov = !tugadi && (
    <div className="pd-s3-past">
      <div className="pd-qadamlar">{S3_QADAM.map((s, i) => <span key={i} className={cx('pd-qadam', i === qd && taxmin && 'joriy', i < qd && 'otdi')}>{i < qd ? '✓ ' : ''}{tr(s)}</span>)}</div>
      {taxmin && qd === 0 && <div className="pd-s3-var pd-chorla faol">
        <QChip silk={silk && String(silk).startsWith('kop')} onClick={() => sonTanla(false)}>{tr({ uz: "Ko'p odam ishlatyapti", ru: 'Пользуется много людей' })}</QChip>
        <QChip data-ok="1" onClick={() => sonTanla(true)}>{tr(S3_SON)}</QChip>
      </div>}
      {taxmin && qd === 1 && <div className="pd-s3-var pd-chorla faol">{S3_MANBA.map(b => <QChip key={b.k} silk={silk && String(silk).startsWith(b.k)} holat={m === b.k && b.k !== 'database' ? 'err' : undefined} onClick={() => manbaTanla(b.k)}>{tr(b.t)}</QChip>)}</div>}
      {xato && <QXato>{tr(S3_XATO[xato])}</QXato>}
      {izoh === 'manba' && <QIzoh>{tr({ uz: 'Dalil qayerdan olingani — manba.', ru: 'Откуда взят довод — источник.' })}</QIzoh>}
      {izoh === 'qachon' && <QIzoh>{tr({ uz: 'Qachon sanalgani ham yoziladi: kun yoki davr.', ru: 'Пишут и когда посчитано: день или период.' })}</QIzoh>}
      {ipucha && <QIzoh>{tr({ uz: 'Zal pufagidagi savolga qaysi variant javob beradi?', ru: 'Какой вариант отвечает на вопрос в облачке зала?' })}</QIzoh>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · dalil', ru: 'Понятие · довод' })} screen={screen} scrollSignal={qd} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, qd, 3, { uz: "Dalilni to'ldiring", ru: 'Заполните довод' }, done))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Zal sondan tashqari <A>yana nimani so'raydi?</A></>, ru: <>Что ещё, кроме числа, <A>спросит зал?</A></> })}
        mentor={<Mentor>{tr({ uz: "Mentor dalilini to'ldiramiz: har safar mos variantni bosing va zal savoliga qarang.", ru: 'Заполним довод Ментора: каждый раз нажимайте подходящий вариант и смотрите на вопрос зала.' })}</Mentor>}
        bashorat={!tugadi && <Bashorat savol={S3_SAVOL} variantlar={S3_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={<PitchDalil toliq={tugadi} manba={manba} zal={!tugadi && <Zal pufak={S3_PUFAK[qd] && tr(S3_PUFAK[qd])} ok={done} />} varaq={varaq} past={tanlov} />}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === '2'} haqiqat={{ uz: '2 — manba va qachon sanalgani', ru: '2 — источник и когда посчитано' }} />} matn={tr({ uz: 'Bu darsda har dalilda uch narsa bor: son yoki yozuv, manba va qachon olingani.', ru: 'В этом уроке в каждом доводе три вещи: число или запись, источник и когда получено.' })} />}
      >
        <Ustoz matn={[{ uz: "Umami va Database sonlari — har xil o'lchov: tashrif va ro'yxatdan o'tgan kishi; ular bir-biridan ayirilmaydi (tayanch 1.13). «Qachon» — kun yoki davr: Mentor misolida «ishga tushirilganidan bir hafta keyin», o'quvchida — 10-darsdagi hisobot sanasi. Bu misolda dalil — son; intervyu va sinovdan olingan dalil yozuv ham bo'lishi mumkin («sinovchi tugmani topa olmadi») — 6-mashqda shunday maydon bor.", ru: "Числа Umami и Database — разные измерения: посещение и зарегистрированный человек; их не вычитают друг из друга. «Когда» — день или период: в примере Ментора «через неделю после запуска», у ученика — дата отчёта 10-го урока. В этом примере довод — число; довод из интервью и тестов может быть и записью («тестировщик не нашёл кнопку») — в 6-м упражнении есть такое поле." },
          { uz: "Sinfdoshlar sanoqqa kiradi, lekin alohida aytiladi (10-dars). Sinfga savol: «Zal «Qayerdan?» va «Qachon?» deb so'raganda, sizda javob bormi?»", ru: 'Одноклассники входят в подсчёт, но называются отдельно (10-й урок). Вопрос классу: «Когда зал спросит «Откуда?» и «Когда?», есть ли у вас ответ?»' }]} />
      </QTushuncha>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s4 = 2; uy vazifalari ilovasi — P-002; javobdan keyin kichik teg, «?» katagi halqada) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · dalil', ru: 'Проверка · довод' })}
    questionText="Uy vazifalari ilovangiz pitchida: «40 kishi ro'yxatdan o'tdi — Database'dan». Dalilga nima yetishmaydi?"
    question={<h2 className="title h-ask">{tr({ uz: <>Uy vazifalari ilovangiz pitchida: «40 kishi ro'yxatdan o'tdi — Database'dan». <A>Dalilga nima yetishmaydi?</A></>, ru: <>В питче вашего приложения для домашних заданий: «40 человек зарегистрировались — из Database». <A>Чего не хватает доводу?</A></> })}</h2>}
    options={[
      { uz: "Son: necha kishi ro'yxatdan o'tgani", ru: 'Число: сколько человек зарегистрировалось' },
      { uz: 'Manba: bu son aynan qayerdan olingani', ru: 'Источник: откуда именно взято это число' },
      { uz: 'Qachon: bu son aynan qachon sanalgani', ru: 'Когда: когда именно посчитано это число' },
      { uz: 'Foiz: maqsadning necha foizi ekani', ru: 'Процент: сколько процентов от цели' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Qachon sanalgani yozilmagan — zal buni bilmaydi.', ru: 'Не написано, когда посчитано, — зал этого не знает.' }}
    explainWrong={{
      0: { uz: 'Son gapda bor — zal yana nimani so\'raydi?', ru: 'Число во фразе есть — что ещё спросит зал?' },
      1: { uz: 'Manba yozilgan — qaysi biri yo\'q?', ru: 'Источник написан — чего нет?' },
      3: { uz: "Foiz shart emas — dalilda qaysi uch narsa bor?", ru: 'Процент не обязателен — какие три вещи есть в доводе?' },
      default: { uz: "Dalildagi uch narsadan qaysi biri yo'q?", ru: 'Какой из трёх вещей довода нет?' }
    }}
    vizual={<DalilTeg soni={3} kataklar={[tr({ uz: '40 kishi', ru: '40 человек' }), 'Database', '?']} halqaI={2} />} />
);

// ===== MUSTAQIL ISH (5–7) — umumiy: gaplar, dalil tanlovlari, tekshiruv (bir manba; holat shakli bo'lak bilan birga saqlanadi — E 51) =====
const S5_KARTA = ['muammo', 'demo', 'keyingi'];
// Bo'lak gaplari: o'quvchi pitchidan (KOD 7) yoki o'zi yozganidan; yangi gaplar oxirida. k — barqaror kalit (bo'lak:manba:tartib)
const s5Gaplar = (p, ozi, yangi, b) => {
  const r = [];
  const qosh = (s, pre, extra) => gaplargaBol(s).forEach((t, i) => r.push({ k: `${b}:${pre}:${i}`, t, ...extra }));
  if (p) {
    if (b === 'muammo') { qosh(p.muammo.gap, 'p', { bos: true }); if (p.muammo.dalil) r.push({ k: 'muammo:dalil', t: p.muammo.dalil, dalilY: true }); }
    if (b === 'yechim' && p.yechim) r.push({ k: 'yechim:p', t: p.yechim, demo: true });
    if (b === 'demo') { if (p.demo.harakat) r.push({ k: 'demo:h', t: p.demo.harakat, demo: true }); qosh(p.demo.tuzatish, 't', { bos: true }); qosh(p.demo.son, 's', { bos: true }); }
    if (b === 'keyingi') qosh(p.keyingi, 'p', { bos: true });
  } else if (ozi) {
    if (b === 'yechim') { if (String(ozi.yechim || '').trim()) r.push({ k: 'yechim:o', t: ozi.yechim.trim(), demo: true }); }
    else qosh(ozi[b], 'o', { bos: true });
  }
  ((yangi && yangi[b]) || []).forEach(g => r.push({ k: g.k, t: g.t, bos: true, yangi: true }));
  return r;
};
// Da'volar — pitch tartibida, id d1…dN (tartib o'zgarmaydi; tayanch 8)
const s5Davolar = (p, ozi, yangi, belgi) => {
  const r = [];
  BOLAK.forEach(b => s5Gaplar(p, ozi, yangi, b.id).forEach(g => { if (g.bos && belgi.includes(g.k)) r.push({ gk: g.k, bolak: b.id, gap: g.t, yangi: !!g.yangi }); }));
  return r.map((d, i) => ({ ...d, id: 'd' + (i + 1) }));
};
const nuqta = (...a) => a.filter(x => x != null && String(x).trim() !== '').join(' · ');
const HISOBOT_YOQ = { uz: '10-darsdagi hisobot topilmadi — dalilni o\'zingiz yozing.', ru: 'Отчёт 10-го урока не найден — напишите довод сами.' };
const TUZ_IZOH = { uz: '10-darsda bu son «tuzatish» olgan — avval uni tuzating.', ru: 'На 10-м уроке это число получило «исправление» — сначала исправьте его.' };
const TUZ_SORA = { uz: 'Shu sonni tuzatdingizmi?', ru: 'Вы исправили это число?' };
// Hisobotdan tanlovlar — faqat bor maydonlar (tayanch 8 shakli; qachon — hisobotdagi sana, manba — hisobotda yozilgani)
const hisobotTanlov = (h, bolak, p) => {
  // 10-dars qiymati satr yoki { uz, ru } bo'lishi mumkin — matnga aylantiriladi
  const P = (x) => (x && typeof x === 'object' ? tr(x) : x);
  const r = [];
  const tuz = !!(h && h.tekshiruv === 'tuzatish');
  const tq = h ? h.tuzatishQator : null;
  const qo = (k, t, d, satrlar) => r.push({ k, t, d: { ...d, mk: manbaKey(d.manba) }, satrlar, sariq: tuz && tq === k, sora: tuz && !tq });
  if (h) {
    const R = h.royxat, As = h.asosiy, B = h.bosh, Q = h.qaytgan;
    if (R && P(R.soni) != null) {
      const sd = P(R.sinfdosh) != null;
      const uz = `Ro'yxatdan o'tgan: ${P(R.soni)}${sd ? `, shundan sinfdosh ${P(R.sinfdosh)}` : ''}`;
      const ru = `Зарегистрировались: ${P(R.soni)}${sd ? `, из них одноклассников ${P(R.sinfdosh)}` : ''}`;
      qo('royxat', { uz: nuqta(uz, P(R.manba), P(R.sana)), ru: nuqta(ru, P(R.manba), P(R.sana)) }, { son: { uz, ru }, manba: P(R.manba), qachon: P(R.sana) }, [{ n: { uz: "ro'yxatdan o'tgan", ru: 'зарегистрировались' }, v: P(R.soni) }, ...(sd ? [{ n: { uz: 'shundan sinfdosh', ru: 'из них одноклассники' }, v: P(R.sinfdosh) }] : [])]);
    }
    if (As && P(As.soni) != null) {
      const uz = `Asosiy harakatni qilgan: ${P(As.soni)}`;
      const ru = `Сделали основное действие: ${P(As.soni)}`;
      qo('asosiy', { uz: nuqta(uz, P(As.manba), P(As.sana)), ru: nuqta(ru, P(As.manba), P(As.sana)) }, { son: { uz, ru }, manba: P(As.manba), qachon: P(As.sana) }, [{ n: { uz: 'asosiy harakatni qilgan', ru: 'сделали основное действие' }, v: P(As.soni) }]);
    }
    if (B && P(B.soni) != null) {
      const nm = matnS(P(B.nima)) || 'Bosh raqam', nmR = matnS(P(B.nima)) || 'Главное число';
      qo('bosh', { uz: nuqta(`${nm}: ${P(B.soni)}`, P(B.manba), P(B.sana)), ru: nuqta(`${nmR}: ${P(B.soni)}`, P(B.manba), P(B.sana)) }, { son: { uz: `${nm}: ${P(B.soni)}`, ru: `${nmR}: ${P(B.soni)}` }, manba: P(B.manba), qachon: P(B.sana) }, [{ n: nm, v: P(B.soni) }]);
    }
    if (Q && P(Q.foiz) != null) {
      const uz = `Qaytganlar foizi: ${P(Q.foiz)}% — ${P(Q.birinchi)} qurilmadan ${P(Q.keyingi)} tasi${P(Q.davr) ? ` (${P(Q.davr)})` : ''}`;
      const ru = `Процент вернувшихся: ${P(Q.foiz)}% — ${P(Q.keyingi)} из ${P(Q.birinchi)} устройств${P(Q.davr) ? ` (${P(Q.davr)})` : ''}`;
      qo('qaytgan', { uz: nuqta(uz, P(Q.manba), P(Q.sana)), ru: nuqta(ru, P(Q.manba), P(Q.sana)) }, { son: { uz, ru }, manba: P(Q.manba), qachon: P(Q.sana) }, [{ n: { uz: 'birinchi ochgan', ru: 'открыли впервые' }, v: P(Q.birinchi) }, { n: { uz: 'yana ochgan', ru: 'открыли снова' }, v: P(Q.keyingi) }]);
    }
  }
  if (bolak === 'muammo' && p && p.muammo.dalil) r.push({ k: 'pitch', t: { uz: `11-Modul pitchidagi dalil: ${p.muammo.dalil}`, ru: `Довод из питча 11-го модуля: ${p.muammo.dalil}` }, forma: { matn: p.muammo.dalil, manba: 'intervyu', qachon: tr({ uz: '11-Modulda', ru: 'в 11-м модуле' }) } });
  return r;
};
// <dalil-tekshir> — dalil tekshiruvi (MD 6-ekran; PM-108: node da 8+ namuna bilan sinaladi). f: { matn, manba, qachon }; boshqalar — boshqa da'volardagi dalil matnlari
const UMAMI_SOZ = ['ishlat', "ro'yxat", "qo'shil", "e'lon"];
const dalilTekshir = (f, gap, boshqalar) => {
  const matn = String((f && f.matn) || '').trim();
  if (!matn) return { k: 'bosh', blok: true };
  if (!f.manba) return { k: 'manba', blok: true };
  if (SANAYDI.includes(f.manba) && !/\d/.test(matn)) return { k: 'raqam', blok: true };
  if (!String(f.qachon || '').trim()) return { k: 'qachon', blok: true };
  const g = String(gap || '').toLowerCase().replace(/[\u02BB\u02BC\u2018\u2019`]/g, "'");
  if (f.manba === 'umami' && UMAMI_SOZ.some(s => g.includes(s))) return { k: 'umami', blok: false };
  if ((boshqalar || []).some(b => String(b || '').trim().toLowerCase() === matn.toLowerCase())) return { k: 'takror', blok: false };
  return null;
};
// </dalil-tekshir>
const DALIL_XATO = {
  bosh: { uz: "Dalilni yozing: son yoki nimani ko'rganingiz.", ru: 'Напишите довод: число или что вы видели.' },
  raqam: { uz: 'Bu manba sanaydi — sonni yozing: nechta?', ru: 'Этот источник считает — напишите число: сколько?' },
  manba: { uz: 'Dalil qayerdan olingan — manbani tanlang.', ru: 'Откуда взят довод — выберите источник.' },
  qachon: { uz: 'Qachon olingan — kunini yoki davrini yozing.', ru: 'Когда получено — напишите день или период.' },
  umami: { uz: 'Umami lendingga tashrifni sanaydi — ilovadagi ishni emas.', ru: "Umami считает посещения лендинга — а не действия в приложении." },
  takror: { uz: "Bu dalil boshqa da'voda ham bor — ikkalasiga mosmi?", ru: 'Этот довод есть и в другом утверждении — подходит ли он к обоим?' }
};
// O'quvchi dalili: sanaydigan manba yoki matnda raqam → son, aks holda → yozuv (KOD 8)
const dalilYasa = (f) => {
  const matn = String(f.matn || '').trim();
  const son = SANAYDI.includes(f.manba) || raqamBor(matn);
  return { son: son ? matn : null, yozuv: son ? null : matn, manba: MANBA[f.manba].uz, mk: f.manba, qachon: String(f.qachon || '').trim() };
};
const dalilMatn = (d) => (d && d !== 'yoq' ? (d.son || d.yozuv || '') : '');
const dalilKatak = (d) => (d && d !== 'yoq' ? [dalilMatn(d), d.mk ? tr(MANBA[d.mk]) : d.manba, d.qachon] : null);
const FORMA0 = { matn: '', manba: null, qachon: '' };
const YordamTugma = ({ ochiq, onClick }) => <QTugma ikkinchi className="pd-ms-yordam" aria-expanded={ochiq} onClick={onClick}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>;
// «O'zim yozaman» — uch maydon (yorliq input ichida, doimiy raqam — E 43)
const DalilForma = ({ f, setF, xato }) => (
  <div className="pd-forma fade-step">
    <label className="pd-maydon"><i className="pd-n" aria-hidden="true">1</i>
      <input className={cx('pd-inp', xato && (xato.k === 'bosh' || xato.k === 'raqam') && 'err')} value={f.matn} maxLength={160} placeholder={tr({ uz: "Nechta — yoki nimani ko'rdingiz?", ru: 'Сколько — или что вы увидели?' })} aria-label={tr({ uz: 'son yoki yozuv', ru: 'число или запись' })} onChange={e => setF({ ...f, matn: e.target.value })} />
    </label>
    <div className={cx('pd-maydon', 'pd-manba-qator', !f.manba && 'pd-chorla faol', xato && xato.k === 'manba' && 'err')}><i className="pd-n" aria-hidden="true">2</i>
      {MANBA_K.map(k => <QChip key={k} holat={f.manba === k ? 'on' : undefined} onClick={() => setF({ ...f, manba: k })}>{tr(MANBA[k])}</QChip>)}
    </div>
    <label className="pd-maydon"><i className="pd-n" aria-hidden="true">3</i>
      <input className={cx('pd-inp', xato && xato.k === 'qachon' && 'err')} value={f.qachon} maxLength={80} placeholder={tr({ uz: 'Qaysi kuni yoki qaysi davrda?', ru: 'В какой день или за какой период?' })} aria-label={tr({ uz: 'qachon', ru: 'когда' })} onChange={e => setF({ ...f, qachon: e.target.value })} />
    </label>
    {f.manba && !SANAYDI.includes(f.manba) && !raqamBor(f.matn) && <span className="pd-kul">{tr({ uz: 'Sanagan bo\'lsangiz — sonini ham yozing.', ru: 'Если считали — напишите и число.' })}</span>}
  </div>
);
// Dalil tanlovlari (6-ekran va 7-ekrandagi qayta yozish): hisobot qatorlari · 11-Modul dalili · «O'zim yozaman»
const DalilTanlov = ({ opts, hisobotBor, tanlov, onTanla, sorov, forma, setForma, xato }) => {
  const tuzOgoh = opts.some(o => o.sora);
  return (
    <div className={cx('pd-tanlovlar', !tanlov && 'pd-chorla faol')}>
      {!hisobotBor && <p className="pd-kul">{tr(HISOBOT_YOQ)}</p>}
      {tuzOgoh && <p className="pd-ogoh">{tr(TUZ_IZOH)}</p>}
      {opts.map((o, i) => (
        <span key={o.k} className="pd-tanlov-w" style={{ animationDelay: `${i * 90}ms` }}>
          <button type="button" className={cx('pd-tanlov', tanlov === o.k && 'on', o.sariq && 'sariq', sorov === o.k && 'pd-halqa')} disabled={o.sariq} onClick={() => onTanla(o)}>{tr(o.t)}</button>
          {o.sariq && <span className="pd-sariq-iz">{tr(TUZ_IZOH)}</span>}
          {sorov === o.k && <span className="pd-ogoh">{tr(TUZ_SORA)}</span>}
        </span>
      ))}
      <span className="pd-tanlov-w" style={{ animationDelay: `${opts.length * 90}ms` }}>
        <button type="button" className={cx('pd-tanlov', 'ozi', tanlov === 'ozi' && 'on')} onClick={() => onTanla({ k: 'ozi' })}>{tr({ uz: "O'zim yozaman", ru: "Свой вариант" })}</button>
      </span>
      {(tanlov === 'ozi' || tanlov === 'pitch') && <DalilForma f={forma} setF={setForma} xato={xato} />}
    </div>
  );
};
// Manba oynasi — o'quvchi dalili o'z manba turi maketida (son yonadi)
const oquvchiManba = (tanlov, opt, forma) => {
  if (opt && opt.d) return <ManbaOyna tur={opt.d.mk} yorliq={matnS(String(opt.d.qachon || ''))} qatorlar={(opt.satrlar || []).map((s, i) => ({ k: 'o' + i, n: tr(s.n), v: String(s.v), on: true }))} />;
  if ((tanlov === 'ozi' || tanlov === 'pitch') && forma.manba) return <ManbaOyna tur={forma.manba} yorliq={forma.qachon} qatorlar={forma.matn.trim() ? [{ k: 'f', n: '', v: forma.matn.trim(), on: true, yozuv: !raqamBor(forma.matn) }] : []} />;
  return <ManbaOyna tur="bosh" />;
};

// ===== SCREEN 5 — DA'VOLARINGIZ (QMustaqil, USTAXONA 1/3 — bittadan karta: joriy bo'lak; gapni bosish → da'vo, tepadagi chiziqqa uchadi) =====
const S5_XATO = {
  bosh: { uz: "Kamida bitta da'voni belgilang.", ru: 'Отметьте хотя бы одно утверждение.' },
  kop: { uz: 'Oltita yetadi — qolganini birlashtiring yoki olib tashlang.', ru: 'Шести достаточно — остальные объедините или уберите.' },
  muammo: { uz: "Muammo gapi ham da'vo bo'lishi mumkin — qarab chiqing.", ru: 'Фраза о проблеме тоже может быть утверждением — посмотрите.' }
};
const QOLDIR_SAQLA = { uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: "Если оставить так — снова нажмите «Сохранить»." };
const S5_YORDAM = [
  { uz: "Uch joyga qarang: muammo gapi (kim qiynaladi), foydalanuvchilar haqidagi gap (nechta odam, nima qildi) va «tez orada», «hamma», «yoqdi» kabi so'zli gap.", ru: 'Посмотрите в три места: фраза о проблеме (кому трудно), фраза о пользователях (сколько людей, что сделали) и фраза со словами вроде «скоро», «все», «понравилось».' },
  { uz: "Yechim va asosiy harakatni zal jonli demoda o'zi ko'radi — bugun ularga dalil qo'yilmaydi. Web-trekda ham shunday — mahsulotingiz telefon brauzerida.", ru: 'Решение и основное действие зал сам увидит в живом демо — сегодня к ним довод не ставится. В веб-треке так же — ваш продукт в браузере телефона.' },
  { uz: "Belgilamagan gapingiz ham tekshirsa bo'ladigan bo'lsa — u pitchda dalilsiz qoladi: uni belgilang, boshqa gap bilan birlashtiring yoki olib tashlang.", ru: 'Если неотмеченную фразу тоже можно проверить — она останется в питче без довода: отметьте её, объедините с другой или уберите.' }
];
const s5Xulosa = (davolar) => {
  const n = davolar.length, a = davolar.filter(d => !d.yangi).length, b = n - a;
  const uz = [a && `${a} tasi 11-Modul pitchidan`, b && `${b} tasi yangi`].filter(Boolean).join(', ');
  // ru
  const ru = [a && `${a} — из питча 11-го модуля`, b && `${b} — новые`].filter(Boolean).join(', ');
  return { uz: `Pitchingizda ${n} ta da'vo: ${uz}.`, ru: `В вашем питче утверждений: ${n}; ${ru}.` };
};
const MentorVaraq5 = () => <PitchVaraq sarlavha={<MentorSar />} bolaklar={mentorBolaklar(g => (g.d !== undefined ? { holat: 'davo' } : {}))} />;
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [p] = useState(pitchOl);
  const sa = storedAnswer || {};
  const [bi, setBi] = useState(sa.saqlandi ? 3 : 0);
  const [birSaqlandi, setBirSaqlandi] = useState(!!sa.saqlandi);
  const [belgi, setBelgi] = useState(() => (Array.isArray(sa.belgi) ? sa.belgi : []));
  const [yangi, setYangi] = useState(() => sa.yangi || { muammo: [], demo: [], keyingi: [] });
  const [ozi, setOzi] = useState(() => sa.ozi || { muammo: '', yechim: '', demo: '', keyingi: '' });
  const [yMatn, setYMatn] = useState('');
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const yRef = useRef(Math.max(0, ...Object.values(sa.yangi || {}).flat().map(g => Number(String(g.k).split(':').pop()) || 0)) + 1);
  const yuborRef = useRef(!!sa.saqlandi);
  const stripRef = useRef(null);
  const [uch, qatlam] = useUchish();
  const saqlandi = bi >= 3;
  const davolar = s5Davolar(p, ozi, yangi, belgi);
  const n = davolar.length;
  const bolak = S5_KARTA[Math.min(bi, 2)];
  const gaplar = s5Gaplar(p, ozi, yangi, bolak);
  const och = (i) => { if (isMentor) return; setBi(i); setXato(null); setYumshoq(null); setYordam(false); setYMatn(''); };
  const toggle = (g, el) => {
    if (belgi.includes(g.k)) setBelgi(b => b.filter(x => x !== g.k));
    else { setBelgi(b => [...b, g.k]); uch(el, stripRef.current, qisqa(g.t, 24)); }
    setXato(null);
  };
  const qosh = () => {
    const t = yMatn.trim();
    if (!t) return;
    const k = `${bolak}:y:${yRef.current++}`;
    setYangi(y => ({ ...y, [bolak]: [...(y[bolak] || []), { k, t }] }));
    setYMatn('');
  };
  const tekshir = () => {
    if (n === 0) return { k: 'bosh', blok: true };
    if (n > 6) return { k: 'kop', blok: true };
    const mg = s5Gaplar(p, ozi, yangi, 'muammo').filter(g => g.bos);
    if (mg.length && !mg.some(g => belgi.includes(g.k))) return { k: 'muammo', blok: false };
    return null;
  };
  const saqla = () => {
    const x = tekshir();
    const sig = JSON.stringify(belgi);
    if (x && (x.blok || yumshoq !== sig)) { setXato(x); if (!x.blok) setYumshoq(sig); return; }
    setBi(3); setBirSaqlandi(true); setXato(null); setYumshoq(null); setYordam(false);
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, practice: "Da'volar", saqlandi: true, solved: true, correct: true, picked: true, belgi, yangi, ozi, davolar });
    if (!yuborRef.current && live && live.mode === 'student') { yuborRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
    jonliBelgi(live, ZONA_2, screen, davolar.length); // Mentor ro'yxatida «Da'volar n»
  };
  const oldinga = () => { if (bi === 2 || birSaqlandi) { saqla(); return; } setBi(bi + 1); setXato(null); setYumshoq(null); setYordam(false); setYMatn(''); };
  const yechimT = p ? p.yechim : '';
  const birinchiBos = gaplar.find(g => g.bos && !belgi.includes(g.k));
  const bolakdaBor = gaplar.some(g => g.bos && belgi.includes(g.k));
  const tepaChiziq = (
    <div className="pd-strip" ref={stripRef}>
      <b>{tr({ uz: "Da'volarim", ru: 'Мои утверждения' })} · {n}</b>
      {davolar.map(d => <span key={d.gk} className="pd-strip-i">{qisqa(d.gap, 22)}</span>)}
    </div>
  );
  const bolakQ = S5_KARTA.map((b, i) => {
    const tayyor = birSaqlandi || i < bi;
    const matn = <>{bolakNom(b)}{tayyor && <span className="pd-ms-son"> · {davolar.filter(d => d.bolak === b).length}</span>}</>;
    return tayyor && !saqlandi && i !== bi ? <button type="button" className="pd-ms-q" onClick={() => och(i)}>{matn}</button> : <span>{matn}</span>;
  });
  const yechimQator = (
    <p className="pd-kul pd-yechim-q">{tr({ uz: "Yechim — zal jonli demoda o'zi ko'radi, bugun unga dalil qo'yilmaydi:", ru: 'Решение — зал сам увидит в живом демо, сегодня к нему довод не ставится:' })} {p ? <b>{qisqa(yechimT, 90)}</b>
      : <input className="pd-inp pd-inp-ix" value={ozi.yechim} maxLength={160} placeholder={tr(BOLAK[1].nom)} aria-label={tr(BOLAK[1].nom)} onChange={e => { const v = e.target.value; setOzi(o => ({ ...o, yechim: v })); }} />}</p>
  );
  const kartaIchi = !saqlandi && <>
    {!p && <label className="pd-maydon"><i className="pd-n" aria-hidden="true">{bi + 1}</i><input className={cx('pd-inp', !String(ozi[bolak] || '').trim() && 'pd-halqa')} value={ozi[bolak]} maxLength={220} placeholder={bolakNom(bolak)} aria-label={bolakNom(bolak)} onChange={e => { const v = e.target.value; setOzi(o => ({ ...o, [bolak]: v })); setXato(null); }} /></label>}
    <div className="pd-ms-gaplar">{gaplar.filter(g => !g.demo || bolak === 'demo').map(g => <Gap key={g.k} g={{
      k: g.k, t: g.t, holat: g.demo ? 'demo' : (belgi.includes(g.k) ? 'davo' : 'oddiy'), dalilY: g.dalilY,
      onBos: g.bos ? (e) => toggle(g, e.currentTarget) : null, on: belgi.includes(g.k), chorla: !bolakdaBor && birinchiBos && birinchiBos.k === g.k
    }} />)}</div>
    <div className="pd-yangi-q">
      <input className="pd-inp" value={yMatn} maxLength={200} placeholder={tr({ uz: "Bugun shu bo'lakda nima demoqchisiz?", ru: 'Что хотите сказать в этой части сегодня?' })} aria-label={tr({ uz: 'Yangi gap', ru: 'Новая фраза' })} onChange={e => setYMatn(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') qosh(); }} />
      <QTugma ikkinchi disabled={!yMatn.trim()} onClick={qosh}>{tr({ uz: '+ Yangi gap', ru: '+ Новая фраза' })}</QTugma>
    </div>
    {xato && <QXato>{tr(S5_XATO[xato.k])}</QXato>}
    {xato && !xato.blok && <span className="pd-kul">{tr(QOLDIR_SAQLA)}</span>}
    <div className="pd-ms-tug">
      <QTugma className={halqa(bolakdaBor || (bi === 2 && n > 0))} onClick={oldinga}>{(bi === 2 || birSaqlandi) ? tr({ uz: 'Saqlash', ru: 'Сохранить' }) : tr({ uz: "Keyingi bo'lak", ru: 'Следующая часть' })}</QTugma>
      <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
    </div>
  </>;
  const tahrirB = (b) => <button type="button" className="pd-tahrir" onClick={() => och(S5_KARTA.indexOf(b))} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>;
  const oquvchiVaraq = (
    <PitchVaraq sarlavha={tr({ uz: 'Pitchim', ru: 'Мой питч' })} bolaklar={BOLAK.map(b => ({
      id: b.id, gaplar: s5Gaplar(p, ozi, yangi, b.id).map(g => ({ k: g.k, t: g.t, holat: g.demo ? 'demo' : (belgi.includes(g.k) ? 'davo' : 'oddiy'), dalilY: g.dalilY, tahrir: belgi.includes(g.k) && S5_KARTA.includes(b.id) ? tahrirB(b.id) : null }))
    }))} />
  );
  const yordamQuti = !saqlandi && yordam && <div className="pd-yordam-q fade-step">{S5_YORDAM.map((m, i) => <span key={i}>{tr(m)}</span>)}</div>;
  return (
    <Stage eyebrow={tr({ uz: "Mustaqil ish · da'vo", ru: 'Самостоятельная работа · утверждение' })} screen={screen} scrollSignal={bi * 10 + n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi && !isMentor} label={saqlandi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Da'volarni belgilang", ru: 'Отметьте утверждения' })} (${n})`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Pitchingizdagi <A>da'volarni belgilang.</A></>, ru: <>Отметьте <A>утверждения в питче.</A></> })}
        mentor={<Mentor>{tr({ uz: "Tekshirsa bo'ladigan gapni bosing; bugun aytmoqchi bo'lgan yangi gapingiz bo'lsa — qo'shing.", ru: 'Нажмите на фразу, которую можно проверить; если есть новая фраза, которую хотите сказать сегодня, — добавьте её.' })}</Mentor>}
        qadamlar={!isMentor && !saqlandi && <>{tepaChiziq}{!p && <p className="pd-kul">{tr({ uz: "11-Modul pitchingiz topilmadi — har bo'lakdan asosiy gapni yozing.", ru: 'Питч 11-го модуля не найден — напишите главную фразу каждой части.' })}</p>}{yechimQator}<QQadamlar qadamlar={bolakQ} joriy={bi} /></>}
        forma={isMentor ? <MentorVaraq5 />
          : saqlandi ? <div className="pd-fokus fade-step">{oquvchiVaraq}<QXulosa>{tr(s5Xulosa(davolar))}</QXulosa></div>
            : <div className="pd-ms-karta" key={bi}>
              <span className="q-yorliq">{bolakNom(bolak)} · {bi + 1} / 3</span>
              {kartaIchi}
            </div>}
        yordam={yordamQuti}
      >
        <Ustoz matn={[{ uz: "Ko'p o'quvchining 11-Modul pitchida foydalanuvchilar haqida gap yo'q — u ilova odamlarga yetmasdan yozilgan. «Bugun nima demoqchisiz?» deb so'rang: yangi gapni o'quvchi qo'shadi va tekshirsa bo'ladigan bo'lsa — o'zi belgilaydi.", ru: 'У многих учеников в питче 11-го модуля нет фразы о пользователях — он написан до того, как приложение дошло до людей. Спросите: «Что хотите сказать сегодня?» — новую фразу ученик добавляет и, если её можно проверить, отмечает сам.' },
          { uz: "Mentor misolini «to'g'ri javob» qilib bermang — da'volar har kimning o'z pitchidan. 11-Modul pitchidagi Database soni (`demo.son`) namuna va tekshiruv yozuvlari bilan sanalgan edi — bugun u ham da'vo.", ru: 'Не подавайте пример Ментора как «правильный ответ» — утверждения у каждого из своего питча. Число Database в питче 11-го модуля (`demo.son`) считалось вместе с образцами и проверочными записями — сегодня оно тоже утверждение.' }]} />
        <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: "Da'volarni belgilaganlar", ru: 'Отметили утверждения' }, zona: PRACTICE_BASE }]} chip={{ zona: ZONA_2, t: (r) => `${tr({ uz: "Da'volar", ru: 'Утверждения' })} ${r.picked}` }} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 6 — DALILLAR (QMustaqil, USTAXONA 2/3 — bittadan karta «Da'vo n / N»: chapda manba oynasi, o'ngda karta va dalil tegi; shu ekrandan keyin yakkama-yakka) =====
const S6_YORDAM = { uz: "Dalil 10-darsdagi hisobotingizda: ro'yxatdan o'tganlar, asosiy harakatni qilganlar, bosh raqam, qaytganlar foizi. Muammo uchun — 11-Modul intervyu va sinov yozuvlari: son ham, kuzatgan narsangiz ham bo'ladi. Dalil topilmasa, uni o'ylab topmang — «Dalil yo'q»ni bosing.", ru: "Довод — в вашем отчёте 10-го урока: зарегистрировавшиеся, сделавшие основное действие, главное число, процент вернувшихся. Для проблемы — записи интервью и тестов 11-го модуля: подойдёт и число, и то, что вы наблюдали. Если довода нет, не выдумывайте — нажмите «Довода нет»." };
const QOLDIR_QOY = { uz: 'Shunday qoldirsangiz — yana «Dalilni qo\'yish»ni bosing.', ru: "Если оставить так — снова нажмите «Поставить довод»." };
const MentorVaraq6 = () => <PitchVaraq sarlavha={<MentorSar />} bolaklar={mentorBolaklar(g => {
  if (g.d === undefined) return {};
  const dv = MENTOR_PITCH.davolar[g.d];
  return dv.kalit === 'bor' ? { holat: 'davo', teg: { soni: 3, kataklar: mDalil(dv.dalil), ixcham: true } } : { holat: 'davo', yoq: true };
})} />;
// Bitta da'vo uchun dalil tanlash holati (karta almashganda shu handlerda yangilanadi — effekt emas, E 51)
const useDalilHolat = () => {
  const [tanlov, setTanlov] = useState(null);
  const [opt, setOpt] = useState(null);
  const [forma, setForma] = useState(FORMA0);
  const [sorov, setSorov] = useState(null);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const tozala = () => { setTanlov(null); setOpt(null); setForma(FORMA0); setSorov(null); setXato(null); setYumshoq(null); };
  const tanla = (o) => {
    setXato(null);
    if (o.k === 'ozi') { setTanlov('ozi'); setOpt(null); setForma(FORMA0); setSorov(null); return; }
    if (o.sora && sorov !== o.k) { setSorov(o.k); return; }
    setSorov(null);
    if (o.forma) { setTanlov('pitch'); setOpt(null); setForma({ ...FORMA0, ...o.forma }); return; }
    setTanlov(o.k); setOpt(o);
  };
  // Tanlangan dalilni tekshirib qaytaradi: { d } yoki null (xato ko'rsatiladi)
  const ol = (gap, boshqalar) => {
    if (!tanlov) { setXato({ k: 'tanla', blok: true }); return null; }
    const sig = JSON.stringify([tanlov, forma]);
    if (tanlov === 'ozi' || tanlov === 'pitch') {
      const x = dalilTekshir(forma, gap, boshqalar);
      if (x && (x.blok || yumshoq !== sig)) { setXato(x); if (!x.blok) setYumshoq(sig); return null; }
      return { d: dalilYasa(forma) };
    }
    const son = tr(opt.d.son);
    if (boshqalar.some(b => String(b).trim().toLowerCase() === son.trim().toLowerCase()) && yumshoq !== sig) { setXato({ k: 'takror', blok: false }); setYumshoq(sig); return null; }
    return { d: { son, yozuv: null, manba: MANBA[opt.d.mk].uz, mk: opt.d.mk, qachon: String(opt.d.qachon || ''), tur: opt.k } };
  };
  const kataklar = tanlov === 'ozi' || tanlov === 'pitch'
    ? [forma.matn.trim(), forma.manba ? tr(MANBA[forma.manba]) : '', forma.qachon.trim()]
    : opt ? [tr(opt.d.son), tr(MANBA[opt.d.mk]), String(opt.d.qachon || '')] : [];
  return { tanlov, opt, forma, setForma, sorov, xato, setXato, tanla, tozala, ol, kataklar, toliq: kataklar.length === 3 && kataklar.every(x => String(x || '').trim()) };
};
// 6, 7-ekran: da'volar saqlanmagan bo'lsa (masalan, qayta yuklashdan keyin) — bo'sh ekran o'rniga yo'l (F-1006-389)
const DavoYoq = ({ orqaga }) => (
  <div className="pd-davo-yoq fade-step">
    <p className="pd-kul">{tr({ uz: "Da'volar hali belgilanmagan — avval pitchingizdagi da'volarni belgilang.", ru: 'Утверждения ещё не отмечены — сначала отметьте утверждения в питче.' })}</p>
    <QTugma onClick={orqaga}>{tr({ uz: "Da'volarni belgilash", ru: 'Отметить утверждения' })}</QTugma>
  </div>
);
const Screen6 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [p] = useState(pitchOl);
  const [h] = useState(hisobotOl);
  const davolar = (answers && answers[5] && answers[5].davolar) || [];
  const N = davolar.length;
  const [dal, setDal] = useState(() => (storedAnswer && storedAnswer.dalillar) || {});
  const birinchiBosh = (dd) => { const i = davolar.findIndex(d => !dd[d.gk]); return i < 0 ? N : i; };
  const [i, setI] = useState(() => birinchiBosh((storedAnswer && storedAnswer.dalillar) || {}));
  const [yordam, setYordam] = useState(false);
  const [yangiChip, setYangiChip] = useState(-1);
  const yuborRef = useRef(!!(storedAnswer && storedAnswer.saqlandi));
  const stripRef = useRef(null);
  const kartaRef = useRef(null);
  const [uch, qatlam] = useUchish();
  const ketma = useKetma();
  const dh = useDalilHolat();
  useKorin(dh.tanlov, '.pd-ms-karta .pd-ms-tug');
  const tugadi = N > 0 && i >= N;
  const dv = davolar[Math.min(i, Math.max(N - 1, 0))];
  const opts = dv ? hisobotTanlov(h, dv.bolak, p) : [];
  const dalilBor = davolar.filter(d => dal[d.gk] && dal[d.gk] !== 'yoq').length;
  const yoqSoni = davolar.filter(d => dal[d.gk] === 'yoq').length;
  const hal = dalilBor + yoqSoni;
  const yoz = (qiymat) => {
    const yangi = { ...dal, [dv.gk]: qiymat };
    setDal(yangi);
    uch(kartaRef.current, stripRef.current, qiymat === 'yoq' ? tr(YOQ_YORLIQ) : '✓ ' + qisqa(dalilMatn(qiymat), 20));
    setYangiChip(i); ketma([[900, () => setYangiChip(-1)]]);
    dh.tozala(); setYordam(false);
    const keyingi = davolar.findIndex((d, j) => j !== i && !yangi[d.gk]);
    setI(keyingi < 0 ? N : keyingi);
    const hammasi = davolar.every(d => yangi[d.gk]);
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, practice: 'Dalillar', saqlandi: hammasi, solved: hammasi, correct: true, picked: true, dalillar: yangi });
    if (hammasi && !yuborRef.current && live && live.mode === 'student') { yuborRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
    if (hammasi) jonliBelgi(live, ZONA_2, screen, davolar.filter(d => yangi[d.gk] && yangi[d.gk] !== 'yoq').length * 100 + davolar.length); // «Dalil n/N»: n·100 + N
  };
  const qoy = () => {
    const boshqalar = davolar.filter(d => d.gk !== dv.gk).map(d => dalilMatn(dal[d.gk])).filter(Boolean);
    const r = dh.ol(dv.gap, boshqalar);
    if (r) yoz(r.d);
  };
  const och = (j) => { dh.tozala(); setYordam(false); setI(j); };
  const tahrirB = (j) => <button type="button" className="pd-tahrir" onClick={() => och(j)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>;
  const tepaChiziq = (
    <div className="pd-strip" ref={stripRef}>
      <b>{tr({ uz: 'Dalillar', ru: 'Доводы' })} · {hal} / {N}</b>
      {davolar.map((d, j) => <span key={d.gk} className={cx('pd-strip-i', j === i && 'joriy', yangiChip === j && 'yangi')}>{qisqa(d.gap, 18)} · {dal[d.gk] === 'yoq' ? tr(YOQ_YORLIQ) : dal[d.gk] ? '✓' : '…'}</span>)}
    </div>
  );
  const xatoMatn = dh.xato && (dh.xato.k === 'tanla' ? <QXato>{tr(DALIL_XATO.bosh)}</QXato> : <QXato>{tr(DALIL_XATO[dh.xato.k])}</QXato>);
  const karta = dv && !tugadi && (
    <div className="pd-ms-karta" key={dv.gk} ref={kartaRef}>
      <span className="q-yorliq">{tr({ uz: "Da'vo", ru: 'Утверждение' })} {i + 1} / {N} · {bolakNom(dv.bolak)}</span>
      <b className="pd-ms-gap">{dv.gap}</b>
      <DalilTeg soni={3} kataklar={dh.kataklar} yorliqlar={TEG_YORLIQ()} />
      <DalilTanlov opts={opts} hisobotBor={!!h} tanlov={dh.tanlov} onTanla={dh.tanla} sorov={dh.sorov} forma={dh.forma} setForma={dh.setForma} xato={dh.xato} />
      {xatoMatn}
      {dh.xato && !dh.xato.blok && <span className="pd-kul">{tr(QOLDIR_QOY)}</span>}
      <div className="pd-ms-tug">
        <QTugma className={halqa(dh.toliq)} onClick={qoy}>{tr({ uz: "Dalilni qo'yish", ru: 'Поставить довод' })}</QTugma>
        <QTugma ikkinchi onClick={() => yoz('yoq')}>{tr({ uz: "Dalil yo'q", ru: 'Довода нет' })}</QTugma>
        <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
      </div>
    </div>
  );
  const oquvchiVaraq = () => {
    const s5 = (answers && answers[5]) || {};
    return <PitchVaraq sarlavha={tr({ uz: 'Pitchim', ru: 'Мой питч' })} bolaklar={BOLAK.map(b => ({
      id: b.id, gaplar: s5Gaplar(p, s5.ozi, s5.yangi, b.id).map(g => {
        const j = davolar.findIndex(d => d.gk === g.k);
        if (j < 0) return { k: g.k, t: g.t, holat: g.demo ? 'demo' : 'oddiy', dalilY: g.dalilY };
        const dd = dal[g.k];
        return { k: g.k, t: g.t, holat: 'davo', yoq: dd === 'yoq', teg: dd && dd !== 'yoq' ? { soni: 3, kataklar: dalilKatak(dd), ixcham: true } : null, tahrir: tahrirB(j) };
      })
    }))} />;
  };
  const xulosa = yoqSoni === 0
    ? { uz: "Hamma da'volaringizda dalil bor — manbasi va qachon olingani bilan.", ru: 'Во всех ваших утверждениях есть довод — с источником и тем, когда он получен.' }
    : { uz: `${dalilBor} ta da'voda dalil bor, ${yoqSoni} tasida yo'q.`, ru: `Утверждений с доводом: ${dalilBor}, без довода: ${yoqSoni}.` };
  let forma;
  if (isMentor) forma = <MentorVaraq6 />;
  else if (!N) forma = <DavoYoq orqaga={onPrev} />;
  else if (tugadi) forma = <div className="pd-fokus fade-step">{oquvchiVaraq()}<QXulosa>{tr(xulosa)}</QXulosa></div>;
  else forma = <PitchDalil manba={oquvchiManba(dh.tanlov, dh.opt, dh.forma)} varaq={karta} />;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · dalil', ru: 'Самостоятельная работа · довод' })} screen={screen} scrollSignal={i * 10 + hal} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi && !isMentor} label={tugadi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Dalil qo'ying", ru: 'Поставьте доводы' })} (${hal}/${N})`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Har da'vongizga <A>dalil qo'ying.</A></>, ru: <>Поставьте <A>довод к каждому утверждению.</A></> })}
        mentor={<Mentor>{tr({ uz: "Dalilni 10-darsdagi hisobotingizdan tanlang; dalil topilmasa — «Dalil yo'q»ni bosing.", ru: "Выберите довод из отчёта 10-го урока; если довода нет — нажмите «Довода нет»." })}</Mentor>}
        qadamlar={!isMentor && N > 0 && <><JonliQator matn={{ uz: "Yakkama-yakkada da'vo va dalillaringizni Mentorga o'z ekraningizda ko'rsatasiz.", ru: "На встрече один на один вы покажете Ментору свои утверждения и доводы на своём экране." }} />{!tugadi && tepaChiziq}</>}
        forma={forma}
        yordam={!tugadi && yordam && <div className="pd-yordam-q fade-step"><span>{tr(S6_YORDAM)}</span></div>}
      >
        <Ustoz matn={[{ uz: "Yakkama-yakka shu ekrandan keyin boshlanadi (A-8): o'quvchi ekranini ko'rsatadi; har o'quvchida bitta eng muhim da'vo, uning dalili va bitta dalilsiz gap — ≈ 2–3 daqiqa.", ru: "Встреча один на один начинается после этого экрана: ученик показывает свой экран; у каждого одно самое важное утверждение, его довод и одна фраза без довода — ≈ 2–3 минуты." },
          { uz: "Uch savol: «Bu son qayerdan va nimani sanaydi?» (ro'yxatdan o'tganlar soni bo'lsa — «sinfdoshlar alohida aytilganmi?») · «Bu dalil aynan shu gapni ko'rsatadimi?» · «Qaysi da'vo dalilsiz — qayta yozasizmi yoki olib tashlaysizmi?».", ru: 'Три вопроса: «Откуда это число и что оно считает?» (если это число зарегистрировавшихся — «одноклассники названы отдельно?») · «Этот довод показывает именно эту фразу?» · «Какое утверждение без довода — перепишете или уберёте?».' },
          { uz: "Manba va gap mosligini dars tekshirmaydi (faqat Umami uchun yumshoq ogohlantirish bor) — buni siz ikkinchi savol bilan ko'rasiz: Umami tashrifi «ilovani ishlatyapti» da'vosiga qo'yilgan bo'lsa — «bu son nimani sanaydi?».", ru: "Соответствие источника и фразы урок не проверяет (есть только мягкое предупреждение для Umami) — это вы видите вторым вопросом: если посещение из Umami поставлено к утверждению «пользуются приложением» — «что считает это число?»." },
          { uz: "«Dalil yo'q» — xato emas: sonni o'ylab topishdan yaxshiroq. Namuna va tekshiruv akkauntlari sanoqqa kirmagan bo'lishi kerak (10-dars).", ru: '«Довода нет» — не ошибка: это лучше, чем выдумать число. Образцы и проверочные аккаунты не должны входить в подсчёт (10-й урок).' }]} />
        <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: "Dalil qo'yganlar", ru: 'Поставили доводы' }, zona: PRACTICE_BASE }]} chip={{ zona: ZONA_2, t: (r) => `${tr({ uz: 'Dalil', ru: 'Довод' })} ${Math.floor(r.picked / 100)}/${r.picked % 100}`, toliq: (r) => Math.floor(r.picked / 100) === r.picked % 100 }} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 7 — TUZATILGAN PITCH (QMustaqil, USTAXONA 3/3 — dalilsiz da'volar bittadan: «Qayta yozish» / «Olib tashlash» → yakuniy «Pitchim» kartasi, ko'rik → «Saqlash» → pm-m10d11-pitch) =====
const S7_XATO = {
  dalilsiz: { uz: "Qayta yozilgan gapga dalil qo'ying.", ru: 'Поставьте довод к переписанной фразе.' },
  ozgarmadi: { uz: "Gap o'zgarmadi — dalil ko'rsatadigan narsani yozing.", ru: 'Фраза не изменилась — напишите то, что показывает довод.' },
  raqamsiz: { uz: 'Yangi gapda dalildagi son aytilsin.', ru: 'Пусть в новой фразе прозвучит число из довода.' },
  keyingi: { uz: "Keyingi qadam bo'sh qoldi — bitta ishingizni yozing.", ru: 'Часть «Следующий шаг» осталась пустой — напишите одно своё дело.' },
  korib: { uz: "Avval belgilanmagan gaplarni ko'rib chiqing.", ru: 'Сначала просмотрите неотмеченные фразы.' }
};
const S7_YORDAM = [
  { uz: "Qayta yozish — dalil topiladigan gap uchun: «yoqdi» o'rniga odamlar nima qilganini yozing. Olib tashlash — dalil topilmaydigan gap uchun. «Tez orada …» kabi va'dani olib tashlash ham, maqsad deb qayta yozish ham mumkin: «Maqsadimiz — …».", ru: 'Переписать — для фразы, к которой найдётся довод: вместо «понравилось» напишите, что сделали люди. Убрать — для фразы без довода. Обещание вроде «Скоро …» можно убрать или переписать как цель: «Наша цель — …».' },
  { uz: "Mentor misolida: «O'yinchilarga ilova yoqdi» o'rniga «Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi.»", ru: 'В примере Ментора: вместо «Игрокам понравилось приложение» — «Из 46 устройств, открывших приложение в первые три дня, 17 снова открыли его в следующие два дня.»' }
];
const QAROR_Y = { qoldi: { uz: 'qoldi', ru: 'осталось' }, 'qayta-yozildi': { uz: 'qayta yozildi', ru: 'переписано' }, 'olib-tashlandi': { uz: 'olib tashlandi', ru: 'убрано' } };
const dalilToza = (d) => (d && d !== 'yoq' ? { son: d.son || null, yozuv: d.yozuv || null, manba: d.manba, qachon: d.qachon } : null);
const MentorVaraq7 = () => <PitchVaraq sarlavha={tr({ uz: 'Tuzatilgan pitch', ru: 'Исправленный питч' })} bolaklar={mentorBolaklar(g => {
  if (g.d === undefined) return {};
  const dv = MENTOR_PITCH.davolar[g.d];
  if (dv.qaror === 'qoldi') return { holat: 'davo', qaror: tr(QAROR_Y.qoldi), teg: { soni: 3, kataklar: mDalil(dv.dalil), ixcham: true } };
  if (dv.qaror === 'qayta-yozildi') return { holat: 'davo', qayta: true, yangiT: tr(dv.yangiGap), qaror: tr(QAROR_Y['qayta-yozildi']), teg: { soni: 3, kataklar: mDalil(dv.dalil), ixcham: true } };
  return { holat: 'davo', olindi: true, yangiT: tr(dv.yangiGap), qaror: tr(QAROR_Y['olib-tashlandi']) };
})} />;
const Screen7 = ({ screen, storedAnswer, answers, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [p] = useState(pitchOl);
  const [h] = useState(hisobotOl);
  const s5 = (answers && answers[5]) || {};
  const davolar = s5.davolar || [];
  const dal = (answers && answers[6] && answers[6].dalillar) || {};
  const dalilsiz = davolar.filter(d => !dal[d.gk] || dal[d.gk] === 'yoq');
  const N = dalilsiz.length;
  const sa = storedAnswer || {};
  const [qaror, setQaror] = useState(() => sa.qarorlar || {});
  const birinchi = (q) => { const j = dalilsiz.findIndex(d => !q[d.gk]); return j < 0 ? N : j; };
  const [i, setI] = useState(() => birinchi(sa.qarorlar || {}));
  const [rejim, setRejim] = useState(null);
  const [matn, setMatn] = useState('');
  const [ish, setIsh] = useState('');
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [korib, setKorib] = useState(!!sa.korib);
  const [tahrir, setTahrir] = useState(() => sa.tahrir || {});
  const [tahrirOch, setTahrirOch] = useState(null);
  const [zaxiraQoy, setZaxiraQoy] = useState(!!sa.zaxiraQoy);
  const [saqlandi, setSaqlandi] = useState(!!sa.saqlandi);
  const [yondi, setYondi] = useState(false);
  const [yordam, setYordam] = useState(false);
  const yuborRef = useRef(!!sa.saqlandi);
  const stripRef = useRef(null);
  const kartaRef = useRef(null);
  const [uch, qatlam] = useUchish();
  const ketma = useKetma();
  const dh = useDalilHolat();
  useKorin(dh.tanlov || rejim, '.pd-ms-karta .pd-ms-tug');
  const halN = dalilsiz.filter(d => qaror[d.gk]).length;
  const hammasi = halN === N && i >= N;
  const dv = dalilsiz[Math.min(i, Math.max(N - 1, 0))];
  const zaxiraIsh = h && h.zaxira && matnS(h.zaxira.ish) ? matnS(h.zaxira.ish) : '';
  // 11-Modul dalili da'voga dalil bo'lib qo'yilgan bo'lsa — varaqda ikki marta chiqmaydi
  const dalilMatnlar = [...Object.values(dal), ...Object.values(qaror).map(q => q && q.dalil)].map(x => dalilMatn(x).trim().toLowerCase()).filter(Boolean);
  // Bo'lakdagi yakuniy gaplar (olib tashlanganlar ko'rinmaydi)
  const yakuniy = (bid, qq = qaror, tt = tahrir, zq = zaxiraQoy) => {
    const r = [];
    s5Gaplar(p, s5.ozi, s5.yangi, bid).forEach(g => {
      const d = davolar.find(x => x.gk === g.k);
      if (!d) {
        if (g.dalilY && dalilMatnlar.includes(g.t.trim().toLowerCase())) return;
        const t = tt[g.k] !== undefined ? tt[g.k] : g.t;
        if (String(t).trim()) r.push({ k: g.k, t, oddiy: true, demo: g.demo, dalilY: g.dalilY });
        return;
      }
      const dd = dal[g.k];
      if (dd && dd !== 'yoq') { r.push({ k: g.k, t: g.t, d: dd, qaror: 'qoldi' }); return; }
      const q = qq[g.k];
      if (!q) { r.push({ k: g.k, t: g.t, ochiq: true }); return; }
      if (q.qaror === 'qayta-yozildi') r.push({ k: g.k, t: q.yangiGap, d: q.dalil, qaror: q.qaror });
      else if (q.yangiGap) r.push({ k: g.k + ':o', t: q.yangiGap, oddiy: true, orniga: true });
    });
    if (bid === 'keyingi' && zq && zaxiraIsh) return [{ k: 'keyingi:z', t: zaxiraIsh, oddiy: true }];
    return r;
  };
  const keyingiAsl = davolar.filter(d => d.bolak === 'keyingi').every(d => dal[d.gk] && dal[d.gk] !== 'yoq') && !Object.keys(tahrir).some(k => k.startsWith('keyingi:'));
  // «Olib tashlash»: Keyingi qadam bo'lagida boshqa gap qolmasa — o'rniga ish (MD)
  const boshqaQoladi = (d) => yakuniy(d.bolak, { ...qaror, [d.gk]: { qaror: 'olib-tashlandi', yangiGap: null } }).length > 0;
  const kartaTozala = () => { setRejim(null); setMatn(''); setIsh(''); setXato(null); setYumshoq(null); setYordam(false); dh.tozala(); };
  const hal = (q) => {
    const yangi = { ...qaror, [dv.gk]: q };
    setQaror(yangi);
    uch(kartaRef.current, stripRef.current, tr(QAROR_Y[q.qaror]));
    kartaTozala();
    const keyingi = dalilsiz.findIndex((d, j) => j !== i && !yangi[d.gk]);
    setI(keyingi < 0 ? N : keyingi);
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, practice: 'Tuzatilgan pitch', saqlandi: false, solved: false, correct: false, picked: true, qarorlar: yangi, korib, tahrir, zaxiraQoy });
    setSaqlandi(false);
  };
  const olibTashla = () => {
    setRejim('olib'); setXato(null);
    if (dv.bolak !== 'keyingi' || boshqaQoladi(dv)) ketma([[700, () => hal({ qaror: 'olib-tashlandi', yangiGap: null })]]);
  };
  const kartaSaqla = () => {
    if (rejim === 'olib') {
      if (!ish.trim()) { setXato({ k: 'keyingi', blok: true }); return; }
      hal({ qaror: 'olib-tashlandi', yangiGap: ish.trim() });
      return;
    }
    if (!dh.tanlov) { setXato({ k: 'dalilsiz', blok: true }); return; }
    const boshqalar = davolar.filter(d => d.gk !== dv.gk).map(d => dalilMatn(dal[d.gk]) || dalilMatn(qaror[d.gk] && qaror[d.gk].dalil)).filter(Boolean);
    const r = dh.ol(matn, boshqalar);
    if (!r) { setXato(null); return; }
    const sig = JSON.stringify([matn, r.d]);
    const t = matn.trim();
    const yx = !t || t === dv.gap.trim() ? 'ozgarmadi' : (r.d.son && !raqamBor(t) ? 'raqamsiz' : null);
    if (yx && yumshoq !== sig) { setXato({ k: yx, blok: false }); setYumshoq(sig); return; }
    hal({ qaror: 'qayta-yozildi', yangiGap: t || dv.gap, dalil: r.d });
  };
  const nuqtali = (t) => { const x = String(t || '').trim(); return !x || /[.!?…»"]$/.test(x) ? x : x + '.'; };
  const bolaklarMatn = (qq = qaror, tt = tahrir, zq = zaxiraQoy) => Object.fromEntries(BOLAK.map(b => [b.id, yakuniy(b.id, qq, tt, zq).map(g => nuqtali(g.t)).filter(Boolean).join(' ')]));
  const yakunSaqla = () => {
    if (!korib) { setXato({ k: 'korib', blok: true }); return; }
    const bm = bolaklarMatn();
    if (!bm.keyingi.trim()) { setXato({ k: 'keyingi', blok: true }); return; }
    const sDavolar = davolar.map(d => {
      const dd = dal[d.gk];
      if (dd && dd !== 'yoq') return { id: d.id, bolak: d.bolak, gap: d.gap, dalil: dalilToza(dd), qaror: 'qoldi', yangiGap: null };
      const q = qaror[d.gk] || {};
      if (q.qaror === 'qayta-yozildi') return { id: d.id, bolak: d.bolak, gap: d.gap, dalil: dalilToza(q.dalil), qaror: 'qayta-yozildi', yangiGap: q.yangiGap };
      return { id: d.id, bolak: d.bolak, gap: d.gap, dalil: null, qaror: 'olib-tashlandi', yangiGap: q.yangiGap || null };
    });
    // O'zgarmas shartlar (11-FILTR 15): qoldi → dalil · qayta-yozildi → yangiGap va dalil · dalil da son yoki yozuv
    const buzildi = sDavolar.some(d => (d.qaror !== 'olib-tashlandi' && !d.dalil) || (d.qaror === 'qayta-yozildi' && !d.yangiGap) || (d.dalil && !(d.dalil.son || d.dalil.yozuv)));
    if (buzildi) { setXato({ k: 'dalilsiz', blok: true }); return; }
    lsY(NATIJA_KEY, { davolar: sDavolar, bolaklar: bm, savedAt: Date.now() });
    setXato(null); setSaqlandi(true); setYondi(true); ketma([[1400, () => setYondi(false)]]);
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, practice: 'Tuzatilgan pitch', saqlandi: true, solved: true, correct: true, picked: true, qarorlar: qaror, korib, tahrir, zaxiraQoy });
    if (!yuborRef.current && live && live.mode === 'student') { yuborRef.current = true; live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
  };
  const qaytaOch = (gk) => { const j = dalilsiz.findIndex(d => d.gk === gk); if (j < 0) return; const q = { ...qaror }; delete q[gk]; setQaror(q); kartaTozala(); setI(j); setSaqlandi(false); };
  const tahrirB = (on) => <button type="button" className="pd-tahrir" onClick={on} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>;
  const tepaChiziq = (
    <div className="pd-strip" ref={stripRef}>
      <b>{tr({ uz: 'Dalilsiz', ru: 'Без довода' })} · {halN} / {N}</b>
      {dalilsiz.map((d, j) => <span key={d.gk} className={cx('pd-strip-i', j === i && !hammasi && 'joriy')}>{qisqa(d.gap, 18)}{qaror[d.gk] ? ` · ${tr(QAROR_Y[qaror[d.gk].qaror])}` : ''}</span>)}
    </div>
  );
  const xatoMatn = xato && <QXato>{tr(xato.k === 'tanla' ? S7_XATO.dalilsiz : (S7_XATO[xato.k] || DALIL_XATO[xato.k]))}</QXato>;
  const dhXato = dh.xato && dh.xato.k !== 'tanla' && <QXato>{tr(DALIL_XATO[dh.xato.k])}</QXato>;
  const opts = dv ? hisobotTanlov(h, dv.bolak, p) : [];
  const karta = dv && !hammasi && (
    <div className="pd-ms-karta" key={dv.gk} ref={kartaRef}>
      <span className="q-yorliq">{bolakNom(dv.bolak)} · {i + 1} / {N}</span>
      {rejim === 'qayta'
        ? <label className="pd-maydon"><i className="pd-n" aria-hidden="true">✎</i><input className="pd-inp" value={matn} maxLength={220} aria-label={tr({ uz: 'Qayta yozish', ru: 'Переписать' })} onChange={e => { setMatn(e.target.value); setXato(null); }} /></label>
        : <div className={cx('pd-g', 'h-davo', rejim === 'olib' && 'olindi')}><div className="pd-g-q"><span className="pd-g-t">{dv.gap}</span><span className="pd-g-yoq">{tr(YOQ_YORLIQ)}</span></div></div>}
      {!rejim && <div className="pd-chorla faol pd-qaror-tug">
        <QChip onClick={() => { setRejim('qayta'); setMatn(dv.gap); setXato(null); }}>{tr({ uz: 'Qayta yozish', ru: 'Переписать' })}</QChip>
        <QChip onClick={olibTashla}>{tr({ uz: 'Olib tashlash', ru: 'Убрать' })}</QChip>
      </div>}
      {rejim === 'qayta' && <>
        <DalilTeg soni={3} kataklar={dh.kataklar} yorliqlar={TEG_YORLIQ()} />
        <DalilTanlov opts={opts} hisobotBor={!!h} tanlov={dh.tanlov} onTanla={(o) => { setXato(null); dh.tanla(o); }} sorov={dh.sorov} forma={dh.forma} setForma={dh.setForma} xato={dh.xato} />
      </>}
      {rejim === 'olib' && dv.bolak === 'keyingi' && !boshqaQoladi(dv) && <div className={cx('pd-orniga', 'fade-step', !ish.trim() && 'pd-chorla faol')}>
        <b className="pd-kul">{tr({ uz: "O'rniga keyingi qadam", ru: 'Вместо этого — следующий шаг' })}</b>
        {zaxiraIsh && <button type="button" className={cx('pd-tanlov', ish === zaxiraIsh && 'on')} onClick={() => { setIsh(zaxiraIsh); setXato(null); }}>{tr({ uz: 'Zaxira rejadagi ish', ru: 'Дело из запасного плана' })}: {zaxiraIsh}</button>}
        <label className="pd-maydon"><i className="pd-n" aria-hidden="true">1</i><input className={cx('pd-inp', xato && xato.k === 'keyingi' && 'err')} value={ish} maxLength={200} placeholder={tr({ uz: 'Keyingi ishingiz', ru: 'Ваше следующее дело' })} aria-label={tr({ uz: 'Keyingi ishingiz', ru: 'Ваше следующее дело' })} onChange={e => { setIsh(e.target.value); setXato(null); }} /></label>
      </div>}
      {xatoMatn}{dhXato}
      {((xato && !xato.blok) || (dh.xato && !dh.xato.blok)) && <span className="pd-kul">{tr(QOLDIR_SAQLA)}</span>}
      {(rejim === 'qayta' || (rejim === 'olib' && dv.bolak === 'keyingi' && !boshqaQoladi(dv)) || !rejim) && <div className="pd-ms-tug">
        {rejim && <QTugma className={halqa(rejim === 'qayta' ? dh.toliq : !!ish.trim())} onClick={kartaSaqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>}
        <YordamTugma ochiq={yordam} onClick={() => setYordam(o => !o)} />
      </div>}
    </div>
  );
  const yakunKarta = () => {
    const sar = saqlandi ? tr({ uz: 'Tuzatilgan pitch', ru: 'Исправленный питч' }) : tr({ uz: 'Pitchim', ru: 'Мой питч' });
    return (
      <PitchVaraq yondi={yondi} sarlavha={<span className="pd-sar-alm" key={sar}>{sar}</span>}
        tepa={<div className="pd-korik">
          <span className="pd-kul">{tr({ uz: "Belgilanmagan gaplarni ko'zdan kechiring: tekshirsa bo'ladigani qolmadimi?", ru: 'Просмотрите неотмеченные фразы: не осталось ли тех, что можно проверить?' })}</span>
          <button type="button" className={cx('pd-chek', korib && 'on', !korib && 'pd-halqa')} aria-pressed={korib} onClick={() => { setKorib(k => !k); setXato(null); }}><i aria-hidden="true">{korib ? '✓' : ''}</i>{tr({ uz: "Ko'rib chiqdim", ru: "Просмотрено" })}</button>
        </div>}
        bolaklar={BOLAK.map(b => ({
          id: b.id,
          gaplar: yakuniy(b.id).map(g => (g.oddiy
            ? (tahrirOch === g.k
              ? { k: g.k, t: <input className="pd-inp pd-inp-ix" autoFocus defaultValue={g.t} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })} onBlur={e => { const v = e.target.value; setTahrir(t => ({ ...t, [g.k]: v })); setTahrirOch(null); setSaqlandi(false); }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />, holat: 'oddiy' }
              : { k: g.k, t: g.t, holat: g.demo ? 'demo' : 'oddiy', dalilY: g.dalilY, tahrir: !g.demo && !g.orniga && g.k !== 'keyingi:z' && tahrirB(() => setTahrirOch(g.k)) })
            : g.ochiq ? { k: g.k, t: g.t, holat: 'davo', yoq: true }
              : { k: g.k, t: g.t, holat: 'davo', teg: { soni: 3, kataklar: dalilKatak(g.d), ixcham: true }, tahrir: g.qaror === 'qayta-yozildi' ? tahrirB(() => qaytaOch(g.k)) : null })),
          past: b.id === 'keyingi' && zaxiraIsh && keyingiAsl && <span className="pd-zaxira">
            <span className="pd-kul">{tr({ uz: "Keyingi qadam 11-Modulda yozilgan — kerak bo'lsa, zaxira rejadagi ishni qo'ying.", ru: '«Следующий шаг» написан в 11-м модуле — при необходимости поставьте дело из запасного плана.' })}</span>
            <button type="button" className={cx('pd-tanlov', zaxiraQoy && 'on')} onClick={() => { setZaxiraQoy(z => !z); setSaqlandi(false); }}>{tr({ uz: 'Zaxira rejadagi ish', ru: 'Дело из запасного плана' })}: {zaxiraIsh}</button>
          </span>
        }))}
        past={<>
          {xatoMatn}
          <div className="pd-ms-tug ong"><QTugma className={halqa(korib && !saqlandi)} onClick={yakunSaqla}>{saqlandi ? tr({ uz: 'Yangilash', ru: 'Обновить' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
        </>} />
    );
  };
  const sanoq = { a: 0, b: 0, c: 0 };
  davolar.forEach(d => { const dd = dal[d.gk]; if (dd && dd !== 'yoq') sanoq.a += 1; else if (qaror[d.gk] && qaror[d.gk].qaror === 'qayta-yozildi') sanoq.b += 1; else if (qaror[d.gk]) sanoq.c += 1; });
  const xulosa = {
    uz: `Tuzatilgan pitchingizda ${[sanoq.a && `${sanoq.a} ta da'vo dalil bilan qoldi`, sanoq.b && `${sanoq.b} tasi qayta yozildi`, sanoq.c && `${sanoq.c} tasi olib tashlandi`].filter(Boolean).join(', ')}.`,
    ru: `В исправленном питче: ${[sanoq.a && `с доводом осталось ${sanoq.a}`, sanoq.b && `переписано ${sanoq.b}`, sanoq.c && `убрано ${sanoq.c}`].filter(Boolean).join(', ')}.`
  };
  let forma;
  if (isMentor) forma = <MentorVaraq7 />;
  else if (!davolar.length) forma = <DavoYoq orqaga={() => { onPrev(); onPrev(); }} />;
  else if (!hammasi) forma = karta;
  else forma = <div className="pd-fokus fade-step">
    {N === 0 && !saqlandi && <p className="pd-kul">{tr({ uz: "Dalilsiz da'vo yo'q — pitchingizni ko'rib, saqlang.", ru: 'Утверждений без довода нет — просмотрите питч и сохраните.' })}</p>}
    {yakunKarta()}
    {saqlandi && <QIzoh>{tr({ uz: "Har da'vosida dalil bor yoki dalilsiz da'vosi olib tashlangan pitch — tuzatilgan pitch.", ru: 'Питч, в котором у каждого утверждения есть довод или утверждения без довода убраны, — исправленный питч.' })}</QIzoh>}
    {saqlandi && <QXulosa>{tr(xulosa)}</QXulosa>}
  </div>;
  const navY = isMentor || saqlandi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !hammasi ? `${tr({ uz: "Har da'voni hal qiling", ru: 'Решите каждое утверждение' })} (${halN}/${N})` : tr({ uz: 'Tuzatilgan pitchni saqlang', ru: 'Сохраните исправленный питч' });
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · tuzatilgan pitch', ru: 'Самостоятельная работа · исправленный питч' })} screen={screen} scrollSignal={i * 10 + halN + (saqlandi ? 100 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi && !isMentor} label={navY} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Dalilsiz da'volarni <A>qayta yozing yoki olib tashlang.</A></>, ru: <>Утверждения без довода <A>перепишите или уберите.</A></> })}
        mentor={<Mentor>{tr({ uz: 'Har dalilsiz da\'voga bittasini tanlang, oxirida pitchingizni saqlang.', ru: 'Для каждого утверждения без довода выберите одно из двух, в конце сохраните питч.' })}</Mentor>}
        qadamlar={!isMentor && !hammasi && N > 0 && tepaChiziq}
        forma={forma}
        yordam={!isMentor && <>
          {yordam && !hammasi && <div className="pd-yordam-q fade-step">{S7_YORDAM.map((m, k) => <span key={k}>{tr(m)}</span>)}</div>}
          <JonliQator matn={{ uz: "Mentor chaqirganda pitchingizni ko'rsating; o'zgarsa — ✎ bilan o'zgartiring.", ru: 'Когда Ментор позовёт, покажите питч; если что-то изменится — исправьте через ✎.' }} />
        </>}
      >
        <Ustoz matn={[{ uz: "Olib tashlash — mag'lubiyat emas: dalilsiz gap zal savolida qoqiladi. Qayta yozilgan gap eski da'voni isbotlamaydi — odamlar nima qilganini aytadi. Kelajak soni maqsad bo'lsa — maqsad deb aytiladi; «bo'ladi», «yetamiz» degan va'da esa dalil talab qiladi. Yakkama-yakkadan keyin o'quvchi ✎ bilan o'zgartiradi va «Yangilash»ni bosadi.", ru: "Убрать — не поражение: фраза без довода споткнётся на вопросе зала. Переписанная фраза не доказывает старое утверждение — она говорит, что сделали люди. Если число из будущего — цель, его называют целью; обещание «будет», «дойдём» требует довода. После встречи один на один ученик исправляет через ✎ и нажимает «Обновить»." },
          { uz: "Tez tugatgan o'quvchi Mentor chaqirguncha tuzatilgan pitchni sherigiga o'qib beradi; sherik bitta da'voni tanlab so'raydi: «Bu son qayerdan?»", ru: 'Кто закончил быстро, пока Ментор не позвал, читает исправленный питч соседу; сосед выбирает одно утверждение и спрашивает: «Откуда это число?»' }]} />
        <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: 'Tuzatilgan pitchni saqlaganlar', ru: 'Сохранили исправленный питч' }, zona: PRACTICE_BASE }]} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s8 = 1; scope final; kitob almashish ilovasi — P-002; javobdan keyin kichik varaq) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Pitchingizdan «Bir oyda 200 kishi bo'ladi» va'dasini olib tashladingiz. O'rniga nima aytasiz?"
    question={<h2 className="title h-ask">{tr({ uz: <>Pitchingizdan «Bir oyda 200 kishi bo'ladi» va'dasini olib tashladingiz. <A>O'rniga nima aytasiz?</A></>, ru: <>Вы убрали из питча обещание «За месяц будет 200 человек». <A>Что скажете вместо него?</A></> })}</h2>}
    options={[
      { uz: "Shu va'daning kichikroq sonli shaklini", ru: 'То же обещание с числом поменьше' },
      { uz: 'Keyingi qiladigan bitta ishingizni', ru: 'Одно дело, которое сделаете дальше' },
      { uz: 'Ilovangizdagi eng chiroyli ekranni', ru: 'Самый красивый экран приложения' },
      { uz: 'Zal beradigan savolning javobini', ru: 'Ответ на вопрос, который задаст зал' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Keyingi qadam bo\'lagida qiladigan ishingiz aytiladi.', ru: 'В части «Следующий шаг» называют дело, которое вы сделаете.' }}
    explainWrong={{
      0: { uz: "Son kichraydi, lekin bu hali ham dalilsiz va'da.", ru: 'Число меньше, но это всё ещё обещание без довода.' },
      2: { uz: "Ekranni zal jonli demoda ko'radi — bu bo'lak nima haqida?", ru: 'Экран зал увидит в живом демо — о чём эта часть?' },
      3: { uz: "Savol hali berilmagan — bo'lakda nima aytiladi?", ru: 'Вопрос ещё не задан — что говорят в этой части?' },
      default: { uz: "Keyingi qadam bo'lagi nima haqida — eslang.", ru: 'Вспомните, о чём часть «Следующий шаг».' }
    }}
    vizual={<PitchVaraq kichik sarlavha={tr({ uz: 'Kitob almashish ilovasi', ru: 'Приложение для обмена книгами' })} bolaklar={[{ id: 'keyingi', gaplar: [{ k: 'kv', t: tr({ uz: "Bir oyda 200 kishi bo'ladi", ru: 'За месяц будет 200 человек' }), holat: 'oddiy', olindi: true, yangiT: tr({ uz: 'keyingi ish: …', ru: 'следующее дело: …' }) }] }]} />} />
);

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  claimFinder: { icon: '🔎', name: 'Claim Finder!', desc: { uz: "Mentor pitchidagi to'rt gapning dalili bor-yo'qligini birinchi urinishda topdingiz", ru: 'С первой попытки определили, есть ли довод у четырёх фраз питча Ментора' } },
  threeParts: { icon: '🧩', name: 'Three Parts!', desc: { uz: "Mentor daliliga son, manba va qachon sanalganini birinchi urinishda qo'ydingiz", ru: 'С первой попытки поставили в довод Ментора число, источник и когда посчитано' } },
  dateCheck: { icon: '📅', name: 'Date Check!', desc: { uz: 'Dalilda nima yetishmasligini birinchi urinishda topdingiz', ru: 'С первой попытки нашли, чего не хватает доводу' } },
  pitchFixed: { icon: '🛠️', name: 'Pitch Fixed!', desc: { uz: "Dalilsiz da'volarni hal qilib, tuzatilgan pitchni saqladingiz", ru: 'Решили утверждения без довода и сохранили исправленный питч' } }
};
// Ekran id → nishon: s2, s3 — birinchi urinish (xato bosilsa miss) · s4 — 1-savol birinchi urinishda · s7 — tuzatilgan pitch saqlanganda (bonus, ish bajarilgan — P-048)
const ACH_TRIGGERS = { s2: 'claimFinder', s3: 'threeParts', s4: 'dateCheck', s7: 'pitchFixed' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 8)
const Q_LABELS = {
  4: { uz: "1 — Dalilda nima yo'q", ru: '1 — Чего нет в доводе' },
  8: { uz: "Yakuniy — Va'da o'rniga", ru: 'Итоговый — Вместо обещания' }
};
const QUIZ_MS = 15000;
// Fon so'zlari — darsning o'z atamalari (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: "da'vo", ru: 'утверждение' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'dalil', ru: 'довод' }, l: 84, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'son', ru: 'число' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'manba', ru: 'источник' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'qachon', ru: 'когда' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'pitch', ru: 'питч' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'zal', ru: 'зал' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: "bo'lak", ru: 'часть' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'Database', l: 56, t: 52, s: 20, d: 22, dl: 3.3 },
  { ch: 'Umami', l: 36, t: 6, s: 20, d: 24, dl: 2.6 },
  { ch: 'Maydon Jamoa', l: 88, t: 44, s: 18, d: 26, dl: 3.8 }
];
// ⚡ Mustahkamlash-jang — 12 savol (MD), to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12
const QUIZ_BANK = [
  { q: { uz: "Pitchdagi qaysi gap da'vo?", ru: 'Какая фраза в питче — утверждение?' }, opts: [{ uz: "30 kishi ilovada ro'yxatdan o'tdi", ru: '30 человек зарегистрировались в приложении' }, { uz: "Hozir telefonda ko'rsatib beraman", ru: 'Сейчас покажу на телефоне' }, { uz: 'Savollaringiz bo\'lsa, bemalol bering', ru: 'Если есть вопросы — задавайте' }, { uz: 'Tinglaganingiz uchun katta rahmat', ru: 'Большое спасибо, что выслушали' }], correct: 0 },
  { q: { uz: 'Dalil nima?', ru: 'Что такое довод?' }, opts: [{ uz: "Pitchdagi eng ishonchli ko'ringan gap", ru: 'Самая убедительная на вид фраза питча' }, { uz: "Da'voni ko'rsatadigan son yoki yozuv", ru: 'Число или запись, которые показывают утверждение' }, { uz: 'Zal pitchdan keyin beradigan savol', ru: 'Вопрос, который зал задаст после питча' }, { uz: 'Pitch oxiridagi keyingi qadam gapi', ru: 'Фраза о следующем шаге в конце питча' }], correct: 1 },
  { q: { uz: 'Dalildagi manba nimani aytadi?', ru: 'Что говорит источник в доводе?' }, opts: [{ uz: 'Son qanchalik katta ekanini', ru: 'Насколько большое число' }, { uz: 'Son qaysi kuni sanalganini', ru: 'В какой день посчитано число' }, { uz: 'Bu son qayerdan olinganini', ru: 'Откуда взято это число' }, { uz: 'Sonni kim aytib berganini', ru: 'Кто назвал это число' }], correct: 2 },
  { q: { uz: "Mentor misolida «Ilovani odamlar ishlatyapti» dalili qayerdan?", ru: 'Откуда в примере Ментора довод «Приложением пользуются люди»?' }, opts: [{ uz: 'Umami: lendingga kirganlar soni', ru: 'Umami: число зашедших на лендинг' }, { uz: 'Intervyu yozuvlari, 11-Modul', ru: 'Записи интервью, 11-й модуль' }, { uz: "Sinfdoshlarning og'zaki gapi", ru: 'Устные слова одноклассников' }, { uz: "Database: ro'yxatdan o'tganlar", ru: 'Database: зарегистрировавшиеся' }], correct: 3 },
  { q: { uz: 'Umami lendingda nimani sanaydi?', ru: 'Что считает Umami на лендинге?' }, opts: [{ uz: 'Tashrif va tugma bosilishini', ru: "Посещения и нажатия кнопки" }, { uz: "Ro'yxatdan o'tgan akkauntlarni", ru: 'Зарегистрированные аккаунты' }, { uz: "O'yinga qo'shilgan odamlarni", ru: 'Людей, присоединившихся к игре' }, { uz: 'Ilovani ochgan qurilmalarni', ru: 'Устройства, открывшие приложение' }], correct: 0 },
  { q: { uz: "Ro'yxatdan o'tganlar soni bir haftada o'sdi. Pitchda qaysi sonni aytasiz?", ru: 'Число зарегистрировавшихся выросло за неделю. Какое число назовёте в питче?' }, opts: [{ uz: 'Birinchi kungi sonni — u aniqroq', ru: 'Число первого дня — оно точнее' }, { uz: 'Eng yangi sonni — sanasi bilan', ru: 'Самое новое число — с датой' }, { uz: "Ikki sonning o'rtachasini aytasiz", ru: 'Назовёте среднее двух чисел' }, { uz: "Ikki sonni qo'shib, jamini aytasiz", ru: 'Сложите два числа и назовёте сумму' }], correct: 1 },
  { q: { uz: "Mentor misolida «O'yinchilarga ilova yoqdi» bilan nima qilindi?", ru: 'Что сделали в примере Ментора с фразой «Игрокам понравилось приложение»?' }, opts: [{ uz: "O'zgarishsiz pitchda qoldirildi", ru: 'Оставили в питче без изменений' }, { uz: "Keyingi qadam bo'lagiga ko'chdi", ru: 'Перенесли в часть «Следующий шаг»' }, { uz: 'Database soni bilan qayta yozildi', ru: 'Переписали с числом из Database' }, { uz: "Sinfdoshlardan so'rab tasdiqlandi", ru: 'Подтвердили, спросив одноклассников' }], correct: 2 },
  { q: { uz: "Mentor «Tez orada 50 ga yetamiz»ni nega olib tashladi?", ru: 'Почему Ментор убрал «Скоро дойдём до 50»?' }, opts: [{ uz: 'Maqsad sinf uchun juda katta edi', ru: 'Цель была слишком большой для класса' }, { uz: 'Zal kelajak haqida gap eshitmaydi', ru: "Зал не слушает фразы о будущем" }, { uz: 'Sinfdoshlar alohida aytilmagan edi', ru: 'Одноклассники не были названы отдельно' }, { uz: "Dalili yo'q edi: bu faqat va'da", ru: 'Довода не было: это только обещание' }], correct: 3 },
  { q: { uz: 'Sinfdoshlar sanoqqa kirsa, dalilda qanday aytiladi?', ru: 'Если одноклассники вошли в подсчёт, как это сказать в доводе?' }, opts: [{ uz: 'Alohida: nechtasi sinfdosh ekani', ru: 'Отдельно: сколько из них одноклассники' }, { uz: 'Aytilmaydi: ular ham foydalanuvchi', ru: 'Не говорят: они тоже пользователи' }, { uz: 'Sanoqdan butunlay olib tashlanadi', ru: 'Полностью убирают из подсчёта' }, { uz: 'Faqat sinfdoshlar soni aytiladi', ru: 'Называют только число одноклассников' }], correct: 0 },
  { q: { uz: "Qayta yozilgan da'voda nima bo'ladi?", ru: 'Что есть в переписанном утверждении?' }, opts: [{ uz: "Ko'proq chiroyli sifat so'zlari", ru: 'Больше красивых прилагательных' }, { uz: "Dalildagi son gapning o'zida", ru: 'Число из довода в самой фразе' }, { uz: 'Zal savoliga oldindan javob', ru: "Ответ на вопрос зала заранее" }, { uz: 'Avvalgi gapning qisqa shakli', ru: 'Короткая форма прежней фразы' }], correct: 1 },
  { q: { uz: "Intervyu yozuvlari qaysi da'voga dalil bo'ladi?", ru: 'К какому утверждению записи интервью будут доводом?' }, opts: [{ uz: 'Ilovani nechta odam ishlatishiga', ru: 'Сколько людей пользуется приложением' }, { uz: 'Lendingga nechta odam kirganiga', ru: 'Сколько людей зашло на лендинг' }, { uz: 'Odamlar muammodan qiynalganiga', ru: 'Что людям трудно из-за проблемы' }, { uz: "Bu hafta nechta o'yin to'lganiga", ru: 'Сколько игр заполнилось на этой неделе' }], correct: 2 },
  { q: { uz: "Yakkama-yakkada Mentor bilan nimani ko'rasiz?", ru: "Что вы посмотрите с Ментором на встрече один на один?" }, opts: [{ uz: 'Arena natijangiz va ballaringizni', ru: 'Результат арены и ваши баллы' }, { uz: 'Kodingizning har bir qatorini', ru: 'Каждую строку вашего кода' }, { uz: 'Lending sahifangizning dizaynini', ru: 'Дизайн вашего лендинга' }, { uz: "Da'vo, dalil va qarorlaringizni", ru: 'Утверждения, доводы и ваши решения' }], correct: 3 }
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
// Qo'shimcha Mentor statistikasi (MD «Mentor statistikasi», F-1006-389; 11-Modul MentorSanoq naqshi).
// Server har zonada o'quvchining BIRINCHI signalini saqlaydi — shuning uchun har holat o'z zonasida: 500 — bajardi (yuqorida), 600 — ekranga xos holat.
const ZONA_2 = 600;
const _belgilar = new Set();
const jonliBelgi = (live, zona, screen, picked = 0) => {
  if (!live || live.mode !== 'student') return;
  const k = zona + screen;
  if (_belgilar.has(k)) return;
  _belgilar.add(k);
  live.submitAnswer(k, 'mstat', picked, true, 0);
};
// Mentor ko'rinishi sloti — "kim bajardi" jonli chiplar paneli. JONLI roli to'ldiradi.
// sanoq — [{ y: { uz, ru }, zona, shart?, qiymat? }] yorliqli sonlar · chip — { zona, t: (qator) => matn, toliq?: (qator) => bool } o'quvchi yonidagi qisqa son
const MentorPracticeStats = ({ live, screen, sanoq, chip }) => {
  const zonalar = [...new Set([...(sanoq || []).map(s => s.zona), ...(chip ? [chip.zona] : [])].filter(z => z !== PRACTICE_BASE))];
  const [data, setData] = useState({ players: null, rows: [], z: {} });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows, ...qolgan] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen), ...zonalar.map(z => liveAnswers(live.pin, z + screen))]);
        if (on) setData({ players, rows, z: Object.fromEntries(zonalar.map((z, i) => [z, qolgan[i]])) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]); // eslint-disable-line
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const qatorlar = (z) => (z === PRACTICE_BASE ? data.rows : data.z[z] || []);
  const doneIds = new Set(data.rows.map(r => r.player_id));
  const sonOl = (s) => new Set(qatorlar(s.zona).filter(r => !s.shart || s.shart(r)).map(r => r.player_id)).size;
  const chipM = chip ? new Map(qatorlar(chip.zona).map(r => [r.player_id, r])) : null;
  const chipT = (p) => { const r = chipM && chipM.get(p.id); return r ? ` · ${chip.t(r)}` : ''; };
  const toliq = (p) => { const r = chipM && chipM.get(p.id); return !!(r && chip.toliq && chip.toliq(r)); };
  const doers = players.filter(p => doneIds.has(p.id));
  const waiting = players.filter(p => !doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      {sanoq && sanoq.length > 0 && <div className="lp-msanoq">{sanoq.map((s, i) => <div key={i} className="lp-msanoq-q"><b>{data.players === null ? '—' : s.qiymat ? s.qiymat(qatorlar(s.zona)) : `${sonOl(s)} / ${players.length}`}</b><span>{tr(s.y)}</span></div>)}</div>}
      <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className={`mstats-wait-chip${toliq(p) ? ' toliq' : ''}`} style={{ background: T.okFon, color: T.ok }}>✓ {p.nickname}{chipT(p)}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>{p.nickname}{chipT(p)}</span>)}
        </div>
      )}
    </div>
  );
};

// ===== 🃏 KARTOCHKALAR — alohida ekran (SABOQ 12, 16): Mentor yo'q, birinchi bosishgacha karta yuzi halqada va ostida ko'rsatma =====
const KARTALAR = [
  { front: { uz: "Da'vo nima?", ru: 'Что такое утверждение?' }, back: { uz: "Pitchdagi tekshirsa bo'ladigan gap", ru: 'Фраза в питче, которую можно проверить' }, note: { uz: "Mentor misolida: «O'yinchilar jamoaga odam yig'ishda qiynaladi»", ru: 'В примере Ментора: «Игрокам трудно собрать людей в команду»' } },
  { front: { uz: 'Dalil nima?', ru: 'Что такое довод?' }, back: { uz: "Da'voni ko'rsatadigan son yoki yozuv", ru: 'Число или запись, которые показывают утверждение' }, note: { uz: 'Bu darsda yonida: manbasi va qachon olingani', ru: 'В этом уроке рядом: источник и когда получено' } },
  { front: { uz: 'Manba nima?', ru: 'Что такое источник?' }, back: { uz: 'Dalil qayerdan olingani', ru: 'Откуда взят довод' }, note: { uz: 'Database, sanoq sahifasi, Umami, intervyu yoki sinov yozuvlari', ru: 'Database, страница подсчёта, Umami, записи интервью или тестов' } },
  { front: { uz: 'Dalilda nega qachon sanalgani yoziladi?', ru: 'Зачем в доводе пишут, когда посчитано?' }, back: { uz: "Son vaqt o'tib o'zgaradi — zal qaysi kungi son ekanini bilishi uchun", ru: 'Число со временем меняется — чтобы зал знал, за какой день это число' }, note: { uz: 'Mentor misolida ishga tushirish kuni 20 edi, bir hafta keyin — 38', ru: 'В примере Ментора в день запуска было 20, через неделю — 38' } },
  { front: { uz: "«Ko'p odam ishlatyapti» degan gap dalil bo'ladimi?", ru: 'Будет ли доводом фраза «Пользуется много людей»?' }, back: { uz: "Yo'q: unda aniq son yo'q", ru: 'Нет: в ней нет точного числа' }, note: { uz: 'Necha kishi — shuni yozing', ru: 'Сколько человек — напишите это' } },
  { front: { uz: 'Umami lendingda nimani sanaydi?', ru: 'Что считает Umami на лендинге?' }, back: { uz: 'Tashrif va tugma bosilishini', ru: "Посещения и нажатия кнопки" }, note: { uz: "Ilovadagi ro'yxatdan o'tganlar — Database'da", ru: 'Зарегистрировавшиеся в приложении — в Database' } },
  { front: { uz: "Dalilsiz da'vo bilan nima qilinadi?", ru: 'Что делают с утверждением без довода?' }, back: { uz: 'Qayta yoziladi yoki olib tashlanadi', ru: 'Переписывают или убирают' }, note: { uz: "Qayta yozilgan gap dalil ko'rsatadigan narsani aytadi", ru: 'Переписанная фраза говорит то, что показывает довод' } },
  { front: { uz: "Mentor «O'yinchilarga ilova yoqdi» gapini qanday qayta yozdi?", ru: 'Как Ментор переписал фразу «Игрокам понравилось приложение»?' }, back: { uz: '«Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi»', ru: '«Из 46 устройств, открывших приложение в первые три дня, 17 снова открыли его в следующие два дня»' }, note: { uz: "Bu gap «yoqdi»ni isbotlamaydi — qurilmalar nima qilganini aytadi", ru: 'Эта фраза не доказывает «понравилось» — она говорит, что сделали устройства' } },
  { front: { uz: "«Tez orada 50 ga yetamiz» gapi bilan nima bo'ldi?", ru: 'Что стало с фразой «Скоро дойдём до 50»?' }, back: { uz: "Olib tashlandi: bu dalilsiz va'da", ru: 'Убрали: это обещание без довода' }, note: { uz: "O'rniga Keyingi qadam bo'lagida — zaxira rejadagi ish", ru: 'Вместо неё в части «Следующий шаг» — дело из запасного плана' } },
  { front: { uz: 'Sinfdoshlar dalilda qanday aytiladi?', ru: 'Как в доводе называют одноклассников?' }, back: { uz: 'Sanaladi, lekin alohida aytiladi', ru: 'Их считают, но называют отдельно' }, note: { uz: 'Mentor misolida: 38 kishi, 11 tasi — sinfdosh', ru: 'В примере Ментора: 38 человек, 11 — одноклассники' } },
  { front: { uz: 'Tuzatilgan pitch nima?', ru: 'Что такое исправленный питч?' }, back: { uz: "Har da'vosida dalil bor yoki dalilsiz da'vosi olib tashlangan pitch", ru: 'Питч, в котором у каждого утверждения есть довод или утверждения без довода убраны' }, note: { uz: 'Bu — qoralama: uni yana tuzatishingiz mumkin', ru: 'Это черновик: его можно исправлять дальше' } },
  { front: { uz: "Yakkama-yakkada Mentor nimani ko'radi?", ru: "Что Ментор смотрит на встрече один на один?" }, back: { uz: "Eng muhim da'vongiz, uning dalili va bitta qaroringizni", ru: 'Ваше самое важное утверждение, его довод и одно ваше решение' }, note: { uz: "Mentor «Bu dalil aynan shu gapni ko'rsatadimi?» deb so'raydi", ru: 'Ментор спрашивает: «Этот довод показывает именно эту фразу?»' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cx('pd-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="pd-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025 karta shaklida; ③ holatdan, hammasi tugagan bo'lsa ③ yo'q; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan:', ru: 'С кем:' }, v: { uz: "o'zingiz", ru: 'сами' } },
  { k: { uz: 'Nechta:', ru: 'Сколько:' }, v: { uz: '1 tuzatilgan pitch', ru: '1 исправленный питч' } },
  { k: { uz: 'Muddat:', ru: 'Срок:' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HwCard = ({ keyingi, uchinchi }) => {
  const bandlar = [
    { uz: "Yakkama-yakkada Mentor so'ragan da'voni tuzating: dalil qo'ying, qayta yozing yoki olib tashlang.", ru: "Исправьте утверждение, о котором Ментор спросил на встрече: поставьте довод, перепишите или уберите." },
    { uz: "Ro'yxatdan o'tganlar va asosiy harakatni qilganlarni Neon'da 10-darsdagi SQL bilan qayta sanang va bugungi sana bilan yozib qo'ying.", ru: 'Пересчитайте в Neon зарегистрировавшихся и сделавших основное действие тем же SQL, что на 10-м уроке, и запишите с сегодняшней датой.' },
    uchinchi && { uz: `Darsda qolgan qismni tugating: ${uchinchi.uz}.`, ru: `Доделайте то, что осталось с урока: ${uchinchi.ru}.` }
  ].filter(Boolean);
  return (
    <div className="card pd-hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="pd-hw-karta">{HW_KARTA.map((r, i) => <span key={i} className="pd-hw-q"><em>{tr(r.k)}</em> <b>{tr(r.v)}</b></span>)}</div>
      <ol className="pd-hw-qadam">{bandlar.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tx(q)}</span></li>)}</ol>
      <span className="pd-hw-izoh">{tr({ uz: "Neon'ga kira olmasangiz — sonni o'ylab topmang: 10-darsdagi hisobot sonini sanasi bilan qoldiring.", ru: 'Если не получается войти в Neon — не выдумывайте число: оставьте число из отчёта 10-го урока с его датой.' })}</span>
      {keyingi && <span className="pd-hw-keyingi">{keyingi}</span>}
    </div>
  );
};

// ===== YAKUN — QYakun (DE-204) + holatga qarab sarlavha (P-046; E 54 — har holatda rost). Standart: chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar (E 50) =====
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
    { uz: "Da'vo — pitchdagi tekshirsa bo'ladigan gap.", ru: 'Утверждение — фраза в питче, которую можно проверить.' },
    { uz: "Dalil — da'voni ko'rsatadigan son yoki yozuv; bu darsda yonida manbasi va qachon olingani turadi.", ru: 'Довод — число или запись, которые показывают утверждение; в этом уроке рядом стоят источник и когда получено.' },
    { uz: 'Manba dalil qayerdan olinganini aytadi; sanaydigan manbadan son olinadi.', ru: 'Источник говорит, откуда взят довод; из считающего источника берут число.' },
    { uz: 'Sinfdoshlar sanoqqa kiradi, lekin dalilda alohida aytiladi.', ru: 'Одноклассники входят в подсчёт, но в доводе называются отдельно.' },
    { uz: "Dalilsiz va'da olib tashlanadi yoki maqsad deb qayta yoziladi; Keyingi qadam bo'lagida qiladigan ishingiz aytiladi.", ru: 'Обещание без довода убирают или переписывают как цель; в части «Следующий шаг» называют дело, которое вы сделаете.' }
  ];
  // Holat — 5, 6, 7-ekran saqlashidan (sarlavha o'quvchi qilgan ishni aytadi; E 54)
  const s5 = answers[5], s6 = answers[6], s7 = answers[7];
  const davolar = (s5 && s5.saqlandi && s5.davolar) || [];
  const dal = (s6 && s6.dalillar) || {};
  const dalillarTayyor = davolar.length > 0 && davolar.every(d => dal[d.gk]);
  const dalilsizN = davolar.filter(d => dal[d.gk] === 'yoq').length;
  const holat = isMentorL || (s7 && s7.saqlandi) ? 'toliq' : dalillarTayyor ? (dalilsizN > 0 ? 'dalil' : 'saqlash') : davolar.length ? 'davo' : 'yoq';
  const SARLAVHA = {
    toliq: { uz: <>Tuzatilgan pitchingiz tayyor: <A>har da'voda dalil bor.</A></>, ru: <>Исправленный питч готов: <A>у каждого утверждения есть довод.</A></> },
    dalil: { uz: <>Dalillar qo'yildi — <A>dalilsiz da'volar qoldi.</A></>, ru: <>Доводы поставлены — <A>остались утверждения без довода.</A></> },
    saqlash: { uz: <>Dalillar qo'yildi — <A>tuzatilgan pitchni saqlash qoldi.</A></>, ru: <>Доводы поставлены — <A>осталось сохранить исправленный питч.</A></> },
    davo: { uz: <>Da'volar topildi — <A>dalil qo'yish qoldi.</A></>, ru: <>Утверждения найдены — <A>осталось поставить доводы.</A></> },
    yoq: { uz: <>Da'volar hali belgilanmagan — <A>uyda belgilang.</A></>, ru: <>Утверждения ещё не отмечены — <A>отметьте их дома.</A></> } // E 54 (F-1006-389)
  };
  const UCHINCHI = {
    dalil: { uz: "dalilsiz da'volarni qayta yozing yoki olib tashlang", ru: 'перепишите или уберите утверждения без довода' },
    saqlash: { uz: 'tuzatilgan pitchni saqlang', ru: 'сохраните исправленный питч' },
    davo: { uz: "da'volaringizga dalil qo'ying", ru: 'поставьте доводы к утверждениям' },
    yoq: { uz: "pitchingizdagi da'volarni belgilang", ru: 'отметьте утверждения в питче' }
  };
  const toliq = holat === 'toliq';
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Raqamlaringiz zalni ishontiradimi?»</b></>, ru: <>Следующий урок — <b>«Убедят ли ваши цифры зал?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cx('pd-yakun', !toliq && 'belgisiz')} data-holat={holat}>
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
          recap={RECAP.map(tx)}
          uyga={<HwCard keyingi={keyingi} uchinchi={toliq ? null : UCHINCHI[holat]} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmPitchReviewLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === DARSNING O'Z VIZUALI — «Pitch va dalil» (pd-). Faqat qolip tokenlari (D3), emoji yo'q (D4). Manba oynasi chapda, varaq o'ngda (SABOQ 21) === */
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, kattalashishsiz (E 40) */
        @keyframes pd-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes pd-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes pd-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .pd-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pd-puls 2.2s ease-out .3s 3; }
        /* Variantlar va tanlov chiplari: guruh ramkasi yo'q — har birining o'z yengil chegarasi, puls navbatma-navbat 2 marta (E 40) */
        .pd-k { display: contents; }
        .pd-k.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; animation: pd-chorla-v 1.8s ease-out .5s 2; }
        .pd-k.faol .q-variant:nth-child(2) { animation-delay: .75s; } .pd-k.faol .q-variant:nth-child(3) { animation-delay: 1s; }
        .pd-chorla-g .q-chip:not(:disabled), .pd-chorla.faol .q-chip:not(:disabled):not(.on), .pd-chorla.faol .pd-tanlov:not(:disabled):not(.on), .pd-manba-q.chorla { border-color: ${fon(T.accent, 0.6)}; animation: pd-chorla-c 1.8s ease-out .5s 2; }
        .pd-chorla-g .q-chip:nth-child(2), .pd-chorla.faol .q-chip:nth-child(2), .pd-chorla.faol .pd-tanlov-w:nth-child(2) .pd-tanlov, .pd-manba-q.chorla:nth-child(2) { animation-delay: .75s; }
        .pd-chorla-g .q-chip:nth-child(3), .pd-chorla.faol .q-chip:nth-child(3), .pd-chorla.faol .pd-tanlov-w:nth-child(3) .pd-tanlov, .pd-manba-q.chorla:nth-child(3) { animation-delay: 1s; }
        /* ⛶ telefonda va torroq ekranda mazmunni yopmasin (skelet tuzog'i): tugma o'z qatorida (1-pilot yechimi) */
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        /* Bashorat ixcham qatori; yashil xulosa ichida taxmin qatori · asosiy gap · izoh (E 42) */
        .pd-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; color: ${T.ink2}; }
        .pd-bash-t b { color: ${T.ink}; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: ${T.accentSoft}; }
        .q-xulosa .pd-x-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .q-xulosa .pd-x-tx b { color: ${T.ink}; } .q-xulosa .pd-x-tx.ok, .q-xulosa .pd-x-tx.ok b { color: ${T.ok}; } .q-xulosa .pd-x-tx b.yoq { color: ${T.err}; }
        .q-xulosa .pd-x-m { display: block; }
        .q-xulosa .pd-x-iz { display: block; margin-top: 7px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.18)}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .pd-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; padding: 10px 12px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .pd-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        .pd-davo-yoq { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
        .pd-kul, p.pd-kul { font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        .pd-ogoh, p.pd-ogoh { font-size: 12.5px; line-height: 1.45; font-weight: 700; color: ${SARIQ}; }
        /* Sahna: chapda manba oynasi (o'lchami barqaror), o'ngda varaq; toliq — varaq butun enga */
        .pd-sahna { display: grid; grid-template-columns: minmax(220px, 290px) minmax(0, 1fr); gap: 16px; align-items: start; width: 100%; }
        .pd-sahna.toliq { grid-template-columns: minmax(0, 1fr); }
        .pd-sahna-v { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pd-sahna-m { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pd-chap-tug { display: flex; flex-direction: column; gap: 8px; }
        /* Manba oynasi — chizilgan, logotipsiz */
        .pd-manba { display: flex; flex-direction: column; min-height: 214px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},0.45); overflow: hidden; }
        .pd-m-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: ${T.ink}; color: #fff; font-size: 12.5px; }
        .pd-m-bar b { font-weight: 800; letter-spacing: 0.01em; }
        .pd-m-sql { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${fon('#FFFFFF', 0.7)}; }
        .pd-m-nuqta { display: inline-flex; gap: 4px; } .pd-m-nuqta i { width: 7px; height: 7px; border-radius: 50%; background: ${fon('#FFFFFF', 0.45)}; }
        .pd-m-url { margin: 8px 12px 0; padding: 3px 10px; border-radius: 999px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .pd-m-tana { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 10px 12px 12px; animation: pd-kir 0.35s ease-out both; }
        .pd-m-yorliq { display: flex; flex-wrap: wrap; gap: 2px 8px; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .pd-m-yorliq b { color: ${T.ink}; }
        .pd-m-bosh { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 4px; }
        .pd-m-bosh span { padding: 4px 10px; border-radius: 999px; border: 1px dashed ${fon(T.ink, 0.25)}; font-size: 12px; color: ${T.ink2}; }
        .pd-m-jadval { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; background: ${T.bg}; }
        .pd-m-q, .pd-manba-q { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 7px 10px; border: 0; border-bottom: 1px solid ${T.line}; background: transparent; font-family: 'Manrope'; font-size: 13px; text-align: left; color: ${T.ink}; animation: pd-kir 0.35s ease-out both; }
        .pd-m-q:last-child, .pd-manba-q:last-child { border-bottom: 0; }
        .pd-manba-q { cursor: pointer; background: ${T.paper}; border: 1.5px solid transparent; border-bottom-color: ${T.line}; }
        .pd-manba-q:hover { border-color: ${T.accent}; }
        .pd-m-n { color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
        .pd-m-v { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.ink}; text-align: right; overflow-wrap: anywhere; }
        .pd-m-q.yozuv { flex-direction: column; align-items: flex-start; gap: 2px; } .pd-m-q.yozuv .pd-m-v { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; text-align: left; }
        .pd-m-q.on, .pd-manba-q.on { animation: pd-yashil 1.2s ease-out both; }
        .pd-m-q.on .pd-m-v { color: ${T.ok}; }
        .pd-m-q.bog { box-shadow: inset 0 0 0 2px ${T.ok}; } .pd-m-q.bog .pd-m-v { color: ${T.ok}; }
        .pd-manba-q.err { background: ${T.errFon}; animation: q-silk 0.4s; }
        .pd-m-chiziq { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .pd-m-chiziq-n { font-size: 13px; color: ${T.ink2}; } .pd-m-chiziq-n b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .pd-m-bar2 { position: relative; display: flex; align-items: center; height: 14px; border-radius: 999px; background: ${T.line}; }
        .pd-m-bar2 i { display: block; height: 100%; border-radius: 999px; background: ${T.accent}; animation: pd-chiz 0.9s ease-out both; transform-origin: left; }
        .pd-m-bar2 em { position: absolute; right: -2px; top: -22px; font-style: normal; font-weight: 800; font-size: 15px; color: ${T.ink2}; }
        .pd-m-xoch { align-self: flex-start; padding: 3px 10px; border-radius: 999px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        /* Dalil tegi: bo'sh — uzuq chiziq (U-041), to'lgani — yashil */
        .pd-teg { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
        .pd-katak { display: inline-flex; align-items: center; min-width: 52px; min-height: 24px; padding: 2px 9px; border-radius: 7px; font-size: 12.5px; line-height: 1.35; color: ${T.ink2}; }
        .pd-katak.bosh { border: 1.5px dashed ${fon(T.ink, 0.3)}; color: ${fon(T.ink, 0.45)}; background: ${T.paper}; animation: pd-kir 0.35s ease-out both; }
        .pd-katak.bor { border: 1.5px solid ${fon(T.ok, 0.55)}; background: ${T.okFon}; color: ${T.ok}; font-weight: 700; }
        .pd-katak.yangi { animation: pd-yashil 1s ease-out both; }
        .pd-katak.err { background: ${T.errFon}; border-color: ${T.err}; }
        .pd-katak.bog { box-shadow: 0 0 0 2px ${T.ok}; }
        .pd-teg.ixcham .pd-katak { min-height: 20px; padding: 1px 7px; font-size: 11.5px; }
        /* Pitch varag'i — hujjat ko'rinishi; bo'lak nomi kulrang, chapda */
        .pd-varaq { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 12px 26px -20px rgba(${T.shadowBase},0.45); min-width: 0; }
        .pd-varaq.yondi { animation: pd-yon 1.3s ease-out; }
        .pd-v-sar { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; font-weight: 800; color: ${T.ink}; padding-bottom: 6px; border-bottom: 1px solid ${T.line}; }
        .pd-nom { color: ${NOM_RANG}; font-weight: 800; }
        .pd-sar-alm { display: inline-block; animation: pd-alm 0.6s ease-out both; }
        .pd-bolak { display: grid; grid-template-columns: 108px minmax(0, 1fr); gap: 10px; align-items: start; padding: 4px 0; animation: pd-kir 0.4s ease-out both; }
        .pd-b-nom { display: inline-flex; align-items: center; gap: 6px; padding-top: 2px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; }
        .pd-b-savol { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; font-weight: 800; color: ${T.ink2}; text-transform: none; }
        .pd-b-gaplar { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .pd-g { display: flex; flex-direction: column; gap: 2px; padding: 2px 6px; margin: 0 -6px; border-radius: 8px; transition: background 0.3s; }
        .pd-g-q { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; }
        .pd-g-t { font-size: 14px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; }
        .pd-g.h-demo .pd-g-t, .pd-g.h-kul .pd-g-t { color: ${T.ink2}; }
        .pd-g.h-davo .pd-g-t { text-decoration: underline; text-decoration-color: ${T.accent}; text-decoration-thickness: 2px; text-underline-offset: 4px; }
        .pd-g.joriy { box-shadow: 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        .pd-g.err { background: ${T.errFon}; }
        .pd-g.qayta > .pd-g-q .pd-g-t, .pd-g.olindi > .pd-g-q .pd-g-t { text-decoration: line-through; text-decoration-color: ${fon(T.ink, 0.55)}; opacity: 0.45; }
        .pd-g.olindi > .pd-g-q .pd-g-t { font-size: 12.5px; }
        .pd-g-demo { padding: 1px 8px; border-radius: 999px; background: ${T.bg}; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pd-g-yoq { padding: 1px 8px; border-radius: 999px; background: ${T.errFon}; font-size: 11.5px; font-weight: 700; color: ${T.err}; }
        .pd-g-qaror { padding: 1px 8px; border-radius: 999px; background: ${T.bg}; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pd-g-yangi { font-size: 14px; line-height: 1.45; color: ${T.ink}; animation: pd-sirg 0.6s ease-out both; }
        .pd-g-dalil { font-size: 13px; line-height: 1.45; font-weight: 700; color: ${T.ok}; }
        .pd-g-izoh { font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        .pd-gap { display: inline; padding: 1px 4px; margin: -1px -4px; border: 0; border-radius: 6px; background: transparent; font: inherit; text-align: left; cursor: pointer; color: inherit; }
        .pd-gap:hover { background: ${T.accentSoft}; }
        .pd-gap.on { background: ${fon(T.accent, 0.08)}; }
        .pd-gap.chorla { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.6)}; animation: pd-chorla-c 1.8s ease-out .5s 2; }
        .pd-varaq.kichik { padding: 10px 12px; gap: 6px; }
        .pd-varaq.kichik .pd-bolak { grid-template-columns: 92px minmax(0, 1fr); }
        .pd-varaq.kichik .pd-g-t { font-size: 13px; }
        .pd-tahrir { flex: none; width: 26px; height: 24px; padding: 0; border: 1px solid ${T.line}; border-radius: 7px; background: ${T.paper}; color: ${T.ink2}; font-size: 13px; cursor: pointer; }
        .pd-tahrir:hover { color: ${T.accent}; border-color: ${T.accent}; }
        /* Zal (3-ekran): uch odam va savol pufagi */
        .pd-zal { display: flex; align-items: flex-end; gap: 12px; padding: 4px 4px 0; }
        .pd-zal-o { display: flex; gap: 4px; }
        .pd-odam { width: 38px; height: 44px; }
        .pd-pufak { position: relative; align-self: flex-start; padding: 6px 12px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.accent}; font-size: 13.5px; font-weight: 800; color: ${T.ink}; animation: pd-kir 0.4s ease-out both; }
        .pd-pufak::before { content: ''; position: absolute; left: -7px; bottom: 8px; width: 10px; height: 10px; background: ${T.paper}; border-left: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .pd-pufak.ok { border-color: ${T.ok}; color: ${T.ok}; } .pd-pufak.ok::before { border-color: ${T.ok}; }
        /* 0, 1-ekran */
        .pd-s0 { display: flex; flex-direction: column; gap: 8px; }
        p.pd-s0-son { padding: 6px 12px; border-radius: 10px; background: ${T.bg}; font-size: 13px; color: ${T.ink2}; transition: transform 0.6s cubic-bezier(.3,1.3,.5,1); }
        p.pd-s0-son b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        p.pd-s0-son.suz { transform: translateY(-8px); box-shadow: 0 10px 22px -14px rgba(${T.shadowBase},0.5); background: ${T.paper}; }
        .pd-reja { display: flex; flex-direction: column; gap: 8px; }
        /* 2, 3-ekran: tugmalar va tanlovlar varaq ostida */
        .pd-s2-tug, .pd-s3-past { display: flex; flex-direction: column; gap: 8px; }
        .pd-chorla { display: flex; flex-wrap: wrap; gap: 8px; }
        .pd-chorla .q-chip { font-size: 14px; }
        .pd-qadamlar { display: flex; flex-wrap: wrap; gap: 6px; }
        .pd-qadam { padding: 3px 10px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .pd-qadam.joriy { border-color: ${T.accent}; color: ${T.accent}; } .pd-qadam.otdi { color: ${T.ok}; border-color: ${fon(T.ok, 0.4)}; }
        .pd-s3-var { align-items: flex-start; }
        .pd-tviz { margin-top: 4px; }
        /* 5–7-ekran: mustaqil ish — bitta katta karta, tepada ixcham chiziq */
        .lesson-root .q-ekran > ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .lesson-root .q-mustaqil { max-width: none; }
        .pd-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; }
        .pd-strip b { font-weight: 800; color: ${T.ink}; margin-right: 4px; }
        .pd-strip-i { max-width: 220px; padding: 2px 9px; border-radius: 999px; background: ${T.bg}; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: pd-kir 0.35s ease-out both; }
        .pd-strip-i.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; } .pd-strip-i.yangi { animation: pd-yashil 1s ease-out; }
        .pd-ms-son { color: ${T.ink2}; font-weight: 600; }
        .pd-ms-q { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope'; font-size: 13px; font-weight: 700; color: ${T.ink}; cursor: pointer; }
        .pd-ms-q:hover { border-color: ${T.accent}; }
        p.pd-yechim-q { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
        p.pd-yechim-q b { color: ${T.ink}; font-weight: 600; }
        .pd-ms-karta { display: flex; flex-direction: column; gap: 10px; max-width: 720px; width: 100%; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.4); animation: pd-kir 0.4s ease-out both; }
        .pd-ms-gap { font-size: 15px; line-height: 1.45; color: ${T.ink}; }
        .pd-ms-gaplar { display: flex; flex-direction: column; gap: 6px; padding: 4px 0; }
        .pd-maydon { position: relative; display: block; }
        .pd-n { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 11px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; pointer-events: none; }
        .pd-maydon .pd-inp { padding-left: 38px; }
        .pd-inp { width: 100%; padding: 9px 10px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; font-family: 'Manrope'; font-size: 14px; color: ${T.ink}; }
        .pd-inp:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .pd-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .pd-inp::placeholder { color: ${fon(T.ink, 0.42)}; }
        .pd-inp-ix { width: auto; flex: 1 1 200px; padding: 5px 9px; font-size: 13px; }
        .pd-manba-qator { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 8px 6px 38px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.bg}; }
        .pd-manba-qator.err { border-color: ${T.err}; background: ${T.errFon}; }
        .pd-manba-qator .q-chip { font-size: 12.5px; padding: 4px 10px; }
        .pd-yangi-q { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .pd-yangi-q .pd-inp { flex: 1 1 260px; width: auto; }
        .pd-ms-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 2px; }
        .pd-ms-yordam { margin-left: auto; }
        .pd-ms-tug.ong { justify-content: flex-end; }
        .pd-yordam-q { display: flex; flex-direction: column; gap: 6px; max-width: 720px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${fon(T.ink, 0.22)}; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .pd-fokus { display: flex; flex-direction: column; gap: 10px; max-width: 820px; width: 100%; animation: pd-fokus 0.6s cubic-bezier(.3,1.2,.5,1) both; }
        .pd-forma { display: flex; flex-direction: column; gap: 8px; }
        .pd-tanlovlar { display: flex; flex-direction: column; gap: 6px; }
        .pd-tanlov-w { display: flex; flex-direction: column; gap: 3px; animation: pd-kir 0.35s ease-out both; }
        .pd-tanlov { width: 100%; padding: 6px 11px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; font-family: 'Manrope'; font-size: 13px; line-height: 1.4; text-align: left; color: ${T.ink}; cursor: pointer; overflow-wrap: anywhere; transition: border-color 0.2s, background 0.2s; }
        .pd-tanlov:hover:not(:disabled) { border-color: ${T.accent}; }
        .pd-tanlov.on { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pd-tanlov.ozi { border-style: dashed; font-weight: 700; }
        .pd-tanlov.sariq { color: ${SARIQ}; border-color: ${fon(SARIQ, 0.5)}; background: ${fon(SARIQ, 0.1)}; cursor: not-allowed; }
        .pd-sariq-iz { font-size: 12px; font-weight: 700; color: ${SARIQ}; }
        .pd-orniga { display: flex; flex-direction: column; gap: 6px; }
        .pd-qaror-tug { margin-top: 2px; }
        .pd-korik { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; padding: 6px 0 8px; border-bottom: 1px dashed ${T.line}; }
        .pd-chek { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px 5px 6px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-family: 'Manrope'; font-size: 13px; font-weight: 700; color: ${T.ink}; cursor: pointer; }
        .pd-chek i { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid ${fon(T.ink, 0.3)}; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; color: #fff; }
        .pd-chek.on { border-color: ${fon(T.ok, 0.55)}; } .pd-chek.on i { background: ${T.ok}; border-color: ${T.ok}; }
        .pd-zaxira { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
        /* Uchish — tayyor narsa ixcham qatorga uchadi (SABOQ 19) */
        .pd-uch { position: fixed; z-index: 3000; max-width: 260px; padding: 4px 10px; border-radius: 999px; background: ${T.ok}; color: #fff; font-family: 'Manrope'; font-size: 12px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; animation: pd-uch 0.8s cubic-bezier(.5,0,.3,1) forwards; }
        @keyframes pd-uch { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(0.7); opacity: 0.2; } }
        @keyframes pd-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes pd-sirg { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        @keyframes pd-yashil { 0%, 45% { background: ${fon(T.ok, 0.2)}; } 100% { background: transparent; } }
        @keyframes pd-chiz { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes pd-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.ok, 0.45)}; } 50% { box-shadow: 0 0 0 8px ${fon(T.ok, 0.18)}; } 100% { box-shadow: 0 12px 26px -20px rgba(${T.shadowBase},0.45); } }
        @keyframes pd-alm { from { opacity: 0; letter-spacing: 0.2em; } to { opacity: 1; letter-spacing: normal; } }
        @keyframes pd-fokus { from { opacity: 0.4; transform: scale(0.97); } to { opacity: 1; transform: none; } }
        /* Kartochkalar va yakun */
        .pd-flash { display: flex; flex-direction: column; gap: 10px; }
        .pd-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: pd-puls 1.8s ease-out .4s 3; }
        p.pd-fc-ipucha { margin: 0; display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        p.pd-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .pd-yakun { display: contents; }
        .pd-yakun.belgisiz .done-chip .tick { display: none; }
        .pd-hw { display: flex; flex-direction: column; gap: 10px; }
        .pd-hw-karta { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .pd-hw-q { display: inline-flex; gap: 6px; align-items: baseline; font-size: 13px; }
        .pd-hw-q em { font-style: normal; color: ${T.ink2}; } .pd-hw-q b { color: ${T.ink}; }
        .pd-hw-qadam { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .pd-hw-qadam li { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .pd-hw-qadam li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.accentSoft}; color: ${T.accent}; }
        .pd-hw-izoh { font-size: 12.5px; color: ${T.ink2}; }
        .pd-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        @media (max-width: 640px) {
          .pd-sahna { grid-template-columns: minmax(0, 1fr); }
          .pd-sahna-m { order: 2; }
          .pd-chap-tug { order: -1; }
          .pd-bolak, .pd-varaq.kichik .pd-bolak { grid-template-columns: minmax(0, 1fr); gap: 2px; }
          .pd-manba { min-height: 0; }
          .pd-ms-karta { padding: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pd-halqa, .pd-k.faol .q-variant, .pd-chorla-g .q-chip, .pd-chorla.faol .q-chip, .pd-chorla.faol .pd-tanlov, .pd-manba-q.chorla, .pd-gap.chorla, .pd-flash.yangi .fc-card .fc-front { animation: none !important; }
          .pd-uch { display: none !important; }
          .pd-m-tana, .pd-m-q, .pd-manba-q, .pd-katak, .pd-bolak, .pd-g-yangi, .pd-pufak, .pd-strip-i, .pd-ms-karta, .pd-tanlov-w, .pd-fokus, .pd-varaq.yondi, .pd-sar-alm, .pd-m-bar2 i { animation: none !important; transition: none !important; }
          p.pd-s0-son { transition: none; }
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
        .lp-msanoq { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
        .lp-msanoq-q { display: flex; align-items: baseline; gap: 6px; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .lp-msanoq-q b { font-size: 15px; font-weight: 800; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .mstats-wait-chip.toliq { box-shadow: inset 0 0 0 1.5px ${T.ok}; font-weight: 800; }

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
