import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) 12-dars (PM) «Keyingi olti oyda nima qilasiz?» — MD: feedback/F-1008-14modul/12-PmNextSteps-v3.md (+ 12-FILTR.md). Skeletdan (src/skelet/NamunaDars.jsx).
// 12 ekran: s0 QKirish · s1 QReja · s2 QTushuncha (uch yo'nalish) · s3 test · s4 QTushuncha (birinchi qadam) · s5 test · s6 QMustaqil (reja) · s7 QMustaqil (yakkama-yakka) · s8 test · podium · QKartochka · QYakun.
// Bitta vizual — OltiOyReja (taxta 3 × 6) · telefon «Maydon Jamoa» (s2) · 13-Modul varag'i (s4). Saqlaydi: pm-m12d12-reja (tayanch 8); o'qiydi: pm-m11d11-refleksiya, pm-m12d10-ish, pm-m12d11-dastur (bo'lmasa — ekran ishlaydi).
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QXato, QIzoh, QXulosa, QKirish, QReja, QTushuncha, QTest, QTestJavob, QMustaqil, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d12-v1', lessonTitle: { uz: "Keyingi olti oyda nima qilasiz?", ru: 'Что вы будете делать следующие полгода?' } }; // 14-Modul 12-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/12-PmNextSteps-v3.md
// 12 ekran (keyssiz PM; 12-Modul 11-dars shakli): kirish → reja → uch yo'nalish → 1-savol → birinchi qadam → 2-savol → rejangiz → yakkama-yakka → yakuniy savol → podium → kartochkalar → yakun.
const HW_TOKENS = [
  { t: { uz: 'reja', ru: 'план' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'birinchi qadam', ru: 'первый шаг' }, l: 62, tp: 16, s: 12, d: 7.5 },
  { t: { uz: '«sana»', ru: '«дата»' }, l: 30, tp: 70, s: 13, d: 8.5 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi) — MD: 3-ekran B · 5-ekran D · 8-ekran C (yangi dars, o'rni shunday qoladi)
const INLINE_KEYS = { s3: 1, s5: 3, s8: 2 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM: emoji o'rniga raqam — S-026)
const RECAPS = {
  3: {
    title: { uz: 'Davom ettirish sababi', ru: 'Причина продолжать' },
    cards: [
      { ic: '1', h: { uz: "Mahsulotda qaror bor: davom ettirish yoki to'xtatish.", ru: 'В продукте есть решение: продолжать или остановить.' } },
      { ic: '2', h: { uz: 'Qaror yonida sabab yoziladi.', ru: 'Рядом с решением пишут причину.' } },
      { ic: '3', h: { uz: 'Sabab — son yoki yozuv: sanoq, yozma tasdiq, odamlar javobi.', ru: 'Причина — число или запись: подсчёт, письменное подтверждение, ответы людей.' }, ask: { uz: 'Mahsulotingiz haqida qaysi son yoki yozuv sizda bor?', ru: 'Какое число или запись о вашем продукте у вас есть?' } }
    ]
  },
  5: {
    title: { uz: 'Birinchi qadam', ru: 'Первый шаг' },
    cards: [
      { ic: '1', h: { uz: 'Oylik maqsad — oy oxirigacha nimaga yetmoqchi ekaningiz.', ru: 'Цель месяца — чего вы хотите достичь к концу месяца.' } },
      { ic: '2', h: { uz: 'Birinchi qadam uni boshlab beradi.', ru: 'Первый шаг запускает её.' } },
      { ic: '3', h: { uz: 'U bir kunda qilinadi va sanasi bor.', ru: 'Он делается за один день, и у него есть дата.' }, ask: { uz: 'Rejangizdagi birinchi qadam qaysi kuni?', ru: 'В какой день первый шаг вашего плана?' } }
    ]
  },
  8: {
    title: { uz: 'Katta qadam', ru: 'Большой шаг' },
    cards: [
      { ic: '1', h: { uz: "Yakkama-yakkada rejangizni Mentor bilan ko'rasiz.", ru: 'В разговоре один на один вы смотрите план с Ментором.' } },
      { ic: '2', h: { uz: "O'zgarishni o'zingiz kiritasiz.", ru: 'Изменения вносите сами.' } },
      { ic: '3', h: { uz: "Bir kunga sig'maydigan birinchi qadam kichraytiriladi.", ru: 'Первый шаг, не помещающийся в один день, уменьшают.' }, ask: { uz: "Birinchi qadamingiz bir kunga sig'adimi?", ru: 'Помещается ли ваш первый шаг в один день?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="nx-test-viz fade-step">{vizual}</div>}
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

// ===== YORDAMCHILAR (prefiks nx- / oor-) =====
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = ' ';
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ipucha — 40 s harakatsizlikda (P-033); rescue — 110 s
const useIpucha = (faol, kalit, ms = 40000) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), ms); return () => clearTimeout(t); }, [faol, kalit, ms]);
  return faol && k;
};
const IPUCHA = (t) => <p className="nx-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('nx-bash', taxmin && 'ix')}>{el}</div>;
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="nx-xq-m">{matn}</span>
  {izoh && <span className="nx-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="nx-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="nx-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);
// «Uchadi» (P3): element nusxasi o'lchab, position: fixed bilan nishonga uchadi (~0,6 s); reduced-motion — darhol
const uchir = (manba, nishon, matn, cb) => {
  if (kamHarakat() || !manba || !nishon || typeof document === 'undefined') { if (cb) cb(); return; }
  const a = manba.getBoundingClientRect(); const b = nishon.getBoundingClientRect();
  const d = document.createElement('div');
  d.className = 'nx-uchar'; d.textContent = matn;
  Object.assign(d.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
  document.body.appendChild(d);
  requestAnimationFrame(() => requestAnimationFrame(() => Object.assign(d.style, { left: b.left + 'px', top: b.top + 'px', width: Math.max(40, b.width) + 'px', height: Math.max(24, b.height) + 'px', opacity: '0.35' })));
  setTimeout(() => { d.remove(); if (cb) cb(); }, 640);
};
// O'qituvchi eslatmasi — faqat Mentor jonli rejimida (MD aytgan joyda)
const Ustoz = ({ satrlar }) => {
  const g = useContext(LiveGateCtx) || {};
  if (!(g.live && g.live.mode === 'mentor')) return null;
  return <div className="nx-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((q, i) => <span key={i}>{tr(q)}</span>)}</div>;
};

// ===== SANA (boshlanganSana — 9.85) =====
const pad2 = (n) => String(n).padStart(2, '0');
const isoOl = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const bugunISO = () => isoOl(new Date());
const isoSana = (s) => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
const kunOy = (s) => { const d = isoSana(s); return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1); };
const KUNLAR = [
  { uz: 'yakshanba', ru: 'воскресенье' }, { uz: 'dushanba', ru: 'понедельник' }, { uz: 'seshanba', ru: 'вторник' }, { uz: 'chorshanba', ru: 'среда' },
  { uz: 'payshanba', ru: 'четверг' }, { uz: 'juma', ru: 'пятница' }, { uz: 'shanba', ru: 'суббота' }
];
// Dars kunidan keyingi shu nomli kun (Mentor misoli kunlari — A-6)
const keyingiKun = (kun) => { const t = new Date(); const d = new Date(t.getFullYear(), t.getMonth(), t.getDate()); let k = (kun - d.getDay() + 7) % 7; if (k === 0) k = 7; d.setDate(d.getDate() + k); return isoOl(d); };
const bayroqFoiz = (sana, bosh) => { const a = isoSana(bosh).getTime(); const b = isoSana(oyQoshISO(bosh, 1)).getTime(); const s = isoSana(sana).getTime(); return Math.max(4, Math.min(92, ((s - a) / Math.max(1, b - a)) * 100)); };
const oyIndeks = (sana, bosh) => { if (sana < bosh) return -1; for (let i = 0; i < 6; i++) if (sana < oyQoshISO(bosh, i + 1)) return i; return 6; };
const DC_MUDDAT = '2027-01-14'; // Diamond Challenge topshirish muddati — rasmiy (tayanch 1.11, 6)
const DC_MATN = { uz: "Diamond Challenge: topshirish muddati — 14.01.2027", ru: 'Diamond Challenge: срок подачи — 14.01.2027' };
// Muddat bayrog'i oyini boshlanganSana dan aniqlaydi; o'tgan bo'lsa ko'rinmaydi; olti oydan uzoq — o'ng chetda «›» (12-FILTR 9, 21)
const muddatOl = (bosh) => { if (DC_MUDDAT < bugunISO()) return null; const i = oyIndeks(DC_MUDDAT, bosh); if (i < 0) return null; return { idx: Math.min(i, 5), tash: i > 5, matn: tr(DC_MATN) }; };

// ===== SAQLASH — pm-m12d12-reja (tayanch 8, A-11) · o'qish: pm-m11d11-refleksiya, pm-m12d10-ish, pm-m12d11-dastur =====
const REJA_KEY = 'pm-m12d12-reja';
const REF_KEY = 'pm-m11d11-refleksiya';
const ISH_KEY = 'pm-m12d10-ish';
const DASTUR_KEY = 'pm-m12d11-dastur';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const YON = ['mahsulot', 'konikma', 'ish'];
const rejaOl = () => { const r = lsO(REJA_KEY); return r && Array.isArray(r.yonalishlar) ? r : null; };
const yonOl = (reja, tur) => (reja && reja.yonalishlar.find(y => y && y.tur === tur)) || null;
const yonToliq = (y) => !!(y && Array.isArray(y.nishonlar) && y.nishonlar[0] && y.nishonlar[5] && y.birinchiQadam && y.sana);
const rejaSoni = (reja) => YON.filter(t => yonToliq(yonOl(reja, t))).length;
const rejaYozYon = (yozuv) => {
  const e = rejaOl() || {};
  const yon = (Array.isArray(e.yonalishlar) ? e.yonalishlar : []).filter(y => y && y.tur !== yozuv.tur);
  yon.push(yozuv); yon.sort((a, b) => YON.indexOf(a.tur) - YON.indexOf(b.tur));
  const d = { boshlanganSana: e.boshlanganSana || bugunISO(), yonalishlar: yon, suhbat: e.suhbat ?? null, savedAt: Date.now() };
  lsY(REJA_KEY, d); return d;
};
const rejaPatch = (patch) => { const e = rejaOl(); if (!e) return null; const d = { ...e, ...patch, savedAt: Date.now() }; lsY(REJA_KEY, d); return d; };
const rejaNishon = (tur, k, matn) => {
  const e = rejaOl(); if (!e) return null;
  const yon = e.yonalishlar.map(y => { if (!y || y.tur !== tur) return y; const n = Array.isArray(y.nishonlar) ? [...y.nishonlar] : [null, null, null, null, null, null]; n[k] = matn || null; return { ...y, nishonlar: n }; });
  const d = { ...e, yonalishlar: yon, savedAt: Date.now() }; lsY(REJA_KEY, d); return d;
};
// Boshqa darslar kalitlari — bo'lmasa taklif tugmasi va qator ko'rinmaydi (tayanch 8)
const taklifCtx = () => {
  const ref = lsO(REF_KEY); const ish = lsO(ISH_KEY); const ds = lsO(DASTUR_KEY);
  const s = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const b = ish && ish.buyurtma && typeof ish.buyurtma === 'object' ? ish.buyurtma : null;
  const xatlar = ish && Array.isArray(ish.xatlar) ? ish.xatlar : [];
  return {
    keyingi: ref && ref.javoblar ? s(ref.javoblar.keyingi) : null,
    buyurtma: b && s(b.nima) ? { nima: s(b.nima), kim: s(b.kim), qachon: s(b.qachon) } : null,
    xatN: xatlar.length, stajXat: xatlar.some(x => x && x.soroq === 'stajirovka'),
    dastur: ds && (ds.dastur === 'diamond' || ds.dastur === 'boshqa') ? ds.dastur : null,
    maslahatchiYoq: !!(ds && ds.maslahatchi !== true)
  };
};

// ===== MENTOR MISOLI — bitta manba (A-6 aynan; tayanch 1.12) =====
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili, logotipsiz
const YON_NOM = { mahsulot: { uz: 'Mahsulot', ru: 'Продукт' }, konikma: { uz: "Ko'nikma", ru: 'Навык' }, ish: { uz: 'Ish', ru: 'Работа' } };
const TANLOV_NOM = {
  davom: { uz: 'Davom ettiraman', ru: 'Продолжаю' }, toxtataman: { uz: "To'xtataman", ru: 'Останавливаю' },
  buyurtma: { uz: 'Buyurtma', ru: 'Заказ' }, stajirovka: { uz: 'Stajirovka', ru: 'Стажировка' }, dastur: { uz: 'Xalqaro dastur', ru: 'Международная программа' }, hali: { uz: 'Hozircha tanlamayman', ru: 'Пока не выбираю' }
};
const MENTOR_REJA = [
  { tur: 'mahsulot', tanlov: 'davom',
    gap: { uz: "Mahsulot — davom ettiraman: uch tashkilotchi bilan \"Doimiy o'yin\"ni sinayman.", ru: 'Продукт — продолжаю: проверю «Постоянную игру» с тремя организаторами.' },
    sabab: { uz: "Uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas.", ru: 'Три организатора дали письменное подтверждение — это ещё не оплата.' },
    kulrang: { uz: "Sabab: uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas.", ru: 'Причина: три организатора дали письменное подтверждение — это ещё не оплата.' },
    oylar: [{ uz: "Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinash", ru: 'Проверить «Постоянную игру» с тремя организаторами в тестовом режиме' }, null,
      { uz: 'Mahalladagi maydon egalari bilan gaplashish', ru: 'Поговорить с владельцами площадок в махалле' }, null, null,
      { uz: 'Boshqa bir mahalla futbol guruhini tekshirish', ru: 'Проверить футбольную группу другой махалли' }],
    qadam: { uz: 'Uch tashkilotchiga yozib, sinash kunini kelishish', ru: 'Написать трём организаторам и договориться о дне проверки' }, kun: 6 },
  { tur: 'konikma', tanlov: null,
    gap: { uz: "Ko'nikma — Backend testlari.", ru: 'Навык — тесты Backend.' },
    kulrang: { uz: 'Backend testlari', ru: 'Тесты Backend' },
    oylar: [{ uz: "O'yinga qo'shilish yo'li uchun Backend testlarini yozish", ru: 'Написать тесты Backend для пути «присоединиться к игре»' }, null, null, null, null,
      { uz: "Yangi o'zgarishni testsiz push qilmaslik — odat", ru: 'Не делать push нового изменения без тестов — привычка' }],
    qadam: { uz: 'Bitta kichik Backend testini yozib, ishga tushirish', ru: 'Написать и запустить один маленький тест Backend' }, kun: 0 },
  { tur: 'ish', tanlov: 'dastur',
    gap: { uz: "Ish — Diamond Challenge'ga jamoa bilan konsept.", ru: 'Работа — концепт для Diamond Challenge с командой.' },
    kulrang: { uz: "Diamond Challenge'ga jamoa bilan konsept", ru: 'Концепт для Diamond Challenge с командой' },
    oylar: [{ uz: "Yana kamida bitta o'quvchi va maslahatchi topish", ru: 'Найти ещё хотя бы одного ученика и наставника-консультанта' },
      { uz: "Maslahatchi va ota-ona bilan ro'yxatdan o'tish", ru: 'Зарегистрироваться с консультантом и родителями' }, null, null, null,
      { uz: "Natija qanday bo'lsa ham, keyingi qadamni Mentor bilan belgilash", ru: 'Каким бы ни был результат, наметить следующий шаг с Ментором' }],
    qadam: { uz: "Konsept qoralamasini sinfdoshlarga ko'rsatish", ru: 'Показать черновик концепта одноклассникам' }, kun: 1 }
];
// 2-ekran kartalari — yo'nalish nomisiz (sortirovka uchun; tayanch 1.12 aynan)
const MENTOR_GAPLAR = [
  { tur: 'mahsulot', gap: { uz: "Davom ettiraman: uch tashkilotchi bilan \"Doimiy o'yin\"ni sinayman.", ru: 'Продолжаю: проверю «Постоянную игру» с тремя организаторами.' } },
  { tur: 'konikma', gap: { uz: 'Backend testlari.', ru: 'Тесты Backend.' } },
  { tur: 'ish', gap: { uz: "Diamond Challenge'ga jamoa bilan konsept.", ru: 'Концепт для Diamond Challenge с командой.' } }
];
const MENTOR_13_JAVOB = { uz: "3 · Keyingi 4 hafta — To'lashga tayyorligini yozgan uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinab ko'raman.", ru: '3 · Следующие 4 недели — проверю «Постоянную игру» в тестовом режиме с тремя организаторами, написавшими о готовности платить.' };
const QADAM_KARTALAR = [
  { matn: { uz: "\"Doimiy o'yin\"ni hamma yoqtiradigan qilaman", ru: 'Сделаю «Постоянную игру» такой, чтобы нравилась всем' }, qachon: { uz: 'vaqt topilganda', ru: 'когда найду время' }, tur: 'mavhum' },
  { matn: { uz: 'Uch tashkilotchiga yozib, sinash kunini kelishaman', ru: 'Напишу трём организаторам и договорюсь о дне проверки' }, qachon: { uz: 'shanba', ru: 'суббота' }, tur: 'togri' },
  { matn: { uz: 'Ilovani butun shaharga mashhur qilaman', ru: 'Сделаю приложение известным на весь город' }, qachon: { uz: 'olti oy ichida', ru: 'за полгода' }, tur: 'vada' }
];
const SUHBAT_SAVOL = [
  { uz: 'Uch yo\'nalishdan qaysi biri siz uchun birinchi?', ru: 'Какое из трёх направлений для вас первое?' },
  { uz: 'Bu qadamda yordam kerak bo\'lsa, kim yordam beradi?', ru: 'Если на этом шаге нужна помощь, кто поможет?' },
  { uz: 'Birinchi qadamingiz bir kunga sig\'adimi?', ru: 'Помещается ли ваш первый шаг в один день?' }
];
const mentorQatorlar = ({ bosh, joylangan = 3, bayroqlar = false, yangi = null, olib = null } = {}) => MENTOR_REJA.map((y, i) => {
  const bor = i < joylangan;
  const sana = keyingiKun(y.kun);
  return {
    tur: y.tur, nom: tr(YON_NOM[y.tur]),
    chip: bor && y.tanlov ? tr(TANLOV_NOM[y.tanlov]) : null,
    kulrang: bor ? tr(y.kulrang) : null,
    oylar: y.oylar.map((o, k) => (bor && o && !(olib && olib.tur === y.tur && olib.k === k) ? tr(o) : null)),
    yangi: yangi === y.tur, kechik: yangi === y.tur ? [0.15, 0.3, 0.45, 0.6, 0.75, 0.9] : null,
    bayroq: bayroqlar ? { foiz: bayroqFoiz(sana, bosh), matn: tr(KUNLAR[y.kun]) + ' · ' + kunOy(sana) } : null
  };
});
const oquvchiQatorlar = (reja, { yangi = null } = {}) => YON.map(tur => {
  const y = yonOl(reja, tur);
  if (!y) return { tur, nom: tr(YON_NOM[tur]), oylar: [null, null, null, null, null, null] };
  return {
    tur, nom: tr(YON_NOM[tur]), ok: yonToliq(y),
    chip: y.tanlov ? tr(TANLOV_NOM[y.tanlov]) : null,
    kulrang: tur === 'mahsulot' ? y.sabab : y.nima,
    oylar: Array.isArray(y.nishonlar) ? y.nishonlar.slice(0, 6) : [null, null, null, null, null, null],
    yangi: yangi === tur, kechik: yangi === tur ? [0.1, 0.2, 0.3, 0.4, 0.5, 0.6] : null,
    bayroq: y.sana ? { foiz: bayroqFoiz(y.sana, (reja && reja.boshlanganSana) || bugunISO()), matn: kunOy(y.sana), yangi: yangi === tur } : null
  };
});

// ===== BITTA VIZUAL — «Olti oylik reja taxtasi» (OltiOyReja; 163/180) =====
// qolip-maket: oor-katak oor-qator oor-bayroq oor-tahrir
const Bayroq = ({ foiz, matn, yangi }) => (
  <span className={cxx('oor-bayroq', yangi && 'yangi', foiz > 55 && 'chap')} style={{ left: foiz + '%' }}><i aria-hidden="true" />{matn && <small>{matn}</small>}</span>
);
const OltiOyReja = ({ qatorlar, matnli = false, yorliq, belgi, chizil = false, muddat, joriy, onKatak, onTahrir, tahrirChorla = false, bayroqJoy = false }) => (
  <div className={cxx('oor', matnli ? 'matnli' : 'kichik', chizil && 'chizil')}>
    {belgi && <div className="oor-bosh">{yorliq && <span className="oor-yorliq">{yorliq}</span>}<span className="oor-belgi fade-step">{belgi}</span></div>}
    <div className="oor-grid">
      <span className="oor-burchak">{!belgi && yorliq && <span className="oor-yorliq">{yorliq}</span>}</span>
      {[0, 1, 2, 3, 4, 5].map(k => <span key={k} className={cxx('oor-oy', k === 0 && 'bugun')} style={chizil ? { animationDelay: (0.35 + k * 0.1) + 's' } : undefined}>{k === 0 && <em>{tr({ uz: 'Bugun', ru: 'Сегодня' })}</em>}{k + 1}-{tr({ uz: 'oy', ru: 'й мес.' })}</span>)}
      {muddat && <>
        <span className="oor-m-bosh" />
        {[0, 1, 2, 3, 4, 5].map(k => <span key={'m' + k} className="oor-m">{k === muddat.idx && <span className={cxx('oor-dc', k >= 3 && 'ong', muddat.tash && 'tash')}><i aria-hidden="true" />{muddat.matn}{muddat.tash ? ' ›' : ''}</span>}</span>)}
      </>}
      {qatorlar.map((q, r) => (
        <React.Fragment key={q.tur || r}>
          <div className={cxx('oor-qator', joriy === q.tur && 'joriy', q.yangi && 'yangi', q.chaqnadi && 'chaqnadi')} data-nx-qator={q.tur} style={chizil ? { animationDelay: (r * 0.12) + 's' } : undefined}>
            <span className="oor-nq">{q.nom ? <b className="oor-nom" style={q.nomKechik != null ? { animationDelay: q.nomKechik + 's' } : undefined}>{q.nom}{q.ok && <span className="oor-ok">✓</span>}</b> : <span className="oor-nom-bosh" />}
            {q.chip && <span className="oor-chip">{q.chip}</span>}</span>
            {q.kulrang && <span className="oor-kul">{q.kulrang}</span>}
            {onTahrir && q.ok && <button type="button" className={cxx('oor-tahrir', tahrirChorla && 'chorla')} onClick={() => onTahrir(q.tur)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button>}
          </div>
          {[0, 1, 2, 3, 4, 5].map(k => {
            const t = q.oylar ? q.oylar[k] : null;
            const bos = !!(onKatak && q.ok && !t && k >= 1 && k <= 4);
            const ichi = <>
              {matnli && <small className="oor-oyn">{k + 1}-{tr({ uz: 'oy', ru: 'й мес.' })}</small>}
              {k === 0 && q.ustYorliq && <small className="oor-ust">{q.ustYorliq}</small>}
              {t ? (matnli ? <span className="oor-t">{t}</span> : <span className="oor-tick">✓</span>) : (bos ? <span className="oor-plus">+</span> : null)}
              {k === 0 && bayroqJoy && <span className="oor-bjoy" aria-hidden="true" />}
              {k === 0 && q.bayroq && <Bayroq {...q.bayroq} matn={matnli ? q.bayroq.matn : null} />}
            </>;
            const cls = cxx('oor-katak', t ? 'tola' : 'bosh', k === 0 && 'k0', q.yonKatak === k && 'yonadi', q.halqa === k && 'halqa', k === 0 && q.bayroq && matnli && 'bayroqli', bos && 'bos', q.kechik && t && 'kir');
            const st = q.kechik && t ? { animationDelay: q.kechik[k] + 's' } : undefined;
            return bos
              ? <button key={k} type="button" className={cls} data-nx-katak={q.tur + '-' + k} style={st} onClick={() => onKatak(q.tur, k)} aria-label={tr(YON_NOM[q.tur]) + ' · ' + (k + 1) + tr({ uz: '-oy maqsadi', ru: '-й месяц: цель' })}>{ichi}</button>
              : <div key={k} className={cls} data-nx-katak={q.tur + '-' + k} style={st}>{ichi}</div>;
          })}
        </React.Fragment>
      ))}
    </div>
  </div>
);
// Telefon «Maydon Jamoa» — faqat 2-ekranda, chapda (≈170×272); nom o'z yashilida, logotipsiz
const Telefon = () => (
  <div className="nx-tel">
    <div className="nx-tel-ekran">
      <span className="nx-tel-ilova">Maydon Jamoa</span>
      <span className="nx-tel-sar">{tr({ uz: "O'yin", ru: 'Игра' })}</span>
      <div className="nx-tel-oyin">
        <b>{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
        <span>{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
        <span className="nx-tel-son"><span className="nx-tel-bar"><i /></span>8{NB}/{NB}10</span>
      </div>
      <span className="nx-tel-tug">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div>
  </div>
);
// Testlardan keyingi kichik taxta (ikkinchi misol yoki Mentor misoli; SABOQ 4)
const MiniTaxta = ({ nom, chip, sabab, oy1, bayroq, izoh }) => (
  <div className="nx-mini">
    <span className="oor-yorliq">{nom}</span>
    <div className="nx-mini-r">
      <div className="nx-mini-q"><b>{tr(YON_NOM.mahsulot)}</b>{chip && <span className="oor-chip">{chip}</span>}{sabab && <span className="nx-mini-ok">{sabab}</span>}</div>
      {oy1 && <div className="nx-mini-k"><small>1-{tr({ uz: 'oy', ru: 'й мес.' })}</small><span>{oy1}</span>{bayroq && <Bayroq foiz={20} matn={bayroq} yangi />}{izoh && <em>{izoh}</em>}</div>}
    </div>
  </div>
);

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz so'rovnoma — J-026: har variantga o'z javobi, «Qiziq fikr!») =====
const HOOK_OPTS = [
  { id: 'mahsulot', t: { uz: 'Mahsulotimni davom ettirishga', ru: 'На продолжение своего продукта' }, javob: { uz: <><b>Qiziq fikr!</b> Mahsulot — rejaning bir qismi. Bugun yoniga o'rganish va ishni ham yozasiz.</>, ru: <><b>Интересная мысль!</b> Продукт — часть плана. Сегодня рядом запишете ещё учёбу и работу.</> } },
  { id: 'konikma', t: { uz: "Yangi bir narsani o'rganishga", ru: 'На изучение чего-то нового' }, javob: { uz: <><b>Qiziq fikr!</b> O'rganish — rejaning bir qismi. Bugun yoniga mahsulot va ishni ham yozasiz.</>, ru: <><b>Интересная мысль!</b> Учёба — часть плана. Сегодня рядом запишете ещё продукт и работу.</> } },
  { id: 'ish', t: { uz: 'Birinchi buyurtma yoki dasturga', ru: 'На первый заказ или программу' }, javob: { uz: <><b>Qiziq fikr!</b> Ish — rejaning bir qismi. Bugun yoniga mahsulot va o'rganishni ham yozasiz.</>, ru: <><b>Интересная мысль!</b> Работа — часть плана. Сегодня рядом запишете ещё продукт и учёбу.</> } }
];
const US0 = [
  { uz: "Javoblarni muhokama qilmang va kim nimani tanlaganini sanamang — bugun har o'quvchi uchala yo'nalishni o'zi yozadi. «Buyurtma yoki dastur» — 10, 11-darsdagi ishning davomi.", ru: 'Не обсуждайте ответы и не считайте, кто что выбрал — сегодня каждый сам напишет все три направления. «Заказ или программа» — продолжение 10-го и 11-го уроков.' },
  { uz: "Sinfdan so'rang: «Uchalasidan qaysi biri uchun shu haftaning o'zida biror narsa qila olasiz?»", ru: 'Спросите класс: «Для какого из трёх вы можете что-то сделать уже на этой неделе?»' }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const reja = useMemo(() => rejaOl(), []);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  const qatorlar = reja
    ? oquvchiQatorlar(reja)
    : YON.map((tur, i) => ({ tur, nom: picked ? tr(YON_NOM[tur]) : null, nomKechik: picked ? i * 0.1 : null, chaqnadi: picked === tur, oylar: [null, null, null, null, null, null] }));
  const op = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('nx-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Keyingi olti oyda <A>nima qilasiz?</A></>, ru: <>Что вы будете делать <A>следующие полгода?</A></> })}
          mentor={<Mentor>{tr({ uz: "Kursning oxirgi moduliga yetdingiz. Vaqtingizning ko'pi nimaga ketishini o'ylab, o'zingizga yaqin javobni belgilang.", ru: 'Вы дошли до последнего модуля курса. Подумайте, на что уйдёт больше всего времени, и отметьте близкий вам ответ.' })}</Mentor>}
          maket={<OltiOyReja yorliq={reja ? tr({ uz: 'Rejam', ru: 'Мой план' }) : tr({ uz: 'Olti oy', ru: 'Полгода' })} qatorlar={qatorlar} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={op && <p className="hook-ack fade-step">{tr(op.javob)}</p>}
        />
        <Ustoz satrlar={US0} />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual o'zi chiziladi — DE-200) =====
const REJA = [
  { t: { uz: "Mentor rejasidagi uch gapni joyiga qo'yasiz", ru: 'Расставите по местам три фразы из плана Ментора' }, teg: { uz: "yo'nalish", ru: 'направление' } },
  { t: { uz: 'Birinchi oyga boshlanish kunini tanlaysiz', ru: 'Выберете день начала для первого месяца' }, teg: { uz: 'birinchi qadam', ru: 'первый шаг' } },
  { t: { uz: "Mahsulot, ko'nikma va ish uchun o'z rejangizni yozasiz", ru: 'Напишете свой план для продукта, навыка и работы' }, teg: { uz: 'olti oylik reja', ru: 'план на полгода' } },
  { t: { uz: "Rejangizni Mentor bilan yakkama-yakka ko'rasiz", ru: 'Разберёте свой план с Ментором один на один' }, teg: { uz: 'yakkama-yakka', ru: 'один на один' } }
];
const US1 = [
  { uz: "Bu darsda yakkama-yakka — 10 daqiqa, navbat bilan: navbatni siz belgilaysiz (stol tartibi yoki tasodifiy) — tez saqlaganlar ustunlik olmaydi; darsda ulgurmaganlar bilan vaqtni alohida belgilaysiz.", ru: 'Разговор один на один — 10 минут, по очереди: очередь задаёте вы (по партам или случайно) — кто быстрее сохранил, преимущества не получает; с теми, кто не успел, время назначаете отдельно.' },
  { uz: "Farq: 11-Modul 15-darsida — roadmap, risklar va qadamlar; 12-Modul 11-darsida — pitch da'volari; 13-Modul 11-darsida — ortga qarash (shaxsiy hisobot); bugun — oldinga qarash.", ru: 'Разница: в 15-м уроке 11-го модуля — роадмап, риски и шаги; в 11-м уроке 12-го модуля — заявления питча; в 11-м уроке 13-го модуля — взгляд назад (личный отчёт); сегодня — взгляд вперёд.' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [tayyor, setTayyor] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTayyor(true), kamHarakat() ? 0 : 1300); return () => clearTimeout(t); }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun keyingi olti oy uchun <A>reja yozasiz.</A></>, ru: <>Сегодня вы напишете <A>план на следующие полгода.</A></> })}
        mentor={<Mentor>{tr({ uz: "Rejani o'zingiz yozasiz, Mentor misoli — faqat namuna. Yozgach, uni Mentor bilan yakkama-yakka ko'rasiz — navbat bilan.", ru: 'План вы пишете сами, пример Ментора — только образец. Потом разберёте его с Ментором один на один — по очереди.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida — Mentor bilan yakkama-yakka: olti oylik reja', ru: 'В конце урока — один на один с Ментором: план на полгода' })}
        chap={<OltiOyReja chizil bayroqJoy qatorlar={YON.map(tur => ({ tur, nom: tr(YON_NOM[tur]), oylar: [null, null, null, null, null, null] }))} />}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      />
      <Ustoz satrlar={US1} />
    </Stage>
  );
};

// ===== SCREEN 2 — UCH YO'NALISH (QTushuncha; bashorat → 3 karta ketma-ket → taxtaga uchadi; E 42, E 53) · nishon threeLines =====
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bittasi', ru: 'Одна' } }, { k: '2', t: { uz: 'Ikkitasi', ru: 'Две' } }, { k: '3', t: { uz: 'Uchalasi', ru: 'Все три' } }];
const S2_XATO = {
  'mahsulot-konikma': { uz: "Gap ilovaning o'zi haqida — o'rganish ham, dastur ham emas.", ru: 'Фраза о самом приложении — не об учёбе и не о программе.' },
  'mahsulot-ish': { uz: "Gap ilovaning o'zi haqida — o'rganish ham, dastur ham emas.", ru: 'Фраза о самом приложении — не об учёбе и не о программе.' },
  'konikma-mahsulot': { uz: "Backend — ilovaniki, lekin gap nimani o'rganish haqida.", ru: 'Backend — часть приложения, но фраза о том, что изучать.' },
  'konikma-ish': { uz: "Bu buyurtma ham, dastur ham emas — o'rganiladigan narsa.", ru: 'Это не заказ и не программа — это то, что изучают.' },
  'ish-mahsulot': { uz: 'Bu ilovaning o\'zi emas — dasturga ariza.', ru: 'Это не само приложение — это заявка в программу.' },
  'ish-konikma': { uz: "Bu o'qish emas — xalqaro dasturga ariza.", ru: 'Это не учёба — это заявка в международную программу.' }
};
const US2 = [
  { uz: "Eng ko'p adashish — «Backend testlari»ni Mahsulotga qo'yish: Backend mahsulotniki, lekin bu gap — Mentor nimani o'rganishi haqida. Diamond Challenge konsepti ham mahsulotdan o'sadi, lekin u — dasturga ariza, ya'ni Ish yo'nalishi.", ru: 'Чаще всего ошибаются, ставя «Тесты Backend» в Продукт: Backend — часть продукта, но фраза о том, что Ментор будет изучать. Концепт Diamond Challenge растёт из продукта, но это заявка в программу, то есть Работа.' },
  { uz: "Mentor misolida hamma oy to'lmagan: 1-oy va 6-oy bor, oraliq oylar — keyin aniqlashadi; 18 katakni to'ldirish talab qilinmaydi. Sinfga savol: «Sizning rejangizda mahsulotdan tashqari nima bor?»", ru: 'В примере Ментора заполнены не все месяцы: есть 1-й и 6-й, промежуточные уточнятся позже; заполнять 18 клеток не требуется. Вопрос классу: «Что в вашем плане есть кроме продукта?»' }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [uchish, setUchish] = useState(false);
  const [yangi, setYangi] = useState(null);
  const xatoRef = useRef(false);
  const kartaRef = useRef(null);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done && !uchish, q);
  const rescue = useIpucha(!!taxmin && !done && !uchish, q, 110000);
  const bosh = useMemo(() => bugunISO(), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'concept', screenIdx: screen, correct: !xatoRef.current, picked: true, solved: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = (tur) => {
    if (done || uchish || !taxmin) return;
    const k = MENTOR_GAPLAR[q];
    if (tur !== k.tur) { xatoRef.current = true; if (achMiss) achMiss.miss(screen); setXato({ tur, kalit: k.tur + '-' + tur, n: Date.now() }); return; }
    setXato(null); setUchish(true);
    uchir(kartaRef.current, document.querySelector('[data-nx-qator="' + tur + '"]'), '«' + tr(k.gap) + '»', () => {
      setQ(n => n + 1); setUchish(false); setYangi(tur); setTimeout(() => setYangi(null), 1200);
    });
  };
  const joriyKarta = !done && MENTOR_GAPLAR[q];
  const taxta = <OltiOyReja matnli yorliq={tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} qatorlar={mentorQatorlar({ bosh, joylangan: q, yangi })} muddat={q >= 3 ? muddatOl(bosh) : null} />;
  const vizual = tugadi ? taxta : (
    <div className="nx-s2">
      <Telefon />
      <div className="nx-s2-o">
        {joriyKarta && <div ref={kartaRef} key={q} className={cxx('nx-gap', xato && 'silk', uchish && 'ketdi')}><small>{q + 1}{NB}/{NB}3</small><span>«{tr(joriyKarta.gap)}»</span></div>}
        {taxta}
      </div>
    </div>
  );
  const tx = S2_TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · yo'nalish", ru: 'Понятие · направление' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: 'Avval belgilang', ru: 'Сначала отметьте' }) : tr({ uz: `Gapni joylang (${q}/3)`, ru: `Расставьте фразы (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Mentor rejasidagi uch gap <A>qayerga tushadi?</A></>, ru: <>Куда попадут <A>три фразы из плана Ментора?</A></> })}
        mentor={<Mentor>{tr({ uz: "Har kartani o'qing va tugmalardan mosini bosing: Mahsulot, Ko'nikma yoki Ish.", ru: 'Прочитайте каждую карточку и нажмите подходящую кнопку: Продукт, Навык или Работа.' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Mentor rejasidagi uch gapdan nechtasi mahsulot haqida?', ru: 'Сколько из трёх фраз плана Ментора — о продукте?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        vizual={vizual}
        harakat={!done && <div className="nx-harakat s2">
          <div className={cxx('nx-tugmalar', taxmin && !uchish && 'chorla')}>
            {YON.map(tur => <QChip key={tur} holat={xato && xato.tur === tur ? 'err' : undefined} silk={!!(xato && xato.tur === tur)} className={cxx(rescue && joriyKarta && joriyKarta.tur === tur && 'rescue')} disabled={!taxmin || uchish} onClick={() => bos(tur)}>{tr(YON_NOM[tur])}</QChip>)}
          </div>
          {xato && <QXato key={xato.n}>{tr(S2_XATO[xato.kalit])}</QXato>}
          {!xato && q === 1 && <QIzoh>{tr({ uz: "Mahsulotda qaror bor — davom ettirish yoki to'xtatish; mahsulot haqida xulosa — son yoki yozuv bilan.", ru: 'В продукте есть решение — продолжать или остановить; вывод о продукте — с числом или записью.' })}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Gap ilova, o'rganish yoki ariza haqidami — qaysi biri?", ru: 'Фраза о приложении, об учёбе или о заявке — о чём?' }))}
        </div>}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === '1'} aslida={tr({ uz: 'bittasi', ru: 'одна' })} />}
          matn={tr({ uz: "Bizda olti oylik reja uch yo'nalishdan iborat: mahsulot, ko'nikma va ish.", ru: 'У нас план на полгода состоит из трёх направлений: продукт, навык и работа.' })}
          izoh={tr({ uz: "Mentor misolida hamma oy to'lmagan: 1-oy va 6-oy bor, oraliq oylar keyin aniqlashadi.", ru: 'В примере Ментора заполнены не все месяцы: есть 1-й и 6-й, промежуточные уточнятся позже.' })} />}
      />
      <Ustoz satrlar={US2} />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen; INLINE_KEYS.s3 = 1; ikkinchi misol — uy vazifalari ilovasi) · nishon realReason =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: '1-savol', ru: 'Вопрос 1' })}
    questionText="Uy vazifalari ilovangizni davom ettirasiz. Rejaga qaysi sababni yozasiz?"
    question={tr({ uz: <h2 className="title h-ask">Uy vazifalari ilovangizni davom ettirasiz. Rejaga <A>qaysi sababni yozasiz?</A></h2>, ru: <h2 className="title h-ask">Вы продолжаете своё приложение для домашних заданий. <A>Какую причину запишете в план?</A></h2> })}
    options={[
      { uz: "Ko'p vaqt sarfladim, endi tashlolmayman", ru: 'Я потратил много времени, теперь не могу бросить' },
      { uz: "Sanoqda qaytganlar soni ko'rinib turibdi", ru: 'В подсчёте видно число вернувшихся' },
      { uz: 'Olti oyda uni butun maktab ishlatib ketadi', ru: 'Через полгода им будет пользоваться вся школа' },
      { uz: 'Mentor davom ettirishimni aytib qo\'ydi', ru: 'Ментор сказал мне продолжать' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Sanoq sahifasi — dalil: kim qaytayotganini ko'rsatadi.", ru: 'Страница подсчёта — довод: показывает, кто возвращается.' }}
    explainWrong={{
      0: { uz: "Sarflangan vaqt ilova kerakligini ko'rsatadimi?", ru: 'Показывает ли потраченное время, что приложение нужно?' },
      2: { uz: "Bu va'da. Hozir qaysi son yoki yozuv bor?", ru: 'Это обещание. Какое число или запись есть сейчас?' },
      3: { uz: 'Qaror sizniki — u qaysi dalilga tayanadi?', ru: 'Решение ваше — на какой довод оно опирается?' },
      default: { uz: 'Sabab — son yoki yozuv. Qaysi variantda bor?', ru: 'Причина — число или запись. В каком варианте она есть?' }
    }}
    vizual={<MiniTaxta nom={tr({ uz: 'Uy vazifalari ilovasi', ru: 'Приложение для домашних заданий' })} chip={tr(TANLOV_NOM.davom)} sabab={tr({ uz: 'sanoq: qaytganlar soni', ru: 'подсчёт: число вернувшихся' })} />} />
);

// ===== SCREEN 4 — BIRINCHI QADAM (QTushuncha; 13-Modul javobi 1-oy katagiga uchadi → 3 karta, to'g'risi bayroqchaga aylanadi) =====
const US4 = [
  { uz: "Mentorning 1-oy maqsadi — 13-Modul shaxsiy hisobotidagi uchinchi javob: «keyingi 4 hafta» rejasi bugun olti oylik rejaning birinchi oyiga aylandi. «Test rejim» — Pro'da real pul yo'q.", ru: 'Цель Ментора на 1-й месяц — третий ответ из личного отчёта 13-го модуля: план «на 4 недели» стал первым месяцем плана на полгода. «Тестовый режим» — в Pro нет реальных денег.' },
  { uz: "11-Modul 15-darsida «qadam» — riskni kamaytiradigan bitta aniq ish edi; bugun birinchi qadamning sanasi ham bor. Sana o'tsa — sababini yozib, yangi sana qo'yiladi (6-ekran kulrang qatori). Mentorning «shanba»si — namuna.", ru: 'В 15-м уроке 11-го модуля «шаг» — одно конкретное дело, снижающее риск; сегодня у первого шага есть и дата. Если дата прошла — пишут причину и ставят новую дату (серая строка 6-го экрана). «Суббота» Ментора — образец.' }
];
const VARAQ_QATOR = [
  { uz: "1 · O'z qarorim bilan nima qildim?", ru: '1 · Что я сделал своим решением?' },
  { uz: "2 · Qaysi qarorim noto'g'ri chiqdi va buni qaysi dalil ko'rsatdi?", ru: '2 · Какое решение оказалось неверным и какой довод это показал?' }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [faza, setFaza] = useState(storedAnswer ? 2 : 0); // 0 — varaq kirdi · 1 — 3-qator yondi · 2 — kartalar
  const [tanlangan, setTanlangan] = useState(storedAnswer ? 1 : null);
  const [xato, setXato] = useState(null);
  const [uchish, setUchish] = useState(false);
  const [yashil, setYashil] = useState(false);
  const qatorRef = useRef(null);
  const kartaRefs = useRef([]);
  const bosh = useMemo(() => bugunISO(), []);
  const done = tanlangan === 1;
  const tugadi = useTugadi(done, 1500, !!storedAnswer);
  const ipucha = useIpucha(faza >= 2 && !done && !uchish, xato ? xato.n : 0);
  useEffect(() => {
    if (storedAnswer) return undefined;
    if (kamHarakat()) { setFaza(2); return undefined; }
    const t1 = setTimeout(() => setFaza(1), 700);
    const t2 = setTimeout(() => uchir(qatorRef.current, document.querySelector('[data-nx-katak="mahsulot-0"]'), tr(MENTOR_13_JAVOB), () => setFaza(2)), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'concept', screenIdx: screen, correct: true, picked: true, solved: true }); }, [done]); // eslint-disable-line
  const tanla = (i) => {
    if (faza < 2 || done || uchish) return;
    const k = QADAM_KARTALAR[i];
    if (k.tur !== 'togri') { setXato({ i, n: Date.now() }); return; }
    setXato(null); setUchish(true);
    uchir(kartaRefs.current[i], document.querySelector('[data-nx-katak="mahsulot-0"]'), tr(k.matn), () => { setTanlangan(i); setUchish(false); setYashil(true); setTimeout(() => setYashil(false), 1100); });
  };
  const shanba = keyingiKun(6);
  const qatorlar = mentorQatorlar({ bosh, olib: faza < 2 ? { tur: 'mahsulot', k: 0 } : null }).map(q => q.tur !== 'mahsulot' ? q : {
    ...q, halqa: faza >= 2 && !done ? 0 : null, yonKatak: yashil ? 0 : null,
    ustYorliq: faza >= 2 && !done ? tr({ uz: '13-Moduldagi «keyingi 4 hafta» javobidan', ru: 'Из ответа «следующие 4 недели» в 13-м модуле' }) : null,
    bayroq: done ? { foiz: bayroqFoiz(shanba, bosh), matn: tr(KUNLAR[6]) + ' · ' + kunOy(shanba), yangi: true } : null
  });
  const taxta = <OltiOyReja matnli yorliq={tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} qatorlar={qatorlar} />;
  const vizual = faza < 2 && !tugadi ? (
    <div className="nx-s4">
      <div className="nx-varaq">
        <span className="oor-yorliq">{tr({ uz: '13-Modul · shaxsiy hisobot', ru: 'Модуль 13 · личный отчёт' })}</span>
        {VARAQ_QATOR.map((v, i) => <p key={i} className="nx-varaq-q">{tr(v)}</p>)}
        <p ref={qatorRef} className={cxx('nx-varaq-q', 'uch', faza >= 1 && 'yondi')}>{tr(MENTOR_13_JAVOB)}</p>
      </div>
      {taxta}
    </div>
  ) : taxta;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · birinchi qadam', ru: 'Понятие · первый шаг' })} screen={screen} scrollSignal={faza} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Kartani tanlang', ru: 'Выберите карточку' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Birinchi oydagi maqsad <A>qaysi kuni boshlanadi?</A></>, ru: <>В какой день <A>начинается цель первого месяца?</A></> })}
        mentor={<Mentor>{tr({ uz: "1-oy katagidagi gapni o'qing va uni boshlab beradigan kartani bosing.", ru: 'Прочитайте фразу в клетке 1-го месяца и нажмите карточку, с которой она начнётся.' })}</Mentor>}
        vizual={vizual}
        harakat={faza >= 2 && !done && <div className="nx-harakat">
          <div className={cxx('nx-qadamlar', !uchish && 'chorla')}>
            {QADAM_KARTALAR.map((k, i) => (
              <button key={i} type="button" ref={el => { kartaRefs.current[i] = el; }} className={cxx('nx-qk', xato && xato.i === i && 'xato silk')} disabled={uchish} onClick={() => tanla(i)}>
                <b>{tr(k.matn)}</b><small>{tr(k.qachon)}</small>
              </button>
            ))}
          </div>
          {xato && <QXato key={xato.n}>{xato.i === 0 ? tr({ uz: "Buni qachon qilib bo'lganingizni qanday bilasiz?", ru: 'Как вы узнаете, что это уже сделано?' }) : tr({ uz: "Bu olti oyning natijasi — bir kunda qilinmaydi.", ru: 'Это итог полугода — за один день не делается.' })}</QXato>}
          {ipucha && IPUCHA(tr({ uz: "Har kartadagi «qachon» qismiga qarang.", ru: 'Посмотрите на часть «когда» в каждой карточке.' }))}
        </div>}
        xulosa={done && <XulosaQ matn={tr({ uz: 'Bu darsda birinchi qadam — sanasi bor, bir kunda qilinadigan aniq harakat.', ru: 'На этом уроке первый шаг — конкретное действие с датой, которое делается за один день.' })}
          izoh={tr({ uz: "1-oy katagidagi gap — oylik maqsad: oy oxirigacha nimaga yetmoqchi ekaningiz.", ru: 'Фраза в клетке 1-го месяца — цель месяца: чего вы хотите достичь к концу месяца.' })} />}
      />
      <Ustoz satrlar={US4} />
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s5 = 3; ikkinchi misol — kitob almashish ilovasi) · nishon firstStep =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: '2-savol', ru: 'Вопрос 2' })}
    questionText="Kitob ilovangizning 1-oy maqsadi — sinfda almashish boshlansin. Birinchi qadam qaysi?"
    question={tr({ uz: <h2 className="title h-ask">Kitob ilovangizning 1-oy maqsadi — sinfda almashish boshlansin. <A>Birinchi qadam qaysi?</A></h2>, ru: <h2 className="title h-ask">Цель вашего приложения для книг на 1-й месяц — начать обмен в классе. <A>Какой первый шаг?</A></h2> })}
    options={[
      { uz: 'Ilovani hamma yoqtiradigan qilib chiqarish', ru: 'Выпустить приложение, которое понравится всем' },
      { uz: 'Vaqt topilganda dizaynini yangilab qo\'yish', ru: 'Обновить дизайн, когда найдётся время' },
      { uz: 'Sinfdoshlar o\'zi topib kelishini kutib turish', ru: 'Ждать, пока одноклассники сами найдут' },
      { uz: "Juma kuni uch sinfdoshga ilovani ko'rsatish", ru: 'В пятницу показать приложение трём одноклассникам' }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Aniq kun bor, harakat bir kunda qilinadi.', ru: 'Есть точный день, действие делается за один день.' }}
    explainWrong={{
      0: { uz: 'Hamma yoqtirganini qachon va qanday bilasiz?', ru: 'Когда и как вы узнаете, что понравилось всем?' },
      1: { uz: "Vaqt topilganda — qaysi kun? Sanasi yo'q.", ru: '«Когда найдётся время» — это какой день? Даты нет.' },
      2: { uz: "Kutish — harakat emas. O'zingiz nima qilasiz?", ru: 'Ждать — не действие. Что сделаете вы сами?' },
      default: { uz: "Birinchi qadamda nima bo'lishi kerak edi?", ru: 'Что должно быть в первом шаге?' }
    }}
    vizual={<MiniTaxta nom={tr({ uz: 'Kitob almashish ilovasi', ru: 'Приложение для обмена книгами' })} oy1={tr({ uz: 'Sinfda almashish boshlansin', ru: 'Начать обмен в классе' })} bayroq={tr(KUNLAR[5])} />} />
);

// ===== 6-EKRAN TEKSHIRUVI (PM-108 — node sinovi shu bo'lakni o'qiydi; ikki tilli, katta-kichik harf farqsiz) =====
// TEKSHIRUV-BOSH
const normT = (s) => String(s || '').toLowerCase().replace(/[\u2018\u2019\u02BB\u02BC\u00B4\x60]/g, "'");
const oyQoshISO = (s, n) => { const [y, m, d] = String(s).split('-').map(Number); const t = new Date(y, m - 1 + n, d); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); };
const PII_RE = /@|t\.me\/|\+998|https?:|www\.|(?:\d[\s\-()]*){9,}/i;
const VADA_RE = /albatta|mashhur bo'l|tez orada|aniq bo'ladi|katta bo'l|hammasi|обязательно|популярн|скоро|точно буд|стан(?:у|ет) больш/;
const SARF_RE = /ko'p vaqt|mehnat qildim|tashlolmayman|afsus|много времени|потратил|жалко|не могу бросить/;
const DALIL_RE = /\d|sanoq|tasdiq|yozuv|javob|suhbat|vaqt|ustuvor|maktab|qiziq|подсч[её]т|подтвержд|запис|ответ|разговор|врем|приоритет|школ|интерес/;
const MAVHUM_SOZ = ['harakat', 'qilaman', "o'rganaman", 'yaxshilayman', 'boshlayman', "o'ylab", "ko'raman", 'попробую', 'постараюсь', 'изучу', 'улучшу', 'начну', 'подумаю'];
const INVEST_RE = /investitsiya|investor|ulush|инвест|долю|доля/;
const PUL_RE = /real to'lov|pul olaman|karta raqam|реальн\S* оплат|получу деньги|номер карт/;
const UPWORK_RE = /upwork|frilans sayt|фриланс[- ]сайт/;
const mavhumQadam = (s) => { const w = normT(s).replace(/[.,!?;:«»"()]/g, ' ').split(/\s+/).filter(Boolean); return w.length > 0 && w.every(x => MAVHUM_SOZ.includes(x)); };
const yonMaydon = (tur) => (tur === 'mahsulot' ? ['sabab', 'm1', 'm6', 'qadam'] : ['nima', 'm1', 'm6', 'qadam']);
const yonMax = (tur) => ({ sabab: 120, nima: tur === 'konikma' ? 80 : 100, m1: 100, m6: 100, qadam: 80 });
// d: { tanlov, sabab, nima, m1, m6, qadam, sana } · natija: null | { m (maydon), x (xato turi), n?, blok }
const tekshirYon = (tur, d, bugun, bosh, otkazilgan = []) => {
  const maydon = yonMaydon(tur); const max = yonMax(tur); const v = (f) => String(d[f] || '').trim();
  if (tur !== 'konikma' && !d.tanlov) return { m: 'tanlov', x: 'tanlov', blok: true };
  for (const f of maydon) if (!v(f)) return { m: f, x: 'bosh', blok: true };
  for (const f of maydon) if (v(f).length > max[f]) return { m: f, x: 'uzun', n: max[f], blok: true };
  if (!d.sana) return { m: 'sana', x: 'sanaYoq', blok: true };
  if (d.sana < bugun) return { m: 'sana', x: 'otgan', blok: true };
  for (const f of maydon) if (PII_RE.test(v(f))) return { m: f, x: 'pii', blok: true };
  const yum = [];
  if (d.sana > oyQoshISO(bosh, 1)) yum.push({ m: 'sana', x: 'kech' });
  const vf = maydon.find(f => VADA_RE.test(normT(v(f)))); if (vf) yum.push({ m: vf, x: 'vada' });
  if (tur === 'mahsulot') { const s = normT(v('sabab')); if (SARF_RE.test(s)) yum.push({ m: 'sabab', x: 'sarf' }); else if (!DALIL_RE.test(s)) yum.push({ m: 'sabab', x: 'dalil' }); }
  if (mavhumQadam(v('qadam'))) yum.push({ m: 'qadam', x: 'mavhum' });
  const inf = maydon.find(f => INVEST_RE.test(normT(v(f)))); if (inf) yum.push({ m: inf, x: 'invest' });
  const pf = maydon.find(f => PUL_RE.test(normT(v(f)))); if (pf) yum.push({ m: pf, x: 'pul' });
  if (tur === 'ish') { const uf = maydon.find(f => UPWORK_RE.test(normT(v(f)))); if (uf) yum.push({ m: uf, x: 'upwork' }); }
  return yum.find(y => !otkazilgan.includes(y.x)) || null;
};
// 7-ekran bo'sh oy katagi: uzunlik va telefon — bloklaydi; va'da, investitsiya, real pul — yumshoq
const tekshirKatak = (matn, otkazilgan = []) => {
  const v = String(matn || '').trim(); const s = normT(v);
  if (v.length > 100) return { x: 'uzun', n: 100, blok: true };
  if (PII_RE.test(v)) return { x: 'pii', blok: true };
  const yum = [];
  if (VADA_RE.test(s)) yum.push({ x: 'vada' });
  if (INVEST_RE.test(s)) yum.push({ x: 'invest' });
  if (PUL_RE.test(s)) yum.push({ x: 'pul' });
  return yum.find(y => !otkazilgan.includes(y.x)) || null;
};
// TEKSHIRUV-OXIR
const S6_XATO = {
  tanlov: { uz: 'Avval bittasini tanlang.', ru: 'Сначала выберите один вариант.' },
  bosh: { uz: "Maydonni bo'sh qoldirmang — qisqa yozing.", ru: 'Не оставляйте поле пустым — напишите коротко.' },
  sanaYoq: { uz: "Birinchi qadamga sana qo'ying.", ru: 'Поставьте дату первому шагу.' },
  otgan: { uz: "Bu kun o'tib ketgan — bugun yoki keyingi kunni tanlang.", ru: 'Этот день уже прошёл — выберите сегодня или следующий день.' },
  pii: { uz: 'Telefon va akkaunt nomi yozilmaydi.', ru: 'Телефон и имя аккаунта не пишут.' },
  kech: { uz: 'Birinchi qadam — birinchi oyda. Yaqinroq kun bormi?', ru: 'Первый шаг — в первом месяце. Есть день поближе?' },
  vada: { uz: "Bu va'da — oy oxirida aynan nima bo'ladi?", ru: 'Это обещание — что именно будет в конце месяца?' },
  sarf: { uz: 'Sarflangan vaqt — sabab emas. Hozir qaysi dalil bor?', ru: 'Потраченное время — не причина. Какой довод есть сейчас?' },
  dalil: { uz: 'Sababga son, yozuv yoki vaqtingizni yozing.', ru: 'Запишите в причину число, запись или своё время.' },
  mavhum: { uz: "Bu hali qadam emas: o'sha kuni aynan nima qilasiz?", ru: 'Это ещё не шаг: что именно сделаете в тот день?' },
  invest: { uz: "Investitsiya so'ralmaydi — aniq harakat yozing.", ru: 'Инвестиции не просят — напишите конкретное действие.' },
  pul: { uz: "Haqiqiy to'lov — kurs doirasidan tashqarida, ota-ona bilan.", ru: 'Реальная оплата — за рамками курса, вместе с родителями.' },
  upwork: { uz: "Xalqaro frilans sayti: yosh shartini ota-ona bilan o'qing.", ru: 'Международный фриланс-сайт: условие о возрасте прочитайте с родителями.' }
};
const xatoMatni = (t) => (t.x === 'uzun' ? tr({ uz: `${t.n} belgidan oshdi — qisqartiring.`, ru: `Больше ${t.n} знаков — сократите.` }) : tr(S6_XATO[t.x]));
const YANA = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: 'Если оставите так — нажмите «Сохранить» ещё раз.' };
const PH = {
  sabab: { uz: 'Nega? Qaysi son yoki yozuv?', ru: 'Почему? Какое число или запись?' },
  nimaK: { uz: "Nimani o'rganasiz?", ru: 'Что будете изучать?' },
  nimaI: { uz: 'Aynan nima qilasiz?', ru: 'Что именно сделаете?' },
  m1: { uz: 'Oy oxirigacha nimaga yetasiz?', ru: 'Чего достигнете к концу месяца?' },
  m6: { uz: 'Olti oy oxirida nimaga yetasiz?', ru: 'Чего достигнете через полгода?' },
  qadam: { uz: "O'sha kuni aynan nima qilasiz?", ru: 'Что именно сделаете в тот день?' }
};
const KULRANG = {
  sabab: { uz: "Mahsulot haqida — son yoki yozuv; vaqtingiz va ustuvorligingiz ham sabab.", ru: 'О продукте — число или запись; ваше время и приоритеты — тоже причина.' },
  sana: { uz: "Sana o'tsa — sababini yozib, yangi sana qo'yasiz.", ru: 'Если дата пройдёт — запишете причину и поставите новую дату.' },
  toxtat1: { uz: "To'xtatish ham — qaror: keyingi olti oy uchun, hozirgi kurs ishini o'chirmang.", ru: 'Остановить — тоже решение: на следующие полгода, текущую работу курса не удаляйте.' },
  toxtat2: { uz: "Real foydalanuvchilar bo'lsa — ularga xabar berishni ham rejalang.", ru: 'Если есть реальные пользователи — запланируйте и сообщить им.' },
  buyurtma: { uz: "Buyurtma — tanish doiradan; pul va kelishuv — ota-onangiz orqali.", ru: 'Заказ — из круга знакомых; деньги и договорённость — через родителей.' },
  stajirovka: { uz: "Xat — bitta kompaniyaga bitta; bu kursda javob kelmasa, qayta yozilmaydi.", ru: 'Письмо — одно в одну компанию; если на курсе ответа нет, повторно не пишут.' },
  dastur: { uz: "Ariza — maslahatchi bilan; shaxsiy ma'lumot — ota-onangiz xabardorligida.", ru: 'Заявка — с консультантом; личные данные — с ведома родителей.' },
  hali: { uz: "Yo'lni keyin tanlash ham — reja: ota-onangiz bilan ko'rib chiqasiz.", ru: 'Выбрать путь позже — тоже план: обсудите с родителями.' },
  maslahatchi: { uz: "Maslahatchi hali yo'q — uni 1-oy maqsadiga qo'shsa bo'ladi.", ru: 'Консультанта пока нет — его можно добавить в цель 1-го месяца.' },
  boshqa: { uz: '11-darsda boshqa dastur shartini tekshirish qolgan', ru: 'В 11-м уроке осталось проверить условие другой программы' }
};
const YORDAM = {
  mahsulot: [
    { uz: "Mentor misolida: «Davom ettiraman» · sabab «Uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas.» · 1-oy «Uch tashkilotchi bilan \"Doimiy o'yin\"ni test rejimda sinash» · birinchi qadam «Uch tashkilotchiga yozib, sinash kunini kelishish» — shanba.", ru: 'В примере Ментора: «Продолжаю» · причина «Три организатора дали письменное подтверждение — это ещё не оплата.» · 1-й месяц «Проверить «Постоянную игру» с тремя организаторами в тестовом режиме» · первый шаг «Написать трём организаторам и договориться о дне проверки» — суббота.' },
    { uz: "To'xtatish ham — qaror: sababini son yoki yozuv bilan yozing.", ru: 'Остановить — тоже решение: запишите причину числом или записью.' }
  ],
  konikma: [
    { uz: "Mentor misolida: «Backend testlari» · 1-oy «O'yinga qo'shilish yo'li uchun Backend testlarini yozish» · birinchi qadam «Bitta kichik Backend testini yozib, ishga tushirish» — yakshanba.", ru: 'В примере Ментора: «Тесты Backend» · 1-й месяц «Написать тесты Backend для пути «присоединиться к игре»» · первый шаг «Написать и запустить один маленький тест Backend» — воскресенье.' },
    { uz: "Kursda qiyin bo'lgan yoki mahsulotingizga kerak bo'lgan bitta narsani tanlang.", ru: 'Выберите одну вещь, которая была трудной на курсе или нужна вашему продукту.' }
  ],
  ish: [
    { uz: "Mentor misolida: «Xalqaro dastur» · «Diamond Challenge'ga jamoa bilan konsept» · 1-oy «Yana kamida bitta o'quvchi va maslahatchi topish» · birinchi qadam «Konsept qoralamasini sinfdoshlarga ko'rsatish» — dushanba.", ru: 'В примере Ментора: «Международная программа» · «Концепт для Diamond Challenge с командой» · 1-й месяц «Найти ещё хотя бы одного ученика и консультанта» · первый шаг «Показать черновик концепта одноклассникам» — понедельник.' },
    { uz: "Buyurtma yo'li bo'lsa — Mentorning 10-darsdagi rejasi kabi: «maktabdagi futbol to'garagining murabbiyi» uchun «to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi».", ru: 'Если путь — заказ, как в плане Ментора из 10-го урока: для «тренера школьного футбольного кружка» — «лендинг кружка: дни занятий и порядок записи».' },
    { uz: "10-darsdagi buyurtma rejangiz yoki 11-darsdagi dasturingizdan oling; uchalasidan bittasi yetadi.", ru: 'Возьмите из своего плана заказа (10-й урок) или программы (11-й урок); достаточно одного из трёх.' }
  ]
};
const YORDAM_OXIR = { uz: "2–5-oylarni keyin yozasiz — bugun 1-oy, 6-oy va birinchi qadam yetadi.", ru: '2–5-й месяцы напишете позже — сегодня достаточно 1-го, 6-го месяца и первого шага.' };
const BOSH_D = { tanlov: null, sabab: '', nima: '', m1: '', m6: '', qadam: '', sana: '' };
const yozuvdanD = (y) => (y ? { tanlov: y.tanlov || null, sabab: y.sabab || '', nima: y.nima || '', m1: (y.nishonlar && y.nishonlar[0]) || '', m6: (y.nishonlar && y.nishonlar[5]) || '', qadam: y.birinchiQadam || '', sana: y.sana || '' } : null);

// Bitta yo'nalish kartasi — 6-ekranda va 7-ekrandagi «Rejani yangilayman»da (o'sha tekshiruvlar — SABOQ 29)
const YonalishKarta = ({ tur, boshD, oraliq, ctx, bosh, onSaqla, onQoralama, kartaRef, uchish, mentorRejim }) => {
  const [d, setD] = useState(() => ({ ...BOSH_D, ...(boshD || {}) }));
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [otk, setOtk] = useState([]);
  const [yordam, setYordam] = useState(false);
  const [taklif, setTaklif] = useState({});
  const [sirg, setSirg] = useState(null);
  const bugun = bugunISO();
  const yangila = (patch) => { setD(o => { const n = { ...o, ...patch }; if (onQoralama) onQoralama(tur, n); return n; }); setXato(null); };
  const taklifQoy = (id, patch) => { yangila(patch); setTaklif(t => ({ ...t, [id]: true })); setSirg(Object.keys(patch)); setTimeout(() => setSirg(null), 900); };
  const tanlovQoy = (v) => {
    const patch = { tanlov: v };
    if (v === 'hali') { if (!String(d.nima).trim()) patch.nima = tr({ uz: "Yo'lni keyin tanlayman", ru: 'Выберу путь позже' }); if (!String(d.m1).trim()) patch.m1 = tr({ uz: "Ota-onam bilan qaysi yo'l mos ekanini ko'rib chiqish", ru: 'Обсудить с родителями, какой путь подходит' }); }
    yangila(patch); if (v === 'hali') { setSirg(Object.keys(patch).filter(k => k !== 'tanlov')); setTimeout(() => setSirg(null), 900); }
  };
  const saqla = () => {
    if (uchish || mentorRejim) return;
    const imzo = JSON.stringify(d);
    let ot = otk; let t = tekshirYon(tur, d, bugun, bosh, ot);
    while (t && !t.blok && yumshoq && yumshoq.x === t.x && yumshoq.imzo === imzo) { ot = [...ot, t.x]; t = tekshirYon(tur, d, bugun, bosh, ot); }
    setOtk(ot);
    if (t) { setXato(t); setYumshoq(t.blok ? null : { x: t.x, imzo }); return; }
    setXato(null); setYumshoq(null); setYordam(false);
    const o = Array.isArray(oraliq) ? oraliq : [null, null, null, null];
    onSaqla({ tur, tanlov: tur === 'konikma' ? null : d.tanlov, nima: tur === 'mahsulot' ? null : d.nima.trim(), sabab: tur === 'mahsulot' ? d.sabab.trim() : null, nishonlar: [d.m1.trim(), o[0] || null, o[1] || null, o[2] || null, o[3] || null, d.m6.trim()], birinchiQadam: d.qadam.trim(), sana: d.sana });
  };
  const maydonlar = tur === 'mahsulot' ? ['sabab', 'm1', 'm6', 'qadam'] : ['nima', 'm1', 'm6', 'qadam'];
  const toldi = maydonlar.every(f => String(d[f]).trim()) && !!d.sana && (tur === 'konikma' || !!d.tanlov);
  const birinchiBosh = !xato && [...maydonlar, 'sana'].find(f => !String(d[f]).trim());
  const xatoQ = (f) => xato && xato.m === f && <>{<QXato key={xato.x + f}>{xatoMatni(xato)}</QXato>}{!xato.blok && <p className="nx-yana">{tr(YANA)}</p>}</>;
  const max = yonMax(tur);
  const maydon = (f, n) => {
    const ph = f === 'nima' ? (tur === 'konikma' ? PH.nimaK : PH.nimaI) : PH[f];
    const uz = String(d[f]).trim().length;
    return (
      <div key={f} className="nx-mq">
        <label className={cxx('nx-maydon', xato && xato.m === f && 'err', sirg && sirg.includes(f) && 'sirg', birinchiBosh === f && (tur === 'konikma' || d.tanlov) && 'chorla')}>
          <i className="nx-maydon-n">{n}</i>
          <input type="text" value={d[f]} placeholder={tr(ph)} aria-label={tr(ph)} onChange={(e) => yangila({ [f]: e.target.value })} />
          {uz > max[f] * 0.7 && <span className={cxx('nx-sanoq', uz > max[f] && 'oshdi')}>{uz}{NB}/{NB}{max[f]}</span>}
        </label>
        {xatoQ(f)}
      </div>
    );
  };
  const yolTugma = tur === 'mahsulot' ? ['davom', 'toxtataman'] : tur === 'ish' ? ['buyurtma', 'stajirovka', 'dastur', 'hali'] : [];
  const ishTaklif = tur === 'ish' && ctx ? [
    ctx.buyurtma && <button key="b" type="button" className={cxx('nx-taklif', taklif.b && 'qoyildi')} disabled={!!taklif.b} onClick={() => taklifQoy('b', { tanlov: 'buyurtma', nima: ctx.buyurtma.nima + (ctx.buyurtma.kim ? ' — ' + ctx.buyurtma.kim : '') })}>{taklif.b && '✓ '}{tr({ uz: '10-darsdagi buyurtma rejangiz:', ru: 'Ваш план заказа из 10-го урока:' })} {[ctx.buyurtma.nima, ctx.buyurtma.kim, ctx.buyurtma.qachon].filter(Boolean).join(' · ')}</button>,
    ctx.xatN > 0 && (ctx.stajXat
      ? <button key="x" type="button" className={cxx('nx-taklif', taklif.x && 'qoyildi')} disabled={!!taklif.x} onClick={() => taklifQoy('x', { tanlov: 'stajirovka' })}>{taklif.x && '✓ '}{tr({ uz: `10-darsdagi xat qoralamalaringiz: ${ctx.xatN} ta`, ru: `Ваши черновики писем из 10-го урока: ${ctx.xatN}` })}</button>
      : <p key="x" className="nx-kul">{tr({ uz: `10-darsdagi xat qoralamalaringiz: ${ctx.xatN} ta`, ru: `Ваши черновики писем из 10-го урока: ${ctx.xatN}` })}</p>),
    ctx.dastur === 'diamond' && <button key="d" type="button" className={cxx('nx-taklif', taklif.d && 'qoyildi')} disabled={!!taklif.d} onClick={() => taklifQoy('d', { tanlov: 'dastur', nima: tr({ uz: "Diamond Challenge'ga ariza", ru: 'Заявка в Diamond Challenge' }) })}>{taklif.d && '✓ '}{tr({ uz: '11-darsdagi dasturingiz: Diamond Challenge', ru: 'Ваша программа из 11-го урока: Diamond Challenge' })}</button>,
    ctx.dastur === 'boshqa' && <p key="o" className="nx-kul">{tr(KULRANG.boshqa)}</p>
  ].filter(Boolean) : [];
  return (
    <div ref={kartaRef} key={tur} className={cxx('nx-karta', xato && xato.blok && 'err', uchish && 'uch')}>
      <span className="q-yorliq">{YON.indexOf(tur) + 1} · {tr(YON_NOM[tur])}</span>
      {yolTugma.length > 0 && <div className={cxx('nx-yol', !d.tanlov && 'chorla')}>
        {yolTugma.map(v => <QChip key={v} holat={d.tanlov === v ? 'on' : undefined} onClick={() => tanlovQoy(v)}>{tr(TANLOV_NOM[v])}</QChip>)}
      </div>}
      {xatoQ('tanlov')}
      {tur === 'mahsulot' && d.tanlov === 'toxtataman' && <p className="nx-kul">{tr(KULRANG.toxtat1)} {tr(KULRANG.toxtat2)}</p>}
      {ishTaklif}
      {tur === 'ish' && d.tanlov && <p className="nx-kul">{tr(KULRANG[d.tanlov])}</p>}
      {tur === 'ish' && d.tanlov === 'dastur' && ctx && ctx.dastur === 'diamond' && <p className="nx-kul">{tr(DC_MATN)}.</p>}
      {tur === 'ish' && d.tanlov === 'dastur' && ctx && ctx.dastur && ctx.maslahatchiYoq && <p className="nx-kul">{tr(KULRANG.maslahatchi)}</p>}
      {maydon(tur === 'mahsulot' ? 'sabab' : 'nima', 1)}
      {tur === 'mahsulot' && <p className="nx-kul">{tr(KULRANG.sabab)}</p>}
      {tur === 'mahsulot' && ctx && ctx.keyingi && <button type="button" className={cxx('nx-taklif', taklif.k && 'qoyildi')} disabled={!!taklif.k} onClick={() => taklifQoy('k', { m1: ctx.keyingi })}>{taklif.k && '✓ '}{tr({ uz: '13-Moduldagi rejangiz:', ru: 'Ваш план из 13-го модуля:' })} «{ctx.keyingi}»</button>}
      {maydon('m1', 2)}
      {maydon('m6', 3)}
      {maydon('qadam', 4)}
      <div className="nx-mq">
        <label className={cxx('nx-maydon', 'sana', xato && xato.m === 'sana' && 'err', birinchiBosh === 'sana' && 'chorla')}>
          <i className="nx-maydon-n">5</i>
          <span className="nx-sana-y">{tr({ uz: 'Birinchi qadam sanasi', ru: 'Дата первого шага' })}</span>
          <input type="date" min={bugun} value={d.sana} aria-label={tr({ uz: 'Birinchi qadam sanasi', ru: 'Дата первого шага' })} onChange={(e) => yangila({ sana: e.target.value })} />
        </label>
        {xatoQ('sana')}
        <p className="nx-kul">{tr(KULRANG.sana)}</p>
      </div>
      {yordam && <div className="nx-yordam fade-step">
        {YORDAM[tur].map((y, i) => <p key={i}>{tr(y)}</p>)}
        <p>{tr(YORDAM_OXIR)}</p>
      </div>}
      <div className="nx-karta-tug">
        <QTugma className={cxx(toldi && !xato && 'nx-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
        <QTugma ikkinchi className="nx-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
};

// ===== SCREEN 6 — REJANGIZ (QMustaqil, USTAXONA 1/2 — bittadan karta, uch yo'nalish; E 43, E 53) · yozadi pm-m12d12-reja · nishon sixMonths (bonus) =====
const US6 = [
  { uz: "≈ 25 daqiqa. Yakkama-yakka shu ekran paytida boshlanishi mumkin: o'quvchilarni siz belgilagan tartibda chaqiring (7-ekran) — kim tez saqlagani emas. Eng ko'p xato: maqsad o'rniga va'da («mashhur bo'ladi») · birinchi qadam katta («ilovani tugataman») · sababda dalil yo'q.", ru: '≈ 25 минут. Разговоры один на один можно начинать уже на этом экране: вызывайте в своём порядке (7-й экран) — не по скорости сохранения. Частые ошибки: обещание вместо цели («станет популярным») · слишком большой первый шаг («закончу приложение») · в причине нет довода.' },
  { uz: "Sabab, maqsad, qadamni siz yozmaysiz — savol bilan yo'naltirasiz. «To'xtataman» — ham qaror: sababini so'rang, uyaltirmang; to'xtatish keyingi olti oy haqida — shu moduldagi darslarga tegmaydi.", ru: 'Причину, цель и шаг пишете не вы — направляете вопросом. «Останавливаю» — тоже решение: спросите причину, не стыдите; остановка — про следующие полгода, уроков этого модуля не касается.' },
  { uz: "Ish yo'nalishida pul, buyurtmachi bilan uchrashuv, ariza — ota-ona bilan. Uchala yo'nalish — kurs shakli: o'quvchining ko'nikma yoki ish yo'li kichik bo'lsa ham bo'ladi.", ru: 'В направлении «Работа» деньги, встреча с заказчиком, заявка — с родителями. Три направления — форма курса: путь в навыке или работе может быть и небольшим.' }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const ctx = useMemo(() => taklifCtx(), []);
  const [reja, setReja] = useState(() => rejaOl());
  const n = rejaSoni(reja);
  const toliq = n === 3;
  const [joriy, setJoriy] = useState(() => YON.find(t => !yonToliq(yonOl(reja, t))) || null);
  const [uchish, setUchish] = useState(false);
  const [yangi, setYangi] = useState(null);
  const kartaRef = useRef(null);
  const storedRef = useRef(storedAnswer); storedRef.current = storedAnswer;
  const qoralamaT = useRef(null);
  const bosh = (reja && reja.boshlanganSana) || bugunISO();
  const qoralama = (tur, d) => {
    clearTimeout(qoralamaT.current);
    qoralamaT.current = setTimeout(() => { const s = storedRef.current || {}; onAnswer(screen, { ...s, stage: s.stage || 'practice', qoralama: { ...(s.qoralama || {}), [tur]: d } }); }, 600);
  };
  useEffect(() => () => clearTimeout(qoralamaT.current), []);
  const saqla = (yozuv) => {
    const yangiReja = rejaYozYon(yozuv);
    const nn = rejaSoni(yangiReja);
    const s = storedRef.current || {};
    const q = { ...(s.qoralama || {}) }; delete q[yozuv.tur];
    if (nn === 3 && !toliq) {
      if (achMiss && achMiss.earn) achMiss.earn('sixMonths');
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    clearTimeout(qoralamaT.current);
    onAnswer(screen, { ...s, stage: 'practice', screenIdx: screen, practice: 'olti oylik reja', qoralama: q, solved: nn === 3 || !!s.solved, correct: true, picked: true });
    const keyingi = YON.slice(YON.indexOf(yozuv.tur) + 1).find(t => !yonToliq(yonOl(yangiReja, t))) || YON.find(t => !yonToliq(yonOl(yangiReja, t))) || null;
    setUchish(true);
    uchir(kartaRef.current, document.querySelector('[data-nx-qator="' + yozuv.tur + '"]'), tr(YON_NOM[yozuv.tur]), () => {
      setReja(yangiReja); setUchish(false); setYangi(yozuv.tur); setJoriy(keyingi); setTimeout(() => setYangi(null), 1100);
    });
  };
  const och = (tur) => { if (!uchish) setJoriy(tur); };
  const strip = <div className="nx-strip">
    <span className="nx-strip-y">{tr({ uz: 'Rejam', ru: 'Мой план' })} · {n}/3</span>
    {YON.map((t, i) => { const ok = yonToliq(yonOl(reja, t)); return <QChip key={t} holat={joriy === t ? 'on' : ok ? 'ok' : undefined} className={cxx('nx-tab', yangi === t && 'yangi')} onClick={() => och(t)}><i>{ok ? '✓' : i + 1}</i>{tr(YON_NOM[t])}</QChip>; })}
  </div>;
  const yakuniy = toliq && !joriy;
  const y = joriy && yonOl(reja, joriy);
  const karta = joriy && <YonalishKarta key={joriy} tur={joriy} kartaRef={kartaRef} uchish={uchish} ctx={ctx} bosh={bosh}
    boshD={yozuvdanD(y) || (storedAnswer && storedAnswer.qoralama && storedAnswer.qoralama[joriy]) || null}
    oraliq={y && Array.isArray(y.nishonlar) ? y.nishonlar.slice(1, 5) : null} onSaqla={saqla} onQoralama={qoralama} />;
  const forma = isMentor
    ? <div className="nx-fokus"><Zoomable><OltiOyReja matnli yorliq={tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} qatorlar={mentorQatorlar({ bosh: bugunISO(), bayroqlar: true })} /></Zoomable>
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Reja saqlandi', ru: 'План сохранён' }} /></div>
    : yakuniy
      ? <div className="nx-fokus"><Zoomable><OltiOyReja matnli yorliq={tr({ uz: 'Rejam', ru: 'Мой план' }) + ' · 3/3'} qatorlar={oquvchiQatorlar(reja, { yangi })} onTahrir={och} /></Zoomable>
        <QXulosa>{tr({ uz: "Uch yo'nalish yozildi: har birida 1-oy va 6-oy maqsadi, sanasi bor birinchi qadam.", ru: 'Три направления записаны: в каждом цель на 1-й и 6-й месяц и первый шаг с датой.' })}</QXulosa></div>
      : <div className="nx-s6">
        <Zoomable><OltiOyReja qatorlar={oquvchiQatorlar(reja, { yangi })} joriy={joriy} yorliq={tr({ uz: 'Rejam', ru: 'Мой план' })} /></Zoomable>
        {karta}
      </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · olti oylik reja', ru: 'Самостоятельная работа · план на полгода' })} screen={screen} scrollSignal={n * 10 + (joriy ? YON.indexOf(joriy) : 9)} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={yakuniy} disabled={!toliq && !isMentor} label={toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Uch yo'nalishni yozing (${n}/3)`, ru: `Напишите три направления (${n}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Olti oylik rejangizni <A>uch yo'nalishda yozing.</A></>, ru: <>Напишите свой план на полгода <A>в трёх направлениях.</A></> })}
        mentor={<Mentor>{tr({ uz: "Har kartani yuqoridan pastga to'ldirib, «Saqlash»ni bosing — Mentor misoli «Yordam»da.", ru: 'Заполните каждую карточку сверху вниз и нажмите «Сохранить» — пример Ментора в «Подсказке».' })}</Mentor>}
        qadamlar={!isMentor && !yakuniy && strip}
        forma={forma}
      />
      <Ustoz satrlar={US6} />
    </Stage>
  );
};

// ===== SCREEN 7 — MENTOR BILAN YAKKAMA-YAKKA (QMustaqil, USTAXONA 2/2 — bo'sh oylar + suhbat; suhbat — o'quvchi belgisi, tugallikka kirmaydi — 9.84) =====
const US7 = [
  { uz: "Har suhbat — 10 daqiqa, taymer bilan. Reja — o'quvchining ekranida; siz savol berasiz, o'zgarishni o'quvchi o'zi kiritadi. Uch savol: qaysi yo'nalish birinchi · birinchi qadamda kim yordam beradi (ota-ona, sinfdosh, maslahatchi — Ish yo'nalishida ota-onani ham so'rang) · birinchi qadam bir kunga sig'adimi.", ru: 'Каждый разговор — 10 минут, с таймером. План — на экране ученика; вы задаёте вопросы, изменения ученик вносит сам. Три вопроса: какое направление первое · кто поможет на первом шаге (родители, одноклассник, консультант — в «Работе» спросите и о родителях) · помещается ли первый шаг в один день.' },
  { uz: "Rejani baholamang, boshqalar bilan solishtirmang, «olti oyda katta bo'lasiz» kabi va'da bermang. 12–15 kishilik sinfda bitta darsda ≈ 4 kishiga yetadi: navbati kelmaganlar bilan vaqtni o'zingiz belgilang va o'quvchiga ayting.", ru: 'Не оценивайте план, не сравнивайте с другими, не обещайте «через полгода станешь большим». В классе из 12–15 человек за урок успеете ≈ 4: с остальными назначьте время сами и скажите ученику.' },
  { uz: "Kutayotganlar bo'sh oylarni to'ldiradi; uzoq oy bo'sh qolsa — xato emas.", ru: 'Ожидающие заполняют пустые месяцы; если дальний месяц пуст — это не ошибка.' }
];
const SuhbatTaymer = () => {
  const [boshT, setBoshT] = useState(null);
  const [hozir, setHozir] = useState(Date.now());
  useEffect(() => { if (!boshT) return undefined; const iv = setInterval(() => setHozir(Date.now()), 1000); return () => clearInterval(iv); }, [boshT]);
  const qol = boshT ? Math.max(0, 600000 - (hozir - boshT)) : 600000;
  return (
    <div className="nx-taymer">
      <span className="q-yorliq">{tr({ uz: 'Suhbat taymeri', ru: 'Таймер разговора' })}</span>
      <b>{Math.floor(qol / 60000)}:{pad2(Math.floor((qol % 60000) / 1000))}</b>
      <span className="nx-taymer-c"><i style={{ width: (qol / 6000) + '%' }} /></span>
      <QTugma ikkinchi onClick={() => { setBoshT(Date.now()); setHozir(Date.now()); }}>{boshT ? '↻' : '▶'}</QTugma>
    </div>
  );
};
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const ctx = useMemo(() => taklifCtx(), []);
  const uzoq = useMemo(() => { const r = lsO(REF_KEY); return r && Array.isArray(r.ishlar) ? r.ishlar.filter(i => i && i.holat === 'uzoqroqda').map(i => (typeof i.nom === 'string' ? i.nom : (i.nom && (i.nom[__lang] || i.nom.uz)) || '')).filter(Boolean).slice(0, 3) : []; }, []);
  const [reja, setReja] = useState(() => rejaOl());
  const [suhbat, setSuhbat] = useState(() => (reja && typeof reja.suhbat === 'boolean' ? reja.suhbat : null));
  const [ozg, setOzg] = useState(storedAnswer?.ozg ?? null); // null · 'tanla' · 'hech' · 'yangi'
  const [ochiq, setOchiq] = useState(null); // { tur, k }
  const [kMatn, setKMatn] = useState('');
  const [kXato, setKXato] = useState(null);
  const [kYum, setKYum] = useState(null);
  const [kOtk, setKOtk] = useState([]);
  const [yonadi, setYonadi] = useState(null);
  const [tahrir, setTahrir] = useState(null);
  const [uchish, setUchish] = useState(false);
  const kartaRef = useRef(null);
  const sentRef = useRef(false);
  const bosh = (reja && reja.boshlanganSana) || bugunISO();
  const tayyor = suhbat === false || (suhbat === true && (ozg === 'hech' || ozg === 'yangi'));
  const yoz = (patch) => onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'yakkama-yakka', suhbat, ozg, ...patch, solved: patch.tayyor ?? tayyor, correct: true, picked: true });
  const suhbatQoy = (v) => {
    if (isMentor) return;
    const r = rejaPatch({ suhbat: v }); if (r) setReja(r);
    setSuhbat(v); const o = v ? null : ozg; setOzg(o);
    yoz({ suhbat: v, ozg: o, tayyor: v === false });
    if (v && !sentRef.current && _live && _live.mode === 'student') { sentRef.current = true; _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); }
  };
  const ozgQoy = (v) => { setOzg(v); setTahrir(null); yoz({ suhbat, ozg: v, tayyor: v === 'hech' || v === 'yangi' }); };
  const katakOch = (tur, k) => { const y = yonOl(reja, tur); setOchiq({ tur, k }); setKMatn((y && y.nishonlar && y.nishonlar[k]) || ''); setKXato(null); setKYum(null); setKOtk([]); };
  const katakSaqla = () => {
    if (!ochiq) return;
    let ot = kOtk; let t = tekshirKatak(kMatn, ot);
    while (t && !t.blok && kYum && kYum.x === t.x && kYum.m === kMatn) { ot = [...ot, t.x]; t = tekshirKatak(kMatn, ot); }
    setKOtk(ot);
    if (t) { setKXato(t); setKYum(t.blok ? null : { x: t.x, m: kMatn }); return; }
    const r = rejaNishon(ochiq.tur, ochiq.k, kMatn.trim()); if (r) setReja(r);
    const yk = { tur: ochiq.tur, k: ochiq.k }; setOchiq(null); setKXato(null); setKYum(null);
    if (kMatn.trim()) { setYonadi(yk); setTimeout(() => setYonadi(null), 1100); }
  };
  const tahrirSaqla = (yozuv) => {
    const r = rejaYozYon(yozuv);
    setUchish(true);
    uchir(kartaRef.current, document.querySelector('[data-nx-qator="' + yozuv.tur + '"]'), tr(YON_NOM[yozuv.tur]), () => { setReja(r); setUchish(false); ozgQoy('yangi'); });
  };
  const qatorlar = oquvchiQatorlar(reja).map(q => (yonadi && yonadi.tur === q.tur ? { ...q, yonKatak: yonadi.k } : ochiq && ochiq.tur === q.tur ? { ...q, halqa: ochiq.k } : q));
  const nn = rejaSoni(reja);
  const ish = yonOl(reja, 'ish');
  const dcQator = ish && ish.tanlov === 'dastur' && ctx.dastur === 'diamond';
  const belgi = suhbat === true ? tr({ uz: 'Mentor bilan suhbat bo\'ldi deb belgilandi', ru: 'Отмечено: разговор с Ментором состоялся' }) : null;
  const y = ochiq && yonOl(reja, ochiq.tur);
  const chap = <div className="nx-s7-c">
    <div className="nx-strip"><span className="nx-strip-y">{tr({ uz: 'Rejam', ru: 'Мой план' })} · {nn === 3 ? tr({ uz: "3 yo'nalish", ru: '3 направления' }) : nn + '/3'}</span></div>
    {uzoq.length > 0 && <p className="nx-kul">{tr({ uz: '13-Modulda «uzoqroqda qoldi» deganlaringiz:', ru: 'В 13-м модуле вы отметили «осталось дальше»:' })} {uzoq.join(', ')}</p>}
    {dcQator && <p className="nx-kul">{tr(DC_MATN)}</p>}
    <Zoomable><OltiOyReja qatorlar={qatorlar} belgi={belgi} onKatak={!tahrir ? katakOch : null} onTahrir={ozg === 'tanla' && !tahrir ? (t) => setTahrir(t) : null} tahrirChorla={ozg === 'tanla'} /></Zoomable>
    {ochiq && <div className="nx-katak-m fade-step">
      <span className="q-yorliq">{tr(YON_NOM[ochiq.tur])} · {ochiq.k + 1}-{tr({ uz: 'oy maqsadi', ru: 'й месяц: цель' })}</span>
      {y && y.nishonlar && <p className="nx-kul">1-{tr({ uz: 'oy', ru: 'й мес.' })}: {y.nishonlar[0]} · 6-{tr({ uz: 'oy', ru: 'й мес.' })}: {y.nishonlar[5]}</p>}
      <div className="nx-katak-q">
        <label className={cxx('nx-maydon', kXato && 'err', !kMatn.trim() && 'chorla')}>
          <i className="nx-maydon-n">{ochiq.k + 1}</i>
          <input type="text" autoFocus value={kMatn} placeholder={(ochiq.k + 1) + tr({ uz: '-oy maqsadi', ru: '-й месяц: цель' })} aria-label={(ochiq.k + 1) + tr({ uz: '-oy maqsadi', ru: '-й месяц: цель' })} onChange={(e) => { setKMatn(e.target.value); setKXato(null); }} onKeyDown={(e) => { if (e.key === 'Enter') katakSaqla(); }} />
        </label>
        <QTugma className={cxx(kMatn.trim() && !kXato && 'nx-halqa')} onClick={katakSaqla} aria-label={tr({ uz: 'Saqlash', ru: 'Сохранить' })}>✓</QTugma>
        <QTugma ikkinchi onClick={() => setOchiq(null)} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</QTugma>
      </div>
      {kXato && <><QXato key={kXato.x}>{xatoMatni(kXato)}</QXato>{!kXato.blok && <p className="nx-yana">{tr(YANA)}</p>}</>}
    </div>}
  </div>;
  const suhbatKarta = <div className={cxx('nx-suhbat', suhbat === false && 'ixcham')}>
    <span className="q-yorliq">{tr({ uz: 'Suhbat', ru: 'Разговор' })}</span>
    {suhbat !== false && <>
      <p className="nx-suhbat-h">{tr({ uz: "Suhbatda Mentor so'raydi:", ru: 'В разговоре Ментор спросит:' })}</p>
      <ol className="nx-suhbat-s">{SUHBAT_SAVOL.map((s, i) => <li key={i}><i>{i + 1}</i><span>{tr(s)}</span></li>)}</ol>
    </>}
    {suhbat === null && <div className="nx-ikki chorla">
      <QChip onClick={() => suhbatQoy(true)}>{tr({ uz: "Suhbat bo'ldi", ru: 'Разговор был' })}</QChip>
      <QChip onClick={() => suhbatQoy(false)}>{tr({ uz: 'Navbatim kelmadi', ru: 'Моя очередь не дошла' })}</QChip>
    </div>}
    {suhbat === false && <>
      <p className="nx-kul">{tr({ uz: 'Navbatim kelmadi — Mentordan suhbat vaqtini aniqlang.', ru: 'Моя очередь не дошла — уточните у Ментора время разговора.' })}</p>
      <div className="nx-ikki"><QChip onClick={() => suhbatQoy(true)}>{tr({ uz: "Suhbat bo'ldi", ru: 'Разговор был' })}</QChip></div>
    </>}
    {suhbat === true && !tayyor && <>
      <p className="nx-suhbat-h">{tr({ uz: "Rejada nima o'zgardi?", ru: 'Что изменилось в плане?' })}</p>
      <div className={cxx('nx-ikki', ozg === null && 'chorla')}>
        <QChip holat={ozg === 'hech' ? 'on' : undefined} onClick={() => ozgQoy('hech')}>{tr({ uz: 'Hech narsa', ru: 'Ничего' })}</QChip>
        <QChip holat={ozg === 'tanla' ? 'on' : undefined} onClick={() => { setOzg('tanla'); yoz({ ozg: 'tanla', tayyor: false }); }}>✎ {tr({ uz: 'Rejani yangilayman', ru: 'Обновлю план' })}</QChip>
      </div>
    </>}
  </div>;
  const xulosa = suhbat === false ? { uz: 'Rejangiz yozildi; Mentor bilan suhbat hali bo\'lmagan.', ru: 'План записан; разговора с Ментором ещё не было.' }
    : suhbat === true && ozg === 'hech' ? { uz: "Suhbat bo'ldi deb belgiladingiz; o'zgarish kerak bo'lmadi.", ru: 'Вы отметили, что разговор был; изменения не понадобились.' }
      : suhbat === true && ozg === 'yangi' ? { uz: "Suhbat bo'ldi deb belgiladingiz va rejani o'zingiz yangiladingiz.", ru: 'Вы отметили, что разговор был, и сами обновили план.' } : null;
  const yt = tahrir && yonOl(reja, tahrir);
  const ong = tahrir
    ? <YonalishKarta key={'t' + tahrir} tur={tahrir} kartaRef={kartaRef} uchish={uchish} ctx={ctx} bosh={bosh} boshD={yozuvdanD(yt)} oraliq={yt && Array.isArray(yt.nishonlar) ? yt.nishonlar.slice(1, 5) : null} onSaqla={tahrirSaqla} />
    : suhbatKarta;
  const forma = isMentor
    ? <div className="nx-fokus">
      <SuhbatTaymer />
      <MentorPracticeStats live={_live} screen={screen} sig={PRACTICE_BASE + 6} yorliq={{ uz: 'Reja saqlandi', ru: 'План сохранён' }} />
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: "Suhbat bo'ldi (o'quvchi belgisi)", ru: 'Разговор был (отметка ученика)' }} />
    </div>
    : <><div className="nx-s7">{chap}{ong}</div>{xulosa && !tahrir && <QXulosa>{tr(xulosa)}</QXulosa>}</>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · yakkama-yakka', ru: 'Самостоятельная работа · один на один' })} screen={screen} scrollSignal={(suhbat === null ? 0 : suhbat ? 1 : 2) + (ozg ? 3 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={tayyor && !tahrir} disabled={!tayyor && !isMentor} label={tayyor || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Suhbatni belgilang', ru: 'Отметьте разговор' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mentor bilan rejangizni <A>10 daqiqa muhokama qiling.</A></>, ru: <>Обсудите свой план с Ментором <A>10 минут.</A></> })}
        mentor={<Mentor>{tr({ uz: "Navbatingiz kelguncha bo'sh oylarni to'ldiring, chaqirganimda esa rejangizni ekraningizda ko'rsatasiz.", ru: 'Пока ждёте очереди, заполните пустые месяцы, а когда позову — покажете план на своём экране.' })}</Mentor>}
        qadamlar={<p className="nx-kul nx-tepa">{tr({ uz: 'Reja matni Mentor ekraniga va proyektorga chiqmaydi.', ru: 'Текст плана не выводится на экран Ментора и на проектор.' })}</p>}
        forma={forma}
      />
      <Ustoz satrlar={US7} />
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s8 = 2) =====
const Screen8 = (props) => {
  const shanba = keyingiKun(6);
  return (
    <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Итоговый вопрос' })}
      questionText="Suhbatda birinchi qadamingiz juda katta ekani bilindi. Nima qilasiz?"
      question={tr({ uz: <h2 className="title h-ask">Suhbatda birinchi qadamingiz juda katta ekani bilindi. <A>Nima qilasiz?</A></h2>, ru: <h2 className="title h-ask">В разговоре выяснилось, что ваш первый шаг слишком большой. <A>Что сделаете?</A></h2> })}
      options={[
        { uz: 'Qadamni Mentor o\'zi yozib berishini so\'rayman', ru: 'Попрошу Ментора написать шаг за меня' },
        { uz: "Katta qadamni o'zgartirmay, shunday qoldiraman", ru: 'Оставлю большой шаг как есть, без изменений' },
        { uz: 'Kichraytirib, bir kunlik qadamga aylantiraman', ru: 'Уменьшу и превращу в шаг на один день' },
        { uz: 'Qadam sanasini o\'chirib, keyinchalik qilaman', ru: 'Удалю дату шага и сделаю когда-нибудь потом' }
      ]} correctIdx={2}
      explainCorrect={{ uz: "Birinchi qadam bir kunga sig'adi — katta harakat bo'linadi.", ru: 'Первый шаг помещается в один день — большое действие делят на части.' }}
      explainWrong={{
        0: { uz: "Reja sizniki: Mentor so'raydi, siz yozasiz.", ru: 'План ваш: Ментор спрашивает, пишете вы.' },
        1: { uz: "Bir kunga sig'maydigan qadam qanday boshlanadi?", ru: 'Как начать шаг, который не помещается в один день?' },
        3: { uz: 'Sanasiz qadam qachon boshlanadi?', ru: 'Когда начнётся шаг без даты?' },
        default: { uz: 'Birinchi qadam qanday harakat edi — eslang.', ru: 'Вспомните, каким действием был первый шаг.' }
      }}
      vizual={<MiniTaxta nom={tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} oy1={tr(MENTOR_REJA[0].oylar[0])} bayroq={tr(KUNLAR[6]) + ' · ' + kunOy(shanba)} izoh={tr({ uz: 'bir kunlik harakat', ru: 'действие на один день' })} />} />
  );
};

// ===== 🏅 BADGES (nishonlar) — 4 ta: uchtasi birinchi urinishda, bittasi — bonus (P-048) =====
const ACHIEVEMENTS = {
  threeLines: { icon: '🧭', name: 'Three Lines!', desc: { uz: "Mentor gaplarini to'g'ri yo'nalishga qo'ydingiz", ru: 'Вы разложили фразы Ментора по верным направлениям' } },
  realReason: { icon: '🔎', name: 'Real Reason!', desc: { uz: 'Davom ettirish uchun dalilli sababni topdingiz', ru: 'Вы нашли причину с доводом для продолжения' } },
  firstStep: { icon: '🚩', name: 'First Step!', desc: { uz: 'Sanasi bor birinchi qadamni topdingiz', ru: 'Вы нашли первый шаг с датой' } },
  sixMonths: { icon: '🗓️', name: 'Six Months!', desc: { uz: "Uch yo'nalishda 1-oy va 6-oyni yozdingiz", ru: 'Вы написали 1-й и 6-й месяц в трёх направлениях' } }
};
// Ekran id → nishon (s2 — saralash, birinchi urinishda; s3, s5 — ballik test). sixMonths — 6-ekranda earn() bilan.
const ACH_TRIGGERS = { s2: 'threeLines', s3: 'realReason', s5: 'firstStep' };

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



// Podium savol yorliqlari (SCORED_IDX: 3, 5, 8)
const Q_LABELS = {
  3: { uz: '1 — Davom ettirish sababi', ru: '1 — Причина продолжать' },
  5: { uz: '2 — Birinchi qadam', ru: '2 — Первый шаг' },
  8: { uz: 'Yakuniy — Katta qadam', ru: 'Итог — Большой шаг' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi so'zlar — darsning lug'ati (R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'reja', ru: 'план' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "yo'nalish", ru: 'направление' }, l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'mahsulot', ru: 'продукт' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: "ko'nikma", ru: 'навык' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'ish', ru: 'работа' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'oylik maqsad', ru: 'цель месяца' }, l: 62, t: 24, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'birinchi qadam', ru: 'первый шаг' }, l: 24, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: '«sana»', ru: '«дата»' }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
  { ch: { uz: 'yakkama-yakka', ru: 'один на один' }, l: 52, t: 52, s: 20, d: 22, dl: 3.4 },
  { ch: 'Maydon Jamoa', l: 34, t: 60, s: 20, d: 24, dl: 2.6 }
];
// ⚡ Jonli viktorina — 12 savol (MD), to'g'ri javob: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12
const QUIZ_BANK = [
  { q: { uz: "Bu darsdagi olti oylik reja qaysi uch yo'nalishdan iborat?", ru: 'Из каких трёх направлений состоит план на полгода на этом уроке?' }, opts: [{ uz: "Mahsulot, ko'nikma va ish", ru: 'Продукт, навык и работа' }, { uz: 'Muammo, Bozor va Yechim', ru: 'Проблема, Рынок и Решение' }, { uz: 'Pitch, jonli demo va video', ru: 'Питч, живое демо и видео' }, { uz: 'Lending, ilova va Backend', ru: 'Лендинг, приложение и Backend' }], correct: 0 },
  { q: { uz: "Mentor «Backend testlari»ni qaysi yo'nalishga qo'ydi?", ru: 'В какое направление Ментор поставил «Тесты Backend»?' }, opts: [{ uz: "Mahsulot — ilovaning o'zi uchun", ru: 'Продукт — для самого приложения' }, { uz: "Ko'nikma — o'rganadigan narsa", ru: 'Навык — то, что изучает' }, { uz: 'Ish — buyurtma yoki dastur uchun', ru: 'Работа — для заказа или программы' }, { uz: 'Hech qaysi — rejadan tashqari', ru: 'Никуда — вне плана' }], correct: 1 },
  { q: { uz: "Mahsulot yo'nalishida qanday qaror yoziladi?", ru: 'Какое решение пишут в направлении «Продукт»?' }, opts: [{ uz: 'Ilova rangini tanlash va nega', ru: 'Выбор цвета приложения и почему' }, { uz: "Investordan qancha pul so'rash", ru: 'Сколько денег просить у инвестора' }, { uz: "Davom ettirish yoki to'xtatish", ru: 'Продолжать или остановить' }, { uz: 'Kimdan va qachon baho olish', ru: 'У кого и когда получить оценку' }], correct: 2 },
  { q: { uz: "Mahsulotni to'xtatish qarori haqida qaysi gap to'g'ri?", ru: 'Какая фраза о решении остановить продукт верна?' }, opts: [{ uz: "To'xtatish — mag'lubiyat, yashiriladi", ru: 'Остановка — поражение, её скрывают' }, { uz: "To'xtatsangiz, ko'nikma ham to'xtaydi", ru: 'Остановите продукт — остановится и навык' }, { uz: 'Faqat Mentor ruxsat bersagina bo\'ladi', ru: 'Можно, только если разрешит Ментор' }, { uz: 'Sababi bilan yozilsa, u ham qarordir', ru: 'Если записана с причиной — это тоже решение' }], correct: 3 },
  { q: { uz: 'Mentor mahsulotni davom ettirishiga qaysi sababni yozgan?', ru: 'Какую причину продолжать продукт записал Ментор?' }, opts: [{ uz: "Uch tashkilotchining yozma tasdig'ini", ru: 'Письменное подтверждение трёх организаторов' }, { uz: 'Mahalla guruhida 60 kishi borligini', ru: 'Что в группе махалли 60 человек' }, { uz: "Ilovada funksiyalar juda ko'p ekanini", ru: 'Что в приложении очень много функций' }, { uz: "Kimdir pul berishga va'da qilganini", ru: 'Что кто-то пообещал дать денег' }], correct: 0 },
  { q: { uz: 'Oylik maqsad nimani aytadi?', ru: 'Что говорит цель месяца?' }, opts: [{ uz: 'Bir kunda qilinadigan aniq bitta harakatni', ru: 'Одно конкретное действие на один день' }, { uz: 'Oy oxirigacha nimaga yetmoqchi ekaningizni', ru: 'Чего вы хотите достичь к концу месяца' }, { uz: "Olti oy o'tgach bo'ladigan katta natijani", ru: 'Большой итог через полгода' }, { uz: "Mentor sizga qo'ygan baho va uning izohini", ru: 'Оценку Ментора и её пояснение' }], correct: 1 },
  { q: { uz: "Birinchi qadamda qaysi ikki narsa bo'lishi kerak?", ru: 'Какие две вещи должны быть в первом шаге?' }, opts: [{ uz: "Mentorning imzosi va tasdig'i", ru: 'Подпись и одобрение Ментора' }, { uz: 'Katta natija va uning narxi', ru: 'Большой итог и его цена' }, { uz: 'Aniq harakat va uning sanasi', ru: 'Конкретное действие и его дата' }, { uz: 'Do\'stlar ismi va telefonlari', ru: 'Имена и телефоны друзей' }], correct: 2 },
  { q: { uz: "Mentorning 1-oy maqsadi qayerdan ko'chdi?", ru: 'Откуда перешла цель Ментора на 1-й месяц?' }, opts: [{ uz: "1-darsdagi Bozor bo'lagidan", ru: 'Из части «Рынок» 1-го урока' }, { uz: 'Demo ssenariysining oxiridan', ru: 'Из конца сценария демо' }, { uz: 'Diamond Challenge shartlaridan', ru: 'Из условий Diamond Challenge' }, { uz: '13-Modul shaxsiy hisobotidan', ru: 'Из личного отчёта 13-го модуля' }], correct: 3 },
  { q: { uz: "Birinchi qadam sanasi o'tdi, qilinmadi. Nima qilasiz?", ru: 'Дата первого шага прошла, шаг не сделан. Что делаете?' }, opts: [{ uz: "Sababini yozib, yangi sana qo'yaman", ru: 'Запишу причину и поставлю новую дату' }, { uz: "Baribir qilindi deb belgilab qo'yaman", ru: 'Всё равно отмечу, что сделано' }, { uz: "Rejaning hammasini o'chirib tashlayman", ru: 'Удалю весь план' }, { uz: "Hech kimga aytmasdan, o'tib ketaman", ru: 'Пропущу, никому не сказав' }], correct: 0 },
  { q: { uz: 'Yakkama-yakkada rejangiz bilan nima bo\'ladi?', ru: 'Что происходит с вашим планом в разговоре один на один?' }, opts: [{ uz: "Butun sinfga proyektorda o'qib beriladi", ru: 'Его читают всему классу на проекторе' }, { uz: "Mentor bilan ko'riladi, siz o'zgartirasiz", ru: 'Его смотрят с Ментором, меняете вы' }, { uz: "Mentor uni o'zi boshqatdan yozib beradi", ru: 'Ментор сам переписывает его' }, { uz: "Baholanadi va sinfda reyting e'lon qilinadi", ru: 'Его оценивают и объявляют рейтинг' }], correct: 1 },
  { q: { uz: "Birinchi buyurtmada pul va kelishuv kim orqali bo'ladi?", ru: 'Через кого идут деньги и договорённость в первом заказе?' }, opts: [{ uz: "Buyurtmachining o'zi bilan, yolg'iz", ru: 'Только с самим заказчиком, в одиночку' }, { uz: 'Sinfdoshingiz orqali, yashirin holda', ru: 'Через одноклассника, тайно' }, { uz: 'Ota-onangiz orqali, ular bilan birga', ru: 'Через родителей, вместе с ними' }, { uz: 'Internetdagi notanish vositachi orqali', ru: 'Через незнакомого посредника в интернете' }], correct: 2 },
  { q: { uz: "Qaysi gap olti oylik rejaga to'g'ri yozilgan?", ru: 'Какая фраза правильно записана в план на полгода?' }, opts: [{ uz: "6-oy: ilovam hamma joyda mashhur bo'ladi", ru: '6-й месяц: моё приложение станет известным везде' }, { uz: "1-oy: hamma narsani o'rganib bo'laman", ru: '1-й месяц: выучу всё' }, { uz: "2-oy: qachondir bir narsani qilib ko'raman", ru: '2-й месяц: когда-нибудь что-нибудь попробую' }, { uz: '1-oy: sinfda kitob almashishni boshlash', ru: '1-й месяц: начать обмен книгами в классе' }], correct: 3 }
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
    // Arena tokenlari — darsning lug'ati (QZ_BG_SHAPES bilan bir manba; emoji yo'q)
    const TOK = QZ_BG_SHAPES.map(s => tr(s.ch));
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
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz.", ru: 'Мимо — 0 баллов. Возьмёте на следующем.' }) : tr({ uz: "Vaqt tugadi — 0 ball. Keyingi savolda ulguring.", ru: 'Время вышло — 0 баллов. Успейте на следующем вопросе.' })}</span>}
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
// Mentor ko'rinishi — «kim bajardi» jonli chiplar (vaqtsiz, saqlash tartibisiz — 12-FILTR 31); sig — signal, yorliq — sarlavha
const MentorPracticeStats = ({ live, screen, sig, yorliq }) => {
  const signal = sig ?? (PRACTICE_BASE + screen);
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return undefined;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, signal)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, signal]); // eslint-disable-line
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doneN = players.filter(p => data.doneIds.has(p.id)).length;
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.accent }}>{tr(yorliq || { uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doneN}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {players.map(p => data.doneIds.has(p.id)
            ? <span key={p.id} className="mstats-wait-chip" style={{ background: T.okFon, color: T.ok }}>✓ {p.nickname}</span>
            : <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>{p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};

// 🃏 KARTOCHKALAR — 12 ta (MD jadvali; alohida ekran, Mentorsiz)
const FLASHCARDS = [
  { front: { uz: "Bizda olti oylik reja nechta yo'nalishdan iborat?", ru: 'Из скольких направлений у нас состоит план на полгода?' }, back: { uz: "Uchta: mahsulot, ko'nikma va ish", ru: 'Из трёх: продукт, навык и работа' }, note: { uz: "Bu kursdagi shakl — mazmuni sizniki", ru: 'Это форма курса — содержание ваше' } },
  { front: { uz: "Mahsulot yo'nalishida qanday qaror yoziladi?", ru: 'Какое решение пишут в направлении «Продукт»?' }, back: { uz: "Davom ettirish yoki to'xtatish — sababi bilan", ru: 'Продолжать или остановить — с причиной' }, note: { uz: 'Mentor misolida: davom ettiraman', ru: 'В примере Ментора: продолжаю' } },
  { front: { uz: 'Mahsulot qaroriga qanday sabab yoziladi?', ru: 'Какую причину пишут к решению о продукте?' }, back: { uz: 'Mahsulot haqida — son yoki yozuv: sanoq, yozma tasdiq, odamlar javobi', ru: 'О продукте — число или запись: подсчёт, письменное подтверждение, ответы людей' }, note: { uz: "O'z rejangizda vaqt va ustuvorlik ham sabab bo'la oladi; Mentor misolida: uch tashkilotchi yozma tasdiq berdi", ru: 'В вашем плане причиной могут быть и время, и приоритеты; в примере Ментора: три организатора дали письменное подтверждение' } },
  { front: { uz: "Ko'nikma yo'nalishiga nima yoziladi?", ru: 'Что пишут в направлении «Навык»?' }, back: { uz: "Nimani o'rganishingiz", ru: 'Что вы будете изучать' }, note: { uz: 'Mentor misolida: Backend testlari', ru: 'В примере Ментора: тесты Backend' } },
  { front: { uz: "Ish yo'nalishida qaysi uch yo'l bor?", ru: 'Какие три пути есть в направлении «Работа»?' }, back: { uz: 'Buyurtma, stajirovka yoki xalqaro dastur', ru: 'Заказ, стажировка или международная программа' }, note: { uz: '10, 11-darsdagi rejangizdan', ru: 'Из вашего плана 10-го и 11-го уроков' } },
  { front: { uz: 'Oylik maqsad nima?', ru: 'Что такое цель месяца?' }, back: { uz: 'Oy oxirigacha nimaga yetmoqchi ekaningiz', ru: 'Чего вы хотите достичь к концу месяца' }, note: { uz: "Har yo'nalishga — oyiga bittadan", ru: 'Для каждого направления — по одной в месяц' } },
  { front: { uz: 'Bu darsda birinchi qadam nima?', ru: 'Что такое первый шаг на этом уроке?' }, back: { uz: 'Sanasi bor, bir kunda qilinadigan aniq harakat', ru: 'Конкретное действие с датой, которое делается за один день' }, note: { uz: 'Mentor misolida: uch tashkilotchiga yozib, sinash kunini kelishish — shanba', ru: 'В примере Ментора: написать трём организаторам и договориться о дне проверки — суббота' } },
  { front: { uz: "Birinchi qadam sanasi o'tsa, nima qilinadi?", ru: 'Что делают, если дата первого шага прошла?' }, back: { uz: "Sababi yoziladi va yangi sana qo'yiladi", ru: 'Записывают причину и ставят новую дату' }, note: { uz: "Reja — va'da emas: o'zgarishi mumkin", ru: 'План — не обещание: он может меняться' } },
  { front: { uz: "13-Moduldagi «keyingi 4 hafta» javobi rejaning qayeriga ko'chadi?", ru: 'Куда в плане переходит ответ «следующие 4 недели» из 13-го модуля?' }, back: { uz: '1-oy maqsadiga', ru: 'В цель 1-го месяца' }, note: { uz: "Mentor misolida — Mahsulot yo'nalishiga", ru: 'В примере Ментора — в направление «Продукт»' } },
  { front: { uz: 'Yakkama-yakka nima?', ru: 'Что такое разговор один на один?' }, back: { uz: "Mentor bilan bir o'quvchining suhbati", ru: 'Разговор Ментора с одним учеником' }, note: { uz: 'Bu darsda — 10 daqiqa, rejangiz haqida', ru: 'На этом уроке — 10 минут, о вашем плане' } },
  { front: { uz: "Yakkama-yakkadan keyin rejani kim o'zgartiradi?", ru: 'Кто меняет план после разговора один на один?' }, back: { uz: "O'zingiz", ru: 'Вы сами' }, note: { uz: "Mentor savol beradi, qaror — sizniki", ru: 'Ментор задаёт вопросы, решение — ваше' } },
  { front: { uz: "Buyurtmada pul va kelishuv kim orqali bo'ladi?", ru: 'Через кого идут деньги и договорённость в заказе?' }, back: { uz: 'Ota-onangiz orqali', ru: 'Через ваших родителей' }, note: { uz: 'Birinchi buyurtma — tanish doiradan', ru: 'Первый заказ — из круга знакомых' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('nx-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="nx-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard («Kim bilan · Nechta · Muddat» + ①②③; ③ — faqat qolgan ish bo'lsa) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: 'Ish qadamlari uchun — ota-onangiz', ru: 'Для шагов «Работы» — ваши родители' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: 'yozilgan birinchi qadamlar', ru: 'записанные первые шаги' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_RAQAM = ['①', '②', '③'];
const HwCard = ({ qolgan, keyingi }) => {
  const bandlar = [
    { uz: "Ish yo'nalishida real odam, pul, xat yoki ariza bilan bog'liq qadam bo'lsa — uni ota-onangiz bilan ko'rib chiqing; butun rejani ko'rsatish — xohlasangiz.", ru: 'Если в направлении «Работа» есть шаг с реальным человеком, деньгами, письмом или заявкой — обсудите его с родителями; весь план показывать — по желанию.' },
    { uz: "Yozilgan birinchi qadamlarning sanasini o'zingiz foydalanadigan kalendarga yoki qog'ozga yozing.", ru: 'Запишите даты первых шагов в свой календарь или на бумагу.' }
  ];
  if (qolgan.length) bandlar.push({ uz: "Darsda qolgan qismni tugating: " + qolgan.map(q => q.uz).join('; ') + '.', ru: 'Закончите то, что осталось с урока: ' + qolgan.map(q => q.ru).join('; ') + '.' });
  return (
    <div className="card nx-hw fade-up">
      <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <div className="nx-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="nx-hw-q"><span className="nx-hw-k">{tr(r.k)}</span><span className="nx-hw-v">{tr(r.v)}</span></div>)}</div>
      <ol className="nx-hw-qadam">{bandlar.map((b, i) => <li key={i}><i>{HW_RAQAM[i]}</i><span>{tr(b)}</span></li>)}</ol>
      {keyingi && <span className="nx-hw-keyingi">{keyingi}</span>}
    </div>
  );
};

// ===== YAKUN — QYakun (E 50) + sarlavha uch holatda (faqat rejadan; suhbat — alohida belgi, tugallikka kirmaydi — 9.84) =====
const RECAP = [
  { uz: "Bizda olti oylik reja uch yo'nalishdan iborat: mahsulot, ko'nikma va ish.", ru: 'У нас план на полгода состоит из трёх направлений: продукт, навык и работа.' },
  { uz: "Mahsulotda qaror bor — davom ettirish yoki to'xtatish; mahsulot haqida xulosa — son yoki yozuv bilan.", ru: 'В продукте есть решение — продолжать или остановить; вывод о продукте — с числом или записью.' },
  { uz: 'Oylik maqsad — oy oxirigacha nimaga yetmoqchi ekaningiz.', ru: 'Цель месяца — чего вы хотите достичь к концу месяца.' },
  { uz: 'Bu darsda birinchi qadam — sanasi bor, bir kunda qilinadigan aniq harakat.', ru: 'На этом уроке первый шаг — конкретное действие с датой, которое делается за один день.' },
  { uz: "Sana o'tsa — sababini yozib, yangi sana qo'yasiz.", ru: 'Если дата пройдёт — запишете причину и поставите новую дату.' }
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
  const reja = useMemo(() => rejaOl(), []);
  const n = isMentorL ? 3 : rejaSoni(reja);
  const suhbat = !!(reja && reja.suhbat === true);
  const holat = n === 3 ? 'toliq' : n > 0 ? 'qisman' : 'bosh';
  const toliqH = holat === 'toliq';
  const sarlavha = holat === 'toliq' ? { uz: "Olti oylik rejangiz uch yo'nalishda yozildi.", ru: 'Ваш план на полгода записан в трёх направлениях.' }
    : holat === 'qisman' ? { uz: `Reja hali tugamagan: ${n}${NB}/${NB}3 yo'nalish.`, ru: `План ещё не закончен: ${n}${NB}/${NB}3 направления.` }
      : { uz: 'Olti oylik reja hali yozilmagan.', ru: 'План на полгода ещё не написан.' };
  const qolgan = isMentorL ? [] : [
    n < 3 && { uz: "saqlanmagan yo'nalishlarni yozing", ru: 'напишите несохранённые направления' },
    !suhbat && { uz: 'Mentor bilan suhbat vaqtini aniqlang', ru: 'уточните время разговора с Ментором' }
  ].filter(Boolean);
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Demo Day'ga tayyormisiz?»</b></>, ru: <>Следующий урок — <b>«Готовы к Demo Day?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('nx-yakun', !toliqH && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={<>{tr(sarlavha)}{holat === 'toliq' && !isMentorL && <span className="nx-suhbat-b">{suhbat ? tr({ uz: "Mentor bilan suhbat bo'ldi deb belgilandi", ru: 'Отмечено: разговор с Ментором состоялся' }) : tr({ uz: "Suhbat hali bo'lmagan", ru: 'Разговора ещё не было' })}</span>}</>}
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
export default function PmNextStepsLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 6-ekran bonusi (sixMonths)
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
        /* === 14-Modul 12-dars — darsning o'z vizuali (prefiks oor-, nx-): OltiOyReja · Telefon · varaq · yo'nalish kartasi. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @keyframes nx-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes nx-chorla { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes nx-chorla-v { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.32)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 8px ${fon(T.accent, 0)}; } }
        @keyframes nx-yashil { 0% { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; } 100% { } }
        @keyframes nx-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes nx-yon { 0%, 100% { box-shadow: none; } 40% { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; } }
        @keyframes nx-pop { 0% { transform: scale(1.25); } 100% { transform: scale(1); } }
        @keyframes nx-tush { 0% { opacity: 0; transform: translateY(-18px); } 100% { opacity: 1; transform: none; } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q; variantlar — o'z yengil chegarasi, navbatma-navbat 2 marta (E 40) */
        .nx-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: nx-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.nx-halqa { outline-offset: 3px; }
        .nx-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: nx-chorla-v 1.8s ease-out .5s 2; }
        .nx-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .nx-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: nx-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .nx-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 6px; padding: 10px 14px; }
        .nx-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        .nx-bash.ix .q-bashorat { padding-top: 8px; padding-bottom: 8px; }
        .nx-k { display: flex; flex-direction: column; flex: 1 0 auto; }
        @media (min-width: 761px) { .nx-k .q-split { grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); gap: 28px; } }
        .nx-harakat { display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 641px) { .nx-harakat.s2 { padding-left: 188px; } }
        p.nx-ipucha { margin: 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .q-xulosa .nx-xq-t { display: block; font-size: 12.5px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .nx-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .nx-xq-m { display: block; }
        .q-xulosa .nx-xq-i { display: block; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        .nx-ustoz { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .nx-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        /* Uchuvchi nusxa (P3) — body ichida, position: fixed */
        .nx-uchar { position: fixed; z-index: 1200; pointer-events: none; overflow: hidden; display: flex; align-items: center; padding: 6px 10px; border-radius: 10px; background: ${T.paper}; border: 2px solid ${T.accent}; color: ${T.ink}; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; line-height: 1.3; box-shadow: 0 14px 30px -12px rgba(${T.shadowBase},0.45); transition: left .6s cubic-bezier(.4,0,.2,1), top .6s cubic-bezier(.4,0,.2,1), width .6s cubic-bezier(.4,0,.2,1), height .6s cubic-bezier(.4,0,.2,1), opacity .6s ease-in; }

        /* === OltiOyReja — taxta: chapda uch qator nomi, o'ngda olti oy ustuni === */
        .oor { display: flex; flex-direction: column; gap: 6px; width: 100%; }
        .oor-bosh { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding-right: 40px; }
        .oor-yorliq { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .oor-belgi { font-size: 12.5px; font-weight: 700; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 3px 10px; }
        .oor-grid { display: grid; grid-template-columns: minmax(140px, 1.4fr) repeat(6, minmax(0, 1fr)); gap: 4px; align-items: stretch; }
        .oor-burchak { display: flex; align-items: flex-end; padding-bottom: 4px; }
        .oor-nq { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; }
        .oor.kichik .oor-grid { grid-template-columns: minmax(104px, 2fr) repeat(6, minmax(30px, 1fr)); }
        .oor.kichik .oor-chip { white-space: normal; font-size: 11.5px; line-height: 1.25; }
        .zoomable:not(.zoom-on) > .oor.kichik:not(:has(> .oor-bosh)) { padding-top: 30px; }
        .oor-oy { position: relative; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; text-align: center; padding: 14px 0 2px; white-space: nowrap; }
        .oor-oy.bugun { color: ${T.accent}; }
        .oor-oy em { position: absolute; left: 0; top: 0; font-style: normal; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; color: ${T.accent}; }
        .oor-m-bosh, .oor-m { min-height: 18px; position: relative; }
        .oor-dc { position: absolute; top: 0; left: 0; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 13px; font-weight: 700; color: ${T.ink2}; animation: nx-kir .5s ease-out both; }
        .oor-dc.ong { left: auto; right: 0; }
        .oor-dc i { width: 2px; height: 16px; background: ${T.ink2}; position: relative; flex: none; }
        .oor-dc i::after { content: ''; position: absolute; left: 2px; top: 0; border-left: 9px solid ${T.ink2}; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .oor-qator { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 7px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; position: relative; min-height: 46px; }
        .oor.kichik .oor-qator { padding: 6px 9px; min-height: 36px; flex-direction: row; align-items: center; flex-wrap: wrap; gap: 6px; }
        .oor-qator.joriy { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .oor-qator.yangi { animation: nx-yashil 1.1s ease-out; }
        .oor-qator.chaqnadi { animation: nx-yon 1s ease-out .35s; }
        .oor-nom { font-size: 15px; font-weight: 800; color: ${T.ink}; display: inline-flex; align-items: center; gap: 6px; animation: nx-kir .35s ease-out both; }
        .oor.kichik .oor-nom { font-size: 14px; }
        .oor-ok { color: ${T.ok}; font-size: 13px; }
        .oor-nom-bosh { display: block; width: 70%; height: 12px; border-radius: 6px; border: 1.5px dashed ${T.line}; }
        .oor-chip { font-size: 12.5px; font-weight: 700; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 9px; white-space: nowrap; animation: nx-pop .4s ease-out; }
        .oor-kul { font-size: 13px; line-height: 1.3; color: ${T.ink2}; }
        .oor.kichik .oor-kul { display: none; }
        .oor-tahrir { position: absolute; right: 6px; top: 6px; width: 26px; height: 26px; border-radius: 8px; border: 1.5px solid ${fon(T.accent, 0.45)}; background: ${T.paper}; color: ${T.accent}; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .oor.kichik .oor-tahrir { position: static; margin-left: auto; }
        .oor-tahrir:hover { background: ${T.accentSoft}; }
        .oor-tahrir.chorla { animation: nx-chorla 1.8s ease-out .3s 3; }
        .oor-katak { position: relative; border-radius: 10px; padding: 6px 8px; min-height: 46px; display: flex; flex-direction: column; gap: 3px; font-family: 'Manrope', sans-serif; text-align: left; }
        .oor.kichik .oor-katak { min-height: 36px; padding: 0; align-items: center; justify-content: center; }
        .oor-katak.bosh { border: 1.5px dashed ${T.line}; background: transparent; }
        .oor-katak.tola { background: ${T.paper}; border: 1px solid ${T.line}; }
        .oor.kichik .oor-katak.tola { background: ${T.okFon}; border-color: ${fon(T.ok, 0.35)}; }
        .oor-katak.k0 { border-left: 2px solid ${T.accent}; }
        .oor-katak.kir { animation: nx-tush .45s ease-out both; }
        .oor-katak.yonadi { animation: nx-yashil 1.1s ease-out; }
        .oor-katak.halqa { box-shadow: 0 0 0 2px ${T.accent}; }
        .oor-katak.bayroqli { padding-bottom: 26px; }
        .oor-katak.bos { cursor: pointer; border-color: ${fon(T.accent, 0.5)}; }
        .oor-katak.bos:hover { background: ${T.accentSoft}; }
        .oor-t { font-size: 14px; line-height: 1.25; color: ${T.ink}; overflow-wrap: anywhere; }
        .oor-tick { font-size: 13px; font-weight: 800; color: ${T.ok}; }
        .oor-plus { font-size: 15px; font-weight: 800; color: ${T.accent}; }
        .oor-oyn { display: none; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .oor-ust { font-size: 11.5px; font-weight: 700; line-height: 1.3; color: ${T.accent}; }
        .oor-bjoy { position: absolute; left: 6px; bottom: 6px; width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.accent, 0.6)}; }
        .oor-bayroq { position: absolute; bottom: 4px; display: inline-flex; align-items: flex-end; gap: 4px; transform: translateX(-2px); }
        .oor-bayroq.chap { flex-direction: row-reverse; transform: translateX(calc(-100% + 2px)); }
        .oor.kichik .oor-bayroq { bottom: 3px; }
        .oor-bayroq i { width: 2px; height: 18px; background: ${T.accent}; position: relative; flex: none; }
        .oor-bayroq i::after { content: ''; position: absolute; left: 2px; top: 0; border-left: 10px solid ${T.accent}; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .oor-bayroq.chap i::after { left: auto; right: 2px; border-left: none; border-right: 10px solid ${T.accent}; }
        .oor-bayroq small { font-size: 12px; font-weight: 800; color: ${T.accent}; white-space: nowrap; line-height: 1; }
        .oor-bayroq.yangi { animation: nx-tush .55s cubic-bezier(.3,1.4,.5,1) both; }
        .oor.chizil .oor-oy, .oor.chizil .oor-qator { animation: nx-kir .4s ease-out both; }
        .oor.chizil .oor-katak { animation: nx-kir .4s ease-out .9s both; }
        /* Telefon «Maydon Jamoa» — chapda, barqaror o'lcham */
        .nx-s2 { display: flex; gap: 18px; align-items: flex-start; }
        .nx-s2-o { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
        .nx-tel { flex: none; width: 170px; height: 272px; border-radius: 26px; background: ${T.ink}; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); }
        .nx-tel-ekran { height: 100%; border-radius: 19px; background: ${T.paper}; padding: 16px 12px 12px; display: flex; flex-direction: column; gap: 9px; }
        .nx-tel-ilova { font-size: 14px; font-weight: 800; color: ${MJ_RANG}; white-space: nowrap; }
        .nx-tel-sar { font-size: 12px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.06em; }
        .nx-tel-oyin { display: flex; flex-direction: column; gap: 4px; padding: 10px; border-radius: 12px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 13px; color: ${T.ink}; }
        .nx-tel-oyin b { font-size: 14px; }
        .nx-tel-son { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12.5px; white-space: nowrap; }
        .nx-tel-bar { flex: 1; height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .nx-tel-bar i { display: block; width: 80%; height: 100%; background: ${MJ_RANG}; }
        .nx-tel-tug { margin-top: auto; text-align: center; font-size: 13.5px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 9px 0; }
        /* 2-ekran — joriy gap kartasi (P4: oq karta, 2px accent, «n / N») */
        .nx-gap { display: flex; align-items: baseline; gap: 12px; padding: 12px 16px; border-radius: 14px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 6px 6px 0 -1px ${T.paper}, 6px 6px 0 0 ${T.line}, 0 12px 26px -14px rgba(${T.shadowBase},0.4); animation: nx-kir .4s ease-out both; }
        .nx-gap small { flex: none; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .nx-gap span { font-size: 15px; font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .nx-gap.silk { background: ${T.errFon}; }
        .nx-gap.ketdi { opacity: 0.25; }
        .nx-tugmalar { display: flex; flex-wrap: wrap; gap: 10px; }
        .nx-tugmalar .q-chip { min-width: 130px; text-align: center; font-size: 15px; font-weight: 700; }
        .nx-tugmalar.chorla .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: nx-chorla 1.8s ease-out .5s 2; }
        .nx-tugmalar.chorla .q-chip:nth-child(2) { animation-delay: .75s; } .nx-tugmalar.chorla .q-chip:nth-child(3) { animation-delay: 1s; }
        .nx-tugmalar .q-chip.rescue { outline: 2px solid ${fon(T.accent, 0.6)}; outline-offset: 2px; }
        /* 4-ekran — 13-Modul varag'i va qadam kartalari */
        .nx-s4 { display: flex; gap: 16px; align-items: flex-start; }
        .nx-s4 > .oor { flex: 1; min-width: 0; }
        .nx-varaq { flex: none; width: 230px; display: flex; flex-direction: column; gap: 7px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.4); animation: nx-sirg .5s ease-out both; }
        @keyframes nx-sirg { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
        p.nx-varaq-q { margin: 0; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        p.nx-varaq-q.uch { color: ${T.ink}; font-weight: 600; border-radius: 8px; padding: 4px 6px; margin: 0 -6px; transition: background .3s, box-shadow .3s; }
        p.nx-varaq-q.uch.yondi { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .nx-qadamlar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .nx-qk { display: flex; flex-direction: column; gap: 4px; text-align: left; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; cursor: pointer; font-family: 'Manrope', sans-serif; transition: border-color .2s, background .2s; }
        .nx-qk:hover:not(:disabled) { border-color: ${T.accent}; }
        .nx-qk b { font-size: 14.5px; font-weight: 700; line-height: 1.35; color: ${T.ink}; }
        .nx-qk small { font-size: 13px; color: ${T.ink2}; }
        .nx-qk.xato { background: ${T.errFon}; border-color: ${T.err}; }
        .nx-qk.silk, .nx-gap.silk { animation: nx-silk .35s ease-in-out; }
        @keyframes nx-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .nx-qadamlar.chorla .nx-qk:not(:disabled) { border-color: ${fon(T.accent, 0.55)}; animation: nx-chorla 1.8s ease-out .5s 2; }
        .nx-qadamlar.chorla .nx-qk:nth-child(2) { animation-delay: .75s; } .nx-qadamlar.chorla .nx-qk:nth-child(3) { animation-delay: 1s; }
        /* Testdan keyingi kichik taxta (SABOQ 4) */
        .nx-test-viz { margin-top: 2px; }
        .nx-mini { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .nx-mini-r { display: flex; gap: 10px; align-items: stretch; flex-wrap: wrap; }
        .nx-mini-q { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; min-width: 150px; }
        .nx-mini-q b { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .nx-mini-ok { font-size: 14px; font-weight: 700; color: ${T.ok}; background: ${T.okFon}; border-radius: 8px; padding: 3px 8px; }
        .nx-mini-k { position: relative; flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; padding: 7px 10px 28px; border-radius: 10px; border: 1px solid ${T.line}; border-left: 2px solid ${T.accent}; }
        .nx-mini-k > small { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.accent}; }
        .nx-mini-k > span { font-size: 14px; color: ${T.ink}; }
        .nx-mini-k em { position: absolute; right: 10px; bottom: 6px; font-style: normal; font-size: 12.5px; color: ${T.ink2}; }
        /* 6-ekran — strip, taxta + bitta karta */
        .nx-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .nx-strip-y { font-size: 12px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 5px 11px; margin-right: 4px; white-space: nowrap; }
        .nx-strip .q-chip.nx-tab { padding: 6px 10px; font-size: 12.5px; }
        .nx-strip .q-chip.nx-tab i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .nx-strip .q-chip.nx-tab.ok i { color: ${T.ok}; }
        .nx-strip .q-chip.nx-tab.yangi { animation: nx-pop .5s ease-out; }
        .q-mustaqil:has(.nx-s6), .q-mustaqil:has(.nx-s7), .q-mustaqil:has(.nx-fokus) { max-width: none; }
        .nx-s6, .nx-s7 { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); gap: 20px; align-items: start; }
        .nx-fokus { display: flex; flex-direction: column; gap: 12px; }
        .nx-karta { background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 8px; animation: nx-kartakir .4s ease-out both; }
        @keyframes nx-kartakir { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .nx-karta.uch { animation: nx-uch .38s ease-in both; }
        @keyframes nx-uch { to { opacity: 0; transform: translateX(-46px) scale(.7); } }
        .nx-karta.err { box-shadow: inset 0 0 0 1.5px ${T.err}, 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .nx-yol, .nx-ikki { display: flex; flex-wrap: wrap; gap: 8px; }
        .nx-yol.chorla .q-chip, .nx-ikki.chorla .q-chip { border-color: ${fon(T.accent, 0.6)}; animation: nx-chorla 1.8s ease-out .5s 2; }
        .nx-yol.chorla .q-chip:nth-child(2), .nx-ikki.chorla .q-chip:nth-child(2) { animation-delay: .75s; } .nx-yol.chorla .q-chip:nth-child(3) { animation-delay: 1s; } .nx-yol.chorla .q-chip:nth-child(4) { animation-delay: 1.25s; }
        .nx-mq { display: flex; flex-direction: column; gap: 4px; }
        .nx-maydon { position: relative; display: flex; align-items: center; gap: 8px; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 0 10px 0 8px; min-height: 42px; }
        .nx-maydon:focus-within { border-color: ${T.accent}; }
        .nx-maydon.err { border-color: ${T.err}; background: ${T.errFon}; }
        .nx-maydon.sirg { animation: nx-yashil 1s ease-out; }
        .nx-maydon.chorla { border-color: ${fon(T.accent, 0.6)}; animation: nx-chorla 1.8s ease-out .4s 2; }
        .nx-maydon-n { flex: none; width: 22px; height: 22px; border-radius: 7px; background: ${T.accentSoft}; color: ${T.accent}; font-style: normal; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        .nx-maydon input { flex: 1; min-width: 0; border: none; background: transparent; outline: none; font-family: 'Manrope', sans-serif; font-size: 15px; color: ${T.ink}; padding: 10px 0; }
        .nx-maydon input::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .nx-sana-y { font-size: 14px; font-weight: 700; color: ${T.ink2}; }
        .nx-maydon.sana input { flex: none; width: auto; margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 14px; }
        .nx-sanoq { flex: none; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; white-space: nowrap; }
        .nx-sanoq.oshdi { color: ${T.err}; font-weight: 800; }
        p.nx-kul { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        p.nx-kul.nx-tepa { font-weight: 600; }
        p.nx-yana { margin: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; }
        .nx-taklif { align-self: flex-start; text-align: left; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border: 1.5px solid ${fon(T.accent, 0.4)}; border-radius: 10px; padding: 7px 11px; cursor: pointer; line-height: 1.4; }
        .nx-taklif:hover:not(:disabled) { border-color: ${T.accent}; color: ${T.ink}; }
        .nx-taklif.qoyildi { opacity: 0.55; cursor: default; border-color: ${T.line}; }
        .nx-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .nx-yordam p { margin: 0; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .nx-yordam p + p { font-size: 12.5px; color: ${T.ink2}; }
        .nx-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .nx-karta-tug .nx-o { margin-left: auto; }
        /* 7-ekran — bo'sh oy muharriri va suhbat kartasi */
        .nx-s7-c { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .nx-katak-m { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.3); }
        .nx-katak-q { display: flex; gap: 8px; align-items: center; }
        .nx-katak-q .nx-maydon { flex: 1; }
        .nx-suhbat { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        p.nx-suhbat-h { margin: 0; font-size: 15px; font-weight: 700; color: ${T.ink}; }
        ol.nx-suhbat-s { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .nx-suhbat-s li { display: flex; gap: 8px; font-size: 14px; line-height: 1.45; color: ${T.ink2}; }
        .nx-suhbat-s li > i { flex: none; width: 20px; height: 20px; border-radius: 6px; background: ${T.bg}; color: ${T.ink2}; font-style: normal; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        .nx-taymer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .nx-taymer b { font-family: 'JetBrains Mono', monospace; font-size: 24px; color: ${T.ink}; }
        .nx-taymer-c { flex: 1; min-width: 160px; height: 8px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .nx-taymer-c i { display: block; height: 100%; background: ${T.accent}; transition: width 1s linear; }
        /* Kartochka (P10): orqa yuz neytral to'q, birinchi bosishgacha yengil halqa va ipucha */
        .nx-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: nx-puls 1.8s ease-out .4s 3; }
        .nx-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .nx-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.nx-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        p.nx-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun: ✓ faqat to'liq holatda; suhbat — alohida belgi; uyga vazifa kartasi */
        .nx-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        .nx-yakun.belgisiz .done-chip .tick { display: none; }
        .nx-suhbat-b { display: block; margin-top: 8px; font-family: 'Manrope', sans-serif; font-style: normal; font-size: 14px; font-weight: 600; letter-spacing: 0; color: ${T.ink2}; }
        .nx-hw { display: flex; flex-direction: column; gap: 12px; }
        .nx-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .nx-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .nx-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .nx-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.nx-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .nx-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .nx-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .nx-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        /* Telefon (393): har yo'nalish alohida blok, oylar 3 × 2; telefon taxta ustida, o'lchami kichraymaydi (E 41) */
        @media (max-width: 640px) {
          .nx-s2, .nx-s4 { flex-direction: column; align-items: stretch; }
          .nx-tel { align-self: center; }
          .nx-varaq { width: 100%; }
          .nx-s6, .nx-s7 { grid-template-columns: minmax(0, 1fr); }
          .nx-qadamlar { grid-template-columns: minmax(0, 1fr); }
          .oor.matnli .oor-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .oor.matnli .oor-burchak, .oor.matnli .oor-oy, .oor.matnli .oor-m-bosh, .oor.matnli .oor-m { display: none; }
          .oor.matnli .oor-qator { grid-column: 1 / -1; margin-top: 6px; }
          .oor.matnli .oor-oyn { display: block; }
          .nx-hw-karta { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nx-halqa, .nx-k.kutish .q-variant, .q-bashorat .q-chip, .nx-tugmalar .q-chip, .nx-qadamlar .nx-qk, .nx-yol .q-chip, .nx-ikki .q-chip, .nx-maydon, .oor-tahrir, .nx-strip .q-chip, .nx-karta, .nx-flash .fc-front,
          .oor-qator, .oor-katak, .oor-nom, .oor-chip, .oor-oy, .oor-dc, .oor-bayroq, .nx-gap, .nx-varaq, .nx-qk { animation: none !important; transition: none !important; }
          .nx-uchar { display: none; }
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
