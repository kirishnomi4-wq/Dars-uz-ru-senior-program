import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 14-Modul (LMS) 7-dars (PM + amaliyot) «Investor ko'zi bilan: demo buzilmaydimi?» — MD feedback/F-1008-14modul/07-PmDemoTest-v3.md (GATE M 14M-GATE-1, 07-FILTR).
// Skeletdan (src/skelet/NamunaDars.jsx) qurilgan, 2-to'lqin (F-1008-595). 12 ekran: kirish → reja → uch savol → test → uch risk → kutishlar (QMustaqil) →
//   Amaliyot 1 (buzish, tuzatish, qayta tekshiruv) → Amaliyot 2 (uch demo o'tishi, B reja) → yakuniy test → podium → kartochkalar → yakun.
// Bitta vizual — DemoSahna (ssenariy chizig'i · telefon · laptop brauzeri · buzish yozuvi). Saqlaydi: pm-m12d7-tekshiruv (tayanch 8). O'qiydi: pm-m12d6-demo, pm-m9d8-platforma.
// Mentor buzish natijasi — ⛔ «qur» pilotida (MENTOR_YOZUV.boldi/belgi/keyin, Mentor XATOLAR.md — null; to'qilmaydi). Kod oynasi yo'q.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QTaxmin, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun, QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'pm-m12d7-v1', lessonTitle: { uz: "Investor ko'zi bilan: demo buzilmaydimi?", ru: 'Глазами инвестора: не сломается ли демо?' } }; // 14-Modul 7-dars (LMS), 2-to'lqin — MD feedback/F-1008-14modul/07-PmDemoTest-v3.md
// 12 ekran (MD v3) · ballik testlar 3, 8 (ketma-ket emas — P-012) · amaliyot 5, 6, 7 — signal PRACTICE_BASE + ekran
const HW_TOKENS = [
  { t: { uz: 'demo', ru: 'демо' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "o'tish", ru: 'проход' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'kutish', ru: 'ожидание' }, l: 74, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'savollar', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'kutish',   type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'kutishlar', type: 'practice',   template: 'custom',   scored: false, scope: null },
  { id: 'a1',       type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',       type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's11',      type: 'summary',     template: 'custom',   scored: false, scope: null }
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
  return <button className={`btn-white-accent${halqa && !disabled && !locked ? ' ip-halqa' : ''}`} disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). -1 — sentinel (variant yo'q, ballsiz ekran).
// To'g'ri javob o'rinlari (MD): s3 B · s8 C. MD KOD 2 dagi ballsiz sentinel'lar (savollar, kutish) — jsx-lint «o'lik kalit» (submitAnswer ga uzatilmaydi), shuning uchun yo'q; practice — 5, 6, 7-ekran signali.
const INLINE_KEYS = { s3: 1, s8: 2, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; PM: emoji o'rniga raqam — S-026)
const RECAPS = {
  3: {
    title: { uz: "Bo'sh holatni qanday bilasiz", ru: 'Как узнать пустое состояние' },
    cards: [
      { ic: '1', h: { uz: "Demo o'tishi oddiy sharoitda: internet bor, ma'lumot bor.", ru: 'Проход демо — в обычных условиях: интернет есть, данные есть.' } },
      { ic: '2', h: { uz: "Bo'sh holatni ataylab yaratasiz — masalan, yangi hisob bilan.", ru: 'Пустое состояние создаёте нарочно — например, новым аккаунтом.' } },
      { ic: '3', h: { uz: "Keyin ekranda nima chiqqanini o'zingiz ko'rasiz.", ru: 'Потом сами смотрите, что появилось на экране.' }, ask: { uz: "Demongizda qaysi joy hali bo'sh holatda ko'rilmagan?", ru: 'Какое место вашего демо ещё не смотрели в пустом состоянии?' } }
    ]
  },
  8: {
    title: { uz: 'Qayta tekshiruv', ru: 'Повторная проверка' },
    cards: [
      { ic: '1', h: { uz: "«Tuzatish qilindi» — kodda tuzatish uchun o'zgarish qilindi.", ru: '«Исправление сделано» — в коде сделано изменение для исправления.' } },
      { ic: '2', h: { uz: "Natijani o'sha usul bilan qayta buzib ko'rasiz.", ru: 'Результат проверяете, снова ломая тем же способом.' } },
      { ic: '3', h: { uz: "Demo o'tishida tugma bir marta bosiladi — ikki marta bosish u yerda ko'rinmaydi.", ru: 'При проходе демо кнопку нажимают один раз — двойного нажатия там не видно.' }, ask: { uz: 'Ikki marta bosishni qayta tekshirish uchun nima qilasiz?', ru: 'Что вы сделаете, чтобы заново проверить двойное нажатие?' } }
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
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="dt-test-viz fade-step">{vizual}</div>}
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

// ===== DARSNING BITTA VIZUALI (163, 180) — DemoSahna: ssenariy chizig'i + taymer · telefon (2-qurilma) · laptop brauzeri · buzish yozuvi kartasi =====
// Bitta manba: MENTOR_SSENARIY · UCH_SAVOL · USULLAR · MENTOR_YOZUV · KUTISH_KARTALAR · B_REJA_GAPI · TEKSHIRUV_OYINI + o'quvchi ma'lumoti (pm-m12d6-demo, pm-m12d7-tekshiruv).
// «Maydon Jamoa» — o'z yashil rangida (11-Modul 9.62), logotipsiz. Mentor buzish natijasi — ⛔ «qur» pilotida (MENTOR_YOZUV.boldi/belgi/keyin — null, sahnada bo'sh uya).
// Tayanch 9.91: demo darsida sahna — Mentorning o'z demosi (MD «Maydon Jamoa» ssenariysi) qoladi; tanish sayt maketi va o'lchov sonlari bu darsda yo'q.
// Odam figurasi chizilmaydi (P1). Rangli yon chiziq yo'q; reduced-motion — CSS da va kamHarakat() bilan.
// qolip-maket: dt-qadam dt-v dt-belgi dt-tab dt-taymer dt-otq dt-vtan dt-ix-q dt-md-t dt-nusxa
const cxx = (...a) => a.filter(Boolean).join(' ');
const NB = String.fromCharCode(160);
const MJ_RANG = '#2E9E4F'; // «Maydon Jamoa» — 11-Modul 9.62 yashili (9–13-Modul darslari bilan bir), logotipsiz
const MJ = () => <span className="dt-mj">Maydon Jamoa</span>;
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const tx = (o) => fmtCode(tr(o));

// --- Saqlanadigan natija (tayanch 8) va o'qiladigan kalitlar ---
const TEK_KEY = 'pm-m12d7-tekshiruv';
const DEMO_KEY = 'pm-m12d6-demo';
const PLAT_KEY = 'pm-m9d8-platforma';
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const USUL_ID = ['tarmoq', 'bosh', 'ikki'];
const boshUrinish = (usul) => ({ usul, qildim: '', kutdim: '', boldi: '', buzildi: null, tuzatishQilindi: false, qayta: null });
const boshOtish = () => [{ tur: 'jonli', natija: null, vaqt: null }, { tur: 'breja', natija: null, vaqt: null }, { tur: 'jonli', natija: null, vaqt: null }];
const tekOl = () => {
  const o = lsO(TEK_KEY) || {};
  const u = Array.isArray(o.urinishlar) ? o.urinishlar : [];
  const urinishlar = USUL_ID.map((id, i) => {
    const x = u.find(r => r && r.usul === id) || u[i] || {};
    const buzildi = x.buzildi === true ? true : x.buzildi === false ? false : null;
    return { usul: id, qildim: String(x.qildim || ''), kutdim: String(x.kutdim || ''), boldi: String(x.boldi || ''), buzildi, tuzatishQilindi: buzildi === true && x.tuzatishQilindi === true,
      qayta: x.qayta === 'takrorlanmadi' || x.qayta === 'takrorlandi' ? x.qayta : null };
  });
  const ot = Array.isArray(o.otishlar) ? o.otishlar : [];
  const otishlar = boshOtish().map((b, i) => { const x = ot[i] || {}; return { tur: b.tur, natija: typeof x.natija === 'string' ? x.natija : null, vaqt: Number.isFinite(x.vaqt) ? x.vaqt : null }; });
  return { urinishlar, otishlar, bor: !!lsO(TEK_KEY) };
};
const tekYoz = (urinishlar, otishlar) => lsY(TEK_KEY, { urinishlar, otishlar, savedAt: Date.now() });
const demoOl = () => {
  const d = lsO(DEMO_KEY) || {};
  const ss = Array.isArray(d.ssenariy) ? d.ssenariy.map(s => String(s || '').trim()).filter(Boolean) : [];
  return { ssenariy: ss.length ? ss : null, video: d.video === true ? true : d.video === false ? false : null, uygotish: d.uygotish === true };
};
const trekOl = () => { const p = lsO(PLAT_KEY); return p && (p.trek === 'mobil' || p.trek === 'web') ? p.trek : null; };
const useMentorLive = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };

// --- Mentor misoli (tayanch 1.6, 1.7, 1.14 — AYNAN; A-6) ---
const MENTOR_SSENARIY = [
  { uz: 'Kirish', ru: 'Вход' }, { uz: "O'yinlar", ru: 'Игры' }, { uz: "Qo'shilish", ru: 'Присоединение' },
  { uz: 'Ikkinchi telefon', ru: 'Второй телефон' }, { uz: "Hozir ko'ryapti", ru: 'Сейчас смотрят' }
];
const UCH_SAVOL = [
  { matn: { uz: 'Mahsulot jonli ishlaydimi?', ru: 'Продукт работает вживую?' }, otishda: true, qadam: 3 },
  { matn: { uz: 'Nima ekani bir qarashda bilinadimi?', ru: 'Понятно ли с первого взгляда, что это?' }, otishda: false, qadam: 1 },
  { matn: { uz: 'Buzilsa, ekranda nima bo\'ladi?', ru: 'Если сломается, что будет на экране?' }, otishda: false, qadam: null }
];
const USULLAR = [
  { id: 'tarmoq', nom: { uz: 'Tarmoq uzilishi', ru: 'Обрыв сети' }, yorliq: { uz: 'tarmoq uzilishi', ru: 'обрыв сети' }, hodisa: { uz: 'Zalda internet bir lahzaga uzilishi mumkin.', ru: 'В зале интернет может на миг пропасть.' },
    qilaman: { uz: 'Telefonda uchish rejimini yoqaman; demo harakatini laptopda qilaman; keyin uchish rejimini o\'chiraman.', ru: 'Включаю на телефоне режим полёта; делаю действие демо на ноутбуке; потом выключаю режим полёта.' } },
  { id: 'bosh', nom: { uz: "Bo'sh ma'lumot", ru: 'Пустые данные' }, yorliq: { uz: "bo'sh ma'lumot", ru: 'пустые данные' }, hodisa: { uz: "Yangi e'lon qilingan o'yinda hali hech kim yo'q.", ru: 'В только что объявленной игре ещё никого нет.' },
    qilaman: { uz: "Agent tekshiruv akkauntida hali bo'sh yozuv ochadi; uni demo yo'limda ochaman.", ru: 'Агент открывает пока пустую запись в проверочном аккаунте; я открываю её на пути демо.' } },
  { id: 'ikki', nom: { uz: 'Ikki marta bosish', ru: 'Двойное нажатие' }, yorliq: { uz: 'ikki marta bosish', ru: 'двойное нажатие' }, hodisa: { uz: 'Hayajonda tugma tez ikki marta bosilishi mumkin.', ru: 'От волнения кнопку могут быстро нажать дважды.' },
    qilaman: { uz: "Demo yo'limdagi asosiy tugmani tez ikki marta bosaman.", ru: 'Быстро дважды нажимаю главную кнопку на пути демо.' } }
];
// Mentorning buzish yozuvi — «Nima qildim» va «Nima kutdim» Mentorning o'z matni; boldi/belgi/keyin — ⛔ «qur» pilotida haqiqiy natijadan (to'qilmaydi)
const MENTOR_YOZUV = [
  { usul: 'tarmoq', qildim: { uz: "Telefonda «Shanba, 18:00» o'yinini ochib, uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach laptopda shu o'yinga qo'shildim; keyin uchish rejimini o'chirdim.", ru: 'Открыл на телефоне игру «Суббота, 18:00» и включил режим полёта; когда метка стала «Подключение…», присоединился к этой игре на ноутбуке; потом выключил режим полёта.' },
    kutdim: { uz: "Belgi «Ulangan» bo'lgach, telefonda «9 / 10» ko'rinadi", ru: 'Когда метка станет «Подключено», на телефоне видно «9 / 10»' }, boldi: null, belgi: null, keyin: null },
  { usul: 'bosh', qildim: { uz: "Agent tekshiruv akkauntidan yangi o'yin e'lon qildi — «Juma, 18:00 · Mahalla maydoni», hali hech kim qo'shilmagan; laptopda «O'yinlar» ni yangilab, shu o'yinni ochdim.", ru: 'Агент объявил из проверочного аккаунта новую игру — «Пятница, 18:00 · Площадка махалли», пока никто не присоединился; на ноутбуке я обновил «Игры» и открыл эту игру.' },
    kutdim: { uz: "O'yin nomi, «0 / 10» va «Qo'shilaman» ko'rinadi", ru: 'Видны название игры, «0 / 10» и «Присоединяюсь»' }, boldi: null, belgi: null, keyin: null },
  { usul: 'ikki', qildim: { uz: "Laptopda «Shanba, 18:00» o'yinida «Qo'shilaman» ni tez ikki marta bosdim.", ru: 'На ноутбуке в игре «Суббота, 18:00» быстро дважды нажал «Присоединяюсь».' },
    kutdim: { uz: "Bitta qo'shilish: son bir marta o'zgaradi, «9 / 10»", ru: 'Одно присоединение: число меняется один раз, «9 / 10»' }, boldi: null, belgi: null, keyin: null }
];
const B_REJA_GAPI = { uz: 'Internet uzildi — shu demoning 60 soniyalik videosini ko\'rsataman.', ru: 'Интернет пропал — покажу 60-секундное видео этого демо.' };
const TEKSHIRUV_OYINI = { vaqt: { uz: 'Juma, 18:00', ru: 'Пятница, 18:00' }, joy: { uz: 'Mahalla maydoni', ru: 'Площадка махалли' }, son: 0 };
const KUTISH_KARTALAR = [
  { usul: 'tarmoq', variantlar: [{ t: MENTOR_YOZUV[0].kutdim, tur: 'togri' }, { t: { uz: 'Internet uzilsa ham demo hakamga yaxshi ko\'rinadi', ru: 'Даже без интернета демо хорошо смотрится для судьи' }, tur: 'mavhum' }, { t: { uz: "Demodan oldin zal Wi-Fi'ini tekshirib qo'yaman", ru: 'Перед демо заранее проверю Wi-Fi в зале' }, tur: 'oldini' }] },
  { usul: 'bosh', variantlar: [{ t: { uz: "Yangi o'yin sahifasi chiroyli va tez ochiladi", ru: 'Страница новой игры открывается красиво и быстро' }, tur: 'mavhum' }, { t: MENTOR_YOZUV[1].kutdim, tur: 'togri' }, { t: { uz: "Demodan oldin hamma o'yinga odam qo'shib qo'yaman", ru: 'Перед демо заранее добавлю людей во все игры' }, tur: 'oldini' }] },
  { usul: 'ikki', variantlar: [{ t: { uz: 'Tugmani sekin, bir marta bosishni mashq qilaman', ru: 'Потренируюсь нажимать кнопку медленно, один раз' }, tur: 'oldini' }, { t: { uz: "Tugma bosilganda hammasi to'g'ri ishlaydi", ru: 'При нажатии кнопки всё работает правильно' }, tur: 'mavhum' }, { t: MENTOR_YOZUV[2].kutdim, tur: 'togri' }] }
];
const SCREEN_INTENTS = [
  'kirish: zalda internet uzilsa demo nima ko\'rsatadi — tekshirilmagan', 'reja: demo tekshiruvi, uch savol, uch risk, ikki amaliyot', 'demo o\'tishi uch savoldan faqat birinchisiga javob beradi — demo tekshiruvi',
  'test: bo\'sh holatni qanday bilasiz (kitob almashish ilovasi)', 'uch risk: kutish — ekrandagi narsa, oldini olishdan farqi', 'o\'z demosining uch kutishi — pm-m12d7-tekshiruv',
  'Amaliyot 1: buzish, tuzatish, qayta tekshiruv, XATOLAR.md', 'Amaliyot 2: uch demo o\'tishi, ikkinchisida B reja', 'yakuniy test: qayta tekshiruv o\'sha usul bilan', 'podium', 'kartochkalar', 'yakun: 5 holat'
];

// --- Matn tekshiruvi (5-ekran): ikki tilli; apostrof shakllari normT bilan bir xil (PM-108 — node da sinalgan) ---
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normT = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const PII_RE = /@|t\.me\/|\+998|\d{7,}|https?:|www\.|\.uz\b|\.com\b/;
const MAVHUM_RE = /(yaxshi|to'g'ri|ishlaydi|normal|хорош|правильн|работает|нормальн)/;
const SON_RE = /\d/;
const QOSHT_RE = /[«»"„“”]/;
const kutishTekshir = (qildim, kutdim) => {
  const k = normT(kutdim);
  if (!k) return { x: 'bosh', blok: true };
  if (PII_RE.test(k) || PII_RE.test(normT(qildim))) return { x: 'pii', blok: true };
  if (MAVHUM_RE.test(k) && !SON_RE.test(k) && !QOSHT_RE.test(String(kutdim))) return { x: 'mavhum', blok: false };
  return null;
};
const S5_XATO = {
  bosh: { uz: 'Nima kutishingizni yozing: ekranda nima ko\'rinadi?', ru: 'Напишите, чего ждёте: что видно на экране?' },
  pii: { uz: 'Yozuvga telefon, akkaunt va havola yozilmaydi.', ru: 'В запись не пишут телефон, аккаунт и ссылку.' },
  mavhum: { uz: 'Buni ekranda qanday ko\'rasiz? Son yoki yozuvni ayting.', ru: 'Как вы увидите это на экране? Назовите число или надпись.' }
};

// --- Yordamchi ilgaklar ---
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useIpucha = (faol, kalit) => {
  const [k, setK] = useState(false);
  useEffect(() => { setK(false); if (!faol) return undefined; const t = setTimeout(() => setK(true), 40000); return () => clearTimeout(t); }, [faol, kalit]);
  return faol && k;
};
// «Uchadi» (P3): bosilgan narsa nusxasi o'z joyiga ko'rinib uchadi (~0,6 s), keyin joy to'ladi
const useUch = () => {
  const [uch, setUch] = useState(null);
  const uchir = (a, b, matn, keyin) => {
    if (kamHarakat() || !a || !b || !a.getBoundingClientRect) { keyin(); return; }
    const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
    setUch({ x: r1.left, y: r1.top, w: r1.width, dx: r2.left - r1.left, dy: r2.top + r2.height / 2 - (r1.top + r1.height / 2), sx: Math.max(0.4, Math.min(1, r2.width / Math.max(1, r1.width))), matn, bor: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setUch(u => (u ? { ...u, bor: true } : u))));
    setTimeout(() => { setUch(null); keyin(); }, 640);
  };
  const el = uch && <div className={cxx('dt-uchar', uch.bor && 'bor')} aria-hidden="true" style={{ left: uch.x, top: uch.y, width: uch.w, transform: uch.bor ? 'translate(' + uch.dx + 'px,' + uch.dy + 'px) scale(' + uch.sx + ')' : 'none' }}>{uch.matn}</div>;
  return [el, uchir, !!uch];
};
// Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42)
const XulosaQ = ({ taxmin, matn, izoh }) => (<>
  {taxmin}
  <span className="dt-xq-m">{matn}</span>
  {izoh && <span className="dt-xq-i">{izoh}</span>}
</>);
const TaxminQ = ({ togri, aslida }) => (togri
  ? <span className="dt-xq-t">{tr({ uz: "Taxminingiz to'g'ri chiqdi ✓", ru: 'Ваше предположение верно ✓' })}</span>
  : <span className="dt-xq-t xato">{tr({ uz: 'Taxminingiz ✕ — aslida:', ru: 'Ваше предположение ✕ — на деле:' })} {aslida}</span>);
const IPUCHA = (t) => <p className="dt-ipucha fade-step">{t}</p>;
const ixchamBashorat = (taxmin, el) => <div className={cxx('dt-bash', taxmin && 'ix')}>{el}</div>;
// O'qituvchi eslatmasi — faqat Mentor rejimida (MD)
const Ustoz = ({ satrlar }) => (useMentorLive()
  ? <div className="dt-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{satrlar.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>
  : null);
const Kulrang = ({ children }) => <span className="dt-kul">{children}</span>;
const Band = ({ children }) => <span className="dt-band">{children}</span>;

// --- Belgilar (SVG; emoji emas) ---
const WifiIc = ({ kesik }) => <svg className={cxx('dt-wifi', kesik && 'kesik')} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2.5 9a14 14 0 0 1 19 0M5.8 12.4a9.3 9.3 0 0 1 12.4 0M9.1 15.8a4.6 4.6 0 0 1 5.8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="19.2" r="1.4" fill="currentColor" />{kesik && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}</svg>;
const SamolyotIc = () => <svg className="dt-samolyot" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M21 15.5v-1.8l-7.5-4.7V4.3a1.5 1.5 0 0 0-3 0V9L3 13.7v1.8l7.5-2.2v4.6l-2 1.5V21l3.5-1 3.5 1v-1.6l-2-1.5v-4.6z" fill="currentColor" /></svg>;
const ULANISH = { ulangan: { uz: 'Ulangan', ru: 'Подключено' }, ulanmoqda: { uz: 'Ulanmoqda…', ru: 'Подключение…' }, ulanmagan: { uz: 'Ulanmagan', ru: 'Не подключено' } };

// --- Ssenariy chizig'i (5 qadam) + taymer chizig'i (12-Modul TaymerChiziq naqshi; animatsiya vaqti — son emas) ---
const TaymerChiziq = ({ tol = 'toliq', dur = 10, kechik = 0 }) => (
  <div className={cxx('dt-tm', tol)}>
    <span className="dt-tm-ch"><i style={tol === 'yur' ? { animationDuration: dur + 's', animationDelay: kechik + 's' } : undefined} /></span>
    <span className="dt-tm-y">{tr({ uz: 'Mentor rejasi: 60–90 soniya', ru: 'План Ментора: 60–90 секунд' })}</span>
  </div>
);
const SsenariyChiziq = ({ qadam = 0, joriy = true, yon = -1, belgilar = {}, yorliqlar, taymer, qRef, ssRef, matnlar }) => (
  <div className="dt-ss" ref={ssRef}>
    {yorliqlar && <div className="dt-ss-yl">{yorliqlar.map((y, i) => <span key={i} className="dt-ss-y" style={{ animationDelay: (i * 0.12) + 's' }}>{y}</span>)}</div>}
    <div className="dt-ss-q">
      {(matnlar || MENTOR_SSENARIY.map(tr)).map((s, i) => (
        <span key={i} ref={qRef ? (el) => { qRef.current[i] = el; } : undefined} className={cxx('dt-qadam', i < qadam && 'ok', joriy && i === qadam && 'joriy', i === yon && 'yon')}>
          <i>{i < qadam ? '✓' : i + 1}</i><span>{s}</span>{belgilar[i] && <em key={'b' + i} className="dt-qadam-b">{belgilar[i]}</em>}
        </span>
      ))}
    </div>
    {taymer && <TaymerChiziq {...taymer} />}
  </div>
);
// --- Telefon (2-qurilma, ≈170×272, o'lchami barqaror): «O'yin» ekrani ---
const DemoTel = ({ son = 8, ulanish = null, samolyot = false, kutish = false, hozir = null }) => (
  <div className="dt-dev">
    <span className="dt-yl">{tr({ uz: '2-qurilma · telefon', ru: '2-е устройство · телефон' })}</span>
    <div className="dt-tel"><div className="dt-tel-ekran">
      <span className="dt-tel-hol">{samolyot && <SamolyotIc />}</span>
      <span className="dt-tel-nom"><MJ /></span>
      {ulanish && <span key={ulanish} className={cxx('dt-ul', ulanish)}><i />{tr(ULANISH[ulanish])}</span>}
      <b className="dt-tel-vaqt">{tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
      <span className="dt-tel-joy">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
      <span className={cxx('dt-tel-sq', kutish && 'kutish')}><b key={son} className={cxx('dt-tel-son', son > 8 && 'yangi')}>{son}{NB}/{NB}10</b></span>
      <span className="dt-tel-doira">{Array.from({ length: 10 }).map((_, i) => <i key={i} className={i < son ? 'bor' : ''} />)}</span>
      {hozir != null && <span className="dt-hozir"><i />{tr({ uz: "Hozir ko'ryapti:", ru: 'Сейчас смотрят:' })} {hozir}</span>}
      <span className="dt-tel-tugma">{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>
    </div></div>
  </div>
);
// --- Laptop brauzeri (proyektorga): manzil satri · «O'yinlar» · e'lon kartasi · «Qo'shilaman»; B reja kadri — video oynasi ---
const DemoLaptop = ({ oyin = 'shanba', son = 8, bosildi = false, ikki = false, kutish = false, wifiKesik = false, xira = false, savol = false, tekshirilmagan = false, elonYorliq = null, video = false, pufak = null, elonRef }) => (
  <div className="dt-dev dt-dev-lap">
    <span className="dt-yl">{tr({ uz: 'laptop · proyektorga', ru: 'ноутбук · на проектор' })}</span>
    <div className={cxx('dt-lap', xira && 'xira')}>
      <div className="dt-lap-bar"><span className="dt-lap-n"><i /><i /><i /></span><span className="dt-lap-url">maydon-jamoa-….netlify.app</span><WifiIc kesik={wifiKesik} /></div>
      <div className="dt-lap-ekran">
        {video ? <div className="dt-video">
          {pufak && <span className="dt-pufak">«{pufak}»</span>}
          <span className="dt-video-k"><span className="dt-video-play">▶</span><span className="dt-video-y">{tr({ uz: 'B reja · video', ru: 'План Б · видео' })}</span></span>
          <span className="dt-video-ch"><i /></span>
          <span className="dt-video-v">{tr({ uz: '60 soniya', ru: '60 секунд' })}</span>
        </div> : <>
          <span className="dt-lap-h"><MJ /><b>{tr({ uz: "O'yinlar", ru: 'Игры' })}</b></span>
          <span ref={elonRef} className={cxx('dt-elon', kutish && 'kutish')}>
            {elonYorliq && <em className="dt-elon-y">{elonYorliq}</em>}
            <b className="dt-elon-v">{oyin === 'juma' ? tr(TEKSHIRUV_OYINI.vaqt) : tr({ uz: 'Shanba, 18:00', ru: 'Суббота, 18:00' })}</b>
            <span className="dt-elon-j">{tr({ uz: 'Mahalla maydoni', ru: 'Площадка махалли' })}</span>
            <span className="dt-elon-q">
              {son == null ? <i className="dt-bosh-joy" /> : <b key={son} className={cxx('dt-elon-son', son === 9 && 'yangi')}>{son}{NB}/{NB}10</b>}
              <span className={cxx('dt-lap-tugma', bosildi && 'bosildi')}>{bosildi && <i>✓</i>}{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}{ikki && <span className="dt-ikki"><i /><i /></span>}</span>
            </span>
          </span>
        </>}
        {savol && <span className="dt-savol"><b>?</b>{tekshirilmagan && <em className="fade-step">{tr({ uz: 'tekshirilmagan', ru: 'не проверено' })}</em>}</span>}
      </div>
    </div>
  </div>
);
// --- Buzish yozuvi kartasi: uch qator yorlig'i · belgi joyi; kutish qatori — accent uzuq ramka (U-041) ---
const YOZUV_Q = { qildim: { uz: 'Nima qildim', ru: 'Что сделал' }, kutdim: { uz: 'Nima kutdim', ru: 'Чего ждал' }, boldi: { uz: "Nima bo'ldi", ru: 'Что произошло' } };
const YozuvKarta = ({ yorliq, urinishlar, qatorlar = ['qildim', 'kutdim', 'boldi'], belgi = true, kutRef, yon = -1, className }) => (
  <div className={cxx('dt-yozuv', className)}>
    {yorliq && <span className="dt-yz-yl">{yorliq}</span>}
    {urinishlar.map((u, i) => (
      <div key={i} className={cxx('dt-yz-u', i === yon && 'yon')}>
        {u.nom && <b className="dt-yz-nom">{(u.n ?? i + 1)} · {u.nom}</b>}
        {qatorlar.map(q => (
          <span key={q} ref={q === 'kutdim' && kutRef ? (el) => { kutRef.current[i] = el; } : undefined} className={cxx('dt-yz-q', q, !u[q] && 'bosh')}>
            <em>{tr(YOZUV_Q[q])}</em>{u[q] ? <span className="dt-yz-m">{u[q]}</span> : <span className="dt-yz-uya" />}
          </span>
        ))}
        {belgi && (u.belgi ? <span className={cxx('dt-yz-b', u.belgiK)}>{u.belgi}</span> : <span className="dt-yz-b bosh">{tr({ uz: 'belgi', ru: 'метка' })}</span>)}
      </div>
    ))}
  </div>
);
const DemoSahna = ({ ss, tel, lap, yozuv, keng = false, className }) => (
  <div className={cxx('dt-sahna', keng && 'keng', yozuv && 'yozuvli', className)}>
    {ss && <SsenariyChiziq {...ss} />}
    {(tel || lap || yozuv) && <div className="dt-sahna-q">{tel && <DemoTel {...tel} />}{lap && <DemoLaptop {...lap} />}{yozuv}</div>}
  </div>
);
const mentorYozuvQ = (qatorlar) => MENTOR_YOZUV.map((m, i) => ({ nom: tr(USULLAR[i].nom), qildim: qatorlar.includes('qildim') ? tr(m.qildim) : null, kutdim: tr(m.kutdim), boldi: null }));

// ===== SCREEN 0 — KIRISH (QKirish; ✔ «Tekshirmaganman»; javob «Aynan!» / «Qiziq fikr!» — T-028, T-067; ballsiz) =====
const HOOK_OPTS = [
  { id: 'oq', t: { uz: "Oq ekran — hech narsa ko'rinmaydi", ru: 'Белый экран — ничего не видно' } },
  { id: 'eski', t: { uz: "Eski son — o'zgarish ko'rinmaydi", ru: 'Старое число — изменения не видно' } },
  { id: 'tekshirmagan', t: { uz: 'Tekshirmaganman — hali bilmayman', ru: 'Не проверял — пока не знаю' } }
];
const HOOK_JAVOB = {
  togri: { uz: <><b>Aynan!</b> Mashqda internet bor edi. Uzilsa nima ko'rinishini faqat ataylab uzib bilasiz.</>, ru: <><b>Именно!</b> На репетиции интернет был. Что видно при обрыве, узнаете, только оборвав его нарочно.</> },
  boshqa: { uz: <><b>Qiziq fikr!</b> Shunday bo'lishi mumkin. Lekin buni qayerdan bilasiz — internetni ataylab uzib ko'rganmisiz?</>, ru: <><b>Интересная мысль!</b> Так может быть. Но откуда вы это знаете — вы нарочно отключали интернет?</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: v === 'tekshirmagan' }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive halqa={picked !== null} disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('dt-k', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Zalda internet uzilsa, <A>demongiz nima ko'rsatadi?</A></>, ru: <>Если в зале пропадёт интернет, <A>что покажет ваше демо?</A></> })}
          mentor={<Mentor>{tr({ uz: "6-darsdagi demo o'tishini eslang. Endi demongizni hakam o'rnida ko'ring va bittasini tanlang.", ru: 'Вспомните проход демо с 6-го урока. Теперь посмотрите на своё демо глазами судьи и выберите один вариант.' })}</Mentor>}
          maket={<div className="dt-k-maket">
            <span className="dt-ramka-y">{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></span>
            <DemoSahna tel={{ son: 8 }} lap={{ wifiKesik: true, xira: true, savol: true, tekshirilmagan: picked !== null }} />
          </div>}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(picked === 'tekshirmagan' ? HOOK_JAVOB.togri : HOOK_JAVOB.boshqa)}</p>}
        />
        <Ustoz satrlar={[{ uz: "Sinfdan so'rang: «Demo paytida sizda nima kutilmagan bo'lgan?» Javoblarni taxtaga yozing — ular bugungi uch riskka o'xshab chiqadi. Kim nima deganini sanamang.", ru: 'Спросите класс: «Что неожиданного случалось у вас во время демо?» Запишите ответы на доске — они окажутся похожи на сегодняшние три риска. Кто что сказал, не считайте.' }]} />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual bir marta o'zi yuradi: besh qadam ✓, taymer, bo'sh yozuv kartasi; tugagach «Boshlaymiz» halqada) =====
const REJA = [
  { t: { uz: "Hakam demoda nimani ko'rishini bilasiz", ru: 'Узнаете, что судья видит в демо' }, teg: { uz: 'uch savol', ru: 'три вопроса' } },
  { t: { uz: 'Uch riskda nima kutishingizni yozasiz', ru: 'Запишете, чего ждёте при трёх рисках' }, teg: { uz: 'buzish yozuvi', ru: 'запись поломки' } },
  { t: { uz: 'Demongizni buzasiz, agent tuzatadi', ru: 'Сломаете своё демо, агент исправит' }, teg: { uz: 'Tuzatish qilindi', ru: 'Исправление сделано' } },
  { t: { uz: "Demoni uch marta to'liq o'tasiz", ru: 'Трижды полностью пройдёте демо' }, teg: { uz: 'B reja', ru: 'План Б' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [q, setQ] = useState(() => (kamHarakat() ? 5 : 0));
  useEffect(() => {
    if (q >= 5) return undefined;
    const t = setTimeout(() => setQ(n => n + 1), q === 0 ? 700 : 1100);
    return () => clearTimeout(t);
  }, [q]);
  const tayyor = q >= 5;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={tayyor} label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun demongizni <A>ataylab buzib tekshirasiz.</A></>, ru: <>Сегодня вы <A>нарочно сломаете и проверите</A> своё демо.</> })}
        mentor={<Mentor>{tr({ uz: "Mentor misoli — namuna; ikkala amaliyot — o'z mahsulotingizda, 6-darsdagi demo ssenariyingiz bo'yicha.", ru: 'Пример Ментора — образец; обе практики — на вашем продукте, по сценарию демо с 6-го урока.' })}</Mentor>}
        chapYorliq={tr({ uz: "demo tekshiruvi: buzamiz, agent tuzatadi, uch marta to'liq o'tish", ru: 'проверка демо: ломаем, агент исправляет, три полных прохода' })}
        chap={<div className="dt-reja">
          <p className="dt-kul-p">{tr({ uz: "Buzish — faqat o'z mahsulotingizda.", ru: 'Ломать — только свой продукт.' })}</p>
          <DemoSahna ss={{ qadam: q, joriy: !tayyor, taymer: { tol: kamHarakat() ? 'toliq' : 'yur', dur: 6, kechik: 0.7 } }}
            yozuv={<YozuvKarta urinishlar={[{ qildim: null, kutdim: null, boldi: null }]} />} />
        </div>}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
      >
        <p className="dt-pastki">{tr({ uz: "repo — o'z repo'ngiz", ru: 'репо — ваш собственный' })} · {tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })} <code className="qcode">maydon-jamoa</code> · {tr({ uz: 'namuna', ru: 'образец' })} <code className="qcode">m14-dars-07-done</code></p>
        <Ustoz satrlar={[{ uz: "Menyu ostidagi «uch marta to'liq o'tish» — Amaliyot 2: demo boshidan oxirigacha uch marta, ikkinchisida B reja. Bugun yangi funksiya qo'shilmaydi: 6-darsdan beri faqat tuzatish. Buzish — faqat o'quvchining o'z mahsulotida.", ru: '«Три полных прохода» под меню — это Практика 2: демо от начала до конца три раза, во втором — План Б. Сегодня новых функций не добавляем: с 6-го урока — только исправления. Ломать — только собственный продукт ученика.' }]} />
      </QReja>
    </Stage>
  );
};

// ===== SCREEN 2 — UCH SAVOL (QTushuncha; bashorat → demo o'tishi ≈10 s → 3 savol kartasi bittadan; kalit [ko'rindi, ko'rinmadi, ko'rinmadi]; ballsiz, nishon investorEye) =====
const S2_TAXMIN = [{ k: '1', t: { uz: 'Bittasiga', ru: 'На один' } }, { k: '2', t: { uz: 'Ikkitasiga', ru: 'На два' } }, { k: '3', t: { uz: 'Uchalasiga', ru: 'На все три' } }];
const S2_XATO = [
  { uz: "4-qadamga qarang: telefonda son nima bo'ldi?", ru: 'Посмотрите на шаг 4: что стало с числом на телефоне?' },
  { uz: "Ma'lumot bor. Birinchi ko'rgan odam tushunganini kim aytadi?", ru: 'Данные есть. Кто скажет, понял ли тот, кто видит это впервые?' },
  { uz: "O'tishda internet uzildimi yoki hammasi oddiy edimi?", ru: 'Во время прохода интернет обрывался или всё было как обычно?' }
];
const UCH_YORLIQ = [{ uz: 'internet bor', ru: 'интернет есть' }, { uz: "ma'lumot bor", ru: 'данные есть' }, { uz: 'tugma bir marta bosildi', ru: 'кнопку нажали один раз' }];
const QADAM_MS = 2000;
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [oq, setOq] = useState(avval ? 5 : -1); // -1 — o'tish boshlanmagan
  const [s, setS] = useState(avval ? 3 : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(false);
  const [yon, setYon] = useState(-1);
  const wrongRef = useRef(false);
  const kartaRef = useRef(null); const qRef = useRef([]); const elonRef = useRef(null); const ssRef = useRef(null);
  const [uchEl, uchir, uchmoqda] = useUch();
  const otildi = oq >= 5;
  const done = s >= 3;
  const tugadi = useTugadi(done, 1100, avval);
  const ipucha = useIpucha(!!taxmin && otildi && !done, s);
  useEffect(() => {
    if (oq < 0 || oq >= 5) return undefined;
    const t = setTimeout(() => setOq(n => n + 1), oq === 0 ? 600 : QADAM_MS);
    return () => clearTimeout(t);
  }, [oq]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', screenIdx: screen, correct: !wrongRef.current, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const boshla = () => { if (!taxmin || oq >= 0) return; setOq(kamHarakat() ? 5 : 0); };
  const javob = (korindi) => {
    if (done || uchmoqda || !otildi) return;
    const sv = UCH_SAVOL[s];
    if (korindi !== sv.otishda) {
      wrongRef.current = true; if (achMiss) achMiss.miss(screen);
      setXato(s); setSilk(true); setTimeout(() => setSilk(false), 460); return;
    }
    setXato(null);
    const keyin = () => { setYon(s === 0 ? 3 : -1); setS(s + 1); setTimeout(() => setYon(-1), 1100); };
    const nishon = s === 0 ? qRef.current[3] : s === 1 ? elonRef.current : ssRef.current;
    uchir(kartaRef.current, nishon, <><b>{tr(sv.matn)}</b><span>{korindi ? tr({ uz: "O'tishda ko'rindi", ru: 'Видно при проходе' }) : tr({ uz: "O'tishda ko'rinmadi", ru: 'Не видно при проходе' })}</span></>, keyin);
  };
  const tx2 = S2_TAXMIN.find(t => t.k === taxmin);
  const xulosaEl = done && <XulosaQ taxmin={tx2 && <TaxminQ togri={taxmin === '1'} aslida={tr({ uz: 'bittasiga', ru: 'на один' })} />}
    matn={tr({ uz: "Bu misolda o'tish bitta savolga javob berdi. Qolgan ikkitasini tinglovchi va buzish ko'rsatadi.", ru: 'В этом примере проход ответил на один вопрос. Остальные два покажут слушатель и поломка.' })}
    izoh={tr({ uz: "Demoni ataylab buzib, ekranda nima bo'lishini oldindan tekshirish — demo tekshiruvi deyiladi.", ru: 'Нарочно сломать демо и заранее проверить, что будет на экране, — это называется проверкой демо.' })} />;
  const sahna = <DemoSahna keng={tugadi} yozuv={tugadi && <QXulosa>{xulosaEl}</QXulosa>}
    ss={{ qadam: Math.max(0, oq), joriy: oq >= 0 && !otildi, yon, qRef, ssRef, belgilar: s >= 1 ? { 3: '✓' } : {}, yorliqlar: s >= 3 ? UCH_YORLIQ.map(tr) : null,
      taymer: { tol: oq < 0 ? 'bosh' : otildi && avval ? 'toliq' : 'yur', dur: kamHarakat() ? 0 : QADAM_MS * 5 / 1000, kechik: 0.6 } }}
    tel={{ son: oq >= 4 ? 9 : 8, ulanish: 'ulangan', hozir: oq >= 5 ? 2 : null }}
    lap={{ son: oq >= 3 ? 9 : 8, bosildi: oq >= 3, elonRef, elonYorliq: s >= 2 ? tr({ uz: "ma'lumot bor — tinglovchi kerak", ru: 'данные есть — нужен слушатель' }) : null }} />;
  const label = done ? { uz: 'Davom etish', ru: 'Продолжить' } : !taxmin ? { uz: 'Avval belgilang', ru: 'Сначала отметьте' } : !otildi ? { uz: "Demo o'tishini boshlang", ru: 'Запустите проход демо' } : { uz: `Savollarni ajrating (${s}/3)`, ru: `Разберите вопросы (${s}/3)` };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · uch savol', ru: 'Понятие · три вопроса' })} screen={screen} scrollSignal={s * 10 + Math.max(0, oq)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={tr(label)} onClick={onNext} /></>}>
      <div className="dt-teskari">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>Demo o'tishi <A>qaysi savollarga javob bermaydi?</A></>, ru: <>На какие вопросы <A>проход демо не отвечает?</A></> })}
          mentor={<Mentor>{tr({ uz: "Demo o'tishini ishga tushiring, keyin har savol uchun tanlang: o'tishda ko'rindimi?", ru: 'Запустите проход демо, затем для каждого вопроса выберите: видно ли это при проходе?' })}</Mentor>}
          bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Uch savoldan nechtasiga demo o'tishi javob beradi?", ru: 'На сколько из трёх вопросов отвечает проход демо?' })} variantlar={S2_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
          harakat={!done && <div className="dt-harakat">
            {!otildi && <QTugma className={cxx(taxmin && oq < 0 && 'dt-halqa')} disabled={!taxmin || oq >= 0} onClick={boshla}>{oq >= 0 ? tr({ uz: "Demo o'tmoqda…", ru: 'Демо идёт…' }) : tr({ uz: "▶ Demo o'tishini boshlash", ru: '▶ Запустить проход демо' })}</QTugma>}
            {otildi && <>
              {s > 0 && <div className="dt-sk-ro">{UCH_SAVOL.slice(0, s).map((v, i) => <span key={i} className="dt-sk-ix"><i>✓</i>{tr(v.matn)} <b>{v.otishda ? tr({ uz: "ko'rindi", ru: 'видно' }) : tr({ uz: "ko'rinmadi", ru: 'не видно' })}</b></span>)}</div>}
              <div key={s} ref={kartaRef} className={cxx('dt-sk', xato != null && 'err', silk && 'silk', uchmoqda && 'uch')}>
                <span className="q-yorliq">{tr({ uz: 'Savol', ru: 'Вопрос' })} {s + 1}{NB}/{NB}3</span>
                <b className="dt-sk-m">{tr(UCH_SAVOL[s].matn)}</b>
                <span className="dt-sk-tug">
                  <button type="button" className="dt-v" onClick={() => javob(true)}>{tr({ uz: "O'tishda ko'rindi", ru: 'Видно при проходе' })}</button>
                  <button type="button" className="dt-v" onClick={() => javob(false)}>{tr({ uz: "O'tishda ko'rinmadi", ru: 'Не видно при проходе' })}</button>
                </span>
                {xato != null && <QXato key={'x' + xato}>{tr(S2_XATO[xato])}</QXato>}
              </div>
            </>}
            {ipucha && IPUCHA(tr({ uz: 'Sahnadagi besh qadamdan biri shu savolga javob beradimi?', ru: 'Отвечает ли на этот вопрос один из пяти шагов на сцене?' }))}
          </div>}
          vizual={sahna}
          xulosa={done && !tugadi && xulosaEl}
        />
        <Ustoz satrlar={[
          { uz: "Uch savol — bu darsdagi ko'rish usuli (dasturda: investor demoda nimaga qaraydi); hakamlar boshqa savollar ham berishi mumkin. 2-savolga o'tishning o'zi javob bermaydi — tinglovchi kerak: sherik bo'lsa Amaliyot 2 da undan so'rang; uyga vazifa ② da, xohlasa, tanish odamdan.", ru: 'Три вопроса — способ смотреть в этом уроке (в программе: на что смотрит инвестор в демо); судьи могут задать и другие. На 2-й вопрос сам проход не отвечает — нужен слушатель: если есть напарник, спросите его в Практике 2; в домашнем задании ② — по желанию у знакомого.' },
          { uz: "Demo o'tishi — oddiy sharoitda: internet bor, ma'lumot bor, tugma bir marta bosildi. Uch kulrang yorliq — 4-ekrandagi uch riskning teskarisi.", ru: 'Проход демо — в обычных условиях: интернет есть, данные есть, кнопку нажали один раз. Три серые метки — противоположность трёх рисков на 4-м экране.' }
        ]} />
      </div>
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1, B; ikkinchi misol — kitob almashish ilovasi, P-002) =====
const KitobTel = () => (
  <div className="dt-tel kichik"><div className="dt-tel-ekran">
    <span className="dt-kt-hisob">{tr({ uz: 'yangi hisob', ru: 'новый аккаунт' })}</span>
    <b className="dt-kt-h">{tr({ uz: 'Mening kitoblarim', ru: 'Мои книги' })}</b>
    <span className="dt-kt-bosh" />
    <span className="dt-kt-y">{tr({ uz: "ekranni ko'ring", ru: 'посмотрите на экран' })}</span>
  </div></div>
);
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: '1-savol', ru: 'Вопрос 1' })}
    questionText="Kitob almashish ilovangiz demosida «Mening kitoblarim» bo'sh bo'lsa-chi? Qanday bilasiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob almashish ilovangiz demosida «Mening kitoblarim» bo'sh bo'lsa-chi? <A>Qanday bilasiz?</A></h2>, ru: <h2 className="title h-ask">А если в демо вашего приложения для обмена книгами «Мои книги» пусты? <A>Как вы это узнаете?</A></h2> })}
    options={[
      { uz: 'Demoni yana bir marta xuddi shunday o\'taman', ru: 'Ещё раз пройду демо точно так же' },
      { uz: 'Kitobi yo\'q yangi hisob bilan ochib ko\'raman', ru: 'Открою через новый аккаунт без книг' },
      { uz: 'Agentdan «ro\'yxat to\'g\'rimi?» deb so\'rab olaman', ru: 'Спрошу у агента: «список правильный?»' },
      { uz: 'Ro\'yxatga oldindan bir nechta kitob qo\'shaman', ru: 'Заранее добавлю в список несколько книг' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Bo'sh holatni ataylab yaratib, ekranni o'zingiz ko'rasiz.", ru: 'Нарочно создаёте пустое состояние и сами смотрите на экран.' }}
    explainWrong={{
      0: { uz: "O'tishda ro'yxat to'la edi — bo'sh holat ko'rinadimi?", ru: 'При проходе список был полон — видно ли пустое состояние?' },
      2: { uz: 'Agent javobi — da\'vo. Ekranda nima chiqishini kim ko\'radi?', ru: 'Ответ агента — заявление. Кто увидит, что на экране?' },
      3: { uz: "Kitob qo'shsangiz, bo'sh ro'yxat qachon ko'rinadi?", ru: 'Если добавите книги, когда будет виден пустой список?' },
      default: { uz: "Bo'sh ro'yxatni ko'rish uchun nima qilish kerak?", ru: 'Что нужно сделать, чтобы увидеть пустой список?' }
    }}
    vizual={<KitobTel />} />
);

// ===== SCREEN 4 — UCH RISK (QTushuncha; 3 karta ketma-ket, har birida 3 variant; to'g'ri → «Nima kutdim» qatoriga uchadi; ballsiz, nishon clearExpectation) =====
const S4_XATO = {
  mavhum: { uz: 'Buni ekranda qaysi son yoki yozuv ko\'rsatadi?', ru: 'Какое число или надпись покажет это на экране?' },
  oldini: { uz: "Bu — riskning oldini olish. Buzilsa, demo nima ko'rsatadi?", ru: 'Это — предотвращение риска. А что покажет демо, если сломается?' }
};
const riskSahna = (i, kut) => (i === 0
  ? { tel: { son: kut ? 9 : 8, ulanish: kut ? 'ulangan' : 'ulanmoqda', samolyot: !kut, kutish: kut }, lap: { son: 9, bosildi: true } }
  : i === 1
    ? { tel: { son: 8, ulanish: 'ulangan' }, lap: { oyin: 'juma', son: kut ? 0 : null, kutish: kut } }
    : { tel: { son: kut ? 9 : 8, ulanish: 'ulangan' }, lap: { son: kut ? 9 : 8, bosildi: kut, ikki: !kut, kutish: kut } });
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const avval = !!storedAnswer;
  const [k, setK] = useState(avval ? 2 : 0); // joriy karta
  const [hal, setHal] = useState(avval ? 3 : 0); // yechilgan kartalar soni
  const [xato, setXato] = useState(null); // { vi, tur }
  const [yon, setYon] = useState(-1);
  const wrongRef = useRef(false);
  const vRef = useRef([]); const kutRef = useRef([]);
  const [uchEl, uchir, uchmoqda] = useUch();
  const done = hal >= 3;
  const tugadi = useTugadi(done, 1300, avval);
  const ipucha = useIpucha(!done, k);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', screenIdx: screen, correct: !wrongRef.current, picked: true }); }, [done]); // eslint-disable-line
  const tanla = (vi) => {
    if (done || uchmoqda || hal > k) return;
    const v = KUTISH_KARTALAR[k].variantlar[vi];
    if (v.tur !== 'togri') { wrongRef.current = true; if (achMiss) achMiss.miss(screen); setXato({ vi, tur: v.tur, n: Date.now() }); return; }
    setXato(null);
    const i = k;
    uchir(vRef.current[vi], kutRef.current[i], <span>{tr(v.t)}</span>, () => {
      setHal(i + 1); setYon(i); setTimeout(() => setYon(-1), 1100);
      if (i < 2) setTimeout(() => setK(i + 1), kamHarakat() ? 300 : 1300);
    });
  };
  const ri = Math.min(k, 2);
  const kut = hal > ri;
  const rs = riskSahna(ri, kut);
  const yozuv = <YozuvKarta yorliq={tr({ uz: 'Mentorning kutishi — natija emas', ru: 'Ожидание Ментора — не результат' })} qatorlar={['kutdim']} belgi={false} kutRef={kutRef} yon={yon} className="kutish"
    urinishlar={MENTOR_YOZUV.map((m, i) => ({ nom: tr(USULLAR[i].nom), kutdim: i < hal ? tr(m.kutdim) : null }))} />;
  const sahna = tugadi
    ? <DemoSahna keng tel={{ son: 9, ulanish: 'ulangan' }} lap={{ son: 9, bosildi: true }} yozuv={yozuv} />
    : <div className="dt-r-ong"><DemoSahna tel={rs.tel} lap={rs.lap} />{yozuv}</div>;
  const karta = KUTISH_KARTALAR[ri];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · uch risk', ru: 'Понятие · три риска' })} screen={screen} scrollSignal={hal * 10 + k} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Kutishlarni tanlang (${hal}/3)`, ru: `Выберите ожидания (${hal}/3)` })} onClick={onNext} /></>}>
      <div className="dt-risk">
        <QTushuncha zoom={Zoomable} tugadi={tugadi}
          sarlavha={tr({ uz: <>Buzilsa, demo <A>nima ko'rsatishi kerak?</A></>, ru: <>Что демо <A>должно показать,</A> если сломается?</> })}
          mentor={<Mentor>{tr({ uz: 'Har karta uchun Mentorning kutishini tanlang: ekranda aniq nima ko\'rinadi?', ru: 'Для каждой карточки выберите ожидание Ментора: что именно видно на экране?' })}</Mentor>}
          harakat={!done && <div className="dt-harakat">
            <div key={ri} className={cxx('dt-rk', hal > ri && 'hal')}>
              <span className="q-yorliq">{tr({ uz: 'Risk', ru: 'Риск' })} {ri + 1}{NB}/{NB}3</span>
              <b className="dt-rk-h">{tr(USULLAR[ri].hodisa)}</b>
              <span className="dt-rk-nom">{tr(USULLAR[ri].yorliq)}</span>
              <div className={cxx('dt-rk-v', hal <= ri && 'kutish')}>
                {karta.variantlar.map((v, vi) => (
                  <button key={vi} type="button" ref={(el) => { vRef.current[vi] = el; }} disabled={hal > ri}
                    className={cxx('dt-v', 'dt-v-k', xato && xato.vi === vi && 'err silk', hal > ri && v.tur === 'togri' && 'ok')} onClick={() => tanla(vi)}>{tr(v.t)}</button>
                ))}
              </div>
              {xato && <QXato key={xato.n}>{tr(S4_XATO[xato.tur])}</QXato>}
            </div>
            {ipucha && IPUCHA(tr({ uz: 'Shu kutishni ekranga qarab tekshirsa bo\'ladimi?', ru: 'Можно ли проверить это ожидание, глядя на экран?' }))}
          </div>}
          vizual={sahna}
          xulosa={done && <XulosaQ matn={tr({ uz: "Bu misolda kutish ekrandagi narsani aytadi: belgi, son yoki tugma. U buzishdan oldin yoziladi.", ru: 'В этом примере ожидание называет то, что на экране: метку, число или кнопку. Его пишут до поломки.' })}
            izoh={tr({ uz: "«Yaxshi ishlaydi» deb yozilsa, keyin natija bilan solishtirib bo'lmaydi.", ru: 'Если написать «хорошо работает», потом не с чем сравнить результат.' })} />}
        />
        <Ustoz satrlar={[
          { uz: "Uch risk — dasturdagi demo-risklar ro'yxati. 6-darsdagi risklar ro'yxatida — risk bo'lmasligi uchun nima qilinadi; bugun — buzilganda demo nima ko'rsatishi kerak (kutish). Ikkalasi kerak, lekin bir narsa emas.", ru: 'Три риска — список демо-рисков из программы. В списке рисков 6-го урока — что сделать, чтобы риска не было; сегодня — что демо должно показать при поломке (ожидание). Нужно и то и другое, но это не одно и то же.' },
          { uz: "Mentor misolining natijasi — Amaliyot 1 dan keyin; kutish — natija emas. Buzish — faqat o'z mahsulotida: boshqa odamning ilovasi yoki sayti buzib ko'rilmaydi.", ru: 'Результат примера Ментора — после Практики 1; ожидание — не результат. Ломать — только свой продукт: чужое приложение или сайт не ломают.' }
        ]} />
      </div>
      {uchEl}
    </Stage>
  );
};

// ===== SCREEN 5 — KUTISHLARINGIZ (QMustaqil, USTAXONA — bittadan karta, 3 qism; yozadi pm-m12d7-tekshiruv.urinishlar; signal PRACTICE_BASE + 5) =====
const S5_YORDAM = [
  { uz: "Mentor misolida: (1) Belgi «Ulangan» bo'lgach, telefonda «9 / 10» ko'rinadi · (2) O'yin nomi, «0 / 10» va «Qo'shilaman» ko'rinadi · (3) Bitta qo'shilish: son bir marta o'zgaradi, «9 / 10».", ru: 'В примере Ментора: (1) Когда метка станет «Подключено», на телефоне видно «9 / 10» · (2) Видны название игры, «0 / 10» и «Присоединяюсь» · (3) Одно присоединение: число меняется один раз, «9 / 10».' },
  { uz: "Mahsulotingizda ulanish belgisi bo'lmasa — internet qaytgach sahifani yangilaysiz: kutish — yangi holat ko'rinadi. «Bo'sh» — demo yo'lingizdagi hali hech narsa yozilmagan joy: yangi ro'yxat, bo'sh profil, odamsiz o'yin. Kutishga bo'sh holatning ko'rinadigan mazmunini yozing — sarlavha, son yoki tugma; «ekran oq emas» yetmaydi.", ru: 'Если в продукте нет метки подключения — после возврата интернета обновите страницу: ожидание — видно новое состояние. «Пусто» — место на пути демо, где ещё ничего не записано: новый список, пустой профиль, игра без людей. В ожидание запишите видимое содержимое пустого состояния — заголовок, число или кнопку; «экран не белый» — мало.' }
];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const demo = useMemo(() => demoOl(), []);
  const [tek] = useState(() => tekOl());
  const [qora, setQora] = useState(() => tek.urinishlar.map((u, i) => ({ qildim: u.qildim || tr(USULLAR[i].qilaman), kutdim: u.kutdim })));
  const [saq, setSaq] = useState(() => tek.urinishlar.map(u => !!u.kutdim.trim()));
  const [joriy, setJoriy] = useState(() => { const i = tek.urinishlar.findIndex(u => !u.kutdim.trim()); return i; });
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [uchish, setUchish] = useState(false);
  const n = saq.filter(Boolean).length;
  const toliq = n === 3;
  const yoz = (i, maydon, v) => { setQora(q => q.map((x, j) => (j === i ? { ...x, [maydon]: v } : x))); setXato(null); };
  const och = (i) => { if (uchish) return; setJoriy(i); setXato(null); setYumshoq(null); setYordam(false); };
  const saqla = () => {
    if (joriy < 0 || uchish) return;
    const i = joriy; const { qildim, kutdim } = qora[i];
    const t = kutishTekshir(qildim, kutdim);
    if (t && (t.blok || !(yumshoq && yumshoq.i === i && yumshoq.matn === kutdim))) { setXato(t); if (!t.blok) setYumshoq({ i, matn: kutdim }); return; }
    const yangiSaq = saq.map((x, j) => (j === i ? true : x));
    const hammasi = yangiSaq.every(Boolean);
    if (hammasi && !isMentor) {
      const eski = tekOl();
      const urinishlar = eski.urinishlar.map((u, j) => ({ ...u, qildim: String(qora[j].qildim || '').trim(), kutdim: String(qora[j].kutdim || '').trim() }));
      tekYoz(urinishlar, eski.otishlar);
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'kutishlar', solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    setXato(null); setYumshoq(null); setYordam(false); setUchish(true);
    const keyingi = [0, 1, 2].find(j => !yangiSaq[j] && j > i) ?? [0, 1, 2].find(j => !yangiSaq[j]) ?? -1;
    setTimeout(() => { setSaq(yangiSaq); setJoriy(keyingi); setUchish(false); }, kamHarakat() ? 0 : 380);
  };
  const qoldi = saq.filter(x => !x).length;
  const tugmaNom = (joriy >= 0 && qoldi === 1 && !saq[joriy]) || (joriy >= 0 && saq[joriy]) ? tr({ uz: 'Saqlash', ru: 'Сохранить' }) : tr({ uz: 'Keyingi risk', ru: 'Следующий риск' });
  const strip = <div className="dt-strip">
    {USULLAR.map((u, i) => <QChip key={u.id} holat={joriy === i ? 'on' : saq[i] ? 'ok' : undefined} className="dt-tab" onClick={() => och(i)}><i>{saq[i] ? '✓' : i + 1}</i>{tr(u.nom)}</QChip>)}
  </div>;
  const ixcham = (toliq && joriy < 0)
    ? <div className="dt-ix-bir"><span className="dt-ix-butun"><i>✓</i>{tr({ uz: 'Kutishlar', ru: 'Ожидания' })} · 3 ✓</span>{USULLAR.map((u, i) => <button key={u.id} type="button" className="dt-md-t dt-tab" aria-label={tr(u.nom)} title={tr(u.nom)} onClick={() => och(i)}>✎ {i + 1}</button>)}</div>
    : saq.some(Boolean) && <div className="dt-ix-ro">{USULLAR.map((u, i) => (saq[i] && i !== joriy) && <button key={u.id} type="button" className="dt-ix-q dt-tab" onClick={() => och(i)}><i>✓</i>{tr(u.nom)} · <span>{qora[i].kutdim}</span> <em>✎</em></button>)}</div>;
  const kutUz = joriy >= 0 ? String(qora[joriy].kutdim || '').trim().length : 0;
  const karta = joriy >= 0 && (
    <div key={joriy} className={cxx('dt-karta', xato && xato.blok && 'err', uchish && 'uch')}>
      <span className="q-yorliq">{joriy + 1} · {tr(USULLAR[joriy].nom)}</span>
      <label className="dt-maydon"><i className="dt-maydon-n">1 · {tr({ uz: 'Nima qilaman', ru: 'Что сделаю' })}</i>
        <textarea className="dt-inp" rows={2} maxLength={300} value={qora[joriy].qildim} onChange={(e) => yoz(joriy, 'qildim', e.target.value)} /></label>
      <label className={cxx('dt-maydon', !kutUz && 'chorla')}><i className="dt-maydon-n">2 · {tr({ uz: 'Nima kutaman', ru: 'Чего жду' })}</i>
        <textarea className={cxx('dt-inp', xato && 'err')} rows={2} maxLength={240} value={qora[joriy].kutdim} placeholder={tr({ uz: "Ekranda aniq nima ko'rinadi?", ru: 'Что именно видно на экране?' })} onChange={(e) => yoz(joriy, 'kutdim', e.target.value)} /></label>
      {xato && <QXato key={xato.x}>{tr(S5_XATO[xato.x])}</QXato>}
      {xato && !xato.blok && <p className="dt-yana">{tr({ uz: 'Shunday qoldirsangiz — yana bosing.', ru: 'Если оставите так — нажмите ещё раз.' })}</p>}
      {yordam && <div className="dt-yordam fade-step">{S5_YORDAM.map((y, i) => <p key={i}>{tr(y)}</p>)}</div>}
      <div className="dt-karta-tug">
        <QTugma className={cxx(kutUz > 0 && 'dt-halqa')} onClick={saqla}>{tugmaNom}</QTugma>
        <QTugma ikkinchi className="dt-o" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      </div>
    </div>
  );
  const ozYozuv = <YozuvKarta yorliq={tr({ uz: 'Buzish yozuvingiz', ru: 'Ваша запись поломки' })} qatorlar={['qildim', 'kutdim']} belgi={false}
    urinishlar={USULLAR.map((u, i) => ({ nom: tr(u.nom), qildim: saq[i] ? qora[i].qildim : null, kutdim: saq[i] ? qora[i].kutdim : null }))} className="kutish" />;
  const forma = isMentor
    ? <div className="dt-fokus"><Zoomable><YozuvKarta yorliq={<>{tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' })} · <MJ /></>} qatorlar={['qildim', 'kutdim']} belgi={false} className="kutish" urinishlar={mentorYozuvQ(['qildim', 'kutdim'])} /></Zoomable>
      <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Kutishlar saqlandi', ru: 'Ожидания сохранены' }} /></div>
    : <div className={cxx('dt-m5', toliq && joriy < 0 && 'tayyor')}>
      <div className="dt-m5-chap">{ixcham}{karta}</div>
      <Zoomable>{ozYozuv}</Zoomable>
    </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={n * 10 + joriy} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={toliq && joriy < 0} disabled={!toliq && !isMentor} label={toliq || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Kutishlarni yozing (${n}/3)`, ru: `Запишите ожидания (${n}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Demongizda har riskdan <A>nima kutasiz?</A></>, ru: <>Чего вы ждёте <A>от каждого риска</A> в своём демо?</> })}
        mentor={<Mentor>{tr({ uz: "«Nima qilaman» tayyor — demo yo'lingizga moslang, «Nima kutaman»ni o'zingiz yozing.", ru: '«Что сделаю» уже готово — подгоните под свой путь демо, «Чего жду» напишите сами.' })}</Mentor>}
        qadamlar={!isMentor && <div className="dt-m5-bosh">{!(toliq && joriy < 0) && strip}{demo.ssenariy && <p className="dt-kul-p">{tr({ uz: 'Demo ssenariyingiz:', ru: 'Ваш сценарий демо:' })} {demo.ssenariy.slice(0, 5).join(' · ')}</p>}</div>}
        forma={forma}
      >
        {toliq && joriy < 0 && !isMentor && <QXulosa>{tr({ uz: "Kutishlar yozildi — buzgach, nima bo'lganini shu kartalar yoniga yozasiz.", ru: 'Ожидания записаны — после поломки запишете рядом с ними, что произошло.' })}</QXulosa>}
        <Ustoz satrlar={[{ uz: "7 daqiqa. Eng ko'p xato — kutishga «ishlaydi» yozish: «Ekranda qaysi son yoki yozuv?» deb so'rang. Ikki marta bosishda — demo yo'lidagi asosiy tugma (Mentor misolida «Qo'shilaman»). Kutish buzishdan oldin yoziladi — natijani ko'rgach moslab qo'yilmaydi.", ru: '7 минут. Самая частая ошибка — писать в ожидании «работает»: спросите «Какое число или надпись на экране?». Для двойного нажатия — главная кнопка на пути демо (в примере Ментора «Присоединяюсь»). Ожидание пишут до поломки — не подгоняют после результата.' }]} />
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 8 — YAKUNIY SAVOL (QuestionScreen; INLINE_KEYS.s8 = 2, C; ikki blok birga — tuzatish va demo o'tishi) =====
const QaytaQator = () => (
  <div className="dt-yozuv dt-qq">
    <div className="dt-yz-u">
      <b className="dt-yz-nom">3 · {tr(USULLAR[2].nom)}</b>
      <span className="dt-yz-q kutdim"><em>{tr(YOZUV_Q.kutdim)}</em><span className="dt-yz-m">{tr(MENTOR_YOZUV[2].kutdim)}</span></span>
      <span className="dt-qq-joy">{tr({ uz: 'qayta tekshiruv', ru: 'повторная проверка' })}</span>
    </div>
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Итоговый вопрос' })}
    questionText="Tuzatishdan keyin demo xatosiz o'tdi. Ikki marta bosish muammosi takrorlanmaydimi?"
    question={tr({ uz: <h2 className="title h-ask">Tuzatishdan keyin demo xatosiz o'tdi. <A>Ikki marta bosish muammosi takrorlanmaydimi?</A></h2>, ru: <h2 className="title h-ask">После исправления демо прошло без ошибок. <A>Проблема двойного нажатия не повторится?</A></h2> })}
    options={[
      { uz: "Takrorlanmaydi — demo boshidan oxirigacha o'tdi", ru: 'Не повторится — демо прошло от начала до конца' },
      { uz: 'Takrorlanmaydi — agent qaysi faylni aytib berdi', ru: 'Не повторится — агент назвал, какой файл' },
      { uz: 'Bilmayman — tugmani yana ikki marta bosaman', ru: 'Не знаю — снова нажму кнопку дважды' },
      { uz: 'Muhim emas — demoda tugmani bir marta bosaman', ru: 'Не важно — в демо нажму кнопку один раз' }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Qayta tekshiruv o\'sha usul bilan: yana ikki marta bosiladi.', ru: 'Повторная проверка — тем же способом: снова нажимают дважды.' }}
    explainWrong={{
      0: { uz: "O'tishda tugma necha marta bosildi?", ru: 'Сколько раз нажали кнопку при проходе?' },
      1: { uz: 'Agentning aytgani — da\'vo. Natijani kim ko\'radi?', ru: 'Слова агента — заявление. Кто увидит результат?' },
      3: { uz: 'Zalda hayajonda kim qanday bosishini bilasizmi?', ru: 'Знаете ли вы, кто и как нажмёт от волнения в зале?' },
      default: { uz: 'Qayta tekshiruv qaysi usul bilan qilinadi?', ru: 'Каким способом делают повторную проверку?' }
    }}
    vizual={<QaytaQator />} />
);

// ===== 🏅 BADGES (nishonlar, 4 — PM: «!» bilan, 9.23) — faqat ish qilingan ekranlarda; Three Runs! — bonus (7-ekran, P-048) =====
const ACHIEVEMENTS = {
  investorEye: { icon: '🔍', name: 'Investor Eye!', desc: { uz: "O'tish javob bermagan ikki savolni topdingiz", ru: 'Вы нашли два вопроса, на которые проход не ответил' } },
  emptyCheck: { icon: '📭', name: 'Empty Check!', desc: { uz: "Bo'sh holatni qanday ko'rishni topdingiz", ru: 'Вы нашли, как увидеть пустое состояние' } },
  clearExpectation: { icon: '🎯', name: 'Clear Expectation!', desc: { uz: 'Ekranda ko\'rinadigan kutishni tanladingiz', ru: 'Вы выбрали ожидание, которое видно на экране' } },
  threeRuns: { icon: '🔁', name: 'Three Runs!', desc: { uz: "Uch demo o'tishini belgiladingiz", ru: 'Вы отметили три прохода демо' } }
};
// Ekran id → nishon: savollar (2), kutish (4) — birinchi urinishda hammasi to'g'ri (correct = xatosiz); s3 — ballik test. threeRuns — 7-ekranda earn() bilan.
const ACH_TRIGGERS = { savollar: 'investorEye', s3: 'emptyCheck', kutish: 'clearExpectation' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 8)
const Q_LABELS = {
  3: { uz: "1 — Bo'sh holatni qanday bilasiz", ru: '1 — Как узнать пустое состояние' },
  8: { uz: 'Yakuniy — qayta tekshiruv', ru: 'Итог — повторная проверка' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning lug'ati (R-008: o'quvchi so'zi {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'demo', ru: 'демо' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "o'tish", ru: 'проход' }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'risk', ru: 'риск' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'kutish', ru: 'ожидание' }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'buzish yozuvi', ru: 'запись поломки' }, l: 40, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'B reja', ru: 'План Б' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'taymer', ru: 'таймер' }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Maydon Jamoa', l: 18, t: 16, s: 20, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD arena jadvali), to'g'ri javob o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: "Demo tekshiruvida demoni kim buzadi?", ru: "Кто ломает демо при проверке демо?" }, opts: [{ uz: "O'quvchi o'zi, o'z mahsulotida", ru: "Сам ученик, на своём продукте" }, { uz: "Agent, o'quvchi so'ramasdan o'zi", ru: "Агент — сам, без просьбы ученика" }, { uz: "Sinfdosh, o'quvchining hisobidan", ru: "Одноклассник, с аккаунта ученика" }, { uz: "Hakam, chiqish kunining o'zida", ru: "Судья, в сам день выступления" }], correct: 0 },
  { q: { uz: "Demo besh qadamda xatosiz o'tdi. Bu nimani ko'rsatadi?", ru: "Демо прошло пять шагов без ошибок. Что это показывает?" }, opts: [{ uz: "Demo har sharoitda ishlashini", ru: "Что демо работает в любых условиях" }, { uz: "Oddiy sharoitda demo ishlashini", ru: "Что демо работает в обычных условиях" }, { uz: "Agentning tuzatishi to'g'riligini", ru: "Что исправление агента верное" }, { uz: "Hakam pitchingizni yoqtirishini", ru: "Что судье понравится ваш питч" }], correct: 1 },
  { q: { uz: "Ikki marta bosishni demoning qaysi joyida tekshirasiz?", ru: "Где в демо проверяете двойное нажатие?" }, opts: [{ uz: "Kirish sahifasining sarlavhasida", ru: "В заголовке страницы входа" }, { uz: "B reja videosi ochiladigan joyda", ru: "Там, где открывается видео Плана Б" }, { uz: "Demo yo'lidagi asosiy tugmada", ru: "На главной кнопке пути демо" }, { uz: "Darsdagi taymerning tugmasida", ru: "На кнопке таймера в уроке" }], correct: 2 },
  { q: { uz: "«Belgi «Ulangan» bo'lgach, telefonda «9 / 10» ko'rinadi» — bu qaysi qator?", ru: "«Когда метка станет «Подключено», на телефоне видно «9 / 10»» — что это за строка?" }, opts: [{ uz: "Buzishdan keyin ko'rilgan natija", ru: "Результат, увиденный после поломки" }, { uz: "Riskning oldini olish uchun ish", ru: "Работа по предотвращению риска" }, { uz: "Demo ssenariysining bir qadami", ru: "Один шаг сценария демо" }, { uz: "Buzishdan oldin yozilgan kutish", ru: "Ожидание, записанное до поломки" }], correct: 3 },
  { q: { uz: "Bo'sh ma'lumotni qaysi hisobda yuzaga keltirasiz?", ru: "В каком аккаунте создаёте пустые данные?" }, opts: [{ uz: "Agent ochgan tekshiruv akkauntida", ru: "В проверочном аккаунте, открытом агентом" }, { uz: "Eng faol foydalanuvchining hisobida", ru: "В аккаунте самого активного пользователя" }, { uz: "Sinfdoshingizning shaxsiy hisobida", ru: "В личном аккаунте одноклассника" }, { uz: "Demo yo'lidagi o'z hisobingizda", ru: "В своём аккаунте на пути демо" }], correct: 0 },
  { q: { uz: "Qaysi kutishni ekranga qarab tekshirsa bo'ladi?", ru: "Какое ожидание можно проверить, глядя на экран?" }, opts: [{ uz: "Demo hakamga juda yaxshi ko'rinadi", ru: "Демо очень хорошо смотрится для судьи" }, { uz: "O'yinda «0 / 10» va tugma ko'rinadi", ru: "В игре видны «0 / 10» и кнопка" }, { uz: "Zal internetini oldindan tekshiraman", ru: "Заранее проверю интернет в зале" }, { uz: "Agent hammasini o'zi tuzatib qo'yadi", ru: "Агент сам всё исправит" }], correct: 1 },
  { q: { uz: "Agent faylni o'zgartirdi, u `git status` da ko'rindi. Nima belgilaysiz?", ru: "Агент изменил файл, он виден в `git status`. Что отметите?" }, opts: [{ uz: "Takrorlanmadi — demo endi ishlaydi", ru: "Не повторилось — демо теперь работает" }, { uz: "Buzilmadi — topilma yo'q bo'ldi", ru: "Не сломалось — находка исчезла" }, { uz: "Tuzatish qilindi — kod o'zgardi", ru: "Исправление сделано — код изменён" }, { uz: "Demo tayyor — o'tish shart emas", ru: "Демо готово — проход не нужен" }], correct: 2 },
  { q: { uz: "Qayta tekshiruvda muammo yana chiqdi. Nima qilasiz?", ru: "При повторной проверке проблема снова появилась. Что сделаете?" }, opts: [{ uz: "Yozuvni o'chirib, demoni davom ettiraman", ru: "Удалю запись и продолжу демо" }, { uz: "Demo kuni bu qadamni hakamga ko'rsatmayman", ru: "В день демо не покажу судье этот шаг" }, { uz: "Agentdan bitta yangi funksiya so'rab olaman", ru: "Попрошу у агента одну новую функцию" }, { uz: "«Yana buzildi» deb yozib, agentga beraman", ru: "Запишу «Снова сломалось» и отдам агенту" }], correct: 3 },
  { q: { uz: "Uch demo o'tishining birida nima mashq qilinadi?", ru: "Что тренируют в одном из трёх проходов демо?" }, opts: [{ uz: "B rejaga o'tish: videoni ochish", ru: "Переход на План Б: открыть видео" }, { uz: "Yangi funksiyani hakamga ko'rsatish", ru: "Показать судье новую функцию" }, { uz: "Hakamning savollariga javob berish", ru: "Отвечать на вопросы судьи" }, { uz: "Backend'ni Render'da qayta yozish", ru: "Переписать Backend на Render" }], correct: 0 },
  { q: { uz: "Demo o'tishida B reja videosi qayerda ochiladi?", ru: "Где во время прохода демо открывают видео Плана Б?" }, opts: [{ uz: "Hakamning telefonida, havola orqali", ru: "На телефоне судьи, по ссылке" }, { uz: "Demo ochiq turgan laptopning o'zida", ru: "На том же ноутбуке, где открыто демо" }, { uz: "Sinf chatiga yuborilgan fayl sifatida", ru: "Файлом, отправленным в чат класса" }, { uz: "Ikkinchi telefondagi brauzer oynasida", ru: "В браузере на втором телефоне" }], correct: 1 },
  { q: { uz: "Demo tekshiruvidan keyin tekshiruv akkaunti nima bo'ladi?", ru: "Что делают с проверочным аккаунтом после проверки демо?" }, opts: [{ uz: "Hakamlar uchun saqlab qo'yiladi", ru: "Сохраняют для судей" }, { uz: "Haqiqiy hisob sifatida qoladi", ru: "Оставляют как настоящий аккаунт" }, { uz: "id lari bo'yicha o'chiriladi", ru: "Удаляют по их id" }, { uz: "Sinfdoshlardan biriga beriladi", ru: "Отдают одному из одноклассников" }], correct: 2 },
  { q: { uz: "`XATOLAR.md` ga demo tekshiruvidan nima yoziladi?", ru: "Что из проверки демо записывают в `XATOLAR.md`?" }, opts: [{ uz: "Faqat agent aytgan tuzatishlar", ru: "Только исправления, названные агентом" }, { uz: "Hech narsa — demo xatosiz o'tdi", ru: "Ничего — демо прошло без ошибок" }, { uz: "Faqat buzilgan va tuzatilganlar", ru: "Только сломанное и исправленное" }, { uz: "Har usul, natijasi va holati", ru: "Каждый способ, его результат и состояние" }], correct: 3 },
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
// Mentor ko'rinishi — "kim bajardi" jonli chiplar paneli (sig — signal raqami, yorliq — panel nomi). O'quvchi yozuvi Mentorga chiqmaydi — faqat signal (KOD 10).
const MentorPracticeStats = ({ live, screen, sig, yorliq }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  const s = sig ?? (PRACTICE_BASE + screen);
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, s)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, s]);
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

// ===== AMALIYOT BLOKLARI (6, 7) — ScreenBlok + QBlok + prompt; hammasi o'quvchining o'z mahsulotida va repo'sida (Mentor misoli — namuna) =====
// Qadam matni QBlok ichida <p> ga tushadi — ichki elementlar faqat span/button/textarea/input (display: block — CSS da).
// «Davom etish» — ulgurQadam dan keyin (MD: 2-qadam); blok bajarilgani — faqat 4-qadam «Bajardim»idan (E 55). Qavs — DtPrompt o'z o'rovchisi (src/qolip ga tegilmaydi).
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const BLOK_TUGADI = { uz: 'Blok tugadi — «Davom etish»ni bosing.', ru: 'Блок завершён — нажмите «Продолжить».' };
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, ortda, doneText, ulgur, ulgurQadam = 99, ulgurShart, qulf, ustoz, onTugadi, strip }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const ochiq = done || (stepN >= ulgurQadam && (!ulgurShart || ulgurShart()));
  const qulfli = !done && !!qulf && qulf(stepN);
  const bajardim = () => {
    if (isMentorLive || done || qulfli) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length) {
      if (onTugadi) onTugadi();
      if (!avval) {
        onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true });
        if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
      }
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam (P 9, 589), blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${steps[stepN].h.uz}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${steps[stepN].h.ru}»: выполните и нажмите «Готово».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext halqa={done} disabled={!ochiq} label={ochiq ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className={cxx('dt-blok', qulfli && 'qulf', done && 'tugadi')}>
        {strip}
        <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
          qadamlar={steps.map(c => ({ h: tr(c.h), t: c.t }))}
          joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
          tugadi={done} tugadiMatn={doneText ? tx(doneText) : null} natija={typeof natija === 'function' ? natija(done) : natija} natijaYorliq={tr(NATIJA_YORLIQ)}
          pastki={<MentorPracticeStats live={_live} screen={screen} />}>
          {ortda && !done && <p className="dt-ortda">{tx(ortda)}</p>}
          {ulgur && !done && <p className="dt-ulgur">{tx(ulgur)}</p>}
          {ustoz && isMentorLive && <div className="dt-ustoz"><b>{tr({ uz: "O'qituvchi eslatmasi", ru: 'Заметка для учителя' })}</b>{ustoz.map((s, i) => <span key={i}>{tx(s)}</span>)}</div>}
        </QBlok>
      </div>
    </Stage>
  );
}
// Prompt qutisi: {…} joylari — kulrang namuna bilan; avto — o'quvchi ma'lumotidan oldindan; kod (`…`) ichidagi qavs joy emas
const DtPrompt = ({ satrlar, avto = {}, joylar = [], qiymat = {}, onYoz }) => {
  const [ok, setOk] = useState(false);
  const subst = (s) => {
    let a = s;
    Object.entries(avto).forEach(([k, v]) => { if (v != null && v !== '') a = a.split(k).join(v); });
    joylar.forEach(j => { const v = String(qiymat[j.id] || '').trim(); if (v) a = a.split(j.joy).join(v); });
    return a;
  };
  const matn = satrlar.map(l => subst(typeof l === 'string' ? l : tr(l)));
  const kor = (t, li) => t.split('`').flatMap((p, i) => (i % 2
    ? [<code key={li + 'c' + i} className="qcode">{p}</code>]
    : p.split(/(\{[^}\s][^}]*\})/g).map((x, j) => (/^\{[^\s].*\}$/.test(x) ? <span key={li + '-' + i + '-' + j} className="q-joy">{x}</span> : <React.Fragment key={li + '-' + i + '-' + j}>{x}</React.Fragment>))));
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt dt-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button type="button" className="q-prompt-nusxa dt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></span>
      {matn.map((l, i) => <span key={i} className="dt-ps">{kor(l, i)}</span>)}
      {joylar.length > 0 && <span className="dt-joylar">{joylar.map(j => (
        <label key={j.id} className="dt-joy-m"><span className="dt-joy-n">{j.joy}</span>
          <input type="text" value={qiymat[j.id] || ''} maxLength={240} placeholder={tr(j.namuna)} onChange={e => onYoz(j.id, e.target.value)} /></label>))}</span>}
    </span>
  );
};
const Yordam = ({ satrlar, sarlavha }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <span className="dt-yordam-ust">
      <QTugma ikkinchi className="dt-yordam-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>
      {ochiq && <span className="dt-yordam-o fade-step">{sarlavha && <b>{tr(sarlavha)}</b>}{satrlar.map((l, i) => <span key={i} className="dt-yordam-s">{tx(l)}</span>)}</span>}
    </span>
  );
};
// Artefakt-strip (U-042): «Demo tekshiruvi · 3 usul» — 6, 7-ekranlarda (test, arena, podium va yakunda yo'q — E 50)
const ArtStrip = ({ urinishlar }) => (
  <div className="dt-art"><b>{tr({ uz: 'Demo tekshiruvi', ru: 'Проверка демо' })} · {tr({ uz: '3 usul', ru: '3 способа' })}</b>
    {USULLAR.map((u, i) => <span key={u.id} className={cxx('dt-art-u', urinishlar[i].buzildi === true && 'buz', urinishlar[i].buzildi === false && 'ok')}>{tr(u.nom)}</span>)}</div>
);
const BELGI = {
  buzildi: { uz: 'Buzildi', ru: 'Сломалось' }, buzilmadi: { uz: 'Buzilmadi', ru: 'Не сломалось' }, tuz: { uz: 'Tuzatish qilindi', ru: 'Исправление сделано' },
  takrorlanmadi: { uz: 'Qayta tekshiruvda takrorlanmadi', ru: 'При повторной проверке не повторилось' }, takrorlandi: { uz: 'Qayta tekshiruvda yana buzildi', ru: 'При повторной проверке снова сломалось' },
  xatosiz: { uz: 'Xatosiz', ru: 'Без ошибок' }, xato: { uz: 'Xato bilan', ru: 'С ошибкой' }, ochildi: { uz: 'B reja bo\'yicha tugadi', ru: 'Завершено по Плану Б' }, ochilmadi: { uz: 'B reja ochilmadi', ru: 'План Б не открылся' }
};
const sabFn = (u, i) => (u.buzildi === null ? 'tekshirilmadi-' + i : (u.buzildi === true && !(u.tuzatishQilindi && u.qayta === 'takrorlanmadi')) ? 'qoldi-' + i : null);

// --- Amaliyot 1: buzing, tuzating, qayta tekshiring ---
const A1_AKKAUNT = [
  { uz: "Qayerda: Database — faqat o'zing ochadigan tekshiruv akkaunti va uning yozuvlari. Kod va fayllarni o'zgartirma.", ru: 'Где: Database — только проверочный аккаунт, который откроешь ты, и его записи. Код и файлы не меняй.' },
  { uz: "Nima qilsin: demo tekshiruvi uchun bitta tekshiruv akkaunti och: namuna ism va login bilan, haqiqiy emas, foydalanuvchilar sanog'iga tushmaydigan. Login va parolni javobingda chiqarma — men unga kirmayman. Shu akkauntdan {bo'sh holat} tayyorla. Qaysi yozuvlarni yaratganingni `id` lari bilan ayt. «O'chir» desam — faqat shu `id` lardagi yozuvlarni o'chir.", ru: "Что сделать: открой для проверки демо один проверочный аккаунт — с образцовым именем и логином, не настоящий, не попадающий в подсчёт пользователей. Логин и пароль в ответе не показывай — я в него не захожу. Из этого аккаунта подготовь {bo'sh holat}. Скажи, какие записи создал, с их `id`. Если скажу «Удали» — удаляй только записи с этими `id`." },
  { uz: "Nima buzilmasin: kod, `.env` va haqiqiy foydalanuvchilarning hisoblari va yozuvlariga tegma. Hech narsani tuzatma — men hozir faqat tekshiryapman. Nima o'zgartirganingni ayt.", ru: 'Что не сломать: не трогай код, `.env` и аккаунты и записи настоящих пользователей. Ничего не исправляй — я сейчас только проверяю. Скажи, что изменил.' }
];
const A1_AKKAUNT_YORDAM = [
  A1_AKKAUNT[0],
  { uz: "Nima qilsin: demo tekshiruvi uchun bitta tekshiruv akkaunti och: namuna ism va login bilan, haqiqiy emas, `namuna = true`. Login va parolni javobingda chiqarma — men unga kirmayman. Shu akkauntdan yangi o'yin e'lon qil: «Juma, 18:00 · Mahalla maydoni», hali hech kim qo'shilmagan bo'lsin. Qaysi yozuvlarni yaratganingni `id` lari bilan ayt. «O'chir» desam — faqat shu `id` lardagi yozuvlarni o'chir.", ru: 'Что сделать: открой для проверки демо один проверочный аккаунт — с образцовым именем и логином, не настоящий, `namuna = true`. Логин и пароль в ответе не показывай — я в него не захожу. Из этого аккаунта объяви новую игру: «Пятница, 18:00 · Площадка махалли», пусть пока никто не присоединится. Скажи, какие записи создал, с их `id`. Если скажу «Удали» — удаляй только записи с этими `id`.' },
  A1_AKKAUNT[2]
];
const A1_TUZAT_1 = { uz: "Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.", ru: 'Где: файлы, относящиеся к проблеме из записи поломки, — сначала найди причину, потом меняй только нужное место.' };
const A1_TUZAT_2 = { uz: "Nima qilsin: pastdagi yozuvda «buzildi» belgili har urinishni tuzat: demo «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.", ru: 'Что сделать: исправь каждую попытку с меткой «сломалось» в записи ниже: пусть демо работает как в строке «Чего ждал». Назови причину каждой проблемы одной фразой и скажи, какой файл изменил.' };
const A1_TUZAT_3 = { uz: "Nima buzilmasin: yangi funksiya, yangi tugma yoki yangi ekran qo'shma — faqat shu muammoni tuzat. Demo ssenariysi avvalgidek ishlasin: {demo ssenariysi}. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.", ru: 'Что не сломать: не добавляй новую функцию, кнопку или экран — исправь только эту проблему. Сценарий демо пусть работает как раньше: {demo ssenariysi}. Файлы `.env` не трогай. Другие места не трогай, назови изменённые файлы.' };
const A1_XATOLAR = { uz: "Loyiha ildizidagi `XATOLAR.md` ga «## Demo tekshiruvi» bo'limini qo'sh (fayl bo'lmasa — yarat): pastdagi yozuvimni so'zma-so'z ko'chir. «Buzildi» belgili har urinish — usul nomi va uch qator: usul (nima qildim), natija (nima kutdim va nima bo'ldi), holat — men yozgandek. Oxirida ikki qator: buzilmagan usullar; tekshirilmagan usullar (qilinmaganlar — sababi bilan). Faylning qolgan qismiga va boshqa fayllarga tegma.", ru: 'Добавь в `XATOLAR.md` в корне проекта раздел «## Demo tekshiruvi» (если файла нет — создай): перенеси мою запись ниже дословно. Каждая попытка с меткой «сломалось» — название способа и три строки: способ (что я сделал), результат (чего ждал и что произошло), состояние — как я написал. В конце две строки: несломавшиеся способы; непроверенные способы (что не сделано — с причиной). Остальную часть файла и другие файлы не трогай.' };
const A1_USUL_YOL = [
  { uz: "(1) Tarmoq uzilishi — telefonda demo yo'lining o'sha ekranini oching va uchish rejimini yoqing (ulanish belgisi bo'lsa — holati o'zgarganini ko'ring; o'zgarmasa — bu ham natija, yozing). Laptopda demo harakatini qiling, keyin telefonda uchish rejimini o'chiring va telefonga qarang.", ru: '(1) Обрыв сети — откройте на телефоне тот же экран пути демо и включите режим полёта (если есть метка подключения — смотрите, как меняется её состояние; не меняется — это тоже результат, запишите). Сделайте действие демо на ноутбуке, потом выключите режим полёта и посмотрите на телефон.' },
  { uz: "(2) Bo'sh ma'lumot — laptopda demo yo'lini yangilang va agent tayyorlagan bo'sh yozuvni oching; ekranga qarang.", ru: '(2) Пустые данные — обновите путь демо на ноутбуке и откройте пустую запись, подготовленную агентом; посмотрите на экран.' },
  { uz: "(3) Ikki marta bosish — laptopda demo yo'lidagi asosiy tugmani tez ikki marta bosing; son, ro'yxat va tugmaga qarang. Birinchi safar hech narsa chiqmasa — yana bir-ikki marta qaytaring va ko'rganingizning hammasini «Nima bo'ldi» ga yozing.", ru: '(3) Двойное нажатие — на ноутбуке быстро дважды нажмите главную кнопку на пути демо; смотрите на число, список и кнопку. Если в первый раз ничего не видно — повторите ещё раз-другой и запишите всё увиденное в «Что произошло».' }
];
const urinishMatn = (u, i, n) => `${n} · ${ou(USULLAR[i].nom)}. Nima qildim: ${u.qildim} Nima kutdim: ${u.kutdim} Nima bo'ldi: ${u.boldi}`;
const toliqYozuv = (urinishlar, sabab) => {
  const satr = [];
  urinishlar.forEach((u, i) => {
    if (u.buzildi !== true) return;
    const holat = u.tuzatishQilindi && u.qayta === 'takrorlanmadi' ? 'Tuzatish qilindi — qayta tekshiruvda takrorlanmadi'
      : 'qoldi — ' + (String(sabab['qoldi-' + i] || '').trim() || '{sabab}');
    satr.push(`${i + 1} · ${ou(USULLAR[i].nom)}. Usul: ${u.qildim} Natija: kutdim — ${u.kutdim}; bo'ldi — ${u.boldi}. Holat: ${holat}${u.tuzatishQilindi && u.qayta === 'takrorlandi' ? ' (qayta tekshiruvda yana buzildi)' : ''}.`);
  });
  const buzilmagan = urinishlar.map((u, i) => (u.buzildi === false ? ou(USULLAR[i].nom) : null)).filter(Boolean);
  const tekshirilmagan = urinishlar.map((u, i) => (u.buzildi === null ? ou(USULLAR[i].nom) + ' — tekshirilmadi — ' + (String(sabab['tekshirilmadi-' + i] || '').trim() || '{sabab}') : null)).filter(Boolean);
  satr.push('Buzilmagan usullar: ' + (buzilmagan.join(', ') || "yo'q"));
  satr.push('Tekshirilmagan usullar: ' + (tekshirilmagan.join('; ') || "yo'q"));
  return satr;
};
const MentorDasta = ({ i, onTanla }) => {
  const m = MENTOR_YOZUV[i];
  return (
    <div className="dt-md">
      <span className="dt-md-tab">{USULLAR.map((u, j) => <button key={u.id} type="button" className={cxx('dt-tab', 'dt-md-t', j === i && 'on')} onClick={() => onTanla(j)}>{j + 1}</button>)}<em>{i + 1}{NB}/{NB}3</em></span>
      <YozuvKarta urinishlar={[{ n: i + 1, nom: tr(USULLAR[i].nom), qildim: tr(m.qildim), kutdim: tr(m.kutdim), boldi: m.boldi ? tr(m.boldi) : null, belgi: m.belgi ? tr(m.belgi) : null }]} />
    </div>
  );
};
const XatolarKarta = ({ satrlar, mentor }) => (
  <div className="dt-fayl">
    <span className="dt-fayl-n"><code className="qcode">XATOLAR.md</code>{mentor && <em><MJ /></em>}</span>
    <b className="dt-fayl-h">## Demo tekshiruvi</b>
    {mentor
      ? <>
        <span className="dt-fayl-q bosh"><em>{tr({ uz: 'usul · natija · holat', ru: 'способ · результат · состояние' })}</em><i className="dt-yz-uya" /></span>
        <span className="dt-fayl-q bosh"><em>Buzilmagan usullar:</em><i className="dt-yz-uya" /></span>
        <span className="dt-fayl-q bosh"><em>Tekshirilmagan usullar:</em><i className="dt-yz-uya" /></span>
      </>
      : satrlar.map((s, i) => <span key={i} className="dt-fayl-q">{s}</span>)}
  </div>
);
const UrinishKarta = ({ i, u, onYoz, onBelgi, xato }) => (
  <span className={cxx('dt-ur', xato && 'err')} key={i}>
    <span className="dt-ur-h">{i + 1}{NB}/{NB}3 · {tr(USULLAR[i].nom)}</span>
    <span className="dt-ur-yo">{tr(A1_USUL_YOL[i])}</span>
    <label className="dt-maydon"><i className="dt-maydon-n">{tr({ uz: 'Nima qilaman', ru: 'Что сделаю' })}</i><textarea className="dt-inp" rows={2} maxLength={300} value={u.qildim} onChange={e => onYoz('qildim', e.target.value)} /></label>
    <label className="dt-maydon"><i className="dt-maydon-n">{tr({ uz: 'Nima kutaman', ru: 'Чего жду' })}</i><textarea className="dt-inp" rows={2} maxLength={240} value={u.kutdim} placeholder={tr({ uz: "Ekranda aniq nima ko'rinadi?", ru: 'Что именно видно на экране?' })} onChange={e => onYoz('kutdim', e.target.value)} /></label>
    <label className={cxx('dt-maydon', !u.boldi.trim() && 'chorla')}><i className="dt-maydon-n">{tr(YOZUV_Q.boldi)}</i><textarea className={cxx('dt-inp', xato && 'err')} rows={2} maxLength={400} value={u.boldi} onChange={e => onYoz('boldi', e.target.value)} /></label>
    <span className="dt-belgilar">
      <button type="button" className={cxx('dt-belgi', 'buz', u.buzildi === true && 'on')} onClick={() => onBelgi(true)}>{tr(BELGI.buzildi)}</button>
      <button type="button" className={cxx('dt-belgi', 'ok', u.buzildi === false && 'on')} onClick={() => onBelgi(false)}>{tr(BELGI.buzilmadi)}</button>
    </span>
    {xato && <span className="q-xato dt-blk" role="status">{tr({ uz: "Belgidan oldin nima ko'rganingizni yozing.", ru: 'Перед меткой запишите, что вы увидели.' })}</span>}
    <span className="dt-kul">{tr({ uz: "«Buzilmadi» — shu urinishda kutilgani bo'ldi; boshqa safar ham shunday degani emas.", ru: '«Не сломалось» — в этой попытке случилось ожидаемое; это не значит, что так будет и в другой раз.' })}</span>
  </span>
);
const TrekQator = ({ trek, setTrek, platforma }) => (platforma
  ? null
  : <span className="dt-trek">{[['mobil', { uz: 'Mobil trek', ru: 'Мобильный трек' }], ['web', { uz: 'Web-trek', ru: 'Веб-трек' }]].map(([id, t]) => <button type="button" key={id} className={cxx('q-chip', trek === id && 'on')} onClick={() => setTrek(id)}>{tr(t)}</button>)}</span>);
const ScreenA1 = (props) => {
  const isMentor = useMentorLive();
  const demo = useMemo(() => demoOl(), []);
  const platforma = useMemo(() => trekOl(), []);
  const [trek, setTrek] = useState(platforma);
  const [tek, setTek] = useState(() => tekOl());
  const [ur, setUr] = useState(() => tekOl().urinishlar.map((u, i) => ({ ...u, qildim: u.qildim || tr(USULLAR[i].qilaman) })));
  const [joriyU, setJoriyU] = useState(() => { const i = tekOl().urinishlar.findIndex(u => u.buzildi === null); return i < 0 ? 0 : i; });
  const [xatoU, setXatoU] = useState(null);
  const [joy, setJoy] = useState({});
  const [sabab, setSabab] = useState({});
  const [mi, setMi] = useState(0);
  const saqla = (yangi) => { setUr(yangi); if (!isMentor) { const o = tekOl(); tekYoz(yangi.map(u => ({ ...u, qildim: String(u.qildim || '').trim(), kutdim: String(u.kutdim || '').trim(), boldi: String(u.boldi || '').trim() })), o.otishlar); setTek(tekOl()); } };
  const yozU = (i, k, v) => { setXatoU(null); setUr(a => a.map((u, j) => (j === i ? { ...u, [k]: v } : u))); };
  const belgi = (i, b) => {
    if (!String(ur[i].boldi || '').trim()) { setXatoU(i); return; }
    setXatoU(null);
    const yangi = ur.map((u, j) => (j === i ? { ...u, buzildi: b, tuzatishQilindi: b ? u.tuzatishQilindi : false, qayta: b ? u.qayta : null } : u));
    saqla(yangi);
    const keyingi = [0, 1, 2].find(j => yangi[j].buzildi === null && j > i) ?? [0, 1, 2].find(j => yangi[j].buzildi === null);
    if (keyingi != null) { setJoriyU(keyingi); setMi(keyingi); }
  };
  const tuzBos = (i) => saqla(ur.map((u, j) => (j === i ? { ...u, tuzatishQilindi: !u.tuzatishQilindi, qayta: u.tuzatishQilindi ? null : u.qayta } : u)));
  const qaytaBos = (i, q) => saqla(ur.map((u, j) => (j === i ? { ...u, qayta: q } : u)));
  const buzilganlar = ur.map((u, i) => (u.buzildi === true ? i : null)).filter(i => i !== null);
  const tuzatilganlar = ur.map((u, i) => (u.buzildi === true && u.tuzatishQilindi ? i : null)).filter(i => i !== null);
  const uchalasi = ur.every(u => u.buzildi !== null);
  const ssMatn = demo.ssenariy ? demo.ssenariy.slice(0, 5).join(', ') : null;
  const tuzatSatrlar = [A1_TUZAT_1, A1_TUZAT_2, ...buzilganlar.map((i, k) => urinishMatn(ur[i], i, k + 1)), A1_TUZAT_3];
  const sababJoylar = ur.map((u, i) => sabFn(u, i)).filter(Boolean);
  const yozuvSatr = toliqYozuv(ur, sabab);
  const mobil = trek !== 'web', web = trek !== 'mobil';
  const holat = !buzilganlar.length ? 'yoq' : buzilganlar.every(i => ur[i].tuzatishQilindi && ur[i].qayta === 'takrorlanmadi') ? 'toza' : 'ochiq';
  const doneText = holat === 'toza' ? { uz: 'Tuzatish qilindi — qayta tekshiruvda takrorlanmadi.', ru: 'Исправление сделано — при повторной проверке не повторилось.' }
    : holat === 'yoq' ? { uz: 'Uch usul tekshirildi — bu safar demo buzilmadi.', ru: 'Три способа проверены — в этот раз демо не сломалось.' }
      : { uz: 'Tuzatish qilindi — bitta urinish hali ochiq, u `XATOLAR.md` da.', ru: 'Исправление сделано — одна попытка ещё открыта, она в `XATOLAR.md`.' };
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "demo yo'lingizni laptop brauzerida oching (mobil trekda — brauzer ko'rinishi, web-trekda — saytingiz) va demo yo'lidagi hisobingiz bilan kiring; telefonda ham o'sha demo yo'lini brauzerda oching.", ru: 'откройте путь демо в браузере ноутбука (в мобильном треке — браузерная версия, в веб-треке — ваш сайт) и войдите со своим аккаунтом на пути демо; на телефоне тоже откройте тот же путь демо в браузере.' })}
      <Band>{tx({ uz: "Backend'ni 6-darsdagidek bitta so'rov bilan uyg'oting. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.", ru: 'Разбудите Backend одним запросом, как на 6-м уроке. В терминале `git status`: файлов `.env` в списке быть не должно.' })}</Band>
      <Band><b>{tr({ uz: "Buzish — faqat o'z mahsulotingizda: boshqa odamning ilovasi yoki sayti va haqiqiy foydalanuvchining hisobi ishlatilmaydi.", ru: 'Ломать — только свой продукт: чужое приложение или сайт и аккаунт настоящего пользователя не используются.' })}</b> {tr({ uz: '6-darsdan yangi funksiya to\'xtatilgan — bugun faqat tuzatish.', ru: 'С 6-го урока новые функции остановлены — сегодня только исправления.' })}</Band>
      {!demo.uygotish && <Kulrang>{tr({ uz: "Backend uxlab qolgan bo'lsa, birinchi ochilish bir daqiqagacha cho'zilishi mumkin.", ru: 'Если Backend уснул, первое открытие может занять до минуты.' })}</Kulrang>}
      <Band>{tr({ uz: "Keyin tekshiruv akkaunti uchun — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'Затем для проверочного аккаунта — заполните скобку (рядом серый образец), нажмите «Скопировать» и отправьте в Antigravity:' })}</Band>
      <DtPrompt satrlar={A1_AKKAUNT} joylar={[{ id: 'bosh', joy: "{bo'sh holat}", namuna: { uz: "masalan: yangi o'yin e'lon qil, hali hech kim qo'shilmagan bo'lsin", ru: 'например: объяви новую игру, пусть пока никто не присоединится' } }]} qiymat={joy} onYoz={(k, v) => setJoy(j => ({ ...j, [k]: v }))} />
      <Yordam sarlavha={{ uz: "Mentor misolidagi to'liq talab", ru: 'Полное требование из примера Ментора' }} satrlar={A1_AKKAUNT_YORDAM} /></> },
    { h: { uz: 'Buzish', ru: 'Сломать' }, t: <>{tr({ uz: "chapda 5-ekrandagi uch kartangiz, bittadan: «Nima qilaman» va «Nima kutaman» — tayyor (tahrirlanadi); bajaring va «Nima bo'ldi» qatoriga ko'rganingizni yozing; belgi: «Buzildi» · «Buzilmadi».", ru: 'слева ваши три карточки с 5-го экрана, по одной: «Что сделаю» и «Чего жду» — готовы (можно править); выполните и запишите увиденное в строку «Что произошло»; метка: «Сломалось» · «Не сломалось».' })}
      <span className="dt-ur-ro">{ur.map((u, i) => (u.buzildi !== null && i !== joriyU) && <button key={i} type="button" className="dt-ix-q dt-tab" onClick={() => { setJoriyU(i); setMi(i); }}><i>✓</i>{tr(USULLAR[i].nom)} · <b className={u.buzildi ? 'buz' : 'ok'}>{tr(u.buzildi ? BELGI.buzildi : BELGI.buzilmadi)}</b> <em>✎</em></button>)}</span>
      <UrinishKarta i={joriyU} u={ur[joriyU]} xato={xatoU === joriyU} onYoz={(k, v) => yozU(joriyU, k, v)} onBelgi={(b) => belgi(joriyU, b)} />
      <Band>{tr({ uz: "Har urinishdan keyin demo holatini boshiga qaytaring (Mentor misolida — laptopda o'yindan chiqish: yana «8 / 10»).", ru: 'После каждой попытки верните демо в исходное состояние (в примере Ментора — выйти из игры на ноутбуке: снова «8 / 10»).' })}</Band>
      <Band>{tx({ uz: "Xato chiqsa — bu ham natija: uni «Nima bo'ldi» qatoriga yozing. Agentga faqat xato qatorini yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»", ru: 'Если появилась ошибка — это тоже результат: запишите её в «Что произошло». Агенту отправьте только строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Nima bo\'lganini ayt, hech narsani o\'zgartirma.»' })}</Band></> },
    { h: { uz: 'Tuzatish', ru: 'Исправить' }, t: <>{tx({ uz: "«Buzildi» belgili urinish bo'lsa (hech biri bo'lmasa — bu qadamni o'tkazib yuboring: 4-qadamda faqat `XATOLAR.md`):", ru: 'если есть попытка с меткой «Сломалось» (если нет ни одной — пропустите этот шаг: на 4-м шаге только `XATOLAR.md`):' })}
      {buzilganlar.length > 0 ? <>
        <Band>{tr({ uz: "qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'проверьте скобки (можно править), нажмите «Скопировать» и отправьте в Antigravity:' })}</Band>
        <DtPrompt satrlar={tuzatSatrlar} avto={{ '{demo ssenariysi}': ssMatn }} joylar={ssMatn ? [] : [{ id: 'ss', joy: '{demo ssenariysi}', namuna: { uz: 'masalan: kirish, o\'yinlar ro\'yxati, qo\'shilish, ikkinchi telefonda son, "Hozir ko\'ryapti"', ru: 'например: вход, список игр, присоединение, число на втором телефоне, «Сейчас смотрят»' } }]} qiymat={joy} onYoz={(k, v) => setJoy(j => ({ ...j, [k]: v }))} />
        <Band>{tx({ uz: "Agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; terminalda `git diff`: faqat buzish yozuvidagi muammoga tegishli qatorlar o'zgarganmi — asosiy tekshiruv; yangi tugma, yangi ekran, aloqasiz fayl yo'q. Ortiqcha narsa bo'lsa — agentga: «{nima} — muammoga aloqasi yo'q. Uni olib tashla, faqat tuzatish qolsin.»", ru: 'Когда агент закончит: `git status` — изменённые файлы совпадают с названными агентом, `.env` в списке нет; в терминале `git diff`: изменились ли только строки, относящиеся к проблеме из записи поломки, — главная проверка; новой кнопки, нового экрана, постороннего файла нет. Если есть лишнее — агенту: «{nima} — muammoga aloqasi yo\'q. Uni olib tashla, faqat tuzatish qolsin.»' })}</Band>
        <Band>{tx({ uz: "Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa — o'sha urinishga «Tuzatish qilindi» ni belgilang: bu ish fakti; to'g'riligini 4-qadam ko'rsatadi. Agent aytgan sabab — uning taxmini: `git diff` dagi o'zgarish bilan solishtiring.", ru: 'Если агент назвал для каждой проблемы изменённый файл и он виден в `git status` — отметьте у этой попытки «Исправление сделано»: это факт работы; правильность покажет 4-й шаг. Причина, названная агентом, — его догадка: сравните с изменением в `git diff`.' })}</Band>
        <span className="dt-belgilar">{buzilganlar.map(i => <button key={i} type="button" className={cxx('dt-belgi', 'tuz', ur[i].tuzatishQilindi && 'on')} onClick={() => tuzBos(i)}>{i + 1} · {tr(USULLAR[i].nom)} — {tr(BELGI.tuz)}{ur[i].tuzatishQilindi && ' ✓'}</button>)}</span>
        <Band>{tx({ uz: "Avval lokal: demo yo'lini bir marta o'zingiz bosib ko'ring (mobil — `npx expo start`, web — `npm run dev`); ishlasa — `git add <fayl>` (`git add .` emas) → `git commit -m \"demo tekshiruvi: tuzatish\"` → `git push`. Yangi versiya — o'zgargan qismga qarab:", ru: 'Сначала локально: один раз сами пройдите путь демо (мобильный — `npx expo start`, веб — `npm run dev`); если работает — `git add <fayl>` (не `git add .`) → `git commit -m "demo tekshiruvi: tuzatish"` → `git push`. Новая версия — в зависимости от изменённой части:' })}</Band>
        <TrekQator trek={trek} setTrek={setTrek} platforma={platforma} />
        <Band>{tx({ uz: "`backend/` — Render'da yangi versiya (bir necha daqiqa cho'zilishi mumkin)", ru: '`backend/` — новая версия на Render (может занять несколько минут)' })}{mobil && <> · {tx({ uz: "mobil trekda `mobil/` — brauzer ko'rinishini qayta eksport qiling (`npx expo export -p web` → `netlify deploy --prod --dir dist`)", ru: 'в мобильном треке `mobil/` — заново экспортируйте браузерную версию (`npx expo export -p web` → `netlify deploy --prod --dir dist`)' })}</>}{web && <> · {tr({ uz: "web-trekda — push'dan keyin Netlify saytni odatda o'zi yangilaydi.", ru: 'в веб-треке — после push Netlify обычно сам обновляет сайт.' })}</>}</Band>
        <Band>{tx({ uz: "Kutayotganda boshqa urinish yozuvini o'qing. Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Пока ждёте, прочитайте запись другой попытки. Если появилась ошибка — отправьте агенту строку ошибки (не значения `.env`, токены и ключи): «Shu xato chiqdi: {xato}. Tuzat.»' })}</Band>
      </> : <Kulrang>{tr({ uz: "Bu safar «Buzildi» yo'q — «Bajardim»ni bosing.", ru: 'В этот раз «Сломалось» нет — нажмите «Готово».' })}</Kulrang>}</> },
    { h: { uz: 'Qayta tekshirish', ru: 'Проверить заново' }, t: <>{tr({ uz: "«Tuzatish qilindi» belgili har urinishni o'sha usul bilan qaytaring (demo yo'lini yangilab). Tanlang: «Qayta tekshiruvda takrorlanmadi» · «Qayta tekshiruvda yana buzildi».", ru: 'повторите каждую попытку с меткой «Исправление сделано» тем же способом (обновив путь демо). Выберите: «При повторной проверке не повторилось» · «При повторной проверке снова сломалось».' })}
      {tuzatilganlar.map(i => <span key={i} className="dt-belgilar dt-qayta"><b>{i + 1} · {tr(USULLAR[i].nom)}</b>
        <button type="button" className={cxx('dt-belgi', 'ok', ur[i].qayta === 'takrorlanmadi' && 'on')} onClick={() => qaytaBos(i, 'takrorlanmadi')}>{tr(BELGI.takrorlanmadi)}</button>
        <button type="button" className={cxx('dt-belgi', 'buz', ur[i].qayta === 'takrorlandi' && 'on')} onClick={() => qaytaBos(i, 'takrorlandi')}>{tr(BELGI.takrorlandi)}</button></span>)}
      {tuzatilganlar.some(i => ur[i].qayta === 'takrorlandi') && <Band>{tx({ uz: "Yana buzilsa — agentga bir marta: «{usul} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat, yangi narsa qo'shma, o'zgargan fayllarni ayt.» → 3-qadamdagi zanjir to'liq: `git diff` (faqat shu muammoga tegishli qatorlar) → lokal → `git add <fayl>` → commit → push → yangi versiya (mobil — qayta eksport) → o'sha usul bilan yana bir marta. Ikkinchi marta ham buzilsa — `XATOLAR.md` da «qoldi».", ru: 'Если снова сломалось — агенту один раз: «{usul} qayta tekshiruvda yana buzildi: {nima bo\'ldi}. Tuzat, yangi narsa qo\'shma, o\'zgargan fayllarni ayt.» → полная цепочка 3-го шага: `git diff` (только строки по этой проблеме) → локально → `git add <fayl>` → commit → push → новая версия (мобильный — повторный экспорт) → ещё раз тем же способом. Если сломалось и во второй раз — в `XATOLAR.md` «qoldi».' })}</Band>}
      <Band>{tr({ uz: "Keyin «Nusxalash» bilan Antigravity'ga:", ru: 'Затем через «Скопировать» — в Antigravity:' })}</Band>
      {sababJoylar.length > 0 && <span className="dt-joylar">{sababJoylar.map(id => { const i = Number(id.split('-')[1]); return (
        <label key={id} className="dt-joy-m"><span className="dt-joy-n">{i + 1} · {tr(USULLAR[i].nom)} — {id.startsWith('qoldi') ? 'qoldi' : 'tekshirilmadi'} — {'{sabab}'}</span>
          <input type="text" value={sabab[id] || ''} maxLength={160} placeholder={tr({ uz: 'masalan: vaqt yetmadi', ru: 'например: не хватило времени' })} onChange={e => setSabab(s => ({ ...s, [id]: e.target.value }))} /></label>); })}</span>}
      <DtPrompt satrlar={[A1_XATOLAR, ...yozuvSatr]} />
      <Band>{tx({ uz: "`XATOLAR.md` ni yozuvingiz bilan solishtiring; mos bo'lsa — `git add XATOLAR.md` → `git commit -m \"demo tekshiruvi\"` → `git push`.", ru: 'Сравните `XATOLAR.md` со своей записью; если совпадает — `git add XATOLAR.md` → `git commit -m "demo tekshiruvi"` → `git push`.' })}</Band>
      <Band>{tx({ uz: "Oxirida agentga: «Tekshiruv akkauntini va u yaratgan yozuvlarni `id` lari bo'yicha o'chir — faqat bugun aytgan `id` laringni. Qaysilari o'chganini ayt.» Agentning «o'chirdim» degani — uning so'zi: demo yo'lida bo'sh yozuv yo'qligini o'zingiz ko'rasiz.", ru: 'В конце агенту: «Tekshiruv akkauntini va u yaratgan yozuvlarni `id` lari bo\'yicha o\'chir — faqat bugun aytgan `id` laringni. Qaysilari o\'chganini ayt.» «Удалил» агента — его слова: что пустой записи на пути демо нет, вы увидите сами.' })}</Band></> }
  ];
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z mahsulotingiz", ru: 'Практика 1 · ваш продукт' }}
      title={{ uz: <>Demongizni uch usulda buzing, <A>topilganini tuzattiring.</A></>, ru: <>Сломайте демо тремя способами, <A>найденное дайте исправить.</A></> }}
      mentor={{ uz: "Buzish va yozuv — sizda, tuzatish — agentda; «1 · Ochish»dan boshlang.", ru: 'Ломаете и записываете вы, исправляет агент; начните с «1 · Открыть».' }}
      strip={<ArtStrip urinishlar={ur} />}
      steps={steps}
      qulf={(i) => (i === 1 && !uchalasi) || (i === 3 && tuzatilganlar.some(j => !ur[j].qayta))}
      natija={(done) => (done
        ? <XatolarKarta satrlar={yozuvSatr} />
        : <div className="dt-an">
          <DemoSahna tel={{ son: 8, ulanish: 'ulangan' }} lap={{ son: 8 }} className="ixcham" />
          <MentorDasta i={mi} onTanla={setMi} />
          <XatolarKarta mentor />
        </div>)}
      ortda={{ uz: "Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-07-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz.", ru: 'Отстали — откройте пример Ментора вне своего репозитория, в новой папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-07-done` — последнюю команду запускайте только в этой новой папке: она стирает изменения в папке. В `backend/.env` и `mobil/.env` впишете свои значения.' }}
      ulgur={{ uz: "Ulgurmasangiz: uch urinish belgilangach (2-qadam) «Davom etish» ochiladi — Amaliyot 2 ga o'ting; 3, 4-qadam — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: после отметки трёх попыток (шаг 2) откроется «Продолжить» — переходите к Практике 2; шаги 3, 4 — домашнее задание ①. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={2} ulgurShart={() => uchalasi}
      doneText={doneText}
      ustoz={[
        { uz: "Mentor misolida natija — Mentor repo'sida tekshirilgan haqiqiy yozuv; o'quvchida boshqacha bo'lishi tabiiy. Telefon brauzeri uchish rejimidan keyin sahifani qayta yuklasa, 1-urinishda muammo ko'rinmay qolishi mumkin — urinish baribir yoziladi. Parol kiritiladigan joy proyektorda ko'rinmasin — demo hisobiga oldindan kiring yoki kiritayotganda proyektorni bir lahza o'chiring.", ru: 'В примере Ментора результат — настоящая запись, проверенная в репо Ментора; у ученика он может быть другим — это нормально. Если браузер телефона после режима полёта перезагрузит страницу, в 1-й попытке проблема может не проявиться — попытку всё равно записывают. Место ввода пароля не должно быть видно на проекторе — войдите в демо-аккаунт заранее или на миг выключите проектор.' },
        { uz: "Push'dan keyin brauzer ko'rinishi o'zi yangilanmaydi — mobil trekda qayta eksport shart, aks holda qayta tekshiruv eski kodni ko'radi.", ru: 'После push браузерная версия сама не обновляется — в мобильном треке нужен повторный экспорт, иначе повторная проверка увидит старый код.' }
      ]} />
  );
};

// --- Amaliyot 2: uch demo o'tishi va B reja ---
const Taymer = ({ ishla, son, onBos }) => (
  <button type="button" className={cxx('dt-taymer', ishla && 'on')} onClick={onBos}>
    <i>{ishla ? '■' : '▶'}</i>{tr({ uz: 'Taymer', ru: 'Таймер' })} <b>{Math.floor(son / 60)}:{String(son % 60).padStart(2, '0')}</b>
  </button>
);
const useTaymer = () => {
  const [bosh, setBosh] = useState(null); const [son, setSon] = useState(0);
  useEffect(() => { if (bosh == null) return undefined; const t = setInterval(() => setSon(Math.round((Date.now() - bosh) / 1000)), 250); return () => clearInterval(t); }, [bosh]);
  const bos = () => { if (bosh == null) { setSon(0); setBosh(Date.now()); } else { setBosh(null); } };
  const toxta = () => { const s = bosh == null ? son : Math.round((Date.now() - bosh) / 1000); setBosh(null); setSon(s); return s > 0 ? s : null; };
  return { ishla: bosh != null, son, bos, toxta };
};
const NATIJA_NOM = { rejada: BELGI.xatosiz, xato: BELGI.xato, ochildi: BELGI.ochildi, ochilmadi: BELGI.ochilmadi };
const YAXSHI_N = new Set(['rejada', 'ochildi']);
const OtishQatorlar = ({ otishlar, mentor }) => (
  <div className="dt-oq">
    {[0, 1, 2].map(i => {
      const o = otishlar[i]; const nom = i === 1 ? <>{i + 1}-{tr({ uz: "o'tish", ru: 'проход' })} · {tr({ uz: 'B reja: video', ru: 'План Б: видео' })}</> : <>{i + 1}-{tr({ uz: "o'tish", ru: 'проход' })}</>;
      return (
        <span key={i} className={cxx('dt-oq-q', !mentor && o.natija && (YAXSHI_N.has(o.natija) ? 'ok' : 'err'))}>
          <b>{nom}</b>
          {mentor || !o.natija ? <i className="dt-yz-uya" /> : <em>{tr(NATIJA_NOM[o.natija])}{o.vaqt ? ' · ' + Math.floor(o.vaqt / 60) + ':' + String(o.vaqt % 60).padStart(2, '0') : ''}</em>}
        </span>
      );
    })}
  </div>
);
const OtishKarta = ({ i, otish, ssMatn, onNatija, xatoNima, onXatoNima, breja, videoYoq }) => {
  const tm = useTaymer();
  const [belg, setBelg] = useState([]);
  const bos = (n) => { if (tm.ishla || belg.length) onNatija(n, tm.toxta()); else onNatija(n, otish.vaqt); };
  return (
    <span className="dt-otk">
      <Taymer ishla={tm.ishla} son={tm.son || otish.vaqt || 0} onBos={tm.bos} />
      {!breja && <span className="dt-otk-ss">{ssMatn.map((s, j) => <button key={j} type="button" className={cxx('dt-qadam', 'dt-otq', belg.includes(j) && 'ok')} onClick={() => setBelg(b => (b.includes(j) ? b.filter(x => x !== j) : [...b, j]))}><i>{belg.includes(j) ? '✓' : j + 1}</i><span>{s}</span></button>)}</span>}
      {breja && videoYoq
        ? <Kulrang>{tr({ uz: "Video hali yo'q — ikkinchi o'tishni B rejasiz o'ting; B reja bu darsda tekshirilmaydi.", ru: 'Видео пока нет — второй проход пройдите без Плана Б; План Б на этом уроке не проверяется.' })}</Kulrang>
        : <span className="dt-belgilar">
          {(breja ? ['ochildi', 'ochilmadi'] : ['rejada', 'xato']).map(n => <button key={n} type="button" className={cxx('dt-belgi', YAXSHI_N.has(n) ? 'ok' : 'buz', otish.natija === n && 'on')} onClick={() => bos(n)}>{tr(NATIJA_NOM[n])}</button>)}
        </span>}
      {!breja && otish.natija === 'xato' && <>
        <label className={cxx('dt-maydon', !String(xatoNima || '').trim() && 'chorla')}><i className="dt-maydon-n">{tr(YOZUV_Q.boldi)}</i><input className="dt-inp bir" type="text" maxLength={200} value={xatoNima || ''} onChange={e => onXatoNima(e.target.value)} /></label>
        {!String(xatoNima || '').trim() && <span className="q-xato dt-blk" role="status">{tr({ uz: 'Qaysi qadamda nima bo\'lganini bir qatorda yozing.', ru: 'Одной строкой напишите, на каком шаге что произошло.' })}</span>}
      </>}
      {otish.vaqt != null && <span className="dt-kul">{tr({ uz: "O'tish vaqti", ru: 'Время прохода' })}: {Math.floor(otish.vaqt / 60)}:{String(otish.vaqt % 60).padStart(2, '0')} · {tr({ uz: 'baho emas', ru: 'не оценка' })}</span>}
    </span>
  );
};
const ScreenA2 = (props) => {
  const isMentor = useMentorLive();
  const achMiss = useContext(AchMissCtx);
  const demo = useMemo(() => demoOl(), []);
  const [ss, setSs] = useState(() => (demo.ssenariy ? demo.ssenariy.slice(0, 5) : ['', '', '', '', '']));
  const [video, setVideo] = useState(demo.video === true ? 'bor' : null);
  const [ot, setOt] = useState(() => tekOl().otishlar);
  const [nima, setNima] = useState({});
  const [saqlandi, setSaqlandi] = useState(false);
  const videoYoq = demo.video !== true && video === 'yoq';
  const ssMatn = ss.map((s, j) => String(s || '').trim() || tr(MENTOR_SSENARIY[j]));
  const yozOt = (yangi) => { setOt(yangi); setSaqlandi(false); if (!isMentor) { const o = tekOl(); tekYoz(o.urinishlar, yangi); } };
  const natija = (i, n, vaqt) => yozOt(ot.map((o, j) => (j === i ? { ...o, natija: n, vaqt: vaqt ?? o.vaqt } : o)));
  const toliq = (i) => ot[i].natija && (ot[i].natija !== 'xato' || String(nima[i] || '').trim());
  const saqla = () => { if (!isMentor) { const o = tekOl(); tekYoz(o.urinishlar, ot); } setSaqlandi(true); };
  const ssKarta = <span className="dt-a2ss">
    {demo.ssenariy
      ? <span className="dt-otk-ss">{demo.ssenariy.slice(0, 5).map((s, j) => <span key={j} className="dt-qadam"><i>{j + 1}</i><span>{s}</span></span>)}</span>
      : <span className="dt-joylar">{ss.map((s, j) => <label key={j} className="dt-joy-m"><span className="dt-joy-n">{j + 1}</span><input type="text" maxLength={80} value={s} placeholder={tr(MENTOR_SSENARIY[j])} onChange={e => setSs(a => a.map((x, k) => (k === j ? e.target.value : x)))} /></label>)}</span>}
  </span>;
  const xulosa = ot[0].natija === 'rejada' && ot[2].natija === 'rejada' && ot[1].natija === 'ochildi'
    ? { uz: 'Ikki jonli o\'tish xatosiz, B reja o\'tishi tugadi.', ru: 'Два живых прохода без ошибок, проход с Планом Б завершён.' }
    : { uz: "Uch o'tish belgilandi — xato bo'lgan joy yozuvda turibdi.", ru: 'Три прохода отмечены — место с ошибкой есть в записи.' };
  const steps = [
    { h: { uz: 'Ochish', ru: 'Открыть' }, t: <>{tr({ uz: "chapda demo ssenariyingiz (5 qadam). Laptopda demo yo'li ochiq, telefonda — ikkinchi qurilma. Uch o'tish: 1 — jonli · 2 — internet uzilgan holat, B reja bilan tugaydi · 3 — jonli.", ru: 'слева ваш сценарий демо (5 шагов). На ноутбуке открыт путь демо, на телефоне — второе устройство. Три прохода: 1 — живой · 2 — интернет пропал, завершается Планом Б · 3 — живой.' })}
      {ssKarta}
      {!demo.ssenariy && <Kulrang>{tr({ uz: "Ssenariy saqlanmagan — besh qatorni shu yerda yozing (kulrang — Mentor ssenariysi).", ru: 'Сценарий не сохранён — напишите пять строк здесь (серым — сценарий Ментора).' })}</Kulrang>}
      <Band>{tr({ uz: "Backend'ni yana uyg'oting — Amaliyot 1 dan keyin 15 daqiqadan ko'p o'tgan bo'lishi mumkin. B reja videosini laptopda ochishga tayyorlab qo'ying (6-darsda yozgansiz).", ru: 'Снова разбудите Backend — после Практики 1 могло пройти больше 15 минут. Подготовьте видео Плана Б к открытию на ноутбуке (вы записали его на 6-м уроке).' })}</Band>
      {demo.video !== true && <span className="dt-trek dt-vtan">{[['bor', { uz: 'Video bor', ru: 'Видео есть' }], ['yoq', { uz: "Video hali yo'q", ru: 'Видео пока нет' }]].map(([id, t]) => <button type="button" key={id} className={cxx('q-chip', video === id && 'on')} onClick={() => setVideo(id)}>{tr(t)}</button>)}</span>}
      {videoYoq && <Kulrang>{tr({ uz: "Video hali yo'q — ikkinchi o'tishni B rejasiz o'ting; B reja bu darsda tekshirilmaydi.", ru: 'Видео пока нет — второй проход пройдите без Плана Б; План Б на этом уроке не проверяется.' })}</Kulrang>}
      <Band>{tr({ uz: "Sherik bo'lsa — u laptop ekraniga qarab, hakam o'rnida o'tirsin; ismi hech qayerga yozilmaydi.", ru: 'Если есть напарник — пусть сидит на месте судьи и смотрит на экран ноутбука; его имя нигде не записывается.' })}</Band></> },
    { h: { uz: '1-o\'tish', ru: '1-й проход' }, t: <>{tr({ uz: "«Taymer»ni bosing va ssenariy bo'yicha demo qiling; har qadamdan keyin chapdagi qadamni bosib belgilang (✓). Oxirida: «Xatosiz» · «Xato bilan» (bosilsa — «Nima bo'ldi» bir qator).", ru: 'нажмите «Таймер» и проведите демо по сценарию; после каждого шага отмечайте шаг слева (✓). В конце: «Без ошибок» · «С ошибкой» (если нажать — одна строка «Что произошло»).' })}
      <OtishKarta i={0} otish={ot[0]} ssMatn={ssMatn} onNatija={(n, v) => natija(0, n, v)} xatoNima={nima[0]} onXatoNima={v => setNima(x => ({ ...x, 0: v }))} />
      <Band>{tr({ uz: "Keyin demo holatini boshiga qaytaring (Mentor misolida — o'yindan chiqish: yana «8 / 10»).", ru: 'Затем верните демо в исходное состояние (в примере Ментора — выйти из игры: снова «8 / 10»).' })}</Band></> },
    { h: { uz: "2-o'tish — B reja bilan", ru: '2-й проход — с Планом Б' }, t: <>{tr({ uz: "«Taymer» va ssenariy; 3-qadamga yetganda internet uzildi deb hisoblang: B reja gapini ayting va laptopda videoni oching, oxirigacha ko'rsating.", ru: '«Таймер» и сценарий; дойдя до 3-го шага, считайте, что интернет пропал: скажите фразу Плана Б, откройте видео на ноутбуке и покажите до конца.' })}
      <Band>{tr({ uz: "Belgilang: «B reja bo'yicha tugadi» · «B reja ochilmadi» — bu o'tishda «Xatosiz» yo'q: jonli ssenariy 3-qadamda ataylab to'xtatiladi.", ru: 'Отметьте: «Завершено по Плану Б» · «План Б не открылся» — в этом проходе «Без ошибок» нет: живой сценарий нарочно останавливают на 3-м шаге.' })} {tr({ uz: 'Mentor misolida B reja gapi:', ru: 'Фраза Плана Б в примере Ментора:' })} «{tr(B_REJA_GAPI)}»</Band>
      <OtishKarta i={1} breja videoYoq={videoYoq} otish={ot[1]} ssMatn={ssMatn} onNatija={(n, v) => natija(1, n, v)} /></> },
    { h: { uz: "3-o'tish va tekshirish", ru: '3-й проход и проверка' }, t: <>{tr({ uz: "oxirgi jonli o'tish, taymer bilan; belgilang.", ru: 'последний живой проход, с таймером; отметьте.' })}
      <OtishKarta i={2} otish={ot[2]} ssMatn={ssMatn} onNatija={(n, v) => natija(2, n, v)} xatoNima={nima[2]} onXatoNima={v => setNima(x => ({ ...x, 2: v }))} />
      <Band>{tx({ uz: "Keyin uch qatorni o'qing: «Xato bilan» bo'lsa — o'sha qadamni buzish yozuvi bilan Amaliyot 1 dagi tuzatish talabiga bering (vaqt bo'lsa): tuzatish → `git diff` → lokal → push → yangi versiya → o'sha o'tishni qaytadan (natija — oxirgisi); vaqt bo'lmasa — `XATOLAR.md` ga «qoldi» deb, sababi bilan yozing. «Saqlash».", ru: 'Затем прочитайте три строки: если «С ошибкой» — отдайте этот шаг с записью поломки в требование на исправление из Практики 1 (если есть время): исправление → `git diff` → локально → push → новая версия → этот проход заново (результат — последний); если времени нет — запишите в `XATOLAR.md` «qoldi» с причиной. «Сохранить».' })}</Band>
      <OtishQatorlar otishlar={ot} />
      <QTugma className={cxx('dt-saqla', !saqlandi && ot[2].natija && 'dt-halqa')} onClick={saqla}>{saqlandi ? tr({ uz: '✓ Saqlandi', ru: '✓ Сохранено' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
      <Band>{tr({ uz: "Taymer: o'tish vaqti ko'rinadi va saqlanadi (baho emas) — «Xatosiz» vaqtga qarab emas, beshala qadam rejadagidek o'tganiga qarab belgilanadi.", ru: 'Таймер: время прохода видно и сохраняется (не оценка) — «Без ошибок» ставят не по времени, а по тому, прошли ли все пять шагов по плану.' })}</Band></> }
  ];
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z demongiz", ru: 'Практика 2 · ваше демо' }}
      title={{ uz: <>Demoni boshidan oxirigacha <A>uch marta o'ting.</A></>, ru: <>Пройдите демо от начала до конца <A>три раза.</A></> }}
      mentor={{ uz: "Taymerni yoqib, ssenariy bo'yicha o'ting — ikkinchi o'tishda B rejaga o'tasiz; «1 · Ochish»dan boshlang.", ru: 'Включите таймер и идите по сценарию — во втором проходе переходите на План Б; начните с «1 · Открыть».' }}
      strip={<ArtStrip urinishlar={tekOl().urinishlar} />}
      steps={steps}
      qulf={(i) => (i === 1 && !toliq(0)) || (i === 2 && !(ot[1].natija || videoYoq)) || (i === 3 && !(toliq(2) && saqlandi))}
      onTugadi={() => { if (achMiss && achMiss.earn && ot.every(o => o.natija !== null)) achMiss.earn('threeRuns'); }}
      natija={(done) => (done
        ? <div className="dt-an"><OtishQatorlar otishlar={ot} /></div>
        : <div className="dt-an">
          <SsenariyChiziq qadam={5} joriy={false} taymer={{ tol: kamHarakat() ? 'toliq' : 'yur', dur: 6, kechik: 0.4 }} />
          <OtishQatorlar otishlar={ot} mentor />
          <DemoLaptop video pufak={tr(B_REJA_GAPI)} />
        </div>)}
      ulgur={{ uz: "Ulgurmasangiz: 1-o'tishdan keyin (2-qadam) «Davom etish» ochiladi; qolgan o'tishlar — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.", ru: 'Если не успеваете: после 1-го прохода (шаг 2) откроется «Продолжить»; остальные проходы — домашнее задание ①. Блок считается выполненным после «Готово» на 4-м шаге.' }}
      ulgurQadam={2} ulgurShart={() => !!ot[0].natija}
      doneText={xulosa}
      ustoz={[
        { uz: "Har o'tishdan keyin demo holati boshiga qaytariladi (Mentor misolida — o'yindan chiqish, «8 / 10»). Taymer — mashq uchun: Mentor rejasi 60–90 soniya; oshsa — qaysi qadam cho'zilganini so'rang.", ru: 'После каждого прохода демо возвращают в исходное состояние (в примере Ментора — выход из игры, «8 / 10»). Таймер — для тренировки: план Ментора 60–90 секунд; если дольше — спросите, какой шаг затянулся.' },
        { uz: "Sherik hakam o'rnida — ixtiyoriy; kim kimdan tez o'tgani sanalmaydi. B reja videosi laptopda turadi va hech qayerga yuklanmaydi.", ru: 'Напарник на месте судьи — по желанию; кто прошёл быстрее, не считают. Видео Плана Б остаётся на ноутбуке и никуда не загружается.' }
      ]} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz; orqa yuz neytral (P10)
const FLASHCARDS = [
  { front: { uz: 'Demo tekshiruvi nima?', ru: 'Что такое проверка демо?' }, back: { uz: "Demoni ataylab buzib, ekranda nima bo'lishini oldindan tekshirish", ru: 'Нарочно сломать демо и заранее проверить, что будет на экране' }, note: { uz: "O'z mahsulotingizda", ru: 'На своём продукте' } },
  { front: { uz: "Bu darsda demo qaysi uch savol bilan ko'riladi?", ru: 'Какими тремя вопросами смотрят демо в этом уроке?' }, back: { uz: 'Jonli ishlaydimi, bir qarashda bilinadimi, buzilsa nima bo\'ladi', ru: 'Работает ли вживую, понятно ли с первого взгляда, что будет при поломке' }, note: { uz: 'Faqat birinchisiga demo o\'tishi javob beradi', ru: 'Проход демо отвечает только на первый' } },
  { front: { uz: "Demo o'tishi nimani ko'rsatmaydi?", ru: 'Что не показывает проход демо?' }, back: { uz: "Buzilganda nima bo'lishini va bir qarashda tushunarli ekanini", ru: 'Что будет при поломке и понятно ли с первого взгляда' }, note: { uz: "O'tish oddiy sharoitda, o'zingiz ko'rasiz", ru: 'Проход — в обычных условиях, смотрите сами' } },
  { front: { uz: 'Bu darsdagi uch risk qaysilar?', ru: 'Какие три риска в этом уроке?' }, back: { uz: "Tarmoq uzilishi, bo'sh ma'lumot, ikki marta bosish", ru: 'Обрыв сети, пустые данные, двойное нажатие' }, note: { uz: "Dasturdagi demo-risklar ro'yxati", ru: 'Список демо-рисков из программы' } },
  { front: { uz: "Tarmoq uzilishini qanday buzib ko'rasiz?", ru: 'Как проверить обрыв сети поломкой?' }, back: { uz: 'Telefonda uchish rejimini yoqib, laptopda demo harakatini qilasiz', ru: 'Включаете на телефоне режим полёта и делаете действие демо на ноутбуке' }, note: { uz: 'Internet qaytgach telefonga qaraysiz', ru: 'Когда интернет вернётся — смотрите на телефон' } },
  { front: { uz: 'Tekshiruv akkauntini kim ochadi?', ru: 'Кто открывает проверочный аккаунт?' }, back: { uz: 'Agent — namuna ism va login bilan, haqiqiy emas', ru: 'Агент — с образцовым именем и логином, не настоящий' }, note: { uz: "Login chatga chiqmaydi; bo'sh holat shu hisobda", ru: 'Логин в чат не выводится; пустое состояние — в этом аккаунте' } },
  { front: { uz: 'Yaxshi kutish nimani aytadi?', ru: 'Что называет хорошее ожидание?' }, back: { uz: "Ekranda ko'rinadigan narsani: belgi, son yoki tugma", ru: 'То, что видно на экране: метку, число или кнопку' }, note: { uz: '«Yaxshi ishlaydi» — kutish emas', ru: '«Хорошо работает» — не ожидание' } },
  { front: { uz: 'Kutish qachon yoziladi?', ru: 'Когда записывают ожидание?' }, back: { uz: 'Buzishdan oldin', ru: 'До поломки' }, note: { uz: 'Keyin natija bilan solishtiriladi', ru: 'Потом сравнивают с результатом' } },
  { front: { uz: 'Riskning oldini olish va kutishning farqi nima?', ru: 'Чем предотвращение риска отличается от ожидания?' }, back: { uz: "Oldini olish — demodan oldingi ish; kutish — buzilganda demo nima ko'rsatishi", ru: 'Предотвращение — работа до демо; ожидание — что демо покажет при поломке' }, note: { uz: 'Ikkalasi kerak, lekin bir narsa emas', ru: 'Нужно и то и другое, но это разное' } },
  { front: { uz: '«Tuzatish qilindi» nimani bildiradi?', ru: 'Что означает «Исправление сделано»?' }, back: { uz: 'Kodda tuzatish uchun o\'zgarish qilinganini', ru: 'Что в коде сделано изменение для исправления' }, note: { uz: 'Natija — qayta tekshiruvda', ru: 'Результат — при повторной проверке' } },
  { front: { uz: 'Tuzatishdan keyin qanday qayta tekshirasiz?', ru: 'Как проверить заново после исправления?' }, back: { uz: "O'sha usul bilan yana buzib ko'rasiz", ru: 'Снова ломаете тем же способом' }, note: { uz: 'Natija: takrorlanmadi yoki yana buzildi', ru: 'Результат: не повторилось или снова сломалось' } },
  { front: { uz: "Bu mashqda B reja qaysi demo o'tishida ochiladi?", ru: 'В каком проходе демо в этом упражнении открывают План Б?' }, back: { uz: 'Ikkinchisida, 3-qadamda', ru: 'Во втором, на 3-м шаге' }, note: { uz: 'Mentor misolida — 60 soniyalik video', ru: 'В примере Ментора — 60-секундное видео' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('dt-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back), note: tr(c.note) }))} />
          {!bosildi && <p className="dt-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi.', ru: 'Нажмите на карточку — откроется ответ.' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim uchun · Nechta · Muddat» + ①②; ① holatdan yig'iladi; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim uchun', ru: 'Для кого' }, v: { uz: "o'z demongiz", ru: 'ваше демо' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: 'ikkitagacha (② ixtiyoriy)', ru: 'до двух (② по желанию)' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const HW_QOLGAN = {
  usul: { uz: 'qolgan usullarni buzib yozing', ru: 'сломайте и запишите оставшиеся способы' },
  tuzat: { uz: 'tuzatish va qayta tekshiruvni tugating, `XATOLAR.md` ni yangilang', ru: 'завершите исправление и повторную проверку, обновите `XATOLAR.md`' },
  otish: { uz: "qolgan demo o'tishlarini taymer bilan qiling", ru: 'проведите оставшиеся проходы демо с таймером' },
  video: { uz: "B reja videosini yozing (kompyuteringizdagi ekran yozish vositasi bilan, demo o'tishingiz uzunligida — 6-dars)", ru: 'запишите видео Плана Б (средством записи экрана на вашем компьютере, длиной с ваш проход демо — 6-й урок)' }
};
const HwCard = ({ qolgan, keyingi }) => (
  <div className="card dt-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="dt-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="dt-hw-q"><span className="dt-hw-k">{tr(r.k)}</span><span className="dt-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="dt-hw-qadam">
      {qolgan.length > 0 && <li><i>①</i><span>{tr({ uz: 'Darsda qolgan ishni tugating:', ru: 'Закончите работу, оставшуюся с урока:' })} {qolgan.map((q, i) => <React.Fragment key={q}>{i > 0 && ' · '}{tx(HW_QOLGAN[q])}</React.Fragment>)}.</span></li>}
      <li><i>②</i><span>{tr({ uz: "Xohlasangiz, bitta tanish odamga — ota-onangiz yoki sinfdoshingizga — demongizni bir marta ko'rsating va so'rang: «Nima ekani bir qarashda bilindimi?» Bilinmagan joyni yozib qo'ying. Sherik Amaliyot 2 da javob bergan bo'lsa — shu yetadi.", ru: 'По желанию покажите демо один раз одному знакомому — родителям или однокласснику — и спросите: «Понятно ли с первого взгляда, что это?» Запишите непонятное место. Если напарник уже ответил в Практике 2 — этого достаточно.' })}</span></li>
    </ol>
    <span className="dt-hw-kul">{tr({ uz: 'Uning ismi hech qayerga yozilmaydi; video telefonda yoki kompyuterda qoladi.', ru: 'Его имя нигде не записывается; видео остаётся на телефоне или компьютере.' })}</span>
    {keyingi && <span className="dt-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — QYakun (DE-204) + holatga qarab sarlavha (5 holat, E 54; ✓ va nishon — faqat birinchisida). «Bugungi asosiy fikr» qutisi yo'q (E 50) =====
const SARLAVHA = {
  toliq: { uz: 'Ikki jonli o\'tish xatosiz, B reja o\'tishi tugadi.', ru: 'Два живых прохода без ошибок, проход с Планом Б завершён.' },
  qolgan: { uz: 'Uch o\'tish belgilandi — hali tugamagan ish bor.', ru: 'Три прохода отмечены — есть незавершённая работа.' },
  otishQoldi: { uz: "Demo buzib tekshirildi — uch o'tish qoldi.", ru: 'Демо проверено поломкой — три прохода остались.' },
  boshlandi: { uz: "Buzish boshlandi — qolgan usullar va o'tishlar qoldi.", ru: 'Поломка начата — остались способы и проходы.' },
  bosh: { uz: 'Demo hali buzib tekshirilmagan — uyda boshlang.', ru: 'Демо ещё не проверено поломкой — начните дома.' }
};
const RECAP = [
  { uz: "Demo o'tishi oddiy sharoitni ko'rsatadi: internet bor, ma'lumot bor, tugma bir marta bosiladi.", ru: 'Проход демо показывает обычные условия: интернет есть, данные есть, кнопку нажимают один раз.' },
  { uz: "Demoni ataylab buzib, ekranda nima bo'lishini oldindan tekshirish — demo tekshiruvi.", ru: 'Нарочно сломать демо и заранее проверить, что будет на экране, — проверка демо.' },
  { uz: "Bu darsdagi uch risk — tarmoq uzilishi, bo'sh ma'lumot va ikki marta bosish.", ru: 'Три риска этого урока — обрыв сети, пустые данные и двойное нажатие.' },
  { uz: "Kutish ekranda ko'rinadigan narsani aytadi va buzishdan oldin yoziladi.", ru: 'Ожидание называет то, что видно на экране, и пишется до поломки.' },
  { uz: "«Tuzatish qilindi» — ish fakti; natijani o'sha usul bilan qayta tekshiruv ko'rsatadi.", ru: '«Исправление сделано» — факт работы; результат показывает повторная проверка тем же способом.' }
];
const yakunHolat = (answers, a1i, a2i) => {
  const t = tekOl();
  const a1 = !!(answers[a1i] && answers[a1i].solved), a2 = !!(answers[a2i] && answers[a2i].solved);
  const u = t.urinishlar, o = t.otishlar;
  const buzToza = u.every(x => x.buzildi !== null) && u.every(x => x.buzildi !== true || (x.tuzatishQilindi && x.qayta === 'takrorlanmadi'));
  const otishToza = o[0].natija === 'rejada' && o[2].natija === 'rejada' && o[1].natija === 'ochildi';
  const holat = a1 && a2 && buzToza && otishToza ? 'toliq' : a2 ? 'qolgan' : a1 ? 'otishQoldi' : u.some(x => x.boldi.trim()) ? 'boshlandi' : 'bosh';
  const qolgan = [];
  if (u.some(x => x.buzildi === null)) qolgan.push('usul');
  if (u.some(x => x.buzildi === true && !(x.tuzatishQilindi && x.qayta === 'takrorlanmadi'))) qolgan.push('tuzat');
  if (o.some(x => x.natija === null)) qolgan.push('otish');
  if (demoOl().video !== true && o[1].natija !== 'ochildi') qolgan.push('video');
  return { holat, qolgan };
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
  const a1i = SCREEN_META.findIndex(m => m.id === 'a1'), a2i = SCREEN_META.findIndex(m => m.id === 'a2');
  const yh = yakunHolat(answers, a1i, a2i);
  const holat = isMentorL ? 'toliq' : yh.holat;
  const keyingi = tr({ uz: <>Keyingi dars — <b>«Final pitchingiz 5 daqiqaga tayyormi?»</b></>, ru: <>Следующий урок — <b>«Готов ли ваш финальный питч на 5 минут?»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('dt-yakun', holat !== 'toliq' && 'belgisiz')}>
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
          uyga={<HwCard qolgan={isMentorL ? [] : yh.qolgan} keyingi={keyingi} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmDemoTestLesson({ lang: langProp, onFinished, liveToken }) {
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
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — 7-ekran bonusi (Three Runs!)
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
        /* === 14-Modul 7-dars — darsning o'z vizuali (prefiks dt-): DemoSahna · yozuv kartasi · kutish kartalari · amaliyot bloklari. Faqat qolip tokenlari (D3), emoji yo'q (D4) === */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1040px, 94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px, 4vw, 42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); }
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        .dt-mj { font-weight: 800; font-style: normal; color: ${MJ_RANG}; white-space: nowrap; }
        @keyframes dt-kir { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes dt-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.35)}; } 70%, 100% { box-shadow: 0 0 0 9px ${fon(T.accent, 0)}; } }
        @keyframes dt-chorla { 0% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 0 ${fon(T.accent, 0.3)}; } 70%, 100% { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 0 0 7px ${fon(T.accent, 0)}; } }
        @keyframes dt-yashil { 0% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes dt-pop { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes dt-silk { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
        @keyframes dt-yur { from { width: 0; } to { width: 100%; } }
        @keyframes dt-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; background: ${T.accentSoft}; } 100% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } }
        @keyframes dt-mil { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
        /* Navbatdagi harakat: bitta tugma — halqa, puls 3 marta, scale yo'q (E 40) */
        .dt-halqa, .btn-white-accent.ip-halqa { outline: 2px solid ${T.accent}; outline-offset: 2px; animation: dt-puls 2.2s ease-out .3s 3; }
        .btn-white-accent.ip-halqa { outline-offset: 3px; }
        /* Tanlov guruhi — har variantning o'z yengil chegarasi, navbatma-navbat 2 marta (E 40) */
        .dt-k.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: dt-chorla 1.8s ease-out .5s 2; }
        .dt-k.kutish .q-variant:nth-child(2) { animation-delay: .75s; } .dt-k.kutish .q-variant:nth-child(3) { animation-delay: 1s; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; animation: dt-chorla 1.8s ease-out .5s 2; }
        .q-bashorat .q-chip:nth-child(2) { animation-delay: .75s; } .q-bashorat .q-chip:nth-child(3) { animation-delay: 1s; }
        .dt-bash .q-bashorat { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 14px; row-gap: 6px; padding: 10px 14px; }
        .dt-bash .q-bashorat > .q-yorliq { flex-basis: 100%; }
        .dt-k, .dt-teskari, .dt-risk, .dt-yakun { display: flex; flex-direction: column; flex: 1 0 auto; }
        @media (min-width: 761px) { .dt-k .q-split { grid-template-columns: minmax(0,1.3fr) minmax(0,1fr); gap: 26px; } .dt-teskari .q-split { grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); gap: 24px; } .dt-risk .q-split { grid-template-columns: minmax(0,1fr) minmax(0,1.3fr); gap: 24px; } }
        .dt-teskari .q-split > .q-col:last-child { order: -1; }
        .dt-harakat { display: flex; flex-direction: column; gap: 10px; }
        p.dt-ipucha { margin: 0; font-size: 13.5px; font-weight: 700; color: ${T.accent}; }
        .dt-kul, .dt-band { display: block; }
        .dt-kul { margin-top: 6px; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .dt-band { margin-top: 7px; }
        p.dt-kul-p { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .dt-ustoz { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .dt-ustoz b { color: ${T.ink}; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
        /* Yashil xulosa qutisi ichi: taxmin — birinchi kichik qator, QIzoh — oxirgi kichik qator (E 42) */
        .q-xulosa .dt-xq-t { display: block; font-size: 13px; font-weight: 700; color: ${T.ok}; margin-bottom: 5px; }
        .q-xulosa .dt-xq-t.xato { color: ${T.ink2}; }
        .q-xulosa .dt-xq-m { display: block; font-size: 15px; }
        .q-xulosa .dt-xq-i { display: block; font-size: 13px; font-weight: 600; color: ${T.ink2}; margin-top: 8px; padding-top: 7px; border-top: 1px solid ${fon(T.ok, 0.25)}; }
        /* Uchuvchi nusxa (P3): ~0,6 s o'z joyiga */
        .dt-uchar { position: fixed; z-index: 1300; pointer-events: none; display: flex; flex-direction: column; gap: 3px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 2px solid ${T.ok}; box-shadow: 0 18px 36px -14px ${fon(T.ink, 0.35)}; transform-origin: left center; transition: transform .6s cubic-bezier(.45,.05,.3,1), opacity .6s ease; font-size: 14.5px; font-weight: 700; color: ${T.ink}; }
        .dt-uchar.bor { opacity: .9; }
        .dt-uchar span { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        /* DemoSahna */
        .dt-sahna { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .dt-sahna-q { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 16px; align-items: start; }
        .dt-sahna-q > .dt-yozuv { grid-column: 1 / -1; }
        .dt-sahna-q > .q-xulosa { align-self: start; margin: 0; animation: dt-kir .45s ease-out .2s both; }
        .dt-sahna.keng.yozuvli .dt-sahna-q { grid-template-columns: 170px minmax(0,1.05fr) minmax(0,1fr); gap: 20px; }
        .dt-sahna.keng.yozuvli .dt-sahna-q > .dt-yozuv { grid-column: auto; }
        .dt-dev { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .dt-yl { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; white-space: nowrap; }
        .dt-ramka-y { align-self: flex-start; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .dt-k-maket { display: flex; flex-direction: column; gap: 8px; }
        .dt-tel { width: 170px; height: 272px; border-radius: 26px; background: #1E1B26; padding: 9px; box-shadow: 0 14px 30px -14px rgba(${T.shadowBase},0.5); display: flex; flex: none; }
        .dt-tel-ekran { position: relative; flex: 1; min-width: 0; background: ${T.paper}; border-radius: 18px; padding: 8px 11px 11px; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
        .dt-tel-hol { height: 13px; display: flex; justify-content: flex-end; color: ${T.ink}; }
        .dt-samolyot { animation: dt-kir .3s ease-out both; }
        .dt-tel-nom { font-size: 13px; }
        .dt-ul { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 700; color: ${T.ok}; animation: dt-kir .3s ease-out both; }
        .dt-ul i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
        .dt-ul.ulanmoqda { color: ${T.ink2}; } .dt-ul.ulanmoqda i { animation: dt-mil 1s ease-in-out infinite; }
        .dt-ul.ulanmagan { color: ${T.err}; }
        .dt-tel-vaqt { margin-top: 6px; font-size: 14.5px; color: ${T.ink}; }
        .dt-tel-joy { font-size: 12px; color: ${T.ink2}; }
        .dt-tel-sq { margin-top: 6px; align-self: flex-start; border-radius: 8px; padding: 0 4px; }
        .dt-tel-sq.kutish { outline: 2px dashed ${T.accent}; outline-offset: 2px; }
        .dt-tel-son { font-family: 'JetBrains Mono', monospace; font-size: 25px; font-weight: 800; color: ${T.ink}; white-space: nowrap; display: inline-block; }
        .dt-tel-son.yangi { color: ${MJ_RANG}; animation: dt-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .dt-tel-doira { display: flex; gap: 3px; flex-wrap: wrap; margin-top: 2px; }
        .dt-tel-doira i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
        .dt-tel-doira i.bor { background: ${MJ_RANG}; }
        .dt-hozir { display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 11.5px; font-weight: 700; color: ${T.ink}; animation: dt-kir .35s ease-out both; }
        .dt-hozir i { width: 7px; height: 7px; border-radius: 50%; background: ${MJ_RANG}; }
        .dt-tel-tugma { margin-top: auto; text-align: center; font-size: 12.5px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border-radius: 10px; padding: 8px 6px; }
        .dt-lap { position: relative; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; box-shadow: 0 14px 30px -18px rgba(${T.shadowBase},0.45); overflow: hidden; min-width: 0; }
        .dt-lap-bar { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .dt-lap-n { display: flex; gap: 4px; } .dt-lap-n i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .dt-lap-url { flex: 1; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 3px 8px; overflow-wrap: anywhere; }
        .dt-wifi { color: ${T.ink2}; flex: none; } .dt-wifi.kesik { color: ${T.err}; }
        .dt-lap-ekran { position: relative; padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 8px; min-height: 160px; }
        .dt-lap.xira .dt-lap-ekran > :not(.dt-savol) { opacity: .28; filter: blur(1px); }
        .dt-lap-h { display: flex; align-items: baseline; gap: 10px; font-size: 14px; }
        .dt-lap-h b { font-size: 15px; color: ${T.ink}; }
        .dt-elon { position: relative; display: flex; flex-direction: column; gap: 3px; padding: 11px 13px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; transition: border-color .3s; }
        .dt-elon.kutish { border: 2px dashed ${T.accent}; }
        .dt-elon-y { align-self: flex-start; font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 8px; margin-bottom: 3px; animation: dt-kir .35s ease-out both; }
        .dt-elon-v { font-size: 15px; color: ${T.ink}; }
        .dt-elon-j { font-size: 14px; color: ${T.ink2}; }
        .dt-elon-q { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .dt-elon-son { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: ${T.ink}; white-space: nowrap; display: inline-block; }
        .dt-elon-son.yangi { color: ${MJ_RANG}; animation: dt-pop .5s cubic-bezier(.3,1.5,.5,1); }
        .dt-bosh-joy { display: inline-block; width: 64px; height: 24px; border-radius: 6px; border: 1.5px dashed ${T.line}; }
        .dt-lap-tugma { position: relative; display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 800; color: #fff; background: ${MJ_RANG}; border: 2px solid ${MJ_RANG}; border-radius: 10px; padding: 7px 14px; white-space: nowrap; transition: background .3s, color .3s; }
        .dt-lap-tugma.bosildi { background: ${T.paper}; color: ${MJ_RANG}; }
        .dt-lap-tugma i { font-style: normal; }
        .dt-ikki { position: absolute; right: -6px; top: -8px; display: flex; gap: 3px; }
        .dt-ikki i { width: 12px; height: 12px; border-radius: 50%; border: 2px solid ${T.accent}; background: ${fon(T.accent, 0.15)}; animation: dt-puls 1.2s ease-out infinite; }
        .dt-ikki i + i { animation-delay: .18s; }
        .dt-savol { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
        .dt-savol b { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: ${T.accent}; background: ${T.paper}; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.4); }
        .dt-savol em { font-style: normal; font-size: 13px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 2px 8px; }
        .dt-video { display: flex; flex-direction: column; gap: 8px; }
        .dt-video-k { display: flex; align-items: center; justify-content: center; gap: 10px; height: 92px; border-radius: 10px; background: #1E1B26; color: #fff; font-size: 14px; font-weight: 700; }
        .dt-video-play { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .dt-video-ch { height: 6px; border-radius: 3px; background: ${T.line}; overflow: hidden; }
        .dt-video-ch i { display: block; height: 100%; width: 0; background: ${T.accent}; animation: dt-yur 6s linear .4s forwards; }
        .dt-video-v { align-self: flex-end; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .dt-pufak { align-self: flex-start; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 4px 12px 12px 12px; padding: 8px 11px; }
        /* Ssenariy chizig'i + taymer */
        .dt-ss { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .dt-ss-q { display: flex; flex-wrap: wrap; gap: 6px; }
        .dt-ss-q > .dt-qadam { flex: 1 1 auto; }
        .zoomable:not(.zoom-on) > .dt-sahna > :first-child, .zoomable:not(.zoom-on) > .dt-r-ong > .dt-sahna > :first-child, .zoomable:not(.zoom-on) > .q-blok-natija > .dt-an > :first-child { padding-right: 40px; }
        .dt-qadam { position: relative; display: flex; align-items: center; gap: 6px; padding: 7px 8px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 13.5px; font-weight: 700; line-height: 1.25; color: ${T.ink2}; min-width: 0; transition: border-color .3s, color .3s, background .3s; }
        .dt-qadam > i { flex: none; width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 11.5px; font-weight: 800; background: ${T.bg}; color: ${T.ink2}; }
        .dt-qadam.ok { color: ${T.ink}; border-color: ${fon(T.ok, 0.5)}; } .dt-qadam.ok > i { background: ${T.ok}; color: #fff; }
        .dt-qadam.joriy { border-color: ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; } .dt-qadam.joriy > i { background: ${T.accent}; color: #fff; }
        .dt-qadam.yon { animation: dt-yon 1s ease-out; border-color: ${T.accent}; }
        .dt-qadam-b { position: absolute; top: -9px; right: -6px; width: 22px; height: 22px; border-radius: 50%; background: ${T.ok}; color: #fff; font-style: normal; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; animation: dt-pop .45s ease-out; }
        .dt-ss-yl { display: flex; flex-wrap: wrap; gap: 6px; }
        .dt-ss-y { font-size: 13px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; animation: dt-kir .35s ease-out both; }
        .dt-tm { display: flex; align-items: center; gap: 10px; }
        .dt-tm-ch { flex: 1; height: 7px; border-radius: 4px; background: ${T.bg}; border: 1px solid ${T.line}; overflow: hidden; }
        .dt-tm-ch i { display: block; height: 100%; width: 0; background: ${T.accent}; }
        .dt-tm.toliq .dt-tm-ch i { width: 100%; }
        .dt-tm.yur .dt-tm-ch i { animation: dt-yur 10s linear both; }
        .dt-tm-y { flex: none; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        /* Buzish yozuvi kartasi */
        .dt-yozuv { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; padding: 12px 14px; min-width: 0; }
        .dt-yz-yl { align-self: flex-start; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 9px; }
        .dt-yz-u { display: flex; flex-direction: column; gap: 5px; padding: 6px 8px; border-radius: 10px; }
        .dt-yz-u + .dt-yz-u { border-top: 1px solid ${T.line}; border-radius: 0 0 10px 10px; padding-top: 9px; }
        .dt-yz-u.yon { animation: dt-yashil 1.1s ease-out; }
        .dt-yz-nom { font-size: 14px; color: ${T.ink}; }
        .dt-yz-q { display: grid; grid-template-columns: 104px minmax(0,1fr); gap: 8px; align-items: baseline; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .dt-yz-q em { font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .dt-yz-m { min-width: 0; overflow-wrap: anywhere; }
        .dt-yz-uya { display: block; height: 22px; border-radius: 6px; border: 1.5px dashed ${T.line}; }
        .dt-yozuv.kutish .dt-yz-q.kutdim .dt-yz-uya, .dt-yozuv.kutish .dt-yz-q.kutdim .dt-yz-m { border: 1.5px dashed ${T.accent}; border-radius: 8px; padding: 4px 8px; }
        .dt-yozuv.kutish .dt-yz-q.kutdim .dt-yz-uya { height: 28px; padding: 0; }
        .dt-yz-b { align-self: flex-start; font-size: 12.5px; font-weight: 800; border-radius: 6px; padding: 3px 9px; }
        .dt-yz-b.bosh { color: ${T.ink2}; border: 1.5px dashed ${T.line}; font-weight: 600; }
        .dt-qq .dt-qq-joy { align-self: flex-start; font-size: 13px; font-weight: 700; color: ${T.accent}; border: 2px dashed ${T.accent}; border-radius: 8px; padding: 6px 12px; animation: dt-puls 1.8s ease-out .3s 2; }
        /* 0, 1-ekran */
        .dt-reja { display: flex; flex-direction: column; gap: 10px; }
        p.dt-pastki { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.ink2}; }
        /* 2-ekran: savol kartasi */
        .dt-sk { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); animation: dt-kir .4s ease-out both; transition: background .25s; }
        .dt-sk.err { background: ${T.errFon}; } .dt-sk.silk { animation: dt-silk .45s ease-out; }
        .dt-sk.uch { opacity: .25; }
        .dt-sk-m { font-size: 17px; line-height: 1.35; color: ${T.ink}; }
        .dt-sk-tug { display: flex; flex-wrap: wrap; gap: 8px; }
        .dt-v { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14.5px; line-height: 1.35; text-align: left; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}; animation: dt-chorla 1.8s ease-out .5s 2; transition: background .2s; }
        .dt-v:nth-child(2) { animation-delay: .75s; } .dt-v:nth-child(3) { animation-delay: 1s; }
        .dt-v:hover:not(:disabled) { background: ${T.accentSoft}; }
        .dt-v:disabled { cursor: default; animation: none; box-shadow: inset 0 0 0 1.5px ${T.line}; color: ${T.ink2}; }
        .dt-v.err { background: ${T.errFon}; box-shadow: inset 0 0 0 1.5px ${T.err}; }
        .dt-v.silk { animation: dt-silk .45s ease-out; }
        .dt-v.ok, .dt-v.ok:disabled { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .dt-sk-ro { display: flex; flex-direction: column; gap: 5px; }
        .dt-sk-ix { display: flex; align-items: baseline; gap: 7px; font-size: 13.5px; color: ${T.ink2}; animation: dt-kir .3s ease-out both; }
        .dt-sk-ix i { font-style: normal; font-weight: 800; color: ${T.ok}; } .dt-sk-ix b { color: ${T.ink}; }
        /* 4-ekran: risk kartasi */
        .dt-rk { display: flex; flex-direction: column; gap: 8px; padding: 16px 18px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); animation: dt-kir .4s ease-out both; }
        .dt-rk-h { font-size: 17px; line-height: 1.35; color: ${T.ink}; }
        .dt-rk-nom { align-self: flex-start; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 9px; }
        .dt-rk-v { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
        .dt-v-k { width: 100%; }
        .dt-r-ong { display: flex; flex-direction: column; gap: 12px; }
        /* 5-ekran: mustaqil ish */
        .q-mustaqil:has(.dt-m5), .q-mustaqil:has(.dt-fokus) { max-width: none; }
        .dt-m5-bosh { display: flex; flex-direction: column; gap: 8px; }
        .dt-strip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .dt-strip .q-chip.dt-tab { padding: 6px 11px; font-size: 13.5px; }
        .dt-strip .q-chip.dt-tab i { font-style: normal; font-weight: 800; margin-right: 6px; color: ${T.accent}; }
        .dt-strip .q-chip.dt-tab.ok i { color: ${T.ok}; }
        .dt-m5 { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap: 20px; align-items: start; }
        .dt-m5-chap { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .dt-m5.tayyor { grid-template-columns: minmax(0,1fr); gap: 10px; }
        .dt-ix-bir { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .dt-ix-bir .dt-md-t { width: auto; padding: 0 9px; }
        @media (min-width: 761px) { .dt-m5.tayyor .dt-yz-u { display: grid; grid-template-columns: 150px minmax(0,1.2fr) minmax(0,1fr); gap: 12px; align-items: start; } .dt-m5.tayyor .dt-yz-q { grid-template-columns: minmax(0,1fr); gap: 2px; } .dt-m5.tayyor .dt-yz-u + .dt-yz-u { padding-top: 8px; } }
        .dt-ix-ro { display: flex; flex-direction: column; gap: 6px; }
        .dt-ix-q { display: flex; align-items: baseline; gap: 6px; width: 100%; text-align: left; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 7px 10px; cursor: pointer; white-space: nowrap; overflow: hidden; animation: dt-kir .3s ease-out both; }
        .dt-ix-q > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: ${T.ink2}; }
        .dt-ix-q i { font-style: normal; color: ${T.ok}; font-weight: 800; } .dt-ix-q em { margin-left: auto; font-style: normal; color: ${T.accent}; }
        .dt-ix-q b.buz { color: ${T.err}; } .dt-ix-q b.ok { color: ${T.ink2}; }
        .dt-ix-butun { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; font-size: 14px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 5px 12px; }
        .dt-ix-butun i { font-style: normal; }
        .dt-karta { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); animation: dt-kir .4s ease-out both; }
        .dt-karta.uch { opacity: 0; transform: translateY(-14px); transition: opacity .35s, transform .35s; }
        .dt-karta.err { box-shadow: inset 0 0 0 1.5px ${T.err}, 0 10px 26px -10px rgba(${T.shadowBase},0.22); }
        .dt-maydon { position: relative; display: block; }
        .dt-maydon-n { position: absolute; left: 12px; top: 8px; font-style: normal; font-size: 12px; font-weight: 800; color: ${T.accent}; pointer-events: none; }
        textarea.dt-inp, input.dt-inp { display: block; width: 100%; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 27px 12px 9px; outline: none; resize: vertical; }
        input.dt-inp.bir { resize: none; }
        textarea.dt-inp:focus, input.dt-inp:focus { border-color: ${T.accent}; }
        textarea.dt-inp.err, input.dt-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .dt-maydon.chorla .dt-inp { border-color: ${fon(T.accent, 0.6)}; animation: dt-chorla 1.8s ease-out .4s 2; }
        p.dt-yana { margin: 0; font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        .dt-yordam { background: ${T.bg}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .dt-yordam p { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; } .dt-yordam p + p { font-size: 13px; color: ${T.ink2}; }
        .dt-karta-tug { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .dt-karta-tug .dt-o { margin-left: auto; }
        .dt-fokus { display: flex; flex-direction: column; gap: 12px; }
        /* Amaliyot bloklari */
        .dt-blok { display: contents; }
        .dt-blok.qulf .q-blok-q.joriy .q-blok-tana > .q-btn { opacity: .45; pointer-events: none; }
        .dt-blok.tugadi .q-blok-qadamlar { display: none; }
        .dt-art { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13px; }
        .dt-art b { font-size: 12.5px; color: ${T.ink2}; margin-right: 4px; }
        .dt-art-u { border-radius: 999px; padding: 3px 10px; background: ${T.paper}; border: 1px solid ${T.line}; color: ${T.ink2}; font-weight: 700; }
        .dt-art-u.buz { color: ${T.err}; border-color: ${fon(T.err, 0.45)}; } .dt-art-u.ok { color: ${T.ok}; border-color: ${fon(T.ok, 0.45)}; }
        .dt-prompt, .dt-ps, .dt-joylar, .dt-joy-m, .dt-yordam-ust, .dt-yordam-o, .dt-yordam-s, .dt-ur, .dt-ur-ro, .dt-ur-h, .dt-ur-yo, .dt-belgilar, .dt-trek, .dt-otk, .dt-otk-ss, .dt-a2ss, .dt-blk { display: block; }
        .dt-prompt { margin-top: 8px; }
        .q-blok-t .qcode, .dt-yordam-o .qcode, .dt-ps .qcode { white-space: normal; overflow-wrap: anywhere; }
        .dt-ps { margin: 0; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; overflow-wrap: anywhere; }
        .dt-ps + .dt-ps { margin-top: 4px; }
        .dt-joylar { margin-top: 8px; } .dt-joylar > * + * { margin-top: 6px; }
        .dt-joy-m { display: flex !important; flex-wrap: wrap; align-items: center; gap: 8px; padding: 0 0 0 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; }
        .dt-joy-m:focus-within { border-color: ${T.accent}; }
        .dt-joy-n { flex: none; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.accent}; }
        .dt-joy-m input { flex: 1; min-width: 160px; border: 0; outline: 0; background: transparent; font-family: 'Manrope', sans-serif; font-size: 14.5px; padding: 10px 10px 10px 0; color: ${T.ink}; }
        .dt-yordam-ust { margin-top: 8px; } .dt-yordam-ust .q-btn { margin-left: 0; }
        .dt-yordam-o { margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; font-size: 13px; line-height: 1.5; color: ${T.ink}; }
        .dt-yordam-o b { display: block; margin-bottom: 4px; font-size: 12.5px; color: ${T.ink2}; }
        .dt-yordam-s + .dt-yordam-s { margin-top: 4px; }
        .dt-ur { margin-top: 8px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; animation: dt-kir .35s ease-out both; }
        .dt-ur.err { border-color: ${T.err}; }
        .dt-ur > * + * { margin-top: 8px; }
        .dt-ur-h { font-size: 15px; font-weight: 800; color: ${T.ink}; }
        .dt-ur-yo { font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .dt-ur-ro { margin-top: 8px; } .dt-ur-ro > * + * { margin-top: 6px; }
        .dt-belgilar { margin-top: 8px; } .dt-belgilar > * { margin: 0 8px 6px 0; }
        .dt-qayta b { display: block; font-size: 14px; margin-bottom: 6px; }
        .dt-belgi { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 800; border-radius: 10px; padding: 8px 14px; cursor: pointer; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${fon(T.accent, 0.55)}; transition: background .2s, color .2s, border-color .2s; }
        .dt-belgi:hover { border-color: ${T.accent}; }
        .dt-belgi.buz.on { background: ${T.errFon}; color: ${T.err}; border-color: ${T.err}; }
        .dt-belgi.ok.on { background: ${T.okFon}; color: ${T.ok}; border-color: ${T.ok}; }
        .dt-belgi.tuz.on { background: ${T.accentSoft}; color: ${T.accent}; border-color: ${T.accent}; }
        .dt-trek { margin-top: 8px; } .dt-trek .q-chip + .q-chip { margin-left: 6px; }
        .dt-saqla { margin-top: 8px; }
        .dt-otk { margin-top: 8px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .dt-otk > * + * { margin-top: 8px; }
        .dt-otk-ss, .dt-a2ss .dt-otk-ss { display: flex !important; flex-wrap: wrap; gap: 6px; }
        .dt-otk-ss > .dt-qadam { flex: 1 1 auto; }
        .dt-a2ss { margin-top: 8px; }
        button.dt-otq { font-family: 'Manrope', sans-serif; text-align: left; cursor: pointer; }
        button.dt-otq:not(.ok) { border-color: ${fon(T.accent, 0.45)}; color: ${T.ink}; }
        .dt-taymer { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 7px 12px; cursor: pointer; }
        .dt-taymer i { font-style: normal; color: ${T.accent}; }
        .dt-taymer b { font-family: 'JetBrains Mono', monospace; font-size: 15px; }
        .dt-taymer.on { background: ${T.accentSoft}; }
        .dt-an { display: flex; flex-direction: column; gap: 12px; }
        .dt-dev-lap { min-width: 0; }
        .dt-nusxa { white-space: nowrap; }
        .dt-test-viz { margin-top: 2px; display: flex; justify-content: center; }
        .dt-video-y { letter-spacing: .01em; }
        .dt-vtan { margin-top: 10px; }
        .dt-yordam-btn { align-self: flex-start; }
        .dt-rk.hal .dt-rk-v { opacity: .9; }
        .dt-bash.ix .q-bashorat { padding-top: 8px; padding-bottom: 8px; }
        .dt-sahna.ixcham .dt-lap-ekran { min-height: 0; }
        .dt-md { display: flex; flex-direction: column; gap: 6px; }
        .dt-md-tab { display: flex; align-items: center; gap: 6px; }
        .dt-md-tab em { margin-left: auto; font-style: normal; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }
        .dt-md-t { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.ink2}; cursor: pointer; }
        .dt-md-t.on { border-color: ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; }
        .dt-fayl { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 12px 14px; }
        .dt-fayl-n { display: flex; align-items: center; gap: 8px; } .dt-fayl-n em { margin-left: auto; font-style: normal; font-size: 12.5px; }
        .dt-fayl-h { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${T.ink}; }
        .dt-fayl-q { font-size: 14px; line-height: 1.5; color: ${T.ink}; overflow-wrap: anywhere; }
        .dt-fayl-q.bosh { display: grid; grid-template-columns: auto minmax(60px,1fr); gap: 8px; align-items: center; }
        .dt-fayl-q.bosh em { font-style: normal; font-size: 13px; font-weight: 700; color: ${T.ink2}; }
        .dt-oq { display: flex; flex-direction: column; gap: 6px; }
        .dt-oq-q { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap: 10px; align-items: center; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; font-size: 14px; }
        .dt-oq-q em { font-style: normal; font-weight: 800; }
        .dt-oq-q.ok { border-color: ${fon(T.ok, 0.5)}; } .dt-oq-q.ok em { color: ${T.ok}; }
        .dt-oq-q.err { border-color: ${fon(T.err, 0.5)}; } .dt-oq-q.err em { color: ${T.err}; }
        p.dt-ortda, p.dt-ulgur { margin: 0; font-size: 13px; line-height: 1.6; color: ${T.ink2}; }
        p.dt-ulgur { padding: 6px 10px; border-radius: 10px; background: ${T.paper}; }
        /* 3-ekran test vizuali — kitob ilovasi */
        .dt-tel.kichik { width: 150px; height: 220px; }
        .dt-kt-hisob { align-self: flex-start; margin-top: 6px; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 7px; }
        .dt-kt-h { margin-top: 8px; font-size: 14px; color: ${T.ink}; }
        .dt-kt-bosh { flex: 1; margin-top: 6px; border-radius: 10px; border: 1.5px dashed ${T.line}; }
        .dt-kt-y { margin-top: 8px; align-self: center; font-size: 12.5px; font-weight: 800; color: ${T.accent}; }
        /* Kartochka — neytral (P10) */
        .dt-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${fon(T.accent, 0.45)}; animation: dt-puls 1.8s ease-out .4s 3; }
        .dt-flash .fc-back { background: ${T.ink}; color: #fff; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.55); }
        .dt-flash .fc-front { box-shadow: 0 14px 34px -20px rgba(${T.shadowBase},0.35); }
        p.dt-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13.5px; font-weight: 700; color: ${T.ink2}; }
        p.dt-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        /* Yakun */
        .dt-yakun.belgisiz .done-chip .tick { display: none; }
        .dt-hw { display: flex; flex-direction: column; gap: 12px; }
        .dt-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .dt-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .dt-hw-k { font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .dt-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.dt-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .dt-hw-qadam li { display: flex; gap: 8px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        .dt-hw-qadam li > i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .dt-hw-kul { font-size: 13px; color: ${T.ink2}; }
        .dt-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }
        @media (max-width: 760px) { .dt-m5 { grid-template-columns: 1fr; } .dt-sahna-q > .q-xulosa { grid-column: 1 / -1; } .dt-sahna.keng.yozuvli .dt-sahna-q { grid-template-columns: 170px minmax(0,1fr); } .dt-sahna.keng.yozuvli .dt-sahna-q > .dt-yozuv { grid-column: 1 / -1; } }
        @media (max-width: 560px) { .dt-sahna-q, .dt-sahna.keng.yozuvli .dt-sahna-q { grid-template-columns: minmax(0,1fr); } .dt-sahna-q .dt-dev:first-child { align-items: center; }  .dt-hw-karta { grid-template-columns: 1fr; } .dt-yz-q { grid-template-columns: 1fr; gap: 2px; } }
        @media (prefers-reduced-motion: reduce) {
          .dt-halqa, .btn-white-accent.ip-halqa, .dt-k.kutish .q-variant, .q-bashorat .q-chip, .dt-v, .dt-sk, .dt-rk, .dt-karta, .dt-ur, .dt-ix-q, .dt-qadam, .dt-qadam-b, .dt-ss-y, .dt-tm-ch i, .dt-ul, .dt-ul i, .dt-samolyot, .dt-hozir, .dt-tel-son, .dt-elon-son, .dt-elon-y, .dt-ikki i, .dt-yz-u, .dt-qq-joy, .dt-maydon .dt-inp, .dt-video-ch i, .dt-flash .fc-front, .dt-uchar, .dt-lap-tugma { animation: none !important; transition: none !important; }
          .dt-video-ch i { width: 100%; }
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
