import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul (LMS) · 15-dars «Roadmap bo'yicha qayerdasiz?» — PM 2-tur, 12 ekran (kalit m9-15, kod papkasi src/9-Modull).
// Manba-haqiqat: feedback/F-1005-11modul/15-PmOneOnOne-v3.md (GATE M). Skeletdan (src/skelet/NamunaDars.jsx) qurilgan, qolip — src/qolip.
// Oqim: kirish → reja → holatlar (tushuncha) → risk (tushuncha) → 1-savol → roadmap'ingizga holat → uch risk → tuzatilgan reja → yakuniy savol → podium → kartochkalar → yakun.
// Saqlanadi: pm-m9d15-reja (7-ekran; 16-dars o'qiydi) = { holatlar: [{ ish, holat }], risklar: [{ risk, qadam, ufq }] × 3, eng, birinchi, savedAt } (tayanch 8, 9.96).
// O'qiydi: pm-m9d6-roadmap (ishlar, hozir), pm-m9d13-sinov (eng, toxtashlar, bajardi, tur, qaytaSinov — 9.90), pm-m9d8-platforma (trek) — yo'q bo'lsa ham ishlaydi (M-q5).
// Ish jarayoni qoralamasi (5–7-ekran orasida): pm-m9d15-qoralama — faqat shu dars ichida. Kod ekrani yo'q (tayanch 4).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m9d15-v1', lessonTitle: { uz: "Roadmap bo'yicha qayerdasiz?", ru: 'Где вы сейчас по roadmap?' } };
// 12 ekran · PM 2-tur (artefakt — holatlar, uch risk va qadam → tuzatilgan reja) · ballik testlar 4, 8 (✔ C · B) · kod ekrani yo'q (tayanch 4)
const HW_TOKENS = [
  { t: { uz: 'qadam', ru: 'шаг' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'risk', ru: 'риск' }, l: 70, tp: 18, s: 12, d: 7.5 },
  { t: { uz: 'reja', ru: 'план' }, l: 40, tp: 70, s: 12, d: 8.5 }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Ishtirok-kalitlar (-1): 2, 3-ekran (ballsiz, nishon bilan) va 5–7-ekran signallari
// («practice», PRACTICE_BASE + ekran — 500+ zona), maxrajga kirmaydi. ✔ o'rni MD dagidek: s4 — C · s8 — B (yangi dars, birinchi marta belgilangan).
const INLINE_KEYS = { s4: 2, s8: 1, holatlar: -1, qadamlar: -1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); PM darsida belgi o'rnida raqam (S-026)
const RECAPS = {
  4: { title: { uz: 'Risk — oldinda', ru: 'Риск — впереди' }, cards: [
    { ic: '1', h: { uz: "Risk — rejaga xalaqit berishi mumkin bo'lgan narsa.", ru: 'Риск — то, что может помешать плану.' } },
    { ic: '2', h: { uz: "Bo'lib o'tgan ish risk emas — uning holati bor: kechikdi yoki bajarildi.", ru: 'Прошедшая работа — не риск: у неё есть статус — «с опозданием» или «выполнено».' } },
    { ic: '3', h: { uz: "Roadmap'ga yordam beradigan narsa ham risk emas.", ru: 'То, что помогает roadmap, — тоже не риск.' }, ask: { uz: "Roadmap'ingizga oldinda nima xalaqit berishi mumkin?", ru: 'Что впереди может помешать вашему roadmap?' } }
  ] },
  8: { title: { uz: "Qadam roadmap'ga yoziladi", ru: 'Шаг записывают в roadmap' }, cards: [
    { ic: '1', h: { uz: 'Har riskka bitta qadam — riskni kamaytiradigan aniq ish.', ru: 'На каждый риск — один шаг: конкретное дело, которое уменьшает риск.' } },
    { ic: '2', h: { uz: "Qadam roadmap'da o'z ufqiga qo'yiladi: qachon boshlana olsa.", ru: 'Шаг ставят в свой горизонт roadmap: когда он сможет начаться.' } },
    { ic: '3', h: { uz: "Holatlar va qadamlar qo'shilgan roadmap — tuzatilgan reja.", ru: 'Roadmap со статусами и шагами — это исправленный план.' }, ask: { uz: 'Birinchi qadamingiz qaysi ufqda turibdi?', ru: 'В каком горизонте стоит ваш первый шаг?' } }
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
  return <div ref={ref} className="oo-test-viz fade-step">{children}</div>;
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 15-dars «Roadmap bo'yicha qayerdasiz?» (MD v3: feedback/F-1005-11modul/15-PmOneOnOne-v3.md, GATE M) =====
// Bitta vizual (163/180): roadmap doskasi RejaDoska (to'liq · ixcham · kichik) — bitta manba: MENTOR_REJA va o'quvchi roadmap'i (pm-m9d6-roadmap).
// Telefon maketi «Maydon Jamoa» (≈170×272, chapda) — 2 va 3-ekranlarda dalil va risk sahnasi.
// qolip-maket: rd-karta rd-qadam rd-ed oo-yulduz
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const jonliDars = (live) => !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
// Harakatsizlikda bitta ipucha (javobni aytmaydi); kalit o'zgarsa sanoq qaytadan boshlanadi
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
// Son sanab o'sadi (SABOQ 19); kam harakat rejimida — darrov
const useSanoq = (son, ms = 80) => {
  const [k, setK] = useState(son);
  useEffect(() => {
    if (k === son) return undefined;
    if (kamHarakat()) { setK(son); return undefined; }
    const t = setTimeout(() => setK(v => v + (son > v ? 1 : -1)), ms);
    return () => clearTimeout(t);
  }, [k, son, ms]);
  return k;
};
// Uchish (SABOQ 19): element eski joyidan yangi joyiga suriladi. Manba to'rtburchagi bosishda olinadi, yangi element (data-uch) chizilgach
// o'sha nuqtadan o'z joyiga keladi. .lesson-root zoom tuzatmasi bilan; kam harakatda — darrov joyida.
const uchir = (r, el, ms = 560) => {
  if (!r || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !r.width) return;
  const z = (el.offsetWidth || g.width) / g.width;
  const dx = ((r.left + r.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((r.top + r.height / 2) - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.4, r.width / g.width));
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
const halqa = (on) => (on ? 'oo-halqa' : undefined);
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="oo-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="oo-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="oo-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
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
  return <p className={cxx('oo-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
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
    <div className="oo-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('oo-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="oo-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};
// Mentor rejimi (5–7-ekran): o'quvchilar ro'yxati — ishtirok-signali (500+ zona) bo'yicha har qatorda holat. «Mentor varag'i» (o'quvchi matni) — KOD 4, jonli yo'l hali yo'q.
const MentorRoyxat = ({ screen, yorliq, qator }) => {
  const { live, isMentor } = useJonli();
  const pin = live && live.pin;
  const [d, setD] = useState(null);
  useEffect(() => {
    if (!isMentor || !pin) return undefined;
    let on = true, t = null;
    const ayl = async () => {
      try { const [p, r] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]); if (on) setD({ p, r }); } catch { /* keyingi aylanishda */ }
      if (on) t = setTimeout(ayl, 3000);
    };
    ayl();
    return () => { on = false; clearTimeout(t); };
  }, [isMentor, pin, screen]); // eslint-disable-line
  if (!isMentor) return null;
  const players = d ? d.p : [];
  const map = new Map((d ? d.r : []).map(r => [r.player_id, r]));
  const bor = players.filter(p => map.has(p.id)).length;
  return (
    <div className="oo-mr fade-up">
      <div className="oo-mr-h"><span className="oo-yorliq">{tr(yorliq)}</span><b>{d ? `${bor} / ${players.length}` : '—'}</b></div>
      {d && players.length > 0 && <ul className="oo-mr-ro">{players.map(p => { const r = map.get(p.id); return <li key={p.id} className={cxx('oo-mr-q', r && 'ok')}><span className="oo-mr-n">{p.nickname}</span>{qator(r)}</li>; })}</ul>}
      {d && !players.length && <p className="oo-kul-q">{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>}
    </div>
  );
};

// ----- Ufqlar, holatlar va yorliqlar (tayanch 1.5, 1.9, 9.39 — aynan) -----
const UFQLAR = [
  { id: 'hozir', t: { uz: 'Hozir · 11-Modul', ru: 'Сейчас · 11-й модуль' }, q: { uz: 'hozir', ru: 'сейчас' } },
  { id: 'keyinroq', t: { uz: 'Keyinroq · 12–13-Modul', ru: 'Позже · 12–13-й модуль' }, q: { uz: 'keyinroq', ru: 'позже' } },
  { id: 'uzoqroq', t: { uz: 'Uzoqroq · bitiruvdan keyin', ru: 'Дальше · после выпуска' }, q: { uz: 'uzoqroq', ru: 'дальше' } }
];
const ufqQ = (id) => { const u = UFQLAR.find(x => x.id === id); return u ? tr(u.q) : ''; };
const HOLAT = {
  bajarildi: { t: { uz: 'Bajarildi', ru: 'Выполнено' }, ch: { uz: 'bajarildi', ru: 'выполнено' } },
  kechikdi: { t: { uz: 'Kechikdi', ru: 'С опозданием' }, ch: { uz: 'kechikdi', ru: 'с опозданием' } },
  boshlanmadi: { t: { uz: 'Boshlanmadi', ru: 'Не начато' }, ch: { uz: 'boshlanmadi', ru: 'не начато' } }
};
const HOLAT_TUGMA = ['bajarildi', 'kechikdi', 'boshlanmadi'];
const BUGUN = { uz: 'Bugun · 15-dars', ru: 'Сегодня · урок 15' };
const QADAM_Y = { uz: 'qadam', ru: 'шаг' };
const AVVAL_Y = { uz: 'Avval', ru: 'Сначала' };
const RISK_T = { uz: 'Risk', ru: 'Риск' };
const QADAM_T = { uz: 'Qadam', ru: 'Шаг' };
const SAQLASH = { uz: 'Saqlash', ru: 'Сохранить' };
const YORDAM_T = { uz: 'Yordam', ru: 'Подсказка' };
const DAVOM = { uz: 'Davom etish', ru: 'Продолжить' };
const darsT = (n) => tr({ uz: `${n}-dars`, ru: `урок ${n}` });
const SLOT = [{ uz: '1-asosiy funksiya', ru: '1-я основная функция' }, { uz: '2-asosiy funksiya', ru: '2-я основная функция' }, { uz: '3-asosiy funksiya', ru: '3-я основная функция' }];
const DARS_HOZIR = [11, 12, 14];
const MJ = () => <span className="oo-mj">Maydon Jamoa</span>;
const MentorMisoli = () => <>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>;
const ROADMAPIM = { uz: "Roadmap'im", ru: 'Мой roadmap' };
const TUZATILGAN = { uz: 'Tuzatilgan reja', ru: 'Исправленный план' };

// ----- Mentor roadmap'i (tayanch 1.5 + 13-dars; holatlar — 1.9 aynan; 13-dars ishi — «Ro'yxat kun bo'yicha», A-5) -----
const MENTOR_REJA = [
  { id: 'elon', nom: { uz: "O'yin e'loni va qo'shilish", ru: 'Объявление об игре и присоединение' }, ufq: 'hozir', dars: 11, holat: 'bajarildi' },
  { id: 'tasdiq', nom: { uz: "O'yin kuni tasdiq", ru: 'Подтверждение в день игры' }, ufq: 'hozir', dars: 12, holat: 'bajarildi' },
  { id: 'royxat', nom: { uz: "Ro'yxat kun bo'yicha", ru: 'Список по дням' }, ufq: 'hozir', dars: 13, holat: 'bajarildi' },
  { id: 'navbat', nom: { uz: 'Chiqish va navbat', ru: 'Выход и очередь' }, ufq: 'hozir', dars: 14, holat: 'kechikdi' },
  { id: 'eslatma', nom: { uz: "O'yindan oldin eslatma", ru: 'Напоминание перед игрой' }, ufq: 'keyinroq', holat: 'boshlanmadi' },
  { id: 'jonli', nom: { uz: "Ro'yxat o'zi yangilanadi", ru: 'Список обновляется сам' }, ufq: 'keyinroq', holat: 'boshlanmadi' },
  { id: 'pul', nom: { uz: "Maydon pulini bo'lishish", ru: 'Разделить оплату поля' }, ufq: 'uzoqroq', holat: 'boshlanmadi' }
];
const mentorIshlar = (holatli) => MENTOR_REJA.map(x => ({ key: x.id, nom: tr(x.nom), ufq: x.ufq, yorliq: x.dars ? darsT(x.dars) : null, holat: holatli ? x.holat : null }));

// ----- RejaDoska — bitta vizual (KOD 3): uch ustun, ish kartasi (nom · dars yorlig'i · holat chipi), «Bugun · 15-dars» chizig'i, qadam kartasi -----
const HolatChip = ({ h, yangi }) => h
  ? <span className={cxx('rd-chip', h, yangi && 'yangi')}>{h === 'bajarildi' && <i aria-hidden="true">✓</i>}{tr(HOLAT[h].ch)}</span>
  : <span className="rd-chip bosh">?</span>;
const IshK = ({ ish, i, joriy, xato, yangi, onBos, sakra }) => {
  const Tag = onBos ? 'button' : 'div';
  return (
    <Tag type={onBos ? 'button' : undefined} className={cxx('rd-karta', joriy && 'joriy', xato && 'xato', yangi && 'yangi', ish.kul && 'kul', onBos && 'bosiladi')} data-uch={'k-' + ish.key} onClick={onBos} style={{ '--i': i }}>
      <span className="rd-k-nom">{ish.nom}</span>
      {ish.yorliq && <span className="rd-k-y">{ish.yorliq}</span>}
      <span className={cxx('rd-k-ch', sakra && 'sakra')} style={{ '--i': i }}><HolatChip h={ish.holat} yangi={yangi} /></span>
      {onBos && <i className="rd-k-ed" aria-hidden="true">✎</i>}
    </Tag>
  );
};
const QadamK = ({ q, i, yangi, avval, onBos, onEd }) => (
  <div className={cxx('rd-q', q.bosh && 'bosh', yangi && 'yangi', avval && 'avval', q.tush && 'tush')} data-uch={'q-' + q.key} style={{ '--i': i }}>
    <span className="rd-q-y">{tr(QADAM_Y)}{avval && <b>{tr(AVVAL_Y)}</b>}</span>
    {!q.bosh && (onBos ? <button type="button" className="rd-qadam" onClick={onBos}>{q.matn}</button> : <span className="rd-q-t">{q.matn}</span>)}
    {!q.bosh && q.risk && <span className="rd-q-r">{q.risk}</span>}
    {onEd && <button type="button" className="rd-ed" aria-label="✎" onClick={onEd}>✎</button>}
  </div>
);
// kor: 'toliq' | 'kichik' | 'ixcham' (ixcham — bitta chiziq: har ustunda holat chiplari soni)
const RejaDoska = ({ ishlar = [], qadamlar = [], kor = 'toliq', sarlavha, son, joriy = [], xato, yangi = [], onIsh, onQadam, onQadamEd, avval = null, sakra, tolqin, yonadi, sarKalit, faqat, className }) => {
  if (kor === 'ixcham') {
    return (
      <div className={cxx('rd-ix', className)}>
        {sarlavha && <span className="rd-ix-l">{sarlavha}</span>}
        {UFQLAR.map(u => {
          const ich = ishlar.filter(x => x.ufq === u.id);
          return (
            <span key={u.id} className="rd-ix-u"><i>{tr(u.t)}</i>
              {HOLAT_TUGMA.map(h => { const n = ich.filter(x => x.holat === h).length; return n > 0 && <span key={h} className={cxx('rd-chip', h)}>{h === 'bajarildi' ? '✓' : tr(HOLAT[h].ch)} {n}</span>; })}
              {!ich.some(x => x.holat) && <span className="rd-chip bosh">{ich.length ? '?' : '—'}</span>}
            </span>
          );
        })}
      </div>
    );
  }
  let n = 0;
  return (
    <div className={cxx('rd', kor, yonadi && 'yonadi', className)}>
      {(sarlavha || son) && <div className="rd-h"><b key={sarKalit} className="rd-h-t">{sarlavha}</b>{son}</div>}
      <div className={cxx('rd-ustunlar', faqat && 'faqat')}>
        {UFQLAR.filter(u => !faqat || faqat.includes(u.id)).map(u => {
          const ich = ishlar.filter(x => x.ufq === u.id);
          const qs = qadamlar.filter(x => x.ufq === u.id);
          return (
            <div key={u.id} className={cxx('rd-u', u.id)}>
              <span className="rd-u-h">{tr(u.t)}</span>
              <div className="rd-u-ich">
                {ich.map(x => <IshK key={x.key} ish={x} i={n++} joriy={joriy.includes(x.key)} xato={xato && joriy.includes(x.key)} yangi={yangi.includes(x.key)} sakra={sakra} onBos={onIsh ? () => onIsh(x) : undefined} />)}
                {u.id === 'hozir' && <div className={cxx('rd-bugun', tolqin && 'tolqin')}><span>{tr(BUGUN)}</span></div>}
                {qs.map(q => <QadamK key={q.key} q={q} i={n++} yangi={yangi.includes('q-' + q.key)} avval={avval === q.idx} onBos={onQadam ? () => onQadam(q) : undefined} onEd={onQadamEd ? () => onQadamEd(q) : undefined} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----- Telefon maketi «Maydon Jamoa» (SABOQ 22: ≈170×272, barqaror; nom o'z rangida — tayanch 9.62, logotip yo'q) -----
const Tel = ({ children, xira, k, bar = true, className }) => (
  <div className={cxx('oo-tel', xira && 'xira', className)}>
    {bar ? <div className="oo-tel-bar"><MJ /></div> : <div className="oo-tel-bar bosh" />}
    <div className="oo-tel-ekran" key={k}>{children}</div>
  </div>
);
const SHANBA = { uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' };
const MAYDON = { uz: 'Mahalla maydoni', ru: 'Площадка махалли' };
const OyinK = ({ son, tugma, ok, soatsiz }) => (
  <div className="oo-ok">
    <span className="oo-ok-t">{!soatsiz && <b>{tr(SHANBA)}</b>}<span>{tr(MAYDON)}</span></span>
    {son && <b className="oo-ok-son" key={son}>{son}</b>}
    {tugma && <span className={cxx('oo-ok-tg', ok && 'ok')}>{tugma}</span>}
  </div>
);
// Real ko'rinishdagi odam (SABOQ 36): bosh, soch, yuz, rangli kiyim, qo'lida telefon. (x, y) — oyoq ostidagi nuqta.
const Odam = ({ x = 0, y = 0, s = 1, kiyim = '#3E7CB1', teri = '#E3A87C', soch = '#2E2019' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-8" y="-31" width="7.5" height="29" rx="3.5" fill="#3B3F5C" />
    <rect x="0.5" y="-31" width="7.5" height="29" rx="3.5" fill="#3B3F5C" />
    <rect x="-9.5" y="-4" width="10" height="4.5" rx="2.2" fill="#2A2730" />
    <rect x="0.5" y="-4" width="11" height="4.5" rx="2.2" fill="#2A2730" />
    <rect x="-11" y="-58" width="22" height="30" rx="8" fill={kiyim} />
    <rect x="-13" y="-56" width="8" height="24" rx="4" fill={kiyim} opacity="0.85" />
    <rect x="-3" y="-62" width="6" height="6" rx="2" fill={teri} />
    <rect x="5" y="-54" width="7" height="14" rx="3.5" fill={kiyim} />
    <rect x="7" y="-45" width="12" height="6.5" rx="3.2" fill={kiyim} />
    <circle cx="19" cy="-42" r="3.3" fill={teri} />
    <rect x="16.5" y="-53" width="6.5" height="11" rx="1.6" fill="#2A2730" />
    <circle cx="0" cy="-71" r="10.5" fill={teri} />
    <path d="M -11 -70 C -12 -86, 12 -86, 11 -71 C 6 -77, -2 -78, -11 -70 Z" fill={soch} />
    <circle cx="2.5" cy="-71" r="1.35" fill="#2A2730" />
    <circle cx="7.5" cy="-71" r="1.35" fill="#2A2730" />
    <path d="M 3 -66 Q 5.5 -64 8 -66" stroke="#8A4B3A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </g>
);

// ----- 2-ekran: telefon dalili (tayanch 1.7, 1.8, 1.9 matnlari; boshqa son yo'q — A-6) -----
const S2Dalil = ({ k }) => {
  const [bosildi, setBosildi] = useState(false);
  useEffect(() => {
    setBosildi(false);
    if (k > 1) return undefined;
    const t = setTimeout(() => setBosildi(true), kamHarakat() ? 0 : 1100);
    return () => clearTimeout(t);
  }, [k]);
  const sar = (t) => <span className="oo-te-h">{tr(t)}</span>;
  const OYINLAR = { uz: "O'yinlar", ru: 'Игры' };
  let ekran, ust = null, ost = null;
  if (k === 0) {
    ekran = <>{sar(OYINLAR)}<OyinK son={bosildi ? '9 / 10' : '8 / 10'} tugma={bosildi ? tr({ uz: "Qo'shildingiz", ru: 'Вы присоединились' }) : tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })} ok={bosildi} />{!bosildi && <i className="oo-barmoq" aria-hidden="true" />}</>;
    ost = { uz: '11-darsda shunday ishladi', ru: 'Так работало на 11-м уроке' };
  } else if (k === 1) {
    ekran = <>{sar({ uz: 'Shanba, 18:00 · Mahalla maydoni', ru: 'Суббота, 18:00 · Площадка махалли' })}<span className="oo-te-doira">{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < 3 ? 'ok' : ''} />)}</span><span className={cxx('oo-ok-tg', 'ok')}>{tr({ uz: 'Kelaman', ru: 'Приду' })}</span>{bosildi && <span className="oo-te-q fade-step">{tr({ uz: 'Kelishini tasdiqladi: 7 / 9', ru: 'Подтвердили приход: 7 / 9' })}</span>}</>;
    ost = { uz: '12-darsda shunday ishladi', ru: 'Так работало на 12-м уроке' };
  } else if (k === 2) {
    ekran = <>{sar(OYINLAR)}<span className="oo-te-kun">{tr({ uz: 'Shanba', ru: 'Суббота' })}</span><OyinK son="8 / 10" /><span className="oo-te-kun" style={{ '--i': 1 }}>{tr({ uz: 'Yakshanba', ru: 'Воскресенье' })}</span><OyinK soatsiz /></>;
    ost = { uz: '13-darsda, sinovdan keyin shunday ishladi', ru: 'Так работало на 13-м уроке, после теста' };
  } else if (k === 3) {
    ust = (
      <div className="oo-vaqt fade-step">
        <span className="oo-vq"><span className="oo-vq-b"><i className="x">✕</i><i className="x" style={{ '--i': 1 }}>✕</i></span><b>{darsT(14)}</b><em>{tr({ uz: 'navbatdagi kirmadi', ru: 'очередной не вошёл' })}</em></span>
        <span className="oo-vq-c" aria-hidden="true" />
        <span className="oo-vq"><span className="oo-vq-b"><i className="ok" style={{ '--i': 2 }}>✓</i></span><b>{tr({ uz: 'darsdan keyin', ru: 'после урока' })}</b></span>
      </div>
    );
    ekran = <>{sar(OYINLAR)}<OyinK son={tr({ uz: "O'yin to'ldi", ru: 'Игра заполнена' })} tugma={tr({ uz: 'Navbatga yozilish', ru: 'Записаться в очередь' })} /></>;
  } else {
    ust = <span className="oo-kul oo-tel-ust fade-step">{tr({ uz: '12-Modul hali boshlanmagan', ru: '12-й модуль ещё не начался' })}</span>;
    ekran = <>{sar(OYINLAR)}<OyinK son="8 / 10" /></>;
  }
  return (
    <div className="oo-dalil">
      {ust}
      <Tel k={k} xira={k === 4}>{ekran}</Tel>
      {ost && <span className="oo-kul fade-step" key={'o' + k}>{tr(ost)}</span>}
    </div>
  );
};

// ----- Student ma'lumoti: o'qiydi pm-m9d6-roadmap · pm-m9d13-sinov · pm-m9d8-platforma · yozadi pm-m9d15-reja (7-ekran). Qoralama — shu dars ichida -----
const ROADMAP_KEY = 'pm-m9d6-roadmap';
const SINOV_KEY = 'pm-m9d13-sinov';
const REJA_KEY = 'pm-m9d15-reja';
const QORALAMA_KEY = 'pm-m9d15-qoralama';
const matnOl = (s) => String(typeof s === 'string' ? s : (s && (s.nom || s.matn || s.t)) || '').trim();
const nuqtasiz = (s) => String(s || '').trim().replace(/[.!?…]+$/, '');
const qisqa = (s, n = 34) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; };
const sinovLs = () => { const v = lsGet(SINOV_KEY); return v && typeof v === 'object' ? v : null; };
const trekWeb = () => { const v = lsGet('pm-m9d8-platforma'); return !!(v && v.trek === 'web'); };
const qoralama = () => { const v = lsGet(QORALAMA_KEY); return v && typeof v === 'object' ? v : {}; };
const qoralamaYoz = (patch) => { const v = { ...qoralama(), ...patch, savedAt: Date.now() }; lsSet(QORALAMA_KEY, v); return v; };
const rejaLs = () => { const v = lsGet(REJA_KEY); return v && Array.isArray(v.risklar) ? v : null; };
// O'quvchi roadmap'i → doska ishlari: hozir ustunida `hozir` tartibida 1/2/3-asosiy funksiya (11 · 12 · 14-darslar) va 13-dars ishi
const roadmapIshlar = () => {
  const r = lsGet(ROADMAP_KEY);
  if (!r || !Array.isArray(r.ishlar) || !r.ishlar.length) return null;
  const hozir = Array.isArray(r.hozir) ? r.hozir.filter(i => Number.isInteger(i) && r.ishlar[i] && matnOl(r.ishlar[i].nom)).slice(0, 3) : [];
  const out = hozir.map((i, s) => ({ key: 'i' + i, nom: matnOl(r.ishlar[i].nom), ufq: 'hozir', dars: DARS_HOZIR[s], yorliq: `${tr(SLOT[s])} · ${darsT(DARS_HOZIR[s])}` }));
  const sv = sinovLs();
  const tox = sv && Array.isArray(sv.toxtashlar) ? sv.toxtashlar.find(t => t && t.id === sv.eng) : null;
  const tnom = tox ? matnOl(tox.matn) : '';
  const sinov = { key: 'sinov', nom: tnom ? qisqa(tnom) : tr({ uz: '13-dars: sinovdan keyingi ish', ru: 'Урок 13: работа после теста' }), kul: !tnom, toliq: tnom || null, ufq: 'hozir', dars: 13,
    yorliq: sv && sv.tur === 'mashq' ? `${darsT(13)} · ${tr({ uz: 'mashq sinovi', ru: 'учебный тест' })}` : darsT(13),
    qayta: sv && sv.qaytaSinov && sv.qaytaSinov.natija };
  const j = out.findIndex(x => x.dars === 14);
  if (j >= 0) out.splice(j, 0, sinov); else out.push(sinov);
  r.ishlar.forEach((x, i) => {
    if (hozir.includes(i)) return;
    const nom = matnOl(x && x.nom);
    if (!nom || !UFQLAR.some(u => u.id === (x && x.ufq))) return;
    out.push({ key: 'i' + i, nom, ufq: x.ufq });
  });
  return out;
};
// { ishlar, manba: 'roadmap' | 'yozma' | null } — roadmap yo'q bo'lsa, 5-ekranda o'quvchi o'zi yozgan ishlar (qoralama)
const talabaIshlar = () => {
  const r = roadmapIshlar();
  if (r) return { ishlar: r, manba: 'roadmap' };
  const q = qoralama();
  const y = Array.isArray(q.ishlar) ? q.ishlar.filter(x => x && x.nom && x.ufq) : [];
  return y.length ? { ishlar: y, manba: 'yozma' } : { ishlar: null, manba: null };
};
const holatli = (ishlar, d) => (ishlar || []).map(x => ({ ...x, holat: (d.holat || {})[x.key] || null }));
// «Birinchisi»: «Avval» belgilangan; bo'lmasa — hozir ufqidagi birinchi; u ham bo'lmasa — keyinroqdagi birinchisi (MD 7-ekran)
const birinchiI = (risklar = [], ufqlar = [], birinchi) => {
  if (Number.isInteger(birinchi) && risklar[birinchi]) return birinchi;
  for (const u of ['hozir', 'keyinroq', 'uzoqroq']) { const i = ufqlar.findIndex((x, j) => x === u && risklar[j]); if (i >= 0) return i; }
  return risklar.length ? 0 : -1;
};
const rejaYoz = (ishlar, d) => {
  const risklar = (d.risklar || []).slice(0, 3);
  const reja = {
    holatlar: (ishlar || []).filter(x => (d.holat || {})[x.key]).map(x => ({ ish: x.toliq || x.nom, holat: d.holat[x.key] })),
    risklar: risklar.map((r, i) => ({ risk: r.risk, qadam: r.qadam, ufq: (d.ufqlar || [])[i] || null })),
    eng: Number.isInteger(d.eng) && risklar[d.eng] ? d.eng : null,
    birinchi: Number.isInteger(d.birinchi) && risklar[d.birinchi] ? d.birinchi : null,
    savedAt: Date.now()
  };
  lsSet(REJA_KEY, reja);
  return reja;
};
// Artefakt-strip (U-042): «Roadmap'im · holatlar n/N» — 5-ekrandan; 6, 11-ekranlarda
const RejaStrip = () => {
  const { ishlar } = talabaIshlar();
  if (!ishlar || !ishlar.length) return null;
  const d = qoralama();
  const n = ishlar.filter(x => (d.holat || {})[x.key]).length;
  return <div className="oo-strip fade-step"><span className="oo-strip-l">{tr(ROADMAPIM)}</span><span>{tr({ uz: 'holatlar', ru: 'статусы' })} <b>{n}/{ishlar.length}</b></span>{rejaLs() && <span className="oo-strip-ok">{tr({ uz: 'qadamlar', ru: 'шаги' })} <b>3/3</b></span>}</div>;
};

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'ketyapman', t: { uz: "Roadmap bo'yicha ketyapman", ru: 'Иду по roadmap' } },
  { id: 'ortda', t: { uz: "Roadmap'dan biroz ortdaman", ru: 'Немного отстаю от roadmap' } },
  { id: 'oldinda', t: { uz: "Roadmap'dan biroz oldindaman", ru: 'Немного опережаю roadmap' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [manba] = useState(talabaIshlar);
  const ishlar = manba.ishlar ? manba.ishlar.map(x => ({ ...x, holat: null })) : mentorIshlar(false);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr(DAVOM)} onClick={onNext} />}>
      <div className={cxx('oo-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Roadmap bo'yicha <A>qayerdasiz?</A></>, ru: <>Где вы сейчас <A>по roadmap?</A></> })}
          mentor={<Mentor>{picked === null
            ? tr({ uz: "Poydevor, uch asosiy funksiya va sinov ortda qoldi. Roadmap'ingizni eslang va o'zingizga yaqin javobni belgilang.", ru: 'Фундамент, три основные функции и тест позади. Вспомните свой roadmap и отметьте близкий вам ответ.' })
            : tr({ uz: "Javobni o'qing va «Davom etish»ni bosing.", ru: 'Прочитайте ответ и нажмите «Продолжить».' })}</Mentor>}
          maket={<RejaDoska kor="kichik" ishlar={ishlar} sarlavha={manba.ishlar ? tr(ROADMAPIM) : <MentorMisoli />} tolqin={picked !== null} sakra={picked !== null} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="oo-javob fade-step">{tr({ uz: "Uchalasi ham uchraydi. Buni taxmin emas, roadmap'dagi har ish ko'rsatadi: o'z vaqtida tugadimi?", ru: 'Встречаются все три. Это показывает не догадка, а каждая работа в roadmap: закончилась ли она вовремя?' })}</p>}
            {jonliDars(live) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "Javoblarni muhokama qilmang — bugun har o'quvchi o'z roadmap'ini dalil bilan ko'radi. «Oldindaman» degan o'quvchidan keyinroq so'rang: keyinroq ufqidagi ishni boshladingizmi?", ru: 'Не обсуждайте ответы — сегодня каждый ученик посмотрит свой roadmap с доказательствами. Ученика, который сказал «опережаю», спросите позже: вы начали работу горизонта «позже»?' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda Mentor doskasi kichik — «?» kulrang to'lqin, uchta «qadam» kartasi ustunlarga sirg'alib kiradi; o'ngda 01 · matn · teg) =====
const REJA = [
  { t: { uz: "Roadmap'dagi har ish o'z vaqtida tugaganini belgilaysiz", ru: 'Отметите, вовремя ли закончилась каждая работа в roadmap' }, teg: { uz: 'holat', ru: 'статус' } },
  { t: { uz: 'Oldinda rejaga nima xalaqit berishi mumkinligini topasiz', ru: 'Найдёте, что впереди может помешать плану' }, teg: { uz: 'risk', ru: 'риск' } },
  { t: { uz: 'Har biriga bitta aniq qadam yozasiz', ru: 'Для каждого напишете один конкретный шаг' }, teg: { uz: 'qadam', ru: 'шаг' } },
  { t: { uz: "Qadamlarni roadmap'ga qo'yib, Mentor bilan ko'rasiz", ru: 'Поставите шаги в roadmap и посмотрите их с Ментором' }, teg: { uz: 'tuzatilgan reja', ru: 'исправленный план' } }
];
const S1_QADAM = [{ key: 'b1', ufq: 'hozir', bosh: true }, { key: 'b2', ufq: 'hozir', bosh: true }, { key: 'b3', ufq: 'keyinroq', bosh: true }];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun roadmap'ingizni <A>Mentor bilan</A> tuzatasiz.</>, ru: <>Сегодня вы исправите roadmap <A>вместе с Ментором</A>.</> })}
      mentor={<Mentor>{tr({ uz: "Bugun har biringiz bilan yakkama-yakka gaplashaman. Undan oldin roadmap'ingizni birma-bir ko'rib chiqasiz.", ru: 'Сегодня я поговорю с каждым из вас один на один. До этого вы по очереди просмотрите свой roadmap.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida — Mentor bilan yakkama-yakka: risklar va tuzatilgan reja', ru: 'В конце урока — один на один с Ментором: риски и исправленный план' })}
      chap={<RejaDoska kor="kichik" ishlar={mentorIshlar(false)} qadamlar={S1_QADAM} sarlavha={<MentorMisoli />} sakra />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — HOLATLAR (QTushuncha markaziy: bashorat → ketma-ket 5 karta, telefon dalili chapda, doska o'ngda, uch tugma doska ostida) · nishon statusCheck =====
const S2_TAXMIN = [{ k: '2', t: '2' }, { k: '3', t: '3' }, { k: '4', t: '4' }];
const S2_SAVOL = { uz: "Hozir ufqidagi to'rt ishdan nechtasi o'z darsida tugagan?", ru: 'Сколько из четырёх работ горизонта «сейчас» закончились на своём уроке?' };
const X_ISHLADI = { uz: "Dalilga qarang: ish o'z darsida ishladi.", ru: 'Посмотрите на доказательство: работа заработала на своём уроке.' };
const X_BOSHLANGAN = { uz: 'Telefonda ish ishlab turibdi — demak boshlangan.', ru: 'Работа работает на телефоне — значит, начата.' };
const X_VAQT = { uz: 'Bu ishlarning vaqti hali kelmagan.', ru: 'Время этих работ ещё не пришло.' };
const S2_KARTA = [
  { keys: ['elon'], togri: 'bajarildi', xato: { kechikdi: X_ISHLADI, boshlanmadi: X_BOSHLANGAN } },
  { keys: ['tasdiq'], togri: 'bajarildi', xato: { kechikdi: X_ISHLADI, boshlanmadi: X_BOSHLANGAN } },
  { keys: ['royxat'], togri: 'bajarildi', xato: { kechikdi: X_ISHLADI, boshlanmadi: X_BOSHLANGAN } },
  { keys: ['navbat'], togri: 'kechikdi', xato: { bajarildi: { uz: 'Hozir ishlaydi — lekin 14-darsda tugadimi?', ru: 'Сейчас работает — но закончилась ли на 14-м уроке?' }, boshlanmadi: { uz: "Ish 14-darsda boshlangan edi — dalilni o'qing.", ru: 'Работа началась на 14-м уроке — прочитайте доказательство.' } },
    izoh: { uz: 'Kechikdi — rejadagi vaqtida tugamagan ish, keyin tugagan bo\'lsa ham.', ru: 'С опозданием — работа не закончилась в плановое время, даже если закончилась позже.' } },
  { keys: ['eslatma', 'jonli', 'pul'], togri: 'boshlanmadi', xato: { bajarildi: X_VAQT, kechikdi: X_VAQT },
    izoh: { uz: 'Boshlanmadi — vaqti hali kelmagan ish.', ru: 'Не начато — работа, время которой ещё не пришло.' } }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [k, setK] = useState(avval ? 5 : 0);
  const [xato, setXato] = useState(null);
  const [izoh, setIzoh] = useState(null);
  const [yangi, setYangi] = useState(null);
  const xatoBor = useRef(false);
  const done = k >= 5;
  const tugadi = useTugadi(done, 1700, avval);
  const ipucha = useIpucha(!!taxmin && !done, k);
  const { live } = useJonli();
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'holatlar', screenIdx: screen, correct: !xatoBor.current, picked: true, solved: true, taxmin });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'holatlar', 0, !xatoBor.current, 0); // ishtirok-signali (500+ zona), ball emas
  }, [done]); // eslint-disable-line
  useEffect(() => { if (!izoh) return undefined; const t = setTimeout(() => setIzoh(null), 3200); return () => clearTimeout(t); }, [izoh]);
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1100); return () => clearTimeout(t); }, [yangi]);
  const bos = (h) => {
    if (!taxmin || done) return;
    const kt = S2_KARTA[k];
    if (h === kt.togri) { setXato(null); setYangi(k); setIzoh(kt.izoh ? { matn: kt.izoh, kk: Date.now() } : null); setK(k + 1); return; }
    if (!xatoBor.current && achMiss) achMiss.miss(screen);
    xatoBor.current = true;
    setXato({ h, kk: Date.now(), matn: kt.xato[h] });
  };
  const holatOf = (key) => { const i = S2_KARTA.findIndex(c => c.keys.includes(key)); return i >= 0 && i < k ? S2_KARTA[i].togri : null; };
  const ishlar = MENTOR_REJA.map(x => ({ key: x.id, nom: tr(x.nom), ufq: x.ufq, yorliq: x.dars ? darsT(x.dars) : null, holat: holatOf(x.id) }));
  const joriy = done || !taxmin ? [] : S2_KARTA[k].keys; // bashoratgacha faol joy — faqat bashorat (bitta halqa)
  const yangiK = yangi !== null ? S2_KARTA[yangi].keys : [];
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  const doska = <RejaDoska ishlar={ishlar} joriy={joriy} xato={!!xato} yangi={yangiK} sarlavha={<MentorMisoli />} />;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · holat', ru: 'Понятие · статус' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : `${tr({ uz: 'Kartalarni belgilang', ru: 'Отметьте карточки' })} (${Math.min(k, 5)}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor roadmap'idagi ishlar <A>o'z vaqtida</A> tugadimi?</>, ru: <>Работы в roadmap Ментора закончились <A>вовремя?</A></> })}
        mentor={<Mentor>{done
          ? tr({ uz: "Doskadagi holatlarni ko'ring va «Davom etish»ni bosing.", ru: 'Посмотрите на статусы на доске и нажмите «Продолжить».' })
          : tr({ uz: "Telefondagi dalilni ko'ring va kartaga mos tugmani bosing.", ru: 'Посмотрите доказательство на телефоне и нажмите подходящую кнопку для карточки.' })}</Mentor>}
        bashorat={!taxmin
          ? <div className="oo-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <div className="oo-bashq fade-step"><span>{tr(S2_SAVOL)}</span><span className="oo-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{tx.t}</b></span></div>}
        vizual={tugadi ? doska : <div className="oo-s2">
          <div className="oo-s2-tel"><S2Dalil k={Math.min(k, 4)} /></div>
          <div className="oo-s2-ong">
            {doska}
            {!done && <div className={cxx('oo-tugmalar', taxmin && 'oo-guruh')} key={taxmin ? 'on' : 'off'}>
              {HOLAT_TUGMA.map((h, i) => <QChip key={xato && xato.h === h ? `${h}-${xato.kk}` : h} holat={xato && xato.h === h ? 'err' : undefined} silk={!!(xato && xato.h === h)} disabled={!taxmin} style={{ '--i': i }} onClick={() => bos(h)}>{tr(HOLAT[h].t)}</QChip>)}
            </div>}
            {xato && !done && <QXato key={xato.kk}>{tr(xato.matn)}</QXato>}
            {izoh && <QIzoh key={izoh.kk}>{tr(izoh.matn)}</QIzoh>}
            {!done && <NishonQatori screen={screen} />}
          </div>
        </div>}
        natija={!done && ipucha && <QIzoh>{tr({ uz: "Telefondagi kulrang yorliqni o'qing — ish qachon ishladi?", ru: 'Прочитайте серую подпись на телефоне — когда заработала работа?' })}</QIzoh>}
        xulosa={done && <>{tx && <span className={cxx('oo-tx', taxmin === '3' && 'ok')}>{taxmin === '3' ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' }) : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>3</b></>}</span>}{tr({ uz: "Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi: bajarildi, kechikdi yoki boshlanmadi.", ru: 'Статус показывает, где работа относительно планового времени: выполнено, с опозданием или не начато.' })}</>}
      />
      <MentorNote>{tr({ uz: "Eng ko'p bahs — 4-karta: «hozir ishlayapti-ku, nega kechikdi?». Javob: holat ish o'z vaqtiga nisbatan qayerdaligini aytadi; navbat 14-darsda tugamagan, keyin ishlagan. Sinfdan so'rang: «Sizda o'z darsida tugamagan ish bormi?» — javoblar 5-ekranga olib boradi.", ru: 'Больше всего споров — 4-я карточка: «сейчас же работает, почему с опозданием?». Ответ: статус говорит, где работа относительно своего времени; очередь не закончили на 14-м уроке, она заработала позже. Спросите класс: «Есть ли у вас работа, не законченная на своём уроке?» — ответы ведут к 5-му экрану.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — RISK (QTushuncha ketma-ket, 3 bosqich; SABOQ 9/13; P-055): sahna chapda · risk kartasi o'ngda · uch tanlov pastda · nishon stepPicker =====
const S3_BOSQICH = [{ uz: 'Backend', ru: 'Backend' }, { uz: 'Foydalanuvchilar', ru: 'Пользователи' }, { uz: 'Telefon', ru: 'Телефон' }];
const KUTISH_YOZUVI = { uz: "O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.", ru: 'Игры загружаются — это может занять до минуты.' };
const MENTOR_RISKLAR = [
  { risk: { uz: 'Render bepul xizmati uxlaydi — birinchi ochilish bir daqiqagacha.', ru: 'Бесплатный сервис Render засыпает — первое открытие до минуты.' }, ufq: 'hozir',
    tanlov: [
      { t: { uz: "Ilovaga kutish yozuvi qo'shish", ru: 'Добавить в приложение надпись ожидания' }, ok: true },
      { t: { uz: "Ilovani har kuni o'zingiz ochib turish", ru: 'Каждый день самому открывать приложение' }, xato: { uz: "15 daqiqa so'rovsiz qolsa, Backend yana uxlaydi.", ru: 'Если 15 минут нет запросов, Backend снова засыпает.' } },
      { t: { uz: 'Telegram guruhida ogohlantirish yozish', ru: 'Написать предупреждение в Telegram-группе' }, xato: { uz: "Ilovani ochgan o'yinchi guruhni ko'rmasligi mumkin.", ru: 'Игрок, открывший приложение, может не увидеть группу.' } }
    ],
    osti: { uz: "Kutish qisqarmaydi — o'yinchi ilovani yopmaydi.", ru: 'Ожидание не сокращается — игрок не закрывает приложение.' },
    yordam: { uz: "Qaysi tanlovdan keyin o'yinchi ilovani yopmaydi?", ru: 'После какого выбора игрок не закроет приложение?' } },
  { risk: { uz: '12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi.', ru: 'В 12-м модуле нужно 50 пользователей, сейчас 3 тестировщика.' }, ufq: 'hozir',
    tanlov: [
      { t: { uz: "12-Modul boshlanganda foydalanuvchilarni qidirib ko'rish", ru: 'Поискать пользователей, когда начнётся 12-й модуль' }, xato: { uz: "Odam kech qidirilsa, 12-Modulga yetmasligi mumkin.", ru: 'Если искать людей поздно, к 12-му модулю их может не хватить.' } },
      { t: { uz: 'Mahalla futbol guruhidan 10 kishini sinovga chaqirish', ru: 'Позвать на тест 10 человек из футбольной группы махалли' }, ok: true },
      { t: { uz: "Uch sinovchidan ilovani yana bir necha marta sinashni so'rash", ru: 'Попросить трёх тестировщиков проверить приложение ещё несколько раз' }, xato: { uz: 'Sinovchilar soni baribir 3 ta qoladi.', ru: 'Тестировщиков всё равно остаётся 3.' } }
    ],
    osti: { uz: 'Hali 50 emas: qadam riskni kamaytiradi, yo\'qotmaydi.', ru: 'Это ещё не 50: шаг уменьшает риск, но не убирает его.' },
    yordam: { uz: 'Qaysi tanlovdan keyin 50 ga yaqinlashadi?', ru: 'После какого выбора число приблизится к 50?' } },
  { risk: { uz: 'Expo Go — sinash vositasi, hamma o\'yinchida yo\'q.', ru: 'Expo Go — инструмент для проверки, он есть не у всех игроков.' }, ufq: 'keyinroq',
    tanlov: [
      { t: { uz: "Har o'yinchiga Expo Go o'rnatishni aytish", ru: 'Сказать каждому игроку установить Expo Go' }, xato: { uz: "Expo Go — sinash vositasi, o'yinchilar uchun emas.", ru: 'Expo Go — инструмент для проверки, не для игроков.' } },
      { t: { uz: "Ilovani faqat o'z telefoningizda ko'rsatish", ru: 'Показывать приложение только на своём телефоне' }, xato: { uz: "Unda o'yinchilarning o'zi ilovani ocholmaydi.", ru: 'Тогда игроки сами не смогут открыть приложение.' } },
      { t: { uz: "12-Modulda APK: Android'ga o'rnatiladigan fayl", ru: 'APK в 12-м модуле: файл для установки на Android' }, ok: true }
    ],
    osti: { uz: "APK — Android uchun; iPhone yo'li alohida qaror.", ru: 'APK — для Android; путь для iPhone — отдельное решение.' },
    yordam: { uz: "Qaysi tanlovdan keyin ilova Expo Go'siz ochiladi?", ru: 'После какого выбора приложение откроется без Expo Go?' } }
];
const mentorQadam = (i) => MENTOR_RISKLAR[i].tanlov.find(t => t.ok).t;
// 3-ekran sahnasi: b — bosqich, yechildi — to'g'ri tanlovdan keyin sahna qayta yuradi
const S3Sahna = ({ b, yechildi }) => {
  const [sek, setSek] = useState(0);
  useEffect(() => {
    if (b !== 0) return undefined;
    if (kamHarakat()) { setSek(60); return undefined; }
    setSek(0);
    let s = 0;
    const id = setInterval(() => { s += 3; setSek(Math.min(s, 60)); if (s >= 60) clearInterval(id); }, yechildi ? 240 : 150);
    return () => clearInterval(id);
  }, [b, yechildi]);
  if (b === 0) {
    const keldi = sek >= 60;
    return (
      <div className="oo-sahna">
        <span className="oo-kul oo-tel-ust">{tr({ uz: 'Render · bepul xizmat', ru: 'Render · бесплатный сервис' })}</span>
        <div className="oo-sahna-q">
          <Tel k={`b0-${yechildi}`}>
            <span className="oo-te-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}<em className="oo-soat">{`0:${String(Math.min(sek, 59)).padStart(2, '0')}`}</em></span>
            {keldi ? <><OyinK son="8 / 10" /><OyinK soatsiz /></> : yechildi && <p className="oo-kutish fade-step">{tr(KUTISH_YOZUVI)}</p>}
          </Tel>
          {yechildi && <svg className="oo-odam fade-step" viewBox="-30 -96 60 100" width="64" height="106" aria-hidden="true"><Odam /></svg>}
        </div>
        <span className="oo-kul">{tr({ uz: 'tezlashtirilgan · bir daqiqagacha', ru: 'ускорено · до минуты' })}</span>
      </div>
    );
  }
  if (b === 1) {
    return (
      <div className="oo-sahna">
        <div className="oo-bar">
          <span className="oo-bar-t">{tr({ uz: 'Foydalanuvchilar: 3 / 50', ru: 'Пользователи: 3 / 50' })}</span>
          <span className="oo-bar-y"><i className="ok" style={{ width: '6%' }} />{yechildi && <i className="taklif" style={{ width: '20%' }} />}</span>
          <span className={cxx('oo-kul', yechildi && 'oo-acc')}>{yechildi ? tr({ uz: '3 + 10 · taklif qilinadi', ru: '3 + 10 · приглашены' }) : tr({ uz: '12-Modul: 50 foydalanuvchi', ru: '12-й модуль: 50 пользователей' })}</span>
        </div>
        <Tel k="b1"><span className="oo-te-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><OyinK son="8 / 10" /></Tel>
      </div>
    );
  }
  return (
    <div className="oo-sahna">
      <span className="oo-kul oo-tel-ust">{tr({ uz: 'Expo Go — sinash vositasi', ru: 'Expo Go — инструмент для проверки' })}</span>
      <div className="oo-ikki-tel">
        <Tel k="b2a"><span className="oo-expo">Expo Go</span><span className="oo-te-h">{tr({ uz: "O'yinlar", ru: 'Игры' })}</span><OyinK son="8 / 10" /></Tel>
        <Tel k="b2b" bar={false}>
          <span className="oo-ilovalar">{['#E07A5F', '#3E7CB1', '#E9A23B', '#7B61C9', '#D96C8A'].map((c, i) => <i key={i} style={{ background: c }} />)}
            {yechildi ? <i className="apk" /> : <i className="savol">?</i>}
          </span>
          {yechildi && <span className="oo-kul oo-apk-y">{tr({ uz: 'APK · 12-Modul', ru: 'APK · 12-й модуль' })}</span>}
        </Tel>
      </div>
    </div>
  );
};
const RiskK = ({ risk, qadam, ufq, xato, osti, yorliq = true, uch }) => (
  <div className="oo-rk" data-uch={uch}>
    {yorliq && <span className="oo-kul">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })}</span>}
    <div className="oo-rk-q"><b>{tr(RISK_T)}</b><span>{risk}</span></div>
    <div className={cxx('oo-rk-q', 'qadam', !qadam && 'bosh', xato && 'xato', qadam && 'yozildi')}><b>{tr(QADAM_T)}</b>{qadam ? <span data-uch="s3-qadam">{qadam}</span> : <span className="oo-rk-bosh">?</span>}{ufq && <span className="oo-ufq fade-step">{ufq}</span>}</div>
    {osti && <p className="oo-rk-osti fade-step">{osti}</p>}
  </div>
);
const YigQator = ({ i, uch, yangi }) => {
  const r = MENTOR_RISKLAR[i];
  return <li className={cxx('oo-yig', yangi && 'yangi')} data-uch={uch}><span className="oo-yig-r">{tr(r.risk)}</span><i aria-hidden="true">→</i><span className="oo-yig-q">{tr(mentorQadam(i))}</span><em>{ufqQ(r.ufq)}</em></li>;
};
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [b, setB] = useState(avval ? 3 : 0);
  const [faza, setFaza] = useState('tanlov');
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState([]);
  const [yangi, setYangi] = useState(null);
  const [qIzoh, setQIzoh] = useState(false);
  const xatoBor = useRef(false);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const done = b >= 3;
  const tugadi = useTugadi(done, 900, avval);
  const r = MENTOR_RISKLAR[Math.min(b, 2)];
  const { live } = useJonli();
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'risk', screenIdx: screen, correct: !xatoBor.current, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'qadamlar', 0, !xatoBor.current, 0); // ishtirok-signali (500+ zona), ball emas
  }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1200); return () => clearTimeout(t); }, [yangi]);
  // 3-bosqich: yozilgandan keyin karta o'zi ro'yxatga yig'iladi (SABOQ 34 — ketma-ket qadam o'zi ochiladi)
  useEffect(() => {
    if (faza !== 'yozildi' || b !== 2) return undefined;
    const t = setTimeout(() => keyingi(), kamHarakat() ? 600 : 3600);
    return () => clearTimeout(t);
  }, [faza, b]); // eslint-disable-line
  const tanla = (t, i, e) => {
    if (faza !== 'tanlov' || done) return;
    if (t.ok) { uch(e && e.currentTarget, 's3-qadam', 620); setXato(null); setFaza('yozildi'); if (b === 0) setQIzoh(true); return; }
    if (!xatoBor.current && achMiss) achMiss.miss(screen);
    xatoBor.current = true;
    setXato({ i, kk: Date.now() });
    setYordam(y => (y.includes(b) ? y : [...y, b]));
  };
  const keyingi = () => {
    if (faza !== 'yozildi') return;
    uch(kartaRef.current, 'y-' + b, 600);
    setYangi(b); setB(b + 1); setFaza('tanlov'); setXato(null); setQIzoh(false);
  };
  const yig = [...Array(Math.min(b, 3)).keys()];
  const royxat = yig.length > 0 && <ol className={cxx('oo-yig-ro', tugadi && 'keng')}>{yig.map(i => <YigQator key={i} i={i} uch={'y-' + i} yangi={yangi === i} />)}</ol>;
  const mentorT = done
    ? { uz: "Uch riskni o'qing va «Davom etish»ni bosing.", ru: 'Прочитайте три риска и нажмите «Продолжить».' }
    : faza === 'yozildi' && b < 2
      ? { uz: "Kartadagi qatorni o'qing va «Keyingi risk ›»ni bosing.", ru: 'Прочитайте строку на карточке и нажмите «Следующий риск ›».' }
      : { uz: "Holat o'tganini ko'rsatdi, endi oldinga qaraymiz: har sahnada mos tanlovni bosing.", ru: 'Статус показал прошлое, теперь смотрим вперёд: в каждой сцене нажмите подходящий выбор.' };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · risk', ru: 'Понятие · риск' })} screen={screen} scrollSignal={b * 2 + (faza === 'yozildi' ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr(DAVOM) : `${tr({ uz: 'Risklarni oching', ru: 'Откройте риски' })} (${yig.length}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor roadmap'iga nima <A>xalaqit berishi</A> mumkin?</>, ru: <>Что может <A>помешать</A> roadmap Ментора?</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        bashorat={!tugadi && <div className="oo-s3-bosh"><QQadamlar joriy={done ? undefined : b} qadamlar={S3_BOSQICH.map(tr)} /><NishonQatori screen={screen} /></div>}
        vizual={tugadi ? <div className="oo-s3 tamom">{royxat}</div> : <div className="oo-s3">
          <S3Sahna b={Math.min(b, 2)} yechildi={faza === 'yozildi'} key={'s' + Math.min(b, 2)} />
          <div className="oo-s3-ong">
            {!done && <div ref={kartaRef} key={'k' + b} className="oo-s3-k">
              <RiskK uch={'rk-' + b} risk={tr(r.risk)} qadam={faza === 'yozildi' ? tr(mentorQadam(b)) : null} ufq={faza === 'yozildi' && ufqQ(r.ufq)} xato={!!xato} osti={faza === 'yozildi' && tr(r.osti)} />
              {qIzoh && <QIzoh>{tr({ uz: 'Riskni kamaytiradigan bitta aniq ish — qadam.', ru: 'Один конкретный шаг, который уменьшает риск, — это шаг.' })}</QIzoh>}
              {faza === 'yozildi' && b < 2 && <QTugma className="oo-halqa oo-keyingi" onClick={keyingi}>{tr({ uz: 'Keyingi risk ›', ru: 'Следующий риск ›' })}</QTugma>}
              {faza === 'tanlov' && <div className="oo-s3-pastki">
                <div className="oo-tanlovlar oo-guruh" key={'t' + b + (xato ? xato.kk : '')}>
                  {r.tanlov.map((t, i) => <QChip key={i} silk={!!(xato && xato.i === i)} holat={xato && xato.i === i ? 'err' : undefined} style={{ '--i': i }} onClick={(e) => tanla(t, i, e)}>{tr(t.t)}</QChip>)}
                </div>
                {xato && <QXato key={xato.kk}>{tr(r.tanlov[xato.i].xato)}</QXato>}
                {xato && yordam.includes(b) && <QIzoh>{tr(r.yordam)}</QIzoh>}
              </div>}
            </div>}
            {royxat}
          </div>
        </div>}
        xulosa={tugadi && tr({ uz: 'Risk — rejaga xalaqit berishi mumkin bo\'lgan narsa. Har riskka bitta qadam yoziladi.', ru: 'Риск — то, что может помешать плану. На каждый риск пишут один шаг.' })}
      />
      <MentorNote>{tr({ uz: "Kutish yozuvi — 10-Moduldagi «kutish holati»ning ilovadagi ko'rinishi (o'sha modulda saytga qo'yilgan edi); o'quvchilarga shunday eslating, «holat» so'zini bu darsda ishlatmang. Kutish yozuvi Backend'ni uyg'otmaydi — o'yinchi kutishini aytadi va ilovani yopmasligiga yordam beradi. APK faqat Android uchun; iPhone yo'li 12-Modulda (dastur: «Expo Go / APK»). Hisoblagich tezlashtirilgan — real kutish bir daqiqagacha. Sinfdan so'rang: «Holat bilan riskning farqi nima?» (holat — bo'lib o'tgani, risk — oldinda bo'lishi mumkini).", ru: 'Надпись ожидания — это «состояние ожидания» из 10-го модуля, только в приложении (там его ставили на сайт); напомните ученикам об этом, но слово «статус» здесь для ожидания не используйте. Надпись ожидания не будит Backend — она говорит игроку, что надо подождать, и помогает не закрыть приложение. APK — только для Android; путь для iPhone — в 12-м модуле (программа: «Expo Go / APK»). Счётчик ускорен — реальное ожидание до минуты. Спросите класс: «Чем статус отличается от риска?» (статус — то, что было; риск — то, что может случиться впереди).' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; ✔ C, INLINE_KEYS.s4 = 2; ikkinchi olam — imtihon haftasi, P-002; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · risk', ru: 'Проверка · риск' })}
    questionText="Qaysi biri roadmap'ingizga risk bo'ladi?"
    question={tr({ uz: <h2 className="title h-ask">Qaysi biri roadmap'ingizga <A>risk bo'ladi?</A></h2>, ru: <h2 className="title h-ask">Что из этого станет <A>риском</A> для вашего roadmap?</h2> })}
    options={[
      { uz: '14-darsdagi funksiya darsdan keyin tugadi', ru: 'Функция 14-го урока закончилась после урока' },
      { uz: 'Do\'stlar sinovga yordam berishi mumkin', ru: 'Друзья могут помочь с тестом' },
      { uz: 'Imtihon haftasida vaqt qolmasligi mumkin', ru: 'В неделю экзаменов может не остаться времени' },
      { uz: 'Keyinroq ufqidagi ishlar hali boshlanmagan', ru: 'Работы горизонта «позже» ещё не начаты' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Vaqt qolmasligi oldinda rejaga xalaqit berishi mumkin.', ru: 'Нехватка времени впереди может помешать плану.' }}
    explainWrong={{
      0: { uz: "Bu bo'lib o'tgan ish — uning holati: kechikdi.", ru: 'Это прошедшая работа — её статус: с опозданием.' },
      1: { uz: "Bu roadmap'ingizga yordam beradi — xalaqit emas.", ru: 'Это помогает вашему roadmap, а не мешает.' },
      3: { uz: 'Ularning vaqti hali kelmagan — bu holat, risk emas.', ru: 'Их время ещё не пришло — это статус, а не риск.' },
      default: { uz: 'Qaysi biri oldinda rejaga xalaqit berishi mumkin?', ru: 'Что из этого впереди может помешать плану?' }
    }}
    vizual={<RiskK yorliq={false} risk={tr({ uz: 'Imtihon haftasida vaqt qolmasligi mumkin', ru: 'В неделю экзаменов может не остаться времени' })} />} />
);

// ===== SCREEN 5 — ROADMAP'INGIZ (QMustaqil, USTAXONA 1/3 — ketma-ket karta; SABOQ 9, 13, 17, 29): katta karta doska ustida, holat qo'yilgach doskadagi joyiga uchadi =====
// KOD 4: Mentor varag'i (o'quvchi matni Mentor ekranida) — jonli yo'l hali yo'q (recordAttempt matni Mentorga o'qilmaydi). Yo'l paydo bo'lsa — true;
// shunda 5-ekran tepasidagi qator «Mentor o'z ekranida ko'radi» bo'ladi (15-FILTR 21, tayanch 9.96).
const VARAQ_JONLI = false;
const VARAQ_QATOR = {
  bor: { uz: "Yakkama-yakka suhbatda Mentor buni o'z ekranida ko'radi.", ru: 'В разговоре один на один Ментор увидит это на своём экране.' },
  yoq: { uz: "Yakkama-yakkada roadmap'ingizni Mentorga o'z ekraningizda ko'rsatasiz.", ru: 'В разговоре один на один вы покажете свой roadmap Ментору на своём экране.' }
};
const s5Xulosa = (ishlar) => {
  const son = (h) => ishlar.filter(x => x.holat === h).length;
  const bol = HOLAT_TUGMA.map(h => [son(h), h]).filter(([x]) => x > 0);
  const uz = bol.map(([x, h], i) => (i === 0 ? `${x} ta ish ${h}` : `${x} tasi ${h}`)).join(', ');
  const ru = bol.map(([x, h]) => `${HOLAT[h].ch.ru} — ${x}`).join(', ');
  return tr({ uz: `Roadmap'ingizda: ${uz}.`, ru: `В вашем roadmap: ${ru}.` });
};
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [manba] = useState(talabaIshlar);
  const formRejim = manba.manba !== 'roadmap';
  const [yozma, setYozma] = useState(() => (manba.manba === 'yozma' ? manba.ishlar : []));
  const [holat, setHolat] = useState(() => qoralama().holat || {});
  const [tahrir, setTahrir] = useState(null);
  const [yangi, setYangi] = useState(null);
  const [izoh, setIzoh] = useState(null);
  const [nom, setNom] = useState('');
  const [ufq, setUfq] = useState(null);
  const [fxato, setFxato] = useState(null);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const baza = formRejim ? yozma : manba.ishlar;
  const ishlar = baza.map(x => ({ ...x, holat: holat[x.key] || null }));
  const N = ishlar.length;
  const n = ishlar.filter(x => x.holat).length;
  const done = N > 0 && n === N && tahrir === null && (!formRejim || (N >= 3 && ishlar.some(x => x.ufq === 'hozir')));
  const joriy = tahrir !== null ? ishlar.find(x => x.key === tahrir) : ishlar.find(x => !x.holat);
  const sanoq = useSanoq(n);
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1200); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => { if (!izoh) return undefined; const t = setTimeout(() => setIzoh(null), 4500); return () => clearTimeout(t); }, [izoh]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const c = (h) => Math.min(9, ishlar.filter(x => x.holat === h).length);
    onAnswer(screen, { stage: 'holat', screenIdx: screen, practice: 'holat', correct: true, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', c('bajarildi') * 100 + c('kechikdi') * 10 + c('boshlanmadi'), true, 0);
  }, [done]); // eslint-disable-line
  const qoy = (h) => {
    if (!joriy || isMentor) return;
    const yh = { ...holat, [joriy.key]: h };
    uch(kartaRef.current, 'k-' + joriy.key, 620);
    setHolat(yh); qoralamaYoz({ holat: yh }); setYangi(joriy.key); setTahrir(null);
    setIzoh(h === 'boshlanmadi' && joriy.ufq === 'hozir' && joriy.dars ? { kk: Date.now() } : null);
  };
  const qosh = () => {
    if (!nom.trim()) { setFxato({ kk: Date.now() }); return; }
    if (!ufq || yozma.length >= 8) return;
    const ro = [...yozma, { key: 'y' + Date.now().toString(36), nom: nom.trim(), ufq }];
    setYozma(ro); qoralamaYoz({ ishlar: ro }); setNom(''); setUfq(null); setFxato(null);
  };
  const qaytaT = joriy && joriy.key === 'sinov' && joriy.qayta === 'toxtamadi' ? { uz: '13-darsda: qayta sinovda takrorlanmadi', ru: 'На 13-м уроке: при повторном тесте не повторилось' }
    : joriy && joriy.key === 'sinov' && joriy.qayta === 'toxtadi' ? { uz: "13-darsda: qayta sinovda yana to'xtadi", ru: 'На 13-м уроке: при повторном тесте снова остановился' } : null;
  const katta = joriy && !isMentor && (
    <div className="oo-katta fade-up" ref={kartaRef} key={joriy.key}>
      <div className="oo-katta-bosh"><b className="oo-katta-nom">{joriy.nom}</b><span className="oo-kul">{tr(UFQLAR.find(u => u.id === joriy.ufq).t)}{joriy.yorliq ? ` · ${joriy.yorliq}` : ''}</span></div>
      {qaytaT && <p className="oo-kul-q">{tr(qaytaT)}</p>}
      <div className={cxx('oo-tugmalar', joriy.ufq === 'hozir' && 'oo-guruh')}>
        {HOLAT_TUGMA.map((h, i) => <QChip key={h} className={joriy.ufq !== 'hozir' && h === 'boshlanmadi' ? 'oo-halqa' : undefined} holat={joriy.holat === h ? 'on' : undefined} style={{ '--i': i }} onClick={() => qoy(h)}>{tr(HOLAT[h].t)}</QChip>)}
      </div>
    </div>
  );
  const forma = formRejim && !isMentor && !joriy && yozma.length < 8 && (
    <div className={cxx('oo-katta', 'oo-forma', done && 'ixcham')}>
      {!done && <p className="oo-kul-q">{tr({ uz: 'Roadmap topilmadi — ishlaringizni yozing.', ru: 'Roadmap не найден — напишите свои работы.' })}</p>}
      <div className="oo-forma-q">
        <input className={cxx('oo-inp', !nom.trim() && 'oo-halqa-i')} value={nom} placeholder={tr({ uz: 'Ish nomi', ru: 'Название работы' })} aria-label={tr({ uz: 'Ish nomi', ru: 'Название работы' })} onChange={(e) => { setNom(e.target.value); setFxato(null); }} onKeyDown={(e) => { if (e.key === 'Enter') qosh(); }} />
        <div className={cxx('oo-tugmalar', nom.trim() && !ufq && 'oo-guruh')}>{UFQLAR.map(u => <QChip key={u.id} holat={ufq === u.id ? 'on' : undefined} onClick={() => setUfq(u.id)}>{tr(u.t)}</QChip>)}</div>
        <QTugma className={halqa(!!(nom.trim() && ufq))} disabled={!ufq} onClick={qosh}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>
      </div>
      {fxato && <QXato key={fxato.kk}>{tr({ uz: 'Ish nomini yozing.', ru: 'Напишите название работы.' })}</QXato>}
    </div>
  );
  const mentorT = done
    ? { uz: "Holatlarni ko'ring: o'zgarsa — ✎, keyin «Davom etish»ni bosing.", ru: 'Посмотрите статусы: если что-то изменилось — ✎, потом нажмите «Продолжить».' }
    : formRejim && !joriy
      ? { uz: "Ishni yozing, ufqini tanlang va «Qo'shish»ni bosing.", ru: 'Напишите работу, выберите горизонт и нажмите «Добавить».' }
      : { uz: 'Ish o\'z vaqtida tugadimi — ilovangizda tekshirib, bitta tugmani bosing.', ru: 'Закончилась ли работа вовремя — проверьте в своём приложении и нажмите одну кнопку.' };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · holat', ru: 'Самостоятельная работа · статус' })} screen={screen} scrollSignal={n + yozma.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr(DAVOM) : `${tr({ uz: "Har ishga holat qo'ying", ru: 'Поставьте статус каждой работе' })}${N ? ` (${n}/${N})` : ''}`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Roadmap'ingizdagi har ishga <A>holat</A> qo'ying.</>, ru: <>Поставьте <A>статус</A> каждой работе в roadmap.</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        qadamlar={isMentor
          ? <MentorRoyxat screen={screen} yorliq={{ uz: "Holat qo'yganlar", ru: 'Поставили статусы' }} qator={(r) => r
            ? <span className="oo-mr-ch">{[Math.floor(r.picked / 100), Math.floor(r.picked / 10) % 10, r.picked % 10].map((v, i) => <span key={i} className={cxx('rd-chip', HOLAT_TUGMA[i])}>{i === 0 ? '✓' : tr(HOLAT[HOLAT_TUGMA[i]].ch)} {v}</span>)}</span>
            : <span className="oo-mr-y">—</span>} />
          : isStudent && jonliDars(live) && <p className="oo-kul-q">{tr(VARAQ_JONLI ? VARAQ_QATOR.bor : VARAQ_QATOR.yoq)}</p>}
        forma={isMentor ? null : (katta || forma)}
      >
        {isMentor
          ? <RejaDoska ishlar={mentorIshlar(true)} sarlavha={<MentorMisoli />} />
          : N > 0 && <RejaDoska ishlar={ishlar} sarlavha={tr(ROADMAPIM)} son={<b className="rd-son">{sanoq} / {N}</b>} joriy={joriy ? [joriy.key] : []} yangi={yangi ? [yangi] : []} onIsh={done ? (x) => setTahrir(x.key) : undefined} />}
        {izoh && !isMentor && <QIzoh key={izoh.kk}>{tr({ uz: 'Darsi o\'tgan, lekin boshlanmagan ish — Mentorga shuni ayting.', ru: 'Урок прошёл, а работа не начата — скажите об этом Ментору.' })}</QIzoh>}
        {done && !isMentor && <QXulosa>{s5Xulosa(ishlar)}</QXulosa>}
        <MentorNote>{tr({ uz: "«Bajarildi» sharti — ish o'quvchining telefonida (yoki brauzerida) hozir ishlaydi va rejadagi vaqtida (hozir ufqida — o'z darsida) tugagan. Kechikkan ish uyalish emas: yakkama-yakkada «nima to'xtatdi?» deb so'rang. O'quvchi roadmap'idagi ish nomlari 6-darsdagidek; bu ekranda nom o'zgartirilmaydi (holat qo'yiladi).", ru: 'Условие «выполнено» — работа сейчас работает на телефоне (или в браузере) ученика и закончилась в плановое время (для горизонта «сейчас» — на своём уроке). Опоздание — не стыд: в разговоре один на один спросите «что остановило?». Названия работ — как на 6-м уроке; на этом экране их не меняют (ставят статус).' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 6 — UCH RISK (QMustaqil, USTAXONA 2/3 — bitta katta karta, saqlangani «Risklarim»ga uchadi; SABOQ 29) · 3/3 dan keyin ★ → eng =====
// Tekshiruv (PM-108): bo'sh — bloklaydi; bo'lib o'tgan ish so'zlari · umumiy qadam so'zlari · takror — yumshoq (ikkinchi «Saqlash» bilan o'tadi)
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normYoz = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/[.,!?;:«»"]+/g, ' ').replace(/\s+/g, ' ').trim();
const OTGAN_SOZ = ['kechikdi', 'ishlamadi', "bo'lmadi", 'ulgurmadim', 'qilmadim'];
const UMUMIY_SOZ = ['harakat qilaman', "ehtiyot bo'laman", "e'tibor beraman", 'yaxshilayman', "o'ylab ko'raman", 'tezroq ishlayman', "ko'proq ishlayman"];
const tekshirRisk = (risk, qadam, royxat, tahrir) => {
  if (!String(risk || '').trim() || !String(qadam || '').trim()) return { tur: 'bosh', q: true, k: !String(risk || '').trim() ? 'risk' : 'qadam' };
  const nr = normYoz(risk), nq = normYoz(qadam);
  if (OTGAN_SOZ.some(w => nr.includes(w))) return { tur: 'otgan', k: 'risk' };
  if (UMUMIY_SOZ.some(w => nq.includes(w))) return { tur: 'umumiy', k: 'qadam' };
  if (royxat.some((o, i) => i !== tahrir && normYoz(o.risk) === nr)) return { tur: 'takror', k: 'risk' };
  return null;
};
const XABAR6 = {
  bosh: { uz: 'Risk va qadamni ham yozing.', ru: 'Напишите и риск, и шаг.' },
  otgan: { uz: "Bu bo'lib o'tgan ish. Oldinda nima xalaqit berishi mumkin?", ru: 'Это уже прошло. Что может помешать впереди?' },
  umumiy: { uz: 'Bu hali qadam emas: aynan nima qilasiz?', ru: 'Это ещё не шаг: что именно вы сделаете?' },
  takror: { uz: 'Bu risk yozilgan — boshqasini toping.', ru: 'Этот риск уже записан — найдите другой.' }
};
const QOLDIR6 = { uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: 'Если оставить так — снова нажмите «Сохранить».' };
const PH6 = { risk: { uz: 'Rejaga nima xalaqit berishi mumkin?', ru: 'Что может помешать плану?' }, qadam: { uz: 'Uni kamaytiradigan bitta ish', ru: 'Одно дело, которое его уменьшит' } };
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [d0] = useState(qoralama);
  const [royxat, setRoyxat] = useState(() => (Array.isArray(d0.risklar) ? d0.risklar.filter(x => x && x.risk && x.qadam).slice(0, 3) : []));
  const [eng, setEng] = useState(Number.isInteger(d0.eng) ? d0.eng : null);
  const [joriy, setJoriy] = useState({ risk: '', qadam: '' });
  const [tahrir, setTahrir] = useState(null);
  const [tg, setTg] = useState(null);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [kartaK, setKartaK] = useState(0);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const [ish] = useState(() => holatli(talabaIshlar().ishlar, qoralama()));
  const [sv] = useState(sinovLs);
  const n = royxat.length;
  const done = n >= 3 && tahrir === null;
  const g = tahrir !== null ? tg : joriy;
  const setG = (f) => (tahrir !== null ? setTg(o => ({ ...o, ...f })) : setJoriy(o => ({ ...o, ...f })));
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  useEffect(() => {
    if (n < 3 || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'risklar', screenIdx: screen, practice: 'risklar', correct: true, picked: true, solved: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 3, true, 0);
  }, [n]); // eslint-disable-line
  const saqla = () => {
    if (!g) return;
    const t = tekshirRisk(g.risk, g.qadam, royxat, tahrir);
    const imzo = t && `${t.tur}|${normYoz(g.risk)}|${normYoz(g.qadam)}`;
    if (t && (t.q || !(xato && xato.imzo === imzo))) { setXato({ ...t, imzo, kk: Date.now() }); return; }
    setXato(null);
    const yr = { risk: g.risk.trim(), qadam: g.qadam.trim() };
    const idx = tahrir !== null ? tahrir : royxat.length;
    const ro = tahrir !== null ? royxat.map((o, i) => (i === tahrir ? yr : o)) : [...royxat, yr];
    uch(kartaRef.current, 'r6-' + idx, 620);
    setRoyxat(ro); qoralamaYoz({ risklar: ro });
    setYangi(idx);
    if (tahrir !== null) { setTahrir(null); setTg(null); } else setJoriy({ risk: '', qadam: '' });
    setYordam(false); setKartaK(k => k + 1);
  };
  const ochTahrir = (i) => { if (isMentor) return; setTahrir(i); setTg({ ...royxat[i] }); setXato(null); setKartaK(k => k + 1); };
  const belgila = (i) => {
    if (isMentor) return;
    setEng(i); qoralamaYoz({ eng: i });
    const rj = rejaLs(); if (rj) lsSet(REJA_KEY, { ...rj, eng: i, savedAt: Date.now() });
  };
  const kech = ish.filter(x => x.holat === 'kechikdi')[0];
  const sinovN = sv && Array.isArray(sv.bajardi) ? sv.bajardi.length : 0;
  const yord = [
    kech && { uz: `Kechikkan ish: ${kech.nom}. Shu sabab yana takrorlanishi mumkinmi?`, ru: `Работа с опозданием: ${kech.nom}. Может ли эта причина повториться?` },
    sinovN > 0 && (sv.tur === 'mashq' ? { uz: `Mashq sinovida ${sinovN} kishi qatnashdi.`, ru: `В учебном тесте участвовали: ${sinovN}.` } : { uz: `Sinovda ${sinovN} kishi qatnashdi.`, ru: `В тесте участвовали: ${sinovN}.` })
  ].filter(Boolean);
  const yordamT = trekWeb()
    ? { uz: "Uch joyga qarang: texnika (Backend, saytni ochish), odamlar (foydalanuvchilar soni) va vaqt (imtihon, ulgurish) — keyin kechikkan ishingizni eslang.", ru: 'Посмотрите в три места: техника (Backend, открытие сайта), люди (число пользователей) и время (экзамены, успеть) — потом вспомните свою работу с опозданием.' }
    : { uz: "Uch joyga qarang: texnika (Backend, ilovani ochish), odamlar (foydalanuvchilar soni) va vaqt (imtihon, ulgurish) — keyin kechikkan ishingizni eslang.", ru: 'Посмотрите в три места: техника (Backend, открытие приложения), люди (число пользователей) и время (экзамены, успеть) — потом вспомните свою работу с опозданием.' };
  const toliq = !!(g && g.risk.trim() && g.qadam.trim());
  const qatorI = (k) => {
    const xq = xato && xato.k === k;
    const birinchiBosh = g && !g.risk.trim() ? 'risk' : g && !g.qadam.trim() ? 'qadam' : null;
    return (
      <div className={cxx('oo-rq', xq && 'xato')}>
        <label className="oo-rq-l" htmlFor={'r6-' + k}>{tr(k === 'risk' ? RISK_T : QADAM_T)}</label>
        <input id={'r6-' + k} className={cxx('oo-inp', birinchiBosh === k && 'oo-halqa-i')} value={g ? g[k] : ''} placeholder={tr(PH6[k])} onChange={(e) => { setG({ [k]: e.target.value }); if (xato && xato.k === k && xato.q) setXato(null); }} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />
        {xq && <div className="oo-rq-x"><QXato>{tr(XABAR6[xato.tur])}</QXato>{!xato.q && <QIzoh>{tr(QOLDIR6)}</QIzoh>}</div>}
      </div>
    );
  };
  const roy = n > 0 && (
    <div className={cxx('oo-risklarim', done && 'keng')}>
      <div className="oo-risklarim-h"><span className="oo-yorliq">{tr({ uz: 'Risklarim', ru: 'Мои риски' })}</span><b className="rd-son" key={n}>{n} / 3</b></div>
      {done && <p className="oo-kul-q">{tr({ uz: 'Qaysi risk eng katta? — bitta qatorni bosing.', ru: 'Какой риск самый большой? — нажмите одну строку.' })}</p>}
      <ol className="oo-r6-ro">
        {royxat.map((o, i) => (
          <li key={i} className={cxx('oo-r6', yangi === i && 'yangi', tahrir === i && 'joriy', eng === i && done && 'eng')} data-uch={'r6-' + i}>
            {done
              ? <button type="button" className={cxx('oo-yulduz', eng === null && i === 0 && 'oo-halqa')} onClick={() => belgila(i)}><i aria-hidden="true">{eng === i ? '★' : '☆'}</i><span className="oo-r6-r">{o.risk}</span><b aria-hidden="true">→</b><span className="oo-r6-q">{o.qadam}</span></button>
              : <span className="oo-r6-b"><span className="oo-r6-r">{qisqa(o.risk, 30)}</span><b aria-hidden="true">→</b><span className="oo-r6-q">{qisqa(o.qadam, 30)}</span></span>}
            {!isMentor && <button type="button" className="rd-ed" aria-label="✎" onClick={() => ochTahrir(i)}>✎</button>}
          </li>
        ))}
      </ol>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · risk', ru: 'Самостоятельная работа · риск' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr(DAVOM) : (__lang === 'ru' ? `Напишите ещё рисков: ${3 - n}` : `Yana ${3 - n} ta risk yozing`)} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Roadmap'ingiz uchun <A>uchta risk</A> yozing.</>, ru: <>Напишите <A>три риска</A> для своего roadmap.</> })}
        mentor={<Mentor>{tr(done
          ? { uz: 'Eng katta riskni ★ bilan belgilang, keyin «Davom etish»ni bosing.', ru: 'Отметьте самый большой риск ★, потом нажмите «Продолжить».' }
          : { uz: 'Avval riskni, keyin unga bitta aniq qadamni yozing.', ru: 'Сначала напишите риск, потом один конкретный шаг к нему.' })}</Mentor>}
        qadamlar={isMentor
          ? <MentorRoyxat screen={screen} yorliq={{ uz: 'Uch risk yozganlar', ru: 'Написали три риска' }} qator={(r) => <span className={cxx('oo-mr-y', r && 'ok')}>{r ? tr({ uz: 'Risklar 3/3 ✓', ru: 'Риски 3/3 ✓' }) : tr({ uz: 'Risklar —', ru: 'Риски —' })}</span>} />
          : <>{ish.length > 0 && <RejaDoska kor="ixcham" ishlar={ish} sarlavha={<>{tr(ROADMAPIM)} · {tr({ uz: 'holatlar', ru: 'статусы' })} {ish.filter(x => x.holat).length}/{ish.length}</>} />}{roy}</>}
        forma={!isMentor && !done && <div className="oo-katta fade-up" key={kartaK} ref={kartaRef}>
          <div className="oo-katta-bosh"><b className="oo-katta-nom">{tr(RISK_T)} {(tahrir !== null ? tahrir : n) + 1}</b></div>
          {yord.length > 0 && <div className="oo-yord">{yord.map((t, i) => <p key={i} className="oo-kul-q">{tr(t)}</p>)}</div>}
          {qatorI('risk')}
          {qatorI('qadam')}
          <div className="oo-amal">
            <QTugma ikkinchi onClick={() => setYordam(o => !o)}>{tr(YORDAM_T)}</QTugma>
            <QTugma className={halqa(toliq)} onClick={saqla}>{tr(SAQLASH)}</QTugma>
          </div>
          {yordam && <QIzoh>{tr(yordamT)}</QIzoh>}
        </div>}
      >
        {done && !isMentor && <QXulosa>{tr({ uz: 'Uch riskka uchta qadam yozildi: har biri — bitta aniq ish.', ru: 'На три риска написаны три шага: каждый — одно конкретное дело.' })}</QXulosa>}
        <MentorNote>{tr({ uz: "Yakkama-yakka shu ekrandan keyin boshlanadi. Uch riskni yozgan o'quvchini chaqiring (≈ 3–4 daqiqa; qolganlar 6–7-ekranlarda ishlaydi). Uch savol: 1) Qaysi ish kechikdi va nega? 2) Uch riskdan qaysi biri eng katta? 3) Birinchi qadam qachon va qanday bajariladi? — 2 va 3-javobni o'quvchi ★ va «Avval» bilan belgilaydi. Vaqt: 12 kishigacha ≈ 4 daqiqa; 13–15 kishi bo'lsa — 3 daqiqa taymer bilan yoki ikki aylanishda (avval 2 va 3-savol, keyin 1-savol). Qadam umumiy bo'lsa («harakat qilaman»), «aynan nima qilasiz?» deb aniqlashtiring. Mentor misolidagi uch risk — Backend, foydalanuvchilar, ilovani ochish; uni o'quvchiga «to'g'ri javob» qilib bermang — uning mahsuloti boshqa.", ru: 'Разговор один на один начинается после этого экрана. Зовите ученика, который написал три риска (≈ 3–4 минуты; остальные работают на 6–7-м экранах). Три вопроса: 1) Какая работа опоздала и почему? 2) Какой из трёх рисков самый большой? 3) Когда и как будет сделан первый шаг? — ответы 2 и 3 ученик отмечает ★ и «Сначала». Время: до 12 человек ≈ 4 минуты; если 13–15 — 3 минуты с таймером или в два круга (сначала вопросы 2 и 3, потом 1). Если шаг общий («буду стараться»), уточните: «что именно сделаете?». Три риска из примера Ментора — Backend, пользователи, открытие приложения; не давайте их ученику как «правильный ответ» — у него другой продукт.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 7 — TUZATILGAN REJA (QMustaqil, USTAXONA 3/3 — ketma-ket qadam kartasi; uch ufq tugmasi → qadam ustunga uchadi) · artefakt pm-m9d15-reja · nishon planFixer (bonus) =====
const s7Xulosa = (risklar, ufqlar, birinchi) => {
  const bi = birinchiI(risklar, ufqlar, birinchi);
  if (bi < 0) return '';
  const q = nuqtasiz(risklar[bi].qadam);
  const a = ufqlar.filter((u, i) => u === 'hozir' && risklar[i]).length;
  return a > 0
    ? tr({ uz: `Tuzatilgan rejangizda ${a} ta qadam hozir ufqida. Birinchisi: ${q}.`, ru: `В исправленном плане шагов в горизонте «сейчас»: ${a}. Первый: ${q}.` })
    : tr({ uz: `Qadamlaringiz keyingi ufqlarda. Birinchisi: ${q}.`, ru: `Ваши шаги — в следующих горизонтах. Первый: ${q}.` });
};
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [d0] = useState(qoralama);
  const [ishBaza] = useState(() => talabaIshlar().ishlar || []);
  const ishlar = holatli(ishBaza, d0);
  const [risklar, setRisklar] = useState(() => (Array.isArray(d0.risklar) ? d0.risklar.filter(x => x && x.risk && x.qadam).slice(0, 3) : []));
  const [ufqlar, setUfqlar] = useState(() => { const u = Array.isArray(d0.ufqlar) ? d0.ufqlar : []; return [0, 1, 2].map(i => u[i] || null); });
  const [birinchi, setBirinchi] = useState(Number.isInteger(d0.birinchi) ? d0.birinchi : null);
  const [tahrir, setTahrir] = useState(null);
  const [tMatn, setTMatn] = useState('');
  const [saqlandi, setSaqlandi] = useState(() => !!rejaLs());
  const [ozgardi, setOzgardi] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [izoh, setIzoh] = useState(false);
  const kartaRef = useRef(null);
  const uch = useUchish();
  const R = risklar.length;
  const joylandi = [0, 1, 2].filter(i => i < R && ufqlar[i]).length;
  const hammasi = R >= 3 && joylandi >= 3;
  const joriyI = tahrir !== null ? tahrir : [0, 1, 2].find(i => i < R && !ufqlar[i]);
  const done = hammasi && saqlandi && tahrir === null;
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  const ufqQoy = (u) => {
    if (joriyI === undefined || isMentor) return;
    const yu = ufqlar.map((x, i) => (i === joriyI ? u : x));
    const yr = tahrir !== null && tMatn.trim() ? risklar.map((x, i) => (i === joriyI ? { ...x, qadam: tMatn.trim() } : x)) : risklar;
    uch(kartaRef.current, 'q-' + joriyI, 640);
    setUfqlar(yu); setRisklar(yr); qoralamaYoz({ ufqlar: yu, risklar: yr }); setYangi(joriyI); setTahrir(null);
    if (saqlandi) setOzgardi(true);
    if (!hammasi && R >= 3 && yu.filter(Boolean).length >= 3) setIzoh(true);
  };
  const avvalBos = (q) => {
    if (!hammasi || isMentor) return;
    setBirinchi(q.idx); qoralamaYoz({ birinchi: q.idx });
    if (saqlandi) setOzgardi(true);
  };
  const ochTahrir = (q) => { if (isMentor) return; setTahrir(q.idx); setTMatn(risklar[q.idx].qadam); };
  const saqla = () => {
    if (!hammasi) return;
    rejaYoz(ishBaza, { ...qoralama(), risklar, ufqlar, birinchi });
    setSaqlandi(true); setOzgardi(false);
    if (storedAnswer === undefined) {
      onAnswer(screen, { stage: 'reja', screenIdx: screen, practice: 'reja', correct: true, picked: true, solved: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', ufqlar.filter(x => x === 'hozir').length, true, 0);
    }
  };
  const qadamlar = [0, 1, 2].filter(i => i < R && ufqlar[i] && i !== tahrir).map(i => ({ key: String(i), idx: i, matn: risklar[i].qadam, risk: `${tr(RISK_T)}: ${qisqa(risklar[i].risk, 44)}`, ufq: ufqlar[i] }));
  const katta = !isMentor && joriyI !== undefined && R > 0 && (
    <div className="oo-katta fade-up" ref={kartaRef} key={'q' + joriyI + (tahrir !== null ? 't' : '')}>
      <div className="oo-katta-bosh"><span className="oo-kul">{tr({ uz: 'Qadam', ru: 'Шаг' })} {joriyI + 1} / 3</span></div>
      {tahrir !== null
        ? <input className="oo-inp" value={tMatn} aria-label={tr(QADAM_T)} onChange={(e) => setTMatn(e.target.value)} />
        : <b className="oo-katta-nom">{risklar[joriyI].qadam}</b>}
      <span className="oo-kul">{tr(RISK_T)}: {risklar[joriyI].risk}</span>
      <div className="oo-tugmalar oo-guruh">{UFQLAR.map((u, i) => <QChip key={u.id} holat={ufqlar[joriyI] === u.id ? 'on' : undefined} style={{ '--i': i }} onClick={() => ufqQoy(u.id)}>{tr(u.t)}</QChip>)}</div>
    </div>
  );
  const kam = !isMentor && R < 3 && <p className="oo-kul-q">{tr({ uz: "Avval uchta risk yozing — «Orqaga»ni bosing.", ru: 'Сначала напишите три риска — нажмите «Назад».' })}</p>;
  const mentorT = !hammasi
    ? { uz: 'Qadam qachon boshlana oladi — o\'sha ufqni bosing.', ru: 'Когда шаг сможет начаться — нажмите этот горизонт.' }
    : !saqlandi
      ? { uz: "Boshlaydigan qadamingizni bosing, keyin «Saqlash»ni bosing.", ru: 'Нажмите шаг, с которого начнёте, потом нажмите «Сохранить».' }
      : { uz: 'Reja saqlandi — «Davom etish»ni bosing.', ru: 'План сохранён — нажмите «Продолжить».' };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · reja', ru: 'Самостоятельная работа · план' })} screen={screen} scrollSignal={joylandi + (saqlandi ? 4 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr(DAVOM) : hammasi ? tr({ uz: 'Tuzatilgan rejani saqlang', ru: 'Сохраните исправленный план' }) : `${tr({ uz: "Qadamlarni ufqqa qo'ying", ru: 'Поставьте шаги в горизонты' })} (${joylandi}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Har qadamni roadmap'ingizdagi <A>ufqqa</A> qo'ying.</>, ru: <>Поставьте каждый шаг в <A>горизонт</A> roadmap.</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        qadamlar={isMentor && <MentorRoyxat screen={screen} yorliq={{ uz: 'Tuzatilgan rejani saqlaganlar', ru: 'Сохранили исправленный план' }} qator={(r) => <span className={cxx('oo-mr-y', r && 'ok')}>{r ? tr({ uz: 'Reja saqlandi ✓', ru: 'План сохранён ✓' }) : '—'}</span>} />}
        forma={isMentor ? null : (katta || kam)}
      >
        {isMentor
          ? <RejaDoska ishlar={mentorIshlar(true)} qadamlar={MENTOR_RISKLAR.map((r, i) => ({ key: 'm' + i, idx: i, matn: tr(mentorQadam(i)), risk: `${tr(RISK_T)}: ${qisqa(tr(r.risk), 44)}`, ufq: r.ufq }))} avval={0} sarlavha={tr(TUZATILGAN)} />
          : <RejaDoska ishlar={ishlar} qadamlar={qadamlar} sarlavha={tr(hammasi ? TUZATILGAN : ROADMAPIM)} sarKalit={hammasi ? 't' : 'r'} yonadi={izoh}
            son={hammasi && tahrir === null && <span className="oo-s7-h fade-step"><span className="oo-kul">{tr({ uz: 'Qaysi qadamdan boshlaysiz? — bitta qadam kartasini bosing.', ru: 'С какого шага начнёте? — нажмите одну карточку шага.' })}</span>
              <QTugma className={halqa(!saqlandi || ozgardi)} disabled={saqlandi && !ozgardi} onClick={saqla}>{tr(saqlandi ? { uz: 'Yangilash', ru: 'Обновить' } : SAQLASH)}</QTugma></span>}
            yangi={yangi !== null ? ['q-' + yangi] : []} avval={hammasi ? birinchi : null} onQadam={hammasi ? avvalBos : undefined} onQadamEd={ochTahrir} />}
        {!isMentor && izoh && !saqlandi && <QIzoh>{tr({ uz: "Holatlar va risklarga qarshi qadamlar qo'shilgan roadmap — tuzatilgan reja.", ru: 'Roadmap со статусами и шагами против рисков — это исправленный план.' })}</QIzoh>}
        {!isMentor && isStudent && jonliDars(live) && <p className="oo-kul-q">{tr({ uz: "Mentor chaqirganda roadmap'ingizni ko'rsating; o'zgarsa — ✎ bilan o'zgartiring.", ru: 'Когда Ментор позовёт, покажите свой roadmap; если что-то изменится — исправьте через ✎.' })}</p>}
        {!isMentor && done && <div className="oo-s7-x"><QXulosa>{s7Xulosa(risklar, ufqlar, birinchi)}</QXulosa></div>}
        <MentorNote>{tr({ uz: "Ufq qoidasi 6-Moduldan: ishni ufqqa u qachon boshlana olishi qo'yadi. Mentor misolida: kutish yozuvi va 10 kishini chaqirish — hozir, APK — keyinroq (12-Modul). Hamma qadami «uzoqroq»da bo'lgan o'quvchidan so'rang: «Bu risk bitiruvgacha xalaqit bermaydimi?».", ru: 'Правило горизонта из 6-го модуля: работу в горизонт ставит то, когда она сможет начаться. В примере Ментора: надпись ожидания и приглашение 10 человек — «сейчас», APK — «позже» (12-й модуль). Ученика, у которого все шаги «дальше», спросите: «Этот риск не помешает до выпуска?».' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; ✔ B, INLINE_KEYS.s8 = 1; har noto'g'ri javob 7-ekran qoidasi bilan noto'g'ri — S-004) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Riskka qadam yozdingiz. Endi u qayerda turadi?"
    question={tr({ uz: <h2 className="title h-ask">Riskka qadam yozdingiz. Endi u <A>qayerda turadi?</A></h2>, ru: <h2 className="title h-ask">Вы написали шаг к риску. <A>Где он теперь?</A></h2> })}
    options={[
      { uz: 'Alohida varaqda — roadmap\'dan tashqarida', ru: 'На отдельном листе — вне roadmap' },
      { uz: 'Roadmap\'da — o\'z ufqida, ishlar qatorida', ru: 'В roadmap — в своём горизонте, рядом с работами' },
      { uz: 'Faqat Mentorning ekranida — sizda saqlanmaydi', ru: 'Только на экране Ментора — у вас не хранится' },
      { uz: 'Risk kartasining ichida — ufqi tanlanmaydi', ru: 'Внутри карточки риска — горизонт не выбирается' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Qadam o\'z ufqiga yoziladi — reja shunday tuzatiladi.', ru: 'Шаг записывают в свой горизонт — так план исправляется.' }}
    explainWrong={{
      0: { uz: "Roadmap'dan tashqaridagi qadam unutilishi mumkin.", ru: 'Шаг вне roadmap могут забыть.' },
      2: { uz: 'Roadmap sizniki: u sizda ham saqlanadi.', ru: 'Roadmap ваш: он хранится и у вас.' },
      3: { uz: "Ufqsiz qadam roadmap'da ko'rinmaydi — qachon qilinadi?", ru: 'Шага без горизонта не видно в roadmap — когда его делать?' },
      default: { uz: 'Tuzatilgan rejada nima turadi — shuni eslang.', ru: 'Вспомните, что стоит в исправленном плане.' }
    }}
    vizual={<RejaDoska kor="kichik" faqat={['hozir']} className="oo-s8" ishlar={mentorIshlar(true)} qadamlar={[{ key: 'm1', idx: 0, matn: tr(mentorQadam(0)), ufq: 'hozir', tush: true }]} />} />
);

// ===== 🏅 NISHONLAR — ish qilingan ekranlarda (§184: qilingan ishni aytadi); tekin bonus — bitta: Plan Fixer (S-034); medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  statusCheck: { icon: '🧭', name: 'Status Check!', desc: { uz: "Mentor roadmap'idagi ishlarga holatni birinchi urinishda to'g'ri qo'ydingiz", ru: 'С первой попытки верно поставили статусы работам в roadmap Ментора' } },
  stepPicker: { icon: '👣', name: 'Step Picker!', desc: { uz: 'Uch riskning har biriga mos qadamni birinchi urinishda tanladingiz', ru: 'С первой попытки выбрали подходящий шаг для каждого из трёх рисков' } },
  riskSpotter: { icon: '🔎', name: 'Risk Spotter!', desc: { uz: "Bo'lib o'tgan ish va yordam beradigan narsa orasidan riskni topdingiz", ru: 'Нашли риск среди прошедшей работы и того, что помогает' } },
  planFixer: { icon: '🗺️', name: 'Plan Fixer!', desc: { uz: "Uch qadamni roadmap'ingizga qo'yib, rejani saqladingiz", ru: 'Поставили три шага в свой roadmap и сохранили план' } }
};
// Ekran id → nishon (onAnswer correct: true bo'lganda; s2, s3 — birinchi urinishda; s7 — reja saqlanganda, bonus)
const ACH_TRIGGERS = { s2: 'statusCheck', s3: 'stepPicker', s4: 'riskSpotter', s7: 'planFixer' };

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
  4: { uz: '1 — Qaysi biri risk', ru: '1 — Что из этого риск' },
  8: { uz: 'Yakuniy — Qadam qayerda', ru: 'Итог — Где стоит шаг' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'roadmap', ru: 'roadmap' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'holat', ru: 'статус' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'risk', ru: 'риск' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'qadam', ru: 'шаг' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'ufq', ru: 'горизонт' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'bajarildi', ru: 'выполнено' }, l: 66, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'kechikdi', ru: 'с опозданием' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: 'boshlanmadi', ru: 'не начато' }, l: 20, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: 'Render', l: 56, t: 6, s: 20, d: 22, dl: 3.4 },
  { ch: 'Expo Go', l: 88, t: 44, s: 20, d: 24, dl: 0.6 },
  { ch: 'APK', l: 36, t: 58, s: 22, d: 19, dl: 2.6 },
  { ch: 'Maydon Jamoa', l: 4, t: 46, s: 18, d: 26, dl: 1.3 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: 'Holat nimani ko\'rsatadi?', ru: 'Что показывает статус?' }, opts: [{ uz: 'Ish rejadagi vaqtiga nisbatan qayerda', ru: 'Где работа относительно планового времени' }, { uz: 'Ishga necha kun ketishini oldindan aniq', ru: 'Точно и заранее — сколько дней займёт работа' }, { uz: 'Ishni aynan qaysi odam bajarishini', ru: 'Какой именно человек сделает работу' }, { uz: 'Ish nechta foydalanuvchiga kerakligini', ru: 'Скольким пользователям нужна работа' }], correct: 0 },
  { q: { uz: 'Ish o\'z darsida ishladi, telefonda tekshirildi. Holati qanday?', ru: 'Работа заработала на своём уроке, проверена на телефоне. Какой статус?' }, opts: [{ uz: 'Kechikdi', ru: 'С опозданием' }, { uz: 'Bajarildi', ru: 'Выполнено' }, { uz: 'Boshlanmadi', ru: 'Не начато' }, { uz: 'Bekor qilindi', ru: 'Отменено' }], correct: 1 },
  { q: { uz: 'Keyinroq ufqidagi ish hali boshlanmagan. Bu nimani bildiradi?', ru: 'Работа горизонта «позже» ещё не начата. Что это значит?' }, opts: [{ uz: 'Ish kechikdi, uni tezroq qilish kerak', ru: 'Работа опоздала, её надо сделать быстрее' }, { uz: 'Roadmap noto\'g\'ri, qayta yozish kerak', ru: 'Roadmap неверный, его надо переписать' }, { uz: 'Vaqti hali kelmagan, bu odatiy hol', ru: 'Её время ещё не пришло, это обычное дело' }, { uz: 'Ishni roadmap\'dan olib tashlash kerak', ru: 'Работу надо убрать из roadmap' }], correct: 2 },
  { q: { uz: 'Risk nima?', ru: 'Что такое риск?' }, opts: [{ uz: 'Darsda allaqachon bo\'lib o\'tgan kechikish', ru: 'Опоздание, которое уже случилось на уроке' }, { uz: 'Kelajakda qo\'shilishi mumkin bo\'lgan funksiya', ru: 'Функция, которую могут добавить в будущем' }, { uz: 'Roadmap\'dagi bajarilgan ishlar ro\'yxati', ru: 'Список выполненных работ в roadmap' }, { uz: 'Rejaga xalaqit berishi mumkin bo\'lgan narsa', ru: 'То, что может помешать плану' }], correct: 3 },
  { q: { uz: 'Render bepul xizmatida Backend qachon uxlaydi?', ru: 'Когда засыпает Backend на бесплатном сервисе Render?' }, opts: [{ uz: '15 daqiqa davomida so\'rov kelmasa', ru: 'Если 15 минут нет запросов' }, { uz: 'Har kuni yarim tunda, o\'z-o\'zidan', ru: 'Каждый день в полночь, сам по себе' }, { uz: 'Kuniga 100 ta so\'rovdan keyin', ru: 'После 100 запросов в день' }, { uz: 'Ilova telefonda yopilgan zahoti', ru: 'Сразу как закрыли приложение на телефоне' }], correct: 0 },
  { q: { uz: 'Backend uxlab qolsa, birinchi ochilish qancha kutadi?', ru: 'Если Backend уснул, сколько ждать первого открытия?' }, opts: [{ uz: 'Bir necha soniya', ru: 'Несколько секунд' }, { uz: 'Bir daqiqagacha', ru: 'До минуты' }, { uz: 'Besh daqiqagacha', ru: 'До пяти минут' }, { uz: 'Bir soatdan ko\'p', ru: 'Больше часа' }], correct: 1 },
  { q: { uz: 'Mentor misolida «3 sinovchi» riskiga qaysi qadam yozildi?', ru: 'Какой шаг в примере Ментора записан к риску «3 тестировщика»?' }, opts: [{ uz: 'Ilovaga yana bitta yangi funksiya qo\'shish', ru: 'Добавить в приложение ещё одну функцию' }, { uz: '12-Modul boshlanganda odamlarni qidirish', ru: 'Искать людей, когда начнётся 12-й модуль' }, { uz: 'Mahalla futbol guruhidan 10 kishini chaqirish', ru: 'Позвать 10 человек из футбольной группы махалли' }, { uz: 'Uch sinovchidan ilovani qayta sinashni so\'rash', ru: 'Попросить трёх тестировщиков проверить ещё раз' }], correct: 2 },
  { q: { uz: 'Nega Expo Go Mentor roadmap\'iga risk bo\'ldi?', ru: 'Почему Expo Go стал риском для roadmap Ментора?' }, opts: [{ uz: 'U ilovani juda sekin ochgani uchun', ru: 'Потому что он слишком медленно открывает приложение' }, { uz: 'Unda Backend\'ga ulanmagani uchun', ru: 'Потому что в нём нет связи с Backend' }, { uz: 'U faqat iPhone\'da ishlagani uchun', ru: 'Потому что он работает только на iPhone' }, { uz: 'U sinash vositasi, hammada yo\'q', ru: 'Это инструмент для проверки, он есть не у всех' }], correct: 3 },
  { q: { uz: 'APK nima?', ru: 'Что такое APK?' }, opts: [{ uz: 'Android\'ga o\'rnatiladigan ilova fayli', ru: 'Файл приложения для установки на Android' }, { uz: 'iPhone\'dagi ilovalar do\'konining nomi', ru: 'Название магазина приложений на iPhone' }, { uz: 'Expo Go ichidagi maxsus sinov rejimi', ru: 'Особый тестовый режим внутри Expo Go' }, { uz: 'Render\'dagi Backend sozlamalari fayli', ru: 'Файл настроек Backend на Render' }], correct: 0 },
  { q: { uz: 'Qadam 12-Modulda bajariladi. Qaysi ufqqa qo\'yasiz?', ru: 'Шаг выполнят в 12-м модуле. В какой горизонт его поставить?' }, opts: [{ uz: 'Hozir — shu 11-Modulda', ru: 'Сейчас — в этом 11-м модуле' }, { uz: 'Keyinroq — 12–13-Modul', ru: 'Позже — 12–13-й модуль' }, { uz: 'Uzoqroq — bitiruvdan keyin', ru: 'Дальше — после выпуска' }, { uz: 'Ufqsiz — alohida ro\'yxatda', ru: 'Без горизонта — в отдельном списке' }], correct: 1 },
  { q: { uz: 'Qaysi biri riskka qarshi aniq qadam?', ru: 'Что из этого — конкретный шаг против риска?' }, opts: [{ uz: 'Roadmap\'ga ko\'proq e\'tibor berib ishlash', ru: 'Работать, уделяя roadmap больше внимания' }, { uz: 'Imkon qadar tezroq va ko\'proq harakat qilish', ru: 'Стараться как можно быстрее и больше' }, { uz: 'Shanba kuni 10 kishini sinovga chaqirish', ru: 'В субботу позвать на тест 10 человек' }, { uz: 'Risk haqida keyinroq yana o\'ylab ko\'rish', ru: 'Подумать о риске ещё раз позже' }], correct: 2 },
  { q: { uz: 'Yakkama-yakkada Mentor bilan nimani ko\'rasiz?', ru: 'Что вы смотрите с Ментором один на один?' }, opts: [{ uz: 'Arena natijangiz va ballingizni', ru: 'Свой результат и баллы в арене' }, { uz: 'Kodingizning har bir qatorini', ru: 'Каждую строку своего кода' }, { uz: 'O\'nta yangi g\'oyangizni birma-bir', ru: 'Десять новых идей по одной' }, { uz: 'Holatlar, risklar va qadamlarni', ru: 'Статусы, риски и шаги' }], correct: 3 },
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204). Alohida ekran, Mentorsiz (SABOQ 12, 16)
const KARTOCHKALAR = [
  { front: { uz: 'Holat nimani ko\'rsatadi?', ru: 'Что показывает статус?' }, back: { uz: 'Ishning rejadagi vaqtiga nisbatan qayerda ekanini', ru: 'Где работа относительно планового времени' }, note: { uz: 'Uch holat: bajarildi · kechikdi · boshlanmadi', ru: 'Три статуса: выполнено · с опозданием · не начато' } },
  { front: { uz: 'Ish rejadagi vaqtida tugamadi, keyin tugadi. Holati qanday?', ru: 'Работа не закончилась в плановое время, а закончилась позже. Какой статус?' }, back: { uz: 'Kechikdi', ru: 'С опозданием' }, note: { uz: 'Mentor misolida chiqish va navbat shunday: 14-darsdan keyin ishladi', ru: 'В примере Ментора так с выходом и очередью: заработало после 14-го урока' } },
  { front: { uz: 'Keyinroq ufqidagi ish hali boshlanmagan. Bu kechikishmi?', ru: 'Работа горизонта «позже» ещё не начата. Это опоздание?' }, back: { uz: 'Yo\'q — holati: boshlanmadi', ru: 'Нет — статус: не начато' }, note: { uz: 'Uning vaqti hali kelmagan', ru: 'Её время ещё не пришло' } },
  { front: { uz: 'Risk nima?', ru: 'Что такое риск?' }, back: { uz: 'Rejaga xalaqit berishi mumkin bo\'lgan narsa', ru: 'То, что может помешать плану' }, note: { uz: 'Bo\'lib o\'tgan ish risk emas — uning holati bor', ru: 'Прошедшая работа — не риск: у неё есть статус' } },
  { front: { uz: 'Har riskka nechta qadam yoziladi?', ru: 'Сколько шагов пишут на каждый риск?' }, back: { uz: 'Bitta — riskni kamaytiradigan aniq ish', ru: 'Один — конкретное дело, которое уменьшает риск' }, note: { uz: '«Ehtiyot bo\'laman» — hali qadam emas', ru: '«Буду осторожен» — ещё не шаг' } },
  { front: { uz: 'Mentor misolida Render bilan bog\'liq risk qaysi?', ru: 'Какой риск в примере Ментора связан с Render?' }, back: { uz: 'Bepul xizmat uxlaydi: birinchi ochilish bir daqiqagacha', ru: 'Бесплатный сервис засыпает: первое открытие до минуты' }, note: { uz: 'Qadam: ilovaga kutish yozuvi', ru: 'Шаг: надпись ожидания в приложении' } },
  { front: { uz: 'Ilovani har kuni o\'zingiz ochib tursangiz, Backend uxlamaydimi?', ru: 'Если каждый день самому открывать приложение, Backend не уснёт?' }, back: { uz: 'Uxlaydi: 15 daqiqa so\'rovsiz qolsa', ru: 'Уснёт: если 15 минут нет запросов' }, note: { uz: 'Shuning uchun qadam — kutish yozuvi', ru: 'Поэтому шаг — надпись ожидания' } },
  { front: { uz: 'Mentor misolida foydalanuvchilar bilan bog\'liq risk qaysi?', ru: 'Какой риск в примере Ментора связан с пользователями?' }, back: { uz: '12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi', ru: 'В 12-м модуле нужно 50 пользователей, сейчас 3 тестировщика' }, note: { uz: 'Qadam: mahalla futbol guruhidan 10 kishini sinovga chaqirish', ru: 'Шаг: позвать на тест 10 человек из футбольной группы махалли' } },
  { front: { uz: 'Nega Expo Go Mentor roadmap\'iga risk bo\'ldi?', ru: 'Почему Expo Go стал риском для roadmap Ментора?' }, back: { uz: 'U sinash vositasi, hamma o\'yinchida yo\'q', ru: 'Это инструмент для проверки, он есть не у всех игроков' }, note: { uz: 'Qadam: 12-Modulda APK', ru: 'Шаг: APK в 12-м модуле' } },
  { front: { uz: 'APK nima?', ru: 'Что такое APK?' }, back: { uz: 'Android telefonga o\'rnatiladigan ilova fayli', ru: 'Файл приложения для установки на телефон Android' }, note: { uz: 'Mentor misolida — keyinroq ufqida, 12-Modulda', ru: 'В примере Ментора — в горизонте «позже», в 12-м модуле' } },
  { front: { uz: 'Qadam roadmap\'ning qaysi ufqiga qo\'yiladi?', ru: 'В какой горизонт roadmap ставят шаг?' }, back: { uz: 'U qachon boshlana olsa — o\'sha ufqqa', ru: 'В тот, когда он сможет начаться' }, note: { uz: 'Hozir · keyinroq · uzoqroq', ru: 'Сейчас · позже · дальше' } },
  { front: { uz: 'Tuzatilgan reja nima?', ru: 'Что такое исправленный план?' }, back: { uz: 'Holatlar va risklarga qarshi qadamlar qo\'shilgan roadmap', ru: 'Roadmap со статусами и шагами против рисков' }, note: { uz: 'Mentor bilan ko\'rgach, uni yana yangilashingiz mumkin', ru: 'Посмотрев с Ментором, вы можете обновить его ещё раз' } }
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
        <div className={cxx('oo-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
          {!bosildi && <p className="oo-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; ① — pm-m9d15-reja.birinchi; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'qadamga qarab — agent yoki odamlar', ru: 'по шагу — агент или люди' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '1 qadam', ru: '1 шаг' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const hwBirinchi = () => {
  const rj = rejaLs();
  if (!rj || !rj.risklar.length) return tr({ uz: 'Birinchi qadamingizni yozing.', ru: 'Напишите свой первый шаг.' });
  const bi = birinchiI(rj.risklar, rj.risklar.map(x => x.ufq), rj.birinchi);
  const q = bi >= 0 ? nuqtasiz(rj.risklar[bi].qadam) : '';
  return tr({ uz: `Tuzatilgan rejada «Avval» deb belgilagan qadamingizni oling: ${q}.`, ru: `Возьмите шаг, который в исправленном плане отмечен «Сначала»: ${q}.` });
};
const HW_QADAM = [
  { uz: 'Uni bajaring: ilovada bo\'lsa — talabni yozib agentga bering; odamlar bilan bo\'lsa — ularga yozing yoki ayting.', ru: 'Выполните его: если это в приложении — напишите требование и дайте агенту; если с людьми — напишите им или скажите.' },
  { uz: 'Qadam bajarilganini o\'zingiz tekshiring (Mentor misolida — ilova ochilganda kutish yozuvi chiqadimi). Risk o\'zgarishi uchun vaqt kerak bo\'lishi mumkin.', ru: 'Сами проверьте, что шаг выполнен (в примере Ментора — появляется ли надпись ожидания при открытии приложения). Чтобы риск изменился, может понадобиться время.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card oo-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="oo-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="oo-hw-q"><span className="oo-hw-k">{tr(r.k)}</span><span className="oo-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="oo-hw-qadam">{[hwBirinchi(), ...HW_QADAM.map(tr)].map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{q}</span></li>)}</ol>
    {keyingi && <span className="oo-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013; kartochkaga qo'shilmaydi). CODE STRIKE va arena — darsda =====
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
    { uz: "Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi: bajarildi, kechikdi yoki boshlanmadi.", ru: 'Статус показывает, где работа относительно планового времени: выполнено, с опозданием или не начато.' },
    { uz: 'Rejadagi vaqtida tugamagan ish kechikdi deyiladi, keyin tugagan bo\'lsa ham.', ru: 'Работу, не законченную в плановое время, называют «с опозданием», даже если она закончилась позже.' },
    { uz: 'Risk — rejaga xalaqit berishi mumkin bo\'lgan narsa.', ru: 'Риск — то, что может помешать плану.' },
    { uz: 'Har riskka bitta qadam yoziladi: riskni kamaytiradigan bitta aniq ish.', ru: 'На каждый риск пишут один шаг: одно конкретное дело, которое уменьшает риск.' },
    { uz: 'Qadam roadmap\'da o\'z ufqiga qo\'yiladi — shunda reja tuzatiladi.', ru: 'Шаг ставят в свой горизонт roadmap — так план исправляется.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«G'oyangiz va ilovangiz guruhni ishontiradimi?»</b></>, ru: <>Следующий урок — <b>«Убедят ли группу ваша идея и приложение?»</b></> });
  const saqlangan = !!rejaLs();
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={saqlangan || isMentorL
          ? tr({ uz: <>Roadmap'ingiz tuzatildi: <A>uch risk, uchta qadam</A>.</>, ru: <>Roadmap исправлен: <A>три риска, три шага</A>.</> })
          : tr({ uz: <>Roadmap'ingizning qolganini <A>uyda yozing</A>.</>, ru: <>Остальное в roadmap <A>допишите дома</A>.</> })}
        cta={<>
          <div className="oo-fikr fade-up d1"><span className="oo-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="oo-fikr-t small">{tr({ uz: "Holat bo'lib o'tganni ko'rsatadi, qadam esa oldindagi riskni kamaytiradi.", ru: 'Статус показывает то, что уже было, а шаг уменьшает риск впереди.' })}</p></div>
          {!isMentorL && <RejaStrip />}
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
export default function PmOneOnOneLesson({ lang: langProp, onFinished, liveToken }) {
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
        /* === 11-Modul 15-dars — darsning o'z vizuali (prefiks oo-, doska rd-). Faqat qolip tokenlari (D3); «Maydon Jamoa» nomi — #2E9E4F (tayanch 9.62) === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .oo-yorliq { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-kul { display: inline-flex; align-items: center; align-self: center; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; line-height: 1.35; }
        .oo-kul.oo-acc { color: ${T.accent}; background: ${T.accentSoft}; }
        p.oo-kul-q { margin: 0; font-size: 13px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 7px 10px; line-height: 1.45; }
        .oo-mj { color: #2E9E4F; font-weight: 800; font-style: normal; }
        /* Bosiladigan joy halqasi (SABOQ 11, 32; B-10): accent halqa doim, yengil to'lqin (≤1.03, ≤0.35, 2.4 s, 3 marta); kam harakatda to'lqin o'chadi, halqa qoladi */
        .oo-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .oo-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.4s 3; }
        /* Guruh halqasi (SABOQ 32): variantlar/tanlovlar guruhida bitta halqa — guruh atrofida */
        .oo-guruh { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .oo-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.5s 3; }
        .oo-halqa-i { border-color: ${T.accent} !important; animation: oo-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.oo-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.oo-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        @keyframes oo-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes oo-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes oo-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes oo-tush { from { opacity: 0; transform: translateY(-10px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes oo-sakra { 0%, 100% { transform: none; } 45% { transform: translateY(-5px); } }
        @keyframes oo-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; background-color: ${T.okFon}; } 40% { box-shadow: 0 0 0 4px ${fon(T.ok, 0.25)}; background-color: ${T.okFon}; } 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } }
        @keyframes oo-son { 0% { transform: scale(1.35); color: ${T.accent}; } 100% { transform: none; } }
        @keyframes oo-chiziq { 0%, 100% { transform: scaleX(1); opacity: 1; } 40% { transform: scaleX(1.06); opacity: 0.55; } }
        @keyframes oo-sirg { from { opacity: 0; transform: translateX(-26px); } to { opacity: 1; transform: none; } }
        @keyframes oo-qtush { from { opacity: 0; transform: translateY(-46px) scale(1.1); } to { opacity: 1; transform: none; } }
        @keyframes oo-barmoq { 0% { opacity: 0; transform: translate(40px, 40px); } 55% { opacity: 1; transform: none; } 80% { transform: scale(0.82); } 100% { opacity: 0.9; transform: none; } }
        @keyframes oo-osish { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes oo-yigil { from { opacity: 0; transform: scaleY(0.6); } to { opacity: 1; transform: none; } }
        @keyframes oo-doska-yon { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 40% { box-shadow: 0 0 0 5px ${fon(T.accent, 0.22)}; } }

        /* --- Umumiy: Mentor eslatmasi, nishon qatori, ovozlar, Mentor ro'yxati, bashorat qatori, taxmin --- */
        .oo-mnote-c { align-self: flex-end; }
        .oo-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .oo-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        p.oo-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.oo-nishon.ketdi { opacity: 0.75; }
        .oo-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .oo-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .oo-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .oo-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .oo-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .oo-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }
        .oo-mr { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .oo-mr-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        .oo-mr-h b { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: ${T.accent}; }
        ul.oo-mr-ro { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 6px; }
        li.oo-mr-q { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 10px; border-radius: 10px; background: ${T.bg}; font-size: 13px; }
        li.oo-mr-q.ok { background: ${T.okFon}; }
        .oo-mr-n { font-weight: 700; color: ${T.ink}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .oo-mr-ch { display: flex; gap: 4px; flex-shrink: 0; }
        .oo-mr-y { flex-shrink: 0; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .oo-mr-y.ok { color: ${T.ok}; }
        .oo-bash .q-bashorat { animation: oo-kir 0.45s ease-out both; }
        .oo-bash .q-chip { animation: oo-kir 0.35s ease-out both; }
        .oo-bash .q-chip:nth-child(2) { animation-delay: 0.09s; } .oo-bash .q-chip:nth-child(3) { animation-delay: 0.18s; }
        .oo-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .oo-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.6s 3; }
        .oo-bashq { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 8px 14px; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; transform-origin: top; animation: oo-yigil 0.4s ease-out both; }
        .oo-bashq-t { white-space: nowrap; }
        .oo-bashq-t b { color: ${T.accent}; }
        .oo-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .oo-tx.ok, .oo-tx b { color: ${T.ok}; }
        .oo-test-viz { display: flex; flex-direction: column; }
        .oo-test-viz .oo-rk { max-width: 520px; }

        /* --- 0-ekran: kirish --- */
        .oo-s0.tanlovsiz .q-variantlar-kol { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 16px; }
        .oo-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -9px; border-radius: 20px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.7s 3; }
        p.oo-javob { margin: 2px 0 0; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; font-size: clamp(13.5px,1.5vw,15px); font-weight: 600; line-height: 1.5; color: ${T.ink}; }

        /* --- RejaDoska: uch ustun, ish kartasi, holat chipi, «Bugun» chizig'i, qadam kartasi --- */
        .rd { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 10px 12px; min-width: 0; }
        .rd.yonadi { animation: oo-doska-yon 1.2s ease-out 0.2s 1; }
        .rd-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        .rd-h-t { font-size: 14px; font-weight: 800; color: ${T.ink}; animation: oo-kir 0.4s ease-out both; }
        .rd-son { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${T.accent}; animation: oo-son 0.35s ease-out; }
        .rd-ustunlar { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(0,1fr) minmax(0,1fr); gap: 8px; align-items: start; }
        .rd-ustunlar.faqat { grid-template-columns: minmax(0,1fr); }
        .rd-u { display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 12px; background: ${T.bg}; min-width: 0; }
        .rd-u-h { font-size: 10.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .rd-u.hozir .rd-u-h { color: ${T.accent}; }
        .rd-u-ich { display: flex; flex-direction: column; gap: 4px; }
        .rd-karta { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; width: 100%; text-align: left; font: inherit; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 4px 8px; transition: transform 0.25s, box-shadow 0.25s, background-color 0.25s; animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 70ms); }
        .rd-karta.joriy { box-shadow: 0 0 0 2px ${T.accent}; transform: scale(1.03); z-index: 1; }
        .rd-karta.joriy::after { content: ''; position: absolute; inset: -5px; border-radius: 13px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.4s 3; }
        .rd-karta.xato { background: ${T.errFon}; }
        .rd-karta.yangi { animation: oo-yon 1.1s ease-out; }
        .rd-karta.kul .rd-k-nom { color: ${T.ink2}; }
        .rd-karta.bosiladi { cursor: pointer; padding-right: 22px; }
        .rd-karta.bosiladi:hover { border-color: ${T.accent}; }
        .rd-k-nom { flex: 1 1 auto; min-width: 0; font-size: 12.5px; font-weight: 700; line-height: 1.3; overflow-wrap: anywhere; }
        .rd-k-y { font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        .rd-k-ch { display: inline-flex; margin-left: auto; }
        .rd-k-ch.sakra { animation: oo-sakra 0.5s ease-out both; animation-delay: calc(0.35s + var(--i, 0) * 100ms); }
        .rd-k-ed { position: absolute; top: 5px; right: 7px; font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .rd-chip { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 800; line-height: 1.3; padding: 2px 7px; border-radius: 999px; white-space: nowrap; }
        .rd-chip.bosh { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rd-chip.bajarildi { background: ${T.okFon}; color: ${T.ok}; }
        .rd-chip.kechikdi { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1px ${T.accent}; }
        .rd-chip.boshlanmadi { background: ${T.line}; color: ${T.ink2}; }
        .rd-chip.yangi { animation: oo-tush 0.45s cubic-bezier(.3,1.5,.5,1); }
        .rd-chip i { font-style: normal; }
        .rd-bugun { display: flex; align-items: center; gap: 6px; margin: 1px 0; }
        .rd-bugun::before, .rd-bugun::after { content: ''; flex: 1; height: 2px; border-radius: 2px; background: ${T.accent}; }
        .rd-bugun span { font-size: 10.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.accent}; white-space: nowrap; }
        .rd-bugun.tolqin::before, .rd-bugun.tolqin::after, .rd-bugun.tolqin span { animation: oo-chiziq 0.9s ease-in-out 0.1s 1; }
        .rd-q { position: relative; display: grid; grid-template-columns: auto minmax(0,1fr); align-items: baseline; gap: 1px 7px; padding: 5px 28px 5px 8px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.accent}; animation: oo-kir 0.4s ease-out both; }
        .rd-q.bosh { min-height: 30px; padding-right: 8px; background: transparent; border-style: dashed; animation: oo-sirg 0.6s ease-out both; animation-delay: calc(0.4s + var(--i, 0) * 0.12s); }
        .rd-q.tush { animation: oo-qtush 0.8s cubic-bezier(.2,.8,.2,1) 0.5s both; }
        .rd-q.yangi { animation: oo-yon 1.1s ease-out; }
        .rd-q.avval { background: ${T.accentSoft}; box-shadow: 0 0 0 2px ${T.accent}; }
        .rd-q-y { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .rd-q-y b { color: #fff; background: ${T.accent}; border-radius: 999px; padding: 0 7px; letter-spacing: 0.02em; }
        .rd-q-t, button.rd-qadam { font: inherit; font-size: 12.5px; font-weight: 700; line-height: 1.3; color: ${T.ink}; text-align: left; overflow-wrap: anywhere; }
        button.rd-qadam { background: none; border: 0; padding: 0; cursor: pointer; }
        button.rd-qadam:hover { color: ${T.accent}; }
        .rd-q-r { grid-column: 1 / -1; font-size: 11px; line-height: 1.3; color: ${T.ink2}; overflow-wrap: anywhere; }
        button.rd-ed { position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 11px; cursor: pointer; }
        button.rd-ed:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .rd.kichik { padding: 10px; gap: 6px; }
        .rd.kichik .rd-u { padding: 6px; gap: 4px; }
        .rd.kichik .rd-k-nom, .rd.kichik .rd-q-t { font-size: 11.5px; }
        .rd.kichik .rd-chip { font-size: 10px; padding: 1px 6px; }
        .rd.kichik .rd-karta { padding: 3px 7px; }
        .rd.oo-s8 { padding: 6px; }
        .rd.oo-s8 .rd-u-ich { gap: 3px; }
        .rd-ix { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 8px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; }
        .rd-ix-l { font-weight: 800; color: ${T.ink}; }
        .rd-ix-u { display: inline-flex; align-items: center; gap: 5px; }
        .rd-ix-u i { font-style: normal; font-size: 11px; font-weight: 800; color: ${T.ink2}; }

        /* --- Telefon maketi «Maydon Jamoa» (≈170×272, barqaror) --- */
        .oo-tel { width: 170px; height: 272px; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; padding: 8px; border-radius: 26px; background: ${T.ink}; box-shadow: 0 14px 30px -16px rgba(${T.shadowBase},0.55); transition: opacity 0.4s, filter 0.4s; }
        .oo-tel.xira { opacity: 0.45; filter: grayscale(0.7); }
        .oo-tel-bar { height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 18px 18px 4px 4px; background: ${T.paper}; font-size: 12px; }
        .oo-tel-ekran { position: relative; flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 4px 4px 18px 18px; background: ${T.paper}; overflow: hidden; animation: oo-kir 0.35s ease-out both; }
        .oo-te-h { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11.5px; font-weight: 800; color: ${T.ink}; }
        .oo-te-kun { font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 0.25s); }
        .oo-ok { display: flex; flex-direction: column; gap: 3px; padding: 6px 7px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.bg}; animation: oo-kir 0.35s ease-out both; }
        .oo-ok + .oo-ok { animation-delay: 0.12s; }
        .oo-ok-t { display: flex; flex-direction: column; font-size: 10.5px; line-height: 1.3; color: ${T.ink2}; }
        .oo-ok-t b { font-size: 11px; color: ${T.ink}; }
        .oo-ok-son { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; animation: oo-son 0.4s ease-out; }
        .oo-ok-tg { align-self: flex-start; font-size: 10.5px; font-weight: 800; color: #fff; background: #2E9E4F; border-radius: 8px; padding: 3px 8px; }
        .oo-ok-tg.ok { color: ${T.ok}; background: ${T.okFon}; }
        .oo-barmoq { position: absolute; left: 34px; top: 104px; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.accent, 0.22)}; border: 2px solid ${T.accent}; animation: oo-barmoq 1.1s ease-in-out both; }
        .oo-te-doira { display: flex; gap: 4px; }
        .oo-te-doira i { display: block; width: 16px; height: 16px; border-radius: 50%; background: ${T.line}; }
        .oo-te-doira i.ok { background: ${fon(T.ok, 0.55)}; }
        .oo-te-q { font-size: 11px; font-weight: 800; line-height: 1.3; color: ${T.ok}; }
        .oo-dalil { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .oo-tel-ust { max-width: 200px; text-align: center; }
        .oo-vaqt { display: flex; align-items: flex-end; gap: 6px; }
        .oo-vq { display: flex; flex-direction: column; align-items: center; gap: 1px; }
        .oo-vq-b { display: flex; gap: 3px; }
        .oo-vq-b i { font-style: normal; font-size: 15px; font-weight: 800; animation: oo-tush 0.4s ease-out both; animation-delay: calc(0.25s + var(--i, 0) * 0.35s); }
        .oo-vq-b i.x { color: ${T.err}; }
        .oo-vq-b i.ok { color: ${T.ok}; }
        .oo-vq b { font-size: 11px; color: ${T.ink}; }
        .oo-vq em { font-size: 10px; font-style: normal; color: ${T.ink2}; }
        .oo-vq-c { width: 34px; height: 2px; margin-bottom: 20px; background: ${T.line}; }

        /* --- 2-ekran: telefon chapda, doska o'ngda, uch tugma doska ostida --- */
        .oo-s2 { display: grid; grid-template-columns: 210px minmax(0,1fr); gap: 16px; align-items: start; }
        .oo-s2-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .oo-tugmalar { display: flex; flex-wrap: wrap; gap: 8px; }
        .oo-tugmalar .q-chip { animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 90ms); }

        /* --- 3-ekran: sahna, risk kartasi, yig'ilgan ro'yxat, tanlovlar --- */
        .oo-s3-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px 14px; flex-wrap: wrap; }
        .oo-s3-bosh ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .oo-s3 { display: grid; grid-template-columns: minmax(0,0.95fr) minmax(0,1.05fr); gap: 16px; align-items: start; }
        .oo-s3.tamom { display: block; }
        .oo-s3-ong, .oo-s3-k { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .oo-keyingi { align-self: flex-end; }
        .oo-sahna { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; animation: oo-kir 0.4s ease-out both; }
        .oo-sahna-q { display: flex; align-items: flex-end; gap: 6px; }
        .oo-soat { font-family: 'JetBrains Mono', monospace; font-style: normal; font-size: 11px; color: ${T.accent}; }
        p.oo-kutish { margin: 4px 0 0; padding: 8px; border-radius: 8px; background: ${T.accentSoft}; font-size: 11px; font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .oo-odam { flex-shrink: 0; }
        .oo-bar { width: 100%; max-width: 320px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }
        .oo-bar-t { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .oo-bar-y { display: flex; width: 100%; height: 12px; border-radius: 6px; background: ${T.line}; overflow: hidden; }
        .oo-bar-y i { display: block; height: 100%; transform-origin: left; animation: oo-osish 0.8s ease-out both; }
        .oo-bar-y i.ok { background: ${T.ok}; }
        .oo-bar-y i.taklif { background: repeating-linear-gradient(45deg, ${T.accent} 0 4px, ${T.accentSoft} 4px 8px); animation-delay: 0.2s; }
        .oo-ikki-tel { display: flex; gap: 12px; }
        .oo-expo { align-self: flex-start; font-size: 10px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 6px; }
        .oo-ilovalar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; padding: 10px 4px 4px; }
        .oo-ilovalar > i { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 10px; font-style: normal; }
        .oo-ilovalar > i.savol { background: ${T.bg}; border: 1.5px dashed ${T.ink2}; color: ${T.ink2}; font-weight: 800; }
        .oo-ilovalar > i.apk { background: ${T.line}; animation: oo-tush 0.45s ease-out both; }
        .oo-apk-y { align-self: center; animation: oo-kir 0.4s ease-out both 0.2s; }
        .oo-rk { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; animation: oo-kir 0.4s ease-out both; }
        .oo-rk .oo-kul { align-self: flex-start; }
        .oo-rk-q { display: grid; grid-template-columns: 52px minmax(0,1fr) auto; gap: 8px; align-items: center; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .oo-rk-q b { font-size: 10.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-rk-q.qadam.bosh { background: transparent; border: 1.5px dashed ${T.line}; }
        .oo-rk-q.xato { background: ${T.errFon}; }
        .oo-rk-q.yozildi { font-weight: 700; animation: oo-yon 1.1s ease-out; }
        .oo-rk-bosh { font-weight: 800; color: ${T.ink2}; }
        .oo-ufq { font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
        p.oo-rk-osti { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        ol.oo-yig-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        li.oo-yig { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr) auto; gap: 8px; align-items: center; padding: 7px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; line-height: 1.35; }
        li.oo-yig.yangi { animation: oo-yon 1.1s ease-out; }
        li.oo-yig i { font-style: normal; color: ${T.accent}; }
        li.oo-yig em { font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
        .oo-yig-r { color: ${T.ink2}; }
        .oo-yig-q { font-weight: 700; color: ${T.ink}; }
        ol.oo-yig-ro:not(.keng) .oo-yig-r, ol.oo-yig-ro:not(.keng) .oo-yig-q { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        ol.oo-yig-ro.keng li.oo-yig { font-size: 14px; padding: 11px 14px; }
        .oo-s3-pastki { display: flex; flex-direction: column; gap: 8px; }
        .oo-tanlovlar { display: flex; flex-direction: column; align-items: stretch; gap: 6px; width: 100%; }
        .oo-tanlovlar .q-chip { text-align: left; white-space: normal; line-height: 1.35; }
        .oo-tanlovlar .q-chip { animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 100ms); }

        /* --- 5–7-ekran: ustaxona — katta karta, forma, risklar ro'yxati --- */
        .lesson-root .q-mustaqil { max-width: none; }
        .oo-katta { display: flex; flex-direction: column; gap: 9px; padding: 12px 16px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.4); }
        .oo-katta-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px 12px; flex-wrap: wrap; }
        .oo-katta-nom { font-size: 17px; font-weight: 800; line-height: 1.3; color: ${T.ink}; overflow-wrap: anywhere; }
        .oo-katta .oo-kul { align-self: flex-start; }
        .oo-forma.ixcham { padding: 10px 12px; box-shadow: none; }
        .oo-forma-q { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        input.oo-inp { flex: 1 1 220px; min-width: 0; font: inherit; font-size: 14px; padding: 9px 12px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; }
        input.oo-inp:focus { outline: none; border-color: ${T.accent}; }
        .oo-rq { display: grid; grid-template-columns: 64px minmax(0,1fr); gap: 6px 10px; align-items: center; }
        label.oo-rq-l { font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-rq.xato input.oo-inp { background: ${T.errFon}; }
        .oo-rq-x { grid-column: 2; display: flex; flex-direction: column; gap: 2px; }
        .oo-amal { display: flex; justify-content: space-between; gap: 8px; }
        .oo-yord { display: flex; flex-wrap: wrap; gap: 6px; }
        .oo-risklarim { display: flex; flex-direction: column; gap: 5px; padding: 8px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .oo-risklarim-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        ol.oo-r6-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
        li.oo-r6 { display: flex; align-items: center; gap: 8px; padding: 4px 8px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.4; }
        li.oo-r6.yangi { animation: oo-yon 1.1s ease-out; }
        li.oo-r6.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        li.oo-r6.eng { background: ${T.accentSoft}; }
        .oo-r6 .rd-ed { position: static; flex-shrink: 0; }
        .oo-r6-b, button.oo-yulduz { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; }
        button.oo-yulduz { font: inherit; color: ${T.ink}; text-align: left; background: none; border: 0; border-radius: 8px; padding: 2px 4px; cursor: pointer; }
        button.oo-yulduz i { font-style: normal; font-size: 16px; color: ${T.accent}; }
        .oo-r6-r { color: ${T.ink2}; }
        .oo-r6-q { font-weight: 700; }
        .oo-r6-b b, button.oo-yulduz b { color: ${T.accent}; }
        .oo-risklarim.keng li.oo-r6 { font-size: 14px; padding: 9px 10px; }
        .oo-s7-h { display: inline-flex; align-items: center; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
        .rd-h:has(.oo-s7-h) { align-items: center; flex-wrap: wrap; }
        .oo-s7-x p.q-xulosa { padding-top: 10px; padding-bottom: 10px; }
        .oo-strip { display: flex; align-items: center; justify-content: center; gap: 6px 12px; flex-wrap: wrap; padding: 7px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .oo-strip-l { font-weight: 800; color: ${T.ink}; }
        .oo-strip b { color: ${T.accent}; }
        .oo-strip-ok b { color: ${T.ok}; }

        /* --- Kartochkalar va yakun --- */
        .oo-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: oo-tolqin-i 2.4s ease-in-out 0.4s 3; }
        p.oo-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.oo-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .oo-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .oo-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.oo-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .oo-hw { display: flex; flex-direction: column; gap: 10px; }
        .oo-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .oo-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .oo-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.oo-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.oo-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.oo-hw-qadam li i { flex-shrink: 0; font-style: normal; font-size: 17px; line-height: 1.3; color: ${T.accent}; }
        .oo-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }

        @media (max-width: 860px) {
          .oo-s2, .oo-s3 { grid-template-columns: minmax(0,1fr); }
          .oo-s2-tel, .oo-s3 > .oo-sahna { justify-self: center; }
        }
        @media (max-width: 640px) {
          .rd-ustunlar { grid-template-columns: minmax(0,1fr); }
          .rd.kichik .rd-ustunlar { grid-template-columns: minmax(0,1fr); }
          li.oo-yig { grid-template-columns: minmax(0,1fr) auto; }
          li.oo-yig > i { display: none; }
          li.oo-yig .oo-yig-q { grid-column: 1; }
          .oo-ikki-tel { gap: 8px; }
          .oo-ikki-tel .oo-tel { width: 150px; }
          .oo-hw-karta { grid-template-columns: minmax(0,1fr); }
          .oo-rq { grid-template-columns: minmax(0,1fr); }
          .oo-rq-x { grid-column: 1; }
          ul.oo-mr-ro { grid-template-columns: minmax(0,1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lesson-root [class*="oo-"], .lesson-root [class*="oo-"]::after, .lesson-root [class*="oo-"]::before, .lesson-root [class^="rd"], .lesson-root [class*=" rd-"], .lesson-root [class^="rd"]::after, .lesson-root [class^="rd"]::before, .lesson-root .stage-nav .btn-white-accent::after { animation: none !important; transition: none !important; }
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
