import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 9-Modul (kod: 7-Modul) · 7-dars «Loyiha kuni: MVP — birinchi ekran» · kalit m7-07 (konveyer, 05.10.2026; src/skelet/NamunaDars.jsx dan).
// MD (manba-haqiqat): feedback/F-1005-9modul/07-MvpFirstScreen-v3.md · qolip: 172-qonun (8 ekran + 3 amaliyot bloki) + kartochkalar alohida = 12 · 173-qonun (blok repo ustida).
// EKRANLAR: s0 kirish (agent «Tayyor» dedi) · s1 reja · s2 talabning uch qismi · a1 blok · s3 1-savol · s4 har qator — bitta tekshiruv ·
//   a2 blok · s5 2-savol · a3 blok · podium · sflash kartochkalar · s7 yakun («Keyingi dars» qatori).
// F-1005-85/87 (SABOQ 11): har bosqichda navbatdagi bosiladigan element .mf-navbat (halqa + yengil puls), Mentor gapi shu harakatni aytadi;
//   bashorat tanlangach yopilmaydi — TaxminIxcham qatori natija chiqquncha turadi.
// Bitta vizual — «Maydon» sayt maketi: MAYDON_KATAKLAR → MaydonMaket (0, 1, 2, 4-ekran, a2/a3 o'ngi). Talab — TALAB_QATORLAR (2, 4-ekran, a2 prompti, 5-qadam formasi).
// Amaliyot bloki: QBlok + ScreenBlok ulagichi; har blok 5 qadam (173.2 dagi 4 + «O'z g'oyangiz», GATE M M-q1).
//   5-qadam formasi va «Yordam» qolipda yo'q — shu faylning ulagichida (GoyaForma, Yordam).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('tex'), shadowBase: '58, 53, 48' };
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QKarta, QChip, QBashorat, QTaxmin, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm7-07-v1', lessonTitle: { uz: 'Loyiha kuni: MVP — birinchi ekran', ru: 'День проекта: MVP — первый экран' } };
// 12 ekran: 8 ekran + 3 amaliyot bloki (172-qonun) + kartochkalar · final tartib-mashqi yo'q · uyga vazifa yo'q (172.4: ish repo'da)
// F-1005-88: kartochka alohida ekran (P-058 dan farq, foydalanuvchi qarori) — podium va yakun orasida (1-dars naqshi)
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's7',  type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). 2 test: s3 — C (2) · s5 — A (0); o'rni MD dan, keyin o'zgarmaydi.
// `practice: -1` — sentinel: amaliyot bloklari (a1 · a2 · a3) ball bermaydi, PRACTICE_BASE + ekran zonasida faqat mentor ko'radi.
const INLINE_KEYS = { s3: 2, s5: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI: 4 — 1-savol, 7 — 2-savol). S-026: emoji o'rniga koddan bitta qator.
const RcKod = ({ t }) => <code className="mf-rc-kod">{tr(t)}</code>;
const RECAPS = {
  4: {
    title: { uz: "Talabning uch qismi (bu darsdagi qolip)", ru: 'Три части требования (шаблон этого урока)' },
    cards: [
      { ic: <RcKod t={{ uz: 'Qayerda: saytdagi vaqt kataklari', ru: 'Где: ячейки времени на сайте' }} />, h: { uz: 'Joy aytildi', ru: 'Место названо' }, body: { uz: "Ikkinchi ro'yxat paydo bo'lmaydi.", ru: 'Второй список не появляется.' } },
      { ic: <RcKod t={{ uz: 'Nima qilsin: kun bosilsa, kataklar kelsin', ru: 'Что сделать: при нажатии дня пусть придут ячейки' }} />, h: { uz: 'Ish aytildi', ru: 'Работа названа' }, body: { uz: "Kataklar tanlangan kunniki bo'ladi.", ru: 'Ячейки будут для выбранного дня.' } },
      { ic: <RcKod t={{ uz: 'Nima buzilmasin: vaqt-tanladi hodisasi', ru: 'Что не сломать: событие vaqt-tanladi' }} />, h: { uz: 'Tegmaslik aytildi', ru: 'Сказано, что не трогать' }, body: { uz: 'Hodisa va animatsiya joyida qoladi.', ru: 'Событие и анимация остаются на месте.' }, ask: { uz: "«Nima buzilmasin» bo'lmasa, agent nimaga tegishi mumkin?", ru: 'Если нет «Что не сломать», что может задеть агент?' } }
    ]
  },
  7: {
    title: { uz: "Ko'rganingiz — aniq talab", ru: 'Увиденное — точное требование' },
    cards: [
      { ic: <RcKod t={{ uz: 'Ishlamayapti, tuzat', ru: 'Не работает, исправь' }} />, h: { uz: 'Noaniq', ru: 'Неточно' }, body: { uz: 'Agent qayerni tuzatishni bilmaydi.', ru: 'Агент не знает, что исправлять.' } },
      { ic: <RcKod t={{ uz: "Shanbaga o'tilsa kataklar o'zgarmayapti", ru: 'При переходе на субботу ячейки не меняются' }} />, h: { uz: "Nima ko'rdingiz", ru: 'Что вы увидели' }, body: { uz: 'Joy va belgi aniq.', ru: 'Место и признак точные.' } },
      { ic: <RcKod t={{ uz: "Bosilgan kun ?kun= ga qo'shilsin", ru: 'Добавь нажатый день в ?kun=' }} />, h: { uz: "Nima bo'lsin", ru: 'Что должно быть' }, body: { uz: 'Agent faqat shu joyni tuzatadi.', ru: 'Агент исправит только это место.' }, ask: { uz: "«Ishlamayapti» o'rniga agentga nima yozasiz?", ru: 'Что вы напишете агенту вместо «Не работает»?' } }
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

// ===== DARSNING BITTA VIZUALI — «Maydon» sayt maketi (163, 180): bitta manba MAYDON_KATAKLAR → MaydonMaket =====
// qolip-maket: mf-katak mf-strelka
// K1/K2 (tayanch 5-bo'lim): 6 katak 16:00 … 21:00; bugun — Dushanba 2026-10-05; namuna bandlar — Shanba 2026-10-10, 17:00 va 20:00 (18:00 ataylab bo'sh).
const MAYDON_KATAKLAR = {
  soatlar: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
  fayl: ['17:00', '20:00'], // dars boshi: namuna ma'lumot faylda (4–5-darsdagidek)
  kunlar: [
    { nom: { uz: 'Bugun', ru: 'Сегодня' }, sana: '2026-10-05', band: [] },
    { nom: { uz: 'Shanba', ru: 'Суббота' }, sana: '2026-10-10', band: ['17:00', '20:00'] }
  ]
};
const HOLAT_SOZ = { bosh: { uz: "bo'sh", ru: 'свободно' }, band: { uz: 'band', ru: 'занято' } };
const lcFirst = (s) => (typeof s === 'string' && s ? s[0].toLocaleLowerCase() + s.slice(1) : s);
// Halqa: 'err' — buzilgan joy (qizil + bir qatorlik kuzatuv) · 'ok' — tuzaldi (yashil, so'nadi) · 'on' — tekshirilayotgan joy
const JOY_YORLIQ = {
  royxat: { uz: "Ikkinchi ro'yxat", ru: 'Второй список' },
  kun: { uz: "Kun tanlab bo'lmaydi", ru: 'День не выбрать' },
  katak: { uz: 'Katak jonlanmaydi', ru: 'Ячейка не оживает' }
};
const Joy = ({ h, yorliq, children }) => (
  <div className={`mf-joy ${h || ''}`}>{h === 'err' && yorliq && <span className="mf-joy-l">{yorliq}</span>}{children}</div>
);
// manba: 'fayl' | 'backend' | 'xato' · kun — kunlar indeksi · kunSorov — so'rovga ?kun= qo'shilganmi (yo'q bo'lsa Backend bugungisini beradi) ·
// almashtirgich — kun almashtirgichi bormi · jonli — bo'sh katak bosilsa kichrayib qaytadi va onKatak (hodisa) chaqiriladi ·
// royxat — kataklar ostidagi ikkinchi ro'yxat · halqa { royxat, kun, katak, holat } · sanoq — vaqt-tanladi soni · katta — blok o'ngi (holat qatorisiz)
const MaydonMaket = ({ manba = 'backend', kun = 0, kunSorov = true, almashtirgich = true, onKun, jonli = true, onKatak, royxat = false, halqa = {}, sanoq, bosilgan, rang = false, jarayon, holatXato = false, katta = false }) => {
  const K = MAYDON_KATAKLAR;
  const kunObj = K.kunlar[kun] || K.kunlar[0];
  const backendBand = kunSorov ? kunObj.band : K.kunlar[0].band;
  const band = manba === 'fayl' ? K.fayl : backendBand;
  const [bos, setBos] = useState(null);
  const tRef = useRef(null);
  useEffect(() => () => clearTimeout(tRef.current), []);
  const tap = (s) => {
    if (!jonli) return; // buzilgan holat: bosish jim — animatsiya ham, hodisa ham yo'q
    setBos(s); clearTimeout(tRef.current); tRef.current = setTimeout(() => setBos(null), 240);
    if (onKatak) onKatak(s);
  };
  const bosildi = bosilgan || bos;
  const holat = manba === 'fayl' ? tr({ uz: "namuna ma'lumot · faylda", ru: 'образец данных · в файле' })
    : manba === 'xato' ? tr({ uz: 'Backend javob bermadi', ru: 'Backend не ответил' })
      : `GET /vaqtlar${kunSorov ? `?kun=${kunObj.sana}` : ''} · Backend`;
  return (
    <div className={`mf-sayt ${katta ? 'katta' : ''}`}>
      <div className="mf-sayt-bar"><i /><i /><i /><span>localhost:5173</span></div>
      <div className="mf-sayt-tana">
        {jarayon && <span className="mf-jarayon">{jarayon}</span>}
        <div className="mf-bosh">
        <b className="mf-nom">Maydon</b>
        {almashtirgich
          ? (
            <Joy h={halqa.kun}>
              <div className="mf-kun">
                <button type="button" className="mf-strelka" disabled={!onKun || kun <= 0} onClick={() => onKun(kun - 1)} aria-label={tr({ uz: 'Oldingi kun', ru: 'Предыдущий день' })}>‹</button>
                <b key={kun} className="mf-kun-n">{tr(kunObj.nom)}</b>
                <button type="button" className="mf-strelka" disabled={!onKun || kun === K.kunlar.length - 1} onClick={() => onKun(kun + 1)} aria-label={tr({ uz: 'Keyingi kun', ru: 'Следующий день' })}>›</button>
              </div>
            </Joy>
          )
          : halqa.kun && <Joy h={halqa.kun} yorliq={tr(JOY_YORLIQ.kun)}><div className="mf-kun bosh" /></Joy>}
        </div>
        <Joy h={halqa.katak} yorliq={tr(JOY_YORLIQ.katak)}>
          {manba === 'xato'
            ? <p className="mf-xabar">{tr({ uz: "Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.", ru: 'Не удалось загрузить время. Попробуйте чуть позже.' })}</p>
            : (
              <div className={`mf-kataklar ${rang ? 'rang' : ''}`}>
                {K.soatlar.map(s => {
                  const b = band.includes(s);
                  return <button type="button" key={s} className={`mf-katak ${b ? 'band' : ''} ${bosildi === s ? 'bos' : ''}`} disabled={b} onClick={() => tap(s)}><span>{s}</span>{b && <small>{tr(HOLAT_SOZ.band)}</small>}</button>;
                })}
              </div>
            )}
        </Joy>
        {royxat && (
          <Joy h={halqa.royxat} yorliq={tr(JOY_YORLIQ.royxat)}>
            <ul className="mf-royxat">{K.soatlar.map(s => <li key={s}>{s} — {tr(backendBand.includes(s) ? HOLAT_SOZ.band : HOLAT_SOZ.bosh)}</li>)}</ul>
          </Joy>
        )}
      </div>
      {!katta && (
        <div className="mf-holat-q">
          <Joy h={halqa.holat}><span className={`mf-holat ${holatXato ? 'err' : ''}`}>{holat}</span></Joy>
          {sanoq !== undefined && <span key={sanoq} className={`mf-sanoq ${sanoq ? 'yangi' : ''}`}>vaqt-tanladi · {sanoq}</span>}
        </div>
      )}
    </div>
  );
};

// Talabning uch qismi — bitta manba (P-063): 2-ekran bo'laklari, 4-ekran talab kartasi, a2 prompti, 5-qadam formasi shundan
const TALAB_QATORLAR = [
  { id: 'qayerda', qism: { uz: 'Qayerda', ru: 'Где' }, matn: { uz: 'Saytdagi vaqt kataklari', ru: 'Ячейки времени на сайте' } },
  { id: 'nima', qism: { uz: 'Nima qilsin', ru: 'Что сделать' }, matn: { uz: "Kun almashtirilsa, kataklar shu kun uchun Backend'dan kelsin", ru: 'При смене дня ячейки этого дня приходят из Backend' } },
  { id: 'buzilmasin', qism: { uz: 'Nima buzilmasin', ru: 'Что не сломать' }, matn: { uz: 'Katak animatsiyasi va `vaqt-tanladi` hodisasi', ru: 'Анимация ячейки и событие `vaqt-tanladi`' } }
];
const TALAB_TUZOQ = { uz: 'Chiroyli va zamonaviy qilib ber', ru: 'Сделай красиво и современно' };
const talabQator = (q) => <>{tr(q.qism)}: {fmtCode(lcFirst(tr(q.matn)))}</>;
const TalabKarta = ({ belgi = false }) => (
  <QKarta yorliq={tr({ uz: 'Talab', ru: 'Требование' })} className="mf-talab">
    {TALAB_QATORLAR.map(q => <p key={q.id} className="mf-tq-s">{belgi && <i className="mf-tq-ok">✓</i>}<span>{talabQator(q)}</span></p>)}
  </QKarta>
);
// Ballsiz bashorat (181) — bitta o'lchovning uch darajasi (2 va 4-ekran)
const SON_TAXMIN = [
  { k: '1', t: { uz: 'Bittasi', ru: 'Одно' } },
  { k: '2', t: { uz: 'Ikkitasi', ru: 'Два' } },
  { k: '3', t: { uz: 'Uchalasi', ru: 'Все три' } }
];
const taxminQator = (taxmin, togriK, haqiqat) => {
  const tx = SON_TAXMIN.find(t => t.k === taxmin);
  if (!tx) return null;
  return (
    <QTaxmin togri={taxmin === togriK}>{taxmin === togriK
      ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение верно' })
      : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</QTaxmin>
  );
};
// F-1005-85/87 (SABOQ 11): bashorat tanlangach yopilmaydi — savol va tanlangan variant ixcham qator bo'lib natija (QTaxmin) chiqquncha turadi
const TaxminIxcham = ({ savol, taxmin }) => {
  const tx = SON_TAXMIN.find(t => t.k === taxmin);
  if (!tx) return null;
  return (
    <div className="mf-taxmin">
      <span className="q-yorliq">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span>
      <span className="mf-taxmin-s">{savol}</span>
      <b className="mf-taxmin-j">{tr(tx.t)}</b>
    </div>
  );
};
// Kam harakat rejimi (prefers-reduced-motion): uchish va puls yo'q, natija darhol
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== SCREEN 0 — KIRISH (QKirish: agent chati + «Maydon» statik → «Yuborish» → agent «Tayyor!» → sayt buzildi → savol; ballsiz, J-026) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Agent kuchsiz — boshqa agentni ishlatish kerak edi', ru: 'Агент слабый — нужен был другой агент' } },
  { id: 'b', label: { uz: "Promptda joy yo'q — nimaga tegmaslik ham aytilmagan", ru: 'В промпте нет места — и не сказано, что не трогать' } },
  { id: 'c', label: { uz: 'Prompt juda qisqa — uni uzunroq yozish kerak edi', ru: 'Промпт слишком короткий — надо было длиннее' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [bosq, setBosq] = useState(avval ? 2 : 0); // 0 — yuborilmagan · 1 — agent yozmoqda · 2 — agent «Tayyor!» dedi
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const tRef = useRef(null);
  useEffect(() => () => clearTimeout(tRef.current), []);
  const yubor = () => { if (bosq) return; setBosq(1); setSc(n => n + 1); tRef.current = setTimeout(() => { setBosq(2); setSc(n => n + 1); }, 1100); };
  const pick = (v) => { if (picked !== null || bosq < 2) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const keyin = bosq === 2;
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Agent «Tayyor» dedi. <span className="italic" style={{ color: T.accent }}>Nega sayt buzildi?</span></>, ru: <>Агент сказал «Готово». <span className="italic" style={{ color: T.accent }}>Почему сайт сломался?</span></> })}
        mentor={<Mentor>{picked !== null
          ? tr({ uz: "Agent «Tayyor» dedi, lekin saytda uch joy buzildi — ular qizil bilan belgilandi.", ru: 'Агент сказал «Готово», но на сайте сломались три места — они отмечены красным.' })
          : keyin
            ? tr({ uz: "Agent «Tayyor» dedi — saytga qarang va javobni tanlang.", ru: 'Агент сказал «Готово» — посмотрите на сайт и выберите ответ.' })
            : tr({ uz: "«Maydon» saytidagi kataklarni Backend'dan olmoqchimiz — agentga bir qatorli prompt yozildi. «Yuborish»ni bosing.", ru: 'Хотим брать ячейки сайта «Maydon» из Backend — агенту написан промпт в одну строку. Нажмите «Отправить».' })}</Mentor>}
        maket={(
          <div className={`mf-hook ${keyin && picked === null ? 'tanla' : ''}`}>
            <div className="mf-chat">
              <p className="mf-pufak siz">{tr({ uz: "Vaqtlarni Backend'dan olib kel.", ru: 'Принеси время из Backend.' })}</p>
              {bosq === 0 && <QTugma className="mf-navbat" onClick={yubor}>{tr({ uz: 'Yuborish', ru: 'Отправить' })}</QTugma>}
              {bosq > 0 && <p key={bosq} className={`mf-pufak agent fade-step ${bosq === 1 ? 'yoz' : ''}`}>{bosq === 1 ? tr({ uz: 'yozmoqda…', ru: 'пишет…' }) : tr({ uz: "Tayyor! Vaqtlar endi Backend'dan keladi.", ru: 'Готово! Время теперь приходит из Backend.' })}</p>}
            </div>
            <MaydonMaket manba="fayl" almashtirgich={false} jonli={!keyin} royxat={keyin}
              halqa={picked !== null ? { royxat: 'err', kun: 'err', katak: 'err' } : {}} />
          </div>
        )}
        savol={tr({ uz: 'Nima yetishmadi?', ru: 'Чего не хватило?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!keyin}
        javob={picked !== null && <p className="hook-ack fade-step">{picked === 'b'
          ? tr({ uz: <><b>Aynan!</b> Bu misolda agent vaqtlarni Backend'dan oldi, lekin qayerga qo'yish va nimaga tegmaslik aytilmagan edi.</>, ru: <><b>Именно!</b> Здесь агент взял время из Backend, но не было сказано, куда его поставить и что не трогать.</> })
          : tr({ uz: <><b>Qiziq fikr!</b> Muammo agentda ham, uzunlikda ham emas: vaqtlar keldi, lekin qayerga qo'yish va nimaga tegmaslik yozilmagan.</>, ru: <><b>Интересная мысль!</b> Дело не в агенте и не в длине: время пришло, но не написано, куда его поставить и что не трогать.</> })}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Maydon» tayyor holatda bir marta o'zi yuradi, o'ngda bugungi 3 qadam, pastda repo teglari) =====
const REJA = [
  { uz: 'Backend tanlangan kunning kataklarini beradi', ru: 'Backend отдаёт ячейки выбранного дня' },
  { uz: "Sayt kataklarni Backend'dan oladi, kun almashadi", ru: 'Сайт берёт ячейки из Backend, день переключается' },
  { uz: 'Backend javob bermasa, sayt buni aytadi', ru: 'Если Backend не отвечает, сайт об этом сообщает' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [kun, setKun] = useState(0);
  const [bos, setBos] = useState(null);
  useEffect(() => { // DE-200: bir marta o'zi yuradi — Bugun → «›» Shanba (17:00, 20:00 band) → bo'sh katak kichrayib qaytadi
    const a = setTimeout(() => setKun(1), 1500);
    const b = setTimeout(() => setBos('18:00'), 2700);
    const c = setTimeout(() => setBos(null), 2950);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida «Maydon» ekrani <span className="italic" style={{ color: T.accent }}>Backend bilan ishlaydi</span>.</>, ru: <>К концу урока экран «Maydon» <span className="italic" style={{ color: T.accent }}>работает с Backend</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Talabni siz yozasiz, kodni agent yozadi. «Maydon» — namuna: har amaliyot oxirida o'z g'oyangizga ham yozasiz.", ru: 'Требование пишете вы, код пишет агент. «Maydon» — образец: в конце каждой практики напишете и для своей идеи.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
        chap={<MaydonMaket manba="backend" kun={kun} kunSorov onKun={setKun} bosilgan={bos} />}
        ongYorliq={tr({ uz: 'Bugungi 3 qadam', ru: '3 шага на сегодня' })}
        qadamlar={REJA.map(r => ({ t: tr(r) }))}
      >
        <p className="mf-repo">{tr({ uz: "repo maydon · boshlang'ich holat dars-07-start · namuna dars-07-done", ru: 'репо maydon · начальное состояние dars-07-start · образец dars-07-done' })}</p>
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — TUSHUNCHA · TALAB (QTushuncha: bashorat → bo'laklar bittadan katta karta «Qo'shish» / «Kerak emas» → kerakli bo'lak promptdagi o'z qatoriga uchib tushadi → agent qaytadan quradi → maketda o'z joyi tuzaladi) =====
// Holat qo'shilgan qismlar to'plamidan chiziladi (2³, P-046) — bu dars mexanikasi: har qism faqat o'z joyini tuzatadi; tuzoq hech narsani tuzatmaydi.
// F-1005-84 (qaror A, SABOQ 9/13): bo'laklar birdaniga to'kilmaydi — bittadan chiqadi. Tartib: tuzoq birinchi ham, oxirgi ham emas (2-o'rinda).
const BOLAK_TARTIB = ['nima', 'tuzoq', 'buzilmasin', 'qayerda'];
// «Kerak emas» kerakli bo'lakda bosilsa — sabab maketdagi qizil yorliq bilan bir so'zda (JOY_YORLIQ)
const BOLAK_KERAK = {
  qayerda: { uz: "Kerak — usiz ikkinchi ro'yxat qoladi.", ru: 'Нужен — без него останется второй список.' },
  nima: { uz: "Kerak — usiz kun tanlab bo'lmaydi.", ru: 'Нужен — без него день не выбрать.' },
  buzilmasin: { uz: 'Kerak — usiz katak jonlanmaydi.', ru: 'Нужен — без него ячейка не оживает.' }
};
const TUZOQ_XATO = { uz: "Umumiy so'z — agent nimani tuzatishni bilmaydi.", ru: 'Общие слова — агент не знает, что исправлять.' };
const S2_SAVOL = { uz: "Promptga bitta qism qo'shsangiz, nechta buzilgan joy tuzaladi?", ru: 'Если добавить в промпт одну часть, сколько сломанных мест исправится?' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const HAMMA = TALAB_QATORLAR.map(q => q.id);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [navbat, setNavbat] = useState(avval ? BOLAK_TARTIB.length : 0); // ko'rsatilayotgan bo'lak — BOLAK_TARTIB indeksi
  const [qator, setQator] = useState(avval ? HAMMA : []);       // promptga tushgan qatorlar
  const [tuzalgan, setTuzalgan] = useState(avval ? HAMMA : []); // agent qaytadan qurgan joylar
  const [quryapti, setQuryapti] = useState(false);
  const [harakat, setHarakat] = useState(null); // null · 'uch' — bo'lak o'z qatoriga uchmoqda · 'ket' — tuzoq chetga so'nmoqda
  const [uch, setUch] = useState(null);         // { dx, dy, s } — uchish yo'li (px) va kichrayish
  const [xato, setXato] = useState(null);       // { tugma: 'qosh' | 'rad', matn } — xato tanlov va sababi
  const [silk, setSilk] = useState(false);
  const [rang, setRang] = useState(false);
  const [kun, setKun] = useState(avval ? 1 : 0);
  const [sanoq, setSanoq] = useState(avval ? 1 : 0);
  const [bos, setBos] = useState(null);
  const tm = useRef([]);
  const kartaRef = useRef(null);
  const matnRef = useRef(null);
  const joyRef = useRef({});
  const keyin = (fn, ms) => { tm.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const bor = (id) => tuzalgan.includes(id);
  const joriy = BOLAK_TARTIB[navbat];
  const done = navbat >= BOLAK_TARTIB.length && tuzalgan.length >= HAMMA.length;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // Ko'rinadigan joyga surish: bo'lak kartasi (kompyuterda allaqachon ko'rinadi — siljimaydi).
  // Bir ustunli ekranda (≤860, maket tepada): agent qurayotganda maketga, qurib bo'lgach keyingi kartaga — o'quvchi tuzalishni ko'radi.
  useEffect(() => {
    if (!taxmin) return;
    const birUstun = typeof window !== 'undefined' && window.innerWidth <= 860;
    const el = quryapti ? (birUstun ? document.querySelector('.q-tushuncha .mf-sayt') : null) : (joriy ? kartaRef.current : null);
    if (!el || !el.scrollIntoView) return;
    const t = setTimeout(() => el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }), 140);
    return () => clearTimeout(t);
  }, [taxmin, navbat, quryapti]); // eslint-disable-line
  const band = !taxmin || quryapti || !!harakat;
  const silkit = () => { setSilk(true); keyin(() => setSilk(false), 380); };
  // Kerakli bo'lak qatorga tushdi: agent qaytadan quradi, maketda o'z joyi tuzaladi; keyingi bo'lak kartasi shu payt chiqadi
  const tushdi = (id) => {
    setHarakat(null); setUch(null); setQator(q => [...q, id]); setNavbat(n => n + 1); setQuryapti(true);
    keyin(() => {
      setTuzalgan(t => [...t, id]); setQuryapti(false);
      if (id === 'nima') keyin(() => setKun(1), 600);
      if (id === 'buzilmasin') { keyin(() => { setBos('18:00'); setSanoq(n => n + 1); }, 600); keyin(() => setBos(null), 860); }
    }, 800);
  };
  const tanla = (qosh) => {
    if (band || !joriy) return;
    if (joriy === 'tuzoq') {
      if (qosh) { setXato({ tugma: 'qosh', matn: TUZOQ_XATO }); silkit(); setRang(true); keyin(() => setRang(false), 650); return; }
      setXato(null); setHarakat('ket');
      keyin(() => { setHarakat(null); setNavbat(n => n + 1); }, kamHarakat() ? 0 : 420);
      return;
    }
    if (!qosh) { setXato({ tugma: 'rad', matn: BOLAK_KERAK[joriy] }); silkit(); return; }
    const id = joriy;
    setXato(null);
    const a = matnRef.current, b = joyRef.current[id];
    if (!a || !b || kamHarakat()) { tushdi(id); return; }
    // Uchish: bo'lak matni promptdagi o'z qatorining matn joyiga boradi (--lz kattalashtirishi hisobga olinadi)
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lz')) || 1;
    const s = (parseFloat(getComputedStyle(b).fontSize) || 14) / (parseFloat(getComputedStyle(a).fontSize) || 18);
    setUch({ dx: (rb.left - ra.left) / z, dy: (rb.top - ra.top) / z, s });
    setHarakat('uch');
    keyin(() => tushdi(id), 600);
  };
  const joriyQ = TALAB_QATORLAR.find(x => x.id === joriy);
  const maket = (
    <MaydonMaket manba={bor('qayerda') ? 'backend' : 'fayl'} royxat={!bor('qayerda')}
      almashtirgich={bor('nima')} kunSorov={bor('nima')} kun={bor('nima') ? kun : 0} onKun={bor('nima') ? setKun : undefined}
      jonli={bor('buzilmasin')} onKatak={() => setSanoq(n => n + 1)} bosilgan={bos} sanoq={sanoq} rang={rang}
      jarayon={quryapti && tr({ uz: 'agent qaytadan quryapti…', ru: 'агент собирает заново…' })}
      halqa={{ royxat: 'err', kun: bor('nima') ? 'ok' : 'err', katak: bor('buzilmasin') ? 'ok' : 'err', holat: bor('qayerda') ? 'ok' : undefined }} />
  );
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' })
      : tr({ uz: `Har bo'lakka javob bering (${navbat}/${BOLAK_TARTIB.length})`, ru: `Ответьте по каждому фрагменту (${navbat}/${BOLAK_TARTIB.length})` });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · talab', ru: 'Понятие · требование' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Promptga nima qo'shsangiz, <span className="italic" style={{ color: T.accent }}>agent aniqroq quradi?</span></>, ru: <>Что добавить в промпт, чтобы <span className="italic" style={{ color: T.accent }}>агент строил точнее?</span></> })}
        mentor={<Mentor>{!taxmin
          ? tr({ uz: "Kirishdagi bir qatorli promptni to'ldiramiz — avval taxminingizni belgilang.", ru: 'Дополним промпт в одну строку из введения — сначала отметьте своё предположение.' })
          : done
            ? tr({ uz: "Har bo'lak qo'shilganda agent saytni qaytadan qurdi.", ru: 'После каждого добавленного фрагмента агент собирал сайт заново.' })
            : tr({ uz: "Bo'lak qo'shilsa, agent saytni qaytadan quradi. Kerak bo'lsa «Qo'shish», kerak bo'lmasa «Kerak emas»ni bosing.", ru: 'Когда фрагмент добавлен, агент собирает сайт заново. Если он нужен — «Добавить», если нет — «Не нужен».' })}</Mentor>}
        bashorat={!taxmin
          ? <div className="mf-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={SON_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <TaxminIxcham savol={tr(S2_SAVOL)} taxmin={taxmin} />}
        harakat={(
          <div className="q-col">
            <QKarta yorliq={tr({ uz: 'Prompt', ru: 'Промпт' })} className="mf-prompt">
              <p className="mf-pq">{tr({ uz: "Vaqtlarni Backend'dan olib kel.", ru: 'Принеси время из Backend.' })}</p>
              {/* bo'sh qator ham o'z nomini ko'rsatadi (Qayerda · Nima qilsin · Nima buzilmasin); matn joyi — uchish nishoni */}
              {TALAB_QATORLAR.map(q => {
                const tola = qator.includes(q.id);
                return (
                  <p key={q.id} className={`mf-pq ${tola ? 'tola' : 'bosh'} ${harakat === 'uch' && joriy === q.id ? 'kutadi' : ''}`}>
                    <span className="mf-qism">{tr(q.qism)}</span>
                    <span className="mf-pq-m" ref={el => { joyRef.current[q.id] = el; }}>{tola ? fmtCode(tr(q.matn)) : ' '}</span>
                  </p>
                );
              })}
            </QKarta>
            {taxmin && joriy && (
              <div ref={kartaRef} key={joriy} className="mf-bk-w">
                <QKarta yorliq={`${tr({ uz: "Bo'lak", ru: 'Фрагмент' })} ${navbat + 1} / ${BOLAK_TARTIB.length}`} className={`mf-bk ${silk ? 'silk' : ''} ${harakat || ''}`}>
                  {/* xato tanlovda savol qatori o'rnida sabab chiqadi — karta o'smaydi, pastki panel ostiga tushmaydi */}
                  {xato ? <QXato>{tr(xato.matn)}</QXato> : <span className="mf-bk-s">{tr({ uz: "Bu bo'lak promptga kerakmi?", ru: 'Этот фрагмент нужен в промпте?' })}</span>}
                  <p ref={matnRef} className="mf-bk-m" style={uch ? { transform: `translate(${uch.dx}px, ${uch.dy}px) scale(${uch.s})` } : undefined}>{fmtCode(tr(joriyQ ? joriyQ.matn : TALAB_TUZOQ))}</p>
                  <div className="mf-bk-t">
                    <QTugma ikkinchi className={!band && xato?.tugma !== 'qosh' ? 'mf-navbat' : undefined} disabled={band || xato?.tugma === 'qosh'} onClick={() => tanla(true)}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>
                    <QTugma ikkinchi className={!band && xato?.tugma !== 'rad' ? 'mf-navbat' : undefined} disabled={band || xato?.tugma === 'rad'} onClick={() => tanla(false)}>{tr({ uz: 'Kerak emas', ru: 'Не нужен' })}</QTugma>
                  </div>
                </QKarta>
              </div>
            )}
          </div>
        )}
        vizual={tugadi ? <div className="mf-fokus2"><TalabKarta />{maket}</div> : maket}
        natija={done && (
          <div className="mf-natija">
            <p className="mf-joriy fade-step">{tr({ uz: <>Promptdagi bunday vazifa <b>talab</b> deyiladi: qayerda, nima qilsin, nima buzilmasin.</>, ru: <>Такая задача в промпте называется <b>требованием</b>: где, что сделать, что не сломать.</> })}</p>
            {taxminQator(taxmin, '1', { uz: 'har qism bitta joyni tuzatdi', ru: 'каждая часть исправила одно место' })}
          </div>
        )}
        xulosa={done && tr({ uz: 'Bu darsda talab uch qismli: qayerda, nima qilsin, nima buzilmasin. Bu mashqda har qism bitta muammoni yopdi.', ru: 'В этом уроке требование из трёх частей: где, что сделать, что не сломать. Здесь каждая часть закрыла одну проблему.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 2 — C; variantlar bir shaklda «Qism — agent …», to'g'risi eng uzun emas) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Kataklar keldi, lekin vaqt-tanladi hodisasi yozilmayapti. Talabda nima yo'q edi?"
    question={tr({ uz: <><h2 className="title h-ask">Kataklar keldi, lekin <code className="qcode">vaqt-tanladi</code> hodisasi yozilmayapti. <span className="italic" style={{ color: T.accent }}>Talabda nima yo'q edi?</span></h2></>, ru: <><h2 className="title h-ask">Ячейки пришли, но событие <code className="qcode">vaqt-tanladi</code> не пишется. <span className="italic" style={{ color: T.accent }}>Чего не было в требовании?</span></h2></> })}
    options={[
      { uz: 'Qayerda — agent saytning qaysi joyida ishlashi', ru: 'Где — в каком месте сайта работает агент' },
      { uz: 'Nima qilsin — agent qaysi ishni bajarishi', ru: 'Что сделать — какую работу выполняет агент' },
      { uz: 'Nima buzilmasin — agent nimaga tegmasligi', ru: 'Что не сломать — чего агент не трогает' },
      { uz: 'Texnologiya — agent qaysi kutubxonani olishi', ru: 'Технология — какую библиотеку берёт агент' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Agent hodisaga tegmaslik kerakligini bilmadi — bu talabda aytilmagan edi.', ru: 'Агент не знал, что событие трогать нельзя — в требовании этого не было.' }}
    explainWrong={{
      0: { uz: "Joy aytilgan — kataklar o'z joyiga keldi.", ru: 'Место названо — ячейки пришли на своё место.' },
      1: { uz: "Ish bajarilgan — kataklar Backend'dan keldi.", ru: 'Работа сделана — ячейки пришли из Backend.' },
      3: { uz: "Kutubxona repo'da tanlangan. Hodisa nega yo'qoldi?", ru: 'Библиотека выбрана в репо. Почему пропало событие?' },
      default: { uz: "Kutubxona repo'da tanlangan. Hodisa nega yo'qoldi?", ru: 'Библиотека выбрана в репо. Почему пропало событие?' }
    }} />
);

// ===== SCREEN 4 — TUSHUNCHA · TEKSHIRISH (QTushuncha: talab qatorini bosish → maket shu qatorni bajarib ko'rsatadi; 2-qator buzilgan → tuzatish talabi → «Qayta tekshirish») =====
const TUZAT_TALAB = [
  { uz: 'Qayerda: kun almashtirgichi.', ru: 'Где: переключатель дня.' },
  { uz: "Nima qilsin: Shanbaga o'tilsa kataklar o'zgarmayapti — tanlangan kun `?kun=` ga qo'shilsin.", ru: 'Что сделать: при переходе на субботу ячейки не меняются — добавь выбранный день в `?kun=`.' },
  { uz: 'Nima buzilmasin: katak animatsiyasi.', ru: 'Что не сломать: анимация ячейки.' }
];
const S4_SAVOL = { uz: 'Agent «Tayyor» degan talabning nechta qatori ishlaydi?', ru: 'Сколько строк требования, о котором агент сказал «Готово», работает?' };
const Screen4 =({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [qator, setQator] = useState(avval ? { qayerda: 'ok', nima: 'ok', buzilmasin: 'ok' } : {});
  const [kun, setKun] = useState(avval ? 1 : 0);
  const [kunSorov, setKunSorov] = useState(avval);
  const [sanoq, setSanoq] = useState(avval ? 1 : 0);
  const [bos, setBos] = useState(null);
  const [joy, setJoy] = useState(false);
  const [izoh, setIzoh] = useState(null);
  const [tuzatyapti, setTuzatyapti] = useState(false);
  const tm = useRef([]);
  const keyin = (fn, ms) => { tm.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const okSoni = TALAB_QATORLAR.filter(q => qator[q.id] === 'ok').length;
  const done = okSoni === TALAB_QATORLAR.length;
  const tugadi = useTugadi(done, 1400, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const tekshir = (id) => {
    if (!taxmin || tuzatyapti || qator[id]) return;
    if (id === 'qayerda') { setJoy(true); keyin(() => setJoy(false), 1500); setIzoh({ uz: "Kataklar o'z joyida, ikkinchi ro'yxat yo'q.", ru: 'Ячейки на своём месте, второго списка нет.' }); setQator(q => ({ ...q, qayerda: 'ok' })); }
    if (id === 'nima') { setKun(1); setIzoh(null); setQator(q => ({ ...q, nima: 'err' })); }
    if (id === 'buzilmasin') { setBos('18:00'); setSanoq(n => n + 1); keyin(() => setBos(null), 260); setIzoh({ uz: 'Animatsiya va hodisa joyida.', ru: 'Анимация и событие на месте.' }); setQator(q => ({ ...q, buzilmasin: 'ok' })); }
  };
  const qaytaTekshir = () => {
    if (tuzatyapti) return;
    setTuzatyapti(true);
    keyin(() => { setKunSorov(true); setKun(1); setTuzatyapti(false); setQator(q => ({ ...q, nima: 'ok' })); }, 900);
  };
  const maket = (
    <MaydonMaket manba="backend" kun={kun} kunSorov={kunSorov} onKun={setKun} onKatak={() => setSanoq(n => n + 1)} bosilgan={bos} sanoq={sanoq}
      holatXato={qator.nima === 'err'} jarayon={tuzatyapti && tr({ uz: 'agent tuzatyapti…', ru: 'агент исправляет…' })}
      halqa={{ katak: joy ? 'on' : undefined, holat: qator.nima === 'ok' ? 'ok' : undefined }} />
  );
  // F-1005-85/87 (SABOQ 11): navbatdagi element — tuzatish kutilsa «Qayta tekshirish», aks holda tartibdagi birinchi tekshirilmagan qator
  const xatoQator = qator.nima === 'err';
  const navbatQ = taxmin && !xatoQator && !tuzatyapti ? (TALAB_QATORLAR.find(q => !qator[q.id]) || {}).id : null;
  // tuzatish talabi va «Qayta tekshirish» ochilganda ko'rinadigan joyga suriladi (1280×773 da pastki panel ostida qolmasin)
  const tuzatRef = useRef(null);
  useEffect(() => {
    if (!xatoQator) return;
    const t = setTimeout(() => { const el = tuzatRef.current; if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 140);
    return () => clearTimeout(t);
  }, [xatoQator]);
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' })
      : tr({ uz: `Har qatorni tekshiring (${okSoni}/3)`, ru: `Проверьте каждую строку (${okSoni}/3)` });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · tekshirish', ru: 'Понятие · проверка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Agent «Tayyor» dedi. <span className="italic" style={{ color: T.accent }}>Ishlaganini qanday bilasiz?</span></>, ru: <>Агент сказал «Готово». <span className="italic" style={{ color: T.accent }}>Как узнать, что работает?</span></> })}
        mentor={<Mentor>{!taxmin
          ? tr({ uz: 'Avval taxminingizni belgilang, keyin talab qatorlarini bittadan bosasiz.', ru: 'Сначала отметьте предположение, потом будете нажимать строки требования по одной.' })
          : xatoQator
            ? tr({ uz: "Shanbaga o'tildi, lekin kataklar o'zgarmadi. Agentga tuzatish talabi yozildi — «Qayta tekshirish»ni bosing.", ru: 'Перешли на субботу, но ячейки не изменились. Агенту написано требование на исправление — нажмите «Проверить снова».' })
            : done
              ? tr({ uz: "Har qatorni saytda o'zingiz ko'rdingiz.", ru: 'Каждую строку вы проверили на сайте сами.' })
              : tr({ uz: "Talabning har qatorini bosing — sayt uni bajaryaptimi, o'zingiz ko'rasiz.", ru: 'Нажимайте каждую строку требования — сами увидите, выполняет ли её сайт.' })}</Mentor>}
        bashorat={!taxmin
          ? <div className="mf-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S4_SAVOL)} variantlar={SON_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <TaxminIxcham savol={tr(S4_SAVOL)} taxmin={taxmin} />}
        harakat={(
          <div className="q-col">
            <QKarta yorliq={tr({ uz: 'Talab', ru: 'Требование' })} className="mf-talab">
              {TALAB_QATORLAR.map((q, i) => (
                <QChip key={q.id} className={`mf-tq ${navbatQ === q.id ? 'mf-navbat' : ''}`} holat={qator[q.id]} disabled={!taxmin || tuzatyapti || !!qator[q.id]} onClick={() => tekshir(q.id)}>
                  <i className="mf-tq-n">{qator[q.id] === 'ok' ? '✓' : qator[q.id] === 'err' ? '✕' : i + 1}</i><span>{talabQator(q)}</span>
                </QChip>
              ))}
            </QKarta>
            {xatoQator && (
              <div ref={tuzatRef} className="mf-tuzat">
                <div className="mf-tuzat-s">{TUZAT_TALAB.map((l, i) => <p key={i} className="mf-tuzat-q">{fmtCode(tr(l))}</p>)}</div>
                <QTugma className={tuzatyapti ? undefined : 'mf-navbat'} onClick={qaytaTekshir} disabled={tuzatyapti}>{tr({ uz: 'Qayta tekshirish', ru: 'Проверить снова' })}</QTugma>
              </div>
            )}
            {izoh && <QIzoh>{tr(izoh)}</QIzoh>}
          </div>
        )}
        vizual={tugadi ? <div className="mf-fokus2"><TalabKarta belgi />{maket}</div> : maket}
        natija={done && taxminQator(taxmin, '2', { uz: 'bu safar uchtadan ikkitasi ishladi, bittasini tuzatdingiz', ru: 'в этот раз работали две из трёх, одну вы исправили' })}
        xulosa={done && tr({ uz: 'Agent «Tayyor» desa ham, talabning har qatorini tekshirasiz. Mos kelmagan joyni aniq yozib, tuzattirasiz.', ru: 'Даже если агент сказал «Готово», вы проверяете каждую строку. Несовпавшее место точно описываете и просите исправить.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s5 = 0 — A; to'rttalasi agentga sen-buyruq, T-002) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Shanba bosildi, kataklar o'zgarmadi. Agentga nima yozasiz?"
    question={tr({ uz: <><h2 className="title h-ask">Shanba bosildi, kataklar o'zgarmadi. <span className="italic" style={{ color: T.accent }}>Agentga nima yozasiz?</span></h2></>, ru: <><h2 className="title h-ask">Нажали субботу, ячейки не изменились. <span className="italic" style={{ color: T.accent }}>Что напишете агенту?</span></h2></> })}
    options={[
      { uz: "Bosilgan kunni so'rovga qo'sh, kataklarni yangila", ru: 'Добавь нажатый день в запрос, обнови ячейки' },
      { uz: 'Ishlamayapti — butun saytni boshidan qayta yoz', ru: 'Не работает — перепиши весь сайт с нуля' },
      { uz: 'Kun almashtirgichini olib tashla, faqat bugun qolsin', ru: 'Убери переключатель дня, пусть останется сегодня' },
      { uz: "Kataklarni Backend'siz, yana avvalgidek fayldan ol", ru: 'Бери ячейки без Backend, снова из файла' }
    ]} correctIdx={0}
    explainCorrect={{ uz: 'Joy va kerakli natija aniq — agent faqat shu joyni tuzatadi.', ru: 'Место и нужный результат точные — агент исправит только это место.' }}
    explainWrong={{
      1: { uz: 'Agent qayerni tuzatishni bilmaydi — ishlagani ham buziladi.', ru: 'Агент не знает, что исправлять — сломается и рабочее.' },
      2: { uz: "Kun almashishi talabda bor — uni olib tashlab bo'lmaydi.", ru: 'Смена дня есть в требовании — её нельзя убрать.' },
      3: { uz: "Faylga qaytsa, kataklar yana faqat bitta kunniki bo'ladi.", ru: 'Если вернуться к файлу, ячейки снова будут для одного дня.' },
      default: { uz: 'Agent qayerni tuzatishni bilmaydi — ishlagani ham buziladi.', ru: 'Агент не знает, что исправлять — сломается и рабочее.' }
    }} />
);

// ===== 🏅 BADGES (nishonlar, 3) — ikki test + bitta amaliyot-bonus (172.4: A3 oxirgi «Bajardim», birinchi urinish sharti yo'q) =====
const ACHIEVEMENTS = {
  threeParts: { icon: '🧩', name: 'Three Parts', desc: { uz: 'Talabning qaysi qismi yetmaganini topdingiz', ru: 'Вы нашли, какой части требования не хватало' } },
  clearFix: { icon: '🎯', name: 'Clear Fix', desc: { uz: "Ko'rganingizni aniq talabga aylantirdingiz", ru: 'Вы превратили увиденное в точное требование' } },
  firstScreen: { icon: '🖥️', name: 'First Screen', desc: { uz: 'Uch amaliyot blokini oxirigacha bajardingiz', ru: 'Вы прошли три блока практики до конца' } }
};
// Ekran id → nishon: s3, s5 — test (to'g'ri javob, birinchi urinish) · a3 — bonus (oxirgi «Bajardim»)
const ACH_TRIGGERS = { s3: 'threeParts', s5: 'clearFix', a3: 'firstScreen' };

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


// Podium savol yorliqlari (kalitlar = SCORED_IDX: 4 — 1-savol, 7 — 2-savol; q22)
const Q_LABELS = {
  4: { uz: '1 — Talab qismlari', ru: '1 — Части требования' },
  7: { uz: '2 — Tuzatish talabi', ru: '2 — Требование на исправление' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'talab', ru: 'требование' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'qayerda', ru: 'где' }, l: 84, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: { uz: 'nima qilsin', ru: 'что сделать' }, l: 8, t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'nima buzilmasin', ru: 'что не сломать' }, l: 68, t: 70, s: 22, d: 21, dl: 2.2 },
  { ch: 'GET /vaqtlar', l: 42, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: '?kun=', l: 64, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'bandlar', l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Antigravity', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'CORS', l: 90, t: 44, s: 22, d: 22, dl: 0.6 },
  { ch: 'vaqt-tanladi', l: 50, t: 6, s: 22, d: 24, dl: 1.3 },
  { ch: 'Umami', l: 3, t: 46, s: 22, d: 19, dl: 2.4 },
  { ch: 'Motion', l: 34, t: 58, s: 22, d: 26, dl: 0.2 },
  { ch: 'localhost:5173', l: 74, t: 88, s: 20, d: 23, dl: 1.7 },
  { ch: '17:00', l: 14, t: 90, s: 24, d: 21, dl: 3.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni MD dan: A·B·C·D ×3 (3/3/3/3); to'g'ri variant hech qayerda eng uzun emas.
const QUIZ_BANK = [
  { q: { uz: 'Talab nima?', ru: 'Что такое требование?' }, opts: [{ uz: 'Promptdagi vazifa: qayerda, nima qilsin, nima buzilmasin', ru: 'Задача в промпте: где, что сделать, что не сломать' }, { uz: "Agent javobi: qaysi fayllar o'zgargani va «Tayyor» so'zi", ru: 'Ответ агента: какие файлы изменились и слово «Готово»' }, { uz: "Sayt ko'rinishi: tugmalar, kataklar va ularning ranglari", ru: 'Вид сайта: кнопки, ячейки и их цвета' }, { uz: "Backend ro'yxati: hamma yo'llar va undagi hamma jadvallar", ru: 'Список Backend: все пути и все таблицы в нём' }], correct: 0 },
  { q: { uz: "Agent kataklar ostiga ikkinchi ro'yxat qo'shdi. Talabda nima yo'q edi?", ru: 'Агент добавил под ячейками второй список. Чего не было в требовании?' }, opts: [{ uz: 'Nima qilsin — qaysi ishni bajarish', ru: 'Что сделать — какую работу выполнить' }, { uz: 'Qayerda — saytda qaysi joyda ishlash', ru: 'Где — в каком месте сайта работать' }, { uz: 'Nima buzilmasin — nimaga tegmaslik', ru: 'Что не сломать — что не трогать' }, { uz: 'Texnologiya — qaysi kutubxonani olish', ru: 'Технология — какую библиотеку взять' }], correct: 1 },
  { q: { uz: 'Qaysi biri yaxshi talab?', ru: 'Какое требование хорошее?' }, opts: [{ uz: 'Saytni chiroyli va zamonaviy qilib ber, iltimos', ru: 'Сделай сайт красивым и современным, пожалуйста' }, { uz: "Hammasini o'zing bilganingcha tartibga keltir", ru: 'Наведи порядок во всём, как сам знаешь' }, { uz: "Kataklar Backend'dan kelsin, animatsiya qolsin", ru: 'Ячейки пусть идут из Backend, анимация остаётся' }, { uz: 'Kataklar bilan bir narsa qil, yaxshi chiqsin', ru: 'Сделай что-нибудь с ячейками, чтобы было хорошо' }], correct: 2 },
  { q: { uz: 'Agent «Tayyor» dedi. Keyin nima qilasiz?', ru: 'Агент сказал «Готово». Что делаете дальше?' }, opts: [{ uz: 'Keyingi talabni shu zahoti agentga yuborasiz', ru: 'Сразу отправляете агенту следующее требование' }, { uz: "Agentdan «rostdanmi?» deb yana so'raysiz", ru: 'Снова спрашиваете агента: «Правда?»' }, { uz: 'Kodni o\'chirib, agentga qayta yozdirasiz', ru: 'Удаляете код и просите агента написать заново' }, { uz: 'Talabning har qatorini saytda tekshirasiz', ru: 'Проверяете на сайте каждую строку требования' }], correct: 3 },
  { q: { uz: "«Nima buzilmasin» qatoriga nima yoziladi?", ru: 'Что пишут в строке «Что не сломать»?' }, opts: [{ uz: 'Ishlab turgan narsa: animatsiya va hodisa', ru: 'То, что уже работает: анимация и событие' }, { uz: "Hali qurilmagan funksiyalarning ro'yxati", ru: 'Список ещё не созданных функций' }, { uz: 'Qaysi kutubxona bilan yozish kerakligi', ru: 'Какой библиотекой нужно писать' }, { uz: 'Agent ishni necha daqiqada tugatishi kerak', ru: 'За сколько минут агент должен закончить' }], correct: 0 },
  { q: { uz: '`GET /vaqtlar?kun=2026-10-10` nima qaytaradi?', ru: 'Что возвращает `GET /vaqtlar?kun=2026-10-10`?' }, opts: [{ uz: 'Shu kuni band qilganlarning ismlari', ru: 'Имена тех, кто занял в этот день' }, { uz: 'Shu kunning kataklari va holati', ru: 'Ячейки этого дня и их состояние' }, { uz: 'Haftadagi hamma kunlarning nomlari', ru: 'Названия всех дней недели' }, { uz: 'Saytning bosh sahifasi uchun kod', ru: 'Код для главной страницы сайта' }], correct: 1 },
  { q: { uz: 'Katak «band» ekanini Backend qayerdan biladi?', ru: 'Откуда Backend знает, что ячейка «занята»?' }, opts: [{ uz: 'Saytdagi kun almashtirgichining rangidan', ru: 'По цвету переключателя дня на сайте' }, { uz: "Umami'dagi `vaqt-tanladi` sonidan", ru: 'По числу `vaqt-tanladi` в Umami' }, { uz: '`bandlar` jadvalidagi yozuvdan', ru: 'По записи в таблице `bandlar`' }, { uz: "Brauzerning o'z xotirasidan", ru: 'Из памяти самого браузера' }], correct: 2 },
  { q: { uz: 'Tekshiruvda bitta qator mos kelmadi. Agentga nima yozasiz?', ru: 'При проверке одна строка не совпала. Что напишете агенту?' }, opts: [{ uz: '«Ishlamayapti, tuzat» degan bitta gap', ru: 'Одну фразу «Не работает, исправь»' }, { uz: 'Butun saytni boshidan qayta yozish iltimosi', ru: 'Просьбу переписать весь сайт заново' }, { uz: "Boshqa agentga o'tib ko'rish taklifi", ru: 'Предложение перейти к другому агенту' }, { uz: "Nima ko'rganingiz va nima bo'lishi kerak", ru: 'Что вы увидели и что должно быть' }], correct: 3 },
  { q: { uz: 'Terminalda xato chiqdi. Agentga nima yuborasiz?', ru: 'В терминале ошибка. Что отправите агенту?' }, opts: [{ uz: "Xatoning aniq matni va «Tuzat» so'zi", ru: 'Точный текст ошибки и слово «Исправь»' }, { uz: "«Ishlamayapti» degan bitta so'zni", ru: 'Одно слово «Не работает»' }, { uz: 'Butun loyihani qayta yozish iltimosini', ru: 'Просьбу переписать весь проект' }, { uz: "Faqat «Yordam ber» degan qisqa gapni", ru: 'Только короткое «Помоги»' }], correct: 0 },
  { q: { uz: 'Bu loyiha talabida React yoki NestJS ni qayta yozish kerakmi?', ru: 'Нужно ли в требовании этого проекта снова писать React или NestJS?' }, opts: [{ uz: 'Ha — har talabda kutubxona nomi turadi', ru: 'Да — в каждом требовании есть имя библиотеки' }, { uz: "Yo'q — stack repo'da tanlangan", ru: 'Нет — стек выбран в репо' }, { uz: 'Ha — agent usiz kod yoza olmaydi', ru: 'Да — без этого агент не напишет код' }, { uz: "Yo'q — agent o'zi boshqasini topadi", ru: 'Нет — агент сам найдёт другой' }], correct: 1 },
  { q: { uz: 'Backend javob bermayapti. Sayt nima qilishi kerak?', ru: 'Backend не отвечает. Что должен сделать сайт?' }, opts: [{ uz: "Bo'sh oq sahifani ko'rsatib turishi", ru: 'Показывать пустую белую страницу' }, { uz: "Eski kataklarni ko'rsataverib turishi", ru: 'Продолжать показывать старые ячейки' }, { uz: "Vaqtlarni yuklab bo'lmaganini aytishi", ru: 'Сказать, что время загрузить не удалось' }, { uz: "Backend'ni o'zi qaytadan yoqib qo'yishi", ru: 'Самому заново включить Backend' }], correct: 2 },
  { q: { uz: "Ju 9 bosildi. Sayt qaysi manzilga so'rov yuboradi?", ru: 'Нажали Пт 9. На какой адрес сайт отправит запрос?' }, opts: [{ uz: "`/vaqtlar` — kun qo'shilmagan", ru: '`/vaqtlar` — день не добавлен' }, { uz: '`/bandlar?kun=2026-10-09`', ru: '`/bandlar?kun=2026-10-09`' }, { uz: '`/kirish?kun=2026-10-09`', ru: '`/kirish?kun=2026-10-09`' }, { uz: '`/vaqtlar?kun=2026-10-09`', ru: '`/vaqtlar?kun=2026-10-09`' }], correct: 3 }
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
    const TOK = ['talab', 'GET /vaqtlar', 'Backend', '?kun=', 'bandlar', 'vaqt-tanladi', 'Antigravity', 'Database', 'CORS', '17:00'];
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
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err?, yordam?: [satr], forma?: true }] · natija · ortda (K10 buyruqlari).
// 9-Modul (qaror 8, GATE M M-q1): blok 5 qadam — 5-qadam «O'z g'oyangiz»: uch qatorli forma. Qolipda forma turi yo'q — shu ulagichda (GoyaForma):
//   qiymat answers[ekran].goya da (ccProgress), «Nusxalash» bor, «Bajardim» uchala qator yozilgach ochiladi (JS qulf + CSS :has).
// «Yordam» (A2 — namuna qator, A3 — namuna talab) qolipdagi QPrompt'da yo'q — QBlok qadamining izoh-qatori (xato) joyida, bosilsa ochiladi.
// «Ortda qoldingizmi» (K10): birinchi blokda dars-07-start, keyingilarida dars-07-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
const GOYA_BOSH = { qayerda: '', nima: '', buzilmasin: '' };
const GoyaForma = ({ qiymat, onYoz, tola }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => {
    try { await navigator.clipboard.writeText(TALAB_QATORLAR.map(q => `${tr(q.qism)}: ${String(qiymat[q.id] || '').trim()}`).join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="mf-goya" data-tola={tola ? '1' : '0'}>
      {TALAB_QATORLAR.map(q => (
        <label key={q.id} className="mf-goya-q">
          <span className="mf-goya-l">{tr(q.qism)}:</span>
          <textarea rows={1} value={qiymat[q.id] || ''} placeholder="…" onChange={e => onYoz(q.id, e.target.value)} />
        </label>
      ))}
      <QTugma ikkinchi disabled={!tola} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</QTugma>
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  useEffect(() => { // ochilgan namuna va «Bajardim» bir ko'rinishda qolsin
    if (!ochiq) return;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    return () => clearTimeout(t);
  }, [ochiq]);
  return (
    <>
      <QTugma ikkinchi className="mf-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="mf-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="mf-yordam-s">{fmtCode(tr(l))}</span>)}</span>}
    </>
  );
};
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [goya, setGoya] = useState(() => ({ ...GOYA_BOSH, ...((storedAnswer && storedAnswer.goya) || {}) }));
  const formaN = steps.findIndex(c => c.forma);
  const tola = TALAB_QATORLAR.every(q => String(goya[q.id] || '').trim());
  const done = stepN >= steps.length;
  const goyaYoz = (id, v) => { const g = { ...goya, [id]: v }; setGoya(g); if (!avval) onAnswer(screen, { ...(storedAnswer || {}), goya: g }); };
  const bajardim = () => {
    if (isMentorLive || done) return;
    if (stepN === formaN && !tola) return; // 5-qadam: uchala qator yozilmaguncha «Bajardim» yopiq
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, goya });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt, 5-qadam formasi) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham (telefonda Stage o'zi suradi)
  const birinchiRef = useRef(true);
  useEffect(() => {
    if (birinchiRef.current) { birinchiRef.current = false; return; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: c.forma ? <>{fmtCode(tr(c.t))}<GoyaForma qiymat={goya} onYoz={goyaYoz} tola={tola} /></> : fmtCode(tr(c.t)),
          prompt: c.prompt && c.prompt.map(l => tr(l)),
          kimga: c.prompt && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }),
          xato: c.yordam ? <Yordam satrlar={c.yordam} /> : (c.err && fmtCode(tr(c.err)))
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
// A1 kutilgan natija — brauzerda Backend javobi (JSON) · MAYDON_KATAKLAR dan (Shanba)
const BrauzerJson = () => {
  const k = MAYDON_KATAKLAR.kunlar[1];
  const n = MAYDON_KATAKLAR.soatlar.length;
  const qatorlar = MAYDON_KATAKLAR.soatlar.map((s, i) => `${i === 0 ? '[ ' : '  '}{ "soat": "${s}", "holat": "${k.band.includes(s) ? 'band' : "bo'sh"}" }${i === n - 1 ? ' ]' : ','}`);
  return (
    <div className="mf-sayt">
      <div className="mf-sayt-bar"><i /><i /><i /><span>localhost:3000/vaqtlar?kun={k.sana}</span></div>
      <pre className="mf-json">{qatorlar.join('\n')}</pre>
    </div>
  );
};
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const XATO_YOLI = { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' };
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon', ru: 'ожидаемый результат · образец: Maydon' };
const QADAM_OCHISH = { uz: 'Ochish', ru: 'Открыть' };
const QADAM_PROMPT = { uz: 'Prompt', ru: 'Промпт' };
const QADAM_ISHGA = { uz: 'Ishga tushirish', ru: 'Запуск' };
const QADAM_GOYA = { uz: "O'z g'oyangiz", ru: 'Ваша идея' };
// A2 prompti talabdan boshlanadi (P-063): «Qayerda» va «Nima qilsin» qatorlari TALAB_QATORLAR matnidan
const a2Satr = (q, oxiri) => ({ uz: `${q.qism.uz}: ${lcFirst(q.matn.uz)}${oxiri.uz}`, ru: `${q.qism.ru}: ${lcFirst(q.matn.ru)}${oxiri.ru}` });
const A3_JOY = TALAB_QATORLAR.map(q => ({ uz: `${q.qism.uz}: {${q.qism.uz.toLowerCase()}}`, ru: `${q.qism.ru}: {${q.qism.ru.toLowerCase()}}` }));

const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Backend → Database', ru: 'Практика 1 · Backend → Database' }}
    title={{ uz: <>Backend tanlangan kunning <span className="italic" style={{ color: T.accent }}>vaqt kataklarini</span> bersin.</>, ru: <>Пусть Backend отдаёт <span className="italic" style={{ color: T.accent }}>ячейки времени</span> выбранного дня.</> }}
    mentor={{ uz: <>Talab yozilgan — siz faqat <code className="qcode">{'{kun}'}</code> joyini to'ldirasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование готово — вы заполняете только место <code className="qcode">{'{kun}'}</code>; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "Antigravity'da `maydon` papkasini oching. Birinchi terminalda: `cd backend`, `npm run start:dev`. Ikkinchisida: `cd web`, `npm run dev`.", ru: 'Откройте папку `maydon` в Antigravity. В первом терминале: `cd backend`, `npm run start:dev`. Во втором: `cd web`, `npm run dev`.' } },
      { h: QADAM_PROMPT, t: { uz: "`{kun}` joyiga eng yaqin shanba sanasini `yil-oy-kun` shaklida yozing (masalan `2026-10-10`), «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Вместо `{kun}` впишите дату ближайшей субботы в виде `год-месяц-день` (например `2026-10-10`), нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        { uz: "Qayerda: backend/, yangi yo'l GET /vaqtlar?kun= (kun — sana, masalan 2026-10-10).", ru: 'Где: backend/, новый путь GET /vaqtlar?kun= (kun — дата, например 2026-10-10).' },
        { uz: "Nima qilsin: shu kun uchun 16:00 dan 21:00 gacha har soatga bitta katak qaytarsin: soat va holat — «bo'sh» yoki «band».", ru: 'Что сделать: для этого дня верни по одной ячейке на каждый час с 16:00 до 21:00: час и состояние — «bo\'sh» или «band».' },
        { uz: "Holatni bandlar jadvalidan ol: shu kun va soatda yozuv bo'lsa — «band».", ru: 'Состояние бери из таблицы bandlar: если на этот день и час есть запись — «band».' },
        { uz: "http://localhost:5173 dan kelgan so'rovga ruxsat ber (CORS).", ru: 'Разреши запросы с http://localhost:5173 (CORS).' },
        { uz: "Tekshirish uchun bandlar jadvalida {kun} kuni 17:00 va 20:00 namuna bandlari bo'lmasa — qo'sh; bor bo'lsa, qayta qo'shma.", ru: 'Для проверки: если в bandlar нет образцов на {kun} 17:00 и 20:00 — добавь; если есть, не добавляй повторно.' },
        { uz: 'Nima buzilmasin: sayt kodi va bandlar jadvalining ustunlari. Boshqa joyga tegma.', ru: 'Что не сломать: код сайта и столбцы таблицы bandlar. Больше ничего не трогай.' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "Backend terminali o'zi qayta yukladi, xato yo'q.", ru: 'Терминал Backend перезагрузился сам, ошибок нет.' }, err: XATO_YOLI },
      { h: { uz: 'Brauzerda tekshirish', ru: 'Проверка в браузере' }, t: { uz: "`localhost:3000/vaqtlar?kun=` ga o'z sanangizni qo'shib oching: olti katak, 17:00 va 20:00 — «band». Boshqa sanani yozing — hammasi «bo'sh».", ru: 'Откройте `localhost:3000/vaqtlar?kun=` со своей датой: шесть ячеек, 17:00 и 20:00 — «band». Впишите другую дату — все «bo\'sh».' } },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z g'oyangizga yozing: g'oyangizning birinchi ekrani Backend'dan qaysi ro'yxatni oladi? Uch qatorni to'ldiring.", ru: 'напишите этот промпт для своей идеи: какой список первый экран вашей идеи берёт из Backend? Заполните три строки.' }, forma: true }
    ]}
    natija={<BrauzerJson />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-07-start']}
    doneText={{ uz: "Backend tanlangan kunning kataklarini beradi, holatini Database'dan oladi.", ru: 'Backend отдаёт ячейки выбранного дня, а состояние берёт из Database.' }} />
);

const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · Sayt → Backend', ru: 'Практика 2 · Сайт → Backend' }}
    title={{ uz: <>Sayt kataklarni Backend'dan olsin, <span className="italic" style={{ color: T.accent }}>kun almashsin</span>.</>, ru: <>Пусть сайт берёт ячейки из Backend, <span className="italic" style={{ color: T.accent }}>день переключается</span>.</> }}
    mentor={{ uz: <>Endi «Nima buzilmasin» qatorini o'zingiz yozasiz — u agentga nimani saqlashni aytadi, tekshiruv esa baribir sizda. <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Теперь строку «Что не сломать» пишете сами — она говорит агенту, что сохранить, а проверка всё равно за вами. Начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "ikkala terminal ishlayapti (`npm run start:dev` va `web` da `npm run dev`). Brauzerda `localhost:5173` ni oching: kataklar hali faylda, kun almashtirgichi yo'q.", ru: 'оба терминала работают (`npm run start:dev` и `npm run dev` в `web`). Откройте в браузере `localhost:5173`: ячейки пока в файле, переключателя дня нет.' } },
      { h: QADAM_PROMPT, t: { uz: "`{nima buzilmasin}` joyini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'место `{что не сломать}` напишите сами, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: [
        a2Satr(TALAB_QATORLAR[0], { uz: ' (web/).', ru: ' (web/).' }),
        a2Satr(TALAB_QATORLAR[1], { uz: ' — http://localhost:3000/vaqtlar?kun=.', ru: ' — http://localhost:3000/vaqtlar?kun=.' }),
        { uz: "Kataklar ustida kun almashtirgichi bo'lsin: «‹» va «›» strelkalari, o'rtada kun nomi («Bugun», «Shanba»). Sahifa ochilganda — bugungi kun.", ru: 'Над ячейками пусть будет переключатель дня: стрелки «‹» и «›», посередине название дня («Bugun», «Shanba»). При открытии страницы — сегодняшний день.' },
        { uz: '«band» katak bosilmasin.', ru: 'Занятая ячейка («band») не нажимается.' },
        { uz: 'Nima buzilmasin: {nima buzilmasin}', ru: 'Что не сломать: {что не сломать}' }
      ], yordam: [
        { uz: "Nima buzilmasin: katak bosilganda kichrayib qaytishi, band bo'lganda rangi silliq o'zgarishi, «Band qilindi» belgisi va `vaqt-tanladi` hodisasi. Boshqa joyga tegma.", ru: 'Что не сломать: ячейка при нажатии сжимается и возвращается, при занятии плавно меняет цвет, значок «Band qilindi» и событие `vaqt-tanladi`. Больше ничего не трогай.' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "sayt o'zi yangilandi, terminalda xato yo'q.", ru: 'сайт обновился сам, в терминале нет ошибок.' }, err: XATO_YOLI },
      { h: { uz: 'Brauzerda tekshirish', ru: 'Проверка в браузере' }, t: { uz: "talabning har qatorini tekshiring: kataklar o'z joyida, ikkinchi ro'yxat yo'q · birinchi amaliyotda yozgan shanbangizni bosing — 17:00 va 20:00 band, boshqa kun — hammasi bo'sh · bo'sh katakni bosing — animatsiya darsidagidek jonlanadi. Mos kelmagan qatorni uch qism bilan agentga yozing.", ru: 'проверьте каждую строку требования: ячейки на своём месте, второго списка нет · нажмите субботу из первой практики — 17:00 и 20:00 заняты, другой день — все свободны · нажмите свободную ячейку — оживает, как на уроке анимации. Несовпавшую строку напишите агенту тремя частями.' } },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z g'oyangizga yozing: g'oyangizning birinchi ekrani ro'yxatni qanday ko'rsatadi va unda nima buzilmasin? Uch qatorni to'ldiring.", ru: 'напишите этот промпт для своей идеи: как первый экран вашей идеи показывает список и что в нём не должно сломаться? Заполните три строки.' }, forma: true }
    ]}
    natija={<MaydonMakA2 />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-07-done']}
    doneText={{ uz: "Kataklar Backend'dan keladi, kun almashadi — animatsiya va hodisa joyida.", ru: 'Ячейки приходят из Backend, день переключается — анимация и событие на месте.' }} />
);
// A2 o'ngi — dars maketining kattasi (bitta manba): Shanba, kun almashtirgichi ishlaydi, bo'sh katak jonlanadi
const MaydonMakA2 = () => {
  const [kun, setKun] = useState(1);
  return <MaydonMaket katta manba="backend" kun={kun} onKun={setKun} />;
};

const ScreenA3 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 3 · xato holati, tekshirish', ru: 'Практика 3 · состояние ошибки, проверка' }}
    title={{ uz: <>Backend javob bermasa, <span className="italic" style={{ color: T.accent }}>sayt buni aytsin</span>.</>, ru: <>Если Backend не отвечает, <span className="italic" style={{ color: T.accent }}>пусть сайт скажет об этом</span>.</> }}
    mentor={{ uz: <>Endi uch qatorni ham o'zingiz yozasiz, namuna «Yordam»da; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Теперь все три строки пишете сами, образец — в «Помощи»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: QADAM_OCHISH, t: { uz: "ikkala terminal ishlayapti, sayt kataklarni Backend'dan ko'rsatyapti.", ru: 'оба терминала работают, сайт показывает ячейки из Backend.' } },
      { h: QADAM_PROMPT, t: { uz: "vazifa: kataklar kelguncha «Yuklanmoqda…» chiqsin; Backend javob bermasa — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'задача: пока ячейки не пришли — «Yuklanmoqda…»; если Backend не отвечает — «Vaqtlarni yuklab bo\'lmadi. Birozdan keyin urinib ko\'ring.» Напишите три строки сами, нажмите «Скопировать», отправьте в Antigravity:' }, prompt: A3_JOY, yordam: [
        { uz: 'Qayerda: saytdagi vaqt kataklari joyi.', ru: 'Где: место ячеек времени на сайте.' },
        { uz: "Nima qilsin: kataklar kelguncha «Yuklanmoqda…» deb yozsin. Backend javob bermasa — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»", ru: 'Что сделать: пока ячейки не пришли, пусть пишет «Yuklanmoqda…». Если Backend не отвечает — «Vaqtlarni yuklab bo\'lmadi. Birozdan keyin urinib ko\'ring.»' },
        { uz: 'Nima buzilmasin: kun almashtirgichi, katak animatsiyasi va `vaqt-tanladi` hodisasi. Boshqa joyga tegma.', ru: 'Что не сломать: переключатель дня, анимация ячейки и событие `vaqt-tanladi`. Больше ничего не трогай.' }
      ] },
      { h: QADAM_ISHGA, t: { uz: "sayt o'zi yangilandi, terminalda xato yo'q.", ru: 'сайт обновился сам, в терминале нет ошибок.' }, err: XATO_YOLI },
      { h: { uz: 'Butun ekranni tekshirish', ru: 'Проверка всего экрана' }, t: { uz: "(1) Xato holatini ko'rish uchun Backend'ni ataylab to'xtating: terminalida Ctrl+C, sahifani yangilang — sayt «Vaqtlarni yuklab bo'lmadi» deydi; Backend'ni qayta yoqing (`npm run start:dev`). (2) Kunni almashtiring va bo'sh katakni bosing — animatsiya joyida. (3) Umami panelida `vaqt-tanladi` hodisasi soni oshgan.", ru: '(1) Чтобы увидеть ошибку, нарочно остановите Backend: в его терминале Ctrl+C, обновите страницу — сайт скажет «Vaqtlarni yuklab bo\'lmadi»; снова включите Backend (`npm run start:dev`). (2) Смените день и нажмите свободную ячейку — анимация на месте. (3) В панели Umami число событий `vaqt-tanladi` выросло.' } },
      { h: QADAM_GOYA, t: { uz: "shu promptni o'z g'oyangizga yozing: ma'lumot kelmasa, g'oyangizning birinchi ekrani nima deydi? Uch qatorni to'ldiring.", ru: 'напишите этот промпт для своей идеи: что скажет первый экран вашей идеи, если данные не пришли? Заполните три строки.' }, forma: true }
    ]}
    natija={<MaydonMaket katta manba="xato" kun={1} />} natijaYorliq={NATIJA_YORLIQ}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-07-done']}
    doneText={{ uz: "Birinchi ekran ishlaydi: kataklar Backend'dan keladi, Backend javob bermasa sayt buni aytadi.", ru: 'Первый экран работает: ячейки приходят из Backend, а если Backend не отвечает, сайт об этом сообщает.' }} />
);

// 🃏 KARTOCHKALAR (12) — alohida ekran sflash (F-1005-88), qolipdagi QKartochka (DE-204). Orqa tomon — oddiy matn (kod-belgisiz); old va izoh — fmtCode.
const KARTALAR = [
  { front: { uz: 'Talab nima?', ru: 'Что такое требование?' }, back: { uz: 'Promptdagi vazifa', ru: 'Задача в промпте' }, note: { uz: 'Bu darsda uch qism bilan: qayerda, nima qilsin, nima buzilmasin', ru: 'В этом уроке — из трёх частей: где, что сделать, что не сломать' } },
  { front: { uz: 'Talab bilan prompt bir narsami?', ru: 'Требование и промпт — одно и то же?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: 'Prompt — agentga xabar, talab — uning ichidagi vazifa', ru: 'Промпт — сообщение агенту, требование — задача внутри него' } },
  { front: { uz: "Talabda «qayerda» bo'lmasa, agent nima qiladi?", ru: 'Что сделает агент, если в требовании нет «где»?' }, back: { uz: 'Joyni boshqacha talqin qilishi mumkin', ru: 'Может понять место по-своему' }, note: { uz: "Masalan: kataklar ostida ikkinchi ro'yxat", ru: 'Например: второй список под ячейками' } },
  { front: { uz: '«Nima buzilmasin» nimani aytadi?', ru: 'Что говорит «Что не сломать»?' }, back: { uz: 'Agent nimaga tegmasligini — tekshiruv baribir sizda', ru: 'Что агенту не трогать — проверка всё равно за вами' }, note: { uz: 'Masalan: katak animatsiyasi va `vaqt-tanladi` hodisasi', ru: 'Например: анимация ячейки и событие `vaqt-tanladi`' } },
  { front: { uz: '«Chiroyli qil» — nega talab emas?', ru: 'Почему «сделай красиво» — не требование?' }, back: { uz: "Uni tekshirib bo'lmaydi", ru: 'Это нельзя проверить' }, note: { uz: "Agent nimani o'zgartirishni o'zi taxmin qiladi", ru: 'Агент сам гадает, что менять' } },
  { front: { uz: 'Bu loyiha talabida React yoki NestJS ni qayta yozish kerakmi?', ru: 'Нужно ли в требовании этого проекта снова писать React или NestJS?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: "Stack repo'da tanlangan", ru: 'Стек выбран в репо' } },
  { front: { uz: 'Agent «Tayyor» desa, nima qilasiz?', ru: 'Что делаете, если агент сказал «Готово»?' }, back: { uz: 'Talabning har qatorini tekshirasiz', ru: 'Проверяете каждую строку требования' }, note: { uz: 'Har qator — bitta tekshiruv', ru: 'Каждая строка — одна проверка' } },
  { front: { uz: 'Tekshiruvda qator mos kelmasa-chi?', ru: 'А если строка не совпала при проверке?' }, back: { uz: "Ko'rganingizni aniq yozib, tuzatishni so'raysiz", ru: 'Точно описываете увиденное и просите исправить' }, note: { uz: "«Ishlamayapti» emas — nima bo'ldi, nima bo'lsin", ru: 'Не «не работает» — что случилось и что должно быть' } },
  { front: { uz: 'Terminalda xato chiqsa, agentga nima yozasiz?', ru: 'Что пишете агенту, если в терминале ошибка?' }, back: { uz: '«Shu xato chiqdi: {xato}. Tuzat.»', ru: '«Вышла такая ошибка: {ошибка}. Исправь.»' }, note: { uz: 'Xatoning aniq matni bilan', ru: 'С точным текстом ошибки' } },
  { front: { uz: '`GET /vaqtlar?kun=2026-10-10` nima qaytaradi?', ru: 'Что возвращает `GET /vaqtlar?kun=2026-10-10`?' }, back: { uz: 'Shu kunning vaqt kataklari', ru: 'Ячейки времени этого дня' }, note: { uz: "Har biri: soat va holat — bo'sh yoki band", ru: 'Каждая: час и состояние — свободно или занято' } },
  { front: { uz: 'Katak band ekanini Backend qayerdan biladi?', ru: 'Откуда Backend знает, что ячейка занята?' }, back: { uz: 'bandlar jadvalidan', ru: 'Из таблицы bandlar' }, note: { uz: "Shu kun va soatda yozuv bo'lsa — band", ru: 'Если есть запись на этот день и час — занято' } },
  { front: { uz: 'Backend javob bermasa, sayt nima qiladi?', ru: 'Что делает сайт, если Backend не отвечает?' }, back: { uz: 'Buni aytadi', ru: 'Сообщает об этом' }, note: { uz: "«Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»", ru: '«Не удалось загрузить время. Попробуйте чуть позже.»' } }
];

// ===== KARTOCHKALAR — alohida ekran (F-1005-88: kartochka alohida ekran (P-058 dan farq, foydalanuvchi qarori)); 1-dars va skelet naqshi =====
// Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi — root'dagi FLASH_IDX / flashHidden.
// SABOQ 11: birinchi bosishgacha karta yuzi halqa + yengil puls bilan ajralib turadi; Mentor shu harakatni aytadi.
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* F-1005-91 (qaror B): Mentor jim (KORPUS §61); ko'rsatma karta ostida, birinchi bosishgacha */}
        <div className={`mf-flash ${bosildi ? '' : 'yangi'}`} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: tr(c.back), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="mf-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Keyingi dars» qatori; kartochkalar alohida ekranda (F-1005-88); uyga vazifa yo'q (172.4). CODE STRIKE va arena — darsda =====
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
  const RECAP = [
    { uz: 'Agentga vazifani uch qism bilan yozasiz: qayerda, nima qilsin, nima buzilmasin', ru: 'Пишете агенту задачу тремя частями: где, что сделать, что не сломать' },
    { uz: 'Agent «Tayyor» desa ham, talabning har qatorini tekshirasiz', ru: 'Даже если агент сказал «Готово», проверяете каждую строку требования' },
    { uz: "Mos kelmagan joyni aniq yozib, tuzatishni so'raysiz", ru: 'Несовпавшее место точно описываете и просите исправить' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Loyiha kuni tugadi', ru: 'День проекта завершён' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Birinchi ekran ishlayapti: <span className="italic" style={{ color: T.accent }}>talab bo'yicha tekshirildi</span>.</>, ru: <>Первый экран готов: <span className="italic" style={{ color: T.accent }}>проверен по требованию</span>.</> })}
        cta={<>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      >
        <p className="next-lesson fade-up d4">{tr({ uz: <>Keyingi dars — <b>«Yaxshi interfeysdan nimani olasiz?»</b>: bitta yaxshi namuna tanlab, animatsiyalarni agent orqali qo'shasiz.</>, ru: <>Следующий урок — <b>«Что взять из хорошего интерфейса?»</b>: выберете один хороший образец и добавите анимации через агента.</> })}</p>
      </QYakun>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function MvpFirstScreenLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen3, Screen4, ScreenA2, Screen5, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === «MAYDON» SAYT MAKETI — darsning bitta vizuali (MaydonMaket). Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .mf-sayt { position: relative; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; min-width: 0; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.22); }
        .mf-sayt-bar { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; min-width: 0; }
        .mf-sayt-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; flex-shrink: 0; }
        .mf-sayt-bar span { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 2px 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .mf-sayt-tana { position: relative; flex: 1 1 auto; padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 11px; }
        .mf-bosh { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 30px; flex-wrap: wrap; }
        .mf-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 16px; color: ${T.ink}; }
        .mf-kun { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 30px; }
        .mf-kun.bosh { width: 150px; border: 1.5px dashed ${T.line}; border-radius: 9px; }
        .mf-kun-n { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; color: ${T.ink}; min-width: 70px; text-align: center; animation: q-kir 0.25s ease-out; }
        .mf-strelka { width: 26px; height: 26px; border-radius: 7px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-size: 15px; font-weight: 700; line-height: 1; cursor: pointer; padding: 0; }
        .mf-strelka:hover:not(:disabled) { border-color: ${T.accent}; color: ${T.accent}; }
        .mf-strelka:disabled { color: ${T.line}; cursor: default; }
        .mf-kataklar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .mf-katak { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; min-height: 40px; padding: 5px 4px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: transform 0.16s ease, background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }
        .mf-katak:hover:not(:disabled) { border-color: ${T.ink2}; }
        .mf-katak.band { background: ${T.line}; border-color: ${T.line}; color: ${T.ink2}; cursor: not-allowed; }
        .mf-katak small { font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 700; }
        .mf-katak.bos { transform: scale(0.9); border-color: ${T.accent}; }
        .mf-kataklar.rang .mf-katak:not(.band) { background: ${T.accentSoft}; border-color: ${T.accent}; }
        ul.mf-royxat { list-style: disc; margin: 0; padding: 3px 8px 3px 24px; columns: 3; column-gap: 22px; font-family: 'Source Serif 4', serif; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .mf-holat-q { display: flex; align-items: center; justify-content: space-between; gap: 8px 12px; flex-wrap: wrap; padding: 6px 12px; border-top: 1px solid ${T.line}; background: ${T.bg}; }
        .mf-holat-q .mf-joy { padding: 1px 5px; border-radius: 6px; }
        .mf-holat { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .mf-holat.err { color: ${T.err}; font-weight: 700; }
        .mf-sanoq { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .mf-sanoq.yangi { color: ${T.accent}; animation: q-kir 0.3s ease-out; }
        .mf-joy { position: relative; border-radius: 11px; transition: box-shadow 0.3s ease; }
        .mf-joy.err { box-shadow: 0 0 0 2px ${T.err}; }
        .mf-joy.err > ul.mf-royxat { padding-top: 9px; } /* qizil yorliq birinchi qator ustiga tushmasin (layout D, modul tekshiruvi 05.10) */
        .mf-joy.on { box-shadow: 0 0 0 2px ${T.accent}; }
        .mf-joy.ok { animation: mf-tuzaldi 1.8s ease-out forwards; }
        @keyframes mf-tuzaldi { 0%, 45% { box-shadow: 0 0 0 2px ${T.ok}; } 100% { box-shadow: 0 0 0 2px transparent; } }
        .mf-joy-l { position: absolute; top: -10px; left: 10px; z-index: 1; background: ${T.paper}; color: ${T.err}; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; line-height: 1.25; padding: 1px 7px; border-radius: 6px; box-shadow: 0 0 0 1.5px ${T.err}; white-space: nowrap; animation: q-kir 0.25s ease-out; }
        .mf-jarayon { position: absolute; top: 10px; right: 12px; z-index: 2; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 10px; }
        .mf-jarayon::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}; animation: mf-puls 0.8s ease-in-out infinite; }
        @keyframes mf-puls { 50% { opacity: 0.25; } }
        p.mf-xabar { margin: 0; padding: 22px 14px; border-radius: 10px; background: ${T.errFon}; color: ${T.ink}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 14px; line-height: 1.45; text-align: center; }
        .mf-sayt.katta .mf-sayt-tana { padding: 14px 16px 18px; gap: 14px; }
        .mf-sayt.katta .mf-nom { font-size: 20px; }
        .mf-sayt.katta .mf-kun-n { font-size: 16px; }
        .mf-sayt.katta .mf-katak { min-height: 52px; font-size: 16px; }
        /* Kirish: agent chati */
        .mf-hook { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .mf-chat { display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 1px solid ${T.line}; border-radius: 14px; background: ${T.bg}; }
        p.mf-pufak { margin: 0; max-width: 88%; padding: 6px 11px; border-radius: 12px; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 500; line-height: 1.4; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; }
        p.mf-pufak.siz { align-self: flex-end; border-bottom-right-radius: 4px; }
        p.mf-pufak.agent { align-self: flex-start; border-bottom-left-radius: 4px; }
        p.mf-pufak.yoz { color: ${T.ink2}; font-style: italic; }
        p.mf-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink2}; }
        /* 2 va 4-ekran: prompt va talab kartalari */
        p.mf-pq { margin: 0; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        p.mf-pq.bosh, p.mf-pq.tola { padding: 5px 9px; border-radius: 8px; border: 1.5px dashed ${T.line}; transition: border-color 0.25s ease, background 0.25s ease; }
        p.mf-pq.bosh .mf-qism { color: ${T.ink2}; }
        p.mf-pq.kutadi { border-color: ${T.accent}; background: ${T.accentSoft}; }
        p.mf-pq.tola { border-style: solid; border-color: transparent; background: ${T.bg}; }
        p.mf-pq.tola .mf-pq-m { animation: q-kir 0.3s ease-out; }
        .mf-pq-m { flex: 1 1 0; min-width: 0; }
        @media (max-width: 520px) { .mf-pq-m { flex-basis: 100%; } }
        .mf-bk > .q-xato { font-size: 13.5px; }
        .mf-qism { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.accent}; white-space: nowrap; }
        /* 2-ekran: bo'lak kartasi (F-1005-84) — bittadan chiqadi; «Qo'shish» bilan o'z qatoriga uchadi, tuzoq «Kerak emas» bilan chetga so'nadi */
        .mf-bk-w { animation: q-kir 0.3s ease-out; }
        @media (max-width: 640px) { .mf-bk-w { margin-bottom: 64px; scroll-margin-bottom: 64px; } } /* telefonda pastki chapdagi ⌂/UZ/RU tugmalari karta tugmasini yopmasin */
        .mf-bk { gap: 9px; transition: border-color 0.2s ease, background 0.2s ease; }
        .mf-bk.silk { animation: q-silk 0.32s ease-in-out; }
        .mf-bk.ket { animation: mf-ket 0.42s ease-in forwards; }
        @keyframes mf-ket { to { opacity: 0; transform: translateX(56px) rotate(2deg); } }
        .mf-bk.uch { border-color: transparent; background: transparent; }
        .mf-bk.uch > :not(.mf-bk-m) { opacity: 0; transition: opacity 0.2s ease; }
        .mf-bk-s { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink2}; }
        p.mf-bk-m { margin: 0; position: relative; z-index: 3; transform-origin: 0 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(16px,1.9vw,18px); line-height: 1.4; color: ${T.ink}; transition: transform 0.55s cubic-bezier(.45,0,.2,1); }
        .mf-bk-t { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 2px; }
        .mf-bk-t > .q-btn { flex: 1 1 130px; align-self: stretch; }
        .mf-bk-t > .q-btn.q-2:disabled { opacity: 0.45; border-color: ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-weight: 700; font-size: clamp(13.5px,1.5vw,14.5px); padding: 10px 18px; }
        /* SABOQ 11: tanlangan bashorat — ixcham qator, natija chiqquncha turadi */
        .mf-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; animation: q-kir 0.3s ease-out; }
        .mf-taxmin-s { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .mf-taxmin-j { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 9px; padding: 3px 11px; }
        /* SABOQ 11 (F-1005-85/87): navbatdagi bosiladigan element — halqa doim, yengil puls; kam harakat rejimida puls o'chadi, halqa qoladi */
        .mf-navbat { box-shadow: 0 0 0 2px ${T.accent}; animation: mf-navbat 1.6s ease-out infinite; }
        @keyframes mf-navbat { 0% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 2px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 12px ${fon(T.accent, 0)}; } }
        .mf-navbat-k > .q-bashorat { box-shadow: 0 0 0 2px ${T.accent}; animation: mf-navbat 1.6s ease-out infinite; }
        .q-kirish:has(.mf-hook.tanla) .q-variantlar-kol { border-radius: 14px; box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}; animation: mf-navbat-g 1.6s ease-out infinite; }
        @keyframes mf-navbat-g { 0% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 19px ${fon(T.accent, 0)}; } }
        .mf-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: mf-navbat-fc 1.6s ease-out infinite; }
        @keyframes mf-navbat-fc { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        .mf-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .mf-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: mf-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes mf-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        .mf-talab { gap: 8px; }
        .mf-talab .q-chip.mf-tq { display: flex; align-items: flex-start; gap: 9px; width: 100%; }
        .mf-tq-n { font-style: normal; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; border: 1.5px solid currentColor; }
        p.mf-tq-s { margin: 0; display: flex; align-items: baseline; gap: 8px; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .mf-tq-ok { font-style: normal; font-weight: 800; color: ${T.ok}; }
        .mf-tuzat { display: flex; flex-direction: column; gap: 10px; }
        .mf-tuzat-s { display: flex; flex-direction: column; gap: 3px; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 11px; padding: 10px 12px; }
        p.mf-tuzat-q { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink}; overflow-wrap: anywhere; }
        .mf-natija { display: flex; flex-direction: column; gap: 6px; }
        p.mf-joriy { margin: 0; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.5; color: ${T.ink}; }
        .mf-fokus2 { display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: clamp(14px,2.4vw,24px); align-items: start; }
        @media (max-width: 760px) { .mf-fokus2 { grid-template-columns: minmax(0,1fr); } }
        /* Amaliyot bloki: brauzer JSON (a1), 5-qadam formasi, «Yordam» */
        pre.mf-json { margin: 0; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink}; white-space: pre; overflow-x: auto; }
        .mf-goya { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .mf-goya-q { display: grid; grid-template-columns: 124px minmax(0,1fr); align-items: start; gap: 8px; }
        .mf-goya-l { padding-top: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; line-height: 1.3; color: ${T.ink2}; }
        .mf-goya textarea { display: block; width: 100%; min-height: 36px; resize: vertical; font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 9px; padding: 7px 10px; }
        .mf-goya > .q-btn { padding: 6px 12px; font-size: 12.5px; }
        @media (max-width: 520px) { .mf-goya-q { grid-template-columns: minmax(0,1fr); gap: 3px; } .mf-goya-l { padding-top: 0; } }
        .mf-goya textarea:focus { outline: none; border-color: ${T.accent}; background: ${T.paper}; }
        .q-blok-q.joriy:has(.mf-goya[data-tola="0"]) > .q-blok-tana > .q-btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .mf-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .mf-yordam-s { display: block; padding: 7px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .q-blok-xato .q-btn.mf-yordam-btn { padding: 5px 12px; font-size: 12.5px; }
        /* Yakun: «Keyingi dars» nishonlardan oldin (MD tartibi; QYakun children oxirida chiziladi). Kartochkalar — alohida ekran (F-1005-88) */
        .q-yakun > .ach-coll { order: 1; }
        p.next-lesson { margin: 0; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
        p.next-lesson b { color: ${T.ink}; }
        .rc-ic .mf-rc-kod { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(13px,2vw,18px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; padding: 10px 16px; border-radius: 10px; overflow-wrap: anywhere; }
        @media (prefers-reduced-motion: reduce) {
          .mf-katak { transition: background 0.35s ease, color 0.35s ease; }
          .mf-katak.bos { transform: none; background: ${T.accentSoft}; }
          .mf-joy.ok { animation: none; box-shadow: none; }
          .mf-jarayon::before, .mf-kun-n, .mf-sanoq.yangi, .mf-joy-l { animation: none; }
          .mf-navbat, .mf-navbat-k > .q-bashorat, .q-kirish:has(.mf-hook.tanla) .q-variantlar-kol, .mf-flash.yangi .fc-card:not(.flip) .fc-front, .mf-fc-ipucha i { animation: none; }
          .mf-bk-w, .mf-bk.silk, .mf-bk.ket, .mf-taxmin, p.mf-pq.tola .mf-pq-m { animation: none; }
          p.mf-bk-m { transition: none; }
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
