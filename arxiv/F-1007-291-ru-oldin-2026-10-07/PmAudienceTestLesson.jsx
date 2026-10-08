import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul · 13-dars (PM + amaliyot) «Uch foydalanuvchidan keyin nimani tuzatasiz?» — kalit m9-13, lessonId pm-m9d13-v1.
// Manba-haqiqat: feedback/F-1005-11modul/13-PmAudienceTest-v3.md (GATE M) · tayanch 00-MODUL-TAYANCH.md (1.8, 3, 8, 9.29–9.38, 9.90–9.91).
// Skeletdan (src/skelet/NamunaDars.jsx): infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium).
// 12 ekran (PM+PRAKT): hook · reja · sanoq · test · Cyberpunk 2077 · o'z sinovi · Amaliyot 1 · Amaliyot 2 · yakuniy test · podium · kartochkalar · yakun.
// Saqlanadi: pm-m9d13-sinov (tayanch 8, 9.90 — sxema aynan; 15, 16-darslar o'qiydi). JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QQadamlar, QXulosa, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QVoqea, QMustaqil, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m9d13-v1', lessonTitle: { uz: "Uch foydalanuvchidan keyin nimani tuzatasiz?", ru: 'Что вы исправите после трёх пользователей?' } };
// 12 ekran · PM+PRAKT (tayanch 4) · ballik testlar 3, 8 (✔ B · D) · bloklar 6, 7 (signal PRACTICE_BASE + ekran)
const HW_TOKENS = [
  { t: { uz: 'sinov', ru: 'тест' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "to'xtash", ru: 'остановка' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'qayta sinov', ru: 'повторный тест' }, l: 22, tp: 70, s: 12, d: 8.5 },
  { t: 'SINOV.md', l: 76, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Ballik testlar: s3 (✔ B = 1), s8 (✔ D = 3). `-1` — sentinel (mustaqil ish va bloklar signali, variant yo'q).
const INLINE_KEYS = { s3: 1, s8: 3, sinov: -1, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI). PM darsida emoji o'rniga raqam (S-026).
const RECAPS = {
  3: { title: { uz: 'Birinchi qaysi', ru: 'Что первым' }, cards: [
    { ic: '1', h: { uz: "To'xtash nechta kishida takrorlandi — sanoq.", ru: 'У скольких людей повторилась остановка — это счёт.' } },
    { ic: '2', h: { uz: 'Kishi vazifani bajara oldimi — har yozuvda alohida.', ru: 'Смог ли человек выполнить задание — отдельно в каждой записи.' } },
    { ic: '3', h: { uz: "Ikkala savolga «ha» bo'lgan to'xtash — birinchi, qolgani «Keyin» ro'yxatida.", ru: 'Остановка с «да» на оба вопроса — первая, остальные в списке «Потом».' }, ask: { uz: "Bitta kishini butunlay to'xtatgan to'xtash-chi — u ham muhimmi?", ru: 'А остановка, которая полностью остановила одного человека, — тоже важна?' } }
  ] },
  8: { title: { uz: 'Bitta qayta sinov', ru: 'Один повторный тест' }, cards: [
    { ic: '1', h: { uz: "Qayta sinov — tuzatishdan keyin o'sha vazifa bilan yana sinov.", ru: 'Повторный тест — снова тест с тем же заданием после исправления.' } },
    { ic: '2', h: { uz: 'Natija tuzatilgan joy haqida aytadi, butun ilova haqida emas.', ru: 'Результат говорит об исправленном месте, а не обо всём приложении.' } },
    { ic: '3', h: { uz: "«Keyin» ro'yxatidagi to'xtashlar o'z navbatini kutadi.", ru: 'Остановки из списка «Потом» ждут своей очереди.' }, ask: { uz: "Yangi odam yana o'sha joyda to'xtasa, nima qilasiz?", ru: 'Что вы сделаете, если новый человек снова застрянет на том же месте?' } }
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

// ===== DARSNING O'Z QATLAMI — 11-Modul 13-dars «Uch foydalanuvchidan keyin nimani tuzatasiz?» (MD v3: feedback/F-1005-11modul/13-PmAudienceTest-v3.md, GATE M) =====
// Bitta vizual (163/180): «Sinov sanog'i» — SinovSanoq (telefon · yozuv kartasi · sanoq jadvali); bitta manba — SINOV_MAYDON (tayanch 1.8, 9.2, 9.29–9.30).
// qolip-maket: pa-sq pa-jq pa-yi-ed pa-ed pa-ps-x
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlanmasa ham dars davom etadi */ } };
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
// Kechiktirilgan ishlar (taymerlar ekran yopilsa tozalanadi)
const useKeyin = () => {
  const t = useRef([]);
  useEffect(() => () => { t.current.forEach(clearTimeout); }, []);
  return useCallback((fn, ms) => { const id = setTimeout(fn, kamHarakat() ? 0 : ms); t.current.push(id); return id; }, []);
};
// Halqa (SABOQ 32, To'lqin B 10): yengil — scale ≤ 1.03, shaffoflik ≤ 0.35, sikl 2.6 s; guruhda bitta
const halqa = (on) => (on ? 'pa-halqa' : undefined);
// O'qituvchi eslatmasi — faqat mentor ko'rinishida (MD aytgan joylarda)
const MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState(false);
  if (!isMentor) return null;
  return ochiq
    ? <div className="pa-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="pa-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="pa-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
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
  return <p className={cxx('pa-nishon', ketdi && 'ketdi')}>{ketdi ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: 'Сделаете верно с первой попытки — значок ваш.' })}</p>;
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
    <div className="pa-ovoz fade-step">
      {variantlar.map((v, i) => (
        <div key={i} className={cxx('pa-ovoz-q', mening === i && 'men')}><span>{v}</span><span className="pa-ovoz-y"><i style={{ width: `${jami ? Math.round((son[i] / jami) * 100) : 0}%` }} /></span><b>{son[i]}</b></div>
      ))}
    </div>
  );
};
// Uchish (SABOQ 19): kichik yorliq manbadan nishonga uchadi (sahna ichida o'lchanadi — ⛶ va zoom bilan ham to'g'ri)
const useParvoz = () => {
  const box = useRef(null);
  const keyin = useKeyin();
  const [parvoz, setParvoz] = useState([]);
  const uchir = useCallback((dan, ga, t, ms = 650) => {
    const b = box.current; if (kamHarakat() || !b) return;
    const s = b.querySelector(dan), n = b.querySelector(ga); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const nuqta = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const p = { k: Math.random().toString(36).slice(2), t, a: nuqta(s), b: nuqta(n), ms };
    setParvoz(x => [...x, p]);
    keyin(() => setParvoz(x => x.filter(y => y.k !== p.k)), ms + 80);
  }, [keyin]);
  return { box, parvoz, uchir };
};
const Parvoz = ({ p }) => (
  <span className="pa-uch" aria-hidden="true" style={{ left: p.a.x + 'px', top: p.a.y + 'px', '--dx': (p.b.x - p.a.x) + 'px', '--dy': (p.b.y - p.a.y) + 'px', animationDuration: p.ms + 'ms' }}>{p.t}</span>
);
// FLIP (SABOQ 19): ro'yxat tartibi o'zgarganda har karta eski joyidan yangisiga uchib boradi
const useFlip = (kalit) => {
  const ref = useRef(null);
  const eski = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const hozir = {};
    el.querySelectorAll('[data-fid]').forEach(n => { hozir[n.dataset.fid] = { x: n.offsetLeft, y: n.offsetTop }; });
    const old = eski.current;
    if (old && !kamHarakat()) {
      let k = 0;
      el.querySelectorAll('[data-fid]').forEach(n => {
        const a = old[n.dataset.fid], b = hozir[n.dataset.fid];
        if (!a || !b || !n.animate) return;
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        n.animate([{ transform: `translate(${dx}px, ${dy}px)`, boxShadow: `0 10px 22px -8px ${fon(T.ink, 0.35)}` }, { transform: 'none', boxShadow: '0 0 0 transparent' }], { duration: 700, delay: k * 90, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
        k++;
      });
    }
    eski.current = hozir;
  }, [kalit]);
  return ref;
};
// Uchish (FLIP, SABOQ 19): yangi joydagi element (data-uch) manba to'rtburchagidan o'z joyiga suriladi; kam harakatda — darrov joyida
const uchirEl = (dan, el, ms = 560) => {
  if (!dan || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !dan.width) return;
  const z = (el.offsetWidth || g.width) / g.width;
  const dx = ((dan.left + dan.width / 2) - (g.left + g.width / 2)) * z;
  const dy = ((dan.top + dan.height / 2) - (g.top + g.height / 2)) * z;
  const sk = Math.min(2.6, Math.max(0.35, dan.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sk})`, opacity: 0.85 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
};
const useUchish = () => {
  const q = useRef([]);
  useLayoutEffect(() => {
    if (!q.current.length) return;
    const navbat = q.current; q.current = [];
    navbat.forEach(u => uchirEl(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback((manba, k, ms) => {
    const r = manba && (manba.getBoundingClientRect ? manba.getBoundingClientRect() : manba);
    if (r) q.current.push({ r, k, ms });
  }, []);
};
// Ikki element orasida chizilib boradigan chiziq (SABOQ 35): sahna ichida o'lchanadi
const Bog = ({ dan, gacha, kalit }) => {
  const ref = useRef(null);
  const [d, setD] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current && ref.current.parentElement;
    if (!el) return undefined;
    const olch = () => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const z = el.offsetWidth / r.width;
      const a = el.querySelector(dan), b = el.querySelector(gacha);
      if (!a || !b) { setD(null); return; }
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const x1 = (ra.right - r.left) * z, y1 = (ra.top + ra.height / 2 - r.top) * z;
      const x2 = (rb.left - r.left) * z, y2 = (rb.top + rb.height / 2 - r.top) * z;
      setD({ w: el.offsetWidth, h: el.offsetHeight, p: `M ${x1} ${y1} C ${x1 + 40} ${y1}, ${x2 - 40} ${y2}, ${x2} ${y2}` });
    };
    olch();
    const t = setTimeout(olch, 500);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(olch) : null;
    if (ro) ro.observe(el);
    return () => { clearTimeout(t); if (ro) ro.disconnect(); };
  }, [kalit, dan, gacha]);
  return (
    <svg ref={ref} className="pa-bog" width={d ? d.w : 1} height={d ? d.h : 1} aria-hidden="true">
      {d && <path className="pa-bog-c" d={d.p} pathLength="1" />}
    </svg>
  );
};

// ----- Ma'lumot: Mentor misoli (tayanch 1.8 — vazifa, uch yozuv, sanoq, qayta sinov AYNAN; namuna o'yinlar — 9.2; karta — 9.30) -----
const KUN = { sh: { uz: 'Shanba', ru: 'Суббота' }, ya: { uz: 'Yakshanba', ru: 'Воскресенье' } };
const MAYDON = { mahalla: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, maktab: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, park: { uz: 'Park maydoni', ru: 'Поле в парке' } };
const KISHI = (n) => tr({ uz: `${n}-kishi`, ru: `${n}-й человек` });
const OYINCHI = (n) => tr({ uz: `${n}-o'yinchi`, ru: `Игрок ${n}` });
const SINOV_MAYDON = {
  vazifa: { uz: "Shanba soat 18:00 dagi o'yinga qo'shiling.", ru: 'Присоединитесь к игре в субботу в 18:00.' },
  oyinlar: {
    1: { kun: KUN.sh, soat: '18:00', maydon: MAYDON.mahalla, son: '8 / 10' },
    2: { kun: KUN.sh, soat: '20:00', maydon: MAYDON.maktab, son: '6 / 10' },
    3: { kun: KUN.ya, soat: '10:00', maydon: MAYDON.park, son: '4 / 8' },
    4: { kun: KUN.ya, soat: '17:00', maydon: MAYDON.mahalla, son: '9 / 10' }
  },
  // sinovdagi — GET /oyinlar tartibi: oxirgi e'lon tepada (9.29) · tuzatilgan — ilovada kun va soat bo'yicha, kun sarlavhasi bilan (tayanch 1.8)
  royxat: { sinovdagi: [4, 3, 2, 1], tuzatilgan: [{ h: KUN.sh }, 1, 2, { h: KUN.ya }, 3, 4] },
  toxtashlar: [
    { id: 'topish', nom: { uz: "Shanba 18:00 dagi o'yinni topishda to'xtadi", ru: 'Застрял, ища игру в субботу в 18:00' }, sabab: { uz: "e'lonlar qo'shilgan vaqti bo'yicha turibdi, kun bo'yicha emas", ru: 'объявления стоят по времени добавления, а не по дням' } },
    { id: 'son', nom: { uz: "«8 / 10» nimani bildirishini so'radi", ru: 'Спросил, что значит «8 / 10»' } },
    { id: 'kelaman', nom: { uz: "«Kelaman» tugmasi nega yo'qligini tushunmadi", ru: 'Не понял, почему нет кнопки «Kelaman»' }, sabab: { uz: "u faqat o'yin kuni chiqadi", ru: 'она появляется только в день игры' } }
  ],
  yozuvlar: [
    { kim: 1, bajardi: true, qatorlar: [
      { v: '0:00', t: { uz: "Ilovani ochdi: ro'yxat boshida yakshanba o'yinlari", ru: 'Открыл приложение: в начале списка воскресные игры' } },
      { v: '0:03–0:38', t: { uz: "Shanba o'yinini qidirib, tepadagi kartalarni qayta o'qidi", ru: 'Ища субботнюю игру, перечитывал верхние карточки' }, x: 'topish' },
      { v: '0:38', t: { uz: "Pastga surib, «Shanba, 18:00» ni topdi va ochdi", ru: 'Прокрутил вниз, нашёл и открыл «Shanba, 18:00»' } },
      { v: '0:41–0:55', t: { uz: "«8 / 10» ga qarab so'radi: «Bu nima — hisobmi?»", ru: 'Глядя на «8 / 10», спросил: «Это что — счёт?»' }, x: 'son' },
      { v: '0:58', t: { uz: "«Qo'shilaman» ni bosdi", ru: "Нажал «Qo'shilaman»" } }
    ] },
    { kim: 2, bajardi: false, qatorlar: [
      { v: '0:00', t: { uz: 'Ilovani ochdi', ru: 'Открыл приложение' } },
      { v: '0:03–1:20', t: { uz: "Shanba o'yinini qidirdi, yakshanba kartalarini ochib-yopdi", ru: 'Искал субботнюю игру, открывал и закрывал воскресные карточки' }, x: 'topish' },
      { v: '1:20', t: { uz: "«Shanbaga o'yin yo'q ekan» dedi va telefonni qaytardi", ru: 'Сказал «На субботу игр нет» и вернул телефон' } }
    ] },
    { kim: 3, bajardi: true, qatorlar: [
      { v: '0:00', t: { uz: 'Ilovani ochdi', ru: 'Открыл приложение' } },
      { v: '0:04–0:50', t: { uz: "Shanba o'yinini qidirdi: «Shanba, 20:00» ni ochib, orqaga qaytdi", ru: 'Искал субботнюю игру: открыл «Shanba, 20:00» и вернулся назад' }, x: 'topish' },
      { v: '0:50', t: { uz: "«Shanba, 18:00» ni topdi, «Qo'shilaman» ni bosdi", ru: "Нашёл «Shanba, 18:00», нажал «Qo'shilaman»" } },
      { v: '1:00–1:25', t: { uz: "«Kelishimni qayerda bildiraman?» deb so'radi", ru: 'Спросил: «Где отметить, что я приду?»' }, x: 'kelaman' }
    ] }
  ],
  qaytaSinov: { kim: { uz: 'yangi odam', ru: 'новый человек' }, vazifa: { uz: 'bajardi', ru: 'выполнил' }, kuzatuv: { uz: "Shanba o'yinini ro'yxat boshida topdi", ru: 'Нашёл субботнюю игру в начале списка' } }
};
const TOX = Object.fromEntries(SINOV_MAYDON.toxtashlar.map(t => [t.id, t]));
const toxSoni = (y) => y.qatorlar.filter(q => q.x).length;
// Sanoq: berilgan yozuvlar bo'yicha jadval qatorlari (birinchi uchragan tartibda)
const sanoqQator = (n) => {
  const qat = [];
  SINOV_MAYDON.yozuvlar.slice(0, n).forEach(y => y.qatorlar.forEach(q => {
    if (!q.x) return;
    let r = qat.find(o => o.id === q.x);
    if (!r) { r = { id: q.x, nom: TOX[q.x].nom, kishilar: [] }; qat.push(r); }
    if (!r.kishilar.includes(y.kim)) r.kishilar.push(y.kim);
  }));
  return qat.map(r => ({ ...r, son: r.kishilar.length }));
};
const VAZIFA_T = { uz: 'Vazifa', ru: 'Задание' };
const TOXTADI_T = { uz: "to'xtadi", ru: 'застрял' };
const BAJARDI_T = { ok: { uz: 'bajardi ✓', ru: 'выполнил ✓' }, yoq: { uz: 'bajarmadi ✕', ru: 'не выполнил ✕' } };
const NAVBAT_T = { birinchi: { uz: '★ Birinchi', ru: '★ Первое' }, keyin: { uz: 'Keyin', ru: 'Потом' }, tuzatildi: { uz: 'tuzatildi', ru: 'исправлено' } };

// Odam (SABOQ 36): real ko'rinish — bosh, soch, yuz, rangli kiyim (kichik avatar; chizma ranglari UI tokeni emas)
const ODAM_RANG = { teri: ['#EDC39C', '#C98E62', '#E3A87C'], soch: ['#2E2019', '#5B3A24', '#1F1A19'], kiyim: ['#E07A5F', '#3E7CB1', '#E9A23B', '#7B61C9', '#2F9E7A'] };
const Yuz = ({ i = 0, s = 26 }) => {
  const t = ODAM_RANG.teri[i % 3], h = ODAM_RANG.soch[(i + 1) % 3], k = ODAM_RANG.kiyim[i % 5];
  return (
    <svg className="pa-yuz" width={s} height={s} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill={fon(T.accent, 0.1)} />
      <path d="M5 32 C6 23, 26 23, 27 32 Z" fill={k} />
      <rect x="13.5" y="19" width="5" height="4" rx="1.5" fill={t} />
      <circle cx="16" cy="14" r="7" fill={t} />
      <path d={i === 1 ? 'M8.6 14 C7 4, 25 4, 23.4 14 C23 9, 9 9, 8.6 14 Z M8.8 13 C8 18, 9 21, 10.5 21 L10 13 Z' : 'M9 13.6 C8 4.5, 24 4.5, 23 13.6 C20 9, 12 9, 9 13.6 Z'} fill={h} />
      <circle cx="13.4" cy="14.6" r="1" fill="#2A2730" /><circle cx="18.6" cy="14.6" r="1" fill="#2A2730" />
      <path d="M13.8 17.6 Q16 19.4 18.2 17.6" stroke="#8A4B3A" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
};
// Qizil to'xtash belgisi: bir joyda bir nechta bo'lsa — kattalashadi, ichida son
const Nuqta = ({ n = 1, className }) => <span key={n} className={cxx('pa-nuqta', n > 1 && 'kop', className)}>{n > 1 ? n : ''}</span>;

// Telefon = ilova (SABOQ 22–23): 172×272 barqaror; «Maydon Jamoa» ramka ustida o'z rangida (#2E9E4F, tayanch 9.62)
// tartib: 'sinovdagi' | 'tuzatilgan' · sarlavhasiz: kun sarlavhalari ko'rinmaydi (reja — kashfiyotni ochmaydi) · nuqta: { royxat } · oyin: «O'yin» ekrani bir lahza — 'son' («8 / 10» yonida nuqta) | 'kelaman' («Qo'shilaman» ostida)
const OyinKarta = ({ id, kunsiz }) => {
  const o = SINOV_MAYDON.oyinlar[id];
  return (
    <div className="pa-ok" data-fid={'o' + id}>
      <b className="pa-ok-sar">{kunsiz ? o.soat : `${tr(o.kun)}, ${o.soat}`}</b>
      <span className="pa-ok-q"><span className="pa-ok-joy">{tr(o.maydon)}</span><b className="pa-ok-son">{o.son}</b></span>
    </div>
  );
};
const Tel = ({ tartib = 'sinovdagi', sarlavhasiz, nuqta = {}, oyin, ajrat, yorliq, rejaNuqta = 0, className, children }) => {
  const listRef = useFlip(tartib);
  const tuz = tartib === 'tuzatilgan';
  const ro = SINOV_MAYDON.royxat[tartib];
  const o1 = SINOV_MAYDON.oyinlar[1];
  return (
    <div className={cxx('pa-tel-ust', className)}>
      {yorliq ? <span className="pa-tel-yorliq">{yorliq}</span> : null}
      <div className="pa-tel">
        <span className="pa-tel-bar"><b className="pa-tel-nom">Maydon Jamoa</b></span>
        {oyin
          ? <div className="pa-oyin" key="oyin">
            <span className="pa-oyin-orqa">‹ {tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
            <b className="pa-oyin-sar">{tr(o1.kun)}, {o1.soat}</b>
            <span className="pa-ok-joy">{tr(o1.maydon)}</span>
            <b className="pa-oyin-son">{o1.son}{oyin === 'son' && <Nuqta className="son" />}</b>
            <span className="pa-oyin-btn">{tr({ uz: "Qo'shilaman", ru: "Qo'shilaman" })}</span>
            {oyin === 'kelaman' && <Nuqta className="oyin" />}
          </div>
          : <div className={cxx('pa-ekran', ajrat && 'ajrat')} key="ro">
            <b className="pa-ekran-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
            <div className={cxx('pa-ro', ajrat && 'pa-halqa-s')} ref={listRef}>
              {nuqta.royxat > 0 && <Nuqta n={nuqta.royxat} className="royxat" />}
              {rejaNuqta > 0 && rejaNuqta < 4 && [0, 1, 2].map(i => <span key={i} className={cxx('pa-nuqta pa-rn', 'r' + i, rejaNuqta >= 2 && 'yigil')} />)}
              {ro.map((x, i) => (typeof x === 'number'
                ? <OyinKarta key={'o' + x} id={x} kunsiz={tuz} />
                : (sarlavhasiz ? <span key={'h' + i} className="pa-ok-ora" /> : <span key={'h' + i} className="pa-ok-h">{tr(x.h)}</span>)))}
            </div>
          </div>}
      </div>
      {children}
    </div>
  );
};
// Yozuv kartasi (9-Modul shabloni): «N-o'yinchi» · vazifa · «vaqt · nima qildi» — to'xtash qatori accent, yorliq «to'xtadi»
const YozuvKarta = ({ y }) => (
  <div className="pa-yk" data-yk={y.kim}>
    <div className="pa-yk-h"><Yuz i={y.kim - 1} /><b>{OYINCHI(y.kim)}</b></div>
    <p className="pa-yk-v">{tr(VAZIFA_T)}: {tr(SINOV_MAYDON.vazifa)}</p>
    <ol className="pa-yk-ro">{y.qatorlar.map((q, i) => (
      <li key={i} className={cxx('pa-yk-q', q.x && 'tox')} style={{ '--i': i }} data-yq={q.x ? `${y.kim}-${q.x}` : undefined}>
        <span className="pa-yk-vt">{q.v}</span><span className="pa-yk-t">{tr(q.t)}</span>{q.x && <i className="pa-yk-l">{tr(TOXTADI_T)}</i>}
      </li>
    ))}</ol>
  </div>
);
// Sanalgan yozuv — ixcham qator «1-o'yinchi · 2 to'xtash · bajardi ✓»
const YozuvIxcham = ({ y, natija, yangi }) => (
  <div className={cxx('pa-yi', yangi && 'yangi')} data-yi={y.kim}>
    <Yuz i={y.kim - 1} s={22} /><b>{OYINCHI(y.kim)}</b><span className="pa-yi-n">· {toxSoni(y)} {tr({ uz: "to'xtash", ru: 'остановки' })}</span>
    {natija && <span className={cxx('pa-yi-b', y.bajardi ? 'ok' : 'yoq')} style={{ '--i': y.kim - 1 }}>{tr(y.bajardi ? BAJARDI_T.ok : BAJARDI_T.yoq)}</span>}
  </div>
);
// Sanoq jadvali: «To'xtash · Nechta kishida · Navbat»; ostida «Vazifani bajardi: N / 3»
const SanoqJadval = ({ qatorlar, jami = 3, bajardi, tanlash, onTanla, silk, yangi = [], kichik, navbat = {} }) => (
  <div className={cxx('pa-jd', kichik && 'kichik')} data-jd="1">
    <div className="pa-jd-h"><span>{tr({ uz: "To'xtash", ru: 'Остановка' })}</span><span>{tr({ uz: 'Nechta kishida', ru: 'У скольких' })}</span><span>{tr({ uz: 'Navbat', ru: 'Очередь' })}</span></div>
    <div className={cxx('pa-jd-tana', tanlash && 'pa-guruh')}>
      {qatorlar.map(q => {
        const nv = navbat[q.id];
        const ichi = <>
          <span className="pa-jq-t">{tr(q.nom)}</span>
          <b className={cxx('pa-jq-n', yangi.includes(q.id) && 'yangi')} key={q.son}>{q.son} / {jami}</b>
          <span className="pa-jq-b">{nv && <i className={cxx('pa-nv', nv)}>{tr(NAVBAT_T[nv])}</i>}</span>
        </>;
        const kl = cxx('pa-jq', yangi.includes(q.id) && 'yangi', nv, silk === q.id && 'q-silk');
        return tanlash
          ? <button key={q.id} type="button" className={kl} data-jq={q.id} onClick={() => onTanla(q.id)}>{ichi}</button>
          : <div key={q.id} className={kl} data-jq={q.id}>{ichi}</div>;
      })}
    </div>
    {bajardi !== undefined && <div className="pa-jd-f">{tr({ uz: 'Vazifani bajardi', ru: 'Выполнили задание' })}: <b key={String(bajardi)}>{bajardi}</b> / {jami}</div>}
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish: sof so'rovnoma, J-026 — hammaga correct: false, maqtovsiz) =====
const HOOK_OPTS = [
  { id: 'kop', t: { uz: "Ko'p kishi to'xtagan joyni", ru: 'Место, где застряли многие' } },
  { id: 'vazifa', t: { uz: "Vazifani to'xtatgan joyni", ru: 'Место, которое остановило задание' } },
  { id: 'oson', t: { uz: 'Eng oson tuzatiladigan joyni', ru: 'Место, которое проще всего исправить' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const isLive = !!(live && live.pin && (live.mode === 'student' || live.mode === 'mentor'));
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [ochildi, setOchildi] = useState(storedAnswer ? 3 : 0);
  const keyin = useKeyin();
  // Tanlovdan keyin: uch yozuv-karta navbat bilan (100 ms) ochiladi, ichida qizil to'xtash belgilari yonadi (2 · 1 · 2)
  useEffect(() => {
    if (picked === null || ochildi >= 3) return undefined;
    keyin(() => setOchildi(n => Math.min(3, n + 1)), ochildi === 0 ? 350 : 100);
    return undefined;
  }, [picked, ochildi]); // eslint-disable-line
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex(o => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('pa-s0', picked === null && !isMentor && 'tanlovsiz')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Uch foydalanuvchidan keyin <A>nimani tuzatasiz?</A></>, ru: <>Что вы исправите <A>после трёх пользователей?</A></> })}
          mentor={<Mentor>{tr({ uz: "Mentor misolida «Maydon Jamoa»ni auditoriyadan uch o'yinchi sinadi va har biri qayerdadir to'xtadi. O'zingizga yaqin javobni belgilang.", ru: 'В примере Ментора «Maydon Jamoa» проверили три игрока из аудитории, и каждый где-то застрял. Отметьте близкий вам ответ.' })}</Mentor>}
          maket={<div className="pa-s0-maket">
            <p className="pa-vq">{tr(VAZIFA_T)}: «{tr(SINOV_MAYDON.vazifa)}»</p>
            <div className="pa-s0-ust">
              <Tel />
              <div className="pa-s0-yk">{SINOV_MAYDON.yozuvlar.map((y, i) => (
                <div key={y.kim} className={cxx('pa-yopiq', i < ochildi && 'ochiq')}>
                  <span className="pa-yopiq-h"><Yuz i={y.kim - 1} s={24} /><b>{OYINCHI(y.kim)}</b></span>
                  {i < ochildi && <span className="pa-yopiq-n">{y.qatorlar.filter(q => q.x).map((q, k) => <Nuqta key={k} className="ich" />)}</span>}
                </div>
              ))}</div>
            </div>
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={isMentor}
          javob={<>
            {picked !== null && <p className="pa-javob fade-step">{tr({ uz: "Har birining o'z sababi bor. Bugun uch yozuvni sanab, qaysi biri birinchi ekanini o'zingiz topasiz.", ru: 'У каждого свой довод. Сегодня вы посчитаете три записи и сами найдёте, что исправлять первым.' })}</p>}
            {isLive && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map(o => tr(o.t))} mening={HOOK_OPTS.findIndex(o => o.id === picked)} />}
          </>}
        />
      </div>
      <MentorNote>{tr({ uz: "Shu ekranda qo'l ko'tartirib so'rang: «Uyda kim sinov o'tkazdi?» Yozuvi yo'qlar Reja ekranida sinfdosh bilan sinov o'tkazadi.", ru: 'На этом экране спросите поднятием руки: «Кто провёл тест дома?» У кого записи нет — на экране «План» проводят тест с одноклассником.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Dars oxirida» — telefon o'zi o'ynaydi: uch nuqta bir joyga yig'iladi → kartalar o'z joyiga uchadi → «Qayta sinov: vazifa bajarildi») =====
const REJA = [
  { t: { uz: 'Har to\'xtash nechta kishida takrorlanganini sanaysiz', ru: 'Посчитаете, у скольких людей повторилась каждая остановка' }, teg: { uz: 'sanoq', ru: 'счёт' } },
  { t: { uz: "Kim vazifani bajara olmaganini ko'rib, birinchisini tanlaysiz", ru: 'Увидите, кто не выполнил задание, и выберете первое' }, teg: { uz: 'birinchi', ru: 'первое' } },
  { t: { uz: "Tanlangan to'xtashni o'z ilovangizda tuzatasiz", ru: 'Исправите выбранную остановку в своём приложении' }, teg: { uz: 'tuzatish', ru: 'исправление' } },
  { t: { uz: 'Tuzatishni yangi odam bilan qayta sinaysiz', ru: 'Повторно проверите исправление с новым человеком' }, teg: { uz: 'qayta sinov', ru: 'повторный тест' } }
];
const RejaChizma = () => {
  const [b, setB] = useState(0);
  const keyin = useKeyin();
  useEffect(() => {
    if (kamHarakat()) { setB(4); return; }
    keyin(() => setB(1), 700); keyin(() => setB(2), 1500); keyin(() => setB(3), 2500); keyin(() => setB(4), 3500);
  }, []); // eslint-disable-line
  return (
    <div className="pa-rj">
      <Tel tartib={b >= 3 ? 'tuzatilgan' : 'sinovdagi'} sarlavhasiz rejaNuqta={b} />
      {b >= 4 && <p className="pa-rj-ok fade-step"><i>✓</i>{tr({ uz: 'Qayta sinov: vazifa bajarildi', ru: 'Повторный тест: задание выполнено' })}</p>}
    </div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun sinovdagi <A>eng muhim to'xtash</A> tuzatiladi.</>, ru: <>Сегодня исправляется <A>самая важная остановка</A> из теста.</> })}
      mentor={<Mentor>{tr({ uz: 'Kodni Antigravity agenti o\'zgartiradi: siz talab yozasiz va natijani yangi odam bilan qayta sinaysiz.', ru: 'Код меняет агент Antigravity: вы пишете требование и повторно проверяете результат с новым человеком.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida: auditoriya bilan sinov va shu darsda tuzatish', ru: 'В конце урока: тест с аудиторией и исправление на этом же уроке' })}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    >
      <div className="pa-reja-ost">
        <p className="pa-reja-repo">repo <code>maydon-jamoa</code> · {tr({ uz: "boshlang'ich holat", ru: 'начальное состояние' })} <code>m11-dars-13-start</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code>m11-dars-13-done</code> — {tr({ uz: 'amaliyotlarni o\'z mahsulotingizda bajarasiz.', ru: 'практику вы делаете на своём продукте.' })}</p>
        <p className="pa-reja-izoh">{tr({ uz: "Yozuvingiz yo'qmi? Hozir sinfdoshingiz bilan sinang: «Hisobdan chiqish» — u namuna ism va telefon bilan ro'yxatdan o'tadi.", ru: 'Нет записи? Проведите тест с одноклассником прямо сейчас: «Hisobdan chiqish» — он регистрируется с образцом имени и телефона.' })}</p>
      </div>
      <MentorNote>{tr({ uz: "Yozuvi yo'q o'quvchilarni uchlik guruhga bo'ling — har ilovani qolgan ikkitasi 3 daqiqadan sinaydi (≈ 10 daqiqa; vaqt yetmasa — juftlikda: bitta yozuv ham yetadi, 5-mashqda «1 kishi»), vazifa — ilovaning asosiy harakati (12-dars uyga vazifasidagidek). Har sinovdan oldin ilova egasi «Hisobdan chiqish»ni bosadi, sinfdosh namuna ism va namuna telefon bilan ro'yxatdan o'tadi — o'z raqamini yozmaydi, har sinovchiga boshqa raqam; shunda har sinovchi asosiy harakatni o'zi ko'radi. Yozuvi borlar shu paytda sinfdoshining ilovasini sinashi mumkin. Kuzatuvchi faqat «O'zingiz qanday deb o'ylaysiz?» deydi. Sinfdosh auditoriyadan bo'lmasa — bu mashq (5-mashqda «mashq» deb belgilanadi); real sinov — uyda.", ru: 'Учеников без записи разделите на тройки — каждое приложение двое других проверяют по 3 минуты (≈ 10 минут; если не хватает времени — в парах: хватит и одной записи, в 5-м упражнении «1 человек»), задание — главное действие приложения (как в домашнем задании 12-го урока). Перед каждым тестом владелец приложения нажимает «Hisobdan chiqish», одноклассник регистрируется с образцом имени и образцом телефона — свой номер не пишет, у каждого тестирующего другой номер; так каждый сам видит главное действие. Ученики с записью в это время могут проверить приложение одноклассника. Наблюдатель говорит только: «А вы сами как думаете?» Если одноклассник не из аудитории — это упражнение (в 5-м упражнении отмечается «упражнение»); настоящий тест — дома.' })}</MentorNote>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — UCH YOZUVNI SANASH (QTushuncha markaziy: bashorat → «Sanash» ×3 → «Vazifa natijasi» → qator tanlash; holat o'quvchi bosgan qadamlardan chiziladi, P-046) =====
const S2_TAXMIN = [
  { k: 'yoq', t: { uz: "Yo'q, hammasi har xil", ru: 'Нет, все разные' } },
  { k: 'bitta', t: { uz: 'Bitta bor', ru: 'Есть одна' } },
  { k: 'ikkita', t: { uz: 'Ikkita bor', ru: 'Есть две' } }
];
const S2_SAVOL = { uz: "Uch o'yinchining hammasida bir xil to'xtash bormi?", ru: 'Есть ли у всех трёх игроков одинаковая остановка?' };
const TaxminIxcham = ({ savol, javob, belgi }) => (
  <div className="pa-taxmin fade-step"><span className="pa-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="pa-taxmin-s">{savol}</span><b>{javob}</b>{belgi}</div>
);
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const am = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [kart, setKart] = useState(null);          // ko'rsatilayotgan yozuv (indeks)
  const [qoll, setQoll] = useState(avval ? 3 : 0);  // jadvalga qo'shilgan yozuvlar
  const [n, setN] = useState(avval ? 3 : 0);        // sanab bo'lingan (ixcham) yozuvlar
  const [oyinEkran, setOyinEkran] = useState(null);
  const [yangi, setYangi] = useState([]);
  const [natija, setNatija] = useState(avval);
  const [tanlov, setTanlov] = useState(avval ? 'topish' : null);
  const [xato, setXato] = useState(null);
  const birinchiRef = useRef(null);
  const keyin = useKeyin();
  const { box, parvoz, uchir } = useParvoz();
  const band = kart !== null;
  const done = tanlov === 'topish';
  const tugadi = useTugadi(done, 1600, avval);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const togri = birinchiRef.current !== false;
    onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: togri, firstAttemptCorrect: togri, picked: true, taxmin });
  }, [done]); // eslint-disable-line
  const sanash = () => {
    if (!taxmin || band || n >= 3) return;
    const k = n;
    const y = SINOV_MAYDON.yozuvlar[k];
    setKart(k);
    const t0 = y.qatorlar.length * 80 + 520;
    keyin(() => {
      y.qatorlar.forEach(q => {
        if (!q.x) return;
        const bor = box.current && box.current.querySelector(`[data-jq="${q.x}"]`);
        uchir(`[data-yq="${y.kim}-${q.x}"]`, bor ? `[data-jq="${q.x}"]` : '[data-jd="1"] .pa-jd-h', tr(TOXTADI_T));
      });
    }, t0);
    const ichki = y.qatorlar.find(q => q.x === 'son' || q.x === 'kelaman');
    if (ichki) { keyin(() => setOyinEkran(ichki.x), t0 + 800); keyin(() => setOyinEkran(null), t0 + 2000); }
    keyin(() => { setQoll(k + 1); setYangi(y.qatorlar.filter(q => q.x).map(q => q.x)); }, t0 + 650);
    keyin(() => { setYangi([]); }, t0 + 1700);
    keyin(() => { setKart(null); setN(k + 1); }, t0 + (ichki ? 2300 : 1900));
  };
  const vazifaNatija = () => { if (n < 3 || natija) return; setNatija(true); };
  const tanla = (id) => {
    if (done || !natija) return;
    if (id === 'topish') { if (birinchiRef.current === null) birinchiRef.current = true; setXato(null); setTanlov('topish'); return; }
    if (birinchiRef.current === null) { birinchiRef.current = false; if (am) am.miss(screen); }
    setXato({ id, k: Date.now() });
  };
  const qatorlar = sanoqQator(qoll);
  const navbat = done ? { topish: 'birinchi', son: 'keyin', kelaman: 'keyin' } : {};
  const royxatSon = SINOV_MAYDON.yozuvlar.slice(0, qoll).filter(y => y.qatorlar.some(q => q.x === 'topish')).length;
  const faza = !taxmin ? 'bash' : n < 3 ? 'sana' : !natija ? 'vazifa' : !done ? 'tanla' : 'tayyor';
  const MENTOR2 = {
    bash: { uz: 'Avval taxminingizni belgilang, keyin yozuvlarni birma-bir sanang.', ru: 'Сначала отметьте предположение, потом считайте записи по одной.' },
    sana: { uz: "4-darsda intervyu yozuvlarini sanagansiz — sinov yozuvi ham shunday sanaladi, «Sanash»ni bosing.", ru: 'На 4-м уроке вы считали записи интервью — запись теста считается так же, нажмите «Sanash».' },
    vazifa: { uz: "Endi har o'yinchi vazifani bajara oldimi — «Vazifa natijasi»ni bosing.", ru: 'Теперь — смог ли каждый игрок выполнить задание: нажмите «Vazifa natijasi».' },
    tanla: { uz: "Ikkala savolga qarab, birinchi tuzatiladigan to'xtashni tanlang.", ru: 'Глядя на оба вопроса, выберите остановку, которую исправят первой.' },
    tayyor: { uz: "Birinchisi tanlandi — «Davom etish»ni bosing.", ru: 'Первая выбрана — нажмите «Davom etish».' }
  };
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  const txOk = taxmin === 'bitta';
  const navLabel = !taxmin ? tr({ uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте предположение' })
    : n < 3 ? `${tr({ uz: 'Sanash', ru: 'Посчитать' })} (${n}/3)`
      : !natija ? tr({ uz: 'Vazifa natijasi', ru: 'Итог задания' })
        : !done ? tr({ uz: 'Qatorni tanlang', ru: 'Выберите строку' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sanoq', ru: 'Понятие · счёт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Uch yozuvda qaysi to'xtash <A>takrorlanadi?</A></>, ru: <>Какая остановка <A>повторяется</A> в трёх записях?</> })}
        mentor={<Mentor key={faza}>{tr(MENTOR2[faza])}</Mentor>}
        bashorat={!taxmin
          ? <div className="pa-bash"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} /></div>
          : !done && <TaxminIxcham savol={tr(S2_SAVOL)} javob={tr(tx.t)} />}
        vizual={<div className={cxx('pa-sahna', tugadi && 'tinch')} ref={box}>
          <Tel nuqta={{ royxat: royxatSon }} oyin={oyinEkran} ajrat={done}
            yorliq={done ? <span className="pa-tartib fade-step">{tr({ uz: "tartib: qo'shilgan vaqti bo'yicha", ru: 'порядок: по времени добавления' })}</span> : ''} />
          <div className="pa-yozuvlar">
            {((n < 3 && !band) || (n >= 3 && !natija) || SINOV_MAYDON.yozuvlar.some((y, i) => i >= n && i !== kart)) && !tugadi && <div className="pa-navbat">
              {n < 3 && !band && <QTugma className={cxx('pa-sanash', halqa(!!taxmin))} disabled={!taxmin} onClick={sanash}>{tr({ uz: 'Sanash', ru: 'Посчитать' })}</QTugma>}
              {n >= 3 && !natija && <QTugma className={cxx('pa-sanash', halqa(true))} onClick={vazifaNatija}>{tr({ uz: 'Vazifa natijasi', ru: 'Итог задания' })}</QTugma>}
              {SINOV_MAYDON.yozuvlar.filter((y, i) => i >= n && i !== kart).map(y => <span key={y.kim} className="pa-kutar"><Yuz i={y.kim - 1} s={20} />{OYINCHI(y.kim)}</span>)}
            </div>}
            {SINOV_MAYDON.yozuvlar.slice(0, n).map(y => <YozuvIxcham key={y.kim} y={y} natija={natija} yangi={!avval && n === y.kim} />)}
            {kart !== null && <YozuvKarta y={SINOV_MAYDON.yozuvlar[kart]} />}
          </div>
          <div className="pa-jd-ust">
            <SanoqJadval qatorlar={qatorlar} bajardi={natija ? 2 : '?'} yangi={yangi} tanlash={natija && !done} onTanla={tanla} silk={xato && xato.id} navbat={navbat} />
            {natija && !done && <NishonQatori screen={screen} />}
            {xato && !done && <QXato key={xato.k}>{tr({ uz: "Bu to'xtash bir kishida, u vazifani bajardi.", ru: 'Эта остановка у одного человека, и он выполнил задание.' })}</QXato>}
          </div>
          {natija && <Bog dan='[data-yi="2"] .pa-yi-b' gacha='[data-jq="topish"]' kalit={`${natija}-${done}-${tugadi}`} />}
          {parvoz.map(p => <Parvoz key={p.k} p={p} />)}
        </div>}
        natija={n >= 3 && !done && <QIzoh>{tr({ uz: "Har to'xtash nechta kishida takrorlangani — sanoq; har yozuvda alohida — kishi vazifani bajara oldimi.", ru: 'Сколько людей повторили каждую остановку — это счёт; отдельно в каждой записи — смог ли человек выполнить задание.' })}</QIzoh>}
        xulosa={done && <>{tx && <span className={cxx('pa-tx', txOk && 'ok')}>{taxmin === 'bitta'
          ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })
          : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t)} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: "bitta bor — o'yinni topish", ru: 'одна — поиск игры' })}</b></>}</span>}
          {tr({ uz: "Bu sinovda o'yinni topish uchala o'yinchida takrorlandi va birini to'xtatdi — u birinchi tuzatiladi.", ru: 'В этом тесте поиск игры повторился у всех трёх игроков и одного остановил — его исправляют первым.' })}</>}
      />
      <MentorNote>{tr({ uz: "9-Modulda bitta o'yinchining bitta sinovi edi — har to'xtashning «vazifaga ta'siri» yozilgan; bugun uch kishi, shuning uchun sanoq qo'shildi. Mentor misolida har sinovdan oldin «Hisobdan chiqish» bosilgan, o'yinchi namuna ism va telefon bilan ro'yxatdan o'tgan — shuning uchun har biri «Qo'shilaman»ni o'zi ko'rgan. «Topishda to'xtadi» — qidirgan paytdagi to'xtash: 1 va 3-o'yinchi keyin topdi, 2-o'yinchi topmadi. Uch kishi — kichik son: sanoq tanlovga yordam beradi, isbot emas. Sinfga savol: «Bitta kishida bo'lgan, lekin vazifani butunlay to'xtatgan to'xtash-chi?» — javob: u ham muhim bo'lishi mumkin; bu sinovda ikkala savolga «ha» bo'lgani bitta edi.", ru: 'В 9-м модуле был один тест одного игрока — у каждой остановки записывалось «влияние на задание»; сегодня три человека, поэтому добавился счёт. В примере Ментора перед каждым тестом нажимали «Hisobdan chiqish», игрок регистрировался с образцом имени и телефона — поэтому каждый сам видел «Qo\'shilaman». «Застрял при поиске» — остановка во время поиска: игроки 1 и 3 потом нашли, игрок 2 — нет. Три человека — маленькое число: счёт помогает выбору, но не доказывает. Вопрос классу: «А остановка у одного человека, которая полностью остановила задание?» — ответ: она тоже может быть важной; в этом тесте «да» на оба вопроса было у одной.' })}</MentorNote>
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s3 = 1; ikkinchi misol — o'sha olam, boshqa vazifa; savol ustida yorliq yo'q — SABOQ 6) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · birinchi qaysi', ru: 'Проверка · что первым' })}
    questionText="Vazifa — o'yin e'lon qilish. Ikki savol bo'yicha qaysi to'xtash birinchi?"
    question={tr({ uz: <><h2 className="title h-ask">Vazifa — o'yin e'lon qilish. Ikki savol bo'yicha <A>qaysi to'xtash birinchi?</A></h2><NishonQatori screen={3} /></>, ru: <><h2 className="title h-ask">Задание — объявить игру. Какая остановка <A>первая по двум вопросам?</A></h2><NishonQatori screen={3} /></> })}
    options={[
      { uz: '1 kishida: soatni uzoq tanladi, e\'lonni berdi', ru: 'У 1 человека: долго выбирал час, объявление дал' },
      { uz: '3 kishida: kunni topmadi, 2 tasi e\'lon bermadi', ru: 'У 3 человек: не нашли день, 2 не дали объявление' },
      { uz: '2 kishida: maydon nomini so\'radi, e\'lonni berdi', ru: 'У 2 человек: спросили название поля, объявление дали' },
      { uz: '1 kishida: tugmani topmadi, e\'lonni bermadi', ru: 'У 1 человека: не нашёл кнопку, объявление не дал' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Eng ko'p kishida takrorlangan va vazifani to'xtatgani shu.", ru: 'Это повторилось у большинства и остановило задание.' }}
    explainWrong={{
      0: { uz: "Bitta kishi, e'lon berildi. Vazifani to'xtatgani bormi?", ru: 'Один человек, объявление дано. Есть ли то, что остановило задание?' },
      2: { uz: "Ikki kishi so'radi, lekin e'lon berildi. Vazifa to'xtadimi?", ru: 'Спросили двое, но объявление дано. Задание остановилось?' },
      3: { uz: "Vazifa to'xtadi, lekin bir kishida. Ko'proq kishida bormi?", ru: 'Задание остановилось, но у одного. Есть ли у большего числа людей?' },
      default: { uz: 'Ikki savolga qarang: nechta kishida va vazifa to\'xtadimi?', ru: 'Посмотрите на два вопроса: у скольких и остановилось ли задание?' }
    }} />
);

// ===== SCREEN 4 — CYBERPUNK 2077 (QVoqea, PM keys K10 — bank matni aynan, raqamsiz; nom o'z rangida, logotipsiz; bosqich gapi Mentorda; ekranda uch blok: sahna · vaqt qatori · bashorat) =====
// Manba (o'quvchi ko'rmaydi): PM_Prompt_v8.md K10 · tayanch 5, 9.91. Xatolarni kim va qachon ko'rgani bankda yo'q — aytilmaydi. Sahnada son, sotuv, ism yo'q.
// Nom rangi: o'yin muqovasidagi sariq (#FCEE0A) — och fonda o'qilishi uchun sariq yorliq ustida to'q matn.
const Kibr = () => <span className="pa-cp">Cyberpunk 2077</span>;
const KIBR_BOSQICH = [
  { h: { uz: 'Xatolar bilan chiqdi', ru: 'Вышла с ошибками' }, m: { uz: '2020-yil dekabrida Cyberpunk 2077 konsollarda ko\'p xato bilan chiqdi.', ru: 'В декабре 2020 года Cyberpunk 2077 вышла на консолях с большим числом ошибок.' } },
  { h: { uz: 'Pulni qaytarish', ru: 'Возврат денег' }, m: { uz: "O'yin chiqqach, ko'p xaridor pulini qaytarishni so'radi.", ru: 'После выхода игры многие покупатели попросили вернуть деньги.' } },
  { h: { uz: "Do'kondan olib qo'yildi", ru: 'Убрали из магазина' }, m: { uz: "Sony o'yinni PlayStation Store'dan qariyb yarim yilga olib qo'ydi.", ru: 'Sony убрала игру из PlayStation Store почти на полгода.' } }
];
const KB_TAXMIN = [
  { k: 'hafta', t: { uz: 'Bir haftaga', ru: 'На неделю' } },
  { k: 'oy', t: { uz: 'Bir oyga', ru: 'На месяц' } },
  { k: 'yarim', ok: true, t: { uz: 'Qariyb yarim yilga', ru: 'Почти на полгода' } }
];
const KB_SAVOL = { uz: "Sony o'yinni o'z do'konidan qancha muddatga olib qo'ydi?", ru: 'На какой срок Sony убрала игру из своего магазина?' };
const PS_NOM = 'PlayStation Store';
// Do'kon oynasi (chizilgan, logotipsiz): sarlavha «PlayStation Store» o'z ko'k rangida, o'yin kartalari qatori
const KbDokon = ({ x, y, w, chiqdi, matn }) => {
  const cw = (w - 40) / 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height="132" rx="8" fill="#FFFFFF" stroke="#CFC8E6" strokeWidth="1.5" />
      <rect x={x} y={y} width={w} height="26" rx="8" fill="#F1F0F7" />
      <rect x={x} y={y + 18} width={w} height="8" fill="#F1F0F7" />
      {[0, 1, 2].map(i => <circle key={i} cx={x + 12 + i * 10} cy={y + 13} r="3" fill="#CFC8E6" />)}
      <text className="kb-ps" x={x + w / 2 + (w < 200 ? 12 : 0)} y={y + 17} textAnchor="middle">{PS_NOM}</text>
      {[0, 1, 2, 3].map(i => {
        const cx0 = x + 10 + i * (cw + 6.6);
        const kibr = i === 1;
        return (
          <g key={i} className={cxx(kibr && 'kb-karta', kibr && chiqdi && 'chiqdi')}>
            <rect x={cx0} y={y + 38} width={cw} height="80" rx="6" fill={kibr ? '#FCEE0A' : ['#7B61C9', '#FCEE0A', '#3E7CB1', '#E07A5F'][i]} />
            {kibr
              ? <><rect x={cx0 + 6} y={y + 48} width={cw - 12} height="34" rx="3" fill="#14121F" />{matn && <text className="kb-kt" x={cx0 + cw / 2} y={y + 104} textAnchor="middle">Cyberpunk 2077</text>}
                <path d={`M ${cx0 + 10} ${y + 76} l 8 -14 l 6 8 l 5 -6 l 8 12 z`} fill="#00E5FF" /></>
              : <><circle cx={cx0 + cw / 2} cy={y + 66} r="13" fill="#FFFFFF" opacity="0.5" /><rect x={cx0 + 8} y={y + 96} width={cw - 16} height="7" rx="3.5" fill="#FFFFFF" opacity="0.6" /></>}
          </g>
        );
      })}
    </g>
  );
};
// Xaridor (SABOQ 36: real ko'rinish — bosh, soch, yuz, rangli kiyim, qo'lida o'yin qutisi)
const KbXaridor = ({ x, i }) => {
  const t = ODAM_RANG.teri[i % 3], h = ODAM_RANG.soch[(i + 2) % 3], k = ODAM_RANG.kiyim[(i + 1) % 5];
  return (
    <g className="kb-xaridor" style={{ '--i': i }}>
      <g transform={`translate(${x} 196)`}>
        <rect x="-8" y="-34" width="7" height="32" rx="3.5" fill="#3B3F5C" /><rect x="1" y="-34" width="7" height="32" rx="3.5" fill="#3B3F5C" />
        <rect x="-9" y="-4" width="9" height="4.5" rx="2" fill="#2A2730" /><rect x="1" y="-4" width="10" height="4.5" rx="2" fill="#2A2730" />
        <rect x="-12" y="-66" width="24" height="34" rx="9" fill={k} />
        <rect x="-3" y="-71" width="6" height="6" rx="2" fill={t} />
        <rect x="8" y="-60" width="7" height="18" rx="3.5" fill={k} />
        <rect x="12" y="-52" width="12" height="15" rx="2" fill="#FCEE0A" stroke="#14121F" strokeWidth="1" />
        <circle cx="0" cy="-81" r="11" fill={t} />
        <path d="M -11.5 -80 C -12.5 -97, 12.5 -97, 11.5 -81 C 6 -88, -3 -89, -11.5 -80 Z" fill={h} />
        <circle cx="3" cy="-81" r="1.4" fill="#2A2730" /><circle cx="8" cy="-81" r="1.4" fill="#2A2730" />
        <path d="M 3.5 -75 Q 6 -77 8.5 -75" stroke="#8A4B3A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
      <g className="kb-qaytar" style={{ '--i': i, '--dx': `${300 - x}px` }}>
        <rect x={x - 34} y="58" width="68" height="26" rx="6" fill="#FFFFFF" stroke="#C2362B" strokeWidth="1.4" />
        <text className="kb-qt" x={x} y="75" textAnchor="middle">{tr({ uz: 'Pulni qaytaring', ru: 'Верните деньги' })}</text>
      </g>
    </g>
  );
};
const KibrSahna = ({ b }) => (
  <svg className={cxx('pa-kb', `b${b}`)} viewBox="0 0 560 210" role="img" aria-label={tr(KIBR_BOSQICH[b].h)} key={b}>
    <defs>
      <clipPath id="kb-ekran"><rect x="186" y="34" width="188" height="104" rx="3" /></clipPath>
      <linearGradient id="kb-osmon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2B1650" /><stop offset="1" stopColor="#0E0B1D" /></linearGradient>
    </defs>
    {b === 0 && <g>
      <rect x="0" y="0" width="560" height="176" fill="#F2ECE4" />
      <rect x="0" y="176" width="560" height="34" fill="#D9C7AF" />
      <rect x="140" y="160" width="280" height="18" rx="4" fill="#9C7A55" />
      <rect x="150" y="178" width="10" height="18" fill="#7E5F40" /><rect x="400" y="178" width="10" height="18" fill="#7E5F40" />
      <rect x="176" y="24" width="208" height="124" rx="9" fill="#1E1B2E" />
      <rect x="270" y="148" width="20" height="12" fill="#1E1B2E" />
      <g clipPath="url(#kb-ekran)">
        <rect x="186" y="34" width="188" height="104" fill="url(#kb-osmon)" />
        <g className="kb-kadr">
          {[[180, 70, 26], [210, 52, 22], [236, 80, 18], [258, 46, 28], [290, 66, 20], [314, 40, 24], [342, 74, 22], [368, 56, 26], [398, 62, 20], [424, 48, 24]].map(([x, y, w], i) => (
            <g key={i}><rect x={x} y={y} width={w} height={138 - y} fill={i % 2 ? '#241C3D' : '#1A1530'} />
              {[0, 1, 2].map(r => <rect key={r} x={x + 4} y={y + 8 + r * 14} width={w - 8} height="4" fill={(i + r) % 3 ? '#FCEE0A' : '#00E5FF'} opacity="0.75" />)}</g>
          ))}
          <rect x="180" y="118" width="280" height="20" fill="#120E22" />
          {[0, 1, 2, 3, 4].map(i => <rect key={i} x={190 + i * 56} y="127" width="26" height="2.5" fill="#FCEE0A" opacity="0.6" />)}
        </g>
        <g className="kb-glitch">
          <rect x="186" y="58" width="188" height="9" fill="#00E5FF" opacity="0.55" />
          <rect x="186" y="84" width="188" height="5" fill="#FF3B6B" opacity="0.6" />
          <rect x="186" y="104" width="188" height="11" fill="#FFFFFF" opacity="0.35" />
        </g>
      </g>
      <rect x="226" y="164" width="108" height="12" rx="3" fill="#F7F7FA" stroke="#BDB8CC" />
      <circle cx="322" cy="170" r="1.8" fill="#00A3FF" />
      <path d="M 334 170 C 360 172, 372 186, 392 186" stroke="#3B3F5C" strokeWidth="1.5" fill="none" />
      <rect x="388" y="180" width="34" height="14" rx="7" fill="#2A2730" /><circle cx="397" cy="187" r="2" fill="#6B7085" /><circle cx="413" cy="187" r="2" fill="#6B7085" />
      <g opacity="0.9"><rect x="470" y="120" width="22" height="56" rx="3" fill="#C9673F" /><circle cx="481" cy="108" r="20" fill="#5FA35A" /><circle cx="470" cy="96" r="12" fill="#6FB866" /></g>
    </g>}
    {b === 1 && <g>
      <rect x="0" y="0" width="560" height="176" fill="#EEF0F7" />
      <rect x="0" y="176" width="560" height="34" fill="#D3D6E2" />
      <g className="kb-uyum"><rect x="270" y="112" width="60" height="38" rx="4" fill="#FFFFFF" stroke="#C2362B" strokeWidth="1.2" opacity="0.9" transform="rotate(-6 300 131)" /><rect x="272" y="116" width="60" height="38" rx="4" fill="#FFFFFF" stroke="#C2362B" strokeWidth="1.2" transform="rotate(4 302 135)" /></g>
      {[60, 128, 196].map((x, i) => <KbXaridor key={i} x={x} i={i} />)}
      <KbDokon x={372} y={28} w={176} />
    </g>}
    {b === 2 && <g>
      <rect x="0" y="0" width="560" height="210" fill="#EEF0F7" />
      <KbDokon x={110} y={10} w={340} chiqdi matn />
      <g className="kb-vaqt">
        <line x1="110" y1="176" x2="450" y2="176" stroke="#CFC8E6" strokeWidth="3" strokeLinecap="round" />
        <line className="kb-chiz" x1="140" y1="176" x2="420" y2="176" stroke="#C2362B" strokeWidth="3.5" strokeLinecap="round" pathLength="1" />
        <circle cx="140" cy="176" r="6" fill="#C2362B" />
        <circle className="kb-oxir" cx="420" cy="176" r="6" fill="#C2362B" />
        <text className="kb-vt" x="140" y="200" textAnchor="middle">{tr({ uz: 'dekabr 2020', ru: 'декабрь 2020' })}</text>
        <text className="kb-vt kb-oxir" x="420" y="200" textAnchor="middle">{tr({ uz: 'qariyb yarim yil', ru: 'почти полгода' })}</text>
      </g>
    </g>}
  </svg>
);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [xulosaVaqt, setXulosaVaqt] = useState(!!storedAnswer);
  const keyin = useKeyin();
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!done || xulosaVaqt) return undefined; keyin(() => setXulosaVaqt(true), 1800); return undefined; }, [done, xulosaVaqt]); // eslint-disable-line
  const bq = KIBR_BOSQICH[b];
  const kutish = b === 1 && !taxmin;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  const tanla = (k) => { if (taxmin) return; setTaxmin(k); keyin(() => setB(2), 700); };
  const tx = KB_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Kibr /> · {b + 1}/3</>;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish || b === 1 || (done && !xulosaVaqt)} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Kibr /> chiqqach <A>nima bo'ldi?</A></>, ru: <>Что случилось, <A>когда вышла</A> <Kibr />?</> })}
        nuqtalar={<>
          <Mentor key={`m${b}`}>{tr(bq.m)}</Mentor>
          <div className="pa-nuq"><span className="pa-nuq-l">{yorliq}</span>{KIBR_BOSQICH.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="pa-voqea">
          {b === 0 && <p className="pa-tanish"><Kibr /> — {tr({ uz: "kompyuter va konsol uchun o'yin; konsol — o'yin uchun alohida qurilma (masalan, PlayStation).", ru: 'игра для компьютера и консоли; консоль — отдельное устройство для игр (например, PlayStation).' })}</p>}
          <span className="pa-voqea-h" key={`h${b}`}>{tr(bq.h)}</span>
          <Zoomable><div className="pa-kb-w"><KibrSahna b={b} /></div></Zoomable>
          {b === 1 && !taxmin && <div className="pa-bash">
            <p className="pa-tanish">{tr({ uz: "Sony — PlayStation konsolini chiqaradigan kompaniya, PlayStation Store — shu konsolning o'yin do'koni.", ru: 'Sony — компания, выпускающая консоль PlayStation, PlayStation Store — магазин игр этой консоли.' })}</p>
            <QBashorat yorliq={yorliq} savol={tr(KB_SAVOL)} variantlar={KB_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={tanla} />
          </div>}
          {taxmin && !(done && xulosaVaqt) && <TaxminIxcham savol={tr(KB_SAVOL)} javob={tr(tx.t)} belgi={done && <b className={cxx('pa-belgi', tx.ok ? 'ok' : 'yoq')}>{tx.ok ? '✓' : '✕'}</b>} />}
          {done && xulosaVaqt && <QXulosa>{tx && <span className={cxx('pa-tx', tx.ok && 'ok')}>{tx.ok
            ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
            : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.t).toLowerCase()} <b className="yoq">✕</b> · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: 'qariyb yarim yilga', ru: 'почти на полгода' })}</b></>}</span>}
            {tr({ uz: "Bu voqeada o'yin ko'p xato bilan chiqdi. Sinov xatoni ko'pchilikka berishdan oldin ko'rishga yordam beradi.", ru: 'В этой истории игра вышла с большим числом ошибок. Тест помогает увидеть ошибку до того, как продукт получат многие.' })}</QXulosa>}
        </div>}
      >
        <MentorNote>{tr({ uz: "«Maydon Jamoa» ham avval ko'pchilikka emas, uch o'yinchiga berildi — ko'prik shu. Bankdan tashqari raqam, kompaniya nomi va voqea qo'shmang; o'yin ichidagi aniq xatolarni ham aytmang.", ru: '«Maydon Jamoa» тоже сначала дали не многим, а трём игрокам — вот мостик. Не добавляйте чисел, названий компаний и событий вне банка; конкретные ошибки внутри игры тоже не называйте.' })}</MentorNote>
      </QVoqea>
    </Stage>
  );
};

// ===== SCREEN 5 — O'Z SINOVINGIZ (QMustaqil, USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29) · artefakt pm-m9d13-sinov (tayanch 8, 9.90 — sxema aynan) =====
const SINOV_KEY = 'pm-m9d13-sinov';
const sinovOqi = () => {
  const v = lsGet(SINOV_KEY);
  return v && typeof v.vazifa === 'string' && Array.isArray(v.bajardi) && v.bajardi.length && Array.isArray(v.toxtashlar) && v.toxtashlar.length && v.eng ? v : null;
};
const XULOSA_RE = /(^|[^a-z'])(yomon|noqulay|yoqmadi|chiroyli|kerak)([^a-z']|$)/i;
const S5_QADAM = [{ uz: 'Vazifa va natija', ru: 'Задание и итог' }, { uz: "To'xtashlar", ru: 'Остановки' }, { uz: 'Birinchisi', ru: 'Первое' }];
const KEYINGI_Q = { uz: 'Keyingi qadam', ru: 'Следующий шаг' };
const XATO5 = {
  vazifa: { uz: 'Odam nimaga erishsin — shuni yozing.', ru: 'Чего человек должен добиться — напишите это.' },
  toxtash: { uz: 'Kishi qayerda, nima qildi — shuni yozing.', ru: 'Где и что сделал человек — напишите это.' },
  xulosa: { uz: 'Bu xulosa. Kishi nima qilganini yozing.', ru: 'Это вывод. Напишите, что сделал человек.' },
  birinchi: { uz: 'Bu bir kishida, vazifa bajarildi. Boshqasini ko\'rasizmi?', ru: 'Это у одного человека, задание выполнено. Посмотрите другую?' }
};
// Navbatdagi maydon klasslari (halqa — guruhda bitta)
const chK = (on) => cxx('pa-ch', on && 'pa-guruh');
const inpK = (on) => cxx('pa-inp', on && 'pa-halqa-i');
const qisqa = (s, n = 46) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
// To'xtash qatori: sanoq va «✕ vazifa to'xtadi» belgisi (vazifani bajarmagan kishida bo'lgan bo'lsa)
const toxBelgi = (t, bajardi) => t.kishilar.some(k => bajardi[k - 1] === false);
const saralash = (toxtashlar, bajardi) => [...toxtashlar].sort((a, b) => (b.kishilar.length - a.kishilar.length) || (Number(toxBelgi(b, bajardi)) - Number(toxBelgi(a, bajardi))));
// Saqlangan sinov kartasi (199): vazifa · «Vazifani bajardi: N / M» · sanoq · ★ Birinchi; har qatorda ✎
const SinovKarta = ({ s, onEd, mentorMisol }) => {
  const M = s.bajardi.length, bj = s.bajardi.filter(Boolean).length;
  const ro = [s.toxtashlar.find(t => t.id === s.eng), ...saralash(s.toxtashlar.filter(t => t.id !== s.eng), s.bajardi)].filter(Boolean);
  return (
    <div className="pa-sk fade-up">
      <div className="pa-sk-h">
        <span className="pa-sk-l">{mentorMisol ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : tr({ uz: 'Sinov yozuvingiz', ru: 'Ваша запись теста' })}{s.tur === 'mashq' && <i className="pa-sk-tur">{tr({ uz: 'mashq', ru: 'упражнение' })}</i>}</span>
        <p className="pa-sk-v">{tr(VAZIFA_T)}: «{s.vazifa}»</p>
        <b className="pa-sk-bj">{tr({ uz: 'Vazifani bajardi', ru: 'Выполнили задание' })}: {bj} / {M}</b>
      </div>
      <ol className="pa-sk-ro">{ro.map(t => (
        <li key={t.id} className={cxx('pa-sk-q', t.id === s.eng && 'birinchi')}>
          <span className="pa-sk-t">{t.matn}{toxBelgi(t, s.bajardi) && <i className="pa-x">✕ {tr({ uz: "vazifa to'xtadi", ru: 'задание остановилось' })}</i>}</span>
          <b className="pa-sk-n">{t.kishilar.length} / {M}</b>
          <i className={cxx('pa-nv', t.id === s.eng ? 'birinchi' : 'keyin')}>{tr(t.id === s.eng ? NAVBAT_T.birinchi : NAVBAT_T.keyin)}</i>
          {onEd && <button type="button" className="pa-ed" aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })} onClick={() => onEd(t.id)}>✎</button>}
        </li>
      ))}</ol>
    </div>
  );
};
const MENTOR_SINOV = {
  vazifa: tr(SINOV_MAYDON.vazifa), tur: 'real', bajardi: SINOV_MAYDON.yozuvlar.map(y => y.bajardi),
  toxtashlar: sanoqQator(3).map(r => ({ id: r.id, matn: tr(r.nom), kishilar: r.kishilar })), eng: 'topish', tuzatildi: true, qaytaSinov: { natija: 'toxtamadi', kim: 'yangi' }
};
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [saqlangan, setSaqlangan] = useState(sinovOqi);
  const s0 = saqlangan;
  const [qadam, setQadam] = useState(s0 ? 3 : 0);
  const [vazifa, setVazifa] = useState(s0 ? s0.vazifa : '');
  const [tur, setTur] = useState(s0 ? s0.tur : null);
  const [soni, setSoni] = useState(s0 ? s0.bajardi.length : null);
  const [bajardi, setBajardi] = useState(s0 ? s0.bajardi : []);
  const [tox, setTox] = useState(s0 ? s0.toxtashlar : []);
  const [joriy, setJoriy] = useState({ matn: '', kishilar: [] });
  const [tahrir, setTahrir] = useState(null);
  const [eng, setEng] = useState(s0 ? s0.eng : null);
  const [xato, setXato] = useState(null);
  const [maslahat, setMaslahat] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [yangi, setYangi] = useState(null);
  const [kartaK, setKartaK] = useState(0);
  const kartaRef = useRef(null);
  const idRef = useRef(1 + (s0 ? s0.toxtashlar.length : 0));
  const uch = useUchish();
  const saqlandi = qadam >= 3;
  useEffect(() => { if (yangi === null) return undefined; const t = setTimeout(() => setYangi(null), 1300); return () => clearTimeout(t); }, [yangi]);
  const turT = (k) => (k === 'real' ? { uz: 'Ha', ru: 'Да' } : { uz: "Yo'q, sinfdosh — mashq", ru: 'Нет, одноклассник — упражнение' });
  const soniTanla = (k) => { setSoni(k); setBajardi(b => Array.from({ length: k }, (_, i) => (b[i] === undefined ? null : b[i]))); if (k === 1) setJoriy(j => ({ ...j, kishilar: [1] })); };
  const bajardiTanla = (i, v) => setBajardi(b => b.map((x, k) => (k === i ? v : x)));
  const tayyor1 = !!(vazifa.trim() && tur && soni && bajardi.length === soni && bajardi.every(x => x !== null));
  const keyingi1 = () => {
    if (!vazifa.trim()) { setXato({ k: 'vazifa', kk: Date.now() }); return; }
    if (!tayyor1) return;
    setXato(null); uch(kartaRef.current, 's5-vazifa', 560); setQadam(1); setKartaK(k => k + 1);
    if (soni === 1) setJoriy({ matn: '', kishilar: [1] });
  };
  const kishiBos = (k) => setJoriy(j => ({ ...j, kishilar: j.kishilar.includes(k) ? j.kishilar.filter(x => x !== k) : [...j.kishilar, k].sort() }));
  const qosh = () => {
    const m = joriy.matn.trim();
    if (!m) { setXato({ k: 'toxtash', kk: Date.now() }); return; }
    if (!joriy.kishilar.length) return;
    setXato(null);
    const id = tahrir || ('t' + idRef.current++);
    const yangiT = { id, matn: m, kishilar: [...joriy.kishilar] };
    const ro = tahrir ? tox.map(t => (t.id === tahrir ? yangiT : t)) : [...tox, yangiT];
    uch(kartaRef.current, 's5-' + id, 600);
    setTox(ro); setYangi(id); setTahrir(null);
    setMaslahat(XULOSA_RE.test(m) ? id : (maslahat === id ? null : maslahat));
    setJoriy({ matn: '', kishilar: soni === 1 ? [1] : [] }); setKartaK(k => k + 1);
  };
  const edTox = (id) => { const t = tox.find(x => x.id === id); if (!t) return; setTahrir(id); setJoriy({ matn: t.matn, kishilar: [...t.kishilar] }); setQadam(1); setXato(null); setKartaK(k => k + 1); };
  const keyingi2 = () => { if (!tox.length) return; if (tahrir) { setTahrir(null); setJoriy({ matn: '', kishilar: soni === 1 ? [1] : [] }); } if (eng && !tox.some(t => t.id === eng)) setEng(null); setXato(null); setQadam(2); setKartaK(k => k + 1); };
  const engTanla = (id) => { uch(document.querySelector(`.lesson-root [data-sq="${id}"]`), 's5-eng', 560); setEng(id); };
  const saralangan = soni ? saralash(tox, bajardi) : [];
  const engT = tox.find(t => t.id === eng);
  const maxSon = Math.max(0, ...tox.map(t => t.kishilar.length));
  const engMaslahat = engT && engT.kishilar.length === 1 && !toxBelgi(engT, bajardi) && tox.some(t => t.id !== eng && (t.kishilar.length > 1 || toxBelgi(t, bajardi))) && maxSon >= 1;
  const saqla = () => {
    if (!engT) return;
    const eski = lsGet(SINOV_KEY);
    const saqlash = eski && eski.eng === eng;
    const v = { vazifa: vazifa.trim(), tur, bajardi: bajardi.map(Boolean), toxtashlar: tox.map(t => ({ id: t.id, matn: t.matn, kishilar: t.kishilar })), eng, tuzatildi: saqlash ? !!eski.tuzatildi : false, qaytaSinov: saqlash ? (eski.qaytaSinov || null) : null, savedAt: Date.now() };
    lsSet(SINOV_KEY, v); setSaqlangan(v); setQadam(3); setYordam(false);
    if (storedAnswer === undefined) {
      onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, practice: 'sinov', correct: true, picked: true, solved: true, kishilar: v.bajardi.length });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'sinov', 0, true, 0);
    }
  };
  const ochSaqlangan = (id) => { setTahrir(null); edTox(id); };
  // Navbatdagi joy (SABOQ 11/32): birinchi bo'sh maydon halqada — guruhda bitta
  const nav1 = !vazifa.trim() ? 'vazifa' : !tur ? 'tur' : !soni ? 'soni' : bajardi.findIndex(x => x === null) >= 0 ? 'b' + bajardi.findIndex(x => x === null) : 'keyingi';
  const nav2 = !joriy.matn.trim() ? (tox.length && !tahrir ? 'keyingi' : 'matn') : !joriy.kishilar.length ? 'kishi' : 'qosh';
  const ustChiziq = qadam >= 1 && qadam < 3 && <div className="pa-uc fade-step">
    <div className="pa-uc-v" data-uch="s5-vazifa"><span>{tr(VAZIFA_T)}: «{qisqa(vazifa.trim(), 60)}»</span><b>{tr({ uz: 'Vazifani bajardi', ru: 'Выполнили задание' })}: {bajardi.filter(Boolean).length} / {soni}</b></div>
    {qadam === 1 && tox.map(t => (
      <div key={t.id} className={cxx('pa-uc-q', yangi === t.id && 'yangi', tahrir === t.id && 'joriy')} data-uch={'s5-' + t.id}>
        <span className="pa-uc-t">{qisqa(t.matn)}</span><b>{t.kishilar.length} / {soni}</b>
        {qadam === 1 && <button type="button" className="pa-yi-ed" aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })} onClick={() => edTox(t.id)}>✎</button>}
      </div>
    ))}
    {maslahat && tox.some(t => t.id === maslahat) && qadam === 1 && <QIzoh>{tr(XATO5.xulosa)}</QIzoh>}
  </div>;
  const yordamB = <QTugma ikkinchi className="pa-yordam-b" aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>;
  const yordamM = yordam && <QIzoh>{tr({ uz: "Mentor misolida «Shanba 18:00 dagi o'yinni topishda to'xtadi» — 1, 2 va 3-o'yinchida: bitta qator, uch kishi belgilangan, «3 / 3». Bir kishi sinagan bo'lsa — vazifani to'xtatgan to'xtashdan boshlang.", ru: 'В примере Ментора «Застрял, ища игру в субботу в 18:00» — у игроков 1, 2 и 3: одна строка, отмечены три человека, «3 / 3». Если тестировал один человек — начните с остановки, которая остановила задание.' })}</QIzoh>;
  const forma = !isMentor && !saqlandi && <div className="pa-mk" key={kartaK} ref={kartaRef}>
    {qadam === 0 && <>
      <label className="pa-mk-q"><span className="pa-mk-l">{tr({ uz: 'Sinov vazifasi', ru: 'Задание теста' })}</span>
        <input className={inpK(nav1 === 'vazifa')} value={vazifa} placeholder={tr({ uz: 'Odam nimaga erishsin?', ru: 'Чего должен добиться человек?' })} onChange={e => { setVazifa(e.target.value); if (xato) setXato(null); }} /></label>
      {xato && xato.k === 'vazifa' && <QXato key={xato.kk}>{tr(XATO5.vazifa)}</QXato>}
      <div className="pa-mk-q qator"><span className="pa-mk-l">{tr({ uz: 'Sinaganlar auditoriyangizdanmi?', ru: 'Тестировавшие — из вашей аудитории?' })}</span>
        <div className={chK(nav1 === 'tur')} data-k="tur">{['real', 'mashq'].map(k => <QChip key={k} holat={tur === k ? 'on' : undefined} onClick={() => setTur(k)}>{tr(turT(k))}</QChip>)}</div></div>
      <div className="pa-mk-q qator"><span className="pa-mk-l">{tr({ uz: 'Nechta kishi sinadi?', ru: 'Сколько человек тестировали?' })}</span>
        <div className={chK(nav1 === 'soni')} data-k="soni">{[1, 2, 3].map(k => <QChip key={k} holat={soni === k ? 'on' : undefined} onClick={() => soniTanla(k)}>{k}</QChip>)}</div></div>
      {soni && bajardi.map((v, i) => (i === 0 || bajardi[i - 1] !== null) && (
        <div key={i} className="pa-mk-q qator pa-mk-b fade-step"><span className="pa-mk-l"><i className="pa-kishi">{KISHI(i + 1)}</i>{tr({ uz: 'Vazifani bajardimi?', ru: 'Выполнил задание?' })}</span>
          <div className={chK(nav1 === 'b' + i)} data-k={'b' + i}>{[true, false].map(x => <QChip key={String(x)} holat={v === x ? 'on' : undefined} onClick={() => bajardiTanla(i, x)}>{tr(x ? { uz: 'Ha', ru: 'Да' } : { uz: "Yo'q", ru: 'Нет' })}</QChip>)}</div></div>
      ))}
      {yordamM}
      <div className="pa-mk-amal">{yordamB}<QTugma className={halqa(nav1 === 'keyingi')} disabled={!tayyor1 && !!vazifa.trim()} onClick={keyingi1}>{tr(KEYINGI_Q)}</QTugma></div>
    </>}
    {qadam === 1 && <>
      {(tox.length < 5 || tahrir) && <>
        <label className="pa-mk-q"><span className="pa-mk-l">{tr({ uz: "To'xtash", ru: 'Остановка' })}</span>
          <input className={inpK(nav2 === 'matn')} value={joriy.matn} placeholder={tr({ uz: 'Qayerda, nima qildi?', ru: 'Где, что сделал?' })} onChange={e => { const v = e.target.value; setJoriy(j => ({ ...j, matn: v })); if (xato) setXato(null); }} onKeyDown={e => { if (e.key === 'Enter') qosh(); }} /></label>
        {xato && xato.k === 'toxtash' && <QXato key={xato.kk}>{tr(XATO5.toxtash)}</QXato>}
        <div className="pa-mk-q qator"><span className="pa-mk-l">{tr({ uz: 'Kimda bo\'ldi?', ru: 'У кого было?' })}</span>
          <div className={chK(nav2 === 'kishi')} data-k="kishi">{Array.from({ length: soni || 1 }, (_, i) => i + 1).map(k => <QChip key={k} holat={joriy.kishilar.includes(k) ? 'on' : undefined} onClick={() => kishiBos(k)}>{KISHI(k)}</QChip>)}</div></div>
      </>}
      {yordamM}
      <div className="pa-mk-amal">{yordamB}
        {tox.length > 0 && !tahrir && <QTugma ikkinchi={nav2 !== 'keyingi'} className={halqa(nav2 === 'keyingi')} onClick={keyingi2}>{tr(KEYINGI_Q)}</QTugma>}
        {(tox.length < 5 || tahrir) && <QTugma ikkinchi={nav2 === 'keyingi'} className={halqa(nav2 === 'qosh')} disabled={!joriy.kishilar.length} onClick={qosh}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</QTugma>}
      </div>
    </>}
    {qadam === 2 && <>
      <p className="pa-mk-izoh">{tr({ uz: "Tepada — ko'p uchragani; birinchisini o'zingiz tanlaysiz: bitta kishini butunlay to'xtatgan to'xtash ham muhim bo'lishi mumkin.", ru: 'Наверху — самая частая; первую выбираете сами: остановка, которая полностью остановила одного человека, тоже может быть важной.' })}</p>
      <div className={cxx('pa-uya', engT && 'tola')} data-uch="s5-eng">
        <span className="pa-uya-l">{tr(NAVBAT_T.birinchi)}</span>
        {engT && <span className="pa-uya-t">{engT.matn} · <b>{engT.kishilar.length} / {soni}</b></span>}
      </div>
      {engT && <span className="pa-keyin-l">{tr(NAVBAT_T.keyin)}</span>}
      <ol className={cxx('pa-sr', !engT && 'pa-guruh')}>{saralangan.filter(t => t.id !== eng).map(t => (
        <li key={t.id}><button type="button" className={cxx('pa-sq', engT && 'keyin')} data-sq={t.id} onClick={() => engTanla(t.id)}>
          <span className="pa-sq-t">{t.matn}{toxBelgi(t, bajardi) && <i className="pa-x">✕ {tr({ uz: "vazifa to'xtadi", ru: 'задание остановилось' })}</i>}</span><b>{t.kishilar.length} / {soni}</b>
        </button></li>
      ))}</ol>
      {engMaslahat && <QIzoh>{tr(XATO5.birinchi)}</QIzoh>}
      {yordamM}
      <div className="pa-mk-amal">{yordamB}<QTugma ikkinchi onClick={() => { setQadam(1); setKartaK(k => k + 1); }}>{tr({ uz: 'Orqaga', ru: 'Назад' })}</QTugma><QTugma className={halqa(!!engT)} disabled={!engT} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma></div>
    </>}
  </div>;
  const mentor5 = saqlandi && !isMentor
    ? { uz: "Sanog'ingiz saqlandi — «Davom etish»ni bosing.", ru: 'Ваш счёт сохранён — нажмите «Davom etish».' }
    : { uz: 'Yozuvlaringizni kishi bo\'yicha kiriting — sanoq o\'zi chiqadi, birinchisini o\'zingiz tanlaysiz.', ru: 'Вводите записи по людям — счёт появится сам, первое выберете сами.' };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qadam * 10 + tox.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!saqlandi && !isMentor} label={saqlandi || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Yozuvlarni kiriting', ru: 'Введите записи' })} onClick={onNext} /></>}>
      <div className="pa-s5"><QMustaqil
        sarlavha={tr({ uz: <>Sizning sinovingizda <A>qaysi to'xtash birinchi?</A></>, ru: <>Какая остановка <A>первая в вашем тесте?</A></> })}
        mentor={<Mentor key={saqlandi ? 'h' : 'f'}>{tr(mentor5)}</Mentor>}
        qadamlar={<>
          {!isMentor && !saqlandi && qadam === 0 && <p className="pa-kirish5">{tr({ uz: "Uyda sinov o'tkazmagan bo'lsangiz — dars boshidagi sinfdosh sinovi yozuvini kiriting.", ru: 'Если вы не проводили тест дома — введите запись теста с одноклассником из начала урока.' })}</p>}
          {!isMentor && !saqlandi && <QQadamlar qadamlar={S5_QADAM.map(tr)} joriy={qadam} />}
          {ustChiziq}
        </>}
        forma={isMentor ? <SinovKarta s={MENTOR_SINOV} mentorMisol /> : saqlandi ? <SinovKarta s={saqlangan} onEd={ochSaqlangan} /> : forma}
      >
        {saqlandi && !isMentor && <QXulosa>{tr({ uz: 'Sinov yozuvingiz sanaldi: birinchisi tanlandi, qolgani «Keyin» ro\'yxatida.', ru: 'Ваша запись теста посчитана: первая выбрана, остальные — в списке «Потом».' })}</QXulosa>}
      </QMustaqil></div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — ish qilingan joyda; A1, A2 — bonus (P-048: ish bajarilgan); medal belgisi — o'yin qatlami =====
const ACHIEVEMENTS = {
  repeatSpotter: { icon: '🔁', name: 'Repeat Spotter!', desc: { uz: "Uchala yozuvda takrorlangan to'xtashni birinchi urinishda tanladingiz", ru: 'С первой попытки выбрали остановку, повторившуюся во всех трёх записях' } },
  twoQuestions: { icon: '⚖️', name: 'Two Questions!', desc: { uz: "Ikki savol bilan birinchi tuzatiladigan to'xtashni topdingiz", ru: 'По двум вопросам нашли остановку, которую исправляют первой' } },
  fixShipped: { icon: '🛠️', name: 'Fix Shipped!', desc: { uz: "Sinovdagi birinchi to'xtashni o'z ilovangizda tuzatdingiz", ru: 'Исправили первую остановку из теста в своём приложении' } },
  retestDone: { icon: '🔍', name: 'Retest Done!', desc: { uz: 'Tuzatishni yangi odam bilan qayta sinadingiz', ru: 'Повторно проверили исправление с новым человеком' } }
};
// Ekran id → nishon (onAnswer correct: true bo'lganda; s2 — birinchi tanlov, s3 — birinchi urinish)
const ACH_TRIGGERS = { s2: 'repeatSpotter', s3: 'twoQuestions', a1: 'fixShipped', a2: 'retestDone' };


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


// Podium savol yorliqlari (SCORED_IDX: 3, 8)
const Q_LABELS = {
  3: { uz: '1 — Birinchi qaysi', ru: '1 — Что первым' },
  8: { uz: '2 — Bitta qayta sinov', ru: '2 — Один повторный тест' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; nom va fayl o'zgarmaydi; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'sinov', ru: 'тест' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "to'xtash", ru: 'остановка' }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'sanoq', ru: 'счёт' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'kuzatuv yozuvi', ru: 'запись наблюдения' }, l: 70, t: 68, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'qayta sinov', ru: 'повторный тест' }, l: 42, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: '«Keyin»', ru: '«Потом»' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: '3 / 3', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: 'SINOV.md', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: 'Cyberpunk 2077', l: 48, t: 48, s: 20, d: 24, dl: 3.4 },
  { ch: 'PlayStation Store', l: 12, t: 52, s: 18, d: 22, dl: 0.6 },
  { ch: 'Maydon Jamoa', l: 76, t: 44, s: 20, d: 26, dl: 2.6 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (MD; har biri 3 marta)
const QUIZ_BANK = [
  { q: { uz: 'Sinovda siz nima qilasiz?', ru: 'Что вы делаете во время теста?' }, opts: [{ uz: 'Vazifa berib, kishini jim kuzatasiz', ru: 'Даёте задание и молча наблюдаете' }, { uz: "Ilovani o'zingiz ochib ko'rsatasiz", ru: 'Сами открываете и показываете приложение' }, { uz: "Kishidan ilova yoqdimi, deb so'raysiz", ru: 'Спрашиваете, понравилось ли приложение' }, { uz: 'Har tugmani bittalab tushuntirasiz', ru: 'Объясняете каждую кнопку по очереди' }], correct: 0 },
  { q: { uz: 'Sanoqda «3 / 3» turibdi. Bu nimani bildiradi?', ru: 'В счёте стоит «3 / 3». Что это значит?' }, opts: [{ uz: 'Tugma uch marta qayta bosilganini', ru: 'Что кнопку нажали три раза' }, { uz: "Uchala kishi shu joyda to'xtaganini", ru: 'Что все трое застряли в этом месте' }, { uz: 'Sinovga uch daqiqa vaqt ketganini', ru: 'Что тест занял три минуты' }, { uz: "Uch ekranda bir xil to'xtash borligini", ru: 'Что одна остановка есть на трёх экранах' }], correct: 1 },
  { q: { uz: 'Kuzatuv yozuviga qaysi qator tushadi?', ru: 'Какая строка попадает в запись наблюдения?' }, opts: [{ uz: "0:40 · Ro'yxat juda noqulay ekan", ru: '0:40 · Список очень неудобный' }, { uz: "0:40 · Hamma kishi buni yoqtirmaydi", ru: '0:40 · Это никому не нравится' }, { uz: "0:40 · Pastga surib, o'yinni topdi", ru: '0:40 · Прокрутил вниз, нашёл игру' }, { uz: "0:40 · Tugma kichikroq bo'lsa kerak", ru: '0:40 · Кнопка, наверное, маловата' }], correct: 2 },
  { q: { uz: 'Yozuvda «Vazifani bajardi: 2 / 3». Bu nimani bildiradi?', ru: 'В записи «Выполнили задание: 2 / 3». Что это значит?' }, opts: [{ uz: 'Ikki kishi ilovani ikki marta ochgan', ru: 'Двое открыли приложение дважды' }, { uz: "Ilovaning uchdan ikki qismi tayyor", ru: 'Две трети приложения готовы' }, { uz: "Ikki to'xtash uch kishida takrorlangan", ru: 'Две остановки повторились у троих' }, { uz: 'Uch kishidan biri natijaga yetmagan', ru: 'Один из трёх не дошёл до результата' }], correct: 3 },
  { q: { uz: 'Cyberpunk 2077 o\'yini qanday sotuvga chiqdi?', ru: 'Как игра Cyberpunk 2077 вышла в продажу?' }, opts: [{ uz: "Ko'p xato bilan sotuvga chiqarildi", ru: 'Вышла в продажу с массой ошибок' }, { uz: "Xatosiz, to'liq tayyor holda chiqdi", ru: 'Вышла без ошибок, полностью готовой' }, { uz: 'Faqat kompyuter uchun chiqarildi', ru: 'Вышла только для компьютера' }, { uz: 'Faqat bepul sinov sifatida chiqdi', ru: 'Вышла только как бесплатная проба' }], correct: 0 },
  { q: { uz: 'Sony Cyberpunk 2077 ni nima qildi?', ru: 'Что Sony сделала с Cyberpunk 2077?' }, opts: [{ uz: 'Narxini tushirib, sotuvda qoldirdi', ru: 'Снизила цену и оставила в продаже' }, { uz: "Do'konidan qariyb yarim yilga oldi", ru: 'Убрала из магазина почти на полгода' }, { uz: 'Uni yangi nom bilan qayta chiqardi', ru: 'Выпустила заново под новым именем' }, { uz: "Xaridorlarga yangi o'yin sovg'a qildi", ru: 'Подарила покупателям новую игру' }], correct: 1 },
  { q: { uz: "Birinchi tuzatiladigan to'xtash qanday bo'ladi?", ru: 'Какой бывает остановка, которую исправляют первой?' }, opts: [{ uz: 'Eng oson, bir qator bilan tuzatiladigan', ru: 'Самая лёгкая, исправляется одной строкой' }, { uz: 'Vazifa oxirida, sinov tugashida yozilgan', ru: 'Записана в конце задания, когда тест закончился' }, { uz: "Ko'p kishida, vazifaga to'siq bo'lgan", ru: 'У многих, и мешала заданию' }, { uz: "Ekranning eng pastida, ko'rinmay turgan", ru: 'В самом низу экрана, её не видно' }], correct: 2 },
  { q: { uz: "Qayta sinovni kim bilan o'tkazgan ma'qul?", ru: 'С кем лучше провести повторный тест?' }, opts: [{ uz: "O'zingiz — ilovani yaxshi bilasiz", ru: 'Сами — вы хорошо знаете приложение' }, { uz: "O'sha kishi bilan — u yo'lni biladi", ru: 'С тем же человеком — он знает путь' }, { uz: 'Agent bilan — u kodni tekshiradi', ru: 'С агентом — он проверит код' }, { uz: "Ilovani ko'rmagan yangi odam bilan", ru: 'С новым человеком, не видевшим приложение' }], correct: 3 },
  { q: { uz: 'Agent «tuzatdim» dedi. Avval nimaga qaraysiz?', ru: 'Агент сказал «исправил». Куда посмотрите сначала?' }, opts: [{ uz: "Fayldagi o'zgarishga va telefonga", ru: 'На изменение в файле и на телефон' }, { uz: 'Agent yozgan hisobotning o\'ziga', ru: 'На сам отчёт агента' }, { uz: 'Talabda yozilgan birinchi qatorga', ru: 'На первую строку требования' }, { uz: 'Terminalda chiqqan oxirgi xabarga', ru: 'На последнее сообщение в терминале' }], correct: 0 },
  { q: { uz: "Uch to'xtashdan nechtasi shu darsda tuzatiladi?", ru: 'Сколько из трёх остановок исправляют на этом уроке?' }, opts: [{ uz: 'Uchalasi — bitta prompt bilan birga', ru: 'Все три — одним промптом' }, { uz: "Bittasi — qolgani «Keyin» ro'yxatida", ru: 'Одну — остальные в списке «Потом»' }, { uz: 'Ikkitasi — eng oson tuzatiladiganlari', ru: 'Две — те, что исправить проще' }, { uz: 'Hech biri — avval yana sinov kerak', ru: 'Ни одной — сначала нужен ещё тест' }], correct: 1 },
  { q: { uz: "Nega sinov ko'pchilikka berishdan oldin o'tkaziladi?", ru: 'Почему тест проводят до того, как дать продукт многим?' }, opts: [{ uz: "Ilovani tezroq do'konga chiqarish uchun", ru: 'Чтобы быстрее выпустить приложение в магазин' }, { uz: 'Agentga kamroq talab yozib berish uchun', ru: 'Чтобы писать агенту меньше требований' }, { uz: "Xatoni ko'pchilikdan oldin ko'rish uchun", ru: 'Чтобы увидеть ошибку раньше многих' }, { uz: 'Reklama uchun birinchi fikrni olish uchun', ru: 'Чтобы получить первый отзыв для рекламы' }], correct: 2 },
  { q: { uz: 'Talabning «Nima qilsin» qatoriga nima yoziladi?', ru: 'Что пишут в строку требования «Что сделать»?' }, opts: [{ uz: "Kishi aytgan shikoyatning aynan o'zi", ru: 'Жалобу человека слово в слово' }, { uz: 'Butun ekranni noldan qayta qurish', ru: 'Перестроить весь экран с нуля' }, { uz: "To'xtagan kishilar soni va vaqti", ru: 'Число застрявших и время' }, { uz: 'Ilova qiladigan bitta aniq o\'zgarish', ru: 'Одно точное изменение, которое сделает приложение' }], correct: 3 },
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4; tayanch 4, 9.1) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, bandlar?, prompt?, namuna?, osti?, yordam?, err? }] · natija (kutilgan natija · namuna: Maydon Jamoa).
// Prompt: QPrompt ko'rinishi (q-prompt klasslari) + {…} joyi yonida kulrang «masalan: …» — qolipda bu maydon yo'q (qolip taklifi), shu faylda PaPrompt.
// Talab zinapoyasi (tayanch 4): A1 — tayyor talab + bitta joy · A2 — bitta qator; qolgan joylar pm-m9d13-sinov dan oldindan to'ldiriladi (9.12 naqshi). Trek — pm-m9d8-platforma (kalit yo'q — ikkala qator).
const tx = (x) => fmtCode(tr(x));
const trekOqi = () => { const o = lsGet('pm-m9d8-platforma'); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
// Satr bo'laklari: matn (ichida {joy} va `kod`) yoki { v, j } — v bo'lsa sanog'ingizdan to'ldirilgan qiymat, yo'q bo'lsa joy j
const satrQism = (t, nm, korildi, k) => String(t).split(/(\{[^}]+\}|`[^`]+`)/g).map((p, i) => {
  if (/^\{.+\}$/.test(p)) { const yangi = !!nm[p] && !korildi.has(p); if (yangi) korildi.add(p); return <React.Fragment key={k + '-' + i}><span className="q-joy">{p}</span>{yangi && <span className="pa-joy-n">{tx(nm[p])}</span>}</React.Fragment>; }
  if (/^`.+`$/.test(p)) return <code key={k + '-' + i} className="qcode">{p.slice(1, -1)}</code>;
  return p;
});
const PaPrompt = ({ satrlar, namuna = {} }) => {
  const [ok, setOk] = useState(false);
  const nm = {}; Object.entries(namuna).forEach(([j, n]) => { nm[j] = n; });
  const korildi = new Set();
  const matn = satrlar.map(l => l.map(b => (typeof b === 'object' && b && !React.isValidElement(b) && 'j' in b ? (b.v !== null && b.v !== undefined && b.v !== '' ? String(b.v) : b.j) : tr(b))).join(''));
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt pa-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {satrlar.map((l, i) => <span key={i} className="pa-ps">{l.map((b, k) => (typeof b === 'object' && b && !React.isValidElement(b) && 'j' in b
        ? (b.v !== null && b.v !== undefined && b.v !== '' ? <span key={k} className="pa-tol">{String(b.v)}</span> : <span key={k} className="q-joy">{b.j}</span>)
        : <React.Fragment key={k}>{satrQism(tr(b), nm, korildi, i + '-' + k)}</React.Fragment>))}</span>)}
    </span>
  );
};
const Yordam = ({ satrlar }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <>
      <QTugma ikkinchi className="pa-yordam-b" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
      {ochiq && <span className="pa-yordam fade-step">{satrlar.map((l, i) => <span key={i} className="pa-yordam-s">{tx(l)}</span>)}</span>}
    </>
  );
};
const ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m11-dars-13-done'];
const Ortda = () => (
  <p className="pa-ortda">{tr({ uz: 'Ortda qoldingizmi — Mentor misolini alohida papkada oching:', ru: 'Отстали — откройте пример Ментора в отдельной папке:' })} {ORTDA.map((b, i) => <React.Fragment key={i}>{i > 0 && ' · '}<code className="pa-buyruq">{b}</code></React.Fragment>)} — {tr({ uz: "qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.", ru: 'увидите, как это работает, и повторите шаг в своём репо по образцу.' })}</p>
);
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' }; // S3 (F-1006-287): 14-dars naqshi
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, onDone, kutish, eslatma }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const bajardim = () => {
    if (isMentorLive || done || (kutish && kutish(stepN))) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length) {
      if (onDone) onDone();
      if (!avval) {
        onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true });
        if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
      }
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt) «Bajardim»i bilan birga ko'rinsin
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  const qulf = !done && !isMentorLive && kutish && kutish(stepN);
  // SABOQ 8 / S3 (F-1006-287, 14-dars naqshi): Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${tr(steps[stepN].h)}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${tr(steps[stepN].h)}»: выполните и нажмите «Bajardim».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cxx('pa-blok', qulf && 'pa-qulf')}>
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({
            h: tr(c.h),
            t: <>{tx(c.t)}{c.bandlar && c.bandlar.filter(Boolean).map((b, i) => <span key={i} className="pa-band">{React.isValidElement(b) ? b : tx(b)}</span>)}{c.prompt && <PaPrompt satrlar={c.prompt} namuna={c.namuna} />}{c.osti && <span className="pa-band">{tx(c.osti)}</span>}</>,
            xato: c.yordam ? <Yordam satrlar={c.yordam} /> : (c.err && tx(c.err))
          }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={tx(typeof doneText === 'function' ? doneText() : doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<MentorPracticeStats live={_live} screen={screen} />}>
          {ortda && <Ortda />}
          {eslatma && <MentorNote>{tr(eslatma)}</MentorNote>}
        </QBlok>
      </div>
    </Stage>
  );
}
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const QADAM = { ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, ishga: { uz: 'Ishga tushirish', ru: 'Запуск' }, telefon: { uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }, qayta: { uz: 'Qayta sinov', ru: 'Повторный тест' } };
const XATO_GAP = { uz: "Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка — отправьте агенту строку ошибки (не значения `.env` и не токен): «Вышла такая ошибка: {ошибка}. Исправь.»' };
// pm-m9d13-sinov dan qiymatlar (yo'q bo'lsa — joylar {…} qoladi)
const sinovQiymat = (s) => {
  if (!s) return { eng: null, M: null, son: null, bj: null, vazifa: null, royxat: null };
  const e = s.toxtashlar.find(t => t.id === s.eng);
  const M = s.bajardi.length;
  return { eng: e ? e.matn : null, M, son: e ? e.kishilar.length : null, bj: s.bajardi.filter(Boolean).length, vazifa: s.vazifa, royxat: saralash(s.toxtashlar, s.bajardi).map(t => `«${t.matn}» — ${t.kishilar.length} / ${M}`).join('; ') };
};
const sinovYoz = (f) => { const s = sinovOqi(); if (s) lsSet(SINOV_KEY, { ...s, ...f, savedAt: Date.now() }); };

// ===== AMALIYOT 1 — eng muhim to'xtashni tuzatish (screens[6]; A1 — tayyor talab + bitta joy «Nima qilsin») =====
const TelTuzatish = () => {
  const [t, setT] = useState('sinovdagi');
  const keyin = useKeyin();
  useEffect(() => { keyin(() => setT('tuzatilgan'), 1100); }, []); // eslint-disable-line
  return (
    <div className="pa-a1-n">
      <Tel tartib={t} />
      <p className="pa-diff"><code>git diff</code> → <code>mobil/src/app/index.tsx</code></p>
    </div>
  );
};
const ScreenA1 = (props) => {
  const [s] = useState(sinovOqi);
  const [trek] = useState(trekOqi);
  const q = sinovQiymat(s);
  const mob = trek !== 'web', web = trek !== 'mobil';
  return (
    <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · tuzatish', ru: 'Практика 1 · исправление' }}
      title={{ uz: <>Birinchi to'xtashni <A>o'z ilovangizda</A> tuzating.</>, ru: <>Исправьте первую остановку <A>в своём приложении</A>.</> }}
      mentor={{ uz: <>Talab tayyor — faqat «Nima qilsin» qatorini o'zingiz yozasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Требование готово — сами пишете только строку «Что сделать»; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      steps={[
        { h: QADAM.ochish, t: { uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status` — o'zgargan fayl yo'q bo'lsin (12-darsdagi ish push qilingan). Bor bo'lsa — avval commit va push qiling.", ru: 'Откройте свой репо в Antigravity. В терминале `git status` — изменённых файлов быть не должно (работа 12-го урока запушена). Если есть — сначала сделайте commit и push.' } },
        { h: QADAM.prompt,
          t: s ? { uz: "«Qayerda» qatori mustaqil ishdagi sanog'ingizdan to'ldirilgan (tahrirlash mumkin). «Nima qilsin» qatorini yozing — kulrang namunaga qarang, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Строка «Где» заполнена из вашего счёта в самостоятельной работе (можно править). Напишите строку «Что сделать» — посмотрите на серый образец, нажмите «Скопировать», отправьте в Antigravity:' }
            : { uz: "«Qayerda» qatoridagi joylarni mustaqil ishdagi sanog'ingizdan to'ldiring. «Nima qilsin» qatorini yozing — kulrang namunaga qarang, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'Заполните места в строке «Где» из вашего счёта в самостоятельной работе. Напишите строку «Что сделать» — посмотрите на серый образец, нажмите «Скопировать», отправьте в Antigravity:' },
          prompt: [
            [{ uz: "Qayerda: ilovamda sinovda kishilar to'xtagan joy — «", ru: 'Где: место в моём приложении, где люди застряли на тесте — «' }, { v: q.eng, j: tr({ uz: "{birinchi to'xtash}", ru: '{первая остановка}' }) }, '» (', { v: q.M, j: tr({ uz: '{nechta kishi sinadi}', ru: '{сколько тестировали}' }) }, tr({ uz: ' kishidan ', ru: ' человек, у ' }), { v: q.son, j: tr({ uz: '{nechtasida}', ru: '{у скольких}' }) }, tr({ uz: ' tasida).', ru: ').' })],
            [{ uz: 'Nima qilsin: {nima qilsin}', ru: 'Что сделать: {что сделать}' }],
            [{ uz: "Nima buzilmasin: qolgan ekranlar avvalgidek ishlasin, Database'dagi yozuvlar o'chmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: остальные экраны работают как раньше, записи в Database не удаляются. Больше ничего не трогай, назови изменённые файлы.' }]
          ],
          namuna: { [tr({ uz: '{nima qilsin}', ru: '{что сделать}' })]: { uz: "masalan: o'yinlar kun va soat bo'yicha tartiblansin, har kun o'z sarlavhasi bilan.", ru: 'например: игры сортируются по дню и часу, у каждого дня свой заголовок.' } },
          osti: { uz: "Bitta o'zgarish yozing — butun ekranni qayta qurish emas.", ru: 'Пишите одно изменение — а не перестройку всего экрана.' },
          yordam: [
            { uz: "Qayerda: `mobil/` — «O'yinlar» ekrani (`src/app/index.tsx`). Sinovda 3 kishidan 3 tasi shu yerda to'xtadi: «Shanba 18:00 dagi o'yinni topishda to'xtadi» — e'lonlar qo'shilgan vaqti bo'yicha turibdi, kun bo'yicha emas.", ru: 'Где: `mobil/` — экран «O\'yinlar» (`src/app/index.tsx`). На тесте здесь застряли 3 из 3: «Застрял, ища игру в субботу в 18:00» — объявления стоят по времени добавления, а не по дням.' },
            { uz: "Nima qilsin: «O'yinlar» ekranida o'yinlar kun va soat bo'yicha tartiblansin, har kun o'z sarlavhasi bilan.", ru: 'Что сделать: на экране «O\'yinlar» игры сортируются по дню и часу, у каждого дня свой заголовок.' },
            { uz: "Nima buzilmasin: o'yin kartasi (soat, maydon, «8 / 10») va uni bosganda ochiladigan «O'yin» ekrani, «Qo'shilaman», «Kelaman», «E'lon berish». Backend'ga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: карточка игры (час, поле, «8 / 10») и экран «O\'yin», который открывается по нажатию, «Qo\'shilaman», «Kelaman», «E\'lon berish». Backend не трогай, назови изменённые файлы.' }
          ] },
        { h: QADAM.ishga, t: mob ? { uz: "mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching. QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`. O'zgarish telefonda ko'rinmasa — terminalda `r`.", ru: 'в мобильном треке: `npx expo start`, откройте QR на телефоне через Expo Go. Если QR не открывается — телефон и ноутбук в одной Wi-Fi? Если нет: `npx expo start --tunnel`. Если изменение не видно на телефоне — `r` в терминале.' } : { uz: 'Web-trekda: `npm run dev`.', ru: 'В веб-треке: `npm run dev`.' },
          bandlar: [
            mob && web && { uz: 'Web-trekda: `npm run dev`.', ru: 'В веб-треке: `npm run dev`.' },
            { uz: "Agentning hisobotiga emas, haqiqiy o'zgarishga qarang: `git diff` (nima o'zgargani ko'rinadi) — o'zgarish faqat to'xtash bo'lgan ekran fayllaridami.", ru: 'Смотрите не на отчёт агента, а на настоящее изменение: `git diff` (видно, что изменилось) — изменение только в файлах экрана, где была остановка?' }
          ],
          err: XATO_GAP },
        { h: QADAM.telefon, t: { uz: "sinov vazifasini o'zingiz bajaring, talabning har qatorini tekshiring:", ru: 'выполните задание теста сами, проверьте каждую строку требования:' },
          bandlar: [
            { uz: "(1) to'xtash bo'lgan joy endi qanday — «Nima qilsin» qatori bajarildimi;", ru: '(1) каково теперь место остановки — выполнена ли строка «Что сделать»;' },
            { uz: '(2) qolgan ekranlar va asosiy harakat avvalgidek ishlaydi.', ru: '(2) остальные экраны и главное действие работают как раньше.' },
            { uz: 'Mos kelmagan qatorni agentga yozing. Oxirida `git status` → har faylni `git add <fayl>` bilan → `git commit -m "13-dars: sinovdagi birinchi to\'xtash tuzatildi"` → `git push`.', ru: 'Несовпавшую строку напишите агенту. В конце `git status` → каждый файл через `git add <файл>` → `git commit -m "13-dars: sinovdagi birinchi to\'xtash tuzatildi"` → `git push`.' }
          ] }
      ]}
      natija={<TelTuzatish />}
      ortda
      eslatma={{ uz: "Tuzatish katta bo'lsa (yangi funksiya kerak bo'lsa) — o'quvchi bilan eng kichik qismini tanlang: bugun bitta o'zgarish. Web-trekda telefon tekshiruvi — push'dan keyin Netlify manzilida (10-dars A3 dagidek).", ru: 'Если исправление большое (нужна новая функция) — выберите с учеником самую маленькую часть: сегодня одно изменение. В веб-треке проверка на телефоне — после push по адресу Netlify (как в A3 10-го урока).' }}
      onDone={() => sinovYoz({ tuzatildi: true })}
      doneText={{ uz: "Birinchi to'xtash tuzatildi: o'zingiz tekshirdingiz, boshqa ekranlar avvalgidek ishlaydi.", ru: 'Первая остановка исправлена: вы проверили сами, остальные экраны работают как раньше.' }} />
  );
};

// ===== AMALIYOT 2 — yozuv repo'ga va qayta sinov (screens[7]; A2 — bitta qator «Nima buzilmasin») =====
const SinovMd = () => {
  const keyin = useKeyin();
  const [n, setN] = useState(kamHarakat() ? 99 : 0);
  useEffect(() => { if (n >= 9) return; keyin(() => setN(v => v + 1), n === 0 ? 500 : 260); }, [n]); // eslint-disable-line
  const S = SINOV_MAYDON;
  const qat = sanoqQator(3);
  const nv = { topish: 'tuzatildi', son: 'keyin', kelaman: 'keyin' };
  const r = (i, el) => (n > i ? el : null);
  return (
    <div className="pa-md">
      <span className="pa-md-h"><code>SINOV.md</code></span>
      <div className="pa-md-tana">
        {r(0, <p className="pa-md-q b"># SINOV — Maydon Jamoa</p>)}
        {r(1, <p className="pa-md-q">{tr(VAZIFA_T)}: {tr(S.vazifa)}</p>)}
        {r(2, <p className="pa-md-q">{tr({ uz: 'Kishilar', ru: 'Людей' })}: 3 · {tr({ uz: 'Vazifani bajardi', ru: 'Выполнили задание' })}: 2 / 3</p>)}
        {n > 3 && <div className="pa-md-jd">
          <span className="pa-md-th">{tr({ uz: "To'xtash", ru: 'Остановка' })}</span><span className="pa-md-th">{tr({ uz: 'Nechta kishida', ru: 'У скольких' })}</span><span className="pa-md-th">{tr({ uz: 'Navbat', ru: 'Очередь' })}</span>
          {qat.map((q, i) => n > 4 + i && <React.Fragment key={q.id}><span className="pa-md-td">{tr(q.nom)}</span><span className="pa-md-td">{q.son} / 3</span><span className={cxx('pa-md-td', nv[q.id])}>{tr(NAVBAT_T[nv[q.id]]).toLowerCase()}</span></React.Fragment>)}
        </div>}
        {r(7, <p className="pa-md-q b">## {tr({ uz: 'Qayta sinov', ru: 'Повторный тест' })}</p>)}
        {r(8, <p className="pa-md-q ok">{tr({ uz: 'Kim', ru: 'Кто' })}: {tr(S.qaytaSinov.kim)} · {tr(VAZIFA_T)}: {tr(S.qaytaSinov.vazifa)} · {tr({ uz: 'Kuzatuv', ru: 'Наблюдение' })}: {tr(S.qaytaSinov.kuzatuv)}</p>)}
      </div>
    </div>
  );
};
const QS_NATIJA = [{ k: 'toxtamadi', t: { uz: "O'sha joyda to'xtamadi", ru: 'На том месте не застрял' } }, { k: 'toxtadi', t: { uz: "Yana to'xtadi", ru: 'Снова застрял' } }];
const QS_KIM = [{ k: 'yangi', t: { uz: 'Yangi odam', ru: 'Новый человек' } }, { k: 'korgan', t: { uz: "Oldin ko'rgan", ru: 'Уже видел' } }];
const ScreenA2 = (props) => {
  const [s] = useState(sinovOqi);
  const eski = props.storedAnswer && props.storedAnswer.qaytaSinov;
  const [natija, setNatija] = useState(eski ? eski.natija : (s && s.qaytaSinov ? s.qaytaSinov.natija : null));
  const [kim, setKim] = useState(eski ? eski.kim : (s && s.qaytaSinov ? s.qaytaSinov.kim : null));
  const q = sinovQiymat(s);
  const M = { v: q.M, j: tr({ uz: '{nechta kishi sinadi}', ru: '{сколько тестировали}' }) };
  const onAns = (i, d) => props.onAnswer(i, { ...d, qaytaSinov: natija && kim ? { natija, kim } : null });
  const tanlov = <span className="pa-tanlov">
    <span className="pa-tanlov-q"><span className="pa-tanlov-l">{tr({ uz: 'Natijani tanlang:', ru: 'Выберите итог:' })}</span><span className={cxx('pa-ch', !natija && 'pa-guruh')}>{QS_NATIJA.map(o => <QChip key={o.k} holat={natija === o.k ? 'on' : undefined} onClick={() => setNatija(o.k)}>{tr(o.t)}</QChip>)}</span></span>
    <span className="pa-tanlov-q"><span className="pa-tanlov-l">{tr({ uz: 'va kim edi:', ru: 'и кто это был:' })}</span><span className={cxx('pa-ch', natija && !kim && 'pa-guruh')}>{QS_KIM.map(o => <QChip key={o.k} holat={kim === o.k ? 'on' : undefined} onClick={() => setKim(o.k)}>{tr(o.t)}</QChip>)}</span></span>
  </span>;
  return (
    <ScreenBlok {...props} onAnswer={onAns} eyebrow={{ uz: 'Amaliyot 2 · qayta sinov', ru: 'Практика 2 · повторный тест' }}
      title={{ uz: <>Yangi odam o'sha joyda <A>yana to'xtaydimi?</A></>, ru: <>Застрянет ли новый человек <A>на том же месте?</A></> }}
      mentor={{ uz: <>Avval agent sinov yozuvingizni faylga yozadi, keyin sinfdoshingiz o'sha vazifani bajaradi; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Сначала агент запишет вашу запись теста в файл, потом одноклассник выполнит то же задание; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
      kutish={(i) => i === 3 && !(natija && kim)}
      steps={[
        { h: QADAM.ochish, t: { uz: "Antigravity'da o'z repo'ngiz ochiq (Amaliyot 1 dagi holat), ilova telefoningizda ishlab turibdi. Iloji bo'lsa, ilovangizni hali ko'rmagan sinfdoshni tanlang.", ru: 'В Antigravity открыт ваш репо (состояние после Практики 1), приложение работает на телефоне. По возможности выберите одноклассника, который ещё не видел ваше приложение.' } },
        { h: QADAM.prompt,
          t: s ? { uz: "talabning ikki qatori mustaqil ishdagi sanog'ingizdan to'ldirilgan. «Nima buzilmasin» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'две строки требования заполнены из вашего счёта в самостоятельной работе. Строку «Что не сломать» напишите сами, нажмите «Скопировать», отправьте в Antigravity:' }
            : { uz: "talabning ikki qatoridagi joylarni mustaqil ishdagi sanog'ingizdan to'ldiring. «Nima buzilmasin» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'заполните места в двух строках требования из вашего счёта в самостоятельной работе. Строку «Что не сломать» напишите сами, нажмите «Скопировать», отправьте в Antigravity:' },
          prompt: [
            [{ uz: "Qayerda: repo ildizida `SINOV.md` — yo'q bo'lsa, yarat.", ru: 'Где: в корне репо `SINOV.md` — если нет, создай.' }],
            [{ uz: 'Nima qilsin: sinov yozuvini yoz. Vazifa: «', ru: 'Что сделать: запиши запись теста. Задание: «' }, { v: q.vazifa, j: tr({ uz: '{sinov vazifasi}', ru: '{задание теста}' }) }, tr({ uz: '». Kishilar: ', ru: '». Людей: ' }), M, tr({ uz: ', vazifani bajardi: ', ru: ', выполнили задание: ' }), { v: q.bj, j: tr({ uz: '{bajarganlar}', ru: '{выполнившие}' }) }, ' / ', M, tr({ uz: ". Jadval — to'xtash, nechta kishida, navbat: ", ru: '. Таблица — остановка, у скольких, очередь: ' }), { v: q.royxat, j: tr({ uz: "{to'xtashlar va sanog'i}", ru: '{остановки и счёт}' }) }, '.'],
            ['«', { v: q.eng, j: tr({ uz: "{birinchi to'xtash}", ru: '{первая остановка}' }) }, tr({ uz: "» — «tuzatildi», qolganlari — «keyin». Oxirida bo'sh «Qayta sinov» bo'limi qoldir.", ru: '» — «исправлено», остальные — «потом». В конце оставь пустой раздел «Повторный тест».' })],
            [{ uz: 'Nima buzilmasin: {nima buzilmasin}', ru: 'Что не сломать: {что не сломать}' }]
          ],
          yordam: [{ uz: 'Nima buzilmasin: ilova kodiga tegma — faqat `SINOV.md`. O\'zgargan fayllarni ayt.', ru: 'Что не сломать: код приложения не трогай — только `SINOV.md`. Назови изменённые файлы.' }] },
        { h: QADAM.ishga, t: { uz: "`SINOV.md` ni oching: sonlar mustaqil ishdagi sanog'ingiz bilan bir xilmi (agentning hisobotiga emas, faylning o'ziga qarang); `git diff` — faqat `SINOV.md` o'zgargan.", ru: 'Откройте `SINOV.md`: совпадают ли числа с вашим счётом в самостоятельной работе (смотрите не на отчёт агента, а на сам файл); `git diff` — изменён только `SINOV.md`.' },
          err: { uz: 'Mos kelmasa — agentga bitta gap: «Shu qator yozuvimga mos emas: {qator}. Tuzat.»', ru: 'Если не совпадает — одна фраза агенту: «Эта строка не совпадает с моей записью: {строка}. Исправь.»' } },
        { h: QADAM.qayta, t: { uz: "avval ilovangizda «Hisobdan chiqish»ni bosing: sinfdoshingiz namuna ism va boshqa namuna telefon bilan ro'yxatdan o'tadi (o'z raqamini yozmaydi). Telefoningizni bering va o'sha vazifani o'qing. Tushuntirmang, kuzating. Ilovangizni oldin ko'rgan sinfdosh bo'lsa, u yo'lni eslab qolgan bo'lishi mumkin — natijani shuni hisobga olib yozing.", ru: 'сначала нажмите в приложении «Hisobdan chiqish»: одноклассник регистрируется с образцом имени и другим образцом телефона (свой номер не пишет). Дайте телефон и прочитайте то же задание. Не объясняйте, наблюдайте. Если одноклассник уже видел приложение, он мог запомнить путь — учтите это в записи.' },
          bandlar: [
            tanlov,
            { uz: "`SINOV.md` dagi «Qayta sinov» bo'limiga bir qator yozing: «Kim: yangi odam / oldin ko'rgan odam · Vazifa: bajardi / bajarmadi · Kuzatuv: …».", ru: 'Запишите одну строку в раздел «Повторный тест» в `SINOV.md`: «Кто: новый человек / уже видевший · Задание: выполнил / не выполнил · Наблюдение: …».' },
            { uz: "Yana to'xtasa — bu ham natija: ko'rganingizni agentga bitta gap bilan yozing — «Qayta sinovda yana to'xtadi: {nima bo'ldi}. Tuzat.» — va uyda yana sinang.", ru: 'Если снова застрял — это тоже результат: напишите агенту одной фразой — «На повторном тесте снова застрял: {что случилось}. Исправь.» — и проверьте ещё раз дома.' },
            { uz: 'Oxirida `git add SINOV.md` → `git commit -m "13-dars: sinov yozuvi va qayta sinov"` → `git push`.', ru: 'В конце `git add SINOV.md` → `git commit -m "13-dars: sinov yozuvi va qayta sinov"` → `git push`.' }
          ] }
      ]}
      natija={<SinovMd />}
      eslatma={{ uz: "Juftliklarni almashtiring — har o'quvchi o'z ilovasini o'zi ko'rmagan sinfdoshga beradi (3 daqiqa). Kuzatuvchi faqat «O'zingiz qanday deb o'ylaysiz?» deydi. Sinfdosh auditoriyadan bo'lmasa — bu mashq; auditoriyadagi odam bilan qayta sinov — uyga vazifa.", ru: 'Поменяйте пары — каждый ученик даёт своё приложение однокласснику, который его не видел (3 минуты). Наблюдатель говорит только: «А вы сами как думаете?» Если одноклассник не из аудитории — это упражнение; повторный тест с человеком из аудитории — домашнее задание.' }}
      onDone={() => { if (natija && kim) sinovYoz({ qaytaSinov: { natija, kim } }); }}
      doneText={() => (natija === 'toxtadi'
        ? { uz: "Qayta sinov yozildi: to'xtash qoldi — talabni aniqlashtirib, uyda yana sinaysiz.", ru: 'Повторный тест записан: остановка осталась — уточните требование и проверьте ещё раз дома.' }
        : { uz: "Bu qayta sinovda tuzatilgan joyda to'xtash bo'lmadi. Yozuv repo'da.", ru: 'В этом повторном тесте на исправленном месте остановки не было. Запись в репо.' })} />
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s8 = 3; savol ustida kichik SinovSanoq — telefonsiz) =====
const S8Sanoq = () => (
  <div className="pa-s8">
    <SanoqJadval kichik qatorlar={sanoqQator(3)} navbat={{ topish: 'tuzatildi', son: 'keyin', kelaman: 'keyin' }} />
    <p className="pa-s8-q"><b>{tr({ uz: 'Qayta sinov', ru: 'Повторный тест' })}</b> — {tr({ uz: 'Kim', ru: 'Кто' })}: {tr(SINOV_MAYDON.qaytaSinov.kim)} · {tr(VAZIFA_T)}: {tr(SINOV_MAYDON.qaytaSinov.vazifa)}</p>
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Qayta sinovda yangi odam to'xtamadi. Bu nimani ko'rsatadi?"
    question={tr({ uz: <><S8Sanoq /><h2 className="title h-ask">Qayta sinovda yangi odam to'xtamadi. <A>Bu nimani ko'rsatadi?</A></h2></>, ru: <><S8Sanoq /><h2 className="title h-ask">На повторном тесте новый человек не застрял. <A>Что это показывает?</A></h2></> })}
    options={[
      { uz: 'Ilovaning hamma joyi endi tushunarli bo\'ldi', ru: 'Всё приложение теперь стало понятным' },
      { uz: "«Keyin» ro'yxatidagi to'xtashlar ham yo'qoldi", ru: 'Остановки из списка «Потом» тоже исчезли' },
      { uz: 'Ilovani endi sinovsiz ko\'pchilikka bersa bo\'ladi', ru: 'Приложение теперь можно дать многим без тестов' },
      { uz: "Tuzatilgan joyda bu safar to'xtash bo'lmadi", ru: 'На исправленном месте в этот раз остановки не было' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Bitta qayta sinov faqat tuzatilgan joy haqida aytadi.', ru: 'Один повторный тест говорит только об исправленном месте.' }}
    explainWrong={{
      0: { uz: 'Bir kishi bitta vazifani bajardi. Boshqa joylar sinaldimi?', ru: 'Один человек выполнил одно задание. Другие места проверяли?' },
      1: { uz: "Ular tuzatilmagan — «Keyin» ro'yxatida navbatda turibdi.", ru: 'Их не исправляли — они ждут в списке «Потом».' },
      2: { uz: 'Bir kishi — kichik son. Keyingi sinovlar ham kerak.', ru: 'Один человек — маленькое число. Нужны и следующие тесты.' },
      default: { uz: 'Qayta sinov qaysi joy haqida aytadi?', ru: 'О каком месте говорит повторный тест?' }
    }} />
);

// ===== 🃏 KARTOCHKALAR — alohida ekran (SABOQ 12, 16): Mentor yo'q; birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma =====
const KARTOCHKALAR = [
  { front: { uz: 'Sinov nima?', ru: 'Что такое тест?' }, back: { uz: 'Real odam ilovani ishlatadi, siz kuzatasiz', ru: 'Реальный человек пользуется приложением, вы наблюдаете' }, note: { uz: "Intervyuda so'raysiz, sinovda ko'rasiz", ru: 'На интервью спрашиваете, на тесте — смотрите' } },
  { front: { uz: "To'xtash nima?", ru: 'Что такое остановка?' }, back: { uz: 'Odam keyingi qadamni topishda qiynalgan joy', ru: 'Место, где человеку трудно найти следующий шаг' }, note: { uz: "Jim qoladi, uzoq qidiradi yoki noto'g'ri joyni bosadi", ru: 'Замолкает, долго ищет или нажимает не туда' } },
  { front: { uz: 'Uch kishi yozuvida nimani sanaysiz?', ru: 'Что вы считаете в записях трёх человек?' }, back: { uz: "Har to'xtash nechta kishida takrorlanganini", ru: 'У скольких людей повторилась каждая остановка' }, note: { uz: "Mentor misolida: o'yinni topish — 3 / 3", ru: 'В примере Ментора: поиск игры — 3 / 3' } },
  { front: { uz: '«Vazifani bajardi: 2 / 3» nimani bildiradi?', ru: 'Что значит «Выполнили задание: 2 / 3»?' }, back: { uz: 'Uch kishidan ikkitasi natijaga yetdi', ru: 'Двое из трёх дошли до результата' }, note: { uz: "Bittasi to'xtab qoldi — qayerda, yozuv ko'rsatadi", ru: 'Один застрял — где именно, покажет запись' } },
  { front: { uz: "Mentor misolida qaysi to'xtash birinchi tuzatildi?", ru: 'Какую остановку исправили первой в примере Ментора?' }, back: { uz: "Shanba 18:00 dagi o'yinni topishda to'xtagani", ru: 'Остановку при поиске игры в субботу в 18:00' }, note: { uz: "Uchala o'yinchida takrorlandi va birini to'xtatdi", ru: 'Повторилась у всех трёх игроков и одного остановила' } },
  { front: { uz: "Qolgan to'xtashlar qayerga yoziladi?", ru: 'Куда записывают остальные остановки?' }, back: { uz: "«Keyin» ro'yxatiga", ru: 'В список «Потом»' }, note: { uz: "Keyingi tuzatish shu ro'yxatdan olinadi", ru: 'Следующее исправление берут из этого списка' } },
  { front: { uz: "Uch kishi — ko'p sonmi?", ru: 'Три человека — это много?' }, back: { uz: "Yo'q, kichik son: sanoq tanlovga yordam beradi, isbot emas", ru: 'Нет, маленькое число: счёт помогает выбору, но не доказывает' }, note: { uz: "Keyingi sinov tanlovni o'zgartirishi mumkin", ru: 'Следующий тест может изменить выбор' } },
  { front: { uz: 'Talabning «Nima qilsin» qatoriga nima yoziladi?', ru: 'Что пишут в строку требования «Что сделать»?' }, back: { uz: "Ilova qiladigan bitta aniq o'zgarish", ru: 'Одно точное изменение, которое сделает приложение' }, note: { uz: 'Butun ekranni qayta qurish emas', ru: 'А не перестройка всего экрана' } },
  { front: { uz: 'Agent «tuzatdim» desa, nimaga qaraysiz?', ru: 'Агент сказал «исправил» — куда смотрите?' }, back: { uz: "Fayllarda nima o'zgarganiga va telefondagi natijaga", ru: 'На то, что изменилось в файлах, и на результат в телефоне' }, note: { uz: "git diff — nima o'zgargani ko'rinadi", ru: 'git diff — видно, что изменилось' } },
  { front: { uz: "Qayta sinovni kim bilan o'tkazgan ma'qul?", ru: 'С кем лучше провести повторный тест?' }, back: { uz: "Ilovani hali ko'rmagan yangi odam bilan", ru: 'С новым человеком, ещё не видевшим приложение' }, note: { uz: "Oldin ko'rgan odam yo'lni eslab qolgan bo'lishi mumkin", ru: 'Видевший раньше мог запомнить путь' } },
  { front: { uz: 'Cyberpunk 2077 bilan nima bo\'ldi?', ru: 'Что случилось с Cyberpunk 2077?' }, back: { uz: "Konsollarda ko'p xato bilan chiqdi, Sony uni PlayStation Store'dan qariyb yarim yilga oldi", ru: 'Вышла на консолях с массой ошибок, Sony убрала её из PlayStation Store почти на полгода' }, note: { uz: '2020-yil dekabr', ru: 'декабрь 2020 года' } },
  { front: { uz: "Sinov nega ko'pchilikka berishdan oldin o'tkaziladi?", ru: 'Почему тест проводят до того, как дать продукт многим?' }, back: { uz: "Xatoni ko'pchilikdan oldin ko'rish uchun", ru: 'Чтобы увидеть ошибку раньше многих' }, note: { uz: "Cyberpunk 2077 ko'p xato bilan chiqdi — pul qaytarildi", ru: 'Cyberpunk 2077 вышла с массой ошибок — деньги возвращали' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        <div className={cxx('pa-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="pa-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'auditoriyangizdan sinovda qatnashmagan 2 kishi', ru: '2 человека из вашей аудитории, не участвовавшие в тесте' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '2 ta qayta sinov', ru: '2 повторных теста' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QADAM = [
  { uz: "Har kishidan oldin «Hisobdan chiqish»ni bosing — u namuna ism va boshqa namuna telefon bilan ro'yxatdan o'tsin. O'sha vazifani bering, tushuntirmang: tuzatilgan joyda to'xtaydimi — kuzating.", ru: 'Перед каждым человеком нажимайте «Hisobdan chiqish» — пусть он зарегистрируется с образцом имени и другим образцом телефона. Дайте то же задание, не объясняйте: застрянет ли он на исправленном месте — наблюдайте.' },
  { uz: "Natijani `SINOV.md` dagi «Qayta sinov» bo'limiga yozing va push qiling.", ru: 'Запишите итог в раздел «Повторный тест» в `SINOV.md` и сделайте push.' },
  { uz: "Yana to'xtasa — ko'rganingizni agentga bitta gap bilan yozing va o'zingiz tekshiring.", ru: 'Если снова застрянет — напишите агенту увиденное одной фразой и проверьте сами.' }
];
const HwCard = ({ keyingi }) => (
  <div className="card pa-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="pa-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="pa-hw-q"><span className="pa-hw-k">{tr(r.k)}</span><span className="pa-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="pa-hw-qadam">{HW_QADAM.map((q, i) => <li key={i}><i>{['①', '②', '③'][i]}</i><span>{tx(q)}</span></li>)}</ol>
    {keyingi && <span className="pa-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + «Bugungi asosiy fikr» (P-013, ScoreRing ostida, small — kartochkaga qo'shilmaydi). Sarlavha — to'rt holat (P-046, 13-FILTR 9) =====
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
    { uz: "Uch kishi yozuvida har to'xtash nechta kishida takrorlanganini sanaysiz.", ru: 'В записях трёх человек вы считаете, у скольких повторилась каждая остановка.' },
    { uz: 'Kishi vazifani bajara oldimi — har yozuvda alohida ko\'rinadi.', ru: 'Смог ли человек выполнить задание — видно отдельно в каждой записи.' },
    { uz: 'Uch kishi — kichik son: sanoq tanlovga yordam beradi, isbot emas.', ru: 'Три человека — маленькое число: счёт помогает выбору, но не доказывает.' },
    { uz: 'Bitta qayta sinov faqat tuzatilgan joy haqida aytadi.', ru: 'Один повторный тест говорит только об исправленном месте.' },
    { uz: "Cyberpunk 2077 ko'p xato bilan chiqdi — Sony uni do'konidan qariyb yarim yilga oldi.", ru: 'Cyberpunk 2077 вышла с массой ошибок — Sony убрала её из своего магазина почти на полгода.' }
  ];
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: 3-asosiy funksiya»</b></>, ru: <>Следующий урок — <b>«День проекта: 3-я основная функция»</b></> });
  const s = sinovOqi();
  const tuzatildi = !!((s && s.tuzatildi) || (answers[6] && answers[6].solved));
  const qs = (s && s.qaytaSinov) || (answers[7] && answers[7].qaytaSinov) || null;
  const holat = isMentorL ? 'toxtamadi' : qs && qs.natija === 'toxtamadi' ? 'toxtamadi' : qs && qs.natija === 'toxtadi' ? 'toxtadi' : tuzatildi ? 'qoldi' : 'tanlandi';
  const SARLAVHA = {
    toxtamadi: { uz: <>Tuzatildi: qayta sinovda <A>to'xtash takrorlanmadi</A>.</>, ru: <>Исправлено: на повторном тесте <A>остановка не повторилась</A>.</> },
    toxtadi: { uz: <>Tuzatish tayyor — <A>qayta sinov uyda davom etadi</A>.</>, ru: <>Исправление готово — <A>повторный тест продолжится дома</A>.</> },
    qoldi: { uz: <>Tuzatish tayyor — <A>qayta sinov qoldi</A>.</>, ru: <>Исправление готово — <A>остался повторный тест</A>.</> },
    tanlandi: { uz: <>Birinchi to'xtash tanlandi — <A>tuzatish qoldi</A>.</>, ru: <>Первая остановка выбрана — <A>осталось исправить</A>.</> }
  };
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
        togri={correct} jami={total}
        sarlavha={tr(SARLAVHA[holat])}
        cta={<>
          <div className="pa-fikr fade-up d1"><span className="pa-fikr-l">{tr({ uz: 'Bugungi asosiy fikr', ru: 'Главная мысль урока' })}</span><p className="pa-fikr-t small">{tr({ uz: "Bu darsda ko'p kishida takrorlangan va vazifaga to'sqinlik qilgan to'xtash birinchi tuzatiladi, keyin yangi odam bilan qayta sinaladi.", ru: 'На этом уроке первой исправляют остановку, которая повторилась у многих и помешала заданию, затем повторно проверяют с новым человеком.' })}</p></div>
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
export default function PmAudienceTestLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, ScreenA1, ScreenA2, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === DARSNING O'Z VIZUALI — «Sinov sanog'i» (pa-). Faqat qolip tokenlari (D3); brend rangi faqat nomda: Maydon Jamoa (#2E9E4F, tayanch 9.62), Cyberpunk 2077 (muqova sarig'i), PlayStation Store (ko'k). Emoji yo'q (D4). Telefon 172×272 hamma ekranda (SABOQ 22) === */
        /* Halqa (SABOQ 32, To'lqin B 10): yengil — scale 1.03, shaffoflik 0.35, sikl 2.6 s; guruhda bitta; kam harakatda statik */
        .pa-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .pa-halqa::after { content: ''; position: absolute; inset: -6px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pa-tolqin 2.6s ease-in-out 0.4s 3; }
        .pa-guruh { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 12px; }
        .pa-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 16px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pa-tolqin 2.6s ease-in-out 0.5s 3; }
        .pa-jd-tana.pa-guruh { width: auto; }
        .pa-halqa-i { border-color: ${T.accent} !important; animation: pa-tolqin-i 2.6s ease-in-out 0.4s 3; }
        .pa-halqa-s { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pa-tolqin 2.6s ease-in-out 0.5s 3; }
        .lesson-root:has(.pa-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.pa-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        .pa-blok .q-blok-q.joriy .q-blok-tana > .q-btn:not(.q-2) { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .pa-blok .q-blok-q.joriy .q-blok-tana > .q-btn:not(.q-2)::after { content: ''; position: absolute; inset: -6px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pa-tolqin 2.6s ease-in-out 0.5s 3; }
        .pa-blok.pa-qulf .q-blok-q.joriy .q-blok-tana > .q-btn:not(.q-2) { opacity: 0.45; pointer-events: none; outline: none; }
        .pa-blok.pa-qulf .q-blok-q.joriy .q-blok-tana > .q-btn:not(.q-2)::after { display: none; }
        @keyframes pa-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes pa-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes pa-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pa-karta { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes pa-tush { from { opacity: 0; transform: translateY(-10px) scale(0.5); } to { opacity: 1; transform: none; } }
        @keyframes pa-son { 0% { transform: scale(1); } 40% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes pa-sirg { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; } }
        @keyframes pa-yon { 0%, 65% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { box-shadow: inset 0 0 0 1.5px transparent; } }
        @keyframes pa-yig { from { opacity: 0.3; transform: scaleY(1.6); } to { opacity: 1; transform: none; } }
        @keyframes pa-ochil { 0% { transform: rotateX(70deg); opacity: 0.4; } 100% { transform: none; opacity: 1; } }
        @keyframes pa-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        @keyframes pa-chiz { to { stroke-dashoffset: 0; } }
        @keyframes pa-uch { 0% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 85% { opacity: 1; } 100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.8); opacity: 0; } }
        @keyframes pa-ko { to { opacity: 1; } }
        /* Mentor eslatmasi, nishon qatori, ovozlar */
        .pa-mnote-c { align-self: flex-end; }
        .pa-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .pa-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        p.pa-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.pa-nishon.ketdi { opacity: 0.75; }
        .pa-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pa-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .pa-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .pa-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .pa-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .pa-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }
        p.pa-javob { margin: 2px 0 0; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; font-size: clamp(13.5px,1.5vw,15px); font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        /* Telefon = ilova */
        .pa-tel-ust { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .pa-tel-yorliq { min-height: 22px; display: flex; align-items: center; justify-content: center; max-width: 240px; }
        .pa-tartib { display: inline-block; max-width: 172px; padding: 2px 10px; border-radius: 10px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 11px; font-weight: 800; line-height: 1.3; text-align: center; }
        .pa-tel { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 4px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px 8px 0; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .pa-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .pa-tel-nom { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12.5px; color: #2E9E4F; letter-spacing: 0.01em; }
        .pa-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; animation: pa-ekran 0.35s ease-out both; }
        .pa-ekran-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; padding: 0 2px; }
        .pa-ro { position: relative; display: flex; flex-direction: column; gap: 6px; border-radius: 10px; }
        .pa-ok { display: flex; flex-direction: column; gap: 3px; padding: 10px 9px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .pa-ekran:has(.pa-ok-h) .pa-ok, .pa-ekran:has(.pa-ok-ora) .pa-ok { padding: 4px 9px; gap: 1px; }
        .pa-ekran:has(.pa-ok-h) .pa-ro, .pa-ekran:has(.pa-ok-ora) .pa-ro { gap: 3px; }
        .pa-ekran:has(.pa-ok-h) .pa-ok-h { margin-top: 1px; }
        .pa-ok-q { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; min-width: 0; }
        .pa-ok-sar { font-size: 12px; font-weight: 800; color: ${T.ink}; }
        .pa-ok-son { position: relative; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.ink}; white-space: nowrap; }
        .pa-ok-joy { font-size: 11px; color: ${T.ink2}; }
        .pa-ok-h { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; margin-top: 2px; animation: pa-kir 0.4s ease-out both; }
        .pa-ok-ora { height: 6px; }
        .pa-ekran.ajrat .pa-ro > .pa-ok:first-of-type { background: ${T.accentSoft}; }
        .pa-oyin { flex: 1; display: flex; flex-direction: column; gap: 3px; padding: 2px 2px 10px; animation: pa-ekran 0.35s ease-out both; }
        .pa-oyin-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pa-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .pa-oyin-son { position: relative; align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; margin-top: 4px; }
        .pa-oyin-btn { margin-top: auto; display: flex; align-items: center; justify-content: center; height: 28px; border-radius: 9px; background: ${T.accent}; color: #fff; font-size: 12px; font-weight: 800; }
        .pa-nuqta { position: absolute; z-index: 3; width: 12px; height: 12px; border-radius: 50%; background: ${T.err}; box-shadow: 0 0 0 3px ${fon(T.err, 0.2)}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; animation: pa-tush 0.45s cubic-bezier(.3,1.5,.5,1) both; }
        .pa-nuqta.kop { width: 20px; height: 20px; }
        .pa-nuqta.royxat { top: -8px; right: -2px; }
        .pa-nuqta.son { top: -4px; right: -18px; }
        .pa-nuqta.oyin { position: relative; align-self: center; margin-top: 6px; }
        .pa-nuqta.ich { position: relative; }
        .pa-rn { transition: top 0.8s cubic-bezier(.3,.8,.3,1), left 0.8s cubic-bezier(.3,.8,.3,1); }
        .pa-rn.r0 { top: 14px; left: 120px; } .pa-rn.r1 { top: 70px; left: 40px; } .pa-rn.r2 { top: 132px; left: 100px; }
        .pa-rn.yigil.r0, .pa-rn.yigil.r1, .pa-rn.yigil.r2 { top: -8px; left: 136px; }
        .pa-yuz { flex: none; display: block; }
        /* Yozuv kartasi, ixcham qator */
        .pa-yk { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.4); animation: pa-karta 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .pa-yk-h { display: flex; align-items: center; gap: 8px; font-size: 14px; color: ${T.ink}; }
        p.pa-yk-v { margin: 0; font-size: 12px; color: ${T.ink2}; line-height: 1.4; }
        .pa-yk-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
        .pa-yk-q { display: grid; grid-template-columns: 62px minmax(0,1fr); gap: 2px 8px; align-items: baseline; padding: 3px 6px; border-radius: 8px; font-size: 12.5px; line-height: 1.35; color: ${T.ink}; animation: pa-kir 0.35s ease-out both; animation-delay: calc(var(--i) * 80ms); }
        .pa-yk-q.tox { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.45)}; font-weight: 600; }
        .pa-yk-vt { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .pa-yk-t { min-width: 0; }
        .pa-yk-l { grid-column: 2; justify-self: start; font-style: normal; font-size: 11px; font-weight: 800; color: #fff; background: ${T.accent}; border-radius: 999px; padding: 1px 8px; }
        .pa-yi { display: flex; align-items: center; gap: 7px; padding: 6px 10px; border-radius: 11px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; color: ${T.ink}; transform-origin: top; animation: pa-yig 0.45s cubic-bezier(.2,.9,.3,1) both; }
        .pa-yi.yangi { animation: pa-yig 0.45s cubic-bezier(.2,.9,.3,1) both, pa-yon 1.2s ease-out; }
        .pa-yi-n { color: ${T.ink2}; white-space: nowrap; }
        .pa-yi-b { margin-left: auto; font-size: 12px; font-weight: 800; padding: 2px 9px; border-radius: 999px; white-space: nowrap; animation: pa-tush 0.45s cubic-bezier(.3,1.5,.5,1) both; animation-delay: calc(var(--i) * 140ms); }
        .pa-yi-b.ok { background: ${T.okFon}; color: ${T.ok}; } .pa-yi-b.yoq { background: ${T.errFon}; color: ${T.err}; }
        /* Sanoq jadvali */
        .pa-jd { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 22px -16px rgba(${T.shadowBase},0.35); }
        .pa-jd-h, .pa-jq { display: grid; grid-template-columns: minmax(0,1fr) 66px 86px; gap: 8px; align-items: center; }
        .pa-jd-h { font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; padding: 0 8px 5px; border-bottom: 1px solid ${T.line}; }
        .pa-jd-tana { display: flex; flex-direction: column; gap: 5px; }
        .pa-jq { padding: 8px; border-radius: 10px; background: ${T.bg}; border: 1.5px solid transparent; font-family: 'Manrope', sans-serif; text-align: left; color: ${T.ink}; animation: pa-sirg 0.5s ease-out both; transition: padding 0.4s cubic-bezier(.3,1.2,.5,1), opacity 0.4s, background 0.3s, border-color 0.3s; }
        button.pa-jq { cursor: pointer; width: 100%; }
        button.pa-jq:hover { border-color: ${T.accent}; }
        .pa-jq.yangi { animation: pa-sirg 0.5s ease-out both, pa-yon 1.1s ease-out; }
        .pa-jq.birinchi { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .pa-jq.keyin { opacity: 0.72; padding-left: 22px; }
        .pa-jq.tuzatildi { background: ${T.okFon}; }
        .pa-jq-b { display: flex; justify-content: flex-start; }
        .pa-jq-t { font-size: 13px; font-weight: 600; line-height: 1.35; min-width: 0; }
        .pa-jq-n { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; }
        .pa-jq-n.yangi { color: ${T.ok}; animation: pa-son 0.5s cubic-bezier(.3,1.5,.5,1); }
        .pa-nv { display: inline-block; font-style: normal; font-size: 11.5px; font-weight: 800; padding: 2px 9px; border-radius: 999px; white-space: nowrap; animation: pa-tush 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        .pa-nv.birinchi { background: ${T.accent}; color: #fff; } .pa-nv.keyin { background: ${fon(T.ink, 0.08)}; color: ${T.ink2}; } .pa-nv.tuzatildi { background: ${T.ok}; color: #fff; }
        .pa-jd-f { font-size: 13px; font-weight: 700; color: ${T.ink2}; padding: 5px 8px 0; border-top: 1px solid ${T.line}; }
        .pa-jd-f b { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 15px; color: ${T.ink}; animation: pa-son 0.5s cubic-bezier(.3,1.5,.5,1); }
        .pa-jd.kichik { padding: 8px 10px; gap: 4px; }
        .pa-jd.kichik .pa-jq { padding: 5px 8px; animation: none; } .pa-jd.kichik .pa-jq-t { font-size: 12.5px; } .pa-jd.kichik .pa-jq-n { font-size: 12.5px; }
        /* 2-ekran sahnasi: telefon chapda · yozuvlar · jadval o'ngda (SABOQ 21) */
        .pa-sahna { position: relative; display: grid; grid-template-columns: 172px minmax(0,1.08fr) minmax(0,0.92fr); gap: 18px; align-items: start; }
        .pa-yozuvlar { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
        .pa-navbat { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 40px; }
        .pa-navbat .q-btn.pa-sanash { align-self: center; }
        .pa-kutar { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px 0 5px; border-radius: 999px; background: ${fon(T.ink, 0.05)}; border: 1.5px dashed ${fon(T.ink, 0.22)}; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; animation: pa-kir 0.35s ease-out both; }
        .pa-jd-ust { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .pa-bog { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; z-index: 2; }
        .pa-bog-c { fill: none; stroke: ${T.err}; stroke-width: 1.6; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0.8; animation: pa-chiz 0.9s ease-out 0.5s forwards; }
        .pa-uch { position: absolute; z-index: 6; pointer-events: none; padding: 2px 9px; border-radius: 999px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; white-space: nowrap; transform: translate(-50%, -50%); animation: pa-uch 0.65s cubic-bezier(.3,.7,.3,1) forwards; }
        .pa-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; transform-origin: top; animation: pa-yig 0.45s cubic-bezier(.2,.9,.3,1) both; }
        .pa-taxmin-y { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; }
        .pa-taxmin-s { color: ${T.ink2}; } .pa-taxmin b { color: ${T.ink}; }
        .pa-belgi { font-size: 14px; } .pa-belgi.ok { color: ${T.ok}; } .pa-belgi.yoq { color: ${T.err}; }
        .pa-tx { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .pa-tx.ok { color: ${T.ok}; } .pa-tx b { color: ${T.ok}; } .pa-tx b.yoq { color: ${T.err}; }
        .pa-bash .q-bashorat { animation: pa-kir 0.45s ease-out both; }
        .pa-bash .q-chip { animation: pa-kir 0.35s ease-out both; }
        .pa-bash .q-chip:nth-child(2) { animation-delay: 0.09s; } .pa-bash .q-chip:nth-child(3) { animation-delay: 0.18s; }
        .pa-bash .q-variantlar { position: relative; width: fit-content; max-width: 100%; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 14px; }
        .pa-bash .q-variantlar::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pa-tolqin 2.6s ease-in-out 0.6s 3; }
        .q-tushuncha:has(.pa-sahna) .q-fokus { gap: 0; }
        /* ⛶ tugagan holatda ham: q-fokus animatsiyasining transform'i fixed oynani o'ziga bog'lab qo'ymasin */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; }
        .zoom-on:has(.pa-sahna) { width: min(1040px, 96vw); }
        .pa-sahna.tinch .pa-jq { animation: none; }
        /* 0-ekran */
        .pa-s0-maket { display: flex; flex-direction: column; gap: 10px; }
        p.pa-vq { margin: 0; font-size: 13.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 12px; line-height: 1.4; }
        .pa-s0-ust { display: flex; gap: 14px; align-items: flex-start; }
        .pa-s0-yk { display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 0; padding-top: 6px; perspective: 600px; }
        .pa-yopiq { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${fon(T.ink, 0.05)}; border: 1.5px dashed ${fon(T.ink, 0.22)}; color: ${T.ink2}; animation: pa-kir 0.4s ease-out both; }
        .pa-yopiq:nth-child(2) { animation-delay: 0.08s; } .pa-yopiq:nth-child(3) { animation-delay: 0.16s; }
        .pa-yopiq.ochiq { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.4); transform-origin: top; animation: pa-ochil 0.45s cubic-bezier(.2,.9,.3,1.2) both; }
        .pa-yopiq-h { display: flex; align-items: center; gap: 8px; font-size: 13.5px; }
        .pa-yopiq-n { display: flex; gap: 7px; padding-left: 2px; }
        .pa-yopiq-n .pa-nuqta:nth-child(2) { animation-delay: 0.12s; }
        .pa-s0.tanlovsiz .q-variantlar-kol { position: relative; border-radius: 14px; outline: 2px solid ${T.accent}; outline-offset: 5px; }
        .pa-s0.tanlovsiz .q-variantlar-kol::after { content: ''; position: absolute; inset: -9px; border-radius: 18px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pa-tolqin 2.6s ease-in-out 0.9s 3; }
        /* 1-ekran */
        .q-reja:has(.pa-rj) .q-split { grid-template-columns: minmax(0,0.8fr) minmax(0,1.2fr); }
        .pa-rj { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        p.pa-rj-ok { margin: 0; display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: ${T.okFon}; color: ${T.ok}; font-weight: 700; font-size: 13.5px; }
        p.pa-rj-ok i { font-style: normal; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: ${T.ok}; color: #fff; font-size: 12px; animation: pa-tush 0.45s cubic-bezier(.3,1.5,.5,1) both; }
        .pa-reja-ost { display: flex; flex-direction: column; gap: 4px; }
        p.pa-reja-repo { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; color: ${T.ink2}; overflow-wrap: anywhere; }
        p.pa-reja-repo code { color: ${T.ink}; font-weight: 700; }
        p.pa-reja-izoh { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        /* 4-ekran: Cyberpunk 2077 */
        .pa-cp { display: inline-block; padding: 0 0.2em; border-radius: 4px; background: #FCEE0A; color: #14121F; font-weight: 800; letter-spacing: -0.01em; box-shadow: inset 0 -2px 0 ${fon('#00E5FF', 0.6)}; }
        .pa-nuq { display: flex; align-items: center; justify-content: center; gap: 7px; }
        .pa-nuq-l { margin-right: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pa-nuq i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .pa-nuq i.ok { background: ${T.ok}; } .pa-nuq i.cur { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .pa-voqea { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 7px; }
        .pa-voqea > .zoomable { width: 100%; max-width: 540px; }
        .pa-voqea > .zoomable.zoom-on { max-width: none; width: min(880px, 94vw); }
        p.pa-tanish { margin: 0; font-size: 14px; color: ${T.ink2}; animation: pa-kir 0.4s ease-out both; }
        .pa-voqea-h { font-weight: 800; font-size: clamp(16px,1.8vw,19px); color: ${T.ink}; animation: pa-kir 0.35s ease-out both; }
        .pa-voqea .pa-bash, .pa-voqea .pa-taxmin, .pa-voqea p.q-xulosa { width: 100%; max-width: 660px; text-align: left; }
        .pa-voqea .pa-bash { display: flex; flex-direction: column; gap: 6px; }
        .pa-kb-w { width: 100%; }
        .pa-kb { display: block; width: 100%; height: auto; border-radius: 12px; animation: pa-kir 0.45s ease-out both; }
        .kb-ps { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; fill: #0070D1; }
        .kb-kt { font-family: 'Manrope', sans-serif; font-size: 9px; font-weight: 800; fill: #14121F; }
        .kb-qt { font-family: 'Manrope', sans-serif; font-size: 9.5px; font-weight: 800; fill: ${T.err}; }
        .kb-vt { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; fill: ${T.ink2}; }
        .kb-kadr { animation: kb-yur 4.2s linear 0.4s 2 both; }
        .kb-glitch { opacity: 0; animation: kb-glitch 4.2s steps(1) 0.4s 2 both; }
        @keyframes kb-yur { 0% { transform: translateX(0); } 35%, 62% { transform: translateX(-40px); } 100% { transform: translateX(-110px); } }
        @keyframes kb-glitch { 0%, 35% { opacity: 0; transform: none; } 38% { opacity: 1; transform: translateX(-6px); } 44% { opacity: 0.4; transform: translateX(5px); } 50% { opacity: 1; transform: translateX(-3px); } 56% { opacity: 0.7; transform: translateX(4px); } 62%, 100% { opacity: 0; transform: none; } }
        .kb-xaridor { animation: kb-kir 0.6s ease-out both; animation-delay: calc(var(--i) * 0.7s); }
        @keyframes kb-kir { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
        .kb-qaytar { opacity: 0; animation: kb-qaytar 1.5s ease-in-out forwards; animation-delay: calc(var(--i) * 0.7s + 0.5s); }
        @keyframes kb-qaytar { 0% { opacity: 0; transform: translateY(10px); } 22% { opacity: 1; transform: none; } 65% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translate(var(--dx), 56px) scale(0.5); } }
        .kb-uyum { opacity: 0; animation: pa-ko 0.4s ease-out 1.9s forwards; }
        .kb-karta { transform-box: fill-box; transform-origin: center; }
        .kb-karta.chiqdi { animation: kb-chiq 1.1s ease-in 0.9s forwards; }
        @keyframes kb-chiq { 0% { opacity: 1; filter: none; transform: none; } 45% { opacity: 1; filter: grayscale(1); transform: none; } 100% { opacity: 0; filter: grayscale(1); transform: translateY(-34px); } }
        .kb-vaqt { animation: pa-kir 0.4s ease-out 1.4s both; }
        .kb-chiz { stroke-dasharray: 1; stroke-dashoffset: 1; animation: pa-chiz 1.2s ease-out 1.8s forwards; }
        .kb-oxir { opacity: 0; animation: pa-ko 0.4s ease-out 2.9s forwards; }
        /* 5-ekran: ketma-ket karta formasi */
        p.pa-kirish5 { margin: 0; font-size: 13px; color: ${T.ink2}; }
        .pa-uc { display: flex; flex-direction: column; gap: 5px; max-width: 640px; width: 100%; }
        .pa-uc-v, .pa-uc-q { display: flex; align-items: center; gap: 10px; padding: 6px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; color: ${T.ink}; }
        .pa-uc-v span { flex: 1; min-width: 0; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pa-uc-v b, .pa-uc-q b { white-space: nowrap; font-size: 12.5px; }
        .pa-uc-q b { font-family: 'JetBrains Mono', monospace; }
        .pa-uc-q.yangi { animation: pa-yon 1.2s ease-out; } .pa-uc-q.joriy { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pa-uc-t { flex: 1; min-width: 0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pa-yi-ed, .pa-ed { flex: none; border: none; background: transparent; color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; padding: 4px 7px; border-radius: 7px; }
        .pa-yi-ed:hover, .pa-ed:hover { color: ${T.accent}; background: ${T.accentSoft}; }
        .pa-mk { display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.45); animation: pa-karta 0.45s cubic-bezier(.2,.9,.3,1.1) both; }
        .pa-mk-q { display: flex; flex-direction: column; gap: 6px; }
        .pa-mk-q.qator { flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 14px; }
        .pa-s5 .q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 22px; }
        .pa-s5 .q-mustaqil:has(.pa-sk) { max-width: none; }
        .pa-s5 .pa-mk { gap: 8px; padding: 12px 18px; }
        .pa-s5 .pa-mk .q-chip { padding: 7px 13px; }
        .pa-mk-l { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .pa-inp { width: 100%; font-family: 'Manrope', sans-serif; font-size: 14.5px; font-weight: 500; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 12px; outline: none; transition: border-color 0.2s; }
        .pa-inp:focus { border-color: ${T.accent}; }
        .pa-ch { display: flex; flex-wrap: wrap; gap: 8px; }
        .pa-kishi { font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 9px; }
        .pa-mk-b { animation: pa-kir 0.35s ease-out both; }
        .pa-mk-amal { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
        .pa-mk-amal .q-btn { align-self: auto; }
        p.pa-mk-izoh { margin: 0; font-size: 13px; color: ${T.ink2}; background: ${fon(T.ink, 0.04)}; border-radius: 10px; padding: 8px 12px; line-height: 1.45; }
        .pa-uya { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; min-height: 44px; padding: 8px 12px; border-radius: 12px; border: 1.5px dashed ${fon(T.accent, 0.5)}; background: ${fon(T.accent, 0.04)}; }
        .pa-uya.tola { border-style: solid; border-color: ${T.accent}; background: ${T.accentSoft}; }
        .pa-uya-l { font-size: 12px; font-weight: 800; color: #fff; background: ${T.accent}; border-radius: 999px; padding: 2px 10px; white-space: nowrap; }
        .pa-uya-t { font-size: 13.5px; font-weight: 700; color: ${T.ink}; min-width: 0; }
        .pa-uya-t b { font-family: 'JetBrains Mono', monospace; }
        .pa-keyin-l { font-size: 11.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .pa-sr { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .pa-sr.pa-guruh { width: auto; }
        .pa-sq { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; text-align: left; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 600; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 9px 12px; cursor: pointer; animation: pa-sirg 0.4s ease-out both; }
        .pa-sq:hover { border-color: ${T.accent}; }
        .pa-sq.keyin { opacity: 0.72; }
        .pa-sq-t { min-width: 0; }
        .pa-sq b { font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
        .pa-x { margin-left: 8px; font-style: normal; font-size: 11.5px; font-weight: 800; color: ${T.err}; white-space: nowrap; }
        .pa-mk-amal .pa-yordam-b { margin-right: auto; }
        .pa-sk { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.45); }
        .pa-sk-h { display: flex; flex-direction: column; gap: 4px; }
        .pa-sk-l { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .pa-sk-tur { font-style: normal; font-size: 11px; letter-spacing: 0; text-transform: none; padding: 1px 8px; border-radius: 999px; background: ${fon(T.ink, 0.08)}; color: ${T.ink2}; }
        p.pa-sk-v { margin: 0; font-size: 14px; font-weight: 600; color: ${T.ink}; }
        .pa-sk-bj { font-size: 13px; color: ${T.ink2}; }
        .pa-sk-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .pa-sk-q { display: grid; grid-template-columns: minmax(0,1fr) auto auto auto; gap: 10px; align-items: center; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; font-size: 13.5px; animation: pa-sirg 0.4s ease-out both; }
        .pa-sk-q:nth-child(2) { animation-delay: 0.08s; } .pa-sk-q:nth-child(3) { animation-delay: 0.16s; } .pa-sk-q:nth-child(4) { animation-delay: 0.24s; } .pa-sk-q:nth-child(5) { animation-delay: 0.32s; }
        .pa-sk-q.birinchi { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .pa-sk-t { min-width: 0; font-weight: 600; }
        .pa-sk-n { font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
        /* Amaliyot bloklari */
        .pa-prompt { margin-top: 6px; }
        .pa-ps { display: block; margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${T.ink}; font-weight: 500; overflow-wrap: break-word; }
        .pa-tol { background: ${T.okFon}; color: ${T.ink}; border-radius: 6px; padding: 1px 6px; font-weight: 700; box-shadow: inset 0 -1.5px 0 ${fon(T.ok, 0.45)}; }
        .pa-joy-n { margin-left: 6px; font-size: 12px; font-weight: 500; font-style: italic; color: ${T.ink2}; }
        .pa-band { display: block; margin-top: 5px; }
        .pa-yordam { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
        .pa-yordam-s { display: block; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; font-size: 13px; line-height: 1.5; }
        .q-blok-xato .q-btn.pa-yordam-b { padding: 5px 12px; font-size: 12.5px; }
        .q-blok-t .qcode, .q-blok-xato .qcode, .pa-yordam .qcode, .pa-ps .qcode, .q-blok-tugadi .qcode, p.pa-ortda .qcode, .pa-hw .qcode { white-space: normal; overflow-wrap: anywhere; }
        p.pa-ortda { margin: 0; font-size: 12.5px; line-height: 1.7; color: ${T.ink2}; overflow-wrap: anywhere; }
        .pa-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; overflow-wrap: anywhere; }
        .pa-a1-n { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 6px 0; }
        p.pa-diff { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        p.pa-diff code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 6px; }
        .pa-tanlov { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .pa-tanlov-q { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .pa-tanlov-l { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        .pa-md { display: flex; flex-direction: column; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; overflow: hidden; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.4); }
        .pa-md-h { display: flex; align-items: center; gap: 8px; padding: 7px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; font-size: 12px; color: ${T.ink2}; }
        .pa-md-h code { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink}; }
        .pa-md-tana { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px 12px; min-height: 240px; }
        p.pa-md-q { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; color: ${T.ink}; animation: pa-kir 0.3s ease-out both; }
        p.pa-md-q.b { font-weight: 800; } p.pa-md-q.ok { color: ${T.ok}; font-weight: 700; }
        .pa-md-jd { display: grid; grid-template-columns: minmax(0,1fr) auto auto; gap: 3px 10px; padding: 6px 8px; border-radius: 8px; background: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.4; animation: pa-kir 0.3s ease-out both; }
        .pa-md-th { font-weight: 800; color: ${T.ink2}; }
        .pa-md-td { color: ${T.ink}; animation: pa-kir 0.3s ease-out both; }
        .pa-md-td.tuzatildi { color: ${T.ok}; font-weight: 800; } .pa-md-td.keyin { color: ${T.ink2}; }
        /* 8-ekran: savol ustidagi kichik sanoq */
        .pa-s8 { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        p.pa-s8-q { margin: 0; padding: 4px 12px; border-radius: 10px; background: ${T.okFon}; color: ${T.ink}; font-size: 13px; }
        @media (min-width: 761px) { /* 1280×800: xato javob kartasi (qayta urinish) panel ustida qolsin — jadval ixcham (F-1007-289) */
          .pa-s8 { gap: 4px; margin-bottom: 8px; } .pa-s8 .pa-jd.kichik { padding: 6px 10px; gap: 3px; }
          .pa-s8 .pa-jd-h, .pa-s8 .pa-jq { grid-template-columns: minmax(0,1fr) 112px 86px; } .pa-s8 .pa-jd-h { white-space: nowrap; padding-bottom: 3px; }
          .pa-s8 .pa-jd.kichik .pa-jq { padding: 3px 8px; }
        }
        p.pa-s8-q b { color: ${T.ok}; }
        /* Kartochkalar (SABOQ 16) */
        .pa-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: pa-halqa-k 2.6s ease-in-out 0.4s 3; }
        @keyframes pa-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 3px ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 7px ${fon(T.accent, 0.3)}; } }
        p.pa-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.pa-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: pa-puls 1.4s ease-out 3; }
        @keyframes pa-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.5)}; } 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        /* Yakun */
        .pa-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .pa-fikr-l { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.pa-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .pa-hw { display: flex; flex-direction: column; gap: 10px; }
        .pa-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .pa-hw-q { display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .pa-hw-k { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .pa-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .pa-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .pa-hw-qadam li { display: flex; gap: 8px; align-items: flex-start; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .pa-hw-qadam i { font-style: normal; color: ${T.accent}; font-weight: 800; }
        .pa-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 1199px) { .zoomable:not(.zoom-on):not(.z-float) p.pa-vq { margin-right: 40px; } }
        @media (max-width: 760px) {
          .q-reja:has(.pa-rj) .q-split { grid-template-columns: minmax(0,1fr); }
          .pa-sahna { grid-template-columns: minmax(0,1fr); justify-items: center; }
          .pa-yozuvlar, .pa-jd-ust { width: 100%; padding-top: 0; }
          .pa-bog { display: none; }
          .pa-s0-ust { gap: 10px; }
          .pa-jd-h, .pa-jq { grid-template-columns: minmax(0,1fr) 52px 84px; gap: 6px; }
          .pa-hw-karta { grid-template-columns: minmax(0,1fr); }
          .pa-sk-q { grid-template-columns: minmax(0,1fr) auto auto; }
          .pa-sk-q .pa-ed { grid-column: 3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lesson-root [class*="pa-"], .lesson-root [class*="pa-"]::after, .lesson-root [class*="pa-"] *, .lesson-root .stage-nav .btn-white-accent::after, .lesson-root [class*="kb-"] { animation: none !important; transition: none !important; }
          .kb-qaytar, .kb-glitch { opacity: 0; } .kb-uyum, .kb-oxir { opacity: 1; } .kb-karta.chiqdi { opacity: 0; } .kb-chiz, .pa-bog-c { stroke-dashoffset: 0; }
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
