import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) 4-dars «Loyiha kuni: demo uchun sayqal» — MD: feedback/F-1008-14modul/04-PolishDay-v3.md (+ 04-FILTR.md), skelet src/skelet/NamunaDars.jsx dan (08.10.2026, F-1008-595).
// 12 ekran: kirish · reja · tushuncha (oldin/keyin) · amaliyot 1 · 1-savol · tushuncha (harakatni kamaytirish) · amaliyot 2 · 2-savol · amaliyot 3 · podium · kartochkalar · yakun.
// Bitta vizual — «demo yo'li sahnasi» (SayqalSahna: Brauzer + IlovaEkran + DemoChiziq, bitta manba SAYQAL_SAHNA). Demo mavzusi — Mentorning o'z mahsuloti «Maydon Jamoa».
// Yangi saqlash kaliti YO'Q (tayanch 8): o'qiydi pm-m9d8-platforma.trek; trek tanlovi, blok holati, tekshiruv kartalari — dars holatida (ccProgress).
// qolip-maket: sq-qoshil sq-oyinlar sq-oldin sq-keyin sq-kalit
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm12-04-v1', lessonTitle: { uz: "Loyiha kuni: demo uchun sayqal", ru: 'День проекта: шлифовка для демо' } }; // 14-Modul 4-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/04-PolishDay-v3.md
// 12 ekran (MD KOD 1) · ballik testlar 4 va 7 · bloklar 3, 6, 8 (practice: -1) · final tartib-mashqi yo'q (loyiha kuni)
const HW_TOKENS = [
  { t: { uz: 'sayqal', ru: 'шлифовка' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'joy egallovchi', ru: 'заполнитель' }, l: 64, tp: 16, s: 12, d: 7.5 },
  { t: 'Slow 4G', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: '8 / 10', l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'a3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
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
const INLINE_KEYS = { s4: 2, s7: 1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: koddan bitta qator yoki raqam)
const rcKod = (s) => <code className="qcode">{s}</code>;
const rcRaqam = (n) => <b className="py-rc-n">{n}</b>;
const RECAPS = {
  4: {
    title: { uz: 'Bosish javobi', ru: 'Ответ на нажатие' },
    cards: [
      { ic: null, h: { uz: "Tugma bosilishi bilan yozuvini o'zgartiradi.", ru: 'Кнопка меняет надпись сразу при нажатии.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: "Javob kelguncha u o'chiq — qayta bosilmaydi.", ru: 'До ответа она неактивна — повторно не нажимается.' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: "Javob kelgach — yakuniy holat, masalan «Qo'shildingiz».", ru: 'После ответа — итоговое состояние, например «Qo\'shildingiz».' }, body: { uz: rcRaqam(3), ru: rcRaqam(3) }, ask: { uz: 'Demo paytida tugma jim tursa, siz nima qilgan bo\'lardingiz?', ru: 'Что бы вы сделали, если бы во время демо кнопка замерла?' } }
    ]
  },
  7: {
    title: { uz: 'Harakat kamaytirilsa', ru: 'Если уменьшить движение' },
    cards: [
      { ic: null, h: { uz: "Bu demo yo'lida harakat o'chadi: aylanish va kattalashish.", ru: 'На этом пути демо движение выключается: вращение и увеличение.' }, body: { uz: rcRaqam(1), ru: rcRaqam(1) } },
      { ic: null, h: { uz: 'Holat qoladi: yozuv, kulrang kartalar, yangi son.', ru: 'Состояние остаётся: надпись, серые карточки, новое число.' }, body: { uz: rcRaqam(2), ru: rcRaqam(2) } },
      { ic: null, h: { uz: "Saytda buni ko'rsatadi", ru: 'Сайту это показывает' }, body: { uz: rcKod('prefers-reduced-motion'), ru: rcKod('prefers-reduced-motion') }, ask: { uz: 'Harakat kamaytirilganda tugma yozuvi nega qolishi kerak?', ru: 'Почему при уменьшении движения надпись кнопки должна остаться?' } }
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

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, vizual, storedAnswer, onAnswer, onNext, onPrev }) => {
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
            {/* MD: javob topilgach — kichik vizual (savol ostida, SABOQ 4) */}
            {vizual && (isMentorLive ? mReveal : (solved && !waiting)) && vizual}
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

// ===== 14-Modul 4-dars yordamchilari (py- prefiksi: global .mentor va boshqa darslar bilan to'qnashmaydi) =====
const cx = (...a) => a.filter(Boolean).join(' ');
const tx = (o) => fmtCode(tr(o));
const halqa = (on) => (on ? 'py-halqa' : undefined);
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ketma-ket sahna qadamlari: [[kechikish ms, fn], …]; ekran yopilsa taymerlar tozalanadi; reduced-motion — holatlar qisqa kechikish bilan almashadi (DE-200)
function useKetma() {
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    const kam = kamHarakat();
    let t = 0;
    qadamlar.forEach(([ms, fn]) => { t += kam ? Math.min(ms, 400) : ms; tm.current.push(setTimeout(fn, t)); });
  }, []);
}
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
const Bo = ({ on, className, children, ...p }) => (on ? <button type="button" className={className} onClick={on} {...p}>{children}</button> : <span className={className}>{children}</span>);

// Bashorat: tanlangach yopilmaydi — ixcham qator natijagacha turadi (SABOQ 11); variantlar — har birining o'z yengil chegarasi (E 40)
const BASH_YORLIQ = { uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' };
const Bashorat = ({ savol, variantlar, tanlov, onTanla }) => (tanlov == null
  ? <div className="py-chorla"><QBashorat yorliq={tr(BASH_YORLIQ)} savol={tr(savol)} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : <div className="py-bash-ix fade-step"><span className="py-bash-l">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span>{tr(savol)}</span><b>{tr((variantlar.find(v => v.k === tanlov) || {}).t)}</b></div>);
// Taxmin natijasi — yashil xulosaning birinchi kichik qatori; QIzoh — oxirgi kichik qatori (E 42)
const Natija = ({ togri, haqiqat }) => (togri
  ? <span className="py-x-tx ok">{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></span>
  : <span className="py-x-tx">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{tx(haqiqat)}</b></span>);
const XulosaQ = ({ natija, matn, izoh }) => <>{natija}<span className="py-x-m">{matn}</span>{izoh && <span className="py-x-iz">{izoh}</span>}</>;
const navYorliq = (taxmin, q, jami, done, harakat) => (done ? { uz: 'Davom etish', ru: 'Продолжить' }
  : !taxmin ? { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' }
    : { uz: `${harakat.uz} (${q}/${jami})`, ru: `${harakat.ru} (${q}/${jami})` });
const NomQator = ({ matn }) => (matn ? <p className="py-nom fade-step">{tx(matn)}</p> : null);
const Ustoz = ({ satrlar }) => (useMentorLive() ? <div className="py-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div> : null);

// ===== BITTA VIZUAL — «demo yo'li sahnasi» (SayqalSahna, 163/180): bitta manba SAYQAL_SAHNA; ekranlar, bloklar o'ngi va testlar shundan o'qiydi =====
// Demo mavzusi — Mentorning o'z mahsuloti «Maydon Jamoa» (MD, tayanch 1.0, 1.4); sahnadagi yagona son — namuna o'yin «8 / 10» → «9 / 10» (1.14).
const MAYDON_RANG = '#2E9E4F'; // «Maydon Jamoa» nomi — 11-Modul 9.62 yashili (9–13-Modul darslaridagi rang bilan bir), logotipsiz
const SAYQAL_SAHNA = {
  nom: 'Maydon Jamoa',
  yorliq: { uz: 'laptop · proyektorga', ru: 'ноутбук · на проектор' },
  misol: { uz: 'Mentor misoli · Maydon Jamoa', ru: 'Пример Ментора · Maydon Jamoa' },
  manzil: 'maydon-jamoa-….netlify.app',
  sekin: { uz: 'Backend sekin javob beradi — namuna', ru: 'Backend отвечает медленно — образец' },
  oyinlar: { uz: "O'yinlar", ru: 'Игры' },
  orqaga: { uz: "‹ O'yinlar", ru: '‹ Игры' },
  kun: { uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' },
  joy: { uz: 'Mahalla maydoni', ru: 'Площадка махалли' },
  son: ['8 / 10', '9 / 10'],
  rejim: { oldin: { uz: 'Oldin', ru: 'До' }, keyin: { uz: 'Keyin', ru: 'После' } }
};
const KUTISH_YOZUVI = { uz: "O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.", ru: 'Игры загружаются — это может занять до минуты.' }; // 11-Modul 9.95 aynan
const TUGMA_YOZUVLARI = {
  qoshilaman: { uz: "Qo'shilaman", ru: 'Присоединяюсь' },
  qoshilmoqda: { uz: "Qo'shilmoqda…", ru: 'Присоединение…' },
  qoshildingiz: { uz: "Qo'shildingiz", ru: 'Вы присоединились' }
};
const DEMO_YOLI = [
  { id: 'yuklanish', t: { uz: 'yuklanish', ru: 'загрузка' }, oldin: { uz: "ro'yxat o'rni bo'sh turdi", ru: 'место списка пустовало' }, keyin: { uz: "nima kelishi ko'rindi", ru: 'видно, что придёт' } },
  { id: 'bosish', t: { uz: 'bosish', ru: 'нажатие' }, oldin: { uz: "bosilgani ko'rinmadi", ru: 'нажатие не было видно' }, keyin: { uz: "bosilgani ko'rindi", ru: 'нажатие видно' } },
  { id: 'muvaffaqiyat', t: { uz: 'muvaffaqiyat', ru: 'успех' }, oldin: { uz: 'son birdan almashdi', ru: 'число сменилось рывком' }, keyin: { uz: "o'zgarish ko'rindi", ru: 'изменение видно' } }
];
const HARAKAT_HOLAT = [
  { id: 'kartalar', t: { uz: 'kulrang kartalar', ru: 'серые карточки' }, h: 'qoldi', q: 1 },
  { id: 'aylanish', t: { uz: 'kutish belgisi aylanishi', ru: 'вращение значка ожидания' }, h: 'ochdi', q: 2 },
  { id: 'yozuv', t: { uz: "Qo'shilmoqda… yozuvi", ru: 'надпись «Присоединение…»' }, h: 'qoldi', q: 2 },
  { id: 'kattalash', t: { uz: 'son kattalashishi', ru: 'увеличение числа' }, h: 'ochdi', q: 2 },
  { id: 'son', t: { uz: '9 / 10', ru: '9 / 10' }, h: 'qoldi', q: 2 }
];
const HOLAT_Y = { ochdi: { uz: "o'chdi", ru: 'выключено' }, qoldi: { uz: 'qoldi', ru: 'осталось' } };
const ALL_YASHIL = { yuklanish: 'yashil', bosish: 'yashil', muvaffaqiyat: 'yashil' };

const Spin = () => <i className="py-spin" aria-hidden="true" />;
const KulKarta = ({ sonadi }) => <span className={cx('py-kk', sonadi && 'sonadi')} aria-hidden="true"><i /><i /><i className="o" /></span>;
const OyinKarta = ({ yangi, bosish, bosK }) => (
  <span className={cx('py-ok', yangi && 'yangi')}>
    <span className="py-ok-m"><b>{tr(SAYQAL_SAHNA.kun)}</b><span>{tr(SAYQAL_SAHNA.joy)}</span></span>
    <b className="py-ok-s">{SAYQAL_SAHNA.son[0]}</b>
    {bosish && <i key={bosK} className="py-bos" aria-hidden="true" />}
  </span>
);
// Ilova ekrani (telefon kengligida, brauzer ko'rinishi): «O'yinlar» yoki «O'yin». royxat: bosh · kulrang · almash · karta · tinch (ochilmagan)
const IlovaEkran = ({ ekran = 'oyin', royxat = 'karta', tugma = 'qoshilaman', son = 0, pop = false, spin = true, bosish = null, bosK = 0, onQoshil, qoshilHalqa, izoh, royxatIzoh, kichik }) => (
  <div className={cx('py-app', kichik && 'kichik')}>
    <span className="py-app-bar"><b style={{ color: MAYDON_RANG }}>{SAYQAL_SAHNA.nom}</b></span>
    {ekran === 'oyinlar'
      ? <div className="py-app-t">
        <b className="py-app-h">{tr(SAYQAL_SAHNA.oyinlar)}</b>
        <span className={cx('py-royxat', royxat === 'tinch' && 'tinch')}>
          {royxat === 'kulrang' && <><KulKarta /><KulKarta /></>}
          {royxat === 'almash' && <><OyinKarta yangi bosish={bosish === 'karta'} bosK={bosK} /><KulKarta sonadi /></>}
          {(royxat === 'karta' || royxat === 'tinch') && <OyinKarta yangi={royxat === 'karta'} bosish={bosish === 'karta'} bosK={bosK} />}
          {(royxat === 'bosh' || royxat === 'kulrang') && <span className="py-kutish">{tr(KUTISH_YOZUVI)}</span>}
          {royxatIzoh && <span className="py-app-iz fade-step">{tr(royxatIzoh)}</span>}
        </span>
      </div>
      : <div className="py-app-t">
        <span className="py-orqa">{tr(SAYQAL_SAHNA.orqaga)}</span>
        <span className="py-oyin-m"><b>{tr(SAYQAL_SAHNA.kun)}</b><span>{tr(SAYQAL_SAHNA.joy)}</span></span>
        <b key={'s' + son + (pop ? 'p' : '')} className={cx('py-son', pop && 'pop')}>{SAYQAL_SAHNA.son[son]}</b>
        <Bo on={onQoshil} className={cx('py-tugma sq-qoshil', tugma, halqa(qoshilHalqa))}>
          {spin && tugma === 'qoshilmoqda' && <Spin />}{tr(TUGMA_YOZUVLARI[tugma])}
          {bosish === 'tugma' && <i key={bosK} className="py-bos" aria-hidden="true" />}
        </Bo>
        {izoh}
      </div>}
  </div>
);
// Brauzer oynasi (o'lcham barqaror) — ramka ustida yorliqlar, ichida telefon kengligidagi ilova
const Brauzer = ({ chap, ong = SAYQAL_SAHNA.yorliq, ost, children, sinf }) => (
  <div className={cx('py-br-ust', sinf)}>
    {(chap || ong) && <span className="py-br-y"><span>{chap ? tr(chap) : ''}</span><span>{ong ? tr(ong) : ''}</span></span>}
    <div className="py-br">
      <span className="py-br-bar"><i /><i /><i /><code>{SAYQAL_SAHNA.manzil}</code></span>
      <div className="py-br-tana">{children}</div>
    </div>
    {ost}
  </div>
);
// Demo yo'li chizig'i — uch nuqta, ekranlar tartibida; kulrang (ko'rilmagan) → qizil (jim) → yashil (javob beradi)
const DemoChiziq = ({ holat = {} }) => (
  <div className="py-dy">
    {DEMO_YOLI.map(d => {
      const h = holat[d.id] || 'kul';
      return (
        <span key={d.id} className={cx('py-dy-n', h)}>
          <i className="py-dy-d">{h === 'yashil' ? '✓' : h === 'qizil' ? '✕' : ''}</i>
          <b>{tr(d.t)}</b>
          {h !== 'kul' && <span className="py-dy-y fade-step">{tr(h === 'yashil' ? d.keyin : d.oldin)}</span>}
        </span>
      );
    })}
  </div>
);
const Rejim = ({ rejim, onKeyin }) => (
  <span className="py-rejim">
    <span className={cx('py-rj sq-oldin', rejim === 'oldin' && 'on')}>{tr(SAYQAL_SAHNA.rejim.oldin)}</span>
    <Bo on={onKeyin} className={cx('py-rj sq-keyin', rejim === 'keyin' && 'on', !onKeyin && rejim !== 'keyin' && 'xira', halqa(!!onKeyin))}>{tr(SAYQAL_SAHNA.rejim.keyin)}</Bo>
  </span>
);
const Kalit = ({ on, onYoq, kichik }) => (
  <Bo on={onYoq} className={cx('py-kalit sq-kalit', on && 'on', halqa(!!onYoq), kichik && 'kichik')}><i className="py-sw" aria-hidden="true" /><span>{tr({ uz: 'Harakatni kamaytirish', ru: 'Уменьшить движение' })}</span></Bo>
);
const HolatJadval = ({ muhr = {} }) => (
  <div className="py-hj">
    <span className="py-hj-b"><b>{tr({ uz: 'Harakat', ru: 'Движение' })}</b><b>{tr({ uz: 'Holat', ru: 'Состояние' })}</b></span>
    {HARAKAT_HOLAT.map(r => {
      const m = muhr[r.id];
      return <span key={r.id} className={cx('py-hj-q', m)}><span>{tr(r.t)}</span><span className="py-hj-m">{m && <b className="fade-step">{m === 'qoldi' ? '✓ ' : ''}{tr(HOLAT_Y[m])}</b>}</span></span>;
    })}
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish): «Oldin» holatidagi «O'yin» — «Qo'shilaman» → bosish nuqtasi → ekran jim → son va tugma birdan; ballsiz (J-026) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Tugmaning yozuvi o'zgardi", ru: 'Изменилась надпись кнопки' } },
  { id: 'b', label: { uz: 'Kutish belgisi chiqdi', ru: 'Появился значок ожидания' } },
  { id: 'c', label: { uz: "Avval hech narsa o'zgarmadi", ru: 'Сначала ничего не изменилось' } }
];
const HOOK_JAVOB = {
  c: { uz: <><b>Aynan!</b> Bir lahza ekran jim turdi: bosilgani ham, kutish ham ko'rinmadi — son keyin birdan almashdi.</>, ru: <><b>Именно!</b> На мгновение экран замер: не было видно ни нажатия, ни ожидания — потом число сменилось рывком.</> },
  a: { uz: <><b>Qiziq fikr!</b> Tugma faqat son almashganda o'zgardi — undan oldin u avvalgidek turdi.</>, ru: <><b>Интересная мысль!</b> Кнопка изменилась только вместе с числом — до этого она стояла как прежде.</> },
  b: { uz: <><b>Qiziq fikr!</b> Kutish belgisi chiqmadi — ekran javob kelguncha bir xil turdi.</>, ru: <><b>Интересная мысль!</b> Значок ожидания не появился — экран не менялся, пока не пришёл ответ.</> }
};
const JimChiziq = () => (
  <span className="py-jim fade-step">
    <span className="py-jim-n">{tr({ uz: 'bosildi', ru: 'нажато' })}</span>
    <span className="py-jim-o">{tr({ uz: "ekranda o'zgarish yo'q", ru: 'на экране без изменений' })}</span>
    <span className="py-jim-n">{tr({ uz: "son o'zgardi", ru: 'число изменилось' })}</span>
  </span>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const [k, setK] = useState(avval ? 'tugadi' : 'bosh'); // bosh · jim · tugadi
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [bosK, setBosK] = useState(0);
  const [sc, setSc] = useState(0);
  const ketma = useKetma();
  const bos = () => { if (k !== 'bosh') return; setK('jim'); setBosK(n => n + 1); ketma([[1500, () => { setK('tugadi'); setSc(n => n + 1); }]]); };
  const pick = (v) => { if (picked !== null || k !== 'tugadi') return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const nav = k !== 'tugadi' ? { uz: 'Avval tugmani bosing', ru: 'Сначала нажмите кнопку' } : picked === null ? { uz: 'Bittasini tanlang', ru: 'Выберите один вариант' } : { uz: 'Davom etish', ru: 'Продолжить' };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'День проекта · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext disabled={picked === null} label={tr(nav)} onClick={onNext} />}>
      <div className={cx('py-kirish', k === 'tugadi' && picked === null && 'faol')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Tugmani bosgach, ekranda <span className="italic" style={{ color: T.accent }}>birinchi nima o'zgardi?</span></>, ru: <>Что первым <span className="italic" style={{ color: T.accent }}>изменилось на экране</span> после нажатия кнопки?</> })}
          mentor={<Mentor>{picked === null
            ? tr({ uz: "Hakam demoni proyektorda kuzatadi — sahnadagi «Qo'shilaman»ni bosing va ekranga qarang.", ru: 'Судья смотрит демо на проекторе — нажмите «Присоединяюсь» на сцене и смотрите на экран.' })
            : tr({ uz: "Bugun hakam ko'radigan shunday joylar bilan ishlaysiz — «Davom etish»ni bosing.", ru: 'Сегодня вы работаете с такими местами, которые видит судья, — нажмите «Продолжить».' })}</Mentor>}
          maket={<Brauzer chap={SAYQAL_SAHNA.misol} ost={picked !== null && <JimChiziq />}>
            <IlovaEkran ekran="oyin" tugma={k === 'tugadi' ? 'qoshildingiz' : 'qoshilaman'} son={k === 'tugadi' ? 1 : 0}
              bosish={k === 'jim' ? 'tugma' : null} bosK={bosK} onQoshil={k === 'bosh' ? bos : undefined} qoshilHalqa={k === 'bosh'} />
          </Brauzer>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={k !== 'tugadi'}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Keyin» holatidagi demo yo'li bir marta o'zi yuradi (DE-200), o'ngda bugungi uch ish =====
const REJA = [
  { uz: "Bosish: tugma bosilishi bilan o'zgaradi", ru: 'Нажатие: кнопка меняется сразу при нажатии' },
  { uz: "Yuklanish: ro'yxat o'rnida kulrang kartalar", ru: 'Загрузка: серые карточки на месте списка' },
  { uz: "Muvaffaqiyat: son kichik harakat bilan o'zgaradi", ru: 'Успех: число меняется с небольшим движением' }
];
const RejaSahna = () => {
  const [s, setS] = useState({ ekran: 'oyinlar', royxat: 'kulrang', tugma: 'qoshilaman', son: 0, pop: false, bosish: null, bosK: 0 });
  const [dots, setDots] = useState({});
  const ketma = useKetma();
  const set = (o) => setS(p => ({ ...p, ...o }));
  useEffect(() => {
    ketma([
      [1500, () => { set({ royxat: 'almash' }); setDots({ yuklanish: 'yashil' }); }],
      [1100, () => setS(p => ({ ...p, bosish: 'karta', bosK: p.bosK + 1 }))],
      [700, () => set({ ekran: 'oyin', royxat: 'karta', bosish: null })],
      [1000, () => { setS(p => ({ ...p, tugma: 'qoshilmoqda', bosish: 'tugma', bosK: p.bosK + 1 })); setDots(d => ({ ...d, bosish: 'yashil' })); }],
      [1500, () => { set({ son: 1, pop: true, tugma: 'qoshildingiz', bosish: null }); setDots(d => ({ ...d, muvaffaqiyat: 'yashil' })); }]
    ]);
  }, []); // eslint-disable-line
  return <Brauzer ong={null} sinf="past" ost={<DemoChiziq holat={dots} />}><IlovaEkran {...s} /></Brauzer>;
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun demo yo'lingizdagi <span className="italic" style={{ color: T.accent }}>uch joyni</span> o'zgartirasiz.</>, ru: <>Сегодня вы измените <span className="italic" style={{ color: T.accent }}>три места</span> на пути демо.</> })}
      mentor={<Mentor>{tr({ uz: "Yangi funksiya qo'shmaysiz — hakam ko'radigan ekranlardagi uch joyni o'zgartirasiz, namuna «Yordam»da turadi.", ru: 'Новых функций не добавляете — меняете три места на экранах, которые видит судья; образец — в «Подсказке».' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: 'В конце урока' })}
      chap={<RejaSahna />}
      qadamlar={REJA.map(r => ({ t: tr(r) }))}
    >
      <p className="py-reja-ost mono">{tr({ uz: "o'z repo'ngiz", ru: 'ваш репозиторий' })} · {tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })} <code className="qcode">maydon-jamoa</code> · {tr({ uz: "boshlang'ich teg", ru: 'начальный тег' })} <code className="qcode">m14-dars-04-start</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code className="qcode">m14-dars-04-done</code></p>
      <p className="py-reja-ost">{tr({ uz: "«Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Uch joy mobil va web-trekda bir xil.", ru: '«Maydon Jamoa» — образец; практики выполняете в своём продукте. Три места одинаковы в мобильном и веб-треке.' })}</p>
      <Ustoz satrlar={[
        { uz: "Bugun Backend'ga tegilmaydi — Render kutishi yo'q; uch blok ham ilova kodida (`mobil/` yoki `prototip/`). Tekshiruv kompyuter brauzerida, DevTools bilan: Network bo'limida «Slow 4G» va Rendering bo'limida `prefers-reduced-motion: reduce` — o'quvchilar ikkalasini birinchi marta ko'radi, 1-amaliyotda bir daqiqa ko'rsating.", ru: 'Сегодня Backend не трогаем — ожидания Render нет; все три блока в коде приложения (`mobil/` или `prototip/`). Проверка — в браузере на компьютере, с DevTools: в разделе Network «Slow 4G» и в разделе Rendering `prefers-reduced-motion: reduce` — ученики видят оба впервые, в 1-й практике покажите минуту.' },
        { uz: "Tekshiruv faqat real odamlar qo'shilmagan o'yinda (Mentor — namuna o'yin), har bosishdan keyin «O'yindan chiqish»: real o'yinchilarga son o'zgarishi va jonli xabar bormasin. 9-Modulda animatsiya qoidalari o'rganilgan — bugun ular qayta o'qitilmaydi, faqat demo yo'liga qo'llanadi.", ru: 'Проверка — только в игре без реальных людей (Ментор — образцовая игра), после каждого нажатия «Выйти из игры»: реальным игрокам не должны приходить изменение числа и живое сообщение. Правила анимации изучены в 9-м модуле — сегодня их не преподаём заново, только применяем к пути демо.' },
        { uz: "Agent «yana chiroyli qilay» deb yangi animatsiya yoki yangi ekran taklif qilsa — rad etiladi. Uyga vazifa yo'q.", ru: 'Если агент предлагает «сделать ещё красивее» — новую анимацию или новый экран, — отказываемся. Домашнего задания нет.' }
      ]} />
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha): «Oldin» va «Keyin» — bashorat + 4 harakat; holat o'quvchi bosgan tartibdan (P-046) =====
const S2_TAXMIN = [
  { k: 'yoq', t: { uz: "Yo'q, qo'shmaydi", ru: 'Нет, не добавит' } },
  { k: 'tugma', t: { uz: 'Bitta yangi tugma', ru: 'Одну новую кнопку' } },
  { k: 'ekran', t: { uz: 'Bitta yangi ekran', ru: 'Один новый экран' } }
];
const NOM_JOY = { uz: "Yuklanayotganda ma'lumot o'rnida turadigan kulrang shakl — joy egallovchi.", ru: 'Серая форма, которая стоит на месте данных во время загрузки, — заполнитель.' };
const NOM_SAYQAL = { uz: "Demo yo'lidagi shunday kichik o'zgarishlar sayqal deyiladi.", ru: 'Такие небольшие изменения на пути демо называются шлифовкой.' };
const HISOB = { uz: "Ekranlar: 2 · tugmalar: o'sha", ru: 'Экраны: 2 · кнопки: те же' };
const S2_BOSH = { ekran: 'oyinlar', royxat: 'tinch', tugma: 'qoshilaman', son: 0, pop: false, bosish: null, bosK: 0 };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 4 : 0);
  const [band, setBand] = useState(false);
  const [rejim, setRejim] = useState(avval ? 'keyin' : 'oldin');
  const [s, setS] = useState(avval ? { ...S2_BOSH, ekran: 'oyin', royxat: 'karta', tugma: 'qoshildingiz', son: 1 } : S2_BOSH);
  const [dots, setDots] = useState(avval ? ALL_YASHIL : {});
  const [nom, setNom] = useState(avval ? 2 : 0);
  const [flash, setFlash] = useState(false);
  const ketma = useKetma();
  const done = q >= 4;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const set = (o) => setS(p => ({ ...p, ...o }));
  const bosKarta = () => setS(p => ({ ...p, bosish: 'karta', bosK: p.bosK + 1 }));
  // 1-harakat («Oldin»): ro'yxat joyi bo'sh, faqat kutish yozuvi → karta birdan; sahna o'zi kartani bosadi
  const och = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); set({ ekran: 'oyinlar', royxat: 'bosh' });
    ketma([[1800, () => { set({ royxat: 'karta' }); setDots(d => ({ ...d, yuklanish: 'qizil' })); }], [1100, bosKarta], [700, () => { set({ ekran: 'oyin', bosish: null }); setQ(1); setBand(false); }]]);
  };
  // 2-harakat («Oldin»): ekran jim → son va tugma birdan; 4-harakat («Keyin»): «Qo'shilmoqda…» + kutish belgisi → son bir lahza kattalashadi
  const qoshil = () => {
    if (band || (q !== 1 && q !== 3)) return;
    setBand(true);
    if (q === 1) {
      setS(p => ({ ...p, bosish: 'tugma', bosK: p.bosK + 1 }));
      ketma([[1600, () => { set({ son: 1, tugma: 'qoshildingiz', bosish: null }); setDots(d => ({ ...d, bosish: 'qizil', muvaffaqiyat: 'qizil' })); setQ(2); setBand(false); }]]);
    } else {
      setS(p => ({ ...p, tugma: 'qoshilmoqda', bosish: 'tugma', bosK: p.bosK + 1 })); setDots(d => ({ ...d, bosish: 'yashil' }));
      ketma([[1600, () => { set({ son: 1, pop: true, tugma: 'qoshildingiz', bosish: null }); setDots(d => ({ ...d, muvaffaqiyat: 'yashil' })); setFlash(true); setNom(2); }], [1000, () => { setQ(4); setBand(false); }]]);
    }
  };
  // 3-harakat: «Keyin» — sahna boshidan: ikkita kulrang karta → karta birinchisi o'rniga, ikkinchisi so'nadi
  const keyin = () => {
    if (q !== 2 || band) return;
    setBand(true); setRejim('keyin'); set({ ekran: 'oyinlar', royxat: 'kulrang', tugma: 'qoshilaman', son: 0, pop: false, bosish: null });
    ketma([[1900, () => { set({ royxat: 'almash' }); setDots(d => ({ ...d, yuklanish: 'yashil' })); setNom(1); }], [1200, bosKarta], [700, () => { set({ ekran: 'oyin', royxat: 'karta', bosish: null }); setQ(3); setBand(false); }]]);
  };
  const ochHalqa = !!taxmin && q === 0 && !band;
  const mentor = !taxmin || q === 0 ? { uz: "Avval taxminingizni belgilang, keyin sahnada «O'yinlar»ni oching.", ru: 'Сначала отметьте предположение, затем откройте на сцене «Игры».' }
    : q === 1 ? { uz: "Endi «O'yin» ekranida «Qo'shilaman»ni bosing.", ru: 'Теперь на экране «Игра» нажмите «Присоединяюсь».' }
      : q === 2 ? { uz: "Endi tepadagi «Keyin»ni bosing — Mentor o'zgartirgan ilova ochiladi.", ru: 'Теперь нажмите «После» вверху — откроется приложение, изменённое Ментором.' }
        : q === 3 ? { uz: "Endi «Qo'shilaman»ni yana bir marta bosing.", ru: 'Теперь ещё раз нажмите «Присоединяюсь».' }
          : { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' };
  const ilova = <IlovaEkran {...s} spin={rejim === 'keyin'} onQoshil={(q === 1 || q === 3) && !band ? qoshil : undefined} qoshilHalqa={(q === 1 || q === 3) && !band} />;
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · demo yo'lidagi uch joy", ru: 'Понятие · три места на пути демо' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 4, done, { uz: 'Harakatlarni navbat bilan bajaring', ru: 'Выполняйте действия по очереди' }))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Yangi ekransiz demo yo'li <span className="italic" style={{ color: T.accent }}>qanday yaxshilanadi?</span></>, ru: <>Как улучшить путь демо <span className="italic" style={{ color: T.accent }}>без нового экрана?</span></> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        vizual={<div className="py-v">
          {tugadi
            ? <div className="py-sahna py-tug">
              <div className="py-chap"><Brauzer ong={SAYQAL_SAHNA.yorliq}>{ilova}</Brauzer></div>
              <div className="py-ung">
                <DemoChiziq holat={dots} />
                <NomQator matn={NOM_JOY} /><NomQator matn={NOM_SAYQAL} />
                <span className="py-hisob">{tr(HISOB)}</span>
                <p className="py-joriy">{tr({ uz: "Ekranlar va tugmalar o'sha — o'zgargani uch joyning ko'rinishi.", ru: 'Экраны и кнопки те же — изменился вид трёх мест.' })}</p>
              </div>
            </div>
            : <div className="py-sahna">
              <div className="py-chap">
                <Brauzer chap={<Rejim rejim={rejim} onKeyin={q === 2 && !band ? keyin : undefined} />} ost={<span className="py-sekin">{tr(SAYQAL_SAHNA.sekin)}</span>}>{ilova}</Brauzer>
              </div>
              <div className="py-ung">
                <Bashorat savol={{ uz: "Mentor demo yo'li uchun yangi funksiya qo'shadimi?", ru: 'Добавит ли Ментор новую функцию для пути демо?' }} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />
                <span className="py-amal">
                  <Bo on={ochHalqa ? och : undefined} className={cx('py-btn sq-oyinlar', q > 0 && 'xira', halqa(ochHalqa))}>{tr({ uz: "«O'yinlar»ni ochish", ru: 'Открыть «Игры»' })}</Bo>
                  <span className={cx('py-hisob', flash && 'on')}>{tr(HISOB)}</span>
                </span>
                <DemoChiziq holat={dots} />
                <NomQator matn={nom >= 1 ? NOM_JOY : null} />
                <NomQator matn={nom >= 2 ? NOM_SAYQAL : null} />
              </div>
            </div>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'yoq'} haqiqat={{ uz: "yo'q, qo'shmaydi", ru: 'нет, не добавит' }} />}
          matn={tr({ uz: "Bu misolda yangi ekran ham, tugma ham qo'shilmadi: bosish, yuklanish va natija endi ekranda ko'rinadi.", ru: 'В этом примере не добавили ни нового экрана, ни кнопки: нажатие, загрузка и результат теперь видны на экране.' })}
          izoh={tr({ uz: "Sayqal kutishni qisqartirmaydi — ekran kutish borligini ko'rsatadi.", ru: 'Шлифовка не сокращает ожидание — экран показывает, что ожидание идёт.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "9-Modulda o'quvchilar animatsiya «bosildi», «o'zgardi», «tayyor» deb javob berishini ko'rgan — bugungi uch joy shuning demo yo'lidagi o'rni. Kutish yozuvi 11-Modulda qo'shilgan: u kutish borligini aytadi; kulrang kartalar — nima kelishini.", ru: 'В 9-м модуле ученики видели, что анимация отвечает «нажато», «изменилось», «готово», — сегодняшние три места и есть её место на пути демо. Надпись ожидания добавлена в 11-м модуле: она говорит, что ожидание идёт; серые карточки — что придёт.' },
          { uz: "Sayqal tezlikni oshirmaydi (3-darsda tezlik alohida o'lchangan) — kutish vaqti o'sha qoladi. Sahnadagi «Oldin» va «Keyin» — Mentor ilovasining namunasi; o'quvchi ilovasida «Oldin» holatda kutish yozuvi bo'lmasligi ham mumkin.", ru: 'Шлифовка не повышает скорость (скорость отдельно измерили на 3-м уроке) — время ожидания остаётся тем же. «До» и «После» на сцене — образец приложения Ментора; в приложении ученика в состоянии «До» надписи ожидания может и не быть.' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s4 = 2, C) — ikkinchi misol: uy vazifalari ilovasi (P-002) =====
const TelMaket = ({ children, sinf }) => <span className={cx('py-tel', sinf)}><i className="py-tel-q" /><i className="py-tel-q qisqa" />{children}</span>;
const YuborishVizual = () => {
  const [k, setK] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[900, () => setK(1)]]); }, []); // eslint-disable-line
  return (
    <span className="py-qv fade-step">
      <TelMaket><span className={cx('py-tel-btn', k && 'kul')}>{k ? <><Spin />{tr({ uz: 'Yuborilmoqda…', ru: 'Отправка…' })}</> : tr({ uz: 'Yuborish', ru: 'Отправить' })}</span></TelMaket>
    </span>
  );
};
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Uy vazifalari ilovasida «Yuborish» sekin javob beradi. Tugma nima qilsin?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifalari ilovasida «Yuborish» sekin javob beradi. <span className="italic" style={{ color: T.accent }}>Tugma nima qilsin?</span></h2>, ru: <h2 className="title h-ask">В приложении для домашних заданий «Отправить» отвечает медленно. <span className="italic" style={{ color: T.accent }}>Что должна делать кнопка?</span></h2> })}
    options={[
      { uz: "Javob kelguncha o'zgarmay, avvalgidek tursin", ru: 'Пока нет ответа, пусть остаётся как прежде' },
      { uz: 'Har bosilganda vazifani qaytadan yuborsin', ru: 'Пусть при каждом нажатии отправляет задание заново' },
      { uz: "Bosilishi bilan o'zgarib, qayta bosilmasin", ru: 'Пусть сразу меняется и не нажимается повторно' },
      { uz: "Bosilganda boshqa ekranga o'tib ketaversin", ru: 'Пусть при нажатии просто уходит на другой экран' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Bosilgani tugma holatida ko'rinadi; ikkinchisi yuborilmaydi.", ru: 'Нажатие видно по состоянию кнопки; второе не отправляется.' }}
    explainWrong={{
      0: { uz: 'Bir lahza jim tugmani odam yana bosmaydimi?', ru: 'Не нажмёт ли человек снова на замершую кнопку?' },
      1: { uz: "Bitta vazifa ikki marta yuborilsa, nima bo'ladi?", ru: 'Что будет, если одно задание отправится дважды?' },
      3: { uz: 'Ekran almashsa, yuborilganini qayerdan bilasiz?', ru: 'Если экран сменится, как узнать, что отправлено?' },
      default: { uz: 'Bir lahza jim tugmani odam yana bosmaydimi?', ru: 'Не нажмёт ли человек снова на замершую кнопку?' }
    }}
    vizual={<YuborishVizual />} />
);

// ===== SCREEN 5 — TUSHUNCHA (QTushuncha): «Harakatni kamaytirish» kaliti + «Harakat · Holat» jadvali (P-057); bashorat + 2 harakat =====
const S5_TAXMIN = [
  { k: 'hech', t: { uz: 'Hech narsa qolmaydi', ru: 'Ничего не останется' } },
  { k: 'yozuv', t: { uz: 'Faqat yozuvlar qoladi', ru: 'Останутся только надписи' } },
  { k: 'hammasi', t: { uz: 'Yozuv, kartalar va son qoladi', ru: 'Останутся надпись, карточки и число' } }
];
const NOM_PRM = { uz: 'Qurilmada harakat kamaytirilganini sayt `prefers-reduced-motion` orqali biladi.', ru: 'Что на устройстве уменьшено движение, сайт узнаёт через `prefers-reduced-motion`.' };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const HAMMA_MUHR = Object.fromEntries(HARAKAT_HOLAT.map(r => [r.id, r.h]));
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 2 : 0);
  const [band, setBand] = useState(false);
  const [kalit, setKalit] = useState(avval);
  const [s, setS] = useState(avval ? { ekran: 'oyin', royxat: 'karta', tugma: 'qoshildingiz', son: 1, bosish: null, bosK: 0 } : { ekran: 'oyinlar', royxat: 'kulrang', tugma: 'qoshilaman', son: 0, bosish: null, bosK: 0 });
  const [muhr, setMuhr] = useState(avval ? HAMMA_MUHR : {});
  const ketma = useKetma();
  const done = q >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const set = (o) => setS(p => ({ ...p, ...o }));
  // 1-harakat: kalit yoqiladi — «O'yinlar» qayta ochiladi: kulrang kartalar (harakatsiz) → karta silliq kirishsiz; sahna o'zi kartani bosadi
  const yoq = () => {
    if (!taxmin || q !== 0 || band) return;
    setBand(true); setKalit(true); set({ ekran: 'oyinlar', royxat: 'kulrang' });
    ketma([[1500, () => { set({ royxat: 'karta' }); setMuhr(m => ({ ...m, kartalar: 'qoldi' })); }], [1000, () => setS(p => ({ ...p, bosish: 'karta', bosK: p.bosK + 1 }))], [600, () => { set({ ekran: 'oyin', bosish: null }); setQ(1); setBand(false); }]]);
  };
  // 2-harakat: «Qo'shilaman» — «Qo'shilmoqda…» (kutish belgisi yo'q) → son kattalashmasdan; jadval muhrlari navbat bilan (SABOQ 19)
  const qoshil = () => {
    if (q !== 1 || band) return;
    setBand(true); setS(p => ({ ...p, tugma: 'qoshilmoqda', bosish: 'tugma', bosK: p.bosK + 1 }));
    ketma([[500, () => setMuhr(m => ({ ...m, aylanish: 'ochdi', yozuv: 'qoldi' }))], [1100, () => { set({ son: 1, tugma: 'qoshildingiz', bosish: null }); setMuhr(m => ({ ...m, kattalash: 'ochdi' })); }], [120, () => setMuhr(m => ({ ...m, son: 'qoldi' }))], [900, () => { setQ(2); setBand(false); }]]);
  };
  const mentor = !taxmin ? { uz: "9-Modulda «Harakatni kamaytirish» kalitini ko'rgansiz — avval taxminingizni belgilang.", ru: 'В 9-м модуле вы видели переключатель «Уменьшить движение» — сначала отметьте предположение.' }
    : q === 0 ? { uz: "Endi o'ngdagi «Harakatni kamaytirish» kalitini yoqing.", ru: 'Теперь включите справа переключатель «Уменьшить движение».' }
      : q === 1 ? { uz: "Endi «O'yin» ekranida «Qo'shilaman»ni bosing va jadvalni kuzating.", ru: 'Теперь на экране «Игра» нажмите «Присоединяюсь» и следите за таблицей.' }
        : { uz: 'Natijani taxminingiz bilan solishtiring.', ru: 'Сравните результат со своим предположением.' };
  const ilova = <IlovaEkran {...s} spin={false} onQoshil={q === 1 && !band ? qoshil : undefined} qoshilHalqa={q === 1 && !band} />;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · harakatni kamaytirish', ru: 'Понятие · уменьшение движения' })} screen={screen} scrollSignal={tugadi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={tr(navYorliq(taxmin, q, 2, done, { uz: 'Harakatlarni bajaring', ru: 'Выполните действия' }))} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Harakat kamaytirilsa, <span className="italic" style={{ color: T.accent }}>ekranda nima qoladi?</span></>, ru: <>Если уменьшить движение, <span className="italic" style={{ color: T.accent }}>что останется на экране?</span></> })}
        mentor={<Mentor>{tr(mentor)}</Mentor>}
        vizual={<div className="py-v">
          {tugadi
            ? <div className="py-sahna py-tug">
              <div className="py-chap"><Brauzer>{ilova}</Brauzer></div>
              <div className="py-ung"><Kalit on kichik /><span className="py-hj-ust fokus"><HolatJadval muhr={muhr} /></span><NomQator matn={NOM_PRM} /></div>
            </div>
            : <div className="py-sahna">
              <div className="py-chap"><Brauzer>{ilova}</Brauzer></div>
              <div className="py-ung">
                <Bashorat savol={{ uz: 'Harakat kamaytirilsa, sayqaldan nima qoladi?', ru: 'Если уменьшить движение, что останется от шлифовки?' }} variantlar={S5_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />
                <Kalit on={kalit} onYoq={taxmin && q === 0 && !band ? yoq : undefined} />
                <span className="py-hj-ust"><HolatJadval muhr={muhr} /></span>
                <NomQator matn={q >= 2 ? NOM_PRM : null} />
              </div>
            </div>}
        </div>}
        xulosa={done && <XulosaQ natija={taxmin && <Natija togri={taxmin === 'hammasi'} haqiqat={{ uz: 'yozuv, kartalar va son qoladi', ru: 'останутся надпись, карточки и число' }} />}
          matn={tr({ uz: "Bu demo yo'lida harakat kamaytirilsa, harakat o'chadi: yozuv, kulrang kartalar va yangi son qoladi.", ru: 'На этом пути демо при уменьшении движения движение выключается: надпись, серые карточки и новое число остаются.' })}
          izoh={tr({ uz: "Telefondagi ilova bu sozlamani telefonning o'zidan o'qiydi.", ru: 'Приложение на телефоне читает эту настройку из самого телефона.' })} />}
      >
        <Ustoz satrlar={[
          { uz: "9-Modulda aytilgan: ba'zi odamlarga ko'p harakat noqulay — boshi aylanishi mumkin, ular qurilmada harakatni kamaytiradi (MDN). Hakam ham, sinfdagi mehmon ham shunday sozlamada bo'lishi mumkin — demo holati baribir tushunarli qolishi kerak.", ru: 'В 9-м модуле говорилось: некоторым людям много движения неудобно — может закружиться голова, они уменьшают движение на устройстве (MDN). Судья или гость в классе тоже могут быть с такой настройкой — состояние демо всё равно должно оставаться понятным.' },
          { uz: "Sahnadagi kalit — chizilgan (9-Modul 12-ekran naqshi); haqiqiy sozlama nomi qurilmaga qarab boshqacha. Darsda tekshiruv — kompyuter brauzerida, DevTools'ning Rendering bo'limida (3-amaliyot).", ru: 'Переключатель на сцене нарисован (образец 12-го экрана 9-го модуля); настоящее название настройки зависит от устройства. На уроке проверка — в браузере на компьютере, в разделе Rendering в DevTools (3-я практика).' }
        ]} />
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 1, B) — yangi vaziyat: telefon, muvaffaqiyat animatsiyasi (§106) =====
const SonVizual = () => {
  const [k, setK] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma([[900, () => setK(1)]]); }, []); // eslint-disable-line
  return (
    <span className="py-qv fade-step">
      <TelMaket sinf="son"><b className="py-tel-son">{SAYQAL_SAHNA.son[k]}</b></TelMaket>
      <Kalit on kichik />
    </span>
  );
};
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Mentor misolida telefonda harakat kamaytirilgan. Qo'shilgach son qanday o'zgaradi?"
    question={tr({ uz: <h2 className="title h-ask">Mentor misolida telefonda harakat kamaytirilgan. <span className="italic" style={{ color: T.accent }}>Qo'shilgach son qanday o'zgaradi?</span></h2>, ru: <h2 className="title h-ask">В примере Ментора на телефоне уменьшено движение. <span className="italic" style={{ color: T.accent }}>Как изменится число после присоединения?</span></h2> })}
    options={[
      { uz: "O'zgarmaydi — animatsiya o'chgani uchun", ru: 'Не изменится — потому что анимация выключена' },
      { uz: "Harakatsiz almashib, «9 / 10» bo'ladi", ru: 'Сменится без движения и станет «9 / 10»' },
      { uz: "Kattalashib qaytib, «9 / 10» bo'ladi", ru: 'Увеличится и вернётся, станет «9 / 10»' },
      { uz: "Faqat sahifa yangilanganda o'zgaradi", ru: 'Изменится только после обновления страницы' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Animatsiya o'chadi, yangi son esa baribir ko'rinadi.", ru: 'Анимация выключается, а новое число всё равно видно.' }}
    explainWrong={{
      0: { uz: "Animatsiya o'chdi. Holat ham o'chishi kerakmi?", ru: 'Анимация выключилась. Должно ли выключаться и состояние?' },
      2: { uz: 'Kattalashish — animatsiya. Sozlama uni qoldiradimi?', ru: 'Увеличение — это анимация. Оставит ли её настройка?' },
      3: { uz: 'Sozlama harakatga tegadi, yangilashga emas.', ru: 'Настройка касается движения, а не обновления.' },
      default: { uz: "Animatsiya o'chdi. Holat ham o'chishi kerakmi?", ru: 'Анимация выключилась. Должно ли выключаться и состояние?' }
    }}
    vizual={<SonVizual />} />
);

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  tapEcho: { icon: '👆', name: 'Tap Echo', desc: { uz: 'Tugma bosilishi bilan nima qilishini topdingiz', ru: 'Вы нашли, что должна делать кнопка сразу при нажатии' } },
  stillShows: { icon: '🧊', name: 'Still Shows', desc: { uz: "Harakatsiz ham yangi son ko'rinishini topdingiz", ru: 'Вы нашли, что новое число видно и без движения' } },
  greyCards: { icon: '🗂️', name: 'Grey Cards', desc: { uz: "Yuklanish holatini sekin tarmoqda o'zingiz tekshirdingiz", ru: 'Вы сами проверили состояние загрузки на медленной сети' } },
  calmMode: { icon: '🌙', name: 'Calm Mode', desc: { uz: "Harakat kamaytirilgan holatni o'zingiz tekshirdingiz", ru: 'Вы сами проверили состояние с уменьшенным движением' } },
};
// Ekran id → nishon: testlar (birinchi urinishda to'g'ri) · bloklar — 4-qadam «Bajardim» + tekshiruv kartasi (04-FILTR 29; bonus, natijadan qat'i nazar)
const ACH_TRIGGERS = { s4: 'tapEcho', s7: 'stillShows', a2: 'greyCards', a3: 'calmMode' };

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


// Podium savol yorliqlari (SCORED_IDX: 4, 7)
const Q_LABELS = {
  4: { uz: '1 — Bosish javobi', ru: '1 — Ответ на нажатие' },
  7: { uz: '2 — Harakat kamaytirilsa', ru: '2 — Если уменьшить движение' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi), emoji yo'q
const QZ_BG_SHAPES = [
  { ch: { uz: 'sayqal', ru: 'шлифовка' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'bosish javobi', ru: 'ответ на нажатие' }, l: 70, t: 8, s: 24, d: 23, dl: 1.5 },
  { ch: { uz: 'joy egallovchi', ru: 'заполнитель' }, l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: "«Qo'shilmoqda…»", ru: '«Присоединение…»' }, l: 66, t: 68, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'kulrang kartalar', ru: 'серые карточки' }, l: 40, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'prefers-reduced-motion', l: 52, t: 26, s: 20, d: 17, dl: 0.4 },
  { ch: 'Slow 4G', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: 'Rendering', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: '«8 / 10»', l: 84, t: 44, s: 24, d: 22, dl: 1.3 },
  { ch: 'Maydon Jamoa', l: 4, t: 50, s: 20, d: 24, dl: 2.5 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD aynan); ekran savollarining nusxasi emas (§144)
const QUIZ_BANK = [
  { q: { uz: "Bu darsda demo yo'lidagi qaysi uch joy o'zgaradi?", ru: 'Какие три места на пути демо меняются на этом уроке?' }, opts: [{ uz: 'Bosish, yuklanish va muvaffaqiyat', ru: 'Нажатие, загрузка и успех' }, { uz: "Kirish, ro'yxatdan o'tish va chiqish", ru: 'Вход, регистрация и выход' }, { uz: 'Rasmlar, kutubxona va kod hajmi', ru: 'Картинки, библиотека и объём кода' }, { uz: 'Lending, maxfiylik va oferta sahifasi', ru: 'Лендинг, конфиденциальность и оферта' }], correct: 0 },
  { q: { uz: "Sayqaldan keyin demo yo'lida nima o'zgaradi?", ru: 'Что меняется на пути демо после шлифовки?' }, opts: [{ uz: 'Ekranlar soni va ularning tartibi', ru: 'Число экранов и их порядок' }, { uz: "O'sha ekranlarda uch joy ko'rinishi", ru: 'Вид трёх мест на тех же экранах' }, { uz: "Backend va Database'ning tuzilishi", ru: 'Устройство Backend и Database' }, { uz: 'Ilovaning nomi va bosh ekrani rangi', ru: 'Название приложения и цвет главного экрана' }], correct: 1 },
  { q: { uz: "Javob sekin kelsa, «Qo'shilaman» bosilgach qanday turadi?", ru: 'Как выглядит «Qo\'shilaman» после нажатия, если ответ медленный?' }, opts: [{ uz: 'Avvalgidek turadi, yana bosish mumkin', ru: 'Как прежде, можно нажать снова' }, { uz: "Yo'qolib, o'rnida bo'sh joy qoladi", ru: 'Исчезает, на её месте пусто' }, { uz: "«Qo'shilmoqda…» yozuvi bilan, o'chiq", ru: 'С надписью «Qo\'shilmoqda…», неактивна' }, { uz: "«Qo'shildingiz» bo'lib, bosiladi", ru: 'Становится «Qo\'shildingiz» и нажимается' }], correct: 2 },
  { q: { uz: 'Joy egallovchi qayerda turadi?', ru: 'Где стоит заполнитель?' }, opts: [{ uz: 'Ekranning eng tepasida, kichik bo\'lib', ru: 'В самом верху экрана, маленьким' }, { uz: "Alohida ekranda, ro'yxatdan oldin", ru: 'На отдельном экране, перед списком' }, { uz: 'Tugmaning ichida, yozuv o\'rnida', ru: 'Внутри кнопки, вместо надписи' }, { uz: "Ma'lumot o'rnida, uning o'lchamida", ru: 'На месте данных, в их размере' }], correct: 3 },
  { q: { uz: "Kulrang kartalar nega haqiqiy karta o'lchamida bo'ladi?", ru: 'Почему серые карточки размером с настоящую карточку?' }, opts: [{ uz: "Ro'yxat kelganda sakrash kamaysin", ru: 'Чтобы было меньше скачка, когда придёт список' }, { uz: "Kartalar chiroyliroq ko'rinsin deb", ru: 'Чтобы карточки выглядели красивее' }, { uz: 'Backend javobi tezroq kelsin deb', ru: 'Чтобы ответ Backend пришёл быстрее' }, { uz: "Kutish yozuvi kerak bo'lmasin deb", ru: 'Чтобы надпись ожидания была не нужна' }], correct: 0 },
  { q: { uz: 'Kutish yozuvi bo\'lsa, kulrang kartalar nima beradi?', ru: 'Что дают серые карточки, если есть надпись ожидания?' }, opts: [{ uz: "Ro'yxatni tezroq yuklab beradi", ru: 'Загружают список быстрее' }, { uz: "Nima kelishini oldindan ko'rsatadi", ru: 'Заранее показывают, что придёт' }, { uz: "Backend'ni demo oldidan uyg'otadi", ru: 'Будят Backend перед демо' }, { uz: 'Kutish yozuvini butunlay almashtiradi', ru: 'Полностью заменяют надпись ожидания' }], correct: 1 },
  { q: { uz: 'Harakat kamaytirilgan qurilmada sayqaldan nima qoladi?', ru: 'Что остаётся от шлифовки на устройстве с уменьшенным движением?' }, opts: [{ uz: "Hech narsa qolmaydi — hammasi o'chadi", ru: 'Ничего — всё выключается' }, { uz: 'Faqat animatsiyalar qoladi, yozuvsiz', ru: 'Только анимации, без надписи' }, { uz: 'Yozuv, kulrang kartalar va yangi son', ru: 'Надпись, серые карточки и новое число' }, { uz: 'Faqat aylanadigan kutish belgisi', ru: 'Только вращающийся значок ожидания' }], correct: 2 },
  { q: { uz: "Harakat kamaytirilganini DevTools'da qayerda tanlaysiz?", ru: 'Где в DevTools выбрать уменьшение движения?' }, opts: [{ uz: "Network bo'limidagi ro'yxatda", ru: 'В списке раздела Network' }, { uz: "Lighthouse bo'limidagi sozlamada", ru: 'В настройке раздела Lighthouse' }, { uz: "Console bo'limidagi qatorlarda", ru: 'В строках раздела Console' }, { uz: "Rendering bo'limidagi ro'yxatda", ru: 'В списке раздела Rendering' }], correct: 3 },
  { q: { uz: "Ro'yxat sekin kelishini DevTools'da qanday ko'rasiz?", ru: 'Как в DevTools увидеть медленную загрузку списка?' }, opts: [{ uz: "Network'da «Slow 4G» ni tanlab", ru: 'Выбрав «Slow 4G» в Network' }, { uz: "Lighthouse'da «Mobile» ni tanlab", ru: 'Выбрав «Mobile» в Lighthouse' }, { uz: "Rendering'da «reduce» ni tanlab", ru: 'Выбрав «reduce» в Rendering' }, { uz: "Console'da xato qatorini o'qib", ru: 'Прочитав строку ошибки в Console' }], correct: 0 },
  { q: { uz: "Muvaffaqiyat animatsiyasi qanday bo'lishi kerak?", ru: 'Какой должна быть анимация успеха?' }, opts: [{ uz: "Uzun: ekran bo'ylab bayram chiqadi", ru: 'Долгой: праздник по всему экрану' }, { uz: "Qisqa: bir marta o'ynab, to'xtaydi", ru: 'Короткой: проигрывается раз и останавливается' }, { uz: "Doimiy: son to'xtamay miltillaydi", ru: 'Постоянной: число мигает без остановки' }, { uz: 'Takroriy: har soniyada qaytadan', ru: 'Повторяющейся: заново каждую секунду' }], correct: 1 },
  { q: { uz: "Animatsiya uchun nega yangi kutubxona qo'shilmaydi?", ru: 'Почему для анимации не добавляют новую библиотеку?' }, opts: [{ uz: "Kutubxona faqat web'da ishlaydi", ru: 'Библиотека работает только в вебе' }, { uz: "Agent kutubxona o'rnata olmaydi", ru: 'Агент не может установить библиотеку' }, { uz: "Kod hajmi oshib ketishi mumkin", ru: 'Может вырасти объём кода' }, { uz: "Kutubxona Backend'ni sekinlatadi", ru: 'Библиотека замедляет Backend' }], correct: 2 },
  { q: { uz: 'Sayqal ishlashini qanday bilasiz?', ru: 'Как узнать, что шлифовка работает?' }, opts: [{ uz: "Agent «hammasi tayyor» deb yozadi", ru: 'Агент пишет «всё готово»' }, { uz: "Kod ichida animatsiya so'zi bor", ru: 'В коде есть слово «анимация»' }, { uz: "Sinfdosh «chiroyli chiqibdi» deydi", ru: 'Одноклассник говорит «красиво вышло»' }, { uz: "Sekin tarmoqda o'zingiz ko'rasiz", ru: 'Сами видите на медленной сети' }], correct: 3 },
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

// ===== AMALIYOT BLOKLARI (3, 6, 8) — ScreenBlok + QBlok + prompt; hammasi o'quvchining o'z repo'sida (Mentor misoli — namuna, 13-Modul 8-darsi naqshi) =====
// Saqlash: yangi pm- kaliti YO'Q (tayanch 8). O'qiydi: pm-m9d8-platforma.trek; trek tanlovi, blok holati va tekshiruv kartasi — dars holatida (ccProgress, K-003).
// «Davom etish»: A1, A2 — 3-qadamdan keyin; A3 — 4-qadamdan keyin (E 55). Blok bajarildi — faqat 4-qadam «Bajardim»idan; u tekshiruv kartasi tanlanmaguncha qulf.
const TrekCtx = createContext(null);
const useTrek = () => {
  const c = useContext(TrekCtx) || {};
  const p = lsOqi('pm-m9d8-platforma');
  const pt = p && (p.trek === 'mobil' || p.trek === 'web') ? p.trek : null;
  return { trek: pt || c.trek || null, platforma: !!pt, setTrek: c.setTrek || (() => {}) };
};
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' };
const TK_BOSHQA = { uz: "Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.", ru: 'Напишите агенту место, которое не как в требовании, и проверьте снова.' };
const XATO_YOL = { uz: "Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если появится ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Tuzat.»' };
const MOS_KELMAGAN = { uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.» → qayta tekshiring, keyin push.", ru: 'Несовпадение напишите агенту: «{nima} talabdagidek emas: {qanday bo\'lsin}. Boshqa joyga tegma, o\'zgargan fayllarni ayt.» → проверьте снова, потом push.' };
const Band = ({ children }) => <span className="py-band">{children}</span>;
const Kulrang = ({ children }) => <span className="py-kulrang">{children}</span>;
// «{avvalgidek …}» tekshiruvi: kamida ikkita ish vergul bilan; «hammasi», «ilova» kabi bitta so'z emas (ikki tilli)
const BIR_SOZ = /^(hammasi|hamma|barchasi|barcha|ilova|loyiha|все|всё|приложение|проект)$/i;
const ikkiIsh = (s) => { const b = String(s || '').trim().split(/[,;]/).map(x => x.trim()).filter(x => x.length >= 2); return b.length >= 2 && !b.some(x => BIR_SOZ.test(x)); };
// Prompt qutisi: {…} joylari — kulrang namuna bilan (input ichida «masalan: …»); avto — trekdan oldindan; kod (`…`) ichidagi qavs joy emas
const PyPrompt = ({ satrlar, avto = {}, joylar = [], tekshir }) => {
  const [qiymat, setQiymat] = useState({});
  const [ok, setOk] = useState(false);
  const [xato, setXato] = useState(null);
  const subst = (s) => {
    let a = s;
    Object.entries(avto).forEach(([k, v]) => { if (v != null && v !== '') a = a.split(k).join(v); });
    joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) a = a.split(j.joy).join(v); });
    return a;
  };
  const matn = satrlar.map(l => subst(tr(l)));
  const kor = (t, li) => t.split('`').flatMap((p, i) => (i % 2
    ? [<code key={li + 'c' + i} className="qcode">{p}</code>]
    : p.split(/(\{[^}\s][^}]*\})/g).map((x, j) => (/^\{[^\s].*\}$/.test(x) ? <span key={li + '-' + i + '-' + j} className="q-joy">{x}</span> : <React.Fragment key={li + '-' + i + '-' + j}>{x}</React.Fragment>))));
  const nusxa = async () => {
    const x = tekshir ? tekshir(qiymat) : null;
    if (x) { setXato(x); return; }
    setXato(null);
    try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ }
  };
  return (
    <span className="q-prompt py-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa py-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="py-ps">{kor(l, i)}</span>)}
      {joylar.length > 0 && <span className="py-joylar">{joylar.map(j => (
        <label key={j.id} className="py-joy-m"><span className="py-joy-n">{j.joy}</span>
          <input type="text" value={qiymat[j.id] || ''} maxLength={200} placeholder={tr(j.namuna)} onChange={e => { setXato(null); const v = e.target.value; setQiymat(o => ({ ...o, [j.id]: v })); }} /></label>))}</span>}
      {xato && <span className="py-xato" role="status">{tr(xato)}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, ost }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="py-yordam-ust">
      <QTugma ikkinchi className="py-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="py-yordam fade-step"><b>{tr({ uz: "Mentor misolidagi to'liq talab (mobil trek)", ru: 'Полное требование из примера Ментора (мобильный трек)' })}</b>{satrlar.map((l, i) => <span key={i} className="py-yordam-s">{tx(l)}</span>)}{ost && <span className="py-kulrang">{tx(ost)}</span>}</span>}
    </span>
  );
};
// Trek: pm-m9d8-platforma.trek bo'lsa — kulrang qator; bo'lmasa — ikki tanlov tugmasi (tanlov dars holatida, boshqa darsning kalitiga yozilmaydi)
const TrekQator = () => {
  const { trek, platforma, setTrek } = useTrek();
  return platforma
    ? <Kulrang>{tr({ uz: 'Trekingiz: ', ru: 'Ваш трек: ' })}{trek === 'mobil' ? tr({ uz: 'mobil', ru: 'мобильный' }) : 'web'}</Kulrang>
    : <span className={cx('py-trek', !trek && 'py-chorla')}>{[['mobil', { uz: 'Mobil trek', ru: 'Мобильный трек' }], ['web', { uz: 'Web-trek', ru: 'Веб-трек' }]].map(([id, t]) => <button type="button" key={id} className={cx('q-chip', trek === id && 'on')} onClick={() => setTrek(id)}>{tr(t)}</button>)}</span>;
};
// Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin): «Kutilganidek» · «Boshqacha» (13-Modul F-1007-466 naqshi)
const TkKarta = ({ tk, onTanla, qulf }) => (
  <span className="py-tk">
    <span className={cx('py-tk-btnlar', tk == null && 'py-chorla')}>
      <button type="button" className={cx('q-chip py-tk-btn', tk === 'ok' && 'ok')} disabled={qulf} onClick={() => onTanla('ok')}>{tr({ uz: 'Kutilganidek', ru: 'Как ожидалось' })}</button>
      <button type="button" className={cx('q-chip py-tk-btn', tk === 'boshqa' && 'err')} disabled={qulf} onClick={() => onTanla('boshqa')}>{tr({ uz: 'Boshqacha', ru: 'По-другому' })}</button>
    </span>
  </span>
);
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, izoh, ulgur, ulgurQadam = 99, ustoz }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const [tk, setTk] = useState(() => (storedAnswer && storedAnswer.tekshiruv) || null);
  const done = stepN >= steps.length;
  const ochiq = done || stepN >= ulgurQadam;
  const oxirgi = steps.length - 1;
  const qulfli = !done && stepN === oxirgi && tk == null;
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true, tekshiruv: tk });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  // Blok bajarilgandan keyin karta o'zgarsa — dars holatidagi yozuv yangilanadi (yakun sarlavhasi shundan)
  const tanla = (v) => { setTk(v); if (storedAnswer && storedAnswer.solved) onAnswer(screen, { ...storedAnswer, tekshiruv: v }); };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(stepN);
  useEffect(() => {
    if (birinchi.current === stepN) return undefined;
    birinchi.current = stepN;
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: kamHarakat() ? 'auto' : 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 11: Mentor keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : stepN === oxirgi && tk == null ? { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: tekshirib, «Kutilganidek» yoki «Boshqacha»ni tanlang.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: проверьте и выберите «Как ожидалось» или «По-другому».` }
      : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  const qadamlar = steps.map((c, i) => ({ h: tr(c.h), t: i === oxirgi ? <>{c.t}<TkKarta tk={tk} onTanla={tanla} qulf={isMentorLive} /></> : c.t, xato: c.xato && tx(c.xato) }));
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cx('py-blok', qulfli && 'qulf', done && 'tugadi')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={qadamlar}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={done && tk === 'ok' && doneText ? tx(doneText) : null} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<>{done && tk === 'boshqa' && <p className="py-boshqa fade-step">{tr(TK_BOSHQA)}</p>}{done && izoh && <QIzoh>{tx(izoh)}</QIzoh>}<MentorPracticeStats live={_live} screen={screen} /></>}>
          {ortda && !done && <p className="py-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="py-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="py-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}
// Kutilgan natija: kadrlar bir marta o'zi yuradi (DE-200)
const useKadr = (soni, oraliq = 1600) => {
  const [kadr, setKadr] = useState(0);
  const ketma = useKetma();
  useEffect(() => { ketma(Array.from({ length: soni - 1 }, (_, i) => [i === 0 ? 1200 : oraliq, () => setKadr(i + 1)])); }, []); // eslint-disable-line
  return kadr;
};
// DevTools parchasi — Network bo'limi, «Slow 4G» tanlangan; qator — bitta so'rov (A1)
const DevToolsParcha = ({ qator }) => (
  <span className="py-dt">
    <span className="py-dt-tab"><i>Elements</i><i>Console</i><b>Network</b></span>
    <span className="py-dt-th"><span className="py-dt-sel">Slow 4G</span></span>
    {qator && <span className="py-dt-q"><i className="py-dt-nuq" aria-hidden="true" />{tr(qator)}</span>}
  </span>
);

// --- 1-amaliyot: bosish javobi (talab zinapoyasi A1 — tayyor talab + 4 joy) ---
const NAMUNA_YOZUV = [{ uz: "Demo tekshiruvi uchun bitta namuna yozuv yarat: {namuna yozuv}. `namuna = true` bo'lsin va faqat namuna akkaunt bilan — haqiqiy foydalanuvchilarning yozuvlariga tegma; bu yozuv sanoq, eslatma, Telegram xabari va taklif sanog'iga kirmasligini tekshirib ayt (`namuna` belgisi shuni qiladi — 12-Modul). Backend kodini o'zgartirma. Qaysi yozuv va qaysi `id` ekanini ayt.", ru: 'Создай одну образцовую запись для проверки демо: {namuna yozuv}. Пусть будет `namuna = true` и только с образцовым аккаунтом — записи настоящих пользователей не трогай; проверь и скажи, что эта запись не входит в счёт, напоминания, сообщения Telegram и счёт приглашений (это делает отметка `namuna` — 12-й модуль). Код Backend не меняй. Скажи, какая запись и какой `id`.' }];
const A1_PROMPT = [
  { uz: 'Qayerda: `{ilova papkasi}` — {asosiy tugma} turgan ekran. Backend kodiga tegma.', ru: 'Где: `{ilova papkasi}` — экран, где стоит {asosiy tugma}. Код Backend не трогай.' },
  { uz: "Nima qilsin: {asosiy tugma} bosilishi bilan, javob kelishini kutmasdan, tugma yozuvi «{kutish yozuvi}» ga almashsin, yonida kichik kutish belgisi chiqsin va tugma o'chiq bo'lsin — javob kelguncha qayta bosilmasin, ikkinchi so'rov yuborilmasin.", ru: 'Что сделать: при нажатии {asosiy tugma}, не дожидаясь ответа, надпись кнопки пусть сменится на «{kutish yozuvi}», рядом появится маленький значок ожидания и кнопка станет неактивной — до ответа её не нажать повторно, второй запрос не отправляется.' },
  { uz: "Javob kelgach — tugma avvalgi yakuniy holatiga o'tsin (ilovada qanday bo'lsa, shunday). Xato kelsa — tugma yana bosiladigan bo'lsin va ilovadagi xato xabari avvalgidek chiqsin.", ru: 'Когда придёт ответ — кнопка пусть перейдёт в прежнее итоговое состояние (как в приложении). Если придёт ошибка — кнопка снова станет нажимаемой и сообщение об ошибке в приложении появится как прежде.' },
  { uz: "Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. Yangi ekran, yangi tugma yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: {avvalgidek ishlashi kerak bo\'lgan ishlar} пусть работают как прежде. Новый экран, новую кнопку или новую функцию не добавляй. Новую библиотеку для анимации не добавляй — сделай тем, что есть в проекте. Файлы `.env` не трогай. Другие места не трогай, назови изменённые файлы.' }
];
const A1_YORDAM = [
  { uz: "Qayerda: `mobil/` — «O'yin» ekrani, «Qo'shilaman» tugmasi. Backend kodiga tegma.", ru: 'Где: `mobil/` — экран «O\'yin», кнопка «Qo\'shilaman». Код Backend не трогай.' },
  { uz: "Nima qilsin: «Qo'shilaman» bosilishi bilan, javob kelishini kutmasdan, tugma yozuvi «Qo'shilmoqda…» ga almashsin, yonida kichik kutish belgisi chiqsin va tugma o'chiq bo'lsin — javob kelguncha qayta bosilmasin, ikkinchi qo'shilish so'rovi yuborilmasin.", ru: 'Что сделать: при нажатии «Qo\'shilaman», не дожидаясь ответа, надпись кнопки пусть сменится на «Qo\'shilmoqda…», рядом появится маленький значок ожидания и кнопка станет неактивной — до ответа её не нажать повторно, второй запрос на присоединение не отправляется.' },
  { uz: "Javob kelgach — tugma «Qo'shildingiz» bo'lsin (avvalgidek). Xato kelsa — tugma yana «Qo'shilaman» bo'lsin va ilovadagi xato xabari avvalgidek chiqsin.", ru: 'Когда придёт ответ — кнопка «Qo\'shildingiz» (как прежде). Если придёт ошибка — кнопка снова «Qo\'shilaman» и сообщение об ошибке появится как прежде.' },
  { uz: "Nima buzilmasin: kirish, «O'yinlar» ro'yxati, «O'yindan chiqish», jonli son va «Hozir ko'ryapti» avvalgidek ishlasin. Yangi ekran, yangi tugma yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: вход, список «O\'yinlar», «O\'yindan chiqish», живое число и «Hozir ko\'ryapti» пусть работают как прежде. Новый экран, новую кнопку или новую функцию не добавляй. Новую библиотеку для анимации не добавляй — сделай тем, что есть в проекте. Файлы `.env` не трогай. Другие места не трогай, назови изменённые файлы.' }
];
const A1_KOD = [{ uz: "Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: tugma o'chiq bo'ladigan qator va javob kelgach tugma qaytadigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в своём коде два места с именем файла и номером строки: строку, где кнопка становится неактивной, и строку, где кнопка возвращается после ответа. Скажи одним предложением, что делает каждая. Код не меняй.' }];
const A1Natija = () => {
  const kadr = useKadr(3, 1700);
  return (
    <span className="py-an">
      <Brauzer ong={null}>
        <IlovaEkran ekran="oyin" tugma={['qoshilaman', 'qoshilmoqda', 'qoshildingiz'][kadr]} son={kadr === 2 ? 1 : 0} pop={kadr === 2}
          izoh={kadr === 1 && <span className="py-ikki fade-step"><i /><i /><em>{tr({ uz: 'yuborilmadi', ru: 'не отправлено' })}</em></span>} />
      </Brauzer>
      <DevToolsParcha qator={{ uz: "qo'shilish so'rovi", ru: 'запрос присоединения' }} />
    </span>
  );
};
const papkaOl = (trek) => (trek === 'mobil' ? 'mobil/' : trek === 'web' ? 'prototip/' : null);
const ScreenA1 = (props) => {
  const { trek } = useTrek();
  const avto = { '{ilova papkasi}': papkaOl(trek) };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>Tugma bosilishi bilan o'zgarsin, <span className="italic" style={{ color: T.accent }}>qayta bosilmasin</span>.</>, ru: <>Пусть кнопка меняется сразу при нажатии и <span className="italic" style={{ color: T.accent }}>не нажимается повторно</span>.</> }}
      mentor={{ uz: "Talab tayyor — demo yo'lingizdagi asosiy tugmani o'zingiz yozasiz; «1 · Ochish»dan boshlang.", ru: 'Требование готово — главную кнопку на своём пути демо впишете сами; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tx({ uz: "Antigravity'da o'z repo'ngizni oching — 3-darsda to'xtagan joyingizdan. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.", ru: 'Откройте свой репозиторий в Antigravity — с места, где остановились на 3-м уроке. В терминале `git status`: файлов `.env` в списке быть не должно.' })}
          <Band><TrekQator /></Band>
          <Band>{tr({ uz: "Bugun ilovaga yangi narsa qo'shilmaydi: agent «yana bir narsa qo'shay» desa — «Yo'q, faqat talabdagi ish» deng.", ru: 'Сегодня в приложение ничего нового не добавляем: если агент скажет «добавлю ещё кое-что» — ответьте «Нет, только работа из требования».' })}</Band>
          <Band>{tr({ uz: "Demo yo'lingizni ilovada bir marta bosib chiqing va ikki savolga javob toping: hakam oldida qaysi tugmani bosasiz? Javob kelguncha tugmada qanday yozuv tursin? (Mentor misolida: «O'yin» ekranidagi «Qo'shilaman»; yozuv «Qo'shilmoqda…».)", ru: 'Пройдите свой путь демо в приложении один раз и ответьте на два вопроса: какую кнопку вы нажмёте перед судьёй? Какая надпись должна стоять на кнопке до ответа? (В примере Ментора: «Qo\'shilaman» на экране «O\'yin»; надпись «Qo\'shilmoqda…».)' })}</Band>
          <Band>{tr({ uz: "Tekshirish uchun real odamlar qo'shilmagan yozuv kerak (Mentor misolida — namuna o'yin «Shanba, 18:00»). Bunday yozuv bo'lmasa — agentga «Nusxalash» bilan yuboring:", ru: 'Для проверки нужна запись без реальных людей (в примере Ментора — образцовая игра «Shanba, 18:00»). Если такой записи нет — отправьте агенту через «Скопировать»:' })}</Band>
          <PyPrompt satrlar={NAMUNA_YOZUV} joylar={[{ id: 'namuna', joy: '{namuna yozuv}', namuna: { uz: "masalan: o'yin «Juma, 18:00 · Mahalla maydoni», kerak 10, hali hech kim qo'shilmagan", ru: 'например: игра «Juma, 18:00 · Mahalla maydoni», нужно 10, пока никто не присоединился' } }]} />
          <Band>{tx({ uz: "Agent «`namuna` belgisi sanoq yoki xabarni chetlamaydi» desa — tekshiruvdan keyin yozuvni o'chiring (agentga: «{id} namuna yozuvini o'chir, boshqa joyga tegma»); Backend kodiga bugun tegilmaydi.", ru: 'Если агент скажет «отметка `namuna` не исключает из счёта или сообщений» — после проверки удалите запись (агенту: «{id} namuna yozuvini o\'chir, boshqa joyga tegma»); код Backend сегодня не трогаем.' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <span className="py-vazifa">{tr({ uz: "Demo yo'lidagi asosiy tugma bosilishi bilan yozuvini o'zgartiradi va javob kelguncha qayta bosilmaydi.", ru: 'Главная кнопка на пути демо меняет надпись сразу при нажатии и до ответа не нажимается повторно.' })} <b>{tr({ uz: "Tugma bosilishi bilan o'z holatini o'zgartirishi — bosish javobi deyiladi.", ru: 'Когда кнопка меняет своё состояние сразу при нажатии — это называется ответом на нажатие.' })}</b></span>
          <PyPrompt satrlar={A1_PROMPT} avto={avto}
            joylar={[
              ...(avto['{ilova papkasi}'] ? [] : [{ id: 'papka', joy: '{ilova papkasi}', namuna: { uz: 'mobil/ yoki prototip/', ru: 'mobil/ или prototip/' } }]),
              { id: 'tugma', joy: '{asosiy tugma}', namuna: { uz: "masalan: «O'yin» ekranidagi «Qo'shilaman»", ru: 'например: «Qo\'shilaman» на экране «O\'yin»' } },
              { id: 'kutish', joy: '{kutish yozuvi}', namuna: { uz: "masalan: Qo'shilmoqda…", ru: 'например: Qo\'shilmoqda…' } },
              { id: 'buzilmasin', joy: "{avvalgidek ishlashi kerak bo'lgan ishlar}", namuna: { uz: "masalan: kirish, «O'yinlar» ro'yxati, «O'yindan chiqish», jonli son", ru: 'например: вход, список «O\'yinlar», «O\'yindan chiqish», живое число' } }
            ]}
            tekshir={(v) => (ikkiIsh(v.buzilmasin) ? null : { uz: 'Ikkita aniq ish yozing: masalan, kirish, ro\'yxat.', ru: 'Напишите две конкретные работы: например, вход, список.' })} />
          <Yordam satrlar={A1_YORDAM} ost={{ uz: "Web-trekda: «Qayerda» qatorida `mobil/` o'rnida `prototip/` va saytingizdagi asosiy tugma turadi; qolgani o'sha.", ru: 'В веб-треке: в строке «Qayerda» вместо `mobil/` стоит `prototip/` и главная кнопка вашего сайта; остальное то же.' }} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "agent tugatgach brauzerda oching: mobil trek — `mobil/` da `npx expo start`, keyin terminalda `w` (ilova kompyuter brauzerida ochiladi); web-trek — `prototip/` da `npm run dev`. `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q, `backend/` o'zgarmagan.", ru: 'когда агент закончит, откройте в браузере: мобильный трек — в `mobil/` `npx expo start`, затем в терминале `w` (приложение откроется в браузере компьютера); веб-трек — в `prototip/` `npm run dev`. `git status` — изменённые файлы совпадают с тем, что сказал агент, `.env` в списке нет, `backend/` не изменён.' })} <b>{tr({ uz: "Push hali yo'q — avval 4-qadam tekshiruvi, push uning oxirida.", ru: 'Push пока нет — сначала проверка на 4-м шаге, push в её конце.' })}</b>
          <Band>{tr({ uz: "Kutayotganda agentga («Nusxalash» bilan):", ru: 'Пока ждёте — агенту (через «Скопировать»):' })}</Band>
          <PyPrompt satrlar={A1_KOD} /></>, xato: XATO_YOL },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "talabning har gapini o'zingiz ko'ring (kompyuter brauzerida):", ru: 'проверьте сами каждое предложение требования (в браузере на компьютере):' })}
          <Band>{tr({ uz: <>(1) DevTools'ni oching (F12 yoki Ctrl + Shift + I; Mac: Cmd + Option + I) → <b>Network</b> bo'limi → tepadagi ro'yxatdan «Slow 4G» ni tanlang. Endi javob sekin keladi.</>, ru: <>(1) Откройте DevTools (F12 или Ctrl + Shift + I; Mac: Cmd + Option + I) → раздел <b>Network</b> → в списке сверху выберите «Slow 4G». Теперь ответ приходит медленно.</> })}</Band>
          <Band>{tr({ uz: <>(2) Real odamlar qo'shilmagan o'yinni (yoki 1-qadamdagi namuna yozuvni) oching va asosiy tugmani <b>tez ikki marta</b> bosing. Tugma birinchi bosishdayoq yozuvini o'zgartirishi va bosilmasligi kerak; javob kelgach — yakuniy holat, natija (Mentor misolida son) bir marta o'zgaradi.</>, ru: <>(2) Откройте игру без реальных людей (или образцовую запись из 1-го шага) и <b>быстро дважды</b> нажмите главную кнопку. Кнопка должна сменить надпись уже при первом нажатии и больше не нажиматься; после ответа — итоговое состояние, результат (в примере Ментора число) меняется один раз.</> })}</Band>
          <Band>{tr({ uz: "(3) «O'yindan chiqish» (yoki mahsulotingizdagi shunday tugma) bilan holatni boshiga qaytaring.", ru: '(3) Верните состояние к началу кнопкой «O\'yindan chiqish» (или такой же кнопкой в вашем продукте).' })}</Band>
          <Band>{tr({ uz: <>(3b) Network ro'yxatiga qarang: asosiy so'rov faqat <b>bitta</b> ketdi — ikkinchi bosishdan yangi qator chiqmadi (Mentor misolida — qo'shilish so'rovi bitta qator).</>, ru: <>(3b) Посмотрите список Network: главный запрос ушёл только <b>один</b> — от второго нажатия новой строки нет (в примере Ментора — запрос присоединения одной строкой).</> })}</Band>
          <Band>{tr({ uz: "(4) Network bo'limida «No throttling» ni tanlang — keyingi ishlar odatdagi tezlikda bo'lsin.", ru: '(4) В разделе Network выберите «No throttling» — дальше пусть всё идёт на обычной скорости.' })}</Band>
          <Band>{tx({ uz: '(5) Kutilganidek bo\'lsa — har faylni `git add <fayl>` bilan qo\'shing, `git commit -m "sayqal: bosish javobi"`, `git push`.', ru: '(5) Если как ожидалось — добавьте каждый файл через `git add <fayl>`, `git commit -m "sayqal: bosish javobi"`, `git push`.' })}</Band>
          <Band>{tr(MOS_KELMAGAN)}</Band></> }
      ]}
      natija={<A1Natija />}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-04-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `mobil/.env` ga o'z qiymatlaringizni yozasiz.", ru: 'Отстали — откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-04-done` — последнюю команду запускайте только в этой новой папке: она удаляет изменения в папке. В `mobil/.env` впишете свои значения.' }}
      ulgur={{ uz: "Ulgurmasangiz: «Davom etish» 3-qadamdan keyin ochiladi — kod push qilinmagan holda qoladi (tekshirilmagan kod odamlarga chiqmaydi); 4-qadam (tekshiruv va push) 3-amaliyot boshida. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: «Продолжить» откроется после 3-го шага — код останется без push (непроверенный код к людям не уходит); 4-й шаг (проверка и push) — в начале 3-й практики. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={3}
      doneText={{ uz: "Tugma bosilishi bilan o'zgaradi; javob kelguncha qayta bosilmaydi.", ru: 'Кнопка меняется сразу при нажатии; до ответа повторно не нажимается.' }}
      izoh={{ uz: "Agentning «tayyor» degani — da'vo; tugmani sekin tarmoqda o'zingiz ko'rdingiz.", ru: '«Готово» от агента — заявление; кнопку на медленной сети вы видели сами.' }}
      ustoz={[
        { uz: "DevTools'ni birinchi marta ochayotganlarga Network bo'limini proyektorda ko'rsating; «Slow 4G» faqat shu oynada ishlaydi. Ilovada xato xabari bo'lmasa — agent uni qo'shmaydi (yangi funksiya emas, tayyor holat qoladi); o'quvchi buni «Boshqacha» deb belgilamaydi.", ru: 'Тем, кто открывает DevTools впервые, покажите раздел Network на проекторе; «Slow 4G» работает только в этом окне. Если в приложении нет сообщения об ошибке — агент его не добавляет (это не новая функция, остаётся готовое состояние); ученик не отмечает это как «По-другому».' },
        { uz: "Tugma yozuvi o'quvchi ilovasida boshqacha bo'ladi («Yuborilmoqda…», «Saqlanmoqda…») — muhimi, bosilgani ko'rinsin. Tugmani o'chirish tasodifiy ikki marta bosishni kamaytiradi — bu Backend himoyasi emas: bir xil so'rovni ikki marta qabul qilmaslik Backend ishi, bu darsda yo'q.", ru: 'Надпись кнопки в приложении ученика будет другой («Yuborilmoqda…», «Saqlanmoqda…») — главное, чтобы нажатие было видно. Отключение кнопки уменьшает случайное двойное нажатие — это не защита Backend: не принимать один и тот же запрос дважды — дело Backend, его на этом уроке нет.' }
      ]} />
  );
};

// --- 2-amaliyot: yuklanish holati (talab zinapoyasi A2 — tayyor talab + 3 joy) ---
const A2_PROMPT = [
  { uz: "Qayerda: `{ilova papkasi}` — {ro'yxat ekrani}. Backend kodiga tegma.", ru: 'Где: `{ilova papkasi}` — {ro\'yxat ekrani}. Код Backend не трогай.' },
  { uz: "Nima qilsin: ro'yxat yuklanayotganda bo'sh joy o'rnida joy egallovchi chiqsin: ekranda birinchi ko'rinadigan ro'yxat joyini taxminan to'ldiradigan kulrang shakllar — haqiqiy kontentga yaqin shakl va o'lchamda (soni ekraningizga qarab), ichida {kartada nima bor} o'rnida kulrang chiziqlar (harakatsiz).", ru: 'Что сделать: пока список загружается, вместо пустого места пусть появится заполнитель: серые формы, примерно заполняющие место списка на первом экране, — по форме и размеру близкие к настоящему содержимому (количество — по вашему экрану), внутри на месте {kartada nima bor} серые полоски (без движения).' },
  { uz: "Ro'yxat kelganda haqiqiy kontent joy egallovchi o'rniga, o'sha joyga chiqsin — ekrandagi boshqa narsalar iloji boricha siljimasin. Kutish yozuvi bo'lsa — joy egallovchi ostida qolsin. Ro'yxat bo'sh kelsa yoki xato bo'lsa — ilovadagi avvalgi xabar chiqsin, kulrang kartalar qolib ketmasin.", ru: 'Когда придёт список, настоящее содержимое пусть появится вместо заполнителя, на том же месте — остальное на экране по возможности не сдвигается. Если есть надпись ожидания — пусть остаётся под заполнителем. Если список пустой или ошибка — пусть выйдет прежнее сообщение приложения, серые карточки не должны остаться.' },
  { uz: "Nima buzilmasin: 1-amaliyotdagi tugma, ro'yxatni yangilash va kartani bosib o'yinni ochish avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: кнопка из 1-й практики, обновление списка и открытие игры нажатием на карточку пусть работают как прежде. Новый экран или новую функцию не добавляй. Новую библиотеку для анимации не добавляй — сделай тем, что есть в проекте. Файлы `.env` не трогай. Другие места не трогай, назови изменённые файлы.' }
];
const A2_YORDAM = [
  { uz: "Qayerda: `mobil/` — «O'yinlar» ekrani (`mobil/src/app/index.tsx`), o'yinlar ro'yxati. Backend kodiga tegma.", ru: 'Где: `mobil/` — экран «O\'yinlar» (`mobil/src/app/index.tsx`), список игр. Код Backend не трогай.' },
  { uz: "Nima qilsin: ro'yxat yuklanayotganda bo'sh joy o'rnida joy egallovchi chiqsin: ikkita kulrang karta — o'yin kartasi o'lchamida va shaklida, ichida kun va soat, maydon va son o'rnida kulrang chiziqlar (harakatsiz).", ru: 'Что сделать: пока список загружается, вместо пустого места пусть появится заполнитель: две серые карточки — размера и формы карточки игры, внутри на месте дня и времени, площадки и числа серые полоски (без движения).' },
  { uz: "Ro'yxat kelganda o'yin kartalari kulrang kartalar o'rniga, o'sha joyga chiqsin — ekrandagi boshqa narsalar siljimasin. «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» yozuvi joy egallovchi ostida qolsin. Ro'yxat bo'sh kelsa yoki xato bo'lsa — ilovadagi avvalgi xabar chiqsin, kulrang kartalar qolib ketmasin.", ru: 'Когда придёт список, карточки игр пусть появятся вместо серых, на том же месте — остальное на экране не сдвигается. Надпись «O\'yinlar yuklanmoqda — bu bir daqiqagacha cho\'zilishi mumkin.» пусть остаётся под заполнителем. Если список пустой или ошибка — пусть выйдет прежнее сообщение приложения, серые карточки не должны остаться.' },
  { uz: "Nima buzilmasin: «Qo'shilaman» tugmasi (1-amaliyot), pastga tortib yangilash va kartani bosib o'yinni ochish avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: кнопка «Qo\'shilaman» (1-я практика), обновление потягиванием вниз и открытие игры нажатием на карточку пусть работают как прежде. Новый экран или новую функцию не добавляй. Новую библиотеку для анимации не добавляй — сделай тем, что есть в проекте. Файлы `.env` не трогай. Другие места не трогай, назови изменённые файлы.' }
];
const A2_KOD = [{ uz: "Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: kulrang kartalar chiqadigan shart va kulrang karta o'lchami yozilgan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в своём коде два места с именем файла и номером строки: условие, при котором появляются серые карточки, и строку с размером серой карточки. Скажи одним предложением, что делает каждая. Код не меняй.' }];
const A2Natija = () => {
  const kadr = useKadr(2, 1700);
  return (
    <span className="py-an">
      <Brauzer ong={null}>
        <IlovaEkran ekran="oyinlar" royxat={kadr ? 'almash' : 'kulrang'} royxatIzoh={kadr ? { uz: "sakrash yo'q", ru: 'без скачка' } : null} />
      </Brauzer>
      <DevToolsParcha />
    </span>
  );
};
const ScreenA2 = (props) => {
  const { trek } = useTrek();
  const avto = { '{ilova papkasi}': papkaOl(trek) };
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Ro'yxat yuklanayotganda <span className="italic" style={{ color: T.accent }}>bo'sh joy qolmasin</span>.</>, ru: <>Пока загружается список, <span className="italic" style={{ color: T.accent }}>не должно быть пустого места</span>.</> }}
      mentor={{ uz: "Kulrang kartalar ro'yxatingiz kartalariga o'xshasin — namuna «Yordam» ortida; «1 · Ochish»dan boshlang.", ru: 'Пусть серые карточки похожи на карточки вашего списка — образец за «Подсказкой»; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "o'z repo'ngiz, 1-amaliyotdan keyingi kod. Kompyuter brauzerida ilovangizni oching, DevTools → Network → «Slow 4G» va demo yo'lingizdagi ro'yxat ekranini yangilang: ro'yxat kelguncha ekranda nima turadi?", ru: 'ваш репозиторий, код после 1-й практики. Откройте приложение в браузере на компьютере, DevTools → Network → «Slow 4G» и обновите экран списка на своём пути демо: что стоит на экране, пока не пришёл список?' })}
          <Band>{tr({ uz: "Ikki savolga javob toping: qaysi ekran hakam oldida birinchi yuklanadi? Bitta kartada nimalar bor — kulrang karta shuni takrorlaydi? (Mentor misolida: «O'yinlar» ro'yxati; kartada kun va soat, maydon, son.)", ru: 'Ответьте на два вопроса: какой экран загружается перед судьёй первым? Что есть в одной карточке — серая карточка повторит это? (В примере Ментора: список «O\'yinlar»; в карточке день и время, площадка, число.)' })}</Band>
          <Band>{tr({ uz: "Mahsulotingizda kutish yozuvi bo'lsa — u qoladi: u kutish borligini aytadi, kulrang kartalar — nima kelishini. Keyin Network bo'limida «No throttling» ga qaytaring.", ru: 'Если в вашем продукте есть надпись ожидания — она остаётся: она говорит, что ожидание идёт, серые карточки — что придёт. Потом в разделе Network верните «No throttling».' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <span className="py-vazifa">{tr({ uz: "Demo yo'lidagi ro'yxat yuklanayotganda bo'sh joy o'rnida joy egallovchi turadi — haqiqiy kontent egallaydigan joyga yaqin shaklda; ro'yxat kelganda katta siljish bo'lmaydi.", ru: 'Пока список на пути демо загружается, вместо пустого места стоит заполнитель — по форме близкий к месту настоящего содержимого; когда приходит список, большого сдвига нет.' })}</span>
          <PyPrompt satrlar={A2_PROMPT} avto={avto}
            joylar={[
              ...(avto['{ilova papkasi}'] ? [] : [{ id: 'papka', joy: '{ilova papkasi}', namuna: { uz: 'mobil/ yoki prototip/', ru: 'mobil/ или prototip/' } }]),
              { id: 'ekran', joy: "{ro'yxat ekrani}", namuna: { uz: "masalan: «O'yinlar» ekrani, o'yinlar ro'yxati", ru: 'например: экран «O\'yinlar», список игр' } },
              { id: 'karta', joy: '{kartada nima bor}', namuna: { uz: "masalan: kun va soat, maydon, «8 / 10» kabi son", ru: 'например: день и время, площадка, число вроде «8 / 10»' } }
            ]} />
          <Yordam satrlar={A2_YORDAM} ost={{ uz: "Web-trekda: «Qayerda» qatorida `prototip/` va saytingizdagi ro'yxat sahifasi; qolgani o'sha.", ru: 'В веб-треке: в строке «Qayerda» — `prototip/` и страница списка вашего сайта; остальное то же.' }} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "brauzerda yangilang (mobil — `npx expo start` ishlab turgan bo'lsa, odatda o'zi qayta yuklanadi; bo'lmasa terminalda `r`; web — `npm run dev`) va ro'yxat ekrani ochilishini ko'ring; `git status` — o'zgargan fayllar agent aytgani bilan bir xil. Push — 4-qadam oxirida.", ru: 'обновите в браузере (мобильный — если `npx expo start` запущен, обычно перезагружается сам; если нет — в терминале `r`; веб — `npm run dev`) и посмотрите, как открывается экран списка; `git status` — изменённые файлы совпадают с тем, что сказал агент. Push — в конце 4-го шага.' })}
          <Band>{tr({ uz: "Kutayotganda agentga («Nusxalash» bilan):", ru: 'Пока ждёте — агенту (через «Скопировать»):' })}</Band>
          <PyPrompt satrlar={A2_KOD} /></>, xato: XATO_YOL },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "o'zingiz ko'ring:", ru: 'проверьте сами:' })}
          <Band>{tr({ uz: "(1) DevTools → Network → «Slow 4G» (yoki «3G»), ro'yxat ekranini yangilang: bo'sh joy o'rnida joy egallovchi turishi kerak.", ru: '(1) DevTools → Network → «Slow 4G» (или «3G»), обновите экран списка: вместо пустого места должен стоять заполнитель.' })}</Band>
          <Band>{tr({ uz: "(2) Ro'yxat kelganda kontent o'sha joyga chiqadi: tugmalar, sarlavha va boshqa narsalarda sezilarli sakrash ko'rindimi? Ko'rinmasa — kutilganidek.", ru: '(2) Когда приходит список, содержимое появляется на том же месте: был ли заметный скачок у кнопок, заголовка и прочего? Если не было — как ожидалось.' })}</Band>
          <Band>{tr({ uz: "(3) «No throttling» ni tanlab yana yangilang: kulrang kartalar bir lahza ko'rinib o'tishi yoki umuman ko'rinmasligi mumkin — bu ham to'g'ri.", ru: '(3) Выберите «No throttling» и обновите снова: серые карточки могут мелькнуть на мгновение или не появиться совсем — это тоже правильно.' })}</Band>
          <Band>{tx({ uz: '(4) Kutilganidek bo\'lsa — `git add <fayl>` → `git commit -m "sayqal: joy egallovchi"` → `git push`.', ru: '(4) Если как ожидалось — `git add <fayl>` → `git commit -m "sayqal: joy egallovchi"` → `git push`.' })}</Band>
          <Band>{tr(MOS_KELMAGAN)}</Band></> }
      ]}
      natija={<A2Natija />}
      ulgur={{ uz: "Ulgurmasangiz: «Davom etish» 3-qadamdan keyin ochiladi — kod push qilinmagan holda qoladi; 4-qadam (tekshiruv va push) 3-amaliyot boshida. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: «Продолжить» откроется после 3-го шага — код останется без push; 4-й шаг (проверка и push) — в начале 3-й практики. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={3}
      doneText={{ uz: "Ro'yxat kelguncha kulrang kartalar turdi; kartalar o'sha joyga chiqdi.", ru: 'Пока не пришёл список, стояли серые карточки; карточки появились на том же месте.' }}
      izoh={{ uz: "Kulrang kartalar kutishni qisqartirmaydi — nima kelishini ko'rsatadi.", ru: 'Серые карточки не сокращают ожидание — показывают, что придёт.' }}
      ustoz={[
        { uz: "«Slow 4G» bilan ham ro'yxat tez kelsa — «3G» ni tanlang; baribir tez kelsa (ma'lumot keshdan yoki jonli ulanishdan) — Network'da «Disable cache» ni belgilab yangilang. Kulrang kartalar soni o'quvchi ro'yxatidagi yozuvlar soniga teng bo'lishi shart emas: muhimi, birinchi karta o'z joyida chiqsin. Kutish yozuvi yo'q mahsulotda u qo'shilmaydi (yangi funksiya emas).", ru: 'Если и со «Slow 4G» список приходит быстро — выберите «3G»; если всё равно быстро (данные из кеша или живого подключения) — отметьте в Network «Disable cache» и обновите. Число серых карточек не обязано равняться числу записей в списке ученика: главное, чтобы первая карточка появилась на своём месте. В продукте без надписи ожидания её не добавляем (это не новая функция).' }
      ]} />
  );
};

// --- 3-amaliyot: muvaffaqiyat, harakat kamaytirilgan holat va yangi versiya (A3 — tayyor talab + 3 joy; reduced-motion qismi tayyor) ---
const A3_PROMPT = [
  { uz: "Qayerda: `{ilova papkasi}` — {muvaffaqiyat joyi}; 1–2-amaliyotdagi tugma va kulrang kartalar. Backend kodiga tegma.", ru: 'Где: `{ilova papkasi}` — {muvaffaqiyat joyi}; кнопка и серые карточки из 1–2-й практики. Код Backend не трогай.' },
  { uz: "Nima qilsin: 1) Ish bajarilganda {muvaffaqiyat joyi} da kichik animatsiya bo'lsin: {qanday harakat}. Animatsiya qisqa bo'lsin va bir marta o'ynasin.", ru: 'Что сделать: 1) Когда работа выполнена, пусть в {muvaffaqiyat joyi} будет небольшая анимация: {qanday harakat}. Анимация короткая и проигрывается один раз.' },
  { uz: "2) Qurilmada harakatni kamaytirish yoqilgan bo'lsa — bu animatsiya bo'lmasin va kutish belgisi aylanmasin (uni yashir — kutish yozuvi yetadi); yangi holat harakatsiz almashsin: yozuv, kulrang kartalar va yangi qiymat ko'rinib tursin. Sozlamani qanday o'qiganingni ayt.", ru: '2) Если на устройстве включено уменьшение движения — этой анимации не будет и значок ожидания не вращается (скрой его — надписи ожидания достаточно); новое состояние меняется без движения: надпись, серые карточки и новое значение остаются видны. Скажи, как ты прочитал настройку.' },
  { uz: "Nima buzilmasin: 1–2-amaliyotdagi tugma va kulrang kartalar avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: кнопка и серые карточки из 1–2-й практики пусть работают как прежде. Новый экран или новую функцию не добавляй. Новую библиотеку для анимации не добавляй — сделай тем, что есть в проекте. Файлы `.env` не трогай. Другие места не трогай, назови изменённые файлы.' }
];
const A3_YORDAM = [
  { uz: "Qayerda: `mobil/` — «O'yin» ekranidagi son; 1–2-amaliyotdagi «Qo'shilaman» tugmasi va «O'yinlar» ekranidagi kulrang kartalar. Backend kodiga tegma.", ru: 'Где: `mobil/` — число на экране «O\'yin»; кнопка «Qo\'shilaman» из 1–2-й практики и серые карточки на экране «O\'yinlar». Код Backend не трогай.' },
  { uz: "Nima qilsin: 1) Qo'shilish muvaffaqiyatli bo'lganda son («8 / 10» → «9 / 10») bir lahza biroz kattalashib, o'z o'lchamiga qaytsin (davomi — loyihada bor animatsiya vaqti). Animatsiya bir marta o'ynasin; son boshqa sabab bilan o'zgarsa (jonli son) — animatsiya bo'lmasin.", ru: 'Что сделать: 1) Когда присоединение прошло успешно, число («8 / 10» → «9 / 10») на мгновение чуть увеличится и вернётся к своему размеру (длительность — время анимации, которое уже есть в проекте). Анимация проигрывается один раз; если число меняется по другой причине (живое число) — анимации нет.' },
  { uz: "2) Telefonda harakatni kamaytirish yoqilgan bo'lsa — React Native `AccessibilityInfo` orqali bil (brauzer ko'rinishida u `prefers-reduced-motion` ni o'qiydi) — son kattalashmasin, kutish belgisi yashirinsin (aylanuvchi belgi harakatsiz qolmasin); yangi holat harakatsiz almashsin: «Qo'shilmoqda…» yozuvi, kulrang kartalar va yangi son ko'rinib tursin.", ru: '2) Если на телефоне включено уменьшение движения — узнай через React Native `AccessibilityInfo` (в браузерной версии он читает `prefers-reduced-motion`) — число не увеличивается, значок ожидания скрыт (вращающийся значок не должен застыть); новое состояние меняется без движения: надпись «Qo\'shilmoqda…», серые карточки и новое число остаются видны.' },
  { uz: "Nima buzilmasin: «Qo'shilaman» tugmasi va kulrang kartalar avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: кнопка «Qo\'shilaman» и серые карточки пусть работают как прежде. Новый экран или новую функцию не добавляй. Новую библиотеку для анимации не добавляй — сделай тем, что есть в проекте. Файлы `.env` не трогай. Другие места не трогай, назови изменённые файлы.' }
];
const A3_KOD = [{ uz: "Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: harakatni kamaytirish sozlamasi o'qiladigan qator va son animatsiyasi boshlanadigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.", ru: 'Покажи в своём коде два места с именем файла и номером строки: строку, где читается настройка уменьшения движения, и строку, где начинается анимация числа. Скажи одним предложением, что делает каждая. Код не меняй.' }];
const A3Natija = () => {
  const { trek } = useTrek();
  const kadr = useKadr(2, 1600);
  return (
    <span className="py-an">
      <span className="py-ikki-q">
        <span className="py-ikki-u"><span className="py-ikki-y">{tr({ uz: 'odatdagi', ru: 'обычно' })}</span>
          <IlovaEkran kichik ekran="oyin" tugma={kadr ? 'qoshildingiz' : 'qoshilmoqda'} son={kadr} pop={kadr === 1} /></span>
        <span className="py-ikki-u"><span className="py-ikki-y mono">prefers-reduced-motion: reduce</span>
          <IlovaEkran kichik ekran="oyin" spin={false} tugma={kadr ? 'qoshildingiz' : 'qoshilmoqda'} son={kadr} /></span>
      </span>
      <span className="py-term">
        {trek === 'web'
          ? <><span className="py-term-q">git push</span><span className="py-term-q ok">Netlify · maydon-jamoa-….netlify.app</span></>
          : <><span className="py-term-q">$ netlify deploy --prod --dir dist</span><span className="py-term-q ok">https://maydon-jamoa-….netlify.app</span></>}
      </span>
    </span>
  );
};
const ScreenA3 = (props) => {
  const { trek } = useTrek();
  const avto = { '{ilova papkasi}': papkaOl(trek) };
  const mobil = trek !== 'web', web = trek !== 'mobil';
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 3 · o'z repo'ngiz", ru: 'Практика 3 · ваш репозиторий' }}
      title={{ uz: <>Natijada ekran <span className="italic" style={{ color: T.accent }}>kichik harakat bilan</span> javob bersin.</>, ru: <>Пусть экран отвечает на результат <span className="italic" style={{ color: T.accent }}>небольшим движением</span>.</> }}
      mentor={{ uz: "Animatsiya qisqa bo'lsin va harakat kamaytirilganda o'chsin; «1 · Ochish»dan boshlang.", ru: 'Анимация короткая и выключается при уменьшении движения; начните с «1 · Открыть».' }}
      steps={[
        { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "o'z repo'ngiz, 2-amaliyotdan keyingi kod. Demo yo'lingiz oxirida nima o'zgaradi — son, yozuv yoki belgi? Shu joyda qanday kichik harakat bo'lsin? (Mentor misolida: «O'yin» ekranidagi son «8 / 10» → «9 / 10» bir lahza kattalashib qaytadi.)", ru: 'ваш репозиторий, код после 2-й практики. Что меняется в конце вашего пути демо — число, надпись или значок? Какое небольшое движение должно быть в этом месте? (В примере Ментора: число на экране «O\'yin» «8 / 10» → «9 / 10» на мгновение увеличивается и возвращается.)' })}
          <Band>{tr({ uz: "9-Modul qoidasi: harakat «bajarildi» deb javob bersin — uzoq, takrorlanadigan yoki ekran bo'ylab katta harakat ortiqcha.", ru: 'Правило 9-го модуля: движение отвечает «выполнено» — долгое, повторяющееся или большое движение по экрану лишнее.' })}</Band></> },
        { h: { uz: 'Prompt', ru: 'Промпт' }, t: <>{tr({ uz: "qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}
          <span className="py-vazifa">{tr({ uz: "Ish bajarilganda ekrandagi o'zgarish kichik animatsiya bilan ko'rinadi; harakat kamaytirilgan qurilmada uch joyda ham animatsiya o'chadi, holat qoladi.", ru: 'Когда работа выполнена, изменение на экране видно с небольшой анимацией; на устройстве с уменьшенным движением во всех трёх местах анимация выключается, состояние остаётся.' })}</span>
          <PyPrompt satrlar={A3_PROMPT} avto={avto}
            joylar={[
              ...(avto['{ilova papkasi}'] ? [] : [{ id: 'papka', joy: '{ilova papkasi}', namuna: { uz: 'mobil/ yoki prototip/', ru: 'mobil/ или prototip/' } }]),
              { id: 'joy', joy: '{muvaffaqiyat joyi}', namuna: { uz: "masalan: «O'yin» ekranidagi son «8 / 10»", ru: 'например: число «8 / 10» на экране «O\'yin»' } },
              { id: 'harakat', joy: '{qanday harakat}', namuna: { uz: "masalan: son biroz kattalashib, o'z o'lchamiga qaytsin", ru: 'например: число чуть увеличится и вернётся к своему размеру' } }
            ]} />
          <Yordam satrlar={A3_YORDAM} ost={{ uz: "Web-trekda: `prototip/` da sozlama `prefers-reduced-motion` orqali o'qiladi (9-Modul: `@media (prefers-reduced-motion: reduce)`); qolgani o'sha.", ru: 'В веб-треке: в `prototip/` настройка читается через `prefers-reduced-motion` (9-й модуль: `@media (prefers-reduced-motion: reduce)`); остальное то же.' }} /></> },
        { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: <>{tx({ uz: "lokal ko'ring (mobil — `npx expo start`, web — `npm run dev`: asosiy tugma bosilganda kichik animatsiya chiqadimi); `git status` — o'zgargan fayllar agent aytgani bilan bir xil. Push va yangi versiya — 4-qadam oxirida.", ru: 'посмотрите локально (мобильный — `npx expo start`, веб — `npm run dev`: появляется ли небольшая анимация при нажатии главной кнопки); `git status` — изменённые файлы совпадают с тем, что сказал агент. Push и новая версия — в конце 4-го шага.' })}
          <Band>{tr({ uz: "Agent ishlayotganda agentga («Nusxalash» bilan):", ru: 'Пока агент работает — агенту (через «Скопировать»):' })}</Band>
          <PyPrompt satrlar={A3_KOD} /></>, xato: XATO_YOL },
        { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: <>{tr({ uz: "avval lokal, hakam ko'radigandek (kompyuter brauzerida, laptopda):", ru: 'сначала локально, как увидит судья (в браузере на компьютере, на ноутбуке):' })}
          <Band>{tr({ uz: "(1) Lokal ilovada DevTools → Network → «Slow 4G». Demo yo'lini boshidan oxirigacha bosib chiqing: kulrang kartalar → asosiy tugma bosilishi bilan o'zgaradi → natijada kichik animatsiya. «O'yindan chiqish» bilan holatni boshiga qaytaring.", ru: '(1) В локальном приложении DevTools → Network → «Slow 4G». Пройдите путь демо от начала до конца: серые карточки → главная кнопка меняется сразу при нажатии → в результате небольшая анимация. Верните состояние к началу через «O\'yindan chiqish».' })}</Band>
          <Band>{tx({ uz: "(2) Rendering bo'limini oching: Ctrl + Shift + P (Mac: Cmd + Shift + P) → «rendering» deb yozing → «Show Rendering». «Emulate CSS media feature prefers-reduced-motion» ro'yxatidan `prefers-reduced-motion: reduce` ni tanlang va sahifani yangilang. Demo yo'lini yana bosib chiqing: aylanish va kattalashish yo'q (kutish belgisi yashirin, yozuv bor) — yozuv, kulrang kartalar va yangi son ko'rinib turadi. Holatni boshiga qaytaring.", ru: '(2) Откройте раздел Rendering: Ctrl + Shift + P (Mac: Cmd + Shift + P) → напишите «rendering» → «Show Rendering». В списке «Emulate CSS media feature prefers-reduced-motion» выберите `prefers-reduced-motion: reduce` и обновите страницу. Пройдите путь демо ещё раз: вращения и увеличения нет (значок ожидания скрыт, надпись есть) — надпись, серые карточки и новое число видны. Верните состояние к началу.' })}</Band>
          <Band>{tr({ uz: "(3) Rendering'da tanlovni «No emulation» ga, Network'da «No throttling» ga qaytaring.", ru: '(3) Верните в Rendering выбор «No emulation», в Network — «No throttling».' })}</Band>
          <Band>{tx({ uz: '(4) Kutilganidek bo\'lsa — `git add <fayl>` → `git commit -m "sayqal: muvaffaqiyat va harakatni kamaytirish"` → `git push`; keyin yangi versiya:', ru: '(4) Если как ожидалось — `git add <fayl>` → `git commit -m "sayqal: muvaffaqiyat va harakatni kamaytirish"` → `git push`; затем новая версия:' })}</Band>
          {mobil && <Band>{tx({ uz: "mobil trek — brauzer ko'rinishi: `mobil/` da `npx expo export -p web`, keyin `netlify deploy --prod --dir dist` (12-Modul buyruqlari; push'dan keyin o'zi yangilanmaydi)", ru: 'мобильный трек — браузерная версия: в `mobil/` `npx expo export -p web`, затем `netlify deploy --prod --dir dist` (команды 12-го модуля; после push сама не обновляется)' })}</Band>}
          {web && <Band>{tr({ uz: "web-trek — push'dan keyin Netlify saytni odatda o'zi yangilaydi; bir necha daqiqa kuting (kutayotganda — kodni ko'rsatadigan prompt).", ru: 'веб-трек — после push Netlify обычно обновляет сайт сам; подождите несколько минут (пока ждёте — промпт, показывающий код).' })}</Band>}
          <Band>{tr({ uz: "(5) Yangi versiyada bir marta demo yo'lini bosib chiqing (deploy'dagi qisqa tekshiruv); telefoningizda bir marta ochish (mobil — Expo Go yoki telefon brauzeri; web — sayt) — ixtiyoriy, vaqt bo'lsa. Holatni boshiga qaytaring.", ru: '(5) Пройдите путь демо один раз в новой версии (короткая проверка на деплое); открыть один раз на своём телефоне (мобильный — Expo Go или браузер телефона; веб — сайт) — по желанию, если есть время. Верните состояние к началу.' })}</Band>
          <Band>{tr({ uz: "Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.» → lokal qayta tekshiring, keyin push.", ru: 'Несовпадение напишите агенту: «{nima} talabdagidek emas: {qanday bo\'lsin}. Boshqa joyga tegma, o\'zgargan fayllarni ayt.» → проверьте снова локально, потом push.' })}</Band></> }
      ]}
      natija={<A3Natija />}
      ulgur={{ uz: "Ulgurmasangiz: (5) dagi telefonda ko'rishni o'tkazib yuboring — kompyuterdagi tekshiruv asosiy. Avvalgi bloklarning 4-qadami qolgan bo'lsa — shu yerdagi (1) va (2) bilan birga qiling, keyin push (o'sha bloklarda ham «Bajardim»). «Davom etish» 4-qadamdan keyin ochiladi.", ru: 'Если не успеваете: пропустите просмотр на телефоне в (5) — главная проверка на компьютере. Если в прошлых блоках остался 4-й шаг — сделайте его вместе с (1) и (2) здесь, потом push (и «Готово» в тех блоках). «Продолжить» откроется после 4-го шага.' }}
      doneText={{ uz: "Natijada kichik animatsiya bor; harakat kamaytirilganda holat qoldi.", ru: 'В результате есть небольшая анимация; при уменьшении движения состояние осталось.' }}
      izoh={trek === 'mobil' ? { uz: "APK o'zi yangilanmaydi — bugun demo brauzer ko'rinishida tekshirildi.", ru: 'APK сам не обновляется — сегодня демо проверено в браузерной версии.' } : null}
      ustoz={[
        { uz: "Rendering bo'limi topilmasa — DevTools'ning «More tools» menyusida ham bor; Chrome versiyasiga qarab joyi o'zgarishi mumkin. Emulyatsiya faqat shu oynada ishlaydi. Netlify yangilanishini kutayotganda — kodni ko'rsatadigan prompt.", ru: 'Если раздел Rendering не находится — он есть и в меню DevTools «More tools»; в зависимости от версии Chrome его место может меняться. Эмуляция работает только в этом окне. Пока ждём обновления Netlify — промпт, показывающий код.' },
        { uz: "Animatsiya bir xil emas — o'quvchi o'z harakatini tanlaydi; ortiqcha harakat (uzun, takrorlanadigan, ekran bo'ylab) bo'lsa — 9-Modul qoidasini eslating. Sinfda kimning animatsiyasi «chiroyliroq» ekani solishtirilmaydi.", ru: 'Анимация у всех разная — ученик выбирает своё движение; если движение лишнее (долгое, повторяющееся, по всему экрану) — напомните правило 9-го модуля. В классе не сравниваем, чья анимация «красивее».' }
      ]} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); ko'rinishi qolipda (QKartochka), orqa yuz neytral (P10)
const KARTALAR = [
  { front: { uz: 'Sayqal nima?', ru: 'Что такое шлифовка?' }, back: { uz: "Demo yo'lidagi kichik o'zgarishlar: bosish javobi, yuklanish holati va muvaffaqiyat", ru: 'Небольшие изменения на пути демо: ответ на нажатие, состояние загрузки и успех' }, note: { uz: "Yangi funksiya qo'shilmaydi. Inglizchasi: polish", ru: 'Новая функция не добавляется. По-английски: polish' } },
  { front: { uz: "Mentor misolida demo yo'li qaysi ekranlardan iborat?", ru: 'Из каких экранов состоит путь демо в примере Ментора?' }, back: { uz: "«O'yinlar» va «O'yin» ekranlaridan", ru: 'Из экранов «O\'yinlar» и «O\'yin»' }, note: { uz: "Hakam ularni proyektorda ko'radi", ru: 'Судья видит их на проекторе' } },
  { front: { uz: 'Bosish javobi nima?', ru: 'Что такое ответ на нажатие?' }, back: { uz: "Tugma bosilishi bilan o'z holatini o'zgartirishi", ru: 'Кнопка меняет своё состояние сразу при нажатии' }, note: { uz: 'Javob kelguncha tugma qayta bosilmaydi', ru: 'До ответа кнопка повторно не нажимается' } },
  { front: { uz: "Mentor misolida «Qo'shilaman» bosilgach nima chiqadi?", ru: 'Что появляется в примере Ментора после нажатия «Qo\'shilaman»?' }, back: { uz: "«Qo'shilmoqda…» yozuvi va kichik kutish belgisi", ru: 'Надпись «Qo\'shilmoqda…» и маленький значок ожидания' }, note: { uz: "Javob kelgach — «Qo'shildingiz»", ru: 'После ответа — «Qo\'shildingiz»' } },
  { front: { uz: 'Joy egallovchi nima?', ru: 'Что такое заполнитель?' }, back: { uz: "Yuklanayotganda ma'lumot o'rnida turadigan kulrang shakl", ru: 'Серая форма, которая стоит на месте данных во время загрузки' }, note: { uz: 'Inglizchasi: skeleton', ru: 'По-английски: skeleton' } },
  { front: { uz: "Kulrang kartalar qanday o'lchamda bo'ladi?", ru: 'Какого размера серые карточки?' }, back: { uz: "Haqiqiy kartalarga yaqin o'lchamda", ru: 'Близкого к настоящим карточкам размера' }, note: { uz: "Ro'yxat kelgandagi katta siljishni kamaytiradi", ru: 'Уменьшает большой сдвиг, когда приходит список' } },
  { front: { uz: 'Kutish yozuvi va kulrang kartalarning farqi nima?', ru: 'Чем отличаются надпись ожидания и серые карточки?' }, back: { uz: "Yozuv kutish borligini aytadi, kartalar nima kelishini ko'rsatadi", ru: 'Надпись говорит, что ожидание идёт, карточки показывают, что придёт' }, note: { uz: 'Mentor misolida ikkalasi birga turadi', ru: 'В примере Ментора они стоят вместе' } },
  { front: { uz: "Muvaffaqiyat animatsiyasi qanday bo'ladi?", ru: 'Какой бывает анимация успеха?' }, back: { uz: 'Qisqa va bir marta', ru: 'Короткой и однократной' }, note: { uz: 'Mentor misolida son bir lahza kattalashib qaytadi', ru: 'В примере Ментора число на мгновение увеличивается и возвращается' } },
  { front: { uz: "Bu darsda harakat kamaytirilsa nima o'chadi?", ru: 'Что выключается на этом уроке при уменьшении движения?' }, back: { uz: 'Harakat: aylanish va kattalashish', ru: 'Движение: вращение и увеличение' }, note: { uz: 'Holat qoladi: yozuv, kulrang kartalar, yangi son', ru: 'Состояние остаётся: надпись, серые карточки, новое число' } },
  { front: { uz: "Saytda harakat kamaytirilganini nima ko'rsatadi?", ru: 'Что показывает сайту, что движение уменьшено?' }, back: { uz: '`prefers-reduced-motion`', ru: '`prefers-reduced-motion`' }, note: { uz: "Telefondagi ilova buni telefon sozlamasidan o'qiydi", ru: 'Приложение на телефоне читает это из настройки телефона' } },
  { front: { uz: 'Javobni sekin qilib qanday tekshirasiz?', ru: 'Как проверить ответ, сделав его медленным?' }, back: { uz: "DevTools'da Network bo'limida «Slow 4G» bilan", ru: 'В DevTools, в разделе Network, со «Slow 4G»' }, note: { uz: "Keyin «No throttling» ga qaytaring", ru: 'Потом верните «No throttling»' } },
  { front: { uz: "Animatsiya uchun nega yangi kutubxona qo'shilmaydi?", ru: 'Почему для анимации не добавляют новую библиотеку?' }, back: { uz: 'Yuklanadigan kod hajmi oshishi mumkin', ru: 'Может вырасти объём загружаемого кода' }, note: { uz: 'Loyihada bor vosita bilan qilinadi', ru: 'Делается тем, что есть в проекте' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className={cx('py-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tx(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="py-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (texnik darslar standarti, 172/192/204; SABOQ E 50 — «Bugungi asosiy fikr» yo'q). Sarlavha blok bayroqlari va tekshiruv kartalaridan (E 54) =====
const YAKUN_SARLAVHA = {
  toliq: { uz: "Demo yo'lidagi uch joy o'zgardi va tekshirildi.", ru: 'Три места на пути демо изменены и проверены.' },
  boshqacha: { uz: 'Sayqal qilindi — tuzatiladigan joy qoldi.', ru: 'Шлифовка сделана — осталось место для исправления.' },
  ikki: { uz: "Bosish va yuklanish tayyor — muvaffaqiyat qoldi.", ru: 'Нажатие и загрузка готовы — остался успех.' },
  tugamagan: { uz: 'Sayqal boshlandi — qolgan joylar hali tugamagan.', ru: 'Шлифовка начата — остальные места ещё не закончены.' },
  hech: { uz: "Demo yo'li hali sayqallanmagan — bloklarni bajaring.", ru: 'Путь демо ещё не отшлифован — выполните блоки.' }
};
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
  // Blok holati: bajarildi (4-qadam «Bajardim») va tekshiruv kartasi ('ok' | 'boshqa' | null); ustunlik tartibi — MD
  const blok = (id) => { const i = SCREEN_META.findIndex(m => m.id === id); const a = answers[i]; return { ok: !!(a && a.solved), tk: (a && a.tekshiruv) || null }; };
  const a1 = blok('a1'), a2 = blok('a2'), a3 = blok('a3');
  const kut = (b) => b.ok && b.tk === 'ok';
  const holat = kut(a1) && kut(a2) && kut(a3) ? 'toliq'
    : [a1, a2, a3].some(b => b.ok && b.tk === 'boshqa') ? 'boshqacha'
      : kut(a1) && kut(a2) && !a3.ok ? 'ikki'
        : a1.ok || a2.ok || a3.ok ? 'tugamagan' : 'hech';
  const uchala = a1.ok && a2.ok && a3.ok; // ✓ yorlig'i — uchala blok bayrog'i AND (04-FILTR 28)
  const RECAP = [
    { uz: "Sayqal — demo yo'lidagi kichik o'zgarishlar; yangi funksiya qo'shilmaydi.", ru: 'Шлифовка — небольшие изменения на пути демо; новая функция не добавляется.' },
    { uz: "Bosish javobi: tugma bosilishi bilan o'zgaradi va javob kelguncha qayta bosilmaydi.", ru: 'Ответ на нажатие: кнопка меняется сразу при нажатии и до ответа повторно не нажимается.' },
    { uz: "Joy egallovchi haqiqiy kontentga yaqin joy egallasa, ro'yxat kelgandagi katta siljishni kamaytiradi.", ru: 'Если заполнитель занимает место, близкое к настоящему содержимому, он уменьшает большой сдвиг, когда приходит список.' },
    { uz: "Bu darsdagi muvaffaqiyat animatsiyasi qisqa va bir martalik — ish bajarilganini ko'rsatadi.", ru: 'Анимация успеха на этом уроке короткая и однократная — показывает, что работа выполнена.' },
    { uz: "Bu demo yo'lida harakat kamaytirilsa, harakat o'chadi; yozuv, kulrang kartalar va yangi son qoladi.", ru: 'На этом пути демо при уменьшении движения движение выключается; надпись, серые карточки и новое число остаются.' }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cx('py-yakun', !uchala && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Uch blok bajarildi', ru: 'Три блока выполнены' })}
          togri={correct} jami={total}
          sarlavha={tr(YAKUN_SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="py-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«Guruh pitchingizda nimani tuzatishni aytadi?»</b></>, ru: <>Следующий урок — <b>«Что группа скажет исправить в вашем питче?»</b></> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PolishDayLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen4, Screen5, ScreenA2, Screen7, ScreenA3, ScreenPodium, ScreenFlashcards, SummaryScreen];
  const trekVal = { trek: answers.trek === 'mobil' || answers.trek === 'web' ? answers.trek : null, setTrek: (t) => setAnswers(a => ({ ...a, trek: t })) }; // trek tanlovi — dars holatida (ccProgress), boshqa darsning kalitiga yozilmaydi
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
        /* === 14-Modul 4-dars — demo yo'li sahnasi va bloklar (py- prefiksi). Faqat qolip tokenlari (D3) + «Maydon Jamoa» nomi rangi; emoji yo'q (D4) === */
        .py-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: py-puls 2.2s ease-out .3s 3; }
        @keyframes py-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        .py-chorla .q-variant:not(:disabled), .py-kirish.faol .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: py-chorla-v 1.8s ease-out .5s 2; }
        .py-chorla .q-variant:nth-child(2), .py-kirish.faol .q-variant:nth-child(2), .py-chorla .q-chip:nth-child(2) { animation-delay: .75s; }
        .py-chorla .q-variant:nth-child(3), .py-kirish.faol .q-variant:nth-child(3) { animation-delay: 1s; }
        .py-chorla .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: py-chorla-c 1.8s ease-out .5s 2; }
        @keyframes py-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes py-chorla-c { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.38)}; } 70%, 100% { box-shadow: 0 0 0 8px ${fon(T.accent, 0)}; } }
        .py-bash-ix { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; color: ${T.ink2}; }
        .py-bash-l { font-size: 11.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
        .py-bash-ix b { color: ${T.ink}; }
        .py-x-tx { display: block; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; margin-bottom: 4px; }
        .py-x-tx.ok b { color: ${T.ok}; } .py-x-tx b.yoq { color: ${T.err}; }
        .py-x-m { display: block; }
        .py-x-iz { display: block; margin-top: 6px; font-size: 13.5px; font-weight: 500; color: ${T.ink2}; }
        p.py-nom { margin: 0; padding: 8px 12px; border-radius: 10px; background: ${T.accentSoft}; color: ${T.ink}; font-size: 14.5px; font-weight: 600; line-height: 1.45; }
        .py-ustoz { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .py-ustoz b { color: ${T.ink}; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; }
        /* Sahna: brauzer oynasi (o'lcham barqaror) va ichida telefon kengligidagi ilova */
        .py-v { width: 100%; }
        .py-sahna { display: grid; grid-template-columns: minmax(0, 420px) minmax(0, 1fr); gap: 22px; align-items: start; }
        .py-sahna.py-tug { align-items: center; }
        .py-chap, .py-ung { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .py-br-ust { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 420px; }
        .py-br-y { display: flex; justify-content: space-between; align-items: flex-end; gap: 10px; font-size: 13px; font-weight: 700; color: ${T.ink2}; min-height: 17px; }
        .py-br { border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; box-shadow: 0 14px 30px -20px rgba(${T.shadowBase},0.45); }
        .py-br-bar { display: flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .py-br-bar > i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; flex: none; }
        .py-br-bar code { margin-left: 8px; flex: 1; min-width: 0; padding: 3px 10px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.ink2}; white-space: nowrap; }
        .py-br-ust.past .py-br-tana { height: 236px; }
        .py-br-tana { height: 272px; display: flex; justify-content: center; background: ${T.bg}; }
        .py-app { width: 258px; height: 100%; display: flex; flex-direction: column; background: ${T.paper}; border-left: 1px solid ${T.line}; border-right: 1px solid ${T.line}; }
        .py-app-bar { padding: 10px 14px; border-bottom: 1px solid ${T.line}; font-size: 15px; }
        .py-app-t { flex: 1; display: flex; flex-direction: column; gap: 9px; padding: 12px 14px; }
        .py-app-h { font-size: 17px; font-weight: 800; color: ${T.ink}; }
        .py-royxat { display: flex; flex-direction: column; gap: 9px; }
        .py-royxat.tinch { opacity: .5; }
        .py-kutish { font-size: 14px; line-height: 1.4; color: ${T.ink2}; }
        .py-app-iz { align-self: flex-start; padding: 2px 9px; border-radius: 99px; background: ${T.bg}; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .py-ok, .py-kk { position: relative; height: 66px; border-radius: 10px; flex: none; }
        .py-ok { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid ${T.line}; background: ${T.paper}; }
        .py-ok.yangi { animation: py-kir .35s ease-out both; }
        .py-ok-m { display: flex; flex-direction: column; gap: 2px; font-size: 14px; color: ${T.ink2}; }
        .py-ok-m b { color: ${T.ink}; font-size: 14.5px; }
        .py-ok-s { font-size: 15px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .py-kk { display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 0 12px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .py-kk i { display: block; height: 9px; width: 62%; border-radius: 5px; background: ${T.line}; }
        .py-kk i + i { width: 44%; } .py-kk i.o { position: absolute; right: 12px; top: 28px; width: 34px; }
        .py-kk.sonadi { animation: py-son-ot .6s ease-out .2s both; }
        @keyframes py-son-ot { to { opacity: 0; } }
        @keyframes py-kir { from { opacity: 0; } to { opacity: 1; } }
        .py-orqa { font-size: 14px; font-weight: 700; color: ${MAYDON_RANG}; }
        .py-oyin-m { display: flex; flex-direction: column; gap: 2px; font-size: 14px; color: ${T.ink2}; }
        .py-oyin-m b { font-size: 16px; color: ${T.ink}; }
        .py-son { display: block; align-self: flex-start; font-size: 32px; font-weight: 800; color: ${T.ink}; line-height: 1.1; transform-origin: left center; }
        .py-son.pop { animation: py-pop .55s ease-out 1; }
        @keyframes py-pop { 0% { transform: none; } 40% { transform: scale(1.22); } 100% { transform: none; } }
        .py-tugma { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 14px; border-radius: 10px; border: none; font: inherit; font-size: 15px; font-weight: 800; color: #fff; background: ${MAYDON_RANG}; cursor: default; overflow: visible; }
        button.py-tugma { cursor: pointer; }
        .py-tugma.qoshilmoqda { background: ${T.ink2}; }
        .py-tugma.qoshildingiz { background: ${T.paper}; color: ${MAYDON_RANG}; box-shadow: inset 0 0 0 2px ${MAYDON_RANG}; }
        .py-spin { width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${fon('#FFFFFF', 0.45)}; border-top-color: #fff; animation: py-ayl .8s linear infinite; flex: none; }
        @keyframes py-ayl { to { transform: rotate(360deg); } }
        .py-bos { position: absolute; left: 50%; top: 50%; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; border: 2px solid ${T.accent}; background: ${fon(T.accent, 0.18)}; pointer-events: none; animation: py-bos .7s ease-out both; }
        @keyframes py-bos { from { transform: scale(.4); opacity: 1; } to { transform: scale(1.4); opacity: 0; } }
        .py-ikki { display: flex; align-items: center; gap: 6px; font-size: 13px; color: ${T.ink2}; }
        .py-ikki i { width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${T.accent}; }
        .py-ikki i + i { border-color: ${T.ink2}; border-style: dashed; }
        .py-ikki em { font-style: normal; font-weight: 700; }
        .py-sekin { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        /* Demo yo'li chizig'i */
        .py-dy { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding-top: 2px; }
        .py-dy::before { content: ''; position: absolute; left: 16.6%; right: 16.6%; top: 13px; height: 2px; background: ${T.line}; }
        .py-dy-n { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center; min-height: 64px; }
        .py-dy-d { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-size: 13px; font-weight: 800; background: ${T.paper}; border: 2px solid ${T.line}; color: #fff; transition: background .3s, border-color .3s; }
        .py-dy-n.qizil .py-dy-d { background: ${T.err}; border-color: ${T.err}; }
        .py-dy-n.yashil .py-dy-d { background: ${T.ok}; border-color: ${T.ok}; }
        .py-dy-n b { font-size: 14px; color: ${T.ink}; }
        .py-dy-y { font-size: 13px; line-height: 1.3; color: ${T.ink2}; }
        .py-dy-n.qizil .py-dy-y { color: ${T.err}; } .py-dy-n.yashil .py-dy-y { color: ${T.ok}; }
        .py-jim { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .py-jim-n { padding: 3px 10px; border-radius: 99px; background: ${T.paper}; border: 1px solid ${T.line}; white-space: nowrap; }
        .py-jim-o { text-align: center; padding: 3px 8px; border-top: 2px dashed ${T.line}; color: ${T.ink2}; font-weight: 600; }
        /* Oldin / Keyin, sahna tugmasi, hisoblagich, kalit, jadval */
        .py-rejim { display: inline-flex; align-self: flex-start; gap: 4px; padding: 3px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .py-rj { padding: 6px 16px; border-radius: 8px; border: none; font: inherit; font-size: 14px; font-weight: 800; color: ${T.ink2}; background: transparent; }
        .py-rj.on { background: ${T.accentSoft}; color: ${T.accent}; }
        .py-rj.xira { opacity: .45; }
        button.py-rj { cursor: pointer; }
        .py-amal { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; }
        .py-btn { display: inline-flex; align-items: center; height: 40px; padding: 0 16px; border-radius: 10px; border: 1.5px solid ${T.accent}; background: ${T.paper}; color: ${T.accent}; font: inherit; font-size: 14.5px; font-weight: 800; }
        button.py-btn { cursor: pointer; }
        .py-btn.xira { opacity: .45; border-color: ${T.line}; color: ${T.ink2}; }
        .py-hisob { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; color: ${T.ink2}; padding: 4px 10px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; white-space: nowrap; transition: color .3s, border-color .3s; }
        .py-hisob.on { color: ${T.accent}; border-color: ${T.accent}; animation: py-chorla-c 1.4s ease-out 1; }
        p.py-joriy { margin: 0; font-size: 14.5px; font-weight: 600; color: ${T.ink}; line-height: 1.45; }
        .py-kalit { display: inline-flex; align-self: flex-start; align-items: center; gap: 10px; padding: 8px 14px 8px 10px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; font: inherit; font-size: 14.5px; font-weight: 700; color: ${T.ink}; }
        button.py-kalit { cursor: pointer; }
        .py-kalit.kichik { padding: 5px 10px 5px 7px; font-size: 13px; gap: 8px; }
        .py-sw { position: relative; width: 36px; height: 20px; border-radius: 99px; background: ${T.line}; flex: none; transition: background .25s; }
        .py-sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(${T.shadowBase},0.35); transition: transform .25s; }
        .py-kalit.on .py-sw { background: ${T.ok}; } .py-kalit.on .py-sw::after { transform: translateX(16px); }
        .py-hj { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .py-hj-b, .py-hj-q { display: grid; grid-template-columns: 1fr 120px; gap: 10px; padding: 6px 14px; font-size: 14px; }
        .py-hj-b { background: ${T.bg}; font-size: 12.5px; letter-spacing: .05em; text-transform: uppercase; color: ${T.ink2}; }
        .py-hj-q + .py-hj-q, .py-hj-b + .py-hj-q { border-top: 1px solid ${T.line}; }
        .py-hj-q { color: ${T.ink}; min-height: 34px; align-items: center; }
        .py-hj-q.qoldi .py-hj-m b { color: ${T.ok}; } .py-hj-q.ochdi .py-hj-m b { color: ${T.ink2}; }
        .py-hj-q.qoldi { background: ${fon(T.ok, 0.06)}; }
        .py-hj-ust.fokus .py-hj-q.qoldi .py-hj-m b { font-size: 15px; }
        /* Test vizuali (javobdan keyin): telefon maketi */
        .py-qv { display: flex; align-items: center; gap: 14px; margin-top: 10px; }
        .py-tel { display: flex; flex-direction: column; gap: 8px; width: 150px; padding: 18px 12px 14px; border-radius: 22px; border: 2px solid ${T.ink}; background: ${T.paper}; }
        .py-tel-q { display: block; height: 8px; width: 80%; border-radius: 4px; background: ${T.line}; }
        .py-tel-q.qisqa { width: 55%; }
        .py-tel.son .py-tel-q { display: none; }
        .py-tel-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 34px; border-radius: 9px; background: ${T.ink}; color: #fff; font-size: 13.5px; font-weight: 800; }
        .py-tel-btn.kul { background: ${T.ink2}; }
        .py-tel-son { font-size: 26px; font-weight: 800; text-align: center; color: ${T.ink}; }
        /* Amaliyot bloklari */
        .py-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .py-blok.tugadi .q-blok-qadamlar { display: none; }
        .py-blok.tugadi .py-dt, .py-blok.tugadi .py-term { display: none; }
        .py-band { display: block; margin-top: 8px; }
        .py-kulrang { display: block; margin-top: 6px; font-size: 13.5px; color: ${T.ink2}; }
        .py-vazifa { display: block; margin: 8px 0; padding: 8px 12px; border-left: 3px solid ${T.accent}; background: ${T.paper}; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; }
        .py-prompt { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .py-ps { display: block; font-size: 14px; line-height: 1.55; }
        .py-joylar { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
        .py-joy-m { display: flex; flex-direction: column; gap: 3px; }
        .py-joy-n { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.accent}; }
        .py-joy-m input { font: inherit; font-size: 14px; padding: 8px 10px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; }
        .py-joy-m input::placeholder { color: ${T.ink2}; opacity: .8; }
        .py-xato { display: block; padding: 6px 10px; border-radius: 8px; background: ${T.errFon}; color: ${T.err}; font-size: 13.5px; font-weight: 700; }
        .py-nusxa { white-space: nowrap; }
        .py-yordam-btn { align-self: flex-start; }
        .py-yordam-s { display: block; }
        .py-yordam-ust { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 10px; }
        .py-yordam { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .py-trek { display: inline-flex; gap: 8px; flex-wrap: wrap; }
        .py-tk { display: flex; margin-top: 10px; }
        .py-tk-btnlar { display: inline-flex; gap: 8px; flex-wrap: wrap; }
        .py-tk-btn.ok { background: ${T.okFon}; color: ${T.ok}; border-color: ${T.ok}; }
        .py-tk-btn.err { background: ${T.errFon}; color: ${T.err}; border-color: ${T.err}; }
        p.py-boshqa { margin: 8px 0 0; padding: 8px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; color: ${T.ink2}; }
        p.py-ortda, p.py-ulgur { margin: 10px 0 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .py-an { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .py-an .py-br-ust { max-width: 400px; }
        .py-dt { display: flex; flex-direction: column; width: 100%; max-width: 400px; border-radius: 10px; overflow: hidden; border: 1px solid ${T.line}; background: ${T.paper}; font-size: 13px; }
        .py-dt-tab { display: flex; gap: 14px; padding: 6px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; color: ${T.ink2}; }
        .py-dt-tab i { font-style: normal; } .py-dt-tab b { color: ${T.ink}; border-bottom: 2px solid ${T.accent}; }
        .py-dt-th { padding: 6px 12px; border-bottom: 1px solid ${T.line}; }
        .py-dt-sel { display: inline-block; padding: 2px 10px; border-radius: 6px; border: 1px solid ${T.ink2}; font-weight: 700; color: ${T.ink}; }
        .py-dt-q { display: flex; align-items: center; gap: 8px; padding: 6px 12px; font-weight: 600; color: ${T.ink}; }
        .py-dt-nuq { width: 8px; height: 8px; border-radius: 50%; background: ${T.ok}; }
        .py-ikki-q { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
        .py-ikki-u { display: flex; flex-direction: column; gap: 6px; align-items: center; }
        .py-ikki-y { font-size: 13px; font-weight: 700; color: ${T.ink2}; text-align: center; }
        .py-app.kichik { width: 100%; max-width: 210px; height: auto; border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; }
        .py-app.kichik .py-son { font-size: 26px; }
        .py-term { display: flex; flex-direction: column; gap: 3px; width: 100%; max-width: 400px; padding: 10px 14px; border-radius: 10px; background: ${CODE.bg}; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
        .py-term-q { color: ${CODE.attr}; overflow-wrap: anywhere; } .py-term-q.ok { color: ${CODE.str}; }
        /* Reja, kartochka, yakun */
        p.py-reja-ost { margin: 10px 0 0; font-size: 13.5px; line-height: 1.55; color: ${T.ink2}; }
        .py-flash { display: flex; flex-direction: column; gap: 10px; }
        .py-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: py-puls 1.8s ease-out .4s 3; }
        .py-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .py-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.py-fc-ipucha { margin: 0; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; color: ${T.ink2}; }
        p.py-fc-ipucha i { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; }
        @media (min-width: 1200px) { .py-kirish .zoomable:not(.zoom-on) > .zoom-btn { right: auto; left: 382px; top: 64px; } } /* P7: ⛶ brauzer burchagida (QKirish butun splitni o'raydi) */
        .py-yakun { display: contents; }
        .py-yakun.belgisiz .done-chip { display: none; }
        .py-yakun .q-yakun > .ach-coll { order: 6; }
        .py-yakun .q-yakun > p.py-keyingi { order: 5; margin: 0; font-size: 15px; color: ${T.ink2}; }
        .py-yakun .q-yakun > p.py-keyingi b { color: ${T.ink}; }
        .rc-card b.py-rc-n, b.py-rc-n { font-size: 28px; font-weight: 800; color: ${T.accent}; }
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 96vw); max-height: 92vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on), .q-fokus:has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 1199px) { .zoomable:not(.zoom-on) .py-br-y { padding-right: 40px; } }
        @media (max-width: 860px) {
          .py-sahna { grid-template-columns: 1fr; }
          .py-sahna:not(.py-tug) > .py-ung { order: -1; }
          .py-br-ust, .py-an .py-br-ust { max-width: none; }
          .py-ikki-q { grid-template-columns: 1fr; }
        }
        @media (max-width: 420px) {
          .py-app { width: 240px; }
          .py-hj-b, .py-hj-q { grid-template-columns: 1fr 96px; padding: 7px 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .py-halqa, .py-chorla .q-variant, .py-kirish.faol .q-variant, .py-chorla .q-chip, .py-ok.yangi, .py-kk.sonadi, .py-son.pop, .py-bos, .py-hisob.on, .py-flash.yangi .fc-card .fc-front { animation: none !important; }
          .py-kk.sonadi { opacity: 0; }
          .py-spin { display: none; }
          .py-dy-d, .py-sw, .py-sw::after, .py-hisob { transition: none !important; }
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
      <TrekCtx.Provider value={trekVal}>
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
      </TrekCtx.Provider>
      </AchMissCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}
